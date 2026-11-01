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
const CATS = ['Rehab', 'Aktivacija', 'Mobilnost', 'Snaga', 'Eksplozivnost', 'Kondicija'];
const ZONES = ['Kuk','Gluteus','Gluteus medius','Aduktori','Fleksori kuka','Stražnja loža','Kvadriceps','Core','Koljeno','Gležanj','Leđa','Ramena'];
const LIBCATS = ['Sve','Favoriti','TRX','Snaga','Uže i kolotur','Mobilnost','Aktivacija','Eksplozivnost','Kondicija'];
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
  settings: Object.assign({ sound: true, switchSec: 10, transSec: 15, voice: false }, lsGet('mt.settings', {})),
  canWrite: true
};
const top = () => S.stack[S.stack.length - 1];

/* ---------- durations ---------- */
function itemSecs(it){return TrainingEngine.estimate([it],S.ex,S.settings)-5;}
function protoMin(p){return Math.max(1,Math.round(TrainingEngine.estimate(p.items||[],S.ex,S.settings)/60));}
function fieldMin(f){const t=TrainingEngine.fieldDuration(f,S.profile);return (t.manual?'≈ ':'')+(f.total_min||Math.round(t.seconds/60)).toString().replace('.',',');}

function dose(it){
  if (it.measure === 'time') return ((it.sets||1) > 1 ? it.sets + ' × ' : '') + (it.sec||30) + ' s' + (it.sides ? ' po strani' : '');
  return (it.sets||1) + ' × ' + (it.reps||10) + (it.sides ? ' po strani' : '') + (it.kg ? ' · ' + it.kg + ' kg' : '');
}
function exItem(e){ const m = e.measure||'sets'; return { exId: e.id, measure: m, sec: e.sec||30, sets: e.sets || (m === 'time' ? 1 : 3), reps: e.reps||10, rest: e.rest != null ? e.rest : (m === 'time' ? 15 : 45), sides: !!e.sides, kg: e.kg||0 }; }
function exBadge(e){ return e.level ? 'Razina '+e.level : e.cord?'Uže '+e.cord:''; }
function exMeta(e){ return (e.zones && e.zones.length ? e.zones.slice(0,2).join(' • ') : e.cat) ; }
function thumbHtml(e){
  if (e && e.media && MEDIA[e.media]) return e.mediaType === 'image' ? '<img alt="" src="'+esc(mediaUrl(e.media))+'">' : '<video muted playsinline preload="metadata" src="'+esc(mediaUrl(e.media))+'#t=0.5"></video>';
  return window.ExerciseVisuals && e && e.visualKey ? ExerciseVisuals.render(e.visualKey||'squat',{compact:true,animate:false,ghost:false,variant:e.visualVariant}) : pathIcon(catIcon(e&&e.cat),28);
}

/* ---------- on-device storage ---------- */
const STORE_KEY = 'mt.data.v2';
function persist(){
  try { localStorage.setItem(STORE_KEY, JSON.stringify({ v:2, exercises:S.ex, protocols:S.pr, field:S.field, log:S.log, plan:S.plan||[], profile:S.profile||{}, seedBaseline:S.seedBaseline, _deleted:S._deleted||[] })); return true; }
  catch(e){ toast('Spremanje na mobitel nije uspjelo. Oslobodi malo prostora.'); return false; }
}
function applyData(d){
  for (const k in S.ex) delete S.ex[k]; for (const k in S.pr) delete S.pr[k]; for (const k in S.field) delete S.field[k];
  Object.keys(d.exercises||{}).forEach(id => S.ex[id] = Object.assign({}, d.exercises[id], { id }));
  Object.keys(d.protocols||{}).forEach(id => S.pr[id] = Object.assign({}, d.protocols[id], { id }));
  Object.keys(d.field||{}).forEach(id => S.field[id] = Object.assign({}, d.field[id], { id }));
  S.log = Array.isArray(d.log) ? d.log : []; S.plan = Array.isArray(d.plan)?d.plan:[]; S.profile=Object.assign(TrainingEngine.defaultProfile(),d.profile||{}); S.seedBaseline=d.seedBaseline||null;
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
  let saved=lsGet(STORE_KEY,null)||lsGet('mt.data.v1',null);
  const migrated=TrainingEngine.migrate(saved,window.SEED||{},window.LEGACY_SEED||{});
  applyData(migrated);S._deleted=migrated._deleted;persist();
  S.dbState='ready';S.resume=lsGet('mt.active.v2',null);render();
  try { if(navigator.storage&&navigator.storage.persist)navigator.storage.persist(); }catch(e){}
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
  const akt = S.pr['aktivacija-kratka']||Object.values(S.pr).find(p => p.home === 'aktivacija');
  const cards = [
    { t:'Snaga i kontrola', s: rehab ? 'Moj protokol · ' + protoMin(rehab) + ' min' : 'Individualno prilagodljiv trening', bg:'#5B5148', ic:I.pulse, a: rehab ? {a:'openPr', id: rehab.id} : {a:'libCat', cat:'Rehab kuka'} },
    { t:'Aktivacija', s:'Kratka priprema · prema treningu', bg:'#3A3F47', ic:I.rope, a: akt ? {a:'openPr', id: akt.id} : {a:'libCat', cat:'Uže i kolotur'} },
    { t:'Kondicija', s:'Na terenu · STATSports', bg:'#33404A', ic:I.run, a:{a:'fieldList'} },
    { t:'Knjižnica', s: Object.keys(S.ex).length ? nVj(Object.keys(S.ex).length) : 'Moje vježbe', bg:'#2B2F37', ic:I.book, a:{a:'tab', tab:'library'} }
  ];
  const attrs = o => Object.keys(o).map(k => (k==='a' ? 'data-a' : 'data-'+k) + '="' + esc(o[k]) + '"').join(' ');
  return '<div class="view" style="background:radial-gradient(circle at 100% 0%, #24314A 0%, #1C2230 28%, #191D25 52%)">' +
    topbar('', '<button class="ib" data-a="dataSheet" aria-label="Podaci i sigurnosna kopija">' + I.gear + '</button>', 'MOJ TRENING') +
    '<h1 class="greet">Bok, spreman za trening?</h1>' +
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
        return '<button class="row" data-a="openPr" data-id="'+esc(p.id)+'"><span class="thumb" aria-hidden="true">' + (first ? thumbHtml(first) : pathIcon(p.home === 'aktivacija' ? I.rope : p.home === 'rehab' ? I.pulse : I.dumb, 28)) + '</span><span class="tx"><span class="t">' + esc(p.name) + '</span><span class="m"><span>' + nVj((p.items||[]).length) + ' • ' + protoMin(p) + ' min</span>' + (p.tag ? '<span class="tag">'+esc(p.tag)+'</span>' : '') + '</span></span>' + I.chev + '</button>';
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
      return '<button class="row" data-a="pickToggle" data-id="'+esc(e.id)+'" aria-pressed="'+on+'"><span class="thumb" aria-hidden="true">'+thumbHtml(e)+'</span><span class="tx"><span class="t">'+esc(e.name)+'</span><span class="m"><span>'+esc(exMeta(e))+'</span>'+(b?'<span class="tag">'+esc(b)+'</span>':'')+'</span></span><span class="circ" style="'+(on?'background:var(--accent);border-color:var(--accent)':'')+'">'+(on?I.checkS:I.plus)+'</span></button>';
    }
    return '<button class="row" data-a="openEx" data-id="'+esc(e.id)+'"><span class="thumb" aria-hidden="true">'+thumbHtml(e)+'</span><span class="tx"><span class="t">'+esc(e.name)+'</span><span class="m"><span>'+esc(exMeta(e))+'</span>'+(b?'<span class="tag">'+esc(b)+'</span>':'')+'</span></span>'+I.chev+'</button>';
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
  else inner = window.ExerciseVisuals && e && e.visualKey ? ExerciseVisuals.render(e.visualKey||'squat',{animate:true,ghost:false,variant:e.visualVariant}) : '<div class="ph">'+I.video+'<span>Dodaj vlastiti prikaz vježbe</span></div>';
  return '<div class="media">' + inner + (badge ? '<span class="badge">'+esc(badge)+'</span>' : '') + '</div>';
}
function doseOptions(e){
 const it=exItem(e);const lighter={...it,sets:Math.max(1,it.sets-1),sec:Math.max(5,it.sec-5),reps:Math.max(3,it.reps-2)};
 return [{label:'Lakše',it:lighter},{label:'Osnovno',it},{label:'Moja doza',it:top().customDose||it}];
}

