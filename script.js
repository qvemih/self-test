const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const form = document.querySelector(".message-form");
const statusNode = document.querySelector(".form-status");
const langButtons = Array.from(document.querySelectorAll("[data-lang]"));
const categoryCarousel = document.querySelector("[data-category-carousel]");
const categoryButtons = Array.from(document.querySelectorAll("[data-category]"));
const categoryImage = document.querySelector("[data-category-image]");
const categoryLabel = document.querySelector("[data-category-label]");
const categoryTitle = document.querySelector("[data-category-title]");
const categoryDesc = document.querySelector("[data-category-desc]");
const categoryList = document.querySelector("[data-category-list]");

navToggle?.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    siteNav.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  }
});

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const setFormStatus = (message, isSuccess = false) => {
  if (!statusNode) return;
  statusNode.textContent = message;
  statusNode.classList.toggle("success", isSuccess);
};

const categories = [
  {
    key: "壶类",
    image: "assets/products/chahu-shipiao.jpg",
    alt: "壶类代表：紫砂茶壶（石瓢）",
    title: "壶类",
    desc: "适合品茗、泡茶和礼赠，是紫砂里最常见也最受欢迎的一类。",
    items: ["紫砂茶壶（石瓢）", "紫砂烧水壶（还原烧）", "紫砂烧水壶（柴烧）"],
  },
  {
    key: "锅类",
    image: "assets/products/shaguo-5l.jpg",
    alt: "锅类代表：紫砂砂锅 5L",
    title: "锅类",
    desc: "用于煲汤、炖煮和日常烹饪，强调耐热和稳定性。",
    items: ["紫砂砂锅 5L"],
  },
  {
    key: "蛊类",
    image: "assets/products/gaibei.jpg",
    alt: "蛊类代表：紫砂盖杯",
    title: "蛊类",
    desc: "偏向小型饮茶器与盖杯，适合单人品饮和办公场景。",
    items: ["紫砂盖杯", "紫砂小盅 / 品茗小蛊（后续可补充）"],
  },
  {
    key: "茶杯类",
    image: "assets/products/zhurenbei-lianwen.jpg",
    alt: "茶杯类代表：紫砂主人杯",
    title: "茶杯类",
    desc: "适合茶席、日常饮茶和个人专属使用。",
    items: ["紫砂主人杯（莲纹禅韵杯）", "紫砂盖杯"],
  },
  {
    key: "套装",
    image: "assets/products/jiuju-qianlong.jpg",
    alt: "套装代表：紫砂酒壶套装",
    title: "套装",
    desc: "适合礼赠和批量采购，可按礼盒、组合和品牌需求定制。",
    items: ["“潜龙”原矿紫砂酒壶套装", "茶壶 + 主人杯组合套装（可定制）"],
  },
  {
    key: "其他",
    image: "assets/brand/minerals.jpg",
    alt: "其他代表：原矿与定制礼盒方案",
    title: "其他",
    desc: "包含礼盒、配件和包装方案，便于扩展产品线。",
    items: ["定制礼盒", "批量采购配件", "礼赠包装方案"],
  },
];

let categoryIndex = 0;

const renderCategory = (index) => {
  const item = categories[index];
  if (!item) return;

  categoryIndex = index;
  if (categoryImage) {
    categoryImage.src = item.image;
    categoryImage.alt = item.alt;
  }
  if (categoryLabel) categoryLabel.textContent = item.key;
  if (categoryTitle) categoryTitle.textContent = item.title;
  if (categoryDesc) categoryDesc.textContent = item.desc;
  if (categoryList) {
    categoryList.innerHTML = item.items.map((entry) => `<li>${entry}</li>`).join("");
  }
  categoryButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.category === item.key));
};

if (categoryCarousel && categoryButtons.length) {
  categoryButtons.forEach((button, index) => {
    button.addEventListener("click", () => renderCategory(index));
  });

  renderCategory(0);
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const payload = {
    name: String(data.get("name") || "").trim(),
    phone: String(data.get("phone") || "").trim(),
    email: String(data.get("email") || "").trim(),
    market: String(data.get("market") || "").trim(),
    message: String(data.get("message") || "").trim(),
    createdAt: new Date().toISOString(),
  };

  if (!payload.phone && !payload.email) {
    setFormStatus("请至少填写 WhatsApp/电话或邮箱。");
    return;
  }
  if (payload.email && !isValidEmail(payload.email)) {
    setFormStatus("请输入正确的邮箱格式。");
    return;
  }

  const saved = JSON.parse(localStorage.getItem("zhenzi_messages") || "[]");
  saved.push(payload);
  localStorage.setItem("zhenzi_messages", JSON.stringify(saved));
  form.reset();
  setFormStatus("留言已保存。", true);
});

const translations = {
  zh: {
    nav: ["首页", "紫砂产品", "品质保障", "留言联系"],
    heroTitle: "臻选紫砂，本来之作",
    heroCopy: "以宜兴原矿紫砂为本，做可日用、可品茗、可收藏的器物。器型简洁，泥色温润，适合中东市场的礼赠、茶饮与家用场景。",
    primary: "了解产品",
    secondary: "留言咨询",
  },
  en: {
    nav: ["Home", "Products", "Quality", "Contact"],
    heroTitle: "Authentic Yixing Zisha",
    heroCopy: "Natural Yixing clay, shaped for daily use, tea rituals and gift sets. Calm, tactile and suitable for Middle East buyers.",
    primary: "View Products",
    secondary: "Contact Us",
  },
  ar: {
    nav: ["الرئيسية", "المنتجات", "الجودة", "تواصل"],
    heroTitle: "زيشا ييشينغ أصلية",
    heroCopy: "طين طبيعي من ييشينغ، مناسب للاستخدام اليومي والشاي والهدايا، مع شكل هادئ ولمسة فاخرة.",
    primary: "عرض المنتجات",
    secondary: "تواصل معنا",
  },
};

const setText = (selector, value) => {
  const node = document.querySelector(selector);
  if (node) node.textContent = value;
};

const applyLanguage = (lang) => {
  const copy = translations[lang] || translations.zh;
  document.documentElement.lang = lang === "zh" ? "zh-CN" : lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.body.dataset.lang = lang;
  document.querySelectorAll(".site-nav a").forEach((link, index) => {
    link.textContent = copy.nav[index] || link.textContent;
  });
  setText("#hero-title", copy.heroTitle);
  setText(".hero-copy", copy.heroCopy);
  setText(".hero-actions .primary", copy.primary);
  setText(".hero-actions .secondary", copy.secondary);
  langButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.lang === lang));
  localStorage.setItem("zhenzi_lang", lang);
};

langButtons.forEach((button) => {
  button.addEventListener("click", () => applyLanguage(button.dataset.lang || "zh"));
});
applyLanguage(localStorage.getItem("zhenzi_lang") || "zh");
