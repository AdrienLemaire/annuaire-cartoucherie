"""The screens. Each function returns the inside of one 360 px frame."""
from parts import *

S = dict(  # Sophie Arnaud — fictional, the styleguide's v2 heroine
    nom="Sophie Arnaud", metier="Naturopathe", enseigne="Cabinet du Bois Vert",
    accroche="J'aide les adultes fatigués à retrouver de l'énergie&nbsp;: alimentation, digestion, sommeil. Bilan complet, puis un suivi simple, à votre rythme.",
    accroche_brut="J'aide les adultes fatigués à retrouver de l'énergie : alimentation, digestion, sommeil. Bilan complet, puis un suivi simple, à votre rythme.",
    bio="Installée allée du Bois Vert depuis 2021, j'accompagne surtout des adultes fatigués, des femmes en période de transition et des étudiants en fin d'année. La première séance dure une heure et demie : on fait le point sur l'alimentation, le sommeil, la digestion et le stress, sans jugement. Je vous remets ensuite un programme simple, adapté à votre quotidien et à votre budget. Le suivi se fait chaque mois, au cabinet ou en visio, et vous pouvez m'écrire entre deux séances.",
    services=["Bilan naturopathique", "Suivi mensuel", "Consultation en visio"],
    tel="+33639980026", tel_lisible="06&nbsp;39&nbsp;98&nbsp;00&nbsp;26",
    email="sophie.arnaud@example.fr", site="sophiearnaud-naturo.fr", insta="sophie.naturo",
    tarifs="Bilan d'1 h 30 : 70 € · suivi : 50 €", horaires="Du mardi au samedi, 9 h – 18 h",
    resa="calendly.com/sophie-arnaud-naturo", resa_hote="calendly.com", langues="anglais et espagnol",
)


def pratique_sophie():
    """b-v2-pratique with Sophie's answers: the lines and « Réserver en ligne »."""
    return pratique([("Parle aussi", S["langues"]), ("Tarifs", NB(S["tarifs"])), ("Horaires", S["horaires"])],
                    resa="#", resa_hote=S["resa_hote"])
NB = lambda s: s.replace(" : ", "&nbsp;: ")


def form(corps, barre_html=None, pied="pb-[96px]"):
    return f"""<form class="{pied}" onsubmit="return false">
{corps}
{barre_html if barre_html is not None else barre()}
</form>"""


# ═══════════════════════════ CONNEXION ════════════════════════════════════
def s_apropos():
    return f"""{entete_site()}
<main class="px-5 pt-8 pb-8">
  <h1 class="ff text-grand text-teal-900">À propos</h1>
  <p class="mt-4 text-corps text-neutre-800">L'annuaire présente les voisins qui travaillent à la Cartoucherie&nbsp;: artisans, soignants, commerçants. Gratuit, sans publicité.</p>
  <section class="relative mt-8 rounded-[26px] bg-sable-100 px-5 py-7 overflow-hidden" aria-labelledby="t-pro">
    <div class="ventouses pointer-events-none absolute inset-x-0 top-0 h-[220px]"
         style="-webkit-mask-image:linear-gradient(to bottom,#000 58%,transparent); mask-image:linear-gradient(to bottom,#000 58%,transparent)"></div>
    <div class="relative">
      <div class="w-[112px] h-[112px] rounded-full bg-sable-200 overflow-hidden grid place-items-center"
           style="box-shadow: inset 0 0 0 2px var(--color-sable-300), 0 0 0 8px var(--color-sable-50)">
        <img src="../_shared/colly/colly-salut.png" alt="" width="320" height="305" class="croquis w-[128px] h-auto">
      </div>
      <h2 id="t-pro" class="ff mt-6 text-[28px] leading-tight text-teal-950">Vous êtes entrepreneur du quartier&nbsp;?</h2>
      <p class="mt-3 text-corps text-teal-950">Créez votre fiche vous-même, depuis votre téléphone. Adrien la relit avant de la publier.</p>
      <a href="#f-s2" class="cta mt-5 w-full inline-flex items-center justify-center gap-2 min-h-[54px] px-6 rounded-full text-[18px] font-bold tracking-tight transition">
        Créer ma fiche<svg class="w-5 h-5" aria-hidden="true"><use href="#i-chev"/></svg>
      </a>
      <p class="mt-3 text-center text-[16px] text-teal-950">Vous en avez déjà une&nbsp;? <a href="#f-s2" class="inline-flex items-center min-h-[44px] font-semibold text-teal-700 underline underline-offset-4 decoration-teal-300 hover:decoration-teal-600">Me connecter</a></p>
    </div>
  </section>
</main>
<footer class="border-t border-neutre-200 bg-neutre-50">
  <div class="px-5 py-8">
    <p class="flex items-center gap-2.5">
      <svg class="w-7 h-7 text-teal-700" aria-hidden="true"><use href="#i-ventouse"/></svg>
      <span class="ff text-[20px] text-teal-900">Annuaire de la Cartoucherie</span>
    </p>
    <nav class="mt-4 text-[16px]" aria-label="Liens de pied de page">
      <ul class="space-y-1 list-none p-0 m-0">
        <li><a class="inline-flex items-center min-h-[44px] text-teal-700 underline underline-offset-4 decoration-teal-300 hover:decoration-teal-600" href="#">À propos</a></li>
        <li><a class="inline-flex items-center min-h-[44px] text-teal-700 underline underline-offset-4 decoration-teal-300 hover:decoration-teal-600" href="#">Confidentialité</a></li>
        <li><a class="inline-flex items-center min-h-[44px] text-teal-700 underline underline-offset-4 decoration-teal-300 hover:decoration-teal-600" href="#">Mentions légales</a></li>
        <li><a class="inline-flex items-center min-h-[44px] text-teal-700 underline underline-offset-4 decoration-teal-300 hover:decoration-teal-600" href="#">Avis&nbsp;: comment ça marche</a></li>
        <li><a class="inline-flex items-center min-h-[44px] text-teal-700 underline underline-offset-4 decoration-teal-300 hover:decoration-teal-600" href="#f-s2">Espace entrepreneur</a></li>
      </ul>
    </nav>
  </div>
</footer>"""


def s_connexion(p, valeur, erreur=None, titre="Connexion", intro=None, bouton="Recevoir mon lien", tete=None):
    intro = intro or "Sans mot de passe&nbsp;: on vous envoie un lien par e-mail."
    tete = tete or ""
    return f"""{entete_site()}
<main class="px-5 pt-8 pb-10">
  {tete}
  <p class="text-etiquette font-semibold uppercase text-sauge-800">Espace entrepreneur</p>
  <h1 class="ff mt-1.5 text-nom text-teal-900">{titre}</h1>
  <p class="mt-3 text-corps text-neutre-800">{intro}</p>
  <form class="mt-6" onsubmit="return false" novalidate>
    {champ(p + '-mail', 'Votre e-mail', valeur, type_='email', attrs='autocomplete="email" inputmode="email"', erreur=erreur)}
    {turnstile()}
    <button type="submit"
            class="cta mt-5 w-full inline-flex items-center justify-center gap-2 min-h-[54px] px-6 rounded-full text-[18px] font-bold tracking-tight transition">
      <svg class="w-5 h-5" aria-hidden="true"><use href="#i-mail"/></svg>{bouton}
    </button>
  </form>
</main>"""


def s_courriel():
    return f"""{entete_site()}
<main class="px-5 pt-10 pb-10">
  <span class="pastille pastille--teal w-16 h-16 bg-teal-50 text-teal-700" aria-hidden="true"><svg class="w-8 h-8"><use href="#i-mail"/></svg></span>
  <h1 class="ff mt-6 text-nom text-teal-900">Regardez vos e-mails</h1>
  <p class="mt-3 text-corps text-neutre-800">Lien envoyé à <strong class="font-semibold text-neutre-900 break-words">sophie<wbr>.arnaud<wbr>@example<wbr>.fr</strong>. Il sert une fois, pendant 15&nbsp;minutes.</p>
  <p class="mt-3 text-[16px] text-neutre-700">Rien reçu&nbsp;? Regardez dans les courriers indésirables.</p>
  <div class="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
    <button type="button" class="inline-flex items-center gap-2 min-h-[48px] px-5 rounded-full text-corps font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100">
      <svg class="w-5 h-5" aria-hidden="true"><use href="#i-mail"/></svg>Renvoyer le lien
    </button>
    <a href="#f-s2" class="inline-flex items-center min-h-[44px] text-[16px] font-semibold text-teal-700 underline underline-offset-4 decoration-teal-300 hover:decoration-teal-600">Changer d'adresse</a>
  </div>
</main>"""


