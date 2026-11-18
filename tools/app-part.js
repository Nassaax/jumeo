// Coque « application » pour mobile (≤ 760 px), commune à toutes les pages :
// barre d'onglets en bas (Accueil · Guides · Devis · Simus · Menu), menu en panneau qui glisse du bas,
// titre de page dans la barre du haut, enregistrement du service worker (site installable).
// Utilisé par build.js : inséré dans les pages générées et dans index.html (marqueurs APP:*).
'use strict';

const I = {
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
  guides: '<path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z"/><path d="M4 21a2 2 0 0 1 2-2h12v2"/><path d="M8 7h6M8 11h6"/>',
  devis: '<path d="M12 5v14M5 12h14"/>',
  simus: '<path d="M4 15a8 8 0 1 1 16 0"/><path d="M12 15l4-5"/><circle cx="12" cy="15" r="1.4"/><path d="M4 19h16"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  tarifs: '<path d="M20 12l-8 8-8-8V4h8z"/><circle cx="8.5" cy="8.5" r="1.5"/>',
  zones: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  pros: '<path d="M4 21V5a1 1 0 0 1 1-1h9v17"/><path d="M14 9h5a1 1 0 0 1 1 1v11"/><path d="M8 8h2M8 12h2M8 16h2M3 21h18"/>',
  partner: '<path d="M8 12l3 3 5-6"/><circle cx="12" cy="12" r="9"/>',
  story: '<circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/>',
  faq: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7"/><path d="M12 17h.01"/>',
  who: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>'
};
const svg = k => `<svg viewBox="0 0 24 24" aria-hidden="true">${I[k]}</svg>`;

const css = `
/* ═════════ APPLICATION MOBILE ═════════ */
.tabbar,.app-title{display:none}
.nav-slash{color:var(--accent);font-weight:700;margin:0 .28em}
@media(max-width:760px){
  html{-webkit-tap-highlight-color:transparent}
  body{padding-bottom:calc(78px + env(safe-area-inset-bottom))!important}
  .header{padding-top:env(safe-area-inset-top)}
  .header .wrap{height:56px;gap:0}
  .header .btn{display:none!important}
  .header .logo svg{width:30px;height:30px}
  .header .logo b{font-size:19px}
  .app-title{display:block;min-width:0;margin-left:12px;padding-left:12px;border-left:1px solid currentColor;border-left-color:color-mix(in srgb,currentColor 30%,transparent);font:600 15px 'Plus Jakarta Sans',sans-serif;letter-spacing:-.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:.85}
  .tabbar{display:grid;grid-template-columns:repeat(5,1fr);align-items:end;position:fixed;left:0;right:0;bottom:0;z-index:70;background:rgba(255,255,255,.94);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border-top:1px solid var(--line);box-shadow:0 -8px 28px rgba(11,36,65,.08);padding:4px 4px calc(6px + env(safe-area-inset-bottom));transition:transform .3s cubic-bezier(.4,0,.2,1)}
  .tab{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:3px;min-height:54px;padding:4px 0 2px;font:600 11px/1.1 'Inter',sans-serif;color:rgba(11,36,65,.58);text-decoration:none;border:0;background:none;cursor:pointer;transition:transform .15s,color .2s}
  .tab svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
  .tab:active{transform:scale(.92)}
  .tab[aria-current="page"]{color:var(--ink)}
  .tab[aria-current="page"] svg{stroke-width:2.3}
  .tab[aria-current="page"]::before{content:"";position:absolute;top:0;width:18px;height:3px;border-radius:0 0 4px 4px;background:var(--accent)}
  .tab-fab{color:var(--ink)}
  .tab-fab .fab{display:grid;place-items:center;width:58px;height:58px;margin-top:-30px;border-radius:50%;background:var(--accent);border:4px solid #fff;box-shadow:0 10px 24px rgba(255,122,69,.45)}
  .tab-fab .fab svg{width:26px;height:26px;stroke:var(--ink);stroke-width:2.6}
  body.typing .tabbar{transform:translateY(120%)}
  /* rythme « application » : moins de vide, contenu plus vite visible */
  .sec{padding-top:56px;padding-bottom:56px}
  .sub-hero .wrap{padding-top:92px;padding-bottom:40px}
  .sub-hero h1{margin-bottom:14px}
  .sub-hero p{font-size:16.5px;margin-bottom:20px}
  .hero .wrap{padding-top:84px;padding-bottom:48px}
  .sec-head{margin-bottom:28px}
}
dialog.sheet{position:fixed;inset:auto 0 0 0;margin:0;width:100%;max-width:100%;max-height:88vh;padding:0;border:0;border-radius:26px 26px 0 0;background:var(--paper,#f7f5f0);color:var(--ink);box-shadow:0 -20px 60px rgba(0,0,0,.25);overflow:auto}
dialog.sheet::backdrop{background:rgba(11,36,65,.5);backdrop-filter:blur(3px)}
dialog.sheet[open]{animation:sheet-up .34s cubic-bezier(.32,.72,0,1)}
@keyframes sheet-up{from{transform:translateY(100%)}}
.sheet-in{padding:10px 18px calc(22px + env(safe-area-inset-bottom))}
.sheet-grab{width:42px;height:5px;border-radius:9px;background:rgba(11,36,65,.18);margin:2px auto 16px}
.sheet-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.sheet-head b{font:700 20px 'Plus Jakarta Sans',sans-serif;letter-spacing:-.03em}
.sheet-close{width:36px;height:36px;border-radius:50%;border:0;background:#fff;box-shadow:0 0 0 1px var(--line);font:500 20px/1 'Inter',sans-serif;color:var(--ink);cursor:pointer}
.sheet-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
.sheet-grid a{display:flex;flex-direction:column;gap:10px;padding:14px;border-radius:18px;background:#fff;box-shadow:0 0 0 1px var(--line);text-decoration:none;color:var(--ink);font:600 14.5px/1.25 'Inter',sans-serif}
.sheet-grid a:active{transform:scale(.97)}
.sheet-grid svg{width:24px;height:24px;fill:none;stroke:var(--ink);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.sheet-grid .wide{grid-column:1/-1;flex-direction:row;align-items:center;background:var(--ink);color:#fff}
.sheet-grid .wide svg{stroke:var(--accent)}
.sheet-small{display:flex;flex-wrap:wrap;gap:6px 16px;font-size:13px}
.sheet-small a{color:rgba(11,36,65,.66);text-decoration:underline;text-underline-offset:3px}
.sheet-legal{margin-top:14px;font-size:12px;color:rgba(11,36,65,.6)}
@media(prefers-reduced-motion:reduce){dialog.sheet[open]{animation:none}.tabbar{transition:none}}
`;

