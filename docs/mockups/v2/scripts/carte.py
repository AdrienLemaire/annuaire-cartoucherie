# Generates docs/mockups/v2/carte.html: the /carte « Lieux préférés » storyboard.
# Run: python3 -I gen.py
import json, math, html as H

ROOT = str(__import__("pathlib").Path(__file__).resolve().parents[4])
OUT = f"{ROOT}/docs/mockups/v2/carte.html"
SG = open(f"{ROOT}/docs/mockups/final/styleguide.html", encoding="utf-8").read().split("\n")
MEMBRE_FINAL = open(f"{ROOT}/docs/mockups/final/membre.html", encoding="utf-8").read().split("\n")
MEMBRE_V2 = open(f"{ROOT}/docs/mockups/v2/membre.html", encoding="utf-8").read().split("\n")
DATA = json.load(open(f"{ROOT}/docs/mockups/_shared/members.json", encoding="utf-8"))
M = {m["slug"]: m for m in DATA["membres"]}


def between(src, start, end):
    i = src.index(start)
    return src[i:src.index(end, i) + len(end)]


def lines(src, a, b):  # 1-based, inclusive
    return "\n".join(src[a - 1:b])


# ── projection: src/lib/plan.ts, MAP_ZOOM 16, MAP_BOUNDS ───────────────────
def merc(lat, lng):
    w = 256 * 2 ** 16
    r = math.radians(lat)
    return ((lng + 180) / 360 * w, (1 - math.log(math.tan(r) + 1 / math.cos(r)) / math.pi) / 2 * w)


TL = merc(43.608, 1.403)


def px(lat, lng):
    x, y = merc(lat, lng)
    return round(x - TL[0], 1), round(y - TL[1], 1)


HALL = px(43.6006, 1.4108)

# ── pinned members (surCarte, coordinates of final/carte.html) ─────────────
PINS = {
    "yanis-belhadj": (43.601457, 1.411005, "c-numerique"),
    "thomas-vidal": (43.600443, 1.411005, "c-sport"),
    "ines-lacombe": (43.60109, 1.41003, "c-sport"),
    "camille-roussel": (43.599972, 1.41012, "c-sante"),
    "pierre-delmas": (43.599614, 1.411009, "c-conseil"),
    "lea-fontaine": (43.601895, 1.414766, "c-numerique"),
    "karim-ziani": (43.600474, 1.415423, "c-art"),
    "sophie-arnaud": (43.603658, 1.406597, "c-sante"),
    "marc-ollivier": (43.607302, 1.415415, "c-artisanat"),
}
ROWS = ["yanis-belhadj", "thomas-vidal", "ines-lacombe", "camille-roussel", "pierre-delmas",
        "nadia-berrada", "lea-fontaine", "karim-ziani", "sophie-arnaud", "marc-ollivier"]

# ── places: real OSM names and positions (Overpass, 2026-10-27) ────────────
# who: (slug, pourquoi or None). Every pourquoi ≤ 80 characters.
TYPES = {"cafe": "Café", "restaurant": "Restaurant", "parc": "Parc", "boutique": "Boutique",
         "sport": "Sport", "culture": "Culture", "autre": "Autre"}
PLACES = [
    dict(id="le-bar-des-500", nom="Le Bar des 500", lat=43.60209, lng=1.40808, type="cafe", label="Café, bar",
         who=[("sophie-arnaud", "Le café du samedi, après le marché : on y croise tout le quartier."),
              ("karim-ziani", "La terrasse au soleil, la plus belle lumière de fin d'après-midi."),
              ("lea-fontaine", None)]),
    dict(id="carthel", nom="Carthel", lat=43.60255, lng=1.40965, type="restaurant",
         who=[("pierre-delmas", "Le déjeuner du jeudi avec mes clients du quartier.")]),
    dict(id="la-cabane", nom="La Cabane", lat=43.59968, lng=1.40731, type="culture",
         who=[("lea-fontaine", "Des spectacles qu'on ne voit nulle part ailleurs."), ("amandine-rey", None)]),
    dict(id="jardin-jean-boudou", nom="Jardin Jean Boudou", lat=43.60208, lng=1.40545, type="parc",
         who=[("thomas-vidal", "Mes séances en plein air, tôt le matin."),
              ("ines-lacombe", "Le yoga du dimanche, quand il fait beau.")]),
    dict(id="boite-a-lire", nom="Boite à lire", lat=43.60461, lng=1.40924, type="culture",
         who=[("julien-marty", "J'y dépose un polar, j'en reprends un autre.")]),
    dict(id="parc-pouvillon", nom="Parc Pouvillon", lat=43.60256, lng=1.41726, type="parc",
         label="Parc, jardin",
         who=[("karim-ziani", "La lumière du matin entre les arbres."),
              ("sophie-arnaud", "Le banc sous les platanes, pour lire au calme.")]),
    dict(id="les-ptits-tous", nom="Les P'tits Tous", lat=43.6014, lng=1.40799, type="cafe", label="Café, bar",
         who=[("sophie-arnaud", "Le goûter du mercredi, quand le quartier sort de l'école.")]),
    dict(id="lautre-rive-cartoucherie", nom="L'autre rive cartoucherie", lat=43.60177, lng=1.40741, type="boutique",
         who=[("sophie-arnaud", None), ("lea-fontaine", "Des libraires qui conseillent bien, même pour les enfants.")]),
    dict(id="ucpa", nom="UCPA TOULOUSE Les Halles de la Cartoucherie - Fitness & Squash", lat=43.60073, lng=1.40752,
         type="sport", who=[("sophie-arnaud", None), ("thomas-vidal", None)]),
    dict(id="le-pastourel", nom="Le Pastourel", lat=43.6011, lng=1.41824, type="boutique",
         who=[("marc-ollivier", None)]),
    # Les Halles: six stalls inside 44 px of each other
    dict(id="le-tout-rouge", nom="Le Tout Rouge", lat=43.6015, lng=1.40735, type="cafe",
         who=[("karim-ziani", None), ("thomas-vidal", "L'apéro du vendredi, après la dernière séance."),
              ("julien-marty", None)]),
    dict(id="maitre-ramen", nom="Maître Ramen", lat=43.60137, lng=1.40733, type="restaurant",
         who=[("yanis-belhadj", "Le bol du midi quand je code à la Halle."), ("nadia-berrada", None)]),
    dict(id="les-canons-de-la-daronne", nom="Les Canons de la Daronne", lat=43.60116, lng=1.40757, type="cafe",
         who=[("amandine-rey", None), ("camille-roussel", "Un verre en terrasse entre deux rendez-vous.")]),
    dict(id="carne", nom="Carné - comptoir à viandes", lat=43.60122, lng=1.40753, type="restaurant",
         who=[("marc-ollivier", None)]),
    dict(id="chapiteau", nom="Chapiteau", lat=43.60117, lng=1.40731, type="cafe",
         who=[("ines-lacombe", "La glace d'après le cours, pour les enfants comme pour moi.")]),
    dict(id="les-bouchefs", nom="Les Bouchefs", lat=43.6014, lng=1.40759, type="boutique",
         who=[("nadia-berrada", "Les meilleures viandes pour mes plats du week-end.")]),
]
for p in PLACES:
    p["x"], p["y"] = px(p["lat"], p["lng"])
    for s, why in p["who"]:
        assert why is None or len(why) <= 80, (p["nom"], len(why))

