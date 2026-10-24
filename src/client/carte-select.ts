// src/client/carte-select.ts
// The half of the map/pin/sheet cross-highlight that pure CSS genuinely
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

// The map box opens on its west edge, while the Halle sits mid-image. With a
// #pin-<slug> fragment the browser already scrolled the box to that pin.
function centreOnHall(): void {
  const box = document.querySelector<HTMLElement>("[data-map]");
  const hall = document.querySelector<HTMLElement>("[data-halle]");
  if (!box || !hall || slugFromHash()) return;
  box.scrollLeft = hall.offsetLeft + hall.offsetWidth / 2 - box.clientWidth / 2;
}

window.addEventListener("hashchange", applySelection);
applySelection();
centreOnHall();

// No import of its own needed (unlike geolocate.ts) — this empty export is
// what tells TypeScript to treat the file as a module rather than a global
// script, which `void import("../client/carte-select")` in carte.astro
// requires.
export {};
