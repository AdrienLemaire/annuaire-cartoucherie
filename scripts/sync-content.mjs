#!/usr/bin/env node
// scripts/sync-content.mjs
// Puts member content where the content layer expects it. CONTENT_DIR defaults
// to the fictional fixture, so `npm run dev` and every test run on invented
// people; CI sets it to a private checkout before the production build.
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SOURCE = process.env.CONTENT_DIR ?? "tests/fixtures";
const membersFrom = join(SOURCE, "members.json");
const portraitsFrom = join(SOURCE, "portraits");

if (!existsSync(membersFrom)) {
  console.error(`sync-content: no members.json in ${SOURCE}. Set CONTENT_DIR.`);
  process.exit(1);
}

const raw = readFileSync(membersFrom, "utf-8");
const { membres } = JSON.parse(raw);
const seen = new Set();
for (const m of membres) {
  if (!/^[a-z0-9-]+$/.test(m.slug ?? "")) {
    console.error(`sync-content: bad slug ${JSON.stringify(m.slug)} on « ${m.nom} ».`);
    process.exit(1);
  }
  if (seen.has(m.slug)) {
    console.error(`sync-content: duplicate slug « ${m.slug} ». Slugs are printed on QR codes.`);
    process.exit(1);
  }
  seen.add(m.slug);
  if (!existsSync(join(portraitsFrom, m.photo))) {
    console.error(`sync-content: « ${m.nom} » names a missing portrait ${m.photo}.`);
    process.exit(1);
  }
}

mkdirSync("src/content", { recursive: true });
writeFileSync("src/content/members.json", raw);
rmSync("public/portraits", { recursive: true, force: true });
mkdirSync("public/portraits", { recursive: true });
cpSync(portraitsFrom, "public/portraits", { recursive: true });
console.log(`sync-content: ${membres.length} members from ${SOURCE}`);
