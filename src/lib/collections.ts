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
  return [...categories].sort((a, b) => CATEGORY_ORDER.indexOf(a.slug) - CATEGORY_ORDER.indexOf(b.slug));
}
