# Annuaire de la Cartoucherie — Design (v1)

Date: 2026-08-29
Status: v1 live since 2026-10-26, with a narrower scope than §2 and §12 describe. Progress
and the re-scoping are tracked in `docs/ROADMAP.md`.

## 1. Purpose

A web app helping residents of the Cartoucherie district (Toulouse, 31300) find the
entrepreneurs and local businesses that match their needs, and show support for the
ones that matter to them.

Distribution is physical: flyers with QR codes placed in local businesses. Someone
scanning in a shop must reach useful content in seconds, on a phone, possibly on a
weak connection.

Sandra Carole, the community manager, already collects member profiles and publishes
them as portraits on Instagram. Members gave that information to the community
specifically to gain visibility. This app gives the same content a permanent,
searchable home.

A previous attempt used Notion and failed. The lesson carried into this design: a hub
with no reason to be opened on a given day does not get opened. v1 therefore targets
one recurring need — *"I need someone who does X"* — rather than general community
engagement.

## 2. Scope

### In scope (v1)

- Member profiles: browse, search, filter by category, view on a map
- Profile detail pages with a stable, shareable URL
- Optional resident accounts (never required to browse)
- Favorites (local by default, synced when signed in)
- Written reviews and ratings
- Per-member QR code download
- French-language interface
- Cookieless analytics

### Explicitly out of scope (v1)

- Events calendar — deferred to v3
- Resident-to-resident messaging / WhatsApp replacement — unscheduled
- Payments to businesses — future, but the schema must not preclude it
- Push notifications
- Member self-editing of profiles — v2

Each deferred item gets its own spec, plan, and implementation cycle. The v1 data
model accommodates them; the v1 code does not contain them.

### Why not a mobile app

The QR code on a flyer resolves to a URL. A native app inserts an app-store install
between scanning and seeing content, which is where the funnel dies. The web app is
PWA-installable for anyone who wants a home-screen icon. Push notifications were the
only capability that could have justified native, and they are out of scope for v1.

## 3. Constraints

### Cost

This is volunteer work for a non-profit community. The governing rule is not "cheap"
but **fail closed, not open**: every provider must throttle or stop when a free tier
is exhausted, never invoice. Prior experience with metered platforms (Vercel and
Supabase at commercial scale) makes unbounded worst-case billing unacceptable.

Projected costs on the chosen stack:

| Scenario | Profiles | Visitors/mo | Page views/mo | Cloudflare cost |
|---|---|---|---|---|
| Launch (year 1) | 200 | 800 | 3.2k | $0 |
| Neighbourhood | 400 | 3,000 | 18k | $0 |
| Toulouse-wide | 2,000 | 50,000 | 250k | $0 |
| Regional + payments | 10,000 | 300,000 | 2M | ~$5–9/mo |

The only recurring costs at launch are a domain (~EUR 12/year) and, eventually,
transactional email above 300/day.

### Language

French-first. UI copy, categories, and seed content are written in French. This is not
an English app with a translation layer. Copy is centralised in one module for
maintainability, not to enable i18n.

### Member data

Members provided their information to the community of their own free will, to gain
visibility. Seeding it into this directory carries no consent problem. Profiles are
published, including reviews, without a consent gate. A visible "remove this listing"
contact route exists as ordinary hygiene.

**The code repository is public and never contains real member data.** Fictional fixtures are
committed; real names, addresses, phone numbers, emails and portraits are injected at build
from a private source. This is not a consent rule — that question is settled above. It is
about erasure and bulk exposure: git has no delete, a phone number cannot be rotated like a
token, and a committed data file is precisely the whole-quartier contact list that §5's
search index already refuses to ship.

**The app is written in French; the source code is written in English.** UI copy, content and
user-facing strings are French. Identifiers, comments, filenames, test descriptions, commit
messages and documentation are English. Engineering standards: `docs/STANDARDS.md`.

## 4. Stack

| Concern | Choice | Rationale |
|---|---|---|
| Framework | Astro | Content-heavy site with a few interactive corners; static by default, islands where needed; native Cloudflare deployment |
| Hosting | Cloudflare Workers | Static asset requests are free and unlimited; no egress billing on any plan; $5/mo flat ceiling if ever exceeded |
| Database | Cloudflare D1 (SQLite) | 5 GB / 5M row reads per day free; same vendor, same failure semantics |
| ORM | Drizzle | Typed schema and migrations against D1 |
| File storage | ~~Cloudflare R2~~ D1, from v2 | R2 asks for a card and bills past its free tier; see the v2 spec §6 |
| Auth | ~~Better Auth~~ hand-written magic link, from v2 | Better Auth cost 5–15 ms of CPU per request against Workers Free's 10 ms; see the v2 spec §13 |
| Email | Brevo | 300/day free, French company with EU data processing, stops rather than bills |
| Maps | MapLibre + OpenStreetMap | No API key, no cost, no Google |
| Analytics | Cloudflare Web Analytics | Free, cookieless, therefore no consent banner |
| Bot protection | Cloudflare Turnstile | Free |
| Package manager | npm | Only one available on the development machine |

