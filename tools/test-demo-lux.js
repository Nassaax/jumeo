// Test de la démo Lux (demo-lux/) : toutes les pages (ordinateur + mobile), parcours du devis, captures.
// Usage : node tools/test-demo-lux.js [dossier de captures]
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', 'demo-lux');
const SHOTS = process.argv[2];
const map = p => p.route(u => u.protocol === 'file:' && !decodeURIComponent(u.pathname).startsWith(ROOT),
  r => r.fulfill({ path: path.join(ROOT, decodeURIComponent(new URL(r.request().url()).pathname)) }).catch(() => r.abort()));
const skipIntro = p => p.addInitScript(() => { try { sessionStorage.setItem('lux-intro', '1'); } catch (e) {} });

const pages = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (f.endsWith('.html')) pages.push(p); } })(ROOT);

(async () => {
  const b = await chromium.launch();
  const problems = [];
  for (const file of pages) {
    for (const w of [1280, 390]) {
      const p = await b.newPage({ viewport: { width: w, height: 844 } });
      await map(p); await skipIntro(p);
      const errs = [];
      p.on('console', m => m.type() === 'error' && errs.push(m.text()));
      p.on('pageerror', e => errs.push(e.message));
      await p.goto('file://' + file, { waitUntil: 'networkidle' });
      const r = await p.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth, logo: [...document.images].filter(i => i.src.includes('logo-lux') && i.complete && !i.naturalWidth).length }));
      const rel = path.relative(ROOT, file);
      if (errs.length) problems.push(`${rel} @${w} : ${errs.join(' | ')}`);
      if (r.overflow) problems.push(`${rel} @${w} : défilement horizontal`);
      if (r.logo) problems.push(`${rel} @${w} : logo non chargé`);
      await p.close();
    }
  }
  // Parcours du devis sur l'accueil
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await map(p); await skipIntro(p);
  await p.goto('file://' + path.join(ROOT, 'index.html'), { waitUntil: 'networkidle' });
  await p.click('input[name=service][value=chauffage]');
  await p.click('#qNext');
  await p.fill('#commune', 'Liège'); await p.fill('#nom', 'Test'); await p.fill('#tel', '0470000000');
  await p.check('#ok'); await p.click('#quoteForm button[type=submit]');
  console.log('Devis (aperçu) :', JSON.stringify(await p.inputValue('#previewText')));
  console.log('Mentions légales :', (await p.evaluate(() => document.getElementById('legalBody').textContent)).slice(0, 160));
  if (SHOTS) {
    await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(400);
    await p.screenshot({ path: path.join(SHOTS, 'lux-home.png') });
    await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; const e = document.getElementById('transparence'); scrollTo(0, e.getBoundingClientRect().top + scrollY - 80); });
    await p.waitForTimeout(2200); await p.screenshot({ path: path.join(SHOTS, 'lux-metier.png') });
    await p.evaluate(() => { const e = document.querySelector('.about'); scrollTo(0, e.getBoundingClientRect().top + scrollY - 200); });
    await p.waitForTimeout(900); await p.screenshot({ path: path.join(SHOTS, 'lux-about.png') });
    // écran d'ouverture (sans le sauter)
    const s = await b.newPage({ viewport: { width: 1280, height: 760 } }); await map(s);
    await s.goto('file://' + path.join(ROOT, 'index.html')); await s.waitForTimeout(1700);
    await s.screenshot({ path: path.join(SHOTS, 'lux-splash.png') });
    const ctx = await b.newContext({ ...devices['iPhone 13'] }); const m = await ctx.newPage(); await map(m); await skipIntro(m);
    await m.goto('file://' + path.join(ROOT, 'index.html'), { waitUntil: 'networkidle' }); await m.waitForTimeout(1300);
    await m.screenshot({ path: path.join(SHOTS, 'lux-mobile.png') });
    await m.goto('file://' + path.join(ROOT, 'certificat-peb', 'liege.html'), { waitUntil: 'networkidle' }); await m.waitForTimeout(900);
    await m.screenshot({ path: path.join(SHOTS, 'lux-liege-m.png') });
  }
  console.log(pages.length + ' pages testées (ordinateur + mobile).');
  console.log('PROBLÈMES :', problems.length ? '\n- ' + problems.join('\n- ') : 'aucun');
  await b.close();
})();
