# Mentions légales — to complete

Each `⟨à compléter : …⟩` marker visible on `/mentions-legales` (one more on `/a-propos`)
corresponds to one line below. Task 16 checks that this list is empty before the site goes live.

## `/mentions-legales`

- **Association's registered name and legal form** — read from the association's own statuts,
  not assumed. The exact wording (name, then legal form) belongs on the page verbatim.
- **Registered address** — the association's official address, as filed with the préfecture.
- **SIRET or RNA number** — whichever identifier the association holds is enough.
- **Cloudflare's exact legal entity name** — the contracting entity depends on the specific
  Cloudflare account (it varies by country and by which service is subscribed to). Read it from
  that account's own terms of service or invoice, not from a general web search: one was
  attempted during this task and only returned unreliable secondary sources (other sites' own
  legal notices, a third-party company-registry lookup), never Cloudflare's own page.
- **That entity's address** — same source, same caveat.

## `/a-propos`

- **Name of the illustrator redrawing Colly** — the current mascot artwork is a placeholder and
  is due to be redrawn by a named illustrator; the credit is marked until that person is known.

## Already known — not on this list

- Publication director: Adrien Lemaire.
- Contact address (the whole site, not just the legal notice): lemaire.adrien@gmail.com —
  `COPY.contactEmail` in `src/lib/copy.ts`, the single address every `mailto:` link on the site
  now uses. An earlier version of this file listed a second, invented address
  (`contact@lacartoucherie.fr`) that nobody had supplied; it has been removed everywhere.

## A note on the contact address

The association may want its own address later, separate from Adrien's personal one. That's a
one-line change in `COPY.contactEmail` — but, like the member slugs, not a free one: the address
is already printed wherever this site has been printed (flyers, QR codes, business cards). A
future change reaches the screen instantly; it does not reach anything already on paper.
