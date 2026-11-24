// build.js (site Wall'PEB) : génère les pages locales « Certificat PEB à [commune] », « Nos zones »,
// le simulateur PEB, les guides, la liste des zones en bas de l'accueil et le sitemap. Aucune dépendance : node build.js
//
// Source unique des réglages : le bloc CONFIG de index.html (coordonnées, prix, agréments, groupe Lux).
// Après une modification de CONFIG ou de data/communes.json, relancer : node build.js
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SITE = 'https://wallpeb.vercel.app';        // à remplacer par le vrai domaine (ex. https://wallpeb.be) au lancement
const TODAY = new Date().toISOString().slice(0, 10);

/* ── Lecture des données ───────────────────────────────── */
const indexPath = path.join(ROOT, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');
const cfgMatch = indexHtml.match(/const CONFIG = (\{[\s\S]*?\n\});/);
if (!cfgMatch) throw new Error('Bloc CONFIG introuvable dans index.html');
const CONFIG = Function('"use strict"; return (' + cfgMatch[1] + ');')();
const { communes } = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'communes.json'), 'utf8'));
const bySlug = Object.fromEntries(communes.map(c => [c.slug, c]));

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const jsonLd = o => '<script type="application/ld+json">' + JSON.stringify(o).replace(/</g, '\\u003c') + '</script>';
const P = CONFIG.prices, VAT = CONFIG.vat || '';
const listFr = a => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' et ' + a[a.length - 1];

/* ── Gabarit commun ────────────────────────────────────── */
// Symbole Wall'PEB (maison + barres de l'étiquette PEB). `a` = toit et barres basses.
const SYM = a => `<path${a === 'currentColor' ? ' class="sym-s"' : ` stroke="${a}"`} d="M7 29 32 8l25 21" fill="none" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 27h16l4.5 4-4.5 4H15z" fill="#f2b705"/><path${a === 'currentColor' ? ' class="sym-f"' : ` fill="${a}"`} d="M15 38h24l4.5 4-4.5 4H15z"/><path${a === 'currentColor' ? ' class="sym-f"' : ` fill="${a}"`} d="M15 49h32l4.5 4-4.5 4H15z"/>`;
const ARROW = '<span class="chip-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>';
const btn = (href, label, extra = '') =>
  `<a class="btn btn-primary" href="${href}"${extra}><span class="roll"><span><span>${label}</span><span aria-hidden="true">${label}</span></span></span>${ARROW}</a>`;

