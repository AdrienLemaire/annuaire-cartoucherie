"""b-v2-diapos · the generated slides of « Votre histoire », and the profile's
carousel that shows them. Markup copied from the styleguide specimens; only the
data is a parameter. Colly never appears here: she is added on the published
« Les entrepreneurs de la Cartoucherie & moi » slide, never in the form."""
from parts import wbr

TOTAL_PAGES = 7
SIGNATURE = '<p class="diapo__signature"><span class="diapo__nom">{nom}</span><span>{metier} · cartoucherie.fyi</span></p>'
TETE = """<div class="diapo__tete">
      <span class="diapo__marque"><svg aria-hidden="true"><use href="#i-ventouse"/></svg>Annuaire de la Cartoucherie</span>
      <span class="diapo__page">{page}&nbsp;/&nbsp;{total}</span>
    </div>"""


def _alt(texte):
    """aria-label text: no markup, plain spaces, & escaped."""
    return texte.replace("&nbsp;", " ").replace("&amp;", "&").replace("&", "&amp;").replace('"', "&quot;")


def couverture(*, nom, metier, slug, photo, page=1, total=TOTAL_PAGES):
    return f"""<div class="diapo diapo--maison diapo--couverture" role="img" aria-label="À la rencontre de {nom}, {_alt(metier)}">
  <div class="diapo__motif"></div>
  <div class="diapo__corps">
    {TETE.format(page=page, total=total)}
    <img class="diapo__portrait" src="{photo}" alt="" width="128" height="128">
    <p class="diapo__rencontre">À la rencontre de</p>
    <p class="diapo__nom-grand">{nom}</p>
    <p class="diapo__metier">{metier}</p>
    <p class="diapo__pied">cartoucherie.fyi/membre/{slug}</p>
  </div>
</div>"""


def page_texte(*, titre, texte, page, nom, metier, medaillon="l-autre", fond="var(--color-sable-100)",
               taille_titre=None, photo=None, ident=None, total=TOTAL_PAGES):
    """One answered question: maison (house design) or photo. `ident` makes
    it a live preview: apercuDiapo() writes the answer into [data-texte]."""
    idh = f' id="{ident}"' if ident else ""
    live = f' data-titre="{_alt(titre)}"' if ident else ""
    data = " data-texte" if ident else ""
    alt = f"{_alt(titre)} — {_alt(texte)}"
    sig = SIGNATURE.format(nom=nom, metier=metier)
    if photo:
        style = f' style="--titre:{taille_titre}"' if taille_titre else ""
        return f"""<div{idh} class="diapo diapo--photo" role="img"{live} aria-label="{alt}"{style}>
  <div class="diapo__corps">
    {TETE.format(page=page, total=total)}
    <div class="diapo__photo"><img src="{photo}" alt="" width="768" height="960"></div>
    <p class="diapo__titre">{titre}</p>
    <span class="diapo__filet"></span>
    <p class="diapo__texte"{data}>{texte}</p>
    {sig}
  </div>
</div>"""
    titre_style = f"; --titre:{taille_titre}" if taille_titre else ""
    return f"""<div{idh} class="diapo diapo--maison" role="img"{live} aria-label="{alt}">
  <div class="diapo__motif"></div>
  <div class="diapo__corps">
    {TETE.format(page=page, total=total)}
    <div class="diapo__arche" style="--fond:{fond}{titre_style}">
      <span class="diapo__medaillon"><svg aria-hidden="true"><use href="#{medaillon}"/></svg></span>
      <p class="diapo__titre">{titre}</p>
      <span class="diapo__filet"></span>
      <p class="diapo__texte"{data}>{texte}</p>
      {sig}
    </div>
  </div>
</div>"""


