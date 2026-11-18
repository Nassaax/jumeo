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
  await i.setContent('<body style="margin:0;background:#fff;display:grid;place-items:center;height:180px"><svg width="150" height="150" viewBox="0 0 64 64"><path d="M7 28L22 11L37 28V54H7Z" fill="#12355b"/><path d="M27 28L42 11L57 28V54H27Z" fill="#ff7a45"/><path d="M27 28L32 22.333L37 28V54H27Z" fill="#c4503a"/></svg></body>');
  await i.screenshot({ path: path.join(root, 'apple-touch-icon.png') });
  await b.close();
  console.log('OK : og-image.jpg + apple-touch-icon.png');
})();

// Logos en PNG à fond transparent (cartes de visite, flyers, réseaux sociaux).
(async () => {
  const fs = require('fs');
  const dir = path.join(__dirname, '..', 'brand');
  const b = await chromium.launch();
  for (const [f, w] of [['jumeo-logo', 1600], ['jumeo-logo-blanc', 1600], ['jumeo-symbole', 1024], ['jumeo-symbole-blanc', 1024]]) {
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