const CSS = `
html,body{background:#0b2441}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--ink:#0b2441;--paper:#f7f5f0;--paper-2:#efebe3;--card:#fff;--muted:rgba(11,36,65,.66);--line:rgba(11,36,65,.12);--accent:#f2b705;--accent-d:#d99e00;--w78:rgba(255,255,255,.78);--w60:rgba(255,255,255,.62);--wline:rgba(255,255,255,.14);--e-out:cubic-bezier(.16,1,.3,1);--e-std:cubic-bezier(.4,0,.2,1);--pad:20px}
@media(min-width:760px){:root{--pad:32px}}@media(min-width:1200px){:root{--pad:48px}}
html{scroll-behavior:smooth;scroll-padding-top:88px;overflow-x:clip}
body{font:400 16px/1.6 'Inter',system-ui,sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased;padding-bottom:72px}
main{background:var(--paper)}
::selection{background:rgba(242,183,5,.3)}
h1,h2,h3{font-family:'Plus Jakarta Sans','Inter',sans-serif;font-weight:600;line-height:1.1;letter-spacing:-.03em}
a{color:inherit}svg{display:block}
.wrap{max-width:1200px;margin:0 auto;padding:0 var(--pad)}
.narrow{max-width:860px}
:focus-visible{outline:3px solid var(--accent);outline-offset:3px;border-radius:8px}
.hide{display:none!important}
.sec{padding:80px 0}@media(min-width:900px){.sec{padding:104px 0}}
.eyebrow{display:inline-flex;align-items:center;gap:10px;font:600 12px/1 'Inter',sans-serif;letter-spacing:.18em;text-transform:uppercase;margin-bottom:16px}
.eyebrow::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--accent)}
h2{font-size:clamp(28px,3.6vw,44px);letter-spacing:-.04em;margin-bottom:16px}
.lede{color:var(--muted);font-size:17px;max-width:40rem}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:12px;min-height:46px;padding:8px 22px;border-radius:999px;font:600 15px/20px 'Inter',sans-serif;text-decoration:none;border:1px solid transparent;cursor:pointer;transition:background-color .25s var(--e-std),border-color .25s var(--e-std),transform .2s}
.btn:active{transform:scale(.97)}
.btn-primary{background:var(--accent);color:var(--ink);padding:8px 8px 8px 22px}.btn-primary:hover{background:var(--accent-d)}
.btn-ghost{color:var(--ink);border-color:var(--line)}.btn-ghost:hover{border-color:var(--ink)}
.btn-light{color:#fff;border-color:rgba(255,255,255,.3)}.btn-light:hover{border-color:#fff}
.roll{display:block;height:20px;overflow:hidden}.roll>span{display:flex;flex-direction:column;transition:transform .5s var(--e-std)}.roll>span>span{display:block;height:20px;white-space:nowrap}
.chip-arrow{width:30px;height:30px;border-radius:50%;background:#fff;color:var(--ink);display:grid;place-items:center;flex:none}
.chip-arrow svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;transition:transform .5s var(--e-std)}
.btn-primary:hover .roll>span{transform:translateY(-50%)}.btn-primary:hover .chip-arrow svg{transform:rotate(-45deg)}
.header{position:fixed;inset:0 0 auto;z-index:50;color:#fff;transition:background-color .35s,color .35s,box-shadow .35s}
.header.scrolled{background:rgba(247,245,240,.9);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);color:var(--ink);box-shadow:0 1px 0 var(--line)}
.header .wrap{display:flex;align-items:center;gap:28px;height:72px}
.logo{display:flex;align-items:center;gap:10px;text-decoration:none;color:inherit}.logo svg{width:36px;height:36px}
.logo b{font:700 21px 'Plus Jakarta Sans',sans-serif;letter-spacing:-.035em}.logo .sym-s{stroke:currentColor}.logo .sym-f{fill:currentColor}
.nav{display:flex;gap:24px;margin-left:auto}.nav a{text-decoration:none;font-size:14px;font-weight:500;opacity:.82}.nav a:hover,.nav a[aria-current]{opacity:1}
.header .btn{min-height:40px;font-size:14px;padding:6px 6px 6px 18px}.header .chip-arrow{width:28px;height:28px}
@media(max-width:1080px){.nav{display:none}.header .btn{margin-left:auto}}
.sub-hero{position:relative;overflow:hidden;color:#fff;background:linear-gradient(180deg,#0b2441,#0f2f55)}
.sub-hero .wrap{position:relative;padding-top:128px;padding-bottom:80px}
.sub-hero .ghost{position:absolute;right:-12vw;top:50%;width:min(70vw,880px);transform:translateY(-50%);opacity:.09;pointer-events:none}
.sub-hero .ghost path{fill:none;stroke:#fff;stroke-width:1.5;stroke-linejoin:round}
.crumbs{display:flex;flex-wrap:wrap;gap:8px;font-size:13px;color:var(--w60);margin-bottom:22px;list-style:none}
.crumbs a{text-decoration:none}.crumbs a:hover{color:#fff}.crumbs li+li::before{content:"/";margin-right:8px;opacity:.6}
.sub-hero h1{font-size:clamp(34px,5vw,64px);line-height:1;letter-spacing:-.045em;margin-bottom:20px;max-width:16ch}
.sub-hero h1 span{color:var(--accent)}
.sub-hero p{font-size:18px;color:var(--w78);max-width:38rem;margin-bottom:28px}
.actions{display:flex;flex-wrap:wrap;gap:12px}
.facts{display:flex;flex-wrap:wrap;gap:10px 22px;margin-top:30px;font-size:14px;color:rgba(255,255,255,.84);list-style:none}
.facts li{display:flex;gap:8px;align-items:center}.facts li::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--accent)}
.rise{animation:rise .9s var(--e-out) both}.rise.d1{animation-delay:.1s}.rise.d2{animation-delay:.2s}.rise.d3{animation-delay:.3s}
@keyframes rise{from{opacity:0;transform:translateY(16px)}}
.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:36px}@media(max-width:900px){.cards{grid-template-columns:1fr}}
.card{background:var(--card);border-radius:28px;padding:28px;box-shadow:0 0 0 1px var(--line),0 4px 16px rgba(11,36,65,.05)}
.card.dark{background:var(--ink);color:#fff;box-shadow:0 24px 60px rgba(11,36,65,.25)}
.card h3{font-size:18px;margin-bottom:12px}
.amt{font:600 48px/1 'Plus Jakarta Sans',sans-serif;letter-spacing:-.045em;margin-bottom:10px}
.amt small{font:500 14px 'Inter',sans-serif;letter-spacing:0;color:var(--muted)}.card.dark .amt small{color:var(--w60)}
.card p{color:var(--muted);font-size:15px}.card.dark p{color:var(--w78)}
.fine{margin-top:20px;font-size:13.5px;color:var(--muted)}
.split{display:grid;grid-template-columns:1.2fr .8fr;gap:48px;align-items:start}@media(max-width:860px){.split{grid-template-columns:1fr;gap:28px}}
.prose p{font-size:17px;color:var(--muted);margin-bottom:16px;max-width:42rem}
.tip{background:var(--card);border-radius:28px;padding:28px;box-shadow:0 0 0 1px var(--line);border-left:4px solid var(--accent)}
.tip b{display:block;font:600 13px 'Inter',sans-serif;letter-spacing:.14em;text-transform:uppercase;margin-bottom:10px}
.tip p{font-size:16px;color:var(--ink)}
.chips{display:flex;flex-wrap:wrap;gap:8px;list-style:none;margin-top:18px}
.chips li{font-size:14px;padding:7px 14px;border-radius:999px;background:var(--card);box-shadow:0 0 0 1px var(--line)}
.chips a{text-decoration:none}.chips a:hover{text-decoration:underline}
.text-link{display:inline-flex;gap:6px;align-items:center;font-size:15px;font-weight:600;text-decoration:none;margin-top:22px}
.text-link span{color:var(--accent-d);transition:transform .2s}.text-link:hover span{transform:translateX(3px)}
.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;list-style:none;counter-reset:s;margin-top:32px}
@media(max-width:900px){.steps{grid-template-columns:1fr 1fr}}@media(max-width:520px){.steps{grid-template-columns:1fr}}
.steps li{counter-increment:s;border-top:1px solid var(--line);padding-top:18px;font-size:15px;color:var(--muted)}
.steps li::before{content:"0" counter(s);display:block;font:600 15px 'Plus Jakarta Sans',sans-serif;color:var(--ink);margin-bottom:10px}
.steps b{display:block;color:var(--ink);font:600 17px 'Plus Jakarta Sans',sans-serif;margin-bottom:4px}
.faq{border-top:1px solid var(--line);margin-top:28px;max-width:860px}
details{border-bottom:1px solid var(--line)}
summary{cursor:pointer;list-style:none;padding:20px 0;font:600 17px/1.4 'Plus Jakarta Sans',sans-serif;display:flex;justify-content:space-between;gap:18px;align-items:center}
summary::-webkit-details-marker{display:none}
summary::after{content:"+";flex:none;width:32px;height:32px;border-radius:50%;display:grid;place-items:center;font:500 20px/1 'Inter',sans-serif;box-shadow:0 0 0 1px var(--line);transition:transform .3s,background-color .3s}
details[open] summary::after{transform:rotate(45deg);background:var(--accent);box-shadow:none}
details p{padding:0 48px 20px 0;color:var(--muted)}
.band{background:var(--ink);color:#fff;border-radius:40px;padding:44px;display:flex;gap:28px;align-items:center;justify-content:space-between;flex-wrap:wrap}
@media(max-width:600px){.band{padding:30px 24px;border-radius:28px}}
.band h2{color:#fff;font-size:clamp(24px,3vw,34px);margin-bottom:8px}.band p{color:var(--w78);max-width:36rem}
.band.light{background:var(--paper-2);color:var(--ink)}.band.light h2{color:var(--ink)}.band.light p{color:var(--muted)}
.why{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:32px}@media(max-width:900px){.why{grid-template-columns:1fr}}
.why .card b{display:grid;place-items:center;width:40px;height:40px;border-radius:50%;background:var(--paper);font:600 15px 'Plus Jakarta Sans',sans-serif;margin-bottom:16px}
.req{list-style:none;display:grid;gap:10px;margin-top:18px}
.req li{display:flex;gap:10px;font-size:15.5px}
.req li::before{content:"";flex:0 0 18px;height:18px;margin-top:3px;border-radius:50%;background:rgba(242,183,5,.22) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230b2441' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12l5 5L19 7'/%3E%3C/svg%3E") center/11px no-repeat}
.form-card{background:#fff;border-radius:28px;padding:30px;box-shadow:0 0 0 1px var(--line),0 24px 60px rgba(11,36,65,.1)}
@media(max-width:480px){.form-card{padding:22px 18px}}
.form-card h2{font-size:26px;margin-bottom:6px}.form-card .sub{color:var(--muted);font-size:14px;margin-bottom:18px}
.field{margin-bottom:12px}.field label{display:block;font-size:12.5px;font-weight:600;color:var(--muted);margin-bottom:6px}
.field input,.field select,.field textarea{width:100%;padding:12px 14px;border:1px solid var(--line);border-radius:14px;font:15px 'Inter',sans-serif;background:#fafaf8;color:var(--ink)}
.field input:focus,.field select:focus,.field textarea:focus{outline:none;border-color:var(--ink);background:#fff;box-shadow:0 0 0 3px rgba(242,183,5,.35)}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media(max-width:520px){.row2{grid-template-columns:1fr}}
.consent{display:flex;gap:10px;font-size:12.5px;color:var(--muted);margin:4px 0 16px;align-items:flex-start}
.consent input{margin-top:3px;width:16px;height:16px;flex:none;accent-color:var(--ink)}
.form-card .btn{width:100%;justify-content:space-between}
.form-note{font-size:12px;color:var(--muted);text-align:center;margin-top:10px}
.preview-msg{display:none;margin-top:12px;background:#fff7ed;border:1px solid #fed7aa;color:#9a3412;border-radius:14px;padding:12px;font-size:13px}
.preview-msg textarea{width:100%;margin-top:8px;font:13px 'Inter',sans-serif;border:1px solid #fed7aa;border-radius:10px;padding:8px;min-height:120px}
footer{background:var(--ink);color:var(--w78);padding:64px 0 36px;font-size:14px}
.foot{display:grid;grid-template-columns:1.3fr 1fr 1fr 1.2fr;gap:32px;margin-bottom:36px}@media(max-width:900px){.foot{grid-template-columns:1fr 1fr}}@media(max-width:560px){.foot{grid-template-columns:1fr}}
footer h4{color:#fff;font:600 13px 'Inter',sans-serif;letter-spacing:.14em;text-transform:uppercase;margin-bottom:14px}
footer a{text-decoration:none;display:block;margin-bottom:8px}footer a:hover{color:#fff}
footer .logo{color:#fff;margin-bottom:14px}
.zones{columns:2;column-gap:18px}
.legal{border-top:1px solid var(--wline);padding-top:22px;font-size:12.5px;line-height:1.7;color:var(--w60)}
@media(min-width:761px){body{padding-bottom:0}}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
`;

