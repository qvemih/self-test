const fs = require("node:fs");
const path = require("node:path");
const { getDatabase } = require("../repositories/database");
const { verifyPassword } = require("../utils/password");
const contentService = require("./content-service");

const rootDir = path.resolve(__dirname, "../..");

function boolToInt(value) {
  return value === true || value === 1 || value === "1" || value === "true" ? 1 : 0;
}

function nullableNumber(value) {
  if (value === undefined || value === null || value === "") return null;
  return Number(value);
}

function normalizeSectionKey(value) {
  if (value !== undefined && value !== null && String(value).trim() !== "") {
    return String(value).trim();
  }
  return `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function runUpdate(table, idColumn, idValue, fields, payload) {
  const db = getDatabase();
  const tablesWithUpdatedAt = new Set(["pages", "page_sections", "products"]);
  const columns = [];
  const values = [];
  for (const [field, normalizer] of Object.entries(fields)) {
    if (Object.prototype.hasOwnProperty.call(payload, field)) {
      columns.push(`${field} = ?`);
      values.push(normalizer ? normalizer(payload[field]) : payload[field]);
    }
  }
  if (!columns.length) return getById(table, idColumn, idValue);
  if (tablesWithUpdatedAt.has(table)) {
    columns.push("updated_at = CURRENT_TIMESTAMP");
  }
  values.push(idValue);
  db.prepare(`UPDATE ${table} SET ${columns.join(", ")} WHERE ${idColumn} = ?`).run(...values);
  return getById(table, idColumn, idValue);
}

function getById(table, idColumn, idValue) {
  return getDatabase().prepare(`SELECT * FROM ${table} WHERE ${idColumn} = ?`).get(idValue);
}

function authenticateAdmin(username, password) {
  const db = getDatabase();
  const user = db.prepare("SELECT * FROM admin_users WHERE username = ? AND is_active = 1").get(username);
  if (!user || !verifyPassword(password, user.password_hash)) return null;
  db.prepare("UPDATE admin_users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?").run(user.id);
  return { id: user.id, username: user.username };
}

function getDashboardData() {
  const db = getDatabase();
  return {
    products: db.prepare("SELECT COUNT(*) AS count FROM products").get().count,
    report_groups: db.prepare("SELECT COUNT(*) AS count FROM quality_report_groups").get().count,
    report_images: db.prepare("SELECT COUNT(*) AS count FROM quality_report_images").get().count,
    messages: db.prepare("SELECT COUNT(*) AS count FROM messages").get().count,
    media_files: db.prepare("SELECT COUNT(*) AS count FROM media_files").get().count
  };
}

function updateSiteSettings(payload) {
  const db = getDatabase();
  db.prepare(`
    UPDATE site_settings
    SET site_name = ?, company_name = ?, logo_image_id = ?, phone = ?, email = ?, address = ?, wechat = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = 1
  `).run(
    payload.site_name,
    payload.company_name,
    nullableNumber(payload.logo_image_id),
    payload.phone || "",
    payload.email || "",
    payload.address || "",
    payload.wechat || ""
  );
  return contentService.getSiteSettings();
}

function listPages() {
  const db = getDatabase();
  return db.prepare(`
    SELECT p.*, m.file_path AS hero_image_url
    FROM pages p
    LEFT JOIN media_files m ON m.id = p.hero_image_id
    ORDER BY p.id ASC
  `).all().map((row) => ({ ...row, is_published: Boolean(row.is_published) }));
}

function updatePage(slug, payload) {
  const db = getDatabase();
  db.prepare(`
    UPDATE pages
    SET title = ?, hero_title = ?, hero_subtitle = ?, hero_image_id = ?, is_published = ?, updated_at = CURRENT_TIMESTAMP
    WHERE slug = ?
  `).run(
    payload.title,
    payload.hero_title || "",
    payload.hero_subtitle || "",
    nullableNumber(payload.hero_image_id),
    boolToInt(payload.is_published),
    slug
  );
  return contentService.getPageBySlug(slug) || getDatabase().prepare("SELECT * FROM pages WHERE slug = ?").get(slug);
}

function listPageSections() {
  const db = getDatabase();
  return db.prepare(`
    SELECT s.*, p.slug AS page_slug, p.title AS page_title, m.file_path AS image_url
    FROM page_sections s
    JOIN pages p ON p.id = s.page_id
    LEFT JOIN media_files m ON m.id = s.image_id
    ORDER BY p.id ASC, s.sort_order ASC, s.id ASC
  `).all().map((row) => ({ ...row, is_visible: Boolean(row.is_visible) }));
}

function createPageSection(payload) {
  const db = getDatabase();
  const sectionKey = normalizeSectionKey(payload.section_key);
  const result = db.prepare(`
    INSERT INTO page_sections (page_id, section_key, title, subtitle, body, image_id, sort_order, is_visible)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    Number(payload.page_id),
    sectionKey,
    payload.title || "",
    payload.subtitle || "",
    payload.body || "",
    nullableNumber(payload.image_id),
    Number(payload.sort_order || 0),
    boolToInt(payload.is_visible)
  );
  return getById("page_sections", "id", Number(result.lastInsertRowid));
}

