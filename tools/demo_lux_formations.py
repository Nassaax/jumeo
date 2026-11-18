"""Démo Lux : page « Formations » + bouton dans le menu, le pied de page et l'accueil.

Appelé par make_demo_lux.py, après les remplacements (les pages sont déjà aux couleurs de Lux).
Contenu validé par Nasser le 2026-11-18 : domaines PEB, électricité, photovoltaïque, chauffage / PAC ;
public : particuliers, professionnels de l'immobilier, artisans / techniciens ; inscription
« Je suis intéressé » (pas de dates ni de prix tant que Lux ne les a pas donnés).
"""
import os, re

CAP = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/><path d="M22 9v6"/></svg>'

DOMAINES = [
    ('peb', 'Certificat PEB', 'PEB', ['Lire et comprendre un certificat PEB', 'Ce qui fait monter ou baisser le label', 'Les documents et preuves à préparer avant la visite']),
    ('elec', 'Électricité', 'Électricité', ['Comprendre un tableau électrique', 'À quoi sert le contrôle de conformité', 'Les bons réflexes de sécurité']),
    ('pv', 'Photovoltaïque', 'Photovoltaïque', ['Comment fonctionne une installation', 'Autoconsommation : utiliser son énergie au bon moment', 'Suivi et entretien de base']),
    ('chauffage', 'Chauffage &amp; pompe à chaleur', 'Chauffage / pompe à chaleur', ['Chaudière ou pompe à chaleur : les bonnes questions', "L'entretien et ce qu'il apporte", 'Régler son chauffage pour consommer moins']),
]
PUBLICS = [
    ('Particuliers', 'Propriétaires, futurs acheteurs, locataires : comprendre avant de vendre, d\'acheter ou de rénover.'),
    ("Professionnels de l'immobilier", 'Agences, notaires, gestionnaires de biens : répondre avec assurance aux questions de vos clients.'),
    ('Artisans et techniciens', 'Électriciens, chauffagistes, installateurs : approfondir un domaine voisin du vôtre.'),
]

