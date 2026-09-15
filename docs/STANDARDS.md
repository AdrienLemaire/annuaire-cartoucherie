# Engineering standards

The app is in French. The code is in English — identifiers, comments, filenames, test
descriptions, commits and documentation.

Configuration is not prose. Every rule below that a machine can check lives at its real
path: `eslint.config.js`, `.github/workflows/ci.yml`, `lighthouserc.json`, `scripts/budgets.mjs`,
`public/_headers`, `commitlint.config.js`, `.husky/commit-msg`. This file explains the *why*
and lists what only a human can check.

## 1. Architecture

**Four layers, one direction: `lib → components → layouts → pages`.** Enforced per-directory
in `eslint.config.js`.

**`src/lib/**` is pure and isomorphic.** No `astro:*`, no `node:*`, no DOM. `search.ts` is
bundled into the browser, and helpers trapped behind an Astro import cannot be unit-tested
without re-reading JSON from disk. `src/lib/collections.ts` is the single exception and the
only file that may load content; every other helper takes its data as an argument.

**Types derive from the Zod schemas. `any` is a build error.** `src/content/schemas.ts` owns
`memberSchema`, `categorySchema` and the inferred `Member` / `Category` types, importing `z`
from `zod` — never from `astro:content`, which would drag the content runtime into the
browser bundle. A typed signature is the cheapest reuse index there is: hovering `Member`
beats any manifest.

**One normaliser for the whole project.** `src/lib/text.ts` owns `stripAccents`, `normalize`
and `slugify`. This rule exists because the first draft of the plan shipped two of them —
`slugify` and `normaliser`, both NFD → strip marks → lowercase, written in the same document
by the same author, before any agent touched the repo.

**`.astro` frontmatter binds data; it does not compute it.** A regex, a branch, a format or a
second caller means the logic moves to `src/lib`. No linter catches this — frontmatter sits
at module top level, so `complexity` never fires. Review-only, and worth being strict about.

**Files are named after the domain noun.** `MemberCard.astro`, never `Card.astro`. An agent
asked for "the card that shows a member" finds `MemberCard` by name; it finds `Card` only by
opening it. Predictable naming does more against duplication than any index, because it works
without anyone consulting anything.

**No barrel files.** The directory listing is the public API. A `lib/index.ts` would pull
`astro:content` into the client bundle the moment anything imported `search` through it.
Checked by `find src -name index.ts` in `npm run lint`.

**Budget functions, not files.** `complexity: 10`, `max-depth: 3`, `max-params: 4`,
`max-lines-per-function: 60`. Deliberately no `max-lines` on files: a file ceiling produces
`search-helpers.ts` next to `search.ts` and makes the codebase harder to navigate.

### There is no module index, on purpose

`grep -n "^export" src/lib/*.ts` **is** the index — about thirty lines, one command, never
stale. A hand-written manifest is stale within three tasks and then actively harmful, because
an agent that trusts a wrong manifest searches *less* than one that trusts nothing. What
actually prevents duplication, in order: predictable naming, the checklist in `CLAUDE.md`,
and the per-task **Consumes:** lists in the plan.

### Before you write a new function

1. `grep -rn "^export" src/lib/` — read the whole list.
2. Grep the *concept*, not your chosen name: accent, normalize, slug, tel, format, sort.
3. Check `Member` and `Category` in `src/content/schemas.ts` — the field may already exist.
4. Touches `astro:content`, `node:` or the DOM? Then it does not belong in `src/lib` — and
   ask whether it should be pure and take its data as an argument. It usually should.
5. Writing it in `.astro` frontmatter? A regex, a branch or a second caller means `src/lib`.
6. Still new? Name it after the domain noun, put it in the module owning that noun, and do
   not create a file for one function.

### Anti-patterns

`utils.ts` / `helpers.ts` — a write-only junk drawer nobody greps, because the name describes
nothing. Every helper has a subject: text, phone, gender, search.

A `MemberRepository` interface "for when D1 arrives" — spec §2 says the v1 data model
accommodates v2 and *the v1 code does not contain it*. One implementation behind an interface
is not dependency inversion, it is a second file to keep in sync. Here, DIP means depending
on `Member`, not on `CollectionEntry<"members">` — which is also what makes the v2 swap a
one-file change.

`Button.astro` wrapping a daisyUI class string — a layer that obscures which daisyUI
component is in play. Wrap only for real logic: `CallButton` earns its place through `tel:`
formatting and the sticky safe-area variant, not through `.cta`.

One-line wrappers, `Props` interfaces extracted to `types/`, a category registry for ten rows
of JSON, barrels.

## 2. Testing

**A test is owed to a decision that could have gone the other way — never to a task.** The
plan's first draft gave every task a "write the failing test" step, so logic-free tasks
grepped their own source files to satisfy the ritual. That is grep in a test's costume.

Six questions; any *no* is a delete, not a discussion:

1. Name the decision it protects, in one clause, without reading the implementation.
2. Could it fail? Write the change that turns it red. If that change is "delete the feature"
   or "rename a class", it is not a test.
3. Is it the only one? No-horizontal-scroll was asserted eight times. Once.
4. Would a cheaper layer catch it first — a schema, a type, the build?
5. Does it fail for the right reason? A test that goes red when Sandra adds a thirteenth
   neighbour is a false alarm with a countdown timer.
6. Is it cheap? A Vitest test is ~free. A Playwright test on five devices is five runs.

