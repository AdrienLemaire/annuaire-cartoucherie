# Annuaire de la Cartoucherie — Plan 2: v2 groundwork on the static site

**Status: ready, not started.** Progress lives in `docs/ROADMAP.md`, not in these checkboxes.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship everything v2 changes on the public site — the live fixes the mockups found, « iel », the five new profile fields, generated « Votre histoire » slides and the « Lieux préférés » layer on `/carte` — on the static build alone, against the fictional fixture, with the real profiles unchanged. No Worker, no database, no account. Plan 3 then only has to add the data collector.

**Architecture:** unchanged from v1. Astro static build, content from `CONTENT_DIR` through `scripts/sync-content.mjs`, served as Workers static assets. Two new build-time inputs: a committed OpenStreetMap places snapshot (like `src/assets/quartier.svg`), and slides rendered by satori in `sync-content`, cached across builds.

**Tech stack:** as v1. No new runtime dependency.

**Specs:** `docs/superpowers/specs/2026-10-26-v2-self-service-profiles.md` (v2 spec), `docs/superpowers/specs/2026-10-26-v2-profile-fields.md` (fields doc). v1 spec still holds where v2 is silent.

**Standards (binding):** `docs/STANDARDS.md`. **Mockups (binding):** `docs/mockups/final/styleguide.html` is the component authority; `docs/mockups/v2/membre.html` and `docs/mockups/v2/carte.html` are the composition authority for this plan. The mockup generators and the 200 % checks are in `docs/mockups/v2/scripts/`.

---

## Why two plans

v2 is two subsystems with one contract between them:

|                                     | Ships                                                                                      | Needs                                         |
| ----------------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------- |
| **Plan 2** (this document)          | Live fixes, iel, the five fields, generated slides, favourite places, the `/carte` layer   | Nothing new: the fixture and the static build |
| **Plan 3** (`…-plan-3-accounts.md`) | Accounts, the form, `/admin`, D1, the export, the content deploy, migrating the 6 profiles | Worker, D1, Brevo, Turnstile                  |

**The contract is the content directory.** Plan 2 extends what `CONTENT_DIR` may contain (`members.json` with new fields, `places.json`, story photos). Plan 3's `export-content` writes exactly that layout from D1. Nothing on the public site knows where its content came from.

Every phase below ends in a production deploy through the existing gated pipeline. The real profiles must stay valid at every one of them (Global constraints).

Note: v1's plan called its sequel « Plan 2 — accounts, reviews, moderation ». That scope moved: accounts and moderation are v2 (Plan 3); reviews are after v2 (`docs/ROADMAP.md`).

---

## Global constraints

Every task's requirements include this section and v1's Global Constraints (`docs/superpowers/plans/2026-09-14-annuaire-statique.md`, « Global Constraints »), which still hold: French app and English code, the layering, `src/lib` pure, one normaliser, frontmatter binds and does not compute, domain-noun names, no barrels, the product rules and the platform rules.

### The real profiles stay valid at every deploy

The gated deploy builds against the private `cartoucherie-donnees` checkout until Plan 3 migrates it. So:

- **Every new `memberSchema` field has a `.default(...)`**, as `linkedin` does. A row written before the field existed must parse.
- **A tightened rule is proven against the real rows before it merges.** Adrien runs, on his machine:
  `CONTENT_DIR=../cartoucherie-donnees npm run build`. The agent never opens, prints, copies or summarises that directory, and never asks for its contents. If the build fails, Adrien reports the row number `sync-content` prints, never the row.
- `tests/e2e/contenu.spec.ts` runs against the real build in the deploy job. Nothing it asserts may depend on a field the real rows do not have yet.

### Tests

v1's two task shapes hold (**TDD** for a decision, **Verify** for composition). The decisions this plan owes a test, listed up front so no task invents more:

| Decision                                                                                 | Task        |
| ---------------------------------------------------------------------------------------- | ----------- |
| A member who is not on the map leaves no coordinates in any page                         | 1           |
| A name or e-mail never splits mid-word at 200 % text size                                | 2           |
| iel agrees as « iel », « lae », « voisin·e », « inscrit·e »; counts keep the plural rule | 6           |
| `firstName` never guesses from a compound first name                                     | 3           |
| A slide is rebuilt only when its inputs change                                           | 9           |
| A story answer over its hard limit fails the build                                       | 6 (schema)  |
| Overlapping place markers group, near-but-apart ones do not                              | 11          |
| A member's favourite place that is not in `places.json` fails the build                  | 10 (schema) |

