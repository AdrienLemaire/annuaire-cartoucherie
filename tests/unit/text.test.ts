import { describe, it, expect } from "vitest";
import { longestWord, normalize, slugify } from "../../src/lib/text";

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

describe("longestWord", () => {
  it.each([
    ["Julien Marty", 6],
    ["Menuisier-ébéniste", 9],
  ])("Counts the letters that must fit on one line in « %s »", (text, letters) => {
    expect(longestWord(text)).toBe(letters);
  });
});
