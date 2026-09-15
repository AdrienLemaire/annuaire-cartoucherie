#!/usr/bin/env node
// Byte budgets. Deterministic, ~2 s, runs on every push — unlike Lighthouse.
// The numbers are the standard; see docs/standards/web-and-ci.md §3.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const DIST = "dist";
const KB = 1024;

// [label, matcher, limit in KB, measure]
const BUDGETS = [
  ["JavaScript, total",       (f) => f.endsWith(".js"),              40, "gzip-sum"],
  ["JavaScript, single file", (f) => f.endsWith(".js"),              25, "gzip-max"],
  ["CSS, total",              (f) => f.endsWith(".css"),             25, "gzip-sum"],
  ["Fonts, total (raw)",      (f) => f.endsWith(".woff2"),          150, "raw-sum"],
  ["Search index",            (f) => f.endsWith("recherche.json"),   90, "gzip-sum"],
  ["Heaviest HTML document",  (f) => f.endsWith(".html"),            25, "gzip-max"],
];

function* walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

const files = [...walk(DIST)];
const size = (f, measure) =>
  measure.startsWith("gzip") ? gzipSync(readFileSync(f)).length : statSync(f).size;

let failed = false;
for (const [label, match, limitKB, measure] of BUDGETS) {
  const hits = files.filter((f) => match(f));
  if (hits.length === 0) continue;
  const sizes = hits.map((f) => size(f, measure));
  const value = measure.endsWith("max")
    ? Math.max(...sizes)
    : sizes.reduce((a, b) => a + b, 0);
  const kb = value / KB;
  const ok = kb <= limitKB;
  if (!ok) failed = true;
  console.log(
    `${ok ? "ok  " : "FAIL"}  ${label.padEnd(26)} ${kb.toFixed(1).padStart(7)} KB / ${limitKB} KB`
  );
}

if (failed) {
  console.error(
    "\nA budget was exceeded. Raising the number is the last resort, not the first:\n" +
    "  JS      — does this island have to ship?\n" +
    "  Fonts   — instance the pinned SOFT/WONK axes, subset to latin + latin-ext.\n" +
    "  Index   — split recherche.json before widening it."
  );
  process.exit(1);
}
