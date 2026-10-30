"""Steps 10–15: « Votre histoire » (b-v2-histoire) and « Vos lieux favoris »
(b-v2-lieux). Optional: the ghost button is « Passer », not « Plus tard »."""
from parts import *
from diapos import page_texte, page_lieux, page_motto, apercu_diapo
from etapes import S, NB, form

PIED = "pb-[150px]"


def entete_histoire(n, retour):
    """b-v2-histoire's own header: « Votre histoire · k sur 6 », six points."""
    k = n - 9
    return entete_etape(k, retour, etiquette=f"Votre histoire · {k} sur 6", total=6)


SIG = dict(nom=S["nom"], metier=S["metier"])

# Sophie's answers (fields doc §7 limits, hard). Lengths are of the raw text.
POURQUOI_EN_COURS = ("Pendant douze ans, j'ai travaillé en pharmacie hospitalière. J'aimais soigner, mais je n'avais "
                     "jamais le temps d'écouter vraiment. En 2021, j'ai repris mes études de naturopathie pour accompagner autrement.")  # 206
POURQUOI = POURQUOI_EN_COURS + " : prendre une heure, comprendre le rythme de chacun, et construire un suivi qui lui ressemble."  # 300
DECLIC = ("Une patiente m'a dit, un beau jour : « Vous êtes la première à me demander comment vous dormez. » Ce soir-là, "
          "en rentrant à vélo le long du canal de Brienne, j'ai su que je voulais exercer à mon compte, près de chez moi, "
          "avec des voisins que je recroiserais au marché des Halles, chaque samedi matin.")  # 300
DECLIC_LONG = DECLIC + " Depuis, je n'ai jamais regretté."  # 333
ACTIVITE = ("Je reçois au cabinet du Bois Vert, du mardi au samedi, des adultes et des étudiants. Un premier bilan d'une "
            "heure trente, puis un suivi mensuel : alimentation, sommeil, gestion du stress. Je travaille en lien avec les "
            "médecins du quartier, jamais à leur place. Atelier cuisine de saison, jeudis soir.")  # 300
RESEAU = ("Toute seule à mon compte, je craignais l'isolement. Le réseau m'a donné des collègues : on se recommande, on "
          "partage nos idées, on se dépanne. Je veux que la Cartoucherie devienne un quartier où l'on prend soin de soi "
          "sans traverser Toulouse, et où chaque commerçant connaît le prénom de ses voisins.")  # 300
PHRASE_LIEUX = ("Le samedi, je fais mon marché aux Halles, je prends un café aux P'tits Tous, puis je lis au parc Pouvillon "
                "avant d'ouvrir le cabinet. Et le jeudi soir : squash.")  # 160
MOTTO = "Prendre soin de soi n'est pas un luxe : c'est la base de tout le reste, et ça commence très souvent par une bonne nuit !"  # 120
PHOTO_DECLIC = "https://picsum.photos/id/365/768/960"

# The questions: step, title, prompt (fields doc §7), limit, slide page, slide design
QUESTIONS = {
    10: dict(titre="Pourquoi entreprendre&nbsp;?", question="Qu'est-ce qui vous a donné envie de vous lancer&nbsp;?",
             dur=300, page=2, medaillon="l-autre", fond="var(--color-sable-100)"),
    11: dict(titre="Mon déclic", question="Le moment où vous avez su que c'était le bon chemin.",
             dur=300, page=3, medaillon="i-ampoule", fond="var(--color-sauge-100)"),
    12: dict(titre="Mon activité en bref", question="Ce que vous faites, pour qui, comment.",
             dur=300, page=4, medaillon="c-sante", fond="#ffffff"),
    13: dict(titre="Les entrepreneurs de la Cartoucherie &amp; moi",
             question="Ce que le réseau vous apporte, et l'impact que vous voulez avoir sur le quartier.",
             dur=300, page=5, medaillon="i-groupe", fond="var(--color-sable-200)", taille="5.8cqi"),
    15: dict(titre="Mon motto", question="Votre phrase, celle qui vous ressemble.", dur=120, page=7),
}