def s_expire():
    return f"""{entete_site()}
<main class="px-5 pt-10 pb-10">
  <span class="pastille pastille--sable w-16 h-16 bg-white text-sable-800" aria-hidden="true"><svg class="w-8 h-8"><use href="#i-horloge"/></svg></span>
  <h1 class="ff mt-6 text-nom text-teal-900">Ce lien a expiré</h1>
  <p class="mt-3 text-corps text-neutre-800">Un lien sert une fois, pendant 15&nbsp;minutes. Votre brouillon, lui, est gardé&nbsp;: demandez un nouveau lien.</p>
  <form class="mt-6" onsubmit="return false" novalidate>
    {champ('s4-mail', 'Votre e-mail', '', type_='email', attrs='autocomplete="email" inputmode="email"')}
    {turnstile()}
    <button type="submit"
            class="cta mt-5 w-full inline-flex items-center justify-center gap-2 min-h-[54px] px-6 rounded-full text-[18px] font-bold tracking-tight transition">
      <svg class="w-5 h-5" aria-hidden="true"><use href="#i-mail"/></svg>Recevoir un nouveau lien
    </button>
  </form>
</main>"""


# ═══════════════════════════ 1 · VOUS ═════════════════════════════════════
GENRES = [("f", "elle", "«&nbsp;Ce qu'elle propose&nbsp;» · «&nbsp;Où la trouver&nbsp;»"),
          ("h", "il", "«&nbsp;Ce qu'il propose&nbsp;» · «&nbsp;Où le trouver&nbsp;»"),
          ("n", "iel", "«&nbsp;Ce qu'iel propose&nbsp;» · «&nbsp;Où lae trouver&nbsp;»")]


def genre(p, choix="f", erreur=False):
    cls = "groupe-erreur " if erreur else ""
    desc = f' aria-describedby="{p}-genre-err"' if erreur else ""
    msg = (f'<p id="{p}-genre-err" class="-mt-2 mb-4 flex items-start gap-1.5 text-[16px] font-semibold text-rouge-700">{ALERTE}Choisissez une réponse.</p>') if erreur else ""
    cartes = "\n".join(f"""    <label class="choix flex items-start gap-3.5">
      <input type="radio" name="{p}-genre" value="{v}" class="rond mt-0.5"{' checked' if v == choix else ''}>
      <span class="min-w-0 flex-1">
        <span class="ff block text-[24px] leading-none text-teal-900">{mot_}</span>
        <span class="mt-1.5 block text-[16px] leading-snug text-neutre-700">{formes}</span>
      </span>
    </label>""" for v, mot_, formes in GENRES)
    return f"""<fieldset id="{p}-genre" class="{cls}border-0 p-0 m-0"{desc}>
  <legend class="ff mb-4 text-[24px] leading-tight text-teal-900">Sur votre fiche, on écrit&nbsp;:</legend>
  {msg}
  <div class="grid gap-3">
{cartes}
  </div>
</fieldset>"""


def e1(p, erreur=False, choix="f"):
    nom = "" if erreur else S["nom"]
    apercu_html = apercu(p + "-ap", entete_fiche(nom=S["nom"], metier=S["metier"], enseigne=S["enseigne"]), not erreur and choix == "f")
    return form(f"""{entete_etape(1, '#f-s3')}
<div class="px-5">
  <h1 class="ff mt-6 text-nom text-teal-900">Votre nom et votre métier</h1>
  <div class="mt-6 grid grid-cols-[minmax(0,1fr)] gap-7">
    {champ(p + '-nom', "Votre nom, tel qu'il doit apparaître", nom, attrs='autocomplete="name"',
           erreur="Écrivez votre nom. Exemple&nbsp;: Sophie Arnaud" if erreur else None)}
    {genre(p, None if erreur else choix, erreur)}
    {champ(p + '-metier', 'Votre métier, en quelques mots', S['metier'], doux=45,
           aide="Il s'affiche sous votre nom. Par exemple&nbsp;: «&nbsp;Naturopathe&nbsp;», «&nbsp;Menuisier-ébéniste&nbsp;».", aide_sr='votre métier')}
    {champ(p + '-ens', 'Le nom de votre activité', S['enseigne'], facultatif=True, attrs='autocomplete="organization"')}
  </div>
  {apercu_html}
</div>""")


# ═══════════════════════════ 2 · OÙ VOUS CHERCHER ═════════════════════════
CATS = [
    ("sante-bien-etre", "Retrouver l'équilibre", "Santé &amp; bien-être", "c-sante"),
    ("beaute-soins", "Prendre soin de moi", "Beauté &amp; soins", "c-beaute"),
    ("artisanat-travaux", "Réparer, installer chez moi", "Artisanat &amp; travaux", "c-artisanat"),
    ("alimentation-traiteur", "Manger bon sans cuisiner ce soir", "Alimentation &amp; traiteur", "c-alimentation"),
    ("conseil-entreprise", "Faire tourner mon activité", "Conseil &amp; entreprise", "c-conseil"),
    ("numerique-creation", "Un site, un logo, une image", "Numérique &amp; création", "c-numerique"),
    ("enfance-education", "S'occuper des enfants, apprendre", "Enfance &amp; éducation", "c-enfance"),
    ("sport-mouvement", "Me remettre en mouvement", "Sport &amp; mouvement", "c-sport"),
    ("art-culture", "Un souvenir, une envie de créer", "Art &amp; culture", "c-art"),
    ("services-domicile", "Un coup de main chez moi", "Services à domicile", "c-domicile"),
    ("logement-immobilier", "Vendre, acheter ou louer", "Logement &amp; immobilier", "c-logement"),
]


def e2(p, coches):
    n = len(coches)
    trop = n > 2
    if trop:
        statut = (f'<p data-statut class="mt-1 flex items-start gap-1.5 text-[16px] font-semibold text-rouge-700">{ALERTE}'
                  f'Deux au maximum&nbsp;: décochez-en une.</p>')
    else:
        statut = f'<p data-statut class="mt-1 text-[16px] text-neutre-700">{n} sur 2' + ("&nbsp;: c'est le maximum." if n == 2 else "") + "</p>"
    cartes = "\n".join(f"""    <label class="choix flex items-center gap-3.5">
      <input type="checkbox" name="{p}-cat" value="{v}" class="case"{' checked' if v in coches else ''}>
      <span class="@container min-w-0 flex-1">
        <span class="ff block text-besoin mots-entiers text-teal-800" style="--taille:var(--text-besoin); --mot:{mot(besoin)}">{besoin}</span>
        <span class="block text-[16px] leading-snug text-neutre-700">{nom}</span>
      </span>
      <span class="pastille w-9 h-9 bg-white text-sauge-700" aria-hidden="true"><svg class="w-[18px] h-[18px]"><use href="#{ic}"/></svg></span>
    </label>""" for v, besoin, nom, ic in CATS)
    return form(f"""{entete_etape(2, '#f-1a')}
<div class="@container px-5">
  <fieldset class="{'groupe-erreur ' if trop else ''}mt-6 min-w-0 border-0 p-0 m-0" data-max="2" onchange="compterChoix(this)">
    <legend class="ff text-nom mots-entiers text-teal-900" style="--taille:var(--text-nom); --mot:10"><h1 class="contents">Vos voisins vous trouvent quand ils cherchent…</h1></legend>
    {statut}
    <div class="mt-4 grid gap-2.5">
{cartes}
      <label class="choix flex items-center gap-3.5 choix--libre mt-2">
        <input type="checkbox" name="{p}-cat-aucune" value="aucune" class="case">
        <span class="min-w-0 flex-1">
          <span class="block text-corps font-semibold text-teal-900">Aucune ne convient</span>
          <span class="block text-[16px] leading-snug text-neutre-700">Adrien reçoit un mot et vous répond.</span>
        </span>
      </label>
    </div>
  </fieldset>
</div>""")


