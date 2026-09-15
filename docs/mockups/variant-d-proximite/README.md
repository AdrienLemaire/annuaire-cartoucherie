# Variant D — « la proximité d'abord »

## Hypothèse

Quelqu'un qui scanne ce QR code est physiquement debout dans le quartier, probablement
devant la Halle ou dans une boutique voisine — la distance jusqu'à chaque membre est
donc le fait le plus utile qu'on puisse afficher, plus utile qu'une catégorie qu'il
faudrait d'abord choisir. Cette maquette met la distance en typographie et en position
avant tout le reste, sur les quatre pages, avec la marche à pied comme unité seconde
(« 60 m · 1 min »). Le classement par défaut ne dépend d'aucune permission : il part
de la Halle, le repère central déjà présent dans les données, ce qui rend la promesse
« proximité d'abord » vraie même avant que le visiteur ait dit oui à quoi que ce soit.

## Thème daisyUI : `retro`

`retro` a été choisi contre `forest`, `caramellatte` et `nord`, testés côte à côte en
capture d'écran. `forest` est un thème sombre : lisible, mais il lit comme un dashboard
« dark mode » générique et mal adapté à un usage en plein jour, dans une rue, par une
personne âgée. `nord` est froid et bleu-gris — l'inverse de la chaleur associative
demandée par le brief. `retro` donne un kaki/sable en fond avec un rose saumon en
accent : exactement la palette d'une carte routière ou d'un plan touristique
vieillissant, ce qui sert directement l'hypothèse « la carte est la métaphore » tout en
restant chaud et familier, pas corporate.

## Direction esthétique

Le quartier vu comme une carte qu'on tient à la main : fond kaki façon papier, épingles
rose saumon en relief (cercle + pointe pivotée à 45°, sans bibliothèque), routes en
bandes claires, arrêt de tram et Halle en repères dessinés directement sur le sol. Les
distances sont en `DM Mono` — un chiffre qui a l'air mesuré, presque un readout GPS — et
les titres en `Fraunces`, un serif à l'empattement généreux qui donne de la chaleur
humaine à un objet par ailleurs très numérique (deux polices Google Fonts chargées en
un seul lien, comme l'autorise le brief). Aucune icône vectorielle : uniquement des
emoji, cohérents avec le reste des données du projet (`members.json` en contient déjà).

## Décisions d'interaction à noter

1. **Le classement par défaut ne demande jamais la permission au chargement.** La
   géolocalisation n'est appelée que sur un clic explicite (« Activer ma position »).
   Avant ce clic — donc sur toute première visite — la liste est déjà triée, mais
   depuis la Halle plutôt que depuis l'utilisateur, avec ce choix explicité en toutes
   lettres. Le refus de la géolocalisation n'est donc jamais un cul-de-sac : c'est
   l'état par défaut, assumé, pas une erreur à rattraper.
2. **`carte.html` relie chaque épingle à sa ligne de la feuille du bas et vice-versa,
   sans une ligne de JavaScript**, via `:target` : chaque épingle est un lien vers
   `#sheet-<slug>`, chaque ligne un lien vers `#pin-<slug>`. Taper une ligne fait
   grossir l'épingle correspondante (anneau + zoom) ; `membre.html` pointe directement
   vers `carte.html#pin-camille-roussel`, donc arriver depuis une fiche affiche la carte
   avec l'épingle déjà mise en évidence.
3. **Les membres à « distance : — » ont leur propre bloc, jamais un rang dans un tri
   numérique.** Julien Marty et Amandine Rey se déplacent chez le client ; leur case
   distance porte un badge « 🚗 chez vous » plutôt qu'un tiret discret. Nadia Berrada est
   un troisième cas, plus subtil : elle a une distance connue (210 m) mais aucune
   épingle sur la carte (adresse privée) — elle reste triable, juste pas cartographiable,
   et la carte l'explique dans sa propre section plutôt que de la faire disparaître.

## Faiblesses à peser

- **La distance discrimine faiblement ici.** Sur 12 membres tous compris dans un rayon
  de 800 m, presque tout le monde est « à deux pas » à l'échelle d'un quartier — le tri
  par distance change peu l'ordre réellement pertinent pour quelqu'un qui cherche
  « un.e sophrologue », par exemple. Le besoin numéro un du brief (« j'ai besoin de
  quelqu'un qui fait X ») reste une question de catégorie, pas de distance ; cette
  maquette la relègue délibérément au second plan pour tester l'hypothèse à fond, mais
  un vrai v1 voudrait probablement les deux affichés ensemble, pas l'un contre l'autre.
- **Demander la localisation avant d'avoir montré de valeur est un facteur de refus
  connu.** Le classement par défaut « depuis la Halle » atténue ça (il y a toujours un
  contenu utile avant tout clic), mais je ne peux pas prouver ici que les visiteurs
  comprendront la nuance entre « classé depuis la Halle » et « classé depuis moi » —
  seul un vrai test utilisateur le dirait.
- **Aucune coordonnée lat/lng réelle n'existe dans `members.json`** : les distances sont
  des chaînes déjà fournies, et les positions des épingles sur `carte.html` sont placées
  à la main pour être plausibles, pas calculées. Le modèle de données du spec (§6)
  prévoit bien `lat`/`lng` et MapLibre pour la vraie version — le calcul de distance
  décrit ici (à vol d'oiseau, temps de marche) devient trivial une fois ces champs
  peuplés ; rien dans cette maquette ne s'y oppose.
