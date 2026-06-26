const adminService = require("../../backend/services/admin-service");
const contentService = require("../../backend/services/content-service");
const { createSession, clearSession, getSessionUser, requireAdmin } = require("../../backend/middleware/auth");
const { readJson, readRequestBody, parseMultipart, sendJson } = require("../../backend/utils/http");
const { requireAnyField, requireFields, requireNumberFields } = require("../validators/admin-validators");

async function session(req, res) {
  sendJson(res, 200, { user: getSessionUser(req) });
}

async function login(req, res) {
  const payload = await readJson(req);
  requireFields(payload, ["username", "password"]);
  const user = adminService.authenticateAdmin(payload.username, payload.password);
  if (!user) return sendJson(res, 401, { message: "账号或密码错误。" });
  createSession(res, user);
  sendJson(res, 200, { user });
}

async function logout(req, res) {
  clearSession(req, res);
  sendJson(res, 200, { ok: true });
}

async function dashboard(req, res) {
  requireAdmin(req);
  sendJson(res, 200, adminService.getDashboardData());
}

async function siteSettings(req, res) {
  requireAdmin(req);
  if (req.method === "GET") return sendJson(res, 200, contentService.getSiteSettings());
  const payload = await readJson(req);
  requireFields(payload, ["site_name", "company_name"]);
  sendJson(res, 200, adminService.updateSiteSettings(payload));
}

async function navigationItems(req, res, params) {
  requireAdmin(req);
  if (req.method === "GET") return sendJson(res, 200, contentService.getNavigationItems({ includeHidden: true }));
  if (req.method === "POST") {
    const payload = await readJson(req);
    requireFields(payload, ["label", "path", "sort_order"]);
    requireNumberFields(payload, ["sort_order"]);
    return sendJson(res, 201, adminService.createNavigationItem(payload));
  }
  if (req.method === "PUT") return sendJson(res, 200, adminService.updateNavigationItem(params.id, await readJson(req)));
  if (req.method === "DELETE") return sendJson(res, 200, adminService.deleteRow("navigation_items", params.id));
}

async function pages(req, res, params) {
  requireAdmin(req);
  if (req.method === "GET") return sendJson(res, 200, adminService.listPages());
  if (req.method === "PUT") return sendJson(res, 200, adminService.updatePage(params.slug, await readJson(req)));
}

async function pageSections(req, res, params) {
  requireAdmin(req);
  if (req.method === "GET") return sendJson(res, 200, adminService.listPageSections());
  if (req.method === "POST") {
    const payload = await readJson(req);
    requireFields(payload, ["page_id"]);
    requireAnyField(payload, ["section_key", "title", "subtitle", "body", "image_id"], "请至少填写模块标识、模块标题、副标题、正文或配图中的一项。");
    if (payload.sort_order !== undefined && payload.sort_order !== null && String(payload.sort_order).trim() !== "") {
      requireNumberFields(payload, ["sort_order"]);
    }
    return sendJson(res, 201, adminService.createPageSection(payload));
  }
  if (req.method === "PUT") {
    const payload = await readJson(req);
    requireFields(payload, ["page_id"]);
    requireAnyField(payload, ["section_key", "title", "subtitle", "body", "image_id"], "请至少填写模块标识、模块标题、副标题、正文或配图中的一项。");
    if (payload.sort_order !== undefined && payload.sort_order !== null && String(payload.sort_order).trim() !== "") {
      requireNumberFields(payload, ["sort_order"]);
    }
    return sendJson(res, 200, adminService.updatePageSection(params.id, payload));
  }
  if (req.method === "DELETE") return sendJson(res, 200, adminService.deleteRow("page_sections", params.id));
}

async function homeSlides(req, res, params) {
  requireAdmin(req);
  if (req.method === "GET") return sendJson(res, 200, contentService.getHomeSlides({ includeHidden: true }));
  if (req.method === "POST") {
    const payload = await readJson(req);
    requireFields(payload, ["title"]);
    return sendJson(res, 201, adminService.createHomeSlide(payload));
  }
  if (req.method === "PUT") return sendJson(res, 200, adminService.updateHomeSlide(params.id, await readJson(req)));
  if (req.method === "DELETE") return sendJson(res, 200, adminService.deleteRow("home_slides", params.id));
}

