// Flat config. The rules here are the mechanical half of docs/STANDARDS.md;
// the conventions that no linter can catch are listed there and reviewed by hand.
import js from "@eslint/js";
import ts from "typescript-eslint";
import astro from "eslint-plugin-astro";
import sonarjs from "eslint-plugin-sonarjs";

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  ...astro.configs.recommended,

  {
    plugins: { sonarjs },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",

      // Budget functions, not files. A file ceiling just produces
      // `search-helpers.ts` next to `search.ts` and makes navigation worse.
      complexity: ["error", 10],
      "max-depth": ["error", 3],
      "max-params": ["error", 4],
      "max-lines-per-function": ["error", { max: 60, skipBlankLines: true, skipComments: true }],

      // Only this one from sonarjs. `no-duplicate-string` fires on every repeated
      // Tailwind class list and every French label, and would get the whole plugin
      // switched off within a week.
      "sonarjs/no-identical-functions": "error",
    },
  },

  {
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      globals: { console: "readonly", process: "readonly", Buffer: "readonly" },
    },
  },

  {
    // The service worker: its own global scope, no Node and no DOM `window`.
    files: ["public/sw.js"],
    languageOptions: {
      globals: { self: "readonly", caches: "readonly", fetch: "readonly", URL: "readonly" },
    },
  },

  // Layering: lib -> components -> layouts -> pages, one direction only.
  {
    files: ["src/lib/**/*.ts"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [
          { group: ["astro:*"], message: "src/lib is pure and isomorphic. Load content in src/lib/collections.ts and pass the data in." },
          { group: ["node:*"], message: "src/lib is bundled into the browser. Keep node-only code in src/og or src/content." },
          { group: ["**/components/**", "**/layouts/**", "**/pages/**"], message: "lib is the bottom layer; it imports from nothing above it." },
        ],
      }],
      // search.ts ships to the browser, but lib must not assume a browser either.
      "no-restricted-globals": ["error", "document", "window", "localStorage"],
    },
  },
  {
    // The single exception, named so it is obvious. Nothing else may load content.
    files: ["src/lib/collections.ts"],
    rules: { "no-restricted-imports": "off" },
  },
  {
    files: ["src/components/**", "src/layouts/**"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [{ group: ["**/pages/**"], message: "Components never import pages." }],
      }],
    },
  },

  { ignores: ["dist/", ".astro/", "node_modules/", "docs/mockups/"] },
];