Everything else is a **Verify** step. Data invariants go in Zod, not Vitest (`docs/STANDARDS.md` §2).

### Copy

Every new French string goes in `src/lib/copy.ts`, values French, keys English. Agreement goes through `agree()` only. The mockups hold the approved wording: copy it, do not paraphrase it.

### Orange

Section headings carry no underline (Adrien, 2026-10-30). The orange line lives under the site header and on generated slides only. Three orange objects per screen at most remains a review check, never a test (`docs/STANDARDS.md` §5).

---

## File structure

New and changed files only.

```
scripts/
  sync-content.mjs          CHANGED  copies places.json and story photos; calls story-slides
  story-slides.mjs          NEW      renders « Votre histoire » slides with satori, cached by hash
  places-osm.mjs            NEW      Overpass → src/content/places-osm.json (run by hand, committed)
  budgets.mjs               CHANGED  JS measured per page (Task 11)
src/
  content/
    schemas.ts              CHANGED  genre n, five fields, histoire, lieux, placeSchema
    places-osm.json         NEW      committed OSM snapshot inside MAP_BOUNDS (public data, ODbL)
    places.json             GENERATED by sync-content: snapshot ∪ CONTENT_DIR/places.json
  content.config.ts         CHANGED  places collection
  lib/
    gender.ts               CHANGED  third column « n »
    members.ts              CHANGED  groupGender with n; firstName rule
    text.ts                 CHANGED  longestWord (for --mot)
    contact.ts              CHANGED  breakableParts (e-mail <wbr> points)
    places.ts               NEW      placeGroups (overlap grouping), placesOf, fansOf
    slide.ts                NEW      the slide template: one tree, rendered by satori and by the browser
    collections.ts          CHANGED  loadPlaces
    copy.ts                 CHANGED  new strings
  og/
    font.ts                 NEW      the decompressed Literata, shared by card.ts and story-slides
    card.ts                 CHANGED  imports font.ts
  components/
    PracticalInfo.astro     NEW      b-v2-pratique: tarifs, horaires, réservation, langues
    PlaceMarker.astro       NEW      b-v2-carte-lieux marker (single and grouped)
    PlaceSheet.astro        NEW      b-v2-carte-lieux panel: who named it, their « pourquoi »
    MemberRow.astro, MemberCard.astro, SearchBar.astro, NeedsIndex.astro,
    ReviewsSlot.astro       CHANGED  synced to the styleguide (Task 2)
  client/
    places-layer.ts         NEW      the layer toggle, ?lieu= and ?lieux= filters, the sheet
  pages/
    membre/[slug].astro     CHANGED  enseigne, PracticalInfo, generated slides, places link
    carte.astro             CHANGED  the « Lieux préférés » layer
    index.astro             CHANGED  heading underline removed
  styles/global.css         CHANGED  .mots-entiers, .ff no longer breaks words
tests/
  fixtures/
    members.json            CHANGED  one iel member, story answers, places, the new fields
    places.json             NEW      fictional member-placed places
    histoire/               NEW      two fictional story photos
  unit/                     gender, members, places, story-slides tests
  e2e/                      carte, profile, a11y changes
```

---

## Phase 0 — Live fixes

Small, independent, and visible to today's visitors. Ship this phase alone first.

### Task 1: A member off the map leaves no coordinates in the page

Privacy bug, live today (fields doc §5). `carte.astro` writes `data-lat`/`data-lng` on every row with an address, including members with `surCarte: false` (fixture: `nadia-berrada`). `geolocate.ts` reads them to re-rank rows by the visitor's position.

**Shape:** TDD. **Decision:** a member who chose not to be on the map cannot be located from the HTML.

**Files:** `src/pages/carte.astro`, `src/client/geolocate.ts`, `tests/e2e/carte.spec.ts`.

**Consumes:** `isPinned` (`src/lib/plan.ts`), the one owner of « is there a public point ».

- [ ] **Step 1: Write the failing test** in `tests/e2e/carte.spec.ts`:

```ts
test("A member who is not on the map leaves no coordinates in the page", async ({ page }) => {
  // nadia-berrada: surCarte false, lat/lng set in the fixture.
  const hidden = fixture.members.find((m) => !m.surCarte && m.lat !== null)!;
  for (const path of ["/carte", "/annuaire", `/membre/${hidden.slug}`, "/recherche.json"]) {
    const body = await (await page.request.get(path)).text();
    expect(body, path).not.toContain(String(hidden.lat));
  }
});
```