# ═══════════════════════════ 3 · PHOTO ════════════════════════════════════
def e3_vide():
    return form(f"""{entete_etape(3, '#f-2a')}
<div class="px-5">
  <h1 class="ff mt-6 text-nom text-teal-900">Une photo de vous</h1>
  <div class="pt-6 flex flex-col items-center text-center">
    <div class="arche grid place-items-center w-[172px] h-[208px] bg-neutre-100"
         style="outline:2px dashed var(--color-neutre-500); outline-offset:-2px">
      <span class="pastille pastille--teal w-14 h-14 bg-white text-teal-700" aria-hidden="true"><svg class="w-7 h-7"><use href="#i-photo"/></svg></span>
    </div>
    <p class="mt-4 text-[16px] text-neutre-700">Une seule personne, vous, de face et en pleine lumière.</p>
    <label class="mt-4 inline-flex items-center gap-2 min-h-[48px] px-5 rounded-full text-corps font-semibold text-white bg-teal-700 hover:bg-teal-600 cursor-pointer has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-teal-600">
      <svg class="w-5 h-5" aria-hidden="true"><use href="#i-photo"/></svg>Choisir une photo
      <input type="file" accept="image/jpeg,image/png,image/webp" class="sr-only">
    </label>
  </div>
</div>""")


def e3_cadre():
    return form(f"""{entete_etape(3, '#f-2a', statut='envoi')}
<div class="px-5">
  <h1 class="ff mt-6 text-nom text-teal-900">Une photo de vous</h1>
  <div class="mt-5">
    <div class="relative rounded-[24px] bg-teal-950 px-5 pt-6 pb-4 overflow-hidden">
      <div class="ventouses ventouses--teal absolute inset-0" aria-hidden="true"></div>
      <div class="recadrage relative mx-auto w-[176px] h-[176px]">
        <img src="{PHOTO_SOPHIE}" alt="Votre photo, à recadrer" width="128" height="128">
        <div class="recadrage__arche" aria-hidden="true"></div>
        <div class="recadrage__visage" aria-hidden="true"></div>
      </div>
      <p class="relative mt-3 text-center text-[16px] text-teal-100">Le visage dans l'ovale. Glissez pour ajuster.</p>
      <label class="relative mt-1 flex items-center gap-3 text-[16px] font-semibold text-white">
        Zoom
        <input type="range" min="1" max="2" step="0.05" value="1" class="flex-1 min-h-[44px] accent-teal-300">
      </label>
    </div>
    <ul class="mt-5 flex items-end justify-center gap-6 list-none p-0 m-0 text-center text-[16px] text-neutre-700">
      <li>
        <img src="{PHOTO_SOPHIE}" alt="" width="128" height="128"
             class="arche mx-auto w-[64px] h-[78px] object-cover" style="object-position:50% 22%; box-shadow: 0 0 0 3px #fff, var(--shadow-carte)">
        <span class="mt-2 block">Fiche</span>
      </li>
      <li>
        <img src="{PHOTO_SOPHIE}" alt="" width="128" height="128"
             class="mx-auto w-[46px] h-[60px] rounded-[8px] object-cover" style="object-position:50% 25%; box-shadow: var(--shadow-carte)">
        <span class="mt-2 block">Liste</span>
      </li>
      <li>
        <img src="{PHOTO_SOPHIE}" alt="" width="128" height="128"
             class="mx-auto w-[52px] h-[52px] rounded-full object-cover" style="object-position:50% 22%; box-shadow: 0 0 0 3px #fff, var(--shadow-carte)">
        <span class="mt-2 block">Plan</span>
      </li>
    </ul>
    <div class="mt-5 text-center">
      <label class="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full text-corps font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 cursor-pointer has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-teal-600">
        Choisir une autre photo
        <input type="file" accept="image/jpeg,image/png,image/webp" class="sr-only">
      </label>
    </div>
  </div>
</div>""")


def e3_petite():
    return form(f"""{entete_etape(3, '#f-2a')}
<div class="px-5">
  <h1 class="ff mt-6 text-nom text-teal-900">Une photo de vous</h1>
  <div class="mt-6">
    <div class="flex items-center gap-4 rounded-[18px] bg-rouge-50 p-4"
         style="box-shadow: inset 0 0 0 1.5px var(--color-rouge-600)">
      <img src="https://randomuser.me/api/portraits/med/women/26.jpg" alt="La photo choisie, en 72 × 72 pixels"
           width="72" height="72" class="w-[72px] h-[72px] shrink-0 rounded-[10px]">
      <p role="alert" class="flex items-start gap-1.5 text-[16px] font-semibold text-rouge-700">
        {ALERTE}
        <span>Photo trop petite&nbsp;: <span class="tnum">72&nbsp;×&nbsp;72</span>&nbsp;px. Il en faut au moins <span class="tnum">200</span> de côté.</span>
      </p>
    </div>
    <p class="mt-3 text-[16px] text-neutre-700">Une photo prise avec votre téléphone convient.</p>
    <label class="mt-4 inline-flex items-center gap-2 min-h-[48px] px-5 rounded-full text-corps font-semibold text-white bg-teal-700 hover:bg-teal-600 cursor-pointer has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-teal-600">
      <svg class="w-5 h-5" aria-hidden="true"><use href="#i-photo"/></svg>Choisir une autre photo
      <input type="file" accept="image/jpeg,image/png,image/webp" class="sr-only">
    </label>
  </div>
</div>""")


# ═══════════════════════════ 4 · EN UNE PHRASE ════════════════════════════
LONG = ("J'aide les adultes fatigués à retrouver de l'énergie : alimentation, digestion, sommeil, stress. "
        "Bilan complet à la première séance, puis un suivi simple chaque mois, à votre rythme, au cabinet ou en visio.")


def e4(p, erreur=False):
    valeur = LONG if erreur else S["accroche_brut"]
    ent = entete_fiche(nom=S["nom"], metier=S["metier"], enseigne=S["enseigne"], photo=PHOTO_SOPHIE,
                       alt="Portrait de Sophie Arnaud, naturopathe à la Cartoucherie",
                       chips=CHIP_SANTE, accroche=S["accroche"])
    return form(f"""{entete_etape(4, '#f-3b')}
<div class="px-5">
  {zone(p + '-acc', "En une phrase&nbsp;: ce que vous faites pour vos voisins", valeur, doux=160, dur=200, rows=5 if erreur else 4,
        aide="Écrivez «&nbsp;je&nbsp;». C'est la phrase sous votre nom, et celle que Google montre.", aide_sr="l'accroche", h1=True)}
  {apercu(p + '-ap', ent, not erreur)}
</div>""")


# ═══════════════════════════ 5 · CE QUE VOUS PROPOSEZ ═════════════════════
def services_liste(p, services, erreur=False):
    lignes = []
    for i, s in enumerate(services, 1):
        if erreur:
            lignes.append(f"""<li data-etat="erreur" class="flex flex-wrap items-center gap-2.5">
  <label for="{p}-serv-{i}" class="pastille w-9 h-9 bg-white text-sauge-800 tnum text-[16px] font-bold"><span class="sr-only">Service </span><span>{i}</span></label>
  <input id="{p}-serv-{i}" type="text" aria-invalid="true" aria-describedby="{p}-serv-err" class="champ min-w-0 flex-1 min-h-[52px] px-3.5 rounded-xl text-corps text-neutre-900">
  <button type="button" hidden onclick="retirerService(this)" aria-label="Retirer le service 1" class="grid place-items-center w-11 h-11 shrink-0 rounded-full text-teal-700 hover:bg-teal-50"><svg class="w-5 h-5" aria-hidden="true"><use href="#i-corbeille"/></svg></button>
  <p data-message id="{p}-serv-err" class="basis-full pl-[46px] flex items-start gap-1.5 text-[16px] font-semibold text-rouge-700">
    {ALERTE}
    Écrivez au moins un service. Exemple&nbsp;: «&nbsp;Bilan naturopathique&nbsp;»
  </p>
</li>""")
        else:
            lignes.append(f"""<li class="flex items-center gap-2.5">
  <label for="{p}-serv-{i}" class="pastille w-9 h-9 bg-white text-sauge-800 tnum text-[16px] font-bold"><span class="sr-only">Service </span><span>{i}</span></label>
  <input id="{p}-serv-{i}" type="text" value="{s}" class="champ min-w-0 flex-1 min-h-[52px] px-3.5 rounded-xl text-corps text-neutre-900">
  <button type="button" onclick="retirerService(this)" aria-label="Retirer le service {i}"
          class="grid place-items-center w-11 h-11 shrink-0 rounded-full text-teal-700 hover:bg-teal-50">
    <svg class="w-5 h-5" aria-hidden="true"><use href="#i-corbeille"/></svg>
  </button>
</li>""")
    n = len(services)
    return f"""<fieldset class="min-w-0 border-0 p-0 m-0">
  <legend class="ff text-[24px] leading-tight text-teal-900">Vos services</legend>
  <p class="mt-1 text-[16px] text-neutre-700"><span data-nombre>{n} sur 6</span> · un service par ligne</p>
  <ol id="{p}-serv" data-max="6" class="mt-4 grid grid-cols-[minmax(0,1fr)] gap-2.5 list-none p-0 m-0">
{chr(10).join(lignes)}
  </ol>
  <button type="button" data-ajouter onclick="ajouterService(this)"
          class="mt-4 inline-flex items-center gap-2 min-h-[48px] px-5 rounded-full text-corps font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100">
    <svg class="w-5 h-5" aria-hidden="true"><use href="#i-plus"/></svg>Ajouter un service
  </button>
  <p data-plein hidden class="mt-4 text-[16px] text-neutre-700">Six services, c'est le maximum.</p>
</fieldset>"""


