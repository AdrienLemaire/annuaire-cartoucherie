# Annuaire de la Cartoucherie — Plan 1: the static directory

**Status: complete, live since 2026-10-26.** What shipped, what changed and what comes next:
`docs/ROADMAP.md`. The step checkboxes below were never ticked and are not a progress record.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a deployed, browsable, French-language directory of the Cartoucherie's entrepreneurs — all four discovery surfaces, faithful to the approved mockups, excellent on a phone — with no database and no accounts, and with no real member data anywhere in the repository.

**Architecture:** Astro static site. Member content is a JSON file validated by a Zod schema and read through Astro's content layer at build time; every page is prerendered to static HTML and served from Cloudflare Workers' free unlimited static-asset tier. Search, category filtering and the map all run client-side over one JSON index emitted at build. The public repository commits a fictional fixture only; real content is injected at build time from a private repository (Task 14).

**Tech Stack:** Astro 5, Tailwind CSS 4 (`@tailwindcss/vite`), daisyUI 5, TypeScript, Zod, `@fontsource-variable/fraunces` + `@fontsource-variable/source-sans-3`, Vitest, Playwright, axe-core, Wrangler, ESLint + typescript-eslint + eslint-plugin-astro + eslint-plugin-sonarjs, Prettier, jscpd, husky + commitlint, satori + sharp, qrcode.

**Spec:** `docs/superpowers/specs/2026-08-29-annuaire-cartoucherie-design.md`

**Standards (binding):** `docs/STANDARDS.md` — the engineering source of truth. `CLAUDE.md` is its agent-facing summary. Where this plan and the standards disagree, the standards win and the plan is wrong.

**Mockups (binding):** `docs/mockups/final/` — `styleguide.html` is the component authority, the four pages are the composition authority. `docs/mockups/_shared/couleurs.md` is the colour authority.

---

## Why this plan stops where it does

The spec describes one product but contains two independent subsystems. This plan is the first:

| | Ships | Needs |
|---|---|---|
| **Plan 1 — the static directory** (this document) | A deployed directory anyone can browse, search, filter and use to phone a neighbour | No database, no accounts, no email |
| **Plan 2 — accounts, reviews, moderation** (later) | Reviews, synced favourites, magic-link + passkey sign-in, `/admin` | D1, Drizzle, Better Auth, Brevo |

Plan 1 alone satisfies most of the spec's Definition of Done (§12): all four discovery surfaces, Lighthouse on mobile, a custom domain with analytics, and the first of the two Playwright flows (*scan → find a member → contact them*). Accounts are never required to browse (§7), so nothing in Plan 1 is blocked on Plan 2.

**The one interface contract between them:** `/membre/[slug]` renders a reviews *slot* — a static, server-rendered empty state — which Plan 2 replaces with a client island. Task 9 defines it, including the `data-` attribute names. No other page changes when Plan 2 lands.

## Resolution of spec §14 — build-time access to D1

The spec's §14 flagged this as "the least-trodden part of the architecture": Cloudflare's build CI exposes no D1 binding, so a build that reads the members table must go over the D1 HTTP API with a scoped token.

**In v1 the build does not read D1 at all, and this is spec-consistent rather than a workaround.** §10 states the seed script is "the v1 editing interface" and "no admin CRUD is built"; §2 places member self-editing in v2. So in v1 a JSON file is the only thing that ever changes member content, and the build reads that file directly. D1 becomes primary — and the build starts reading it over HTTP — exactly when members can edit, in v2.

**This is settled.** Spec §5 and §14 were amended on 2026-09-14 to say so; there is nothing left to propose. What changed since the first draft of this plan is *where the file lives*: not in the public repository (Task 14).

## How this plan uses tests

**A test is owed to a decision that could have gone the other way — never to a task** (`docs/STANDARDS.md` §2). The first draft of this plan gave every task a "write the failing test" step, so logic-free tasks ended up grepping their own source files to satisfy the ritual: 103 authored test blocks, of which roughly two thirds asserted nothing a reviewer would miss.

The task template here therefore has **two shapes**, and the task picks one:

- **TDD shape** — the task contains a decision: a matcher's ranking, a French agreement rule, a phone-number format, a privacy promise. Steps are: write the failing test → run it red → implement → run it green → commit.
- **Verify shape** — the task is composition, configuration or markup. There is no test file. The step reads `**Verify:**` and gives a command plus the observation that proves it worked: a build that succeeds, a screenshot a human looks at, a measured ratio, a grep over `dist/`.

**Do not add a test to a Verify step.** A test that reads the file the task just wrote is grep in a costume; it goes green for the wrong reason and it goes red on a rename that is not a defect. If you find yourself wanting one, name the decision it protects in one clause first — if you cannot, that is the answer.

This plan authors **36 test blocks** (the axe and text-zoom specs are each parametrised over five pages, so 44 cases run). The target is the standards' real metric: the maintainer can read the whole suite in fifteen minutes.

---

## Global Constraints

Every task's requirements implicitly include this section.

### Language: the app is French, the code is English

This is the rule broken most often, and the first draft of this plan broke it throughout.

- **French:** UI copy, `copy.ts` *values*, content, category names, « Je cherche… » phrasings, and every string a test asserts on the rendered page.
- **English:** identifiers, filenames, comments, `describe` / `it` / `test` descriptions, commit messages, and this document.
- **Astro page filenames stay French, because they are the URLs.** `annuaire.astro`, `categorie/[slug].astro`, `membre/[slug].astro`, `carte.astro`, `a-propos.astro`, `confidentialite.astro`, `mentions-legales.astro`, `avis.astro`, `recherche.json.ts`. A QR code printed on a counter encodes `/membre/<slug>`; renaming these files breaks printed paper. **Do not "fix" them to English.**
- **JSON data keys stay French too** — `nom`, `metier`, `genre`, `accroche`, `bio`, `categories`, `services`, `adresse`, `distance`, `tel`, `email`, `site`, `instagram`, `photo`, `note`, `nbAvis`, `surCarte`, `besoin`, `motsCles`. Sandra edits that file by hand, `docs/STANDARDS.md` and `CLAUDE.md` both name the field `genre`, and the inferred `Member` type carries those keys. Only the *code around the data* is English.
- **The brand word survives in copy, not in code.** Identifiers say `member` / `Member`; French UI says « voisin » / « voisine », never « membre ».

Rename table, applied everywhere in this plan — use these names exactly:

| First draft | This plan | | First draft | This plan |
|---|---|---|---|---|
| `tousLesVoisins` | `loadMembers` | | `RangeeVoisin` | `MemberRow` |
| `toutesLesCategories` | `loadCategories` | | `CartePortrait` | `MemberCard` |
| `categoriesAvecComptes` | `withCounts` | | `PastilleCategorie` | `CategoryChip` |
| `trierParDistance` | `sortByDistance` | | `BoutonAppeler` | `CallButton` |
| `aUneAdresse` | `hasAddress` | | `EmplacementAvis` | `ReviewsSlot` |
| `construireIndex` | `buildIndex` | | `PanneauColly` | `CollyPanel` |
| `chercher` | `search` | | `BarreRecherche` | `SearchBar` |
| `normaliser` | `normalize` | | `IndexBesoins` | `NeedsIndex` |
| `accord` | `agree` | | `EnTete` | `SiteHeader` |
| `urlMembre` | `memberUrl` | | `PiedDePage` | `SiteFooter` |
| `COPIE` | `COPY` | | `SpriteIcones` | `IconSprite` |
| `compte` (two copies) | `formatMemberCount` | | `Icone` | `Icon` |
| `genre.ts` | `gender.ts` | | `BoutonQr` | `QrCard` |
| `recherche.ts` | `search.ts` | | `PageTexte` | `TextPage` |
| `membres.ts` | `members.ts` | | `Base.astro` | `BaseLayout.astro` |
| `slug.ts` + `normaliser` | `text.ts` (one module) | | `membres.json` | `members.json` |

### Architecture (`docs/STANDARDS.md` §1)

- **Four layers, one direction: `lib → components → layouts → pages`.** Enforced per-directory in `eslint.config.js`.
- **`src/lib/**` is pure and isomorphic.** No `astro:*`, no `node:*`, no DOM. Every helper takes its data as an argument. `src/lib/collections.ts` is the single exception and the only file that may import `astro:content`.
- **Types derive from the Zod schemas. `any` is a build error.** `src/content/schemas.ts` owns `memberSchema`, `categorySchema` and the inferred `Member` / `Category` / `Gender` types, importing `z` from `zod` — **never from `astro:content`**, which drags the content runtime into the browser bundle.
- **One normaliser for the whole project:** `src/lib/text.ts` owns `stripAccents`, `normalize` and `slugify`. Nothing else may NFD-strip-lowercase a string.
- **`.astro` frontmatter binds data; it does not compute it.** A regex, a branch, a format or a second caller means the logic moves to `src/lib`.
- **Files are named after the domain noun.** `MemberCard.astro`, never `Card.astro`.
- **No barrel files**, no `utils.ts` / `helpers.ts`, no one-line wrappers, no interface for a single implementation.
- **Budget functions, not files:** `complexity: 10`, `max-depth: 3`, `max-params: 4`, `max-lines-per-function: 60`.
- Before writing any new function, run the six-step checklist in `CLAUDE.md` (« Before you write a new function »). `grep -rn "^export" src/lib/` **is** the module index; there is no manifest, deliberately.

### Content and privacy

- **No real member data in this repository, ever.** No real names, addresses, phone numbers, emails or portraits. The repo is public and git has no erasure. `tests/fixtures/members.json` is fictional and stays fictional; real content is injected at build from a private source (Task 14). This is not the consent question — that one is settled (spec §3) — it is about erasure and bulk exposure.
- **`slug` is hand-written data, not derived from the name.** Spec §6: the slug is *"stable; the shareable and QR URL"*. Deriving it from the name means fixing a typo in « Camille Roussell » silently dead-links every QR code already printed and sitting on a counter. `slugify()` exists to *suggest* a slug when a row is added; nothing recomputes one.

### Product rules

- **Voice, settled** (`docs/mockups/_shared/brand.md` §4): vouvoiement, warm. « Je cherche… ». « Avis du quartier », never « avis clients ». **« voisins », never « membres »**, in user-facing copy. No « solution », « offre », « expérience », « univers ».
- **French agrees with each member's `genre` field** (`f`/`h`): « Ce qu'**elle** propose », « Où **la** trouver », « 1 voisin**e** ». `src/lib/gender.ts` is the sole owner of the forms table, and `formatMemberCount` the sole owner of the gendered count.
- **Never truncate a member's name.** No `truncate` class on a name, anywhere.
- **Portraits are never enlarged past sharpness.** Fixture portraits are 128×128; the measured ceiling is ×1.37. Faces are ≥88px.
- **Mobile is the primary target.** 390×844 is the design width; 360px must not scroll horizontally; text must hold at 200% zoom; tap targets ≥44px; the search input is ≥16px or iOS Safari zooms the page on focus.
- **Colour:** the tokens in `src/styles/global.css` are copied verbatim from the mockups. `accent` (orange) and `secondary` (sauge) are **fill-only** — never text or icon colour on a light background, where they measure 2.50:1 and 2.51:1 (`couleurs.md` §10).
- **`@theme static`, never plain `@theme`.** Tailwind 4 tree-shakes theme variables; custom CSS reading `var(--color-teal-950)` then silently loses its colour with no error. This project has hit this class of silent failure twice.
- **60/30/10** — at most three orange objects on one screen — is a review trigger, not a test. The first draft asserted it by counting `.cta, .filet` elements, which a rename games and a redesign breaks.
- **No emoji in functional UI.** One inline SVG sprite.

### Platform and process

- **Package manager: npm.** It is the only one on the development machine (spec §4).
- **Fail closed, not open** (spec §3): no provider may be added that bills on overage rather than stopping. This governs the deploy gate too — see Task 16.
- **No `<script is:inline>`, no `set:html`, no third-party origins.** `public/_headers` pins `script-src 'self' https://static.cloudflareinsights.com`; an inline script fails silently in production only. The single allow-listed exception is Cloudflare's analytics beacon, which has no local form. `scripts/forbidden.mjs` (Task 0) greps for all four in ~50 ms.
- **Commits: Conventional Commits**, enforced by `commitlint.config.js` and `.husky/commit-msg`. Subject in English, imperative, ≤72 characters, no trailing period. **No AI attribution of any kind** — no `Co-Authored-By`, no session trailers, no "Generated with". Both the hook and CI reject them.
- **Do not bypass GPG signing.** If `git commit` fails with a pinentry timeout, stop and ask Adrien to run the commit; never use `--no-gpg-sign`.

### Configuration already exists — reference it, do not restate it

These files are committed at the repo root before Task 0 and are the mechanical half of `docs/STANDARDS.md`. Read them; do not paste their contents into a task, and do not write a second copy of a rule they already enforce:

| File | Enforces |
|---|---|
| `eslint.config.js` | layering, `no-explicit-any`, function budgets, `sonarjs/no-identical-functions` |
| `.github/workflows/ci.yml` | verify → browser + lighthouse → **gated** deploy → production smoke |
| `lighthouserc.json` | a11y / best-practices / SEO at **1.0**, performance at **0.95**, median of 3 runs, LCP/FCP/CLS/TBT ceilings |
| `scripts/budgets.mjs` | byte budgets over `dist/` — JS 40 KB gzip total, CSS 25 KB, fonts 150 KB raw, `recherche.json` 90 KB |
| `public/_headers` | CSP, HSTS, `Permissions-Policy`, cache lifetimes |
| `commitlint.config.js`, `.husky/commit-msg` | Conventional Commits, no AI attribution |
| `.github/dependabot.yml` | weekly npm updates, monthly action updates |
| `.gitignore` | build output, secrets, test artefacts |

Four tasks legitimately **modify** one of them, and each says exactly which lines and why: Task 0 adds one step to `ci.yml` and, only if ESLint reports `no-undef`, two scoped `globals` blocks to `eslint.config.js`; Task 2 adds the two generated content paths to `.gitignore`; Task 10 changes one directive in `public/_headers`; Task 14 rewrites the `deploy` job and adds `content-private/` to `.gitignore`.

---

## File Structure

```
astro.config.mjs              Astro + Tailwind vite plugin, output: "static"
wrangler.toml                 Workers config, assets binding, custom domain
package.json                  scripts, including the composite `lint`
tsconfig.json
vitest.config.ts
playwright.config.ts          Galaxy S9+ by default; the device matrix behind MATRIX=1
scripts/
  budgets.mjs                 exists — byte budgets over dist/
  forbidden.mjs               Task 0 — the ~50 ms grep the standards require
  sync-content.mjs            Task 2 — CONTENT_DIR -> src/content/ + public/portraits/

src/
  styles/
    global.css                tokens verbatim from the mockups + product CSS
  content/
    schemas.ts                Zod schemas + inferred Member / Category / Gender.
                              Imports z from "zod", NEVER from "astro:content".
    categories.json           the ten categories and their « Je cherche… » phrasings
    members.json              GENERATED by sync-content.mjs, git-ignored, never committed
  content.config.ts           defineCollection only; consumes schemas.ts
  lib/
    text.ts                   stripAccents, normalize, slugify — the ONLY normaliser
    search.ts                 buildIndex, search — bundled into the browser
    members.ts                hasAddress, sortByDistance, withCounts, firstName,
                              formatMemberCount, memberUrl — pure, data passed in
    gender.ts                 agree() — sole owner of the French forms table
    phone.ts                  formatTelHref, formatTelDisplay
    copy.ts                   the flat French dictionary
    collections.ts            THE ONLY astro:content importer: loadMembers, loadCategories
  client/                     browser-only entry scripts, imported from .astro <script>
    live-search.ts            fetches /recherche.json on first keystroke, renders results
    category-filter.ts        /annuaire chip filtering + pushState
    geolocate.ts              /carte « ma position », on explicit tap only
    register-sw.ts            service worker registration
  og/
    card.ts                   satori + sharp, build-time only (node: allowed here)
  components/
    Icon.astro                <use> into the sprite
    IconSprite.astro          the single inline <symbol> sheet
    SiteHeader.astro          white header, wordmark, ventouse mark, filet
    SiteFooter.astro          footer + legal links
    SearchBar.astro           search field; `withColly` prop
    NeedsIndex.astro          the numbered 01–10 « Je cherche… » index
    MemberCard.astro          the full portrait card (rect vs disc)
    MemberRow.astro           the dense list row
    CategoryChip.astro        category chip, as a link
    CallButton.astro          the CTA; `sticky` prop for the bottom bar
    ReviewsSlot.astro         the reviews slot — Plan 2's drop-in point
    CollyPanel.astro          a sable panel with Colly
    QrCard.astro              the QR preview and its download link
  layouts/
    BaseLayout.astro          <html>, meta, viewport-fit, fonts, sprite, analytics
    TextPage.astro            readable measure for the four editorial pages
  pages/
    index.astro               /
    annuaire.astro            /annuaire
    categorie/[slug].astro    /categorie/[slug]
    membre/[slug].astro       /membre/[slug]
    carte.astro               /carte
    a-propos.astro            /a-propos
    confidentialite.astro     /confidentialite
    mentions-legales.astro    /mentions-legales
    avis.astro                /avis
    recherche.json.ts         the client search index, emitted at build
    og/[slug].png.ts          one Open Graph image per member
    qr/[slug].svg.ts          one QR code per member — a file, not a script
public/
  colly/                      the mascot assets
  portraits/                  GENERATED by sync-content.mjs, git-ignored
  manifest.webmanifest
  sw.js
  _headers                    exists
tests/
  fixtures/
    members.json              the FICTIONAL fixture — the only member data in git
    portraits/                twelve committed 128×128 portraits
  unit/                       Vitest
  e2e/                        Playwright
```

---
### Task 0: Scaffold and toolchain — Astro, TypeScript, Vitest, Playwright, the linter

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `playwright.config.ts`, `wrangler.toml`, `.prettierrc.json`, `scripts/forbidden.mjs`, `src/pages/index.astro`
- Modify: `.github/workflows/ci.yml` (one step added to the `verify` job)
- Test: none — this is configuration. Verify shape.

**Interfaces:**
- Consumes: nothing — this is the first task.
- Produces: `npm run build` emitting `dist/`, `npm test` running Vitest, `npm run test:e2e` running Playwright on Galaxy S9+, and **`npm run lint`**, which every later task runs before committing. Every later task depends on all four.

**Why the toolchain is Task 0 and not a footnote.** The first draft of this plan installed no linter at all, while `docs/STANDARDS.md` delegates its entire mechanical half to one: the layering rule, `no-explicit-any`, the function budgets and the no-barrels check are all ESLint or a shell test. A standard with no mechanism loses its argument on every commit. `eslint.config.js` is already written and committed; this task installs what it imports.

**Before starting.** These paths are untracked and must be committed first, because every task below references them: `docs/mockups/`, `docs/STANDARDS.md`, `CLAUDE.md`, `.gitignore`, `eslint.config.js`, `commitlint.config.js`, `lighthouserc.json`, `scripts/budgets.mjs`, `public/_headers`, `.husky/`, `.github/` (`workflows/ci.yml` and `dependabot.yml`). **GPG signing is configured and prompts interactively — ask Adrien to run the commit.** Never use `--no-gpg-sign`. Expect that first push's CI run to fail: there is no `package-lock.json` until step 2 of this task, so `npm ci` cannot run. That is expected and is fixed by this task's own commit.

- [ ] **Step 1: Create `package.json` by hand**

`npm create astro` refuses or prompts in a directory that already holds `docs/`, `.github/` and eight config files, and this plan shows every config it would have generated anyway. Write the file:

```json
{
  "name": "annuaire-cartoucherie",
  "type": "module",
  "private": true,
  "engines": { "node": ">=22" },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview --port 4321",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "lint": "astro check && eslint . && tsc --noEmit && test -z \"$(find src -name index.ts)\" && jscpd src",
    "guard": "node scripts/forbidden.mjs",
    "budgets": "node scripts/budgets.mjs",
    "lighthouse": "lhci autorun",
    "format": "prettier --write .",
    "deploy": "npm run build && wrangler deploy",
    "prepare": "husky"
  }
}
```

`lint` is one composite command on purpose: `astro check` type-checks `.astro` files and generates `.astro/types.d.ts`, which `tsc --noEmit` then needs, so the order matters. The `find` test is the no-barrels rule from the standards — a `src/lib/index.ts` would pull `astro:content` into the client bundle the moment anything imported `search` through it.

- [ ] **Step 2: Install the toolchain**

```bash
npm install astro tailwindcss @tailwindcss/vite daisyui
npm install -D typescript @astrojs/check
npm install -D vitest @vitest/coverage-v8 @playwright/test wrangler
npm install -D eslint @eslint/js typescript-eslint eslint-plugin-astro eslint-plugin-sonarjs
npm install -D prettier prettier-plugin-astro jscpd
npm install -D husky @commitlint/cli @commitlint/config-conventional
npm install -D @axe-core/playwright @lhci/cli
npx husky
npx playwright install --with-deps chromium
```

