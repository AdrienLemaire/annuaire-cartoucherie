// THE ONLY file in the project that may import astro:content. Everything else
// takes Member[] and Category[] as arguments, which is what keeps src/lib
// unit-testable without a build and search.ts shippable to the browser.
import { getCollection } from "astro:content";
import categoriesJson from "../content/categories.json";
import type { Category, Member } from "../content/schemas";

export async function loadMembers(): Promise<Member[]> {
  return (await getCollection("members")).map((entry) => entry.data);
}

// getCollection's content-layer store does not preserve categories.json's own
// array order (observed, task-6 fix report: alphabetical by slug) — but that
// file order is curated, not incidental: it is the « Je cherche… » index's
// 01-10 numbering. Sorting by each category's position in the source file's
// own array, read directly here as ground truth, keeps that order
// authoritative without adding a redundant "order" field to the schema.
const CATEGORY_ORDER: readonly string[] = categoriesJson.categories.map((c) => c.slug);

export async function loadCategories(): Promise<Category[]> {
  const categories = (await getCollection("categories")).map((entry) => entry.data);
  // A slug the curated order doesn't know about would otherwise sort to the
  // front silently (indexOf: -1) — the exact shape of failure this project
  // has already been burned by (a dangling <use>, a tree-shaken @theme
  // colour, a font name matching no @font-face): nothing would tell anyone
  // a category jumped to the top of the primary navigation. Checked once,
  // here, rather than inside the O(n log n) comparator below.
  for (const c of categories) {
    if (!CATEGORY_ORDER.includes(c.slug)) {
      throw new Error(
        `loadCategories: "${c.slug}" is missing from categories.json's curated order — ` +
          `astro:content's collection and the direct JSON import have drifted apart`,
      );
    }
  }
  return [...categories].sort((a, b) => CATEGORY_ORDER.indexOf(a.slug) - CATEGORY_ORDER.indexOf(b.slug));
}
