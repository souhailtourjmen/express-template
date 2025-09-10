import globals from "globals";
import pluginJs from "@eslint/js";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"], // Adjust the file pattern if necessary
    ignores: ["**/*.config.js"], // Ignore config files
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest", // ECMAScript version
        sourceType: "module", // Using ECMAScript modules
      },
      globals: {
        ...globals.browser,
        ...globals.node, // Include Node.js globals
        console: "readonly", // Explicitly define console as a global variable
      },
    },
    rules: {
      // Your custom rules here
      // For example:
      "no-console": "warn", // Warn about console statements
      eqeqeq: "error", // Enforce strict equality
      curly: "error", // Require following curly brace conventions
      "no-var": "warn", // Disallow using var
      "no-unused-vars": "warn", // Warn about unused variables
    },
  },
  pluginJs.configs.recommended,
];