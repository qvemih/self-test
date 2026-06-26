const api = {
  async get(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`接口读取失败：${path}`);
    return response.json();
  },
  async post(path, payload) {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "提交失败");
    return data;
  }
};

const languageOptions = [
  { code: "zh", label: "中文", dir: "ltr" },
  { code: "en", label: "English", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" }
];

const fallbackLanguage = "zh";
let currentLanguage = localStorage.getItem("zisha_site_language") || fallbackLanguage;
if (!languageOptions.some((item) => item.code === currentLanguage)) currentLanguage = fallbackLanguage;

const translations = {
  en: {
    "臻紫本作": "Zhenzi Benzuo",
    "臻紫本作标识": "Zhenzi Benzuo mark",
    "臻紫本作（宜兴）紫砂文化有限公司": "Zhenzi Benzuo (Yixing) Zisha Culture Co., Ltd.",
    "首页": "Home",
    "产品": "Products",
    "质量保障/检测报告": "Quality Reports",
    "关于我们": "About Us",
    "联系我们": "Contact Us",
    "公司名称": "Company",
    "联系方式": "Contact",
    "关于我们：专注紫砂产品展示、资料说明与客户咨询连接。": "About us: focused on zisha product display, documentation and customer consultation.",
    "联系电话": "Phone",
    "地址": "Address",
    "邮箱/QQ邮箱": "Email / QQ Email",
    "待补充": "To be added",
    "留言咨询": "Inquiry",
    "页面自定义模块": "Custom page modules",
    "页面模块配图": "Page module image",
    "关闭放大图片": "Close enlarged image",
    "检测报告放大图": "Enlarged report image",
    "检测报告": "Inspection report",
    "首页首屏轮播": "Homepage carousel",
    "上一张首页图片": "Previous homepage image",
    "下一张首页图片": "Next homepage image",
    "首页轮播切换": "Homepage carousel navigation",
    "宜兴紫砂· 纯手工制作流程": "Yixing Zisha Handmade Process",
    "从原矿紫砂泥料到手工成型，再经窑火淬炼，每一把壶都由匠人一手完成。": "From raw zisha clay to hand forming and kiln firing, each pot is completed by skilled artisans.",
    "宜兴紫砂纯手工制作流程": "Yixing zisha handmade process",
    "了解产品": "View Products",
    "产品介绍": "Product Introduction",
    "产品手册": "Product Catalog",
    "产品分类快捷入口": "Product category shortcuts",
    "名称": "Name",
    "材质": "Material",
    "工艺及特点": "Craft and Features",
    "规格及容量": "Specification and Capacity",
    "暂无报告图片": "No report images yet",
    "检测报告与质量证明": "Inspection Reports and Quality Proof",
    "公司公开资料": "Public Company Information",
    "公司发展方向": "Development Direction",
    "公开资料来源：宜兴市人民政府网站《2025年10月份刻章企业名单》。涉及成立日期、注册地址、经营范围等工商信息，待企业营业执照或国家企业信用信息公示系统记录补充后再更新。": "Public information source: Yixing Municipal People's Government website, October 2025 seal-carving enterprise list. Company registration details will be updated after business license or official credit records are supplemented.",
    "姓名": "Name",
    "请输入姓名": "Enter your name",
    "请输入联系电话": "Enter your phone number",
    "微信号": "WeChat ID",
    "请输入微信号": "Enter your WeChat ID",
    "意向产品": "Interested Product",
    "例如：壶类、锅类、杯类": "Example: teapots, pots, cups",
    "咨询内容": "Message",
    "请输入想了解的产品、报告或合作需求": "Enter product, report or cooperation needs",
    "提交咨询": "Submit Inquiry",
    "臻紫本作专属私人客服": "Zhenzi Benzuo Private Customer Service",
    "臻紫本作专属私人客服二维码": "Zhenzi Benzuo customer service QR code",
    "已提交，后台已收到留言。": "Submitted. The admin system has received your message.",
    "原矿泥料 · 传统工艺": "Raw clay · Traditional craft",
    "原矿泥料 · 系列产品": "Raw clay · Product series",
    "检测资料 · 质量证明": "Reports · Quality proof",
    "宜兴紫砂 · 文化传承": "Yixing zisha · Cultural heritage",
    "留言咨询 · 资料沟通": "Inquiry · Document communication",
    "以紫砂之器，承日用之美": "Zisha Ware for Everyday Beauty",
    "从茶席到礼赠的紫砂选择": "Zisha Choices from Tea Table to Gifts",
    "系列完整 · 场景丰富": "Complete series · Rich scenarios",
    "让客户先看见产品本身": "Let Customers See the Product First",
    "器型温润 · 质感沉稳": "Warm forms · Calm texture",
    "原矿紫砂系列产品": "Raw Ore Zisha Product Series",
    "质量检测报告": "Quality Inspection Reports",
    "专注原矿紫砂系列产品": "Focused on Raw Ore Zisha Products",
    "品牌介绍": "Brand Introduction",
    "企业围绕紫砂壶、茶具、锅类、套装和周边配套展开产品展示，以原矿泥料、传统工艺和日用场景为核心，让客户快速理解产品质感与使用价值。": "The company presents zisha teapots, tea ware, pots, sets and accessories, focusing on raw clay, traditional craft and everyday use so customers can quickly understand product texture and value.",
    "从紫砂文化到现代日用": "From Zisha Culture to Modern Daily Use",
    "历史进程": "Development",
    "紫砂器具承载茶饮文化与手工制陶传统，也逐步进入家庭、茶室、接待和礼赠场景。首页只做简洁引导，详细产品信息进入产品页面继续了解。": "Zisha ware carries tea culture and handmade pottery traditions while entering homes, tea rooms, hospitality and gifting scenarios. The homepage gives a concise guide, with details on the product page.",
    "醒泥炼泥": "Clay Awakening and Refining",
    "原矿紫砂": "Raw Ore Zisha",
    "精选紫砂原矿泥料，经醒泥、揉炼、排气等步骤，让泥料更加细腻、均匀、有韧性。匠人用双手反复揉压，使泥性稳定，为后续成型打下基础。": "Selected raw zisha clay is awakened, kneaded and de-aired to become fine, even and resilient. Repeated hand kneading stabilizes the clay for forming.",
    "接嘴装把": "Spout and Handle Assembly",
    "手工成型": "Hand Forming",
    "壶身、壶嘴、壶把皆由手工塑形完成。匠人凭经验控制线条比例与衔接角度，让壶嘴出水顺畅、壶把握持舒适，也让每一把壶保留自然的手作痕迹。": "The body, spout and handle are hand formed. Artisans control proportions and joining angles for smooth pouring, comfortable grip and natural handmade character.",
    "火候淬炼": "Kiln Firing",
    "入窑烧制": "Firing",
    "成型后的紫砂壶需入窑烧制。窑温与火候会影响壶体色泽、收缩与质感，只有经过恰当烧制，原矿紫砂的温润颗粒感与沉稳色泽才能真正呈现。": "Formed zisha pots are kiln fired. Temperature and firing affect color, shrinkage and texture, revealing the warm granularity and calm tone of raw zisha.",
    "一壶一作": "One Pot, One Work",
    "成品展示": "Finished Work",
    "烧成后的紫砂壶色泽沉稳、质感朴拙，器型圆润自然。每一把壶都来自匠人的手工塑形与细节修整，泥料、火候与手法共同造就独一无二的成品。": "After firing, zisha pots show calm color, rustic texture and natural rounded forms. Clay, firing and handwork together create each unique piece.",
    "覆盖茶饮、煮饮、套装、礼赠和日用场景": "For tea, cooking, sets, gifting and daily use",
    "企业紫砂产品围绕原矿泥料、工艺成型、日用价值和系列供应展开。产品既适合日常喝茶、煮水、烹煮和待客，也适合礼赠、陈列与定制咨询。": "The zisha product range centers on raw clay, forming craft, daily value and series supply. It suits tea drinking, boiling water, cooking, hospitality, gifting, display and custom inquiries.",
    "报告展示": "Report Display",
    "以下检测报告图片均从产品手册 PDF 中逐张裁取，并按报告名称对应展示。": "The report images below are extracted from the product manual PDF and displayed by report title.",
    "以紫砂文化为根基，呈现器物本身的质感": "Rooted in zisha culture, presenting the texture of the ware itself",
    "该名称出现在宜兴市人民政府网站发布的“2025年10月份刻章企业名单”中。": "This name appears in the October 2025 seal-carving enterprise list published by the Yixing Municipal People's Government website.",
    "2025年10月刻章企业名单": "October 2025 Seal-Carving Enterprise List",
    "公开记录": "Public Record",
    "公开记录说明该主体被列入当月刻章企业名单，但不能直接等同于公司成立日期。": "The public record indicates the entity was included in that month's seal-carving enterprise list, but it does not directly prove the establishment date.",
    "待工商公示或营业执照核验": "Pending business registration or license verification",
    "成立时间": "Establishment Date",
    "当前公开搜索未检索到可直接核验的成立日期，页面暂不填写具体年月日。": "No directly verifiable establishment date has been found in public search results, so no exact date is listed yet.",
    "立足宜兴紫砂文化": "Based on Yixing Zisha Culture",
    "完善产品与资料展示": "Improve Product and Document Display",
    "建立客户咨询通道": "Build Customer Inquiry Channels",
    "留下联系方式，方便后续沟通产品资料、检测报告和咨询需求。": "Leave your contact details for product information, reports and consultation follow-up.",
    "请填写姓名、联系电话、微信号、意向产品和咨询内容，提交后信息会进入后台留言管理。": "Please fill in your name, phone, WeChat ID, interested product and message. The submission will enter admin message management.",
    "全部类": "All",
    "套装类": "Sets",
    "锅类": "Pots",
    "壶类": "Teapots",
    "杯类": "Cups",
    "其他类及周边": "Accessories",
    "原矿富硒紫砂，无添加": "Raw selenium-rich zisha, no additives",
    "原矿富硒紫砂，无添加，无锂辉石": "Raw selenium-rich zisha, no additives, no spodumene",
    "半手": "Semi-handmade",
    "真柴烧，半手，可耐干烧，改善水质": "Real wood-fired, semi-handmade, dry-burn resistant, improves water quality",
    "紫砂矿石（紫泥、段泥）CMA检测报告": "CMA Report for Zisha Ore (Zini and Duanni)",
    "紫砂矿石（朱泥、红泥）CMA检测报告": "CMA Report for Zisha Ore (Zhuni and Hongni)",
    "紫砂矿石（紫泥、段泥、朱泥、红泥）光谱分析报告": "Spectral Analysis of Zisha Ore (Zini, Duanni, Zhuni, Hongni)",
    "部分紫砂产品（茶具、烧水壶、砂锅）光谱分析报告": "Spectral Analysis of Selected Zisha Products",
    "紫砂泥料CMA检测报告、光谱分析报告": "CMA and Spectral Analysis Reports for Zisha Clay",
    "紫砂产品盛装前后水质对比CMA检测报告": "CMA Water Quality Comparison Before and After Zisha Use",
    "紫砂产品盛装前后酒质对比CMA检测报告": "CMA Wine Quality Comparison Before and After Zisha Use",
    "返回首页": "Back to homepage",
    "主导航": "Main navigation",
    "查看网站": "View site",
    "选择语言": "Select language",
    "查看第": "View",
    "张首页图片": "homepage image",
    "张检测报告": "report image",
    "关于臻紫本作": "About Zhenzi Benzuo",
    "已投保": "Insured",
    "放大查看": "Enlarge",
    "图片切换": "image navigation",
    "上一张检测报告": "Previous report",
    "下一张检测报告": "Next report",
    "紫砂壶主视觉": "Zisha teapot hero image",
    "手工紫砂产品细节": "Handmade zisha product detail",
    "臻紫本作宜兴紫砂文化展示": "Zhenzi Benzuo Yixing zisha culture display",
    "客户留言咨询": "Customer inquiry",
    "匠人揉炼原矿紫砂泥料": "Artisan kneading raw zisha clay",
    "匠人手工接装紫砂壶嘴与壶把": "Artisan hand assembling zisha spout and handle",
    "匠人在窑炉旁查看烧制后的紫砂壶": "Artisan checking fired zisha pot near kiln",
    "原矿紫砂壶成品展示": "Finished raw zisha teapot display",
    "酒壶精工半手，杯子纯手工，半小时改善酒质": "Semi-handmade wine pot and fully handmade cups; improves wine quality in about half an hour",
    "模具压制，半小时改善酒质": "Mold pressed; improves wine quality in about half an hour",
    "半手，可耐干烧，改善水质": "Semi-handmade, dry-burn resistant, improves water quality",
    "滚压，可耐干烧，改善水质": "Roll-pressed, dry-burn resistant, improves water quality",
    "壶身滚压、盖子注浆，可耐干烧，改善水质": "Roll-pressed body with slip-cast lid, dry-burn resistant, improves water quality",
    "精工半手，真柴烧": "Fine semi-handmade, real wood-fired",
    "半手，真柴烧": "Semi-handmade, real wood-fired",
    "一壶两杯，壶：150cc，杯：65cc": "One pot and two cups, pot: 150cc, cup: 65cc",
    "一壶两杯，壶：200cc，杯：65cc": "One pot and two cups, pot: 200cc, cup: 65cc",
    "一对两个": "One pair, two pieces",
    "“潜龙”原矿紫砂酒壶套装": "\"Qianlong\" Raw Zisha Wine Pot Set",
    "“渊跃”原矿紫砂酒壶套装": "\"Yuanyue\" Raw Zisha Wine Pot Set",
    "原矿紫砂活酒花生": "Raw Zisha Wine-Reviving Peanuts",
    "紫砂砂锅 5L（汤煲）": "Zisha Casserole 5L (Soup Pot)",
    "紫砂砂锅 3L（汤煲）": "Zisha Casserole 3L (Soup Pot)",
    "圆耳紫砂砂锅 1.5L（小菜煲）": "Round-Ear Zisha Casserole 1.5L",
    "螺纹紫砂砂锅 1.5L（小汤煲）": "Ribbed Zisha Casserole 1.5L",
    "紫砂烧水壶（还原烧）": "Zisha Kettle (Reduction Fired)",
    "紫砂烧水壶": "Zisha Kettle",
    "紫砂烧水壶（柴烧）": "Zisha Kettle (Wood-Fired)",
    "紫砂茶壶（扁柿圆）": "Zisha Teapot (Flat Persimmon Round)",
    "紫砂茶壶（仿古）": "Zisha Teapot (Antique Style)",
    "紫砂茶壶（德钟）": "Zisha Teapot (Dezhong)",
    "紫砂茶壶（汉瓦）": "Zisha Teapot (Hanwa)",
    "紫砂茶壶（石瓢）": "Zisha Teapot (Shipiao)",
    "紫砂茶壶（小德钟）": "Zisha Teapot (Small Dezhong)",
    "紫砂茶壶（小秦权）": "Zisha Teapot (Small Qinquan)",
    "紫砂茶壶（小容天）": "Zisha Teapot (Small Rongtian)",
    "紫砂主人杯（莲纹禅韵杯）": "Zisha Personal Cup (Lotus Zen Cup)",
    "紫砂主人杯（斗笠禅空杯）": "Zisha Personal Cup (Conical Zen Cup)",
    "紫砂主人杯（直壁禅意杯）": "Zisha Personal Cup (Straight-Wall Zen Cup)",
    "紫砂主人杯（高足禅心杯）": "Zisha Personal Cup (High-Foot Zen Cup)",
    "紫砂盖杯": "Zisha Lidded Cup",
    "紫砂手抓壶": "Zisha Hand-Grip Pot"
  },
  ar: {
    "臻紫本作": "تشن زي بن زو",
    "臻紫本作（宜兴）紫砂文化有限公司": "شركة تشن زي بن زو (ييشينغ) لثقافة الزيشا المحدودة",
    "首页": "الرئيسية",
    "产品": "المنتجات",
    "质量保障/检测报告": "تقارير الجودة",
    "关于我们": "من نحن",
    "联系我们": "اتصل بنا",
    "公司名称": "الشركة",
    "联系方式": "معلومات الاتصال",
    "关于我们：专注紫砂产品展示、资料说明与客户咨询连接。": "من نحن: نركز على عرض منتجات الزيشا والوثائق والتواصل مع العملاء.",
    "联系电话": "الهاتف",
    "地址": "العنوان",
    "邮箱/QQ邮箱": "البريد الإلكتروني / QQ",
    "待补充": "سيضاف لاحقا",
    "留言咨询": "استفسار",
    "页面自定义模块": "وحدات مخصصة للصفحة",
    "页面模块配图": "صورة وحدة الصفحة",
    "关闭放大图片": "إغلاق الصورة المكبرة",
    "检测报告放大图": "صورة تقرير مكبرة",
    "检测报告": "تقرير فحص",
    "首页首屏轮播": "عرض صور الصفحة الرئيسية",
    "上一张首页图片": "الصورة السابقة",
    "下一张首页图片": "الصورة التالية",
    "首页轮播切换": "تبديل صور الصفحة الرئيسية",
    "宜兴紫砂· 纯手工制作流程": "عملية صناعة زيشا ييشينغ يدويا",
    "从原矿紫砂泥料到手工成型，再经窑火淬炼，每一把壶都由匠人一手完成。": "من طين الزيشا الخام إلى التشكيل اليدوي والحرق في الفرن، ينجز الحرفيون كل إبريق بعناية.",
    "宜兴紫砂纯手工制作流程": "عملية صناعة زيشا ييشينغ اليدوية",
    "了解产品": "عرض المنتجات",
    "产品介绍": "مقدمة المنتجات",
    "产品手册": "كتالوج المنتجات",
    "产品分类快捷入口": "تصنيفات المنتجات",
    "名称": "الاسم",
    "材质": "المادة",
    "工艺及特点": "الحرفة والميزات",
    "规格及容量": "المواصفات والسعة",
    "暂无报告图片": "لا توجد صور تقارير حاليا",
    "检测报告与质量证明": "تقارير الفحص وإثبات الجودة",
    "公司公开资料": "معلومات الشركة العامة",
    "公司发展方向": "اتجاه التطوير",
    "姓名": "الاسم",
    "请输入姓名": "أدخل الاسم",
    "请输入联系电话": "أدخل رقم الهاتف",
    "微信号": "حساب WeChat",
    "请输入微信号": "أدخل حساب WeChat",
    "意向产品": "المنتج المطلوب",
    "例如：壶类、锅类、杯类": "مثال: أباريق، قدور، أكواب",
    "咨询内容": "محتوى الاستفسار",
    "请输入想了解的产品、报告或合作需求": "اكتب المنتج أو التقرير أو طلب التعاون",
    "提交咨询": "إرسال الاستفسار",
    "臻紫本作专属私人客服": "خدمة عملاء خاصة لتشن زي بن زو",
    "臻紫本作专属私人客服二维码": "رمز QR لخدمة العملاء",
    "已提交，后台已收到留言。": "تم الإرسال، وقد استلم النظام الرسالة.",
    "原矿泥料 · 传统工艺": "طين خام · حرفة تقليدية",
    "原矿泥料 · 系列产品": "طين خام · سلسلة منتجات",
    "检测资料 · 质量证明": "وثائق فحص · إثبات جودة",
    "宜兴紫砂 · 文化传承": "زيشا ييشينغ · تراث ثقافي",
    "留言咨询 · 资料沟通": "استفسار · تواصل حول الوثائق",
    "以紫砂之器，承日用之美": "أواني زيشا لجمال الاستخدام اليومي",
    "从茶席到礼赠的紫砂选择": "اختيارات زيشا من مجلس الشاي إلى الهدايا",
    "系列完整 · 场景丰富": "سلسلة مكتملة · استخدامات متعددة",
    "让客户先看见产品本身": "دع العملاء يرون المنتج أولا",
    "器型温润 · 质感沉稳": "أشكال ناعمة · ملمس رصين",
    "原矿紫砂系列产品": "سلسلة منتجات زيشا من الخام",
    "质量检测报告": "تقارير فحص الجودة",
    "专注原矿紫砂系列产品": "نركز على منتجات زيشا من الخام",
    "品牌介绍": "مقدمة العلامة",
    "从紫砂文化到现代日用": "من ثقافة الزيشا إلى الاستخدام الحديث",
    "历史进程": "التطور",
    "醒泥炼泥": "تهيئة الطين وتنقيته",
    "原矿紫砂": "زيشا خام",
    "接嘴装把": "تركيب الفوهة والمقبض",
    "手工成型": "تشكيل يدوي",
    "火候淬炼": "حرق في الفرن",
    "入窑烧制": "الحرق",
    "一壶一作": "كل إبريق عمل مستقل",
    "成品展示": "عرض المنتج النهائي",
    "覆盖茶饮、煮饮、套装、礼赠和日用场景": "للشاي والطبخ والمجموعات والهدايا والاستخدام اليومي",
    "报告展示": "عرض التقارير",
    "以紫砂文化为根基，呈现器物本身的质感": "مرتكز على ثقافة الزيشا لإظهار ملمس الأواني",
    "2025年10月刻章企业名单": "قائمة شركات الأختام في أكتوبر 2025",
    "公开记录": "سجل عام",
    "成立时间": "تاريخ التأسيس",
    "立足宜兴紫砂文化": "مرتكز على ثقافة زيشا ييشينغ",
    "完善产品与资料展示": "تحسين عرض المنتجات والوثائق",
    "建立客户咨询通道": "إنشاء قنوات استشارة العملاء",
    "留下联系方式，方便后续沟通产品资料、检测报告和咨询需求。": "اترك بيانات الاتصال لمتابعة معلومات المنتجات والتقارير والاستشارات.",
    "全部类": "الكل",
    "套装类": "مجموعات",
    "锅类": "قدور",
    "壶类": "أباريق",
    "杯类": "أكواب",
    "其他类及周边": "إكسسوارات",
    "原矿富硒紫砂，无添加": "زيشا خام غني بالسيلينيوم، بلا إضافات",
    "原矿富硒紫砂，无添加，无锂辉石": "زيشا خام غني بالسيلينيوم، بلا إضافات ولا سبودومين",
    "半手": "نصف يدوي",
    "紫砂矿石（紫泥、段泥）CMA检测报告": "تقرير CMA لخام زيشا (زيني ودواني)",
    "紫砂矿石（朱泥、红泥）CMA检测报告": "تقرير CMA لخام زيشا (جوني وهونغني)",
    "紫砂矿石（紫泥、段泥、朱泥、红泥）光谱分析报告": "تحليل طيفي لخامات زيشا",
    "部分紫砂产品（茶具、烧水壶、砂锅）光谱分析报告": "تحليل طيفي لبعض منتجات زيشا",
    "紫砂泥料CMA检测报告、光谱分析报告": "تقارير CMA وتحليل طيفي لطين زيشا",
    "紫砂产品盛装前后水质对比CMA检测报告": "تقرير CMA لمقارنة جودة الماء قبل وبعد استخدام زيشا",
    "紫砂产品盛装前后酒质对比CMA检测报告": "تقرير CMA لمقارنة جودة المشروب قبل وبعد استخدام زيشا",
    "返回首页": "العودة إلى الرئيسية",
    "主导航": "القائمة الرئيسية",
    "查看网站": "عرض الموقع",
    "选择语言": "اختر اللغة",
    "查看第": "عرض",
    "张首页图片": "صورة من الصفحة الرئيسية",
    "张检测报告": "صورة تقرير",
    "关于臻紫本作": "حول تشن زي بن زو",
    "已投保": "مؤمن",
    "放大查看": "تكبير",
    "图片切换": "تبديل الصور",
    "上一张检测报告": "التقرير السابق",
    "下一张检测报告": "التقرير التالي",
    "紫砂壶主视觉": "صورة إبريق زيشا الرئيسية",
    "手工紫砂产品细节": "تفاصيل منتج زيشا يدوي",
    "臻紫本作宜兴紫砂文化展示": "عرض ثقافة زيشا ييشينغ",
    "客户留言咨询": "استفسارات العملاء",
    "匠人揉炼原矿紫砂泥料": "حرفي يعجن طين زيشا الخام",
    "匠人手工接装紫砂壶嘴与壶把": "حرفي يركب الفوهة والمقبض يدويا",
    "匠人在窑炉旁查看烧制后的紫砂壶": "حرفي يتفقد الإبريق بعد الحرق",
    "原矿紫砂壶成品展示": "عرض إبريق زيشا خام مكتمل",
    "酒壶精工半手，杯子纯手工，半小时改善酒质": "إبريق نصف يدوي وأكواب يدوية، يحسن جودة المشروب خلال نصف ساعة",
    "模具压制，半小时改善酒质": "مصبوب بالقالب، يحسن جودة المشروب خلال نصف ساعة",
    "半手，可耐干烧，改善水质": "نصف يدوي، يتحمل التسخين الجاف ويحسن جودة الماء",
    "滚压，可耐干烧，改善水质": "مضغوط بالدحرجة، يتحمل التسخين الجاف ويحسن الماء",
    "壶身滚压、盖子注浆，可耐干烧，改善水质": "جسم مضغوط وغطاء مصبوب، يتحمل التسخين الجاف ويحسن الماء",
    "精工半手，真柴烧": "نصف يدوي متقن، حرق خشبي حقيقي",
    "半手，真柴烧": "نصف يدوي، حرق خشبي حقيقي",
    "一壶两杯，壶：150cc，杯：65cc": "إبريق وكوبان، الإبريق 150cc والكوب 65cc",
    "一壶两杯，壶：200cc，杯：65cc": "إبريق وكوبان، الإبريق 200cc والكوب 65cc",
    "一对两个": "زوج من قطعتين",
    "“潜龙”原矿紫砂酒壶套装": "طقم إبريق زيشا خام \"تشيان لونغ\"",
    "“渊跃”原矿紫砂酒壶套装": "طقم إبريق زيشا خام \"يوان يويه\"",
    "原矿紫砂活酒花生": "قطع زيشا خام لتحسين المشروب",
    "紫砂砂锅 5L（汤煲）": "قدر زيشا 5 لتر للحساء",
    "紫砂砂锅 3L（汤煲）": "قدر زيشا 3 لتر للحساء",
    "圆耳紫砂砂锅 1.5L（小菜煲）": "قدر زيشا دائري 1.5 لتر",
    "螺纹紫砂砂锅 1.5L（小汤煲）": "قدر زيشا مخدد 1.5 لتر",
    "紫砂烧水壶（还原烧）": "غلاية زيشا بحرق اختزالي",
    "紫砂烧水壶": "غلاية زيشا",
    "紫砂烧水壶（柴烧）": "غلاية زيشا بحرق خشبي",
    "紫砂茶壶（扁柿圆）": "إبريق شاي زيشا بشكل كاكي مسطح",
    "紫砂茶壶（仿古）": "إبريق شاي زيشا طراز قديم",
    "紫砂茶壶（德钟）": "إبريق شاي زيشا دي تشونغ",
    "紫砂茶壶（汉瓦）": "إبريق شاي زيشا هان وا",
    "紫砂茶壶（石瓢）": "إبريق شاي زيشا شي بياو",
    "紫砂茶壶（小德钟）": "إبريق شاي زيشا دي تشونغ صغير",
    "紫砂茶壶（小秦权）": "إبريق شاي زيشا تشين تشوان صغير",
    "紫砂茶壶（小容天）": "إبريق شاي زيشا رونغ تيان صغير",
    "紫砂主人杯（莲纹禅韵杯）": "كوب زيشا شخصي بنقش اللوتس",
    "紫砂主人杯（斗笠禅空杯）": "كوب زيشا شخصي بشكل قبعة",
    "紫砂主人杯（直壁禅意杯）": "كوب زيشا شخصي بجدار مستقيم",
    "紫砂主人杯（高足禅心杯）": "كوب زيشا شخصي بقاعدة عالية",
    "紫砂盖杯": "كوب زيشا بغطاء",
    "紫砂手抓壶": "إبريق زيشا يدوي المسك"
  }
};

function languageConfig() {
  return languageOptions.find((item) => item.code === currentLanguage) || languageOptions[0];
}

function translateText(value) {
  const text = String(value ?? "");
  if (currentLanguage === fallbackLanguage || !text) return text;
  const exact = translations[currentLanguage] && translations[currentLanguage][text];
  return exact || text;
}

function t(value) {
  return translateText(value);
}

function setLanguage(language) {
  if (!languageOptions.some((item) => item.code === language)) return;
  localStorage.setItem("zisha_site_language", language);
  location.reload();
}

function applyLanguageMeta() {
  const config = languageConfig();
  document.documentElement.lang = config.code === "zh" ? "zh-CN" : config.code;
  document.documentElement.dir = config.dir;
  document.body.classList.toggle("is-rtl", config.dir === "rtl");
}

function renderLanguageSwitch() {
  return `
    <div class="language-switch" aria-label="${escapeHtml("选择语言")}">
      ${languageOptions.map((item) => `
        <button type="button" class="${item.code === currentLanguage ? "is-active" : ""}" data-language="${item.code}" aria-pressed="${item.code === currentLanguage ? "true" : "false"}">${escapeHtml(item.label)}</button>
      `).join("")}
    </div>
  `;
}

function bindLanguageSwitch(root = document) {
  root.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.language));
  });
}

