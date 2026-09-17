import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // The domain is not registered yet (spec §14). Task 16 replaces this value,
  // and the QR codes of Task 9 encode whatever it says at build time.
  site: "https://annuaire.lacartoucherie.fr",
  output: "static",
  // Matches wrangler.toml's html_handling = "drop-trailing-slash" (Task 16):
  // without this, Astro.url.pathname is "/annuaire/" for a directory-format
  // build, and BaseLayout's canonical/og:url would encode a URL that
  // Cloudflare 307-redirects — a self-inflicted redirect on every crawler and
  // social-card fetch. Verified: rebuilding with this set, dist/annuaire's
  // canonical and og:url both read ".../annuaire" with no trailing slash.
  trailingSlash: "never",
  vite: { plugins: [tailwindcss()] },
  build: { inlineStylesheets: "auto" },
});
