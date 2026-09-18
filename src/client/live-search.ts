// src/client/live-search.ts
// Fetched by this module on the first keystroke, never on load: someone who
// never searches pays no request from this code path. (public/sw.js
// separately precaches /recherche.json in the background once installed, for
// the offline scenario — a build-time-known static request, not a report of
// what anyone typed.) The query itself never becomes a URL, a request or
// anything stored: search() (src/lib/search.ts) runs entirely here, in the
// browser, against /recherche.json — fetched once per page load by this
// module and cached across every keystroke, including ones typed before it
// resolves.
//
// The GET form (SearchBar.astro) carries no `name` on its input, so even a
// no-JS submit sends nothing to the host — this only stops the page from
// navigating once the script is ready to render results in place instead.
//
// No COPY import (final-fixes-report.md, I4): SearchResults.astro composed
// every French string this script needs into the markup already — the empty
// state (including its mailto:, mailtoHref's own output) as a <template>,
// the load-error text as a hidden <p>, the "why it matched" prefix as a data
// attribute. This module only ever toggles `hidden`, clones the template or
// copies already-French text between elements, category-filter.ts's own
// precedent for what a client script may do.
import { search, type IndexEntry } from "../lib/search";

const input = document.querySelector<HTMLInputElement>("[data-search-input]");
const results = document.querySelector<HTMLElement>("[data-results]");
const resultList = results?.querySelector<HTMLUListElement>("[data-result-list]") ?? null;
const emptyTemplate = results?.querySelector<HTMLTemplateElement>("[data-empty-template]") ?? null;
const loadError = results?.querySelector<HTMLElement>("[data-load-error]") ?? null;
const reasonPrefix = results?.dataset.reasonPrefix ?? "";
const browseSections = [...document.querySelectorAll<HTMLElement>("[data-browse]")];

document.querySelector("[data-search-form]")?.addEventListener("submit", (event) => {
  event.preventDefault();
});

if (input && results && resultList) {
  // A promise, not the resolved array, so a second keystroke while the first
  // fetch is still in flight reuses it instead of firing a second request.
  // Reset on failure so a visitor who searched while offline can retry once
  // the connection comes back, rather than being stuck on a cached rejection.
  let indexPromise: Promise<IndexEntry[]> | null = null;

  function loadIndex(): Promise<IndexEntry[]> {
    indexPromise ??= fetch("/recherche.json")
      .then((response) => response.json() as Promise<IndexEntry[]>)
      .catch((error: unknown) => {
        indexPromise = null;
        throw error;
      });
    return indexPromise;
  }

  const showEmptyState = (show: boolean): void => {
    results.querySelector("[data-empty-state]")?.remove();
    if (show && emptyTemplate) results.append(emptyTemplate.content.cloneNode(true));
  };

  const render = (query: string, index: IndexEntry[]): void => {
    const found = search(index, query);
    const trimmed = query.trim().length > 0;
    for (const section of browseSections) section.hidden = trimmed;
    results.hidden = !trimmed;
    if (loadError) loadError.hidden = true;
    resultList.replaceChildren();
    showEmptyState(trimmed && found.length === 0);
    if (!trimmed || found.length === 0) return;

    for (const { entry, reason } of found) {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = `/membre/${entry.slug}`;
      link.dataset.result = "";
      link.className = "carte block rounded-box bg-white p-3 shadow-carte";
      const name = document.createElement("span");
      name.className = "ff block text-nom text-teal-900";
      name.textContent = entry.nom;
      const why = document.createElement("span");
      why.className = "block text-[16px] text-neutre-600";
      why.textContent = `${entry.metier} · ${reasonPrefix} ${reason}`;
      link.append(name, why);
      li.append(link);
      resultList.append(li);
    }
  };

  // A first visit on a weak connection — this project's founding scenario — has no
  // service-worker cache to fall back on, so a failed or slow fetch must say something
  // rather than leave the box looking broken while someone types into it. Only shown
  // while there is still a query to search for: a rejection that arrives after the
  // visitor has already cleared the field would otherwise leave a stale error behind.
  const renderError = (query: string): void => {
    resultList.replaceChildren();
    showEmptyState(false);
    if (query.trim().length === 0) {
      for (const section of browseSections) section.hidden = false;
      results.hidden = true;
      if (loadError) loadError.hidden = true;
      return;
    }
    for (const section of browseSections) section.hidden = true;
    results.hidden = false;
    if (loadError) loadError.hidden = false;
  };

  input.addEventListener("input", () => {
    // loadIndex() resets its cached promise on rejection (above), so this is already
    // reachable again on the very next keystroke — no extra retry button needed.
    void loadIndex()
      .then((index) => render(input.value, index))
      .catch(() => renderError(input.value));
  });
}
