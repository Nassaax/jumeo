// Rubrique « Guides » : morceau de build.js (articles de contenu/guides.js).
'use strict';

const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const dateFr = d => { const [y, m, j] = d.split('-').map(Number); return `${j} ${MOIS[m - 1]} ${y}`; };
const readTime = html => Math.max(2, Math.round(html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length / 200));

const CSS = `
.article-meta{display:flex;flex-wrap:wrap;gap:8px 18px;font-size:14px;color:var(--w60);margin-top:4px}
.tag{display:inline-block;font:600 12px 'Inter',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:14px}
.article{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:56px;align-items:start}
@media(max-width:900px){.article{grid-template-columns:1fr;gap:32px}}
.article-body{max-width:44rem}
.article-body .lead{font-size:20px;line-height:1.5;color:var(--ink);margin-bottom:28px}
.article-body h2{font-size:clamp(22px,2.6vw,28px);letter-spacing:-.03em;margin:40px 0 12px}
.article-body p,.article-body li{font-size:17px;line-height:1.7;color:#2a3a4d}
.article-body p{margin-bottom:14px}
.article-body ul,.article-body ol{padding-left:22px;margin-bottom:16px;display:grid;gap:8px}
.article-body strong{color:var(--ink)}
.article-body a{color:var(--ink);text-decoration-color:var(--accent);text-underline-offset:3px}
.sources{margin-top:44px;padding-top:22px;border-top:1px solid var(--line);font-size:14px;color:var(--muted)}
.sources h2{font-size:15px;margin:0 0 10px;letter-spacing:0}
.sources ul{padding-left:18px;display:grid;gap:6px}.sources li{font-size:14px;line-height:1.5}
.sources a{color:var(--muted)}
.disclaimer{margin-top:18px;font-size:13.5px;color:var(--muted)}
.side-card{position:sticky;top:96px;display:grid;gap:16px}
.side-card .card h3{font-size:18px;margin-bottom:8px}.side-card .card p{margin-bottom:16px}
.guide-list{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
@media(max-width:900px){.guide-list{grid-template-columns:1fr}}
.guide-card{display:flex;flex-direction:column;background:var(--card);border-radius:28px;padding:28px;box-shadow:0 0 0 1px var(--line),0 4px 16px rgba(11,36,65,.05);text-decoration:none;transition:transform .25s var(--e-std),box-shadow .25s var(--e-std)}
.guide-card:hover{transform:translateY(-3px);box-shadow:0 0 0 1px var(--line),0 18px 40px rgba(11,36,65,.1)}
.guide-card .tag{color:var(--ink)}
.guide-card h3{font-size:20px;letter-spacing:-.025em;margin-bottom:10px}
.guide-card p{color:var(--muted);font-size:15px;margin-bottom:18px}
.guide-card small{margin-top:auto;color:var(--muted);font-size:13px}
.sims{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;margin-bottom:64px}
@media(max-width:760px){.sims{grid-template-columns:1fr;gap:14px;margin-bottom:44px}}
.sim{position:relative;overflow:hidden;display:grid;grid-template-columns:auto 1fr;gap:6px 18px;align-items:start;padding:28px;border-radius:28px;background:var(--ink);color:#fff;text-decoration:none;box-shadow:0 24px 60px rgba(11,36,65,.22);transition:transform .25s var(--e-std)}
.sim:hover{transform:translateY(-3px)}
.sim:active{transform:scale(.98)}
.sim-ico{grid-row:span 3;display:grid;place-items:center;width:56px;height:56px;border-radius:18px;background:rgba(255,255,255,.1)}
.sim-ico svg{width:28px;height:28px;fill:none;stroke:var(--accent);stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
.sim h3{font-size:21px;letter-spacing:-.03em}
.sim p{color:var(--w78);font-size:15px}
.sim .go{display:inline-flex;align-items:center;gap:8px;margin-top:10px;font-weight:600;font-size:14.5px;color:#fff}
.sim .go i{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:var(--accent);color:var(--ink);font-style:normal;transition:transform .3s var(--e-std)}
.sim:hover .go i{transform:rotate(-45deg)}
.sim .scale-mini{position:absolute;right:-8px;bottom:-8px;display:grid;gap:3px;opacity:.16}
.sim .scale-mini span{height:7px;border-radius:2px 6px 6px 2px;background:#fff}
.sec-label{display:flex;align-items:baseline;justify-content:space-between;gap:16px;margin-bottom:18px}
.sec-label h2{font-size:clamp(24px,3vw,32px);letter-spacing:-.035em;margin:0}
@media(max-width:760px){.sec-label .tag{display:none}.sim{grid-template-columns:1fr;padding:22px}.sim-ico{grid-row:auto;width:48px;height:48px;border-radius:15px;margin-bottom:8px}}
.filters{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:28px}
.filters button{border:0;cursor:pointer;font:600 14px 'Inter',sans-serif;min-height:40px;padding:0 16px;border-radius:999px;background:var(--card);color:var(--ink);box-shadow:0 0 0 1px var(--line);transition:background-color .2s,color .2s}
.filters button[aria-pressed="true"]{background:var(--ink);color:#fff;box-shadow:none}
.one-contact{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:56px}
@media(max-width:900px){.one-contact{grid-template-columns:1fr}}
.one-contact div{background:var(--card);border-radius:24px;padding:24px;box-shadow:0 0 0 1px var(--line)}
.one-contact b{display:block;font:600 17px 'Plus Jakarta Sans',sans-serif;margin-bottom:6px}
.one-contact p{color:var(--muted);font-size:15px}
.contact-box{margin-top:40px;background:var(--paper-2);border-radius:24px;padding:26px 28px}
.contact-box h2{font-size:20px;margin:0 0 8px}
.contact-box p{font-size:16px;margin-bottom:16px}
`;