async function productCategories(req, res, params) {
  requireAdmin(req);
  if (req.method === "GET") return sendJson(res, 200, contentService.getProductCategories({ includeHidden: true }));
  if (req.method === "POST") {
    const payload = await readJson(req);
    requireFields(payload, ["name", "slug"]);
    return sendJson(res, 201, adminService.createProductCategory(payload));
  }
  if (req.method === "PUT") return sendJson(res, 200, adminService.updateProductCategory(params.id, await readJson(req)));
  if (req.method === "DELETE") return sendJson(res, 200, adminService.deleteRow("product_categories", params.id));
}

async function products(req, res, params, query) {
  requireAdmin(req);
  if (req.method === "GET") return sendJson(res, 200, contentService.getProducts({ category: query.get("category"), includeHidden: true }));
  if (req.method === "POST") {
    const payload = await readJson(req);
    requireFields(payload, ["name"]);
    return sendJson(res, 201, adminService.createProduct(payload));
  }
  if (req.method === "PUT") return sendJson(res, 200, adminService.updateProduct(params.id, await readJson(req)));
  if (req.method === "DELETE") return sendJson(res, 200, adminService.deleteRow("products", params.id));
}

async function reportGroups(req, res, params) {
  requireAdmin(req);
  if (req.method === "GET") return sendJson(res, 200, contentService.getQualityReportGroups({ includeHidden: true }));
  if (req.method === "POST") {
    const payload = await readJson(req);
    requireFields(payload, ["title", "slug", "sort_order"]);
    requireNumberFields(payload, ["sort_order"]);
    return sendJson(res, 201, adminService.createReportGroup(payload));
  }
  if (req.method === "PUT") {
    const payload = await readJson(req);
    requireFields(payload, ["title", "slug", "sort_order"]);
    requireNumberFields(payload, ["sort_order"]);
    return sendJson(res, 200, adminService.updateReportGroup(params.id, payload));
  }
  if (req.method === "DELETE") return sendJson(res, 200, adminService.deleteRow("quality_report_groups", params.id));
}

async function reportImages(req, res, params) {
  requireAdmin(req);
  if (req.method === "GET") return sendJson(res, 200, adminService.listReportImages());
  if (req.method === "POST") {
    const payload = await readJson(req);
    requireFields(payload, ["group_id"]);
    return sendJson(res, 201, adminService.createReportImage(payload));
  }
  if (req.method === "PUT") return sendJson(res, 200, adminService.updateReportImage(params.id, await readJson(req)));
  if (req.method === "DELETE") return sendJson(res, 200, adminService.deleteRow("quality_report_images", params.id));
}

async function messages(req, res, params) {
  requireAdmin(req);
  if (req.method === "GET") return sendJson(res, 200, adminService.listMessages());
  if (req.method === "PUT") return sendJson(res, 200, adminService.updateMessage(params.id, await readJson(req)));
  if (req.method === "DELETE") return sendJson(res, 200, adminService.deleteRow("messages", params.id));
}

async function mediaFiles(req, res, params) {
  requireAdmin(req);
  if (req.method === "GET") return sendJson(res, 200, adminService.listMediaFiles());
  if (req.method === "POST") {
    const buffer = await readRequestBody(req);
    const parsed = parseMultipart(buffer, req.headers["content-type"]);
    if (!parsed.files.length) return sendJson(res, 400, { message: "请选择要上传的图片。" });
    return sendJson(res, 201, adminService.createMediaFile(parsed.files[0], parsed.fields));
  }
  if (req.method === "DELETE") return sendJson(res, 200, adminService.deleteMediaFile(params.id));
}

module.exports = {
  session,
  login,
  logout,
  dashboard,
  siteSettings,
  navigationItems,
  pages,
  pageSections,
  homeSlides,
  productCategories,
  products,
  reportGroups,
  reportImages,
  messages,
  mediaFiles
};