function updateDocumentTitle(activePath) {
  const titleMap = {
    "/index.html": "臻紫本作",
    "/products.html": "产品",
    "/quality.html": "质量保障/检测报告",
    "/about.html": "关于我们",
    "/contact.html": "联系我们"
  };
  const title = titleMap[activePath] || "臻紫本作";
  document.title = activePath === "/index.html" ? t("臻紫本作") : `${t(title)} - ${t("臻紫本作")}`;
}

function escapeHtml(value = "") {
  return translateText(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  }[char]));
}

function imageUrl(image, fallback = "") {
  return image && image.url ? image.url : fallback;
}

async function renderHeader(activePath) {
  const [settings, navItems] = await Promise.all([
    api.get("/api/site-settings"),
    api.get("/api/navigation-items")
  ]);
  const header = document.querySelector("[data-site-header]");
  if (!header) return settings;
  header.innerHTML = `
    <a class="brand" href="/index.html" aria-label="${escapeHtml(settings.site_name)} ${escapeHtml("返回首页")}">
      ${settings.logo ? `<img class="brand-logo" src="${settings.logo.url}" alt="${escapeHtml(settings.logo.alt || settings.site_name)}">` : ""}
      <span class="brand-name">${escapeHtml(settings.site_name)}</span>
    </a>
    <nav class="site-nav" aria-label="${escapeHtml("主导航")}">
      ${navItems.map((item) => `<a class="${item.path === activePath ? "active" : ""}" href="${item.path}">${escapeHtml(item.label)}</a>`).join("")}
    </nav>
    ${renderLanguageSwitch()}
  `;
  bindLanguageSwitch(header);
  return settings;
}