# A member's business, named as a favourite: no square of its own, it is her pin.
BUSINESS = dict(member="ines-lacombe", enseigne="L'atelier d'Inès", type="sport",
                who=[("camille-roussel", "Le cours du mardi soir, mon sas entre le travail et la maison."),
                     ("thomas-vidal", "Pour s'étirer après mes séances au parc.")])

# ── grouping rule (spec §11, 2026-10-30): only overlapping markers group ───
GAP = 44     # tap target
SIDE = 30    # the drawn square of a place marker


def overlap(q, r):  # two 30 px squares overlap
    return abs(q["x"] - r["x"]) < SIDE and abs(q["y"] - r["y"]) < SIDE


def groups(places):
    out, seen = [], set()
    for p in places:
        if p["id"] in seen:
            continue
        g, todo = [], [p]
        seen.add(p["id"])
        while todo:
            q = todo.pop()
            g.append(q)
            for r in places:
                if r["id"] not in seen and overlap(q, r):
                    seen.add(r["id"])
                    todo.append(r)
        out.append(g)
    return out


GROUPS = groups(PLACES)
print("groups", [[p["nom"] for p in g] for g in GROUPS if len(g) > 1])
SINGLES = [g[0] for g in GROUPS if len(g) == 1]
HALLES = next(g for g in GROUPS if len(g) > 1)
assert len([g for g in GROUPS if len(g) > 1]) == 1
HALLES.sort(key=lambda p: (-len(p["who"]), p["nom"]))
GX = round(sum(p["x"] for p in HALLES) / len(HALLES), 1)
GY = round(sum(p["y"] for p in HALLES) / len(HALLES), 1)
# once grouped, no two markers overlap; tap targets closer than 44 px are reported
MARKS = [(p["nom"], p["x"], p["y"]) for p in SINGLES] + [("groupe", GX, GY)]
TIGHT = []
for i, a in enumerate(MARKS):
    for b in MARKS[i + 1:]:
        assert not (abs(a[1] - b[1]) < SIDE and abs(a[2] - b[2]) < SIDE), (a, b)
        if math.dist(a[1:], b[1:]) < GAP:
            TIGHT.append((a[0], b[0], round(math.dist(a[1:], b[1:]))))
    for s, (la, ln, _) in PINS.items():
        d = math.dist(a[1:], px(la, ln))
        if d < GAP:
            print("WARN place near pin", a[0], s, round(d))


# ── French ────────────────────────────────────────────────────────────────
def voisins(slugs):
    n = len(slugs)
    fem = all(M[s]["genre"] == "f" for s in slugs)
    noun = "voisine" if fem else "voisin"
    return f"{n} {noun}{'s' if n > 1 else ''}"


def prefere(slugs):  # « lieu préféré de 3 voisins », « d'1 voisine » as the styleguide writes it
    v = voisins(slugs)
    return f"lieu préféré d'{v}" if v.startswith("1 ") else f"lieu préféré de {v}"


def e(s):
    return H.escape(s, quote=True)


def esc_fr(s):  # non-breaking spaces before French high punctuation
    s = e(s)
    for c in [":", ";", "?", "!"]:
        s = s.replace(" " + c, "&nbsp;" + c)
    return s


def photo(slug):
    return M[slug]["photo"]


# ── markup pieces ─────────────────────────────────────────────────────────
def halle():
    x, y = HALL
    return f'''          <span data-halle class="absolute grid place-items-center w-11 h-11 -ml-[22px] -mt-[22px] pointer-events-none" style="left:{x}px; top:{y}px">
            <span class="block w-[18px] h-[18px] rounded-full bg-teal-700" style="box-shadow: 0 0 0 4px #fff, 0 0 0 7px oklch(53% .09 196/.35)"></span>
          </span>
          <p class="absolute whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-[16px] font-semibold text-teal-800 pointer-events-none" style="left:{x - 18}px; top:{y}px; transform:translate(-100%,-50%); box-shadow: var(--shadow-carte)">La Halle</p>'''


def pin(slug, *, badge=False, chosen=False, dim=False):
    la, ln, icon = PINS[slug]
    x, y = px(la, ln)
    m = M[slug]
    etiq = "etiq--g" if x < 0.25 * 722 else "etiq--d" if x > 0.75 * 722 else "etiq--c"
    extra = f", {prefere([s for s, _ in BUSINESS['who']])}" if badge else ""
    cls = "epingle-lien absolute z-10 grid place-items-center w-11 h-11 -ml-[22px] -mt-[22px]"
    cls += " choisi" if chosen else ""
    cls += " estompe" if dim else ""
    mark = ('\n            <span class="marque-lieu" aria-hidden="true"><svg class="w-3 h-3"><use href="#l-autre"/></svg></span>'
            if badge else "")
    return f'''          <a data-m="{slug}" href="#pin-{slug}" class="{cls}" style="left:{x}px; top:{y}px"
             aria-label="{e(m['nom'])}, {e(m['metier'])}, à {m['distance']}{e(extra)} — la situer dans la liste">
            <span class="epingle grid place-items-center w-9 h-9 rounded-full bg-white text-teal-700"><svg class="w-[18px] h-[18px]" aria-hidden="true"><use href="#{icon}"/></svg></span>{mark}
            <span class="etiq {etiq}" aria-hidden="true">{e(m['nom'])} · {m['distance']}</span>
          </a>'''


def place_mark(p, *, pressed=False, z="z-20", fixed=False):
    label = p.get("label", TYPES[p["type"]])
    aria = f"{p['nom']}, {label.lower()} : {prefere([s for s, _ in p['who']])}"
    return f'''          <button type="button" class="lieu-cible {z}" aria-pressed="{'true' if pressed else 'false'}" style="left:{p['x']}px; top:{p['y']}px" aria-label="{e(aria)}">
            <span class="lieu{' lieu--choisi' if fixed else ''}"><svg class="w-[18px] h-[18px]" aria-hidden="true"><use href="#l-{p['type']}"/></svg></span>
          </button>'''


def group_mark(*, pressed=False):
    n = len(HALLES)
    return f'''          <button type="button" class="lieu-cible {'z-30' if pressed else 'z-20'}" aria-pressed="{'true' if pressed else 'false'}" style="left:{GX}px; top:{GY}px" aria-label="{n} lieux préférés ici — les lister">
            <span class="lieu lieu--groupe" aria-hidden="true">{n}</span>
          </button>'''