function updatePageSection(id, payload) {
  const normalizedPayload = { ...payload };
  if (Object.prototype.hasOwnProperty.call(normalizedPayload, "section_key")) {
    normalizedPayload.section_key = normalizeSectionKey(normalizedPayload.section_key);
  }
  return runUpdate("page_sections", "id", Number(id), {
    page_id: Number,
    section_key: String,
    title: String,
    subtitle: String,
    body: String,
    image_id: nullableNumber,
    sort_order: Number,
    is_visible: boolToInt
  }, normalizedPayload);
}

function deleteRow(table, id) {
  getDatabase().prepare(`DELETE FROM ${table} WHERE id = ?`).run(Number(id));
  return { ok: true };
}

function createNavigationItem(payload) {
  const db = getDatabase();
  const result = db.prepare(`
    INSERT INTO navigation_items (label, path, sort_order, is_visible)
    VALUES (?, ?, ?, ?)
  `).run(payload.label, payload.path, Number(payload.sort_order || 0), boolToInt(payload.is_visible));
  return getById("navigation_items", "id", Number(result.lastInsertRowid));
}

function updateNavigationItem(id, payload) {
  return runUpdate("navigation_items", "id", Number(id), {
    label: String,
    path: String,
    sort_order: Number,
    is_visible: boolToInt
  }, payload);
}

function createHomeSlide(payload) {
  const db = getDatabase();
  const result = db.prepare(`
    INSERT INTO home_slides (title, subtitle, image_id, link_url, sort_order, is_visible)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(payload.title, payload.subtitle || "", nullableNumber(payload.image_id), payload.link_url || "", Number(payload.sort_order || 0), boolToInt(payload.is_visible));
  return getById("home_slides", "id", Number(result.lastInsertRowid));
}

function updateHomeSlide(id, payload) {
  return runUpdate("home_slides", "id", Number(id), {
    title: String,
    subtitle: String,
    image_id: nullableNumber,
    link_url: String,
    sort_order: Number,
    is_visible: boolToInt
  }, payload);
}

function createProductCategory(payload) {
  const db = getDatabase();
  const result = db.prepare(`
    INSERT INTO product_categories (name, slug, sort_order, is_visible)
    VALUES (?, ?, ?, ?)
  `).run(payload.name, payload.slug, Number(payload.sort_order || 0), boolToInt(payload.is_visible));
  return getById("product_categories", "id", Number(result.lastInsertRowid));
}

function updateProductCategory(id, payload) {
  return runUpdate("product_categories", "id", Number(id), {
    name: String,
    slug: String,
    sort_order: Number,
    is_visible: boolToInt
  }, payload);
}

function createProduct(payload) {
  const db = getDatabase();
  const result = db.prepare(`
    INSERT INTO products (category_id, name, summary, material, specification, image_id, is_insured, sort_order, is_visible)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    nullableNumber(payload.category_id),
    payload.name,
    payload.summary || "",
    payload.material || "",
    payload.specification || "",
    nullableNumber(payload.image_id),
    boolToInt(payload.is_insured),
    Number(payload.sort_order || 0),
    boolToInt(payload.is_visible)
  );
  return getById("products", "id", Number(result.lastInsertRowid));
}

function updateProduct(id, payload) {
  return runUpdate("products", "id", Number(id), {
    category_id: nullableNumber,
    name: String,
    summary: String,
    material: String,
    specification: String,
    image_id: nullableNumber,
    is_insured: boolToInt,
    sort_order: Number,
    is_visible: boolToInt
  }, payload);
}

function createReportGroup(payload) {
  const db = getDatabase();
  const result = db.prepare(`
    INSERT INTO quality_report_groups (title, slug, sort_order, is_visible)
    VALUES (?, ?, ?, ?)
  `).run(payload.title, payload.slug, Number(payload.sort_order || 0), boolToInt(payload.is_visible));
  return getById("quality_report_groups", "id", Number(result.lastInsertRowid));
}

function updateReportGroup(id, payload) {
  return runUpdate("quality_report_groups", "id", Number(id), {
    title: String,
    slug: String,
    sort_order: Number,
    is_visible: boolToInt
  }, payload);
}

