# Direction 4 — « Colly »

La palette n'est pas une proposition : elle est **relevée sur la planche de la mascotte**
`Colly, la créature des Halles de la Cartoucherie`, échantillonnée au pixel sur la colonne
« Couleurs ». Le quartier avait déjà une identité ; l'application s'y range au lieu d'en
inventer une quatrième.

Planche : `colly.html`. Outil de conversion et de vérification : `../_shared/tools/palette.py`.

## 1 · Les quatre couleurs de la mascotte

| | Hex | OKLCH | Rôle dans l'interface |
|---|---|---|---|
| Teal foncé | `#325656` | `oklch(42.6% 0.042 196)` | primaire — en-têtes, tuiles, actions principales |
| Sauge | `#86a79c` | `oklch(70.0% 0.040 173)` | secondaire — pastilles de catégorie |
| Crème | `#e3d9c1` | `oklch(88.7% 0.034 88)` | bordures et fonds ; toute la famille `base` en dérive |
| Orange | `#df8d4f` | `oklch(71.6% 0.127 56)` | accent — **appeler**, et rien d'autre |

Deux ajustements assumés, tout le reste est fidèle :

- **Primaire** : chroma remontée de 0.042 à **0.055**. Un pigment d'illustration à
  chroma 0.042 lit gris sur un écran de téléphone ; +0.013 lui rend son identité de teal
  sans changer ni la teinte ni la luminosité.
- **`base-100`** n'est pas le crème mais un blanc chaud qui en dérive
  (`oklch(98.5% 0.008 88)`). Le crème à 88.7 % en fond de page est trop jaune sous le
  soleil ; il devient `base-300`, c'est-à-dire les bordures et les séparateurs, où il se
  voit partout sans fatiguer.

## 2 · Le thème daisyUI, prêt à coller

Onze couples `-content` en **AAA (7:1)**, calculés en luminance relative sRGB par
`palette.py`, jamais estimés à l'œil. Une seule encre sombre et un seul crème servent tous
les `-content` : deux valeurs plutôt que dix variantes de presque-noir.

```css
[data-theme="cartoucherie"] {
  color-scheme: light;
  --color-base-100: oklch(98.5% 0.008 88);      /* #fcfaf4 */
  --color-base-200: oklch(95.0% 0.018 88);      /* #f3eee1 */
  --color-base-300: oklch(88.7% 0.034 88);      /* #e3d9c1 — le crème */
  --color-base-content: oklch(19.0% 0.022 198); /* #071717 — l'encre */
  --color-primary: oklch(42.0% 0.055 196);      /* #225657 — le teal */
  --color-primary-content: oklch(98.5% 0.008 88);
  --color-secondary: oklch(70.0% 0.040 173);    /* #86a79c — la sauge */
  --color-secondary-content: oklch(19.0% 0.022 198);
  --color-accent: oklch(71.6% 0.127 56);        /* #df8d4f — l'orange */
  --color-accent-content: oklch(19.0% 0.022 198);
  --color-neutral: oklch(32.0% 0.028 198);      /* #213738 */
  --color-neutral-content: oklch(98.5% 0.008 88);
  --color-info: oklch(44.0% 0.100 245);         /* #145786 */
  --color-info-content: oklch(98.5% 0.008 88);
  --color-success: oklch(43.0% 0.100 150);      /* #1c5f31 */
  --color-success-content: oklch(98.5% 0.008 88);
  --color-warning: oklch(82.0% 0.150 92);       /* #e7c03a */
  --color-warning-content: oklch(19.0% 0.022 198);
  --color-error: oklch(46.5% 0.185 25);         /* #a9071b */
  --color-error-content: oklch(98.5% 0.008 88);
  --radius-selector: 2rem;
  --radius-field: 0.75rem;
  --radius-box: 1.25rem;
  --size-selector: 0.28rem;
  --size-field: 0.28rem;
  --border: 1px;
  --depth: 0;
  --noise: 0;
}
```