CSS = """<style id="formations">
.fm-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
@media(max-width:1000px){.fm-grid{grid-template-columns:1fr 1fr}}
@media(max-width:560px){.fm-grid{grid-template-columns:1fr}}
.fm-card{display:flex;flex-direction:column;background:var(--card);border-radius:24px;overflow:hidden;box-shadow:0 0 0 1px var(--line)}
.fm-card img{display:block;width:100%;height:auto;aspect-ratio:16/10;object-fit:cover}
.fm-card div{padding:20px 22px 24px}
.fm-card h3{font-size:18px;letter-spacing:-.02em;margin-bottom:10px}
.fm-card ul{list-style:none;display:grid;gap:8px;font-size:14.5px;color:var(--muted)}
.fm-card li{display:flex;gap:10px}.fm-card li::before{content:"";flex:none;width:7px;height:7px;margin-top:8px;border-radius:50%;background:var(--accent)}
.fm-who{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:28px}
@media(max-width:900px){.fm-who{grid-template-columns:1fr}}
.fm-who div{padding:22px;border-radius:24px;background:var(--card);box-shadow:0 0 0 1px var(--line)}
.fm-who b{display:block;font:600 17px 'Plus Jakarta Sans',sans-serif;margin-bottom:6px}
.fm-who p{font-size:14.5px;color:var(--muted)}
.fm-note{margin-top:22px;padding:16px 18px;border-radius:18px;background:#fff6d6;font-size:14.5px;color:var(--ink)}
.fm-form{max-width:760px;background:var(--card);border-radius:28px;padding:32px;box-shadow:0 0 0 1px var(--line),0 18px 40px rgba(11,36,65,.08)}
@media(max-width:560px){.fm-form{padding:22px}}
.fm-form fieldset{border:0;margin:0 0 18px;padding:0}
.fm-form legend{font:600 15px 'Plus Jakarta Sans',sans-serif;margin-bottom:10px}
.fm-opts{display:flex;flex-wrap:wrap;gap:8px}
.fm-opts label{position:relative;cursor:pointer}
.fm-opts input{position:absolute;opacity:0;inset:0;width:100%;height:100%;margin:0;cursor:pointer}
.fm-opts span{display:inline-block;padding:9px 15px;border-radius:999px;font-size:14.5px;box-shadow:0 0 0 1px var(--line);background:#fafaf8;transition:background .2s,box-shadow .2s}
.fm-opts input:checked+span{background:var(--ink);color:#fff;box-shadow:none}
.fm-opts input:focus-visible+span{outline:3px solid var(--accent);outline-offset:2px}
.fm-row{display:grid;grid-template-columns:1fr 1fr;gap:0 14px}
@media(max-width:560px){.fm-row{grid-template-columns:1fr}}
.fm-f{margin-bottom:12px}
.fm-f label{display:block;font-size:12.5px;font-weight:600;color:var(--muted);margin-bottom:6px}
.fm-f input,.fm-f textarea{width:100%;padding:12px 14px;border:1px solid var(--line);border-radius:14px;font:15px 'Inter',sans-serif;background:#fafaf8;color:var(--ink)}
.fm-f input:focus,.fm-f textarea:focus{outline:none;border-color:var(--ink);background:#fff;box-shadow:0 0 0 3px rgba(242,183,5,.35)}
.fm-consent{display:flex;gap:10px;font-size:13px;color:var(--muted);margin:6px 0 18px;align-items:flex-start}
.fm-consent input{margin-top:3px;width:16px;height:16px;flex:none;accent-color:var(--ink)}
.fm-msg{margin-top:12px;font-size:14px;color:var(--muted)}.fm-msg.err{color:#b8261e;font-weight:600}
.fm-teaser{display:grid;grid-template-columns:1.2fr 1fr;gap:28px;align-items:center;padding:40px;border-radius:32px;background:var(--ink);color:#fff}
@media(max-width:900px){.fm-teaser{grid-template-columns:1fr;padding:28px 22px}}
.fm-teaser h2{font-size:clamp(28px,3.4vw,42px);letter-spacing:-.035em;line-height:1.05;margin-bottom:12px}
.fm-teaser p{color:var(--w78);margin-bottom:22px}
.fm-teaser .eyebrow{color:#fff}
.fm-teaser ul{list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:10px}
.fm-teaser li{display:flex;align-items:center;gap:10px;padding:14px;border-radius:18px;background:rgba(255,255,255,.07);font-weight:600;font-size:14.5px}
.fm-teaser li::before{content:"";flex:none;width:8px;height:8px;border-radius:50%;background:var(--accent)}
.nav a{white-space:nowrap}
.nav-new{display:inline-block;width:7px;height:7px;margin-left:6px;border-radius:50%;background:var(--accent);vertical-align:3px}
@media(max-width:1400px){.hdr-call span{display:none}.hdr-call{padding:0 11px}}
@media(max-width:760px){.hdr-call span{display:inline}}
.fm-grid{margin-top:28px}.fm-form{margin-top:28px}
</style>"""

BTN = ('<a class="btn btn-primary" href="{href}"><span class="roll"><span><span>{t}</span><span aria-hidden="true">{t}</span></span></span>'
       '<span class="chip-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span></a>')

TEASER = """<!-- ═════════ FORMATIONS (encart) ═════════ -->
<section class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="fm-teaser reveal">
      <div>
        <span class="eyebrow">Formations</span>
        <h2>Formez-vous avec ceux qui font.</h2>
        <p>Des formations pratiques pour les particuliers, les professionnels de l'immobilier et les artisans, données par une équipe qui certifie et installe au quotidien.</p>
        """ + BTN.format(href='/formations', t='Voir les formations').replace('<svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>', '<svg class="ico"><use href="#i-arrow"/></svg>') + """
      </div>
      <ul><li>PEB</li><li>Électricité</li><li>Photovoltaïque</li><li>Chauffage &amp; PAC</li></ul>
    </div>
  </div>
</section>

"""


