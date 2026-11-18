"""Démo « Lux Energie Solution » : site complet dérivé du site Jumeo, dans demo-lux/.

Lux est une entreprise EN ACTIVITÉ qui réalise elle-même les prestations (certification PEB,
électricité, chauffage, photovoltaïque) : on retire tout ce qui relève de l'apporteur d'affaires
(Qui fait quoi Jumeo/pro, partenaires, devenir partenaire, notre histoire, bandeau de lancement).
Formulaires en mode aperçu (aucun numéro publié). Site non référencé (noindex).

Usage : python3 tools/make_demo_lux.py   (relance d'abord node build.js)
"""
import os, re, shutil, subprocess, json, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'demo-lux')
BRAND = 'Lux Energie Solution'
DEMO_URL = 'https://lux-energie-demo.vercel.app'
LOGO_SRC = os.path.join(ROOT, 'partenaires', 'lux-energie-solution.png')
# Coordonnées PUBLIQUES de Lux, telles qu'affichées sur luxenergiesolution.com (lues le 2026-11-18).
TEL_DISPLAY, TEL_LINK, WA = '0466 09 03 84', 'tel:+32466090384', '32466090384'
MAIL = 'contact@luxenergiesolution.com'
ADDRESS = 'Rue du Pont 6, 4460 Grâce-Hollogne'
PHONE_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>'
WA_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21l1.7-5A8.5 8.5 0 1 1 8 19.4z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.4-2-1-.8.8a4 4 0 0 1-2.3-2.3l.8-.8-1-2z"/></svg>'

os.chdir(ROOT)
subprocess.run(['node', 'build.js'], check=True, stdout=subprocess.DEVNULL)

# ── 1. Copie des pages du site (sans les pages propres à Jumeo) ──────────────
if os.path.isdir(OUT):
    shutil.rmtree(OUT)
os.makedirs(OUT)
for f in ['index.html', 'simulateur-peb.html', 'simulateur-recharge.html', 'sitemap.xml', 'robots.txt', 'manifest.webmanifest', 'sw.js', 'vercel.json']:
    shutil.copy(f, os.path.join(OUT, f))
for d in ['certificat-peb', 'guides']:
    shutil.copytree(d, os.path.join(OUT, d))
shutil.copy(LOGO_SRC, os.path.join(OUT, 'logo-lux.png'))

# ── 2. Icônes et image de partage à partir du logo ───────────────────────────
subprocess.run(['python3', os.path.join(ROOT, 'tools', 'demo_lux_images.py'), LOGO_SRC, OUT], check=True)

# ── 2 bis. Photos des services (reprises du site de Lux, dans tools/demo-lux-photos/) ──
# Illustrations des services, jamais présentées comme « nos réalisations ».
# nom de sortie : (fichier source, centre du cadrage x, y). Recadrées en 16:10, 800 × 500.
from PIL import Image
PHOTOS = {
    'peb': ('peb.webp', .5, .5), 'pebelec': ('tableau.webp', .22, .5), 'depannage': ('depannage.webp', .42, .5),
    'chauffage': ('chaufferie.webp', .5, .42), 'pv': ('photovoltaique.webp', .6, .5), 'elec': ('tableau.webp', .78, .5),
}
os.makedirs(os.path.join(OUT, 'photos'))
for name, (src, fx, fy) in PHOTOS.items():
    im = Image.open(os.path.join(ROOT, 'tools', 'demo-lux-photos', src)).convert('RGB')
    w, h = im.size
    cw, ch = (w, round(w * 10 / 16)) if w * 10 / 16 <= h else (round(h * 16 / 10), h)
    x = min(max(round(fx * w - cw / 2), 0), w - cw)
    y = min(max(round(fy * h - ch / 2), 0), h - ch)
    im.crop((x, y, x + cw, y + ch)).resize((800, 500), Image.LANCZOS).save(os.path.join(OUT, 'photos', name + '.webp'), quality=80)


def ph(name, alt):
    return ('<img class="ph" src="/photos/' + name + '.webp" alt="' + alt +
            '" width="800" height="500" loading="lazy" decoding="async" />')

