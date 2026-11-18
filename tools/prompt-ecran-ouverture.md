# Prompt : écran d'ouverture « les formes s'unissent pour former le logo »

À coller dans Claude Code sur un autre projet. Remplacer les valeurs entre [crochets].

---

Ajoute un écran d'ouverture animé à mon site, sur le modèle suivant. Lis d'abord le projet pour l'insérer proprement (une seule fois dans un gabarit commun si le site a plusieurs pages).

**Marque**
- Logo : [chemin du fichier SVG du logo, ex. `brand/logo-blanc.svg`]. Il est composé de deux formes qui s'unissent : [ex. deux anneaux entrelacés / deux carrés qui se chevauchent / deux lettres], suivies du nom [ex. « Jumeo »].
- Couleurs : fond [ex. bleu nuit #0b2441, dégradé radial vers #12355b au centre], forme 1 [ex. blanc], forme 2 [ex. orange #ff7a45].
- Phrase sous le logo : « [ex. Vous. Le bon professionnel. Un seul lien.] » (la fin en couleur d'accent).

**Chorégraphie (≈ 2,9 s au total)**
1. 0,15 s → 1,15 s : les deux formes arrivent chacune d'un côté (translateX −48 et +48 unités du SVG, opacité 0 → 1 dans le premier quart), en se **dessinant** (stroke-dasharray = longueur du tracé, dashoffset → 0), courbe `cubic-bezier(.65,0,.35,1)`.
2. ≈ 1,1 s : elles se rejoignent ; l'élément qui fait l'entrelacement (le petit arc qui repasse devant) apparaît en 0,18 s, et le symbole fait un **battement** : scale 1 → 1,14 → 1 en 0,55 s, courbe ressort `cubic-bezier(.34,1.56,.64,1)`.
3. 1,2 s → 1,9 s : le SVG, centré au départ sur le symbole (translateX 35 %), glisse à sa place pendant que le **nom** apparaît (opacité 0 → 1, translateX −14 → 0, 0,75 s, `cubic-bezier(.16,1,.3,1)`).
4. 1,55 s : la phrase monte de 8 px et apparaît (0,7 s).
5. 2,35 s : tout l'écran s'efface (opacité → 0, visibility hidden, 0,6 s, `cubic-bezier(.7,0,.3,1)`), puis l'élément est retiré du DOM. Le contenu de la page joue ses propres animations d'entrée juste après (décaler leurs délais de ≈ 2,3 s quand l'écran est actif).

**Réalisation**
- Un seul SVG inline (pas d'image) : les deux formes dans des groupes `<g>` animés séparément (`transform-box: view-box`), le nom en **tracé vectoriel** repris du logo (pas de texte : il s'affiche net avant le chargement des polices). `overflow: visible` sur le SVG. Largeur `min(78vw, 440px)`.
- CSS pur pour les animations (@keyframes), aucune librairie.
- Un petit script dans le `<head>`, avant tout affichage, ajoute la classe `intro` sur `<html>` seulement si : l'écran n'a pas encore été vu pendant cette visite (`sessionStorage`) **et** l'appareil ne demande pas d'animations réduites. Sans cette classe, l'écran reste `display:none` : pas de flash, rien sans JavaScript, rien en `prefers-reduced-motion`.
- L'écran est placé juste après `<body>`, en `position:fixed; inset:0; z-index` élevé, avec `aria-hidden="true"`.
- Clic ou toucher = passer (fondu rapide de 0,3 s). Sécurité : retrait automatique après 4 s quoi qu'il arrive.
- Une seule fois par visite : en changeant de page, il ne revient pas.

**Vérifications avant de livrer**
- Captures image par image (0,2 · 0,6 · 0,95 · 1,25 · 1,6 · 2,1 · 2,6 · 3,3 s) en une planche, pour vérifier la chorégraphie.
- Ordinateur et mobile 390 px : centré, pas de défilement horizontal, aucune erreur console.
- L'écran disparaît bien seul et ne revient pas à la page suivante.
- Les tests automatiques du site sautent l'écran (sessionStorage pré-rempli), sinon il bloque les clics.
