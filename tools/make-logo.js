// Génère les fichiers du logo Jumeo (piste 3 « Le lien ») dans brand/
// + favicon.svg à la racine. Le mot « Jumeo » est vectorisé (pas besoin de la police pour l'afficher).
// Prérequis : npm i opentype.js@1.3.4 et la police Plus Jakarta Sans ExtraBold (.ttf)
// Usage : FONT=/chemin/pjs800.ttf NODE_PATH=/chemin/node_modules node tools/make-logo.js
const fs = require('fs');
const path = require('path');
const opentype = require('opentype.js');

const root = path.join(__dirname, '..');
const out = path.join(root, 'brand');
fs.mkdirSync(out, { recursive: true });

const C = { navy: '#12355b', orange: '#ff7a45', white: '#ffffff' };

// Symbole « Le lien » : deux anneaux entrelacés (le client et le professionnel, reliés par Jumeo).
// Le petit arc final repasse l'anneau gauche par-dessus l'autre en haut : c'est l'entrelacement.
const mark = (a, b) =>
  `<circle cx="23" cy="32" r="15" fill="none" stroke="${a}" stroke-width="7"/>` +
  `<circle cx="41" cy="32" r="15" fill="none" stroke="${b}" stroke-width="7"/>` +
  `<path d="M28.13 17.9A15 15 0 0 1 35.14 23.18" fill="none" stroke="${a}" stroke-width="7"/>`;

// Mot « Jumeo » vectorisé, centré verticalement sur les anneaux.
const font = opentype.parse(fs.readFileSync(process.env.FONT).buffer);
const capH = font.tables.os2.sCapHeight / font.unitsPerEm;
const size = 28 / capH;                 // hauteur des majuscules = 28 unités (anneaux : 37)
const tracking = -0.035 * size;         // même resserrement que sur le site
let x = 72;
const BASE = 46;                        // 32 (centre des anneaux) + 28/2
const glyphs = font.stringToGlyphs('Jumeo');
const parts = [];
glyphs.forEach((g, i) => {
  parts.push(g.getPath(x, BASE, size).toPathData(2));
  x += g.advanceWidth / font.unitsPerEm * size + tracking;
  if (glyphs[i + 1]) x += font.getKerningValue(g, glyphs[i + 1]) / font.unitsPerEm * size;
});
const wordD = parts.join('');
const textBox = font.getPath('Jumeo', 72, BASE, size).getBoundingBox();
const right = Math.ceil(Math.max(textBox.x2, x)) + 2;
const bottom = Math.max(51, Math.ceil(textBox.y2) + 1);

const svg = (vb, body, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="${title}"><title>${title}</title>${body}</svg>\n`;

const files = {
  'jumeo-symbole.svg': svg('0 0 64 64', mark(C.navy, C.orange), 'Jumeo'),
  'jumeo-symbole-blanc.svg': svg('0 0 64 64', mark(C.white, C.orange), 'Jumeo'),
  'jumeo-logo.svg': svg(`3 12 ${right - 1} ${bottom - 12}`, mark(C.navy, C.orange) + `<path d="${wordD}" fill="#0b2441"/>`, 'Jumeo'),
  'jumeo-logo-blanc.svg': svg(`3 12 ${right - 1} ${bottom - 12}`, mark(C.white, C.orange) + `<path d="${wordD}" fill="${C.white}"/>`, 'Jumeo')
};
for (const [f, s] of Object.entries(files)) fs.writeFileSync(path.join(out, f), s);
fs.writeFileSync(path.join(root, 'favicon.svg'), files['jumeo-symbole.svg']);
console.log('OK :', Object.keys(files).join(', '), '+ favicon.svg');
