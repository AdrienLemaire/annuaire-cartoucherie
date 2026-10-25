#!/usr/bin/env node
// scripts/sync-content.mjs
// Puts member content where the content layer expects it. CONTENT_DIR defaults
// to the fictional fixture, so `npm run dev` and every test run on invented
// people; CI sets it to a private checkout before the production build.
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, parse } from "node:path";
import sharp from "sharp";

const SOURCE = process.env.CONTENT_DIR ?? "tests/fixtures";
const membersFrom = join(SOURCE, "members.json");
const portraitsFrom = join(SOURCE, "portraits");
const slidesFrom = join(SOURCE, "carrousels");

if (!existsSync(membersFrom)) {
  console.error(`sync-content: no members.json in ${SOURCE}. Set CONTENT_DIR.`);
  process.exit(1);
}

const raw = readFileSync(membersFrom, "utf-8");
const { membres } = JSON.parse(raw);
const seen = new Set();
// Identify a bad row by its 1-based position, never by name, slug or photo
// filename (final-fixes-report.md, I9): CI's deploy job runs this against
// the real, private quartier, and Actions logs on a public repository are
// world-readable. These fields are already public on the live site, so this
// is log hygiene rather than a new exposure — but a row index is just as
// actionable for fixing tests/fixtures/members.json or the private source.
membres.forEach((m, i) => {
  const row = `row ${i + 1} of ${membres.length}`;
  if (!/^[a-z0-9-]+$/.test(m.slug ?? "")) {
    console.error(`sync-content: bad slug on ${row}.`);
    process.exit(1);
  }
  if (seen.has(m.slug)) {
    console.error(`sync-content: duplicate slug on ${row}. Slugs are printed on QR codes.`);
    process.exit(1);
  }
  seen.add(m.slug);
  if (!existsSync(join(portraitsFrom, m.photo))) {
    console.error(`sync-content: ${row} names a missing portrait.`);
    process.exit(1);
  }
  (m.carrousel ?? []).forEach((slide, j) => {
    if (!existsSync(join(slidesFrom, slide.fichier ?? ""))) {
      console.error(`sync-content: ${row}, slide ${j + 1}, names a missing carousel image.`);
      process.exit(1);
    }
  });
});

mkdirSync("src/content", { recursive: true });
writeFileSync("src/content/members.json", raw);

// Portraits arrive at any size, from 128 px Instagram crops to 1440 px
// originals. Re-encoded to at most 384 px, 2× the profile's 176 px arch, so a
// retina screen stays sharp and the 100 KB image budget holds. Never enlarged:
// a 128 px source stays 128 px. sharp drops EXIF, so no camera or GPS data ships.
rmSync("public/portraits", { recursive: true, force: true });
mkdirSync("public/portraits", { recursive: true });
await Promise.all(
  membres.map((m) =>
    sharp(join(portraitsFrom, m.photo))
      .rotate()
      .resize(384, 384, { fit: "cover", withoutEnlargement: true })
      .toFormat(parse(m.photo).ext === ".webp" ? "webp" : "jpeg", { quality: 78, mozjpeg: true })
      .toFile(join("public/portraits", m.photo)),
  ),
);

// Carousel slides arrive as 1080×1350 exports (one was a 1.1 MB PNG). Re-encoded
// once here as WebP, at 720 px for the page and 1080 px for full screen: the
// heaviest-image budget is 100 KB. slideSrc (src/lib/members.ts) reads
// /carrousels/<name>-<width>.webp.
rmSync("public/carrousels", { recursive: true, force: true });
mkdirSync("public/carrousels", { recursive: true });
const slides = membres.flatMap((m) => m.carrousel ?? []);
await Promise.all(
  slides.flatMap((slide) =>
    [720, 1080].map((width) =>
      sharp(join(slidesFrom, slide.fichier))
        .resize({ width })
        .webp({ quality: 72 })
        .toFile(join("public/carrousels", `${parse(slide.fichier).name}-${width}.webp`)),
    ),
  ),
);
console.log(`sync-content: ${membres.length} members from ${SOURCE}`);
