# Annuaire de la Cartoucherie — Design v2: self-service profiles

Date: 2026-10-26
Status: draft for Adrien's review. Status of every version: `docs/ROADMAP.md`.

Builds on the v1 spec (`2026-08-29-annuaire-cartoucherie-design.md`), whose purpose, cost
rule (§3), language and member-data rules still hold. This document only says what v2 adds or
changes. The field-by-field list lives in `2026-10-26-v2-profile-fields.md` and is not repeated
here.

## 1. Goal

An entrepreneur of the quartier creates an account, fills in their own profile on a phone, and
appears in the directory once Adrien has approved it. After that they keep it up to date
themselves. The directory grows without anyone transcribing profiles by hand.

The visitor's experience does not change: the public site stays static, cookie-free and fast.

## 2. Scope

### In v2

- Accounts for entrepreneurs: magic link by email, passkeys as an upgrade
- A step-by-step profile form with a live preview (`/espace`)
- An approval queue for new profiles, and editing that goes live directly once approved
- « Supprimer ma fiche »
- `/admin` for Adrien: approve or refuse with a reason, hide a profile, link a seeded profile
  to its owner, upload the association's carousel slides
- Five new optional fields: business name, prices, opening hours, booking link, languages
- Moving every profile, photo and slide from `cartoucherie-donnees` into D1
- A content-only production deploy, so member edits do not wait for a code review

### Not in v2

- **Claiming a profile.** Adrien links the 6 seeded profiles to their owners by hand in
  `/admin`, once those owners have an account.
- Resident accounts, reviews, synced favourites: after v2 (`docs/ROADMAP.md`).
- Social sign-in (v1 spec §7 still applies).
- Payments, events, messaging.

## 3. Decisions taken (2026-10-26)

| Decision                     | Choice                                              |
| ---------------------------- | --------------------------------------------------- |
| New profile                  | Waits for Adrien's approval (`pending`)             |
| Edits to an approved profile | Live directly, through the content-only deploy (§7) |
| Contact                      | At least one of phone or email                      |
| Categories                   | 1 or 2                                              |
| Services                     | 1 to 6                                              |
| Carousel                     | The association's; uploaded by Adrien in `/admin`   |
| Prices, hours                | Short free text                                     |
| Data controller              | Adrien                                              |
| Photos and slides            | Stored in D1, not R2 (§6)                           |
| Staging                      | Its own D1, fictional data only                     |
| Mockups                      | Approved before implementation, as in v1 (§12)      |

## 4. Who uses it

- **Entrepreneur**: creates one profile, edits it, deletes it. Likely on a phone, possibly
  older, possibly unsure of web forms. Each screen asks one thing; drafts save after every step,
  so leaving halfway and coming back through the magic link loses nothing.
- **Adrien** (role `admin`): approves, refuses, hides, links owners, uploads slides.
- **Visitor**: unchanged. Never sees a sign-in prompt.

## 5. Architecture

```
entrepreneur ─▶ /espace, /api/*  ──▶  Worker (Astro, on demand)  ──▶  D1 (profiles, photos, auth)
                                                │
                       approved edit or approval │ repository_dispatch
                                                ▼
                     GitHub Actions « content deploy »: export D1 ─▶ CONTENT_DIR ─▶ build ─▶ assets
visitor ─▶ every public page ──▶ static assets (unchanged, free, no Worker invoked)
```

- **Astro gains the Cloudflare adapter.** Public pages stay prerendered. Only `/espace/*`,
  `/admin/*` and `/api/*` set `prerender = false` and run in the Worker. These are
  authenticated, low-traffic routes, so the v1 rule that browsing must stay in the free static
  tier (v1 §5) holds. **To verify in the plan:** a prerendered page is served as an asset
  without invoking the Worker.
- **The build keeps its shape.** A new `export-content` step reads approved profiles, photos and
  slides from D1 and writes them in the layout `CONTENT_DIR` has today. `sync-content` and every
  page stay unchanged. The private repository is archived once the export is proven.
- **Preview renders the real components.** The editor's preview is server-rendered by the Worker
  from the draft with the same `MemberCard` and profile components, so it cannot drift from the
  public page.
- **Headers.** `public/_headers` does not apply to Worker responses. Dynamic routes set the same
  CSP, HSTS and nosniff headers in middleware, plus `Cache-Control: no-store`.
