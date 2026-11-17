const hexPattern = /^#([0-9A-Fa-f]{3}){1,2}$/;

function isValidHex(hex) {
  return typeof hex === "string" && hexPattern.test(hex);
}

function normalizeHex(hex) {
  if (!isValidHex(hex)) {
    throw new Error("Invalid hex color: " + hex);
  }

  let digits = hex.slice(1);
  if (digits.length === 3) {
    digits = digits[0] + digits[0] + digits[1] + digits[1] + digits[2] + digits[2];
  }
  return "#" + digits.toUpperCase();
}

function formatColor(name, hex) {
  if (typeof name !== "string" || name.trim() === "") {
    throw new Error("Color name is required");
  }
  return {
    name: name.trim(),
    hex: normalizeHex(hex),
  };
}

function validateLogin(login, password) {
  const errors = [];

  if (typeof login !== "string" || login.trim() === "") {
    errors.push("Username is required");
  }
  if (typeof password !== "string" || password.trim() === "") {
    errors.push("Password is required");
  }
  if (password !== null && password !== undefined && password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

module.exports = {
  isValidHex,
  normalizeHex,
  formatColor,
  validateLogin,
};