BIO_AIDE = """<ul class="grid gap-1 list-none p-0 m-0">
  <li class="flex gap-2"><svg class="w-4 h-4 mt-1 shrink-0 text-teal-600" aria-hidden="true"><use href="#i-ventouse"/></svg>Depuis quand êtes-vous ici&nbsp;?</li>
  <li class="flex gap-2"><svg class="w-4 h-4 mt-1 shrink-0 text-teal-600" aria-hidden="true"><use href="#i-ventouse"/></svg>Pour qui travaillez-vous&nbsp;?</li>
  <li class="flex gap-2"><svg class="w-4 h-4 mt-1 shrink-0 text-teal-600" aria-hidden="true"><use href="#i-ventouse"/></svg>Comment se passe un rendez-vous&nbsp;?</li>
</ul>"""


def e5(p, erreur=False):
    ap = (section_portrait(p + "-t-portrait", "Son portrait", S["bio"], "Texte écrit par Sophie elle-même.", pad="px-4 py-5")
          + section_services(p + "-t-serv", "Ce qu'elle propose", S["services"], pad="px-4 py-5"))
    ap = f'<div class="rounded-[20px] bg-white overflow-hidden">{ap}</div>'
    return form(f"""{entete_etape(5, '#f-4a')}
<div class="px-5">
  <h1 class="ff mt-6 text-nom text-teal-900">Ce que vous proposez</h1>
  <div class="mt-6 grid grid-cols-[minmax(0,1fr)] gap-8">
    {zone(p + '-bio', 'Présentez-vous comme à un voisin', S['bio'], doux=600, dur=800, rows=9,
          aide=BIO_AIDE, aide_sr='la présentation', aide_tag='div', aide_ouverte=not erreur)}
    {services_liste(p, [''] if erreur else S['services'], erreur)}
  </div>
  {apercu(p + '-ap', ap, not erreur)}
</div>""")


# ═══════════════════════════ 6 · OÙ VOUS TROUVER ══════════════════════════
def lieu(p, choix="adresse", erreur=False):
    a = " checked" if choix == "adresse" else ""
    d = " checked" if choix == "deplace" else ""
    return f"""<fieldset class="border-0 p-0 m-0">
  <legend class="ff mb-4 text-nom text-teal-900"><h1 class="contents">Où travaillez-vous&nbsp;?</h1></legend>
  <div class="grid gap-3">
    <label class="choix flex items-center gap-3.5">
      <input type="radio" name="{p}-lieu" value="adresse" class="rond"{a}>
      <span class="min-w-0 flex-1">
        <span class="block text-corps font-semibold text-teal-900">Je reçois à une adresse</span>
        <span class="block text-[16px] leading-snug text-neutre-700">Cabinet, atelier, boutique.</span>
      </span>
      <span class="pastille pastille--teal w-10 h-10 bg-white text-teal-700" aria-hidden="true"><svg class="w-5 h-5"><use href="#i-pin"/></svg></span>
    </label>
    <label class="choix flex items-center gap-3.5">
      <input type="radio" name="{p}-lieu" value="deplace" class="rond"{d}>
      <span class="min-w-0 flex-1">
        <span class="block text-corps font-semibold text-teal-900">Je me déplace</span>
        <span class="block text-[16px] leading-snug text-neutre-700">Chez vos clients, ou en visio. Aucune adresse affichée.</span>
      </span>
      <span class="pastille pastille--teal w-10 h-10 bg-white text-teal-700" aria-hidden="true"><svg class="w-5 h-5"><use href="#c-domicile"/></svg></span>
    </label>
  </div>
</fieldset>"""


def suggestion(ident, rue, ville, choisie=False, gras=""):
    fond = " bg-teal-50" if choisie else ""
    sel = "true" if choisie else "false"
    return f"""<li id="{ident}" role="option" aria-selected="{sel}" class="flex items-start gap-3 min-h-[52px] px-3 py-2.5 rounded-xl cursor-pointer hover:bg-teal-50{fond}">
  <svg class="w-5 h-5 mt-0.5 shrink-0 text-teal-600" aria-hidden="true"><use href="#i-pin"/></svg>
  <span class="min-w-0"><span class="block text-corps text-teal-900"><strong class="font-semibold">{gras}</strong>{rue[len(gras):]}</span>
  <span class="block text-[16px] text-neutre-700">{ville}</span></span>
</li>"""


def adresse(p, valeur, *, suggestions=None, trouvee=None, hors=False, erreur=None):
    """b-v2-adresse · combobox + listbox in the flow (it pushes « Précision »
    down instead of covering it at 200 %). Collapsed, the list stays, hidden."""
    etat = "erreur" if erreur else "ok"
    if suggestions:
        liste = (f'<ul id="{p}-adr-liste" role="listbox" aria-label="Adresses trouvées" '
                 f'class="flottant mt-2 rounded-[16px] bg-white list-none p-1.5 m-0">' + "".join(suggestions) + "</ul>")
    else:
        liste = f'<ul id="{p}-adr-liste" role="listbox" aria-label="Adresses trouvées" hidden></ul>'
    ok = (f'<p id="{p}-adr-ok" class="mt-1.5 flex items-start gap-1.5 text-[16px] text-sauge-800">'
          f'<svg class="w-[18px] h-[18px] shrink-0 mt-0.5" aria-hidden="true"><use href="#i-coche"/></svg>{trouvee}</p>') if trouvee else ""
    err = (f'<p id="{p}-adr-err" class="mt-1.5 flex items-start gap-1.5 text-[16px] font-semibold text-rouge-700">{ALERTE}<span>{erreur}</span></p>') if erreur else ""
    hors_html = f"""<div role="status" class="mt-3 flex items-start gap-3.5 rounded-[18px] bg-sable-100 p-4">
  <span class="pastille pastille--sable w-10 h-10 mt-0.5 bg-white text-sable-800" aria-hidden="true"><svg class="w-5 h-5"><use href="#i-signal"/></svg></span>
  <p class="text-[16px] leading-snug text-teal-950"><strong class="font-semibold">Hors du plan du quartier.</strong> Votre fiche paraîtra sans repère sur le plan. Adrien vérifie avant de publier.</p>
</div>""" if hors else ""
    exp = "true" if suggestions else "false"
    act = f' aria-activedescendant="{p}-adr-1"' if suggestions else ""
    inv = f' aria-invalid="true" aria-describedby="{p}-adr-err"' if erreur else (f' aria-describedby="{p}-adr-ok"' if trouvee else "")
    return f"""<div data-etat="{etat}">
  <label for="{p}-adr" class="block text-[16px] font-semibold text-neutre-800">L'adresse où vous recevez</label>
  <input id="{p}-adr" type="text" role="combobox" aria-autocomplete="list" aria-expanded="{exp}" aria-controls="{p}-adr-liste"{act}{inv}
         value="{valeur}" autocomplete="street-address"
         class="champ mt-1.5 w-full min-h-[52px] px-3.5 rounded-xl text-corps text-neutre-900">
  {liste}{ok}{err}
  {hors_html}
</div>"""


