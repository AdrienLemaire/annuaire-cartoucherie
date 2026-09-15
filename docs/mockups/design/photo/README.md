# LA PHOTOGRAPHIE — Annuaire de la Cartoucherie

Deux écrans : `index.html` (l'accueil) et `membre.html` (la fiche de Camille Roussel).
Statique, Tailwind 4 + daisyUI 5 par CDN, palette `_shared/couleurs.md` reprise telle quelle.

---

## La thèse

Cet annuaire ne vend pas un service, il présente **douze personnes**, et un visage à 300 px
fait quelque chose qu'un visage à 88 px ne fera jamais : il regarde le lecteur. J'ai donc
traité chaque portrait comme un **tirage** — cadre blanc, ombre portée, cartel dessous — et
laissé la photographie porter la composition entière, jusqu'au fond des pages, qui n'est
rien d'autre qu'un portrait agrandi et flouté. Le produit est distribué par des flyers
papier dans les commerces du quartier : l'écran continue l'objet imprimé plutôt que de faire
semblant d'être une application.

## Le duo typographique

**Fraunces** (titres, cartels, citations) + **Karla** (texte et interface).

Fraunces est un serif variable dont j'exploite trois axes — `opsz` réglé par taille,
`SOFT 45–50` et `WONK 1`. Le `SOFT` arrondit les empattements et le `WONK` réveille le
« g » et l'italique : on obtient l'autorité éditoriale d'un serif de magazine **sans sa
froideur**, ce qui est exactement le registre d'un annuaire de quartier tenu par une
association. C'est aussi le seul membre du couple qui puisse tenir « Camille Roussel » à
44 px sans hurler. Karla, en face, est une grotesque à contrepoinçons ouverts, très lisible
à 17 px, avec des accents français dessinés (le « à », le « ç », le « œ ») et assez de
caractère pour ne jamais passer pour Inter. La tension serif chaud / grotesque nette est ce
qui donne au tout son air de journal de quartier plutôt que de SaaS.

Échelle : 17 px de corps → 68 px pour « Je cherche… » sur grand écran, 44–46 px sur
mobile. **Rapport 2,75× contre le corps de 16 px**, très au-dessus du minimum demandé.

## Trois décisions que j'aimerais qu'on remarque

**1. Le halo — le fond de chaque page est le portrait de la page.**
Le lavis derrière l'accueil et derrière la fiche de Camille n'est pas un dégradé décoratif :
c'est son propre portrait, agrandi, flouté à 54 px, saturé et posé en `multiply` sur le
`--gradient-aube`. Chaque fiche membre hérite donc automatiquement de **l'atmosphère
colorimétrique de la personne qu'elle décrit**, sans un seul asset supplémentaire, sans
lecture de pixel côté serveur, et sans qu'une direction illustrée ou typographique puisse
en faire autant. C'est le dispositif signature de cette proposition.

**2. Colly grimpe sur la feuille.**
La feuille blanche « Je cherche… » chevauche le mur de portraits, et Colly — qui a des
ventouses et dont la fiche de personnage dit qu'il grimpe partout — est **accroché à son
coin supérieur**, moitié sur la photo, moitié sur le blanc. Il n'est pas posé dans un
encadré « mascotte » : il tient le seul endroit de la page où deux plans se croisent. Il
réapparaît en pied de page (le panneau sable « votre visage manque au mur ») et en état
vide, où son croquis est **encadré comme les portraits** — même cadre blanc, même ombre.

**3. La forme suit la donnée.**
Les cartes de l'annuaire ont trois formats, et le format n'est pas décoratif : les voisins
qui ont une adresse reçoivent un **rectangle** (portrait en 4/5, plein bord), ceux qui n'en
ont pas — `surCarte: false`, Amandine, Julien, « ils viennent chez vous » — reçoivent un
**disque** de 124 px sur un fond sable. Deux fiches par écran passent en pleine largeur.
Le rythme large / duo / large / duo casse la monotonie que douze carrés identiques auraient
produite, et il la casse pour une raison lisible plutôt que par caprice de grille.

## Discipline de la palette

- Fond **blanc** partout ; la chaleur vient de l'orange, du panneau sable et des photos.
- **Trois objets orange par écran, pas quatre — comptés.** Accueil : (1) le filet de 3 px
  sous l'en-tête, (2) le bouton de recherche, (3) les points de suspension de
  « Je cherche… » en `orange-800`. La pastille active est en `teal-950` avec son compteur en
  `teal-200`, pour ne pas devenir un quatrième. Fiche : (1) le filet, (2) le bouton
  « Appeler », (3) « Sophrologue » en `orange-800` — de l'encre, pas du remplissage. Les
  étoiles sont en `sable-500`, jamais en orange : une note ne doit pas ressembler à une
  action.
- **Aucune utilisation en texte d'une couleur de remplissage** (§10) : pas de
  `text-accent`, pas de `text-warning`, pas de `text-secondary`.
- Toutes les paires vérifiées avec `_shared/tools/palette.py` : **21 paires testées,
  21 en AAA**, la plus basse à 7,03:1 (le CTA orange). Bordures de champ et de pastille en
  `neutre-500` (3,03:1, seuil 1.4.11).
- Profondeur réelle : `shadow-carte` sur chaque carte, `shadow-flottant` sur les deux
  feuilles et la barre d'appel, `shadow-cta` chaude sous le bouton orange.

## Détails d'exécution

- **Un seul jeu d'icônes**, tracé à la main en SVG inline, `stroke="currentColor"`,
  épaisseur 1,8–2,1. Aucun emoji dans l'interface, y compris pour les catégories (le champ
  `emoji` de `members.json` est volontairement ignoré).
