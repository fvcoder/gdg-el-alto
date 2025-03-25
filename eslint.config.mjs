import eslintConfigCodely from "eslint-config-codely";

export default [
  ...eslintConfigCodely.full,
  {
    rules: {
      "prettier/prettier": ["error", { endOfLine: "auto", printWidth: 120, useTabs: false, tabWidth: 2 }],
      "import/no-unresolved": "off",
      "import/no-duplicates": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
  },
];
