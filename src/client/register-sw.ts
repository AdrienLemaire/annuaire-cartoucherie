// src/client/register-sw.ts
// PROD-gated like the beacon below it in BaseLayout: astro dev serves
// unbundled modules from paths a production service worker has no business
// caching, and a worker registered during dev would keep intercepting
// requests on the same port for `astro preview` afterwards.
//
// BaseLayout.astro loads this module through a dynamic import() (forced, to
// stop Astro inlining it — see that file's own comment), which does not
// block the page's `load` event the way a plain <script> does. By the time
// this file's own network round-trip finishes, `load` may already have
// fired — an addEventListener("load", …) added after the fact never runs
// (verified: it did not, before this check was added). document.readyState
// reaching "complete" is the same signal the `load` event carries, so
// checking it first covers both orderings.
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  if (document.readyState === "complete") {
    void navigator.serviceWorker.register("/sw.js");
  } else {
    window.addEventListener("load", () => {
      void navigator.serviceWorker.register("/sw.js");
    });
  }
}
