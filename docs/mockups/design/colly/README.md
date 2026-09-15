# Direction « Colly » — l'annuaire habité

Deux écrans : `index.html` (l'accueil, après le scan d'un QR code) et `membre.html`
(la fiche de Camille Roussel). Palette et voix : `_shared/couleurs.md`, `_shared/brand.md`,
reprises verbatim.

## La thèse

Le quartier possède une créature, et aucun concurrent n'en a une : Colly vit dans les poutres
de la Halle, elle a des ventouses, et elle connaît tout le monde. Plutôt que de la coller en
autocollant dans un coin, je l'ai traitée comme **l'hôtesse du lieu** — elle se hisse sur le
bord de la barre de recherche, elle est déçue quand la recherche ne donne rien, elle invite à
laisser un avis — et j'ai construit autour d'elle un monde graphique tenu par un seul motif :
**la ventouse, trois cercles concentriques**, qui devient le logo, la puce de liste, la
pastille d'icône et le papier peint des panneaux `sable`. Résultat : une interface qu'on ne
peut pas copier sans copier le personnage, et qui reste, sous la ligne de flottaison, un
annuaire professionnel très ordinaire — ce qui est exactement le but.

## La typographie

**Fraunces** (titres) + **Source Sans 3** (texte courant).

`brand.md` proposait Nunito ; je l'ai écarté. Nunito est un rond géométrique, et un rond
géométrique appliqué à une mascotte donne une application pour enfants — c'est le piège
numéro un de cette direction. Fraunces est un « soft serif » à axes variables : réglé à
**`SOFT` 55 et surtout `WONK` 0**, il garde la chaleur dessinée et le galbe d'une lettre
tracée à la main, mais il conserve des empattements, donc de l'autorité. C'est la police d'une
enseigne d'artisan, pas d'un livre d'images. (`WONK` 1, la variante à l'italique bancal, est
précisément ce qui aurait fait basculer la page du côté enfantin ; il est explicitement à 0.)
Source Sans 3, en dessous, est un humaniste large, très ouvert, dessiné pour l'écran et pour
le français accentué : c'est lui qui porte les 17 px du corps, les numéros de téléphone et les
adresses. Le contraste serif/sans est ce qui empêche la page de ressembler à un template.

Échelle : **86 / 54 / 42 / 30 / 20 / 17 / 16 px** — soit **3,4×** entre le plus grand pas et
le corps à 16 px sur l'accueil, 2,6× sur la fiche.

## Trois décisions de composition

1. **Colly se hisse sur le bord de la carte de recherche**, elle ne s'assoit pas dedans. Le
   PNG couleur déborde du bloc blanc, ses ventouses au-dessus du filet, avec une annotation
   manuscrite et une flèche courbe dessinée en SVG qui pointe vers le champ. C'est le seul
   endroit de l'accueil où quelque chose casse la grille, et c'est ce dont on se souvient.
2. **L'arche de la Halle**, deux fois. La fiche membre encadre le portrait dans une arche
   (demi-cercle + base droite), posée sur un panneau `sable-200` tapissé de ventouses ; la
   carte d'identité blanche vient ensuite grimper par-dessus le bord inférieur du panneau,
   le même geste que Colly sur l'accueil. Le patrimoine du quartier est honoré par
   l'architecture — jamais par la munition, conformément à `brand.md` §5.
3. **Le motif est masqué là où il y a du texte.** Le papier peint de ventouses est posé en
   couche absolue avec un `mask-image` en dégradé : il tapisse le haut du panneau, derrière
   l'illustration, et disparaît avant le premier paragraphe. Une décoration qui traverse un
   texte de 17 px est une décoration ratée.

## Comment j'ai fait tenir quatre images

Une seule est en couleur et détourée ; les trois autres sont des crayonnés **sur papier
opaque**, ce qui les rend inutilisables tels quels sur fond blanc.

- `colly-couleur.png` — l'unique apparition en couleur, l'accueil, 140 px sur mobile.
- Les trois crayonnés passent en **`mix-blend-mode: multiply`** avec
  `grayscale(1) contrast(1.16) brightness(1.07)`, dans un disque : le papier est poussé au
  blanc puis multiplié, donc il *devient* la couleur du panneau et le rectangle disparaît. Le
  graphite, lui, survit. C'est ce qui les fait passer pour des dessins faits sur la page.
  `salut` → le panneau `sable` de l'accueil ; `triste` → l'état « aucun résultat » (sur
  `teal-50`) ; `joyeux` → l'invitation à laisser un avis (sur `sauge-100`).
- Le reste du monde illustré est **dessiné en CSS** : le motif ventouse est un empilement de
  trois `radial-gradient` concentriques en `background-size: 56px`, et la même figure sert de
  `.pastille` (anneau + halo + anneau) pour chaque icône, chaque numéro d'étape et chaque
  initiale d'avis. Un seul motif, décliné en quatre tailles, remplace la bibliothèque
  d'illustrations qu'on n'a pas.
- Vingt-quatre icônes SVG inline, un seul tracé (`stroke-width` 1,7, bouts ronds). Les emoji
  de `members.json` ne sont jamais rendus.

## Une note sur les portraits

Les URLs de `members.json` (randomuser.me) renvoient des JPEG de **128 × 128 px**. Un
portrait « plein cadre » sur 390 px serait donc un agrandissement ×3 — un visage flou, et un
visage flou détruit la confiance qu'on cherche précisément à installer. La contrainte est
donc respectée à sa lettre utile : la photo est **à fond perdu dans la carte**, collée aux
bords haut, gauche et bas d'une carte de 152 px de haut, à 116 px de large (×1,17), et le
portrait de la fiche fait 172 px sous son arche (×1,34). Les visages sont partout bien
au-dessus des 88 px exigés et restent nets. Avec les portraits réels de Sandra, en pleine
définition, les deux cadres se remplissent sans rien changer au code.

