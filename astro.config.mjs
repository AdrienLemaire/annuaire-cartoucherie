import { defineConfig } from "astro/config";
import process from "node:process";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  // Every QR code and canonical URL encodes this at build time. The deploy
  // job sets it per environment (staging, production); a local build points
  // at the local preview, so no QR code ever carries a domain by accident.
  site: process.env.SITE_URL ?? "http://localhost:4321",
  output: "static",
  // Matches wrangler.toml's html_handling = "drop-trailing-slash" (Task 16):
  // without this, Astro.url.pathname is "/annuaire/" for a directory-format
  // build, and BaseLayout's canonical/og:url would encode a URL that
  // Cloudflare 307-redirects — a self-inflicted redirect on every crawler and
  // social-card fetch. Verified: rebuilding with this set, dist/annuaire's
  // canonical and og:url both read ".../annuaire" with no trailing slash.
  trailingSlash: "never",
  // sitemap-index.xml, announced by src/pages/robots.txt.ts.
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
  build: { inlineStylesheets: "auto" },
});
