// public/sw.js
// Keeps the directory usable on a weak connection in a shop (the founding
// scenario — docs/superpowers/specs/2026-08-29-annuaire-cartoucherie-design.md
// §1 and CLAUDE.md's opening paragraph) — nothing more. `public/_headers`
// serves this file with `Cache-Control: no-cache`, so a browser always
// revalidates it and picks up a new version on the next visit; no
// skipWaiting/clients.claim is needed to force it in sooner, and forcing it
// in would risk an old tab running against a suddenly-different cache
// mid-session.
//
// Correctness over completeness: a stale copy of the directory would show a
// neighbour who has moved away, so nothing here is ever served stale while
// the network is reachable. Only /_astro/*, whose file names are content
// hashes (immutable per _headers), is safe to serve from cache first.
const CACHE = "cartoucherie-v1";

// The two pages that host the search box (spec §5's offline scenario) plus
// what they need to render and to search: the search index and the manifest.
// Hashed CSS/JS/fonts under /_astro/ are deliberately not precached here —
// cache.addAll is all-or-nothing, and their own hashed names make them safe
// to pick up on first request instead (the runtime cache-first branch below).
const SHELL = ["/", "/annuaire", "/recherche.json", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
      ),
  );
});

// Network-first: try the network, cache what it returns, and fall back to the
// cache only when the network fails outright (offline, or a shop's dead
// signal) — never because the network was merely slower than the cache.
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    // A transient 500 (or any non-2xx) must never become "what we serve
    // offline" — only a response the page would have accepted anyway.
    if (response.ok) {
      const cache = await caches.open(CACHE);
      void cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw error;
  }
}

// Cache-first: safe only because /_astro/ file names are content hashes
// (public/_headers pins them `immutable`) — the same URL never changes body.
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  // A 404 here must not become permanent: nothing ever evicts a cache-first
  // entry (its URL is assumed immutable), so only a real hit is worth that.
  if (response.ok) {
    const cache = await caches.open(CACHE);
    void cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (url.pathname.startsWith("/_astro/")) {
    event.respondWith(cacheFirst(request));
  } else if (request.mode === "navigate" || url.pathname === "/recherche.json") {
    event.respondWith(networkFirst(request));
  }
  // Everything else (portraits, the manifest icons, qr codes…) is left to the
  // browser's own network handling: not part of the offline scenario this
  // worker exists for, and not worth the staleness risk of caching it anyway.
});
