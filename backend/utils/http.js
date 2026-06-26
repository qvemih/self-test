const { StringDecoder } = require("node:string_decoder");

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body)
  });
  res.end(body);
}

function sendText(res, statusCode, text, contentType = "text/plain; charset=utf-8") {
  res.writeHead(statusCode, { "Content-Type": contentType });
  res.end(text);
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function readJson(req) {
  const buffer = await readRequestBody(req);
  if (!buffer.length) return {};
  return JSON.parse(buffer.toString("utf8"));
}

function parseCookies(req) {
  const header = req.headers.cookie || "";
  return Object.fromEntries(
    header.split(";").map((item) => item.trim()).filter(Boolean).map((item) => {
      const index = item.indexOf("=");
      return [decodeURIComponent(item.slice(0, index)), decodeURIComponent(item.slice(index + 1))];
    })
  );
}

function parseMultipart(buffer, contentType) {
  const boundaryMatch = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType || "");
  if (!boundaryMatch) return { fields: {}, files: [] };
  const boundary = Buffer.from(`--${boundaryMatch[1] || boundaryMatch[2]}`);
  const fields = {};
  const files = [];
  let cursor = 0;

  while (cursor < buffer.length) {
    const boundaryStart = buffer.indexOf(boundary, cursor);
    if (boundaryStart === -1) break;
    const partStart = boundaryStart + boundary.length + 2;
    const nextBoundary = buffer.indexOf(boundary, partStart);
    if (nextBoundary === -1) break;
    const part = buffer.subarray(partStart, nextBoundary - 2);
    const headerEnd = part.indexOf(Buffer.from("\r\n\r\n"));
    if (headerEnd !== -1) {
      const headerText = part.subarray(0, headerEnd).toString("utf8");
      const content = part.subarray(headerEnd + 4);
      const nameMatch = /name="([^"]+)"/.exec(headerText);
      const filenameMatch = /filename="([^"]*)"/.exec(headerText);
      const typeMatch = /Content-Type:\s*([^\r\n]+)/i.exec(headerText);
      if (nameMatch && filenameMatch && filenameMatch[1]) {
        files.push({
          fieldName: nameMatch[1],
          filename: filenameMatch[1],
          mimeType: typeMatch ? typeMatch[1].trim() : "application/octet-stream",
          data: content
        });
      } else if (nameMatch) {
        const decoder = new StringDecoder("utf8");
        fields[nameMatch[1]] = decoder.write(content);
      }
    }
    cursor = nextBoundary;
  }

  return { fields, files };
}

function normalizePathname(pathname) {
  if (pathname === "/") return "/index.html";
  return pathname;
}

module.exports = {
  sendJson,
  sendText,
  readRequestBody,
  readJson,
  parseCookies,
  parseMultipart,
  normalizePathname
};
