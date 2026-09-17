// src/client/category-filter.ts
// Upgrades /annuaire's chip rail: every populated category's chip, plus
// "Tous les métiers" (data-filter=""), is a real `<a href="…">`, so the page
// already works with JavaScript disabled. A zero-count category is a
// non-interactive span instead (annuaire.astro's own comment explains why),
// so it is never part of the filterable set here either. This file only
// intercepts a chip's click to filter in place instead of navigating, and
// keeps the URL, the live count, the active chip and the "nobody here"
// explanations in sync — so a direct visit to /annuaire?cat=…, an
// unrecognised ?cat= value, and the Back button all land on the right,
// visible state. Every string it shows was composed server-side
// (memberCountParts, COPY, mailtoHref all ran in annuaire.astro's
// frontmatter, into data-count/data-noun/data-detail and the hidden
// [data-empty-for]/[data-no-match] blocks): this file only moves `hidden`
// and `aria-current` around and copies already-French text between elements,
// it never composes a sentence.
const rows = [...document.querySelectorAll<HTMLElement>("[data-member]")];
const chips = [...document.querySelectorAll<HTMLAnchorElement>("[data-filter]")];
const emptyStates = new Map(
  [...document.querySelectorAll<HTMLElement>("[data-empty-for]")].map((el) => [el.dataset.emptyFor ?? "", el]),
);
const noMatch = document.querySelector<HTMLElement>("[data-no-match]");
const list = rows[0]?.closest("ul") ?? null;
const countNumber = document.querySelector<HTMLElement>("[data-count-number]");
const countWord = document.querySelector<HTMLElement>("[data-count-word]");
const countDetail = document.querySelector<HTMLElement>("[data-count-detail]");

// "" (the "Tous les métiers" chip's own data-filter, and an empty `?cat=`)
// means no filter — one normalisation, used everywhere a slug is read, so a
// chip's click and a URL's query string never disagree about what "unfiltered" means.
function normalizeSlug(slug: string | null | undefined): string | null {
  return slug || null;
}

const chipSlug = (chip: HTMLAnchorElement): string | null => normalizeSlug(chip.dataset.filter);

function filterRows(slug: string | null): number {
  let visible = 0;
  for (const row of rows) {
    const categories = (row.dataset.cat ?? "").split(" ");
    const show = slug === null || categories.includes(slug);
    row.hidden = !show;
    if (show) visible++;
  }
  return visible;
}

function markActiveChip(slug: string | null): HTMLAnchorElement | undefined {
  let activeChip: HTMLAnchorElement | undefined;
  for (const chip of chips) {
    const isActive = chipSlug(chip) === slug;
    if (isActive) {
      chip.setAttribute("aria-current", "true");
      activeChip = chip;
    } else {
      chip.removeAttribute("aria-current");
    }
  }
  return activeChip;
}

/**
 * Which explanation, if any, the visitor needs: the category's own "nobody
 * here yet" block when the filter names a real, empty category; the generic
 * "nothing matches" panel when it names nothing this annuaire has ever
 * listed (a stale link, a mistyped ?cat=). Returns whichever one is now
 * showing, so its own data-count/-noun/-detail can drive the headline too.
 */
function resolveExplanation(slug: string | null, visible: number): HTMLElement | undefined {
  for (const empty of emptyStates.values()) empty.hidden = true;
  if (noMatch) noMatch.hidden = true;
  if (visible > 0 || slug === null) return undefined;

  const empty = emptyStates.get(slug);
  if (empty) {
    empty.hidden = false;
    return empty;
  }
  if (noMatch) noMatch.hidden = false;
  return noMatch ?? undefined;
}

function updateCount(source: HTMLElement | undefined): void {
  if (!source) return;
  if (countNumber) {
    countNumber.textContent = source.dataset.count ?? "";
    countNumber.hidden = !source.dataset.count;
  }
  if (countWord) countWord.textContent = source.dataset.noun ?? "";
  if (countDetail) countDetail.textContent = source.dataset.detail ?? "";
}

function apply(slug: string | null): void {
  const visible = filterRows(slug);
  const activeChip = markActiveChip(slug);
  const explanation = resolveExplanation(slug, visible);
  if (list) list.hidden = visible === 0 && explanation !== undefined;
  updateCount(activeChip ?? explanation);
}

for (const chip of chips) {
  chip.addEventListener("click", (event) => {
    event.preventDefault();
    const slug = chipSlug(chip);
    const next = chip.getAttribute("aria-current") === "true" ? null : slug;
    apply(next);
    const url = next ? `/annuaire?cat=${next}` : "/annuaire";
    history.pushState({}, "", url);
  });
}

// A direct visit to /annuaire?cat=… and a Back/Forward navigation both need
// the same read: the query string is the one source of truth for which
// filter is active, normalised the same way a chip's own value is.
function applyFromLocation(): void {
  apply(normalizeSlug(new URLSearchParams(location.search).get("cat")));
}

window.addEventListener("popstate", applyFromLocation);
applyFromLocation();
