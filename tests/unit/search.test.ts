import { describe, it, expect } from "vitest";
import { buildIndex, search } from "../../src/lib/search";
import type { Category, Member } from "../../src/content/schemas";
import { member } from "./factory";

const members: Member[] = [
  member({ slug: "jules-martin", nom: "Jules Martin", metier: "Électricien", categories: ["travaux"] }),
  member({ slug: "alice-nguyen", nom: "Alice Nguyen", metier: "Sophrologue", categories: ["equilibre"] }),
];

const categories: Category[] = [
  { slug: "travaux", nom: "Artisanat & travaux", besoin: "Réparer chez moi", motsCles: ["dépannage"], icon: "c-artisanat" },
  { slug: "equilibre", nom: "Santé & bien-être", besoin: "Retrouver l'équilibre", motsCles: ["énergie"], icon: "c-sante" },
];

const index = buildIndex(members, categories);
const slugs = (query: string) => search(index, query).map((r) => r.entry.slug);

describe("Search", () => {
  it("Matches without the accents the typist did not type", () => {
    expect(slugs("electricien")).toEqual(["jules-martin"]);
    expect(slugs("Électricien")).toEqual(["jules-martin"]);
  });

  // The landing page advertises « Retrouver l'équilibre : stress, sommeil,
  // énergie ». No member text contains « énergie ». Without the category
  // keywords in the index the page contradicts itself — the mockup's own bug.
  it("Finds a neighbour through a keyword the landing page advertises", () => {
    expect(slugs("énergie")).toEqual(["alice-nguyen"]);
    expect(slugs("energie")).toEqual(["alice-nguyen"]);
  });

  it("Says why a result matched, in French", () => {
    expect(search(index, "sophrologue")[0].reason).toBe("son métier");
    expect(search(index, "énergie")[0].reason).toBe("le besoin");
  });

  it("Returns nothing for an empty or an absurd query", () => {
    expect(search(index, "   ")).toEqual([]);
    expect(search(index, "zzzzqqqq")).toEqual([]);
  });
});
