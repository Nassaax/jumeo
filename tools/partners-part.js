// Cadre « Une entreprise Lux Energie Solution », au-dessus du pied de page de toutes les pages.
// Wall'PEB est le service PEB + contrôle électrique de Lux Energie Solution : ce cadre rappelle que Lux
// existe et renvoie vers son site pour ses autres métiers. Généré à partir de CONFIG.group (index.html).
'use strict';

const css = `
/* ═════════ GROUPE LUX ═════════ */
.partners-band{background:var(--paper,#f7f5f0);padding:0 0 72px}
.pb{display:grid;grid-template-columns:1.1fr .9fr;gap:36px;align-items:center;padding:40px;border-radius:32px;background:#fff;box-shadow:0 0 0 1px var(--line)}
@media(max-width:860px){.pb{grid-template-columns:1fr;gap:22px;padding:28px 22px}}
.pb .eyebrow{display:inline-flex;align-items:center;gap:10px;font:600 12px/1 'Inter',sans-serif;letter-spacing:.18em;text-transform:uppercase;color:var(--ink);margin-bottom:14px}
.pb .eyebrow::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--accent)}
.pb h2{font:600 clamp(24px,3vw,34px)/1.1 'Plus Jakarta Sans',sans-serif;letter-spacing:-.04em;color:var(--ink);margin-bottom:12px}
.pb-intro{color:rgba(11,36,65,.66);font-size:15.5px;max-width:34rem}
.pb-metiers{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px;list-style:none;padding:0}
.pb-metiers li{font-size:13.5px;font-weight:600;padding:6px 12px;border-radius:999px;background:var(--paper,#f7f5f0);color:var(--ink)}
.pb-card{display:grid;gap:16px;justify-items:start;margin:0;padding:24px;border-radius:24px;background:var(--paper,#f7f5f0)}
.pb-logo{display:grid;place-items:center;height:84px;padding:10px 16px;border-radius:16px;background:#fff;box-shadow:0 0 0 1px var(--line)}
.pb-logo img{max-width:100%;max-height:64px;width:auto;height:auto}
.pb-go{display:inline-flex;align-items:center;gap:10px;min-height:46px;padding:0 18px;border-radius:999px;background:var(--ink);color:#fff;text-decoration:none;font:600 15px 'Inter',sans-serif;transition:transform .2s}
.pb-go:hover{transform:translateY(-1px)}
.pb-go span{color:var(--accent)}
.pb-card small{font-size:13px;color:rgba(11,36,65,.6)}
@media(max-width:760px){.partners-band{padding-bottom:48px}}
`;

function html(group, esc) {
  if (!group || !group.name) return '';
  return `<section class="partners-band" aria-labelledby="pb-title">
  <div class="wrap">
    <div class="pb">
      <div>
        <span class="eyebrow">Une entreprise ${esc(group.name)}</span>
        <h2 id="pb-title">Et pour vos autres projets énergie ?</h2>
        <p class="pb-intro">Wall’PEB est le service PEB et contrôle électrique de ${esc(group.name)}, entreprise wallonne basée à ${esc(group.city || 'Grâce-Hollogne')}. Pour vos travaux, elle vous accompagne aussi :</p>
        <ul class="pb-metiers">${(group.metiers || []).map(m => `<li>${esc(m)}</li>`).join('')}</ul>
      </div>
      <figure class="pb-card">
        <div class="pb-logo">${group.logo ? `<img src="${esc(group.logo)}" alt="Logo ${esc(group.name)}" width="390" height="104" loading="lazy" decoding="async" />` : `<b>${esc(group.name)}</b>`}</div>
        ${group.url ? `<a class="pb-go" href="${esc(group.url)}" target="_blank" rel="noopener">Découvrir ${esc(group.name)} <span aria-hidden="true">↗</span></a>` : ''}
        <small>Site de ${esc(group.name)}, s'ouvre dans un nouvel onglet.</small>
      </figure>
    </div>
  </div>
</section>`;
}

module.exports = { css, html };
