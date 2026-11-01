"""Assemble docs/mockups/v2/formulaire.html from the parts. Static output."""
from parts import *
from etapes import *
import histoire as H

OUT = REPO / "docs/mockups/v2/formulaire.html"


def ecran(code, titre, legende, corps, *, defile=None, hauteur=760):
    """One 360 px phone frame and its caption. `defile` = the id the frame is
    scrolled to on load: a phone-height crop that can still be scrolled."""
    if defile:
        style = f' style="height:{hauteur}px"'
        badge = '<span class="ml-2 rounded-full bg-neutre-200 px-2 py-0.5 text-[15px] font-semibold text-neutre-700 align-middle">écran défilé</span>'
    else:
        style, badge = "", ""
    return f"""
<figure class="cadre m-0" id="f-{code}">
  <div class="cadre-boite"><div class="ecran"{style}>
{('<div class="h-full overflow-y-auto" data-defile="' + defile + '">' + corps + '</div>') if defile else corps}
  </div></div>
  <figcaption class="mt-4 px-1">
    <p class="flex items-baseline gap-2.5"><span class="code tnum">{code}</span><span class="ff text-[20px] leading-tight text-teal-900">{titre}</span>{badge}</p>
    <p class="mt-1.5 text-[16px] leading-snug text-neutre-800">{legende}</p>
  </figcaption>
</figure>"""


def chapitre(ident, surtitre, titre, intro, cadres):
    return f"""
<section class="chapitre" id="{ident}" aria-labelledby="{ident}-t">
  <div class="max-w-[76ch]">
    <p class="text-etiquette font-semibold uppercase text-sauge-800">{surtitre}</p>
    <h2 id="{ident}-t" class="ff mt-1.5 text-nom text-teal-900">{titre}</h2>
    <div class="mt-4 grid gap-3 text-corps text-neutre-800">{intro}</div>
  </div>
  <div class="rangee mt-8">
{''.join(cadres)}
  </div>
</section>"""


CONNEXION = chapitre("connexion", "1 · Avant le formulaire", "Se connecter", """
<p>Un lien magique, pas de mot de passe. L'entrée n'est jamais sur le chemin du visiteur&nbsp;: elle
vit sur <code class="font-mono text-[15px] text-teal-800">/a-propos</code> et dans le pied de page.</p>""", [
    ecran("s1", "«&nbsp;Vous êtes entrepreneur du quartier&nbsp;?&nbsp;»", "Sur <code class=\"font-mono text-[15px] text-teal-800\">/a-propos</code>. C'est une page publique&nbsp;: elle garde son panneau sable et Colly, qui ne reviendra pas dans le formulaire. Le lien « Espace entrepreneur » du pied de page mène au même écran. Orange&nbsp;: le filet, «&nbsp;Créer ma fiche&nbsp;».", s_apropos()),
    ecran("s2", "Connexion", "Un champ, l'emplacement Turnstile, «&nbsp;Recevoir mon lien&nbsp;». Le même écran crée le compte ou reconnecte&nbsp;: on ne demande pas de choisir. Turnstile est dessiné en gris neutre, à sa taille réelle (300&nbsp;×&nbsp;65)&nbsp;; le vrai widget remplace ce cadre.", s_connexion("s2", "sophie.arnaud@example.fr")),
    ecran("s2e", "Connexion — erreur", "L'erreur sous le champ, en mots, avec un exemple, et l'anneau rouge. Le bouton n'est jamais grisé.", s_connexion("s2e", "sophie.arnaud.example.fr", erreur="Il manque le signe @. Exemple&nbsp;: sophie@example.fr")),
    ecran("s3", "«&nbsp;Regardez vos e-mails&nbsp;»", "L'adresse en toutes lettres, pour repérer une faute de frappe. La durée du lien est dite une fois. «&nbsp;Renvoyer le lien&nbsp;» est un bouton fantôme&nbsp;; «&nbsp;Changer d'adresse&nbsp;» revient à l'écran précédent.", s_courriel()),
    ecran("s4", "Le lien a expiré", "Pas de rouge&nbsp;: personne ne s'est trompé. On rassure sur le brouillon, puis on redemande l'adresse. Elle n'est pas pré-remplie&nbsp;: un lien périmé ne doit plus rien révéler.", s_expire()),
])

