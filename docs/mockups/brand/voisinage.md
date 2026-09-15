## Voisinage — Direction 1

**L'idée, en trois phrases.** L'Annuaire de la Cartoucherie doit se lire comme un voisin qui
tient la porte, pas comme une application de plus : un seul vert confiant porte toute
l'identité, sur un fond presque blanc et généreusement aéré, sans profondeur ni ornement pour
la distraire. L'ambre n'apparaît que là où il se passe quelque chose — un bouton, une action —
jamais en décor. Le caractère vient du contraste de graisse dans le mot-symbole et du rythme
des espacements, pas d'une police décorative ni d'un vert « écologique » de carte postale.

### Le vert exact

**`oklch(38% 0.075 152)`** — hex `#1e4e2e`, un vert forêt profond et légèrement grisé, plus
proche du vert anglais ou du vert bouteille que du vert « frais » ou « bio » qu'on attend d'une
appli de quartier. C'est délibéré : la consigne demandait un vert « légèrement inhabituel »,
et la plupart des annuaires de voisinage choisissent un vert menthe ou émeraude clair et
saturé. En creusant la clarté (38 % au lieu de 55-60 %) et en réduisant le chroma (0.075 au
lieu de 0.15+), le vert perd son côté « pousse de printemps » et gagne un sérieux civique —
plus proche d'un uniforme ou d'une porte peinte que d'un logo d'application bien-être. Il reste
un vert net, jamais boueux, et tient un contraste de 9,12:1 avec son `-content` blanc cassé
(AAA), et de 8,97:1 posé en texte sur le fond `base-100`.

Autour de lui : une base presque blanche mais chaude (`oklch(97.5% 0.008 88)`, teinte 88° —
papier, pas hôpital), une sauge très pâle (`oklch(90% 0.035 152)`) pour les surfaces
secondaires et les badges, et un ambre chaud (`oklch(74% 0.150 58)`, `#f0903c`) réservé
strictement à une action : appeler un voisin. C'est le bouton téléphone, répété partout dans
le produit, qui porte l'ambre — jamais un fond, jamais une tuile, jamais une catégorie.

### La typographie — Manrope + Public Sans

**Manrope** (800/700 pour les titres et le mot-symbole) apporte le contraste de graisse
demandé : ses extra-bold ont un caractère presque affiché sans jamais devenir une police
décorative, et ses terminaisons légèrement arrondies évitent la froideur d'une géométrique
stricte. **Public Sans** (400/600 pour le corps et les libellés) est la police du design
system civique américain (USWDS) — un choix qui n'est pas un hasard pour un annuaire
municipal : humaniste, très lisible à 16 px, elle ne cherche jamais à se faire remarquer à côté
d'un titre en Manrope 800. Les deux polices partagent la même famille de proportions
(x-height généreuse, formes ouvertes), donc rien ne « frotte » quand elles se retrouvent sur le
même écran — mais elles ne sont jamais la même police, ce qui donne au titre son relief.

Échelle (5 paliers, en pixels) :
1. **40 px** — Manrope 800 — mot-symbole, titre héros
2. **28 px** — Manrope 700 — titres de section
3. **20 px** — Manrope 700 — titres de carte, tuiles « Je cherche… »
4. **16 px** — Public Sans 400 — paragraphes, descriptions (jamais plus petit)
5. **13 px** — Public Sans 600, majuscules espacées (`tracking` 0.06–0.1em) — catégories,
   libellés, métadonnées

### Le repère (le mark)

Un anneau ouvert comme une porte entrebâillée, avec un petit point d'accent ambre qui tient
lieu de lumière de perron — la lumière qu'on laisse allumée pour un voisin qui rentre tard.
Dessiné en pure géométrie (un carré à grand rayon, un anneau incomplet, un point), il ne
représente ni bâtiment, ni porte au sens littéral, ni — bien sûr — aucune munition. Il se lit
comme un monogramme abstrait à 48 px et reste identifiable à 24 px dans un onglet de
navigateur : c'est un anneau et un point, rien de plus fin ne s'y perd.

