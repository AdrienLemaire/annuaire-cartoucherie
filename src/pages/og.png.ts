// src/pages/og.png.ts
// The share card for every page that is not a profile — the home page above
// all, the link people forward most on WhatsApp.
import type { APIRoute } from "astro";
import { COPY } from "../lib/copy";
import { renderCard } from "../og/card";

export const GET: APIRoute = async () => {
  const png = await renderCard(
    `${COPY.brandEyebrow} ${COPY.brandName}`,
    COPY.homeIntro,
    COPY.homeBy,
  );
  // Same Buffer → plain-ArrayBuffer copy as og/[slug].png.ts.
  return new Response(new Blob([Uint8Array.from(png)]), {
    headers: { "content-type": "image/png" },
  });
};
