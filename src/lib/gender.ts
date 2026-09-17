import type { Gender } from "../content/schemas";

// The single French forms table. Any second copy of "elle/il" anywhere in the
// project is a defect: the two drift, and the page contradicts itself.
const FORMS = {
  elle: { f: "elle", h: "il" },
  la: { f: "la", h: "le" },
  voisine: { f: "voisine", h: "voisin" },
  inscrite: { f: "inscrite", h: "inscrit" },
} as const;

export type Form = keyof typeof FORMS;

/** Agrees one word with a member's gender. « Ce qu'elle propose », « Où la trouver ». */
export function agree(gender: Gender, form: Form): string {
  return FORMS[form][gender];
}
