# Variant C — « Le besoin d'abord »

## Hypothèse

Une personne qui scanne le QR code d'un commerçant sait rarement qu'elle cherche une
« sophrologue » ou un « menuisier-ébéniste » — elle sait qu'elle ne dort plus, ou qu'un
meuble ne rentre pas dans son couloir. Une barre de recherche est une page blanche qui
punit l'ignorance du vocabulaire, alors cette variante met en avant une grille de 10
besoins nommés en langage courant, chacun affichant son nombre de membres pour que
parcourir paraisse fini et sans risque. Les catégories ne sont pas qu'une page d'accueil :
elles sont la navigation principale du site entier, présente et actionnable sur les
quatre pages, y compris comme routes cliquables depuis les fiches membres elles-mêmes.

## Thème daisyUI : `autumn`

Choisi après comparaison visuelle de six thèmes candidats (`autumn`, `caramellatte`,
`lemonade`, `winter`, `emerald`, `silk`) rendus côte à côte. `autumn` donne le meilleur
contraste texte/fond de tous (bordeaux profond sur fond crème, jamais de gris moyen sur
gris moyen), ce qui compte plus ici qu'ailleurs puisque cette variante porte la promesse
de service aux résidents âgés. Le bordeaux/terracotta évoque aussi, sans le forcer, la
brique rose de Toulouse — une chaleur locale plutôt qu'un bleu corporate ou un pastel
délavé. `winter` était le concurrent le plus sérieux pour la lisibilité pure, mais son
bleu-violet est froid et ne sert pas le registre chaleureux et associatif du brief.

## Direction esthétique

Chaleureuse, dense d'information mais jamais austère : grandes tuiles à bords francs,
émojis comme seule iconographie (pas de librairie d'icônes), la police d'affichage
**Baloo 2** (ronde, amicale, très lisible même agrandie) pour tous les titres et labels
de catégorie, et la police système pour le corps de texte — parce que la lisibilité à
200 % de zoom prime sur la personnalité typographique pour du texte long. Les tuiles de
la page d'accueil sont volontairement grandes (min. 10 rem de haut) et espacées plutôt que
denses : la variante assume qu'on fait défiler un peu plus, en échange de cibles qu'on
ne peut pas manquer.

## Décisions d'interaction à remarquer

1. **Les catégories sont partout la même route.** Un tiroir (`drawer`) listant les 10
   catégories avec leur effectif est accessible en un tap depuis n'importe quelle page.
   Sur `annuaire.html`, les badges de catégorie *sur chaque carte membre* sont cliquables
   et rebranchent le filtre en direct (`selectCategory()`) — y compris depuis la fiche
   d'un membre qui a deux catégories : le badge secondaire n'est pas décoratif, c'est une
   sortie de secours vers l'autre besoin qu'il couvre. Thomas Vidal et Inès Lacombe (Santé
   & bien-être + Sport & mouvement) rendent ça visible sans avoir à l'expliquer.
2. **La recherche est volontairement sous un `<details>` fermé sur l'accueil.** Le clic
   pour l'ouvrir (« Vous connaissez déjà le nom ou le métier ? ») est le seul prix à
   payer pour l'utilisateur qui, lui, connaît déjà le mot — sans jamais faire concurrence
   visuelle aux tuiles de besoin, qui gardent 100 % de l'attention au premier écran.
3. **L'état à zéro membre est un vrai écran, pas un lien caché.** « Enfance & éducation »
   n'a aucun membre dans les données fixture — je l'ai laissée dans la grille (dernière
   tuile, bordure en tirets, badge « bientôt ») plutôt que la retirer silencieusement.
   La cliquer mène à un état vide honnête avec un CTA « Suggérer un membre » en mailto.
   Ce n'était pas demandé explicitement par le brief mais c'est un état réel dans un
   annuaire à 12 (bientôt 200) membres, et le cacher aurait été mentir sur la couverture
   du quartier.

## Ce qui reste fragile dans l'hypothèse (pour le comparateur)

- Les 10 formulations en « besoin » (ex. « Un coup de main chez moi » pour Services à
  domicile) sont **mon** pari sur le vocabulaire du visiteur, pas le sien vérifié. Si le
  pari est mauvais sur une catégorie, le problème de vocabulaire n'est pas résolu, il est
  juste déplacé d'un cran.
- Un besoin qui ne correspond à aucune des 10 cases (garde d'enfants ponctuelle, par
  exemple) est une impasse plus sèche qu'une recherche libre ne l'aurait été — la
  recherche existe mais elle est sciemment en retrait.
- 10 tuiles en 2 colonnes, c'est ~5 écrans de défilement avant la 10ᵉ sur un petit
  téléphone ; les 4 premières (les plus fréquentées, en théorie) sont au-dessus de la
  ligne de flottaison à 390×844, les 6 suivantes ne le sont pas.
- Les effectifs affichés sont un instantané figé dans le HTML : à 200 membres et des
  mises à jour fréquentes, ce nombre se périme visiblement plus vite qu'un simple lien
  « voir tout ».
- Les badges de catégorie cliquables *à l'intérieur* des cartes membres (annuaire) et
  des chips de la carte font ~36-40px de haut, sous la barre des 44px que cette variante
  défend partout ailleurs. Le compromis assumé : ce sont des routes secondaires vers une
  autre catégorie, pas l'action principale de la carte (qui reste le bouton « → » ou
  l'appel, eux à 44px+) — mais c'est cette variante-ci qui prétend le plus fort à la
  lisibilité, donc c'est elle qui devrait le moins se permettre l'exception.
- Le bouton « Télécharger le QR code » pointe vers une image `api.qrserver.com`
  cross-origin : dans un navigateur réel, `download` ne forcera pas toujours le
  téléchargement (certains navigateurs ouvrent l'image dans un nouvel onglet à la place).
  C'est une limite du placeholder, pas de cette variante en particulier — elle touche
  vraisemblablement les quatre.

## Reformulations proposées pour les 10 catégories (registre « je cherche… »)

| Catégorie officielle | Formulation besoin retenue |
|---|---|
| Santé & bien-être | Retrouver l'équilibre : stress, sommeil, énergie |
| Beauté & soins | Prendre soin de moi : coiffure, soins |
| Artisanat & travaux | Réparer, construire, installer chez moi |
| Alimentation & traiteur | Manger bon sans cuisiner ce soir |
| Conseil & entreprise | Monter ou faire tourner mon activité |
| Numérique & création | Un site, un logo, une image de moi |
| Enfance & éducation | S'occuper des enfants, apprendre |
| Sport & mouvement | Bouger, me remettre en forme |
| Art & culture | Un souvenir en photo, une envie de créer |
| Services à domicile | Un coup de main chez moi |