VIEWS.ex = function(t){
  const e = S.ex[t.id];
  if (!e) return '<div class="view gut">' + topbar(backBtn()) + '<div class="empty">Ova vježba više ne postoji.</div></div>';
  const opts = doseOptions(e); const sel = t.dose == null ? 1 : t.dose;
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
      (true ? '<div class="field"><span class="label">Razina vježbe (nije medicinska faza)</span><div class="chips wrap">' + [1,2,3,4].map(p => '<button class="chip" data-a="dset" data-k="level" data-v="'+p+'" aria-pressed="'+((d.level||1)===p)+'">'+(p?'Razina '+p:'Bez oznake')+'</button>').join('') + '</div></div>' : '') +
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
          '<span class="thumb" aria-hidden="true">'+(e && MEDIA[e.media] ? thumbHtml(e) : (i+1))+'</span><span class="tx"><span class="t">'+esc(e ? e.name : 'Obrisana vježba')+'</span><span class="m"><span>'+esc(dose(it))+'</span></span></span>' +
          '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate('+(open?'-90':'90')+'deg)"><path d="M9 4.5l7.5 7.5L9 19.5"/></svg>' +
        '</button>' +
        (open ? '<div style="padding:0 16px 16px;border-top:1px solid var(--border)">' +
          '<div class="seg" style="margin-top:12px"><button class="chip" data-a="iset" data-k="measure" data-v="time" aria-pressed="'+(it.measure==='time')+'">Na vrijeme</button><button class="chip" data-a="iset" data-k="measure" data-v="sets" aria-pressed="'+(it.measure!=='time')+'">Serije</button></div>' +
          (it.measure === 'time'
            ? istep('Trajanje','sec',i,it.sec+' s') + istep('Serije','sets',i,it.sets||1) + istep('Odmor','rest',i,(it.rest||0)+' s')
            : istep('Serije','sets',i,it.sets) + istep('Ponavljanja','reps',i,it.reps) + istep('Odmor','rest',i,it.rest+' s')+istep('Težina','kg',i,(it.kg||0)+' kg')) +
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
  const akt = S.pr['aktivacija-kratka']||Object.values(S.pr).find(p => p.home === 'aktivacija');
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


function stepsFromItems(items){return TrainingEngine.itemsToSteps(items,S.ex,S.settings);}
function stepsFromField(f){return TrainingEngine.fieldSteps(f,S.profile);}

function startPlayer(cfg){
  ensureAudio();
  P = Object.assign({ i:0, paused:false, done:false, endAt:0, left:0, startedAt: Date.now(), pausedMs:0, pauseAt:null, records:{}, setDraft:{}, lastBeep:null }, cfg);
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
  P.stepStartedAt=Date.now(); P.setDraft={}; P.left = st.dur || 0; P.endAt = st.dur ? Date.now() + st.dur*1000 : 0;
  if (st.kind === 'work' || st.kind === 'manual' || st.kind === 'distance') { beep(880, 260, 0.22); buzz(120); }
  else if (st.kind === 'switch') { beep(660, 200); buzz([80,60,80]); }
  else if (st.kind === 'rest'||st.kind==='active') { beep(520,220);buzz(60); }
  checkpoint(); announceStep(st);
}
function remaining(){ const st = P.steps[P.i]; if (!st || !st.dur) return 0; return P.paused ? P.left : Math.max(0, (P.endAt - Date.now())/1000); }
function tick(){
  if (!P || P.done || P.paused) return;
  const st = P.steps[P.i]; if (!st) return;
  if (st.dur) {
    const r = remaining(); const whole = Math.ceil(r);
    if (whole <= 3 && whole >= 1 && P.lastBeep !== whole) { P.lastBeep = whole; beep(740, 120, 0.14); }
    if (r <= 0) { recordStep('done'); enterStep(P.i + 1); if (!P.done) paintPlayer(true); return; }
  }
  paintPlayer(false);
}
function finish(){
  P.done = true; clearInterval(ticker); keepAwake(false);
  beep(988, 420, 0.22); buzz([120,80,120]);
  P.secs=Math.max(0,Math.round((Date.now()-P.startedAt-(P.pausedMs||0)-(P.pauseAt?Date.now()-P.pauseAt:0))/1000)); P.summary=TrainingEngine.sessionSummary(P.steps,P.records);checkpoint();
  if (top().v === 'play') render();
}
function groupFirst(g){ return P.steps.findIndex(s => s.g === g && s.kind !== 'rest'); }
function jump(dir){
  const st = P.steps[P.i]; if (!st) return;
  if(P.paused)resumeClock();
  if (dir > 0) {
    const nextG = (st.trans || st.kind === 'prep') ? st.g : st.g + 1;
    P.steps.slice(P.i).filter(x=>x.g<nextG&&x.recordKey).forEach(x=>{if(!P.records[x.recordKey])P.records[x.recordKey]={exId:x.e?.id||x.it?.exId||null,status:'skipped',side:x.sideKey||'',set:x.set};});
    const idx = P.steps.findIndex((s, k) => k > P.i && s.g >= nextG && s.kind !== 'rest' && s.kind !== 'prep');
    if (idx === -1) { finish(); return; }
    enterStep(idx);
  } else {
    let g = st.g; const first = groupFirst(g);
    if (P.i <= first || st.kind === 'prep') g = Math.max(0, g - 1);
    const idx = groupFirst(g); enterStep(idx === -1 ? 0 : idx);
  }
  P.paused = false; checkpoint(); render();
}
function tapRing(){
 const st=P.steps[P.i];if(!st)return;
 if(st.kind==='manual'||st.kind==='distance'){recordStep('done');enterStep(P.i+1);render();return;}
 if(st.kind==='rest'&&!st.trans){enterStep(P.i+1);render();return;}
 pausePlayer();
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
    v.badge = st.kind === 'manual' ? 'Serija '+st.set+'/'+it.sets+(st.side?' • '+st.side:'')
      : ((it && it.measure === 'time' && (it.sets||1) > 1 && st.set && !st.trans ? 'Serija ' + st.set + '/' + it.sets + (st.side ? ' • ' : '') : '') + (st.side || ''));
    v.hint = st.kind === 'manual' ? (it.sides ? 'Odradi označenu stranu i zapiši rezultat' : 'Zapiši rezultat pa potvrdi seriju')
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
      '<p style="margin:14px 0 0;font-size:13px;color:var(--text-2)">' + nVj(Object.keys(S.ex).length) + ' • ' + Object.keys(S.pr).length + ' ' + plural(Object.keys(S.pr).length,'protokol','protokola','protokola') + ' • ' + S.log.length + ' ' + plural(S.log.length,'trening','treninga','treninga') + ' u povijesti</p>';
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
  openEx: d => go({ v:'ex', id:d.id, dose:1 }),
  dose: d => { top().dose = +d.i; render(); },
  fav: async d => { const e = S.ex[d.id]; if (!e) return; const n = Object.assign({}, e, { fav: !e.fav }); delete n.id; e.fav = n.fav; render(); await save('exercises', d.id, n); },
  newEx: () => { S.draft = newExDraft(); go({ v:'exEdit' }); },
  editEx: d => { const e = S.ex[d.id]; if (!e) return; S.draft = Object.assign(newExDraft(), clone(e), { stepsText: (e.steps||[]).join('\n') }); go({ v:'exEdit' }); },
  dset: d => { const dr = S.draft; let v = d.v; if (d.k === 'level') v = +v || 1; dr[d.k] = v; if (d.k === 'cat' && v !== 'Rehab' && v !== 'Mobilnost') dr.phase = null; if (d.k === 'cat' && v === 'Rehab' && !dr.phase) dr.phase = 1; if (d.k === 'measure' && v === 'time' && dr.sets > 3) dr.sets = 1; render(); },
  dzone: d => { const z = S.draft.zones = S.draft.zones || []; const i = z.indexOf(d.v); if (i === -1) z.push(d.v); else z.splice(i,1); render(); },
  dflag: d => { S.draft[d.k] = !S.draft[d.k]; render(); },
  dstep: d => { const k = d.k, dr = S.draft, dir = +d.d; const step = { sec:5, sets:1, reps:1, rest:15, kg:2.5 }[k]; const min = { sec:5, sets:1, reps:1, rest:0, kg:0 }[k]; const max = { sec:600, sets:10, reps:60, rest:300, kg:300 }[k]; dr[k] = Math.min(max, Math.max(min, (+dr[k]||0) + dir*step)); render(); },
  mediaRemove: () => { S.draft.media = null; S.draft.mediaType = null; render(); },
  saveEx: async () => {
    const d = S.draft; const name = (d.name||'').trim();
    if (!name) { toast('Upiši naziv vježbe.'); const el = document.getElementById('f-name'); if (el) el.focus(); return; }
    const body = { ...(S.ex[d.id]||{}), name, cat:d.cat, phase:null, level:d.level||1, cord: d.cord || '', zones: d.zones||[], measure: d.measure, sec: d.sec, sets: d.sets, reps: d.reps, rest: d.rest, kg: d.kg||0, sides: !!d.sides,
      equipment: (d.equipment||'').trim(), feel: (d.feel||'').trim(), steps: (d.stepsText||'').split('\n').map(s => s.trim()).filter(Boolean), note: (d.note||'').trim(),
      media: d.media || null, mediaType: d.mediaType || null, fav: !!d.fav, order: d.order || 500, source: d.source || null, sourceTitle: d.sourceTitle || null };
    const prev = S.ex[d.id];
    const ok = await save('exercises', d.id, body); if (!ok) return;
    if (prev && prev.media && prev.media !== body.media) { try { await IDB.del(prev.media); } catch(e){} }
    S.ex[d.id] = Object.assign({ id: d.id }, body);
    const id = d.id; S.draft = null; S.stack.pop();
    if (top().v !== 'ex' || top().id !== id) S.stack.push({ v:'ex', id, dose:1 });
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
  addTo: d => { const e=S.ex[d.id]; S.sheet = { kind:'addTo', exId:d.id, item:clone(doseOptions(e)[top().dose==null?1:top().dose].it) }; render(); },
  addToPick: async d => {
    const p = S.pr[d.id], e = S.ex[S.sheet.exId]; if (!p || !e) return;
    const n = clone(p); delete n.id; n.items = (n.items||[]).concat([S.sheet.item||exItem(e)]); n.updatedAt = Date.now();
    S.sheet = null; render();
    if (await save('protocols', p.id, n)) toast('Dodano u „' + p.name + '”.');
  },
  addToNew: () => { const e = S.ex[S.sheet.exId],selected=S.sheet.item; S.sheet = null; S.draft = { id: uid('p'), name:'', desc:'', items: e ? [selected||exItem(e)] : [], _open: null }; go({ v:'build' }); },
  newPr: () => { S.draft = { id: uid('p'), name:'', desc:'', items: [], _open: null }; go({ v:'build' }); },
  editPr: d => { const p = S.pr[d.id]; if (!p) return; S.draft = Object.assign(clone(p), { _open: null }); S.draft.items = S.draft.items || []; go({ v:'build' }); },
  itOpen: d => { const i = +d.i; S.draft._open = S.draft._open === i ? null : i; render(); },
  iset: d => { const it = S.draft.items[S.draft._open]; it[d.k] = d.v; render(); },
  istep: d => { const it = S.draft.items[+d.i], k = d.k, dir = +d.d; const step = { sec:5, sets:1, reps:1, rest:15, kg:2.5 }[k]; const min = { sec:5, sets:1, reps:1, rest:0, kg:0 }[k]; const max = { sec:600, sets:10, reps:60, rest:600, kg:300 }[k]; it[k] = Math.min(max, Math.max(min, (+it[k]||0) + dir*step)); render(); },
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
    const body = { ...(S.pr[dr.id]||{}), name, desc: (dr.desc||'').trim(), items: dr.items.map(it => ({ exId: it.exId, measure: it.measure, sec: it.sec, sets: it.sets, reps: it.reps, rest: it.rest, sides: !!it.sides, kg: it.kg||0 })), updatedAt: Date.now(), home: dr.home || null, tag: dr.tag || null };
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
  playEx: d => { const e = S.ex[d.id]; if (!e) return; const o = doseOptions(e)[top().dose == null ? 1 : top().dose]; const items = [o ? o.it : exItem(e)]; startPlayer({ mode:'ex', title: e.name, items, steps: stepsFromItems(items), ref: { kind:'exercise', id: e.id } }); },
  startField: d => { const f = S.field[d.id]; if (!f) return; startPlayer({ mode:'field', title: f.name_hr, f, steps: stepsFromField(f), ref: { kind:'field', id: f.id } }); },
  ring: () => tapRing(),
  jump: d => jump(+d.d),
  jumpTo: d => { S.sheet = null; enterStep(+d.k); P.paused = false; checkpoint(); render(); },
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
  if (t.id !== 'mfile' || !t.files || !t.files[0] || !S.draft) return;
  const file = t.files[0];
  if (file.size > 20 * 1024 * 1024) { toast('Video je prevelik. Snimi kraći isječak (5–15 s).'); return; }
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

/* v2: personal planning, explicit progression and accountable sessions. */
const E=TrainingEngine;
Object.assign(FORM_VIEWS,{readiness:1,profile:1,fieldEdit:1,planAdd:1,externalLog:1,pdfSchedule:1});
const dateKey=E.dateKey;
const safeUrl=u=>typeof u==='string'&&/^https?:\/\//.test(u)?esc(u):'#';
const bullets=xs=>(xs||[]).map(x=>'<div class="bul">'+esc(x)+'</div>').join('');
const noteBox=(title,body,cls='')=>'<section class="note-box '+cls+'"><b>'+esc(title)+'</b><div>'+body+'</div></section>';
const actionBtn=(a,text,attrs='')=>'<button class="chip" data-a="'+a+'" '+attrs+'>'+esc(text)+'</button>';
const fieldInput=(label,id,value,type='text',extra='')=>'<label class="field"><span class="label">'+esc(label)+'</span><input class="input" id="'+id+'" type="'+type+'" value="'+esc(value??'')+'" '+extra+'></label>';
const smallSelect=(label,id,value,options)=>'<label class="field"><span class="label">'+esc(label)+'</span><select class="input" id="'+id+'">'+options.map(([v,t])=>'<option value="'+esc(v)+'"'+(String(v)===String(value)?' selected':'')+'>'+esc(t)+'</option>').join('')+'</select></label>';
const exLink=id=>S.ex[id]?'<button class="chip" data-a="openEx" data-id="'+esc(id)+'">'+esc(S.ex[id].name)+'</button>':'';
function sourceLinks(e){
 const sources=window.SEED.sources||{};
 const ids=e.sourceIds||[];
 const links=ids.map(id=>sources[id]).filter(Boolean).map(src=>'<a target="_blank" rel="noopener" href="'+safeUrl(src.url)+'">'+esc(src.title||src.name||'Stručni izvor')+' ↗</a>');
 if(e.source&&!links.length)links.push('<a target="_blank" rel="noopener" href="'+safeUrl(e.source)+'">'+esc(e.sourceTitle||'Izvor')+' ↗</a>');
 return links.join('<br>')||'Izbor vježbe prema obrascu pokreta; individualnu dozu potvrdi prema vlastitoj toleranciji.';
}
function demoLinks(e){
 const all=window.EXERCISE_MEDIA||{};const entries=all.byExerciseId?.[e.id]||all.byVisualKey?.[e.visualKey]||[];
 const rows=Array.isArray(entries)?entries:[entries];
 return rows.filter(x=>x&&x.url).map(x=>'<a class="demo-link" href="'+safeUrl(x.url)+'" target="_blank" rel="noopener">'+I.video+'<span>'+esc(x.title||x.publisher||'Demonstracija autora')+'<small>'+esc(x.label||'Uputa izdavača')+' · '+esc(x.publisher||'')+' ↗</small></span></a>').join('');
}
tabbar=function(){return '<nav class="tabbar gut" aria-label="Glavna navigacija">'+[
 ['home','Danas',I.tabPlay],['protocols','Treninzi',I.tabGrid],['library','Vježbe',I.tabLib],['plan','Plan',I.list],['history','Dnevnik',I.clock]
].map(([v,n,ic])=>'<button class="tab" data-a="tab" data-tab="'+v+'" aria-label="'+n+'" '+(S.tab===v?'aria-current="page"':'')+'>'+ic+'<span>'+n+'</span></button>').join('')+'</nav>';};
const oldRender=render;
render=function(){oldRender();if(['plan','history'].includes(top().v)&&!app.querySelector('.tabbar'))app.insertAdjacentHTML('beforeend',tabbar());};
// The main screens keep explanations in disclosure panels; data and dose rules stay unchanged.
VIEWS.home=function(){
 const today=dateKey(),events=(S.plan||[]).filter(x=>x.date===today);
 const pending=(S.log||[]).filter(l=>l.v===2&&!l.nextDay&&Date.now()-l.at>12*3600000&&Date.now()-l.at<7*864e5);
 const rehab=Object.values(S.pr).find(p=>p.home==='rehab'),akt=S.pr['aktivacija-kratka'];
 return '<div class="view gut home-simple">'+topbar('', '<button class="ib" data-a="dataSheet" aria-label="Podaci i postavke">'+I.gear+'</button>')+
 '<p class="eyebrow">'+esc(new Date().toLocaleDateString('hr-HR',{weekday:'long',day:'numeric',month:'long'}))+'</p><h1 class="h1">Vrijeme za tebe.</h1>'+
 (S.resume?noteBox('Nastavi gdje si stao','<p>'+esc(S.resume.title)+'</p>'+actionBtn('resumePlay','Nastavi trening')+actionBtn('discardResume','Završi kao prekinuto')):'')+
 (events.length?'<section class="today-plan"><h2 class="h2">Danas na rasporedu</h2>'+events.map(planRow).join('')+'</section>':'')+
 '<button class="home-feature" data-a="tab" data-tab="protocols"><span class="home-feature-art">'+realPoster('trx-veslanje',I.dumb)+'</span><span class="home-feature-copy"><small>TVOJ TEMPO</small><b>Odaberi trening</b><span>Snaga, kontrola i mobilnost '+I.chev+'</span></span></button>'+
 '<div class="quick-grid">'+(rehab?'<button data-a="openPr" data-id="'+esc(rehab.id)+'">'+pathIcon(I.pulse,24)+'<b>Snaga i kontrola</b><small>'+protoMin(rehab)+' min</small></button>':'')+(akt?'<button data-a="openPr" data-id="'+esc(akt.id)+'">'+pathIcon(I.rope,24)+'<b>Aktivacija</b><small>Kratka priprema</small></button>':'')+'<button data-a="fieldList">'+pathIcon(I.run,24)+'<b>Na terenu</b><small>'+Object.keys(S.field).length+' treninga</small></button><button data-a="tab" data-tab="library">'+pathIcon(I.book,24)+'<b>Knjižnica</b><small>'+Object.keys(S.ex).length+' vježbi</small></button></div>'+
 (pending.length?noteBox('Kako se osjećaš danas?',pending.slice(0,2).map(l=>'<div class="feedback-row"><span>'+esc(l.name)+'</span>'+actionBtn('nextDay','Zabilježi','data-id="'+esc(l.id)+'"')+'</div>').join('')):'')+
 '<div class="home-links">'+actionBtn('profile','Oprema i postavke')+actionBtn('guide','Kako napredovati')+'</div></div>';
};
libFiltered=function(){
 const norm=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const q=norm(S.lib.q),c=S.lib.cat;
 return Object.values(S.ex).filter(e=>{
  if(q&&!norm([e.name,e.equipment,e.goal,...(e.zones||[])].join(' ')).includes(q))return false;
  if(S.lib.zone&&!(e.zones||[]).includes(S.lib.zone))return false;
  if(S.lib.level&&Number(e.level)!==Number(S.lib.level))return false;
  if(S.lib.equipment&&!(e.equipmentKeys||[]).includes(S.lib.equipment))return false;
  if(S.lib.owned&&(e.optionalEquipment||e.availableByDefault===false))return false;
  if(S.lib.recorded&&!realMedia(e)&&!MEDIA[e.media])return false;
  if(c==='Sve')return true;if(c==='Favoriti')return !!e.fav;
  if(c==='TRX')return /trx/i.test(e.name+' '+e.equipment);
  if(c==='Rehab kuka')return e.cat==='Rehab';if(c==='Uže i kolotur')return !!e.cord;
  return e.cat===c;
 }).sort((a,b)=>(a.order||999)-(b.order||999)||a.name.localeCompare(b.name,'hr'));
};
VIEWS.library=function(){
 const picking=!!S.pick,favN=Object.values(S.ex).filter(e=>e.fav).length;
 const active=!!(S.lib.zone||S.lib.level||S.lib.equipment||S.lib.recorded||S.lib.cat!=='Sve'||!S.lib.owned);
 const head=picking?topbar('<button class="txtbtn" data-a="pickCancel">Odustani</button>','','DODAJ VJEŽBE'):topbar('','<button class="ib" data-a="newEx" aria-label="Nova vježba">'+I.plus+'</button>');
 return '<div class="view gut library-simple">'+head+'<h1 class="h1">'+(picking?'Odaberi vježbe':'Knjižnica')+'</h1>'+
 (picking?'':'<div class="tiles"><button class="tile" data-a="libCat" data-cat="Favoriti" aria-pressed="'+(S.lib.cat==='Favoriti')+'"><span class="circ">'+I.heart+'</span><span class="lbl"><b>Favoriti</b><span>'+nVj(favN)+'</span></span></button><button class="tile" data-a="tab" data-tab="protocols"><span class="circ">'+I.dots4+'</span><span class="lbl"><b>Moji treninzi</b><span>'+Object.keys(S.pr).length+' protokola</span></span></button></div>')+
 '<div class="search-line"><div class="search">'+I.search+'<input id="libq" class="input" type="search" placeholder="Traži vježbu" aria-label="Traži vježbu" autocomplete="off" value="'+esc(S.lib.q)+'"></div><button class="filter-toggle '+(active?'is-active':'')+'" data-a="toggleFilters" aria-label="Filtri" aria-controls="exercise-filters" aria-expanded="'+!!S.lib.filtersOpen+'">'+I.gear+'</button></div>'+
 '<div id="exercise-filters" '+(S.lib.filtersOpen?'':'hidden')+'><div class="chips wrap" role="group" aria-label="Kategorija">'+LIBCATS.map(c=>'<button class="chip" data-a="libCat" data-cat="'+esc(c)+'" aria-pressed="'+(S.lib.cat===c)+'">'+esc(c)+'</button>').join('')+'</div><div class="filter-grid">'+smallSelect('Područje','lib-zone',S.lib.zone||'',[['','Sva područja'],...[...new Set(Object.values(S.ex).flatMap(e=>e.zones||[]))].sort((a,b)=>a.localeCompare(b,'hr')).map(z=>[z,z])])+smallSelect('Zahtjevnost','lib-level',S.lib.level||'',[['','Sve razine'],['1','Osnove'],['2','Srednje'],['3','Napredno'],['4','Zahtjevno']])+smallSelect('Oprema','lib-equipment',S.lib.equipment||'',[['','Sva oprema'],...Object.entries(window.SEED.equipmentLabels||{})])+'</div><label class="checkline"><input type="checkbox" id="lib-owned" '+(S.lib.owned?'checked':'')+'> Moja oprema</label><label class="checkline"><input type="checkbox" id="lib-recorded" '+(S.lib.recorded?'checked':'')+'> Samo sa snimkom</label>'+actionBtn('clearFilters','Poništi filtre')+'</div>'+
 '<div class="list-caption"><span id="filter-count">'+libFiltered().length+' vježbi · '+Object.keys(S.ex).length+' u knjižnici</span>'+(active?'<button class="txtbtn" data-a="clearFilters">Poništi filtre</button>':'')+'</div><div class="list" id="liblist">'+libListHtml()+'</div></div>'+
 (picking?'<div class="footer gut"><button class="btn" data-a="pickDone" '+(S.pick.ids.length?'':'disabled')+'>Dodaj u protokol ('+S.pick.ids.length+')</button></div>':'');
};
S.lib.owned=true;
VIEWS.ex=function(t){
 const e=S.ex[t.id];if(!e)return '<div class="view gut">'+topbar(backBtn())+noteBox('Vježba nije dostupna','')+'</div>';
 const opts=doseOptions(e),sel=t.dose??1,it=opts[sel].it,p=E.progression(e,it,S.log,S.profile),pg=e.progression||{};
 const more='<h3>Priprema</h3><p>'+esc(e.setup||e.equipment)+'</p><h3>Izvedba</h3>'+bullets(e.steps)+'<h3>Na što pripaziti</h3><p>'+esc(e.note||'')+'</p>'+bullets(e.stopRules||[])+'<h3>Kontrola pokreta</h3>'+bullets(e.techniqueChecks||[])+'<h3>Česte pogreške</h3>'+bullets(e.commonErrors||[])+'<p>'+esc(e.counting||'')+' '+esc(e.loadRule?.note||'')+'</p>'+
 '<h3>Sljedeći korak</h3><b>'+esc(p.label)+'</b><p>'+esc(p.reason)+'</p>'+(p.action!=='hold'&&p.action!=='review'?actionBtn('useProgress','Primijeni prijedlog'):'')+
 fold('Kriteriji napredovanja','<b>Prije početka</b>'+bullets(pg.entry)+'<b>Napreduj kada</b>'+bullets(pg.advance)+'<b>Smanji zahtjevnost kada</b>'+bullets(pg.regress))+
 ((e.regressionIds||[]).length?'<h3>Lakše varijante</h3><div class="chips wrap">'+e.regressionIds.map(exLink).join('')+'</div>':'')+
 ((e.progressionIds||[]).length?'<h3>Sljedeće varijante</h3><div class="chips wrap">'+e.progressionIds.map(exLink).join('')+'</div>':'')+
 fold('Izvori i snimke',mediaCredit(e)+demoLinks(e)+sourceLinks(e));
 return '<div class="view exercise-simple"><div class="gut">'+topbar(backBtn(),'<button class="ib" data-a="fav" data-id="'+e.id+'" aria-label="Favorit" aria-pressed="'+!!e.fav+'">'+(e.fav?I.heartF:I.heart)+'</button><button class="ib" data-a="editEx" data-id="'+e.id+'" aria-label="Uredi vježbu">'+I.edit+'</button>')+'</div>'+mediaHtml(e)+'<div class="gut detail-body"><h1 class="exercise-title">'+esc(e.name)+'</h1><p class="subline">'+esc(exMeta(e))+'</p>'+
 '<div class="chips dose-chips" aria-label="Doziranje">'+opts.map((o,i)=>'<button class="chip" data-a="dose" data-i="'+i+'" aria-pressed="'+(i===sel)+'">'+o.label+'</button>').join('')+'</div><div class="dose-summary"><strong>'+esc(dose(it))+'</strong><span>Odmor '+it.rest+' s'+(e.tempo?' · Tempo '+esc(e.tempo):'')+'</span></div>'+
 (sel===2?'<div class="panel">'+quickDose('Serije','sets',it.sets)+quickDose(it.measure==='time'?'Sekunde':'Ponavljanja',it.measure==='time'?'sec':'reps',it.measure==='time'?it.sec:it.reps)+quickDose('Odmor (s)','rest',it.rest)+(it.measure==='sets'?quickDose('Težina (kg)','kg',it.kg||0):'')+'</div>':'')+
 (p.action==='review'?'<p class="warning">'+esc(p.label)+': '+esc(p.reason)+'</p>':'')+
 fold('Prikaži više',more,'Tehnika, na što pripaziti i napredovanje')+'</div></div><div class="footer gut"><div class="seg"><button class="btn sec" data-a="addTo" data-id="'+e.id+'">Dodaj u trening</button><button class="btn" data-a="playEx" data-id="'+e.id+'">'+I.play+'Pokreni</button></div></div>';
};
function quickDose(label,key,value){return '<div class="prow"><span>'+label+'</span><div class="step">'+actionBtn('quickDose','−','data-k="'+key+'" data-d="-1"')+'<b>'+value+'</b>'+actionBtn('quickDose','+','data-k="'+key+'" data-d="1"')+'</div></div>';}
function planRow(x){const p=x.kind==='protocol'?S.pr[x.refId]:x.kind==='field'?S.field[x.refId]:null;const title=p?(p.name||p.name_hr):x.name||({club:'Klupski trening',match:'Utakmica',rest:'Oporavak'}[x.kind]||'Trening');return '<div class="plan-row"><div><b>'+esc(title)+'</b><span>'+esc(x.time||'')+' · '+esc(x.intensity==='high'?'Zahtjevniji dan':x.kind==='rest'?'Oporavak':'Planirano')+'</span></div>'+(p?actionBtn(x.kind==='protocol'?'openPr':'openField','Otvori','data-id="'+esc(x.refId)+'"'):'')+'</div>';}
VIEWS.plan=function(){
 const offset=S.weekOffset||0;let start=new Date();start.setDate(start.getDate()-((start.getDay()+6)%7)+offset*7);const days=Array.from({length:7},(_,i)=>{const d=new Date(start);d.setDate(d.getDate()+i);return dateKey(d);});const w=E.weekLoad(S.log,days[0]);
 return '<div class="view gut">'+topbar('', '<button class="ib" data-a="profile" aria-label="Postavke plana">'+I.gear+'</button>')+'<h1 class="h1">Tvoj tjedan</h1><p class="sub">Nogomet, snaga i oporavak na jednom mjestu.</p><div class="week-switch">'+actionBtn('week','←','data-d="-1"')+'<b>'+E.dayLabel(days[0])+' – '+E.dayLabel(days[6])+'</b>'+actionBtn('week','→','data-d="1"')+'</div><div class="metrics"><div><b>'+w.sessions+'</b><span>odrađenih treninga</span></div><div><b>'+w.minutes+'</b><span>minuta</span></div><div><b>'+w.load+'</b><span>min × RPE</span></div></div><p class="micro">Opterećenje je opisni pokazatelj, bez automatskog „sigurnog” praga ozljede.</p>'+
 days.map(day=>{const events=S.plan.filter(x=>x.date===day),warn=E.planWarnings(S.plan,S.pr,S.field,day,S.log);return '<section class="day-card '+(day===dateKey()?'today':'')+'"><div class="section-line"><b>'+E.dayLabel(day)+'</b>'+actionBtn('planAdd','+ Dodaj','data-date="'+day+'"')+'</div>'+(events.length?events.map(x=>'<div>'+planRow(x)+actionBtn('planRemove','Ukloni iz plana','data-id="'+x.id+'"')+'</div>').join(''):'<p class="micro">Bez planiranog treninga</p>')+warn.map(t=>'<p class="warning">'+esc(t)+'</p>').join('')+'</section>';}).join('')+
 '<div class="stack" style="gap:12px;margin:20px 0">'+actionBtn('planTemplate','Složi primjer tjedna','data-date="'+days[0]+'"')+actionBtn('pdfSchedule','Plan iz poslanog PDF-a')+(S.lastRemovedPlan?actionBtn('undoPlan','Vrati posljednje uklonjeno'):'')+'</div></div>';
};
VIEWS.planAdd=function(t){const options=[['rest','Oporavak'],['club','Klupski trening'],['match','Utakmica'],...Object.values(S.pr).map(p=>['p:'+p.id,p.name]),...Object.values(S.field).map(f=>['f:'+f.id,f.name_hr])];return '<div class="view gut">'+topbar(backBtn())+'<h1 class="h1">Dodaj u plan</h1><div class="form-stack">'+fieldInput('Datum','plan-date',t.date,'date')+smallSelect('Trening','plan-ref','rest',options)+fieldInput('Vrijeme (opcionalno)','plan-time','','time')+smallSelect('Planirani napor','plan-intensity','moderate',[['low','Lagan'],['moderate','Umjeren'],['high','Zahtjevan']])+'</div></div><div class="footer gut"><button class="btn" data-a="planSave">Spremi u plan</button></div>';};
VIEWS.history=function(){return '<div class="view gut">'+topbar('', '<button class="ib" data-a="externalLog" aria-label="Zapiši klupski trening">'+I.plus+'</button>')+'<h1 class="h1">Dnevnik</h1><p class="sub">Stvarno odrađeno, uključujući klupske treninge.</p><div class="list" style="margin-top:22px">'+(S.log.length?S.log.map(l=>'<button class="row" data-a="logDetail" data-id="'+esc(l.id||l.at)+'"><span class="thumb">'+(l.status==='complete'?I.check:I.clock)+'</span><span class="tx"><span class="t">'+esc(l.name)+'</span><span class="m">'+esc(new Date(l.at).toLocaleDateString('hr-HR'))+' · '+fmt(l.secs||0)+' · '+(l.status==='partial'?'djelomično':l.status==='not-done'?'prekinuto':l.v===2?'odrađeno':'stari zapis')+'</span><span class="m">'+(l.rpe?'RPE '+l.rpe:'')+(l.nextDay?' · sutradan: '+({same:'isto',better:'bolje',worse:'lošije'}[l.nextDay]||l.nextDay):'')+'</span></span>'+I.chev+'</button>').join(''):noteBox('Prvi zapis počinje treningom','<p>Nakon treninga spremi rezultat. Klupski trening i utakmicu možeš dodati ručno.</p>'))+'</div><div style="height:24px"></div></div>';};
VIEWS.logDetail=function(t){const l=S.log.find(x=>(x.id||String(x.at))===t.id);if(!l)return VIEWS.history();const rows=Object.values(l.records||{});return '<div class="view gut">'+topbar(backBtn())+'<h1 class="h1">'+esc(l.name)+'</h1><p class="sub">'+esc(new Date(l.at).toLocaleString('hr-HR'))+'</p>'+noteBox('Kako je trening prošao','<p>Trajanje '+fmt(l.secs||0)+' · RPE '+(l.rpe||'—')+' · Bol '+(l.pain??'—')+'/10</p><p>'+esc(l.notes||'')+'</p>'+actionBtn('nextDay','Reakcija sljedeći dan','data-id="'+esc(l.id||l.at)+'"'))+
 '<div class="list">'+rows.map(r=>'<div class="record-row"><b>'+esc(S.ex[r.exId]?.name||r.label||'Dionica')+'</b><span>'+(r.status==='skipped'?'Preskočeno':('Serija '+(r.set||1)+(r.side?' · '+r.side:'')+' · '+(r.reps?r.reps+' pon.':fmt(r.seconds||0))+(r.kg?' · '+r.kg+' '+esc(S.ex[r.exId]?.loadRule?.unit||'kg'):'')+' · RIR '+(r.rir??'—')))+(r.distance?' · '+r.distance+' m':'')+'</span>'+(r.setup?'<span>Postav: '+esc(r.setup)+'</span>':'')+'</div>').join('')+'</div>'+(!rows.length?'<p class="micro">Ovaj zapis nema detalje pojedinačnih serija.</p>':'')+'</div>';};
VIEWS.externalLog=function(){return '<div class="view gut">'+topbar(backBtn())+'<h1 class="h1">Zapiši trening</h1><div class="form-stack">'+smallSelect('Vrsta','ext-kind','club',[['club','Klupski trening'],['match','Utakmica'],['other','Drugi trening']])+fieldInput('Naziv','ext-name','Klupski trening')+fieldInput('Datum','ext-date',dateKey(),'date')+fieldInput('Trajanje (min)','ext-min',60,'number','min="1" max="300"')+fieldInput('Napornost RPE 1–10','ext-rpe',6,'number','min="1" max="10"')+fieldInput('Bol 0–10','ext-pain',0,'number','min="0" max="10"')+fieldInput('Metri sprinta (opcionalno, iz GPS-a)','ext-sprint','','number','min="0"')+'<p class="micro">Za usporedbu sprinta uvijek koristi isti osobni prag brzine.</p></div></div><div class="footer gut"><button class="btn" data-a="saveExternal">Spremi zapis</button></div>';};
VIEWS.profile=function(){const p=S.profile;return '<div class="view gut">'+topbar(backBtn())+'<h1 class="h1">Moja oprema i plan</h1><div class="form-stack">'+smallSelect('Razdoblje','profile-season',p.season,[['competition','Natjecateljsko razdoblje'],['preseason','Pripreme'],['return','Povratak uz dogovoreni plan']])+smallSelect('Uobičajeni dan utakmice','profile-match',p.matchDay,[[0,'Nedjelja'],[1,'Ponedjeljak'],[2,'Utorak'],[3,'Srijeda'],[4,'Četvrtak'],[5,'Petak'],[6,'Subota']])+fieldInput('Duljina terena (m)','profile-length',p.pitchLength,'number','min="60" max="120"')+fieldInput('Širina terena (m)','profile-width',p.pitchWidth,'number','min="40" max="90"')+fieldInput('MAS procjena (m/s)','profile-mas',p.mas||'','number','min="1" max="8" step="0.01"')+fieldInput('Osobna maksimalna brzina (km/h)','profile-speed',p.maxSpeed||'','number','min="5" max="45" step="0.1"')+fieldInput('Raspoloživ korak šipke (kg ukupno)','profile-step',p.barbellStep,'number','min="0.5" max="10" step="0.5"')+
 noteBox('Tvoja teretana','<p>Kavez i zgibovi, podesiva klupa, olimpijska šipka i bumperi, bučice u parovima 2,5 / 5 / 7,5 / 10 / 15 / 20 kg, dvije girje po 20 kg, TRX, švedske ljestve, landmine, plyobox, medicinke, elastična užad Ø6–16 mm i mini trake, stražnji oslonac za bugarski čučanj, roler za ložu, tatami te mala i velika pilates lopta.</p><p class="micro">Trap bar i bicikl su dodatna oprema i skriveni su kada uključiš filter svoje teretane.</p>')+
 noteBox('Privatnost','<p>Zapisi o treningu i reakciji čuvaju se u ovom pregledniku. Izvezi sigurnosnu kopiju za drugi uređaj.</p>')+'</div></div><div class="footer gut"><button class="btn" data-a="saveProfile">Spremi postavke</button></div>';};
VIEWS.guide=function(){return '<div class="view gut">'+topbar(backBtn())+'<h1 class="h1">Kako napredovati</h1><div class="form-stack">'+noteBox('1 · Kvalitetna početna doza','<p>Odaberi težinu s kojom kontrolirano završavaš raspon uz zadanu rezervu ponavljanja. Nula kg znači da težina tek treba biti odabrana, a ne da je izračunata za tebe.</p>')+noteBox('2 · Zapiši svaku stranu','<p>Player vodi lijevu i desnu stranu zasebno. Unesi stvarna ponavljanja i opterećenje; preskakanje se ne računa kao dovršen rad.</p>')+noteBox('3 · Potvrdi oporavak','<p>Sljedeći dan zabilježi isto, bolje ili lošije stanje. Bol ili pogoršanje zaustavljaju prijedlog povećanja. To je konzervativno pravilo aplikacije, a ne dijagnoza.</p>')+noteBox('4 · Promijeni jednu stvar','<p>Nakon dva odgovarajuća zapisa prvo se predlaže više ponavljanja unutar raspona, zatim mali porast opterećenja. Veliki skok između raspoloživih bučica neće se automatski preporučiti.</p>')+noteBox('5 · Različiti ciljevi, različita pravila','<p>Za skokove i brzinu prednost imaju kvaliteta, puni oporavak i postupno uvođenje. Za rehabilitaciju vrijede kriteriji dogovoreni sa stručnjakom; aplikacija ne odobrava povratak sprintu.</p>')+'<p><a target="_blank" rel="noopener" href="https://pubmed.ncbi.nlm.nih.gov/19204579/">ACSM: načela progresije treninga snage ↗</a></p><p><a target="_blank" rel="noopener" href="https://bjsm.bmj.com/content/57/5/278">London consensus: individualiziran povratak trčanju ↗</a></p></div></div>';};
function normalizedField(f){return E.normalizeField(f,S.profile);}
function pitch(f,block=0,rep=1){return window.PitchVisuals?PitchVisuals.render(f,{length:S.profile.pitchLength,width:S.profile.pitchWidth,block,rep,animate:true,mas_mps:S.profile.mas,acceleration_m:f.acceleration_m,flying_m:f.flying_m}):'';}
VIEWS.field=function(t){const f=S.field[t.id];if(!f)return VIEWS.fieldList();const nf=normalizedField(f),tm=E.fieldDuration(nf,S.profile);return '<div class="view gut">'+topbar(backBtn(),'<button class="ib" data-a="editField" data-id="'+f.id+'" aria-label="Prilagodi trening">'+I.edit+'</button>')+'<h1 class="h1">'+esc(f.name_hr)+'</h1><p class="sub">'+esc(f.goal_hr)+'</p><div class="pitch-card">'+pitch(f,t.block||0,t.rep||1)+'</div><div class="pitch-controls">'+f.blocks.map((b,i)=>actionBtn('previewBlock','Blok '+(i+1),'data-block="'+i+'"')).join('')+(f.id==='intervali-15-15'?actionBtn('previewRep','Sljedeća ruta'):'')+'</div>'+noteBox('Putanja i cilj','<p>'+esc(f.route_text_hr||f.summary_hr)+'</p><p>'+esc(f.summary_hr)+'</p><p class="micro">'+(tm.manual?'Dionice potvrđuješ po stvarnom završetku. Ciljana vremena su smjernice izvora; vrijeme s mobitela nije GPS mjerenje.':'Glavni dio s pripremom playera: '+fmt(tm.seconds)+'. Zagrijavanje i hlađenje zasebno.')+'</p>')+
 (f.customizedAt?noteBox('Tvoja prilagodba','<p>Blokovi ispod prikazuju tvoju spremljenu dozu. Opis i izvorna slika ostaju upute izvora.</p>'):'')+
 (('circuit_reps' in f)?noteBox('Redoslijed krugova','<p>'+(f.circuit_sets||'Odaberi broj')+' serija × '+(f.circuit_reps||'odaberi broj')+' krugova. Svaki krug sadrži sva '+f.blocks.length+' bloka redom. Odmor između serija: '+(f.circuit_set_rest_s??'odaberi')+' s.</p>'):'')+
 ((f.ambiguities||[]).length?noteBox('Napomene uz izvor',bullets(f.ambiguities.map(a=>a.text_hr)),'caution'):'')+
 (f.requires_configuration?.length&&!f.configured?noteBox('Prije početka odaberi postavke','<p>Izvor sadrži nejasne ili nedostajuće vrijednosti. Pregledaj blokove i potvrdi svoju prilagodbu.</p>'+actionBtn('editField','Prilagodi blokove','data-id="'+f.id+'"'),'caution'):'')+
 (f.id.includes('mas')?noteBox('Tvoja MAS','<p>'+(S.profile.mas?'Procjena '+S.profile.mas+' m/s · 15 s: '+Math.round(S.profile.mas*15)+' m · aktivni oporavak: '+Math.round(S.profile.mas*.7*15)+' m.':'Nakon testa spremi prijeđenu udaljenost za osobne dionice.')+'</p>'+actionBtn('profile','Unesi ili provjeri rezultat')):'')+
 '<div class="section-line"><b>Blokovi treninga</b>'+actionBtn('editField','Uredi','data-id="'+f.id+'"')+'</div><div class="list">'+(f.blocks||[]).map((source,i)=>{const b=normalizedField({...f,circuit_reps:0,blocks:[source]}).blocks[0];return '<div class="record-row"><b>'+(i+1)+'. '+esc(b.label_hr)+'</b><span>'+(b.sets||1)+' × '+(b.reps||1)+' · '+(b.distanceBased||b.work_s==null?(b.distance_m||b.distance_m_at_105||'zadana dionica')+' m':fmt(b.work_s))+' · odmor '+(b.rest_s??'odaberi')+' s</span><span>'+esc(b.intensity_hr||'')+'</span>'+(b.target_time_s?'<span>'+esc(b.targetCustom?'Tvoj cilj: ':'Cilj iz izvora: ')+[...new Set(b.target_time_s)].join('–')+' s</span>':'')+(b.cue_hr?'<p>'+esc(b.cue_hr)+'</p>':'')+'</div>';}).join('')+'</div>'+
 noteBox('Priprema za teren','<p>'+esc(f.warmup_hr||'Postupno zagrijavanje: lagano trčanje, dinamički pokreti, tehnika i postupna ubrzanja prema današnjem cilju.')+'</p>'+actionBtn('openPr','Otvori pripremu za teren','data-id="zagrijavanje-teren"'))+
 (f.diagram_image?'<details class="detail-accordion"><summary>Izvorna slika i oznake iz PDF-a</summary><a href="'+esc(f.source_image)+'" target="_blank"><img class="source-figure" loading="lazy" src="'+esc(f.diagram_image)+'" alt="Izvorni prikaz '+esc(f.name_hr)+'"><span>Otvori izvornu stranicu '+f.source_page+' ↗</span></a><p class="micro">'+esc(f.source_title)+'. Usporedi napomene o dimenzijama.</p></details>':'')+
 (f.source_url?'<p><a href="'+safeUrl(f.source_url)+'" target="_blank" rel="noopener">'+esc(f.source_title||'Izvor')+' ↗</a></p>':'')+
 '<p class="micro">'+esc(f.cooldown_hr||'Završni lagani oporavak prilagodi treningu.')+'</p></div><div class="footer gut"><button class="btn" data-a="startField" data-id="'+f.id+'">Pripremi trening</button></div>';};
VIEWS.fieldEdit=function(){const f=S.fieldDraft;return '<div class="view gut">'+topbar(backBtn())+'<h1 class="h1">Prilagodi teren</h1><div class="form-stack">'+noteBox('Tvoja izvedba','<p>Vrijednosti koje izmijeniš spremaju se kao tvoja prilagodba. Izvorna slika ostaje dostupna.</p>')+
 (('circuit_reps' in f)?'<div class="form-grid">'+fieldInput('Serije krugova','fc-sets',f.circuit_sets||1,'number','min="1" max="10"')+fieldInput('Krugovi po seriji','fc-reps',f.circuit_reps??'','number','min="1" max="20"')+fieldInput('Odmor između serija (s)','fc-rest',f.circuit_set_rest_s??'','number','min="0" max="900"')+'</div>':'')+
 (f.id==='izlozenost-maksimalnoj-brzini'?fieldInput('Zona ubrzanja (m)','field-acceleration',f.acceleration_m??'','number','min="10" max="60"')+fieldInput('Leteća zona (m)','field-flying',f.flying_m??'','number','min="10" max="60"'):'')+f.blocks.map((b,i)=>'<section class="note-box"><b>'+esc(b.label_hr)+'</b><div class="form-grid">'+fieldInput('Serije','fb-sets-'+i,b.sets||1,'number','min="1" max="20"')+fieldInput('Ponavljanja','fb-reps-'+i,b.reps??'','number','min="1" max="50"')+fieldInput(b.distanceBased||b.work_s==null?'Cilj vremena (s), opcionalno':'Rad (s)','fb-work-'+i,b.work_s||b.target_time_s?.[0]||'','number','min="0" max="1800"')+fieldInput('Odmor (s)','fb-rest-'+i,b.rest_s??'','number','min="0" max="900"')+fieldInput('Odmor između serija (s)','fb-srest-'+i,b.set_rest_s??b.rest_s??'','number','min="0" max="900"')+'</div></section>').join('')+'<label class="checkline"><input id="field-confirm" type="checkbox"> Pregledao sam izvorne napomene i potvrdio svoju dozu.</label></div></div><div class="footer gut"><button class="btn" data-a="saveField">Spremi prilagodbu</button></div>';};
VIEWS.pdfSchedule=function(){const p=window.PDF_PLAN;return '<div class="view gut">'+topbar(backBtn())+'<h1 class="h1">Predsezonski plan</h1><p class="sub">STATSports · poslani PDF · 11 treninga</p>'+noteBox('Kako ga koristiti','<p>'+esc(p?.schedule.note_hr||'')+'</p><p>Prikazan je raspored izvora. Kombinaciju s klupskim treninzima i snagom odaberi prema svom opterećenju.</p>')+(p?.schedule.weeks||[]).map(w=>'<section class="day-card"><b>Tjedan '+w.week+'</b>'+Object.entries(w.days).filter(([,id])=>id).map(([day,id])=>'<button class="opt" data-a="openField" data-id="'+id+'"><span>'+day.toUpperCase()+' · '+esc(S.field[id]?.name_hr||id)+'</span>'+I.chev+'</button>').join('')+'</section>').join('')+'<details class="detail-accordion"><summary>Izvorni raspored</summary><img class="source-figure" src="assets/pdf/statsports-page-02.webp" alt="Izvorni raspored treninga"></details><div class="form-stack">'+fieldInput('Početni ponedjeljak za unos u plan','pdf-start',mondayKey(),'date')+actionBtn('importPdfPlan','Dodaj ovaj raspored u moj plan')+'<p class="micro">Dodaje terenske treninge, bez brisanja postojećih. Nakon unosa provjeri označena preklapanja.</p></div></div>';};
function mondayKey(){const d=new Date();d.setDate(d.getDate()+((8-d.getDay())%7));return dateKey(d);}
function checkpoint(){if(!P)return;lsSet('mt.active.v2',{...P,left:remainingSafe(),paused:true,pauseAt:P.pauseAt||Date.now(),savedAt:Date.now()});}
function remainingSafe(){return P&&!P.done?remaining():0;}
function resumeClock(){if(P.pauseAt){const pausedFor=Date.now()-P.pauseAt;P.stepPausedMs=(P.stepPausedMs||0)+pausedFor;P.pausedMs=(P.pausedMs||0)+pausedFor;P.pauseAt=null;}P.paused=false;P.endAt=Date.now()+(P.left||0)*1000;}
function pausePlayer(){if(!P||P.done)return;ensureAudio();if(P.paused){resumeClock();keepAwake(true);}else{P.left=remaining();P.paused=true;P.pauseAt=Date.now();}checkpoint();render();}
function recordStep(status){
 if(!P)return;const st=P.steps[P.i];if(!st?.recordKey)return;
 const d=P.setDraft||{},seconds=st.dur||Math.max(0,(Date.now()-(P.stepStartedAt||Date.now())-(P.stepPausedMs||0))/1000);
 P.records[st.recordKey]={exId:st.e?.id||st.it?.exId||null,label:st.e?.name||st.b?.label_hr||'',set:st.set||1,side:st.sideKey||'',status,seconds:Math.round(seconds),reps:st.kind==='manual'?Number(d.reps??st.it?.reps??0):0,kg:Number(d.kg??st.it?.kg??0),rir:d.rir==null?null:Number(d.rir),setup:d.setup||'',quality:d.quality!==false,pain:Number(d.pain||0),distance:st.b?.distance_m||0,at:Date.now(),planned:st.it?clone(st.it):{work_s:st.b?.work_s,target_time_s:st.b?.target_time_s}};
 P.lastWorkSeconds=seconds;checkpoint();
}
function announceStep(st){if(!S.settings.sound||!S.settings.voice||!window.speechSynthesis)return;try{speechSynthesis.cancel();const words=st.kind==='manual'||st.kind==='work'||st.kind==='distance'?(st.e?.name||st.b?.label_hr||'Rad')+' '+(st.side||''):st.kind==='active'?'Aktivni oporavak':st.kind==='rest'?'Odmor':st.kind==='switch'?'Promjena strane':'Pripremi se';const u=new SpeechSynthesisUtterance(words);u.lang='hr-HR';u.rate=1;speechSynthesis.speak(u);}catch(e){}}
const originalEnterStep=enterStep;
enterStep=function(i){
 if(P&&P.steps[i]?.kind==='rest'&&P.steps[i].b?.dynamicRest){P.steps[i].dur=Math.max(0,60-(P.lastWorkSeconds||0));if(!P.steps[i].dur){enterStep(i+1);return;}}
 if(P)P.stepPausedMs=0;originalEnterStep(i);if(P&&!P.done&&P.steps[i]?.e){const old=E.exerciseHistory(P.steps[i].e.id,S.log)[0];const previous=[...Object.values(P.records||{}).reverse(),...Object.values(old?.records||{})].find(r=>r.exId===P.steps[i].e.id&&r.setup);if(previous)P.setDraft.setup=previous.setup;}
};
const originalStartPlayer=startPlayer;
startPlayer=function(cfg){S.resume=null;originalStartPlayer(cfg);checkpoint();};
document.addEventListener('visibilitychange',()=>{if(!P||P.done)return;if(document.visibilityState==='hidden'&&!P.paused){P.left=remaining();P.paused=true;P.pauseAt=Date.now();P.backgroundPaused=true;checkpoint();}else if(document.visibilityState==='visible'){keepAwake(true);render();}});
window.addEventListener('pagehide',()=>{if(P)checkpoint();});
VIEWS.play=function(){
 if(!P)return VIEWS.home();
 if(P.done){const sm=P.summary||E.sessionSummary(P.steps,P.records);return '<div class="view gut">'+topbar('','')+'<div class="done"><span class="ck">'+(sm.status==='complete'?I.check:I.clock)+'</span><h1>'+({complete:'Trening odrađen',partial:'Djelomično odrađeno','not-done':'Trening prekinut'}[sm.status])+'</h1><p>'+sm.done+' / '+sm.total+' radnih koraka · '+fmt(P.secs||0)+'</p><p>'+esc(P.title)+'</p></div><div class="form-stack">'+fieldInput('Napornost treninga · RPE 1–10','finish-rpe',P.feedback?.rpe??'','number','min="1" max="10"')+fieldInput('Najveća bol tijekom treninga · 0–10','finish-pain',P.feedback?.pain??0,'number','min="0" max="10"')+smallSelect('Kvaliteta izvedbe','finish-quality',P.feedback?.quality||'good',[['good','Kontrolirana'],['mixed','Mješovita'],['poor','Loša / kompenzacije']])+
 (P.ref?.id==='mas-test-5-min'?fieldInput('Prijeđena udaljenost u 5 min (m)','finish-mas','','number','min="100" max="2500"'):'')+
 '<label class="field"><span class="label">Bilješka</span><textarea class="input" id="finish-notes" rows="2">'+esc(P.feedback?.notes||'')+'</textarea></label><p class="micro">Za napredovanje sljedeći dan potvrdi reakciju u dnevniku.</p></div></div><div class="footer gut"><button class="btn" data-a="finishPlay">Spremi trening</button></div>';}
 const st=P.steps[P.i],v=curView(),isManual=st.kind==='manual',isDistance=st.kind==='distance',isWork=isManual||isDistance||st.kind==='work';
 const done=Object.keys(P.records).length,total=P.steps.filter(x=>x.recordKey).length;
 const big=isDistance?fmt(Math.max(0,((P.paused?P.pauseAt:Date.now())-(P.stepStartedAt||Date.now())-(P.stepPausedMs||0))/1000)):v.big;
 const media=P.mode==='field'?'<div class="pitch-card">'+pitch(P.f,st.g,st.rep||1)+'</div>':mediaHtml(v.e,st.side?st.side+' · '+st.set+'/'+st.it.sets:'');
 const details=P.mode==='field'?noteBox(st.kind==='active'?'Aktivni oporavak':st.kind==='rest'?'Odmor':'Dionica','<p>'+esc(st.b?.label_hr||P.title)+'</p><p>'+esc(st.kind==='active'?'Trči na 70 % MAS; ovo nije stajanje.':st.kind==='rest'?st.label||'Odmor':st.b?.intensity_hr||'')+'</p>'+(st.b?.distance_m&&isWork?'<strong>'+st.b.distance_m+' m</strong>':'')+(st.b?.target_time_s&&isWork?'<p>Cilj: '+st.b.target_time_s.join('–')+' s · ručno mjerenje</p>':'')+'<p>'+esc(st.b?.cue_hr||'')+'</p>'):
 fold('Prikaži više','<h3>Izvedba</h3>'+bullets(v.e?.steps)+(v.e?.note?'<p>'+esc(v.e.note)+'</p>':'')+'<h3>Na što pripaziti</h3>'+bullets(v.e?.stopRules||[])+mediaCredit(v.e));
 return '<div class="view player-simple"><div class="gut">'+topbar('<button class="ib" data-a="quitPlay" aria-label="Prekini trening">'+I.back+'</button>','<button class="ib" data-a="playSettings" aria-label="Postavke playera">'+I.gear+'</button><button class="ib" data-a="playList" aria-label="Popis vježbi">'+I.list+'</button>')+'</div><div class="prog" role="progressbar" aria-label="Odrađeni koraci" aria-valuenow="'+Math.round(done/Math.max(1,total)*100)+'"><i id="progbar" style="width:'+(done/Math.max(1,total)*100)+'%"></i></div>'+media+
 '<div class="gut"><h1 class="player-title">'+esc(P.mode==='field'?st.b?.label_hr||P.title:v.title)+'</h1><p class="meta">'+esc(P.mode==='field'?'Ponavljanje '+(st.rep||1)+'/'+(st.reps||1)+' · serija '+(st.set||1)+'/'+(st.sets||1):v.meta)+'</p>'+
 (P.backgroundPaused?'<p class="warning">Trening je pauziran pri izlasku iz aplikacije. Nastavi kada si spreman.</p>':'')+
 '<div class="timer-display" id="fbig" aria-live="off">'+(P.paused?'Pauza':esc(big))+'</div><p class="hint">'+esc(isManual?'Odradi označenu stranu i zapiši rezultat.':isDistance?'Dodirni „Dionica gotova” po stvarnom završetku.':st.kind==='active'?'Aktivni oporavak u pokretu':st.kind==='switch'?'Namjesti se za drugu stranu':st.kind==='rest'?'Odmor':st.kind==='prep'?'Pripremi se za prvi radni korak.':'Kontrolirano odradi interval.')+'</p>'+
 (isManual?'<div class="set-entry">'+fieldInput('Ponavljanja','set-reps',P.setDraft.reps??st.it.reps,'number','min="0" max="100"')+fieldInput('Težina kg','set-kg',P.setDraft.kg??st.it.kg??0,'number','min="0" max="400" step="0.5"')+fieldInput('RIR 0–10','set-rir',P.setDraft.rir??'','number','min="0" max="10"')+'</div>'+(['trx','band','band-assistance'].includes(st.e?.loadRule?.type)?fieldInput('Postav opreme · kut / duljina / otpor','set-setup',P.setDraft.setup||''):''):'')+details+'</div></div>'+
 '<div class="player-footer gut"><div class="player-actions">'+actionBtn('pausePlay',P.paused?'Nastavi':'Pauza')+actionBtn('skipStep',isWork?'Preskoči seriju':'Preskoči odmor')+'</div>'+(isManual||isDistance?'<button class="btn" data-a="completeStep" '+(P.paused?'disabled':'')+'>'+(isDistance?'Dionica gotova':'Serija gotova')+'</button>':'<button class="btn sec" data-a="jump" data-d="1">Sljedeća vježba / blok</button>')+'</div>';
};
paintPlayer=function(full){if(top().v!=='play'||!P)return;if(full){render();return;}const st=P.steps[P.i];if(!st)return;const fb=document.getElementById('fbig');if(fb&&!P.paused){const val=st.kind==='distance'?fmt(Math.max(0,(Date.now()-(P.stepStartedAt||Date.now())-(P.stepPausedMs||0))/1000)):st.kind==='manual'?st.set+'/'+st.it.sets:(remaining()>=60?fmt(remaining()):String(Math.ceil(remaining())));fb.textContent=val;}if(P._lastI!==P.i){P._lastI=P.i;render();}};
const val=id=>document.getElementById(id)?.value||'';
const numberValue=(id,min,max,optional=false)=>{const x=val(id);if(optional&&x==='')return null;const n=Number(x);if(x===''||!Number.isFinite(n)||n<min||n>max||(/(?:sets|reps)/.test(id)&&!Number.isInteger(n)))throw Error('Provjeri polje: '+(document.getElementById(id)?.closest('label')?.innerText||id));return n;};
function runForm(fn){try{fn();}catch(e){toast(e.message||'Provjeri upisane vrijednosti.');}}
function prepareStart(kind,id,items){if(kind==='protocol'&&!S.pr[id]?.items.length){toast('Prvo dodaj vježbe u protokol.');return;}S.pendingStart={kind,id,items};go({v:'readiness'});}
VIEWS.readiness=function(){const pending=S.pendingStart;if(!pending)return VIEWS.home();const f=pending.kind==='field'?S.field[pending.id]:null;const name=f?.name_hr||S.pr[pending.id]?.name||S.ex[pending.id]?.name||'Trening';return '<div class="view gut">'+topbar(backBtn())+'<h1 class="h1">Prije početka</h1><p class="sub">'+esc(name)+'</p><div class="form-stack">'+fieldInput('Trenutačna bol · 0–10','ready-pain','','number','min="0" max="10"')+fieldInput('Umor · 0 svjež, 10 iscrpljen','ready-fatigue',3,'number','min="0" max="10"')+smallSelect('Reakcija na prethodni trening','ready-response','same',[['same','Bez pogoršanja'],['better','Bolje'],['worse','Lošije'],['unknown','Nisam pratio']])+
 (f?'<label class="checkline"><input type="checkbox" id="ready-warm"> Završio sam dinamičko zagrijavanje primjereno današnjem treningu.</label>':'')+
 (f?.intensityLevel==='high'?noteBox('Zahtjevnije trčanje','<p>Uzmi u obzir klupski rad i utakmicu. Sprint ne započinji uz bol. Kod povratka nakon ozljede slijedi individualno dogovoren plan.</p>','caution'):'')+
 (S.profile.returnMode?'<label class="checkline"><input id="ready-clinician" type="checkbox"> Ovaj trening odgovara mojem dogovorenom planu povratka.</label>':'')+
 noteBox('Spremanje','<p>Aktivni trening se čuva na ovom uređaju. Izlazak u drugu aplikaciju pauzira trening kako se ne bi preskočile neodrađene faze.</p>')+'</div></div><div class="footer gut"><button class="btn" data-a="beginReady">Pokreni trening</button></div>';};
const originalPr=VIEWS.pr;
VIEWS.pr=function(t){let h=originalPr(t);const p=S.pr[t.id];if(!p)return h;const info=noteBox('Doza prema današnjoj spremnosti','<p>'+esc(p.purpose||'Početna doza je predložak. Svoje težine i napredovanje prilagodi zadanoj rezervi ponavljanja i kvaliteti pokreta.')+'</p>'+(p.progressionNote?'<p>'+esc(p.progressionNote)+'</p>':''));h=h.replace('<h2 class="h2" style="margin-top:8px">Vježbe</h2>',info+'<h2 class="h2" style="margin-top:8px">Vježbe</h2>');return h;};
Object.assign(A,{
 profile:()=>{S.sheet=null;go({v:'profile'});},guide:()=>go({v:'guide'}),externalLog:()=>go({v:'externalLog'}),logDetail:d=>go({v:'logDetail',id:d.id}),pdfSchedule:()=>go({v:'pdfSchedule'}),
 dose:d=>{top().dose=Number(d.i);if(top().dose===2&&!top().customDose)top().customDose=exItem(S.ex[top().id]);render();},
 quickDose:d=>{const t=top();t.customDose=t.customDose||exItem(S.ex[t.id]);const step={sets:1,reps:1,sec:5,rest:5,kg:2.5}[d.k],min={sets:1,reps:1,sec:5,rest:0,kg:0}[d.k],max={sets:10,reps:60,sec:300,rest:600,kg:300}[d.k];t.customDose[d.k]=Math.max(min,Math.min(max,Number(t.customDose[d.k]||0)+Number(d.d)*step));render();},
 useProgress:()=>{const t=top(),e=S.ex[t.id],it=doseOptions(e)[t.dose??1].it,p=E.progression(e,it,S.log,S.profile);t.customDose=p.next;t.dose=2;render();toast('Prijedlog je postavljen. Provjeri dozu prije početka.');},
 openEx:d=>{const current=top(),p=current.v==='pr'?S.pr[current.id]:null,it=p?.items.find(x=>x.exId===d.id);go({v:'ex',id:d.id,dose:it?2:1,customDose:it?clone(it):null});},
 startPr:d=>prepareStart('protocol',d.id),playEx:d=>prepareStart('exercise',d.id,[clone(doseOptions(S.ex[d.id])[top().dose??1].it)]),
 startField:d=>{const f=S.field[d.id];if(f.requires_configuration?.length&&!f.configured){A.editField(d);return;}if(f.id==='mas-mreze-15-15'&&!S.profile.mas){toast('Prvo unesi rezultat MAS testa u postavke.');A.profile();return;}prepareStart('field',d.id);},
 beginReady:()=>runForm(()=>{
  const pain=numberValue('ready-pain',0,10),fatigue=numberValue('ready-fatigue',0,10),response=val('ready-response'),q=S.pendingStart,f=q.kind==='field'?S.field[q.id]:null;
  if(f&&!document.getElementById('ready-warm')?.checked)throw Error('Prvo završi i potvrdi zagrijavanje.');
  if(f?.intensityLevel==='high'&&(pain>0||fatigue>=8||response==='worse'))throw Error('Danas odaberi lakšu pripremu i procijeni tegobe prije zahtjevnog trčanja.');
  if(S.profile.returnMode&&!document.getElementById('ready-clinician')?.checked)throw Error('Potvrdi da trening odgovara dogovorenom planu povratka.');
  if(pain>=4||response==='worse'){toast('Prvo prilagodi dozu ili odaberi lakšu varijantu.');return;}
  S.stack.pop();S.pendingStart=null;
  if(f){const nf=normalizedField(f);startPlayer({mode:'field',title:f.name_hr,f:nf,steps:stepsFromField(nf),ref:{kind:'field',id:f.id}});}
  else{const items=q.items||clone(S.pr[q.id].items);startPlayer({mode:'ex',title:q.kind==='protocol'?S.pr[q.id].name:S.ex[q.id].name,items,steps:stepsFromItems(items),ref:{kind:q.kind,id:q.id}});}
  P.readiness={pain,fatigue,response};checkpoint();
 }),
 pausePlay:()=>{P.backgroundPaused=false;pausePlayer();},
 completeStep:()=>{if(!P||P.paused)return;const st=P.steps[P.i];if(st.kind==='manual'){const reps=Number(P.setDraft.reps??st.it.reps);if(!Number.isFinite(reps)||!Number.isInteger(reps)||reps<1||reps>100||Number(P.setDraft.kg??st.it.kg)<0||Number(P.setDraft.kg??st.it.kg)>400||P.setDraft.rir!=null&&(P.setDraft.rir<0||P.setDraft.rir>10)){toast('Provjeri broj ponavljanja.');return;}}recordStep('done');enterStep(P.i+1);render();},
 skipStep:()=>{if(!P)return;if(P.paused)resumeClock();recordStep('skipped');enterStep(P.i+1);render();},
 quitPlay:()=>{if(!P)return;P.steps.slice(P.i).forEach(st=>{if(st.recordKey&&!P.records[st.recordKey])P.records[st.recordKey]={exId:st.e?.id||st.it?.exId||null,label:st.e?.name||st.b?.label_hr||'',set:st.set,side:st.sideKey||'',status:'skipped'};});finish();render();},
 jumpTo:d=>{const target=Number(d.k);if(target>P.i)P.steps.slice(P.i,target).forEach(st=>{if(st.recordKey&&!P.records[st.recordKey])P.records[st.recordKey]={exId:st.e?.id||null,label:st.e?.name||st.b?.label_hr||'',status:'skipped',set:st.set,side:st.sideKey||''};});S.sheet=null;if(P.paused)resumeClock();enterStep(target);render();},
 resumePlay:()=>{const r=S.resume;if(!r)return;P=clone(r);P.paused=true;P.pauseAt=P.pauseAt||P.savedAt||Date.now();P.setDraft=P.setDraft||{};P.records=P.records||{};S.resume=null;go({v:'play'});ensureAudio();clearInterval(ticker);ticker=setInterval(tick,200);keepAwake(true);},
 discardResume:()=>{A.resumePlay();A.quitPlay();},
 finishPlay:()=>runForm(()=>{
  const rpe=numberValue('finish-rpe',1,10),pain=numberValue('finish-pain',0,10),quality=val('finish-quality'),notes=val('finish-notes');
  const entry={v:2,id:uid('log'),name:P.title,kind:P.ref?.kind||'protocol',refId:P.ref?.id||null,at:Date.now(),secs:P.secs||0,rpe,pain,quality,notes,records:clone(P.records),status:P.summary?.status||'partial',readiness:P.readiness||null,nextDay:null};
  const previousLog=S.log,previousProfile={...S.profile};
  if(P.ref?.id==='mas-test-5-min'&&entry.status==='complete'&&val('finish-mas')){const metres=numberValue('finish-mas',100,2500);entry.masDistance=metres;entry.mas=Number((metres/300).toFixed(2));S.profile.mas=entry.mas;S.profile.masMeasuredAt=entry.at;}
  S.log=[entry,...S.log].slice(0,1000);
  if(!persist()){S.log=previousLog;S.profile=previousProfile;checkpoint();return;}
  localStorage.removeItem('mt.active.v2');P=null;S.resume=null;clearInterval(ticker);keepAwake(false);S.stack=[{v:'history'}];S.tab='history';render();toast('Trening i rezultati su spremljeni.');
 }),
 nextDay:d=>{const l=S.log.find(x=>(x.id||String(x.at))===d.id);if(l&&dateKey(l.at)===dateKey()){toast('Reakciju zabilježi sutra, nakon oporavka.');return;}S.sheet={kind:'nextDay',id:d.id};render();},
 saveNextDay:d=>{const l=S.log.find(x=>(x.id||String(x.at))===d.id);if(l){l.nextDay=d.value;l.nextDayAt=Date.now();persist();}S.sheet=null;render();toast('Reakcija je spremljena.');},
 week:d=>{S.weekOffset=(S.weekOffset||0)+Number(d.d);render();},
 planAdd:d=>go({v:'planAdd',date:d.date}),
 planSave:()=>runForm(()=>{const date=val('plan-date'),ref=val('plan-ref');if(!date)throw Error('Odaberi datum.');const kind=ref.startsWith('p:')?'protocol':ref.startsWith('f:')?'field':ref;S.plan.push({id:uid('plan'),date,kind,refId:ref.includes(':')?ref.slice(2):null,time:val('plan-time'),intensity:val('plan-intensity')});persist();back();}),
 planRemove:d=>{S.lastRemovedPlan=S.plan.find(x=>x.id===d.id);S.plan=S.plan.filter(x=>x.id!==d.id);persist();render();toast('Uklonjeno. Možeš vratiti posljednju stavku.');},
 undoPlan:()=>{if(S.lastRemovedPlan){S.plan.push(S.lastRemovedPlan);S.lastRemovedPlan=null;persist();render();}},
 planTemplate:d=>{S.sheet={kind:'template',date:d.date};render();},
 applyTemplate:d=>{const start=new Date(d.date+'T12:00:00');for(let i=0;i<7;i++){const day=new Date(start);day.setDate(day.getDate()+i);const key=dateKey(day);if(S.plan.some(x=>x.date===key))continue;const relative=(S.profile.matchDay-day.getDay()+7)%7;let kind='rest',refId=null,intensity='low';if(S.profile.returnMode){kind='rest';}else if(S.profile.season==='preseason'){if(i===0||i===3){kind='protocol';refId=i===0?'snaga-a':'snaga-b';intensity='high';}else if(i===5){kind='field';refId='mas-mreze-15-15';intensity='high';}else if(i===2){kind='protocol';refId='mobilnost-oporavak';}}else if(relative===0){kind='match';intensity='high';}else if(relative===4){kind='protocol';refId='snaga-a';intensity='high';}else if(relative===2){kind='protocol';refId='snaga-b';intensity='moderate';}else if(relative===1){kind='protocol';refId='aktivacija-kratka';}else if(relative===5){kind='protocol';refId='mobilnost-oporavak';}S.plan.push({id:uid('plan'),date:key,kind,refId,intensity,name:kind==='rest'?'Oporavak / raspored kluba':null});}persist();S.sheet=null;render();toast('Primjer je dodan u prazne dane. Uskladi ga s klubom.');},
 importPdfPlan:()=>runForm(()=>{const date=val('pdf-start');if(!date)throw Error('Odaberi datum.');const start=new Date(date+'T12:00:00');if(start.getDay()!==1)throw Error('Odaberi ponedjeljak.');const order=['pon','uto','sri','cet','pet','sub','ned'];let count=0;(window.PDF_PLAN?.schedule.weeks||[]).forEach((w,wi)=>order.forEach((day,di)=>{const id=w.days[day];if(!id)return;const dt=new Date(start);dt.setDate(dt.getDate()+wi*7+di);const key=dateKey(dt);if(S.plan.some(x=>x.date===key&&x.refId===id))return;S.plan.push({id:uid('plan'),date:key,kind:'field',refId:id,intensity:S.field[id]?.intensityLevel||'high',source:'pdf'});count++;}));persist();toast(count+' treninga dodano. Provjeri preklapanja u planu.');}),
 saveProfile:()=>runForm(()=>{S.profile={...S.profile,season:val('profile-season'),returnMode:val('profile-season')==='return',matchDay:Number(val('profile-match')),pitchLength:numberValue('profile-length',60,120),pitchWidth:numberValue('profile-width',40,90),mas:numberValue('profile-mas',1,8,true),maxSpeed:numberValue('profile-speed',5,45,true),barbellStep:numberValue('profile-step',.5,10)};persist();back();toast('Postavke spremljene.');}),
 saveExternal:()=>runForm(()=>{const name=val('ext-name').trim();if(!name)throw Error('Upiši naziv.');const date=val('ext-date');if(!date)throw Error('Odaberi datum.');S.log.unshift({v:2,id:uid('log'),kind:val('ext-kind'),name,at:new Date(date+'T12:00:00').getTime(),secs:numberValue('ext-min',1,300)*60,rpe:numberValue('ext-rpe',1,10),pain:numberValue('ext-pain',0,10),sprintMetres:numberValue('ext-sprint',0,10000,true),quality:'good',status:'complete',nextDay:null,records:{}});persist();setTab('history');}),
 editField:d=>{S.fieldDraft=clone(S.field[d.id]);go({v:'fieldEdit',id:d.id});},
 saveField:()=>runForm(()=>{const f=S.fieldDraft;if(!document.getElementById('field-confirm')?.checked)throw Error('Potvrdi pregled izvora i svoje doze.');f.blocks=f.blocks.map((b,i)=>{const sets=numberValue('fb-sets-'+i,1,20),reps=numberValue('fb-reps-'+i,1,50),work=numberValue('fb-work-'+i,b.distanceBased||b.work_s==null?0:1,1800,!!(b.distanceBased||b.work_s==null)),rest=numberValue('fb-rest-'+i,0,900),sr=numberValue('fb-srest-'+i,0,900);return {...b,sets,reps,work_s:b.distanceBased||b.work_s==null?null:work,target_time_s:b.distanceBased||b.work_s==null?(work&&work!==b.target_time_s?.[0]?[work,work]:b.target_time_s):b.target_time_s,targetCustom:b.targetCustom||!!(work&&b.target_time_s&&work!==b.target_time_s[0]),rest_s:rest,set_rest_s:sr,dynamicRest:false,rest_formula:null};});if('circuit_reps' in f){f.circuit_sets=numberValue('fc-sets',1,10);f.circuit_reps=numberValue('fc-reps',1,20);f.circuit_set_rest_s=numberValue('fc-rest',0,900);}if(f.id==='izlozenost-maksimalnoj-brzini'){f.acceleration_m=numberValue('field-acceleration',10,60);f.flying_m=numberValue('field-flying',10,60);if(f.acceleration_m+f.flying_m>S.profile.pitchLength-10)throw Error('Zone moraju ostaviti prostor za usporavanje.');}f.configured=true;f.customizedAt=Date.now();S.field[f.id]=f;persist();S.fieldDraft=null;back();toast('Tvoja prilagodba je spremljena.');})
});
const oldSheet=sheetHtml;
sheetHtml=function(){
 const s=S.sheet;if(!s)return '';
 let body='';
 if(s.kind==='nextDay')body='<h3>Reakcija sljedeći dan</h3><p>Usporedi simptome i uobičajeno kretanje s danom prije treninga.</p>'+[['same','Isto, bez pogoršanja'],['better','Bolje'],['worse','Lošije / jači simptomi']].map(([v,l])=>'<button class="opt" data-a="saveNextDay" data-id="'+esc(s.id)+'" data-value="'+v+'">'+l+'</button>').join('');
 if(s.kind==='template')body='<h3>Primjer tjedna</h3><p>'+esc(S.profile.season==='preseason'?'Pripreme: dva treninga snage, jedan MAS trening i prostor za mobilnost i klupski rad. MAS trening traži osobni rezultat.':S.profile.returnMode?'Povratak: raspored unesi ručno prema dogovorenom planu; ovaj predložak neće dodati utakmicu ili zahtjevne treninge.':'Natjecateljski tjedan: dva treninga snage, lagana priprema prije utakmice i prostor za oporavak.')+'</p><p>Dodaju se samo prazni dani. Klupske treninge unesi zasebno i provjeri ukupno opterećenje.</p><button class="btn" data-a="applyTemplate" data-date="'+s.date+'">Dodaj primjer</button>';
 if(s.kind==='data')body='<h3>Moji podaci</h3><p>Podaci i snimke ostaju na ovom uređaju. Redovito spremi kopiju.</p><button class="opt" data-a="exportData">Izvezi podatke</button><button class="opt" data-a="exportFull">Izvezi podatke i snimke</button><label class="opt" for="importFile">Uvezi kopiju</label><input id="importFile" class="vsr" type="file" accept="application/json,.json"><button class="opt" data-a="profile">Oprema i postavke</button><button class="opt" data-a="guide">Pravila progresije</button><p class="micro">'+Object.keys(S.ex).length+' vježbi · '+S.log.length+' treninga · verzija 2.2</p>';
 if(s.kind==='importPreview'){const c=S.importCounts;body='<h3>Pregled sigurnosne kopije</h3><p>'+c.exercises+' vježbi · '+c.protocols+' protokola · '+c.sessions+' treninga · '+c.media+' snimki.</p><p>Spajanje čuva postojeće zapise. Zamjena prethodno čuva lokalnu kopiju za oporavak.</p><button class="btn" data-a="confirmImport" data-mode="merge">Spoji podatke</button><button class="opt" data-a="confirmImport" data-mode="replace">Zamijeni ovom kopijom</button>';}
 if(!body){let h=oldSheet();if(s.kind==='settings')h=h.replace('<h3>Postavke playera</h3>','<h3>Postavke playera</h3><button class="opt" data-a="toggleVoice">Govorne upute: '+(S.settings.voice?'uključene':'isključene')+'</button>');return h;}
 return '<div class="sheet-bg" data-a="sheetClose"><div class="sheet gut" data-stop="1" role="dialog" aria-modal="true"><div class="grab"></div>'+body+'<button class="txtbtn" data-a="closeSheet">Zatvori</button></div></div>';
};
Object.assign(A,{closeSheet:()=>{S.sheet=null;render();},toggleVoice:()=>{S.settings.voice=!S.settings.voice;lsSet('mt.settings',S.settings);render();}});
app.addEventListener('input',ev=>{
 const t=ev.target;
 if(P&&t.id.startsWith('set-')){const k=t.id.slice(4);P.setDraft[k]=k==='setup'?t.value:t.value===''?null:Number(t.value);checkpoint();}
 if(P&&t.id.startsWith('finish-')){P.feedback=P.feedback||{};P.feedback[t.id.slice(7)]=t.value;checkpoint();}
 if(t.id==='libq'){const c=document.getElementById('filter-count');if(c)c.textContent=libFiltered().length+' vježbi · '+Object.keys(S.ex).length+' u knjižnici';}
});
app.addEventListener('change',ev=>{const t=ev.target;if(t.id==='lib-recorded'){S.lib.recorded=t.checked;render();}if(t.id==='lib-equipment'){S.lib.equipment=t.value;render();}if(t.id==='lib-zone'){S.lib.zone=t.value;render();}if(t.id==='lib-level'){S.lib.level=t.value;render();}if(t.id==='lib-owned'){S.lib.owned=t.checked;render();}});
function backupObject(){return {v:2,exportedAt:new Date().toISOString(),exercises:S.ex,protocols:S.pr,field:S.field,log:S.log,plan:S.plan,profile:S.profile,seedBaseline:S.seedBaseline,_deleted:S._deleted||[],settings:S.settings};}
function downloadBackup(d,suffix=''){
 const blob=new Blob([JSON.stringify(d)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='moj-trening-'+dateKey()+suffix+'.json';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(url);a.remove();},3000);
}
const blobData=b=>new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.readAsDataURL(b);});
Object.assign(A,{
 exportData:()=>{try{downloadBackup(backupObject());toast('Kopija je pripremljena za preuzimanje.');}catch(e){toast('Izvoz nije uspio.');}},
 exportFull:async()=>{try{toast('Pripremam kopiju sa snimkama…');const d=backupObject();d.mediaBlobs={};for(const id of new Set(Object.values(S.ex).map(x=>x.media).filter(Boolean))){const rec=await IDB.get(id);if(!rec)continue;const b=rec instanceof Blob?rec:new Blob([rec.buf],{type:rec.type});d.mediaBlobs[id]=await blobData(b);}downloadBackup(d,'-sa-snimkama');toast('Kopija sa snimkama je pripremljena.');}catch(e){toast('Izvoz sa snimkama nije uspio. Podaci su sačuvani.');}},
 restoreBackup:()=>{const d=lsGet('mt.before-import.v2',null);if(!d){toast('Nema spremljene kopije prije uvoza.');return;}S.importDraft=d;S.importCounts=E.validateBackup(d);S.sheet={kind:'importPreview'};render();},
 confirmImport:async d=>{
  try{
   const incoming=S.importDraft;if(!incoming)throw Error('Prvo odaberi kopiju.');E.validateBackup(incoming);
   const current=clone(backupObject());
   localStorage.setItem('mt.before-import.v2',JSON.stringify(current));
   const merged=d.mode==='merge'?{...incoming,exercises:{...incoming.exercises,...current.exercises},protocols:{...incoming.protocols,...current.protocols},field:{...incoming.field,...current.field},profile:current.profile,settings:current.settings,seedBaseline:current.seedBaseline,_deleted:current._deleted}:incoming;
   if(d.mode==='merge'){
    const unique=rows=>[...new Map(rows.map(x=>[x.id||String(x.at)+'|'+x.name,x])).values()];
    merged.log=unique([...(incoming.log||[]),...current.log]).sort((a,b)=>b.at-a.at);merged.plan=unique([...(incoming.plan||[]),...current.plan]);
   }
   const prepared=E.migrate(merged,window.SEED,window.LEGACY_SEED);
   const mediaMap={};
   for(const [id,url] of Object.entries(incoming.mediaBlobs||{})){
    if(!/^data:(image\/(png|jpeg|gif|webp)|video\/(mp4|webm|quicktime));base64,/.test(url)||url.length>30*1024*1024)throw Error('Neispravna ili prevelika snimka u kopiji.');
    const [head,body]=url.split(','),bytes=Uint8Array.from(atob(body),c=>c.charCodeAt(0)),type=head.slice(5,head.indexOf(';'));
    const newId=uid('m');await IDB.put(newId,{type,buf:bytes.buffer});mediaMap[id]=newId;
   }
   for(const [id,e] of Object.entries(prepared.exercises))if(mediaMap[e.media]&&!(d.mode==='merge'&&current.exercises[id]))e.media=mediaMap[e.media];
   // Embedded media belongs to the transfer file; clips are stored in IndexedDB.
   delete prepared.mediaBlobs;
   localStorage.setItem(STORE_KEY,JSON.stringify(prepared));applyData(prepared);S._deleted=prepared._deleted;
   if(incoming.settings&&d.mode!=='merge'){S.settings={...S.settings,...incoming.settings};lsSet('mt.settings',S.settings);}
   S.sheet=null;S.importDraft=null;S.stack=[{v:S.tab}];render();await loadMedia();toast('Podaci su uvezeni. Kopija prije uvoza je sačuvana.');
  }catch(e){toast(e.message||'Uvoz nije uspio. Postojeći podaci su sačuvani.');}
 },
 protocolProgress:d=>go({v:'protocolProgress',id:d.id}),
 applyProtocolProgress:d=>{const p=S.pr[d.id];let changed=0;p.items=p.items.map(it=>{const e=S.ex[it.exId],pr=E.progression(e,it,S.log,S.profile);if(['reps','time','load'].includes(pr.action)){changed++;return pr.next;}return it;});p.updatedAt=Date.now();persist();render();toast(changed?'Primijenjeno '+changed+' prijedloga. Provjeri dozu prije treninga.':'Nema prijedloga za povećanje.');}
});
app.addEventListener('change',async ev=>{const t=ev.target;if(t.id!=='importFile'||!t.files?.[0])return;try{if(t.files[0].size>150*1024*1024)throw Error('Kopija je prevelika (najviše 150 MB).');const d=JSON.parse(await t.files[0].text());S.importCounts=E.validateBackup(d);S.importDraft=d;S.sheet={kind:'importPreview'};render();}catch(e){toast(e.message||'Neispravna sigurnosna kopija.');}});
VIEWS.protocolProgress=function(t){const p=S.pr[t.id];return '<div class="view gut">'+topbar(backBtn())+'<h1 class="h1">Progresija treninga</h1><p class="sub">'+esc(p.name)+'</p>'+noteBox('Pregled prije promjene','<p>Svaka vježba napreduje zasebno. Gumb mijenja samo doze koje zadovoljavaju kriterije; povećanje je tvoj izbor. Za lakši tjedan smanji serije u uređivanju protokola prema umoru i rasporedu.</p>')+p.items.map(it=>{const e=S.ex[it.exId],pr=E.progression(e,it,S.log,S.profile);return noteBox(e.name,'<p>'+esc(dose(it))+'</p><b>'+esc(pr.label)+'</b><p>'+esc(pr.reason)+'</p>'+(['reps','time','load'].includes(pr.action)?'<p>Prijedlog: '+esc(dose(pr.next))+'</p>':'')+exLink(e.id));}).join('')+'</div><div class="footer gut"><button class="btn" data-a="applyProtocolProgress" data-id="'+p.id+'">Primijeni dostupne prijedloge</button></div>';};
VIEWS.pr=function(t){
 const p=S.pr[t.id];if(!p)return '<div class="view gut">'+topbar(backBtn())+noteBox('Trening nije dostupan','')+'</div>';
 return '<div class="view gut protocol-simple">'+topbar(backBtn(),'<button class="ib" data-a="editPr" data-id="'+esc(p.id)+'" aria-label="Uredi protokol">'+I.edit+'</button>')+'<h1 class="h1">'+esc(p.name)+'</h1><p class="sub">'+nVj(p.items.length)+' · '+protoMin(p)+' min</p>'+
 '<div class="list">'+p.items.map((it,i)=>{const e=S.ex[it.exId];return '<button class="row" data-a="openEx" data-id="'+esc(it.exId)+'"><span class="thumb">'+(e?thumbHtml(e):i+1)+'</span><span class="tx"><span class="t">'+esc(e?.name||'Vježba nije dostupna')+'</span><span class="m">'+esc(dose(it))+'</span></span>'+I.chev+'</button>';}).join('')+'</div>'+
 fold('Prikaži više','<p>'+esc(p.desc||p.purpose||'')+'</p><h3>Priprema</h3><p>'+esc(p.warmupNote||'5–10 min postupne pripreme i pripremne serije prve vježbe s lakšim teretom.')+'</p><h3>Raspored i napredovanje</h3><p>'+esc(p.weeklyNote||'Uskladi trening s klupskim radom i oporavkom.')+'</p><p>'+esc(p.progressionNote||'')+'</p>'+actionBtn('protocolProgress','Pregledaj progresiju','data-id="'+p.id+'"'),'Priprema i napredovanje')+'</div><div class="footer gut"><button class="btn" data-a="startPr" data-id="'+p.id+'" '+(p.items.length?'':'disabled')+'>Pokreni trening</button></div>';
};
const completeSheet=sheetHtml;
sheetHtml=function(){let h=completeSheet();if(S.sheet?.kind==='data'&&lsGet('mt.before-import.v2',null))h=h.replace('<button class="opt" data-a="profile">','<button class="opt" data-a="restoreBackup">Oporavi podatke prije zadnjeg uvoza</button><button class="opt" data-a="profile">');return h;};

Object.assign(A,{previewBlock:d=>{top().block=Number(d.block);render();},previewRep:()=>{top().rep=((top().rep||1)%3)+1;render();}});
VIEWS.fieldList=function(){return '<div class="view gut">'+topbar(backBtn())+'<h1 class="h1">Kondicija na terenu</h1><p class="sub">'+Object.keys(S.field).length+' treninga</p><div class="list" style="margin-top:24px">'+Object.values(S.field).sort((a,b)=>(a.order||0)-(b.order||0)).map(f=>{const nf=normalizedField(f),st=E.fieldSteps(nf,S.profile),tm=E.fieldDuration(nf,S.profile);return '<button class="row" data-a="openField" data-id="'+f.id+'"><span class="thumb">'+pathIcon(I.run,28)+'</span><span class="tx"><span class="t">'+esc(f.name_hr)+'</span><span class="m">'+(tm.manual?st.filter(s=>s.recordKey).length+' dionica · ručni završetak':fmt(tm.seconds)+' · glavni dio + 10 s pripreme')+'</span><span class="m">'+(f.requires_configuration?.length&&!f.configured?'Prvo potvrdi postavke':f.source_page?'PDF · stranica '+f.source_page:'STATSports')+'</span></span>'+I.chev+'</button>';}).join('')+'</div><div style="margin:20px 0">'+actionBtn('pdfSchedule','Otvori četverotjedni plan iz PDF-a')+'</div></div>';};

/* ---------- compact presentation and exact exercise demonstrations ---------- */
function fold(label,body,caption=''){
 return '<details class="detail-accordion compact-details"><summary><span>'+esc(label)+(caption?'<small>'+esc(caption)+'</small>':'')+'</span><span aria-hidden="true" class="disclosure-plus">+</span></summary><div class="disclosure-body">'+body+'</div></details>';
}
function mediaUrlSafe(u){return typeof u==='string'&&/^assets\/(exercises|trx|basics)\/[a-z0-9._-]+$/.test(u)?esc(u):safeUrl(u);}
function realMedia(e){
 if(e?.media&&MEDIA[e.media])return null;
 const original=e&&window.SEED.exercises[e.id];
 if(!original||['name','steps','equipment','visualKey','visualVariant'].some(k=>JSON.stringify(e[k])!==JSON.stringify(original[k])))return null;
 return (window.REAL_MEDIA||{})[e.id]||null;
}
function realPoster(id,fallback){const e=S.ex[id],m=realMedia(e);return m?.poster?'<img src="'+mediaUrlSafe(m.poster)+'" alt="" loading="lazy">':pathIcon(fallback,48);}
function mediaCredit(e){const m=realMedia(e);return m?'<p class="media-credit">Snimka: '+esc(m.credit||m.publisher||'')+' · '+esc(m.license||'')+'<br><a target="_blank" rel="noopener" href="'+safeUrl(m.source)+'">Izvor snimke ↗</a>'+(m.licenseUrl?' · <a target="_blank" rel="noopener" href="'+safeUrl(m.licenseUrl)+'">Licencija</a>':'')+(m.caption?'<br>'+esc(m.caption):'')+(m.changes?'<br>'+esc(m.changes):'')+(m.notice?'<br>'+esc(m.notice):'')+'</p>':'';}
thumbHtml=function(e){
 if(e?.media&&MEDIA[e.media])return e.mediaType==='image'?'<img alt="" src="'+esc(mediaUrl(e.media))+'">':'<video muted playsinline preload="metadata" src="'+esc(mediaUrl(e.media))+'#t=0.5"></video>';
 const m=realMedia(e);return m?.poster?'<img alt="" src="'+mediaUrlSafe(m.poster)+'" loading="lazy">':pathIcon(catIcon(e?.cat),28);
};
mediaHtml=function(e,badge=''){
 if(!e)return '';
 const m=realMedia(e);let inner='';badge=[badge,m?.label].filter(Boolean).join(' · ');
 if(e.media&&MEDIA[e.media])inner=e.mediaType==='image'?'<img alt="Tvoj prikaz vježbe" src="'+esc(mediaUrl(e.media))+'">':'<video src="'+esc(mediaUrl(e.media))+'" autoplay muted loop playsinline controls></video>';
 else if(m?.video)inner='<video class="real-demo" src="'+mediaUrlSafe(m.video)+'" poster="'+mediaUrlSafe(m.poster)+'" autoplay muted loop playsinline controls preload="metadata" aria-label="Izvođenje: '+esc(e.name)+'"></video>';
 else if(m?.image)inner='<img alt="Izvođenje: '+esc(e.name)+'" src="'+mediaUrlSafe(m.image)+'">';
 else if(m?.embed)inner='<div class="video-launch">'+(m.poster?'<img alt="" src="'+mediaUrlSafe(m.poster)+'">':'')+'<button class="btn" data-a="watchDemo" data-id="'+esc(e.id)+'">'+I.play+'Pogledaj izvođenje</button></div>';
 else return '<div class="media-unavailable">'+I.video+'<span>Snimka još nije dodana</span>'+(top().v==='play'?'':'<button class="txtbtn" data-a="editEx" data-id="'+esc(e.id)+'">Dodaj svoju</button>')+'</div>';
 return '<div class="media real-media">'+inner+(badge?'<span class="badge">'+esc(badge)+'</span>':'')+'</div><p class="media-error" hidden>Snimka nije dostupna. Pokušaj ponovo kad budeš povezan.</p>';
};
Object.assign(A,{
 toggleFilters:()=>{S.lib.filtersOpen=!S.lib.filtersOpen;render();},
 clearFilters:()=>{Object.assign(S.lib,{cat:'Sve',zone:'',level:'',equipment:'',owned:true,recorded:false,q:''});lsSet('mt.libcat','Sve');render();},
 watchDemo:d=>{const m=realMedia(S.ex[d.id]);if(!m?.embed)return;if(P&&!P.done&&!P.paused)pausePlayer();go({v:'demo',id:d.id});}
});
VIEWS.demo=function(t){const e=S.ex[t.id],m=realMedia(e);return '<div class="view gut">'+topbar(backBtn())+'<h1 class="h1">'+esc(e?.name||'Izvođenje')+'</h1><div class="embedded-demo"><iframe title="Izvođenje: '+esc(e?.name)+'" src="'+safeUrl(m?.embed)+'" allow="fullscreen; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div><p class="micro">Ako se video ne otvori: <a href="'+safeUrl(m?.source)+'" target="_blank" rel="noopener">pogledaj kod autora ↗</a>.</p>'+mediaCredit(e)+'</div>';};
app.addEventListener('error',ev=>{const t=ev.target;if(t.matches?.('video.real-demo')){const err=t.parentElement.nextElementSibling;if(err?.classList.contains('media-error'))err.hidden=false;}},true);

/* Screenshot-led presentation. Training records and dose engine remain unchanged. */
I.user='<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="7" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3z"/></svg>';
I.more='<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="19" r="1.4"/></svg>';
I.expand='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3H3v6m12-6h6v6M3 15v6h6m12-6v6h-6M7 7l10 10m-6 0h6v-6"/></svg>';
I.filter='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 6h9m6 0h3M3 18h3m6 0h9"/><circle cx="15" cy="6" r="3"/><circle cx="9" cy="18" r="3"/></svg>';
const HOME_CARDS=[
 {id:'daily',title:'Svakodnevno',subtitle:'Tvoj trening',image:'daily.jpg',description:'Tvoje vježbe, u tvojem ritmu.',points:['Odaberi svoj pripremljeni trening','Dozu prilagodi današnjoj spremnosti','Prati napredak kroz dnevnik']},
 {id:'activate',title:'Aktivacija',subtitle:'Prije treninga',image:'activate.jpg',description:'Pripremi tijelo za ono što slijedi.',points:['Tvoj protokol aktivacije','Kontrolirani pokreti i postupna priprema','Pregledaj vježbe prije početka']},
 {id:'recover',title:'Oporavak',subtitle:'Nakon treninga',image:'recover.jpg',description:'Odvoji vrijeme za mobilnost i lagano kretanje.',points:['Tvoj protokol mobilnosti','Mirno izvođenje, bez forsiranja','Zabilježi kako se osjećaš sljedeći dan']},
 {id:'library',title:'Knjižnica',subtitle:'Tvoje vježbe',image:'library.jpg'}
];
function homeNotices(){
 const events=(S.plan||[]).filter(x=>x.date===dateKey());
 const pending=(S.log||[]).filter(l=>l.v===2&&!l.nextDay&&Date.now()-l.at>12*3600000&&Date.now()-l.at<7*864e5);
 return (S.resume?noteBox('Nastavi trening','<p>'+esc(S.resume.title)+'</p>'+actionBtn('resumePlay','Nastavi')+actionBtn('discardResume','Završi kao prekinuto')):'')+
 (events.length?'<section class="today-plan"><h2 class="h2">Danas na rasporedu</h2>'+events.map(planRow).join('')+'</section>':'')+
 (pending.length?noteBox('Kako se osjećaš danas?',pending.slice(0,2).map(l=>'<div class="feedback-row"><span>'+esc(l.name)+'</span>'+actionBtn('nextDay','Zabilježi','data-id="'+esc(l.id)+'"')+'</div>').join('')):'');
}
tabbar=function(){const current=['home','account'].includes(S.tab)?S.tab:'dashboard';return '<nav class="tabbar reference-nav" aria-label="Glavna navigacija">'+[['dashboard','Moj pregled',I.tabGrid],['home','Trening',I.tabPlay],['account','Moj profil',I.user]].map(([v,n,ic])=>'<button class="tab" data-a="tab" data-tab="'+v+'" aria-label="'+n+'" '+(current===v?'aria-current="page"':'')+'>'+ic+'</button>').join('')+'</nav>';};
// Root navigation is shown only on the three destinations; child screens have a back control.
render=function(){
 oldRender();
 const root=['home','dashboard','account'].includes(top().v)&&!S.pick;
 const nav=app.querySelector('.tabbar');if(!root&&nav)nav.remove();
 if(root&&!nav)app.insertAdjacentHTML('beforeend',tabbar());
};
const referenceBack=back;
back=function(){if(S.stack.length<=1){setTab('home');return;}referenceBack();};
VIEWS.home=function(){return '<div class="view home-reference">'+topbar('','')+'<h1 class="greet">Bok, Tomislav</h1><div class="carousel home-carousel" id="car" aria-label="Odaberi vrstu treninga">'+HOME_CARDS.map(c=>'<button class="hcard photo-card" data-a="homeCategory" data-id="'+c.id+'"><img src="assets/hero/'+c.image+'" alt="" '+(c.id==='daily'?'fetchpriority="high"':'loading="lazy"')+'><span class="sc"></span><span class="tt"><b>'+c.title+'</b><span>'+(c.id==='library'?nVj(Object.keys(S.ex).length):c.subtitle)+'</span></span></button>').join('')+'</div><div class="dots" id="dots" role="group" aria-label="Odaberi karticu">'+HOME_CARDS.map((c,i)=>'<button class="dot" data-a="dot" data-i="'+i+'" aria-label="'+c.title+'" '+(i===(S.homeCard||0)?'aria-current="true"':'')+'><i></i></button>').join('')+'</div><div class="gut home-notices">'+homeNotices()+'</div></div>';};
function menuRow(action,title,subtitle,icon,attrs=''){return '<button class="row menu-row" data-a="'+action+'" '+attrs+'><span class="menu-icon">'+icon+'</span><span class="tx"><span class="t">'+esc(title)+'</span>'+(subtitle?'<span class="m">'+esc(subtitle)+'</span>':'')+'</span>'+I.chev+'</button>';}
VIEWS.dashboard=function(){return '<div class="view gut dashboard-reference">'+topbar('','')+'<h1 class="h1">Moj pregled</h1>'+homeNotices()+'<div class="list">'+menuRow('tab','Moji treninzi',Object.keys(S.pr).length+' protokola',I.dots4,'data-tab="protocols"')+menuRow('tab','Plan rada','Tvoj raspored treninga',I.list,'data-tab="plan"')+menuRow('tab','Dnevnik',S.log.length+' zabilježenih treninga',I.clock,'data-tab="history"')+menuRow('fieldList','Na terenu',Object.keys(S.field).length+' treninga',pathIcon(I.run,24))+menuRow('tab','Knjižnica',nVj(Object.keys(S.ex).length),I.tabLib,'data-tab="library"')+'</div></div>';};
VIEWS.account=function(){return '<div class="view gut account-reference">'+topbar('','')+'<div class="profile-avatar">'+I.user+'</div><h1 class="h1">Tomislav</h1><p class="sub">Moj trening</p><div class="list">'+menuRow('profile','Oprema i plan','Osobne postavke treninga',I.gear)+menuRow('dataSheet','Moji podaci','Sigurnosna kopija i prijenos',I.addbox)+menuRow('guide','Kako napredovati','Pravila i objašnjenja',I.bars)+menuRow('tab','Dnevnik','Prethodni treninzi',I.clock,'data-tab="history"')+menuRow('heroCredits','Fotografije','Autori i izvori',I.video)+'</div></div>';};
VIEWS.heroCredits=function(){return '<div class="view gut">'+topbar(backBtn())+'<h1 class="h1">Fotografije</h1><p class="sub">Naslovne fotografije</p>'+(window.HERO_CREDITS||[]).map(m=>'<section class="panel"><h2 class="h2">'+esc(m.title)+'</h2><p>'+esc(m.author)+'</p><p><a href="'+safeUrl(m.source)+'" target="_blank" rel="noopener noreferrer">Izvor fotografije</a> · <a href="'+safeUrl(m.licenseUrl)+'" target="_blank" rel="noopener noreferrer">'+esc(m.license)+'</a></p></section>').join('')+'<p class="micro">Izvori prikaza vježbi nalaze se u pojedinoj vježbi pod „Izvori i snimke”.</p></div>';};
function categoryProtocol(id){return id==='activate'?S.pr['aktivacija-kratka']||Object.values(S.pr).find(p=>p.home==='aktivacija'):id==='recover'?S.pr['mobilnost-oporavak']||Object.values(S.pr).find(p=>p.cat==='Mobilnost'):null;}
VIEWS.category=function(t){const c=HOME_CARDS.find(x=>x.id===t.id)||HOME_CARDS[0],p=categoryProtocol(c.id);return '<div class="view category-reference"><div class="category-photo"><img src="assets/hero/'+c.image+'" alt=""></div><div class="gut category-top">'+topbar(backBtn())+'</div><div class="gut category-copy"><h1>'+c.title+'</h1><p>'+c.description+'</p><div class="category-points">'+c.points.map((x,i)=>'<div>'+[I.clock,I.target,I.bars][i]+'<span>'+x+'</span></div>').join('')+'</div></div></div><div class="footer gut category-footer"><button class="btn" data-a="'+(p?'openPr':'tab')+'" '+(p?'data-id="'+esc(p.id)+'"':'data-tab="protocols"')+'>Krenimo</button></div>';};
const referenceLibrary=VIEWS.library;
VIEWS.library=function(){return referenceLibrary().replace(topbar('','<button class="ib" data-a="newEx" aria-label="Nova vježba">'+I.plus+'</button>'),topbar(backBtn(),'<button class="ib" data-a="newEx" aria-label="Nova vježba">'+I.plus+'</button>')).replace('<div class="search-line">','<h2 class="h2 exercise-list-title">Popis vježbi</h2><div class="search-line">').replace('>'+I.gear+'</button></div>','>'+I.filter+'</button></div>');};
for(const name of ['plan','history']){const view=VIEWS[name];VIEWS[name]=function(t){return view(t).replace('<div class="topbar"><div class="l"></div>','<div class="topbar"><div class="l">'+backBtn()+'</div>');};}
const referenceProtocols=VIEWS.protocols;
VIEWS.protocols=function(){return referenceProtocols().replace(topbar('',''),topbar(backBtn(),''));};
function informationCards(e,playing=false){
 const steps=(e?.steps||[]), first=steps.slice(0,3),extra=steps.slice(3);
 const detail=(extra.length?'<h3>Ostatak izvedbe</h3>'+bullets(extra):'')+'<h3>Priprema</h3><p>'+esc(e?.setup||e?.equipment||'Bez dodatne opreme')+'</p><h3>Na što pripaziti</h3>'+ (e?.note?'<p>'+esc(e.note)+'</p>':'')+bullets(e?.stopRules||[])+'<h3>Kontrola pokreta</h3>'+bullets(e?.techniqueChecks||[])+'<h3>Česte pogreške</h3>'+bullets(e?.commonErrors||[])+'<p>'+esc(e?.counting||'')+' '+esc(e?.loadRule?.note||'')+'</p>';
 const zones=e?.zones||[];
 return '<div class="info-carousel" aria-label="Upute i ciljana područja" tabindex="0"><section class="info-card" aria-label="Upute">'+(e?.feel?'<span class="lb">Osjećaj</span><p>'+esc(e.feel)+'</p>':'')+'<span class="lb">Upute</span>'+(first.length?bullets(first):'<p>Upute još nisu dodane.</p>')+fold('Prikaži više',detail)+'</section><section class="info-card body-card" aria-label="Ciljana područja"><span class="lb">Ciljana područja</span><div class="target-layout"><div class="target-tags">'+zones.map(z=>'<span>'+esc(z)+'</span>').join('')+'</div>'+(window.TrainingBodyMap?window.TrainingBodyMap.render(zones):'')+'</div></section></div><div class="info-dots" aria-label="Odaberi prikaz"><button data-a="infoCard" data-i="0" aria-label="Upute" aria-current="true"></button><button data-a="infoCard" data-i="1" aria-label="Ciljana područja"></button></div>';
}
VIEWS.ex=function(t){
 const e=S.ex[t.id];if(!e)return '<div class="view gut">'+topbar(backBtn())+'<p>Vježba nije dostupna.</p></div>';
 const opts=doseOptions(e),sel=t.dose??1,it=opts[sel].it,p=E.progression(e,it,S.log,S.profile),pg=e.progression||{};
 const progress='<h3>Sljedeći korak</h3><b>'+esc(p.label)+'</b><p>'+esc(p.reason)+'</p>'+(p.action!=='hold'&&p.action!=='review'?actionBtn('useProgress','Primijeni prijedlog'):'')+'<h3>Prije početka</h3>'+bullets(pg.entry)+'<h3>Napreduj kada</h3>'+bullets(pg.advance)+'<h3>Smanji zahtjevnost kada</h3>'+bullets(pg.regress)+((e.regressionIds||[]).length?'<h3>Lakše varijante</h3><div class="chips wrap">'+e.regressionIds.map(exLink).join('')+'</div>':'')+((e.progressionIds||[]).length?'<h3>Sljedeće varijante</h3><div class="chips wrap">'+e.progressionIds.map(exLink).join('')+'</div>':'');
 return '<div class="view exercise-reference"><div class="gut">'+topbar(backBtn(),'<button class="ib" data-a="editEx" data-id="'+esc(e.id)+'" aria-label="Uredi vježbu">'+I.gear+'</button><button class="ib" data-a="exerciseMenu" data-id="'+esc(e.id)+'" aria-label="Više mogućnosti">'+I.more+'</button>')+'</div>'+mediaHtml(e)+'<h1 class="exercise-title gut">'+esc(e.name)+'</h1><div class="gut dose-area"><div class="chips dose-chips" aria-label="Doziranje">'+opts.map((o,i)=>'<button class="chip" data-a="dose" data-i="'+i+'" aria-label="'+esc(o.label)+': '+esc(dose(o.it))+'" aria-pressed="'+(i===sel)+'">'+esc(i===2?'Moja doza':dose(o.it))+'</button>').join('')+'</div>'+(sel===2?'<div class="panel">'+quickDose('Serije','sets',it.sets)+quickDose(it.measure==='time'?'Sekunde':'Ponavljanja',it.measure==='time'?'sec':'reps',it.measure==='time'?it.sec:it.reps)+quickDose('Odmor (s)','rest',it.rest)+(it.measure==='sets'?quickDose('Težina (kg)','kg',it.kg||0):'')+'</div>':'')+'<p class="dose-line">'+(it.sides?'Svaka strana · ':'')+'Odmor '+it.rest+' s'+(e.tempo?' · '+esc(e.tempo):'')+'</p>'+(p.action==='review'?'<p class="warning">'+esc(p.label)+': '+esc(p.reason)+'</p>':'')+'</div>'+informationCards(e)+'<div class="gut supporting-details">'+fold('Napredovanje i varijante',progress)+fold('Izvori i snimke',mediaCredit(e)+demoLinks(e)+sourceLinks(e))+'</div></div><div class="reference-controls"><button class="small easy-mode" data-a="dose" data-i="'+(sel===0?1:0)+'" aria-pressed="'+(sel===0)+'">'+(sel===0?'Osnovna<br>doza':'Lakši<br>način')+'</button><button class="ring" data-a="playEx" data-id="'+esc(e.id)+'" aria-label="Pokreni vježbu">'+ringSvg(1,'var(--accent)')+'<span class="n">'+I.play+'</span></button><button class="ib" data-a="expandMedia" aria-label="Video preko cijelog zaslona">'+I.expand+'</button></div>';
};
Object.assign(A,{
 homeCategory:d=>d.id==='library'?setTab('library'):go({v:'category',id:d.id}),
 infoCard:d=>{const car=app.querySelector('.info-carousel'),card=car?.children[Number(d.i)],first=car?.children[0];if(card&&first)car.scrollTo({left:card.offsetLeft-first.offsetLeft,behavior:'smooth'});},
 dot:d=>{const car=document.getElementById('car'),card=car?.children[Number(d.i)],first=car?.children[0];if(card&&first)car.scrollTo({left:card.offsetLeft-first.offsetLeft,behavior:'smooth'});},
 exerciseMenu:d=>{S.sheet={kind:'exerciseMenu',id:d.id};render();},
 menuFavorite:d=>{S.sheet=null;A.fav(d);},
 expandMedia:()=>{const video=app.querySelector('.real-media video'),media=app.querySelector('.real-media');const target=video||media;if(!target){toast('Snimka još nije dodana.');return;}if(target.requestFullscreen)target.requestFullscreen().catch(()=>toast('Cijeli zaslon nije dostupan.'));else if(video?.webkitEnterFullscreen)video.webkitEnterFullscreen();else toast('Cijeli zaslon nije dostupan u ovom pregledniku.');},
 heroCredits:()=>go({v:'heroCredits'})
});
const referenceSheet=sheetHtml;
sheetHtml=function(){if(S.sheet?.kind!=='exerciseMenu')return referenceSheet();const e=S.ex[S.sheet.id];return '<div class="sheet-bg" data-a="sheetClose"><div class="sheet gut" data-stop="1" role="dialog" aria-modal="true"><div class="grab"></div><h3>'+esc(e?.name)+'</h3><button class="opt" data-a="menuFavorite" data-id="'+esc(e?.id)+'">'+(e?.fav?'Ukloni iz favorita':'Dodaj u favorite')+'</button><button class="opt" data-a="addTo" data-id="'+esc(e?.id)+'">Dodaj u trening</button><button class="opt" data-a="editEx" data-id="'+esc(e?.id)+'">Uredi vježbu i snimku</button><button class="opt" data-a="sheetClose">Zatvori</button></div></div>';};
const referenceAfter=after;
after=function(t){
 referenceAfter(t);
 const car=document.getElementById('car');
 if(car){const i=Math.min(S.homeCard||0,car.children.length-1),first=car.children[0],chosen=car.children[i];if(chosen&&first)car.scrollLeft=chosen.offsetLeft-first.offsetLeft;car.addEventListener('scroll',()=>{const children=[...car.children],first=children[0];if(!first)return;const index=children.reduce((best,el,i)=>Math.abs(el.offsetLeft-first.offsetLeft-car.scrollLeft)<Math.abs(children[best].offsetLeft-first.offsetLeft-car.scrollLeft)?i:best,0);S.homeCard=index;document.querySelectorAll('#dots .dot').forEach((el,i)=>el.setAttribute('aria-current',String(i===index)));},{passive:true});}
 const cards=app.querySelector('.info-carousel');if(cards)cards.addEventListener('scroll',()=>{const first=cards.children[0];if(!first)return;const i=Math.round(cards.scrollLeft/(first.getBoundingClientRect().width+12));app.querySelectorAll('.info-dots button').forEach((el,k)=>el.setAttribute('aria-current',String(i===k)));},{passive:true});
};
const referencePlayer=VIEWS.play;
VIEWS.play=function(){
 if(!P||P.done||P.mode==='field')return referencePlayer();
 const st=P.steps[P.i],v=curView(),manual=st.kind==='manual',progress=(P.i+(st.dur?1-remaining()/st.dur:0))/P.steps.length;
 const phase=st.kind==='prep'?'Pripremi se':st.kind==='rest'?'Odmor':st.kind==='switch'?'Promijeni stranu':manual?'Serija '+st.set+'/'+st.it.sets:'U tijeku';
 return '<div class="view player-reference"><div class="gut">'+topbar('<button class="ib" data-a="quitPlay" aria-label="Prekini trening">'+I.back+'</button>','<button class="ib" data-a="playSettings" aria-label="Postavke playera">'+I.gear+'</button><button class="ib" data-a="playList" aria-label="Popis vježbi">'+I.more+'</button>')+'</div><div class="prog" role="progressbar" aria-label="Tijek treninga" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+Math.round(progress*100)+'"><i id="progbar" style="width:'+progress*100+'%"></i></div>'+mediaHtml(v.e,v.badge)+'<h1 class="player-title gut">'+esc(v.title)+'</h1><p class="meta gut">'+esc(v.meta)+'</p>'+(P.backgroundPaused?'<p class="warning gut">Trening je pauziran pri izlasku iz aplikacije.</p>':'')+'<p class="phase-label">'+phase+(st.side?' · '+esc(st.side):'')+'</p>'+
 (manual?'<div class="gut record-panel"><div class="set-entry">'+fieldInput('Ponavljanja','set-reps',P.setDraft.reps??st.it.reps,'number','min="1" max="100"')+fieldInput('Težina kg','set-kg',P.setDraft.kg??st.it.kg??0,'number','min="0" max="400" step="0.5"')+fieldInput('RIR 0–10','set-rir',P.setDraft.rir??'','number','min="0" max="10"')+'</div>'+(['trx','band','band-assistance'].includes(st.e?.loadRule?.type)?fieldInput('Postav opreme · kut / duljina / otpor','set-setup',P.setDraft.setup||''):'')+'</div>':'')+informationCards(v.e,true)+'</div><div class="player-reference-footer"><div class="reference-controls"><button class="ib" data-a="jump" data-d="-1" aria-label="Prethodna vježba">'+I.prev+'</button><button class="ring '+(P.paused?'dim':'')+'" data-a="pausePlay" aria-label="'+(P.paused?'Nastavi':'Pauziraj')+'">'+ringSvg(v.ringFrac,'var(--accent)')+'<span class="n" id="fbig">'+(P.paused?I.play:esc(v.big))+'</span></button><button class="ib" data-a="skipStep" aria-label="'+(manual?'Preskoči seriju':'Preskoči korak')+'">'+I.next+'</button><button class="ib expand-corner" data-a="expandMedia" aria-label="Video preko cijelog zaslona">'+I.expand+'</button></div>'+(manual?'<button class="btn complete-set" data-a="completeStep" '+(P.paused?'disabled':'')+'>Serija gotova</button>':'')+'</div>';
};
const referencePaint=paintPlayer;
paintPlayer=function(full){
 referencePaint(full);
 if(full||top().v!=='play'||!P||P.done||P.mode==='field')return;
 const v=curView(),arc=document.getElementById('ringArc'),C=2*Math.PI*35;
 if(arc)arc.setAttribute('stroke-dasharray',(C*Math.max(0,Math.min(1,v.ringFrac))).toFixed(1)+' '+C.toFixed(1));
 const progress=(P.i+(v.st.dur?1-remaining()/v.st.dur:0))/P.steps.length,pb=document.getElementById('progbar');
 if(pb){pb.style.width=(progress*100).toFixed(1)+'%';pb.parentElement.setAttribute('aria-valuenow',String(Math.round(progress*100)));}
};

init();
})();

