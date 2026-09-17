// src/client/geolocate.ts
// Runs only on a tap. Nothing is sent anywhere: the coordinates are already in
// the page, and the arithmetic happens here.
//
// Deviates from task-10-brief.md's own sample in one respect (fidelity rule,
// task-10-brief.md): that sample reorders the sheet but never rewrites the
// heading or the per-row distance, so after a grant the page would keep
// reading "Classé depuis la Halle" over a list sorted from somewhere else,
// and every row's distance would still be measured from the Halle. This file
// composes no French itself (category-filter.ts's own precedent) — it only
// rewrites already-French text (formatDistance's own output) or toggles
// `hidden` on spans carte.astro already wrote in both languages.
import { formatDistance } from "../lib/members";

function haversine(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371000 * 2 * Math.asin(Math.sqrt(h));
}

function reorder(from: { lat: number; lng: number }): void {
  const sheet = document.querySelector("[data-sheet]");
  if (!sheet) return;
  const rows = [...sheet.querySelectorAll<HTMLElement>("[data-lat]")];
  rows
    .map((row) => ({
      row,
      metres: haversine(from, {
        lat: Number(row.dataset.lat),
        lng: Number(row.dataset.lng),
      }),
    }))
    .sort((a, b) => a.metres - b.metres)
    .forEach(({ row, metres }) => {
      sheet.append(row);
      const dist = row.querySelector<HTMLElement>(".dist");
      if (dist) dist.textContent = formatDistance(metres);
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
      const fromHall = document.querySelector<HTMLElement>("[data-from-hall]");
      const fromYou = document.querySelector<HTMLElement>("[data-from-you]");
      if (fromHall) fromHall.hidden = true;
      if (fromYou) fromYou.hidden = false;
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
