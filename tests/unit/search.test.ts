import { describe, it, expect } from "vitest";
import { buildIndex, search } from "../../src/lib/search";
import type { Category, Member } from "../../src/content/schemas";
import { member } from "./factory";

const members: Member[] = [
  member({
    slug: "jules-martin",
    nom: "Jules Martin",
    metier: "Électricien",
    categories: ["travaux"],
  }),
  member({
    slug: "alice-nguyen",
    nom: "Alice Nguyen",
    metier: "Sophrologue",
    categories: ["equilibre"],
  }),
];

const categories: Category[] = [
  {
    slug: "travaux",
    nom: "Artisanat & travaux",
    besoin: "Réparer chez moi",
    motsCles: ["dépannage"],
    icon: "c-artisanat",
  },
  {
    slug: "equilibre",
    nom: "Santé & bien-être",
    besoin: "Retrouver l'équilibre",
    motsCles: ["énergie"],
    icon: "c-sante",
  },
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

  // search.ts:86 (final-fixes-report.md, "three tests owed"): weight first,
  // then localeCompare("fr") — a decision that could have gone the other way
  // (insertion order, plain string compare). A name match always outranks a
  // trade match, regardless of which member's name sorts first.
  it("Ranks a name match above a trade match, whatever the names are", () => {
    const yoga = member({ slug: "yoga-personne", nom: "Yoga Personne", metier: "Peintre" });
    const prof = member({ slug: "prof-yoga", nom: "Alice Prof", metier: "Prof de yoga" });
    const idx = buildIndex([yoga, prof], categories);
    expect(search(idx, "yoga").map((r) => r.entry.slug)).toEqual(["yoga-personne", "prof-yoga"]);
  });

  // Same field, same weight: only the tie-break decides. French collation
  // treats É next to E, well before Z; a plain code-unit compare (no locale)
  // would rank "Zoé" first instead (U+00C9 sorts after U+005A).
  it("Breaks a same-field tie with French collation, not code-point order", () => {
    const zoe = member({ slug: "zoe", nom: "Zoé Test" });
    const emile = member({ slug: "emile", nom: "Émile Test" });
    const idx = buildIndex([zoe, emile], categories);
    expect(search(idx, "test").map((r) => r.entry.slug)).toEqual(["emile", "zoe"]);
  });

  // The index is a public file. A crawler fetching it must not come away with
  // the quartier's phone book — contact details live on the profile page only.
  it("Keeps contact details out of the public index", () => {
    const entry = buildIndex(
      [member({ tel: "06 12 34 56 78", email: "alice@example.fr", instagram: "alice" })],
      categories,
    )[0];
    expect(Object.keys(entry)).not.toContain("tel");
    expect(Object.keys(entry)).not.toContain("email");
    expect(JSON.stringify(entry)).not.toContain("@");
  });
});
