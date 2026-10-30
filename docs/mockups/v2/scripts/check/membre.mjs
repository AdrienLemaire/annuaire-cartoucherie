// Checks docs/mockups/v2/membre.html at a board width (argv[2]):
// console/page errors, board overflow, and for each frame at 100 % and 200 %:
// frame overflow and words split across two lines.
import { chromium } from "@playwright/test";
const width = +process.argv[2] || 1400;
const shotDir = process.argv[3];
const b = await chromium.launch({ executablePath: process.env.CHROME });
const p = await b.newPage({ viewport: { width, height: 900 } });
const errors = [];
p.on("pageerror", (e) => errors.push("pageerror " + e.message));
p.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") errors.push(m.type() + " " + m.text()); });
p.on("requestfailed", (r) => errors.push("requestfailed " + r.url()));
await p.goto(`file://${process.cwd()}/docs/mockups/v2/membre.html`, { waitUntil: "load", timeout: 90000 });
await p.waitForTimeout(9000);
const board = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
console.log("width", width, "board", JSON.stringify(board));
const n = await p.evaluate(() => document.querySelectorAll("iframe[data-cas]").length);
for (let i = 0; i < n; i++) {
  for (const zoom of [null, "200%"]) {
    const res = await p.evaluate(async ({ i, zoom }) => {
      const f = document.querySelectorAll("iframe[data-cas]")[i];
      const d = f.contentDocument;
      const before = d.documentElement.style.fontSize;
      if (zoom) d.documentElement.style.fontSize = zoom;
      await new Promise((r) => setTimeout(r, 400));
      const vw = d.documentElement.clientWidth;
      const broken = [];
      d.querySelectorAll("h1, h2, h3, p, dd, dt, li, a, span, address, button").forEach((el) => {
        if (el.closest(".diapo")) return;
        const w = d.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        let t;
        while ((t = w.nextNode())) {
          if (t.parentElement !== el) continue;
          const re = /[^\s\-‑–—·]+/g;
          let m;
          while ((m = re.exec(t.data))) {
            const r = d.createRange();
            r.setStart(t, m.index); r.setEnd(t, m.index + m[0].length);
            const tops = new Set([...r.getClientRects()].filter((x) => x.width > 0).map((x) => Math.round(x.top)));
            if (tops.size > 1) broken.push(m[0]);
          }
        }
      });
      // words split across <wbr> runs: the e-mails, sites, handles, names
      d.querySelectorAll(".break-words, .mots-entiers").forEach((el) => {
        const r = d.createRange(); r.selectNodeContents(el);
        const rects = [...r.getClientRects()].filter((x) => x.width > 0);
        el.dataset.lignes = new Set(rects.map((x) => Math.round(x.top))).size;
      });
      const wide = [...d.body.querySelectorAll("*")]
        .filter((e) => { const r = e.getBoundingClientRect(); return r.width && r.right > vw + 1 && !e.closest("svg") && !e.closest("[data-track]") && !e.closest("[popover]"); })
        .map((e) => e.tagName + "." + String(e.className.baseVal ?? e.className).slice(0, 50) + " r=" + Math.round(e.getBoundingClientRect().right)).slice(0, 5);
      const h1 = d.querySelector("h1");
      const port = d.querySelector("img.arche");
      const cover = d.querySelector(".diapo__portrait");
      const scale = (img) => img && Math.max(img.getBoundingClientRect().width, img.getBoundingClientRect().height) / img.naturalWidth;
      const out = {
        cas: f.dataset.cas, fw: vw, zoom: zoom || "100%", sw: d.documentElement.scrollWidth,
        h1: h1.textContent + " @" + getComputedStyle(h1).fontSize,
        portrait: scale(port)?.toFixed(3), cover: scale(cover)?.toFixed(3),
        broken, wide,
      };
      d.documentElement.style.fontSize = before;
      return out;
    }, { i, zoom });
    console.log(JSON.stringify(res));
  }
}
if (shotDir) {
  await p.screenshot({ path: `${shotDir}/membre-${width}.png`, fullPage: false });
}
console.log("errors", errors.length, errors.slice(0, 10).join("\n"));
await b.close();