function listReportImages() {
  const db = getDatabase();
  return db.prepare(`
    SELECT r.*, g.title AS group_title, m.file_path AS image_url
    FROM quality_report_images r
    JOIN quality_report_groups g ON g.id = r.group_id
    LEFT JOIN media_files m ON m.id = r.image_id
    ORDER BY g.sort_order ASC, r.sort_order ASC, r.id ASC
  `).all().map((row) => ({ ...row, is_visible: Boolean(row.is_visible) }));
}

function createReportImage(payload) {
  const db = getDatabase();
  const result = db.prepare(`
    INSERT INTO quality_report_images (group_id, image_id, alt_text, sort_order, is_visible)
    VALUES (?, ?, ?, ?, ?)
  `).run(Number(payload.group_id), nullableNumber(payload.image_id), payload.alt_text || "", Number(payload.sort_order || 0), boolToInt(payload.is_visible));
  return getById("quality_report_images", "id", Number(result.lastInsertRowid));
}

function updateReportImage(id, payload) {
  return runUpdate("quality_report_images", "id", Number(id), {
    group_id: Number,
    image_id: nullableNumber,
    alt_text: String,
    sort_order: Number,
    is_visible: boolToInt
  }, payload);
}

function listMessages() {
  const db = getDatabase();
  return db.prepare("SELECT * FROM messages ORDER BY created_at DESC, id DESC").all();
}

function updateMessage(id, payload) {
  const status = payload.status || "new";
  const handledAt = status === "new" ? null : new Date().toISOString();
  getDatabase().prepare(`
    UPDATE messages
    SET status = ?, remark = ?, handled_at = ?
    WHERE id = ?
  `).run(status, payload.remark || "", handledAt, Number(id));
  return getById("messages", "id", Number(id));
}

function listMediaFiles() {
  return getDatabase().prepare("SELECT * FROM media_files ORDER BY created_at DESC, id DESC").all();
}

function createMediaFile(file, fields = {}) {
  const db = getDatabase();
  const targetDir = fields.kind === "report" ? "uploads/reports" : "uploads/images";
  const absoluteDir = path.join(rootDir, targetDir);
  fs.mkdirSync(absoluteDir, { recursive: true });
  const safeBase = path.basename(file.filename || "upload.bin").replace(/[^a-zA-Z0-9._-]/g, "-");
  const uniqueName = `${Date.now()}-${safeBase}`;
  const absolutePath = path.join(absoluteDir, uniqueName);
  fs.writeFileSync(absolutePath, file.data);
  const publicPath = `/${targetDir}/${uniqueName}`;
  const result = db.prepare(`
    INSERT INTO media_files (original_name, file_name, file_path, mime_type, file_size, alt_text)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(file.filename, uniqueName, publicPath, file.mimeType || "application/octet-stream", file.data.length, fields.alt_text || file.filename);
  return getById("media_files", "id", Number(result.lastInsertRowid));
}

function deleteMediaFile(id) {
  const db = getDatabase();
  const media = getById("media_files", "id", Number(id));
  if (!media) return { ok: true };
  const checks = [
    ["site_settings", "logo_image_id"],
    ["pages", "hero_image_id"],
    ["page_sections", "image_id"],
    ["home_slides", "image_id"],
    ["products", "image_id"],
    ["quality_report_images", "image_id"]
  ];
  for (const [table, column] of checks) {
    const count = db.prepare(`SELECT COUNT(*) AS count FROM ${table} WHERE ${column} = ?`).get(Number(id)).count;
    if (count > 0) {
      const error = new Error("图片正在被页面、产品或报告使用，不能删除。");
      error.statusCode = 409;
      throw error;
    }
  }
  db.prepare("DELETE FROM media_files WHERE id = ?").run(Number(id));
  const absolutePath = path.join(rootDir, media.file_path.replace(/^\//, ""));
  if (fs.existsSync(absolutePath)) fs.unlinkSync(absolutePath);
  return { ok: true };
}

module.exports = {
  authenticateAdmin,
  getDashboardData,
  updateSiteSettings,
  listPages,
  updatePage,
  listPageSections,
  createPageSection,
  updatePageSection,
  deleteRow,
  createNavigationItem,
  updateNavigationItem,
  createHomeSlide,
  updateHomeSlide,
  createProductCategory,
  updateProductCategory,
  createProduct,
  updateProduct,
  createReportGroup,
  updateReportGroup,
  listReportImages,
  createReportImage,
  updateReportImage,
  listMessages,
  updateMessage,
  listMediaFiles,
  createMediaFile,
  deleteMediaFile
};