# ── 3. Remplacements ─────────────────────────────────────────────────────────
DEMO_CSS = """<style id="demo-lux">
/* Démo Lux Energie Solution : logo image, couleurs, écran d'ouverture */
.logo-chip{display:inline-flex;align-items:center;background:#fff;border-radius:12px;padding:5px 10px;box-shadow:0 0 0 1px rgba(11,36,65,.08)}
.logo-chip img{display:block;height:34px;width:auto}
footer .logo-chip img{height:40px}
.about .logo-chip{padding:14px 18px;border-radius:20px}.about .logo-chip img{height:64px}
@media(max-width:760px){.header .logo-chip{padding:4px 8px;border-radius:10px}.header .logo-chip img{height:28px}}
html.intro .intro-splash{background:#fff}
.lx-stage{position:relative;display:grid;place-items:center;width:min(86vw,520px);aspect-ratio:2.2}
.lx-orbits{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.lx-o{fill:none;stroke-width:5;stroke-linecap:round;stroke-dasharray:560;animation:lx-draw 1.15s cubic-bezier(.65,0,.35,1) .15s both}
.lx-o2{animation-delay:.32s}
.lx-logo{position:relative;width:74%;height:auto;animation:lx-logo .7s cubic-bezier(.34,1.56,.64,1) 1.05s both}
.lx-tag{color:#0b2441!important}.lx-tag b{color:#b8860b!important}
@keyframes lx-draw{from{stroke-dashoffset:560;opacity:0}12%{opacity:1}to{stroke-dashoffset:0;opacity:.9}}
@keyframes lx-logo{from{opacity:0;transform:scale(.86)}to{opacity:1;transform:none}}
/* Appeler / WhatsApp */
.hdr-call{display:inline-flex;align-items:center;gap:8px;margin-left:18px;padding:0 14px;min-height:40px;border-radius:999px;border:1px solid currentColor;border-color:color-mix(in srgb,currentColor 35%,transparent);color:inherit;text-decoration:none;font:600 14px 'Inter',sans-serif;white-space:nowrap}
.hdr-call svg,.hero-actions svg,.trust4 svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;flex:none}
.hdr-call:hover{border-color:currentColor}
@media(max-width:1180px){.hdr-call span{display:none}.hdr-call{padding:0 11px}}
@media(max-width:760px){.hdr-call{margin-left:auto;min-height:38px;background:#f2b705;color:#0b2441;border:0}.hdr-call span{display:inline;font-size:13px}}
.hero-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:28px}
.hero-actions a{display:inline-flex;align-items:center;gap:10px;min-height:48px;padding:0 20px;border-radius:999px;font:600 15px 'Inter',sans-serif;text-decoration:none;transition:transform .2s}
.hero-actions a:active{transform:scale(.97)}
.btn-call{background:#fff;color:#0b2441}
.btn-wa2{background:#1fa855;color:#fff}.btn-wa2:hover{background:#178a45}
.hero-sim{margin-top:22px!important}
/* Pourquoi nous choisir */
.trust4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
@media(max-width:900px){.trust4{grid-template-columns:1fr 1fr}}
.trust4 div{display:flex;gap:12px;align-items:flex-start;padding:18px;border-radius:20px;background:#fff;box-shadow:0 0 0 1px rgba(11,36,65,.12)}
.trust4 i{display:grid;place-items:center;width:40px;height:40px;border-radius:12px;background:#fff6d6;color:#0b2441;flex:none}
.trust4 b{display:block;font:600 16px 'Plus Jakarta Sans',sans-serif;color:#0b2441}
.trust4 small{display:block;font-size:13.5px;color:rgba(11,36,65,.66);margin-top:2px}
.lx-values{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
.lx-values span{font-size:13.5px;font-weight:600;padding:6px 12px;border-radius:999px;background:#fff6d6;color:#0b2441}
/* Photos des services */
.price .ph{display:block;width:calc(100% + 64px);max-width:none;height:auto;aspect-ratio:16/10;object-fit:cover;margin:-32px -32px 22px;border-radius:var(--r-card) var(--r-card) 0 0}
.price.pop .badge{top:14px;right:14px;background:#0b2441;border-color:rgba(255,255,255,.22);color:#fff}
.price.pop h3{padding-right:0}
.svc .s .ph{grid-column:1/-1;display:block;width:100%;max-width:none;height:210px;object-fit:cover;border-radius:16px;margin-bottom:16px}
footer .addr{margin-top:6px;font-size:13.5px;line-height:1.5;color:rgba(255,255,255,.62)}
</style>"""

