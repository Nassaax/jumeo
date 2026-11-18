// Génère les fichiers du logo Jumeo (piste « maisons jumelles ») dans brand/
// + favicon.svg à la racine. Le mot « Jumeo » est vectorisé (pas besoin de la police pour l'afficher).
// Prérequis : npm i opentype.js@1.3.4 et la police Plus Jakarta Sans ExtraBold (.ttf)
// Usage : FONT=/chemin/pjs800.ttf NODE_PATH=/chemin/node_modules node tools/make-logo.js
const fs = require('fs');
const path = require('path');
const opentype = require('opentype.js');

const root = path.join(__dirname, '..');
const out = path.join(root, 'brand');
fs.mkdirSync(out, { recursive: true });

const C = { navy: '#12355b', orange: '#ff7a45', midLight: '#c4503a', midDark: '#ffc2a6', white: '#ffffff' };

// Symbole : deux maisons qui se chevauchent. La zone commune est calculée (pas de clipPath),
// pour pouvoir répéter le logo plusieurs fois dans une page sans conflit d'id.
const HOUSE_A = 'M7 28L22 11L37 28V54H7Z';
const HOUSE_B = 'M27 28L42 11L57 28V54H27Z';
const OVERLAP = 'M27 28L32 22.333L37 28V54H27Z';
const mark = (a, b, mid) =>
  `<path d="${HOUSE_A}" fill="${a}"/><path d="${HOUSE_B}" fill="${b}"/><path d="${OVERLAP}" fill="${mid}"/>`;

// Mot « Jumeo » vectorisé, ligne de base alignée sur le bas des maisons.
const font = opentype.parse(fs.readFileSync(process.env.FONT).buffer);
const capH = font.tables.os2.sCapHeight / font.unitsPerEm;
const size = 43 / capH;                 // majuscule « J » = hauteur des maisons (43 unités)
const tracking = -0.035 * size;         // même resserrement que sur le site
let x = 70;
const glyphs = font.stringToGlyphs('Jumeo');
const parts = [];
glyphs.forEach((g, i) => {
  parts.push(g.getPath(x, 54, size).toPathData(2));
  x += g.advanceWidth / font.unitsPerEm * size + tracking;
  if (glyphs[i + 1]) x += font.getKerningValue(g, glyphs[i + 1]) / font.unitsPerEm * size;
});
const wordD = parts.join('');
const textBox = font.getPath('Jumeo', 70, 54, size).getBoundingBox();
const right = Math.ceil(Math.max(textBox.x2, x)) + 2;
const bottom = Math.max(54, Math.ceil(textBox.y2));

const svg = (vb, body, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="${title}"><title>${title}</title>${body}</svg>\n`;

const files = {
  'jumeo-symbole.svg': svg('0 0 64 64', mark(C.navy, C.orange, C.midLight), 'Jumeo'),
  'jumeo-symbole-blanc.svg': svg('0 0 64 64', mark(C.white, C.orange, C.midDark), 'Jumeo'),
  'jumeo-logo.svg': svg(`5 9 ${right - 3} ${bottom - 7}`, mark(C.navy, C.orange, C.midLight) + `<path d="${wordD}" fill="#0b2441"/>`, 'Jumeo'),
  'jumeo-logo-blanc.svg': svg(`5 9 ${right - 3} ${bottom - 7}`, mark(C.white, C.orange, C.midDark) + `<path d="${wordD}" fill="${C.white}"/>`, 'Jumeo')
};
for (const [f, s] of Object.entries(files)) fs.writeFileSync(path.join(out, f), s);
fs.writeFileSync(path.join(root, 'favicon.svg'), files['jumeo-symbole.svg']);
console.log('OK :', Object.keys(files).join(', '), '+ favicon.svg');
