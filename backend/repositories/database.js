const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");
const { hashPassword } = require("../utils/password");
const seedData = require("../../database/seeds/seed-data");

const rootDir = path.resolve(__dirname, "../..");
const databaseDir = path.join(rootDir, "database");
const sourceDatabasePath = path.join(databaseDir, "site.sqlite");
const databasePath = process.env.VERCEL ? "/tmp/zisha-site.sqlite" : sourceDatabasePath;
const schemaPath = path.join(databaseDir, "schema.sql");

let database;

function getDatabase() {
  if (!database) {
    fs.mkdirSync(databaseDir, { recursive: true });
    if (process.env.VERCEL && !fs.existsSync(databasePath) && fs.existsSync(sourceDatabasePath)) {
      fs.copyFileSync(sourceDatabasePath, databasePath);
    }
    database = new DatabaseSync(databasePath);
    database.exec("PRAGMA foreign_keys = ON;");
    database.exec(fs.readFileSync(schemaPath, "utf8"));
    seedIfNeeded(database);
  }
  return database;
}

function seedIfNeeded(db) {
  const existing = db.prepare("SELECT COUNT(*) AS count FROM site_settings").get();
  if (existing.count > 0) return;

  const mediaByPath = new Map();
  const categoryBySlug = new Map();
  const pageBySlug = new Map();

  const insertMedia = db.prepare(`
    INSERT INTO media_files (original_name, file_name, file_path, mime_type, file_size, alt_text)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  for (const [originalName, filePath, mimeType, altText] of seedData.mediaFiles) {
    const absolutePath = path.join(rootDir, filePath.replace(/^\//, ""));
    const fileSize = fs.existsSync(absolutePath) ? fs.statSync(absolutePath).size : 0;
    const fileName = path.basename(filePath);
    const result = insertMedia.run(originalName, fileName, filePath, mimeType, fileSize, altText);
    mediaByPath.set(filePath, Number(result.lastInsertRowid));
  }

  db.prepare(`
    INSERT INTO site_settings (id, site_name, company_name, logo_image_id, phone, email, address, wechat)
    VALUES (1, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    "臻紫本作",
    "臻紫本作（宜兴）紫砂文化有限公司",
    mediaByPath.get("/uploads/images/site/zhen-zi-ben-zuo-mark.png"),
    "待补充",
    "待补充",
    "待补充",
    "待补充"
  );

  const insertNav = db.prepare(`
    INSERT INTO navigation_items (label, path, sort_order, is_visible)
    VALUES (?, ?, ?, 1)
  `);
  for (const [label, itemPath, sortOrder] of seedData.navigationItems) {
    insertNav.run(label, itemPath, sortOrder);
  }

  const insertPage = db.prepare(`
    INSERT INTO pages (slug, title, hero_title, hero_subtitle, hero_image_id, is_published)
    VALUES (?, ?, ?, ?, ?, 1)
  `);
  for (const page of seedData.pages) {
    const result = insertPage.run(
      page.slug,
      page.title,
      page.heroTitle,
      page.heroSubtitle,
      mediaByPath.get(page.heroImagePath)
    );
    pageBySlug.set(page.slug, Number(result.lastInsertRowid));
  }

  const insertSection = db.prepare(`
    INSERT INTO page_sections (page_id, section_key, title, subtitle, body, image_id, sort_order, is_visible)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1)
  `);
  for (const [pageSlug, sectionKey, title, subtitle, body, imagePath, sortOrder] of seedData.pageSections) {
    insertSection.run(pageBySlug.get(pageSlug), sectionKey, title, subtitle, body, imagePath ? mediaByPath.get(imagePath) : null, sortOrder);
  }

  const insertSlide = db.prepare(`
    INSERT INTO home_slides (title, subtitle, image_id, link_url, sort_order, is_visible)
    VALUES (?, ?, ?, NULL, ?, 1)
  `);
  for (const [title, subtitle, imagePath, sortOrder] of seedData.homeSlides) {
    insertSlide.run(title, subtitle, mediaByPath.get(imagePath), sortOrder);
  }

  const insertCategory = db.prepare(`
    INSERT INTO product_categories (name, slug, sort_order, is_visible)
    VALUES (?, ?, ?, 1)
  `);
  for (const [name, slug, sortOrder] of seedData.productCategories) {
    const result = insertCategory.run(name, slug, sortOrder);
    categoryBySlug.set(slug, Number(result.lastInsertRowid));
  }

  const insertProduct = db.prepare(`
    INSERT INTO products (category_id, name, summary, material, specification, image_id, is_insured, sort_order, is_visible)
    VALUES (?, ?, ?, ?, ?, ?, 1, ?, 1)
  `);
  for (const [categorySlug, name, summary, material, specification, imagePath, sortOrder] of seedData.products) {
    insertProduct.run(categoryBySlug.get(categorySlug), name, summary, material, specification, mediaByPath.get(imagePath), sortOrder);
  }

  const insertReportGroup = db.prepare(`
    INSERT INTO quality_report_groups (title, slug, sort_order, is_visible)
    VALUES (?, ?, ?, 1)
  `);
  const insertReportImage = db.prepare(`
    INSERT INTO quality_report_images (group_id, image_id, alt_text, sort_order, is_visible)
    VALUES (?, ?, ?, ?, 1)
  `);
  for (const [title, slug, groupNumber, imageCount] of seedData.reportGroups) {
    const groupResult = insertReportGroup.run(title, slug, groupNumber);
    const groupId = Number(groupResult.lastInsertRowid);
    for (let index = 1; index <= imageCount; index += 1) {
      const groupText = String(groupNumber).padStart(2, "0");
      const imageText = String(index).padStart(2, "0");
      const imagePath = `/uploads/reports/report-${groupText}-${imageText}.png`;
      insertReportImage.run(groupId, mediaByPath.get(imagePath), `${title} ${index}`, index);
    }
  }

  db.prepare(`
    INSERT INTO admin_users (username, password_hash, is_active)
    VALUES (?, ?, 1)
  `).run("admin", hashPassword("admin123"));
}

function mediaSelect(alias = "media_files") {
  return `
    ${alias}.id AS image_id,
    ${alias}.file_path AS image_url,
    ${alias}.alt_text AS image_alt
  `;
}

module.exports = {
  getDatabase,
  mediaSelect,
  databasePath
};
