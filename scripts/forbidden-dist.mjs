#!/usr/bin/env node
// scripts/forbidden-dist.mjs
// scripts/forbidden.mjs greps *source* for `is:inline`, and that catches a script an
// author wrote inline — but it cannot catch one the *bundler* produces: Astro silently
// inlines a hoisted <script>'s own bundle straight into the HTML (no src=, no CSP hash)
// whenever the chunk statically imports nothing else and stays under Vite's
// assetsInlineLimit (node_modules/astro/dist/core/build/plugins/plugin-scripts.js,
// shouldInlineScriptChunk). Nothing in the .astro source is wrong when that happens —
// found once already, in production, on /carte (task-13-report.md, fix round 1).
//
// This runs on the *built* dist/, after `npm run build`, which is why it is a separate
// script from forbidden.mjs (~50 ms over src/, called before a build exists) rather than
// a mode of it. `npm run guard:dist` in the normal verification flow, after `npm run build`.
import { readdirSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";

const DIST = "dist";

// The real rule, not a guess: read it out of the header this project actually ships,
// so a future edit to the CSP (widening or narrowing script-src) updates this check for
// free instead of leaving a second, silently-drifting copy of the policy to maintain.
function scriptSrcOrigins() {
  const headers = readFileSync("public/_headers", "utf-8");
  const match = /Content-Security-Policy:.*?script-src ([^;]+);/.exec(headers);
  if (!match) throw new Error("forbidden-dist: no script-src directive found in public/_headers");
  return match[1].split(/\s+/).filter(Boolean);
}

function isAllowedSrc(src, allowedOrigins) {
  // 'self': a same-origin, root-relative path. Never a bare relative path (Astro
  // never emits one) and never protocol-relative (`//host`), which is cross-origin.
  if (allowedOrigins.includes("'self'") && src.startsWith("/") && !src.startsWith("//")) {
    return true;
  }
  return allowedOrigins.some(
    (origin) => origin.startsWith("https://") && src.startsWith(`${origin}/`),
  );
}

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (extname(path) === ".html") yield path;
  }
}

const SCRIPT_TAG = /<script([^>]*)>([\s\S]*?)<\/script>/g;
const SRC_ATTR = /\bsrc=["']([^"']+)["']/;

// One tag's worth of checking, pulled out of the walk loop so neither loop nests past
// two levels — this project's own eslint max-depth: 3 would otherwise flag the walk.
function checkScriptTag(path, attrs, body, allowedOrigins) {
  const srcMatch = SRC_ATTR.exec(attrs);

  if (!srcMatch) {
    // No src=: only a script with an empty body is harmless (nothing to execute,
    // nothing for CSP to block). Anything else is exactly the defect this script
    // exists to catch — Astro inlined a chunk the CSP's script-src cannot permit.
    if (body.trim().length === 0) return true;
    console.error(`${path}: inline <script> with a body and no src= — blocked by CSP script-src`);
    return false;
  }

  if (isAllowedSrc(srcMatch[1], allowedOrigins)) return true;
  console.error(
    `${path}: <script src="${srcMatch[1]}"> is not covered by script-src (${allowedOrigins.join(" ")})`,
  );
  return false;
}

let failed = false;
const allowedOrigins = scriptSrcOrigins();

for (const path of walk(DIST)) {
  const html = readFileSync(path, "utf-8");
  for (const match of html.matchAll(SCRIPT_TAG)) {
    const [, attrs, body] = match;
    if (!checkScriptTag(path, attrs, body, allowedOrigins)) failed = true;
  }
}

if (failed) {
  console.error(
    "\nA built page ships a <script> the production CSP (public/_headers) would block.\n" +
      "Astro inlines a hoisted <script> whose own chunk imports nothing else and stays under\n" +
      "Vite's assetsInlineLimit (4 KB) — wrap the import in `void import(...)` (a dynamic\n" +
      "import) to force it out as an external file; see BaseLayout.astro's own comment.",
  );
}
process.exit(failed ? 1 : 0);