function renderFooter(settings) {
  const footer = document.querySelector("[data-site-footer]");
  if (!footer) return;
  footer.innerHTML = `
    <div>
      <h2>${escapeHtml("公司名称")}</h2>
      <p>${escapeHtml(settings.company_name)}</p>
      <p>${escapeHtml("关于我们：专注紫砂产品展示、资料说明与客户咨询连接。")}</p>
    </div>
    <div>
      <h2>${escapeHtml("联系方式")}</h2>
      <p>${escapeHtml("联系电话")}：${escapeHtml(settings.phone || "待补充")}</p>
      <p>${escapeHtml("地址")}：${escapeHtml(settings.address || "待补充")}</p>
      <p>${escapeHtml("邮箱/QQ邮箱")}：${escapeHtml(settings.email || "待补充")}</p>
    </div>
    <a class="footer-link" href="/contact.html">${escapeHtml("留言咨询")}</a>
  `;
}

function renderPageHero(page, className = "page-hero") {
  return `
    <section class="${className}">
      ${page.hero_image ? `<img src="${page.hero_image.url}" alt="${escapeHtml(page.hero_image.alt || page.title)}">` : ""}
      <div class="${className === "about-hero" ? "about-hero-copy" : "page-hero-copy"}">
        <p>${escapeHtml(page.hero_subtitle || "")}</p>
        <h1>${escapeHtml(page.hero_title || page.title)}</h1>
        ${page.slug === "about" ? `<span>${escapeHtml("臻紫本作（宜兴）紫砂文化有限公司")}</span>` : ""}
      </div>
    </section>
  `;
}

