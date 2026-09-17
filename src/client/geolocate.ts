// src/client/geolocate.ts
// Runs only on a tap. Nothing is sent anywhere: the coordinates are already in
// the page, and the arithmetic (src/lib/plan.ts's haversine, isomorphic and
// unit-tested) happens here, in the browser.
//
// Deviates from task-10-brief.md's own sample in one respect (fidelity rule,
// task-10-brief.md): that sample reorders the sheet but never rewrites the
// heading, the origin line or any row's distance, so after a grant the page
// would keep reading "Classé depuis la Halle" over a list sorted from
// somewhere else. This file composes no French itself (category-filter.ts's
// own precedent) — it only rewrites already-French text (formatDistance's own
// output) or toggles `hidden` on spans carte.astro already wrote in both
// languages.
import { formatDistance } from "../lib/members";
import { reorderFromPoint, type SheetRow } from "../lib/plan";

function readCoord(value: string | undefined): number | null {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function reorder(from: { lat: number; lng: number }): void {
  const sheet = document.querySelector("[data-sheet]");
  if (!sheet) return;
  const elements = [...sheet.querySelectorAll<HTMLElement>("[data-lat]")];
  const bySlug = new Map(elements.map((el) => [el.dataset.slug ?? "", el]));
  const rows: SheetRow[] = elements.map((el) => ({
    slug: el.dataset.slug ?? "",
    lat: readCoord(el.dataset.lat),
    lng: readCoord(el.dataset.lng),
  }));

  reorderFromPoint(rows, from).forEach(({ slug, metres }) => {
    const row = bySlug.get(slug);
    if (!row) return;
    sheet.append(row);
    // metres is null for a row memberSchema allows to carry a real distance
    // but no coordinates (task-10-report.md, finding 2): reorderFromPoint
    // already left it in place, and its displayed distance is left alone too
    // rather than being overwritten with a broken number.
    if (metres === null) return;
    const dist = row.querySelector<HTMLElement>(".dist");
    if (dist) dist.textContent = formatDistance(metres);
  });
}

// Each selector pair is two spans carte.astro already wrote, one hidden — this
// function only ever toggles which one is visible, never composes text. Called
// once per pair (the sheet heading, the geo panel's own title, its body text,
// the sheet's origin line): four independent swaps, since three of the four
// carry different wording pre/post-grant even though two happen to read
// identically after ("Classé depuis votre position" is mapFromYou in both).
function swap(fromSelector: string, toSelector: string, toGranted: boolean): void {
  document.querySelectorAll<HTMLElement>(fromSelector).forEach((el) => {
    el.hidden = toGranted;
  });
  document.querySelectorAll<HTMLElement>(toSelector).forEach((el) => {
    el.hidden = !toGranted;
  });
}

function showStatus(kind: "granted" | "denied"): void {
  document.querySelector<HTMLElement>("[data-geo-status]")?.removeAttribute("hidden");
  const granted = document.querySelector<HTMLElement>("[data-geo-granted]");
  const denied = document.querySelector<HTMLElement>("[data-geo-denied]");
  if (granted) granted.hidden = kind !== "granted";
  if (denied) denied.hidden = kind !== "denied";
}

document.querySelector("[data-geolocate]")?.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      reorder({ lat: position.coords.latitude, lng: position.coords.longitude });
      swap("[data-from-hall]", "[data-from-you]", true);
      swap("[data-geo-title-hall]", "[data-geo-title-you]", true);
      swap("[data-geo-text-hall]", "[data-geo-text-you]", true);
      swap("[data-origin-hall]", "[data-origin-you]", true);
      showStatus("granted");
    },
    // A refusal or an unavailable position leaves the list exactly as it was
    // (already ranked from the Halle) — nothing is reordered a second time,
    // which would only reshuffle members tied on a rounded distance for no
    // visible reason.
    () => showStatus("denied"),
    { enableHighAccuracy: false, timeout: 8000 },
  );
});

// « Non merci, je reste sur la Halle » (task-10-report.md, finding 1): never
// touches navigator.geolocation. Dismisses the whole explanatory panel —
// its job (asking) is done once a visitor has answered — and leaves every
// row exactly where carte.astro put it.
document.querySelector("[data-geo-decline]")?.addEventListener("click", () => {
  document.querySelector<HTMLElement>("[data-geo-panel]")?.setAttribute("hidden", "");
});
