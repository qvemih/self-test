const crypto = require("node:crypto");
const { parseCookies } = require("../utils/http");

const sessions = new Map();
const COOKIE_NAME = "zisha_admin_session";

function createSession(res, user) {
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, { user, createdAt: Date.now() });
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Lax`);
  return token;
}

function clearSession(req, res) {
  const cookies = parseCookies(req);
  if (cookies[COOKIE_NAME]) sessions.delete(cookies[COOKIE_NAME]);
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`);
}

function getSessionUser(req) {
  const cookies = parseCookies(req);
  const session = cookies[COOKIE_NAME] ? sessions.get(cookies[COOKIE_NAME]) : null;
  return session ? session.user : null;
}

function requireAdmin(req) {
  const user = getSessionUser(req);
  if (!user) {
    const error = new Error("请先登录后台。");
    error.statusCode = 401;
    throw error;
  }
  return user;
}

module.exports = {
  createSession,
  clearSession,
  getSessionUser,
  requireAdmin
};
