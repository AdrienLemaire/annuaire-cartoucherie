// Strict per-specimen check at 360 px, 100 % and 200 %: every text node for words split
// across lines (breaks at - / . @ _ are allowed), every element for right edge past 360
// unless clipped by an overflow-hidden ancestor, every visible-overflow box whose content spills.
const { chromium } = require('playwright');
const ids = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME });
  const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
  await p.goto(`file://${process.cwd()}/docs/mockups/final/styleguide.html`);
  await p.waitForTimeout(2500);
  for (const id of ids) {
    const n = await p.evaluate(id => document.querySelectorAll('#' + id + ' [data-specimen] template').length, id);
    for (let i = 0; i < n; i++) for (const zoom of ['100%', '200%']) {
      const res = await p.evaluate(async ({ id, i, zoom }) => {
        const tpl = document.querySelectorAll('#' + id + ' [data-specimen] template')[i];
        const head = [...document.head.querySelectorAll('link[rel=stylesheet],link[rel=preconnect],script[src],style')].map(e => e.outerHTML).join('\n');
        const sprite = document.getElementById('src-sprite').outerHTML + (document.getElementById('src-plan') ? document.getElementById('src-plan').outerHTML : '');
        const f = document.createElement('iframe');
        f.style.cssText = 'width:360px;height:900px;border:0;position:absolute;left:0;top:0;background:#fff';
        f.srcdoc = '<!doctype html><html lang="fr" data-theme="cartoucherie"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">' + head +
          '<style>html{font-size:' + zoom + '}</style></head><body>' + sprite + tpl.innerHTML + '</body></html>';
        document.body.appendChild(f);
        await new Promise(r => f.onload = r);
        await new Promise(r => setTimeout(r, 1800));
        const d = f.contentDocument, W = d.defaultView;
        // reveal hidden toggles so they are checked too
        d.querySelectorAll('[hidden]').forEach(e => e.removeAttribute('hidden'));
        await new Promise(r => setTimeout(r, 300));
        const broken = [];
        const w = d.createTreeWalker(d.body, NodeFilter.SHOW_TEXT);
        let t;
        while ((t = w.nextNode())) {
          const el = t.parentElement;
          if (!el || el.closest('svg,script,style,.sr-only,pre')) continue;
          const cs = W.getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') continue;
          const re = /[^\s\-‑\/.@_]+/g; let m;
          while ((m = re.exec(t.data))) {
            const r = d.createRange(); r.setStart(t, m.index); r.setEnd(t, m.index + m[0].length);
            const rects = [...r.getClientRects()].filter(x => x.width > 0);
            if (new Set(rects.map(x => Math.round(x.bottom))).size > 1) broken.push(m[0]);
          }
        }
        const clipped = e => { for (let a = e.parentElement; a && a !== d.body; a = a.parentElement) { const o = W.getComputedStyle(a); if (o.overflowX !== 'visible' || o.overflow === 'hidden') return true; } return false; };
        const tag = e => e.tagName + '.' + (e.className.baseVal ?? e.className).toString().slice(0, 50);
        const wide = [...d.body.querySelectorAll('*')].filter(e => !e.closest('svg') && e.getBoundingClientRect().right > 361 && !clipped(e) && W.getComputedStyle(e).position !== 'fixed' || (W.getComputedStyle(e).position === 'fixed' && e.getBoundingClientRect().right > 361)).map(e => tag(e) + ' r=' + Math.round(e.getBoundingClientRect().right)).slice(0, 4);
        const spill = [...d.body.querySelectorAll('*')].filter(e => { if (e.closest('svg') || e.tagName === 'svg') return false; const o = W.getComputedStyle(e); return o.overflowX === 'visible' && e.scrollWidth > e.clientWidth + 1 && e.clientWidth > 0 && o.display !== 'inline'; }).map(e => tag(e) + ' ' + e.scrollWidth + '>' + e.clientWidth).slice(0, 4);
        const out = { id, i, zoom, sw: d.documentElement.scrollWidth, wide, spill, broken: [...new Set(broken)] };
        f.remove();
        return out;
      }, { id, i, zoom });
      if (res.sw > 360 || res.wide.length || res.spill.length || res.broken.length) console.log(JSON.stringify(res));
    }
  }
  await b.close();
})();