SPLASH = """<div class="intro-splash" id="introSplash" aria-hidden="true">
  <div class="sp-in">
    <div class="lx-stage">
      <svg class="lx-orbits" viewBox="0 0 220 100" aria-hidden="true"><ellipse class="lx-o" cx="110" cy="50" rx="104" ry="40" stroke="#12355b" transform="rotate(-8 110 50)"/><ellipse class="lx-o lx-o2" cx="110" cy="50" rx="104" ry="40" stroke="#f2b705" transform="rotate(8 110 50)"/></svg>
      <img class="lx-logo" src="/logo-lux.png" alt="" width="780" height="208" />
    </div>
    <p class="sp-tag lx-tag">Optimisez votre énergie. <b>Réduisez vos coûts.</b></p>
  </div>
</div>"""

CHIP = '<span class="logo-chip"><img src="/logo-lux.png" alt="Lux Energie Solution" width="150" height="40" /></span>'

# (motif regex, remplacement) : appliqués à toutes les pages HTML, dans l'ordre
REGEX = [
    # structure : blocs propres au modèle « apporteur d'affaires »
    (r'<section class="partners-band"[\s\S]*?</section>\s*', ''),
    (r'<div class="launch"[\s\S]*?</a></div>\s*', ''),
    (r'<div class="join reveal" id="rejoindre">[\s\S]*?Devenir partenaire</span></span></span>[\s\S]*?</a>\s*</div>\s*', ''),
    (r'<div class="band light"[^>]*>[\s\S]*?Devenir partenaire</a>\s*</div>\s*', ''),
    (r'<a [^>]*href="/(?:devenir-partenaire|notre-histoire)[^"]*"[^>]*>[\s\S]*?</a>', ''),
    (r'<details><summary>Jumeo est-il certificateur ou installateur \?</summary>[\s\S]*?</details>', ''),
    (r'<details><summary>Je suis une entreprise : puis-je rejoindre le réseau \?</summary>[\s\S]*?</details>', ''),
    (r'<h2>Et avec Jumeo \?</h2>\s*<p>[\s\S]*?</p>', '<h2>Et chez Lux Energie Solution ?</h2>\n<p>Nous sommes une entreprise déclarée et assurée, et notre certificateur PEB est agréé par la Région wallonne. Demandez-nous nos attestations : c\'est votre droit, et nous les montrons volontiers.</p>'),
    # écran d'ouverture et logos
    (r'<div class="intro-splash" id="introSplash"[\s\S]*?\n</div>', SPLASH),
    (r'(<a class="logo[^"]*"[^>]*aria-label=")Jumeo, accueil(">)\s*<svg[\s\S]*?</svg>\s*<b[^>]*>Jumeo</b>', r'\1Lux Energie Solution, accueil\2' + CHIP),
    (r'(<div class="logo"[^>]*>)\s*<svg[\s\S]*?</svg>\s*<b[^>]*>Jumeo</b>', r'\1' + CHIP),
    (r'<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="23" cy="32" r="15" fill="none" stroke="#12355b"[\s\S]*?</svg>', CHIP),
    # textes « apporteur d'affaires » → entreprise qui réalise
    (r"(?:<span data-brand>Jumeo</span>|Jumeo) est un apporteur d'affaires indépendant et n'est pas certificateur PEB\. Les certificats PEB sont établis exclusivement par un certificateur agréé par la Région wallonne\. Les prestations sont réalisées par nos partenaires\.",
     "Lux Energie Solution réalise vos certificats PEB et vos travaux d'électricité, de chauffage et de photovoltaïque. Les certificats PEB sont établis par un certificateur agréé par la Région wallonne. Site de démonstration."),
    (r"Jumeo est un apporteur d'affaires indépendant : les prestations sont réalisées par nos partenaires\.", "Site de démonstration réalisé pour Lux Energie Solution."),
    (r"Un certificateur agréé par la Région wallonne, partenaire de Jumeo\. Jumeo est un apporteur d(?:'|&#39;)affaires indépendant : [^<]*",
     "Notre certificateur, agréé par la Région wallonne. Nous fixons le rendez-vous avec vous et restons votre contact du début à la fin."),
    (r"Chez (?:<span data-brand>Jumeo</span>|Jumeo), (?:nous coordonnons votre demande et )?le certificat est établi (?:et signé )?par notre certificateur partenaire agréé\.",
     "Chez Lux Energie Solution, le certificat est établi et signé par notre certificateur agréé."),
    (r"Apporteur d(?:'|&#39;|\\u0027)affaires indépendant : mise en relation avec des professionnels agréés \(PEB, électricité, photovoltaïque, rénovation\) en Wallonie\.",
     "Certification PEB, électricité, chauffage, pompes à chaleur et photovoltaïque en Wallonie."),
    (r"Certificat PEB \(mise en relation avec un certificateur agréé\)", "Certificat PEB"),
    (r"Jumeo vous met en relation avec des professionnels compétents et en règle, et suit votre dossier du début à la fin\. Vous n(?:'|&#39;)avez qu(?:'|&#39;)un contact\.",
     "Lux Energie Solution réalise votre projet de A à Z : une seule entreprise, un seul contact, du diagnostic à la finition."),
    (r"Décrivez votre projet : on vous met en relation avec un électricien partenaire, qui vérifie votre installation et s(?:'|&#39;)occupe des démarches\.",
     "Décrivez votre projet : nos électriciens vérifient votre installation et s'occupent des démarches."),
    (r"Décrivez votre projet : on vous met en relation avec (?:un professionnel compétent de votre région|le bon professionnel)\.", "Décrivez votre projet : nous vous proposons un devis clair."),
    (r"On s(?:'|&#39;)occupe de trouver le bon pro", "Un seul pro pour tout"),
    (r"<b>On trouve le bon pro</b><p>[^<]*</p>", "<b>Un seul pro</b><p>Certification PEB, électricité, chauffage, photovoltaïque : une seule entreprise, déclarée et assurée.</p>"),
    (r"par un professionnel partenaire", "par nos techniciens"),
    (r"un seul interlocuteur pour trouver les bons professionnels", "un seul interlocuteur pour réaliser votre projet"),
    (r"et mise en relation travaux", "et travaux"),
    (r"et, pour réaliser la prestation, au partenaire concerné", "et à nos techniciens chargés de la prestation"),
    (r"Qui fait quoi</a>", "Notre métier</a>"),
    (r"Qui fait quoi</span>", "Notre métier</span>"),
    # couleurs : jaune Lux à la place de l'orange Jumeo
    (r"#ff7a45", "#f2b705"), (r"%23ff7a45", "%23f2b705"), (r"#f0652e", "#d99e00"), (r"#e8622b", "#9a6f00"), (r"%23e8622b", "%239a6f00"),
    (r"rgba\(255,122,69", "rgba(242,183,5"), (r"#ffb394", "#ffd966"), (r"#ffc2a6", "#ffe28a"), (r"#ffd7c7", "#ffe9a6"),
    # adresses, icônes, nom
    (r"https://jumeo\.vercel\.app", DEMO_URL),
    (r'<link rel="icon" href="/favicon\.svg" type="image/svg\+xml" />', '<link rel="icon" href="/favicon.png" type="image/png" />'),
    (r'content="Jumeo" />', 'content="Lux Energie" />'),
    (r"Par l'équipe Jumeo", "Par l'équipe Lux Energie Solution"),
    (r"jumeo-intro", "lux-intro"),
    (r"contact@jumeo\.be", "contact@exemple.be"),
    (r"Jumeo", BRAND),
    # Appeler : en-tête (après le menu), onglet mobile à la place de « Simus », WhatsApp dans le panneau Menu
    (r'(<nav class="nav[^"]*"[\s\S]*?</nav>)', r'\1\n    <a class="hdr-call" href="' + TEL_LINK + '" aria-label="Appeler ' + TEL_DISPLAY + '">' + PHONE_SVG.replace('\\', '\\\\') + '<span>' + TEL_DISPLAY + '</span></a>'),
    (r'<a class="tab" href="/guides#simulateurs"[^>]*>[\s\S]*?<span>Simus</span></a>', '<a class="tab" href="' + TEL_LINK + '">' + PHONE_SVG.replace('aria-hidden="true"', 'aria-hidden="true"') + '<span>Appeler</span></a>'),
    (r'<a id="mWa" class="hide" href="#"', '<a id="mWa" class="" href="https://wa.me/' + WA + '"'),
    # le style de la démo, juste avant </head>
    (r"</head>", DEMO_CSS + "\n</head>"),
]

