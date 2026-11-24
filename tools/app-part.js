// Coque « application » pour mobile (≤ 760 px), commune à toutes les pages :
// barre d'onglets en bas (Accueil · Guides · Devis · Simulateur · Menu), menu en panneau qui glisse du bas,
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
  lux: '<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  faq: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7"/><path d="M12 17h.01"/>',
  who: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>'
};
const svg = k => `<svg viewBox="0 0 24 24" aria-hidden="true">${I[k]}</svg>`;

const css = `
/* ═════════ BANDEAU LANCEMENT ═════════ */
.launch{height:34px;overflow:hidden;background:var(--accent);color:var(--ink);transition:height .3s cubic-bezier(.4,0,.2,1)}
.launch a{display:flex;align-items:center;justify-content:center;gap:10px;height:34px;padding:0 16px;font:500 13px 'Inter',sans-serif;color:inherit;text-decoration:none;white-space:nowrap}
.launch b{font-weight:700}
.launch .l-long{display:inline}.launch .l-short{display:none}
.launch i{font-style:normal;transition:transform .2s}
.launch a:hover i{transform:translateX(3px)}
.header.scrolled .launch{height:0}
body:has(.launch) .hero .wrap{padding-top:160px}
body:has(.launch) .sub-hero .wrap{padding-top:152px}
@media(max-width:980px){body:has(.launch) .hero .wrap{padding-top:140px}}
@media(max-width:600px){.launch .l-long{display:none}.launch .l-short{display:inline}}
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
  .tab-fab .fab{display:grid;place-items:center;width:58px;height:58px;margin-top:-30px;border-radius:50%;background:var(--accent);border:4px solid #fff;box-shadow:0 10px 24px rgba(242,183,5,.45)}
  .tab-fab .fab svg{width:26px;height:26px;stroke:var(--ink);stroke-width:2.6}
  body.typing .tabbar{transform:translateY(120%)}
  /* rythme « application » : moins de vide, contenu plus vite visible */
  .sec{padding-top:56px;padding-bottom:56px}
  .sub-hero .wrap{padding-top:92px;padding-bottom:40px}
  .sub-hero h1{margin-bottom:14px}
  .sub-hero p{font-size:16.5px;margin-bottom:20px}
  .hero .wrap{padding-top:84px;padding-bottom:48px}
  body:has(.launch) .hero .wrap{padding-top:118px}
  body:has(.launch) .sub-hero .wrap{padding-top:126px}
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
.sheet-grid .wide-lux{background:#fff;color:var(--ink);font-weight:500}
.sheet-grid .wide-lux svg{stroke:var(--ink)}
.sheet-small{display:flex;flex-wrap:wrap;gap:6px 16px;font-size:13px}
.sheet-small a{color:rgba(11,36,65,.66);text-decoration:underline;text-underline-offset:3px}
.sheet-legal{margin-top:14px;font-size:12px;color:rgba(11,36,65,.6)}
@media(prefers-reduced-motion:reduce){dialog.sheet[open]{animation:none}.tabbar{transition:none}}
`;