module.exports = function guides({ esc, btn, CONFIG, SITE, page, fs, path, ROOT }) {
  const articles = require(path.join(ROOT, 'contenu', 'guides.js')).slice().sort((a, b) => b.date.localeCompare(a.date));
  fs.mkdirSync(path.join(ROOT, 'guides'), { recursive: true });
  const urls = [];
  const GHOST = '<svg class="ghost" viewBox="0 0 400 240" aria-hidden="true"><circle cx="150" cy="120" r="100"/><circle cx="250" cy="120" r="100"/></svg>';
  const CATS = ['PEB', 'Énergie renouvelable', 'Rénovation', 'Électricité'];
  const card = a => `<a class="guide-card" href="/guides/${a.slug}" data-cat="${esc(a.cat || '')}"><span class="tag">${esc(a.tag)}</span><h3>${esc(a.title)}</h3><p>${esc(a.description)}</p><small>${dateFr(a.date)} · ${readTime(a.body)} min de lecture</small></a>`;

  for (const a of articles) {
    const others = [...articles.filter(o => o.slug !== a.slug && o.cat === a.cat), ...articles.filter(o => o.slug !== a.slug && o.cat !== a.cat)].slice(0, 3);
    const devis = a.service ? `/?service=${a.service}#devis` : '/#devis';
    const body = `
<section class="sub-hero">
  ${GHOST}
  <div class="wrap">
    <ol class="crumbs rise"><li><a href="/">Accueil</a></li><li><a href="/guides">Guides</a></li><li aria-current="page">${esc(a.tag)}</li></ol>
    <span class="tag rise d1">${esc(a.tag)}</span>
    <h1 class="rise d1" style="max-width:22ch">${esc(a.title)}</h1>
    <div class="article-meta rise d2"><span>Par l'équipe ${esc(CONFIG.brand)}</span><span>${dateFr(a.date)}</span><span>${readTime(a.body)} min de lecture</span></div>
  </div>
</section>
<section class="sec">
  <div class="wrap article">
    <article class="article-body">
      <p class="lead">${esc(a.lead)}</p>
      ${a.body}
      <div class="contact-box">
        <h2>Un projet ? Un seul interlocuteur.</h2>
        <p>${esc(CONFIG.brand)} vous met en relation avec des professionnels compétents et en règle, et suit votre dossier du début à la fin. Vous n'avez qu'un contact.</p>
        ${btn(devis, 'Parler de mon projet')}
      </div>
      <div class="sources">
        <h2>Sources</h2>
        <ul>${a.sources.map(([t, u]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}</a></li>`).join('')}</ul>
        <p class="disclaimer">Article d'information générale, vérifié à la date indiquée. Il ne remplace pas l'avis d'un certificateur agréé ou des textes officiels.</p>
      </div>
    </article>
    <aside class="side-card">
      ${a.cat === 'PEB'
        ? `<div class="card dark"><h3>Besoin d'un certificat PEB ?</h3><p>Un devis clair, un certificateur agréé, un seul contact.</p>${btn(devis, 'Devis gratuit')}</div>`
        : `<div class="card dark"><h3>On s'occupe de trouver le bon pro</h3><p>Décrivez votre projet : on vous met en relation avec un professionnel compétent de votre région.</p>${btn(devis, 'Devis gratuit')}</div>`}
      ${a.sim === 'recharge'
        ? `<div class="card"><h3>Combien de temps pour recharger ?</h3><p>Temps et coût de recharge de votre voiture électrique, en quelques clics.</p><a class="btn btn-ghost" href="/simulateur-recharge">Simulateur de recharge</a></div>`
        : `<div class="card"><h3>Quel label pour votre bien ?</h3><p>Une première estimation en 1 minute, gratuite.</p><a class="btn btn-ghost" href="/simulateur-peb">Simulateur PEB</a></div>`}
    </aside>
  </div>
