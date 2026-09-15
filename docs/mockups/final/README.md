# Maquettes finales — Annuaire de la Cartoucherie

Date : 2026-09-06
Ouvrir `styleguide.html` d'abord, puis `index.html`. Tout est statique : un double-clic suffit,
aucun serveur, aucune installation.

## Les fichiers

| Fichier | Route du spec | Ce que c'est |
|---|---|---|
| `styleguide.html` | — | **La bibliothèque de blocs.** 22 blocs, chacun rendu à 390 px avec son code exact à côté. Source de vérité. |
| `index.html` | `/` | L'accueil : « Je cherche… », l'index numéroté, les portraits, la recherche vivante |
| `annuaire.html` | `/annuaire` et `/categorie/[slug]` | Les douze voisins, avec le filtre par catégorie (`?cat=…`) |
| `membre.html` | `/membre/[slug]` | La fiche de Camille Roussel — la page qui convertit |
| `carte.html` | `/carte` | La carte du quartier, plan schématique, sans bibliothèque cartographique |

Le code produit est composé **à partir des blocs**, pas réinventé page par page : le même bloc
rend le même HTML partout. Dans le styleguide, l'image et le code proviennent du même nœud DOM —
ils ne peuvent pas diverger.

## Comment on en est arrivé là

Trois rondes. Les deux premières ont été rejetées comme laides ; le diagnostic est que
**le brief imposait la retenue** et annulait la compétence de design. `_shared/brief.md`
(révision 3) s'ouvre sur ce post-mortem.

1. `../variant-*` — quatre hypothèses d'**UX** (recherche / portraits / besoins / proximité).
   Conclusions retenues dans `../COMPARAISON.md`, jamais remises en cause depuis.
2. `../brand/` — quatre planches de **marque**. Rejetées.
3. `../design/` — trois directions de **composition** sur une palette commune :
   `photo/`, `colly/`, `typo/`. Comparées dans `../design/COMPARAISON-DESIGN.md`.
   **`colly/` retenue**, augmentée de l'index numéroté de `typo/` et du halo de `photo/`.

La couleur a été traitée séparément et en amont : `../_shared/couleurs.md` + `couleurs.html`.

## Décisions acquises

Les trois designers de la ronde 3 y sont arrivés **indépendamment**. Ce ne sont donc plus des
opinions de designer mais des contraintes du problème :

- **Ne jamais agrandir un portrait au-delà de sa netteté.** Les sources font 128×128 et
  « un visage flou détruit exactement la confiance qu'on construit ». Plafond mesuré : ×1,37.
- **« Appeler » en barre orange collante** dans la zone du pouce, avec le vrai numéro dedans.
- **Le français s'accorde au `genre` du membre** — « Ce qu'**elle** propose », « Où **la** trouver ».
- **Les catégories portent leur compte réel**, et la catégorie vide est montrée, pas cachée.

## Pièges techniques vérifiés, à ne pas redécouvrir

- **`@theme static`, jamais `@theme`.** Tailwind 4 élague les variables de thème : avec
  `@theme` simple, tout CSS qui lit `var(--color-teal-950)` perd sa couleur **sans erreur** —
  dégradés, CTA, motif ventouse. Le symptôme est silencieux.
- **`@plugin "daisyui/theme"` ne fait rien** dans le build navigateur. Le thème daisyUI se
  déclare en variables CSS sur `[data-theme="cartoucherie"]`.
- **`document.fonts.check()` renvoie `false`** pour une police qu'aucun élément n'utilise :
  la police n'est alors jamais téléchargée. Vérifier par la largeur rendue contre la pile de repli.
- **Chrome headless plafonne `--window-size` à 500 px de large.** Tester le vrai 360 px dans
  une iframe.
- **`sable` + ventouses + halo ne s'empilent pas** : le halo multiplie sur le sable et le motif
  se noie. Le halo *remplace* le bandeau sable, il ne s'y ajoute pas.

## Ce qui n'est pas maquetté

Cinq routes du spec §9 n'ont pas de maquette, délibérément :

- `/a-propos`, `/confidentialite`, `/mentions-legales`, `/avis` — ce sont des pages de texte
  qui se composent des blocs existants sans aucune décision de design nouvelle. Surtout,
  **les mentions légales exigent des informations qu'on n'a pas** : nom et adresse de
  l'association, SIRET, directeur de publication, hébergeur. Écrire de fausses mentions légales
  serait pire que de ne rien écrire. Le pied de page pointe déjà vers les quatre.
- `/admin` — la file de modération, protégée par un rôle. Aucun visiteur ne la voit ; elle se
  conçoit au moment de l'implémentation.

## Limites connues des maquettes

- **Les portraits sont ceux de `randomuser.me`, en 128×128.** C'est le plafond de la ronde et
  ce qui bride le plus la direction photo. Les vrais portraits de Sandra lèvent la contrainte.
- **Les données sont fictives** (`_shared/members.json`), y compris les adresses et les avis.
- **Le plan de `carte.html` est schématique**, pas une projection : les positions sont
  indicatives, la page le dit, et il n'y a pas d'échelle. À remplacer par MapLibre + OSM.
- **`annuaire.html` fait 4 113 px** de haut : le plancher de 44 px sur les catégories-liens
  coûte ~55 px par rangée. À revoir avec la pagination, à 200 membres.
- **Le QR encode un domaine provisoire** (`annuaire.lacartoucherie.fr`), le nom n'étant pas déposé.
- **Colly reste à faire redessiner** par un illustrateur : une seule image couleur en basse
  définition existe, et chaque surface future (404, e-mail, flyer, autocollants) demande une pose
  nouvelle.

## La suite

Le spec (`../../superpowers/specs/2026-08-29-annuaire-cartoucherie-design.md`) est approuvé et
ces maquettes le couvrent. L'étape suivante est le **plan d'implémentation**, pas du code :
Astro + Cloudflare, et l'accès à D1 au moment du build reste le point le moins balisé (§14).
