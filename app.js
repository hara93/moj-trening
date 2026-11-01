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
  pulse:'M3 12h4l3-7 4 14 3-7h4',
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
const fmt = s => { s = Math.max(0, Math.ceil(s)); const m = Math.floor(s/60), r = s%60; return m + ':' + (r<10?'0':'') + r; };
const MEDIA = {};
const mediaUrl = id => MEDIA[id] || '';
const CATS = ['Rehab', 'Aktivacija', 'Mobilnost', 'Snaga', 'Kondicija'];
const ZONES = ['Kuk','Gluteus','Gluteus medius','Aduktori','Fleksori kuka','Stražnja loža','Kvadriceps','Core','Koljeno','Gležanj','Leđa','Ramena'];
const LIBCATS = ['Sve','Favoriti','Rehab kuka','Uže i kolotur','Aktivacija','Mobilnost','Snaga','Kondicija'];
const catIcon = c => ({Rehab:I.pulse, Aktivacija:I.bolt, Mobilnost:I.leaf, Snaga:I.dumb, Kondicija:I.run}[c] || I.pulse);

function lsGet(k, d){ try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch(e){ return d; } }
function lsSet(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} }

/* ---------- state ---------- */
const S = {
  dbState: 'loading', loaded: {},
  ex: {}, pr: {}, field: {}, log: [],
  tab: 'home', stack: [{v:'home'}],
  lib: { cat: lsGet('mt.libcat', 'Sve'), q: '' },
  draft: null, pick: null, sheet: null, toast: null,
  settings: Object.assign({ sound: true, switchSec: 5, transSec: 10 }, lsGet('mt.settings', {})),
  canWrite: true
};
const top = () => S.stack[S.stack.length - 1];

/* ---------- durations ---------- */
function itemSecs(it){
  if (it.measure === 'time') { const n = it.sets || 1; return n * ((it.sec||30) * (it.sides ? 2 : 1) + (it.sides ? S.settings.switchSec : 0)) + (n - 1) * (it.rest || 0) + S.settings.transSec; }
  const reps = it.reps || 10, sets = it.sets || 1;
  return sets * reps * 3 * (it.sides ? 2 : 1) + (sets - 1) * (it.rest || 45) + S.settings.transSec;
}
function protoMin(p){ const s = (p.items||[]).reduce((a,it) => a + itemSecs(it), 0); return Math.max(1, Math.round(s/60)); }
function fieldMin(f){
  if (f.total_min) return String(f.total_min).replace('.', ',');
  let s = 0; (f.blocks||[]).forEach(b => { const sets = b.sets||1, reps = b.reps||1; s += sets*reps*(b.work_s||0) + sets*(reps-1)*(b.rest_s||0) + (sets-1)*(b.set_rest_s||b.rest_s||0) + (b.rest_s||0); });
  return Math.max(1, Math.round(s/60));
}
function dose(it){
  if (it.measure === 'time') return ((it.sets||1) > 1 ? it.sets + ' × ' : '') + (it.sec||30) + ' s' + (it.sides ? ' po strani' : '');
  return (it.sets||1) + ' × ' + (it.reps||10) + (it.sides ? ' po strani' : '') + (it.kg ? ' · ' + it.kg + ' kg' : '');
}
function exItem(e){ const m = e.measure||'sets'; return { exId: e.id, measure: m, sec: e.sec||30, sets: e.sets || (m === 'time' ? 1 : 3), reps: e.reps||10, rest: e.rest != null ? e.rest : (m === 'time' ? 15 : 45), sides: !!e.sides, kg: e.kg||0 }; }
function exBadge(e){ if (e.phase) return 'Faza ' + e.phase; if (e.cord) return 'Uže ' + e.cord; return ''; }
function exMeta(e){ return (e.zones && e.zones.length ? e.zones.slice(0,2).join(' • ') : e.cat) ; }
function thumbHtml(e){
  if (e && e.media && MEDIA[e.media]) return e.mediaType === 'image' ? '<img alt="" src="'+esc(mediaUrl(e.media))+'">' : '<video muted playsinline preload="metadata" src="'+esc(mediaUrl(e.media))+'#t=0.5"></video>';
  return pathIcon(catIcon(e && e.cat), 28);
}

