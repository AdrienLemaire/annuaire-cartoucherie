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

- Accounts for entrepreneurs: magic link by email
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
- Passkeys: after v2. Verifying one is the heaviest step of sign-in (§5), and the magic link
  is enough to start.
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
entrepreneur ─▶ /espace, /admin (static pages) ─▶ /api/* ─▶ Worker (JSON only) ─▶ D1 (profiles, photos, auth)
                                                │
                       approved edit or approval │ workflow_dispatch
                                                ▼
                     GitHub Actions « content deploy »: export D1 ─▶ CONTENT_DIR ─▶ build ─▶ assets
visitor ─▶ every public page ──▶ static assets (unchanged, free, no Worker invoked)
```

- **The Worker answers JSON, nothing else.** Workers Free allows 10 ms of CPU per request and
  stops a Worker that keeps exceeding it. Time spent waiting on D1, Brevo or the geocoder does
  not count; rendering, crypto and a large bundle's startup do. So:
  - `/espace` and `/admin` are prerendered pages like the rest of the site: served as assets,
    no Worker CPU. They fetch and send JSON.
  - The Worker is a small hand-written module, not Astro's server mode: sign-in, sessions,
    save a step, store an image, proxy the geocoder, list and act on the queue.
  - `wrangler.toml` gains `main` and `run_worker_first = ["/api/*"]`, because
    `not_found_handling = "404-page"` would otherwise answer unknown paths before the Worker.
    Every other path stays a pure asset request (v1 §5).
  - Images are re-encoded on the phone (§6). The Worker only checks type and size and stores
    the bytes.
  - **Budget: 5 ms of CPU per request**, half the limit, measured on staging (§13 step 0).
- **The build keeps its shape.** A new `export-content` step reads approved profiles, photos and
  slides from D1 and writes them in the layout `CONTENT_DIR` has today. `sync-content` and every
  page stay unchanged. The private repository is archived once the export is proven.
- **Preview runs in the browser.** The form draws the card and profile header from the draft,
  with the same markup the public components emit. A test renders the fixture profiles both
  ways and compares the text, so the preview cannot drift from the public page.
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
  - 200 profiles with their slides stay around 100 MB, under the free plan's 500 MB per
    database.
- **Better Auth tables**: user, session, account, verification, passkey. Plus a `role` column
  on user.

Why D1 rather than R2: R2 is reported (third-party guides, to confirm on Cloudflare's billing
pages) to ask for a payment card and bill past its free tier, which breaks
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
  - Triggered by the Worker through `workflow_dispatch`, with a fine-grained token holding only
    Actions: write on this repository. Not `repository_dispatch`, which needs Contents: write:
    a token able to push code must never sit in the Worker.
  - **Builds the code last approved, not `main`'s head.** Between a merge and Adrien's approval,
    or after he rejects a deploy, `main` holds unapproved code. The gated deploy records the SHA
    it deployed (a moved `deployed/production` tag), and the content deploy checks out that tag
    when the job starts.
  - Exports D1, builds, runs the content checks (`budgets`, `contenu.spec.ts`), deploys, and runs
    the smoke test.
  - **One `concurrency` group shared with the gated deploy**, without `cancel-in-progress`: one
    deploy runs and at most one waits. A burst of saves coalesces, a running `wrangler deploy` is
    never killed, and a content deploy built from older code can never finish after a code
    deploy and roll it back.
  - **Both deploys export from D1** once migrated. A code deploy that still read the archived
    private repository would wipe every member edit.
  - A failed content deploy emails Adrien. The member's edit stays saved and goes out with the
    next successful deploy.
- **Every save is validated with the build's own `memberSchema`** in the Worker, plus the map
  bounds, so D1 can never hold a row the build would reject. One bad row would otherwise stop
  every deploy, code included, for everyone.
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

v1 spec §7 holds, except passkeys, which wait until after v2: magic link via Brevo, no social
sign-in. What v2 adds:

- **Cheap by design** (§5's 5 ms budget):
  - No password, so no password hashing, the usual cause of CPU overruns.
  - A magic link is one random token and a D1 write.
  - Sessions are random tokens looked up in D1 on each request: waiting time, not CPU. No
    signed token to verify.
  - Better Auth stays the choice if step 0 measures it inside the budget. Otherwise, a
    hand-written magic link: a token table and a session table.

- **Who signs in.** Entrepreneurs and Adrien only. The sign-in link appears in the footer and on
  a new « Vous êtes entrepreneur du quartier ? » call to action on `/a-propos`, never in the
  visitor's path.
- **Cookies.** The session cookie is strictly necessary, so the CNIL exempts it from consent. It
  is set only on `/api` responses, scoped to `Path=/api`. Public pages stay cookie-free, and the
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
- The page is an empty static shell. Every `/api/admin/*` call checks the `admin` role in the
  Worker, so guessing the URL shows nothing.

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

0. **Before anything else: measure CPU on staging.** A throwaway Worker on
   `staging.cartoucherie.fyi`, with D1 and Better Auth: request a magic link, sign in, save a
   form step, upload a 768 px portrait, list a queue. Read each request's CPU time in Workers
   Logs. Each must stay under 5 ms. Over budget: replace Better Auth with the hand-written
   version, or redesign that one request. Workers Paid ($5/month, 30 s of CPU, uncapped
   overage) only if both fail, and only with Adrien's agreement, since it breaks v1 §3.

1. Create the production and staging D1 databases. Staging gets the fictional fixture only.
2. Import `cartoucherie-donnees`: the 6 profiles as `published` with no owner, their portraits,
   and their slides with alt text. Each profile's `adresse` is geocoded again, and `distance`
   is computed.
3. Prove that a build from the export renders the same pages as a build from the private
   repository: same URLs, and identical text on every profile.
4. Switch both deploy workflows, gated and content, to the export, then archive `cartoucherie-donnees` (read-only, kept as a backup).
5. Invite the 6 owners by email. The invitation also serves as the GDPR art. 14 notice they are
   owed for data collected indirectly. Adrien links each account once they sign in.

## 14. Testing

- Units: phone, URL, Instagram, LinkedIn and Google-link normalisation; slug freezing; the
  export's filtering of non-published rows.
- Playwright, the second core flow from v1 §11, now: **sign in → fill in the form → submit →
  Adrien approves → the profile is public**. Runs against a local D1, with the magic link read
  from a test-only mail sink.
- The preview against the public page: the fixture profiles rendered both ways, same text.
- CPU: step 0's measurements repeated on staging before launch, every request under 5 ms.
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
- To verify in the plan:
  - **Image export.** Check how the D1 HTTP API returns image bytes (likely JSON number arrays,
    several times larger). Store them base64 or export in batches if needed.
  - **Turnstile** renders an iframe: its two pages also need `frame-src challenges.cloudflare.com`.
  - **Dispatch token.** Confirm on GitHub's docs that `workflow_dispatch` needs only Actions: write.