def page_main(wa, mail):
    cards = ''.join(
        '<article class="fm-card reveal"><img src="/photos/' + k + '.webp" alt="" width="800" height="500" loading="lazy" decoding="async" />'
        '<div><h3>' + t + '</h3><ul>' + ''.join('<li>' + x + '</li>' for x in items) + '</ul></div></article>'
        for k, t, _, items in DOMAINES)
    who = ''.join('<div class="reveal"><b>' + t + '</b><p>' + p + '</p></div>' for t, p in PUBLICS)
    doms = ''.join('<label><input type="checkbox" name="domaine" value="' + v + '" /><span>' + v + '</span></label>' for _, _, v, _ in DOMAINES)
    pubs = ''.join('<label><input type="radio" name="profil" value="' + t + '"' + (' checked' if i == 0 else '') + ' /><span>' + t + '</span></label>' for i, (t, _) in enumerate(PUBLICS))
    return """<main>

<section class="sub-hero">
  <svg class="ghost" viewBox="0 0 400 240" aria-hidden="true"><circle cx="150" cy="120" r="100"/><circle cx="250" cy="120" r="100"/></svg>
  <div class="wrap">
    <ol class="crumbs rise"><li><a href="/">Accueil</a></li><li aria-current="page">Formations</li></ol>
    <h1 class="rise d1">Comprendre son énergie, <span>pour mieux décider.</span></h1>
    <p class="rise d2">PEB, électricité, photovoltaïque, chauffage : des formations pratiques, données par une équipe qui certifie et installe au quotidien.</p>
    <div class="actions rise d3">""" + BTN.format(href='#inscription', t='Je suis intéressé') + """</div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow">4 domaines</span>
      <h2>Ce que vous apprendrez.</h2>
      <p>Exemples de thèmes abordés. Le programme exact est adapté à votre profil et à votre besoin.</p>
    </div>
    <div class="fm-grid">""" + cards + """</div>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow">Pour qui ?</span>
      <h2>Une formation à votre mesure.</h2>
    </div>
    <div class="fm-who">""" + who + """</div>
    <p class="fm-note reveal"><b>Bon à savoir :</b> ce sont des formations pratiques. Elles ne remplacent pas la formation officielle de certificateur PEB reconnue par la Région wallonne, et ne donnent pas d'agrément.</p>
  </div>
</section>

<section class="sec" id="inscription" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow">Inscription</span>
      <h2>Intéressé ? Dites-nous ce qui vous parle.</h2>
      <p>Programme, dates, durée et tarif vous sont communiqués sur demande, sans engagement.</p>
    </div>
    <form class="fm-form reveal" id="fmForm" novalidate>
      <fieldset><legend>Quels domaines ?</legend><div class="fm-opts">""" + doms + """</div></fieldset>
      <fieldset><legend>Vous êtes…</legend><div class="fm-opts">""" + pubs + """</div></fieldset>
      <div class="fm-row">
        <div class="fm-f"><label for="fmNom">Nom</label><input id="fmNom" autocomplete="name" required /></div>
        <div class="fm-f"><label for="fmTel">Téléphone</label><input id="fmTel" type="tel" autocomplete="tel" required /></div>
        <div class="fm-f"><label for="fmMail">E-mail (facultatif)</label><input id="fmMail" type="email" autocomplete="email" /></div>
        <div class="fm-f"><label for="fmCommune">Commune (facultatif)</label><input id="fmCommune" autocomplete="address-level2" placeholder="ex : Liège" /></div>
      </div>
      <div class="fm-f"><label for="fmTxt">Une précision ? (facultatif)</label><textarea id="fmTxt" rows="2" placeholder="Nombre de personnes, disponibilités, sujet précis…"></textarea></div>
      <label class="fm-consent"><input type="checkbox" id="fmOk" required /><span>J'accepte que Lux Energie Solution utilise ces informations pour me recontacter au sujet des formations. Elles ne sont ni vendues ni partagées.</span></label>
      """ + BTN.replace('<a class="btn btn-primary" href="{href}">', '<button class="btn btn-primary" type="submit">').replace('</a>', '</button>').format(t='Envoyer ma demande') + """
      <p class="fm-msg" id="fmMsg" aria-live="polite">Votre demande s'ouvre dans WhatsApp, prête à envoyer. Rien n'est enregistré sur ce site.</p>
    </form>
  </div>
</section>
</main>"""


def page_js(wa, mail):
    return """<script>
(function () {
  var f = document.getElementById('fmForm'); if (!f) return;
  var msg = document.getElementById('fmMsg');
  var val = function (id) { return document.getElementById(id).value.trim(); };
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var doms = [].slice.call(f.querySelectorAll('input[name=domaine]:checked')).map(function (i) { return i.value; });
    var prof = (f.querySelector('input[name=profil]:checked') || {}).value || '';
    var err = !doms.length ? 'Choisissez au moins un domaine.' : !val('fmNom') ? 'Indiquez votre nom.' : !val('fmTel') ? 'Indiquez votre téléphone.' : !document.getElementById('fmOk').checked ? 'Merci de cocher la case d\\'accord.' : '';
    msg.classList.toggle('err', !!err);
    if (err) { msg.textContent = err; return; }
    var lines = ['Bonjour, je suis intéressé(e) par une formation.', 'Domaines : ' + doms.join(', '), 'Profil : ' + prof, 'Nom : ' + val('fmNom'), 'Téléphone : ' + val('fmTel')];
    if (val('fmMail')) lines.push('E-mail : ' + val('fmMail'));
    if (val('fmCommune')) lines.push('Commune : ' + val('fmCommune'));
    if (val('fmTxt')) lines.push('Précision : ' + val('fmTxt'));
    var text = lines.join('\\n');
    window.open('https://wa.me/""" + wa + """?text=' + encodeURIComponent(text), '_blank', 'noopener');
    msg.innerHTML = 'WhatsApp s\\'est ouvert avec votre message. Pas de WhatsApp ? <a href="mailto:""" + mail + """?subject=' + encodeURIComponent('Formation') + '&body=' + encodeURIComponent(text) + '">Envoyer par e-mail</a>.';
  });
})();
</script>"""


