"""Shared pieces: verbatim extraction from the approved sources, and the
blocks of styleguide.html (section v2 and the older ones) as small functions.
Every function returns markup copied from a styleguide block; only the data
(ids, values, text) is a parameter."""
import re
from pathlib import Path

REPO = Path(__file__).resolve().parents[5]
SG = (REPO / "docs/mockups/final/styleguide.html").read_text()
MEMBRE = (REPO / "docs/mockups/final/membre.html").read_text()


def style_block(src, ident):
    m = re.search(r'<style[^>]*id="%s"[^>]*>.*?</style>' % ident, src, re.S)
    return m.group(0)


def sprite():
    """The icon sprite and the neighbourhood plan (« Placer sur la carte »)."""
    return "\n".join(re.search(r'<svg width="0" height="0"[^>]*id="%s">.*?</defs></svg>' % i, SG, re.S).group(0)
                     for i in ("src-sprite", "src-plan"))


def script_v2():
    m = re.search(r'<script id="src-js-v2">.*?</script>', SG, re.S)
    return m.group(0)


PHOTO_SOPHIE = "https://randomuser.me/api/portraits/women/26.jpg"
PHOTO_CAMILLE = "https://randomuser.me/api/portraits/women/44.jpg"

ALERTE = '<svg class="w-[18px] h-[18px] shrink-0 mt-0.5" aria-hidden="true"><use href="#i-alerte"/></svg>'


# ── b-v2-etape · l'en-tête d'étape ──────────────────────────────────────────
STATUTS = {
    "ok": '<p role="status" class="inline-flex items-center gap-1.5 px-2 text-[16px] text-sauge-800">\n'
          '  <svg class="w-[18px] h-[18px]" aria-hidden="true"><use href="#i-coche"/></svg>Brouillon enregistré\n</p>',
    "envoi": '<p role="status" class="inline-flex items-center gap-1.5 px-2 text-[16px] text-neutre-700">\n'
             '  <svg class="respire w-[18px] h-[18px] text-teal-600" aria-hidden="true"><use href="#i-ventouse"/></svg>Enregistrement…\n</p>',
    "hors": '<p role="status" class="inline-flex items-center gap-1.5 px-2 text-[16px] font-semibold text-sable-800">\n'
            '  <svg class="w-[18px] h-[18px]" aria-hidden="true"><use href="#i-alerte"/></svg>Hors connexion&nbsp;: on réessaie\n</p>',
}


TOTAL = 9  # the profile; « Votre histoire » counts its own 6 (b-v2-histoire)


def chemin(n, total=TOTAL):
    parts = []
    for i in range(1, total + 1):
        if i < n:
            parts.append('<span class="w-2.5 h-2.5 shrink-0 rounded-full bg-teal-700"></span>')
        elif i == n:
            parts.append('<svg class="w-5 h-5 shrink-0 text-teal-700"><use href="#i-ventouse"/></svg>')
        else:
            parts.append('<span class="w-2.5 h-2.5 shrink-0 rounded-full ring-[1.5px] ring-inset ring-neutre-500"></span>')
        if i < total:
            teinte = "bg-teal-700" if i < n else "bg-neutre-300"
            parts.append(f'<span class="h-[2px] flex-1 {teinte}"></span>')
    return '<div class="mt-3 flex items-center" aria-hidden="true">' + "".join(parts) + "</div>"


def entete_etape(n, retour="#", statut="ok", etiquette=None, total=TOTAL):
    etiquette = etiquette or f"Étape {n} sur {total}"
    dots = chemin(n, total) if n else ""
    return f"""
<header class="px-5 pt-2 pb-2 bg-white">
  <div class="-mx-2 flex flex-wrap items-center justify-between gap-x-3">
    <a href="{retour}" class="inline-flex items-center gap-1.5 min-h-[44px] px-2 rounded-full text-corps font-semibold text-teal-700 hover:bg-teal-50">
      <svg class="w-5 h-5" aria-hidden="true"><use href="#i-retour"/></svg>Retour
    </a>
    {STATUTS[statut]}
  </div>
  <p class="mt-4 text-etiquette font-semibold uppercase text-teal-700">{etiquette}</p>
  {dots}
</header>"""


