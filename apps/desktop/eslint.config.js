import js from "@eslint/js";

export default [
  {
    ignores: ["node_modules/**", "dist/**", "build/**", "coverage/**", "target/**", "*.min.js"]
  },
  js.configs.recommended
];
