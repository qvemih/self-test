const mediaFiles = [
  ["zhen-zi-ben-zuo-mark.png", "/uploads/images/site/zhen-zi-ben-zuo-mark.png", "image/png", "臻紫本作标识"],
  ["brand-hero.png", "/uploads/images/site/brand-hero.png", "image/png", "紫砂壶主视觉"],
  ["products-hero.png", "/uploads/images/site/products-hero.png", "image/png", "原矿紫砂系列产品"],
  ["product-intro.png", "/uploads/images/site/product-intro.png", "image/png", "手工紫砂产品细节"],
  ["quality-hero.png", "/uploads/images/site/quality-hero.png", "image/png", "质量检测报告"],
  ["about-hero.png", "/uploads/images/site/about-hero.png", "image/png", "臻紫本作宜兴紫砂文化展示"],
  ["message-hero.png", "/uploads/images/site/message-hero.png", "image/png", "客户留言咨询"],
  ["yixing-handmade-step-01.png", "/uploads/images/pages/yixing-handmade-step-01.png", "image/png", "匠人揉炼原矿紫砂泥料"],
  ["yixing-handmade-step-02.png", "/uploads/images/pages/yixing-handmade-step-02.png", "image/png", "匠人手工接装紫砂壶嘴与壶把"],
  ["yixing-handmade-step-03.png", "/uploads/images/pages/yixing-handmade-step-03.png", "image/png", "匠人在窑炉旁查看烧制后的紫砂壶"],
  ["yixing-handmade-step-04.png", "/uploads/images/pages/yixing-handmade-step-04.png", "image/png", "原矿紫砂壶成品展示"]
];

for (let index = 7; index <= 30; index += 1) {
  const number = String(index).padStart(2, "0");
  mediaFiles.push([
    `product-${number}.png`,
    `/uploads/images/products/product-${number}.png`,
    "image/png",
    `紫砂产品图 ${number}`
  ]);
}

const reportCounts = [4, 4, 4, 3, 4, 4, 4];
reportCounts.forEach((count, groupIndex) => {
  const groupNumber = String(groupIndex + 1).padStart(2, "0");
  for (let imageIndex = 1; imageIndex <= count; imageIndex += 1) {
    const imageNumber = String(imageIndex).padStart(2, "0");
    mediaFiles.push([
      `report-${groupNumber}-${imageNumber}.png`,
      `/uploads/reports/report-${groupNumber}-${imageNumber}.png`,
      "image/png",
      `检测报告 ${groupNumber}-${imageNumber}`
    ]);
  }
});

const navigationItems = [
  ["首页", "/index.html", 1],
  ["产品", "/products.html", 2],
  ["质量保障/检测报告", "/quality.html", 3],
  ["关于我们", "/about.html", 4],
  ["联系我们", "/contact.html", 5]
];

const pages = [
  {
    slug: "home",
    title: "首页",
    heroTitle: "以紫砂之器，承日用之美",
    heroSubtitle: "原矿泥料 · 传统工艺",
    heroImagePath: "/uploads/images/site/brand-hero.png"
  },
  {
    slug: "products",
    title: "产品",
    heroTitle: "原矿紫砂系列产品",
    heroSubtitle: "原矿泥料 · 系列产品",
    heroImagePath: "/uploads/images/site/products-hero.png"
  },
  {
    slug: "quality",
    title: "质量保障/检测报告",
    heroTitle: "质量检测报告",
    heroSubtitle: "检测资料 · 质量证明",
    heroImagePath: "/uploads/images/site/quality-hero.png"
  },
  {
    slug: "about",
    title: "关于我们",
    heroTitle: "关于我们",
    heroSubtitle: "宜兴紫砂 · 文化传承",
    heroImagePath: "/uploads/images/site/about-hero.png"
  },
  {
    slug: "contact",
    title: "联系我们",
    heroTitle: "联系我们",
    heroSubtitle: "留言咨询 · 资料沟通",
    heroImagePath: "/uploads/images/site/message-hero.png"
  }
];

