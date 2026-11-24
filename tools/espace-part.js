// Espace client Wall'PEB (phase 2) : 3 pages générées par build.js.
//   /bien?c=CODE      page ouverte par le QR code (infos minimales + demande, sans compte)
//   /espace-client    connexion par lien e-mail, historique des contrôles, téléchargement, demande
//   /gestion          page d'administration (Nasser) : biens, documents, QR codes, demandes
// Données : Supabase (projet « wallpeb », Francfort). Sécurité par règles RLS côté base :
// un client ne voit que les biens liés à son e-mail ; seuls les e-mails de la table `admins` gèrent.
'use strict';

const LIBS = ['/vendor/supabase-2.45.4.js'];

const CATS = [
  ['peb', 'Certificat PEB', 10], ['electricite', 'Contrôle électrique', 25], ['chauffage', 'Chauffage / chaudière', 0],
  ['photovoltaique', 'Photovoltaïque', 0], ['borne', 'Borne de recharge', 0], ['ventilation', 'Ventilation', 0],
  ['citerne', 'Citerne', 0], ['gaz', 'Installation gaz', 0], ['facture', 'Facture', 0], ['autre', 'Autre document', 0]
];
const ICO = {
  peb: '<path d="M3 11l9-8 9 8"/><path d="M7 11h6l2 2-2 2H7zM7 17h9l2 2-2 2H7z"/>',
  electricite: '<path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/>',
  chauffage: '<path d="M12 21c-3.9 0-7-2.7-7-6.5 0-3.2 2.3-5 3.5-7.5.6 1.6 1.6 2.6 2.7 3C11.2 7 12.4 4.6 14.5 3c-.3 2.6.7 4.4 2.1 6 1.4 1.6 2.4 3.3 2.4 5.5 0 3.8-3.1 6.5-7 6.5z"/>',
  photovoltaique: '<rect x="3" y="4" width="18" height="12" rx="1"/><path d="M3 10h18M9 4v12M15 4v12M12 16v4M8 20h8"/>',
  borne: '<path d="M6 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M4 21h14"/><path d="M11 7l-2 4h4l-2 4"/>',
  ventilation: '<path d="M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h8"/>',
  citerne: '<rect x="3" y="7" width="18" height="10" rx="5"/><path d="M8 17v3M16 17v3"/>',
  gaz: '<path d="M8 3h8v4H8zM6 7h12v14H6z"/><path d="M10 12h4"/>',
  facture: '<path d="M6 2h12v20l-3-2-3 2-3-2-3 2z"/><path d="M9 7h6M9 11h6M9 15h4"/>',
  autre: '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5"/>'
};

