import { describe, it, expect } from "vitest";
import {
  formatDistance, formatMemberCount, formatNote, hasAddress, memberUrl, sortByCountDesc, sortByDistance, withCounts,
} from "../../src/lib/members";
import type { Category } from "../../src/content/schemas";
import { COPY } from "../../src/lib/copy";
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

  // annuaire.astro's chip rail (final-fixes-report.md, I3): COPY says « du plus
  // fourni au plus rare », a decision that could have gone the other way
  // (curated order, insertion order) — count descending, tied categories in
  // French alphabetical order, matching annuaire.html:368-388's own five-way tie.
  it("Sorts categories by count, then alphabetically in French", () => {
    const cats = [
      { count: 1, nom: "Beauté & soins" }, { count: 2, nom: "Sport & mouvement" },
      { count: 4, nom: "Santé & bien-être" }, { count: 2, nom: "Art & culture" },
      { count: 1, nom: "Alimentation & traiteur" },
    ];
    expect(sortByCountDesc(cats).map((c) => c.nom)).toEqual([
      "Santé & bien-être", "Art & culture", "Sport & mouvement",
      "Alimentation & traiteur", "Beauté & soins",
    ]);
  });

  // The empty category stays in the list and is shown greyed. Hiding it would
  // hide the one place a visitor can say « I know someone for this ».
  it("Counts a category without dropping the empty one", () => {
    const categories: Category[] = [
      { slug: "a", nom: "A", besoin: "Besoin A", motsCles: ["a"], icon: "c-a" },
      { slug: "vide", nom: "Vide", besoin: "Besoin vide", motsCles: ["v"], icon: "c-vide" },
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

  // French reads a rating with a comma, and a perfect score still shows one
  // decimal (styleguide block 12: "5,0", never a bare "5").
  it("Formats a rating with a French decimal comma", () => {
    expect(formatNote(4.8)).toBe("4,8");
    expect(formatNote(5)).toBe("5,0");
  });

  // src/client/geolocate.ts rewrites a row's distance after a grant; the
  // result must satisfy memberSchema's own regex, hence the 950 m cutover
  // to kilometres and the French comma below it.
  it("Formats a distance the way the fixture's own field does", () => {
    expect(formatDistance(63)).toBe("60 m");
    expect(formatDistance(1234)).toBe("1,2 km");
  });
});

describe("Distance from the Halle", () => {
  it("Says « À la Halle » for a member based in it, not « À 0 m »", () => {
    expect(COPY.profileDistanceFromHall("0 m")).toBe("À la Halle");
    expect(COPY.profileDistanceFromHall("310 m")).toBe("À 310 m de la Halle");
    expect(COPY.cardDistance("0 m")).toBe("La Halle");
    expect(COPY.cardDistance("310 m")).toBe("310 m");
  });
});