`fixture` is `tests/e2e/fixture.ts`; if it does not expose `members`, import the JSON there.

- [ ] **Step 2: Run red:** `npm run build && npx playwright test carte -g "no coordinates"`.
- [ ] **Step 3: Implement.** Emit `data-lat`/`data-lng` only when `isPinned(m)`. In `geolocate.ts`, rows without coordinates keep their printed distance and sort after the re-ranked ones; `reorderFromPoint` already ranks `metres: null` last (check, do not rewrite).
- [ ] **Step 4: Run green**, then the whole carte spec.
- [ ] **Step 5: Commit** `fix: keep off-map members' coordinates out of /carte`.

The address text on a `surCarte: false` profile is a product question, not this bug: listed in « Open questions ».

### Task 2: Names and e-mails never split mid-word at 200 %

The mockups' fix, applied to the live components. Today `.ff` sets `overflow-wrap: break-word`, so « Julien Marty » renders « Julie|n Mart|y » at 200 %.

**Shape:** TDD for the rule, Verify for the component sync.

**Files:** `src/styles/global.css`, `src/lib/text.ts`, `src/lib/contact.ts`, `src/components/{MemberRow,MemberCard,SearchBar,NeedsIndex,ReviewsSlot}.astro`, `src/pages/membre/[slug].astro`, `src/pages/carte.astro`, `tests/unit/text.test.ts`, `tests/e2e/a11y.spec.ts`.

**Consumes:** the styleguide blocks `b-fiche`, `b-carte`, `b-contact`, `b-services`, `b-recherche`, `b-index`, `b-avis` — copy their class lists, do not approximate them. `.mots-entiers` and its comment come from the styleguide's `src-css-produit`.

- [ ] **Step 1: Failing e2e test** in `tests/e2e/a11y.spec.ts`, next to the existing 200 % overflow test (same page list, same `html{font-size:200%}` injection):

```ts
test(`${path} never splits a word across two lines at 200 % text zoom`, async ({ page }) => {
  await page.goto(path);
  await page.addStyleTag({ content: "html{font-size:200%}" });
  const split = await page.evaluate(() => {
    const out: string[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      for (const m of n.textContent!.matchAll(/[\p{L}\p{N}@._'’-]{2,}/gu)) {
        const r = document.createRange();
        r.setStart(n, m.index!);
        r.setEnd(n, m.index! + m[0].length);
        const tops = new Set([...r.getClientRects()].map((q) => Math.round(q.top)));
        // A break at a hyphen is French typography, not a defect.
        if (tops.size > 1 && !m[0].includes("-")) out.push(m[0]);
      }
    }
    return out;
  });
  expect(split).toEqual([]);
});
```

The same probe is `docs/mockups/v2/scripts/check/carte.mjs`'s `BREAKS`; keep them equivalent.

- [ ] **Step 2: Red** on at least `/membre/julien-marty` and `/annuaire`.
- [ ] **Step 3: `longestWord` in `src/lib/text.ts`** (TDD, unit): the letter count of the longest word of a string, words split on spaces and hyphens. The build writes it as `style="--mot:N"`; `.mots-entiers` sizes the text from the container width and `--mot`. Test: « Julien Marty » → 6, « Menuisier-ébéniste » → 9.
- [ ] **Step 4: `breakableParts` in `src/lib/contact.ts`** (TDD, unit): splits an e-mail or a URL before « @ » and « . » and after « _ », so the template renders `{parts.map((p) => <>{p}<wbr /></>)}`. `set:html` stays banned. Test: `"camille.roussel@example.fr"` → `["camille", ".roussel", "@example", ".fr"]`.
- [ ] **Step 5: Sync the components** to the styleguide blocks listed above: names and métier lines use `.mots-entiers` inside an `@container` (on the `min-w-0` child together with `flex-1`, or it collapses to zero width), rows wrap like `b-contact`, e-mails use `breakableParts`. Remove `overflow-wrap:break-word` from `.ff` once nothing relies on it (the 200 % test proves it).
- [ ] **Step 6: Green**, then `npm run test:e2e`, `npm run budgets`.
- [ ] **Step 7: Verify by eye** at 360 px, 100 % and 200 %, against the styleguide blocks: `/`, `/annuaire`, `/membre/julien-marty`, `/carte`.
- [ ] **Step 8: Commit** `fix: keep names and e-mails whole at 200 % text size`.

