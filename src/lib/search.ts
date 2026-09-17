// Bundled into the browser: no astro:*, no node:*, no DOM. One matcher runs on
// both sides, because two implementations drift and the page then advertises a
// keyword the search cannot find.
import type { Category, Gender, Member } from "../content/schemas";
import { normalize } from "./text";

export type IndexEntry = {
  slug: string;
  nom: string;
  metier: string;
  accroche: string;
  genre: Gender;
  categories: string[];
  nomsCategories: string[];
  services: string[];
  motsCles: string[];
  photo: string;
  distance: string;
  note: number;
  nbAvis: number;
};

export type SearchResult = { entry: IndexEntry; reason: string };

/** Contact details are deliberately absent: the index is a public file. */
export function buildIndex(members: Member[], categories: Category[]): IndexEntry[] {
  const bySlug = new Map(categories.map((c) => [c.slug, c]));
  return members.map((m) => {
    const cats = m.categories.map((slug) => bySlug.get(slug)).filter((c) => c !== undefined);
    return {
      slug: m.slug,
      nom: m.nom,
      metier: m.metier,
      accroche: m.accroche,
      genre: m.genre,
      categories: m.categories,
      nomsCategories: cats.map((c) => c.nom),
      services: m.services,
      motsCles: [...new Set(cats.flatMap((c) => [...c.motsCles, c.besoin]))],
      photo: m.photo,
      distance: m.distance,
      note: m.note,
      nbAvis: m.nbAvis,
    };
  });
}

type Field = {
  key: "nom" | "metier" | "services" | "nomsCategories" | "motsCles" | "accroche";
  reason: string;
  weight: number;
};

const FIELDS: Field[] = [
  { key: "nom", reason: "son nom", weight: 100 },
  { key: "metier", reason: "son métier", weight: 80 },
  { key: "services", reason: "ses prestations", weight: 60 },
  { key: "nomsCategories", reason: "sa catégorie", weight: 40 },
  { key: "motsCles", reason: "le besoin", weight: 30 },
  { key: "accroche", reason: "sa présentation", weight: 20 },
];

function bestField(entry: IndexEntry, query: string): Field | null {
  let best: Field | null = null;
  for (const field of FIELDS) {
    const value = entry[field.key];
    const texts = Array.isArray(value) ? value : [value];
    if (texts.some((t) => normalize(t).includes(query)) && (!best || field.weight > best.weight)) {
      best = field;
    }
  }
  return best;
}

export function search(index: IndexEntry[], query: string): SearchResult[] {
  const q = normalize(query);
  if (q.length === 0) return [];

  const scored: { entry: IndexEntry; reason: string; weight: number }[] = [];
  for (const entry of index) {
    const field = bestField(entry, q);
    if (field) scored.push({ entry, reason: field.reason, weight: field.weight });
  }

  return scored
    .sort((a, b) => b.weight - a.weight || a.entry.nom.localeCompare(b.entry.nom, "fr"))
    .map(({ entry, reason }) => ({ entry, reason }));
}
