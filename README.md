# Wall’PEB

Site de Wall’PEB, le service de Lux Energie Solution dédié au certificat PEB et au contrôle électrique en Wallonie.

- `index.html` : la page d'accueil (HTML/CSS/JS, sans framework). Les réglages (contact, prix, agréments) sont dans le bloc `CONFIG` du script.
- `node build.js` : génère les pages par commune, « Nos zones », le simulateur PEB, les guides et le plan du site.
- Tests : `node tools/test-pages.js`, `BASE="file://$PWD/index.html" node tools/test-site.js`, `node tools/test-simulateur.js`.
- `demo-lux/` : démonstration figée du site Lux Energie Solution (projet Vercel séparé).

Détails et règles : voir `CLAUDE.md`.
