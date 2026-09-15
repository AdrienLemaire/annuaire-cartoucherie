# Identité de marque — Annuaire de la Cartoucherie

The strategy layer. Written before any pixel, so the visual work has something to be
faithful to. Three visual directions are specified at the end; each is rendered as a
brand board and one is chosen before any page is built.

## 1. Ce que c'est

A directory of the entrepreneurs, artisans and independents who live and work in the
Cartoucherie eco-district of Toulouse. Distributed by paper flyers with QR codes in local
shops. Built by a volunteer for a community association, from portraits collected by
Sandra Carole, the community manager.

**Not** a marketplace. **Not** a review site. **Not** a social network. A directory that
happens to know its members personally.

## 2. Positionnement

> **L'annuaire du quartier, fait par le quartier.**

The differentiator against Google Maps and Pages Jaunes is not coverage or features — it
is that every person listed is a neighbour, vouched for by a community that knows them.
The product should feel like a recommendation from someone you trust, not a search result.

## 3. Personnalité

Five traits, in priority order. Where two conflict, the higher one wins.

1. **Accueillante** — warm, welcoming, never institutional. A neighbour holding a door.
2. **Claire** — a 70-year-old resident in a shop, in a hurry, on a phone. Clarity is a
   form of respect, and it outranks cleverness every time.
3. **Fière du quartier** — locally rooted and specific. This is the Cartoucherie, not
   "your neighbourhood". Landmarks and street names are used, not avoided.
4. **Honnête** — a directory with 12 members says 12. Missing information is stated, not
   papered over. No dark patterns, no manufactured urgency, no fake social proof.
5. **Sobre** — volunteer-built and free to use. Restraint reads as trustworthy; polish
   without expense.

## 4. Voix et ton

Tutoiement is too familiar for a stranger scanning a QR code; **vouvoiement**, but warm.
Short sentences. Concrete nouns. No marketing vocabulary — no « solution », no « offre »,
no « expérience », no « univers ».

The register was already found in revision 1 and is kept verbatim:

- « Je cherche… » as the organising phrase, with needs written as a person would say them:
  « Manger bon sans cuisiner ce soir », « Un coup de main chez moi »,
  « Retrouver l'équilibre : stress, sommeil, énergie ».
- « Avis du quartier » rather than « Avis clients » — neighbours vouching, not customers
  rating.
- « Son portrait », « Ce qu'elle propose » — the member's page reads as a portrait, and
  agrees with their grammatical gender.
- « Ils viennent chez vous » for members with no fixed address.
- « Rien n'est envoyé à un serveur : le calcul reste sur votre téléphone » — the way trust
  is earned, in one plain sentence.

## 5. Deux règles de marque, non négociables

**Le nom ne change pas.** « Annuaire de la Cartoucherie », routes `/annuaire`, `/membre/…`.
The spec is approved on this name. The boards design a **wordmark treatment** of the
existing name. Renaming is a separate decision the user has not asked for.

**Aucune référence à la munition.** The Cartoucherie is a former cartridge factory, and
the obvious mark — a brass cartridge, a cylinder, a projectile silhouette — is forbidden.
The heritage may be honoured through material and colour (brick, brass, the covered hall,
the idea of *making things*) but never through ammunition iconography. A community
directory for families does not put a bullet on its home screen.

## 6. Registre visuel de référence

The user named **Nextdoor** and **AlloVoisins**. Consumer-grade neighbourhood utility:
generous whitespace, one confident brand hue, large soft radii, restrained depth, big warm
photography of real people, calm and legible type. See `brief.md` for the binding rules.

## 7. Trois directions à explorer

All three are clean, warm and legible — they differ on **hue family and personality**, not
on how clean they are. Each is exclusive: an agent must not borrow another's hues or fonts.

### Direction 1 — « Voisinage »
*The Nextdoor read: trust through calm and space.*
A single confident green as the whole identity — fresh and civic rather than ecological
cliché. Near-white base with generous air, large radii, minimal depth, one warm accent for
actions only. Friendly geometric sans throughout, character coming from weight contrast and
spacing rather than from a decorative face. Wordmark: lowercase, tightly set, with a simple
geometric mark that reads at 24px in a browser tab.
**Hues:** green primary (~145–165°), warm neutral base, one warm accent (amber/apricot).
**Fonts (pick one pair):** Manrope + Public Sans · Plus Jakarta Sans + Source Sans 3.

### Direction 2 — « Terre rose »
*The local read: unmistakably Toulouse.*
Terracotta brick as primary — la ville rose, and the material the district is actually
built from — on a warm paper base, calmed by a muted teal so it never turns into a warning
colour. Slightly more contrast and warmth than direction 1. The identity says *here* rather
than *neighbourhood app*. Wordmark with a little more personality; mark drawn from
architecture (arch, hall, roofline), never from ammunition.
**Hues:** terracotta primary (~30–45°), warm off-white base, muted teal secondary (~180°).
**Fonts (pick one pair):** Bricolage Grotesque + Instrument Sans · Outfit + Newsreader.

### Direction 3 — « Service »
*The AlloVoisins read: utility, contrast, maximum legibility.*
A trustworthy deep blue primary with a warm orange reserved strictly for actions, on white.
The highest-contrast and most utilitarian of the three, and therefore the strongest for
older residents and bright-daylight phone screens. Denser, more efficient, less atmospheric.
Wordmark: sturdy and plain-spoken, the mark a clear pictogram.
**Hues:** deep blue primary (~250–265°), white/cool-neutral base, orange accent (~55–70°).
**Fonts (pick one pair):** Figtree + Public Sans · Be Vietnam Pro + Source Sans 3.

### Direction 4 — « Colly » (ajoutée après coup)
*La direction qui ne relève pas d'une opinion : la palette de la mascotte du quartier.*
Relevée au pixel sur la planche `Colly, la créature des Halles de la Cartoucherie` :
teal foncé, sauge, crème, orange. Symbole = la ventouse de Colly. Voir `brand/colly.md`.
**Hues :** teal primaire (~196°), crème (~88°), orange d'action (~56°), sauge (~173°).
**Fonts :** Nunito + Source Sans 3.

## 8. Ce que chaque planche doit montrer

Identical content across the three, so the comparison is about identity and not about
which agent showed more:

1. **Wordmark** — « Annuaire de la Cartoucherie » plus the short form « La Cartoucherie »,
   with the mark, shown large and again at 24px.
2. **Palette** — every swatch with its OKLCH value and the daisyUI variable it maps to
   (`--color-primary`, `--color-base-200`, …), plus the contrast ratio of each `-content`
   pair against its background.
3. **Typographie** — the pairing named, shown as a 5-step scale with px sizes and intended
   use, plus a real paragraph of French body copy at 16px.
4. **Les trois blocs** — built for real, not drawn:
   - the **portrait card** (photo, name, trade, categories, tagline, contact actions)
   - the **button set** (primary, secondary, ghost, and a disabled state)
   - a **« Je cherche… » tile** (need phrase, formal category name, member count)
5. **Application** — one 390px-wide screen fragment showing the three blocks together, so
   the palette is judged in situ and not as swatches.
