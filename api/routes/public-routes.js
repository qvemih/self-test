const publicController = require("../controllers/public-controller");

const routes = [
  ["GET", /^\/api\/site-settings$/, publicController.siteSettings],
  ["GET", /^\/api\/navigation-items$/, publicController.navigationItems],
  ["GET", /^\/api\/pages\/(?<slug>[^/]+)$/, publicController.page],
  ["GET", /^\/api\/home-slides$/, publicController.homeSlides],
  ["GET", /^\/api\/product-categories$/, publicController.productCategories],
  ["GET", /^\/api\/products$/, publicController.products],
  ["GET", /^\/api\/quality-report-groups$/, publicController.qualityReportGroups],
  ["GET", /^\/api\/quality-report-groups\/(?<id>\d+)\/images$/, publicController.qualityReportImages],
  ["POST", /^\/api\/messages$/, publicController.createMessage]
];

function matchPublicRoute(method, pathname) {
  for (const [routeMethod, pattern, handler] of routes) {
    const match = pattern.exec(pathname);
    if (routeMethod === method && match) return { handler, params: match.groups || {} };
  }
  return null;
}

module.exports = {
  matchPublicRoute
};
