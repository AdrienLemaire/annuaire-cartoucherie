import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // The domain is not registered yet (spec §14). Task 16 replaces this value,
  // and the QR codes of Task 9 encode whatever it says at build time.
  site: "https://annuaire.lacartoucherie.fr",
  output: "static",
  vite: { plugins: [tailwindcss()] },
  build: { inlineStylesheets: "auto" },
});
