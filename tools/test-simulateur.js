// Test du simulateur PEB : 5 profils de biens, de bout en bout, puis transfert vers le formulaire de devis.
// Usage : node tools/test-simulateur.js
const { chromium } = require('playwright');
// En test local (file://), les adresses « /… » pointent vers la racine du disque : on les redirige vers le projet.
const ROOT_DIR = require('path').join(__dirname, '..');
async function mapRoot(p) {
  await p.route(u => u.protocol === 'file:' && !decodeURIComponent(u.pathname).startsWith(ROOT_DIR), r =>
    r.fulfill({ path: require('path').join(ROOT_DIR, decodeURIComponent(new URL(r.request().url()).pathname)) }).catch(() => r.abort()));
}

const path = require('path');
const root = path.join(__dirname, '..');
const url = 'file://' + path.join(root, 'simulateur-peb.html');

const PROFILS = [
  ['Maison 4 façades 1960, rien d\'isolé, simple vitrage, vieille chaudière', { type: '4f', annee: '1970', toit: 'non', murs: 'non', vitrage: 'simple', chauffage: 'chaudiere_ancienne', pv: 'non' }],
  ['Maison mitoyenne 1930 rénovée (toit, châssis, condensation)', { type: 'mitoyenne', annee: '1945', toit: 'recente', murs: 'non', vitrage: 'double_recent', chauffage: 'chaudiere_recente', pv: 'non' }],
  ['Appartement 2000, double vitrage récent, condensation', { type: 'appart', annee: '2010', toit: 'na', murs: 'nsp', vitrage: 'double_recent', chauffage: 'chaudiere_recente', pv: 'non' }],
  ['Maison 3 façades 2015, tout isolé, pompe à chaleur, PV', { type: '3f', annee: '2020', toit: 'recente', murs: 'oui', vitrage: 'triple', chauffage: 'pac', pv: 'oui' }],
  ['Maison 1980, chauffage électrique, ne sait pas', { type: '3f', annee: '1985', toit: 'nsp', murs: 'nsp', vitrage: 'double_ancien', chauffage: 'electrique', pv: 'non' }]
];

(async () => {
  const b = await chromium.launch();
  const errs = [];
  let lastHref = '';
  for (const [w, h] of [[1280, 900], [390, 844]]) {
    for (const [nom, rep] of PROFILS) {
      const p = await b.newPage({ viewport: { width: w, height: h } });
      await mapRoot(p);
      p.on('console', m => m.type() === 'error' && errs.push(m.text()));
      p.on('pageerror', e => errs.push(e.message));
      await p.goto(url, { waitUntil: 'networkidle' });
      // bouton « suivant » sans réponse -> message
      await p.click('#simNext');
      const msgVide = await p.textContent('#simNote');
      for (const [k, v] of Object.entries(rep)) {
        await p.click(`.q.on input[name="${k}"][value="${v}"]`);
        await p.waitForTimeout(300);
      }
      await p.click('#simNext');
      await p.waitForSelector('#simResult:not(.hide)');
      await p.fill('#simCommune', 'Liège');
      const r = await p.evaluate(() => ({
        titre: document.getElementById('resTitle').textContent,
        allumees: [...document.querySelectorAll('#resScale span.on')].map(s => s.dataset.l).join(''),
        conseils: document.querySelectorAll('#resTips li').length,
        href: document.getElementById('simCta').getAttribute('href'),
        overflow: document.documentElement.scrollWidth > innerWidth,
        avertissementVisible: !!document.querySelector('#simResult .warn').offsetParent
      }));
      if (w === 1280) console.log(`- ${nom}\n    → ${r.titre} (échelle : ${r.allumees}, ${r.conseils} conseils)`);
      if (r.overflow) errs.push(`${w}px ${nom} : défilement horizontal`);
      if (!r.avertissementVisible) errs.push('avertissement invisible');
      if (!msgVide.includes('Choisissez')) errs.push('pas de message si aucune réponse');
      lastHref = r.href;
      if (process.env.SHOT && w === 390 && nom.startsWith('Maison mitoyenne')) await p.screenshot({ path: process.env.SHOT });
      await p.close();
    }
  }
  // Transfert vers le formulaire de devis
  const p = await b.newPage();
  await mapRoot(p);
  const [q, hash] = lastHref.split('#');
  await p.goto('file://' + path.join(root, 'index.html') + q.slice(1) + '#' + hash, { waitUntil: 'networkidle' });
  console.log('Lien du devis :', lastHref);
  console.log('Formulaire : commune =', await p.inputValue('#commune'), '| service =', await p.$eval('input[name=service]:checked', e => e.value), '| message =', await p.inputValue('#msg'));
  console.log('ERREURS :', errs.length ? errs : 'aucune');
  await b.close();
})();
