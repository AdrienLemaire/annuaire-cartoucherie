// src/pages/carte.css.ts
// A build-time file, not raw-HTML injection (docs/STANDARDS.md §3 /
// scripts/forbidden.mjs: script-src is 'self' in production and that directive
// bypasses Astro's own escaping, so both are banned repo-wide). /carte.astro's
// own :target rules — one repeated block per pinned member, generated because
// CSS selectors are static and cannot compare an id's suffix to a data
// attribute's value — are served from here as an ordinary, cacheable
// stylesheet instead, exactly like /qr/[slug].svg.ts's SVGs.
import type { APIRoute } from "astro";
import { loadMembers } from "../lib/collections";
import { buildTargetCss, isPinned } from "../lib/plan";

export const GET: APIRoute = async () => {
  const members = await loadMembers();
  const slugs = members.filter(isPinned).map((m) => m.slug);
  return new Response(buildTargetCss(slugs), { headers: { "content-type": "text/css; charset=utf-8" } });
};
