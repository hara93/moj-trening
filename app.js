(function(){
'use strict';

/* ---------- icons ---------- */
const I = {
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4.5L7.5 12l7.5 7.5"/></svg>',
  close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  chev:'<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4.5l7.5 7.5L9 19.5"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 4v16M4 12h16"/></svg>',
  heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/></svg>',
  heartF:'<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/></svg>',
  edit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/></svg>',
  dots4:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="7" cy="7" r="2.6"/><circle cx="17" cy="7" r="2.6"/><circle cx="7" cy="17" r="2.6"/><circle cx="17" cy="17" r="2.6"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
  play:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M6 3.5v17L20 12z"/></svg>',
  prev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"><path d="M19 4.5v15L8 12z"/><path d="M5 4.5v15"/></svg>',
  next:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"><path d="M5 4.5v15L16 12z"/><path d="M19 4.5v15"/></svg>',
  list:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/></svg>',
  addbox:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M12 8v8M8 12h8"/></svg>',
  sound:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
  mute:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/></svg>',
  video:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="6" width="13" height="12" rx="2"/><path d="M15.5 10l6-3.5v11l-6-3.5"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13.5" r="7.5"/><path d="M12 10v3.5l2 1.5M10 3h4M12 3v3"/></svg>',
  target:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5"/></svg>',
  bars:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 20V14M8 20V10M13 20V6M18 20V3"/></svg>',
  check:'<svg viewBox="0 0 24 24" width="42" height="42" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  checkS:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg>',
  gear:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2.5l1.6 2.3 2.7-.6.6 2.7 2.3 1.6-1.2 2.5 1.2 2.5-2.3 1.6-.6 2.7-2.7-.6L12 21.5l-1.6-2.3-2.7.6-.6-2.7-2.3-1.6L6 13 4.8 10.5 7.1 8.9l.6-2.7 2.7.6z"/></svg>',
  tabGrid:'<svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="9" height="11.5" rx="2"/><rect x="13" y="2" width="9" height="7" rx="2"/><rect x="2" y="15.5" width="9" height="6.5" rx="2"/><rect x="13" y="11" width="9" height="11" rx="2"/></svg>',
  tabPlay:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="currentColor"/><path d="M9.5 7.2l7.5 4.8-7.5 4.8z" fill="#191D25"/></svg>',
  tabLib:'<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="5" height="18" rx="1.5"/><rect x="9.5" y="3" width="5" height="18" rx="1.5"/><path d="M16.2 4.6l3.3-.9 3 15.5-3.3.9z"/></svg>',
  filter:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4 6h16M7 12h10M10 18h4"/></svg>',
  medal:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm-4 1.6L6.5 22l5.5-2.5 5.5 2.5L16 16.6a8 8 0 0 1-8 0z"/></svg>',
  tabProg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8M15 7h6v6"/></svg>',
  info:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.6v.2"/></svg>',
  trend:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8M15 7h6v6"/></svg>',
  cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
  link:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>',
  pulse:'M3 12h4l3-7 4 14 3-7h4',
  jump:'M12 3v11M7.5 7.5L12 3l4.5 4.5M5 21h14M8 17.5h8',
  core:'M9 3h6l3 5-2 13H8L6 8zM6.5 8h11M9.5 13h5',
  bolt:'M13 2L4 14h7l-1 8 9-12h-7z',
  run:'M13.5 4.5a1.6 1.6 0 1 0 0 .01M7 21l3-6 3 2 1.5-5 4 3M9 9l3-2.5 3 1.5 2 3',
  book:'M4 5h16M4 12h16M4 19h10',
  dumb:'M3 12h18M6 8v8M18 8v8M3 10v4M21 10v4',
  leaf:'M20 12a8 8 0 1 1-2.34-5.66M20 4v4h-4',
  rope:'M5 20c0-5 3-7 7-7s7-2 7-7M5 20l2-2M19 6l-2 2M12 13a2 2 0 1 0 0-.01'
};
const pathIcon = (d, w) => '<svg viewBox="0 0 24 24" width="'+(w||24)+'" height="'+(w||24)+'" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="'+d+'"/></svg>';

/* ---------- helpers ---------- */
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid = p => (p||'x') + Date.now().toString(36) + Math.random().toString(36).slice(2,7);
const clone = o => JSON.parse(JSON.stringify(o));
const plural = (n, one, few, many) => { const m10 = n % 10, m100 = n % 100; if (m10 === 1 && m100 !== 11) return one; if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few; return many; };
const nVj = n => n + ' ' + plural(n, 'vježba', 'vježbe', 'vježbi');
const fmtKg = v => String(Math.round(v * 100) / 100).replace('.', ',') + ' kg';
const fmt = s => { s = Math.max(0, Math.ceil(s)); const m = Math.floor(s/60), r = s%60; return m + ':' + (r<10?'0':'') + r; };
const MEDIA = {};
const mediaUrl = id => MEDIA[id] || '';
const CATS = ['Rehab', 'Aktivacija', 'Mobilnost', 'Snaga', 'Eksplozivnost', 'Trup', 'Kondicija'];
const ZONES = ['Kuk','Gluteus','Gluteus medius','Aduktori','Fleksori kuka','Stražnja loža','Kvadriceps','Lisni mišić','Core','Koljeno','Gležanj','Leđa','Prsa','Ramena','Ruke','Cijelo tijelo'];
const LIBCATS = ['Sve','Favoriti','TRX','Rehab kuka','Uže i kolotur','Aktivacija','Mobilnost','Snaga','Eksplozivnost','Trup','Kondicija'];
const EQUIP = ['Šipka','Kavez','Klupa','Bučice','Girja','Landmine','TRX','Medicinka','Plyo box','Švedske ljestve','Elastično uže','Kolotur','Mini guma','Velika pilates lopta','Mala pilates lopta','Kotač','Bugarsko postolje','Strunjača','Čunjevi','Sobni bicikl','Bez opreme'];
const DAYS = ['P','U','S','Č','P','S','N'];
const DAYNAMES = ['ponedjeljak','utorak','srijeda','četvrtak','petak','subota','nedjelja'];
const daysText = ds => (ds||[]).slice().sort().map(i => DAYNAMES[i].slice(0,3)).join(', ');
const catIcon = c => ({Rehab:I.pulse, Aktivacija:I.bolt, Mobilnost:I.leaf, Snaga:I.dumb, Eksplozivnost:I.jump, Trup:I.core, Kondicija:I.run}[c] || I.pulse);
// diacritic-insensitive text for search: "cucanj" finds "čučanj"
const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
// equipment tags: explicit on newer exercises, otherwise read from the free-text "Oprema" field
const EQ_WORDS = [[/trx/,'TRX'],[/sipk|olimpijsk/,'Šipka'],[/kavez|rack/,'Kavez'],[/klup/,'Klupa'],[/bucic/,'Bučice'],[/girj|kettlebell/,'Girja'],[/landmine/,'Landmine'],[/medicin/,'Medicinka'],[/plyo|kutij|stepenic/,'Plyo box'],[/ljestv/,'Švedske ljestve'],[/kolotur/,'Kolotur'],[/mini (traka|guma)|kratk[ae] gum/,'Mini guma'],[/uze|traka|guma/,'Elastično uže'],[/velika pilates|velik[ai] lopt/,'Velika pilates lopta'],[/mala pilates|mal[ai] lopt/,'Mala pilates lopta'],[/kotac|roller|roler/,'Kotač'],[/bugarsk|postolj/,'Bugarsko postolje'],[/podlog|strunjac|tatami/,'Strunjača'],[/cunj/,'Čunjevi'],[/bicikl/,'Sobni bicikl'],[/bez opreme/,'Bez opreme']];
function exEquip(e){
  if (!e) return [];
  if (Array.isArray(e.equip) && e.equip.length) return e.equip;
  const t = norm(e.equipment); const out = [];
  EQ_WORDS.forEach(([re, tag]) => { if (re.test(t) && out.indexOf(tag) === -1) out.push(tag); });
  if (out.indexOf('Mini guma') !== -1) { const i = out.indexOf('Elastično uže'); if (i !== -1 && !/uze/.test(t)) out.splice(i, 1); }
  return out.length ? out : ['Bez opreme'];
}
// stable fingerprint of shipped items (hash.js, shared with tools/seed-history.cjs)
const contentHash = window.mtContentHash;
const HASH_SKIP = window.mtHashSkip;

function lsGet(k, d){ try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch(e){ return d; } }
function lsSet(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} }

/* ---------- state ---------- */
const S = {
  dbState: 'loading', loaded: {},
  ex: {}, pr: {}, field: {}, prog: {}, log: [],
  tab: 'home', stack: [{v:'home'}],
  lib: { cat: lsGet('mt.libcat', 'Sve'), q: '', eq: lsGet('mt.libeq', []) },
  pack: lsGet('mt.pack', null),
  draft: null, pick: null, sheet: null, toast: null,
  settings: Object.assign({ sound: true, switchSec: 5, transSec: 10 }, lsGet('mt.settings', {})),
  canWrite: true
};
const top = () => S.stack[S.stack.length - 1];

/* ---------- durations ---------- */
// estimated from the same step list the player runs, so supersets and circuits are timed the way they are trained
function protoMin(p){
  const s = stepsFromItems(p.items || []).reduce((a, st) => a + (st.dur || (st.kind === 'manual' ? (st.it.reps || 10) * 3 * (st.it.sides ? 2 : 1) + (st.it.sides ? 5 : 0) : 0)), 0);
  return Math.max(1, Math.round(s / 60));
}
function fieldMin(f){
  if (f.total_min) return String(f.total_min).replace('.', ',');
  let s = 0; (f.blocks||[]).forEach(b => { const sets = b.sets||1, reps = b.reps||1; s += sets*reps*(b.work_s||0) + sets*(reps-1)*(b.rest_s||0) + (sets-1)*(b.set_rest_s||b.rest_s||0) + (b.rest_s||0); });
  return Math.max(1, Math.round(s/60));
}
function repsOf(it, set){ return (it.repsList && it.repsList[set - 1]) || it.reps || 10; }
function dose(it){
  if (it.measure !== 'time' && Array.isArray(it.repsList) && it.repsList.some(r => r !== it.repsList[0])) return it.repsList.length + ' × ' + it.repsList.join('/') + (it.sides ? ' po strani' : '') + (it.kg ? ' · ' + fmtKg(it.kg) : '') + (it.note ? ' · ' + it.note : '');
  return doseBase(it) + (it.note ? ' · ' + it.note : '');
}
function doseBase(it){
  if (it.measure === 'time') return ((it.sets||1) > 1 ? it.sets + ' × ' : '') + (it.sec||30) + ' s' + (it.sides ? ' po strani' : '');
  return (it.sets||1) + ' × ' + (it.reps||10) + (it.sides ? ' po strani' : '') + (it.kg ? ' · ' + fmtKg(it.kg) : '');
}
function exItem(e){ const m = e.measure||'sets'; return { exId: e.id, measure: m, sec: e.sec||30, sets: e.sets || (m === 'time' ? 1 : 3), reps: e.reps||10, rest: e.rest != null ? e.rest : (m === 'time' ? 15 : 45), sides: !!e.sides, kg: e.kg||0 }; }
function exBadge(e){ if (e.phase) return 'Faza ' + e.phase; if (e.cord) return 'Uže ' + e.cord; return ''; }
function exMeta(e){ return (e.zones && e.zones.length ? e.zones.slice(0,2).join(' • ') : e.cat) ; }
// what an exercise shows: your own video or photo, then the private photo pack, then openly licensed media shipped with the app
function exMedia(e){
  if (!e) return null;
  if (e.media && MEDIA[e.media]) return { type: e.mediaType === 'image' ? 'image' : 'video', src: MEDIA[e.media], own: true };
  if (MEDIA['pack:' + e.id]) return { type: 'image', src: MEDIA['pack:' + e.id], credit: (S.pack && S.pack.credit) || 'Privatni paket slika' };
  const m = (window.EXMEDIA || {})[e.id];
  if (m) return { type: m.video ? 'video' : 'image', src: m.video || m.img, poster: m.img, credit: m.credit, url: m.url };
  return null;
}
function thumbHtml(e){
  const m = exMedia(e);
  if (m) return m.type === 'image' || m.poster ? '<img alt="" loading="lazy" src="'+esc(m.type === 'image' ? m.src : m.poster)+'">' : '<video muted playsinline preload="metadata" src="'+esc(m.src)+'#t=0.5"></video>';
  return pathIcon(catIcon(e && e.cat), 28);
}
function packVideo(e){ return e && (S.pack && S.pack.videos || {})[e.id] || ''; }
function exAlt(e){ return e && e.alt && norm(e.alt) !== norm(e.name) ? e.alt : ''; }

/* ---------- on-device storage ---------- */
const APP_VERSION = '1.4.1';
const STORE_KEY = 'mt.data.v1';
function persist(){
  try { localStorage.setItem(STORE_KEY, JSON.stringify({ v:1, exercises:S.ex, protocols:S.pr, field:S.field, programs:S.prog, log:S.log, _deleted:S._deleted||[] })); return true; }
  catch(e){ toast('Spremanje na mobitel nije uspjelo. Oslobodi malo prostora.'); return false; }
}
function applyData(d){
  for (const k in S.ex) delete S.ex[k]; for (const k in S.pr) delete S.pr[k]; for (const k in S.field) delete S.field[k];
  Object.keys(d.exercises||{}).forEach(id => S.ex[id] = Object.assign({}, d.exercises[id], { id }));
  Object.keys(d.protocols||{}).forEach(id => S.pr[id] = Object.assign({}, d.protocols[id], { id }));
  Object.keys(d.field||{}).forEach(id => S.field[id] = Object.assign({}, d.field[id], { id }));
  for (const k in S.prog) delete S.prog[k]; Object.keys(d.programs||{}).forEach(id => S.prog[id] = Object.assign({}, d.programs[id], { id }));
  S.log = Array.isArray(d.log) ? d.log : [];
}
const IDB = {
  _db: null,
  open(){ if (this._db) return Promise.resolve(this._db); return new Promise((res, rej) => { const r = indexedDB.open('mt-media', 1); r.onupgradeneeded = () => r.result.createObjectStore('blobs'); r.onsuccess = () => { this._db = r.result; res(r.result); }; r.onerror = () => rej(r.error); }); },
  async tx(mode, fn){ const d = await this.open(); return new Promise((res, rej) => { const t = d.transaction('blobs', mode); const st = t.objectStore('blobs'); const out = fn(st); t.oncomplete = () => res(out && out.result); t.onerror = () => rej(t.error); }); },
  put(id, blob){ return this.tx('readwrite', st => st.put(blob, id)); },
  get(id){ return this.tx('readonly', st => st.get(id)); },
  del(id){ return this.tx('readwrite', st => st.delete(id)); }
};
async function loadMedia(){
  const ids = Object.values(S.ex).map(e => e.media).filter(Boolean).concat(((S.pack && S.pack.ids) || []).map(id => 'pack:' + id));
  for (const id of ids) { if (MEDIA[id]) continue; try { const rec = await IDB.get(id); if (rec) MEDIA[id] = URL.createObjectURL(rec instanceof Blob ? rec : new Blob([rec.buf], { type: rec.type })); } catch(e){} }
  softRender();
}
// the private photo pack (e.g. photos from programmes you bought) lives only on this phone, never in the public app
async function importPack(file){
  const d = JSON.parse(await file.text());
  if (!d || d.kind !== 'moj-trening-media-pack' || !Array.isArray(d.items)) throw new Error('bad pack');
  const ids = [];
  for (const it of d.items) {
    if (!it || !it.ex || !it.data) continue;
    const bin = atob(it.data); const buf = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
    const type = it.type || 'image/jpeg';
    await IDB.put('pack:' + it.ex, { type, buf: buf.buffer });
    if (MEDIA['pack:' + it.ex]) URL.revokeObjectURL(MEDIA['pack:' + it.ex]);
    MEDIA['pack:' + it.ex] = URL.createObjectURL(new Blob([buf], { type }));
    ids.push(it.ex);
  }
  // exercises, sessions and programmes in the pack join your data; ones already on the phone stay as they are
  const packId = d.id || 'pack'; let exN = 0, prN = 0;
  Object.keys(d.exercises || {}).forEach(id => { if (!S.ex[id]) { S.ex[id] = Object.assign({}, d.exercises[id], { id, pack: packId }); exN++; } });
  Object.keys(d.protocols || {}).forEach(id => { if (!S.pr[id]) { S.pr[id] = Object.assign({}, d.protocols[id], { id, pack: packId }); prN++; } });
  Object.keys(d.programs || {}).forEach(id => { S.prog[id] = Object.assign({}, d.programs[id], { id, pack: packId }); });
  if (exN || prN || d.programs) persist();
  const old = (S.pack && S.pack.ids) || [];
  S.pack = { id: packId, title: d.title || 'Paket slika', credit: d.credit || 'Privatni paket slika', at: Date.now(), ids: old.concat(ids.filter(id => old.indexOf(id) === -1)),
    videos: Object.assign({}, (S.pack && S.pack.videos) || {}, d.videos || {}),
    members: Array.from(new Set(((S.pack && S.pack.members) || []).concat(d.members || []))) };
  lsSet('mt.pack', S.pack);
  return { photos: ids.length, exercises: exN, sessions: prN, programs: Object.keys(d.programs || {}).length };
}
async function removePack(){
  for (const id of (S.pack && S.pack.ids) || []) { try { await IDB.del('pack:' + id); } catch(e){} if (MEDIA['pack:' + id]) { URL.revokeObjectURL(MEDIA['pack:' + id]); delete MEDIA['pack:' + id]; } }
  const pid = S.pack && S.pack.id;
  if (pid) {
    Object.keys(S.prog).forEach(id => { if (S.prog[id].pack === pid) delete S.prog[id]; });
    Object.keys(S.pr).forEach(id => { if (S.pr[id].pack === pid) delete S.pr[id]; });
    const used = {}; Object.values(S.pr).forEach(p => (p.items || []).forEach(it => used[it.exId] = 1));
    Object.keys(S.ex).forEach(id => { if (S.ex[id].pack === pid && !used[id]) delete S.ex[id]; });
    persist();
  }
  S.pack = null; try { localStorage.removeItem('mt.pack'); } catch(e){}
}
function mergeSeed(seed){
  // New items are added; items you never changed follow the app's improvements; your edits and deletions always win.
  const hist = window.SEED_HISTORY || {};
  let changed = false;
  ['exercises','protocols','field'].forEach(c => Object.keys(seed[c]||{}).forEach(id => {
    const map = c === 'exercises' ? S.ex : c === 'protocols' ? S.pr : S.field;
    if (S._deleted.indexOf(c + '/' + id) !== -1) return;
    const fresh = seed[c][id], local = map[id];
    if (!local) { map[id] = Object.assign({}, fresh, { id }); changed = true; return; }
    const h = contentHash(local);
    if (h === contentHash(fresh)) return;
    if ((hist[c] && hist[c][id] || []).indexOf(h) === -1) return; // you changed it, keep yours
    const keep = {}; Object.keys(HASH_SKIP).forEach(k => { if (k !== 'id' && local[k] !== undefined) keep[k] = local[k]; });
    map[id] = Object.assign({}, fresh, keep, { id }); changed = true;
  }));
  // new names for shipped items: applied even if you changed the item, never if you gave it your own name
  const renamed = window.SEED_RENAMED || {};
  ['exercises','protocols','field'].forEach(c => Object.keys(renamed[c] || {}).forEach(id => {
    const map = c === 'exercises' ? S.ex : c === 'protocols' ? S.pr : S.field, local = map[id], fresh = (seed[c] || {})[id];
    if (!local || !fresh) return;
    Object.keys(renamed[c][id]).forEach(k => { if ((renamed[c][id][k] || []).indexOf(local[k]) !== -1 && fresh[k] !== undefined && local[k] !== fresh[k]) { local[k] = fresh[k]; changed = true; } });
    // finished sessions keep the name they had: rename those that carry an old shipped name
    if (c === 'protocols' && renamed[c][id].name && local.name === fresh.name) S.log.forEach(l => { if (l.refId === id && renamed[c][id].name.indexOf(l.name) !== -1) { l.name = fresh.name; changed = true; } });
  }));
  const retired = window.SEED_RETIRED || {};
  ['exercises','protocols','field'].forEach(c => (retired[c] || []).forEach(id => {
    const map = c === 'exercises' ? S.ex : c === 'protocols' ? S.pr : S.field;
    const local = map[id]; if (!local) return;
    if ((hist[c] && hist[c][id] || []).indexOf(contentHash(local)) === -1) return;
    if (c === 'exercises' && Object.values(S.pr).some(p => (p.items || []).some(it => it.exId === id))) return;
    delete map[id]; changed = true;
  }));
  return changed;
}
async function init(){
  let d = null;
  try { const raw = localStorage.getItem(STORE_KEY); if (raw) d = JSON.parse(raw); } catch(e){ d = null; }
  const seed = window.SEED || {};
  if (!d) { d = JSON.parse(JSON.stringify(seed)); applyData(d); S._deleted = []; persist(); }
  else {
    applyData(d); S._deleted = d._deleted || [];
    if (mergeSeed(seed)) persist();
  }
  S.dbState = 'ready';
  render();
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch(e){}
  loadMedia();
}
async function save(coll, id, data){
  const map = coll === 'exercises' ? S.ex : coll === 'protocols' ? S.pr : S.field;
  map[id] = Object.assign({}, data, { id });
  return persist();
}
async function remove(coll, id){
  const map = coll === 'exercises' ? S.ex : coll === 'protocols' ? S.pr : S.field;
  delete map[id]; S._deleted = (S._deleted||[]).concat([coll + '/' + id]);
  return persist();
}
/* ---------- render core ---------- */
const app = document.getElementById('app');
const scrollMem = {};
const FORM_VIEWS = { exEdit:1, build:1, play:1 };
let renderQueued = false;
function softRender(){
  if (FORM_VIEWS[top().v]) return; // never clobber an open form or the running player
  if (renderQueued) return; renderQueued = true;
  requestAnimationFrame(() => { renderQueued = false; render(); });
}
function viewKey(){ const t = top(); return t.v + ':' + (t.id || ''); }
function render(){
  const key = viewKey();
  const old = app.querySelector('.view');
  if (old && app.dataset.key) scrollMem[app.dataset.key] = old.scrollTop;
  const t = top();
  const fn = VIEWS[t.v] || VIEWS.home;
  let html = fn(t);
  const rootView = (t.v === 'home' || t.v === 'protocols' || t.v === 'library' || t.v === 'progress') && !S.pick;
  if (rootView) html += tabbar();
  if (S.sheet) html += sheetHtml();
  if (S.toast) html += '<div class="toast" role="status">' + esc(S.toast) + '</div>';
  app.innerHTML = html;
  app.dataset.key = key;
  const v = app.querySelector('.view');
  if (v && scrollMem[key] != null) v.scrollTop = scrollMem[key];
  after(t);
}
function go(entry){ S.stack.push(entry); S.sheet = null; render(); }
function back(){ if (S.stack.length > 1) S.stack.pop(); S.sheet = null; render(); }
function setTab(tab){ S.tab = tab; S.pick = null; S.stack = [{v: tab}]; S.sheet = null; render(); }
let toastTimer = null;
function toast(msg){ S.toast = msg; clearTimeout(toastTimer); toastTimer = setTimeout(() => { S.toast = null; const el = app.querySelector('.toast'); if (el) el.remove(); }, 2600);
  const el = app.querySelector('.toast'); if (el) el.textContent = msg; else app.insertAdjacentHTML('beforeend', '<div class="toast" role="status">' + esc(msg) + '</div>'); }

function tabbar(){
  const t = S.tab;
  return '<nav class="tabbar gut" aria-label="Glavna navigacija">' +
    '<button class="tab" data-a="tab" data-tab="protocols" aria-label="Moji protokoli"' + (t==='protocols'?' aria-current="page"':'') + '>' + I.tabGrid + '</button>' +
    '<button class="tab" data-a="tab" data-tab="home" aria-label="Početna"' + (t==='home'?' aria-current="page"':'') + '>' + I.tabPlay + '</button>' +
    '<button class="tab" data-a="tab" data-tab="library" aria-label="Knjižnica vježbi"' + (t==='library'?' aria-current="page"':'') + '>' + I.tabLib + '</button>' +
    '<button class="tab" data-a="tab" data-tab="progress" aria-label="Napredak"' + (t==='progress'?' aria-current="page"':'') + '>' + I.tabProg + '</button>' +
  '</nav>';
}
function topbar(left, right, center){
  return '<div class="topbar"><div class="l">' + (left||'') + '</div><div class="wordmark">' + (center || 'MOJ TRENING') + '</div><div class="r">' + (right||'') + '</div></div>';
}
const backBtn = (label) => '<button class="ib" data-a="back" aria-label="' + esc(label||'Natrag') + '">' + I.back + '</button>';
function stateNote(){
  if (S.dbState === 'loading') return '<div class="empty">Učitavam tvoje vježbe…</div>';
  return '';
}

/* ---------- weekly plan & progress ---------- */
const DAY_MS = 864e5, WEEK_MS = 7 * DAY_MS;
const dayIdx = t => (new Date(t).getDay() + 6) % 7; // 0 = Monday
function weekStart(t){ const d = new Date(t); d.setHours(0,0,0,0); d.setDate(d.getDate() - dayIdx(d)); return d.getTime(); }
function planSlots(){
  const out = [];
  Object.values(S.pr).forEach(p => (p.days||[]).forEach(day => out.push({ day, kind:'protocol', id:p.id, name:p.name, min: protoMin(p) })));
  Object.values(S.field).forEach(f => (f.days||[]).forEach(day => out.push({ day, kind:'field', id:f.id, name:f.name_hr, min: fieldMin(f) })));
  return out.sort((a,b) => a.day - b.day || a.name.localeCompare(b.name, 'hr'));
}
// a planned session counts as done when you trained it on any day of that week; each log entry fills one slot
function weekStatus(ws, plan){
  const log = S.log.filter(l => l.at >= ws && l.at < ws + WEEK_MS);
  const used = {};
  const slots = (plan || planSlots()).map(p => {
    let k = log.findIndex((l, i) => !used[i] && l.refId === p.id && l.kind === p.kind && dayIdx(l.at) === p.day);
    if (k === -1) k = log.findIndex((l, i) => !used[i] && l.refId === p.id && l.kind === p.kind);
    if (k !== -1) used[k] = 1;
    return Object.assign({ done: k !== -1 }, p);
  });
  return { slots, log, planned: slots.length, done: slots.filter(s => s.done).length };
}
function streakWeeks(plan){
  plan = plan || planSlots();
  if (!plan.length || !S.log.length) return 0;
  const now = weekStart(Date.now()), first = weekStart(S.log[S.log.length - 1].at); let n = 0;
  for (let ws = now - WEEK_MS; ws >= first; ws -= WEEK_MS) { const s = weekStatus(ws, plan); if (s.done >= s.planned) n++; else break; }
  const cur = weekStatus(now, plan);
  return n + (cur.done >= cur.planned ? 1 : 0);
}
function weekHtml(){
  if (S.dbState !== 'ready') return '';
  const now = Date.now(), ws = weekStart(now), today = dayIdx(now);
  const plan = planSlots();
  const st = weekStatus(ws, plan);
  const trainedDays = {}; st.log.forEach(l => trainedDays[dayIdx(l.at)] = 1);
  const strip = '<div class="week" role="group" aria-label="Ovaj tjedan">' + DAYS.map((L, i) => {
    const d = new Date(ws + i * DAY_MS + 12 * 3600e3);
    const plan = st.slots.filter(s => s.day === i);
    const missed = i < today && plan.some(s => !s.done);
    const cls = trainedDays[i] ? 'done' : missed ? 'miss' : plan.length ? 'plan' : '';
    const label = DAYNAMES[i] + ' ' + d.getDate() + '.' + (trainedDays[i] ? ', odrađeno' : missed ? ', propušteno' : plan.length ? ', planirano' : '');
    return '<button class="wd" data-a="daySheet" data-i="'+i+'"' + (i === today ? ' aria-current="date"' : '') + ' aria-label="'+esc(label)+'"><span class="l">'+L+'</span><span class="c '+cls+'">'+d.getDate()+'</span></button>';
  }).join('') + '</div>';
  const todo = st.slots.filter(s => s.day === today && !s.done);
  const missed = st.slots.filter(s => s.day < today && !s.done);
  const row = (s, pre) => '<button class="row today" data-a="'+(s.kind === 'field' ? 'openField' : 'openPr')+'" data-id="'+esc(s.id)+'"><span class="thumb" style="width:52px;height:52px">'+pathIcon(s.kind === 'field' ? I.run : I.dumb, 24)+'</span><span class="tx"><span class="t">'+esc(pre + s.name)+'</span><span class="m"><span>'+s.min+' min</span></span></span>'+I.chev+'</button>';
  let rows = '';
  if (todo.length) rows = todo.map(s => row(s, 'Danas: ')).join('');
  else if (missed.length) rows = row(missed[0], 'Nadoknadi: ');
  const sk = streakWeeks(plan);
  const line = st.planned
    ? 'Ovaj tjedan ' + st.done + '/' + st.planned + (sk ? ' • niz: ' + sk + ' ' + plural(sk, 'tjedan', 'tjedna', 'tjedana') + ' po planu' : '') + (!todo.length && st.slots.some(s => s.day === today) ? ' • danas odrađeno' : '')
    : 'Odaberi dane u protokolu i složi svoj tjedni plan';
  return strip + '<p class="sub wline">' + esc(line) + '</p>' + (rows ? '<div class="list" style="margin:12px 16px 0">' + rows + '</div>' : '');
}

/* ---------- views ---------- */
const VIEWS = {};

VIEWS.home = function(){
  const rehab = Object.values(S.pr).find(p => p.home === 'rehab');
  const akt = Object.values(S.pr).find(p => p.home === 'aktivacija');
  const cards = [
    { t:'Rehab kuka', s: rehab ? 'Moj protokol · ' + protoMin(rehab) + ' min' : 'Moje vježbe za kuk', bg:'#5B5148', ic:I.pulse, a: rehab ? {a:'openPr', id: rehab.id} : {a:'libCat', cat:'Rehab kuka'} },
    { t:'Aktivacija', s:'Uže i kolotur · prije treninga', bg:'#3A3F47', ic:I.rope, a: akt ? {a:'openPr', id: akt.id} : {a:'libCat', cat:'Uže i kolotur'} },
    { t:'Kondicija', s:'Na terenu · STATSports', bg:'#33404A', ic:I.run, a:{a:'fieldList'} },
    { t:'Knjižnica', s: Object.keys(S.ex).length ? nVj(Object.keys(S.ex).length) : 'Moje vježbe', bg:'#2B2F37', ic:I.book, a:{a:'tab', tab:'library'} }
  ];
  const attrs = o => Object.keys(o).map(k => (k==='a' ? 'data-a' : 'data-'+k) + '="' + esc(o[k]) + '"').join(' ');
  return '<div class="view" style="background:radial-gradient(circle at 100% 0%, #24314A 0%, #1C2230 28%, #191D25 52%)">' +
    topbar('', '<button class="ib" data-a="dataSheet" aria-label="Podaci i sigurnosna kopija">' + I.gear + '</button>', 'MOJ TRENING') +
    '<h1 class="greet">Bok, Tomislav</h1>' +
    weekHtml() +
    '<div class="carousel" id="car" aria-label="Kategorije treninga">' +
      cards.map(c => '<button class="hcard" style="background:' + c.bg + '" ' + attrs(c.a) + '><span class="ic">' + pathIcon(c.ic, 96) + '</span><span class="sc"></span><span class="tt"><b>' + esc(c.t) + '</b><span>' + esc(c.s) + '</span></span></button>').join('') +
    '</div>' +
    '<div class="dots" id="dots" role="group" aria-label="Odaberi karticu">' + cards.map((c,i) => '<button class="dot" data-a="dot" data-i="'+i+'" aria-label="'+esc(c.t)+'"'+(i===0?' aria-current="true"':'')+'><i></i></button>').join('') + '</div>' +
    (S.log[0] ? '<p class="sub" style="text-align:center;margin:8px 0 0">Zadnji trening: ' + esc(S.log[0].name) + ' · ' + esc(new Date(S.log[0].at).toLocaleDateString('hr-HR', {day:'numeric', month:'numeric'})) + '</p>' : '') +
  '</div>';
};

VIEWS.protocols = function(){
  const list = Object.values(S.pr).filter(p => !p.program).sort((a,b) => (b.updatedAt||0) - (a.updatedAt||0));
  const progs = Object.values(S.prog);
  const fieldN = Object.keys(S.field).length;
  return '<div class="view gut">' + topbar('', '') +
    '<h1 class="h1">Moji protokoli</h1>' +
    (stateNote() || (
      '<div class="list" style="margin-top:24px">' +
      (list.length ? list.map(p => {
        const first = p.items && p.items[0] && S.ex[p.items[0].exId];
        return '<button class="row" data-a="openPr" data-id="'+esc(p.id)+'"><span class="thumb">' + (exMedia(first) ? thumbHtml(first) : pathIcon(p.home === 'aktivacija' ? I.rope : p.home === 'rehab' ? I.pulse : I.dumb, 28)) + '</span><span class="tx"><span class="t">' + esc(p.name) + '</span><span class="m"><span>' + nVj((p.items||[]).length) + ' • ' + protoMin(p) + ' min</span>' + (p.goal && GOALS[p.goal] ? '<span class="tag">'+esc(GOALS[p.goal].name)+'</span>' : '') + ((p.days||[]).length ? '<span class="tag">'+esc(daysText(p.days))+'</span>' : !p.goal && p.tag ? '<span class="tag">'+esc(p.tag)+'</span>' : '') + '</span></span>' + I.chev + '</button>';
      }).join('') : '<div class="empty">Još nemaš protokol. Složi prvi od svojih vježbi.</div>') +
      '</div>' +
      (progs.length ? '<h2 class="h2">Programi</h2><div class="list" style="margin-top:14px">' + progs.map(g => { const st = progStatus(g); const ex0 = progCover(g);
        return '<button class="row" data-a="openProg" data-id="'+esc(g.id)+'"><span class="thumb">'+(ex0 ? thumbHtml(ex0) : pathIcon(I.dumb, 28))+'</span><span class="tx"><span class="t">'+esc(g.name)+'</span><span class="m"><span>'+st.done+'/'+st.total+' treninga</span><span class="tag">'+esc(st.next ? 'Sljedeće: ' + st.next.short : 'Završeno')+'</span></span></span>'+I.chev+'</button>'; }).join('') + '</div>' : '') +
      '<h2 class="h2">Kondicija na terenu</h2>' +
      '<div class="list" style="margin-top:14px"><button class="row" data-a="fieldList"><span class="thumb" style="background:#33404A">' + pathIcon(I.run, 28) + '</span><span class="tx"><span class="t">Treninzi s terena</span><span class="m"><span>' + (fieldN ? fieldN + ' ' + plural(fieldN,'trening','treninga','treninga') : 'Učitavanje') + '</span><span class="tag">STATSports</span></span></span>' + I.chev + '</button></div>'
    )) +
    '<div style="height:16px"></div></div>' +
    '<div class="footer gut"><button class="btn" data-a="newPr">' + I.plus.replace('<svg', '<svg width="18" height="18"') + 'Novi protokol</button></div>';
};

function libFiltered(){
  const words = norm(S.lib.q).split(/\s+/).filter(Boolean), c = S.lib.cat, eq = S.lib.eq || [];
  return Object.values(S.ex).filter(e => {
    if (words.length) { const hay = norm([e.name, e.alt, e.equipment, (e.zones||[]).join(' '), e.cat].join(' ')); if (!words.every(w => hay.indexOf(w) !== -1)) return false; }
    if (eq.length) { const mine = exEquip(e); if (!eq.some(x => mine.indexOf(x) !== -1)) return false; }
    if (c === 'Sve') return true;
    if (c === 'Favoriti') return !!e.fav;
    if (c === 'TRX') return exEquip(e).indexOf('TRX') !== -1;
    if (c === 'TAE') return !!(e.pack || (S.pack && (S.pack.members || []).indexOf(e.id) !== -1));
    if (c === 'Rehab kuka') return e.cat === 'Rehab' || !!e.phase;
    if (c === 'Uže i kolotur') return !!e.cord;
    return e.cat === c;
  }).sort((a,b) => (a.order||999) - (b.order||999) || a.name.localeCompare(b.name, 'hr'));
}
function libListHtml(){
  if (S.dbState !== 'ready') return stateNote();
  const rows = libFiltered();
  if (!rows.length) return '<div class="empty">Nema takve vježbe.<button class="txtbtn" data-a="newEx">Dodaj novu vježbu</button></div>';
  return rows.map(e => {
    const b = exBadge(e);
    if (S.pick) {
      const on = S.pick.ids.indexOf(e.id) !== -1;
      return '<button class="row" data-a="pickToggle" data-id="'+esc(e.id)+'" aria-pressed="'+on+'"><span class="thumb">'+thumbHtml(e)+'</span><span class="tx"><span class="t">'+esc(e.name)+'</span><span class="m"><span>'+esc(exMeta(e))+'</span>'+(b?'<span class="tag">'+esc(b)+'</span>':'')+'</span></span><span class="circ" style="'+(on?'background:var(--accent);border-color:var(--accent)':'')+'">'+(on?I.checkS:I.plus)+'</span></button>';
    }
    return '<button class="row" data-a="openEx" data-id="'+esc(e.id)+'"><span class="thumb">'+thumbHtml(e)+'</span><span class="tx"><span class="t">'+esc(e.name)+'</span><span class="m"><span>'+esc(exMeta(e))+'</span>'+(b?'<span class="tag">'+esc(b)+'</span>':'')+'</span></span>'+I.chev+'</button>';
  }).join('');
}
VIEWS.library = function(){
  const favN = Object.values(S.ex).filter(e => e.fav).length;
  const prN = Object.keys(S.pr).length;
  const picking = !!S.pick;
  const head = picking
    ? topbar('<button class="txtbtn" data-a="pickCancel">Odustani</button>', '', 'DODAJ VJEŽBE')
    : topbar('', '<button class="ib" data-a="newEx" aria-label="Nova vježba">' + I.plus + '</button>');
  return '<div class="view gut">' + head +
    '<h1 class="h1">' + (picking ? 'Odaberi vježbe' : 'Knjižnica') + '</h1>' +
    (picking ? '' :
    '<div class="tiles">' +
      '<button class="tile" data-a="libCat" data-cat="Favoriti" aria-pressed="'+(S.lib.cat==='Favoriti')+'"><span class="circ">'+I.heart+'</span><span class="lbl"><b>Favoriti</b><span>'+nVj(favN)+'</span></span></button>' +
      '<button class="tile" data-a="tab" data-tab="protocols"><span class="circ">'+I.dots4+'</span><span class="lbl"><b>Moji protokoli</b><span>'+prN+' '+plural(prN,'protokol','protokola','protokola')+'</span></span></button>' +
    '</div>' +
    '<h2 class="h2">Popis vježbi</h2>') +
    '<div class="search">' + I.search + '<input id="libq" class="input" type="search" placeholder="Traži vježbu" aria-label="Traži vježbu" autocomplete="off" value="'+esc(S.lib.q)+'">' +
      '<button class="ib fbtn" data-a="eqSheet" aria-label="Filtriraj po opremi'+((S.lib.eq||[]).length ? ', odabrano ' + S.lib.eq.length : '')+'"'+((S.lib.eq||[]).length ? ' aria-pressed="true"' : '')+'>' + I.filter + ((S.lib.eq||[]).length ? '<span class="cnt">'+S.lib.eq.length+'</span>' : '') + '</button></div>' +
    '<div class="chips" role="group" aria-label="Kategorija" style="margin-top:12px">' + (S.pack && (S.pack.members || []).length ? LIBCATS.slice(0, 3).concat(['TAE'], LIBCATS.slice(3)) : LIBCATS).map(c => '<button class="chip" data-a="libCat" data-cat="'+esc(c)+'" aria-pressed="'+(S.lib.cat===c)+'">'+esc(c)+'</button>').join('') + '</div>' +
    '<div class="list" id="liblist" style="margin-top:14px">' + libListHtml() + '</div>' +
    '<div style="height:20px"></div></div>' +
    (picking ? '<div class="footer gut"><button class="btn" data-a="pickDone"'+(S.pick.ids.length?'':' disabled')+'>Dodaj u protokol ('+S.pick.ids.length+')</button></div>' : '');
};

function mediaHtml(e, badge){
  const m = exMedia(e); let inner, credit = '';
  if (m) {
    inner = m.type === 'image' ? '<img class="fit" alt="" src="'+esc(m.src)+'">' : '<video src="'+esc(m.src)+'"'+(m.poster ? ' poster="'+esc(m.poster)+'"' : '')+' autoplay muted loop playsinline></video>';
    if (m.credit) credit = m.url ? '<a class="credit" href="'+esc(m.url)+'" target="_blank" rel="noopener">'+esc(m.credit)+'</a>' : '<span class="credit">'+esc(m.credit)+'</span>';
  } else inner = '<div class="ph">' + pathIcon(catIcon(e && e.cat), 44) + '<span>Dodaj svoj video ili sliku u uređivanju</span></div>';
  return '<div class="media">' + inner + credit + (badge ? '<span class="badge">'+esc(badge)+'</span>' : '') + '</div>';
}
function historyOf(exId){
  const out = [];
  S.log.forEach(l => (l.items||[]).forEach(it => { if (it.exId === exId) out.push(Object.assign({ at: l.at }, it)); }));
  return out; // newest first, like the log
}
function sparkSvg(vals){
  if (vals.length < 2) return '';
  const w = 300, h = 64, lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals), span = hi - lo || 1;
  const pts = vals.map((v, i) => [ (i / (vals.length - 1)) * (w - 12) + 6, h - 8 - ((v - lo) / span) * (h - 20) ]);
  return '<svg class="spark" viewBox="0 0 '+w+' '+h+'" role="img" aria-label="Napredak kroz zadnje treninge"><polyline points="'+pts.map(p => p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ')+'" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>' + pts.map((p, i) => '<circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="'+(i === pts.length - 1 ? 4 : 2.5)+'" fill="'+(i === pts.length - 1 ? 'var(--accent)' : 'var(--text-2)')+'"/>').join('') + '</svg>';
}
function progressCard(e){
  const h = historyOf(e.id);
  if (!h.length) return '<section class="icard" aria-label="Napredak"><span class="lb">Napredak</span><p style="color:var(--text-2)">Kad odradiš ovu vježbu u protokolu, ovdje se vidi kako rastu kilogrami, ponavljanja ili vrijeme.</p></section>';
  const last = h.slice(0, 8).reverse();
  const useKg = last.some(x => x.kg > 0);
  const vals = last.map(x => x.measure === 'time' ? (x.sec || 0) : useKg ? (x.kg || 0) : (x.reps || 0) * (x.sets || 1));
  const unit = last[0].measure === 'time' ? 'trajanje (s)' : useKg ? 'težina (kg)' : 'ukupno ponavljanja';
  return '<section class="icard" aria-label="Napredak"><span class="lb">Napredak · ' + unit + '</span>' + sparkSvg(vals) +
    h.slice(0, 4).map(x => '<div class="hrow"><span>' + esc(new Date(x.at).toLocaleDateString('hr-HR', { day:'numeric', month:'numeric' })) + '</span><b>' + esc(dose(x)) + '</b>' + (x.done === false ? '<span class="tag">nije uspio' + (x.lastReps != null ? ' · ' + x.lastReps : '') + '</span>' : '') + '</div>').join('') + '</section>';
}
function doseOptions(e){
  if (e.measure === 'time') { const b = e.sec||30; return [b, b+15, b+30].map(s => ({ label: s + ' s', it: Object.assign(exItem(e), {sec:s}) })); }
  const s = e.sets||3; return [s, s+1, s+2].map(n => ({ label: n + ' × ' + (e.reps||10), it: Object.assign(exItem(e), {sets:n}) }));
}
VIEWS.ex = function(t){
  const e = S.ex[t.id];
  if (!e) return '<div class="view gut">' + topbar(backBtn()) + '<div class="empty">Ova vježba više ne postoji.</div></div>';
  const opts = doseOptions(e); const sel = t.dose || 0;
  return '<div class="view">' +
    '<div class="gut">' + topbar(backBtn(), '<button class="ib" data-a="fav" data-id="'+esc(e.id)+'" aria-pressed="'+(!!e.fav)+'" aria-label="Favorit">'+(e.fav?I.heartF:I.heart)+'</button><button class="ib" data-a="editEx" data-id="'+esc(e.id)+'" aria-label="Uredi vježbu">'+I.edit+'</button>') + '</div>' +
    mediaHtml(e, e.sides ? 'Lijeva i desna' : '') +
    '<div class="ttl gut">' + esc(e.name) + '</div>' +
    (exAlt(e) ? '<div class="meta gut">' + esc(exAlt(e)) + '</div>' : '') +
    '<div class="chips center" role="group" aria-label="Doziranje" style="margin-top:14px">' + opts.map((o,i) => '<button class="chip" data-a="dose" data-i="'+i+'" aria-pressed="'+(i===sel)+'">'+esc(o.label)+'</button>').join('') + '</div>' +
    '<div class="cards" aria-label="Upute, greške, detalji i napredak">' +
      '<section class="icard" aria-label="Upute">' +
        (e.feel ? '<span class="lb">Osjećaj</span><p>'+esc(e.feel)+'</p>' : '') +
        '<span class="lb">Upute</span>' + ((e.steps||[]).length ? (e.steps||[]).map((s, i) => '<div class="bul num"><i>'+(i+1)+'</i><span>'+esc(s)+'</span></div>').join('') : '<p style="color:var(--text-2)">Dodaj upute u uređivanju.</p>') +
      '</section>' +
      ((e.mistakes||[]).length ? '<section class="icard" aria-label="Česte greške"><span class="lb">Česte greške</span>' + e.mistakes.map(s => '<div class="bul warn">'+esc(s)+'</div>').join('') + '</section>' : '') +
      '<section class="icard" aria-label="Detalji">' +
        '<span class="lb">Ciljana područja</span><div class="tagrow">' + ((e.zones||[]).map(z => '<span class="tag">'+esc(z)+'</span>').join('') || '<span style="color:var(--text-2)">—</span>') + '</div>' +
        '<span class="lb">Oprema</span><p>' + esc(e.equipment || exEquip(e).join(', ')) + '</p>' +
        (e.note ? '<span class="lb">Napomena</span><p>'+esc(e.note)+'</p>' : '') +
        (e.video ? '<span class="lb">Video</span><p><a href="'+esc(e.video)+'" target="_blank" rel="noopener">'+esc(e.videoTitle || 'Pogledaj demonstraciju')+' ↗</a></p>' : '') +
        (packVideo(e) ? '<span class="lb">TAE video</span><p><a href="'+esc(packVideo(e))+'" target="_blank" rel="noopener">Pogledaj kod TAE ↗</a></p>' : '') +
        (e.source ? '<span class="lb">Izvor</span><p><a href="'+esc(e.source)+'" target="_blank" rel="noopener">'+esc(e.sourceTitle || 'Otvori izvor')+'</a></p>' : '') +
      '</section>' +
      progressCard(e) +
    '</div>' +
    '<div style="height:8px"></div></div>' +
    '<div class="ctrl gut">' +
      '<button class="small" data-a="editEx" data-id="'+esc(e.id)+'">Uredi</button><span></span>' +
      '<button class="ring" data-a="playEx" data-id="'+esc(e.id)+'" aria-label="Pokreni vježbu"><svg viewBox="0 0 76 76"><circle cx="38" cy="38" r="35" fill="none" stroke="var(--accent)" stroke-width="3.5"/></svg><span class="n">'+I.play+'</span></button>' +
      '<span></span><button class="ib" data-a="addTo" data-id="'+esc(e.id)+'" aria-label="Dodaj u protokol">'+I.addbox+'</button>' +
    '</div>';
};

function stepper(label, key, val, shown){
  return '<div class="prow"><span class="k">'+label+'</span><div class="step"><button class="sbtn" data-a="dstep" data-k="'+key+'" data-d="-1" aria-label="'+label+' manje">−</button><b>'+esc(shown)+'</b><button class="sbtn" data-a="dstep" data-k="'+key+'" data-d="1" aria-label="'+label+' više">+</button></div></div>';
}
VIEWS.exEdit = function(t){
  const d = S.draft; if (!d) return VIEWS.home();
  const isNew = !S.ex[d.id];
  const mediaBox = d.media && MEDIA[d.media]
    ? '<div class="media" style="border-radius:22px">' + (d.mediaType === 'image' ? '<img alt="" src="'+esc(mediaUrl(d.media))+'">' : '<video src="'+esc(mediaUrl(d.media))+'" autoplay muted loop playsinline></video>') + '</div>' +
      '<div class="seg" style="margin-top:10px"><label class="btn sec" for="mfile" style="height:48px;cursor:pointer">Zamijeni</label><button class="btn danger" data-a="mediaRemove">Ukloni</button></div>'
    : '<label for="mfile" class="dash" style="height:150px;flex-direction:column;cursor:pointer;color:var(--text)"><span class="circ">'+I.video+'</span><span style="font-size:15px">' + (S.draft._uploading ? 'Spremam video…' : 'Dodaj svoj video ili sliku') + '</span><span style="font-size:13px;color:var(--text-2);font-weight:400">Kratak isječak, do 20 MB</span></label>';
  return '<div class="view gut">' +
    topbar(backBtn('Odustani'), '', '') +
    '<h1 class="h1">' + (isNew ? 'Nova vježba' : 'Uredi vježbu') + '</h1>' +
    '<div class="stack" style="gap:22px;margin-top:22px">' +
      '<div>' + mediaBox + '<input id="mfile" class="vsr" type="file" accept="video/*,image/*"' + (S.canWrite ? '' : ' disabled') + '></div>' +
      '<div class="field"><label class="label" for="f-name">Naziv</label><input id="f-name" class="input" data-bind="name" value="'+esc(d.name)+'" placeholder="npr. Bench press ili Abdukcija s užetom"></div>' +
      '<div class="field"><label class="label" for="f-alt">Drugi naziv (po želji)</label><input id="f-alt" class="input" data-bind="alt" value="'+esc(d.alt)+'" placeholder="npr. Potisak s klupe"></div>' +
      '<div class="field"><span class="label">Kategorija</span><div class="chips wrap">' + CATS.map(c => '<button class="chip" data-a="dset" data-k="cat" data-v="'+c+'" aria-pressed="'+(d.cat===c)+'">'+c+'</button>').join('') + '</div></div>' +
      (d.cat === 'Rehab' || d.cat === 'Mobilnost' ? '<div class="field"><span class="label">Faza rehabilitacije</span><div class="chips wrap">' + [0,1,2,3].map(p => '<button class="chip" data-a="dset" data-k="phase" data-v="'+p+'" aria-pressed="'+((d.phase||0)===p)+'">'+(p?'Faza '+p:'Bez faze')+'</button>').join('') + '</div></div>' : '') +
      '<div class="field"><span class="label">Elastično uže</span><div class="chips wrap">' + [['','Bez užeta'],['Ø6','Ø6'],['Ø8','Ø8'],['Ø6/Ø8','Ø6 ili Ø8'],['Ø10','Ø10'],['Ø12','Ø12'],['Ø16','Ø16']].map(o => '<button class="chip" data-a="dset" data-k="cord" data-v="'+o[0]+'" aria-pressed="'+((d.cord||'')===o[0])+'">'+o[1]+'</button>').join('') + '</div></div>' +
      '<div class="field"><span class="label">Oprema</span><div class="chips wrap">' + EQUIP.map(z => '<button class="tagbtn" data-a="dequip" data-v="'+esc(z)+'" aria-pressed="'+((d.equip||[]).indexOf(z)!==-1)+'">'+esc(z)+'</button>').join('') + '</div></div>' +
      '<div class="field"><span class="label">Ciljana područja</span><div class="chips wrap">' + ZONES.map(z => '<button class="tagbtn" data-a="dzone" data-v="'+esc(z)+'" aria-pressed="'+((d.zones||[]).indexOf(z)!==-1)+'">'+esc(z)+'</button>').join('') + '</div></div>' +
      '<div class="field"><span class="label">Doziranje</span>' +
        '<div class="seg"><button class="chip" data-a="dset" data-k="measure" data-v="time" aria-pressed="'+(d.measure==='time')+'" style="height:44px">Na vrijeme</button><button class="chip" data-a="dset" data-k="measure" data-v="sets" aria-pressed="'+(d.measure!=='time')+'" style="height:44px">Serije</button></div>' +
        '<div class="panel">' +
          (d.measure === 'time' ? stepper('Trajanje','sec',d.sec, d.sec+' s') + stepper('Serije','sets',d.sets, d.sets) + stepper('Odmor','rest',d.rest, d.rest+' s') : stepper('Serije','sets',d.sets, d.sets) + stepper('Ponavljanja','reps',d.reps, d.reps) + stepper('Odmor','rest',d.rest, d.rest+' s') + stepper('Težina','kg',d.kg, d.kg ? d.kg+' kg' : '—')) +
          '<div class="prow"><span class="k">Lijeva i desna strana posebno</span><button class="switch" role="switch" data-a="dflag" data-k="sides" aria-checked="'+(!!d.sides)+'" aria-label="Lijeva i desna strana posebno"></button></div>' +
        '</div></div>' +
      '<div class="field"><label class="label" for="f-eq">Oprema (opis)</label><input id="f-eq" class="input" data-bind="equipment" value="'+esc(d.equipment)+'" placeholder="npr. Uže Ø6 + kolotur"></div>' +
      '<div class="field"><label class="label" for="f-feel">Osjećaj</label><input id="f-feel" class="input" data-bind="feel" value="'+esc(d.feel)+'" placeholder="Gdje se vježba osjeća"></div>' +
      '<div class="field"><label class="label" for="f-steps">Upute (svaki red jedan korak)</label><textarea id="f-steps" class="input" rows="5" data-bind="stepsText">'+esc(d.stepsText)+'</textarea></div>' +
      '<div class="field"><label class="label" for="f-mis">Česte greške (svaki red jedna)</label><textarea id="f-mis" class="input" rows="3" data-bind="mistakesText">'+esc(d.mistakesText)+'</textarea></div>' +
      '<div class="field"><label class="label" for="f-note">Napomena</label><textarea id="f-note" class="input" rows="3" data-bind="note">'+esc(d.note)+'</textarea></div>' +
      '<div class="field"><label class="label" for="f-video">Link na video demonstraciju (po želji)</label><input id="f-video" class="input" type="url" inputmode="url" data-bind="video" value="'+esc(d.video)+'" placeholder="https://"></div>' +
      (isNew ? '' : '<button class="btn danger" data-a="delEx">' + (d._confirmDel ? 'Dodirni još jednom za brisanje' : 'Obriši vježbu') + '</button>') +
    '</div><div style="height:16px"></div></div>' +
    '<div class="footer gut"><button class="btn" data-a="saveEx">Spremi vježbu</button></div>';
};

function daysPicker(action, id, days){
  days = days || [];
  return '<div class="days" role="group" aria-label="Dani u tjednu"><span class="label" style="padding-left:17px">Dani u tjednu' + (days.length ? '' : ' · dodirni dane kad ga radiš') + '</span><div class="drow">' +
    DAYS.map((L, i) => '<button class="dchip" data-a="'+action+'" data-id="'+esc(id)+'" data-i="'+i+'" aria-pressed="'+(days.indexOf(i) !== -1)+'" aria-label="'+DAYNAMES[i]+'">'+L+'</button>').join('') + '</div></div>';
}
const groupWord = n => n === 2 ? 'Superset' : n === 3 ? 'Triset' : 'Krug';
function groupHead(items, g, L){
  const R = Math.max.apply(null, g.idx.map(i => items[i].sets || 1)), last = items[g.idx[g.idx.length - 1]];
  return '<div class="ghead"><b>' + groupWord(g.idx.length) + ' ' + L + '</b><span>' + R + ' ' + plural(R, 'krug', 'kruga', 'krugova') + (last.rest ? ' • odmor ' + last.rest + ' s nakon kruga' : '') + '</span></div>';
}
function itemRowsHtml(items, lab){
  let sec = null;
  return groupsOf(items).map(g => {
    const s0 = items[g.idx[0]].section; const head = s0 && s0 !== sec ? '<div class="sechead">' + esc(s0) + '</div>' : ''; if (s0) sec = s0;
    const rows = g.idx.map(i => {
      const it = items[i], e = S.ex[it.exId], l = lab[i];
      const fresh = it.up && Date.now() - it.up < 21 * DAY_MS;
      return '<button class="row'+(l ? ' inss' : '')+'" data-a="openEx" data-id="'+esc(it.exId)+'" style="min-height:72px"><span class="thumb" style="width:62px;height:62px">'+(exMedia(e) ? thumbHtml(e) : (l ? l.L + l.k : i + 1))+'</span><span class="tx"><span class="t">'+(l ? '<span class="sslab">'+l.L+l.k+'</span> ' : '')+esc(e ? e.name : 'Obrisana vježba')+'</span><span class="m"><span>'+esc(dose(it))+'</span>'+(fresh ? '<span class="tag">↑ napredak</span>' : '')+'</span></span>'+I.chev+'</button>';
    }).join('');
    return head + (g.ss ? '<div class="sgroup">' + groupHead(items, g, lab[g.idx[0]].L) + rows + '</div>' : rows);
  }).join('');
}
/* ---------- programmes: fixed weekly order of sessions, e.g. a purchased 6-week plan from your private pack ---------- */
function progSessions(g){ const out = []; (g.weeks || []).forEach(w => (w.sessions || []).forEach((x, k) => out.push({ week: w.week, k, label: x.label, short: w.week + '. tj. · ' + x.label, pr: x.pr }))); return out; }
function progStatus(g){
  const all = progSessions(g), doneIds = {};
  S.log.forEach(l => { if (l.kind === 'protocol' && l.refId) doneIds[l.refId] = (doneIds[l.refId] || 0) + 1; });
  const items = all.map(x => Object.assign({ done: !!doneIds[x.pr] }, x));
  return { items, total: items.length, done: items.filter(x => x.done).length, next: items.find(x => !x.done && S.pr[x.pr]) };
}
function progCover(g){ for (const x of progSessions(g)) { const p = S.pr[x.pr]; const it = p && (p.items || []).find(i => exMedia(S.ex[i.exId])); if (it) return S.ex[it.exId]; } return null; }
VIEWS.program = function(t){
  const g = S.prog[t.id];
  if (!g) return '<div class="view gut">' + topbar(backBtn()) + '<div class="empty">Ovaj program više ne postoji.</div></div>';
  const st = progStatus(g), pct = st.total ? st.done / st.total : 0, C = 2 * Math.PI * 30;
  const cols = Math.max.apply(null, (g.weeks || []).map(w => (w.sessions || []).length).concat([1]));
  return '<div class="view gut">' + topbar(backBtn()) +
    '<h1 class="h1">' + esc(g.name) + '</h1>' + (g.desc ? '<p class="sub" style="margin-right:17px;line-height:20px">' + esc(g.desc) + '</p>' : '') +
    '<div class="progtop"><svg viewBox="0 0 72 72" width="72" height="72"><circle cx="36" cy="36" r="30" fill="none" stroke="var(--track)" stroke-width="6"/><circle cx="36" cy="36" r="30" fill="none" stroke="var(--accent)" stroke-width="6" stroke-linecap="round" stroke-dasharray="'+(C*pct).toFixed(1)+' '+C.toFixed(1)+'" transform="rotate(-90 36 36)"/></svg>' +
      '<div><b>' + st.done + ' od ' + st.total + '</b><span>' + (st.next ? 'Sljedeće: ' + esc(st.next.short) : 'Program je završen. Bravo!') + '</span></div></div>' +
    '<div class="pgrid" style="grid-template-columns:44px repeat('+cols+',1fr)">' + (g.weeks || []).map(w => '<span class="pw">' + w.week + '. tj.</span>' + (w.sessions || []).map(x => {
      const it = st.items.find(y => y.pr === x.pr) || {}; const cls = it.done ? 'done' : (st.next && st.next.pr === x.pr) ? 'next' : '';
      return '<button class="pcell ' + cls + '" data-a="openPr" data-id="'+esc(x.pr)+'" aria-label="'+esc(w.week + '. tjedan, ' + x.label + (it.done ? ', odrađeno' : ''))+'">'+esc(x.label)+'</button>'; }).join('')).join('') + '</div>' +
    ((g.notes || []).length ? '<h2 class="h2">Kako ga raditi</h2><div class="stack" style="gap:8px;margin:12px 17px 0">' + g.notes.map(n => '<div class="bul">'+esc(n)+'</div>').join('') + '</div>' : '') +
    (g.credit ? '<p class="sub" style="margin-top:16px">' + esc(g.credit) + '</p>' : '') +
    '<div style="height:20px"></div></div>' +
    (st.next ? '<div class="footer gut"><button class="btn" data-a="openPr" data-id="'+esc(st.next.pr)+'">Sljedeći trening</button></div>' : '');
};
function goalCard(p){
  const g = S.settings.goal;
  if (p.program) { const k = kgPlan(p); return k.changes.length && !(S.kgSkip && S.kgSkip[p.id]) ? '<div class="lift go" style="margin:0 17px"><div class="why" style="color:var(--text-body)">Kilogrami za ovaj trening mogu se izračunati iz tvojih težina ('+k.changes.length+' '+plural(k.changes.length, 'vježba', 'vježbe', 'vježbi')+'). Ponavljanja i serije ostaju kao u programu.</div><div class="acts"><button class="bt" data-a="kgSheet" data-id="'+esc(p.id)+'">Predloži kilograme</button><button class="bt ghost" data-a="kgSkip" data-id="'+esc(p.id)+'">Ne</button></div></div>' : ''; }
  const tag = p.goal && GOALS[p.goal] ? '<div style="display:flex;gap:8px;margin:0 17px;flex-wrap:wrap"><span class="tag">Cilj: '+esc(GOALS[p.goal].name)+'</span><span class="tag">'+esc(GOALS[p.goal].desc.split(' · ').slice(0, 2).join(' · '))+'</span></div>' : '';
  if (!g || p.goal === g || p.goalSkip === g) return tag;
  const plan = goalPlan(p, g); if (!plan.changes.length) return tag;
  return tag + '<div class="lift go" style="margin:0 17px"><div class="why" style="color:var(--text-body)">Cilj razdoblja je „'+esc(GOALS[g].name)+'”. Za '+plan.changes.length+' '+plural(plan.changes.length, 'vježbu', 'vježbe', 'vježbi')+' s opterećenjem postoji prijedlog serija, ponavljanja, odmora i kilograma.</div><div class="acts"><button class="bt" data-a="goalSheet" data-id="'+esc(p.id)+'">Pogledaj i primijeni</button><button class="bt ghost" data-a="goalSkip" data-id="'+esc(p.id)+'">Ne</button></div></div>';
}
function featRows(p){
  const eq = {}; (p.items||[]).forEach(it => { const e = S.ex[it.exId]; if (e) exEquip(e).forEach(x => { if (x !== 'Bez opreme') eq[x] = 1; }); });
  const zones = {}; (p.items||[]).forEach(it => { const e = S.ex[it.exId]; (e && e.zones || []).forEach(z => zones[z] = 1); });
  return '<div class="feat">'+I.clock+'<span>' + protoMin(p) + ' minuta • ' + nVj((p.items||[]).length) + '</span></div>' +
    (Object.keys(zones).length ? '<div class="feat">'+I.target+'<span>' + esc(Object.keys(zones).slice(0,4).join(', ')) + '</span></div>' : '') +
    '<div class="feat">'+I.bars+'<span>Oprema: ' + esc(Object.keys(eq).slice(0,3).join(', ') || 'bez opreme') + '</span></div>';
}
VIEWS.pr = function(t){
  const p = S.pr[t.id];
  if (!p) return '<div class="view gut">' + topbar(backBtn()) + '<div class="empty">Ovaj protokol više ne postoji.</div></div>';
  const first = p.items && p.items[0] && S.ex[p.items[0].exId];
  const fm = exMedia(first);
  const lab = ssLetters(p.items || []);
  return '<div class="view" style="position:relative">' +
    '<div class="hero">' + (fm ? (fm.type === 'image' ? '<img alt="" src="'+esc(fm.src)+'">' : '<video src="'+esc(fm.src)+'" autoplay muted loop playsinline></video>') : '<span class="ic">'+pathIcon(p.home==='aktivacija'?I.rope:p.home==='rehab'?I.pulse:I.dumb,110)+'</span>') + '<span class="fade"></span></div>' +
    '<div class="over gut">' + topbar(backBtn(), '<button class="ib" data-a="editPr" data-id="'+esc(p.id)+'" aria-label="Uredi protokol">'+I.edit+'</button>') + '</div>' +
    '<div class="gut stack" style="gap:18px;margin-top:-6px">' +
      '<h1 style="margin:0 17px;font-size:30px;line-height:36px;font-weight:600;text-wrap:balance">' + esc(p.name) + '</h1>' +
      (p.desc ? '<p style="margin:0 17px;font-size:16px;line-height:24px;color:var(--text-body)">' + esc(p.desc) + '</p>' : '') +
      '<div class="stack" style="gap:16px;margin:4px 17px 0">' + featRows(p) + '</div>' +
      goalCard(p) +
      (p.program ? '' : daysPicker('prDays', p.id, p.days)) +
      '<div style="display:flex;justify-content:space-between;align-items:baseline;margin:8px 17px 0"><h2 style="margin:0;font-size:17px;font-weight:600">Vježbe</h2>' + (p.program ? '' : '<button class="txtbtn" data-a="progInfo" style="height:32px;font-size:14px;padding:0">Kako napredujem?</button>') + '</div>' +
      '<div class="list">' + itemRowsHtml(p.items || [], lab) + '</div>' +
    '</div><div style="height:16px"></div></div>' +
    '<div class="footer gut"><button class="btn" data-a="startPr" data-id="'+esc(p.id)+'"' + ((p.items||[]).length ? '' : ' disabled') + '>Krenimo!</button></div>';
};

VIEWS.build = function(){
  const d = S.draft; if (!d) return VIEWS.home();
  const isNew = !S.pr[d.id];
  const total = protoMin(d);
  return '<div class="view gut">' +
    topbar(backBtn('Odustani'), '<button class="txtbtn" data-a="savePr">Spremi</button>', '') +
    '<h1 class="h1">' + (isNew ? 'Novi protokol' : 'Sastavi protokol') + '</h1>' +
    '<div class="field" style="margin-top:22px"><label class="label" for="p-name">Naziv</label><input id="p-name" class="input" data-bind="name" value="'+esc(d.name)+'" placeholder="npr. Aktivacija prije treninga" style="font-weight:600;font-size:17px"></div>' +
    '<div class="field" style="margin-top:16px"><label class="label" for="p-desc">Opis</label><textarea id="p-desc" class="input" rows="2" data-bind="desc" placeholder="Kada i zašto ga radiš">'+esc(d.desc)+'</textarea></div>' +
    '<div style="display:flex;justify-content:space-between;align-items:baseline;margin:28px 17px 14px"><h2 style="margin:0;font-size:17px;font-weight:600">Vježbe</h2><span style="font-size:14px;color:var(--text-body)">'+nVj(d.items.length)+' • ≈ '+total+' min</span></div>' +
    '<div class="list">' + (function(){
      const lab = ssLetters(d.items);
      const card = (it, i) => {
        const e = S.ex[it.exId]; const open = d._open === i; const l = lab[i];
        const linked = i < d.items.length - 1 && it.ss && d.items[i+1].ss === it.ss;
        const inGroup = !!l, lastInGroup = inGroup && !linked;
        const restLabel = !inGroup ? 'Odmor između serija' : lastInGroup ? 'Odmor nakon kruga' : 'Odmor prije sljedeće';
        return '<div style="border-radius:20px;background:var(--surface);border:1px solid '+(open?'var(--accent)':'var(--border)')+'">' +
          '<button class="row" data-a="itOpen" data-i="'+i+'" aria-expanded="'+open+'" style="border:0;background:transparent">' +
            '<span class="thumb">'+(exMedia(e) ? thumbHtml(e) : (l ? l.L + l.k : i+1))+'</span><span class="tx"><span class="t">'+(l ? '<span class="sslab">'+l.L+l.k+'</span> ' : '')+esc(e ? e.name : 'Obrisana vježba')+'</span><span class="m"><span>'+esc(dose(it))+'</span></span></span>' +
            '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate('+(open?'-90':'90')+'deg)"><path d="M9 4.5l7.5 7.5L9 19.5"/></svg>' +
          '</button>' +
          (open ? '<div style="padding:0 16px 16px;border-top:1px solid var(--border)">' +
            '<div class="seg" style="margin-top:12px"><button class="chip" data-a="iset" data-k="measure" data-v="time" aria-pressed="'+(it.measure==='time')+'">Na vrijeme</button><button class="chip" data-a="iset" data-k="measure" data-v="sets" aria-pressed="'+(it.measure!=='time')+'">Serije</button></div>' +
            (it.measure === 'time'
              ? istep('Trajanje','sec',i,it.sec+' s') + istep(inGroup ? 'Krugovi' : 'Serije','sets',i,it.sets||1) + istep(restLabel,'rest',i,(it.rest||0)+' s')
              : istep(inGroup ? 'Krugovi' : 'Serije','sets',i,it.sets) + istep('Ponavljanja','reps',i,it.reps) + istep('Težina','kg',i,it.kg ? fmtKg(it.kg) : '—') + istep(restLabel,'rest',i,(it.rest||0)+' s')) +
            '<div class="prow"><span class="k">Lijeva i desna posebno</span><button class="switch" role="switch" data-a="iflag" data-i="'+i+'" aria-checked="'+(!!it.sides)+'" aria-label="Lijeva i desna posebno"></button></div>' +
            (i < d.items.length - 1 ? '<div class="prow"><span class="k">Superset sa sljedećom vježbom<br><span style="font-size:13px;color:var(--text-2)">Radiš ih naizmjence, odmor tek nakon kruga</span></span><button class="switch" role="switch" data-a="ilink" data-i="'+i+'" aria-checked="'+linked+'" aria-label="Superset sa sljedećom vježbom"></button></div>' : '') +
            '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px">' +
              '<button class="chip" data-a="imove" data-i="'+i+'" data-d="-1"'+(i===0?' disabled style="opacity:.35"':'')+'>↑ Gore</button>' +
              '<button class="chip" data-a="imove" data-i="'+i+'" data-d="1"'+(i===d.items.length-1?' disabled style="opacity:.35"':'')+'>↓ Dolje</button>' +
              '<button class="chip" data-a="idel" data-i="'+i+'" style="color:var(--danger)">Ukloni</button>' +
            '</div></div>' : '') +
        '</div>';
      };
      return groupsOf(d.items).map(g => g.ss ? '<div class="sgroup">' + groupHead(d.items, g, lab[g.idx[0]].L) + g.idx.map(i => card(d.items[i], i)).join('') + '</div>' : card(d.items[g.idx[0]], g.idx[0])).join('');
    })() +
      '<button class="dash" data-a="pickStart">'+I.plus.replace('<svg','<svg width="18" height="18"')+'Dodaj vježbe iz knjižnice</button>' +
      '<div style="margin:8px 0 0">' + daysPicker('ddays', d.id, d.days) + '</div>' +
      (isNew ? '' : '<button class="btn sec" data-a="copyPr" style="height:48px">Kopiraj protokol</button>') +
      (isNew ? '' : '<button class="btn danger" data-a="delPr">' + (d._confirmDel ? 'Dodirni još jednom za brisanje' : 'Obriši protokol') + '</button>') +
    '</div><div style="height:16px"></div></div>' +
    '<div class="footer gut"><button class="btn" data-a="savePr" data-start="1"' + (d.items.length ? '' : ' disabled') + '>Spremi i kreni</button></div>';
};
function istep(label, key, i, shown){
  return '<div class="prow" style="border:0"><span class="k">'+label+'</span><div class="step"><button class="sbtn" data-a="istep" data-k="'+key+'" data-i="'+i+'" data-d="-1" aria-label="'+label+' manje">−</button><b>'+esc(shown)+'</b><button class="sbtn" data-a="istep" data-k="'+key+'" data-i="'+i+'" data-d="1" aria-label="'+label+' više">+</button></div></div>';
}

const FIELD_GROUPS = [
  { key:'pre', title:'Predsezonski plan · 4 tjedna', sub:'STATSports Pre-Season Training Program: trčanja za pripreme, po tjednima' },
  { key:'web', title:'Treninzi sa statsports.com', sub:'Treninzi trčanja koje je STATSports objavio na svojim stranicama' }
];
// the published 4-week schedule: tap a code to open that run
function fieldPlanHtml(){
  const plan = (window.SEED_PLAN || {}).pre; if (!plan) return '';
  return '<div class="plangrid" role="table" aria-label="Raspored po tjednima"><span></span>' + DAYS.map(L => '<span class="ph">'+L+'</span>').join('') +
    plan.weeks.map(w => '<span class="ph">'+w.week+'.</span>' + DAYS.map((L, i) => { const code = w.days[i]; const f = code && S.field['ss-pre-' + code.toLowerCase()];
      return code ? (f ? '<button class="pc" data-a="openField" data-id="'+esc(f.id)+'" aria-label="'+esc(w.week+'. tjedan, '+DAYNAMES[i]+': '+f.name_hr)+'">'+esc(code)+'</button>' : '<span class="pc">'+esc(code)+'</span>') : '<span class="pe"></span>'; }).join('')).join('') +
    '</div><p class="sub" style="margin-right:17px;line-height:19px">'+esc(plan.note || '')+'</p>';
}
function fieldRow(f){
  const spec = (window.PITCH || {})[f.id];
  const when = f.week ? f.week + '. tjedan' + (f.dayHr ? ' · ' + f.dayHr : '') : '';
  return '<button class="row" data-a="openField" data-id="'+esc(f.id)+'"><span class="thumb pthumb">'+(spec ? pitchSvg(spec, { thumb:true }) : pathIcon(I.run,28))+'</span><span class="tx"><span class="t">'+esc(f.name_hr)+'</span><span class="m"><span>'+fieldMin(f)+' min</span><span class="tag">'+esc(when || f.goal_hr)+'</span></span></span>'+I.chev+'</button>';
}
VIEWS.fieldList = function(){
  const all = Object.values(S.field).sort((a,b) => (a.order||99) - (b.order||99));
  let body;
  if (S.dbState !== 'ready') body = stateNote();
  else if (!all.length) body = '<div class="empty">Treninzi s terena se pripremaju. Uskoro će se pojaviti ovdje.</div>';
  else body = FIELD_GROUPS.map(g => {
    const list = all.filter(f => (f.group || 'web') === g.key);
    return list.length ? '<h2 class="h2">'+esc(g.title)+'</h2><p class="sub">'+esc(g.sub)+'</p>' + (g.key === 'pre' ? fieldPlanHtml() : '') + '<div class="list" style="margin-top:14px">' + list.map(fieldRow).join('') + '</div>' : '';
  }).join('');
  return '<div class="view gut">' + topbar(backBtn()) +
    '<h1 class="h1">Kondicija na terenu</h1>' +
    '<p class="sub">Nacrt terena pokazuje odakle i kamo trčiš</p>' +
    body + '<div style="height:20px"></div></div>';
};

/* ---------- pitch diagrams: geometry in metres lives in pitch.js, drawn here ---------- */
const PSTYLE = {
  sprint:{ c:'#FFD54A', w:.8, d:'' }, run:{ c:'#FFFFFF', w:.6, d:'' }, jog:{ c:'#FFFFFF', w:.55, d:'2 1.6' },
  walk:{ c:'#D8EADB', w:.5, d:'.3 1.3' }, shuttle:{ c:'#FF9F5A', w:.7, d:'' }, dribble:{ c:'#7FD3FF', w:.6, d:'1.2 1' }, pass:{ c:'#FFFFFF', w:.4, d:'.6 .8' }
};
const PLABEL = { sprint:'sprint', run:'trčanje', jog:'lagano trčanje', walk:'hod', shuttle:'tamo-natrag', dribble:'vođenje lopte', pass:'dodavanje' };
const PSPEED = { sprint:7.5, run:5.5, jog:3.5, walk:1.6, shuttle:6, dribble:3, pass:12 };
function pitchSvg(spec, opt){
  opt = opt || {};
  const full = !spec.pitch || spec.pitch === 'full';
  const W = full ? 105 : spec.pitch.w, H = full ? 68 : spec.pitch.h;
  const mg = full ? 3 : Math.max(1.2, W * .07);
  const Y = y => +(H - y).toFixed(2), X = x => +(+x).toFixed(2);
  const thumb = !!opt.thumb, fs = full ? 3.3 : Math.max(.6, W * .045);
  const lw = full ? .3 : Math.max(.06, W * .006);
  let s = '<svg class="pitchsvg" viewBox="'+[-mg, -mg, W + 2*mg, H + 2*mg].map(X).join(' ')+'" role="img" aria-label="'+esc(spec.alt || 'Nacrt terena')+'" preserveAspectRatio="xMidYMid meet">';
  s += '<rect x="'+(-mg)+'" y="'+(-mg)+'" width="'+(W + 2*mg)+'" height="'+(H + 2*mg)+'" rx="'+(mg*.6)+'" fill="#2A6639"/>';
  const n = full ? 14 : Math.max(4, Math.round(W / 2));
  for (let i = 0; i < n; i += 2) s += '<rect x="'+X(i*W/n)+'" y="0" width="'+X(W/n)+'" height="'+H+'" fill="#2E6F3E"/>';
  const L = ' fill="none" stroke="rgba(255,255,255,.82)" stroke-width="'+lw+'"';
  s += '<rect x="0" y="0" width="'+W+'" height="'+H+'"'+L+'/>';
  if (full) {
    s += '<line x1="52.5" y1="0" x2="52.5" y2="68"'+L+'/><circle cx="52.5" cy="34" r="9.15"'+L+'/><circle cx="52.5" cy="34" r=".4" fill="#fff"/>';
    [0, 1].forEach(r => { const x0 = r ? 105 : 0, dx = r ? -1 : 1, ax = x0 + dx*16.5, dy = Math.sqrt(9.15*9.15 - 5.5*5.5).toFixed(2);
      s += '<rect x="'+(r ? 88.5 : 0)+'" y="13.84" width="16.5" height="40.32"'+L+'/><rect x="'+(r ? 99.5 : 0)+'" y="24.84" width="5.5" height="18.32"'+L+'/>' +
        '<circle cx="'+(x0 + dx*11)+'" cy="34" r=".35" fill="#fff"/><path d="M'+ax+' '+(34 - dy)+'A9.15 9.15 0 0 '+(r ? 0 : 1)+' '+ax+' '+(34 + +dy)+'"'+L+'/>' +
        '<rect x="'+(r ? 105 : -1.8)+'" y="30.34" width="1.8" height="7.32"'+L+'/>'; });
  }
  const dimmed = p => opt.block != null && p.block != null && (Array.isArray(p.block) ? p.block.indexOf(opt.block) === -1 : p.block !== opt.block);
  const paths = (spec.paths || []).slice().sort((a,b) => (a.order||0) - (b.order||0));
  // Labels are collected first and placed at the end: each gets a few candidate spots and takes the first one
  // that touches no other label and no marker. A label that fits nowhere is left out; the legend still explains the lines.
  const labels = [], blocked = [];
  const angleOf = (x1, y1, x2, y2) => { let a = Math.atan2(-(y2 - y1), x2 - x1) * 180 / Math.PI; if (a > 90) a -= 180; if (a <= -90) a += 180; return Math.abs(a) < 2 ? 0 : a; };
  const alongLine = (x1, y1, x2, y2, side) => (w, h) => {
    const len = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / len, uy = (y2 - y1) / len, a = angleOf(x1, y1, x2, y2), off = lw + h / 2 + fs * .12, out = [];
    const sides = side < 0 ? [-1, 1] : [1, -1];
    // close to the line first, then a little further out (clears cones standing on the line), then shifted along it
    [[0, off], [0, off + fs * .9], [.22, off], [-.22, off], [.22, off + fs * .9], [-.22, off + fs * .9], [.36, off], [-.36, off]].forEach(([t, o]) =>
      sides.forEach(sd => out.push({ x: X((x1 + x2) / 2 + ux * len * t - uy * o * sd), y: Y((y1 + y2) / 2 + uy * len * t + ux * o * sd), a })));
    return out;
  };
  const addLabel = (text, size, pri, cands) => { if (text && !thumb) labels.push({ text: String(text), size, pri, cands, i: labels.length }); };
  if (!thumb) (spec.dims || []).forEach(dm => {
    const [x1,y1] = dm.from, [x2,y2] = dm.to, len = Math.hypot(x2-x1, y2-y1) || 1, nx = -(y2-y1)/len, ny = (x2-x1)/len, t = fs*.35;
    s += '<g class="dim" opacity=".85"><line x1="'+X(x1)+'" y1="'+Y(y1)+'" x2="'+X(x2)+'" y2="'+Y(y2)+'" stroke="#fff" stroke-width="'+(lw*.8)+'" stroke-dasharray="'+(fs*.35)+' '+(fs*.25)+'"/>' +
      '<line x1="'+X(x1+nx*t)+'" y1="'+Y(y1+ny*t)+'" x2="'+X(x1-nx*t)+'" y2="'+Y(y1-ny*t)+'" stroke="#fff" stroke-width="'+lw+'"/><line x1="'+X(x2+nx*t)+'" y1="'+Y(y2+ny*t)+'" x2="'+X(x2-nx*t)+'" y2="'+Y(y2-ny*t)+'" stroke="#fff" stroke-width="'+lw+'"/></g>';
    addLabel(dm.label, fs * .78, 1, alongLine(x1, y1, x2, y2, 1));
  });
  paths.forEach(p => {
    const st = PSTYLE[p.kind] || PSTYLE.run;
    const pts = p.points || [];
    if (pts.length < 2) return;
    const d = 'M' + pts.map(q => X(q[0]) + ' ' + Y(q[1])).join('L');
    const w = (thumb ? st.w * 2.2 : st.w) * (full ? 1 : W / 60);
    s += '<path d="'+d+'" fill="none" stroke="'+st.c+'" stroke-width="'+w.toFixed(2)+'" stroke-linecap="round" stroke-linejoin="round"'+(st.d ? ' stroke-dasharray="'+st.d.split(' ').map(v => (v * (full ? 1 : W / 60)).toFixed(2)).join(' ')+'"' : '')+(dimmed(p) ? ' opacity=".25"' : '')+'/>';
    if (p.arrow !== false && !thumb) {
      const [ax, ay] = pts[pts.length - 1], [bx, by] = pts[pts.length - 2];
      const a = Math.atan2(ay - by, ax - bx), hl = fs * .75;
      const tip = [ax, ay], l = [ax - hl*Math.cos(a - .45), ay - hl*Math.sin(a - .45)], r = [ax - hl*Math.cos(a + .45), ay - hl*Math.sin(a + .45)];
      s += '<path d="M'+X(l[0])+' '+Y(l[1])+'L'+X(tip[0])+' '+Y(tip[1])+'L'+X(r[0])+' '+Y(r[1])+'" fill="none" stroke="'+st.c+'" stroke-width="'+w.toFixed(2)+'" stroke-linecap="round" stroke-linejoin="round"'+(dimmed(p) ? ' opacity=".25"' : '')+'/>';
    }
    if (p.label && !dimmed(p)) {
      let best = 0, bi = 1; for (let i = 1; i < pts.length; i++) { const sl = Math.hypot(pts[i][0]-pts[i-1][0], pts[i][1]-pts[i-1][1]); if (sl > best) { best = sl; bi = i; } }
      const [x1,y1] = pts[bi-1], [x2,y2] = pts[bi];
      addLabel(p.label, fs * .82, 3, alongLine(x1, y1, x2, y2, p.labelSide === 'below' ? -1 : 1));
    }
  });
  (spec.markers || []).forEach(mk => {
    const x = X(mk.x), y = Y(mk.y), r = fs * .42;
    if (mk.kind === 'cone') s += '<path d="M'+x+' '+(y - r*1.25)+'L'+(x + r)+' '+(y + r*.8)+'L'+(x - r)+' '+(y + r*.8)+'Z" fill="#FF8A3D" stroke="#fff" stroke-width="'+(lw*.6)+'"/>';
    else if (mk.kind === 'pole') s += '<circle cx="'+x+'" cy="'+y+'" r="'+(r*.7)+'" fill="#FFD54A" stroke="#7A5B00" stroke-width="'+(lw*.6)+'"/>';
    else if (mk.kind === 'start') s += '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#E5484D" stroke="#fff" stroke-width="'+(lw*.9)+'"/>';
    else if (mk.kind === 'ball') s += '<circle cx="'+x+'" cy="'+y+'" r="'+(r*.8)+'" fill="#fff" stroke="#1E2A22" stroke-width="'+(lw*.8)+'"/><path d="M'+(x - r*.45)+' '+y+'h'+(r*.9)+'M'+x+' '+(y - r*.45)+'v'+(r*.9)+'" stroke="#1E2A22" stroke-width="'+(lw*.5)+'"/>';
    else s += '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="none" stroke="#fff" stroke-width="'+(lw*1.2)+'"/>';
    blocked.push([x - r*1.2, y - r*1.4, x + r*1.2, y + r*1.2]);
    addLabel(mk.label, fs * .74, 2, (w, h) => { const g = r * 1.3; return [
      { x: x + g + w/2, y: y, a: 0 }, { x: x, y: y - g - h/2, a: 0 }, { x: x - g - w/2, y: y, a: 0 }, { x: x, y: y + g + h/2, a: 0 }]; });
  });
  (spec.labels || []).forEach(l => addLabel(l.text, fs * .78, 2, (w, h) => [0, 1, -1, 2, -2].map(k => ({ x: X(l.x), y: Y(l.y) + k * h * 1.1, a: 0 }))));
  const placed = [], hit = (b, c) => b[0] < c[2] && c[0] < b[2] && b[1] < c[3] && c[1] < b[3];
  labels.sort((a, b) => b.pri - a.pri || a.i - b.i).forEach(lb => {
    const w = lb.text.length * lb.size * .56 + lb.size * .9, h = lb.size * 1.45;
    for (const c of lb.cands(w, h)) {
      const rad = c.a * Math.PI / 180, bw = Math.abs(w * Math.cos(rad)) + Math.abs(h * Math.sin(rad)), bh = Math.abs(w * Math.sin(rad)) + Math.abs(h * Math.cos(rad));
      const box = [c.x - bw/2, c.y - bh/2, c.x + bw/2, c.y + bh/2];
      if (box[0] < -mg || box[1] < -mg || box[2] > W + mg || box[3] > H + mg) continue;
      if (placed.some(q => hit(q.box, box)) || blocked.some(q => hit(q, box))) continue;
      placed.push({ box, lb, c, w, h }); break;
    }
  });
  placed.forEach(({ lb, c, w, h }) => {
    const tr = c.a ? ' transform="rotate(' + c.a.toFixed(1) + ' ' + c.x + ' ' + c.y + ')"' : '';
    s += '<g' + tr + '><rect x="'+(c.x - w/2).toFixed(2)+'" y="'+(c.y - h/2).toFixed(2)+'" width="'+w.toFixed(2)+'" height="'+h.toFixed(2)+'" rx="'+(h/2).toFixed(2)+'" fill="rgba(14,32,20,.72)"/>' +
      '<text x="'+c.x+'" y="'+c.y+'" font-size="'+lb.size.toFixed(2)+'" class="ptxt" text-anchor="middle" dominant-baseline="central">'+esc(lb.text)+'</text></g>';
  });
  const still = opt.still || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (!thumb && !still) {
    const route = paths.filter(p => !dimmed(p) && (p.points||[]).length > 1).map(p => ({ k: p.kind || 'run', pts: p.points.map(q => [X(q[0]), Y(q[1])]) }));
    if (route.length) s += '<g class="runner" transform="translate('+route[0].pts[0][0]+' '+route[0].pts[0][1]+')" data-route="'+esc(JSON.stringify(route))+'"><circle r="'+(fs*.95)+'" fill="rgba(255,255,255,.22)"/><circle r="'+(fs*.5)+'" fill="#fff" stroke="#5789E8" stroke-width="'+(lw*1.4)+'"/></g>';
  }
  return s + '</svg>';
}
function pitchLegend(spec){
  const kinds = {}; (spec.paths || []).forEach(p => kinds[p.kind || 'run'] = 1);
  return Object.keys(kinds).map(k => { const st = PSTYLE[k] || PSTYLE.run; return '<span class="lg"><svg width="28" height="8" viewBox="0 0 28 8"><line x1="1" y1="4" x2="27" y2="4" stroke="'+st.c+'" stroke-width="2.4" stroke-linecap="round"'+(st.d ? ' stroke-dasharray="'+st.d.split(' ').map(v => (v*3).toFixed(1)).join(' ')+'"' : '')+'/></svg>'+esc(PLABEL[k] || k)+'</span>'; }).join('');
}
// one animation loop moves every runner on screen along its route; it stops by itself when none is left
let runnerRaf = null;
function startRunners(){
  if (runnerRaf || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
  const t0 = performance.now();
  const step = now => {
    const gs = app.querySelectorAll('g.runner');
    if (!gs.length) { runnerRaf = null; return; }
    gs.forEach(g => {
      if (!g._plan) {
        const route = JSON.parse(g.dataset.route); let T = 0; const segs = [];
        route.forEach(r => { let len = 0; for (let i = 1; i < r.pts.length; i++) len += Math.hypot(r.pts[i][0]-r.pts[i-1][0], r.pts[i][1]-r.pts[i-1][1]); const d = len / (PSPEED[r.k] || 5); segs.push({ r, len, d, at: T }); T += d + .6; });
        const scale = T > 14 ? 14 / T : T < 5 ? 5 / T : 1; segs.forEach(sg => { sg.d *= scale; sg.at *= scale; }); g._plan = { segs, T: T * scale };
      }
      const P2 = g._plan, t = ((now - t0) / 1000) % P2.T;
      let sg = P2.segs[0]; for (const x of P2.segs) if (t >= x.at) sg = x;
      const f = Math.min(1, Math.max(0, (t - sg.at) / sg.d)); let want = f * sg.len, pt = sg.r.pts[0];
      for (let i = 1; i < sg.r.pts.length; i++) { const a = sg.r.pts[i-1], b = sg.r.pts[i], l = Math.hypot(b[0]-a[0], b[1]-a[1]); if (want <= l || i === sg.r.pts.length - 1) { const u = l ? Math.min(1, want / l) : 1; pt = [a[0] + (b[0]-a[0])*u, a[1] + (b[1]-a[1])*u]; break; } want -= l; }
      g.setAttribute('transform', 'translate(' + pt[0].toFixed(2) + ' ' + pt[1].toFixed(2) + ')');
    });
    runnerRaf = requestAnimationFrame(step);
  };
  runnerRaf = requestAnimationFrame(step);
}
function blockLine(b){
  const parts = [];
  parts.push((b.sets > 1 ? b.sets + ' × ' : '') + (b.reps||1) + ' × ' + (b.distance_m ? b.distance_m + ' m' : fmt(b.work_s)));
  if (b.distance_m && b.work_s) parts.push('cilj ' + b.work_s + ' s');
  if (b.intensity_hr) parts.push(b.intensity_hr);
  if (b.rest_s) parts.push('odmor ' + (b.rest_s >= 60 ? fmt(b.rest_s) : b.rest_s + ' s') + (b.rest_type_hr ? ' (' + b.rest_type_hr + ')' : ''));
  if (b.sets > 1 && b.set_rest_s) parts.push('između serija ' + fmt(b.set_rest_s));
  return parts.join(' • ');
}
VIEWS.field = function(t){
  const f = S.field[t.id];
  const akt = Object.values(S.pr).find(p => p.home === 'aktivacija');
  if (!f) return '<div class="view gut">' + topbar(backBtn()) + '<div class="empty">Ovaj trening više ne postoji.</div></div>';
  const spec = (window.PITCH || {})[f.id];
  return '<div class="view gut">' + topbar(backBtn()) +
    '<h1 class="h1">' + esc(f.name_hr) + '</h1>' +
    '<div style="display:flex;gap:8px;margin:12px 17px 0;flex-wrap:wrap"><span class="tag">'+esc(f.goal_hr)+'</span><span class="tag">'+fieldMin(f)+' min</span>' + (f.week ? '<span class="tag">'+f.week+'. tjedan'+(f.dayHr ? ' · ' + esc(f.dayHr) : '')+'</span>' : '') + '</div>' +
    (spec ? '<figure class="pitch">' + pitchSvg(spec) + '<figcaption><div class="lgrow">' + pitchLegend(spec) + '</div>' + (spec.caption ? '<span>' + esc(spec.caption) + '</span>' : '') + '</figcaption></figure>' : '') +
    (f.summary_hr ? '<p style="margin:16px 17px 0;font-size:16px;line-height:24px;color:var(--text-body)">'+esc(f.summary_hr)+'</p>' : '') +
    (f.when_hr ? '<p class="sub" style="margin-top:10px">U predsezonskom planu: '+esc(f.when_hr)+'</p>' : '') +
    (f.how_hr && f.how_hr.length ? '<div class="stack" style="gap:8px;margin:14px 17px 0">' + f.how_hr.map((s, i) => '<div class="bul num"><i>'+(i+1)+'</i><span>'+esc(s)+'</span></div>').join('') + '</div>' : '') +
    '<div style="margin-top:18px">' + daysPicker('fieldDays', f.id, f.days) + '</div>' +
    '<div class="stack" style="gap:16px;margin:20px 17px 0">' +
      (f.equipment_hr ? '<div class="feat">'+I.bars+'<span>'+esc(f.equipment_hr)+'</span></div>' : '') +
      (f.warmup_hr ? '<div class="feat">'+I.clock+'<span>Zagrijavanje: '+esc(f.warmup_hr)+'</span></div>' : '') +
    '</div>' +
    (akt ? '<div class="list" style="margin-top:18px"><button class="row" data-a="openPr" data-id="'+esc(akt.id)+'" style="min-height:64px"><span class="thumb" style="width:56px;height:56px">'+pathIcon(I.rope,24)+'</span><span class="tx"><span class="t">Prvo zagrijavanje: '+esc(akt.name)+'</span><span class="m"><span>'+protoMin(akt)+' min</span></span></span>'+I.chev+'</button></div>' : '') +
    '<h2 class="h2">Blokovi</h2>' +
    '<div class="list" style="margin-top:14px">' + (f.blocks||[]).map((b,i) => '<div class="blk"><span class="no">'+(i+1)+'</span><span class="bt"><b>'+esc(b.label_hr)+'</b><span>'+esc(blockLine(b))+'</span>'+(b.cue_hr?'<span style="color:var(--text-2)">'+esc(b.cue_hr)+'</span>':'')+'</span></div>').join('') + '</div>' +
    (f.cooldown_hr ? '<p style="margin:18px 17px 0;font-size:14px;line-height:21px;color:var(--text-2)">Hlađenje: '+esc(f.cooldown_hr)+'</p>' : '') +
    '<p style="margin:18px 17px 0;font-size:14px;line-height:21px;color:var(--text-2)">Izvor: ' + (f.source_url ? '<a href="'+esc(f.source_url)+'" target="_blank" rel="noopener">'+esc(f.source_title || 'STATSports')+'</a>' : esc(f.source_title || 'STATSports')) + (spec ? ' · nacrt je vlastiti prikaz prema izvoru' : '') + '</p>' +
    '<div style="height:20px"></div></div>' +
    '<div class="footer gut"><button class="btn" data-a="startField" data-id="'+esc(f.id)+'">Krenimo!</button></div>';
};

/* ---------- player ---------- */
let P = null, ticker = null, audioCtx = null, wakeLock = null;
function ensureAudio(){ try { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); if (audioCtx.state === 'suspended') audioCtx.resume(); } catch(e){} }
function beep(freq, ms, vol){
  if (!S.settings.sound || !audioCtx) return;
  try { const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.frequency.value = freq; o.type = 'sine'; g.gain.value = vol || 0.18; o.connect(g); g.connect(audioCtx.destination); const t0 = audioCtx.currentTime; g.gain.setValueAtTime(vol||0.18, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + ms/1000); o.start(t0); o.stop(t0 + ms/1000 + 0.02); } catch(e){}
}
function buzz(p){ try { if (navigator.vibrate) navigator.vibrate(p); } catch(e){} }
async function keepAwake(on){
  try { if (on && 'wakeLock' in navigator && !wakeLock) { wakeLock = await navigator.wakeLock.request('screen'); wakeLock.addEventListener('release', () => { wakeLock = null; }); } if (!on && wakeLock) { await wakeLock.release(); wakeLock = null; } } catch(e){ wakeLock = null; }
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && P && !P.done) keepAwake(true); });

