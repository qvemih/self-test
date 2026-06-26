const adminController = require("../controllers/admin-controller");

const routes = [
  ["GET", /^\/api\/admin\/session$/, adminController.session],
  ["POST", /^\/api\/admin\/login$/, adminController.login],
  ["POST", /^\/api\/admin\/logout$/, adminController.logout],
  ["GET", /^\/api\/admin\/dashboard$/, adminController.dashboard],
  ["GET", /^\/api\/admin\/site-settings$/, adminController.siteSettings],
  ["PUT", /^\/api\/admin\/site-settings$/, adminController.siteSettings],
  ["GET", /^\/api\/admin\/pages$/, adminController.pages],
  ["PUT", /^\/api\/admin\/pages\/(?<slug>[^/]+)$/, adminController.pages],
  ["GET", /^\/api\/admin\/page-sections$/, adminController.pageSections],
  ["POST", /^\/api\/admin\/page-sections$/, adminController.pageSections],
  ["PUT", /^\/api\/admin\/page-sections\/(?<id>\d+)$/, adminController.pageSections],
  ["DELETE", /^\/api\/admin\/page-sections\/(?<id>\d+)$/, adminController.pageSections],
  ["GET", /^\/api\/admin\/home-slides$/, adminController.homeSlides],
  ["POST", /^\/api\/admin\/home-slides$/, adminController.homeSlides],
  ["PUT", /^\/api\/admin\/home-slides\/(?<id>\d+)$/, adminController.homeSlides],
  ["DELETE", /^\/api\/admin\/home-slides\/(?<id>\d+)$/, adminController.homeSlides],
  ["GET", /^\/api\/admin\/navigation-items$/, adminController.navigationItems],
  ["POST", /^\/api\/admin\/navigation-items$/, adminController.navigationItems],
  ["PUT", /^\/api\/admin\/navigation-items\/(?<id>\d+)$/, adminController.navigationItems],
  ["DELETE", /^\/api\/admin\/navigation-items\/(?<id>\d+)$/, adminController.navigationItems],
  ["GET", /^\/api\/admin\/product-categories$/, adminController.productCategories],
  ["POST", /^\/api\/admin\/product-categories$/, adminController.productCategories],
  ["PUT", /^\/api\/admin\/product-categories\/(?<id>\d+)$/, adminController.productCategories],
  ["DELETE", /^\/api\/admin\/product-categories\/(?<id>\d+)$/, adminController.productCategories],
  ["GET", /^\/api\/admin\/products$/, adminController.products],
  ["POST", /^\/api\/admin\/products$/, adminController.products],
  ["PUT", /^\/api\/admin\/products\/(?<id>\d+)$/, adminController.products],
  ["DELETE", /^\/api\/admin\/products\/(?<id>\d+)$/, adminController.products],
  ["GET", /^\/api\/admin\/quality-report-groups$/, adminController.reportGroups],
  ["POST", /^\/api\/admin\/quality-report-groups$/, adminController.reportGroups],
  ["PUT", /^\/api\/admin\/quality-report-groups\/(?<id>\d+)$/, adminController.reportGroups],
  ["DELETE", /^\/api\/admin\/quality-report-groups\/(?<id>\d+)$/, adminController.reportGroups],
  ["GET", /^\/api\/admin\/quality-report-images$/, adminController.reportImages],
  ["POST", /^\/api\/admin\/quality-report-images$/, adminController.reportImages],
  ["PUT", /^\/api\/admin\/quality-report-images\/(?<id>\d+)$/, adminController.reportImages],
  ["DELETE", /^\/api\/admin\/quality-report-images\/(?<id>\d+)$/, adminController.reportImages],
  ["GET", /^\/api\/admin\/messages$/, adminController.messages],
  ["PUT", /^\/api\/admin\/messages\/(?<id>\d+)$/, adminController.messages],
  ["DELETE", /^\/api\/admin\/messages\/(?<id>\d+)$/, adminController.messages],
  ["GET", /^\/api\/admin\/media-files$/, adminController.mediaFiles],
  ["POST", /^\/api\/admin\/media-files$/, adminController.mediaFiles],
  ["DELETE", /^\/api\/admin\/media-files\/(?<id>\d+)$/, adminController.mediaFiles]
];

function matchAdminRoute(method, pathname) {
  for (const [routeMethod, pattern, handler] of routes) {
    const match = pattern.exec(pathname);
    if (routeMethod === method && match) return { handler, params: match.groups || {} };
  }
  return null;
}

module.exports = {
  matchAdminRoute
};
