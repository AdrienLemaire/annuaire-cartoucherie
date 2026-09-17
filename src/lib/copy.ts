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
  homeOrPick: "…ou choisissez la fin :",
  homeNeighbours: "Vos voisins",
  homeSeeAllNeighbours: (voisins: string) => `Voir les ${voisins}`,
  homeBrowseOtherwise: "Parcourir autrement",
  homeBrowseIntro:
    "Le quartier se traverse en dix minutes : la carte est une entrée parmi d'autres, " +
    "pas le plan de l'annuaire.",
  homeBrowseListTitle: "La liste complète",
  homeBrowseListText: (count: number) => `Les ${count} fiches, filtrables par métier.`,
  // Distinct from mapTitle ("La carte du quartier", the /carte page's own H1) — this is
  // the "Parcourir autrement" card's own title, index.html's own different wording for
  // the same destination.
  homeBrowseMapCardTitle: "Le quartier sur une carte",
  homeBrowseMapText: (onMap: number, total: number) => `${onMap} fiches sur ${total} ont un point.`,
  homeOpen: "Ouvrir",
  // CollyPanel's own "salut" pose eyebrow (index.html:908, styleguide.html:1753,
  // "La mascotte du quartier") — not a caller prop: every mockup specimen of this
  // pose carries the same label, so it belongs to the component, not the page.
  collyMascotEyebrow: "La mascotte du quartier",
  homeCollyTitle: "Colly reste collée aux bons endroits.",
  homeCollyText:
    "Elle vit dans les poutres de la Halle et connaît tout le monde. Cet annuaire, c'est son " +
    "carnet d'adresses : uniquement des gens qui habitent ou travaillent ici, ajoutés un " +
    "par un par l'association.",
  discLegend:
    "Le portrait rond veut dire que la personne se déplace : il n'y a pas d'adresse où aller.",

  searchLabel: "Un métier, un prénom, un besoin",
  searchPlaceholder: "électricien, yoga…",
  searchSubmit: "Trouver",
  searchLocal: "Rien n'est envoyé à un serveur : le calcul reste sur votre téléphone.",
  searchEmpty: "Personne ne correspond à cette recherche.",
  searchSuggest: "Vous connaissez quelqu'un ?",
  // The mailto: subject when a visitor offers a name for an empty category
  // (NeedsIndex, task-6 brief) — one string, so the format lives here and
  // never in a component's frontmatter.
  searchSuggestSubject: (nom: string) => `Un voisin pour « ${nom} »`,
  searchReason: (reason: string) => `Correspond à ${reason}`,
  // SearchBar's colly-couleur.png alt (styleguide block "La barre de
  // recherche"): the only place that image renders, so one string is enough.
  searchCollyAlt: "Colly, la créature des Halles de la Cartoucherie, agrippée au bord de la barre de recherche",

  directoryAll: "Voir tout le quartier",
  // annuaire.html's own H1 ("L'annuaire") and filter nav (aria-label and the
  // label above the chip rail both read "Filtrer par métier"; the leading,
  // always-present chip reads "Tous les métiers").
  directoryTitle: "L'annuaire",
  directoryFilterLabel: "Filtrer par métier",
  directoryAllChip: "Tous les métiers",
  directoryMapLink: "Voir ces fiches sur la carte",
  // annuaire.html's own #compte-detail default, shown until a filter names
  // itself: "Tous les métiers, du plus fourni au plus rare."
  directoryDetailDefault: "Tous les métiers, du plus fourni au plus rare.",
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
  // The row's own call chip (annuaire.html:424) speaks the full name and
  // number in its aria-label rather than the button's own visible "Appeler",
  // so a screen-reader user picks the right row out of a list of identical
  // buttons.
  callAria: (nom: string, telDisplay: string) => `Appeler ${nom} au ${telDisplay}`,
  // The sr-only tail of a star rating (styleguide block 12: "4,8<sr-only> sur
  // 5,</sr-only> (12)") — one string, so MemberCard and MemberRow never fork it.
  ratingOutOf: "sur 5,",

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
  // The card's own no-address line, one member at a time: styleguide block 12
  // (line 1086, « accordé au genre ») renders "Elle vient chez vous" for a
  // woman, annuaire.html renders "Il vient chez vous" for a man — mapTheyComeToYou
  // above is the map legend's plural for the group, not this.
  comesToYou: (pronoun: string) => `${pronoun[0].toUpperCase()}${pronoun.slice(1)} vient chez vous`,
  // « Portrait de » elides to « Portrait d' » before a vowel or mute h — the
  // fixture already has Amandine and Inès (styleguide line 1090: "Portrait
  // d'Amandine Rey"; index.html:574 and annuaire.html:589 agree on "Portrait
  // d'Inès Lacombe" — carte.html:691's "Portrait de Inès Lacombe" is the
  // outlier and is wrong). `y` is deliberately excluded: it is a consonantal
  // /j/ glide in French given names (Yanis, Yohan, Yasmine), not a vowel —
  // index.html:413, annuaire.html:428 and carte.html:653 all agree on
  // "Portrait de Yanis Belhadj". One table, so MemberCard and MemberRow
  // never fork it.
  portraitAlt: (nom: string) => (/^[aeiouàâäéèêëïîôöùûüh]/i.test(nom) ? `Portrait d'${nom}` : `Portrait de ${nom}`),

  footerAbout: "À propos",
  footerPrivacy: "Confidentialité",
  footerLegal: "Mentions légales",
  footerReviews: "Les avis, comment ça marche",

  // Additions beyond the task-3 brief dictionary, needed to keep SiteHeader.astro
  // and SiteFooter.astro free of hardcoded French (task-3-report.md documents each
  // as a deviation). Text is copied verbatim from docs/mockups/final/index.html
  // and docs/mockups/final/styleguide.html block 21, except where noted.
  headerHomeAria: "Annuaire de la Cartoucherie, accueil",
  // SiteHeader's secondary link, parametrized (task-3-report.md fix report): the label
  // when it goes back to "/" (docs/mockups/final/annuaire.html) and the label plus
  // screen-reader suffix when it goes back to the directory
  // (docs/mockups/final/membre.html, carte.html).
  headerBackHome: "Accueil",
  headerBackDirectory: "Annuaire",
  headerBackDirectorySr: "— retour à la liste des voisins",
  // The home page's own "Je veux y figurer" header link (task-7-brief.md carried item
  // 2): re-added after task-3's fix report deleted it as unread — SiteHeader.astro's
  // "join" variant is now the reader. The mailto subject is index.html's own
  // "Je%20veux%20figurer%20dans%20l'annuaire", decoded.
  headerJoin: "Je veux y figurer",
  headerJoinSubject: "Je veux figurer dans l'annuaire",
  footerBrand: "Annuaire de la Cartoucherie",
  footerBlurb:
    "Fait bénévolement pour l'association de quartier, à partir des portraits réunis par " +
    "Sandra Carole. Gratuit, sans publicité, sans compte à créer.",
  footerAddress: "Halle de la Cartoucherie · Tram T1, arrêt Cartoucherie · 31300 Toulouse",
  footerNavAria: "Liens de pied de page",
} as const;
