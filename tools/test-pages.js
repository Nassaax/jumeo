// Test des pages générées par build.js (communes, « Nos zones », simulateur PEB, guides).
// Usage : node tools/test-pages.js
const { chromium } = require('playwright');
// En test local (file://), les adresses « /… » pointent vers la racine du disque : on les redirige vers le projet.
const ROOT_DIR = require('path').join(__dirname, '..');
async function mapRoot(p) {
  await p.addInitScript(() => { try { sessionStorage.setItem('wallpeb-intro', '1'); } catch (e) {} });
  await p.route(u => u.protocol === 'file:' && !decodeURIComponent(u.pathname).startsWith(ROOT_DIR), r =>
    r.fulfill({ path: require('path').join(ROOT_DIR, decodeURIComponent(new URL(r.request().url()).pathname)) }).catch(() => r.abort()));
}

const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

const files = ['simulateur-peb.html', 'certificat-peb/index.html',
  ...fs.readdirSync(path.join(root, 'certificat-peb')).filter(f => f !== 'index.html').map(f => 'certificat-peb/' + f),
  ...fs.readdirSync(path.join(root, 'guides')).map(f => 'guides/' + f)];

(async () => {
  const b = await chromium.launch();
  const problems = [];
  const titles = new Map(), descs = new Map();
  for (const f of files) {
    for (const w of [1280, 390]) {
      const p = await b.newPage({ viewport: { width: w, height: 844 } });
      await mapRoot(p);
      const errs = [];
      p.on('console', m => m.type() === 'error' && errs.push(m.text()));
      p.on('pageerror', e => errs.push(e.message));
      await p.goto('file://' + path.join(root, f), { waitUntil: 'networkidle' });
      const r = await p.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        title: document.title,
        desc: document.querySelector('meta[name=description]').content,
        h1: document.querySelectorAll('h1').length,
        ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => { try { JSON.parse(s.textContent); return true; } catch { return false; } })
      }));
      if (errs.length) problems.push(`${f} @${w}: erreurs ${errs.join(' | ')}`);
      if (r.overflow) problems.push(`${f} @${w}: défilement horizontal`);
      if (r.h1 !== 1) problems.push(`${f}: ${r.h1} titres h1`);
      if (r.ld.includes(false)) problems.push(`${f}: données structurées invalides`);
      if (w === 1280) {
        if (titles.has(r.title)) problems.push(`${f}: titre identique à ${titles.get(r.title)}`);
        if (descs.has(r.desc)) problems.push(`${f}: description identique à ${descs.get(r.desc)}`);
        titles.set(r.title, f); descs.set(r.desc, f);
        if (r.title.length > 70) problems.push(`${f}: titre long (${r.title.length} car.)`);
      }
      const txt = await p.evaluate(() => document.body.innerText);
      for (const w2 of ['Jumeo', 'apporteur', 'Devenir partenaire', 'recharge']) if (txt.includes(w2) && w === 1280) problems.push(`${f}: contient encore « ${w2} »`);
      await p.close();
    }
  }
  console.log(files.length + ' pages testées (ordinateur + mobile 390 px).');
  console.log('PROBLÈMES :', problems.length ? '\n- ' + problems.join('\n- ') : 'aucun');
  await b.close();
  process.exit(problems.length ? 1 : 0);
})();
