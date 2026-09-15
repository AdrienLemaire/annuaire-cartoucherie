# Terre rose — direction 2

## L'idée en trois phrases

La brique terracotta de la ville rose devient la couleur de la marque, pas un
accent — c'est le matériau dont le quartier est littéralement construit, posé sur un
papier chaud plutôt que sur du blanc froid. Un vert-bleu sourd vient border cette
chaleur pour qu'elle ne bascule jamais vers l'alerte, et un bronze mat rappelle le
métal de l'ancienne usine sans jamais dessiner une munition. Le résultat doit se lire
« ici, à la Cartoucherie » avant de se lire « application de quartier ».

## La terracotta exacte, et pourquoi

**`oklch(53% 0.145 39)` · `#af4721`.**

Teinte 39° : dans la fourchette brique (30–45°) demandée, plus proche du rouge que
de l'orange pur pour éviter l'ambre — l'ambre est déjà pris par la direction 1.
Chroma 0.145 : saturé assez pour porter l'identité seul sur une page blanche, mais
délibérément **mat** — une brique cuite, pas un plastique. Luminosité 53% : assez
sombre pour porter du texte blanc en confiance (5.39:1 sur `primary-content`), assez
clair pour ne pas lester la page. Choisie à l'œil contre des photos de la brique du
quartier, puis calculée et vérifiée après coup — pas l'inverse.

## Le pairing typographique, et pourquoi

**Bricolage Grotesque** (titres, wordmark) + **Instrument Sans** (texte, interface).

Bricolage Grotesque porte le caractère : une grotesque à l'inspiration "bricolée",
un peu bosselée, qui donne au wordmark une personnalité que la direction 1 refuse
délibérément. Utilisée uniquement en titres et au poids gras/semi-gras, elle ne
descend jamais dans le corps de texte — jamais un paragraphe entier dans une police
à caractère. Instrument Sans porte la lecture : une grotesque humaniste calme, très
lisible à 16px, sans idiosyncrasie qui distrairait un résident de 70 ans pressé.
Aucune des deux ne figure dans la liste interdite (Manrope, Public Sans, Plus Jakarta
Sans, Source Sans 3, Figtree, Be Vietnam Pro) ni chez les directions rivales.
Vérifié par `document.fonts.check('700 48px "Bricolage Grotesque"')` et
`document.fonts.check('400 16px "Instrument Sans"')` après `document.fonts.ready` :
les deux renvoient `true`, donc les deux familles sont bien chargées et rendues —
ce n'est pas la police système qui s'affiche en repli.

## Le concept du mark

Trois arches de largeurs et hauteurs légèrement inégales, celle du centre plus
haute — la nef centrale et les bas-côtés d'une halle couverte, comme celle de la
Cartoucherie. Dessiné en trait (`stroke`, pas de remplissage), il tient en trois
coups de plume et reste lisible réduit à 24px dans un onglet de navigateur — testé
sur la planche, capture à l'appui. Aucune forme cylindrique, aucune silhouette de
projectile : ce sont des arches larges et basses, pas des tubes verticaux. Le mark
seul, sans le wordmark, peut servir de favicon.

## Comment le rouge d'erreur reste distinct du primaire

Les deux sont, au sens strict du cercle chromatique, dans la même famille
rouge-orangé : `primary` à 39°, `error` à 21°, seulement 18° d'écart. La distinction
ne vient pas de la teinte seule mais du **chroma** : `error` est à 0.205, soit +41%
de saturation par rapport au 0.145 du primaire. Le primaire est sciemment terne —
une brique mate — pendant que l'erreur est vive et tirée vers le magenta, la couleur
qu'on associe universellement à « danger » dans n'importe quelle convention d'UI.
Les deux couleurs ont une luminosité presque identique (contraste mutuel de
seulement 1.14:1 — elles ne se distinguent donc pas par la clarté), ce qui rend le
test le plus honnête : posées côte à côte sur la planche, sans étiquette, l'œil les
sépare immédiatement sur la seule saturation. C'est un pari assumé plutôt qu'un
hasard — si un jour cette planche est retenue, toute nouvelle couleur sémantique
proche du rouge devra être vérifiée au chroma, pas seulement à la teinte.

**La même vérification a fait tomber une deuxième collision, non demandée mais du
même ordre : `accent` contre `warning`.** Le premier jet de `accent` (laiton,
`oklch(71% 0.135 78)`) n'était qu'à 2° de teinte et un chroma quasi identique de
`warning` (`oklch(78% 0.14 80)`) — sur la planche, à deux cartes d'écart, les deux
se lisaient comme « deux jaunes ». Corrigé en assombrissant et désaturant l'accent
vers un bronze : `oklch(52% 0.095 65)`, soit 15° de teinte et 26 points de clarté
d'écart avec `warning`. Il code toujours le métal de l'ancienne usine, mais ne
prête plus à confusion avec l'avertissement sémantique.

## Contrastes — calculés, pas estimés

Conversion OKLCH → sRGB (matrices de Björn Ottosson) puis ratio WCAG sur la
luminance relative. Aucune valeur n'est sous 4.5:1 (AA texte normal) ; celles qui
n'atteignent pas 7:1 (AAA) sont annoncées comme telles, pas arrondies vers le haut.

