// Captures de la version « application » mobile (iPhone 13 : 390×844, @3x).
// Usage : node tools/shoot-app.js <dossier>
const { chromium, devices } = require('playwright');
const path = require('path');
const out = process.argv[2] || path.join(__dirname, '..', 'shots');
const root = 'file://' + path.join(__dirname, '..');

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPhone 13'] });
  const shot = async (url, name, fn) => {
    const p = await ctx.newPage();
    await p.goto(root + url, { waitUntil: 'networkidle' });
    await p.waitForTimeout(1300);
    if (fn) await fn(p);
    await p.screenshot({ path: path.join(out, name + '.png') });
    await p.close();
  };
  await shot('/index.html', 'app-accueil');
  await shot('/index.html', 'app-accueil-defile', p => p.evaluate(() => scrollTo(0, 1500)).then(() => p.waitForTimeout(900)));
  await shot('/index.html', 'app-menu', p => p.click('#tabMenu').then(() => p.waitForTimeout(600)));
  await shot('/guides/index.html', 'app-guides', p => p.evaluate(() => scrollTo(0, 330)).then(() => p.waitForTimeout(500)));
  await shot('/simulateur-peb.html', 'app-simu', p => p.evaluate(() => scrollTo(0, 300)).then(() => p.waitForTimeout(500)));
  await shot('/index.html', 'app-saisie', p => p.focus('#commune').then(() => p.waitForTimeout(500)));
  const d = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await d.goto(root + '/guides/index.html', { waitUntil: 'networkidle' }); await d.waitForTimeout(900);
  await d.screenshot({ path: path.join(out, 'desk-guides.png') });
  await b.close();
  console.log('OK');
})();
