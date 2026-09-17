// src/client/category-filter.ts
// Upgrades /annuaire's chip rail: every chip, including "Tous les métiers", is
// a real `<a href="…">` carrying `data-filter` ("" for "Tous"), so the page
// already works with JavaScript disabled. This only intercepts the click to
// filter in place instead of navigating, and keeps the URL, the live count,
// the active chip and the empty-category explanation in sync — so a direct
// visit to /annuaire?cat=… and the Back button both land on the right,
// visible state. Every string it shows was composed server-side
// (formatMemberCount, COPY, mailtoHref all ran in annuaire.astro's
// frontmatter, into data-count and the hidden [data-empty-for] blocks): this
// file only moves `hidden` and `aria-current` around, it never composes French.
const rows = [...document.querySelectorAll<HTMLElement>("[data-member]")];
const chips = [...document.querySelectorAll<HTMLAnchorElement>("[data-filter]")];
const emptyStates = new Map(
  [...document.querySelectorAll<HTMLElement>("[data-empty-for]")].map((el) => [el.dataset.emptyFor ?? "", el]),
);
const list = rows[0]?.closest("ul") ?? null;
const count = document.querySelector<HTMLElement>("[data-count-text]");

// "" (the "Tous les métiers" chip's own data-filter) means no filter, same as
// the attribute being absent from the URL — one reading, so the two never disagree.
const chipSlug = (chip: HTMLAnchorElement): string | null => chip.dataset.filter || null;

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

function showEmptyState(slug: string | null, visible: number): void {
  for (const empty of emptyStates.values()) empty.hidden = true;
  const empty = slug ? emptyStates.get(slug) : undefined;
  if (!empty || visible > 0) {
    if (list) list.hidden = false;
    return;
  }
  if (list) list.hidden = true;
  empty.hidden = false;
}

function apply(slug: string | null): void {
  const visible = filterRows(slug);
  const activeChip = markActiveChip(slug);
  showEmptyState(slug, visible);
  if (count && activeChip?.dataset.count) count.textContent = activeChip.dataset.count;
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

// A direct visit to /annuaire?cat=… and a Back/Forward navigation both need the
// same read: the query string is the one source of truth for which chip is active.
function applyFromLocation(): void {
  apply(new URLSearchParams(location.search).get("cat"));
}

window.addEventListener("popstate", applyFromLocation);
applyFromLocation();
