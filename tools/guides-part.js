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
`;

module.exports = function guides({ esc, btn, CONFIG, SITE, page, fs, path, ROOT }) {
  const articles = require(path.join(ROOT, 'contenu', 'guides.js')).slice().sort((a, b) => b.date.localeCompare(a.date));
  fs.mkdirSync(path.join(ROOT, 'guides'), { recursive: true });
  const urls = [];
  const GHOST = '<svg class="ghost" viewBox="0 0 400 240" aria-hidden="true"><circle cx="150" cy="120" r="100"/><circle cx="250" cy="120" r="100"/></svg>';
  const card = a => `<a class="guide-card" href="/guides/${a.slug}"><span class="tag">${esc(a.tag)}</span><h3>${esc(a.title)}</h3><p>${esc(a.description)}</p><small>${dateFr(a.date)} · ${readTime(a.body)} min de lecture</small></a>`;

  for (const a of articles) {
    const others = articles.filter(o => o.slug !== a.slug).slice(0, 3);
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
      <div class="sources">
        <h2>Sources</h2>
        <ul>${a.sources.map(([t, u]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}</a></li>`).join('')}</ul>
        <p class="disclaimer">Article d'information générale, vérifié à la date indiquée. Il ne remplace pas l'avis d'un certificateur agréé ou des textes officiels.</p>
      </div>
    </article>
    <aside class="side-card">
      <div class="card dark"><h3>Besoin d'un certificat PEB ?</h3><p>Un devis clair, un certificateur agréé, un seul contact.</p>${btn('/#devis', 'Devis gratuit')}</div>
      <div class="card"><h3>Quel label pour votre bien ?</h3><p>Une première estimation en 1 minute, gratuite.</p><a class="btn btn-ghost" href="/simulateur-peb">Simulateur PEB</a></div>
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
    <h1 class="rise d1">Nos guides, <span>sans jargon.</span></h1>
    <p class="rise d2">PEB, vente, location, énergie : des réponses claires et vérifiées, avec leurs sources officielles.</p>
  </div>
</section>
<section class="sec"><div class="wrap"><div class="guide-list">${articles.map(card).join('')}</div></div></section>`;
  fs.writeFileSync(path.join(ROOT, 'guides', 'index.html'), page({
    title: `Guides PEB et énergie en Wallonie | ${CONFIG.brand}`,
    description: 'Guides clairs et sourcés : certificat PEB, vente, location, preuves à préparer, nouveau certificat 2026. Pour les propriétaires et acheteurs en Wallonie.',
    canonical: '/guides', body: listBody, css: CSS, current: '/guides',
    ld: [{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE + '/' }, { '@type': 'ListItem', position: 2, name: 'Guides', item: SITE + '/guides' }] }]
  }));
  urls.unshift('/guides');

  // Bloc « derniers guides » pour l'accueil
  const homeBlock = articles.slice(0, 3).map(card).join('');
  return { urls, homeBlock };
};
