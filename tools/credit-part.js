// Mention « Site réalisé par … » en bas de toutes les pages (après la ligne légale).
// Nom du studio provisoire : le changer ici, puis relancer node build.js.
// LOGO : chemin d'un fichier (ex. '/brand/ny-visuals.svg') quand le logo existera ; vide = texte seul.
const STUDIO = 'NY Visuals';
const LOGO = '';
const URL = '';   // adresse du site du studio quand il sera en ligne ; vide = pas de lien

const mark = LOGO
  ? `<img src="${LOGO}" alt="${STUDIO}" width="96" height="24" loading="lazy" />`
  : `<b>${STUDIO}</b>`;
const inner = `Site réalisé par ${mark}`;

module.exports = {
  studio: STUDIO,
  css: `.credit{margin-top:14px;font-size:12.5px;color:var(--w60)}
.credit b{color:#fff;font-weight:600;letter-spacing:.01em}
.credit img{display:inline-block;height:20px;width:auto;vertical-align:middle;margin-left:2px}
.credit a{display:inline;margin:0;color:inherit;text-decoration:none}.credit a:hover b{text-decoration:underline}`,
  html: `<div class="credit">${URL ? `<a href="${URL}" target="_blank" rel="noopener">${inner}</a>` : inner}</div>`,
};