- **Service worker.** It never caches `/espace`, `/admin` or `/api`.

## 6. Data model (D1, Drizzle)

- **`profiles`**
  - Every field of today's `Member` schema, plus the five new ones (fields doc §1).
  - `status`: `draft` | `pending` | `published` | `refused` | `hidden`.
  - `refusal_reason`, `owner_user_id` (nullable for seeded profiles until linked).
  - `slug`, frozen at first publication.
  - `created_at`, `updated_at`, `published_at`.
  - `consents`: terms version and date, photo authorisation, rights attestation, 18+.
- **`profile_categories`**: 1–2 rows per profile, checked against `categories.json`.
- **`images`**
  - `profile_id`, `kind` (`portrait` | `slide`), `position`, `alt` (slides), the JPEG bytes.
  - Re-encoded on the phone before upload: portrait ~768 px, slide 1080 px wide. Each well under
    D1's 2 MB value limit.
  - 200 profiles with their slides stay around 100 MB of the free 5 GB.
- **Better Auth tables**: user, session, account, verification, passkey. Plus a `role` column
  on user.

Why D1 rather than R2: R2 asks for a payment card and bills past its free tier, which breaks
v1 §3's « stop, never bill » rule. D1 on the free plan stops at its limits. One store instead of
two. v1 §4's R2 line is superseded.

`distance`, `lat` and `lng` are computed (fields doc §2), never typed. `note` and `nbAvis` stay
at 0 until reviews exist.

## 7. Publishing

- **Approval.** Submitting moves a profile to `pending`. Adrien gets an email. In `/admin` he
  approves, which publishes it, or refuses with a written reason, which is emailed to the member
  (DSA art. 17). A refused profile can be corrected and resubmitted.
- **Later edits** to a `published` profile save straight to D1 and trigger a content deploy. The
  owner sees the result in `/espace` immediately; the public page follows when the deploy ends.
- **Content deploy** (new workflow, environment `production-content`, no reviewer):
  - Triggered by the Worker through `repository_dispatch`, with a fine-grained token limited to
    that one action on this repository.
  - Checks out `main` exactly as last approved, exports D1, builds, runs the content checks
    (`budgets`, `contenu.spec.ts`), deploys, and runs the smoke test.
  - A `concurrency` group without `cancel-in-progress`: one deploy runs, at most one waits, so
    a burst of saves coalesces into two deploys and a running `wrangler deploy` is never killed.
  - Code still reaches production only through the gated deploy.
- **The export never ships unapproved data.** Only `published` profiles are exported. Rows are
  never printed in CI logs (the repository is public), and errors name a row number only, as
  `sync-content` does today. The D1 API token is read-only.
- **Hiding and deleting.** `hidden` (Adrien) and « Supprimer ma fiche » (the owner) both remove
  the profile from the next export at once. Deletion then erases the profile and its images.
  † Whether a minimal identification record must be kept for a year (LCEN, décret 2021-1362)
  is checked before launch.
- **Slugs.** Frozen at first publication. Changing a name never moves the URL, because printed
  QR codes carry it.

## 8. Authentication

v1 spec §7 holds: magic link via Brevo, passkeys offered after the first sign-in, no social
sign-in. What v2 adds:

- **Who signs in.** Entrepreneurs and Adrien only. The sign-in link appears in the footer and on
  a new « Vous êtes entrepreneur du quartier ? » call to action on `/a-propos`, never in the
  visitor's path.
- **Cookies.** The session cookie is strictly necessary, so the CNIL exempts it from consent. It
  is set only on `/espace`, `/admin` and `/api` responses. Public pages stay cookie-free, and the
  existing assertion keeps checking them.
- **Turnstile** guards the sign-in email and the submission. It is the only third-party script
  allowed. `npm run guard` and the CSP admit `challenges.cloudflare.com` on those two pages only.
- **Email.** SPF and DKIM on `cartoucherie.fyi`. Brevo's 300 emails a day are enough: one
  link per sign-in, plus approval and refusal notices.

## 9. The form (`/espace`)

One topic per screen, a check-answers page, then « Envoyer ma fiche » (« Enregistrer » once
published). Steps, questions, validation and normalisation: fields doc §1–§3.

What this spec adds:

- **Preview** of the card and the profile header beside each text step, and of the whole page on
  the check-answers screen. It shows the agreed French, the normalised phone number and the
  photo crop.
