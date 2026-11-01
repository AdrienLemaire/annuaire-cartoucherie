# Generates the « Les diapositives » styleguide block (b-v2-diapos).
import html, sys

NB = " "
def fr(t):
    """French typography: non-breaking space before ? ! : ; » and after «."""
    for c in "?!:;»":
        t = t.replace(" " + c, NB + c)
    t = t.replace("« ", "«" + NB)
    return t

def esc(t):
    return html.escape(fr(t), quote=False).replace(NB, "&nbsp;")

def attr(t):
    return html.escape(fr(t), quote=False).replace('"', "&quot;").replace(NB, " ")

NOM, METIER, PAGES = "Sophie Arnaud", "Naturopathe", 7
PHOTO = "https://picsum.photos/id/{}/768/960"

Q = [
  dict(k="pourquoi", titre="Pourquoi entreprendre ?", icone="l-autre", fond="var(--color-sable-100)", photo=225,
       alt_photo="Une théière en verre sur une table de cabinet",
       texte="Pendant douze ans, j'ai travaillé en pharmacie hospitalière. J'aimais soigner, mais je n'avais jamais le temps d'écouter vraiment. En 2021, j'ai repris mes études de naturopathie pour accompagner autrement : prendre une heure, comprendre le rythme de chacun, et construire un suivi qui lui ressemble."),
  dict(k="declic", titre="Mon déclic", icone="i-ampoule", fond="var(--color-sauge-100)", photo=365,
       alt_photo="Une tasse fumante posée sur un livre ouvert",
       texte="Une patiente m'a dit, un beau jour : « Vous êtes la première à me demander comment vous dormez. » Ce soir-là, en rentrant à vélo le long du canal de Brienne, j'ai su que je voulais exercer à mon compte, près de chez moi, avec des voisins que je recroiserais au marché des Halles, chaque samedi matin."),
  dict(k="activite", titre="Mon activité en bref", icone="c-sante", fond="#ffffff", photo=292,
       alt_photo="Des légumes et des herbes fraîches sur une planche",
       texte="Je reçois au cabinet du Bois Vert, du mardi au samedi, des adultes et des étudiants. Un premier bilan d'une heure trente, puis un suivi mensuel : alimentation, sommeil, gestion du stress. Je travaille en lien avec les médecins du quartier, jamais à leur place. Atelier cuisine de saison, jeudis soir."),
  dict(k="reseau", titre="Les entrepreneurs de la Cartoucherie & moi", icone="i-groupe", fond="var(--color-sable-200)", photo=42,
       alt_photo="Des tables de café en bois, deux tasses",
       texte="Toute seule à mon compte, je craignais l'isolement. Le réseau m'a donné des collègues : on se recommande, on partage nos idées, on se dépanne. Je veux que la Cartoucherie devienne un quartier où l'on prend soin de soi sans traverser Toulouse, et où chaque commerçant connaît le prénom de ses voisins.",
       colly=True, titre_taille="5.8cqi"),
  dict(k="lieux", titre="Mes lieux favoris", icone="i-carte", fond="var(--color-teal-50)", photo=570,
       alt_photo="Les arbres d'un parc, en fin de journée",
       texte="Le samedi, je fais mon marché aux Halles, je prends un café aux P'tits Tous, puis je lis au parc Pouvillon avant d'ouvrir le cabinet. Et le jeudi soir : squash.",
       titre_taille="6.2cqi", photo_min="18cqi", lieux=[("l-cafe", "Les P'tits Tous", "Café, bar"), ("l-cafe", "Le Bar des 500", "Café, bar"),
              ("l-parc", "Parc Pouvillon", "Parc, jardin"), ("l-boutique", "L'autre rive cartoucherie", "Boutique"),
              ("l-sport", "UCPA TOULOUSE Les Halles de la Cartoucherie - Fitness & Squash", "Sport")]),
  dict(k="motto", titre="Mon motto", icone="i-coeur", photo=488,
       alt_photo="Un bol de salade colorée",
       texte="Prendre soin de soi n'est pas un luxe : c'est la base de tout le reste, et ça commence très souvent par une bonne nuit !"),
]
for q in Q:
    assert len(fr(q["texte"])) <= (160 if q["k"] == "lieux" else 120 if q["k"] == "motto" else 300), (q["k"], len(q["texte"]))

