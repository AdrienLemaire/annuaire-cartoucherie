# Annuaire de la Cartoucherie — Plan 3: accounts, the form and publishing

**Status: ready, not started. Starts when Plan 2 is in production.** Progress lives in `docs/ROADMAP.md`.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** An entrepreneur creates an account, fills in their profile on a phone and appears in the directory once Adrien approves it; their later edits go live on their own. The 6 existing profiles move to D1 with no visible change. Visitors see nothing new: the public site stays static, cookie-free and fast.

**Architecture:** v2 spec §5. Public pages and the two app shells (`/espace`, `/admin`) are static assets. A small hand-written Worker answers `/api/*` with JSON only, over D1. A content-only GitHub workflow exports D1 to the content directory Plan 2 defined and deploys the last approved code with it.

```
entrepreneur ─▶ /espace, /admin (static shells) ─▶ /api/* ─▶ worker/ (JSON) ─▶ D1
                                                     │
                       save, approval, deletion      │ workflow_dispatch (Actions: write only)
                                                     ▼
                    content-deploy.yml: checkout deployed/<env> ─▶ export D1 ─▶ build ─▶ deploy
visitor ─▶ every public page ─▶ static assets (no Worker invoked)
```

**Tech stack:** Plan 2's, plus: Cloudflare D1, Workers (`main` script beside the existing assets), Brevo transactional e-mail, Cloudflare Turnstile. No auth library, no ORM, no router library, no front-end framework (v2 spec §6, §8 and the CPU measurements in §13 step 0).

**Specs:** v2 spec and fields doc as Plan 2. **Mockups (binding):** `docs/mockups/v2/formulaire.html`, `espace.html`, `admin.html`; styleguide blocks `b-v2-*`.

---

## Global constraints

Plan 2's Global constraints hold, plus:

### CPU: 5 ms per request

Workers Free stops a Worker that keeps exceeding 10 ms of CPU; the budget is half that (v2 spec §5). Waiting on D1, Brevo, Turnstile or the geocoder does not count. So, in `worker/`:

- No dependency beyond `zod` and the pure modules of `src/lib` and `src/content/schemas.ts`. Each new import is measured (Task 22) before it ships.
- No image work: the phone re-encodes; the Worker checks type and size and stores the base64 string untouched.
- No HTML rendering. JSON in, JSON out.

### Security

- **Every mutating route** is `POST` (or `PUT`/`DELETE`), requires `Content-Type: application/json`, and rejects a request whose `Origin` is not the site's own. `SameSite=Lax` alone does not stop a same-site form post. One function in `worker/http.ts`, applied by the router, not per route.
- **The session cookie** is `__Host-`-free on purpose (it must be scoped to `Path=/api`): `session=<token>; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=2592000`. Stored as its SHA-256; the raw token exists only in the cookie.
- **Magic links survive mail scanners.** Outlook and some French providers fetch links in e-mails before the person clicks. Opening the link must not consume the token: the link lands on the static page `/espace/connexion?jeton=…`, which POSTs the token. Only that POST consumes it.
- **Every `/api/admin/*` route** checks `role = 'admin'` in the Worker. `/admin` is an empty shell; guessing the URL shows nothing.
- **Never in a log, public or not:** a member's row, an e-mail address, a token, a phone number. Errors name a row number or an id.
- **Secrets** (Brevo key, Turnstile secret, GitHub dispatch token, D1 API token for CI) live in Wrangler secrets and GitHub Environment secrets, never in `wrangler.toml` or the repository.

### Two environments, two databases

Production and staging each get their own D1 (v2 spec §3: staging holds fictional data only). After the migration (Task 20), staging no longer shows the real neighbours: see « Open questions ».

### Tests

Decisions owed a test, listed up front:

| Decision                                                                           | Task |
| ---------------------------------------------------------------------------------- | ---- |
| A sign-in token works once, within 15 minutes, and only for its own e-mail         | 4    |
| A cross-site or non-JSON request cannot change anything                            | 2    |
| A draft is saved per step, but only a complete profile can be submitted            | 7    |
| Phone, site, Instagram, LinkedIn and Google links normalise as the fields doc says | 7    |
| The geocoder's answer is accepted only as a house number in 31300 with score ≥ 0.7 | 9    |
| A point outside `MAP_BOUNDS` is saved without a pin and flagged, never exported    | 9    |
| A slug is frozen at first publication                                              | 13   |
| Approving a profile leaves its unreviewed places pending                           | 14   |
| The export ships only published profiles and approved places                       | 16   |
| The form's preview says what the public page will say                              | 11   |
| The second core flow: sign in → fill in → submit → approve → public                | 23   |

Worker logic that holds a decision is a pure function in `worker/` tested with Vitest in Node (Node 24 has `crypto.subtle`). Routes are exercised end to end by Playwright against `wrangler dev` (Task 5). No Workers test pool is added.

---

## File structure