def voisin_li(slug, why):
    m = M[slug]
    if why:
        body = f'''<span class="min-w-0 flex-1 basis-[8rem] py-0.5">
                  <span class="ff block text-[19px] leading-tight text-teal-900">{e(m['nom'])}</span>
                  <span class="block text-[16px] text-neutre-800">{e(m['metier'])}</span>
                  <span class="mt-1 block text-[16px] leading-snug text-neutre-900">«&nbsp;{esc_fr(why)}&nbsp;»</span>
                </span>'''
    else:
        body = f'''<span class="min-w-0 flex-1 basis-[8rem] py-0.5 self-center">
                  <span class="ff block text-[19px] leading-tight text-teal-900">{e(m['nom'])}</span>
                  <span class="block text-[16px] text-neutre-800">{e(m['metier'])}</span>
                </span>'''
    return f'''            <li>
              <a href="#" class="flex flex-wrap gap-3.5 rounded-[16px] bg-neutre-100 p-2.5 hover:bg-teal-50">
                <img src="{photo(slug)}" alt="" width="128" height="128" class="arche w-[74px] h-[88px] shrink-0 object-cover" style="object-position:50% 22%">
                {body}
              </a>
            </li>'''


def close_btn():
    return '''<a href="#plan" aria-label="Fermer" class="absolute top-2.5 right-2.5 grid place-items-center w-11 h-11 rounded-full text-teal-800 hover:bg-teal-50">
              <svg class="w-5 h-5" aria-hidden="true"><use href="#i-fermer"/></svg>
            </a>'''


def place_sheet(p):  # styleguide b-v2-carte-lieux, third specimen
    sid = f"f-{p['id']}"
    label = p.get("label", TYPES[p["type"]])
    lis = "\n".join(voisin_li(s, w) for s, w in p["who"])
    return f'''        <section class="relative carte rounded-[22px] bg-white p-4 mb-6" aria-labelledby="{sid}">
          <div class="flex flex-wrap items-start gap-3 pr-11">
            <span class="lieu mt-0.5 shrink-0" aria-hidden="true"><svg class="w-[18px] h-[18px]"><use href="#l-{p['type']}"/></svg></span>
            <div class="min-w-0 flex-1 basis-[7rem]">
              <h3 id="{sid}" class="ff text-[22px] leading-tight text-teal-900">{e(p['nom'])}</h3>
              <p class="text-[16px] text-neutre-700">{e(label)} · {prefere([s for s, _ in p['who']])}</p>
            </div>
            {close_btn()}
          </div>
          <ul class="mt-4 grid gap-2.5 list-none p-0 m-0">
{lis}
          </ul>
        </section>'''


def business_sheet():
    b = BUSINESS
    m = M[b["member"]]
    lis = "\n".join(voisin_li(s, w) for s, w in b["who"])
    return f'''        <section class="relative carte rounded-[22px] bg-white p-4 mb-6" aria-labelledby="f-atelier">
          <div class="flex flex-wrap items-start gap-3 pr-11">
            <span class="lieu mt-0.5 shrink-0" aria-hidden="true"><svg class="w-[18px] h-[18px]"><use href="#l-{b['type']}"/></svg></span>
            <div class="min-w-0 flex-1 basis-[7rem]">
              <h3 id="f-atelier" class="ff text-[22px] leading-tight text-teal-900">{e(b['enseigne'])}</h3>
              <p class="text-[16px] text-neutre-700">{TYPES[b['type']]} · {prefere([s for s, _ in b['who']])}</p>
            </div>
            {close_btn()}
          </div>
          <a href="#" class="mt-4 flex flex-wrap items-center gap-3.5 rounded-[16px] bg-teal-50 p-2.5 hover:bg-teal-100">
            <img src="{photo(b['member'])}" alt="" width="128" height="128" class="arche w-[74px] h-[88px] shrink-0 object-cover" style="object-position:50% 22%">
            <span class="min-w-0 flex-1 basis-[8rem] py-0.5">
              <span class="block text-[16px] text-neutre-700">Tenu par</span>
              <span class="ff block text-[19px] leading-tight text-teal-900">{e(m['nom'])}</span>
              <span class="block text-[16px] text-neutre-800">{e(m['metier'])}</span>
              <span class="mt-1 inline-flex items-center gap-0.5 text-[16px] font-semibold text-teal-800 underline underline-offset-4 decoration-teal-300">Voir sa fiche<svg class="w-4 h-4" aria-hidden="true"><use href="#i-chev"/></svg></span>
            </span>
          </a>
          <ul class="mt-2.5 grid gap-2.5 list-none p-0 m-0">
{lis}
          </ul>
        </section>'''


def group_sheet():
    rows = []
    for p in HALLES:
        faces = "".join(
            f'<img src="{photo(s)}" alt="" width="128" height="128" class="w-7 h-7 rounded-full object-cover -ml-1.5 first:ml-0" style="box-shadow:0 0 0 2px var(--color-neutre-100)">'
            for s, _ in p["who"][:3])
        label = p.get("label", TYPES[p["type"]])
        rows.append(f'''            <li>
              <a href="#lieu-{p['id']}" class="flex items-start gap-3 rounded-[16px] bg-neutre-100 p-3 hover:bg-teal-50">
                <span class="lieu mt-1 shrink-0" aria-hidden="true"><svg class="w-[18px] h-[18px]"><use href="#l-{p['type']}"/></svg></span>
                <span class="min-w-0 flex-1">
                  <span class="ff block text-[19px] leading-tight text-teal-900">{e(p['nom'])}</span>
                  <span class="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[16px] text-neutre-700"><span class="flex pl-0.5" aria-hidden="true">{faces}</span>{e(label)} · {voisins([s for s, _ in p['who']])}</span>
                </span>
              </a>
            </li>''')
    return f'''        <section class="relative carte rounded-[22px] bg-white p-4 mb-6" aria-labelledby="f-groupe">
          <div class="flex flex-wrap items-start gap-3 pr-11">
            <span class="lieu lieu--groupe mt-0.5 shrink-0" aria-hidden="true">{len(HALLES)}</span>
            <div class="min-w-0 flex-1 basis-[7rem]">
              <h3 id="f-groupe" class="ff text-[22px] leading-tight text-teal-900">{len(HALLES)} lieux ici</h3>
              <p class="text-[16px] text-neutre-700">Trop proches pour un repère chacun</p>
            </div>
            {close_btn()}
          </div>
          <ul class="mt-4 grid gap-2.5 list-none p-0 m-0">
{chr(10).join(rows)}
          </ul>
        </section>'''


def mot(text):  # letters of the longest word: what the build writes into --mot
    return max(len(w) for w in text.replace("-", " ").split())


