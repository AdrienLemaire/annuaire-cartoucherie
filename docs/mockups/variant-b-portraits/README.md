# Variant B — « Les portraits d'abord »

## Hypothesis

The Cartoucherie community already knows this content as a stream of Instagram
portraits published by Sandra — people don't arrive with a query, they arrive
curious, expecting to recognise a neighbour's face before they think of a category.
So every discovery surface in this variant is a portrait, at a different density,
rather than a form to fill in: the landing page is the feed itself, the annuaire is
the same feed made dense and filterable, the map's pins are faces, and the profile
page is simply the long-form version of the Instagram post. Search exists — a slim
field, a modal, a `?q=` handoff between them — but it is deliberately the
second-class citizen: the primary way to "find" someone here is to recognise them.

## Theme: `autumn`

Chosen over `light`/`dark`/`corporate` for a warm, rust-and-cream palette that reads
as editorial rather than SaaS — the primary is a deep terracotta close to Toulouse's
own brick ("la ville rose"), the secondary a warm coral used for the single accent
moment (the "Nouveau portrait" ribbon), and the base is a soft warm grey/cream that
lets photography stay the loudest thing on every screen. It's a light theme, so
large-text and low-vision legibility (brief requirement) stays easy, without
tipping into the beige neutrality the brief warns against.

## Aesthetic direction

Editorial and photo-led: full-bleed 4:5 portraits with a bottom gradient caption
(name in `Fraunces`, an editorial serif, set large; job title small underneath —
human first, trade second), generous rounded corners (2rem on feed cards) instead of
sharp SaaS edges, and warm neutral chrome (navbar, dock, footer) that steps back so
the faces carry the page. `Fraunces` is the only imported font; body text stays on
the system sans stack so nothing competes with the photography for attention.

## The atom: the portrait card

The same recipe — photo, name-before-trade, categories, a way to reach them —
reappears at three densities and I treated getting this right as the actual
deliverable of this variant:

- **Full** (`index.html`, one per screen): 4:5 image, gradient caption, a 44px heart
  toggle over the photo, quick `tel:`/site/Instagram icon buttons, "Voir le
  portrait" CTA.
- **Grid** (`annuaire.html`, 2-up on mobile): square crop, name/trade below, category
  emoji only — no heart, deliberately, see below.
- **Mini** (map popups, the profile's "D'autres portraits" strip, the map's
  thumb-safe list): a round face + name + trade + one action, small enough to sit in
  a `<details>` popover or a carousel item without redesigning anything.

## Interaction decisions worth noticing

1. **The favorite heart lives on the feed and the profile, not the dense grid.**
   Instagram itself doesn't put a like button on every grid tile either — at 2-up
   density a 44px control fights the image for space. Favoriting stays available
   exactly where the brief requires it (the money page) and where there's room to
   do it honestly (the full feed card); the grid stays clean and the whole tile is
   the tap target instead.
2. **The map's real interaction is the list below it, not the pins.** Pins are
   native `<details name="pin">` popovers — zero JS, only-one-open-at-a-time for
   free — anchored per-pin (`left-0`/`right-0`/`center`, `top`/`bottom`) so a popup
   never runs off a 360px viewport; I opened the worst case (upward + left-anchored,
   bottom-left corner) in a temp copy to confirm it doesn't clip. But 44px circles
   scattered on an illustrative map will never be reliably tappable on a real phone,
   so the actual browsing path is the `list` of the same 9 members underneath, every
   row a full 44px+ target with a one-tap `tel:` button. The map is for orientation;
   the list is for doing something.
3. **Search hands off between pages instead of resetting.** The navbar's search icon
   opens a `<dialog>` (not a hero field) on every page; submitting it either jumps to
   `annuaire.html?q=…` or, from inside the annuaire, populates the field in place —
   so the "secondary" search still feels like one system rather than a bolted-on
   afterthought.

## The honest weakness: scroll depth

At 12 members this reads well — the whole feed is a pleasant, curious scroll. At the
spec's 200-member target it would not: `index.html` cannot stay "the landing surface"
if it's a mile of cards, and I did not pretend otherwise by quietly turning it into a
5-card teaser — the brief's own framing ("commit hard") and the fact that the task
explicitly asks for this trade-off to be reported pushed me to show the full feed and
let the cost show. The honest fix belongs to a real backend, not this mockup: rank by
recency/proximity, paginate or infinite-scroll after the first screenful, and let
`annuaire`'s filter chips be the actual way anyone finds member #150. A second real
cost worth flagging: without a real recommendation signal, "Nouveau portrait" is just
the 3 most recently added rows — fine at 12, meaningless noise at 200 unless it's
tied to genuine publish dates and rate-limited so it doesn't tag a third of the
directory "new" forever.

## Files

`index.html` · `annuaire.html` · `membre.html` (Camille Roussel) · `carte.html`