Then pin Zod to the major Astro itself resolves, so `src/content/schemas.ts` and the content layer agree:

```bash
npm ls zod            # read the version Astro pulled in
npm install zod@<the major printed above>
```

`npx husky` installs the git hook path; `.husky/commit-msg` is already committed and needs no edit.

- [ ] **Step 3: Confirm what jscpd can actually tokenise**

```bash
npx jscpd --list-formats | tr ',' '\n' | grep -iE 'astro|typescript|javascript|css'
```

`jscpd` covers `.ts`, `.js` and `.css`. **If `astro` is absent from that list — expect it to be — then `.astro` markup duplication is not tooled, and pretending otherwise is worse than admitting it.** Duplicated component markup is a review concern, caught by the per-task **Consumes:** blocks and the domain-noun naming rule, not by a machine. Record what the command printed in the commit body.

- [ ] **Step 4: Write the configs**

```javascript
// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // The domain is not registered yet (spec §14). Task 16 replaces this value,
  // and the QR codes of Task 9 encode whatever it says at build time.
  site: "https://annuaire.lacartoucherie.fr",
  output: "static",
  vite: { plugins: [tailwindcss()] },
  build: { inlineStylesheets: "auto" },
});
```

**No Cloudflare adapter in Plan 1, deliberately.** An Astro adapter exists to enable on-demand rendering; with `output: "static"` every route is prerendered and the adapter does nothing. Shipping without one makes the spec's central cost argument literally true — the site is nothing but static assets, and "requests to static assets are free and unlimited" (spec §3) applies without qualification. **Plan 2 adds `@astrojs/cloudflare` and switches to `output: "server"` with `export const prerender = true` as the project default**, which is the configuration in which per-route `prerender = false` actually works.

**No `image.domains` either.** The first draft allow-listed `randomuser.me` so `astro:assets` could process the fixture's remote portraits. That makes every build fetch twelve images over the network — a flaky CI step — and it contradicts committing the fixture. Portraits are local files from Task 2 onward.

```json
// tsconfig.json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", "docs/mockups"]
}
```

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { include: ["tests/unit/**/*.test.ts"], environment: "node" },
});
```

No `getViteConfig` from `astro/config` here, and no component rendering in unit tests: everything a unit test touches is a pure module under `src/lib`. Rendering assertions live in Playwright, where they assert on what the visitor gets.

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

// Galaxy S9+ (360 px) is the floor and the default: every assertion runs once,
// on one device, unless the assertion is about the device (docs/STANDARDS.md §2).
// MATRIX=1 adds the other four for the layout-sensitive specs only, before deploy.
const MATRIX = process.env.MATRIX === "1";
const LAYOUT_SPECS = /(landing|profile|carte|a11y)\.spec\.ts$/;

export default defineConfig({
  testDir: "tests/e2e",
  retries: 0,          // flaky tests are deleted, never retried or quarantined
  use: { baseURL: "http://localhost:4321" },
  // No local server when the target is production: the smoke job checks out and
  // runs `playwright test tests/e2e/production.spec.ts` with no dist/ to serve,
  // and an unconditional webServer aborts the run before the skip guard fires.
  webServer: process.env.URL_PROD
    ? undefined
    : { command: "npx astro preview --port 4321", port: 4321, reuseExistingServer: true },
  projects: [
    { name: "Galaxy S9+", use: { ...devices["Galaxy S9+"] } },
    ...(MATRIX
      ? [
          { name: "iPhone SE", testMatch: LAYOUT_SPECS, use: { ...devices["iPhone SE"] } },
          { name: "iPhone 14", testMatch: LAYOUT_SPECS, use: { ...devices["iPhone 14"] } },
          { name: "Pixel 7", testMatch: LAYOUT_SPECS, use: { ...devices["Pixel 7"] } },
          { name: "Desktop", testMatch: LAYOUT_SPECS, use: { ...devices["Desktop Chrome"] } },
        ]
      : []),
  ],
});
```

`webServer` serves, it does not build: CI hands Playwright a `dist/` downloaded from the `verify` job, and locally you run `npm run build` first.

```toml
# wrangler.toml
name = "annuaire-cartoucherie"
compatibility_date = "2026-09-01"

[assets]
directory = "./dist"
```

```json
// .prettierrc.json
{
  "printWidth": 100,
  "plugins": ["prettier-plugin-astro"],
  "overrides": [{ "files": "*.astro", "options": { "parser": "astro" } }]
}
```

- [ ] **Step 5: Write the forbidden-pattern guard**

`docs/STANDARDS.md` §3 specifies "a ~50 ms grep over `src/`" for four patterns that fail *silently and only in production*. No file implemented it yet:

```javascript
#!/usr/bin/env node
// scripts/forbidden.mjs
// Four patterns that a linter cannot see and that fail only in production,
// where public/_headers pins script-src to 'self'. ~50 ms over src/.
import { readdirSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";

// The one allow-listed third party: Cloudflare's analytics beacon has no local
// form, is named in the CSP, and publishes no stable hash for SRI.
const BEACON = "static.cloudflareinsights.com";

const RULES = [
  {
    // Not /<script[^>]*is:inline/: Prettier wraps a long script tag across lines
    // at printWidth 100, so a line-anchored version would miss the common case.
    // `is:inline` only ever appears on a script or style tag anyway.
    re: /\bis:inline\b/,
    why: "is:inline: CSP is script-src 'self'. Put it in src/client/ and import it.",
  },
  { re: /\bset:html\b/, why: "set:html: render the value, or emit it from a route as a file." },
  {
    re: /(?:\bsrc=|\bfetch\(|@import\s|url\()\s*["'(]?https?:\/\//i,
    why: "third-party subresource: self-host it (fonts, scripts, images).",
  },
  { re: /maximum-scale|user-scalable\s*=\s*no/, why: "pinch zoom must never be disabled." },
];

const EXTENSIONS = new Set([".astro", ".ts", ".js", ".css"]);

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (EXTENSIONS.has(extname(path))) yield path;
  }
}

let failed = false;
for (const path of walk("src")) {
  const lines = readFileSync(path, "utf-8").split("\n");
  lines.forEach((line, i) => {
    if (line.includes(BEACON)) return;
    for (const rule of RULES) {
      if (rule.re.test(line)) {
        failed = true;
        console.error(`${path}:${i + 1}  ${rule.why}\n    ${line.trim()}`);
      }
    }
  });
}
process.exit(failed ? 1 : 0);
```

- [ ] **Step 6: Run the guard in CI**

Add one step to the `verify` job of `.github/workflows/ci.yml`, immediately after `npx astro check`:

```yaml
      - run: node scripts/forbidden.mjs
```

This is the only change this task makes to that file.

- [ ] **Step 7: Write a placeholder home page**

```astro
---
// src/pages/index.astro — replaced by Task 7.
---
<!doctype html>
<html lang="fr">
  <head><meta charset="utf-8" /><title>Annuaire de la Cartoucherie</title></head>
  <body><h1>Annuaire de la Cartoucherie</h1></body>
</html>
```

- [ ] **Step 8: Verify**

Run: `npm run lint && npm run guard && npm test && npm run build`

Expected: `astro check` reports 0 errors; ESLint prints nothing; `tsc --noEmit` prints nothing; the `find` test is silent; `jscpd` reports 0 clones; `guard` prints nothing; Vitest reports "No test files found" and exits 0 (`vitest run` with no matches exits 0 unless `--passWithNoTests=false`); `dist/index.html` exists.

**One adjustment `eslint.config.js` needs, and the only one this task may make to it.** That file sets no `languageOptions.globals`, so `js.configs.recommended`'s `no-undef` does not know `console` and `process` — and `scripts/budgets.mjs`, already committed, uses both. `eslint .` therefore fails on a clean checkout today. Add one scoped block rather than switching the rule off globally:

```javascript
  {
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      globals: { console: "readonly", process: "readonly", Buffer: "readonly" },
    },
  },
```

The `src/client/*.ts` files later tasks add need nothing: `typescript-eslint`'s recommended config already turns `no-undef` off for TypeScript, where the DOM lib does that checking properly.

Then prove the commit hooks are live, on a throwaway message:

```bash
git commit --allow-empty -m "bad message" || echo "rejected as expected"
```

Expected: rejected by commitlint. A message like `chore: prove the hook rejects bad subjects` is accepted.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro project and the lint toolchain"
```

---

### Task 1: Design tokens — self-hosted fonts and the global stylesheet

**Files:**
- Create: `src/styles/global.css`
- Test: `tests/unit/tokens.test.ts` — one test

**Interfaces:**
- Consumes: Task 0's Tailwind pipeline.
- Produces: `src/styles/global.css`, imported once by `src/layouts/BaseLayout.astro` (Task 3). Exposes the utility classes every component task uses: `.ff`, `.filet`, `.aube`, `.colly-fond`, `.carte`, `.flottant`, `.cta`, `.ventouses`, `.ventouses--teal`, `.pastille`, `.pastille--teal`, `.arche`, `.chip`, `.halo-fond`, `.halo`, `.croquis`, `.besoin`, `.num`, `.carte-lien`, `.tnum`; the Tailwind colour ramps `teal|orange|sauge|sable|neutre|rouge-50…950`; the type steps `text-etiquette|corps|chapo|besoin|nom|grand|enorme|cri`; and the shadows `shadow-carte|carte-hover|flottant|cta|cta-press`.

**Fidelity rule:** token values are **copied verbatim** from the approved mockup, never retyped from memory. Source: `docs/mockups/final/index.html`, four `<style>` blocks at lines **16–103** (colour ramps + depth), **104–141** (fonts + type scale), **142–184** (daisyUI theme), **185–286** (product CSS).

**Why self-hosted fonts:** Google Fonts sends visitor IP addresses to a US processor. The spec rejected social sign-in for exactly that reason (§7) and chose cookieless analytics so no consent banner is needed (§4). A `fonts.googleapis.com` request undoes that reasoning, and the LG München ruling made the exposure concrete. Fonts ship from npm, and `scripts/forbidden.mjs` now fails the build if one creeps back in.

**One test, not six.** The first draft asserted six things about this file, five of which re-read the stylesheet it had just written from the mockup it had just copied. The kept one protects a decision with a silent failure mode this project has already hit twice; everything else is verified by looking at a screenshot, which is the only check that can tell "the colour is wrong" from "the colour is missing".

- [ ] **Step 1: Install the fonts**

```bash
npm install @fontsource-variable/fraunces @fontsource-variable/source-sans-3
```

- [ ] **Step 2: Write the failing test**

```typescript
// tests/unit/tokens.test.ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

