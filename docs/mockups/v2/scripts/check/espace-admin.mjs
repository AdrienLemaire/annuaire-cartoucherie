// usage: node check.mjs espace|admin  [width...]
import { chromium } from "@playwright/test";
const file = process.argv[2];
const widths = process.argv.slice(3).map(Number);
const b = await chromium.launch({ executablePath: process.env.CHROME });
const probe = (doc, root, frameRight) => {
  const broken = [], wide = [], spill = [];
  const w = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let t;
  while ((t = w.nextNode())) {
    const el = t.parentElement;
    if (!el || el.closest('svg,script,style,template,.sr-only,[hidden]')) continue;
    const re = /[^\s\-‑ ]+/g; let m;
    while ((m = re.exec(t.data))) {
      if (m[0].length < 2) continue;
      const r = doc.createRange(); r.setStart(t, m.index); r.setEnd(t, m.index + m[0].length);
      const rects = [...r.getClientRects()].filter(x => x.width > 0);
      if (new Set(rects.map(x => Math.round(x.top))).size > 1) broken.push(m[0]);
      let blk = el; while (blk && blk !== root && /^inline/.test(getComputedStyle(blk).display)) blk = blk.parentElement;
      const br = blk.getBoundingClientRect();
      if (!el.closest('.overflow-x-auto') && rects.some(x => x.right > Math.min(br.right, frameRight) + 1)) spill.push(m[0]);
    }
  }
  root.querySelectorAll('*').forEach(e => {
    if (e.closest('svg') || e.closest('.overflow-x-auto') || e.closest('[hidden]')) return;
    const rr = e.getBoundingClientRect();
    if (rr.width && rr.right > frameRight + 1) wide.push(e.tagName + '.' + String(e.className.baseVal ?? e.className).slice(0, 50) + ' +' + Math.round(rr.right - frameRight));
  });
  return { broken: [...new Set(broken)], spill: [...new Set(spill)].slice(0, 8), wide: wide.slice(0, 5) };
};
for (const width of widths) {
  const p = await b.newPage({ viewport: { width, height: 900 } });
  const errs = [];
  p.on('pageerror', e => errs.push('pageerror ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('console ' + m.text()); });
  await p.goto(`file://${process.cwd()}/docs/mockups/v2/${file}.html`, { waitUntil: 'load' });
  await p.waitForTimeout(file === 'admin' ? 9000 : 4000);
  const sw = await p.evaluate(() => document.documentElement.scrollWidth);
  console.log(`== ${file} @${width}: page scrollWidth ${sw} ${sw > width ? 'OVERFLOW' : 'ok'}; errors: ${errs.length ? errs.join(' | ') : 'none'}`);
  for (const zoom of ['100%', '200%']) {
    const out = await p.evaluate(async ({ zoom, probeSrc, file }) => {
      const probe = eval(probeSrc);
      const res = [];
      if (file === 'espace') {
        document.documentElement.style.fontSize = zoom;
        await new Promise(r => setTimeout(r, 400));
        document.querySelectorAll('.ecran').forEach((e, i) => {
          const cap = e.closest('figure')?.querySelector('.legende')?.textContent.trim().slice(0, 30) || i;
          const fr = e.getBoundingClientRect().right;
          const o = probe(document, e, fr);
          if (o.broken.length || o.wide.length || o.spill.length) res.push(cap + ' ' + JSON.stringify(o));
        });
        document.documentElement.style.fontSize = '';
      } else {
        for (const f of document.querySelectorAll('iframe[data-ecran]')) {
          const d = f.contentDocument; if (!d) { res.push(f.title + ' NO DOC'); continue; }
          d.documentElement.style.fontSize = zoom;
          await new Promise(r => setTimeout(r, 250));
          const o = probe(d, d.body, d.documentElement.clientWidth);
          const sw = d.documentElement.scrollWidth, cw = d.documentElement.clientWidth;
          if (o.broken.length || o.wide.length || o.spill.length || sw > cw) res.push(f.title + ` sw=${sw}/${cw} ` + JSON.stringify(o));
          d.documentElement.style.fontSize = '';
        }
      }
      return res;
    }, { zoom, probeSrc: '(' + probe.toString() + ')', file });
    console.log(`-- ${zoom}: ${out.length ? '\n  ' + out.join('\n  ') : 'clean'}`);
  }
  await p.close();
}
await b.close();
