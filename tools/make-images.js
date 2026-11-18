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
  await i.setContent('<body style="margin:0;background:#fff;display:grid;place-items:center;height:180px"><svg width="150" height="150" viewBox="0 0 64 64"><circle cx="24" cy="32" r="18" fill="#12355b"/><circle cx="40" cy="32" r="18" fill="#ff7a45" fill-opacity=".9"/></svg></body>');
  await i.screenshot({ path: path.join(root, 'apple-touch-icon.png') });
  await b.close();
  console.log('OK : og-image.jpg + apple-touch-icon.png');
})();