### Task 3: `firstName` stops guessing

`firstName("Jean Marc Dupont")` returns « Jean » (fields doc §5). « Appeler Jean » to Jean-Marc is wrong; « Appeler Jean Marc Dupont » is long but never wrong.

**Shape:** TDD. **Decision:** a first name is taken only when it is unambiguous.

**Files:** `src/lib/members.ts`, `tests/unit/members.test.ts`.

- [ ] **Step 1: Failing tests:** « Camille Roussel » → « Camille »; « Jean-Marc Dupont » → « Jean-Marc »; « Jean Marc Dupont » (three words) → the full name; « Inès » → « Inès ».
- [ ] **Step 2: Implement:** two words → the first; anything else → the full name. Plan 3 adds an optional `prenom` the member types; until then, this rule.
- [ ] **Step 3: Green. Commit** `fix: never guess a first name from three words`.

### Task 4: Section headings lose their underline

Adrien, 2026-10-30: with the header line and « Appeler », two underlined headings on one screen made 4–5 orange objects.

**Shape:** Verify.

**Files:** `src/pages/membre/[slug].astro` (4), `src/components/ReviewsSlot.astro`, `src/pages/index.astro`, `src/pages/carte.astro` (2): every `<div class="filet … w-16 …">` under a heading. The header's full-width `.filet` in `SiteHeader.astro` stays.

- [ ] **Step 1:** Remove them; headings take `mb-5` as in the styleguide (`b-contact`, `b-services`, `b-avis`).
- [ ] **Step 2: Verify:** `grep -rn 'filet' src/` lists only `SiteHeader.astro`, `global.css` and the slide template (Task 8). Screenshot `/membre/camille-roussel` at 360 px and count orange objects per screen by eye: three at most.
- [ ] **Step 3: Commit** `style: drop section-heading underlines`.

### Task 5: Schema hardening, proven on the real rows

Fields doc §5: categories are not checked against `categories.json`; `services` and `adresse` accept empty values; `site` and `instagram` are unvalidated.

**Shape:** Verify (these are Zod rules: a refusal fails the build at the moment of the mistake, which is the test).

**Files:** `src/content/schemas.ts`, `src/lib/collections.ts`.

- [ ] **Step 1:** `services: z.array(z.string().trim().min(1).max(75)).min(1).max(6)`; `site`: host and path, no scheme (`/^[a-z0-9.-]+\.[a-z]{2,}(\/\S*)?$/i`); `instagram`: a handle (`/^[A-Za-z0-9._]{1,30}$/`).
- [ ] **Step 2:** Unknown categories: `loadMembers` (the one place that holds both collections) throws naming the row number, never the slug, when a member names a category `categories.json` lacks. Also: at most two categories (decision 7).
- [ ] **Step 3: Verify on the fixture:** `npm run build`.
- [ ] **Step 4: Verify on the real rows: hand to Adrien.** He runs `CONTENT_DIR=../cartoucherie-donnees npm run build` and reports pass, or the failing row number and rule. A real row that fails is corrected in the private repository by Adrien before this merges; the rule is not loosened to fit it unless he says so.
- [ ] **Step 5: Commit** `fix: validate categories, services and links in the schema`.

**Phase 0 done:** `npm run lint && npm test && npm run build && npm run budgets && npm run test:e2e` green; merged to `develop`, checked on staging, then `main`.

---

## Phase 1 — The v2 content model

### Task 6: « iel » and the new fields in the schema

**Shape:** TDD for agreement; Verify for the schema.

**Files:** `src/content/schemas.ts`, `src/lib/gender.ts`, `src/lib/members.ts`, `tests/unit/gender.test.ts`, `tests/unit/members.test.ts`, `tests/unit/factory.ts`.

