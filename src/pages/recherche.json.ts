// src/pages/recherche.json.ts
// The file name is French because it is a URL: /recherche.json is referenced by
// scripts/budgets.mjs, public/_headers and the service worker.
import type { APIRoute } from "astro";
import { loadCategories, loadMembers } from "../lib/collections";
import { buildIndex } from "../lib/search";

export const GET: APIRoute = async () => {
  const [members, categories] = await Promise.all([loadMembers(), loadCategories()]);
  return new Response(JSON.stringify(buildIndex(members, categories)), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
};