# Accueil seulement : réglages et sections réécrites (texte exact, contrôlé)
INDEX = [
    ("  brand: 'Jumeo',", "  brand: 'Lux Energie Solution',"),
    ("  phone: '',", "  phone: '" + TEL_DISPLAY + "',"),
    ("  whatsapp: '',", "  whatsapp: '" + WA + "',"),
    ("  email: '',          // ex : 'contact@jumeo.be'", "  email: '" + MAIL + "',"),
    ('<li><svg class="ico"><use href="#i-check"/></svg>Devis gratuit, sans engagement</li>\n        <li><svg class="ico"><use href="#i-check"/></svg>Toute la Wallonie</li>',
     '<li><svg class="ico"><use href="#i-check"/></svg>Entreprise déclarée &amp; assurée</li>\n        <li><svg class="ico"><use href="#i-check"/></svg>Conformité + rapport fourni</li>\n        <li><svg class="ico"><use href="#i-check"/></svg>Basés à Grâce-Hollogne, toute la Wallonie</li>'),
    ('<a class="hero-sim appear" style="--d:.9s" href="/simulateur-peb">',
     '<div class="hero-actions appear" style="--d:.84s"><a class="btn-call" href="' + TEL_LINK + '">' + PHONE_SVG + 'Appeler le ' + TEL_DISPLAY + '</a><a class="btn-wa2" href="https://wa.me/' + WA + '" target="_blank" rel="noopener">' + WA_SVG + 'WhatsApp</a></div>\n      <a class="hero-sim appear" style="--d:.9s" href="/simulateur-peb">'),
    ('<!-- ═════════ TARIFS ═════════ -->', '''<!-- ═════════ POURQUOI NOUS CHOISIR ═════════ -->
<section class="sec" style="padding-bottom:0">
  <div class="wrap">
    <div class="trust4 reveal">
      <div><i><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></i><span><b>Réponse rapide</b><small>On vous rappelle vite, rendez-vous planifié sans attendre.</small></span></div>
      <div><i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5M8 13h8M8 17h5"/></svg></i><span><b>Devis clair</b><small>Un prix connu d'avance, confirmé avant toute intervention.</small></span></div>
      <div><i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg></i><span><b>Travaux conformes</b><small>Conformité, rapports et certificats fournis.</small></span></div>
      <div><i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13a8 8 0 0 1 16 0v4a2 2 0 0 1-2 2h-1v-6h3M4 13v4a2 2 0 0 0 2 2h1v-6H4"/></svg></i><span><b>Suivi sérieux</b><small>Un seul interlocuteur, du diagnostic à la finition.</small></span></div>
    </div>
  </div>
</section>

<!-- ═════════ TARIFS ═════════ -->'''),
    ('<link rel="apple-touch-icon" href="/apple-touch-icon.png" />', '<link rel="apple-touch-icon" href="/apple-touch-icon.png" />\n<script type="application/ld+json">' + json.dumps({"@context": "https://schema.org", "@type": "HomeAndConstructionBusiness", "name": "Lux Energie Solution", "url": DEMO_URL + "/", "logo": DEMO_URL + "/logo-lux.png", "image": DEMO_URL + "/og-image.jpg", "telephone": "+32 466 09 03 84", "email": MAIL, "address": {"@type": "PostalAddress", "streetAddress": "Rue du Pont 6", "postalCode": "4460", "addressLocality": "Grâce-Hollogne", "addressCountry": "BE"}, "areaServed": {"@type": "AdministrativeArea", "name": "Wallonie"}, "description": "Certification PEB, électricité, chauffage et sanitaire, pompes à chaleur, climatisation et photovoltaïque en Wallonie."}, ensure_ascii=False) + '</script>'),
    ("company: { legalName: '', bce: '', address: '', status: 'Structure en cours de création.' },", "company: { legalName: 'Lux Energie Solution', bce: '', address: '" + ADDRESS + "', status: '' },"),
    ("  launch: 'janvier 2027', // bandeau « Lancement officiel en … » en haut de page ; mettre '' le jour du lancement", "  launch: '', // pas de bandeau : entreprise déjà en activité"),
    ("lines.push('<p>' + esc(CONFIG.brand) + ' agit en qualité d\\'apporteur d\\'affaires indépendant. Il n\\'est pas certificateur PEB. Les prestations (certificat PEB, contrôle électrique, travaux) sont réalisées par des partenaires indépendants. Les certificats PEB sont établis exclusivement par un certificateur agréé par la Région wallonne.</p>');",
     "lines.push('<p>Site de démonstration. Les certificats PEB sont établis par un certificateur agréé par la Région wallonne. Prix indicatifs, devis confirmé avant intervention.</p>');"),
    ("PEB, chauffage, électricité, solaire, rénovation : des professionnels compétents, un devis clair, un seul contact. Partout en Wallonie.",
     "Devis clair. Délais tenus. Rapports et certificats fournis. Un seul interlocuteur, du diagnostic à la finition : PEB, électricité, chauffage, photovoltaïque."),
    ("Professionnels agréés Région wallonne", "Certificateur PEB agréé Région wallonne"),
    # section « Qui fait quoi » → « Notre métier »
    ('<span class="eyebrow">Transparence</span>', '<span class="eyebrow">Notre métier</span>'),
    ("<h2>Qui fait quoi ? On vous le dit clairement.</h2>", "<h2>Certifier et installer : deux métiers, une seule entreprise.</h2>"),
    ("<p>En Wallonie, seul un certificateur agréé peut établir un certificat PEB. Voici notre rôle, et le sien.</p>",
     "<p>En Wallonie, seul un certificateur agréé peut établir un certificat PEB. Chez Lux Energie Solution, la certification et les travaux sont réunis : un seul interlocuteur.</p>"),
    ('aria-label="Deux anneaux entrelacés : Jumeo, votre contact, et le professionnel agréé, le garant. Votre dossier est au croisement des deux."',
     'aria-label="Deux anneaux entrelacés : la certification PEB et les installations énergétiques, réunies dans une seule entreprise."'),
    ('<text class="n" x="160" y="158" text-anchor="middle" data-brand>Jumeo</text>', '<text class="n" x="160" y="158" text-anchor="middle">Certifier</text>'),
    ('<text class="r" x="160" y="184" text-anchor="middle">votre contact</text>', '<text class="r" x="160" y="184" text-anchor="middle">le PEB</text>'),
    ('<text class="n" x="400" y="158" text-anchor="middle">Pro agréé</text>', '<text class="n" x="400" y="158" text-anchor="middle">Installer</text>'),
    ('<text class="r" x="400" y="184" text-anchor="middle">le garant</text>', '<text class="r" x="400" y="184" text-anchor="middle">l\'énergie</text>'),
    ('<text class="t" x="292" y="260" text-anchor="middle">Votre dossier</text>', '<text class="t" x="292" y="260" text-anchor="middle">Un seul pro</text>'),
    ('<h3><i aria-hidden="true"></i><span><span data-brand>Jumeo</span>, votre contact</span></h3>', '<h3><i aria-hidden="true"></i>La certification PEB</h3>'),
    ("<li>Reçoit et prépare votre demande</li>", "<li>Visite le bien et réalise les relevés</li>"),
    ("<li>Coordonne le rendez-vous et le suivi</li>", "<li>Établit et signe le certificat PEB</li>"),
    ("<li>Vous met en relation avec le bon professionnel</li>", "<li>Vous explique la feuille de route de rénovation</li>"),
    ("<li>Reste votre point de contact du début à la fin</li>", "<li>Certificateur agréé par la Région wallonne</li>"),
    ("<h3><i aria-hidden=\"true\"></i>Le professionnel agréé, le garant</h3>", "<h3><i aria-hidden=\"true\"></i>Les installations</h3>"),
    ("<li>Visite le bien et réalise les relevés</li>\n          <li>Établit et signe le certificat PEB</li>\n          <li id=\"elecLine\"",
     "<li>Électricité : tableau, mise en conformité, extension</li>\n          <li>Chauffage : installation, entretien, dépannage</li>\n          <li id=\"elecLine\""),
    ("<li>Est agréé par la Région wallonne</li>", "<li>Pompes à chaleur, climatisation et photovoltaïque</li>"),
    ("<p class=\"who-note\"><span data-brand>Jumeo</span> est un apporteur d'affaires indépendant. Nous ne sommes ni certificateur ni installateur : le certificat PEB, le contrôle électrique et les travaux sont réalisés par nos partenaires agréés.</p>",
     "<p class=\"who-note\">Une seule entreprise pour certifier, conseiller et réaliser vos travaux : vous savez toujours à qui vous parlez.</p>"),
    # bloc « À propos »
    ("<h2>Deux frères jumeaux, un seul objectif.</h2>", "<h2>L'énergie de votre logement, de A à Z.</h2>"),
    ("<p>Nés à Seraing, installés à Liège : l'un est comptable et a été agent immobilier, l'autre est électricien et a installé des systèmes d'énergie renouvelable. On a créé <span data-brand>Jumeo</span> pour simplifier vos projets : vous nous parlez, on vous met en relation avec le bon professionnel, et on suit votre dossier jusqu'au bout.</p>",
     "<p>Lux Energie Solution est une entreprise wallonne spécialisée dans l'installation, la maintenance et le dépannage des systèmes de chauffage, d'électricité et de photovoltaïque, et dans la certification PEB. Basés à Grâce-Hollogne, nous intervenons partout en Wallonie. Un seul interlocuteur, du diagnostic à la finition.</p><div class=\"lx-values\"><span>Performance énergétique</span><span>Conformité réglementaire</span><span>Réduction des coûts</span></div>"),
    # photos des tarifs
    ('<article class="price reveal">\n        <h3>Certificat PEB</h3>',
     '<article class="price reveal">\n        ' + ph('peb', 'Certificat PEB tenu en main devant une maison') + '\n        <h3>Certificat PEB</h3>'),
    ('<span class="badge">Le plus demandé</span>\n        <h3>PEB + contrôle électrique</h3>',
     ph('pebelec', 'Tableau électrique avec ses disjoncteurs') + '\n        <span class="badge">Le plus demandé</span>\n        <h3>PEB + contrôle électrique</h3>'),
    ('<article class="price reveal">\n        <h3>Dépannage chauffage &amp; électricité</h3>',
     '<article class="price reveal">\n        ' + ph('depannage', 'Technicien intervenant sur une chaudière murale') + '\n        <h3>Dépannage chauffage &amp; électricité</h3>'),
    # services : la première ligne (chauffage, photovoltaïque, électricité) reçoit les photos, la pompe à chaleur passe en 2e ligne
    ('<div class="s reveal"><span class="icon-disc"><svg class="ico"><use href="#i-flame"/></svg></span><h3>Chauffage</h3>',
     '<div class="s reveal">' + ph('chauffage', 'Chaufferie : chaudière, ballons et collecteurs') + '<span class="icon-disc"><svg class="ico"><use href="#i-flame"/></svg></span><h3>Chauffage</h3>'),
    ('<div class="s reveal"><span class="icon-disc"><svg class="ico"><use href="#i-fan"/></svg></span><h3>Pompe à chaleur &amp; climatisation</h3><p>Étude et installation adaptées à votre logement. Sur devis.</p><a href="#devis" data-pick="pac">Demander une étude <span>→</span></a></div>\n', ''),
    ('<div class="s reveal"><span class="icon-disc"><svg class="ico"><use href="#i-sun"/></svg></span><h3>Panneaux photovoltaïques</h3><p>Étude et installation par un professionnel partenaire. Sur devis.</p>',
     '<div class="s reveal">' + ph('pv', 'Panneaux photovoltaïques sur des toitures, vue du ciel') + '<span class="icon-disc"><svg class="ico"><use href="#i-sun"/></svg></span><h3>Panneaux photovoltaïques</h3><p>Étude et installation adaptées à votre toiture. Sur devis.</p>'),
    ('<div class="s reveal"><span class="icon-disc"><svg class="ico"><use href="#i-bolt"/></svg></span><h3>Électricité</h3><p>Tableau électrique, mise en conformité, extension, plan électrique. Sur devis.</p><a href="#devis" data-pick="elec">Demander un devis <span>→</span></a></div>',
     '<div class="s reveal">' + ph('elec', 'Câblage d&#39;une armoire électrique') + '<span class="icon-disc"><svg class="ico"><use href="#i-bolt"/></svg></span><h3>Électricité</h3><p>Tableau électrique, mise en conformité, extension, plan électrique. Sur devis.</p><a href="#devis" data-pick="elec">Demander un devis <span>→</span></a></div>\n      <div class="s reveal"><span class="icon-disc"><svg class="ico"><use href="#i-fan"/></svg></span><h3>Pompe à chaleur &amp; climatisation</h3><p>Étude et installation adaptées à votre logement. Sur devis.</p><a href="#devis" data-pick="pac">Demander une étude <span>→</span></a></div>'),
]