# OpenStreetMap snapshot (an Overpass export of the places inside MAP_BOUNDS), sorted into the seven families
LIEUX = {
    "ptits": ("Les P'tits Tous", "Café, bar", "l-cafe"),
    "pouvillon": ("Parc Pouvillon", "Parc, jardin", "l-parc"),
    "bar500": ("Le Bar des 500", "Café, bar", "l-cafe"),
    "autrerive": ("L'autre rive cartoucherie", "Boutique", "l-boutique"),
    "ucpa": ("UCPA TOULOUSE Les Halles de la Cartoucherie - Fitness &amp; Squash", "Sport", "l-sport"),
}
POURQUOI_LIEU = {
    "ptits": "Le café du samedi, après le marché : on y croise tout le quartier.",
    "pouvillon": "",
    "bar500": "L'apéro du jeudi, après le squash.",
    "autrerive": "Une libraire qui conseille vraiment, et des rencontres le jeudi.",
    "ucpa": "",
}


def diapo_question(n, texte, *, photo=None, ident=None):
    q = QUESTIONS[n]
    if n == 15:
        return page_motto(texte=NB(texte), page=q["page"], ident=ident, **SIG)
    return page_texte(titre=q["titre"], texte=NB(texte), page=q["page"], medaillon=q["medaillon"], fond=q["fond"],
                      taille_titre=q.get("taille"), photo=photo, ident=ident, **SIG)


def diapo_lieux(cles, phrase=PHRASE_LIEUX):
    return page_lieux(lieux=[LIEUX[c] for c in cles], phrase=NB(phrase) if phrase else "", page=6, **SIG)


def bloc_photo(p, photo):
    """b-v2-histoire: « Ajouter une photo », or the chosen one with Changer/Retirer."""
    if not photo:
        return """<div class="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
  <label class="inline-flex items-center gap-2 min-h-[48px] px-5 rounded-full text-corps font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 cursor-pointer has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-teal-600">
    <svg class="w-5 h-5" aria-hidden="true"><use href="#i-photo"/></svg>Ajouter une photo
    <input type="file" accept="image/jpeg,image/png,image/webp" class="sr-only">
  </label>
  <span class="text-[16px] text-neutre-700">(facultatif)</span>
</div>"""
    return f"""<div class="mt-5 flex items-center gap-4">
  <img src="{photo}" alt="La photo choisie pour cette page" width="768" height="960"
       class="arche w-[64px] h-[78px] shrink-0 object-cover" style="box-shadow: 0 0 0 3px #fff, var(--shadow-carte)">
  <div class="flex flex-wrap gap-x-4 gap-y-1">
    <label class="inline-flex items-center min-h-[44px] text-[16px] font-semibold text-teal-700 underline underline-offset-4 decoration-teal-300 hover:decoration-teal-600 cursor-pointer has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-teal-600">
      Changer<span class="sr-only"> la photo</span>
      <input type="file" accept="image/jpeg,image/png,image/webp" class="sr-only">
    </label>
    <button type="button" class="inline-flex items-center gap-1.5 min-h-[44px] text-[16px] font-semibold text-teal-700">
      <svg class="w-[18px] h-[18px]" aria-hidden="true"><use href="#i-corbeille"/></svg>Retirer<span class="sr-only"> la photo</span>
    </button>
  </div>
</div>"""


def question(p, n, valeur, *, retour, suivant, photo=None, rows=6):
    """One « Votre histoire » question, one screen (b-v2-histoire)."""
    q = QUESTIONS[n]
    txt, etat = compteur_txt(len(valeur), q["dur"], q["dur"])
    inv = ' aria-invalid="true"' if etat == "erreur" else ""
    ident = f"{p}-r"
    titre_mot = mot(q["titre"])
    apercu_html = apercu_diapo(ident + "-d", diapo_question(n, valeur, photo=photo, ident=ident + "-d"), q["page"])
    dernier = n == 15
    return form(f"""{entete_histoire(n, retour)}
<div class="@container px-5" data-etat="{etat}">
  <p class="mt-6 text-[16px] text-neutre-700">Facultatif</p>
  <h1 class="ff mt-1 text-nom mots-entiers text-teal-900" style="--taille:var(--text-nom); --mot:{titre_mot}"><label for="{ident}">{q['titre']}</label></h1>
  <p id="{ident}-q" class="mt-2 text-corps text-neutre-800">{q['question']}</p>
  <textarea id="{ident}" rows="{rows}" data-doux="{q['dur']}" data-dur="{q['dur']}" data-diapo="{ident}-d" oninput="compter(this); apercuDiapo(this)"{inv}
            aria-describedby="{ident}-q {ident}-compte"
            class="champ mt-4 block w-full min-h-[156px] px-3.5 py-3 rounded-xl text-corps leading-relaxed text-neutre-900">{valeur}</textarea>
  <p id="{ident}-compte" class="compteur tnum mt-1.5 flex items-start justify-end gap-1.5 text-[16px]">{txt}</p>
  {bloc_photo(p, photo)}
  {apercu_html}
</div>""", barre_histoire("Vérifier ma fiche" if dernier else "Continuer", suivant), PIED)