const pageSections = [
  ["home", "brand-intro", "专注原矿紫砂系列产品", "品牌介绍", "企业围绕紫砂壶、茶具、锅类、套装和周边配套展开产品展示，以原矿泥料、传统工艺和日用场景为核心，让客户快速理解产品质感与使用价值。", null, 1],
  ["home", "history", "从紫砂文化到现代日用", "历史进程", "紫砂器具承载茶饮文化与手工制陶传统，也逐步进入家庭、茶室、接待和礼赠场景。首页只做简洁引导，详细产品信息进入产品页面继续了解。", null, 2],
  ["home", "process-01", "醒泥炼泥", "原矿紫砂", "精选紫砂原矿泥料，经醒泥、揉炼、排气等步骤，让泥料更加细腻、均匀、有韧性。匠人用双手反复揉压，使泥性稳定，为后续成型打下基础。", "/uploads/images/pages/yixing-handmade-step-01.png", 11],
  ["home", "process-02", "接嘴装把", "手工成型", "壶身、壶嘴、壶把皆由手工塑形完成。匠人凭经验控制线条比例与衔接角度，让壶嘴出水顺畅、壶把握持舒适，也让每一把壶保留自然的手作痕迹。", "/uploads/images/pages/yixing-handmade-step-02.png", 12],
  ["home", "process-03", "火候淬炼", "入窑烧制", "成型后的紫砂壶需入窑烧制。窑温与火候会影响壶体色泽、收缩与质感，只有经过恰当烧制，原矿紫砂的温润颗粒感与沉稳色泽才能真正呈现。", "/uploads/images/pages/yixing-handmade-step-03.png", 13],
  ["home", "process-04", "一壶一作", "成品展示", "烧成后的紫砂壶色泽沉稳、质感朴拙，器型圆润自然。每一把壶都来自匠人的手工塑形与细节修整，泥料、火候与手法共同造就独一无二的成品。", "/uploads/images/pages/yixing-handmade-step-04.png", 14],
  ["products", "product-intro", "覆盖茶饮、煮饮、套装、礼赠和日用场景", "产品介绍", "企业紫砂产品围绕原矿泥料、工艺成型、日用价值和系列供应展开。产品既适合日常喝茶、煮水、烹煮和待客，也适合礼赠、陈列与定制咨询。", "/uploads/images/site/product-intro.png", 1],
  ["quality", "report-intro", "检测报告与质量证明", "报告展示", "以下检测报告图片均从产品手册 PDF 中逐张裁取，并按报告名称对应展示。", null, 1],
  ["about", "about-intro", "以紫砂文化为根基，呈现器物本身的质感", "品牌介绍", "臻紫本作（宜兴）紫砂文化有限公司围绕宜兴紫砂文化、原矿泥料、传统工艺和现代日用场景展开品牌展示。页面后续可补充企业发展、团队介绍、工坊环境、合作案例和真实资质资料。当前框架先突出品牌的文化感、工艺感和信任感，让客户进入“关于我们”后，能快速理解企业定位，并继续查看产品、检测报告或留下咨询信息。", "/uploads/images/pages/yixing-handmade-step-01.png", 1],
  ["about", "verified-name", "臻紫本作（宜兴）紫砂文化有限公司", "公司名称", "该名称出现在宜兴市人民政府网站发布的“2025年10月份刻章企业名单”中。", null, 2],
  ["about", "verified-record", "2025年10月刻章企业名单", "公开记录", "公开记录说明该主体被列入当月刻章企业名单，但不能直接等同于公司成立日期。", null, 3],
  ["about", "verified-founded", "待工商公示或营业执照核验", "成立时间", "当前公开搜索未检索到可直接核验的成立日期，页面暂不填写具体年月日。", null, 4],
  ["about", "development-01", "立足宜兴紫砂文化", "01", "围绕宜兴紫砂器物、原矿泥料、工艺表达和日用场景进行品牌展示，让客户先了解紫砂本身的文化与器用价值。", null, 11],
  ["about", "development-02", "完善产品与资料展示", "02", "通过产品分类、质量检测报告、资质证明和追溯资料，逐步建立更清晰的产品说明体系。", null, 12],
  ["about", "development-03", "建立客户咨询通道", "03", "通过留言页面收集产品需求、合作意向和联系方式，为后续提供产品资料、检测资料和定制咨询打基础。", null, 13],
  ["contact", "contact-intro", "留下联系方式，方便后续沟通产品资料、检测报告和咨询需求。", "留言咨询", "请填写姓名、联系电话、微信号、意向产品和咨询内容，提交后信息会进入后台留言管理。", null, 1]
];

const homeSlides = [
  ["以紫砂之器，承日用之美", "原矿泥料 · 传统工艺", "/uploads/images/site/brand-hero.png", 1],
  ["从茶席到礼赠的紫砂选择", "系列完整 · 场景丰富", "/uploads/images/site/products-hero.png", 2],
  ["让客户先看见产品本身", "器型温润 · 质感沉稳", "/uploads/images/site/product-intro.png", 3]
];

const productCategories = [
  ["全部类", "all", 1],
  ["套装类", "sets", 2],
  ["锅类", "pot", 3],
  ["壶类", "teapot", 4],
  ["杯类", "cups", 5],
  ["其他类及周边", "accessories", 6]
];

