# Système de couleur — Annuaire de la Cartoucherie

**One system, not four options.** Derived from the Colly character sheet, rebuilt at screen
saturation, on white. Every value below was computed with `_shared/tools/palette.py`; nothing
here was eyeballed and nothing here is out of the sRGB gamut.

Companion page: **`couleurs.html`** — open it, it is the system in thirty seconds.

---

## 1. Le raisonnement

### La relation harmonique : complémentaire chaud/froid, avec deux voisines

The mascot palette is not four unrelated pigments. It is **two analogous pairs facing each
other across the wheel**:

| | hue OKLCH | famille |
|---|---|---|
| teal foncé `#325656` | 196° | froide |
| sauge `#86a79c` | 173° | froide (23° de la teal) |
| crème `#e3d9c1` | 88° | chaude |
| orange `#df8d4f` | 56° | chaude (32° de la crème) |

**196° ↔ 56° = 140° apart.** That is a *split-complementary* interval — the warm/cool tension
of a true complementary (180°) without its vibration. It is the most reliable harmony there
is for an interface, because the cool side can be spread across an entire screen without
fatigue while the warm side stays hot enough to mean "act here".

The two analogous neighbours (sauge beside teal, crème beside orange) are what stop the
palette reading as a two-colour logo. They give each side a *family*: the cool side can go
from teal ink to sage chip without a hue jump, the warm side from a hot CTA to a sand panel.

This is also, precisely, **how Colly is drawn**: a teal-and-sage body, a cream belly, and a
single orange crest on top of the head. The interface is the same picture. The body is the
page; the crest is the « Appeler » button.

### Qui porte l'identité, qui porte la fonction

- **`teal` porte l'identité.** Wordmark, headings, links, icons, the ink. It is on 30 % of
  every screen. Nobody clicks it; everybody recognises it.
- **`orange` porte la fonction.** One job: the action. It is on 10 % of a screen and never
  more. Its scarcity *is* its meaning.
- **`sauge` porte la taxonomie.** Categories, métiers, "ouvert maintenant". A cool colour that
  is not the identity colour, so a chip never competes with a heading.
- **`sable` porte l'illustration.** Colly's panels, empty states, the warm surface. Fill-only
  in its light half — see §9.
- **`neutre` porte la structure.** White, borders, surfaces, and 90 % of the type.
- **`rouge` est le seul ajout.** Error has no honest substitute inside a teal/orange palette;
  see §6.

### Ce qui a changé par rapport à la planche

| | planche | ici | facteur |
|---|---|---|---|
| teal | `C 0.042 @ L 42.6` | `C 0.074 @ L 44` | ×1.8 |
| sauge | `C 0.040 @ L 70` | `C 0.100 @ L 73` | ×2.5 |
| orange | `C 0.127 @ L 71.6` | `C 0.170 @ L 72` | ×1.3 |
| crème | `C 0.034 @ L 88.7` | `C 0.064 @ L 88.0` (`sable-300`) | ×1.9, **et jamais le fond** |

The teal at `C 0.042` is a grey with an opinion. At `C 0.074` — which is **the sRGB ceiling
for hue 197 at that lightness**, there is no more to take — it is unmistakably teal on a phone
in daylight. That ceiling is the whole reason the orange has to carry the vividness: cyan-teal
is the poorest region of sRGB, orange one of the richest.

---

## 2. Les rampes tonales

Designed, not interpolated. Two rules govern every ramp:

1. **Chroma follows a peak, not a line.** Chroma rises with saturation to a maximum at 500–600
   (where the hue is most itself) and falls again into the darks, because a dark tone at full
   chroma reads as plastic. Lightness travels ~80 points; chroma travels up and back.
2. **Hue torques.** Lights drift toward the warmer/brighter neighbour, darks toward the cooler
   one — the way a real pigment behaves when you thin it or load it. Orange runs 75° → 36°
   across its ramp; teal runs 198° → 201°. Naive ramps hold hue constant and look dead in the
   tints.

### `teal` — identité (hue 195–201)

| step | OKLCH | hex |
|---|---|---|
| 50 | `oklch(98.0% 0.010 198)` | `#f1fbfb` |
| 100 | `oklch(95.5% 0.022 197)` | `#e0f5f5` |
| 200 | `oklch(91.0% 0.040 196)` | `#c4eaea` |
| 300 | `oklch(84.0% 0.058 195)` | `#9ed7d6` |
| 400 | `oklch(74.0% 0.080 195)` | `#69bbba` |
| 500 | `oklch(63.0% 0.098 196)` | `#279b9c` |
| 600 | `oklch(53.0% 0.090 196)` | `#027c7d` |
| **700** | `oklch(44.0% 0.074 197)` | **`#035f61`** ← `--color-primary` |
| 800 | `oklch(35.0% 0.060 198)` | `#004446` |
| 900 | `oklch(27.0% 0.045 199)` | `#012d2f` |
| 950 | `oklch(19.0% 0.030 201)` | `#021819` |

### `orange` — action (hue 75–36)