# ── « Vos lieux favoris » (b-v2-lieux) ──────────────────────────────────────
def lieu_court(cle):
    n, t, ic = LIEUX[cle]
    return f"""<li class="flex items-center gap-3 rounded-[18px] bg-neutre-100 px-3.5 py-2.5">
  <span class="lieu shrink-0" aria-hidden="true"><svg class="w-[18px] h-[18px]"><use href="#{ic}"/></svg></span>
  <span class="min-w-0 flex-1"><span class="ff block text-[19px] leading-tight text-teal-900">{n}</span><span class="block text-[16px] text-neutre-700">{t}</span></span>
  <button type="button" aria-label="Retirer {n}" class="grid place-items-center w-11 h-11 shrink-0 rounded-full text-teal-700 hover:bg-white"><svg class="w-5 h-5" aria-hidden="true"><use href="#i-corbeille"/></svg></button>
</li>"""


def lieu_complet(p, i, cle):
    n, t, ic = LIEUX[cle]
    pq = POURQUOI_LIEU[cle]
    ident = f"{p}-p{i}"
    return f"""<li class="rounded-[18px] bg-neutre-100 p-3.5">
  <div class="flex items-center gap-3">
    <span class="lieu shrink-0" aria-hidden="true"><svg class="w-[18px] h-[18px]"><use href="#{ic}"/></svg></span>
    <span class="min-w-0 flex-1"><span class="ff block text-[19px] leading-tight text-teal-900">{n}</span><span class="block text-[16px] text-neutre-700">{t}</span></span>
    <button type="button" aria-label="Retirer {n}" class="grid place-items-center w-11 h-11 shrink-0 rounded-full text-teal-700 hover:bg-white"><svg class="w-5 h-5" aria-hidden="true"><use href="#i-corbeille"/></svg></button>
  </div>
  <div class="mt-3" data-etat="ok">
    <label for="{ident}" class="block text-[16px] font-semibold text-neutre-800">Pourquoi <span class="font-normal text-neutre-700">(facultatif)</span></label>
    <textarea id="{ident}" rows="2" data-doux="80" data-dur="80" oninput="compter(this)" aria-describedby="{ident}-compte"
              class="champ mt-1.5 block w-full min-h-[52px] px-3.5 py-3 rounded-xl text-corps leading-snug text-neutre-900">{pq}</textarea>
    <p id="{ident}-compte" class="compteur tnum mt-1.5 flex items-start justify-end gap-1.5 text-[16px]">{len(pq)} / 80</p>
  </div>
</li>"""


def suggestion_lieu(ident, avant, gras, apres, type_, icone, active=False):
    fond = " bg-teal-50" if active else ""
    return f"""<li id="{ident}" role="option" aria-selected="{'true' if active else 'false'}" class="flex items-center gap-3 min-h-[52px] px-3 py-2 rounded-xl cursor-pointer{fond} hover:bg-teal-50">
  <span class="lieu shrink-0" aria-hidden="true"><svg class="w-[18px] h-[18px]"><use href="#{icone}"/></svg></span>
  <span class="min-w-0"><span class="block text-corps text-teal-900">{avant}<strong class="font-semibold">{gras}</strong>{apres}</span><span class="block text-[16px] text-neutre-700">{type_}</span></span>
</li>"""


def suggestion_voisin(ident, avant, gras, apres, voisin, photo, active=False):
    """A place that is a voisin's business: their portrait, not a type icon."""
    fond = " bg-teal-50" if active else ""
    return f"""<li id="{ident}" role="option" aria-selected="{'true' if active else 'false'}" class="flex items-center gap-3 min-h-[52px] px-3 py-2 rounded-xl cursor-pointer{fond} hover:bg-teal-50">
  <img src="{photo}" alt="" width="128" height="128"
       class="arche w-[38px] h-[46px] shrink-0 object-cover" style="object-position:50% 22%; box-shadow: 0 0 0 2px #fff, 0 0 0 4px var(--color-sauge-700)">
  <span class="min-w-0"><span class="block text-corps text-teal-900">{avant}<strong class="font-semibold">{gras}</strong>{apres}</span><span class="block text-[16px] text-neutre-700">{voisin}</span></span>
</li>"""