ETAPES = chapitre("etapes", "2 · Le formulaire", "Votre fiche, en neuf étapes", """
<p><strong class="font-semibold text-neutre-900">L'ordre.</strong> 1&nbsp;Nom et métier · 2&nbsp;Où vous chercher · 3&nbsp;Photo ·
4&nbsp;En une phrase · 5&nbsp;Ce que vous proposez · 6&nbsp;Où vous trouver · 7&nbsp;Vous joindre · 8&nbsp;Infos pratiques ·
9&nbsp;Avis Google. Puis un écran «&nbsp;Votre fiche est complète&nbsp;»&nbsp;: l'envoyer tout de suite, ou raconter son
histoire (chapitre suivant, facultatif). On commence par ce qu'on sait sans réfléchir
(son nom, son métier, ce qu'on fait), pour prendre de l'élan. La photo vient en troisième&nbsp;: c'est l'étape la plus difficile,
mais une fois passée, chaque aperçu montre le vrai visage. Les étapes 1 à 7 sont obligatoires&nbsp;; 8 et 9 sont
entièrement facultatives, à la fin, pour que «&nbsp;Plus tard&nbsp;» ne coupe jamais une étape obligatoire. Le compteur
ne compte que la fiche&nbsp;: «&nbsp;sur 9&nbsp;».</p>
<p><strong class="font-semibold text-neutre-900">Les cinq nouveaux champs.</strong> Le <em>nom de l'activité</em> est à
l'étape&nbsp;1, sous le métier&nbsp;: sur la fiche, il s'écrit à côté («&nbsp;Naturopathe · <strong class="font-semibold">Cabinet du
Bois Vert</strong>&nbsp;»), donc on le demande au même endroit. <em>Tarifs, horaires, lien de réservation, langues</em> forment
l'étape&nbsp;8, «&nbsp;Infos pratiques&nbsp;»&nbsp;: quatre champs facultatifs sur un seul écran, qu'on passe d'un geste. Sur la
fiche, ils vivent dans la carte d'identité, sous l'accroche (<code class="font-mono text-[15px] text-teal-800">b-v2-pratique</code>,
<code class="font-mono text-[15px] text-teal-800">v2/membre.html</code>), et l'aperçu de l'étape les montre là.</p>
<p><strong class="font-semibold text-neutre-900">Une étape, un objet orange&nbsp;:</strong> «&nbsp;Continuer&nbsp;». Les titres de section n'ont plus de filet&nbsp;; l'aperçu de l'étape&nbsp;7, qui contient «&nbsp;Appeler&nbsp;», en compte deux.</p>""", [
    ecran("1a", "1 · Nom et métier", "Quatre réponses courtes, sur un seul sujet&nbsp;: comment vous présenter. L'aperçu est ouvert&nbsp;: l'arche reste en pointillés jusqu'à l'étape&nbsp;3, et le nom de l'activité suit le métier.", e1("e1a")),
    ecran("1b", "1 · «&nbsp;iel&nbsp;»", "Trois réponses, empilées pleine largeur&nbsp;: trois colonnes ne tiendraient pas à 200&nbsp;%. Chacune montre les phrases qu'elle produit sur la fiche&nbsp;: c'est l'aperçu des accords. Ici, «&nbsp;iel&nbsp;» — «&nbsp;Ce qu'iel propose&nbsp;», «&nbsp;Où lae trouver&nbsp;».", e1("e1b", choix="n"), defile="e1b-genre"),
    ecran("1c", "1 · Erreurs", "Le nom vide et l'accord oublié, chacun à côté de sa question. Le filet rouge de 3&nbsp;px tient le groupe des trois réponses.", e1("e1c", erreur=True), defile="e1c-nom"),
    ecran("2a", "2 · Où vous chercher", "Les catégories dites comme sur l'accueil («&nbsp;Je cherche…&nbsp;»). Une cochée&nbsp;: «&nbsp;1 sur 2&nbsp;». «&nbsp;Aucune ne convient&nbsp;» écrit à Adrien. Cochez-en une troisième&nbsp;: le message passe au rouge.", e2("e2a", ["sante-bien-etre"])),
    ecran("2b", "2 · Trois cochées", "Rien n'est bloqué&nbsp;: le message dit quoi faire, le filet rouge tient la liste.", e2("e2b", ["sante-bien-etre", "beaute-soins", "alimentation-traiteur"]), defile=None),
    ecran("3a", "3 · Votre photo", "L'arche vide, un seul bouton. Le sélecteur natif propose l'appareil photo.", e3_vide()),
    ecran("3b", "3 · Le recadrage", "L'arche découpée dans le carré, l'ovale du visage, puis les trois formes publiées. Le cadre de 176&nbsp;px montre un portrait de 128&nbsp;: ×1,375. L'indicateur respire pendant l'envoi.", e3_cadre()),
    ecran("3c", "3 · Photo trop petite", "Montrée à sa taille réelle, avec les deux nombres. En dessous de 200&nbsp;px, la carte du plan serait floue.", e3_petite()),
    ecran("4a", "4 · En une phrase", "Le titre est l'étiquette. L'aperçu montre l'en-tête de fiche, là où vit l'accroche (la ligne de liste n'en a pas). Portrait en 148&nbsp;×&nbsp;176, comme <code class=\"font-mono text-[15px] text-teal-800\">membre.html</code>&nbsp;: ×1,375.", e4("e4a")),
    ecran("4b", "4 · Trop long", "Au-delà de 200, le rouge&nbsp;; le texte reste entier pour qu'on le coupe soi-même. Entre 161 et 200, le compteur passe en sable, sans bloquer.", e4("e4b", erreur=True)),
    ecran("5a", "5 · Ce que vous proposez", "La présentation (aide&nbsp;: trois questions) et les services, de 1 à 6. L'aperçu montre «&nbsp;Son portrait&nbsp;» et «&nbsp;Ce qu'elle propose&nbsp;», accordé.", e5("e5a")),
    ecran("5b", "5 · Aucun service", "Une seule ligne, vide&nbsp;: pas de corbeille, il en faut une.", e5("e5b", erreur=True), defile="e5b-serv"),
    ecran("6a", "6 · Où vous trouver — l'adresse", "La saisie propose les adresses de la Géoplateforme, avec le numéro&nbsp;: on choisit, on ne tape pas tout. La liste pousse les champs suivants au lieu de les couvrir. «&nbsp;Précision&nbsp;» porte ce qui ne se géocode pas.", e6("e6a", "suggestions")),
    ecran("6b", "6 · Un domicile — Camille Roussel", "«&nbsp;C'est aussi mon domicile&nbsp;» décoche le plan&nbsp;; la phrase dit ce qui reste visible. Elle peut le recocher.", e6("e6b", "domicile")),
    ecran("6c", "6 · Hors du plan", "Une adresse du 31300 hors du plan du quartier&nbsp;: pas une erreur. Le panneau sable prévient, la fiche est enregistrée sans repère, Adrien la voit signalée.", e6("e6c", "hors")),
    ecran("6d", "6 · Erreur", "Rien de choisi dans la liste (pas de numéro)&nbsp;: c'est l'erreur de cette étape.", e6("e6d", "erreur")),
    ecran("6e", "6 · «&nbsp;Je me déplace&nbsp;»", "Ni adresse ni plan&nbsp;: une zone, en texte libre. La carte de la liste prendra le disque.", e6_deplace("e6e")),
    ecran("7a", "7 · Vous joindre", "Téléphone et e-mail groupés sous «&nbsp;Au moins l'un des deux&nbsp;». «&nbsp;Même adresse que mon compte&nbsp;» remplit l'e-mail. On colle ce qu'on a&nbsp;: l'aperçu montre le numéro normalisé, le site sans <code class=\"font-mono text-[15px] text-teal-800\">https://www.</code>, l'Instagram en <code class=\"font-mono text-[15px] text-teal-800\">@</code>. Orange&nbsp;: «&nbsp;Appeler&nbsp;» et «&nbsp;Continuer&nbsp;», deux.", e7("e7a")),
    ecran("7b", "7 · Ni téléphone ni e-mail", "L'erreur porte sur le groupe, pas sur un champ&nbsp;: un seul des deux suffit.", e7("e7b", "vide")),
    ecran("7c", "7 · Une faute de frappe", "«&nbsp;gmial.com&nbsp;»&nbsp;: un avertissement sable, pas une erreur, et un bouton qui corrige.", e7("e7c", "typo"), defile="e7c-mail"),
    ecran("8a", "8 · Infos pratiques", "Les quatre nouveaux champs facultatifs, ensemble. Les langues&nbsp;: des cases sur deux colonnes, le français est sous-entendu. L'aperçu montre l'encadré pratique tel qu'il vit sur la fiche&nbsp;: dans la carte d'identité, sous l'accroche et un filet gris, avec «&nbsp;Réserver en ligne&nbsp;» en teal.", e8("e8a")),
    ecran("8b", "8 · Lien de réservation", "Un texte collé à la place d'un lien. Le message montre à quoi ressemble un lien.", e8("e8b", erreur=True), defile="e8b-resa"),
    ecran("9a", "9 · Avis Google — Camille Roussel", "Elle colle le lien de partage de son téléphone (<code class=\"font-mono text-[15px] text-teal-800\">maps.app.goo.gl</code>)&nbsp;; le Worker le résout et nomme la fiche trouvée.", e9("e9a", "ok")),
    ecran("9b", "9 · Pas une fiche Google", "Un lien Pages Jaunes&nbsp;: le message dit où trouver le bon.", e9("e9b", "erreur")),
    ecran("9c", "9 · «&nbsp;Je n'en ai pas&nbsp;» — Sophie Arnaud", "Une phrase sur l'intérêt, le lien pour créer une fiche Google, et la promesse qu'on pourra coller le lien plus tard (le rappel de l'espace).", e9("e9c", "aucune")),
    ecran("fin", "Votre fiche est complète", "Après l'étape&nbsp;9. La fiche peut partir maintenant&nbsp;: «&nbsp;Vérifier et envoyer&nbsp;» mène à la relecture et aux accords. L'histoire est proposée, jamais imposée&nbsp;: «&nbsp;Raconter mon histoire&nbsp;» est le bouton secondaire. Un seul orange.", fiche_complete()),
])

