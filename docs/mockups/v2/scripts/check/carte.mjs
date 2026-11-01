import { chromium } from "@playwright/test";
const OUT = new URL(".", import.meta.url).pathname;
const URL_ = `file://${process.cwd()}/docs/mockups/v2/carte.html`;
const b = await chromium.launch({ executablePath: process.env.CHROME });

// words broken across lines: a word range with rects on two different lines
const BREAKS = () => {
  const out = [];
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = w.nextNode())) {
    const el = n.parentElement;
    if (!el || el.closest("svg, script, style, .sr-only, template")) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none") continue;
    const re = /[^\s ]+/g;
    let m;
    while ((m = re.exec(n.data))) {
      if (m[0].length < 3) continue;
      const r = document.createRange();
      r.setStart(n, m.index);
      r.setEnd(n, m.index + m[0].length);
      const rects = [...r.getClientRects()].filter((x) => x.width > 0);
      const tops = new Set(rects.map((x) => Math.round(x.top)));
      if (tops.size > 1) out.push(m[0]);
    }
  }
  return out;
};
const OVER = () => {
  const d = document.documentElement;
  const wide = [...document.querySelectorAll("body *")].filter((x) => {
    if (x.closest("[data-map]")) return false;
    const r = x.getBoundingClientRect();
    return r.width > 0 && (r.right > d.clientWidth + 1 || r.left < -1);
  }).map((x) => x.tagName + "." + String(x.className).slice(0, 40)).slice(0, 4);
  return { sw: d.scrollWidth, cw: d.clientWidth, wide };
};

for (const width of [360, 1400]) {
  const p = await b.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  p.on("pageerror", (e) => errors.push("pageerror " + e.message));
  p.on("console", (m) => { if (m.type() === "error") errors.push("console " + m.text()); });
  await p.goto(URL_, { waitUntil: "load", timeout: 90000 });
  await p.waitForTimeout(6000);
  // probe: does an error inside a srcdoc frame reach the listeners?
  const frames = p.frames().filter((f) => f !== p.mainFrame());
  await frames[0].evaluate(() => setTimeout(() => { throw new Error("probe"); }, 0));
  await p.waitForTimeout(300);
  const probed = errors.some((e) => e.includes("probe"));
  const realErrors = errors.filter((e) => !e.includes("probe"));
  const board = await p.evaluate(OVER);
  console.log(`@${width}: frames ${frames.length}, probe caught ${probed}, errors ${JSON.stringify(realErrors)}, board sw ${board.sw}/${board.cw} ${board.wide.join(" ")}`);
  if (width === 1400) {
    await p.screenshot({ path: `${OUT}board-1400.png`, fullPage: true });
    const ifr = await p.$$("iframe[data-cas]");
    for (let i = 0; i < ifr.length; i++) await ifr[i].screenshot({ path: `${OUT}cadre-${i + 1}.png` });
    for (const f of frames) {
      const o = await f.evaluate(OVER);
      const brk100 = await f.evaluate(BREAKS);
      const cas = await (await f.frameElement()).getAttribute("data-cas");
      const zoom = await (await f.frameElement()).getAttribute("data-zoom");
      await f.evaluate(() => { const s = document.createElement("style"); s.id = "z200"; s.textContent = "html{font-size:200%}"; document.head.appendChild(s); });
      await p.waitForTimeout(400);
      const o2 = await f.evaluate(OVER);
      const brk200 = await f.evaluate(BREAKS);
      // touch targets in the map and sheets
      const small = await f.evaluate(() => [...document.querySelectorAll("main a, main button")].filter((x) => {
        const r = x.getBoundingClientRect();
        return r.width > 0 && (r.height < 43.5 || r.width < 43.5) && getComputedStyle(x).display !== "inline";
      }).map((x) => (x.getAttribute("aria-label") || x.textContent.trim()).slice(0, 30)));
      console.log(`  ${cas}${zoom ? "@" + zoom : ""}: overflow ${o.sw}/${o.cw} ${o.wide.join(" ")} | 200%: ${o2.sw}/${o2.cw} ${o2.wide.join(" ")} | breaks100 ${JSON.stringify(brk100)} breaks200 ${JSON.stringify(brk200)} | small ${JSON.stringify(small)}`);
      await f.evaluate(() => document.getElementById("z200").remove());
    }
  } else {
    await p.screenshot({ path: `${OUT}board-360.png`, fullPage: false });
  }
  await p.close();
}
await b.close();
