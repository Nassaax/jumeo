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
    # le style de la démo, juste avant </head>
    (r"</head>", DEMO_CSS + "\n</head>"),
]

# Accueil seulement : réglages et sections réécrites (texte exact, contrôlé)
INDEX = [
    ("  brand: 'Jumeo',", "  brand: 'Lux Energie Solution',"),
    ("company: { legalName: '', bce: '', address: '', status: 'Structure en cours de création.' },", "company: { legalName: 'Lux Energie Solution', bce: '', address: '', status: '' },"),
    ("  launch: 'janvier 2027', // bandeau « Lancement officiel en … » en haut de page ; mettre '' le jour du lancement", "  launch: '', // pas de bandeau : entreprise déjà en activité"),
    ("lines.push('<p>' + esc(CONFIG.brand) + ' agit en qualité d\\'apporteur d\\'affaires indépendant. Il n\\'est pas certificateur PEB. Les prestations (certificat PEB, contrôle électrique, travaux) sont réalisées par des partenaires indépendants. Les certificats PEB sont établis exclusivement par un certificateur agréé par la Région wallonne.</p>');",
     "lines.push('<p>Site de démonstration. Les certificats PEB sont établis par un certificateur agréé par la Région wallonne. Prix indicatifs, devis confirmé avant intervention.</p>');"),
    ("PEB, chauffage, électricité, solaire, rénovation : des professionnels compétents, un devis clair, un seul contact. Partout en Wallonie.",
     "PEB, électricité, chauffage, photovoltaïque : une seule entreprise, du diagnostic à la finition. Un devis clair, partout en Wallonie."),
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
     "<p>Lux Energie Solution est une entreprise wallonne spécialisée dans l'installation, la maintenance et le dépannage des systèmes de chauffage, d'électricité et de photovoltaïque, et dans la certification PEB. Un seul interlocuteur, du diagnostic à la finition.</p>"),
]


def apply(path, extra=()):
    s = open(path, encoding='utf-8').read()
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