HISTOIRE = chapitre("histoire", "3 · Facultatif", "Votre histoire et vos lieux", """
<p>Six questions facultatives, une par écran, après les étapes de la fiche&nbsp;: chacune devient une page du carrousel
de la fiche, généré au build. L'aperçu montre la page mot pour mot pendant qu'on écrit (tapez&nbsp;: la page suit). Le titre
de la page est l'étiquette du champ, la question d'aide se lit dessous. Les limites sont dures — 300 signes, 160 pour les lieux,
120 pour le motto&nbsp;: au-delà, le compteur passe au rouge en mots. Chaque page peut prendre une photo&nbsp;; sans elle, la
page prend la version maison. «&nbsp;Passer&nbsp;» laisse la question vide, sans page&nbsp;; «&nbsp;Terminer plus tard&nbsp;» mène tout de suite à la relecture.
Le compteur est celui de b-v2-histoire&nbsp;: «&nbsp;Votre histoire · 1 sur 6&nbsp;», les lieux comptant pour une question.</p>
<p>Orange&nbsp;: «&nbsp;Continuer&nbsp;» et le filet de la page, deux par écran. Sophie répond à tout&nbsp;: son carrousel compte
sept pages, la couverture comprise, d'où «&nbsp;Votre page 2 sur 7&nbsp;».</p>""", [
    ecran("10", "Histoire 1 · Pourquoi entreprendre&nbsp;?", "En cours d'écriture, sans photo&nbsp;: l'aperçu est la page maison, et suit la frappe. «&nbsp;Passer&nbsp;» remplace «&nbsp;Plus tard&nbsp;»&nbsp;: tout est facultatif ici.", H.question("h10", 10, H.POURQUOI_EN_COURS, retour="#f-fin", suivant="#f-11a")),
    ecran("11a", "Histoire 2 · Mon déclic, avec une photo", "300 signes, la limite exacte. La photo choisie passe la page en version photo&nbsp;; elle rétrécit pour laisser la place au texte, jamais l'inverse.", H.question("h11a", 11, H.DECLIC, retour="#f-10", suivant="#f-12", photo=H.PHOTO_DECLIC)),
    ecran("11b", "Histoire 2 · Trop long", "333 signes&nbsp;: rouge, icône, «&nbsp;trop long, raccourcissez&nbsp;». Pas de <code class=\"font-mono text-[15px] text-teal-800\">maxlength</code>&nbsp;: rien n'est avalé en silence. «&nbsp;Continuer&nbsp;» ramène au champ.", H.question("h11b", 11, H.DECLIC_LONG, retour="#f-10", suivant="#f-12", photo=H.PHOTO_DECLIC, rows=8), defile="h11b-r-compte"),
    ecran("12", "Histoire 3 · Mon activité en bref", "Le médaillon de la page prend l'icône de la première catégorie.", H.question("h12", 12, H.ACTIVITE, retour="#f-11a", suivant="#f-13")),
    ecran("13", "Histoire 4 · Les entrepreneurs de la Cartoucherie &amp; moi", "Le titre le plus long (42 signes) se replie entre les mots, jamais au milieu. Colly n'apparaît pas dans le formulaire&nbsp;: elle est ajoutée sur la page publiée.", H.question("h13", 13, H.RESEAU, retour="#f-12", suivant="#f-14a")),
    ecran("14a", "Histoire 5 · Vos lieux favoris — chercher", "Deux lieux choisis, on cherche «&nbsp;cab&nbsp;» dans le relevé OpenStreetMap figé au build, et dans les adresses des voisins&nbsp;: aucune requête vers un tiers. Le cabinet de Camille Roussel montre son portrait&nbsp;; La Cabane, l'icône de son type, jamais un logo.", H.lieux("h14a", "recherche")),
    ecran("14b", "Histoire 5 · Trois lieux, et pourquoi", "Chaque lieu peut dire pourquoi, en 80 signes&nbsp;: la phrase vivra sous le lieu, sur le plan. Sous la liste, la phrase facultative de la page (160 signes) et son aperçu.", H.lieux("h14b", "liste"), defile="h14b-p3"),
    ecran("14c", "Histoire 5 · Placer sur la carte", "Pas dans le relevé&nbsp;: on touche le plan, on nomme, on choisit un type parmi sept. Adrien l'approuve avec la fiche. Un sous-écran&nbsp;: «&nbsp;Ajouter ce lieu&nbsp;» y est teal, il n'y a pas de «&nbsp;Continuer&nbsp;».", H.placer("h14c")),
    ecran("14d", "Histoire 5 · Cinq, le maximum", "La recherche s'efface, une phrase la remplace&nbsp;; retirer un lieu la fait revenir. Les «&nbsp;pourquoi&nbsp;» ne vont pas sur la page&nbsp;: ils vivent sur le plan. Le nom le plus long du relevé (61 signes) tient.", H.lieux("h14d", "max"), defile="h14d-phrase"),
    ecran("15", "Histoire 6 · Mon motto", "120 signes. L'arche n'est plus qu'un contour, la phrase prend toute la place. La dernière question&nbsp;: le bouton dit «&nbsp;Vérifier ma fiche&nbsp;».", H.question("h15", 15, H.MOTTO, retour="#f-14d", suivant="#f-v1", rows=4)),
])