def domicile(p, coche):
    """The home question, then the map switch as a choice card (b-v2-choix):
    a home unticks the map by default; the person can tick it back."""
    c = " checked" if coche else ""
    plan = "" if coche else " checked"
    sous = ("Décoché pour un domicile&nbsp;: votre adresse reste écrite sur la fiche, sans repère sur le plan."
            if coche else "Un repère à votre adresse, sur le plan de la page «&nbsp;Carte&nbsp;».")
    return f"""<div class="grid gap-3">
  <label class="choix flex items-center gap-3.5">
    <input type="checkbox" name="{p}-domicile" class="case"{c}>
    <span class="min-w-0 flex-1 text-corps font-semibold text-teal-900">C'est aussi mon domicile</span>
  </label>
  <label class="choix flex items-start gap-3.5">
    <input type="checkbox" name="{p}-plan" class="case mt-0.5"{plan}>
    <span class="min-w-0 flex-1">
      <span class="block text-corps font-semibold text-teal-900">Afficher ma fiche sur le plan du quartier</span>
      <span class="block text-[16px] leading-snug text-neutre-700">{sous}</span>
    </span>
    <span class="pastille pastille--teal w-10 h-10 bg-white text-teal-700" aria-hidden="true"><svg class="w-5 h-5"><use href="#i-pin"/></svg></span>
  </label>
</div>"""


def e6(p, variante):
    if variante == "suggestions":
        bloc = adresse(p, "8 allée du bo", suggestions=[
            suggestion(p + "-adr-1", "8 Allée du Bois Vert", "31300 Toulouse", True, "8 Allée du Bo"),
            suggestion(p + "-adr-2", "8 Allée des Bouleaux", "31300 Toulouse", False, "8 Allée des Bo"),
            suggestion(p + "-adr-3", "8 Rue du Bourdon", "31300 Toulouse", False, "8 Rue du Bo"),
        ])
        precision, dom = "", domicile(p, False)
    elif variante == "domicile":
        bloc = adresse(p, "14 Rue Paul Mesplé, 31300 Toulouse", trouvee="Adresse trouvée · à 120&nbsp;m de la Halle")
        precision, dom = "", domicile(p, True)
    elif variante == "hors":
        bloc = adresse(p, "45 Avenue de Casselardit, 31300 Toulouse", trouvee="Adresse trouvée", hors=True)
        precision, dom = "", ""
    else:  # erreur
        bloc = adresse(p, "allée du Bois Vert", erreur="Ajoutez le numéro, puis choisissez votre adresse dans la liste.")
        precision, dom = "", ""
    prec = champ(p + "-prec", "Précision", "Au fond de la cour, porte verte" if variante == "suggestions" else "",
                 facultatif=True, aide="Un repère pour trouver la porte&nbsp;: «&nbsp;2<sup>e</sup> étage&nbsp;», «&nbsp;dans la Halle&nbsp;». Il s'affiche sous l'adresse.",
                 aide_sr="la précision") if variante != "erreur" else ""
    return form(f"""{entete_etape(6, '#f-5a')}
<div class="px-5 pt-6 grid grid-cols-[minmax(0,1fr)] gap-7">
  {lieu(p)}
  {bloc}
  {prec}
  {dom}
</div>""")


def e6_deplace(p):
    return form(f"""{entete_etape(6, '#f-5a')}
<div class="px-5 pt-6 grid grid-cols-[minmax(0,1fr)] gap-7">
  {lieu(p, 'deplace')}
  {champ(p + '-zone', 'Où intervenez-vous&nbsp;?', 'Dans tout le quartier et à Saint-Cyprien', doux=60)}
</div>""")


# ═══════════════════════════ 7 · VOUS JOINDRE ═════════════════════════════
def e7(p, variante="ok"):
    vide = variante == "vide"
    typo = variante == "typo"
    tel_val = "" if vide else "06.39.98.00.26"
    meme = variante == "ok"
    mail_val = "" if vide else ("sophie.arnaud@gmial.com" if typo else S["email"])
    grp_cls = "groupe-erreur " if vide else ""
    grp_desc = f' aria-describedby="{p}-joindre-err"' if vide else ""
    grp_msg = (f'<p id="{p}-joindre-err" class="mb-4 flex items-start gap-1.5 text-[16px] font-semibold text-rouge-700">{ALERTE}'
               f'<span>Indiquez un téléphone ou un e-mail&nbsp;: sans l\'un des deux, vos voisins ne peuvent pas vous joindre.</span></p>') if vide else ""
    ro = ' readonly' if meme else ""
    mail_fond = " bg-neutre-50" if meme else ""
    if typo:
        mail = f"""<div data-etat="long">
  <label for="{p}-mail" class="block text-[16px] font-semibold text-neutre-800">L'adresse e-mail affichée sur votre fiche</label>
  <label class="mt-1 flex items-center gap-3 min-h-[44px] cursor-pointer">
    <input type="checkbox" class="case"><span class="text-corps text-neutre-900">Même adresse que mon compte</span>
  </label>
  <input id="{p}-mail" type="email" value="{mail_val}" autocomplete="email" aria-describedby="{p}-mail-typo"
         class="champ mt-1 w-full min-h-[52px] px-3.5 rounded-xl text-corps text-neutre-900">
  <div id="{p}-mail-typo" class="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
    <p class="compteur flex items-start gap-1.5 text-[16px]">{ALERTE.replace(' mt-0.5','')}<span>Vouliez-vous dire <strong class="break-all">sophie.arnaud@gmail.com</strong>&nbsp;?</span></p>
    <button type="button" class="inline-flex items-center min-h-[44px] px-3.5 rounded-full text-[16px] font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100">Corriger</button>
  </div>
</div>"""
    else:
        mail = f"""<div>
  <label for="{p}-mail" class="block text-[16px] font-semibold text-neutre-800">L'adresse e-mail affichée sur votre fiche</label>
  <label class="mt-1 flex items-center gap-3 min-h-[44px] cursor-pointer">
    <input type="checkbox" class="case"{' checked' if meme else ''}><span class="text-corps text-neutre-900">Même adresse que mon compte</span>
  </label>
  <input id="{p}-mail" type="email"{f' value="{mail_val}"' if mail_val else ''}{ro} autocomplete="email"{' aria-invalid="true"' if vide else ''}
         class="champ mt-1 w-full min-h-[52px] px-3.5 rounded-xl text-corps text-neutre-900{mail_fond}">
</div>"""
    tel = f"""<div>
  <label for="{p}-tel" class="block text-[16px] font-semibold text-neutre-800">Le numéro où vos voisins peuvent vous appeler</label>
  <input id="{p}-tel" type="tel" inputmode="tel" autocomplete="tel"{f' value="{tel_val}"' if tel_val else ''}{' aria-invalid="true"' if vide else ''}
         class="champ mt-1.5 w-full min-h-[52px] px-3.5 rounded-xl text-corps text-neutre-900 tnum">
</div>"""
    contact = section_contact(p + "-t-contact", "La contacter", "\n".join([
        ligne_contact("#", "i-mail", "E-mail", S["email"]),
        ligne_contact("#", "i-globe", "Son site", S["site"]),
        ligne_contact("#", "i-insta", "Instagram", "@" + S["insta"]),
    ]), apres=f'<div class="mt-4">{appeler_en_ligne(S["tel"], S["tel_lisible"])}</div>', pad="px-4 py-5")
    ap = apercu(p + "-ap", f'<div class="rounded-[20px] bg-white overflow-hidden">{contact}</div>', variante == "ok")
    erreur_wrap = (' data-etat="erreur"' if vide else "")
    return form(f"""{entete_etape(7, '#f-6a')}
<div class="px-5">
  <h1 class="ff mt-6 text-nom text-teal-900">Comment vous joindre&nbsp;?</h1>
  <fieldset class="{grp_cls}mt-5 border-0 p-0 m-0"{grp_desc}{erreur_wrap}>
    <legend class="mb-4 text-[16px] text-neutre-700">Au moins l'un des deux&nbsp;:</legend>
    {grp_msg}
    <div class="grid gap-5">
      {tel}
      {mail}
    </div>
  </fieldset>
  <div class="mt-7 grid gap-5">
    {champ(p + '-site', 'Votre site internet', '' if vide else 'https://www.sophiearnaud-naturo.fr/', facultatif=True, type_='url', attrs='inputmode="url"')}
    {champ(p + '-insta', 'Votre compte Instagram', '' if vide else 'https://www.instagram.com/sophie.naturo/', facultatif=True, attrs='autocapitalize="none"')}
    {champ(p + '-li', 'Votre profil LinkedIn', '', facultatif=True, type_='url', attrs='inputmode="url"')}
  </div>
  {ap}
</div>""")


