# Annuaire de la Cartoucherie

A neighbourhood directory for the Cartoucherie district of Toulouse. Someone scans a QR code
on a paper flyer in a shop and needs « quelqu'un qui fait X » — on a phone, maybe on a weak
connection, maybe at 70 with the text size turned up. Every decision serves that person.

**The app is in French. The code is in English.** UI copy, content and user-facing strings
are French; identifiers, comments, filenames, test descriptions, commits and docs are English.

- Design: `docs/superpowers/specs/2026-08-29-annuaire-cartoucherie-design.md`
- Plan: `docs/superpowers/plans/2026-09-14-annuaire-statique.md`
- Standards: `docs/STANDARDS.md`
- Approved mockups: `docs/mockups/final/` — `styleguide.html` is the component authority

## Before you write a new function

1. `grep -rn "^export" src/lib/` — read the whole list. It is about thirty lines. **This is
   the module index.** There is no manifest file, deliberately.
2. Grep the *concept*, not your chosen name: accent, normalize, slug, tel, format, sort.
3. Check `Member` and `Category` in `src/content/schemas.ts` — the field may already exist.
4. Touches `astro:content`, `node:` or the DOM? It does not belong in `src/lib`. Ask whether
   it should be pure and take its data as an argument instead. It usually should.
5. In `.astro` frontmatter? A regex, a branch or a second caller means it moves to `src/lib`.
6. Name it after the domain noun. Do not create a file for one function.

## Three silent failures this project has already hit

Each cost real time. None produce an error message.

- **`@theme static`, never plain `@theme`.** Tailwind 4 tree-shakes theme variables, so any
  CSS reading `var(--color-teal-950)` silently loses its colour.
- **`@plugin "daisyui/theme"` does nothing in the browser build.** The theme is declared as
  CSS variables on `[data-theme="cartoucherie"]`.
- **`document.fonts.check()` returns `false` for a font no element uses** — the font is never
  fetched. Verify by comparing rendered width against the fallback stack.

## Rules with teeth

Full reasoning in `docs/STANDARDS.md`; these are the ones broken most often.

- **`src/lib/**` is pure and isomorphic.** `src/lib/collections.ts` is the only file that may
  import `astro:content`. ESLint enforces it.
- **`any` is a build error.** Types derive from the Zod schemas in `src/content/schemas.ts`.
- **A test is owed to a decision that could have gone the other way, never to a task.** If you
  cannot name the decision in one clause, do not write the test. Assert on what the visitor
  gets — text, computed style, a URL — never on a class name.
- **No barrel files**, no `utils.ts`, no one-line wrappers, no interface for a single
  implementation.
- **Never truncate a member's name.** Never enlarge a portrait past ×1.4 — many sources
  are 128×128 Instagram crops (`sync-content` caps the rest at 384 px), and a blurry face
  destroys the trust the page is building.
- **French agrees with each member's `genre`** — « Ce qu'**elle** propose », « Où **la**
  trouver », « 1 voisin**e** ». `src/lib/gender.ts` is the only owner of the forms table.
- **« voisins », never « membres »**, in user-facing copy. « Avis du quartier », never « avis
  clients ».
- **Fill-only colours:** `accent` (orange) and `secondary` (sauge) measure ~2.5:1 as text on
  white. They are backgrounds with dark ink on top, never text or icon colour.
- **At most three orange objects on any one screen** (60/30/10).

## Never in this repository

**No real member data. Ever.** No real names, addresses, phone numbers, emails or portraits.
The repo is public and git has no erasure: every commit, clone and fork, permanently, and a
phone number cannot be rotated like a token. `tests/fixtures/members.json` is fictional and
stays fictional; real content is injected at build from a private source.

This is not the consent question — that one is settled (spec §3, members gave their details
to the community for visibility). It is about erasure and bulk exposure.

## Commits

Conventional Commits, English, imperative, ≤72 characters:
`feat|fix|docs|style|refactor|test|build|ci|chore`.

**No AI attribution of any kind** — no `Co-Authored-By`, no session trailers, no "Generated
with". A commit-msg hook and CI both reject them.

**GPG signing is configured and prompts interactively.** If `git commit` fails with a pinentry
timeout, stop and ask Adrien to run it. Never use `--no-gpg-sign`.

## Commands

```bash
npm run dev          # Astro dev server
npm run build        # static build to dist/
npm run lint         # eslint + tsc + astro check + no-barrels + jscpd
npm test             # Vitest units
npm run test:e2e     # Playwright — on NixOS: export PLAYWRIGHT_CHROMIUM_PATH=$(command -v google-chrome-stable) first
npm run budgets      # byte budgets over dist/ (~2 s)
```
