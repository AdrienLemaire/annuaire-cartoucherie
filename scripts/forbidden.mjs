#!/usr/bin/env node
// scripts/forbidden.mjs
// Four patterns that a linter cannot see and that fail only in production,
// where public/_headers pins script-src to 'self'. ~50 ms over src/.
import { readdirSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";

// The one allow-listed third party: Cloudflare's analytics beacon has no local
// form, is named in the CSP, and publishes no stable hash for SRI.
const BEACON = "static.cloudflareinsights.com";

const RULES = [
  {
    // Not /<script[^>]*is:inline/: Prettier wraps a long script tag across lines
    // at printWidth 100, so a line-anchored version would miss the common case.
    // `is:inline` only ever appears on a script or style tag anyway.
    re: /\bis:inline\b/,
    why: "is:inline: CSP is script-src 'self'. Put it in src/client/ and import it.",
  },
  { re: /\bset:html\b/, why: "set:html: render the value, or emit it from a route as a file." },
  {
    re: /(?:\bsrc=|\bfetch\(|@import\s|url\()\s*["'(]?https?:\/\//i,
    why: "third-party subresource: self-host it (fonts, scripts, images).",
  },
  { re: /maximum-scale|user-scalable\s*=\s*no/, why: "pinch zoom must never be disabled." },
];

const EXTENSIONS = new Set([".astro", ".ts", ".js", ".css"]);

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (EXTENSIONS.has(extname(path))) yield path;
  }
}

let failed = false;
for (const path of walk("src")) {
  const lines = readFileSync(path, "utf-8").split("\n");
  lines.forEach((line, i) => {
    if (line.includes(BEACON)) return;
    for (const rule of RULES) {
      if (rule.re.test(line)) {
        failed = true;
        console.error(`${path}:${i + 1}  ${rule.why}\n    ${line.trim()}`);
      }
    }
  });
}
process.exit(failed ? 1 : 0);