# ═══════════════════════════ 8 · INFOS PRATIQUES ══════════════════════════
LANGUES = [("Anglais", True), ("Espagnol", True), ("Arabe", False), ("Portugais", False), ("Italien", False),
           ("Allemand", False), ("Occitan", False), ("Langue des signes", False), ("Autre", False)]


def langues(p):
    cases = "\n".join(f"""    <label class="choix flex items-center gap-3 !min-h-[56px] !py-2.5 !px-3.5">
      <input type="checkbox" name="{p}-lang" class="case"{' checked' if c else ''}>
      <span class="min-w-0 text-corps leading-tight text-teal-900">{l}</span>
    </label>""" for l, c in LANGUES)
    return f"""<fieldset class="border-0 p-0 m-0">
  <legend class="text-[16px] font-semibold text-neutre-800">Vous parlez aussi… <span class="font-normal text-neutre-700">(facultatif)</span></legend>
  <div class="mt-2.5 grid grid-cols-2 gap-2.5">
{cases}
  </div>
</fieldset>"""


def e8(p, erreur=False):
    resa_val = "Sur Planity, Sophie Arnaud" if erreur else S["resa"]
    # b-v2-pratique, specimen 1: the identity card from the accroche down
    ap = f"""<div class="@container carte rounded-[24px] bg-white p-5">
      <p class="max-w-[56ch] text-[19px] leading-relaxed text-neutre-900">{S['accroche']}</p>
      {pratique_sophie()}
    </div>"""
    return form(f"""{entete_etape(8, '#f-7a')}
<div class="px-5">
  <h1 class="ff mt-6 text-nom text-teal-900">Infos pratiques</h1>
  <div class="mt-6 grid grid-cols-[minmax(0,1fr)] gap-6">
    {champ(p + '-tarifs', 'Vos tarifs', S['tarifs'], facultatif=True, doux=120,
           aide="Une ligne suffit&nbsp;: «&nbsp;Séance d'1&nbsp;h&nbsp;: 50&nbsp;€&nbsp;», «&nbsp;Sur devis&nbsp;».", aide_sr='vos tarifs')}
    {champ(p + '-horaires', 'Quand vous trouver&nbsp;?', S['horaires'], facultatif=True, doux=120)}
    {champ(p + '-resa', 'Un lien pour prendre rendez-vous', resa_val, facultatif=True, type_='url', attrs='inputmode="url" autocapitalize="none"',
           aide="L'adresse de votre page Calendly, Planity… Vos voisins réservent sans appeler.", aide_sr='le lien de réservation',
           erreur="Ce n'est pas un lien. Copiez l'adresse de votre page, par exemple&nbsp;: planity.com/votre-nom" if erreur else None)}
    {langues(p)}
  </div>
  {apercu(p + '-ap', ap, not erreur)}
</div>""")


# ═══════════════════════════ 9 · AVIS GOOGLE ══════════════════════════════
def e9(p, variante):
    val = {"ok": "https://maps.app.goo.gl/k3Rt9Wq2FvXcYz7A8", "erreur": "https://www.pagesjaunes.fr/pros/53012345",
           "aucune": ""}[variante]
    err = ("Ce lien n'est pas une fiche Google Maps. Dans Google Maps, ouvrez votre fiche, touchez «&nbsp;Partager&nbsp;», puis «&nbsp;Copier le lien&nbsp;»."
           if variante == "erreur" else None)
    ok = (f'<p class="mt-1.5 flex items-start gap-1.5 text-[16px] text-sauge-800"><svg class="w-[18px] h-[18px] shrink-0 mt-0.5" aria-hidden="true"><use href="#i-coche"/></svg>'
          f'Fiche trouvée&nbsp;: Sophrologie Camille Roussel, Toulouse</p>') if variante == "ok" else ""
    aucune = variante == "aucune"
    pourquoi = f"""<div class="mt-3 rounded-[18px] bg-teal-50 p-4">
  <p class="text-[16px] leading-snug text-teal-950">Une fiche Google recueille les avis de vos clients&nbsp;; vos voisins les liront depuis votre fiche.</p>
  <a href="https://www.google.com/business/" class="mt-1 inline-flex items-center gap-1.5 min-h-[44px] text-[16px] font-semibold text-teal-700 underline underline-offset-4 decoration-teal-300 hover:decoration-teal-600">
    Créer ma fiche Google, gratuite<svg class="w-4 h-4" aria-hidden="true"><use href="#i-chev"/></svg>
  </a>
  <p class="text-[16px] text-neutre-700">Vous pourrez coller le lien plus tard, depuis votre espace.</p>
</div>""" if aucune else ""
    inv = f' aria-invalid="true" aria-describedby="{p}-g-err"' if err else ""
    errh = (f'<p id="{p}-g-err" class="mt-1.5 flex items-start gap-1.5 text-[16px] font-semibold text-rouge-700">{ALERTE}<span>{err}</span></p>') if err else ""
    statut = "envoi" if variante == "ok" else "ok"
    return form(f"""{entete_etape(9, '#f-8a', statut=statut)}
<div class="px-5">
  <div data-etat="{'erreur' if err else 'ok'}">
    <div class="mt-6 flex flex-wrap items-start justify-between gap-x-3">
      <h1 class="ff text-nom text-teal-900"><label for="{p}-g">Votre fiche Google (pour vos avis)</label></h1>
      {bouton_aide(p + '-g-aide', 'trouver le lien', False).replace('-mb-0.5 ', '')}
    </div>
    <div id="{p}-g-aide" hidden class="bulle mt-3 rounded-[14px] bg-teal-50 px-4 py-3 text-[16px] leading-snug text-teal-950">
      Dans Google Maps, ouvrez votre fiche, touchez «&nbsp;Partager&nbsp;», puis «&nbsp;Copier le lien&nbsp;». Collez-le ici.
    </div>
    <input id="{p}-g" type="url" inputmode="url" autocapitalize="none"{f' value="{val}"' if val else ''}{inv}{' disabled' if aucune else ''}
           class="champ mt-4 w-full min-h-[52px] px-3.5 rounded-xl text-corps text-neutre-900{' opacity-60' if aucune else ''}">
    {errh}{ok}
  </div>
  <label class="choix choix--libre mt-5 flex items-center gap-3.5">
    <input type="checkbox" name="{p}-g-aucune" class="case"{' checked' if aucune else ''}>
    <span class="min-w-0 flex-1 text-corps font-semibold text-teal-900">Je n'en ai pas</span>
  </label>
  {pourquoi}
</div>""")


# ═══════════════════════════ VÉRIFIER ET ENVOYER ══════════════════════════
def rang(dt, dd, href, sr, *, vide=False, manque=False, extra="", ident=None):
    lien = "Ajouter" if vide else ("Compléter" if manque else "Modifier")
    cls = "groupe-erreur " if manque else ""
    if manque:
        dd_html = f'<dd class="col-start-1 m-0 flex items-start gap-1.5 text-[16px] font-semibold text-rouge-700">{ALERTE}À compléter</dd>'
    elif vide:
        dd_html = f'<dd class="col-start-1 m-0 text-corps italic text-neutre-700">{dd}</dd>'
    else:
        dd_html = f'<dd class="col-start-1 m-0 text-corps text-neutre-900{extra}">{dd}</dd>'
    idh = f' id="{ident}"' if ident else ""
    return f"""<div{idh} class="{cls}grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 py-3 border-b border-neutre-300">
  <dt class="text-[16px] font-semibold text-neutre-700">{dt}</dt>
  {dd_html}
  <dd class="col-start-2 row-start-1 row-span-2 m-0"><a href="{href}" class="inline-flex items-center min-h-[44px] text-[16px] font-semibold text-teal-700 underline underline-offset-4 decoration-teal-300 hover:decoration-teal-600">{lien}<span class="sr-only"> {sr}</span></a></dd>
</div>"""


def groupe(titre, rangs, premier=False):
    return f"""<h2 class="ff {'mt-7' if premier else 'mt-8'} text-[22px] text-teal-900">{titre}</h2>
<dl class="mt-2 m-0 border-t border-neutre-300">
{chr(10).join(rangs)}
</dl>"""


