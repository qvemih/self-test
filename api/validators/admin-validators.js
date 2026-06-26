function requireFields(payload, fields) {
  for (const field of fields) {
    if (payload[field] === undefined || payload[field] === null || payload[field] === "") {
      const error = new Error(`缺少必要字段：${field}`);
      error.statusCode = 400;
      throw error;
    }
  }
}

function validateMessage(payload) {
  requireFields(payload, ["name", "phone", "content"]);
}

module.exports = {
  requireFields,
  validateMessage
};