Rayons généreux et `--depth: 0` : Colly est rond et l'interface l'est aussi, mais à plat —
la séparation se fait par les fonds `base-200` et les bordures crème, pas par des ombres.

### Les couleurs manquantes

La mascotte ne fournit ni rouge d'erreur, ni vert de succès, ni bleu d'information. Elles
sont construites dans le même registre — désaturées, assombries jusqu'à AAA — et vérifiées
pour ne pas se confondre avec la marque :

- `error` (25°) contre `accent` (56°) : 31° de teinte, 21 points de luminosité, chroma
  0.185 contre 0.127. Aucune confusion possible entre « appeler » et « erreur ».
- `warning` (92°) contre `accent` (56°) : 36° de teinte et 10 points de luminosité — c'est
  la collision exacte que la direction « Terre rose » avait dû corriger, évitée ici.
- `success` (150°) et `info` (245°) sont à 46° et 49° du primaire.

## 3 · La règle qui accompagne la palette

**L'orange et la sauge sont des couleurs de remplissage uniquement.**

En texte ou en icône sur `base-100`, elles tombent à **2,50:1** et **2,51:1** — très
en dessous du seuil AA. Un libellé orange sur crème serait exactement le défaut
« pâle sur pâle » relevé à la révision 1. En pastille pleine avec l'encre sombre par-dessus,
elles passent AAA (7,05:1 et 7,01:1).

Pour un orange lisible en texte — sur un flyer imprimé, par exemple —
`oklch(56.7% 0.127 56)` / `#ae5f1b` donne 4,51:1 sur crème. Il n'entre pas dans le thème :
l'interface n'a pas de texte orange.

## 4 · Typographie — Nunito + Source Sans 3

**Nunito** (600/700/800) pour le mot-symbole, les titres et les noms de membres :
ronde comme Colly, mais sans basculer dans le registre enfantin — c'est un annuaire de
professionnels adultes. **Source Sans 3** (400/600) pour le corps : accents français
propres, très lisible à 16 px sur un écran de téléphone en plein soleil.

Chargement vérifié : `document.fonts.check` retourne `true` pour les deux, et la largeur
rendue diffère de la pile de repli (322,9 px contre 342,1 px), donc ce n'est pas un
faux positif.

Échelle à cinq degrés : 34 / 24 / 18 / 16 / 13 px. Le corps ne descend jamais sous 16 px.

## 5 · Le symbole

**La ventouse de Colly** — trois cercles concentriques. C'est sa caractéristique première
sur la planche, la seule forme de la mascotte qui reste lisible à 24 px dans un onglet, et
elle raconte déjà le produit : « Colly reste collé aux bons endroits ». Elle satisfait la
règle §5 de `brand.md` sans effort, puisqu'elle ne doit rien à la munition.

La mascotte complète ne remplace pas le symbole : elle sert ailleurs — les états vides
(« aucun résultat »), la page 404, l'accueil d'un nouveau voisin, le flyer et les
autocollants. Une mascotte a besoin d'endroits où apparaître ; une interface de recherche
n'en est pas un.

## 6 · Ce que cette direction gagne et ce qu'elle coûte

**Gagne.** C'est la seule des quatre dont la palette ne soit pas une opinion. Elle est
cohérente avec un asset que la communauté possède déjà, et elle donne au produit quelque
chose qu'aucune des trois autres n'avait : un personnage. Sur la densité elle égale la
meilleure — trois voisins et l'action « tout voir » dans un écran, 95 px par personne.

**Coûte.** Elle dépend d'une décision qui n'est pas encore prise : Colly n'est pour
l'instant qu'une proposition. Si la mascotte est abandonnée, la palette reste valable mais
perd sa justification, et le symbole-ventouse perd son sens. À vérifier aussi : que la
mascotte soit libre de droits et utilisable par l'association.

Le teal à 42 % est par ailleurs plus sombre que le vert Nextdoor : l'interface est plus
posée, moins pétillante. C'est cohérent avec la mascotte, dont la planche est elle-même
sourde — mais c'est un choix, pas une évidence.
