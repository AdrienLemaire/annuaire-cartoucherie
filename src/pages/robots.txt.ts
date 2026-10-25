// src/pages/robots.txt.ts
// Generated, not in public/: the sitemap line needs this deploy's own origin.
// Staging stays out of search through CI's X-Robots-Tag header, not here.
// Cloudflare prepends its managed content-signals block to whatever this serves.
import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) =>
  new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${new URL("/sitemap-index.xml", site).href}\n`,
    {
      headers: { "content-type": "text/plain; charset=utf-8" },
    },
  );
