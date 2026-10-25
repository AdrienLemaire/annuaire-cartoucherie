// Every French string that is not member content (spec §3). Values are French,
// keys are English, and the gendered ones take the agreed word from agree().

// « La contacter », « La voir sur la carte » — three COPY entries capitalise
// an agreed article/pronoun at the head of a sentence. One helper, so a
// fourth never forks the same one-liner.
function capitalize(s: string): string {
  return `${s[0].toUpperCase()}${s.slice(1)}`;
}

// « de » elides to « d' » before a vowel or mute h — caught in review three
// times now: portraitAlt's own regex (Inès Lacombe rendered "Portrait de
// Inès" until fixed; styleguide line 1090 and index.html:574 confirm
// "Portrait d'Inès"/"d'Amandine"), corrected a second time when it wrongly
// elided before a consonantal y (Yanis Belhadj stays "de Yanis" —
// index.html:413, annuaire.html:428, carte.html:653 all agree), and a third
// time when profileWrongSubject and the QR card's alt text each grew their
// own un-elided "fiche de {nom}". One function now, so a fourth caller never
// reforks the regex. Returns the full prefix ("d'" or "de ", trailing space
// included on the non-eliding branch) rather than a boolean, so every caller
// just concatenates.
function elideDe(nom: string): string {
  return /^[aeiouàâäéèêëïîôöùûüh]/i.test(nom) ? "d'" : "de ";
}

// The site's author and the association it was made for, linked from the
// footer and /a-propos (VolunteerCredit.astro) and named on /mentions-legales.
const AUTHOR = "Adrien Lemaire";

// A member based in the Halle: « 0 m » and « À 0 m de la Halle » read like a glitch.
const atHall = (distance: string): boolean => distance === "0 m";