Note technique : `--size-field` est fixé à `0.275rem` plutôt qu'aux `0.25rem` par défaut de
daisyUI, pour que tout bouton, champ et cible tactile en taille standard mesure 44 px de haut —
vérifié à la mesure (`getBoundingClientRect`) et non par calcul de tête. C'est la valeur qui
gouverne tout le système, donc elle se fixe une fois ici plutôt que d'être rattrapée composant
par composant.

### Bloc CSS du thème — prêt à coller

```css
[data-theme="cartoucherie"] {
  color-scheme: light;
  --color-base-100: oklch(97.5% 0.008 88);
  --color-base-200: oklch(95% 0.010 88);
  --color-base-300: oklch(90% 0.012 88);
  --color-base-content: oklch(22% 0.020 145);
  --color-primary: oklch(38% 0.075 152);
  --color-primary-content: oklch(98% 0.012 152);
  --color-secondary: oklch(90% 0.035 152);
  --color-secondary-content: oklch(28% 0.060 152);
  --color-accent: oklch(74% 0.150 58);
  --color-accent-content: oklch(24% 0.040 58);
  --color-neutral: oklch(26% 0.018 95);
  --color-neutral-content: oklch(96% 0.010 95);
  --color-info: oklch(50% 0.090 230);
  --color-info-content: oklch(97% 0.010 230);
  --color-success: oklch(44% 0.100 152);
  --color-success-content: oklch(97% 0.010 152);
  --color-warning: oklch(80% 0.160 80);
  --color-warning-content: oklch(24% 0.030 80);
  --color-error: oklch(50% 0.190 24);
  --color-error-content: oklch(98% 0.010 24);
  --radius-selector: 1rem;
  --radius-field: 0.75rem;
  --radius-box: 1.5rem;
  --size-selector: 0.25rem;
  --size-field: 0.275rem;
  --border: 1px;
  --depth: 0;
  --noise: 0;
}
```

### Ratios de contraste (calculés, WCAG 2.x, luminance relative sRGB)

| Paire | Ratio | Niveau |
|---|---|---|
| `base-content` / `base-100` | 16,09:1 | AAA |
| `base-content` / `base-200` | 14,87:1 | AAA |
| `base-content` / `base-300` | 12,81:1 | AAA |
| `primary-content` / `primary` | 9,12:1 | AAA |
| `secondary-content` / `secondary` | 10,73:1 | AAA |
| `neutral-content` / `neutral` | 13,84:1 | AAA |
| `warning-content` / `warning` | 8,64:1 | AAA |
| `success-content` / `success` | 6,78:1 | AA (proche AAA) |
| `error-content` / `error` | 6,24:1 | AA |
| `accent-content` / `accent` | 6,93:1 | AA (sous AAA de peu) |
| `info-content` / `info` | 5,42:1 | AA |

Toutes les paires dépassent le seuil AA (4,5:1). Six sur onze dépassent l'AAA (7:1). Les trois
paires qui restent en AA seul (accent, info, error) ne portent jamais de texte de paragraphe —
seulement des libellés courts sur bouton ou badge — donc le seuil AA leur suffit honnêtement.
Le texte de corps réel (16 px, sur `base-100`) est à 16,09:1 : très au-dessus de ce qu'exige la
lisibilité pour un utilisateur de 70 ans en plein soleil.

### Ce qui est plus faible que les directions rivales

Sur les trois directions, celle-ci est la plus dépendante d'une seule couleur pour porter toute
la reconnaissance de marque — ce qui la rend la plus fragile si le vert est mal reproduit
(impression, écran mal calibré, daltonisme deutéranope où le vert profond peut se rapprocher
d'un brun neutre). « Terre rose » a l'avantage d'un ancrage local immédiat (la brique, la ville
rose) qui n'a besoin d'aucune explication ; « Voisinage » doit construire seule toute son
identité sur un choix de teinte, sans le filet de sécurité d'une référence au lieu. C'est un pari
plus abstrait, et le moins spécifiquement toulousain des trois.