## Comment le charme ne coûte pas la crédibilité

- **Colly est rationnée.** Deux apparitions visibles à la fois sur l'accueil, une sur la
  fiche — et sur la fiche elle n'arrive qu'après les avis, très bas. Le premier écran de
  `membre.html`, celui qui décide d'un appel, ne contient aucun personnage : un visage réel
  sous une arche, un nom en 42 px, un métier, une note, une distance.
- **Aucune bulle de bande dessinée, aucun appendice de bulle, aucun emoji.** Colly ne parle
  jamais à la première personne dans une phrase fonctionnelle ; l'unique annotation
  manuscrite est une consigne d'usage (« Dites-lui ce qu'il vous faut. »).
- **La moitié basse des deux pages est du design d'information pur** : adresses, horaires
  implicites, canaux de contact, avis datés et signés, QR code.
- **L'honnêteté est visible.** Les six tuiles « Je cherche… » affichent des comptes vérifiés
  contre `members.json` (et accordés : « 1 voisine » pour Nadia) ; l'état vide dit « douze
  voisins pour l'instant » au lieu de suggérer un catalogue ; la fiche annonce « Tarifs non
  communiqués : demandez-les au téléphone ».
- **Un canal de contact absent n'est pas rendu** — pas de ligne grisée, pas de « non
  renseigné ». Marc Ollivier n'a pas de site : sa fiche affichera deux tuiles, pas trois.
- **Contrastes vérifiés** avec `_shared/tools/palette.py`, pas à l'œil. Tout le texte porteur
  est ≥ 4,9:1, l'essentiel en AAA ; le CTA orange est à 7,03:1 ; la bordure du champ de
  saisie est `neutre-500` (3,03:1). Deux corrections issues de cette vérification : les
  étoiles de note sont passées de `sable-600` (2,90:1 — sous le seuil 1.4.11) à `sable-700`
  (4,42:1), et le paragraphe du panneau Colly de `teal-950/85` est mesuré composité (10,93:1)
  plutôt que supposé.
- **Discipline 60/30/10 tenue au comptage, honnêtement.** Sur l'accueil, le chaud c'est :
  le bouton d'action, le filet signature de 3 px, l'unique panneau `sable`, l'anneau
  `orange-500` de la tuile sélectionnée (le seul état actif orange autorisé, `couleurs.md`
  §4) — et les trois points de « Je cherche… », en `orange-800` (7,62:1), qui sont une
  lettre plutôt qu'un objet. Cinq choses, dont une typographique et une conditionnelle. Sur
  la fiche : le CTA collant, le filet, le panneau `sable`. Fond blanc partout, aucune barre
  d'en-tête colorée, aucun orange en lien, en fond de carte ni en texte courant.

## Ce qui est faible dans une direction menée par la mascotte

- **Les droits ne sont pas acquis.** `_shared/colly/README.md` le dit : « Colly est une
  proposition, pas encore validée ; à confirmer que l'association a bien le droit d'utiliser
  ces images. » Si la réponse est non, cette direction perd son actif principal du jour au
  lendemain, alors que les directions photo et typographie ne perdent rien. C'est le risque
  le plus sérieux et il n'est pas graphique.
- **Une seule image couleur, et elle est basse définition.** Toute évolution du produit — une
  page 404, un e-mail, un onboarding, une deuxième pose — demande un nouveau dessin, donc un
  illustrateur, donc un budget, sur un projet bénévole. Les crayonnés fondus en `multiply`
  sont une astuce élégante, mais c'est une astuce : ils ne supportent ni l'agrandissement, ni
  le fond sombre, ni l'impression du flyer papier.
- **Une mascotte plafonne la perception de sérieux.** Un expert-comptable et un électricien
  n'ont, eux, aucune envie d'être présentés par une créature ; il est probable qu'une partie
  des membres trouve la direction infantilisante pour *leur* activité, et cette objection
  vient de la personne qu'on référence, pas du visiteur.
- **Elle vieillit moins bien.** Une direction typographique ou photographique se re-décline
  indéfiniment ; un personnage devient vite daté, et surtout on s'en lasse plus vite qu'on ne
  se lasse d'une grille.
- **Le risque « enfants » ne disparaît jamais complètement.** Il est tenu ici par le
  rationnement et par Fraunces, mais il suffit d'une future page où quelqu'un remet Colly
  deux fois de plus pour que l'équilibre casse. Cette direction demande une discipline
  permanente que les deux autres ne demandent pas.

## Vérification

```
google-chrome --headless --disable-gpu --no-sandbox --hide-scrollbars \
  --window-size=390,2400 --virtual-time-budget=14000 \
  --screenshot=/tmp/colly-index.png docs/mockups/design/colly/index.html
```

Contrôlé à **360, 390 et 1440 px** : aucun défilement horizontal (largeur de Colly mesurée au
pixel par différence d'images : 140 px, 26 px de marge à 360 px), Fraunces et Source Sans 3
effectivement chargées, portraits `members.json` chargés. Cibles tactiles ≥ 44 px, corps ≥
16 px, `<label>` réels, focus visible (`teal-600` + décalage blanc), ordre des titres correct,
aucun nom tronqué. L'état vide se capture avec `index.html#q=zzz`.
