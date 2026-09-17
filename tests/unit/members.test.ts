import { describe, it, expect } from "vitest";
import {
  formatMemberCount, hasAddress, memberUrl, sortByDistance, withCounts,
} from "../../src/lib/members";
import type { Category } from "../../src/content/schemas";
import { member } from "./factory";

describe("Member helpers", () => {
  // The reader's question is « is there somewhere to go? », and the answer
  // decides the card shape. surCarte answers a different question — « is there
  // a public pin on the plan » — and a pickup address has one without the other.
  it("Reads an address from the distance, never from surCarte", () => {
    expect(hasAddress(member({ distance: "210 m", surCarte: false }))).toBe(true);
    expect(hasAddress(member({ distance: "—", surCarte: false }))).toBe(false);
  });

  it("Sorts by distance and puts the itinerants last", () => {
    const ordered = sortByDistance([
      member({ slug: "far", distance: "1,2 km" }),
      member({ slug: "itinerant", distance: "—" }),
      member({ slug: "near", distance: "60 m" }),
    ]);
    expect(ordered.map((m) => m.slug)).toEqual(["near", "far", "itinerant"]);
  });

  // The empty category stays in the list and is shown greyed. Hiding it would
  // hide the one place a visitor can say « I know someone for this ».
  it("Counts a category without dropping the empty one", () => {
    const categories: Category[] = [
      { slug: "a", nom: "A", besoin: "Besoin A", motsCles: ["a"] },
      { slug: "vide", nom: "Vide", besoin: "Besoin vide", motsCles: ["v"] },
    ];
    const counted = withCounts(categories, [member({ categories: ["a"] })]);
    expect(counted.map((c) => c.count)).toEqual([1, 0]);
    expect(counted[0].genders).toEqual(["f"]);
  });

  it("Agrees the count with the gender of who is counted", () => {
    expect(formatMemberCount(1, ["f"])).toBe("1 voisine");
    expect(formatMemberCount(1, ["h"])).toBe("1 voisin");
    expect(formatMemberCount(0, [])).toBe("personne encore inscrit·e");
  });

  it("Keeps the plural feminine only when nobody in the group is masculine", () => {
    expect(formatMemberCount(3, ["f", "f", "f"])).toBe("3 voisines");
    expect(formatMemberCount(3, ["f", "h", "f"])).toBe("3 voisins");
  });

  // The QR code printed on a counter encodes this string. It must not move.
  it("Builds the profile URL the QR code encodes", () => {
    expect(memberUrl("alice-nguyen", "https://annuaire.lacartoucherie.fr")).toBe(
      "https://annuaire.lacartoucherie.fr/membre/alice-nguyen"
    );
  });
});