def recherche_lieu(p):
    """The typeahead over the OSM snapshot and the voisins' own addresses:
    « cab » finds Camille Roussel's practice, then an OSM theatre."""
    return f"""<div class="mt-5">
  <label for="{p}-q" class="block text-[16px] font-semibold text-neutre-800">Ajouter un lieu</label>
  <div class="relative mt-1.5">
    <svg class="w-5 h-5 absolute left-3.5 top-[16px] text-teal-600 pointer-events-none" aria-hidden="true"><use href="#i-loupe"/></svg>
    <input id="{p}-q" type="text" role="combobox" aria-autocomplete="list" aria-expanded="true" aria-controls="{p}-q-liste"
           aria-activedescendant="{p}-q-1" value="cab" autocomplete="off"
           class="champ w-full min-h-[52px] pl-11 pr-3.5 rounded-xl text-corps text-neutre-900">
  </div>
  <ul id="{p}-q-liste" role="listbox" aria-label="Lieux trouvés" class="flottant mt-2 rounded-[16px] bg-white list-none p-1.5 m-0">
    {suggestion_voisin(p + '-q-1', '', 'Cab', 'inet Souffle Clair', 'Camille Roussel, sophrologue', PHOTO_CAMILLE, True)}
    {suggestion_lieu(p + '-q-2', 'La ', 'Cab', 'ane', 'Culture', 'l-culture')}
  </ul>
  <p class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[16px] text-neutre-700">
    Pas dans la liste&nbsp;?
    <a href="#f-14c" class="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full text-corps font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100">
      <svg class="w-5 h-5" aria-hidden="true"><use href="#i-carte"/></svg>Placer sur la carte
    </a>
  </p>
</div>"""


AJOUTER_LIEU = """<button type="button" class="mt-4 inline-flex items-center gap-2 min-h-[48px] px-5 rounded-full text-corps font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100">
  <svg class="w-5 h-5" aria-hidden="true"><use href="#i-plus"/></svg>Ajouter un lieu
</button>"""

MAXIMUM = """<p class="mt-3 flex items-start gap-2.5 rounded-[16px] bg-neutre-100 px-4 py-3 text-[16px] text-neutre-800">
  <svg class="w-[18px] h-[18px] mt-0.5 shrink-0 text-teal-700" aria-hidden="true"><use href="#i-coche"/></svg>
  Cinq lieux, c'est le maximum. Pour en changer, retirez-en un.
</p>"""


def phrase_lieux(p, valeur):
    """The slide's optional sentence (fields doc §7, 160 hard). Not in
    b-v2-lieux: the zone of b-v2-champ with its label above."""
    txt, etat = compteur_txt(len(valeur), 160, 160)
    return f"""<div class="mt-8" data-etat="{etat}">
  <label for="{p}-phrase" class="block text-[16px] font-semibold text-neutre-800">Une phrase pour les présenter <span class="font-normal text-neutre-700">(facultatif)</span></label>
  <textarea id="{p}-phrase" rows="4" data-doux="160" data-dur="160" oninput="compter(this)" aria-describedby="{p}-phrase-compte"
            class="champ mt-1.5 block w-full min-h-[104px] px-3.5 py-3 rounded-xl text-corps leading-relaxed text-neutre-900">{valeur}</textarea>
  <p id="{p}-phrase-compte" class="compteur tnum mt-1.5 flex items-start justify-end gap-1.5 text-[16px]">{txt}</p>
</div>"""


def lieux(p, variante):
    if variante == "recherche":
        cles = ["ptits", "pouvillon"]
        liste = f"""<ul class="mt-4 grid gap-2.5 list-none p-0 m-0">
{chr(10).join(lieu_court(c) for c in cles)}
</ul>
{recherche_lieu(p)}"""
        apres, phrase = "", ""
    else:
        cles = ["ptits", "pouvillon", "bar500"] if variante == "liste" else ["ptits", "bar500", "pouvillon", "autrerive", "ucpa"]
        fin = AJOUTER_LIEU if variante == "liste" else MAXIMUM
        liste = f"""<ul class="mt-4 grid grid-cols-[minmax(0,1fr)] gap-3 list-none p-0 m-0">
{chr(10).join(lieu_complet(p, i, c) for i, c in enumerate(cles, 1))}
</ul>
{fin}"""
        phrase = PHRASE_LIEUX if variante == "max" else ""
        apres = phrase_lieux(p, phrase) + apercu_diapo(p + "-d", diapo_lieux(cles, phrase), 6)
    return form(f"""{entete_histoire(14, '#f-13')}
<div class="@container px-5">
  <p class="mt-6 text-[16px] text-neutre-700">Facultatif</p>
  <fieldset class="min-w-0 border-0 p-0 m-0">
    <legend class="ff mt-1 text-nom mots-entiers text-teal-900" style="--taille:var(--text-nom); --mot:12"><h1 class="contents">Vos lieux favoris à la Cartoucherie</h1></legend>
    <p class="mt-1 text-[16px] text-neutre-700">{len(cles)} sur 5</p>
    {liste}
  </fieldset>
  {apres}
</div>""", barre_histoire("Continuer", "#f-15"), PIED)


