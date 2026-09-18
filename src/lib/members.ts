import type { Category, Gender, Member } from "../content/schemas";
import { COPY } from "./copy";
import { agree } from "./gender";

export type CategoryWithCount = Category & { count: number; genders: Gender[] };

/** « — » is the data's way of saying « nowhere to go »: she comes to you. */
export function hasAddress(member: Pick<Member, "distance">): boolean {
  return member.distance.trim() !== "—";
}

/**
 * The icon for « Il/Elle vient chez vous ». Both approved specimens
 * (styleguide.html:1099, annuaire.html:576) tie the itinerant note to the
 * « Services à domicile » category's own icon, not to whichever category a
 * member lists first: Amandine (beaute-soins, services-domicile) and Julien
 * (artisanat-travaux, services-domicile) both render #c-domicile, even though
 * services-domicile is second in both lists. Returns undefined — no icon,
 * not a wrong one — for an itinerant member who isn't tagged services-domicile.
 */
export function homeServiceIcon(member: Pick<Member, "categories">, categories: Category[]): string | undefined {
  if (!member.categories.includes("services-domicile")) return undefined;
  return categories.find((c) => c.slug === "services-domicile")?.icon;
}

function metres(distance: string): number {
  if (!hasAddress({ distance })) return Number.POSITIVE_INFINITY;
  const value = Number.parseFloat(distance.replace(",", "."));
  return distance.includes("km") ? value * 1000 : value;
}

export function sortByDistance<T extends Pick<Member, "distance">>(members: T[]): T[] {
  return [...members].sort((a, b) => metres(a.distance) - metres(b.distance));
}

/**
 * annuaire.astro's own chip rail (final-fixes-report.md, I3): COPY.directoryDetailDefault
 * says « du plus fourni au plus rare », but the code shipped categories.json's own
 * curated order. The mockup (annuaire.html:368-388) sorts by member count, descending,
 * and ties five 2-count and two 1-count categories in French alphabetical order —
 * a decision that could have gone the other way (curated order, insertion order,
 * id order), so it earns naming here rather than living inline in a page.
 */
export function sortByCountDesc<T extends Pick<CategoryWithCount, "count" | "nom">>(categories: T[]): T[] {
  return [...categories].sort((a, b) => b.count - a.count || a.nom.localeCompare(b.nom, "fr"));
}

/** Every category, counted. The empty one stays: it is shown, not hidden. */
export function withCounts(categories: Category[], members: Member[]): CategoryWithCount[] {
  return categories.map((c) => {
    const inCategory = members.filter((m) => m.categories.includes(c.slug));
    return { ...c, count: inCategory.length, genders: inCategory.map((m) => m.genre) };
  });
}

export type MemberCountParts = { count: number; noun: string };

// French keeps the feminine only when nobody in the group is masculine — the
// one rule memberCountParts and pluralPronoun both apply, so it lives once.
function groupGender(genders: Gender[]): Gender {
  return genders.length > 0 && genders.every((g) => g === "f") ? "f" : "h";
}

/**
 * The digit and the gendered word, split apart. annuaire.html's own headline
 * (styleguide's `text-enorme`, "les nombres du quartier") sets the two at
 * different sizes — one caller needs the parts, not the sentence — but the
 * agreement rule itself stays here, the one place that decides « voisine »
 * vs « voisin » vs « voisins ». formatMemberCount is a thin wrapper over this;
 * never re-derive the gender check anywhere else.
 */
export function memberCountParts(count: number, genders: Gender[]): MemberCountParts {
  const noun = agree(groupGender(genders), "voisine");
  return { count, noun: count === 1 ? noun : `${noun}s` };
}

/**
 * « ils »/« elles » for a group — carte.astro's own two count-dependent intro
 * sentences (docs/mockups/final/carte.html:448-449) are the only callers.
 * Same all-or-nothing rule as memberCountParts' own noun.
 */
export function pluralPronoun(genders: Gender[]): string {
  return agree(groupGender(genders), "ils");
}

/**
 * « 1 voisine », « 4 voisins », « personne encore inscrit·e ».
 * French keeps the feminine plural only when no masculine is in the group.
 */
export function formatMemberCount(count: number, genders: Gender[]): string {
  if (count === 0) return COPY.countNobody;
  const { count: n, noun } = memberCountParts(count, genders);
  return `${n} ${noun}`;
}

/** « Appeler Camille » is warmer than « Appeler ». The schema has no first name. */
export function firstName(fullName: string): string {
  return fullName.trim().split(" ")[0];
}

/** The stable public URL of a profile — what the printed QR code encodes. */
export function memberUrl(slug: string, site: string): string {
  return new URL(`/membre/${slug}`, site).href;
}

/** « 4,8 », « 5,0 » — the French decimal comma, always one digit (styleguide block 12). */
export function formatNote(note: number): string {
  return note.toFixed(1).replace(".", ",");
}

/**
 * « 60 m », « 1,2 km » — src/client/geolocate.ts's own rewrite of a row's
 * distance once a visitor grants their position and it is recalculated in the
 * browser (docs/mockups/final/carte.html's own joli()). Rounds to the nearest
 * 10 m below 950 m, one decimal place in km beyond that, so a row updated at
 * runtime reads exactly like one written by hand in the fixture — the same
 * shape memberSchema's own distance field requires.
 */
export function formatDistance(metres: number): string {
  if (metres < 950) return `${Math.round(metres / 10) * 10} m`;
  return `${(Math.round(metres / 100) / 10).toString().replace(".", ",")} km`;
}
