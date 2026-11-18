// Captures d'écran pour relire le design : ordinateur (1440×900), mobile (390×844),
// première image (0,35 s), section « Qui fait quoi » et page entière.
// Usage : node tools/shoot.js [dossier de sortie]
const { chromium } = require('playwright');
const path = require('path');
const out = process.argv[2] || path.join(__dirname, '..', 'shots');
const url = 'file://' + path.join(__dirname, '..', 'index.html');

(async () => {
  const b = await chromium.launch();
  const report = {};
  for (const [name, w, h] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    const errs = [];
    p.on('console', m => m.type() === 'error' && errs.push(m.text()));
    p.on('pageerror', e => errs.push(e.message));
    p.on('requestfailed', r => errs.push('échec : ' + r.url()));
    if (name === 'desktop') {
      const e = await b.newPage({ viewport: { width: w, height: h } });
      e.goto(url); await e.waitForTimeout(350);
      await e.screenshot({ path: path.join(out, 'desktop-early.png') }); await e.close();
    }
    await p.goto(url, { waitUntil: 'networkidle' });
    await p.waitForTimeout(2500);
    await p.screenshot({ path: path.join(out, name + '.png') });
    await p.evaluate(() => document.getElementById('transparence').scrollIntoView());
    await p.waitForTimeout(2400);
    await p.screenshot({ path: path.join(out, name + '-lien.png') });
    // page entière : on fait défiler pour déclencher toutes les apparitions
    const H = await p.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < H; y += 500) { await p.evaluate(v => scrollTo(0, v), y); await p.waitForTimeout(60); }
    await p.waitForTimeout(1200);
    await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(out, name + '-full.png'), fullPage: true });
    report[name] = await p.evaluate(() => ({
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
      fonts: [...new Set([...document.fonts].filter(f => f.status === 'loaded').map(f => f.family.replace(/"/g, '')))],
      h1Font: getComputedStyle(document.querySelector('h1')).fontFamily
    }));
    report[name].errors = errs;
  }
  console.log(JSON.stringify(report, null, 1));
  await b.close();
})();
