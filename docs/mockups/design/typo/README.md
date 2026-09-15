# Direction « Typographie » — Annuaire de la Cartoucherie

Deux écrans : `index.html` (l'accueil, après le QR code du flyer) et `membre.html`
(la fiche de Camille Roussel). Palette et thème daisyUI repris **verbatim** de
`_shared/couleurs.md` §8 — les blocs sont injectés à la construction, aucune
valeur n'est retapée à la main.

---

## 1. La thèse, en trois phrases

**« Je cherche… » est une phrase, et l'interface doit la dire comme une phrase.**
La structure de cet annuaire n'est pas du mobilier — c'est de la langue : dix
manières de finir une phrase, douze noms propres, trois chiffres — et posée à
l'échelle qu'elle mérite, cette langue organise la page plus chaleureusement et
plus lisiblement que n'importe quel arrangement de cartes. Les titres timides à
26 px des révisions précédentes sont exactement la raison pour laquelle chaque
maquette se lisait comme un formulaire au lieu d'un lieu : ici la hiérarchie
typographique fait le travail que faisaient les bordures et les boîtes, et il ne
reste presque aucune boîte.

---

## 2. Le couple de fontes

| rôle | fonte | poids chargés |
|---|---|---|
| affichage | **Young Serif** | 400 (une seule graisse, aucune italique) |
| texte et interface | **Archivo** | 400–800, italiques 400–700 |

**Pourquoi ces deux-là, précisément.**

**Young Serif** est une antique taillée large, à empattements épais et à faible
contraste — un caractère d'enseigne peinte plutôt que de magazine. C'est le
registre exact de la marque : « l'annuaire du quartier, fait par le quartier »,
une devanture d'artisan, pas une couverture de mensuel. Ses accents français sont
dessinés, pas empruntés : le `é` de « énergie », le `è` d'« Inès », le `ê` de
« bien-être », le `ç` et le `à` tiennent leur graisse à 26 px comme à 72 px, et
l'accent ne se referme jamais sur la lettre — vérifié au rendu, pas supposé.
Elle n'a qu'une graisse et aucune italique : c'est une contrainte assumée, elle
force toute la hiérarchie à passer par la **taille**, ce qui est le sujet de cette
direction. `font-synthesis: none` interdit au navigateur d'en fabriquer un faux
gras ou une fausse oblique.

Point de méthode : **Fraunces était la fonte d'affichage des deux tours refusées**
(variantes A, B, D et la synthèse `final/`). Reprendre le caractère que le client
a déjà vu et rejeté aurait été une faute ; Young Serif est aussi chaleureuse et
n'a pas d'histoire ici.

**Archivo** est une grotesque américaine du XIX<sup>e</sup>, robuste, à grande
hauteur d'x, dessinée pour la signalétique et les formulaires imprimés. Elle tient
le contre-emploi de la page : pendant que l'antique porte la voix, elle porte
l'utilité — libellés, compteurs, adresses, boutons. Elle reste nette à 16 px sur
un écran de téléphone bon marché en plein soleil, ce qu'une seconde antique
n'aurait pas fait. Les deux caractères partagent une origine vernaculaire du
XIX<sup>e</sup> : ils vont ensemble sans se ressembler.

**Chargement vérifié** (mesure de largeur rendue, pas `document.fonts.check`) —
même chaîne à 40 px :

| | largeur rendue | témoin |
|---|---|---|
| Young Serif | **481,2 px** | Georgia 394,2 px · Times 394,2 px |
| Archivo 400 | **439,6 px** | Arial / Liberation Sans 442,5 px |
| Archivo 800 | **502,3 px** | (l'axe de graisse répond) |

---

## 3. L'échelle

Quarte juste, **rapport 1,333**, ancrée sur un corps de 17 px.

| pas | px | rem | interligne | emploi |
|---|---|---|---|---|
| `text-etiquette` | **16** | 1 | 1,25 · +0,14 em | sur-titres capitales, méta, compteurs |
| `text-corps` | **17** | 1,0625 | 1,6 | le corps, l'interface |
| `text-chapo` | **22** | 1,375 | 1,4 | chapô, accroche, citations d'avis |
| `text-besoin` | **26** | 1,625 | 1,15 | les dix besoins, les services |
| `text-nom` | **30** | 1,875 | 1,08 | titres de section, noms de la liste |
| `text-grand` | **40** | 2,5 | 1,0 | nom de la fiche, portrait en vedette, « 4,8 » |
| `text-enorme` | **54** | 3,375 | 0,94 | les nombres du quartier |
| `text-cri` | **72** | 4,5 | 0,90 | « Je cherche… » |

Rapports successifs : 17 → 22 (1,29) → 26 (1,18) → 30 (1,15) → 40 (1,33) →
54 (1,35) → 72 (1,33). Les trois pas centraux sont volontairement resserrés :
c'est la zone où l'œil compare des lignes voisines dans une liste, et un saut de
1,33 y aurait cassé le rythme.

**Amplitude : 72 / 17 = 4,24×** (4,50× rapporté au plancher de 16 px), soit
largement au-delà du 2,5× exigé — et sans commune mesure avec le 26/17/15 des
révisions refusées.

Deux pas suivent la largeur, pour ne jamais déborder :
`clamp(1,875rem, 15,5vw, 4,5rem)` pour « Je cherche… » (56 → 60 → 72 px de 360 à
1440) et `clamp(1,25rem, 10,5vw, 3,375rem)` pour « Camille Roussel »
(38 → 41 → 54 px). Les planchers en `rem` sont délibérément bas : ils ne mordent
jamais à taille normale, et ils empêchent les deux titres de gonfler hors de la
mesure quand le lecteur agrandit la taille du texte système. Aucun nom n'est
jamais tronqué, à aucune largeur.

**Rien ne descend sous 16 px** — ni les sur-titres, ni les compteurs, ni le lien
« Cette fiche n'est pas correcte ? ».

---

## 4. Les trois décisions de composition que j'aimerais qu'on remarque

**1. Le champ de recherche *est* le blanc de la phrase.** « Je cherche… » à
60 px, puis le champ juste dessous, puis — en petites capitales — « …ou
choisissez la fin : » et les dix fins toutes faites. On ne lit pas un titre suivi
d'un moteur suivi d'une grille de catégories : on lit une seule phrase, dont on
tape la fin ou dont on choisit la fin. Les dix formulations de besoin sont
reprises **verbatim** de la voix validée ; leur donner 26 px, c'est simplement les
traiter comme ce qu'elles sont — la vraie interface.

**2. Les dix besoins sont un index, pas des tuiles.** Numéro cadratin à gauche,
la phrase à 26 px, la catégorie formelle et le compte en 16 px dessous, un filet
d'un pixel entre deux lignes. Zéro carte, zéro fond, zéro ombre : la hiérarchie
seule sépare. Le survol n'allume pas une boîte — il allume **le numéro**
(`neutre-600` → `orange-800`) et pose un lavis `teal-50` sur toute la largeur.
La ligne 10, où personne n'est encore inscrit, est en `neutre-600` et le dit —
c'est le trait « honnête » de la marque, mis en typographie plutôt qu'en badge.

**3. Les nombres sont de la matière visuelle.** « **12** voisins. **10** métiers.
**1** quartier qu'on traverse à pied en dix minutes. » : les chiffres à 54 px dans
l'antique, la phrase à 22 px dans la grotesque, sur une seule ligne de sens. Même
geste sur la fiche : « **4,8** sur 5 · 12 avis du quartier », et les services
numérotés 01–03. C'est ce qui remplace la bande de couleur pleine que les deux
révisions refusées mettaient là — et qui était le défaut n° 4 du post-mortem.

**Bonus, parce que la profondeur ne devait pas passer à la trappe.** Une page
menée par le type glisse vers le plat : la profondeur est donc placée sur quatre
objets nommés, et nulle part ailleurs. Le champ de recherche (`ring-carte` +
`shadow-carte`, élévation 1) ; la barre d'appel collante en bas de la fiche
(`shadow-flottant`, élévation 2, dans la zone du pouce) ; les portraits
(`ring-4 ring-white` + `shadow-carte-hover`, ils flottent sur le lavis) ; le
panneau `--gradient-colly` où vit Colly. Plus le lavis `--gradient-aube` derrière
les deux en-têtes, dont l'arête basse tombe toujours sur un filet — jamais en
plein blanc — et le filet signature de 3 px sous l'en-tête blanc.

---

## 5. Rester utilisable dans l'urgence

C'est la vraie tension de cette direction, et voici comment elle est arbitrée.

- **Le champ de saisie est au-dessus de la ligne de flottaison**, à 390 × 844,
  avec les trois premiers besoins visibles dessous. Il filtre les dix lignes en
  direct, sans accent ni casse (« electricien » trouve « Réparer, construire,
  installer chez moi »), parce que chaque ligne porte les métiers et les noms des
  voisins concernés dans `data-k`.
- **Neuf secondes pour un électricien** : on tape « élec » — il reste une ligne ;
  ou on lit la ligne 02, qui est la deuxième de la page. Aucune des deux routes ne
  demande de connaître le mot « Artisanat & travaux ».
- **La grosse typographie n'est jamais la seule information.** Chaque besoin porte
  sa catégorie formelle et son compte en 16 px ; chaque voisin porte son métier,
  sa note et sa distance. L'affichage donne l'entrée, la grotesque donne les
  détails.
- **Zone du pouce** : sur la fiche, « Appeler » est une barre collante en bas
  (52 px de haut), avec les trois actions secondaires en pastilles de 50 px.
  Sur desktop, ces mêmes actions remontent à côté du portrait.
- **Mesuré, pas supposé** : à 360 px puis avec `html { font-size: 200% }`, un
  script parcourt chaque élément des deux pages et compte ceux qui dépassent la
  largeur du document. **Zéro débordement** dans les deux cas, à l'exception du
  lien d'évitement `sr-only`, hors écran par construction. Les corrections que
  cette mesure a imposées : planchers de `clamp()` abaissés, en-têtes
  `flex-wrap`, `min-w-0` sur les colonnes de texte des deux panneaux et
  `break-words` sur l'adresse du QR.
- Cibles ≥ 44 px sur **toutes** les commandes autonomes, y compris les quatre
  liens du pied de page (`inline-flex min-h-[44px]`). Les liens en pleine phrase
  (« 12 avis du quartier », « vous connaissez quelqu'un ? ») restent à la hauteur
  de leur ligne : ce sont des liens dans du texte courant, exemptés par la 2.5.8.
- `<label>` réels, ordre de titres `h1 → h2`, `alt` sur chaque portrait, focus
  `2px teal-600` avec décalage blanc, sans exception.

## 6. Contrastes (vérifiés avec `_shared/tools/palette.py`)

Toutes les paires réellement employées passent, la plupart en AAA :
corps `neutre-900`/blanc **15,62** · chapô `neutre-800`/blanc **11,64** ·
titres `teal-800`/blanc **10,96** · liens `teal-700`/blanc **7,46** ·
numéros `neutre-600`/blanc **4,89** (à 17 px) · sur le lavis :
`teal-800`/`teal-50` **10,41**, `neutre-800`/`orange-50` **10,88** ·
survol `orange-800`/`teal-50` **7,24** · CTA `teal-950`/`orange-500` **7,00** ·
puce `sauge-800`/`sauge-100` **8,66** · favori actif blanc/`teal-700` **7,46** ·
panneau Colly `neutre-800`/`sable-100` **10,38**.
Étoiles pleines `sable-700`/blanc **4,43** — graphique non textuel (seuil 3:1),
doublé d'un `aria-label` et du nombre « 4,8 » en clair.
Aucune utilité de la liste §10 (« remplissage seul ») n'apparaît : pas de
`text-accent`, pas de `text-secondary`, pas de `text-*-300/400/500`.

**Compte de l'orange** — accueil : le bouton de recherche, le filet de 3 px, le
numéro allumé au survol. Fiche : « Appeler », le filet. Rien d'autre n'est chaud ;
le favori actif est teal.

## 7. Ce qui est faible dans une approche menée par la typographie

Je le dis sans le maquiller, parce que deux directions rivales n'ont pas ce
problème.

1. **Le poids vertical.** Dix besoins à 26 px font ~1 100 px sur un téléphone, et
   trois lignes chacun à 360 px. Une grille de tuiles à deux colonnes en aurait
   montré six d'un coup. J'ai récupéré la moitié du terrain en passant à deux
   colonnes dès 1024 px, mais sur mobile la direction **coûte du défilement** —
   c'est le prix payé pour que la phrase soit lisible sans zoomer, et c'est un
   vrai prix.
2. **Une seule graisse d'affichage, donc peu de nuances.** Young Serif n'offre ni
   gras ni italique : impossible d'accentuer un mot *dans* un titre, impossible
   d'italiser une citation. Toute la variation passe par la taille et la couleur.
   La direction menée par la photographie peut moduler avec une image ; moi je ne
   peux que grossir ou rapetisser.
3. **La typographie ne vend pas une personne aussi bien qu'un visage.** Les
   portraits sont ici grands (88 à 176 px) et jamais rognés, mais ils restent
   *illustratifs* : sur cette page, ce qui frappe d'abord, c'est un mot. La
   direction menée par la photographie convertira probablement mieux sur la fiche,
   parce qu'un annuaire de voisins se vend par la confiance, et la confiance passe
   par les yeux de quelqu'un plus vite que par une belle antique.
4. **C'est la direction la plus fragile au contenu réel.** Elle repose sur des
   formulations courtes et bien écrites. Le jour où un métier s'appellera
   « Accompagnement à la parentalité et médiation familiale », le pas à 26 px
   fera quatre lignes et la page perdra son calme. Une carte l'aurait absorbé.
5. **Le portrait de la fiche est un rond, pas un plein cadre.** `brief.md` §4
   suggère la photographie en plein cadre pour une carte portrait. Ici le
   photographe, c'est le nom : « Camille Roussel » est l'objet le plus grand de
   l'écran, et une image à fond perdu lui aurait disputé cette place. C'est un
   arbitrage assumé de la direction, et le point 3 ci-dessus dit franchement
   qu'il se paie.
6. **Le risque « magazine » n'est jamais complètement neutralisé.** J'ai coupé les
   filets ornementaux, les colonnes justifiées et les lettrines, et gardé une
   grotesque signalétique pour tout ce qui est fonctionnel — mais une antique à
   72 px reste un signal éditorial, et une partie du public visé lit très peu
   d'éditorial.

---

### Détails techniques utiles à la relecture

- Les blocs `@theme` et `[data-theme="cartoucherie"]` sont copiés tels quels de
  `couleurs.md` §8 ; les valeurs des dégradés et filets en CSS simple sont
  **extraites de ce même bloc à la construction**. Raison précise, parce qu'elle
  n'est pas évidente : Tailwind 4 n'émet que les variables de thème qu'une
  utilitaire générée référence réellement. Aucune classe de ces pages n'utilisait
  `sauge-500`, `orange-50` ni `neutre-200` — ces variables n'existaient donc pas
  dans la feuille, le dégradé devenait invalide et se calculait en `none`.
  Injecter les valeurs à la construction règle le problème sans toucher au bloc
  de palette, et sans recourir à `@theme static` qui aurait tout émis.
- Les actions de contact de la fiche sont rendues depuis un objet `membre` en
  JavaScript : **un champ `null` ne produit aucun bouton**, jamais une action
  grisée. Camille possède les quatre ; Marc Ollivier n'aurait pas de bouton
  « site », Julien Marty n'aurait ni site ni Instagram.
- Le QR est un **motif de démonstration** déterministe tiré du slug, avec ses
  trois repères d'angle — ce n'est pas un code scannable, l'adresse encodée est
  écrite en clair juste en dessous.
- Colly apparaît deux fois : dans le panneau `--gradient-colly` de l'accueil
  (`colly-couleur.png`, 168 px), et dans l'**état vide** de la recherche
  (`colly-triste.png`), qui s'affiche quand aucun besoin ne correspond à ce qu'on
  tape.
- Icônes : un seul jeu SVG inline, trait 1,75 (2 pour le CTA), extrémités et
  jointures arrondies, `stroke="currentColor"`. Aucun emoji.
