// Page « Notre histoire » (/notre-histoire) : morceau de build.js.
// Règles : pas de prénoms ni de photos pour l'instant (choix de Nasser), signature « l'équipe Jumeo »,
// aucun chiffre inventé (années d'expérience, nombre de chantiers), Jumeo ne réalise aucune prestation.
'use strict';

module.exports = function histoire({ esc, btn, CONFIG }) {
  const B = esc(CONFIG.brand);
  const RINGS = '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="23" cy="32" r="15" fill="none" stroke="#fff" stroke-width="7"/><circle cx="41" cy="32" r="15" fill="none" stroke="#ff7a45" stroke-width="7"/><path d="M28.13 17.9A15 15 0 0 1 35.14 23.18" fill="none" stroke="#fff" stroke-width="7"/></svg>';

  const body = `
<section class="sub-hero">
  <svg class="ghost" viewBox="0 0 400 240" aria-hidden="true"><circle cx="150" cy="120" r="100"/><circle cx="250" cy="120" r="100"/></svg>
  <div class="wrap">
    <ol class="crumbs rise"><li><a href="/">Accueil</a></li><li aria-current="page">Notre histoire</li></ol>
    <h1 class="rise d1">Deux jumeaux, deux métiers, <span>un seul contact.</span></h1>
    <p class="rise d2">Nous avons grandi à Seraing et nous vivons à Liège. L'un vient des chiffres et des dossiers, l'autre de l'électricité et du terrain. Ensemble, nous avons créé ${B} pour simplifier vos projets immobiliers.</p>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <span class="eyebrow">Qui sommes-nous</span>
    <h2>Deux parcours qui se complètent.</h2>
    <div class="twins">
      <article class="twin">
        <span class="twin-badge">Les dossiers</span>
        <h3>Le côté chiffres et administratif</h3>
        <p>Comptable de formation, il a travaillé en fiduciaire aux côtés d'entrepreneurs et d'indépendants, et travaille aujourd'hui dans la gestion des salaires. Il a aussi une expérience d'agent immobilier.</p>
        <ul class="strengths"><li>Rigueur</li><li>Administratif</li><li>Numérique</li><li>Communication</li></ul>
        <p class="twin-role">Chez ${B} : il organise les demandes, suit les dossiers et veille à ce que tout soit clair, du devis au dernier document.</p>
      </article>
      <article class="twin">
        <span class="twin-badge">Le terrain</span>
        <h3>Le côté technique et énergie</h3>
        <p>Électricien de formation, il a installé des systèmes d'énergie renouvelable et travaillé dans le facility management, la gestion technique des bâtiments.</p>
        <ul class="strengths"><li>Négociation</li><li>Relation client</li><li>Performance des biens</li></ul>
        <p class="twin-role">Chez ${B} : il comprend votre besoin technique, oriente vers le bon professionnel et sait quelles questions poser.</p>
      </article>
    </div>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap split">
    <div class="prose">
      <span class="eyebrow">Pourquoi ${B}</span>
      <h2>Parce qu'un projet immobilier ne devrait pas être un parcours du combattant.</h2>
      <p>Vendre, louer, rénover, installer des panneaux solaires… Chaque projet demande plusieurs professionnels : certificateur, électricien, installateur, entrepreneur. Trouver les bons, comparer, coordonner : c'est souvent là que les choses se compliquent.</p>
      <p>Nous connaissons les deux côtés. Celui des <strong>entreprises</strong>, que l'un de nous a accompagnées en fiduciaire. Et celui des <strong>bâtiments</strong>, que l'autre connaît de l'intérieur, tableau électrique compris.</p>
      <p>Alors on a créé ${B} : vous nous expliquez votre projet, on vous met en relation avec un professionnel compétent et en règle, et on reste votre contact jusqu'au bout.</p>
    </div>
    <aside class="tip">
      <b>Ce que nous faisons</b>
      <ul class="plain">
        <li>On écoute votre projet et on prépare la demande.</li>
        <li>On vous met en relation avec le bon professionnel.</li>
        <li>On coordonne et on suit le dossier.</li>
      </ul>
      <b style="margin-top:18px">Ce que nous ne faisons pas</b>
      <ul class="plain">
        <li>Nous ne réalisons ni travaux, ni installations, ni certificats : ce sont nos partenaires qui les réalisent et les facturent.</li>
        <li>Nous ne donnons pas de conseil comptable ou fiscal.</li>
      </ul>
    </aside>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap">
    <span class="eyebrow">Nos engagements</span>
    <h2>Ce sur quoi vous pouvez compter.</h2>
    <div class="why">
      <div class="card"><b>1</b><h3>La transparence</h3><p>Vous savez toujours qui fait quoi : ${B} coordonne, le professionnel agréé réalise.</p></div>
      <div class="card"><b>2</b><h3>Des partenaires en règle</h3><p>N° d'entreprise, assurance professionnelle et agréments exigés pour leur métier.</p></div>
      <div class="card"><b>3</b><h3>Des prix clairs</h3><p>Des tarifs indicatifs dès le départ, un devis confirmé avant toute intervention.</p></div>
    </div>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="band">
      <div style="display:flex;gap:22px;align-items:center"><span class="band-rings">${RINGS}</span><div><h2>Parlons de votre projet.</h2><p>Un message suffit : on revient vers vous rapidement.</p></div></div>
      ${btn('/#devis', 'Devis gratuit')}
    </div>
  </div>
</section>`;

  const css = `
.twins{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:32px}
@media(max-width:860px){.twins{grid-template-columns:1fr}}
.twin{background:var(--card);border-radius:28px;padding:32px;box-shadow:0 0 0 1px var(--line),0 4px 16px rgba(11,36,65,.05)}
.twin+.twin{background:var(--ink);color:#fff;box-shadow:0 24px 60px rgba(11,36,65,.2)}
.twin-badge{display:inline-flex;align-items:center;gap:8px;font:600 12px 'Inter',sans-serif;letter-spacing:.14em;text-transform:uppercase;margin-bottom:16px}
.twin-badge::before{content:"";width:12px;height:12px;border-radius:50%;border:3px solid var(--ink)}
.twin+.twin .twin-badge::before{border-color:var(--accent)}
.twin h3{font-size:22px;letter-spacing:-.03em;margin-bottom:12px}
.twin p{font-size:16px;color:var(--muted);margin-bottom:16px}
.twin+.twin p{color:var(--w78)}
.strengths{list-style:none;display:flex;flex-wrap:wrap;gap:8px;margin-bottom:18px}
.strengths li{font-size:13.5px;font-weight:600;padding:6px 12px;border-radius:999px;background:var(--paper)}
.twin+.twin .strengths li{background:rgba(255,255,255,.1)}
.twin-role{padding-top:16px;border-top:1px solid var(--line);font-size:15px!important}
.twin+.twin .twin-role{border-color:var(--wline)}
.plain{list-style:none;display:grid;gap:8px;margin-bottom:6px}
.plain li{font-size:15px;color:var(--ink);padding-left:16px;position:relative}
.plain li::before{content:"";position:absolute;left:0;top:10px;width:6px;height:6px;border-radius:50%;background:var(--accent)}
.band-rings svg{width:64px;height:64px}
@media(max-width:600px){.band-rings{display:none}}
`;

  return {
    file: 'notre-histoire.html', url: '/notre-histoire',
    title: `Notre histoire : deux jumeaux de Seraing | ${CONFIG.brand}`,
    description: `${CONFIG.brand}, ce sont deux frères jumeaux de Seraing : un comptable passé par l'immobilier et un électricien tourné vers les énergies renouvelables. Un seul contact pour vos projets.`,
    body, css
  };
};