FOOT_CONTACT = ('<h4>Contact</h4><a href="' + TEL_LINK + '">' + TEL_DISPLAY + '</a><a href="mailto:' + MAIL + '">' + MAIL + '</a>'
                '<a href="https://wa.me/' + WA + '" target="_blank" rel="noopener">WhatsApp</a>')


def apply(path, extra=()):
    s = open(path, encoding='utf-8').read()
    if not extra:  # pages générées : coordonnées (l'accueil les affiche via CONFIG)
        s = s.replace('<h4>Contact</h4>', FOOT_CONTACT, 1)
    if True:  # toutes les pages : présentation + adresse dans le pied de page
        s = s.replace('<p>PEB, électricité, photovoltaïque, rénovation et projets immobiliers en Wallonie.</p>',
                      '<p>PEB, électricité, chauffage, photovoltaïque en Wallonie.</p><p class="addr">' + ADDRESS.replace(', ', '<br>') + '</p>', 1)
    for a, b in extra:
        n = s.count(a)
        if n < 1:
            sys.exit(f'Introuvable dans {path} : {a[:90]}')
        s = s.replace(a, b)
    for pat, rep in REGEX:
        s = re.sub(pat, rep, s)
    open(path, 'w', encoding='utf-8').write(s)


for dirpath, _, files in os.walk(OUT):
    for f in files:
        if f.endswith('.html'):
            p = os.path.join(dirpath, f)
            apply(p, INDEX if p == os.path.join(OUT, 'index.html') else ())

