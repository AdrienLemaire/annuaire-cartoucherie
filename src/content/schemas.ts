// The project's type origin. `z` comes from "zod", NEVER from "astro:content":
// the latter drags the content runtime into the browser bundle, and src/lib is
// isomorphic. Field names stay French because Sandra edits the JSON by hand.
import { z } from "zod";

export const genderSchema = z.enum(["f", "h"]);
export type Gender = z.infer<typeof genderSchema>;

const SLUG = /^[a-z0-9-]+$/;

export const memberSchema = z.object({
  // Hand-written and permanent: it is the QR URL (spec §6). Never derived.
  slug: z.string().regex(SLUG, "slug: lower-case letters, digits and hyphens only"),
  nom: z.string().min(1),
  metier: z.string().min(1),
  genre: genderSchema,
  accroche: z.string().min(1),
  bio: z.string().min(1),
  categories: z.array(z.string().regex(SLUG)).min(1),
  services: z.array(z.string()),
  adresse: z.string(),
  // « — » means "no address to go to": it drives the card shape. See hasAddress.
  distance: z.string().regex(/^(—|\d+ m|\d+(,\d)? km)$/, "distance: « 120 m », « 1,2 km » or « — »"),
  lat: z.number().nullable(),
  lng: z.number().nullable(),
  tel: z.string().regex(/^0\d( \d\d){4}$/, "tel: « 06 12 34 56 78 »").nullable(),
  email: z.string().email().nullable(),
  site: z.string().nullable(),
  instagram: z.string().nullable(),
  // A file name under public/portraits/, never a URL: the repo holds no remote
  // portrait fetches and the build never goes to the network.
  photo: z.string().regex(/^[a-z0-9-]+\.(jpg|webp)$/, "photo: a file name, not a URL"),
  note: z.number().min(0).max(5),
  nbAvis: z.number().int().min(0),
  surCarte: z.boolean(),
});
export type Member = z.infer<typeof memberSchema>;

export const categorySchema = z.object({
  slug: z.string().regex(SLUG),
  nom: z.string().min(1),
  besoin: z.string().min(9, "besoin: the « Je cherche… » phrasing, not a label"),
  motsCles: z.array(z.string()).min(1, "motsCles: the landing page advertises these"),
});
export type Category = z.infer<typeof categorySchema>;
