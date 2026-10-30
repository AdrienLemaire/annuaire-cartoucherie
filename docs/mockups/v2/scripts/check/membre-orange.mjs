// For each frame, slide a 740 px screen down the page (and, on the carousel, through every slide)
// and count the orange objects in view: .cta, .filet, the visible slide's .diapo__filet.
import { chromium } from "@playwright/test";
const b = await chromium.launch({ executablePath: process.env.CHROME });
const url = `file://${process.cwd()}/docs/mockups/v2/membre.html`;
const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
await p.goto(url); await p.waitForTimeout(3000);
const frames = await p.evaluate(() => [...document.querySelectorAll("iframe[data-cas]")].map((f) => ({ cas: f.dataset.cas, src: f.srcdoc, w: f.clientWidth })));
for (const f of frames) {
  const q = await b.newPage({ viewport: { width: f.w, height: f.w > 400 ? 800 : 740 } });
  await q.goto(url); await q.setContent(f.src, { waitUntil: "load" }); await q.waitForTimeout(5000);
  const r = await q.evaluate(async () => {
    const H = innerHeight, max = document.documentElement.scrollHeight - H;
    const track = document.querySelector("[data-track]");
    const pages = track ? track.children.length : 1;
    let worst = 0, at = [];
    for (let y = 0; y <= max; y += 20) {
      scrollTo(0, y);
      for (let s = 0; s < pages; s++) {
        if (track) track.scrollTo({ left: track.clientWidth * s, behavior: "instant" });
        const inView = (e) => { const r = e.getBoundingClientRect(); return r.width && r.bottom > 0 && r.top < H && r.right > 0 && r.left < innerWidth; };
        const tr = track && track.getBoundingClientRect();
        const n = [...document.querySelectorAll(".cta, .filet, .diapo__filet")].filter((e) => {
          if (!inView(e)) return false;
          if (e.classList.contains("diapo__filet")) { const r = e.getBoundingClientRect(); return r.left >= tr.left - 1 && r.right <= tr.right + 1; }
          return true;
        }).length;
        if (n > worst) { worst = n; at = [y, s]; }
      }
    }
    return { worst, at };
  });
  console.log(f.cas, f.w, JSON.stringify(r));
  await q.close();
}
await b.close();