// Consecutive items that share "ss" form a superset (2 exercises) or a circuit (3+): one set of each in turn,
// then the last exercise's rest closes the round. Everything else runs set after set as before.
function groupsOf(items){
  const out = [];
  items.forEach((it, i) => { const last = out[out.length - 1]; if (it.ss && last && last.ss === it.ss) last.idx.push(i); else out.push({ ss: it.ss || null, idx: [i] }); });
  out.forEach(g => { if (g.idx.length < 2) g.ss = null; });
  return out;
}
function ssLetters(items){
  const lab = {}; let n = 0;
  groupsOf(items).forEach(g => { if (!g.ss) return; const L = String.fromCharCode(65 + n++); g.idx.forEach((i, k) => lab[i] = { L, k: k + 1, size: g.idx.length }); });
  return lab;
}
// keeps supersets well-formed after moving or removing: a key used by a single item is dropped, a key split in two becomes two groups
function normGroups(items){
  const seen = {};
  items.forEach((it, i) => {
    if (!it.ss) return;
    const prev = items[i - 1];
    if (prev && prev.ss === it.ss) return;
    if (seen[it.ss]) { const old = it.ss, nk = uid('s'); for (let k = i; k < items.length && items[k].ss === old; k++) items[k].ss = nk; }
    seen[it.ss] = 1;
  });
  groupsOf(items).forEach(g => { if (!g.ss) g.idx.forEach(i => { delete items[i].ss; }); });
  return items;
}
function stepsFromItems(items){
  const steps = []; const ss = S.settings.switchSec, ts = S.settings.transSec;
  const lab = ssLetters(items);
  const exOf = it => S.ex[it.exId] || { name:'Vježba', steps:[] };
  const pushSet = (it, base) => {
    if (it.measure === 'time') {
      if (it.sides) { steps.push(Object.assign({}, base, { kind:'work', dur:it.sec, side:'Lijeva strana' })); steps.push(Object.assign({}, base, { kind:'switch', dur:ss, side:'Promjena strane' })); steps.push(Object.assign({}, base, { kind:'work', dur:it.sec, side:'Desna strana' })); }
      else steps.push(Object.assign({}, base, { kind:'work', dur:it.sec }));
    } else steps.push(Object.assign({}, base, { kind:'manual', side: repsOf(it, base.set) + ' ponavljanja' + (it.sides ? ' po strani' : '') + (it.note ? ' · ' + it.note : '') }));
  };
  steps.push({ kind:'prep', dur:5, g:0, title:'Pripremi se', label:'Kreće za' });
  groupsOf(items).forEach((grp, gi) => {
    const first = grp.idx[0];
    if (gi > 0) steps.push({ kind:'rest', dur:ts, label:'Sljedeće', trans:true, g:first, e:exOf(items[first]), it:items[first], set:1, ss: lab[first] });
    if (!grp.ss) {
      const g = first, it = items[g], e = exOf(it), n = it.sets || 1;
      for (let s = 1; s <= n; s++) {
        const base = { g, e, it, set: s };
        pushSet(it, base);
        if (s < n && it.rest) steps.push(Object.assign({}, base, { kind:'rest', dur:it.rest, label:'Odmor' }));
      }
      return;
    }
    const R = Math.max.apply(null, grp.idx.map(i => items[i].sets || 1));
    for (let r = 1; r <= R; r++) {
      const active = grp.idx.filter(i => (items[i].sets || 1) >= r);
      active.forEach((g, k) => {
        const it = items[g], e = exOf(it);
        const base = { g, e, it, set: r, round: r, rounds: R, ss: lab[g] };
        pushSet(it, base);
        if (k === active.length - 1) { if (r < R && it.rest) steps.push(Object.assign({}, base, { kind:'rest', dur:it.rest, label:'Odmor nakon kruga' })); }
        else {
          const nx = items[active[k + 1]], ne = exOf(nx);
          if (it.rest) steps.push(Object.assign({}, base, { kind:'rest', dur:it.rest, label:'Sljedeće: ' + ne.name }));
          else if (nx.measure === 'time') steps.push(Object.assign({}, base, { kind:'switch', dur:ss, side:'Sljedeće: ' + ne.name, nextEx:true }));
        }
      });
    }
  });
  return steps;
}
function stepsFromField(f){
  // In a set: rest_s after every rep but the last. Between sets: set_rest_s (else rest_s).
  // After a block's final rep: its rest_s is the transition to the next block. Nothing after the session's final rep.
  const steps = [{ kind:'prep', dur:10, g:0, title:'Pripremi se', label:'Kreće za' }];
  const blocks = f.blocks || [];
  blocks.forEach((b, g) => {
    const sets = b.sets||1, reps = b.reps||1;
    for (let s = 1; s <= sets; s++) for (let r = 1; r <= reps; r++) {
      steps.push({ kind:'work', dur: b.work_s || 30, g, b, set:s, rep:r, sets, reps });
      const lastRep = r === reps, lastSet = s === sets, lastBlock = g === blocks.length - 1;
      if (!lastRep && b.rest_s) steps.push({ kind:'rest', dur:b.rest_s, g, b, set:s, rep:r, sets, reps, label:'Odmor' + (b.rest_type_hr ? ' · ' + b.rest_type_hr : '') });
      else if (lastRep && !lastSet && (b.set_rest_s || b.rest_s)) steps.push({ kind:'rest', dur: b.set_rest_s || b.rest_s, g, b, set:s, rep:r, sets, reps, label:'Odmor između serija' });
      else if (lastRep && lastSet && !lastBlock && b.rest_s) steps.push({ kind:'rest', dur: b.rest_s, g, b, set:s, rep:r, sets, reps, label:'Odmor' + (b.rest_type_hr ? ' · ' + b.rest_type_hr : '') });
    }
  });
  return steps;
}
function startPlayer(cfg){
  ensureAudio();
  P = Object.assign({ i:0, paused:false, done:false, endAt:0, left:0, startedAt: Date.now(), lastBeep:null }, cfg);
  if (!P.steps.length) return;
  enterStep(0);
  S.stack.push({ v:'play' }); S.sheet = null; render();
  keepAwake(true);
  clearInterval(ticker); ticker = setInterval(tick, 200);
}
function enterStep(i){
  P.i = i; P.lastBeep = null;
  const st = P.steps[i];
  if (!st) { finish(); return; }
  P.left = st.dur || 0; P.endAt = st.dur ? Date.now() + st.dur*1000 : 0;
  if (st.kind === 'work' || st.kind === 'manual') { beep(880, 260, 0.22); buzz(120); }
  else if (st.kind === 'switch') { beep(660, 200); buzz([80,60,80]); }
  else if (st.kind === 'rest') { beep(520, 220); buzz(60); }
}
function remaining(){ const st = P.steps[P.i]; if (!st || !st.dur) return 0; return P.paused ? P.left : Math.max(0, (P.endAt - Date.now())/1000); }
function tick(){
  if (!P || P.done || P.paused) return;
  const st = P.steps[P.i]; if (!st) return;
  if (st.dur) {
    const r = remaining(); const whole = Math.ceil(r);
    if (whole <= 3 && whole >= 1 && P.lastBeep !== whole) { P.lastBeep = whole; beep(740, 120, 0.14); }
    if (r <= 0) { enterStep(P.i + 1); if (!P.done) paintPlayer(true); return; }
  }
  paintPlayer(false);
}
function finish(){
  P.done = true; clearInterval(ticker); keepAwake(false);
  beep(988, 420, 0.22); buzz([120,80,120]);
  P.secs = Math.round((Date.now() - P.startedAt)/1000);
  if (top().v === 'play') render();
}
// Skipping moves by "slots": a whole exercise when it stands alone, one exercise of one round inside a superset.
function slotOf(st){ if (!st) return ''; if (st.kind === 'prep') return 'prep'; if (st.trans) return 't' + st.g; return st.ss ? st.g + ':' + st.set : 'g' + st.g; }
const isWork = s => s && (s.kind === 'work' || s.kind === 'manual');
function slotFirstWork(i){
  const sl = slotOf(P.steps[i]); let j = i;
  while (j > 0 && slotOf(P.steps[j - 1]) === sl) j--;
  while (j < P.steps.length - 1 && slotOf(P.steps[j]) === sl && !isWork(P.steps[j])) j++;
  return slotOf(P.steps[j]) === sl && isWork(P.steps[j]) ? j : i;
}
function jump(dir){
  const i = P.i, st = P.steps[i]; if (!st) return;
  if (dir > 0) {
    const sl = slotOf(st);
    const k = P.steps.findIndex((s, x) => x > i && isWork(s) && slotOf(s) !== sl);
    if (k === -1) { finish(); return; }
    enterStep(k);
  } else {
    const j = slotFirstWork(i);
    if (isWork(P.steps[j]) && j < i) enterStep(j);
    else { let k = j - 1; while (k >= 0 && !isWork(P.steps[k])) k--; enterStep(k < 0 ? 0 : slotFirstWork(k)); }
  }
  P.paused = false; render();
}
function tapRing(){
  const st = P.steps[P.i]; if (!st) return;
  ensureAudio();
  if (st.kind === 'manual') { enterStep(P.i + 1); render(); return; }
  if (st.kind === 'rest' && !st.trans) { enterStep(P.i + 1); render(); return; }
  if (P.paused) { P.paused = false; P.endAt = Date.now() + P.left*1000; keepAwake(true); }
  else { P.left = remaining(); P.paused = true; }
  paintPlayer(true);
}
function curView(){
  const st = P.steps[P.i] || {};
  const nextWork = P.steps.slice(P.i + 1).find(s => s.kind === 'work' || s.kind === 'manual');
  const v = { st, title:'', meta:'', hint:'', badge:'', big:'', ringFrac:1, ringColor:'var(--accent)', fieldPanel:null, e:null };
  if (P.mode === 'field') {
    const b = st.b || (nextWork && nextWork.b);
    const blocks = (P.f.blocks||[]).length;
    v.title = b ? b.label_hr : P.title;
    v.meta = b ? 'Blok ' + ((st.g||0)+1) + '/' + blocks + (st.rep ? ' • ponavljanje ' + st.rep + '/' + st.reps + (st.sets > 1 ? ' • serija ' + st.set + '/' + st.sets : '') : '') : '';
    const work = st.kind === 'work';
    v.fieldPanel = { cls: work ? 'work' : 'rest', ph: st.kind === 'prep' ? 'PRIPREMI SE' : work ? 'RAD' : 'ODMOR',
      dist: work && b && b.distance_m ? b.distance_m + ' m' : '', sm: work && b ? (b.intensity_hr || '') : (nextWork && nextWork.b ? 'Sljedeće: ' + (nextWork.b.distance_m ? nextWork.b.distance_m + ' m' : fmt(nextWork.b.work_s)) + (nextWork.b.intensity_hr ? ' • ' + nextWork.b.intensity_hr : '') : '') };
    v.hint = work && b && b.cue_hr ? b.cue_hr : (st.kind === 'rest' ? (st.label || 'Odmor') : '');
  } else {
    const e = st.e || (nextWork && nextWork.e); v.e = e;
    const it = st.it || (nextWork && nextWork.it);
    const groups = P.items.length;
    const lab = st.trans ? (nextWork && nextWork.ss) : st.ss;
    v.title = st.kind === 'prep' ? (e ? e.name : P.title) : (st.trans ? 'Sljedeće: ' + (nextWork && nextWork.e ? nextWork.e.name : '') : (e ? e.name : ''));
    v.meta = it ? ((lab ? lab.L + lab.k + ' • ' : (st.trans ? (nextWork.g+1) : (st.g+1)) + '/' + groups + ' • ') + dose(it) + (e && e.cat ? ' • ' + e.cat : '')) : '';
    const setTxt = st.ss ? groupWord(st.ss.size) + ' ' + st.ss.L + ' • krug ' + st.round + '/' + st.rounds : 'Serija ' + st.set + '/' + (it ? it.sets : 1);
    v.badge = st.kind === 'manual' ? setTxt + ' • ' + st.side
      : st.nextEx ? st.side
      : ((it && st.set && !st.trans && (st.ss || (it.measure === 'time' && (it.sets||1) > 1)) ? setTxt + (st.side ? ' • ' : '') : '') + (st.side || ''));
    v.hint = st.kind === 'manual' ? (it.sides ? 'Odradi obje strane pa dodirni krug' : 'Dodirni krug kad završiš seriju')
      : st.kind === 'rest' && !st.trans ? (st.label && st.label !== 'Odmor' ? st.label + ' • dodirni krug da preskočiš' : 'Odmor • dodirni krug da preskočiš')
      : st.nextEx ? 'Prijeđi na sljedeću vježbu'
      : st.kind === 'switch' ? 'Namjesti se za drugu stranu'
      : st.kind === 'prep' ? 'Namjesti se'
      : 'Dodirni krug za pauzu';
  }
  if (st.kind === 'manual') { const tot = st.ss ? st.rounds : (st.it ? st.it.sets : 1); v.big = st.set + '/' + tot; v.ringFrac = (st.set - 1) / tot; }
  else { const r = remaining(); v.big = r >= 60 ? fmt(r) : String(Math.ceil(r)); v.ringFrac = st.dur ? r / st.dur : 0; }
  if (st.kind === 'switch' || st.kind === 'rest' || st.kind === 'prep') v.ringColor = 'var(--muted)';
  return v;
}
/* ---------- progression: the "2-for-2" rule (NSCA) with double progression for coarse weight jumps ---------- */
const DB_STEPS = [2.5, 5, 7.5, 10, 15, 20];   // your dumbbell pairs
const LOWER_ZONES = ['Kvadriceps','Gluteus','Gluteus medius','Stražnja loža','Kuk','Aduktori','Lisni mišić'];
const PROG_CATS = { Snaga:1, Eksplozivnost:1, Trup:1 };
const PROG_REFS = [
  { t:'Rønnestad i sur. (2011): u sezoni jedan trening snage tjedno zadržava snagu i sprint', url:'https://pubmed.ncbi.nlm.nih.gov/21873897/' },
  { t:'ACSM (2009): +2–10 % opterećenja kad dva treninga zaredom napraviš 1–2 ponavljanja više', url:'https://doi.org/10.1249/MSS.0b013e3181915670' },
  { t:'Plotkin i sur. (2022): dodavanje ponavljanja jednako je učinkovito kao dodavanje kilograma', url:'https://peerj.com/articles/14142/' }
];
function progKind(e, it){
  if (it.measure === 'time') return 'time';
  const eq = exEquip(e);
  if (it.kg > 0 && (eq.indexOf('Šipka') !== -1 || eq.indexOf('Landmine') !== -1 || /trap bar/i.test(e.equipment || ''))) return 'bar';
  if (it.kg > 0 && eq.indexOf('Bučice') !== -1) return 'db';
  if (eq.indexOf('Girja') !== -1) return 'kb';
  return 'reps';
}
// the next dose after two easy sessions in a row; item null means "time for a harder variation"
function nextDose(e, it){
  const k = progKind(e, it), n = Object.assign({}, it);
  const eq = exEquip(e);
  if (k === 'reps' && !(it.kg > 0) && (eq.indexOf('Šipka') !== -1 || eq.indexOf('Landmine') !== -1 || eq.indexOf('Bučice') !== -1)) return { item:null, text:'Upiši kilograme u uređivanju protokola pa ću ih povećavati' };
  const r0 = it.r0 || it.reps || 10, r1 = it.r1 || Math.min(Math.max(r0 + 4, 6), 20);
  const moreReps = () => { n.reps = (it.reps || r0) + 1; n.r0 = r0; n.r1 = r1; return { item:n, text: (it.reps || r0) + ' → ' + n.reps + ' ponavljanja' }; };
  if (k === 'time') { const cap = it.cap || 60; if ((it.sec || 30) >= cap) return { item:null, text:'Dosegnuo si ' + cap + ' s: prijeđi na težu varijantu' }; n.sec = Math.min(cap, (it.sec || 30) + 5); return { item:n, text:(it.sec || 30) + ' → ' + n.sec + ' s' }; }
  if (k === 'bar') { const lower = (e.zones || []).some(z => LOWER_ZONES.indexOf(z) !== -1); n.kg = Math.round((it.kg + (lower ? 5 : 2.5)) * 100) / 100; return { item:n, text: fmtKg(it.kg) + ' → ' + fmtKg(n.kg) }; }
  if (k === 'db') {
    if ((it.reps || r0) < r1) return moreReps();
    const nx = DB_STEPS.find(w => w > it.kg);
    if (!nx) return { item:null, text:'Najteže bučice su svladane: dodaj seriju ili težu varijantu' };
    n.kg = nx; n.reps = r0; n.r0 = r0; n.r1 = r1; return { item:n, text: fmtKg(it.kg) + ' → ' + fmtKg(nx) + ', opet ' + r0 + ' ponavljanja' };
  }
  if (k === 'kb') {
    if ((it.reps || r0) < r1) return moreReps();
    if ((it.sets || 1) < 5) { n.sets = (it.sets || 1) + 1; n.reps = r0; n.r0 = r0; n.r1 = r1; return { item:n, text:(it.sets || 1) + ' → ' + n.sets + ' serije, opet ' + r0 + ' ponavljanja' }; }
    return { item:null, text:'S girjom od 20 kg dalje ide teža varijanta' };
  }
  if ((it.reps || r0) < r1) return moreReps();
  return { item:null, text:'Gornja granica ponavljanja: prijeđi na težu varijantu' };
}
// Exercises asked about at the end of a session. Programme sessions (e.g. TAE) are only recorded: their weeks set the doses.
function progCandidates(){
  if (!P || P.mode !== 'ex' || !P.ref || P.ref.kind !== 'protocol') return [];
  const p = S.pr[P.ref.id]; if (!p) return [];
  P.answers = P.answers || {}; P.lastReps = P.lastReps || {};
  const out = [];
  (p.items || []).forEach((it, j) => {
    const e = S.ex[it.exId]; const was = P.items[j];
    if (!e || !was || was.exId !== it.exId) return;
    if (!PROG_CATS[e.cat] && !(it.kg > 0)) return;
    out.push({ j, e, it, prog: !!p.program, next: nextDose(e, it) });
  });
  return out;
}
const progN = () => S.settings.progN === 3 ? 3 : 2;
// counts sessions with every set done (ok) or not (fail); doses change only when you accept a suggestion
function applyProgress(){
  const cands = progCandidates(); if (!cands.length) return [];
  const p = S.pr[P.ref.id]; const n = clone(p); delete n.id; const news = [];
  cands.forEach(c => {
    if (c.prog) return;
    const it = n.items[c.j];
    if (P.answers[c.j] !== false) { it.ok = (it.ok || 0) + 1; it.fail = 0; if (it.ok === progN() && c.next.item) news.push(c.e.name); }
    else { it.ok = 0; it.fail = (it.fail || 0) + 1; it.snoozeOk = 0; }
  });
  n.updatedAt = Date.now();
  S.pr[P.ref.id] = Object.assign({ id: P.ref.id }, n);
  return news;
}
function doneMsg(c){
  const N = progN(), it = c.it;
  if (c.prog) return P.answers[c.j] === false ? 'Zabilježeno' : '';
  if (P.answers[c.j] === false) return it.prev && (it.fail || 0) + 1 >= 2 ? 'Dvaput zaredom: na stranici Napredak možeš vratiti ' + doseBase(it.prev) : 'Zabilježeno: ostaje ' + doseBase(it) + ', probaj opet';
  const ok = (it.ok || 0) + 1;
  if (ok >= N) return c.next.item ? 'Spremno: prijedlog ' + c.next.text + ' čeka te na stranici Napredak' : c.next.text;
  return ok + '/' + N + ' · još ' + (N - ok) + ' ' + plural(N - ok, 'ovakav trening', 'ovakva treninga', 'ovakvih treninga');
}
/* ---------- the Progress tab ---------- */
function progSuggestions(){
  const N = progN(), out = [];
  Object.values(S.pr).forEach(p => { if (p.program) return; (p.items || []).forEach((it, j) => {
    const e = S.ex[it.exId]; if (!e) return;
    const eq = exEquip(e), needsKg = !(it.kg > 0) && it.measure !== 'time' && (eq.indexOf('Šipka') !== -1 || eq.indexOf('Landmine') !== -1 || eq.indexOf('Bučice') !== -1);
    if (needsKg) { if ((it.ok || 0) + (it.fail || 0) > 0) out.push({ kind:'nokg', p, j, e, it }); return; }
    if (it.prev && (it.fail || 0) >= 2) out.push({ kind:'revert', p, j, e, it });
    else if ((it.ok || 0) >= N && (it.ok || 0) > (it.snoozeOk || 0)) { const nd = nextDose(e, it); out.push({ kind: nd.item ? 'up' : 'variant', p, j, e, it, nd }); }
    else if ((it.ok || 0) > 0 && (it.ok || 0) < N) out.push({ kind:'way', p, j, e, it });
  }); });
  return out;
}
const e1rm = (kg, reps) => kg * (1 + reps / 30);   // Epley estimate of the one-rep max
function progHistory(){
  const by = {};
  S.log.slice().reverse().forEach(l => (l.items || []).forEach(x => { (by[x.exId] = by[x.exId] || []).push(Object.assign({ at: l.at }, x)); }));
  return by; // oldest first per exercise
}
function sugCard(x){
  const pr = esc(x.p.id), j = x.j;
  if (x.kind === 'revert') return '<div class="lift warn"><div class="top"><b>'+esc(x.e.name)+'</b><span>'+esc(dose(x.it))+'</span></div><div class="why">Dvaput zaredom nisi stigao sve. Prerano je za ovu težinu.</div><div class="acts"><button class="bt amber" data-a="sugRevert" data-p="'+pr+'" data-j="'+j+'">Vrati na '+esc(doseBase(x.it.prev))+'</button><button class="bt ghost" data-a="sugRetry" data-p="'+pr+'" data-j="'+j+'">Probat ću opet</button></div><div class="pfrom">'+esc(x.p.name)+'</div></div>';
  if (x.kind === 'variant') return '<div class="lift go"><div class="top"><b>'+esc(x.e.name)+'</b><span>'+esc(dose(x.it))+'</span></div><div class="why">'+esc(x.nd.text)+'.</div><div class="acts"><button class="bt ghost" data-a="sugLater" data-p="'+pr+'" data-j="'+j+'">U redu</button></div><div class="pfrom">'+esc(x.p.name)+'</div></div>';
  if (x.kind === 'up') return '<div class="lift go"><div class="top"><b>'+esc(x.e.name)+'</b><span>'+esc(dose(x.it))+'</span></div><div class="why">'+progN()+' treninga zaredom sa svim serijama. Prijedlog: '+esc(x.nd.text)+'.</div><div class="acts"><button class="bt" data-a="sugUp" data-p="'+pr+'" data-j="'+j+'">Prihvati: '+esc(doseBase(x.nd.item))+'</button><button class="bt ghost" data-a="sugLater" data-p="'+pr+'" data-j="'+j+'">Još ne</button></div><div class="pfrom">'+esc(x.p.name)+'</div></div>';
  const N = progN(), ok = x.it.ok || 0;
  return '<div class="lift"><div class="top"><b>'+esc(x.e.name)+'</b><span>'+esc(dose(x.it))+'</span></div><div class="pips">'+Array.from({ length: N }, (_, k) => '<i class="pip'+(k < ok ? ' on' : '')+'"></i>').join('')+'<span>'+ok+'/'+N+' · '+esc(x.p.name)+'</span></div></div>';
}
/* ---------- dosing: goal of the period, football week, your loads ---------- */
const GOALS = {
  snaga:         { name:'Snaga',         reps:[4, 6],   target:5,  sets:4, rest:150, desc:'4–6 pon. · 85–100 % · 3–5 serija · odmor 2–3 min' },
  hipertrofija:  { name:'Hipertrofija',  reps:[8, 12],  target:10, sets:3, rest:90,  desc:'8–12 pon. · 70–80 % · 3–4 serije · odmor 60–90 s' },
  izdrzljivost:  { name:'Izdržljivost',  reps:[12, 15], target:12, sets:3, rest:45,  desc:'12–15+ pon. · 65–70 % · 2–3 serije · odmor 30–60 s' },
  eksplozivnost: { name:'Eksplozivnost', reps:[3, 5],   target:4,  sets:4, rest:150, light:[.3, .6], desc:'3–5 pon. · 30–60 % · maksimalna brzina · puni odmor' }
};
const DAYS_IN = ['u ponedjeljak','u utorak','u srijedu','u četvrtak','u petak','u subotu','u nedjelju'];
const pctFor = r => 1 / (1 + r / 30);               // share of the max you can lift r times (inverse Epley)
function loaded(e){ const eq = exEquip(e); return ['Šipka','Landmine','Bučice','Girja'].some(t => eq.indexOf(t) !== -1); }
function roundLoad(e, kg){
  const eq = exEquip(e);
  if (eq.indexOf('Bučice') !== -1 && eq.indexOf('Šipka') === -1 && eq.indexOf('Landmine') === -1) { const ok = DB_STEPS.filter(w => w <= kg + .01); return ok.length ? ok[ok.length - 1] : DB_STEPS[0]; }
  if (eq.indexOf('Girja') !== -1 && eq.indexOf('Šipka') === -1) return 20;
  return Math.max(0, Math.floor(kg / 2.5) * 2.5);
}
// best estimated max from sets you actually did in the last 8 weeks
function bestE1(exId){
  let best = 0; const since = Date.now() - 56 * DAY_MS;
  S.log.forEach(l => { if (l.at < since) return; (l.items || []).forEach(x => {
    if (x.exId !== exId || !(x.kg > 0) || x.measure === 'time') return;
    const reps = x.done === false ? (x.lastReps || 0) : (x.reps || 0);
    if (reps > 0) best = Math.max(best, e1rm(x.kg, reps));
  }); });
  return best;
}
function goalLoad(e, e1, g, reps){ const G = g ? GOALS[g] : null; return roundLoad(e, G && G.light ? e1 * (G.light[0] + G.light[1]) / 2 : e1 * pctFor(reps || (G ? G.target : 10))); }
// what a goal would change in a protocol (loaded strength exercises only)
function goalPlan(p, g){
  const G = GOALS[g], items = clone(p.items || []), changes = [];
  items.forEach((it, j) => {
    const e = S.ex[it.exId];
    if (!e || it.measure === 'time' || !loaded(e)) return;
    const before = doseBase(it), e1 = bestE1(e.id);
    it.reps = G.target; it.r0 = G.reps[0]; it.r1 = G.reps[1]; it.sets = G.sets; delete it.repsList;
    const linked = j < items.length - 1 && it.ss && items[j + 1].ss === it.ss;
    it.rest = linked ? 0 : G.rest;
    if (e1 > 0) it.kg = goalLoad(e, e1, g);
    it.ok = 0; it.fail = 0; it.snoozeOk = 0;
    if (doseBase(it) !== before || it.rest !== (p.items[j].rest || 0)) changes.push({ e, from: before, to: doseBase(it), est: !(e1 > 0) });
  });
  return { items, changes };
}
// programme sessions keep their reps; only the kilograms are filled from your loads
function kgPlan(p){
  const items = clone(p.items || []), changes = [];
  items.forEach(it => { const e = S.ex[it.exId]; if (!e || it.measure === 'time' || !loaded(e)) return; const e1 = bestE1(e.id); if (!(e1 > 0)) return;
    const reps = Math.max.apply(null, (it.repsList || [it.reps || 10])); const kg = goalLoad(e, e1, null, reps);
    if (kg !== it.kg) { changes.push({ e, from: doseBase(it), to: doseBase(Object.assign({}, it, { kg })) }); it.kg = kg; } });
  return { items, changes };
}
function weekAdvice(){
  const b = S.settings.ballN != null ? S.settings.ballN : 3, m = S.settings.matchDay != null ? S.settings.matchDay : -1;
  const dn = i => DAYS_IN[(i + 7) % 7];
  if (m < 0) { const n = b <= 2 ? 3 : b <= 4 ? 2 : 1; return 'Bez utakmice (pripreme ili pauza): ' + n + ' ' + plural(n, 'trening', 'treninga', 'treninga') + ' u teretani tjedno, s barem jednim danom između.'; }
  const n = b >= 4 ? 1 : 2;
  return 'Preporuka: ' + n + ' ' + plural(n, 'trening', 'treninga', 'treninga') + ' u teretani. Teži najkasnije ' + dn(m - 4) + ' (4 dana prije utakmice)' + (n === 2 ? ', lakši s eksplozivnošću ' + dn(m - 2) : '') +
    '. Dan prije utakmice (' + DAYNAMES[(m + 6) % 7] + ') bez teških nogu, samo aktivacija; dan poslije (' + DAYNAMES[(m + 1) % 7] + ') mobilnost i oporavak. U sezoni je jedan trening snage tjedno dovoljan da zadržiš snagu i brzinu.';
}
function dosingHtml(){
  const g = S.settings.goal || null, b = S.settings.ballN != null ? S.settings.ballN : 3, m = S.settings.matchDay != null ? S.settings.matchDay : -1;
  const lifts = Object.values(S.ex).filter(e => loaded(e)).map(e => ({ e, v: bestE1(e.id) })).filter(x => x.v > 0).sort((a, b2) => b2.v - a.v).slice(0, 8);
  const rng = (e, v, k) => { const G = GOALS[k]; const lo = G.light ? goalLoad(e, v, k) : roundLoad(e, v * pctFor(G.reps[1])), hi = G.light ? lo : roundLoad(e, v * pctFor(G.reps[0])); return lo === hi ? String(lo).replace('.', ',') : String(lo).replace('.', ',') + '–' + String(hi).replace('.', ','); };
  return '<div class="psec"><h2>Cilj ovog razdoblja</h2><span>za vježbe s opterećenjem</span></div><div class="goal">' +
    Object.keys(GOALS).map(k => '<button class="'+(g === k ? 'on' : '')+'" data-a="setGoal" data-v="'+k+'" aria-pressed="'+(g === k)+'"><b>'+GOALS[k].name+'</b><span>'+esc(GOALS[k].desc)+'</span></button>').join('') + '</div>' +
    (g ? '<p class="sub" style="margin:10px 2px 0;line-height:19px">Otvori trening u teretani: dobit ćeš prijedlog serija, ponavljanja, odmora i kilograma za cilj „'+esc(GOALS[g].name)+'”, koji potvrđuješ.</p>' : '') +
    '<div class="psec"><h2>Nogometni tjedan</h2><span>ovaj tjedan</span></div><div class="chart">' +
      '<div class="prow" style="border:0;min-height:52px"><span class="k">Treninzi s loptom</span><div class="step"><button class="sbtn" data-a="setBall" data-d="-1" aria-label="Manje">−</button><b>'+b+'</b><button class="sbtn" data-a="setBall" data-d="1" aria-label="Više">+</button></div></div>' +
      '<span class="label" style="padding:4px 0 8px">Utakmica</span><div class="drow" style="grid-template-columns:1.6fr repeat(7,1fr)"><button class="dchip" data-a="setMatch" data-v="-1" aria-pressed="'+(m < 0)+'">Nema</button>' + DAYS.map((L, i) => '<button class="dchip" data-a="setMatch" data-v="'+i+'" aria-pressed="'+(m === i)+'" aria-label="'+DAYNAMES[i]+'">'+L+'</button>').join('') + '</div>' +
      '<div class="advice">'+esc(weekAdvice())+'</div></div>' +
    '<div class="psec"><h2>Moje težine</h2><span>kg, iz odrađenih serija</span></div>' +
    (lifts.length ? '<div class="chart" style="padding-top:8px;padding-bottom:4px;overflow-x:auto"><table class="kg"><tr><th>Vježba</th><th>Snaga</th><th>Hipertr.</th><th>Izdrž.</th></tr>' +
      lifts.map(x => '<tr><td><b>'+esc(x.e.name)+'</b><span>max ≈ '+esc(fmtKg(Math.round(x.v * 2) / 2))+'</span></td>' + ['snaga','hipertrofija','izdrzljivost'].map(k => '<td class="'+(g === k ? 'on' : '')+'">'+rng(x.e, x.v, k)+'</td>').join('') + '</tr>').join('') + '</table></div>'
      : '<p class="sub" style="margin:0 2px;line-height:20px">Kad odradiš trening s upisanim kilogramima, ovdje se iz tvojih serija procijeni maksimum i kilogrami za svaki cilj.</p>') +
    '<p class="sub" style="margin:12px 2px 0;line-height:19px">Odnos ponavljanja i težine kao u TAE tablici i NSCA smjernicama (4–6 pon. ≈ 85–100 %, 6–8 ≈ 80–85 %, 8–10 ≈ 75–80 %, 10–12 ≈ 70–75 %, 12–15 ≈ 65–70 %). Maksimum se procjenjuje iz tvojih serija (Epleyjeva formula), a kilogrami se zaokružuju na ono što možeš staviti: šipka na 2,5 kg, bučice na tvoje parove.</p>';
}
VIEWS.progress = function(){
  const plan = planSlots(), ws = weekStart(Date.now()), wk = weekStatus(ws, plan);
  let sk = plan.length ? streakWeeks(plan) : 0;
  if (!plan.length) for (let w = ws, k = 0; k < 104; w -= WEEK_MS, k++) { if (S.log.some(l => l.at >= w && l.at < w + WEEK_MS)) sk++; else if (w !== ws) break; }
  const thisWeek = S.log.filter(l => l.at >= ws).length;
  const sugs = progSuggestions(), act = sugs.filter(x => x.kind === 'up' || x.kind === 'revert' || x.kind === 'variant'), way = sugs.filter(x => x.kind === 'way');
  const nokg = {}; sugs.filter(x => x.kind === 'nokg').forEach(x => { (nokg[x.p.id] = nokg[x.p.id] || { p: x.p, names: [] }).names.push(x.e.name); });
  const nokgHtml = Object.values(nokg).map(g => '<div class="lift"><div class="top"><b>Upiši početne težine</b><span>'+esc(g.p.name)+'</span></div><div class="why">'+esc(g.names.join(', '))+': bez kilograma ne mogu predložiti povećanje.</div><div class="acts" style="grid-template-columns:1fr"><button class="bt ghost" data-a="editPr" data-id="'+esc(g.p.id)+'">Upiši kilograme</button></div></div>').join('');
  const hist = progHistory();
  const lifts = Object.keys(hist).filter(id => S.ex[id] && hist[id].length >= 2).sort((a, b) => hist[b].length - hist[a].length).slice(0, 4);
  const charts = lifts.map(id => {
    const h = hist[id].slice(-10), useKg = h.some(x => x.kg > 0);
    const val = x => x.measure === 'time' ? (x.sec || 0) : useKg ? (x.kg || 0) : (x.reps || 0) * (x.sets || 1);
    const a = val(h[0]), b = val(h[h.length - 1]), d = Math.round((b - a) * 10) / 10;
    const unit = h[0].measure === 'time' ? ' s' : useKg ? ' kg' : ' pon.';
    return '<div class="chart"><div class="top"><b>'+esc(S.ex[id].name)+'</b><span class="delta'+(d < 0 ? ' neg' : d === 0 ? ' same' : '')+'">'+(d === 0 ? 'bez promjene' : (d > 0 ? '+' : '')+String(d).replace('.', ',')+unit)+'</span></div><div class="sub2">'+esc(doseBase(h[0]))+' → '+esc(doseBase(h[h.length - 1]))+'</div>'+sparkSvg(h.map(val))+'</div>';
  }).join('');
  // records: the best estimated max per exercise, if it was set in the last 30 days
  const prs = Object.keys(hist).map(id => { let best = null; hist[id].forEach(x => { if (!(x.kg > 0) || x.done === false) return; const v = e1rm(x.kg, x.reps || 1); if (!best || v > best.v + .01) best = { v, x }; }); return best && Date.now() - best.x.at < 30 * DAY_MS && hist[id].length > 1 ? { id, best } : null; }).filter(Boolean).slice(0, 4);
  const days = {}; S.log.forEach(l => { const d = new Date(l.at); d.setHours(0,0,0,0); days[d.getTime()] = (days[d.getTime()] || 0) + 1; });
  const start = ws - 11 * WEEK_MS; let heat = '';
  for (let d = 0; d < 7; d++) for (let w = 0; w < 12; w++) { const t = start + w * WEEK_MS + d * DAY_MS; const n = days[t] || 0; heat += '<i class="'+(t > Date.now() ? 'fut' : n >= 2 ? 'l3' : n === 1 ? 'l2' : '')+'"></i>'; }
  const head = '<div class="view gut">' + topbar('', '', 'NAPREDAK') +
    '<h1 class="h1">Napredak</h1>' +
    '<div class="seg" style="margin-top:16px"><button class="chip" data-a="progTab" data-v="pregled" aria-pressed="'+(S.progTab !== 'doziranje')+'" style="height:44px">Pregled</button><button class="chip" data-a="progTab" data-v="doziranje" aria-pressed="'+(S.progTab === 'doziranje')+'" style="height:44px">Doziranje</button></div>';
  if (S.progTab === 'doziranje') return head + dosingHtml() + '<div style="height:20px"></div></div>';
  return head +
    '<div class="stats"><div class="stat"><b>'+(wk.planned ? wk.done + '/' + wk.planned : thisWeek)+'</b><span>'+(wk.planned ? 'treninga ovaj tjedan po planu' : 'treninga ovaj tjedan')+'</span></div><div class="stat"><b>'+sk+'</b><span>'+plural(sk, 'tjedan', 'tjedna', 'tjedana')+(plan.length ? ' zaredom po planu' : ' zaredom s treningom')+'</span></div><div class="stat"><b>'+S.log.length+'</b><span>treninga ukupno</span></div></div>' +
    '<div class="psec"><h2>Prijedlozi</h2><span>ti odlučuješ</span></div>' +
    (act.length ? act.map(sugCard).join('') : '<p class="sub" style="margin:0 2px 10px;line-height:20px">Kad '+progN()+' treninga zaredom odradiš sve serije neke vježbe, ovdje dobiješ prijedlog za veće opterećenje.</p>') + nokgHtml +
    (way.length ? '<div class="psec"><h2>Na putu</h2><span>uvjet: '+progN()+' treninga zaredom</span></div>' + way.map(sugCard).join('') : '') +
    (charts ? '<div class="psec"><h2>Glavne vježbe</h2><span>zadnji treninzi</span></div>' + charts : '') +
    (prs.length ? '<div class="psec"><h2>Rekordi</h2><span>zadnjih 30 dana</span></div><div class="chart">' + prs.map(r => '<div class="pr"><span class="medal">'+I.medal+'</span><div><b>'+esc(S.ex[r.id].name)+' · '+esc(fmtKg(r.best.x.kg))+' × '+r.best.x.reps+'</b><br><span>'+esc(new Date(r.best.x.at).toLocaleDateString('hr-HR', { day:'numeric', month:'numeric' }))+' · procjena maksimuma '+esc(fmtKg(Math.round(r.best.v * 2) / 2))+'</span></div></div>').join('') + '</div>' : '') +
    '<div class="psec"><h2>Dosljednost</h2><span>12 tjedana</span></div><div class="chart"><div class="sub2">Svaki kvadratić je dan, a redovi su dani u tjednu (P–N).</div><div class="heat">'+heat+'</div></div>' +
    '<div class="psec"><h2>Pravilo</h2><span>uvjet za prijedlog</span></div><div class="chips" style="margin-top:0">' + [2, 3].map(n => '<button class="chip" data-a="setProgN" data-v="'+n+'" aria-pressed="'+(progN() === n)+'">'+n+' treninga zaredom</button>').join('') + '<button class="chip" data-a="progInfo">Kako to radi?</button></div>' +
    '<div style="height:20px"></div></div>';
};
function ringSvg(frac, color){
  const C = 2 * Math.PI * 35;
  return '<svg viewBox="0 0 76 76"><circle cx="38" cy="38" r="35" fill="none" stroke="var(--track)" stroke-width="3.5"/><circle id="ringArc" cx="38" cy="38" r="35" fill="none" stroke="'+color+'" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="'+(C*Math.max(0,Math.min(1,frac))).toFixed(1)+' '+C.toFixed(1)+'" transform="rotate(-90 38 38)"/></svg>';
}
VIEWS.play = function(){
  if (!P) return VIEWS.home();
  if (P.done) {
    const cands = progCandidates();
    const wk = weekStatus(weekStart(Date.now()));
    const willCount = P.ref && planSlots().some(s => s.id === P.ref.id && s.kind === P.ref.kind);
    return '<div class="view gut stack">' + topbar('', '') +
      '<div class="done'+(cands.length ? ' compact' : '')+'"><span class="ck">'+I.check+'</span><h1 style="margin:10px 0 0;font-size:30px;font-weight:600">Bravo!</h1><span style="font-size:16px;color:var(--text-body)">' + esc(P.title) + ' • ' + fmt(P.secs) + ' min</span>' +
        (wk.planned && willCount ? '<span class="sub" style="margin:0">Ovaj tjedan ' + Math.min(wk.planned, wk.done + 1) + '/' + wk.planned + ' po planu</span>' : '') + '</div>' +
      (cands.length ? '<h2 class="h2" style="margin-top:22px">Kako je išlo?</h2>' +
        '<div class="list" style="margin-top:10px;gap:0">' + cands.map(c => {
          const failed = P.answers[c.j] === false, msg = doneMsg(c);
          const lr = P.lastReps[c.j] != null ? P.lastReps[c.j] : Math.max(0, (c.it.reps || 10) - 2);
          return '<div class="xrow"><div class="tx"><b>' + esc(c.e.name) + ' · ' + esc(dose(c.it)) + '</b>' +
            (c.it.measure === 'time' ? '' : '') +
            '<div class="seg2"><button data-a="answer" data-j="'+c.j+'" data-v="1" aria-pressed="'+(!failed)+'" class="'+(!failed ? 'on' : '')+'">Sve odrađeno</button><button data-a="answer" data-j="'+c.j+'" data-v="0" aria-pressed="'+failed+'" class="'+(failed ? 'onA' : '')+'">Nisam uspio</button></div>' +
            (failed && c.it.measure !== 'time' ? '<div class="mini">Zadnja serija: <button class="sbtn" data-a="lrep" data-j="'+c.j+'" data-d="-1" aria-label="Manje">−</button><b>'+lr+'</b><button class="sbtn" data-a="lrep" data-j="'+c.j+'" data-d="1" aria-label="Više">+</button> ponavljanja</div>' : '') +
            (msg ? '<em class="'+(failed ? 'a' : (!c.prog && (c.it.ok || 0) + 1 >= progN()) ? 'g' : '')+'">' + esc(msg) + '</em>' : '') + '</div></div>';
        }).join('') + '</div>' : '') +
      '<div style="height:12px"></div></div>' +
      '<div class="footer gut stack" style="gap:10px"><button class="btn" data-a="finishPlay">Završi</button><button class="txtbtn" data-a="restartPlay" style="align-self:center">Ponovi</button></div>';
  }
  const v = curView();
  const prog = (P.i + (v.st.dur ? 1 - remaining()/v.st.dur : 0)) / P.steps.length;
  const media = P.mode === 'field'
    ? '<div class="media"><div class="fblock '+v.fieldPanel.cls+'" id="fpanel"><span class="ph1">'+v.fieldPanel.ph+'</span><span class="big" id="fbig">'+esc(v.big)+'</span>' + (v.fieldPanel.dist ? '<span class="sm" style="font-size:20px;font-weight:600;color:var(--text)">'+esc(v.fieldPanel.dist)+'</span>' : '') + '<span class="sm">'+esc(v.fieldPanel.sm)+'</span></div></div>'
    : mediaHtml(v.e, v.badge);
  const fspec = P.mode === 'field' && (window.PITCH || {})[P.f.id];
  const card = P.mode === 'field'
    ? '<section class="icard" style="margin:16px max(16px, env(safe-area-inset-left, 0px)) 0">' +
        (fspec ? '<span class="lb">Teren</span><div class="pitch inplay">' + pitchSvg(fspec, { block: v.st.g != null && v.st.kind !== 'prep' ? v.st.g : null }) + '</div><div class="lgrow">' + pitchLegend(fspec) + '</div>' : '') +
        '<span class="lb">Trening</span><p>'+esc(P.title)+'</p>' + (P.f.summary_hr ? '<p style="color:var(--text-body);font-size:15px">'+esc(P.f.summary_hr)+'</p>' : '') +
        '<span class="lb">Izvor</span><p style="font-size:14px">' + (P.f.source_url ? '<a href="'+esc(P.f.source_url)+'" target="_blank" rel="noopener">'+esc(P.f.source_title || 'STATSports')+'</a>' : esc(P.f.source_title || 'STATSports')) + '</p></section>'
    : '<section class="icard" style="margin:16px max(16px, env(safe-area-inset-left, 0px)) 0">' + (v.e && v.e.feel ? '<span class="lb">Osjećaj</span><p>'+esc(v.e.feel)+'</p>' : '') + '<span class="lb">Upute</span>' + ((v.e && v.e.steps || []).map((s, i) => '<div class="bul num"><i>'+(i+1)+'</i><span>'+esc(s)+'</span></div>').join('') || '<p style="color:var(--text-2)">Bez uputa.</p>') +
        (v.e && (v.e.mistakes||[]).length ? '<span class="lb">Česte greške</span>' + v.e.mistakes.map(s => '<div class="bul warn">'+esc(s)+'</div>').join('') : '') + '</section>';
  return '<div class="view">' +
    '<div class="gut">' + topbar('<button class="ib" data-a="quitPlay" aria-label="Prekini trening">'+I.back+'</button>', '<button class="ib" data-a="playSettings" aria-label="Postavke playera">'+I.gear+'</button><button class="ib" data-a="playList" aria-label="Popis vježbi">'+I.list+'</button>') + '</div>' +
    '<div class="prog" role="progressbar" aria-label="Napredak" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+Math.round(prog*100)+'"><i id="progbar" style="width:'+(prog*100).toFixed(1)+'%"></i></div>' +
    media +
    '<div class="ttl gut">' + esc(v.title) + '</div><div class="meta gut">' + esc(v.meta) + '</div><div class="hint gut" id="phint">' + esc(v.hint) + '</div>' +
    card + '<div style="height:12px"></div></div>' +
    '<div class="ctrl gut">' +
      '<button class="ib" data-a="toggleSound" aria-label="'+(S.settings.sound?'Isključi zvuk':'Uključi zvuk')+'">'+(S.settings.sound?I.sound:I.mute)+'</button>' +
      '<button class="ib" data-a="jump" data-d="-1" aria-label="Prethodna vježba">'+I.prev+'</button>' +
      '<button class="ring'+(P.paused?' dim':'')+'" id="ring" data-a="ring" aria-label="'+(v.st.kind==='manual'?'Serija gotova':P.paused?'Nastavi':'Pauziraj')+'">'+ringSvg(v.ringFrac, v.ringColor)+'<span class="n" id="ringN">'+(P.paused?I.play:esc(v.big))+'</span></button>' +
      '<button class="ib" data-a="jump" data-d="1" aria-label="Sljedeća vježba">'+I.next+'</button>' +
      '<span></span>' +
    '</div>';
};
function paintPlayer(full){
  if (top().v !== 'play' || !P) return;
  if (full) { render(); return; }
  const v = curView();
  const n = document.getElementById('ringN'); if (n && !P.paused) n.textContent = v.big;
  const fb = document.getElementById('fbig'); if (fb) fb.textContent = v.big;
  const arc = document.getElementById('ringArc'); if (arc) { const C = 2*Math.PI*35; arc.setAttribute('stroke-dasharray', (C*Math.max(0,Math.min(1,v.ringFrac))).toFixed(1)+' '+C.toFixed(1)); }
  const pb = document.getElementById('progbar'); if (pb) { const prog = (P.i + (v.st.dur ? 1 - remaining()/v.st.dur : 0)) / P.steps.length; pb.style.width = (prog*100).toFixed(1) + '%'; }
  if (P._lastI !== P.i) { P._lastI = P.i; render(); }
}

