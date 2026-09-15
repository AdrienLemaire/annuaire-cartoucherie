# Comparaison des trois directions de design

Date: 2026-09-06
Écrans : `photo/`, `colly/`, `typo/` — chacun `index.html` + `membre.html`.
Montages : `comparaison-accueil.png`, `comparaison-membre.png`.
Palette commune, non négociée : `../_shared/couleurs.md`.

## Où on en est

Les révisions 1 et 2 (huit artefacts) ont été rejetées comme laides. Le diagnostic était que
**le brief était le défaut** : il imposait la retenue de huit manières différentes et
annulait explicitement la compétence `frontend-design`. La révision 3 a supprimé ces
contraintes, réglé la couleur en amont, et laissé la composition aux designers.

Les trois directions ci-dessous partagent donc exactement la même palette et la même voix.
**Elles ne diffèrent que par la composition** — ce qui était précisément le problème de la
révision 2, où quatre variantes ne différaient que par la teinte.

## Ce que chaque direction a trouvé

### Photo — « les gens sont le produit »

**L'idée forte, et personne d'autre ne peut la copier :** le halo derrière chaque en-tête
est *le portrait du membre lui-même*, agrandi, flouté à 54 px et multiplié sur un dégradé.
Chaque fiche hérite donc de l'ambiance colorée de la personne qu'elle décrit — sans aucun
asset supplémentaire, sans lecture de pixels côté serveur.

Deuxième trouvaille : **la forme suit la donnée.** Les membres avec adresse ont un
rectangle plein cadre ; ceux sans adresse (`surCarte: false`) un disque de 124 px sur
sable. Le rythme de la grille se casse pour une raison lisible, pas par caprice.

Fraunces sur quatre axes (`SOFT 45–50`, `WONK 1`) donne l'autorité d'un magazine sans sa
froideur. « Sophrologue » en italique sous le nom est le plus beau détail des trois fiches.

**Sa faiblesse, qu'elle a elle-même mesurée :** les portraits de `randomuser.me` plafonnent
à 128×128. Les grands tirages sont des agrandissements ×2,3, visiblement mous, et pires sur
un écran ×3. Le designer en a fait une intention — grain, marie-louise blanche, registre
imprimé — et s'est interdit toute photo au-delà de 290 px, ce qui **interdit le plein cadre
que la direction réclamait**. Les vrais portraits de Sandra effacent le problème ; en
attendant, c'est la direction la plus pénalisée par les données de test.

Faiblesse plus profonde : **la photo ne dit pas ce que les gens font.** Douze visages
souriants ne distinguent pas un électricien d'un comptable, sur un annuaire dont la question
est « qui fait X ».

### Colly — « la mascotte est l'hôte, pas un autocollant »

**L'idée forte : un seul motif tient tout.** La ventouse — trois cercles concentriques —
devient le symbole, la puce de liste, le médaillon d'icône et le papier peint du bandeau
sable. C'est un système, pas une décoration, et c'est la seule des trois directions qui
produit une identité qu'aucun annuaire concurrent ne peut reprendre.

Colly se hisse sur le rebord de la barre de recherche avec un « Dites-lui ce qu'il vous
faut » et une flèche tracée à la main. Sous la ligne de flottaison, les deux pages
redeviennent un annuaire professionnel ordinaire : le charme est une porte d'entrée, pas
le bâtiment.

**La meilleure fiche membre des trois.** « La contacter » affiche l'e-mail, le site et
l'Instagram *en toutes lettres* — on peut les lire sans taper. Les deux autres cachent ces
informations derrière des icônes. Sur un annuaire, c'est la bonne décision.

Deux points de métier : la direction a **rejeté Nunito**, pourtant suggérée par `brand.md`,
au motif qu'un géométrique rond plus une mascotte donne une application pour enfants — et a
pris Fraunces avec l'axe `WONK` épinglé à 0. Et n'ayant qu'une seule image en couleur, elle
multiplie les trois croquis au crayon en niveaux de gris dans un disque : le papier devient
blanc et disparaît, il ne reste que le graphite.