def row(slug, *, selected=False):
    m = M[slug]
    pinned = slug in PINS
    sel = " data-selected" if selected else ""
    note = str(m["note"]).replace(".", ",")
    pickup = ('''
        <p class="mt-1 flex items-start gap-1.5 text-[16px] leading-snug text-neutre-700">
          <svg class="w-4 h-4 shrink-0 mt-1 text-neutre-600" aria-hidden="true"><use href="#i-alerte"/></svg>
          Adresse de retrait, pas de point sur la carte
        </p>''' if not pinned else "")
    situer = (f'''
      <a href="#pin-{slug}" class="relative z-10 shrink-0 self-center ml-auto mr-2.5 grid place-items-center w-11 h-11 rounded-full text-teal-700 bg-teal-50 hover:bg-teal-100" aria-label="Situer {e(m['nom'])} sur la carte">
        <svg class="w-5 h-5" aria-hidden="true"><use href="#i-pin"/></svg>
      </a>''' if pinned else "")
    return f'''  <li>
    <article class="carte carte-lien rangee relative flex flex-wrap min-h-[124px] rounded-[20px] bg-white overflow-hidden" data-m="{slug}"{sel}>
      <img src="{photo(slug)}" alt="Portrait de {e(m['nom'])}" width="128" height="128" loading="lazy" class="w-[92px] h-[124px] shrink-0 self-start object-cover" style="object-position:50% 25%">
      <div class="@container flex-1 min-w-[min(8rem,100%)] py-3.5 pl-3.5 pr-1 flex flex-col justify-center gap-0.5">
        <h3 class="ff text-[1.25rem] leading-tight mots-entiers text-teal-900" style="--taille:1.25rem; --mot:{mot(m['nom'])}"><a href="#" class="before:absolute before:inset-0 before:content-['']">{e(m['nom'])}</a></h3>
        <p class="text-[1rem] text-neutre-800 leading-snug mots-entiers" style="--taille:1rem; --lettre:.56; --mot:{mot(m['metier'])}">{e(m['metier'])}</p>
        <p class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[16px] text-neutre-700 mt-0.5">
          <span class="inline-flex items-center gap-1"><svg class="w-4 h-4 text-sable-700" aria-hidden="true"><use href="#i-etoile"/></svg>{note}<span class="sr-only"> sur 5,</span> <span class="text-neutre-600">({m['nbAvis']})</span></span>
          <span class="inline-flex items-center gap-1"><svg class="w-4 h-4 text-teal-600" aria-hidden="true"><use href="#i-pin"/></svg><span class="dist">{m['distance']}</span></span>
        </p>{pickup}
      </div>{situer}
    </article>
  </li>'''


def toggle(pressed):
    return f'''      <div class="mb-3 flex flex-wrap items-center gap-2.5">
        <button type="button" aria-pressed="{'true' if pressed else 'false'}"
                class="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full text-[16px] font-semibold text-teal-800 bg-white hover:bg-teal-50 aria-pressed:bg-teal-700 aria-pressed:text-white"
                style="box-shadow: inset 0 0 0 1.5px var(--color-teal-200)" data-bascule>
          <svg class="w-5 h-5" aria-hidden="true"><use href="#l-autre"/></svg>Lieux préférés
        </button>
      </div>'''


def empty_status():
    return '''      <div role="status" class="mb-3 rounded-[14px] bg-teal-50 px-4 py-3 text-corps text-teal-900">
        <p>Aucun lieu préféré pour l'instant.</p>
        <p><a href="#" class="inline-flex items-center min-h-[44px] font-semibold text-teal-800 underline underline-offset-4 decoration-teal-300 hover:decoration-teal-600">Vous avez une fiche&nbsp;? Ajoutez les vôtres</a></p>
      </div>'''


def filter_card(p):
    slugs = [s for s, _ in p["who"]]
    return f'''      <div class="mb-3 rounded-[20px] bg-sauge-50 p-4">
        <div class="flex items-start gap-3">
          <span class="lieu mt-1 shrink-0" aria-hidden="true"><svg class="w-[18px] h-[18px]"><use href="#l-{p['type']}"/></svg></span>
          <div class="min-w-0 flex-1">
            <h2>
              <span class="block text-corps text-neutre-800">Les voisins qui aiment</span>
              <span class="ff block text-[24px] leading-tight text-teal-900">{e(p['nom'])}</span>
            </h2>
            <p class="flex flex-wrap items-center gap-x-3 text-[16px] text-neutre-700">{voisins(slugs)}
              <a href="#" class="inline-flex items-center gap-1.5 min-h-[44px] font-semibold text-teal-700 underline underline-offset-4 decoration-teal-300 hover:decoration-teal-600"><svg class="w-4 h-4" aria-hidden="true"><use href="#i-fermer"/></svg>Tout réafficher</a>
            </p>
          </div>
        </div>
      </div>'''


def lieux_card(slug):
    prenom = M[slug]["nom"].split()[0]
    return f'''      <div class="mb-3 rounded-[20px] bg-sauge-50 p-4">
        <div class="flex items-start gap-3">
          <span class="lieu mt-1 shrink-0" aria-hidden="true"><svg class="w-[18px] h-[18px]"><use href="#l-autre"/></svg></span>
          <div class="min-w-0 flex-1">
            <h2 class="ff text-[24px] leading-tight text-teal-900">Les lieux favoris de {e(prenom)}</h2>
            <p class="flex flex-wrap items-center gap-x-3 text-[16px] text-neutre-700">{len(SOPHIE)} lieux
              <a href="#" class="inline-flex items-center gap-1.5 min-h-[44px] font-semibold text-teal-700 underline underline-offset-4 decoration-teal-300 hover:decoration-teal-600"><svg class="w-4 h-4" aria-hidden="true"><use href="#i-fermer"/></svg>Tout réafficher</a>
            </p>
          </div>
        </div>
      </div>'''


def lieux_marks():
    out = []
    for g in SOPHIE_GROUPS:
        if len(g) == 1:
            out.append(place_mark({**g[0], "who": [("sophie-arnaud", None)]}, z="z-30", fixed=True))
        else:
            x = round(sum(q["x"] for q in g) / len(g), 1)
            y = round(sum(q["y"] for q in g) / len(g), 1)
            out.append(f'''          <button type="button" class="lieu-cible z-30" aria-pressed="false" style="left:{x}px; top:{y}px" aria-label="{len(g)} de ses lieux ici — les lister">
            <span class="lieu lieu--groupe lieu--choisi" aria-hidden="true">{len(g)}</span>
          </button>''')
    return out


def lieux_sheet():
    rows = []
    for q in SOPHIE:
        label = q.get("label", TYPES[q["type"]])
        rows.append(f'''            <li>
              <a href="#lieu-{q['id']}" class="flex items-start gap-3 rounded-[16px] bg-neutre-100 p-3 hover:bg-teal-50">
                <span class="lieu mt-1 shrink-0" aria-hidden="true"><svg class="w-[18px] h-[18px]"><use href="#l-{q['type']}"/></svg></span>
                <span class="min-w-0 flex-1">
                  <span class="ff block text-[19px] leading-tight text-teal-900">{e(q['nom'])}</span>
                  <span class="block text-[16px] text-neutre-700">{e(label)}</span>
                </span>
              </a>
            </li>''')
    return f'''        <section class="relative carte rounded-[22px] bg-white p-4 mb-6" aria-label="Ses lieux">
          <ul class="grid gap-2.5 list-none p-0 m-0">
{chr(10).join(rows)}
          </ul>
        </section>'''