/* ---------- sheets ---------- */
function sheetHtml(){
  const s = S.sheet;
  let body = '';
  if (s.kind === 'addTo') {
    const list = Object.values(S.pr).sort((a,b) => (b.updatedAt||0) - (a.updatedAt||0));
    body = '<h3>Dodaj u protokol</h3>' + list.map(p => '<button class="opt" data-a="addToPick" data-id="'+esc(p.id)+'"><span>'+esc(p.name)+'</span><span style="color:var(--text-2);font-size:14px">'+nVj((p.items||[]).length)+'</span></button>').join('') +
      '<button class="opt" data-a="addToNew" style="color:var(--accent-text);font-weight:600"><span>+ Novi protokol s ovom vježbom</span></button>';
  } else if (s.kind === 'eq') {
    const eq = S.lib.eq || [];
    const counts = {}; Object.values(S.ex).forEach(e => exEquip(e).forEach(t => counts[t] = (counts[t] || 0) + 1));
    body = '<h3>Oprema</h3><p style="margin:0 0 12px;font-size:14px;line-height:21px;color:var(--text-2)">Prikaži vježbe za opremu koju odabereš.</p>' +
      '<div class="chips wrap">' + EQUIP.filter(t => counts[t]).map(t => '<button class="tagbtn" data-a="eqToggle" data-v="'+esc(t)+'" aria-pressed="'+(eq.indexOf(t) !== -1)+'">'+esc(t)+' <span style="opacity:.6">'+counts[t]+'</span></button>').join('') + '</div>' +
      '<div class="seg" style="margin-top:18px"><button class="btn sec" data-a="eqClear" style="height:48px">Očisti</button><button class="btn" data-a="sheetDone" style="height:48px;font-size:16px">Prikaži ' + libFiltered().length + '</button></div>';
  } else if (s.kind === 'day') {
    const ws = weekStart(Date.now()), st = weekStatus(ws), i = s.i;
    const plan = st.slots.filter(x => x.day === i), done = st.log.filter(l => dayIdx(l.at) === i);
    const d = new Date(ws + i * DAY_MS + 12 * 3600e3);
    body = '<h3>' + esc(DAYNAMES[i].charAt(0).toUpperCase() + DAYNAMES[i].slice(1)) + ', ' + d.getDate() + '. ' + (d.getMonth() + 1) + '.</h3>' +
      (plan.length ? '<p class="label" style="padding:0 0 6px">Plan</p>' + plan.map(x => '<button class="opt" data-a="'+(x.kind === 'field' ? 'openField' : 'openPr')+'" data-id="'+esc(x.id)+'"><span>'+esc(x.name)+'</span><span class="tag">'+(x.done ? 'odrađeno' : 'čeka')+'</span></button>').join('') : '<p style="margin:0 0 8px;color:var(--text-2)">Za ovaj dan nema plana.</p>') +
      (done.length ? '<p class="label" style="padding:14px 0 6px">Odrađeno</p>' + done.map(l => '<div class="opt"><span>'+esc(l.name)+'</span><span style="color:var(--text-2);font-size:14px">'+fmt(l.secs || 0)+' min</span></div>').join('') : '') +
      '<p style="margin:14px 0 0;font-size:13px;line-height:19px;color:var(--text-2)">Dane biraš u svakom protokolu i treningu na terenu (Dani u tjednu).</p>';
  } else if (s.kind === 'goal' || s.kind === 'kg') {
    const p = S.pr[s.id], plan = p ? (s.kind === 'goal' ? goalPlan(p, S.settings.goal) : kgPlan(p)) : { changes: [] };
    body = '<h3>' + (s.kind === 'goal' ? 'Cilj „' + esc(GOALS[S.settings.goal].name) + '” za ' + esc(p.name) : 'Kilogrami za ' + esc(p.name)) + '</h3>' +
      plan.changes.map(c => '<div class="opt" style="flex-direction:column;align-items:flex-start;gap:3px;padding:10px 4px"><b style="font-size:15px">'+esc(c.e.name)+'</b><span style="font-size:13px;color:var(--text-2)">'+esc(c.from)+' → <span style="color:var(--accent-text);font-weight:600">'+esc(c.to)+'</span>'+(c.est ? ' · kilograme upiši sam' : '')+'</span></div>').join('') +
      '<p style="margin:12px 0 14px;font-size:13px;line-height:19px;color:var(--text-2)">Sve možeš i dalje ručno promijeniti u uređivanju protokola.</p>' +
      '<div class="seg"><button class="btn sec" data-a="sheetDone" style="height:48px">Odustani</button><button class="btn" data-a="'+(s.kind === 'goal' ? 'goalApply' : 'kgApply')+'" data-id="'+esc(s.id)+'" style="height:48px;font-size:16px">Primijeni</button></div>';
  } else if (s.kind === 'progInfo') {
    body = '<h3>Kako napredujem?</h3>' +
      '<div class="stack" style="gap:10px;font-size:15px;line-height:22px;color:var(--text-body)">' +
      '<p style="margin:0">Na kraju treninga svaka vježba je unaprijed označena kao „Sve odrađeno”. Ako nisi stigao sve serije i ponavljanja, označiš „Nisam uspio” i upišeš koliko si napravio u zadnjoj seriji.</p>' +
      '<p style="margin:0">Kad ' + progN() + ' treninga zaredom odradiš sve, na stranici <b>Napredak</b> dobiješ prijedlog za veće opterećenje. Ti ga prihvatiš ili odgodiš. Ako nova težina dvaput zaredom ne ide, nudi se povratak na prethodnu.</p>' +
      '<div class="bul">Šipka i landmine: +2,5 kg za gornji dio tijela, +5 kg za noge i kukove.</div>' +
      '<div class="bul">Bučice (2,5–20 kg): prvo +1 ponavljanje po seriji do gornje granice raspona, onda sljedeći par bučica i povratak na početni broj ponavljanja.</div>' +
      '<div class="bul">Girja, TRX i vlastita težina: +1 ponavljanje do gornje granice, zatim teža varijanta. Vježbe na vrijeme: +5 s do 60 s.</div>' +
      '<p style="margin:0">To je konzervativno pravilo „2 za 2” iz NSCA-ova priručnika, a ACSM preporučuje isto: 2–10 % više opterećenja, manje za male mišićne skupine. Treninzi iz programa (npr. TAE) se samo bilježe, jer njihove doze određuju tjedni programa.</p>' +
      '<p style="margin:0;font-size:13px;line-height:19px;color:var(--text-2)">Izvori: ' + PROG_REFS.map(r => '<a href="'+esc(r.url)+'" target="_blank" rel="noopener">'+esc(r.t)+'</a>').join(' · ') + '</p></div>';
  } else if (s.kind === 'data') {
    const pk = S.pack;
    body = '<h3>Moji podaci</h3>' +
      '<p style="margin:0 0 12px;font-size:14px;line-height:21px;color:var(--text-2)">Vježbe, protokoli, plan i povijest spremaju se samo na ovom mobitelu. Povremeno izvezi kopiju da ih ne izgubiš. Videi i slike nisu dio kopije.</p>' +
      '<button class="opt" data-a="exportData"><span>Izvezi sigurnosnu kopiju</span></button>' +
      '<label class="opt" for="importFile" style="cursor:pointer"><span>Uvezi kopiju</span></label><input id="importFile" class="vsr" type="file" accept="application/json,.json">' +
      '<label class="opt" for="packFile" style="cursor:pointer"><span>' + (S.sheet._busy ? 'Uvozim slike…' : 'Uvezi paket slika') + '</span><span style="color:var(--text-2);font-size:14px">' + (pk ? pk.ids.length + ' slika' : 'privatno') + '</span></label><input id="packFile" class="vsr" type="file" accept=".json,.mtpack,application/json">' +
      (pk ? '<button class="opt" data-a="packRemove" style="color:var(--danger)"><span>' + (s._confirm ? 'Dodirni još jednom za uklanjanje' : 'Ukloni paket slika') + '</span></button>' : '') +
      '<p style="margin:14px 0 0;font-size:13px;color:var(--text-2)">' + nVj(Object.keys(S.ex).length) + ' • ' + Object.keys(S.pr).length + ' ' + plural(Object.keys(S.pr).length,'protokol','protokola','protokola') + ' • ' + S.log.length + ' ' + plural(S.log.length,'trening','treninga','treninga') + ' u povijesti</p>' +
      '<p style="margin:6px 0 0;font-size:13px;color:var(--text-2)">Verzija ' + APP_VERSION + '</p>';
  } else if (s.kind === 'settings') {
    const o = (k, vals, unit) => '<div class="chips wrap" style="margin:8px 0 14px">' + vals.map(v => '<button class="chip" data-a="setSetting" data-k="'+k+'" data-v="'+v+'" aria-pressed="'+(S.settings[k]===v)+'">'+v+' '+unit+'</button>').join('') + '</div>';
    body = '<h3>Postavke playera</h3>' +
      '<div class="prow"><span class="k">Zvučni signali</span><button class="switch" role="switch" data-a="toggleSound" aria-checked="'+S.settings.sound+'" aria-label="Zvučni signali"></button></div>' +
      '<p class="label" style="padding:12px 0 0">Promjena strane</p>' + o('switchSec', [5,10,15], 's') +
      '<p class="label" style="padding:0">Pauza između vježbi</p>' + o('transSec', [5,10,15,20], 's') +
      '<p style="font-size:13px;color:var(--text-2);margin:0">Nove postavke vrijede od sljedećeg pokretanja.</p>';
  } else if (s.kind === 'playList') {
    const groups = [];
    P.steps.forEach((st, k) => { if (!isWork(st)) return; if (!groups.some(g => g.g === st.g)) groups.push({ g: st.g, k, lab: st.ss ? st.ss.L + st.ss.k : String(st.g + 1) + '.', name: P.mode === 'field' ? (st.b ? st.b.label_hr : '') : (st.e ? st.e.name : '') }); });
    const cur = (P.steps[P.i] || {}).g;
    body = '<h3>' + esc(P.title) + '</h3>' + groups.map(g => '<button class="opt" data-a="jumpTo" data-k="'+g.k+'"><span>'+esc(g.lab)+' '+esc(g.name)+'</span>'+(g.g===cur?'<span class="tag">sada</span>':'')+'</button>').join('');
  }
  return '<div class="sheet-bg" data-a="sheetClose"><div class="sheet gut" data-stop="1" role="dialog" aria-modal="true"><div class="grab"></div>' + body + '</div></div>';
}