**Sa faiblesse n'est pas graphique : les droits sur Colly ne sont pas acquis.** Si
l'association ne peut pas utiliser ces images, cette direction perd sa prémisse du jour au
lendemain quand les deux autres ne perdent rien. À quoi s'ajoute qu'une mascotte plafonne la
sériosité perçue — et l'objection viendra des **membres**, pas des visiteurs : un
expert-comptable peut légitimement ne pas vouloir d'une créature pour présenter son métier.

### Typo — « Je cherche… est une phrase »

**L'idée forte, et la plus originale des trois :** le champ de recherche est le blanc à
remplir dans la phrase, et les dix besoins en dessous sont dix fins de phrase toutes prêtes,
posées en index numéroté 01–10. Pas de cartes, pas de boîtes : des filets et de la
hiérarchie. Le bloc « **12** voisins. **10** métiers. **1** quartier qu'on traverse à pied en
dix minutes » traite les nombres comme de la matière visuelle — c'est ce qui remplace le
bandeau de couleur qui plombait les rondes précédentes.

Young Serif, délibérément **pas Fraunces** — la police d'affichage des deux rondes rejetées.
Gamme en quarte juste sur 17 px : 16/17/22/26/30/40/54/72, soit **4,24× d'amplitude** contre
les 26/17/15 timides de la révision 2.

C'est aussi la direction la plus rigoureuse à la vérification : un script a parcouru chaque
élément à 360 px puis sous `html{font-size:200%}` — **zéro débordement** sur les deux pages.

**Sa faiblesse :** le coût vertical. Dix besoins à 26 px font ~1 100 px sur un téléphone et
passent à trois lignes à 360 px, là où une grille de tuiles en aurait montré six d'un coup.
Une seule graisse d'affichage, donc aucune emphase *à l'intérieur* d'un titre. Et c'est la
direction la plus fragile au vrai contenu : un métier appelé « Accompagnement à la
parentalité et médiation familiale » fait quatre lignes à 26 px, ce qu'une carte aurait
absorbé.

## Ce qui s'est confirmé tout seul

Les trois designers, sans se parler, ont tous les trois :

- buté sur la résolution des portraits (128×128) et **refusé d'agrandir** plutôt que de
  livrer un visage flou — « un visage flou détruit exactement la confiance qu'on construit »
- mis « Appeler » en barre collante orange dans la zone du pouce sur mobile
- accordé le français au genre du membre (« Ce qu'**elle** propose », « Où **la** trouver »,
  « VOISINE depuis 2022 », « 1 voisin**e** »)
- placé le compte réel à côté de chaque catégorie, et traité honnêtement la catégorie vide

Quand trois directions indépendantes convergent, ce n'est plus une opinion de designer :
ce sont des contraintes du problème. Ces quatre décisions sont acquises.

## Recommandation

**Colly comme base, avec l'index numéroté de Typo et le halo de Photo.**

Le raisonnement :

1. **Colly a le seul vrai système.** La ventouse produit un symbole, une puce, un médaillon
   et une texture à partir d'une seule forme. Les deux autres ont une belle page ; celle-ci
   a une identité reproductible sur des surfaces qui n'existent pas encore — le flyer, le
   404, l'e-mail, l'autocollant.
2. **Colly a la meilleure fiche membre**, qui est la page qui convertit : coordonnées
   lisibles sans taper.
3. **L'index numéroté de Typo bat la grille de tuiles** sur le fond : il répond à « je ne
   connais pas le mot » mieux que n'importe quelle carte, et il est plus court à parcourir
   qu'une liste de vignettes. À reprendre en le compactant — c'est sa faiblesse avouée.
4. **Le halo de Photo est gratuit et unique** : aucun asset, aucune dépendance, et il donne
   à chaque fiche une couleur propre.

**Le risque à lever avant de s'engager :** les droits sur Colly. Si la réponse est non, la
recommandation bascule sur **Photo**, qui est la direction la plus chaleureuse des deux
restantes — et il faudra alors les vrais portraits de Sandra, sans quoi elle reste bridée
par le 128×128.
