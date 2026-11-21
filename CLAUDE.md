# CLAUDE.md : mémoire du projet Jumeo

## Contexte
- Marque : **Jumeo**. Logo choisi par Nasser : piste 3 « Le lien », deux anneaux entrelacés (client et professionnel reliés), bleu marine `#12355b` + orange `#ff7a45` (sur fond foncé : blanc + orange). Fichiers dans `brand/` (SVG + PNG transparents), générés par `tools/make-logo.js` puis `tools/make-images.js`. Écartés : deux cercles, maisons jumelles ; noms DuoHabitat, Unisson Immo.
- Modèle : **apporteur d'affaires multi-partenaires**. Jumeo reçoit les demandes, coordonne et facture sa commission au partenaire. Jumeo ne réalise aucune prestation.
- Fondateurs : Nasser et son frère jumeau. Nasser est amateur : pas de jargon, tu fais les manipulations à sa place.
- Parcours (validé par Nasser le 18/11/2026, **sans prénoms ni photos pour l'instant**, signature « l'équipe Jumeo ») : grandis à Seraing, vivent à Liège. Nasser : comptable, ex-fiduciaire (entrepreneurs, indépendants), aujourd'hui dans le payroll, ancienne expérience d'agent immobilier ; forces : rigueur, administratif, numérique, réseaux sociaux. Son jumeau : électricien, installation d'énergie renouvelable, facility management ; forces : négociation, relation client, performance des biens. **Le jumeau ne fait pas de chantier** : toutes les installations sont réalisées par les partenaires du réseau. Jumeo = mise en relation (+ peut-être de l'administratif, non confirmé). Ne jamais inventer de durée d'expérience ni de chiffres. Jumeo ne donne pas de conseil comptable ou fiscal.
- Page `/notre-histoire` générée par `tools/histoire-part.js`. Menu ordinateur : Tarifs · Guides / Simulateurs · Nos zones · Professionnels · Devenir partenaire.
- Cibles : particuliers (vente, location, rénovation) et professionnels (agences, notaires, promoteurs, investisseurs). Zone : province de Liège puis toute la Wallonie.
- Stack : HTML/CSS/JS vanilla en fichier unique, Google Fonts, `<details>` pour la FAQ, `<dialog>` pour les fenêtres, aucun cookie ni suivi. Déploiement GitHub → Vercel.
- Formulaire sans serveur : `wa.me` → `mailto:` → aperçu du message.

## Règles légales à respecter (non négociables)
1. **Jamais** laisser croire que Jumeo est certificateur, installateur ou organisme agréé. Dire « apporteur d'affaires indépendant » dans le pied de page, les mentions légales et la section « Qui fait quoi ? ».
2. N'afficher un agrément (nom, numéro) que s'il est fourni par le partenaire. Pas de logo officiel de la Région wallonne, pas de faux label.
3. Pas de faux avis, fausse note, faux compteur « X clients », ni photo de stock présentée comme réalisation. Avis uniquement réels et vérifiables.
4. Prix toujours « indicatifs, devis confirmé avant intervention ». Préciser TTC/HTVA dès que c'est connu.
5. **Ne pas publier le téléphone ni l'e-mail du partenaire** : tout passe par les coordonnées de Jumeo (sinon on perd la commission). Les coordonnées de Lux sont dans `data/partenaires.json` en champ privé.
6. **RGPD** : formulaire avec consentement explicite, aucune donnée vendue, finalité claire. Démarchage B2C par e-mail/SMS interdit sans opt-in. B2B (agences, notaires) possible avec désinscription simple.
7. Le neuf (responsable PEB) et l'audit logement relèvent d'autres agréments : ne pas promettre ces prestations tant que le partenaire n'a pas confirmé ses agréments.
8. Un contrat écrit avec chaque partenaire est nécessaire (commission, responsabilité, facturation). Ne jamais en rédiger de version « définitive » sans dire à Nasser de la faire relire par un juriste ou un comptable.

## Style de contenu
- Court, concret, rassurant, sans jargon. Pas de promesse de résultat (« label garanti »).
- Les titres promettent un bénéfice (« Votre certificat PEB, sans prise de tête »).
- Un seul appel à l'action principal par section : « Devis gratuit ».

