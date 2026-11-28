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
// Autres villes desservies (sans page dédiée) : point plus petit, ouvre le devis avec la commune pré-remplie.
// Coordonnées approximatives du centre (latitude, longitude).
const VILLES = [
  ['Eupen', 50.630, 6.031],
  ['Malmedy', 50.426, 6.028],
  ['Stavelot', 50.395, 5.931],
  ['Saint-Vith', 50.282, 6.127],
  ['Herve', 50.640, 5.794],
  ['Oupeye', 50.705, 5.645],
  ['Grâce-Hollogne', 50.638, 5.493],
  ['Awans', 50.667, 5.462],
  ['Hannut', 50.670, 5.078],
  ['Amay', 50.549, 5.315],
  ['Engis', 50.581, 5.400],
  ['Esneux', 50.533, 5.567],
  ['Aywaille', 50.473, 5.675],
  ['Sprimont', 50.508, 5.659],
  ['Theux', 50.533, 5.813],
  ['Dison', 50.610, 5.853],
  ['Pepinster', 50.567, 5.807],
  ['Soumagne', 50.614, 5.746],
  ['Fléron', 50.615, 5.681],
  ['Blegny', 50.672, 5.725],
  ['Welkenraedt', 50.661, 5.970],
  ['Plombières', 50.736, 5.958],
  ['Waimes', 50.415, 6.112],
  ['Trooz', 50.570, 5.689],
  ['Neupré', 50.546, 5.488],
  ['Comblain-au-Pont', 50.476, 5.578],
  ['Wanze', 50.539, 5.209],
  ['Braives', 50.632, 5.149],
  ['Remicourt', 50.680, 5.329],
  ['Juprelle', 50.709, 5.531],
  ['Bassenge', 50.759, 5.609],
  ['Dalhem', 50.713, 5.726],
  ['Aubel', 50.703, 5.858],
  ['Limbourg', 50.612, 5.941],
  ['Jalhay', 50.559, 5.967],
  ['Nandrin', 50.506, 5.419],
  ['Saint-Georges-sur-Meuse', 50.600, 5.358],
  ['Villers-le-Bouillet', 50.577, 5.258],
  ['Bütgenbach', 50.426, 6.205],
  ['Bullange', 50.407, 6.258],
  ['Trois-Ponts', 50.372, 5.873],
  ['Ferrières', 50.401, 5.607],
  ['Dinant', 50.261, 4.912],
  ['Gembloux', 50.561, 4.692],
  ['Andenne', 50.490, 5.096],
  ['Ciney', 50.295, 5.100],
  ['Philippeville', 50.196, 4.543],
  ['Couvin', 50.053, 4.494],
  ['Sambreville', 50.437, 4.622],
  ['Fosses-la-Ville', 50.395, 4.696],
  ['Rochefort', 50.163, 5.222],
  ['Beauraing', 50.110, 4.956],
  ['Eghezée', 50.592, 4.912],
  ['Floreffe', 50.433, 4.759],
  ['Profondeville', 50.375, 4.866],
  ['Jemeppe-sur-Sambre', 50.462, 4.663],
  ['Sombreffe', 50.528, 4.600],
  ['Walcourt', 50.254, 4.434],
  ['Florennes', 50.251, 4.607],
  ['Gedinne', 49.983, 4.937],
  ['Hamois', 50.340, 5.155],
  ['Assesse', 50.369, 5.022],
  ['Havelange', 50.385, 5.236],
  ['Yvoir', 50.328, 4.881],
  ['Viroinval', 50.050, 4.640],
  ['Houyet', 50.191, 5.007],
  ['Tournai', 50.606, 3.388],
  ['Mouscron', 50.744, 3.214],
  ['La Louvière', 50.479, 4.188],
  ['Binche', 50.411, 4.166],
  ['Ath', 50.630, 3.778],
  ['Soignies', 50.580, 4.071],
  ['Enghien', 50.692, 4.041],
  ['Lessines', 50.712, 3.836],
  ['Châtelet', 50.405, 4.525],
  ['Fleurus', 50.484, 4.550],
  ['Thuin', 50.339, 4.287],
  ['Chimay', 50.048, 4.317],
  ['Péruwelz', 50.509, 3.592],
  ['Saint-Ghislain', 50.452, 3.818],
  ['Boussu', 50.434, 3.794],
  ['Quaregnon', 50.441, 3.866],
  ['Frameries', 50.410, 3.896],
  ['Comines-Warneton', 50.773, 3.003],
  ['Courcelles', 50.462, 4.374],
  ['Fontaine-l\'Évêque', 50.410, 4.322],
  ['Manage', 50.502, 4.236],
  ['Braine-le-Comte', 50.609, 4.137],
  ['Seneffe', 50.531, 4.262],
  ['Leuze-en-Hainaut', 50.598, 3.617],
  ['Belœil', 50.548, 3.731],
  ['Farciennes', 50.430, 4.553],
  ['Montigny-le-Tilleul', 50.381, 4.375],
  ['Anderlues', 50.406, 4.270],
  ['Morlanwelz', 50.454, 4.245],
  ['Écaussinnes', 50.564, 4.180],
  ['Quiévrain', 50.405, 3.684],
  ['Dour', 50.396, 3.778],
  ['Estaimpuis', 50.704, 3.268],
  ['Antoing', 50.567, 3.449],
  ['Beaumont', 50.236, 4.239],
  ['Momignies', 50.029, 4.166],
  ['Chièvres', 50.587, 3.807],
  ['Silly', 50.648, 3.924],
  ['Frasnes-lez-Anvaing', 50.676, 3.597],
  ['Gerpinnes', 50.338, 4.528],
  ['Aiseau-Presles', 50.410, 4.586],
  ['Les Bons Villers', 50.519, 4.453],
  ['Wavre', 50.717, 4.601],
  ['Nivelles', 50.597, 4.329],
  ['Ottignies-Louvain-la-Neuve', 50.668, 4.613],
  ['Waterloo', 50.715, 4.399],
  ['Braine-l\'Alleud', 50.683, 4.368],
  ['Tubize', 50.693, 4.205],
  ['Rixensart', 50.711, 4.531],
  ['Jodoigne', 50.723, 4.869],
  ['Genappe', 50.611, 4.452],
  ['Perwez', 50.624, 4.812],
  ['Rebecq', 50.665, 4.134],
  ['La Hulpe', 50.730, 4.486],
  ['Lasne', 50.686, 4.484],
  ['Court-Saint-Étienne', 50.633, 4.567],
  ['Grez-Doiceau', 50.739, 4.697],
  ['Ittre', 50.644, 4.264],
  ['Chaumont-Gistoux', 50.677, 4.719],
  ['Villers-la-Ville', 50.587, 4.529],
  ['Arlon', 49.683, 5.817],
  ['Bastogne', 50.001, 5.716],
  ['Marche-en-Famenne', 50.227, 5.344],
  ['Libramont-Chevigny', 49.920, 5.379],
  ['Neufchâteau', 49.841, 5.435],
  ['Virton', 49.568, 5.533],
  ['Bouillon', 49.794, 5.067],
  ['Durbuy', 50.352, 5.456],
  ['La Roche-en-Ardenne', 50.183, 5.576],
  ['Saint-Hubert', 50.027, 5.374],
  ['Aubange', 49.567, 5.805],
  ['Messancy', 49.597, 5.818],
  ['Houffalize', 50.133, 5.790],
  ['Vielsalm', 50.284, 5.917],
  ['Hotton', 50.268, 5.447],
  ['Florenville', 49.700, 5.307],
  ['Paliseul', 49.903, 5.135],
  ['Bertrix', 49.855, 5.253],
  ['Étalle', 49.674, 5.600],
  ['Gouvy', 50.188, 5.938],
  ['Manhay', 50.293, 5.676],
  ['Érezée', 50.293, 5.557],
  ['Vaux-sur-Sûre', 49.912, 5.574],
  ['Habay', 49.725, 5.646]
];
const TOWN_LABELS = { Tournai: [-8, 4, 'end'], Mouscron: [8, 4], Wavre: [8, 8], Nivelles: [-8, 4, 'end'], Dinant: [8, 4], Arlon: [8, 4], Bastogne: [8, 4], 'Marche-en-Famenne': [8, 4], Eupen: [8, 4], 'Libramont-Chevigny': [-8, 4, 'end'], Chimay: [8, 4], Ath: [0, -10, 'middle'] };
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
.wmap .pname{font:600 13px 'Inter',sans-serif;fill:rgba(11,36,65,.5);letter-spacing:.12em;text-transform:uppercase;pointer-events:none;paint-order:stroke;stroke:#f7f5f0;stroke-width:4px;stroke-linejoin:round}
.wmap .town text{font:500 12.5px 'Inter',sans-serif;fill:#0b2441;paint-order:stroke;stroke:#f7f5f0;stroke-width:3.5px;stroke-linejoin:round;pointer-events:none}
.wmap .dot circle{fill:var(--accent);stroke:#0b2441;stroke-width:2.5;transition:r .2s}
.wmap .dot:hover circle,.wmap .dot:focus-visible circle{r:11}
.wmap .dot text{font:600 15px 'Inter',sans-serif;fill:#0b2441;paint-order:stroke;stroke:#f7f5f0;stroke-width:4px;stroke-linejoin:round}
.wmap .town circle{fill:#fff;stroke:#0b2441;stroke-width:2;transition:r .2s,fill .2s}
.wmap .town:hover circle,.wmap .town:focus-visible circle{r:8;fill:var(--accent)}
.wmap .town:focus{outline:none}
.wmap .dot:focus{outline:none}.wmap .dot:focus-visible circle{stroke-width:4}
.wmap .hub circle{fill:#0b2441;stroke:var(--accent);stroke-width:3}
.wmap-tip{position:absolute;pointer-events:none;transform:translate(-50%,-130%);background:#0b2441;color:#fff;font:600 13px 'Inter',sans-serif;padding:6px 10px;border-radius:10px;white-space:nowrap;opacity:0;transition:opacity .15s}
.wmap-tip.on{opacity:1}
.wmap.anim .town circle,.wmap.anim .dot:not(.hub) circle{transform-box:fill-box;transform-origin:center;transition:r .2s,fill .2s,transform .55s cubic-bezier(.34,1.56,.64,1) var(--d,0ms),opacity .3s ease var(--d,0ms)}
.wmap.anim:not(.lit) .town circle,.wmap.anim:not(.lit) .dot:not(.hub) circle{transform:scale(0);opacity:0}
.wmap .hub .pulse{fill:none;stroke:var(--accent);stroke-width:2;opacity:0;transform-box:fill-box;transform-origin:center}
.wmap.lit .hub .pulse{animation:hub-pulse 1.8s cubic-bezier(.16,1,.3,1) .1s 2}
@keyframes hub-pulse{0%{opacity:.9;transform:scale(1)}100%{opacity:0;transform:scale(4.5)}}
@media(prefers-reduced-motion:reduce){.wmap.anim:not(.lit) .town circle,.wmap.anim:not(.lit) .dot:not(.hub) circle{transform:none;opacity:1}.wmap .hub .pulse{display:none}}
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
/* ── Carte : les points apparaissent en vague depuis le siège ── */
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) document.querySelectorAll('.wmap').forEach(m => {
  const hub = m.querySelector('.hub circle:not(.pulse)'); if (!hub) return;
  const hx = +hub.getAttribute('cx'), hy = +hub.getAttribute('cy');
  const cs = [...m.querySelectorAll('.town circle, .dot:not(.hub) circle')];
  const dist = c => Math.hypot(+c.getAttribute('cx') - hx, +c.getAttribute('cy') - hy);
  const max = Math.max(1, ...cs.map(dist));
  cs.forEach(c => c.style.setProperty('--d', Math.round(dist(c) / max * 1100) + 'ms'));
  m.classList.add('anim');
  const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { m.classList.add('lit'); io.disconnect(); } }, { threshold: .25 });
  io.observe(m);
});
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
  const PROV_LABEL = { liege: [50.36, 5.78], namur: [50.15, 4.78], hainaut: [50.26, 3.90], luxembourg: [49.78, 5.60], 'brabant-wallon': [50.80, 4.42] };
  const provName = { liege: 'Liège', namur: 'Namur', hainaut: 'Hainaut', luxembourg: 'Luxembourg', 'brabant-wallon': 'Brabant wallon' };
  const provLabels = [];
  const provs = M.provinces.map(pr => {
    const isServed = served.has(provName[pr.id]);
    const href = isServed ? `/certificat-peb#province-${pr.id}` : `/?commune=${encodeURIComponent('Province de ' + pr.name)}#devis`;
    const tip = isServed ? `Province de ${pr.name} : voir les communes` : `Province de ${pr.name} : demander un devis`;
    const [lx, ly] = xy(PROV_LABEL[pr.id]);
    provLabels.push(`<text class="pname" x="${lx}" y="${ly}" text-anchor="middle">${esc(pr.name)}</text>`);
    return `<a href="${href}" aria-label="${esc(tip)}"><title>${esc(tip)}</title><path class="prov served" d="${pr.d}"/></a>`;
  }).join('');
  const have = new Set(communes.map(c => c.name));
  const towns = VILLES.filter(([n]) => !have.has(n) && n !== hub).map(([n, la, lo]) => {
    const [x, y] = xy([la, lo]);
    return `<a class="town" href="/?commune=${encodeURIComponent(n)}#devis" data-tip="${esc(n)} : demander un devis" aria-label="Certificat PEB à ${esc(n)} : demander un devis"><circle cx="${x}" cy="${y}" r="4.5"/>${TOWN_LABELS[n] ? `<text x="${x + TOWN_LABELS[n][0]}" y="${y + TOWN_LABELS[n][1]}"${TOWN_LABELS[n][2] ? ` text-anchor="${TOWN_LABELS[n][2]}"` : ''}>${esc(n === 'Libramont-Chevigny' ? 'Libramont' : n === 'Marche-en-Famenne' ? 'Marche' : n)}</text>` : ''}</a>`;
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
          <g class="dot hub" aria-hidden="true"><circle class="pulse" cx="${hx}" cy="${hy}" r="9"/><circle cx="${hx}" cy="${hy}" r="9"/></g>
          ${towns}
          ${dots}
          <g aria-hidden="true">${provLabels.join('')}</g>
        </svg>
        <span class="wmap-tip" aria-hidden="true"></span>
      </div>
      <div class="map-side">
        <h3>Partout en Wallonie.</h3>
        <p>Au départ de ${esc(hub)}, en province de Liège. Cliquez sur votre commune ou votre province ; si elle n'est pas sur la carte, indiquez-la simplement dans votre demande.</p>
        <ul class="map-legend"><li><i style="background:#0b2441;box-shadow:0 0 0 3px var(--accent) inset"></i>${esc(hub)} (Lux Energie Solution)</li><li><i style="background:var(--accent);box-shadow:0 0 0 2px #0b2441 inset"></i>Communes avec leur page</li><li><i style="background:#fff;box-shadow:0 0 0 2px #0b2441 inset;width:10px;height:10px;margin:2px"></i>Autres villes : un clic, et votre demande de devis est prête</li></ul>
        <ul class="map-list">${communes.map(c => `<li><a href="/certificat-peb/${c.slug}">${esc(c.name)}</a></li>`).join('')}</ul>
      </div>
    </div>`;
}

module.exports = { css, js, html };
