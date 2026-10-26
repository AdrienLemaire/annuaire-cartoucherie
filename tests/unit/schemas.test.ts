import { describe, it, expect } from "vitest";
import { memberSchema } from "../../src/content/schemas";
import { member } from "./factory";

describe("Member schema", () => {
  // A link pasted from the browser carries Google's tracking (entry, g_ep):
  // the visitor's click should not hand Google a token from whoever copied it.
  it("Drops the query from a Google reviews link and refuses any other site", () => {
    const parse = (avisGoogle: string) =>
      memberSchema.safeParse(member({ accroche: "A", bio: "B", avisGoogle }));
    const place = "https://www.google.com/maps/place/Atelier+Fictif/data=!4m2!9m1!1b1";

    expect(parse(`${place}?entry=ttu&g_ep=abc`).data?.avisGoogle).toBe(place);
    expect(parse("https://g.co/kgs/abc").success).toBe(false);
  });
});
