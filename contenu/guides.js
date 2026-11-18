// Articles de la rubrique « Guides » (générés par build.js en /guides/<slug>).
// Règle : chaque affirmation PEB ou légale doit être confirmée (data/regles-peb.md) et sourcée en bas d'article.
// « cat » : PEB · Énergie renouvelable · Rénovation · Électricité (filtres de la page /guides).
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
  libre: ['Du neuf pour le PEB en Wallonie (La Libre, 01/09/2026)', 'https://www.lalibre.be/economie/immo/2026/09/01/du-neuf-pour-le-peb-en-wallonie-VKV3BLCABZFONJ5MS3GPB3RCA4/'],
  finCompensation: ['Panneaux photovoltaïques : fin du compteur qui tourne à l\'envers (Wallonie)', 'https://www.wallonie.be/fr/actualites/panneaux-photovoltaiques-fin-du-compteur-qui-tourne-lenvers'],
  cwapeCompensation: ['Puis-je continuer à bénéficier du principe de compensation avec un compteur communicant ? (CWaPE)', 'https://www.cwape.be/node/5205'],
  cwapeCompteur: ['Quel compteur pour un prosumer ? (CWaPE)', 'https://www.cwape.be/node/149'],
  oresAvant2024: ['Installation mise en service avant le 1er janvier 2024 (ORES)', 'https://www.ores.be/particulier/compensation-avant-0101'],
  up10: ['Procédure de notification de mise en service d\'une installation photovoltaïque, formulaire UP10 (SPW Énergie, PDF)', 'https://energie.wallonie.be/servlet/Repository/procedure-de-notification-de-mise-en-service-pv-up10-fr-1-04.pdf?ID=86400'],
  notifier: ['Notifier au gestionnaire de réseau la mise en service d\'une installation (Wallonie)', 'https://wallonie.be/fr/demarches/production-delectricite-verte-notifier-au-gestionnaire-de-reseau-de-distribution-la-mise-en-service-dune-installation'],
  rescert: ['Arrêté du Gouvernement wallon du 16/02/2023 : certification des installateurs d\'énergie renouvelable (Wallex, PDF)', "https://wallex.wallonie.be/files/pdfs/19/308_Arr%c3%aat%c3%a9_du_Gouvernement_wallon_mettant_en_place_un_syst%c3%a8me_de_certification_des_installateurs_de_syst%c3%a8mes_de_production_d'%c3%a9nergie_%c3%a0_partir_de_sources_renouvelables_et_des_professionnels_des_travaux_16-02-2023-.pdf"],
  bce: ['Recherche publique dans la Banque-Carrefour des Entreprises (SPF Économie)', 'https://kbopub.economie.fgov.be/kbopub/zoeknaamfonetischform.html?lang=fr']
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
  },
  {
    slug: 'photovoltaique-wallonie-ce-qui-a-change',
    date: '2026-11-18',
    tag: 'Panneaux solaires',
    cat: 'Énergie renouvelable',
    service: 'pv',
    title: 'Panneaux photovoltaïques en Wallonie : ce qui a changé depuis 2024',
    seo: 'Panneaux photovoltaïques en Wallonie : ce qui a changé',
    description: "Fin du compteur qui tourne à l'envers, compteur communicant, contrôle avant mise en service : ce qu'il faut savoir avant d'installer des panneaux solaires en Wallonie.",
    lead: "Installer des panneaux solaires reste une bonne idée pour beaucoup de logements, mais les règles ont changé. La question n'est plus « combien je produis ? », mais « combien je consomme moi-même ? ».",
    body: `
<h2>La fin du « compteur qui tourne à l'envers »</h2>
<p>Pour toute installation mise en service <strong>à partir du 1er janvier 2024</strong>, il n'y a plus de <strong>compensation</strong> entre l'électricité que vous injectez sur le réseau et celle que vous prélevez. Concrètement, le surplus envoyé sur le réseau ne « rembourse » plus votre consommation du soir.</p>
<p>Les installations de 10 kW maximum mises en service <strong>avant</strong> 2024 gardent la compensation jusqu'au <strong>31 décembre 2030</strong>. Attention en cas de modification (nouvel onduleur, panneaux ajoutés) : ce droit n'est conservé que dans certaines limites de puissance.</p>

<h2>Ce que ça change pour vous</h2>
<p>Le plus intéressant devient de <strong>consommer vous-même</strong> l'électricité au moment où vos panneaux la produisent : lave-linge, lave-vaisselle, boiler, recharge de voiture en journée. On parle d'<strong>autoconsommation</strong>. Une installation bien dimensionnée part donc de vos habitudes de consommation, pas seulement de la taille de votre toit.</p>
<p>Le <strong>tarif prosumer</strong> existe toujours. Son montant dépend de votre gestionnaire de réseau et est fixé chaque année : demandez à l'installateur de l'intégrer dans le calcul de rentabilité.</p>

<h2>Les étapes obligatoires</h2>
<ol>
  <li><strong>Un compteur communicant</strong> doit être installé avant la mise en service d'une nouvelle installation.</li>
  <li><strong>Un contrôle par un organisme agréé</strong> (RGIE) : l'installation ne peut être mise en service qu'après avoir été déclarée conforme. La mettre en service avant est une infraction.</li>
  <li><strong>La notification au gestionnaire de réseau</strong> (ORES, RESA…) via le formulaire prévu (UP10).</li>
</ol>

<h2>Bien choisir son installateur</h2>
<ul>
  <li>La Wallonie a mis en place une <strong>certification des installateurs</strong> d'énergie renouvelable (RESCERT) : demandez si l'installateur est certifié.</li>
  <li>Exigez un devis détaillé : marque et puissance des panneaux et de l'onduleur, garanties, et qui s'occupe du contrôle et de la notification.</li>
  <li>Demandez une estimation de votre <strong>taux d'autoconsommation</strong>, pas seulement de la production annuelle.</li>
</ul>

<h2>Et le certificat PEB ?</h2>
<p>Les panneaux photovoltaïques sont pris en compte dans le certificat PEB. Depuis septembre 2026, le certificat indique même le label du logement <strong>avec</strong> et <strong>sans</strong> les panneaux.</p>`,
    sources: [SRC.finCompensation, SRC.cwapeCompensation, SRC.cwapeCompteur, SRC.oresAvant2024, SRC.up10, SRC.notifier, SRC.rescert, SRC.actu2026]
  },
  {
    slug: 'borne-de-recharge-maison',
    date: '2026-11-18',
    tag: 'Borne de recharge',
    cat: 'Électricité',
    service: 'elec',
    title: 'Borne de recharge à la maison : les bonnes questions à se poser',
    seo: 'Borne de recharge à la maison : les bonnes questions',
    description: "Quelle puissance choisir, combien de temps pour recharger, faut-il un contrôle électrique ? Le point avant d'installer une borne de recharge chez vous en Wallonie.",
    lead: "Une borne de recharge, c'est plus confortable et plus sûr qu'une prise ordinaire pour charger une voiture tous les jours. Mais la bonne borne dépend de votre voiture, de votre installation et de vos trajets.",
    body: `
<h2>1. Quelle puissance ?</h2>
<p>Les bornes domestiques les plus courantes sont de <strong>3,7 kW</strong> ou <strong>7,4 kW</strong> en monophasé, et de <strong>11 kW</strong> en triphasé. Plus puissant n'est pas toujours utile :</p>
<ul>
  <li>votre <strong>voiture</strong> a sa propre limite de charge : une borne plus puissante que ce qu'elle accepte ne charge pas plus vite ;</li>
  <li>votre <strong>installation électrique</strong> (raccordement, tableau) doit pouvoir suivre ;</li>
  <li>pour des trajets quotidiens, une charge de nuit à puissance modérée suffit souvent.</li>
</ul>

<h2>2. Combien de temps pour recharger ?</h2>
<p>Un calcul simple donne un ordre de grandeur : <strong>énergie à recharger (kWh) ÷ puissance de charge (kW)</strong>. Par exemple, 30 kWh à 7,4 kW, c'est environ 4 heures. Comptez un peu plus en pratique, à cause des pertes et du ralentissement en fin de charge.</p>
<p>Repère utile : pour 40 km par jour, une voiture électrique consomme souvent de l'ordre de 6 à 8 kWh. Une recharge de quelques heures la nuit suffit alors largement.</p>

<h2>3. Faut-il un contrôle électrique ?</h2>
<p>Ajouter une borne, c'est <strong>modifier votre installation électrique</strong> : un circuit dédié et une protection adaptée sont nécessaires. Selon la puissance, un <strong>contrôle par un organisme agréé</strong> et une <strong>déclaration au gestionnaire de réseau</strong> peuvent être nécessaires. Demandez à l'électricien de vous dire précisément ce qui s'applique à votre cas, et qui s'en occupe.</p>
<p>C'est aussi le bon moment pour vérifier que votre installation est en ordre, surtout si elle est ancienne.</p>

<h2>4. Et avec des panneaux solaires ?</h2>
<p>Recharger la voiture en journée, avec votre propre production, est l'une des meilleures façons d'utiliser l'électricité de vos panneaux, depuis la fin de la compensation pour les nouvelles installations. Certaines bornes savent suivre automatiquement la production solaire : demandez-le dans le devis.</p>

<h2>5. Ce que doit contenir un bon devis</h2>
<ul>
  <li>Marque, modèle et puissance de la borne, longueur de câble prévue.</li>
  <li>Travaux sur le tableau électrique et protections ajoutées.</li>
  <li>Qui s'occupe du contrôle et des démarches, et ce que ça coûte.</li>
  <li>Garantie et service après-vente.</li>
</ul>`,
    sources: [SRC.finCompensation, SRC.up10]
  },
  {
    slug: 'renovation-par-ou-commencer',
    date: '2026-11-18',
    tag: 'Rénovation',
    cat: 'Rénovation',
    service: 'reno',
    title: 'Rénover son logement : par où commencer sans se perdre ?',
    seo: 'Rénover son logement : par où commencer ?',
    description: "Diagnostic, priorités, devis, choix des entreprises, démarches : une méthode simple pour lancer une rénovation en Wallonie sans se perdre entre les corps de métier.",
    lead: "Toiture, châssis, chauffage, électricité… Quand on rénove, le plus dur n'est souvent pas les travaux eux-mêmes, mais de savoir par quoi commencer et à qui s'adresser. Voici une méthode simple.",
    body: `
<h2>1. Partir d'un état des lieux</h2>
<p>Avant de demander des devis, faites le point. Le <strong>certificat PEB</strong> est un bon début : depuis septembre 2026, il contient une <strong>feuille de route</strong> qui indique les travaux prioritaires. Pour aller plus loin, l'<strong>audit logement</strong>, réalisé par un auditeur agréé, est plus complet et plus précis.</p>

<h2>2. Fixer les priorités</h2>
<p>Un ordre souvent conseillé : d'abord ce qui est <strong>urgent</strong> (sécurité, infiltrations, électricité dangereuse), ensuite l'<strong>enveloppe</strong> du bâtiment (toiture, murs, châssis), puis les <strong>équipements</strong> (chauffage, ventilation, panneaux solaires). Isoler avant de changer de chauffage permet souvent de choisir un système plus petit.</p>
<p>Pensez aussi à l'ordre des chantiers : on évite de refaire une façade juste avant de changer les châssis.</p>

<h2>3. Comparer de vrais devis</h2>
<ul>
  <li>Demandez des devis <strong>détaillés</strong> : matériaux, quantités, épaisseurs, marques, délais.</li>
  <li>Comparez ce qui est comparable : le moins cher n'inclut pas toujours la même chose.</li>
  <li>Vérifiez qui s'occupe des démarches (contrôles, déclarations, demandes d'aides).</li>
</ul>

<h2>4. Vérifier l'entreprise</h2>
<ul>
  <li>Son <strong>numéro d'entreprise</strong> : il se vérifie gratuitement dans la Banque-Carrefour des Entreprises.</li>
  <li>Son <strong>assurance</strong> responsabilité professionnelle : demandez l'attestation.</li>
  <li>Les <strong>certifications</strong> ou agréments exigés pour son métier (par exemple pour les panneaux solaires).</li>
</ul>

<h2>5. Garder toutes les preuves</h2>
<p>Factures détaillées, fiches techniques, <strong>photos de chantier</strong> avant que l'isolant soit caché : gardez tout. Ces preuves comptent pour votre prochain certificat PEB, et souvent pour les demandes d'aides.</p>
<p>Et si l'installation électrique est modifiée de façon importante, un nouveau contrôle peut être nécessaire : prévoyez-le dans le planning.</p>`,
    sources: [SRC.neven, SRC.deroulement, SRC.bce]
  }
];
