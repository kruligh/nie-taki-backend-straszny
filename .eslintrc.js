module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  extends: ["plugin:@typescript-eslint/recommended", "prettier/@typescript-eslint", "plugin:prettier/recommended"],
  plugins: ["mocha-no-only"],
  rules: {
    "arrow-parens": ["error", "as-needed"],
    "@typescript-eslint/ban-types": ["error",  {"types": {"{}": false, "object": false}}],
    "@typescript-eslint/no-unused-vars": ["error", { args: "none" }],
    "mocha-no-only/mocha-no-only": ["error"],
  }
};
