# Comparaison des quatre maquettes

Date: 2026-09-05
Scored against `_shared/criteres-revue.md`, which was written before the variants were
delivered. Evidence: `_shots/*.png`, all captured at 390px width — the mobile-first
scenario from spec §1.

## Verdict en une phrase

**No single variant wins.** Variant B owns the emotional case, variant C owns the
vocabulary problem, variant A owns scale, variant D owns place. The final design takes
C's organising principle, B's card and voice, A's persistent search and sticky call bar,
and D's proximity cues — and drops D as a landing hypothesis.

## Tableau de notation

| Critère | A · recherche | B · portraits | C · besoins | D · proximité |
|---|:--:|:--:|:--:|:--:|
| 1. Taps jusqu'au téléphone | 3 | 4 | **5** | 2 |
| 2. Compréhension au premier écran | 3 | **5** | **5** | 3 |
| 3. Lisibilité & atteignabilité | 4 | 4 | **5** | 2 |
| 4. « Soutenir » — favoris & avis | 3 | **5** | 3 | 3 |
| 5. Page membre (page de conversion) | **5** | **5** | 4 | 4 |
| 6. Qualité du français | 4 | **5** | **5** | 4 |
| 7. Distinction esthétique | 3 | **5** | 4 | 3 |
| 8. Honnêteté à 200 membres | **5** | 1 | 4 | 2 |
| 9. Réutilisabilité des composants | 4 | **5** | 4 | 3 |
| **Total /45** | **34** | **39** | **39** | **26** |

Criterion 1 is weighted highest and deserves its detail:

- **A** — 1 tap plus typing *if you know the word*; 2 taps via a suggestion chip otherwise.
- **B** — 1 tap to *a* phone number, because contact icons sit on the feed card. But you
  cannot choose *which* trade; you get whoever is at the top of the feed.
- **C** — 2 taps to the phone number of *the trade you actually need*, with no vocabulary
  required. This is the only variant that is fast **and** targeted.
- **D** — the landing rows carry distance, not a call button; reaching a number takes 2–3
  taps through the profile.

## Ce que chaque variante apporte

### A — « la recherche d'abord » (34/45)

**Strongest idea: the sticky bottom call bar on the profile page.** « 📞 Appeler Camille »
plus a favourite heart, pinned to the thumb zone at every scroll position. It is the best
conversion device produced by any variant and it costs almost nothing to implement.

Also worth taking: the phone number rendered *inside* the button rather than behind a
generic label (B did this too, independently — two agents converging on it is a signal);
the « correspond à : services » line explaining *why* a result matched; the accent-insensitive
matching, which matters a lot in French; treating no-results as real UI with a `mailto:`
to suggest a missing professional; and search state travelling between pages in `?q=`.

**Clearest mistake: the landing page is empty.** The screenshot shows roughly 900px of
dead space below the fold. Someone who scanned a QR code in a shop out of curiosity —
not with a query — is given a blank box and nothing to look at. The variant's own README
concedes this. Its second problem is vocabulary: someone typing « fuite d'eau » finds
nobody, because no member's text contains that phrase.

**But criterion 8 is A's vindication.** Search is the only discovery surface that gets
*better* as the directory grows. At 200 members it is the primary tool; at 12 it looks
like overkill. The mockup is judged at 12 and the product ships at 200.

### B — « les portraits d'abord » (39/45)

**Strongest idea: the portrait card with contact icons on it.** Face large, name in a
serif, trade beneath, two category badges, tagline, then phone/web/Instagram icons and a
« Voir le portrait → » action. It is the atom the whole site should be built from, and it
is the reason B scores 4 on time-to-contact without a search box.

**Second strongest: the voice.** « Son portrait », « Ce qu'**elle** propose » (gender-matched
to the member), « Avis du quartier ». That last one is the answer to criterion 4 — it
reads as neighbours vouching for a neighbour rather than customers rating a business,
which is precisely the « soutenir » framing the spec asks for and the register payments
will eventually need to live in. « Chaque semaine, Sandra rencontre un commerçant… » also
credits the community manager on the landing page, which no other variant thought to do.

**Clearest mistake: it does not survive its own success.** At ~700px per card the feed
shows 1.5 members per screen. At 200 members the landing page is a 140,000px scroll. The
agent flagged this honestly rather than quietly curating the feed down to a teaser, which
is the right call — the trade-off is now visible instead of hidden.

Minor: the review stars render in a pale gold that fails contrast on cream.

### C — « le besoin d'abord » (39/45)

**Strongest idea: the need-phrasings.** « Manger bon sans cuisiner ce soir ». « Un coup de
main chez moi ». « Retrouver l'équilibre : stress, sommeil, énergie ». « Un site, un logo,
une image de moi ». This is the best writing in the whole exercise and it solves a real
problem: a resident who needs a sophrologue does not know the word « sophrologue ». The
official category name sits underneath as the formal label, so the taxonomy stays intact.

**This is also the answer to spec §14's open item.** The category list Sandra needs to
approve now exists in two registers — the formal name and the need phrasing — which is a
much better artefact to put in front of her than a bare list of nouns.