// Barre d'onglets + panneau « Menu ». active : 'home' | 'guides' | 'simus' | ''
function html({ active = '', brand = 'Jumeo', whatsapp = '' } = {}) {
  const tab = (key, href, label) => `<a class="tab" href="${href}"${active === key ? ' aria-current="page"' : ''}>${svg(key)}<span>${label}</span></a>`;
  const wa = String(whatsapp || '').replace(/\D/g, '');
  return `<nav class="tabbar" aria-label="Navigation mobile">
  ${tab('home', '/', 'Accueil')}
  ${tab('guides', '/guides', 'Guides')}
  <a class="tab tab-fab" href="/#devis"><span class="fab">${svg('devis')}</span><span>Devis</span></a>
  ${tab('simus', '/guides#simulateurs', 'Simus')}
  <button class="tab" type="button" id="tabMenu" aria-haspopup="dialog" aria-controls="appSheet">${svg('menu')}<span>Menu</span></button>
</nav>
<dialog class="sheet" id="appSheet" aria-label="Menu">
  <div class="sheet-in">
    <div class="sheet-grab" aria-hidden="true"></div>
    <div class="sheet-head"><b>Menu</b><button type="button" class="sheet-close" data-close aria-label="Fermer le menu">×</button></div>
    <div class="sheet-grid">
      <a class="wide" href="/#devis">${svg('devis')}Demander un devis gratuit</a>
      <a href="/#tarifs">${svg('tarifs')}Tarifs</a>
      <a href="/certificat-peb">${svg('zones')}Nos zones</a>
      <a href="/#transparence">${svg('who')}Qui fait quoi</a>
      <a href="/#pros">${svg('pros')}Professionnels</a>
      <a href="/devenir-partenaire">${svg('partner')}Devenir partenaire</a>
      <a href="/notre-histoire">${svg('story')}Notre histoire</a>
      <a href="/#faq">${svg('faq')}Questions fréquentes</a>
      <a href="/guides#simulateurs">${svg('simus')}Simulateurs</a>
    </div>
    <div class="sheet-small">
      <a href="/#mentions-legales" data-dlg="legal">Mentions légales</a>
      <a href="/#confidentialite" data-dlg="privacy">Confidentialité</a>
      <a id="mWa" class="${wa ? '' : 'hide'}" href="${wa ? 'https://wa.me/' + wa : '#'}" target="_blank" rel="noopener">WhatsApp</a>
    </div>
    <p class="sheet-legal">${brand} est un apporteur d'affaires indépendant : les prestations sont réalisées par nos partenaires.</p>
  </div>
</dialog>`;
}

const js = `
/* ── Application mobile : menu, clavier, installation ── */
(function () {
  const sheet = document.getElementById('appSheet');
  const menuBtn = document.getElementById('tabMenu');
  if (sheet && menuBtn && sheet.showModal) {
    menuBtn.addEventListener('click', () => sheet.showModal());
    sheet.addEventListener('click', e => {
      if (e.target === sheet || e.target.closest('[data-close]')) return sheet.close();
      const a = e.target.closest('a');
      if (!a) return;
      const dlg = a.dataset.dlg && document.getElementById('dlg-' + a.dataset.dlg);
      if (dlg) { e.preventDefault(); sheet.close(); dlg.showModal(); } else sheet.close();
    });
  }
  const isField = el => el && el.matches && el.matches('input:not([type=checkbox]):not([type=radio]):not([type=range]),select,textarea');
  document.addEventListener('focusin', e => { if (isField(e.target)) document.body.classList.add('typing'); });
  document.addEventListener('focusout', () => setTimeout(() => { if (!isField(document.activeElement)) document.body.classList.remove('typing'); }, 60));
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('/sw.js').catch(() => {});
})();
`;

const head = `<link rel="manifest" href="/manifest.webmanifest" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-title" content="Jumeo" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />`;

module.exports = { css, html, js, head };