- **Address**
  - Géoplateforme typeahead, called through the Worker so the CSP stays first-party.
  - A point outside `MAP_BOUNDS` is saved without a pin and flagged in `/admin`. It never reaches
    the build, where it would stop the whole deploy.
- **Google listing**
  - Asked as « Votre fiche Google (pour vos avis) ».
  - « Je n'en ai pas » shows one sentence on why it helps and a link to create a Google Business
    Profile.
  - `/espace` keeps a dismissable reminder until a link is pasted.
- **Consents** on the last step: the short GDPR notice linked to `/confidentialite`; the photo
  authorisation and the rights attestation as separate checkboxes; « J'ai 18 ans ou plus ».

## 10. `/admin`

- **Queue**: pending profiles, oldest first, each shown in full preview. Approve, or refuse with a
  reason.
- **Flags**: out-of-area address, « aucune catégorie ne convient » notes, possible duplicates
  (same phone or similar name).
- **Profiles**: search, hide or unhide, link an owner by email, upload and order carousel
  slides with their alt text.
- Role-gated in the Worker. No other user can reach it, even by guessing the URL.

## 11. Changes to v1 pages

- **Profile page**
  - Business name beside the job title.
  - « Tarifs » and « Horaires » lines, the booking link as a button, and « Parle aussi : … ».
  - Placement decided by the mockups (§12).
- **`surCarte: false`** must also leave out `data-lat` and `data-lng` from `/carte`'s HTML.
  Today the coordinates stay in the page.
- **`/confidentialite`** rewritten: account data, the art. 13 notice, retention (inactive
  accounts deleted after 2 years, after a warning), and the right to delete.
- **`/mentions-legales`**: corrections no longer go only « sur simple demande ».
- **Schema hardening** (fields doc §5): categories checked against `categories.json`, non-empty
  services, `site` and `instagram` validated, `firstName()` no longer guessed from `nom`.

## 12. Mockups before code

As in v1, HTML mockups in `docs/mockups/` and approved by Adrien before implementation:

1. The form, on a 360 px phone: every step, errors, the photo crop, check-answers
2. `/espace` once published: the preview, the Google reminder, « Supprimer ma fiche »
3. The profile page with the five new fields, filled and empty
4. `/admin`: queue, refusal, profile list with slides

New components go into `styleguide.html` first.

## 13. Migration

1. Create the production and staging D1 databases. Staging gets the fictional fixture only.
2. Import `cartoucherie-donnees`: the 6 profiles as `published` with no owner, their portraits,
   and their slides with alt text. Each profile's `adresse` is geocoded again, and `distance`
   is computed.
3. Prove that a build from the export renders the same pages as a build from the private
   repository: same URLs, and identical text on every profile.
4. Switch CI to the export, then archive `cartoucherie-donnees` (read-only, kept as a backup).
5. Invite the 6 owners by email. The invitation also serves as the GDPR art. 14 notice they are
   owed for data collected indirectly. Adrien links each account once they sign in.

## 14. Testing

- Units: phone, URL, Instagram, LinkedIn and Google-link normalisation; slug freezing; the
  export's filtering of non-published rows.
- Playwright, the second core flow from v1 §11, now: **sign in → fill in the form → submit →
  Adrien approves → the profile is public**. Runs against a local D1, with the magic link read
  from a test-only mail sink.
- The existing public-page tests run unchanged against the exported content. Zero cookies on
  public pages stays asserted.

## 15. Definition of done (v2)

- An entrepreneur unknown to the site creates a profile on a phone, and it is public within
  minutes of Adrien's approval, with no code deploy.
- An owner's later edit is public without Adrien doing anything.
- The 6 seeded profiles are served from D1 with no visible change, and their owners are
  invited.
- Public pages: still no cookie, same Lighthouse thresholds, same budgets.
- `/confidentialite` and the consent records are in place, and the † retention question is
  answered.
- Nothing about a real person in the public repository or in a public CI log.

## 16. Open items

- † LCEN retention of an identification record after deletion: check décret 2021-1362 on
  Légifrance.
- Confirm on a real phone where a Google Maps share link redirects.
- Decide whether LinkedIn handles with accents are decoded or the rule is widened.
- The DSFR form patterns could not be read (403): review them by hand before the form mockups.