const css = `
.ec-wrap{max-width:860px}
.ec-card{background:var(--card);border-radius:28px;padding:28px;box-shadow:0 0 0 1px var(--line),0 18px 40px rgba(11,36,65,.07);margin-bottom:20px}
@media(max-width:560px){.ec-card{padding:20px;border-radius:22px}}
.ec-card h2{font-size:24px;letter-spacing:-.03em;margin-bottom:6px}
.ec-card h3{font-size:18px;letter-spacing:-.02em;margin:0 0 6px}
.ec-muted{color:var(--muted);font-size:14.5px}
.ec-row{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-end}
.ec-row .field{flex:1 1 220px;margin:0}
.ec-btn{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 18px;border-radius:999px;border:0;cursor:pointer;font:600 14.5px 'Inter',sans-serif;background:var(--accent);color:var(--ink);text-decoration:none}
.ec-btn:hover{background:var(--accent-d)}
.ec-btn.ghost{background:transparent;box-shadow:inset 0 0 0 1px var(--line)}
.ec-btn.ghost:hover{box-shadow:inset 0 0 0 1px var(--ink);background:transparent}
.ec-btn.small{min-height:36px;padding:0 14px;font-size:13.5px}
.ec-btn svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.ec-msg{margin-top:12px;font-size:14px;color:var(--muted)}.ec-msg.ok{color:#1a7f45;font-weight:600}.ec-msg.err{color:#b8261e;font-weight:600}
.ec-bien{border-top:1px solid var(--line);padding-top:20px;margin-top:20px}
.ec-bien:first-of-type{border-top:0;padding-top:0;margin-top:8px}
.ec-head{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;margin-bottom:12px}
.ec-docs{list-style:none;display:grid;gap:10px;padding:0;margin:0}
.ec-doc{display:grid;grid-template-columns:44px 1fr auto;gap:12px;align-items:center;padding:12px 14px;border-radius:18px;background:var(--paper);}
@media(max-width:560px){.ec-doc{grid-template-columns:40px 1fr}.ec-doc .ec-act{grid-column:1/-1}}
.ec-ico{display:grid;place-items:center;width:44px;height:44px;border-radius:14px;background:#fff6d6}
.ec-ico svg{width:22px;height:22px;fill:none;stroke:var(--ink);stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
.ec-doc b{display:block;font:600 15px 'Plus Jakarta Sans',sans-serif}
.ec-doc small{display:block;font-size:13px;color:var(--muted)}
.ec-act{display:flex;gap:8px;flex-wrap:wrap}
.ec-badge{display:inline-flex;align-items:center;gap:6px;font:600 12px 'Inter',sans-serif;padding:3px 10px;border-radius:999px;margin-top:4px}
.ec-badge.ok{background:#e3f4ea;color:#14603a}.ec-badge.soon{background:#fff3d1;color:#7a5500}.ec-badge.exp{background:#fbe1dd;color:#8f1f17}
.ec-empty{padding:16px;border-radius:16px;background:var(--paper);color:var(--muted);font-size:14.5px}
.ec-sujets{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin:4px 0 12px;border:0;padding:0}
.ec-sujets label{position:relative;cursor:pointer}
.ec-sujets input{position:absolute;inset:0;opacity:0;margin:0;cursor:pointer;z-index:1}
.ec-sujets span{display:flex;align-items:center;gap:8px;min-height:48px;padding:8px 12px;border-radius:14px;background:#fafaf8;box-shadow:0 0 0 1px var(--line);font:600 13.5px/1.2 'Inter',sans-serif}
.ec-sujets input:checked+span{background:#fffbea;box-shadow:0 0 0 2px var(--accent-d)}
.ec-sujets input:focus-visible+span{outline:3px solid var(--accent);outline-offset:2px}
.ec-sujets svg{width:20px;height:20px;flex:none;fill:none;stroke:var(--ink);stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
.ec-hero-qr{display:inline-grid;place-items:center;width:64px;height:64px;border-radius:18px;background:rgba(255,255,255,.1);margin-bottom:16px}
.ec-hero-qr svg{width:34px;height:34px;fill:none;stroke:var(--accent);stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
.ec-hide{display:none!important}
.ec-grid2{display:grid;grid-template-columns:1fr 1fr;gap:0 12px}@media(max-width:560px){.ec-grid2{grid-template-columns:1fr}}
.ec-qr{display:flex;gap:16px;align-items:center;flex-wrap:wrap;margin:12px 0}
.ec-qr .qr{width:120px;height:120px;padding:8px;background:#fff;border-radius:12px;box-shadow:0 0 0 1px var(--line)}
.ec-qr .qr svg{width:100%;height:100%}
.ec-table{width:100%;border-collapse:collapse;font-size:14px}
.ec-table td,.ec-table th{padding:10px 8px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}
.ec-tag{font-size:12px;font-weight:600;padding:2px 8px;border-radius:999px;background:var(--paper)}
details.ec-more{border:0}details.ec-more summary{font:600 14.5px 'Inter',sans-serif;padding:10px 0}
`;

const QR_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 17h4v4h-4"/></svg>';
const SUJETS = [
  ['Renouveler un contrôle', '<path d="M4 4v6h6"/><path d="M20 20v-6h-6"/><path d="M5 15a7 7 0 0 0 12.9 2M19 9A7 7 0 0 0 6.1 7"/>'],
  ['Nouveau certificat PEB', ICO.peb],
  ['Contrôle électrique', ICO.electricite],
  ['Question sur un document', '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7"/><path d="M12 17h.01"/>']
];