```
wrangler.toml                 CHANGED  main, run_worker_first, d1_databases per env, vars
migrations/
  0001_init.sql               NEW      the whole v2 schema (Task 3)
worker/
  index.ts                    NEW      the router: method + path → handler, security wrapper
  http.ts                     NEW      json(), error(), headers, the mutating-request guard
  session.ts                  NEW      token generation and hashing, cookie, current user
  sign-in.ts                  NEW      request a link, open a link, sign out
  mail.ts                     NEW      Brevo, or the dev outbox when DEV_OUTBOX=1
  turnstile.ts                NEW      siteverify
  profile.ts                  NEW      the owner's draft: read, save a step, submit, delete
  images.ts                   NEW      store and serve portrait, slide and story images
  geocode.ts                  NEW      Géoplateforme proxy and the acceptance rule
  places.ts                   NEW      member-placed places: create; admin: review
  admin.ts                    NEW      queue, approve, refuse, hide, link owner, slides, flags
  dispatch.ts                 NEW      workflow_dispatch of the content deploy
  google-link.ts              NEW      resolves a maps.app.goo.gl share link (needs the network)
  tsconfig.json               NEW      Workers types from `wrangler types`
src/
  content/schemas.ts          CHANGED  memberInputSchema and the step schemas, derived
  lib/plan.ts                 CHANGED  pixelToLatLng (Placer sur la carte)
  lib/copy.ts                 CHANGED  form, espace and admin strings
  client/
    api.ts                    NEW      fetch wrapper: JSON, errors, the session-expired path
    espace/                   NEW      the form: steps, preview, crop, places picker, story
    admin/                    NEW      queue, review, places, profiles
    preview.ts                NEW      card and header from a draft; slideTree → DOM
  pages/
    espace/index.astro        NEW      the member space shell (steps routed client-side)
    espace/connexion.astro    NEW      sign-in, and the landing page of the magic link
    admin.astro               NEW      the admin shell
    lieux.json.ts             NEW      places for the typeahead (public data, emitted at build)
    version.json.ts           NEW      { exportedAt } — tells /espace whether an edit is live
    confidentialite.astro     CHANGED  accounts, art. 13 notice, retention, right to delete
    mentions-legales.astro    CHANGED  corrections no longer only « sur simple demande »
    a-propos.astro            CHANGED  « Vous êtes entrepreneur du quartier ? »
  components/SiteFooter.astro CHANGED  « Espace entrepreneur »
public/_headers               CHANGED  CSP for the two Turnstile pages; no-store on app shells
public/sw.js                  CHANGED  never caches /espace, /admin, /api
scripts/
  export-content.mjs          NEW      D1 → CONTENT_DIR layout (published, approved only)
  import-content.mjs          NEW      one-off: the private repository → D1 (Task 20)
.github/workflows/
  ci.yml                      CHANGED  deploy exports from D1; moves deployed/<env>; shared concurrency
  content-deploy.yml          NEW      workflow_dispatch; last approved code + fresh content
tests/
  unit/                       session, normalise, geocode, export, input schemas
  e2e/v2/                     sign-in, form, admin, the second core flow (against wrangler dev)
```

---

## Phase 2 — The Worker and its database

### Task 1: Prerequisites Adrien sets up

Not code. Each item is a click-path or a command for Adrien; the agent prepares the exact values and waits.

- [ ] D1: `npx wrangler d1 create cartoucherie` and `npx wrangler d1 create cartoucherie-staging`; paste the two `database_id`s.
- [ ] Turnstile: one widget, hostnames `www.cartoucherie.fyi`, `staging.cartoucherie.fyi`, `localhost`; site key and secret.
- [ ] Brevo: account under the association's or Adrien's name, sender `annuaire@cartoucherie.fyi`, API key; SPF and DKIM records added to `cartoucherie.fyi` in Cloudflare DNS, verified in Brevo.
- [ ] GitHub: a fine-grained token on this repository only, permission **Actions: read and write**, nothing else; a read-only Cloudflare API token for D1 (CI export).
- [ ] Secrets, per environment: Worker (`wrangler secret put` …): `BREVO_API_KEY`, `TURNSTILE_SECRET`, `GITHUB_DISPATCH_TOKEN`. GitHub Environments `production` and `staging`: `D1_READ_TOKEN`, and the vars `D1_DATABASE_ID`, `TURNSTILE_SITE_KEY`.
- [ ] The answer to the LCEN question (v2 spec §16 †) before launch, not before coding.

### Task 2: The Worker skeleton and its guard

**Shape:** TDD for the guard; Verify for the wiring.

**Files:** `wrangler.toml`, `worker/index.ts`, `worker/http.ts`, `worker/tsconfig.json`, `package.json` (`cf-typegen`), `eslint.config.js` (a `worker/**` block: no `astro:*`, no DOM), `tests/unit/http.test.ts`. `npm run lint` gains `tsc -p worker`: the root `tsc --noEmit` does not type-check `worker/`.

- [ ] **Step 1: `wrangler.toml`:** `main = "worker/index.ts"`; `[assets] run_worker_first = ["/api/*"]` (F1; no `binding`: the Worker never serves assets itself); `[[d1_databases]] binding = "DB"` and `[vars] SITE_URL`, `ENVIRONMENT` at top level **and again under `[env.staging]`** (F2: neither is inherited). Every comment in the file stays.
- [ ] **Step 2: Failing tests** for `guardMutation(request, siteUrl)`: a `POST` with `Origin` = site and JSON content type passes; a missing or foreign `Origin` fails 403; `text/plain` or form-encoded fails 415; `GET` passes unguarded.
- [ ] **Step 3: Implement** `http.ts`: `json(data, status)`, `error(code, status)` (codes are English identifiers; the client maps them to French copy), the guard, and the response headers every `/api` reply carries: the site's CSP, HSTS, `nosniff`, `Cache-Control: no-store` (F3: `_headers` does not apply to Worker responses).
- [ ] **Step 4:** `index.ts`: a table of `[method, path, handler, { auth: "none" | "member" | "admin" }]`, the guard and the auth check applied by the router, `GET /api/health` → `{ ok: true }`. Anything else under `/api` → 404 JSON.
- [ ] **Step 5: Verify:** `npm run build && npx wrangler dev` serves `/` (asset) and `/api/health` (Worker); `curl -sI localhost:8787/` shows the `_headers` CSP, `/api/health` the Worker's; `/annuaire` still 200, `/nope` the 404 page.
- [ ] **Step 6: Commit** `feat: add the API Worker skeleton`.

### Task 3: The D1 schema

**Shape:** Verify. The SQL below is the v2 spec §6 model; CHECK constraints are the database's half of the schema (the Worker's Zod is the other).

