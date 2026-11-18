// Test du site dans un vrai navigateur (ordinateur + mobile 390 px).
// Usage : lancer un serveur local sur le port 8123, puis : node tools/test-site.js
const { chromium } = require('playwright');
// En test local (file://), les adresses « /… » pointent vers la racine du disque : on les redirige vers le projet.
const ROOT_DIR = require('path').join(__dirname, '..');
async function mapRoot(p) {
  await p.addInitScript(() => { try { sessionStorage.setItem('jumeo-intro', '1'); } catch (e) {} });
  await p.route(u => u.protocol === 'file:' && !decodeURIComponent(u.pathname).startsWith(ROOT_DIR), r =>
    r.fulfill({ path: require('path').join(ROOT_DIR, decodeURIComponent(new URL(r.request().url()).pathname)) }).catch(() => r.abort()));
}

const BASE = process.env.BASE || 'http://localhost:8123/';

(async () => {
  const b = await chromium.launch();
  const errs = [];
  for (const [w, h] of [[1280, 800], [390, 844]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await mapRoot(p);
    p.on('console', m => m.type() === 'error' && errs.push(w + ': ' + m.text()));
    p.on('pageerror', e => errs.push(w + ': ' + e.message));
    await p.goto(BASE, { waitUntil: 'networkidle' });

    const r = await p.evaluate(() => {
      const src = [...document.scripts].map(s => s.textContent).join('\n');
      const ids = [...src.matchAll(/\$\('#([\w-]+)'/g)].map(m => m[1]).filter(i => !i.endsWith('-')); // ignore les id construits à la volée (ex : '#dlg-' + nom)
      const picks = [...document.querySelectorAll('[data-pick]')].map(a => a.dataset.pick);
      const opts = [...document.querySelectorAll('input[name=service]')].map(o => o.value);
      return {
        defilementHorizontal: document.documentElement.scrollWidth > innerWidth,
        idsManquants: [...new Set(ids)].filter(i => !document.getElementById(i)),
        dataPickSansService: picks.filter(k => !SERVICES[k] || !opts.includes(k)),
        ligneControleElecVisible: !document.getElementById('elecLine').classList.contains('hide'),
        identiteCertificateur: document.getElementById('certIdentity').textContent
      };
    });
    console.log(w + 'px', JSON.stringify(r, null, 1));

    // Parcours : bouton « Devenir client partenaire » -> formulaire -> envoi (mode aperçu)
    await p.click('[data-aud="pro"][data-pick]');
    await p.waitForTimeout(500);
    console.log(w + 'px', 'service =', await p.$eval('input[name=service]:checked', e => e.value),
      '| profil =', await p.$eval('input[name=who]:checked', e => e.value),
      '| prix =', await p.textContent('#priceOut'));
    await p.fill('#commune', 'Liège');
    await p.fill('#nom', 'Test');
    await p.fill('#tel', '0470000000');
    await p.click('#quoteForm button[type=submit]');
    console.log(w + 'px', 'sans consentement ->', await p.textContent('#formNote'));
    await p.check('#ok');
    await p.click('#quoteForm button[type=submit]');
    console.log(w + 'px', 'aperçu ->', JSON.stringify(await p.inputValue('#previewText')));
    if (process.env.SHOT && w === 390) await p.screenshot({ path: process.env.SHOT });
  }
  console.log('ERREURS CONSOLE :', errs.length ? errs : 'aucune');
  await b.close();
  process.exit(errs.length ? 1 : 0);
})();
