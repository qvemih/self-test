const crypto = require("node:crypto");

const ITERATIONS = 120000;
const KEY_LENGTH = 32;
const DIGEST = "sha256";

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString("hex");
  return `pbkdf2$${ITERATIONS}$${salt}$${hash}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash) return false;
  const [scheme, iterationsText, salt, expectedHash] = storedHash.split("$");
  if (scheme !== "pbkdf2" || !iterationsText || !salt || !expectedHash) return false;

  const iterations = Number(iterationsText);
  const actualHash = crypto.pbkdf2Sync(password, salt, iterations, KEY_LENGTH, DIGEST).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(actualHash, "hex"), Buffer.from(expectedHash, "hex"));
}

module.exports = {
  hashPassword,
  verifyPassword
};