// JS commun (client Supabase, aide DOM sûre : textContent partout).
function common(CONFIG) {
  return `
const SB = supabase.createClient(${JSON.stringify(CONFIG.espace.url)}, ${JSON.stringify(CONFIG.espace.key)}, { auth: { persistSession: true, detectSessionInUrl: true } });
const CATS = ${JSON.stringify(Object.fromEntries(CATS.map(([k, l, y]) => [k, { l, y }])))};
const ICO = ${JSON.stringify(ICO)};
const $ = s => document.querySelector(s);
function el(tag, attrs, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) { if (k === 'class') e.className = v; else if (k === 'html') e.innerHTML = v; else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else if (v !== false && v != null) e.setAttribute(k, v); }
  for (const k of kids.flat()) if (k != null) e.append(k.nodeType ? k : String(k));
  return e;
}
const icon = k => el('span', { class: 'ec-ico', html: '<svg viewBox="0 0 24 24" aria-hidden="true">' + (ICO[k] || ICO.autre) + '</svg>' });
const fmt = d => d ? new Date(d + 'T12:00:00').toLocaleDateString('fr-BE', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
function badge(d) {
  if (!d) return null;
  const days = (new Date(d + 'T12:00:00') - new Date()) / 864e5;
  if (days < 0) return el('span', { class: 'ec-badge exp' }, 'Expiré depuis le ' + fmt(d));
  if (days < 183) return el('span', { class: 'ec-badge soon' }, 'À renouveler : valable jusqu\\'au ' + fmt(d));
  return el('span', { class: 'ec-badge ok' }, 'Valable jusqu\\'au ' + fmt(d));
}
function say(node, text, kind) { node.textContent = text; node.className = 'ec-msg' + (kind ? ' ' + kind : ''); }
async function download(path, btn) {
  btn.disabled = true;
  const { data, error } = await SB.storage.from('documents').createSignedUrl(path, 120, { download: true });
  btn.disabled = false;
  if (error) return alert('Téléchargement impossible pour le moment. Réessayez ou contactez-nous.');
  location.href = data.signedUrl;
}
`;
}

function sujetsHtml(esc, name) {
  return `<fieldset class="ec-sujets"><legend class="sr">Sujet</legend>${SUJETS.map(([t, d], i) => `<label><input type="radio" name="${name}" value="${esc(t)}"${i === 0 ? ' checked' : ''} /><span><svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>${esc(t)}</span></label>`).join('')}</fieldset>`;
}
function demandeForm(esc, id) {
  return `<form class="ec-dem" id="${id}" novalidate>
        ${sujetsHtml(esc, id + '-sujet')}
        <div class="ec-grid2">
          <div class="field"><label for="${id}-nom">Nom</label><input id="${id}-nom" autocomplete="name" required /></div>
          <div class="field"><label for="${id}-contact">Téléphone ou e-mail</label><input id="${id}-contact" autocomplete="email" required /></div>
        </div>
        <div class="field"><label for="${id}-msg">Message (facultatif)</label><textarea id="${id}-msg" rows="3"></textarea></div>
        <label class="consent"><input type="checkbox" id="${id}-ok" /><span>J'accepte que Lux Energie Solution utilise ces informations pour traiter ma demande (voir <a href="/#confidentialite">confidentialité</a>).</span></label>
        <button class="ec-btn" type="submit">Envoyer ma demande</button>
        <p class="ec-msg" id="${id}-note" aria-live="polite"></p>
      </form>`;
}
const demandeJs = id => `
document.getElementById('${id}').addEventListener('submit', async e => {
  e.preventDefault();
  const v = k => document.getElementById('${id}-' + k).value.trim();
  const note = document.getElementById('${id}-note');
  const sujet = (document.querySelector('input[name="${id}-sujet"]:checked') || {}).value;
  if (v('nom').length < 2 || v('contact').length < 5) return say(note, 'Indiquez votre nom et un téléphone ou un e-mail.', 'err');
  if (!document.getElementById('${id}-ok').checked) return say(note, 'Merci de cocher la case d\\'accord.', 'err');
  say(note, 'Envoi…');
  const { error } = await SB.rpc('soumettre_demande', { p_code: window.EC_CODE || '', p_nom: v('nom'), p_contact: v('contact'), p_sujet: sujet, p_message: v('msg') });
  if (error) return say(note, 'Envoi impossible pour le moment. Réessayez dans un instant.', 'err');
  e.target.reset(); say(note, 'Merci, votre demande est bien envoyée. Nous vous recontactons rapidement.', 'ok');
});`;

