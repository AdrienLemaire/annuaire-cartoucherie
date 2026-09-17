// src/client/analytics.ts
// Cloudflare Web Analytics — cookieless, so no consent banner (spec §4). This
// is the one third-party origin in the project (docs/STANDARDS.md §3): it has
// no local form and publishes no stable hash, so it cannot be self-hosted or
// subresource-integrity-pinned like everything else.
//
// It is loaded from a plain module, not Astro's inline-script directive in
// BaseLayout, because `scripts/forbidden.mjs` allow-lists the beacon by host
// *per line*, and prettier-plugin-astro 1.0.0's `prettier-ignore` does not
// stop it re-wrapping a long inline script tag's attributes onto lines the
// allow-list cannot see (verified: the brief's own snippet, run through
// `npx prettier --write`, reflows across five lines). A module survives
// Prettier untouched because a string literal is never broken mid-line, and
// this file needs no exemption from that directive rule in the first place.
//
// Emits nothing without a token, on purpose: an empty token would still load
// the script and still call out to Cloudflare, but the hit is silently
// rejected — the exact "loads, runs, counts nothing" failure this project
// keeps finding. CI's verify/browser/lighthouse jobs never set
// PUBLIC_CF_BEACON_TOKEN (.github/workflows/ci.yml) and must keep building;
// only the deploy job's build (Task 14) carries the real token, so its
// absence there is the loud failure instead — Task 16's production smoke
// test waits on the beacon's own network response and fails if it never
// arrives.
// import.meta.env.PUBLIC_CF_BEACON_TOKEN has no ambient type (Vite's
// ImportMetaEnv falls back to `any` for unlisted keys) — annotated here so
// nothing downstream inherits that `any`.
const token: string | undefined = import.meta.env.PUBLIC_CF_BEACON_TOKEN;

if (import.meta.env.PROD && token) {
  const beacon = document.createElement("script");
  beacon.defer = true;
  beacon.src = "https://static.cloudflareinsights.com/beacon.min.js"; // BEACON — scripts/forbidden.mjs
  beacon.dataset.cfBeacon = JSON.stringify({ token });
  document.head.appendChild(beacon);
}
