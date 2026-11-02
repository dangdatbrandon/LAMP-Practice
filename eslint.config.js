const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  {
    ignores: ["node_modules/**"]
  },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser
      }
    }
  }
];
