# Brief — v2 mockups (self-service profiles)

What to mock up, and the rules. The pages are for Adrien to approve before any v2 code
(v2 spec §12). Read, in this order:

1. `docs/superpowers/specs/2026-10-26-v2-self-service-profiles.md` — the v2 spec
2. `docs/superpowers/specs/2026-10-26-v2-profile-fields.md` — every field: the French question,
   required or not, validation, normalisation
3. `docs/mockups/final/README.md` and `docs/mockups/_shared/brief.md` (its post-mortem: the
   first two rounds were rejected as ugly because the brief demanded restraint)
4. `docs/mockups/final/styleguide.html` — **the component authority**. Reuse its blocks
   verbatim; a new component is added there first, in the same `data-bloc` format, with its
   code shown from the same DOM node.
5. `~/.claude/skills/frontend-design/SKILL.md` — governs visual quality
6. `CLAUDE.md` — the copy and colour rules with teeth

## Who these screens are for

A small local entrepreneur, maybe 70, on a phone, maybe unsure of web forms, filling in a
profile that neighbours will see. And Adrien, on a phone or laptop, approving them. Every screen
must feel like the public directory they already know — same white base, teal identity,
Literata headings, Colly — not like a generic SaaS admin.

## Technical format

- Standalone HTML in `docs/mockups/v2/`. Double-click opens it; no server.
- Copy the whole `<head>` foundations block of `docs/mockups/final/membre.html` (fonts,
  daisyUI and Tailwind browser CDN, the `@theme static` colours, the theme variables) verbatim.
  Do not re-derive colours.
- Mobile first at **360 px**. Multi-screen flows are shown as a storyboard: phone-width frames
  side by side on a wide screen, stacked on a narrow one, each frame captioned with its state.
- Fictional people only, from `docs/mockups/_shared/members.json` (Camille Roussel and the
  others). Phone numbers in the fiction range 06 39 98 00 xx. Never a real member.
- No JavaScript beyond what illustrates a state (a toggle, a counter). These are pictures of
  states, not a working app.

## Rules with teeth

- French UI, terse. Help goes in a tappable toggletip, not prose under every field.
- « voisins », never « membres ». « Avis du quartier ».
- French agrees with the person's `genre`: preview copy reads « Ce qu'elle propose ».
- Inputs ≥ 16 px text (iOS zooms otherwise), touch targets ≥ 44 px, visible labels, optional
  fields marked « (facultatif) », errors next to their field in words plus an icon, never colour
  alone.
- Orange and sauge are fills only, never text or icon colour. At most three orange objects on
  any one screen; the primary action of a form step is usually the one that deserves it.
- Never truncate a person's name. Never show a portrait above ×1.4 of its source.
