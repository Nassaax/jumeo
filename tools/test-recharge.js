// Test du simulateur de recharge : valeurs calculées à la main, comparées à l'affichage.
// Usage : node tools/test-recharge.js
const { chromium } = require('playwright');
// En test local (file://), les adresses « /… » pointent vers la racine du disque : on les redirige vers le projet.
const ROOT_DIR = require('path').join(__dirname, '..');
async function mapRoot(p) {
  await p.route(u => u.protocol === 'file:' && !decodeURIComponent(u.pathname).startsWith(ROOT_DIR), r =>
    r.fulfill({ path: require('path').join(ROOT_DIR, decodeURIComponent(new URL(r.request().url()).pathname)) }).catch(() => r.abort()));
}

const path = require('path');
const url = 'file://' + path.join(__dirname, '..', 'simulateur-recharge.html');

const CAS = [
  // [description, réglages, attendu]
  ['Exemple par défaut (40 km, 18 kWh/100, borne 7,4 kW, 0,30 €)', {}, { rDay: '1 h 05', rFull: '5 h 24', rKmh: '37 km / h', rCost100: '6,00', rMonth: '72' }],
  ['Borne 22 kW mais voiture limitée à 11 kW', { pow: '22' }, { rDay: '44 min', note: 'limite la recharge à 11 kW' }],
  ['Prise ordinaire', { pow: '2.3' }, { rDay: '3 h 29', note: 'borne dédiée' }],
  ['Moitié solaire', { pv: '50' }, { rCost100: '3,00', rMonth: '36' }]
];

(async () => {
  const b = await chromium.launch();
  const errs = [];
  for (const w of [1280, 390]) {
    for (const [nom, set, att] of CAS) {
      const p = await b.newPage({ viewport: { width: w, height: 900 } });
      await mapRoot(p);
      p.on('pageerror', e => errs.push(e.message));
      p.on('console', m => m.type() === 'error' && errs.push(m.text()));
      await p.goto(url, { waitUntil: 'networkidle' });
      if (set.pow) await p.click(`input[name=evPow][value="${set.pow}"]`);
      if (set.pv) await p.$eval('#evPv', (el, v) => { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); }, set.pv);
      const r = await p.evaluate(() => Object.fromEntries(['rDay', 'rFull', 'rKmh', 'rCost100', 'rMonth', 'rNote'].map(id => [id, document.getElementById(id).textContent.replace(/ | /g, ' ')])));
      const overflow = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      const ko = Object.entries(att).filter(([k, v]) => !(k === 'note' ? r.rNote : r[k]).includes(v));
      if (w === 1280) console.log((ko.length ? '✗ ' : '✓ ') + nom + ' → ' + `${r.rDay} | 20-80 % : ${r.rFull} | ${r.rKmh} | ${r.rCost100} / 100 km | ${r.rMonth} / mois` + (r.rNote ? ' | note : ' + r.rNote.slice(0, 60) + '…' : ''));
      ko.forEach(([k, v]) => errs.push(`${w}px ${nom} : ${k} attendu « ${v} », obtenu « ${k === 'note' ? r.rNote : r[k]} »`));
      if (overflow) errs.push(`${w}px ${nom} : défilement horizontal`);
      await p.close();
    }
  }
  console.log('ERREURS :', errs.length ? errs : 'aucune');
  await b.close();
  process.exit(errs.length ? 1 : 0);
})();