# ── b-v2-actions · « Continuer », « Plus tard » ─────────────────────────────
def barre(label="Continuer", fantome="Plus tard", href="#espace"):
    return f"""
<div class="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-sm"
     style="box-shadow: 0 -4px 8px oklch(17.5% .03 202/.06), 0 -28px 64px -20px oklch(17.5% .03 202/.28)">
  <div class="mx-auto max-w-[640px] px-4 py-3 flex flex-wrap items-center gap-3">
    <a href="{href}" class="inline-flex items-center justify-center min-h-[54px] px-5 rounded-full text-corps font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100">
      {fantome}
    </a>
    <button type="submit"
            class="cta flex-1 inline-flex items-center justify-center gap-2 min-h-[54px] px-6 rounded-full text-[18px] font-bold tracking-tight transition">
      {label}<svg class="w-5 h-5" aria-hidden="true"><use href="#i-chev"/></svg>
    </button>
  </div>
</div>"""


def barre_envoyer():
    return """
<div class="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-sm"
     style="box-shadow: 0 -4px 8px oklch(17.5% .03 202/.06), 0 -28px 64px -20px oklch(17.5% .03 202/.28)">
  <div class="mx-auto max-w-[640px] px-4 pt-2.5 pb-3">
    <p class="text-center text-[16px] text-neutre-700">Adrien la relit avant de la publier.</p>
    <button type="submit"
            class="cta mt-2 w-full inline-flex items-center justify-center gap-2 min-h-[54px] px-6 rounded-full text-[18px] font-bold tracking-tight transition">
      Envoyer ma fiche
    </button>
  </div>
</div>"""


# ── b-v2-champ · le champ, l'aide, le compteur ──────────────────────────────
def bouton_aide(cible, sr, ouvert=False):
    return f"""<button type="button" class="-mr-2 -mb-0.5 grid place-items-center w-11 h-11 shrink-0 rounded-full"
        aria-expanded="{'true' if ouvert else 'false'}" aria-controls="{cible}" onclick="basculer(this)">
  <span class="pastille pastille--teal w-7 h-7 bg-teal-50 ff text-[16px] text-teal-800" aria-hidden="true">?</span>
  <span class="sr-only">Aide&nbsp;: {sr}</span>
</button>"""


def bulle(ident, contenu, ouvert=False, tag="p"):
    cache = "" if ouvert else " hidden"
    return (f'<{tag} id="{ident}"{cache} class="bulle mb-2.5 rounded-[14px] bg-teal-50 px-4 py-3 '
            f'text-[16px] leading-snug text-teal-950">{contenu}</{tag}>')


def compteur_txt(n, doux, dur=None):
    if dur and n > dur:
        return f'<svg class="w-[18px] h-[18px] shrink-0" aria-hidden="true"><use href="#i-alerte"/></svg>{n} / {dur} · trop long, raccourcissez', "erreur"
    if n > doux:
        return f'<svg class="w-[18px] h-[18px] shrink-0" aria-hidden="true"><use href="#i-alerte"/></svg>{n} / {doux} · un peu long', "long"
    return f"{n} / {doux}", "ok"


