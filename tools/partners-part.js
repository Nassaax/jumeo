// Cadre « Nos partenaires » affiché au-dessus du pied de page de toutes les pages.
// Généré à partir de CONFIG.partners (index.html). Règle : jamais de téléphone ni d'e-mail du partenaire,
// et pas de lien vers son site (les demandes passent par Jumeo). Logo uniquement avec l'accord du partenaire.
'use strict';

const css = `
/* ═════════ PARTENAIRES ═════════ */
.partners-band{background:var(--paper,#f7f5f0);padding:0 0 72px}
.pb{display:grid;grid-template-columns:.9fr 1.1fr;gap:40px;align-items:center;padding:40px;border-radius:32px;background:#fff;box-shadow:0 0 0 1px var(--line)}
@media(max-width:860px){.pb{grid-template-columns:1fr;gap:24px;padding:28px 22px}}
.pb .eyebrow{display:inline-flex;align-items:center;gap:10px;font:600 12px/1 'Inter',sans-serif;letter-spacing:.18em;text-transform:uppercase;color:var(--ink);margin-bottom:14px}
.pb .eyebrow::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--accent)}
.pb h2{font:600 clamp(24px,3vw,34px)/1.1 'Plus Jakarta Sans',sans-serif;letter-spacing:-.04em;color:var(--ink);margin-bottom:12px}
.pb-intro{color:rgba(11,36,65,.66);font-size:15.5px;max-width:30rem}
.pb-list{display:grid;gap:14px}
.pb-card{display:grid;grid-template-columns:200px 1fr;gap:20px;align-items:center;margin:0;padding:18px 20px;border-radius:22px;background:var(--paper,#f7f5f0)}
@media(max-width:520px){.pb-card{grid-template-columns:1fr;gap:12px}}
.pb-logo{display:grid;place-items:center;height:84px;padding:10px 14px;border-radius:16px;background:#fff;box-shadow:0 0 0 1px var(--line)}
.pb-logo img{max-width:100%;max-height:64px;width:auto;height:auto}
.pb-card figcaption{display:grid;gap:4px}
.pb-card b{font:600 17px 'Plus Jakarta Sans',sans-serif;color:var(--ink)}
.pb-badge{display:inline-flex;align-items:center;gap:7px;width:max-content;font:600 12px 'Inter',sans-serif;color:var(--ink);padding:4px 10px;border-radius:999px;background:#fff;box-shadow:0 0 0 1px var(--line)}
.pb-badge::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--accent)}
.pb-card small{font-size:13.5px;color:rgba(11,36,65,.66)}
.pb-join{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 20px;border-radius:22px;border:1.5px dashed rgba(11,36,65,.22);color:var(--ink);text-decoration:none;font-weight:600;font-size:15px;transition:border-color .2s,background-color .2s}
.pb-join:hover{border-color:var(--ink);background:rgba(255,255,255,.6)}
.pb-join span{color:var(--accent-d,#f0652e)}
@media(max-width:760px){.partners-band{padding-bottom:48px}}
`;

function html(partners, esc) {
  const cards = (partners || []).filter(p => p.name).map(p => `
        <figure class="pb-card">
          <div class="pb-logo">${p.logo ? `<img src="${esc(p.logo)}" alt="Logo ${esc(p.name)}" width="390" height="104" loading="lazy" decoding="async" />` : `<b>${esc(p.name)}</b>`}</div>
          <figcaption>
            <b>${esc(p.name)}</b>
            ${p.officiel ? '<span class="pb-badge">Partenaire officiel</span>' : ''}
            <small>${esc([p.badge, (p.metiers || []).join(' · ')].filter(Boolean).join(' · '))}</small>
          </figcaption>
        </figure>`).join('');
  return `<section class="partners-band" aria-labelledby="pb-title">
  <div class="wrap">
    <div class="pb">
      <div>
        <span class="eyebrow">Nos partenaires</span>
        <h2 id="pb-title">Ils nous font confiance, on leur fait confiance.</h2>
        <p class="pb-intro">Des professionnels sélectionnés : numéro d'entreprise, assurance professionnelle et agréments exigés pour leur métier. Vous gardez un seul contact : nous.</p>
      </div>
      <div class="pb-list">${cards}
        <a class="pb-join" href="/devenir-partenaire">Votre entreprise ici ? Rejoignez le réseau <span aria-hidden="true">→</span></a>
      </div>
    </div>
  </div>
</section>`;
}

module.exports = { css, html };
