// Génère le logo Wall'PEB dans brand/ (SVG) + favicon.svg à la racine.
// Symbole : une maison dont l'intérieur est l'étiquette PEB (3 barres en flèche, la plus courte en jaune = meilleure classe).
// Mot « Wall’PEB » vectorisé (pas besoin de la police pour l'afficher), apostrophe en jaune.
// Prérequis : npm i opentype.js@1.3.4 et la police Plus Jakarta Sans ExtraBold (.ttf)
// Usage : FONT=/chemin/pjs800.ttf NODE_PATH=/chemin/node_modules node tools/make-logo-wallpeb.js
const fs = require('fs');
const path = require('path');
const opentype = require('opentype.js');

const root = path.join(__dirname, '..');
const out = path.join(root, 'brand');
fs.mkdirSync(out, { recursive: true });

const C = { ink: '#0b2441', yellow: '#f2b705', white: '#ffffff' };

// Barre en flèche (comme sur l'étiquette énergétique) : x, y, longueur, hauteur 8.
const bar = (x, y, w, fill) => `<path d="M${x} ${y}h${w}l4.5 4-4.5 4H${x}z" fill="${fill}"/>`;
// Symbole 64×64 : toit + 3 barres. `a` = toit et barres basses, `b` = barre du haut.
const ROOF = 'M7 29 32 8l25 21';
const mark = (a, b) =>
  `<path d="${ROOF}" fill="none" stroke="${a}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>` +
  bar(15, 27, 16, b) + bar(15, 38, 24, a) + bar(15, 49, 32, a);

// Mot vectorisé, aligné sur le symbole.
const font = opentype.parse(fs.readFileSync(process.env.FONT).buffer);
const capH = font.tables.os2.sCapHeight / font.unitsPerEm;
const size = 30 / capH;                  // hauteur des majuscules = 30 unités
const tracking = -0.03 * size;
const BASE = 52;
const word = 'Wall’PEB';
const glyphs = font.stringToGlyphs(word);
let x = 74;
const ink = [], accent = [];
glyphs.forEach((g, i) => {
  if (word[i] === '’') x -= 0.05 * size;        // apostrophe resserrée
  (word[i] === '’' ? accent : ink).push(g.getPath(x, BASE, size).toPathData(2));
  x += g.advanceWidth / font.unitsPerEm * size + tracking;
  if (word[i] === '’') x -= 0.09 * size;
  if (glyphs[i + 1]) x += font.getKerningValue(g, glyphs[i + 1]) / font.unitsPerEm * size;
});
const right = Math.ceil(x) + 3;
const wordInk = ink.join(''), wordAccent = accent.join('');

const svg = (vb, body, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="${title}"><title>${title}</title>${body}</svg>\n`;
const VB = `4 5 ${right - 4} 54`;
const files = {
  'wallpeb-symbole.svg': svg('0 0 64 64', mark(C.ink, C.yellow), "Wall'PEB"),
  'wallpeb-symbole-blanc.svg': svg('0 0 64 64', mark(C.white, C.yellow), "Wall'PEB"),
  'wallpeb-logo.svg': svg(VB, mark(C.ink, C.yellow) + `<path d="${wordInk}" fill="${C.ink}"/><path d="${wordAccent}" fill="${C.yellow}"/>`, "Wall'PEB"),
  'wallpeb-logo-blanc.svg': svg(VB, mark(C.white, C.yellow) + `<path d="${wordInk}" fill="${C.white}"/><path d="${wordAccent}" fill="${C.yellow}"/>`, "Wall'PEB"),
};
for (const [f, s] of Object.entries(files)) fs.writeFileSync(path.join(out, f), s);
fs.writeFileSync(path.join(root, 'favicon.svg'), files['wallpeb-symbole.svg']);
// Données réutilisées par build.js (écran d'ouverture, en-tête) : tracés du mot.
fs.writeFileSync(path.join(out, 'wallpeb-word.json'), JSON.stringify({ viewBox: VB, ink: wordInk, accent: wordAccent }));
console.log('OK :', Object.keys(files).join(', '), '+ favicon.svg + wallpeb-word.json');