| step | OKLCH | hex |
|---|---|---|
| 50 | `oklch(97.8% 0.018 75)` | `#fff6eb` |
| 100 | `oklch(95.0% 0.042 72)` | `#ffebd0` |
| 200 | `oklch(90.0% 0.078 68)` | `#ffd5a7` |
| 300 | `oklch(84.0% 0.110 64)` | `#fdbb7c` |
| 400 | `oklch(78.0% 0.145 60)` | `#fa9f4d` |
| **500** | `oklch(72.0% 0.170 56)` | **`#f28318`** ← `--color-accent`, le CTA |
| 600 | `oklch(65.0% 0.178 50)` | `#e16600` |
| 700 | `oklch(56.0% 0.172 44)` | `#c24700` |
| 800 | `oklch(46.0% 0.140 40)` | `#953307` |
| 900 | `oklch(37.0% 0.108 38)` | `#6d250d` |
| 950 | `oklch(27.0% 0.078 36)` | `#451407` |

### `sauge` — taxonomie (hue 170–150)

| step | OKLCH | hex |
|---|---|---|
| 50 | `oklch(97.5% 0.012 170)` | `#effaf5` |
| **100** | `oklch(94.5% 0.026 170)` | **`#ddf3ea`** ← `--color-secondary` |
| 200 | `oklch(89.5% 0.050 170)` | `#bde8d7` |
| 300 | `oklch(82.0% 0.074 168)` | `#94d4bb` |
| 400 | `oklch(73.0% 0.100 164)` | `#66bc97` |
| 500 | `oklch(64.0% 0.120 160)` | `#3aa273` |
| 600 | `oklch(54.5% 0.122 156)` | `#1c8451` |
| **700** | `oklch(45.5% 0.108 152)` | **`#176737`** ← `--color-success` |
| 800 | `oklch(37.0% 0.088 150)` | `#134c25` |
| 900 | `oklch(29.0% 0.066 152)` | `#0a341a` |
| 950 | `oklch(20.5% 0.044 156)` | `#031d0e` |

The hue torque here is functional as well as optical: the ramp starts at the mascot's sage
(170°) and rotates to a frank green (150°) in the darks, which buys the separation from `teal`
that a status colour needs. See §6.

### `sable` — la crème, illustration (hue 95–75)

| step | OKLCH | hex | |
|---|---|---|---|
| 50 | `oklch(98.2% 0.010 95)` | `#fbf9f2` | remplissage seul |
| 100 | `oklch(96.0% 0.024 93)` | `#f7f2e0` | remplissage seul |
| 200 | `oklch(92.5% 0.044 91)` | `#f1e6c6` | remplissage seul |
| 300 | `oklch(88.0% 0.064 90)` | `#e8d6a8` | remplissage seul — la crème de la planche, à la même clarté |
| 400 | `oklch(82.0% 0.090 89)` | `#dcc27f` | remplissage seul |
| **500** | `oklch(76.0% 0.115 88)` | **`#d0ad54`** | `--color-warning` — remplissage seul |
| 600 | `oklch(68.0% 0.118 86)` | `#b99235` | remplissage seul |
| 700 | `oklch(57.5% 0.105 83)` | `#977221` | texte ≥ 18.66 px gras |
| 800 | `oklch(47.0% 0.088 80)` | `#745415` | texte |
| 900 | `oklch(37.5% 0.068 78)` | `#553c10` | texte |
| 950 | `oklch(27.0% 0.048 75)` | `#342308` | texte |

### `neutre` — structure (hue 197–202, teintée teal)

| step | OKLCH | hex | rôle |
|---|---|---|---|
| — | `oklch(100% 0 0)` | `#ffffff` | `base-100`, la page |
| 50 | `oklch(98.6% 0.004 200)` | `#f7fbfb` | surface levée à l'intérieur d'une carte |
| 100 | `oklch(97.2% 0.006 199)` | `#f1f7f7` | `base-200`, bandes de section |
| 200 | `oklch(94.4% 0.008 198)` | `#e7eeee` | `base-300`, séparateurs pleins |
| 300 | `oklch(89.8% 0.010 198)` | `#d6dfe0` | filets, bordures décoratives |
| 400 | `oklch(79.5% 0.013 197)` | `#b3bfbf` | icônes désactivées |
| 500 | `oklch(66.5% 0.016 197)` | `#899797` | **bordure de champ** (3.03:1, seuil 1.4.11) |
| 600 | `oklch(54.5% 0.019 198)` | `#647474` | métadonnées |
| 700 | `oklch(44.0% 0.022 199)` | `#455657` | texte secondaire |
| 800 | `oklch(34.0% 0.025 200)` | `#283c3d` | texte |
| **900** | `oklch(25.5% 0.028 201)` | **`#112728`** | `base-content`, le corps de texte |
| 950 | `oklch(17.5% 0.030 202)` | `#001416` | ombres, encre maximale |

### `rouge` — erreur (hue 25–16)

