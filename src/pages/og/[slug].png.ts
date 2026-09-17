// src/pages/og/[slug].png.ts
// One PNG per member, generated at build time (output: "static" — no request
// ever reaches this handler in production; wrangler serves the static file).
import type { APIRoute } from "astro";
import { loadMembers } from "../../lib/collections";
import { renderCard } from "../../og/card";

export async function getStaticPaths() {
  return (await loadMembers()).map((member) => ({
    params: { slug: member.slug },
    props: { nom: member.nom, metier: member.metier },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { nom, metier } = props as { nom: string; metier: string };
  const png = await renderCard(nom, metier);
  // Response's BodyInit rejects @types/node's Buffer directly (its backing
  // ArrayBufferLike isn't narrowed to plain ArrayBuffer). Uint8Array.from
  // copies into a fresh, plain-ArrayBuffer-backed view that both Blob and
  // BodyInit accept.
  return new Response(new Blob([Uint8Array.from(png)]), {
    headers: { "content-type": "image/png" },
  });
};