**Files:** `migrations/0001_init.sql`.

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_seen_at TEXT
);
CREATE TABLE sign_in_tokens (
  hash TEXT PRIMARY KEY,
  email TEXT NOT NULL COLLATE NOCASE,
  expires_at TEXT NOT NULL,
  used_at TEXT
);
CREATE INDEX sign_in_tokens_email ON sign_in_tokens (email, expires_at);
CREATE TABLE sessions (
  hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL
);
CREATE TABLE profiles (
  id TEXT PRIMARY KEY,
  owner_user_id TEXT UNIQUE REFERENCES users (id) ON DELETE SET NULL,
  slug TEXT UNIQUE,                       -- frozen once published_at is set
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'pending', 'published', 'refused', 'hidden')),
  data TEXT NOT NULL DEFAULT '{}',        -- memberInputSchema JSON, validated by the Worker
  refusal_reason TEXT,
  hidden_reason TEXT,
  flags TEXT NOT NULL DEFAULT '[]',       -- out_of_area, no_category, possible_duplicate
  consents TEXT,                          -- terms version and date, photo, rights, 18+
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  submitted_at TEXT,
  published_at TEXT
);
CREATE INDEX profiles_status ON profiles (status, submitted_at);
CREATE TABLE images (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('portrait', 'slide', 'story')),
  position INTEGER NOT NULL DEFAULT 0,
  story_key TEXT,                         -- for kind = 'story': pourquoi, declic…
  alt TEXT,                               -- for kind = 'slide'
  jpeg_base64 TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX images_profile ON images (profile_id, kind, position);