| step | OKLCH | hex |
|---|---|---|
| 50 | `oklch(97.6% 0.014 25)` | `#fff4f2` |
| 100 | `oklch(94.6% 0.029 24)` | `#ffe6e4` |
| 200 | `oklch(89.0% 0.057 24)` | `#ffcdc9` |
| 300 | `oklch(81.0% 0.100 24)` | `#fba7a1` |
| 400 | `oklch(70.0% 0.150 25)` | `#ed756e` |
| 500 | `oklch(62.0% 0.190 26)` | `#e24945` |
| **600** | `oklch(54.0% 0.205 24)` | **`#cb1b2c`** ← `--color-error` |
| 700 | `oklch(46.0% 0.180 22)` | `#a50b25` |
| 800 | `oklch(38.0% 0.145 20)` | `#7e0a1f` |
| 900 | `oklch(31.0% 0.115 18)` | `#5d0819` |
| 950 | `oklch(22.0% 0.080 16)` | `#37040d` |

---

## 3. Les neutres — blanc, puis des gris teintés teal

**`base-100` is `#ffffff`. Not "near white". White.** Revisions 1 and 2 died on a cream page;
there is no version of this system where the page is beige.

**The tint is `teal`, hue 197–202, at chroma 0.004 → 0.030** — one twentieth of the primary's
chroma at the light end, one quarter at the ink end. Rationale:

- A pure `oklch(L 0 0)` grey placed beside `teal-700` looks *dirty*, not neutral: the eye
  reads the grey as slightly pink by simultaneous contrast with the teal. Tinting the greys
  along the primary's own hue removes the induced complement and the whole surface reads clean.
- Tinting them **cool** rather than warm is deliberate, and it is the correction of revision 2.
  A warm grey at *any* chroma is a cream page in miniature — `#eeebe7` beside a white card
  reads as greige, and this client has already rejected exactly that. `#e7eeee` beside a white
  card reads as *air*, which is what Nextdoor and AlloVoisins actually do.
- Warmth in this system comes from three places only, all of them intentional: the orange, the
  `sable` panel, and the photography. Never from the paper.
- The chroma **ramps up as the tone darkens** (0.004 at 50, 0.030 at 950) so the ink belongs
  to the brand — `#112728` set at 16 px reads as black to a reader and as teal to a designer.
  That is the whole trick.

---

## 4. La règle 60 / 30 / 10

Countable, not vibes.

**60 % — blanc.** `base-100` `#ffffff`, plus `neutre-50/100/200` for section bands, sheets and
the inside of cards. The page is white. Photography sits directly on it.

**30 % — la famille froide.** All type (`neutre-800/900` is teal ink), headings in `teal-800`,
links in `teal-700`, icons in `teal-600`, category chips in `sauge-100`/`sauge-800`, hairlines
in `neutre-300`, card shadows tinted `neutre-950`. This is where the identity lives, and it is
allowed to be everywhere, because at `C ≤ 0.030` in the neutrals and `C ≤ 0.108` in the
chips, nothing shouts.

**10 % — l'orange, plus un panneau `sable`.** On any one screen the warm side gets exactly:

1. **the « Appeler » button** — filled `orange-500`;
2. **one selected state** — the active filter, the active tab, the current page dot;
3. **one 3 px signature hairline** — `--gradient-filet`, under the header or a section title;
4. **at most one `sable-100` panel** — Colly's corner, an empty state, the welcome aside.

> **Le test.** Point at every orange thing on the screen. If you count four, delete one. If
> you count zero, the screen has no action on it and something is wrong.

Forbidden for orange, without exception: a header bar, a section background, a card
background, body text, an icon that is not inside the CTA, a link.

---

## 5. Le CTA — la seule décision qui compte

```
fond   orange-500   oklch(72% 0.170 56)   #f28318
texte  teal-950     oklch(19% 0.030 201)  #021819
                                          → 7.00:1   AAA
```

**A hot orange pill with near-black teal lettering.** Not white lettering.

The reasoning, and it is the one place where "beautiful first" and "compliant" actually pull
against each other:

- To carry **white** text at AA, an orange must drop to `L ≈ 56 %` (`orange-700` `#c24700`,
  5.01:1). At that lightness hue 44–50 is no longer orange, it is **rust** — and rust on white
  is the universal colour of a *warning*, not of a phone call. It also stops being Colly's
  crest, which is the whole point of choosing it.
- Keeping the orange at its screen-vivid `L 72 / C 0.170` and inverting the label to the
  darkest brand teal gives **7.00:1 — AAA** — a better ratio than the white-on-rust option, on
  a far more vivid button. Beauty and compliance land on the same answer once you stop
  assuming the label must be white.
- Dark-on-warm also reads as *physical*: a painted sign, a market awning. Correct register for
  a directory that wants to feel like a neighbour, not like a SaaS.

### États

| état | fond | texte | ratio | |
|---|---|---|---|---|
| repos | `orange-500` `#f28318` | `teal-950` | **7.00** | AAA |
| survol | `orange-400` `#fa9f4d` | `teal-950` | **8.83** | AAA — le survol *éclaircit* |
| enfoncé | `orange-600` `#e16600` | `teal-950` | **5.32** | AA — l'appui *assombrit* |
| désactivé | `neutre-200` `#e7eeee` | `neutre-600` `#647474` | 4.16 | AA-large — les commandes désactivées sont exemptées du 1.4.3 |

Hover lightens and press darkens: the button behaves like a lit physical object, which is
worth more than a generic opacity change.

### Recette

