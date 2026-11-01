// Render each specimen of the given blocks in a 360 px iframe at 100 % and 200 %,
// then report words split across lines and horizontal overflow.
const { chromium } = require('playwright');
const ids = process.argv.slice(2).filter(x => !x.includes(':'));
  const only = (process.argv.find(x => x.startsWith('only:')) || '').slice(5);
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME });
  const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
  await p.goto(`file://${process.cwd()}/docs/mockups/final/styleguide.html`);
  await p.waitForTimeout(2500);
  const shots = [];
  for (const id of ids) {
    const n = await p.evaluate(id => document.querySelectorAll('#' + id + ' [data-specimen] template').length, id);
    for (let i = 0; i < n; i++) for (const zoom of ['100%', '200%']) { if (only && !only.split(',').includes(id + '/' + i + '/' + zoom)) continue;
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
        const d = f.contentDocument;
        const broken = [];
        d.querySelectorAll('h1, h2, h3, .break-words, [data-mots], .mots-entiers, .ff, .choix').forEach(el => {
          const w = d.createTreeWalker(el, NodeFilter.SHOW_TEXT);
          let t; while ((t = w.nextNode())) {
            const re = /[^\s\-‑]+/g; let m;
            while ((m = re.exec(t.data))) {
              const r = d.createRange(); r.setStart(t, m.index); r.setEnd(t, m.index + m[0].length);
              const rects = [...r.getClientRects()].filter(x => x.width > 0);
              const tops = new Set(rects.map(x => Math.round(x.top)));
              if (tops.size > 1) broken.push(m[0]);
            }
          }
        });
        const wide = [...d.body.querySelectorAll('*')].filter(e => e.getBoundingClientRect().right > 361 && !e.closest('svg')).map(e => e.tagName + '.' + (e.className.baseVal ?? e.className).toString().slice(0, 60) + ' r=' + Math.round(e.getBoundingClientRect().right)).slice(0, 6);
        const out = { id, i, zoom, wide, sw: d.documentElement.scrollWidth, h1: [...d.querySelectorAll('h1')].map(h => getComputedStyle(h).fontSize).join(','), broken };
        f.remove();
        return out;
      }, { id, i, zoom });
      console.log(JSON.stringify(res));
    }
  }
  await b.close();
})();