def champ(ident, label, value="", *, facultatif=False, aide=None, aide_sr=None, aide_ouverte=False,
          doux=None, dur=None, type_="text", attrs="", erreur=None, note=None, placeholder=None):
    """A labelled single-line field (b-v2-champ). `erreur` is the message."""
    lab_txt = label + (' <span class="font-normal text-neutre-700">(facultatif)</span>' if facultatif else "")
    etat = "ok"
    cpt = ""
    desc = []
    if doux:
        txt, etat = compteur_txt(len(value), doux, dur)
        cpt = f'<p id="{ident}-compte" class="compteur tnum mt-1.5 flex items-start justify-end gap-1.5 text-[16px]">{txt}</p>'
        desc.append(f"{ident}-compte")
    if erreur:
        etat = "erreur"
        desc.append(f"{ident}-err")
    dataset = f' data-doux="{doux}"' + (f' data-dur="{dur}"' if dur else "") + ' oninput="compter(this)"' if doux else ""
    inv = ' aria-invalid="true"' if erreur else ""
    ad = f' aria-describedby="{" ".join(desc)}"' if desc else ""
    ph = f' placeholder="{placeholder}"' if placeholder else ""
    val = f' value="{value}"' if value else ""
    if aide:
        tete = f"""<div class="flex items-end justify-between gap-3">
  <label for="{ident}" class="block min-w-0 pb-1.5 text-[16px] font-semibold text-neutre-800">{lab_txt}</label>
  {bouton_aide(ident + '-aide', aide_sr or label, aide_ouverte)}
</div>
{bulle(ident + '-aide', aide, aide_ouverte)}"""
        mt = ""
    else:
        tete = f'<label for="{ident}" class="block text-[16px] font-semibold text-neutre-800">{lab_txt}</label>'
        mt = "mt-1.5 "
    err = (f'<p id="{ident}-err" class="mt-1.5 flex items-start gap-1.5 text-[16px] font-semibold text-rouge-700">'
           f'{ALERTE}<span>{erreur}</span></p>') if erreur else ""
    note = f'<p class="mt-1.5 text-[16px] text-neutre-700">{note}</p>' if note else ""
    return f"""
<div data-etat="{etat}">
  {tete}
  <input id="{ident}" type="{type_}"{val}{ph}{dataset}{inv}{ad} {attrs}
         class="champ {mt}w-full min-h-[52px] px-3.5 rounded-xl text-corps text-neutre-900 placeholder:text-neutre-600">
  {cpt}{err}{note}
</div>"""


def zone(ident, label, value, *, doux, dur, aide=None, aide_sr=None, aide_ouverte=False, aide_tag="p", rows=4, h1=False):
    """b-v2-zone · la zone de texte. With h1=True the label is the step title."""
    txt, etat = compteur_txt(len(value), doux, dur)
    inv = ' aria-invalid="true"' if etat == "erreur" else ""
    if h1:
        tete = f"""<div class="mt-6 flex flex-wrap items-start justify-between gap-x-3">
  <h1 class="ff text-nom text-teal-900"><label for="{ident}">{label}</label></h1>
  {bouton_aide(ident + '-aide', aide_sr or label, aide_ouverte).replace('-mb-0.5 ', '')}
</div>
{bulle(ident + '-aide', aide, aide_ouverte, aide_tag).replace('mb-2.5', 'mt-3')}"""
        mt = "mt-4 "
    else:
        tete = f"""<div class="flex items-end justify-between gap-3">
  <label for="{ident}" class="block min-w-0 pb-1.5 text-[16px] font-semibold text-neutre-800">{label}</label>
  {bouton_aide(ident + '-aide', aide_sr or label, aide_ouverte)}
</div>
{bulle(ident + '-aide', aide, aide_ouverte, aide_tag)}"""
        mt = ""
    return f"""
<div data-etat="{etat}">
  {tete}
  <textarea id="{ident}" rows="{rows}" data-doux="{doux}" data-dur="{dur}" oninput="compter(this)"{inv}
            aria-describedby="{ident}-compte"
            class="champ {mt}block w-full min-h-[104px] px-3.5 py-3 rounded-xl text-corps leading-relaxed text-neutre-900">{value}</textarea>
  <p id="{ident}-compte" class="compteur tnum mt-1.5 flex items-start justify-end gap-1.5 text-[16px]">{txt}</p>
</div>"""


# ── b-v2-apercu · le bouton et le puits ─────────────────────────────────────
def bouton_apercu(cible, ouvert, libelle="Aperçu"):
    return f"""<button type="button" aria-expanded="{'true' if ouvert else 'false'}" aria-controls="{cible}" onclick="basculer(this)"
        class="mt-5 inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full text-corps font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 aria-expanded:bg-teal-700 aria-expanded:text-white">
  <svg class="w-5 h-5" aria-hidden="true"><use href="#i-oeil"/></svg>{libelle}
</button>"""


