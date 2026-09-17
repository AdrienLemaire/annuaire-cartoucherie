import type { Gender } from "../content/schemas";

// The single French forms table. Any second copy of "elle/il" anywhere in the
// project is a defect: the two drift, and the page contradicts itself.
const FORMS = {
  elle: { f: "elle", h: "il" },
  la: { f: "la", h: "le" },
  voisine: { f: "voisine", h: "voisin" },
  inscrite: { f: "inscrite", h: "inscrit" },
  // Third-person plural — src/lib/members.ts's own pluralPronoun, for a group
  // rather than one member: "elles" only if every genre in the group is "f",
  // same all-or-nothing rule memberCountParts already uses for "voisine(s)".
  ils: { f: "elles", h: "ils" },
} as const;

export type Form = keyof typeof FORMS;

/** Agrees one word with a member's gender. « Ce qu'elle propose », « Où la trouver ». */
export function agree(gender: Gender, form: Form): string {
  return FORMS[form][gender];
}
