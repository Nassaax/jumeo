// Menus déroulants de l'en-tête (ordinateur) : « Prestations », « Type de bien », « Le PEB ».
// Inséré par build.js dans les pages générées (nav) et dans index.html (marqueurs NAVPEB).
'use strict';

const ICO = {
  book: '<path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z"/><path d="M4 21a2 2 0 0 1 2-2h12v2"/>',
  gavel: '<path d="M14 4l6 6M11 7l6 6M8 10l6-6M10 12l-6 6a1.4 1.4 0 0 0 2 2l6-6"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/>',
  route: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h6a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h6"/>',
  up: '<path d="M4 20h16"/><path d="M7 16l4-4 3 3 5-6"/><path d="M15 9h4v4"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3M15 8l2 2"/>',
  tag: '<path d="M20 12l-8 8-8-8V4h8z"/><circle cx="8.5" cy="8.5" r="1.5"/>',
  building: '<path d="M4 21V5a1 1 0 0 1 1-1h9v17"/><path d="M14 9h5a1 1 0 0 1 1 1v11"/><path d="M8 8h2M8 12h2M8 16h2M3 21h18"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/>',
  gauge: '<path d="M4 15a8 8 0 1 1 16 0"/><path d="M12 15l4-5"/><circle cx="12" cy="15" r="1.4"/>',
  all: '<path d="M4 6h16M4 12h16M4 18h10"/>',
  studio: '<rect x="4" y="6" width="16" height="13" rx="1"/><path d="M4 14h16M8 14v-3h5v3"/>',
  appart: '<path d="M5 21V4h14v17M3 21h18"/><path d="M9 8h2M13 8h2M9 12h2M13 12h2M10 21v-4h4v4"/>',
  duplex: '<path d="M4 21V9l8-5 8 5v12M2 21h20M4 14h16"/><path d="M9 21v-3h6v3"/>',
  maison: '<path d="M3 11l9-8 9 8"/><path d="M5 10v11h14V10"/><path d="M10 21v-6h4v6"/>',
  sell: '<path d="M4 20V9l8-6 8 6v11"/><path d="M9 14h6M12 11v6"/>',
  pros: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6"/>'
};
const PRESTA = [
  ['/certificat-peb-vente', 'sell', 'Vendre un bien'],
  ['/certificat-peb-location', 'key', 'Louer un bien'],
  ['/pack-peb-controle-electrique', 'route', 'Pack PEB + contrôle électrique'],
  ['/controle-electrique', 'bolt', 'Contrôle électrique'],
  ['/#tarifs', 'tag', 'Nos tarifs'],
  ['/#pros', 'pros', 'Agences, notaires, gestionnaires']
];
const TYPES = [
  ['/certificat-peb-studio', 'studio', 'Studio'],
  ['/certificat-peb-appartement', 'appart', 'Appartement'],
  ['/certificat-peb-duplex-loft', 'duplex', 'Duplex & loft'],
  ['/certificat-peb-maison', 'maison', 'Maison'],
  ['/certificat-peb-immeuble', 'building', 'Immeuble & copropriété']
];
const ITEMS = [
  ['/guides/peb-c-est-quoi', 'book', 'Le PEB, c\'est quoi ?'],
  ['/guides/amendes-certificat-peb', 'gavel', 'Amendes & sanctions'],
  ['/guides/preuves-certificat-peb', 'list', 'Préparer la visite'],
  ['/guides/nouveau-certificat-peb-2026', 'route', 'Feuille de route de rénovation'],
  ['/guides/ameliorer-label-peb', 'up', 'Améliorer son PEB'],
  ['/certificat-peb-location', 'key', 'PEB et location'],
  ['/guides/prix-certificat-peb', 'tag', 'Prix du certificat PEB'],
  ['/certificat-peb-immeuble', 'building', 'PEB immeuble & copropriété'],
  ['/guides/controle-electrique-vente', 'bolt', 'Contrôle électrique à la vente'],
  ['/simulateur-peb', 'gauge', 'Simulateur de label PEB']
];
const svg = k => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICO[k]}</svg>`;

const dd = (id, label, items, all) => `<div class="dd" data-dd>
        <button type="button" class="dd-btn" aria-expanded="false" aria-controls="${id}">${label}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>
        <div class="dd-menu" id="${id}">
          ${items.map(([h, i, l]) => `<a href="${h}">${svg(i)}<span>${l}</span></a>`).join('\n          ')}
          ${all ? `<a class="dd-all" href="${all[0]}">${svg('all')}<span>${all[1]}</span></a>` : ''}
        </div>
      </div>`;
const html = dd('ddPresta', 'Prestations', PRESTA) + '\n      ' + dd('ddTypes', 'Type de bien', TYPES, ['/#biens', 'Voir tous les types de bien']) + '\n      ' + dd('ddPeb', 'Le PEB', ITEMS, ['/guides', 'Tous nos guides']);

const css = `
/* ═════════ MENU « LE PEB » ═════════ */
.dd{position:relative;display:flex;align-items:center}
.dd-btn{display:inline-flex;align-items:center;gap:4px;border:0;background:none;color:inherit;font:500 14px 'Inter',sans-serif;opacity:.82;cursor:pointer;padding:6px 0}
.dd-btn:hover,.dd.open .dd-btn{opacity:1}
.dd-btn svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;transition:transform .2s}
.dd.open .dd-btn svg{transform:rotate(180deg)}
.dd-menu{position:absolute;top:calc(100% + 12px);left:50%;transform:translateX(-50%) translateY(6px);width:320px;display:grid;gap:2px;padding:10px;border-radius:20px;background:#fff;color:var(--ink);box-shadow:0 0 0 1px rgba(11,36,65,.08),0 24px 60px rgba(11,36,65,.22);opacity:0;visibility:hidden;transition:opacity .2s,transform .2s,visibility .2s;z-index:60}
.dd-menu::before{content:"";position:absolute;left:0;right:0;top:-14px;height:14px}
.dd.open .dd-menu{opacity:1;visibility:visible;transform:translateX(-50%)}
@media(hover:hover){.dd:hover .dd-menu{opacity:1;visibility:visible;transform:translateX(-50%)}.dd:hover .dd-btn svg{transform:rotate(180deg)}}
.dd-menu a{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:12px;text-decoration:none;font:500 14.5px 'Inter',sans-serif;opacity:1!important;color:var(--ink)}
.dd-menu a:hover,.dd-menu a:focus-visible{background:#fff6d6}
.dd-menu a svg{width:20px;height:20px;flex:none;fill:none;stroke:#d99e00;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.dd-menu .dd-all{margin-top:4px;border-top:1px solid rgba(11,36,65,.1);border-radius:0 0 12px 12px;font-weight:600}
`;

const js = `
/* ── Menu « Le PEB » : ouverture au clic / clavier, fermeture en dehors ou Échap ── */
document.querySelectorAll('[data-dd]').forEach(dd => {
  const b = dd.querySelector('.dd-btn');
  const set = o => { dd.classList.toggle('open', o); b.setAttribute('aria-expanded', String(o)); };
  b.addEventListener('click', () => set(!dd.classList.contains('open')));
  document.addEventListener('click', e => { if (!dd.contains(e.target)) set(false); });
  dd.addEventListener('keydown', e => { if (e.key === 'Escape') { set(false); b.focus(); } });
  dd.addEventListener('focusout', e => { if (!dd.contains(e.relatedTarget)) set(false); });
});
`;

module.exports = { html, css, js, items: ITEMS };