VERIFIER = chapitre("verifier", "4 · Avant l'envoi", "Vérifier et envoyer", """
<p>La relecture reprend <em>toutes</em> les réponses, dans l'ordre des étapes, «&nbsp;Votre histoire&nbsp;» comprise&nbsp;;
chaque «&nbsp;Modifier&nbsp;» ramène à l'étape (ici, au cadre). Puis la notice, les trois accords séparés, Turnstile, qui garde
aussi l'envoi (spec v2 §8), et «&nbsp;Envoyer ma fiche&nbsp;».</p>
<p>L'aperçu de la fiche entière s'ouvre en plein écran. Il est montré en quatre écrans&nbsp;; l'orange n'y est plus que le filet
d'en-tête, «&nbsp;Appeler&nbsp;» et le filet des pages du carrousel — les titres de section n'en ont plus. Les cinq nouveaux champs
sont dans la carte d'identité, comme sur <code class="font-mono text-[15px] text-teal-800">v2/membre.html</code>&nbsp;; le
carrousel généré est dans «&nbsp;Son portrait&nbsp;», après le texte, comme sur la fiche en ligne.</p>""", [
    ecran("v1", "Vérifiez votre fiche", "La page entière. «&nbsp;Non renseigné&nbsp;» + «&nbsp;Ajouter&nbsp;» pour un champ facultatif vide. Les réponses de «&nbsp;Votre histoire&nbsp;» en entier, telles que les pages les diront. Un seul orange&nbsp;: «&nbsp;Envoyer ma fiche&nbsp;».", verifier("v1")),
    ecran("va", "Aperçu · 1 / 4", "«&nbsp;Voir toute ma fiche&nbsp;». Le haut de la fiche telle qu'elle sera publiée. L'enseigne en gras à côté du métier&nbsp;; langues, tarifs, horaires et «&nbsp;Réserver en ligne&nbsp;» dans la carte d'identité, sous un filet gris. Orange&nbsp;: filet d'en-tête, «&nbsp;Appeler&nbsp;».", apercu_page(1)),
    ecran("vb", "Aperçu · 2 / 4 — le carrousel", "«&nbsp;Son portrait&nbsp;», puis le carrousel généré, sur sa couverture&nbsp;: «&nbsp;À la rencontre de Sophie Arnaud&nbsp;», tirée du portrait. On le fait glisser&nbsp;; un toucher l'ouvre en plein écran. La couverture n'a pas de filet&nbsp;: un seul orange, «&nbsp;Appeler&nbsp;».", apercu_page(2)),
    ecran("vc", "Aperçu · 3 / 4 — page 5", "Le carrousel glissé jusqu'à «&nbsp;Les entrepreneurs de la Cartoucherie &amp; moi&nbsp;». Colly n'apparaît pas dans le formulaire&nbsp;: elle est ajoutée sur la page publiée. Orange&nbsp;: le filet de la page, «&nbsp;Appeler&nbsp;».", apercu_page(3)),
    ecran("vd", "Aperçu · 4 / 4", "«&nbsp;Ce qu'elle propose&nbsp;» et «&nbsp;Où la trouver&nbsp;», avec la précision et la distance calculée. Pas d'avis&nbsp;: une fiche neuve n'en a pas, la section n'est pas rendue.", apercu_page(4)),
    ecran("v2", "Une réponse manque", "Partie de l'étape&nbsp;4 par «&nbsp;Plus tard&nbsp;», l'accroche est vide&nbsp;: «&nbsp;À compléter&nbsp;» en mots, et le lien dit «&nbsp;Compléter&nbsp;».", verifier("v2e", manque_accroche=True), defile="v2e-acc"),
    ecran("v3", "Un accord manque", "Après «&nbsp;Envoyer ma fiche&nbsp;»&nbsp;: l'erreur se pose sous <em>cette</em> case.", verifier("v3e", manque_accord=True), defile="v3e-err"),
])

