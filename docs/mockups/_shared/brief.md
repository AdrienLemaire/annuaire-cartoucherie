# Brief maquettes — Annuaire de la Cartoucherie

**Révision 3.** Revisions 1 and 2 were both rejected by the client as **ugly** — eight
artefacts, two rounds. Revision 3 exists because **the brief was the defect**, not the
agents. Read the post-mortem before anything else; it is the most important section here.

## Post-mortem : ce que les révisions 1 et 2 ont fait de mal

The brief mandated restraint in eight different places — "trustworthy not fashionable",
"restrained depth", "calm", "sobre", "air is the primary design material", "not
editorial", and it explicitly *overrode* the `frontend-design` skill. The agents complied
perfectly. The result was eight variations of the same flat template.

The eight artefacts shared, without any of them being told to:

1. **A cream/beige base.** Both reference apps are crisp **white**. Cream-on-cream reads
   as a 2012 template.
2. **Muted, low-chroma colour everywhere,** because the brief optimised for WCAG ratios
   and called for "calmed", "sourd", "desaturated". Compliance is not harmony.
3. **Zero depth** — `--depth: 0`, "borders and background steps, not shadows". Nextdoor
   puts a soft shadow on every card. Flat boxes inside flat boxes is the wireframe look.
4. **A solid-colour header bar.** All four did it. Nobody asked for it. Both references
   have white headers, with the brand colour in the wordmark and the CTAs only.
5. **Portraits at 56 px.** The faces are the product; they were thumbnails.
6. **A compressed type scale** (26/17/15). No hierarchy, no drama.
7. **Colly nowhere in the interface.** The one distinctive asset the project owns.
8. **The same layout four times,** because the brief prescribed the blocks.

**Therefore, in revision 3: `frontend-design` is the governing instruction, not a
suggestion.** Read `~/.claude/skills/frontend-design/SKILL.md` and follow it. Nothing in
this file overrides it except the hard constraints in "Contraintes techniques" below.

## Ce qui est exigé cette fois

These five are the difference between revision 3 and the two rejected rounds. A
deliverable missing any of them has failed regardless of its other qualities.

1. **Fond blanc.** `base-100` is white or within a hair of it. Warmth comes from the brand
   colour and the photography, not from beige paper.
2. **De la couleur vive.** The brand hues come from the mascot, but at *screen*
   saturation. The mascot sheet is a muted illustration; an interface is not. Vivid colour
   used sparingly beats muted colour spread evenly — commit to a 60/30/10 discipline.
3. **De la profondeur, pour de vrai.** Soft shadows, tinted shadows, rings, layered
   surfaces, gradients where they earn their place. `--depth: 0` is banned.
4. **Les visages en grand.** Portraits are never below 88 px in a list row, and a portrait
   card uses the photograph at full bleed. These people are the product.
5. **Colly apparaît dans l'interface.** At least one designed state on the landing page —
   welcome, empty state, an aside, a corner. Assets in `_shared/colly/`. The one thing this
   project has that no competitor has cannot be absent from the screen.

Also required: a type scale with a **ratio of at least 2.5×** between the largest step and
the 16 px body. 26/17/15 is not a hierarchy.

## Ce qui n'est PAS prescrit

**The composition is yours.** Revision 2 dictated the blocks and the order, so the four
variants differed only in tint. This time nobody tells you what goes where. Invent the
landing page. Invent the profile page. Asymmetry, overlap, full-bleed imagery, an
unexpected grid, a signature graphic device — all fair game if you can defend it.

## Contraintes techniques — celles-ci sont fermes

- **Fichiers HTML statiques.** No build step, no framework, no bundler.
- **Tailwind CSS 4 + daisyUI 5.** Exactly these two tags in every `<head>`:
  ```html
  <link href="https://cdn.jsdelivr.net/npm/daisyui@5" rel="stylesheet" type="text/css" />
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  ```
- **`@theme` works in the browser build — verified.** This is the unlock revision 2 lacked:
  ```html
  <style type="text/tailwindcss">
  @theme { --color-brand-50: oklch(…); --color-brand-500: oklch(…); --color-brand-900: oklch(…); }
  </style>
  ```
  gives you working `bg-brand-50`, `text-brand-700`, `ring-brand-200`, gradients and
  tinted shadows. Full tonal ramps, not ten flat semantic slots. Use them.
- **The daisyUI theme is declared as CSS variables** on `[data-theme="cartoucherie"]`
  (`@plugin "daisyui/theme"` is a no-op in the browser build). Use daisyUI components
  where they genuinely help; do not feel obliged to use `card`/`btn` for everything —
  composing your own from Tailwind utilities is expected wherever it looks better.
- **Icônes : un jeu SVG inline cohérent** (`stroke="currentColor"`). No emoji in
  functional UI.
- **Portraits : les URLs de `members.json`, verbatim.** Real portraits. Each member has a
  `genre` field (`f`/`h`) for French agreement (« Ce qu'**elle** propose »).
- **Google Fonts encouraged.** Pick faces with character. Avoid Inter and system stacks.
- No JavaScript libraries. Inline vanilla JS for filtering and toggles is fine.
- No mapping library.

## Le lecteur

Someone standing in a shop in the Cartoucherie district of Toulouse who has just scanned a
QR code on a paper flyer. Phone, possibly weak connection, possibly in a hurry, possibly
70 years old with system text size increased. The recurring need is one sentence:
**« j'ai besoin de quelqu'un qui fait X. »**

Beautiful and legible are not in tension here. The five requirements above are all
*additive* to legibility — bigger faces, stronger hierarchy, vivid colour on white are
easier to read, not harder.

## Le niveau d'exigence

- **Mobile 390×844 d'abord.** Desktop must not be broken; it is secondary.
- Tap targets ≥ 44 px; primary actions in the thumb zone.
- Body text never below 16 px. Legible at 200 % zoom. No horizontal scroll at 360 px.
- Real `<label>`s, alt text, sensible heading order, visible focus states.
- **Never truncate a member's name.**
- Verify contrast with `_shared/tools/palette.py` rather than guessing. Load-bearing
  information is never low-contrast. But note: *contrast is a floor, not a goal.* Passing
  AAA everywhere while looking like a spreadsheet is the failure mode this revision exists
  to correct.