describe("Design tokens", () => {
  // Tailwind 4 tree-shakes plain @theme, so every var(--color-teal-950) in the
  // product CSS silently resolves to nothing. No error, no build failure: the
  // page simply renders white on white. This project has hit it twice.
  it("Declares the theme with @theme static, never plain @theme", () => {
    const css = readFileSync("src/styles/global.css", "utf-8");
    expect(css).toContain("@theme static");
    expect(css).not.toMatch(/@theme(?!\s+static)\s*\{/);
  });
});
```

- [ ] **Step 3: Run it to make sure it fails**

Run: `npx vitest run tests/unit/tokens.test.ts`
Expected: FAIL — `src/styles/global.css` does not exist.

- [ ] **Step 4: Build the stylesheet mechanically**

Extract the four blocks with a script rather than by hand, so a typo cannot enter:

```bash
mkdir -p src/styles
python3 - <<'PY'
import re
html = open("docs/mockups/final/index.html", encoding="utf-8").read()
tw = re.findall(r'<style type="text/tailwindcss">(.*?)</style>', html, re.S)
product = re.findall(r'<style(?! type="text/tailwindcss")[^>]*>(.*?)</style>', html, re.S)
assert len(tw) == 3, f"expected 3 tailwindcss blocks, found {len(tw)}"
assert len(product) == 1, f"expected 1 product CSS block, found {len(product)}"

header = """/* Design tokens — Annuaire de la Cartoucherie
   Copied VERBATIM from docs/mockups/final/index.html (the approved mockup).
   Values originate in docs/mockups/_shared/couleurs.md.
   Do not hand-edit: regenerate from the mockup. */

@import "tailwindcss";
@plugin "daisyui";

@import "@fontsource-variable/fraunces";
@import "@fontsource-variable/source-sans-3";

"""
open("src/styles/global.css", "w", encoding="utf-8").write(
    header + tw[0] + "\n" + tw[1] + "\n" + tw[2] + "\n" + product[0] + "\n"
)
print("wrote src/styles/global.css")
PY
```

Then remove the mockup-only `IBM Plex Mono` declaration (it existed for the styleguide's code listings) and confirm the `:root` gradient block survived.

**Check which axes the import actually carries.** Fontsource splits a multi-axis variable font into a `wght`-only default and a separate full file. The mockup pins `font-variation-settings: "SOFT" 55, "WONK" 0`, and those axes exist only in the full file — with the default import the declaration is accepted, inherited and silently ignored, which is the same class of failure as the two in `CLAUDE.md`:

```bash
ls node_modules/@fontsource-variable/fraunces/
grep -l 'SOFT' node_modules/@fontsource-variable/fraunces/*.css
```

If the axes are only in `full.css`, import that file instead — and expect it to be the line that makes `Fonts, total (raw)` tight against the 150 KB budget in Task 15, where the remedy is to instance the two pinned axes rather than to raise the number.

- [ ] **Step 5: Run the test**

Run: `npx vitest run tests/unit/tokens.test.ts`
Expected: 1 test PASS.

- [ ] **Step 6: Verify — the silent-failure class this project has hit twice**

Create a throwaway `src/pages/_tokens.astro` rendering one swatch per ramp step, one line per type step, a `.cta` button, a `.pastille` and a `.ventouses` panel. Then:

```bash
npm run build
npx astro preview --port 4321 & PREVIEW=$!
npx playwright screenshot --viewport-size=1200,2400 http://localhost:4321/_tokens /tmp/tokens.png
kill $PREVIEW
```

Open `/tmp/tokens.png` and confirm: the swatches are coloured, not white (white means `@theme` tree-shook the variables); the CTA carries its orange gradient and shadow; the ventouse motif is visible; and Fraunces genuinely renders — compare a heading against a Georgia fallback, because **`document.fonts.check()` returns `false` for a webfont nothing uses** and has already produced a false alarm on this project.

Delete `_tokens.astro` once verified.

- [ ] **Step 7: Commit**

```bash
git add src/styles/global.css tests/unit/tokens.test.ts package.json package-lock.json
git commit -m "feat: add design tokens copied from the approved mockups"
```

---

### Task 2: Content — Zod schemas, the fictional fixture, text and gender helpers

**Files:**
- Create: `src/content/schemas.ts`, `src/content.config.ts`, `src/content/categories.json`, `tests/fixtures/members.json`, `tests/fixtures/portraits/*.jpg`, `src/lib/text.ts`, `src/lib/gender.ts`, `scripts/sync-content.mjs`
- Modify: `package.json` (four lifecycle scripts), `.gitignore` (two lines), `.github/workflows/ci.yml` (one step in `verify`)
- Test: `tests/unit/text.test.ts`, `tests/unit/gender.test.ts` — three tests

**Interfaces:**
- Consumes: Task 0's Astro install.
- Produces:
  - `memberSchema`, `categorySchema`, and the types `Member`, `Category`, `Gender = "f" | "h"` — every later signature uses these, and nothing in this project may write `any`
  - collection `members` (keyed on `slug`) and collection `categories`
  - `stripAccents(s: string): string`, `normalize(s: string): string`, `slugify(s: string): string`
  - `agree(gender: Gender, form: Form): string` where `Form = "elle" | "la" | "voisine" | "inscrite"`
  - `node scripts/sync-content.mjs` — copies `${CONTENT_DIR:-tests/fixtures}/members.json` to `src/content/members.json` and `${CONTENT_DIR}/portraits/` to `public/portraits/`, validating slugs on the way

**One normaliser.** The first draft shipped two — `slugify` in `src/lib/slug.ts` and `normaliser` in `src/lib/recherche.ts`, both NFD → strip marks → lowercase, written in the same document by the same author. They merge **here**, in the task that creates them, so no agent ever reads the duplicated version.

**`slug` is data, not a derivation.** The first draft asserted `slug === slugify(nom)`. Spec §6 defines the slug as *"stable; the shareable and QR URL"*. The two cannot both hold: correcting a typo in a name would move the slug and dead-link every QR code already printed and sitting on a counter. So `slug` is a required hand-written field, the schema constrains its shape with `/^[a-z0-9-]+$/`, `sync-content.mjs` rejects duplicates, and `slugify()` survives only to *suggest* a slug when Sandra adds a row.

**Data invariants live in the schema, not in Vitest** (`docs/STANDARDS.md` §2). Sandra edits `members.json` and will never run `npm test`. A Zod refusal fails her build at the moment of the mistake, naming the row and the field; a Vitest failure reaches nobody. The first draft's whole `contenu.test.ts` is therefore deleted and re-expressed as schema rules.

**On the fixture:** `docs/mockups/_shared/members.json` is fictional — invented names, addresses, phone numbers and reviews. It becomes `tests/fixtures/members.json`, which is the only member data this repository will ever contain. Its `_note` field says so and stays. **Keep the slug `camille-roussel` in the fixture:** `lighthouserc.json` names `/membre/camille-roussel` in its URL list, and that config is committed. Nothing else in the plan hardcodes a slug.

- [ ] **Step 1: Write the failing tests**

```typescript
// tests/unit/text.test.ts
import { describe, it, expect } from "vitest";
import { normalize, slugify } from "../../src/lib/text";

describe("Text normalisation", () => {
  // French. Someone types "electricien" and someone else typed « Électricien ».
  // One normaliser serves search and slug suggestion; two would drift apart.
  it("Folds accents and case, and suggests a slug in the same shape", () => {
    expect(normalize("Électricien")).toBe("electricien");
    expect(normalize("  Bien-Être ")).toBe("bien-etre");
    expect(slugify("Camille Roussel")).toBe("camille-roussel");
    expect(slugify("Santé & bien-être")).toBe("sante-bien-etre");
  });
});
```

```typescript
// tests/unit/gender.test.ts
import { describe, it, expect } from "vitest";
import { agree } from "../../src/lib/gender";

describe("French gender agreement", () => {
  it("Agrees the pronoun and the elided article", () => {
    expect(agree("f", "elle")).toBe("elle");
    expect(agree("h", "elle")).toBe("il");
    expect(agree("f", "la")).toBe("la");
    expect(agree("h", "la")).toBe("le");
  });

  it("Agrees the noun and the past participle", () => {
    expect(agree("f", "voisine")).toBe("voisine");
    expect(agree("h", "voisine")).toBe("voisin");
    expect(agree("f", "inscrite")).toBe("inscrite");
    expect(agree("h", "inscrite")).toBe("inscrit");
  });
});
```

- [ ] **Step 2: Run them to make sure they fail**

Run: `npx vitest run tests/unit/text.test.ts tests/unit/gender.test.ts`
Expected: FAIL — neither `src/lib/text.ts` nor `src/lib/gender.ts` exists.

- [ ] **Step 3: Write the two pure modules**

```typescript
// src/lib/text.ts
// The only normaliser in the project. Search, slug suggestion and any future
// comparison all go through these three functions.

/** NFD-decompose and drop the combining marks: « é » becomes « e ». */
export function stripAccents(s: string): string {
  return s.normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

/** Comparison form: accent-free, lower case, trimmed. Used by the matcher. */
export function normalize(s: string): string {
  return stripAccents(s).toLowerCase().trim();
}

/**
 * Suggests a URL slug for a new row. NOTHING recomputes an existing slug:
 * `slug` is hand-written data because it is printed on QR codes (spec §6).
 */
export function slugify(s: string): string {
  return normalize(s)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
```

```typescript
// src/lib/gender.ts
import type { Gender } from "../content/schemas";

// The single French forms table. Any second copy of "elle/il" anywhere in the
// project is a defect: the two drift, and the page contradicts itself.
const FORMS = {
  elle: { f: "elle", h: "il" },
  la: { f: "la", h: "le" },
  voisine: { f: "voisine", h: "voisin" },
  inscrite: { f: "inscrite", h: "inscrit" },
} as const;

export type Form = keyof typeof FORMS;

/** Agrees one word with a member's gender. « Ce qu'elle propose », « Où la trouver ». */
export function agree(gender: Gender, form: Form): string {
  return FORMS[form][gender];
}
```

- [ ] **Step 4: Run the tests**

Run: `npx vitest run tests/unit/text.test.ts tests/unit/gender.test.ts`
Expected: 3 tests PASS.

- [ ] **Step 5: Write the schemas**

```typescript
// src/content/schemas.ts
// The project's type origin. `z` comes from "zod", NEVER from "astro:content":
// the latter drags the content runtime into the browser bundle, and src/lib is
// isomorphic. Field names stay French because Sandra edits the JSON by hand.
import { z } from "zod";

export const genderSchema = z.enum(["f", "h"]);
export type Gender = z.infer<typeof genderSchema>;

const SLUG = /^[a-z0-9-]+$/;

export const memberSchema = z.object({
  // Hand-written and permanent: it is the QR URL (spec §6). Never derived.
  slug: z.string().regex(SLUG, "slug: lower-case letters, digits and hyphens only"),
  nom: z.string().min(1),
  metier: z.string().min(1),
  genre: genderSchema,
  accroche: z.string().min(1),
  bio: z.string().min(1),
  categories: z.array(z.string().regex(SLUG)).min(1),
  services: z.array(z.string()),
  adresse: z.string(),
  // « — » means "no address to go to": it drives the card shape. See hasAddress.
  distance: z.string().regex(/^(—|\d+ m|\d+(,\d)? km)$/, "distance: « 120 m », « 1,2 km » or « — »"),
  lat: z.number().nullable(),
  lng: z.number().nullable(),
  tel: z.string().regex(/^0\d( \d\d){4}$/, "tel: « 06 12 34 56 78 »").nullable(),
  email: z.string().email().nullable(),
  site: z.string().nullable(),
  instagram: z.string().nullable(),
  // A file name under public/portraits/, never a URL: the repo holds no remote
  // portrait fetches and the build never goes to the network.
  photo: z.string().regex(/^[a-z0-9-]+\.(jpg|webp)$/, "photo: a file name, not a URL"),
  note: z.number().min(0).max(5),
  nbAvis: z.number().int().min(0),
  surCarte: z.boolean(),
});
export type Member = z.infer<typeof memberSchema>;

export const categorySchema = z.object({
  slug: z.string().regex(SLUG),
  nom: z.string().min(1),
  besoin: z.string().min(9, "besoin: the « Je cherche… » phrasing, not a label"),
  motsCles: z.array(z.string()).min(1, "motsCles: the landing page advertises these"),
});
export type Category = z.infer<typeof categorySchema>;
```

```typescript
// src/content.config.ts
import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { categorySchema, memberSchema, type Category, type Member } from "./content/schemas";

const members = defineCollection({
  // Astro's file loader keys each entry on `id`. The slug is that key, so the
  // route /membre/[slug] and the printed QR code address the same entry.
  loader: file("src/content/members.json", {
    parser: (text) =>
      (JSON.parse(text) as { membres: Member[] }).membres.map((m) => ({ id: m.slug, ...m })),
  }),
  schema: memberSchema,
});

const categories = defineCollection({
  loader: file("src/content/categories.json", {
    parser: (text) =>
      (JSON.parse(text) as { categories: Category[] }).categories.map((c) => ({ id: c.slug, ...c })),
  }),
  schema: categorySchema,
});

export const collections = { members, categories };
```

- [ ] **Step 6: Build the fixture and its portraits**

The fixture is generated once from the approved mockup data, then committed and edited by hand from there on. Portraits are downloaded once and committed as local files — the build never touches the network.

```bash
mkdir -p tests/fixtures/portraits src/content
python3 - <<'PY'
import json, re, urllib.request, pathlib

source = json.load(open("docs/mockups/_shared/members.json", encoding="utf-8"))
carte = open("docs/mockups/final/carte.html", encoding="utf-8").read()

# The mockup's map pins already carry plausible Cartoucherie coordinates.
coords = {}
for slug, lat, lng in re.findall(
    r'data-slug="([^"]+)"[^>]*data-lat="([^"]+)"\s*data-lng="([^"]+)"', carte
):
    coords[slug] = (float(lat), float(lng))

members = []
for m in source["membres"]:
    name = f'{m["slug"]}.jpg'
    urllib.request.urlretrieve(m["photo"], f'tests/fixtures/portraits/{name}')
    lat, lng = coords.get(m["slug"], (None, None))
    members.append({
        "slug": m["slug"], "nom": m["nom"], "metier": m["metier"], "genre": m["genre"],
        "accroche": m["accroche"], "bio": m["bio"],
        "categories": m["categories"], "services": m["services"],
        "adresse": m["adresse"], "distance": m["distance"],
        "lat": lat, "lng": lng,
        "tel": m["tel"], "email": m["email"], "site": m["site"],
        "instagram": m["instagram"], "photo": name,
        "note": m["note"], "nbAvis": m["nbAvis"], "surCarte": m["surCarte"],
    })

# The « Je cherche… » phrasings, from the approved mockups. Sandra revises these
# here, without a developer (spec §14).
NEEDS = {
  "sante-bien-etre":      ("Retrouver l'équilibre",            ["stress","sommeil","énergie","équilibre","fatigue","détente"]),
  "artisanat-travaux":    ("Réparer, installer chez moi",      ["travaux","dépannage","réparation","meuble","électricité","bricolage"]),
  "numerique-creation":   ("Un site, un logo, une image",      ["web","site","graphisme","logo","photo","internet"]),
  "sport-mouvement":      ("Me remettre en mouvement",         ["coaching","yoga","sport","forme","souplesse"]),
  "services-domicile":    ("Un coup de main chez moi",         ["à domicile","dépannage","ménage","aide"]),
  "conseil-entreprise":   ("Faire tourner mon activité",       ["comptabilité","conseil","gestion","entreprise","association"]),
  "art-culture":          ("Un souvenir, une envie de créer",  ["photo","illustration","art","portrait","dessin"]),
  "beaute-soins":         ("Prendre soin de moi",              ["coiffure","couleur","soins","beauté"]),
  "alimentation-traiteur":("Manger bon sans cuisiner ce soir", ["traiteur","plats à emporter","cuisine","buffet"]),
  "enfance-education":    ("S'occuper des enfants, apprendre", ["enfants","soutien scolaire","éducation","garde"]),
}
categories = [
    {"slug": c["slug"], "nom": c["nom"], "besoin": NEEDS[c["slug"]][0], "motsCles": NEEDS[c["slug"]][1]}
    for c in source["categories"]
]

note = ("FICTIONAL fixture data. Invented names, addresses, phone numbers and reviews; "
        "portraits generated by randomuser.me. This file is the only member data this "
        "public repository contains, and it stays fictional. Real content is injected at "
        "build time from a private source (plan task 14).")
pathlib.Path("tests/fixtures/members.json").write_text(
    json.dumps({"_note": note, "membres": members}, ensure_ascii=False, indent=2) + "\n",
    encoding="utf-8")
pathlib.Path("src/content/categories.json").write_text(
    json.dumps({"categories": categories}, ensure_ascii=False, indent=2) + "\n",
    encoding="utf-8")
print(f"{len(members)} members, {len(categories)} categories")
PY
```

`categories.json` stays in `src/content/` and stays committed: ten public rows with no personal data in them, which Sandra edits directly (spec §14).

- [ ] **Step 7: Write the content sync script**

```javascript
#!/usr/bin/env node
// scripts/sync-content.mjs
// Puts member content where the content layer expects it. CONTENT_DIR defaults
// to the fictional fixture, so `npm run dev` and every test run on invented
// people; CI sets it to a private checkout before the production build.
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SOURCE = process.env.CONTENT_DIR ?? "tests/fixtures";
const membersFrom = join(SOURCE, "members.json");
const portraitsFrom = join(SOURCE, "portraits");

if (!existsSync(membersFrom)) {
  console.error(`sync-content: no members.json in ${SOURCE}. Set CONTENT_DIR.`);
  process.exit(1);
}

const raw = readFileSync(membersFrom, "utf-8");
const { membres } = JSON.parse(raw);
const seen = new Set();
for (const m of membres) {
  if (!/^[a-z0-9-]+$/.test(m.slug ?? "")) {
    console.error(`sync-content: bad slug ${JSON.stringify(m.slug)} on « ${m.nom} ».`);
    process.exit(1);
  }
  if (seen.has(m.slug)) {
    console.error(`sync-content: duplicate slug « ${m.slug} ». Slugs are printed on QR codes.`);
    process.exit(1);
  }
  seen.add(m.slug);
  if (!existsSync(join(portraitsFrom, m.photo))) {
    console.error(`sync-content: « ${m.nom} » names a missing portrait ${m.photo}.`);
    process.exit(1);
  }
}

mkdirSync("src/content", { recursive: true });
writeFileSync("src/content/members.json", raw);
rmSync("public/portraits", { recursive: true, force: true });
mkdirSync("public/portraits", { recursive: true });
cpSync(portraitsFrom, "public/portraits", { recursive: true });
console.log(`sync-content: ${membres.length} members from ${SOURCE}`);
```

Wire it into the lifecycle in `package.json`, so no command can run against stale or absent content:

```json
    "predev": "node scripts/sync-content.mjs",
    "prebuild": "node scripts/sync-content.mjs",
    "pretest": "node scripts/sync-content.mjs",
    "prelint": "node scripts/sync-content.mjs",
```

`prelint` matters more than it looks: from this task on, `src/content/members.json` is git-ignored, and `npm run lint` starts with `astro check`, which runs `astro sync` and fires the `file()` loader on a path that does not exist on a fresh clone. Same reason, one step in CI — add it to the `verify` job of `.github/workflows/ci.yml`, immediately after `npm ci` and before `npx astro check`:

```yaml
      - run: node scripts/sync-content.mjs
```

With no `CONTENT_DIR` set, that syncs the fictional fixture, which is exactly what every CI job but `deploy` must build.

Both destinations are generated, so they never enter git. Add to `.gitignore`, under a heading that says why:

```
# generated by scripts/sync-content.mjs — member content is never committed
src/content/members.json
public/portraits/
```

- [ ] **Step 8: Verify**

Run: `npm run build`
Expected: `sync-content: 12 members from tests/fixtures`, then Astro reports both collections synced with no schema errors.

Then prove the schema refuses bad data the way Sandra will meet it:

```bash
node -e "const f='tests/fixtures/members.json',fs=require('fs');const d=JSON.parse(fs.readFileSync(f));d.membres[0].slug='Camille Roussel';fs.writeFileSync('/tmp/bad.json',JSON.stringify(d));"
mkdir -p /tmp/bad-content && cp /tmp/bad.json /tmp/bad-content/members.json
cp -r tests/fixtures/portraits /tmp/bad-content/portraits
CONTENT_DIR=/tmp/bad-content npm run build
```

Expected: the build stops with `sync-content: bad slug "Camille Roussel" on « Camille Roussel ».` Restore with `npm run build` and confirm it is green again.

- [ ] **Step 9: Commit**

```bash
git add src/content.config.ts src/content/schemas.ts src/content/categories.json \
        src/lib/text.ts src/lib/gender.ts scripts/sync-content.mjs \
        tests/fixtures tests/unit package.json .gitignore .github/workflows/ci.yml
git commit -m "feat: add content schemas, fictional fixture and text helpers"
```

---
### Task 3: The layout — header, footer, icon sprite, the French dictionary

**Files:**
- Create: `src/layouts/BaseLayout.astro`, `src/components/SiteHeader.astro`, `src/components/SiteFooter.astro`, `src/components/IconSprite.astro`, `src/components/Icon.astro`, `src/lib/copy.ts`
- Test: none — composition and markup. Verify shape.

**Interfaces:**
- Consumes: `src/styles/global.css` (Task 1).
- Produces:
  - `BaseLayout.astro` props `{ title: string; description: string; bodyClass?: string }`
  - `Icon.astro` props `{ name: string; class?: string }` → `<svg class={class}><use href={`#i-${name}`} /></svg>`
  - `COPY` — every French string that is not member content, flat and greppable
  - the CSS variables `--safe-bottom`, `--safe-left`, `--safe-right`, read by `CallButton` (Task 5) and the map sheet (Task 10)

**Why no test here.** The first draft's `mise-en-page.test.ts` read `BaseLayout.astro` with `readFileSync` and asserted `toContain("viewport-fit=cover")` — it re-read the file the same task had just written, and it would have gone green on a layout that renders nothing. What the visitor gets from this file is checked where visitors are: axe and the zoom specs in Task 15, and one screenshot a person looks at, below.

**The mobile requirement the mockups do not cover.** None of the four mockups declare `viewport-fit=cover` or `env(safe-area-inset-bottom)` — verified by grep. The sticky « Appeler » bar on `/membre/[slug]` is `fixed bottom-0`, so on any iPhone with a home indicator it sits underneath it. Both are fixed here, once, in the layout.

- [ ] **Step 1: Write the French dictionary**

Flat, one level, English keys and French values. Flat because it is greppable: an agent looking for a string finds it by the French text, and a reviewer reads the whole file in a minute.

```typescript
// src/lib/copy.ts
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
  qrExplain:
    "À imprimer pour votre comptoir ou vos cartes de visite : il mène directement ici.",
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
} as const;
```

- [ ] **Step 2: Write the layout**

```astro
---
// src/layouts/BaseLayout.astro
import "../styles/global.css";
import IconSprite from "../components/IconSprite.astro";
import SiteHeader from "../components/SiteHeader.astro";
import SiteFooter from "../components/SiteFooter.astro";
import { COPY } from "../lib/copy";

interface Props { title: string; description: string; bodyClass?: string }
const { title, description, bodyClass = "" } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site).href;
---
<!doctype html>
<html lang="fr" data-theme="cartoucherie">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="fr_FR" />
    <meta property="og:url" content={canonical} />
    <meta name="theme-color" content="#ffffff" />
    <slot name="head" />
    <style>
      /* Safe-area insets. Without them the sticky « Appeler » bar sits under the
         iPhone home indicator. None of the four mockups handled this. */
      :root {
        --safe-bottom: env(safe-area-inset-bottom, 0px);
        --safe-left: env(safe-area-inset-left, 0px);
        --safe-right: env(safe-area-inset-right, 0px);
      }
      body {
        padding-left: var(--safe-left);
        padding-right: var(--safe-right);
      }
    </style>
  </head>
  <body class={bodyClass}>
    <a
      href="#contenu"
      class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-3 focus:rounded-field focus:bg-white focus:px-4 focus:py-3 focus:text-teal-800"
    >
      {COPY.skipLink}
    </a>
    <IconSprite />
    <SiteHeader />
    <main id="contenu"><slot /></main>
    <SiteFooter />
  </body>
</html>
```

The `<slot name="head" />` is how `/membre/[slug]` adds its own `og:image` in Task 13 without this layout growing a member-shaped prop.

- [ ] **Step 3: Write the sprite, the icon, the header and the footer**

```astro
---
// src/components/Icon.astro
interface Props { name: string; class?: string }
const { name, class: className = "size-5" } = Astro.props;
---
<svg class={className} aria-hidden="true" focusable="false"><use href={`#i-${name}`} /></svg>
```

`IconSprite.astro` is the `<symbol>` sheet lifted verbatim from `docs/mockups/final/membre.html`, which carries the fullest set; each symbol keeps its `id="i-…"`. `SiteHeader.astro` and `SiteFooter.astro` come from styleguide blocks **09** and **21**; the footer's four links use `COPY.footerAbout`, `COPY.footerPrivacy`, `COPY.footerLegal` and `COPY.footerReviews` and point at `/a-propos`, `/confidentialite`, `/mentions-legales` and `/avis`.

- [ ] **Step 4: Verify the build and the lint**

Run: `npm run lint && npm run guard && npm run build`
Expected: clean. `guard` matters here: a `<link href="https://fonts.googleapis.com">` slipping into the head is exactly what it exists to catch.

- [ ] **Step 5: Verify on a notched viewport — manual only**

```bash
npm run build
npx astro preview --port 4321 & PREVIEW=$!
npx playwright screenshot --device="iPhone 14" http://localhost:4321/ /tmp/iphone14.png
kill $PREVIEW
```

Open `/tmp/iphone14.png` and confirm no content sits under the status bar or the home indicator.

**Manual only — no CI equivalent; do not add a test that pretends to cover this.** Playwright does not set `env(safe-area-inset-*)`: the inset resolves to its `0px` fallback, and the sticky bar's `calc(0.75rem + var(--safe-bottom))` therefore yields a positive padding on every emulated device whether or not the variable exists. The first draft asserted `paddingBottom > 0` and would have passed on a build with the safe-area code deleted. This screenshot, looked at by a person, is the guard (`docs/STANDARDS.md` §5).

- [ ] **Step 6: Commit**

```bash
git add src/layouts src/components src/lib/copy.ts
git commit -m "feat: add base layout with safe-area insets and icon sprite"
```

---

### Task 4: The library — search, member helpers, phone formatting, collections

**Files:**
- Create: `src/lib/search.ts`, `src/lib/members.ts`, `src/lib/phone.ts`, `src/lib/collections.ts`, `tests/unit/factory.ts`
- Test: `tests/unit/search.test.ts`, `tests/unit/members.test.ts`, `tests/unit/phone.test.ts` — ten tests

**Interfaces:**
- Consumes: `Member`, `Category`, `Gender` (Task 2), `normalize` (Task 2), `agree` (Task 2), `COPY` (Task 3).
- Produces:
  - `type IndexEntry` — the client-side shape: `{ slug, nom, metier, accroche, genre, categories, nomsCategories, services, motsCles, photo, distance, note, nbAvis }`
  - `type SearchResult = { entry: IndexEntry; reason: string }`
  - `buildIndex(members: Member[], categories: Category[]): IndexEntry[]`
  - `search(index: IndexEntry[], query: string): SearchResult[]`
  - `hasAddress(member: Pick<Member, "distance">): boolean`
  - `sortByDistance<T extends Pick<Member, "distance">>(members: T[]): T[]`
  - `withCounts(categories: Category[], members: Member[]): CategoryWithCount[]` where `CategoryWithCount = Category & { count: number; genders: Gender[] }`
  - `formatMemberCount(count: number, genders: Gender[]): string`
  - `firstName(fullName: string): string`
  - `memberUrl(slug: string, site: string): string`
  - `formatTelHref(tel: string): string`, `formatTelDisplay(tel: string): string`
  - `loadMembers(): Promise<Member[]>`, `loadCategories(): Promise<Category[]>` — **the only `astro:content` importer in the project**

**Everything here is pure and takes its data as an argument**, except `collections.ts`. That is what makes it unit-testable without a build, and what lets `search.ts` be bundled into the browser (`docs/STANDARDS.md` §1). ESLint enforces it per-directory; `collections.ts` is named in the config as the single exception.

**Two rules this task exists to enforce.** The index carries the categories' `motsCles`, because the landing page advertises « stress, sommeil, énergie » and a search for *énergie* must not return nobody — the mockup had exactly that bug. And matching is accent- and case-insensitive, because French.

**The key for card shape is `distance !== '—'`, not `surCarte`.** Nadia Berrada has a pickup address and a real distance but no public map pin; keying on `surCarte` renders her as an itinerant, which is false. Found and fixed during mockup composition; `hasAddress` is where it stays fixed.

**One gendered count, not three.** The first draft had `compte()` in `NeedsIndex.astro` emitting no feminine form at all, a second, different implementation inline in `categorie/[slug].astro`, and two tests expecting « 1 voisine » — implementation and test disagreeing inside one document. `formatMemberCount` is the only one.

- [ ] **Step 1: Write the failing tests**

Units run on synthetic members built by one factory, not on the JSON: a test that goes red when Sandra adds a thirteenth neighbour is a false alarm with a countdown timer. The factory is a file rather than a copy in each spec — `sonarjs/no-identical-functions` only sees within a file and `jscpd src` does not scan `tests/`, so this one is on the author.

```typescript
// tests/unit/factory.ts
import type { Member } from "../../src/content/schemas";

/** A complete, invented member. Override only the field under test. */
export const member = (over: Partial<Member> = {}): Member => ({
  slug: "x", nom: "X", metier: "Métier", genre: "f", accroche: "", bio: "",
  categories: ["cat"], services: [], adresse: "", distance: "100 m",
  lat: null, lng: null, tel: null, email: null, site: null, instagram: null,
  photo: "x.jpg", note: 0, nbAvis: 0, surCarte: false, ...over,
});
```

```typescript
// tests/unit/search.test.ts
import { describe, it, expect } from "vitest";
import { buildIndex, search } from "../../src/lib/search";
import type { Category, Member } from "../../src/content/schemas";
import { member } from "./factory";

const members: Member[] = [
  member({ slug: "jules-martin", nom: "Jules Martin", metier: "Électricien", categories: ["travaux"] }),
  member({ slug: "alice-nguyen", nom: "Alice Nguyen", metier: "Sophrologue", categories: ["equilibre"] }),
];

const categories: Category[] = [
  { slug: "travaux", nom: "Artisanat & travaux", besoin: "Réparer chez moi", motsCles: ["dépannage"] },
  { slug: "equilibre", nom: "Santé & bien-être", besoin: "Retrouver l'équilibre", motsCles: ["énergie"] },
];

const index = buildIndex(members, categories);
const slugs = (query: string) => search(index, query).map((r) => r.entry.slug);

describe("Search", () => {
  it("Matches without the accents the typist did not type", () => {
    expect(slugs("electricien")).toEqual(["jules-martin"]);
    expect(slugs("Électricien")).toEqual(["jules-martin"]);
  });

  // The landing page advertises « Retrouver l'équilibre : stress, sommeil,
  // énergie ». No member text contains « énergie ». Without the category
  // keywords in the index the page contradicts itself — the mockup's own bug.
  it("Finds a neighbour through a keyword the landing page advertises", () => {
    expect(slugs("énergie")).toEqual(["alice-nguyen"]);
    expect(slugs("energie")).toEqual(["alice-nguyen"]);
  });

  it("Says why a result matched, in French", () => {
    expect(search(index, "sophrologue")[0].reason).toBe("son métier");
    expect(search(index, "énergie")[0].reason).toBe("le besoin");
  });

  it("Returns nothing for an empty or an absurd query", () => {
    expect(search(index, "   ")).toEqual([]);
    expect(search(index, "zzzzqqqq")).toEqual([]);
  });
});
```

```typescript
// tests/unit/members.test.ts
import { describe, it, expect } from "vitest";
import {
  formatMemberCount, hasAddress, memberUrl, sortByDistance, withCounts,
} from "../../src/lib/members";
import type { Category } from "../../src/content/schemas";
import { member } from "./factory";

describe("Member helpers", () => {
  // The reader's question is « is there somewhere to go? », and the answer
  // decides the card shape. surCarte answers a different question — « is there
  // a public pin on the plan » — and a pickup address has one without the other.
  it("Reads an address from the distance, never from surCarte", () => {
    expect(hasAddress(member({ distance: "210 m", surCarte: false }))).toBe(true);
    expect(hasAddress(member({ distance: "—", surCarte: false }))).toBe(false);
  });

  it("Sorts by distance and puts the itinerants last", () => {
    const ordered = sortByDistance([
      member({ slug: "far", distance: "1,2 km" }),
      member({ slug: "itinerant", distance: "—" }),
      member({ slug: "near", distance: "60 m" }),
    ]);
    expect(ordered.map((m) => m.slug)).toEqual(["near", "far", "itinerant"]);
  });

  // The empty category stays in the list and is shown greyed. Hiding it would
  // hide the one place a visitor can say « I know someone for this ».
  it("Counts a category without dropping the empty one", () => {
    const categories: Category[] = [
      { slug: "a", nom: "A", besoin: "Besoin A", motsCles: ["a"] },
      { slug: "vide", nom: "Vide", besoin: "Besoin vide", motsCles: ["v"] },
    ];
    const counted = withCounts(categories, [member({ categories: ["a"] })]);
    expect(counted.map((c) => c.count)).toEqual([1, 0]);
    expect(counted[0].genders).toEqual(["f"]);
  });

  it("Agrees the count with the gender of who is counted", () => {
    expect(formatMemberCount(1, ["f"])).toBe("1 voisine");
    expect(formatMemberCount(1, ["h"])).toBe("1 voisin");
    expect(formatMemberCount(0, [])).toBe("personne encore inscrit·e");
  });

  it("Keeps the plural feminine only when nobody in the group is masculine", () => {
    expect(formatMemberCount(3, ["f", "f", "f"])).toBe("3 voisines");
    expect(formatMemberCount(3, ["f", "h", "f"])).toBe("3 voisins");
  });

  // The QR code printed on a counter encodes this string. It must not move.
  it("Builds the profile URL the QR code encodes", () => {
    expect(memberUrl("alice-nguyen", "https://annuaire.lacartoucherie.fr")).toBe(
      "https://annuaire.lacartoucherie.fr/membre/alice-nguyen"
    );
  });
});
```

```typescript
// tests/unit/phone.test.ts
import { describe, it, expect } from "vitest";
import { formatTelHref } from "../../src/lib/phone";

describe("Phone formatting", () => {
  // A tel: href must be international or some Android dialers drop it, and the
  // digits are typed by hand into the JSON in the French grouped form.
  it("Turns a French number into an international tel: target", () => {
    expect(formatTelHref("06 12 34 56 78")).toBe("+33612345678");
    expect(formatTelHref("0612345678")).toBe("+33612345678");
  });
});
```

- [ ] **Step 2: Run them to make sure they fail**

Run: `npx vitest run tests/unit/search.test.ts tests/unit/members.test.ts tests/unit/phone.test.ts`
Expected: FAIL — none of the three modules exists.

- [ ] **Step 3: Write `src/lib/search.ts`**

```typescript
// src/lib/search.ts
// Bundled into the browser: no astro:*, no node:*, no DOM. One matcher runs on
// both sides, because two implementations drift and the page then advertises a
// keyword the search cannot find.
import type { Category, Gender, Member } from "../content/schemas";
import { normalize } from "./text";

export type IndexEntry = {
  slug: string;
  nom: string;
  metier: string;
  accroche: string;
  genre: Gender;
  categories: string[];
  nomsCategories: string[];
  services: string[];
  motsCles: string[];
  photo: string;
  distance: string;
  note: number;
  nbAvis: number;
};

export type SearchResult = { entry: IndexEntry; reason: string };

/** Contact details are deliberately absent: the index is a public file. */
export function buildIndex(members: Member[], categories: Category[]): IndexEntry[] {
  const bySlug = new Map(categories.map((c) => [c.slug, c]));
  return members.map((m) => {
    const cats = m.categories.map((slug) => bySlug.get(slug)).filter((c) => c !== undefined);
    return {
      slug: m.slug,
      nom: m.nom,
      metier: m.metier,
      accroche: m.accroche,
      genre: m.genre,
      categories: m.categories,
      nomsCategories: cats.map((c) => c.nom),
      services: m.services,
      motsCles: [...new Set(cats.flatMap((c) => [...c.motsCles, c.besoin]))],
      photo: m.photo,
      distance: m.distance,
      note: m.note,
      nbAvis: m.nbAvis,
    };
  });
}

type Field = {
  key: "nom" | "metier" | "services" | "nomsCategories" | "motsCles" | "accroche";
  reason: string;
  weight: number;
};

const FIELDS: Field[] = [
  { key: "nom", reason: "son nom", weight: 100 },
  { key: "metier", reason: "son métier", weight: 80 },
  { key: "services", reason: "ses prestations", weight: 60 },
  { key: "nomsCategories", reason: "sa catégorie", weight: 40 },
  { key: "motsCles", reason: "le besoin", weight: 30 },
  { key: "accroche", reason: "sa présentation", weight: 20 },
];

function bestField(entry: IndexEntry, query: string): Field | null {
  let best: Field | null = null;
  for (const field of FIELDS) {
    const value = entry[field.key];
    const texts = Array.isArray(value) ? value : [value];
    if (texts.some((t) => normalize(t).includes(query)) && (!best || field.weight > best.weight)) {
      best = field;
    }
  }
  return best;
}

export function search(index: IndexEntry[], query: string): SearchResult[] {
  const q = normalize(query);
  if (q.length === 0) return [];

  const scored: { entry: IndexEntry; reason: string; weight: number }[] = [];
  for (const entry of index) {
    const field = bestField(entry, q);
    if (field) scored.push({ entry, reason: field.reason, weight: field.weight });
  }

  return scored
    .sort((a, b) => b.weight - a.weight || a.entry.nom.localeCompare(b.entry.nom, "fr"))
    .map(({ entry, reason }) => ({ entry, reason }));
}
```

- [ ] **Step 4: Write `src/lib/members.ts` and `src/lib/phone.ts`**

```typescript
// src/lib/members.ts
import type { Category, Gender, Member } from "../content/schemas";
import { COPY } from "./copy";
import { agree } from "./gender";

export type CategoryWithCount = Category & { count: number; genders: Gender[] };

/** « — » is the data's way of saying « nowhere to go »: she comes to you. */
export function hasAddress(member: Pick<Member, "distance">): boolean {
  return member.distance.trim() !== "—";
}

function metres(distance: string): number {
  if (!hasAddress({ distance })) return Number.POSITIVE_INFINITY;
  const value = Number.parseFloat(distance.replace(",", "."));
  return distance.includes("km") ? value * 1000 : value;
}

export function sortByDistance<T extends Pick<Member, "distance">>(members: T[]): T[] {
  return [...members].sort((a, b) => metres(a.distance) - metres(b.distance));
}

/** Every category, counted. The empty one stays: it is shown, not hidden. */
export function withCounts(categories: Category[], members: Member[]): CategoryWithCount[] {
  return categories.map((c) => {
    const inCategory = members.filter((m) => m.categories.includes(c.slug));
    return { ...c, count: inCategory.length, genders: inCategory.map((m) => m.genre) };
  });
}

/**
 * « 1 voisine », « 4 voisins », « personne encore inscrit·e ».
 * French keeps the feminine plural only when no masculine is in the group.
 */
export function formatMemberCount(count: number, genders: Gender[]): string {
  if (count === 0) return COPY.countNobody;
  const feminine = genders.length > 0 && genders.every((g) => g === "f");
  const noun = agree(feminine ? "f" : "h", "voisine");
  return count === 1 ? `${count} ${noun}` : `${count} ${noun}s`;
}

/** « Appeler Camille » is warmer than « Appeler ». The schema has no first name. */
export function firstName(fullName: string): string {
  return fullName.trim().split(" ")[0];
}

/** The stable public URL of a profile — what the printed QR code encodes. */
export function memberUrl(slug: string, site: string): string {
  return new URL(`/membre/${slug}`, site).href;
}
```

```typescript
// src/lib/phone.ts
/**
 * Phone formatting, extracted from CallButton's frontmatter where it lived as
 * `"+33" + tel.replace(/\s+/g, "").slice(1)`. Frontmatter binds data; a regex
 * and a format belong here (docs/STANDARDS.md §1).
 */
export function formatTelHref(tel: string): string {
  return `+33${tel.replace(/\D/g, "").slice(1)}`;
}

/** The French reading form: « 06 12 34 56 78 ». */
export function formatTelDisplay(tel: string): string {
  return tel.replace(/\D/g, "").replace(/(\d\d)(?=\d)/g, "$1 ");
}
```

- [ ] **Step 5: Write `src/lib/collections.ts`**

```typescript
// src/lib/collections.ts
// THE ONLY file in the project that may import astro:content. Everything else
// takes Member[] and Category[] as arguments, which is what keeps src/lib
// unit-testable without a build and search.ts shippable to the browser.
import { getCollection } from "astro:content";
import type { Category, Member } from "../content/schemas";

export async function loadMembers(): Promise<Member[]> {
  return (await getCollection("members")).map((entry) => entry.data);
}

export async function loadCategories(): Promise<Category[]> {
  return (await getCollection("categories")).map((entry) => entry.data);
}
```

- [ ] **Step 6: Run the tests and the lint**

Run: `npm test && npm run lint`
Expected: 13 tests PASS (3 from Task 2, 10 here). ESLint is silent — in particular it does not report a restricted import, which would mean a helper reached for `astro:content` outside `collections.ts`.

- [ ] **Step 7: Commit**

```bash
git add src/lib tests/unit
git commit -m "feat: add search index, member helpers and phone formatting"
```

---

### Task 5: The member blocks — card, row, category chip, call button

**Files:**
- Create: `src/components/MemberCard.astro`, `src/components/MemberRow.astro`, `src/components/CategoryChip.astro`, `src/components/CallButton.astro`
- Test: none — the logic these used to carry now lives in `src/lib` and is tested there. Verify shape.

**Interfaces:**
- Consumes: `hasAddress`, `firstName`, `formatTelHref`, `formatTelDisplay` (Task 4), `Member` (Task 2), `Icon` and `COPY` (Task 3).
- Produces:
  - `MemberCard` props `{ member: Member; priority?: boolean }`
  - `MemberRow` props `{ member: Member; categories?: Category[] }` — the category list is passed in so the chip can show « Santé & bien-être » rather than `sante-bien-etre`
  - `CategoryChip` props `{ slug: string; nom: string }` → an `<a href="/categorie/{slug}">` at ≥44px
  - `CallButton` props `{ member: Member; sticky?: boolean; withNumber?: boolean }`

**Why no test file.** The first draft's `composants-voisin.test.ts` rendered these through `experimental_AstroContainer` and asserted `expect(html).not.toContain("truncate")` and `toContain("rounded-full")` — class names, which the standards ban asserting on: the first passes if someone hand-writes `overflow-hidden text-ellipsis`, and both go red on a rename that is not a defect. The one real decision in the file was the `tel:` format, and that decision moved into `formatTelHref`, where Task 4 tests it properly. What is left is markup, verified by rendering it.

**Component authority:** `docs/mockups/final/styleguide.html` blocks **12** (card and row), **20** (chips and buttons) and **18** (the call bar). Copy the markup; adapt only the data binding.

**Three defects the styleguide itself carried — do not reintroduce them:**
1. Block 12's full card upscaled a 128px portrait ×2.7 at 390px, contradicting the ×1.4 rule three paragraphs above it. Cap the column width so the measured upscale stays ≤×1.4.
2. The list row shipped with no category routes, although categories-as-routes is a settled decision.
3. Category chips rendered as non-tappable `<span>` at ~34px. They are `<a>` elements at ≥44px.

- [ ] **Step 1: Write `CallButton.astro`**

```astro
---
// src/components/CallButton.astro
import Icon from "./Icon.astro";
import { COPY } from "../lib/copy";
import { firstName } from "../lib/members";
import { formatTelDisplay, formatTelHref } from "../lib/phone";
import type { Member } from "../content/schemas";

interface Props { member: Member; sticky?: boolean; withNumber?: boolean }
const { member, sticky = false, withNumber = false } = Astro.props;

const href = member.tel ? formatTelHref(member.tel) : null;
const label = withNumber && member.tel ? formatTelDisplay(member.tel) : firstName(member.nom);
---
{href && (sticky ? (
  <div
    class="fixed inset-x-0 bottom-0 z-40 border-t border-neutre-200 bg-white/95 px-4 pt-3 backdrop-blur-sm"
    style="padding-bottom: calc(0.75rem + var(--safe-bottom));"
  >
    <a
      href={`tel:${href}`}
      class="cta flex min-h-[52px] items-center justify-center gap-2 rounded-field px-5 font-semibold"
    >
      <Icon name="telephone" class="size-5" />
      {COPY.profileCall} {label}
    </a>
  </div>
) : (
  <a
    href={`tel:${href}`}
    class="cta inline-flex min-h-[48px] items-center justify-center gap-2 rounded-field px-5 font-semibold"
  >
    <Icon name="telephone" class="size-5" />
    {withNumber ? label : COPY.profileCall}
  </a>
))}
```

A member with `tel: null` renders nothing at all — no dead button, no `href="null"`.

- [ ] **Step 2: Write `CategoryChip.astro`**

```astro
---
// src/components/CategoryChip.astro
interface Props { slug: string; nom: string }
const { slug, nom } = Astro.props;
---
<a
  href={`/categorie/${slug}`}
  class="chip inline-flex min-h-[44px] items-center rounded-selector px-3.5 text-[16px] font-semibold"
>
  {nom}
</a>
```

- [ ] **Step 3: Write `MemberCard.astro` and `MemberRow.astro`**

Lift the markup from styleguide block 12 and bind `member.*`. Both:

- choose rectangle or disc on `hasAddress(member)`, never on `member.surCarte`
- render `<img src={`/portraits/${member.photo}`} alt={`Portrait de ${member.nom}`} width="128" height="128" loading={priority ? "eager" : "lazy"} decoding="async" />` — a plain `<img>` from `public/`, sized so the browser reserves the box and CLS stays at zero
- wrap the whole card in one `<a href={`/membre/${member.slug}`}>` so the tap target is the card, not the name
- never apply `truncate` to `member.nom`

`MemberCard` carries no chips — the card is one tap target and a chip inside a link is a link inside a link. `MemberRow` renders them, resolving each slug through the `categories` prop.

```astro
---
// src/components/MemberCard.astro — frontmatter binds, it does not compute
import { COPY } from "../lib/copy";
import { hasAddress } from "../lib/members";
import type { Member } from "../content/schemas";

interface Props { member: Member; priority?: boolean }
const { member, priority = false } = Astro.props;
const fixed = hasAddress(member);
---
<a href={`/membre/${member.slug}`} class="carte-lien block">
  <article class="carte rounded-box bg-white p-4 shadow-carte">
    <img
      src={`/portraits/${member.photo}`}
      alt={`Portrait de ${member.nom}`}
      width="128"
      height="128"
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      class={fixed ? "w-full max-w-[176px] rounded-box object-cover" : "size-[112px] rounded-full object-cover"}
    />
    <h3 class="ff mt-3 text-nom text-teal-900">{member.nom}</h3>
    <p class="text-corps text-neutre-700">{member.metier}</p>
    <p class="mt-1 text-[16px] text-neutre-600">{fixed ? member.distance : COPY.mapTheyComeToYou}</p>
  </article>
</a>
```

`MemberRow.astro` is the dense variant of the same binding: a 72px portrait on the left, name and trade stacked, and — outside the row's own link, so no link nests inside another — a second line of `CategoryChip`s built from the `categories` prop:

```astro
---
// src/components/MemberRow.astro
import CategoryChip from "./CategoryChip.astro";
import type { Category, Member } from "../content/schemas";

interface Props { member: Member; categories?: Category[] }
const { member, categories = [] } = Astro.props;
const chips = categories.filter((c) => member.categories.includes(c.slug));
---
<div class="carte rounded-box bg-white p-3 shadow-carte">
  <a href={`/membre/${member.slug}`} class="flex items-center gap-3">
    <img
      src={`/portraits/${member.photo}`}
      alt={`Portrait de ${member.nom}`}
      width="128"
      height="128"
      loading="lazy"
      decoding="async"
      class="size-[72px] shrink-0 rounded-box object-cover"
    />
    <span class="min-w-0">
      <span class="ff block text-nom text-teal-900">{member.nom}</span>
      <span class="block text-corps text-neutre-700">{member.metier}</span>
    </span>
  </a>
  {chips.length > 0 && (
    <div class="mt-2 flex flex-wrap gap-2">
      {chips.map((c) => <CategoryChip slug={c.slug} nom={c.nom} />)}
    </div>
  )}
</div>
```

- [ ] **Step 4: Verify the render and the upscale ceiling**

Build a throwaway `src/pages/_blocks.astro` rendering both components for three fixture members — one with an address, one itinerant, one without a phone — then:

```bash
npm run build
npx astro preview --port 4321 & PREVIEW=$!
npx playwright screenshot --device="Galaxy S9+" http://localhost:4321/_blocks /tmp/blocks.png
kill $PREVIEW
```

Open `/tmp/blocks.png` against styleguide block 12 and confirm the shape, spacing and type scale match, that the itinerant renders as a disc, and that the member without a phone shows no call button.

Then measure the upscale, which is a number and not a matter of taste:

```bash
npx playwright screenshot --device="Galaxy S9+" --full-page http://localhost:4321/_blocks /tmp/blocks-full.png
node -e "console.log('open the page in a browser at 390px and run the snippet below')"
```

In the browser console at 390px wide:

```javascript
[...document.querySelectorAll("img[alt^='Portrait']")].map((i) => ({
  alt: i.alt,
  rendered: i.getBoundingClientRect().width,
  natural: i.naturalWidth,
  factor: +(i.getBoundingClientRect().width / i.naturalWidth).toFixed(2),
}));
```

Expected: every `factor` ≤ 1.40. Delete `_blocks.astro` once verified.

**On responsive image formats.** Spec §5 calls for the build to emit AVIF/WebP variants. Portraits are served from `public/`, which Astro does not process, and `astro:assets`' `image()` schema helper is only available inside `defineCollection`'s callback — which this project cannot use, because the schemas own the types and import `z` from `zod`. v1 therefore ships plain sized JPEGs at 128px, which is 6 KB each and well inside the budgets. The AVIF/WebP pipeline arrives with R2 (spec §5), when portraits stop being files in a directory. Recorded here as a deliberate deferral, not an oversight.

- [ ] **Step 5: Commit**

```bash
git add src/components
git commit -m "feat: add member card, row, category chip and call button"
```

---
### Task 6: The needs index, the search bar, the Colly panel

**Files:**
- Create: `src/components/NeedsIndex.astro`, `src/components/SearchBar.astro`, `src/components/CollyPanel.astro`
- Copy: `docs/mockups/_shared/colly/*.png` → `public/colly/`
- Test: none — the two decisions in this task (the gendered count, the kept empty category) are tested in `src/lib/members.ts` by Task 4, and their rendering is asserted by Task 8. Verify shape.

**Interfaces:**
- Consumes: `withCounts`, `formatMemberCount` (Task 4), `Icon` and `COPY` (Task 3).
- Produces:
  - `NeedsIndex` props `{ categories: CategoryWithCount[] }`
  - `SearchBar` props `{ withColly?: boolean; value?: string; action?: string }`
  - `CollyPanel` props `{ pose: "couleur" | "salut" | "joyeux" | "triste"; title: string; text: string }`

**Authority:** styleguide blocks **11** (the numbered index), **10** (search bar, with and without Colly), **19** (Colly states).

**The index is the compacted version** — 582px at 390px wide, versus ~1100px in the typography-led design it came from. The compaction came from moving the keyword gloss off the display line, not from cutting content: line 1 is the need phrase at 19px, line 2 is the keywords plus the count at 16px. The keywords are the reason the index was chosen; they stay.

**The empty category is shown, not hidden.** `Enfance & éducation` has no members and renders greyed as entry 10, with « personne encore inscrit·e — vous connaissez quelqu'un ? » routing to a `mailto:`. That is the one place a visitor can offer a name.

**Colly's three pencil sketches are opaque paper.** They are blended with `.croquis` (`mix-blend-mode: multiply` + greyscale) so the paper becomes the panel colour and only the graphite survives. `colly-couleur.png` is the only transparent, colour asset and appears at most once per page.

- [ ] **Step 1: Copy the mascot assets**

```bash
mkdir -p public/colly && cp docs/mockups/_shared/colly/*.png public/colly/
```

- [ ] **Step 2: Write `NeedsIndex.astro`**

The 01–10 numbering is a CSS counter, not a `padStart` helper in frontmatter — frontmatter binds data, it does not compute it.

```astro
---
// src/components/NeedsIndex.astro
import { COPY } from "../lib/copy";
import { formatMemberCount } from "../lib/members";
import type { CategoryWithCount } from "../lib/members";

interface Props { categories: CategoryWithCount[] }
const { categories } = Astro.props;
const mailto = (nom: string) =>
  `mailto:${COPY.contactEmail}?subject=${encodeURIComponent(`Un voisin pour « ${nom} »`)}`;
---
<ol class="mt-2 [counter-reset:besoin]">
  {categories.map((c) => (
    <li class="border-b border-neutre-200 last:border-0 [counter-increment:besoin]">
      {c.count === 0 ? (
        <div class="flex gap-3 px-1 py-1.5">
          <span class="num tnum mt-1 w-7 shrink-0 text-etiquette text-neutre-500 before:content-[counter(besoin,decimal-leading-zero)]"></span>
          <div class="min-w-0">
            <p class="ff text-besoin text-neutre-500">{c.besoin}</p>
            <p class="mt-0.5 text-[16px] leading-[1.15] text-neutre-700">
              {c.nom} · {formatMemberCount(c.count, c.genders)} —{" "}
              <a class="underline decoration-teal-400 underline-offset-2" href={mailto(c.nom)}>
                {COPY.searchSuggest}
              </a>
            </p>
          </div>
        </div>
      ) : (
        <a href={`/categorie/${c.slug}`} class="besoin flex min-h-[44px] gap-3 px-1 py-1.5">
          <span class="num tnum mt-1 w-7 shrink-0 text-etiquette text-teal-600 before:content-[counter(besoin,decimal-leading-zero)]"></span>
          <span class="min-w-0 flex-1">
            <span class="ff block text-besoin text-teal-900">{c.besoin}</span>
            <span class="mt-0.5 block text-[16px] leading-[1.15] text-neutre-700">
              {c.motsCles.slice(0, 3).join(", ")} · {formatMemberCount(c.count, c.genders)}
            </span>
          </span>
        </a>
      )}
    </li>
  ))}
</ol>
```

- [ ] **Step 3: Write `SearchBar.astro` and `CollyPanel.astro`**

From styleguide blocks 10 and 19. `SearchBar` renders:

- a real `<label for="q">` carrying `COPY.searchLabel`, visually hidden when `withColly` is set because Colly's speech line already labels the field
- `<input type="search" id="q" name="q" class="text-[17px]" placeholder={COPY.searchPlaceholder}>` — **at or above 16px, or iOS Safari zooms the whole page on focus**
- the « Trouver » button as the orange CTA, at ≥44px
- `<form action={action ?? "/annuaire"} method="get">` so the field works with JavaScript disabled; Task 12 intercepts it for live filtering
- `data-search-form` and `data-search-input` hooks for that script

`CollyPanel` applies `.colly-fond` and, for the three pencil poses, `.croquis`; `pose="couleur"` renders the colour asset and must appear at most once per page.

- [ ] **Step 4: Verify the index height against the mockup's 582px**

```bash
npm run build
npx astro preview --port 4321 & PREVIEW=$!
npx playwright screenshot --device="Galaxy S9+" http://localhost:4321/ /tmp/index-besoins.png
kill $PREVIEW
```

Render the index alone on a throwaway page if `/` is not ready yet, and measure in the browser at 390px:

```javascript
document.querySelector("ol").getBoundingClientRect().height;
```

Expected: ≤ 600px, the numbers reading 01 through 10, the tenth row greyed and carrying a `mailto:` link.

- [ ] **Step 5: Commit**

```bash
git add src/components public/colly
git commit -m "feat: add needs index, search bar and Colly panel"
```

---

### Task 7: The landing page

**Files:**
- Create: `src/pages/index.astro`, `tests/e2e/fixture.ts`, `tests/e2e/landing.spec.ts`
- Modify: `src/lib/copy.ts` if a landing string is still missing
- Test: `tests/e2e/landing.spec.ts` — one test

**Interfaces:**
- Consumes: everything from Tasks 3–6; `loadMembers`, `loadCategories`, `withCounts`, `sortByDistance` (Task 4).
- Produces: the `/` route, and `tests/e2e/fixture.ts` — the property-based selector helper every later e2e spec imports.

**Composition authority:** `docs/mockups/final/index.html`. Order: header → « Je cherche… » + intro → search bar with Colly on the rim → the numbered index → « Vos voisins » (six real faces, with the legend explaining the disc) → « Parcourir autrement » (list and map as two equal lenses) → one Colly panel → footer.

**The legend is not decoration.** « Le portrait rond veut dire que la personne se déplace : il n'y a pas d'adresse où aller. » makes the card-shape rule readable instead of arbitrary.

**Why one test.** The first draft gave this page seven, of which « ne défile jamais horizontalement » was the first of eight identical copies across the suite (Task 15 keeps exactly one), « ne montre jamais plus de trois objets orange » counted `.cta, .filet` elements — a proxy that a rename games and a redesign breaks — and « affiche Colly » asserted that an `<img>` the page contains is present. What survives is the one measurable product rule this page can break on its own: a blurry face destroys the trust the page is built to create.

- [ ] **Step 1: Write the fixture selector helper**

E2E specs never name a member. They ask the fixture for one with the property under test, so the suite survives the fixture being rewritten — and Task 14 replaces the real content entirely.

```typescript
// tests/e2e/fixture.ts
// Property-based selectors over the fictional fixture. No spec hardcodes a slug:
// the fixture is data, and data changes.
import { readFileSync } from "node:fs";
import type { Member } from "../../src/content/schemas";

const raw = readFileSync("tests/fixtures/members.json", "utf-8");
export const members: Member[] = (JSON.parse(raw) as { membres: Member[] }).membres;

function pick(predicate: (m: Member) => boolean, what: string): Member {
  const found = members.find(predicate);
  if (!found) throw new Error(`fixture: no member ${what}`);
  return found;
}

/** Full contact card: phone, email, site and Instagram all present. */
export const fullyContactable = pick(
  (m) => Boolean(m.tel && m.email && m.site && m.instagram),
  "with every contact field"
);

/** Her profile must read « Ce qu'elle propose » and « Où la trouver ». */
export const feminine = pick((m) => m.genre === "f" && Boolean(m.tel), "feminine with a phone");

/** His profile must read « Ce qu'il propose » and must render no site row. */
export const masculineWithoutSite = pick(
  (m) => m.genre === "h" && m.site === null,
  "masculine without a website"
);

/** No address to go to: the disc portrait, and « Ils viennent chez vous ». */
export const itinerant = pick((m) => m.distance === "—", "without an address");

// Every export here is used by a spec. An unused one is a selector nobody needs:
// delete it rather than keeping it « for later ».
```

- [ ] **Step 2: Write the failing test**

```typescript
// tests/e2e/landing.spec.ts
import { expect, test } from "@playwright/test";

test("Shows real faces and never blurs one by enlarging it", async ({ page }) => {
  await page.goto("/");
  const portraits = page.locator("img[alt^='Portrait']");
  await expect(portraits.first()).toBeVisible();

  const factors = await portraits.evaluateAll((images) =>
    images.map((i) => {
      const img = i as HTMLImageElement;
      return img.getBoundingClientRect().width / img.naturalWidth;
    })
  );
  expect(factors.length).toBeGreaterThanOrEqual(6);
  for (const factor of factors) expect(factor).toBeLessThanOrEqual(1.4);
});
```

- [ ] **Step 3: Run it to make sure it fails**

Run: `npm run build && npm run test:e2e -- landing`
Expected: FAIL — `/` is still Task 0's placeholder and has no portraits.

- [ ] **Step 4: Write the page**

```astro
---
// src/pages/index.astro
import BaseLayout from "../layouts/BaseLayout.astro";
import SearchBar from "../components/SearchBar.astro";
import NeedsIndex from "../components/NeedsIndex.astro";
import MemberCard from "../components/MemberCard.astro";
import CollyPanel from "../components/CollyPanel.astro";
import { COPY } from "../lib/copy";
import { loadCategories, loadMembers } from "../lib/collections";
import { hasAddress, sortByDistance, withCounts } from "../lib/members";

const [members, categories] = await Promise.all([loadMembers(), loadCategories()]);
const counted = withCounts(categories, members);

// Six faces, and at least two of them itinerant so the disc variant is visible
// and the legend below them is true rather than decorative.
const nearest = sortByDistance(members);
const itinerants = nearest.filter((m) => !hasAddress(m)).slice(0, 2);
const featured = [...nearest.filter((m) => hasAddress(m)).slice(0, 4), ...itinerants];
---
<BaseLayout title="Annuaire de la Cartoucherie" description={COPY.homeIntro}>
  <div class="mx-auto max-w-3xl px-4 py-6">
    <h1 class="ff text-enorme text-teal-900">{COPY.homeTitle}</h1>
    <p class="mt-2 text-chapo text-neutre-700">{COPY.homeIntro}</p>

    <div class="mt-5"><SearchBar withColly={true} /></div>

    <p class="mt-8 text-etiquette uppercase text-neutre-600">{COPY.homeOrPick}</p>
    <NeedsIndex categories={counted} />

    <h2 class="ff mt-10 text-grand text-teal-900">{COPY.homeNeighbours}</h2>
    <div class="mt-4 grid grid-cols-2 gap-3">
      {featured.map((m, i) => <MemberCard member={m} priority={i === 0} />)}
    </div>
    <p class="mt-3 text-[16px] text-neutre-600">{COPY.discLegend}</p>

    <h2 class="ff mt-10 text-grand text-teal-900">{COPY.homeBrowseOtherwise}</h2>
    <div class="mt-4 grid grid-cols-2 gap-3">
      <a class="carte rounded-box bg-white p-4 shadow-carte" href="/annuaire">Tout le quartier</a>
      <a class="carte rounded-box bg-white p-4 shadow-carte" href="/carte">{COPY.mapTitle}</a>
    </div>

    <div class="mt-10">
      <CollyPanel pose="salut" title="Colly, la voisine à quatre pattes" text={COPY.homeCollySays} />
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 5: Run the test**

Run: `npm run build && npm run test:e2e -- landing`
Expected: PASS on Galaxy S9+.

- [ ] **Step 6: Verify against the mockup, side by side**

```bash
npm run build
npx astro preview --port 4321 & PREVIEW=$!
google-chrome --headless --disable-gpu --no-sandbox --hide-scrollbars \
  --window-size=390,2600 --virtual-time-budget=15000 \
  --screenshot=/tmp/rendered.png http://localhost:4321/
google-chrome --headless --disable-gpu --no-sandbox --hide-scrollbars \
  --window-size=390,2600 --virtual-time-budget=15000 \
  --screenshot=/tmp/mockup.png docs/mockups/final/index.html
magick /tmp/mockup.png /tmp/rendered.png +append /tmp/comparison.png
kill $PREVIEW
```

Open `/tmp/comparison.png`. Differences in member data are expected; **differences in type scale, colour, spacing rhythm or component shape are defects** — fix them before committing. This check is better *because* it is manual: it is the one where the diff can be correct and the page still wrong.

- [ ] **Step 7: Commit**

```bash
git add src/pages/index.astro tests/e2e
git commit -m "feat: add landing page with needs index and neighbour portraits"
```

---

### Task 8: The directory and the category pages

**Files:**
- Create: `src/pages/annuaire.astro`, `src/pages/categorie/[slug].astro`, `src/client/category-filter.ts`, `tests/e2e/directory.spec.ts`
- Test: `tests/e2e/directory.spec.ts` — two tests

**Interfaces:**
- Consumes: `MemberRow`, `CategoryChip` (Task 5), `SearchBar` (Task 6), `loadMembers`, `loadCategories`, `withCounts`, `formatMemberCount` (Task 4).
- Produces: `/annuaire` and one static page per category — `getStaticPaths` emits ten routes — plus the `data-cat` attribute the filter script reads.

**One system, not two.** The search field and the category chips must read as refinements of one control, not as rival mechanisms. `/categorie/[slug]` is a prerendered page; `/annuaire?cat=…` narrows the same list client-side. Both render `MemberRow`.

**Two tests, for two decisions.** That an empty category explains itself rather than 404ing or disappearing, and that filtering happens in place rather than by navigation. The first draft's other five asserted a member count that changes when Sandra adds someone, the presence of the search field, and a chip's `href` — an attribute the page's own markup declares one line away.

- [ ] **Step 1: Write the failing tests**

```typescript
// tests/e2e/directory.spec.ts
import { expect, test } from "@playwright/test";
import { members } from "./fixture";

// The category nobody has joined yet. Derived, never hardcoded.
const emptySlug = (() => {
  const used = new Set(members.flatMap((m) => m.categories));
  const all = ["sante-bien-etre", "beaute-soins", "artisanat-travaux", "alimentation-traiteur",
    "conseil-entreprise", "numerique-creation", "enfance-education", "sport-mouvement",
    "art-culture", "services-domicile"];
  const empty = all.find((slug) => !used.has(slug));
  if (!empty) throw new Error("fixture: every category has a member; this test needs an empty one");
  return empty;
})();

const busiest = (() => {
  const counts = new Map<string, number>();
  for (const m of members) for (const c of m.categories) counts.set(c, (counts.get(c) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
})();

test("An empty category explains itself instead of being a dead page", async ({ page }) => {
  await page.goto(`/categorie/${emptySlug}`);
  await expect(page.getByText(/personne encore inscrit/)).toBeVisible();
  await expect(page.locator("a[href^='mailto:']")).toBeVisible();
});

test("Filtering by category narrows the directory in place, without a reload", async ({ page }) => {
  const [slug, count] = busiest;
  await page.goto("/annuaire");
  await expect(page.locator("[data-member]")).toHaveCount(members.length);

  await page.locator(`[data-filter='${slug}']`).click();
  await expect(page.locator("[data-member]:visible")).toHaveCount(count);
  await expect(page).toHaveURL(new RegExp(`cat=${slug}`));
});
```

- [ ] **Step 2: Run them to make sure they fail**

Run: `npm run build && npm run test:e2e -- directory`
Expected: FAIL — neither route exists.

- [ ] **Step 3: Write `/categorie/[slug].astro`**

```astro
---
// src/pages/categorie/[slug].astro
import BaseLayout from "../../layouts/BaseLayout.astro";
import MemberRow from "../../components/MemberRow.astro";
import SearchBar from "../../components/SearchBar.astro";
import { COPY } from "../../lib/copy";
import { loadCategories, loadMembers } from "../../lib/collections";
import { formatMemberCount, withCounts } from "../../lib/members";

export async function getStaticPaths() {
  const [members, categories] = await Promise.all([loadMembers(), loadCategories()]);
  return withCounts(categories, members).map((category) => ({
    params: { slug: category.slug },
    props: {
      category,
      categories,
      neighbours: members.filter((m) => m.categories.includes(category.slug)),
    },
  }));
}

const { category, categories, neighbours } = Astro.props;
const count = formatMemberCount(category.count, category.genders);
const mailto = `mailto:${COPY.contactEmail}?subject=${encodeURIComponent(`Un voisin pour « ${category.nom} »`)}`;
---
<BaseLayout title={`${category.nom} — Annuaire de la Cartoucherie`} description={category.besoin}>
  <div class="mx-auto max-w-3xl px-4 py-6">
    <p class="text-etiquette uppercase text-neutre-600">{COPY.homeTitle}</p>
    <h1 class="ff mt-1 text-grand text-teal-900">{category.besoin}</h1>
    <p class="mt-1 text-corps text-neutre-700">{category.nom} · {count}</p>

    {/* The search field stays present everywhere: one mechanism, not two rival controls. */}
    <div class="mt-5"><SearchBar /></div>

    {category.count === 0 ? (
      <div class="colly-fond mt-6 rounded-box p-5">
        <p class="text-corps">{COPY.categoryNobody}</p>
        <a
          class="mt-3 inline-flex min-h-[44px] items-center font-semibold text-teal-800 underline"
          href={mailto}
        >
          {COPY.searchSuggest}
        </a>
      </div>
    ) : (
      <ul class="mt-5 space-y-3">
        {neighbours.map((m) => (
          <li data-member data-cat={m.categories.join(" ")}>
            <MemberRow member={m} categories={categories} />
          </li>
        ))}
      </ul>
    )}

    <p class="mt-8">
      <a class="font-semibold text-teal-800 underline" href="/annuaire">{COPY.directoryAll}</a>
    </p>
  </div>
</BaseLayout>
```

- [ ] **Step 4: Write `/annuaire.astro` and its filter script**

The page renders every member once, each `<li>` carrying `data-member` and `data-cat="slug slug"`. The chip rail is real `<a href="/categorie/…">` links carrying `data-filter="slug"`, so the page works with JavaScript disabled and the script only upgrades it.

```astro
---
// src/pages/annuaire.astro
import BaseLayout from "../layouts/BaseLayout.astro";
import MemberRow from "../components/MemberRow.astro";
import SearchBar from "../components/SearchBar.astro";
import { COPY } from "../lib/copy";
import { loadCategories, loadMembers } from "../lib/collections";
import { formatMemberCount, withCounts } from "../lib/members";

const [members, categories] = await Promise.all([loadMembers(), loadCategories()]);
const counted = withCounts(categories, members);
---
<BaseLayout title="Tout le quartier — Annuaire de la Cartoucherie" description={COPY.homeIntro}>
  <div class="mx-auto max-w-3xl px-4 py-6">
    <h1 class="ff text-grand text-teal-900">{COPY.directoryAll}</h1>
    <div class="mt-5"><SearchBar /></div>

    <div class="mt-5 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
      {counted.map((c) => (
        <a
          href={`/categorie/${c.slug}`}
          data-filter={c.slug}
          class="chip inline-flex min-h-[44px] shrink-0 items-center rounded-selector px-3.5 text-[16px] font-semibold"
        >
          {c.nom} · {formatMemberCount(c.count, c.genders)}
        </a>
      ))}
    </div>

    <ul class="mt-5 space-y-3">
      {members.map((m) => (
        <li data-member data-cat={m.categories.join(" ")}>
          <MemberRow member={m} categories={categories} />
        </li>
      ))}
    </ul>
  </div>
  <script>import "../client/category-filter";</script>
</BaseLayout>
```

```typescript
// src/client/category-filter.ts
// Upgrades the chip rail: the links already work without this file.
const rows = [...document.querySelectorAll<HTMLElement>("[data-member]")];
const chips = [...document.querySelectorAll<HTMLAnchorElement>("[data-filter]")];

function apply(slug: string | null): void {
  for (const row of rows) {
    const categories = (row.dataset.cat ?? "").split(" ");
    row.hidden = slug !== null && !categories.includes(slug);
  }
  for (const chip of chips) {
    chip.setAttribute("aria-current", chip.dataset.filter === slug ? "true" : "false");
  }
}

for (const chip of chips) {
  chip.addEventListener("click", (event) => {
    event.preventDefault();
    const slug = chip.dataset.filter ?? null;
    const next = chip.getAttribute("aria-current") === "true" ? null : slug;
    apply(next);
    const url = next ? `/annuaire?cat=${next}` : "/annuaire";
    history.pushState({}, "", url);
  });
}

apply(new URLSearchParams(location.search).get("cat"));
```

- [ ] **Step 5: Run the tests**

Run: `npm run build && npm run test:e2e -- directory`
Expected: 2 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/pages/annuaire.astro src/pages/categorie src/client tests/e2e/directory.spec.ts
git commit -m "feat: add directory listing and category pages"
```

---

### Task 9: The member profile — the page everything else delivers someone to

**Files:**
- Create: `src/pages/membre/[slug].astro`, `src/pages/qr/[slug].svg.ts`, `src/components/ReviewsSlot.astro`, `src/components/QrCard.astro`, `tests/e2e/profile.spec.ts`
- Test: `tests/e2e/profile.spec.ts` — four tests

**Interfaces:**
- Consumes: Tasks 3–5; `loadMembers`, `loadCategories`, `memberUrl`, `hasAddress` (Task 4); `agree` (Task 2).
- Produces:
  - one static page per member, and `/qr/<slug>.svg` per member
  - **`ReviewsSlot.astro` props `{ slug: string; rating: number; reviewCount: number }` — the contract with Plan 2.** In Plan 1 it renders a static empty state inside `<div data-reviews-slot data-slug data-rating data-review-count>`. Plan 2 replaces that div's *contents* with a client island and changes nothing else on this page. **Renaming those four attributes is a breaking change to Plan 2.**

**Composition authority:** `docs/mockups/final/membre.html`. Required, in the mockup's order: sable band with ventouse wallpaper and the arch-topped portrait, identity card overlapping its lower edge · name, trade, tagline, categories as routes, rating, distance · **« La contacter » with email, site and Instagram in full readable text** (never behind icons, never truncated, and a null field renders nothing at all) · « Son portrait » · « Ce qu'elle propose » · « Où la trouver » with a deep link to the member's map pin · « Avis du quartier » · the QR download · the discreet « cette fiche n'est pas correcte » link · the sticky orange call bar carrying the real number.

**Sable or halo, never both.** The styleguide's own author flagged this: the halo multiplies onto the sable and the pattern drowns. Use the sable default.

**The QR code is a file, not a script.** The first draft generated the SVG in frontmatter, injected it with `set:html`, and downloaded it with a `<script is:inline>` — three things `docs/STANDARDS.md` §3 bans, because `public/_headers` pins `script-src 'self'` and an inline script then fails silently in production only. A build-time route emits `/qr/<slug>.svg`, the card shows it with `<img>`, and the download is `<a download>`. Zero JavaScript, and the file is cacheable.

- [ ] **Step 1: Write the failing tests**

```typescript
// tests/e2e/profile.spec.ts
import { expect, test } from "@playwright/test";
import { feminine, fullyContactable, masculineWithoutSite } from "./fixture";
import { agree } from "../../src/lib/gender";

test("Carries the contact details in full, readable text", async ({ page }) => {
  const m = fullyContactable;
  await page.goto(`/membre/${m.slug}`);
  await expect(page.getByText(m.email!, { exact: false })).toBeVisible();
  await expect(page.getByText(m.site!, { exact: false })).toBeVisible();
  await expect(page.getByText(`@${m.instagram!}`, { exact: false })).toBeVisible();
  await expect(page.locator('a[href^="tel:"]').last()).toBeVisible();
});

test("Renders nothing at all for a field the member left empty", async ({ page }) => {
  await page.goto(`/membre/${masculineWithoutSite.slug}`);
  await expect(page.getByText("Son site")).toHaveCount(0);
  await expect(page.locator("a[href='null'], a[href='']")).toHaveCount(0);
});

test("Agrees its French with the gender of the neighbour", async ({ page }) => {
  await page.goto(`/membre/${feminine.slug}`);
  await expect(page.getByText(`Ce qu'${agree("f", "elle")} propose`)).toBeVisible();
  await expect(page.getByText(`Où ${agree("f", "la")} trouver`)).toBeVisible();

  await page.goto(`/membre/${masculineWithoutSite.slug}`);
  await expect(page.getByText(`Ce qu'${agree("h", "elle")} propose`)).toBeVisible();
  await expect(page.getByText(`Où ${agree("h", "la")} trouver`)).toBeVisible();
});

// The one place this suite asserts on an attribute rather than on what the
// visitor sees: these four names are a documented interface with Plan 2.
test("Reserves the reviews slot Plan 2 replaces", async ({ page }) => {
  const m = feminine;
  await page.goto(`/membre/${m.slug}`);
  await expect(page.getByText("Avis du quartier")).toBeVisible();
  const slot = page.locator("[data-reviews-slot]");
  await expect(slot).toHaveAttribute("data-slug", m.slug);
  await expect(slot).toHaveAttribute("data-review-count", String(m.nbAvis));
});
```

- [ ] **Step 2: Run them to make sure they fail**

Run: `npm run build && npm run test:e2e -- profile`
Expected: FAIL — the route does not exist.

- [ ] **Step 3: Write the QR route**

```bash
npm install qrcode && npm install -D @types/qrcode
```

```typescript
// src/pages/qr/[slug].svg.ts
import type { APIRoute } from "astro";
import QRCode from "qrcode";
import { loadMembers } from "../../lib/collections";
import { memberUrl } from "../../lib/members";

export async function getStaticPaths() {
  return (await loadMembers()).map((member) => ({ params: { slug: member.slug } }));
}

export const GET: APIRoute = async ({ params, site }) => {
  const url = memberUrl(params.slug!, site!.href);
  const svg = await QRCode.toString(url, { type: "svg", margin: 1, errorCorrectionLevel: "M" });
  return new Response(svg, { headers: { "content-type": "image/svg+xml; charset=utf-8" } });
};
```

- [ ] **Step 4: Write `ReviewsSlot.astro` and `QrCard.astro`**

```astro
---
/**
 * src/components/ReviewsSlot.astro
 *
 * THE CONTRACT WITH PLAN 2 — do not rename these attributes without updating it.
 * In v1 this renders a static empty state. Plan 2 replaces the contents of
 * <div data-reviews-slot> with a client island that fetches reviews at runtime.
 * No other part of the profile page changes when that lands.
 */
import { COPY } from "../lib/copy";

interface Props { slug: string; rating: number; reviewCount: number }
const { slug, rating, reviewCount } = Astro.props;
---
<section class="mt-10" aria-labelledby="reviews-title">
  <h2 id="reviews-title" class="ff text-grand text-teal-900">{COPY.reviewsTitle}</h2>
  <div class="filet mt-2 h-[3px] w-24 rounded-full"></div>

  <div
    data-reviews-slot
    data-slug={slug}
    data-rating={String(rating)}
    data-review-count={String(reviewCount)}
    class="mt-4"
  >
    <p class="text-corps text-neutre-700">{COPY.reviewsNone}</p>
    <p class="mt-2 text-[16px] text-neutre-600">{COPY.reviewsHow}</p>
    <p class="mt-2">
      <a class="font-semibold text-teal-800 underline" href="/avis">{COPY.reviewsPolicy}</a>
    </p>
  </div>
</section>
```

```astro
---
// src/components/QrCard.astro
import { COPY } from "../lib/copy";

interface Props { slug: string; url: string }
const { slug, url } = Astro.props;
const file = `/qr/${slug}.svg`;
---
<div class="mt-8 rounded-box border border-neutre-200 p-4">
  <div class="flex items-center gap-4">
    <img src={file} alt={`QR code menant à ${url}`} width="96" height="96" class="size-24 shrink-0" />
    <div class="min-w-0">
      <p class="ff text-chapo text-teal-900">{COPY.qrTitle}</p>
      <p class="mt-1 text-[16px] leading-snug text-neutre-700">{COPY.qrExplain}</p>
      <p class="mt-1 break-words text-[15px] text-neutre-600">{url}</p>
    </div>
  </div>
  <a
    href={file}
    download={`qr-${slug}.svg`}
    class="mt-3 inline-flex min-h-[44px] items-center rounded-field border border-teal-700 px-4 font-semibold text-teal-800"
  >
    {COPY.qrDownload}
  </a>
</div>
```

- [ ] **Step 5: Write `src/pages/membre/[slug].astro`**

```astro
---
// src/pages/membre/[slug].astro
import BaseLayout from "../../layouts/BaseLayout.astro";
import CallButton from "../../components/CallButton.astro";
import CategoryChip from "../../components/CategoryChip.astro";
import QrCard from "../../components/QrCard.astro";
import ReviewsSlot from "../../components/ReviewsSlot.astro";
import { COPY } from "../../lib/copy";
import { loadCategories, loadMembers } from "../../lib/collections";
import { agree } from "../../lib/gender";
import { hasAddress, memberUrl } from "../../lib/members";

export async function getStaticPaths() {
  const [members, categories] = await Promise.all([loadMembers(), loadCategories()]);
  return members.map((member) => ({
    params: { slug: member.slug },
    props: { member, chips: categories.filter((c) => member.categories.includes(c.slug)) },
  }));
}

const { member, chips } = Astro.props;
const url = memberUrl(member.slug, Astro.site!.href);
const pronoun = agree(member.genre, "elle");
const article = agree(member.genre, "la");
const contacts = [
  { label: COPY.profileEmail, text: member.email, href: member.email && `mailto:${member.email}` },
  { label: COPY.profileSite, text: member.site, href: member.site && `https://${member.site}` },
  {
    label: COPY.profileInstagram,
    text: member.instagram && `@${member.instagram}`,
    href: member.instagram && `https://instagram.com/${member.instagram}`,
  },
].filter((c) => c.text !== null);
const wrongMailto = `mailto:${COPY.contactEmail}?subject=${encodeURIComponent(`Correction : ${member.nom}`)}`;
---
<BaseLayout title={`${member.nom} — ${member.metier}`} description={member.accroche}>
  <div class="mx-auto max-w-3xl px-4 pb-32">
    <div class="ventouses aube -mx-4 px-4 pb-16 pt-6">
      <img
        src={`/portraits/${member.photo}`}
        alt={`Portrait de ${member.nom}`}
        width="128"
        height="128"
        fetchpriority="high"
        class="arche mx-auto size-[176px] object-cover"
      />
    </div>
    <div class="carte -mt-10 rounded-box bg-white p-5 shadow-flottant">
      <h1 class="ff text-grand text-teal-900">{member.nom}</h1>
      <p class="text-chapo text-neutre-700">{member.metier}</p>
      <p class="mt-2 text-corps text-neutre-700">{member.accroche}</p>
      <div class="mt-3 flex flex-wrap gap-2">
        {chips.map((c) => <CategoryChip slug={c.slug} nom={c.nom} />)}
      </div>
      <p class="mt-3 text-[16px] text-neutre-600">
        {hasAddress(member) ? `${member.adresse} · ${member.distance}` : COPY.mapTheyComeToYou}
      </p>
    </div>

    <h2 class="ff mt-10 text-grand text-teal-900">{COPY.profileContact(article)}</h2>
    <ul class="mt-3 space-y-2">
      {contacts.map((c) => (
        <li>
          <span class="text-etiquette uppercase text-neutre-600">{c.label}</span>
          <a class="block break-words font-semibold text-teal-800 underline" href={c.href!}>
            {c.text}
          </a>
        </li>
      ))}
    </ul>
    <div class="mt-4"><CallButton member={member} withNumber={true} /></div>

    <h2 class="ff mt-10 text-grand text-teal-900">{COPY.profilePortrait}</h2>
    <p class="mt-2 text-corps text-neutre-700">{member.bio}</p>

    <h2 class="ff mt-10 text-grand text-teal-900">{COPY.profileOffers(pronoun)}</h2>
    <ul class="mt-3 space-y-2">
      {member.services.map((s) => <li class="text-corps text-neutre-700">{s}</li>)}
    </ul>

    <h2 class="ff mt-10 text-grand text-teal-900">{COPY.profileWhere(article)}</h2>
    <p class="mt-2 text-corps text-neutre-700">
      {hasAddress(member) ? member.adresse : COPY.mapTheyComeToYou}
    </p>
    {member.surCarte && (
      <p class="mt-2">
        <a class="font-semibold text-teal-800 underline" href={`/carte#pin-${member.slug}`}>
          {COPY.profileOnMap}
        </a>
      </p>
    )}

    <ReviewsSlot slug={member.slug} rating={member.note} reviewCount={member.nbAvis} />
    <QrCard slug={member.slug} url={url} />

    <p class="mt-8 text-[15px] text-neutre-600">
      <a class="underline" href={wrongMailto}>{COPY.profileWrong}</a>
    </p>
  </div>
  <CallButton member={member} sticky={true} withNumber={true} />
</BaseLayout>
```

- [ ] **Step 6: Run the tests and verify the emitted files**

Run: `npm run build && npm run test:e2e -- profile`
Expected: 4 tests PASS.

Then:

```bash
ls dist/qr/*.svg | wc -l
grep -o 'href="/carte#pin-[a-z0-9-]*"' dist/membre/*/index.html | head -3
```

Expected: one SVG per member with a map pin or not — one per member, twelve with the fixture — and the deep links into `/carte` present for the members with `surCarte: true`. Task 10 makes those anchors exist.

- [ ] **Step 7: Verify against the mockup**

Same side-by-side procedure as Task 7, step 6, against `docs/mockups/final/membre.html`.

- [ ] **Step 8: Commit**

```bash
git add src/pages/membre src/pages/qr src/components/ReviewsSlot.astro \
        src/components/QrCard.astro tests/e2e/profile.spec.ts package.json package-lock.json
git commit -m "feat: add member profile pages with contacts, QR file and reviews slot"
```

---
### Task 10: The neighbourhood map

**Files:**
- Create: `src/pages/carte.astro`, `src/client/geolocate.ts`, `tests/e2e/carte.spec.ts`
- Modify: `public/_headers` (one directive)
- Test: `tests/e2e/carte.spec.ts` — two tests

**Interfaces:**
- Consumes: `MemberRow` (Task 5), `sortByDistance`, `hasAddress` (Task 4), `loadMembers`, `loadCategories` (Task 4).
- Produces: `/carte`, with the `#pin-<slug>` anchors that `/membre/[slug]` deep-links to (Task 9).

**`public/_headers` was corrected when it was written — verify, do not re-edit.** Its `Permissions-Policy` line reads `geolocation=()`, which disables `navigator.geolocation` for the document entirely: the « Classer depuis ma position » button would do nothing in production and nothing would say why — the failure is silent and local testing would never show it, because the header only exists on the deployed site. It now reads `geolocation=(self)`. Confirm with `grep Permissions-Policy public/_headers` before wiring the button — if it ever reverts to `geolocation=()`, the failure is silent and appears only in production:

```
  Permissions-Policy: geolocation=(self), camera=(), microphone=(), payment=(), usb=(), interest-cohort=()
```

`(self)` allows this document to *ask*; the visitor still has to grant it, and no third party can. This is the only edit this task makes to that file.

**No mapping library in v1.** A styled static placeholder, as in the mockup: a pin layer over a stylised ground with landmark anchoring (la Halle, tram T1, rue Paul Mesplé, avenue de Grande-Bretagne), a « vous êtes ici » marker, and a distance-ordered bottom sheet cross-highlighting the pins through pure CSS `:target`. The page states « Plan schématique : les positions sont indicatives ». Replacing it with MapLibre + OpenStreetMap (spec §4) is a later task, out of Plan 1.

**Three cases, handled honestly** — the mockup got this right and it must survive:
1. a public address and a map pin
2. a real address and distance but no public pin — the pickup-address case, whose row explains « Adresse de retrait, pas de point sur la carte »
3. no fixed address at all — under « Ils viennent chez vous »

**Geolocation is requested only on an explicit tap.** Before permission, the list is ranked from la Halle so the promise is already true, and the page says « Rien n'est envoyé à un serveur : le calcul reste sur votre téléphone » — which must be literally true: the haversine runs in the browser over coordinates already in the page.

- [ ] **Step 1: Write the failing tests**

```typescript
// tests/e2e/carte.spec.ts
import { expect, test } from "@playwright/test";
import { COPY } from "../../src/lib/copy";

type GeoWindow = Record<string, boolean>;

test("Never asks for a position before an explicit tap", async ({ page }) => {
  await page.addInitScript(() => {
    (window as unknown as GeoWindow).geoAsked = false;
    const real = navigator.geolocation.getCurrentPosition.bind(navigator.geolocation);
    navigator.geolocation.getCurrentPosition = (...args: Parameters<typeof real>) => {
      (window as unknown as GeoWindow).geoAsked = true;
      return real(...args);
    };
  });
  await page.goto("/carte");

  // The ranked list being on screen is the proof the page has finished its work:
  // the promise « classé depuis la Halle » is kept before anyone is asked anything.
  await expect(page.getByText(COPY.mapFromHall)).toBeVisible();
  await expect(page.getByRole("button", { name: /ma position/i })).toBeVisible();
  expect(await page.evaluate(() => (window as unknown as GeoWindow).geoAsked)).toBe(false);
});

test("States each of the three address cases instead of flattening them", async ({ page }) => {
  await page.goto("/carte");
  await expect(page.getByText(COPY.mapTheyComeToYou)).toBeVisible();
  await expect(page.getByText(COPY.mapPickupOnly)).toBeVisible();
  await expect(page.getByText(COPY.mapSchematic)).toBeVisible();
});
```

- [ ] **Step 2: Run them to make sure they fail**

Run: `npm run build && npm run test:e2e -- carte`
Expected: FAIL — `/carte` does not exist.

- [ ] **Step 3: Write the page**

Lift the map ground, the pin layer and the `:target` rules from `docs/mockups/final/carte.html`. The page renders, in order:

- the schematic plan, each pin as `<a href={`#pin-${m.slug}`} id={`pin-${m.slug}`} data-lat={m.lat} data-lng={m.lng} data-m={m.slug}>` for members with `surCarte: true` and coordinates
- the « ma position » button, `type="button"`, carrying `data-geolocate`
- `COPY.mapFromHall` as the list heading, and `COPY.searchLocal` under the button
- the distance-ordered sheet: `sortByDistance(members.filter(hasAddress))`, each row a `MemberRow`, with the pickup-only row carrying `COPY.mapPickupOnly`
- a closing group headed `COPY.mapTheyComeToYou` for the members failing `hasAddress`
- `COPY.mapSchematic` as the plan's caption

```astro
  <script>import "../client/geolocate";</script>
```

- [ ] **Step 4: Write the geolocation script**

```typescript
// src/client/geolocate.ts
// Runs only on a tap. Nothing is sent anywhere: the coordinates are already in
// the page, and the arithmetic happens here.
const HALL = { lat: 43.6006, lng: 1.4108 };

function haversine(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371000 * 2 * Math.asin(Math.sqrt(h));
}

function reorder(from: { lat: number; lng: number }): void {
  const sheet = document.querySelector("[data-sheet]");
  if (!sheet) return;
  const rows = [...sheet.querySelectorAll<HTMLElement>("[data-lat]")];
  rows
    .map((row) => ({
      row,
      metres: haversine(from, {
        lat: Number(row.dataset.lat),
        lng: Number(row.dataset.lng),
      }),
    }))
    .sort((a, b) => a.metres - b.metres)
    .forEach(({ row }) => sheet.append(row));
}

document.querySelector("[data-geolocate]")?.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(
    (position) => reorder({ lat: position.coords.latitude, lng: position.coords.longitude }),
    () => reorder(HALL),
    { enableHighAccuracy: false, timeout: 8000 }
  );
});
```

- [ ] **Step 5: Run the tests**

Run: `npm run build && npm run test:e2e -- carte`
Expected: 2 tests PASS.

- [ ] **Step 6: Verify the deep link from a profile**

```bash
npm run build
npx astro preview --port 4321 & PREVIEW=$!
npx playwright screenshot --device="Galaxy S9+" "http://localhost:4321/carte#pin-camille-roussel" /tmp/pin.png
kill $PREVIEW
```

Open `/tmp/pin.png` and confirm the targeted pin is ringed and its label visible — the `:target` rules from the mockup, reached by the link Task 9 emits.

- [ ] **Step 7: Commit**

```bash
git add src/pages/carte.astro src/client/geolocate.ts public/_headers tests/e2e/carte.spec.ts
git commit -m "feat: add neighbourhood map with CSS pin selection"
```

---

### Task 11: The legal and editorial pages

**Files:**
- Create: `src/pages/a-propos.astro`, `src/pages/confidentialite.astro`, `src/pages/mentions-legales.astro`, `src/pages/avis.astro`, `src/layouts/TextPage.astro`, `docs/mentions-legales-a-completer.md`, `tests/e2e/legal.spec.ts`
- Test: `tests/e2e/legal.spec.ts` — two tests

**Interfaces:**
- Consumes: `BaseLayout` (Task 3).
- Produces: the four routes the footer already links to. `TextPage.astro` lives in `src/layouts/`, not `src/components/`: it wraps `BaseLayout`, and components never import layouts (`eslint.config.js` enforces the direction).

**`/mentions-legales` is legally required for a French site** (spec §9) and **is blocked on information only Adrien has**: the association's registered name and legal form, its address, its SIRET or RNA number, the publication director, and the hosting provider's exact legal name and address. **Look the hosting entry up on Cloudflare's own terms page rather than reproducing a remembered address** — a legal notice naming the wrong host is worse than one carrying a visible marker.

**Do not write plausible-looking legal text.** Build the page with the real structure and leave every unknown as a visible `⟨à compléter : …⟩` marker, then list the markers for Adrien in `docs/mentions-legales-a-completer.md`. A fabricated legal notice is worse than an absent one, and the test below exists so nobody quietly replaces a marker with an invention.

**`/avis` is expected under French consumer law** (spec §8): it states how reviews are collected, that they are never paid for, how they are moderated, and how to report one. **`/confidentialite`** is unusually short and unusually true: analytics are cookieless (spec §4) so there is no consent banner, fonts are self-hosted so no third party sees a visitor's IP, and favourites in Plan 1 never leave the browser.

- [ ] **Step 1: Write the failing tests**

```typescript
// tests/e2e/legal.spec.ts
import { expect, test } from "@playwright/test";

const PAGES = ["/a-propos", "/confidentialite", "/mentions-legales", "/avis"];

test("Every footer link reaches a page with a heading", async ({ page }) => {
  await page.goto("/");
  for (const path of PAGES) {
    await expect(page.locator(`footer a[href="${path}"]`)).toBeVisible();
  }
  for (const path of PAGES) {
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
  }
});

// A missing legal detail must stay visibly missing. The failure mode this
// guards against is an agent filling the gap with a plausible invention.
test("The legal notice marks what is missing instead of inventing it", async ({ page }) => {
  await page.goto("/mentions-legales");
  await expect(page.getByText(/⟨à compléter/)).toBeVisible();
});
```

- [ ] **Step 2: Run them to make sure they fail**

Run: `npm run build && npm run test:e2e -- legal`
Expected: FAIL — none of the four routes exists.

- [ ] **Step 3: Write `TextPage.astro` and the four pages**

```astro
---
// src/layouts/TextPage.astro
import BaseLayout from "./BaseLayout.astro";

interface Props { title: string; description: string; heading: string }
const { title, description, heading } = Astro.props;
---
<BaseLayout title={title} description={description}>
  <article class="mx-auto max-w-[38rem] px-4 py-8 text-corps leading-relaxed text-neutre-800">
    <h1 class="ff text-grand text-teal-900">{heading}</h1>
    <div class="mt-4 space-y-4"><slot /></div>
  </article>
</BaseLayout>
```

`/mentions-legales` carries the five required blocks — éditeur, directeur de la publication, contact, hébergeur, propriété intellectuelle — each unknown written as `⟨à compléter : numéro RNA de l'association⟩` and so on. **Two of them are known and must not be written as markers:** the publication director is `Adrien Lemaire` and the contact address is `lemaire.adrien@gmail.com` (Adrien supplied both; the spec's rule against invention applies to what nobody has supplied). `/avis` answers four questions in order: who may leave a review, that no review is ever bought, who moderates and on what grounds, and how to report one. `/confidentialite` lists what is collected (page views, cookieless, aggregated) and what is not (no cookie, no account required, no third-party font, no ad network). `/a-propos` credits Sandra Carole for the portraits, the association, Colly's illustrator once she is redrawn, OpenStreetMap and the open-source dependencies — the spec puts credits here rather than in a badge (§9).

- [ ] **Step 4: Run the tests**

Run: `npm run build && npm run test:e2e -- legal`
Expected: 2 tests PASS.

- [ ] **Step 5: List what Adrien must supply**

Write `docs/mentions-legales-a-completer.md` with one line per marker: association name, legal form, registered address, SIRET or RNA number, and the hosting provider's exact legal name and address as published by Cloudflare. Publication director and contact email are already on the page and belong on no list. This file is the hand-off, and Task 16 checks it before going live.

- [ ] **Step 6: Commit**

```bash
git add src/pages/a-propos.astro src/pages/confidentialite.astro \
        src/pages/mentions-legales.astro src/pages/avis.astro src/layouts/TextPage.astro \
        docs/mentions-legales-a-completer.md tests/e2e/legal.spec.ts
git commit -m "feat: add about, privacy, legal notice and reviews policy pages"
```

---

### Task 12: The client search index and live search

**Files:**
- Create: `src/pages/recherche.json.ts`, `src/client/live-search.ts`, `tests/e2e/search.spec.ts`
- Modify: `src/pages/index.astro`, `src/pages/annuaire.astro` (mount the results region), `tests/unit/search.test.ts` (one test)
- Test: `tests/unit/search.test.ts` + `tests/e2e/search.spec.ts` — three tests

**Interfaces:**
- Consumes: `buildIndex`, `search` (Task 4), `loadMembers`, `loadCategories` (Task 4), `SearchBar` (Task 6).
- Produces: `/recherche.json` — the single file every discovery surface reads, cached by the service worker (Task 13). `scripts/budgets.mjs` already budgets it at 90 KB gzipped.

**Why a single JSON file** (spec §5): at 200 profiles it is roughly 60 KB gzipped — small enough to ship whole, so search, category filtering and the map all run client-side with zero latency and zero requests, and keep working offline. All four discovery surfaces read from this one file, so changing which surface `/` leads with stays UI work.

**The same matcher runs on both sides.** `search()` is imported by the tests and by the browser bundle. Two implementations would drift, and the drift would show up as the landing page advertising a keyword the search cannot find.

**The index carries no contact details.** `buildIndex` omits `tel`, `email`, `site` and `instagram` by construction: the index is a public file any crawler can fetch whole, and the whole-quartier contact list is precisely what must not exist as one download (spec §3, §5). That is a decision, so it gets the one unit test below.

- [ ] **Step 1: Add the failing unit test**

Append to `tests/unit/search.test.ts`, inside the existing `describe("Search")`:

```typescript
  // The index is a public file. A crawler fetching it must not come away with
  // the quartier's phone book — contact details live on the profile page only.
  it("Keeps contact details out of the public index", () => {
    const entry = buildIndex(
      [member({ tel: "06 12 34 56 78", email: "alice@example.fr", instagram: "alice" })],
      categories
    )[0];
    expect(Object.keys(entry)).not.toContain("tel");
    expect(Object.keys(entry)).not.toContain("email");
    expect(JSON.stringify(entry)).not.toContain("@");
  });
```

- [ ] **Step 2: Write the failing e2e tests**

```typescript
// tests/e2e/search.spec.ts
import { expect, test } from "@playwright/test";
import { COPY } from "../../src/lib/copy";
import { members } from "./fixture";

const someone = members[0];

test("Filters while you type, and says so when nobody matches", async ({ page }) => {
  await page.goto("/");
  const box = page.getByRole("searchbox");

  await box.fill(someone.metier);
  await expect(page.locator("[data-result]").first()).toContainText(someone.nom);

  await box.fill("zzzqqq");
  await expect(page.getByText(COPY.searchEmpty)).toBeVisible();
  // Scoped to the results region: the needs index carries its own mailto for the
  // empty category, and an unscoped locator matches both and fails strict mode.
  await expect(page.locator("[data-results] a[href^='mailto:']")).toBeVisible();
});

test("Keeps the search field at 16px so iOS does not zoom the page on focus", async ({ page }) => {
  await page.goto("/");
  const size = await page
    .getByRole("searchbox")
    .evaluate((el) => Number.parseFloat(getComputedStyle(el).fontSize));
  expect(size).toBeGreaterThanOrEqual(16);
});
```

- [ ] **Step 3: Run them to make sure they fail**

Run: `npx vitest run tests/unit/search.test.ts && npm run build && npm run test:e2e -- search`
Expected: the unit test may already pass — `buildIndex` was written not to carry contact fields, and a test that cannot fail is one to delete, so confirm it *can* by temporarily adding `tel: m.tel` to the entry and watching it go red. The e2e tests FAIL: nothing fetches an index yet.

- [ ] **Step 4: Emit the index**

```typescript
// src/pages/recherche.json.ts
// The file name is French because it is a URL: /recherche.json is referenced by
// scripts/budgets.mjs, public/_headers and the service worker.
import type { APIRoute } from "astro";
import { loadCategories, loadMembers } from "../lib/collections";
import { buildIndex } from "../lib/search";

export const GET: APIRoute = async () => {
  const [members, categories] = await Promise.all([loadMembers(), loadCategories()]);
  return new Response(JSON.stringify(buildIndex(members, categories)), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
};
```

- [ ] **Step 5: Write the client script**

```typescript
// src/client/live-search.ts
// Fetched on the first keystroke, never on load: someone who never searches
// must not pay a request for the feature.
import { search, type IndexEntry } from "../lib/search";
import { COPY } from "../lib/copy";

const input = document.querySelector<HTMLInputElement>("[data-search-input]");
const results = document.querySelector<HTMLElement>("[data-results]");
const browse = document.querySelector<HTMLElement>("[data-browse]");
if (input && results) {
  let index: IndexEntry[] | null = null;

  const render = (query: string): void => {
    if (!index) return;
    const found = search(index, query);
    if (browse) browse.hidden = query.trim().length > 0;
    results.hidden = query.trim().length === 0;
    results.innerHTML = "";

    if (query.trim().length > 0 && found.length === 0) {
      const empty = document.createElement("p");
      empty.textContent = COPY.searchEmpty;
      const suggest = document.createElement("a");
      suggest.href = `mailto:${COPY.contactEmail}`;
      suggest.textContent = COPY.searchSuggest;
      results.append(empty, suggest);
      return;
    }

    for (const { entry, reason } of found) {
      const link = document.createElement("a");
      link.href = `/membre/${entry.slug}`;
      link.dataset.result = "";
      link.className = "carte block rounded-box bg-white p-3 shadow-carte";
      const name = document.createElement("span");
      name.className = "ff block text-nom text-teal-900";
      name.textContent = entry.nom;
      const why = document.createElement("span");
      why.className = "block text-[16px] text-neutre-600";
      why.textContent = `${entry.metier} · ${COPY.searchReason(reason)}`;
      link.append(name, why);
      results.append(link);
    }
  };

  input.addEventListener("input", async () => {
    index ??= (await (await fetch("/recherche.json")).json()) as IndexEntry[];
    render(input.value);
  });
}
```

Mount the regions in `src/pages/index.astro` and `src/pages/annuaire.astro`: a `<div data-results hidden></div>` directly under the search bar, and `data-browse` on the section the results replace while a query is active (the needs index on `/`, the chip rail and list on `/annuaire`). Add `<script>import "../client/live-search";</script>` to both.

- [ ] **Step 6: Run everything**

Run: `npm test && npm run build && npm run test:e2e -- search && npm run budgets`
Expected: all PASS, and `budgets` reports `Search index` comfortably under 90 KB with the fixture.

- [ ] **Step 7: Commit**

```bash
git add src/pages/recherche.json.ts src/client/live-search.ts src/pages/index.astro \
        src/pages/annuaire.astro tests/unit/search.test.ts tests/e2e/search.spec.ts
git commit -m "feat: emit the client search index and wire live filtering"
```

---

### Task 13: Open Graph images, the PWA shell, cookieless analytics

**Files:**
- Create: `src/og/card.ts`, `src/pages/og/[slug].png.ts`, `public/manifest.webmanifest`, `public/sw.js`, `src/client/register-sw.ts`, `tests/e2e/privacy.spec.ts`
- Modify: `src/layouts/BaseLayout.astro`, `src/pages/membre/[slug].astro`
- Test: `tests/e2e/privacy.spec.ts` — one test

**Interfaces:**
- Consumes: `loadMembers` (Task 4), the design tokens (Task 1).
- Produces: `/og/<slug>.png` per member, referenced from each profile's `<meta property="og:image">` through `BaseLayout`'s `head` slot.

**Why OG images matter here specifically:** the spec reframed WhatsApp from competitor to distribution channel (§5). A profile link pasted into one of the quartier's existing WhatsApp groups should unfurl as a card with the person's face and trade, not as a bare URL.

**Analytics:** Cloudflare Web Analytics — free, cookieless, and therefore **no consent banner** (spec §4). It is the single allow-listed third-party origin, named in `public/_headers`' CSP and in `scripts/forbidden.mjs`. Adding any cookie-setting analytics would force a banner and make `/confidentialite` false.

- [ ] **Step 1: Write the failing test**

```typescript
// tests/e2e/privacy.spec.ts
import { expect, test } from "@playwright/test";

// The privacy page promises this in writing, and the absence of a consent
// banner depends on it. Task 16 repeats the assertion against production,
// where the analytics beacon actually loads.
test("Sets no cookie", async ({ page, context }) => {
  await page.goto("/", { waitUntil: "load" });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(await context.cookies()).toHaveLength(0);
});
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `npm run build && npm run test:e2e -- privacy`
Expected: PASS immediately — nothing sets a cookie yet. That is the point: this test exists to go red the day someone adds a script that does, and this task is the one adding scripts.

- [ ] **Step 3: Generate the Open Graph images**

```bash
npm install satori sharp wawoff2
```

`satori` reads `ttf`, `otf` and `woff`, **not `woff2`**, and Fontsource ships variable faces as `woff2` only — so the font is decompressed in memory at build time. Confirm the exact file name first:

```bash
ls node_modules/@fontsource-variable/fraunces/files/ | grep latin
```

```typescript
// src/og/card.ts
// Build-time only: node: imports are allowed here, never in src/lib.
import { readFileSync } from "node:fs";
import satori from "satori";
import sharp from "sharp";
import { decompress } from "wawoff2";

// Confirm this name with the ls above; Fontsource renames files between majors.
const WOFF2 = "node_modules/@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2";

let fraunces: Buffer | null = null;
async function font(): Promise<Buffer> {
  fraunces ??= Buffer.from(await decompress(readFileSync(WOFF2)));
  return fraunces;
}

export async function renderCard(name: string, trade: string): Promise<Buffer> {
  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          width: "1200px",
          height: "630px",
          padding: "64px",
          background: "#ffffff",
          borderBottom: "16px solid #f28318",
        },
        children: [
          { type: "div", props: { style: { fontSize: 34, color: "#44706f" }, children: "Annuaire de la Cartoucherie" } },
          { type: "div", props: { style: { fontFamily: "Fraunces", fontSize: 86, color: "#123b3c", marginTop: 12 }, children: name } },
          { type: "div", props: { style: { fontSize: 44, color: "#3f4f52", marginTop: 8 }, children: trade } },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Fraunces", data: await font(), weight: 600, style: "normal" }],
    }
  );
  return sharp(Buffer.from(svg)).png().toBuffer();
}
```

```typescript
// src/pages/og/[slug].png.ts
import type { APIRoute } from "astro";
import { loadMembers } from "../../lib/collections";
import { renderCard } from "../../og/card";