APRES = chapitre("apres", "5 · Après l'envoi", "«&nbsp;Merci&nbsp;! Adrien relit votre fiche&nbsp;»", """
<p>L'espace, juste après l'envoi&nbsp;: l'état en attente, ce qui va se passer, et le rappel «&nbsp;fiche Google&nbsp;»,
puisque Sophie a répondu «&nbsp;Je n'en ai pas&nbsp;». C'est le seul endroit de l'espace où Colly apparaît.</p>""", [
    ecran("m1", "Merci", "Le bandeau «&nbsp;En attente de validation&nbsp;» est le panneau sable de la page&nbsp;; le rappel est donc teal. Trois étapes numérotées, chacune en une ligne. Aucun objet orange hors du filet&nbsp;: il n'y a plus rien à faire.", merci()),
])


PAGE_CSS = """<style>
/* ── la planche : pas une page du produit (fond neutre-100, comme le catalogue) ── */
.planche{ background: var(--color-neutre-100); }
.chapitre{ scroll-margin-top:24px; }
.chapitre + .chapitre{ margin-top:72px; }

/* le cadre : un téléphone de 360 px. `contain:layout` en fait le bloc
   conteneur des barres `position:fixed` — « Continuer », « Appeler ». */
.ecran{
  width:360px; position:relative; contain:layout; overflow-x:hidden;
  background:#fff; border-radius:28px;
  box-shadow: 0 0 0 1px var(--color-neutre-300), var(--shadow-flottant);
}
.ecran > *{ font-size:17px; }
.cadre{ width:360px; max-width:100%; flex:none; scroll-margin-top:24px; }
.cadre:target .ecran{ box-shadow: 0 0 0 3px var(--color-teal-600), var(--shadow-flottant); }
.cadre-boite{ max-width:100%; overflow-x:auto; border-radius:28px; }
.rangee{ display:flex; flex-wrap:wrap; gap:48px 32px; align-items:flex-start; }
.code{ font-family:var(--font-mono); font-size:15px; font-weight:600; color:var(--color-teal-800);
       background:#fff; border-radius:999px; padding:2px 10px; box-shadow: inset 0 0 0 1px var(--color-teal-200); }

/* sur un téléphone, la planche s'efface : le cadre fait la largeur de l'écran */
@media (max-width: 400px){
  .rangee{ margin-inline:-16px; }
  .ecran, .cadre-boite{ border-radius:0; }
  .cadre figcaption{ padding-inline:16px; }
}
</style>"""


