// src/lib/contact.ts
// The one mailto: link shape the project uses to invite a message from a visitor:
// NeedsIndex's "vous connaissez quelqu'un ?" and SiteHeader's "Je veux y figurer"
// both build one (CLAUDE.md "Before you write a new function", step 2 — a second
// caller of the same format moves it here rather than forking it).
import { COPY } from "./copy";

export function mailtoHref(subject: string): string {
  return `mailto:${COPY.contactEmail}?subject=${encodeURIComponent(subject)}`;
}