## Qualité
- Avant de livrer : JS valide, aucune erreur console, mobile 390 px sans défilement horizontal, tous les `id` utilisés par le JS existent, tous les `data-pick` ont une entrée dans `SERVICES`.
- Accessibilité de base : focus visible, labels sur les champs, contraste suffisant, `prefers-reduced-motion` respecté.

## Données
- `data/business.json` : marque, prix, services, coordonnées de Jumeo (vides = à compléter).
- `data/partenaires.json` : réseau de partenaires (Lux Energie Solution en premier).
- `data/regles-peb.md` : règles PEB wallonnes avec leur niveau de confiance.
- `data/strategie.md` : pistes pour augmenter les prospects.
- `data/a-completer.md` : informations manquantes à demander à Nasser.

## Dépôt et mise en ligne
- Le dépôt GitHub `Nassaax/jumeo` est **public** : rien de confidentiel dedans. Les coordonnées privées des partenaires, l'état des contrats, la stratégie et la liste « à compléter » sont dans `prive/` (ignoré par git, à garder en local). Si le dépôt passe en privé, on pourra les y remettre.
- `.vercelignore` empêche la mise en ligne de `data/`, `tools/`, `prive/` et des fichiers `.md`.
- **Mode test** : `vercel.json` envoie `X-Robots-Tag: noindex` tant que les infos bloquantes (coordonnées Jumeo, identité légale) manquent. À retirer le jour du lancement officiel, avec le remplacement de l'adresse provisoire `https://jumeo.vercel.app` par le vrai domaine dans `sitemap.xml`, `robots.txt` et les balises `canonical`, `og:url` et `og:image` de `index.html`.
- Tests : `node tools/test-site.js` (variable `BASE` = URL ou `file://…/index.html`). Images : `node tools/make-images.js`.
- Contrôle électrique : la ligne « réalisé par le partenaire » ne s'affiche que si `controleElec.organisme` et `controleElec.numero` sont remplis dans `CONFIG`.

## Design (refonte du 2026-11-18, skill motionsites)
- Fiche complète : `tools/design-spec.md`. Signature : le schéma « Le lien » dans « Qui fait quoi ? » (deux anneaux qui se dessinent au défilement : Jumeo ↔ professionnel agréé, « Votre dossier » au croisement).
- Couleurs : fond papier `#f7f5f0`, encre `#0b2441`, accent orange `#ff7a45` réservé aux CTA, aux puces et à l'anneau. Boutons orange avec texte encre (contraste suffisant, pas de texte blanc sur orange). Pas d'orange pour du petit texte sur fond clair.
- Pas de vidéo ni de photo d'ambiance (règle 3 + aucun suivi). Icônes en SVG inline, jamais d'emoji.
- Captures de relecture : `node tools/shoot.js <dossier>` (ordinateur, mobile, première image, section « le lien », page entière).

## Pages générées (build.js)
- `node build.js` génère `certificat-peb/<commune>.html` (une page par commune de `data/communes.json`), `certificat-peb/index.html` (« Nos zones »), `devenir-partenaire.html`, la liste des zones dans le pied de page de `index.html` (entre les marqueurs `ZONES:START/END`) et `sitemap.xml`.
- Les réglages (coordonnées, prix, TVA) sont lus dans le bloc `CONFIG` de `index.html` : **après toute modification de CONFIG ou de `data/communes.json`, relancer `node build.js`** puis `node tools/test-pages.js`.
- Ne jamais modifier les pages générées à la main. Pour ajouter une commune : une entrée dans `data/communes.json` avec des textes propres (intro, bâti, conseil), jamais copiés d'une autre.
- Les pages communes renvoient vers `/?commune=<Nom>#devis` (commune pré-remplie). Les liens `/#mentions-legales` et `/#confidentialite` ouvrent les fenêtres légales de l'accueil.
- Page partenaire : formulaire candidature (métier, zone, agréments, RC pro, BCE, site) → WhatsApp / e-mail / aperçu, comme le formulaire client. Aucune commission affichée.
- Au lancement sur jumeo.be : changer `SITE` en haut de `build.js`, puis relancer.

## Simulateur PEB (/simulateur-peb)
- Code : `tools/simulateur-part.js` (questions, coefficients, conseils), assemblé par `build.js`. Test : `node tools/test-simulateur.js` (5 profils de biens).
- 7 questions → fourchette de label A–G (±20 %), jamais de chiffre en kWh affiché. Avertissement « ce n'est pas un certificat » visible avant et avec le résultat. Aucune donnée enregistrée.
- Le bouton du résultat ouvre `/?commune=…&sim=C-D#devis` : l'accueil pré-remplit la commune, le service « Certificat PEB » et le message « Estimation du simulateur : entre C et D (indicatif) ».
- Les coefficients sont des ordres de grandeur, pas une méthode officielle : ne jamais présenter le résultat comme un label, ni promettre un gain de label.

