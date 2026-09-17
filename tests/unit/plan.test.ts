import { describe, expect, it } from "vitest";
import { reorderFromPoint } from "../../src/lib/plan";

// Synthetic rows, not tests/fixtures/members.json: memberSchema permits a real
// distance with null coordinates (an address never geocoded), a state the
// committed fixture happens not to contain. Constructed here instead of
// editing that fixture (task-10-report.md, finding 2).
describe("reorderFromPoint", () => {
  it("Ranks members with coordinates and leaves one without in place", () => {
    const from = { lat: 43.6006, lng: 1.4108 };
    const rows = [
      { slug: "far", lat: 43.61, lng: 1.42 },
      { slug: "no-coords", lat: null, lng: null },
      { slug: "near", lat: 43.601, lng: 1.411 },
    ];

    const result = reorderFromPoint(rows, from);

    // The uncoordinated row keeps a null distance rather than NaN, and is
    // never mixed into the ranking.
    expect(result[0]).toEqual({ slug: "no-coords", metres: null });
    const ranked = result.slice(1);
    expect(ranked.map((r) => r.slug)).toEqual(["near", "far"]);
    expect(ranked.every((r) => Number.isFinite(r.metres))).toBe(true);
  });

  it("Leaves the order untouched when nobody has coordinates", () => {
    const from = { lat: 43.6006, lng: 1.4108 };
    const rows = [
      { slug: "a", lat: null, lng: null },
      { slug: "b", lat: null, lng: null },
    ];
    expect(reorderFromPoint(rows, from)).toEqual([
      { slug: "a", metres: null },
      { slug: "b", metres: null },
    ]);
  });
});