/* ---------- after-render hooks ---------- */
function after(t){
  if (t.v === 'home') {
    const car = document.getElementById('car'), dots = document.getElementById('dots');
    if (car && dots) car.addEventListener('scroll', () => {
      const w = car.firstElementChild ? car.firstElementChild.getBoundingClientRect().width + 10 : 1;
      const i = Math.round(car.scrollLeft / w);
      dots.querySelectorAll('.dot').forEach((d, k) => d.setAttribute('aria-current', k === i ? 'true' : 'false'));
    }, { passive: true });
  }
  if (t.v === 'play' && P) P._lastI = P.i;
  if (app.querySelector('g.runner')) startRunners();
}

/* ---------- actions ---------- */
function newExDraft(){
  return { id: uid('e'), name:'', alt:'', cat:'Snaga', phase:null, cord:'', zones:[], equip:[], measure:'sets', sec:30, sets:3, reps:10, rest:60, kg:0, sides:false, equipment:'', feel:'', stepsText:'', mistakesText:'', note:'', video:'', media:null, mediaType:null, fav:false };
}
const A = {
  tab: d => setTab(d.tab),
  back: () => { S.draft = null; S.pick = null; back(); },
  dot: d => { const car = document.getElementById('car'); const c = car && car.children[+d.i]; if (c) c.scrollIntoView({ behavior:'smooth', inline:'center', block:'nearest' }); },
  libCat: d => { S.lib.cat = d.cat; lsSet('mt.libcat', d.cat); if (top().v !== 'library') { S.tab = 'library'; S.stack = [{v:'library'}]; } render(); },
  fieldList: () => go({ v:'fieldList' }),
  openField: d => go({ v:'field', id:d.id }),
  openPr: d => go({ v:'pr', id:d.id }),
  openProg: d => go({ v:'program', id:d.id }),
  openEx: d => go({ v:'ex', id:d.id, dose:0 }),
  dose: d => { top().dose = +d.i; render(); },
  fav: async d => { const e = S.ex[d.id]; if (!e) return; const n = Object.assign({}, e, { fav: !e.fav }); delete n.id; e.fav = n.fav; render(); await save('exercises', d.id, n); },
  newEx: () => { S.draft = newExDraft(); go({ v:'exEdit' }); },
  editEx: d => { const e = S.ex[d.id]; if (!e) return; S.draft = Object.assign(newExDraft(), clone(e), { stepsText: (e.steps||[]).join('\n'), mistakesText: (e.mistakes||[]).join('\n'), equip: exEquip(e).slice(), alt: e.alt || '', video: e.video || '' }); go({ v:'exEdit' }); },
  dset: d => { const dr = S.draft; let v = d.v; if (d.k === 'phase') v = +v || null; dr[d.k] = v; if (d.k === 'cat' && v !== 'Rehab' && v !== 'Mobilnost') dr.phase = null; if (d.k === 'cat' && v === 'Rehab' && !dr.phase) dr.phase = 1; if (d.k === 'measure' && v === 'time' && dr.sets > 3) dr.sets = 1; render(); },
  dzone: d => { const z = S.draft.zones = S.draft.zones || []; const i = z.indexOf(d.v); if (i === -1) z.push(d.v); else z.splice(i,1); render(); },
  dflag: d => { S.draft[d.k] = !S.draft[d.k]; render(); },
  dstep: d => { const k = d.k, dr = S.draft, dir = +d.d; const step = { sec:5, sets:1, reps:1, rest:15, kg:2.5 }[k]; const min = { sec:5, sets:1, reps:1, rest:0, kg:0 }[k]; const max = { sec:600, sets:10, reps:60, rest:300, kg:300 }[k]; dr[k] = Math.min(max, Math.max(min, (+dr[k]||0) + dir*step)); render(); },
  mediaRemove: () => { S.draft.media = null; S.draft.mediaType = null; render(); },
  saveEx: async () => {
    const d = S.draft; const name = (d.name||'').trim();
    if (!name) { toast('Upiši naziv vježbe.'); const el = document.getElementById('f-name'); if (el) el.focus(); return; }
    const lines = t => (t||'').split('\n').map(s => s.trim()).filter(Boolean);
    const video = (d.video||'').trim();
    const body = { name, alt: (d.alt||'').trim(), cat:d.cat, phase: (d.cat === 'Rehab' || d.cat === 'Mobilnost') && d.phase ? d.phase : null, cord: d.cord || '', zones: d.zones||[], equip: (d.equip||[]).slice(), measure: d.measure, sec: d.sec, sets: d.sets, reps: d.reps, rest: d.rest, kg: d.kg||0, sides: !!d.sides,
      equipment: (d.equipment||'').trim(), feel: (d.feel||'').trim(), steps: lines(d.stepsText), mistakes: lines(d.mistakesText), note: (d.note||'').trim(),
      video: /^https?:\/\//i.test(video) ? video : '', videoTitle: d.videoTitle || null,
      media: d.media || null, mediaType: d.mediaType || null, fav: !!d.fav, order: d.order || 500, source: d.source || null, sourceTitle: d.sourceTitle || null };
    const prev = S.ex[d.id];
    const ok = await save('exercises', d.id, body); if (!ok) return;
    if (prev && prev.media && prev.media !== body.media) { try { await IDB.del(prev.media); } catch(e){} }
    S.ex[d.id] = Object.assign({ id: d.id }, body);
    const id = d.id; S.draft = null; S.stack.pop();
    if (top().v !== 'ex' || top().id !== id) S.stack.push({ v:'ex', id, dose:0 });
    render(); toast('Vježba je spremljena.');
  },
  delEx: async () => {
    const d = S.draft; if (!d._confirmDel) { d._confirmDel = true; render(); return; }
    const inUse = Object.values(S.pr).filter(p => (p.items||[]).some(it => it.exId === d.id));
    const ok = await remove('exercises', d.id); if (!ok) return;
    for (const p of inUse) { const n = clone(p); delete n.id; n.items = n.items.filter(it => it.exId !== d.id); await save('protocols', p.id, n); }
    delete S.ex[d.id]; S.draft = null;
    while (S.stack.length > 1 && (top().v === 'exEdit' || (top().v === 'ex' && top().id === d.id))) S.stack.pop();
    render(); toast('Vježba je obrisana.');
  },
  addTo: d => { S.sheet = { kind:'addTo', exId: d.id }; render(); },
  addToPick: async d => {
    const p = S.pr[d.id], e = S.ex[S.sheet.exId]; if (!p || !e) return;
    const n = clone(p); delete n.id; n.items = (n.items||[]).concat([exItem(e)]); n.updatedAt = Date.now();
    S.sheet = null; render();
    if (await save('protocols', p.id, n)) toast('Dodano u „' + p.name + '”.');
  },
  addToNew: () => { const e = S.ex[S.sheet.exId]; S.sheet = null; S.draft = { id: uid('p'), name:'', desc:'', items: e ? [exItem(e)] : [], _open: null }; go({ v:'build' }); },
  newPr: () => { S.draft = { id: uid('p'), name:'', desc:'', items: [], _open: null }; go({ v:'build' }); },
  editPr: d => { const p = S.pr[d.id]; if (!p) return; S.draft = Object.assign(clone(p), { _open: null }); S.draft.items = S.draft.items || []; go({ v:'build' }); },
  itOpen: d => { const i = +d.i; S.draft._open = S.draft._open === i ? null : i; render(); },
  iset: d => { const it = S.draft.items[S.draft._open]; it[d.k] = d.v; render(); },
  istep: d => {
    const items = S.draft.items, it = items[+d.i], k = d.k, dir = +d.d;
    const step = { sec:5, sets:1, reps:1, rest:15, kg:2.5 }[k]; const min = { sec:5, sets:1, reps:1, rest:0, kg:0 }[k]; const max = { sec:600, sets:10, reps:60, rest:300, kg:300 }[k];
    it[k] = Math.min(max, Math.max(min, Math.round(((+it[k]||0) + dir*step) * 100) / 100));
    if (k === 'reps') { delete it.r0; delete it.r1; }
    if (k === 'sets' && it.ss) items.forEach(x => { if (x.ss === it.ss) x.sets = it.sets; }); // a superset shares its rounds
    render();
  },
  iflag: d => { const it = S.draft.items[+d.i]; it.sides = !it.sides; render(); },
  imove: d => { const i = +d.i, j = i + (+d.d), items = S.draft.items; if (j < 0 || j >= items.length) return; const t = items[i]; items[i] = items[j]; items[j] = t; normGroups(items); S.draft._open = j; render(); },
  idel: d => { S.draft.items.splice(+d.i, 1); normGroups(S.draft.items); S.draft._open = null; render(); },
  pickStart: () => { S.pick = { ids: [] }; S.lib.q = ''; S.stack.push({ v:'library' }); render(); },
  pickToggle: d => { const ids = S.pick.ids, i = ids.indexOf(d.id); if (i === -1) ids.push(d.id); else ids.splice(i,1); const list = document.getElementById('liblist'); const v = app.querySelector('.view'); const st = v ? v.scrollTop : 0; render(); const v2 = app.querySelector('.view'); if (v2) v2.scrollTop = st; },
  pickCancel: () => { S.pick = null; S.stack.pop(); render(); },
  pickDone: () => { const ids = S.pick.ids.slice(); S.pick = null; S.stack.pop(); ids.forEach(id => { const e = S.ex[id]; if (e) S.draft.items.push(exItem(e)); }); render(); toast(nVj(ids.length) + ' dodano.'); },
  savePr: async d => {
    const dr = S.draft; const name = (dr.name||'').trim();
    if (!name) { toast('Upiši naziv protokola.'); const el = document.getElementById('p-name'); if (el) el.focus(); return; }
    const keepIf = (o, it, ks) => { ks.forEach(k => { if (it[k] != null && it[k] !== '') o[k] = it[k]; }); return o; };
    const body = { name, desc: (dr.desc||'').trim(), items: normGroups(dr.items).map(it => keepIf({ exId: it.exId, measure: it.measure, sec: it.sec, sets: it.sets, reps: it.reps, rest: it.rest, sides: !!it.sides, kg: it.kg||0 }, it, ['ss','easy','up','r0','r1','cap','section','note','repsList','ok','fail','prev','snoozeOk'])), updatedAt: Date.now(), home: dr.home || null, tag: dr.tag || null, days: dr.days || [] };
    ['program','week','slot','pack','goal','goalSkip'].forEach(k => { if (dr[k] != null) body[k] = dr[k]; });
    const ok = await save('protocols', dr.id, body); if (!ok) return;
    S.pr[dr.id] = Object.assign({ id: dr.id }, body);
    const id = dr.id; S.draft = null; S.stack.pop();
    if (top().v !== 'pr' || top().id !== id) S.stack.push({ v:'pr', id });
    if (d.start) { A.startPr({ id }); return; }
    render(); toast('Protokol je spremljen.');
  },
  delPr: async () => {
    const d = S.draft; if (!d._confirmDel) { d._confirmDel = true; render(); return; }
    if (!(await remove('protocols', d.id))) return;
    delete S.pr[d.id]; S.draft = null; S.stack = [{ v: S.tab }]; render(); toast('Protokol je obrisan.');
  },
  startPr: d => { const p = S.pr[d.id]; if (!p || !(p.items||[]).length) return; startPlayer({ mode:'ex', title: p.name, items: p.items, steps: stepsFromItems(p.items), ref: { kind:'protocol', id: p.id } }); },
  playEx: d => { const e = S.ex[d.id]; if (!e) return; const o = doseOptions(e)[top().dose || 0]; const items = [o ? o.it : exItem(e)]; startPlayer({ mode:'ex', title: e.name, items, steps: stepsFromItems(items), ref: { kind:'exercise', id: e.id } }); },
  startField: d => { const f = S.field[d.id]; if (!f) return; startPlayer({ mode:'field', title: f.name_hr, f, steps: stepsFromField(f), ref: { kind:'field', id: f.id } }); },
  ring: () => tapRing(),
  jump: d => jump(+d.d),
  jumpTo: d => { S.sheet = null; enterStep(+d.k); P.paused = false; render(); },
  playList: () => { S.sheet = { kind:'playList' }; render(); },
  playSettings: () => { S.sheet = { kind:'settings' }; render(); },
  dataSheet: () => { S.sheet = { kind:'data' }; render(); },
  exportData: () => {
    try {
      const blob = new Blob([JSON.stringify({ v:1, exportedAt: new Date().toISOString(), exercises:S.ex, protocols:S.pr, field:S.field, programs:S.prog, log:S.log, _deleted:S._deleted||[] }, null, 1)], { type:'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'moj-trening-kopija-' + new Date().toISOString().slice(0,10) + '.json';
      document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
      toast('Kopija je spremljena.');
    } catch(e){ toast('Izvoz nije uspio.'); }
  },
  setSetting: d => { S.settings[d.k] = +d.v; lsSet('mt.settings', S.settings); render(); },
  toggleSound: () => { S.settings.sound = !S.settings.sound; lsSet('mt.settings', S.settings); ensureAudio(); render(); },
  quitPlay: () => { clearInterval(ticker); keepAwake(false); P = null; S.stack.pop(); render(); },
  restartPlay: () => { const cfg = { mode:P.mode, title:P.title, items:P.items, f:P.f, steps:P.steps, ref:P.ref }; S.stack.pop(); startPlayer(cfg); },
  finishPlay: async () => {
    const entry = { name: P.title, kind: P.ref ? P.ref.kind : 'protocol', refId: P.ref ? P.ref.id : null, at: Date.now(), secs: P.secs || 0 };
    if (P.mode === 'ex') entry.items = (P.items || []).map((it, j) => { const failed = P.answers && P.answers[j] === false; const x = { exId: it.exId, measure: it.measure, sets: it.sets, reps: it.reps, sec: it.sec, kg: it.kg || 0, sides: !!it.sides, done: !failed };
      if (failed && P.lastReps && P.lastReps[j] != null) x.lastReps = P.lastReps[j]; return x; });
    const news = applyProgress();
    P = null; S.stack.pop();
    S.log.unshift(entry); S.log = S.log.slice(0, 500); persist(); render();
    if (news.length) toast('Novi prijedlog na stranici Napredak: ' + news.join(', '));
  },
  lrep: d => { P.lastReps = P.lastReps || {}; const it = P.items[+d.j] || {}; const cur = P.lastReps[+d.j] != null ? P.lastReps[+d.j] : Math.max(0, (it.reps || 10) - 2); P.lastReps[+d.j] = Math.max(0, Math.min(it.reps || 30, cur + (+d.d))); const v = app.querySelector('.view'); const st = v ? v.scrollTop : 0; render(); const v2 = app.querySelector('.view'); if (v2) v2.scrollTop = st; },
  progTab: d => { S.progTab = d.v; render(); },
  setGoal: d => { S.settings.goal = S.settings.goal === d.v ? null : d.v; lsSet('mt.settings', S.settings); render(); },
  setBall: d => { const v = (S.settings.ballN != null ? S.settings.ballN : 3) + (+d.d); S.settings.ballN = Math.max(0, Math.min(7, v)); lsSet('mt.settings', S.settings); render(); },
  setMatch: d => { S.settings.matchDay = +d.v; lsSet('mt.settings', S.settings); render(); },
  kgSkip: d => { S.kgSkip = S.kgSkip || {}; S.kgSkip[d.id] = 1; render(); },
  goalSheet: d => { S.sheet = { kind:'goal', id: d.id }; render(); },
  kgSheet: d => { S.sheet = { kind:'kg', id: d.id }; render(); },
  goalSkip: async d => { const p = S.pr[d.id]; if (!p) return; const n = clone(p); delete n.id; n.goalSkip = S.settings.goal; S.pr[d.id].goalSkip = n.goalSkip; render(); await save('protocols', d.id, n); },
  goalApply: async d => { const p = S.pr[d.id]; if (!p || !S.settings.goal) return; const plan = goalPlan(p, S.settings.goal); const n = clone(p); delete n.id; n.items = plan.items; n.goal = S.settings.goal; n.updatedAt = Date.now();
    S.pr[d.id] = Object.assign({ id: d.id }, n); S.sheet = null; render(); await save('protocols', d.id, n); toast('Protokol je doziran za cilj „' + GOALS[n.goal].name + '”.'); },
  kgApply: async d => { const p = S.pr[d.id]; if (!p) return; const plan = kgPlan(p); const n = clone(p); delete n.id; n.items = plan.items;
    S.pr[d.id] = Object.assign({ id: d.id }, n); S.sheet = null; render(); await save('protocols', d.id, n); toast('Kilogrami su upisani.'); },
  setProgN: d => { S.settings.progN = +d.v; lsSet('mt.settings', S.settings); render(); },
  sugUp: async d => { const p = S.pr[d.p]; if (!p) return; const n = clone(p); delete n.id; const it = n.items[+d.j], e = S.ex[it.exId], nd = nextDose(e, it); if (!nd.item) return;
    n.items[+d.j] = Object.assign(clone(nd.item), { prev: { measure: it.measure, sets: it.sets, reps: it.reps, sec: it.sec, kg: it.kg || 0, sides: !!it.sides }, ok: 0, fail: 0, snoozeOk: 0, up: Date.now() });
    S.pr[d.p] = Object.assign({ id: d.p }, n); render(); await save('protocols', d.p, n); toast(e.name + ': ' + nd.text); },
  sugLater: async d => { const p = S.pr[d.p]; if (!p) return; const n = clone(p); delete n.id; const it = n.items[+d.j]; it.snoozeOk = it.ok || 0; S.pr[d.p] = Object.assign({ id: d.p }, n); render(); await save('protocols', d.p, n); },
  sugRevert: async d => { const p = S.pr[d.p]; if (!p) return; const n = clone(p); delete n.id; const it = n.items[+d.j]; if (!it.prev) return;
    n.items[+d.j] = Object.assign({}, it, it.prev, { prev: null, ok: 0, fail: 0, snoozeOk: 0 }); delete n.items[+d.j].prev;
    S.pr[d.p] = Object.assign({ id: d.p }, n); render(); await save('protocols', d.p, n); toast('Vraćeno na ' + doseBase(n.items[+d.j]) + '.'); },
  sugRetry: async d => { const p = S.pr[d.p]; if (!p) return; const n = clone(p); delete n.id; n.items[+d.j].fail = 0; S.pr[d.p] = Object.assign({ id: d.p }, n); render(); await save('protocols', d.p, n); },
  answer: d => { P.answers = P.answers || {}; P.answers[+d.j] = d.v === '0' ? false : true; const v = app.querySelector('.view'); const st = v ? v.scrollTop : 0; render(); const v2 = app.querySelector('.view'); if (v2) v2.scrollTop = st; },
  progInfo: () => { S.sheet = { kind:'progInfo' }; render(); },
  sheetDone: () => { S.sheet = null; render(); },
  daySheet: d => { S.sheet = { kind:'day', i: +d.i }; render(); },
  eqSheet: () => { S.sheet = { kind:'eq' }; render(); },
  eqToggle: d => { const eq = S.lib.eq = (S.lib.eq || []).slice(); const i = eq.indexOf(d.v); if (i === -1) eq.push(d.v); else eq.splice(i, 1); lsSet('mt.libeq', eq); render(); },
  eqClear: () => { S.lib.eq = []; lsSet('mt.libeq', []); S.sheet = null; render(); },
  prDays: async d => { const p = S.pr[d.id]; if (!p) return; const n = clone(p); delete n.id; const ds = n.days = (n.days || []).slice(); const i = ds.indexOf(+d.i); if (i === -1) ds.push(+d.i); else ds.splice(i, 1); ds.sort(); S.pr[d.id].days = ds; render(); await save('protocols', d.id, n); },
  fieldDays: async d => { const f = S.field[d.id]; if (!f) return; const n = clone(f); delete n.id; const ds = n.days = (n.days || []).slice(); const i = ds.indexOf(+d.i); if (i === -1) ds.push(+d.i); else ds.splice(i, 1); ds.sort(); S.field[d.id].days = ds; render(); await save('field', d.id, n); },
  ddays: d => { const ds = S.draft.days = (S.draft.days || []).slice(); const i = ds.indexOf(+d.i); if (i === -1) ds.push(+d.i); else ds.splice(i, 1); ds.sort(); render(); },
  ilink: d => {
    const items = S.draft.items, i = +d.i, a = items[i], b = items[i + 1]; if (!a || !b) return;
    if (a.ss && b.ss === a.ss) { const old = a.ss; for (let k = i + 1; k < items.length && items[k].ss === old; k++) items[k].ss = uid('s'); }
    else { const key = a.ss || b.ss || uid('s'); const oldB = b.ss; a.ss = key; for (let k = i + 1; k < items.length && (k === i + 1 || (oldB && items[k].ss === oldB)); k++) items[k].ss = key; if (!a.rest || a.rest > 30) a.rest = 0; }
    normGroups(items); render();
  },
  copyPr: () => { const d = S.draft; const c = clone(d); c.id = uid('p'); c.name = (d.name || 'Protokol') + ' (kopija)'; c.home = null; c.days = []; c._confirmDel = false; c._open = null; S.draft = c; render(); toast('Kopija je spremna. Promijeni naziv i spremi.'); },
  dequip: d => { const z = S.draft.equip = (S.draft.equip || []).slice(); const i = z.indexOf(d.v); if (i === -1) z.push(d.v); else z.splice(i, 1); render(); },
  packRemove: async () => { if (!S.sheet || !S.sheet._confirm) { S.sheet._confirm = true; render(); return; } await removePack(); S.sheet = null; render(); toast('Paket slika je uklonjen.'); }
};

app.addEventListener('click', ev => {
  const el = ev.target.closest('[data-a]');
  if (!el || !app.contains(el)) return;
  if (el.dataset.a === 'sheetClose') { if (ev.target !== el) return; S.sheet = null; render(); return; }
  if (el.disabled) return;
  const fn = A[el.dataset.a];
  if (fn) { ev.preventDefault(); fn(Object.assign({}, el.dataset), el, ev); }
});
app.addEventListener('input', ev => {
  const t = ev.target;
  if (t.id === 'libq') { S.lib.q = t.value; const l = document.getElementById('liblist'); if (l) l.innerHTML = libListHtml(); return; }
  if (t.dataset && t.dataset.bind && S.draft) S.draft[t.dataset.bind] = t.value;
});
app.addEventListener('change', async ev => {
  const t = ev.target;
  if (t.id === 'importFile' && t.files && t.files[0]) {
    try {
      const d = JSON.parse(await t.files[0].text());
      if (!d || typeof d !== 'object' || !d.exercises || !d.protocols) throw new Error('bad');
      applyData(d); S._deleted = d._deleted || []; persist(); S.sheet = null; S.stack = [{ v: S.tab }]; render(); toast('Podaci su vraćeni iz kopije.');
    } catch(e){ toast('Ta datoteka nije kopija ove aplikacije.'); }
    return;
  }
  if (t.id === 'packFile' && t.files && t.files[0]) {
    if (S.sheet) { S.sheet._busy = true; render(); }
    try { const r = await importPack(t.files[0]); S.sheet = null; render();
      const parts = [r.photos ? r.photos + ' slika' : '', r.exercises ? r.exercises + ' vježbi' : '', r.programs ? r.programs + ' program' + (r.sessions ? ' s ' + r.sessions + ' treninga' : '') : ''].filter(Boolean);
      toast(parts.length ? 'Dodano: ' + parts.join(', ') + '.' : 'Ovaj paket je već uvezen.'); }
    catch(e){ console.error('pack import failed', e); if (S.sheet) S.sheet._busy = false; render(); toast('Ta datoteka nije paket slika ove aplikacije.'); }
    return;
  }
  if (t.id !== 'mfile' || !t.files || !t.files[0] || !S.draft) return;
  const file = t.files[0];
  if (file.size > 80 * 1024 * 1024) { toast('Video je prevelik. Snimi kraći isječak (5–15 s).'); return; }
  const isImg = /^image\//.test(file.type);
  S.draft._uploading = true; render();
  try {
    const id = uid('m');
    const type = file.type || (isImg ? 'image/jpeg' : 'video/mp4');
    await IDB.put(id, { type, buf: await file.arrayBuffer() });
    MEDIA[id] = URL.createObjectURL(file);
    S.draft.media = id; S.draft.mediaType = isImg ? 'image' : 'video';
    toast(isImg ? 'Slika je dodana.' : 'Video je dodan.');
  } catch(e){ console.error('media save failed', e); toast('Spremanje videa nije uspjelo. Oslobodi prostor na mobitelu i pokušaj ponovo.'); }
  S.draft._uploading = false; render();
});
document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && S.sheet) { S.sheet = null; render(); } });

init();
})();
