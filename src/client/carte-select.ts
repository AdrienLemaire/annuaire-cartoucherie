// src/client/carte-select.ts
// The half of the plan/pin/sheet cross-highlight that pure CSS genuinely
// cannot do (carte.astro's own header comment explains why): the sheet row
// lives in a different subtree than its pin's `.ancre`, and geolocate.ts
// moves rows around at runtime, so no fixed DOM relationship exists for a
// selector to exploit. The pin side needs none of this — it is a single
// generic `.ancre:target + .epingle-lien` rule in carte.astro's own
// <style is:global>, reacting to the same #pin-<slug> fragment this file
// reads, with no coordination between the two required.
const PIN_PREFIX = "#pin-";

function slugFromHash(): string | null {
  const { hash } = window.location;
  return hash.startsWith(PIN_PREFIX) ? hash.slice(PIN_PREFIX.length) : null;
}

function applySelection(): void {
  const slug = slugFromHash();
  document.querySelectorAll<HTMLElement>("[data-sheet] [data-m]").forEach((row) => {
    row.toggleAttribute("data-selected", row.dataset.m === slug);
  });
}

window.addEventListener("hashchange", applySelection);
applySelection();

// No import of its own needed (unlike geolocate.ts) — this empty export is
// what tells TypeScript to treat the file as a module rather than a global
// script, which `void import("../client/carte-select")` in carte.astro
// requires.
export {};