def placer(p):
    """« Placer sur la carte » (b-v2-lieux, specimen 3): tap the plan, name, type."""
    types = [("cafe", "Café, bar", "l-cafe"), ("restaurant", "Restaurant", "l-restaurant"), ("parc", "Parc, jardin", "l-parc"),
             ("boutique", "Boutique", "l-boutique"), ("sport", "Sport", "l-sport"), ("culture", "Culture", "l-culture"),
             ("autre", "Autre", "l-autre")]
    cases = "\n".join(
        f'      <label class="choix flex items-center gap-2.5 min-h-[52px]! py-2! px-3!"><input type="radio" name="{p}-type" value="{v}" class="sr-only"{" checked" if v == "sport" else ""}>'
        f'<svg class="w-5 h-5 shrink-0 text-sauge-700" aria-hidden="true"><use href="#{ic}"/></svg><span class="text-[16px] font-semibold text-teal-900">{l}</span></label>'
        for v, l, ic in types)
    return form(f"""{entete_histoire(14, '#f-14b')}
<div class="@container px-5 pt-6">
  <fieldset class="min-w-0 border-0 p-0 m-0">
    <legend class="ff text-nom mots-entiers text-teal-900" style="--taille:var(--text-nom); --mot:6"><h1 class="contents">Placer un lieu sur le plan</h1></legend>
    <p id="{p}-plan-aide" class="mt-1 text-[16px] text-neutre-700">Touchez le plan à l'endroit du lieu. Le plan défile avec le doigt.</p>
    <div class="relative mt-4 w-[350px] max-w-full h-[220px] overflow-hidden rounded-[18px] bg-neutre-200"
         style="box-shadow: inset 0 0 0 1px var(--color-neutre-300)">
      <svg class="absolute left-0 top-0" width="350" height="220" viewBox="100 340 350 220" role="img" aria-label="Plan du quartier, autour des Halles"><use href="#plan-quartier" width="722" height="676"/></svg>
      <span class="lieu-cible" style="left:148px; top:168px" aria-hidden="true"><span class="lieu lieu--pose"><svg class="w-[18px] h-[18px]"><use href="#l-sport"/></svg></span></span>
    </div>
    <p class="mt-1.5 text-[15px] text-neutre-700">Plan&nbsp;: © les contributeurs OpenStreetMap</p>
    <div class="mt-5" data-etat="ok">
      <label for="{p}-nom" class="block text-[16px] font-semibold text-neutre-800">Le nom du lieu</label>
      <input id="{p}-nom" type="text" value="Le terrain de pétanque du jardin"
             class="champ mt-1.5 w-full min-h-[52px] px-3.5 rounded-xl text-corps text-neutre-900">
    </div>
    <fieldset class="mt-5 min-w-0 border-0 p-0 m-0">
      <legend class="block mb-2 text-[16px] font-semibold text-neutre-800">Son type</legend>
      <div class="grid grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))] gap-2">
{cases}
      </div>
    </fieldset>
    <div class="mt-5 flex flex-wrap gap-2.5">
      <button type="submit" class="flex-1 inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded-full text-corps font-semibold text-white bg-teal-700 hover:bg-teal-600">
        <svg class="w-5 h-5" aria-hidden="true"><use href="#i-plus"/></svg>Ajouter ce lieu
      </button>
      <a href="#f-14b" class="inline-flex items-center justify-center min-h-[48px] px-5 rounded-full text-corps font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100">
        Annuler
      </a>
    </div>
    <p class="mt-3 text-[16px] text-neutre-700">Adrien vérifie le lieu avec votre fiche.</p>
  </fieldset>
</div>""", "")