def page_lieux(*, lieux, phrase, page, nom, metier, total=TOTAL_PAGES):
    """« Mes lieux favoris »: (name, type label, icon) per place, the sentence."""
    noms = ", ".join(n for n, _, _ in lieux)
    alt = _alt(f"Mes lieux favoris — {noms}." + (f" {phrase}" if phrase else ""))
    items = "\n".join(
        f'        <li class="diapo__lieu"><span class="diapo__lieu-icone"><svg aria-hidden="true"><use href="#{ic}"/></svg></span>'
        f'<span class="diapo__lieu-nom">{n}<span class="diapo__lieu-type">{t}</span></span></li>' for n, t, ic in lieux)
    ph = f'<p class="diapo__phrase">{phrase}</p>' if phrase else ""
    return f"""<div class="diapo diapo--maison" role="img" aria-label="{alt}">
  <div class="diapo__motif"></div>
  <div class="diapo__corps">
    {TETE.format(page=page, total=total)}
    <div class="diapo__arche" style="--fond:var(--color-teal-50); --titre:6.2cqi">
      <span class="diapo__medaillon"><svg aria-hidden="true"><use href="#i-carte"/></svg></span>
      <p class="diapo__titre">Mes lieux favoris</p>
      <span class="diapo__filet"></span>
      <ul class="diapo__lieux">
{items}
      </ul>
      {ph}
      {SIGNATURE.format(nom=nom, metier=metier)}
    </div>
  </div>
</div>"""


def page_motto(*, texte, page, nom, metier, ident=None, total=TOTAL_PAGES):
    idh = f' id="{ident}"' if ident else ""
    live = ' data-titre="Mon motto"' if ident else ""
    data = " data-texte" if ident else ""
    return f"""<div{idh} class="diapo diapo--maison diapo--motto" role="img"{live} aria-label="Mon motto — {_alt(texte)}">
  <div class="diapo__motif"></div>
  <div class="diapo__corps">
    {TETE.format(page=page, total=total)}
    <div class="diapo__arche">
      <span class="diapo__guillemet" aria-hidden="true">«</span>
      <p class="diapo__motto"{data}>{texte}</p>
      {SIGNATURE.format(nom=nom, metier=metier)}
    </div>
  </div>
</div>"""


def apercu_diapo(ident, diapo, page, total=TOTAL_PAGES, note=None):
    """The b-v2-histoire preview: the slide, 260 px wide, in the teal well."""
    note_html = f'<p class="px-1.5 pt-3 pb-0.5 text-[16px] text-neutre-700">{note}</p>' if note else ""
    return f"""<figure class="ventouses ventouses--teal mt-6 mx-0 mb-0 rounded-[24px] bg-neutre-100 p-3">
  <figcaption class="flex items-center gap-2 px-1.5 pt-0.5 pb-3 text-[16px] font-semibold text-teal-800">
    <svg class="w-5 h-5" aria-hidden="true"><use href="#i-oeil"/></svg>Votre page {page} sur {total}
  </figcaption>
  <div class="mx-auto w-[260px] max-w-full rounded-[10px] overflow-hidden" style="box-shadow: var(--shadow-carte)">
    {diapo}
  </div>
  {note_html}
</figure>"""


def carrousel(diapos, depart=0, ident="carrousel"):
    """PortraitCarousel.astro, with the slides drawn instead of loaded: one
    slide per view, scroll-snap, dots underneath. `depart` = the slide shown."""
    items = "\n".join(f'    <li class="w-full shrink-0 snap-center"><a href="#" class="block cursor-zoom-in">{d}</a></li>' for d in diapos)
    points = "".join(
        f'<span class="size-2 rounded-full {"bg-teal-700" if i == depart else "bg-neutre-300"}"></span>' for i in range(len(diapos)))
    return f"""<div class="mt-6 max-w-[420px]" data-carousel>
  <ul id="{ident}" class="carte flex snap-x snap-mandatory overflow-x-auto rounded-[16px] bg-white [scrollbar-width:none] list-none p-0 m-0"
      tabindex="0" aria-label="Sa présentation en images" data-depart="{depart}">
{items}
  </ul>
  <p class="mt-3 flex justify-center gap-1.5" aria-hidden="true">{points}</p>
</div>"""
