# Jumeo

Site vitrine de Jumeo, apporteur d'affaires indépendant (PEB, électricité, photovoltaïque, rénovation) en Wallonie.

- `index.html` : le site complet (HTML/CSS/JS, sans framework). Les réglages sont dans le bloc `CONFIG` du script.
- `brand/` : le logo (versions couleur et blanche, SVG et PNG transparent) pour cartes de visite, flyers, réseaux.
- `favicon.svg`, `apple-touch-icon.png`, `og-image.jpg` : icônes et image de partage.
- `robots.txt`, `sitemap.xml`, `vercel.json` : référencement et hébergement (Vercel).
- `certificat-peb/`, `devenir-partenaire.html` : pages générées par `node build.js` (ne pas modifier à la main).
- `data/` : données de travail (non mises en ligne), dont `communes.json` pour les pages locales.
- `tools/` : petits scripts (images de partage, test navigateur).

Mise en ligne : chaque `git push` sur la branche de production est publié automatiquement par Vercel.
