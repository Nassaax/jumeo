// Articles de la rubrique « Guides » (générés par build.js en /guides/<slug>).
// Règle : chaque affirmation PEB ou légale doit être confirmée (data/regles-peb.md) et sourcée en bas d'article.
// « cat » : PEB · Électricité (filtres de la page /guides).
// « image » (facultatif) : [chemin, texte alternatif], photo libre de droits (1200 × 675).
// « seo » (facultatif) : titre court pour Google (60–70 caractères max avec « | Wall’PEB »).
// Le corps est du HTML simple : <h2>, <p>, <ul>, <ol>, <strong>, <a>.
'use strict';

const SRC = {
  existants: ['Certificat PEB : bâtiments existants (SPW Énergie)', 'https://energie.wallonie.be/home/performance-energetique-des-batiments/batiments-residentiels/achat-vente-location/obligations/certificat-peb--quoi--quand--comment/certificat-peb--batiments-existants.html'],
  deroulement: ['Déroulement de la certification PEB de votre bâtiment (SPW Énergie, PDF)', 'https://energie.wallonie.be/files/PEB/B%C3%A2timents%20r%C3%A9sidentiels/Achat-vente-location/outils/conseils%20pratiques%20-%20publications/Visite%20du%20certificateur%20les%20documents%20%C3%A0%20pr%C3%A9parer/20170420-deroulement-certification.pdf'],
  pieces: ['Document explicatif sur les pièces justificatives (SPW Énergie, PDF)', 'https://energie.wallonie.be/files/PEB/Pour%20les%20professionnels/Outils/La%20r%C3%A9glementation%20wallonne%20-%20PEB/Documents%20utiles/2020403-doc-explicatif-sur-les-pieces-justificatives-vf.pdf'],
  demarche: ['Vendre, acheter, louer : obtenir un certificat PEB (Wallonie)', 'https://www.wallonie.be/en/demarches/sellingbuyingleasing-obtaining-epb-certificate'],
  actu2026: ['Le certificat PEB évolue pour mieux comprendre son logement et planifier ses travaux (Wallonie)', 'https://www.wallonie.be/fr/actualites/le-certificat-peb-evolue-pour-mieux-comprendre-son-logement-et-planifier-ses-travaux'],
  neven: ['Le certificat PEB vous aidera désormais à planifier vos travaux (cabinet de la ministre Cécile Neven)', 'https://neven.wallonie.be/home/communiques-de-presse/presses/le-certificat-peb-vous-aidera-desormais-a-planifier-vos-travaux.html'],
  libre: ['Du neuf pour le PEB en Wallonie (La Libre, 01/09/2026)', 'https://www.lalibre.be/economie/immo/2026/09/01/du-neuf-pour-le-peb-en-wallonie-VKV3BLCABZFONJ5MS3GPB3RCA4/'],
  finCompensation: ['Panneaux photovoltaïques : fin du compteur qui tourne à l\'envers (Wallonie)', 'https://www.wallonie.be/fr/actualites/panneaux-photovoltaiques-fin-du-compteur-qui-tourne-lenvers'],
  cwapeCompensation: ['Puis-je continuer à bénéficier du principe de compensation avec un compteur communicant ? (CWaPE)', 'https://www.cwape.be/node/5205'],
  cwapeCompteur: ['Quel compteur pour un prosumer ? (CWaPE)', 'https://www.cwape.be/node/149'],
  oresAvant2024: ['Installation mise en service avant le 1er janvier 2024 (ORES)', 'https://www.ores.be/particulier/compensation-avant-0101'],
  up10: ['Procédure de notification de mise en service d\'une installation photovoltaïque, formulaire UP10 (SPW Énergie, PDF)', 'https://energie.wallonie.be/servlet/Repository/procedure-de-notification-de-mise-en-service-pv-up10-fr-1-04.pdf?ID=86400'],
  notifier: ['Notifier au gestionnaire de réseau la mise en service d\'une installation (Wallonie)', 'https://wallonie.be/fr/demarches/production-delectricite-verte-notifier-au-gestionnaire-de-reseau-de-distribution-la-mise-en-service-dune-installation'],
  rescert: ['Arrêté du Gouvernement wallon du 16/02/2023 : certification des installateurs d\'énergie renouvelable (Wallex, PDF)', "https://wallex.wallonie.be/files/pdfs/19/308_Arr%c3%aat%c3%a9_du_Gouvernement_wallon_mettant_en_place_un_syst%c3%a8me_de_certification_des_installateurs_de_syst%c3%a8mes_de_production_d'%c3%a9nergie_%c3%a0_partir_de_sources_renouvelables_et_des_professionnels_des_travaux_16-02-2023-.pdf"],
  bce: ['Recherche publique dans la Banque-Carrefour des Entreprises (SPF Économie)', 'https://kbopub.economie.fgov.be/kbopub/zoeknaamfonetischform.html?lang=fr'],
  mazout2031: ['Chaudières au mazout et au charbon : la Wallonie reporte l\'interdiction à 2031 (Wallonie)', 'https://www.wallonie.be/fr/actualites/chaudieres-au-mazout-et-au-charbon-la-wallonie-reporte-linterdiction-2031'],
  mazoutEnergie: ['Chaudières au mazout et au charbon : une transition progressive à partir de 2031 (L\'Énergie en Wallonie)', 'https://energie.wallonie.be/actualite/chaudieres-au-mazout-et-au-charbon-une-transition-progressive-a-partir-de-2031'],
  chauffageChoisir: ['Quel système de chauffage choisir ? (L\'Énergie en Wallonie)', 'https://energie.wallonie.be/home/performance-energetique-des-batiments/batiments-residentiels/renovation-walloreno/conseils-pratiques/se-chauffer-1/quel-systeme-de-chauffage-choisir.html'],
  notaireVendre: ['Vendre un bien (notaire.be)', 'https://www.notaire.be/immobilier/acheter-et-vendre-un-bien-immobilier/vendre-un-bien'],
  notaireLexique: ['Contrôle de l\'installation électrique, lexique (notaire.be)', 'https://notaire.be/lexique/C/controle-de-linstallation-electrique?locale=fr'],
  notaireBrochure: ['Brochure « Je vends mon bien » 2025 (notaire.be, PDF)', 'https://www.notaire.be/sites/default/files/files/2025-07/Brochure-Je-vends-2025-LD.pdf'],
  peeters: ['Loi du 31 mai 2017 relative à l\'assurance obligatoire de la responsabilité décennale (Justel)', 'https://www.ejustice.just.fgov.be/cgi_loi/change_lg.pl?language=fr&la=F&cn=2017053102&table_name=loi'],
  certifPdf: ['Le certificat PEB : quelles informations ? (SPW Énergie, PDF)', 'https://energie.wallonie.be/files/PEB/B%C3%A2timents%20r%C3%A9sidentiels/Achat-vente-location/Obligations/quelles-informations-dans-le-certificat-peb-depuis-le-3-novembre-2014.pdf'],
  walloreno: ['Guide pratique pour rénover votre logement avec Walloreno, 2026 (SPW Énergie, PDF)', 'https://energie.wallonie.be/files/PEB/B%C3%A2timents%20r%C3%A9sidentiels/R%C3%A9novation/Outils/Publications/Walloreno/brochureWalloreno_2026.pdf'],
  planReno: ['Plan wallon de rénovation énergétique des bâtiments, novembre 2025 (SPW Énergie, PDF)', 'https://energie.wallonie.be/files/strat%C3%A9gies%20et%20politiques/Plan%20Wallon%20de%20R%C3%A9novation%20Energ%C3%A9tique%20des%20B%C3%A2timents%20-%20Novembre%202025/20251201%20Rapport_Plan_Reno_v4_avec%20annexes.pdf'],
  quoiQuand: ['Certificat PEB : quoi ? quand ? comment ? (L\'Énergie en Wallonie)', 'https://energie.wallonie.be/home/performance-energetique-des-batiments/batiments-residentiels/achat-vente-location/obligations/certificat-peb--quoi--quand--comment.html'],
  pubLocation: ['Publicité et mise en location (Le site officiel du logement en Wallonie)', 'https://logement.wallonie.be/fr/bail/publicite-mise-en-location'],
  primes: ['Prime pour son habitation (L\'Énergie en Wallonie)', 'https://energie.wallonie.be/home/soutiens-financiers/particuliers/primes-pour-la-renovation/prime-habitation/prime-pour-son-habitation-a-partir-du-14-fevrier-2025.html'],
};