module.exports = function espace({ esc, btn, CONFIG, SITE, page, fs, path, ROOT, GHOST }) {
  const head = '<meta name="robots" content="noindex, nofollow" />';
  const urls = [];

  /* ── /bien?c=CODE : page du QR code ─────────────────────── */
  {
    const body = `
<section class="sub-hero">
  ${GHOST}
  <div class="wrap">
    <span class="ec-hero-qr rise">${QR_SVG}</span>
    <h1 class="rise d1">Espace client <span>Wall’PEB.</span></h1>
    <p class="rise d2" id="bienInfo">Chargement des informations du bien…</p>
    <div class="actions rise d3"><a class="btn btn-primary" id="goDocs" href="/espace-client"><span class="roll"><span><span>Voir mes documents</span><span aria-hidden="true">Voir mes documents</span></span></span><span class="chip-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span></a><a class="btn btn-light" href="#demande">Faire une demande</a></div>
  </div>
</section>
<section class="sec">
  <div class="wrap ec-wrap">
    <div class="ec-card">
      <h2>Vos documents, en toute sécurité.</h2>
      <p class="ec-muted">Pour protéger vos données, l'historique et les téléchargements sont réservés au propriétaire : cliquez sur « Voir mes documents » et entrez votre adresse e-mail, vous recevez un lien de connexion. Aucun mot de passe à retenir.</p>
    </div>
    <div class="ec-card" id="demande">
      <h2>Faire une demande</h2>
      <p class="ec-muted" style="margin-bottom:14px">Renouvellement, nouveau contrôle, question sur un document : votre demande est liée à ce bien.</p>
      ${demandeForm(esc, 'qd')}
    </div>
  </div>
</section>`;
    const script = common(CONFIG) + `
const code = (new URLSearchParams(location.search).get('c') || '').replace(/[^a-z0-9]/gi, '').slice(0, 32);
window.EC_CODE = code;
if (code) $('#goDocs').href = '/espace-client?c=' + encodeURIComponent(code);
(async () => {
  const info = $('#bienInfo');
  if (!code) { info.textContent = 'Scannez le QR code apposé dans votre bien pour accéder à son espace.'; return; }
  const { data, error } = await SB.rpc('bien_public', { p_code: code });
  if (error || !data || !data.length) { info.textContent = 'Ce QR code n\\'est pas reconnu. Contactez-nous via le formulaire ci-dessous.'; return; }
  const b = data[0];
  info.textContent = 'Bien suivi par Wall’PEB' + (b.type_bien ? ' · ' + b.type_bien : '') + (b.commune ? ' · ' + b.commune : '') + ' · ' + b.nb_documents + ' document' + (b.nb_documents > 1 ? 's' : '') + ' disponible' + (b.nb_documents > 1 ? 's' : '') + '.';
})();
` + demandeJs('qd');
    fs.writeFileSync(path.join(ROOT, 'bien.html'), page({ title: `Espace client | ${CONFIG.brand}`, description: 'Espace client Wall’PEB : historique de vos contrôles, téléchargement de vos documents et demandes, à partir du QR code de votre bien.', canonical: '/bien', body, css, script, head, libs: LIBS }));
  }

  /* ── /espace-client : connexion + historique ─────────────── */
  {
    const body = `
<section class="sub-hero">
  ${GHOST}
  <div class="wrap">
    <ol class="crumbs rise"><li><a href="/">Accueil</a></li><li aria-current="page">Espace client</li></ol>
    <h1 class="rise d1">Vos contrôles, <span>en un clic.</span></h1>
    <p class="rise d2">L'historique de vos certificats et contrôles, vos documents à télécharger, et vos demandes, au même endroit.</p>
  </div>
</section>
<section class="sec">
  <div class="wrap ec-wrap">
    <div class="ec-card" id="login">
      <h2>Connexion</h2>
      <p class="ec-muted" style="margin-bottom:14px">Entrez l'adresse e-mail communiquée lors de votre rendez-vous : vous recevez un lien de connexion. Aucun mot de passe.</p>
      <form id="loginForm" class="ec-row" novalidate>
        <div class="field"><label for="email">Adresse e-mail</label><input id="email" type="email" autocomplete="email" required /></div>
        <button class="ec-btn" type="submit">Recevoir mon lien</button>
      </form>
      <p class="ec-msg" id="loginNote" aria-live="polite"></p>
    </div>
    <div id="space" class="ec-hide">
      <div class="ec-card">
        <div class="ec-head"><div><h2>Mes biens</h2><p class="ec-muted" id="who"></p></div><button class="ec-btn ghost small" type="button" id="logout">Se déconnecter</button></div>
        <div id="biens"></div>
      </div>
      <div class="ec-card" id="demande">
        <h2>Faire une demande</h2>
        <p class="ec-muted" style="margin-bottom:14px">Renouvellement, nouveau contrôle, question : on vous recontacte rapidement.</p>
        <div class="field" id="bienChoixWrap"><label for="bienChoix">Pour quel bien ?</label><select id="bienChoix"></select></div>
        ${demandeForm(esc, 'ed')}
      </div>
    </div>
  </div>
</section>`;
    const script = common(CONFIG) + `
const qc = (new URLSearchParams(location.search).get('c') || '').replace(/[^a-z0-9]/gi, '').slice(0, 32);
$('#loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  const email = $('#email').value.trim();
  if (!/^\\S+@\\S+\\.\\S+$/.test(email)) return say($('#loginNote'), 'Adresse e-mail invalide.', 'err');
  say($('#loginNote'), 'Envoi du lien…');
  const { error } = await SB.auth.signInWithOtp({ email, options: { shouldCreateUser: true, emailRedirectTo: location.origin + '/espace-client' + (qc ? '?c=' + qc : '') } });
  if (error) return say($('#loginNote'), 'Envoi impossible pour le moment (' + error.message + '). Réessayez dans quelques minutes.', 'err');
  say($('#loginNote'), 'C\\'est envoyé : ouvrez l\\'e-mail et cliquez sur le lien (pensez à vérifier les indésirables).', 'ok');
});
$('#logout').addEventListener('click', async () => { await SB.auth.signOut(); location.href = '/espace-client'; });
async function show(session) {
  if (!session) { $('#login').classList.remove('ec-hide'); $('#space').classList.add('ec-hide'); return; }
  $('#login').classList.add('ec-hide'); $('#space').classList.remove('ec-hide');
  $('#who').textContent = 'Connecté avec ' + session.user.email;
  const { data: biens, error } = await SB.from('biens').select('id, code, libelle, adresse, commune, type_bien, documents(id, categorie, titre, date_controle, valide_jusqu, resultat, fichier)').order('created_at');
  const box = $('#biens'); box.textContent = '';
  if (error) return box.append(el('p', { class: 'ec-msg err' }, 'Chargement impossible pour le moment.'));
  if (!biens.length) return box.append(el('p', { class: 'ec-empty' }, 'Aucun bien n\\'est encore lié à cette adresse e-mail. Si vous avez eu un rendez-vous avec nous, utilisez l\\'adresse donnée ce jour-là, ou faites une demande ci-dessous.'));
  const sel = $('#bienChoix'); sel.textContent = '';
  for (const b of biens) {
    sel.append(el('option', { value: b.code, selected: b.code === qc }, b.libelle));
    const docs = (b.documents || []).sort((x, y) => (y.date_controle || '').localeCompare(x.date_controle || ''));
    box.append(el('div', { class: 'ec-bien' },
      el('div', { class: 'ec-head' }, el('div', {}, el('h3', {}, b.libelle), el('p', { class: 'ec-muted' }, [b.adresse, b.commune, b.type_bien].filter(Boolean).join(' · ')))),
      docs.length ? el('ul', { class: 'ec-docs' }, docs.map(d => el('li', { class: 'ec-doc' },
        icon(d.categorie),
        el('div', {}, el('b', {}, d.titre), el('small', {}, [CATS[d.categorie] ? CATS[d.categorie].l : '', d.date_controle ? 'du ' + fmt(d.date_controle) : '', d.resultat].filter(Boolean).join(' · ')), badge(d.valide_jusqu)),
        el('div', { class: 'ec-act' }, d.fichier ? el('button', { class: 'ec-btn small', type: 'button', onclick: ev => download(d.fichier, ev.currentTarget) }, 'Télécharger') : el('span', { class: 'ec-muted' }, 'Pas de fichier'))
      ))) : el('p', { class: 'ec-empty' }, 'Pas encore de document pour ce bien.')
    ));
  }
  $('#bienChoixWrap').classList.toggle('ec-hide', biens.length < 2);
  window.EC_CODE = sel.value; sel.onchange = () => { window.EC_CODE = sel.value; };
}
SB.auth.onAuthStateChange((_e, s) => show(s));
SB.auth.getSession().then(({ data }) => show(data.session));
` + demandeJs('ed');
    fs.writeFileSync(path.join(ROOT, 'espace-client.html'), page({ title: `Espace client : vos contrôles et documents | ${CONFIG.brand}`, description: 'Espace client Wall’PEB : l’historique de vos certificats PEB et contrôles, vos documents à télécharger en un clic, vos demandes.', canonical: '/espace-client', body, css, script, head, libs: LIBS }));
    urls.push('/espace-client');
  }

  /* ── /gestion : administration (Nasser) ─────────────────── */
  {
    const body = `
<section class="sub-hero">
  <div class="wrap"><h1 class="rise d1">Gestion <span>Espace client.</span></h1><p class="rise d2">Biens, documents, QR codes et demandes.</p></div>
</section>
<section class="sec">
  <div class="wrap ec-wrap">
    <div class="ec-card" id="login">
      <h2>Connexion administrateur</h2>
      <form id="loginForm" class="ec-row" novalidate>
        <div class="field"><label for="email">Adresse e-mail</label><input id="email" type="email" autocomplete="email" required /></div>
        <button class="ec-btn" type="submit">Recevoir mon lien</button>
      </form>
      <p class="ec-msg" id="loginNote" aria-live="polite"></p>
    </div>
    <div id="admin" class="ec-hide">
      <div class="ec-card">
        <div class="ec-head"><div><h2>Demandes</h2><p class="ec-muted" id="who"></p></div><button class="ec-btn ghost small" type="button" id="logout">Se déconnecter</button></div>
        <div id="demandes"></div>
      </div>
      <div class="ec-card">
        <h2>Nouveau bien</h2>
        <form id="newBien" novalidate>
          <div class="ec-grid2">
            <div class="field"><label for="nb-libelle">Nom du bien (ex. Maison Dupont)</label><input id="nb-libelle" required /></div>
            <div class="field"><label for="nb-type">Type</label><select id="nb-type"><option>Maison</option><option>Appartement</option><option>Studio</option><option>Duplex / loft</option><option>Immeuble</option><option>Commerce / bureau</option><option>Autre</option></select></div>
            <div class="field"><label for="nb-adresse">Adresse</label><input id="nb-adresse" /></div>
            <div class="field"><label for="nb-commune">Commune</label><input id="nb-commune" /></div>
            <div class="field"><label for="nb-nom">Propriétaire</label><input id="nb-nom" /></div>
            <div class="field"><label for="nb-email">E-mail du propriétaire (sert à se connecter)</label><input id="nb-email" type="email" required /></div>
          </div>
          <button class="ec-btn" type="submit">Créer le bien et son QR code</button>
          <p class="ec-msg" id="nb-note" aria-live="polite"></p>
        </form>
      </div>
      <div class="ec-card">
        <div class="ec-head"><h2>Biens</h2><div class="field" style="margin:0;min-width:220px"><label for="q" class="sr">Rechercher</label><input id="q" placeholder="Rechercher (nom, commune, e-mail)" /></div></div>
        <div id="biens"></div>
      </div>
    </div>
  </div>
</section>`;
    const catOptions = CATS.map(([k, l]) => `<option value="${k}">${l}</option>`).join('');
    const script = common(CONFIG) + `
const SITE = ${JSON.stringify(SITE)};
const CAT_OPTIONS = ${JSON.stringify(catOptions)};
let ALL = [];
$('#loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  const email = $('#email').value.trim();
  say($('#loginNote'), 'Envoi du lien…');
  const { error } = await SB.auth.signInWithOtp({ email, options: { shouldCreateUser: false, emailRedirectTo: location.origin + '/gestion' } });
  say($('#loginNote'), error ? 'Envoi impossible (' + error.message + ').' : 'Lien envoyé : ouvrez l\\'e-mail.', error ? 'err' : 'ok');
});
$('#logout').addEventListener('click', async () => { await SB.auth.signOut(); location.reload(); });
function qrSvg(text) { const q = qrcode(0, 'M'); q.addData(text); q.make(); return q.createSvgTag({ cellSize: 4, margin: 2, scalable: true }); }
function label(b) {
  const url = SITE + '/bien?c=' + b.code;
  const w = window.open('', '_blank');
  if (!w) return alert('Autorisez les fenêtres pour imprimer l\\'étiquette.');
  w.document.write('<!doctype html><meta charset="utf-8"><title>Étiquette ' + b.code + '</title><style>@page{margin:10mm}body{font-family:Inter,Arial,sans-serif;margin:0}.lab{width:70mm;border:1px solid #ccc;border-radius:4mm;padding:5mm;text-align:center;color:#0b2441}.lab .qr svg{width:44mm;height:44mm}.lab b{display:block;font-size:13pt;margin-top:2mm}.lab small{display:block;font-size:8.5pt;color:#555;margin-top:1mm}.lab i{display:block;font-style:normal;font-size:7pt;color:#888;margin-top:2mm}</style><div class="lab"><div class="qr">' + qrSvg(url) + '</div><b>Espace client Wall’PEB</b><small>Scannez : vos contrôles et documents</small><i>' + b.code + '</i></div><script>setTimeout(()=>print(),300)<\\/script>');
  w.document.close();
}
function render() {
  const q = $('#q').value.trim().toLowerCase();
  const box = $('#biens'); box.textContent = '';
  const list = ALL.filter(b => !q || [b.libelle, b.commune, b.proprietaire_email, b.proprietaire_nom].join(' ').toLowerCase().includes(q));
  if (!list.length) return box.append(el('p', { class: 'ec-empty' }, 'Aucun bien.'));
  for (const b of list) {
    const url = SITE + '/bien?c=' + b.code;
    const docs = (b.documents || []).sort((x, y) => (y.date_controle || '').localeCompare(x.date_controle || ''));
    const form = el('form', { class: 'ec-adddoc', novalidate: true, html:
      '<div class="ec-grid2"><div class="field"><label>Catégorie</label><select name="categorie">' + CAT_OPTIONS + '</select></div>' +
      '<div class="field"><label>Titre</label><input name="titre" placeholder="ex. Certificat PEB 2026" required></div>' +
      '<div class="field"><label>Date du contrôle</label><input name="date_controle" type="date"></div>' +
      '<div class="field"><label>Valable jusqu\\'au (auto PEB 10 ans, élec 25 ans)</label><input name="valide_jusqu" type="date"></div>' +
      '<div class="field"><label>Résultat (facultatif)</label><input name="resultat" placeholder="ex. Label C, conforme"></div>' +
      '<div class="field"><label>Fichier (PDF, JPG, PNG, 10 Mo max)</label><input name="fichier" type="file" accept="application/pdf,image/jpeg,image/png"></div></div>' +
      '<button class="ec-btn small" type="submit">Ajouter le document</button><p class="ec-msg"></p>' });
    const auto = () => { const c = CATS[form.categorie.value], d = form.date_controle.value; if (c && c.y && d && !form.valide_jusqu.dataset.touched) { const x = new Date(d + 'T12:00:00'); x.setFullYear(x.getFullYear() + c.y); form.valide_jusqu.value = x.toISOString().slice(0, 10); } };
    form.categorie.addEventListener('change', auto); form.date_controle.addEventListener('change', auto);
    form.valide_jusqu.addEventListener('input', () => { form.valide_jusqu.dataset.touched = '1'; });
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const note = form.querySelector('.ec-msg');
      if (form.titre.value.trim().length < 2) return say(note, 'Indiquez un titre.', 'err');
      say(note, 'Envoi…');
      let fichier = null;
      const f = form.fichier.files[0];
      if (f) {
        if (f.size > 10485760) return say(note, 'Fichier trop lourd (10 Mo max).', 'err');
        fichier = b.id + '/' + Date.now() + '-' + f.name.normalize('NFD').replace(/[^a-zA-Z0-9.]+/g, '-').slice(-60);
        const up = await SB.storage.from('documents').upload(fichier, f, { contentType: f.type });
        if (up.error) return say(note, 'Envoi du fichier impossible : ' + up.error.message, 'err');
      }
      const { error } = await SB.from('documents').insert({ bien_id: b.id, categorie: form.categorie.value, titre: form.titre.value.trim(), date_controle: form.date_controle.value || null, valide_jusqu: form.valide_jusqu.value || null, resultat: form.resultat.value.trim() || null, fichier });
      if (error) return say(note, 'Erreur : ' + error.message, 'err');
      load();
    });
    const qr = el('div', { class: 'qr', html: qrSvg(url) });
    box.append(el('div', { class: 'ec-bien' },
      el('div', { class: 'ec-head' }, el('div', {}, el('h3', {}, b.libelle), el('p', { class: 'ec-muted' }, [b.adresse, b.commune, b.type_bien, b.proprietaire_nom, b.proprietaire_email].filter(Boolean).join(' · ')))),
      el('div', { class: 'ec-qr' }, qr, el('div', {},
        el('p', { class: 'ec-muted' }, 'QR code : ', el('a', { href: url, target: '_blank', rel: 'noopener' }, url)),
        el('div', { class: 'ec-act', style: 'margin-top:8px' },
          el('button', { class: 'ec-btn small', type: 'button', onclick: () => label(b) }, 'Imprimer l\\'étiquette'),
          el('button', { class: 'ec-btn ghost small', type: 'button', onclick: () => { const a = el('a', { href: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(qrSvg(url)), download: 'qr-' + b.code + '.svg' }); a.click(); } }, 'Télécharger le QR (SVG)'),
          el('button', { class: 'ec-btn ghost small', type: 'button', onclick: async () => { if (!confirm('Supprimer ce bien et tous ses documents ? Action définitive.')) return; const paths = docs.map(d => d.fichier).filter(Boolean); if (paths.length) await SB.storage.from('documents').remove(paths); await SB.from('biens').delete().eq('id', b.id); load(); } }, 'Supprimer le bien')))),
      docs.length ? el('ul', { class: 'ec-docs' }, docs.map(d => el('li', { class: 'ec-doc' }, icon(d.categorie),
        el('div', {}, el('b', {}, d.titre), el('small', {}, [CATS[d.categorie] ? CATS[d.categorie].l : '', d.date_controle ? 'du ' + fmt(d.date_controle) : '', d.resultat].filter(Boolean).join(' · ')), badge(d.valide_jusqu)),
        el('div', { class: 'ec-act' }, d.fichier ? el('button', { class: 'ec-btn ghost small', type: 'button', onclick: ev => download(d.fichier, ev.currentTarget) }, 'Ouvrir') : null,
          el('button', { class: 'ec-btn ghost small', type: 'button', onclick: async () => { if (!confirm('Supprimer ce document ?')) return; if (d.fichier) await SB.storage.from('documents').remove([d.fichier]); await SB.from('documents').delete().eq('id', d.id); load(); } }, 'Supprimer'))))) : el('p', { class: 'ec-empty' }, 'Aucun document.'),
      el('details', { class: 'ec-more' }, el('summary', {}, '+ Ajouter un document'), form)
    ));
  }
}
async function loadDemandes() {
  const { data } = await SB.from('demandes').select('id, created_at, nom, contact, sujet, message, traitee, biens(libelle, commune)').order('created_at', { ascending: false }).limit(100);
  const box = $('#demandes'); box.textContent = '';
  if (!data || !data.length) return box.append(el('p', { class: 'ec-empty' }, 'Aucune demande pour le moment.'));
  box.append(el('table', { class: 'ec-table' }, el('tbody', {}, data.map(d => el('tr', { style: d.traitee ? 'opacity:.55' : '' },
    el('td', {}, new Date(d.created_at).toLocaleString('fr-BE', { dateStyle: 'short', timeStyle: 'short' })),
    el('td', {}, el('b', {}, d.sujet), el('br'), d.nom + ' · ' + d.contact, d.message ? el('div', { class: 'ec-muted' }, d.message) : null, d.biens ? el('span', { class: 'ec-tag' }, d.biens.libelle + (d.biens.commune ? ' · ' + d.biens.commune : '')) : null),
    el('td', {}, el('button', { class: 'ec-btn ghost small', type: 'button', onclick: async () => { await SB.from('demandes').update({ traitee: !d.traitee }).eq('id', d.id); loadDemandes(); } }, d.traitee ? 'Rouvrir' : 'Traitée')))))));
}
async function load() {
  const { data, error } = await SB.from('biens').select('*, documents(*)').order('created_at', { ascending: false });
  if (error) return $('#biens').textContent = 'Erreur : ' + error.message;
  ALL = data; render(); loadDemandes();
}
$('#q').addEventListener('input', render);
$('#newBien').addEventListener('submit', async e => {
  e.preventDefault();
  const v = k => $('#nb-' + k).value.trim();
  if (v('libelle').length < 2 || !/^\\S+@\\S+\\.\\S+$/.test(v('email'))) return say($('#nb-note'), 'Nom du bien et e-mail du propriétaire obligatoires.', 'err');
  const { error } = await SB.from('biens').insert({ libelle: v('libelle'), type_bien: v('type'), adresse: v('adresse') || null, commune: v('commune') || null, proprietaire_nom: v('nom') || null, proprietaire_email: v('email').toLowerCase() });
  if (error) return say($('#nb-note'), 'Erreur : ' + error.message, 'err');
  e.target.reset(); say($('#nb-note'), 'Bien créé : son QR code est prêt ci-dessous.', 'ok'); load();
});
async function show(session) {
  if (!session) return;
  const { data: ok } = await SB.rpc('is_admin');
  if (!ok) { say($('#loginNote'), 'Ce compte n\\'a pas l\\'accès administrateur.', 'err'); return; }
  $('#login').classList.add('ec-hide'); $('#admin').classList.remove('ec-hide');
  $('#who').textContent = 'Connecté avec ' + session.user.email;
  load();
}
SB.auth.onAuthStateChange((_e, s) => show(s));
SB.auth.getSession().then(({ data }) => show(data.session));
`;
    fs.writeFileSync(path.join(ROOT, 'gestion.html'), page({ title: `Gestion | ${CONFIG.brand}`, description: 'Administration de l’Espace client.', canonical: '/gestion', body, css, script, head, libs: [...LIBS, '/vendor/qrcode-1.4.4.js'] }));
  }

  return { urls };
};