function sectionByKey(page, key) {
  return page.sections.find((section) => section.section_key === key);
}

function sectionsByPrefix(page, prefix) {
  return page.sections.filter((section) => section.section_key.startsWith(prefix));
}

function customSections(page, usedKeys = [], usedPrefixes = []) {
  return page.sections.filter((section) => (
    !usedKeys.includes(section.section_key) &&
    !usedPrefixes.some((prefix) => section.section_key.startsWith(prefix))
  ));
}

function renderCustomPageSections(page, usedKeys = [], usedPrefixes = []) {
  const sections = customSections(page, usedKeys, usedPrefixes);
  if (!sections.length) return "";
  return `
    <section class="custom-page-sections section-pad" aria-label="${escapeHtml("页面自定义模块")}">
      ${sections.map(renderCustomPageSection).join("")}
    </section>
  `;
}

function renderCustomPageSection(section) {
  const isGeneratedKey = String(section.section_key || "").startsWith("custom-");
  const displayTitle = section.title || (isGeneratedKey ? "" : section.section_key);
  return `
    <article class="custom-page-section ${section.image ? "" : "custom-page-section-text"}">
      ${section.image ? `<figure><img src="${section.image.url}" alt="${escapeHtml(section.image.alt || displayTitle || "页面模块配图")}"></figure>` : ""}
      <div>
        ${section.subtitle ? `<p class="eyebrow">${escapeHtml(section.subtitle)}</p>` : ""}
        ${displayTitle ? `<h2>${escapeHtml(displayTitle)}</h2>` : ""}
        ${section.body ? `<p>${escapeHtml(section.body)}</p>` : ""}
      </div>
    </article>
  `;
}