const products = [
  ["sets", "“潜龙”原矿紫砂酒壶套装", "酒壶精工半手，杯子纯手工，半小时改善酒质", "原矿富硒紫砂，无添加", "一壶两杯，壶：150cc，杯：65cc", "/uploads/images/products/product-07.png", 7],
  ["sets", "“渊跃”原矿紫砂酒壶套装", "酒壶精工半手，杯子纯手工，半小时改善酒质", "原矿富硒紫砂，无添加", "一壶两杯，壶：200cc，杯：65cc", "/uploads/images/products/product-08.png", 8],
  ["accessories", "原矿紫砂活酒花生", "模具压制，半小时改善酒质", "原矿富硒紫砂，无添加", "一对两个", "/uploads/images/products/product-09.png", 9],
  ["pot", "紫砂砂锅 5L（汤煲）", "半手，可耐干烧，改善水质", "原矿富硒紫砂，无添加，无锂辉石", "5L", "/uploads/images/products/product-10.png", 10],
  ["pot", "紫砂砂锅 3L（汤煲）", "半手，可耐干烧，改善水质", "原矿富硒紫砂，无添加，无锂辉石", "3L", "/uploads/images/products/product-11.png", 11],
  ["pot", "圆耳紫砂砂锅 1.5L（小菜煲）", "滚压，可耐干烧，改善水质", "原矿富硒紫砂，无添加，无锂辉石", "1.5L", "/uploads/images/products/product-12.png", 12],
  ["pot", "螺纹紫砂砂锅 1.5L（小汤煲）", "滚压，可耐干烧，改善水质", "原矿富硒紫砂，无添加，无锂辉石", "1.5L", "/uploads/images/products/product-13.png", 13],
  ["teapot", "紫砂烧水壶（还原烧）", "壶身滚压、盖子注浆，可耐干烧，改善水质", "原矿富硒紫砂，无添加，无锂辉石", "0.75L", "/uploads/images/products/product-14.png", 14],
  ["teapot", "紫砂烧水壶", "半手，可耐干烧，改善水质", "原矿富硒紫砂，无添加，无锂辉石", "1.0L", "/uploads/images/products/product-15.png", 15],
  ["teapot", "紫砂烧水壶（柴烧）", "真柴烧，半手，可耐干烧，改善水质", "原矿富硒紫砂，无添加，无锂辉石", "1.0L", "/uploads/images/products/product-16.png", 16],
  ["teapot", "紫砂茶壶（扁柿圆）", "半手", "原矿富硒紫砂，无添加", "200CC", "/uploads/images/products/product-17.png", 17],
  ["teapot", "紫砂茶壶（仿古）", "半手", "原矿富硒紫砂，无添加", "260CC", "/uploads/images/products/product-18.png", 18],
  ["teapot", "紫砂茶壶（德钟）", "半手", "原矿富硒紫砂，无添加", "200CC", "/uploads/images/products/product-19.png", 19],
  ["teapot", "紫砂茶壶（汉瓦）", "半手", "原矿富硒紫砂，无添加", "150CC", "/uploads/images/products/product-20.png", 20],
  ["teapot", "紫砂茶壶（石瓢）", "半手", "原矿富硒紫砂，无添加", "230CC", "/uploads/images/products/product-21.png", 21],
  ["teapot", "紫砂茶壶（小德钟）", "精工半手，真柴烧", "原矿富硒紫砂，无添加", "130CC", "/uploads/images/products/product-22.png", 22],
  ["teapot", "紫砂茶壶（小秦权）", "精工半手，真柴烧", "原矿富硒紫砂，无添加", "120CC", "/uploads/images/products/product-23.png", 23],
  ["teapot", "紫砂茶壶（小容天）", "精工半手，真柴烧", "原矿富硒紫砂，无添加", "120CC", "/uploads/images/products/product-24.png", 24],
  ["cups", "紫砂主人杯（莲纹禅韵杯）", "半手，真柴烧", "原矿富硒紫砂，无添加", "90CC", "/uploads/images/products/product-25.png", 25],
  ["cups", "紫砂主人杯（斗笠禅空杯）", "半手，真柴烧", "原矿富硒紫砂，无添加", "90CC", "/uploads/images/products/product-26.png", 26],
  ["cups", "紫砂主人杯（直壁禅意杯）", "半手，真柴烧", "原矿富硒紫砂，无添加", "160CC", "/uploads/images/products/product-27.png", 27],
  ["cups", "紫砂主人杯（高足禅心杯）", "半手，真柴烧", "原矿富硒紫砂，无添加", "160CC", "/uploads/images/products/product-28.png", 28],
  ["cups", "紫砂盖杯", "半手", "原矿富硒紫砂，无添加", "330CC", "/uploads/images/products/product-29.png", 29],
  ["teapot", "紫砂手抓壶", "半手", "原矿富硒紫砂，无添加", "230CC", "/uploads/images/products/product-30.png", 30]
];

const reportGroups = [
  ["紫砂矿石（紫泥、段泥）CMA检测报告", "zini-duanni-cma", 1, 4],
  ["紫砂矿石（朱泥、红泥）CMA检测报告", "zhuni-hongni-cma", 2, 4],
  ["紫砂矿石（紫泥、段泥、朱泥、红泥）光谱分析报告", "ore-spectrum", 3, 4],
  ["部分紫砂产品（茶具、烧水壶、砂锅）光谱分析报告", "product-spectrum", 4, 3],
  ["紫砂泥料CMA检测报告、光谱分析报告", "clay-cma-spectrum", 5, 4],
  ["紫砂产品盛装前后水质对比CMA检测报告", "water-quality-cma", 6, 4],
  ["紫砂产品盛装前后酒质对比CMA检测报告", "wine-quality-cma", 7, 4]
];

module.exports = {
  mediaFiles,
  navigationItems,
  pages,
  pageSections,
  homeSlides,
  productCategories,
  products,
  reportGroups
};