## Guides (articles)
- Articles dans `contenu/guides.js` (titre, `seo` facultatif ≤ 60 car., date, étiquette, chapô, corps HTML, sources). Rendu par `tools/guides-part.js` via `node build.js` : `/guides/<slug>`, page `/guides`, 3 derniers articles sur l'accueil (marqueurs `GUIDES:START/END`).
- Chaque affirmation PEB/légale doit être ✅ dans `data/regles-peb.md` et sourcée en bas d'article. Signature actuelle : « l'équipe Jumeo » (en attente des infos sur Nasser et son frère).

## Simulateur de recharge (/simulateur-recharge)
- Code : `tools/recharge-part.js`, assemblé par `build.js`. Test : `node tools/test-recharge.js` (valeurs calculées à la main).
- Calcul physique : énergie ÷ min(puissance borne, limite voiture), pertes 10 %, 20→80 % pour la « charge complète ». Le prix du kWh est saisi par le visiteur (0,30 € = exemple à remplacer, jamais présenté comme un tarif officiel). Part solaire comptée gratuite (dit sur la page).
- Proposé dans l'encadré des articles qui ont `sim: 'recharge'` (borne de recharge), et dans le pied de page.

## Application mobile (≤ 760 px) et site installable
- Module commun `tools/app-part.js` (CSS, barre d'onglets, panneau « Menu », JS, balises head) : inséré par `build.js` dans toutes les pages générées, et dans `index.html` entre les marqueurs `APP:HEAD`, `APP:CSS`, `APP:HTML`, `APP:JS` (ne pas modifier à la main, relancer `node build.js`).
- Onglets : Accueil · Guides · **Devis** (bouton orange central) · Simus (`/guides#simulateurs`) · Menu (panneau du bas : tarifs, zones, qui fait quoi, pros, partenaire, histoire, FAQ, simulateurs, mentions, confidentialité, WhatsApp si configuré). L'onglet actif et le titre de la barre du haut sont déduits de l'adresse (`appInfo` dans `build.js`). La barre se cache quand le clavier est ouvert.
- Installable (PWA) : `manifest.webmanifest`, icônes `icons/` (générées par `tools/make-images.js`), `sw.js` (réseau d'abord, copie hors ligne des pages visitées, aucune donnée personnelle ; mentionné dans la confidentialité). Changer `CACHE` dans `sw.js` si la stratégie change.
- Captures « appli » : `node tools/shoot-app.js <dossier>` (iPhone 13).

## Accueil : formulaire en 2 étapes, services, partenaires, lancement
- Formulaire de devis : étape 1 = profil + **tuiles de services** (radios `name="service"`, une par clé de `SERVICES`) + prix indicatif ; étape 2 = commune, coordonnées, consentement. Sans JS, tout reste visible. `data-pick` ouvre directement l'étape 2.
- `SERVICES` (index.html) : peb, pebelec, chauffage, pac, pv, elec, ventilation, borne, depannage, reno, autre (services élargis d'après le site de Lux). Ajouter une clé = ajouter aussi sa tuile.
- Cadre « Ils nous font confiance, on leur fait confiance » au-dessus du pied de page de toutes les pages : `tools/partners-part.js`, généré depuis `CONFIG.partners` (`logo`, `officiel`, `metiers`). Jamais de téléphone, d'e-mail ni de lien vers le site du partenaire. Logo dans `partenaires/`.
- Bandeau « Lancement officiel en … » : `CONFIG.launch` (`'janvier 2027'`) ; le vider le jour du lancement puis `node build.js`. Il se replie au défilement. Ne pas écrire que des devis sont réalisés avant le lancement.
- Tests en local (`file://`) : les adresses `/…` sont redirigées vers le projet par `mapRoot` dans les scripts de test.

## Mention « Site réalisé par » (bas de page)
- « Site réalisé par NY Visuals » (studio web de Nasser, nom provisoire) sous la ligne légale de toutes les pages : `tools/credit-part.js` (`STUDIO`, `LOGO` = pastille ronde « NY » fournie par Nasser le 2026-11-21, dans `studio/` en 96 px et 512 px, `URL` vide tant que le site du studio n'est pas en ligne). Attention : le site Lalla affiche « Nayas Visuals » ; nom définitif à confirmer par Nasser, inséré par `build.js` (pages générées + marqueurs `CREDIT` dans `index.html`). Changer le nom, ajouter le logo ou le lien : modifier ce fichier puis `node build.js`.
- Pas dans la démo Lux (choix de Nasser, 2026-11-21) : retirée par `make_demo_lux.py`.

## Écran d'ouverture (effet « waw »)
- Dans `tools/app-part.js` (`splash`, `splashCss`, `splashJs`, `introHead`) : les deux anneaux arrivent chacun d'un côté en se dessinant, se rejoignent, s'entrelacent (petit battement), puis le mot « Jumeo » (tracé repris de `brand/jumeo-logo-blanc.svg`) et la phrase « Vous. Le bon professionnel. Un seul lien. ». Durée ≈ 2,9 s, clic pour passer.
- Une seule fois par visite (sessionStorage `jumeo-intro`), jamais si l'appareil demande des animations réduites, jamais sans JavaScript. Le contenu de la page entre en scène juste après (`html.intro …` décale les animations).
- Inséré sur toutes les pages (pages générées + `index.html`, marqueur `APP:SPLASH`). Les tests le sautent (`addInitScript` dans `mapRoot`).

## Démo « Lux Energie Solution » (demo-lux/)
- Site complet de démonstration pour le partenaire, généré par `python3 tools/make_demo_lux.py` (relance `node build.js`, copie le site, remplace marque/logo/couleurs jaunes, réécrit les textes « apporteur d'affaires » en « entreprise qui réalise », retire partenaires, devenir partenaire, notre histoire, bandeau de lancement — Lux est déjà en activité). Le script échoue s'il reste une trace de Jumeo. Test : `node tools/test-demo-lux.js`.
- Coordonnées PUBLIQUES de Lux (lues sur luxenergiesolution.com, demandé par Nasser le 2026-11-18) : 0466 09 03 84 (appel + WhatsApp), contact@luxenergiesolution.com, Rue du Pont 6, 4460 Grâce-Hollogne. Boutons Appeler/WhatsApp (en-tête et accueil), formulaire envoyé sur son WhatsApp, fiche LocalBusiness. Uniquement dans la démo : jamais sur le site Jumeo (règle 5). noindex. Publié comme projet Vercel séparé `lux-energie-demo` (dossier racine `demo-lux`, https://lux-energie-demo.vercel.app). Le site Jumeo redirige `/demo-lux/…` vers l'accueil (`vercel.json`) ; ne pas exclure `demo-lux/` dans `.vercelignore` (sinon la démo est vide).
- Photos des services (fournies par Nasser le 2026-11-18, reprises du site de Lux) : sources dans `tools/demo-lux-photos/`, recadrées par le script dans `demo-lux/photos/` (PEB, PEB + contrôle élec, dépannage dans les tarifs ; chauffage, photovoltaïque, électricité dans les services). Illustrations seulement, jamais présentées comme « réalisations ». Uniquement dans la démo : le site Jumeo reste sans photo d'ambiance.
- Page « Formations » (`/formations`, demandée par Lux le 2026-11-18) : `tools/demo_lux_formations.py`, appelé par `make_demo_lux.py`. Domaines PEB, électricité, photovoltaïque, chauffage / PAC ; public particuliers, pros de l'immobilier, artisans / techniciens ; formulaire « Je suis intéressé » → WhatsApp de Lux (e-mail en secours). Pas de dates, durées ni prix tant que Lux ne les donne pas. Mention obligatoire : ne remplace pas la formation officielle de certificateur PEB, ne donne pas d'agrément. Accès : lien « Formations » (point jaune) dans le menu ordinateur, onglet « Formations » dans la barre du bas sur mobile (à la place de « Appeler », le numéro étant déjà en haut), panneau Menu, pied de page, tuile bleu nuit « Formations » sous les tuiles de services du formulaire d'accueil (lien, pas un service du devis), et encart sur l'accueil. Le titre de page dans la barre du haut mobile est masqué dans la démo (coupé à cause du bouton du numéro).
- Ne jamais modifier `demo-lux/` à la main : changer le site Jumeo ou le script, puis régénérer.
