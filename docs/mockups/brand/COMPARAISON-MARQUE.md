# Comparaison des trois planches de marque

Date: 2026-09-05
Boards: `voisinage.html` · `terre-rose.html` · `service.html` (open them in a browser).
Side-by-side of the three 390px application fragments: `comparaison-fragments.png`.

All three are a genuine step up from revision 1: real portraits, inline SVG icon sets,
custom daisyUI themes declared as CSS variables, and contrast ratios computed rather than
eyeballed. The question is no longer "is this ugly" but "which identity is right".

## Ce qui se voit sur le fragment 390 px

| | Voisinage | Service | Terre rose |
|---|---|---|---|
| Membres visibles à l'écran | **2 + un bouton** | 2 | 1 |
| Action d'appel | pastille ambre, 44px | bouton pleine largeur | bouton pleine largeur |
| Hauteur par membre | **~95 px** | ~170 px | ~300 px |
| Contraste de la paire primaire | 9,12:1 (AAA) | **9,10:1 (AAA, et tout le reste ≥7:1)** | 5,39:1 (AA) |
| Ancrage local | aucun | aucun | **fort (brique toulousaine)** |
| Personnalité typographique | moyenne | faible | **forte** |

Density is not a detail here. The product exists so that someone standing in a shop can
find a person and call them. Voisinage fits two members *and* a "see everything" action in
the space Terre rose spends on one.

## Voisinage — « la confiance par le calme et l'espace »

Vert bouteille `oklch(38% 0.075 152)` · Manrope + Public Sans · anneau ouvert avec un point
ambre (« la lumière du perron laissée allumée »).

**Le plus fort :** la densité et l'affordance d'appel. La pastille ambre est la seule
couleur chaude de l'écran, donc l'œil va droit à l'action d'appeler, et elle coûte 95 px
par membre au lieu de 170 ou 300. C'est la direction qui rend le produit le plus rapide.

**Le meilleur mot de tout l'exercice :** « voisins » au lieu de « membres ».
« 4 voisins peuvent vous aider » dit le positionnement en une ligne — un annuaire dont les
inscrits sont des voisins, pas des fiches. Ce mot est récupérable quelle que soit la
direction retenue, et il devrait l'être.

**Sa faiblesse :** aucun ancrage local. Le vert doit porter seul toute la reconnaissance,
alors que la brique la donnerait gratuitement. Et à 38 % de luminosité, le vert est presque
noir en petit — il gagnerait quelques points de clarté.

## Service — « l'utilitaire, le contraste, la lisibilité »

Bleu `oklch(40% 0.115 263)` · orange d'action `oklch(72% 0.16 63)` · Be Vietnam Pro +
Source Sans 3 · silhouette de trois maisons.

**Le plus fort :** la lisibilité, mesurée et gagnée. Les neuf paires `-content` passent AAA
(7:1), pas seulement AA. Pour une résidente de 70 ans, en plein soleil, sur un téléphone —
c'est-à-dire exactement la scène décrite par le spec — c'est la direction la plus sûre.
Elle a aussi rattrapé en cours de route un bleu acier pâle sur pâle qu'elle allait livrer.

**Sa faiblesse, qu'elle a elle-même identifiée :** `brand.md` classe *accueillante* avant
*claire*, et cette direction est structurellement la plus froide. La chaleur n'existe que
dans l'orange, et l'orange n'apparaît qu'au moment du clic. Un écran sans action — une bio,
une fiche en lecture — n'a plus rien qui dise « un voisin » plutôt qu'« un résultat ».
C'est aussi la plus conventionnelle : compétente, mais déjà vue.

## Terre rose — « Toulouse, sans ambiguïté »

Terracotta `oklch(53% 0.145 39)` · vert-bleu sourd · Bricolage Grotesque + Instrument Sans ·
trois arches (la nef et les bas-côtés de la Halle).

**Le plus fort :** c'est la seule des trois qui ressemble à un endroit. La brique est le
matériau dont le quartier est fait, et Bricolage Grotesque donne au nom une vraie
personnalité là où les deux autres restent neutres. En tant qu'objet, c'est la plus belle
planche.

**Ses deux faiblesses sont réelles :**
1. **La densité.** Un seul membre à l'écran. La carte-portrait dépense son espace en
   avatar circulaire, note, bio et deux boutons — dont un désactivé (« Prise de
   rendez-vous — bientôt ») qui occupe une place de choix pour annoncer une absence.
2. **Le contraste.** 5,39:1 sur la paire primaire : AA, pas AAA, quand Service obtient 9:1
   sans effort. Un fond crème chaud coûte du contraste perçu en plein soleil — précisément
   pour la personne que le produit vise. L'agent l'a payé sciemment, mais c'est payé.

Elle a en revanche fait le travail le plus rigoureux sur les collisions de couleur :
terracotta contre rouge d'erreur séparés par la chroma et non par la teinte, et un premier
accent laiton écarté parce qu'il se confondait avec `warning`.

## Recommandation

**Voisinage**, avec deux corrections et un emprunt.

Le raisonnement : le critère qui décide ce produit est le nombre de personnes qu'on voit et
la vitesse à laquelle on en appelle une. Voisinage gagne ce critère nettement, tout en
restant en AAA sur ses paires principales, et c'est la plus proche de Nextdoor — la
référence citée. Service gagne la lisibilité mais perd la chaleur qui est le premier trait
de la marque ; Terre rose gagne l'identité mais perd la densité, qui est la raison d'être
du produit.

Corrections à appliquer si Voisinage est retenu :
1. **Éclaircir le vert** de quelques points (38 % → ~44–46 %) pour qu'il cesse de lire comme
   du noir en petit format, en revérifiant le ratio.
2. **Reprendre la rigueur de Terre rose sur les collisions** : vérifier que le vert primaire
   et le vert `success` ne se confondent pas, comme terracotta et erreur ont dû l'être.

Emprunt, quelle que soit la direction retenue : **« voisins » remplace « membres »** partout.

Si la priorité est l'identité toulousaine plutôt que la vitesse, Terre rose est le bon choix
— mais il faut alors lui imposer la densité de Voisinage, c'est-à-dire refaire sa
carte-portrait en ligne compacte de 95 px.
