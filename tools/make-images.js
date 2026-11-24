// Génère og-image.png (1200×630) et apple-touch-icon.png (180×180).
// Usage : node tools/make-images.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const root = path.join(__dirname, '..');
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.goto('file://' + path.join(__dirname, 'og-image.html'));
  await p.waitForLoadState('networkidle'); await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: path.join(root, 'og-image.jpg'), type: 'jpeg', quality: 88 });
  const i = await b.newPage({ viewport: { width: 180, height: 180 } });
  await i.setContent('<body style="margin:0;background:#fff;display:grid;place-items:center;height:180px"><svg width="150" height="150" viewBox="0 0 64 64"><path d="M7 29 32 8l25 21" fill="none" stroke="#0b2441" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 27h16l4.5 4-4.5 4H15z" fill="#f2b705"/><path d="M15 38h24l4.5 4-4.5 4H15z" fill="#0b2441"/><path d="M15 49h32l4.5 4-4.5 4H15z" fill="#0b2441"/></svg></body>');
  await i.screenshot({ path: path.join(root, 'apple-touch-icon.png') });
  await b.close();
  console.log('OK : og-image.jpg + apple-touch-icon.png');
})();

// Logos en PNG à fond transparent (cartes de visite, flyers, réseaux sociaux).
(async () => {
  const fs = require('fs');
  const dir = path.join(__dirname, '..', 'brand');
  const b = await chromium.launch();
  for (const [f, w] of [['wallpeb-logo', 1600], ['wallpeb-logo-blanc', 1600], ['wallpeb-symbole', 1024], ['wallpeb-symbole-blanc', 1024]]) {
    const svg = fs.readFileSync(path.join(dir, f + '.svg'), 'utf8');
    const [, , vw, vh] = svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
    const h = Math.round(w * vh / vw);
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.setContent(`<body style="margin:0">${svg.replace('<svg ', `<svg width="${w}" height="${h}" `)}</body>`);
    await p.screenshot({ path: path.join(dir, f + '.png'), omitBackground: true });
  }
  await b.close();
  console.log('OK : logos PNG dans brand/');
})();

// Icônes de l'application (écran d'accueil du téléphone) : icons/icon-192, icon-512, maskable-512.
(async () => {
  const fs = require('fs');
  const dir = path.join(__dirname, '..', 'icons');
  fs.mkdirSync(dir, { recursive: true });
  const sym = (c) => fs.readFileSync(path.join(__dirname, '..', 'brand', c === '#ffffff' ? 'wallpeb-symbole-blanc.svg' : 'wallpeb-symbole.svg'), 'utf8').replace(/^[\s\S]*?<\/title>|<\/svg>\s*$/g, '');
  const b = await chromium.launch();
  for (const [f, size, bg, a, scale] of [['icon-192', 192, '#ffffff', '#0b2441', .78], ['icon-512', 512, '#ffffff', '#0b2441', .78], ['maskable-512', 512, '#0b2441', '#ffffff', .58]]) {
    const p = await b.newPage({ viewport: { width: size, height: size } });
    const s = Math.round(size * scale);
    await p.setContent(`<body style="margin:0;background:${bg};display:grid;place-items:center;width:${size}px;height:${size}px"><svg width="${s}" height="${s}" viewBox="0 0 64 64">${sym(a)}</svg></body>`);
    await p.screenshot({ path: path.join(dir, f + '.png') });
  }
  await b.close();
  console.log('OK : icônes dans icons/');
})();