# Fichiers non HTML
for f, pairs in {
    'sitemap.xml': [],
    'robots.txt': [],
    'manifest.webmanifest': [("Jumeo — PEB, énergie et rénovation en Wallonie", "Lux Energie Solution — PEB, électricité, chauffage, photovoltaïque"), ('"short_name": "Jumeo"', '"short_name": "Lux Energie"'),
                             ("un seul contact, des professionnels compétents", "une seule entreprise, du diagnostic à la finition"), ('"#f7f5f0"', '"#ffffff"')],
    'sw.js': [("const CACHE = 'jumeo-v1';", "const CACHE = 'lux-demo-v1';"), ("'/favicon.svg'", "'/favicon.png'"), ("// Service worker Jumeo", "// Service worker démo Lux Energie Solution")],
}.items():
    p = os.path.join(OUT, f)
    s = open(p, encoding='utf-8').read()
    for a, b in pairs:
        assert a in s, (f, a)
        s = s.replace(a, b)
    s = s.replace('https://jumeo.vercel.app', DEMO_URL)
    if f == 'sitemap.xml':
        s = re.sub(r'  <url>\n    <loc>[^<]*/(?:devenir-partenaire|notre-histoire)</loc>\n    <lastmod>[^<]*</lastmod>\n  </url>\n', '', s)
    open(p, 'w', encoding='utf-8').write(s)

