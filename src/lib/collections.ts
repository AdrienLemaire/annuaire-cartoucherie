// THE ONLY file in the project that may import astro:content. Everything else
// takes Member[] and Category[] as arguments, which is what keeps src/lib
// unit-testable without a build and search.ts shippable to the browser.
import { getCollection } from "astro:content";
import type { Category, Member } from "../content/schemas";

export async function loadMembers(): Promise<Member[]> {
  return (await getCollection("members")).map((entry) => entry.data);
}

export async function loadCategories(): Promise<Category[]> {
  return (await getCollection("categories")).map((entry) => entry.data);
}
