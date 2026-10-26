import type { Member } from "../../src/content/schemas";

/** A complete, invented member. Override only the field under test. */
export const member = (over: Partial<Member> = {}): Member => ({
  slug: "x", nom: "X", metier: "Métier", genre: "f", accroche: "", bio: "",
  categories: ["cat"], services: [], adresse: "", distance: "100 m",
  lat: null, lng: null, tel: null, email: null, site: null, instagram: null,
  linkedin: null, avisGoogle: null,
  photo: "x.jpg", note: 0, nbAvis: 0, surCarte: false, carrousel: [], ...over,
});
