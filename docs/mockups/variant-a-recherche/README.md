# Variant A — « la recherche d'abord »

## Hypothèse

Le visiteur qui scanne le QR code sait déjà ce qu'il cherche : « il me faut un électricien ». La barre de recherche occupe donc le haut de l'écran sur les quatre pages et reste visible en permanence dans l'en-tête, jamais cachée derrière une icône. Tout le reste — catégories, carte, tri — n'est qu'un filet de sécurité pour qui n'a pas d'idée précise, jamais le chemin principal.

## Thème daisyUI : `autumn`

`autumn` a été choisi pour son primaire brique/terracotta profond (proche des tons de brique toulousaine, en écho au nom même du quartier — une ancienne cartoucherie industrielle) et son secondaire corail chaud. Contrairement aux thèmes qu'on associe trop vite au « chaleureux » (`caramellatte`, `garden`), `autumn` garde des surfaces neutres — `base-100/200/300` sont ici de gris purs, sans teinte — et réserve toute la couleur aux éléments qui comptent : boutons d'appel, badges de catégorie, puces de recherche. C'est exactement le vocabulaire dont une hypothèse « recherche d'abord » a besoin : la couleur guide l'œil vers l'action, elle ne décore pas la page.

## Direction esthétique

Éditorial et artisanal plutôt que « app SaaS » : titres en **Fraunces** (serif variable, empattements francs, aussi lisible dans un gros titre que dans un badge), corps de texte en sans-serif système pour rester net à 200 % de zoom. Fond `base-200` en toile de fond, cartes et listes en `base-100` pour créer une légère profondeur sans ombres lourdes. La carte du quartier est un décor abstrait (pâtés de rues, ligne de tram en pointillés, repères nommés) plutôt qu'un fond de carte réaliste — cohérent avec la contrainte « pas de librairie de carte » et avec le ton associatif du site.

## Ce que je veux que le relecteur remarque

1. **La recherche ne s'arrête jamais à une page.** Le champ de l'en-tête (`annuaire.html`, `membre.html`, `carte.html`) partage la même logique de correspondance (nom, métier, description, services, catégorie — insensible aux accents) que la recherche héro de `index.html`. Taper « yoga » sur la carte grise réellement les épingles qui ne correspondent pas et reconstruit la liste compagnon en dessous, sans recharger la page.
2. **Le bouton d'appel est délibérément sorti de la fiche.** Sur `index.html` et `annuaire.html`, chaque résultat porte son propre bouton 📞 direct — l'utilisateur peut appeler sans jamais ouvrir la fiche complète. Sur `membre.html`, l'action d'appel est dans une barre collante en bas d'écran (avec le cœur favori juste à côté), donc atteignable au pouce quel que soit le point de défilement. C'est le pari concret derrière « taps from landing to a member's phone number ».
3. **L'état zéro-résultat est traité comme une vraie surface, pas une excuse.** Sur `index.html` et `annuaire.html`, « Aucun résultat pour *X* » propose systématiquement les catégories à parcourir à la place et un lien `mailto:` pour suggérer le professionnel manquant à Sandra — jamais un simple message d'échec.
4. **Le « correspond à : » sous chaque résultat** explique pourquoi une fiche est remontée (nom / métier / description / services / catégorie), ce qui construit la confiance dans la pertinence de la recherche au lieu de la laisser deviner.

## Faiblesses assumées de l'hypothèse « recherche d'abord »

- **Elle suppose un vocabulaire correct.** Quelqu'un qui tape « fuite d'eau » ne trouvera pas Julien Marty (électricien, pas plombier) : la recherche par mot-clé ne fait pas d'inférence sémantique. Les puces de recherches fréquentes et le repli par catégorie atténuent le problème mais ne le résolvent pas.
- **Elle est moins bonne pour la flânerie.** Un résident qui veut juste « voir qui existe dans le quartier » doit activement choisir l'échappatoire « ou parcourir » — la page d'accueil ne met jamais en avant les 12 profils par défaut, contrairement à une hypothèse `annuaire d'abord`.
- **Le clavier mobile mange l'écran.** Sur les petits écrans, dès que le champ héro est focus, le clavier virtuel peut cacher la moitié des puces de suggestion et les premiers résultats — un test réel sur appareil serait nécessaire pour caler la hauteur du premier écran.
- **La double logique de recherche (en-tête compact + héro plein écran) crée deux composants à maintenir** plutôt qu'un seul — un choix délibéré pour éviter la redondance visuelle sur `index.html`, mais qui complique un peu la cohérence de code entre les pages.