# ── 3 bis. Page « Formations » + bouton (menu, pied de page, accueil) ────────
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import demo_lux_formations
demo_lux_formations.build(OUT, DEMO_URL, WA, MAIL)

# ── 4. Contrôle : plus aucune trace du modèle Jumeo ──────────────────────────
FORBIDDEN = ['Jumeo', 'jumeo', 'apporteur', 'jumeaux', 'Seraing, installés', 'devenir-partenaire', 'notre-histoire', 'Rejoignez le réseau', 'rejoignez le réseau', 'Lancement officiel', 'Nos partenaires', 'mise en relation', 'met en relation', 'en cours de création']
problems = []
for dirpath, _, files in os.walk(OUT):
    for f in files:
        if f.endswith(('.html', '.xml', '.txt', '.webmanifest', '.js')):
            p = os.path.join(dirpath, f)
            s = open(p, encoding='utf-8').read()
            for w in FORBIDDEN:
                if w in s:
                    i = s.index(w)
                    problems.append(f'{os.path.relpath(p, OUT)} : « {w} » … {s[max(0, i - 60):i + 60]!r}')
if problems:
    print('\n'.join(problems[:40]))
    sys.exit(f'{len(problems)} trace(s) du modèle Jumeo restent dans la démo')
n = sum(len([f for f in fs if f.endswith('.html')]) for _, _, fs in os.walk(OUT))
print(f'OK : démo Lux Energie Solution générée dans demo-lux/ ({n} pages), aucune trace de Jumeo.')