CREATE TABLE places (
  id TEXT PRIMARY KEY,                    -- osm-… for the snapshot, member-… otherwise
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('cafe', 'restaurant', 'parc', 'boutique', 'sport', 'culture', 'autre')),
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('osm', 'member')),
  owner_profile_id TEXT REFERENCES profiles (id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('approved', 'pending', 'refused')),
  refusal_reason TEXT,
  created_by_profile_id TEXT REFERENCES profiles (id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE profile_places (
  profile_id TEXT NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  place_id TEXT NOT NULL REFERENCES places (id) ON DELETE CASCADE, -- D1 enforces foreign keys
  position INTEGER NOT NULL,
  why TEXT CHECK (why IS NULL OR length(why) <= 80),
  PRIMARY KEY (profile_id, place_id)
);
```

Why the profile is one JSON column rather than one column per field: every field is validated by the same `memberInputSchema` the build uses, the form saves one step at a time, and the export writes JSON. Columns would restate the schema in SQL and drift from it. Story answers live in `data.histoire`, as in `memberSchema`; their photos in `images`. OSM places **are** copied into D1: a second migration, `0002_osm_places.sql`, generated from `src/content/places-osm.json` by a script, inserts them as `source = 'osm'`, `status = 'approved'`. D1 enforces foreign keys, so a favourite must point at a real row; it also gives « merge into an existing place » a target. When the snapshot is regenerated, the next generated migration upserts it.

- [ ] **Step 1:** Write the migration. `npx wrangler d1 migrations apply DB --local`.
- [ ] **Step 1b: Remote migrations in the deploy.** The gated deploy runs `wrangler d1 migrations apply DB --remote` (with `--env staging` on staging) before `wrangler deploy`; the deploy token gains D1 Edit. Rule for every later migration: **backward-compatible with the Worker already running** (add columns and tables; never rename or drop in the same release), because the migration lands a minute before the new Worker does.
- [ ] **Step 2: Verify:** `npx wrangler d1 execute DB --local --command "SELECT name FROM sqlite_master WHERE type='table'"` lists the seven tables; inserting a profile with `status = 'live'` fails.
- [ ] **Step 3: Commit** `feat: add the v2 database schema`.

### Task 4: Sign-in by magic link

**Shape:** TDD for the token rules; e2e in Task 5.

**Files:** `worker/session.ts`, `worker/sign-in.ts`, `worker/mail.ts`, `worker/turnstile.ts`, `src/pages/espace/connexion.astro`, `src/client/espace/connexion.ts`, `tests/unit/session.test.ts`.

**Authority:** styleguide `b-v2-connexion` (four states) and `b-v2-turnstile`; `formulaire.html` sign-in frames.

The measured design (v2 spec §8, §13 step 0): a 32-byte random token, stored as its SHA-256, valid 15 minutes, exchanged once for a 30-day session.

- [ ] **Step 1: Failing tests**, pure functions with an injected clock:
  - `newToken()` returns 43 base64url characters; `hashToken` is SHA-256 hex.
  - `canConsume(row, email, now)`: false when `used_at` is set, when `now > expires_at`, or when the e-mail differs; true otherwise. The 15-minute boundary is tested at 14:59 and 15:01.
  - `sessionCookie(token)` and `clearedCookie()` produce the exact header strings in Global constraints.
- [ ] **Step 2: Implement** `session.ts` with `crypto.getRandomValues` and `crypto.subtle.digest` (F9).
- [ ] **Step 3: Routes** in `sign-in.ts`:
  - `POST /api/sign-in` `{ email, turnstile }`: verify Turnstile; at most 3 links per e-mail per 15 minutes (count rows in `sign_in_tokens`); insert the hash; send the link `SITE_URL/espace/connexion?jeton=<token>`. **Always answers 200 `{ sent: true }`**, so the form never reveals whether an address has an account.
  - `POST /api/session` `{ token }`: consume (`UPDATE … SET used_at = now WHERE hash = ? AND used_at IS NULL` and check one row changed — atomic single use); create the user on first sign-in; insert a session; set the cookie.
  - `DELETE /api/session`: delete the session, clear the cookie.
  - `GET /api/me`: `{ email, role, profile: { status } | null }` or 401.
- [ ] **Step 4: `mail.ts`:** `send({ to, subject, text })` through Brevo (`POST https://api.brevo.com/v3/smtp/email`, header `api-key`; F10). When `env.DEV_OUTBOX === "1"` (set only in `.dev.vars`, git-ignored), it inserts into a `dev_outbox` table created by a dev-only migration instead, and `GET /api/dev/outbox` returns the last message. The route does not exist unless `DEV_OUTBOX` is `"1"`; the deployed smoke test asserts 404 on it.
- [ ] **Step 5: `connexion.astro` + `connexion.ts`:** the four states of `b-v2-connexion`. With `?jeton=`, the page POSTs it immediately, then goes to `/espace` (or `/admin` for an admin); on failure, « Ce lien a expiré » with the e-mail field.
- [ ] **Step 6: Turnstile** loaded on this page only (and the submit step, Task 10), with pre-clearance left off so it sets no cookie (F4). `public/_headers`: two matching rules **join** a header's values with a comma, which the browser enforces as two policies, the stricter winning (F3). So the `/espace*` rule first detaches the global one with `! Content-Security-Policy`, then sets the full policy with `https://challenges.cloudflare.com` added to `script-src` and a `frame-src` of the same origin (F4). Verify with `curl -sI` that `/espace` carries exactly one CSP. `scripts/forbidden.mjs` allows that origin in those two files only. Run `npm run guard`.
- [ ] **Step 7: Green; commit** `feat: sign in by magic link`.

### Task 5: The local test harness

**Shape:** Verify.

**Files:** `playwright.config.ts`, `.dev.vars.example`, `tests/e2e/v2/helpers.ts`, `.gitignore`.

- [ ] **Step 1:** A second Playwright project `v2`, `testDir: "tests/e2e/v2"`, whose web server is `npm run build && npx wrangler d1 migrations apply DB --local && npx wrangler dev --port 8787` with `.dev.vars` providing `DEV_OUTBOX=1`, Turnstile's documented always-pass test keys and a fake dispatch token. The existing projects keep `astro preview`, so v1's specs are untouched.
- [ ] **Step 2: `helpers.ts`:** `signIn(page, email)` — fills the form, reads the link from `/api/dev/outbox`, opens it. `resetDb()` — `wrangler d1 execute --local --file tests/e2e/v2/reset.sql` (fixture-only rows).
- [ ] **Step 3: e2e** `sign-in.spec.ts`: sign in, reload stays signed in, the link a second time shows « Ce lien a expiré », sign out. One spec, the token decision's end-to-end half.
- [ ] **Step 4: CI:** the `browser` job runs both projects; the `v2` project needs no secret.
- [ ] **Step 5: Commit** `test: run the v2 flows against wrangler dev`.

---

## Phase 3 — The form

### Task 5b: The launch switch

Phases 3 and 4 reach production before the export and the migration exist (Phases 5 and 6). Until then, a real entrepreneur must not be able to submit a profile that cannot be published.

**Shape:** Verify.

- [ ] A Worker var `SIGN_UP_OPEN` (`"0"` in production, `"1"` on staging and locally). While `"0"`, `POST /api/sign-in` sends links only to existing `admin` users (still answering `{ sent: true }` to everyone), and the build hides the footer's « Espace entrepreneur » and the `/a-propos` call to action (a build env var of the same name). Flipped to `"1"` in Task 20, Step 5.
- [ ] Commit `feat: keep sign-up closed until publishing works`.

### Task 6: The service worker and the app shells

**Shape:** Verify.

**Files:** `public/sw.js`, `public/_headers`, `src/pages/espace/index.astro`, `src/pages/admin.astro`, `src/components/SiteFooter.astro`, `src/pages/a-propos.astro`, `src/lib/copy.ts`.

- [ ] **Step 1:** `sw.js` returns early for `/espace`, `/admin` and `/api` (v2 spec §5). Bump `CACHE` to `cartoucherie-v2`.
- [ ] **Step 2:** `_headers`: `Cache-Control: no-store` and `X-Robots-Tag: noindex` on `/espace*` and `/admin*`; the shells are excluded from the sitemap.
- [ ] **Step 3:** Shells: `BaseLayout`, the site header, a `<main>` the client fills, a `<noscript>` line. Footer link « Espace entrepreneur » (`b-pied`); `/a-propos` call to action (v2 spec §8).
- [ ] **Step 4: Verify:** `tests/e2e` public specs green and still zero cookies on public pages (existing assertion); Lighthouse unchanged.
- [ ] **Step 5: Commit** `feat: add the member space and admin shells`.

### Task 7: Input schemas and normalisers

The form saves a step at a time, but `memberSchema` describes a finished profile with a slug, a photo and a distance. Writing a second schema by hand would drift from it.

**Shape:** TDD.

**Files:** `src/content/schemas.ts`, `src/lib/phone.ts` (phone), `src/lib/contact.ts` (site, Instagram, LinkedIn), `worker/google-link.ts`, `tests/unit/schemas.test.ts`, `tests/unit/phone.test.ts`, `tests/unit/contact.test.ts`.

The normalisers are pure and live in `src/lib`, so the browser's preview shows the normalised phone (v2 spec §9) with the same code the Worker saves with. Only the Google short-link resolution needs the network and stays in `worker/`.

- [ ] **Step 1: Derive, do not restate:**

```ts
// What a member types. Derived fields (fields doc §2) are the Worker's and the export's.
export const memberInputSchema = memberSchema
  .omit({
    slug: true,
    distance: true,
    lat: true,
    lng: true,
    photo: true,
    note: true,
    nbAvis: true,
    carrousel: true,
  })
  .extend({
    workMode: z.enum(["recoit", "deplace"]),
    zone: z.string().trim().max(120).nullable().default(null),
    precision: z.string().trim().max(80).nullable().default(null),
  });
export const draftSchema = memberInputSchema.partial();
export const STEPS = {
  identite: ["nom", "genre", "metier", "enseigne"],
  categories: ["categories"],
  // … one entry per step of docs/mockups/v2/formulaire.html, in order
} as const satisfies Record<string, (keyof MemberInput)[]>;
export const stepSchema = (step: keyof typeof STEPS) =>
  memberInputSchema.pick(/* STEPS[step] as a mask */);
```

The whole-input rules — at least one of `tel` or `email` (decision 2), `adresse` required when `workMode = "recoit"` — go on a separate `submitSchema = memberInputSchema.superRefine(…)`. Never on the base: Zod 4 refuses `.pick()`/`.partial()` on a refined object, and a step must not fail for a field on another step.

- [ ] **Step 2: Failing tests** (schemas): a step-1 draft with only a name parses as a draft and fails `memberInputSchema`; a complete fixture member, minus its derived fields, passes; neither phone nor e-mail fails with the error on `tel`.
- [ ] **Step 3: Failing tests** (normalise), from fields doc §1: `+33 6 12 34 56 78`, `06.12.34.56.78`, `0612345678` → `06 12 34 56 78`; a foreign number refused; `https://www.Example.fr/` → `example.fr`; `@camille.r`, `instagram.com/camille.r/` → `camille.r`; a LinkedIn URL with `%C3%A9` decodes to « é » and passes the widened rule (v2 spec §16 decision: decode); `maps.app.goo.gl/…` is resolved by the Worker (one `fetch` with `redirect: "manual"`, accept only a `www.google.com/maps` target) — the resolution is tested with a stubbed fetch.
- [ ] **Step 4: Green; commit** `feat: derive the form's input schemas and normalisers`.

### Task 8: Saving the profile

**Shape:** Verify (the decisions are tested in Task 7 and 9).

**Files:** `worker/profile.ts`, `worker/index.ts`.

- [ ] `GET /api/profile` → the owner's profile (`data`, `status`, `flags`, image ids) or `null`.
- [ ] `PUT /api/profile/:step` → parse with `stepSchema(step)`, normalise, merge into `data`, `updated_at = now`. A `published` profile is re-validated whole with `memberInputSchema` before it is saved, then dispatches a content deploy (Task 17). A `pending` profile keeps its place in the queue (decision: `submitted_at` unchanged).
- [ ] `POST /api/profile/submit` `{ turnstile, consents }` → full parse; Turnstile; consents all true (fields doc §4); a suggested slug from `slugify(nom)`, made unique with `-2`, `-3`; `status = 'pending'`, `submitted_at = now`; e-mail Adrien (« Une fiche attend votre relecture », no member data in the e-mail beyond the name).
- [ ] `DELETE /api/profile` `{ confirm: true }` → delete the profile and its images (cascade), keep the account (decision), one-line confirmation e-mail, dispatch a content deploy if it was published.
- [ ] Verify with `curl` against `wrangler dev` for each status transition; commit `feat: save, submit and delete a profile`.

### Task 9: Address and map point

**Shape:** TDD.

**Files:** `worker/geocode.ts`, `src/lib/plan.ts`, `tests/unit/geocode.test.ts`, `tests/unit/plan.test.ts`.

- [ ] **Step 1: Failing tests** for `acceptGeocode(feature)` (pure): accepted only when `type === "housenumber"`, `postcode === "31300"` and `score >= 0.7` (fields doc §2; F11); `inBounds(point)` reuses `MAP_BOUNDS`; an accepted point outside the bounds yields `{ lat, lng, onMap: false }` and the flag `out_of_area`.
- [ ] **Step 2:** `GET /api/adresse?q=` proxies `data.geopf.fr/geocodage/search` (`autocomplete=1`, `limit=5`, `postcode=31300`, `index=address`; F11), returns suggestions with `accepted` per row. Debounced client-side to one request per 300 ms; the Worker passes the answer through, no caching.
- [ ] **Step 3:** On save of the address step, the Worker recomputes `lat`, `lng` (or nulls and flags) and `distance` with `formatDistance(haversine(HALL, point))` — the same functions the build uses.
- [ ] **Step 4: `pixelToLatLng(x, y)`** in `plan.ts`, the inverse of `mercatorPixel`: round-trip test on three points of `MAP_BOUNDS`. Used by « Placer sur la carte ».
- [ ] **Step 5: Green; commit** `feat: geocode addresses and keep out-of-area points off the map`.

### Task 10: The form, step by step

**Shape:** Verify against the storyboard, frame by frame.

**Authority:** `docs/mockups/v2/formulaire.html` (49 frames; its generator in `docs/mockups/v2/scripts/formulaire/` holds the exact markup of each), styleguide `b-v2-champ`, `-choix`, `-genre`, `-services`, `-zone`, `-adresse`, `-photo`, `-etape`, `-actions`, `-relecture`, `-accords`, `-histoire`, `-lieux`, `-turnstile`.

**Files:** `src/client/espace/*.ts`, `src/client/api.ts`, `src/lib/copy.ts`, `src/pages/espace/index.astro`.

- [ ] **Step 1: Routing** in the shell: `?etape=<step>` drives which step renders; Retour and the browser's back button agree. Each step saves on « Continuer » before moving on; « Brouillon enregistré » confirms. A 401 anywhere shows « Session expirée » with the sign-in form, and the draft is never lost (it is already in D1).
- [ ] **Step 2: Required steps 1–9** with « Étape X sur 9 », errors next to their field in words plus an icon, inputs ≥ 16 px, targets ≥ 44 px.
- [ ] **Step 3: Photo** (fields doc §3, `b-v2-photo`): `accept="image/jpeg,image/png,image/webp"`; decode with `createImageBitmap(file, { imageOrientation: "from-image" })`; refuse below 200 px on the short side; square crop with the arch overlay, face in the upper third; draw to a 768 px canvas; `canvas.toBlob("image/jpeg", 0.85)`; base64; `POST /api/images` (`worker/images.ts`: JPEG magic bytes and ≤ 1 MB, else 415/413). The rights and authorisation checkboxes are on the consent step, not here.
- [ ] **Step 4: The end of the required part** (`fin` frame): « Vérifier et envoyer » and « Raconter mon histoire (facultatif) ».
- [ ] **Step 5: Check-answers and consents** (`b-v2-relecture`, `b-v2-accords`): every answer with « Modifier »; the art. 13 notice linked to `/confidentialite`; photo authorisation, rights attestation and « J'ai 18 ans ou plus » as three separate checkboxes; Turnstile; « Envoyer ma fiche ».
- [ ] **Step 6: Verify** every frame of `formulaire.html` at 360 px against `wrangler dev`, at 100 % and 200 %. Run `docs/mockups/v2/scripts/check/formulaire.cjs` adapted to the live URL for the split-word and input-size checks.
- [ ] **Step 7: Commit** per step group: `feat: add the identity and category steps`, … Keep commits small.

### Task 11: The live preview

The form draws the card and the profile header from the draft (v2 spec §5). Astro components do not run in the browser, so the preview is a client renderer that must say what the public page says.

**Shape:** TDD (the parity decision).

**Files:** `src/client/preview.ts`, `tests/e2e/v2/preview.spec.ts`.

- [ ] **Step 1:** `preview.ts` builds the card (`b-carte`) and the profile header (`b-fiche`, `b-v2-pratique`) as DOM from a draft, using the same `src/lib` functions the pages use (`agree`, `formatTelDisplay`, `breakableParts`, `longestWord`, `formatDistance`). It also renders `slideTree` (Plan 2, Task 8) to DOM: elements from `type`, `Object.assign(el.style, props.style)`, children recursively. That is the slide preview of the story steps.
- [ ] **Step 2: Failing e2e test:** for each fixture member, open `/membre/<slug>` and read the visible text of the header and card; load the same member into the preview (a test-only page `/espace?apercu=<slug>` reading `/recherche.json` is not enough — feed the fixture JSON through `page.evaluate`); compare normalised text. Names, agreements, phone, distance, enseigne, tarifs, horaires must match.
- [ ] **Step 3: Green; commit** `feat: preview the profile as the public page shows it`.

### Task 12: « Votre histoire » and « Mes lieux favoris »

**Shape:** Verify.

**Authority:** `formulaire.html` frames 10–15 and `fin`; styleguide `b-v2-histoire`, `b-v2-lieux`, `b-v2-carte-lieux`.

**Files:** `src/client/espace/histoire.ts`, `src/client/espace/lieux.ts`, `src/pages/lieux.json.ts`, `worker/places.ts`.

- [ ] **Step 1:** Story steps: « Votre histoire · k sur 6 », the prompt and hard limit from `STORY_ORDER`, a counter that turns red and blocks « Continuer » past the limit (no `maxlength`, so pasted text is visible and fixable), optional photo (Task 10's crop at 1080 px wide, `kind = 'story'`), the live slide preview, « Passer » and « Terminer plus tard ». Colly never appears in the form (decision 9): the preview of « Les entrepreneurs de la Cartoucherie & moi » omits her and says so in one line.
- [ ] **Step 2:** `lieux.json.ts` emits `{ id, nom, type, owner }` for every approved place (the same collection `/carte` uses). The typeahead filters it client-side with `normalize` (`src/lib/text.ts`), shows type icons, and a voisin's business with their portrait.
- [ ] **Step 3:** 1–5 places, each with an optional « pourquoi » (80); the optional sentence (160) and the slide preview.
- [ ] **Step 4: « Placer sur la carte »:** the `quartier.svg` map; a tap converts to `lat`/`lng` with `pixelToLatLng`; a name (≤ 80) and one of the seven types; `POST /api/places` creates a `member` place with `status = 'pending'`. In the member's list it reads « En attente de vérification ».
- [ ] **Step 5: Verify** frames 10–15 at 360 px, 100 % and 200 %; commit `feat: add the story and favourite places steps`.

### Task 13: The member space once submitted

**Shape:** TDD for slug freezing; Verify for the rest.

**Authority:** `docs/mockups/v2/espace.html` (all frames); styleguide `b-v2-statut`, `b-v2-rappel`, `b-v2-supprimer`.

**Files:** `src/client/espace/espace.ts`, `src/pages/version.json.ts`, `worker/profile.ts`, `tests/unit/profile.test.ts`.

- [ ] **Step 1: Failing test** for `nextSlug(current, nom, publishedAt, taken)`: before publication it follows the name (and stays unique); once `publishedAt` is set it never changes, whatever the name becomes (v2 spec §7: printed QR codes).
- [ ] **Step 2: Status banners:** « En attente de relecture », « Refusée » with the reason and « Corriger et renvoyer », « En ligne », « Mise en ligne en cours… ». The last one: `version.json` (emitted at build: `{ exportedAt }`) is older than the profile's `updated_at`. A failed deploy keeps it showing (decision) and Adrien is e-mailed by the workflow (Task 17).
- [ ] **Step 3:** The edit list with « Votre histoire » and « Mes lieux favoris »; one-step edit screens; the Google reminder until a link is set, dismissable; « Supprimer ma fiche » with `b-v2-supprimer`'s red `.detruire` button and confirmation.
- [ ] **Step 4: Verify** every frame of `espace.html`; commit `feat: add the member space`.

---

## Phase 4 — `/admin`

### Task 14: The approval queue and the places review

**Shape:** TDD for the places decision; Verify for the screens.

**Authority:** `docs/mockups/v2/admin.html` (32 frames, sections 1–7); styleguide `b-v2-file`, `b-v2-etats`, `b-v2-lieu-revue`.

**Files:** `worker/admin.ts`, `worker/places.ts`, `src/client/admin/*.ts`, `tests/unit/admin.test.ts`.

- [ ] **Step 1: Failing test** for `approve(profile, places)`: the profile becomes `published` with `published_at` set and its slug frozen; its `pending` places stay `pending`; only `approved` places are exported (Task 16). A `refused` place is removed from `profile_places` and its reason queued for the member's e-mail.
- [ ] **Step 2: Routes** (`auth: "admin"`): `GET /api/admin/queue` (pending, oldest first, with flags); `POST /api/admin/profiles/:id/approve`; `…/refuse { reason }` (e-mailed, DSA art. 17); `…/hide { reason }` / `…/unhide`; `…/owner { email }` (links an existing account: the 6 seeded profiles); slides for the existing profiles: upload (`kind = 'slide'`, 1080 px, alt text required), reorder, delete; `GET /api/admin/places` (pending places, including those of pending profiles, each with its profile link); `POST /api/admin/places/:id/{approve,rename,move,merge,refuse}`.
- [ ] **Step 3: Flags:** `out_of_area` (Task 9), `no_category` (« Aucune ne convient » note), `possible_duplicate` (same normalised phone, or `normalize(nom)` equal to another profile's).
- [ ] **Step 4: Screens** per `admin.html`: queue, full review with the generated slides (rendered with `preview.ts`), refusal with preset reasons, the profile list with search, hide and owner linking, the slides manager, « Lieux à vérifier » with merge suggestions (nearest snapshot places by `haversine`), and the place still waiting after « Publier » (frame 6f).
- [ ] **Step 5: Verify** all 32 frames at 360 and 1400 px; commit per section.

---

## Phase 5 — Publishing

### Task 15: Budgets for the app pages

**Shape:** Verify.

- [ ] Measure `/espace` and `/admin` JS with Plan 2's per-page budgets; set their line at the measured size rounded up to the next 10 KB, and write the measurement in the commit message. Public pages' budgets do not move.
- [ ] Commit `build: budget the member space and admin JavaScript`.

### Task 16: `export-content`

**Shape:** TDD for the filter; Verify for the I/O.

**Files:** `scripts/export-content.mjs`, `scripts/content-rows.mjs` (pure), `tests/unit/export.test.ts`.

- [ ] **Step 1: Failing tests** for `toContent({ profiles, images, places, profilePlaces })` (pure): only `published` profiles; for each, `memberSchema`-shaped JSON with slug, derived fields, `photo` and `carrousel` file names; `lieux` keeps only places that are `approved` or `osm-*`; `places.json` holds approved member places only; a profile whose full `memberSchema` parse fails is a hard error naming its row number, never its content.
- [ ] **Step 2: I/O:** read D1 with the read-only token (`POST /accounts/{id}/d1/database/{id}/query`, D1 Read; F8), page through `images` so no response exceeds the API's size limit, write `CONTENT_DIR/members.json`, `portraits/`, `carrousels/`, `histoire/`, `places.json`. Never `console.log` a row. Output directory outside the repository (`$RUNNER_TEMP` in CI).
- [ ] **Step 3: Verify** against local D1 seeded with the fixture (`import-content.mjs` from Task 20 run on `tests/fixtures`): `CONTENT_DIR=<export> npm run build` produces the same pages as `npm run build` on the fixture. Diff `dist/` text; only `version.json` may differ.
- [ ] **Step 4: Commit** `feat: export published content from D1`.

### Task 17: The content deploy

**Shape:** Verify.

**Files:** `.github/workflows/content-deploy.yml`, `.github/workflows/ci.yml`, `worker/dispatch.ts`.

- [ ] **Step 1: The gated deploy records what it deployed:** after a successful deploy, move the tag `deployed/<environment>` to `github.sha` and push it. The `deploy` job gets `permissions: { contents: write }` at job level (F6); the workflow default stays `contents: read`. A tag pushed with `GITHUB_TOKEN` triggers no workflow, which is what we want; the workflow stays `contents: read`.
- [ ] **Step 2: One queue for both deploys:** the `deploy` job gets job-level `concurrency: { group: deploy-<environment>, cancel-in-progress: false }`; `content-deploy.yml` uses the same group. One runs, at most one waits, and the waiting one is the newest (a burst of saves coalesces).
- [ ] **Step 3: `content-deploy.yml`:** `on: workflow_dispatch: inputs: environment (staging | production)`; `environment: ${{ inputs.environment }}` (production-content needs no reviewer: use a separate GitHub Environment `production-content` holding the same secrets, without the reviewer rule, as v2 spec §7 names it); checkout `deployed/<environment>`; `npm ci`; `export-content` into `$RUNNER_TEMP/content`; restore the slide cache; `npm run build` with `CONTENT_DIR`; `forbidden-dist --real-content`; budgets; `contenu.spec.ts`; `wrangler deploy` (with `--env staging` for staging); the readiness wait and `deployed.spec.ts`. On failure: one step e-mails Adrien through Brevo (`curl`, the key from secrets, no member data).
- [ ] **Step 4: Both deploys export from D1** once the migration is done: the gated deploy's « checkout cartoucherie-donnees » step is replaced by `export-content`, behind an environment variable `CONTENT_SOURCE` (`repository` | `d1`) so the switch is one variable per environment, flipped in Task 20.
- [ ] **Step 5: `dispatch.ts`:** `POST https://api.github.com/repos/<owner>/<repo>/actions/workflows/content-deploy.yml/dispatches` with `{ ref: "deployed/<environment>", inputs: { environment } }` — the tag, never `main`, so the workflow file that runs with the no-reviewer secrets is the last approved one too. The fine-grained token: Actions: write (F5). Called after a published profile's save, an approval, a hide, a deletion, a place decision. A dispatch failure does not fail the member's save, but it e-mails Adrien (at most once a day, tracked in D1): an expired token would otherwise silently stop every edit from going live.
- [ ] **Step 6: Verify on staging:** edit a published fixture profile; the workflow runs; the page changes; `/espace` goes from « Mise en ligne en cours… » to « En ligne ». Two saves 10 seconds apart produce at most two runs. A run started while a code deploy is running waits for it.
- [ ] **Step 7: Commit** `ci: deploy member content without a code review`.

---

## Phase 6 — Migration and launch

### Task 18: Legal pages

**Shape:** Verify (copy is a human check, `docs/STANDARDS.md` §5).

**Files:** `src/pages/confidentialite.astro`, `src/pages/mentions-legales.astro`, `src/lib/copy.ts`.

- [ ] `/confidentialite`: keep « what the site does / does not » for visitors, true as built; add the accounts section — data collected (fields doc §4), purpose and lawful basis (art. 6(1)(b)), controller (Adrien), retention (profile as long as the account; inactive accounts deleted after 2 years with a warning first), the one strictly necessary cookie on `/api` only, Turnstile on two pages, Brevo as processor, rights and how to exercise them, deletion in `/espace`.
- [ ] `/mentions-legales`: corrections by the member in `/espace`, or by e-mail.
- [ ] Adrien reads both aloud before merge. Commit `docs: describe accounts on the privacy page`.

### Task 19: Inactive accounts

**Shape:** TDD for the dates.

- [ ] A Worker Cron Trigger, monthly: e-mail accounts whose `last_seen_at` is 23 months old; delete accounts (and their profiles) at 24 months. `last_seen_at` is set on each session check, at most once a day. Pure function `retentionActions(users, now)` tested at the boundaries.
- [ ] Commit `feat: warn and delete inactive accounts`.

### Task 20: Migrating the 6 profiles

**Shape:** Verify, run by Adrien on his machine. The agent writes the script and never runs it on real data.

**Files:** `scripts/import-content.mjs`.

- [ ] **Step 1: The script** reads a content directory (`CONTENT_DIR`) and writes to D1 through the HTTP API's `/query` with **bound parameters** (F7: a SQL statement is capped at 100 KB, and one base64 portrait alone exceeds it, so a generated `.sql` file cannot carry images). It needs a D1 Write token Adrien creates for the run and revokes after. It writes one `profiles` row per member (`status = 'published'`, no owner, `published_at = now`, the existing slug), portraits and Sandra's slides as `images` (base64, alt text from `texte`), addresses re-geocoded through the same acceptance rule (failures listed by row number for Adrien). It prints counts, never rows.
- [ ] **Step 2: Rehearse on the fixture:** import `tests/fixtures` into local D1, export, build, diff (Task 16 Step 3).
- [ ] **Step 3: Adrien, staging is untouched** (fictional only). Production: `CONTENT_DIR=../cartoucherie-donnees D1_WRITE_TOKEN=… node scripts/import-content.mjs --database <production id>`, then revoke the token.
- [ ] **Step 4: Prove the switch** (v2 spec §13 step 3): build once from the private repository and once from the export, on Adrien's machine, and compare `dist/` page by page — same URL list, same visible text. The script reports « N pages identical » or the differing page numbers.
- [ ] **Step 5:** Flip `CONTENT_SOURCE=d1` on the `production` and `production-content` environments; run a content deploy; check the 6 profiles on the live site; archive `cartoucherie-donnees` (read-only, kept as a backup). Then open sign-up: `SIGN_UP_OPEN=1` in production (Task 5b).

### Task 21: Invitations

- [ ] The invitation e-mail (French, from Adrien): what changed, the link to `/espace/connexion`, and the GDPR art. 14 notice for data collected indirectly (fields doc §4). Adrien sends it from `/admin` (`POST /api/admin/profiles/:id/invite { email }`), then links the account once the person signs in (Task 14's owner linking).

### Task 22: CPU on staging

**Shape:** Verify. v2 spec §14.

- [ ] Repeat §13 step 0's seven measurements on staging, median of 10 from Workers Logs, plus the new routes (geocoder proxy, submit, approve, admin queue with 50 fixture profiles). Every median under 5 ms. Record the table in the v2 spec §13 under « Measured on staging ».

### Task 23: The second core flow in CI

**Shape:** TDD (the end-to-end decision).

- [ ] `tests/e2e/v2/flow.spec.ts`: sign in as a new address → fill in the required steps with a fixture photo → submit → sign in as the seeded admin → approve → run `export-content` against local D1 and rebuild → `/membre/<slug>` shows the name and « Appeler ». One test, one device.
- [ ] Commit `test: cover sign-in to public profile end to end`.

---

## Definition of done — Plan 3

v2 spec §15, plus:

- Every `/api` route measured under 5 ms median on staging.
- No member data in any public CI log (check the last content deploy's log by eye).
- `deployed.spec.ts` asserts zero cookies on public pages and 404 on `/api/dev/outbox` in both environments.
- The v1 and v2 Playwright projects, Lighthouse, budgets and axe green.

## Platform facts (checked 2026-10-30)

Referenced as F1–F11 above. Checked against the installed `node_modules/wrangler/config-schema.json` (4.152.0) and official docs. Recheck a fact before relying on it if its source has changed.

- **F1** `run_worker_first` accepts an array of route patterns; `!` patterns go to assets. `binding` is only needed if the Worker calls `env.ASSETS.fetch()`. <https://developers.cloudflare.com/workers/static-assets/binding/>
- **F2** `vars` and `d1_databases` are not inherited by named environments: « must be specified in every named environment » (wrangler config schema). <https://developers.cloudflare.com/workers/wrangler/configuration/#environments>
- **F3** `_headers` is « not applied to responses generated by your Worker code »; a header set twice is « joined with a comma separator »; `! Header-Name` detaches an inherited header. <https://developers.cloudflare.com/workers/static-assets/headers/>
- **F4** Turnstile needs `script-src` and `frame-src https://challenges.cloudflare.com`. No cookie unless pre-clearance is enabled, which is off by default. <https://developers.cloudflare.com/turnstile/reference/content-security-policy/>
- **F5** `POST …/actions/workflows/{id}/dispatches` needs Actions: write; `repository_dispatch` needs Contents: write. <https://docs.github.com/en/rest/authentication/permissions-required-for-fine-grained-personal-access-tokens>
- **F6** `jobs.<id>.permissions` overrides per job; ref writes are Contents: write; events from `GITHUB_TOKEN` start no new run (except dispatches). <https://docs.github.com/en/actions/concepts/security/github_token>
- **F7** D1 Free: 500 MB per database, 10 databases, 2 MB per row or value, **100 KB per SQL statement**, 100 bound parameters, 50 queries per Worker invocation, 5 M rows read and 100 k written per day (queries stop, no billing). <https://developers.cloudflare.com/d1/platform/limits/>
- **F8** `POST /accounts/{account}/d1/database/{db}/query` accepts a D1 Read token. Whether D1 Read refuses write SQL is unverified: the export script only ever sends `SELECT`. <https://developers.cloudflare.com/api/resources/d1/subresources/database/methods/query/>
- **F9** Workers Free: 10 ms CPU per request, 100 k requests per day, 50 subrequests per request; `crypto.subtle.digest("SHA-256")` and `crypto.getRandomValues` available. <https://developers.cloudflare.com/workers/platform/limits/>
- **F10** Brevo: `POST https://api.brevo.com/v3/smtp/email`, header `api-key`. Free plan 300 e-mails a day (brevo.com; the help-centre page was not reachable). <https://developers.brevo.com/reference/sendtransacemail>
- **F11** Géoplateforme: `q`, `autocomplete` (`1`/`0`), `index`, `limit` (≤ 50), `postcode`, `type` (`housenumber`…); features carry `score`, `type`, `postcode`, `label`. 50 requests per second per IP; free; no key needed in a live test. <https://data.geopf.fr/geocodage/openapi.yaml>

## Open questions for Adrien

1. **Staging after the migration.** Staging's D1 holds fictional profiles only, so staging stops being a preview of the real directory. Accept that (recommended: it removes real people from a second public copy), or import the real profiles into staging too?
2. **Who sends e-mails.** The sender address `annuaire@cartoucherie.fyi` and the Brevo account holder (you, or the association).
3. **LCEN identification record** (v2 spec §16 †): needed before launch, not before coding.