def tete(page, ind):
    return (f'{ind}<div class="diapo__tete">\n'
            f'{ind}  <span class="diapo__marque"><svg aria-hidden="true"><use href="#i-ventouse"/></svg>Annuaire de la Cartoucherie</span>\n'
            f'{ind}  <span class="diapo__page">{page}&nbsp;/&nbsp;{PAGES}</span>\n'
            f'{ind}</div>\n')

def signature(ind):
    return f'{ind}<p class="diapo__signature"><span class="diapo__nom">{esc(NOM)}</span><span>{esc(METIER)} · cartoucherie.fyi</span></p>\n'

def corps_texte(q, ind):
    out = ""
    if q["k"] == "motto":
        return out
    if q["k"] == "lieux":
        out += f'{ind}<ul class="diapo__lieux">\n'
        for icone, nom, typ in q["lieux"]:
            out += (f'{ind}  <li class="diapo__lieu"><span class="diapo__lieu-icone"><svg aria-hidden="true"><use href="#{icone}"/></svg></span>'
                    f'<span class="diapo__lieu-nom">{esc(nom)}<span class="diapo__lieu-type">{esc(typ)}</span></span></li>\n')
        out += f'{ind}</ul>\n'
        out += f'{ind}<p class="diapo__phrase">{esc(q["texte"])}</p>\n'
    else:
        out += f'{ind}<p class="diapo__texte">{esc(q["texte"])}</p>\n'
    return out

def alt(q):
    if q["k"] == "lieux":
        return attr(q["titre"] + " — " + ", ".join(n for _, n, _ in q["lieux"]) + ". " + q["texte"])
    return attr(q["titre"] + " — " + q["texte"])

def maison(q, page):
    i = "      "
    motto = q["k"] == "motto"
    cls = "diapo diapo--maison" + (" diapo--motto" if motto else "")
    t = f'{i}<div class="{cls}" role="img" aria-label="{alt(q)}">\n'
    t += f'{i}  <div class="diapo__motif"></div>\n'
    t += f'{i}  <div class="diapo__corps">\n'
    t += tete(page, i + "    ")
    style = "" if motto else f' style="--fond:{q["fond"]}' + (f'; --titre:{q["titre_taille"]}' if q.get("titre_taille") else "") + '"'
    t += f'{i}    <div class="diapo__arche"{style}>\n'
    if motto:
        t += f'{i}      <span class="diapo__guillemet" aria-hidden="true">«</span>\n'
        t += f'{i}      <p class="diapo__motto">{esc(q["texte"])}</p>\n'
    else:
        t += f'{i}      <span class="diapo__medaillon"><svg aria-hidden="true"><use href="#{q["icone"]}"/></svg></span>\n'
        t += f'{i}      <p class="diapo__titre">{esc(q["titre"])}</p>\n'
        t += f'{i}      <span class="diapo__filet"></span>\n'
        t += corps_texte(q, i + "      ")
    t += signature(i + "      ")
    t += f'{i}    </div>\n'
    t += f'{i}  </div>\n'
    if q.get("colly"):
        t += f'{i}  <img class="diapo__colly" src="../_shared/colly/colly-couleur.png" alt="" width="400" height="473">\n'
    t += f'{i}</div>\n'
    return t

def photo(q, page):
    i = "      "
    motto = q["k"] == "motto"
    cls = "diapo diapo--photo" + (" diapo--motto" if motto else "")
    vars_ = ([f'--titre:{q["titre_taille"]}'] if q.get("titre_taille") else []) + ([f'--photo-min:{q["photo_min"]}'] if q.get("photo_min") else [])
    style = f' style="{"; ".join(vars_)}"' if vars_ else ""
    t = f'{i}<div class="{cls}" role="img" aria-label="{alt(q)}"{style}>\n'
    t += f'{i}  <div class="diapo__corps">\n'
    t += tete(page, i + "    ")
    t += f'{i}    <div class="diapo__photo"><img src="{PHOTO.format(q["photo"])}" alt="" width="768" height="960"></div>\n'
    if motto:
        t += f'{i}    <p class="diapo__motto">«&nbsp;{esc(q["texte"])}&nbsp;»</p>\n'
    else:
        t += f'{i}    <p class="diapo__titre">{esc(q["titre"])}</p>\n'
        t += f'{i}    <span class="diapo__filet"></span>\n'
        t += corps_texte(q, i + "    ")
    t += signature(i + "    ")
    t += f'{i}  </div>\n'
    t += f'{i}</div>\n'
    return t

