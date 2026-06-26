function requireFields(payload, fields) {
  for (const field of fields) {
    if (payload[field] === undefined || payload[field] === null || String(payload[field]).trim() === "") {
      const error = new Error(`缺少必要字段：${field}`);
      error.statusCode = 400;
      throw error;
    }
  }
}

function requireNumberFields(payload, fields) {
  for (const field of fields) {
    if (payload[field] === undefined || payload[field] === null || String(payload[field]).trim() === "" || Number.isNaN(Number(payload[field]))) {
      const error = new Error(`请填写有效数字：${field}`);
      error.statusCode = 400;
      throw error;
    }
  }
}

function requireAnyField(payload, fields, message = "请至少填写一项内容。") {
  const hasValue = fields.some((field) => (
    payload[field] !== undefined &&
    payload[field] !== null &&
    String(payload[field]).trim() !== ""
  ));
  if (!hasValue) {
    const error = new Error(message);
    error.statusCode = 400;
    throw error;
  }
}

function validateMessage(payload) {
  requireFields(payload, ["name", "phone", "content"]);
}

module.exports = {
  requireAnyField,
  requireFields,
  requireNumberFields,
  validateMessage
};
