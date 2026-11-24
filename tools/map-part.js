// Carte de la Wallonie cliquable (accueil + page « Nos zones »).
// Fond : data/wallonie-map.json (généré par tools/make-map-wallonie.py, données GADM).
// Chaque commune de data/communes.json = un point cliquable vers sa page ; chaque province = un lien.
'use strict';
const fs = require('fs');
const path = require('path');

// Coordonnées approximatives du centre de chaque commune (latitude, longitude).
const COORDS = {
  liege: [50.6326, 5.5797], seraing: [50.5833, 5.5000], herstal: [50.6625, 5.6322], ans: [50.6597, 5.5197],
  verviers: [50.5891, 5.8628], huy: [50.5194, 5.2386], namur: [50.4669, 4.8675], charleroi: [50.4108, 4.4446],
  mons: [50.4542, 3.9567], waremme: [50.6977, 5.2553], spa: [50.4921, 5.8648], flemalle: [50.6031, 5.4567],
  'saint-nicolas': [50.6286, 5.5361], chaudfontaine: [50.5850, 5.6330], vise: [50.7340, 5.6950]
};
// Communes dont le nom est écrit sur la carte (les autres s'affichent au survol).
const LABELS = { liege: [0, -20, 'middle'], namur: [-12, -10, 'end'], charleroi: [-12, -12, 'end'], mons: [10, -10], verviers: [12, 5], huy: [10, 20], waremme: [-12, -8, 'end'] };

const css = `
/* ═════════ CARTE WALLONIE ═════════ */
.map-wrap{display:grid;grid-template-columns:1.4fr .6fr;gap:36px;align-items:center}
@media(max-width:900px){.map-wrap{grid-template-columns:1fr;gap:20px}}
.wmap{position:relative}
.wmap svg{width:100%;height:auto;overflow:visible}
.wmap .other{fill:rgba(11,36,65,.06);stroke:#fff;stroke-width:1.5}
.wmap .prov{fill:#dfe6ef;stroke:#fff;stroke-width:2;transition:fill .25s;cursor:pointer}
.wmap a:hover .prov,.wmap a:focus-visible .prov{fill:#cbd7e5}
.wmap .prov.served{fill:#c9d6e6}
.wmap .pname{font:600 13px 'Inter',sans-serif;fill:rgba(11,36,65,.55);letter-spacing:.12em;text-transform:uppercase;pointer-events:none}
.wmap .dot circle{fill:var(--accent);stroke:#0b2441;stroke-width:2.5;transition:r .2s}
.wmap .dot:hover circle,.wmap .dot:focus-visible circle{r:11}
.wmap .dot text{font:600 15px 'Inter',sans-serif;fill:#0b2441;paint-order:stroke;stroke:#f7f5f0;stroke-width:4px;stroke-linejoin:round}
.wmap .dot:focus{outline:none}.wmap .dot:focus-visible circle{stroke-width:4}
.wmap .hub circle{fill:#0b2441;stroke:var(--accent);stroke-width:3}
.wmap-tip{position:absolute;pointer-events:none;transform:translate(-50%,-130%);background:#0b2441;color:#fff;font:600 13px 'Inter',sans-serif;padding:6px 10px;border-radius:10px;white-space:nowrap;opacity:0;transition:opacity .15s}
.wmap-tip.on{opacity:1}
.map-side h3{font-size:22px;letter-spacing:-.03em;margin-bottom:10px}
.map-side p{color:var(--muted);font-size:15.5px;margin-bottom:14px}
.map-legend{list-style:none;display:grid;gap:8px;margin:0 0 18px;padding:0;font-size:14.5px}
.map-legend li{display:flex;align-items:center;gap:10px}
.map-legend i{width:14px;height:14px;border-radius:50%;flex:none}
.map-list{display:flex;flex-wrap:wrap;gap:6px;list-style:none;padding:0;margin:0}
.map-list a{display:inline-block;font-size:13.5px;padding:5px 11px;border-radius:999px;background:#fff;box-shadow:0 0 0 1px var(--line);text-decoration:none;color:var(--ink)}
.map-list a:hover{box-shadow:0 0 0 1px var(--ink)}
`;