def puits(ident, contenu, ouvert, pied="Pas encore en ligne."):
    cache = "" if ouvert else " hidden"
    pied_html = f'<p class="px-1.5 pt-3 pb-0.5 text-[16px] text-neutre-700">{pied}</p>' if pied else ""
    return f"""<figure id="{ident}"{cache} class="ventouses ventouses--teal mt-3 mx-0 mb-0 rounded-[24px] bg-neutre-100 p-3">
  <figcaption class="flex items-center gap-2 px-1.5 pt-0.5 pb-3 text-[16px] font-semibold text-teal-800">
    <svg class="w-5 h-5" aria-hidden="true"><use href="#i-oeil"/></svg>Ce que vos voisins verront
  </figcaption>
  {contenu}
  {pied_html}
</figure>"""


def apercu(ident, contenu, ouvert, libelle="Aperçu"):
    return bouton_apercu(ident, ouvert, libelle) + "\n" + puits(ident, contenu, ouvert)


# ── b-fiche · l'en-tête de fiche (taille de membre.html : ×1,375) ──────────
def bandeau_portrait(photo, alt):
    if photo:
        img = f"""<img src="{photo}"
           alt="{alt}" width="128" height="128"
           class="arche block w-[148px] h-[176px] object-cover bg-white"
           style="object-position:50% 22%; box-shadow: 0 0 0 6px #fff, var(--shadow-carte)">"""
    else:
        # new: the arch, empty, until step 3 — the dashed arch of b-v2-photo
        img = """<div class="arche grid place-items-center w-[148px] h-[176px] bg-neutre-100"
           style="outline:2px dashed var(--color-neutre-500); outline-offset:-2px; box-shadow: 0 0 0 6px #fff">
        <span class="pastille pastille--teal w-12 h-12 bg-white text-teal-700" aria-hidden="true"><svg class="w-6 h-6"><use href="#i-photo"/></svg></span>
        <span class="sr-only">Votre photo, à l'étape 3</span>
      </div>"""
    return f"""<div class="ventouses relative bg-sable-200 pt-9 pb-11 rounded-b-[34px] overflow-hidden">
    <div class="flex justify-center">
      {img}
    </div>
  </div>"""


def mot(texte):
    """--mot for .mots-entiers: letters in the longest word (the build writes it)."""
    propre = re.sub(r"<[^>]+>|&nbsp;|&amp;", " ", texte)
    return max(len(w) for w in re.split(r"[\s·]+", propre) if w)


def wbr(texte):
    """b-contact: a <wbr> before each « @ » and « . », after each « _ »."""
    return re.sub(r"([@.])", r"<wbr>\1", texte).replace("_", "_<wbr>")


# ── b-v2-pratique · l'encadré pratique, dans la carte d'identité ────────────
PRATIQUE_ICONES = {"Parle aussi": "i-langues", "Tarifs": "i-euro", "Horaires": "i-horloge"}


def pratique(lignes, resa=None, resa_hote=None):
    rangs = "\n".join(f"""      <div class="flex min-w-0 flex-wrap items-start gap-x-3.5 gap-y-2">
        <span class="pastille pastille--teal mt-0.5 h-10 w-10 shrink-0 bg-teal-50 text-teal-700"><svg class="h-5 w-5" aria-hidden="true"><use href="#{PRATIQUE_ICONES[k]}"/></svg></span>
        <div class="min-w-[min(12rem,100%)] flex-1">
          <dt class="text-base text-neutre-700">{k}</dt>
          <dd class="m-0 break-words text-corps font-semibold text-neutre-900">{v}</dd>
        </div>
      </div>""" for k, v in lignes)
    bouton = f"""
    <p class="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
      <a href="{resa}"
         class="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-teal-700 px-5 py-2.5 text-center text-corps font-semibold text-white hover:bg-teal-600 @xl:w-auto">
        <svg class="h-5 w-5 shrink-0" aria-hidden="true"><use href="#i-agenda"/></svg>
        Réserver en ligne
      </a>
      <span class="break-words text-base text-neutre-700">sur {wbr(resa_hote)}</span>
    </p>""" if resa else ""
    return f"""<div class="mt-5 border-t border-neutre-200 pt-5">
    <dl class="m-0 grid gap-x-8 gap-y-4 @xl:grid-cols-3">
{rangs}
    </dl>{bouton}
  </div>"""


