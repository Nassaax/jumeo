// Mention « Site réalisé par … » en bas de toutes les pages (après la ligne légale).
// Nom du studio : « NaYas Visuals » (NAsser YASini, confirmé par Nasser le 2026-11-24). Le changer ici, puis relancer node build.js.
// LOGO : pastille ronde du studio (studio/ny-visuals-logo.png, 96 px ; original 512 px à côté) ; vide = texte seul.
const STUDIO = 'NaYas Visuals';
const LOGO = '/studio/ny-visuals-logo.png';
const URL = '';   // adresse du site du studio quand il sera en ligne ; vide = pas de lien

const mark = LOGO
  ? `<img src="${LOGO}" alt="" width="24" height="24" loading="lazy" /><b>${STUDIO}</b>`
  : `<b>${STUDIO}</b>`;
const inner = `Site réalisé par ${mark}`;

module.exports = {
  studio: STUDIO,
  css: `.credit{margin-top:14px;font-size:12.5px;color:var(--w60)}
.credit b{color:#fff;font-weight:600;letter-spacing:.01em}
.credit img{display:inline-block;width:24px;height:24px;vertical-align:middle;margin:0 7px 2px 4px;border-radius:50%}
.credit a{display:inline;margin:0;color:inherit;text-decoration:none}.credit a:hover b{text-decoration:underline}`,
  html: `<div class="credit">${URL ? `<a href="${URL}" target="_blank" rel="noopener">${inner}</a>` : inner}</div>`,
};