def relecture(p, manque_accroche=False):
    photo = f'<img src="{PHOTO_SOPHIE}" alt="Votre photo" width="128" height="128" class="arche w-[56px] h-[68px] object-cover" style="object-position:50% 22%">'
    services = '<ul class="list-none p-0 m-0">' + "".join(f"<li>{s}</li>" for s in S["services"]) + "</ul>"
    chip = ('<span class="chip inline-flex items-center gap-2 rounded-full px-3 py-1 text-[16px] font-semibold">'
            '<svg class="w-[18px] h-[18px]" aria-hidden="true"><use href="#c-sante"/></svg>Santé &amp; bien-être</span>')
    return "\n".join([
        groupe("Vous", [
            rang("Nom", S["nom"], "#f-1a", "le nom"),
            rang("On écrit", "elle — «&nbsp;Ce qu'elle propose&nbsp;»", "#f-1a", "l'accord"),
            rang("Métier", S["metier"], "#f-1a", "le métier"),
            rang("Nom de l'activité", S["enseigne"], "#f-1a", "le nom de l'activité"),
            rang("Photo", photo, "#f-3b", "la photo", extra=" mt-1.5"),
        ], premier=True),
        groupe("Votre activité", [
            rang("Catégorie", chip, "#f-2a", "les catégories", extra=" mt-1"),
            rang("En une phrase", S["accroche"], "#f-4a", "l'accroche", manque=manque_accroche, ident=p + "-acc"),
            rang("Présentation", S["bio"], "#f-5a", "la présentation"),
            rang("Services", services, "#f-5a", "les services"),
        ]),
        groupe("Vous trouver", [
            rang("Adresse", '8 allée du Bois Vert, 31300 Toulouse<span class="block text-[16px] text-neutre-700">Au fond de la cour, porte verte</span>'
                 '<span class="block text-[16px] text-neutre-700">Sur le plan du quartier · à 450&nbsp;m de la Halle</span>', "#f-6a", "l'adresse"),
        ]),
        groupe("Vous joindre", [
            rang("Téléphone", S["tel_lisible"], "#f-7a", "le téléphone", extra=" tnum"),
            rang("E-mail", wbr(S["email"]), "#f-7a", "l'e-mail", extra=" break-words"),
            rang("Site", f'<span class="@container block"><span class="block mots-entiers" style="--taille:var(--text-corps); --lettre:.56; --mot:12">{wbr(S["site"])}</span></span>', "#f-7a", "le site"),
            rang("Instagram", "@" + S["insta"], "#f-7a", "le compte Instagram"),
            rang("LinkedIn", "Non renseigné", "#f-7a", "le profil LinkedIn", vide=True),
        ]),
        groupe("Infos pratiques", [
            rang("Tarifs", NB(S["tarifs"]), "#f-8a", "les tarifs"),
            rang("Horaires", S["horaires"], "#f-8a", "les horaires"),
            rang("Rendez-vous en ligne", wbr(S["resa"]).replace("/", "/<wbr>"), "#f-8a", "le lien de réservation", extra=" break-words"),
            rang("Parle aussi", S["langues"], "#f-8a", "les langues"),
        ]),
        groupe("Avis Google", [
            rang("Fiche Google", "Non renseigné", "#f-9c", "la fiche Google", vide=True),
        ]),
    ] + relecture_histoire())


def relecture_histoire():
    """Steps 10–15: each answer in full, as the slide will say it."""
    import histoire as H
    q = H.QUESTIONS
    photo = '<span class="block mt-1 text-[16px] text-neutre-700">Avec une photo</span>'
    lieux = ('<ul class="list-none p-0 m-0">' + "".join(f"<li>{H.LIEUX[c][0]}</li>" for c in ["ptits", "bar500", "pouvillon", "autrerive", "ucpa"])
             + f'</ul><span class="block mt-1 text-[16px] text-neutre-700">{NB(H.PHRASE_LIEUX)}</span>')
    return [groupe("Votre histoire", [
        rang(q[10]["titre"], NB(H.POURQUOI), "#f-10", "la réponse « Pourquoi entreprendre ? »"),
        rang(q[11]["titre"], NB(H.DECLIC) + photo, "#f-11a", "la réponse « Mon déclic »"),
        rang(q[12]["titre"], NB(H.ACTIVITE), "#f-12", "la réponse « Mon activité en bref »"),
        rang(q[13]["titre"], NB(H.RESEAU), "#f-13", "la réponse « Les entrepreneurs de la Cartoucherie &amp; moi »"),
        rang("Mes lieux favoris", lieux, "#f-14d", "les lieux favoris"),
        rang(q[15]["titre"], NB(H.MOTTO), "#f-15", "le motto"),
    ])]


def accords(p, manque=False):
    droits = f"""<label class="choix flex gap-3.5 items-start">
  <input type="checkbox" name="{p}-droits" class="case"{' aria-invalid="true" aria-describedby="' + p + '-err"' if manque else ''}>
  <span class="text-corps leading-snug text-neutre-900">Cette photo est de moi ou j'en ai les droits, et personne d'autre n'y figure.</span>
</label>"""
    if manque:
        droits = f"""<div class="groupe-erreur">
  {droits}
  <p id="{p}-err" class="mt-2 flex items-start gap-1.5 text-[16px] font-semibold text-rouge-700">
    {ALERTE}
    Sans cette case, la photo ne peut pas être publiée.
  </p>
</div>"""
    c = " checked" if manque else ""
    return f"""<div class="mt-9 rounded-[18px] bg-teal-50 p-4">
  <p class="text-[16px] leading-snug text-teal-950">
    <strong class="font-semibold">Votre fiche sera publique</strong>&nbsp;: nom, photo, métier, coordonnées.
    Adrien la relit avant de la publier. Vous pouvez la supprimer quand vous voulez.
    Responsable des données&nbsp;: Adrien, pour l'annuaire.
  </p>
  <a href="#" class="mt-1 inline-flex items-center gap-1.5 min-h-[44px] text-[16px] font-semibold text-teal-700 underline underline-offset-4 decoration-teal-300 hover:decoration-teal-600">
    Vos données et vos droits<svg class="w-4 h-4" aria-hidden="true"><use href="#i-chev"/></svg>
  </a>
</div>
<fieldset class="mt-6 border-0 p-0 m-0">
  <legend class="ff mb-4 text-[24px] leading-tight text-teal-900">Avant d'envoyer</legend>
  <div class="grid gap-3">
    <label class="choix flex gap-3.5 items-start">
      <input type="checkbox" name="{p}-photo" class="case"{c}>
      <span class="text-corps leading-snug text-neutre-900">J'autorise la publication de ma photo sur l'annuaire.</span>
    </label>
    {droits}
    <label class="choix flex gap-3.5 items-start">
      <input type="checkbox" name="{p}-age" class="case"{c}>
      <span class="text-corps leading-snug text-neutre-900">J'ai 18 ans ou plus.</span>
    </label>
  </div>
</fieldset>"""


def verifier(p, manque_accroche=False, manque_accord=False):
    return form(f"""{entete_etape(0, '#f-fin', etiquette='Dernière étape')}
<div class="px-5">
  <h1 class="ff mt-4 text-nom text-teal-900">Vérifiez votre fiche</h1>
  {bouton_apercu(p + '-ap', False, 'Voir toute ma fiche').replace('onclick="basculer(this)"', 'onclick="location.hash=\'f-va\'"')}
  {relecture(p, manque_accroche)}
  {accords(p, manque_accord)}
  {turnstile('ok')}
  <div class="h-12" aria-hidden="true"></div>
</div>""", barre_envoyer())


# ── l'aperçu complet : trois écrans défilés, comptés chacun ─────────────────
def bandeau_apercu():
    """NEW · the full-screen preview's top strip: says it is not online yet,
    and closes back to the check-answers page."""
    return """<div class="ventouses ventouses--teal bg-neutre-100 px-4 py-2 flex items-center justify-between gap-3"
     style="box-shadow: inset 0 -1px 0 var(--color-neutre-300)">
  <p class="inline-flex items-center gap-2 text-[16px] font-semibold text-teal-800">
    <svg class="w-5 h-5" aria-hidden="true"><use href="#i-oeil"/></svg><span><span class="block">Aperçu</span><span class="block font-normal text-neutre-700">Pas encore en ligne</span></span>
  </p>
  <a href="#f-v1" class="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 rounded-full text-[16px] font-semibold text-teal-700 bg-white hover:bg-teal-50"
     style="box-shadow: inset 0 0 0 1.5px var(--color-teal-200)">
    <svg class="w-4 h-4" aria-hidden="true"><use href="#i-fermer"/></svg>Fermer
  </a>
</div>"""


