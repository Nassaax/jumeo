// Page « Simulateur PEB » : morceau de build.js, chargé par build.js (require).
// Estimation INDICATIVE d'une fourchette de label A–G à partir de 7 questions.
// Ce n'est pas un certificat : seul un certificateur agréé établit le label officiel.
//
// Modèle (volontairement simple, réglable ici) : une consommation de référence selon
// l'époque de construction, multipliée par des coefficients (type de bien, toiture, murs,
// fenêtres, chauffage), moins un bonus photovoltaïque. On affiche une fourchette ±20 %
// convertie en labels avec l'échelle des certificats wallons (A ≤ 85 · B ≤ 170 · C ≤ 255 ·
// D ≤ 340 · E ≤ 425 · F ≤ 510 · G au-delà, en kWh/m².an). Les chiffres ne sont jamais affichés.
'use strict';

module.exports = function simulateur({ esc, btn, CONFIG }) {
  const QUESTIONS = [
    { id: 'type', t: 'Quel type de bien ?', o: [['appart', 'Appartement'], ['mitoyenne', 'Maison mitoyenne (2 façades)'], ['3f', 'Maison 3 façades'], ['4f', 'Maison 4 façades']] },
    { id: 'annee', t: 'Quand a-t-il été construit ?', h: 'Une estimation suffit.', o: [['1945', 'Avant 1945'], ['1970', 'De 1945 à 1970'], ['1985', 'De 1971 à 1985'], ['1995', 'De 1986 à 1995'], ['2010', 'De 1996 à 2010'], ['2020', 'De 2011 à 2020'], ['2021', 'Après 2020']] },
    { id: 'toit', t: 'La toiture est-elle isolée ?', h: 'Pour un appartement : seulement si vous êtes au dernier étage.', o: [['recente', 'Oui, isolation récente (moins de 15 ans)'], ['ancienne', 'Oui, isolation plus ancienne'], ['non', 'Non'], ['na', 'Pas concerné (un autre logement au-dessus)'], ['nsp', 'Je ne sais pas']] },
    { id: 'murs', t: 'Les murs extérieurs sont-ils isolés ?', o: [['oui', 'Oui'], ['partiel', 'En partie'], ['non', 'Non'], ['nsp', 'Je ne sais pas']] },
    { id: 'vitrage', t: 'Quelles fenêtres ?', o: [['simple', 'Simple vitrage'], ['double_ancien', 'Double vitrage ancien (avant 2000 environ)'], ['double_recent', 'Double vitrage récent'], ['triple', 'Triple vitrage']] },
    { id: 'chauffage', t: 'Quel est le chauffage principal ?', o: [['chaudiere_ancienne', 'Chaudière gaz ou mazout de plus de 20 ans'], ['chaudiere_recente', 'Chaudière gaz ou mazout récente (condensation)'], ['pac', 'Pompe à chaleur'], ['electrique', 'Chauffage électrique (convecteurs, accumulateurs)'], ['bois', 'Poêle ou chaudière bois / pellets']] },
    { id: 'pv', t: 'Avez-vous des panneaux photovoltaïques ?', o: [['oui', 'Oui'], ['non', 'Non']] }
  ];

  const fieldsets = QUESTIONS.map((q, i) => `
        <fieldset class="q" data-step="${i}">
          <legend><span class="q-num">Question ${i + 1} sur ${QUESTIONS.length}</span>${esc(q.t)}</legend>
          ${q.h ? `<p class="q-help">${esc(q.h)}</p>` : ''}
          <div class="opts">${q.o.map(([v, l]) => `<label class="opt"><input type="radio" name="${q.id}" value="${v}" required /><span>${esc(l)}</span></label>`).join('')}</div>
        </fieldset>`).join('');

  const SCALE = [['A', '#1a7f45'], ['B', '#3f8f3a'], ['C', '#6c8f22'], ['D', '#a07d00'], ['E', '#c0631a'], ['F', '#cf4a2a'], ['G', '#b8261e']];

  const body = `
<section class="sub-hero">
  <svg class="ghost" viewBox="0 0 400 240" aria-hidden="true"><circle cx="150" cy="120" r="100"/><circle cx="250" cy="120" r="100"/></svg>
  <div class="wrap">
    <ol class="crumbs rise"><li><a href="/">Accueil</a></li><li aria-current="page">Simulateur PEB</li></ol>
    <h1 class="rise d1">Quel label pour votre bien&nbsp;?<br><span>Estimez-le en 1 minute.</span></h1>
    <p class="rise d2">Sept questions simples pour avoir une première idée de la fourchette de label de votre logement, et des pistes pour l'améliorer.</p>
  </div>
</section>

<section class="sec sim-sec">
  <div class="wrap sim-grid">
    <div>
      <div class="warn" role="note"><b>Ceci n'est pas un certificat PEB.</b> C'est une estimation indicative, basée sur vos réponses. Seul un certificateur agréé par la Région wallonne peut établir le label officiel, après une visite du bien.</div>

      <form id="simForm" class="sim-card" novalidate>
        <div class="progress" aria-hidden="true"><span id="simBar"></span></div>
        ${fieldsets}
        <div class="sim-nav">
          <button type="button" class="btn btn-ghost" id="simBack">Retour</button>
          <button type="submit" class="btn btn-primary" id="simNext"><span class="roll"><span><span>Voir mon estimation</span><span aria-hidden="true">Voir mon estimation</span></span></span><span class="chip-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span></button>
        </div>
        <p class="form-note" id="simNote" aria-live="polite"></p>
      </form>

      <div class="sim-card result hide" id="simResult" tabindex="-1" aria-live="polite">
        <span class="eyebrow">Votre estimation</span>
        <h2 id="resTitle">Votre bien se situe probablement entre C et D.</h2>
        <div class="res-scale" id="resScale">${SCALE.map(([l, c]) => `<span data-l="${l}" style="--c:${c}">${l}</span>`).join('')}</div>
        <div class="warn small"><b>Estimation indicative, pas un certificat.</b> Le label réel peut être différent : il dépend de mesures précises et des preuves (factures, fiches techniques) que le certificateur relève sur place.</div>
        <h3>Ce qui pèse sur votre résultat</h3>
        <ul class="tips" id="resTips"></ul>
        <div class="res-cta">
          <h3>Obtenez votre vrai certificat</h3>
          <p>Indiquez votre commune : on vous prépare un devis, avec votre estimation déjà jointe.</p>
          <div class="res-row">
            <div class="field"><label for="simCommune">Votre commune</label><input id="simCommune" placeholder="ex : Liège" autocomplete="address-level2" /></div>
            <a class="btn btn-primary" id="simCta" href="/#devis"><span class="roll"><span><span>Recevoir mon devis</span><span aria-hidden="true">Recevoir mon devis</span></span></span><span class="chip-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span></a>
          </div>
          <p class="fine">Certificat PEB : ${CONFIG.prices.peb} € ${esc(CONFIG.vat || '')} (prix indicatif, confirmé avant intervention).</p>
        </div>
        <button type="button" class="text-btn" id="simRestart">Recommencer la simulation</button>
      </div>
    </div>

    <aside class="sim-side">
      <div class="tip"><b>Bon à savoir</b><p>Sans preuve (facture, photo, fiche technique), le certificateur doit appliquer des valeurs par défaut, en général moins favorables. Préparez vos documents avant la visite.</p></div>
      <div class="tip" style="margin-top:16px"><b>Vos réponses restent chez vous</b><p>Le simulateur fonctionne dans votre navigateur : rien n'est enregistré ni envoyé tant que vous ne demandez pas de devis.</p></div>
    </aside>
  </div>
</section>`;

  const css = `
.sim-grid{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:40px;align-items:start}
@media(max-width:900px){.sim-grid{grid-template-columns:1fr}}
.warn{background:#fff7ed;border:1px solid #fed7aa;color:#7c2d12;border-radius:18px;padding:16px 18px;font-size:15px;margin-bottom:20px}
.warn b{color:#7c2d12}.warn.small{font-size:14px;margin:22px 0}
.sim-card{background:#fff;border-radius:28px;padding:32px;box-shadow:0 0 0 1px var(--line),0 24px 60px rgba(11,36,65,.08)}
@media(max-width:480px){.sim-card{padding:22px 18px}}
.progress{height:6px;border-radius:99px;background:var(--paper-2);overflow:hidden;margin-bottom:26px}
.progress span{display:block;height:100%;width:0;background:var(--accent);border-radius:99px;transition:width .4s var(--e-std)}
.q{border:0;margin-bottom:26px}
.q legend{font:600 clamp(22px,2.6vw,28px)/1.15 'Plus Jakarta Sans',sans-serif;letter-spacing:-.03em;margin-bottom:14px;padding:0}
.q-num{display:block;font:600 12px 'Inter',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);margin-bottom:10px}
.q-help{color:var(--muted);font-size:14.5px;margin:-4px 0 14px}
.opts{display:grid;gap:10px}
.opt{position:relative;display:block;cursor:pointer}
.opt input{position:absolute;opacity:0;inset:0}
.opt span{display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:16px;box-shadow:0 0 0 1px var(--line);font-size:15.5px;transition:box-shadow .2s,background-color .2s}
.opt span::before{content:"";width:18px;height:18px;border-radius:50%;flex:none;box-shadow:inset 0 0 0 2px rgba(11,36,65,.3);transition:box-shadow .2s}
.opt:hover span{box-shadow:0 0 0 1px var(--ink)}
.opt input:checked+span{box-shadow:0 0 0 2px var(--ink);background:#eef2f7}
.opt input:checked+span::before{box-shadow:inset 0 0 0 6px var(--accent)}
.opt input:focus-visible+span{outline:3px solid var(--accent);outline-offset:2px}
.sim-nav{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}
.stepper .q{display:none}.stepper .q.on{display:block;animation:rise .45s var(--e-out) both}
.result h2{font-size:clamp(26px,3.4vw,38px);margin-bottom:22px}
.res-scale{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}
.res-scale span{height:46px;border-radius:12px;display:grid;place-items:center;font:700 17px 'Plus Jakarta Sans',sans-serif;color:#fff;background:var(--c);opacity:.28;transition:opacity .4s,transform .4s var(--e-out)}
.res-scale span.on{opacity:1;transform:translateY(-6px);box-shadow:0 10px 24px rgba(11,36,65,.2)}
.result h3{font-size:19px;margin:6px 0 12px}
.tips{list-style:none;display:grid;gap:12px;margin-bottom:28px}
.tips li{padding:14px 16px;border-radius:16px;background:var(--paper);font-size:15px;color:var(--muted)}
.tips b{color:var(--ink)}
.res-cta{background:var(--ink);color:#fff;border-radius:22px;padding:24px;margin-bottom:16px}
.res-cta h3{color:#fff;margin-top:0}.res-cta p{color:var(--w78);font-size:15px;margin-bottom:14px}.res-cta .fine{color:var(--w60);margin-top:10px}
.res-row{display:flex;gap:12px;align-items:flex-end;flex-wrap:wrap}.res-row .field{flex:1 1 200px;margin:0}
.res-cta .field label{color:var(--w78)}
.text-btn{background:none;border:0;font:600 14px 'Inter',sans-serif;color:var(--ink);text-decoration:underline;cursor:pointer;padding:6px 0}
.sim-side .tip p{font-size:15px}
`;

  const script = `
const LABELS = [['A',85],['B',170],['C',255],['D',340],['E',425],['F',510],['G',Infinity]];
const BASE = { '1945':520, '1970':470, '1985':400, '1995':330, '2010':260, '2020':150, '2021':80 };
const K = {
  type: { appart:.75, mitoyenne:.9, '3f':1, '4f':1.12 },
  toit: { recente:.85, ancienne:.93, non:1, na:.9, nsp:1 },
  murs: { oui:.82, partiel:.92, non:1, nsp:1 },
  vitrage: { simple:1.08, double_ancien:1, double_recent:.94, triple:.9 },
  chauffage: { chaudiere_ancienne:1.12, chaudiere_recente:.95, pac:.72, electrique:1.35, bois:.85 }
};
const label = e => LABELS.find(([, max]) => e <= max)[0];
const form = document.getElementById('simForm');
const steps = [...form.querySelectorAll('.q')];
const bar = document.getElementById('simBar');
const back = document.getElementById('simBack');
const nextLabel = document.querySelectorAll('#simNext .roll span span');
const note = document.getElementById('simNote');
let i = 0;
form.classList.add('stepper');
function show(n) {
  i = n;
  steps.forEach((s, k) => s.classList.toggle('on', k === i));
  bar.style.width = (i / steps.length * 100) + '%';
  back.style.visibility = i ? 'visible' : 'hidden';
  const txt = i === steps.length - 1 ? 'Voir mon estimation' : 'Question suivante';
  nextLabel.forEach(s => s.textContent = txt);
  note.textContent = '';
}
const answer = id => (form.querySelector('input[name="' + id + '"]:checked') || {}).value;
form.addEventListener('change', e => {
  if (e.target.type === 'radio' && i < steps.length - 1) setTimeout(() => show(i + 1), 220);
});
back.addEventListener('click', () => show(Math.max(0, i - 1)));
form.addEventListener('submit', e => {
  e.preventDefault();
  const cur = steps[i].querySelector('input').name;
  if (!answer(cur)) { note.textContent = 'Choisissez une réponse pour continuer.'; note.style.color = '#c2410c'; return; }
  if (i < steps.length - 1) return show(i + 1);
  result();
});
function result() {
  const a = {}; ['type','annee','toit','murs','vitrage','chauffage','pv'].forEach(k => a[k] = answer(k));
  let e = BASE[a.annee] * K.type[a.type] * K.toit[a.toit] * K.murs[a.murs] * K.vitrage[a.vitrage] * K.chauffage[a.chauffage];
  if (a.pv === 'oui') e -= 35;
  e = Math.max(20, e);
  const lo = label(e * .8), hi = label(e * 1.2);
  const range = lo === hi ? lo : lo + '-' + hi;
  document.getElementById('resTitle').textContent = lo === hi
    ? 'Votre bien se situe probablement en ' + lo + '.'
    : 'Votre bien se situe probablement entre ' + lo + ' et ' + hi + '.';
  const order = 'ABCDEFG';
  document.querySelectorAll('#resScale span').forEach(s => {
    const p = order.indexOf(s.dataset.l);
    s.classList.toggle('on', p >= order.indexOf(lo) && p <= order.indexOf(hi));
  });
  const tips = [];
  if (a.toit === 'non') tips.push(['Toiture', "c'est souvent par là que la chaleur s'échappe en premier. Son isolation est l'un des travaux les plus regardés."]);
  if (a.murs === 'non' || a.murs === 'partiel') tips.push(['Murs', a.type === '3f' || a.type === '4f' ? 'avec plusieurs façades exposées, l\\'isolation des murs pèse lourd dans le résultat.' : 'leur isolation peut faire une vraie différence, même pour un bien mitoyen.']);
  if (a.vitrage === 'simple' || a.vitrage === 'double_ancien') tips.push(['Fenêtres', 'un vitrage ancien laisse passer beaucoup de chaleur. Des châssis récents comptent dans le calcul.']);
  if (a.chauffage === 'chaudiere_ancienne' || a.chauffage === 'electrique') tips.push(['Chauffage', a.chauffage === 'electrique' ? 'le chauffage électrique direct est défavorable dans le calcul du certificat.' : 'une chaudière de plus de 20 ans pèse sur le résultat. Un système récent est mieux noté.']);
  if ([a.toit, a.murs].includes('nsp')) tips.push(['Preuves', 'vous ne savez pas ? Cherchez les factures ou photos de travaux : sans preuve, le certificateur applique des valeurs par défaut.']);
  if (!tips.length) tips.push(['Bonne nouvelle', 'votre bien semble déjà bien équipé. Le certificat le confirmera, preuves à l\\'appui : gardez factures et fiches techniques.']);
  document.getElementById('resTips').innerHTML = tips.slice(0, 3).map(([t, d]) => '<li><b>' + t + ' :</b> ' + d + '</li>').join('');
  const cta = document.getElementById('simCta');
  const commune = document.getElementById('simCommune');
  const upd = () => { const c = commune.value.trim(); cta.href = '/?' + (c ? 'commune=' + encodeURIComponent(c) + '&' : '') + 'sim=' + range + '#devis'; };
  commune.oninput = upd; upd();
  form.classList.add('hide');
  const r = document.getElementById('simResult');
  r.classList.remove('hide');
  r.focus({ preventScroll: true });
  r.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
}
document.getElementById('simRestart').addEventListener('click', () => {
  form.reset(); form.classList.remove('hide');
  document.getElementById('simResult').classList.add('hide');
  show(0); form.scrollIntoView({ block: 'start' });
});
show(0);`;

  return {
    file: 'simulateur-peb.html',
    url: '/simulateur-peb',
    title: `Simulateur PEB gratuit : estimez votre label | ${CONFIG.brand}`,
    description: `Estimez en 1 minute la fourchette de label PEB (A à G) de votre logement en Wallonie : 7 questions, des pistes d'amélioration. Estimation indicative, ce n'est pas un certificat.`,
    body, css, script
  };
};
