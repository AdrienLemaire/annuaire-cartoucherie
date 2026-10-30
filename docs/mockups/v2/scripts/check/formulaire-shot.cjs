// Screenshot given frames (ids) of formulaire.html, at their board size.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME });
  const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
  await p.goto(`file://${process.cwd()}/docs/mockups/v2/formulaire.html`); await p.waitForTimeout(5000);
  for (const id of process.argv.slice(2)) {
    const el = await p.$('#f-' + id);
    await el.screenshot({ path: __dirname + '/shots/' + id + '.png' });
  }
  await b.close();
})();
