const fs = require("node:fs");
const path = require("node:path");
const { normalizePathname } = require("./http");

const rootDir = path.resolve(__dirname, "../..");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

function safeJoin(baseDir, requestPath) {
  const resolved = path.resolve(baseDir, requestPath.replace(/^\/+/, ""));
  if (!resolved.startsWith(path.resolve(baseDir))) return null;
  return resolved;
}

function serveStatic(req, res, pathname) {
  let cleanPath = normalizePathname(pathname);
  if (cleanPath === "/message.html") cleanPath = "/contact.html";
  const candidates = [];

  if (cleanPath.startsWith("/admin/assets/")) {
    candidates.push(safeJoin(path.join(rootDir, "admin"), cleanPath.replace(/^\/admin\//, "")));
  } else if (cleanPath === "/admin/login" || cleanPath === "/admin/login.html") {
    candidates.push(path.join(rootDir, "admin/pages/login.html"));
  } else if (cleanPath.startsWith("/admin")) {
    candidates.push(path.join(rootDir, "admin/pages/dashboard.html"));
  } else if (cleanPath.startsWith("/frontend/assets/")) {
    candidates.push(safeJoin(rootDir, cleanPath));
  } else if (cleanPath.startsWith("/assets/")) {
    candidates.push(safeJoin(path.join(rootDir, "frontend"), cleanPath));
    candidates.push(safeJoin(rootDir, cleanPath));
  } else if (cleanPath.startsWith("/uploads/")) {
    candidates.push(safeJoin(rootDir, cleanPath));
  } else {
    candidates.push(safeJoin(path.join(rootDir, "frontend/pages"), cleanPath));
  }

  const filePath = candidates.find((candidate) => candidate && fs.existsSync(candidate) && fs.statSync(candidate).isFile());
  if (!filePath) return false;

  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, {
    "Content-Type": mimeTypes[ext] || "application/octet-stream"
  });
  fs.createReadStream(filePath).pipe(res);
  return true;
}

module.exports = {
  serveStatic
};
