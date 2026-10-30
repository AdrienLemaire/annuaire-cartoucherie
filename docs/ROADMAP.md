# Roadmap

Where the Annuaire stands and what comes next. This file is the single place for status. The
spec (`docs/superpowers/specs/2026-08-29-annuaire-cartoucherie-design.md`) holds the reasoning,
and each version gets its own spec and plan when its turn comes.

Last updated: 2026-10-30.

| Version      | What it delivers                                                                                         | Status                                                       |
| ------------ | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **v1**       | The static directory: browse, search, filter, map, call a neighbour                                      | ✅ **Live** since 2026-10-26 on https://www.cartoucherie.fyi |
| **v2**       | Entrepreneurs create an account and fill in their own profile                                            | ⏭️ **Next**: spec drafted                                    |
| **After v2** | Neighbourhood reviews, synced favourites, `/admin`                                                       | 💡 Proposed, not scheduled                                   |
| **v3**       | Events                                                                                                   | 💡 Not started                                               |
| **Later**    | Payments to businesses; messaging stays unscheduled until residents want it here rather than in WhatsApp | 💡 Not started                                               |

## v1: the static directory (done)

Built by `docs/superpowers/plans/2026-09-14-annuaire-statique.md` (Plan 1).

**Shipped**

- Home page, `/annuaire`, `/categorie/[slug]`, live search and `/carte`
- Profile pages at a permanent `/membre/[slug]`, each with a downloadable QR code
- Production at `www.cartoucherie.fyi` and staging at `staging.cartoucherie.fyi`, deployed only
  through CI, with production gated on a reviewer
- Cookieless Cloudflare Web Analytics, counting EU visitors (manual snippet)
- Real member content injected at build from the private `cartoucherie-donnees` repository.
  None of it is in this repository.

**Added beyond Plan 1**

- `/carte` draws real OpenStreetMap streets as an inline SVG. This replaces both the schematic
  map and the MapLibre idea, which would have exceeded the JS budget.
- An Instagram-style portrait carousel on profiles
- A « Voir ses avis sur Google » link on profiles. It is a link only, because Google's terms
  forbid showing the reviews (spec §8).
- A housing category, and headings in Literata
- Portraits and carousel slides re-encoded at build by `scripts/sync-content.mjs`. This replaces
  the planned R2 and AVIF pipeline.

**Changed from the original v1 scope**

The spec put accounts, favourites, reviews and 200 profiles in v1. They did not ship:

- **Profiles:** 6 live at launch. Instead of 200 transcribed by hand, the directory grows when
  entrepreneurs add themselves in v2.
- **Accounts:** they move to v2, because self-editing needs them.
- **Reviews, synced favourites, `/admin` and the sign-in-then-review test:** proposed for after
  v2, not yet confirmed. Profiles keep an empty « Avis du quartier » slot for them
  (`src/components/ReviewsSlot.astro`).
- **LCP budget:** CI gates LCP at 2.5 s (`lighthouserc.json`), not Plan 1's 2.0 s.

## v2: self-service profiles (next)

Spec: `docs/superpowers/specs/2026-10-26-v2-self-service-profiles.md`, with the field list in
`2026-10-26-v2-profile-fields.md`. Entrepreneurs create an account and fill in their own
profile; Adrien approves new profiles, and later edits go live directly. No claiming flow: Adrien
links the 6 existing profiles to their owners by hand.

| Step                                                          | Status                             |
| ------------------------------------------------------------- | ---------------------------------- |
| Field list and decisions                                      | ✅ Done (2026-10-26)               |
| v2 spec                                                       | 📝 Draft, awaiting Adrien's review |
| CPU test (spec §13 step 0): fits, with a hand-written sign-in | ✅ Done (2026-10-26)               |
| Mockups: form, `/espace`, profile with new fields, `/admin`   | ✅ Approved (2026-10-30)           |
| Live-site fixes: 200 % word breaks, ×1.4 portrait, underlines | ⏳ Not started                     |
| Implementation plan                                           | ⏳ Not started                     |
| Build, migration of the 6 profiles to D1, invitations         | ⏳ Not started                     |
