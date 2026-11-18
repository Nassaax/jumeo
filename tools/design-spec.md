# Jumeo · « Le lien » : refonte visuelle (fiche de design)

## 0. Brief
Page unique (index.html) pour **Jumeo**, apporteur d'affaires indépendant en Wallonie (PEB, contrôle électrique, photovoltaïque, rénovation). Visiteurs : particuliers qui vendent ou louent, et professionnels (agences, notaires, promoteurs).
Ambiance : claire, rassurante, locale, nette.
Signature : **le lien**. Le logo (deux anneaux entrelacés) devient le schéma « Qui fait quoi ? » : deux grands anneaux qui se dessinent au défilement, « Jumeo · votre contact » (marine/blanc) et « Professionnel agréé · le garant » (orange). La zone commune est « Votre dossier ». La transparence légale devient le moment mémorable. En écho, de grands anneaux fantômes se tracent une fois derrière le titre du hero.
Fidélité : on garde tout le contenu, tous les `id`, le formulaire et les règles légales. Aucune fausse preuve (pas d'avis, de compteurs ni d'avatars).

## 1. Stack
Un seul `index.html`, CSS et JS inline, sans librairie. Icônes en SVG inline (aucun emoji). Pas de vidéo ni de photo : règle 3 (pas de photo de banque présentée comme réalisation) et « aucun suivi » (pas de média hébergé chez un tiers).

## 2. Polices
| Rôle | Famille | Graisses | Usage |
|---|---|---|---|
| Titres | Plus Jakarta Sans | 600, 700 | H1, H2, prix, numéros |
| Texte / UI | Inter | 400, 500, 600 | corps, nav, boutons, labels |
Chargement : `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700&display=swap`

## 3. Couleurs
```
--ink #0b2441 (fond du hero, texte principal) · --navy #12355b · --paper #f7f5f0 (fond de page) · --card #ffffff
--muted rgba(11,36,65,.64) · --line rgba(11,36,65,.12) · --accent #ff7a45 (uniquement : CTA, points/puces, anneau orange)
--accent-d #e8622b (survol CTA) · sur fond foncé : texte 100 / 78 / 60 % blanc, filets 14 % blanc
```
`html,body{background:var(--ink)}` en première règle, puis `body` sur `--paper` sous le hero. Sélection : orange à 30 %.

## 4. Matières et utilitaires
- Grain : bruit fractal (baseFrequency .9, 4 octaves) à .12 d'opacité sur le hero et la section sombre.
- Verre (sur fond foncé) : `background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.16); backdrop-filter:blur(14px)`.
- Bouton principal « roll » : pilule orange, padding 8px 8px 8px 22px, label de 20px qui roule au survol (500 ms), pastille blanche de 30px avec flèche qui pivote de −45°.
- Bouton secondaire : pilule avec contour de 1px `--line`, texte `--ink`, et contour `--ink` au survol.
- Rayons : pilules pour les actions, 28px pour les cartes, 40px pour les grands blocs.

## 5. Mise en page
- Conteneur 1200px, marges latérales 20px (mobile), 32px (≥ 760px) et 48px (≥ 1200px).
- **En-tête** fixe, 72px. Transparent sur le hero (texte blanc). Après 40px de défilement : fond `rgba(247,245,240,.86)` + flou 14px, texte `--ink`, filet en bas. 5 liens à 14px/500 + CTA « Devis gratuit ».
- **Hero** : fond `--ink` avec un dégradé vertical vers `#0f2f55`, grain, et des anneaux fantômes (deux cercles de 34vw, trait 1.5px blanc à 9 %, tracés en 1.8 s). Grille 1.05fr / .95fr, écart 56px. Padding haut 136px, bas 96px.
  - Colonne gauche : bascule Particulier/Pro (verre) → H1 `clamp(40px,6.2vw,80px)` 600, interligne .98, −.045em, 2 lignes (ligne 2 en orange) → texte d'accroche de 18px à 78 % blanc, 34rem max → 3 garanties en ligne (coche orange, 14px, 80 % blanc).
  - Colonne droite : carte formulaire blanche, rayon 28px, ombre `0 30px 80px rgba(0,0,0,.35)`.
  - Mobile : une seule colonne, H1 40px, formulaire en dessous.
- **Tarifs** : fond papier, eyebrow (point orange de 6px + 12px majuscules +.18em, couleur `--ink`) puis H2 `clamp(30px,4.2vw,52px)` 600 −.04em. 3 cartes, la carte « Le plus demandé » sur fond `--ink` en texte blanc. Prix en Plus Jakarta 600, `clamp(48px,5vw,64px)`, −.04em. En dessous, 3 services « sur devis » en liste horizontale séparée par des filets, avec icônes SVG.
- **Étapes** : 4 colonnes, numéros « 01 » à « 04 » en Plus Jakarta 600 de 15px, reliés par un filet horizontal.
- **Qui fait quoi ? (signature)** : bloc encastré (marges de 16px, rayon 40px) sur `--ink` avec grain. Schéma SVG (viewBox 0 0 560 300) : anneau gauche r 120 trait 14px blanc, anneau droit r 120 trait 14px orange, entrelacés. Libellés au-dessus de chaque anneau et « Votre dossier » au centre. Le trait se dessine (stroke-dashoffset de 754 à 0, 1.6 s, `cubic-bezier(.16,1,.3,1)`, anneau droit +0.25 s) quand 30 % du bloc est visible. Puis les 2 colonnes de listes, l'identité du partenaire et la mention légale.
- **Documents / Bon à savoir** : 2 panneaux blancs, rayon 28px. Le panneau « Bon à savoir » reprend l'échelle A–G en barre horizontale de 7 pastilles (illustration).
- **Pros** : 3 cartes avec icônes SVG de 24px dans une pastille de 44px. Le bloc « Rejoindre le réseau » est sur fond papier foncé `#efebe3`.
- **À propos** : grand anneau logo de 120px et texte.
- **FAQ** : liste à filets, sans cartes, « + » qui pivote de 45° à l'ouverture.
- **Pied de page** : `--ink`.

## 6. Mouvement
- Entrée du hero (une seule fois, sans risque d'écran vide : état visible au repos, `.is-in` après la fin) : logo .05 s, nav .12 s, bascule .2 s, ligne 1 du H1 .3 s, ligne 2 .45 s (montée masquée de 105 %), accroche .62 s, garanties .76 s, carte formulaire .4 s (montée de 24px + échelle .98). Durée 1 s, `cubic-bezier(.16,1,.3,1)`.
- Bascule Particulier/Pro : les lignes du H1 se rejouent (même montée, .7 s).
- Apparition au défilement : `.reveal` à 15 % de visibilité, translateY 24px → 0, opacité 0 → 1, .8 s, décalage de 90 ms entre éléments frères. Activée seulement si JS et IntersectionObserver sont présents.
- Survols : cartes −3px sur 250 ms ; liens d'un trait qui s'étend depuis la gauche.
- `prefers-reduced-motion` : tout est affiché directement, anneaux déjà tracés.

## 7. Contrôles
JS valide, aucune erreur console, 390px sans défilement horizontal, tous les `id` utilisés par le JS existent, chaque `data-pick` existe dans `SERVICES`, focus visible, contraste du texte ≥ 4.5:1 (l'orange n'est jamais utilisé pour du petit texte sur fond clair).
