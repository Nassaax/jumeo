// Articles de la rubrique « Guides » (générés par build.js en /guides/<slug>).
// Règle : chaque affirmation PEB ou légale doit être confirmée (data/regles-peb.md) et sourcée en bas d'article.
// « seo » (facultatif) : titre court pour Google (60–70 caractères max avec « | Jumeo »).
// Le corps est du HTML simple : <h2>, <p>, <ul>, <ol>, <strong>, <a>.
'use strict';

const SRC = {
  existants: ['Certificat PEB : bâtiments existants (SPW Énergie)', 'https://energie.wallonie.be/home/performance-energetique-des-batiments/batiments-residentiels/achat-vente-location/obligations/certificat-peb--quoi--quand--comment/certificat-peb--batiments-existants.html'],
  deroulement: ['Déroulement de la certification PEB de votre bâtiment (SPW Énergie, PDF)', 'https://energie.wallonie.be/files/PEB/B%C3%A2timents%20r%C3%A9sidentiels/Achat-vente-location/outils/conseils%20pratiques%20-%20publications/Visite%20du%20certificateur%20les%20documents%20%C3%A0%20pr%C3%A9parer/20170420-deroulement-certification.pdf'],
  pieces: ['Document explicatif sur les pièces justificatives (SPW Énergie, PDF)', 'https://energie.wallonie.be/files/PEB/Pour%20les%20professionnels/Outils/La%20r%C3%A9glementation%20wallonne%20-%20PEB/Documents%20utiles/2020403-doc-explicatif-sur-les-pieces-justificatives-vf.pdf'],
  demarche: ['Vendre, acheter, louer : obtenir un certificat PEB (Wallonie)', 'https://www.wallonie.be/en/demarches/sellingbuyingleasing-obtaining-epb-certificate'],
  actu2026: ['Le certificat PEB évolue pour mieux comprendre son logement et planifier ses travaux (Wallonie)', 'https://www.wallonie.be/fr/actualites/le-certificat-peb-evolue-pour-mieux-comprendre-son-logement-et-planifier-ses-travaux'],
  neven: ['Le certificat PEB vous aidera désormais à planifier vos travaux (cabinet de la ministre Cécile Neven)', 'https://neven.wallonie.be/home/communiques-de-presse/presses/le-certificat-peb-vous-aidera-desormais-a-planifier-vos-travaux.html'],
  libre: ['Du neuf pour le PEB en Wallonie (La Libre, 01/09/2026)', 'https://www.lalibre.be/economie/immo/2026/09/01/du-neuf-pour-le-peb-en-wallonie-VKV3BLCABZFONJ5MS3GPB3RCA4/']
};

module.exports = [
  {
    slug: 'nouveau-certificat-peb-2026',
    date: '2026-11-18',
    tag: 'Nouveauté',
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
    title: 'Vendre ou louer en Wallonie : le certificat PEB en 6 questions',
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
<p>Uniquement un <strong>certificateur agréé par la Région wallonne</strong>. Vérifiez toujours son agrément. Chez Jumeo, nous coordonnons votre demande et le certificat est établi par notre certificateur partenaire agréé.</p>`,
    sources: [SRC.demarche, SRC.existants]
  }
];
