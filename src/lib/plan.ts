// src/lib/plan.ts
// The schematic quartier plan carte.astro draws (docs/mockups/final/carte.html):
// a member's real lat/lng projected onto the plan as a left/top percentage pair,
// plus the per-member CSS that links a plan pin, its label and its row in the
// distance-ordered sheet through :target alone. No script moves a pixel on this
// page for that link — src/client/geolocate.ts only ever reorders the sheet.
import type { Member } from "../content/schemas";

// The Halle de la Cartoucherie: the plan's own visual anchor (the mockup's own
// "vous êtes ici" marker) and the point src/client/geolocate.ts falls back to
// when a visitor declines geolocation or it fails. The two files never share an
// import — one runs at build time, the other only in the browser — so this
// value and geolocate.ts's own HALL constant are kept in sync by hand.
export const HALL = { lat: 43.6006, lng: 1.4108 };

// The Halle glyph's own fixed position inside the hand-drawn SVG background
// (docs/mockups/final/carte.html's 390×400 viewBox, copied verbatim into
// carte.astro): every pin is placed relative to it, in percent, rather than to
// the viewBox's geometric centre, which the glyph does not sit at.
const ORIGIN = { left: 44, top: 62.5 };

// A radial square-root scale, not a linear one: several fixture members sit
// within 60-150 m of the Halle, close enough that a linear metres-to-percent
// scale stacks their pins (and their 44px tap targets, docs/STANDARDS.md's own
// floor) on top of each other. A square root spreads nearby points apart more
// than it spreads distant ones — still monotonic, so relative order survives —
// while SQRT_SCALE is tuned to keep the farthest fixture member
// (marc-ollivier, ~800 m) inside an 8-92% band. The plan is schematic and says
// so (COPY.mapSchematic): this is not a projection a visitor could measure a
// distance from.
const SQRT_SCALE = 42 / Math.sqrt(800);
const MIN_PERCENT = 8;
const MAX_PERCENT = 92;

function clamp(n: number): number {
  return Math.min(MAX_PERCENT, Math.max(MIN_PERCENT, n));
}

export type PlanPosition = { left: number; top: number; etiqClass: "etiq--g" | "etiq--c" | "etiq--d" };

/**
 * A public point exists for this member: carte.astro and carte.css.ts both
 * need exactly this set (the plan's pins and the matching :target rules), so
 * it is decided once here rather than the same three-field check drifting
 * between the two callers.
 */
export function isPinned(member: Pick<Member, "surCarte" | "lat" | "lng">): boolean {
  return member.surCarte && member.lat !== null && member.lng !== null;
}

/** Where a member's pin sits on the schematic plan, or null with no coordinates to place it. */
export function projectOnPlan(point: Pick<Member, "lat" | "lng">): PlanPosition | null {
  if (point.lat === null || point.lng === null) return null;
  const metresPerDegreeLat = 111_320;
  const metresPerDegreeLng = 111_320 * Math.cos((HALL.lat * Math.PI) / 180);
  const dx = (point.lng - HALL.lng) * metresPerDegreeLng;
  const dy = (point.lat - HALL.lat) * metresPerDegreeLat; // north is up: higher lat, smaller top
  const distance = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx);
  const scaled = Math.sqrt(distance) * SQRT_SCALE;
  const left = clamp(ORIGIN.left + scaled * Math.cos(angle));
  const top = clamp(ORIGIN.top - scaled * Math.sin(angle));
  const etiqClass = left < 25 ? "etiq--g" : left > 75 ? "etiq--d" : "etiq--c";
  return { left, top, etiqClass };
}

/**
 * The :target rules wiring one plan pin, its label and its sheet row together —
 * docs/mockups/final/carte.html's own repeated block, one per member. CSS
 * selectors are static and cannot compare an id's suffix to a data attribute's
 * value, so this is generated rather than written by hand for a fixed roster.
 */
export function buildTargetCss(slugs: string[]): string {
  return slugs
    .map(
      (slug) => `
#pin-${slug}:target ~ .colonne-plan [data-m="${slug}"]{ z-index:30; opacity:1; }
#pin-${slug}:target ~ .colonne-plan [data-m="${slug}"] .epingle{ transform:scale(1.14); box-shadow:0 0 0 3px var(--color-orange-500), var(--shadow-flottant); }
#pin-${slug}:target ~ .colonne-plan [data-m="${slug}"] .etiq{ opacity:1; }
#pin-${slug}:target ~ .colonne-plan [data-m="${slug}"] .etiq--c{ transform:translate(-50%,0); }
#pin-${slug}:target ~ .colonne-plan [data-m="${slug}"] .etiq--g,
#pin-${slug}:target ~ .colonne-plan [data-m="${slug}"] .etiq--d{ transform:translate(0,0); }
#pin-${slug}:target ~ .feuille [data-m="${slug}"]{ background:var(--color-teal-50); box-shadow:0 0 0 2px var(--color-teal-600), var(--shadow-carte); }`,
    )
    .join("\n");
}