/* ---------- on-device storage ---------- */
const APP_VERSION = '1.0';
const STORE_KEY = 'mt.data.v1';
function persist(){
  try { localStorage.setItem(STORE_KEY, JSON.stringify({ v:1, exercises:S.ex, protocols:S.pr, field:S.field, log:S.log, _deleted:S._deleted||[] })); return true; }
  catch(e){ toast('Spremanje na mobitel nije uspjelo. Oslobodi malo prostora.'); return false; }
}
function applyData(d){
  for (const k in S.ex) delete S.ex[k]; for (const k in S.pr) delete S.pr[k]; for (const k in S.field) delete S.field[k];
  Object.keys(d.exercises||{}).forEach(id => S.ex[id] = Object.assign({}, d.exercises[id], { id }));
  Object.keys(d.protocols||{}).forEach(id => S.pr[id] = Object.assign({}, d.protocols[id], { id }));
  Object.keys(d.field||{}).forEach(id => S.field[id] = Object.assign({}, d.field[id], { id }));
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
  const ids = Object.values(S.ex).map(e => e.media).filter(Boolean);
  for (const id of ids) { if (MEDIA[id]) continue; try { const rec = await IDB.get(id); if (rec) MEDIA[id] = URL.createObjectURL(rec instanceof Blob ? rec : new Blob([rec.buf], { type: rec.type })); } catch(e){} }
  softRender();
}
async function init(){
  let d = null;
  try { const raw = localStorage.getItem(STORE_KEY); if (raw) d = JSON.parse(raw); } catch(e){ d = null; }
  const seed = window.SEED || {};
  if (!d) { d = JSON.parse(JSON.stringify(seed)); applyData(d); S._deleted = []; persist(); }
  else {
    applyData(d); S._deleted = d._deleted || [];
    // items shipped in later versions are added, without touching your own edits or what you deleted
    let added = false;
    ['exercises','protocols','field'].forEach(c => Object.keys(seed[c]||{}).forEach(id => {
      const map = c === 'exercises' ? S.ex : c === 'protocols' ? S.pr : S.field;
      if (!map[id] && S._deleted.indexOf(c + '/' + id) === -1) { map[id] = Object.assign({}, seed[c][id], { id }); added = true; }
    }));
    if (added) persist();
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
  const rootView = (t.v === 'home' || t.v === 'protocols' || t.v === 'library') && !S.pick;
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
    '<div class="carousel" id="car" aria-label="Kategorije treninga">' +
      cards.map(c => '<button class="hcard" style="background:' + c.bg + '" ' + attrs(c.a) + '><span class="ic">' + pathIcon(c.ic, 96) + '</span><span class="sc"></span><span class="tt"><b>' + esc(c.t) + '</b><span>' + esc(c.s) + '</span></span></button>').join('') +
    '</div>' +
    '<div class="dots" id="dots" role="group" aria-label="Odaberi karticu">' + cards.map((c,i) => '<button class="dot" data-a="dot" data-i="'+i+'" aria-label="'+esc(c.t)+'"'+(i===0?' aria-current="true"':'')+'><i></i></button>').join('') + '</div>' +
    (S.log[0] ? '<p class="sub" style="text-align:center;margin:8px 0 0">Zadnji trening: ' + esc(S.log[0].name) + ' · ' + esc(new Date(S.log[0].at).toLocaleDateString('hr-HR', {day:'numeric', month:'numeric'})) + '</p>' : '') +
  '</div>';
};

VIEWS.protocols = function(){
  const list = Object.values(S.pr).sort((a,b) => (b.updatedAt||0) - (a.updatedAt||0));
  const fieldN = Object.keys(S.field).length;
  return '<div class="view gut">' + topbar('', '') +
    '<h1 class="h1">Moji protokoli</h1>' +
    (stateNote() || (
      '<div class="list" style="margin-top:24px">' +
      (list.length ? list.map(p => {
        const first = p.items && p.items[0] && S.ex[p.items[0].exId];
        return '<button class="row" data-a="openPr" data-id="'+esc(p.id)+'"><span class="thumb">' + (first && MEDIA[first.media] ? thumbHtml(first) : pathIcon(p.home === 'aktivacija' ? I.rope : p.home === 'rehab' ? I.pulse : I.dumb, 28)) + '</span><span class="tx"><span class="t">' + esc(p.name) + '</span><span class="m"><span>' + nVj((p.items||[]).length) + ' • ' + protoMin(p) + ' min</span>' + (p.tag ? '<span class="tag">'+esc(p.tag)+'</span>' : '') + '</span></span>' + I.chev + '</button>';
      }).join('') : '<div class="empty">Još nemaš protokol. Složi prvi od svojih vježbi.</div>') +
      '</div>' +
      '<h2 class="h2">Kondicija na terenu</h2>' +
      '<div class="list" style="margin-top:14px"><button class="row" data-a="fieldList"><span class="thumb" style="background:#33404A">' + pathIcon(I.run, 28) + '</span><span class="tx"><span class="t">Treninzi s terena</span><span class="m"><span>' + (fieldN ? fieldN + ' ' + plural(fieldN,'trening','treninga','treninga') : 'Učitavanje') + '</span><span class="tag">STATSports</span></span></span>' + I.chev + '</button></div>'
    )) +
    '<div style="height:16px"></div></div>' +
    '<div class="footer gut"><button class="btn" data-a="newPr">' + I.plus.replace('<svg', '<svg width="18" height="18"') + 'Novi protokol</button></div>';
};

function libFiltered(){
  const q = S.lib.q.trim().toLowerCase(), c = S.lib.cat;
  return Object.values(S.ex).filter(e => {
    if (q && e.name.toLowerCase().indexOf(q) === -1) return false;
    if (c === 'Sve') return true;
    if (c === 'Favoriti') return !!e.fav;
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
    '<div class="search">' + I.search + '<input id="libq" class="input" type="search" placeholder="Traži vježbu" aria-label="Traži vježbu" autocomplete="off" value="'+esc(S.lib.q)+'"></div>' +
    '<div class="chips" role="group" aria-label="Kategorija" style="margin-top:12px">' + LIBCATS.map(c => '<button class="chip" data-a="libCat" data-cat="'+esc(c)+'" aria-pressed="'+(S.lib.cat===c)+'">'+esc(c)+'</button>').join('') + '</div>' +
    '<div class="list" id="liblist" style="margin-top:14px">' + libListHtml() + '</div>' +
    '<div style="height:20px"></div></div>' +
    (picking ? '<div class="footer gut"><button class="btn" data-a="pickDone"'+(S.pick.ids.length?'':' disabled')+'>Dodaj u protokol ('+S.pick.ids.length+')</button></div>' : '');
};

function mediaHtml(e, badge){
  let inner;
  if (e && e.media && MEDIA[e.media]) inner = e.mediaType === 'image' ? '<img alt="" src="'+esc(mediaUrl(e.media))+'">' : '<video src="'+esc(mediaUrl(e.media))+'" autoplay muted loop playsinline></video>';
  else inner = '<div class="ph">' + I.video + '<span>Ovdje ide tvoj video</span></div>';
  return '<div class="media">' + inner + (badge ? '<span class="badge">'+esc(badge)+'</span>' : '') + '</div>';
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
    '<div class="chips" role="group" aria-label="Doziranje" style="justify-content:center;margin-top:14px">' + opts.map((o,i) => '<button class="chip" data-a="dose" data-i="'+i+'" aria-pressed="'+(i===sel)+'">'+esc(o.label)+'</button>').join('') + '</div>' +
    '<div class="cards">' +
      '<section class="icard" aria-label="Upute">' +
        (e.feel ? '<span class="lb">Osjećaj</span><p>'+esc(e.feel)+'</p>' : '') +
        '<span class="lb">Upute</span>' + ((e.steps||[]).length ? (e.steps||[]).map(s => '<div class="bul">'+esc(s)+'</div>').join('') : '<p style="color:var(--text-2)">Dodaj upute u uređivanju.</p>') +
      '</section>' +
      '<section class="icard" aria-label="Detalji">' +
        '<span class="lb">Ciljana područja</span><div class="tagrow">' + ((e.zones||[]).map(z => '<span class="tag">'+esc(z)+'</span>').join('') || '<span style="color:var(--text-2)">—</span>') + '</div>' +
        '<span class="lb" style="margin-top:8px">Oprema</span><p>' + esc(e.equipment || 'Bez opreme') + '</p>' +
        (e.note ? '<span class="lb" style="margin-top:8px">Napomena</span><p>'+esc(e.note)+'</p>' : '') +
        (e.source ? '<span class="lb" style="margin-top:8px">Izvor</span><p><a href="'+esc(e.source)+'" target="_blank" rel="noopener">'+esc(e.sourceTitle || 'Otvori izvor')+'</a></p>' : '') +
      '</section>' +
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
      '<div class="field"><label class="label" for="f-name">Naziv</label><input id="f-name" class="input" data-bind="name" value="'+esc(d.name)+'" placeholder="npr. Abdukcija s užetom"></div>' +
      '<div class="field"><span class="label">Kategorija</span><div class="chips wrap">' + CATS.map(c => '<button class="chip" data-a="dset" data-k="cat" data-v="'+c+'" aria-pressed="'+(d.cat===c)+'">'+c+'</button>').join('') + '</div></div>' +
      (d.cat === 'Rehab' || d.cat === 'Mobilnost' ? '<div class="field"><span class="label">Faza rehabilitacije</span><div class="chips wrap">' + [0,1,2,3].map(p => '<button class="chip" data-a="dset" data-k="phase" data-v="'+p+'" aria-pressed="'+((d.phase||0)===p)+'">'+(p?'Faza '+p:'Bez faze')+'</button>').join('') + '</div></div>' : '') +
      '<div class="field"><span class="label">Elastično uže</span><div class="chips wrap">' + [['','Bez užeta'],['Ø6','Ø6 mm'],['Ø8','Ø8 mm'],['Ø6/Ø8','Ø6 ili Ø8']].map(o => '<button class="chip" data-a="dset" data-k="cord" data-v="'+o[0]+'" aria-pressed="'+((d.cord||'')===o[0])+'">'+o[1]+'</button>').join('') + '</div></div>' +
      '<div class="field"><span class="label">Ciljana područja</span><div class="chips wrap">' + ZONES.map(z => '<button class="tagbtn" data-a="dzone" data-v="'+esc(z)+'" aria-pressed="'+((d.zones||[]).indexOf(z)!==-1)+'">'+esc(z)+'</button>').join('') + '</div></div>' +
      '<div class="field"><span class="label">Doziranje</span>' +
        '<div class="seg"><button class="chip" data-a="dset" data-k="measure" data-v="time" aria-pressed="'+(d.measure==='time')+'" style="height:44px">Na vrijeme</button><button class="chip" data-a="dset" data-k="measure" data-v="sets" aria-pressed="'+(d.measure!=='time')+'" style="height:44px">Serije</button></div>' +
        '<div class="panel">' +
          (d.measure === 'time' ? stepper('Trajanje','sec',d.sec, d.sec+' s') + stepper('Serije','sets',d.sets, d.sets) + stepper('Odmor','rest',d.rest, d.rest+' s') : stepper('Serije','sets',d.sets, d.sets) + stepper('Ponavljanja','reps',d.reps, d.reps) + stepper('Odmor','rest',d.rest, d.rest+' s') + stepper('Težina','kg',d.kg, d.kg ? d.kg+' kg' : '—')) +
          '<div class="prow"><span class="k">Lijeva i desna strana posebno</span><button class="switch" role="switch" data-a="dflag" data-k="sides" aria-checked="'+(!!d.sides)+'" aria-label="Lijeva i desna strana posebno"></button></div>' +
        '</div></div>' +
      '<div class="field"><label class="label" for="f-eq">Oprema</label><input id="f-eq" class="input" data-bind="equipment" value="'+esc(d.equipment)+'" placeholder="npr. Uže Ø6 + kolotur"></div>' +
      '<div class="field"><label class="label" for="f-feel">Osjećaj</label><input id="f-feel" class="input" data-bind="feel" value="'+esc(d.feel)+'" placeholder="Gdje se vježba osjeća"></div>' +
      '<div class="field"><label class="label" for="f-steps">Upute (svaki red jedna točka)</label><textarea id="f-steps" class="input" rows="4" data-bind="stepsText">'+esc(d.stepsText)+'</textarea></div>' +
      '<div class="field"><label class="label" for="f-note">Napomena</label><textarea id="f-note" class="input" rows="2" data-bind="note">'+esc(d.note)+'</textarea></div>' +
      (isNew ? '' : '<button class="btn danger" data-a="delEx">' + (d._confirmDel ? 'Dodirni još jednom za brisanje' : 'Obriši vježbu') + '</button>') +
    '</div><div style="height:16px"></div></div>' +
    '<div class="footer gut"><button class="btn" data-a="saveEx">Spremi vježbu</button></div>';
};

function featRows(p){
  const eq = {}; (p.items||[]).forEach(it => { const e = S.ex[it.exId]; if (e && e.equipment) e.equipment.split(/,| i /).forEach(x => { x = x.trim(); if (x && !/^bez opreme$/i.test(x)) eq[x] = 1; }); });
  const zones = {}; (p.items||[]).forEach(it => { const e = S.ex[it.exId]; (e && e.zones || []).forEach(z => zones[z] = 1); });
  return '<div class="feat">'+I.clock+'<span>' + protoMin(p) + ' minuta • ' + nVj((p.items||[]).length) + '</span></div>' +
    (Object.keys(zones).length ? '<div class="feat">'+I.target+'<span>' + esc(Object.keys(zones).slice(0,4).join(', ')) + '</span></div>' : '') +
    '<div class="feat">'+I.bars+'<span>Oprema: ' + esc(Object.keys(eq).slice(0,3).join(', ') || 'bez opreme') + '</span></div>';
}
VIEWS.pr = function(t){
  const p = S.pr[t.id];
  if (!p) return '<div class="view gut">' + topbar(backBtn()) + '<div class="empty">Ovaj protokol više ne postoji.</div></div>';
  const first = p.items && p.items[0] && S.ex[p.items[0].exId];
  return '<div class="view" style="position:relative">' +
    '<div class="hero">' + (first && MEDIA[first.media] ? (first.mediaType==='image' ? '<img alt="" src="'+esc(mediaUrl(first.media))+'">' : '<video src="'+esc(mediaUrl(first.media))+'" autoplay muted loop playsinline></video>') : '<span class="ic">'+pathIcon(p.home==='aktivacija'?I.rope:I.pulse,110)+'</span>') + '<span class="fade"></span></div>' +
    '<div class="over gut">' + topbar(backBtn(), '<button class="ib" data-a="editPr" data-id="'+esc(p.id)+'" aria-label="Uredi protokol">'+I.edit+'</button>') + '</div>' +
    '<div class="gut stack" style="gap:18px;margin-top:-6px">' +
      '<h1 style="margin:0 17px;font-size:30px;line-height:36px;font-weight:600;text-wrap:balance">' + esc(p.name) + '</h1>' +
      (p.desc ? '<p style="margin:0 17px;font-size:16px;line-height:24px;color:var(--text-body)">' + esc(p.desc) + '</p>' : '') +
      '<div class="stack" style="gap:16px;margin:4px 17px 0">' + featRows(p) + '</div>' +
      '<h2 class="h2" style="margin-top:8px">Vježbe</h2>' +
      '<div class="list">' + (p.items||[]).map((it,i) => { const e = S.ex[it.exId]; return '<button class="row" data-a="openEx" data-id="'+esc(it.exId)+'" style="min-height:72px"><span class="thumb" style="width:62px;height:62px">'+(e && MEDIA[e.media] ? thumbHtml(e) : (i+1))+'</span><span class="tx"><span class="t">'+esc(e ? e.name : 'Obrisana vježba')+'</span><span class="m"><span>'+esc(dose(it))+'</span></span></span>'+I.chev+'</button>'; }).join('') + '</div>' +
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
    '<div class="list">' + d.items.map((it, i) => {
      const e = S.ex[it.exId]; const open = d._open === i;
      return '<div style="border-radius:20px;background:var(--surface);border:1px solid '+(open?'var(--accent)':'var(--border)')+'">' +
        '<button class="row" data-a="itOpen" data-i="'+i+'" aria-expanded="'+open+'" style="border:0;background:transparent">' +
          '<span class="thumb">'+(e && MEDIA[e.media] ? thumbHtml(e) : (i+1))+'</span><span class="tx"><span class="t">'+esc(e ? e.name : 'Obrisana vježba')+'</span><span class="m"><span>'+esc(dose(it))+'</span></span></span>' +
          '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate('+(open?'-90':'90')+'deg)"><path d="M9 4.5l7.5 7.5L9 19.5"/></svg>' +
        '</button>' +
        (open ? '<div style="padding:0 16px 16px;border-top:1px solid var(--border)">' +
          '<div class="seg" style="margin-top:12px"><button class="chip" data-a="iset" data-k="measure" data-v="time" aria-pressed="'+(it.measure==='time')+'">Na vrijeme</button><button class="chip" data-a="iset" data-k="measure" data-v="sets" aria-pressed="'+(it.measure!=='time')+'">Serije</button></div>' +
          (it.measure === 'time'
            ? istep('Trajanje','sec',i,it.sec+' s') + istep('Serije','sets',i,it.sets||1) + istep('Odmor','rest',i,(it.rest||0)+' s')
            : istep('Serije','sets',i,it.sets) + istep('Ponavljanja','reps',i,it.reps) + istep('Odmor','rest',i,it.rest+' s')) +
          '<div class="prow"><span class="k">Lijeva i desna posebno</span><button class="switch" role="switch" data-a="iflag" data-i="'+i+'" aria-checked="'+(!!it.sides)+'" aria-label="Lijeva i desna posebno"></button></div>' +
          '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px">' +
            '<button class="chip" data-a="imove" data-i="'+i+'" data-d="-1"'+(i===0?' disabled style="opacity:.35"':'')+'>↑ Gore</button>' +
            '<button class="chip" data-a="imove" data-i="'+i+'" data-d="1"'+(i===d.items.length-1?' disabled style="opacity:.35"':'')+'>↓ Dolje</button>' +
            '<button class="chip" data-a="idel" data-i="'+i+'" style="color:var(--danger)">Ukloni</button>' +
          '</div></div>' : '') +
      '</div>';
    }).join('') +
      '<button class="dash" data-a="pickStart">'+I.plus.replace('<svg','<svg width="18" height="18"')+'Dodaj vježbe iz knjižnice</button>' +
      (isNew ? '' : '<button class="btn danger" data-a="delPr">' + (d._confirmDel ? 'Dodirni još jednom za brisanje' : 'Obriši protokol') + '</button>') +
    '</div><div style="height:16px"></div></div>' +
    '<div class="footer gut"><button class="btn" data-a="savePr" data-start="1"' + (d.items.length ? '' : ' disabled') + '>Spremi i kreni</button></div>';
};
function istep(label, key, i, shown){
  return '<div class="prow" style="border:0"><span class="k">'+label+'</span><div class="step"><button class="sbtn" data-a="istep" data-k="'+key+'" data-i="'+i+'" data-d="-1" aria-label="'+label+' manje">−</button><b>'+esc(shown)+'</b><button class="sbtn" data-a="istep" data-k="'+key+'" data-i="'+i+'" data-d="1" aria-label="'+label+' više">+</button></div></div>';
}

VIEWS.fieldList = function(){
  const list = Object.values(S.field).sort((a,b) => (a.order||99) - (b.order||99));
  return '<div class="view gut">' + topbar(backBtn()) +
    '<h1 class="h1">Kondicija na terenu</h1>' +
    '<p class="sub">Treninzi trčanja koje je javno objavio STATSports</p>' +
    '<div class="list" style="margin-top:22px">' +
    (S.dbState !== 'ready' ? stateNote() : list.length ? list.map(f => '<button class="row" data-a="openField" data-id="'+esc(f.id)+'"><span class="thumb" style="background:#33404A">'+pathIcon(I.run,28)+'</span><span class="tx"><span class="t">'+esc(f.name_hr)+'</span><span class="m"><span>'+fieldMin(f)+' min</span><span class="tag">'+esc(f.goal_hr)+'</span></span></span>'+I.chev+'</button>').join('')
      : '<div class="empty">Treninzi s terena se pripremaju. Uskoro će se pojaviti ovdje.</div>') +
    '</div><div style="height:20px"></div></div>';
};
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
  return '<div class="view gut">' + topbar(backBtn()) +
    '<h1 class="h1">' + esc(f.name_hr) + '</h1>' +
    '<div style="display:flex;gap:8px;margin:12px 17px 0;flex-wrap:wrap"><span class="tag">'+esc(f.goal_hr)+'</span><span class="tag">'+fieldMin(f)+' min</span></div>' +
    (f.summary_hr ? '<p style="margin:16px 17px 0;font-size:16px;line-height:24px;color:var(--text-body)">'+esc(f.summary_hr)+'</p>' : '') +
    '<div class="stack" style="gap:16px;margin:20px 17px 0">' +
      (f.equipment_hr ? '<div class="feat">'+I.bars+'<span>'+esc(f.equipment_hr)+'</span></div>' : '') +
      (f.warmup_hr ? '<div class="feat">'+I.clock+'<span>Zagrijavanje: '+esc(f.warmup_hr)+'</span></div>' : '') +
    '</div>' +
    (akt ? '<div class="list" style="margin-top:18px"><button class="row" data-a="openPr" data-id="'+esc(akt.id)+'" style="min-height:64px"><span class="thumb" style="width:56px;height:56px">'+pathIcon(I.rope,24)+'</span><span class="tx"><span class="t">Prvo zagrijavanje: '+esc(akt.name)+'</span><span class="m"><span>'+protoMin(akt)+' min</span></span></span>'+I.chev+'</button></div>' : '') +
    '<h2 class="h2">Blokovi</h2>' +
    '<div class="list" style="margin-top:14px">' + (f.blocks||[]).map((b,i) => '<div class="blk"><span class="no">'+(i+1)+'</span><span class="bt"><b>'+esc(b.label_hr)+'</b><span>'+esc(blockLine(b))+'</span>'+(b.cue_hr?'<span style="color:var(--text-2)">'+esc(b.cue_hr)+'</span>':'')+'</span></div>').join('') + '</div>' +
    (f.cooldown_hr ? '<p style="margin:18px 17px 0;font-size:14px;line-height:21px;color:var(--text-2)">Hlađenje: '+esc(f.cooldown_hr)+'</p>' : '') +
    '<p style="margin:18px 17px 0;font-size:14px;line-height:21px;color:var(--text-2)">Izvor: <a href="'+esc(f.source_url)+'" target="_blank" rel="noopener">'+esc(f.source_title || 'STATSports')+'</a></p>' +
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

function stepsFromItems(items){
  const steps = []; const ss = S.settings.switchSec, ts = S.settings.transSec;
  steps.push({ kind:'prep', dur:5, g:0, title:'Pripremi se', label:'Kreće za' });
  items.forEach((it, g) => {
    const e = S.ex[it.exId] || { name:'Vježba', steps:[] };
    const base = { g, e, it };
    if (g > 0) steps.push(Object.assign({}, base, { kind:'rest', dur:ts, label:'Sljedeće', trans:true }));
    if (it.measure === 'time') {
      const n = it.sets || 1;
      for (let s = 1; s <= n; s++) {
        const b2 = Object.assign({}, base, { set: s });
        if (it.sides) { steps.push(Object.assign({}, b2, { kind:'work', dur:it.sec, side:'Lijeva strana' })); steps.push(Object.assign({}, b2, { kind:'switch', dur:ss, side:'Promjena strane' })); steps.push(Object.assign({}, b2, { kind:'work', dur:it.sec, side:'Desna strana' })); }
        else steps.push(Object.assign({}, b2, { kind:'work', dur:it.sec }));
        if (s < n && it.rest) steps.push(Object.assign({}, b2, { kind:'rest', dur:it.rest, label:'Odmor' }));
      }
    } else {
      for (let s = 1; s <= it.sets; s++) {
        steps.push(Object.assign({}, base, { kind:'manual', set:s, side: it.reps + ' ponavljanja' + (it.sides ? ' po strani' : '') }));
        if (s < it.sets) steps.push(Object.assign({}, base, { kind:'rest', dur:it.rest, set:s, label:'Odmor' }));
      }
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
function groupFirst(g){ return P.steps.findIndex(s => s.g === g && s.kind !== 'rest'); }
function jump(dir){
  const st = P.steps[P.i]; if (!st) return;
  if (dir > 0) {
    const nextG = (st.trans || st.kind === 'prep') ? st.g : st.g + 1;
    const idx = P.steps.findIndex((s, k) => k > P.i && s.g >= nextG && s.kind !== 'rest' && s.kind !== 'prep');
    if (idx === -1) { finish(); return; }
    enterStep(idx);
  } else {
    let g = st.g; const first = groupFirst(g);
    if (P.i <= first || st.kind === 'prep') g = Math.max(0, g - 1);
    const idx = groupFirst(g); enterStep(idx === -1 ? 0 : idx);
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
    v.title = st.kind === 'prep' ? (e ? e.name : P.title) : (st.trans ? 'Sljedeće: ' + (nextWork && nextWork.e ? nextWork.e.name : '') : (e ? e.name : ''));
    v.meta = it ? ((st.trans ? (nextWork.g+1) : (st.g+1)) + '/' + groups + ' • ' + dose(it) + (e && e.cat ? ' • ' + e.cat : '')) : '';
    v.badge = st.kind === 'manual' ? 'Serija ' + st.set + '/' + it.sets + ' • ' + st.side
      : ((it && it.measure === 'time' && (it.sets||1) > 1 && st.set && !st.trans ? 'Serija ' + st.set + '/' + it.sets + (st.side ? ' • ' : '') : '') + (st.side || ''));
    v.hint = st.kind === 'manual' ? (it.sides ? 'Odradi obje strane pa dodirni krug' : 'Dodirni krug kad završiš seriju')
      : st.kind === 'rest' && !st.trans ? 'Odmor • dodirni krug da preskočiš'
      : st.kind === 'switch' ? 'Namjesti se za drugu stranu'
      : st.kind === 'prep' ? 'Namjesti se'
      : 'Dodirni krug za pauzu';
  }
  if (st.kind === 'manual') { v.big = st.set + '/' + (st.it ? st.it.sets : ''); v.ringFrac = (st.set - 1) / (st.it ? st.it.sets : 1); }
  else { const r = remaining(); v.big = r >= 60 ? fmt(r) : String(Math.ceil(r)); v.ringFrac = st.dur ? r / st.dur : 0; }
  if (st.kind === 'switch' || st.kind === 'rest' || st.kind === 'prep') v.ringColor = 'var(--muted)';
  return v;
}
function ringSvg(frac, color){
  const C = 2 * Math.PI * 35;
  return '<svg viewBox="0 0 76 76"><circle cx="38" cy="38" r="35" fill="none" stroke="var(--track)" stroke-width="3.5"/><circle id="ringArc" cx="38" cy="38" r="35" fill="none" stroke="'+color+'" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="'+(C*Math.max(0,Math.min(1,frac))).toFixed(1)+' '+C.toFixed(1)+'" transform="rotate(-90 38 38)"/></svg>';
}
VIEWS.play = function(){
  if (!P) return VIEWS.home();
  if (P.done) {
    return '<div class="view gut stack">' + topbar('', '') +
      '<div class="done"><span class="ck">'+I.check+'</span><h1 style="margin:10px 0 0;font-size:30px;font-weight:600">Bravo!</h1><span style="font-size:16px;color:var(--text-body)">' + esc(P.title) + ' • ' + fmt(P.secs) + ' min</span></div></div>' +
      '<div class="footer gut stack" style="gap:10px"><button class="btn" data-a="finishPlay">Završi</button><button class="txtbtn" data-a="restartPlay" style="align-self:center">Ponovi</button></div>';
  }
  const v = curView();
  const prog = (P.i + (v.st.dur ? 1 - remaining()/v.st.dur : 0)) / P.steps.length;
  const media = P.mode === 'field'
    ? '<div class="media"><div class="fblock '+v.fieldPanel.cls+'" id="fpanel"><span class="ph1">'+v.fieldPanel.ph+'</span><span class="big" id="fbig">'+esc(v.big)+'</span>' + (v.fieldPanel.dist ? '<span class="sm" style="font-size:20px;font-weight:600;color:var(--text)">'+esc(v.fieldPanel.dist)+'</span>' : '') + '<span class="sm">'+esc(v.fieldPanel.sm)+'</span></div></div>'
    : mediaHtml(v.e, v.badge);
  const card = P.mode === 'field'
    ? '<section class="icard" style="margin:16px max(16px, env(safe-area-inset-left, 0px)) 0"><span class="lb">Trening</span><p>'+esc(P.title)+'</p>' + (P.f.summary_hr ? '<p style="color:var(--text-body);font-size:15px">'+esc(P.f.summary_hr)+'</p>' : '') + '<span class="lb" style="margin-top:8px">Izvor</span><p style="font-size:14px"><a href="'+esc(P.f.source_url)+'" target="_blank" rel="noopener">'+esc(P.f.source_title || 'STATSports')+'</a></p></section>'
    : '<section class="icard" style="margin:16px max(16px, env(safe-area-inset-left, 0px)) 0">' + (v.e && v.e.feel ? '<span class="lb">Osjećaj</span><p>'+esc(v.e.feel)+'</p>' : '') + '<span class="lb">Upute</span>' + ((v.e && v.e.steps || []).map(s => '<div class="bul">'+esc(s)+'</div>').join('') || '<p style="color:var(--text-2)">Bez uputa.</p>') + '</section>';
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
  } else if (s.kind === 'data') {
    body = '<h3>Moji podaci</h3>' +
      '<p style="margin:0 0 12px;font-size:14px;line-height:21px;color:var(--text-2)">Vježbe, protokoli i videi spremaju se samo na ovom mobitelu. Povremeno izvezi kopiju da ih ne izgubiš. Videi nisu dio kopije.</p>' +
      '<button class="opt" data-a="exportData"><span>Izvezi sigurnosnu kopiju</span></button>' +
      '<label class="opt" for="importFile" style="cursor:pointer"><span>Uvezi kopiju</span></label><input id="importFile" class="vsr" type="file" accept="application/json,.json">' +
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
    P.steps.forEach((st, k) => { if (st.kind === 'rest' || st.kind === 'prep') return; if (!groups.some(g => g.g === st.g)) groups.push({ g: st.g, k, name: P.mode === 'field' ? (st.b ? st.b.label_hr : '') : (st.e ? st.e.name : '') }); });
    const cur = (P.steps[P.i] || {}).g;
    body = '<h3>' + esc(P.title) + '</h3>' + groups.map(g => '<button class="opt" data-a="jumpTo" data-k="'+g.k+'"><span>'+(g.g+1)+'. '+esc(g.name)+'</span>'+(g.g===cur?'<span class="tag">sada</span>':'')+'</button>').join('');
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
}

/* ---------- actions ---------- */
function newExDraft(){
  return { id: uid('e'), name:'', cat:'Aktivacija', phase:null, cord:'', zones:[], measure:'sets', sec:30, sets:2, reps:12, rest:30, kg:0, sides:true, equipment:'', feel:'', stepsText:'', note:'', media:null, mediaType:null, fav:false };
}
const A = {
  tab: d => setTab(d.tab),
  back: () => { S.draft = null; S.pick = null; back(); },
  dot: d => { const car = document.getElementById('car'); const c = car && car.children[+d.i]; if (c) c.scrollIntoView({ behavior:'smooth', inline:'center', block:'nearest' }); },
  libCat: d => { S.lib.cat = d.cat; lsSet('mt.libcat', d.cat); if (top().v !== 'library') { S.tab = 'library'; S.stack = [{v:'library'}]; } render(); },
  fieldList: () => go({ v:'fieldList' }),
  openField: d => go({ v:'field', id:d.id }),
  openPr: d => go({ v:'pr', id:d.id }),
  openEx: d => go({ v:'ex', id:d.id, dose:0 }),
  dose: d => { top().dose = +d.i; render(); },
  fav: async d => { const e = S.ex[d.id]; if (!e) return; const n = Object.assign({}, e, { fav: !e.fav }); delete n.id; e.fav = n.fav; render(); await save('exercises', d.id, n); },
  newEx: () => { S.draft = newExDraft(); go({ v:'exEdit' }); },
  editEx: d => { const e = S.ex[d.id]; if (!e) return; S.draft = Object.assign(newExDraft(), clone(e), { stepsText: (e.steps||[]).join('\n') }); go({ v:'exEdit' }); },
  dset: d => { const dr = S.draft; let v = d.v; if (d.k === 'phase') v = +v || null; dr[d.k] = v; if (d.k === 'cat' && v !== 'Rehab' && v !== 'Mobilnost') dr.phase = null; if (d.k === 'cat' && v === 'Rehab' && !dr.phase) dr.phase = 1; if (d.k === 'measure' && v === 'time' && dr.sets > 3) dr.sets = 1; render(); },
  dzone: d => { const z = S.draft.zones = S.draft.zones || []; const i = z.indexOf(d.v); if (i === -1) z.push(d.v); else z.splice(i,1); render(); },
  dflag: d => { S.draft[d.k] = !S.draft[d.k]; render(); },
  dstep: d => { const k = d.k, dr = S.draft, dir = +d.d; const step = { sec:5, sets:1, reps:1, rest:15, kg:2.5 }[k]; const min = { sec:5, sets:1, reps:1, rest:0, kg:0 }[k]; const max = { sec:600, sets:10, reps:60, rest:300, kg:300 }[k]; dr[k] = Math.min(max, Math.max(min, (+dr[k]||0) + dir*step)); render(); },
  mediaRemove: () => { S.draft.media = null; S.draft.mediaType = null; render(); },
  saveEx: async () => {
    const d = S.draft; const name = (d.name||'').trim();
    if (!name) { toast('Upiši naziv vježbe.'); const el = document.getElementById('f-name'); if (el) el.focus(); return; }
    const body = { name, cat:d.cat, phase: (d.cat === 'Rehab' || d.cat === 'Mobilnost') && d.phase ? d.phase : null, cord: d.cord || '', zones: d.zones||[], measure: d.measure, sec: d.sec, sets: d.sets, reps: d.reps, rest: d.rest, kg: d.kg||0, sides: !!d.sides,
      equipment: (d.equipment||'').trim(), feel: (d.feel||'').trim(), steps: (d.stepsText||'').split('\n').map(s => s.trim()).filter(Boolean), note: (d.note||'').trim(),
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
  istep: d => { const it = S.draft.items[+d.i], k = d.k, dir = +d.d; const step = { sec:5, sets:1, reps:1, rest:15 }[k]; const min = { sec:5, sets:1, reps:1, rest:0 }[k]; const max = { sec:600, sets:10, reps:60, rest:300 }[k]; it[k] = Math.min(max, Math.max(min, (+it[k]||0) + dir*step)); render(); },
  iflag: d => { const it = S.draft.items[+d.i]; it.sides = !it.sides; render(); },
  imove: d => { const i = +d.i, j = i + (+d.d), items = S.draft.items; if (j < 0 || j >= items.length) return; const t = items[i]; items[i] = items[j]; items[j] = t; S.draft._open = j; render(); },
  idel: d => { S.draft.items.splice(+d.i, 1); S.draft._open = null; render(); },
  pickStart: () => { S.pick = { ids: [] }; S.lib.q = ''; S.stack.push({ v:'library' }); render(); },
  pickToggle: d => { const ids = S.pick.ids, i = ids.indexOf(d.id); if (i === -1) ids.push(d.id); else ids.splice(i,1); const list = document.getElementById('liblist'); const v = app.querySelector('.view'); const st = v ? v.scrollTop : 0; render(); const v2 = app.querySelector('.view'); if (v2) v2.scrollTop = st; },
  pickCancel: () => { S.pick = null; S.stack.pop(); render(); },
  pickDone: () => { const ids = S.pick.ids.slice(); S.pick = null; S.stack.pop(); ids.forEach(id => { const e = S.ex[id]; if (e) S.draft.items.push(exItem(e)); }); render(); toast(nVj(ids.length) + ' dodano.'); },
  savePr: async d => {
    const dr = S.draft; const name = (dr.name||'').trim();
    if (!name) { toast('Upiši naziv protokola.'); const el = document.getElementById('p-name'); if (el) el.focus(); return; }
    const body = { name, desc: (dr.desc||'').trim(), items: dr.items.map(it => ({ exId: it.exId, measure: it.measure, sec: it.sec, sets: it.sets, reps: it.reps, rest: it.rest, sides: !!it.sides, kg: it.kg||0 })), updatedAt: Date.now(), home: dr.home || null, tag: dr.tag || null };
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
      const blob = new Blob([JSON.stringify({ v:1, exportedAt: new Date().toISOString(), exercises:S.ex, protocols:S.pr, field:S.field, log:S.log, _deleted:S._deleted||[] }, null, 1)], { type:'application/json' });
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
    P = null; S.stack.pop(); render();
    S.log.unshift(entry); S.log = S.log.slice(0, 300); persist(); render();
  }
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