const APP = require('./tools/app-part.js');
// Tracés du mot « Wall’PEB » pour l'écran d'ouverture (générés par tools/make-logo-wallpeb.js).
const WORD = JSON.parse(fs.readFileSync(path.join(ROOT, 'brand', 'wallpeb-word.json'), 'utf8'));
const PARTNERS = require('./tools/partners-part.js');
const CREDIT = require('./tools/credit-part.js');
const MAP = require('./tools/map-part.js');
const NAV = require('./tools/nav-part.js');
const PROV_ID = { 'Liège': 'liege', 'Namur': 'namur', 'Hainaut': 'hainaut', 'Luxembourg': 'luxembourg', 'Brabant wallon': 'brabant-wallon' };
const mapHtml = () => MAP.html({ communes, esc, ROOT });

const FOOT_CONTACT = [CONFIG.phone ? `<a href="tel:${CONFIG.phone.replace(/[^\d+]/g, '')}">${esc(CONFIG.phone)}</a>` : '', CONFIG.email ? `<a href="mailto:${esc(CONFIG.email)}">${esc(CONFIG.email)}</a>` : ''].join('');
const NEEDS = [['/certificat-peb-vente', 'Vendre un bien'], ['/certificat-peb-location', 'Louer un bien'], ['/pack-peb-controle-electrique', 'PEB + contrôle électrique'], ['/controle-electrique', 'Contrôle électrique'], ['/certificat-peb-immeuble', 'Immeubles et copropriétés']];
const zonesLinks = () => communes.map(c => `<a href="/certificat-peb/${c.slug}">PEB à ${esc(c.name)}</a>`).join('');

