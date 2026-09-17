/**
 * Phone formatting, extracted from CallButton's frontmatter where it lived as
 * `"+33" + tel.replace(/\s+/g, "").slice(1)`. Frontmatter binds data; a regex
 * and a format belong here (docs/STANDARDS.md §1).
 */
export function formatTelHref(tel: string): string {
  return `+33${tel.replace(/\D/g, "").slice(1)}`;
}

/** The French reading form: « 06 12 34 56 78 ». */
export function formatTelDisplay(tel: string): string {
  return tel.replace(/\D/g, "").replace(/(\d\d)(?=\d)/g, "$1 ");
}