**Data invariants belong in the Zod schema, not in Vitest.** Sandra edits `members.json` and
will never run a test. A schema refusal fails her build at the moment of the mistake; a
Vitest failure reaches nobody.

**Assert on what the visitor gets** — rendered text, computed style, a URL — never on the
class name we happen to spell it with today. `expect(html).not.toContain("truncate")` is
unsound (it passes if someone hand-writes `overflow-hidden text-ellipsis`) and fragile (it
breaks on a rename that is not a defect). Class-name checks belong in the CI grep script,
where nobody mistakes them for coverage. The one exception is the `data-` attribute contract
with Plan 2, which is a documented interface rather than styling.

**Flaky: delete, never quarantine.** One maintainer means a quarantine lane is a graveyard
with a subscription fee. Diagnose once — if the product is racy, that flake is a bug report
from a slow phone in a shop, which is this project's whole premise. If the test's own timing
is at fault, delete it next commit. `retries: 0` everywhere; `page.waitForTimeout()` banned.

**Every e2e assertion runs once, on one device, unless the assertion is about the device.**
Galaxy S9+ (360 px) is the floor and the default. The full matrix runs before deploy only,
for the layout-sensitive specs.

**Read the whole suite at the end of every task, and once before deploy.** Deleting a test is
a normal commit. An AI agent will never propose one, so the maintainer does.

### On the 60/30/10 ratio

A bad target and a decent smoke alarm — kept, but demoted. It measures typing volume, not
risk: the first draft's suite already sat near 30 % and half of it deserved deleting, so a
metric a bad suite satisfies is not measuring quality. It also invites both failure modes —
padding under target, deleting a good long test over it — and it does not fit a markup-heavy
static site, where an `.astro` file is forty lines of Tailwind and three of logic.

Use it as a **ceiling with a review trigger**, never a floor to reach. Count only `src/lib`
and page logic against `tests/`, and only `README` + `docs/STANDARDS.md` as docs — specs and
plans are process artifacts, not documentation of the code.

The better question, and the one to actually hold: **can the maintainer read the entire suite
in fifteen minutes?** At ~30 tests, yes. It resists gaming and it fails exactly when the
suite stops being maintainable.

## 3. Web standards

**Accessibility — WCAG 2.2 AA floor.** axe gated at zero serious or critical violations;
Lighthouse accessibility, best-practices and SEO gated at **1.0** (sums of binary audits,
deterministic on a static site). No horizontal overflow at 360 px or at 200 % text zoom.
Touch targets ≥44 px, covered by axe's `target-size` at `wcag22aa`. Search input ≥16 px, or
iOS Safari zooms the page on focus.

RGAA binds public bodies and large companies, not a neighbourhood association — WCAG 2.2 AA
here is a choice about the users, which is the better reason to hold it.

**Performance — gated at 0.95, median of three runs.** The site will usually score 100, but
the 95→100 band is Lantern simulation reacting to CPU contention on a shared runner, not
quality. A fall from 100 to 97 is *investigate*, never *block*. The real gates are the
metrics underneath — LCP ≤ 2.0 s, FCP ≤ 1.5 s, CLS ≤ 0.02, TBT ≤ 150 ms — and the byte
budgets in `scripts/budgets.mjs`, which run on every push in about two seconds and never
flake. INP is not lab-measurable; it is a field budget read from Web Analytics, with TBT as
its gated proxy.

**Security.** The threat model for a static site with no backend, no accounts and no cookies
is narrow and the controls are correspondingly few: response headers in `public/_headers`
asserted against the live response, `npm audit` in CI, Dependabot alerts, and GitHub secret
scanning. A ~50 ms grep over `src/` bans `<script is:inline>` (the CSP's `script-src 'self'`
depends on it and would otherwise fail silently only in production), `set:html`, third-party
origins, and `maximum-scale` / `user-scalable=no`.

Lighthouse has no security category — "perfect Lighthouse security" is not a thing, and
`csp-xss` is informational at weight 0. SRI is deliberately **not** used: the only
third-party script is Cloudflare's analytics beacon, which publishes no stable hash, so SRI
would break the site on their next rotation. Self-hosting everything else plus the
no-third-party-origins rule is the equivalent guarantee, and that one is enforced.

## 4. Commits

Conventional Commits, enforced by `commitlint.config.js` and `.husky/commit-msg`.
Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `build`, `ci`, `chore`.
Subject in English, imperative, ≤72 characters, no trailing period.

**No AI attribution, ever** — no `Co-Authored-By`, no session trailers, no "Generated with".
Agent harnesses inject these automatically, so this is enforced by a regex in both the
commit-msg hook and CI. A rule without a mechanism loses that argument on every commit.

## 5. What only a human can check

Listing these is the point: anything below is *not* covered by CI, and a test that pretends
to cover it is worse than none.

- **The safe-area inset on a notched phone.** Playwright does not set
  `env(safe-area-inset-*)`, so any assertion on the sticky bar's padding passes vacuously.
  The guard is one iPhone 14 screenshot, looked at by a person.
- **Fidelity to the mockups** — type scale, colour, spacing rhythm, component shape. The
  side-by-side against `docs/mockups/final/` is better *because* it is manual: it is the
  check where the diff can be correct and the page still wrong.
- **The 60/30/10 orange balance, Colly's tone, typographic rhythm, whether a face reads as a
  face.** Automating these produces confident nonsense.
- **French copy** — that it reads as a neighbour wrote it, and that it reads well aloud.
- **`.astro` frontmatter discipline** and **domain-noun naming**, per §1.
- **Whether a test still earns its place**, per §2.