def head():
    parts = [
        """<!DOCTYPE html>
<html lang="fr" data-theme="cartoucherie">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Le formulaire, de la connexion à l'envoi — maquette v2</title>
<meta name="description" content="Maquette v2 : le parcours d'une entrepreneuse du quartier, de la connexion par lien magique à l'envoi de sa fiche, en cadres de téléphone de 360 px.">""",
        re.search(r'<link rel="icon"[^>]*>', MEMBRE).group(0),
        """
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,600&family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;600&display=swap" rel="stylesheet">

<link href="https://cdn.jsdelivr.net/npm/daisyui@5" rel="stylesheet" type="text/css" />
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>

<!-- Les quatre fondations, copiées verbatim de final/membre.html.
     @theme *static* : sans « static », Tailwind élague les variables qu'aucun
     utilitaire n'utilise et .cta, .filet, .pastille perdent leurs couleurs en silence. -->""",
        style_block(MEMBRE, "src-theme-couleurs"),
        style_block(MEMBRE, "src-theme-typo"),
        style_block(MEMBRE, "src-theme-daisy"),
        "<!-- Fondation 4 — le produit, prise au styleguide : membre.html n'a pas encore .mots-entiers. -->",
        style_block(SG, "src-css-produit"),
        "<!-- Fondations 5 et 6 — v2 et les diapositives, copiées verbatim de final/styleguide.html. -->",
        style_block(SG, "src-css-v2"),
        style_block(SG, "src-css-diapos"),
        "<!-- La planche elle-même — pas le produit. -->",
        PAGE_CSS,
        "</head>",
    ]
    return "\n".join(parts)