# ── b-fiche · la carte d'identité (v2 : métier · enseigne, mots entiers) ────
def carte_identite(*, nom, metier, enseigne=None, chips="", accroche=None, meta=None, pratique_html=""):
    ligne = metier + (f'&nbsp;<span aria-hidden="true">·</span> <span class="font-semibold text-neutre-900">{enseigne}</span>' if enseigne else "")
    chips_html = f'<p class="mt-3 flex flex-wrap gap-2">{chips}</p>' if chips else ""
    acc = f'<p class="mt-4 text-[19px] leading-relaxed text-neutre-900">{accroche}</p>' if accroche else ""
    meta_html = f'<p class="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-[16px] text-neutre-700">{meta}</p>' if meta else ""
    return f"""<div class="@container carte rounded-[24px] bg-white p-5">
      <h1 class="ff text-grand mots-entiers text-teal-900" style="--mot:{mot(nom)}">{nom}</h1>
      <p class="mt-1.5 text-[1.25rem] leading-snug mots-entiers text-neutre-800" style="--taille:1.25rem; --lettre:.56; --mot:{mot(ligne)}">{ligne}</p>
      {chips_html}
      {acc}
      {meta_html}
      {pratique_html}
    </div>"""


def entete_fiche(*, nom, metier, enseigne=None, photo=None, alt="", chips="", accroche=None, meta=None, pratique_html="", rounded=""):
    return f"""<section class="{rounded}">
  {bandeau_portrait(photo, alt)}
  <div class="px-5 relative -mt-8">
    {carte_identite(nom=nom, metier=metier, enseigne=enseigne, chips=chips, accroche=accroche, meta=meta, pratique_html=pratique_html)}
  </div>
</section>"""


CHIP_SANTE = ('<span class="chip inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[16px] font-semibold">'
              '<svg class="w-[18px] h-[18px]" aria-hidden="true"><use href="#c-sante"/></svg>Santé &amp; bien-être</span>')

DISTANCE = lambda d: (f'<span class="inline-flex items-center gap-1.5"><svg class="w-[18px] h-[18px] text-teal-600" aria-hidden="true">'
                      f'<use href="#i-pin"/></svg>À {d} de la Halle</span>')


# ── b-carte · la ligne de liste (dans le puits de b-v2-apercu) ──────────────
def carte_ligne(nom, metier, photo, distance=None, tel=None, tel_lisible=None):
    dist = (f'<p class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[16px] text-neutre-700 mt-0.5">'
            f'<span class="inline-flex items-center gap-1"><svg class="w-4 h-4 text-teal-600" aria-hidden="true"><use href="#i-pin"/></svg>{distance}</span></p>') if distance else ""
    appel = (f"""<a href="tel:{tel}" class="relative z-10 shrink-0 self-center mr-2.5 grid place-items-center w-11 h-11 rounded-full text-teal-700 bg-teal-50 hover:bg-teal-100"
     aria-label="Appeler {nom} au {tel_lisible}">
    <svg class="w-5 h-5" aria-hidden="true"><use href="#i-tel"/></svg>
  </a>""") if tel else ""
    return f"""<article class="carte carte-lien relative flex min-h-[152px] rounded-[20px] bg-white overflow-hidden">
  <img src="{photo}" alt="Portrait de {nom}" width="128" height="128" loading="lazy"
       class="w-[116px] shrink-0 self-stretch object-cover" style="object-position:50% 25%">
  <div class="flex-1 min-w-0 py-4 pl-4 pr-1 flex flex-col justify-center gap-1">
    <h3 class="ff text-[20px] leading-tight text-teal-900">
      <a href="#" class="before:absolute before:inset-0 before:content-['']">{nom}</a>
    </h3>
    <p class="text-corps text-neutre-800 leading-snug">{metier}</p>
    {dist}
  </div>
  {appel}
</article>"""


# ── membre.html sections (sm: variants removed: frames are phones) ─────────
def titre_section(ident, titre):
    # no orange underline under section headings (Adrien, 2026-10-30)
    return f'<h2 id="{ident}" class="ff mb-5 text-nom text-teal-900">{titre}</h2>'


