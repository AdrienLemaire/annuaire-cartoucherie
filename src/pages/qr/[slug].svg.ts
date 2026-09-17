// src/pages/qr/[slug].svg.ts
// A build-time file, not a client script (docs/STANDARDS.md §3: script-src is
// 'self' in production, so an inline generator script fails silently there).
// One SVG per member, served straight from dist/ and cacheable.
import type { APIRoute } from "astro";
import QRCode from "qrcode";
import { loadMembers } from "../../lib/collections";
import { memberUrl } from "../../lib/members";

export async function getStaticPaths() {
  return (await loadMembers()).map((member) => ({ params: { slug: member.slug } }));
}

// #0d2b2e / #ffffff: the exact fill and ground membre.html's own static QR
// specimen uses (docs/mockups/final/membre.html:605-606), close to
// --color-teal-950 but pinned as literal hex since QRCode.toString takes
// none of the project's CSS custom properties.
export const GET: APIRoute = async ({ params, site }) => {
  const url = memberUrl(params.slug!, site!.href);
  const svg = await QRCode.toString(url, {
    type: "svg",
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#0d2b2e", light: "#ffffff" },
  });
  return new Response(svg, { headers: { "content-type": "image/svg+xml; charset=utf-8" } });
};
