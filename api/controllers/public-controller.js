const contentService = require("../../backend/services/content-service");
const { readJson, sendJson } = require("../../backend/utils/http");
const { validateMessage } = require("../validators/admin-validators");

async function siteSettings(req, res) {
  sendJson(res, 200, contentService.getSiteSettings());
}

async function navigationItems(req, res) {
  sendJson(res, 200, contentService.getNavigationItems());
}

async function page(req, res, params) {
  const data = contentService.getPageBySlug(params.slug);
  if (!data) return sendJson(res, 404, { message: "页面不存在或未发布。" });
  sendJson(res, 200, data);
}

async function homeSlides(req, res) {
  sendJson(res, 200, contentService.getHomeSlides());
}

async function productCategories(req, res) {
  sendJson(res, 200, contentService.getProductCategories());
}

async function products(req, res, params, query) {
  sendJson(res, 200, contentService.getProducts({ category: query.get("category") || "all" }));
}

async function qualityReportGroups(req, res) {
  sendJson(res, 200, contentService.getQualityReportGroups({ includeImages: true }));
}

async function qualityReportImages(req, res, params) {
  sendJson(res, 200, contentService.getQualityReportImages(Number(params.id)));
}

async function createMessage(req, res) {
  const payload = await readJson(req);
  validateMessage(payload);
  const message = contentService.createMessage({
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    wechat: (payload.wechat || "").trim(),
    product_interest: (payload.product_interest || payload.product || "").trim(),
    content: payload.content.trim()
  });
  sendJson(res, 201, { message: "留言提交成功。", data: message });
}

module.exports = {
  siteSettings,
  navigationItems,
  page,
  homeSlides,
  productCategories,
  products,
  qualityReportGroups,
  qualityReportImages,
  createMessage
};
