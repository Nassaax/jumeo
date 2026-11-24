# CLAUDE.md : mémoire du projet Wall'PEB (ex-Jumeo)

## Contexte
- **Depuis le 2026-11-24**, ce dépôt est le site **Wall’PEB** : la « filiale » de **Lux Energie Solution** dédiée uniquement au **certificat PEB** et au **contrôle électrique**. Décision de Nasser : on ne poursuit pas Jumeo tel quel et on ne fait pas de site Lux complet.
- Nasser (amateur : pas de jargon, tu fais les manipulations à sa place, tutoiement ; vouvoiement sur le site). Avant chaque commit ou push, lui dire en une phrase ce qui change.
- **Exploitant** : Lux Energie Solution (mentions légales, données, facturation). Adresse publique : Rue du Pont 6, 4460 Grâce-Hollogne. BCE : à compléter.
- **Contact** : contact **dédié** à Wall’PEB (téléphone, WhatsApp, e-mail) à fournir par Lux → `CONFIG.phone/whatsapp/email` dans `index.html`. Vides = formulaire en mode aperçu. Ne pas y mettre le 0466 de Lux sans accord.
- **Agréments** : Lux est certificateur PEB agréé et (selon Nasser) organisme agréé pour le contrôle électrique. Numéros à fournir → `CONFIG.agrements.peb / .elec` (affichés seulement s'ils sont remplis). `CONFIG.nouveauFormat` = true quand Lux confirme la formation au nouveau certificat.
- **Prix** : PEB 250 € TVAC, PEB + contrôle électrique 300 € TVAC (forfaits indicatifs), contrôle électrique seul « sur devis ».
- **Lien vers Lux** : cadre « Une entreprise Lux Energie Solution » au-dessus du pied de page de toutes les pages (`tools/partners-part.js`, données `CONFIG.group`), bloc « Une entreprise de terrain » sur l'accueil, FAQ, menu mobile et pied de page → https://www.luxenergiesolution.com (le vrai site, pas la démo). C'est seulement un rappel que Lux existe pour ses autres métiers.
- Ancien Jumeo : sources complètes au commit `8babd68` (apporteur d'affaires, jumeaux, partenaires…). Les fichiers `data/` (business.json, partenaires.json, a-completer.md, strategie.md) et `tools/make-logo.js`, `tools/logo-board.html`, `brand/jumeo-*` datent de Jumeo. `data/regles-peb.md` reste la référence des règles PEB vérifiées.

## Règles à respecter (non négociables)
1. N'afficher un numéro d'agrément que s'il est fourni par Lux. Pas de logo officiel de la Région wallonne, pas de faux label. Le nom « Wall’PEB » ne doit jamais laisser croire à un site officiel de la Région (d'où le refus de « PEB Wallonie »).
2. Pas de faux avis, fausse note, faux compteur, ni photo de stock présentée comme réalisation.
3. Prix toujours « indicatifs, devis confirmé avant intervention », TVAC.
4. RGPD : consentement explicite sur le formulaire, aucune donnée vendue, responsable du traitement = Lux Energie Solution.
5. PEB neuf (responsable PEB) et audit logement : ne pas les proposer tant que Lux n'a pas confirmé ces agréments.
6. Chaque affirmation PEB/légale doit être ✅ dans `data/regles-peb.md` et sourcée (guides).
7. Contrat ou document juridique : jamais « définitif » sans dire à Nasser de le faire relire par un juriste ou un comptable. Pas de conseil comptable ou fiscal sur le site.

## Identité visuelle (« famille Lux »)
- Logo : maison (toit) dont l'intérieur est l'étiquette PEB (3 barres en flèche, la plus courte en jaune). Mot « Wall’PEB » vectorisé, apostrophe jaune. Généré par `tools/make-logo-wallpeb.js` (police Plus Jakarta Sans ExtraBold + opentype.js, voir l'en-tête du fichier) → `brand/wallpeb-*.svg`, `brand/wallpeb-word.json`, `favicon.svg` ; PNG, icônes, og-image par `node tools/make-images.js` (`tools/og-image.html`).
- Couleurs : encre `#0b2441`, accent jaune Lux `#f2b705` (`--accent-d:#d99e00`), fond papier `#f7f5f0`. Boutons jaunes avec texte encre. Pas de jaune pour du petit texte sur fond clair.
- Écran d'ouverture (`tools/app-part.js`, `splash`) : le toit se dessine, les barres glissent dans la maison (la jaune en dernier), petit battement, puis le mot et la phrase « Certificat PEB et contrôle électrique, en un seul rendez-vous. ». Une fois par visite (sessionStorage `wallpeb-intro`), jamais en animations réduites. Les tests le sautent.
- Section signature « Deux contrôles, un seul rendez-vous » (`#services`) : deux anneaux qui se dessinent au défilement (PEB / Contrôle électrique).
- Pas de vidéo ni de photo d'ambiance. Icônes SVG inline, jamais d'emoji.

## Structure du site
- `index.html` (écrit à la main, bloc `CONFIG` + `SERVICES` : peb, pebelec, elec, autre ; une tuile par clé). Sections : formulaire de devis en 2 étapes, tarifs, simulateur (encart), étapes, nos services, documents, professionnels, Lux, guides, FAQ.
- `node build.js` génère : `certificat-peb/<commune>.html` (data/communes.json), `certificat-peb/index.html`, `simulateur-peb.html` (`tools/simulateur-part.js`), `guides/` (`contenu/guides.js` via `tools/guides-part.js` : 4 articles PEB / contrôle électrique), la liste des zones, les marqueurs de `index.html` (`ZONES`, `GUIDES`, `APP:*`, `LAUNCH`, `PARTNERS`, `CREDIT`) et `sitemap.xml`. Il supprime aussi les anciennes pages Jumeo (devenir-partenaire, notre-histoire, simulateur-recharge, guides hors sujet), redirigées dans `vercel.json`.
- **Après toute modification de CONFIG, de `data/communes.json` ou de `contenu/guides.js` : `node build.js`.** Ne jamais modifier les pages générées à la main.
- Appli mobile (≤ 760 px) : onglets Accueil · Guides · **Devis** · Simulateur · Menu ; panneau Menu avec lien Lux. PWA : `manifest.webmanifest`, `sw.js` (cache `wallpeb-v1`), `icons/`.
- Mention « Site réalisé par NY Visuals » + logo NY en bas de page : `tools/credit-part.js` (nom provisoire ; le site Lalla affiche « Nayas Visuals », à harmoniser quand Nasser tranche).
- Simulateur PEB : 7 questions → fourchette A–G indicative, jamais présentée comme un label, avertissement visible. Le résultat pré-remplit le devis (`/?commune=…&sim=C-D#devis`).

## Tests et mise en ligne
- Tests : `node tools/test-pages.js` (pages générées, ordinateur + 390 px, mots interdits « Jumeo », « apporteur »…), `BASE="file://$PWD/index.html" node tools/test-site.js` (accueil, formulaire), `node tools/test-simulateur.js`.
- Avant de livrer : aucune erreur console, pas de défilement horizontal à 390 px, tous les `id` utilisés par le JS existent, tous les `data-pick` ont une entrée dans `SERVICES`.
- Hébergement : projet Vercel **`wallpeb`** (ex-`jumeo`, renommé le 2026-11-24, id `prj_H6crDnIHQcObrNuRty7ZFxC7vGgF`), branche `claude/eager-knuth-5khb6w`. Adresse : `https://wallpeb.vercel.app` (`SITE` dans `build.js`, balises de `index.html`, `robots.txt`) ; l'ancienne adresse `jumeo.vercel.app` affiche le même site. Mode test : `vercel.json` envoie `noindex` tant que contact dédié, BCE et agréments manquent ; à retirer au lancement avec le vrai domaine (ex. wallpeb.be, à vérifier).
- `.vercelignore` exclut `data/`, `tools/`, `prive/`, `contenu/`, `build.js`, les `.md`.

## Démo « Lux Energie Solution » (demo-lux/) — FIGÉE
- Site de démonstration complet pour Lux, en ligne sur le projet Vercel séparé `lux-energie-demo` (https://lux-energie-demo.vercel.app, dossier racine `demo-lux`). Conservé tel quel à la demande de Nasser.
- Il était généré depuis les sources Jumeo par `python3 tools/make_demo_lux.py` (+ `demo_lux_images.py`, `demo_lux_formations.py`, photos dans `tools/demo-lux-photos/`). Ce script refuse maintenant de tourner (les sources ne sont plus Jumeo) : pour une modification, repartir du commit `8babd68` dans un dossier séparé (git worktree), y lancer le script, puis copier le `demo-lux/` obtenu. Ne pas modifier `demo-lux/` à la main.
- Contenu : coordonnées publiques de Lux (0466 09 03 84, contact@luxenergiesolution.com), page Formations, photos des services, pas de mention « Site réalisé par ». Le site principal redirige `/demo-lux/…` vers l'accueil ; ne pas exclure `demo-lux/` dans `.vercelignore`.

## À demander à Nasser / Lux
- Contact dédié Wall’PEB (téléphone, WhatsApp, e-mail), BCE de Lux, numéros d'agrément PEB et contrôle électrique, nom de domaine définitif, confirmation de la formation au nouveau certificat, logo HD de Lux.