function initIndexedCarousel(root, options) {
  const track = root.querySelector(options.trackSelector);
  const slides = Array.from(root.querySelectorAll(options.itemSelector));
  if (!track || slides.length <= 1) return;

  const prev = root.querySelector(options.prevSelector);
  const next = root.querySelector(options.nextSelector);
  const dots = Array.from(root.querySelectorAll(options.dotSelector));
  let currentIndex = 0;

  const show = (nextIndex) => {
    currentIndex = (nextIndex + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === currentIndex);
      dot.setAttribute("aria-current", index === currentIndex ? "true" : "false");
    });
  };

  if (prev) prev.addEventListener("click", () => show(currentIndex - 1));
  if (next) next.addEventListener("click", () => show(currentIndex + 1));
  dots.forEach((dot, index) => dot.addEventListener("click", () => show(index)));
  show(0);
}

function initHomeCarousel(root) {
  const carousel = root.querySelector("[data-home-carousel]");
  if (!carousel) return;
  initIndexedCarousel(carousel, {
    trackSelector: "[data-home-track]",
    itemSelector: "[data-home-slide]",
    prevSelector: "[data-home-prev]",
    nextSelector: "[data-home-next]",
    dotSelector: "[data-home-dot]"
  });
}

function initReportCarousels(root) {
  document.querySelector(".report-lightbox")?.remove();
  const lightbox = document.createElement("div");
  lightbox.className = "report-lightbox";
  lightbox.setAttribute("aria-hidden", "true");
  lightbox.innerHTML = `
    <button type="button" class="report-lightbox-close" aria-label="${escapeHtml("关闭放大图片")}">×</button>
    <img src="" alt="">
  `;
  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector("img");
  const lightboxClose = lightbox.querySelector("button");
  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.removeAttribute("src");
    lightboxImage.alt = "";
    document.body.classList.remove("report-lightbox-open");
  };
  const openLightbox = (image) => {
    if (!image) return;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || t("检测报告放大图");
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("report-lightbox-open");
    lightboxClose.focus();
  };

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
  });

  root.querySelectorAll("[data-report-carousel]").forEach((carousel) => {
    const track = carousel.querySelector("[data-report-track]");
    const slides = Array.from(carousel.querySelectorAll("[data-report-item]"));
    if (!track || !slides.length) return;

    const prev = carousel.querySelector("[data-report-prev]");
    const next = carousel.querySelector("[data-report-next]");
    const dots = Array.from(carousel.querySelectorAll("[data-report-dot]"));
    track.style.transform = "";

    const nearestIndex = () => {
      const left = track.scrollLeft;
      let bestIndex = 0;
      let bestDistance = Infinity;
      slides.forEach((slide, index) => {
        const distance = Math.abs(slide.offsetLeft - left);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = index;
        }
      });
      return bestIndex;
    };

    const updateDots = () => {
      const index = nearestIndex();
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === index);
        dot.setAttribute("aria-current", dotIndex === index ? "true" : "false");
      });
    };

    const scrollToIndex = (index) => {
      const target = slides[Math.max(0, Math.min(slides.length - 1, index))];
      if (!target) return;
      track.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
      window.setTimeout(updateDots, 220);
    };

    if (prev) prev.addEventListener("click", () => scrollToIndex(nearestIndex() - 1));
    if (next) next.addEventListener("click", () => scrollToIndex(nearestIndex() + 1));
    dots.forEach((dot, index) => dot.addEventListener("click", () => scrollToIndex(index)));
    slides.forEach((slide) => {
      const image = slide.querySelector("img");
      slide.tabIndex = 0;
      slide.setAttribute("role", "button");
      slide.setAttribute("aria-label", `${t("放大查看")}${image ? image.alt : t("检测报告")}`);
      slide.addEventListener("click", () => openLightbox(image));
      slide.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openLightbox(image);
        }
      });
    });
    track.addEventListener("scroll", () => {
      window.clearTimeout(track.reportScrollTimer);
      track.reportScrollTimer = window.setTimeout(updateDots, 80);
    });
    updateDots();
  });
}

