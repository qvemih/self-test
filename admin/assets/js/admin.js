const state = {
  module: "dashboard",
  media: [],
  pages: [],
  categories: [],
  reportGroups: [],
  editing: null
};

const modules = [
  ["dashboard", "概览"],
  ["site", "基础设置"],
  ["navigation", "导航管理"],
  ["pages", "页面管理"],
  ["sections", "页面模块"],
  ["slides", "首页轮播"],
  ["categories", "产品分类"],
  ["products", "产品管理"],
  ["reportGroups", "报告分组"],
  ["reportImages", "报告图片"],
  ["messages", "留言管理"],
  ["media", "媒体库"]
];

async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: "same-origin",
    ...options,
    headers: options.body instanceof FormData ? options.headers : {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "请求失败");
  return data;
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  }[char]));
}

function boolValue(value) {
  return value === true || value === 1 ? "1" : "0";
}

function fieldValue(data, field) {
  if (!data) return field.defaultValue ?? "";
  return data[field.name] ?? "";
}

async function ensureLogin() {
  const session = await request("/api/admin/session");
  if (!session.user) location.href = "/admin/login";
}

async function refreshRefs() {
  const [media, pages, categories, reportGroups] = await Promise.all([
    request("/api/admin/media-files"),
    request("/api/admin/pages"),
    request("/api/admin/product-categories"),
    request("/api/admin/quality-report-groups")
  ]);
  state.media = media;
  state.pages = pages;
  state.categories = categories;
  state.reportGroups = reportGroups;
}

function mediaOptions(selected) {
  return `<option value="">不选择</option>${state.media.map((item) => `<option value="${item.id}" ${Number(selected) === item.id ? "selected" : ""}>${escapeHtml(item.file_path)}</option>`).join("")}`;
}

function requiredMediaOptions(selected) {
  return `<option value="">请选择图片</option>${state.media.map((item) => `<option value="${item.id}" ${Number(selected) === item.id ? "selected" : ""}>${escapeHtml(item.file_path)}</option>`).join("")}`;
}

function requiredReportGroupOptions(selected) {
  return `<option value="">请选择报告分组</option>${state.reportGroups.map((item) => `<option value="${item.id}" ${Number(selected) === item.id ? "selected" : ""}>${escapeHtml(item.title)}</option>`).join("")}`;
}

function requiredVisibilityOptions(selected) {
  return `<option value="">请选择是否显示</option><option value="1" ${String(selected) === "1" ? "selected" : ""}>显示/启用</option><option value="0" ${String(selected) === "0" ? "selected" : ""}>隐藏/停用</option>`;
}

function pageOptions(selected) {
  return state.pages.map((item) => `<option value="${item.id}" ${Number(selected) === item.id ? "selected" : ""}>${escapeHtml(item.title)} / ${escapeHtml(item.slug)}</option>`).join("");
}

