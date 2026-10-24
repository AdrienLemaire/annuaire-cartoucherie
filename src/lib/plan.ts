// src/lib/plan.ts
// The quartier map carte.astro draws: OpenStreetMap streets inside fixed bounds
// (src/assets/quartier.svg, rendered by scripts/map-svg.mjs) with each
// member's real lat/lng projected onto it in Web Mercator, as a left/top
// percentage pair. The pin needs no script — carte.astro's own
// <style is:global> links it to its :target'd .ancre; only the sheet row's
// highlight is JS (src/client/carte-select.ts), and only
// src/client/geolocate.ts ever reorders the sheet.
import type { Member } from "../content/schemas";

// The Halle de la Cartoucherie: the origin the sheet is ranked from and the
// map's « vous êtes ici » marker.
export const HALL = { lat: 43.6006, lng: 1.4108 };

// The district the map covers. Fixed, never derived from member data:
// the committed map must not change with the private content.
export const MAP_BOUNDS = { south: 43.5975, west: 1.403, north: 43.608, east: 1.4185 };

// Zoom whose Web Mercator pixels the map is drawn in, 1:1: ~1.7 m per CSS pixel, so two
// members 80 m apart keep their 44 px tap targets apart.
export const MAP_ZOOM = 16;

/** Web Mercator world pixel at MAP_ZOOM: the map's own coordinate space. */
export function mercatorPixel(lat: number, lng: number): { x: number; y: number } {
  const world = 256 * 2 ** MAP_ZOOM;
  const rad = (lat * Math.PI) / 180;
  return {
    x: ((lng + 180) / 360) * world,
    y: ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * world,
  };
}

const TOP_LEFT = mercatorPixel(MAP_BOUNDS.north, MAP_BOUNDS.west);
const BOTTOM_RIGHT = mercatorPixel(MAP_BOUNDS.south, MAP_BOUNDS.east);

export type MapPosition = { left: number; top: number; etiqClass: "etiq--g" | "etiq--c" | "etiq--d" };

/**
 * A public point exists for this member: carte.astro's pins and MemberRow's
 * « Situer » link need exactly this set, so it is decided once here.
 */
export function isPinned<T extends Pick<Member, "surCarte" | "lat" | "lng">>(
  member: T,
): member is T & { lat: number; lng: number } {
  return member.surCarte && member.lat !== null && member.lng !== null;
}

/**
 * Where a member sits on the map, in percent of its width and height.
 * Throws for a point outside MAP_BOUNDS: the build stops rather than pinning
 * a neighbour on the wrong spot or dropping them from the map unannounced —
 * widen MAP_BOUNDS and rerun scripts/map-svg.mjs instead.
 */
export function projectOnMap(point: { slug: string; lat: number; lng: number }): MapPosition {
  const b = MAP_BOUNDS;
  if (point.lat < b.south || point.lat > b.north || point.lng < b.west || point.lng > b.east) {
    throw new RangeError(`${point.slug} lies outside MAP_BOUNDS (src/lib/plan.ts)`);
  }
  const { x, y } = mercatorPixel(point.lat, point.lng);
  const left = (100 * (x - TOP_LEFT.x)) / (BOTTOM_RIGHT.x - TOP_LEFT.x);
  const top = (100 * (y - TOP_LEFT.y)) / (BOTTOM_RIGHT.y - TOP_LEFT.y);
  const etiqClass = left < 25 ? "etiq--g" : left > 75 ? "etiq--d" : "etiq--c";
  return { left, top, etiqClass };
}

/** Great-circle distance in metres — the only arithmetic src/client/geolocate.ts needs. */
export function haversine(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371000 * 2 * Math.asin(Math.sqrt(h));
}

export type SheetRow = { slug: string; lat: number | null; lng: number | null };
export type RankedRow = { slug: string; metres: number | null };

/**
 * The sheet's new order once a visitor grants a position. memberSchema
 * permits a real distance with null coordinates (a member whose address was
 * never geocoded); such a row cannot be measured against `from`, so it is
 * left in its current relative position — still visible, with a null
 * `metres` telling the caller not to touch its displayed text — rather than
 * ranked on a NaN distance or hidden outright. Pure and DOM-free so this
 * decision is unit-tested without a browser; src/client/geolocate.ts only
 * reads the coordinates off the DOM and applies the order this returns.
 */
export function reorderFromPoint(rows: SheetRow[], from: { lat: number; lng: number }): RankedRow[] {
  const unrankable = rows.filter((r) => r.lat === null || r.lng === null);
  const ranked = rows
    .filter((r): r is SheetRow & { lat: number; lng: number } => r.lat !== null && r.lng !== null)
    .map((r) => ({ slug: r.slug, metres: haversine(from, { lat: r.lat, lng: r.lng }) }))
    .sort((a, b) => a.metres - b.metres);
  return [...unrankable.map((r) => ({ slug: r.slug, metres: null })), ...ranked];
}
