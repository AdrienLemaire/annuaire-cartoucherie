// Assemble profile specimens into one page per width; count orange objects per 740 px window.
const { chromium } = require('playwright');
const blocs = ['b-entete', 'b-fiche', 'b-contact', 'b-services', 'b-avis', 'b-appeler'];
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME });
  for (const w of [360, 1400]) {
    const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
    await p.goto(`file://${process.cwd()}/docs/mockups/final/styleguide.html`);
    await p.waitForTimeout(2500);
    const res = await p.evaluate(async ({ w, blocs }) => {
      const head = [...document.head.querySelectorAll('link[rel=stylesheet],script[src],style')].map(e => e.outerHTML).join('\n');
      const sprite = document.getElementById('src-sprite').outerHTML;
      // first specimen of each bloc, as on a profile page; for b-entete pick the fiche variant if any
      const body = blocs.map(id => { const t = [...document.querySelectorAll('#' + id + ' [data-specimen] template')]; return '<div data-from="' + id + '">' + (t.find(x => /fiche|membre/i.test(x.parentElement.querySelector('.variante')?.textContent || '')) || t[0]).innerHTML + '</div>'; }).join('');
      const f = document.createElement('iframe');
      f.style.cssText = 'width:' + w + 'px;height:740px;border:0;position:absolute;left:0;top:0';
      f.srcdoc = '<!doctype html><html lang="fr" data-theme="cartoucherie"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">' + head + '</head><body>' + sprite + body + '</body></html>';
      document.body.appendChild(f); await new Promise(r => f.onload = r); await new Promise(r => setTimeout(r, 1800));
      const d = f.contentDocument, W = d.defaultView;
      const isOrange = s => { if (!s) return false; if (/orange/.test(s)) return true;
        for (const m of s.matchAll(/oklch\(([\d.]+)%? ([\d.]+) ([\d.]+)/g)) { const C = +m[2], H = +m[3]; if (C > .1 && H > 20 && H < 75) return true; }
        for (const m of s.matchAll(/rgba?\((\d+), (\d+), (\d+)/g)) { const [r, g, bl] = [+m[1], +m[2], +m[3]]; if (r > 200 && g > 90 && g < 180 && bl < 90) return true; }
        return false; };
      const objs = [];
      d.querySelectorAll('body *').forEach(e => { if (e.closest('svg') && e.tagName !== 'svg') return; const cs = W.getComputedStyle(e);
        if (cs.visibility === 'hidden' || cs.display === 'none') return;
        if (isOrange(cs.backgroundColor) || isOrange(cs.backgroundImage)) { if (!objs.some(o => o.contains(e))) objs.push(e); } });
      const rects = objs.map(e => { const r = e.getBoundingClientRect(); return { top: r.top + W.scrollY, bottom: r.bottom + W.scrollY, fixed: W.getComputedStyle(e).position === 'fixed' || W.getComputedStyle(e).position === 'sticky', what: (e.closest('[data-from]')||{}).dataset?.from + ' ' + e.tagName + '.' + String(e.className).slice(0, 40) }; });
      const H = d.documentElement.scrollHeight; let max = 0, worst = 0;
      for (let y = 0; y <= Math.max(0, H - 740); y += 20) { const n = rects.filter(r => r.fixed || (r.bottom > y && r.top < y + 740)).length; if (n > max) { max = n; worst = y; } }
      return { w, H, max, worst, inWorst: rects.filter(r => r.fixed || (r.bottom > worst && r.top < worst + 740)).map(r => r.what), all: rects.map(r => r.what + '@' + Math.round(r.top)) };
    }, { w, blocs });
    console.log(JSON.stringify(res, null, 1));
    await p.close();
  }
  await b.close();
})();
