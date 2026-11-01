// Worst-case content on the slides: long name and long enseigne on the cover,
// a 300-character answer of long words under the longest title, at 1080 px wide.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME });
  const p = await b.newPage({ viewport: { width: 1400, height: 1000 } });
  await p.goto(`file://${process.cwd()}/docs/mockups/final/styleguide.html`);
  await p.waitForTimeout(4500);
  const r = await p.evaluate(() => {
    const out = [];
    const long300 = ('Accompagnement psychocorporel, réflexologie plantaire, aromathérapie scientifique, micronutrition personnalisée : ' +
      'chaque consultation commence par un questionnaire approfondi, continue par des recommandations individualisées, ' +
      'et se termine toujours par un rendez-vous de suivi indispensable, ensemble.').slice(0, 300);
    const check = (d, label) => {
      d.style.width = '1080px';
      const c = d.querySelector('.diapo__corps');
      const a = d.querySelector('.diapo__arche');
      const over = Math.max(c.scrollHeight - c.clientHeight, a ? a.scrollHeight - a.clientHeight : 0);
      const wide = [...d.querySelectorAll('*')].filter(x => x.scrollWidth > x.clientWidth + 1 && getComputedStyle(x).overflow !== 'hidden').map(x => x.className).slice(0, 3);
      out.push(label + ': over ' + over + 'px' + (wide.length ? ' wide ' + wide.join('|') : ''));
    };
    const scenes = [...document.querySelectorAll('#b-v2-diapos [data-rendu] .diapo')];
    // cover, longest name and enseigne
    const cv = scenes[0].cloneNode(true); document.body.appendChild(cv);
    cv.querySelector('.diapo__nom-grand').textContent = 'Marie-Christine Delacroix-Montesquieu';
    cv.querySelector('.diapo__metier').textContent = 'Naturopathe et praticienne en réflexologie plantaire · Marty Électricité Générale — dépannage, mise aux normes et bornes';
    check(cv, 'cover long');
    // every question slide with the 300-char answer of long words
    scenes.forEach((d, i) => {
      const t = d.querySelector('.diapo__texte'); if (!t) return;
      const x = d.cloneNode(true); document.body.appendChild(x);
      x.querySelector('.diapo__texte').textContent = long300;
      const ti = x.querySelector('.diapo__titre');
      ti.textContent = 'Les entrepreneurs de la Cartoucherie & moi';
      if (!x.style.getPropertyValue('--titre') && !(x.querySelector('.diapo__arche') || {style:{getPropertyValue:()=>''}}).style.getPropertyValue('--titre')) {
        (x.querySelector('.diapo__arche') || x).style.setProperty('--titre', '5.8cqi');
      }
      check(x, 'slide ' + (i + 1) + ' long300 (' + long300.length + ')');
    });
    return out;
  });
  console.log(r.join('\n'));
  await b.close();
})();