INTRO = """
<header class="bg-white">
  <div class="mx-auto max-w-[1560px] px-4 sm:px-8 pt-8 pb-9">
    <p class="flex items-center gap-2.5">
      <svg class="w-8 h-8 text-teal-700 shrink-0" aria-hidden="true"><use href="#i-ventouse"/></svg>
      <span class="leading-none">
        <span class="block text-[11.5px] uppercase tracking-[.18em] text-neutre-700 font-semibold">Annuaire de</span>
        <span class="ff block text-[20px] text-teal-900 leading-tight">la Cartoucherie</span>
      </span>
    </p>
    <p class="mt-7 text-etiquette font-semibold uppercase text-teal-700">Maquette v2 · spec §12.1</p>
    <h1 class="ff mt-2 text-[clamp(2.5rem,8vw,4.5rem)] leading-[0.92] tracking-[-0.032em] text-teal-900 max-w-[18ch]">
      Le formulaire, de la connexion à l'envoi<span class="text-orange-800">.</span>
    </h1>
    <p class="mt-6 text-chapo text-neutre-800 max-w-[60ch]">
      Sophie Arnaud, naturopathe, crée sa fiche sur son téléphone. Chaque cadre fait 360&nbsp;px et montre
      un état, avec sa légende. Camille Roussel prête deux états que Sophie n'a pas&nbsp;: un domicile, une fiche Google.
      Le cadre 1b montre «&nbsp;iel&nbsp;» sur le formulaire de Sophie, pour l'exemple.
    </p>
    <nav class="mt-6" aria-label="Chapitres">
      <ol class="flex flex-wrap gap-2 list-none p-0 m-0 text-[16px] font-semibold">
        <li><a href="#connexion" class="inline-flex items-center min-h-[44px] px-4 rounded-full text-teal-700 bg-teal-50 hover:bg-teal-100">1 · Se connecter</a></li>
        <li><a href="#etapes" class="inline-flex items-center min-h-[44px] px-4 rounded-full text-teal-700 bg-teal-50 hover:bg-teal-100">2 · Votre fiche</a></li>
        <li><a href="#histoire" class="inline-flex items-center min-h-[44px] px-4 rounded-full text-teal-700 bg-teal-50 hover:bg-teal-100">3 · Votre histoire</a></li>
        <li><a href="#verifier" class="inline-flex items-center min-h-[44px] px-4 rounded-full text-teal-700 bg-teal-50 hover:bg-teal-100">4 · Vérifier et envoyer</a></li>
        <li><a href="#apres" class="inline-flex items-center min-h-[44px] px-4 rounded-full text-teal-700 bg-teal-50 hover:bg-teal-100">5 · Après l'envoi</a></li>
      </ol>
    </nav>
    <p class="mt-6 text-[16px] text-neutre-700 max-w-[72ch]">
      Composée à partir de <code class="font-mono text-[15px] text-teal-800">final/styleguide.html</code>, blocs v2 compris.
      Les composants absents du catalogue sont construits ici et signalés dans leur légende.
      Comme le catalogue, cette planche a un fond <code class="font-mono text-[15px] text-teal-800">neutre-100</code>&nbsp;;
      la règle des trois objets orange s'applique à chaque cadre, pas à la planche.
    </p>
  </div>
  <div class="filet h-[3px]"></div>
</header>
"""