```html
<a href="tel:+33..." class="inline-flex items-center gap-2 rounded-full
   px-6 py-3.5 min-h-[52px] text-[17px] font-bold tracking-tight
   bg-gradient-to-b from-orange-400 via-orange-500 to-orange-600
   text-teal-950 ring-1 ring-inset ring-orange-700/60
   shadow-cta transition
   hover:from-orange-300 hover:via-orange-400 hover:to-orange-500
   active:from-orange-500 active:via-orange-600 active:to-orange-600
   active:translate-y-px active:shadow-cta-press
   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600
   focus-visible:ring-offset-2 focus-visible:ring-offset-white">
  <svg …/> Appeler
</a>
```

Two details that are not decoration:

- **`ring-1 ring-inset ring-orange-700/60`.** `orange-500` against white is only 2.61:1, so the
  *silhouette* of the button is soft even though its label is AAA. A one-pixel `orange-700`
  edge (5.01:1 on white) gives the pill a crisp boundary and satisfies 1.4.11 for the control
  outline. It also just looks better — it is the ink line around a painted shape.
- **The focus ring is `teal-600`, offset onto white, always.** Never orange-on-orange. One
  rule, no per-surface exception, and it works on every background in the system because the
  2 px white offset guarantees `teal-600` sits on `#ffffff` (5.02:1).

---

## 6. Les couleurs sémantiques

They are not bolted on: three of the four are brand ramps doing a second job.

| rôle | valeur | contenu | ratio | source |
|---|---|---|---|---|
| `info` | `teal-600` `#027c7d` | `#ffffff` | 5.02 AA | la teal — *l'information parle avec la voix de la marque* |
| `success` | `sauge-700` `#176737` | `#ffffff` | 6.93 AA | la sauge, poussée au vert franc |
| `warning` | `sable-500` `#d0ad54` | `teal-950` `#021819` | 8.53 AAA | la crème, poussée à l'ocre |
| `error` | `rouge-600` `#cb1b2c` | `#ffffff` | 5.63 AA | **le seul ajout hors mascotte** |

`info = teal-600` and not `teal-500`: a designer *will* eventually write `text-info`, and
`teal-500` on white is 3.36:1. `teal-600` survives both `bg-info` and `text-info` (5.02:1 in
both directions). Given this project's history with fill-only traps, that is worth the small
loss of brightness.

**Why a red at all.** There is no honest error colour inside a 56°/196° palette. Using the
orange for error would destroy the CTA's meaning; using a deep sable would be unreadable as
danger. `rouge` at hue 24 is a crimson rather than a tomato, which keeps it as far from the
CTA as a red can get while still reading instantly as *erreur*.

### Preuve : le CTA et l'erreur ne peuvent pas être confondus

```
orange-500  L 72.0 %   C 0.170   h 56°    #f28318
rouge-600   L 54.0 %   C 0.205   h 24°    #cb1b2c

ΔL = 18.0 points        Δh = 32°        ΔC = 0.035
ΔE(OKLab) = 0.210  ≈ 11 JND  (seuil de discrimination ≈ 0.02)
```

Eleven just-noticeable differences apart, with the lightness difference alone (18 points)
larger than a whole step of either ramp. They also differ on the axis that survives protanopia
and deuteranopia — lightness — which a red/orange pair distinguished by hue alone would not.

**And structurally**, so the proof does not depend on the eye: the error colour never appears
as a large filled pill. It appears as (a) `rouge-700` text with an icon, (b) a `rouge-100`
band with a 3 px `rouge-600` left rule, (c) a 1 px field border. The CTA is the only large
filled warm object in the interface.

Two more separations that were checked and are fine:

- `warning` `sable-500` vs the CTA `orange-500`: ΔE = 0.103 ≈ 5 JND, Δh 32°. Same warm family
  by design — but `warning` is a tinted band with dark ink, never a pill, so the roles never
  collide.
- `success` `sauge-700` vs `primary` `teal-700`: ΔE = 0.078 ≈ 4 JND, Δh 45°. Separated further
  by role: **`secondary` is always tinted (`sauge-100` bg / `teal-950` text, 15.76:1),
  `success` is always solid (`sauge-700` / white).** A category chip and a success badge are
  never the same shape, never the same weight, never the same lightness.

---

## 7. La profondeur — réactivée, et spécifiée

`--depth: 1`. Shadows are back. **They are tinted, never black.** A black shadow under a card
on a teal-tinted white is a grey smudge; a shadow tinted with `neutre-950`
`oklch(17.5% 0.030 202)` reads as *shade*, the same way a shadow outdoors is blue.

### Ombres

| token | valeur | usage |
|---|---|---|
| `--shadow-carte` | `0 1px 2px oklch(17.5% .03 202/.05), 0 4px 12px -2px oklch(17.5% .03 202/.09)` | toute carte membre, toute tuile « Je cherche… » |
| `--shadow-carte-hover` | `0 2px 4px oklch(17.5% .03 202/.06), 0 14px 32px -8px oklch(17.5% .03 202/.16)` | survol / focus d'une carte cliquable |
| `--shadow-flottant` | `0 4px 8px oklch(17.5% .03 202/.06), 0 28px 64px -20px oklch(17.5% .03 202/.28)` | feuille de contact, modale, barre d'action collante |
| `--shadow-cta` | `0 2px 4px oklch(37% .108 38/.28), 0 10px 24px -8px oklch(37% .108 38/.38)` | **le bouton « Appeler » uniquement** — ombre tintée `orange-900`, chaude sous un objet chaud |
| `--shadow-cta-press` | `0 1px 2px oklch(37% .108 38/.34)` | état enfoncé |

