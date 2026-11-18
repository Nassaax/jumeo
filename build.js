// build.js : génère les pages locales « Certificat PEB à [commune] », la page « Devenir partenaire »,
// la liste des zones en bas de l'accueil et le sitemap. Aucune dépendance : node build.js
//
// Source unique des réglages : le bloc CONFIG de index.html (coordonnées, prix, partenaires).
// Après une modification de CONFIG ou de data/communes.json, relancer : node build.js
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SITE = 'https://jumeo.vercel.app';          // à remplacer par https://jumeo.be au lancement
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
const RINGS = (a, b = '#ff7a45') =>
  `<circle cx="23" cy="32" r="15" fill="none" stroke="${a}" stroke-width="7"/><circle cx="41" cy="32" r="15" fill="none" stroke="${b}" stroke-width="7"/><path d="M28.13 17.9A15 15 0 0 1 35.14 23.18" fill="none" stroke="${a}" stroke-width="7"/>`;
const ARROW = '<span class="chip-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>';
const btn = (href, label, extra = '') =>
  `<a class="btn btn-primary" href="${href}"${extra}><span class="roll"><span><span>${label}</span><span aria-hidden="true">${label}</span></span></span>${ARROW}</a>`;

const CSS = `
html,body{background:#0b2441}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--ink:#0b2441;--paper:#f7f5f0;--paper-2:#efebe3;--card:#fff;--muted:rgba(11,36,65,.66);--line:rgba(11,36,65,.12);--accent:#ff7a45;--accent-d:#f0652e;--w78:rgba(255,255,255,.78);--w60:rgba(255,255,255,.62);--wline:rgba(255,255,255,.14);--e-out:cubic-bezier(.16,1,.3,1);--e-std:cubic-bezier(.4,0,.2,1);--pad:20px}
@media(min-width:760px){:root{--pad:32px}}@media(min-width:1200px){:root{--pad:48px}}
html{scroll-behavior:smooth;scroll-padding-top:88px;overflow-x:clip}
body{font:400 16px/1.6 'Inter',system-ui,sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased;padding-bottom:72px}
main{background:var(--paper)}
::selection{background:rgba(255,122,69,.3)}
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
.logo b{font:700 21px 'Plus Jakarta Sans',sans-serif;letter-spacing:-.035em}.logo .ring-a{stroke:currentColor}
.nav{display:flex;gap:24px;margin-left:auto}.nav a{text-decoration:none;font-size:14px;font-weight:500;opacity:.82}.nav a:hover,.nav a[aria-current]{opacity:1}
.header .btn{min-height:40px;font-size:14px;padding:6px 6px 6px 18px}.header .chip-arrow{width:28px;height:28px}
@media(max-width:1080px){.nav{display:none}.header .btn{margin-left:auto}}
.sub-hero{position:relative;overflow:hidden;color:#fff;background:linear-gradient(180deg,#0b2441,#0f2f55)}
.sub-hero .wrap{position:relative;padding-top:128px;padding-bottom:80px}
.sub-hero .ghost{position:absolute;right:-12vw;top:50%;width:min(70vw,880px);transform:translateY(-50%);opacity:.09;pointer-events:none}
.sub-hero .ghost circle{fill:none;stroke:#fff;stroke-width:1.5}
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
.req li::before{content:"";flex:0 0 18px;height:18px;margin-top:3px;border-radius:50%;background:rgba(255,122,69,.16) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23e8622b' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12l5 5L19 7'/%3E%3C/svg%3E") center/11px no-repeat}
.form-card{background:#fff;border-radius:28px;padding:30px;box-shadow:0 0 0 1px var(--line),0 24px 60px rgba(11,36,65,.1)}
@media(max-width:480px){.form-card{padding:22px 18px}}
.form-card h2{font-size:26px;margin-bottom:6px}.form-card .sub{color:var(--muted);font-size:14px;margin-bottom:18px}
.field{margin-bottom:12px}.field label{display:block;font-size:12.5px;font-weight:600;color:var(--muted);margin-bottom:6px}
.field input,.field select,.field textarea{width:100%;padding:12px 14px;border:1px solid var(--line);border-radius:14px;font:15px 'Inter',sans-serif;background:#fafaf8;color:var(--ink)}
.field input:focus,.field select:focus,.field textarea:focus{outline:none;border-color:var(--ink);background:#fff;box-shadow:0 0 0 3px rgba(255,122,69,.35)}
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
// Tracé du mot « Jumeo » pour l'écran d'ouverture (4e tracé du logo blanc).
const WORD_D = [...fs.readFileSync(path.join(ROOT, 'brand', 'jumeo-logo-blanc.svg'), 'utf8').matchAll(/<path d="([^"]+)"/g)].map(m => m[1]).find(d => d.length > 200);
if (!WORD_D) throw new Error('Tracé du mot Jumeo introuvable dans brand/jumeo-logo-blanc.svg');
const PARTNERS = require('./tools/partners-part.js');

const zonesLinks = () => communes.map(c => `<a href="/certificat-peb/${c.slug}">PEB à ${esc(c.name)}</a>`).join('');

// Onglet actif et titre de la barre du haut (mobile), déduits de l'adresse de la page.
function appInfo(canonical, title) {
  const tab = canonical.startsWith('/guides') ? 'guides' : canonical.startsWith('/simulateur') ? 'simus' : '';
  const T = { '/certificat-peb': 'Nos zones', '/devenir-partenaire': 'Partenaires', '/simulateur-peb': 'Simulateur PEB', '/simulateur-recharge': 'Simulateur recharge', '/notre-histoire': 'Notre histoire', '/guides': 'Guides & simulateurs' };
  let appTitle = T[canonical];
  if (!appTitle && canonical.startsWith('/certificat-peb/')) appTitle = title.split(' :')[0].replace(/^Certificat /, '');
  if (!appTitle && canonical.startsWith('/guides/')) appTitle = 'Guide';
  return { tab, appTitle: appTitle || '' };
}

function page({ title, description, canonical, body, ld = [], current = '', script = '', css = '' }) {
  const app = appInfo(canonical, title);
  const nav = [['/#tarifs', 'Tarifs'], ['/guides', 'Guides<span class="nav-slash" aria-hidden="true">/</span>Simulateurs'], ['/certificat-peb', 'Nos zones'], ['/#pros', 'Professionnels'], ['/devenir-partenaire', 'Devenir partenaire']]
    .map(([h, l]) => `<a href="${h}"${h === current ? ' aria-current="page"' : ''}>${l}</a>`).join('\n      ');
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
<meta property="og:site_name" content="Jumeo" />
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
<style>${CSS}${css}${APP.css}${PARTNERS.css}</style>
</head>
<body>
${APP.splash(WORD_D)}
<!-- Page générée par build.js : ne pas modifier à la main -->
<header class="header">
  ${APP.launch(CONFIG.launch)}
  <div class="wrap">
    <a class="logo" href="/" aria-label="Jumeo, accueil"><svg viewBox="0 0 64 64" aria-hidden="true">${RINGS('currentColor').replace(/stroke="currentColor"/g, 'class="ring-a"')}</svg><b>${esc(CONFIG.brand)}</b></a>
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
${PARTNERS.html(CONFIG.partners, esc)}
<footer>
  <div class="wrap">
    <div class="foot">
      <div>
        <div class="logo"><svg viewBox="0 0 64 64" aria-hidden="true">${RINGS('#fff')}</svg><b>${esc(CONFIG.brand)}</b></div>
        <p>PEB, électricité, photovoltaïque, rénovation et projets immobiliers en Wallonie.</p>
      </div>
      <div><h4>Navigation</h4><a href="/">Accueil</a><a href="/notre-histoire">Notre histoire</a><a href="/#tarifs">Tarifs</a><a href="/simulateur-peb">Simulateur PEB</a><a href="/simulateur-recharge">Simulateur recharge</a><a href="/guides">Guides</a><a href="/#transparence">Qui fait quoi</a><a href="/#faq">FAQ</a></div>
      <div><h4>Contact</h4><a href="/#devis">Demander un devis</a><a href="/devenir-partenaire">Devenir partenaire</a><a href="/#mentions-legales">Mentions légales</a><a href="/#confidentialite">Confidentialité</a></div>
      <div><h4>Nos zones</h4><div class="zones">${zonesLinks()}</div></div>
    </div>
    <div class="legal">${esc(CONFIG.brand)} est un apporteur d'affaires indépendant et n'est pas certificateur PEB. Les certificats PEB sont établis exclusivement par un certificateur agréé par la Région wallonne. Les prestations sont réalisées par nos partenaires. Prix indicatifs ${esc(VAT)}, devis confirmé avant intervention.</div>
  </div>
</footer>
${APP.html({ active: app.tab, brand: esc(CONFIG.brand), whatsapp: CONFIG.whatsapp })}
<script>
'use strict';
const header = document.querySelector('.header');
const onScroll = () => header.classList.toggle('scrolled', scrollY > 40);
addEventListener('scroll', onScroll, { passive: true }); onScroll();
${APP.js}
${script}
</script>
</body>
</html>
`;
}