function renderCategoryTabIcon(slug) {
  const icons = {
    all: `
      <svg class="category-tab-icon" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <rect class="icon-soft" x="16" y="18" width="32" height="28" rx="5"></rect>
        <path class="icon-line" d="M22 18v-5h20v5M22 28h20M22 37h20"></path>
      </svg>
    `,
    sets: `
      <svg class="category-tab-icon" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <circle class="icon-clay" cx="24" cy="30" r="10"></circle>
        <rect class="icon-soft" x="34" y="22" width="14" height="18" rx="4"></rect>
        <path class="icon-line" d="M17 45h31M42 22c6 1 9 5 9 10s-3 9-9 10"></path>
      </svg>
    `,
    pot: `
      <svg class="category-tab-icon" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <path class="icon-dark" d="M16 26h34l-4 20H20z"></path>
        <path class="icon-soft" d="M22 20h22v7H22z"></path>
        <path class="icon-line" d="M18 26c-6 2-7 12 1 15M50 29c8 0 8 11 0 12M25 20c2-5 12-5 14 0"></path>
      </svg>
    `,
    teapot: `
      <svg class="category-tab-icon" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <path class="icon-clay" d="M22 27h24c3 12-2 21-12 21s-15-9-12-21z"></path>
        <path class="icon-line" d="M25 27c1-8 17-8 18 0M46 31c9-1 10 10 2 12M22 33c-7 0-10 4-13 9M29 20h10"></path>
      </svg>
    `,
    cups: `
      <svg class="category-tab-icon" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <path class="icon-soft" d="M21 24h22l-3 20H24z"></path>
        <path class="icon-line" d="M19 24h26M24 44h16M43 29c8 0 8 10 0 11"></path>
        <path class="icon-gold" d="M27 17h10v5H27z"></path>
      </svg>
    `,
    accessories: `
      <svg class="category-tab-icon" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <rect class="icon-soft" x="17" y="22" width="30" height="24" rx="5"></rect>
        <path class="icon-line" d="M17 30h30M32 22v24M24 22c-3-7 5-9 8 0M32 22c3-9 12-6 8 0"></path>
      </svg>
    `
  };
  return icons[slug] || icons.all;
}

