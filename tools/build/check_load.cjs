// Checks the shipped load-model factors (loadfx.js, MODEL LM1 sections 2–3) against data.js. Exit 1 on any error.
// The load maths are app.js's own: the block between the "LM1 begin" and "LM1 end" marker lines is run as it is.
// Errors: an exercise without factors or factors without an exercise; v, pat, ecc, tier, runInt outside their enums; mx, bw, rir
// out of range; uni ≠ the exercise's sides; prime not 1–2 muscle zones of the exercise (0 only without muscle zones); rw keys
// outside its zones, a weight ≤ 0, Σ rw ≠ 1, a non-prime zone weighing more than every prime zone; P without integer cpr ≥ 1 and
// a tier, non-P with cpr or tier; R without metres per rep (unless a timed drill: minutes only); a shipped protocol whose load is
// not finite and ≥ 0; the golden test (MODEL section 8, Trening A): Σ B(sets) = 262.9 ± 0.5.
// Info (not an error): how many fields differ from deriveFx(e), to improve the derivation used for his own exercises.
// usage: node tools/build/check_load.cjs <repo>
'use strict';
const fs = require('fs'), path = require('path');
const repo = process.argv[2] || path.join(__dirname, '..', '..');
global.window = { HistoryModel:require(path.resolve(repo,'history-model.js')) };
const run = f => { const src = fs.readFileSync(path.join(repo, f), 'utf8'); new Function('window', src)(window); };
const errs = [], info = [];
const err = m => errs.push(m);
try { run('data.js'); } catch(e) { console.log('ERROR data.js: ' + e.message); process.exit(1); }
try { run('loadfx.js'); } catch(e) { console.log('ERROR loadfx.js: ' + e.message); process.exit(1); }
const app = fs.readFileSync(path.join(repo, 'app.js'), 'utf8');
const a = app.indexOf('// ---- LM1 begin ----'), b = app.indexOf('// ---- LM1 end ----');
if (a < 0 || b < a) { console.log('ERROR app.js: the LM1 block markers are missing'); process.exit(1); }
const EX = window.SEED.exercises, PR = window.SEED.protocols || {}, X = window.EXFX;
const S = { ex: {}, log: [] };
Object.keys(EX).forEach(id => { S.ex[id] = Object.assign({ id }, EX[id]); });
const M = new Function('S', 'window', app.slice(a, b) + '\nreturn { LM, deriveFx, loadFx, setLoad, itemPts, computeSession };')(S, window);
const { LM } = M;
if (!X || typeof X !== 'object') { console.log('ERROR loadfx.js does not set window.EXFX'); process.exit(1); }
Object.keys(EX).forEach(id => { if (!X[id]) err(id + ': no factors in loadfx.js'); });
Object.keys(X).forEach(id => { if (!EX[id]) err(id + ': factors for an exercise that data.js does not have'); });
const near = (x, y) => Math.abs(x - y) <= 0.001;
const diff = {};
Object.keys(X).filter(id => EX[id]).forEach(id => {
  const f = X[id], e = S.ex[id], zs = e.zones || [], mus = zs.filter(z => LM.MUSCLE.indexOf(z) !== -1), E = m => err(id + ': ' + m);
  if (f.v !== 1) E('v must be 1');
  if (!Object.prototype.hasOwnProperty.call(LM.PAT, f.pat)) E('pat "' + f.pat + '" unknown');
  if (f.mx != null && !(typeof f.mx === 'number' && f.mx >= 0.05 && f.mx <= 1.5)) E('mx ' + f.mx + ' outside 0.05–1.5');
  if (f.uni !== !!e.sides) E('uni ' + f.uni + ' ≠ sides ' + !!e.sides);
  if ([0, 1, 2].indexOf(f.ecc) === -1) E('ecc ' + f.ecc + ' not 0 | 1 | 2');
  if (!Array.isArray(f.prime)) E('prime is not a list');
  else {
    if (f.prime.some(z => mus.indexOf(z) === -1)) E('prime ' + f.prime.join('+') + ' not among its muscle zones ' + mus.join(', '));
    if (f.prime.length > 2 || (mus.length ? f.prime.length < 1 : f.prime.length !== 0)) E('prime must have 1–2 zones (0 only without muscle zones): ' + f.prime.length);
  }
  if (!f.rw || typeof f.rw !== 'object') E('rw missing');
  else {
    const keys = Object.keys(f.rw), allowed = zs.length ? zs : ['Cijelo tijelo'];
    keys.forEach(z => { if (allowed.indexOf(z) === -1) E('rw zone "' + z + '" is not one of its zones'); if (!(typeof f.rw[z] === 'number' && f.rw[z] > 0)) E('rw ' + z + ' = ' + f.rw[z] + ' (must be > 0)'); });
    const s = keys.reduce((t, z) => t + f.rw[z], 0); if (Math.abs(s - 1) > 0.001) E('Σ rw = ' + s.toFixed(4));
    if (Array.isArray(f.prime) && f.prime.length) { const mx = Math.max.apply(null, keys.map(z => f.rw[z])), mp = Math.max.apply(null, f.prime.map(z => f.rw[z] || 0)); if (mp + 0.001 < mx) E('a non-prime zone weighs more (' + mx + ') than every prime zone (' + mp + ')'); }
  }
  if (f.bw != null && !(typeof f.bw === 'number' && f.bw >= 0.3 && f.bw <= 1.05)) E('bw ' + f.bw + ' outside 0.3–1.05');
  if (!(typeof f.rir === 'number' && f.rir >= 0 && f.rir <= 10)) E('rir ' + f.rir + ' outside 0–10');
  if (f.pat === 'P') { if (!(Number.isInteger(f.cpr) && f.cpr >= 1)) E('P needs an integer cpr ≥ 1'); if (!Object.prototype.hasOwnProperty.call(LM.TIER, f.tier)) E('P needs a tier (' + f.tier + ')'); }
  else { if (f.cpr) E('cpr only for P'); if (f.tier != null) E('tier only for P'); }
  if (f.runInt != null && LM.RUN.indexOf(f.runInt) === -1) E('runInt "' + f.runInt + '" unknown');
  if (f.pat === 'R' && !(typeof f.runM === 'number' && f.runM > 0) && e.measure !== 'time') E('R needs metres per rep (runM) unless timed (minutes only)');
  if (f.pat !== 'R' && (f.runM != null || f.runInt != null)) E('runM / runInt only for R');
  if (!Array.isArray(f.tags) || f.tags.some(t => typeof t !== 'string')) E('tags must be a list of words');
  // what the app makes of it must be exactly the shipped factors (nothing replaced by derived values)
  const L = M.loadFx(e); ['pat', 'mx', 'uni', 'ecc', 'bw', 'cpr', 'tier', 'rir', 'runM', 'runInt'].forEach(k => { if (L[k] !== (f[k] === undefined ? null : f[k])) E('loadFx gives ' + k + ' = ' + L[k] + ', shipped ' + f[k]); });
  if (JSON.stringify(L.prime) !== JSON.stringify(f.prime)) E('loadFx gives prime ' + L.prime + ', shipped ' + f.prime);
  if (L.src !== 'isporuka') E('loadFx does not use the shipped factors');
  const d = M.deriveFx(e); ['pat', 'mx', 'ecc', 'prime', 'rw', 'bw', 'tier', 'rir'].forEach(k => { if (JSON.stringify(d[k]) !== JSON.stringify(f[k])) diff[k] = (diff[k] || 0) + 1; });
});
// every shipped protocol, done as written, gives a finite load ≥ 0
Object.keys(PR).forEach(id => {
  const items = (PR[id].items || []).map(it => Object.assign({}, it, { done: true }));
  const o = M.computeSession({ at: Date.now(), secs: 3000, items }, { k: 3 });
  if (!(isFinite(o.B) && o.B >= 0 && o.ex.every(v => isFinite(v) && v >= 0))) err('protocol ' + id + ': load ' + o.B);
});
// golden test: MODEL section 8 (Trening A, everything done ≥ 2 times in 8 weeks)
const G = M.computeSession({ at: Date.now(), secs: 52 * 60, items: [
  { exId: 'deadlift', measure: 'sets', sets: 4, reps: 5, kg: 100, rirList: [3, 2, 2, 1] },
  { exId: 'bugarski', measure: 'sets', sets: 3, reps: 8, kg: 15, sides: true, rirList: [2, 2, 1] },
  { exId: 'nordic-curl', measure: 'sets', sets: 2, reps: 5, rirList: [1, 1] },
  { exId: 'hip-thrust', measure: 'sets', sets: 3, reps: 10, kg: 80, rirList: [3, 2, 2] },
  { exId: 'kopenhagen-kratka', measure: 'time', sets: 3, sec: 20, sides: true, sirList: [10, 10, 5] }] }, { k: 3 });
if (Math.abs(G.Bsets - 262.9) > 0.5) err('golden test: Σ B(sets) of Trening A = ' + G.Bsets + ', expected 262.9 ± 0.5 (per exercise ' + G.ex.join(', ') + ')');
else info.push('golden test: Trening A Σ B(sets) = ' + G.Bsets + ' (expected 262.9), B ≈ ' + G.B + ' ± ' + G.band + ', per exercise ' + G.ex.join(' · '));
info.push('fields differing from deriveFx (count of exercises): ' + JSON.stringify(diff));
info.push('field sessions: their load comes from the app\'s field model (fieldLoad), checked in the browser suite (w170)');
info.forEach(m => console.log('info ' + m));
errs.forEach(m => console.log('ERROR ' + m));
console.log(errs.length ? errs.length + ' errors' : 'OK: ' + Object.keys(X).length + ' exercises, ' + Object.keys(PR).length + ' protocols');
process.exit(errs.length ? 1 : 0);
