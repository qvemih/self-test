const { getDatabase } = require("../repositories/database");

function mapImage(row) {
  if (!row || !row.image_url) return null;
  return {
    id: row.image_id,
    url: row.image_url,
    alt: row.image_alt || ""
  };
}

function withImage(row) {
  return {
    ...row,
    is_visible: row.is_visible === undefined ? undefined : Boolean(row.is_visible),
    is_published: row.is_published === undefined ? undefined : Boolean(row.is_published),
    is_insured: row.is_insured === undefined ? undefined : Boolean(row.is_insured),
    image: mapImage(row)
  };
}

function getSiteSettings() {
  const db = getDatabase();
  const row = db.prepare(`
    SELECT s.*, m.id AS image_id, m.file_path AS image_url, m.alt_text AS image_alt
    FROM site_settings s
    LEFT JOIN media_files m ON m.id = s.logo_image_id
    WHERE s.id = 1
  `).get();
  return {
    id: row.id,
    site_name: row.site_name,
    company_name: row.company_name,
    phone: row.phone,
    email: row.email,
    address: row.address,
    wechat: row.wechat,
    updated_at: row.updated_at,
    logo: mapImage(row)
  };
}

function getNavigationItems({ includeHidden = false } = {}) {
  const db = getDatabase();
  const rows = db.prepare(`
    SELECT id, label, path, sort_order, is_visible
    FROM navigation_items
    ${includeHidden ? "" : "WHERE is_visible = 1"}
    ORDER BY sort_order ASC, id ASC
  `).all();
  return rows.map((row) => ({ ...row, is_visible: Boolean(row.is_visible) }));
}

function getPageBySlug(slug) {
  const db = getDatabase();
  const page = db.prepare(`
    SELECT p.*, m.id AS image_id, m.file_path AS image_url, m.alt_text AS image_alt
    FROM pages p
    LEFT JOIN media_files m ON m.id = p.hero_image_id
    WHERE p.slug = ? AND p.is_published = 1
  `).get(slug);

  if (!page) return null;

  const sections = db.prepare(`
    SELECT s.*, m.id AS image_id, m.file_path AS image_url, m.alt_text AS image_alt
    FROM page_sections s
    LEFT JOIN media_files m ON m.id = s.image_id
    WHERE s.page_id = ? AND s.is_visible = 1
    ORDER BY s.sort_order ASC, s.id ASC
  `).all(page.id).map(withImage);

  return {
    id: page.id,
    slug: page.slug,
    title: page.title,
    hero_title: page.hero_title,
    hero_subtitle: page.hero_subtitle,
    is_published: Boolean(page.is_published),
    updated_at: page.updated_at,
    hero_image: mapImage(page),
    sections
  };
}

function getHomeSlides({ includeHidden = false } = {}) {
  const db = getDatabase();
  const rows = db.prepare(`
    SELECT h.*, m.id AS image_id, m.file_path AS image_url, m.alt_text AS image_alt
    FROM home_slides h
    LEFT JOIN media_files m ON m.id = h.image_id
    ${includeHidden ? "" : "WHERE h.is_visible = 1"}
    ORDER BY h.sort_order ASC, h.id ASC
  `).all();
  return rows.map((row) => withImage(row));
}

function getProductCategories({ includeHidden = false } = {}) {
  const db = getDatabase();
  const rows = db.prepare(`
    SELECT id, name, slug, sort_order, is_visible
    FROM product_categories
    ${includeHidden ? "" : "WHERE is_visible = 1"}
    ORDER BY sort_order ASC, id ASC
  `).all();
  return rows.map((row) => ({ ...row, is_visible: Boolean(row.is_visible) }));
}

function getProducts({ category, includeHidden = false } = {}) {
  const db = getDatabase();
  const params = [];
  const conditions = [];
  if (!includeHidden) conditions.push("p.is_visible = 1");
  if (category && category !== "all") {
    conditions.push("c.slug = ?");
    params.push(category);
  }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const rows = db.prepare(`
    SELECT
      p.*,
      c.id AS category_id,
      c.name AS category_name,
      c.slug AS category_slug,
      m.id AS image_id,
      m.file_path AS image_url,
      m.alt_text AS image_alt
    FROM products p
    LEFT JOIN product_categories c ON c.id = p.category_id
    LEFT JOIN media_files m ON m.id = p.image_id
    ${where}
    ORDER BY p.sort_order ASC, p.id ASC
  `).all(...params);

  return rows.map((row) => ({
    id: row.id,
    category_id: row.category_id,
    image_id: row.image_id,
    name: row.name,
    summary: row.summary,
    material: row.material,
    specification: row.specification,
    is_insured: Boolean(row.is_insured),
    is_visible: Boolean(row.is_visible),
    sort_order: row.sort_order,
    category: {
      id: row.category_id,
      name: row.category_name,
      slug: row.category_slug
    },
    image: mapImage(row)
  }));
}

function getQualityReportGroups({ includeHidden = false, includeImages = false } = {}) {
  const db = getDatabase();
  const groups = db.prepare(`
    SELECT id, title, slug, sort_order, is_visible
    FROM quality_report_groups
    ${includeHidden ? "" : "WHERE is_visible = 1"}
    ORDER BY sort_order ASC, id ASC
  `).all().map((row) => ({ ...row, is_visible: Boolean(row.is_visible) }));

  if (!includeImages) return groups;
  return groups.map((group) => ({
    ...group,
    images: getQualityReportImages(group.id, { includeHidden })
  }));
}

function getQualityReportImages(groupId, { includeHidden = false } = {}) {
  const db = getDatabase();
  const rows = db.prepare(`
    SELECT r.*, m.id AS image_id, m.file_path AS image_url, m.alt_text AS image_alt
    FROM quality_report_images r
    LEFT JOIN media_files m ON m.id = r.image_id
    WHERE r.group_id = ? ${includeHidden ? "" : "AND r.is_visible = 1"}
    ORDER BY r.sort_order ASC, r.id ASC
  `).all(groupId);
  return rows.map((row) => ({
    id: row.id,
    group_id: row.group_id,
    alt_text: row.alt_text,
    sort_order: row.sort_order,
    is_visible: Boolean(row.is_visible),
    image: mapImage(row)
  }));
}

function createMessage(payload) {
  const db = getDatabase();
  const result = db.prepare(`
    INSERT INTO messages (name, phone, wechat, product_interest, content, status)
    VALUES (?, ?, ?, ?, ?, 'new')
  `).run(payload.name, payload.phone, payload.wechat || "", payload.product_interest || "", payload.content);
  return db.prepare("SELECT * FROM messages WHERE id = ?").get(Number(result.lastInsertRowid));
}

module.exports = {
  mapImage,
  withImage,
  getSiteSettings,
  getNavigationItems,
  getPageBySlug,
  getHomeSlides,
  getProductCategories,
  getProducts,
  getQualityReportGroups,
  getQualityReportImages,
  createMessage
};
