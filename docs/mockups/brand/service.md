# Direction 3 — « Service »

## L'idée en trois phrases

Un bleu profond, à peine tiré vers le violet pour ne pas sonner « bleu par défaut », porte
toute l'identité ; l'orange n'apparaît que sur une action, jamais en décor. La densité est
assumée — plus d'information par écran que les deux autres directions — mais reste respirable
grâce à des radius doux et une hiérarchie typographique nette. C'est la planche à choisir si la
priorité absolue est qu'un résident de 70 ans, en plein soleil, avec un flyer à la main,
comprenne l'écran en une seconde.

## Le bleu

**`oklch(40% 0.115 263)` → `#254485`**

Un bleu volontairement écarté du bleu primaire pur (hue ~260 « manuel scolaire ») vers 263°,
soit une pointe de violet plutôt que de cyan — c'est ce demi-degré de décalage qui fait la
différence entre « bleu de confiance » et « bleu Bootstrap ». Chroma modérée (0.115, pas 0.2)
pour rester sobre plutôt que saturé. À 40 % de luminosité il fonctionne aussi bien en fond de
bouton (texte blanc dessus) qu'en texte sur fond clair (8.98:1) — un seul bleu qui tient les
deux rôles, pas de variante « bleu clair » à gérer en plus.

## L'orange

**`oklch(72% 0.16 63)` → `#e98a13`**

Hue 63° : ambre chaud, pas orange-rouge « cône de chantier » (qui se situe plutôt vers 40-50°).
Réservé strictement aux actions — jamais utilisé en décor, jamais deux fois sur le même écran —
pour que sa rareté porte le sens : quand on le voit, il y a quelque chose à faire. Luminosité
poussée à 72 % (plus clair qu'un orange « sûr » à 60 %) précisément pour pouvoir poser du texte
presque noir dessus et dépasser 7:1 — l'orange le plus légal, pas le plus criard.

## La typographie

**Be Vietnam Pro** (titres, 600–800) + **Source Sans 3** (texte courant, 400/600).

Be Vietnam Pro a un dessin légèrement technique — terminaisons carrées, contrepoinçons ouverts —
qui porte bien la densité de cette direction sans devenir froide : c'est une grotesque
« sturdy », pas décorative, exactement le registre que demande « Service ». Source Sans 3 est
l'une des grotesques les plus lisibles à petite taille qui existent (dessinée par Adobe
spécifiquement pour l'interface) : à 16px elle tient l'objectif AAA sans qu'on ait besoin de
l'agrandir. Les deux sont des grotesques humanistes proches en proportion, donc la paire ne crée
jamais de rupture de ton entre un titre et le paragraphe qui suit.

## Le concept de marque

Le mark est une silhouette de trois toits à hauteurs inégales — une rangée de façades de
quartier, pas un bâtiment précis, et surtout pas la Halle ni aucune forme cylindrique : aucune
ambiguïté possible avec une cartouche. Il se lit comme un pictogramme unique à 24px (testé,
voir la planche) parce qu'il est construit uniquement de lignes droites — pas de courbe qui
s'écrase en icône minuscule. Il porte le trait de personnalité « Fière du quartier » (une rue,
pas une carte) tout en restant strictement utilitaire, ce qui est le mandat de cette direction.

## Contraste mesuré (toutes les paires -content de la planche)

| Paire | Contraste | Niveau |
|---|---|---|
| `base-content` sur `base-100` | 17.35:1 | AAA |
| `base-content` sur `base-200` | 15.89:1 | AAA |
| `base-content` sur `base-300` | 13.65:1 | AAA |
| `primary-content` sur `primary` | 9.10:1 | AAA |
| `secondary-content` sur `secondary` | 8.17:1 | AAA |
| `accent-content` sur `accent` | 7.73:1 | AAA |
| `neutral-content` sur `neutral` | 13.38:1 | AAA |
| `info-content` sur `info` | 7.87:1 | AAA |
| `success-content` sur `success` | 9.04:1 | AAA |
| `warning-content` sur `warning` | 10.31:1 | AAA |
| `error-content` sur `error` | 8.46:1 | AAA |

Les neuf paires dépassent 7:1 — aucune n'a été laissée à AA par défaut. Deux valeurs
supplémentaires, décidées en cours de fabrication et invisibles dans le tableau des nuances,
valent la peine d'être notées :

- **`secondary` utilisé directement comme texte/contour** (boutons `btn-outline btn-secondary`,
  icônes de contact) sur `base-100` : **8.06:1**. Le bleu-ardoise a été choisi assez foncé
  (L 42 %) pour remplir ce rôle sans jamais devenir un texte pâle-sur-pâle — le péché de la
  révision 1.
- **Texte secondaire à opacité réduite** (légendes, distances, libellés de navigation non
  sélectionnés) : fixé à `/80` d'opacité de `base-content`, soit **9.45:1** sur `base-100`. Les
  opacités `/50` et `/60` testées d'abord tombaient à 2.55:1 et 4.69:1 — largement sous le seuil
  et potentiellement sous AA pour de l'information réellement lue (distance, note, libellé de
  bas de nav) : elles ont été écartées.

## Bloc CSS complet — prêt à coller

```css
[data-theme="cartoucherie"] {
  color-scheme: light;
  --color-base-100: oklch(98.5% 0.006 258);
  --color-base-200: oklch(95.5% 0.008 258);
  --color-base-300: oklch(90.5% 0.012 258);
  --color-base-content: oklch(20% 0.028 258);
  --color-primary: oklch(40% 0.115 263);
  --color-primary-content: oklch(99% 0.004 258);
  --color-secondary: oklch(42% 0.06 246);
  --color-secondary-content: oklch(99% 0.004 250);
  --color-accent: oklch(72% 0.16 63);
  --color-accent-content: oklch(14% 0.025 50);
  --color-neutral: oklch(28% 0.022 258);
  --color-neutral-content: oklch(97% 0.006 258);
  --color-info: oklch(42% 0.085 235);
  --color-info-content: oklch(98% 0.006 240);
  --color-success: oklch(38% 0.11 148);
  --color-success-content: oklch(98% 0.01 148);
  --color-warning: oklch(80% 0.14 85);
  --color-warning-content: oklch(16% 0.03 85);
  --color-error: oklch(42% 0.17 25);
  --color-error-content: oklch(97% 0.006 25);
  --radius-selector: 0.5rem;
  --radius-field: 0.75rem;
  --radius-box: 1rem;
  --size-selector: 0.25rem;
  --size-field: 0.25rem;
  --border: 1px;
  --depth: 0;
  --noise: 0;
}
```

## Ce qui est plus faible que les deux autres directions

**Accueillante** — le trait n°1 de la personnalité de marque, celui qui prime sur tous les
autres en cas de conflit. Cette direction gagne sur *Claire* (n°2) et *Sobre* (n°5), mais c'est
structurellement la moins chaleureuse des trois : base froide, bleu profond en primaire, et
l'orange n'existe que sur les boutons — donc sur un écran sans action (une page « à propos », un
paragraphe de bio, une carte de résultat qu'on ne fait que lire), rien ne dit « voisin qui vous
tient la porte ». Les deux rivales portent la chaleur dans leur teinte de fond ou leur brique ;
« Service » la réserve à l'instant précis où l'on clique. C'est un choix défendable — la
lisibilité est la promesse de cette direction, pas l'accueil — mais c'est bien elle qui paie le
prix le plus visible sur le trait que la charte fait pourtant passer en premier.
