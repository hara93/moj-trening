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
  ckc:'<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="var(--accent-fill)"/><path d="M7.2 12.4l3.2 3.2 6.4-6.8" fill="none" stroke="#fff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
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
// object URLs of photos and videos stored on this phone; your own clips are read only when a screen shows them
const MEDIA_URLS = {}, mediaTried = {};
const MEDIA = new Proxy(MEDIA_URLS, { get(t, k){ if (typeof k === 'string' && !(k in t) && !mediaTried[k] && k.indexOf('pack:') !== 0) loadOwnMedia(k); return t[k]; } });
const mediaUrl = id => MEDIA[id] || '';
const CATS = ['Rehab', 'Aktivacija', 'Mobilnost', 'Snaga', 'Eksplozivnost', 'Trup', 'Kondicija'];
const ZONES = ['Kuk','Gluteus','Gluteus medius','Aduktori','Fleksori kuka','Stražnja loža','Kvadriceps','Lisni mišić','Core','Koljeno','Gležanj','Leđa','Prsa','Ramena','Ruke','Cijelo tijelo'];
// the data keeps 'Core' (also in exercises you edited); on screen it is "Trup", like the library category
const exZoneLabel = z => z === 'Core' ? 'Trup' : z;
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
// (an older hash.js, e.g. from the saved copy on a weak signal, has none of these: updates then wait for the next start)
const mtStructHash = window.mtStructHash || (() => ''), mtDoseHash = window.mtDoseHash || (() => ''), mtCanon = window.mtCanon || (o => JSON.stringify(o));
const DOSE_KEYS = window.mtDoseKeys || ['measure', 'sets', 'reps', 'repsList', 'sec', 'kg', 'rest', 'sides', 'r0', 'r1'];

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
// estimated from the same step list the player runs, so supersets and circuits are timed the way they are trained.
// A set with reps: 3 s per rep for lifting; a drill at the pitch (category Kondicija) about 20 s per rep (a run plus the
// walk back), or the item's own repSec (e.g. 100 for a box-to-box length run)
function protoMin(p){
  const repS = st => +st.it.repSec > 0 ? +st.it.repSec : st.e && st.e.cat === 'Kondicija' ? 20 : 3;
  const s = stepsFromItems(p.items || []).reduce((a, st) => a + (st.dur || (st.kind === 'manual' ? repsOf(st.it, st.set || 1) * repS(st) * (st.it.sides ? 2 : 1) + (st.it.sides ? 5 : 0) : 0)), 0);
  return Math.max(1, Math.round(s / 60));
}
function fieldMin(f){
  if (f.total_min) return String(f.total_min).replace('.', ',');
  let s = 0; (f.blocks||[]).forEach(b => { const sets = b.sets||1, reps = b.reps||1; s += sets*reps*(b.work_s||0) + sets*(reps-1)*(b.rest_s||0) + (sets-1)*(b.set_rest_s||b.rest_s||0) + (b.rest_s||0); });
  return Math.max(1, Math.round(s/60));
}
function repsOf(it, set){ return (it.repsList && it.repsList[set - 1]) || it.reps || 10; }
function dose(it){ return doseBase(it) + (it.note ? ' · ' + it.note : ''); }
// the dose without the note; different reps per set are shown as they are trained (4 × 6/5/5/4), also in the progression texts
function doseBase(it){
  if (it.measure === 'time') return ((it.sets||1) > 1 ? it.sets + ' × ' : '') + (it.sec||30) + ' s' + (it.sides ? ' po strani' : '');
  if (Array.isArray(it.repsList) && it.repsList.some(r => r !== it.repsList[0])) return it.repsList.length + ' × ' + it.repsList.join('/') + (it.sides ? ' po strani' : '') + (it.kg ? ' · ' + fmtKg(it.kg) : '');
  return (it.sets||1) + ' × ' + (it.reps||10) + (it.sides ? ' po strani' : '') + (it.kg ? ' · ' + fmtKg(it.kg) : '');
}
function exItem(e){ const m = e.measure||'sets'; return { exId: e.id, measure: m, sec: e.sec||30, sets: e.sets || (m === 'time' ? 1 : 3), reps: e.reps||10, rest: e.rest != null ? e.rest : (m === 'time' ? 15 : 45), sides: !!e.sides, kg: e.kg||0 }; }
function exBadge(e){ if (e.phase) return 'Faza ' + e.phase; if (e.cord) return 'Uže ' + e.cord; return ''; }
function exMeta(e){ return (e.zones && e.zones.length ? e.zones.slice(0,2).map(exZoneLabel).join(' • ') : e.cat) ; }
// what an exercise can show, best first: your own video or photo, the two-panel picture made for the app (media.js "pic": LEFT
// start, RIGHT end; the same athlete everywhere), a licensed demo video (one tap away with the swap button), a photo from the private
// pack, a licensed photo. The swap button steps through them (S.alt).
function mediaList(e){
  if (!e) return [];
  const out = [], m = (window.EXMEDIA || {})[e.id] || {}, lic = { credit: m.credit, url: m.url, lic: m.lic, cid: e.id };
  if (e.media && MEDIA[e.media]) out.push({ type: e.mediaType === 'image' ? 'image' : 'video', src: MEDIA[e.media], own: true });
  if (m.pic) out.push({ type: 'image', src: m.pic, thumb: m.thumb, two: true });
  if (m.video) out.push(Object.assign({ type: 'video', src: m.video, poster: m.img, thumb: m.thumb }, lic));
  if (MEDIA['pack:' + e.id]) out.push({ type: 'image', src: MEDIA['pack:' + e.id], credit: (S.pack && S.pack.credit) || 'Privatni paket slika', pack: true });
  if (m.img && !m.video) out.push(Object.assign({ type: 'image', src: m.img, thumb: m.thumb }, lic));
  return out;
}
// first = true: always the best one (thumbnails, protocol header); otherwise the one picked with the swap button
function exMedia(e, first){
  const l = mediaList(e); if (!l.length) return null;
  const i = first ? 0 : ((S.alt && S.alt[e.id]) || 0) % l.length;
  return Object.assign({ i, n: l.length, next: l[(i + 1) % l.length] }, l[i]);
}
// rows are 72 px: shipped media has a 192 px square (media.js "thumb"), so a long list never loads the full pictures
function thumbHtml(e){
  const m = exMedia(e, true);
  if (m) return m.thumb || m.type === 'image' || m.poster ? '<img alt="" loading="lazy" src="'+esc(m.thumb || (m.type === 'image' ? m.src : m.poster))+'">' : '<video muted playsinline preload="metadata" src="'+esc(m.src)+'#t=0.5"></video>';
  return pathIcon(catIcon(e && e.cat), 28);
}
function packVideo(e){ return e && (S.pack && S.pack.videos || {})[e.id] || ''; }
function exAlt(e){ return e && e.alt && norm(e.alt) !== norm(e.name) ? e.alt : ''; }

/* ---------- on-device storage ---------- */
const APP_VERSION = '1.6.1';
const STORE_KEY = 'mt.data.v1';
const BACKUP_KIND = 'moj-trening-backup', PACK_KIND = 'moj-trening-media-pack';
// keys only version 2.x wrote (it was never used); the other app on this address keeps its own 'zns:' keys
const OLD_KEYS = ['mt.data.v2', 'mt.before-import.v2', 'mt.active.v2'];
const DATA_COLLS = ['exercises', 'protocols', 'field', 'programs'];
const collMap = c => c === 'exercises' ? S.ex : c === 'protocols' ? S.pr : c === 'programs' ? S.prog : S.field;
let savedJson = null;   // the data as this copy of the app last wrote or read it on the phone
let pendingExt = null;  // data another open copy saved: taken over here as soon as nothing is open
const storeObj = () => ({ v:1, exercises:S.ex, protocols:S.pr, field:S.field, programs:S.prog, log:S.log, _deleted:S._deleted||[] });
function persist(){
  let cur = null; try { cur = localStorage.getItem(STORE_KEY); } catch(e){}
  if (savedJson != null && cur && cur !== savedJson) mergeOtherCopy(cur);
  try {
    const json = JSON.stringify(storeObj());
    localStorage.setItem(STORE_KEY, json); savedJson = json; pendingExt = null;
    if (S.saveFailed) { S.saveFailed = false; softRender(); }
    return true;
  } catch(e){
    // the browser's space for this app is full; free space on the phone does not change it
    if (!S.saveFailed) { S.saveFailed = true; softRender(); }
    toast('Nije spremljeno: memorija aplikacije je puna. Odmah izvezi sigurnosnu kopiju (zupčanik na početnoj).', true);
    return false;
  }
}
// another open copy of the app (a second Safari tab) saved since this one did: what you did not change here
// follows the other copy, and every workout either copy logged stays
function mergeOtherCopy(cur){
  let base = null, theirs = null;
  try { base = JSON.parse(savedJson); theirs = cleanData(JSON.parse(cur)); } catch(e){ return; }
  if (!theirs) return;
  const same = (a, b) => (a == null && b == null) || (a != null && b != null && mtCanon(a) === mtCanon(b));
  DATA_COLLS.forEach(c => {
    const ours = collMap(c), b = (base && base[c]) || {}, t = theirs[c] || {};
    new Set(Object.keys(b).concat(Object.keys(t))).forEach(id => {
      if (same(ours[id], b[id]) && !same(t[id], b[id])) { if (t[id]) ours[id] = Object.assign({}, t[id], { id }); else delete ours[id]; }
    });
  });
  const key = l => l.at + '|' + l.kind + '|' + l.refId, have = {};
  S.log.forEach(l => { have[key(l)] = 1; });
  theirs.log.forEach(l => { if (!have[key(l)]) S.log.push(l); });
  S.log.sort((a, b) => b.at - a.at);
  S._deleted = Array.from(new Set((S._deleted || []).concat(theirs._deleted)));
}
// another copy saved and nothing is open here: show its data
function takeOtherCopy(){
  const raw = pendingExt; pendingExt = null;
  let d = null; try { d = cleanData(JSON.parse(raw)); } catch(e){}
  if (!d) return;
  applyData(d); S._deleted = d._deleted; savedJson = raw;
  const ok = t => !t.id || !({ ex:S.ex, pr:S.pr, program:S.prog, field:S.field }[t.v]) || ({ ex:S.ex, pr:S.pr, program:S.prog, field:S.field }[t.v])[t.id];
  if (!S.stack.every(ok)) S.stack = [{ v: S.tab }];
}
// nothing is open that a change of data under it could disturb (player, editor, picker, sheet)
const appBusy = () => !!P || !!FORM_VIEWS[top().v] || !!S.sheet || !!S.draft || !!S.pick;
function applyData(d){
  for (const k in S.ex) delete S.ex[k]; for (const k in S.pr) delete S.pr[k]; for (const k in S.field) delete S.field[k];
  Object.keys(d.exercises||{}).forEach(id => S.ex[id] = Object.assign({}, d.exercises[id], { id }));
  Object.keys(d.protocols||{}).forEach(id => S.pr[id] = Object.assign({}, d.protocols[id], { id }));
  Object.keys(d.field||{}).forEach(id => S.field[id] = Object.assign({}, d.field[id], { id }));
  for (const k in S.prog) delete S.prog[k]; Object.keys(d.programs||{}).forEach(id => S.prog[id] = Object.assign({}, d.programs[id], { id }));
  S.log = Array.isArray(d.log) ? d.log : [];
}
// the item as it is stored on the phone (where a refused save goes back to): null = not stored, undefined = not known
function storedItem(coll, id){
  let d = null; try { d = JSON.parse(savedJson); } catch(e){}
  if (!isPlainObj(d)) return undefined;
  const m = d[coll]; return m && m[id] ? Object.assign({}, m[id], { id }) : null;
}

/* ---------- shape checks: data from a file (backup, pack) or an older version is cleaned before use ---------- */
const isPlainObj = v => !!v && typeof v === 'object' && !Array.isArray(v);
const badKey = k => typeof k !== 'string' || !k || k in Object.prototype;   // "__proto__", "constructor"… break lookups
const CLEAN_NUMS = { sets:1, reps:1, sec:1, rest:1, kg:1, ok:1, fail:1, snoozeOk:1, up:1, easy:1, r0:1, r1:1, cap:1, at:1, secs:1, week:1, total_min:1, order:1, updatedAt:1, lastReps:1, setsDone:1, value:1, phase:1, work_s:1, rest_s:1, set_rest_s:1, distance_m:1 };
const CLEAN_LISTS = { items:1, blocks:1, steps:1, mistakes:1, zones:1, equip:1, how_hr:1, notes:1, weeks:1, sessions:1, days:1, repsList:1 };
const CLEAN_WORDS = { steps:1, mistakes:1, zones:1, equip:1, how_hr:1, notes:1 };
const CLEAN_LINKS = { video:1, source:1, source_url:1 };
let cleanFixes = 0;   // how many values the last checks had to drop or convert
function cleanVal(k, v, depth){
  const drop = () => { cleanFixes++; return undefined; };
  if (v == null || depth > 12) return depth > 12 ? drop() : v;
  if (CLEAN_NUMS[k]) {
    if (typeof v === 'number') return isFinite(v) ? v : drop();
    if (typeof v === 'string' && /^-?\d+([.,]\d+)?$/.test(v.trim())) { cleanFixes++; return +v.trim().replace(',', '.'); }
    return drop();
  }
  if (CLEAN_LINKS[k]) return typeof v === 'string' && (v === '' || /^https?:\/\//i.test(v)) ? v : drop();
  if (CLEAN_LISTS[k]) {
    if (!Array.isArray(v)) return drop();
    let a;
    if (k === 'days') a = Array.from(new Set(v.filter(i => Number.isInteger(i) && i >= 0 && i < 7))).sort();
    else if (k === 'repsList') a = v.map(x => cleanVal('reps', x, depth + 1)).filter(x => typeof x === 'number' && x >= 0);   // 0 = a set with no reps (history)
    else if (k === 'zones' && v.length === 4 && v.every(x => typeof x === 'number' && isFinite(x) && x >= 0)) a = v.slice();   // a field log entry's load: metres per intensity zone
    else if (CLEAN_WORDS[k]) a = v.filter(x => typeof x === 'string' && !((k === 'zones' || k === 'equip') && badKey(x)));
    else a = v.filter(x => isPlainObj(x) && (k !== 'items' || (typeof x.exId === 'string' && !badKey(x.exId))) && (k !== 'sessions' || (typeof x.pr === 'string' && !badKey(x.pr))))
      .map(x => cleanVal(null, x, depth + 1));
    if (a.length !== v.length) cleanFixes++;
    return a;
  }
  if (Array.isArray(v)) return v.map(x => cleanVal(null, x, depth + 1));
  if (typeof v === 'object') {
    const o = {};
    Object.keys(v).forEach(q => { if (badKey(q)) { cleanFixes++; return; } const x = cleanVal(q, v[q], depth + 1); if (x !== undefined) o[q] = x; });
    return o;
  }
  return v;
}
const asText = (o, k) => { if (typeof o[k] !== 'string') { if (o[k] != null) cleanFixes++; o[k] = o[k] == null ? '' : String(o[k]); } };
function cleanData(d){
  if (!isPlainObj(d)) return null;
  const out = {};
  Object.keys(d).forEach(k => { if (!badKey(k)) out[k] = d[k]; });
  DATA_COLLS.forEach(c => {
    const src = isPlainObj(d[c]) ? d[c] : {}, o = {};
    if (d[c] != null && !isPlainObj(d[c])) cleanFixes++;
    Object.keys(src).forEach(id => {
      if (badKey(id) || !isPlainObj(src[id])) { cleanFixes++; return; }
      const x = cleanVal(null, src[id], 0);
      asText(x, c === 'field' ? 'name_hr' : 'name');
      if (c === 'protocols' && !Array.isArray(x.items)) { cleanFixes++; x.items = []; }
      o[id] = x;
    });
    out[c] = o;
  });
  out.log = (Array.isArray(d.log) ? d.log : []).map(l => isPlainObj(l) ? cleanVal(null, l, 0) : null).filter(l => {
    if (!l || typeof l.at !== 'number') { cleanFixes++; return false; }
    asText(l, 'name');
    if (l.refId != null && (typeof l.refId !== 'string' || badKey(l.refId))) { cleanFixes++; l.refId = null; }
    return true;
  });
  out._deleted = (Array.isArray(d._deleted) ? d._deleted : []).filter(x => typeof x === 'string');
  if (d.settings !== undefined) out.settings = cleanSettings(d.settings);
  return out;
}
// settings from a file or an older version: only plain numbers and switches (and a goal the app knows)
function cleanSettings(s){
  const o = {}; if (!isPlainObj(s)) return o;
  const plain = v => typeof v === 'boolean' || v === null || (typeof v === 'number' && isFinite(v));
  Object.keys(s).forEach(k => { const v = s[k]; if (badKey(k)) return; if (plain(v)) o[k] = v;
    else if (isPlainObj(v)) { const m = {}; Object.keys(v).forEach(q => { if (!badKey(q) && plain(v[q])) m[q] = v[q]; }); o[k] = m; } });   // e.g. a map of skipped suggestions
  if (typeof s.goal === 'string' && Object.prototype.hasOwnProperty.call(GOALS, s.goal)) o.goal = s.goal;
  const int = (k, lo, hi) => { if (k in o && o[k] !== null && !(Number.isInteger(o[k]) && o[k] >= lo && o[k] <= hi)) delete o[k]; };
  int('ballN', 0, 7); int('matchDay', -1, 6); int('progN', 2, 3);
  if ('topKmh' in o && !(typeof o.topKmh === 'number' && o.topKmh >= 20 && o.topKmh <= 40)) delete o.topKmh;   // Najveća brzina
  return o;
}
const SETTINGS_BASE = { sound: true, switchSec: 5, transSec: 10 };

/* ---------- photos and videos on the phone (IndexedDB) ---------- */
const IDB = {
  _db: null,
  open(){ if (this._db) return Promise.resolve(this._db); return new Promise((res, rej) => { const r = indexedDB.open('mt-media', 1); r.onupgradeneeded = () => r.result.createObjectStore('blobs'); r.onsuccess = () => { const db = r.result; db.onversionchange = () => { db.close(); this._db = null; }; this._db = db; res(db); }; r.onerror = () => rej(r.error); }); },
  // each call is one transaction: it completes as a whole or fails as a whole (an abort, e.g. no space, fails too)
  async tx(mode, fn, again){
    const d = await this.open(); let t;
    try { t = d.transaction('blobs', mode); } catch(e){ this._db = null; if (!again) return this.tx(mode, fn, true); throw e; }   // iOS may close a sleeping connection
    return new Promise((res, rej) => {
      let out; try { out = fn(t.objectStore('blobs')); } catch(e){ try { t.abort(); } catch(_){} rej(e); return; }
      t.oncomplete = () => res(out && out.result); t.onerror = () => rej(t.error || new Error('idb error')); t.onabort = () => rej(t.error || new Error('idb aborted'));
    });
  },
  put(id, v){ return this.tx('readwrite', st => st.put(v, id)); },
  get(id){ return this.tx('readonly', st => st.get(id)); },
  del(id){ return this.tx('readwrite', st => st.delete(id)); }
};
const idbBlobUrl = rec => URL.createObjectURL(rec instanceof Blob ? rec : new Blob([rec.buf], { type: rec.type }));
// the pack's photos are read at start (lists show them); your own clips one by one when a screen shows them
async function loadMedia(){
  const ids = ((S.pack && S.pack.ids) || []).map(id => 'pack:' + id).filter(id => !MEDIA_URLS[id]);
  for (const id of ids) { try { const rec = await IDB.get(id); if (rec && (rec instanceof Blob || rec.buf)) MEDIA_URLS[id] = idbBlobUrl(rec); } catch(e){} }
  softRender();
}
function loadOwnMedia(id){
  mediaTried[id] = 1;
  IDB.get(id).then(rec => { if (!rec || !(rec instanceof Blob || rec.buf)) return; MEDIA_URLS[id] = idbBlobUrl(rec); mediaShown(); }).catch(() => { delete mediaTried[id]; });
}
// a clip read from the phone appears on the screen that asked for it, also in the player and the editor (unless you are typing)
function mediaShown(){
  const v = top().v, a = document.activeElement;
  if (v === 'play' || (FORM_VIEWS[v] && !(a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)))) { if (!renderQueued) { renderQueued = true; requestAnimationFrame(() => { renderQueued = false; render(); }); } }
  else softRender();
}

/* ---------- the private photo pack ---------- */
const packError = msg => Object.assign(new Error(msg), { mtMsg: msg });
const cleanPackVideos = v => { const o = {}; if (isPlainObj(v)) Object.keys(v).forEach(k => { if (!badKey(k) && typeof v[k] === 'string' && /^https?:\/\//i.test(v[k])) o[k] = v[k]; }); return o; };
// the private photo pack (e.g. photos from programmes you bought) lives only on this phone, never in the public app.
// It is taken whole or not at all: a damaged photo or a full phone leaves everything as it was.
async function importPack(file){
  let d = null; try { d = JSON.parse(await file.text()); } catch(e){}
  if (isPlainObj(d) && (d.kind === BACKUP_KIND || (!d.kind && isPlainObj(d.exercises) && Array.isArray(d.log)))) throw packError('Ovo je sigurnosna kopija, a ne paket slika. Kopija se vraća u retku „Uvezi kopiju”.');
  if (!isPlainObj(d) || d.kind !== PACK_KIND || !Array.isArray(d.items)) throw packError('Ta datoteka nije paket slika ove aplikacije.');
  const photos = []; let broken = 0;
  d.items.forEach(it => {
    if (!isPlainObj(it) || typeof it.ex !== 'string' || badKey(it.ex) || typeof it.data !== 'string') return;
    try { const bin = atob(it.data), buf = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
      photos.push({ ex: it.ex, type: typeof it.type === 'string' && /^image\/[a-z0-9.+-]+$/i.test(it.type) ? it.type : 'image/jpeg', buf }); }
    catch(e){ broken++; }
  });
  if (broken) throw packError('Paket je oštećen: ' + broken + ' ' + plural(broken, 'slika se ne može', 'slike se ne mogu', 'slika se ne može') + ' pročitati. Ništa nije uvezeno.');
  const c = cleanData({ exercises: d.exercises, protocols: d.protocols, programs: d.programs });
  const packId = typeof d.id === 'string' && !badKey(d.id) ? d.id : 'pack', old = (S.pack && S.pack.ids) || [];
  // every photo in one transaction: all of them are stored or none
  try { await IDB.tx('readwrite', st => { photos.forEach(p => st.put({ type: p.type, buf: p.buf.buffer }, 'pack:' + p.ex)); }); }
  catch(e){ console.error('pack photos not stored', e); throw packError('Slike se ne mogu spremiti na mobitel (nema mjesta?). Paket nije uvezen.'); }
  // a newer version of the same pack (d.prev = fingerprints of its earlier versions): drills and sessions you never
  // changed follow it, with your progress in them; the ones you changed stay yours
  const prev = isPlainObj(d.prev) ? d.prev : {}, swapped = [];
  ['exercises', 'protocols'].forEach(cl => Object.keys(c[cl]).forEach(id => {
    const map = collMap(cl), local = map[id], olds = isPlainObj(prev[cl]) && Array.isArray(prev[cl][id]) ? prev[cl][id] : [];
    // a drill whose link an older editor dropped (saved unchanged or with only your photo) is the pack's while it matches an earlier version
    if (!local || local.pack !== packId && (cl !== 'exercises' || local.pack)) return;
    const next = Object.assign({}, c[cl][id], { id, pack: packId }), h = contentHash(Object.assign({}, local, { pack: packId }));
    if (h === contentHash(next) || olds.indexOf(h) === -1) return;
    Object.keys(HASH_SKIP).forEach(k => { if (k !== 'id' && local[k] !== undefined) next[k] = local[k]; });
    if (cl === 'protocols') { next.items = carryItems(c[cl][id], local, []); if (local.goal != null) next.goal = local.goal; }
    swapped.push([map, id, local]); map[id] = next;
  }));
  // exercises, sessions and programmes in the pack join your data; ones already on the phone stay as they are
  const added = [], progBefore = {}; let exN = 0, prN = 0;
  Object.keys(c.exercises).forEach(id => { if (!S.ex[id]) { S.ex[id] = Object.assign({}, c.exercises[id], { id, pack: packId }); added.push(S.ex, id); exN++; } });
  Object.keys(c.protocols).forEach(id => { if (!S.pr[id]) { S.pr[id] = Object.assign({}, c.protocols[id], { id, pack: packId }); added.push(S.pr, id); prN++; } });
  Object.keys(c.programs).forEach(id => { progBefore[id] = S.prog[id]; S.prog[id] = Object.assign({}, c.programs[id], { id, pack: packId }, S.prog[id] && S.prog[id].days ? { days: S.prog[id].days } : {}); });   // your training days stay
  const ids = Array.from(new Set(photos.map(p => p.ex)));
  const pack = { id: packId, title: typeof d.title === 'string' && d.title || 'Paket slika', credit: typeof d.credit === 'string' && d.credit || 'Privatni paket slika', at: Date.now(),
    ids: old.concat(ids.filter(id => old.indexOf(id) === -1)), videos: Object.assign({}, (S.pack && S.pack.videos) || {}, cleanPackVideos(d.videos)),
    members: Array.from(new Set(((S.pack && S.pack.members) || []).concat((Array.isArray(d.members) ? d.members : []).filter(x => typeof x === 'string' && !badKey(x))))) };
  let ok = exN || prN || swapped.length || Object.keys(c.programs).length ? persist() : true;
  if (ok) try { localStorage.setItem('mt.pack', JSON.stringify(pack)); } catch(e){ ok = false; }
  if (!ok) {
    for (let i = 0; i < added.length; i += 2) delete added[i][added[i + 1]];
    swapped.forEach(([map, id, was]) => { map[id] = was; });
    Object.keys(progBefore).forEach(id => { if (progBefore[id]) S.prog[id] = progBefore[id]; else delete S.prog[id]; });
    if (persist()) S.saveFailed = false;
    const fresh = ids.filter(id => old.indexOf(id) === -1);
    try { await IDB.tx('readwrite', st => { fresh.forEach(id => st.delete('pack:' + id)); }); } catch(e){}
    throw packError('Paket nije uvezen: memorija aplikacije je puna. Na mobitelu je sve ostalo kao prije.');
  }
  photos.forEach(p => { const k = 'pack:' + p.ex; if (MEDIA_URLS[k]) URL.revokeObjectURL(MEDIA_URLS[k]); MEDIA_URLS[k] = URL.createObjectURL(new Blob([p.buf], { type: p.type })); });
  S.pack = pack; try { localStorage.removeItem('mt.packOld'); } catch(e){}
  const upd = cl => swapped.filter(s => s[0] === collMap(cl)).length, progs = Object.keys(c.programs);
  // only what is new counts as added (the same file again adds nothing); a programme already here counts as updated when the pack changed it
  return { photos: ids.filter(id => old.indexOf(id) === -1).length, exercises: exN, sessions: prN, programs: progs.filter(id => !progBefore[id]).length,
    updEx: upd('exercises'), updPr: upd('protocols'), updPg: progs.filter(id => progBefore[id] && mtCanon(progBefore[id]) !== mtCanon(S.prog[id])).length };
}
// what removing the pack takes away (for the confirmation); your history and your copies of its sessions stay
function packParts(pk){
  const pid = pk.id, n = Object.values(S.pr).filter(p => p.pack === pid).length, g = Object.values(S.prog).filter(x => x.pack === pid).length;
  const used = {}; Object.values(S.pr).forEach(p => { if (p.pack !== pid) (p.items || []).forEach(it => { used[it.exId] = 1; }); });
  const exN = Object.values(S.ex).filter(e => e.pack === pid && !used[e.id] && !e.media).length, ph = (pk.ids || []).length;
  return [g ? (g === 1 ? 'program' : g + ' programa') : '',
    n ? n + ' ' + plural(n, 'trening', 'treninga', 'treninga') + (g ? ' iz programa' : ' iz paketa') + ' (i tvoje izmjene ' + plural(n, 'u njemu', 'u njima', 'u njima') + ')' : '',
    exN ? nVj(exN) + ' ' + plural(exN, 'koja postoji', 'koje postoje', 'koje postoje') + ' samo u paketu' : '',
    ph ? ph + ' ' + plural(ph, 'slika', 'slike', 'slika') : ''].filter(Boolean);
}
// the data first; photos and the pack record go only once that is stored (a refused save leaves everything as it was)
async function removePack(){
  const ids = (S.pack && S.pack.ids) || [], pid = S.pack && S.pack.id;
  if (pid) {
    const before = JSON.stringify(storeObj());
    Object.keys(S.prog).forEach(id => { if (S.prog[id].pack === pid) delete S.prog[id]; });
    Object.keys(S.pr).forEach(id => { if (S.pr[id].pack === pid) delete S.pr[id]; });
    const used = {}; Object.values(S.pr).forEach(p => (p.items || []).forEach(it => used[it.exId] = 1));
    // a drill with your own photo or video stays, as yours
    Object.keys(S.ex).forEach(id => { const e = S.ex[id]; if (e.pack !== pid || used[id]) return; if (e.media) delete e.pack; else delete S.ex[id]; });
    if (!persist()) { applyData(JSON.parse(before)); S.saveFailed = false; return false; }
  }
  try { await IDB.tx('readwrite', st => { ids.forEach(id => st.delete('pack:' + id)); }); } catch(e){}
  ids.forEach(id => { const k = 'pack:' + id; if (MEDIA_URLS[k]) { URL.revokeObjectURL(MEDIA_URLS[k]); delete MEDIA_URLS[k]; } });
  S.pack = null; try { localStorage.removeItem('mt.pack'); localStorage.removeItem('mt.packOld'); } catch(e){}
  if (S.lib.cat === 'TAE') { S.lib.cat = 'Sve'; lsSet('mt.libcat', 'Sve'); }
  return true;
}

/* ---------- improvements from new versions ---------- */
const STATE_CARRY = ['ok', 'fail', 'snoozeOk', 'up', 'prev'];
const ssLinkedAt = (items, i) => !!(items[i] && items[i].ss && items[i + 1] && items[i + 1].ss === items[i].ss);
// the newer shipped exercises of a protocol with what is yours carried over, matched by exercise (then place):
// progress always, the dose where you set it yourself
function carryItems(fresh, local, touched){
  const F = fresh.items || [], L = local.items || [], used = {};
  return F.map((it, j) => {
    const x = clone(it);
    let k = L[j] && L[j].exId === it.exId && !used[j] ? j : -1;
    if (k === -1) k = L.findIndex((o, i) => !used[i] && o && o.exId === it.exId);
    if (k === -1) return x;
    used[k] = 1; const o = L[k];
    STATE_CARRY.forEach(q => { if (o[q] != null) x[q] = clone(o[q]); });
    if (touched[k]) {
      const restOk = ssLinkedAt(F, j) === ssLinkedAt(L, k);   // a rest inside a superset means something else
      DOSE_KEYS.forEach(q => { if (q === 'rest' && !restOk) return; delete x[q]; if (o[q] !== undefined) x[q] = clone(o[q]); });
    }
    return x;
  });
}
function mergeSeed(seed){
  // New items are added; items you never changed follow the app's improvements; your edits and deletions always win.
  // In a protocol, training never counts as a change, and where you only set doses (sets, reps, kg, rest…) a newer
  // version still arrives: the doses you set stay, the ones you never touched follow the new version.
  const hist = window.SEED_HISTORY || {}, struct = (window.SEED_STRUCT || {}).protocols || {};
  let changed = false;
  ['exercises','protocols','field'].forEach(c => Object.keys(seed[c]||{}).forEach(id => {
    const map = collMap(c);
    if (S._deleted.indexOf(c + '/' + id) !== -1) return;
    const fresh = seed[c][id], local = map[id];
    if (!local) { map[id] = Object.assign({}, fresh, { id }); changed = true; return; }
    const h = contentHash(local);
    if (h === contentHash(fresh)) return;
    let touched = null;   // per exercise of the protocol: true = a dose you set yourself
    if ((hist[c] && hist[c][id] || []).indexOf(h) !== -1) touched = [];
    else if (c === 'protocols') {
      const vers = (struct[id] || {})[mtStructHash(local)];
      if (vers) touched = (local.items || []).map((it, k) => !vers.some(v => v.split(' ')[k] === mtDoseHash(it)));
    }
    if (!touched) return; // you changed it, keep yours
    const keep = {}; Object.keys(HASH_SKIP).forEach(k => { if (k !== 'id' && local[k] !== undefined) keep[k] = local[k]; });
    const next = Object.assign({}, fresh, keep, { id });
    if (c === 'protocols') { next.items = carryItems(fresh, local, touched); if (local.goal != null) next.goal = local.goal; }
    if (mtCanon(next) !== mtCanon(local)) { map[id] = next; changed = true; }
  }));
  // new names for shipped items: applied even if you changed the item, never if you gave it your own name. Old values compare by
  // value, so a list (e.g. an exercise's old steps) is renamed too.
  // A new description may describe the new order and members of the exercise list, so a protocol whose exercises you
  // changed keeps its description, unless its list is the new one or the shipped list never changed.
  const renamed = window.SEED_RENAMED || {}, layouts = (window.SEED_LAYOUT || {}).protocols || {};
  const listFp = p => mtStructHash({ items: (p && p.items) || [] }), sameVal = (a, b) => a === b || JSON.stringify(a) === JSON.stringify(b);
  const descFits = (id, local, fresh) => { const f = listFp(fresh); return listFp(local) === f || ((layouts[id] || []).length > 0 && layouts[id].every(h => h === f)); };
  ['exercises','protocols','field'].forEach(c => Object.keys(renamed[c] || {}).forEach(id => {
    const map = collMap(c), local = map[id], fresh = (seed[c] || {})[id];
    if (!local || !fresh) return;
    Object.keys(renamed[c][id]).forEach(k => { if ((renamed[c][id][k] || []).some(v => sameVal(v, local[k])) && fresh[k] !== undefined && !sameVal(local[k], fresh[k]) && (c !== 'protocols' || k !== 'desc' || descFits(id, local, fresh))) { local[k] = fresh[k] && typeof fresh[k] === 'object' ? clone(fresh[k]) : fresh[k]; changed = true; } });
    // finished sessions keep the name they had: rename those that carry an old shipped name
    if (c === 'protocols' && renamed[c][id].name && local.name === fresh.name) S.log.forEach(l => { if (l.refId === id && renamed[c][id].name.indexOf(l.name) !== -1) { l.name = fresh.name; changed = true; } });
  }));
  const retired = window.SEED_RETIRED || {};
  ['exercises','protocols','field'].forEach(c => (retired[c] || []).forEach(id => {
    const map = collMap(c), local = map[id]; if (!local) return;
    if ((hist[c] && hist[c][id] || []).indexOf(contentHash(local)) === -1) return;
    if (c === 'exercises' && Object.values(S.pr).some(p => (p.items || []).some(it => it.exId === id))) return;
    if (c !== 'exercises' && ((local.days || []).length || S.log.some(l => l.refId === id))) return;   // one you plan or trained stays
    if (c === 'exercises' && local.media) return;   // your own photo or video keeps the exercise (media is outside the fingerprint)
    delete map[id]; changed = true;
  }));
  return changed;
}
// copies of programme sessions made before 1.5 kept the programme fields and were hidden everywhere:
// they become your own protocols (listed in Moji protokoli, kept when the pack is removed)
function repairCopies(){
  let own = false;
  Object.values(S.pr).forEach(p => {
    if (!p.program) return;
    const g = S.prog[p.program];
    if (g && (g.weeks || []).some(w => (w.sessions || []).some(x => x.pr === p.id))) return;
    ['program','week','slot','pack'].forEach(k => delete p[k]); own = true;
  });
  return own;
}
// 1.4.1 planned programme sessions by their own days (its builder offered them; its week plan counted every protocol's days).
// Since 1.5 a programme has its own days, each offering its next session: days found on its sessions move to the programme
// (all of them together), so a 1.4.1 plan keeps working, and the sessions keep none. Runs at every start; it only acts once.
function moveProgDays(){
  let moved = false;
  Object.values(S.pr).forEach(p => {
    const g = p.program && S.prog[p.program]; if (!g || !Array.isArray(p.days)) return;
    if (p.days.length) g.days = Array.from(new Set((g.days || []).concat(p.days))).filter(d => Number.isInteger(d) && d >= 0 && d < 7).sort((a, b) => a - b);
    delete p.days; moved = true;
  });
  return moved;
}
// stored data that can no longer be read is put aside (never overwritten) and you are told on the home screen
async function keepUnreadable(raw){
  let key = 'unreadable:' + Date.now();
  try { await IDB.put(key, raw); } catch(e){ key = null; try { localStorage.setItem('mt.data.v1.neispravno', raw); } catch(_){} }
  lsSet('mt.badStore', { at: Date.now(), key });
  S.badRaw = raw;
}
async function init(){
  OLD_KEYS.forEach(k => { try { localStorage.removeItem(k); } catch(e){} });
  S.settings = Object.assign({}, SETTINGS_BASE, cleanSettings(S.settings));
  let raw = null, d = null;
  try { raw = localStorage.getItem(STORE_KEY); } catch(e){}
  if (raw) { try { d = JSON.parse(raw); } catch(e){} if (!isPlainObj(d)) { d = null; await keepUnreadable(raw); } }
  const seed = window.SEED || {};
  if (!d) {
    applyData(clone(seed)); S._deleted = [];
    if (!raw) lsSet('mt.freshAt', Date.now());   // a new phone or cleared data: the home screen offers to restore a backup
    persist();
  } else {
    cleanFixes = 0; const c = cleanData(d); savedJson = raw;   // what is stored, also if the next save is refused
    applyData(c); S._deleted = c._deleted;
    const own = repairCopies(), moved = moveProgDays();
    if (mergeSeed(seed) || own || moved || cleanFixes) persist();
  }
  if (S.lib.cat === 'TAE' && !(S.pack && (S.pack.members || []).length)) { S.lib.cat = 'Sve'; lsSet('mt.libcat', 'Sve'); }
  S.dbState = 'ready';
  render();
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch(e){}
  loadMedia();
}
// a change counts only when it is stored: if the phone refuses it, the screen goes back to what is stored
async function save(coll, id, data){
  const map = collMap(coll);
  map[id] = Object.assign({}, data, { id });
  if (persist()) return true;
  const was = storedItem(coll, id); if (was) map[id] = was; else if (was === null) delete map[id];   // unknown: the screen keeps it
  softRender(); return false;
}
async function remove(coll, id){
  const map = collMap(coll), was = map[id], del = S._deleted;
  delete map[id]; S._deleted = (S._deleted||[]).concat([coll + '/' + id]);
  if (persist()) return true;
  if (was) map[id] = was; S._deleted = del;
  softRender(); return false;
}

/* ---------- backup and restore ---------- */
const fileDate = t => { const d = new Date(t), p = n => (n < 10 ? '0' : '') + n; return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()); };
// "2. 11." this year, "2. 11. 2025." otherwise (or always with the year)
const shortDate = (t, year) => { const d = new Date(t); return d.getDate() + '. ' + (d.getMonth() + 1) + '.' + (year || d.getFullYear() !== new Date().getFullYear() ? ' ' + d.getFullYear() + '.' : ''); };
// trainings in a history: a single exercise tried from the library or a test result is not a training
const nTrainings = log => (log || []).filter(l => l && l.kind !== 'exercise' && l.kind !== 'test').length;
// what replacing the data would erase from the history: entries of every kind that the incoming data does not have
const logKey = l => (l.at || 0) + '|' + (l.kind || '') + '|' + (l.refId || l.test || '');
const lostEntries = (log, incoming) => { const have = new Set((incoming || []).filter(Boolean).map(logKey)); return (log || []).filter(l => l && !have.has(logKey(l))); };
const lostText = lost => { const t = nTrainings(lost), r = lost.filter(l => l.kind === 'test').length, e = lost.filter(l => l.kind === 'exercise').length;
  const p = [t ? t + ' ' + plural(t, 'trening', 'treninga', 'treninga') : '', r ? r + ' ' + plural(r, 'rezultat testa', 'rezultata testa', 'rezultata testa') : '', e ? e + ' ' + plural(e, 'vježba iz knjižnice', 'vježbe iz knjižnice', 'vježbi iz knjižnice') : ''].filter(Boolean);
  return p.length > 1 ? p.slice(0, -1).join(', ') + ' i ' + p[p.length - 1] : p[0] || ''; };
// nothing of yours on the phone yet (a fresh start: no history or programme, nothing created, changed or deleted): an import
// then keeps no way back, since going back would only empty the app
const nothingOwn = () => !S.log.length && !(S._deleted || []).length && !Object.keys(S.prog).length &&
  ['exercises', 'protocols', 'field'].every(c => Object.values(collMap(c)).every(x => { const f = ((window.SEED || {})[c] || {})[x.id]; return !!f && contentHash(x) === contentHash(f); }));
const dataCounts = d => { const nPr = Object.values(d.protocols || {}).filter(p => !(p && p.program)).length, nG = Object.keys(d.programs || {}).length, nT = nTrainings(d.log);
  return nVj(Object.keys(d.exercises || {}).length) + ' • ' + nPr + ' ' + plural(nPr, 'protokol', 'protokola', 'protokola') + (nG ? ' • ' + nG + ' ' + plural(nG, 'program', 'programa', 'programa') : '') + ' • ' + nT + ' ' + plural(nT, 'trening', 'treninga', 'treninga') + ' u povijesti'; };
const backupObject = () => ({ kind: BACKUP_KIND, v: 1, app: APP_VERSION, exportedAt: new Date().toISOString(), exercises: S.ex, protocols: S.pr, field: S.field, programs: S.prog, log: S.log, _deleted: S._deleted || [], settings: S.settings });
// a backup is recognised by its content; the photo pack (also a .json file) is sent to its own row
function backupProblem(d){
  if (isPlainObj(d) && d.kind === PACK_KIND) return 'Ovo je paket slika, a ne sigurnosna kopija. Ništa nije promijenjeno. Paket se uvozi u retku „Uvezi paket slika”.';
  if (!isPlainObj(d) || (d.kind && d.kind !== BACKUP_KIND) || !(d.v === 1 || d.v === 2) || !isPlainObj(d.exercises) || !isPlainObj(d.protocols) || !Array.isArray(d.log)) return 'Ta datoteka nije sigurnosna kopija ove aplikacije. Ništa nije promijenjeno.';
  return '';
}
// iPhone: the share sheet ("Spremi u Datoteke"); elsewhere a download. The answer says what really happened.
async function shareOrDownload(name, body){
  for (const type of ['application/json', 'text/plain']) {
    let f = null; try { f = new File([body], name, { type }); } catch(e){ break; }
    let can = false; try { can = !!(navigator.share && navigator.canShare && navigator.canShare({ files: [f] })); } catch(e){}
    if (!can) continue;
    try { await navigator.share({ files: [f] }); return 'shared'; }
    catch(e){ if (e && e.name === 'AbortError') return 'cancelled'; if (e && e.name === 'InvalidStateError') return 'busy'; break; }   // busy: the sheet from the first tap is still open
  }
  try {
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([body], { type: 'application/json' })); a.download = name;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 60000);
    return 'downloaded';
  } catch(e){ return 'failed'; }
}
const EXPORT_MSG = { shared: 'Kopija je spremljena.', downloaded: 'Kopija je preuzeta: nađi je u mapi Preuzimanja.', cancelled: 'Izvoz je otkazan: kopija nije spremljena.', failed: 'Izvoz nije uspio: kopija nije spremljena.' };
// one quiet line on the home screen about your data: not saved, unreadable, a new start, or a backup that is due
function dataHint(){
  if (S.dbState !== 'ready') return '';
  const row = (cls, msg, btns) => '<div class="lift' + cls + '" style="margin:14px 16px 0"><div class="why" style="color:var(--text-body)">' + esc(msg) + '</div><div class="acts"' + (btns.length < 2 ? ' style="grid-template-columns:1fr"' : '') + '>' + btns.join('') + '</div></div>';
  if (S.saveFailed) return row(' warn', 'Zadnje promjene nisu spremljene: memorija aplikacije je puna. Izvezi sigurnosnu kopiju prije nego što zatvoriš aplikaciju.', ['<button class="bt amber" data-a="exportData">Izvezi kopiju</button>']);
  const bad = lsGet('mt.badStore', null);
  if (bad && !bad.seen) return row(' warn', 'Spremljeni podaci nisu se mogli pročitati, pa je aplikacija krenula ispočetka. Oštećeni podaci sačuvani su sa strane. Vrati zadnju sigurnosnu kopiju u Mojim podacima.', ['<button class="bt amber" data-a="dataSheet">Moji podaci</button>', '<button class="bt ghost" data-a="badSeen">U redu</button>']);
  const nT = nTrainings(S.log), last = lsGet('mt.lastBackupAt', 0), now = Date.now();
  if (!nT && !last && lsGet('mt.freshAt', 0)) return row(' go', 'Novi mobitel ili obrisani podaci? Ako imaš sigurnosnu kopiju (moj-trening-kopija-….json), vrati je i nastavi gdje si stao.',
    ['<label class="bt" for="importFile2" style="display:flex;align-items:center;justify-content:center;cursor:pointer">Vrati kopiju</label><input id="importFile2" class="vsr" type="file" accept="application/json,.json">', '<button class="bt ghost" data-a="freshSeen">Ne treba</button>']);
  if (nT && now - last > 30 * DAY_MS && now - lsGet('mt.backupLater', 0) > 7 * DAY_MS)
    return row('', (last ? 'Zadnja sigurnosna kopija: ' + shortDate(last) + ' Izvezi novu' : 'Još nemaš sigurnosnu kopiju. Izvezi je') + ' u Datoteke da ne izgubiš povijest treninga.', ['<button class="bt" data-a="exportData">Izvezi kopiju</button>', '<button class="bt ghost" data-a="backupLater">Kasnije</button>']);
  return '';
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
// the builder and the exercise editor carry the draft's id, so each protocol and exercise keeps its own scroll position
function viewKey(){ const t = top(); return t.v + ':' + (t.id || ''); }
// Keyboard and VoiceOver focus survives the rebuild: the control with the same data-a and data-* gets it back (else the
// first control of the new screen); "Natrag" returns it to the control that opened the screen. A sheet takes focus when it
// opens (its title) and gives it back to its opener when it closes; the screen behind an open sheet is inert. A tap on a
// phone focuses nothing, so nothing moves for touch.
let sheetOpener = null, sheetKindWas = null;
const focusMem = {};   // per screen: the control that had focus when you left it
const dsKey = el => Object.keys(el.dataset).sort().map(k => k + '=' + el.dataset[k]).join('&');
function focusKey(el){
  if (!el || !app.contains(el)) return null;
  if (el.id === 'sheet-h') return { sheet: 1 };
  if (el.dataset && el.dataset.a && el.dataset.a !== 'sheetClose') return { a: el.dataset.a, ds: dsKey(el) };
  if (el.id && el.type === 'file') return { id: el.id };   // the hidden file field behind "Uvezi kopiju" and similar
  return null;
}
// root: the open sheet, so a control with the same data-* on the inert screen behind it is never picked
function focusEl(k, root){
  if (!k) return null;
  if (k.sheet) return document.getElementById('sheet-h');
  if (k.id) return document.getElementById(k.id);
  for (const el of (root || app).querySelectorAll('[data-a]')) if (el.dataset.a === k.a && dsKey(el) === k.ds) return el;
  return null;
}
function refocus(fk, key){
  const sheet = app.querySelector('.sheet'), kind = S.sheet ? S.sheet.kind : null;
  if (sheet) for (const el of app.children) if (!el.classList.contains('sheet-bg') && !el.classList.contains('toast')) el.inert = true;
  const first = sheet ? () => document.getElementById('sheet-h') || sheet.querySelector('[data-a]') : () => app.querySelector('.view [data-a]');
  let el = null;
  if (sheet && kind !== sheetKindWas) { if (!sheetKindWas) sheetOpener = fk; el = first(); }   // a sheet opened (or another one replaced it)
  else if (!sheet && sheetKindWas) { if (sheetOpener) el = focusEl(sheetOpener) || first(); sheetOpener = null; }   // it closed
  else if (fk) el = (fk.a === 'back' && focusEl(focusMem[key])) || focusEl(fk, sheet) || first();
  sheetKindWas = kind;
  if (el && el !== document.activeElement) try { el.focus({ preventScroll: true }); } catch(e){}
}
// the 12-week consistency grid read as one picture: how many of its days have a training (cells l2/l3 of the grid markup)
function heatLabel(heat){ const n = (String(heat).match(/class="[^"]*\bl[23]\b[^"]*"/g) || []).length; return 'Zadnjih 12 tjedana: ' + n + ' ' + plural(n, 'dan', 'dana', 'dana') + ' s treningom'; }
function render(){
  if (pendingExt && !appBusy()) takeOtherCopy();
  const key = viewKey();
  const fk = focusKey(document.activeElement);
  if (fk && fk.a && app.dataset.key && app.dataset.key !== key) focusMem[app.dataset.key] = fk;
  const old = app.querySelector('.view');
  if (old && app.dataset.key) scrollMem[app.dataset.key] = old.scrollTop;
  const t = top();
  const fn = VIEWS[t.v] || VIEWS.home;
  let html;
  // one damaged value must not take the whole app down: the screen says so, the rest keeps working
  try { html = fn(t); }
  catch(e){ console.error('view failed', t.v, e); html = '<div class="view gut">' + topbar(S.stack.length > 1 ? backBtn() : '') + '<div class="empty">Ovaj zaslon se ne može prikazati: neki spremljeni podaci su neispravni. Ostatak aplikacije radi.<button class="txtbtn" data-a="dataSheet">Moji podaci</button></div></div>'; }
  const rootView = (t.v === 'home' || t.v === 'protocols' || t.v === 'library' || t.v === 'progress') && !S.pick;
  if (rootView) html += tabbar();
  if (S.sheet) { try { html += sheetHtml(); } catch(e){ console.error('sheet failed', e); S.sheet = null; } }
  if (S.toast) html += '<div class="toast" role="' + (S.toastErr ? 'alert' : 'status') + '">' + esc(S.toast) + '</div>';
  app.innerHTML = html;
  app.dataset.key = key;
  const v = app.querySelector('.view');
  if (v && scrollMem[key] != null) v.scrollTop = scrollMem[key];
  after(t);
  refocus(fk, key);
}
function go(entry){ S.stack.push(entry); S.sheet = null; render(); }
function back(){ if (S.stack.length > 1) S.stack.pop(); S.sheet = null; render(); }
function setTab(tab){ S.tab = tab; S.pick = null; S.stack = [{v: tab}]; S.sheet = null; render(); }
let toastTimer = null;
// a short message; a problem (err) stays longer, and a routine message from the same tap is dropped (e.g. a success
// toast after a save the phone refused)
let actionSeq = 0, toastErrSeq = -1;   // actionSeq counts taps and file choices
function clearToast(){ clearTimeout(toastTimer); S.toast = null; S.toastErr = false; const el = app.querySelector('.toast'); if (el) el.remove(); }
function toast(msg, err){
  if (!err && S.toast && S.toastErr && toastErrSeq === actionSeq) return;
  S.toast = msg; S.toastErr = !!err; if (err) toastErrSeq = actionSeq; clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { S.toast = null; S.toastErr = false; const el = app.querySelector('.toast'); if (el) el.remove(); },
    err ? 8000 : Math.min(6000, Math.max(2600, msg.length * 50)));
  const el = app.querySelector('.toast'), role = err ? 'alert' : 'status';
  if (el) { el.textContent = msg; el.setAttribute('role', role); } else app.insertAdjacentHTML('beforeend', '<div class="toast" role="' + role + '">' + esc(msg) + '</div>');
}

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
// the local midnight n calendar days after the day of t: days and weeks are counted on the calendar, never in 24-hour
// steps, so a clock change (a 23- or 25-hour day) does not move a session into another day or week
function calDay(t, n){ const d = new Date(t); d.setHours(0,0,0,0); if (n) d.setDate(d.getDate() + n); return d.getTime(); }
function weekStart(t){ const d = new Date(t); d.setHours(0,0,0,0); d.setDate(d.getDate() - dayIdx(d)); return d.getTime(); }
// a training: a session of a protocol, a programme or a field plan. A single exercise tried from the library and a test
// result are not trainings (the same rule as nTrainings); they still count in the exercise's own history and your kilograms.
const isTraining = l => !!l && l.kind !== 'exercise' && l.kind !== 'test';
function planSlots(){
  const out = [];
  Object.values(S.pr).forEach(p => { if (!p.program) (p.days||[]).forEach(day => out.push({ day, kind:'protocol', id:p.id, name:p.name, min: protoMin(p) })); });
  Object.values(S.field).forEach(f => (f.days||[]).forEach(day => out.push({ day, kind:'field', id:f.id, name:f.name_hr, min: fieldMin(f) })));
  // a programme's days (e.g. TAE): each planned day is the programme's next session (named in weekStatus); a programme with no
  // session left keeps the days its sessions of this week fill, so the session that finished it still counts this week
  Object.values(S.prog).forEach(g => { if ((g.days||[]).length) (progStatus(g).next ? g.days : progDaysDone(g)).forEach(day => out.push({ day, kind:'program', id:g.id, name:g.name || '', min:'' })); });
  return out.sort((a,b) => a.day - b.day || a.name.localeCompare(b.name, 'hr'));
}
// the programme's days up to today that this week's sessions of it fill, matched as weekStatus does (the same day first)
function progDaysDone(g){
  const ws = weekStart(Date.now()), today = dayIdx(Date.now()), days = g.days.filter(d => d <= today);
  const left = S.log.filter(l => isTraining(l) && l.at >= ws && slotHit({ kind:'program', id:g.id }, l)).map(l => dayIdx(l.at));
  const keep = days.filter(d => { const k = left.indexOf(d); if (k === -1) return false; left.splice(k, 1); return true; });
  days.forEach(d => { if (keep.indexOf(d) === -1 && left.length) { left.pop(); keep.push(d); } });
  return keep.sort((x, y) => x - y);
}
// does log entry l fill plan slot s: the same protocol or field session; for a programme, any of its sessions
const slotHit = (s, l) => s.kind === 'program' ? l.kind === 'protocol' && !!S.pr[l.refId] && S.pr[l.refId].program === s.id : l.refId === s.id && l.kind === s.kind;
// what a slot opens: the session itself (for a programme its next session, or the programme when none is left)
const slotOpen = s => s.kind === 'field' ? 'data-a="openField" data-id="'+esc(s.id)+'"' : s.kind === 'program' && !s.pr ? 'data-a="openProg" data-id="'+esc(s.id)+'"' : 'data-a="openPr" data-id="'+esc(s.kind === 'program' ? s.pr : s.id)+'"';
// a planned session counts as done when you trained it on any day of that week; each log entry fills one slot. Sessions
// done on their planned day fill that day first, so a session done today never fills an earlier missed day instead.
function weekStatus(ws, plan){
  const we = calDay(ws, 7), log = S.log.filter(l => isTraining(l) && l.at >= ws && l.at < we);
  const used = {}, slots = (plan || planSlots()).map(p => Object.assign({ done: false }, p));
  [true, false].forEach(sameDay => slots.forEach(s => { if (s.done) return;
    const k = log.findIndex((l, i) => !used[i] && slotHit(s, l) && (!sameDay || dayIdx(l.at) === s.day));
    if (k !== -1) { used[k] = 1; s.done = true; s.l = log[k]; } }));
  // this week's programme slots: the session you did, otherwise the programme's next sessions in order, today's slot first,
  // then the missed days (made up next), then the days to come: today never offers a later session than the programme page
  if (ws === weekStart(Date.now())) { const next = {}, today = dayIdx(Date.now()), rank = s => s.day === today ? 0 : s.day < today ? 1 : 2;
    slots.slice().sort((a, b) => rank(a) - rank(b) || a.day - b.day).forEach(s => { if (s.kind !== 'program') return;
      const x = s.l ? { pr: s.l.refId } : (next[s.id] = next[s.id] || (S.prog[s.id] ? progStatus(S.prog[s.id]).items.filter(y => !y.done && S.pr[y.pr]) : [])).shift();
      const p = x && S.pr[x.pr]; if (p) Object.assign(s, { pr: x.pr, name: p.name, min: protoMin(p) }); else if (s.l) s.name = s.l.name;
    }); }
  return { slots, log, planned: slots.length, done: slots.filter(s => s.done).length };
}
// the plan of each week as this phone showed it (localStorage): a past week is judged by the plan you had then, so adding
// a training day today does not break your streak; weeks from before (or another phone) use today's plan. The days of a
// programme that is no longer on the phone (pack removed) are left out: its sessions can no longer be recognised.
const PLAN_KEY = 'mt.weeks';
function planSnaps(){
  const o = lsGet(PLAN_KEY, null), out = {};
  if (isPlainObj(o)) Object.keys(o).forEach(k => { const v = o[k]; if (!Array.isArray(v)) return;
    const s = v.filter(x => Array.isArray(x) && typeof x[1] === 'string' && Number.isInteger(x[2]) && x[2] >= 0 && x[2] < 7 && (x[0] !== 'g' || !!S.prog[x[1]]))
      .map(x => ({ kind: x[0] === 'f' ? 'field' : x[0] === 'g' ? 'program' : 'protocol', id: x[1], day: x[2] }));
    if (s.length) out[k] = s; });
  return out;
}
function notePlan(ws, plan){
  const o = lsGet(PLAN_KEY, null), m = isPlainObj(o) ? o : {}, v = plan.map(s => [s.kind === 'field' ? 'f' : s.kind === 'program' ? 'g' : 'p', s.id, s.day]);
  if (JSON.stringify(m[ws] || []) === JSON.stringify(v)) return;
  if (v.length) m[ws] = v; else delete m[ws];
  const old = calDay(ws, -7 * 105); Object.keys(m).forEach(k => { if (!(+k >= old)) delete m[k]; });
  lsSet(PLAN_KEY, m);
}
// this week's plan: a day that has passed keeps the plan this phone had on it (a day added afterwards is neither missed nor
// counted, so a plan changed late in the week never rewrites how that week ends); today and the days to come follow the plan
// as it is now. Sessions or programmes no longer on the phone leave their past days out.
function weekPlan(ws, plan){
  plan = plan || planSlots();
  const was = ws === weekStart(Date.now()) ? planSnaps()[ws] : null; if (!was) return plan;
  const today = dayIdx(Date.now());
  const past = was.filter(x => x.day < today).map(x => {
    const p = x.kind === 'protocol' && S.pr[x.id], f = x.kind === 'field' && S.field[x.id], g = x.kind === 'program' && S.prog[x.id];
    return p && !p.program ? { day: x.day, kind: x.kind, id: x.id, name: p.name, min: protoMin(p) } : f ? { day: x.day, kind: x.kind, id: x.id, name: f.name_hr, min: fieldMin(f) }
      : g ? { day: x.day, kind: x.kind, id: x.id, name: g.name || '', min: '' } : null;
  }).filter(Boolean);
  return past.concat(plan.filter(s => s.day >= today)).sort((a, b) => a.day - b.day || a.name.localeCompare(b.name, 'hr'));
}
function streakWeeks(plan){
  plan = plan || planSlots();
  const tl = S.log.filter(isTraining);
  if (!plan.length || !tl.length) return 0;
  const now = weekStart(Date.now()), first = weekStart(tl[tl.length - 1].at), snap = planSnaps(); let n = 0;
  for (let ws = calDay(now, -7); ws >= first; ws = calDay(ws, -7)) { const s = weekStatus(ws, snap[ws] || plan); if (s.done >= s.planned) n++; else break; }
  const cur = weekStatus(now, weekPlan(now, plan));
  return n + (cur.done >= cur.planned ? 1 : 0);
}
// match day (Doziranje, your usual week), by the rule of weekAdvice: heavy legs at the latest 4 days before the match,
// 2 days before a lighter session with explosive work, the day before only activation
const heavyLegs = p => (p.items || []).some(it => { const e = S.ex[it.exId]; return !!e && (it.exId === 'nordic-curl' || (e.cat === 'Snaga' && loaded(e) && LOWER_ZONES.indexOf((e.zones || [])[0]) !== -1)); });
const gymLike = p => p.tag === 'Teretana' || (p.items || []).some(it => { const e = S.ex[it.exId]; return !!e && e.cat === 'Snaga' && loaded(e); });
// matches: the standing match day (Doziranje) every week, plus dates marked in the day sheet or in Doziranje. settings.matchDates
// is a flat map 'YYYY-MM-DD' → 1 (a match that day) or 0 (no match on the standing day that week); it goes into backups.
const dateKey = t => { const d = new Date(t); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const matchDates = () => isPlainObj(S.settings.matchDates) ? S.settings.matchDates : {};
const matchOn = t => { const v = matchDates()[dateKey(t)]; return v === 1 ? true : v === 0 ? false : dayIdx(t) === matchDay(); };
function setMatchDate(t, on){
  const m = Object.assign({}, matchDates()), k = dateKey(t), old = dateKey(calDay(Date.now(), -56));
  if (on === (dayIdx(t) === matchDay())) delete m[k]; else m[k] = on ? 1 : 0;
  Object.keys(m).forEach(x => { if (x < old) delete m[x]; });
  S.settings.matchDates = m; lsSet('mt.settings', S.settings);
}
// the days (0 = Monday) of the week that starts at ws with a match
const weekMatches = ws => [0, 1, 2, 3, 4, 5, 6].filter(i => matchOn(calDay(ws, i)));
// from day i of the week ws: days to the next match (0 = that day) and since the last one, looking a week each way; -1 = none
function matchGap(ws, i){
  const t = calDay(ws, i); let next = -1, prev = -1;
  for (let k = 0; k <= 7 && next < 0; k++) if (matchOn(calDay(t, k))) next = k;
  for (let k = 1; k <= 7 && prev < 0; k++) if (matchOn(calDay(t, -k))) prev = k;
  return { next, prev };
}
// in season: a standing match day, or a match this week (then Kreni on a field session starts the season dose)
const inSeason = () => matchDay() >= 0 || weekMatches(weekStart(Date.now())).length > 0;
const daysList = (l, w) => l.map(i => DAYS_IN[i]).join(', ').replace(/, (?=[^,]*$)/, w || ' i ');
// the lightest field session for a week with two matches: intensity nizak, the fewest metres
function lightField(){
  return Object.values(S.field).map(f => ({ f, a: fieldLoad(f) })).filter(x => x.a.li === 0 && x.a.type !== 'test').sort((a, b) => a.a.m - b.a.m)[0] || null;
}
const TWO_FIELD = 'Ovaj tjedan imaš dvije utakmice, pa na terenu samo lagani trening (intenzitet nizak).';
const nMatches = n => (n === 2 ? 'dvije' : n === 3 ? 'tri' : n) + ' utakmice';
// a field session of intensity li on day i of the week ws: never the day before a match; umjeren and harder at the latest 3 days
// before it and not the day after; in a week with two matches only nizak. '' when it fits.
function fieldMatchNote(li, i, ws){
  const g = matchGap(ws, i);
  if (g.next < 0 && g.prev < 0) return '';
  if (g.next === 0) return li ? 'Danas je utakmica: ovaj trening preskoči ili ga pomakni na drugi dan.' : '';
  if (g.next === 1) return 'Sutra je utakmica: danas bez sprintova i intervala, samo aktivacija.';
  if (li && weekMatches(ws).length >= 2) { const l = lightField(); return TWO_FIELD + (l ? ' Umjesto ovoga odradi „' + l.f.name_hr + '”.' : ' Ovaj preskoči.'); }
  if (g.next === 2 && li) return 'Utakmica je za 2 dana: ovaj trening ' + (li >= 2 ? 'najkasnije 3 dana prije utakmice, najbolje 4.' : 'najkasnije 3 dana prije utakmice ili 2 dana nakon nje.');
  if (g.prev === 1 && li) return 'Jučer je bila utakmica: danas oporavak, ovaj trening najranije 2 dana nakon utakmice.';
  return '';
}
// the warning for a planned session on day i (0 = Monday) of this week, '' when it fits the match week (all its matches)
function matchNote(s, i){
  const ws = weekStart(Date.now()), g = matchGap(ws, i);
  if (g.next < 0 && g.prev < 0) return '';
  if (s.kind === 'field') {   // by the session's intensity (fieldLoad); at most one extra field session a week
    const f = S.field[s.id];
    if (!f) return '';
    const n = fieldMatchNote(fieldInt(f), i, ws);
    if (n || g.next === 0) return n;
    const fs = planSlots().filter(x => x.kind === 'field');
    if (fs.length > 1 && fs[0].day !== i) return 'U sezoni najviše jedan dodatni trening na terenu tjedno: ovaj preskoči ili ga zamijeni lakšim.';
    return '';
  }
  const p = s.kind === 'protocol' ? S.pr[s.id] : s.kind === 'program' ? S.pr[s.pr] : null;
  if (!p) return '';
  const d = g.next, heavy = heavyLegs(p), wm = weekMatches(ws);
  if (d === 0 && (heavy || gymLike(p))) return 'Danas je utakmica: ovaj trening preskoči ili ga pomakni na drugi dan.';
  if (d === 1 && (heavy || gymLike(p))) return 'Sutra je utakmica: danas bez teških nogu, samo aktivacija.';
  if (heavy && wm.some(x => x < i) && wm.some(x => x > i)) return 'Između dviju utakmica bez teških nogu: danas lakši trening s eksplozivnošću ili mobilnost.';
  if (d === 2 && heavy) return 'Utakmica je za 2 dana: danas bez teških nogu, lakši trening s eksplozivnošću.';
  if (d === 3 && heavy) return 'Utakmica je za 3 dana: teški trening nogu najkasnije 4 dana prije utakmice.';
  return '';
}
// a warning box on the home screen and in the day sheet; the day before a match it offers your activation instead, in a
// week with two matches the lightest field session
function matchBox(note, i, mg){
  if (!note) return '';
  const akt = matchGap(weekStart(Date.now()), i).next === 1 && Object.values(S.pr).find(p => p.home === 'aktivacija');
  const lf = !akt && note.indexOf(TWO_FIELD) === 0 && lightField();
  const bt = akt ? '<button class="bt ghost" data-a="openPr" data-id="' + esc(akt.id) + '">' + esc(akt.name) + ' · ' + protoMin(akt) + ' min</button>'
    : lf ? '<button class="bt ghost" data-a="openField" data-id="' + esc(lf.f.id) + '">' + esc(lf.f.name_hr) + ' · ' + esc(fieldMin(lf.f)) + ' min</button>' : '';
  return '<div class="lift warn" style="margin:' + (mg || '0') + '"><div class="why" style="color:var(--text-body)">' + esc(note) + '</div>' + (bt ? '<div class="acts" style="grid-template-columns:1fr">' + bt + '</div>' : '') + '</div>';
}
function weekHtml(){
  if (S.dbState !== 'ready') return '';
  const now = Date.now(), ws = weekStart(now), today = dayIdx(now), wm = weekMatches(ws);
  const cur = planSlots(), plan = weekPlan(ws, cur); notePlan(ws, plan);
  const st = weekStatus(ws, plan);
  const trainedDays = {}; st.log.forEach(l => trainedDays[dayIdx(l.at)] = 1);
  const strip = '<div class="week" role="group" aria-label="Ovaj tjedan">' + DAYS.map((L, i) => {
    const d = new Date(calDay(ws, i));
    const plan = st.slots.filter(s => s.day === i);
    const missed = i < today && plan.some(s => !s.done);
    const cls = trainedDays[i] ? 'done' : missed ? 'miss' : plan.length ? 'plan' : '';
    const label = DAYNAMES[i] + ' ' + d.getDate() + '.' + (trainedDays[i] ? ', odrađeno' : missed ? ', propušteno' : plan.length ? ', planirano' : '') + (wm.indexOf(i) !== -1 ? ', utakmica' : '');
    // a match day (the standing one or a marked date) carries a small dot under its date (flex:none: the done screen's .done{flex:1} must not stretch the circles)
    return '<button class="wd" data-a="daySheet" data-i="'+i+'"' + (i === today ? ' aria-current="date"' : '') + ' aria-label="'+esc(label)+'"><span class="l">'+L+'</span><span class="c '+cls+'" style="flex:none">'+d.getDate()+'</span>' + (wm.indexOf(i) !== -1 ? '<i style="display:block;width:6px;height:6px;margin-top:-2px;border-radius:3px;background:#FFC861"></i>' : '') + '</button>';
  }).join('') + '</div>';
  const todo = st.slots.filter(s => s.day === today && !s.done);
  const missed = st.slots.filter(s => s.day < today && !s.done);
  const row = (s, pre) => '<button class="row today" '+slotOpen(s)+'><span class="thumb" style="width:52px;height:52px">'+pathIcon(s.kind === 'field' ? I.run : I.dumb, 24)+'</span><span class="tx"><span class="t">'+esc(pre + s.name)+'</span><span class="m">'+(s.min ? '<span>'+esc(s.min)+' min</span>' : '')+'</span></span>'+I.chev+'</button>';
  const shown = todo.length ? todo : missed.slice(0, 1);
  const rows = shown.map(s => row(s, todo.length ? 'Danas: ' : 'Nadoknadi: ')).join('') + matchBox(shown.map(s => matchNote(s, today)).find(Boolean), today);
  const sk = streakWeeks(cur);
  const line = st.planned
    ? 'Ovaj tjedan ' + st.done + '/' + st.planned + (sk ? ' • niz: ' + sk + ' ' + plural(sk, 'tjedan', 'tjedna', 'tjedana') + ' po planu' : '') + (!todo.length && st.slots.some(s => s.day === today) ? ' • danas odrađeno' : '')
    : 'Odaberi dane u protokolu i složi svoj tjedni plan';
  return strip + '<p class="sub wline">' + esc(line) + '</p>' + (rows ? '<div class="list" style="margin:12px 16px 0">' + rows + '</div>' : '');
}

/* ---------- views ---------- */
const VIEWS = {};

// your gym strength sessions (Trening A, B, C or your own), the ones the home "Teretana" card offers
const gymSession = p => !p.program && (p.tag === 'Teretana' || gymProto(p)) && (p.items || []).some(it => (S.ex[it.exId] || {}).cat === 'Snaga');
// the gym session to do next: the one trained longest ago
function nextGym(){
  const last = {};
  S.log.forEach(l => { if (l.kind === 'protocol' && l.refId && !(last[l.refId] >= l.at)) last[l.refId] = l.at; });
  return Object.values(S.pr).filter(gymSession).sort((a, b) => (last[a.id] || 0) - (last[b.id] || 0) || String(a.name).localeCompare(b.name, 'hr'))[0] || null;
}
VIEWS.home = function(){
  const rehab = Object.values(S.pr).find(p => p.home === 'rehab');
  const akt = Object.values(S.pr).find(p => p.home === 'aktivacija');
  const last = S.log.find(isTraining);
  // the gym card while your week plan has no gym session (a planned one is opened from the "Danas" row and the day sheet)
  // (a programme finished this week keeps the days it filled in the plan, but has nothing left to open: it does not count here)
  const gym = planSlots().some(s => (s.kind === 'program' && !!S.prog[s.id] && !!progStatus(S.prog[s.id]).next) || (s.kind === 'protocol' && !!S.pr[s.id] && gymSession(S.pr[s.id]))) ? false : nextGym();
  const cards = [
    { k:'rehab', t:'Rehab kuka', s: rehab ? 'Moj protokol · ' + protoMin(rehab) + ' min' : 'Moje vježbe za kuk', bg:'#5B5148', ic:I.pulse, a: rehab ? {a:'openPr', id: rehab.id} : {a:'libCat', cat:'Rehab kuka'} },
    gym === false ? null : { k:'teretana', t:'Teretana', s: gym ? 'Sljedeći: ' + gym.name : 'Treninzi snage', bg:'#38425A', ic:I.dumb, a: gym ? {a:'openPr', id: gym.id} : {a:'tab', tab:'protocols'} },
    { k:'aktivacija', t:'Aktivacija', s:'Uže i kolotur · prije treninga', bg:'#3A3F47', ic:I.rope, a: akt ? {a:'openPr', id: akt.id} : {a:'libCat', cat:'Uže i kolotur'} },
    { k:'kondicija', t:'Kondicija', s:'Na terenu · STATSports', bg:'#33404A', ic:I.run, a:{a:'fieldList'} },
    { k:'knjiznica', t:'Knjižnica', s: Object.keys(S.ex).length ? nVj(Object.keys(S.ex).length) : 'Moje vježbe', bg:'#2B2F37', ic:I.book, a:{a:'tab', tab:'library'} }
  ].filter(Boolean);
  const attrs = o => Object.keys(o).map(k => (k==='a' ? 'data-a' : 'data-'+k) + '="' + esc(o[k]) + '"').join(' ');
  // a card's cover picture (media.js EXCOVERS, portrait) fills the whole card under the same scrim; without one: colour and icon
  const covers = window.EXCOVERS || {}, cover = c => typeof covers[c.k] === 'string' && covers[c.k] ? '<img class="cov" alt="" decoding="async" src="' + esc(covers[c.k]) + '">' : '';
  return '<div class="view" style="background:radial-gradient(circle at 100% 0%, #24314A 0%, #1C2230 28%, #191D25 52%)">' +
    topbar('', '<button class="ib" data-a="dataSheet" aria-label="Podaci i sigurnosna kopija">' + I.gear + '</button>', 'MOJ TRENING') +
    '<h1 class="greet">Bok, Tomislav</h1>' +
    weekHtml() + dataHint() +
    '<div class="carousel" id="car" aria-label="Kategorije treninga">' +
      cards.map(c => '<button class="hcard' + (cover(c) ? ' cv' : '') + '" style="background:' + c.bg + '" ' + attrs(c.a) + '><span class="ic">' + pathIcon(c.ic, 96) + '</span>' + cover(c) + '<span class="sc"></span><span class="tt"><b>' + esc(c.t) + '</b><span>' + esc(c.s) + '</span></span></button>').join('') +
    '</div>' +
    '<div class="dots" id="dots" role="group" aria-label="Odaberi karticu">' + cards.map((c,i) => '<button class="dot" data-a="dot" data-i="'+i+'" aria-label="'+esc(c.t)+'"'+(i===0?' aria-current="true"':'')+'><i></i></button>').join('') + '</div>' +
    (last ? '<p class="sub" style="text-align:center;margin:8px 0 0">Zadnji trening: ' + esc(last.name) + ' · ' + esc(shortDate(last.at)) + '</p>' : '') +
  '</div>';
};

// Moji protokoli: Trening A, B, C on top in their order, then the rest by last use (trained or changed);
// ones never used keep the shipped order (the seed numbers them 1–10)
function protoListOrder(list){
  const last = {}; S.log.forEach(l => { if (l.kind === 'protocol' && l.refId && !(last[l.refId] >= l.at)) last[l.refId] = l.at; });
  const abc = p => /^trening [a-z]\b/i.test(p.name || '') ? 1 : 0, used = p => Math.max(last[p.id] || 0, (p.updatedAt || 0) > 1e9 ? p.updatedAt : 0);
  return list.sort((a, b) => abc(b) - abc(a) || (abc(a) ? String(a.name).localeCompare(b.name, 'hr', { numeric: true }) : used(b) - used(a) || (a.updatedAt || 0) - (b.updatedAt || 0) || String(a.name).localeCompare(b.name, 'hr')));
}
VIEWS.protocols = function(){
  const list = protoListOrder(Object.values(S.pr).filter(p => !p.program));
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
      '<div class="list" style="margin-top:14px"><button class="row" data-a="fieldList"><span class="thumb" style="background:#33404A">' + pathIcon(I.run, 28) + '</span><span class="tx"><span class="t">Treninzi na terenu</span><span class="m"><span>' + (fieldN ? fieldN + ' ' + plural(fieldN,'trening','treninga','treninga') : 'Učitavanje') + '</span><span class="tag">STATSports</span></span></span>' + I.chev + '</button></div>'
    )) +
    '<div style="height:16px"></div></div>' +
    '<div class="footer gut"><button class="btn" data-a="newPr">' + I.plus.replace('<svg', '<svg width="18" height="18"') + 'Novi protokol</button></div>';
};

// search also knows the words people use for the same thing: English equipment names, everyday words for body zones
const LIB_SYN = { 'Core':'trup trbuh trbusnjaci', 'Trup':'core trbuh trbusnjaci', 'Lisni mišić':'list listovi listove listova', 'Girja':'kettlebell', 'Bučice':'dumbbell', 'Šipka':'barbell', 'Medicinka':'medicine ball', 'Čunjevi':'cones', 'Kotač':'ab wheel' };
const libSearchText = s => norm(s).replace(/dj/g, 'd');   // "ledja" finds "leđa"
function libFiltered(){
  const words = libSearchText(S.lib.q).split(/\s+/).filter(Boolean), c = S.lib.cat, eq = S.lib.eq || [];
  const syn = a => a.map(x => LIB_SYN[x] || '').join(' ');
  return Object.values(S.ex).filter(e => {
    // the search text holds the equipment tags themselves (Čunjevi, Bučice…) and their synonyms
    if (words.length) { const z = e.zones || [], q = exEquip(e), hay = libSearchText([e.name, e.alt, e.equipment, z.join(' '), syn(z), e.cat, syn([e.cat]), q.join(' '), syn(q), e.feel].join(' ')); if (!words.every(w => hay.indexOf(w) !== -1)) return false; }
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
  const prN = Object.values(S.pr).filter(p => !p.program).length;   // as listed in Moji protokoli: a programme's sessions are not yours
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

const stillMotion = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
// a demo loops silently; with Reduce motion on it stays on its first frame and plays only from its controls
function videoTag(m){ return '<video src="'+esc(m.src)+'"'+(m.poster ? ' poster="'+esc(m.poster)+'"' : '')+(stillMotion() ? ' controls preload="metadata"' : ' autoplay loop')+' muted playsinline></video>'; }
// licensed media: the chip opens "Izvor i licenca" (author, licence, source, changes); the private pack only names itself
function creditHtml(m){
  if (!m || !m.credit) return '';
  return m.lic ? '<button class="credit" data-a="credit" data-id="'+esc(m.cid)+'" aria-label="Izvor i licenca: '+esc(m.credit)+'">'+esc(m.credit)+'</button>' : '<span class="credit">'+esc(m.credit)+'</span>';
}
function swapHtml(e, m){
  if (!m || m.n < 2) return '';
  const v = m.next.type === 'video';
  return '<button class="swapm" data-a="mediaSwap" data-id="'+esc(e.id)+'" aria-label="'+(v ? 'Prikaži video' : 'Prikaži drugu sliku')+'">'+(v ? 'Video' : 'Slika')+'</button>';
}
function mediaHtml(e, badge, inPlayer){
  const m = exMedia(e); let inner, credit = '';
  if (m) {
    inner = m.type === 'image' ? '<img class="fit" alt="'+(m.two ? esc(e.name + ': lijevo početni, desno završni položaj') : '')+'" src="'+esc(m.src)+'">' : videoTag(m);
    credit = creditHtml(m) + swapHtml(e, m);
  } else inner = '<div class="ph">' + pathIcon(catIcon(e && e.cat), 44) + (inPlayer ? '' : '<span>Dodaj svoj video ili sliku u uređivanju</span>') + '</div>';   // mid-workout only the icon
  return '<div class="media'+(m && m.two ? ' two' : '')+'">' + inner + credit + (badge ? '<span class="badge">'+esc(badge)+'</span>' : '') + '</div>';
}
// the protocol header: the first exercise's best media, whole (a two-panel picture is never cropped), with its credit and poster
function heroHtml(p, fm){
  if (!fm) return '<div class="hero"><span class="ic">'+pathIcon(p.home==='aktivacija'?I.rope:p.home==='rehab'?I.pulse:I.dumb,110)+'</span><span class="fade"></span></div>';
  const el = fm.type === 'image' ? '<img alt="" src="'+esc(fm.src)+'">'
    : !stillMotion() ? videoTag(fm)
    : fm.poster ? '<img alt="" src="'+esc(fm.poster)+'">' : '<video src="'+esc(fm.src)+'#t=0.5" preload="metadata" muted playsinline></video>';
  return '<div class="hero'+(fm.two ? ' two' : '')+'">' + el + '<span class="fade"></span>' + creditHtml(fm) + '</div>';
}
// "Izvor i licenca" sheet for one licensed demo; the full list is MEDIA-LICENSES.md in the repository
function creditSheet(s){
  const L = ((window.EXMEDIA || {})[s.id] || {}).lic; if (!L) return '';
  const a = (t, u) => '<a href="'+esc(u)+'" target="_blank" rel="noopener">'+esc(t)+'</a>';
  const row = (k, v) => '<span class="lb">'+k+'</span><p>'+v+'</p>';
  const dv = window.EXMEDIA_DVIDS;
  return '<h3>Izvor i licenca</h3><div class="lic">' + (L.title ? row('Djelo', '„'+esc(L.title)+'”') : '') + row('Autor', esc(L.author)) +
    row('Licenca', L.licenseUrl ? a(L.license, L.licenseUrl) : esc(L.license)) + row('Izvor', (L.source || []).map(x => a(x[0], x[1])).join(' · ')) +
    (L.changes ? row('Izmjene', esc(L.changes)) : '') + (L.dvids && dv ? '<p class="dv">„'+esc(dv.en)+'” '+esc(dv.hr)+'</p>' : '') +
    '<p class="all">'+a('Sve licence slika i snimki', 'https://github.com/hara93/moj-trening/blob/main/MEDIA-LICENSES.md')+'</p></div>';
}
function historyOf(exId){
  const out = [];
  S.log.forEach(l => (l.items||[]).forEach(it => { if (it.exId === exId && !it.skipped) out.push(Object.assign({ at: l.at }, it)); }));
  return out; // newest first, like the log (skipped exercises left out)
}
// the chips under the name: more sets, or longer holds; intervals (4 or more timed sets, e.g. 30/30) keep their work
// time and add sets, so "8 × 30 s" never turns into 8 × 60 s
function doseOptions(e){
  if (e.measure === 'time') { const b = e.sec||30, n = e.sets||1;
    if (n >= 4) return [n, n+2, n+4].map(k => ({ label: k + ' × ' + b + ' s', it: Object.assign(exItem(e), {sets:k}) }));
    return [b, b+15, b+30].map(s => ({ label: (n > 1 ? n + ' × ' : '') + s + ' s', it: Object.assign(exItem(e), {sec:s}) })); }
  const s = e.sets||3; return [s, s+1, s+2].map(n => ({ label: n + ' × ' + (e.reps||10), it: Object.assign(exItem(e), {sets:n}) }));
}
// under the media, like GOWOD: "Upute" (equipment, the cues, the video links) | "Cilj" (why, the target areas, how it should feel,
// the source) | "Opterećenje" (the load card and the last sessions). Česte greške stay in the data, unshown. The tab you pick stays
// for every exercise while the app is open (S.exTab: 'upute' | 'cilj' | 'opt'; 1.6.1's 'zasto' reads as 'cilj'). The player's card
// (wrap: its section opening tag) has only Upute | Cilj, shorter: the cues; the areas, Osjećaj and the first sentence of the why.
const EX_TABS = [['upute', 'Upute'], ['cilj', 'Cilj'], ['opt', 'Opterećenje']];
const exTabOf = v => v === 'zasto' ? 'cilj' : v === 'cilj' || v === 'opt' ? v : 'upute';
// the first sentence of a text: up to a . ! or ? followed by a capital letter (so "npr. ovako" or "2. dan" do not cut it)
const firstSentence = t => (String(t || '').match(/^[\s\S]*?[.!?](?=\s+[A-ZČĆŠĐŽ„"(]|\s*$)/) || [String(t || '')])[0].trim();
function exInfoHtml(e, wrap){
  const pl = !!wrap, steps = e.steps || [], list = pl ? EX_TABS.slice(0, 2) : EX_TABS;
  let on = exTabOf(S.exTab); if (pl && on === 'opt') on = 'upute';   // the player has no Opterećenje: it shows Upute, S.exTab stays
  const tab = (k, t) => '<button class="chip" role="tab" id="extab-'+k+'" aria-selected="'+(k === on)+'" aria-controls="expanel" data-a="exTab" data-v="'+k+'">'+t+'</button>';
  const a = (href, t) => '<a href="'+esc(href)+'" target="_blank" rel="noopener">'+esc(t)+' ↗</a>';
  const cues = steps.length ? steps.map(s => '<div class="bul ck">'+I.ckc+'<span>'+esc(s)+'</span></div>').join('') : '<p class="none">Dodaj upute u uređivanju.</p>';
  const zones = Array.from(new Set((e.zones||[]).map(exZoneLabel))).map(z => '<span class="tag">'+esc(z)+'</span>').join('');
  let body;
  if (on === 'upute') {
    const eq = e.equipment || exEquip(e).join(', ') || 'Bez opreme';
    const vids = (e.video ? a(e.video, e.videoTitle || 'Pogledaj demonstraciju') : '') + (packVideo(e) ? a(packVideo(e), 'Pogledaj kod TAE') : '');
    body = pl ? cues : '<div class="exequip"><span class="lb">Oprema</span><span>'+esc(eq)+'</span></div>' + cues + (vids ? '<p class="exvid">' + vids + '</p>' : '');
  } else if (on === 'cilj' && pl) {
    const box = zones || e.feel ? '<div class="pfeel">' + (zones ? '<div class="tagrow">'+zones+'</div>' : '') + (e.feel ? '<span><span class="lb">Osjećaj: </span>'+esc(e.feel)+'</span>' : '') + '</div>' : '';
    body = (box + (e.note ? '<p>'+esc(firstSentence(e.note))+'</p>' : '')) || '<p class="none">Dodaj objašnjenje u uređivanju.</p>';
  } else if (on === 'cilj') {
    const facts = (zones ? '<div><dt>Ciljana područja</dt><dd><div class="tagrow">'+zones+'</div></dd></div>' : '') + (e.feel ? '<div><dt>Osjećaj</dt><dd>'+esc(e.feel)+'</dd></div>' : '');
    body = ((e.note ? '<p>'+esc(e.note)+'</p>' : '') + (facts ? '<dl class="exfacts">'+facts+'</dl>' : '') +
      (e.source ? '<p class="src">Izvor: '+a(e.source, e.sourceTitle || 'Otvori izvor')+'</p>' : '')) || '<p class="none">Dodaj objašnjenje u uređivanju.</p>';
  } else body = exOptHtml(e);
  return (wrap || '<section class="exinfo gut">') + '<div class="extabs n'+list.length+'" role="tablist" aria-label="O vježbi">' + list.map(x => tab(x[0], x[1])).join('') + '</div>' +
    '<div class="expanel'+(on === 'opt' ? ' opt' : '')+'" id="expanel" role="tabpanel" data-tab="'+on+'" aria-labelledby="extab-'+on+'">' + body + '</div></section>';
}
// the Opterećenje tab: the newest session, the load card (period chips, chart, trend, Tablica), then the last sessions;
// nothing logged yet: one row that says what to do (no period chips)
function exOptHtml(e){
  const h = historyOf(e.id);
  const head = '<div class="opthd"><span>'+(h.length ? 'Zadnje: <b>'+esc(shortDate(h[0].at) + ' · ' + dose(h[0]))+'</b>' : '')+'</span><button class="txtbtn lnk" data-a="loadInfo">Kako se računa?</button></div>';
  if (!h.length) return head + '<div class="lc"><div class="emp"><div class="ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19h16M6 15l4-4 3 3 5-6"/></svg></div>' +
    '<div><b>Još nema treninga s ovom vježbom</b><p>Pokreni je ili je dodaj u protokol. Nakon prvog treninga ovdje vidiš volumen, a od drugog graf i povijest.</p></div></div></div>';
  return head + exLoadCard(e, S.loadRange) + exHistHtml(e, h);
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
    // 1.6.2: everything about the exercise sits in the three tabs (nothing below them: the old Opterećenje section, Povijest and
    // the Detalji card moved into Opterećenje, Cilj and Upute)
    exInfoHtml(e) +
    '<div style="height:16px"></div></div>' +
    '<div class="ctrl gut">' +
      '<button class="small" data-a="editEx" data-id="'+esc(e.id)+'">Uredi</button><span></span>' +
      '<button class="ring" data-a="playEx" data-id="'+esc(e.id)+'" aria-label="Pokreni vježbu"><svg viewBox="0 0 76 76"><circle cx="38" cy="38" r="35" fill="none" stroke="var(--accent)" stroke-width="3.5"/></svg><span class="n">'+I.play+'</span></button>' +
      '<span></span><button class="ib" data-a="addTo" data-id="'+esc(e.id)+'" aria-label="Dodaj u protokol">'+I.addbox+'</button>' +
    '</div>';
};

/* ---------- protocol builder & exercise editor ---------- */
// kg means one dumbbell (your hexagonal pairs), one 20 kg kettlebell, the whole barbell (20 kg bar, two plates per step)
// or only the plates on the landmine sleeve (one plate per step). − / + move in those real steps; a typed value is kept as typed.
// The same kinds as the progression (loadKind): a bodyweight exercise that only uses the bar as a handle has no load kind.
function kgKind(e){ return loadKind(e); }
const KG_HINT = { db:'kg po bučici', bar:'sa šipkom', lm:'samo ploče' };
function kgStep(e, kg, dir){
  const k = kgKind(e), cur = +kg || 0, p = plateKg(), r = v => Math.max(0, Math.min(300, Math.round(v * 100) / 100));
  if (k === 'db' || k === 'kb') { const L = k === 'db' ? [0].concat(DB_STEPS) : [0, 20]; if (dir > 0) { const n = L.find(w => w > cur + .001); return n != null ? n : cur; } return L.filter(w => w < cur - .001).pop() || 0; }
  if (k === 'bar') return dir > 0 ? (cur < 20 ? 20 : r(cur + 2 * p)) : (cur <= 20 ? 0 : Math.max(20, r(cur - 2 * p)));
  return r(cur + dir * (k === 'lm' ? p : 2.5));
}
const kgVal = s => { const t = String(s == null ? '' : s).replace(/kg/i, '').replace(/\s/g, '').replace(',', '.'); if (!t) return 0; const v = Number(t); return isFinite(v) && v >= 0 ? Math.min(300, Math.round(v * 100) / 100) : null; };
const kgText = v => v ? String(v).replace('.', ',') : '';
function kgBox(attr, kg, aria){ return '<span class="kgbox"><input class="kgin" type="text" inputmode="decimal" enterkeyhint="done" autocomplete="off" ' + attr + ' value="' + esc(kgText(kg)) + '" placeholder="—" aria-label="' + esc(aria) + '"><span class="u" aria-hidden="true">kg</span></span>'; }
// one "label  −  value  +" row; the label is plain text, hint an optional second line
function stepRow(act, label, key, shown, o){
  o = o || {};
  const a = esc(o.aria || label), dat = 'data-a="' + act + '" data-k="' + key + '"' + (o.i != null ? ' data-i="' + o.i + '"' : '') + (o.s != null ? ' data-s="' + o.s + '"' : '');
  return '<div class="prow"' + (o.flat ? ' style="border:0"' : '') + '><span class="k">' + esc(label) + (o.hint ? '<small>' + esc(o.hint) + '</small>' : '') + '</span><div class="step wide"><button class="sbtn" ' + dat + ' data-d="-1" aria-label="' + a + ': smanji">−</button>' + (o.box || '<b>' + esc(shown) + '</b>') + '<button class="sbtn" ' + dat + ' data-d="1" aria-label="' + a + ': povećaj">+</button></div></div>';
}
function stepper(label, key, val, shown, o){ return stepRow('dstep', label, key, shown, o); }
// unsaved changes: everything in the draft except the screen's own keys (_open, _uploading …); no plan days = none chosen
const draftSig = d => JSON.stringify(d, (k, v) => k.charAt(0) === '_' || (k === 'days' && Array.isArray(v) && !v.length) ? undefined : v);
// the dose of a protocol item; when you change it by hand its "sessions in a row" start again
const doseSig = it => JSON.stringify([it.measure || 'sets', it.sets || 1, it.reps || 10, it.repsList || null, it.sec || 30, it.kg || 0, !!it.sides]);
const PROG_STATE = ['ok', 'fail', 'snoozeOk', 'prev', 'up', 'easy'];
// a video still reading its file is stopped first, so releasing the file's address is never an error
const unload = root => (root || document).querySelectorAll('video').forEach(v => { try { v.pause(); v.removeAttribute('src'); v.load(); } catch(e){} });
// your own photo or video that nothing uses any more
function dropMedia(id){ if (!id) return; IDB.del(id).catch(() => {}); const u = MEDIA[id]; if (!u) return; delete MEDIA[id];
  document.querySelectorAll('video').forEach(v => { if ((v.getAttribute('src') || '').indexOf(u) === 0) unload(v.parentNode); });
  setTimeout(() => URL.revokeObjectURL(u), 1500); }
function dropDraftMedia(){ const d = S.draft; if (d && d.media && d.media !== ((S.ex[d.id] || {}).media)) dropMedia(d.media); }
// the editor's preview of his own picture or video; a video follows Reduce motion like every other one (videoTag)
function mediaBoxHtml(d){
  const up = d._uploading;
  return '<div id="mbox">' + (d.media && MEDIA[d.media]
    ? '<div class="media" style="border-radius:22px">' + (d.mediaType === 'image' ? '<img alt="" src="'+esc(mediaUrl(d.media))+'">' : videoTag({ src: mediaUrl(d.media) })) + '</div>' +
      '<div class="seg" style="margin-top:10px"><label class="btn sec" for="mfile" style="height:48px;cursor:pointer">' + (up ? (up === 'image' ? 'Spremam sliku…' : 'Spremam video…') : 'Zamijeni') + '</label><button class="btn danger" data-a="mediaRemove"' + (up ? ' disabled' : '') + '>Ukloni</button></div>'
    : '<label for="mfile" class="dash" style="height:150px;flex-direction:column;cursor:pointer;color:var(--text)"><span class="circ">'+I.video+'</span><span style="font-size:15px">' + (up ? (up === 'image' ? 'Spremam sliku…' : 'Spremam video…') : 'Dodaj svoj video ili sliku') + '</span><span style="font-size:13px;color:var(--text-2);font-weight:400">Kratak isječak (5–15 s) ili slika, do 80 MB</span></label>') + '</div>';
}
// the media box and the save button change while a file is stored; the rest of the form (and the keyboard) stays as it is
function paintMedia(dr){
  const box = document.getElementById('mbox'); if (!box || top().v !== 'exEdit') { render(); return; }
  unload(box); box.outerHTML = mediaBoxHtml(dr);
  const f = document.getElementById('mfile'); if (f) f.disabled = !!dr._uploading || !S.canWrite;
  const sv = app.querySelector('.footer [data-a="saveEx"]'); if (sv) sv.disabled = !!dr._uploading;
}
function grow(t){ t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }
// structural changes typed into a field show at the next tap, or a moment after the field is left (never under a finger)
let lazyT = null;
function lazyRender(){ clearTimeout(lazyT); lazyT = setTimeout(() => { lazyT = null; const a = document.activeElement; if (a && app.contains(a) && /^(INPUT|TEXTAREA)$/.test(a.tagName)) return; if (top().v === 'build') render(); }, 600); }
VIEWS.exEdit = function(t){
  const d = S.draft; if (!d) return VIEWS.home();
  const isNew = !S.ex[d.id];
  const kk = kgKind(d), kgAria = kk === 'db' ? 'Težina jedne bučice' : 'Težina';
  return '<div class="view gut">' +
    topbar(backBtn(), '', '') +
    '<h1 class="h1">' + (isNew ? 'Nova vježba' : 'Uredi vježbu') + '</h1>' +
    '<div class="stack" style="gap:22px;margin-top:22px">' +
      '<div>' + mediaBoxHtml(d) + '<input id="mfile" class="vsr" type="file" accept="video/*,image/*"' + (S.canWrite && !d._uploading ? '' : ' disabled') + '></div>' +
      '<div class="field"><label class="label" for="f-name">Naziv</label><input id="f-name" class="input" data-bind="name" value="'+esc(d.name)+'" placeholder="npr. Bench press ili Abdukcija s užetom"></div>' +
      '<div class="field"><label class="label" for="f-alt">Drugi naziv (po želji)</label><input id="f-alt" class="input" data-bind="alt" value="'+esc(d.alt)+'" placeholder="npr. Potisak s klupe"></div>' +
      '<div class="field"><span class="label">Kategorija</span><div class="chips wrap">' + CATS.map(c => '<button class="chip" data-a="dset" data-k="cat" data-v="'+c+'" aria-pressed="'+(d.cat===c)+'">'+c+'</button>').join('') + '</div></div>' +
      (d.cat === 'Rehab' || d.cat === 'Mobilnost' ? '<div class="field"><span class="label">Faza rehabilitacije</span><div class="chips wrap">' + [0,1,2,3].map(p => '<button class="chip" data-a="dset" data-k="phase" data-v="'+p+'" aria-pressed="'+((d.phase||0)===p)+'">'+(p?'Faza '+p:'Bez faze')+'</button>').join('') + '</div></div>' : '') +
      '<div class="field"><span class="label">Elastično uže</span><div class="chips wrap">' + [['','Bez užeta'],['Ø6','Ø6'],['Ø8','Ø8'],['Ø6/Ø8','Ø6 ili Ø8'],['Ø10','Ø10'],['Ø12','Ø12'],['Ø16','Ø16']].map(o => '<button class="chip" data-a="dset" data-k="cord" data-v="'+o[0]+'" aria-pressed="'+((d.cord||'')===o[0])+'">'+o[1]+'</button>').join('') + '</div></div>' +
      '<div class="field"><span class="label">Oprema</span><div class="chips wrap">' + EQUIP.map(z => '<button class="tagbtn" data-a="dequip" data-v="'+esc(z)+'" aria-pressed="'+((d.equip||[]).indexOf(z)!==-1)+'">'+esc(z)+'</button>').join('') + '</div><p class="lnote" style="margin:10px 2px 0">Kilogrami se upisuju za šipku, landmine, bučice ili girju; bez njih vježba se broji u ponavljanjima ili vremenu.</p></div>' +
      '<div class="field"><span class="label">Ciljana područja</span><div class="chips wrap">' + ZONES.map(z => '<button class="tagbtn" data-a="dzone" data-v="'+esc(z)+'" aria-pressed="'+((d.zones||[]).indexOf(z)!==-1)+'">'+esc(exZoneLabel(z))+'</button>').join('') + '</div></div>' +
      '<div class="field"><span class="label">Doziranje</span>' +
        '<div class="seg"><button class="chip" data-a="dset" data-k="measure" data-v="time" aria-pressed="'+(d.measure==='time')+'" style="height:44px">Na vrijeme</button><button class="chip" data-a="dset" data-k="measure" data-v="sets" aria-pressed="'+(d.measure!=='time')+'" style="height:44px">Na ponavljanja</button></div>' +
        '<div class="panel">' +
          (d.measure === 'time' ? stepper('Trajanje','sec',d.sec, d.sec+' s') + stepper('Serije','sets',d.sets, d.sets) + stepper('Odmor','rest',d.rest, d.rest+' s') : stepper('Serije','sets',d.sets, d.sets) + stepper('Ponavljanja','reps',d.reps, d.reps) + stepper('Odmor','rest',d.rest, d.rest+' s') + stepper('Težina','kg',d.kg, '', { hint: KG_HINT[kk], aria: kgAria, box: kgBox('data-dkg="1"', d.kg, kgAria + ' u kg') })) +
          '<div class="prow"><span class="k">Lijeva i desna strana posebno</span><button class="switch" role="switch" data-a="dflag" data-k="sides" aria-checked="'+(!!d.sides)+'" aria-label="Lijeva i desna strana posebno"></button></div>' +
        '</div><p class="lnote" style="margin:10px 2px 0">' + esc(editLoadText(d)) + '</p></div>' +
      // an own running drill: its metres count in the field load and the weekly field chart
      (d.cat === 'Kondicija' && !seedEx(d.id) && !d.pack ? '<div class="field"><label class="label" for="f-runm">Udaljenost po ponavljanju (m)</label><input id="f-runm" class="input" type="text" inputmode="decimal" autocomplete="off" data-bind="runMText" value="'+esc(d.runMText || '')+'" placeholder="npr. 30 (po želji)">' +
        '<span class="label" style="display:block;margin-top:14px">Intenzitet</span><div class="chips wrap">' + RUN_INT.map(z => '<button class="chip" data-a="dset" data-k="runInt" data-v="'+z+'" aria-pressed="'+((d.runInt || 'umjereno') === z)+'">'+z[0].toUpperCase() + z.slice(1)+'</button>').join('') + '</div>' +
        '<p class="lnote" style="margin:10px 2px 0">Metri se zbrajaju u opterećenje na terenu; visoko i sprint računaju se kao brzo trčanje.</p></div>' : '') +
      '<div class="field"><label class="label" for="f-eq">Oprema (opis)</label><input id="f-eq" class="input" data-bind="equipment" value="'+esc(d.equipment)+'" placeholder="npr. Uže Ø6 + kolotur"></div>' +
      '<div class="field"><label class="label" for="f-feel">Osjećaj</label><input id="f-feel" class="input" data-bind="feel" value="'+esc(d.feel)+'" placeholder="Gdje se vježba osjeća"></div>' +
      '<div class="field"><label class="label" for="f-steps">Upute (svaki red jedna)</label><textarea id="f-steps" class="input" rows="5" data-bind="stepsText">'+esc(d.stepsText)+'</textarea></div>' +
      '<div class="field"><label class="label" for="f-note">Cilj</label><textarea id="f-note" class="input" rows="3" data-bind="note">'+esc(d.note)+'</textarea></div>' +
      '<div class="field"><label class="label" for="f-video">Link na video demonstraciju (po želji)</label><input id="f-video" class="input" type="url" inputmode="url" data-bind="video" value="'+esc(d.video)+'" placeholder="https://"></div>' +
      (isNew ? '' : '<button class="btn danger" data-a="delEx">' + (d._confirmDel ? 'Dodirni još jednom za brisanje' : 'Obriši vježbu') + '</button>') +
    '</div><div style="height:16px"></div></div>' +
    '<div class="footer gut"><button class="btn" data-a="saveEx"' + (d._uploading ? ' disabled' : '') + '>Spremi vježbu</button></div>';
};

function daysPicker(action, id, days){
  days = days || [];
  return '<div class="days" role="group" aria-label="Dani u tjednu"><span class="label" style="padding-left:17px">Dani u tjednu' + (days.length ? '' : ' · dodirni dane kad ga radiš') + '</span><div class="drow">' +
    DAYS.map((L, i) => '<button class="dchip" data-a="'+action+'" data-id="'+esc(id)+'" data-i="'+i+'" aria-pressed="'+(days.indexOf(i) !== -1)+'" aria-label="'+DAYNAMES[i]+'">'+L+'</button>').join('') + '</div></div>';
}
const groupWord = n => n === 2 ? 'Superset' : n === 3 ? 'Triset' : 'Kružni trening';   // "krug" stays the round
function groupHead(items, g, L){
  const R = Math.max.apply(null, g.idx.map(i => items[i].sets || 1)), last = items[g.idx[g.idx.length - 1]];
  return '<div class="ghead"><b>' + groupWord(g.idx.length) + ' ' + L + '</b><span>' + R + ' ' + plural(R, 'krug', 'kruga', 'krugova') + (last.rest ? ' • odmor ' + esc(last.rest) + ' s nakon kruga' : '') + '</span></div>';
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
// a programme can be done again: "Kreni ispočetka" keeps the moment from which its sessions count again
// (S.settings.progFrom, so it is in backups and survives a new import of the pack); the history stays as it is
const progFrom = g => +((S.settings.progFrom || {})[g.id]) || 0;
function progStatus(g){
  const all = progSessions(g), doneIds = {}, from = progFrom(g);
  S.log.forEach(l => { if (l.kind === 'protocol' && l.refId && l.at >= from) doneIds[l.refId] = (doneIds[l.refId] || 0) + 1; });
  const items = all.map(x => Object.assign({ done: !!doneIds[x.pr] }, x));
  return { items, total: items.length, done: items.filter(x => x.done).length, next: items.find(x => !x.done && S.pr[x.pr]), from };
}
function progCover(g){ for (const x of progSessions(g)) { const p = S.pr[x.pr]; const it = p && (p.items || []).find(i => exMedia(S.ex[i.exId])); if (it) return S.ex[it.exId]; } return null; }
// the tests a programme defines for itself (g.tests, e.g. in a pack): [{ id, unit, name (or names: { L, D } for a test per leg),
// min, max, low (smaller is better), icon, ask, ph, err }]. The app ships no test list; a definition that does not fit is left out.
// A result is a history entry of kind 'test' ({ kind, test, name, value, unit, side, at }), never a training.
const TEST_UNITS = ['s', 'cm', 'm', 'm/s', 'razina'], TEST_ICONS = { bolt: I.bolt, jump: I.jump, run: I.run, pulse: I.pulse };
const testTxt = (v, n) => typeof v === 'string' ? v.trim().slice(0, n) : '';
function progTestList(g){
  const seen = {};
  return (g && Array.isArray(g.tests) ? g.tests : []).map(t => {
    if (!isPlainObj(t) || typeof t.id !== 'string' || !/^[a-z0-9][a-z0-9-]{0,39}$/.test(t.id) || seen[t.id] || TEST_UNITS.indexOf(t.unit) === -1) return null;
    const names = {}, one = testTxt(t.name, 80); if (one) names[''] = one;
    if (isPlainObj(t.names)) ['L', 'D'].forEach(s => { const x = testTxt(t.names[s], 80); if (x) names[s] = x; });
    if (!Object.keys(names).length || typeof t.min !== 'number' || typeof t.max !== 'number' || !isFinite(t.min) || !isFinite(t.max) || t.min < 0 || t.min >= t.max) return null;
    seen[t.id] = 1;
    return { id: t.id, unit: t.unit, low: t.low === true, icon: TEST_ICONS[t.icon] || I.pulse, names, min: t.min, max: t.max,
      ask: testTxt(t.ask, 80) || 'Rezultat (' + t.unit + ')', ph: testTxt(t.ph, 30), err: testTxt(t.err, 160) || 'Upiši broj od ' + progTestNum(t.min) + ' do ' + progTestNum(t.max) + '.' };
  }).filter(Boolean);
}
const progTestDef = (gid, id) => progTestList(S.prog[gid]).find(t => t.id === id);
function progTests(g){
  return [].concat.apply([], progTestList(g).map(t => Object.keys(t.names).map(s => ({ t, s, label: t.names[s] }))));
}
// your results of one test (one side), newest first
const progTestRes = (id, side) => S.log.filter(l => l.kind === 'test' && l.test === id && (l.side || '') === (side || '') && typeof l.value === 'number' && isFinite(l.value));
const progTestNum = v => String(Math.round(v * 100) / 100).replace('.', ',');
const progTestVal = r => r.unit === 'razina' ? 'razina ' + progTestNum(r.value) : progTestNum(r.value) + ' ' + r.unit;
// what you typed survives the sheet being drawn again (e.g. the question before deleting)
const progTyped = s => { const el = document.getElementById('testv'); if (el) s.v = el.value; };
// the latest result against the one before it ("bolje za 0,2 s"); a level (unit 'razina') only says better or worse
function progTestDiff(t, r){
  if (r.length < 2) return '';
  const d = Math.round((r[0].value - r[1].value) * 100) / 100; if (!d) return 'isto kao prije';
  return ((t.low ? d < 0 : d > 0) ? 'bolje' : 'slabije') + (t.unit === 'razina' ? '' : ' za ' + progTestNum(Math.abs(d)) + ' ' + t.unit);
}
function progTestsHtml(g){
  const rows = progTests(g); if (!rows.length) return '';
  return '<h2 class="h2">Testovi</h2><p class="sub" style="margin-right:17px;line-height:20px">' + esc(testTxt(g.testsNote, 300) || 'Upiši najbolji pokušaj u svakom testu.') + '</p>' +
    '<div class="list" style="margin-top:14px">' + rows.map(x => { const r = progTestRes(x.t.id, x.s), diff = progTestDiff(x.t, r);
      return '<button class="row" data-a="progTest" data-id="'+esc(g.id)+'" data-t="'+esc(x.t.id)+'" data-s="'+esc(x.s)+'" style="min-height:64px"><span class="thumb" style="width:52px;height:52px">'+pathIcon(x.t.icon, 24)+'</span><span class="tx"><span class="t">'+esc(x.label)+'</span><span class="m"><span>' + (r[0] ? esc(progTestVal(r[0]) + ' · ' + shortDate(r[0].at)) : 'Još nema rezultata') + '</span>' + (diff ? '<span class="tag">'+esc(diff)+'</span>' : '') + '</span></span>'+I.chev+'</button>'; }).join('') + '</div>';
}
// the sheets of a programme: a test result, and "Kreni ispočetka"
function progSheet(s){
  if (s.kind === 'progRestart') {
    const g = S.prog[s.id]; if (!g) return '';
    return '<h3>Krenuti ispočetka?</h3><p style="margin:0 0 16px;font-size:15px;line-height:22px;color:var(--text-body)">„' + esc(g.name) + '” ponovno kreće od prvog treninga. Odrađeni treninzi i rezultati testova ostaju u povijesti.</p>' +
      '<button class="btn" data-a="progRestart" data-id="'+esc(g.id)+'">Kreni ispočetka</button><button class="btn sec" data-a="sheetDone" style="margin-top:10px;height:48px">Odustani</button>';
  }
  const t = progTestDef(s.id, s.t); if (!t) return '';
  const r = progTestRes(t.id, s.s), small = 'font-size:13px;line-height:19px;color:var(--text-2)';
  return '<h3>' + esc(t.names[s.s || ''] || '') + '</h3>' +
    '<div class="field"><label class="label" for="testv" style="padding-left:0">' + esc(t.ask) + '</label><input id="testv" class="input" type="text" inputmode="decimal" autocomplete="off" enterkeyhint="done" placeholder="' + esc(t.ph) + '" value="' + esc(s.v || '') + '" style="background:var(--surface-2)"></div>' +
    (r.length ? '<p class="label" style="padding:18px 0 4px">Dosadašnji rezultati</p>' + r.slice(0, 6).map(x => '<div class="opt" style="min-height:44px;box-sizing:border-box"><span style="font-size:15px">' + esc(shortDate(x.at)) + '</span><span style="font-size:15px;font-weight:600">' + esc(progTestVal(x)) + '</span></div>').join('') +
      (s._del ? '<div class="lift warn" style="margin:12px 0 0"><div class="why" style="color:var(--text-body)">' + esc('Obrisati rezultat ' + progTestVal(r[0]) + ' od ' + shortDate(r[0].at) + '?') + '</div><div class="acts"><button class="bt amber" data-a="progTestDel">Obriši</button><button class="bt ghost" data-a="progTestKeep">Ne</button></div></div>'
        : '<button class="txtbtn" data-a="progTestDel" style="height:44px;padding:0;font-size:14px;color:var(--text-2)">Obriši zadnji rezultat</button>') : '<p style="margin:12px 0 0;' + small + '">Još nema rezultata za ovaj test.</p>') +
    '<div class="seg" style="margin-top:16px"><button class="btn sec" data-a="sheetDone" style="height:48px">Odustani</button><button class="btn" data-a="progTestSave" style="height:48px;font-size:16px">Spremi</button></div>';
}
VIEWS.program = function(t){
  const g = S.prog[t.id];
  if (!g) return '<div class="view gut">' + topbar(backBtn()) + '<div class="empty">Ovaj program više ne postoji.</div></div>';
  const st = progStatus(g), pct = st.total ? st.done / st.total : 0, C = 2 * Math.PI * 30;
  const gone = st.items.filter(x => !x.done && !S.pr[x.pr]).length;   // sessions deleted from the phone: never 'next', so the programme can end without them
  const cols = Math.max.apply(null, (g.weeks || []).map(w => (w.sessions || []).length).concat([1]));
  return '<div class="view gut">' + topbar(backBtn()) +
    '<h1 class="h1">' + esc(g.name) + '</h1>' + (g.desc ? '<p class="sub" style="margin-right:17px;line-height:20px">' + esc(g.desc) + '</p>' : '') +
    '<div class="progtop"><svg viewBox="0 0 72 72" width="72" height="72"><circle cx="36" cy="36" r="30" fill="none" stroke="var(--track)" stroke-width="6"/>' + (st.done ? '<circle cx="36" cy="36" r="30" fill="none" stroke="var(--accent)" stroke-width="6" stroke-linecap="round" stroke-dasharray="'+(C*pct).toFixed(1)+' '+C.toFixed(1)+'" transform="rotate(-90 36 36)"/>' : '') + '</svg>' +
      '<div><b>' + st.done + ' od ' + st.total + '</b><span>' + (st.next ? 'Sljedeće: ' + esc(st.next.short) : gone ? 'Nema više treninga: ' + gone + ' ' + plural(gone, 'trening programa je obrisan', 'treninga programa su obrisana', 'treninga programa je obrisano') + '.' : 'Program je završen. Bravo!') + (st.from ? ' · ispočetka od ' + esc(shortDate(st.from)) : '') + '</span></div></div>' +
    '<div class="pgrid" style="grid-template-columns:44px repeat('+cols+',1fr)">' + (g.weeks || []).map(w => '<span class="pw">' + esc(w.week) + '. tj.</span>' + (w.sessions || []).map(x => {
      const it = st.items.find(y => y.pr === x.pr) || {}; const cls = it.done ? 'done' : (st.next && st.next.pr === x.pr) ? 'next' : '';
      return '<button class="pcell ' + cls + '" data-a="openPr" data-id="'+esc(x.pr)+'" aria-label="'+esc(w.week + '. tjedan, ' + x.label + (it.done ? ', odrađeno' : ''))+'">'+esc(x.label)+'</button>'; }).join('')).join('') + '</div>' +
    progTestsHtml(g) +
    ((g.notes || []).length ? '<h2 class="h2">Kako ga raditi</h2><div class="stack" style="gap:8px;margin:12px 17px 0">' + g.notes.map(n => '<div class="bul">'+esc(n)+'</div>').join('') + '</div>' : '') +
    '<div style="margin:18px 0 0">' + daysPicker('progDays', g.id, g.days) + '<p class="sub" style="margin-right:17px;line-height:19px">Na svaki odabrani dan tjedni plan ti nudi sljedeći trening programa.</p></div>' +   // week plan (K5)
    (g.credit ? '<p class="sub" style="margin-top:16px">' + esc(g.credit) + '</p>' : '') +
    (st.next && st.done ? '<div style="margin:14px 7px 0"><button class="txtbtn" data-a="progRestartAsk" data-id="'+esc(g.id)+'" style="font-size:15px">Kreni ispočetka</button></div>' : '') +
    '<div style="height:20px"></div></div>' +
    (st.next ? '<div class="footer gut"><button class="btn" data-a="openPr" data-id="'+esc(st.next.pr)+'">Sljedeći trening</button></div>'
      : st.done ? '<div class="footer gut"><button class="btn" data-a="progRestartAsk" data-id="'+esc(g.id)+'">Kreni ispočetka</button></div>' : '');
};
function goalCard(p){
  const g = S.settings.goal;
  if (p.program) { const k = kgPlan(p); return k.changes.length && p.kgSkip !== kgSig(k) ? '<div class="lift go" style="margin:0 17px"><div class="why" style="color:var(--text-body)">Kilogrami za ovaj trening mogu se izračunati iz tvojih težina ('+k.changes.length+' '+plural(k.changes.length, 'vježba', 'vježbe', 'vježbi')+'). Ponavljanja i serije ostaju kao u programu.</div><div class="acts"><button class="bt" data-a="kgSheet" data-id="'+esc(p.id)+'">Predloži kilograme</button><button class="bt ghost" data-a="kgSkip" data-id="'+esc(p.id)+'">Ne</button></div></div>' : ''; }
  const tag = p.goal && GOALS[p.goal] ? '<div style="display:flex;gap:8px;margin:0 17px;flex-wrap:wrap"><span class="tag">Cilj: '+esc(GOALS[p.goal].name)+'</span><span class="tag">'+esc(goalDesc(p.goal).slice(0, 2).join(' · '))+'</span></div>' : '';
  if (!g || !GOALS[g] || !gymProto(p) || p.goal === g || p.goalSkip === g) return tag;
  const plan = goalPlan(p, g); if (!plan.changes.length) return tag;
  return tag + '<div class="lift go" style="margin:0 17px"><div class="why" style="color:var(--text-body)">Cilj razdoblja je „'+esc(GOALS[g].name)+'”. Za '+plan.changes.length+' '+plural(plan.changes.length, 'vježbu', 'vježbe', 'vježbi')+' s opterećenjem postoji prijedlog serija, ponavljanja, odmora i kilograma.</div><div class="acts"><button class="bt" data-a="goalSheet" data-id="'+esc(p.id)+'">Pogledaj i primijeni</button><button class="bt ghost" data-a="goalSkip" data-id="'+esc(p.id)+'">Ne</button></div></div>';
}
// the header: minutes, the zones the session trains most (by sets, an exercise's main zone counts double; the warm-up
// only when there is nothing else) and all the equipment to set up
function featRows(p){
  const items = p.items || [], parts = secOf(items), eq = {}, main = {}, all = {};
  items.forEach((it, i) => { const e = S.ex[it.exId]; if (!e) return;
    exEquip(e).forEach(x => { if (x !== 'Bez opreme') eq[x] = 1; });
    const warm = /^zagrij/.test(norm(parts[i]));
    (e.zones || []).forEach((z, k) => { const n = exZoneLabel(z), w = (it.sets || 1) * (k === 0 ? 2 : 1); all[n] = (all[n] || 0) + w; if (!warm) main[n] = (main[n] || 0) + w; });
  });
  const zw = Object.keys(main).length ? main : all, zones = Object.keys(zw).sort((a, b) => zw[b] - zw[a]).slice(0, 4), min = protoMin(p);
  return '<div class="feat">'+I.clock+'<span>' + min + ' ' + plural(min, 'minuta', 'minute', 'minuta') + ' • ' + nVj(items.length) + '</span></div>' +
    (zones.length ? '<div class="feat">'+I.target+'<span>' + esc(zones.join(', ')) + '</span></div>' : '') +
    '<div class="feat">'+I.bars+'<span>Oprema: ' + esc(Object.keys(eq).join(', ') || 'bez opreme') + '</span></div>';
}
VIEWS.pr = function(t){
  const p = S.pr[t.id];
  if (!p) return '<div class="view gut">' + topbar(backBtn()) + '<div class="empty">Ovaj protokol više ne postoji.</div></div>';
  const first = p.items && p.items[0] && S.ex[p.items[0].exId];
  const fm = exMedia(first, true);
  const lab = ssLetters(p.items || []);
  return '<div class="view" style="position:relative">' +
    heroHtml(p, fm) +
    '<div class="over gut">' + topbar(backBtn(), '<button class="ib" data-a="editPr" data-id="'+esc(p.id)+'" aria-label="Uredi protokol">'+I.edit+'</button>') + '</div>' +
    '<div class="gut stack" style="gap:18px;margin-top:-6px">' +
      '<h1 style="margin:0 17px;font-size:30px;line-height:36px;font-weight:600;text-wrap:balance">' + esc(p.name) + '</h1>' +
      (p.desc ? '<p style="margin:0 17px;font-size:16px;line-height:24px;color:var(--text-body)">' + esc(p.desc) + '</p>' : '') +
      '<div class="stack" style="gap:16px;margin:4px 17px 0">' + featRows(p) + '</div>' +
      goalCard(p) +
      (p.program ? '' : daysPicker('prDays', p.id, p.days)) +
      '<div style="display:flex;justify-content:space-between;align-items:baseline;margin:8px 17px 0"><h2 style="margin:0;font-size:17px;font-weight:600">Vježbe</h2>' + (p.program ? '' : '<button class="txtbtn" data-a="progInfo" style="font-size:14px;padding:0">Kako napredujem?</button>') + '</div>' +
      '<div class="list">' + itemRowsHtml(p.items || [], lab) + '</div>' +
    '</div><div style="height:16px"></div></div>' +
    '<div class="footer gut"><button class="btn" data-a="startPr" data-id="'+esc(p.id)+'"' + ((p.items||[]).length ? '' : ' disabled') + '>Krenimo!</button></div>';
};

VIEWS.build = function(){
  const d = S.draft; if (!d) return VIEWS.home();
  const isNew = !S.pr[d.id];
  const total = protoMin(d);
  const eff = secOf(d.items), anySec = eff.some(Boolean);
  return '<div class="view gut">' +
    topbar(backBtn(), '<button class="txtbtn" data-a="savePr">Spremi</button>', '') +
    '<h1 class="h1">' + (isNew ? 'Novi protokol' : 'Uredi protokol') + '</h1>' +
    '<div class="field" style="margin-top:22px"><label class="label" for="p-name">Naziv</label><input id="p-name" class="input" data-bind="name" value="'+esc(d.name)+'" placeholder="npr. Aktivacija prije treninga" style="font-weight:600;font-size:17px"></div>' +
    '<div class="field" style="margin-top:16px"><label class="label" for="p-desc">Opis</label><textarea id="p-desc" class="input" rows="2" data-bind="desc" placeholder="Kada i zašto ga radiš">'+esc(d.desc)+'</textarea></div>' +
    '<div style="display:flex;justify-content:space-between;align-items:baseline;margin:28px 17px 14px"><h2 style="margin:0;font-size:17px;font-weight:600">Vježbe</h2><span style="font-size:14px;color:var(--text-body)">'+nVj(d.items.length)+' • ≈ '+total+' min</span></div>' +
    '<div class="list">' + (function(){
      const lab = ssLetters(d.items), N = d.items.length;
      const runEnd = i => { let k = i; while (k + 1 < N && eff[k + 1] === eff[i]) k++; return k; };
      // part titles (e.g. ZAGRIJAVANJE): typed on the exercise where a part begins, they apply down to the next title
      // (data-from/to: the exercises the title covers; data-fb: what they fall back to when the field is emptied)
      const secField = i => {
        const start = !!eff[i] && (i === 0 || eff[i] !== eff[i - 1]);
        return '<div class="field" style="gap:6px;margin-top:12px"><label class="label" for="isec-'+i+'" style="padding-left:0">' + (start ? 'Naslov dijela' : anySec && i > 0 ? 'Novi dio počinje ovdje (po želji)' : 'Naslov dijela (po želji)') + '</label>' +
          '<input id="isec-'+i+'" class="input bsec" data-isec="'+i+'" data-from="'+i+'" data-to="'+runEnd(i)+'" data-fb="'+esc(start ? (i > 0 ? eff[i - 1] : '') : eff[i])+'" value="'+(start ? esc(eff[i]) : '')+'" placeholder="'+(start ? 'bez naslova' : anySec && i > 0 ? 'npr. Snaga' : 'npr. Zagrijavanje')+'" autocomplete="off" enterkeyhint="done"></div>';
      };
      const card = (it, i) => {
        const e = S.ex[it.exId]; const open = d._open === i; const l = lab[i];
        const linked = i < N - 1 && it.ss && d.items[i+1].ss === it.ss;
        const inGroup = !!l, lastInGroup = inGroup && !linked;
        const restHint = !inGroup ? 'između serija' : lastInGroup ? 'nakon kruga' : 'prije sljedeće vježbe', rest = istep('Odmor','rest',i,(it.rest||0)+' s',{ hint: restHint, aria: 'Odmor ' + restHint });
        const kk = kgKind(e), kgAria = kk === 'db' ? 'Težina jedne bučice' : 'Težina', split = Array.isArray(it.repsList), n = it.sets || 1, unit = inGroup ? 'krug' : 'serija';
        return '<div style="border-radius:20px;background:var(--surface);border:1px solid '+(open?'var(--accent)':'var(--border)')+'">' +
          '<button class="row" data-a="itOpen" data-i="'+i+'" aria-expanded="'+open+'" style="border:0;background:transparent">' +
            '<span class="thumb">'+(exMedia(e) ? thumbHtml(e) : (l ? l.L + l.k : i+1))+'</span><span class="tx"><span class="t">'+(l ? '<span class="sslab">'+l.L+l.k+'</span> ' : '')+esc(e ? e.name : 'Obrisana vježba')+'</span><span class="m"><span id="dose-'+i+'">'+esc(dose(it))+'</span></span></span>' +
            '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate('+(open?'-90':'90')+'deg)"><path d="M9 4.5l7.5 7.5L9 19.5"/></svg>' +
          '</button>' +
          (open ? '<div style="padding:0 16px 16px;border-top:1px solid var(--border)">' +
            '<div class="seg" style="margin-top:12px"><button class="chip" data-a="iset" data-k="measure" data-v="time" aria-pressed="'+(it.measure==='time')+'">Na vrijeme</button><button class="chip" data-a="iset" data-k="measure" data-v="sets" aria-pressed="'+(it.measure!=='time')+'">Na ponavljanja</button></div>' +
            (it.measure === 'time'
              ? istep('Trajanje','sec',i,it.sec+' s') + istep(inGroup ? 'Krugovi' : 'Serije','sets',i,n) + rest
              : istep(inGroup ? 'Krugovi' : 'Serije','sets',i,n) +
                (split ? Array.from({ length: n }, (_, s) => istep((s + 1) + '. ' + unit, 'reps', i, repsOf(it, s + 1), { act:'isetrep', s, aria:'Ponavljanja, ' + (s + 1) + '. ' + unit })).join('') : istep('Ponavljanja','reps',i,it.reps||10)) +
                '<div class="prow" style="border:0"><span class="k">Različita ponavljanja po seriji</span><button class="switch" role="switch" data-a="irepsplit" data-i="'+i+'" aria-checked="'+split+'" aria-label="Različita ponavljanja po seriji"></button></div>' +
                istep('Težina','kg',i,'',{ hint: KG_HINT[kk], aria: kgAria, box: kgBox('data-ikg="'+i+'"', it.kg, kgAria + ' u kg') }) +
                rest) +
            '<div class="prow"><span class="k">Lijeva i desna strana posebno</span><button class="switch" role="switch" data-a="iflag" data-i="'+i+'" aria-checked="'+(!!it.sides)+'" aria-label="Lijeva i desna strana posebno"></button></div>' +
            (i < N - 1 && (linked || eff[i] === eff[i + 1]) ? '<div class="prow"><span class="k">Superset sa sljedećom vježbom<br><span style="font-size:13px;color:var(--text-2)">Radiš ih naizmjence, odmor tek nakon kruga</span></span><button class="switch" role="switch" data-a="ilink" data-i="'+i+'" aria-checked="'+linked+'" aria-label="Superset sa sljedećom vježbom"></button></div>' : '') +
            (!l || l.k === 1 ? secField(i) : '') +   // a part begins with a whole superset, never inside one
            '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px">' +
              '<button class="chip" data-a="imove" data-i="'+i+'" data-d="-1"'+(i===0?' disabled style="opacity:.35"':'')+'>↑ Gore</button>' +
              '<button class="chip" data-a="imove" data-i="'+i+'" data-d="1"'+(i===N-1?' disabled style="opacity:.35"':'')+'>↓ Dolje</button>' +
              '<button class="chip" data-a="idel" data-i="'+i+'" style="color:var(--danger)">Ukloni</button>' +
            '</div></div>' : '') +
        '</div>';
      };
      let sec = '';
      return groupsOf(d.items).map(g => {
        const s0 = eff[g.idx[0]], head = s0 && s0 !== sec ? '<div class="sechead" id="sec-'+g.idx[0]+'">' + esc(s0) + '</div>' : ''; if (s0) sec = s0;
        return head + (g.ss ? '<div class="sgroup">' + groupHead(d.items, g, lab[g.idx[0]].L) + g.idx.map(i => card(d.items[i], i)).join('') + '</div>' : card(d.items[g.idx[0]], g.idx[0]));
      }).join('');
    })() +
      '<button class="dash" data-a="pickStart">'+I.plus.replace('<svg','<svg width="18" height="18"')+'Dodaj vježbe iz knjižnice</button>' +
      // a programme session has no days of its own: the programme's days offer its next session (as on the session page)
      (d.program ? '<p class="sub" style="margin:8px 17px 0;line-height:19px">Dane u tjednu za treninge programa biraš na stranici programa.</p>' : '<div style="margin:8px 0 0">' + daysPicker('ddays', d.id, d.days) + '</div>') +
      (isNew ? '' : '<button class="btn sec" data-a="copyPr" style="height:48px">Kopiraj protokol</button>') +
      (isNew ? '' : '<button class="btn danger" data-a="delPr">' + (d._confirmDel ? 'Dodirni još jednom za brisanje' : 'Obriši protokol') + '</button>') +
    '</div><div style="height:16px"></div></div>' +
    '<div class="footer gut"><button class="btn" data-a="savePr" data-start="1"' + (d.items.length ? '' : ' disabled') + '>Spremi i kreni</button></div>';
};
function istep(label, key, i, shown, o){ return stepRow((o && o.act) || 'istep', label, key, shown, Object.assign({ i, flat: true }, o)); }
// a part title applies to every exercise below it until the next title
const secOf = items => { let s = ''; return items.map(it => (s = String(it.section || '').trim() || s)); };
function secSet(items, eff){ items.forEach((it, k) => { if (eff[k]) it.section = eff[k]; else delete it.section; }); return items; }
// supersets stay well formed after a change, and an exercise that now ends a round or stands alone gets a rest again
// (inside a superset its rest is 0: the round rest belongs to the last exercise of the round)
function regroup(items, op){
  const was = new Map();
  groupsOf(items).forEach(g => { if (!g.ss) return; const rr = items[g.idx[g.idx.length - 1]].rest || 0; g.idx.forEach((i, k) => was.set(items[i], { rr, last: k === g.idx.length - 1 })); });
  if (op) op();
  normGroups(items);
  groupsOf(items).forEach(g => {
    // a former round rest does not become a pause in the middle of a round
    if (g.ss) g.idx.slice(0, -1).forEach(i => { const x = items[i], w = was.get(x); if (w && w.last && (x.rest || 0) > 30) x.rest = 0; });
    const it = items[g.idx[g.idx.length - 1]], w = was.get(it);
    if (!w || w.last || (!g.ss && (it.sets || 1) < 2)) return;
    const want = g.ss ? w.rr : (w.rr || (S.ex[it.exId] && S.ex[it.exId].rest) || 60);
    if ((it.rest || 0) < want) it.rest = want;
  });
  return items;
}
function dropItems(items, pred){ const eff = secOf(items); regroup(items, () => { for (let k = items.length - 1; k >= 0; k--) if (pred(items[k], k)) { items.splice(k, 1); eff.splice(k, 1); } }); return eff.some(Boolean) ? secSet(items, eff) : items; }
// per-set reps follow the number of sets: a new set repeats the last one
function fitReps(it){ if (!Array.isArray(it.repsList)) return; const n = it.sets || 1; while (it.repsList.length < n) it.repsList.push(it.repsList.length ? it.repsList[it.repsList.length - 1] : (it.reps || 10)); it.repsList.length = n; }
// an exercise added to a protocol starts from the weight you last lifted on it, else the library value. When the reps differ, a
// barbell, landmine or dumbbell load is converted to the real load for the new reps; any other load (kettlebell, medicine ball,
// an own exercise without a weight tag) is kept as it was, since roundLoad only knows bar, plate and dumbbell steps
function newItem(e){
  const it = exItem(e); if (it.measure === 'time') return it;
  const last = historyOf(e.id).find(x => x.kg > 0 && x.measure === it.measure && x.done !== false && !x.skipped);
  if (last) it.kg = (last.reps || it.reps) === it.reps || ['bar', 'lm', 'db'].indexOf(loadKind(e)) === -1 ? last.kg : roundLoad(e, e1rm(last.kg, last.reps || it.reps) * pctFor(it.reps));
  return it;
}

const FIELD_GROUPS = [
  { key:'pre', title:'Predsezonski plan · 4 tjedna', sub:'STATSports Pre-Season Training Program: trčanja za pripreme, po tjednima' },
  { key:'web', title:'Treninzi sa statsports.com', sub:'Treninzi trčanja koje je STATSports objavio na svojim stranicama' }
];
// field texts: "16,5 m"; times as "15 s", "3 min" or "1:30"
const fieldM = m => String(Math.round(m * 10) / 10).replace('.', ',') + ' m';
const fieldDur = s => s < 60 ? s + ' s' : s % 60 ? fmt(s) : s / 60 + ' min';

/* ---------- MAS: the 5-minute test gives your maximal aerobic speed; the MAS runs take your own distances from it ---------- */
// a result is a log entry { kind:'test', test:'mas', name, value: m/s, unit:'m/s', dist: metres in 5 min, at }; it is not a training
const masLast = () => S.log.reduce((b, l) => l && l.kind === 'test' && l.test === 'mas' && l.value > 0 && (!b || l.at > b.at) ? l : b, null);
const masNow = () => { const l = masLast(); return l ? l.value : 0; };
const masM = (pct, s) => Math.round(masNow() * pct / 100 * s);
const masTxt = v => String(Math.round(v * 100) / 100).replace('.', ',');
const masOk = m => m >= 600 && m <= 2400;   // 2 to 8 m/s
const masEntry = (m, at) => ({ kind:'test', test:'mas', name:'MAS test', value: Math.round(m / 3) / 100, unit:'m/s', dist: m, at: at || Date.now() });
const masOut = (m, done) => masOk(m) ? 'MAS ' + masTxt(m / 300) + ' m/s' + (done ? ' · sprema se kad dodirneš Završi' : '')
  : m > 0 ? 'Upiši metre u 5 minuta, od 600 do 2400 m.' : done ? 'Upiši metre pa dodirni Završi. Bez njih se sprema samo trening.' : '';
// your distance for one run of a MAS block: metres in its work time, or the time of one lap when the block runs laps
function fieldDist(b){
  const mas = masNow();
  if (b.mas_pct && mas) return b.lap_m ? 'krug za ~' + Math.round(b.lap_m * 100 / (mas * b.mas_pct)) + ' s' : masM(b.mas_pct, b.work_s) + ' m';
  return b.distance_m ? fieldM(b.distance_m) : '';
}
const masInput = (id, v) => '<input id="' + id + '" class="input" type="number" inputmode="numeric" min="600" max="2400" step="10" placeholder="npr. 1350" value="' + (+v > 0 ? esc(+v) : '') + '" style="height:44px;border-radius:14px;padding:0 14px" aria-describedby="masout">';
// typing never rebuilds the screen (a rebuild would swallow the tap on Završi or Spremi)
function masTyped(t){
  const m = Math.round(+String(t.value).replace(',', '.') || 0);
  if (P && P.done) P.masDist = m; else S.masDraft = m;
  const o = document.getElementById('masout'); if (o) o.textContent = masOut(m, !!(P && P.done));
}
// on the done screen of the MAS test
function masDoneHtml(){
  if (!P || !P.done || P.mode !== 'field' || !P.f || P.f.id !== 'mas-test-5-min' || P.quit || !anyCredit()) return '';
  return '<div class="lift" style="margin:18px 0 0;text-align:left"><div class="top"><b>Koliko si pretrčao?</b></div>' +
    '<label class="why" for="masdist">Metri u 5 minuta: sa sata ili iz aplikacije za trčanje, ili krugovi oko terena (oko 360 m po krugu)</label>' +
    masInput('masdist', P.masDist) + '<span class="why" id="masout" aria-live="polite">' + esc(masOut(+P.masDist || 0, true)) + '</span></div>';
}
// the test entry saved with the finished MAS test
const masFromPlay = () => P && P.mode === 'field' && P.f && P.f.id === 'mas-test-5-min' && !P.quit && masOk(+P.masDist) ? masEntry(+P.masDist, P.finishedAt) : null;
// on the MAS test page and the MAS runs: the latest result; the test page also takes a result timed without the player
function masCard(f){
  const l = masLast(), test = f.id === 'mas-test-5-min';
  return '<div class="lift" style="margin:18px 17px 0">' +
    '<div class="top"><b>Tvoja MAS' + (l ? ': ' + masTxt(l.value) + ' m/s' : '') + '</b><span>' + (l ? esc((l.dist ? l.dist + ' m · ' : '') + shortDate(l.at)) : 'još nije upisana') + '</span></div>' +
    '<div class="why">' + (test ? 'MAS (maksimalna aerobna brzina) = metri u 5 minuta / 300. Iz nje MAS mreže računaju tvoje dionice, a 3-2-1 intervali tvoj tempo.'
      : l ? 'Duljine i tempo u ovom treningu računaju se iz tvoje MAS. Novi rezultat upiši na stranici MAS testa.' : 'Napravi MAS test (5 minuta trčanja) i duljine u ovom treningu bit će tvoje.') + '</div>' +
    (test ? '<label class="why" for="masdist">Upiši rezultat: metri u 5 minuta</label><div class="acts">' + masInput('masdist', S.masDraft) + '<button class="bt" data-a="masSave">Spremi</button></div><span class="why" id="masout" aria-live="polite">' + esc(masOut(+S.masDraft || 0)) + '</span>'
      : l || !S.field['mas-test-5-min'] ? '' : '<div class="acts"><span></span><button class="bt ghost" data-a="openField" data-id="mas-test-5-min">MAS test</button></div>') + '</div>';
}

// The pre-season plan as you go through it: every logged run with a plan code ticks the first open cell with that code,
// week by week and day by day; the first open cell is the next run. Runs from before "Kreni s planom ispočetka" don't count.
function prePlanState(){
  const plan = (window.SEED_PLAN || {}).pre; if (!plan || !Array.isArray(plan.weeks)) return null;
  const from = +S.settings.preFrom || 0, left = {}, cells = []; let next = null, done = 0;
  S.log.forEach(l => { if (l && l.kind === 'field' && l.at >= from && /^ss-pre-/.test(l.refId || '')) left[l.refId] = (left[l.refId] || 0) + 1; });
  plan.weeks.forEach(w => (w.days || []).forEach((code, i) => {
    if (!code) return;
    const f = S.field['ss-pre-' + String(code).toLowerCase()], c = { week: w.week, i, code, f, done: false };
    if (f && left[f.id] > 0) { left[f.id]--; c.done = true; done++; }
    else if (f && !next) next = c;
    cells.push(c);
  }));
  return { plan, cells, next, done };
}
// the published 4-week schedule, shown like a programme: finished runs filled, the next one framed and its week marked
function fieldPlanHtml(){
  const ps = prePlanState(); if (!ps) return '';
  const { plan, cells, next, done } = ps, total = cells.length, C = 2 * Math.PI * 30, at = {};
  cells.forEach(c => at[c.week + ':' + c.i] = c);
  const cell = (w, i) => {
    const c = at[w.week + ':' + i]; if (!c) return '<span class="pe"></span>';
    if (!c.f) return '<span class="pc">' + esc(c.code) + '</span>';
    const st = c.done ? ' style="background:var(--accent-fill);border-color:var(--accent-fill);color:#fff"' : c === next ? ' style="border:2px solid var(--accent)"' : '';
    return '<button class="pc"' + st + ' data-a="openField" data-id="' + esc(c.f.id) + '" aria-label="' + esc(w.week + '. tjedan, ' + DAYNAMES[i] + ': ' + c.f.name_hr + (c.done ? ', odrađeno' : c === next ? ', sljedeće' : '')) + '">' + esc(c.code) + '</button>';
  };
  return '<div class="progtop"><svg viewBox="0 0 72 72" width="72" height="72" aria-hidden="true"><circle cx="36" cy="36" r="30" fill="none" stroke="var(--track)" stroke-width="6"/>' + (done ? '<circle cx="36" cy="36" r="30" fill="none" stroke="var(--accent)" stroke-width="6" stroke-linecap="round" stroke-dasharray="' + (C * done / total).toFixed(1) + ' ' + C.toFixed(1) + '" transform="rotate(-90 36 36)"/>' : '') + '</svg>' +
      '<div style="flex:1;min-width:0"><b>' + done + ' od ' + total + '</b><span>' + (next ? 'Sljedeće: ' + esc(next.week + '. tjedan, ' + DAYNAMES[next.i] + ' · Run ' + next.code) : 'Plan je završen. Bravo!') + '</span></div>' +
      (next ? '<button class="bt" data-a="openField" data-id="' + esc(next.f.id) + '" aria-label="' + esc('Otvori ' + next.f.name_hr) + '">Otvori</button>' : '') + '</div>' +
    '<div class="plangrid" role="group" aria-label="Raspored po tjednima"><span></span>' + DAYS.map(L => '<span class="ph" aria-hidden="true">' + L + '</span>').join('') +
    plan.weeks.map(w => '<span class="ph"' + (next && next.week === w.week ? ' style="color:var(--accent-text)" aria-label="' + esc(w.week + '. tjedan, trenutni') + '"' : '') + '>' + esc(w.week) + '.</span>' + DAYS.map((L, i) => cell(w, i)).join('')).join('') +
    '</div><p class="sub" style="margin-right:17px;line-height:19px">' + esc(plan.note || '') + '</p>' +
    (!done ? '' : S.planAsk ? '<div class="lift" style="margin:12px 17px 0"><div class="why" style="color:var(--text-body)">Plan opet kreće od 1. tjedna. Odrađena trčanja ostaju u povijesti, samo se više ne označavaju u planu.</div><div class="acts"><button class="bt" data-a="planReset">Kreni ispočetka</button><button class="bt ghost" data-a="planKeep">Odustani</button></div></div>'
      : '<button class="txtbtn" data-a="planAsk" style="margin:2px 7px 0">Kreni s planom ispočetka</button>');
}
function fieldRow(f){
  const spec = fieldSpec(f);
  const when = f.when_hr || (f.week ? f.week + '. tjedan' + (f.dayHr ? ' · ' + f.dayHr : '') : '');
  return '<button class="row" data-a="openField" data-id="'+esc(f.id)+'"><span class="thumb pthumb">'+(spec ? pitchSvg(spec, { thumb:true }) : pathIcon(I.run,28))+'</span><span class="tx"><span class="t">'+esc(f.name_hr)+'</span><span class="m"><span>'+esc(fieldMin(f))+' min</span><span class="tag">'+esc(when || f.goal_hr)+'</span></span></span>'+I.chev+'</button>';
}
VIEWS.fieldList = function(){
  const all = Object.values(S.field).sort((a,b) => (a.order||99) - (b.order||99));
  let body;
  if (S.dbState !== 'ready') body = stateNote();
  else if (!all.length) body = '<div class="empty">Treninzi na terenu se pripremaju. Uskoro će se pojaviti ovdje.</div>';
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
// the legend uses the words of the labels and the block texts ("jog", "shuttle", "dribling") and says what they mean
const PLABEL = { sprint:'sprint', run:'trčanje', jog:'jog (lagano trčanje)', walk:'hod', shuttle:'shuttle (tamo-natrag)', dribble:'dribling (vođenje lopte)', pass:'dodavanje' };
const PSPEED = { sprint:7.5, run:5.5, jog:3.5, walk:1.6, shuttle:6, dribble:3, pass:12 };
// the diagram of a session; once a MAS test result exists the MAS grid is drawn to your own MAS
function fieldSpec(f){
  const spec = f && (window.PITCH || {})[f.id], l = masLast();
  if (!spec || !l) return spec;
  const mas = l.value, when = ' (MAS test ' + shortDate(l.at) + ')';
  if (f.id === 'mas-mreze-15-15') {
    const a = masM(100, 15), c = masM(70, 15);
    return Object.assign({}, spec, { pitch: { w: a + 16, h: c + 14 }, alt: 'MAS mreža: pravokutnik ' + a + ' × ' + c + ' m',
      markers: [{ kind:'start', x:8, y:7, label:'Start', labelSide:'below' }, { kind:'cone', x:8 + a, y:7 }, { kind:'cone', x:8 + a, y:7 + c }, { kind:'cone', x:8, y:7 + c }],
      paths: [{ kind:'run', points:[[8,7],[8 + a,7]], label:'15 s · 100 % MAS', order:1, block:0 }, { kind:'jog', points:[[8 + a,7],[8 + a,7 + c]], label:'15 s · 70 %', order:2, block:0 },
        { kind:'run', points:[[8 + a,7 + c],[8,7 + c]], label:'15 s · 100 % MAS', order:3, block:0 }, { kind:'jog', points:[[8,7 + c],[8,7]], label:'15 s · 70 %', order:4, block:0 }],
      dims: [{ from:[8,1.6], to:[8 + a,1.6], label: a + ' m' }, { from:[14 + a,7], to:[14 + a,7 + c], label: c + ' m' }],
      caption: 'Tvoja MAS ' + masTxt(mas) + ' m/s' + when + ': dionica ' + a + ' m, oporavak ' + c + ' m. Jedan krug mreže traje 1 min; 5 krugova bez stajanja čini seriju.' });
  }
  if (f.id === 'intervali-3-2-1') return Object.assign({}, spec, { caption: spec.caption + ' Tvoja MAS ' + masTxt(mas) + ' m/s' + when + ': krug za oko ' + Math.round(360 / mas) + ' s.' });
  return spec;
}
function pitchSvg(spec, opt){
  opt = opt || {};
  const full = !spec.pitch || spec.pitch === 'full';
  const W = full ? 105 : spec.pitch.w, H = full ? 68 : spec.pitch.h;
  const mg = full ? 3 : Math.max(1.2, W * .07);
  const Y = y => +(H - y).toFixed(2), X = x => +(+x).toFixed(2);
  // fs sizes the marks, ts the text: a full pitch is only ~360 px wide on a phone, so its labels are set larger (10-11 px)
  const thumb = !!opt.thumb, fs = full ? 3.3 : Math.max(.6, W * .045), ts = full ? 4.3 : fs;
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
  // Labels are collected first and placed at the end: each gets a few candidate spots and takes the first one that touches
  // no other label and no marker and keeps off the route lines; when every free spot touches a line, the first free one.
  // A label that fits nowhere is left out; the legend still explains the lines.
  const labels = [], blocked = [], lines = [];
  const angleOf = (x1, y1, x2, y2) => { let a = Math.atan2(-(y2 - y1), x2 - x1) * 180 / Math.PI; if (a > 90) a -= 180; if (a <= -90) a += 180; return Math.abs(a) < 2 ? 0 : a; };
  const alongLine = (x1, y1, x2, y2, side, sw) => (w, h) => {
    const len = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / len, uy = (y2 - y1) / len, a = angleOf(x1, y1, x2, y2), off = Math.max(lw, (sw || 0) / 2) + h / 2 + ts * .12, out = [];
    const sides = side < 0 ? [-1, 1] : [1, -1];
    // close to the line first, then a little further out (clears cones standing on the line), then shifted along it
    [[0, off], [0, off + ts * .9], [.22, off], [-.22, off], [.22, off + ts * .9], [-.22, off + ts * .9], [.36, off], [-.36, off]].forEach(([t, o]) =>
      sides.forEach(sd => out.push({ x: X((x1 + x2) / 2 + ux * len * t - uy * o * sd), y: Y((y1 + y2) / 2 + uy * len * t + ux * o * sd), a })));
    return out;
  };
  const addLabel = (text, size, pri, cands) => { if (text && !thumb) labels.push({ text: String(text), size, pri, cands, i: labels.length }); };
  if (!thumb) (spec.dims || []).forEach(dm => {
    const [x1,y1] = dm.from, [x2,y2] = dm.to, len = Math.hypot(x2-x1, y2-y1) || 1, nx = -(y2-y1)/len, ny = (x2-x1)/len, t = fs*.35;
    s += '<g class="dim" opacity=".85"><line x1="'+X(x1)+'" y1="'+Y(y1)+'" x2="'+X(x2)+'" y2="'+Y(y2)+'" stroke="#fff" stroke-width="'+(lw*.8)+'" stroke-dasharray="'+(fs*.35)+' '+(fs*.25)+'"/>' +
      '<line x1="'+X(x1+nx*t)+'" y1="'+Y(y1+ny*t)+'" x2="'+X(x1-nx*t)+'" y2="'+Y(y1-ny*t)+'" stroke="#fff" stroke-width="'+lw+'"/><line x1="'+X(x2+nx*t)+'" y1="'+Y(y2+ny*t)+'" x2="'+X(x2-nx*t)+'" y2="'+Y(y2-ny*t)+'" stroke="#fff" stroke-width="'+lw+'"/></g>';
    addLabel(dm.label, ts * .78, 1, alongLine(x1, y1, x2, y2, dm.labelSide === 'below' ? -1 : 1));
  });
  paths.forEach(p => {
    const st = PSTYLE[p.kind] || PSTYLE.run;
    const pts = p.points || [];
    if (pts.length < 2) return;
    const d = 'M' + pts.map(q => X(q[0]) + ' ' + Y(q[1])).join('L');
    const w = (thumb ? st.w * 2.2 : st.w) * (full ? 1 : W / 60);
    s += '<path d="'+d+'" fill="none" stroke="'+st.c+'" stroke-width="'+w.toFixed(2)+'" stroke-linecap="round" stroke-linejoin="round"'+(st.d ? ' stroke-dasharray="'+st.d.split(' ').map(v => (v * (full ? 1 : W / 60)).toFixed(2)).join(' ')+'"' : '')+(dimmed(p) ? ' opacity=".25"' : '')+'/>';
    for (let i = 1; i < pts.length; i++) lines.push([X(pts[i-1][0]), Y(pts[i-1][1]), X(pts[i][0]), Y(pts[i][1]), w / 2]);
    if (p.arrow !== false && !thumb) {
      const [ax, ay] = pts[pts.length - 1], [bx, by] = pts[pts.length - 2];
      const a = Math.atan2(ay - by, ax - bx), hl = fs * .75;
      const tip = [ax, ay], l = [ax - hl*Math.cos(a - .45), ay - hl*Math.sin(a - .45)], r = [ax - hl*Math.cos(a + .45), ay - hl*Math.sin(a + .45)];
      s += '<path d="M'+X(l[0])+' '+Y(l[1])+'L'+X(tip[0])+' '+Y(tip[1])+'L'+X(r[0])+' '+Y(r[1])+'" fill="none" stroke="'+st.c+'" stroke-width="'+w.toFixed(2)+'" stroke-linecap="round" stroke-linejoin="round"'+(dimmed(p) ? ' opacity=".25"' : '')+'/>';
      lines.push([X(l[0]), Y(l[1]), X(tip[0]), Y(tip[1]), w / 2], [X(r[0]), Y(r[1]), X(tip[0]), Y(tip[1]), w / 2]);
    }
    if (p.label && !dimmed(p)) {
      let best = 0, bi = 1; for (let i = 1; i < pts.length; i++) { const sl = Math.hypot(pts[i][0]-pts[i-1][0], pts[i][1]-pts[i-1][1]); if (sl > best) { best = sl; bi = i; } }
      const [x1,y1] = pts[bi-1], [x2,y2] = pts[bi];
      addLabel(p.label, ts * .82, 3, alongLine(x1, y1, x2, y2, p.labelSide === 'below' ? -1 : 1, w));
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
    // right, above (clear of the marker's own box), left, below, then the corners (a marker on the goal line); labelSide puts its side first
    addLabel(mk.label, ts * .74, 2, (w, h) => { const g = r * 1.3, up = y - r * 1.5 - h/2, dn = y + g + h/2, c = { right: { x: x + g + w/2, y: y, a: 0 }, above: { x: x, y: up, a: 0 }, left: { x: x - g - w/2, y: y, a: 0 }, below: { x: x, y: dn, a: 0 },
        aboveR: { x: x - r + w/2, y: up, a: 0 }, belowR: { x: x - r + w/2, y: dn, a: 0 }, aboveL: { x: x + r - w/2, y: up, a: 0 }, belowL: { x: x + r - w/2, y: dn, a: 0 } };
      return [mk.labelSide].concat(['right', 'above', 'left', 'below', 'aboveR', 'belowR', 'aboveL', 'belowL']).filter((k, i, a) => c[k] && a.indexOf(k) === i).map(k => c[k]); });
  });
  (spec.labels || []).forEach(l => addLabel(l.text, ts * .78, 2, (w, h) => [0, 1, -1, 2, -2].map(k => ({ x: X(l.x), y: Y(l.y) + k * h * 1.1, a: 0 }))));
  const placed = [], hit = (b, c) => b[0] < c[2] && c[0] < b[2] && b[1] < c[3] && c[1] < b[3];
  // does the pill (turned by c.a around its centre) touch a route line? (each segment clipped to the pill in the pill's own frame)
  const onLine = (c, w, h) => { const a = c.a * Math.PI / 180, cs = Math.cos(a), sn = Math.sin(a);
    return lines.some(([x1, y1, x2, y2, e]) => {
      const u1 = (x1 - c.x) * cs + (y1 - c.y) * sn, v1 = (y1 - c.y) * cs - (x1 - c.x) * sn, du = (x2 - c.x) * cs + (y2 - c.y) * sn - u1, dv = (y2 - c.y) * cs - (x2 - c.x) * sn - v1;
      let t0 = 0, t1 = 1;
      for (const [p, q] of [[-du, u1 + w/2 + e], [du, w/2 + e - u1], [-dv, v1 + h/2 + e], [dv, h/2 + e - v1]]) {
        if (!p) { if (q < 0) return false; continue; }
        const r = q / p; if (p < 0) { if (r > t1) return false; if (r > t0) t0 = r; } else { if (r < t0) return false; if (r < t1) t1 = r; }
      }
      return true;
    }); };
  labels.sort((a, b) => b.pri - a.pri || a.i - b.i).forEach(lb => {
    const w = lb.text.length * lb.size * .56 + lb.size * .9, h = lb.size * 1.45;
    let spare = null;
    for (const c of lb.cands(w, h)) {
      const rad = c.a * Math.PI / 180, bw = Math.abs(w * Math.cos(rad)) + Math.abs(h * Math.sin(rad)), bh = Math.abs(w * Math.sin(rad)) + Math.abs(h * Math.cos(rad));
      const box = [c.x - bw/2, c.y - bh/2, c.x + bw/2, c.y + bh/2];
      if (box[0] < -mg || box[1] < -mg || box[2] > W + mg || box[3] > H + mg) continue;
      if (placed.some(q => hit(q.box, box)) || blocked.some(q => hit(q, box))) continue;
      if (!onLine(c, w, h)) { placed.push({ box, lb, c, w, h }); return; }
      if (!spare) spare = { box, lb, c, w, h };
    }
    if (spare) placed.push(spare);
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
  return Object.keys(kinds).map(k => { const st = PSTYLE[k] || PSTYLE.run; return '<span class="lg"><svg width="28" height="8" viewBox="0 0 28 8" aria-hidden="true"><line x1="1" y1="4" x2="27" y2="4" stroke="'+st.c+'" stroke-width="2.4" stroke-linecap="round"'+(st.d ? ' stroke-dasharray="'+st.d.split(' ').map(v => (v*3).toFixed(1)).join(' ')+'"' : '')+'/></svg>'+esc(PLABEL[k] || k)+'</span>'; }).join('');
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
// one block in words: distance or time, the PDF's target time (the web articles give none: "oko"), intensity, your MAS distances, rest
function blockLine(b, f){
  const parts = [], mas = b.mas_pct && masNow();
  parts.push((b.sets > 1 ? b.sets + ' × ' : '') + (b.reps||1) + ' × ' + (b.distance_m ? fieldM(b.distance_m) : fieldDur(b.work_s || 30)));
  if (b.distance_m && b.work_s) parts.push((f && f.group === 'pre' ? 'cilj ' : 'oko ') + fieldDur(b.work_s));
  if (b.intensity_hr) parts.push(b.intensity_hr);
  if (mas) parts.push('za tebe ' + (b.lap_m ? 'krug za ~' + Math.round(b.lap_m * 100 / (mas * b.mas_pct)) + ' s' : masM(b.mas_pct, b.work_s) + ' m' + (b.rest_mas_pct ? ', oporavak ' + masM(b.rest_mas_pct, b.rest_s) + ' m' : '')));
  if (b.rest_s) parts.push((b.rest_mas_pct ? 'oporavak ' : 'odmor ') + fieldDur(b.rest_s) + (b.rest_type_hr && b.rest_type_hr !== 'odmor' ? ' – ' + b.rest_type_hr : ''));
  if (b.sets > 1 && b.set_rest_s) parts.push('između serija ' + fieldDur(b.set_rest_s));
  return parts.join(' • ');
}
VIEWS.field = function(t){
  const f = S.field[t.id];
  // the pitch warm-up (mini band and running drills); the cord activation needs the pulley in the gym
  const akt = S.pr['aktivacija-teren'];
  if (!f) return '<div class="view gut">' + topbar(backBtn()) + '<div class="empty">Ovaj trening više ne postoji.</div></div>';
  const spec = fieldSpec(f), mas = f.id === 'mas-test-5-min' || (f.blocks || []).some(b => b.mas_pct), ld = fieldLoad(f);
  return '<div class="view gut">' + topbar(backBtn()) +
    '<h1 class="h1">' + esc(f.name_hr) + '</h1>' +
    '<div style="display:flex;gap:8px;margin:12px 17px 0;flex-wrap:wrap">' + fieldTagsHtml(ld) + '<span class="tag">'+esc(f.goal_hr)+'</span>' + (f.week ? '<span class="tag">'+esc(f.week)+'. tjedan'+(f.dayHr ? ' · ' + esc(f.dayHr) : '')+'</span>' : '') + '</div>' +
    fieldLoadHtml(f, ld) +
    (spec ? '<figure class="pitch">' + pitchSvg(spec) + '<figcaption><div class="lgrow">' + pitchLegend(spec) + '</div>' + (spec.caption ? '<span>' + esc(spec.caption) + '</span>' : '') + '</figcaption></figure>' : '') +
    (f.summary_hr ? '<p style="margin:16px 17px 0;font-size:16px;line-height:24px;color:var(--text-body)">'+esc(f.summary_hr)+'</p>' : '') +
    (f.when_hr ? '<p class="sub" style="margin-top:10px">U predsezonskom planu: '+esc(f.when_hr)+'</p>' : '') +
    (f.how_hr && f.how_hr.length ? '<div class="stack" style="gap:8px;margin:14px 17px 0">' + f.how_hr.map((s, i) => '<div class="bul num"><i>'+(i+1)+'</i><span>'+esc(s)+'</span></div>').join('') + '</div>' : '') +
    (mas ? masCard(f) : '') +
    '<div style="margin-top:18px">' + daysPicker('fieldDays', f.id, f.days) + '</div>' +
    '<div class="stack" style="gap:16px;margin:20px 17px 0">' +
      (f.equipment_hr ? '<div class="feat">'+I.bars+'<span>'+esc(f.equipment_hr)+'</span></div>' : '') +
      (f.warmup_hr ? '<div class="feat">'+I.clock+'<span>Zagrijavanje: '+esc(f.warmup_hr)+'</span></div>' : '') +
    '</div>' +
    (akt ? '<div class="list" style="margin-top:18px"><button class="row" data-a="openPr" data-id="'+esc(akt.id)+'" style="min-height:64px"><span class="thumb" style="width:56px;height:56px">'+pathIcon(I.run,24)+'</span><span class="tx"><span class="t">Prvo zagrijavanje: '+esc(akt.name)+'</span><span class="m"><span>'+protoMin(akt)+' min</span></span></span>'+I.chev+'</button></div>' : '') +
    '<h2 class="h2">Blokovi</h2>' +
    '<div class="list" style="margin-top:14px">' + (f.blocks||[]).map((b,i) => '<div class="blk"><span class="no">'+(i+1)+'</span><span class="bt"><b>'+esc(b.label_hr)+'</b><span>'+esc(blockLine(b, f))+'</span>'+(b.cue_hr?'<span style="color:var(--text-2)">'+esc(b.cue_hr)+'</span>':'')+'</span></div>').join('') + '</div>' +
    (f.cooldown_hr ? '<p style="margin:18px 17px 0;font-size:14px;line-height:21px;color:var(--text-2)">Hlađenje: '+esc(f.cooldown_hr)+'</p>' : '') +
    '<p style="margin:18px 17px 0;font-size:14px;line-height:21px;color:var(--text-2)">Izvor: ' + (f.source_url ? '<a href="'+esc(f.source_url)+'" target="_blank" rel="noopener">'+esc(f.source_title || 'STATSports')+'</a>' : esc(f.source_title || 'STATSports')) + (spec ? ' · nacrt je vlastiti prikaz prema izvoru' : '') + '</p>' +
    '<div style="height:20px"></div></div>' +
    fieldStartHtml(f, ld);
};

/* ---------- player ---------- */
let P = null, ticker = null, audioCtx = null, wakeLock = null, wakeOk = true, wakeHinted = false, keepMedia = null;
// iOS leaves the context 'interrupted' after a call, Siri or the app in the background, not only 'suspended'
function ensureAudio(){ try { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); if (audioCtx.state !== 'running' && audioCtx.state !== 'closed') { const r = audioCtx.resume(); if (r && r.catch) r.catch(() => {}); } } catch(e){} }
// On the iPhone Web Audio obeys the silent switch. The opt-in 'playback' session keeps the signals audible (other apps' music may pause).
function audioMode(on){ try { if ('audioSession' in navigator) navigator.audioSession.type = on && S.settings.silentOk === true ? 'playback' : 'auto'; } catch(e){} }
function beep(freq, ms, vol){
  if (!S.settings.sound || !audioCtx) return;
  try { const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.frequency.value = freq; o.type = 'sine'; g.gain.value = vol || 0.18; o.connect(g); g.connect(audioCtx.destination); const t0 = audioCtx.currentTime; g.gain.setValueAtTime(vol||0.18, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + ms/1000); o.start(t0); o.stop(t0 + ms/1000 + 0.02); } catch(e){}
}
function buzz(p){ try { if (navigator.vibrate) navigator.vibrate(p); } catch(e){} }
async function keepAwake(on){
  if (on && !('wakeLock' in navigator)) { wakeOk = false; return; }
  try { if (on && !wakeLock) { wakeLock = await navigator.wakeLock.request('screen'); wakeOk = true; wakeLock.addEventListener('release', () => { wakeLock = null; }); } if (!on && wakeLock) { await wakeLock.release(); wakeLock = null; } }
  catch(e){ wakeLock = null; if (on && document.visibilityState === 'visible') wakeOk = false; }
}
// once per app start, when this phone cannot keep the screen on: the player settings say what to do
function wakeHint(){ if (!wakeOk && !wakeHinted && P && !P.done) { wakeHinted = true; toast('Ekran se tijekom treninga može ugasiti: vidi postavke playera.'); } }
document.addEventListener('visibilitychange', () => {
  if (!P || P.done) return;
  if (document.visibilityState === 'visible') { keepAwake(true); ensureAudio(); tick(); }
  else savePlay();
});

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
    } else { const r = repsOf(it, base.set); steps.push(Object.assign({}, base, { kind:'manual', side: r + ' ' + plural(r, 'ponavljanje', 'ponavljanja', 'ponavljanja') + (it.sides ? ' po strani' : '') + (it.kg ? ' · ' + fmtKg(it.kg) : '') + (it.note ? ' · ' + it.note : '') })); }
  };
  steps.push({ kind:'prep', dur:5, g:0, title:'Pripremi se', label:'Kreće za' });
  groupsOf(items).forEach((grp, gi) => {
    const first = grp.idx[0];
    // a timed exercise next: at least 15 s to get into position before it starts
    if (gi > 0) steps.push({ kind:'rest', dur: items[first].measure === 'time' ? Math.max(ts, 15) : ts, label:'Sljedeće', trans:true, g:first, e:exOf(items[first]), it:items[first], set:1, ss: lab[first] });
    if (!grp.ss) {
      const g = first, it = items[g], e = exOf(it), n = it.sets || 1;
      for (let s = 1; s <= n; s++) {
        const base = { g, e, it, set: s };
        pushSet(it, base);
        if (s < n && it.rest) steps.push(Object.assign({}, base, { kind:'rest', dur:it.rest, label:'Odmor' }));
      }
      return;
    }
    // every round ends with the group's rest (the last exercise's), also the extra rounds of an exercise with more sets
    const R = Math.max.apply(null, grp.idx.map(i => items[i].sets || 1)), roundRest = items[grp.idx[grp.idx.length - 1]].rest || 0;
    for (let r = 1; r <= R; r++) {
      const active = grp.idx.filter(i => (items[i].sets || 1) >= r);
      active.forEach((g, k) => {
        const it = items[g], e = exOf(it);
        const base = { g, e, it, set: r, round: r, rounds: R, ss: lab[g] };
        pushSet(it, base);
        if (k === active.length - 1) { const rr = Math.max(it.rest || 0, roundRest);
          if (r < R && rr) steps.push(Object.assign({}, base, { kind:'rest', dur:rr, label:'Odmor nakon kruga' }));
          else if (r < R) {   // no rest before the next round: a hold after a set with reps does not start by itself there either
            const gn = grp.idx.find(i => (items[i].sets || 1) >= r + 1), nx = items[gn];
            if (nx && nx.measure === 'time' && it.measure !== 'time') {
              const nb = { g: gn, e: exOf(nx), it: nx, set: r + 1, round: r + 1, rounds: R, ss: lab[gn] };
              steps.push(Object.assign({}, nb, { kind:'ready' }));
              steps.push(Object.assign({}, nb, { kind:'switch', dur: Math.max(ss, 10), go:true }));
            }
          }
        }
        else {
          const gn = active[k + 1], nx = items[gn], ne = exOf(nx);
          if (it.rest) steps.push(Object.assign({}, base, { kind:'rest', dur:it.rest, label:'Sljedeće: ' + ne.name }));
          else if (nx.measure === 'time' && it.measure !== 'time') {
            // from a set with reps to a hold: the hold never starts by itself. Tap when you are at the bench (or the TRX),
            // then a short countdown lets you get into position.
            const nb = { g: gn, e: ne, it: nx, set: r, round: r, rounds: R, ss: lab[gn] };
            steps.push(Object.assign({}, nb, { kind:'ready' }));
            steps.push(Object.assign({}, nb, { kind:'switch', dur: Math.max(ss, 10), go:true }));
          }
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
  // A recovery run (rest_mas_pct, the MAS grid) follows every run, also the last one of a set (5 min without stopping), then the set rest.
  const steps = [{ kind:'prep', dur:10, g:0, title:'Pripremi se', label:'Kreće za' }];
  const blocks = f.blocks || [];
  blocks.forEach((b, g) => {
    const sets = b.sets||1, reps = b.reps||1, jog = !!(b.rest_mas_pct && b.rest_s);
    const restLabel = jog ? 'Lagano trčanje · ' + b.rest_mas_pct + ' % MAS' : 'Odmor' + (b.rest_type_hr && b.rest_type_hr !== 'odmor' ? ' · ' + b.rest_type_hr : '');
    for (let s = 1; s <= sets; s++) for (let r = 1; r <= reps; r++) {
      steps.push({ kind:'work', dur: b.work_s || 30, g, b, set:s, rep:r, sets, reps });
      const lastRep = r === reps, lastSet = s === sets, lastBlock = g === blocks.length - 1;
      if ((!lastRep || jog) && b.rest_s) steps.push({ kind:'rest', dur:b.rest_s, g, b, set:s, rep:r, sets, reps, jog, label: restLabel });
      if (lastRep && !lastSet && (jog ? b.set_rest_s : b.set_rest_s || b.rest_s)) steps.push({ kind:'rest', dur: b.set_rest_s || b.rest_s, g, b, set:s, rep:r, sets, reps, label:'Odmor između serija' });
      else if (lastRep && lastSet && !lastBlock && b.rest_s && !jog) steps.push({ kind:'rest', dur: b.rest_s, g, b, set:s, rep:r, sets, reps, label: restLabel });
    }
  });
  return steps;
}
function startPlayer(cfg){
  audioMode(true); ensureAudio();
  P = Object.assign({ i:0, paused:false, done:false, endAt:0, left:0, startedAt: Date.now(), lastBeep:null, doneSteps:{} }, cfg);
  if (!P.steps.length) return;
  enterStep(0);
  S.stack.push({ v:'play' }); S.sheet = null; render();
  keepAwake(true).then(wakeHint);
  clearInterval(ticker); ticker = setInterval(tick, 200);
}
// t0: when the step really began (catching up after the page was frozen), otherwise now
function enterStep(i, t0){
  P.i = i; P.lastBeep = null;
  const st = P.steps[i];
  if (!st) { finish(); return; }
  P.endAt = st.dur ? (t0 || Date.now()) + st.dur*1000 : 0; P.left = st.dur ? Math.max(0, (P.endAt - Date.now())/1000) : 0;
  if (st.kind === 'work' || st.kind === 'manual') { beep(880, 260, 0.22); buzz(120); }
  else if (st.kind === 'switch') { beep(660, 200); buzz([80,60,80]); }
  else if (st.kind === 'rest' || st.kind === 'ready') { beep(520, 220); buzz(60); }
  savePlay();
}
function remaining(){ const st = P.steps[P.i]; if (!st || !st.dur) return 0; return P.paused ? P.left : Math.max(0, (P.endAt - Date.now())/1000); }
function tick(){
  if (!P || P.done || P.paused) return;
  const st = P.steps[P.i]; if (!st) return;
  if (st.dur) {
    const r = remaining(); const whole = Math.ceil(r);
    if (whole <= 3 && whole >= 1 && P.lastBeep !== whole) { P.lastBeep = whole; beep(740, 120, 0.14); }
    if (r <= 0) { timeUp(); return; }
  }
  paintPlayer(false);
}
// A timed step ran out. If the page was frozen meanwhile (screen locked, app in the background), every step whose time
// also ran out is passed too, so the player shows where real time is instead of starting the next interval in full.
function timeUp(){
  const now = Date.now(), late = now - P.endAt; let t = P.endAt, i = P.i;
  markDone(i); i++;
  while (P.steps[i] && P.steps[i].dur && t + P.steps[i].dur * 1000 <= now) { t += P.steps[i].dur * 1000; markDone(i); i++; }
  enterStep(i, late > 3000 ? t : 0);
  if (P.done) return;
  if (late > 3000) toast('Dok je ekran bio ugašen, odbrojavanje je teklo dalje.');
  paintPlayer(true);
}
// work the player saw you finish: a set closed with the ring, a timed set that ran to the end
function markDone(i){ if (isWork(P.steps[i])) P.doneSteps[i] = 1; }
function anyDone(){ return Object.keys(P.doneSteps || {}).length > 0; }
// something worth a history entry: work the player saw, or an exercise you marked yourself on the done screen
function anyCredit(){ return anyDone() || Object.keys(P.answers || {}).some(j => P.answers[j] === true || P.answers[j] === false); }
function workOf(j){ const out = []; P.steps.forEach((s, i) => { if (isWork(s) && s.g === j) out.push(i); }); return out; }
function setsDoneOf(j){
  const w = workOf(j), n = (P.items[j] || {}).sets || 1; if (!w.length) return 0;
  return Math.min(n, Math.floor(w.filter(i => P.doneSteps[i]).length * n / w.length + 1e-9));
}
// every set done -> "Sve odrađeno"; some -> 'partial'; none (skipped or never reached) -> 'skip'. The last two don't count for progression.
function autoAnswer(j){ if (!workOf(j).some(i => P.doneSteps[i])) return 'skip'; return setsDoneOf(j) >= ((P.items[j] || {}).sets || 1) ? true : 'partial'; }
function lrDefault(j){ const it = P.items[j] || {}; return Math.max(0, repsOf(it, it.sets || 1) - 2); }
function lastRepsOf(j){ return P.lastReps && P.lastReps[j] != null ? Math.max(0, +P.lastReps[j] || 0) : lrDefault(j); }
function finish(){
  P.done = true; P.finishedAt = Date.now(); clearInterval(ticker); keepAwake(false);
  if (!P.quit) { beep(988, 420, 0.22); buzz([120,80,120]); }
  P.secs = Math.round((P.finishedAt - P.startedAt)/1000);
  P.answers = P.answers || {}; P.lastReps = P.lastReps || {}; P.auto = {};
  if (P.mode === 'ex') (P.items || []).forEach((it, j) => { P.auto[j] = autoAnswer(j); if (P.answers[j] == null) P.answers[j] = P.auto[j]; });
  savePlay();
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
// a hold you get ready for: skipping lands on its "Sljedeće" step, not inside the running hold
function landAt(k){ while (k > 0 && (P.steps[k - 1].kind === 'ready' || P.steps[k - 1].go) && slotOf(P.steps[k - 1]) === slotOf(P.steps[k])) k--; return k; }
function jump(dir){
  const i = P.i, st = P.steps[i]; if (!st) return;
  ensureAudio();
  if (dir > 0) {
    const sl = slotOf(st);
    const k = P.steps.findIndex((s, x) => x > i && isWork(s) && slotOf(s) !== sl);
    if (k === -1) { finish(); return; }
    enterStep(landAt(k));
  } else {
    const j = slotFirstWork(i);
    if (isWork(P.steps[j]) && j < i) enterStep(j);
    else { let k = j - 1; while (k >= 0 && !isWork(P.steps[k])) k--; enterStep(k < 0 ? 0 : slotFirstWork(k)); }
  }
  P.paused = false; P.sheetPause = false; render();
}
function tapRing(){
  const st = P.steps[P.i]; if (!st) return;
  ensureAudio();
  if (st.kind === 'manual') { markDone(P.i); enterStep(P.i + 1); render(); return; }
  if (st.kind === 'ready' || (st.kind === 'rest' && !st.trans && !P.paused)) { enterStep(P.i + 1); render(); return; }
  // a paused rest continues first; a pause set or lifted by hand is never undone by closing the quit sheet
  if (P.paused) { P.paused = false; P.endAt = Date.now() + P.left*1000; keepAwake(true); }
  else { P.left = remaining(); P.paused = true; }
  P.sheetPause = false;
  savePlay();
  paintPlayer(true);
}
function curView(){
  const st = P.steps[P.i] || {};
  const nextWork = P.steps.slice(P.i + 1).find(isWork);
  const v = { st, title:'', meta:'', hint:'', badge:'', big:'', ringFrac:1, ringColor:'var(--accent)', fieldPanel:null, e:null };
  if (P.mode === 'field') {
    const b = st.b || (nextWork && nextWork.b);
    const blocks = (P.f.blocks||[]).length;
    v.title = b ? b.label_hr : P.title;
    v.meta = b ? 'Blok ' + ((st.g||0)+1) + '/' + blocks + (st.rep && st.reps > 1 ? ' • ponavljanje ' + st.rep + '/' + st.reps : '') + (st.rep && st.sets > 1 ? ' • serija ' + st.set + '/' + st.sets : '') : '';
    // distances with a decimal comma; MAS runs show your own metres (or lap time); a recovery run is running, not rest
    const work = st.kind === 'work', jog = st.kind === 'rest' && st.jog, nb = nextWork && nextWork.b, nxt = nb ? fieldDist(nb) || fieldDur(nb.work_s || 30) : '';
    v.fieldPanel = { cls: work ? 'work' : 'rest', ph: st.kind === 'prep' ? 'PRIPREMI SE' : work ? 'RAD' : jog ? 'LAGANO TRČANJE' : 'ODMOR',
      dist: work && b ? fieldDist(b) : jog && masNow() ? masM(st.b.rest_mas_pct, st.b.rest_s) + ' m' : '',
      sm: work && b ? (b.intensity_hr || '') : jog ? st.b.rest_mas_pct + ' % MAS' + (nxt ? ' • sljedeće: ' + nxt : '') : (nb ? 'Sljedeće: ' + nxt + (nb.intensity_hr ? ' • ' + nb.intensity_hr : '') : '') };
    v.hint = work && b && b.cue_hr ? b.cue_hr : (st.kind === 'rest' ? (st.label || 'Odmor') : '');
  } else {
    // a rest before another exercise shows that exercise: its name, video, set and load, so you can set it up
    const ahead = st.trans || (st.kind === 'rest' && nextWork && nextWork.e !== st.e) ? nextWork : null;
    const src = ahead || st;
    const e = ahead ? ahead.e : (st.e || (nextWork && nextWork.e)); v.e = e;
    const it = ahead ? ahead.it : (st.it || (nextWork && nextWork.it));
    const groups = P.items.length;
    const lab = src.ss;
    v.title = st.kind === 'prep' ? (e ? e.name : P.title) : (ahead || st.kind === 'ready') ? 'Sljedeće: ' + (e ? e.name : '') : (e ? e.name : '');
    v.meta = it ? ((lab ? lab.L + lab.k + ' • ' : (src.g + 1) + '/' + groups + ' • ') + dose(it) + (e && e.cat ? ' • ' + e.cat : '')) : '';
    // "krug" is only the round of a superset or circuit; the button in the middle is the "brojač"
    const setTxt = s => s.ss ? groupWord(s.ss.size) + ' ' + s.ss.L + ' • krug ' + s.round + '/' + s.rounds : 'Serija ' + s.set + '/' + ((s.it && s.it.sets) || 1);
    const coming = st.kind === 'rest' && nextWork && (st.trans || (st.ss ? nextWork.ss && nextWork.ss.L === st.ss.L : nextWork.g === st.g)) ? nextWork : null;
    v.badge = st.kind === 'manual' ? setTxt(st) + ' • ' + st.side
      : st.nextEx ? st.side
      : st.kind === 'rest' ? (coming && !st.trans ? (coming.ss ? setTxt(coming) : 'Sljedeća serija ' + coming.set + '/' + ((coming.it && coming.it.sets) || 1)) : '')
      : st.kind === 'ready' || st.go ? setTxt(st)
      : ((it && st.set && (st.ss || (it.measure === 'time' && (it.sets||1) > 1)) ? setTxt(st) + (st.side ? ' • ' : '') : '') + (st.side || ''));
    v.hint = st.kind === 'manual' ? (it && it.sides ? 'Odradi obje strane pa dodirni brojač' : 'Dodirni brojač kad završiš seriju')
      : st.kind === 'ready' ? 'Namjesti se pa dodirni brojač'
      : st.kind === 'rest' && !st.trans ? (st.label === 'Odmor nakon kruga' ? st.label : 'Odmor') + ' • dodirni brojač da preskočiš'
      : st.go ? 'Zauzmi početni položaj'
      : st.nextEx ? 'Prijeđi na sljedeću vježbu'
      : st.kind === 'switch' ? 'Namjesti se za drugu stranu'
      : st.kind === 'prep' ? 'Namjesti se'
      : 'Dodirni brojač za pauzu';
  }
  if (st.kind === 'manual') { const tot = st.ss ? st.rounds : (st.it ? st.it.sets : 1); v.big = st.set + '/' + tot; v.ringFrac = (st.set - 1) / tot; }
  else if (st.kind === 'ready') { v.big = ''; v.ringFrac = 0; }
  else { const r = remaining(); v.big = r >= 60 ? fmt(r) : String(Math.ceil(r)); v.ringFrac = st.dur ? r / st.dur : 0;
    if (P.paused && st.dur) v.hint = 'Pauzirano na ' + (r >= 60 ? fmt(r) : Math.ceil(r) + ' s') + ' • dodirni brojač za nastavak'; }
  if (st.kind === 'switch' || st.kind === 'rest' || st.kind === 'prep' || st.kind === 'ready') v.ringColor = 'var(--muted)';
  return v;
}
// Session in progress, kept on the phone at every step: a reload or iOS closing the app does not lose it.
const PLAY_KEY = 'mt.play';
function savePlay(){
  if (!P) return;
  lsSet(PLAY_KEY, { v:1, mode:P.mode, title:P.title, ref:P.ref || null, dose: P.dose === 'season' ? 'season' : null, items: P.mode === 'ex' ? P.items : null, i:P.i, left: P.done ? 0 : remaining(),
    startedAt:P.startedAt, doneSteps:P.doneSteps || {}, done:!!P.done, quit:!!P.quit, secs:P.secs || 0, finishedAt:P.finishedAt || 0,
    answers:P.answers || null, auto:P.auto || null, lastReps:P.lastReps || null, at: Date.now() });
}
function clearPlay(){ try { localStorage.removeItem(PLAY_KEY); } catch(e){} }
// on the next start: an unfinished session (up to 12 h old) can be continued; a finished one that never reached the history can be saved
function playResume(){
  const s = lsGet(PLAY_KEY, null);
  if (!s || !s.ref || P) return;
  // after the data is loaded, and never over another sheet or a form being edited
  if (S.dbState === 'loading') { setTimeout(playResume, 100); return; }
  if (S.dbState !== 'ready') return;
  if (S.sheet || FORM_VIEWS[top().v]) { setTimeout(playResume, 500); return; }
  if ((!s.done && Date.now() - (s.at || 0) > 12 * 3600e3) || (s.mode === 'field' ? !S.field[s.ref.id] : !(s.items || []).length)) { clearPlay(); return; }
  // its save was refused, but a later save stored it after all (it was kept in memory): nothing to offer, never a second entry
  if (s.done && S.log.some(l => l.at === s.finishedAt && l.kind === s.ref.kind && l.refId === s.ref.id)) { clearPlay(); return; }
  S.sheet = { kind:'resume', s }; render();
}
function restorePlay(s){
  const f = s.mode === 'field' ? S.field[s.ref.id] : null;
  if (s.mode === 'field' ? !f : !(s.items || []).length) return false;
  audioMode(true); ensureAudio();
  const now = Date.now(), away = s.done ? 0 : Math.max(0, now - (s.at || now));   // time away is not training time
  P = { i:0, paused:false, done:!!s.done, endAt:0, left:0, lastBeep:null, mode:s.mode, title:s.title, ref:s.ref, items: f ? undefined : s.items, f: f || undefined, dose: f && s.dose === 'season' ? 'season' : f ? 'full' : undefined,
    steps: f ? stepsFromField(s.dose === 'season' ? fieldDose(f) : f) : stepsFromItems(s.items), startedAt:(s.startedAt || now) + away, doneSteps:s.doneSteps || {}, quit:!!s.quit, secs:s.secs || 0, finishedAt:s.finishedAt || 0 };
  if (s.answers) P.answers = s.answers; if (s.auto) P.auto = s.auto; if (s.lastReps) P.lastReps = s.lastReps;
  S.stack.push({ v:'play' }); S.sheet = null;
  if (!P.done) {   // back at the same step; a timed one waits, paused, with the time that was left
    P.i = Math.max(0, Math.min(s.i || 0, P.steps.length - 1));
    const st = P.steps[P.i];
    if (st && st.dur) { P.paused = true; P.left = s.left > 0 && s.left <= st.dur ? s.left : st.dur; }
    savePlay(); keepAwake(true); clearInterval(ticker); ticker = setInterval(tick, 200);
  }
  render();
  return true;
}
// leaves the player without saving anything more
function leavePlay(){ clearInterval(ticker); keepAwake(false); audioMode(false); P = null; if (top().v === 'play') S.stack.pop(); render(); }
// "Spremi odrađeno": the part you did goes to the history. With exercises to ask about, the done screen comes first.
function saveSoFar(){
  S.sheet = null;
  if (!anyDone()) { clearPlay(); leavePlay(); toast('Trening nije spremljen: još ništa nije odrađeno do kraja.'); return; }
  P.quit = true; P.paused = false; finish();
  if (P.mode === 'ex' && progCandidates().length) return;
  const r = logSession(); leavePlay(); if (r.saved) toast(r.cut || 'Spremljeno je ono što si odradio.');   // never a silent cap; a refused save has said so itself
}
// The history is never cut silently. Sessions older than a year keep their date, name and duration but not the per-exercise
// details (a tenth of the space: this site's storage holds about 2,5 M characters, shared with another app); past 2000 sessions
// (many years) the oldest are removed and you are told.
const LOG_MAX = 2000;
function trimLog(){
  const yr = Date.now() - 365 * DAY_MS;
  S.log.forEach(l => { if (l.at < yr && l.items) delete l.items; });
  if (S.log.length <= LOG_MAX) return '';
  const n = S.log.length - LOG_MAX; S.log = S.log.slice(0, LOG_MAX);
  // 'zapisa': the history also holds test results and exercises tried from the library
  return 'Povijest ima ' + LOG_MAX + ' zapisa, pa ' + (n === 1 ? 'je najstariji uklonjen' : plural(n, 'je uklonjen ' + n + ' najstariji', 'su uklonjena ' + n + ' najstarija', 'je uklonjeno ' + n + ' najstarijih')) + '. Stariji ostaju samo u kopijama koje si izvezao.';
}
// writes the session (also a partly done one) to the history and counts progression
function logSession(){
  const entry = { name: P.title, kind: P.ref ? P.ref.kind : 'protocol', refId: P.ref ? P.ref.id : null, at: P.finishedAt || Date.now(), secs: P.secs || 0 };
  if (P.mode === 'ex') entry.items = (P.items || []).map((it, j) => {
    const a = P.answers && P.answers[j] != null ? P.answers[j] : autoAnswer(j), n = it.sets || 1, did = setsDoneOf(j);
    const x = { exId: it.exId, measure: it.measure, sets: it.sets, reps: it.reps, sec: it.sec, kg: it.kg || 0, sides: !!it.sides, done: a === true || a === 'partial' };   // partly done (even no whole set, e.g. one side of a hold) = done + setsDone; a failure is only 'Nisam uspio'
    if (Array.isArray(it.repsList)) x.repsList = it.repsList.slice();
    if (a === 'skip') { x.skipped = true; x.setsDone = 0; }
    else if (a !== true && did < n) x.setsDone = did;
    if (a === false && it.measure !== 'time') x.lastReps = lastRepsOf(j);
    return x;
  });
  if (P.mode === 'field' && P.f) entry.load = fieldDoneLoad();   // what was run: metres, fast running, sprint, zones, the dose
  const news = applyProgress();
  S.log.unshift(entry); const test = masFromPlay(); if (test) S.log.splice(1, 0, test); const cut = trimLog();
  const saved = persist(); if (saved) clearPlay();   // a refused save keeps the snapshot: the next start offers the session again
  return { news, cut, saved };
}
const newsMsg = news => (news.length > 1 ? 'Novi prijedlozi' : 'Novi prijedlog') + ' na stranici Napredak: ' + news.join(', ');
// short durations in seconds, the rest in whole minutes ("45 min", not "45:12 min")
function fmtDur(s){ s = Math.round(s || 0); return s < 60 ? s + ' s' : Math.round(s / 60) + ' min'; }
// reps you actually did in a logged item: per-set reps, only the sets done, the failed last set as you entered it
function repsDone(x){
  const n = x.setsDone != null ? x.setsDone : (x.sets || 1), list = Array.isArray(x.repsList) ? x.repsList : null; let t = 0;
  for (let s = 1; s <= n; s++) t += (list && list[s - 1]) || x.reps || 0;
  if (x.done === false && x.lastReps != null && n > 0) t += x.lastReps - ((list && list[n - 1]) || x.reps || 0);
  return Math.max(0, t);
}
// the done screen tells the week as it will be once this session is saved
function weekAfter(){
  const saved = S.log; S.log = [{ kind: P.ref.kind, refId: P.ref.id, at: P.finishedAt || Date.now() }].concat(saved);
  try { const ws = weekStart(Date.now()); return weekStatus(ws, weekPlan(ws)); } finally { S.log = saved; }
}
/* ---------- progression: a step after N sessions in a row with every set done; coarse weight jumps use double progression (one step is at most ~10 % of your estimated max) ---------- */
const DB_STEPS = [2.5, 5, 7.5, 10, 15, 20];   // your dumbbell pairs; kg is the weight of one dumbbell
const LOWER_ZONES = ['Kvadriceps','Gluteus','Gluteus medius','Stražnja loža','Kuk','Aduktori','Lisni mišić'];
const PROG_CATS = { Snaga:1, Eksplozivnost:1, Trup:1 };
const PROG_REFS = [
  { t:'Rønnestad i sur. (2011): u sezoni jedan trening snage tjedno zadržava snagu i sprint', url:'https://pubmed.ncbi.nlm.nih.gov/21873897/' },
  { t:'ACSM (2009): +2–10 % opterećenja kad možeš 1–2 ponavljanja više od zadanog', url:'https://doi.org/10.1249/MSS.0b013e3181915670' },
  { t:'Plotkin i sur. (2022): dodavanje ponavljanja jednako je učinkovito kao dodavanje kilograma', url:'https://peerj.com/articles/14142/' }
];
const PLATES = [1.25, 2.5, 5];
const plateKg = () => PLATES.indexOf(S.settings.plateKg) !== -1 ? S.settings.plateKg : 5;   // smallest plates you own (Doziranje)
const kgRound = v => Math.round(v * 100) / 100;
// bodyweight exercises that only use the bar as a handle (inverted row); the exercise's own bw flag wins
const isBw = e => e.bw != null ? !!e.bw : /australsk|inverted row/i.test((e.name || '') + ' ' + (e.alt || ''));
// how kilograms work: 'bar' = 20 kg bar + a pair of plates, 'lm' = landmine (plates on the free end), 'db' = one dumbbell of your pairs, 'kb' = the 20 kg kettlebell, '' = no load
function loadKind(e){
  if (!e || isBw(e)) return '';
  const eq = exEquip(e);
  if (eq.indexOf('Landmine') !== -1) return 'lm';
  if (eq.indexOf('Šipka') !== -1 || /trap bar/i.test(e.equipment || '')) return 'bar';
  if (eq.indexOf('Bučice') !== -1) return 'db';
  return eq.indexOf('Girja') !== -1 ? 'kb' : '';
}
const loaded = e => !!loadKind(e);
// progression of these needs your kilograms first (a jump with the bar stays as prescribed)
const needsKg = e => e.cat !== 'Eksplozivnost' && ['bar', 'lm', 'db'].indexOf(loadKind(e)) !== -1;
// the heaviest load you can actually set that is not above kg (never below the empty 20 kg bar or one landmine plate)
function roundLoad(e, kg){
  const k = loadKind(e), p = plateKg();
  if (k === 'kb') return 20;
  if (k === 'db') { const ok = DB_STEPS.filter(w => w <= kg + 1e-9); return ok.length ? ok[ok.length - 1] : DB_STEPS[0]; }
  const base = k === 'lm' ? 0 : 20, st = k === 'lm' ? p : 2 * p;
  return kgRound(Math.max(k === 'lm' ? p : 20, base + Math.floor((kg - base) / st + 1e-9) * st));
}
// the load for `reps` reps by your estimated max: the heaviest one that still allows them; with your big dumbbell steps
// the heavier pair wins when it allows 1–2 reps less (2 from 8 reps up), so dumbbell loads aren't always rounded down
function loadFor(e, e1, reps){
  if (loadKind(e) !== 'db') return roundLoad(e, e1 * pctFor(reps));
  const fit = w => Math.floor(30 * (e1 / w - 1) + 1e-6), min = reps - (reps >= 8 ? 2 : 1);
  return DB_STEPS.filter(w => fit(w) >= min).pop() || DB_STEPS[0];
}
// the next load up: +2,5 kg (+5 kg for leg lifts) or the smallest step your plates allow, whichever is bigger
function nextLoad(e, kg){
  const k = loadKind(e), p = plateKg();
  if (k === 'db') return DB_STEPS.find(w => w > kg + 1e-9) || 0;
  if (k !== 'bar' && k !== 'lm') return 0;
  const base = k === 'lm' ? 0 : 20, st = k === 'lm' ? p : 2 * p, want = kg + (LOWER_ZONES.indexOf((e.zones || [])[0]) !== -1 ? 5 : 2.5);
  let v = base + Math.max(0, Math.ceil((want - base) / st - 1e-9)) * st;
  if (v <= kg + 1e-9) v += st;
  return kgRound(v);
}
function progKind(e, it){
  if (it.measure === 'time') return 'time';
  const k = loadKind(e);
  if (k === 'kb') return 'kb';
  if (k && it.kg > 0) return k === 'db' ? 'db' : 'bar';
  return 'reps';
}
const ponTxt = n => n + ' ' + plural(n, 'ponavljanje', 'ponavljanja', 'ponavljanja');
// the next dose after N good sessions in a row; item null means "time for a harder variation"
function nextDose(e, it){
  const k = progKind(e, it), n = Object.assign({}, it);
  const r0 = it.r0 || it.reps || 10, r1 = it.r1 || Math.min(Math.max(r0 + 4, 6), 20), reps = it.reps || r0;
  // per-set reps (e.g. 6/5/5/4) move with the prescribed reps, so an accepted dose reaches the player (it reads the list first)
  const list = it.measure !== 'time' && Array.isArray(it.repsList) && it.repsList.length ? it.repsList : null, was = list ? list.join('/') : reps;
  const setReps = (nr, ns) => { n.reps = nr; if (!list) return ponTxt(nr); const l = list.slice(0, ns || list.length); while (l.length < (ns || list.length)) l.push(l[l.length - 1]);
    n.repsList = l.map(x => Math.min(60, Math.max(1, x + nr - reps))); return n.repsList.join('/') + ' ponavljanja'; };
  const moreReps = why => { const t = setReps(reps + 1); n.r0 = r0; n.r1 = r1; return { item:n, text: was + ' → ' + t + (why || '') }; };
  if (k === 'time') { const cap = it.cap || e.cap || (e.cat === 'Rehab' ? 30 : 60), sec = it.sec || 30; if (sec >= cap) return { item:null, text:'Dosegnuo si ' + cap + ' s: prijeđi na težu varijantu' }; n.sec = Math.min(cap, sec + 5); return { item:n, text: sec + ' → ' + n.sec + ' s' }; }
  // jumps and throws get better through height, speed and harder variations, not more reps or kilograms (the kettlebell swing keeps its own rule)
  if (e.cat === 'Eksplozivnost' && k !== 'kb') return { item:null, text: loadKind(e) === 'bar' ? 'Skok sa šipkom ostaje lagan: napreduj brzinom i visinom skoka, ne kilogramima' : exEquip(e).indexOf('Plyo box') !== -1 ? 'Prijeđi na višu stranu kutije (40 → 50 → 60 cm) ili na težu varijantu skoka' : exEquip(e).indexOf('Medicinka') !== -1 ? 'Prijeđi na težu medicinku ili težu varijantu bacanja; ponavljanja ostaju ista' : 'Prijeđi na težu varijantu; skokovi i bacanja ne napreduju s više ponavljanja' };
  if (k === 'reps' && !(it.kg > 0) && needsKg(e)) return { item:null, text:'Upiši kilograme u uređivanju protokola pa ću ih povećavati' };
  if (k === 'bar' || k === 'db') {
    // double progression: the next load comes once its step is at most ~10 % of your estimated max; until then the reps go up
    const nx = nextLoad(e, it.kg), fit = nx ? Math.floor(30 * (e1rm(it.kg, reps) * 1.1 / nx - 1) + 1e-6) : -1;
    if (nx && (fit >= r0 || (reps >= r1 && fit >= Math.min(5, r0)))) { const nr = Math.min(r0, fit); n.kg = nx; const t = setReps(nr); n.r0 = r0; n.r1 = r1; return { item:n, text: fmtKg(it.kg) + ' → ' + fmtKg(nx) + (nr !== reps ? ', ' + was + ' → ' + t : '') }; }
    if (reps < r1 || (nx && reps < (r0 >= 8 ? 20 : r1 + 4))) return moreReps(nx ? ' (za ' + fmtKg(nx) + ' još je rano)' : '');
    return { item:null, text: nx ? 'Do ' + fmtKg(nx) + ' je prevelik skok: uspori spuštanje na 3 s ili dodaj seriju' : 'Najteže bučice su svladane: dodaj seriju ili težu varijantu' };
  }
  if (k === 'kb') {
    if (reps < r1) return moreReps();
    if ((it.sets || 1) < 5) { n.sets = (it.sets || 1) + 1; const t = setReps(r0, n.sets); n.r0 = r0; n.r1 = r1; return { item:n, text:(it.sets || 1) + ' → ' + n.sets + ' ' + plural(n.sets, 'serija', 'serije', 'serija') + ', opet ' + t }; }
    return { item:null, text:'S girjom od 20 kg dalje ide teža varijanta' };
  }
  if (reps < r1) return moreReps();
  return { item:null, text:'Gornja granica ponavljanja: prijeđi na težu varijantu' };
}
// Exercises asked about at the end of a session. Programme sessions (e.g. TAE) are only recorded: their weeks set the doses.
// Rehab holds from phase 2 on (e.g. the Copenhagen plank) progress up to 30 s too; phase-1 isometrics stay as prescribed.
function progCandidates(){
  if (!P || P.mode !== 'ex' || !P.ref || P.ref.kind !== 'protocol') return [];
  const p = S.pr[P.ref.id]; if (!p) return [];
  P.answers = P.answers || {}; P.lastReps = P.lastReps || {};
  const out = [];
  (p.items || []).forEach((it, j) => {
    const e = S.ex[it.exId]; const was = P.items[j];
    if (!e || !was || was.exId !== it.exId) return;
    if (!PROG_CATS[e.cat] && !(it.kg > 0) && !(e.cat === 'Rehab' && it.measure === 'time' && +e.phase !== 1)) return;
    out.push({ j, e, it, prog: !!p.program, next: nextDose(e, it) });
  });
  return out;
}
const progN = () => S.settings.progN === 3 ? 3 : 2;
// answers: true (or not touched) = every set done, false = failed; 'partial' and 'skip' leave the counters as they are
const answerOf = j => { const a = P.answers ? P.answers[j] : undefined; return a === false ? 'fail' : a == null || a === true ? 'ok' : 'none'; };
// counts sessions with every set done (ok) or not (fail); doses change only when you accept a suggestion
function applyProgress(){
  const cands = progCandidates(); if (!cands.length) return [];
  const p = S.pr[P.ref.id]; const n = clone(p); delete n.id; const news = [];
  cands.forEach(c => {
    if (c.prog) return;
    const it = n.items[c.j], a = answerOf(c.j);
    if (a === 'ok') { it.ok = (it.ok || 0) + 1; it.fail = 0; if (it.ok === progN() && c.next.item) news.push(c.e.name); }
    else if (a === 'fail') { it.ok = 0; it.fail = (it.fail || 0) + 1; it.snoozeOk = 0; }
  });
  n.updatedAt = Date.now();
  S.pr[P.ref.id] = Object.assign({ id: P.ref.id }, n);
  return news;
}
function doneMsg(c){
  const N = progN(), it = c.it, a = answerOf(c.j);
  if (a === 'none') return c.prog ? '' : 'Ne računa se za napredak';
  if (c.prog) return a === 'fail' ? 'Zabilježeno' : '';
  if (a === 'fail') return it.prev && (it.fail || 0) + 1 >= 2 ? 'Dvaput zaredom: na stranici Napredak možeš vratiti ' + doseBase(it.prev) : 'Zabilježeno: ostaje ' + doseBase(it) + ', probaj opet';
  const ok = (it.ok || 0) + 1;
  if (ok >= N) return c.next.item ? 'Spremno: prijedlog ' + c.next.text + ' čeka te na stranici Napredak' : c.next.text;
  return ok + '/' + N + ' · još ' + (N - ok) + ' ' + plural(N - ok, 'ovakav trening', 'ovakva treninga', 'ovakvih treninga');
}
/* ---------- the Progress tab ---------- */
function progSuggestions(){
  const N = progN(), out = [];
  Object.values(S.pr).forEach(p => { if (p.program) return; (p.items || []).forEach((it, j) => {
    const e = S.ex[it.exId]; if (!e) return;
    if (!(it.kg > 0) && it.measure !== 'time' && needsKg(e)) { if ((it.ok || 0) + (it.fail || 0) > 0) out.push({ kind:'nokg', p, j, e, it }); return; }
    if (it.prev && (it.fail || 0) >= 2) out.push({ kind:'revert', p, j, e, it });
    else if ((it.ok || 0) >= N && (it.ok || 0) > (it.snoozeOk || 0)) {
      const nd = nextDose(e, it);
      if (!nd.item && (it.snoozeOk || 0) > 0) return;   // a harder variation you already acknowledged stays quiet until the dose changes or a session fails
      out.push({ kind: nd.item ? 'up' : 'variant', p, j, e, it, nd });
    }
    else if ((it.ok || 0) > 0 && (it.ok || 0) < N) out.push({ kind:'way', p, j, e, it });
  }); });
  return out;
}
const e1rm = (kg, reps) => kg * (1 + reps / 30);   // Epley estimate of the one-rep max
function progHistory(){
  const by = {};
  S.log.slice().reverse().forEach(l => (l.items || []).forEach(x => { if (x.skipped) return; (by[x.exId] = by[x.exId] || []).push(Object.assign({ at: l.at }, x)); }));
  return by; // oldest first per exercise (exercises skipped in a session are not part of its history)
}
function sugCard(x){
  const pr = esc(x.p.id), j = x.j;
  if (x.kind === 'revert') { const a = x.it.prev || {}, what = (a.kg || 0) !== (x.it.kg || 0) ? 'ovu težinu' : (a.sec || 0) !== (x.it.sec || 0) ? 'dulje trajanje' : (a.sets || 1) !== (x.it.sets || 1) ? 'seriju više' : 'više ponavljanja';
    return '<div class="lift warn"><div class="top"><b>'+esc(x.e.name)+'</b><span>'+nwNum(dose(x.it))+'</span></div><div class="why">Dvaput zaredom '+(x.it.measure === 'time' ? 'nisi izdržao zadano trajanje' : 'nisi napravio sva zadana ponavljanja')+' (označio si „Nisam uspio”). Prerano je za '+what+'.</div><div class="acts"><button class="bt amber" data-a="sugRevert" data-p="'+pr+'" data-j="'+j+'">Vrati na '+nwNum(doseBase(x.it.prev))+'</button><button class="bt ghost" data-a="sugRetry" data-p="'+pr+'" data-j="'+j+'">Probat ću opet</button></div><div class="pfrom">'+esc(x.p.name)+'</div></div>'; }
  if (x.kind === 'variant') return '<div class="lift go"><div class="top"><b>'+esc(x.e.name)+'</b><span>'+nwNum(dose(x.it))+'</span></div><div class="why">'+esc(x.nd.text)+'.</div><div class="acts"><button class="bt ghost" data-a="sugLater" data-p="'+pr+'" data-j="'+j+'">U redu</button></div><div class="pfrom">'+esc(x.p.name)+'</div></div>';
  if (x.kind === 'up') return '<div class="lift go"><div class="top"><b>'+esc(x.e.name)+'</b><span>'+nwNum(dose(x.it))+'</span></div><div class="why">'+progN()+' treninga zaredom sa svim serijama. Prijedlog: '+esc(x.nd.text)+'.</div><div class="acts"><button class="bt" data-a="sugUp" data-p="'+pr+'" data-j="'+j+'">Prihvati: '+nwNum(doseBase(x.nd.item))+'</button><button class="bt ghost" data-a="sugLater" data-p="'+pr+'" data-j="'+j+'">Još ne</button></div><div class="pfrom">'+esc(x.p.name)+'</div></div>';
  const N = progN(), ok = x.it.ok || 0;
  return '<div class="lift"><div class="top"><b>'+esc(x.e.name)+'</b><span>'+nwNum(dose(x.it))+'</span></div><div class="pips">'+Array.from({ length: N }, (_, k) => '<i class="pip'+(k < ok ? ' on' : '')+'"></i>').join('')+'<span>'+ok+'/'+N+' · '+esc(x.p.name)+'</span></div></div>';
}
/* ---------- dosing: goal of the period, football week, your loads ---------- */
// rir: reps kept in reserve (Eksplozivnost = 3 fast reps with the load you could lift 5 times); sx/rx: sets and rest as shown
const GOALS = {
  snaga:         { name:'Snaga',         reps:[4, 6],   target:5,  sets:4, rest:150, sx:'3–5 serija', rx:'odmor 2–3 min' },
  hipertrofija:  { name:'Hipertrofija',  reps:[8, 12],  target:10, sets:3, rest:90,  sx:'3–4 serije', rx:'odmor 60–90 s' },
  izdrzljivost:  { name:'Izdržljivost',  reps:[12, 15], target:12, sets:3, rest:45,  sx:'2–3 serije', rx:'odmor 30–60 s' },
  eksplozivnost: { name:'Eksplozivnost', reps:[3, 5],   target:3,  sets:4, rest:180, rir:2, sx:'4 serije', rx:'odmor 3 min' }
};
const DAYS_IN = ['u ponedjeljak','u utorak','u srijedu','u četvrtak','u petak','u subotu','u nedjelju'];
const pctFor = r => 1 / (1 + r / 30);               // share of the max you can lift r times (inverse Epley)
// the goal in words, with the share of your estimated max the app actually uses
function goalDesc(k){
  const G = GOALS[k], pc = r => Math.round(pctFor(r) * 100);
  return [G.reps[0] + '–' + G.reps[1] + (G.rir ? ' brzih pon.' : ' pon.'), (G.rir ? '≈ ' + pc(G.target + G.rir) : pc(G.reps[1]) + '–' + pc(G.reps[0])) + ' % maksimuma', G.sx, G.rx];
}
// a goal text part as HTML: numbers keep their range and unit on one line ("2–3 serije", "30–60 s")
const nwNum = t => esc(t).replace(/(≈ )?\d+(?:,\d+)?(?:–\d+(?:,\d+)?)?(?: (?:brzih pon\.|pon\.|serija|serije|min|kg|%|s)(?![A-Za-zčćžšđČĆŽŠĐ]))?/g, m => '<span style="white-space:nowrap">' + m + '</span>');
// best estimated max from sets you actually did in the last 8 weeks; a set of more than 10 reps counts as 10 (Epley gets unreliable there); jumps and throws don't count
function bestE1(exId){
  const ex = S.ex[exId]; if (ex && ex.cat === 'Eksplozivnost') return 0;
  let best = 0; const since = Date.now() - 56 * DAY_MS;
  S.log.forEach(l => { if (l.at < since) return; (l.items || []).forEach(x => {
    if (x.exId !== exId || !(x.kg > 0) || x.measure === 'time' || x.skipped) return;
    const list = Array.isArray(x.repsList) ? x.repsList.map(Number).filter(v => v > 0) : [];
    const reps = x.done === false ? (x.lastReps || 0) : list.length ? Math.max.apply(null, list) : (x.reps || 0);
    if (reps > 0) best = Math.max(best, e1rm(x.kg, Math.min(reps, 10)));
  }); });
  return best;
}
// load and reps for a goal, chosen together: the load for the bottom of the goal's range (Eksplozivnost: the load for 5), reps as many as it allows up to the target
function goalDose(e, e1, G){
  const need = G.rir ? G.target + G.rir : G.reps[0], kg = loadFor(e, e1, need), f = Math.floor(30 * (e1 / kg - 1) + 1e-6);
  return { kg, reps: G.rir ? (f >= need ? G.target : Math.max(1, f - G.rir)) : Math.max(1, Math.min(G.target, f)) };
}
// the goal card belongs on gym sessions only: tag Teretana (or your own untagged protocol) with mostly strength exercises
function gymProto(p){
  const items = p.items || [], sn = items.filter(it => (S.ex[it.exId] || {}).cat === 'Snaga').length;
  return !p.program && (p.tag === 'Teretana' || (!p.tag && !p.home)) && sn > 0 && sn * 2 >= items.length;
}
// what a goal would change in a protocol: strength exercises with a load (Eksplozivnost: only the main lifts with the bar)
function goalPlan(p, g){
  const G = GOALS[g], items = clone(p.items || []), changes = [];
  if (!G || !gymProto(p)) return { items, changes };
  items.forEach((it, j) => {
    const e = S.ex[it.exId], k = e ? loadKind(e) : '';
    if (!e || it.measure === 'time' || !k || k === 'kb' || e.cat !== 'Snaga' || (G.rir && k === 'db')) return;
    const before = doseBase(it), be = bestE1(e.id), e1 = be || (it.kg > 0 ? e1rm(it.kg, Math.min(it.reps || 10, 10)) : 0);
    it.reps = G.target; it.r0 = G.reps[0]; it.r1 = G.reps[1]; it.sets = G.sets; delete it.repsList;
    const linked = j < items.length - 1 && it.ss && items[j + 1].ss === it.ss;
    it.rest = linked ? 0 : G.rest;
    if (e1 > 0) { const d = goalDose(e, e1, G); it.kg = d.kg; it.reps = d.reps; }
    if (doseBase(it) !== before) { it.ok = 0; it.fail = 0; it.snoozeOk = 0; delete it.prev; delete it.up; }
    const rest0 = p.items[j].rest || 0;
    if (doseBase(it) !== before || it.rest !== rest0) changes.push({ e, from: before, to: doseBase(it), rest: it.rest !== rest0 ? [rest0, it.rest] : null, est: !(e1 > 0), fromItem: !(be > 0) && e1 > 0 });
  });
  return { items, changes };
}
// programme sessions keep their reps; only the kilograms are filled from your loads
function kgPlan(p){
  const items = clone(p.items || []), changes = [];
  items.forEach(it => { const e = S.ex[it.exId]; if (!e || it.measure === 'time' || !loaded(e) || e.cat === 'Eksplozivnost') return; const e1 = bestE1(e.id); if (!(e1 > 0)) return;
    const reps = Math.max.apply(null, (it.repsList || [it.reps || 10])); const kg = loadFor(e, e1, reps);
    if (kg !== it.kg) { changes.push({ e, from: doseBase(it), to: doseBase(Object.assign({}, it, { kg })) }); it.kg = kg; it.ok = 0; it.fail = 0; it.snoozeOk = 0; delete it.prev; delete it.up; } });
  return { items, changes };
}
// what "Ne" on the kilogram card remembers: the card comes back only when the suggested loads change
const kgSig = k => k.changes.map(c => c.e.id + ':' + c.to).join('|');
// football week settings, read defensively (they can come from an older or imported settings file)
const ballN = () => { const v = S.settings.ballN; return v != null && v !== '' && isFinite(v) ? Math.max(0, Math.min(7, Math.round(+v))) : 3; };
const matchDay = () => { const v = S.settings.matchDay; return v != null && v !== '' && isFinite(v) && +v >= 0 && +v <= 6 ? Math.round(+v) : -1; };
function weekAdvice(){
  const b = ballN(), m = matchDay(), wm = weekMatches(weekStart(Date.now()));
  const dn = i => DAYS_IN[(i + 7) % 7];
  const tw = wm.length >= 2 ? ' Ovaj tjedan imaš ' + nMatches(wm.length) + ' (' + daysList(wm) + '): između njih bez teških nogu, a na terenu samo lagani trening.'
    : wm.length && wm[0] !== m ? ' Ovaj tjedan imaš utakmicu ' + dn(wm[0]) + ': teške noge najkasnije 4 dana prije nje, dan prije samo aktivacija.' : '';
  if (m < 0) { const n = b <= 2 ? 3 : b <= 4 ? 2 : 1; return 'Bez utakmice (pripreme ili pauza): ' + n + ' ' + plural(n, 'trening', 'treninga', 'treninga') + ' u teretani tjedno' + (n > 1 ? ', s barem jednim danom između.' : '.') + tw; }
  const n = b >= 4 ? 1 : 2;
  return 'Preporuka: ' + n + ' ' + plural(n, 'trening', 'treninga', 'treninga') + ' u teretani. ' + (n === 2 ? 'Teži najkasnije ' + dn(m - 4) + ' (4 dana prije utakmice), lakši s eksplozivnošću ' + dn(m - 2) : 'Odradi ga najkasnije ' + dn(m - 4) + ' (4 dana prije utakmice)') +
    '. Dan prije utakmice (' + DAYNAMES[(m + 6) % 7] + ') bez teških nogu, samo aktivacija; dan poslije (' + DAYNAMES[(m + 1) % 7] + ') mobilnost i oporavak. U sezoni je jedan trening u teretani tjedno dovoljan da zadržiš snagu i brzinu.' + tw;
}
// Doziranje: dates marked as a match (or a standing match day without one) from today on, and a new date
function matchDatesHtml(){
  const md = matchDates(), today = dateKey(Date.now());
  const ks = Object.keys(md).filter(k => k >= today && /^\d{4}-\d\d-\d\d$/.test(k)).sort();
  const when = k => { const t = new Date(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8, 10)).getTime(); return DAYNAMES[dayIdx(t)].slice(0, 3) + ' ' + shortDate(t); };
  return '<span class="label" style="display:block;padding:12px 0 8px">Dodatne utakmice</span>' +
    (ks.length ? '<div class="chips wrap" style="margin-bottom:10px">' + ks.map(k => { const tx = (md[k] === 1 ? 'Utakmica ' : 'Bez utakmice ') + when(k);
      return '<button class="chip" data-a="matchDel" data-k="' + esc(k) + '" aria-label="' + esc('Ukloni: ' + tx) + '">' + esc(tx) + ' ✕</button>'; }).join('') + '</div>' : '') +
    '<div class="madd"><input id="matchadd" class="input" type="date" min="' + today + '" aria-label="Datum dodatne utakmice"><button class="chip" data-a="matchAdd">Dodaj</button></div>' +
    '<p class="sub" style="margin:8px 2px 0;font-size:13px;line-height:19px">Utakmicu u ovom tjednu označiš i dodirom na dan na početnom zaslonu.</p>';
}
function dosingHtml(){
  const g = GOALS[S.settings.goal] ? S.settings.goal : null, b = ballN(), m = matchDay(), pk = plateKg();
  const lifts = Object.values(S.ex).filter(e => loaded(e) && loadKind(e) !== 'kb').map(e => ({ e, v: bestE1(e.id) })).filter(x => x.v > 0).sort((a, b2) => b2.v - a.v).slice(0, 8);
  const kgs = v => String(v).replace('.', ','), nbk = v => fmtKg(v).replace(' ', '&nbsp;');
  const rng = (e, v, k) => { const G = GOALS[k];
    if (G.rir) return e.cat === 'Snaga' && loadKind(e) !== 'db' ? kgs(goalDose(e, v, G).kg) : '—';
    const lo = loadFor(e, v, G.reps[1]), hi = loadFor(e, v, G.reps[0]); return lo === hi ? kgs(lo) : kgs(lo) + '–' + kgs(hi); };
  return '<div class="psec"><h2>Cilj ovog razdoblja</h2><span>za vježbe s opterećenjem</span></div><div class="goal">' +
    Object.keys(GOALS).map(k => '<button class="'+(g === k ? 'on' : '')+'" data-a="setGoal" data-v="'+k+'" aria-pressed="'+(g === k)+'"><b>'+GOALS[k].name+'</b><span>'+goalDesc(k).map(nwNum).join(' · ')+'</span></button>').join('') + '</div>' +
    (g ? '<p class="sub" style="margin:10px 17px 0;line-height:19px">Otvori protokol za teretanu (npr. Trening A): dobit ćeš prijedlog serija, ponavljanja, odmora i kilograma za cilj „'+esc(GOALS[g].name)+'”. Ništa se ne mijenja dok prijedlog ne potvrdiš.'+(GOALS[g].rir ? ' Mijenjaju se samo glavne vježbe sa šipkom i landmine; bučice, girja i skokovi ostaju kako jesu.' : '')+'</p>' : '') +
    '<div class="psec"><h2>Nogometni tjedan</h2><span>tvoj uobičajeni tjedan</span></div><div class="chart">' +
      '<div class="prow" style="border:0;min-height:52px"><span class="k">Treninzi s loptom</span><div class="step"><button class="sbtn" data-a="setBall" data-d="-1" aria-label="Treninzi s loptom: smanji">−</button><b>'+b+'</b><button class="sbtn" data-a="setBall" data-d="1" aria-label="Treninzi s loptom: povećaj">+</button></div></div>' +
      // "Nema utakmice" sits beside the label, so the seven day buttons share the whole row (44 px tall, about 40 px wide)
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin:4px 0 8px"><span class="label" style="padding:0">Utakmica</span><button class="chip" data-a="setMatch" data-v="-1" aria-pressed="'+(m < 0)+'">Nema utakmice</button></div><div class="drow" role="group" aria-label="Dan utakmice">' + DAYS.map((L, i) => '<button class="dchip" data-a="setMatch" data-v="'+i+'" aria-pressed="'+(m === i)+'" aria-label="'+DAYNAMES[i]+'">'+L+'</button>').join('') + '</div>' +
      matchDatesHtml() +
      '<div class="advice">'+esc(weekAdvice())+'</div></div>' +
    '<div class="psec"><h2>Teren</h2><span>za treninge na terenu</span></div><div class="chart">' +
      '<div class="prow" style="border:0;min-height:52px"><label class="k" for="topkmh" style="display:flex;align-items:center;min-height:44px">Najveća brzina (km/h)</label><input id="topkmh" class="input tkm" type="text" inputmode="decimal" enterkeyhint="done" autocomplete="off" value="' + kmhTxt(topKmh()) + '" placeholder="28,8"></div>' +
      '<p class="sub" style="margin:4px 0 0;font-size:13px;line-height:19px">Postotak brzine u treninzima na terenu (npr. 90&nbsp;% brzine) računa se od nje. Zadano 28,8&nbsp;km/h (8&nbsp;m/s); upiši svoju najveću brzinu iz STATSportsa, od 20 do 40&nbsp;km/h.</p></div>' +
    '<div class="psec"><h2>Moje težine</h2><span>kg, iz serija zadnjih 8 tjedana</span></div>' +
    (lifts.length ? '<div class="chart" style="padding-top:8px;padding-bottom:4px;overflow-x:auto"><table class="kg"><tr><th>Vježba</th>' + ['Snaga', 'Hipertr.', 'Izdrž.', 'Ekspl.'].map(t => '<th style="padding-left:8px">' + t + '</th>').join('') + '</tr>' +
      lifts.map(x => '<tr><td><b>'+esc(x.e.name)+'</b><span>max ≈ '+esc(fmtKg(Math.round(x.v * 2) / 2))+(loadKind(x.e) === 'db' ? ' po bučici' : '')+'</span></td>' + Object.keys(GOALS).map(k => '<td class="'+(g === k ? 'on' : '')+'">'+rng(x.e, x.v, k)+'</td>').join('') + '</tr>').join('') + '</table></div>'
      : '<p class="sub" style="margin:0 17px;line-height:20px">Kad odradiš trening s upisanim kilogramima, ovdje se iz tvojih serija procijeni maksimum i kilogrami za svaki cilj.</p>') +
    '<span class="label" style="display:block;padding:14px 2px 8px 17px">Najmanje ploče na šipki</span><div class="chips" style="margin-top:0">' + PLATES.map(v => '<button class="chip" data-a="setPlate" data-v="'+v+'" aria-pressed="'+(pk === v)+'">'+fmtKg(v)+'</button>').join('') + '</div>' +
    '<p class="sub" style="margin:12px 17px 0;line-height:19px">Postotak je udio tvog procijenjenog maksimuma, težine koju možeš podići jednom. Maksimum se procjenjuje Epleyjevom formulom iz tvojih serija: serija s više od 10&nbsp;ponavljanja računa se kao 10, a skokovi se ne računaju. Kilogrami se zaokružuju na ono što možeš složiti – šipka: 20&nbsp;kg i parovi ploča od '+nbk(pk)+' (korak najmanje '+nbk(2 * pk)+'); landmine: ploče na slobodnom kraju šipke; bučice: tvoji parovi, kg po bučici; girja: 20&nbsp;kg. Ekspl.: 3&nbsp;brza ponavljanja s težinom za 5, za vježbe snage sa šipkom i landmine (bučice, girja i skokovi ne).</p>';
}
// what a chart draws for one exercise (h oldest first; the last n points): with kilograms only the sessions that had them
// (the shipped 0 kg or a first try would read as progress); while the load stays the same, the reps you did, so reps
// added at one load show too
function liftSeries(h, n){
  const time = !!h.length && h[h.length - 1].measure === 'time';
  let pts = h.filter(x => (x.measure === 'time') === time);
  if (!time && pts.some(x => x.kg > 0)) pts = pts.filter(x => x.kg > 0);
  if (n) pts = pts.slice(-n);
  const kg = !time && pts.some(x => x.kg !== pts[0].kg);
  return { pts, unit: time ? ' s' : kg ? ' kg' : ' pon.', loaded: pts.some(x => x.kg > 0), val: x => time ? (x.sec || 0) : kg ? x.kg : repsDone(x) };
}
// reps of the best set of a logged exercise with a load, counted the way Doziranje does (bestE1): the failed last set as you
// entered it; 0 for timed work, sets without kilograms and skipped exercises
function liftReps(x){
  if (!(x.kg > 0) || x.measure === 'time' || x.skipped) return 0;
  const list = Array.isArray(x.repsList) ? x.repsList.map(Number).filter(v => v > 0) : [];
  return x.done === false ? (x.lastReps || 0) : list.length ? Math.max.apply(null, list) : (x.reps || 0);
}
/* ---------- training load ("Opterećenje"): strength volume, field metres, the season dose ---------- */
// Strength, per logged item, from what was really done (repsDone: sets done, per-set reps, the failed last set; skipped = 0):
// with kilograms the volume load = reps × kg (kg as entered: a dumbbell exercise counts one dumbbell, "po bučici"); without
// kilograms the reps; timed work the seconds held. "Po strani" counts both sides. An own running drill (Kondicija with a
// distance per rep) also gives metres in its intensity zone, so it counts in the field load.
const LOAD_MAS = 4.5, LOAD_HSR = 5.5, LOAD_SPR = 7, TOP_KMH = 28.8;
// your top speed (Doziranje → Najveća brzina, km/h; 28,8 km/h = 8 m/s while none is set): "% brzine / % napora" is taken of it
const topKmh = () => { const v = S.settings.topKmh; return typeof v === 'number' && v >= 20 && v <= 40 ? v : TOP_KMH; };
const kmhTxt = v => String(Math.round(v * 10) / 10).replace('.', ',');
const RUN_INT = ['lagano', 'umjereno', 'visoko', 'sprint'], ZONE_NAMES = ['Lagano', 'Umjereno', 'Visoko', 'Sprint'];
const INT4 = ['nizak', 'umjeren', 'visok', 'maksimalan'];
const runDrill = e => !!e && e.cat === 'Kondicija' && +e.runM > 0;
const seedEx = id => !!(window.SEED && SEED.exercises && SEED.exercises[id]);
// the editor says how the exercise's load will be counted (from its equipment and its measure)
function editLoadText(d){
  if (d.measure === 'time') return 'Opterećenje: ukupno vrijeme' + (d.sides ? ' (obje strane)' : '') + '.';
  const k = kgKind(d);
  return k ? 'Opterećenje: volumen tereta, ponavljanja × kg' + (k === 'db' ? ' jedne bučice' : '') + (d.sides ? ', obje strane' : '') + '.' : 'Opterećenje: ukupna ponavljanja' + (d.sides ? ' (obje strane)' : '') + '.';
}
const zeroLoad = () => ({ m: 0, hsr: 0, spr: 0, z: [0, 0, 0, 0], t: 0 });
function addLoad(a, b, k){ k = k == null ? 1 : k; a.m += b.m * k; a.hsr += b.hsr * k; a.spr += b.spr * k; a.t += (b.t || 0) * k; for (let i = 0; i < 4; i++) a.z[i] += b.z[i] * k; return a; }
function itemLoad(x){
  const o = { kg: 0, reps: 0, secs: 0, m: 0, hsr: 0, spr: 0, z: [0, 0, 0, 0] };
  if (!x || x.skipped) return o;
  const sd = x.sides ? 2 : 1, n = x.setsDone != null ? x.setsDone : (x.sets || 1), e = S.ex[x.exId];
  if (x.measure === 'time') o.secs = n * (x.sec || 0) * sd;
  else { o.reps = repsDone(x) * sd; if (x.kg > 0) o.kg = o.reps * x.kg; }
  if (runDrill(e)) {
    const zi = Math.max(0, RUN_INT.indexOf(e.runInt));
    o.m = (x.measure === 'time' ? n : repsDone(x)) * sd * e.runM; o.z[zi] = o.m;
    if (zi >= 2) o.hsr = o.m; if (zi === 3) o.spr = o.m;   // visoko and sprint count as fast running (brzo trčanje)
  }
  return o;
}
// one exercise over time (oldest first), one point per session: the volume load when sessions in the range had kilograms (the
// 0 kg ones are left out of that chart), otherwise reps or seconds; metres for an own running drill
function exLoadSeries(exId, days){
  const e = S.ex[exId], from = days ? calDay(Date.now(), -days) : 0;
  const h = historyOf(exId).filter(x => x.at >= from).reverse();
  if (!h.length) return null;
  const time = h[h.length - 1].measure === 'time';
  let pts = h.filter(x => (x.measure === 'time') === time);
  const kind = runDrill(e) ? 'm' : time ? 'secs' : pts.some(x => x.kg > 0) ? 'kg' : 'reps';
  if (kind === 'kg') pts = pts.filter(x => x.kg > 0);
  const out = [];
  pts.forEach(x => { const v = itemLoad(x)[kind], last = out[out.length - 1];
    if (last && last.t === x.at) { last.v += v; last.xs.push(x); } else out.push({ t: x.at, v, xs: [x] }); });
  return { kind, pts: out };
}
const thou = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const dec1 = v => String(Math.round(v * 10) / 10).replace('.', ',');
function loadFmt(kind, v){
  if (kind === 'kg') return thou(v) + ' kg';
  if (kind === 'vl') return v >= 1000 ? dec1(v / 1000) + ' t' : thou(v) + ' kg';   // a week of lifting: tonnes from 1 t
  if (kind === 'm') return v >= 1000 ? dec1(v / 1000) + ' km' : thou(v) + ' m';
  if (kind === 'secs') { v = Math.round(v); return v < 120 ? v + ' s' : Math.floor(v / 60) + ' min' + (v % 60 ? ' ' + (v % 60) + ' s' : ''); }
  return thou(v) + ' ' + plural(Math.round(v), 'ponavljanje', 'ponavljanja', 'ponavljanja');
}
// the line under a chart: the direction of the last sessions (a change within 1 % is "the same")
function loadTrend(pts){
  const n = pts.length; if (n < 2) return null;
  const d = (a, b) => b.v > a.v * 1.01 ? 1 : b.v < a.v * .99 ? -1 : 0, dir = d(pts[n - 2], pts[n - 1]);
  let k = 1; while (n - 2 - k >= 0 && d(pts[n - 2 - k], pts[n - 1 - k]) === dir) k++;
  const tr = (k > 1 ? ' ' + k + ' ' + plural(k, 'trening', 'treninga', 'treninga') + ' zaredom' : ' od prošlog treninga');
  if (dir > 0) return { dir, k, text: 'Raste' + tr };
  if (dir < 0) return { dir, k, text: 'Pada' + tr };
  const wk = (pts[n - 1].t - pts[n - 1 - k].t) / WEEK_MS;
  return { dir, k, text: wk >= 2 ? 'Stoji više od 2 tjedna: vrijeme je za promjenu' : k > 1 ? 'Stoji ' + k + ' ' + plural(k, 'trening', 'treninga', 'treninga') : 'Isto kao prošli trening' };
}

/* Field sessions: metres per rep of a block from its distance, its speed or the session text, with your MAS (the last MAS test;
   4,5 m/s while there is none, and the page says so). Brzo trčanje ≥ 5,5 m/s (19,8 km/h), sprint ≥ 7 m/s (25,2 km/h); zones:
   lagano < 70 % MAS, umjereno 70–90 %, visoko 90 % MAS – 7 m/s, sprint ≥ 7 m/s. A speed range spreads its metres evenly over the
   range. A maximal run (sprint, maksimalno, ≥ 95 % or ≥ 90 % effort) starts from a standstill: its first 10 m stay below
   5,5 m/s and its first 20 m below 7 m/s (with a top speed under 25,2 km/h it never reaches sprint). % of speed or effort is
   taken of your top speed (Doziranje, 28,8 km/h = 8 m/s while none is set). Walking rests are not
   counted; recovery runs given as % MAS are. Blocks with neither a distance nor one speed use the estimates in FIELD_EST. */
const loadMas = () => masNow() || LOAD_MAS;
// m metres at a steady speed anywhere in [lo, hi] m/s
function runSeg(m, lo, hi, mas){
  hi = hi == null ? lo : hi;
  const up = x => hi > lo ? Math.min(1, Math.max(0, (hi - x) / (hi - lo))) : lo >= x ? 1 : 0;
  const b1 = .7 * mas, b2 = Math.min(.9 * mas, LOAD_SPR), sp = up(LOAD_SPR);
  return { m, hsr: m * up(LOAD_HSR), spr: m * sp, z: [m * (1 - up(b1)), m * (up(b1) - up(b2)), m * (up(b2) - sp), m * sp], t: m / ((lo + hi) / 2 || 1) };
}
// a maximal run of m metres from a standstill (roll: out of a jog, 5 m sooner)
function maxRun(m, roll){
  const h = Math.max(0, m - (roll ? 5 : 10)), s = topKmh() / 3.6 >= LOAD_SPR ? Math.max(0, m - (roll ? 15 : 20)) : 0;
  return { m, hsr: h, spr: s, z: [0, 0, m - s, s], t: 1 + m / 7 };
}
// legs: [metres, how]: max = maximal from a standstill, acc = maximal out of a jog, hod 1,5 m/s, jog 60 % MAS, tempo 100 % MAS,
// cod = change of direction (3,5 m/s), drib = dribbling (3 m/s), back = backwards (2 m/s)
function legLoad(parts, mas){
  const o = zeroLoad(), V = { hod: 1.5, jog: .6 * mas, tempo: mas, cod: 3.5, drib: 3, back: 2 };
  parts.forEach(p => addLoad(o, p[1] === 'max' ? maxRun(p[0]) : p[1] === 'acc' ? maxRun(p[0], true) : runSeg(p[0], V[p[1]], null, mas)));
  return o;
}
// a continuous block: the cycle repeats for the block's work time
const cycLoad = (parts, secs, mas) => { const c = legLoad(parts, mas); return addLoad(zeroLoad(), c, c.t ? secs / c.t : 0); };
// shipped blocks that give neither a distance nor one speed: the estimate and the sentence the session page lists
const FIELD_EST = {
  'ss-pre-1b': [{ re: /./, cyc: [[52.5, 'jog'], [36, 'tempo'], [16.5, 'hod']], note: 'Run 1B: na svakoj duljini terena 52,5 m joga (60 % MAS), 36 m tempa (100 % MAS) i 16,5 m hoda, ponavlja se cijeli blok od 5 min.' }],
  'ss-pre-3a': [{ re: /./, legs: [[31, 'cod'], [20, 'drib'], [20, 'acc'], [60, 'jog'], [20, 'hod']], note: 'Run 3A: krug od 151 m = shuttle 31 m, dribling 20 m, sprint 20 m iz joga, jog 60 m i hod 20 m.' }],
  'ss-pre-3b': [{ re: /./, cyc: [[35, 'jog'], [17.5, 'acc'], [16.5, 'hod']], note: 'Run 3B: prijelaz od 68 m = jog 35 m, maksimalno ubrzanje 17,5 m iz joga i hod 16,5 m, ponavlja se 4 min.' }],
  'ss-pre-3d': [{ re: /./, cyc: [[35, 'jog'], [17.5, 'acc'], [16.5, 'hod'], [35, 'jog'], [32, 'cod'], [16.5, 'hod']], note: 'Run 3D: gore kao 3B; dolje jog 35 m, shuttle 32 m (čunjevi na 6,4 m) i hod 16,5 m, ponavlja se 4 min.' }],
  'mendo-solo-ubrzanje': [
    { re: /promjenom smjera/i, legs: [[27, 'max'], [27, 'max']], note: 'Sprint s promjenom smjera: 2 × 27 m, svaki kreće iz okreta.' },
    { re: /shuttle/i, legs: [[60, 'cod'], [16.5, 'max']], note: 'Shuttle s loptom: 60 m između čunjeva (5, 10 i 15 m) i sprint od 16,5 m.' },
    { re: /kočenje/i, legs: [[18, 'max'], [18, 'cod'], [18, 'cod'], [36, 'max']], note: 'Sprint i kočenje: oko 90 m (sprint 18 m, kočenje i krug 36 m, sprint natrag 36 m).' },
    { re: /unatrag/i, legs: [[16.5, 'max'], [6, 'back'], [20, 'max']], note: 'Sprint, unatrag, ubrzanje: 16,5 m sprinta, 6 m unatrag i 20 m ubrzanja.' },
    { re: /cik-cak/i, legs: [[30, 'cod']], note: 'Cik-cak: 6 čunjeva na 5 m, oko 30 m bez brzog trčanja.' }]
};
// a distance in the block's text: "3 duljine od 72 m", "(oko 83 m)"
function cueDist(c){
  c = c || ''; let m = /(\d+)\s+duljin\w*\s+od\s+(\d+(?:,\d+)?)\s*m\b/.exec(c);
  if (m) return +m[1] * +m[2].replace(',', '.');
  m = /\((?:oko |otprilike )?(\d+(?:,\d+)?)\s*m\)/.exec(c); return m ? +m[1].replace(',', '.') : 0;
}
// one rep of a block (its recovery run apart); notes collects what had to be assumed
function blockRep(b, f, mas, notes){
  const say = s => { if (notes && notes.indexOf(s) === -1) notes.push(s); };
  const est = (FIELD_EST[f && f.id] || []).find(x => x.re.test(b.label_hr || ''));
  if (est) { say(est.note); const o = est.cyc ? cycLoad(est.cyc, b.work_s || 0, mas) : legLoad(est.legs, mas); o.t = b.work_s || o.t; return o; }
  const tx = b.intensity_hr || '', work = b.work_s || 0, num = s => +String(s).replace(',', '.'), vk = topKmh(), vx = vk / 3.6;
  const lab = '„' + (b.label_hr || '').replace(/^(?:S\d+(?:\/\d+)?|Krug \d+\/\d+|Runda \d+)\s*·\s*(?:P?\d+\/\d+\s*·\s*)?/, '') + '”';   // one note for the same block in every set
  const ms = /(\d+(?:,\d+)?)(?:\s*[–-]\s*(\d+(?:,\d+)?))?\s*m\/s/.exec(tx), ef = /(\d+)(?:\s*[–-]\s*(\d+))?\s*%\s*(?:brzine|napora)/.exec(tx);
  const efLo = ef ? +ef[1] : 0, efHi = ef ? +(ef[2] || ef[1]) : 0;
  const maxW = !/tempo/i.test(tx) && /maksimal|sprint|≥\s*9[5-9]|punom snagom/i.test(tx);
  let d = b.distance_m || (ms || b.mas_pct ? 0 : cueDist(b.cue_hr)), o;
  if (d && !b.distance_m) say(lab + ': ' + String(Math.round(d * 10) / 10).replace('.', ',') + ' m prema opisu.');
  if (maxW || efLo >= 90) {
    say(vx >= LOAD_SPR ? 'Maksimalni sprint kreće iz mjesta: prvih 10 m je ispod brzog trčanja, prvih 20 m ispod sprinta.' : 'Maksimalni sprint kreće iz mjesta: prvih 10 m je ispod brzog trčanja; s najvećom brzinom ispod 25,2 km/h nema metara sprinta.');
    if (!d) { d = (ef ? (efLo + efHi) / 200 : 1) * vx * work; say(lab + ': ' + work + ' s na ' + (ef ? efLo + ' %' : 'maksimalnoj brzini') + ' od ' + kmhTxt(vk) + ' km/h ≈ ' + Math.round(d) + ' m.'); }
    o = maxRun(d);
  } else {
    let lo = 0, hi = 0;
    if (ms) { lo = num(ms[1]); hi = num(ms[2] || ms[1]); }
    else if (b.mas_pct) lo = hi = mas * b.mas_pct / 100;
    else if (ef) { lo = efLo / 100 * vx; hi = efHi / 100 * vx; say(lab + ': ' + efLo + (efHi !== efLo ? '–' + efHi : '') + ' % od ' + kmhTxt(vk) + ' km/h (najveća brzina).'); }
    else if (d && work) lo = hi = d / work;
    else if (/maksimaln\w* tempo/i.test(tx)) { lo = hi = mas; say('MAS test: 5 min tvojim MAS-om.'); }
    else if (/\bhod/i.test(tx)) lo = hi = 1.5; else if (/jog|lagan/i.test(tx)) lo = hi = .6 * mas; else if (/tempo/i.test(tx)) lo = hi = mas;
    if (!hi) { say(lab + ': nema udaljenosti ni brzine, nije uračunato.'); return zeroLoad(); }
    if (!d) d = (lo + hi) / 2 * work;
    o = runSeg(d, lo, hi, mas);
  }
  o.t = work;
  return o;
}
const recRun = (b, mas) => { const v = mas * b.rest_mas_pct / 100, o = runSeg(v * b.rest_s, v, null, mas); o.t = 0; return o; };
// the season dose: about 2/3 of the sets (rounded down, at least 1), with a single set 2/3 of the reps. Sets written out as
// blocks ("S1 ·", "Krug 2/6", "Runda 1") keep the first 2/3 of them.
const doseGroup = b => { const m = /^(?:S|Krug |Runda )(\d+)/.exec(b.label_hr || ''); return m ? +m[1] : 0; };
const twoThirds = n => Math.max(1, Math.floor(n * 2 / 3 + 1e-9));
function fieldDose(f){
  const bl = f.blocks || [], K = bl.length ? Math.max.apply(null, bl.map(doseGroup)) : 0, c = Object.assign({}, f);
  if (K >= 2 && bl.every(doseGroup)) {
    const keep = twoThirds(K), w = /^Krug/.test(bl[0].label_hr) ? ['kruga', 'krugova'] : /^Runda/.test(bl[0].label_hr) ? ['runde', 'runda'] : ['serije', 'serija'];
    c.blocks = bl.filter(b => doseGroup(b) <= keep).map(b => Object.assign({}, b));
    c.doseText = keep + ' od ' + K + ' ' + (K >= 5 ? w[1] : w[0]);
    return c;
  }
  c.blocks = bl.map(b => { const x = Object.assign({}, b); if ((x.sets || 1) > 1) x.sets = twoThirds(x.sets); else if ((x.reps || 1) > 1) x.reps = twoThirds(x.reps); return x; });
  const sets = bl.filter(b => (b.sets || 1) > 1), all = l => l.reduce((a, b) => a + (b.sets || 1) * (b.reps || 1), 0), N = all(bl);
  c.doseText = sets.length === bl.length && sets.every(b => b.sets === sets[0].sets) ? twoThirds(sets[0].sets) + ' od ' + sets[0].sets + ' ' + (sets[0].sets >= 5 ? 'serija' : 'serije')
    : N > 1 ? all(c.blocks) + ' od ' + N + ' ' + plural(N, 'ponavljanja', 'ponavljanja', 'ponavljanja') : 'cijeli trening';
  return c;
}
// a whole session (dose 'season' = the season dose): metres, fast running, sprint, work minutes, metres per zone and the tags
function fieldLoad(f, dose, mas){
  mas = mas || loadMas();
  const g = dose === 'season' ? fieldDose(f) : f, o = zeroLoad(), notes = [];
  let reps = 0, maxM = 0, codM = 0;
  (g.blocks || []).forEach(b => {
    const n = (b.sets || 1) * (b.reps || 1), r = blockRep(b, f, mas, notes);
    addLoad(o, r, n); reps += n;
    if (/sprint|maksimal|≥\s*9[5-9]|9\d\s*%\s*napora|100\s*%\s*napora|reakcij/i.test((b.intensity_hr || '') + ' ' + (b.label_hr || '')) && !/tempo|interval/i.test(b.intensity_hr || '')) maxM += r.m * n;
    if (/slalom|cik-cak|kočenj|promjen\w* smjer|unatrag|shuttle sprint/i.test(b.label_hr || '')) codM += r.m * n;
    if (b.rest_mas_pct && b.rest_s) addLoad(o, recRun(b, mas), n);
  });
  const m = o.m || 1, bout = reps ? o.t / reps : 0;
  const type = /test/i.test(f.name_hr || '') ? 'test' : codM >= .4 * m ? 'agilnost' : bout <= 12 && maxM >= .4 * m ? 'brzina' : bout >= 120 && o.hsr < .05 * m ? 'aerobno' : 'intervali';
  let li = o.spr >= .25 * m ? 3 : o.hsr >= .25 * m || o.spr >= .1 * m ? 2 : o.hsr >= .05 * m || o.z[2] + o.z[3] >= .5 * m ? 1 : 0;
  if (type === 'test') li = Math.max(li, 2);
  return { m: Math.round(o.m), hsr: Math.round(o.hsr), spr: Math.round(o.spr), min: Math.round(o.t / 6) / 10, zones: o.z.map(Math.round), type, int: INT4[li], li,
    vol: o.m < 1500 ? 'nizak' : o.m <= 3000 ? 'srednji' : 'visok', notes, mas, def: !masNow(), doseText: g.doseText || '' };
}
const fieldInt = f => f ? fieldLoad(f).li : 0;
// what a field session in the history did: its stored load, else (an entry from before 1.6) the full session with today's MAS
function fieldLogLoad(l){
  if (l.load && typeof l.load.m === 'number') return l.load;
  const f = S.field[l.refId]; return f ? fieldLoad(f) : null;
}
// the work done in the player: every work step that was done, with its recovery run
function fieldDoneLoad(){
  const f = P.f, mas = loadMas(), o = zeroLoad();
  P.steps.forEach((st, i) => { if (st.kind !== 'work' || !P.doneSteps[i] || !st.b) return; addLoad(o, blockRep(st.b, f, mas)); if (st.b.rest_mas_pct && st.b.rest_s) addLoad(o, recRun(st.b, mas)); });
  return { m: Math.round(o.m), hsr: Math.round(o.hsr), spr: Math.round(o.spr), min: Math.round(o.t / 6) / 10, zones: o.z.map(Math.round), dose: P.dose === 'season' ? 'season' : 'full', mas: Math.round(mas * 100) / 100 };
}
// calendar weeks (a clock change never moves a session to another week), oldest first: trainings only (nTrainings' rule)
function weekLoads(n){
  const ws = weekStart(Date.now()), out = [];
  for (let k = n - 1; k >= 0; k--) { const a = calDay(ws, -7 * k); out.push({ ws: a, we: calDay(a, 7), vl: 0, m: 0, hsr: 0 }); }
  S.log.forEach(l => {
    if (!isTraining(l)) return; const w = out.find(o => l.at >= o.ws && l.at < o.we); if (!w) return;
    if (l.kind === 'field') { const fl = fieldLogLoad(l); if (fl) { w.m += fl.m; w.hsr += fl.hsr; } }
    (l.items || []).forEach(x => { const il = itemLoad(x); w.vl += il.kg; w.m += il.m; w.hsr += il.hsr; });
  });
  out.forEach(w => { w.ost = Math.max(0, w.m - w.hsr); });
  return out;
}

/* ---------- load charts: one line over time, weekly columns (marks per the approved design) ---------- */
// A tap on a column shows that point (crosshair, ringed dot, value first); it never gates: the summary (aria-label) and the
// "Tablica" view under every chart hold the same values. Colours live in style.css (.lch …), text uses the text tokens.
function niceStep(r){ const p = Math.pow(10, Math.floor(Math.log10(r || 1))), f = (r || 1) / p; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p; }
const dm = t => { const d = new Date(t); return d.getDate() + '. ' + (d.getMonth() + 1) + '.'; };
const tipW = (a, b) => Math.max(a.length * 7.6, b.length * 5.9) + 20;
function tipBox(x, y0, val, sub, maxX){
  const w = tipW(val, sub), bx = Math.max(0, Math.min(maxX - w, x - w / 2));
  return '<rect class="tb" x="'+bx.toFixed(1)+'" y="'+y0+'" width="'+w.toFixed(1)+'" height="38" rx="9"/><text class="tv" x="'+(bx + 10).toFixed(1)+'" y="'+(y0 + 17)+'">'+esc(val)+'</text><text class="ts" x="'+(bx + 10).toFixed(1)+'" y="'+(y0 + 31)+'">'+esc(sub)+'</text>';
}
function chartTable(head, rows){
  return '<details class="ltab"><summary>Tablica</summary><table><tr><th>'+esc(head[0])+'</th><th>'+esc(head[1])+'</th></tr>' + rows.map(r => '<tr><td>'+esc(r[0])+'</td><td>'+esc(r[1])+'</td></tr>').join('') + '</table></details>';
}
// pts: [{ t, v, sub }] oldest first; fmtV formats a value
function lineChart(id, pts, fmtV, label){
  const W = 326, R = 288, T = 26, B = 110, n = pts.length;
  const vs = pts.map(p => p.v), mx = Math.max.apply(null, vs), mn = Math.min.apply(null, vs);
  const st = niceStep((mx - mn) / 3 || mx / 2 || 1); let lo = Math.floor(mn / st) * st, hi = Math.ceil(mx / st) * st;
  if (hi === lo) { lo = Math.max(0, lo - st); hi += st; }
  const t0 = pts[0].t, t1 = pts[n - 1].t, X = t => t1 > t0 ? 6 + (t - t0) / (t1 - t0) * (R - 12) : R / 2, Y = v => B - (v - lo) / (hi - lo) * (B - T);
  const xy = pts.map(p => [X(p.t), Y(p.v)]), line = xy.map((q, i) => (i ? 'L' : 'M') + q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' ');
  let g = '';
  for (let v = lo, k = 0; v <= hi + st / 1e6 && k < 8; v += st, k++) { const y = Y(v).toFixed(1); g += '<line class="gr" x1="0" y1="'+y+'" x2="'+R+'" y2="'+y+'"/><text class="tk" x="'+W+'" y="'+(+y + 4)+'" text-anchor="end">'+esc(thou(v))+'</text>'; }
  const dates = '<text class="tk" x="0" y="'+(B + 18)+'">'+dm(t0)+'</text>' + (n > 1 ? '<text class="tk" x="'+R+'" y="'+(B + 18)+'" text-anchor="end">'+dm(t1)+'</text>' : '') +
    (n > 2 && X(pts[n >> 1].t) > 70 && X(pts[n >> 1].t) < R - 70 ? '<text class="tk" x="'+X(pts[n >> 1].t).toFixed(1)+'" y="'+(B + 18)+'" text-anchor="middle">'+dm(pts[n >> 1].t)+'</text>' : '');
  const last = xy[n - 1], dot = (q, c) => '<circle class="'+c+'" cx="'+q[0].toFixed(1)+'" cy="'+q[1].toFixed(1)+'" r="5"/>';
  const hits = xy.map((q, i) => { const a = i ? (xy[i - 1][0] + q[0]) / 2 : 0, b = i < n - 1 ? (q[0] + xy[i + 1][0]) / 2 : W;
    return '<rect class="hit" data-a="ltip" data-i="'+i+'" x="'+a.toFixed(1)+'" y="0" width="'+Math.max(1, b - a).toFixed(1)+'" height="'+(B + 22)+'"/>'; }).join('');
  const tips = xy.map((q, i) => '<g class="tipg" data-i="'+i+'"><line class="xh" x1="'+q[0].toFixed(1)+'" y1="'+(T - 6)+'" x2="'+q[0].toFixed(1)+'" y2="'+B+'"/>' + dot(q, 'dot') + tipBox(q[0], 0, fmtV(pts[i].v), dm(pts[i].t) + (pts[i].sub ? ' · ' + pts[i].sub : ''), R) + '</g>').join('');
  return '<svg class="lch" id="'+esc(id)+'" viewBox="0 0 '+W+' '+(B + 24)+'" role="img" aria-label="'+esc(label)+'">' + g + dates +
    (n > 1 ? '<path class="ar" d="'+line+' L'+last[0].toFixed(1)+','+B+' L'+xy[0][0].toFixed(1)+','+B+' Z"/><path class="ln" d="'+line+'"/>' : '') + dot(last, 'dot') + tips + hits + '</svg>';
}
// weeks: oldest first; segs: [{ k, cls }] bottom first; avg: the line (0 = none)
function weekBars(id, weeks, segs, fmtV, avg, label, tipSub){
  const W = 300, B = 124, T = 42, n = weeks.length, slot = W / n, bw = 20;
  const tot = w => segs.reduce((a, s) => a + (w[s.k] || 0), 0), mx = Math.max.apply(null, [avg || 0].concat(weeks.map(tot))) || 1, H = v => v / mx * (B - T);
  let body = '<line class="gr" x1="0" y1="'+B+'" x2="'+W+'" y2="'+B+'"/>', tips = '', hits = '';
  weeks.forEach((w, i) => {
    const x = i * slot + (slot - bw) / 2, cur = i === n - 1; let y0 = B, top = B;
    const live = segs.filter(s => H(w[s.k] || 0) >= .5);
    live.forEach((s, j) => {
      let h = H(w[s.k]); if (j) { y0 -= 2; h = Math.max(.5, h - 2); }
      const y = y0 - h, r = j === live.length - 1 ? Math.min(4, h) : 0;
      body += '<path class="'+s.cls+(cur ? ' cur' : '')+'" d="M'+x.toFixed(1)+','+y0.toFixed(1)+' L'+x.toFixed(1)+','+(y + r).toFixed(1)+(r ? ' Q'+x.toFixed(1)+','+y.toFixed(1)+' '+(x + r).toFixed(1)+','+y.toFixed(1)+' L'+(x + bw - r).toFixed(1)+','+y.toFixed(1)+' Q'+(x + bw).toFixed(1)+','+y.toFixed(1)+' '+(x + bw).toFixed(1)+','+(y + r).toFixed(1) : ' L'+(x + bw).toFixed(1)+','+y.toFixed(1))+' L'+(x + bw).toFixed(1)+','+y0.toFixed(1)+' Z"/>';
      y0 = y; top = y;
    });
    if (cur) body += '<text class="tv" x="'+(x + bw / 2).toFixed(1)+'" y="'+(top - 7).toFixed(1)+'" text-anchor="middle">'+esc(fmtV(tot(w)))+'</text>';
    body += '<text class="tk" x="'+(x + bw / 2).toFixed(1)+'" y="'+(B + 16)+'" text-anchor="middle">'+(cur ? 'ovaj' : 'T-' + (n - 1 - i))+'</text>';
    tips += '<g class="tipg" data-i="'+i+'"><rect class="hl" x="'+(x - 3).toFixed(1)+'" y="'+(T - 4)+'" width="'+(bw + 6)+'" height="'+(B - T + 4)+'" rx="5"/>' + tipBox(x + bw / 2, 0, fmtV(tot(w)), tipSub(w), W) + '</g>';
    hits += '<rect class="hit" data-a="ltip" data-i="'+i+'" x="'+(i * slot).toFixed(1)+'" y="0" width="'+slot.toFixed(1)+'" height="'+(B + 20)+'"/>';
  });
  if (avg > 0) { const y = B - H(avg); body += '<line class="avg" x1="0" y1="'+y.toFixed(1)+'" x2="'+W+'" y2="'+y.toFixed(1)+'"/><text class="tk al" x="2" y="'+(y < T + 6 ? y + 13 : y - 5).toFixed(1)+'">prosjek '+esc(fmtV(avg))+'</text>'; }
  return '<svg class="lch bars" id="'+esc(id)+'" viewBox="0 0 '+W+' '+(B + 22)+'" role="img" aria-label="'+esc(label)+'">' + body + tips + hits + '</svg>';
}
// the headline of a load card: value, a pill with the change, what it is compared with
function loadHead(txt, v, prev, vs, none){
  const p = prev > 0 && v > 0 ? Math.round((v - prev) / prev * 100) : null;
  return '<div class="hv"><span class="v">'+esc(txt)+'</span>' + (p == null ? '' : '<span class="pill '+(p > 0 ? 'up' : p < 0 ? 'dn' : 'eq')+'">'+(p > 0 ? '▲ ' : p < 0 ? '▼ ' : '')+Math.abs(p)+' %</span><span class="vs">'+esc(vs)+'</span>') + (p == null && none ? '<span class="vs">'+esc(none)+'</span>' : '') + '</div>';
}
const LOAD_LABEL = { kg: 'Volumen tereta', reps: 'Ukupno ponavljanja', secs: 'Ukupno vrijeme', m: 'Metri' };
const LOAD_RANGES = [['3', '3 mj', 91], ['6', '6 mj', 183], ['sve', 'Sve', 0]];
// the "Opterećenje" card of one exercise (the exercise page and Glavne vježbe); range: '3' | '6' | 'sve'
function exLoadCard(e, range, compact){
  const rg = LOAD_RANGES.find(r => r[0] === range) || LOAD_RANGES[0], sr = exLoadSeries(e.id, rg[2]), all = rg[2] ? exLoadSeries(e.id, 0) : sr;
  const per = compact ? '<button class="txtbtn lnk" data-a="loadInfo">Kako se računa?</button>' : '<div class="per" role="group" aria-label="Razdoblje">' + LOAD_RANGES.map(r => '<button data-a="loadRange" data-v="'+r[0]+'" aria-pressed="'+(r[0] === rg[0])+'">'+r[1]+'</button>').join('') + '</div>';
  const title = compact ? '<b class="t2">'+esc(e.name)+'</b>' : '<span class="t">'+(sr ? LOAD_LABEL[sr.kind] : LOAD_LABEL[all && all.kind] || 'Volumen')+'</span>';
  if (!sr || !sr.pts.length) return '<div class="lc"><div class="hd">'+title+per+'</div><p class="none">'+(all ? 'U ovom razdoblju nema treninga s ovom vježbom.' : 'Kad odradiš ovu vježbu, ovdje se vidi kako raste njezin volumen: kilogrami × ponavljanja, ponavljanja ili vrijeme.')+'</p></div>';
  const P2 = sr.pts, k = sr.kind, f = v => loadFmt(k, v), n = P2.length, last = P2[n - 1], tr = loadTrend(P2);
  const sub = p => p.xs.length === 1 ? doseBase(p.xs[0]) : p.xs.length + ' × u treningu';
  const pts = P2.map(p => ({ t: p.t, v: p.v, sub: sub(p) }));
  const sum = (compact ? e.name + ': ' : '') + LOAD_LABEL[k] + ', ' + n + ' ' + plural(n, 'trening', 'treninga', 'treninga') + ' od ' + shortDate(P2[0].t) + ' do ' + shortDate(last.t) + ': od ' + f(P2[0].v) + ' do ' + f(last.v) + (tr ? '. ' + tr.text : '') + '.';
  return '<div class="lc"><div class="hd">'+title+per+'</div>' + loadHead(f(last.v), last.v, n > 1 ? P2[n - 2].v : 0, 'od prošlog treninga', n === 1 ? 'prvi trening' : '') +
    (n > 1 ? lineChart('lc-' + e.id + (compact ? '-c' : ''), pts, f, sum) : '<p class="none">' + esc(shortDate(last.t) + ' · ' + sub(last) + '. Graf se crta od drugog treninga.') + '</p>') +
    (tr ? '<div class="ins '+(tr.dir > 0 ? 'up' : tr.dir < 0 ? 'dn' : 'eq')+'"><i aria-hidden="true">'+(tr.dir > 0 ? '↗' : tr.dir < 0 ? '↘' : '→')+'</i>'+esc(tr.text)+'</div>' : '') +
    chartTable(['Trening', LOAD_LABEL[k]], P2.slice().reverse().map(p => [shortDate(p.t) + (p.xs.length === 1 ? ' · ' + doseBase(p.xs[0]) : ''), f(p.v)])) + '</div>';
}
// the history list under the chart: the last sessions, how they went; the label counts every logged session of the exercise
function exHistHtml(e, h){
  h = h || historyOf(e.id); if (!h.length) return '';
  const n = new Set(h.map(x => x.at)).size;
  return '<div class="opthd sub"><span>Zadnji treninzi</span><span>'+n+' '+plural(n, 'trening', 'treninga', 'treninga')+'</span></div><div class="lc hist">' + h.slice(0, 6).map(x => {
    const tags = (x.done === false ? '<span class="tag">nije išlo' + (x.lastReps != null ? ' · zadnja serija ' + esc(x.lastReps) + ' pon.' : '') + '</span>' : '') + (x.setsDone != null ? '<span class="tag">' + esc(x.setsDone + ' od ' + (x.sets || 1) + ' ' + plural(x.sets || 1, 'serije', 'serije', 'serija')) + '</span>' : '');
    return '<div class="hrow" style="align-items:baseline"><span style="flex:none">' + esc(shortDate(x.at)) + '</span><b>' + esc(dose(x)) + (tags ? '<span style="display:flex;flex-wrap:wrap;gap:6px;margin:5px 0 2px">' + tags + '</span>' : '') + '</b></div>'; }).join('') + '</div>';
}
// Napredak → "Tjedno opterećenje": strength volume load and field metres per calendar week, the last 8 weeks
function weekLoadHtml(){
  const W = weekLoads(8), cur = W[7], prev4 = W.slice(3, 7), avg = k => prev4.reduce((a, w) => a + w[k], 0) / 4;
  const anyVl = W.some(w => w.vl > 0), anyM = W.some(w => w.m > 0);
  const head = '<div class="psec"><h2>Tjedno opterećenje</h2><button class="txtbtn lnk" data-a="loadInfo">Kako se računa?</button></div>';
  if (!anyVl && !anyM) return head + '<p class="sub" style="margin:0 17px 10px;line-height:20px">Kad odradiš treninge s kilogramima ili trčanje na terenu, ovdje vidiš koliko si napravio svaki tjedan u zadnjih 8 tjedana.</p>';
  const range = w => shortDate(w.ws) + ' – ' + shortDate(calDay(w.we, -1));
  const pct = (v, a) => a > 0 ? ' (' + (v >= a ? '+' : '−') + Math.abs(Math.round((v - a) / a * 100)) + ' % od prosjeka)' : '';
  let out = head;
  if (anyVl) { const a = avg('vl'), f = v => loadFmt('vl', v);
    out += '<div class="lc"><div class="hd"><span class="t">Snaga · volumen tereta</span><span class="t">zadnjih 8 tjedana</span></div>' + loadHead(f(cur.vl), cur.vl, a, 'od prosjeka 4 tjedna', 'ovaj tjedan') +
      weekBars('wk-vl', W, [{ k: 'vl', cls: 'bs' }], f, a, 'Volumen tereta po tjednima, zadnjih 8 tjedana. Ovaj tjedan ' + f(cur.vl) + pct(cur.vl, a) + '; prosjek prethodna 4 tjedna ' + f(a) + '.', w => range(w)) +
      chartTable(['Tjedan', 'Volumen tereta'], W.slice().reverse().map(w => [range(w), f(w.vl)])) + '</div>'; }
  if (anyM) { const a = avg('m'), f = v => loadFmt('m', v);
    out += '<div class="lc"><div class="hd"><span class="t">Teren · metri</span><span class="t">zadnjih 8 tjedana</span></div>' + loadHead(f(cur.m), cur.m, a, 'od prosjeka 4 tjedna', 'ovaj tjedan') +
      weekBars('wk-m', W, [{ k: 'ost', cls: 'bt1' }, { k: 'hsr', cls: 'bt2' }], f, a, 'Metri na terenu po tjednima, zadnjih 8 tjedana. Ovaj tjedan ' + f(cur.m) + pct(cur.m, a) + ', od toga brzo trčanje ' + f(cur.hsr) + '; prosjek prethodna 4 tjedna ' + f(a) + '.', w => range(w) + ' · brzo ' + f(w.hsr)) +
      '<div class="lg2"><span><i class="k1"></i>Ostali metri</span><span><i class="k2"></i>Brzo trčanje</span></div>' +
      chartTable(['Tjedan', 'Metri (brzo trčanje)'], W.slice().reverse().map(w => [range(w), f(w.m) + ' (' + f(w.hsr) + ')'])) + '</div>'; }
  return out;
}
// the field page: tags, three tiles, the intensity distribution with its assumptions, "U sezoni" (the dose and the best days)
const FIELD_TYPE = { aerobno: 'Aerobno', intervali: 'Intervali', brzina: 'Brzina', agilnost: 'Agilnost', test: 'Test' };
const fieldSeason = a => a.type !== 'test' && inSeason();
function fieldTagsHtml(a){
  return '<span class="tag'+(a.li >= 2 ? ' hi' : '')+'">Intenzitet: '+a.int+'</span><span class="tag">Volumen: '+a.vol+'</span><span class="tag">'+FIELD_TYPE[a.type]+'</span>';
}
function fieldLoadHtml(f, a){
  const ZC = ['z1', 'z2', 'z3', 'z4'], md = matchDay(), ws = weekStart(Date.now()), wm = weekMatches(ws), today = dayIdx(Date.now());
  const zs = a.zones.map((m, i) => ZONE_NAMES[i] + ' ' + loadFmt('m', m)).join(', ');
  let h = '<div class="stats"><div class="stat"><b>'+loadFmt('m', a.m)+'</b><span>ukupno</span></div><div class="stat"><b>'+loadFmt('m', a.hsr)+'</b><span>brzo trčanje</span></div><div class="stat"><b>'+esc(fieldMin(f))+' min</b><span>trajanje</span></div></div>' +
    '<div class="lc" style="margin-top:12px"><div class="hd"><span class="t">Raspodjela intenziteta · metri</span><button class="txtbtn lnk" data-a="loadInfo">Kako se računa?</button></div>' +
    '<div class="zb" role="img" aria-label="'+esc('Metri po zonama: ' + zs + (a.spr ? '; sprint ' + loadFmt('m', a.spr) : '') + '.')+'">' + a.zones.map((m, i) => m >= 1 ? '<i class="'+ZC[i]+'" style="flex:'+m+'"></i>' : '').join('') + '</div>' +
    '<div class="zl">' + a.zones.map((m, i) => '<span><i class="'+ZC[i]+'"></i>'+ZONE_NAMES[i]+'<b>'+loadFmt('m', m)+'</b></span>').join('') + '</div>' +
    '<p class="lnote">MAS '+masTxt(a.mas)+' m/s'+(a.def ? ' (zadano dok ne upišeš MAS test)' : ' (tvoj zadnji MAS test)')+'. Najveća brzina ' + kmhTxt(topKmh()) + ' km/h' + (typeof S.settings.topKmh === 'number' && topKmh() === S.settings.topKmh ? ' (tvoja, iz Doziranja)' : ' (zadano, promijeni u Doziranju)') + '. Brzo trčanje od 19,8 km/h, sprint od 25,2 km/h' + (a.spr ? ' (ovdje ' + loadFmt('m', a.spr) + ')' : '') + '. Rad bez odmora: ' + dec1(a.min) + ' min.' + (a.notes.length ? ' Procjena: ' + esc(a.notes.join(' ')) : '') + '</p></div>';
  if (a.type === 'test') return h;
  const s = fieldLoad(f, 'season'), pc = Math.round(s.m / (a.m || 1) * 100);
  const best = a.li >= 2 ? 'Najbolje 4 dana prije utakmice (MD-4), najkasnije 3 dana prije (MD-3).'
    : a.li === 1 ? 'Najbolje 4 ili 3 dana prije utakmice (MD-4, MD-3) ili 2 dana nakon nje.'
    : 'Može 4, 3 ili 2 dana prije utakmice (MD-4 do MD-2) ili 2 dana nakon nje.';
  // this week, by all its matches: the days from today on where the session fits (fieldMatchNote says nothing)
  const lf = wm.length >= 2 && a.li ? lightField() : null;
  const days = [0, 1, 2, 3, 4, 5, 6].filter(i => i >= today && wm.indexOf(i) === -1 && !fieldMatchNote(a.li, i, ws));
  const week = wm.length >= 2 ? ' Ovaj tjedan imaš ' + nMatches(wm.length) + ' (' + daysList(wm) + '): na terenu samo lagani trening (intenzitet nizak), bez teških nogu između utakmica. ' +
      (a.li ? 'Ovaj trening preskoči' + (lf ? ', umjesto njega odradi „' + lf.f.name_hr + '”.' : '.') : days.length ? 'Ovaj trening može ' + daysList(days, ' ili ') + '.' : 'Ovaj tjedan za njega više nema dobrog dana.')
    : wm.length ? ' Ovaj tjedan (utakmica ' + daysList(wm) + '): ' + (days.length ? 'može ' + daysList(days, ' ili ') + '.' : 'za ovaj trening više nema dobrog dana.')
    : ' U tjednu s dvije utakmice ' + (a.li ? 'ga preskoči.' : 'može samo ovakav lagani trening.');
  const why = loadFmt('m', s.m) + ' umjesto ' + loadFmt('m', a.m) + ', brzo trčanje ' + loadFmt('m', s.hsr) + '. ' + best + ' Nikad dan prije utakmice. Najviše jedan dodatni trening na terenu tjedno.' + week +
    (fieldSeason(a) ? (md >= 0 ? ' Dan utakmice je postavljen u Doziranju' : ' Utakmica je označena u tjednu') + ', pa Kreni pokreće dozu za sezonu.' : ' Kad u Doziranju postaviš dan utakmice ili označiš utakmicu u tjednu, Kreni pokreće dozu za sezonu.');
  return h + '<div class="psec"><h2>U sezoni</h2><span>'+(wm.length ? (wm.length > 1 ? 'utakmice ' : 'utakmica ') + esc(daysList(wm)) : md >= 0 ? 'ovaj tjedan bez utakmice' : 'bez dana utakmice')+'</span></div>' +
    '<div class="lift'+(fieldSeason(a) ? ' go' : '')+'"><div class="top"><b>Doza za sezonu: '+esc(s.doseText)+'</b><span>≈ '+pc+' %</span></div><div class="why">'+esc(why)+'</div></div>';
}
// the start: "Kreni" runs the season dose when a match day is set (else the full one); the link under it runs the other
function fieldStartHtml(f, a){
  const sz = fieldSeason(a);
  return '<div class="footer gut"><button class="btn" data-a="startField" data-id="'+esc(f.id)+'" data-dose="'+(sz ? 'season' : 'full')+'">Kreni</button>' +
    (a.type === 'test' ? '' : '<button class="txtbtn flink" data-a="startField" data-id="'+esc(f.id)+'" data-dose="'+(sz ? 'full' : 'season')+'">'+(sz ? 'Puna doza' : 'Doza za sezonu')+'</button>') + '</div>';
}
// "Kako se računa?" — the education page (a full page with ✕)
VIEWS.loadInfo = function(){
  const up = '<svg viewBox="0 0 120 80" aria-hidden="true"><polyline class="i1" points="12,62 57,39 102,14"/><circle class="i1" cx="12" cy="62" r="9"/><circle class="i1" cx="57" cy="39" r="9"/><circle class="i1" cx="102" cy="14" r="9"/><path class="i2" d="M30 76 L104 40 M90 38 L106 39 L100 54"/></svg>';
  const flat = '<svg viewBox="0 0 120 80" aria-hidden="true"><line class="i3" x1="22" y1="30" x2="98" y2="30"/><circle class="i3" cx="18" cy="30" r="9"/><circle class="i3" cx="60" cy="30" r="9"/><circle class="i3" cx="102" cy="30" r="9"/><path class="i4" d="M26 56 L100 56 M90 46 L101 56 L90 66"/></svg>';
  return '<div class="view gut">' + topbar('<button class="ib" data-a="back" aria-label="Zatvori">' + I.close + '</button>', '', 'OPTEREĆENJE') +
    '<div class="edu"><h1>Napredak vježbe: volumen i volumen tereta</h1>' +
    '<p>Volumen pokazuje koliko si ukupno odradio. Računa se iz onoga što si stvarno napravio, prema vrsti vježbe:</p>' +
    '<ul><li><b>S kilogramima:</b> volumen tereta = ponavljanja × kg, zbrojeno po serijama.</li><li><b>Bez tereta:</b> ukupna ponavljanja, a kod vježbi na vrijeme ukupno vrijeme.</li><li><b>Trčanje:</b> ukupni metri, od toga brzo trčanje (od 19,8 km/h) i sprint (od 25,2 km/h).</li></ul>' +
    '<h2>Zašto je važno?</h2><p>Snaga i kondicija rastu kad tijelu postupno daješ malo više posla. Volumen to pokazuje jednim brojem: vidiš rasteš li, stojiš li na mjestu ili si tjedan prije utakmice napravio previše.</p>' +
    '<h2>Kako se računa?</h2><p>Npr. 4 serije × 5 ponavljanja × 80 kg = 1.600 kg. Kod bučica se računa jedna bučica, kao što upisuješ kilograme. Vježba „po strani” broji obje strane. Djelomične serije računaju se kako si ih odradio, preskočene ne.</p>' +
    '<p>Graf vježbe prikazuje volumen tereta kad u razdoblju ima treninga s kilogramima (treninzi bez kilograma tada se ne crtaju), inače ponavljanja ili vrijeme. Tjedno opterećenje u Napretku zbraja treninge u kalendarskom tjednu, od ponedjeljka do nedjelje, i uspoređuje ih s prosjekom prethodna 4 tjedna. Vježba isprobana iz knjižnice ulazi u svoj graf, ali ne i u tjedni zbroj.</p>' +
    '<h2>Trčanje na terenu</h2><p>Metri se računaju iz blokova treninga i tvog MAS-a (zadnji MAS test; dok ga nemaš, 4,5 m/s). Zone: lagano ispod 70 % MAS-a, umjereno 70–90 %, visoko od 90 % MAS-a do 25,2 km/h, a sprint iznad toga. Postotak brzine ili napora računa se od tvoje najveće brzine iz Doziranja (zadano 28,8 km/h). Gdje trening ne navodi udaljenost ili brzinu, na njegovoj stranici piše procjena.</p>' +
    '<p>Intenzitet treninga ovisi o udjelu brzog trčanja i sprinta, a volumen o metrima: nizak do 1,5 km, srednji do 3 km, visok iznad toga.</p>' +
    '<h2>U sezoni</h2><p>Kad u Doziranju postaviš dan utakmice (ili u tjednu označiš utakmicu), Kreni pokreće dozu za sezonu: oko 2/3 serija (s jednom serijom 2/3 ponavljanja). Uz treninge s loptom najviše jedan dodatni trening na terenu tjedno: intenzivan najbolje 4 dana prije utakmice, nikad dan prije. U tjednu s dvije utakmice samo lagani trening na terenu i bez teških nogu između utakmica.</p>' +
    '<h2>Na što paziti?</h2><div class="icons"><figure>' + up + '<figcaption>Raste: napredak</figcaption></figure><figure>' + flat + '<figcaption>Ravno 2–3 tjedna: vrijeme za promjenu</figcaption></figure></div>' +
    '<p>Linija koja raste znači napredak. Ravna linija dulje od 2–3 tjedna znači da je vrijeme za promjenu: koje ponavljanje, kilogram ili serija više. Lakši tjedan prije utakmice je u redu, kao i pad u tjednu s dvije utakmice.</p></div>' +
    '<div style="height:24px"></div></div>';
};
VIEWS.progress = function(){
  const plan = planSlots(), ws = weekStart(Date.now()), wplan = weekPlan(ws, plan), wk = weekStatus(ws, wplan);
  if (S.dbState === 'ready') notePlan(ws, wplan);
  let sk = plan.length ? streakWeeks(plan) : 0;
  if (!plan.length) for (let w = ws, k = 0; k < 104; w = calDay(w, -7), k++) { const we = calDay(w, 7); if (S.log.some(l => isTraining(l) && l.at >= w && l.at < we)) sk++; else if (w !== ws) break; }
  const thisWeek = S.log.filter(l => isTraining(l) && l.at >= ws).length, total = nTrainings(S.log);
  const sugs = progSuggestions(), act = sugs.filter(x => x.kind === 'up' || x.kind === 'revert' || x.kind === 'variant'), way = sugs.filter(x => x.kind === 'way');
  const nokg = {}; sugs.filter(x => x.kind === 'nokg').forEach(x => { (nokg[x.p.id] = nokg[x.p.id] || { p: x.p, names: [] }).names.push(x.e.name); });
  const nokgHtml = Object.values(nokg).map(g => '<div class="lift"><div class="top"><b>Upiši početne težine</b><span>'+esc(g.p.name)+'</span></div><div class="why">'+esc(g.names.join(', '))+': bez kilograma ne mogu predložiti povećanje.</div><div class="acts" style="grid-template-columns:1fr"><button class="bt ghost" data-a="editPr" data-id="'+esc(g.p.id)+'">Upiši kilograme</button></div></div>').join('');
  const hist = progHistory();
  // main exercises: your lifts with kilograms first (most trained first), then strength and trunk exercises without a load
  // and timed work that changed; no activation, rehab or mobility drills, no timed hold that never changed, nothing that
  // is no longer in the library
  const series = {}, rank = {};
  Object.keys(hist).forEach(id => { const e = S.ex[id]; if (!e) return; const sr = liftSeries(hist[id], 10); if (sr.pts.length < 2) return;
    const time = sr.unit === ' s', moved = sr.pts.some(x => sr.val(x) !== sr.val(sr.pts[0]));
    const r = time && !moved ? 0 : sr.loaded && !time ? 2 : sr.loaded || e.cat === 'Snaga' || e.cat === 'Trup' ? 1 : 0;
    if (r) { series[id] = sr; rank[id] = r; } });
  const lifts = Object.keys(series).sort((a, b) => rank[b] - rank[a] || hist[b].length - hist[a].length || hist[b][hist[b].length - 1].at - hist[a][hist[a].length - 1].at).slice(0, 4);
  const charts = lifts.map(id => exLoadCard(S.ex[id], 'sve', true)).join('');   // the same load card as the exercise page
  // records: a best estimated max that beat an earlier best, set in the last 30 days (your first weight is not a record);
  // reps of a set count up to 10 like in Doziranje; no timed carries, jumps or throws
  const prs = Object.keys(hist).filter(id => S.ex[id] && S.ex[id].cat !== 'Eksplozivnost').map(id => { let best = null, beaten = false;
    hist[id].forEach(x => { const r = liftReps(x); if (!r) return; const v = e1rm(x.kg, Math.min(r, 10)); if (!best) best = { v, x, r }; else if (v > best.v + .01) { best = { v, x, r }; beaten = true; } });
    return best && beaten && Date.now() - best.x.at < 30 * DAY_MS ? { id, best } : null; }).filter(Boolean).sort((a, b) => b.best.x.at - a.best.x.at).slice(0, 4);
  // consistency: one cell per calendar day (a clock change never shifts the grid)
  const days = {}; S.log.forEach(l => { if (!isTraining(l)) return; const t = calDay(l.at); days[t] = (days[t] || 0) + 1; });
  const start = calDay(ws, -77); let heat = '';
  for (let d = 0; d < 7; d++) for (let w = 0; w < 12; w++) { const t = calDay(start, w * 7 + d); const n = days[t] || 0; heat += '<i class="'+(t > Date.now() ? 'fut' : n >= 2 ? 'l3' : n === 1 ? 'l2' : '')+'"></i>'; }
  const head = '<div class="view gut">' + topbar('', '', 'NAPREDAK') +
    '<h1 class="h1">Napredak</h1>' +
    '<div class="seg" style="margin-top:16px"><button class="chip" data-a="progTab" data-v="pregled" aria-pressed="'+(S.progTab !== 'doziranje')+'" style="height:44px">Pregled</button><button class="chip" data-a="progTab" data-v="doziranje" aria-pressed="'+(S.progTab === 'doziranje')+'" style="height:44px">Doziranje</button></div>';
  if (S.progTab === 'doziranje') return head + dosingHtml() + '<div style="height:20px"></div></div>';
  return head +
    '<div class="stats"><div class="stat"><b>'+(wk.planned ? wk.done + '/' + wk.planned : thisWeek)+'</b><span>'+(wk.planned ? 'treninga ovaj tjedan po planu' : plural(thisWeek, 'trening', 'treninga', 'treninga') + ' ovaj tjedan')+'</span></div><div class="stat"><b>'+sk+'</b><span>'+plural(sk, 'tjedan', 'tjedna', 'tjedana')+(plan.length ? ' zaredom po planu' : ' zaredom s treningom')+'</span></div><div class="stat"><b>'+total+'</b><span>'+plural(total, 'trening', 'treninga', 'treninga')+' ukupno</span></div></div>' +
    weekLoadHtml() +
    '<div class="psec"><h2>Prijedlozi</h2><span>ti odlučuješ</span></div>' +
    (act.length ? act.map(sugCard).join('') : '<p class="sub" style="margin:0 17px 10px;line-height:20px">Kad '+progN()+' treninga zaredom odradiš sve serije neke vježbe, ovdje dobiješ prijedlog za veće opterećenje.</p>') + nokgHtml +
    (way.length ? '<div class="psec"><h2>Na putu</h2><span>uvjet: '+progN()+' treninga zaredom</span></div>' + way.map(sugCard).join('') : '') +
    (charts ? '<div class="psec"><h2>Glavne vježbe</h2><span>zadnji treninzi</span></div>' + charts : '') +
    (prs.length ? '<div class="psec"><h2>Rekordi</h2><span>zadnjih 30 dana</span></div><div class="chart">' + prs.map(r => '<div class="pr"><span class="medal">'+I.medal+'</span><div><b>'+esc(S.ex[r.id].name)+' · '+esc(fmtKg(r.best.x.kg))+' × '+esc(r.best.r)+'</b><br><span>'+esc(shortDate(r.best.x.at))+' · procjena maksimuma '+esc(fmtKg(Math.round(r.best.v * 2) / 2))+'</span></div></div>').join('') + '</div>' : '') +
    '<div class="psec"><h2>Dosljednost</h2><span>12 tjedana</span></div><div class="chart"><div class="sub2">Svaki kvadratić je dan, a redovi su dani u tjednu (P–N).</div><div class="heat" role="img" aria-label="'+heatLabel(heat)+'">'+heat+'</div></div>' +
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
    const cands = progCandidates(), any = anyCredit();
    const willCount = any && P.ref && weekPlan(weekStart(Date.now())).some(s => slotHit(s, { kind: P.ref.kind, refId: P.ref.id }));
    const wk = willCount ? weekAfter() : { planned: 0 };
    return '<div class="view gut stack">' + topbar('', '') +
      '<div class="done'+(cands.length ? ' compact' : '')+'">'+(any ? '<span class="ck">'+I.check+'</span>' : '')+'<h1 style="margin:10px 0 0;font-size:30px;font-weight:600">'+(!any ? 'Ništa nije odrađeno' : P.quit ? 'Trening je prekinut' : 'Bravo!')+'</h1><span style="font-size:16px;color:var(--text-body)">' + esc(P.title) + ' • ' + fmtDur(P.secs) + '</span>' +
        (wk.planned ? '<span class="sub" style="margin:0">Ovaj tjedan ' + wk.done + '/' + wk.planned + ' po planu</span>' : '') +
        (!any ? '<span class="sub" style="margin:0;line-height:19px">Trening se ne sprema dok nijedna serija nije odrađena.' + (cands.length ? ' Ako si vježbe napravio bez playera, označi ih „Sve odrađeno”.' : '') + '</span>' : '') + '</div>' +
      (cands.length ? '<h2 class="h2" style="margin-top:22px">Kako je išlo?</h2>' +
        '<div class="list" style="margin-top:10px;gap:0">' + cands.map(c => {
          // pre-marked from what the player saw: all sets, some sets ('partial') or none ('skip'); the last two don't count
          const a = P.answers[c.j], failed = a === false, ok = a === true, n = c.it.sets || 1, did = setsDoneOf(c.j);
          const msg = a === 'skip' ? 'Preskočeno' + (c.prog ? '' : ': ne računa se u napredak')
            : a === 'partial' ? (did ? 'Odrađeno: ' + did + ' od ' + n + ' ' + plural(n, 'serije', 'serije', 'serija') : 'Djelomično odrađeno') + (c.prog ? '' : ' · ne računa se u napredak')
            : doneMsg(c);
          const lr = lastRepsOf(c.j);
          return '<div class="xrow"><div class="tx"><b>' + esc(c.e.name) + ' · ' + nwNum(dose(c.it)) + '</b>' +   // a number stays with its unit ('7,5 kg')
            '<div class="seg2"><button data-a="answer" data-j="'+c.j+'" data-v="1" aria-pressed="'+ok+'" class="'+(ok ? 'on' : '')+'">Sve odrađeno</button><button data-a="answer" data-j="'+c.j+'" data-v="0" aria-pressed="'+failed+'" class="'+(failed ? 'onA' : '')+'">Nisam uspio</button></div>' +
            (failed && c.it.measure !== 'time' ? '<div class="mini">Zadnja serija: <button class="sbtn" data-a="lrep" data-j="'+c.j+'" data-d="-1" aria-label="Ponavljanja u zadnjoj seriji: smanji">−</button><b>'+esc(lr)+'</b><button class="sbtn" data-a="lrep" data-j="'+c.j+'" data-d="1" aria-label="Ponavljanja u zadnjoj seriji: povećaj">+</button> '+plural(lr, 'ponavljanje', 'ponavljanja', 'ponavljanja')+'</div>' : '') +
            (msg ? '<em class="'+(failed ? 'a' : (ok && !c.prog && (c.it.ok || 0) + 1 >= progN()) ? 'g' : '')+'"'+(ok || failed ? '' : ' style="color:var(--text-2)"')+'>' + esc(msg) + '</em>' : '') + '</div></div>';
        }).join('') + '</div>' : '') +
      masDoneHtml() + '<div style="height:12px"></div></div>' +
      '<div class="footer gut stack" style="gap:10px"><button class="btn" data-a="finishPlay">'+(!any ? 'Izađi' : P.quit ? 'Spremi i izađi' : 'Završi')+'</button>' + (P.quit || !any ? '' : '<button class="txtbtn" data-a="restartPlay" style="align-self:center">Spremi i ponovi</button>') + '</div>';
  }
  // the demo video of the screen being replaced; after() puts it back when the exercise stays the same
  keepMedia = app.dataset.key === 'play:' ? app.querySelector('.view .media video, .view .media img') : null;
  const v = curView();
  const prog = (P.i + (v.st.dur ? 1 - remaining()/v.st.dur : 0)) / P.steps.length;
  let media = P.mode === 'field'
    ? '<div class="media"><div class="fblock '+v.fieldPanel.cls+'" id="fpanel"><span class="ph1">'+v.fieldPanel.ph+'</span><span class="big" id="fbig">'+esc(v.big)+'</span>' + (v.fieldPanel.dist ? '<span class="sm" style="font-size:20px;font-weight:600;color:var(--text)">'+esc(v.fieldPanel.dist)+'</span>' : '') + '<span class="sm">'+esc(v.fieldPanel.sm)+'</span></div></div>'
    : mediaHtml(v.e, v.badge, true);
  if (keepMedia) {   // same video or photo as on the screen being replaced: leave a slot, after() moves the playing element in
    const m = media.match(keepMedia.tagName === 'VIDEO' ? /<video [^>]*><\/video>/ : /<img [^>]*>/);
    if (m && m[0].indexOf('src="' + esc(keepMedia.getAttribute('src')) + '"') !== -1) media = media.replace(m[0], '<i id="keepmedia"></i>'); else keepMedia = null;
  }
  const fspec = P.mode === 'field' && fieldSpec(P.f);
  const card = P.mode === 'field'
    ? '<section class="icard" style="margin:16px max(16px, env(safe-area-inset-left, 0px)) 0">' +
        (fspec ? '<span class="lb">Teren</span><div class="pitch inplay">' + pitchSvg(fspec, { block: v.st.g != null && v.st.kind !== 'prep' ? v.st.g : null }) + '</div><div class="lgrow">' + pitchLegend(fspec) + '</div>' : '') +
        '<span class="lb">Trening</span><p>'+esc(P.title)+'</p>' + (P.f.summary_hr ? '<p style="color:var(--text-body);font-size:15px">'+esc(P.f.summary_hr)+'</p>' : '') +
        '<span class="lb">Izvor</span><p style="font-size:14px">' + (P.f.source_url ? '<a href="'+esc(P.f.source_url)+'" target="_blank" rel="noopener">'+esc(P.f.source_title || 'STATSports')+'</a>' : esc(P.f.source_title || 'STATSports')) + '</p></section>'
    : v.e ? exInfoHtml(v.e, '<section class="icard exinfo pinfo" style="margin:16px max(16px, env(safe-area-inset-left, 0px)) 0">')   // the exercise page's Upute | Cilj tabs, shorter (no Opterećenje)
    : '<section class="icard" style="margin:16px max(16px, env(safe-area-inset-left, 0px)) 0"><span class="lb">Upute</span><p style="color:var(--text-2)">Bez uputa.</p></section>';
  return '<div class="view">' +
    '<div class="gut">' + topbar('<button class="ib" data-a="quitPlay" aria-label="Prekini trening">'+I.back+'</button>', '<button class="ib" data-a="playSettings" aria-label="Postavke playera">'+I.gear+'</button><button class="ib" data-a="playList" aria-label="Popis vježbi">'+I.list+'</button>') + '</div>' +
    '<div class="prog" role="progressbar" aria-label="Napredak" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+Math.round(prog*100)+'"><i id="progbar" style="width:'+(prog*100).toFixed(1)+'%"></i></div>' +
    media +
    '<div class="ttl gut">' + esc(v.title) + '</div><div class="meta gut">' + esc(v.meta) + '</div><div class="hint gut" id="phint">' + esc(v.hint) + '</div>' +
    card + '<div style="height:12px"></div></div>' +
    '<div class="ctrl gut">' +
      '<button class="ib" data-a="toggleSound" aria-label="'+(S.settings.sound?'Isključi zvuk':'Uključi zvuk')+'">'+(S.settings.sound?I.sound:I.mute)+'</button>' +
      '<button class="ib" data-a="jump" data-d="-1" aria-label="Prethodna vježba">'+I.prev+'</button>' +
      '<button class="ring'+(P.paused?' dim':'')+'" id="ring" data-a="ring" aria-label="'+(v.st.kind==='manual'?'Serija gotova':v.st.kind==='ready'?'Kreni':P.paused?'Nastavi':v.st.kind==='rest'&&!v.st.trans?'Preskoči odmor':'Pauziraj')+'">'+ringSvg(v.ringFrac, v.ringColor)+'<span class="n" id="ringN">'+(P.paused||v.st.kind==='ready'?I.play:esc(v.big))+'</span></button>' +
      '<button class="ib" data-a="jump" data-d="1" aria-label="Sljedeća vježba">'+I.next+'</button>' +
      '<span></span>' +
    '</div>';
};
function paintPlayer(full){
  if (top().v !== 'play' || !P) return;
  if (full) { render(); return; }
  const v = curView();
  const n = document.getElementById('ringN'); if (n && !P.paused && v.st.kind !== 'ready') n.textContent = v.big;
  const fb = document.getElementById('fbig'); if (fb) fb.textContent = v.big;
  const arc = document.getElementById('ringArc'); if (arc) { const C = 2*Math.PI*35; arc.setAttribute('stroke-dasharray', (C*Math.max(0,Math.min(1,v.ringFrac))).toFixed(1)+' '+C.toFixed(1)); }
  const pb = document.getElementById('progbar'); if (pb) { const prog = (P.i + (v.st.dur ? 1 - remaining()/v.st.dur : 0)) / P.steps.length; pb.style.width = (prog*100).toFixed(1) + '%'; }
  if (P._lastI !== P.i) { P._lastI = P.i; render(); }
}
// The screen is rebuilt at every step; the demo video (or photo) of the same exercise is moved over from the old screen,
// so it keeps playing instead of loading and starting again at every set, rest and side change.
function playAfter(){
  P._lastI = P.i;
  const slot = document.getElementById('keepmedia');
  if (slot && keepMedia) slot.replaceWith(keepMedia); else if (slot) slot.remove();
  keepMedia = null;
}

/* ---------- sheets ---------- */
function sheetHtml(){
  const s = S.sheet;
  let body = s.kind === 'credit' ? creditSheet(s) : '';
  if (s.kind === 'addTo') {
    // your own protocols only: sessions of a programme (e.g. a 6-week plan) keep the programme's doses
    const list = Object.values(S.pr).filter(p => !p.program).sort((a,b) => (b.updatedAt||0) - (a.updatedAt||0));
    body = '<h3>Dodaj u protokol</h3>' + list.map(p => '<button class="opt" data-a="addToPick" data-id="'+esc(p.id)+'"><span>'+esc(p.name)+'</span><span style="color:var(--text-2);font-size:14px">'+nVj((p.items||[]).length)+'</span></button>').join('') +
      '<button class="opt" data-a="addToNew" style="color:var(--accent-text);font-weight:600"><span>+ Novi protokol s ovom vježbom</span></button>';
  } else if (s.kind === 'leave') {
    const pr = top().v === 'build';
    body = '<h3>Spremiti promjene?</h3><p style="margin:0 0 16px;font-size:15px;line-height:22px;color:var(--text-body)">' + (pr ? 'Promjene u ovom protokolu još nisu spremljene.' : 'Promjene u ovoj vježbi još nisu spremljene.') + '</p>' +
      '<div class="stack" style="gap:10px"><button class="btn" data-a="leaveSave" style="height:52px;font-size:17px">Spremi i izađi</button><button class="btn danger" data-a="leaveDiscard">Izađi bez spremanja</button><button class="btn sec" data-a="sheetDone" style="height:48px">Nastavi uređivanje</button></div>';
  } else if (s.kind === 'progTest' || s.kind === 'progRestart') {
    body = progSheet(s);
  } else if (s.kind === 'eq') {
    const eq = S.lib.eq || [];
    const counts = {}; Object.values(S.ex).forEach(e => exEquip(e).forEach(t => counts[t] = (counts[t] || 0) + 1));
    body = '<h3>Oprema</h3><p style="margin:0 0 12px;font-size:14px;line-height:21px;color:var(--text-2)">Prikaži vježbe za opremu koju odabereš.</p>' +
      '<div class="chips wrap">' + EQUIP.filter(t => counts[t]).map(t => '<button class="tagbtn" data-a="eqToggle" data-v="'+esc(t)+'" aria-pressed="'+(eq.indexOf(t) !== -1)+'">'+esc(t)+' <span style="opacity:.6">'+counts[t]+'</span></button>').join('') + '</div>' +
      '<div class="seg" style="margin-top:18px"><button class="btn sec" data-a="eqClear" style="height:48px">Očisti</button><button class="btn" data-a="sheetDone" style="height:48px;font-size:16px">' + (n => 'Prikaži ' + n + ' ' + plural(n, 'vježbu', 'vježbe', 'vježbi'))(libFiltered().length) + '</button></div>';
  } else if (s.kind === 'day') {
    const ws = weekStart(Date.now()), st = weekStatus(ws, weekPlan(ws)), i = s.i, today = dayIdx(Date.now()), m = matchDay();
    const plan = st.slots.filter(x => x.day === i), done = st.log.filter(l => dayIdx(l.at) === i);
    const d = new Date(calDay(ws, i)), mt = matchOn(d.getTime());
    body = '<h3>' + esc(DAYNAMES[i].charAt(0).toUpperCase() + DAYNAMES[i].slice(1)) + ', ' + d.getDate() + '. ' + (d.getMonth() + 1) + '.' + (mt ? ' · utakmica' : '') + '</h3>' +
      '<div class="prow" style="min-height:56px;margin-bottom:8px;border-bottom:1px solid var(--border)"><span class="k">Utakmica' + (i === m ? '<small>Stalni dan utakmice iz Doziranja</small>' : '') + '</span><button class="switch" role="switch" data-a="toggleMatch" data-i="' + i + '" aria-checked="' + mt + '" aria-label="Utakmica"></button></div>' +
      (plan.length ? '<p class="label" style="padding:0 0 6px">Plan</p>' + plan.map(x => '<button class="opt" '+slotOpen(x)+'><span>'+esc(x.name)+'</span><span class="tag">'+(x.done ? 'odrađeno' : i < today ? 'propušteno' : 'čeka')+'</span></button>').join('') : '<p style="margin:0 0 8px;color:var(--text-2)">Za ovaj dan nema plana.</p>') +
      (i >= today ? matchBox(plan.filter(x => !x.done).map(x => matchNote(x, i)).find(Boolean), i, '12px 0 0') : '') +
      (done.length ? '<p class="label" style="padding:14px 0 6px">Odrađeno</p>' + done.map(l => '<div class="opt"><span>'+esc(l.name)+'</span><span style="color:var(--text-2);font-size:14px">'+fmtDur(l.secs)+'</span></div>').join('') : '') +
      '<p style="margin:14px 0 0;font-size:13px;line-height:19px;color:var(--text-2)">Dane biraš u svakom protokolu, programu i treningu na terenu (Dani u tjednu), a stalni dan utakmice u Napretku (Doziranje). Ovdje označiš i dodatnu utakmicu.</p>';
  } else if (s.kind === 'goal' || s.kind === 'kg') {
    const p = S.pr[s.id], G = GOALS[S.settings.goal], plan = p && (s.kind === 'kg' || G) ? (s.kind === 'goal' ? goalPlan(p, S.settings.goal) : kgPlan(p)) : { changes: [] };
    body = '<h3>' + (s.kind === 'goal' ? 'Cilj „' + esc(G ? G.name : '') + '” za ' + esc(p ? p.name : '') : 'Kilogrami za ' + esc(p ? p.name : '')) + '</h3>' +
      plan.changes.map(c => '<div class="opt" style="flex-direction:column;align-items:flex-start;gap:3px;padding:10px 4px"><b style="font-size:15px">'+esc(c.e.name)+'</b><span style="font-size:13px;color:var(--text-2)">'+esc(c.from)+(c.to !== c.from ? ' → <span style="color:var(--accent-text);font-weight:600">'+esc(c.to)+'</span>' : '')+(c.rest ? ' · odmor '+esc(c.rest[0])+' s → <span style="color:var(--accent-text);font-weight:600">'+esc(c.rest[1])+' s</span>' : '')+(c.est ? ' · kilograme upiši sam' : c.fromItem ? ' · procjena iz dosadašnje doze' : '')+'</span></div>').join('') +
      '<p style="margin:12px 0 14px;font-size:13px;line-height:19px;color:var(--text-2)">' + (s.kind === 'goal' && G && G.rir ? 'Bučice, girja i skokovi ostaju kako jesu. ' : '') + 'Sve možeš i dalje ručno promijeniti u uređivanju protokola.</p>' +
      '<div class="seg"><button class="btn sec" data-a="sheetDone" style="height:48px">Odustani</button><button class="btn" data-a="'+(s.kind === 'goal' ? 'goalApply' : 'kgApply')+'" data-id="'+esc(s.id)+'" style="height:48px;font-size:16px">Primijeni</button></div>';
  } else if (s.kind === 'progInfo') {
    const pk = plateKg(), up = (a, b) => a === b ? '+' + fmtKg(a) : '+' + fmtKg(a) + ', za noge +' + fmtKg(b);
    body = '<h3>Kako napredujem?</h3>' +
      '<div class="stack" style="gap:10px;font-size:15px;line-height:22px;color:var(--text-body)">' + ('' +
      '<p style="margin:0">Na kraju treninga svaka vježba je unaprijed označena prema onome što si odradio u playeru: „Sve odrađeno” ako si odradio sve serije. Djelomično odrađena ili preskočena vježba ne računa se ni kao uspjeh ni kao neuspjeh; ako si je ipak odradio cijelu (npr. bez playera), označi „Sve odrađeno”. Ako u nekoj seriji nisi napravio sva zadana ponavljanja, označi „Nisam uspio” i upiši koliko si ponavljanja napravio u zadnjoj seriji.</p>' +
      '<p style="margin:0">Kad ' + progN() + ' treninga zaredom odradiš sve, na stranici <b>Napredak</b> dobiješ prijedlog za sljedeći korak. Ti ga prihvatiš ili odgodiš. Ako novi korak dvaput zaredom ne ide, nudi se povratak na prethodnu dozu.</p>' +
      '<div class="bul">Šipka, landmine i bučice: sljedeća težina je najmanji korak koji možeš složiti (šipka ' + up(Math.max(2 * pk, 2.5), Math.max(2 * pk, 5)) + '; landmine ' + up(Math.max(pk, 2.5), Math.max(pk, 5)) + '; bučice sljedeći par). Ako bi taj skok bio veći od oko 10 % tvog procijenjenog maksimuma, prvo raste broj ponavljanja, a veća težina dolazi kad skok postane dovoljno mali, uz manje ponavljanja. Najmanje ploče biraš u Doziranju.</div>' +
      '<div class="bul">Bučice: kg je težina jedne bučice. Skokovi među tvojim parovima (2,5–20 kg) su veliki, pa sljedeći par dolazi tek kad ga po procjeni možeš podići barem 4–5 puta, a ponavljanja zato ponekad narastu i iznad gornje granice.</div>' +
      '<div class="bul">Girja (20 kg): +1 ponavljanje do gornje granice, zatim serija više (najviše 5) s početnim brojem ponavljanja, pa teža varijanta.</div>' +
      '<div class="bul">TRX i vlastita težina: +1 ponavljanje do gornje granice, zatim teža varijanta. Vježbe na vrijeme: +5 s do 60 s (izdržaji u rehabu od 2. faze do 30 s), zatim teža varijanta.</div>' +
      '<div class="bul">Skokovi i bacanja: ne dodaju se ni ponavljanja ni kilogrami; kad sve odradiš, dobiješ prijedlog za težu varijantu ili višu kutiju.</div>' +
      '<p style="margin:0">Gornja granica je vrh raspona cilja iz Doziranja, a bez cilja početni broj ponavljanja + 4 (najviše 20). Ako ti je zadnja serija bila na samoj granici, prijedlog odgodi („Još ne”). ACSM preporučuje povećanje opterećenja od 2–10 %, manje za male mišićne skupine. Treninzi iz programa (npr. TAE) se samo bilježe, jer njihove doze određuju tjedni programa.</p>' +
      '<p style="margin:0;font-size:13px;line-height:19px;color:var(--text-2)">Izvori: ' + PROG_REFS.map(r => '<a href="'+esc(r.url)+'" target="_blank" rel="noopener">'+esc(r.t)+'</a>').join(' · ') + '</p></div>').replace(/(\d) (?=kg\b|s\b|%|puta\b)/g, '$1&nbsp;');   // a number stays on the line of its unit
  } else if (s.kind === 'data') {
    const pk = S.pack, nPh = pk ? (pk.ids || []).length : 0, last = lsGet('mt.lastBackupAt', 0), undoAt = lsGet('mt.beforeImportAt', 0), bad = lsGet('mt.badStore', null);
    const small = t => '<span style="display:block;margin-top:2px;font-size:13px;font-weight:400;color:var(--text-2)">' + esc(t) + '</span>';
    const parts = pk ? packParts(pk) : [], hasProg = pk && Object.values(S.prog).some(g => g.pack === pk.id);
    body = '<h3>Moji podaci</h3>' +
      '<p style="margin:0 0 12px;font-size:14px;line-height:21px;color:var(--text-2)">Vježbe, protokoli, plan, povijest i postavke spremaju se samo na ovom mobitelu. Povremeno izvezi kopiju i spremi je u Datoteke (npr. iCloud Drive) da ih ne izgubiš. Videi i slike nisu dio kopije.</p>' +
      '<button class="opt" data-a="exportData"><span>Izvezi sigurnosnu kopiju' + small('Zadnja kopija: ' + (last ? shortDate(last) : 'još nijedna')) + '</span></button>' +
      '<label class="opt" for="importFile" style="cursor:pointer;box-sizing:border-box"><span>Uvezi kopiju</span></label><input id="importFile" class="vsr" type="file" accept="application/json,.json">' +
      (undoAt ? '<button class="opt" data-a="undoRestore"><span>Vrati podatke od prije uvoza' + small('Kopija je uvezena ' + shortDate(undoAt)) + '</span></button>' : '') +
      '<label class="opt" for="packFile" style="cursor:pointer;box-sizing:border-box"><span>' + (s._busy ? 'Uvozim slike…' : 'Uvezi paket slika') + (pk && lsGet('mt.packOld', 0) ? small('Kopija je vratila stariju verziju paketa: uvezi ga ponovno.') : '') + '</span><span style="color:var(--text-2);font-size:14px">' + (pk ? nPh + ' ' + plural(nPh, 'slika', 'slike', 'slika') : 'privatno') + '</span></label><input id="packFile" class="vsr" type="file" accept=".json,.mtpack,application/json">' +
      (pk && s._confirm ? '<div class="lift warn" style="margin:12px 0 4px"><div class="top"><b>' + (hasProg ? 'Ukloniti TAE paket?' : 'Ukloniti paket slika?') + '</b></div><div class="why" style="color:var(--text-body)">' +
          esc('Brišu se ' + (parts.length > 1 ? parts.slice(0, -1).join(', ') + ' i ' + parts[parts.length - 1] : parts[0] || 'samo podaci paketa') + '. Povijest treninga ostaje.') + '</div>' +
          '<div class="acts"><button class="bt amber" data-a="packRemove">Ukloni paket</button><button class="bt ghost" data-a="packKeep">Odustani</button></div></div>'
        : pk ? '<button class="opt" data-a="packRemove" style="color:var(--danger)"><span>' + (hasProg ? 'Ukloni TAE paket (slike i program)' : 'Ukloni paket slika') + '</span></button>' : '') +
      (bad ? '<button class="opt" data-a="exportBad"><span>Spremi oštećene podatke' + small('Nisu se mogli pročitati ' + shortDate(bad.at)) + '</span></button>' : '') +
      '<p style="margin:14px 0 0;font-size:13px;color:var(--text-2)">' + esc(dataCounts(storeObj())) + '</p>' +
      '<p style="margin:6px 0 0;font-size:13px;color:var(--text-2)">Verzija ' + APP_VERSION + '</p>';
  } else if (s.kind === 'restore') {
    // what a backup (or the data from before the last import) would replace, side by side, before anything changes
    const d = s.d, when = s.undo ? s.at : Date.parse(d.exportedAt) || 0;
    const lost = lostEntries(S.log, d.log), none = !s.undo && nothingOwn();
    const box = (title, x) => '<div class="opt" style="flex-direction:column;align-items:flex-start;justify-content:center;gap:2px;padding:10px 4px;box-sizing:border-box"><b style="font-size:15px">' + esc(title) + '</b><span style="font-size:14px;color:var(--text-2)">' + esc(dataCounts(x)) + '</span></div>';
    body = '<h3>' + (s.undo ? 'Vratiti podatke od prije uvoza?' : 'Vratiti podatke iz kopije?') + '</h3>' +
      box(s.undo ? 'Podaci od prije uvoza' + (when ? ' (' + shortDate(when) + ')' : '') : 'Kopija' + (when ? ' od ' + shortDate(when, true) : ''), d) + box('Sada na mobitelu', storeObj()) +
      (lost.length ? '<div class="lift warn" style="margin:12px 0 0"><div class="why" style="color:var(--text-body)">' + esc((s.undo ? 'Ovo nije u podacima od prije uvoza' : 'Ovo nije u kopiji') + ' i nestat će iz povijesti ako zamijeniš podatke: ' + lostText(lost) + '.') + '</div></div>' : '') +
      '<p style="margin:12px 0 14px;font-size:13px;line-height:19px;color:var(--text-2)">' + (s.undo ? 'Sve na mobitelu zamijenit će se podacima od prije uvoza.' : 'Sve na mobitelu (vježbe, protokoli, plan, povijest i postavke) zamijenit će se kopijom. Slike i videi ostaju.' + (none ? '' : ' Sadašnje podatke možeš vratiti u Mojim podacima dok ne uvezeš sljedeću kopiju.')) + '</p>' +
      (s.noUndo ? '<p style="margin:0 0 14px;font-size:14px;line-height:20px;color:var(--danger)">Sadašnje podatke nije moguće sačuvati za povratak. Ako ih zamijeniš, ne možeš ih vratiti.</p>' : '') +
      '<div class="seg"><button class="btn sec" data-a="sheetDone" style="height:48px">Odustani</button><button class="btn" data-a="restoreApply" style="height:48px;font-size:16px"' + (s._busy ? ' disabled' : '') + '>' + (s.noUndo ? 'Ipak zamijeni' : 'Zamijeni podatke') + '</button></div>';
  } else if (s.kind === 'settings') {
    const o = (k, vals, unit) => '<div class="chips wrap" style="margin:8px 0 14px">' + vals.map(v => '<button class="chip" data-a="setSetting" data-k="'+k+'" data-v="'+v+'" aria-pressed="'+(S.settings[k]===v)+'">'+v+' '+unit+'</button>').join('') + '</div>';
    const note = t => '<p style="margin:0 0 10px;font-size:13px;line-height:19px;color:var(--text-2)">' + t + '</p>';
    body = '<h3>Postavke playera</h3>' +
      '<div class="prow"><span class="k">Zvučni signali</span><button class="switch" role="switch" data-a="toggleSound" aria-checked="'+S.settings.sound+'" aria-label="Zvučni signali"></button></div>' +
      ('audioSession' in navigator ? '<div class="prow"><span class="k">Signali i kad je iPhone na nečujnom</span><button class="switch" role="switch" data-a="toggleSilent" aria-checked="'+(S.settings.silentOk === true)+'" aria-label="Signali i kad je iPhone na nečujnom"></button></div>' + note('Glazba iz druge aplikacije tada se može pauzirati.')
        : /iPhone|iPad|iPod/.test(navigator.userAgent) ? note('Kad je iPhone na nečujnom, zvučni signali se ne čuju.') : '') +
      ('vibrate' in navigator ? '' : note('Ovaj uređaj ne podržava vibraciju, pa su signali samo zvučni.')) +
      (wakeOk ? '' : note('Ovaj uređaj ne može držati ekran upaljenim tijekom treninga. Na iPhoneu produlji automatsko zaključavanje: Postavke › Zaslon i svjetlina › Automatsko zaključavanje.')) +
      '<p class="label" style="padding:12px 0 0">Promjena strane</p>' + o('switchSec', [5,10,15], 's') +
      '<p class="label" style="padding:0">Pauza između vježbi</p>' + o('transSec', [5,10,15,20], 's') +
      '<p style="font-size:13px;color:var(--text-2);margin:0">Nove postavke vrijede od sljedećeg pokretanja.</p>';
  } else if (s.kind === 'quit') {
    const any = P && anyDone();
    body = '<h3>Prekinuti trening?</h3>' +
      '<p style="margin:0 0 16px;font-size:15px;line-height:22px;color:var(--text-body)">' + (any ? 'Ono što si dosad odradio možeš spremiti u povijest.' + (P.mode === 'ex' ? ' Vježbe koje nisi odradio ne računaju se u napredak.' : '') : 'Još ništa nije odrađeno do kraja, pa nema što spremiti.') + '</p>' +
      (any ? '<button class="btn" data-a="quitSave">Spremi odrađeno i izađi</button>' : '') +
      '<button class="btn danger" data-a="quitDiscard" style="margin-top:10px">Izađi bez spremanja</button>' +
      '<button class="btn sec" data-a="quitResume" style="margin-top:10px;height:48px">Nastavi trening</button>';
  } else if (s.kind === 'resume') {
    const r = s.s, m = Math.round((Date.now() - (r.at || 0)) / 60000), d = new Date(r.finishedAt || r.at || Date.now());
    const any = Object.keys(r.doneSteps || {}).length > 0;
    body = r.done
      ? '<h3>Trening nije spremljen</h3><p style="margin:0 0 16px;font-size:15px;line-height:22px;color:var(--text-body)">„' + esc(r.title) + '” od ' + d.getDate() + '. ' + (d.getMonth() + 1) + '. je završen, ali nije spremljen u povijest.</p>' +
        '<button class="btn" data-a="resumeGo">Pregledaj i spremi</button><button class="btn danger" data-a="resumeDrop" style="margin-top:10px">Odbaci</button>'
      : '<h3>Nastaviti trening?</h3><p style="margin:0 0 16px;font-size:15px;line-height:22px;color:var(--text-body)">„' + esc(r.title) + '” je ostao nedovršen (' + (m < 1 ? 'maloprije' : m < 60 ? 'prije ' + m + ' min' : 'prije ' + Math.round(m / 60) + ' h') + ').</p>' +
        '<button class="btn" data-a="resumeGo">Nastavi trening</button>' + (any ? '<button class="btn sec" data-a="resumeSave" style="margin-top:10px;height:48px">Spremi odrađeno</button>' : '') +
        '<button class="btn danger" data-a="resumeDrop" style="margin-top:10px">Odbaci</button>';
  } else if (s.kind === 'playList') {
    const groups = [];
    P.steps.forEach((st, k) => { if (!isWork(st)) return; if (!groups.some(g => g.g === st.g)) groups.push({ g: st.g, k, lab: st.ss ? st.ss.L + st.ss.k : String(st.g + 1) + '.', name: P.mode === 'field' ? (st.b ? st.b.label_hr : '') : (st.e ? st.e.name : '') }); });
    const cur = (P.steps[P.i] || {}).g;
    body = '<h3>' + esc(P.title) + '</h3>' + groups.map(g => '<button class="opt" data-a="jumpTo" data-k="'+g.k+'"><span>'+esc(g.lab)+' '+esc(g.name)+'</span>'+(g.g===cur?'<span class="tag">sada</span>':'')+'</button>').join('');
  }
  // the dialog is named by its title, which takes focus when the sheet opens (see refocus)
  const named = body.indexOf('<h3') !== -1; if (named) body = body.replace('<h3', '<h3 id="sheet-h" tabindex="-1"');
  return '<div class="sheet-bg" data-a="sheetClose"><div class="sheet gut" data-stop="1" role="dialog" aria-modal="true"' + (named ? ' aria-labelledby="sheet-h"' : '') + '><div class="grab"></div>' + body + '</div></div>';
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
  if (t.v === 'play' && P) playAfter();
  if (app.querySelector('g.runner')) startRunners();
  if (t.v === 'build' || t.v === 'exEdit') app.querySelectorAll('textarea.input').forEach(grow);
}

/* ---------- actions ---------- */
function newExDraft(){
  return { id: uid('e'), name:'', alt:'', cat:'Snaga', phase:null, cord:'', zones:[], equip:[], measure:'sets', sec:30, sets:3, reps:10, rest:60, kg:0, sides:false, equipment:'', feel:'', stepsText:'', note:'', video:'', media:null, mediaType:null, fav:false };
}
const A = {
  tab: d => setTab(d.tab),
  back: () => {
    S.planAsk = false;   // the plan's restart question closes when you leave or come back to the field list
    // leaving the builder or the exercise editor with unsaved changes asks first
    if (S.draft && (top().v === 'build' || top().v === 'exEdit') && draftSig(S.draft) !== S.draftSig) { S.sheet = { kind:'leave' }; render(); return; }
    dropDraftMedia();
    if (S.below && top().v === 'exEdit') { S.draft = S.below.draft; S.draftSig = S.below.sig; S.below = null; back(); return; }
    S.draft = null; S.draftSig = null; S.below = null; S.pick = null; back();
  },
  leaveSave: () => { S.sheet = null; render(); if (top().v === 'build') A.savePr({}); else A.saveEx(); },
  leaveDiscard: () => { S.sheet = null; if (S.draft) S.draftSig = draftSig(S.draft); A.back(); },
  dot: d => { const car = document.getElementById('car'); const c = car && car.children[+d.i]; if (c) c.scrollIntoView({ behavior:'smooth', inline:'center', block:'nearest' }); },
  libCat: d => { S.lib.cat = d.cat; lsSet('mt.libcat', d.cat); if (top().v !== 'library') { S.tab = 'library'; S.stack = [{v:'library'}]; } render(); },
  fieldList: () => { S.planAsk = false; go({ v:'fieldList' }); },   // the inline restart question never waits for a later visit
  openField: d => go({ v:'field', id:d.id }),
  planAsk: () => { S.planAsk = true; render(); },
  planKeep: () => { S.planAsk = false; render(); },
  planReset: () => { S.planAsk = false; S.settings.preFrom = Date.now(); lsSet('mt.settings', S.settings); render(); toast('Plan opet kreće od 1. tjedna.'); },
  masSave: () => { const m = Math.round(+S.masDraft || 0); if (!masOk(m)) { toast('Upiši metre u 5 minuta, od 600 do 2400 m.', true); return; }
    const e = masEntry(m); S.log.unshift(e); if (!persist()) { S.log.splice(S.log.indexOf(e), 1); return; } S.masDraft = 0; render(); toast('Spremljeno: MAS ' + masTxt(e.value) + ' m/s.'); },
  openPr: d => go({ v:'pr', id:d.id }),
  openProg: d => go({ v:'program', id:d.id }),
  openEx: d => go({ v:'ex', id:d.id, dose:0 }),
  dose: d => { top().dose = +d.i; render(); },
  // the tab row stays where it was on the screen (a row above the top comes back to 12 px under it): a shorter tab gets a panel
  // tall enough for that, so the page never bottoms out and drops the row under the finger; the next render lets it go
  exTab: d => { S.exTab = exTabOf(d.v); const v = app.querySelector('.view'), tl = v && v.querySelector('.extabs');
    const y = tl ? tl.getBoundingClientRect().top - v.getBoundingClientRect().top : 0; render();
    const v2 = app.querySelector('.view'), t2 = v2 && v2.querySelector('.extabs'), pn = v2 && v2.querySelector('#expanel'); if (!tl || !t2 || !pn) return;
    const want = Math.max(0, Math.round(t2.getBoundingClientRect().top - v2.getBoundingClientRect().top + v2.scrollTop - (y < 0 ? 12 : y))), short = want - (v2.scrollHeight - v2.clientHeight);
    if (short > 0) pn.style.minHeight = (parseFloat(getComputedStyle(pn).height) + short) + 'px';
    v2.scrollTop = want; },
  credit: d => { S.sheet = { kind:'credit', id: d.id }; render(); },
  mediaSwap: d => { S.alt = S.alt || {}; S.alt[d.id] = (S.alt[d.id] || 0) + 1; render(); },
  fav: async d => { const e = S.ex[d.id]; if (!e) return; const n = Object.assign({}, e, { fav: !e.fav }); delete n.id; e.fav = n.fav; render(); await save('exercises', d.id, n); },
  // a new exercise made while picking exercises for a protocol: the protocol being built waits underneath
  newEx: () => { S.below = S.pick && S.draft && top().v === 'library' ? { draft: S.draft, sig: S.draftSig } : null; S.draft = newExDraft(); S.draftSig = draftSig(S.draft); go({ v:'exEdit', id: S.draft.id }); },
  editEx: d => { const e = S.ex[d.id]; if (!e) return; S.draft = Object.assign(newExDraft(), clone(e), { stepsText: (e.steps||[]).join('\n'), equip: exEquip(e).slice(), alt: e.alt || '', video: e.video || '', runMText: e.runM > 0 ? String(e.runM).replace('.', ',') : '' }); S.draftSig = draftSig(S.draft); go({ v:'exEdit', id: S.draft.id }); },
  dset: d => { const dr = S.draft; let v = d.v; if (d.k === 'phase') v = +v || null; dr[d.k] = v; if (d.k === 'cat' && v !== 'Rehab' && v !== 'Mobilnost') dr.phase = null; if (d.k === 'cat' && v === 'Rehab' && !dr.phase) dr.phase = 1; if (d.k === 'measure' && v === 'time' && dr.sets > 3) dr.sets = 1; render(); },
  dzone: d => { const z = S.draft.zones = S.draft.zones || []; const i = z.indexOf(d.v); if (i === -1) z.push(d.v); else z.splice(i,1); render(); },
  dflag: d => { S.draft[d.k] = !S.draft[d.k]; render(); },
  dstep: d => { const k = d.k, dr = S.draft, dir = +d.d; if (k === 'kg') { dr.kg = kgStep(dr, dr.kg, dir); render(); return; } const step = { sec:5, sets:1, reps:1, rest:15 }[k]; const min = { sec:5, sets:1, reps:1, rest:0 }[k]; const max = { sec:600, sets:10, reps:60, rest:300 }[k]; dr[k] = Math.min(max, Math.max(min, (+dr[k]||0) + dir*step)); render(); },
  mediaRemove: () => { const d = S.draft; if (!d || d._uploading) return; if (d.media !== ((S.ex[d.id] || {}).media)) dropMedia(d.media); d.media = null; d.mediaType = null; render(); },
  saveEx: async () => {
    const d = S.draft; if (!d) return;
    if (d._uploading) { toast(d._uploading === 'image' ? 'Pričekaj da se slika spremi.' : 'Pričekaj da se video spremi.'); return; }
    const name = (d.name||'').trim();
    if (!name) { toast('Upiši naziv vježbe.'); const el = document.getElementById('f-name'); if (el) el.focus(); return; }
    const lines = t => (t||'').split('\n').map(s => s.trim()).filter(Boolean);
    // a link typed without https:// (youtu.be/…) is completed; anything that is not a web address is not saved silently
    const v = (d.video||'').trim();
    const video = !v || /^https?:\/\/\S+$/i.test(v) ? v : /^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(v) ? 'https://' + v : null;
    if (video === null) { toast('Link na video nije spremljen: upiši cijelu adresu (https://…).'); const el = document.getElementById('f-video'); if (el) el.focus(); return; }
    const prev = S.ex[d.id];
    const body = { name, alt: (d.alt||'').trim(), cat:d.cat, phase: (d.cat === 'Rehab' || d.cat === 'Mobilnost') && d.phase ? d.phase : null, cord: d.cord || '', zones: d.zones||[], equip: (d.equip||[]).slice(), measure: d.measure, sec: d.sec, sets: d.sets, reps: d.reps, rest: d.rest, kg: d.kg||0, sides: !!d.sides,
      equipment: (d.equipment||'').trim(), feel: (d.feel||'').trim(), steps: lines(d.stepsText), mistakes: (d.mistakes || []).slice(), note: (d.note||'').trim(),
      video, videoTitle: prev && video === (prev.video || '') ? prev.videoTitle : undefined,
      media: d.media || null, mediaType: d.mediaType || null, fav: !!d.fav, order: d.order || 500, source: prev ? prev.source : (d.source || null), sourceTitle: prev ? prev.sourceTitle : (d.sourceTitle || null) };
    // an own running drill (Kondicija): metres per rep and the intensity; an empty distance removes both
    if (d.cat === 'Kondicija' && !seedEx(d.id) && !d.pack) { const rm = Math.round(+String(d.runMText || '').replace(',', '.') * 10) / 10;
      if (rm > 0 && rm <= 5000) { body.runM = rm; body.runInt = RUN_INT.indexOf(d.runInt) !== -1 ? d.runInt : 'umjereno'; }
      else if ((d.runMText || '').trim()) { toast('Udaljenost upiši u metrima, npr. 30.', true); const el = document.getElementById('f-runm'); if (el) el.focus(); return; }
      else { body.runM = null; body.runInt = null; } }
    // what you did not change stays exactly as stored, so an unchanged exercise (or one that only got your own photo or video,
    // which the fingerprint skips) still receives the app's improved instructions
    if (prev) {
      const same = (a, b) => JSON.stringify(a == null || a === '' ? null : a) === JSON.stringify(b == null || b === '' ? null : b);
      Object.keys(body).forEach(k => { if (same(body[k], prev[k])) { if (prev[k] === undefined) delete body[k]; else body[k] = prev[k]; } });
      Object.keys(prev).forEach(k => { if (k !== 'id' && k !== 'pack' && !(k in body)) body[k] = prev[k]; });
    }
    if (body.video === '' && (!prev || prev.video === undefined)) delete body.video;
    if (body.videoTitle === undefined) delete body.videoTitle;
    // a pack drill saved unchanged, or with only your own photo or video, stays the pack's: a newer pack version still updates it
    if (prev && prev.pack && contentHash(Object.assign({}, body, { pack: prev.pack })) === contentHash(prev)) body.pack = prev.pack;
    const ok = await save('exercises', d.id, body); if (!ok) return;
    if (prev && prev.media && prev.media !== body.media) dropMedia(prev.media);
    S.ex[d.id] = Object.assign({ id: d.id }, body);
    const id = d.id; S.draft = null; S.draftSig = null; S.stack.pop();
    if (S.below && S.pick && top().v === 'library') { S.draft = S.below.draft; S.draftSig = S.below.sig; S.below = null; if (S.pick.ids.indexOf(id) === -1) S.pick.ids.push(id); render(); toast('Vježba je spremljena i odabrana.'); return; }
    if (top().v !== 'ex' || top().id !== id) S.stack.push({ v:'ex', id, dose:0 });
    render(); toast('Vježba je spremljena.');
  },
  delEx: async () => {
    const d = S.draft; if (!d._confirmDel) { d._confirmDel = true; render(); return; }
    const inUse = Object.values(S.pr).filter(p => (p.items||[]).some(it => it.exId === d.id));
    const own = [S.ex[d.id] && S.ex[d.id].media, d.media].filter((m, i, a) => m && a.indexOf(m) === i);
    const ok = await remove('exercises', d.id); if (!ok) return;
    for (const p of inUse) { const n = clone(p); delete n.id; dropItems(n.items, it => it.exId === d.id); await save('protocols', p.id, n); }
    own.forEach(dropMedia);
    delete S.ex[d.id]; S.draft = null; S.draftSig = null;
    while (S.stack.length > 1 && (top().v === 'exEdit' || (top().v === 'ex' && top().id === d.id))) S.stack.pop();
    render(); toast('Vježba je obrisana.');
  },
  addTo: d => { S.sheet = { kind:'addTo', exId: d.id }; render(); },
  addToPick: async d => {
    const p = S.pr[d.id], e = S.ex[S.sheet.exId]; if (!p || !e) return;
    const n = clone(p); delete n.id; n.items = n.items || []; const it = newItem(e), eff = secOf(n.items); if (eff[eff.length - 1]) it.section = eff[eff.length - 1];
    n.items.push(it); n.updatedAt = Date.now();
    S.sheet = null; render();
    if (await save('protocols', p.id, n)) toast('Dodano u „' + p.name + '”.');
  },
  addToNew: () => { const e = S.ex[S.sheet.exId]; S.sheet = null; S.draft = { id: uid('p'), name:'', desc:'', items: e ? [newItem(e)] : [], _open: null }; S.draftSig = draftSig(S.draft); go({ v:'build', id: S.draft.id }); },
  newPr: () => { S.draft = { id: uid('p'), name:'', desc:'', items: [], _open: null }; S.draftSig = draftSig(S.draft); go({ v:'build', id: S.draft.id }); },
  editPr: d => { const p = S.pr[d.id]; if (!p) return; S.draft = Object.assign(clone(p), { _open: null }); S.draft.items = S.draft.items || []; S.draft.items.forEach(it => { it._d0 = doseSig(it); }); S.draftSig = draftSig(S.draft); go({ v:'build', id: S.draft.id }); },
  itOpen: d => { const i = +d.i; S.draft._open = S.draft._open === i ? null : i; render(); },
  iset: d => { const it = S.draft.items[S.draft._open]; it[d.k] = d.v; render(); },
  istep: d => {
    const items = S.draft.items, it = items[+d.i], k = d.k, dir = +d.d; if (!it) return;
    if (k === 'kg') { it.kg = kgStep(S.ex[it.exId], it.kg, dir); render(); return; }
    const step = { sec:5, sets:1, reps:1, rest:15 }[k]; const min = { sec:5, sets:1, reps:1, rest:0 }[k]; const max = { sec:600, sets:10, reps:60, rest:300 }[k];
    const before = +it[k] || (k === 'sets' ? 1 : 0);
    it[k] = Math.min(max, Math.max(min, Math.round(((+it[k]||0) + dir*step) * 100) / 100));
    if (k === 'reps') { delete it.r0; delete it.r1; if (Array.isArray(it.repsList)) it.repsList = it.repsList.map(r => Math.min(60, Math.max(1, r + dir))); }
    if (k === 'sets') {
      // a superset shares its rounds only while all its exercises have the same number of sets (Hip thrust 3 + Nordic 2 stay apart)
      if (it.ss && it.sets !== before && items.every(x => x === it || x.ss !== it.ss || (x.sets || 1) === before)) items.forEach(x => { if (x.ss === it.ss) x.sets = it.sets; });
      items.forEach(x => { if (x === it || (it.ss && x.ss === it.ss)) fitReps(x); });
    }
    render();
  },
  // different reps in each set, e.g. 6/5/5/4
  irepsplit: d => { const it = S.draft.items[+d.i]; if (!it) return; if (Array.isArray(it.repsList)) delete it.repsList; else it.repsList = Array.from({ length: it.sets || 1 }, () => it.reps || 10); render(); },
  isetrep: d => {
    const it = S.draft.items[+d.i], s = +d.s; if (!it) return;
    const n = it.sets || 1, list = Array.from({ length: n }, (_, k) => repsOf(it, k + 1));
    list[s] = Math.min(60, Math.max(1, (list[s] || 10) + (+d.d)));
    it.repsList = list; it.reps = Math.max.apply(null, list); delete it.r0; delete it.r1; render();
  },
  iflag: d => { const it = S.draft.items[+d.i]; it.sides = !it.sides; render(); },
  imove: d => {
    const i = +d.i, dir = +d.d, j = i + dir, items = S.draft.items; if (j < 0 || j >= items.length) return;
    const eff = secOf(items), gs = groupsOf(items), gOf = k => gs.find(g => g.idx.indexOf(k) !== -1), gi = gOf(i), gj = gOf(j);
    const swap = () => { const t = items[i]; items[i] = items[j]; items[j] = t; S.draft._open = j; };
    regroup(items, () => {
      // one step at a time, and nothing else falls apart: at a part title the exercise first joins that part in place;
      // inside a superset it changes places with its partner; at a superset's edge it first leaves the superset in place;
      // a single exercise passes a whole superset in one step
      if (eff[i] !== eff[j]) { eff[i] = eff[j]; delete items[i].ss; S.draft._open = i; }
      else if (gi.ss && gi === gj) swap();
      else if (gi.ss) { delete items[i].ss; S.draft._open = i; }
      else if (gj.ss) { const to = dir > 0 ? gj.idx[gj.idx.length - 1] : gj.idx[0]; items.splice(to, 0, items.splice(i, 1)[0]); eff.splice(to, 0, eff.splice(i, 1)[0]); S.draft._open = to; }
      else swap();
    });
    if (eff.some(Boolean)) secSet(items, eff);
    render();
  },
  idel: d => { dropItems(S.draft.items, (it, k) => k === +d.i); S.draft._open = null; render(); },
  pickStart: () => { S.pick = { ids: [] }; S.lib.q = ''; S.stack.push({ v:'library' }); render(); },
  pickToggle: d => { const ids = S.pick.ids, i = ids.indexOf(d.id); if (i === -1) ids.push(d.id); else ids.splice(i,1); const list = document.getElementById('liblist'); const v = app.querySelector('.view'); const st = v ? v.scrollTop : 0; render(); const v2 = app.querySelector('.view'); if (v2) v2.scrollTop = st; },
  pickCancel: () => { S.pick = null; S.lib.q = ''; S.stack.pop(); render(); },
  pickDone: () => {
    const ids = S.pick.ids.slice(); S.pick = null; S.lib.q = ''; S.stack.pop();
    const items = S.draft.items, eff = secOf(items), s = eff[eff.length - 1]; let n = 0;
    ids.forEach(id => { const e = S.ex[id]; if (!e) return; const it = newItem(e); if (s) it.section = s; items.push(it); n++; });
    render(); toast(plural(n, 'Dodana je ', 'Dodane su ', 'Dodano je ') + nVj(n) + '.');
  },
  savePr: async d => {
    const dr = S.draft; const name = (dr.name||'').trim();
    if (!name) { toast('Upiši naziv protokola.'); const el = document.getElementById('p-name'); if (el) el.focus(); return; }
    if (!dr.items.length) { toast('Dodaj barem jednu vježbu.'); return; }
    const isNew = !S.pr[dr.id];
    const keepIf = (o, it, ks) => { ks.forEach(k => { if (it[k] != null && it[k] !== '') o[k] = it[k]; }); return o; };
    // a new protocol (also a copy) and every dose you changed by hand start counting "sessions in a row" from zero
    const fresh = (o, it) => { if (isNew || it._d0 !== doseSig(it)) PROG_STATE.forEach(k => { delete o[k]; }); return o; };
    const body = { name, desc: (dr.desc||'').trim(), items: normGroups(dr.items).map(it => fresh(keepIf({ exId: it.exId, measure: it.measure, sec: it.sec, sets: it.sets, reps: it.reps, rest: it.rest, sides: !!it.sides, kg: it.kg||0 }, it, ['ss','easy','up','r0','r1','cap','section','note','repsList','repSec','ok','fail','prev','snoozeOk']), it)), updatedAt: Date.now(), home: dr.home || null, tag: dr.tag || null, days: dr.days || [] };
    ['program','week','slot','pack','goal','goalSkip','kgSkip'].forEach(k => { if (dr[k] != null) body[k] = dr[k]; });
    if (body.program) delete body.days;   // a programme session is planned by the programme's days
    const ok = await save('protocols', dr.id, body); if (!ok) return;
    S.pr[dr.id] = Object.assign({ id: dr.id }, body);
    const id = dr.id; S.draft = null; S.draftSig = null; S.stack.pop();
    if (top().v !== 'pr' || top().id !== id) S.stack.push({ v:'pr', id });
    if (d.start) { A.startPr({ id }); return; }
    render(); toast('Protokol je spremljen.');
  },
  delPr: async () => {
    const d = S.draft; if (!d._confirmDel) { d._confirmDel = true; render(); return; }
    if (!(await remove('protocols', d.id))) return;
    delete S.pr[d.id]; S.draft = null; S.draftSig = null; S.stack = [{ v: S.tab }]; render(); toast('Protokol je obrisan.');
  },
  startPr: d => { const p = S.pr[d.id]; if (!p || !(p.items||[]).length) return; startPlayer({ mode:'ex', title: p.name, items: p.items, steps: stepsFromItems(p.items), ref: { kind:'protocol', id: p.id } }); },
  playEx: d => { const e = S.ex[d.id]; if (!e) return; const o = doseOptions(e)[top().dose || 0]; const items = [o ? o.it : exItem(e)]; startPlayer({ mode:'ex', title: e.name, items, steps: stepsFromItems(items), ref: { kind:'exercise', id: e.id } }); },
  // dose 'season': about 2/3 of the sets (fieldDose), the steps built the same way
  startField: d => { const f = S.field[d.id]; if (!f) return; const sz = d.dose === 'season' && fieldLoad(f).type !== 'test';
    startPlayer({ mode:'field', title: f.name_hr, f, dose: sz ? 'season' : 'full', steps: stepsFromField(sz ? fieldDose(f) : f), ref: { kind:'field', id: f.id } }); },
  ring: () => tapRing(),
  jump: d => jump(+d.d),
  jumpTo: d => { S.sheet = null; ensureAudio(); enterStep(landAt(+d.k)); P.paused = false; render(); },
  playList: () => { S.sheet = { kind:'playList' }; render(); },
  playSettings: () => { S.sheet = { kind:'settings' }; render(); },
  dataSheet: () => {
    S.sheet = { kind:'data' }; render();
    const bad = lsGet('mt.badStore', null);   // the damaged data is read now, so saving it later is one tap
    if (bad && !S.badRaw) {
      if (bad.key) IDB.get(bad.key).then(r => { if (typeof r === 'string') S.badRaw = r; }).catch(() => {});
      else try { S.badRaw = localStorage.getItem('mt.data.v1.neispravno') || null; } catch(e){}
    }
  },
  // the file is made at once so the share sheet opens within the tap; success is reported only when it happened
  exportData: async () => {
    let body; try { body = JSON.stringify(backupObject(), null, 1); } catch(e){ toast(EXPORT_MSG.failed, true); return; }
    const r = await shareOrDownload('moj-trening-kopija-' + fileDate(Date.now()) + '.json', body);
    if (r === 'shared' || r === 'downloaded') { lsSet('mt.lastBackupAt', Date.now()); try { localStorage.removeItem('mt.backupLater'); } catch(e){} }
    if (!FORM_VIEWS[top().v]) render();
    if (r !== 'busy') toast(EXPORT_MSG[r], r === 'failed');
  },
  exportBad: async () => {
    if (!S.badRaw) { toast('Oštećeni podaci se još učitavaju. Pokušaj ponovno za trenutak.'); return; }
    const r = await shareOrDownload('moj-trening-osteceni-podaci-' + fileDate(Date.now()) + '.json', S.badRaw);
    if (r !== 'busy') toast(r === 'shared' ? 'Oštećeni podaci su spremljeni.' : r === 'downloaded' ? 'Oštećeni podaci su preuzeti: nađi ih u mapi Preuzimanja.' : EXPORT_MSG[r], r === 'failed');
  },
  // replaces everything only after the preview sheet; what was on the phone is kept in IndexedDB for "Vrati podatke od prije uvoza"
  restoreApply: async () => {
    const s = S.sheet; if (!s || s.kind !== 'restore' || s._busy) return;
    s._busy = true; render();
    const before = { data: JSON.stringify(storeObj()), settings: clone(S.settings), at: Date.now() };   // what is on the screen now (also a change the phone could not store)
    const none = !s.undo && nothingOwn();   // a fresh start keeps no way back
    if (!s.undo && !s.noUndo && !none) { try { await IDB.put('before-import', before); } catch(e){ s._busy = false; s.noUndo = true; render(); return; } }
    const d = s.d;
    // the backup holds the pack's drills, sessions and programme as they were when it was made: after a newer pack version
    // it brings the older one back, so he is asked to import the pack again (its update keeps what is his)
    const pk = !s.undo && S.pack && S.pack.id ? S.pack : null;
    const packOld = !!pk && (pk.at || 0) > (Date.parse(d.exportedAt) || 0) && [['exercises', S.ex, contentHash], ['protocols', S.pr, mtStructHash], ['programs', S.prog, contentHash]]
      .some(([c, m, fp]) => Object.values(m).some(x => { const y = (d[c] || {})[x.id]; return x.pack === pk.id && !!y && y.pack === pk.id && fp(y) !== fp(x); }));
    if (pk) [['exercises', S.ex], ['protocols', S.pr], ['programs', S.prog]].forEach(([c, m]) => {   // what the pack brought and the backup does not have stays
      d[c] = d[c] || {}; Object.values(m).forEach(x => { if (x.pack === pk.id && !d[c][x.id]) d[c][x.id] = clone(x); }); });
    const settings0 = S.settings;
    applyData(d); S._deleted = (d._deleted || []).slice(); mergeSeed(window.SEED || {}); repairCopies();
    if (s.undo) S.settings = Object.assign({}, SETTINGS_BASE, cleanSettings(s.settings)); else if (d.settings) S.settings = Object.assign({}, S.settings, d.settings);
    if (!persist()) {
      try { const o = cleanData(JSON.parse(before.data)); applyData(o); S._deleted = o._deleted; } catch(e){}
      S.settings = settings0; S.saveFailed = false; S.sheet = null; render();
      toast('Podaci nisu zamijenjeni: memorija aplikacije je puna. Na mobitelu je sve ostalo kao prije.', true); return;
    }
    lsSet('mt.settings', S.settings);
    if (s.undo) { try { await IDB.del('before-import'); } catch(e){} try { localStorage.removeItem('mt.beforeImportAt'); } catch(e){} }
    else { if (none) { try { await IDB.del('before-import'); } catch(e){} } if (s.noUndo || none) { try { localStorage.removeItem('mt.beforeImportAt'); } catch(e){} } else lsSet('mt.beforeImportAt', before.at); try { localStorage.removeItem('mt.freshAt'); } catch(e){} }
    if (packOld) lsSet('mt.packOld', Date.now()); else { try { localStorage.removeItem('mt.packOld'); } catch(e){} }
    if (S.lib.cat === 'TAE' && !S.pack) { S.lib.cat = 'Sve'; lsSet('mt.libcat', 'Sve'); }
    S.sheet = null; S.stack = [{ v: S.tab }]; render(); loadMedia();
    toast(s.undo ? 'Vraćeni su podaci od prije uvoza.' : 'Podaci su vraćeni iz kopije.' + (packOld ? ' Kopija je vratila stariju verziju paketa „' + pk.title + '”: uvezi paket ponovno.' : ''));
  },
  undoRestore: async () => {
    let snap = null; try { snap = await IDB.get('before-import'); } catch(e){}
    let d = null; try { d = snap && cleanData(JSON.parse(snap.data)); } catch(e){}
    if (!d) { try { localStorage.removeItem('mt.beforeImportAt'); } catch(e){} render(); toast('Podaci od prije uvoza nisu sačuvani na ovom mobitelu.', true); return; }
    S.sheet = { kind:'restore', undo: true, d, settings: snap.settings, at: lsGet('mt.beforeImportAt', 0) || snap.at }; clearToast(); render();
  },
  backupLater: () => { lsSet('mt.backupLater', Date.now()); render(); },
  freshSeen: () => { try { localStorage.removeItem('mt.freshAt'); } catch(e){} render(); },
  badSeen: () => { const b = lsGet('mt.badStore', null); if (b) { b.seen = true; lsSet('mt.badStore', b); } render(); },
  setSetting: d => { S.settings[d.k] = +d.v; lsSet('mt.settings', S.settings); render(); },
  toggleSound: () => { S.settings.sound = !S.settings.sound; lsSet('mt.settings', S.settings); ensureAudio(); render(); },
  toggleSilent: () => { S.settings.silentOk = S.settings.silentOk !== true; lsSet('mt.settings', S.settings); if (P && !P.done) { audioMode(true); ensureAudio(); } render(); },
  // the arrow asks first (an in-page sheet: confirm() does not work in every view); a timed step waits meanwhile
  quitPlay: () => { if (!P || P.done) return; const st = P.steps[P.i]; if (st && st.dur && !P.paused) { P.left = remaining(); P.paused = true; P.sheetPause = true; } S.sheet = { kind:'quit' }; render(); },
  quitResume: () => { S.sheet = null; if (P && P.sheetPause && P.paused) { P.paused = false; P.endAt = Date.now() + P.left * 1000; } if (P) P.sheetPause = false; render(); },
  quitSave: () => saveSoFar(),
  quitDiscard: () => { S.sheet = null; clearPlay(); leavePlay(); },
  resumeGo: () => { const s = S.sheet && S.sheet.s; S.sheet = null; if (!s || !restorePlay(s)) { clearPlay(); render(); } },
  resumeSave: () => { const s = S.sheet && S.sheet.s; S.sheet = null; if (!s || !restorePlay(s)) { clearPlay(); render(); return; } saveSoFar(); },
  resumeDrop: () => { S.sheet = null; clearPlay(); render(); },
  // "Spremi i ponovi": the finished session is saved first, then the same session starts again (rebuilt, so new settings apply)
  restartPlay: () => {
    const ref = P.ref, cfg = { mode:P.mode, title:P.title, items:P.items, f:P.f, ref };
    const saved = anyCredit(), r = saved ? logSession() : { news: [], cut: '', saved: true };
    // a refused save (its message is shown): leave as 'Završi' does, so the finished session stays on the phone for the next
    // start; a new run would overwrite it before anything is saved
    if (!r.saved) { leavePlay(); return; }
    const p = ref && ref.kind === 'protocol' && S.pr[ref.id], f = ref && ref.kind === 'field' && S.field[ref.id];
    if (p && (p.items || []).length) { cfg.items = p.items; cfg.title = p.name; }
    if (f) { cfg.f = f; cfg.title = f.name_hr; }
    cfg.steps = cfg.mode === 'field' ? stepsFromField(cfg.f) : stepsFromItems(cfg.items);
    P = null; S.stack.pop(); startPlayer(cfg);
    toast(r.cut || (r.news.length ? newsMsg(r.news) : saved ? 'Trening je spremljen. Krećeš ispočetka.' : 'Krećeš ispočetka.'));
  },
  finishPlay: () => {
    if (!anyCredit()) { clearPlay(); leavePlay(); return; }   // nothing done: nothing to save
    const r = logSession();
    leavePlay();
    if (r.cut) toast(r.cut); else if (r.news.length) toast(newsMsg(r.news));
  },
  lrep: d => { const j = +d.j, it = P.items[j] || {}; P.lastReps = P.lastReps || {}; P.lastReps[j] = Math.max(0, Math.min(repsOf(it, it.sets || 1), lastRepsOf(j) + (+d.d))); savePlay(); const v = app.querySelector('.view'); const st = v ? v.scrollTop : 0; render(); const v2 = app.querySelector('.view'); if (v2) v2.scrollTop = st; },
  progTab: d => { S.progTab = d.v; render(); },
  setGoal: d => { S.settings.goal = S.settings.goal === d.v ? null : d.v; lsSet('mt.settings', S.settings); render(); },
  setBall: d => { const v = ballN() + (+d.d); S.settings.ballN = Math.max(0, Math.min(7, v)); lsSet('mt.settings', S.settings); render(); },
  setMatch: d => { S.settings.matchDay = +d.v; lsSet('mt.settings', S.settings); render(); },
  toggleMatch: d => { const t = calDay(weekStart(Date.now()), +d.i); setMatchDate(t, !matchOn(t)); render(); },
  matchAdd: () => { const el = document.getElementById('matchadd'), v = el && /^(\d{4})-(\d\d)-(\d\d)$/.exec(el.value || '');
    if (!v) { toast('Odaberi datum utakmice.'); return; }
    const t = new Date(+v[1], +v[2] - 1, +v[3]).getTime();
    if (t < calDay(Date.now())) { toast('Odaberi današnji ili neki kasniji datum.'); return; }
    setMatchDate(t, true); render(); toast('Utakmica ' + DAYS_IN[dayIdx(t)] + ', ' + shortDate(t) + ' je dodana.'); },
  matchDel: d => { const m = Object.assign({}, matchDates()); delete m[d.k]; S.settings.matchDates = m; lsSet('mt.settings', S.settings); render(); },
  kgSkip: async d => { const p = S.pr[d.id]; if (!p) return; const n = clone(p); delete n.id; n.kgSkip = kgSig(kgPlan(p)); S.pr[d.id].kgSkip = n.kgSkip; render(); await save('protocols', d.id, n); },
  goalSheet: d => { S.sheet = { kind:'goal', id: d.id }; render(); },
  kgSheet: d => { S.sheet = { kind:'kg', id: d.id }; render(); },
  goalSkip: async d => { const p = S.pr[d.id]; if (!p) return; const n = clone(p); delete n.id; n.goalSkip = S.settings.goal; S.pr[d.id].goalSkip = n.goalSkip; render(); await save('protocols', d.id, n); },
  goalApply: async d => { const p = S.pr[d.id]; if (!p || !GOALS[S.settings.goal] || !gymProto(p)) return; const plan = goalPlan(p, S.settings.goal); const n = clone(p); delete n.id; n.items = plan.items; n.goal = S.settings.goal; n.updatedAt = Date.now();
    S.pr[d.id] = Object.assign({ id: d.id }, n); S.sheet = null; render(); await save('protocols', d.id, n); toast('Protokol je prilagođen cilju „' + GOALS[n.goal].name + '”.'); },
  kgApply: async d => { const p = S.pr[d.id]; if (!p) return; const plan = kgPlan(p); const n = clone(p); delete n.id; n.items = plan.items;
    S.pr[d.id] = Object.assign({ id: d.id }, n); S.sheet = null; render(); await save('protocols', d.id, n); toast('Kilogrami su upisani.'); },
  setProgN: d => { S.settings.progN = +d.v; lsSet('mt.settings', S.settings); render(); },
  setPlate: d => { const v = +d.v; if (PLATES.indexOf(v) === -1) return; S.settings.plateKg = v; lsSet('mt.settings', S.settings); render(); },
  sugUp: async d => { const p = S.pr[d.p]; if (!p) return; const n = clone(p); delete n.id; const it = n.items[+d.j], e = S.ex[it.exId], nd = nextDose(e, it); if (!nd.item) return;
    const pv = { measure: it.measure, sets: it.sets, reps: it.reps, sec: it.sec, kg: it.kg || 0, sides: !!it.sides }; if (Array.isArray(it.repsList)) pv.repsList = it.repsList.slice();   // "Vrati" restores per-set reps too
    n.items[+d.j] = Object.assign(clone(nd.item), { prev: pv, ok: 0, fail: 0, snoozeOk: 0, up: Date.now() });
    S.pr[d.p] = Object.assign({ id: d.p }, n); render(); await save('protocols', d.p, n); toast(e.name + ': ' + nd.text); },
  sugLater: async d => { const p = S.pr[d.p]; if (!p) return; const n = clone(p); delete n.id; const it = n.items[+d.j]; it.snoozeOk = it.ok || 0; S.pr[d.p] = Object.assign({ id: d.p }, n); render(); await save('protocols', d.p, n); },
  sugRevert: async d => { const p = S.pr[d.p]; if (!p) return; const n = clone(p); delete n.id; const it = n.items[+d.j]; if (!it.prev) return;
    n.items[+d.j] = Object.assign({}, it, it.prev, { prev: null, ok: 0, fail: 0, snoozeOk: 0 }); delete n.items[+d.j].prev; delete n.items[+d.j].up;
    S.pr[d.p] = Object.assign({ id: d.p }, n); render(); await save('protocols', d.p, n); toast('Vraćeno na ' + doseBase(n.items[+d.j]) + '.'); },
  sugRetry: async d => { const p = S.pr[d.p]; if (!p) return; const n = clone(p); delete n.id; n.items[+d.j].fail = 0; S.pr[d.p] = Object.assign({ id: d.p }, n); render(); await save('protocols', d.p, n); },
  // tapping the chosen answer again goes back to what the player recorded (partly done or skipped);
  // "Nisam uspio" keeps the shown last-set reps even if the stepper is never touched
  answer: d => { const j = +d.j, val = d.v !== '0'; P.answers = P.answers || {}; P.lastReps = P.lastReps || {};
    const rec = P.auto && (P.auto[j] === 'partial' || P.auto[j] === 'skip') ? P.auto[j] : null;
    P.answers[j] = P.answers[j] === val && rec ? rec : val;
    if (P.answers[j] === false && P.lastReps[j] == null) P.lastReps[j] = lrDefault(j);
    savePlay(); const v = app.querySelector('.view'); const st = v ? v.scrollTop : 0; render(); const v2 = app.querySelector('.view'); if (v2) v2.scrollTop = st; },
  progInfo: () => { S.sheet = { kind:'progInfo' }; render(); },
  loadInfo: () => go({ v:'loadInfo' }),
  loadRange: d => { S.loadRange = d.v; render(); },   // the period of the exercise chart stays while the app is open
  // a tap on a chart column shows that point; a second tap on it hides it (only the drawn chart changes, nothing is stored)
  ltip: (d, el) => { const svg = el.closest('svg'); if (!svg) return; const g = svg.querySelector('.tipg[data-i="'+d.i+'"]'), on = g && g.classList.contains('on');
    svg.querySelectorAll('.tipg.on').forEach(x => x.classList.remove('on')); if (g && !on) g.classList.add('on'); },
  sheetDone: () => { S.sheet = null; render(); },
  daySheet: d => { S.sheet = { kind:'day', i: +d.i }; render(); },
  eqSheet: () => { S.sheet = { kind:'eq' }; render(); },
  eqToggle: d => { const eq = S.lib.eq = (S.lib.eq || []).slice(); const i = eq.indexOf(d.v); if (i === -1) eq.push(d.v); else eq.splice(i, 1); lsSet('mt.libeq', eq); render(); },
  eqClear: () => { S.lib.eq = []; lsSet('mt.libeq', []); S.sheet = null; render(); },
  // programme tests: a result is one history entry of kind 'test' (not a training); "Kreni ispočetka" for a programme
  progTest: d => { const t = progTestDef(d.id, d.t), side = d.s || ''; if (!t || !Object.prototype.hasOwnProperty.call(t.names, side)) return; S.sheet = { kind:'progTest', id: d.id, t: d.t, s: side }; render(); const i = document.getElementById('testv'); if (i) i.focus(); },
  progTestSave: () => {
    const s = S.sheet, t = s && s.kind === 'progTest' && progTestDef(s.id, s.t); if (!t) return;
    const el = document.getElementById('testv'), raw = String(el ? el.value : '').trim().replace(',', '.'), v = /^\d+(\.\d+)?$/.test(raw) ? +raw : NaN;
    s.v = el ? el.value : '';
    if (!(v >= t.min && v <= t.max)) { toast(t.err); if (el) el.focus(); return; }
    const e = { kind:'test', test: t.id, name: t.names[s.s || ''], value: Math.round(v * 100) / 100, unit: t.unit, at: Date.now() }; if (s.s) e.side = s.s;
    S.log.unshift(e);
    if (!persist()) { S.log = S.log.filter(l => l !== e); render(); return; }   // the phone refused: nothing is kept, the sheet stays
    S.sheet = null; render(); toast('Rezultat je spremljen: ' + progTestVal(e) + '.');
  },
  progTestDel: () => {
    const s = S.sheet; if (!s || s.kind !== 'progTest') return;
    const r = progTestRes(s.t, s.s)[0]; if (!r) return;
    progTyped(s);
    if (!s._del) { s._del = true; render(); return; }
    const i = S.log.indexOf(r); S.log.splice(i, 1);
    s._del = false;
    if (!persist()) { S.log.splice(i, 0, r); render(); return; }
    render(); toast('Rezultat je obrisan.');
  },
  progTestKeep: () => { const s = S.sheet; if (!s) return; progTyped(s); s._del = false; render(); },
  progRestartAsk: d => { if (!S.prog[d.id]) return; S.sheet = { kind:'progRestart', id: d.id }; render(); },
  progRestart: d => { const g = S.prog[d.id]; if (!g) return; S.settings.progFrom = Object.assign({}, S.settings.progFrom, { [g.id]: Date.now() }); lsSet('mt.settings', S.settings); S.sheet = null; render(); toast('Program kreće ispočetka.'); },
  prDays: async d => { const p = S.pr[d.id]; if (!p) return; const n = clone(p); delete n.id; const ds = n.days = (n.days || []).slice(); const i = ds.indexOf(+d.i); if (i === -1) ds.push(+d.i); else ds.splice(i, 1); ds.sort(); S.pr[d.id].days = ds; render(); await save('protocols', d.id, n); },
  fieldDays: async d => { const f = S.field[d.id]; if (!f) return; const n = clone(f); delete n.id; const ds = n.days = (n.days || []).slice(); const i = ds.indexOf(+d.i); if (i === -1) ds.push(+d.i); else ds.splice(i, 1); ds.sort(); S.field[d.id].days = ds; render(); await save('field', d.id, n); },
  progDays: async d => { const g = S.prog[d.id]; if (!g) return; const n = clone(g); delete n.id; const ds = n.days = (n.days || []).slice(); const i = ds.indexOf(+d.i); if (i === -1) ds.push(+d.i); else ds.splice(i, 1); ds.sort(); S.prog[d.id].days = ds; render(); await save('programs', d.id, n); },
  ddays: d => { const ds = S.draft.days = (S.draft.days || []).slice(); const i = ds.indexOf(+d.i); if (i === -1) ds.push(+d.i); else ds.splice(i, 1); ds.sort(); render(); },
  ilink: d => {
    const items = S.draft.items, i = +d.i, a = items[i], b = items[i + 1]; if (!a || !b) return;
    regroup(items, () => {
      // switching off inside a circuit splits it in two: the exercises after this one stay together under one new key
      if (a.ss && b.ss === a.ss) { const old = a.ss, nk = uid('s'); for (let k = i + 1; k < items.length && items[k].ss === old; k++) items[k].ss = nk; }
      else { const key = a.ss || b.ss || uid('s'); const oldB = b.ss; a.ss = key; for (let k = i + 1; k < items.length && (k === i + 1 || (oldB && items[k].ss === oldB)); k++) items[k].ss = key; if (!a.rest || a.rest > 30) a.rest = 0; }
    });
    render();
  },
  // a copy is your own protocol: not part of a programme or the pack, and its progress starts from zero
  copyPr: () => { const d = S.draft; const c = clone(d); c.id = uid('p'); c.name = (d.name || 'Protokol') + ' (kopija)'; c.home = null; c.days = []; c._confirmDel = false; c._open = null;
    ['program','week','slot','pack','goalSkip'].forEach(k => delete c[k]); (c.items || []).forEach(it => ['ok','fail','snoozeOk','up','prev','easy'].forEach(k => delete it[k]));
    S.draft = c; render(); toast('Kopija je spremna. Promijeni naziv i spremi.'); },
  dequip: d => { const z = S.draft.equip = (S.draft.equip || []).slice(); const i = z.indexOf(d.v); if (i === -1) z.push(d.v); else z.splice(i, 1); render(); },
  packRemove: async () => { if (!S.sheet) return; if (!S.sheet._confirm) { S.sheet._confirm = true; render(); return; } if (!(await removePack())) { if (S.sheet) S.sheet._confirm = false; render(); return; } S.sheet = null; render(); toast('Paket je uklonjen. Povijest treninga je ostala.'); },
  packKeep: () => { if (S.sheet) S.sheet._confirm = false; render(); }
};

app.addEventListener('click', ev => {
  actionSeq++;
  const el = ev.target.closest('[data-a]');
  if (!el || !app.contains(el)) return;
  if (el.dataset.a === 'sheetClose') { if (ev.target !== el) return; if (S.sheet && S.sheet.kind === 'quit') { A.quitResume(); return; } S.sheet = null; render(); return; }   // the quit sheet always closes as 'Nastavi trening'
  if (el.disabled) return;
  const fn = A[el.dataset.a];
  if (fn) { ev.preventDefault(); fn(Object.assign({}, el.dataset), el, ev); }
});
app.addEventListener('input', ev => {
  const t = ev.target;
  if (t.id === 'libq') { S.lib.q = t.value; const l = document.getElementById('liblist'); if (l) l.innerHTML = libListHtml(); return; }
  if (t.id === 'masdist') { masTyped(t); return; }
  if (t.dataset && t.dataset.bind && S.draft) S.draft[t.dataset.bind] = t.value;
  if (t.tagName === 'TEXTAREA' && t.classList.contains('input')) grow(t);
  if (!S.draft || !t.dataset) return;
  // typed kilograms (62,5 or 62.5) go straight into the draft; the screen is not rebuilt under the keyboard
  if (t.dataset.ikg != null || t.dataset.dkg != null) {
    const it = t.dataset.ikg != null ? S.draft.items[+t.dataset.ikg] : S.draft, v = kgVal(t.value);
    if (it && v != null) { it.kg = v; const el = t.dataset.ikg != null && document.getElementById('dose-' + t.dataset.ikg); if (el) el.textContent = dose(it); }
  }
  // a part title: renames the part that starts here, or starts a new part here; empty = this part joins the one above
  if (t.dataset.isec != null) {
    const items = S.draft.items, val = t.value.trim() || t.dataset.fb || '';
    for (let k = +t.dataset.from; k <= +t.dataset.to && k < items.length; k++) { if (val) items[k].section = val; else delete items[k].section; }
    const h = document.getElementById('sec-' + t.dataset.from); if (h && val) h.textContent = val;
  }
});
app.addEventListener('keydown', ev => { const t = ev.target; if (ev.key === 'Enter' && t.dataset && (t.id === 'topkmh' || t.dataset.ikg != null || t.dataset.dkg != null || t.dataset.isec != null)) { ev.preventDefault(); t.blur(); } });
app.addEventListener('focusin', ev => { const t = ev.target; if (t.classList && t.classList.contains('kgin')) setTimeout(() => { try { t.select(); } catch(e){} }, 0); });
app.addEventListener('change', async ev => {
  actionSeq++;
  const t = ev.target;
  // a backup only opens the preview sheet; nothing changes before "Zamijeni podatke"
  if ((t.id === 'importFile' || t.id === 'importFile2') && t.files && t.files[0]) {
    const f = t.files[0]; let d = null;
    try { d = JSON.parse(await f.text()); } catch(e){}
    t.value = '';   // the same file can be chosen again after "Odustani"
    const why = backupProblem(d);
    if (why) { toast(why, true); return; }
    cleanFixes = 0; S.sheet = { kind:'restore', d: cleanData(d) }; clearToast(); render();
    return;
  }
  if (t.id === 'topkmh') {
    const v = +String(t.value).trim().replace(',', '.');
    if (!(t.value.trim() && isFinite(v) && v >= 20 && v <= 40)) { t.value = kmhTxt(topKmh()); toast('Upiši najveću brzinu od 20 do 40\u00a0km/h.', true); return; }
    S.settings.topKmh = Math.round(v * 10) / 10; lsSet('mt.settings', S.settings); render(); toast('Najveća brzina: ' + kmhTxt(S.settings.topKmh) + '\u00a0km/h.'); return;
  }
  if (t.id === 'packFile' && t.files && t.files[0]) {
    if (S.sheet) { S.sheet._busy = true; render(); }
    try { const r = await importPack(t.files[0]); S.sheet = null; render();
      const n = (k, one, few, many) => r[k] + ' ' + plural(r[k], one, few, many);
      const parts = [r.photos ? n('photos', 'slika', 'slike', 'slika') : '', r.exercises ? nVj(r.exercises) : '',
        r.programs ? n('programs', 'program', 'programa', 'programa') + (r.sessions ? ' (' + n('sessions', 'trening', 'treninga', 'treninga') + ')' : '') : r.sessions ? n('sessions', 'trening', 'treninga', 'treninga') : ''].filter(Boolean);
      const upd = [r.updEx ? nVj(r.updEx) : '', r.updPr ? n('updPr', 'trening', 'treninga', 'treninga') : '', r.updPg ? n('updPg', 'program', 'programa', 'programa') : ''].filter(Boolean);
      toast(parts.length || upd.length ? [parts.length ? 'Dodano: ' + parts.join(', ') + '.' : '', upd.length ? 'Ažurirano iz novije verzije paketa: ' + upd.join(', ') + '.' : ''].filter(Boolean).join(' ') : 'Ovaj paket je već uvezen.'); }
    catch(e){ console.error('pack import failed', e); if (S.sheet) S.sheet._busy = false; render(); toast(e && e.mtMsg || 'Slike se ne mogu spremiti na mobitel. Paket nije uvezen.', true); }
    return;
  }
  // typed kilograms are shown back the app's way (62,5) when the field is left; a new part title shows a moment later
  if (t.dataset && (t.dataset.ikg != null || t.dataset.dkg != null)) { const it = !S.draft ? null : t.dataset.ikg != null ? S.draft.items[+t.dataset.ikg] : S.draft; if (it) t.value = kgText(it.kg); return; }
  if (t.dataset && t.dataset.isec != null) { lazyRender(); return; }
  if (t.id !== 'mfile' || !t.files || !t.files[0] || !S.draft) return;
  const file = t.files[0], dr = S.draft, isImg = /^image\//.test(file.type); t.value = '';
  if (dr._uploading) { toast('Pričekaj, još spremam prethodnu datoteku.'); return; }
  if (file.size > 80 * 1024 * 1024) { toast(isImg ? 'Slika je veća od 80 MB.' : 'Video je veći od 80 MB. Snimi kraći isječak (5–15 s).'); return; }
  dr._uploading = isImg ? 'image' : 'video'; paintMedia(dr);
  const id = uid('m');
  try {
    const type = file.type || (isImg ? 'image/jpeg' : 'video/mp4');
    await IDB.put(id, { type, buf: await file.arrayBuffer() });
    if (S.draft !== dr) { dropMedia(id); return; }   // the editor was closed meanwhile: nothing will ever use this file
    if (dr.media && dr.media !== ((S.ex[dr.id] || {}).media)) dropMedia(dr.media);   // an earlier, never saved photo or video of this edit
    MEDIA[id] = URL.createObjectURL(file);
    dr.media = id; dr.mediaType = isImg ? 'image' : 'video';
    toast(isImg ? 'Slika je dodana.' : 'Video je dodan.');
  } catch(e){
    console.error('media save failed', e); dropMedia(id);
    if (S.draft === dr) toast(e && e.name === 'QuotaExceededError' ? 'Nema dovoljno mjesta za ' + (isImg ? 'ovu sliku' : 'ovaj video') + '. Oslobodi prostor na mobitelu i pokušaj ponovno.' : 'Spremanje ' + (isImg ? 'slike' : 'videa') + ' nije uspjelo. Pokušaj ponovno.');
  }
  dr._uploading = false;
  if (S.draft === dr) paintMedia(dr);
});
document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && S.sheet) { if (S.sheet.kind === 'quit') { A.quitResume(); return; } S.sheet = null; render(); } });

/* ---------- another open copy, coming back to the app, a new version ---------- */
// a second copy (another Safari tab) saved: its data shows here as soon as nothing is open
window.addEventListener('storage', e => {
  if (e.key === STORE_KEY) { if (e.newValue && e.newValue !== savedJson) { pendingExt = e.newValue; if (!appBusy()) render(); } }
  else if (e.key === 'mt.settings') { S.settings = Object.assign({}, SETTINGS_BASE, cleanSettings(lsGet('mt.settings', {}))); if (!appBusy()) render(); }
  else if (e.key === 'mt.pack') { S.pack = lsGet('mt.pack', null); if (!S.pack && S.lib.cat === 'TAE') S.lib.cat = 'Sve'; loadMedia(); }
});
const swContainer = 'serviceWorker' in navigator ? navigator.serviceWorker : null;
let hadWorker = !!(swContainer && swContainer.controller), newVersionCache = '';
// a new version is loaded when nothing is open (never during a workout), once per version: never a reload loop
function maybeReload(){
  if (!newVersionCache || appBusy()) return;
  try { if (sessionStorage.getItem('mt.reloadedFor') === newVersionCache) return; sessionStorage.setItem('mt.reloadedFor', newVersionCache); } catch(e){ return; }
  location.reload();
}
if (swContainer) {
  swContainer.addEventListener('controllerchange', () => { if (hadWorker && swContainer.controller) swContainer.controller.postMessage('mt-version'); hadWorker = true; });
  swContainer.addEventListener('message', e => { const c = e.data && e.data.mtCache; if (typeof c === 'string' && c !== 'mt-v' + APP_VERSION) { newVersionCache = c; maybeReload(); } });
}
// iPhone: a home-screen app comes back from the background without reloading
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') return;
  let cur = null; try { cur = localStorage.getItem(STORE_KEY); } catch(e){}
  if (cur && savedJson != null && cur !== savedJson) { pendingExt = cur; if (!appBusy()) render(); }
  maybeReload();
  if (swContainer) swContainer.getRegistration().then(r => r && r.update()).catch(() => {});
});

init();
playResume();   // waits until the data is loaded
})();
