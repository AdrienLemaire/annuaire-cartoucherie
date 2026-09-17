import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { categorySchema, memberSchema, type Category, type Member } from "./content/schemas";

const members = defineCollection({
  // Astro's file loader keys each entry on `id`. The slug is that key, so the
  // route /membre/[slug] and the printed QR code address the same entry.
  loader: file("src/content/members.json", {
    parser: (text) =>
      (JSON.parse(text) as { membres: Member[] }).membres.map((m) => ({ id: m.slug, ...m })),
  }),
  schema: memberSchema,
});

const categories = defineCollection({
  loader: file("src/content/categories.json", {
    parser: (text) =>
      (JSON.parse(text) as { categories: Category[] }).categories.map((c) => ({ id: c.slug, ...c })),
  }),
  schema: categorySchema,
});

export const collections = { members, categories };