export async function getStaticPaths() {
  return (await loadMembers()).map((member) => ({
    params: { slug: member.slug },
    props: { nom: member.nom, metier: member.metier },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { nom, metier } = props as { nom: string; metier: string };
  return new Response(await renderCard(nom, metier), {
    headers: { "content-type": "image/png" },
  });
};
```

In `src/pages/membre/[slug].astro`, fill the layout's head slot:

```astro
  <Fragment slot="head">
    <meta property="og:image" content={new URL(`/og/${member.slug}.png`, Astro.site).href} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
  </Fragment>
```

- [ ] **Step 4: Add the manifest, the service worker and the beacon**

`public/manifest.webmanifest` names the app « Annuaire de la Cartoucherie », short name « La Cartoucherie », `display: standalone`, `theme_color: #ffffff`, `background_color: #ffffff`, `lang: fr`, and icons drawn from the ventouse mark at 192px and 512px.

`public/sw.js` caches the shell and `/recherche.json`, so the directory keeps working on a weak connection in a shop — the scenario the spec is built around. `public/_headers` already serves it with `Cache-Control: no-cache`, so a new worker is picked up on the next visit.

```typescript
// src/client/register-sw.ts
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/sw.js");
  });
}
```

In `BaseLayout.astro`, add `<link rel="manifest" href="/manifest.webmanifest" />`, `<script>import "../client/register-sw";</script>`, and the beacon, loaded in production only:

```astro
{/* prettier-ignore — scripts/forbidden.mjs allow-lists this by host, per line. */}
{import.meta.env.PROD && (
  <script is:inline defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon={`{"token": "${import.meta.env.PUBLIC_CF_BEACON_TOKEN ?? ""}"}`}></script>
)}
```

The tag stays on one line deliberately: `scripts/forbidden.mjs` allow-lists a line by its host, and Prettier at `printWidth: 100` would otherwise wrap the attributes onto lines the allow-list cannot see — turning the guard's one exception into a silent hole.

This is the **one** `is:inline` in the project and the one third-party origin: `scripts/forbidden.mjs` allow-lists the line by its host, `public/_headers` names it in `script-src`, and `docs/STANDARDS.md` §3 explains why SRI is deliberately not used on it. Anything else matching those patterns is a defect.

- [ ] **Step 5: Verify the images and run the test**

Run: `npm run build && npm run test:e2e -- privacy`

```bash
ls dist/og/*.png | wc -l
node -e "console.log(require('node:fs').statSync('dist/og/camille-roussel.png').size)"
grep -o 'og:image" content="[^"]*"' dist/membre/camille-roussel/index.html
```

Expected: one PNG per member; each under 300 KB; the profile's `og:image` absolute and pointing at its own file. Open one PNG and read it: the name must not be clipped, and Fraunces must actually have rendered — a missing font silently falls back and the card then looks like every other site's.

- [ ] **Step 6: Commit**

```bash
git add src/og src/pages/og src/client/register-sw.ts public/manifest.webmanifest public/sw.js \
        src/layouts/BaseLayout.astro src/pages/membre tests/e2e/privacy.spec.ts \
        package.json package-lock.json
git commit -m "feat: add Open Graph images, PWA shell and cookieless analytics"
```

---
### Task 14: Real member data never enters the repository

**Files:**
- Modify: `.github/workflows/ci.yml` (the `deploy` job), `.gitignore` (one line)
- Create: `tests/e2e/contenu.spec.ts` — the only browser assertions that ever run against real content
- Test: `tests/e2e/contenu.spec.ts` — three tests, plus a grep over git history and a build that fails closed.

**Interfaces:**
- Consumes: `scripts/sync-content.mjs` and its `CONTENT_DIR` contract (Task 2).
- Produces: a production build that reads real content, while every artefact this public repository can produce — commits, CI artefacts, Playwright reports, Lighthouse output — contains only invented people.

**What this task prevents.** The first draft of this plan called `src/content/members.json` "THE source of member truth in v1" and listed `public/portraits/` as "v1: committed". The repository is public. That would have put roughly 200 residents' names, home addresses, phone numbers, email addresses and photographs into git permanently — in every clone and every fork, with no erasure, and a phone number cannot be rotated like a token. Spec §3 now forbids it in as many words, and `CLAUDE.md` repeats it. This is not the consent question, which is settled: members gave Sandra their details for visibility. It is about erasure and bulk exposure.

**The shape of the mechanism:**

| Where | What | Visibility |
|---|---|---|
| this repo | `tests/fixtures/members.json` + `tests/fixtures/portraits/` — twelve invented people | public, forever |
| `cartoucherie-donnees` | `members.json` + `portraits/` — the real quartier | private, read-only token |
| a developer's machine | the fixture, unless `CONTENT_DIR` points elsewhere | local |
| CI: verify, browser, lighthouse | the fixture | public logs and artefacts |
| CI: deploy | a private checkout, built and shipped, never uploaded | production only |

**Why CI's test jobs stay on the fixture.** A `dist` artefact, a failed Playwright report full of screenshots, or a Lighthouse run's HTML are all downloadable from a public repository's Actions tab. Building the real content there would recreate the bulk contact list by another route. It also keeps `lighthouserc.json` honest: it names `/membre/camille-roussel`, which exists in the fixture and nowhere else. The cost is real and is narrowed rather than accepted whole: the deploy job runs the byte budgets *and* `tests/e2e/contenu.spec.ts` (Step 4) against the real build, in-process, uploading nothing. So a real name that breaks the 360 px layout, a missing profile page and a serious axe violation on the full directory all fail before `wrangler deploy`. What still never sees 200 rows is Lighthouse and the four-device matrix.

- [ ] **Step 1: Create the private repository**

Ask Adrien to create `cartoucherie-donnees`, **private**, containing exactly:

```
members.json        the same shape as tests/fixtures/members.json, real people
portraits/          one 128×128 (or larger) file per member, named as the JSON says
README.md           how to add a neighbour, and that a slug is permanent
```

Sandra edits `members.json` there. The schema in `src/content/schemas.ts` is what validates it, so a mistake fails the deploy build with the field and the row named, not silently.

- [ ] **Step 2: Create the read-only token**

A fine-grained GitHub personal access token scoped to `cartoucherie-donnees` alone, with `Contents: read` and nothing else. Store it on this repository as the Actions secret `CONTENT_REPO_TOKEN`, under the `production` environment so it is unavailable to workflow runs from forks and pull requests.

- [ ] **Step 3: Rewrite the deploy job**

Replace the `deploy` job's steps in `.github/workflows/ci.yml`. The `needs:` line and the `if:` line stay exactly as they are — that gate is Task 16's subject. What changes is that deploy stops shipping the fixture build downloaded from `verify` and builds the real content itself:

```yaml
  deploy:
    name: deploy to Cloudflare
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    needs: [verify, browser, lighthouse]   # the gate: no green, no deploy
    runs-on: ubuntu-latest
    timeout-minutes: 8
    environment: production
    steps:
      - uses: actions/checkout@v4
      # The real quartier. Private, read-only, and never uploaded as an artifact:
      # a public repository's Actions tab hands out artifacts to anyone.
      - uses: actions/checkout@v4
        with:
          repository: lacartoucherie/cartoucherie-donnees
          token: ${{ secrets.CONTENT_REPO_TOKEN }}
          path: content-private
          persist-credentials: false
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: npm
      - run: npm ci
      - run: npm run build
        env:
          CONTENT_DIR: content-private
          # Without this the beacon ships with an empty token: the script still
          # loads, the production test still passes, and nothing is ever counted.
          PUBLIC_CF_BEACON_TOKEN: ${{ vars.PUBLIC_CF_BEACON_TOKEN }}
      - run: node scripts/budgets.mjs
      # The only moment a browser sees the real quartier. It runs in-process on
      # the runner and this job uploads nothing, so it gates the 200-row build
      # without the artefact exposure that made `download-artifact` wrong above.
      - uses: actions/cache@v4
        with:
          path: ~/.cache/ms-playwright
          key: playwright-chromium-${{ hashFiles('package-lock.json') }}
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test tests/e2e/contenu.spec.ts
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: deploy
```

The `actions/download-artifact` step that used to start this job is deleted: it pulled the *fixture* build and would have deployed twelve invented people to production.

Add the checkout path to `.gitignore`, so a local rehearsal cannot commit it:

```
# a local or CI checkout of the private content repository
content-private/
```

- [ ] **Step 4: Write the content gate**

Every other browser test in this repository runs against twelve invented people.
Nothing has ever checked that the layout survives a real name, or that two hundred
rows still render. This spec is the only one that does, and the deploy job above is
the only place it runs against real content. It discovers what it checks instead of
hard-coding slugs, so the same file works against the fixture build locally and the
real one in CI.

```typescript
// tests/e2e/contenu.spec.ts
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function profileLinks(page: Page): Promise<string[]> {
  await page.goto("/annuaire");
  const hrefs = await page
    .locator('a[href^="/membre/"]')
    .evaluateAll((links) => links.map((a) => a.getAttribute("href") ?? ""));
  const unique = [...new Set(hrefs)];
  expect(unique.length, "the directory lists nobody — CONTENT_DIR is wrong").toBeGreaterThan(0);
  return unique;
}

test("every profile the directory links to is actually built", async ({ page }) => {
  const missing: string[] = [];
  for (const href of await profileLinks(page)) {
    const response = await page.request.get(href);
    if (!response.ok()) missing.push(`${href} → ${response.status()}`);
  }
  expect(missing).toEqual([]);
});

test("the full directory does not overflow sideways at 360 px", async ({ page }) => {
  await page.goto("/annuaire");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow, "a real name or category label is wider than the phone").toBeLessThanOrEqual(0);
});

test("the directory and a real profile have no serious or critical axe violation", async ({ page }) => {
  const [firstProfile] = await profileLinks(page);
  for (const path of ["/annuaire", firstProfile]) {
    await page.goto(path);
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    const severe = violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
    expect(severe.map((v) => `${path}: ${v.id}`)).toEqual([]);
  }
});
```

Run it against the fixture build first, so that a failure in CI means the content and not the spec:

```bash
npm run build && npx playwright test tests/e2e/contenu.spec.ts
```

Expected: 3 passed.

- [ ] **Step 5: Rehearse locally**

```bash
git clone git@github.com:lacartoucherie/cartoucherie-donnees.git content-private
CONTENT_DIR=content-private npm run build
npm run budgets
git status --porcelain
```

Expected: the build reports the real member count; `budgets` stays green at that count — this is the only place anybody sees the 200-row numbers before production; and `git status` is **clean**, proving that `src/content/members.json`, `public/portraits/` and `content-private/` are all ignored.

- [ ] **Step 6: Verify that nothing real has ever been committed**

```bash
npm run build                      # back to the fixture
git log --all --name-only --pretty=format: | sort -u | grep -E 'members\.json|portraits/'
```

Expected: only `tests/fixtures/members.json` and `tests/fixtures/portraits/…`. Anything else means real data reached history, and history is the one thing that cannot be cleaned by a later commit — stop and tell Adrien, because the fix is a rewrite plus rotated phone numbers, which is impossible.

```bash
grep -rl "@example.fr" tests/fixtures | head
```

Expected: the fixture, and only the fixture. Fictional emails all use `example.fr`; a real address in there is a mistake made while editing the wrong file.

- [ ] **Step 7: Commit**

```bash
git add .github/workflows/ci.yml .gitignore
git commit -m "ci: build production from the private content repository"
```

---

### Task 15: Verification — the journey, accessibility, the budgets

**Files:**
- Create: `tests/e2e/journey.spec.ts`, `tests/e2e/a11y.spec.ts`
- Test: those two files — four tests, two of them parametrised over five pages

**Interfaces:**
- Consumes: every page.
- Produces: the gate on the Definition of Done. `lighthouserc.json` and `scripts/budgets.mjs` already exist and are not rewritten here; this task runs them and fixes what they find.

**The flow the whole product exists for** (spec §11): *scan → find a member → contact them*. Plan 2 adds the second flow, *sign in → leave a review*.

**What this task deliberately does not contain.** The first draft's hand-rolled 44px sweep over every `a, button` — axe's `target-size` rule at `wcag22aa` covers it, and the hand-rolled version had to special-case inline links, which is exactly the judgement axe already encodes. And seven of the eight copies of « ne défile pas horizontalement »: one assertion, parametrised over the five pages, lives here.

- [ ] **Step 1: Write the journey test**

```typescript
// tests/e2e/journey.spec.ts
import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import type { Category } from "../../src/content/schemas";
import { members } from "./fixture";

const { categories } = JSON.parse(readFileSync("src/content/categories.json", "utf-8")) as {
  categories: Category[];
};

// The category with the most neighbours: the journey must work on a full one.
const busiest = categories
  .map((c) => ({ c, count: members.filter((m) => m.categories.includes(c.slug)).length }))
  .sort((a, b) => b.count - a.count)[0].c;

test("Scan a flyer, recognise a need, reach a phone number", async ({ page }) => {
  // The QR on the flyer resolves to the root: it is the only printed entry point.
  await page.goto("/");

  // She does not know the word « sophrologue ». She recognises a need.
  await page.getByText(busiest.besoin).click();
  await expect(page).toHaveURL(new RegExp(`/categorie/${busiest.slug}`));

  // She picks someone.
  await page.locator("[data-member] a").first().click();
  await expect(page).toHaveURL(/\/membre\//);

  // And she has a number, in the thumb zone, big enough to hit.
  const call = page.locator('a[href^="tel:"]').last();
  await expect(call).toBeVisible();
  await expect(call).toHaveAttribute("href", /^tel:\+33\d{9}$/);

  const box = await call.boundingBox();
  const viewport = page.viewportSize()!;
  expect(box!.y).toBeGreaterThan(viewport.height * 0.6);
  expect(box!.height).toBeGreaterThanOrEqual(44);
});

test("The same journey in three gestures, through the search field", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("searchbox").fill(members[0].metier);
  await page.locator("[data-result]").first().click();
  await expect(page.locator('a[href^="tel:"]').first()).toBeVisible();
});
```

- [ ] **Step 2: Write the accessibility test**

```typescript
// tests/e2e/a11y.spec.ts
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { feminine } from "./fixture";

const PAGES = ["/", "/annuaire", `/membre/${feminine.slug}`, "/carte", "/categorie/sante-bien-etre"];

for (const path of PAGES) {
  test(`${path} has no serious or critical axe violation`, async ({ page }) => {
    await page.goto(path);
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    const severe = violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
    expect(severe.map((v) => `${v.id} — ${v.nodes.length} node(s)`)).toEqual([]);
  });

  // The only no-horizontal-overflow assertion in the suite. At 200 % text zoom,
  // because that is the case that actually breaks and the one older residents hit.
  test(`${path} holds at 200 % text zoom without overflowing sideways`, async ({ page }) => {
    await page.goto(path);
    await page.addStyleTag({ content: "html{font-size:200%}" });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow, `horizontal overflow at 200 % on ${path}`).toBeLessThanOrEqual(0);
  });
}
```

`target-size` at `wcag22aa` is what enforces the 44px rule, and it is already in the tag list above.

- [ ] **Step 3: Run them and fix what they find**

Run: `npm run build && npm run test:e2e -- journey a11y`
Expected: FAIL on several pages at first. Fix each; do not relax an assertion. The usual findings are a heading level skipped between sections, a chip whose contrast falls under 4.5:1 once it sits on sable rather than white, and an `<img>` inside a link with no accessible name.

- [ ] **Step 4: Run the byte budgets**

Run: `npm run build && npm run budgets`

Expected: every line `ok`. **The line to watch is `Fonts, total (raw)` at 150 KB.** Two variable faces in their full Latin range can exceed it on their own. The remedy, in the order `scripts/budgets.mjs` itself prints, is to instance the pinned axes — this project fixes `SOFT` at 55 and `WONK` at 0, so the variable axes it is paying for are mostly unused — and to subset to `latin` + `latin-ext`. Raising the number is the last resort, not the first, and it needs a note in the commit saying what was tried.

- [ ] **Step 5: Run Lighthouse and fix what it finds**

Run: `npm run lighthouse`

`lighthouserc.json` gates accessibility, best-practices and SEO at **1.0** — they are sums of binary audits and deterministic on a static site, so anything below 1.0 is a real defect — and performance at **0.95 as the median of three runs**, because the 95→100 band is Lantern simulation reacting to CPU contention on a shared runner, not quality. It also gates LCP ≤ 2.0 s, FCP ≤ 1.5 s, CLS ≤ 0.02 and TBT ≤ 150 ms, which are the metrics that actually mean something.

Likely fixes, in order of frequency: `width`/`height` on an image that lacks them (`unsized-images` is gated), `loading="lazy"` below the fold, `fetchpriority="high"` on the one hero portrait, and preloading the two font files from `BaseLayout`.

- [ ] **Step 6: Read the whole suite**

Open every file under `tests/`, in one sitting. For each test, name the decision it protects in one clause. Any test that cannot be named that way is deleted in this task's commit — deleting a test is a normal commit, and the standards say plainly that an AI agent will never propose one, so the maintainer does. Expect the whole read to take under fifteen minutes; if it does not, the suite has grown past what one volunteer can maintain.

- [ ] **Step 7: Run the device matrix once**

```bash
MATRIX=1 npm run test:e2e
```

Expected: the layout-sensitive specs — landing, profile, carte, a11y — green on iPhone SE, iPhone 14, Pixel 7 and Desktop as well as Galaxy S9+. Everything else stays on the 360px floor, because an assertion about text or a URL learns nothing from a fifth viewport.

- [ ] **Step 8: Commit**

```bash
git add tests/e2e/journey.spec.ts tests/e2e/a11y.spec.ts
git commit -m "test: add the QR journey and the accessibility gate"
```

---

### Task 16: Going live

**Files:**
- Modify: `astro.config.mjs` (the real `site`), `wrangler.toml` (the custom domain), `.github/workflows/ci.yml` (the smoke job's `URL_PROD`)
- Create: `README.md`, `tests/e2e/production.spec.ts`
- Test: `tests/e2e/production.spec.ts` — two tests

**Interfaces:**
- Consumes: a passing build and a green CI.
- Produces: the deployed site on its custom domain.

**Blocked on Adrien — flag these before starting and do not guess:**
1. **The domain is not registered** (spec §14). The mockups assume `annuaire.lacartoucherie.fr`; nothing has been bought. `astro.config.mjs`'s `site`, the QR codes emitted by Task 9 and the smoke job's `URL_PROD` all encode it, and **a QR code printed before the domain is final is paper that has to be thrown away**. Registering it is the first action of this task.
2. **The Cloudflare account is not configured** (spec §14), and `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` are not set as Actions secrets.
3. **Licence and repository visibility are undecided** (spec §14). The plan assumes public — Task 14's entire mechanism exists because of it — but the licence choice between AGPL-3.0 and PolyForm Noncommercial is still open and affects Cloudflare's non-profit credits.
4. **The legal notice is incomplete.** `docs/mentions-legales-a-completer.md` (Task 11) lists what is missing. Going live with visible `⟨à compléter⟩` markers is acceptable for a soft launch and is better than inventing an RNA number; going live with an invented one is not.

**The deploy gate is the spec's own rule applied to CI.** `.github/workflows/ci.yml`'s deploy job carries `needs: [verify, browser, lighthouse]`: no green, no deploy. The first draft offered Cloudflare Workers Builds as an alternative, which deploys on push regardless of CI — fail-open, contradicting spec §3's governing constraint in the one place it is easiest to contradict it silently. **Do not enable Workers Builds on this project**; if it is on, turn it off, or two deployment paths race and the ungated one wins.

- [ ] **Step 1: Confirm the free tier still fails closed**

Re-verify rather than trusting the spec's figures, because rate cards change: Workers static-asset requests unmetered on the free plan; no egress billing on any plan; the free plan throttles rather than invoicing. This is the project's governing constraint (spec §3). If any of the three has changed, stop and tell Adrien before deploying.

- [ ] **Step 2: Write the production smoke test**

```typescript
// tests/e2e/production.spec.ts
// Runs against the deployed site only. It never names a member: production
// contains real people and this file is public.
import { expect, test } from "@playwright/test";

const BASE = process.env.URL_PROD;
test.skip(!BASE, "URL_PROD is not set");

test("Serves the directory over HTTPS, with a working search index", async ({ page, request }) => {
  const response = await page.goto(BASE!);
  expect(response!.status()).toBe(200);
  expect(page.url()).toMatch(/^https:/);

  expect((await request.get(`${BASE}/annuaire`)).status()).toBe(200);

  const index = await request.get(`${BASE}/recherche.json`);
  expect(index.status()).toBe(200);
  const entries = (await index.json()) as unknown[];
  expect(entries.length).toBeGreaterThan(0);
  expect(JSON.stringify(entries)).not.toContain("@");   // no contact details, in production too
});

test("Sets no cookie and sends the headers it promises", async ({ page, context }) => {
  // Registered BEFORE the navigation: the beacon may answer while goto is still
  // resolving, and a wait started afterwards would hang until the timeout.
  const beacon = page.waitForResponse((r) => r.url().includes("cloudflareinsights.com"));
  const response = await page.goto(BASE!);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  // The beacon is the only third-party request the site makes; waiting for it
  // proves analytics is live before asserting that it still sets no cookie.
  await beacon;
  expect(await context.cookies()).toHaveLength(0);

  const headers = response!.headers();
  expect(headers["content-security-policy"]).toContain("script-src 'self'");
  expect(headers["strict-transport-security"]).toContain("max-age=31536000");
  expect(headers["x-content-type-options"]).toBe("nosniff");
});
```

- [ ] **Step 3: Point the project at the real domain**

Once the domain is registered, in one commit:

- `astro.config.mjs`: `site: "https://<the real domain>"`
- `wrangler.toml`: add the custom domain route, and confirm `[assets] directory = "./dist"` still describes a build with no Worker script
- `.github/workflows/ci.yml`: the `smoke` job's `URL_PROD`

Then rebuild, because **every QR code in `dist/qr/` encodes this value**:

```bash
npm run build && grep -o 'https://[^"<]*' dist/qr/*.svg | head -3
```

- [ ] **Step 4: Deploy once by hand, then never again by hand**

```bash
npx wrangler login
CONTENT_DIR=content-private npm run build
npx wrangler deploy
```

Attach the custom domain in the Cloudflare dashboard, then enable Web Analytics and put its token in the repository's `PUBLIC_CF_BEACON_TOKEN` variable. From here on, deployment happens only through the gated CI job: a hand-run `wrangler deploy` bypasses the same gate that Workers Builds would have bypassed.

- [ ] **Step 5: Run the smoke test against production**

```bash
URL_PROD=https://<the real domain> npx playwright test tests/e2e/production.spec.ts
```

Expected: both tests PASS. Then, by hand, on a real phone: scan the printed QR, follow the journey, and press « Appeler ». The dialler must open with the right number. That is the product.

- [ ] **Step 6: Write the README**

How to run it; how to add a neighbour (edit `members.json` in the **private** repository, never in this one, and a slug once published is permanent); what `CONTENT_DIR` does; that the fixture is fictional; and the three silent failures from `docs/mockups/final/README.md` — `@theme static`, `@plugin` being a no-op in the browser build, and `document.fonts.check` lying. Link `docs/STANDARDS.md` and `CLAUDE.md` rather than restating them.

- [ ] **Step 7: Commit**

```bash
git add astro.config.mjs wrangler.toml .github/workflows/ci.yml README.md \
        tests/e2e/production.spec.ts
git commit -m "ci: deploy to Cloudflare Workers on the custom domain"
```

---

## Definition of Done — Plan 1

Checked against spec §12 and `docs/STANDARDS.md`:

- [ ] All four discovery surfaces working — `/`, `/annuaire` + `/categorie/[slug]`, `/carte`, live search
- [ ] `npm run lint` clean: `astro check`, ESLint, `tsc --noEmit`, no barrel file, jscpd
- [ ] `npm run guard` clean: no `<script is:inline>` but the beacon, no `set:html`, no third-party subresource, no disabled pinch zoom
- [ ] Zero axe violations of serious or critical impact on the five pages
- [ ] Lighthouse **accessibility, best-practices and SEO at 1.0**, performance **≥0.95** as the median of three runs, with LCP ≤ 2.0 s, FCP ≤ 1.5 s, CLS ≤ 0.02, TBT ≤ 150 ms
- [ ] `npm run budgets` **and** `tests/e2e/contenu.spec.ts` green on the real content, not only on the fixture — the deploy job runs both before `wrangler deploy`
- [ ] No horizontal overflow at 360px or at 200 % text zoom, on every page
- [ ] The *scan → find → contact* journey green, and green again on the device matrix (`MATRIX=1`)
- [ ] The whole test suite readable in fifteen minutes — around 40 tests, each protecting a nameable decision
- [ ] Deployed to a custom domain through the **gated** CI job, with cookieless analytics reporting
- [ ] Zero cookies set in production, and the CSP, HSTS and nosniff headers asserted against the live response
- [ ] `git log --all --name-only` contains no member data outside `tests/fixtures/`
- [ ] One iPhone 14 screenshot, looked at by a person, showing nothing under the home indicator
- [ ] One side-by-side against each of the four mockups, looked at by a person

**Spec §12's "200 profiles live" was dropped on 2026-10-26:** v1 launched with 6, and the directory grows through v2 self-editing (`docs/ROADMAP.md`). Nothing in the code, the tests or the budgets hardcodes a member count; keep it that way.

**Not in Plan 1, by design:** reviews, accounts and `/admin` (Plan 2); MapLibre replacing the schematic map; R2 and the AVIF/WebP pipeline for portraits; D1 as the build's source (v2, spec §5).

## Open questions for Adrien

1. **The domain.** Nothing is registered, and the QR codes encode it permanently. It must be decided before any flyer or counter QR is printed — Task 16, step 3.
2. **The private content repository.** `cartoucherie-donnees` must exist, with a `CONTENT_REPO_TOKEN` scoped to it, before the first production deploy — Task 14.
3. **Mentions légales.** Association name, legal form, registered address, SIRET or RNA, publication director, contact email, and Cloudflare's current legal entity — `docs/mentions-legales-a-completer.md`.
4. **Licence and repository visibility.** Public is assumed throughout, and Task 14's whole mechanism depends on it. AGPL-3.0 keeps the Cloudflare non-profit credits; PolyForm Noncommercial forfeits them (spec §14).
5. ~~**How many profiles at launch?**~~ Decided 2026-10-26: 6 at launch, growing through v2 self-editing (`docs/ROADMAP.md`).
6. **When do Sandra's real portraits arrive?** They lift the ×1.37 upscale ceiling that currently constrains every photographic decision on the site.
