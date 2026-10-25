// src/og/card.ts
// Build-time only: node: imports are allowed here and nowhere else under src/
// (eslint.config.mjs restricts src/lib, not src/og). Renders the WhatsApp/
// social preview card for a member's profile (spec §5) — no network fetch,
// no astro:content: it takes name and trade as plain strings so it stays
// testable without the content layer. The home page's card reuses it with
// the collective's credit as its eyebrow.
import { readFileSync } from "node:fs";
import satori from "satori";
import sharp from "sharp";
import { decompress } from "wawoff2";

// The site's own heading face. Both of its axes are pinned (see global.css),
// so it carries no fvar table: satori's bundled parser, @shuding/opentype.js
// 0.33.4, throws in parseFvarAxis on a variable font's fvar.
const WOFF2 = "src/fonts/literata-latin.woff2";

// satori reads ttf/otf/woff, never woff2 — decompressed once, in memory, and
// reused across every member's card in the same build.
let literata: Buffer | null = null;
async function font(): Promise<Buffer> {
  literata ??= Buffer.from(await decompress(readFileSync(WOFF2)));
  return literata;
}

export async function renderCard(
  name: string,
  trade: string,
  eyebrow = "Annuaire de la Cartoucherie",
): Promise<Buffer> {
  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          width: "1200px",
          height: "630px",
          // satori 0.63 defaults to content-box: without this the padding pushes
          // the trade line and the orange band off the 630 px canvas.
          boxSizing: "border-box",
          padding: "64px",
          background: "#ffffff",
          borderBottom: "16px solid #f87d3b",
        },
        children: [
          {
            type: "div",
            props: {
              style: { fontSize: 34, color: "#44706f" },
              children: eyebrow,
            },
          },
          {
            type: "div",
            props: {
              style: { fontFamily: "Literata", fontSize: 86, color: "#123b3c", marginTop: 12 },
              children: name,
            },
          },
          {
            type: "div",
            props: { style: { fontSize: 44, color: "#3f4f52", marginTop: 8 }, children: trade },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Literata", data: await font(), weight: 600, style: "normal" }],
    },
  );
  return sharp(Buffer.from(svg)).png().toBuffer();
}