const js = `
/* ── Carte : nom de la commune au survol ── */
document.querySelectorAll('.wmap').forEach(m => {
  const tip = m.querySelector('.wmap-tip');
  m.querySelectorAll('[data-tip]').forEach(a => {
    const show = () => { const r = (a.querySelector('circle') || a).getBoundingClientRect(), b = m.getBoundingClientRect(); tip.textContent = a.dataset.tip; tip.style.left = (r.left + r.width / 2 - b.left) + 'px'; tip.style.top = (r.top - b.top) + 'px'; tip.classList.add('on'); };
    a.addEventListener('mouseenter', show); a.addEventListener('focus', show);
    a.addEventListener('mouseleave', () => tip.classList.remove('on')); a.addEventListener('blur', () => tip.classList.remove('on'));
  });
});
`;

function html({ communes, esc, ROOT, hub = 'Grâce-Hollogne', hubCoords = [50.638, 5.493] }) {
  const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'wallonie-map.json'), 'utf8'));
  const p = M.proj;
  const xy = ([lat, lon]) => [+((lon * p.K - p.minx) * p.S + p.PAD).toFixed(1), +((-lat - p.miny) * p.S + p.PAD).toFixed(1)];
  const served = new Set(communes.map(c => c.province));
  const PROV_LABEL = { liege: [50.40, 5.78], namur: [50.20, 4.85], hainaut: [50.30, 3.95], luxembourg: [49.90, 5.45], 'brabant-wallon': [50.70, 4.62] };
  const provName = { liege: 'Liège', namur: 'Namur', hainaut: 'Hainaut', luxembourg: 'Luxembourg', 'brabant-wallon': 'Brabant wallon' };
  const provs = M.provinces.map(pr => {
    const isServed = served.has(provName[pr.id]);
    const href = isServed ? `/certificat-peb#province-${pr.id}` : `/?commune=${encodeURIComponent('Province de ' + pr.name)}#devis`;
    const tip = isServed ? `Province de ${pr.name} : voir les communes` : `Province de ${pr.name} : demander un devis`;
    const [lx, ly] = xy(PROV_LABEL[pr.id]);
    return `<a href="${href}" aria-label="${esc(tip)}"><title>${esc(tip)}</title><path class="prov${isServed ? ' served' : ''}" d="${pr.d}"/></a><text class="pname" x="${lx}" y="${ly}" text-anchor="middle">${esc(pr.name)}</text>`;
  }).join('');
  const dots = communes.filter(c => COORDS[c.slug]).map(c => {
    const [x, y] = xy(COORDS[c.slug]);
    const L = LABELS[c.slug];
    return `<a class="dot" href="/certificat-peb/${c.slug}" data-tip="Certificat PEB à ${esc(c.name)}" aria-label="Certificat PEB à ${esc(c.name)}"><circle cx="${x}" cy="${y}" r="7"/>${L ? `<text x="${x + L[0]}" y="${y + L[1]}"${L[2] ? ` text-anchor="${L[2]}"` : ''}>${esc(c.name)}</text>` : ''}</a>`;
  }).join('');
  const [hx, hy] = xy(hubCoords);
  return `<div class="map-wrap">
      <div class="wmap">
        <svg viewBox="${M.viewBox}" role="img" aria-label="Carte de la Wallonie : cliquez sur une province ou une commune">
          ${provs}
          <g class="dot hub" aria-hidden="true"><circle cx="${hx}" cy="${hy}" r="9"/></g>
          ${dots}
        </svg>
        <span class="wmap-tip" aria-hidden="true"></span>
      </div>
      <div class="map-side">
        <h3>Partout en Wallonie.</h3>
        <p>Au départ de ${esc(hub)}, en province de Liège. Cliquez sur votre commune ou votre province ; si elle n'est pas sur la carte, indiquez-la simplement dans votre demande.</p>
        <ul class="map-legend"><li><i style="background:#0b2441;box-shadow:0 0 0 3px var(--accent) inset"></i>${esc(hub)} (Lux Energie Solution)</li><li><i style="background:var(--accent);box-shadow:0 0 0 2px #0b2441 inset"></i>Communes avec leur page</li></ul>
        <ul class="map-list">${communes.map(c => `<li><a href="/certificat-peb/${c.slug}">${esc(c.name)}</a></li>`).join('')}</ul>
      </div>
    </div>`;
}

module.exports = { css, js, html };
