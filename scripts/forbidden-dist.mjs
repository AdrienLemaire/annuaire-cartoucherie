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

// Every <use href="#…">, scoped to that tag specifically — not every href="#…"
// in the document (carte.astro alone has #quartier, #pin-<slug>, and profiles
// have #avis, none of them <use> targets). A <use> naming a missing symbol
// renders nothing at all, silently — no error, no broken-image icon, just an
// empty <svg> — a failure class this project has hit repeatedly (I7/I13,
// final-fixes-report.md). schemas.ts's own `icon` field cannot prevent it:
// /^c-[a-z]+$/ accepts "c-zzz" happily, and Icon.astro's `name`/`raw` props
// are free-form strings.
const USE_HREF = /<use\s[^>]*href=["']#([^"']+)["'][^>]*\/?>/g;
const ID_ATTR = /\bid=["']([^"']+)["']/g;
const SYMBOL_ID = /<symbol\s[^>]*id=["']([^"']+)["']/g;

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

// One document's worth of <use> resolution: every #target it references must
// be an id="…" present in that same document (IconSprite.astro renders once
// per page, so every symbol is always local — a <use> never reaches across
// documents). Returns false and logs on the first unresolved reference per
// document, same style as checkScriptTag above.
function checkUseRefs(path, html) {
  const ids = new Set([...html.matchAll(ID_ATTR)].map((m) => m[1]));
  let ok = true;
  for (const match of html.matchAll(USE_HREF)) {
    const target = match[1];
    if (!ids.has(target)) {
      console.error(`${path}: <use href="#${target}"> resolves to no id="${target}" in the document`);
      ok = false;
    }
  }
  return ok;
}

let failed = false;
const allowedOrigins = scriptSrcOrigins();
const definedSymbols = new Set();
const referencedSymbols = new Set();

for (const path of walk(DIST)) {
  const html = readFileSync(path, "utf-8");
  for (const match of html.matchAll(SCRIPT_TAG)) {
    const [, attrs, body] = match;
    if (!checkScriptTag(path, attrs, body, allowedOrigins)) failed = true;
  }
  if (!checkUseRefs(path, html)) failed = true;
  for (const match of html.matchAll(SYMBOL_ID)) definedSymbols.add(match[1]);
  for (const match of html.matchAll(USE_HREF)) referencedSymbols.add(match[1]);
}

if (failed) {
  console.error(
    "\nA built page ships a <script> the production CSP (public/_headers) would block, or a\n" +
      "<use> naming a symbol that does not exist — which renders nothing at all, silently.\n" +
      "For the script case: Astro inlines a hoisted <script> whose own chunk imports nothing\n" +
      "else and stays under Vite's assetsInlineLimit (4 KB) — wrap the import in\n" +
      "`void import(...)` (a dynamic import) to force it out as an external file; see\n" +
      "BaseLayout.astro's own comment.",
  );
}

const dead = [...definedSymbols].filter((id) => !referencedSymbols.has(id)).sort();
if (dead.length > 0) {
  console.error(`\nforbidden-dist: sprite symbol(s) defined but never referenced by any <use>: ${dead.join(", ")}`);
  console.error("Remove them from IconSprite.astro's own <defs>, or use them.");
  failed = true;
}

process.exit(failed ? 1 : 0);