Rejected: Vercel (Hobby forbids non-personal use; Pro meters bandwidth with no hard
cap), Netlify (free plan suspends the whole site for the remainder of a month on
overage; the OSS plan requires a badge), Supabase (free tier pauses after 7 days
idle), Firebase (Cloud Storage requires the Blaze plan, which fails open).

## 5. Architecture

### Rendering

**Profiles live in D1; profile pages are prerendered to static HTML at build time.** A
build reads the members and emits the pages plus a search index. Data changes
trigger a rebuild via a Cloudflare deploy hook.

**In v1 the build reads the seed file directly, not D1.** Member self-editing is a v2
feature (§2) and the seed script is the v1 editing interface (§10), so in v1 the repo file
is the only thing that changes member content; the build has no reason to reach for the
database. D1 becomes the build's source from v2, when self-editing makes the file
non-primary — and that is when the §14 mechanism (the D1 HTTP API with a scoped token) is
needed, because Cloudflare's build CI exposes no D1 binding.

```
seed script ─┐
             ├─▶  D1  ──build──▶  static pages + /recherche.json  ──▶  free unlimited assets
member edit ─┘     │
                   └──runtime──▶  Worker  ──▶  reviews · favorites · auth
```

Three things stay dynamic because they change per-user or per-minute: **reviews**
(fetched client-side by an island), **favorites**, and **auth**.

Rationale: resilience and speed, not cost. Dynamic rendering would also stay free to
roughly 3M page views/month. Static pages load with no database round-trip on a weak
mobile connection and keep serving if D1 is unavailable. Profile content changes
roughly twice a year per member, so build latency costs almost nothing.

The decision is reversible per-route: `export const prerender = false` switches a page
to dynamic without touching schema or queries.

### Architectural constraint

**Personalisation happens client-side over a static shell.** Server-rendering
per-user pages would move all browsing traffic from the free-unlimited static bucket
into the metered Worker bucket. This is a constraint, not a preference.

### Search index

The build emits one JSON file containing every member — approximately 60 KB gzipped
at 200 profiles. Small enough to ship whole, so search, category filtering, and the
map all run client-side with zero latency and zero requests, and keep working offline
once the service worker has cached it.

All four discovery surfaces read from this single file. Adding, reordering, or
changing the default landing surface is UI work, never a data change.

### Images

Originals are stored in R2. Astro's build pipeline generates responsive AVIF/WebP
variants as static assets. R2 is read at build time and essentially never in
production.

Each profile also gets an Open Graph image generated at build, so links unfurl as
cards when shared into WhatsApp groups or Instagram.

### Build budget

3,000 build minutes/month free, one concurrent build. At roughly 1.5 minutes per
build that is about 2,000 builds per month — far beyond what member editing will
trigger. In v2, rapid successive edits are coalesced by debouncing the deploy hook.

## 6. Data model

- **`members`** — `slug` (stable; the shareable and QR URL), name, tagline, bio,
  photo key, services, contact fields (email, phone, website, Instagram — each
  optional), address, lat, lng, `show_on_map`, `status` (`seeded` | `claimed` |
  `hidden`), `owner_user_id` (nullable), timestamps
- **`categories`**, **`member_categories`** — many-to-many; members genuinely span
  categories
- **`reviews`** — member, author, rating, body, `status`, timestamp; one review per
  user per member
- **`review_reports`** — feeds the moderation queue
- **`favorites`** — user × member
- **Better Auth tables** — user, session, account, verification, passkey

`status` and `owner_user_id` are the only v2 affordances present in the v1 schema.
`status` is an ownership concept for the claim flow, not a consent gate.

## 7. Authentication

Optional, never blocking. Required only to leave a review or sync favorites across
devices.

- **Email magic link** via Brevo — no passwords, no third-party identity provider
- **Passkeys** offered as an upgrade after first sign-in; returning users then
  authenticate with Face ID and send no email at all
- No social sign-in in v1: it would add a US data processor for convenience magic
  links already provide