</section>
${others.length ? `<section class="sec" style="padding-top:0"><div class="wrap"><span class="eyebrow">À lire aussi</span><div class="guide-list" style="margin-top:12px">${others.map(card).join('')}</div></div></section>` : ''}`;
    const ld = [
      { '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.description, datePublished: a.date, dateModified: a.date, inLanguage: 'fr-BE', author: { '@type': 'Organization', name: CONFIG.brand, url: SITE + '/' }, publisher: { '@type': 'Organization', name: CONFIG.brand, logo: { '@type': 'ImageObject', url: SITE + '/apple-touch-icon.png' } }, image: SITE + '/og-image.jpg', mainEntityOfPage: `${SITE}/guides/${a.slug}` },
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE + '/' }, { '@type': 'ListItem', position: 2, name: 'Guides', item: SITE + '/guides' }, { '@type': 'ListItem', position: 3, name: a.title, item: `${SITE}/guides/${a.slug}` }] }
    ];
    fs.writeFileSync(path.join(ROOT, 'guides', a.slug + '.html'), page({ title: `${a.seo || a.title} | ${CONFIG.brand}`, description: a.description, canonical: `/guides/${a.slug}`, body, ld, css: CSS, current: '/guides' }));
    urls.push(`/guides/${a.slug}`);
  }

  // Page « Guides »
  const listBody = `
<section class="sub-hero">
  ${GHOST}
  <div class="wrap">
    <ol class="crumbs rise"><li><a href="/">Accueil</a></li><li aria-current="page">Guides</li></ol>
    <h1 class="rise d1">Guides &amp; simulateurs, <span>sans jargon.</span></h1>
    <p class="rise d2">PEB, énergie renouvelable, rénovation, électricité : des réponses claires et vérifiées, avec leurs sources. Et quand vous êtes prêt, un seul interlocuteur pour tout votre projet.</p>
  </div>
</section>
<section class="sec">
  <div class="wrap">
    <div class="sec-label" id="simulateurs"><h2>Nos simulateurs</h2><span class="tag" style="color:var(--ink)">Gratuits · sans inscription</span></div>
    <div class="sims">
      <a class="sim" href="/simulateur-peb">
        <span class="sim-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 15a8 8 0 1 1 16 0"/><path d="M12 15l4-5"/><circle cx="12" cy="15" r="1.4"/><path d="M4 19h16"/></svg></span>
        <h3>Simulateur PEB</h3>
        <p>Quel label pour votre logement ? 7 questions, une fourchette de A à G et des pistes d'amélioration.</p>
        <span class="go">Estimer mon label <i aria-hidden="true">→</i></span>
        <span class="scale-mini" aria-hidden="true"><span style="width:40px"></span><span style="width:52px"></span><span style="width:64px"></span><span style="width:76px"></span><span style="width:88px"></span></span>
      </a>
      <a class="sim" href="/simulateur-recharge">
        <span class="sim-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg></span>
        <h3>Simulateur de recharge</h3>
        <p>Combien de temps et combien coûte la recharge de votre voiture électrique à la maison ?</p>
        <span class="go">Calculer ma recharge <i aria-hidden="true">→</i></span>
      </a>
    </div>
    <div class="sec-label"><h2>Nos guides</h2></div>
    <div class="one-contact">
      <div><b>Vous comprenez</b><p>Nos guides expliquent les règles et les bonnes questions à poser, sources officielles à l'appui.</p></div>
      <div><b>On trouve le bon pro</b><p>Certificateur, électricien, installateur, entrepreneur : des professionnels compétents, avec n° d'entreprise, assurance et agréments.</p></div>
      <div><b>Un seul contact</b><p>On coordonne et on suit votre dossier du début à la fin. Vous n'avez pas à jongler entre les corps de métier.</p></div>
    </div>
    <div class="filters" role="group" aria-label="Filtrer par sujet">
      <button type="button" data-f="" aria-pressed="true">Tous</button>
      ${CATS.filter(c => articles.some(a => a.cat === c)).map(c => `<button type="button" data-f="${esc(c)}" aria-pressed="false">${esc(c)}</button>`).join('')}
    </div>
    <div class="guide-list" id="guideList">${articles.map(card).join('')}</div>
  </div>
</section>`;
  const listScript = `
document.querySelectorAll('.filters button').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('.filters button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  document.querySelectorAll('#guideList .guide-card').forEach(c => { c.style.display = !b.dataset.f || c.dataset.cat === b.dataset.f ? '' : 'none'; });
}));`;
  fs.writeFileSync(path.join(ROOT, 'guides', 'index.html'), page({
    title: `Guides et simulateurs PEB, énergie, rénovation | ${CONFIG.brand}`,
    description: 'Guides clairs et sourcés en Wallonie : certificat PEB, panneaux photovoltaïques, borne de recharge, rénovation. Et un seul interlocuteur pour votre projet.',
    canonical: '/guides', body: listBody, css: CSS, current: '/guides', script: listScript,
    ld: [{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE + '/' }, { '@type': 'ListItem', position: 2, name: 'Guides', item: SITE + '/guides' }] }]
  }));
  urls.unshift('/guides');

  // Bloc « derniers guides » pour l'accueil
  const homeBlock = ['PEB', 'Énergie renouvelable', 'Rénovation', 'Électricité'].map(c => articles.find(a => a.cat === c)).filter(Boolean).slice(0, 3).map(card).join('');
  return { urls, homeBlock };
};