module.exports = [
  {
    slug: 'nouveau-certificat-peb-2026',
    date: '2026-11-18',
    tag: 'Nouveauté',
    cat: 'PEB',
    title: 'Nouveau certificat PEB 2026 : la feuille de route de rénovation expliquée',
    seo: 'Nouveau certificat PEB 2026 : la feuille de route expliquée',
    description: "Depuis le 1er septembre 2026, le certificat PEB wallon contient une feuille de route de rénovation. Ce qui change, ce qui ne change pas, et ce que ça veut dire pour vous.",
    lead: "Depuis le 1er septembre 2026, le certificat PEB des logements existants ne se contente plus de donner une note : il indique aussi par où commencer les travaux. Voici l'essentiel, sans jargon.",
    body: `
<h2>Ce qui change</h2>
<p>Chaque <strong>nouveau</strong> certificat PEB d'un logement existant comprend désormais une <strong>feuille de route de rénovation</strong>. Elle identifie les travaux à faire en priorité, les gains d'énergie attendus et les aides disponibles.</p>
<p>Autre nouveauté utile : si le logement a des panneaux photovoltaïques, le certificat affiche son <strong>label réel</strong> et celui qu'il obtiendrait <strong>sans les panneaux</strong>. On voit ainsi la performance du bâtiment lui-même, séparément de sa production d'électricité.</p>

<h2>Ce qui ne change pas</h2>
<ul>
  <li><strong>Votre certificat actuel reste valable</strong> jusqu'à sa date d'échéance. Si vous en avez un, vous n'avez rien à faire.</li>
  <li>La feuille de route <strong>ne modifie pas la note</strong> du certificat.</li>
  <li>Le certificat reste obligatoire pour vendre ou louer, et il est toujours valable 10 ans.</li>
  <li>Seul un certificateur agréé par la Région wallonne peut l'établir.</li>
</ul>

<h2>À quoi sert la feuille de route ?</h2>
<p>Elle sert surtout à <strong>planifier</strong>. Pour un acheteur, c'est une première idée des travaux à prévoir et dans quel ordre. Pour un propriétaire, c'est un point de départ pour étaler les rénovations dans le temps.</p>
<p>Elle ne remplace pas l'<strong>audit logement</strong>, qui reste plus complet et plus précis, et qui est réalisé par un auditeur agréé.</p>

<h2>Et après ?</h2>
<p>La Wallonie annonce une révision plus profonde de la méthode de calcul vers 2028-2029, notamment pour mieux tenir compte du confort d'été. C'est une annonce : rien n'est encore en vigueur.</p>

<h2>En pratique</h2>
<ol>
  <li>Vous vendez ou louez bientôt ? Commandez le certificat avant de publier l'annonce.</li>
  <li>Préparez vos preuves (photos de chantier, factures détaillées, fiches techniques) : elles comptent dans le résultat.</li>
  <li>Lisez la feuille de route avec le certificateur : c'est le bon moment pour poser vos questions.</li>
</ol>`,
    sources: [SRC.neven, SRC.actu2026, SRC.libre]
  },
  {
    slug: 'preuves-certificat-peb',
    date: '2026-11-18',
    tag: 'Préparer la visite',
    cat: 'PEB',
    title: 'Certificat PEB : quelles preuves préparer pour un résultat juste ?',
    seo: 'Certificat PEB : quelles preuves préparer ?',
    description: "Photos de chantier, factures, fiches techniques, permis : ce que le certificateur PEB accepte comme preuve en Wallonie, et pourquoi les plans ne suffisent pas.",
    lead: "Deux maisons identiques peuvent obtenir deux labels différents. La différence ? Souvent les preuves. Voici ce qui compte vraiment le jour de la visite.",
    body: `
<h2>Pourquoi les preuves comptent autant</h2>
<p>Le certificateur ne peut pas tout voir : l'isolant est caché dans le mur, sous le toit ou sous le sol. Quand il ne peut ni le constater, ni le tester, ni le prouver, il doit appliquer des <strong>valeurs par défaut</strong>. Et ces valeurs sont, dans la plupart des cas, <strong>plus défavorables</strong> que la réalité.</p>
<p>Une valeur par défaut ne veut pas dire que votre isolation est mauvaise. Elle veut dire qu'on n'a pas pu vérifier qu'elle était bonne.</p>

<h2>Ce qui est accepté comme preuve</h2>
<ul>
  <li><strong>Photos de chantier</strong> : une photo prise pendant les travaux, qui montre qu'une paroi a bien été isolée. C'est souvent la preuve la plus précieuse.</li>
  <li><strong>Factures</strong> : elles servent pour certaines données précises (référence du produit, type, date de fabrication, puissance d'un appareil). Une facture détaillée vaut mieux qu'un total global.</li>
  <li><strong>Fiches techniques</strong> des équipements : chaudière, pompe à chaleur, ventilation, châssis, panneaux.</li>
  <li><strong>Permis d'urbanisme</strong> : il peut prouver l'année de construction.</li>
</ul>

<h2>Ce qui ne suffit pas</h2>
<p><strong>Les plans de la maison ne sont pas une preuve acceptable</strong> à eux seuls. Ils restent utiles pour la visite, mais ils ne prouvent pas ce qui a réellement été construit.</p>

<h2>Le certificateur vous envoie la liste</h2>
<p>Bonne nouvelle : vous n'avez pas à deviner. Le certificateur doit vous transmettre la <strong>liste écrite des preuves acceptables</strong> au moins 5 jours avant la visite, si la date de commande le permet. Il mentionne ensuite dans le certificat les preuves qu'il a utilisées.</p>

<h2>Notre conseil</h2>
<ol>
  <li>Rassemblez tout dans une seule farde (papier ou dossier sur votre téléphone), classé par poste : toiture, murs, sol, châssis, chauffage, ventilation.</li>
  <li>Vous faites des travaux ? <strong>Photographiez l'isolant avant qu'il soit caché</strong>, avec un repère (mètre, pièce reconnaissable).</li>
  <li>Demandez à vos entrepreneurs des factures détaillées, avec la référence et l'épaisseur des produits.</li>
</ol>`,
    sources: [SRC.deroulement, SRC.pieces]
  },
  {
    slug: 'vendre-louer-certificat-peb',
    date: '2026-11-18',
    tag: 'Vendre ou louer',
    cat: 'PEB',
    title: 'Vendre ou louer en Wallonie : le certificat PEB en 6 questions',
    seo: 'Vendre ou louer : le certificat PEB en 6 questions',
    description: "Quand faut-il un certificat PEB, combien de temps est-il valable, que faire pour un appartement, faut-il un label minimum pour louer ? Les réponses simples.",
    lead: "Vous mettez un bien en vente ou en location ? Le certificat PEB est l'une des premières choses à prévoir. Voici les réponses aux questions qu'on nous pose le plus.",
    body: `
<h2>1. Est-il obligatoire ?</h2>
<p>Oui. Un certificat PEB est obligatoire dès qu'un logement, maison ou appartement, est mis en <strong>vente</strong> ou en <strong>location</strong> en Wallonie.</p>

<h2>2. Quand faut-il l'avoir ?</h2>
<p><strong>Avant de publier l'annonce.</strong> Ses indicateurs doivent figurer dans la publicité du bien. Ne pas en avoir est sanctionné par une amende administrative. Le plus simple : le commander dès que la décision de vendre ou de louer est prise.</p>

<h2>3. Combien de temps est-il valable ?</h2>
<p><strong>10 ans</strong>, sauf si des travaux importants modifient la performance du logement. Un certificat encore valable peut être réutilisé pour une nouvelle vente ou une nouvelle location.</p>

<h2>4. Et pour un appartement ?</h2>
<p>Chaque appartement vendu ou loué a besoin de <strong>son propre certificat</strong>. Si l'immeuble a des installations communes (chauffage, eau chaude, ventilation ou panneaux photovoltaïques), un <strong>rapport partiel</strong> sur ces parties communes est nécessaire pour établir le certificat de chaque appartement. Renseignez-vous auprès du syndic.</p>

<h2>5. Faut-il un label minimum pour louer ?</h2>
<p><strong>Non, pas aujourd'hui.</strong> Aucun label minimum n'est exigé en Wallonie pour mettre un logement en location. Des évolutions sont annoncées, mais elles ne sont pas toutes votées : méfiez-vous des affirmations trop sûres.</p>

<h2>6. Qui peut l'établir ?</h2>
<p>Uniquement un <strong>certificateur agréé par la Région wallonne</strong>. Vérifiez toujours son agrément. Chez Wall’PEB, le certificat est établi et signé par le certificateur agréé de Lux Energie Solution.</p>`,
    sources: [SRC.demarche, SRC.existants]
  },
  {
    slug: 'controle-electrique-vente',
    date: '2026-11-18',
    tag: 'Vendre',
    cat: 'Électricité',
    service: 'pebelec',
    title: 'Vendre une maison : le contrôle électrique expliqué simplement',
    seo: 'Vendre une maison : le contrôle électrique expliqué',
    description: "Qui doit le faire, quand, qui paie, et que se passe-t-il si l'installation n'est pas conforme ? Le contrôle électrique à la vente d'une habitation, en clair.",
    lead: "Avec le certificat PEB, le contrôle de l'installation électrique est l'autre document incontournable quand on vend une habitation. Voici comment ça marche, sans jargon.",
    body: `
<h2>Est-ce obligatoire ?</h2>
<p>Oui. Pour toute vente d'une habitation équipée d'une installation électrique, le vendeur doit remettre à l'acheteur :</p>
<ul>
  <li>soit un <strong>procès-verbal de conformité de moins de 25 ans</strong> ;</li>
  <li>soit le procès-verbal d'une <strong>visite de contrôle</strong> réalisée par un <strong>organisme agréé</strong>.</li>
</ul>
<p>Le document est remis au plus tard à la signature de l'acte authentique chez le notaire.</p>

<h2>Qui paie ?</h2>
<p>L'obligation est à charge du vendeur : en principe, les frais aussi. Vendeur et acheteur peuvent toutefois s'entendre autrement.</p>

<h2>Et si l'installation n'est pas conforme ?</h2>
<p>Pas de panique : la vente reste possible. L'acheteur informe l'organisme de contrôle de son identité et de la date de l'acte, puis fait réaliser une <strong>nouvelle visite</strong>, en principe dans les <strong>18 mois</strong> qui suivent l'acte, par l'organisme agréé de son choix. Entre-temps, il fait réaliser les travaux nécessaires.</p>
<p>Un procès-verbal non conforme peut toutefois peser dans la négociation : mieux vaut le connaître tôt.</p>

<h2>Et après ?</h2>
<p>Une installation déclarée conforme doit être recontrôlée au plus tard <strong>25 ans</strong> après la visite, ou plus tôt en cas de <strong>modification ou d'extension importante</strong> (par exemple l'ajout de circuits importants).</p>

<h2>Notre conseil</h2>
<ol>
  <li>Faites le contrôle <strong>dès que vous décidez de vendre</strong>, en même temps que le certificat PEB.</li>
  <li>Rassemblez vos documents : ancien procès-verbal, schémas et plans électriques si vous les avez.</li>
  <li>Prévenez votre notaire : il vous dira ce qu'il lui faut et quand.</li>
</ol>`,
    sources: [SRC.notaireVendre, SRC.notaireLexique, SRC.notaireBrochure]
  },
  {
    slug: 'peb-c-est-quoi',
    image: ['/photos/peb-etiquette.webp', 'Étiquette énergétique de A à G affichée devant un ordinateur portable'],
    date: '2026-11-24',
    tag: 'Les bases',
    cat: 'PEB',
    service: 'peb',
    title: 'Le PEB, c\'est quoi ? Les labels de A++ à G expliqués simplement',
    seo: 'Le PEB, c\'est quoi ? Les labels A++ à G expliqués',
    description: "Que mesure le certificat PEB, comment est calculé le label, que veulent dire A++, B ou G ? Les bases du certificat PEB en Wallonie, sans jargon.",
    lead: "Le certificat PEB, c'est la carte d'identité énergétique d'un logement. Il donne un label de A++ (le plus performant) à G (le plus énergivore). Voici comment le lire.",
    body: `
<h2>Ce que mesure le certificat</h2>
<p>Le certificat PEB (performance énergétique des bâtiments) estime la quantité d'énergie dont le logement a besoin pour le chauffage, l'eau chaude, la ventilation et le refroidissement, <strong>dans des conditions standardisées</strong>. C'est une consommation <strong>théorique</strong> : elle permet de comparer les logements entre eux, mais elle peut différer de votre facture réelle, qui dépend aussi de vos habitudes.</p>

<h2>Comment le label est calculé</h2>
<p>Le label se base sur l'<strong>Espec</strong> : la consommation théorique annuelle d'énergie primaire, divisée par la surface de plancher chauffée. Elle s'exprime en <strong>kWh par m² et par an</strong>.</p>
<div class="peb-scale" role="img" aria-label="Échelle des labels PEB en Wallonie, de A++ à G, en kWh par m² et par an">
  <div style="--w:22%;--c:#0e6b3a"><b>A++</b><span>≤ 0 kWh/m².an</span></div>
  <div style="--w:30%;--c:#1a7f45"><b>A+</b><span>0 – 45 kWh/m².an</span></div>
  <div style="--w:38%;--c:#3f8f3a"><b>A</b><span>45 – 85 kWh/m².an</span></div>
  <div style="--w:46%;--c:#6c8f22"><b>B</b><span>85 – 170 kWh/m².an</span></div>
  <div style="--w:54%;--c:#8a8a12"><b>C</b><span>170 – 255 kWh/m².an</span></div>
  <div style="--w:62%;--c:#a07d00"><b>D</b><span>255 – 340 kWh/m².an</span></div>
  <div style="--w:70%;--c:#c0631a"><b>E</b><span>340 – 425 kWh/m².an</span></div>
  <div style="--w:80%;--c:#cf4a2a"><b>F</b><span>425 – 510 kWh/m².an</span></div>
  <div style="--w:90%;--c:#b8261e"><b>G</b><span>> 510 kWh/m².an</span></div>
</div>
<p>Si le logement a des panneaux photovoltaïques, leur production est déduite. Le nouveau certificat (depuis septembre 2026) indique le label réel <strong>et</strong> celui qu'aurait le logement sans les panneaux.</p>

<h2>Quand est-il obligatoire ?</h2>
<p>Pour <strong>vendre ou louer</strong> un logement en Wallonie. Il doit exister avant la publicité du bien, et ses indicateurs figurent dans l'annonce. Il est valable <strong>10 ans</strong>, sauf travaux qui modifient la performance.</p>

<h2>Qui peut l'établir ?</h2>
<p>Uniquement un <strong>certificateur agréé par la Région wallonne</strong>, après une visite du bien. Chez Wall’PEB, c'est le certificateur agréé de Lux Energie Solution.</p>

<h2>Et demain ?</h2>
<p>Des évolutions sont annoncées (labels minimum à terme), mais elles ne sont pas toutes votées : méfiez-vous des affirmations trop sûres et vérifiez sur les sites officiels.</p>`,
    sources: [SRC.certifPdf, SRC.walloreno, SRC.planReno, SRC.existants, SRC.actu2026]
  },
  {
    slug: 'amendes-certificat-peb',
    date: '2026-11-24',
    tag: 'Amendes & sanctions',
    cat: 'PEB',
    service: 'peb',
    title: 'Vendre ou louer sans certificat PEB : quelles amendes en Wallonie ?',
    seo: 'Sans certificat PEB : quelles amendes en Wallonie ?',
    description: "Pas de certificat PEB, indicateurs absents de l'annonce, certificat non remis : les amendes administratives prévues en Wallonie, et comment les éviter.",
    lead: "Mettre un logement en vente ou en location sans certificat PEB valable n'est pas un détail : la Wallonie prévoit des amendes administratives. Voici lesquelles, et comment rester en règle.",
    body: `
<h2>Les amendes prévues</h2>
<ul>
  <li><strong>1 000 €</strong> (forfait) : pas de certificat PEB valable au moment de la mise en vente ou en location.</li>
  <li><strong>500 €</strong> : les indicateurs PEB ne figurent pas dans la publicité (annonce).</li>
  <li><strong>500 €</strong> : le certificat n'est pas remis à l'acheteur ou au locataire.</li>
</ul>
<p>Le décret PEB prévoit une fourchette légale de 250 € à 50 000 € ; les montants ci-dessus sont ceux fixés pour ces manquements, tels que publiés par la Région (vérifiés le 24 novembre 2026).</p>

<h2>Comment rester en règle</h2>
<ol>
  <li><strong>Commandez le certificat avant de publier l'annonce</strong>, même une simple affiche ou une annonce en ligne.</li>
  <li><strong>Reprenez les indicateurs PEB dans l'annonce</strong> : votre agence ou le site d'annonces vous indique où les mettre.</li>
  <li><strong>Remettez une copie du certificat</strong> à l'acheteur ou au locataire.</li>
  <li><strong>Vérifiez la date</strong> de votre certificat : il est valable 10 ans, sauf travaux qui modifient la performance.</li>
</ol>

<h2>Bon à savoir</h2>
<p>Ces montants peuvent évoluer : en cas de doute, consultez les sources officielles ci-dessous ou demandez à votre notaire.</p>`,
    sources: [SRC.quoiQuand, SRC.pubLocation, SRC.demarche]
  },
  {
    slug: 'ameliorer-label-peb',
    date: '2026-11-24',
    tag: 'Améliorer son PEB',
    cat: 'PEB',
    service: 'peb',
    title: 'Améliorer son label PEB : par où commencer ?',
    seo: 'Améliorer son label PEB : par où commencer ?',
    description: "Humidité, isolation, châssis, chauffage : l'ordre des travaux recommandé par la Wallonie pour améliorer le label PEB de votre logement, et les preuves à garder.",
    lead: "Votre label PEB est mauvais et vous voulez l'améliorer ? Avant de vous lancer, suivez l'ordre recommandé par la Wallonie : c'est le plus efficace, et le moins cher sur la durée.",
    body: `
<h2>1. Lisez votre feuille de route</h2>
<p>Depuis le 1er septembre 2026, le certificat des logements existants comprend une <strong>feuille de route de rénovation</strong> : les travaux à prévoir en priorité. C'est le meilleur point de départ.</p>

<h2>2. L'ordre recommandé</h2>
<ol>
  <li><strong>Réglez d'abord l'humidité</strong> : isoler un mur humide crée des problèmes.</li>
  <li><strong>Isolez l'enveloppe</strong> : toiture, murs, sol, et des châssis performants. La chaleur qui ne s'échappe plus, c'est de l'énergie que vous n'achetez plus.</li>
  <li><strong>Améliorez ensuite les systèmes</strong> : chauffage, eau chaude, ventilation. Un système bien dimensionné pour une maison déjà isolée coûte moins cher.</li>
</ol>
<p>Pour un projet important, un <strong>audit logement</strong> (réalisé par un auditeur agréé) aide à prioriser les travaux.</p>

<h2>3. Gardez toutes les preuves</h2>
<p>C'est souvent oublié : sans preuve (facture, fiche technique, photos pendant le chantier), le certificateur doit appliquer des <strong>valeurs par défaut</strong>, en général moins favorables. Des travaux bien faits mais non prouvés peuvent ne pas améliorer votre label.</p>

<h2>4. Renseignez-vous sur les aides</h2>
<p>La Wallonie soutient la rénovation énergétique, mais les primes changent régulièrement. Vérifiez les conditions en vigueur sur le site officiel avant de signer vos devis.</p>

<h2>5. Faites refaire le certificat</h2>
<p>Après des travaux qui modifient la performance, un nouveau certificat reflète votre nouveau label : utile pour vendre ou louer.</p>`,
    sources: [SRC.walloreno, SRC.actu2026, SRC.pieces, SRC.primes]
  },
  {
    slug: 'prix-certificat-peb',
    date: '2026-11-24',
    tag: 'Prix',
    cat: 'PEB',
    service: 'peb',
    title: 'Prix d\'un certificat PEB en Wallonie : ce qui le fait varier',
    seo: 'Prix d\'un certificat PEB en Wallonie : ce qui varie',
    description: "Combien coûte un certificat PEB en Wallonie, qu'est-ce qui est compris, et qu'est-ce qui fait varier le prix ? Nos forfaits indicatifs et nos conseils pour bien comparer.",
    lead: "Le prix d'un certificat PEB n'est pas fixé par la Région : chaque certificateur fixe le sien. Voici ce qui le fait varier, ce qui doit être compris, et nos tarifs.",
    body: `
<h2>Nos tarifs</h2>
<ul>
  <li><strong>Certificat PEB : 250 € TVAC</strong> (forfait indicatif)</li>
  <li><strong>PEB + contrôle électrique : 300 € TVAC</strong>, lors d'une seule visite</li>
  <li><strong>Contrôle électrique seul : sur devis</strong></li>
</ul>
<p>Prix indicatifs : le prix final dépend du bien et vous est confirmé avant l'intervention.</p>

<h2>Ce qui fait varier le prix</h2>
<ul>
  <li><strong>La taille et le type du bien</strong> : un studio demande moins de relevés qu'une grande maison.</li>
  <li><strong>Les installations communes</strong> : dans un immeuble, un rapport partiel des parties communes peut être nécessaire.</li>
  <li><strong>Le nombre de logements</strong> : plusieurs certificats dans le même immeuble se planifient ensemble.</li>
  <li><strong>Le contrôle électrique</strong> : le faire au même rendez-vous évite un second déplacement.</li>
</ul>

<h2>Ce qui doit être compris</h2>
<ul>
  <li>La visite sur place et les relevés.</li>
  <li>Le certificat établi et signé par un certificateur agréé.</li>
  <li>Pour les logements existants, la feuille de route de rénovation (depuis septembre 2026).</li>
  <li>Des explications sur votre résultat.</li>
</ul>

<h2>Comment bien comparer</h2>
<p>Comparez les prix <strong>TVA comprise</strong>, vérifiez ce qui est inclus, et demandez le numéro d'agrément du certificateur : la liste officielle est publiée par la Région wallonne. Et préparez vos preuves : un dossier complet, c'est un certificat plus fidèle à votre bien.</p>`,
    sources: [SRC.existants, SRC.deroulement, SRC.pieces, SRC.actu2026]
  },
];

// Sources réutilisées par les pages « selon votre situation » (tools/besoins-part.js).
module.exports.SRC = SRC;
