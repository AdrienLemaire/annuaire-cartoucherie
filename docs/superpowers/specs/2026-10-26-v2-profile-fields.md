# v2 — Profile fields for self-service creation

Date: 2026-10-26
Status: fields decided with Adrien on 2026-10-26 (§6). Feeds the v2 spec (`2026-10-26-v2-self-service-profiles.md`).

What a new entrepreneur must give us so their profile can be published without an editor, and
how each field is collected. Built from four reviews: the code (`src/content/schemas.ts` and
every consumer), the 6 live profiles (patterns only, no data copied here), the spec and
mockups, and French/EU rules for publishing people's details.

No claiming flow: Adrien links the 6 existing profiles to their owners' accounts by hand.

## 1. Fields the entrepreneur fills in

Lengths marked "real" are measured on the 6 live profiles, which an editor wrote; the fixture
in this repository is much shorter and is not a guide.

| Field          | Asked as                                                | Required          | Rule / normalisation                                                                                                                                                                    |
| -------------- | ------------------------------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nom`          | « Votre nom, tel qu'il doit apparaître »                | yes               | Trim, collapse spaces. Never truncated. Soft limit ~40 (the OG card wraps past ~25).                                                                                                    |
| `genre`        | « Sur votre fiche, on écrit : elle / il / iel »         | yes               | A wording choice, never "sexe" or a civil title. `f`, `h` or `n`. Drives every agreement through `src/lib/gender.ts` (§7).                                                              |
| `metier`       | « Votre métier, en quelques mots »                      | yes               | Real 18–43 chars. Soft limit 45.                                                                                                                                                        |
| `enseigne`     | « Le nom de votre activité, si elle en a un »           | no                | Business name, e.g. « Atelier Fictif ». Today it only appears inside `bio`.                                                                                                             |
| `categories`   | Checkboxes showing each category's « Je cherche… »      | yes, 1–2          | Validated against `categories.json` (unknown slugs are dropped silently today). The first one sets the icons. « Aucune ne convient » sends a note to Adrien.                            |
| `accroche`     | « En une phrase : ce que vous faites pour vos voisins » | yes               | First person. Real 125–165 chars. It is also the meta description: soft limit 160, hard 200.                                                                                            |
| `bio`          | « Présentez-vous comme à un voisin »                    | yes               | First person. Real 470–570 chars. Prompts in a toggletip: depuis quand, pour qui, comment ça se passe. Soft 600, hard 800.                                                              |
| `services`     | « Ce que vous proposez », one line each                 | yes, 1–6          | Each ≤ 75 chars (real 13–74, 4–6 per profile). The styleguide's « trois maximum » is lifted to 6.                                                                                       |
| `tarifs`       | « Vos tarifs »                                          | no                | Short free text: « Séance d'1 h : 50 € », « Sur devis ». ≤ 120 chars.                                                                                                                   |
| `horaires`     | « Quand vous trouver ? »                                | no                | Short free text: « Du mardi au samedi, 9 h–18 h », « Sur rendez-vous ». ≤ 120 chars.                                                                                                    |
| `reservation`  | « Un lien pour prendre rendez-vous »                    | no                | `https://` URL (Calendly, Planity…).                                                                                                                                                    |
| `langues`      | « Vous parlez aussi… »                                  | no                | Checkboxes of common languages plus « Autre ». French is implied.                                                                                                                       |
| Where you work | « Je reçois à une adresse » / « Je me déplace »         | yes               | Replaces typing `distance`. See §2.                                                                                                                                                     |
| `adresse`      | Street with typeahead, optional « Précision »           | if « reçoit »     | Display text. Geocoded separately (§2).                                                                                                                                                 |
| Zone           | « Où intervenez-vous ? »                                | if « se déplace » | Free text, e.g. « Dans tout le quartier ». Stored in `adresse` today.                                                                                                                   |
| `surCarte`     | « Afficher ma fiche sur le plan du quartier »           | —                 | Off by default for a home address.                                                                                                                                                      |
| `tel`          | « Le numéro où vos voisins peuvent vous appeler »       | one of tel/email  | Accept `+33`, dots, no spaces. Store `06 12 34 56 78`. French numbers only.                                                                                                             |
| `email`        | « L'adresse e-mail affichée sur votre fiche »           | one of tel/email  | Separate from the sign-in email, with a « même adresse » shortcut. Typo warning (gmial.com).                                                                                            |
| `site`         | « Votre site internet »                                 | no                | Accept any paste; store host and path only.                                                                                                                                             |
| `instagram`    | « Votre compte Instagram »                              | no                | Accept `@x`, `x` or a URL; store the handle.                                                                                                                                            |
| `linkedin`     | « Votre profil LinkedIn »                               | no                | Extract what follows `/in/`. Percent-encoded accents fail today's regex: decode or widen it.                                                                                            |
| `avisGoogle`   | « Votre fiche Google (pour vos avis) »                  | no                | A phone shares `maps.app.goo.gl/…`: the Worker resolves it, accepts only a `google.com/maps` target, then applies today's rule. No listing: a link to create a Google Business Profile. |
| `histoire`     | Six questions, « Votre histoire » (§7)                  | no                | Become the generated carousel slides.                                                                                                                                                   |
| `lieux`        | « Vos lieux favoris à la Cartoucherie »                 | no                | 1–5 places (§7).                                                                                                                                                                        |
| `photo`        | « Une photo de vous »                                   | yes               | See §3.                                                                                                                                                                                 |