Rule: a shadow's hue always comes from the object above it, never from the surface below.

### Anneaux

| token | valeur | usage |
|---|---|---|
| `--ring-focus` | `2px solid teal-600` + `2px` offset `#ffffff` | **tout** focus visible, sans exception |
| `--ring-carte` | `inset 0 0 0 1px oklch(17.5% .03 202/.07)` | liseré d'une carte, sous l'ombre — la tient nette sur photo |
| `--ring-cta` | `inset 0 0 0 1px orange-700/60` | contour du CTA (§5) |
| `--ring-actif` | `2px solid orange-500` | l'unique état sélectionné autorisé en orange |

### Dégradés sanctionnés — quatre, pas cinq

| token | valeur | où |
|---|---|---|
| `--gradient-aube` | `linear-gradient(168deg, teal-50 0%, #ffffff 44%, orange-50 100%)` | le lavis derrière le héros de l'accueil. 4 points de L d'amplitude : atmosphérique, jamais visible comme « un dégradé ». |
| `--gradient-cta` | `linear-gradient(180deg, orange-400, orange-500 55%, orange-600)` | le bouton « Appeler » — 13 points de L, il donne au galet une lumière du haut |
| `--gradient-colly` | `radial-gradient(120% 90% at 30% 15%, sable-100, sauge-100 62%, teal-100)` | le panneau d'illustration où vit Colly |
| `--gradient-filet` | `linear-gradient(90deg, teal-600, sauge-500 46%, orange-500)` | **le dispositif signature** : un filet de 3 px sous l'en-tête blanc et sous un titre de section. Il rend l'harmonie visible dans le produit, et il remplace la barre d'en-tête colorée qui a fait échouer les révisions 1 et 2. |

Interdits : tout dégradé derrière du texte de moins de 24 px ; tout dégradé de surface de plus
de 6 points de lightness ; tout dégradé à trois hues qui n'est pas `--gradient-filet`.

### Élévation, en trois marches

0. **plat** — bandes de section `neutre-100`, séparées par la couleur seule.
1. **carte** — `#ffffff` + `--ring-carte` + `--shadow-carte`. Le défaut.
2. **flottant** — `#ffffff` + `--shadow-flottant`. Feuilles, modales, barre d'appel collante.

Never nest elevation 1 inside elevation 1. That is the flat-boxes-in-flat-boxes look with a
shadow on it.

---

## 8. Le code, à coller

### Tailwind — `@theme`

