import { describe, it, expect } from "vitest";
import { agree } from "../../src/lib/gender";

describe("French gender agreement", () => {
  it("Agrees the pronoun and the elided article", () => {
    expect(agree("f", "elle")).toBe("elle");
    expect(agree("h", "elle")).toBe("il");
    expect(agree("f", "la")).toBe("la");
    expect(agree("h", "la")).toBe("le");
  });

  it("Agrees the noun and the past participle", () => {
    expect(agree("f", "voisine")).toBe("voisine");
    expect(agree("h", "voisine")).toBe("voisin");
    expect(agree("f", "inscrite")).toBe("inscrite");
    expect(agree("h", "inscrite")).toBe("inscrit");
  });
});
