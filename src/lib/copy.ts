// Every French string that is not member content (spec §3). Values are French,
// keys are English, and the gendered ones take the agreed word from agree().
export const COPY = {
  skipLink: "Aller au contenu",
  brandEyebrow: "Annuaire de",
  brandName: "la Cartoucherie",
  contactEmail: "contact@lacartoucherie.fr",

  homeTitle: "Je cherche…",
  homeIntro: "Les voisines et voisins qui habitent ou travaillent à la Cartoucherie.",
  homeCollySays: "Dites-lui ce qu'il vous faut.",
  homeOrPick: "…ou choisissez la fin :",
  homeNeighbours: "Vos voisins",
  homeBrowseOtherwise: "Parcourir autrement",
  discLegend:
    "Le portrait rond veut dire que la personne se déplace : il n'y a pas d'adresse où aller.",

  searchLabel: "Un métier, un prénom, un besoin",
  searchPlaceholder: "électricien, yoga…",
  searchSubmit: "Trouver",
  searchLocal: "Rien n'est envoyé à un serveur : le calcul reste sur votre téléphone.",
  searchEmpty: "Personne ne correspond à cette recherche.",
  searchSuggest: "Vous connaissez quelqu'un ?",
  searchReason: (reason: string) => `Correspond à ${reason}`,

  directoryAll: "Voir tout le quartier",
  categoryNobody: "Personne ne s'est encore inscrit·e dans cette catégorie.",
  countNobody: "personne encore inscrit·e",

  profileContact: (article: string) => `${article[0].toUpperCase()}${article.slice(1)} contacter`,
  profilePortrait: "Son portrait",
  profileOffers: (pronoun: string) => `Ce qu'${pronoun} propose`,
  profileWhere: (article: string) => `Où ${article} trouver`,
  profileOnMap: "Voir sur le plan du quartier",
  profileEmail: "Son adresse e-mail",
  profileSite: "Son site",
  profileInstagram: "Son Instagram",
  profileCall: "Appeler",
  profileWrong: "cette fiche n'est pas correcte",

  reviewsTitle: "Avis du quartier",
  reviewsNone: "Aucun avis pour l'instant.",
  reviewsHow: "Les avis sont signés par des voisins, relus par l'association, et jamais achetés.",
  reviewsPolicy: "Les avis, comment ça marche",

  qrTitle: "Le QR code de cette fiche",
  qrExplain: "À imprimer pour votre comptoir ou vos cartes de visite : il mène directement ici.",
  qrDownload: "Télécharger le QR code de cette fiche",

  mapTitle: "La carte du quartier",
  mapSchematic: "Plan schématique : les positions sont indicatives.",
  mapFromHall: "Classé depuis la Halle de la Cartoucherie",
  mapUseMyLocation: "Classer depuis ma position",
  mapTheyComeToYou: "Ils viennent chez vous",
  mapPickupOnly: "Adresse de retrait, pas de point sur la carte",

  footerAbout: "À propos",
  footerPrivacy: "Confidentialité",
  footerLegal: "Mentions légales",
  footerReviews: "Les avis, comment ça marche",

  // Additions beyond the task-3 brief dictionary, needed to keep SiteHeader.astro
  // and SiteFooter.astro free of hardcoded French (task-3-report.md documents each
  // as a deviation). Text is copied verbatim from docs/mockups/final/index.html
  // and docs/mockups/final/styleguide.html block 21, except where noted.
  headerHomeAria: "Annuaire de la Cartoucherie, accueil",
  headerJoin: "Je veux y figurer",
  // The mailto subject from index.html's "Je veux y figurer" link, decoded.
  headerJoinSubject: "Je veux figurer dans l'annuaire",
  footerBrand: "Annuaire de la Cartoucherie",
  footerBlurb:
    "Fait bénévolement pour l'association de quartier, à partir des portraits réunis par " +
    "Sandra Carole. Gratuit, sans publicité, sans compte à créer.",
  footerAddress: "Halle de la Cartoucherie · Tram T1, arrêt Cartoucherie · 31300 Toulouse",
  footerNavAria: "Liens de pied de page",
} as const;