```html
<style type="text/tailwindcss">
@theme {
  /* ── teal · identité ─────────────────────────────────────── */
  --color-teal-50:  oklch(98.0% 0.010 198);
  --color-teal-100: oklch(95.5% 0.022 197);
  --color-teal-200: oklch(91.0% 0.040 196);
  --color-teal-300: oklch(84.0% 0.058 195);
  --color-teal-400: oklch(74.0% 0.080 195);
  --color-teal-500: oklch(63.0% 0.098 196);
  --color-teal-600: oklch(53.0% 0.090 196);
  --color-teal-700: oklch(44.0% 0.074 197);
  --color-teal-800: oklch(35.0% 0.060 198);
  --color-teal-900: oklch(27.0% 0.045 199);
  --color-teal-950: oklch(19.0% 0.030 201);

  /* ── orange · action ─────────────────────────────────────── */
  --color-orange-50:  oklch(97.8% 0.018 75);
  --color-orange-100: oklch(95.0% 0.042 72);
  --color-orange-200: oklch(90.0% 0.078 68);
  --color-orange-300: oklch(84.0% 0.110 64);
  --color-orange-400: oklch(78.0% 0.145 60);
  --color-orange-500: oklch(72.0% 0.170 56);
  --color-orange-600: oklch(65.0% 0.178 50);
  --color-orange-700: oklch(56.0% 0.172 44);
  --color-orange-800: oklch(46.0% 0.140 40);
  --color-orange-900: oklch(37.0% 0.108 38);
  --color-orange-950: oklch(27.0% 0.078 36);

  /* ── sauge · taxonomie ───────────────────────────────────── */
  --color-sauge-50:  oklch(97.5% 0.012 170);
  --color-sauge-100: oklch(94.5% 0.026 170);
  --color-sauge-200: oklch(89.5% 0.050 170);
  --color-sauge-300: oklch(82.0% 0.074 168);
  --color-sauge-400: oklch(73.0% 0.100 164);
  --color-sauge-500: oklch(64.0% 0.120 160);
  --color-sauge-600: oklch(54.5% 0.122 156);
  --color-sauge-700: oklch(45.5% 0.108 152);
  --color-sauge-800: oklch(37.0% 0.088 150);
  --color-sauge-900: oklch(29.0% 0.066 152);
  --color-sauge-950: oklch(20.5% 0.044 156);

  /* ── sable · illustration (50→600 : remplissage seul) ────── */
  --color-sable-50:  oklch(98.2% 0.010 95);
  --color-sable-100: oklch(96.0% 0.024 93);
  --color-sable-200: oklch(92.5% 0.044 91);
  --color-sable-300: oklch(88.0% 0.064 90);
  --color-sable-400: oklch(82.0% 0.090 89);
  --color-sable-500: oklch(76.0% 0.115 88);
  --color-sable-600: oklch(68.0% 0.118 86);
  --color-sable-700: oklch(57.5% 0.105 83);
  --color-sable-800: oklch(47.0% 0.088 80);
  --color-sable-900: oklch(37.5% 0.068 78);
  --color-sable-950: oklch(27.0% 0.048 75);

  /* ── neutre · structure, teintée teal ────────────────────── */
  --color-neutre-50:  oklch(98.6% 0.004 200);
  --color-neutre-100: oklch(97.2% 0.006 199);
  --color-neutre-200: oklch(94.4% 0.008 198);
  --color-neutre-300: oklch(89.8% 0.010 198);
  --color-neutre-400: oklch(79.5% 0.013 197);
  --color-neutre-500: oklch(66.5% 0.016 197);
  --color-neutre-600: oklch(54.5% 0.019 198);
  --color-neutre-700: oklch(44.0% 0.022 199);
  --color-neutre-800: oklch(34.0% 0.025 200);
  --color-neutre-900: oklch(25.5% 0.028 201);
  --color-neutre-950: oklch(17.5% 0.030 202);

  /* ── rouge · erreur ──────────────────────────────────────── */
  --color-rouge-50:  oklch(97.6% 0.014 25);
  --color-rouge-100: oklch(94.6% 0.029 24);
  --color-rouge-200: oklch(89.0% 0.057 24);
  --color-rouge-300: oklch(81.0% 0.100 24);
  --color-rouge-400: oklch(70.0% 0.150 25);
  --color-rouge-500: oklch(62.0% 0.190 26);
  --color-rouge-600: oklch(54.0% 0.205 24);
  --color-rouge-700: oklch(46.0% 0.180 22);
  --color-rouge-800: oklch(38.0% 0.145 20);
  --color-rouge-900: oklch(31.0% 0.115 18);
  --color-rouge-950: oklch(22.0% 0.080 16);

  /* ── profondeur ──────────────────────────────────────────── */
  --shadow-carte:       0 1px 2px oklch(17.5% .03 202/.05), 0 4px 12px -2px oklch(17.5% .03 202/.09);
  --shadow-carte-hover: 0 2px 4px oklch(17.5% .03 202/.06), 0 14px 32px -8px oklch(17.5% .03 202/.16);
  --shadow-flottant:    0 4px 8px oklch(17.5% .03 202/.06), 0 28px 64px -20px oklch(17.5% .03 202/.28);
  --shadow-cta:         0 2px 4px oklch(37% .108 38/.28), 0 10px 24px -8px oklch(37% .108 38/.38);
  --shadow-cta-press:   0 1px 2px oklch(37% .108 38/.34);
}
</style>
```

`bg-teal-50`, `text-teal-700`, `ring-sauge-200`, `shadow-carte`, `from-orange-400`,
`hover:shadow-carte-hover` — all of it works in the browser build.

### daisyUI — `[data-theme="cartoucherie"]`

```html
<style type="text/tailwindcss">
[data-theme="cartoucherie"] {
  color-scheme: light;

  --color-base-100:          #ffffff;                 /* la page, blanche  */
  --color-base-200:          oklch(97.2% 0.006 199);  /* neutre-100        */
  --color-base-300:          oklch(94.4% 0.008 198);  /* neutre-200        */
  --color-base-content:      oklch(25.5% 0.028 201);  /* neutre-900        */

  --color-primary:           oklch(44.0% 0.074 197);  /* teal-700          */
  --color-primary-content:   #ffffff;

  --color-secondary:         oklch(94.5% 0.026 170);  /* sauge-100 teinté  */
  --color-secondary-content: oklch(19.0% 0.030 201);  /* teal-950          */

  --color-accent:            oklch(72.0% 0.170 56);   /* orange-500 · CTA  */
  --color-accent-content:    oklch(19.0% 0.030 201);  /* teal-950          */

  --color-neutral:           oklch(25.5% 0.028 201);  /* neutre-900        */
  --color-neutral-content:   oklch(98.6% 0.004 200);  /* neutre-50         */

  --color-info:              oklch(53.0% 0.090 196);  /* teal-600          */
  --color-info-content:      #ffffff;

  --color-success:           oklch(45.5% 0.108 152);  /* sauge-700         */
  --color-success-content:   #ffffff;

  --color-warning:           oklch(76.0% 0.115 88);   /* sable-500         */
  --color-warning-content:   oklch(19.0% 0.030 201);  /* teal-950          */

  --color-error:             oklch(54.0% 0.205 24);   /* rouge-600         */
  --color-error-content:     #ffffff;

  --radius-selector: 2rem;      /* pastilles, bascules, badges */
  --radius-field:    0.75rem;   /* champs, boutons             */
  --radius-box:      1.25rem;   /* cartes, modales, feuilles   */
  --size-selector:   0.28125rem;
  --size-field:      0.28125rem;
  --border:          1px;
  --depth:           1;
  --noise:           0;
}
</style>
```

