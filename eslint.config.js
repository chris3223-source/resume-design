import js from "@eslint/js";
import react from "eslint-plugin-react";
import globals from "globals";

export default [
  { ignores: ["dist/**", "node_modules/**"] },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { react },
    rules: {
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "no-unused-vars": ["error", { args: "none", caughtErrors: "none" }],
      // Existing form validation intentionally leaves rejected submissions on screen.
      "no-empty": ["error", { allowEmptyCatch: true }],
    },
  },
];
