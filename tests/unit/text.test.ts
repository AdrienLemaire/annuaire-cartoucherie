import { describe, it, expect } from "vitest";
import { normalize, slugify } from "../../src/lib/text";

describe("Text normalisation", () => {
  // French. Someone types "electricien" and someone else typed « Électricien ».
  // One normaliser serves search and slug suggestion; two would drift apart.
  it("Folds accents and case, and suggests a slug in the same shape", () => {
    expect(normalize("Électricien")).toBe("electricien");
    expect(normalize("  Bien-Être ")).toBe("bien-etre");
    expect(slugify("Camille Roussel")).toBe("camille-roussel");
    expect(slugify("Santé & bien-être")).toBe("sante-bien-etre");
  });
});