def serie_sophie():
    """The generated carousel: the cover, then one page per answer (7)."""
    import histoire as H
    from diapos import couverture
    return [couverture(nom=S["nom"], metier=f"{S['metier']} · {S['enseigne']}", slug="sophie-arnaud", photo=PHOTO_SOPHIE),
            H.diapo_question(10, H.POURQUOI),
            H.diapo_question(11, H.DECLIC, photo=H.PHOTO_DECLIC),
            H.diapo_question(12, H.ACTIVITE),
            H.diapo_question(13, H.RESEAU),
            H.diapo_lieux(["ptits", "bar500", "pouvillon", "autrerive", "ucpa"]),
            H.diapo_question(15, H.MOTTO)]


def apercu_page(partie):
    from diapos import carrousel
    if partie == 1:
        meta = DISTANCE("450&nbsp;m")
        corps = entete_site() + entete_fiche(nom=S["nom"], metier=S["metier"], enseigne=S["enseigne"], photo=PHOTO_SOPHIE,
                                             alt="Portrait de Sophie Arnaud, naturopathe à la Cartoucherie",
                                             chips=CHIP_SANTE.replace("py-1.5", "py-2 min-h-[44px]"),
                                             accroche=S["accroche"], meta=meta, pratique_html=pratique_sophie()) + \
            section_contact("va-contact", "La contacter", "\n".join([
                ligne_contact("#", "i-mail", "E-mail", S["email"]),
                ligne_contact("#", "i-globe", "Son site", S["site"]),
                ligne_contact("#", "i-insta", "Instagram", "@" + S["insta"]),
            ]), pad="px-5 py-8")
    elif partie in (2, 3):
        depart = 0 if partie == 2 else 4
        ident = "vb" if partie == 2 else "vc"
        corps = section_portrait(ident + "-portrait", "Son portrait", S["bio"], "Texte écrit par Sophie elle-même.", pad="px-5 py-8",
                                 carrousel=carrousel(serie_sophie(), depart, ident + "-carrousel"))
    else:
        corps = section_services("vd-serv", "Ce qu'elle propose", S["services"], pad="px-5 py-8") + \
            section_ou("vd-ou", "Où la trouver", "8 allée du Bois Vert<br>31300 Toulouse",
                       "Au fond de la cour, porte verte · À 450&nbsp;m de la Halle", pad="px-5 pb-8")
    return f"""{bandeau_apercu()}
<div class="pb-[96px]">
{corps}
</div>
{barre_appeler(S['tel'], S['tel_lisible'])}"""


# ═══════════════════════════ APRÈS L'ENVOI ════════════════════════════════
def merci():
    etapes = [
        ("Adrien relit votre fiche.", "Il vérifie que tout est juste et que vous êtes bien du quartier."),
        ("Vous recevez un e-mail.", "Fiche publiée, ou ce qu'il faut corriger, avec ses mots à lui."),
        ("Ensuite, elle est à vous.", "Vos modifications partent en ligne d'elles-mêmes, sans attendre Adrien."),
    ]
    lis = "\n".join(f"""  <li class="flex items-start gap-3.5">
    <span class="pastille w-9 h-9 mt-0.5 bg-white text-sauge-800 tnum text-[16px] font-bold">{i}</span>
    <span class="min-w-0"><span class="block text-corps font-semibold text-teal-900">{a}</span>
    <span class="block text-[16px] leading-snug text-neutre-700">{b}</span></span>
  </li>""" for i, (a, b) in enumerate(etapes, 1))
    return f"""{entete_site('Annuaire')}
<main class="px-5 pt-8 pb-10">
  <span class="pastille w-16 h-16 bg-white text-sauge-700" aria-hidden="true"><svg class="w-8 h-8"><use href="#i-coche"/></svg></span>
  <h1 class="ff mt-6 text-nom text-teal-900">Merci&nbsp;! Adrien relit votre fiche</h1>
  <div role="status" class="mt-6 flex items-start gap-4 rounded-[22px] bg-sable-100 p-5">
    <span class="pastille pastille--sable w-11 h-11 mt-0.5 bg-white text-sable-800" aria-hidden="true"><svg class="w-[22px] h-[22px]"><use href="#i-horloge"/></svg></span>
    <div class="min-w-0">
      <p class="ff text-[22px] leading-tight text-teal-950">En attente de validation</p>
      <p class="mt-1.5 text-[16px] leading-snug text-teal-950">Envoyée le 27 octobre. Adrien la relit et vous écrit par e-mail.</p>
    </div>
  </div>
  <h2 class="ff mt-9 text-[22px] text-teal-900">Et ensuite&nbsp;?</h2>
  <ol class="mt-4 grid gap-4 list-none p-0 m-0">
{lis}
  </ol>
  <div class="mt-8 -mx-1">
    <aside data-rappel aria-labelledby="mc-rappel-titre" class="relative rounded-[22px] bg-teal-50 p-5 pr-12">
      <div class="flex items-start gap-4">
        <div class="w-[72px] h-[72px] shrink-0 rounded-full bg-white overflow-hidden grid place-items-center"
             style="box-shadow: inset 0 0 0 1.5px var(--color-teal-200)">
          <img src="../_shared/colly/colly-joyeux.png" alt="" width="260" height="260" class="croquis w-[88px] h-auto">
        </div>
        <div class="min-w-0">
          <h2 id="mc-rappel-titre" class="ff text-[21px] leading-tight text-teal-950">Ajoutez votre fiche Google</h2>
          <p class="mt-1.5 text-[16px] leading-snug text-teal-950">Vos voisins liront vos avis Google depuis votre fiche.</p>
        </div>
      </div>
      <a href="#f-9a" class="mt-4 ml-[88px] inline-flex items-center gap-2 min-h-[48px] px-5 rounded-full text-corps font-semibold text-white bg-teal-700 hover:bg-teal-600">
        Ajouter le lien
      </a>
      <button type="button" aria-label="Masquer ce rappel" onclick="this.closest('[data-rappel]').hidden = true"
              class="absolute top-2 right-2 grid place-items-center w-11 h-11 rounded-full text-teal-800 hover:bg-teal-100">
        <svg class="w-5 h-5" aria-hidden="true"><use href="#i-fermer"/></svg>
      </button>
    </aside>
  </div>
  <a href="#f-va" class="mt-6 inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full text-corps font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100">
    <svg class="w-5 h-5" aria-hidden="true"><use href="#i-oeil"/></svg>Revoir ma fiche
  </a>
</main>"""


# ═══════════════════════════ FICHE COMPLÈTE ═══════════════════════════════
def fiche_complete():
    """After step 9: the profile can be sent now; the story is offered, never imposed."""
    return f"""{entete_etape(0, '#f-9c', etiquette='Fiche complète')}
<main class="px-5 pt-6 pb-[200px]">
  <span class="pastille w-16 h-16 bg-white text-sauge-700" aria-hidden="true"><svg class="w-8 h-8"><use href="#i-coche"/></svg></span>
  <h1 class="ff mt-6 text-nom text-teal-900">Votre fiche est complète</h1>
  <p class="mt-3 text-corps text-neutre-800">Vous pouvez l'envoyer maintenant&nbsp;: Adrien la relit avant de la publier.</p>
  <div class="mt-7 rounded-[22px] bg-teal-50 p-5">
    <h2 class="ff text-[22px] leading-tight text-teal-950">Envie d'en dire plus&nbsp;?</h2>
    <p class="mt-1.5 text-[16px] leading-snug text-teal-950">Six questions sur votre histoire et vos lieux favoris. Chaque réponse devient une image de votre fiche. Tout est facultatif, et vous pourrez y revenir depuis votre espace.</p>
  </div>
</main>
<div class="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-sm"
     style="box-shadow: 0 -4px 8px oklch(17.5% .03 202/.06), 0 -28px 64px -20px oklch(17.5% .03 202/.28)">
  <div class="mx-auto max-w-[640px] px-4 pt-3 pb-3 grid gap-2.5">
    <a href="#f-v1" class="cta w-full inline-flex items-center justify-center gap-2 min-h-[54px] px-6 rounded-full text-[18px] font-bold tracking-tight transition">
      Vérifier et envoyer
    </a>
    <a href="#f-10" class="w-full inline-flex items-center justify-center gap-2 min-h-[54px] px-5 rounded-full text-corps font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100">
      <span>Raconter mon histoire <span class="font-normal">(facultatif)</span></span>
    </a>
  </div>
</div>"""