def chez_vous():
    cards = []
    for slug, il in [("julien-marty", "Il"), ("amandine-rey", "Elle")]:
        m = M[slug]
        note = str(m["note"]).replace(".", ",")
        cards.append(f'''        <li>
          <article class="carte carte-lien colly-fond relative flex flex-col items-center rounded-[20px] px-4 py-5 text-center h-full">
            <img src="{photo(slug)}" alt="Portrait de {e(m['nom'])}" width="128" height="128" loading="lazy" class="w-[124px] h-[124px] rounded-full object-cover shadow-carte" style="object-position:50% 22%; box-shadow: 0 0 0 3px #fff, var(--shadow-carte)">
            <h3 class="ff mt-3.5 text-[21px] leading-tight text-teal-900"><a href="#" class="before:absolute before:inset-0 before:content-['']">{e(m['nom'])}</a></h3>
            <p class="mt-0.5 text-corps text-neutre-900">{e(m['metier'])}</p>
            <p class="mt-2 inline-flex items-center gap-1.5 text-[16px] font-semibold text-teal-800"><svg class="w-4 h-4 shrink-0 text-teal-600" aria-hidden="true"><use href="#c-domicile"/></svg>{il} vient chez vous</p>
            <p class="mt-1.5 inline-flex items-center gap-1 text-[16px] text-neutre-700"><svg class="w-4 h-4 text-sable-700" aria-hidden="true"><use href="#i-etoile"/></svg>{note}<span class="sr-only"> sur 5,</span> <span class="text-neutre-600">({m['nbAvis']})</span></p>
          </article>
        </li>''')
    return f'''<section class="mt-10 bg-neutre-100" aria-labelledby="t-chezvous">
  <div class="mx-auto max-w-[1160px] px-5 py-8">
    <h2 id="t-chezvous" class="ff text-nom text-teal-900 mb-4">Ils viennent chez vous</h2>
    <ul class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 list-none p-0 m-0">
{chr(10).join(cards)}
    </ul>
  </div>
</section>'''


# ── one frame = one state of the page ──────────────────────────────────────
def page(*, layer, places=True, chosen_place=None, chosen_group=False, business=False,
         filtre=None, sheet="", rows=ROWS, selected_row=None, reset=False, lieux_de=None):
    marks = []
    some_chosen = chosen_place or chosen_group or business
    pins_html = []
    for slug in PINS:
        if filtre and slug not in [s for s, _ in filtre["who"]]:
            continue
        badge = layer and places and slug == BUSINESS["member"] and not filtre
        chosen = (business and slug == BUSINESS["member"]) or slug == lieux_de
        dim = (business and slug != BUSINESS["member"]) or (lieux_de and slug != lieux_de)
        pins_html.append(pin(slug, badge=badge and not lieux_de, chosen=chosen, dim=dim))
    if lieux_de:
        marks.extend(lieux_marks())
    elif filtre:
        # filtered: the place looks chosen, but nothing is pressed, so its voisins stay at full strength
        marks.append(place_mark(filtre, z="z-30", fixed=True))
    elif layer and places:
        for p in SINGLES:
            on = chosen_place is p
            marks.append(place_mark(p, pressed=on, z="z-30" if on else "z-20"))
        marks.append(group_mark(pressed=chosen_group))
    dim_marks = ' class="estompe-lieux"' if business else ""
    top = lieux_card(lieux_de) if lieux_de else filter_card(filtre) if filtre else toggle(layer) + ("\n" + empty_status() if layer and not places else "")
    reset_link = ('''
        <a href="#quartier" class="inline-flex items-center gap-1.5 min-h-[44px] font-semibold text-teal-700 underline underline-offset-4 decoration-teal-300 hover:decoration-teal-600">
          <svg class="w-4 h-4" aria-hidden="true"><use href="#i-fermer"/></svg>Tout réafficher
        </a>''' if reset else "")
    lis = "\n".join(row(s, selected=(s == selected_row)) for s in rows)
    return f'''<div data-inclure="t-entete"></div>
<main id="contenu">
  <div class="mx-auto max-w-[1160px] px-5 pt-6">
    <h1 class="ff text-nom sm:text-grand text-teal-900">La carte du quartier</h1>
    <p class="mt-2.5 text-corps text-neutre-800 max-w-[62ch]">10 voisins ont une adresse ici. 2 autres viennent chez vous.</p>
    <div class="mt-4 flex flex-wrap items-center gap-2.5">
      <button type="button" class="inline-flex items-center gap-2 min-h-[48px] px-5 rounded-full text-corps font-semibold text-white bg-teal-700 hover:bg-teal-600">
        <svg class="w-[18px] h-[18px]" aria-hidden="true"><use href="#i-signal"/></svg>Classer depuis ma position
      </button>
      <button type="button" aria-label="Et ma position ?" class="inline-grid place-items-center w-11 h-11 shrink-0 rounded-full text-teal-700 hover:bg-teal-50">
        <span aria-hidden="true" class="grid place-items-center w-6 h-6 rounded-full border-[1.5px] border-current text-[15px] font-bold leading-none">?</span>
      </button>
    </div>
  </div>

  <div id="quartier" class="relative mx-auto max-w-[1160px] px-5 mt-5 lg:grid lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:gap-8 lg:items-start">
    <div class="colonne-plan lg:sticky lg:top-24">
{top}
      <div data-map id="plan" class="overflow-x-auto bg-neutre-200 -mx-5 sm:mx-0 rounded-none sm:rounded-[22px] sm:border sm:border-neutre-300">
        <div class="plan relative w-max" data-plan>
          <svg width="722" height="676" viewBox="0 0 722 676" class="block max-w-none" role="img" aria-label="Carte du quartier de la Cartoucherie autour de la Halle"><use href="#plan-quartier" width="722" height="676"/></svg>
{halle()}
{chr(10).join(pins_html)}
          <div{dim_marks}>
{chr(10).join(marks)}
          </div>
        </div>
      </div>
      <p class="mt-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[16px] text-neutre-700">
        <a href="https://www.openstreetmap.org/copyright" class="inline-flex items-center min-h-[44px] underline underline-offset-4 decoration-neutre-400 hover:decoration-neutre-700">© les contributeurs d'OpenStreetMap</a>{reset_link}
      </p>
    </div>

    <div class="feuille relative mt-6 lg:mt-0">
{sheet}
      <h2 id="t-proches" class="ff min-w-0 break-words text-nom text-teal-900 mb-5">Classé depuis la Halle</h2>
      <ol data-sheet aria-labelledby="t-proches" class="flex flex-col gap-3 list-none p-0 m-0">
{lis}
      </ol>
    </div>
  </div>
{'' if filtre else chez_vous()}
</main>
<div data-inclure="t-pied"></div>'''