export const COPY = {
  skipLink: "Aller au contenu",
  toggletipClose: "Fermer",
  brandEyebrow: "Annuaire de",
  brandName: "la Cartoucherie",
  // The single real contact address for the whole site (task-11-report.md, "fix round 2"):
  // contact@lacartoucherie.fr was never supplied by anyone — no mockup or spec names it — it
  // was invented on a real-sounding domain and wired into every mailtoHref() caller. Adrien
  // supplied lemaire.adrien@gmail.com as the publication contact (task-11-brief.md); one real
  // address beats a second, fabricated one live on the site.
  contactEmail: "lemaire.adrien@gmail.com",

  homeTitle: "Je cherche…",
  homeIntro: "Les voisines et voisins qui habitent ou travaillent à la Cartoucherie.",
  // The collective the directory grew out of, credited without taking the name.
  homeBy: "Porté par les Entrepreneurs de la Cartoucherie",
  homeTitleTag: "Annuaire de la Cartoucherie — par les Entrepreneurs de la Cartoucherie",
  homeDescription:
    "Les voisines et voisins qui habitent ou travaillent à la Cartoucherie, à Toulouse, " +
    "réunis par les Entrepreneurs de la Cartoucherie.",
  homeCollySays: "Dites-lui ce qu'il vous faut.",
  homeOrPick: "…ou choisissez la fin :",
  homeNeighbours: "Vos voisins",
  homeSeeAllNeighbours: (voisins: string) => `Voir les ${voisins}`,
  directoryDescription: "Les voisines et voisins de la Cartoucherie, à Toulouse, par métier.",
  mapDescription:
    "Les voisines et voisins de la Cartoucherie sur la carte du quartier, autour de la Halle.",
  categoryDescription: (nom: string, motsCles: string[]) =>
    `${nom} à la Cartoucherie, Toulouse : ${motsCles.slice(0, 3).join(", ")}.`,
  homeCollyTitle: "Colly reste collée aux bons endroits.",
  homeCollyText:
    "Elle vit dans les poutres de la Halle et connaît tout le monde : cet annuaire, c'est son " +
    "carnet d'adresses.",

  searchLabel: "Un métier, un prénom, un besoin",
  searchPlaceholder: "électricien, yoga…",
  searchSubmit: "Trouver",
  // The compact variant's submit is icon-only (SearchBar.astro, withColly:
  // false) — this string is its entire accessible name, matching
  // styleguide.html:880 verbatim (final-fixes-report.md, I11).
  searchSubmitAria: "Chercher dans l'annuaire",
  searchEmpty: "Personne ne correspond à cette recherche.",
  // src/client/live-search.ts's own failure state (task-12 fix round 1): a first visit
  // on a weak connection is this project's founding scenario, so a failed/slow fetch of
  // /recherche.json cannot silently do nothing — Task 13's service worker only helps a
  // *second* visit. One short, true sentence; the next keystroke already retries
  // (loadIndex resets its cached promise on rejection), so no separate button is needed.
  searchLoadError: "La liste n'a pas pu être chargée. Réessayez.",
  searchSuggest: "Vous connaissez quelqu'un\u00a0?",
  // The mailto: subject when a visitor offers a name for an empty category
  // (NeedsIndex, task-6 brief) — one string, so the format lives here and
  // never in a component's frontmatter.
  searchSuggestSubject: (nom: string) => `Un voisin pour « ${nom} »`,
  // A free-text search or a stale ?cat= has no category name to plug into
  // searchSuggestSubject above; the link label stays searchSuggest.
  searchNoMatchSubject: "Je connais quelqu'un",
  // The fixed half of a result's "why it matched" line — src/lib/search.ts's
  // own FIELDS carries the variable half (« son métier », « le besoin »…).
  // A plain string, not a function: src/client/live-search.ts reads it off
  // a data attribute rather than importing COPY (final-fixes-report.md, I4 —
  // COPY is one object literal, so importing any of it ships all of it).
  searchReasonPrefix: "Correspond à",
  // SearchBar's colly-couleur.png alt (styleguide block "La barre de
  // recherche"): the only place that image renders, so one string is enough.
  searchCollyAlt:
    "Colly, la créature des Halles de la Cartoucherie, agrippée au bord de la barre de recherche",

  directoryAll: "Voir tout le quartier",
  // annuaire.html's own H1 ("L'annuaire") and filter nav (aria-label and the
  // label above the chip rail both read "Filtrer par métier"; the leading,
  // always-present chip reads "Tous les métiers").
  directoryTitle: "L'annuaire",
  directoryFilterLabel: "Filtrer par métier",
  directoryAllChip: "Tous les métiers",
  directoryMapLink: "Voir sur la carte",
  // [data-no-match]'s own reset link (annuaire.html:715, "Revoir les 12
  // voisins" — final-fixes-report.md, M18): a stale/mistyped ?cat= is a
  // browsing state with no live query to clear, so a plain link back to the
  // unfiltered /annuaire is the fix, not a JS reset button. Takes the
  // already-formatted "N voisins" string (formatMemberCount's own output),
  // never a literal — a neighbour added later is counted honestly.
  directoryResetAll: (voisins: string) => `Revoir les ${voisins}`,
  // sr-only: MemberRow's own <h3> per row otherwise skips straight from the
  // page's <h1> to an <h3> with nothing in between — an invalid heading order
  // (task-15-report.md, Lighthouse's heading-order audit). Not shown visually
  // so the approved mockup's own layout stays byte-for-byte unchanged.
  directoryListHeading: "Liste des voisins",
  countNobody: "personne encore inscrit·e",
  // Until the directory is big enough, empty categories share one line instead of
  // six greyed rows that make it look deserted.
  needsEmptyGroup: (noms: string[]) => `Encore personne pour ${noms.join(", ")}.`,

  profileContact: (article: string) => `${capitalize(article)} contacter`,
  profilePortrait: "Son portrait",
  // The member's Instagram portrait carousel (PortraitCarousel.astro).
  carouselLabel: "Sa présentation en images",
  carouselPrevious: "Image précédente",
  carouselNext: "Image suivante",
  carouselClose: "Fermer",
  profileOffers: (pronoun: string) => `Ce qu'${pronoun} propose`,
  profileWhere: (article: string) => `Où ${article} trouver`,
  // membre.html's own « Où la trouver » deep link (line 497): gendered like
  // profileContact/profileWhere above, so capitalize() is shared rather than
  // re-inlined a third time.
  profileOnMap: (article: string) => `${capitalize(article)} voir sur la carte du quartier`,
  profileDirections: "Ouvrir l'itinéraire",
  // The identity card's own rating link (membre.html:400-403): the sr-only
  // tail before the count, and the count itself — kept apart like
  // MemberCard/MemberRow's ratingOutOf below. Text matches the mockup
  // verbatim; tests/e2e/profile.spec.ts targets reviewsTitle by role rather
  // than text, precisely so this phrase is free to share a substring with it.
  profileRatingSr: "sur 5 —",
  profileReviewCount: (n: number) => `${n} avis du quartier`,
  profileDistanceFromHall: (distance: string) =>
    atHall(distance) ? "À la Halle" : `À ${distance} de la Halle`,
  cardDistance: (distance: string) => (atHall(distance) ? "La Halle" : distance),
  profileEmail: "E-mail",
  profileSite: "Son site",
  profileInstagram: "Instagram",
  profileCall: "Appeler",
  profilePhone: "Téléphone",
  // The number stays one tap away rather than printed on the page (fewer
  // spam calls, and nothing for a search engine to show).
  profileShowPhone: "Voir le numéro",
  profileWrong: "Cette fiche n'est pas correcte",
  profileWrongSubject: (nom: string) => `Correction — fiche ${elideDe(nom)}${nom}`,
  // The row's own call chip (annuaire.html:424) speaks the name in its
  // aria-label rather than the button's own visible "Appeler", so a
  // screen-reader user picks the right row out of a list of identical
  // buttons. Not the number: it is never printed outside the profile's reveal.
  callAria: (nom: string) => `Appeler ${nom}`,
  // The sr-only tail of a star rating (styleguide block 12: "4,8<sr-only> sur
  // 5,</sr-only> (12)") — one string, so MemberCard and MemberRow never fork it.
  ratingOutOf: "sur 5,",

  reviewsTitle: "Avis du quartier",
  reviewsNone: "Aucun avis pour l'instant.",
  // Future tense (final-fixes-report.md, I12): reviewing does not exist yet.
  // ReviewsSlot's toggletip; /avis says the same at length.
  reviewsHow: "Les avis seront signés par des voisins, relus par l'association, et jamais achetés.",
  reviewsHelp: "Comment sont faits les avis ?",

  // The QR code needs no explanation: everyone in the quartier arrived by one.
  qrShow: "QR code",
  qrDownload: "Télécharger le QR code",
  qrDownloadShort: "Télécharger",
  qrAlt: (nom: string) => `QR code vers la fiche ${elideDe(nom)}${nom}`,

  mapTitle: "La carte du quartier",
  mapAttribution: "© les contributeurs d'OpenStreetMap",
  mapFromHall: "Classé depuis la Halle",
  mapUseMyLocation: "Classer depuis ma position",
  mapTheyComeToYou: "Ils viennent chez vous",
  mapPickupOnly: "Adresse de retrait, pas de point sur la carte",
  mapHall: "La Halle",
  mapLocatePin: (nom: string) => `Situer ${nom} sur la carte`,
  // « la » agrees with « l'épingle » (the pin, feminine), not with the member —
  // docs/mockups/final/carte.html renders this same "la situer" for men too
  // (Yanis Belhadj's own pin, line 555), so it is not a missed agree() call.
  mapPinAria: (nom: string, metier: string, distance: string) =>
    `${nom}, ${metier}, ${atHall(distance) ? "à la Halle" : `à ${distance}`} — la situer dans la liste`,
  mapClearSelection: "Tout réafficher",
  // src/client/geolocate.ts toggles these spans, it never composes text.
  mapFromYou: "Classé depuis votre position",
  mapGeoGranted: "Position reçue : liste reclassée.",
  mapGeoDenied: "Position indisponible.",
  // The privacy promise, one tap away (a popover), not always-visible prose.
  mapGeoPrivacy: "Et ma position ?",
  mapGeoLocal: "Votre position ne quitte pas votre téléphone : les distances sont calculées ici.",
  mapIntroAddress: (count: number, noun: string) =>
    `${count} ${noun} ${count === 1 ? "a" : "ont"} une adresse ici.`,
  mapIntroItinerant: (count: number) =>
    count === 1 ? "1 autre vient chez vous." : `${count} autres viennent chez vous.`,
  mapPlanAlt: "Carte du quartier de la Cartoucherie autour de la Halle",
  // The card's own no-address line, one member at a time: styleguide block 12
  // (line 1086, « accordé au genre ») renders "Elle vient chez vous" for a
  // woman, annuaire.html renders "Il vient chez vous" for a man — mapTheyComeToYou
  // above is the map legend's plural for the group, not this.
  comesToYou: (pronoun: string) => `${capitalize(pronoun)} vient chez vous`,
  // The elision itself is elideDe() above; MemberCard and MemberRow never
  // fork this one table.
  portraitAlt: (nom: string) => `Portrait ${elideDe(nom)}${nom}`,

  footerAbout: "À propos",
  footerPrivacy: "Confidentialité",
  footerLegal: "Mentions légales",
  footerReviews: "Les avis, comment ça marche",

  // /a-propos, /confidentialite, /mentions-legales, /avis (Task 11). Each page's
  // <h1> reuses the matching footer* label above rather than forking a second
  // string that would only ever say the same thing.
  aboutDescription: "Qui fait cet annuaire, et ses crédits.",
  author: { name: AUTHOR, url: "https://www.linkedin.com/in/adrienlemaire/" },
  association: {
    name: "Les Entrepreneurs de la Cartoucherie",
    url: "https://www.instagram.com/entrepreneurs_cartoucherie_/",
  },
  creditFor: "pour aider l'association",
  aboutIntroLead: "Cet annuaire est fait bénévolement par",
  aboutAuthorAvailable: "Adrien est à l'écoute de nouvelles opportunités professionnelles.",
  aboutCreditsTitle: "Les crédits",
  aboutCreditMap: "Les itinéraires s'appuient sur OpenStreetMap.",
  aboutCreditOpenSource: "Bibliothèques open source : Astro, Tailwind CSS, daisyUI, Zod et qrcode.",

  privacyDescription: "Ce que ce site collecte et ce qu'il ne collecte pas.",
  privacyDoesTitle: "Ce que ce site fait",
  // "ne dépose rien" stopped being true the moment public/sw.js started caching pages
  // for the offline scenario (Task 13) — this now names what actually matters (no
  // tracker), and privacyDoesOffline below discloses the cache itself instead of
  // leaving it unmentioned.
  privacyDoesBrowsing:
    "Parcourir l'annuaire, une fiche ou la carte ne vous fait suivre par aucun traceur.",
  // public/sw.js precaches "/" and "/annuaire" on install (SHELL), then adds each page
  // it fetches successfully — never visitor data (final-fixes-report.md, M19).
  privacyDoesOffline:
    "L'accueil, l'annuaire et les pages consultées sont gardés en cache pour marcher hors " +
    "connexion. Ce cache ne contient rien sur vous.",
  // Spec §5: it names the one network request the claim doesn't cover (the index
  // download) instead of leaving it implicit. SearchBar.astro's header comment carries
  // the evidence. No longer claims "une seule fois": public/sw.js's install step
  // now also fetches /recherche.json once, in the background, to precache it — see
  // src/client/live-search.ts's own header comment for that download.
  privacyDoesSearch:
    "La recherche télécharge la liste du quartier ; ce que vous tapez n'est jamais envoyé.",
  privacyDoesGeo:
    "Votre position n'est utilisée que sur la carte, si vous la demandez, et ne quitte jamais " +
    "votre téléphone.",
  // The narrow, true claim (task-13 dispatch): what Cloudflare Web Analytics is, and
  // no more than that. Only "mesure la fréquentation" is verified against this
  // project's own code (src/client/analytics.ts). "No cookie" is privacyDoesNotCookie's,
  // checked by tests/e2e/deployed.spec.ts; "sans traceur inter-sites" and "sans profil
  // individuel" are Cloudflare's own documented properties of the product.
  privacyDoesAnalytics:
    "Cloudflare Web Analytics mesure la fréquentation, sans traceur d'un site à l'autre ni " +
    "profil individuel.",
  privacyDoesNotTitle: "Ce que ce site ne fait pas",
  privacyDoesNotCookie: "Aucun cookie n'est déposé.",
  privacyDoesNotAccount: "Aucun compte n'est nécessaire pour consulter l'annuaire.",
  privacyDoesNotFont:
    "Aucune police n'est chargée depuis un service tiers : elles sont hébergées ici.",
  // Narrowed to régie publicitaire only: the audience-measurement half of this claim
  // moved to privacyDoesAnalytics above, where it belongs now that it exists.
  privacyDoesNotAds: "Aucune régie publicitaire n'est installée sur ce site.",
  privacyContact: "Une question sur vos données ou sur une fiche :",

  legalDescription: "Éditeur, directeur de la publication, hébergeur et propriété intellectuelle.",
  legalEditorTitle: "Éditeur et directeur de la publication",
  // Editor and publication director are the same person (LCEN, non-professional).
  legalAuthor: `${AUTHOR}.`,
  legalContactTitle: "Contact",
  legalHostTitle: "Hébergeur",
  legalHost: "Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, États-Unis.",
  legalIpTitle: "Propriété intellectuelle",
  // Each profile belongs to the entrepreneur it presents, not to the association
  // and not to the editor. Until accounts exist (roadmap), changes go by email.
  legalIpText:
    "Chaque fiche appartient à la personne qu'elle présente : ses textes, photos et visuels sont " +
    "publiés avec son accord. Elle peut les faire modifier ou retirer à tout moment, sur simple " +
    "demande à l'adresse de contact ci-dessus. Toute reproduction sans son autorisation est interdite.",

  // Future tense throughout this section but reviewsReportText below
  // (final-fixes-report.md, I12): reviews are not built yet (avis.astro's own
  // header comment) — no page anywhere on this site offers a way to leave
  // one, so describing the collection and moderation process as already
  // running is worse than describing none. reviewsReportText stays present
  // tense because it is true today: writing to the association is a real
  // mailto:, working right now, independent of whether reviewing itself exists.
  reviewsDescription: "Qui pourra laisser un avis, comment il sera modéré, comment en signaler un.",
  reviewsWhoTitle: "Qui pourra laisser un avis ?",
  reviewsWhoText:
    "Toute personne qui aura fait appel à un voisin de l'annuaire : un avis signé, un seul par fiche.",
  reviewsPaidTitle: "Un avis pourra-t-il être acheté ?",
  reviewsPaidText: "Non, jamais.",
  reviewsModerationTitle: "Qui modérera les avis, et sur quels critères ?",
  reviewsModerationText:
    "L'association relira les avis signalés et retirera ceux qui seront insultants ou hors sujet.",
  reviewsReportTitle: "Comment signaler un avis ?",
  reviewsReportText: "Écrivez à l'association en précisant la fiche et l'avis concernés.",
  reviewsReportLink: "Signaler un avis",
  reviewsReportSubject: "Signalement d'avis",

  // Additions beyond the task-3 brief dictionary, needed to keep SiteHeader.astro
  // and SiteFooter.astro free of hardcoded French (task-3-report.md documents each
  // as a deviation). Text is copied verbatim from docs/mockups/final/index.html
  // and docs/mockups/final/styleguide.html block 21, except where noted.
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
  footerCreditLead: "Fait bénévolement par",
  footerAddress: "Halle de la Cartoucherie · Tram T1, arrêt Cartoucherie · 31300 Toulouse",
  footerNavAria: "Liens de pied de page",

  // src/pages/404.astro: a printed QR code cannot be edited, so a renamed slug or a
  // departed neighbour lands here. One sentence; the search and the link do the rest.
  notFoundDescription: "Cette page n'existe pas ou a changé d'adresse.",
  notFoundTitle: "Page introuvable",
  notFoundCollyTitle: "Le lien a changé, ou la fiche a été retirée.",
  notFoundDirectoryLink: "Retour à l'annuaire",
} as const;