def section_services(ident, titre, services, icone="c-sante", pad="px-5 py-6"):
    tuiles = "\n".join(
        f"""  <li class="flex items-center gap-3.5 rounded-[16px] bg-neutre-100 px-4 py-4 min-h-[64px]">
    <span class="pastille w-9 h-9 bg-white text-sauge-700 shrink-0"><svg class="w-[18px] h-[18px]" aria-hidden="true"><use href="#{icone}"/></svg></span>
    <span class="@container min-w-0 flex-1"><span class="block mots-entiers text-corps font-semibold text-teal-900" style="--taille:var(--text-corps); --lettre:.6; --mot:{mot(s)}">{s}</span></span>
  </li>""" for s in services)
    return f"""<section class="{pad}" aria-labelledby="{ident}">
  {titre_section(ident, titre)}
  <ul class="grid gap-3 list-none p-0 m-0">
{tuiles}
  </ul>
</section>"""


def section_portrait(ident, titre, bio, signature, pad="px-5 py-6", carrousel=""):
    return f"""<section class="bg-neutre-100" aria-labelledby="{ident}">
  <div class="{pad}">
    {titre_section(ident, titre)}
    <p class="text-[19px] leading-relaxed text-neutre-900">{bio}</p>
    <p class="mt-4 text-[16px] text-neutre-700">{signature}</p>
    {carrousel}
  </div>
</section>"""


def ligne_contact(href, icone, etiquette, valeur):
    return f"""<li><a href="{href}" class="carte carte-lien flex flex-wrap items-center gap-x-3.5 gap-y-2 min-h-[64px] px-4 py-3 rounded-[16px] bg-white">
  <span class="pastille pastille--teal w-10 h-10 bg-teal-50 text-teal-700 shrink-0"><svg class="w-5 h-5" aria-hidden="true"><use href="#{icone}"/></svg></span>
  <span class="min-w-[min(12rem,100%)] flex-1">
    <span class="block text-[16px] text-neutre-700">{etiquette}</span>
    <span class="block text-corps font-semibold text-teal-800 break-words">{wbr(valeur)}</span>
  </span>
</a></li>"""


def section_contact(ident, titre, lignes, apres="", pad="px-5 py-6"):
    return f"""<section class="{pad}" aria-labelledby="{ident}">
  {titre_section(ident, titre)}
  <ul class="grid gap-2.5 list-none p-0 m-0">
{lignes}
  </ul>
  {apres}
</section>"""


def section_ou(ident, titre, adresse_html, sous, lien_carte=True, horaires=None, pad="px-5 py-6"):
    carte = ("""<a href="#" class="inline-flex min-w-0 max-w-full items-center gap-2 min-h-[44px] text-corps font-semibold text-teal-700 underline underline-offset-4 decoration-teal-300 hover:decoration-teal-600">
          La voir sur la carte du quartier <svg class="w-4 h-4" aria-hidden="true"><use href="#i-chev"/></svg>
        </a>""" if lien_carte else "")
    return f"""<section class="{pad}" aria-labelledby="{ident}">
  {titre_section(ident, titre)}
  <div class="carte rounded-[20px] bg-white p-5 flex items-start gap-4">
    <span class="pastille pastille--teal w-11 h-11 bg-teal-50 text-teal-700 shrink-0 mt-0.5"><svg class="w-5 h-5" aria-hidden="true"><use href="#i-pin"/></svg></span>
    <div class="min-w-0">
      <address class="not-italic text-[18px] leading-snug text-neutre-900 font-semibold">{adresse_html}</address>
      <p class="mt-2 text-[16px] text-neutre-700">{sous}</p>
      <p class="mt-3 flex flex-wrap items-center gap-x-5">
        {carte}
        <a href="#" class="inline-flex items-center gap-2 min-h-[44px] text-[16px] font-semibold text-teal-700 underline underline-offset-4 decoration-teal-300 hover:decoration-teal-600">
          Ouvrir l'itinéraire <svg class="w-4 h-4" aria-hidden="true"><use href="#i-chev"/></svg>
        </a>
      </p>
    </div>
  </div>
</section>"""


