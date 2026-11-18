// Page « Simulateur de recharge » (/simulateur-recharge) : morceau de build.js.
// Calcul physique simple (énergie ÷ puissance), pertes de charge forfaitaires de 10 %.
// Aucun tarif officiel : le prix du kWh est saisi par le visiteur (valeur d'exemple à remplacer).
'use strict';

module.exports = function recharge({ esc, btn, CONFIG }) {
  const opt = (v, l, sel) => `<option value="${v}"${sel ? ' selected' : ''}>${l}</option>`;
  const body = `
<section class="sub-hero">
  <svg class="ghost" viewBox="0 0 400 240" aria-hidden="true"><circle cx="150" cy="120" r="100"/><circle cx="250" cy="120" r="100"/></svg>
  <div class="wrap">
    <ol class="crumbs rise"><li><a href="/">Accueil</a></li><li><a href="/guides">Guides</a></li><li aria-current="page">Simulateur de recharge</li></ol>
    <h1 class="rise d1">Recharger à la maison : <span>combien de temps, combien ça coûte ?</span></h1>
    <p class="rise d2">Indiquez votre voiture, vos trajets et votre borne : le calcul se met à jour tout seul.</p>
  </div>
</section>

<section class="sec">
  <div class="wrap ev-grid">
    <form class="ev-card" id="evForm" onsubmit="return false">
      <h2>Vos réponses</h2>
      <div class="row2">
        <div class="field"><label for="evKm">Kilomètres par jour</label><input id="evKm" type="number" inputmode="numeric" min="1" max="1000" value="40" /></div>
        <div class="field"><label for="evCons">Consommation (kWh/100 km)</label><input id="evCons" type="number" inputmode="decimal" min="8" max="40" step="0.5" value="18" /><small>Souvent entre 15 et 22 selon la voiture et la saison.</small></div>
      </div>
      <div class="row2">
        <div class="field"><label for="evBat">Capacité de la batterie (kWh)</label><input id="evBat" type="number" inputmode="decimal" min="10" max="150" value="60" /></div>
        <div class="field"><label for="evCar">Charge max. de la voiture (courant alternatif)</label>
          <select id="evCar">${opt('3.7', '3,7 kW')}${opt('7.4', '7,4 kW')}${opt('11', '11 kW', true)}${opt('22', '22 kW')}</select>
          <small>Voir la fiche technique (« chargeur embarqué »).</small></div>
      </div>
      <fieldset class="field ev-power">
        <legend>Comment rechargez-vous ?</legend>
        <div class="ev-opts">
          <label><input type="radio" name="evPow" value="2.3" /><span><b>Prise ordinaire</b>environ 2,3 kW</span></label>
          <label><input type="radio" name="evPow" value="3.7" /><span><b>Borne 3,7 kW</b>monophasé</span></label>
          <label><input type="radio" name="evPow" value="7.4" checked /><span><b>Borne 7,4 kW</b>monophasé</span></label>
          <label><input type="radio" name="evPow" value="11" /><span><b>Borne 11 kW</b>triphasé</span></label>
          <label><input type="radio" name="evPow" value="22" /><span><b>Borne 22 kW</b>triphasé</span></label>
        </div>
      </fieldset>
      <div class="row2">
        <div class="field"><label for="evPrice">Votre prix du kWh (€, TVA comprise)</label><input id="evPrice" type="number" inputmode="decimal" min="0" max="2" step="0.01" value="0.30" /><small>Exemple à remplacer par le prix de votre contrat (voir votre facture).</small></div>
        <div class="field"><label for="evPv">Part rechargée avec vos panneaux solaires</label><input id="evPv" type="range" min="0" max="100" step="10" value="0" /><small><span id="evPvOut">0 %</span> de la recharge, en journée</small></div>
      </div>
    </form>

    <div class="ev-result" aria-live="polite">
      <div class="ev-big">
        <span class="ev-label">Pour vos trajets du jour</span>
        <strong id="rDay">–</strong>
        <span id="rDayKwh" class="ev-sub"></span>
      </div>
      <div class="ev-stats">
        <div><span class="ev-label">De 20 % à 80 %</span><strong id="rFull">–</strong></div>
        <div><span class="ev-label">Autonomie récupérée</span><strong id="rKmh">–</strong></div>
        <div><span class="ev-label">Coût aux 100 km</span><strong id="rCost100">–</strong></div>
        <div><span class="ev-label">Coût par mois</span><strong id="rMonth">–</strong></div>
      </div>
      <p class="ev-note" id="rNote"></p>
      <p class="ev-fine">Estimation indicative : la recharge réelle dépend de la température, de l'état de la batterie et ralentit au-delà de 80 %. Pertes de charge comptées à 10 %. La part solaire est comptée comme gratuite, sans tenir compte de ce que vous auriez touché en l'injectant sur le réseau.</p>
      <div class="ev-cta">
        <h3>Une borne chez vous ?</h3>
        <p>Décrivez votre projet : on vous met en relation avec un électricien partenaire, qui vérifie votre installation et s'occupe des démarches.</p>
        ${btn('/?service=elec#devis', 'Devis gratuit')}
        <a class="text-link" href="/guides/borne-de-recharge-maison">Lire notre guide sur les bornes <span>→</span></a>
      </div>
    </div>
  </div>
</section>`;

  const css = `
.ev-grid{display:grid;grid-template-columns:minmax(0,1fr) 420px;gap:32px;align-items:start}
@media(max-width:980px){.ev-grid{grid-template-columns:1fr}}
.ev-card{background:#fff;border-radius:28px;padding:32px;box-shadow:0 0 0 1px var(--line),0 24px 60px rgba(11,36,65,.08)}
@media(max-width:480px){.ev-card{padding:22px 18px}}
.ev-card h2{font-size:24px;margin-bottom:18px}
.ev-card small{display:block;font-size:12.5px;color:var(--muted);margin-top:6px}
.ev-card input[type=range]{width:100%;accent-color:var(--accent);padding:0;border:0;background:none}
.ev-power{border:0;padding:0;margin:6px 0 14px}
.ev-power legend{font-size:12.5px;font-weight:600;color:var(--muted);margin-bottom:8px;padding:0}
.ev-opts{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
@media(max-width:700px){.ev-opts{grid-template-columns:1fr 1fr}}
.ev-opts label{position:relative;cursor:pointer}
.ev-opts input{position:absolute;opacity:0;inset:0}
.ev-opts span{display:block;height:100%;padding:12px;border-radius:14px;box-shadow:0 0 0 1px var(--line);font-size:12.5px;color:var(--muted);transition:box-shadow .2s,background-color .2s}
.ev-opts b{display:block;font-size:14px;color:var(--ink);margin-bottom:2px}
.ev-opts input:checked+span{box-shadow:0 0 0 2px var(--ink);background:#eef2f7}
.ev-opts input:focus-visible+span{outline:3px solid var(--accent);outline-offset:2px}
.ev-result{position:sticky;top:96px;background:var(--ink);color:#fff;border-radius:28px;padding:30px;box-shadow:0 24px 60px rgba(11,36,65,.25)}
@media(max-width:980px){.ev-result{position:static}}
.ev-label{display:block;font:600 12px 'Inter',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--w60);margin-bottom:6px}
.ev-big strong{display:block;font:600 clamp(40px,5vw,56px)/1 'Plus Jakarta Sans',sans-serif;letter-spacing:-.04em;font-variant-numeric:tabular-nums}
.ev-sub{display:block;color:var(--w78);font-size:15px;margin-top:8px}
.ev-stats{display:grid;grid-template-columns:1fr 1fr;gap:18px 16px;margin:26px 0 18px;padding-top:22px;border-top:1px solid var(--wline)}
.ev-stats strong{font:600 24px 'Plus Jakarta Sans',sans-serif;letter-spacing:-.03em;font-variant-numeric:tabular-nums}
.ev-note{background:rgba(255,122,69,.14);border-radius:14px;padding:12px 14px;font-size:14px;color:#ffd7c7;margin-bottom:14px}
.ev-note:empty{display:none}
.ev-fine{font-size:12.5px;color:var(--w60);margin-bottom:20px}
.ev-cta{background:rgba(255,255,255,.07);border:1px solid var(--wline);border-radius:20px;padding:20px}
.ev-cta h3{font-size:19px;margin-bottom:6px}.ev-cta p{color:var(--w78);font-size:14.5px;margin-bottom:14px}
.ev-cta .text-link{color:#fff;display:flex;margin-top:14px}
`;

  const script = `
const $ = s => document.querySelector(s);
const num = (id, def) => { const v = parseFloat(String($(id).value).replace(',', '.')); return isFinite(v) && v > 0 ? v : def; };
const fmtH = h => { if (!isFinite(h)) return '–'; let m = Math.round(h * 60); if (m < 60) return m + ' min'; const hh = Math.floor(m / 60); m = m % 60; return hh + ' h' + (m ? ' ' + String(m).padStart(2, '0') : ''); };
const eur = v => v.toLocaleString('fr-BE', { style: 'currency', currency: 'EUR', minimumFractionDigits: v < 10 ? 2 : 0, maximumFractionDigits: v < 10 ? 2 : 0 });
const LOSS = 0.9;
function calc() {
  const km = num('#evKm', 40), cons = num('#evCons', 18), bat = num('#evBat', 60);
  const car = num('#evCar', 11), pow = parseFloat((document.querySelector('input[name=evPow]:checked') || {}).value || 7.4);
  const price = Math.max(0, parseFloat(String($('#evPrice').value).replace(',', '.')) || 0);
  const pv = parseInt($('#evPv').value, 10) / 100;
  $('#evPvOut').textContent = Math.round(pv * 100) + ' %';
  const eff = Math.min(pow, car);
  const need = km * cons / 100;              // kWh utiles par jour
  const grid = need / LOSS;                  // kWh tirés au compteur
  $('#rDay').textContent = fmtH(grid / eff);
  $('#rDayKwh').textContent = 'pour ' + km + ' km, soit environ ' + need.toLocaleString('fr-BE', { maximumFractionDigits: 1 }) + ' kWh dans la batterie';
  $('#rFull').textContent = fmtH(bat * 0.6 / LOSS / eff);
  $('#rKmh').textContent = Math.round(eff * LOSS / cons * 100) + ' km / h';
  const paid = 1 - pv;
  $('#rCost100').textContent = eur(cons / LOSS * price * paid);
  $('#rMonth').textContent = eur(grid * price * paid * 30);
  let note = '';
  if (pow > car) note = 'Votre voiture limite la recharge à ' + String(car).replace('.', ',') + ' kW : une borne plus puissante ne chargera pas plus vite.';
  else if (pow === 2.3) note = "Pour un usage quotidien, une borne dédiée est plus rapide et plus sûre qu'une prise ordinaire. Faites vérifier votre installation par un électricien.";
  else if (pow >= 11) note = 'Une borne triphasée demande un raccordement adapté : un électricien vérifie si votre installation le permet.';
  $('#rNote').textContent = note;
}
document.getElementById('evForm').addEventListener('input', calc);
document.getElementById('evForm').addEventListener('change', calc);
calc();`;

  return {
    file: 'simulateur-recharge.html', url: '/simulateur-recharge',
    title: `Simulateur de recharge voiture électrique | ${CONFIG.brand}`,
    description: 'Combien de temps et combien coûte la recharge de votre voiture électrique à la maison ? Selon vos kilomètres, votre voiture, votre borne et votre prix du kWh.',
    body, css, script
  };
};