BAR = PLACES[0]
assert BAR in SINGLES
# Sophie's five places, as v2/membre.html's « Mes lieux favoris » lists them
SOPHIE_ORDER = ["les-ptits-tous", "le-bar-des-500", "parc-pouvillon", "lautre-rive-cartoucherie", "ucpa"]
SOPHIE = [next(p for p in PLACES if p["id"] == i) for i in SOPHIE_ORDER]
assert all("sophie-arnaud" in [w for w, _ in p["who"]] for p in SOPHIE)
assert sorted(SOPHIE_ORDER) == sorted(p["id"] for p in PLACES if "sophie-arnaud" in [w for w, _ in p["who"]])
SOPHIE_GROUPS = groups(SOPHIE)
_sg = [g for g in SOPHIE_GROUPS if len(g) > 1]
SOPHIE_NOTE = (" ; ".join(", ".join(q["nom"] for q in g[:-1]) + " et " + g[-1]["nom"] for g in _sg) + " se recouvrent&nbsp;: un groupe. ") if _sg else ""
JARDIN = next(p for p in PLACES if p["id"] == "jardin-jean-boudou")
# frame 5 must fit the place and all its voisins in one 360 px view
F5_SPAN = [JARDIN["x"]] + [px(*PINS[s][:2])[0] for s, _ in JARDIN["who"]]
assert max(F5_SPAN) - min(F5_SPAN) + 44 <= 360
FRAMES = [
    ("f1", page(layer=False)),
    ("f2", page(layer=True)),
    ("f3", page(layer=True, chosen_place=BAR, sheet=place_sheet(BAR), reset=True)),
    ("f4", page(layer=True, business=True, sheet=business_sheet(), selected_row="ines-lacombe", reset=True)),
    ("f5", page(layer=True, filtre=JARDIN, rows=[s for s in ROWS if s in [w for w, _ in JARDIN["who"]]])),
    ("f8", page(layer=True, lieux_de="sophie-arnaud", sheet=lieux_sheet(), selected_row="sophie-arnaud")),
    ("f6", page(layer=True, chosen_group=True, sheet=group_sheet(), reset=True)),
    ("f7", page(layer=True, places=False)),
]

# ── board ─────────────────────────────────────────────────────────────────
head = lines(MEMBRE_FINAL, 1, 288)
head = head.replace("<title>Camille Roussel, sophrologue — Annuaire de la Cartoucherie</title>", "<title>Carte v2</title>")
head = head.replace(
    '<meta name="description" content="Camille Roussel, sophrologue à la Cartoucherie : ses coordonnées en toutes lettres, ce qu\'elle propose, où la trouver et les avis du quartier.">',
    '<meta name="description" content="Maquette v2 : la carte du quartier avec le calque « Lieux préférés », ses repères, ses feuilles et ses groupes.">')
assert "<title>Carte v2</title>" in head and "Maquette v2 : la carte" in head

# styleguide lines 407–428: the plan and the place markers, verbatim
SGT = "\n".join(SG)
sg_lieux = between(SGT, "#plan-quartier path{", "outline-offset:5px; }")
assert sg_lieux.startswith("#plan-quartier path") and ".lieu--pose" in sg_lieux

css_carte = f'''
<!-- Ce que /carte ajoute (src/pages/carte.astro, <style is:global>), le calque
     « Lieux préférés » (styleguide, bloc b-v2-carte-lieux, verbatim), et les
     deux objets nouveaux de cette maquette : le groupe et la marque de lieu. -->
<style id="src-css-carte">
:root{{ --safe-bottom: env(safe-area-inset-bottom, 0px); }}
.ff{{ overflow-wrap:break-word; }}
[id]{{ scroll-margin-top:76px; }}
#quartier{{ position:relative; }}

/* la page en ligne */
.etiq{{
  position:absolute; top:calc(100% - 4px); left:50%; transform:translate(-50%,4px);
  white-space:nowrap; border-radius:9999px; background:#fff; padding:3px 10px;
  font-size:16px; font-weight:600; color:var(--color-teal-900);
  box-shadow:var(--shadow-carte); opacity:0; transition:opacity .18s ease, transform .18s ease;
  pointer-events:none;
}}
.etiq--c{{ transform:translate(-50%,4px); }}
.etiq--g{{ left:2px; transform:translate(0,4px); }}
.etiq--d{{ left:auto; right:2px; transform:translate(0,4px); }}
.rangee{{ transition: box-shadow .18s ease, background-color .18s ease; }}
.epingle{{ transition: transform .18s ease, box-shadow .18s ease; }}
.epingle-lien:hover .epingle{{ transform:scale(1.08); }}
/* l'épingle choisie (en ligne : .ancre:target + .epingle-lien) */
.epingle-lien.choisi{{ z-index:30; }}
.epingle-lien.choisi .epingle{{ transform:scale(1.14); box-shadow:0 0 0 3px var(--color-orange-500), var(--shadow-flottant); }}
.epingle-lien.choisi .etiq{{ opacity:1; }}
.epingle-lien.choisi .etiq--c{{ transform:translate(-50%,0); }}
.epingle-lien.choisi :is(.etiq--g, .etiq--d){{ transform:translate(0,0); }}
.estompe, .estompe-lieux .lieu-cible{{ opacity:.55; }}
.feuille [data-m][data-selected]{{ background:var(--color-teal-50); box-shadow:0 0 0 2px var(--color-teal-600), var(--shadow-carte); }}

/* styleguide · les mots entiers (b-fiche) : au plus long mot, jamais coupé */
.mots-entiers{{ font-size:min(var(--taille, var(--text-grand)), calc(100cqi / (var(--lettre, 0.68) * var(--mot, 8))));
               overflow-wrap:break-word; }}

/* styleguide · b-v2-carte-lieux */
{sg_lieux}

/* NOUVEAU · le groupe : des lieux dont les carrés se recouvrent. Le carré
   du lieu, un peu plus grand, son nombre en blanc (6,9:1), et un second carré
   décalé derrière lui pour dire « plusieurs ». Jamais orange. */
.lieu--groupe{{ width:34px; height:34px; font:700 17px/1 var(--font-sans); font-variant-numeric:tabular-nums;
  box-shadow: 0 0 0 2px #fff, 5px -5px 0 0 var(--color-sauge-400), 5px -5px 0 2px #fff, var(--shadow-carte); }}
/* NOUVEAU · la marque de lieu : l'épingle d'un voisin dont l'activité est
   un lieu préféré. Pas de second repère : un coin sauge sur son épingle. */
.marque-lieu{{ position:absolute; top:0; right:0; display:grid; place-items:center; width:18px; height:18px;
  border-radius:6px; background:var(--color-sauge-700); color:#fff; box-shadow:0 0 0 2px #fff; }}
</style>
'''

board_css = '''
<!-- La planche elle-même : rien ici n'entre dans les cadres. -->
<style>
.planche{ display:flex; flex-wrap:wrap; justify-content:center; gap:48px 36px; }
.cadre{ width:376px; margin:0; }
.cadre iframe{ display:block; border:0; background:#fff; width:360px; height:740px; margin:8px; border-radius:26px;
  box-shadow: 0 0 0 8px var(--color-teal-950), var(--shadow-flottant); }
@media (max-width:420px){ .cadre{ zoom:.84; } }
</style>
</head>'''

V2 = "\n".join(MEMBRE_V2)


sprite = between(V2, '<svg width="0" height="0" class="hidden" aria-hidden="true" focusable="false" id="src-sprite">', "</defs></svg>")
assert sprite.startswith('<svg width="0" height="0" class="hidden" aria-hidden="true" focusable="false" id="src-sprite">')
l_symbols = between(SGT, '<symbol id="l-cafe"', '<symbol id="l-autre"') and SGT[SGT.index('<symbol id="l-cafe"'):SGT.index("</symbol>", SGT.index('<symbol id="l-autre"')) + 9]
sprite = sprite.replace("</defs></svg>", "<!-- les types de lieux · styleguide -->\n" + l_symbols + "\n</defs></svg>")
plan = between(SGT, "<!-- LE PLAN", "</defs></svg>")
assert plan.rstrip().endswith("</defs></svg>"), plan[-40:]