// Onglet actif et titre de la barre du haut (mobile), déduits de l'adresse de la page.
function appInfo(canonical, title) {
  const tab = canonical.startsWith('/guides') ? 'guides' : canonical.startsWith('/simulateur') ? 'simus' : '';
  const T = { '/certificat-peb': 'Nos zones', '/simulateur-peb': 'Simulateur PEB', '/guides': 'Guides', ...Object.fromEntries(NEEDS) };
  let appTitle = T[canonical];
  if (!appTitle && canonical.startsWith('/certificat-peb/')) appTitle = title.split(' :')[0].replace(/^Certificat /, '');
  if (!appTitle && canonical.startsWith('/guides/')) appTitle = 'Guide';
  return { tab, appTitle: appTitle || '' };
}

function page({ title, description, canonical, body, ld = [], current = '', script = '', css = '' }) {
  const app = appInfo(canonical, title);
  const link = ([h, l]) => `<a href="${h}"${h === current ? ' aria-current="page"' : ''}>${l}</a>`;
  const nav = [['/#tarifs', 'Tarifs'], ['/#services', 'PEB + contrôle']].map(link).join('\n      ') + '\n      ' + NAV.html + '\n      ' +
    [['/certificat-peb', 'Nos zones'], ['/#pros', 'Professionnels']].map(link).join('\n      ');
  return `<!DOCTYPE html>
<html lang="fr-BE">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<meta name="theme-color" content="#0b2441" />
<link rel="canonical" href="${SITE}${canonical}" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:type" content="website" />
<meta property="og:locale" content="fr_BE" />
<meta property="og:site_name" content="Wall’PEB" />
<meta property="og:url" content="${SITE}${canonical}" />
<meta property="og:image" content="${SITE}/og-image.jpg" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
${APP.head}
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700&display=swap" rel="stylesheet" />
${ld.map(jsonLd).join('\n')}
<style>${CSS}${css}${APP.css}${NAV.css}${PARTNERS.css}${CREDIT.css}</style>
</head>
<body>
${APP.splash(WORD)}
<!-- Page générée par build.js : ne pas modifier à la main -->
<header class="header">
  ${APP.launch(CONFIG.launch)}
  <div class="wrap">
    <a class="logo" href="/" aria-label="${esc(CONFIG.brand)}, accueil"><svg viewBox="0 0 64 64" aria-hidden="true">${SYM('currentColor')}</svg><b>${esc(CONFIG.brand)}</b></a>
    ${app.appTitle ? `<span class="app-title">${esc(app.appTitle)}</span>` : ''}
    <nav class="nav" aria-label="Navigation principale">
      ${nav}
    </nav>
    ${btn('/#devis', 'Devis gratuit')}
  </div>
</header>
<main>
${body}
</main>
${PARTNERS.html(CONFIG.group, esc)}
<footer>
  <div class="wrap">
    <div class="foot">
      <div>
        <div class="logo"><svg viewBox="0 0 64 64" aria-hidden="true">${SYM('#fff')}</svg><b>${esc(CONFIG.brand)}</b></div>
        <p>Certificat PEB et contrôle électrique en Wallonie. Un service de ${esc(CONFIG.group.name)}.</p>
      </div>
      <div><h4>Votre situation</h4>${NEEDS.map(([h, l]) => `<a href="${h}">${l}</a>`).join('')}<a href="/#tarifs">Tarifs</a><a href="/simulateur-peb">Simulateur PEB</a><a href="/guides">Guides</a><a href="/#faq">FAQ</a></div>
      <div><h4>Contact</h4>${FOOT_CONTACT}<a href="/#devis">Demander un devis</a><a href="${esc(CONFIG.group.url)}" target="_blank" rel="noopener">${esc(CONFIG.group.name)} ↗</a><a href="/#mentions-legales">Mentions légales</a><a href="/#confidentialite">Confidentialité</a></div>
      <div><h4>Nos zones</h4><div class="zones">${zonesLinks()}</div></div>
    </div>
    <div class="legal">${esc(CONFIG.brand)} est un service de ${esc(CONFIG.group.name)}. Les certificats PEB sont établis par un certificateur agréé par la Région wallonne. Prix indicatifs ${esc(VAT)}, devis confirmé avant intervention.</div>
    ${CREDIT.html}
  </div>
</footer>
${APP.html({ active: app.tab, brand: esc(CONFIG.brand), whatsapp: CONFIG.whatsapp })}
<script>
'use strict';
const header = document.querySelector('.header');
const onScroll = () => header.classList.toggle('scrolled', scrollY > 40);
addEventListener('scroll', onScroll, { passive: true }); onScroll();
${APP.js}
${NAV.js}
${script}
</script>
</body>
</html>
`;
}

