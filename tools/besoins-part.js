// Pages « selon votre situation » (idée reprise de la structure d'un concurrent, textes propres à Wall'PEB) :
// vendre, louer, pack PEB + contrôle électrique, contrôle électrique seul, immeubles / plusieurs logements.
// Règle : chaque affirmation vient de data/regles-peb.md (✅) et est sourcée en bas de page.
// Pas de délai, de prix par surface ni d'avis tant que Lux ne les a pas fournis.
'use strict';

module.exports = function besoins({ esc, btn, CONFIG, SITE, page, fs, path, ROOT, GHOST }) {
  const SRC = require(path.join(ROOT, 'contenu', 'guides.js')).SRC;
  const P = CONFIG.prices, VAT = CONFIG.vat || '';
  const LUX = CONFIG.group;
  const luxLink = `<a href="${esc(LUX.url)}" target="_blank" rel="noopener">${esc(LUX.name)}</a>`;

  const CSS = `
.need-list{display:grid;gap:10px;list-style:none;margin-top:18px}
.need-list li{display:flex;gap:12px;font-size:16.5px;color:var(--ink)}
.need-list li::before{content:"";flex:0 0 8px;height:8px;margin-top:10px;border-radius:50%;background:var(--accent)}
.sources{margin-top:28px;font-size:14px;color:var(--muted)}
.sources ul{padding-left:18px;display:grid;gap:6px;margin-top:8px}.sources a{color:var(--muted)}
.cards.two{grid-template-columns:repeat(2,1fr)}@media(max-width:900px){.cards.two{grid-template-columns:1fr}}
.card .btn{margin-top:16px}
.need-photo{display:block;width:100%;height:auto;max-height:520px;object-fit:cover;border-radius:28px;margin-bottom:20px}
`;

  const PAGES = [
    {
      slug: 'certificat-peb-vente', short: 'Vendre un bien', service: 'pebelec',
      title: `Certificat PEB pour vendre en Wallonie : ${P.peb} € TVAC | ${CONFIG.brand}`,
      description: `Vous vendez une maison ou un appartement en Wallonie ? Certificat PEB ${P.peb} € TVAC, ou ${P.pebelec} € avec le contrôle électrique, en une seule visite. Certificateur agréé.`,
      h1: 'Vous vendez ? Votre certificat PEB, <span>prêt avant l\'annonce.</span>',
      intro: 'Le certificat PEB est obligatoire pour vendre un logement en Wallonie. Il doit exister avant la publicité du bien, et ses indicateurs figurent dans l\'annonce.',
      cards: ['peb', 'pebelec', 'elec'],
      know: [
        'Le certificat doit exister <strong>avant la mise en vente</strong> : ses indicateurs apparaissent dans l\'annonce.',
        'Il est <strong>valable 10 ans</strong>, sauf travaux qui modifient la performance du bien.',
        'À la vente d\'une habitation, le <strong>contrôle électrique</strong> est aussi demandé : un procès-verbal de conformité de moins de 25 ans, ou une nouvelle visite de contrôle.',
        'Depuis le 1er septembre 2026, le certificat des logements existants comprend une <strong>feuille de route de rénovation</strong>.'
      ],
      tip: 'Commandez le certificat PEB et le contrôle électrique ensemble, dès que vous décidez de vendre : une seule visite, et votre notaire a tout à temps.',
      faq: [
        ['Quand faut-il commander le certificat PEB ?', 'Dès que vous décidez de vendre : il doit exister avant la publication de l\'annonce.'],
        ['Mon ancien certificat est-il encore valable ?', 'Oui s\'il a moins de 10 ans et qu\'aucuns travaux n\'ont modifié la performance du bien depuis.'],
        ['Faut-il aussi un contrôle électrique ?', 'Pour vendre une habitation équipée d\'une installation électrique, le vendeur remet un procès-verbal de conformité de moins de 25 ans, ou celui d\'une nouvelle visite de contrôle par un organisme agréé, au plus tard à l\'acte chez le notaire.'],
        ['Quels documents préparer ?', 'Factures et photos des travaux (isolation, châssis, chauffage, ventilation), fiches techniques, permis ou acte pour l\'année de construction. Sans preuve, le certificateur applique des valeurs par défaut, en général moins favorables.']
      ],
      sources: [SRC.demarche, SRC.existants, SRC.notaireVendre, SRC.actu2026]
    },
    {
      slug: 'certificat-peb-location', short: 'Louer un bien', service: 'peb',
      title: `Certificat PEB pour louer en Wallonie : ${P.peb} € TVAC | ${CONFIG.brand}`,
      description: `Vous mettez un logement en location en Wallonie ? Certificat PEB ${P.peb} € TVAC, même prix qu'à la vente, établi par un certificateur agréé. Valable 10 ans.`,
      h1: 'Vous louez ? Votre certificat PEB, <span>au même prix.</span>',
      intro: `Le certificat PEB est obligatoire pour mettre un logement en location en Wallonie. Même forfait qu'à la vente : ${P.peb} € ${VAT}, indicatif.`,
      cards: ['peb', 'elec'],
      know: [
        'Le certificat doit exister <strong>avant la publicité</strong> du logement, et ses indicateurs figurent dans l\'annonce.',
        'Il est <strong>valable 10 ans</strong> : pas besoin d\'un nouveau certificat à chaque locataire, sauf travaux qui modifient la performance.',
        '<strong>Aucun label minimum</strong> n\'est exigé aujourd\'hui pour louer en Wallonie.',
        'Un certificat <strong>par logement</strong> : chaque appartement loué a le sien.'
      ],
      tip: 'Vous louez plusieurs logements dans le même immeuble ? Demandez un devis groupé : un seul planning pour tous les certificats.',
      faq: [
        ['Faut-il un nouveau certificat à chaque nouveau locataire ?', 'Non, tant que le certificat a moins de 10 ans et qu\'aucuns travaux n\'ont modifié la performance du logement.'],
        ['Faut-il un label minimum pour louer ?', 'Non, aucun label minimum n\'est exigé aujourd\'hui en Wallonie. Des évolutions sont annoncées : renseignez-vous avant de lancer des travaux.'],
        ['J\'ai plusieurs logements dans un immeuble : comment faire ?', 'Chaque logement a son certificat. Si l\'immeuble a des installations communes (chauffage, eau chaude, ventilation), un rapport partiel des parties communes est aussi nécessaire.']
      ],
      sources: [SRC.demarche, SRC.existants]
    },
    {
      slug: 'pack-peb-controle-electrique', short: 'PEB + contrôle électrique', service: 'pebelec',
      title: `Pack PEB + contrôle électrique : ${P.pebelec} € TVAC | ${CONFIG.brand}`,
      description: `Certificat PEB et contrôle de l'installation électrique en une seule visite, partout en Wallonie : ${P.pebelec} € TVAC, prix indicatif. Idéal pour vendre une habitation.`,
      h1: 'PEB + contrôle électrique : <span>une seule visite.</span>',
      intro: 'Pour vendre une habitation, il vous faut le plus souvent les deux documents. On les réalise lors du même rendez-vous : moins de démarches, un seul interlocuteur.',
      cards: ['pebelec', 'peb', 'elec'],
      know: [
        `Le <strong>certificat PEB</strong> est établi et signé par le certificateur agréé de ${esc(LUX.name)}.`,
        `Le <strong>contrôle électrique</strong> est réalisé par ${esc(LUX.name)}, organisme agréé.`,
        'Vous recevez les deux documents, avec des explications simples.',
        `Si l'installation n'est pas conforme, ${luxLink} peut réaliser la mise en conformité.`
      ],
      tip: 'Prévenez votre notaire dès que vous avez les deux documents : il vous dira ce qu\'il lui faut et quand.',
      faq: [
        ['Qu\'est-ce qui est compris ?', `Le certificat PEB et la visite de contrôle de l'installation électrique, lors d'un même rendez-vous, pour ${P.pebelec} € ${VAT} (prix indicatif, confirmé avant l'intervention).`],
        ['Et si l\'installation électrique n\'est pas conforme ?', 'La vente reste possible. L\'acheteur fait réaliser une nouvelle visite, en principe dans les 18 mois qui suivent l\'acte. Un rapport non conforme peut toutefois peser dans la négociation : mieux vaut le connaître tôt.'],
        ['Qui paie le contrôle électrique ?', 'En principe le vendeur, sauf accord différent entre vendeur et acheteur.']
      ],
      sources: [SRC.notaireVendre, SRC.notaireLexique, SRC.notaireBrochure, SRC.existants]
    },
    {
      slug: 'controle-electrique', short: 'Contrôle électrique', service: 'elec',
      title: `Contrôle électrique pour vendre en Wallonie, sur devis | ${CONFIG.brand}`,
      description: `Contrôle de conformité de l'installation électrique avant une vente en Wallonie, par un organisme agréé. Sur devis, ou ${P.pebelec} € TVAC avec le certificat PEB.`,
      h1: 'Contrôle électrique : <span>vendez en règle.</span>',
      intro: 'À la vente d\'une habitation, le vendeur remet un procès-verbal de contrôle de l\'installation électrique. On le réalise seul, ou avec votre certificat PEB lors du même rendez-vous.',
      cards: ['elec', 'pebelec'],
      know: [
        'Le vendeur remet soit un <strong>procès-verbal de conformité de moins de 25 ans</strong>, soit celui d\'une <strong>nouvelle visite de contrôle</strong> par un organisme agréé.',
        'Le document est remis <strong>au plus tard à l\'acte</strong> chez le notaire.',
        'Installation <strong>non conforme</strong> : la vente reste possible, l\'acheteur fait refaire une visite, en principe dans les <strong>18 mois</strong>.',
        'Installation conforme : prochain contrôle au plus tard après <strong>25 ans</strong>, ou plus tôt après une modification importante.'
      ],
      tip: `Rapport négatif ? ${luxLink} réalise aussi les travaux de mise en conformité de l'installation électrique.`,
      faq: [
        ['Combien coûte le contrôle électrique ?', `Il est sur devis : le prix dépend surtout de la taille de l'installation. Avec le certificat PEB, au même rendez-vous : ${P.pebelec} € ${VAT}.`],
        ['Qui paie ?', 'En principe le vendeur, sauf accord différent entre vendeur et acheteur.'],
        ['Que préparer ?', 'L\'ancien procès-verbal de contrôle s\'il existe, et les schémas et plans électriques si vous les avez.']
      ],
      sources: [SRC.notaireVendre, SRC.notaireLexique, SRC.notaireBrochure]
    },
    {
      slug: 'certificat-peb-immeuble', short: 'Immeubles et copropriétés', service: 'autre',
      photo: ['/photos/immeuble.webp', 'Façade d\'un immeuble à appartements'],
      title: `Certificat PEB immeuble, copropriété, plusieurs logements | ${CONFIG.brand}`,
      description: `Syndics, gestionnaires, investisseurs : certificats PEB de plusieurs logements en Wallonie, rapport partiel des parties communes, planning groupé. Devis sur mesure.`,
      h1: 'Immeubles et copropriétés : <span>un dossier, un interlocuteur.</span>',
      intro: 'Syndics, gestionnaires de biens, investisseurs : vous avez plusieurs logements à certifier ? On organise un planning groupé et un devis sur mesure.',
      cards: ['autre', 'pebelec'],
      know: [
        'Il faut <strong>un certificat par logement</strong> (maison ou appartement) vendu ou loué.',
        'Si l\'immeuble a des <strong>installations communes</strong> (chauffage, eau chaude, ventilation, photovoltaïque), un <strong>rapport partiel</strong> des parties communes est indispensable pour certifier chaque appartement.',
        'Les preuves (factures, fiches techniques, photos) des installations communes servent à tous les logements : rassemblez-les une fois.',
        'Le contrôle électrique peut être planifié lors des mêmes visites.'
      ],
      tip: 'Envoyez-nous la liste des logements (adresse, type, surface approximative) : on vous propose un devis et un planning groupés.',
      faq: [
        ['Faut-il un certificat pour chaque appartement ?', 'Oui : un certificat par logement vendu ou loué.'],
        ['Qu\'est-ce que le rapport partiel ?', 'C\'est le relevé des installations communes de l\'immeuble (chauffage, eau chaude, ventilation…). Il est nécessaire pour certifier chaque appartement qui en dépend.'],
        ['Quel est le prix ?', 'Sur devis, selon le nombre de logements, leur taille et les installations communes. Le prix vous est confirmé avant toute intervention.']
      ],
      sources: [SRC.demarche, SRC.existants, SRC.deroulement]
    }
  ];

  const CARD = {
    peb: (dark) => `<div class="card${dark ? ' dark' : ''}"><h3>Certificat PEB</h3><div class="amt">${P.peb} €<small> ${esc(VAT)} · forfait</small></div><p>Visite, relevés et certificat signé par un certificateur agréé, avec des explications simples.</p>${btn('/?service=peb#devis', 'Demander ce devis')}</div>`,
    pebelec: (dark) => `<div class="card${dark ? ' dark' : ''}"><h3>PEB + contrôle électrique</h3><div class="amt">${P.pebelec} €<small> ${esc(VAT)} · forfait</small></div><p>Les deux documents lors d'une seule visite.</p>${btn('/?service=pebelec#devis', 'Demander ce devis')}</div>`,
    elec: (dark) => `<div class="card${dark ? ' dark' : ''}"><h3>Contrôle électrique</h3><div class="amt" style="font-size:40px">Sur devis</div><p>Contrôle de conformité de l'installation, notamment avant une vente.</p>${btn('/?service=elec#devis', 'Demander ce devis')}</div>`,
    autre: (dark) => `<div class="card${dark ? ' dark' : ''}"><h3>Plusieurs logements</h3><div class="amt" style="font-size:40px">Sur devis</div><p>Certificats, rapport partiel des parties communes et planning groupé.</p>${btn('/?service=autre#devis', 'Demander un devis groupé')}</div>`
  };

  const urls = [];
  const others = s => PAGES.filter(p => p.slug !== s);
  for (const p of PAGES) {
    const body = `
<section class="sub-hero">
  ${GHOST}
  <div class="wrap">
    <ol class="crumbs rise"><li><a href="/">Accueil</a></li><li><a href="/#services">Nos services</a></li><li aria-current="page">${esc(p.short)}</li></ol>
    <h1 class="rise d1">${p.h1}</h1>
    <p class="rise d2">${p.intro}</p>
    <div class="actions rise d3">${btn(`/?service=${p.service}#devis`, 'Devis gratuit')}<a class="btn btn-light" href="#a-savoir">Ce qu'il faut savoir</a></div>
    <ul class="facts rise d3"><li>Certificateur agréé Région wallonne</li><li>Toute la Wallonie</li><li>Prix indicatifs ${esc(VAT)}</li></ul>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <span class="eyebrow">Tarifs</span>
    <h2>Des prix clairs, dès le départ.</h2>
    <div class="cards${p.cards.length === 2 ? ' two' : ''}">${p.cards.map((c, i) => CARD[c](i === 0)).join('')}</div>
    <p class="fine">Tarifs indicatifs, TVA comprise. Le prix final dépend du bien et vous est confirmé avant l'intervention.</p>
  </div>
</section>

<section class="sec" id="a-savoir" style="padding-top:0">
  <div class="wrap split">
    <div>
      <span class="eyebrow">Ce qu'il faut savoir</span>
      <h2>L'essentiel, sans jargon.</h2>
      <ul class="need-list">${p.know.map(k => `<li><span>${k}</span></li>`).join('')}</ul>
      <div class="sources"><b>Sources</b><ul>${p.sources.map(([t, u]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}</a></li>`).join('')}</ul></div>
    </div>
    <aside>${p.photo ? `<img class="need-photo" src="${p.photo[0]}" alt="${esc(p.photo[1])}" width="800" height="1000" loading="lazy" decoding="async" />` : ''}<div class="tip"><b>Notre conseil</b><p>${p.tip}</p></div></aside>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap">
    <span class="eyebrow">Comment ça marche</span>
    <h2>Quatre étapes, un seul interlocuteur.</h2>
    <ol class="steps">
      <li><b>Vous demandez un devis</b>Une minute, depuis votre téléphone.</li>
      <li><b>On fixe le rendez-vous</b>Date, adresse et documents utiles confirmés avec vous.</li>
      <li><b>Visite du bien</b>Relevés sur place, et contrôle électrique si demandé.</li>
      <li><b>Vous recevez vos documents</b>Avec des explications claires.</li>
    </ol>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap">
    <span class="eyebrow">Questions fréquentes</span>
    <h2>Vos questions, nos réponses.</h2>
    <div class="faq">${p.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${a.includes('<a ') ? a : esc(a)}</p></details>`).join('')}</div>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="band">
      <div><h2>On s'occupe de votre dossier ?</h2><p>Une demande d'une minute, sans engagement. Prix confirmé avant toute intervention.</p></div>
      ${btn(`/?service=${p.service}#devis`, 'Devis gratuit')}
    </div>
    <h3 style="font-size:17px;margin-top:44px">Selon votre situation</h3>
    <ul class="chips">${others(p.slug).map(o => `<li><a href="/${o.slug}">${esc(o.short)}</a></li>`).join('')}<li><a href="/certificat-peb">Certificat PEB dans votre commune</a></li></ul>
  </div>
</section>`;
    const provider = { '@type': 'LocalBusiness', name: CONFIG.brand, url: SITE + '/', parentOrganization: { '@type': 'Organization', name: LUX.name, url: LUX.url } };
    const ld = [
      { '@context': 'https://schema.org', '@type': 'Service', name: p.short, serviceType: p.service === 'elec' ? 'Contrôle de l\'installation électrique' : 'Certificat PEB', provider, areaServed: { '@type': 'AdministrativeArea', name: 'Wallonie' } },
      { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: p.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') } })) },
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE + '/' }, { '@type': 'ListItem', position: 2, name: p.short, item: `${SITE}/${p.slug}` }] }
    ];
    fs.writeFileSync(path.join(ROOT, p.slug + '.html'), page({ title: p.title, description: p.description, canonical: '/' + p.slug, body, ld, css: CSS }));
    urls.push('/' + p.slug);
  }
  return { urls, links: PAGES.map(p => ({ href: '/' + p.slug, label: p.short })) };
};
