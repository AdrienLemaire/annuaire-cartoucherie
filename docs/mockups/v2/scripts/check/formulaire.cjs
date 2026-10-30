// formulaire.html: console errors and page overflow at 360/1400; then every
// frame alone in a 360 px iframe at 100 % and 200 %: words split across lines,
// elements past 360 px (ignoring those clipped by a scroller), orange objects.
const { chromium } = require('playwright');
const FILE = `file://${process.cwd()}/docs/mockups/v2/formulaire.html`;
const only = process.argv[2] ? process.argv[2].split(',') : null;
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME });
  for (const w of [1400, 360]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    const msgs = [];
    p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') msgs.push(m.type() + ': ' + m.text()); });
    p.on('pageerror', e => msgs.push('pageerror: ' + e.message));
    p.on('requestfailed', r => msgs.push('reqfail: ' + r.url()));
    await p.goto(FILE); await p.waitForTimeout(5000);
    const r = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, frames: document.querySelectorAll('.cadre').length }));
    console.log('PAGE', w, JSON.stringify(r), [...new Set(msgs)].join(' | '));
    if (w === 1400) {
      // orange per frame, as laid out on the board (scrolled frames: visible part only)
      const o = await p.evaluate(() => [...document.querySelectorAll('.cadre')].map(c => {
        const ecran = c.querySelector('.ecran'); const er = ecran.getBoundingClientRect();
        const vis = el => { const r = el.getBoundingClientRect(); if (!r.width || !r.height) return false;
          let a = el.parentElement; while (a && a !== ecran.parentElement) { const s = getComputedStyle(a);
            if (/(auto|hidden|scroll)/.test(s.overflowX + s.overflowY)) { const ar = a.getBoundingClientRect();
              if (r.right <= ar.left + 1 || r.left >= ar.right - 1 || r.bottom <= ar.top + 1 || r.top >= ar.bottom - 1) return false; }
            a = a.parentElement; } return getComputedStyle(el).visibility !== 'hidden' && !el.closest('[hidden]'); };
        const els = [...ecran.querySelectorAll('.cta, .filet, .diapo__filet')].filter(vis);
        return c.id + ':' + els.length + (els.length > 3 ? ' !!!' : '');
      }));
      console.log('ORANGE', o.join('  '));
    }
    await p.close();
  }
  const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
  await p.goto(FILE); await p.waitForTimeout(4000);
  const ids = await p.evaluate(() => [...document.querySelectorAll('.cadre')].map(c => c.id));
  for (const id of ids) { if (only && !only.includes(id)) continue;
    for (const zoom of ['100%', '200%']) {
      const res = await p.evaluate(async ({ id, zoom }) => {
        const ecran = document.querySelector('#' + id + ' .ecran');
        const head = [...document.head.querySelectorAll('link[rel=stylesheet],script[src],style')].map(e => e.outerHTML).join('\n');
        const sprites = [...document.querySelectorAll('body > svg')].map(e => e.outerHTML).join('');
        let inner = ecran.innerHTML.replace(/<div class="h-full overflow-y-auto" data-defile="[^"]*">/, '<div>');
        const f = document.createElement('iframe');
        f.style.cssText = 'width:360px;height:800px;border:0;position:absolute;left:0;top:0;background:#fff';
        f.srcdoc = '<!doctype html><html lang="fr" data-theme="cartoucherie"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">' + head +
          '<style>html{font-size:' + zoom + '} body > *{font-size:17px}</style></head><body>' + sprites + inner + '</body></html>';
        document.body.appendChild(f);
        await new Promise(r => f.onload = r); await new Promise(r => setTimeout(r, 1500));
        const d = f.contentDocument;
        const broken = [];
        d.querySelectorAll('h1, h2, h3, p, span, label, a, button, dd, dt, li, legend, textarea').forEach(el => {
          if (el.closest('svg') || el.closest('.diapo')) return;
          for (const t of el.childNodes) { if (t.nodeType !== 3) continue;
            const re = /[^\s\-‑–—/]+/g; let m;
            while ((m = re.exec(t.data))) {
              const r = d.createRange(); r.setStart(t, m.index); r.setEnd(t, m.index + m[0].length);
              const tops = new Set([...r.getClientRects()].filter(x => x.width > 0).map(x => Math.round(x.top)));
              if (tops.size > 1) broken.push(m[0]);
            } }
        });
        const clipped = el => { let a = el.parentElement; while (a && a !== d.body) { const s = getComputedStyle(a);
          if (/(auto|hidden|scroll)/.test(s.overflowX) && a.getBoundingClientRect().right <= 361) return true; a = a.parentElement; } return false; };
        const wide = [...d.body.querySelectorAll('*')].filter(e => !e.closest('svg') && e.getBoundingClientRect().right > 361 && !clipped(e))
          .map(e => e.tagName + '.' + String(e.className.baseVal ?? e.className).slice(0, 50) + ' r=' + Math.round(e.getBoundingClientRect().right)).slice(0, 4);
        const small = [...d.querySelectorAll('input:not([type=radio]):not([type=checkbox]):not([type=file]):not([type=range]), textarea')].filter(e => parseFloat(getComputedStyle(e).fontSize) < 16).map(e => e.id);
        f.remove();
        return { id, zoom, sw: d.documentElement.scrollWidth, wide, broken: [...new Set(broken)], small };
      }, { id, zoom });
      if (process.argv[3]==="all" || res.wide.length || res.broken.length || res.small.length || res.sw > 360) console.log('FRAME', JSON.stringify(res));
    } }
  console.log('done', ids.length);
  await b.close();
})();
