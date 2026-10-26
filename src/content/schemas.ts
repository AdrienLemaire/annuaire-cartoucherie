// The project's type origin. `z` comes from "zod", NEVER from "astro:content":
// the latter drags the content runtime into the browser bundle, and src/lib is
// isomorphic. Field names stay French because the JSON is edited by hand.
import { z } from "zod";

export const genderSchema = z.enum(["f", "h"]);
export type Gender = z.infer<typeof genderSchema>;

const SLUG = /^[a-z0-9-]+$/;
const IMAGE_FILE = /^[a-z0-9-]+\.(jpg|png|webp)$/;

// One slide of the member's Instagram portrait carousel. `texte` is the slide's
// own words, transcribed: the slides are text set in images, which a screen
// reader cannot read and a 200 % zoom blurs.
export const slideSchema = z.object({
  fichier: z.string().regex(IMAGE_FILE, "fichier: a file name under carrousels/, not a URL"),
  texte: z.string().min(1),
});
export type Slide = z.infer<typeof slideSchema>;

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
  email: z.email().nullable(),
  site: z.string().nullable(),
  instagram: z.string().nullable(),
  // The name after linkedin.com/in/. Defaults to null so rows written before
  // the field existed stay valid.
  linkedin: z
    .string()
    .regex(/^[\w-]+$/, "linkedin: the name after linkedin.com/in/, not a URL")
    .nullable()
    .default(null),
  // The member's Google Maps link, copied while on its reviews tab. A link out
  // only: Google's terms forbid showing the reviews themselves. The query is
  // only Google's tracking (entry, g_ep), so it is dropped.
  avisGoogle: z
    .string()
    .regex(/^https:\/\/www\.google\.com\/maps\/\S+$/, "avisGoogle: a https://www.google.com/maps/ link")
    .transform((url) => url.split(/[?#]/)[0])
    .nullable()
    .default(null),
  // A file name under public/portraits/, never a URL: the repo holds no remote
  // portrait fetches and the build never goes to the network.
  photo: z.string().regex(/^[a-z0-9-]+\.(jpg|webp)$/, "photo: a file name, not a URL"),
  note: z.number().min(0).max(5),
  nbAvis: z.number().int().min(0),
  surCarte: z.boolean(),
  carrousel: z.array(slideSchema).default([]),
});
export type Member = z.infer<typeof memberSchema>;

export const categorySchema = z.object({
  slug: z.string().regex(SLUG),
  nom: z.string().min(1),
  besoin: z.string().min(9, "besoin: the « Je cherche… » phrasing, not a label"),
  motsCles: z.array(z.string()).min(1, "motsCles: the landing page advertises these"),
  // The IconSprite.astro symbol id for this category (« c-sante », « c-domicile »…).
  // The slug does not derive it (services-domicile → c-domicile breaks any simple
  // rule), so it is a required field, not a lookup table living apart from the
  // record it describes: a category added later without one fails the build
  // loudly instead of rendering an invisible empty <svg>.
  icon: z.string().regex(/^c-[a-z]+$/, "icon: a sprite id like « c-sante »"),
});
export type Category = z.infer<typeof categorySchema>;
