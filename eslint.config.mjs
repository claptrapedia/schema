import eslint from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import perfectionist from "eslint-plugin-perfectionist";
import tseslint from "typescript-eslint";

export default [eslint.configs.recommended, ...tseslint.configs.recommended, {
  ignores: ["dist/", "**/*.js"],
  plugins: {
    perfectionist,
    "@stylistic": stylistic,
  },
  rules: {
    "padded-blocks": ["error", { classes: "always" }],
    "@stylistic/max-len": ["error", {
      code: 200,
      comments: 120,
      ignorePattern: "(?:(['\"`]).*\\1|^\\s*//.*$)",
    }],
    "@stylistic/indent": ["error", 2, { SwitchCase: 1 }],
    "@stylistic/semi": ["error", "always"],
    "@stylistic/quotes": ["error", "double"],
    "@stylistic/object-curly-spacing": ["error", "always"],
    "@stylistic/comma-spacing": ["error", {
      before: false,
      after: true,
    }],
    "@stylistic/comma-dangle": ["error", {
      arrays: "always-multiline",
      objects: "always-multiline",
      imports: "always-multiline",
      exports: "always-multiline",
      functions: "never",
      enums: "always-multiline",
      tuples: "always-multiline",
    }],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": [
      "error", {
        args: "all",
        argsIgnorePattern: "^_",
        caughtErrors: "all",
        caughtErrorsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      },
    ],
    "@typescript-eslint/no-namespace": "off",
    "perfectionist/sort-exports": ["error", {
      type: "alphabetical",
      order: "asc",
      newlinesBetween: 1,
      groups: [
        "type-export",
        "value-export",
      ],
    }],
    "perfectionist/sort-imports": ["error", {
      type: "alphabetical",
      order: "asc",
      sortSideEffects: false,
      newlinesBetween: 1,
      groups: [
        "type-external",
        { newlinesBetween: 0 },
        "type-internal",
        "builtin",
        "external",
        "src-group",
        "shared-group",
        "games-group",
        ["parent", "sibling", "index"],
      ],
      customGroups: [
        {
          groupName: "src-group",
          modifiers: ["value"],
          elementNamePattern: "^#src$",
        },
        {
          groupName: "shared-group",
          modifiers: ["value"],
          elementNamePattern: "^#shared(/.*)?$",
        },
        {
          groupName: "games-group",
          modifiers: ["value"],
          elementNamePattern: "^#games(/.*)?$",
        },
      ],
    }],
    "perfectionist/sort-named-imports": ["error", {
      type: "alphabetical",
      order: "asc",
    }],
  },
}];
