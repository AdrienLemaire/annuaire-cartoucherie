# Critères de revue des maquettes

Written **before** the variants were delivered, so the comparison judges the variants
rather than rationalising whichever one happens to look prettiest.

Each variant is screenshotted at 390×844 (mobile-first, per spec §1) and scored on the
following. Score 1–5, with a one-line justification each. The winner on a criterion is
not automatically the winner overall — §9 of the spec says the landing surface is a
one-line constant, so the point of this exercise is to harvest ideas, not to crown one.

## 1. Time-to-contact (weight: highest)

Number of taps from a cold landing to a member's `tel:` link, for a visitor who knows
what they want and for one who doesn't. The QR-scan-in-a-shop scenario is the whole
reason this product exists. Count actual taps from the screenshots and markup.

## 2. First-screen comprehension

Does a first-time visitor understand, without scrolling, what this site is and what it
is for? A directory nobody understands in three seconds dies the way the Notion did.

## 3. Legibility and reach

- Contrast of the chosen daisyUI theme on real text, not just headings
- Behaviour at 200% text zoom
- Tap targets ≥ 44px, and whether primary actions sit in the thumb zone
- No horizontal scroll at 360px

## 4. "Soutenir" — do favorites and reviews read as support?

The spec's second purpose is letting residents *show support* for businesses that matter
to them, and payments arrive later. Do favorites and reviews feel like backing a
neighbour, or like rating a restaurant on Google? This is a copy and framing question as
much as a layout one.

## 5. The profile page as the money page

Contact actions, favorite, reviews, sign-in dialog (magic link + passkey), QR download,
« cette fiche n'est pas correcte ». Are they all present, and is their relative priority
defensible? Specifically: does the QR download sit where a *member* would find it without
getting in a *visitor's* way?

## 6. French copy

Natural, warm, unstilted, in the register of a neighbourhood association — not
machine-translated, not marketing filler, not corporate French. Flag any specific line
that a real resident would find odd.

## 7. Aesthetic distinctiveness and coherence

Does it look like somewhere specific — a young, ecological, associative Toulouse
neighbourhood — or like a generic template? Is the direction executed consistently
across all four pages? Achieved within daisyUI rather than by fighting it?

## 8. Scale honesty

Every variant is shown 12 members. The real directory launches with 200. Which parts of
each design break, and which get better, at 200? (Feed scroll depth, category counts,
map pin density, search result ranking.)

## 9. Structural reusability

Which components are good enough to survive into the final variant regardless of which
landing hypothesis wins — the portrait card, the profile header, the filter bar, the
review block, the sign-in dialog, the map sheet?

## Output of the review

`docs/mockups/COMPARAISON.md`:

- A scoring table, variants × criteria
- The strongest single idea in each variant, named precisely enough to be copied
- The clearest mistake in each variant
- An explicit recommendation for the default landing surface, with the reasoning, and a
  note that spec §9 makes this a one-line constant that traffic data can later overturn
- A build order for the final variant: which component comes from where
