// Articles de la rubrique « Guides » (générés par build.js en /guides/<slug>).
// Règle : chaque affirmation PEB ou légale doit être confirmée (data/regles-peb.md) et sourcée en bas d'article.
// « sim » (facultatif) : 'recharge' pour proposer le simulateur de recharge au lieu du simulateur PEB.
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
  bce: ['Recherche publique dans la Banque-Carrefour des Entreprises (SPF Économie)', 'https://kbopub.economie.fgov.be/kbopub/zoeknaamfonetischform.html?lang=fr'],
  mazout2031: ['Chaudières au mazout et au charbon : la Wallonie reporte l\'interdiction à 2031 (Wallonie)', 'https://www.wallonie.be/fr/actualites/chaudieres-au-mazout-et-au-charbon-la-wallonie-reporte-linterdiction-2031'],
  mazoutEnergie: ['Chaudières au mazout et au charbon : une transition progressive à partir de 2031 (L\'Énergie en Wallonie)', 'https://energie.wallonie.be/actualite/chaudieres-au-mazout-et-au-charbon-une-transition-progressive-a-partir-de-2031'],
  chauffageChoisir: ['Quel système de chauffage choisir ? (L\'Énergie en Wallonie)', 'https://energie.wallonie.be/home/performance-energetique-des-batiments/batiments-residentiels/renovation-walloreno/conseils-pratiques/se-chauffer-1/quel-systeme-de-chauffage-choisir.html'],
  notaireVendre: ['Vendre un bien (notaire.be)', 'https://www.notaire.be/immobilier/acheter-et-vendre-un-bien-immobilier/vendre-un-bien'],
  notaireLexique: ['Contrôle de l\'installation électrique, lexique (notaire.be)', 'https://notaire.be/lexique/C/controle-de-linstallation-electrique?locale=fr'],
  notaireBrochure: ['Brochure « Je vends mon bien » 2025 (notaire.be, PDF)', 'https://www.notaire.be/sites/default/files/files/2025-07/Brochure-Je-vends-2025-LD.pdf'],
  peeters: ['Loi du 31 mai 2017 relative à l\'assurance obligatoire de la responsabilité décennale (Justel)', 'https://www.ejustice.just.fgov.be/cgi_loi/change_lg.pl?language=fr&la=F&cn=2017053102&table_name=loi']
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
    sim: 'recharge',
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
<p>Faites le calcul pour votre voiture avec notre <a href="/simulateur-recharge">simulateur de recharge</a> : temps de charge et coût, selon votre borne et votre prix du kWh.</p>

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
  },
  {
    slug: 'pompe-a-chaleur-adaptee',
    date: '2026-11-18',
    tag: 'Pompe à chaleur',
    cat: 'Énergie renouvelable',
    service: 'reno',
    title: 'Pompe à chaleur : est-elle adaptée à votre logement ?',
    seo: 'Pompe à chaleur : est-elle adaptée à votre logement ?',
    description: "Isolation, radiateurs, électricité, panneaux solaires : les bonnes questions avant de passer à la pompe à chaleur en Wallonie, et ce que disent les règles sur le mazout.",
    lead: "La pompe à chaleur a la cote, et pour de bonnes raisons. Mais elle ne donne le meilleur d'elle-même que dans certaines conditions. Voici comment savoir si votre logement est prêt.",
    body: `
<h2>Le principe, en deux phrases</h2>
<p>Une pompe à chaleur prend la chaleur présente dans l'air, le sol ou l'eau, et la « remonte » à une température utile pour chauffer la maison. Elle utilise de l'électricité pour fonctionner, mais restitue plus de chaleur qu'elle ne consomme d'électricité, surtout quand elle travaille à basse température.</p>

<h2>Les 4 questions à se poser</h2>
<ol>
  <li><strong>Mon logement est-il assez isolé ?</strong> Plus la maison perd de chaleur, plus la pompe doit forcer. Isoler d'abord (toiture, murs, châssis) permet souvent de choisir une machine plus petite et plus efficace.</li>
  <li><strong>Mes émetteurs conviennent-ils ?</strong> Le chauffage par le sol ou de grands radiateurs fonctionnent à plus basse température : c'est idéal. De petits radiateurs prévus pour une chaudière très chaude peuvent poser problème.</li>
  <li><strong>Mon installation électrique suit-elle ?</strong> La pompe ajoute une consommation importante : un électricien vérifie le raccordement et le tableau.</li>
  <li><strong>Où placer l'unité extérieure ?</strong> Pensez au bruit pour vous et pour les voisins, et à l'accès pour l'entretien.</li>
</ol>

<h2>Et le mazout dans tout ça ?</h2>
<ul>
  <li>Dans les <strong>bâtiments neufs</strong>, installer une chaudière au mazout ou au charbon est <strong>interdit depuis le 1er janvier 2026</strong>.</li>
  <li>Dans les <strong>bâtiments existants</strong>, l'interdiction d'installer ou de remplacer une chaudière au mazout est <strong>reportée au 1er janvier 2031</strong>. Le remplacement du brûleur reste possible jusqu'au 31 décembre 2034, et des dérogations sont prévues quand il n'existe pas d'alternative réaliste.</li>
</ul>
<p>Vous avez donc le temps de préparer le changement, idéalement en même temps que vos travaux d'isolation.</p>

<h2>Avec des panneaux solaires ?</h2>
<p>Une pompe à chaleur consomme de l'électricité : la produire vous-même est intéressant, d'autant que les nouvelles installations photovoltaïques ne bénéficient plus de la compensation. Mais attention, c'est en hiver que la pompe consomme le plus, quand les panneaux produisent le moins : le calcul doit être fait sérieusement, cas par cas.</p>

<h2>Bien choisir l'installateur</h2>
<ul>
  <li>La Wallonie a mis en place une certification des installateurs d'énergie renouvelable (RESCERT) : demandez si l'installateur est certifié.</li>
  <li>Exigez un dimensionnement basé sur <strong>votre</strong> maison (pertes de chaleur), pas une puissance « au feeling ».</li>
  <li>Demandez le niveau sonore de l'unité extérieure, la garantie et le contrat d'entretien.</li>
</ul>`,
    sources: [SRC.mazout2031, SRC.mazoutEnergie, SRC.chauffageChoisir, SRC.rescert, SRC.finCompensation]
  },
  {
    slug: 'isolation-toiture',
    date: '2026-11-18',
    tag: 'Isolation',
    cat: 'Rénovation',
    service: 'reno',
    title: 'Isoler sa toiture : ce qu\'il faut savoir avant de se lancer',
    seo: 'Isoler sa toiture : ce qu\'il faut savoir',
    description: "Par l'intérieur, par l'extérieur ou le plancher des combles ? Les options pour isoler une toiture, les points d'attention et les preuves à garder pour votre certificat PEB.",
    lead: "La toiture est souvent le premier chantier conseillé quand on veut améliorer un logement : la chaleur monte, et une toiture mal isolée en laisse beaucoup s'échapper. Voici comment s'y retrouver.",
    body: `
<h2>Trois façons d'isoler</h2>
<ul>
  <li><strong>Le plancher des combles</strong> : si le grenier n'est pas habité, on isole le sol du grenier. C'est souvent la solution la plus simple et la moins chère.</li>
  <li><strong>La toiture par l'intérieur</strong> : l'isolant est placé entre et sous les chevrons, du côté de la pièce. On garde la couverture existante, mais on perd un peu de hauteur.</li>
  <li><strong>La toiture par l'extérieur</strong> (« sarking ») : l'isolant est posé au-dessus de la charpente, au moment de refaire la couverture. Plus coûteux, mais très efficace et sans perte d'espace intérieur.</li>
</ul>

<h2>Les points d'attention</h2>
<ul>
  <li><strong>L'étanchéité à l'air</strong> : une isolation pleine de fuites d'air perd une grande partie de son intérêt. Le pare-vapeur ou la membrane doivent être continus et bien raccordés.</li>
  <li><strong>L'humidité</strong> : une mauvaise mise en œuvre peut créer de la condensation dans la toiture. C'est un travail de professionnel.</li>
  <li><strong>L'état de la charpente et de la couverture</strong> : on vérifie avant d'isoler, pour ne pas devoir tout rouvrir plus tard.</li>
  <li><strong>La ventilation</strong> : une maison mieux isolée doit rester bien ventilée.</li>
</ul>

<h2>Les preuves à garder</h2>
<p>Pour votre prochain certificat PEB, l'isolant caché sous le plafond ne se voit plus. Sans preuve, le certificateur applique des valeurs par défaut, en général moins favorables. Gardez :</p>
<ul>
  <li>des <strong>photos de chantier</strong> qui montrent l'isolant avant qu'il soit recouvert, avec un repère (mètre visible) ;</li>
  <li>la <strong>facture détaillée</strong> avec la référence, le type et l'épaisseur de l'isolant ;</li>
  <li>la fiche technique du produit.</li>
</ul>

<h2>Avant de signer</h2>
<ul>
  <li>Comparez des devis détaillés : type et épaisseur d'isolant, membrane, finitions, évacuation des déchets.</li>
  <li>Demandez qui s'occupe de l'étanchéité à l'air et comment elle est vérifiée.</li>
  <li>Pour une intervention sur la couverture ou la charpente, vérifiez l'assurance de l'entreprise.</li>
</ul>`,
    sources: [SRC.deroulement, SRC.pieces]
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
    slug: 'bien-choisir-son-artisan',
    date: '2026-11-18',
    tag: 'Bien choisir',
    cat: 'Rénovation',
    service: 'reno',
    title: 'Bien choisir son artisan : 7 vérifications avant de signer',
    seo: 'Bien choisir son artisan : 7 vérifications',
    description: "Numéro d'entreprise, assurances, certifications, devis détaillé : les 7 vérifications simples à faire avant de confier des travaux à une entreprise en Belgique.",
    lead: "Un bon artisan, c'est un chantier serein. Un mauvais choix peut coûter cher et longtemps. Ces 7 vérifications prennent quelques minutes et évitent bien des soucis.",
    body: `
<h2>1. Le numéro d'entreprise</h2>
<p>Toute entreprise a un numéro dans la <strong>Banque-Carrefour des Entreprises</strong>. Vérifiez-le gratuitement en ligne : l'entreprise existe-t-elle, est-elle active, ses activités correspondent-elles à vos travaux ?</p>

<h2>2. L'assurance responsabilité professionnelle</h2>
<p>Demandez l'<strong>attestation d'assurance</strong>. En cas de dégât pendant le chantier, c'est elle qui intervient.</p>

<h2>3. L'assurance décennale, pour les gros travaux</h2>
<p>Depuis le 1er juillet 2018, les entrepreneurs et architectes qui interviennent sur une <strong>habitation</strong> doivent être assurés pour leur <strong>responsabilité décennale</strong> lorsqu'elle peut être engagée : solidité, stabilité et étanchéité du gros œuvre fermé. Pour ce type de travaux, demandez l'attestation.</p>

<h2>4. Les certifications et agréments du métier</h2>
<p>Certains métiers demandent une certification ou un agrément : certificateur PEB agréé, installateur d'énergie renouvelable certifié, organisme de contrôle électrique agréé… Demandez le numéro et vérifiez-le.</p>

<h2>5. Un devis détaillé et écrit</h2>
<ul>
  <li>Description précise des travaux, matériaux, marques, quantités.</li>
  <li>Prix hors TVA et TVA comprise, avec le taux appliqué.</li>
  <li>Délais, conditions de paiement, durée de validité du devis.</li>
</ul>

<h2>6. Des références vérifiables</h2>
<p>Demandez des réalisations récentes et similaires à votre projet, et si possible un contact de client. Des avis en ligne peuvent aider, mais restez critique.</p>

<h2>7. Un contrat clair, jusqu'à la réception</h2>
<p>Dates, étapes de paiement liées à l'avancement, conditions de réception des travaux : tout doit être écrit. Méfiez-vous des acomptes très élevés demandés avant le début du chantier.</p>

<h2>Et avec Jumeo ?</h2>
<p>Nous ne travaillons qu'avec des partenaires qui ont un numéro d'entreprise, une assurance professionnelle et les agréments exigés pour leur métier. Vous gardez évidemment le dernier mot : ces vérifications restent utiles, et nous vous aidons à les faire.</p>`,
    sources: [SRC.bce, SRC.peeters]
  }
];