- [ ] **Step 1: Failing tests** (`gender.test.ts`): `agree("n", "elle")` → « iel »; `"la"` → « lae »; `"voisine"` → « voisin·e »; `"inscrite"` → « inscrit·e ». (`members.test.ts`): `formatMemberCount(1, ["n"])` → « 1 voisin·e »; `formatMemberCount(2, ["f","n"])` → « 2 voisins »; `formatMemberCount(2, ["f","f"])` → « 2 voisines » (today's rule: feminine plural only when everyone is « f »; fields doc §7).
- [ ] **Step 2: Implement:** `genderSchema = z.enum(["f", "h", "n"])`; a third column in `FORMS`. The count rule changes in one place, `memberCountParts`: **a count of 1 takes that person's own gender** (« 1 voisin·e », « 1 voisine », « 1 voisin »); several people keep today's plural rule through `groupGender` (feminine plural only when everyone is « f », otherwise « voisins »). Watch the elision in `copy.ts`: « Ce qu'iel propose », « Lae contacter » — read every `agree()` caller and its sentence aloud with « n ».
- [ ] **Step 3: The five fields** (fields doc §1), each `.nullable().default(null)`: `enseigne` (≤ 60), `tarifs` (≤ 120), `horaires` (≤ 120), `reservation` (`https://` URL), and `langues` (`z.array(z.string()).default([])`).
- [ ] **Step 4: `histoire`** — six optional answers, hard limits from fields doc §7, plus an optional photo per answer:

```ts
const answer = (max: number) =>
  z.object({ texte: z.string().trim().min(1).max(max), photo: z.string().regex(IMAGE_FILE).nullable().default(null) });

export const storySchema = z.object({
  pourquoi: answer(300).nullable().default(null),
  declic: answer(300).nullable().default(null),
  activite: answer(300).nullable().default(null),
  reseau: answer(300).nullable().default(null),
  lieux: answer(160).nullable().default(null), // the sentence on the places slide
  motto: answer(120).nullable().default(null),
});
// in memberSchema:
histoire: storySchema.prefault({}), // Zod 4: .default({}) would return {} unparsed, skipping the inner defaults
lieux: z.array(z.object({ place: z.string().regex(SLUG), pourquoi: z.string().trim().max(80).nullable().default(null) })).max(5).default([]),
```

Keys are French, like every data key (v1 Global Constraints). The order of the slides is the order of the keys; it lives once, in `slide.ts` (Task 8).

- [ ] **Step 5: `factory.ts`** gains the new defaults. **Green.**
- [ ] **Step 6: Fixture** (`tests/fixtures/members.json`, fictional only):
  - Add Sacha Morel exactly as `docs/mockups/_shared/members.json` has them (iel, céramiste), with a 128×128 portrait under `tests/fixtures/portraits/`. Use the mockup's (`women/79`) only after checking it comes from the same source as the twelve already there (their origin is not recorded in the fixture commit: ask Adrien); never a photo of a real member.
  - Give Sophie Arnaud the full v2 profile from `docs/mockups/v2/membre.html`: enseigne, tarifs, horaires, réservation, langues, six answers, five places.
  - Give two other members partial data (some fields, some answers), so empty states render.
  - `tests/fixtures/histoire/`: two fictional story photos (abstract or object photos, 1080 px, no person).
- [ ] **Step 7: Verify:** `npm run build`; then Adrien's real-row build (Global constraints): the new fields default, so it must pass unchanged.
- [ ] **Step 8: Commit** `feat: add iel and the v2 profile fields to the schema`.

### Task 7: The profile page shows the new fields

**Shape:** Verify (composition). **Authority:** `docs/mockups/v2/membre.html`, frames 4 (Sophie) and 5 (Sacha); styleguide `b-v2-pratique`, `b-fiche` (« métier · enseigne »).

**Files:** `src/components/PracticalInfo.astro`, `src/pages/membre/[slug].astro`, `src/lib/copy.ts`.

- [ ] **Step 1:** `enseigne` after the métier, joined « · », in the identity card.
- [ ] **Step 2:** `PracticalInfo.astro` from `b-v2-pratique`: tarifs, horaires, « Réserver en ligne » (the booking link, `breakableParts` for its host), « Parle aussi : … ». Renders nothing when all are empty. Its three columns respond to the card's width (`@container`), not the screen's.
- [ ] **Step 3:** Verify on `/membre/sophie-arnaud` (full), `/membre/camille-roussel` (none), a partial member, and `/membre/sacha-morel` (every agreement reads iel: « Lae contacter », « Ce qu'iel propose », « Où lae trouver »). 360 px and 1200 px, 100 % and 200 %. The Task 2 test now covers these pages too: add Sophie and Sacha to its page list.
- [ ] **Step 4: Commit** `feat: show business name, prices, hours, booking and languages`.

### Task 8: The slide template, one tree for two renderers

The form's live preview (Plan 3) and the build must draw the same slide. Satori takes a tree of `{ type, props: { style, children } }`. So the template is a **pure function in `src/lib/slide.ts` returning that tree**; the build hands it to satori, and Plan 3's browser preview turns the same tree into DOM with a ~20-line renderer. One template, so the preview cannot drift.

**Shape:** spike first (Step 1), then Verify.

**Files:** `src/lib/slide.ts`, `src/og/font.ts`, `src/og/card.ts`.

**Authority:** styleguide `b-v2-diapos` — cover, six questions × house and photo variants, the arch of the Halle on every slide, Colly on « Les entrepreneurs de la Cartoucherie & moi » only, the title underline.

- [ ] **Step 1: Spike (gate for the rest of the phase).** Render the cover, one house slide and one photo slide at 1080×1350 with satori and Literata, at the hard limits (300 characters of long words under the 42-character title; the 61-character UCPA place name). Record in the task report:
  - which of the styleguide's CSS satori refuses (`var()`, `cqi`, `oklch()`, `aspect-ratio` are known suspects) and the px/hex it resolves to;
  - the time per slide on this machine and on a CI runner (one manual `workflow_dispatch` run of a throwaway branch is fine), extrapolated to 200 profiles × 7 slides;
  - the WebP size at 720 and 1080 px, against the 100 KB heaviest-image budget.
    If a slide cannot match the styleguide in satori, stop and bring the difference to Adrien with screenshots before continuing.
- [ ] **Step 2: `src/og/font.ts`:** move the decompressed-Literata loader out of `card.ts`, unchanged; `card.ts` imports it. Source Sans 3 is added the same way if the body text needs it (check whether it carries an fvar table first: satori's parser throws on one — see the comment in `card.ts`).
- [ ] **Step 3: `slide.ts`** exports:
  - `STORY_ORDER`: the six keys in slide order, with their French titles (in `copy.ts`) and limits (from the schema, not restated);
  - `slideTree(kind, data)`: `kind` is `"cover" | keyof Story`; `data` carries name, métier, enseigne, gender, the text, an optional photo URL and, for `lieux`, the place names. Pure: no `node:`, no DOM; images are passed in as URLs (build: `data:` URLs; browser: object URLs).
  - Colours as hex literals copied from `global.css` tokens, never `var()`.
- [ ] **Step 4: Verify:** render the six slides of Sophie and of a minimal member to `/tmp`, open them beside `b-v2-diapos` at the same width. Same composition, same line breaks within reason.
- [ ] **Step 5: Commit** `feat: add the story slide template`.

### Task 9: Slides rendered at build, cached across builds

**Shape:** TDD for the cache decision; Verify for the rest.

**Files:** `scripts/story-slides.mjs`, `scripts/sync-content.mjs`, `src/lib/members.ts` (`slideSrc`), `.gitignore`, `.github/workflows/ci.yml`, `tests/unit/story-slides.test.ts`.

Generated slides become ordinary carousel entries, **without touching the content source**: `story-slides.mjs` writes `<slug>-histoire-<n>.png` into a generated, git-ignored directory (`.cache/slides/out/`), and appends `{ fichier, texte }` to the member's `carrousel` in the generated `src/content/members.json` only (`texte` is the answer: the alt text). `sync-content`'s WebP step reads slides from both the content source and that directory. The committed fixture and the private checkout are never written to. `PortraitCarousel.astro` and `sync-content`'s WebP pipeline stay unchanged. Members with a non-empty hand-made `carrousel` (the 6 existing profiles, Sandra's slides) keep theirs; generated slides are only for members without one (decision 4).

- [ ] **Step 1: Failing test:** the cache key of a slide is a hash of `(slideTree output, template version, font file hash, photo bytes hash)`. Changing one answer changes that slide's key and no other; changing nothing changes nothing. `slideKey` is a pure function in the script module, imported by the test.
- [ ] **Step 2: Implement** `story-slides.mjs`: for each member and each answered question, `slideKey` → if `.cache/slides/<key>.png` exists, copy it; else render with satori + sharp and store it. Called by `sync-content` after it copies `members.json`. `.cache/` is git-ignored.
- [ ] **Step 3: CI cache.** Cache entries are immutable once saved, so a fixed key would be saved once and never refreshed. Key: `slides-<environment>-${{ hashFiles('src/lib/slide.ts', 'src/og/font.ts') }}-${{ github.run_id }}`, `restore-keys: slides-<environment>-${{ hashFiles(…) }}-`. Before the cache is saved, `story-slides` **prunes every entry this build did not use**, so a deleted or hidden member's slides leave the cache at the next deploy. Separate prefixes for the fixture (`verify`) and each real environment (`deploy`, `content-deploy`). Assume the cache is readable by anyone able to run a workflow on the repository (pull requests can restore base-branch caches; check GitHub's cache access rules and cite them): it may only ever hold slides of currently published profiles, which are public on the site anyway. Never upload it as an artifact.
- [ ] **Step 4: Verify:** a cold `npm run build`, then a warm one: the warm one renders zero slides (log the count). Build time for the fixture recorded in the task report, extrapolated with Task 8's numbers. `npm run budgets` green.
- [ ] **Step 5: Verify on the profile:** `/membre/sophie-arnaud` shows the generated carousel; the slides' alt text is the answers; full screen works; `/membre/camille-roussel` (no answers) shows none.
- [ ] **Step 6: Commit** `feat: generate story slides at build`.

### Task 10: Places — snapshot, schema, collection

**Shape:** Verify (schema and composition).

**Files:** `scripts/places-osm.mjs`, `src/content/places-osm.json`, `src/content/schemas.ts`, `src/content.config.ts`, `src/lib/collections.ts`, `scripts/sync-content.mjs`, `tests/fixtures/places.json`, `src/pages/a-propos.astro` or the existing OSM attribution.

- [ ] **Step 1: `places-osm.mjs`** on the model of `map-svg.mjs` (same `MAP_BOUNDS`, Overpass endpoint and user agent, run by hand, output committed): named nodes and ways with `amenity`, `shop`, `leisure`, `tourism` or `sport` inside the bounds; ways reduced to their centre. Map OSM tags to the seven types (café, restaurant, parc, boutique, sport, culture, autre) in one table in the script. Output: `{ id: "osm-<type>-<id>", nom, type, lat, lng, source: "osm" }`, sorted by `nom`. The 2026-10-27 run found 158; a large difference means the query changed, not the quartier.
- [ ] **Step 2: `placeSchema`:** `id` (slug-like), `nom` (≤ 80), `type` (the seven), `lat`, `lng` inside `MAP_BOUNDS` (a `refine` reusing `plan.ts`'s bounds, not a copy), `source` (`osm` | `member`), and `owner` (a member slug, for a place that is a member's business), nullable.
- [ ] **Step 3: `sync-content`** writes `src/content/places.json` = the committed snapshot ∪ `CONTENT_DIR/places.json` (member-placed places, already approved: Plan 3's export never writes a pending or refused one). Missing file → snapshot only. An `id` present in both is a build error.
- [ ] **Step 4:** `loadPlaces` in `collections.ts`; `loadMembers` throws (row number only) when a member's `lieux[].place` names a place that does not exist. That is the schema-level test for « a favourite place must exist ».
- [ ] **Step 5: Fixture:** `tests/fixtures/places.json` with two fictional member-placed places and one owned by a fixture member (`owner`), matching `docs/mockups/v2/carte.html`'s data.
- [ ] **Licence.** A snapshot of OSM data published as a file is a derivative database, so it is under the ODbL (share-alike), not merely attributed (<https://osmfoundation.org/wiki/Licence/Community_Guidelines/Produced_Work_-_Guideline>). The script writes `src/content/places-osm.json` with a top-level `licence: "ODbL-1.0"` and `attribution: "© les contributeurs d'OpenStreetMap"`, and `/lieux.json` (Plan 3) carries the same two fields. Member-placed places merged into that file fall under the same licence: mention it on `/a-propos` next to the map credit. Overpass: one query, a `User-Agent` naming the project, run by hand (<https://wiki.openstreetmap.org/wiki/Overpass_API>).
- [ ] **Step 6: Verify:** `npm run build`; ODbL attribution: wherever the map's « © les contributeurs d'OpenStreetMap » appears, it now also covers the places; check the wording against `docs/mockups/v2/carte.html`.
- [ ] **Step 7: Commit** `feat: add the OpenStreetMap places snapshot`.

### Task 11: Budgets per page

Plan 3 adds real client JS to `/espace` and `/admin`. Today's budget sums every `.js` file in `dist/` against 40 KB, so it would fail for the wrong reason, or be raised for everyone.

**Shape:** Verify.

**Files:** `scripts/budgets.mjs`.

- [ ] **Step 1:** Measure JS per page: for each `dist/**/*.html`, the gzip size of the module scripts it loads plus their static imports (follow `import "./x.js"` / `from "./x.js"` in the emitted chunks). Budgets: every public page ≤ 40 KB, any single file ≤ 25 KB as today; `/espace*` and `/admin*` get their own line, set in Plan 3 from a measurement, not guessed here.
- [ ] **Step 2: Verify:** the numbers for public pages match today's run within rounding; Task 12's `places-layer.ts` will then be counted on `/carte` only.
- [ ] **Step 3: Commit** `build: measure the JavaScript budget per page`.

### Task 12: The « Lieux préférés » layer on `/carte`

**Shape:** TDD for grouping; Verify for the layer.

**Authority:** `docs/mockups/v2/carte.html` (all nine frames) and styleguide `b-v2-carte-lieux` (markers, the group marker, the sauge corner on a member's pin, the sheet).

**Files:** `src/lib/places.ts`, `src/components/PlaceMarker.astro`, `src/components/PlaceSheet.astro`, `src/client/places-layer.ts`, `src/pages/carte.astro`, `src/lib/copy.ts`, `tests/unit/places.test.ts`, `tests/e2e/carte.spec.ts`.

- [ ] **Step 1: Failing tests** (`places.test.ts`) for `placeGroups(places, size)`: two places whose 30 px markers overlap form one group; two at 37 px do not (Le Bar des 500 and L'autre rive in the mockup); a place overlapping any member of a group joins it; a group's position is its members' centre. Pixel positions come from `projectOnMap`, so the test uses real `MAP_BOUNDS` coordinates.
- [ ] **Step 2: Implement** `places.ts`: `placeGroups`, `fansOf(place, members)` (who named it, with their « pourquoi », most recent first), `placesOf(member, places)`.
- [ ] **Step 3: The layer** (static HTML, enhanced by `places-layer.ts`):
  - Off by default; a « Lieux préférés » switch above the map (frame 1).
  - On: sauge-700 rounded squares with the type icon, never orange; groups as the numbered marker (frame 2). Only places at least one published member named are drawn.
  - A place a member owns is that member's pin with the sauge corner; its sheet shows their portrait and « Voir sa fiche » (frame 4).
  - Tapping a place opens `PlaceSheet` below the map and scrolls to it (frames 3, 6).
  - `?lieu=<id>`: only that place and its fans (frame 5). `?lieux=<member>`: only that member's places, their pin selected, « Les lieux favoris de <prénom> » (frame 5 bis). `firstName` from Task 3.
  - Nobody named a place yet: the status line of frame 7.
  - Without JavaScript: the layer is a list of places under the map, each a link to `?lieu=`. The page stays usable.
- [ ] **Step 4: Profile link:** « Ses lieux favoris, sur la carte » under the carousel, to `/carte?lieux=<slug>#plan`, only when the member has places.
- [ ] **Step 5: e2e** (one test, the decision « the layer is off until asked »): `/carte` shows no place marker; after the switch, the fixture's places appear; `?lieux=sophie-arnaud` shows exactly her places.
- [ ] **Step 6: Verify** every frame of `docs/mockups/v2/carte.html` against the built page at 360 and 1400 px, 100 % and 200 %. Lighthouse on `/carte` stays within `lighthouserc.json`.
- [ ] **Step 7: Commit** `feat: add the favourite places layer to the map`.

**Phase 1 done:** the full gate green; staging checked against `docs/mockups/v2/membre.html` and `carte.html` by Adrien on a real phone; Adrien's real-row build passes; deploy to production. The real profiles look exactly as before, minus the heading underlines and the 200 % breaks.

---

## Definition of done — Plan 2

- No coordinates for an off-map member anywhere in `dist/`.
- No word splits mid-word at 200 % on any page in the a11y list.
- « iel » agrees everywhere `agree()` is used; Sacha Morel's fixture profile reads correctly aloud.
- The five fields, generated slides and the places layer render from the fixture as in the approved mockups.
- A warm build renders no slide twice; build time and slide sizes recorded.
- The real profiles build unchanged at every merge, verified by Adrien.
- Budgets, Lighthouse and axe gates unchanged and green.

## Open questions for Adrien

1. **Address of an off-map member.** `surCarte: false` now hides the coordinates. The profile still prints the street address. Should it print only the street, or nothing, for a home address? Plan 3's form asks « Je reçois à une adresse » / « Je me déplace »; this matters for the 6 existing profiles now.
2. **Places layer for visitors on the 6 real profiles.** Until Plan 3 ships, no real member has favourite places, so the switch would show an empty layer in production. Ship the switch hidden until at least one real member has places? Recommended: yes, hidden when the set is empty (frame 7 stays for the case where it is shown).