Set `<html data-theme="cartoucherie">`.

**Deux pièges, tous les deux dans le même sens.**

`--color-secondary` is a **tint** — `sauge-100` `#ddf3ea`, 1.16:1 on white. It exists to be a
*background* (`bg-secondary` with `text-secondary-content`, 15.76:1 — the category chip). Every
daisyUI utility that puts `secondary` in the *foreground* is therefore forbidden:
`text-secondary`, `link-secondary`, `checkbox-secondary`, `radio-secondary`,
`toggle-secondary`, `progress-secondary`. Use `…-primary` for controls and `text-sauge-800`
for text. See §10.

And: `--color-primary` is the **teal**, not the orange, even
though the orange is the primary *action*. `btn-primary` is the teal button; the « Appeler »
button is `btn-accent` (or the recipe in §5). This mapping exists so that `text-primary`,
`link-primary`, `checkbox-primary`, `progress-primary` all land on a colour that is legible on
white — `text-accent` would be 2.61:1.

---

## 9. Le tableau des contrastes

Computed with `_shared/tools/palette.py`. Every pair a designer will actually type.

### Texte sur le fond blanc

| avant-plan | ratio | | usage |
|---|---|---|---|
| `neutre-900` `#112728` | **15.62** | AAA | corps de texte — `base-content` |
| `neutre-800` `#283c3d` | **11.64** | AAA | texte secondaire fort |
| `neutre-700` `#455657` | **7.72** | AAA | légendes, métadonnées denses |
| `neutre-600` `#647474` | **4.89** | AA | métadonnées ≥ 16 px |
| `neutre-500` `#899797` | 3.03 | AA-large | **désactivé uniquement** |
| `teal-800` `#004446` | **10.96** | AAA | titres |
| `teal-700` `#035f61` | **7.46** | AAA | liens — `text-primary` |
| `teal-600` `#027c7d` | **5.02** | AA | lien survolé — `text-info` |
| `sauge-700` `#176737` | **6.93** | AA | `text-success` |
| `sauge-600` `#1c8451` | 4.70 | AA | ≥ 16 px seulement |
| `sable-800` `#745415` | **6.95** | AA | ocre lisible |
| `orange-800` `#953307` | **7.62** | AAA | orange lisible en texte |
| `rouge-700` `#a50b25` | **7.85** | AAA | `text-error` |

### Paires daisyUI `X` / `X-content`

| paire | ratio | |
|---|---|---|
| `primary-content` #ffffff sur `primary` `#035f61` | **7.46** | AAA |
| `secondary-content` `#021819` sur `secondary` `#ddf3ea` | **15.76** | AAA |
| **`accent-content` `#021819` sur `accent` `#f28318`** | **7.00** | **AAA** |
| `neutral-content` `#f7fbfb` sur `neutral` `#112728` | **14.98** | AAA |
| `base-content` `#112728` sur `base-100` `#ffffff` | **15.62** | AAA |
| `base-content` sur `base-200` `#f1f7f7` | **14.42** | AAA |
| `base-content` sur `base-300` `#e7eeee` | **13.28** | AAA |
| `info-content` #ffffff sur `info` `#027c7d` | **5.02** | AA |
| `success-content` #ffffff sur `success` `#176737` | **6.93** | AA |
| `warning-content` `#021819` sur `warning` `#d0ad54` | **8.53** | AAA |
| `error-content` #ffffff sur `error` `#cb1b2c` | **5.63** | AA |

### Le CTA, tous états

| | ratio | |
|---|---|---|
| `teal-950` sur `orange-400` (survol) | **8.83** | AAA |
| `teal-950` sur `orange-500` (repos) | **7.00** | AAA |
| `teal-950` sur `orange-600` (enfoncé) | **5.32** | AA |
| `orange-700` liseré vs blanc (contour 1.4.11) | **5.01** | AA |
| `teal-600` anneau de focus vs blanc (1.4.11) | **5.02** | AA |
| `orange-500` aire du bouton vs blanc | 2.61 | *décoratif — le contour porte le seuil* |

### Surfaces teintées

| avant-plan sur fond | ratio | |
|---|---|---|
| `teal-900` sur `teal-100` | **13.08** | AAA |
| `teal-800` sur `teal-50` | **10.41** | AAA |
| `teal-950` sur `teal-200` | **14.21** | AAA |
| `sauge-800` sur `sauge-100` — la pastille catégorie | **8.66** | AAA |
| `sauge-900` sur `sauge-200` | **10.33** | AAA |
| `orange-900` sur `orange-100` | **9.40** | AAA |
| `orange-800` sur `orange-50` | **7.13** | AAA |
| `sable-900` sur `sable-200` — le bandeau `warning` | **8.27** | AAA |
| `teal-950` sur `sable-100` — le panneau Colly | **16.33** | AAA |
| `teal-700` lien sur `sable-100` | **6.66** | AA |
| `rouge-800` sur `rouge-100` | **9.07** | AAA |
| `neutre-600` sur `base-200` | **4.52** | AA |
| `teal-700` sur `base-200` | **6.89** | AA |

### Bordures et filets — non textuels