# ── b-appeler · la barre d'appel (sans les variantes sm:) ───────────────────
def barre_appeler(tel, lisible):
    return f"""<div class="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-sm"
     style="box-shadow: 0 -4px 8px oklch(17.5% .03 202/.06), 0 -28px 64px -20px oklch(17.5% .03 202/.28)">
  <div class="mx-auto max-w-[1160px] px-4 py-3 flex items-center gap-4">
    <a href="tel:{tel}"
       class="cta flex-1 inline-flex items-center justify-center gap-2.5 min-h-[54px] px-6 rounded-full text-[18px] font-bold tracking-tight transition">
      <svg class="w-5 h-5" aria-hidden="true"><use href="#i-tel"/></svg>
      Appeler {lisible}
    </a>
  </div>
</div>"""


def appeler_en_ligne(tel, lisible):
    return f"""<a href="tel:{tel}"
   class="cta inline-flex items-center gap-2.5 min-h-[52px] px-6 rounded-full text-[17px] font-bold tracking-tight transition">
  <svg class="w-5 h-5" aria-hidden="true"><use href="#i-tel"/></svg>
  Appeler {lisible}
</a>"""


# ── b-entete · l'en-tête du site, variante « fiche membre » ─────────────────
def entete_site(lien="Annuaire"):
    return f"""<header class="bg-white/95 backdrop-blur-sm">
  <div class="px-5 min-h-16 flex flex-wrap items-center justify-between gap-3">
    <a href="#" class="flex items-center gap-2.5 -ml-0.5 min-h-[44px] py-1" aria-label="Annuaire de la Cartoucherie, accueil">
      <svg class="w-8 h-8 text-teal-700 shrink-0" aria-hidden="true"><use href="#i-ventouse"/></svg>
      <span class="leading-none">
        <span class="block text-[11.5px] uppercase tracking-[.18em] text-neutre-700 font-semibold">Annuaire de</span>
        <span class="ff block text-[20px] text-teal-900 leading-tight">la Cartoucherie</span>
      </span>
    </a>
    <a href="#" class="inline-flex items-center gap-2 min-h-[44px] px-3.5 rounded-full text-etiquette tracking-normal font-semibold text-teal-700 hover:bg-teal-50">
      <svg class="w-5 h-5" aria-hidden="true"><use href="#i-retour"/></svg>
      <span>{lien}</span>
    </a>
  </div>
  <div class="filet h-[3px]"></div>
</header>"""


# ── b-v2-turnstile · l'emplacement, en attente ou réussi ───────────────────
def turnstile(etat="attente", classe="mt-5"):
    if etat == "ok":
        return f"""<div class="turnstile {classe}" role="img" aria-label="Emplacement du contrôle anti-robot Cloudflare Turnstile, réussi">
  <span class="grid place-items-center w-[26px] h-[26px] shrink-0 rounded-full bg-sauge-100 text-sauge-800" aria-hidden="true"><svg class="w-[18px] h-[18px]"><use href="#i-coche"/></svg></span>
  <span class="text-[16px] text-neutre-800">Réussi</span>
</div>"""
    return f"""<div class="turnstile {classe}" role="img" aria-label="Emplacement du contrôle anti-robot Cloudflare Turnstile">
  <span class="turnstile__case" aria-hidden="true"></span>
  <span class="text-[16px] text-neutre-700">Contrôle anti-robot</span>
</div>"""


# ── « Votre histoire »: Passer / Continuer, and « Terminer plus tard » to the check page
def barre_histoire(label, suivant):
    return f"""
<div class="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-sm"
     style="box-shadow: 0 -4px 8px oklch(17.5% .03 202/.06), 0 -28px 64px -20px oklch(17.5% .03 202/.28)">
  <div class="mx-auto max-w-[640px] px-4 pt-3 pb-1.5 flex flex-wrap items-center gap-3">
    <a href="{suivant}" class="inline-flex items-center justify-center min-h-[54px] px-5 rounded-full text-corps font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100">
      Passer
    </a>
    <button type="submit"
            class="cta flex-1 inline-flex items-center justify-center gap-2 min-h-[54px] px-6 rounded-full text-[18px] font-bold tracking-tight transition">
      {label}<svg class="w-5 h-5" aria-hidden="true"><use href="#i-chev"/></svg>
    </button>
    <a href="#f-v1" class="basis-full inline-flex items-center justify-center min-h-[44px] text-[16px] font-semibold text-teal-700 underline underline-offset-4 decoration-teal-300 hover:decoration-teal-600">Terminer plus tard</a>
  </div>
</div>"""