**Second idea: categories as routes, not decoration.** The badges inside member cards are
tappable and navigate back into the taxonomy. Third: the empty category is shown honestly
as « bientôt » with a "suggest a member" route rather than hidden — a state guaranteed to
occur in a directory that is still growing.

**Clearest mistake: no faces.** The landing page is ten text tiles. It forfeits the
recognition effect that makes B work, and for a directory whose source material is a
stream of *portraits*, leading with typography instead of people is a strange choice.
Ten tiles also means only four are above the fold, so the "finite and safe" feeling the
counts are meant to create requires scrolling to obtain.

Its own README concedes the in-card badges sit at 36–40px, below the 44px bar this
variant claims the strongest ground on.

### D — « la proximité d'abord » (26/45)

**Strongest idea: the honest pre-permission state.** Geolocation is requested only on an
explicit tap, and the list is ranked from la Halle in the meantime, so the proximity
promise is already true before anyone grants anything. « Non merci, je reste sur la Halle »
is a genuinely good refusal affordance. « Rien n'est envoyé à un serveur : le calcul reste
sur votre téléphone » is the kind of sentence that earns trust in one line.

**Second: « Ils viennent chez vous ».** The three members with no fixed address become a
named section instead of a dash. The map page repeats this as « sans point sur la carte »
with an explanation. This is the most careful handling of a null value in the whole set.

**Third: the map itself.** Pins and a distance-ordered bottom sheet that cross-highlight
via pure CSS `:target`, with the profile page deep-linking to `carte.html#pin-…` so a pin
arrives pre-selected. No library, and it reads as a real map view.

**Clearest mistake: distance is not the visitor's top question.** Twelve members inside
800m — and 200 inside the same 800m at launch — means distance barely discriminates. In a
district this compact, everyone is a five-minute walk away, so ordering by it sorts noise.
The variant's own agent reached this conclusion independently.

**A correction I owe this variant.** My prompt told it the spec contemplates a GPS
permission prompt. It does not. That idea came from your remark about building *scan
statistics* after asking for GPS authorisation — an analytics question, not a discovery
mechanism. The agent caught the discrepancy and flagged it. Proximity-first therefore rested
on a mandate I invented, and it is scored here on its merits rather than on that premise.

Execution problems compound the strategic one: distance figures render in a pale salmon
that fails contrast at exactly the moment they carry the most information, and member
names truncate mid-word on the landing cards.

## Recommandation : la surface d'accueil

**Lead with needs (C), rendered with faces (B), under a persistent search field (A).**

The reasoning:

1. **C's hypothesis is the correct one about the visitor.** The QR-scan visitor has a
   problem, not a vocabulary. Handing them a blank search box (A) or an undifferentiated
   feed (B) both assume knowledge they do not have.
2. **B's hypothesis is correct about the content.** This directory's raw material is
   portraits of people. A landing page with no faces on it is not this community's
   directory; it is any directory.
3. **A's hypothesis is correct about the future.** Search is the only surface that
   improves at 200 members, so it must be permanently present — but as the site's spine
   in the header, not as the hero that empties the first screen.
4. **D is right about a detail, not about the architecture.** Proximity is a *cue on a
   card* and a *sort option*, not an organising principle, in a district you can cross in
   ten minutes.

Per spec §9 the landing surface is a single constant, so this is a starting position that
analytics can overturn — not a permanent commitment. What the mockups settle is which
*components* exist; which one `/` leads with stays cheap to change.

## Ordre de construction de la variante finale

| Composant | Origine | Note |
|---|---|---|
| Carte portrait (l'atome) | **B** | Contact icons on the card. Reduce height ~40% for feed use. |
| Rangée annuaire (dense) | **C** | Photo + name + trade + badges + call, four visible per screen. |
| Tuiles « Je cherche… » | **C** | Keep the phrasings verbatim. Add a face motif; make them shorter so 6 sit above the fold. |
| Recherche persistante en en-tête | **A** | Accent-insensitive, `?q=` handoff, "why it matched" line. |
| Barre d'appel collante (fiche) | **A** | The single best conversion device in the set. |
| Structure de la fiche membre | **B** | « Son portrait » / « Ce qu'elle propose » / « Avis du quartier », gender-matched. |
| Boîte de dialogue de connexion | **B** | Magic link + passkey, per spec §7. |
| Carte du quartier | **D** | CSS `:target` pins + distance-ordered bottom sheet + deep-link from profile. |
| État pré-autorisation GPS | **D** | Ranked from la Halle; explicit opt-in only; local-computation reassurance. |
| Section « Ils viennent chez vous » | **D** | For members with no fixed address. |
| Catégorie vide « bientôt » | **C** | With a "suggest a member" route. |
| États sans résultat | **A** | Fallback chips + `mailto:` to the community manager. |
| Thème | **autumn** | Chosen independently by three of four agents. |
| Police d'affichage | **Fraunces** | From B; A reached the same choice independently. |

## Défauts à ne pas reproduire

- Pale-on-pale text for the information a card exists to convey (D's distances, B's stars).
- Emoji standing in as an icon system (C and D). Fine in a mockup, cheap in production.
- Truncating a member's name (D). A name is the one string that must never be cut.
- Category badges below 44px (C, self-flagged).
- A landing page that is mostly empty space (A).