const GHOST = '<svg class="ghost" viewBox="0 0 400 240" aria-hidden="true"><circle cx="150" cy="120" r="100"/><circle cx="250" cy="120" r="100"/></svg>';
const provider = { '@type': 'LocalBusiness', name: CONFIG.brand, url: SITE + '/', description: "Apporteur d'affaires indépendant : mise en relation avec des professionnels agréés (PEB, électricité, photovoltaïque, rénovation) en Wallonie.", areaServed: { '@type': 'AdministrativeArea', name: 'Wallonie' } };
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
  const description = `Certificat PEB à ${c.name} (${c.cp}) : ${P.peb} € ${VAT} indicatif, certificateur agréé par la Région wallonne, un seul contact. ${c.sections.length > 1 ? 'Toutes les sections : ' + c.sections.slice(0, 4).join(', ') + '…' : 'Devis gratuit, sans engagement.'}`;
  const faqs = [
    [`Combien coûte un certificat PEB à ${c.name} ?`, `Comptez ${P.peb} € ${VAT} (prix indicatif) pour un certificat PEB, ou ${P.pebelec} € ${VAT} avec le contrôle électrique. Le prix final dépend du bien et vous est confirmé avant l'intervention.`],
    [`Intervenez-vous dans toutes les sections de ${c.name} ?`, c.sections.length > 1 ? `Oui : ${sectionsTxt}. Indiquez simplement votre adresse dans la demande.` : `Oui, dans toute la commune. Indiquez simplement votre adresse dans la demande.`],
    [`Qui réalise le certificat ?`, `Un certificateur agréé par la Région wallonne, partenaire de ${CONFIG.brand}. ${CONFIG.brand} est un apporteur d'affaires indépendant : nous recevons votre demande, organisons le rendez-vous et restons votre contact.`]
  ];
  const body = `
<section class="sub-hero">
  ${GHOST}
  <div class="wrap">
    <ol class="crumbs rise"><li><a href="/">Accueil</a></li><li><a href="/certificat-peb">Nos zones</a></li><li aria-current="page">${esc(c.name)}</li></ol>
    <h1 class="rise d1">Certificat PEB à ${esc(c.name)}, <span>sans prise de tête.</span></h1>
    <p class="rise d2">${esc(c.intro)} Un devis clair, un certificateur agréé, un seul contact.</p>
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
      <div class="card"><h3>Dépannage chauffage &amp; électricité</h3><div class="amt"><small>dès </small>${P.depannage} €<small> ${esc(VAT)}</small></div><p>Diagnostic et explication avant toute réparation.</p></div>
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
    <h2>Quatre étapes, un seul contact.</h2>
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
    <div class="band light" style="margin-top:20px">
      <div><h2>Vous êtes entrepreneur à ${esc(c.name)} ?</h2><p>Électricien, chauffagiste, installateur, certificateur, entrepreneur : rejoignez le réseau ${esc(CONFIG.brand)} et recevez des demandes de clients de votre région.</p></div>
      <a class="btn btn-ghost" href="/devenir-partenaire?commune=${q}">Devenir partenaire</a>
    </div>
    ${proches.length ? `<h3 style="font-size:17px;margin-top:44px">Aussi près de chez vous</h3><ul class="chips">${proches.map(p => `<li><a href="/certificat-peb/${p.slug}">Certificat PEB à ${esc(p.name)}</a></li>`).join('')}</ul>` : ''}
  </div>
</section>`;
  const ld = [
    { '@context': 'https://schema.org', '@type': 'Service', serviceType: 'Certificat PEB (mise en relation avec un certificateur agréé)', name: `Certificat PEB à ${c.name}`, provider, areaServed: { '@type': 'City', name: c.name, address: { '@type': 'PostalAddress', postalCode: c.cp, addressLocality: c.name, addressRegion: 'Wallonie', addressCountry: 'BE' } }, offers: { '@type': 'Offer', price: String(P.peb), priceCurrency: 'EUR', description: `Prix indicatif ${VAT}, confirmé avant intervention` } },
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
    <p class="rise d2">Province de Liège en priorité, et toute la Wallonie. Choisissez votre commune, ou demandez directement votre devis.</p>
    <div class="actions rise d3">${btn('/#devis', 'Devis gratuit')}</div>
  </div>
</section>
<section class="sec">
  <div class="wrap">
    ${provinces.map(pr => `<span class="eyebrow">Province de ${esc(pr)}</span><ul class="chips" style="margin-bottom:40px">${communes.filter(c => c.province === pr).map(c => `<li><a href="/certificat-peb/${c.slug}">Certificat PEB à ${esc(c.name)}</a></li>`).join('')}</ul>`).join('\n    ')}
    <p class="lede">Votre commune n'est pas dans la liste ? Nous intervenons dans toute la Wallonie : indiquez-la dans le formulaire, on confirme rapidement la faisabilité.</p>
  </div>
</section>`;
  fs.writeFileSync(path.join(ROOT, 'certificat-peb', 'index.html'), page({
    title: `Certificat PEB en Wallonie : nos zones | ${CONFIG.brand}`,
    description: `Certificat PEB à Liège, Seraing, Herstal, Verviers, Namur, Charleroi, Mons et partout en Wallonie : ${P.peb} € ${VAT} indicatif, certificateur agréé, un seul contact.`,
    canonical: '/certificat-peb', body, current: '/certificat-peb',
    ld: [{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE + '/' }, { '@type': 'ListItem', position: 2, name: 'Nos zones', item: SITE + '/certificat-peb' }] }]
  }));
  out.unshift('/certificat-peb');
}

/* ── Page « Devenir partenaire » ───────────────────────── */
{
  const metiers = ['Certificateur PEB', 'Électricien', 'Chauffagiste', 'Installateur photovoltaïque', 'Installateur pompe à chaleur', 'Couvreur / isolation', 'Menuisier / châssis', 'Entrepreneur rénovation', 'Architecte', 'Autre'];
  const body = `
<section class="sub-hero">
  ${GHOST}
  <div class="wrap">
    <ol class="crumbs rise"><li><a href="/">Accueil</a></li><li aria-current="page">Devenir partenaire</li></ol>
    <h1 class="rise d1">Des clients près de chez vous, <span>sans prospecter.</span></h1>
    <p class="rise d2">Électriciens, chauffagistes, installateurs, certificateurs, entrepreneurs : ${esc(CONFIG.brand)} reçoit des demandes de particuliers et de professionnels en Wallonie, et les confie à des entreprises partenaires sérieuses.</p>
    <div class="actions rise d3">${btn('#candidature', 'Proposer ma candidature')}<a class="btn btn-light" href="#fonctionnement">Comment ça marche</a></div>
  </div>
</section>

<section class="sec" id="fonctionnement">
  <div class="wrap">
    <span class="eyebrow">Comment ça marche</span>
    <h2>Vous faites votre métier, on s'occupe du reste.</h2>
    <p class="lede">${esc(CONFIG.brand)} est un apporteur d'affaires indépendant : nous trouvons les clients, préparons leur demande et coordonnons le rendez-vous. Vous réalisez la prestation et la facturez.</p>
    <div class="why">
      <div class="card"><b>1</b><h3>On reçoit la demande</h3><p>Le client nous contacte via le site ou WhatsApp. On vérifie son besoin, sa commune et les documents utiles.</p></div>
      <div class="card"><b>2</b><h3>On vous la transmet</h3><p>Une demande qualifiée, dans votre zone et dans votre métier. Vous confirmez le devis et le rendez-vous.</p></div>
      <div class="card"><b>3</b><h3>Vous réalisez la prestation</h3><p>Vous gardez la relation technique et la facturation. On reste le point de contact du client pour le suivi.</p></div>
    </div>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap split">
    <div>
      <span class="eyebrow">Nos conditions</span>
      <h2>Un réseau sérieux, des règles claires.</h2>
      <p class="lede">Nos clients nous font confiance : nous ne travaillons qu'avec des entreprises en règle.</p>
      <ul class="req">
        <li>Un numéro d'entreprise (BCE) actif</li>
        <li>Une assurance responsabilité civile professionnelle</li>
        <li>Les agréments exigés pour votre métier (par exemple certificateur PEB agréé par la Région wallonne)</li>
        <li>Un contrat écrit avec ${esc(CONFIG.brand)}, signé avant la première mise en relation : commission, facturation et responsabilités y sont fixées</li>
      </ul>
      <p class="fine">Les conditions financières, dont notre commission, sont définies avec vous dans ce contrat.</p>
    </div>
    <div class="form-card" id="candidature">
      <h2>Proposer ma candidature</h2>
      <p class="sub">On revient vers vous pour en parler. Aucun engagement.</p>
      <form id="partnerForm" novalidate>
        <div class="row2">
          <div class="field"><label for="p-entreprise">Entreprise</label><input id="p-entreprise" name="entreprise" autocomplete="organization" required /></div>
          <div class="field"><label for="p-nom">Votre nom</label><input id="p-nom" name="nom" autocomplete="name" required /></div>
        </div>
        <div class="field"><label for="p-metier">Métier</label><select id="p-metier" name="metier">${metiers.map(m => `<option>${esc(m)}</option>`).join('')}</select></div>
        <div class="field"><label for="p-zone">Communes ou zone d'intervention</label><input id="p-zone" name="zone" placeholder="ex : Liège, Seraing, Herstal" required /></div>
        <div class="field"><label for="p-agrements">Agréments et numéros (si votre métier en demande)</label><input id="p-agrements" name="agrements" placeholder="ex : certificateur PEB n° …" /></div>
        <div class="row2">
          <div class="field"><label for="p-rc">Assurance RC professionnelle</label><select id="p-rc" name="rc"><option>Oui</option><option>En cours</option><option>Non</option></select></div>
          <div class="field"><label for="p-bce">N° d'entreprise (BCE)</label><input id="p-bce" name="bce" placeholder="0xxx.xxx.xxx" /></div>
        </div>
        <div class="row2">
          <div class="field"><label for="p-tel">Téléphone</label><input id="p-tel" name="tel" type="tel" autocomplete="tel" required /></div>
          <div class="field"><label for="p-mail">E-mail (facultatif)</label><input id="p-mail" name="mail" type="email" autocomplete="email" /></div>
        </div>
        <div class="field"><label for="p-site">Site web (facultatif)</label><input id="p-site" name="site" type="url" placeholder="https://" /></div>
        <div class="field"><label for="p-msg">Un mot sur votre entreprise (facultatif)</label><textarea id="p-msg" name="msg" rows="3"></textarea></div>
        <label class="consent"><input type="checkbox" id="p-ok" required /><span>J'accepte que ces informations servent à étudier ma candidature et à me recontacter (voir <a href="/#confidentialite">confidentialité</a>).</span></label>
        <button class="btn btn-primary" type="submit"><span class="roll"><span><span>Envoyer ma candidature</span><span aria-hidden="true">Envoyer ma candidature</span></span></span>${ARROW}</button>
        <p class="form-note" id="p-note">Votre candidature s'ouvre dans WhatsApp, prête à envoyer.</p>
        <div class="preview-msg" id="p-preview"><b>Mode aperçu :</b> les coordonnées de contact ne sont pas encore configurées. Voici le message qui serait envoyé :<textarea id="p-previewText" readonly></textarea></div>
      </form>
    </div>
  </div>
</section>`;
  const contact = { brand: CONFIG.brand, whatsapp: CONFIG.whatsapp, email: CONFIG.email };
  const script = `
const CONFIG = ${JSON.stringify(contact)};
const waNum = CONFIG.whatsapp.replace(/\\D/g, '');
const $ = s => document.querySelector(s);
const params = new URLSearchParams(location.search);
if (params.get('commune')) $('#p-zone').value = params.get('commune').slice(0, 80);
if (!waNum) $('#p-note').textContent = CONFIG.email ? 'Votre candidature s\\'ouvre dans votre messagerie e-mail.' : $('#p-note').textContent;
$('#partnerForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  const need = ['entreprise', 'nom', 'zone', 'tel'].filter(n => !f[n].value.trim());
  if (need.length || !$('#p-ok').checked) {
    (need.length ? f[need[0]] : $('#p-ok')).focus();
    $('#p-note').textContent = need.length ? 'Merci de compléter entreprise, nom, zone et téléphone.' : 'Merci d\\'accepter le traitement de vos données.';
    $('#p-note').style.color = '#c2410c';
    return;
  }
  const v = n => f[n].value.trim();
  const msg = [
    'Bonjour, candidature partenaire ' + CONFIG.brand,
    'Entreprise : ' + v('entreprise'),
    'Contact : ' + v('nom'),
    'Métier : ' + v('metier'),
    'Zone : ' + v('zone'),
    v('agrements') ? 'Agréments : ' + v('agrements') : '',
    'Assurance RC pro : ' + v('rc'),
    v('bce') ? 'BCE : ' + v('bce') : '',
    'Téléphone : ' + v('tel'),
    v('mail') ? 'E-mail : ' + v('mail') : '',
    v('site') ? 'Site : ' + v('site') : '',
    v('msg') ? 'Message : ' + v('msg') : ''
  ].filter(Boolean).join('\\n');
  if (waNum) window.open('https://wa.me/' + waNum + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  else if (CONFIG.email) location.href = 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent('Candidature partenaire — ' + v('entreprise')) + '&body=' + encodeURIComponent(msg);
  else { $('#p-previewText').value = msg; $('#p-preview').style.display = 'block'; }
});`;
  fs.writeFileSync(path.join(ROOT, 'devenir-partenaire.html'), page({
    title: `Devenir partenaire : recevez des clients en Wallonie | ${CONFIG.brand}`,
    description: `Électricien, chauffagiste, installateur, certificateur PEB, entrepreneur : rejoignez le réseau ${CONFIG.brand} et recevez des demandes qualifiées en Wallonie. Contrat écrit, règles claires.`,
    canonical: '/devenir-partenaire', body, current: '/devenir-partenaire', script
  }));
  out.unshift('/devenir-partenaire');
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

/* ── Page « Simulateur de recharge » ───────────────────── */
{
  const r = require('./tools/recharge-part.js')({ esc, btn, CONFIG });
  fs.writeFileSync(path.join(ROOT, r.file), page({
    title: r.title, description: r.description, canonical: r.url, body: r.body, css: r.css, script: r.script,
    ld: [{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE + '/' }, { '@type': 'ListItem', position: 2, name: 'Guides', item: SITE + '/guides' }, { '@type': 'ListItem', position: 3, name: 'Simulateur de recharge', item: SITE + r.url }] }]
  }));
  out.unshift(r.url);
}

/* ── Page « Notre histoire » ───────────────────────────── */
{
  const h = require('./tools/histoire-part.js')({ esc, btn, CONFIG });
  fs.writeFileSync(path.join(ROOT, h.file), page({
    title: h.title, description: h.description, canonical: h.url, body: h.body, css: h.css,
    ld: [{ '@context': 'https://schema.org', '@type': 'AboutPage', name: 'Notre histoire', url: SITE + h.url, about: provider },
         { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE + '/' }, { '@type': 'ListItem', position: 2, name: 'Notre histoire', item: SITE + h.url }] }]
  }));
  out.unshift(h.url);
}

/* ── Guides (articles) ─────────────────────────────────── */
const G = require('./tools/guides-part.js')({ esc, btn, CONFIG, SITE, page, fs, path, ROOT });
out.unshift(...G.urls);

/* ── Liste des zones dans le pied de page de l'accueil ─── */
const zoneBlock = `<!-- ZONES:START (généré par build.js) -->${zonesLinks()}<!-- ZONES:END -->`;
if (!/<!-- ZONES:START[\s\S]*?<!-- ZONES:END -->/.test(indexHtml)) throw new Error('Marqueurs ZONES absents de index.html');
indexHtml = indexHtml.replace(/<!-- ZONES:START[\s\S]*?<!-- ZONES:END -->/, zoneBlock);
for (const [k, v] of [['APP:SPLASH', APP.splash(WORD_D)], ['LAUNCH', APP.launch(CONFIG.launch)], ['PARTNERS', PARTNERS.html(CONFIG.partners, esc)], ['APP:HEAD', APP.head], ['APP:HTML', APP.html({ active: 'home', brand: esc(CONFIG.brand), whatsapp: CONFIG.whatsapp })]]) {
  const re = new RegExp(`<!-- ${k}:START[\\s\\S]*?<!-- ${k}:END -->`);
  if (!re.test(indexHtml)) throw new Error('Marqueurs ' + k + ' absents de index.html');
  indexHtml = indexHtml.replace(re, `<!-- ${k}:START (généré par build.js) -->\n${v}\n<!-- ${k}:END -->`);
}
for (const [k, v] of [['APP:CSS', APP.css + PARTNERS.css], ['APP:JS', APP.js]]) {
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

console.log(`OK : ${communes.length} pages communes, page « Nos zones », page partenaire, simulateur, ${G.urls.length - 1} guides, sitemap (${urls.length} adresses).`);