Sending requires SPF and DKIM records on the domain. If email ever stops, the
directory stays fully browsable and passkey users still sign in; only new
review-writers are blocked.

## 8. Reviews and moderation

Reviews publish immediately. Anyone can report one. A role-gated `/admin` page lists
reports and allows hiding a review in one click. Turnstile guards submission against
bots. One review per user per member.

In a neighbourhood where everyone knows each other, social pressure does most of the
moderation work; the queue exists for the exceptions.

**Google reviews are a link out, never shown here** (decided 2026-10-26). Google's EEA
Places terms do not permit a third-party directory to display a business's rating or
reviews, copying them breaks the no-caching clause, and Google's own widget breaks the CSP
and the no-cookie rule. A member's optional `avisGoogle` (their Maps link, reviews tab)
renders « Voir ses avis sur Google » under « Avis du quartier », outside the reviews slot.

## 9. Pages

`/` landing · `/annuaire` full grid · `/categorie/[slug]` · `/carte` map ·
`/membre/[slug]` profile · `/a-propos` (including credits) · `/confidentialite` ·
`/mentions-legales` (legally required for a French site) · `/avis` explaining how
reviews are collected and moderated (expected under French consumer law) · `/admin`
(role-gated).

Which surface `/` leads with is a single constant, so tuning it from analytics is a
one-line change.

Every profile page carries a discreet "cette fiche n'est pas correcte" link routing to
the association's contact address, so a correction or removal request never requires
knowing who to ask.

Every profile page offers a client-side generated QR code download. Even with a single
generic printed flyer, Sandra can hand any member a QR to their own page for their
counter or business cards, with no reprint.

## 10. Seeding

A structured CSV/JSON source file maintained by Adrien and Sandra, applied by
`npm run seed`: validates every row, writes to D1, uploads portraits to R2. Idempotent
and keyed on slug, so re-running corrects typos rather than duplicating members.

This script is the v1 editing interface. No admin CRUD is built.

Content is transcribed from Sandra's original portrait sources. Instagram is not
scraped: it blocks scraping, it violates their terms, and Sandra holds better-structured
originals.

## 11. Testing

- **Vitest** — search ranking, slug generation, validation schemas
- **Playwright** — two end-to-end flows that must never break:
  1. scan → find a member → contact them
  2. sign in → leave a review

Accessibility is checked as part of the Lighthouse target: the directory has to work
for older residents, on small screens, with large text and screen readers.

## 12. Definition of done (v1)

The original target, kept for reference. v1 shipped with 6 profiles and without the
sign-in-then-review flow; `docs/ROADMAP.md` records what changed.

- 200 profiles live
- All four discovery surfaces working
- Lighthouse on mobile: accessibility, best practices and SEO at 1.0, performance ≥ 0.95
  (the three category scores that are sums of binary audits are gated at a perfect score;
  performance is a continuous measurement and is not — `lighthouserc.json`)
- Both Playwright flows green
- Deployed to a custom domain with analytics reporting

## 13. Roadmap

Moved to `docs/ROADMAP.md`, which tracks what each version delivers and where it stands.

## 14. Open items for implementation planning

- ~~Build-time access to D1~~ — **resolved 2026-09-14.** The v1 build reads the seed file,
  so no D1 binding is needed at build time at all. The D1 HTTP API with a scoped token
  becomes a v2 task, when member self-editing makes the file non-primary. See §5.
- ~~Category taxonomy~~ — **drafted 2026-09-14.** Ten categories, each in two registers:
  the formal name and a « Je cherche… » need phrasing. In
  `docs/mockups/_shared/members.json` and carried into `src/content/categories.json`, which
  Sandra edits without a developer. Still to be reviewed with her.
- Domain name not yet chosen or registered
- Cloudflare account and MCP server not yet configured
- **Decided 2026-10-23: AGPL-3.0, public repository.** The reasoning that led there:
- Licence and repository visibility undecided, and the two goals stated so far conflict.
  "Open source with non-commercial reuse only" is a contradiction: a field-of-use
  restriction fails the Open Source Definition §6, so the result is *source-available*, not
  open source. That matters concretely here — Cloudflare's non-profit credit programmes,
  cited in earlier drafts of this section as headroom, require a recognised OSS licence, so
  a non-commercial licence forfeits them. The decision is between **AGPL-3.0** (genuinely
  open source, removes the proprietary-fork incentive, keeps the credits — but permits
  commercial use) and **PolyForm Noncommercial 1.0.0** (source-available, if "nobody
  profits" is the literal requirement). Not a legal opinion; confirm before relying on it
- Vercel CLI is not installed and is not needed under this stack