def couverture(nom, metier, portrait, de):
    i = "      "
    lab = attr(f"À la rencontre {de}{nom}, {metier}")
    t = f'{i}<div class="diapo diapo--maison diapo--couverture" role="img" aria-label="{lab}">\n'
    t += f'{i}  <div class="diapo__motif"></div>\n'
    t += f'{i}  <div class="diapo__corps">\n'
    t += tete(1, i + "    ")
    t += f'{i}    <img class="diapo__portrait" src="{portrait}" alt="" width="128" height="128">\n'
    t += f'{i}    <p class="diapo__rencontre">À la rencontre {esc(de.strip())}</p>\n'
    t += f'{i}    <p class="diapo__nom-grand">{esc(nom)}</p>\n'
    t += f'{i}    <p class="diapo__metier">{esc(metier)}</p>\n'
    t += f'{i}    <p class="diapo__pied">cartoucherie.fyi/membre/{nom.lower().replace(" ", "-").replace("è","e").replace("é","e")}</p>\n'
    t += f'{i}  </div>\n'
    t += f'{i}</div>\n'
    return t

def specimen(legende, tpl, serie=False, cls="mt-8"):
    s = f'  <div data-specimen class="{cls}"' + (' data-serie' if serie else '') + '>\n'
    s += f'    <p class="variante">{legende}</p>\n'
    s += '    <template>\n' + tpl + '    </template>\n'
    s += '    <div class="duo mt-3">\n      <div class="scene-boite"><div class="scene" data-rendu></div></div>\n'
    s += '      <div class="relative min-w-0"><pre class="code" data-code></pre></div>\n    </div>\n  </div>\n\n'
    return s

out = open(sys.argv[1]).read()  # the hand-written head of the block
out += specimen("La couverture, toujours tirée du portrait&nbsp;: «&nbsp;À la rencontre de Sophie Arnaud&nbsp;». Page 1&nbsp;: elle n'a pas de variante photo.",
                couverture(NOM, "Naturopathe · Cabinet du Bois Vert", "https://randomuser.me/api/portraits/women/26.jpg", "de "), serie=True, cls="mt-6")
out += specimen("La même, devant une voyelle&nbsp;: «&nbsp;À la rencontre d'Inès Lacombe&nbsp;» — l'élision vient d'<code class=\"font-mono text-[15px] text-teal-800\">elideDe()</code>, comme partout.",
                couverture("Inès Lacombe", "Professeure de yoga", "https://randomuser.me/api/portraits/women/90.jpg", "d'"))
noms = {"pourquoi": "Pourquoi entreprendre&nbsp;?", "declic": "Mon déclic", "activite": "Mon activité en bref",
        "reseau": "Les entrepreneurs de la Cartoucherie &amp; moi", "lieux": "Mes lieux favoris", "motto": "Mon motto"}
notes = {
  "pourquoi": "300 signes, la limite dure, exactement.",
  "declic": "300 signes, avec une citation entre guillemets.",
  "activite": "300 signes. Le médaillon prend l'icône de la première catégorie du voisin.",
  "reseau": "Le titre le plus long (42 signes) passe à 5,8&nbsp;cqi. Maison&nbsp;: Colly s'accroche au bord de l'arche, loin de tout visage — c'est la seule page de la série où elle apparaît.",
  "lieux": "Cinq lieux, dont le nom le plus long du relevé OpenStreetMap (61 signes), et la phrase à 160. Les «&nbsp;pourquoi&nbsp;» ne viennent pas ici&nbsp;: ils vivent sur le plan, sous chaque lieu.",
  "motto": "120 signes. Maison&nbsp;: l'arche n'est plus qu'un contour, la phrase prend toute la place.",
}
for n, q in enumerate(Q, start=2):
    out += specimen(f"{noms[q['k']]} — maison. {notes[q['k']]}", maison(q, n), serie=True)
    out += specimen(f"{noms[q['k']]} — avec la photo du voisin, dans l'arche.", photo(q, n))
out += "</section>\n\n\n"
open(sys.argv[2], "w").write(out)
print("ok", len(out))