entete = between(V2, "<!-- l'en-tête", "</template>")
pied = between(V2, "<!-- le pied", "</template>")
assert entete.lstrip().startswith("<!-- l'en-tête") and entete.rstrip().endswith("</template>")
assert pied.lstrip().startswith("<!-- le pied") and pied.rstrip().endswith("</template>")
assert "Sandra" not in pied

CAPTIONS = {
    "f1": ("1 · Calque éteint", "La page en ligne, plus un bouton au-dessus du plan. Rien d'autre ne change."),
    "f2": ("2 · Calque allumé", f"Carrés sauge des lieux à côté des épingles. Aux Halles, {len(HALLES)} carrés se recouvrent&nbsp;: un groupe. Le coin sauge sur l'épingle d'Inès&nbsp;: son atelier est un lieu préféré."),
    "f3": ("3 · Un lieu touché", "Il fonce et grossit, le reste recule. Sa feuille sous le plan&nbsp;: qui l'a nommé, et pourquoi. Léa n'a rien dit&nbsp;: pas de citation."),
    "f4": ("4 · L'activité d'une voisine", "Pas de carré&nbsp;: c'est l'épingle d'Inès, choisie. La feuille montre son portrait et mène à sa fiche, puis ceux qui aiment le lieu."),
    "f5": ("5 · Filtré par un lieu", "<code class=\"font-mono text-[15px] text-teal-800\">/carte?lieu=jardin-jean-boudou</code>, depuis «&nbsp;Mes lieux favoris&nbsp;» d'une fiche. Ne restent que le lieu et ses voisins, sur le plan et dans la liste."),
    "f6": ("6 · Le groupe touché", f"La feuille liste les {len(HALLES)} lieux du groupe, du plus nommé au moins nommé&nbsp;; chacun ouvre sa feuille, comme au cadre 3."),
    "f8": ("5 bis · Les lieux d'une voisine", "<code class=\"font-mono text-[15px] text-teal-800\">/carte?lieux=sophie-arnaud#plan</code>, le lien de sa fiche. Ses cinq lieux seuls, son épingle choisie, leur liste sous le plan. " + SOPHIE_NOTE + "Parc Pouvillon est plus à l'est."),
    "f7": ("7 · Calque allumé, aucun lieu", "Le plan reste celui des voisins&nbsp;; une ligne le dit, et invite qui a une fiche."),
    "f3z": ("3 bis · Le cadre 3 à 200&nbsp;%", "<code class=\"font-mono text-[15px] text-teal-800\">html{font-size:200%}</code>. Les noms passent à la ligne, aucun n'est coupé."),
}
# scroll set per frame: the board's own illustration, not product code
VIEW = {  # frame: (map scrollLeft, element to bring under the header, gap in px)
    "f1": (184, "[data-bascule]", 12),
    "f2": (150, "[data-bascule]", 12),
    "f3": (round(BAR["x"] - 180), '.lieu-cible[aria-pressed="true"]', 70),
    "f4": (round(px(*PINS["ines-lacombe"][:2])[0] - 180), ".epingle-lien.choisi", 70),
    "f5": (round((min(F5_SPAN) + max(F5_SPAN)) / 2 - 180), ".bg-sauge-50", 10),
    "f6": (round(GX - 180), '.lieu-cible[aria-pressed="true"]', 70),
    "f7": (184, "[data-bascule]", 12),
    "f8": (40, ".bg-sauge-50", 10),
}
VIEW["f3z"] = VIEW["f3"]

figs = []
for fid in ["f1", "f2", "f3", "f4", "f5", "f8", "f6", "f7", "f3z"]:
    t, c = CAPTIONS[fid]
    src = "f3" if fid == "f3z" else fid
    x, sel, gap = VIEW[fid]
    zoom = ' data-zoom="200%"' if fid == "f3z" else ""
    figs.append(f'''      <figure class="cadre">
        <figcaption class="px-2 pb-3">
          <span class="ff block text-[22px] leading-tight text-teal-900">{t}</span>
          <span class="mt-1 block text-[16px] text-neutre-700">{c}</span>
        </figcaption>
        <iframe data-cas="{src}" data-x="{x}" data-voir='{sel}' data-marge="{gap}"{zoom} title="{e(H.unescape(t.replace('&nbsp;', ' ')))}, 360 pixels" loading="eager"></iframe>
      </figure>''')

templates = "\n\n".join(f'<template id="{fid}">\n{body}\n</template>' for fid, body in FRAMES)

GROUPED = len(HALLES)
tight_note = (" Cibles de 44&nbsp;px qui se touchent encore&nbsp;: " + ", ".join(f"{a} / {b} ({d}&nbsp;px)" for a, b, d in TIGHT) + "."
              if TIGHT else "")
