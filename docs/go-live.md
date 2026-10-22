# Going live

This is the runbook for taking Annuaire de la Cartoucherie from "builds locally" to "serving
real neighbours on a real domain." Follow it in order. It assumes nothing you haven't been told
here — not the plan, not any prior conversation about this project.

For how to run the site locally, what `CONTENT_DIR` does, and why real member data is never
committed to this repository, see `README.md`. This document does not repeat any of that; it
only covers what happens once you're ready to put the site in front of real visitors.

## Blockers — resolve these before you start

Four things are undecided or missing. None of them are code problems, and none of them can be
guessed or invented on your behalf. Work through this list first; the numbered sequence below
assumes all four are settled.

1. **The domain is not registered.** Nothing is live anywhere. Every QR code the build emits
   encodes `SITE_URL`, set per GitHub Environment (step 7); a local build falls back to
   `http://localhost:4321`. **Once you print a QR code with a domain on
   it, that domain is permanent for that piece of paper** — decide and register before printing
   anything, not after.
2. **No Cloudflare account is configured for this project.** `CLOUDFLARE_API_TOKEN` and
   `CLOUDFLARE_ACCOUNT_ID` don't exist as GitHub secrets because there's no account to generate
   them from yet.
3. **The licence and repository visibility are undecided.** No `LICENSE` file exists, which
   defaults to all-rights-reserved — the opposite of what a public repository should say, and
   the private-content mechanism (step 3 below) assumes this repository is public. Choose
   between **AGPL-3.0** (a genuine open-source licence; keeps this project eligible for
   Cloudflare's non-profit credit programmes) and **PolyForm Noncommercial 1.0.0**
   (source-available only, not open source by the OSD's own definition; forfeits those
   credits). This is a real decision with a real tradeoff, not a formality.
4. **Three legal-notice markers are unfilled.** `docs/mentions-legales-a-completer.md` is the
   single list — Cloudflare's exact contracting entity and its address, and the name of the
   illustrator redrawing the mascot. **Do not duplicate that list here**; open the file itself, it explains
   what each line needs and where to get it. Going live with the markers still visible on the
   page (they render as `⟨à compléter : …⟩`) is an acceptable soft launch. Inventing any of them —
   guessing an address or an entity name — is not, ever.

## The sequence

Each step says what to do and, where a step can go wrong in a way that isn't self-explanatory,
what to do about it.

### Set up the accounts and repositories

1. **Register the domain you chose in Blocker 1.** Nothing else in this sequence touches code
   until this is done.

2. **Create the GitHub repository** for this codebase (public, once the licence in Blocker 3 is
   chosen — private is fine as a holding state before that). Push this code to it as `main`, and create `develop` from it.

3. **Create the private content repository**, `cartoucherie-donnees`, on GitHub. Private.
   Containing exactly:
   - `members.json` — same shape as `tests/fixtures/members.json` in this repository, but real
     people.
   - `portraits/` — one image per member, filenames matching each member's `photo` field.
   - `README.md` — how to add a neighbour, and that **a slug is permanent once published**
     (it's the URL inside that member's QR code — renaming it later means reprinting, not
     editing a file).

   Create it under the same owner as this repository: the CI deploy job checks out
   `<owner of this repo>/cartoucherie-donnees` (`.github/workflows/ci.yml`, the `deploy` job's
   second checkout step).

   *If it fails later*: a malformed row in `members.json` doesn't corrupt the site — the build
   fails with the exact field and member named (`src/content/schemas.ts` validates every field;
   `scripts/sync-content.mjs` validates slugs and portrait files before that). Fix the row, push
   again.

4. **If the owner is a GitHub organisation**, check its
   settings allow fine-grained personal access tokens before relying on one in the next step —
   some organisations block them by default. If blocked, either get an owner to allow them or
   use a classic PAT scoped as narrowly as GitHub allows.

5. **Create a fine-grained GitHub personal access token** scoped to `cartoucherie-donnees`
   alone, with **`Contents: read`** and nothing else. Write down its expiry date somewhere you
   will actually see again. A fine-grained token always expires; when it does, the `deploy`
   job's checkout step fails closed (the job stops, nothing wrong gets deployed) rather than
   falling back to anything. Renewing this token before it lapses is a recurring task, not a
   one-time setup step — put it on a calendar.

6. **Create two GitHub Environments** (repository Settings → Environments), `staging` and
   `production`. The flow, in `.github/workflows/ci.yml`:
   - a feature branch deploys nothing — its pull request runs the full test gate;
   - a merge to `develop` deploys **staging** (`wrangler deploy --env staging`);
   - a merge to `main` deploys **production** (`wrangler deploy --env ""`).

   Give `production` a **required reviewer** (yourself): the deploy job then waits for your
   click before it builds or uploads anything.

7. **Store these in each environment, under the same names** (not repository-level —
   environment scoping keeps them unavailable to runs triggered from forks or pull requests):
   - Secrets: `CONTENT_REPO_TOKEN` (step 5), `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`
     (step 8).
   - Variables: `SITE_URL` — the full `https://` URL this environment serves, which every QR code
     and canonical URL encodes; and `PUBLIC_CF_BEACON_TOKEN`, from that environment's own Web
     Analytics site (step 14).

   *If it fails*: a missing or wrong secret doesn't produce a silently broken deploy — the
   `deploy` job fails at the step that needed it, by name. A missing `SITE_URL` stops the job
   before anything is built. The dangerous failure mode is a *forgotten*
   `PUBLIC_CF_BEACON_TOKEN`: the beacon still loads with an empty token, nothing looks wrong, and
   nothing is ever counted. That's why step 14 exists — don't skip it.

8. **Create and configure the Cloudflare account.** Enable Workers. Generate the API token and
   account ID for step 7. **Confirm Cloudflare Workers Builds is off, and leave it off.**
   Workers Builds deploys on every push regardless of test results; this project's only sanctioned
   deploy path is the gated CI job (`needs: [verify, browser, lighthouse]` in the `deploy` job).
   If both are ever enabled at once, they race, and there is no guarantee the gated one wins.

9. **Protect `develop` and `main`** (Settings → Branches, or Rules → Rulesets): changes only
   through a pull request, with the `verify`, `browser`, `lighthouse` and `commits` checks
   required. Without it a direct push skips the review the flow depends on — the deploy job
   still waits for green tests, but nothing waits for a second look.

### Wire the domain into the code

10. **Once the domain from step 1 is registered**, add one custom-domain route per environment
    in `wrangler.toml` — its own comment shows both lines — each matching that environment's
    `SITE_URL`. Leave `html_handling = "drop-trailing-slash"` and `not_found_handling =
    "404-page"` exactly as they are — both are load-bearing (see "Post-deploy checks" below).

    Then confirm a build encodes the URL you give it:
    ```bash
    SITE_URL=https://<the real domain> npm run build && grep -o 'https://[^"<]*' dist/qr/*.svg | head -3
    ```
    *If it fails*: if the printed URL doesn't match what you registered, don't print anything —
    fix the config and rebuild. A QR code is paper; it can't be patched after printing.

11. **Rehearse the real content build locally, once**, before trusting CI to do it correctly the
    first time:
    ```bash
    git clone git@github.com:<owner>/cartoucherie-donnees.git content-private
    CONTENT_DIR=content-private SITE_URL=https://<the real domain> npm run build
    npm run budgets
    git status --porcelain
    ```
    Expect: the build log reports the real member count; `npm run budgets` stays green (there is
    no known reason it should fail at any member count — the one budget that used to scale with
    member count, `/carte`'s CSS, was fixed to be size-independent before this runbook was
    written); and `git status --porcelain` is **empty**, proving `src/content/members.json`,
    `public/portraits/`, and `content-private/` are all correctly gitignored and nothing real
    leaked into the working tree.

    *If it fails*: `npm run budgets` failing here means something changed since this was
    written — stop and work out which budget line and why before deploying; don't raise the
    number just to get a green check. A non-empty `git status` means something is tracked that
    shouldn't be — stop before committing anything.

12. **Run the history check yourself, once, before the first real push** — even though CI's
    `verify` job now runs it on every push too (`scripts/verify-history.mjs`), don't wait for
    that to be the first time it runs against your changes:
    ```bash
    npm run verify:history
    ```
    Expect a line like `verify-history: N historical match(es), all explained` and exit 0.

    *If it fails*: it prints the exact path it doesn't recognise and stops. **The fix is never
    to add the path to the script's allow-list** — that defeats the check. If real member data
    has reached this repository's git history, stop and treat it as a real incident: history
    can't be edited after the fact in any way that un-publishes a fork that already cloned it,
    so the only fix is a history rewrite plus rotating every phone number and email address that
    leaked. This is the one failure mode in this whole runbook that isn't a quick fix.

### First deploys — through CI, staging first

13. **Merge into `develop`.** The `deploy` job creates the staging Worker and uploads to it.
    Nothing is ever deployed by hand: a hand-run `wrangler deploy` bypasses the same test gate
    that disabling Workers Builds (step 8) protects — the same risk by a different door. If you
    ever must, use `npm run deploy`, which refuses to run without `CONTENT_DIR` and `SITE_URL`.

14. **In the Cloudflare dashboard**: attach each environment's custom domain to its Worker, then
    enable Web Analytics for each and copy each site token into that environment's
    `PUBLIC_CF_BEACON_TOKEN` variable. Staging sends `X-Robots-Tag: noindex` (added by the deploy
    job), so search engines never send a neighbour to the test copy.

15. **Run the post-deploy checks below against staging, then open a pull request from `develop`
    to `main`.** Merging it starts the production deploy, which waits for your approval.

### Post-deploy checks

Run these against the real, live domain. All of them are things that either can't be tested
without a live host, or that an automated test can't fully substitute for — each explains why.

16. **Check that `/annuaire` is served directly, not via a redirect:**
    ```bash
    curl -sI https://<the real domain>/annuaire | head -1
    ```
    Expect `HTTP/2 200`. Treat **307, 308, or 301** as a real failure, not a nitpick — this
    project's offline cache (`public/sw.js`) precaches the exact string `/annuaire`, and a
    browser cannot use a cached *redirect* response to answer a page-load request. If this
    redirects, the site quietly stops working offline for anyone who visited before the network
    dropped, with no error anywhere. `wrangler.toml`'s `html_handling = "drop-trailing-slash"`
    is what's supposed to prevent this — this check is what proves it actually did, on the real
    host, not just in local testing.

17. **Check that a dead link lands on the branded 404 page, not Cloudflare's default:**
    ```bash
    curl -sI https://<the real domain>/ce-slug-n-existe-pas | head -1
    ```
    Expect `HTTP/2 404`. Then open that URL in an actual browser and confirm you see this
    project's own page — Colly, a search box, a link back to the directory — not an unbranded
    Cloudflare error page. This matters here specifically because **this product's distribution
    is printed paper**: a flyer in a shop window, a sticker on a counter. A renamed slug, a
    neighbour who has left, or a mistyped shared link all land a real visitor here, and that
    visitor has already done everything right — they scanned the code they were given.
    `wrangler.toml`'s `not_found_handling = "404-page"` is what makes this work; without it,
    Cloudflare serves an empty body on a bare 404 regardless of `src/pages/404.astro` existing.

18. **The smoke test** (`tests/e2e/deployed.spec.ts`) runs at the end of every deploy job,
    against the host it just uploaded to. To run it by hand:
    ```bash
    URL_DEPLOYED=https://<the real domain> npx playwright test tests/e2e/deployed.spec.ts
    ```
    Expect both tests to pass: the site answers over HTTPS with a working search index and no
    contact details leaking into it, and the page sets zero cookies while sending the
    Content-Security-Policy, Strict-Transport-Security and X-Content-Type-Options headers it
    promises. This file deliberately never names a real member — production has real people on
    it and this test file is public.

### Human checks — cannot be automated, not optional

19. **On an actual phone**: scan a printed QR code, follow the journey to a profile, press
    « Appeler ». The dialler must open with the right number. This is the product's core promise
    end to end — nothing above tests a real phone's dialler.

20. **Take one screenshot on a real iPhone 14 and look at it.** Specifically: confirm nothing
    renders underneath the home indicator (the bar at the bottom of the screen). **This is not
    a formality you can skip because the automated suite is green.** Nothing in this project's
    test suite exercises iOS Safari's actual rendering engine — Playwright's own WebKit build
    does not link on the machine this project is developed on, so `playwright.config.ts`'s
    `iPhone SE` and `iPhone 14` projects are pinned to Chromium instead. That buys viewport-size
    coverage (the layout fits in 320px/390px) and nothing else — it never exercises anything
    genuinely Safari-specific, such as how it handles `env(safe-area-inset-bottom)`, which the
    sticky « Appeler » bar depends on to sit above the home indicator rather than under it.
    **This one manual screenshot is the entire iOS Safari safety net for this project.** There
    is no automated fallback if you skip it.

21. **Compare the live site against each of the four approved mockups**
    (`docs/mockups/final/`) side by side, on a real screen, by a person. Four mockups, four
    comparisons.

### Go live for real

22. **Merge `develop` into `main` and approve the production deploy.** This is the first time production is deployed — watch
    it closely in the Actions tab. A wrong token, a `cartoucherie-donnees` row that fails
    validation, or anything else wrong should surface as a **named, specific failure** in that
    job's log. If the `deploy` job fails, the previous successful deployment stays live —
    Cloudflare Workers does not take the site down while a new deploy fails partway; nothing
    users see changes until a deploy actually succeeds.

## If something looks wrong after go-live

- **The site is up but a check above would now fail** (a redirect reappears on `/annuaire`, the
  404 page stops rendering): re-run the specific `curl` command from that step against the live
  domain. Both behaviours are controlled entirely by `wrangler.toml`'s `[assets]` block — if
  someone edited it since this runbook was followed, that's the first place to look.
- **A deploy is red in CI**: read the named failure in the `deploy` job's log before touching
  anything. This project is built to fail closed and name what broke, not to fail silently —
  trust the message before guessing.
- **The `CONTENT_REPO_TOKEN` has expired**: the `deploy` job's second checkout step fails with an
  authentication error. Generate a new fine-grained token (step 5 above, same scope) and update
  the secret. Nothing else changes.
