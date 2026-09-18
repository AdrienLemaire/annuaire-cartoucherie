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

export const COPY = {
  skipLink: "Aller au contenu",
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
  // The compact variant's submit is icon-only (SearchBar.astro, withColly:
  // false) — this string is its entire accessible name, matching
  // styleguide.html:880 verbatim (final-fixes-report.md, I11).
  searchSubmitAria: "Chercher dans l'annuaire",
  // True as of Task 12 (task-11-report.md, "fix round 4", named this task as the one that
  // would make it true again): src/pages/recherche.json.ts serves the whole member index as
  // a static file, src/client/live-search.ts fetches it once per page load (cached across
  // every keystroke) and calls search() — src/lib/search.ts, pure and isomorphic — entirely
  // in the browser. Nothing there calls fetch a second time or builds a URL from the typed
  // value, and SearchBar.astro's <input> carries no `name`, so even the no-JS GET fallback
  // cannot put it on the wire. Verified against the built site: see task-12-report.md.
  searchLocal:
    "Ce que vous tapez ne quitte jamais votre téléphone : la recherche se fait dans la liste déjà chargée sur votre appareil.",
  searchEmpty: "Personne ne correspond à cette recherche.",
  // src/client/live-search.ts's own failure state (task-12 fix round 1): a first visit
  // on a weak connection is this project's founding scenario, so a failed/slow fetch of
  // /recherche.json cannot silently do nothing — Task 13's service worker only helps a
  // *second* visit. One short, true sentence; the next keystroke already retries
  // (loadIndex resets its cached promise on rejection), so no separate button is needed.
  searchLoadError: "La liste n'a pas pu être chargée. Réessayez.",
  searchSuggest: "Vous connaissez quelqu'un ?",
  // The mailto: subject when a visitor offers a name for an empty category
  // (NeedsIndex, task-6 brief) — one string, so the format lives here and
  // never in a component's frontmatter.
  searchSuggestSubject: (nom: string) => `Un voisin pour « ${nom} »`,
  // A free-text search or a stale ?cat= has no category name to plug into
  // searchSuggestSubject above — used by SearchResults.astro's own empty
  // state and annuaire.astro's [data-no-match] panel (final-fixes-report.md,
  // I5/M18). The mockup's own #aucun-resultat carries this exact subject
  // (docs/mockups/final/annuaire.html:717, decoded).
  searchNoMatchSubject: "Je connais quelqu'un",
  // The same panel's own link label (annuaire.html:717) — distinct from the
  // generic searchSuggest ("Vous connaissez quelqu'un ?") used everywhere a
  // category name is known: this one names no category, so it asks the
  // broader question the mockup's own text asks.
  searchNoMatchSuggest: "Dites-nous quel métier manque à la Cartoucherie",
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
  directoryMapLink: "Voir ces fiches sur la carte",
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
  // annuaire.html's own #compte-detail default, shown until a filter names
  // itself: "Tous les métiers, du plus fourni au plus rare."
  directoryDetailDefault: "Tous les métiers, du plus fourni au plus rare.",
  categoryNobody: "Personne ne s'est encore inscrit·e dans cette catégorie.",
  countNobody: "personne encore inscrit·e",

  profileContact: (article: string) => `${capitalize(article)} contacter`,
  profilePortrait: "Son portrait",
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
  profileDistanceFromHall: (distance: string) => `À ${distance} de la Halle`,
  profileEmail: "E-mail",
  profileSite: "Son site",
  profileInstagram: "Instagram",
  profileCall: "Appeler",
  profileWrong: "Cette fiche n'est pas correcte",
  profileWrongSubject: (nom: string) => `Correction — fiche ${elideDe(nom)}${nom}`,
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
  // Future tense (final-fixes-report.md, I12): renders under "Aucun avis pour
  // l'instant." on every profile (ReviewsSlot.astro) and under "Un avis
  // pourra-t-il être acheté ?" on /avis — reviewing does not exist yet.
  reviewsHow: "Les avis seront signés par des voisins, relus par l'association, et jamais achetés.",
  reviewsPolicy: "Les avis, comment ça marche",

  qrTitle: "Son QR code",
  qrExplain:
    "À imprimer et à poser sur son comptoir, ou à coller au dos de ses cartes de visite. " +
    "Il mène directement ici, sans passer par l'accueil.",
  qrDownload: "Télécharger le QR code",
  qrAlt: (nom: string) => `QR code vers la fiche ${elideDe(nom)}${nom}`,

  mapTitle: "La carte du quartier",
  mapSchematic: "Plan schématique : les positions sont indicatives.",
  mapFromHall: "Classé depuis la Halle de la Cartoucherie",
  mapUseMyLocation: "Classer depuis ma position",
  mapTheyComeToYou: "Ils viennent chez vous",
  mapPickupOnly: "Adresse de retrait, pas de point sur la carte",
  mapYouAreHere: "Vous êtes ici",
  mapLocatePin: (nom: string) => `Situer ${nom} sur le plan`,
  // « la » agrees with « l'épingle » (the pin, feminine), not with the member —
  // docs/mockups/final/carte.html renders this same "la situer" for men too
  // (Yanis Belhadj's own pin, line 555), so it is not a missed agree() call.
  mapPinAria: (nom: string, metier: string, distance: string) =>
    `${nom}, ${metier}, à ${distance} — la situer dans la liste`,
  mapClearSelection: "Tout réafficher",
  // src/client/geolocate.ts's own heading swap and status line, once a visitor
  // grants or declines their position — never composed by the script itself
  // (category-filter.ts's own precedent: a script toggles hidden, it does not
  // build a sentence). Drops the mockup's own hardcoded "dix" (member count).
  mapFromYou: "Classé depuis votre position",
  mapGeoGranted:
    "Position reçue. Les distances ci-dessous viennent d'être recalculées ici, dans le navigateur.",
  mapGeoDenied: "Position indisponible : le classement reste mesuré depuis la Halle.",
  // The geo panel's own explanatory pair (docs/mockups/final/carte.html:457-461,
  // ids geo-titre/geo-texte) — restored per task-10-report.md finding 1: the
  // button is the consent, and consent needs to say what it is consenting to
  // before the tap. mapGeoTitle is deliberately its own key, shorter than
  // mapFromHall (the sheet's own heading, task-10-brief.md's own instruction):
  // the mockup's geo-titre never carried the "de la Cartoucherie" suffix, and
  // reusing mapFromHall here made tests/e2e/carte.spec.ts's own
  // page.getByText(COPY.mapFromHall) ambiguous between the two. The post-grant
  // half of the pair is identical in both places, so mapFromYou is reused.
  mapGeoTitle: "Classé depuis la Halle",
  mapGeoText:
    "Le repère du quartier : le classement est donc déjà juste. Vous pouvez aussi partir de là où vous êtes.",
  mapGeoTextYou: "Les distances ci-dessous sont recalculées à vol d'oiseau depuis là où vous êtes.",
  // carte.astro's own reassurance line under the Classer/Non merci buttons
  // (docs/mockups/final/carte.html's own alerte row) — used to reuse
  // searchLocal, which read fine generically but went specifically about
  // "ce que vous tapez" once corrected for the search bar (task-11-report.md,
  // "fix round 2"), and there is no typing on this panel. Split so each
  // context states the fact it actually demonstrates: src/client/geolocate.ts
  // never calls fetch, confirmed by reading the file — the haversine math
  // (src/lib/plan.ts) runs in the browser and nothing leaves it.
  mapGeoLocal:
    "Elle n'est jamais envoyée ailleurs : le calcul des distances se fait ici, sur votre téléphone.",
  // « Non merci, je reste sur la Halle » (carte.html's own geo-refuser) — the
  // visible way to say no without the browser's own permission prompt being
  // the only exit. Never requests a position; src/client/geolocate.ts's own
  // handler only hides the panel.
  mapDecline: "Non merci, je reste sur la Halle",
  // The sheet's own origin line (carte.html:647, id="origine") and the page's
  // own intro (carte.html:448-449) — both count-dependent. Never the mockup's
  // hardcoded "Dix"/"Deux": count and noun are memberCountParts' own output
  // (carte.astro's frontmatter), so a neighbour Sandra adds later is counted
  // honestly rather than the page quietly starting to lie.
  mapOriginHall: (count: number, noun: string) => `${count} ${noun} · depuis la Halle`,
  mapOriginYou: (count: number, noun: string) => `${count} ${noun} · depuis votre position`,
  mapIntroAddress: (count: number, noun: string) => `${count} ${noun} ont une adresse ici.`,
  mapIntroItinerant: (count: number, noun: string, pronoun: string) =>
    `${count} ${noun} se déplacent : ${capitalize(pronoun)} sont plus bas.`,
  // The plan SVG's own role="img" aria-label (docs/mockups/final/carte.html):
  // the one accessible summary of a decorative illustration whose baked-in
  // street/landmark <text> labels are art, not UI copy, and so stay literal.
  mapPlanAlt:
    "Plan schématique du quartier de la Cartoucherie : la Halle au centre, la rue Paul Mesplé au sud, " +
    "l'avenue de Grande-Bretagne à l'est, la route de Bayonne au nord et la ligne de tram T1 à l'ouest.",
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
  aboutDescription:
    "Qui fait cet annuaire, les crédits des portraits, de la mascotte et de la carte.",
  aboutIntro:
    "Cet annuaire est fait bénévolement pour l'association de quartier de la Cartoucherie, à partir " +
    "des portraits réunis par Sandra Carole.",
  aboutCreditsTitle: "Les crédits",
  aboutCreditPortraits: "Les portraits des voisins sont l'œuvre de Sandra Carole.",
  aboutCreditColly: "Colly, la mascotte du quartier, sera redessinée par",
  aboutCreditMap: "Les itinéraires s'appuient sur OpenStreetMap.",
  aboutCreditOpenSource:
    "Ce site tourne grâce à des bibliothèques open source, dont Astro, Tailwind CSS, daisyUI, Zod " +
    "et qrcode.",

  privacyDescription: "Ce que ce site collecte et ce qu'il ne collecte pas.",
  privacyIntro:
    "Ce site est volontairement simple : voici, sans détour, ce qu'il fait et ce qu'il ne fait pas.",
  privacyDoesTitle: "Ce que ce site fait",
  // "ne dépose rien" stopped being true the moment public/sw.js started caching pages
  // for the offline scenario (Task 13) — this now names what actually matters (no
  // tracker), and privacyDoesOffline below discloses the cache itself instead of
  // leaving it unmentioned.
  privacyDoesBrowsing:
    "Parcourir l'annuaire, une fiche ou la carte ne vous fait suivre par aucun traceur.",
  // public/sw.js's networkFirst() only ever writes to the cache with a page it just
  // fetched successfully (never with placeholder or visitor data), so "cette copie" is
  // exactly the bytes of the page itself — see that function's own comment. Named
  // precisely (final-fixes-report.md, M19): sw.js's own SHELL precaches "/" and
  // "/annuaire" on install, regardless of whether either was ever visited — the
  // previous wording claimed offline access depended on having consulted a page first,
  // which was true only for every OTHER page.
  privacyDoesOffline:
    "L'accueil et l'annuaire sont mis en cache dès l'installation pour rester disponibles " +
    "hors connexion ; toute autre page consultée s'y ajoute au fil de la navigation. Cette " +
    "copie ne contient aucune information sur vous.",
  // Same fact as searchLocal above (spec §5), worded for this list rather than reusing that
  // string verbatim: it names the one network request the claim doesn't cover (the index
  // download) instead of leaving it implicit. See searchLocal's own comment for the
  // file:line evidence. No longer claims "une seule fois": public/sw.js's install step
  // now also fetches /recherche.json once, in the background, to precache it — see
  // src/client/live-search.ts's own header comment for that download.
  privacyDoesSearch:
    "La recherche télécharge la liste du quartier, comme n'importe quelle page ; " +
    "ce que vous tapez ensuite n'est jamais envoyé où que ce soit.",
  privacyDoesGeo:
    "Sur la carte, votre position n'est utilisée que si vous appuyez sur « Classer depuis ma " +
    "position » ; le calcul des distances se fait dans votre navigateur et votre position n'est " +
    "jamais envoyée ailleurs.",
  // The narrow, true claim (task-13 dispatch): what Cloudflare Web Analytics is, and
  // no more than that. Only "mesure la fréquentation" is verified against this
  // project's own code (src/client/analytics.ts, dist/_astro/analytics.*.js with a
  // token set — task-13-report.md). "Sans cookie" is covered by
  // tests/e2e/production.spec.ts's own "Sets no cookie…" test, against the
  // deployed site — where the analytics beacon actually loads (locally none
  // does, so a local-only test of this claim would assert something no
  // configuration could make false; final-fixes-report.md, M20, deleted the
  // one that did). "Sans traceur inter-sites" and "sans profil
  // individuel" are Cloudflare's own documented properties of the product, not
  // something this repository's code proves — stated on that basis, not overclaimed.
  privacyDoesAnalytics:
    "Cloudflare Web Analytics mesure la fréquentation de ce site, sans cookie, sans traceur " +
    "qui vous suivrait d'un site à l'autre et sans profil individuel construit sur vous.",
  privacyDoesNotTitle: "Ce que ce site ne fait pas",
  privacyDoesNotCookie: "Aucun cookie n'est déposé.",
  privacyDoesNotAccount: "Aucun compte n'est nécessaire pour consulter l'annuaire.",
  privacyDoesNotFont:
    "Aucune police n'est chargée depuis un service tiers : elles sont hébergées ici.",
  // Narrowed to régie publicitaire only: the audience-measurement half of this claim
  // moved to privacyDoesAnalytics above, where it belongs now that it exists.
  privacyDoesNotAds: "Aucune régie publicitaire n'est installée sur ce site.",

  legalDescription: "Éditeur, directeur de la publication, hébergeur et propriété intellectuelle.",
  legalEditorTitle: "Éditeur du site",
  legalDirectorTitle: "Directeur de la publication",
  legalDirectorName: "Adrien Lemaire.",
  legalContactTitle: "Contact",
  legalHostTitle: "Hébergeur",
  legalHostIntro: "Ce site est hébergé par Cloudflare.",
  legalIpTitle: "Propriété intellectuelle",
  legalIpText:
    "Sauf mention contraire, les textes, la mise en page et les portraits de ce site appartiennent " +
    "à l'association ou sont utilisés avec l'autorisation de leurs auteurs (voir la page « À " +
    "propos » pour le détail des crédits). Toute reproduction sans autorisation est interdite.",
  // The one marker glyph, shared by every unknown on /mentions-legales and
  // /a-propos so docs/mentions-legales-a-completer.md's own list and the page
  // never drift apart.
  legalMarker: (what: string) => `⟨à compléter : ${what}⟩`,

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
    "Tout voisin ou toute voisine qui aura eu recours à un voisin de l'annuaire pourra lui laisser " +
    "un avis signé sur sa fiche, un avis par voisin et par fiche.",
  reviewsPaidTitle: "Un avis pourra-t-il être acheté ?",
  reviewsModerationTitle: "Qui modérera les avis, et sur quels critères ?",
  reviewsModerationText:
    "L'association relira les avis signalés et retirera ceux qui seront insultants, hors sujet, ou " +
    "qui ne concerneront pas la fiche notée.",
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
  footerBlurb:
    "Fait bénévolement pour l'association de quartier, à partir des portraits réunis par " +
    "Sandra Carole. Gratuit, sans publicité, sans compte à créer.",
  footerAddress: "Halle de la Cartoucherie · Tram T1, arrêt Cartoucherie · 31300 Toulouse",
  footerNavAria: "Liens de pied de page",

  // src/pages/404.astro (task-16-report.md, fix round 1). This project's main
  // distribution channel is a QR code printed on paper — a flyer in a shop
  // window, a sticker on a counter — which cannot be edited once printed.
  // A renamed slug, a neighbour who has left, or a mistyped shared link all
  // land here, so the tone matches searchEmpty's directness rather than
  // apologising at length, and the page always offers the same two ways
  // onward as annuaire's own empty state: search again, or go to the
  // directory.
  notFoundDescription: "Cette page n'existe pas ou a changé d'adresse.",
  notFoundTitle: "Page introuvable",
  notFoundCollyTitle: "Cette page n'existe pas.",
  notFoundCollyText:
    "Le lien a changé, ou la fiche a été retirée. Cherchez ce que vous cherchiez, ou repartez de " +
    "l'annuaire.",
  notFoundDirectoryLink: "Retour à l'annuaire",
} as const;
