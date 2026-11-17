const {
  isValidHex,
  normalizeHex,
  formatColor,
  validateLogin,
} = require("../../public/js/colorUtils");

describe("colorUtils", () => {
  describe("isValidHex", () => {
    it("returns true for valid 3-digit hex colors", () => {
      expect(isValidHex("#fff")).toBe(true);
      expect(isValidHex("#000")).toBe(true);
      expect(isValidHex("#a1b2c3")).toBe(true);
    });

    it("returns true for valid 6-digit hex colors", () => {
      expect(isValidHex("#FFFFFF")).toBe(true);
      expect(isValidHex("#00ff00")).toBe(true);
    });

    it("returns false for invalid values", () => {
      expect(isValidHex("fff")).toBe(false);
      expect(isValidHex("#ggg")).toBe(false);
      expect(isValidHex("#ffff")).toBe(false);
      expect(isValidHex("")).toBe(false);
      expect(isValidHex(null)).toBe(false);
      expect(isValidHex(undefined)).toBe(false);
    });
  });

  describe("normalizeHex", () => {
    it("expands 3-digit hex to 6-digit uppercase", () => {
      expect(normalizeHex("#fff")).toBe("#FFFFFF");
      expect(normalizeHex("#0a3")).toBe("#00AA33");
    });

    it("keeps 6-digit hex uppercase", () => {
      expect(normalizeHex("#00ff00")).toBe("#00FF00");
    });

    it("throws for invalid hex", () => {
      expect(() => normalizeHex("#ggg")).toThrow("Invalid hex color");
      expect(() => normalizeHex("fff")).toThrow("Invalid hex color");
    });
  });

  describe("formatColor", () => {
    it("returns a color object with normalized hex", () => {
      expect(formatColor("red", "#f00")).toEqual({ name: "red", hex: "#FF0000" });
    });

    it("trims whitespace from the name", () => {
      expect(formatColor("  blue  ", "#00f")).toEqual({ name: "blue", hex: "#0000FF" });
    });

    it("throws when name is missing", () => {
      expect(() => formatColor("", "#fff")).toThrow("Color name is required");
      expect(() => formatColor(null, "#fff")).toThrow("Color name is required");
    });
  });

  describe("validateLogin", () => {
    it("returns valid for non-empty username and password", () => {
      expect(validateLogin("alice", "password123")).toEqual({ valid: true, errors: [] });
    });

    it("reports missing username and password", () => {
      const result = validateLogin("", "");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Username is required");
      expect(result.errors).toContain("Password is required");
    });

    it("rejects passwords shorter than 6 characters", () => {
      const result = validateLogin("alice", "abc");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Password must be at least 6 characters");
    });
  });
});