| Paire | Ratio | Niveau |
|---|---|---|
| `base-100` / `base-content` | 15.40:1 | AAA |
| `base-200` / `base-content` | 13.88:1 | AAA |
| `base-300` / `base-content` | 11.70:1 | AAA |
| `neutral` / `neutral-content` | 13.26:1 | AAA |
| `primary` / `primary-content` | 5.39:1 | AA (pas AAA) |
| `secondary` / `secondary-content` | 7.15:1 | AAA |
| `accent` / `accent-content` | 5.32:1 | AA |
| `info` / `info-content` | 5.81:1 | AA |
| `success` / `success-content` | 5.38:1 | AA |
| `warning` / `warning-content` | 8.13:1 | AAA |
| `error` / `error-content` | 6.14:1 | AA (pas AAA) |
| `primary` (texte) / `base-100` | 5.24:1 | AA |
| `error` (texte) / `base-100` | 5.97:1 | AA |

Le plus tendu du lot est `primary`/`primary-content` à 5.39:1 : confortablement
au-dessus du seuil AA (4.5:1) mais loin de AAA. C'est le compromis assumé de la
direction — une terracotta assez sombre pour porter du texte blanc sans être une
brique noircie.

**Piège trouvé en repassant sur la planche : le texte en `base-content` à opacité
réduite.** Une première passe utilisait `text-base-content/60` et `/50` pour les
métadonnées (métier, note, badges de catégorie, compteur de membres) à l'intérieur
des trois blocs et du fragment d'application. Recalculé après coup : `/60` sur
`base-100` ne fait que **4.30:1** et `/50` seulement **3.20:1** — sous le seuil AA
alors que ce sont des informations porteuses (le métier d'un membre, le nombre de
membres d'une catégorie). Corrigé à `/70` partout où ce texte vit dans un des trois
blocs ou dans le fragment (**5.93:1** sur `base-100`, **5.64:1** sur `base-200`) ;
les alphas plus faibles ne restent que sur les légendes de la planche elle-même
(en-têtes de section, étiquettes d'annotation), jamais dans un composant réel.

## Échelle typographique (5 paliers)

| Taille | Rôle | Police / graisse |
|---|---|---|
| 40px | Display — wordmark, titre d'accueil | Bricolage Grotesque, gras |
| 28px | Titre — sections, nom de membre | Bricolage Grotesque, semi-gras |
| 20px | Sous-titre — tuiles « Je cherche… », en-têtes de carte | Bricolage Grotesque, medium |
| 16px | Texte — corps, paragraphes (plancher imposé) | Instrument Sans, normal |
| 14px | Méta — étiquettes, métadonnées non porteuses seules | Instrument Sans, medium |

## Bloc CSS du thème, prêt à coller

```css
[data-theme="cartoucherie"] {
  color-scheme: light;
  --font-display: "Bricolage Grotesque", ui-sans-serif, system-ui, sans-serif;
  --font-body: "Instrument Sans", ui-sans-serif, system-ui, sans-serif;

  --color-base-100: oklch(97.5% 0.012 85);
  --color-base-200: oklch(94% 0.016 80);
  --color-base-300: oklch(88.5% 0.022 75);
  --color-base-content: oklch(24% 0.025 40);

  --color-primary: oklch(53% 0.145 39);
  --color-primary-content: oklch(98.5% 0.006 39);

  --color-secondary: oklch(44% 0.052 193);
  --color-secondary-content: oklch(98% 0.006 193);

  --color-accent: oklch(52% 0.095 65);
  --color-accent-content: oklch(98% 0.008 65);

  --color-neutral: oklch(28% 0.02 45);
  --color-neutral-content: oklch(96.5% 0.01 85);

  --color-info: oklch(49% 0.10 235);
  --color-info-content: oklch(98% 0.01 235);

  --color-success: oklch(50% 0.125 145);
  --color-success-content: oklch(98% 0.01 145);

  --color-warning: oklch(78% 0.14 80);
  --color-warning-content: oklch(24% 0.04 80);

  --color-error: oklch(51% 0.205 21);
  --color-error-content: oklch(98.5% 0.006 21);

  --radius-selector: 1rem;
  --radius-field: 0.75rem;
  --radius-box: 1.25rem;
  --size-selector: 0.25rem;
  --size-field: 0.25rem;
  --border: 1px;
  --depth: 0;
  --noise: 0;
}
```

Tous les hex ci-dessus (calculés, pas devinés) : base-100 `#faf6ee`, base-200
`#f1eae0`, base-300 `#e2d7ca`, base-content `#2a1b16`, primary `#af4721`,
primary-content `#fef9f7`, secondary `#2c5c5a`, secondary-content `#f4faf9`,
accent `#8e5c26`, accent-content `#fcf7f3`, neutral `#322621`, neutral-content
`#f6f3ec`, info `#0d6891`, info-content `#f2fafe`, success `#2b7532`,
success-content `#f4faf4`, warning `#e6ac3d`, warning-content `#291d07`, error
`#c0002d`, error-content `#fef9f8`. Toutes en gamut sRGB (aucun écrêtage).