async function initPage(activePath) {
  applyLanguageMeta();
  updateDocumentTitle(activePath);
  const settings = await renderHeader(activePath);
  renderFooter(settings);
  return settings;
}

async function renderHome() {
  await initPage("/index.html");
  const [page, slides] = await Promise.all([
    api.get("/api/pages/home"),
    api.get("/api/home-slides")
  ]);
  const main = document.querySelector("main");
  const brandIntro = sectionByKey(page, "brand-intro");
  const history = sectionByKey(page, "history");
  const steps = sectionsByPrefix(page, "process-");
  main.innerHTML = `
    <section class="home-carousel" aria-label="${escapeHtml("首页首屏轮播")}" data-home-carousel>
      <div class="slides dynamic-slides" data-home-track>
        ${slides.map((slide) => `
          <article class="slide" data-home-slide>
            ${slide.image ? `<img src="${slide.image.url}" alt="${escapeHtml(slide.image.alt || slide.title)}">` : ""}
            <div class="slide-copy">
              <p>${escapeHtml(slide.subtitle || "")}</p>
              <h1>${escapeHtml(slide.title)}</h1>
            </div>
          </article>
        `).join("")}
      </div>
      ${slides.length > 1 ? `
        <button class="home-carousel-control home-carousel-prev" type="button" aria-label="${escapeHtml("上一张首页图片")}" data-home-prev>‹</button>
        <button class="home-carousel-control home-carousel-next" type="button" aria-label="${escapeHtml("下一张首页图片")}" data-home-next>›</button>
        <div class="home-carousel-dots" aria-label="${escapeHtml("首页轮播切换")}">
          ${slides.map((slide, index) => `<button class="home-carousel-dot" type="button" aria-label="${escapeHtml("查看第")} ${index + 1} ${escapeHtml("张首页图片")}" data-home-dot></button>`).join("")}
        </div>
      ` : ""}
    </section>
    <section class="split-intro section-pad">
      ${[brandIntro, history].filter(Boolean).map((section) => `
        <article>
          <p class="eyebrow">${escapeHtml(section.subtitle || "")}</p>
          <h2>${escapeHtml(section.title || "")}</h2>
          <p>${escapeHtml(section.body || "")}</p>
        </article>
      `).join("")}
    </section>
    <section id="process" class="series section-pad handmade-process">
      <div class="section-title process-title">
        <h2>${escapeHtml("宜兴紫砂· 纯手工制作流程")}</h2>
        <p>${escapeHtml("从原矿紫砂泥料到手工成型，再经窑火淬炼，每一把壶都由匠人一手完成。")}</p>
      </div>
      <div class="process-timeline" aria-label="${escapeHtml("宜兴紫砂纯手工制作流程")}">
        ${steps.map((step, index) => `
          <article class="process-step ${index % 2 ? "process-step-reverse" : ""}">
            <figure class="process-media">
              ${step.image ? `<img src="${step.image.url}" alt="${escapeHtml(step.image.alt || step.title)}">` : ""}
            </figure>
            <div class="process-marker"><span>${String(index + 1).padStart(2, "0")}</span></div>
            <div class="process-copy">
              <p class="process-kicker">${escapeHtml(step.subtitle || "")}</p>
              <h3>${escapeHtml(step.title || "")}</h3>
              <p>${escapeHtml(step.body || "")}${index === steps.length - 1 ? ` <a class="process-cta" href="/products.html">${escapeHtml("了解产品")}</a>` : ""}</p>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
    ${renderCustomPageSections(page, ["brand-intro", "history"], ["process-"])}
  `;
  initHomeCarousel(main);
}

async function renderProducts() {
  await initPage("/products.html");
  const [page, categories, products] = await Promise.all([
    api.get("/api/pages/products"),
    api.get("/api/product-categories"),
    api.get("/api/products")
  ]);
  const intro = sectionByKey(page, "product-intro");
  const main = document.querySelector("main");
  main.innerHTML = `
    ${renderPageHero(page)}
    <section class="product-intro section-pad">
      <div class="intro-copy">
        <p class="eyebrow">${escapeHtml(intro ? intro.subtitle : "产品介绍")}</p>
        <h2>${escapeHtml(intro ? intro.title : "")}</h2>
        <p>${escapeHtml(intro ? intro.body : "")}</p>
      </div>
    </section>
    <section class="manual-products section-pad" id="manual-products" aria-label="${escapeHtml("产品手册")}">
      <div class="section-title manual-products-title">
        <div class="category-tabs" aria-label="${escapeHtml("产品分类快捷入口")}">
          ${categories.map((category, index) => `<button class="category-tab ${index === 0 ? "is-active" : ""}" type="button" data-category-tab="${category.slug}">${renderCategoryTabIcon(category.slug)}<span>${escapeHtml(category.name)}</span></button>`).join("")}
        </div>
      </div>
      <div class="manual-category-stack">
        <section class="manual-category-block manual-all-panel">
          <div class="manual-product-grid" data-product-grid></div>
        </section>
      </div>
    </section>
    ${renderCustomPageSections(page, ["product-intro"])}
  `;
  const grid = document.querySelector("[data-product-grid]");
  const tabs = Array.from(document.querySelectorAll("[data-category-tab]"));
  const draw = (slug) => {
    const visible = slug === "all" ? products : products.filter((product) => product.category && product.category.slug === slug);
    grid.innerHTML = visible.map(renderProductCard).join("");
  };
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => item.classList.toggle("is-active", item === tab));
      draw(tab.dataset.categoryTab);
      tab.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    });
  });
  draw("all");
}

function renderProductCard(product) {
  return `
    <article class="manual-product-card ${product.is_insured ? "is-insured" : ""}" data-insured-label="${escapeHtml("已投保")}">
      <div class="manual-product-media">
        ${product.image ? `<img src="${product.image.url}" alt="${escapeHtml(product.image.alt || product.name)}">` : ""}
      </div>
      <div class="manual-product-info">
        <p><span>${escapeHtml("名称")}</span>${escapeHtml(product.name)}</p>
        <p><span>${escapeHtml("材质")}</span>${escapeHtml(product.material || "")}</p>
        <p><span>${escapeHtml("工艺及特点")}</span>${escapeHtml(product.summary || "")}</p>
        <p><span>${escapeHtml("规格及容量")}</span>${escapeHtml(product.specification || "")}</p>
      </div>
    </article>
  `;
}

function renderReportGroup(group, index) {
  const images = group.images || [];
  return `
    <section class="report-group">
      <div class="report-group-title">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <h3>${escapeHtml(group.title)}</h3>
      </div>
      ${images.length ? `
        <div class="report-carousel" data-report-carousel>
          <div class="report-image-grid" data-report-track>
            ${images.map((item) => `<figure class="report-figure" data-report-item>${item.image ? `<img src="${item.image.url}" alt="${escapeHtml(item.alt_text || item.image.alt)}">` : ""}</figure>`).join("")}
          </div>
          ${images.length > 1 ? `
            <button class="report-carousel-arrow report-carousel-prev" type="button" aria-label="${escapeHtml("上一张检测报告")}" data-report-prev>‹</button>
            <button class="report-carousel-arrow report-carousel-next" type="button" aria-label="${escapeHtml("下一张检测报告")}" data-report-next>›</button>
            <div class="report-carousel-dots" aria-label="${escapeHtml(group.title)} ${escapeHtml("图片切换")}">
              ${images.map((item, imageIndex) => `<button class="report-carousel-dot" type="button" aria-label="${escapeHtml("查看第")} ${imageIndex + 1} ${escapeHtml("张检测报告")}" data-report-dot></button>`).join("")}
            </div>
          ` : ""}
        </div>
      ` : `<p class="report-empty">${escapeHtml("暂无报告图片")}</p>`}
    </section>
  `;
}

async function renderQuality() {
  await initPage("/quality.html");
  const [page, groups] = await Promise.all([
    api.get("/api/pages/quality"),
    api.get("/api/quality-report-groups")
  ]);
  const intro = sectionByKey(page, "report-intro");
  document.querySelector("main").innerHTML = `
    ${renderPageHero(page)}
    <section class="report-section section-pad">
      <div class="section-title">
        <h2>${escapeHtml(intro ? intro.title : "检测报告与质量证明")}</h2>
        <p>${escapeHtml(intro ? intro.body : "")}</p>
      </div>
      <div class="report-list">
        ${groups.map(renderReportGroup).join("")}
      </div>
    </section>
    ${renderCustomPageSections(page, ["report-intro"])}
  `;
  initReportCarousels(document);
}

async function renderAbout() {
  await initPage("/about.html");
  const page = await api.get("/api/pages/about");
  const intro = sectionByKey(page, "about-intro");
  const facts = sectionsByPrefix(page, "verified-");
  const development = sectionsByPrefix(page, "development-");
  document.querySelector("main").className = "about-page";
  document.querySelector("main").innerHTML = `
    ${renderPageHero(page, "about-hero")}
      <section class="about-intro section-pad">
        <div class="about-section-title">
          <p>ABOUT ZHENZI BENZUO</p>
          <h2>${escapeHtml("关于臻紫本作")}</h2>
        </div>
      <div class="about-story">
        <figure class="about-story-media">
          ${intro && intro.image ? `<img src="${intro.image.url}" alt="${escapeHtml(intro.image.alt || intro.title)}">` : ""}
        </figure>
        <article class="about-story-copy">
          <p class="eyebrow">${escapeHtml(intro ? intro.subtitle : "")}</p>
          <h3>${escapeHtml(intro ? intro.title : "")}</h3>
          <p>${escapeHtml(intro ? intro.body : "")}</p>
        </article>
      </div>
      <section class="about-facts" aria-label="${escapeHtml("公司公开资料")}">
        <div class="about-facts-head"><p>VERIFIED INFORMATION</p><h3>${escapeHtml("公司公开资料")}</h3></div>
        <div class="fact-grid">
          ${facts.map((fact) => `<article class="fact-card"><span>${escapeHtml(fact.subtitle || "")}</span><strong>${escapeHtml(fact.title || "")}</strong><p>${escapeHtml(fact.body || "")}</p></article>`).join("")}
        </div>
      </section>
      <section class="about-development" aria-label="${escapeHtml("公司发展方向")}">
        <div class="about-facts-head"><p>DEVELOPMENT DIRECTION</p><h3>${escapeHtml("公司发展方向")}</h3></div>
        <div class="development-list">
          ${development.map((item) => `<article><span>${escapeHtml(item.subtitle || "")}</span><div><h4>${escapeHtml(item.title || "")}</h4><p>${escapeHtml(item.body || "")}</p></div></article>`).join("")}
        </div>
        <p class="source-note">${escapeHtml("公开资料来源：宜兴市人民政府网站《2025年10月份刻章企业名单》。涉及成立日期、注册地址、经营范围等工商信息，待企业营业执照或国家企业信用信息公示系统记录补充后再更新。")}</p>
      </section>
    </section>
    ${renderCustomPageSections(page, ["about-intro"], ["verified-", "development-"])}
  `;
}

async function renderContact() {
  const settings = await initPage("/contact.html");
  const page = await api.get("/api/pages/contact");
  const intro = sectionByKey(page, "contact-intro");
  document.querySelector("main").innerHTML = `
    <section class="message-page section-pad">
      <div class="section-title message-title">
        <h1>${escapeHtml(page.hero_title || "联系我们")}</h1>
        <p>${escapeHtml(intro ? intro.title : "")}</p>
      </div>
      <div class="message-layout">
        <form class="message-form" data-message-form>
          <label><span>${escapeHtml("姓名")}</span><input type="text" name="name" placeholder="${escapeHtml("请输入姓名")}" required></label>
          <label><span>${escapeHtml("联系电话")}</span><input type="tel" name="phone" placeholder="${escapeHtml("请输入联系电话")}" required></label>
          <label><span>${escapeHtml("微信号")}</span><input type="text" name="wechat" placeholder="${escapeHtml("请输入微信号")}"></label>
          <label><span>${escapeHtml("意向产品")}</span><input type="text" name="product_interest" placeholder="${escapeHtml("例如：壶类、锅类、杯类")}"></label>
          <label><span>${escapeHtml("咨询内容")}</span><textarea name="content" rows="6" placeholder="${escapeHtml("请输入想了解的产品、报告或合作需求")}" required></textarea></label>
          <button type="submit">${escapeHtml("提交咨询")}</button>
          <p class="form-status" data-form-status></p>
        </form>
        <aside class="contact-panel">
          <h2>${escapeHtml("臻紫本作专属私人客服")}</h2>
          <img class="contact-service-qr" src="/uploads/images/1782462948615-vchat.png" alt="${escapeHtml("臻紫本作专属私人客服二维码")}">
        </aside>
      </div>
    </section>
    ${renderCustomPageSections(page, ["contact-intro"])}
  `;
  const form = document.querySelector("[data-message-form]");
  const status = document.querySelector("[data-form-status]");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      await api.post("/api/messages", payload);
      form.reset();
      status.textContent = t("已提交，后台已收到留言。");
    } catch (error) {
      status.textContent = error.message;
    }
  });
}

window.ZishaSite = {
  renderHome,
  renderProducts,
  renderQuality,
  renderAbout,
  renderContact
};