DEFILE = """<script>
/* les cadres « écran défilé » : on les ouvre à l'endroit de l'erreur */
function defiler(){
  document.querySelectorAll('[data-defile]').forEach(function(e){
    var c = document.getElementById(e.dataset.defile);
    if(c) e.scrollTop = Math.max(0, c.getBoundingClientRect().top - e.getBoundingClientRect().top + e.scrollTop - 220);
  });
}
/* le carrousel de l'aperçu : on l'ouvre sur la page qu'il illustre */
function glisser(){
  document.querySelectorAll('[data-depart]').forEach(function(t){ t.scrollLeft = t.dataset.depart * t.clientWidth; });
}
window.addEventListener('load', function(){ defiler(); glisser(); setTimeout(function(){ defiler(); glisser(); }, 400); });
</script>"""


def page():
    return "\n".join([
        head(),
        '<body class="planche font-sans text-neutre-900 antialiased">',
        sprite(),
        INTRO,
        '<main class="mx-auto max-w-[1560px] px-4 sm:px-8 py-12">',
        CONNEXION, ETAPES, HISTOIRE, VERIFIER, APRES,
        "</main>",
        script_v2(),
        DEFILE,
        "</body>\n</html>\n",
    ])


if __name__ == "__main__":
    OUT.write_text(page())
    print(OUT, len(OUT.read_text()))