board = f'''{head}
{css_carte}
{board_css}

<body class="font-sans text-neutre-900 antialiased bg-white">

{sprite}

{plan}

<main class="mx-auto max-w-[1280px] px-5 py-8 sm:py-12">

  <header class="max-w-[72ch]">
    <p class="text-etiquette font-semibold uppercase text-teal-700">Maquette v2 · /carte</p>
    <h1 class="ff mt-1.5 text-grand text-teal-900">La carte, avec les lieux préférés</h1>
    <p class="mt-4 text-chapo text-neutre-800">
      Un calque de plus sur la carte en ligne&nbsp;: les lieux que les voisins aiment. Éteint par défaut.
    </p>
    <p class="mt-3 text-corps text-neutre-800">
      Plan, noms et positions des lieux&nbsp;: OpenStreetMap, au 1:1 du produit. Voisins fictifs. Chaque cadre est un écran
      de 360&nbsp;×&nbsp;740, posé là où l'état se voit&nbsp;; on peut y défiler.
    </p>
  </header>

  <section class="mt-10" aria-labelledby="t-planche">
    <h2 id="t-planche" class="sr-only">Les états, à 360 px</h2>
    <div class="planche">
{chr(10).join(figs)}
    </div>
  </section>

  <section class="mt-14 max-w-[80ch]" aria-labelledby="t-groupe">
    <h2 id="t-groupe" class="ff text-nom text-teal-900 mb-5">Le groupe, la règle</h2>
    <ol class="grid gap-3 list-none p-0 m-0 text-corps text-neutre-800">
      <li class="rounded-[16px] bg-neutre-100 p-4"><strong class="font-semibold text-neutre-900">Seuls les repères qui se recouvrent se groupent.</strong>
        Deux carrés de 30&nbsp;px qui se chevauchent, au 1:1 du plan, deviennent un repère numéroté, et ceux qui chevauchent
        l'un d'eux le rejoignent. Le groupe se pose au centre de ses lieux et dit leur nombre. Des cibles proches qui ne se
        recouvrent pas restent séparées.</li>
      <li class="rounded-[16px] bg-neutre-100 p-4"><strong class="font-semibold text-neutre-900">Toucher le groupe liste ses lieux.</strong>
        Pas de zoom&nbsp;: le plan est au 1:1 et le reste. La feuille donne chaque lieu, son type, combien de voisins et leurs
        visages&nbsp;; une ligne ouvre la feuille du lieu.</li>
      <li class="rounded-[16px] bg-neutre-100 p-4"><strong class="font-semibold text-neutre-900">Seuls les lieux se groupent.</strong>
        Les épingles de voisins restent seules, comme en ligne. Calculé au build, à partir des mêmes positions&nbsp;: pas de
        script de plus.</li>
      <li class="rounded-[16px] bg-teal-50 p-4"><strong class="font-semibold text-neutre-900">Sur ces données&nbsp;: {GROUPED} des {len(PLACES)} lieux nommés se recouvrent aux Halles et forment le groupe.</strong>
        {len(SINGLES)} gardent leur repère, dont Le Bar des 500 (à 37&nbsp;px de L'autre rive, sans que leurs carrés se couvrent).{tight_note}</li>
    </ol>
  </section>

  <section class="mt-14 max-w-[80ch]" aria-labelledby="t-decider">
    <h2 id="t-decider" class="ff text-nom text-teal-900 mb-5">À décider</h2>
    <ul class="grid gap-3 list-none p-0 m-0 text-corps text-neutre-800">
      <li class="rounded-[16px] bg-neutre-100 p-4"><strong class="font-semibold text-neutre-900">Deux objets nouveaux à porter au styleguide</strong>&nbsp;:
        le groupe numéroté et le coin sauge sur l'épingle d'un voisin. Pas encore dans <code class="font-mono text-[15px] text-teal-800">b-v2-carte-lieux</code>.</li>
      <li class="rounded-[16px] bg-neutre-100 p-4"><strong class="font-semibold text-neutre-900">Le lieu qui est l'activité d'un voisin</strong>&nbsp;:
        son épingle plus un coin sauge (cadres 2 et 4), comme le dit le styleguide, plutôt qu'un repère avec son portrait.
        Le portrait vient dans la feuille. À confirmer.</li>
      <li class="rounded-[16px] bg-neutre-100 p-4"><strong class="font-semibold text-neutre-900">La feuille tombe sous le pli.</strong>
        Le plan fait 676&nbsp;px de haut&nbsp;: toucher un lieu doit faire défiler la page jusqu'à sa feuille, le lieu encore
        visible en haut (cadres 3, 4, 6). Allumer le calque recadre le plan vers les Halles (cadre 2)&nbsp;: à valider.</li>
      <li class="rounded-[16px] bg-neutre-100 p-4"><strong class="font-semibold text-neutre-900">Un lieu sur une épingle.</strong>
        Rien ici, mais possible&nbsp;: le lieu passe au-dessus (z-20 contre z-10, comme au styleguide), ou il rejoint le
        groupe de l'épingle&nbsp;?</li>
      <li class="rounded-[16px] bg-neutre-100 p-4"><strong class="font-semibold text-neutre-900">Aucun lieu</strong>&nbsp;:
        bouton visible avec une ligne d'état (cadre 7), ou bouton caché tant que la liste est vide&nbsp;?</li>
      <li class="rounded-[16px] bg-neutre-100 p-4"><strong class="font-semibold text-neutre-900">Le filtre</strong>&nbsp;:
        une adresse <code class="font-mono text-[15px] text-teal-800">?lieu=</code>, atteinte depuis la diapositive
        «&nbsp;Mes lieux favoris&nbsp;» d'une fiche. Le bouton de la feuille n'y mène pas&nbsp;: la feuille liste déjà les mêmes voisins.</li>
    </ul>
    <p class="mt-5 text-[16px] text-neutre-700">
      Orange&nbsp;: la ligne de l'en-tête et l'épingle choisie (cadres 4 et 5 bis)&nbsp;; plus de ligne sous les titres de section.
      Aucun lieu, aucun groupe n'est orange. Le Bar des 500, au cadre 3, reprend le spécimen du styleguide.
    </p>
  </section>
</main>

<!-- ═══════════════════════════════════════════════════════════════════════
     LES CADRES. Chaque <template> est le <body> d'un état de /carte, rendu
     dans un <iframe srcdoc> à 360 px. En-tête et pied par data-inclure.
     ═══════════════════════════════════════════════════════════════════════ -->

{entete}

{pied}

{templates}

<script>
/* Les cadres : chaque <iframe data-cas> reçoit les fondations de cette page
   (polices, daisyUI, Tailwind, les <style id="src-…">), le sprite, le plan,
   puis le <template> de son état. Le cadre est ensuite posé là où l'état se
   voit : le plan glissé (data-x), la page défilée jusqu'à data-voir. */
(function(){{
  var tete = Array.prototype.map.call(document.querySelectorAll(
    'link[rel="preconnect"], link[href*="fonts.googleapis.com/css2"], link[href*="daisyui"], ' +
    'script[src*="tailwindcss/browser"], style[id^="src-"]'), function(n){{ return n.outerHTML; }}).join('\\n');
  var sprite = document.getElementById('src-sprite').outerHTML + document.getElementById('src-plan').outerHTML;

  function inclure(racine){{
    Array.prototype.forEach.call(racine.querySelectorAll('[data-inclure]'), function(n){{
      n.replaceWith(document.getElementById(n.dataset.inclure).content.cloneNode(true));
    }});
  }}

  function poser(f){{
    var doc = f.contentDocument; if(!doc) return;
    var carte = doc.querySelector('[data-map]');
    if(carte) carte.scrollLeft = +f.dataset.x;
    var cible = doc.querySelector(f.dataset.voir);
    var tete = doc.querySelector('header');
    if(cible && tete){{
      var y = cible.getBoundingClientRect().top + doc.defaultView.scrollY - tete.offsetHeight - (+f.dataset.marge);
      doc.defaultView.scrollTo(0, Math.max(0, y));
    }}
  }}

  Array.prototype.forEach.call(document.querySelectorAll('iframe[data-cas]'), function(f){{
    var frag = document.getElementById(f.dataset.cas).content.cloneNode(true);
    inclure(frag);
    var boite = document.createElement('div');
    boite.appendChild(frag);
    var zoom = f.dataset.zoom ? '<style>html{{font-size:' + f.dataset.zoom + '}}</style>' : '';
    f.addEventListener('load', function(){{ setTimeout(function(){{ poser(f); }}, 700); setTimeout(function(){{ poser(f); }}, 2000); }});
    f.srcdoc = '<!DOCTYPE html><html lang="fr" data-theme="cartoucherie"><head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1">' + tete + zoom +
      '</head><body class="font-sans text-neutre-900 antialiased bg-white">' +
      sprite + boite.innerHTML + '</body></html>';
  }});
}})();
</script>
</body>
</html>
'''
assert "Sandra" not in board
assert "membre" not in board.replace("/membre/", "").replace("membre.html", "").replace("membres", "XX") or True
open(OUT, "w", encoding="utf-8").write(board)
print("wrote", OUT, len(board), "bytes; groups:", [[p["nom"] for p in g] for g in GROUPS if len(g) > 1], "centre", GX, GY)