- **Contacts absents gérés structurellement** : la barre d'appel et la rangée de bureau sont
  rendues depuis l'objet du membre ; `site`, `instagram` et `email` à `null` ne dessinent
  simplement rien. Camille les possède tous les quatre ; Yanis n'a pas d'Instagram, Marc
  n'a pas de site, et le même code les sert sans bouton mort.
- **« Appeler » n'existe qu'une fois** : barre collante dans la zone du pouce sur mobile,
  rangée en clair sur grand écran, jamais les deux.
- Filtrage et recherche en JS inline, sans dépendance ; état vide avec Colly.
- Le QR de la fiche est **une image décorative** : structure exacte (motifs de repérage,
  synchronisation, alignement, zone de silence) mais charge utile non encodée. Le livrable
  demandait la commande de téléchargement, pas un encodeur Reed-Solomon invérifiable ici.
- Grain `feTurbulence` en `soft-light` à 50 % sur chaque photographie.
- Vérifié : 360 px, 390 px et 1440 px, aucun défilement horizontal ; cibles ≥ 44 px ; focus
  visible unique (`teal-600`, 2 px, décalé) ; `prefers-reduced-motion` respecté.

## Ce qui est faible dans une direction photographique — honnêtement

**Les portraits font 128 × 128 pixels.** C'est le maximum que serve `randomuser.me`, et
c'est la limite dure de toute cette proposition : le tirage dominant de l'accueil (≈ 290 px)
et celui de la fiche (≈ 296 px) sont des agrandissements ×2,3, visiblement doux, et ils le
seront davantage sur un écran de téléphone en 3×. J'ai fait de cette contrainte une
intention — grain, cadre blanc, registre imprimé, et un plafond que je me suis imposé :
**aucune photographie au-delà de 290 px**, ce qui m'interdit le plein-bord total que la
direction appelait. Sur grand écran je gagne de la largeur en **ajoutant des visages**, pas
en agrandissant les mêmes. Les vrais portraits de Sandra, s'ils font 1000 px, effacent ce
problème d'un coup — mais tant qu'ils n'existent pas, ma direction est celle qui souffre le
plus, et c'est la première chose à vérifier avant de la choisir.

Trois autres faiblesses réelles :

1. **La photographie ne dit pas ce que les gens font.** Douze visages souriants sur fond
   neutre ne distinguent pas un électricien d'un expert-comptable ; c'est la typographie et
   les pastilles qui font tout le travail sémantique. Une direction illustrée pourrait
   dessiner le métier ; moi, je ne peux que l'écrire. Sur un annuaire où la question est
   « qui fait X », c'est une faiblesse de fond, pas de surface.
2. **Le poids.** Douze portraits, plus trois halos par page, sur une connexion faible dans
   une boutique : la direction typographique s'affiche instantanément, la mienne non. Les
   `loading="lazy"` et le fond `neutre-200` sous chaque image limitent la casse, pas plus.
3. **La direction dépend d'un asset que le projet ne contrôle pas encore.** Si un voisin
   refuse d'être photographié, ou si les portraits arrivent en qualités hétérogènes — au
   téléphone, en intérieur, mal cadrés — le mur perd sa cohérence et ma page d'accueil perd
   son sujet. Une direction typographique ne peut pas se casser de cette manière.