## 2. Fields derived, never asked

- **`slug`**: `slugify(nom)`, made unique, shown before publishing, then **frozen**. A later
  name change never moves it, because the QR codes are printed.
- **`lat`/`lng`**: Géoplateforme geocoder (`data.geopf.fr/geocodage`, free, no key), called
  from the Worker. Accept only `type=housenumber`, `postcode=31300` and `score ≥ 0.7`;
  otherwise the member picks a suggestion. Place names (« Halle de la Cartoucherie ») do not
  geocode: keep them in the « Précision » line.
- **Inside `MAP_BOUNDS` or not**: 31300 is far larger than the map, and a point outside the
  bounds makes the whole build throw today (`src/lib/plan.ts`). Outside: no pin, flag to Adrien.
- **`distance`**: `formatDistance(haversine(HALL, point))`, or « — » for « se déplace ».
- **`photo` filename**, `note`, `nbAvis` (0 until reviews exist), `status`, `owner_user_id`,
  timestamps, and the consent records (§4).

## 3. Portrait

- `accept="image/jpeg,image/png,image/webp"`, JPEG first, so an iPhone HEIC arrives as JPEG.
- Crop in the browser to a square with the arch shown, face in the upper third (pages render
  at `object-position: 50% 22%`). Downscale to 768 px and re-encode as JPEG before upload.
- Refuse below 200 px on the short side (the `/carte` card needs ~197 px at ×1.4); recommend
  ≥ 384 px, the build's output.
- One person, no logo. The member attests they hold the rights to it (§4).

## 4. Legal: what to collect, show, and not collect

Not legal advice; points marked † need checking on Légifrance.

**Collect and record**: the account email; the terms version and date accepted; a separate,
express authorisation to publish the portrait (Code civil art. 9); an attestation that they
hold the photo's rights and that no one else is in it; « J'ai 18 ans ou plus ».

**Show**: a short art. 13 GDPR notice on the form (lawful basis: art. 6(1)(b), they ask to be
listed), linked to a rewritten `/confidentialite` (it says no account is needed today); that
the profile is public and an address appears on a map, with the « se déplace » / no-pin
options; « Supprimer ma fiche » in the editor; a written reason for any refusal or hiding
(DSA art. 17).

**Never collect**: date of birth, civil title, ID documents, a home address from someone who
travels, health details in free text, a SIRET as a gate (optional as a moderation hint, never
published).

**Retention**: the profile lives as long as the account; inactive accounts are deleted after
2 years, with a warning first. † If members publishing their own content makes the site a host
under the LCEN, décret 2021-1362 may require keeping a minimal identification record for a
year after deletion.

**The 6 existing profiles** were collected indirectly (GDPR art. 14). The v2 invitation email
can serve as their notice.

## 5. Fixes the current code needs first

- `surCarte: false` hides the pin but still puts `data-lat`/`data-lng` in `/carte`'s HTML, and
  the address on the profile. A member who opts out would still be locatable.
