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

/** Every category, counted. The empty one stays: it is shown, not hidden. */
export function withCounts(categories: Category[], members: Member[]): CategoryWithCount[] {
  return categories.map((c) => {
    const inCategory = members.filter((m) => m.categories.includes(c.slug));
    return { ...c, count: inCategory.length, genders: inCategory.map((m) => m.genre) };
  });
}

/**
 * « 1 voisine », « 4 voisins », « personne encore inscrit·e ».
 * French keeps the feminine plural only when no masculine is in the group.
 */
export function formatMemberCount(count: number, genders: Gender[]): string {
  if (count === 0) return COPY.countNobody;
  const feminine = genders.length > 0 && genders.every((g) => g === "f");
  const noun = agree(feminine ? "f" : "h", "voisine");
  return count === 1 ? `${count} ${noun}` : `${count} ${noun}s`;
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