const GHOST = '<svg class="ghost" viewBox="0 0 400 240" aria-hidden="true"><path d="M70 118 200 12l130 106"/><path d="M118 104h96l18 16-18 16h-96z"/><path d="M118 150h132l18 16-18 16H118z"/><path d="M118 196h168l18 16-18 16H118z"/></svg>';
const provider = { '@type': 'LocalBusiness', name: CONFIG.brand, url: SITE + '/', description: `Certificat PEB et contrôle électrique en Wallonie. Un service de ${CONFIG.group.name}.`, areaServed: { '@type': 'AdministrativeArea', name: 'Wallonie' }, parentOrganization: { '@type': 'Organization', name: CONFIG.group.name, url: CONFIG.group.url } };
if (CONFIG.phone) provider.telephone = CONFIG.phone;
if (CONFIG.email) provider.email = CONFIG.email;

/* ── Pages communes ────────────────────────────────────── */
const out = [];
fs.mkdirSync(path.join(ROOT, 'certificat-peb'), { recursive: true });

for (const c of communes) {
  const q = encodeURIComponent(c.name);
  const proches = c.proches.filter(s => bySlug[s]).map(s => bySlug[s]);
  const sectionsTxt = c.sections.length > 1 ? listFr(c.sections) : c.sections[0];
  const title = `Certificat PEB à ${c.name} : devis gratuit, prix clair | ${CONFIG.brand}`;
  const description = `Certificat PEB à ${c.name} (${c.cp}) : ${P.peb} € ${VAT} indicatif, certificateur agréé par la Région wallonne, contrôle électrique possible au même rendez-vous. ${c.sections.length > 1 ? 'Toutes les sections : ' + c.sections.slice(0, 4).join(', ') + '…' : 'Devis gratuit.'}`;
  const faqs = [
    [`Combien coûte un certificat PEB à ${c.name} ?`, `Comptez ${P.peb} € ${VAT} (prix indicatif) pour un certificat PEB, ou ${P.pebelec} € ${VAT} avec le contrôle électrique. Le prix final dépend du bien et vous est confirmé avant l'intervention.`],
    [`Intervenez-vous dans toutes les sections de ${c.name} ?`, c.sections.length > 1 ? `Oui : ${sectionsTxt}. Indiquez simplement votre adresse dans la demande.` : `Oui, dans toute la commune. Indiquez simplement votre adresse dans la demande.`],
    [`Qui réalise le certificat ?`, `Le certificateur agréé par la Région wallonne de ${CONFIG.group.name}, qui exploite ${CONFIG.brand}. Le contrôle électrique peut être fait lors du même rendez-vous. Un seul interlocuteur, du devis au certificat.`]
  ];
  const body = `
<section class="sub-hero">
  ${GHOST}
  <div class="wrap">
    <ol class="crumbs rise"><li><a href="/">Accueil</a></li><li><a href="/certificat-peb">Nos zones</a></li><li aria-current="page">${esc(c.name)}</li></ol>
    <h1 class="rise d1">Certificat PEB à ${esc(c.name)}, <span>sans prise de tête.</span></h1>
    <p class="rise d2">${esc(c.intro)} Un prix clair, un certificateur agréé, un seul rendez-vous.</p>
    <div class="actions rise d3">${btn('/?commune=' + q + '#devis', 'Devis gratuit')}<a class="btn btn-light" href="#peb-${c.slug}">Le PEB à ${esc(c.name)}</a></div>
    <ul class="facts rise d3"><li>${esc(c.cp)} ${esc(c.name)}</li><li>Province de ${esc(c.province)}</li><li>Certificateur agréé Région wallonne</li></ul>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <span class="eyebrow">Tarifs à ${esc(c.name)}</span>
    <h2>Des prix clairs, dès le départ.</h2>
    <p class="lede">Des tarifs indicatifs connus d'avance : le devis final vous est confirmé avant toute intervention.</p>
    <div class="cards">
      <div class="card"><h3>Certificat PEB</h3><div class="amt">${P.peb} €<small> ${esc(VAT)} · forfait</small></div><p>Visite, relevé du bien et remise du certificat, avec des explications simples.</p></div>
      <div class="card dark"><h3>PEB + contrôle électrique</h3><div class="amt">${P.pebelec} €<small> ${esc(VAT)} · forfait</small></div><p>Un seul rendez-vous pour le certificat et le contrôle de l'installation électrique.</p></div>
      <div class="card"><h3>Contrôle électrique</h3><div class="amt" style="font-size:40px">Sur devis</div><p>Contrôle de conformité de l'installation électrique, notamment avant une vente.</p></div>
    </div>
    <p class="fine">Tarifs indicatifs, TVA comprise. Le prix final dépend du bien, de son accessibilité et de l'installation.</p>
  </div>
</section>

<section class="sec" id="peb-${c.slug}" style="padding-top:0">
  <div class="wrap split">
    <div class="prose">
      <span class="eyebrow">Le PEB à ${esc(c.name)}</span>
      <h2>Ce qu'il faut savoir sur votre bien.</h2>
      <p>${esc(c.bati)}</p>
      <p>Le certificat est obligatoire pour vendre ou louer : il doit exister avant la publication de l'annonce, et il reste valable 10 ans.</p>
      ${c.sections.length > 1 ? `<h3 style="font-size:17px;margin-top:26px">Sections couvertes</h3><ul class="chips">${c.sections.map(s => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}
      <a class="text-link" href="/simulateur-peb">Estimer le label de mon bien en 1 minute <span>→</span></a>
    </div>
    <aside class="tip"><b>Conseil ${esc(c.name)}</b><p>${esc(c.conseil)}</p></aside>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap">
    <span class="eyebrow">Comment ça marche</span>
    <h2>Quatre étapes, un seul interlocuteur.</h2>
    <ol class="steps">
      <li><b>Vous demandez un devis</b>Une minute, en indiquant votre adresse à ${esc(c.name)}.</li>
      <li><b>On fixe le rendez-vous</b>Date et documents utiles confirmés avec vous.</li>
      <li><b>Visite du bien</b>Le certificateur agréé relève les informations sur place.</li>
      <li><b>Vous recevez le certificat</b>Avec des explications claires.</li>
    </ol>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap">
    <span class="eyebrow">FAQ ${esc(c.name)}</span>
    <h2>Vos questions, nos réponses.</h2>
    <div class="faq">${faqs.map(([qq, a]) => `<details><summary>${esc(qq)}</summary><p>${esc(a)}</p></details>`).join('')}</div>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="band">
      <div><h2>Votre certificat PEB à ${esc(c.name)} ?</h2><p>Une demande d'une minute. On vous répond rapidement, sans engagement.</p></div>
      ${btn('/?commune=' + q + '#devis', 'Devis gratuit')}
    </div>
    ${proches.length ? `<h3 style="font-size:17px;margin-top:44px">Aussi près de chez vous</h3><ul class="chips">${proches.map(p => `<li><a href="/certificat-peb/${p.slug}">Certificat PEB à ${esc(p.name)}</a></li>`).join('')}</ul>` : ''}
  </div>
</section>`;
  const ld = [
    { '@context': 'https://schema.org', '@type': 'Service', serviceType: 'Certificat PEB', name: `Certificat PEB à ${c.name}`, provider, areaServed: { '@type': 'City', name: c.name, address: { '@type': 'PostalAddress', postalCode: c.cp, addressLocality: c.name, addressRegion: 'Wallonie', addressCountry: 'BE' } }, offers: { '@type': 'Offer', price: String(P.peb), priceCurrency: 'EUR', description: `Prix indicatif ${VAT}, confirmé avant intervention` } },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE + '/' }, { '@type': 'ListItem', position: 2, name: 'Nos zones', item: SITE + '/certificat-peb' }, { '@type': 'ListItem', position: 3, name: c.name, item: `${SITE}/certificat-peb/${c.slug}` }] }
  ];
  fs.writeFileSync(path.join(ROOT, 'certificat-peb', c.slug + '.html'), page({ title, description, canonical: `/certificat-peb/${c.slug}`, body, ld, current: '/certificat-peb' }));
  out.push(`/certificat-peb/${c.slug}`);
}

/* ── Page « Nos zones » ────────────────────────────────── */
{
  const provinces = [...new Set(communes.map(c => c.province))];
  const body = `
<section class="sub-hero">
  ${GHOST}
  <div class="wrap">
    <ol class="crumbs rise"><li><a href="/">Accueil</a></li><li aria-current="page">Nos zones</li></ol>
    <h1 class="rise d1">Certificat PEB <span>partout en Wallonie.</span></h1>
    <p class="rise d2">Au départ de Grâce-Hollogne, en province de Liège, et partout en Wallonie. Choisissez votre commune, ou demandez directement votre devis.</p>
    <div class="actions rise d3">${btn('/#devis', 'Devis gratuit')}</div>
  </div>
</section>
<section class="sec">
  <div class="wrap">
    ${mapHtml()}
    <div style="margin-top:56px"></div>
    ${provinces.map(pr => `<span class="eyebrow" id="province-${PROV_ID[pr] || ''}">Province de ${esc(pr)}</span><ul class="chips" style="margin-bottom:40px">${communes.filter(c => c.province === pr).map(c => `<li><a href="/certificat-peb/${c.slug}">Certificat PEB à ${esc(c.name)}</a></li>`).join('')}</ul>`).join('\n    ')}
    <p class="lede">Votre commune n'est pas dans la liste ? Nous intervenons dans toute la Wallonie : indiquez-la dans le formulaire, on confirme rapidement la faisabilité.</p>
  </div>
</section>`;
  fs.writeFileSync(path.join(ROOT, 'certificat-peb', 'index.html'), page({
    title: `Certificat PEB en Wallonie : nos zones | ${CONFIG.brand}`,
    description: `Certificat PEB à Liège, Seraing, Herstal, Verviers, Namur, Charleroi, Mons et partout en Wallonie : ${P.peb} € ${VAT} indicatif, certificateur agréé, contrôle électrique au même rendez-vous.`,
    canonical: '/certificat-peb', body, current: '/certificat-peb', css: MAP.css, script: MAP.js,
    ld: [{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE + '/' }, { '@type': 'ListItem', position: 2, name: 'Nos zones', item: SITE + '/certificat-peb' }] }]
  }));
  out.unshift('/certificat-peb');
}

/* ── Pages « selon votre situation » ───────────────────── */
{
  const B = require('./tools/besoins-part.js')({ esc, btn, CONFIG, SITE, page, fs, path, ROOT, GHOST });
  out.unshift(...B.urls);
}

/* ── Page « Simulateur PEB » ───────────────────────────── */
{
  const sim = require('./tools/simulateur-part.js')({ esc, btn, CONFIG });
  fs.writeFileSync(path.join(ROOT, sim.file), page({
    title: sim.title, description: sim.description, canonical: sim.url, body: sim.body, css: sim.css, script: sim.script,
    ld: [{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE + '/' }, { '@type': 'ListItem', position: 2, name: 'Simulateur PEB', item: SITE + sim.url }] }]
  }));
  out.unshift(sim.url);
}

/* ── Anciennes pages Jumeo (supprimées, redirigées par vercel.json) ── */
for (const f of ['devenir-partenaire.html', 'simulateur-recharge.html', 'notre-histoire.html']) fs.rmSync(path.join(ROOT, f), { force: true });
for (const f of fs.readdirSync(path.join(ROOT, 'guides'))) {
  if (f !== 'index.html' && !require(path.join(ROOT, 'contenu', 'guides.js')).some(a => a.slug + '.html' === f)) fs.rmSync(path.join(ROOT, 'guides', f));
}

/* ── Guides (articles) ─────────────────────────────────── */
const G = require('./tools/guides-part.js')({ esc, btn, CONFIG, SITE, page, fs, path, ROOT });
out.unshift(...G.urls);

/* ── Liste des zones dans le pied de page de l'accueil ─── */
const zoneBlock = `<!-- ZONES:START (généré par build.js) -->${zonesLinks()}<!-- ZONES:END -->`;
if (!/<!-- ZONES:START[\s\S]*?<!-- ZONES:END -->/.test(indexHtml)) throw new Error('Marqueurs ZONES absents de index.html');
indexHtml = indexHtml.replace(/<!-- ZONES:START[\s\S]*?<!-- ZONES:END -->/, zoneBlock);
for (const [k, v] of [['APP:SPLASH', APP.splash(WORD)], ['LAUNCH', APP.launch(CONFIG.launch)], ['PARTNERS', PARTNERS.html(CONFIG.group, esc)], ['APP:HEAD', APP.head], ['CREDIT', CREDIT.html], ['MAP', mapHtml()], ['NAVPEB', NAV.html], ['APP:HTML', APP.html({ active: 'home', brand: esc(CONFIG.brand), whatsapp: CONFIG.whatsapp })]]) {
  const re = new RegExp(`<!-- ${k}:START[\\s\\S]*?<!-- ${k}:END -->`);
  if (!re.test(indexHtml)) throw new Error('Marqueurs ' + k + ' absents de index.html');
  indexHtml = indexHtml.replace(re, `<!-- ${k}:START (généré par build.js) -->\n${v}\n<!-- ${k}:END -->`);
}
for (const [k, v] of [['APP:CSS', APP.css + NAV.css + PARTNERS.css + CREDIT.css + MAP.css], ['APP:JS', APP.js + NAV.js + MAP.js]]) {
  const re = new RegExp(`/\\* ${k}:START[\\s\\S]*?/\\* ${k}:END \\*/`);
  if (!re.test(indexHtml)) throw new Error('Marqueurs ' + k + ' absents de index.html');
  indexHtml = indexHtml.replace(re, () => `/* ${k}:START (généré par build.js) */\n${v}\n/* ${k}:END */`);
}
if (!/<!-- GUIDES:START[\s\S]*?<!-- GUIDES:END -->/.test(indexHtml)) throw new Error('Marqueurs GUIDES absents de index.html');
indexHtml = indexHtml.replace(/<!-- GUIDES:START[\s\S]*?<!-- GUIDES:END -->/, `<!-- GUIDES:START (généré par build.js) -->${G.homeBlock}<!-- GUIDES:END -->`);
fs.writeFileSync(indexPath, indexHtml);

/* ── Sitemap ───────────────────────────────────────────── */
const urls = ['/', ...out];
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map(u => `  <url>\n    <loc>${SITE}${u === '/' ? '/' : u}</loc>\n    <lastmod>${TODAY}</lastmod>\n  </url>`).join('\n') +
  '\n</urlset>\n');

console.log(`OK : ${communes.length} pages communes, page « Nos zones », simulateur PEB, ${G.urls.length - 1} guides, sitemap (${urls.length} adresses).`);