| | ratio vs blanc | |
|---|---|---|
| `neutre-200` `#e7eeee` | 1.18 | filet décoratif seul |
| `neutre-300` `#d6dfe0` | 1.36 | séparateur de liste — décoratif |
| **`neutre-500` `#899797`** | **3.03** | **bordure de champ de saisie** — le seuil 1.4.11 |
| `teal-600` `#027c7d` | 5.02 | bordure de champ actif |
| `rouge-600` `#cb1b2c` | 5.63 | bordure de champ en erreur |

> A form field bordered `neutre-300` is invisible to a 70-year-old on a phone in daylight.
> **Input borders are `neutre-500`.** List separators may stay `neutre-300`; they carry no
> information.

---

## 10. ⚠ Remplissage seul — ne jamais utiliser en texte

The trap that has already bitten this project once. These are the exact utilities that must
never appear in a deliverable:

| interdit | ratio sur blanc | à la place |
|---|---|---|
| `text-accent` / `text-orange-500` | 2.61 | `text-orange-800` (7.62) |
| `text-orange-300/400/500/600` | ≤ 3.44 | `text-orange-800` |
| `text-warning` / `text-sable-500` | 2.15 | `text-sable-800` (6.95) |
| `text-sable-50 → 600` | ≤ 2.91 | `text-sable-800` |
| `text-teal-300/400/500` | ≤ 3.36 | `text-teal-700` (7.46) |
| `text-sauge-300/400/500` | ≤ 3.19 | `text-sauge-700` (6.93) |
| `text-neutre-300/400/500` | ≤ 3.03 | `text-neutre-600` (4.89) |
| `text-rouge-300/400/500` | ≤ 3.98 | `text-rouge-700` (7.85) |
| `bg-accent` avec autre chose que `text-teal-950` | — | `text-teal-950` |
| **`text-secondary` / `link-secondary`** | **1.16** | `text-sauge-800` (8.66 sur `bg-secondary`) |
| **`checkbox-secondary`, `radio-secondary`, `toggle-secondary`, `progress-secondary`** | 1.16 | `…-primary` (teal) ou `…-success` |

Rule of thumb, and it holds for every ramp in this system: **steps 50 → 500 are fills.
Steps 700 → 950 are ink. Step 600 is ink only for `teal`, `sauge`, `neutre` and `rouge`
(never for `orange` or `sable`).**

---

## 11. Ce que j'ai gardé, ce que j'ai abandonné

**Gardé :** the four hue positions of the mascot, all of them, within a few degrees. Colly's
teal body, sage limbs, cream belly and orange crest are all still on screen. Anyone holding
the character sheet next to the app will read them as one family.

**Abandonné : la crème comme surface.** `#e3d9c1` is not `base-100` and never will be — that is
the single change that separates this revision from the two that were rejected. The crème
survives in two places, both of them bounded:

1. `sable-100/200` as an **illustration panel** — Colly's corner, an empty state, the welcome
   aside. One panel per page. It is the mascot's belly, not the page's paper.
2. `sable-500` as the **`warning`** colour, which is what a cream becomes when you give it
   enough chroma to mean something.

The cost of that decision is honest: **the palette loses its "watercolour paper" feel.** The
mascot sheet is warm all over; the interface is white with warm objects on it. What is bought
back is crispness, and the fact that the photography — twelve real faces, the actual product —
now sits on white instead of on beige, which is worth more than the atmosphere.

**Abandonné : la sauge en tant que sauge, au-delà du niveau 400.** Above `sauge-400` the ramp
rotates from the mascot's soft 173° to a frank green at 150°, because at 173° it was only
4 JND from the primary teal and a status colour cannot be 4 JND from the brand colour. The
mascot's actual sage lives in `sauge-100/200/300`, which is where the category chips are — so
the loss falls on the steps nobody sees as a colour, and the identity is preserved where it is
looked at.

**Le plafond, dit honnêtement.** `teal-700` sits at `C 0.074` and there is *nothing left* —
that is the sRGB maximum for hue 197 at `L 44`. Cyan-teal is the poorest region of the gamut.
This is not a shortfall in ambition, it is the reason the composition is built the way it is:
the teal cannot be the vivid thing, so the orange has to be, and the orange at
`L 72 / C 0.170` has real heat. That asymmetry is the system. A palette where both the
identity colour and the action colour shout is a palette with no CTA.

---

## 12. Pour un designer, en dix lignes

1. Page white. `bg-base-100`. No exceptions, no cream.
2. Ink `neutre-900`. Titles `teal-800`. Links `teal-700`.
3. Category chips `bg-sauge-100 text-sauge-800`, pill-shaped.
4. Cards: white, `ring-carte`, `shadow-carte`, `rounded-[1.25rem]`. Never nested.
5. « Appeler » is `orange-500` with `teal-950` lettering, pill, with the `orange-700` inner
   edge and the warm shadow. It is the only large orange object.
6. Three orange things per screen, maximum. Count them.
7. One `sable-100` panel per page — that is where Colly lives.
8. The 3 px `--gradient-filet` under the white header replaces the coloured header bar.
9. Focus is always `ring-2 ring-teal-600 ring-offset-2 ring-offset-white`.
10. Fills are 50–500. Ink is 700–950. When unsure, run `palette.py`.