def build(out, demo_url, wa, mail):
    # 1. La page, à partir de « Nos zones » (déjà aux couleurs de Lux)
    s = open(os.path.join(out, 'certificat-peb', 'index.html'), encoding='utf-8').read()
    title = 'Formations PEB, électricité, photovoltaïque, chauffage | Lux Energie Solution'
    desc = "Formations pratiques en PEB, électricité, photovoltaïque et chauffage pour particuliers, professionnels de l'immobilier et artisans, en Wallonie."
    s = re.sub(r'<title>[^<]*</title>', '<title>' + title + '</title>', s, 1)
    s = re.sub(r'(<meta (?:name="description"|property="og:description") content=")[^"]*"', lambda m: m.group(1) + desc.replace("'", '&#39;') + '"', s)
    s = re.sub(r'(<meta property="og:title" content=")[^"]*"', lambda m: m.group(1) + title + '"', s)
    s = s.replace(demo_url + '/certificat-peb"', demo_url + '/formations"')
    s = re.sub(r'(<script type="application/ld\+json">\{"@context":"https://schema.org","@type":"BreadcrumbList".*?)</script>',
               '<script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Accueil","item":"' + demo_url + '/"},{"@type":"ListItem","position":2,"name":"Formations","item":"' + demo_url + '/formations"}]}</script>', s, 1, flags=re.S)
    s = s.replace('<span class="app-title">Nos zones</span>', '<span class="app-title">Formations</span>', 1)
    a, b = s.index('<main>'), s.index('</main>') + len('</main>')
    s = s[:a] + page_main(wa, mail) + s[b:]
    s = s.replace('</body>', page_js(wa, mail) + '\n</body>', 1)
    assert s.count('/formations"') >= 2 and 'Nos zones</span>' not in s.split('<main>')[0].split('app-title')[-1][:30]
    open(os.path.join(out, 'formations.html'), 'w', encoding='utf-8').write(s)

    # 2. Le bouton « Formations » partout : menu ordinateur, menu mobile, pied de page ; encart sur l'accueil
    sheet_item = '<a href="/formations">' + CAP + 'Formations</a>'
    for dirpath, _, files in os.walk(out):
        for f in files:
            if not f.endswith('.html'):
                continue
            p = os.path.join(dirpath, f)
            t = open(p, encoding='utf-8').read()
            t = re.sub(r'(<a href="/?#pros">Professionnels</a>)(\s*\n)', r'\1\2      <a href="/formations">Formations<span class="nav-new" title="Nouveau"></span></a>\2', t, 1)
            t = re.sub(r'(<a href="/#pros"><svg[^\n]*?</svg>Professionnels</a>)', r'\1\n      ' + sheet_item.replace('\\', r'\\'), t, 1)
            t = re.sub(r'(<h4>Navigation</h4>\s*(?:<a href="/">Accueil</a>)?<a href="/?#tarifs">Tarifs</a>)', r'\1<a href="/formations">Formations</a>', t, 1)
            t = t.replace('<style id="demo-lux">', CSS + '\n<style id="demo-lux">', 1)
            if f == 'index.html' and dirpath == out:
                t = t.replace('<!-- ═════════ SIMULATEUR (encart) ═════════ -->', TEASER + '<!-- ═════════ SIMULATEUR (encart) ═════════ -->', 1)
                assert 'fm-teaser' in t
            for need in ('href="/formations">Formations<span', '>Formations</a>', 'id="formations"'):
                assert need in t, (p, need)
            open(p, 'w', encoding='utf-8').write(t)

    # 3. Plan du site
    sm = os.path.join(out, 'sitemap.xml')
    x = open(sm, encoding='utf-8').read()
    if '/formations<' not in x:
        x = x.replace('</urlset>', '  <url>\n    <loc>' + demo_url + '/formations</loc>\n  </url>\n</urlset>')
        open(sm, 'w', encoding='utf-8').write(x)
