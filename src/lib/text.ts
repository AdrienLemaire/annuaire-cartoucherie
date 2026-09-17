// The only normaliser in the project. Search, slug suggestion and any future
// comparison all go through these three functions.

/** NFD-decompose and drop the combining marks: « é » becomes « e ». */
export function stripAccents(s: string): string {
  return s.normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

/** Comparison form: accent-free, lower case, trimmed. Used by the matcher. */
export function normalize(s: string): string {
  return stripAccents(s).toLowerCase().trim();
}

/**
 * Suggests a URL slug for a new row. NOTHING recomputes an existing slug:
 * `slug` is hand-written data because it is printed on QR codes (spec §6).
 */
export function slugify(s: string): string {
  return normalize(s)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