// Barre d'onglets + panneau « Menu ». active : 'home' | 'guides' | 'simus' | ''
function html({ active = '', brand = 'Wall’PEB', whatsapp = '' } = {}) {
  const tab = (key, href, label) => `<a class="tab" href="${href}"${active === key ? ' aria-current="page"' : ''}>${svg(key)}<span>${label}</span></a>`;
  const wa = String(whatsapp || '').replace(/\D/g, '');
  return `<nav class="tabbar" aria-label="Navigation mobile">
  ${tab('home', '/', 'Accueil')}
  ${tab('guides', '/guides', 'Guides')}
  <a class="tab tab-fab" href="/#devis"><span class="fab">${svg('devis')}</span><span>Devis</span></a>
  ${tab('simus', '/simulateur-peb', 'Simulateur')}
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
      <a href="/#services">${svg('partner')}PEB + contrôle électrique</a>
      <a href="/#biens">${svg('home')}Type de bien</a>
      <a href="/#pros">${svg('pros')}Professionnels</a>
      <a href="/simulateur-peb">${svg('simus')}Simulateur PEB</a>
      <a href="/#faq">${svg('faq')}Questions fréquentes</a>
      <a class="wide wide-lux" href="https://www.luxenergiesolution.com" target="_blank" rel="noopener">${svg('lux')}Électricité, chauffage, photovoltaïque : Lux Energie Solution</a>
    </div>
    <div class="sheet-small">
      <a href="/#mentions-legales" data-dlg="legal">Mentions légales</a>
      <a href="/#confidentialite" data-dlg="privacy">Confidentialité</a>
      <a id="mWa" class="${wa ? '' : 'hide'}" href="${wa ? 'https://wa.me/' + wa : '#'}" target="_blank" rel="noopener">WhatsApp</a>
    </div>
    <p class="sheet-legal">${brand} est un service de Lux Energie Solution.</p>
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
<meta name="apple-mobile-web-app-title" content="Wall’PEB" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />`;

// Bandeau fin en haut de page (dans l'en-tête fixe). Vide → pas de bandeau.
function launch(text) {
  if (!text) return '';
  return `<div class="launch" role="note"><a href="/guides"><span class="l-long"><b>Lancement officiel en ${text}</b> · Simulateurs et guides déjà en accès libre</span><span class="l-short"><b>Lancement en ${text}</b> · Découvrir les simulateurs</span><i aria-hidden="true">→</i></a></div>`;
}


// ── Écran d'ouverture « les anneaux s'unissent » (1 fois par visite) ──
// Le script du <head> ajoute html.intro AVANT l'affichage (pas de flash), sauf si :
// déjà vu pendant cette visite, ou animations réduites demandées par l'appareil.
const introHead = `<script>try{if(!sessionStorage.getItem('wallpeb-intro')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('intro');sessionStorage.setItem('wallpeb-intro','1')}}catch(e){}</script>`;

const splashCss = `
/* ═════════ ÉCRAN D'OUVERTURE ═════════ */
.intro-splash{display:none}
html.intro .intro-splash{display:grid;place-items:center;position:fixed;inset:0;z-index:300;background:radial-gradient(120% 90% at 50% 40%,#16406c 0%,#0b2441 62%);cursor:pointer;animation:sp-out .6s cubic-bezier(.7,0,.3,1) 2.35s forwards}
html.intro .intro-splash.skip{animation:sp-out .3s ease forwards}
.sp-in{display:grid;justify-items:center;gap:22px;padding:24px}
.sp-logo{width:min(80vw,460px);height:auto;overflow:visible;animation:sp-center .7s cubic-bezier(.65,0,.35,1) 1.2s both}
.sp-roof{stroke-dasharray:70;animation:sp-draw .8s cubic-bezier(.65,0,.35,1) .15s both}
.sp-bar{transform-box:fill-box;animation:sp-bar .55s cubic-bezier(.16,1,.3,1) both}
.sp-b3{animation-delay:.45s}.sp-b2{animation-delay:.6s}.sp-b1{animation-delay:.78s}
.sp-mark{transform-box:fill-box;transform-origin:center;animation:sp-pulse .55s cubic-bezier(.34,1.56,.64,1) 1.08s both}
.sp-word{animation:sp-word .75s cubic-bezier(.16,1,.3,1) 1.3s both}
.sp-tag{font:500 15px/1.4 'Inter',system-ui,sans-serif;color:rgba(255,255,255,.72);letter-spacing:.01em;text-align:center;animation:sp-tag .7s cubic-bezier(.16,1,.3,1) 1.55s both}
.sp-tag b{color:#f2b705;font-weight:600}
@keyframes sp-bar{from{transform:translateX(-60%);opacity:0}to{transform:none;opacity:1}}
@keyframes sp-draw{from{stroke-dashoffset:70}to{stroke-dashoffset:0}}
@keyframes sp-fade{from{opacity:0}to{opacity:1}}
@keyframes sp-pulse{0%{transform:none}45%{transform:scale(1.14)}100%{transform:none}}
@keyframes sp-center{from{transform:translateX(38%)}to{transform:none}}
@keyframes sp-word{from{opacity:0;transform:translateX(-14px)}to{opacity:1;transform:none}}
@keyframes sp-tag{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes sp-out{to{opacity:0;visibility:hidden}}
/* le contenu de la page entre en scène juste après l'ouverture */
html.intro .appear{animation-delay:calc(var(--d,.08s) + 2.3s)}
html.intro .hl>span{animation-delay:2.55s}
html.intro .hl+.hl>span{animation-delay:2.7s}
html.intro .swap .hl>span{animation-delay:0s}
html.intro .swap .hl+.hl>span{animation-delay:.08s}
html.intro .ghost-rings circle,html.intro .ghost-rings path{animation-delay:2.45s}
html.intro .ghost-rings circle+circle{animation-delay:2.7s}
html.intro .rise{animation-delay:2.3s}
html.intro .rise.d1{animation-delay:2.4s}
html.intro .rise.d2{animation-delay:2.5s}
html.intro .rise.d3{animation-delay:2.6s}
@media(prefers-reduced-motion:reduce){html.intro .intro-splash{display:none}}
`;

// word : tracés du mot « Wall’PEB » (brand/wallpeb-word.json, généré par tools/make-logo-wallpeb.js, même repère que le symbole)
function splash(word) {
  return `<div class="intro-splash" id="introSplash" aria-hidden="true">
  <div class="sp-in">
    <svg class="sp-logo" viewBox="${word.viewBox}">
      <g class="sp-mark">
        <path class="sp-roof" d="M7 29 32 8l25 21" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        <path class="sp-bar sp-b1" d="M15 27h16l4.5 4-4.5 4H15z" fill="#f2b705"/>
        <path class="sp-bar sp-b2" d="M15 38h24l4.5 4-4.5 4H15z" fill="#fff"/>
        <path class="sp-bar sp-b3" d="M15 49h32l4.5 4-4.5 4H15z" fill="#fff"/>
      </g>
      <g class="sp-word"><path d="${word.ink}" fill="#fff"/><path d="${word.accent}" fill="#f2b705"/></g>
    </svg>
    <p class="sp-tag">Certificat PEB et contrôle électrique, <b>en un seul rendez-vous.</b></p>
  </div>
</div>`;
}

const splashJs = `
/* ── Écran d'ouverture : retrait à la fin, clic pour passer, sécurité ── */
(function () {
  const sp = document.getElementById('introSplash');
  if (!sp || !document.documentElement.classList.contains('intro')) { if (sp) sp.remove(); return; }
  const done = () => { if (sp.isConnected) sp.remove(); };
  sp.addEventListener('animationend', e => { if (e.target === sp) done(); });
  sp.addEventListener('click', () => sp.classList.add('skip'));
  setTimeout(done, 4000);
})();
`;

module.exports = { css: css + splashCss, html, js: js + splashJs, head: head + '\n' + introHead, launch, splash };
