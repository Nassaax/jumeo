# CLAUDE.md : mémoire du projet Jumeo

## Contexte
- Marque : **Jumeo**. Logo choisi par Nasser : piste 3 « Le lien », deux anneaux entrelacés (client et professionnel reliés), bleu marine `#12355b` + orange `#ff7a45` (sur fond foncé : blanc + orange). Fichiers dans `brand/` (SVG + PNG transparents), générés par `tools/make-logo.js` puis `tools/make-images.js`. Écartés : deux cercles, maisons jumelles ; noms DuoHabitat, Unisson Immo.
- Modèle : **apporteur d'affaires multi-partenaires**. Jumeo reçoit les demandes, coordonne et facture sa commission au partenaire. Jumeo ne réalise aucune prestation.
- Fondateurs : Nasser et son frère jumeau. Nasser est amateur : pas de jargon, tu fais les manipulations à sa place.
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
