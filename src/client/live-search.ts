// src/client/live-search.ts
// Fetched on the first keystroke, never on load: someone who never searches
// must not pay a request for the feature. The query itself never becomes a
// URL, a request or anything stored: search() (src/lib/search.ts) runs
// entirely here, in the browser, against /recherche.json — fetched once and
// cached across every keystroke, including ones typed before it resolves.
//
// The GET form (SearchBar.astro) carries no `name` on its input, so even a
// no-JS submit sends nothing to the host — this only stops the page from
// navigating once the script is ready to render results in place instead.
import { search, type IndexEntry } from "../lib/search";
import { COPY } from "../lib/copy";

const input = document.querySelector<HTMLInputElement>("[data-search-input]");
const results = document.querySelector<HTMLElement>("[data-results]");
const browseSections = [...document.querySelectorAll<HTMLElement>("[data-browse]")];

document.querySelector("[data-search-form]")?.addEventListener("submit", (event) => {
  event.preventDefault();
});

if (input && results) {
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

  const render = (query: string, index: IndexEntry[]): void => {
    const found = search(index, query);
    for (const section of browseSections) section.hidden = query.trim().length > 0;
    results.hidden = query.trim().length === 0;
    results.innerHTML = "";

    if (query.trim().length > 0 && found.length === 0) {
      const empty = document.createElement("p");
      empty.textContent = COPY.searchEmpty;
      const suggest = document.createElement("a");
      suggest.href = `mailto:${COPY.contactEmail}`;
      suggest.textContent = COPY.searchSuggest;
      results.append(empty, suggest);
      return;
    }

    for (const { entry, reason } of found) {
      const link = document.createElement("a");
      link.href = `/membre/${entry.slug}`;
      link.dataset.result = "";
      link.className = "carte block rounded-box bg-white p-3 shadow-carte";
      const name = document.createElement("span");
      name.className = "ff block text-nom text-teal-900";
      name.textContent = entry.nom;
      const why = document.createElement("span");
      why.className = "block text-[16px] text-neutre-600";
      why.textContent = `${entry.metier} · ${COPY.searchReason(reason)}`;
      link.append(name, why);
      results.append(link);
    }
  };

  input.addEventListener("input", () => {
    void loadIndex().then((index) => render(input.value, index));
  });
}
