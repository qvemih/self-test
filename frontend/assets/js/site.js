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

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
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
    <a class="brand" href="/index.html" aria-label="${escapeHtml(settings.site_name)}返回首页">
      ${settings.logo ? `<img class="brand-logo" src="${settings.logo.url}" alt="${escapeHtml(settings.logo.alt || settings.site_name)}">` : ""}
      <span class="brand-name">${escapeHtml(settings.site_name)}</span>
    </a>
    <nav class="site-nav" aria-label="主导航">
      ${navItems.map((item) => `<a class="${item.path === activePath ? "active" : ""}" href="${item.path}">${escapeHtml(item.label)}</a>`).join("")}
    </nav>
  `;
  return settings;
}

function renderFooter(settings) {
  const footer = document.querySelector("[data-site-footer]");
  if (!footer) return;
  footer.innerHTML = `
    <div>
      <h2>公司名称</h2>
      <p>${escapeHtml(settings.company_name)}</p>
      <p>关于我们：专注紫砂产品展示、资料说明与客户咨询连接。</p>
    </div>
    <div>
      <h2>联系方式</h2>
      <p>联系电话：${escapeHtml(settings.phone || "待补充")}</p>
      <p>地址：${escapeHtml(settings.address || "待补充")}</p>
      <p>邮箱/QQ邮箱：${escapeHtml(settings.email || "待补充")}</p>
    </div>
    <a class="footer-link" href="/contact.html">留言咨询</a>
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

async function initPage(activePath) {
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
    <section class="home-carousel" aria-label="首页首屏轮播">
      <div class="slides dynamic-slides">
        ${slides.map((slide) => `
          <article class="slide">
            ${slide.image ? `<img src="${slide.image.url}" alt="${escapeHtml(slide.image.alt || slide.title)}">` : ""}
            <div class="slide-copy">
              <p>${escapeHtml(slide.subtitle || "")}</p>
              <h1>${escapeHtml(slide.title)}</h1>
            </div>
          </article>
        `).join("")}
      </div>
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
        <h2>宜兴紫砂· 纯手工制作流程</h2>
        <p>从原矿紫砂泥料到手工成型，再经窑火淬炼，每一把壶都由匠人一手完成。</p>
      </div>
      <div class="process-timeline" aria-label="宜兴紫砂纯手工制作流程">
        ${steps.map((step, index) => `
          <article class="process-step ${index % 2 ? "process-step-reverse" : ""}">
            <figure class="process-media">
              ${step.image ? `<img src="${step.image.url}" alt="${escapeHtml(step.image.alt || step.title)}">` : ""}
            </figure>
            <div class="process-marker"><span>${String(index + 1).padStart(2, "0")}</span></div>
            <div class="process-copy">
              <p class="process-kicker">${escapeHtml(step.subtitle || "")}</p>
              <h3>${escapeHtml(step.title || "")}</h3>
              <p>${escapeHtml(step.body || "")}${index === steps.length - 1 ? ` <a class="process-cta" href="/products.html">了解产品</a>` : ""}</p>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
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
    <section class="manual-products section-pad" id="manual-products" aria-label="产品手册">
      <div class="section-title manual-products-title">
        <div class="category-tabs" aria-label="产品分类快捷入口">
          ${categories.map((category, index) => `<button class="category-tab ${index === 0 ? "is-active" : ""}" type="button" data-category-tab="${category.slug}"><span>${escapeHtml(category.name)}</span></button>`).join("")}
        </div>
      </div>
      <div class="manual-category-stack">
        <section class="manual-category-block manual-all-panel">
          <div class="manual-product-grid" data-product-grid></div>
        </section>
      </div>
    </section>
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
    <article class="manual-product-card ${product.is_insured ? "is-insured" : ""}">
      <div class="manual-product-media">
        ${product.image ? `<img src="${product.image.url}" alt="${escapeHtml(product.image.alt || product.name)}">` : ""}
      </div>
      <div class="manual-product-info">
        <p><span>名称</span>${escapeHtml(product.name)}</p>
        <p><span>材质</span>${escapeHtml(product.material || "")}</p>
        <p><span>工艺及特点</span>${escapeHtml(product.summary || "")}</p>
        <p><span>规格及容量</span>${escapeHtml(product.specification || "")}</p>
      </div>
    </article>
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
        ${groups.map((group, index) => `
          <section class="report-group">
            <div class="report-group-title">
              <span>${String(index + 1).padStart(2, "0")}</span>
              <h3>${escapeHtml(group.title)}</h3>
            </div>
            <div class="report-image-grid">
              ${(group.images || []).map((item) => `<figure class="report-figure">${item.image ? `<img src="${item.image.url}" alt="${escapeHtml(item.alt_text || item.image.alt)}">` : ""}</figure>`).join("")}
            </div>
          </section>
        `).join("")}
      </div>
    </section>
  `;
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
        <h2>关于臻紫本作</h2>
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
      <section class="about-facts" aria-label="公司公开资料">
        <div class="about-facts-head"><p>VERIFIED INFORMATION</p><h3>公司公开资料</h3></div>
        <div class="fact-grid">
          ${facts.map((fact) => `<article class="fact-card"><span>${escapeHtml(fact.subtitle || "")}</span><strong>${escapeHtml(fact.title || "")}</strong><p>${escapeHtml(fact.body || "")}</p></article>`).join("")}
        </div>
      </section>
      <section class="about-development" aria-label="公司发展方向">
        <div class="about-facts-head"><p>DEVELOPMENT DIRECTION</p><h3>公司发展方向</h3></div>
        <div class="development-list">
          ${development.map((item) => `<article><span>${escapeHtml(item.subtitle || "")}</span><div><h4>${escapeHtml(item.title || "")}</h4><p>${escapeHtml(item.body || "")}</p></div></article>`).join("")}
        </div>
        <p class="source-note">公开资料来源：宜兴市人民政府网站《2025年10月份刻章企业名单》。涉及成立日期、注册地址、经营范围等工商信息，待企业营业执照或国家企业信用信息公示系统记录补充后再更新。</p>
      </section>
    </section>
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
          <label><span>姓名</span><input type="text" name="name" placeholder="请输入姓名" required></label>
          <label><span>联系电话</span><input type="tel" name="phone" placeholder="请输入联系电话" required></label>
          <label><span>微信号</span><input type="text" name="wechat" placeholder="请输入微信号"></label>
          <label><span>意向产品</span><input type="text" name="product_interest" placeholder="例如：壶类、锅类、杯类"></label>
          <label><span>咨询内容</span><textarea name="content" rows="6" placeholder="请输入想了解的产品、报告或合作需求" required></textarea></label>
          <button type="submit">提交咨询</button>
          <p class="form-status" data-form-status></p>
        </form>
        <aside class="contact-panel">
          <h2>企业联系方式</h2>
          <p><strong>电话：</strong>${escapeHtml(settings.phone || "待补充")}</p>
          <p><strong>地址：</strong>${escapeHtml(settings.address || "待补充")}</p>
          <p><strong>邮箱：</strong>${escapeHtml(settings.email || "待补充")}</p>
          <p><strong>微信：</strong>${escapeHtml(settings.wechat || "待补充")}</p>
        </aside>
      </div>
    </section>
  `;
  const form = document.querySelector("[data-message-form]");
  const status = document.querySelector("[data-form-status]");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      await api.post("/api/messages", payload);
      form.reset();
      status.textContent = "已提交，后台已收到留言。";
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
