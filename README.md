# Annuaire de la Cartoucherie

A neighbourhood directory for the Cartoucherie district of Toulouse. Someone scans a QR code
on a paper flyer in a shop and needs « quelqu'un qui fait X » — on a phone, maybe on a weak
connection, maybe at 70 with the text size turned up. Every decision in this repository serves
that person: no login, no app to install, a call button in the thumb zone, and a page that still
works after the network drops.

The app is a static site — Astro, built once and served from Cloudflare Workers static assets —
with a live, in-page search over a small JSON index and a schematic map with opt-in
geolocation. There is no server, no database at request time, and no tracking cookie.

**The app is in French. The code is in English.** UI copy, content and user-facing strings are
French; identifiers, comments, filenames, test descriptions, commits and this file are English.

## Binding documents

Read these before changing behaviour — they are the source of truth. This file is for setup and
commands, not their reasoning, with one deliberate exception: the three silent failures below,
kept here too because they have each cost real time rediscovering more than once.

- `docs/superpowers/specs/2026-08-29-annuaire-cartoucherie-design.md` — the product spec: scope,
  constraints, data model, definition of done.
- `docs/superpowers/plans/2026-09-14-annuaire-statique.md` — the implementation plan, task by
  task, including the reasoning behind decisions that look arbitrary in the diff alone.
- `docs/STANDARDS.md` — engineering standards: architecture layering, what `src/lib` may and may
  not do, testing philosophy.
- `CLAUDE.md` — the same standards, phrased as instructions for an agent working in this repo.
  Read it even if you are not one; it is the shortest accurate description of the rules.
- `docs/mockups/final/` — the approved visual design. `styleguide.html` is the component
  authority: if a page and the styleguide disagree, the styleguide is right.

## Running it locally

```bash
npm ci
npm run dev            # http://localhost:4321, on invented content
```

Other commands:

```bash
npm run build           # static build to dist/
npm run lint            # astro check + eslint + tsc --noEmit + no-barrel-file + jscpd
npm run guard           # forbids <script is:inline> (but the analytics beacon), set:html,
                         # third-party subresources, disabled pinch-zoom
npm test                # Vitest unit tests
npm run test:e2e        # Playwright, one device by default (Galaxy S9+, 360px)
MATRIX=1 npm run test:e2e   # adds iPhone SE/14, Pixel 7, desktop for layout-sensitive specs
npm run budgets          # byte budgets over dist/ — JS, CSS, fonts, search index, HTML, images
npm run lighthouse       # lighthouse CI against dist/, five pages, thresholds in lighthouserc.json
```

On NixOS, Playwright's own downloaded Chromium does not link (no FHS `/usr/lib`). Point it at the
system browser instead: `PLAYWRIGHT_CHROMIUM_PATH=$(command -v google-chrome-stable) npm run test:e2e`.
CI does not need this — it installs the real thing via `playwright install --with-deps`.

## Content: why there is no real neighbour in this repository

**This repository never contains real member data — no real name, address, phone number, email
or portrait, ever.** It is public, and git has no erasure: every commit is permanent in every
clone and fork, and a phone number cannot be rotated like an API key. This is not a consent
question — members gave their details to the community for visibility, and that's settled — it
is about what happens to two hundred people's contact details the day this repository is forked.

`tests/fixtures/members.json` and `tests/fixtures/portraits/` hold twelve fictional residents.
They are what `npm run dev`, `npm test`, `npm run test:e2e` and CI's `verify`/`browser`/
`lighthouse` jobs all run against, unconditionally. They stay fictional; a fixture is not a
place to test with someone's real data "just this once."

Real content lives in a **separate, private** repository (`cartoucherie-donnees`), read-only
to CI via a scoped token, and is injected at build time by `scripts/sync-content.mjs`:

```bash
CONTENT_DIR=path/to/cartoucherie-donnees npm run build
```

`CONTENT_DIR` defaults to `tests/fixtures`. It copies `members.json` and `portraits/` from
whatever it points to into `src/content/members.json` and `public/portraits/` — both
gitignored — checking every slug for shape and uniqueness and every named portrait file for
existence before touching the filesystem. The Zod schema in `src/content/schemas.ts` then
validates every remaining field when Astro builds the content layer. Either stage fails the
build with the field and the member named, not silently.

**A member's slug is permanent once published**: it is the URL in their QR code, and a QR code
already printed on a flyer or a shop counter cannot be updated. Renaming a slug after launch
means reprinting, not editing a file.

To add or edit a neighbour: edit `members.json` in `cartoucherie-donnees`, never in this
repository. `scripts/verify-history.mjs` checks, on demand (`npm run verify:history`), that no
member data has ever reached this repository's history outside the fixture — run it before
every push to `main`, not only when something feels wrong.

## Deployment

Static assets on Cloudflare Workers, on a custom domain, deployed only through the CI `deploy`
job (`.github/workflows/ci.yml`) — gated on `verify`, `browser` and `lighthouse` all passing
first. There must be no second, ungated deploy path: Cloudflare Workers Builds deploys on every
push regardless of CI status and must never be enabled on this project, or two deploy paths race
and the ungated one wins.

A feature branch deploys nothing — its pull request runs the gate. A merge to `develop` deploys
staging; a merge to `main` deploys production, after a required approval. One `deploy` job does
both: each GitHub Environment holds the same secret and variable names (`SITE_URL` among them,
which every QR code encodes).

`docs/go-live.md` is the ordered runbook for the first deploy — accounts, secrets, the domain
cutover, post-deploy checks, and the manual checks nothing automated can replace.

## Three silent failures already hit once

Each cost real time rediscovering it. None of the three produces an error message —
`docs/mockups/final/README.md` has the full list from the design phase; these three carried
into the build:

- **`@theme static`, never plain `@theme`.** Tailwind 4 tree-shakes theme variables it can't see
  a static reference to, so any CSS reading `var(--color-teal-950)` silently loses its colour.
- **`@plugin "daisyui/theme"` does nothing in the browser build.** The theme is declared as CSS
  variables on `[data-theme="cartoucherie"]` instead.
- **`document.fonts.check()` returns `false` for a font no element on the page uses** — the font
  is simply never fetched, which looks identical to a font that failed to load. Verify by
  comparing rendered text width against the fallback stack, not by trusting the API.

## Licence

Copyright © 2026 Adrien Lemaire. The code is licensed under the
[GNU Affero General Public License v3.0](LICENSE): anyone may reuse it, and anyone who runs
a modified copy as a website must publish their changes.

Member data is not part of this repository and not covered by this licence.
