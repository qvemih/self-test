const http = require("node:http");
const { URL } = require("node:url");
const { getDatabase } = require("./repositories/database");
const { sendJson, sendText } = require("./utils/http");
const { serveStatic } = require("./utils/static-files");
const { matchPublicRoute } = require("../api/routes/public-routes");
const { matchAdminRoute } = require("../api/routes/admin-routes");

const port = Number(process.env.PORT || 4173);

getDatabase();

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "127.0.0.1"}`);
  const pathname = decodeURIComponent(url.pathname);

  try {
    const adminRoute = matchAdminRoute(req.method, pathname);
    if (adminRoute) {
      return await adminRoute.handler(req, res, adminRoute.params, url.searchParams);
    }

    const publicRoute = matchPublicRoute(req.method, pathname);
    if (publicRoute) {
      return await publicRoute.handler(req, res, publicRoute.params, url.searchParams);
    }

    if (req.method === "GET" && serveStatic(req, res, pathname)) return;

    if (pathname.startsWith("/api/")) return sendJson(res, 404, { message: "接口不存在。" });
    return sendText(res, 404, "页面不存在。");
  } catch (error) {
    const statusCode = error.statusCode || 500;
    sendJson(res, statusCode, {
      message: error.message || "服务器错误。"
    });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Zisha site running at http://127.0.0.1:${port}/`);
  console.log(`Admin running at http://127.0.0.1:${port}/admin`);
});