function categoryOptions(selected) {
  return `<option value="">不选择</option>${state.categories.filter((item) => item.slug !== "all").map((item) => `<option value="${item.id}" ${Number(selected) === item.id ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}`;
}

function reportGroupOptions(selected) {
  return state.reportGroups.map((item) => `<option value="${item.id}" ${Number(selected) === item.id ? "selected" : ""}>${escapeHtml(item.title)}</option>`).join("");
}

function renderNav() {
  document.querySelector("[data-admin-nav]").innerHTML = modules.map(([key, label]) => (
    `<button type="button" class="${state.module === key ? "is-active" : ""}" data-module="${key}">${label}</button>`
  )).join("");
  document.querySelectorAll("[data-module]").forEach((button) => {
    button.addEventListener("click", () => {
      state.module = button.dataset.module;
      state.editing = null;
      render();
    });
  });
}

function inputField(field, data) {
  const value = fieldValue(data, field);
  const labelClass = field.type === "textarea" ? "wide" : "";
  const requiredAttr = field.required ? "required" : "";
  if (field.type === "textarea") {
    return `<label class="${labelClass}"><span>${field.label}</span><textarea name="${field.name}" ${requiredAttr}>${escapeHtml(value)}</textarea></label>`;
  }
  if (field.type === "select") {
    return `<label><span>${field.label}</span><select name="${field.name}" ${requiredAttr}>${field.options(value)}</select></label>`;
  }
  if (field.type === "boolean") {
    return `<label><span>${field.label}</span><select name="${field.name}"><option value="1" ${boolValue(value) === "1" ? "selected" : ""}>显示/启用</option><option value="0" ${boolValue(value) === "0" ? "selected" : ""}>隐藏/停用</option></select></label>`;
  }
  return `<label class="${labelClass}"><span>${field.label}</span><input type="${field.type || "text"}" name="${field.name}" value="${escapeHtml(value)}" ${requiredAttr}></label>`;
}

function formDataToJson(form) {
  const payload = Object.fromEntries(new FormData(form).entries());
  for (const key of Object.keys(payload)) {
    if (payload[key] === "") payload[key] = null;
  }
  return payload;
}

async function renderCrud(config) {
  await refreshRefs();
  const list = await request(config.endpoint);
  const content = document.querySelector("[data-admin-content]");
  const editing = state.editing ? list.find((item) => String(item[config.idField || "id"]) === String(state.editing)) : null;
  content.innerHTML = `
    <section class="admin-card">
      <h2>${editing ? "编辑" : "新增"}${config.title}</h2>
      <form class="admin-form" data-crud-form>
        ${config.fields.map((field) => inputField(field, editing)).join("")}
        <div class="admin-actions">
          <button type="submit">${editing ? "保存修改" : "新增"}</button>
          ${editing ? `<button class="secondary" type="button" data-cancel-edit>取消编辑</button>` : ""}
        </div>
      </form>
      <p class="status-text" data-status></p>
    </section>
    <section class="admin-card">
      <h2>${config.title}列表</h2>
      ${renderTable(list, config)}
    </section>
  `;

  document.querySelector("[data-crud-form]").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const payload = formDataToJson(form);
    const path = editing ? `${config.endpoint}/${editing[config.idField || "id"]}` : config.endpoint;
    const method = editing ? "PUT" : "POST";
    try {
      await request(path, { method, body: JSON.stringify(payload) });
      state.editing = null;
      await render();
    } catch (error) {
      document.querySelector("[data-status]").textContent = error.message;
    }
  });

  const cancel = document.querySelector("[data-cancel-edit]");
  if (cancel) cancel.addEventListener("click", () => {
    state.editing = null;
    render();
  });
  bindTableActions(config);
}

function renderTable(list, config) {
  return `
    <table class="data-table">
      <thead><tr>${config.columns.map((column) => `<th>${column.label}</th>`).join("")}<th>操作</th></tr></thead>
      <tbody>
        ${list.map((item) => `
          <tr>
            ${config.columns.map((column) => `<td>${column.render ? column.render(item) : escapeHtml(item[column.name] ?? "")}</td>`).join("")}
            <td class="table-actions">
              <button type="button" data-edit-id="${item[config.idField || "id"]}">编辑</button>
              <button class="secondary" type="button" data-delete-id="${item[config.idField || "id"]}">删除</button>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function bindTableActions(config) {
  document.querySelectorAll("[data-edit-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.editing = button.dataset.editId;
      render();
    });
  });
  document.querySelectorAll("[data-delete-id]").forEach((button) => {
    button.addEventListener("click", async () => {
      if (!confirm("确认删除？")) return;
      try {
        await request(`${config.endpoint}/${button.dataset.deleteId}`, { method: "DELETE" });
        state.editing = null;
        await render();
      } catch (error) {
        alert(error.message);
      }
    });
  });
}

async function renderDashboard() {
  const data = await request("/api/admin/dashboard");
  document.querySelector("[data-admin-content]").innerHTML = `
    <section class="stats-grid">
      ${Object.entries(data).map(([key, value]) => `<article class="stat-card"><span>${key}</span><strong>${value}</strong></article>`).join("")}
    </section>
  `;
}

async function renderSiteSettings() {
  await refreshRefs();
  const data = await request("/api/admin/site-settings");
  const content = document.querySelector("[data-admin-content]");
  const fields = [
    { name: "site_name", label: "网站名称", required: true },
    { name: "company_name", label: "公司名称", required: true },
    { name: "logo_image_id", label: "logo 图片", type: "select", options: mediaOptions },
    { name: "phone", label: "联系电话" },
    { name: "email", label: "邮箱" },
    { name: "address", label: "地址" },
    { name: "wechat", label: "微信" }
  ];
  content.innerHTML = `
    <section class="admin-card">
      <h2>基础设置</h2>
      <form class="admin-form" data-site-form>
        ${fields.map((field) => inputField(field, { ...data, logo_image_id: data.logo ? data.logo.id : "" })).join("")}
        <div class="admin-actions"><button type="submit">保存</button></div>
      </form>
      <p class="status-text" data-status></p>
    </section>
  `;
  document.querySelector("[data-site-form]").addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await request("/api/admin/site-settings", { method: "PUT", body: JSON.stringify(formDataToJson(event.currentTarget)) });
      document.querySelector("[data-status]").textContent = "已保存";
    } catch (error) {
      document.querySelector("[data-status]").textContent = error.message;
    }
  });
}

async function renderPages() {
  await refreshRefs();
  const list = await request("/api/admin/pages");
  const editing = state.editing ? list.find((item) => item.slug === state.editing) : list[0];
  state.editing = editing.slug;
  const fields = [
    { name: "title", label: "页面标题", required: true },
    { name: "hero_title", label: "头图标题" },
    { name: "hero_subtitle", label: "头图副标题" },
    { name: "hero_image_id", label: "头图图片", type: "select", options: mediaOptions },
    { name: "is_published", label: "发布状态", type: "boolean" }
  ];
  document.querySelector("[data-admin-content]").innerHTML = `
    <section class="admin-card">
      <h2>页面管理</h2>
      <p>当前编辑：${escapeHtml(editing.slug)}</p>
      <form class="admin-form" data-page-form>
        ${fields.map((field) => inputField(field, editing)).join("")}
        <div class="admin-actions"><button type="submit">保存页面</button></div>
      </form>
      <p class="status-text" data-status></p>
    </section>
    <section class="admin-card">
      ${renderTable(list, {
        endpoint: "/api/admin/pages",
        idField: "slug",
        columns: [
          { name: "slug", label: "页面标识" },
          { name: "title", label: "标题" },
          { name: "hero_title", label: "头图标题" }
        ]
      })}
    </section>
  `;
  document.querySelector("[data-page-form]").addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await request(`/api/admin/pages/${editing.slug}`, { method: "PUT", body: JSON.stringify(formDataToJson(event.currentTarget)) });
      await render();
    } catch (error) {
      document.querySelector("[data-status]").textContent = error.message;
    }
  });
  document.querySelectorAll("[data-edit-id]").forEach((button) => button.addEventListener("click", () => {
    state.editing = button.dataset.editId;
    render();
  }));
  document.querySelectorAll("[data-delete-id]").forEach((button) => button.remove());
}

const crudConfigs = {
  navigation: {
    title: "导航",
    endpoint: "/api/admin/navigation-items",
    fields: [
      { name: "label", label: "导航名称", required: true },
      { name: "path", label: "跳转地址", required: true },
      { name: "sort_order", label: "排序", type: "number", required: true },
      { name: "is_visible", label: "是否显示", type: "boolean" }
    ],
    columns: [
      { name: "label", label: "名称" },
      { name: "path", label: "地址" },
      { name: "sort_order", label: "排序" },
      { name: "is_visible", label: "显示", render: (item) => item.is_visible ? "是" : "否" }
    ]
  },
  sections: {
    title: "页面模块",
    endpoint: "/api/admin/page-sections",
    fields: [
      { name: "page_id", label: "所属页面", type: "select", options: pageOptions },
      { name: "section_key", label: "模块标识" },
      { name: "title", label: "模块标题" },
      { name: "subtitle", label: "副标题" },
      { name: "body", label: "正文", type: "textarea" },
      { name: "image_id", label: "配图", type: "select", options: mediaOptions },
      { name: "sort_order", label: "排序", type: "number" },
      { name: "is_visible", label: "是否显示", type: "boolean", defaultValue: 1 }
    ],
    columns: [
      { name: "page_title", label: "页面" },
      { name: "section_key", label: "模块标识" },
      { name: "title", label: "标题" },
      { name: "sort_order", label: "排序" }
    ]
  },
  slides: {
    title: "首页轮播",
    endpoint: "/api/admin/home-slides",
    fields: [
      { name: "title", label: "标题", required: true },
      { name: "subtitle", label: "副标题", required: true },
      { name: "image_id", label: "图片", type: "select", options: requiredMediaOptions, required: true },
      { name: "link_url", label: "跳转地址", required: true },
      { name: "sort_order", label: "排序", type: "number", required: true },
      { name: "is_visible", label: "是否显示", type: "boolean", defaultValue: 1 }
    ],
    columns: [
      { name: "title", label: "标题" },
      { name: "subtitle", label: "副标题" },
      { name: "sort_order", label: "排序" }
    ]
  },
  categories: {
    title: "产品分类",
    endpoint: "/api/admin/product-categories",
    fields: [
      { name: "name", label: "分类名称", required: true },
      { name: "slug", label: "分类标识", required: true },
      { name: "sort_order", label: "排序", type: "number", required: true },
      { name: "is_visible", label: "是否显示", type: "boolean", defaultValue: 1 }
    ],
    columns: [
      { name: "name", label: "名称" },
      { name: "slug", label: "标识" },
      { name: "sort_order", label: "排序" }
    ]
  },
  products: {
    title: "产品",
    endpoint: "/api/admin/products",
    fields: [
      { name: "category_id", label: "所属分类", type: "select", options: categoryOptions, required: true },
      { name: "name", label: "产品名称", required: true },
      { name: "summary", label: "工艺及特点", required: true },
      { name: "material", label: "材质", required: true },
      { name: "specification", label: "规格及容量", required: true },
      { name: "image_id", label: "产品图片", type: "select", options: requiredMediaOptions, required: true },
      { name: "is_insured", label: "已投保标识", type: "boolean", defaultValue: 1 },
      { name: "sort_order", label: "排序", type: "number", required: true },
      { name: "is_visible", label: "是否显示", type: "boolean", defaultValue: 1 }
    ],
    columns: [
      { name: "name", label: "名称" },
      { name: "category", label: "分类", render: (item) => item.category ? item.category.name : "" },
      { name: "image", label: "图片", render: (item) => item.image ? `<img class="thumb" src="${item.image.url}" alt="">` : "" },
      { name: "is_insured", label: "已投保", render: (item) => item.is_insured ? "是" : "否" }
    ]
  },
  reportGroups: {
    title: "检测报告分组",
    endpoint: "/api/admin/quality-report-groups",
    fields: [
      { name: "title", label: "报告名称", required: true },
      { name: "slug", label: "报告标识", required: true },
      { name: "sort_order", label: "排序", type: "number", required: true },
      { name: "is_visible", label: "是否显示", type: "boolean", defaultValue: 1 }
    ],
    columns: [
      { name: "title", label: "报告名称" },
      { name: "slug", label: "标识" },
      { name: "sort_order", label: "排序" }
    ]
  },
  reportImages: {
    title: "检测报告图片",
    endpoint: "/api/admin/quality-report-images",
    fields: [
      { name: "group_id", label: "报告分组", type: "select", options: requiredReportGroupOptions, required: true },
      { name: "image_id", label: "报告图片", type: "select", options: requiredMediaOptions, required: true },
      { name: "alt_text", label: "图片说明", required: true },
      { name: "sort_order", label: "排序", type: "number", required: true },
      { name: "is_visible", label: "是否显示", type: "select", options: requiredVisibilityOptions, required: true, defaultValue: "1" }
    ],
    columns: [
      { name: "group_title", label: "报告分组" },
      { name: "image_url", label: "图片", render: (item) => item.image_url ? `<img class="thumb" src="${item.image_url}" alt="">` : "" },
      { name: "sort_order", label: "排序" }
    ]
  }
};

async function renderMessages() {
  const list = await request("/api/admin/messages");
  document.querySelector("[data-admin-content]").innerHTML = `
    <section class="admin-card">
      <h2>留言管理</h2>
      <table class="data-table">
        <thead><tr><th>姓名</th><th>电话</th><th>微信</th><th>意向</th><th>内容</th><th>状态</th><th>备注</th><th>操作</th></tr></thead>
        <tbody>
          ${list.map((item) => `
            <tr>
              <td>${escapeHtml(item.name)}</td>
              <td>${escapeHtml(item.phone)}</td>
              <td>${escapeHtml(item.wechat || "")}</td>
              <td>${escapeHtml(item.product_interest || "")}</td>
              <td>${escapeHtml(item.content || "")}</td>
              <td>
                <select data-message-status="${item.id}">
                  ${["new", "contacted", "closed"].map((status) => `<option value="${status}" ${item.status === status ? "selected" : ""}>${status}</option>`).join("")}
                </select>
              </td>
              <td><input data-message-remark="${item.id}" value="${escapeHtml(item.remark || "")}"></td>
              <td class="table-actions">
                <button type="button" data-save-message="${item.id}">保存</button>
                <button class="secondary" type="button" data-delete-message="${item.id}">删除</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </section>
  `;
  document.querySelectorAll("[data-save-message]").forEach((button) => button.addEventListener("click", async () => {
    const id = button.dataset.saveMessage;
    await request(`/api/admin/messages/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        status: document.querySelector(`[data-message-status="${id}"]`).value,
        remark: document.querySelector(`[data-message-remark="${id}"]`).value
      })
    });
    await renderMessages();
  }));
  document.querySelectorAll("[data-delete-message]").forEach((button) => button.addEventListener("click", async () => {
    if (!confirm("确认删除留言？")) return;
    await request(`/api/admin/messages/${button.dataset.deleteMessage}`, { method: "DELETE" });
    await renderMessages();
  }));
}

async function renderMedia() {
  await refreshRefs();
  document.querySelector("[data-admin-content]").innerHTML = `
    <section class="admin-card">
      <h2>上传图片</h2>
      <form class="admin-form" data-upload-form>
        <label><span>图片类型</span><select name="kind"><option value="image">普通图片</option><option value="report">检测报告</option></select></label>
        <label><span>图片说明</span><input name="alt_text"></label>
        <label class="wide"><span>选择文件</span><input type="file" name="file" accept="image/*" required></label>
        <div class="admin-actions"><button type="submit">上传</button></div>
      </form>
      <p class="status-text" data-status></p>
    </section>
    <section class="admin-card">
      <h2>媒体文件</h2>
      <table class="data-table">
        <thead><tr><th>预览</th><th>路径</th><th>说明</th><th>大小</th><th>操作</th></tr></thead>
        <tbody>
          ${state.media.map((item) => `
            <tr>
              <td>
                <button class="media-preview-trigger" type="button" data-media-preview="${escapeHtml(item.file_path)}" data-media-alt="${escapeHtml(item.alt_text || item.file_path)}" aria-label="放大预览图片">
                  <img class="thumb" src="${item.file_path}" alt="">
                </button>
              </td>
              <td>${escapeHtml(item.file_path)}</td>
              <td>${escapeHtml(item.alt_text || "")}</td>
              <td>${item.file_size}</td>
              <td class="table-actions"><button class="secondary" type="button" data-delete-media="${item.id}">删除</button></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </section>
    <div class="media-lightbox" data-media-lightbox aria-hidden="true">
      <button class="media-lightbox-close" type="button" data-media-lightbox-close aria-label="关闭预览">&times;</button>
      <img src="" alt="">
    </div>
  `;
  const lightbox = document.querySelector("[data-media-lightbox]");
  const lightboxImage = lightbox.querySelector("img");
  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.removeAttribute("src");
    lightboxImage.alt = "";
  };
  document.querySelectorAll("[data-media-preview]").forEach((button) => {
    button.addEventListener("click", () => {
      lightboxImage.src = button.dataset.mediaPreview;
      lightboxImage.alt = button.dataset.mediaAlt || "媒体图片预览";
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.querySelector("[data-media-lightbox-close]").focus();
    });
  });
  document.querySelector("[data-media-lightbox-close]").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
  });
  document.querySelector("[data-upload-form]").addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      await request("/api/admin/media-files", { method: "POST", body: formData, headers: {} });
      await renderMedia();
    } catch (error) {
      document.querySelector("[data-status]").textContent = error.message;
    }
  });
  document.querySelectorAll("[data-delete-media]").forEach((button) => button.addEventListener("click", async () => {
    if (!confirm("确认删除图片？正在使用的图片不能删除。")) return;
    try {
      await request(`/api/admin/media-files/${button.dataset.deleteMedia}`, { method: "DELETE" });
      await renderMedia();
    } catch (error) {
      alert(error.message);
    }
  }));
}

async function render() {
  renderNav();
  document.querySelector("[data-module-title]").textContent = modules.find(([key]) => key === state.module)[1];
  if (state.module === "dashboard") return renderDashboard();
  if (state.module === "site") return renderSiteSettings();
  if (state.module === "pages") return renderPages();
  if (state.module === "messages") return renderMessages();
  if (state.module === "media") return renderMedia();
  return renderCrud(crudConfigs[state.module]);
}

document.querySelector("[data-logout]").addEventListener("click", async () => {
  await request("/api/admin/logout", { method: "POST", body: JSON.stringify({}) });
  location.href = "/admin/login";
});

ensureLogin().then(render).catch(() => {
  location.href = "/admin/login";
});