- `categories` are not checked against `categories.json`; `services` and `adresse` accept
  empty values; `site` and `instagram` have no validation.
- `distance` is typed by hand and can disagree with `lat`/`lng`.
- Carousel resizing neither rotates per EXIF nor refuses to enlarge.
- `firstName()` takes the first word of `nom`, so « Jean Marc » becomes « Appeler Jean ».

## 7. Story, favourite places and « iel » (decided 2026-10-27)

**« iel ».** `genre` gains `n`. The forms table in `src/lib/gender.ts` gets a third column:
« iel » (« Iel vient chez vous », « Ce qu'iel propose »), « lae » (« Où lae trouver », read more
cleanly by screen readers than « læ »), « voisin·e », « inscrit·e ». Counts of several
neighbours keep today's plural rule.

**Votre histoire.** Six optional questions, each one generated slide (v2 spec §11). Every answer
is first person, French, shown on the slide and used as its alt text.

| Slide                                      | Prompt                                                                               | Limit |
| ------------------------------------------ | ------------------------------------------------------------------------------------ | ----- |
| Pourquoi entreprendre ?                    | « Qu'est-ce qui vous a donné envie de vous lancer ? »                                | 300   |
| Mon déclic                                 | « Le moment où vous avez su que c'était le bon chemin »                              | 300   |
| Mon activité en bref                       | « Ce que vous faites, pour qui, comment »                                            | 300   |
| Les entrepreneurs de la Cartoucherie & moi | « Ce que le réseau vous apporte, et l'impact que vous voulez avoir sur le quartier » | 300   |
| Mes lieux favoris                          | Built from `lieux` below, plus an optional sentence                                  | 160   |
| Mon motto                                  | « Votre phrase, celle qui vous ressemble »                                           | 120   |

Limits are hard, in characters: a slide must stay readable at Instagram size. The real slides
run 94–567, so the longest ones would be split by an editor today. Each slide takes an optional
photo, re-encoded on the phone like the portrait; without one, the slide uses the house design.
The first slide, « À la rencontre de <nom> », is always generated from the portrait. The 6
existing profiles keep Sandra's slides.

**Lieux favoris.** 1–5 places, each with an optional « pourquoi » of 80 characters.

- Picked by typeahead from a build-time snapshot of the named OpenStreetMap places inside
  `MAP_BOUNDS` (158 on 2026-10-27: cafés, restaurants, parks, gyms, shops), fetched by the same
  Overpass mechanism as `scripts/map-svg.mjs`, under the same ODbL attribution. No runtime
  dependency, no third party in the browser.
- Not in the list: « Placer sur la carte ». The member taps the map, names the place and picks a
  type (café, restaurant, parc, boutique, sport, culture, autre). Adrien approves it with the
  profile; adding it to OpenStreetMap himself fixes the snapshot for everyone.
- Shown with a type icon in the site's style, never a logo: other businesses' logos raise
  copyright and trademark questions and would be blurry screenshots. A place that is a member's
  business shows that member's portrait and links to their profile.
- Google is not used: Places search bills per call and limits storing positions, and its script
  sets cookies.

## 6. Decisions (Adrien, 2026-10-26)

1. **A new profile waits for Adrien's approval** (`pending` status). Once approved, the owner's
   edits go live directly.
2. **Contact**: at least one of phone or email.
3. **Services**: 1 to 6, as the live profiles have.
4. **Carousel**: generated by the site from « Votre histoire » (§7, decided 2026-10-27). The 6
   existing profiles keep Sandra's slides, uploaded by Adrien.
5. **New fields**: business name, prices and opening hours as short free text, a booking link,
   languages spoken (§1). None of the live profiles has them, and the profile page has no place
   for them yet: the v2 spec decides where they render.
6. **Data controller** named on the notice: Adrien.
7. **Categories**: 1 or 2 per profile.
8. **Photos and slides** are stored in D1, not R2 (v2 spec §6).
9. **« iel »** offered alongside elle and il, with iel forms (§7).
10. **Favourite places** from OpenStreetMap, placed on the map as a « Lieux préférés » layer (§7).
