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
  gear:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M10.22 4.82 L10.42 2.53 L13.58 2.53 L13.78 4.82 L15.82 5.66 L17.58 4.19 L19.81 6.42 L18.34 8.18 L19.18 10.22 L21.47 10.42 L21.47 13.58 L19.18 13.78 L18.34 15.82 L19.81 17.58 L17.58 19.81 L15.82 18.34 L13.78 19.18 L13.58 21.47 L10.42 21.47 L10.22 19.18 L8.18 18.34 L6.42 19.81 L4.19 17.58 L5.66 15.82 L4.82 13.78 L2.53 13.58 L2.53 10.42 L4.82 10.22 L5.66 8.18 L4.19 6.42 L6.42 4.19 L8.18 5.66Z"/></svg>',
  tabGrid:'<svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="9" height="11.5" rx="2"/><rect x="13" y="2" width="9" height="7" rx="2"/><rect x="2" y="15.5" width="9" height="6.5" rx="2"/><rect x="13" y="11" width="9" height="11" rx="2"/></svg>',
  tabPlay:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="currentColor"/><path d="M9.5 7.2l7.5 4.8-7.5 4.8z" fill="#191D25"/></svg>',
  tabLib:'<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="5" height="18" rx="1.5"/><rect x="9.5" y="3" width="5" height="18" rx="1.5"/><path d="M16.2 4.6l3.3-.9 3 15.5-3.3.9z"/></svg>',
  tabProgress:'<svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="14" width="5" height="8" rx="1.7"/><rect x="9.5" y="8" width="5" height="14" rx="1.7"/><rect x="17" y="2" width="5" height="20" rx="1.7"/></svg>',
  filter:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4 6h16M7 12h10M10 18h4"/></svg>',
  medal:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm-4 1.6L6.5 22l5.5-2.5 5.5 2.5L16 16.6a8 8 0 0 1-8 0z"/></svg>',
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
const ZONES = ['Kuk','Gluteus','Gluteus medius','Aduktori','Fleksori kuka','Stražnja loža','Kvadriceps','Lisni mišić','Prednja potkoljenica','Core','Koljeno','Gležanj','Leđa','Prsa','Ramena','Ruke','Cijelo tijelo','Vrat'];
// the data keeps 'Core' (also in exercises you edited); on screen it is "Trup", like the library category
const exZoneLabel = z => z === 'Core' ? 'Trup' : z;
const LIBCATS = ['Sve','Favoriti','TRX','Rehab kuka','Uže i kolotur','Aktivacija','Mobilnost','Snaga','Eksplozivnost','Trup','Kondicija'];
const EQUIP = ['Šipka','Kavez','Klupa','Bučice','Girja','Landmine','TRX','Medicinka','Plyo box','Švedske ljestve','Elastično uže','Kolotur','Mini guma','Velika pilates lopta','Mala pilates lopta','Kotač','Bugarsko postolje','Strunjača','Čunjevi','Sobni bicikl','Bez opreme'];
// The front/back figure preserves stored region IDs. Exercise zones follow its selected regions;
// 'Cijelo tijelo' has no region of its own, while hip_joints marks both hip joints, not a muscle.
// `muscles` = { prime: [region ids], sec: [region ids] }; an exercise without it (your own,
// or one you edited before 1.8) is drawn from its zones: the first zone's regions as the main ones, the others' as secondary.
const MUSCLE_ZONE = { front_chest:'Prsa', front_shoulders:'Ramena', front_biceps:'Ruke', front_forearms:'Ruke', front_abs:'Core', front_obliques:'Core',
  front_hip_flexors:'Fleksori kuka', front_adductors:'Aduktori', front_quadriceps:'Kvadriceps', front_knees:'Koljeno', front_shins:'Prednja potkoljenica', front_shins_ankles:'Gležanj',
  back_upper_back_trapezius:'Leđa', back_latissimus:'Leđa', back_lower_back:'Leđa', back_rear_shoulders:'Ramena', back_triceps:'Ruke',
  back_glutes:'Gluteus', back_gluteus_medius:'Gluteus medius', back_hamstrings:'Stražnja loža', back_calves:'Lisni mišić', hip_joints:'Kuk', neck:'Vrat' };
const MUSCLES = Object.keys(MUSCLE_ZONE);
const ZONE_MUSCLES = { 'Kuk': ['front_hip_flexors', 'back_gluteus_medius'], 'Cijelo tijelo': MUSCLES.filter(r => !['hip_joints','neck','front_shins'].includes(r)) };
// Keep the established zone fallback for old exercises.
MUSCLES.filter(r => r !== 'hip_joints').forEach(r => (ZONE_MUSCLES[MUSCLE_ZONE[r]] = ZONE_MUSCLES[MUSCLE_ZONE[r]] || []).push(r));
const ZONE_ONLY = ['Cijelo tijelo'];   // zones without a selectable region survive muscle edits
const UPPER_M = ['neck','front_chest','front_shoulders','back_rear_shoulders','front_biceps','back_triceps','front_forearms','back_upper_back_trapezius','back_latissimus'];
const LEG_M = ['front_hip_flexors','front_adductors','front_quadriceps','front_knees','front_shins','front_shins_ankles','back_glutes','back_gluteus_medius','back_hamstrings','back_calves','hip_joints'];
// 1.8.1: the filter's shortcuts like GOWOD: "Cijelo tijelo" (every region), "Gornji dio" (arms, shoulders, chest, back and the trunk)
// and "Donji dio" (the legs and hips) select their whole region set; a set selected in full shows as ONE chip that removes it (all
// regions: only "Cijelo tijelo"). 1.8's 'cijelo' (exercises that work the upper body and the legs together) is gone: a saved one
// becomes the whole set (libMus).
const UPPER_SET = UPPER_M.concat(['front_abs', 'front_obliques', 'back_lower_back']);
const MUS_SETS = [['cijelo', 'Cijelo tijelo', UPPER_SET.concat(LEG_M)], ['gornji', 'Gornji dio', UPPER_SET], ['donji', 'Donji dio', LEG_M]];
const musSet = k => (MUS_SETS.find(x => x[0] === k) || [])[2];
const musSetOn = (mu, k) => { const set = musSet(k); return !!set && set.every(r => (mu || []).indexOf(r) !== -1); };
// the chips of the selected muscles: [value, label]; a full set as one chip
function musChips(mu){
  mu = mu || []; let full = MUS_SETS.filter(x => musSetOn(mu, x[0])); if (full.length && full[0][0] === 'cijelo') full = full.slice(0, 1);
  const inSet = r => full.some(x => x[2].indexOf(r) !== -1);
  return full.map(x => [x[0], x[1]]).concat(mu.filter(r => !inSet(r)).map(r => [r, muscleLabel(r)]));
}
const muscleLabel = r => window.BODY && BODY.regions && BODY.regions[r] ? BODY.regions[r].label_hr : r;
const okMuscles = a => Array.isArray(a) ? Array.from(new Set(a.filter(r => MUSCLE_ZONE[r]))) : [];
function exMuscles(e){
  const m = e && e.muscles;
  if (m && typeof m === 'object') { const prime = okMuscles(m.prime), sec = okMuscles(m.sec).filter(r => prime.indexOf(r) === -1); if (prime.length || sec.length) return { prime, sec, own: true }; }
  const zs = (e && e.zones) || [], prime = okMuscles(ZONE_MUSCLES[zs[0]] || []), sec = [];
  zs.slice(1).forEach(z => (ZONE_MUSCLES[z] || []).forEach(r => { if (prime.indexOf(r) === -1 && sec.indexOf(r) === -1) sec.push(r); }));
  return { prime, sec, own: false };
}
// Main regions first (zones[0] decides upper or lower body), with regionless zones retained.
function musclesZones(m, old){
  const out = [];
  (m.prime || []).concat(m.sec || []).forEach(r => { const z = MUSCLE_ZONE[r]; if (z && out.indexOf(z) === -1) out.push(z); });
  (old || []).forEach(z => { if (ZONE_ONLY.indexOf(z) !== -1 && out.indexOf(z) === -1) out.push(z); });
  return out;
}
// the figure (both views in one SVG), or nothing when body.js is missing (an older saved copy). act: the regions become
// buttons with that action; under each one a wider transparent hit area (drawn below the regions, so a region's own shape always
// wins) takes the taps in the gaps and around the outline, and the knees and gluteus medius get a ring above their neighbours
const BODY_HIT_UNDER = 64, BODY_HIT_OVER = { front_knees: 34, back_gluteus_medius: 22, hip_joints:50 };
function bodyFig(m, o){
  if (!window.BODY || !BODY.svg) return '';
  o = o || {};
  let svg = BODY.svg({ prime: m.prime || [], on: m.sec || [], selected:o.selected, size: o.size || 140, tappable: !!o.act, cls: o.cls || '' });
  if (!o.act) return svg;
  svg = svg.replace(/ data-region="([a-z_]+)"/g, ' data-region="$1" data-a="' + o.act + '" data-v="$1" tabindex="0"');
  // per view: the hit areas go in front of the first region (under) and in front of the outline group (over)
  return svg.replace(/(<g data-view="[a-z]+"[^>]*>)([\s\S]*?)(<g class="body-ln")/g, (all, g, regs, ln) => {
    const scale=(BODY.geom?.H||1120)/1120;
    const hit = (id, d, w) => '<path class="body-hit" data-a="' + o.act + '" data-v="' + id + '" aria-hidden="true" fill="none" stroke="transparent" stroke-width="' + w*scale + '" stroke-linejoin="round" pointer-events="stroke" d="' + d + '"/>';
    const under = [], over = [];
    regs.replace(/<path class="body-rg[^"]*" data-region="([a-z_]+)"[^>]*? d="([^"]+)"\/>/g, (x, id, d) => { under.push(hit(id, d, BODY_HIT_UNDER)); if (BODY_HIT_OVER[id]) over.push(hit(id, d, BODY_HIT_OVER[id])); return x; });
    return g + under.join('') + regs + over.join('') + ln;
  });
}
// the region chips (main ones full, secondary ones lighter); rm: an action that removes the region
function muscleTags(m, rm){
  const x = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17"/></svg>';
  const t = (r, sec) => rm ? '<button class="afc' + (sec ? ' sec' : '') + '" data-a="' + rm + '" data-v="' + r + '" aria-label="Ukloni: ' + esc(muscleLabel(r)) + (sec ? ' (pomoćni)' : '') + '">' + esc(muscleLabel(r)) + x + '</button>'
    : '<span class="tag' + (sec ? ' sec' : '') + '">' + esc(muscleLabel(r)) + '</span>';
  return m.prime.map(r => t(r, false)).join('') + m.sec.map(r => t(r, true)).join('');
}
// 1.8: equipment tiles of the library filter (Tabler Icons, MIT, and icons drawn for the app: THIRD-PARTY-NOTICES.md); a tile
// stands for one or more equipment tags (both pilates balls; the rare kit under "Ostalo")
const EQI = s => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + s + '</svg>';
const EQ_TILES = [
  ['Bez opreme', ['Bez opreme'], EQI('<path d="M6.5 21l3.5 -5"/><path d="M5 11l7 -2"/><path d="M16 21l-4 -7v-5l7 -4"/><path d="M9.007 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>')],
  ['Šipka', ['Šipka'], EQI('<path d="M1.5 12h2"/><path d="M7 12h10"/><path d="M20.5 12h2"/><rect x="3.5" y="5.5" width="2" height="13" rx="1"/><rect x="5.5" y="8.5" width="1.5" height="7" rx=".75"/><rect x="18.5" y="5.5" width="2" height="13" rx="1"/><rect x="17" y="8.5" width="1.5" height="7" rx=".75"/>')],
  ['Kavez', ['Kavez'], EQI('<path d="M6 3v18"/><path d="M18 3v18"/><path d="M6 3.5h12"/><path d="M4 21h4"/><path d="M16 21h4"/><path d="M4.5 10.5h15"/><rect x="2" y="8" width="2.5" height="5" rx="1"/><rect x="19.5" y="8" width="2.5" height="5" rx="1"/><path d="M6 15.5h2"/><path d="M18 15.5h-2"/>')],
  ['Klupa', ['Klupa'], EQI('<rect x="3" y="8" width="18" height="3.5" rx="1.5"/><path d="M7.5 11.5v7"/><path d="M16.5 11.5v7"/><path d="M5.5 18.5h4"/><path d="M14.5 18.5h4"/>')],
  ['Bučice', ['Bučice'], EQI('<g transform="rotate(-45 12 12)"><path d="M9.5 12h5"/><path d="M5.4 8.5h3.2l.9 1.75v3.5l-.9 1.75h-3.2l-.9 -1.75v-3.5z"/><path d="M15.4 8.5h3.2l.9 1.75v3.5l-.9 1.75h-3.2l-.9 -1.75v-3.5z"/></g>')],
  ['Girja', ['Girja'], EQI('<path d="M7.026 9.61l-.95 -4.18a2 2 0 0 1 1.95 -2.43h8a2 2 0 0 1 2 2.43l-1 4.2"/><path d="M9.026 17.001h6"/><path d="M18.906 20.06a7.92 7.92 0 0 0 1 -5.33a8 8 0 1 0 -14.77 5.33a2 2 0 0 0 1.71 .94h10.36a2 2 0 0 0 1.7 -.94"/>')],
  ['Landmine', ['Landmine'], EQI('<path d="M3 20.5h7"/><circle cx="6" cy="17.5" r="1.75"/><path d="M7.3 16.2l12.2 -12.2"/><rect x="-1.4" y="-4.5" width="2.8" height="9" rx="1.4" transform="translate(16 7.5) rotate(-45)"/>')],
  ['TRX', ['TRX'], EQI('<path d="M9.5 2.5h5"/><circle cx="12" cy="5" r="1.5"/><path d="M11.2 6.3l-4.7 9.7"/><path d="M12.8 6.3l4.7 9.7"/><rect x="3.5" y="16" width="6" height="3" rx="1.5"/><rect x="14.5" y="16" width="6" height="3" rx="1.5"/>')],
  ['Medicinka', ['Medicinka'], EQI('<circle cx="12" cy="12" r="9"/><path d="M3.4 9.6c5.6 1.9 11.6 1.9 17.2 0"/><path d="M3.4 14.4c5.6 1.9 11.6 1.9 17.2 0"/>')],
  ['Plyo box', ['Plyo box'], EQI('<path d="M3.5 9h13v11.5h-13z"/><path d="M3.5 9l4 -4.5h13l-4 4.5"/><path d="M20.5 4.5v11.5l-4 4.5"/><rect x="7" y="11.5" width="6" height="2.5" rx="1.25"/>')],
  ['Švedske ljestve', ['Švedske ljestve'], EQI('<path d="M6 3v18"/><path d="M18 3v18"/><path d="M6 5.5h12"/><path d="M6 9h12"/><path d="M6 12.5h12"/><path d="M6 16h12"/><path d="M6 19.5h12"/>')],
  ['Elastično uže', ['Elastično uže'], EQI('<circle cx="4.5" cy="4.5" r="1.75"/><path d="M5.8 5.8c4 3 6.5 4 4.2 7s.5 4 3 3.7"/><rect x="13" y="13.5" width="8.5" height="6.5" rx="3.25"/><path d="M17.25 13.5v6.5"/>')],
  ['Kolotur', ['Kolotur'], EQI('<path d="M8 2.5h8"/><path d="M12 2.5v2"/><circle cx="12" cy="9" r="4.5"/><circle cx="12" cy="9" r="1.25"/><path d="M16.5 9v8.5"/><path d="M13.5 17.5h6"/><path d="M14 17.5l2.5 3l2.5 -3"/><path d="M7.5 9v12"/><rect x="5.5" y="18" width="4" height="3" rx=".75"/>')],
  ['Mini guma', ['Mini guma'], EQI('<ellipse cx="12" cy="12" rx="9.5" ry="6"/><ellipse cx="12" cy="11.2" rx="6.5" ry="3"/>')],
  ['Pilates lopta', ['Velika pilates lopta', 'Mala pilates lopta'], EQI('<circle cx="12" cy="12" r="9"/><path d="M7.2 10.2a5.2 5.2 0 0 1 3 -3"/>')],
  ['Strunjača', ['Strunjača'], EQI('<circle cx="7" cy="14" r="5"/><path d="M9.5 14a2.5 2.5 0 1 1 -2.5 -2.5"/><path d="M10.6 17.5H21v1.5H7"/>')],
  ['Čunjevi', ['Čunjevi'], EQI('<path d="M4 20l16 0"/><path d="M9.4 10l5.2 0"/><path d="M7.8 15l8.4 0"/><path d="M6 20l5 -15h2l5 15"/>')],
  ['Ostalo', ['Kotač', 'Bugarsko postolje', 'Sobni bicikl'], EQI('<path d="M4 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M18 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/>')],
];
const libArr = k => { const v = lsGet(k, []); return Array.isArray(v) ? v.filter(x => typeof x === 'string') : []; };
const libMus = () => { const a = libArr('mt.libmus'); return a.indexOf('cijelo') === -1 ? a : Array.from(new Set(a.filter(r => r !== 'cijelo').concat(MUS_SETS[0][2]))); };   // 1.8.1
const tileOn = t => t[1].some(x => (S.lib.eq || []).indexOf(x) !== -1);
const sheetFilters = () => EQ_TILES.filter(tileOn).length + (S.lib.cats || []).length + musChips(S.lib.mus).length;   // 1.8.1: a full region set counts once, like its chip
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
const DOSE_KEYS = window.mtDoseKeys || ['measure', 'sets', 'reps', 'repsList', 'repSetSec', 'sec', 'secList', 'kg', 'kgList', 'startingKgKnown', 'rest', 'sides', 'r0', 'r1'];

function lsGet(k, d){ try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch(e){ return d; } }
function lsSet(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch(e){ return false; } }

/* ---------- state ---------- */
const S = {
  dbState: 'loading', loaded: {},
  ex: {}, pr: {}, field: {}, prog: {}, log: [],
  tab: 'home', stack: [{v:'home'}],
  lib: { cat: lsGet('mt.libcat', 'Sve'), q: '', eq: libArr('mt.libeq'), cats: libArr('mt.libcats'), mus: libMus() },   // 1.8: + Kategorija and Zona of the filter
  pack: lsGet('mt.pack', null),
  draft: null, pick: null, sheet: null, toast: null,
  settings: Object.assign({ sound: true, vibration: true, transSec: 10 }, lsGet('mt.settings', {})),
  canWrite: true
};
const top = () => S.stack[S.stack.length - 1];

/* ---------- durations ---------- */
// estimated from the same step list the player runs, so supersets and circuits are timed the way they are trained.
// A set with reps: 3 s per rep for lifting; a drill at the pitch (category Kondicija) about 20 s per rep (a run plus the
// walk back), or the item's own repSec (e.g. 100 for a box-to-box length run)
function repSetSeconds(item){
  const value = typeof item.repSetSec === 'string' ? workoutNumber(item.repSetSec) : item.repSetSec;
  return PlayerDose.validRepSetSeconds(value) ? value : null;
}
function manualSetEstimate({it, e, set, side}){
  const custom = repSetSeconds(it);
  const split=side==='Lijeva strana'||side==='Desna strana';
  if (custom !== null) return split ? Math.max(1,side==='Lijeva strana'?Math.ceil(custom/2):Math.floor(custom/2)) : custom;
  const repSeconds = +it.repSec > 0 ? +it.repSec : e?.cat === 'Kondicija' ? 20 : 3;
  const combined=it.sides&&!split;
  return repsOf(it, set || 1) * repSeconds * (combined ? 2 : 1) + (combined ? 5 : 0);
}
function protoMin(p){
  const s = stepsFromItems(p.items || []).reduce((a, st) => a + (st.dur || st.targetSec || 0), 0);
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
function recordedDoseLabel(x) {
  if (!x.kgList && !x.secList && !x.setNumbers) return dose(x);
  const rows=HistoryModel.recordedRows(x) || [], timed=x.measure==='time';
  if (!rows.length) return x.skipped?'Preskočeno':'Nema zabilježenih serija';
  const shown=rows.slice(0,3).map(r=>{
    const value=timed?r.sec:r.reps;
    return (value==null?'—':String(value)+(timed?' s':' pon.'))+(r.kg>0?' × '+fmtKg(r.kg):'')+(x.sides && r.sides===1?' (jedna strana)':timed&&x.sides&&r.sides===2?' prosječno po strani':'');
  });
  if (rows.length>3) shown.push('još '+(rows.length-3));
  return shown.join(' · ');
}
function exItem(e){ const m = e.measure||'sets'; return { exId: e.id, measure: m, sec: e.sec||30, sets: e.sets || (m === 'time' ? 1 : 3), reps: e.reps||10, rest: e.rest != null ? e.rest : (m === 'time' ? 15 : 45), sides: !!e.sides, kg: e.kg||0, ...(e.startingKgKnown===true?{startingKgKnown:true}:{}) }; }
function exBadge(e){ if (e.phase) return 'Faza ' + e.phase; if (e.cord) return 'Uže ' + e.cord; return ''; }
function exMeta(e){ return (e.zones && e.zones.length ? e.zones.slice(0,2).map(exZoneLabel).join(' • ') : e.cat) ; }
// Sources hidden for now (Tomislav asked on 4 Nov 2026): with false the app shows no source, author or licence anywhere (the
// "Izvor" lines of exercises and field sessions, the programme's "Izvori", the credit chip and its "Izvor i licenca" sheet, the
// pack's name on its photos), no licensed demo video or photo and no outside video link ("Pogledaj demonstraciju", "Pogledaj kod
// TAE"). The data, the licensed files and MEDIA-LICENSES.md stay as they are: true brings all of it back.
const SHOW_SOURCES = false;
// what an exercise can show, best first: your own video or photo, the two-panel picture made for the app (media.js "pic": LEFT
// start, RIGHT end; the same athlete everywhere), a licensed demo video (one tap away with the swap button), a photo from the private
// pack, a licensed photo. The swap button steps through them (S.alt). Licensed media only with SHOW_SOURCES.
function mediaList(e){
  if (!e) return [];
  const out = [], m = (window.EXMEDIA || {})[e.id] || {}, lic = { credit: m.credit, url: m.url, lic: m.lic, cid: e.id };
  if (e.media && MEDIA[e.media]) out.push({ type: e.mediaType === 'image' ? 'image' : 'video', src: MEDIA[e.media], own: true });
  if (m.pic) out.push({ type: 'image', src: m.pic, thumb: m.thumb, two: true, picY: m.picY, picBox: m.picBox });
  if (SHOW_SOURCES && m.video) out.push(Object.assign({ type: 'video', src: m.video, poster: m.img, thumb: m.thumb }, lic));
  if (MEDIA['pack:' + e.id]) out.push({ type: 'image', src: MEDIA['pack:' + e.id], credit: SHOW_SOURCES ? (S.pack && S.pack.credit) || 'Privatni paket slika' : '', pack: true });
  if (SHOW_SOURCES && m.img && !m.video) out.push(Object.assign({ type: 'image', src: m.img, thumb: m.thumb }, lic));
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
  if (m) return m.thumb || m.type === 'image' || m.poster ? '<img alt="" loading="lazy" decoding="async"'+mediaFailAttr(e, 28)+' src="'+esc(m.thumb || (m.type === 'image' ? m.src : m.poster))+'">' : '<video muted playsinline preload="metadata"'+mediaFailAttr(e, 28)+' src="'+esc(m.src)+'#t=0.5"></video>';
  return pathIcon(catIcon(e && e.cat), 28);
}
// A picture that cannot load (offline, missing file) becomes the category icon, like the home covers, so its alt
// text never prints over the player's labels.
const MEDIA_CATS = ['Rehab','Aktivacija','Mobilnost','Snaga','Eksplozivnost','Trup','Kondicija'];
function mediaFailAttr(e, size){
  const cat = e && MEDIA_CATS.includes(e.cat) ? e.cat : '';
  return ' data-fallback-cat="'+cat+'" data-fallback-size="'+size+'" onerror="mediaFail(this)"';
}
function mediaFail(el){
  if (!el || !el.parentNode || el.dataset.failed) return;
  el.dataset.failed = '1';
  const icon = document.createElement('span');
  icon.className = 'ph media-fallback'; icon.setAttribute('aria-hidden', 'true');
  icon.innerHTML = pathIcon(catIcon(el.dataset.fallbackCat || ''), Number(el.dataset.fallbackSize) || 28);
  el.replaceWith(icon);
}
window.mediaFail = mediaFail;
function packVideo(e){ return e && (S.pack && S.pack.videos || {})[e.id] || ''; }
function exAlt(e){ return e && e.alt && norm(e.alt) !== norm(e.name) ? e.alt : ''; }

/* ---------- on-device storage ---------- */
const APP_VERSION = '1.20.24';
const STORE_KEY = 'mt.data.v1';
const BACKUP_KIND = 'moj-trening-backup', PACK_KIND = 'moj-trening-media-pack';
const WORKOUT_FILE_KIND = 'moj-trening-protocol';
const PREPARED_WORKOUT = './treninzi/gornji-dio-nakon-utakmice-60min.json';
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
  try { base = JSON.parse(savedJson); theirs = cleanData(JSON.parse(cur)); } catch(e){ return false; }
  if (!base || !theirs) return false;
  const same = (a, b) => (a == null && b == null) || (a != null && b != null && mtCanon(a) === mtCanon(b));
  DATA_COLLS.forEach(c => {
    const ours = collMap(c), b = (base && base[c]) || {}, t = theirs[c] || {};
    new Set(Object.keys(b).concat(Object.keys(t))).forEach(id => {
      if (same(ours[id], b[id]) && !same(t[id], b[id])) { if (t[id]) ours[id] = Object.assign({}, t[id], { id }); else delete ours[id]; }
    });
  });
  S._deleted = Array.from(new Set((S._deleted || []).concat(theirs._deleted)));
  S.log = HistoryStore.merge(Array.isArray(base.log) ? base.log.filter(x => x && typeof x.at === 'number') : [], S.log, theirs.log, same, S._deleted);
  return true;
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
const loadRatingOpen = () => !!document.querySelector('#training-load-info[open] form[data-load-rating]');
const appBusy = () => !!P || !!FORM_VIEWS[top().v] || !!S.sheet || !!S.draft || !!S.pick || loadRatingOpen();
function applyData(d){
  for (const k in S.ex) delete S.ex[k]; for (const k in S.pr) delete S.pr[k]; for (const k in S.field) delete S.field[k];
  Object.keys(d.exercises||{}).forEach(id => S.ex[id] = Object.assign({}, d.exercises[id], { id }));
  Object.keys(d.protocols||{}).forEach(id => S.pr[id] = Object.assign({}, d.protocols[id], { id }));
  Object.keys(d.field||{}).forEach(id => S.field[id] = Object.assign({}, d.field[id], { id }));
  for (const k in S.prog) delete S.prog[k]; Object.keys(d.programs||{}).forEach(id => S.prog[id] = Object.assign({}, d.programs[id], { id }));
  S.log = HistoryStore.live(Array.isArray(d.log) ? d.log : [], d._deleted).sort((a,b) => b.at-a.at);
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
const CLEAN_NUMS = { srpe:1, sets:1, reps:1, sec:1, rest:1, kg:1, ok:1, fail:1, snoozeOk:1, up:1, easy:1, r0:1, r1:1, cap:1, at:1, secs:1, week:1, total_min:1, order:1, updatedAt:1, lastReps:1, setsDone:1, value:1, phase:1, work_s:1, rest_s:1, set_rest_s:1, distance_m:1 };
const CLEAN_LISTS = { items:1, blocks:1, steps:1, mistakes:1, zones:1, equip:1, how_hr:1, notes:1, weeks:1, sessions:1, days:1, repsList:1, rirList:1, sirList:1, kgList:1, secList:1, sideCounts:1, setNumbers:1 };
const CLEAN_WORDS = { steps:1, mistakes:1, zones:1, equip:1, how_hr:1, notes:1 };
const CLEAN_LINKS = { video:1, source:1, source_url:1 };
let cleanFixes = 0;   // how many values the last checks had to drop or convert
function cleanVal(k, v, depth){
  const drop = () => { cleanFixes++; return undefined; };
  if (v == null || depth > 12) return depth > 12 ? drop() : v;
  if (k==='repSetSec') return PlayerDose.validRepSetSeconds(v) ? v : drop();
  if (k==='targetRir' || k==='targetSir') return Number.isInteger(v) && v>=0 && v<=(k==='targetSir'?40:10)?v:drop();
  if (k === 'muscleWorkEligible') return typeof v === 'boolean' ? v : drop();
  if (k === 'muscleWork') {
    if (!Array.isArray(v)) return drop();
    return v.map(raw => {
      const snapshot = MuscleWork.sanitize(raw);
      if (snapshot && snapshot.source === 'completed') return MuscleWork.pack(snapshot);
      if (raw !== null) cleanFixes++;
      return null; // retain an explicit gap instead of treating corrupted attribution as zero work
    });
  }
  // 1.8: an exercise's muscles { prime: [region ids], sec: [region ids] } (its 'sec' is not a dose's seconds)
  if (k === 'muscles') {
    if (!isPlainObj(v)) return drop();
    const o = {}; if (Object.keys(v).some(q => q !== 'prime' && q !== 'sec')) cleanFixes++;
    ['prime', 'sec'].forEach(q => { if (v[q] === undefined) return; if (!Array.isArray(v[q])) { cleanFixes++; return; } const a = v[q].filter(x => typeof x === 'string' && !badKey(x)); if (a.length !== v[q].length) cleanFixes++; o[q] = a; });
    return o;
  }
  if (CLEAN_NUMS[k]) {
    if (typeof v === 'number') return isFinite(v) ? v : drop();
    if (typeof v === 'string' && /^-?\d+([.,]\d+)?$/.test(v.trim())) { cleanFixes++; return +v.trim().replace(',', '.'); }
    return drop();
  }
  if (CLEAN_LINKS[k]) return typeof v === 'string' && (v === '' || /^https?:\/\//i.test(v)) ? v : drop();
  if (CLEAN_LISTS[k]) {
    const perSet = ['repsList','kgList','secList','rirList','sirList','sideCounts','setNumbers'].includes(k);
    if (!Array.isArray(v)) { if (perSet) { cleanFixes++; return []; } return drop(); }
    let a;
    if (k === 'days') a = Array.from(new Set(v.filter(i => Number.isInteger(i) && i >= 0 && i < 7))).sort();
    else if (perSet) {
      const limit = { repsList:10000, kgList:10000, secList:86400, rirList:40, sirList:40, sideCounts:2, setNumbers:1000 }[k];
      a = v.slice(0,1000).map(n => {
        if (n === null) return null;
        const value = typeof n === 'string' ? cleanVal(k === 'repsList' ? 'reps' : 'kg', n, depth + 1) : n;
        if (typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= limit &&
            (!['sideCounts','setNumbers'].includes(k) || Number.isInteger(value) && value >= 1) &&
            (k !== 'repsList' || Number.isInteger(value))) return value;
        cleanFixes++; return null;
      });
    }
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
  out.log = HistoryStore.live(out.log, out._deleted);
  const repairedLog = repairKnownMasLoads(out.log);
  if (repairedLog !== out.log) { out.log = repairedLog; cleanFixes++; }
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
  for (const key of ['analysisPeriod','trainingLoadPeriod','progressChartPeriod']) {
    if (TrainingLoad.periods.includes(s[key])) o[key] = s[key];
    else delete o[key];
  }
  if (!o.analysisPeriod && (o.progressChartPeriod || o.trainingLoadPeriod)) o.analysisPeriod = o.progressChartPeriod || o.trainingLoadPeriod;
  // 1.21: the default period became 3 months. Earlier versions saved the old 7-day default with every setting,
  // so 7 days is kept only when it was picked in Napredak (analysisPeriodChosen).
  if (o.analysisPeriod === '7d' && s.analysisPeriodChosen !== true) delete o.analysisPeriod;
  if (Array.isArray(s.progressPinnedIds)) o.progressPinnedIds = [...new Set(s.progressPinnedIds.filter(id => !badKey(id)))].slice(0,3);
  else delete o.progressPinnedIds;
  const int = (k, lo, hi) => { if (k in o && o[k] !== null && !(Number.isInteger(o[k]) && o[k] >= lo && o[k] <= hi)) delete o[k]; };
  int('ballN', 0, 7); int('matchDay', -1, 6); int('progN', 2, 3); int('switchSec', 0, 3600); int('reserveEntry', 0, 2);
  if (typeof s.vibration !== 'boolean') delete o.vibration;
  if ('morningChecks' in s) o.morningChecks = TodayView.cleanChecks(s.morningChecks);
  if ('planDates' in s) o.planDates = MonthPlan.clean(s.planDates);
  if ('topKmh' in o && !(typeof o.topKmh === 'number' && o.topKmh >= 20 && o.topKmh <= 40)) delete o.topKmh;   // Najveća brzina
  return o;
}
const SETTINGS_BASE = { sound: true, vibration: true, transSec: 10, analysisPeriod:'3m', progressPinnedIds:[] };
function validSidePrep(seconds){return Number.isInteger(seconds)&&seconds>=0&&seconds<=3600;}
function workoutSidePrepSeconds(fallback=10){return validSidePrep(S.settings.switchSec)?S.settings.switchSec:fallback;}
const SIDE_PREP_CHOICES=[5,10,15,30,60];

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
  if (v === 'historyEdit' || v === 'morning' || v === 'teamEntry') return;
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
  const packId = typeof d.id === 'string' && !badKey(d.id) ? d.id : 'pack', ids = Array.from(new Set(photos.map(p => p.ex)));
  let rollback = null, staged = null, failure = null;
  try {
    await IDB.tx('readwrite', st => {
      photos.forEach(p => st.put({ type:p.type, buf:p.buf.buffer }, 'pack:' + p.ex));
      // This request runs after every photo put. Its callback still owns the transaction, so a refused
      // metadata/data write aborts ALL photos, including overwritten ones. Concurrent imports queue here.
      const ready = st.get('pack:');
      ready.onsuccess = () => {
        try {
          const current = localStorage.getItem(STORE_KEY);
          if (savedJson != null && current && current !== savedJson) mergeOtherCopy(current);
          const packRaw = localStorage.getItem('mt.pack');
          let base = S.pack; try { base = packRaw ? JSON.parse(packRaw) : null; } catch(e){}
          const old = base && Array.isArray(base.ids) ? base.ids : [];
          rollback = { data:JSON.stringify(storeObj()), packRaw, nextPack:null, dataWritten:false, saveFailed:!!S.saveFailed };
          // An unchanged older pack item follows the update; personal changes and progress stay.
          const prev = isPlainObj(d.prev) ? d.prev : {}, swapped = [];
          ['exercises', 'protocols'].forEach(cl => Object.keys(c[cl]).forEach(id => {
            const map = collMap(cl), local = map[id], olds = isPlainObj(prev[cl]) && Array.isArray(prev[cl][id]) ? prev[cl][id] : [];
            if (!local || local.pack !== packId && (cl !== 'exercises' || local.pack)) return;
            const next = Object.assign({}, c[cl][id], { id, pack:packId }), h = contentHash(Object.assign({}, local, { pack:packId }));
            if (h === contentHash(next) || olds.indexOf(h) === -1) return;
            Object.keys(HASH_SKIP).forEach(k => { if (k !== 'id' && local[k] !== undefined) next[k] = local[k]; });
            if (cl === 'protocols') { next.items = carryItems(c[cl][id], local, []); if (local.goal != null) next.goal = local.goal; }
            swapped.push(cl); map[id] = next;
          }));
          const progBefore = {}; let exN = 0, prN = 0;
          Object.keys(c.exercises).forEach(id => { if (!S.ex[id]) { S.ex[id] = Object.assign({}, c.exercises[id], { id, pack:packId }); exN++; } });
          Object.keys(c.protocols).forEach(id => { if (!S.pr[id]) { S.pr[id] = Object.assign({}, c.protocols[id], { id, pack:packId }); prN++; } });
          Object.keys(c.programs).forEach(id => { progBefore[id] = S.prog[id]; S.prog[id] = Object.assign({}, c.programs[id], { id, pack:packId }, S.prog[id] && S.prog[id].days ? { days:S.prog[id].days } : {}); });
          const pack = { id:packId, title:typeof d.title === 'string' && d.title || 'Paket slika', credit:typeof d.credit === 'string' && d.credit || 'Privatni paket slika', at:Date.now(),
            ids:old.concat(ids.filter(id => old.indexOf(id) === -1)), videos:Object.assign({}, (base && base.videos) || {}, cleanPackVideos(d.videos)),
            members:Array.from(new Set(((base && base.members) || []).concat((Array.isArray(d.members) ? d.members : []).filter(x => typeof x === 'string' && !badKey(x))))) };
          const progs = Object.keys(c.programs);
          staged = { pack, result:{ photos:ids.filter(id => old.indexOf(id) === -1).length, exercises:exN, sessions:prN, programs:progs.filter(id => !progBefore[id]).length,
            updEx:swapped.filter(cl => cl === 'exercises').length, updPr:swapped.filter(cl => cl === 'protocols').length,
            updPg:progs.filter(id => progBefore[id] && mtCanon(progBefore[id]) !== mtCanon(S.prog[id])).length } };
          const nextPack = JSON.stringify(pack);
          localStorage.setItem('mt.pack', nextPack); rollback.nextPack = nextPack;
          if (exN || prN || swapped.length || progs.length) {
            if (!persist()) throw packError('Podaci paketa nisu spremljeni.');
            rollback.dataWritten = true;
          }
        } catch(e){ failure = e; st.transaction.abort(); }
      };
      return ready;
    });
  } catch(e){
    let restored = true;
    if (rollback) {
      const before = JSON.parse(rollback.data); applyData(before); S._deleted = before._deleted || [];
      if (rollback.dataWritten && !persist()) restored = false;
      try { if (rollback.nextPack && localStorage.getItem('mt.pack') === rollback.nextPack) {
        if (rollback.packRaw === null) localStorage.removeItem('mt.pack'); else localStorage.setItem('mt.pack', rollback.packRaw);
      } } catch(err){ restored = false; }
      if (restored) S.saveFailed = rollback.saveFailed;
    }
    console.error('pack import not stored', failure || e);
    throw packError(restored ? 'Paket nije uvezen: memorija aplikacije je puna ili spremanje nije dostupno. Na mobitelu je sve ostalo kao prije.'
      : 'Uvoz nije završen, a prethodni podaci nisu se mogli potpuno vratiti. Izvezi sigurnosnu kopiju prije zatvaranja aplikacije.');
  }
  // Publish only after transactioncomplete: a refused import never replaces a currently displayed image.
  photos.forEach(p => { const k = 'pack:' + p.ex; if (MEDIA_URLS[k]) URL.revokeObjectURL(MEDIA_URLS[k]); MEDIA_URLS[k] = URL.createObjectURL(new Blob([p.buf], { type: p.type })); });
  S.pack = staged.pack; try { localStorage.removeItem('mt.packOld'); } catch(e){}
  return staged.result;
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
  restoreUnsavedDraft();
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
const logKey = l => l.historyId || (l.at || 0) + '|' + (l.kind || '') + '|' + (l.refId || l.test || '');
const lostEntries = (log, incoming) => { const have = new Set((incoming || []).filter(Boolean).map(logKey)); return (log || []).filter(l => l && !have.has(logKey(l))); };
const lostText = lost => { const t = nTrainings(lost), r = lost.filter(l => l.kind === 'test').length, e = lost.filter(l => l.kind === 'exercise').length;
  const p = [t ? t + ' ' + plural(t, 'trening', 'treninga', 'treninga') : '', r ? r + ' ' + plural(r, 'rezultat testa', 'rezultata testa', 'rezultata testa') : '', e ? e + ' ' + plural(e, 'vježba iz knjižnice', 'vježbe iz knjižnice', 'vježbi iz knjižnice') : ''].filter(Boolean);
  return p.length > 1 ? p.slice(0, -1).join(', ') + ' i ' + p[p.length - 1] : p[0] || ''; };
// nothing of yours on the phone yet (a fresh start: no history or programme, nothing created, changed or deleted): an import
// then keeps no way back, since going back would only empty the app
const nothingOwn = () => !S.log.length && !(S._deleted || []).length && !Object.keys(S.prog).length &&
  !Object.keys(S.settings.morningChecks || {}).length && !Object.keys(S.settings.planDates || {}).length && !Object.keys(S.settings.matchDates || {}).length &&
  ['exercises', 'protocols', 'field'].every(c => Object.values(collMap(c)).every(x => { const f = ((window.SEED || {})[c] || {})[x.id]; return !!f && contentHash(x) === contentHash(f); }));
const dataCounts = (d, settings) => { const nPr = Object.values(d.protocols || {}).filter(p => !(p && p.program)).length, nG = Object.keys(d.programs || {}).length, nT = nTrainings(d.log), nM=Object.keys(settings?.morningChecks || {}).length;
  return nVj(Object.keys(d.exercises || {}).length) + ' • ' + nPr + ' ' + plural(nPr, 'protokol', 'protokola', 'protokola') + (nG ? ' • ' + nG + ' ' + plural(nG, 'program', 'programa', 'programa') : '') + ' • ' + nT + ' ' + plural(nT, 'trening', 'treninga', 'treninga') + ' u povijesti' + (nM?' • '+nM+' '+plural(nM,'jutarnja provjera','jutarnje provjere','jutarnjih provjera'):''); };
const backupObject = () => ({ kind: BACKUP_KIND, v: 1, app: APP_VERSION, exportedAt: new Date().toISOString(), exercises: S.ex, protocols: S.pr, field: S.field, programs: S.prog, log: S.log, _deleted: S._deleted || [], settings: S.settings });
// A sheet intentionally defers another tab's UI changes. Export a detached,
// up-to-date snapshot instead of exporting that deferred screen or saving over it.
function freshBackupObject(){
  let rawData, rawSettings, stable = false;
  for (let attempt = 0; attempt < 3; attempt++) {
    rawData = localStorage.getItem(STORE_KEY);
    rawSettings = localStorage.getItem('mt.settings');
    if (rawData === localStorage.getItem(STORE_KEY) && rawSettings === localStorage.getItem('mt.settings')) { stable = true; break; }
  }
  if (!stable || (!rawData && savedJson != null)) throw new Error('backup source changed');
  const snapshot = clone(backupObject());
  if (rawData && rawData !== savedJson) {
    const parsed = JSON.parse(rawData);
    if (!isPlainObj(parsed) || !isPlainObj(parsed.exercises) || !isPlainObj(parsed.protocols) || !Array.isArray(parsed.log)) {
      throw new Error('backup source unreadable');
    }
    const theirs = cleanData(parsed), base = savedJson == null ? null : JSON.parse(savedJson);
    if (!base) {
      DATA_COLLS.forEach(c => snapshot[c] = theirs[c]);
      snapshot.log = theirs.log; snapshot._deleted = theirs._deleted;
    } else {
      const same = (a,b) => (a == null && b == null) || (a != null && b != null && mtCanon(a) === mtCanon(b));
      DATA_COLLS.forEach(c => {
        const ours = snapshot[c], previous = base[c] || {}, latest = theirs[c] || {};
        new Set(Object.keys(previous).concat(Object.keys(latest))).forEach(id => {
          if (same(ours[id],previous[id]) && !same(latest[id],previous[id])) {
            if (latest[id]) ours[id] = {...latest[id],id}; else delete ours[id];
          }
        });
      });
      snapshot._deleted = Array.from(new Set(snapshot._deleted.concat(theirs._deleted)));
      snapshot.log = HistoryStore.merge(base.log || [],snapshot.log,theirs.log,same,snapshot._deleted);
    }
  }
  if (rawSettings !== null) {
    const settings = JSON.parse(rawSettings);
    if (!isPlainObj(settings)) throw new Error('backup settings unreadable');
    snapshot.settings = {...SETTINGS_BASE,...cleanSettings(settings)};
  } else snapshot.settings = {...SETTINGS_BASE};
  return snapshot;
}
// a backup is recognised by its content; the photo pack (also a .json file) is sent to its own row
function backupProblem(d){
  if (isPlainObj(d) && d.kind === PACK_KIND) return 'Ovo je paket slika, a ne sigurnosna kopija. Ništa nije promijenjeno. Paket se uvozi u retku „Uvezi paket slika”.';
  if (isPlainObj(d) && d.kind === WORKOUT_FILE_KIND) return 'Trening dodaj kroz Moji protokoli → Uvezi trening.';
  if (!isPlainObj(d) || (d.kind && d.kind !== BACKUP_KIND) || !(d.v === 1 || d.v === 2) || !isPlainObj(d.exercises) || !isPlainObj(d.protocols) || !Array.isArray(d.log)) return 'Ta datoteka nije sigurnosna kopija ove aplikacije. Ništa nije promijenjeno.';
  return '';
}

// A workout file only supplies a new draft. Library entries, dates and history stay local.
function workoutFileDraft(data){
  const textFits = (value, limit) => typeof value === 'string' && value.trim().length <= limit;
  if (!isPlainObj(data) || data.kind !== WORKOUT_FILE_KIND || data.v !== 1) {
    throw new Error('Odaberi JSON datoteku pojedinačnog treninga.');
  }
  if (!textFits(data.name, 120) || !data.name.trim() ||
      (data.desc != null && !textFits(data.desc, 1600)) ||
      !Array.isArray(data.items) || data.items.length < 1 || data.items.length > 30) {
    throw new Error('Trening treba imati naziv i od 1 do 30 vježbi.');
  }
  const integerIn = (value, min, max) => Number.isInteger(value) && value >= min && value <= max;
  const items = data.items.map((item, index) => {
    const number = index + 1;
    const exercise = isPlainObj(item) && typeof item.exId === 'string' && Object.hasOwn(S.ex, item.exId) && S.ex[item.exId];
    if (!exercise) throw new Error('Vježba ' + number + ' nije u tvojoj knjižnici.');
    const base = exItem(exercise);
    const timed = base.measure === 'time';
    const validDose = timed ? integerIn(item.sec, 5, 600) : integerIn(item.reps, 1, 60);
    if (!validDose || !integerIn(item.sets, 1, 10) || !integerIn(item.rest, 0, 300) ||
        (item.kg != null && (!Number.isFinite(item.kg) || item.kg < 0 || item.kg > 5000)) ||
        (item.targetRir != null && (timed || !integerIn(item.targetRir, 0, 10))) ||
        (item.repSetSec != null && (timed || !PlayerDose.validRepSetSeconds(item.repSetSec))) ||
        (item.section != null && !textFits(item.section, 80)) ||
        (item.note != null && !textFits(item.note, 300))) {
      throw new Error('Provjeri serije, dozu i odmor za vježbu ' + number + '.');
    }
    const dose = { exId: exercise.id, measure: base.measure, sides: base.sides, sets: item.sets,
      reps: timed ? base.reps : item.reps, sec: timed ? item.sec : base.sec, rest: item.rest, kg: item.kg ?? 0 };
    if (item.targetRir != null) dose.targetRir = item.targetRir;
    if (item.repSetSec != null) dose.repSetSec = item.repSetSec;
    if (item.section?.trim()) dose.section = item.section.trim();
    if (item.note?.trim()) dose.note = item.note.trim();
    return dose;
  });
  return { name: data.name.trim(), desc: data.desc?.trim() || '', items };
}

async function previewWorkoutImport(read){
  const sheet = S.sheet, origin = top();
  if (sheet?.kind !== 'importWorkout' || sheet.loading || origin.v !== 'protocols') return;
  sheet.loading = true;
  render();
  try {
    const data = await read();
    if (S.sheet !== sheet || top() !== origin) return;
    S.draft = { ...workoutFileDraft(data), id: uid('p'), _open: null, _fromWorkoutFile: true };
    S.draftSig = draftSig(S.draft);
    go({ v:'build', id: S.draft.id });
  } catch (error) {
    if (S.sheet !== sheet || top() !== origin) return;
    sheet.loading = false;
    render();
    toast(error.message, true);
  }
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
const FORM_VIEWS = { exEdit:1, build:1, play:1, historyEdit:1, morning:1, teamEntry:1 };
// Drafts belong to this tab, never to the saved workout database. A refresh can
// recover them; closing/reloading also gets the browser's native dirty warning.
const DRAFT_KEY = 'mt.unsavedDraft.v1';
const EDIT_FORMS = {historyEdit:'history-edit-form',morning:'morning-form',teamEntry:'team-entry-form'};
function formFieldKey(el) {
  return el.id || (el.name ? el.name + ((el.type==='checkbox'||el.type==='radio') ? ':'+el.value : '') : dsKey(el));
}
function formValues(form) {
  const values = {};
  if (form) for (const el of form.querySelectorAll('input,select,textarea')) {
    if (el.type==='file' || !formFieldKey(el)) continue;
    values[formFieldKey(el)] = el.type==='checkbox'||el.type==='radio' ? el.checked : el.value;
  }
  return values;
}
function captureEditForm() {
  const t=top(), form=document.getElementById(EDIT_FORMS[t.v]);
  if (form && app.dataset.key===viewKey()) t._formValues=formValues(form);
}
function restoreEditForm() {
  const t=top(), form=document.getElementById(EDIT_FORMS[t.v]);
  if (!form) return;
  if (!t._formBase) t._formBase=formValues(form);
  if (t._formValues) for (const el of form.querySelectorAll('input,select,textarea')) {
    const key=formFieldKey(el);
    if (el.type==='file' || !Object.prototype.hasOwnProperty.call(t._formValues,key)) continue;
    if (el.type==='checkbox'||el.type==='radio') el.checked=!!t._formValues[key]; else el.value=t._formValues[key];
  }
}
function unsavedChanges() {
  const t=top();
  if (['build','exEdit'].includes(t.v)) return !!S.draft && draftSig(S.draft)!==S.draftSig;
  return !!EDIT_FORMS[t.v] && !!t._formBase && mtCanon(t._formValues || formValues(document.getElementById(EDIT_FORMS[t.v])))!==mtCanon(t._formBase);
}
function draftSnapshot() {
  captureEditForm();
  const dirtyDraft=(S.draft && draftSig(S.draft)!==S.draftSig) || (S.below && draftSig(S.below.draft)!==S.below.sig);
  if (!dirtyDraft && !unsavedChanges()) return null;
  const sources=[];
  for (const draft of [S.draft,S.below?.draft]) if (draft) {
    const coll=Array.isArray(draft.items)?'pr':'ex';
    sources.push({coll,id:draft.id,value:mtCanon(S[coll][draft.id] || null)});
  }
  return {v:1,at:Date.now(),tab:S.tab,stack:S.stack,draft:S.draft,draftSig:S.draftSig,below:S.below,pick:S.pick,sources};
}
let draftCheckpointFailed=false;
function checkpointDraft() {
  if (S.dbState!=='ready') return false;
  let snapshot;
  try {
    snapshot=draftSnapshot();
    if (snapshot) sessionStorage.setItem(DRAFT_KEY,JSON.stringify(snapshot)); else sessionStorage.removeItem(DRAFT_KEY);
    draftCheckpointFailed=false;
    return true;
  } catch(e) {
    if (snapshot && !draftCheckpointFailed) {
      draftCheckpointFailed=true;
      toast('Privremeni nacrt nije sačuvan. Spremi unos prije osvježavanja ili zatvaranja.',true);
    }
    return false;
  }
}
function restoreUnsavedDraft() {
  let d;
  try {d=JSON.parse(sessionStorage.getItem(DRAFT_KEY));} catch(e) {return;}
  if (!d || d.v!==1 || !Array.isArray(d.stack) || !d.stack.length || d.stack.length>40 || d.stack.some(x=>!x || !VIEWS[x.v] || x.v==='play') ||
      (d.draft && (typeof d.draft!=='object' || typeof d.draft.id!=='string')) ||
      (d.below && (!d.below.draft || typeof d.below.draft.id!=='string')) ||
      !['home','dashboard','library','protocols','progress','analytics'].includes(d.tab)) return;
  // A saved protocol/exercise changed while this tab was gone: retain its new
  // version and recover the editor as a new copy, never overwrite it silently.
  let copied=false;
  for (const source of Array.isArray(d.sources)?d.sources:[]) {
    if (!source || typeof source.id!=='string') continue;
    if (!['pr','ex'].includes(source.coll) || mtCanon(S[source.coll][source.id] || null)===source.value) continue;
    for (const draft of [d.draft,d.below?.draft]) if (draft?.id===source.id) {
      const old=draft.id;draft.id=uid(source.coll==='pr'?'p':'e');
      draft.name=(draft.name || 'Unos')+' (oporavljeni nacrt)';
      for (const key of ['program','pack','home','week','slot','goalSkip']) delete draft[key];
      if (source.coll==='pr') {draft.days=[];for (const item of draft.items || []) for(const key of PROG_STATE)delete item[key];}
      copied=true;
      for (const entry of d.stack) if (entry.id===old && ['build','exEdit'].includes(entry.v)) entry.id=draft.id;
    }
  }
  S.tab=d.tab==='progress'?'analytics':d.tab;S.stack=d.stack;S.draft=d.draft || null;S.draftSig=d.draftSig;S.below=d.below || null;S.pick=d.pick || null;
  if (S.draft) delete S.draft._uploading;
  // Form baselines/original history rows remain pinned; their normal save path
  // detects a newer edit in another tab before accepting the recovered values.
  setTimeout(()=>toast(copied?'Izvornik je u međuvremenu promijenjen. Tvoj je unos vraćen kao novi nacrt.':'Nespremljeni unos je vraćen. Pregledaj ga pa spremi.'),0);
}

// One same-document guard routes the browser's Back through the same close /
// discard decisions as the app. It is removed on a clean root screen, so Back
// can leave the site; Forward never revives a saved form or an old player.
const NAV_KEY='mtNavigation';
const navId=history.state?.[NAV_KEY]?.id || uid('n');
let navMoving=false;
function navigationNeeded() {return S.stack.length>1 || !!S.sheet || !!S.pick || !!P;}
function syncNavigation() {
  if (S.dbState!=='ready' || navMoving) return;
  const state=history.state?.[NAV_KEY], guarded=state?.id===navId && state.guard===1;
  try {
    if (navigationNeeded() && !guarded) {
      history.replaceState({...history.state,[NAV_KEY]:{id:navId,guard:0}},'');
      history.pushState({[NAV_KEY]:{id:navId,guard:1}},'');
    } else if (!navigationNeeded() && guarded) {navMoving=true;history.back();}
  } catch(e) {navMoving=false;}
}
function dismissSheet() {
  if (!S.sheet) return;
  if(S.sheet.kind.startsWith('cinema')){cinemaCloseSheet();return;}
  if(S.sheet.returnCinemaMenu){cinemaCloseSheet();return;}
  if (['workoutExercise','workoutSwap','workoutReplace'].includes(S.sheet.kind)) {workoutClose();return;}
  if (S.sheet.kind==='quit') {A.quitResume();return;}
  if (['playDose','playDoseHelp'].includes(S.sheet.kind)) {A.playDoseCancel();return;}
  S.sheet=null;render();
}
function browserBack() {
  if (document.getElementById('progress-info')?.open) {ProgressView.closeInfo();return;}
  if (document.getElementById('training-load-info')?.open) {TrainingLoadView.closeInfo();return;}
  if (S.sheet) {dismissSheet();return;}
  if (P && top().v==='play') {
    if (P.done) toast('Pregledaj odrađeno pa spremi trening gumbom pri dnu.'); else A.quitPlay();
    return;
  }
  if (S.pick && top().v==='library') {A.pickCancel();return;}
  A.back();
}
window.addEventListener('popstate',ev=>{
  if (navMoving) {navMoving=false;syncNavigation();return;}
  const state=ev.state?.[NAV_KEY];
  // Forward may land on an obsolete guard after the UI already reached root.
  // Remove it immediately; the next Back must still leave the site in one step.
  if (state?.id===navId && state.guard===1) {syncNavigation();return;}
  if (state?.id!==navId || state.guard!==0 || !navigationNeeded()) return;
  syncNavigation();browserBack();
});
window.addEventListener('beforeunload',ev=>{
  const dirty=!!draftSnapshot();checkpointDraft();
  if (dirty) {ev.preventDefault();ev.returnValue='';}
});
window.addEventListener('pagehide',checkpointDraft);
let renderQueued = false;
function softRender(){
  if (FORM_VIEWS[top().v] || loadRatingOpen()) return; // never clobber an open form or the running player
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
  if(el.classList?.contains('workout-set-input'))return {workout:dsKey(el)};
  if (el.id === 'cinema-prep-range') return { id: el.id };
  if (el.id === 'sheet-h') return { sheet: 1 };
  if (el.id==='workout-swap-search'||el.dataset?.swapFilter) return { id:el.id };
  if (el.dataset && el.dataset.a && el.dataset.a !== 'sheetClose') return { a: el.dataset.a, ds: dsKey(el) };
  if (el.id && el.type === 'file') return { id: el.id };   // the hidden file field behind "Uvezi kopiju" and similar
  return null;
}
// root: the open sheet, so a control with the same data-* on the inert screen behind it is never picked
function focusEl(k, root){
  if (!k) return null;
  if(k.workout)return Array.from((root||app).querySelectorAll('.workout-set-input')).find(el=>dsKey(el)===k.workout)||null;
  if (k.sheet) return document.getElementById('sheet-h');
  if (k.id) return document.getElementById(k.id);
  for (const el of (root || app).querySelectorAll('[data-a]')) if (el.dataset.a === k.a && dsKey(el) === k.ds) return el;
  return null;
}
function refocus(fk, key){
  const sheet = app.querySelector('.sheet'), kind = sheet ? S.sheet?.kind : null;
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
  captureEditForm();
  if (pendingExt && !appBusy()) takeOtherCopy();
  const key = viewKey();
  const enteredView = app.dataset.key !== key;
  const fk = focusKey(document.activeElement);
  if (fk && fk.a && app.dataset.key && app.dataset.key !== key) focusMem[app.dataset.key] = fk;
  const old = app.querySelector('.view');
  if (old && app.dataset.key) scrollMem[app.dataset.key] = old.scrollTop;
  if (old?.classList.contains('dy-today')) {
    const today = S.stack.findLast(entry=>entry.v==='today');
    if (today) todayExpanded.set(today,Array.from(old.querySelectorAll('[data-today-detail][open]'),detail=>detail.dataset.todayDetail));
  }
  // 1.8: a sheet rebuilt by a tap inside it (the filter's tiles and figure) stays where it was scrolled
  const oldSheet = app.querySelector('.sheet');
  const oldSheetScroller = oldSheet?.querySelector(':scope > .fbody, :scope > .workout-swap-body') || oldSheet;
  const sheetTop = oldSheet && S.sheet && oldSheet.dataset.kind === S.sheet.kind ? oldSheetScroller.scrollTop : 0;
  if(oldSheet?.dataset.kind==='cinemaJournal'&&S.playerJournal)S.playerJournal.scroll=oldSheet.querySelector('.workout-journal-blocks')?.scrollTop||0;
  if(oldSheet?.dataset.workoutKey){S.workoutScroll=S.workoutScroll||{};S.workoutScroll[oldSheet.dataset.workoutKey]=oldSheet.querySelector('.view')?.scrollTop||0;}
  const t = top();
  const fn = VIEWS[t.v] || VIEWS.home;
  let html;
  // one damaged value must not take the whole app down: the screen says so, the rest keeps working
  try { html = fn(t); }
  catch(e){ console.error('view failed', t.v, e); html = '<div class="view gut">' + topbar(S.stack.length > 1 ? backBtn() : '') + '<div class="empty">Ovaj zaslon se ne može prikazati: neki spremljeni podaci su neispravni. Ostatak aplikacije radi.<button class="txtbtn" data-a="dataSheet">Moji podaci</button></div></div>'; }
  const rootView = ['home', 'dashboard', 'protocols', 'library', 'progress', 'analytics'].includes(t.v) && !S.pick;
  if (rootView) html += tabbar();
  if (S.sheet && S.sheet.kind !== 'cinemaPrep') { try { html += sheetHtml(); } catch(e){ console.error('sheet failed', e); S.sheet = null; } }
  if (S.toast) html += '<div class="toast" role="' + (S.toastErr ? 'alert' : 'status') + '">' + esc(S.toast) + '</div>';
  app.innerHTML = html;
  app.dataset.key = key;
  restoreEditForm();
  const v = app.querySelector('.view');
  if (v && enteredView && (t.v === 'muscleWeek' || v.matches('.pg-cinema'))) v.classList.add('charts-entering');
  if (v && scrollMem[key] != null) v.scrollTop = scrollMem[key];
  if (sheetTop) {
    const sheet = app.querySelector('.sheet'), scroller = sheet?.querySelector(':scope > .fbody, :scope > .workout-swap-body') || sheet;
    if (scroller) scroller.scrollTop = sheetTop;
  }
  const ws=app.querySelector('.workout-fullscreen');if(ws){const wv=ws.querySelector('.view');if(wv)wv.scrollTop=S.workoutScroll?.[ws.dataset.workoutKey]||0;}
  const cj=app.querySelector('.cinema-journal .workout-journal-blocks');if(cj&&S.playerJournal?.scroll!=null)cj.scrollTop=S.playerJournal.scroll;
  after(t);
  attachSheetGestures();
  refocus(fk, key);
  checkpointDraft();
  syncNavigation();
}
function go(entry){ S.stack.push(entry); S.sheet = null; render(); }
function back(){
  if (S.stack.length > 1) S.stack.pop();
  else if (['analytics','progress','trainingLoad'].includes(top().v)) { setTab('home'); return; }
  S.sheet = null; render();
}
function setTab(tab){
  if (tab==='analytics') {
    // The Progress header has a Back button, so keep its origin on the stack.
    if (top().dosing) A.progTab({v:'pregled'});
    else if (!['analytics','progress','trainingLoad'].includes(top().v)) go({v:tab,focus:'overview'});
    else app.querySelector('.pg-cinema')?.scrollTo(0,0);
    return;
  }
  S.tab = tab; S.pick = null; S.stack = [{v:tab}]; S.sheet = null; render();
}
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
  const t = ['analytics','progress','trainingLoad','muscleWeek'].includes(top().v)?'analytics':S.tab;
  return '<nav class="tabbar gut" aria-label="Glavna navigacija">' +
    '<button class="tab" data-a="tab" data-tab="dashboard" aria-label="Moj pregled"' + (t==='dashboard'?' aria-current="page"':'') + '>' + I.tabGrid + '<span>Moj pregled</span></button>' +
    '<button class="tab" data-a="tab" data-tab="home" aria-label="Početna"' + (t==='home'?' aria-current="page"':'') + '>' + I.tabPlay + '<span>Početna</span></button>' +
    '<button class="tab" data-a="tab" data-tab="library" aria-label="Knjižnica vježbi"' + (t==='library'?' aria-current="page"':'') + '>' + I.tabLib + '<span>Knjižnica</span></button>' +
    '<button class="tab" data-a="tab" data-tab="analytics" aria-label="Napredak"' + (t==='analytics'?' aria-current="page"':'') + '>' + I.tabProgress + '<span>Napredak</span></button>' +
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
// 1.21: the share of its planned work sets a protocol session did. A session fills a plan day from half of them, or when
// you tap "Računaj kao odrađeno" on the done screen (countsAsDone); otherwise it is shown as "djelomično". Field and team
// sessions and logs without set counts count whole.
function sessionShare(l){
  if (!l || (l.kind != null && l.kind !== 'protocol') || !Array.isArray(l.items)) return 1;
  let planned = 0, done = 0;
  l.items.forEach(x => {
    if (!x || x.warmup === true) return;
    const n = Number.isInteger(x.sets) && x.sets > 0 ? x.sets : 0; if (!n || x.historySetsUnknown === true) return;   // unknown, never zero
    planned += n;
    // an older log item (1.1/1.2) without done or setsDone did its planned sets, as HistoryModel.recordedRows assumes
    done += x.skipped ? 0 : Number.isInteger(x.setsDone) ? Math.min(n, Math.max(0, x.setsDone)) : n;
  });
  return planned ? done / planned : 1;
}
const planCounts = l => !!l && (l.countsAsDone === true || sessionShare(l) >= 0.5);
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
  const left = S.log.filter(l => isTraining(l) && l.at >= ws && l.at <= Date.now() && slotHit({ kind:'program', id:g.id }, l)).map(l => dayIdx(l.at));
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
// 1.8.2: a slot with f = 0 (a past day added after it ended, or one removed after it was trained; see weekPlan) counts only
// when it is done. After the same-day pass the past days fill first (planned in time before added late), the days to come last,
// so a session made up today goes to the missed day it makes up, never to a later day of the same session; a slot you skipped this week (Preskoči, skipSet) is neither planned nor missed; a removed
// slot that is not done is gone. planned / done count the slots that count.
const slotKey = s => (s.kind === 'field' ? 'f' : s.kind === 'program' ? 'g' : 'p') + ':' + s.id + ':' + s.day;
const slotCounts = s => !s.skip && (s.f !== 0 || s.done);
function weekStatus(ws, plan){
  const we = calDay(ws, 7), log = S.log.filter(l => isTraining(l) && l.at >= ws && l.at < we && l.at <= Date.now()), sk = skipSet(ws);
  const upTo = ws === weekStart(Date.now()) ? dayIdx(Date.now()) : ws < Date.now() ? 7 : -1;   // the days before this one are past
  const used = {}, all = (plan || weekPlan(ws)).map(p => Object.assign({ done: false, f: 1 }, p, { skip: !!sk[slotKey(p)] }));
  const live = all.filter(s => !s.skip), fill = (list, sameDay) => list.forEach(s => { if (s.done) return;
    const k = log.findIndex((l, i) => !used[i] && slotHit(s, l) && planCounts(l) && (!sameDay || dayIdx(l.at) === s.day));
    if (k !== -1) { used[k] = 1; s.done = true; s.l = log[k]; } });
  fill(live, true); fill(live.filter(s => s.day < upTo && s.f !== 0), false); fill(live.filter(s => s.day < upTo && s.f === 0), false); fill(live.filter(s => s.day >= upTo), false);
  // a partial session leaves its slot open and marks it "djelomično" (the same day first)
  [true, false].forEach(sameDay => live.forEach(s => { if (s.done || s.partial) return;
    const k = log.findIndex((l, i) => !used[i] && slotHit(s, l) && !planCounts(l) && (!sameDay || dayIdx(l.at) === s.day));
    if (k !== -1) { used[k] = 1; s.partial = log[k]; } }));
  const slots = all.filter(s => !(s.gone && !s.done));
  // this week's programme slots: the session you did, otherwise the programme's next sessions in order, today's slot first,
  // then the missed days (made up next), then the days to come: today never offers a later session than the programme page
  if (ws === weekStart(Date.now())) { const next = {}, today = dayIdx(Date.now()), rank = s => s.day === today ? 0 : s.day < today ? 1 : 2;
    slots.slice().sort((a, b) => rank(a) - rank(b) || a.day - b.day).forEach(s => { if (s.kind !== 'program' || (s.skip && !s.done)) return;   // a skipped day does not use up a session
      const x = s.l ? { pr: s.l.refId } : (next[s.id] = next[s.id] || (S.prog[s.id] ? progStatus(S.prog[s.id]).items.filter(y => !y.done && S.pr[y.pr]) : [])).shift();
      const p = x && S.pr[x.pr]; if (p) Object.assign(s, { pr: x.pr, name: p.name, min: protoMin(p) }); else if (s.l) s.name = s.l.name;
    }); }
  return { slots, log, planned: slots.filter(slotCounts).length, done: slots.filter(s => slotCounts(s) && s.done).length };
}
// the plan of each week as this phone showed it (localStorage 'mt.weeks': week start → [kind, id, day, f]): a past week is
// judged by the plan you had then, so changing the plan today does not rewrite your streak; weeks from before (or another
// phone) use today's plan. f = 1: planned before that day ended (counts); f = 0: added after the day ended, or removed after it
// was trained (counts only when done); an entry without f (1.8.1 and older) is 1. The days of a programme that is no longer on
// the phone (pack removed) are left out: its sessions can no longer be recognised.
const PLAN_KEY = 'mt.weeks', SKIP_KEY = 'mt.skips';
function planSnaps(){
  const o = lsGet(PLAN_KEY, null), out = {};
  if (isPlainObj(o)) Object.keys(o).forEach(k => { const v = o[k]; if (!Array.isArray(v)) return;
    const s = v.filter(x => Array.isArray(x) && typeof x[1] === 'string' && Number.isInteger(x[2]) && x[2] >= 0 && x[2] < 7 && (x[0] !== 'g' || !!S.prog[x[1]]))
      .map(x => ({ kind: x[0] === 'f' ? 'field' : x[0] === 'g' ? 'program' : 'protocol', id: x[1], day: x[2], f: x[3] === 0 ? 0 : 1 }));
    if (s.length || !v.length) out[k] = s; });
  return out;
}
// slots: weekStatus(ws, weekPlan(ws)).slots — a removed day that is not done is not kept, so a later training cannot bring it back
function notePlan(ws, slots){
  const o = lsGet(PLAN_KEY, null), m = isPlainObj(o) ? o : {};
  const v = slots.filter(s => !(s.gone && !s.done)).map(s => [s.kind === 'field' ? 'f' : s.kind === 'program' ? 'g' : 'p', s.id, s.day, s.f === 0 ? 0 : 1]);
  if (JSON.stringify(m[ws]) === JSON.stringify(v)) return;
  m[ws] = v;
  const old = calDay(ws, -7 * 105); Object.keys(m).forEach(k => { if (!(+k >= old)) delete m[k]; });
  lsSet(PLAN_KEY, m);
}
// 1.8.2 (review): the days of a session changed: this week's snapshot is written at once, so a day removed while it is not done is
// gone before any later training (not only once the home screen or Napredak has shown the change)
function planSaved(){ if (S.dbState !== 'ready') return; const ws = weekStart(Date.now()); notePlan(ws, weekStatus(ws, weekPlan(ws)).slots); }
// 1.8.2: the slots you skipped (Preskoči on the home screen or in the day sheet), per week: week start → [slotKey]. A skipped
// slot is neither planned nor missed that week; Vrati takes it back. Kept as long as the week snapshots (105 weeks), so the streak never changes back in time.
function skipSet(ws){ const o = lsGet(SKIP_KEY, null), v = isPlainObj(o) && Array.isArray(o[ws]) ? o[ws] : [], out = {}; v.forEach(k => { if (typeof k === 'string') out[k] = 1; }); return out; }
function setSkip(ws, key, on){
  const o = lsGet(SKIP_KEY, null), m = isPlainObj(o) ? o : {}, l = (Array.isArray(m[ws]) ? m[ws] : []).filter(k => k !== key);
  if (on) l.push(key);
  if (l.length) m[ws] = l; else delete m[ws];
  const old = calDay(ws, -7 * 105); Object.keys(m).forEach(k => { if (!(+k >= old)) delete m[k]; });
  if (lsSet(SKIP_KEY, m)) return true;
  toast('Promjena tjednog plana nije spremljena.',true); return false;
}
// this week's plan (1.8.2, Tomislav): a past day counts only while it is in the plan as it is now and was planned before that
// day ended (this week's snapshot, or before the first one, the last earlier week's: a weekly plan repeats; a phone with no
// snapshot at all cannot tell, and counts its plan as it is). A day added afterwards for an
// earlier day of this week shows as missed with the make-up offer, but counts only once you do it; a day you remove disappears,
// unless it was trained (then it stays done). Today and the days to come follow the plan as it is now. Sessions or programmes
// no longer on the phone leave their past days out.
function calendarSlot(x){
  const p = x.kind === 'protocol' && S.pr[x.id], f = x.kind === 'field' && S.field[x.id], g = x.kind === 'program' && S.prog[x.id];
  if (p && !p.program) return {kind:x.kind,id:x.id,name:p.name,min:protoMin(p)};
  if (f) return {kind:x.kind,id:x.id,name:f.name_hr,min:fieldMin(f)};
  if (g) return {kind:x.kind,id:x.id,name:g.name,min:''};
  return null;
}
function weekPlan(ws, plan, snaps, changes){
  const now = Date.now(), current = weekStart(now), start = dateKey(ws);
  snaps = snaps || planSnaps();
  const was = snaps[ws];
  if (ws < current && was) {
    return was.map(x => {
      const s = calendarSlot(x);
      return s ? {...s, day:x.day, f:x.f, origin:MonthPlan.shift(start,x.day)} : null;
    }).filter(Boolean);
  }
  let base = plan || planSlots();
  if (ws > current) base = base.filter(x => x.kind !== 'program' || progStatus(S.prog[x.id]).next);
  const edits = changes || S.settings.planDates || {};
  const effective = MonthPlan.week(base,start,edits,calendarSlot);
  if (ws !== current) return effective;
  const today = dayIdx(now), known = {};
  const prev = was ? null : Object.keys(snaps).map(Number).filter(k => k < ws).sort((a, b) => b - a)[0];
  (was || (prev != null ? snaps[prev].map(x => Object.assign({}, x, { f: 1 })) : [])).forEach(x => { known[slotKey(x)] = x.f; });
  // Only the standing weekdays carry over from the previous snapshot. Last week's one-off
  // addition or move must not change whether this week's past weekday was planned in time.
  if (!was && prev != null) {
    const first = dateKey(prev), end = MonthPlan.shift(first,7);
    const restore = [];
    for (const [origin, records] of Object.entries(edits)) for (const r of records) {
      if (r.to && r.to >= first && r.to < end) delete known[slotKey({...r,day:dayIdx(MonthPlan.time(r.to))})];
      if (!r.extra && origin >= first && origin < end) restore.push(slotKey({...r,day:dayIdx(MonthPlan.time(origin))}));
    }
    restore.forEach(k => { known[k] = 1; });
  }
  const cur = {}, out = effective.map(s => { const k = slotKey(s); cur[k] = 1;
    const dated = s.extra || s.origin !== MonthPlan.shift(start,s.day);
    return s.day >= today || (!was && prev == null) ? s : {...s,f:dated || known[k] === 1 ? 1 : 0}; });
  (was || []).filter(x => x.day < today && !cur[slotKey(x)]).forEach(x => {
    const s = calendarSlot(x);
    if (s) out.push({...s, day:x.day, origin:MonthPlan.shift(start,x.day), f:0, gone:true});
  });
  return out.sort((a, b) => a.day - b.day || a.name.localeCompare(b.name, 'hr'));
}
function streakWeeks(plan){
  plan = plan || planSlots();
  const tl = S.log.filter(isTraining);
  if (!tl.length) return 0;
  const now = weekStart(Date.now()), first = weekStart(tl[tl.length - 1].at), snap = planSnaps(); let n = 0;
  const complete = s => (plan.length || s.slots.length) && s.done >= s.planned;
  for (let ws = calDay(now, -7); ws >= first; ws = calDay(ws, -7)) { const s = weekStatus(ws, weekPlan(ws, plan, snap)); if (complete(s)) n++; else break; }
  const cur = weekStatus(now, weekPlan(now, plan));
  return n + (complete(cur) ? 1 : 0);
}
// match day (Doziranje, your usual week), by the rule of weekAdvice: heavy legs at the latest 4 days before the match,
// 2 days before a lighter session with explosive work, the day before only activation
const heavyLegs = p => (p.items || []).some(it => { const e = S.ex[it.exId]; return !!e && (it.exId === 'nordic-curl' || (e.cat === 'Snaga' && loaded(e) && LOWER_ZONES.indexOf((e.zones || [])[0]) !== -1)); });
const gymLike = p => p.tag === 'Teretana' || (p.items || []).some(it => { const e = S.ex[it.exId]; return !!e && e.cat === 'Snaga' && loaded(e); });
// matches: the standing match day (Doziranje) every week, plus dates marked in the day sheet or in Doziranje. settings.matchDates
// is a flat map 'YYYY-MM-DD' → 1 (a match that day) or 0 (no match on the standing day that week); it goes into backups.
const dateKey = MonthPlan.key;
// Apply a setting in memory only after the latest saved copy accepts the change.
function writeSetting(key, value){
  try {
    const raw = localStorage.getItem('mt.settings');
    const latest = raw ? { ...SETTINGS_BASE, ...cleanSettings(JSON.parse(raw)) } : S.settings;
    if (mtCanon(latest[key]) !== mtCanon(S.settings[key])) {
      S.settings = { ...SETTINGS_BASE, ...latest }; render();
      toast('Postavka je promijenjena u drugoj kartici. Pogledaj novu vrijednost i pokušaj ponovno.', true); return false;
    }
    const next = { ...latest, [key]:value };
    localStorage.setItem('mt.settings', JSON.stringify(next)); S.settings = next;
    return true;
  } catch(e) { toast('Promjena nije spremljena na uređaj. Provjeri slobodan prostor.', true); return false; }
}
const matchDates = () => isPlainObj(S.settings.matchDates) ? S.settings.matchDates : {};
const matchOn = t => { const v = matchDates()[dateKey(t)]; return v === 1 ? true : v === 0 ? false : dayIdx(t) === matchDay(); };
function setMatchDate(t, on){
  const m = Object.assign({}, matchDates()), k = dateKey(t), old = dateKey(calDay(Date.now(), -56));
  if (on === (dayIdx(t) === matchDay())) delete m[k]; else m[k] = on ? 1 : 0;
  Object.keys(m).forEach(x => { if (x < old) delete m[x]; });
  return writeSetting('matchDates', m);
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
function matchNote(s, i, ws = weekStart(Date.now()), plan){
  const g = matchGap(ws, i);
  if (g.next < 0 && g.prev < 0) return '';
  if (s.kind === 'field') {   // by the session's intensity (fieldLoad); at most one extra field session a week
    const f = S.field[s.id];
    if (!f) return '';
    const n = fieldMatchNote(fieldInt(f), i, ws);
    if (n || g.next === 0) return n;
    const fs = (plan || weekStatus(ws).slots).filter(x => x.kind === 'field' && !x.skip);
    if (fs.length > 1 && fs[0].day !== i) return 'U sezoni najviše jedan dodatni trening na terenu tjedno: ovaj preskoči ili ga zamijeni lakšim.';
    return '';
  }
  const p = s.kind === 'protocol' ? S.pr[s.id] : s.kind === 'program' ? S.pr[s.pr] : null;
  if (!p) return '';
  const heavy = heavyLegs(p), wm = weekMatches(ws);
  return MATCH_NOTES[TodayModel.matchRule({ gap: g.next < 0 ? null : g.next, since: g.prev < 0 ? null : g.prev,
    between: wm.some(x => x < i) && wm.some(x => x > i), heavy, easy: !(heavy || gymLike(p)) })] || '';
}
const MATCH_NOTES = {
  matchDay: 'Danas je utakmica: ovaj trening preskoči ili ga pomakni na drugi dan.',
  dayBefore: 'Sutra je utakmica: danas bez teških nogu, samo aktivacija.',
  dayAfter: 'Jučer je bila utakmica: danas bez teških nogu, samo oporavak ili mobilnost.',
  between: 'Između dviju utakmica bez teških nogu: danas lakši trening s eksplozivnošću ili mobilnost.',
  twoDays: 'Utakmica je za 2 dana: danas bez teških nogu, lakši trening s eksplozivnošću.',
  threeDays: 'Utakmica je za 3 dana: teški trening nogu najkasnije 4 dana prije utakmice.'
};
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
  const cur = planSlots(), st = weekStatus(ws, weekPlan(ws, cur)); notePlan(ws, st.slots);
  const trainedDays = {}, partDays = {}; st.log.forEach(l => (planCounts(l) ? trainedDays : partDays)[dayIdx(l.at)] = 1);
  const strip = '<div class="week" role="group" aria-label="Ovaj tjedan">' + DAYS.map((L, i) => {
    const d = new Date(calDay(ws, i));
    const all = st.slots.filter(s => s.day === i), plan = all.filter(s => !s.skip);   // a skipped slot leaves its day neutral
    const missed = i < today && plan.some(s => !s.done), made = i < today && plan.length && !missed;   // (review) a past day made up on another day is done, not "planned"
    const cls = trainedDays[i] || made ? 'done' : partDays[i] ? 'part' : missed ? 'miss' : plan.length ? 'plan' : '';
    const label = DAYNAMES[i] + ' ' + d.getDate() + '.' + (trainedDays[i] ? ', odrađeno' : made ? ', nadoknađeno' : partDays[i] ? ', djelomično' : missed ? ', propušteno' : plan.length ? ', planirano' : all.length ? ', preskočeno' : '') + (wm.indexOf(i) !== -1 ? ', utakmica' : '');
    // a match day (the standing one or a marked date) carries a small dot under its date (flex:none: the done screen's .done{flex:1} must not stretch the circles)
    return '<button class="wd" data-a="daySheet" data-i="'+i+'"' + (i === today ? ' aria-current="date"' : '') + ' aria-label="'+esc(label)+'"><span class="l">'+L+'</span><span class="c '+cls+'" style="flex:none">'+d.getDate()+'</span>' + (wm.indexOf(i) !== -1 ? '<i style="display:block;width:6px;height:6px;margin-top:-2px;border-radius:3px;background:#FFC861"></i>' : '') + '</button>';
  }).join('') + '</div>';
  const todo = st.slots.filter(s => s.day === today && !s.done && !s.skip);
  const missed = st.slots.filter(s => s.day < today && !s.done && !s.skip);
  const row = (s, pre) => '<button class="row today" '+slotOpen(s)+'><span class="thumb" style="width:52px;height:52px">'+pathIcon(s.kind === 'field' ? I.run : I.dumb, 24)+'</span><span class="tx"><span class="t">'+esc(pre + s.name)+'</span><span class="m">'+(s.min ? '<span>'+esc(s.min)+' min</span>' : '')+'</span></span>'+I.chev+'</button>';
  // 1.8.2: a missed session is an offer you accept (Nadoknadi danas: opens it) or decline (Preskoči: off this week's plan)
  const mku = s => '<div class="lift go mku" role="group" aria-label="'+esc('Propušteno ' + DAYS_IN[s.day] + ': ' + s.name)+'"><div class="top"><b>'+esc(s.name)+'</b><span>'+esc('Propušteno ' + DAYS_IN[s.day] + (s.min ? ' · ' + s.min + ' min' : ''))+'</span></div>' +
    '<div class="acts"><button class="bt" '+slotOpen(s)+'>Nadoknadi danas</button><button class="bt ghost" data-a="skipSlot" data-k="'+esc(slotKey(s))+'">Preskoči</button></div></div>';
  const shown = todo.length ? todo : missed.slice(0, 1);
  const rows = shown.map(s => todo.length ? row(s, 'Danas: ') : mku(s)).join('') + matchBox(shown.map(s => matchNote(s, today)).find(Boolean), today);
  const sk = streakWeeks(cur);
  // (review) a week whose plan is all skipped still has a plan: 0/0 and the streak, not the empty-plan hint
  const line = st.planned || st.slots.length
    ? 'Ovaj tjedan ' + st.done + '/' + st.planned + (sk ? ' • niz: ' + sk + ' ' + plural(sk, 'tjedan', 'tjedna', 'tjedana') + ' po planu' : '') + (!todo.length && st.slots.some(s => s.day === today && s.done) ? ' • danas odrađeno' : '')
    : 'Odaberi dane u protokolu i složi svoj tjedni plan';
  return strip + '<p class="week-summary">' + esc(line) + '</p>' + (rows ? '<div class="list" style="margin:12px 16px 0">' + rows + '</div>' : '');
}

/* ---------- views ---------- */
const VIEWS = {};

// your gym strength sessions (Trening A, B, C or your own), the ones the home "Teretana" card offers
const gymSession = p => !p.program && (p.tag === 'Teretana' || gymProto(p)) && (p.items || []).some(it => (S.ex[it.exId] || {}).cat === 'Snaga');
// the gym session to do next: the one trained longest ago
function nextGym(){
  const last = {};
  S.log.forEach(l => { if (l.kind === 'protocol' && l.at <= Date.now() && l.refId && !(last[l.refId] >= l.at)) last[l.refId] = l.at; });
  return Object.values(S.pr).filter(gymSession).sort((a, b) => (last[a.id] || 0) - (last[b.id] || 0) || String(a.name).localeCompare(b.name, 'hr'))[0] || null;
}
VIEWS.home = function(){
  const rehab = Object.values(S.pr).find(p => p.home === 'rehab');
  const akt = Object.values(S.pr).find(p => p.home === 'aktivacija');
  const last = S.log.find(l => isTraining(l) && l.at <= Date.now());
  // the gym card is always there (1.8.1, Tomislav): it opens this week's planned gym session that is not done yet (today's first,
  // then the days to come, then a missed one), otherwise the gym session trained longest ago
  const today = dayIdx(Date.now()), rank = s => s.day === today ? 0 : s.day > today ? 1 : 2;
  const planned = weekStatus(weekStart(Date.now())).slots.filter(s => !s.done && !s.skip && ((s.kind === 'protocol' && !!S.pr[s.id] && gymSession(S.pr[s.id])) || (s.kind === 'program' && !!S.prog[s.id] && !!s.pr)))
    .sort((a, b) => rank(a) - rank(b) || a.day - b.day)[0];
  const gym = planned ? { name: planned.name, a: { a:'openPr', id: planned.kind === 'program' ? planned.pr : planned.id } } : (g => g && { name: g.name, a: { a:'openPr', id: g.id } })(nextGym());
  const cards = [
    { k:'rehab', t:'Rehabilitacija', s: rehab ? 'Moj protokol · ' + protoMin(rehab) + ' min' : 'Moje vježbe za kuk', bg:'#5B5148', ic:I.pulse, a: rehab ? {a:'openPr', id: rehab.id} : {a:'libCat', cat:'Rehab kuka'} },
    { k:'teretana', t:'Teretana', s: gym ? (planned ? (planned.day === today ? 'Danas: ' : 'Sljedeći: ') : 'Sljedeći: ') + gym.name : 'Treninzi snage', bg:'#38425A', ic:I.dumb, a: gym ? gym.a : {a:'tab', tab:'protocols'} },
    { k:'aktivacija', t:'Aktivacija', s:'Uže i kolotur · prije treninga', bg:'#3A3F47', ic:I.rope, a: akt ? {a:'openPr', id: akt.id} : {a:'libCat', cat:'Uže i kolotur'} },
    { k:'kondicija', t:'Kondicija', s:'Na terenu · STATSports', bg:'#33404A', ic:I.run, a:{a:'fieldList'} },
    { k:'knjiznica', t:'Knjižnica', s: Object.keys(S.ex).length ? nVj(Object.keys(S.ex).length) : 'Moje vježbe', bg:'#2B2F37', ic:I.book, a:{a:'tab', tab:'library'} }
  ].filter(Boolean);
  const attrs = o => Object.keys(o).map(k => (k==='a' ? 'data-a' : 'data-'+k) + '="' + esc(o[k]) + '"').join(' ');
  // a card's cover picture (media.js EXCOVERS, portrait) fills the whole card under the same scrim; without one, or when it cannot
  // load (offline before it was ever shown): colour and icon
  const covers = window.EXCOVERS || {}, cover = c => typeof covers[c.k] === 'string' && covers[c.k] ? '<img class="cov" alt="" decoding="async" onerror="this.remove()" src="' + esc(covers[c.k]) + '">' : '';
  return '<div class="view home" style="background:radial-gradient(circle at 100% 0%, #24314A 0%, #1C2230 28%, #191D25 52%)">' +
    topbar('', '<button class="ib" data-a="dataSheet" aria-label="Podaci i sigurnosna kopija">' + I.gear + '</button>', 'MOJ TRENING') +
    '<div class="home-heading"><h1 class="greet">Bok, Tomislav</h1></div>' +
    weekHtml() + dataHint() +
    '<div class="carousel" id="car" aria-label="Kategorije treninga">' +
      cards.map(c => '<button class="hcard' + (cover(c) ? ' cv' : '') + '" style="background:' + c.bg + '" ' + attrs(c.a) + '><span class="ic">' + pathIcon(c.ic, 96) + '</span>' + cover(c) + '<span class="sc"></span><span class="tt"><b>' + esc(c.t) + '</b><span>' + esc(c.s) + '</span></span></button>').join('') +
    '</div>' +
    '<div class="dots" id="dots" role="group" aria-label="Odaberi karticu">' + cards.map((c,i) => '<button class="dot" data-a="dot" data-i="'+i+'" aria-label="'+esc(c.t)+'"'+(i===0?' aria-current="true"':'')+'><i></i></button>').join('') + '</div>' +
    (last ? '<p class="sub" style="text-align:center;margin:8px 0 0">Zadnji trening: ' + esc(last.name) + ' · ' + esc(shortDate(last.at)) + '</p>' : '') +
  '</div>';
};

// A planned slot uses today's protocol. Completed work always uses the session's saved attribution.
function protocolMuscleWork(protocol) {
  const items = protocol.items || [];
  const sections = secOf(items);
  return MuscleWork.plannedProtocol({
    items: items.map((item,index) => ({ ...item, warmup: item.warmup === true || /^zagrij/.test(norm(sections[index])) }))
  }, S.ex);
}

function muscleContributions(snapshots, source) {
  const contributions = [];
  for (const raw of snapshots || []) {
    const item = MuscleWork.sanitize(raw);
    if (!item || item.source !== source) continue;
    const groups = new Set([...Object.keys(item.credits.direct), ...Object.keys(item.credits.secondary)]);
    for (const groupId of groups) {
      const direct = item.credits.direct[groupId] || 0;
      const indirect = item.credits.secondary[groupId] || 0;
      if (direct || indirect) contributions.push({ groupId, exerciseId:item.exerciseId, name:item.name, direct, indirect });
    }
  }
  return contributions;
}

function protocolMusclePreview(protocol) {
  const summary = MuscleWork.sumSnapshots(protocolMuscleWork(protocol));
  const groups = Object.values(summary.groups).filter(g => g.equivalent > 0);
  const rows = groups.map(g => '<div><span>' + esc(g.label) + '</span><b>' +
    esc(g.equivalent.toLocaleString('hr-HR')) + '</b></div>').join('');
  const gap = summary.coverage.unassignedItems || summary.coverage.unknownItems || summary.coverage.invalidItems;
  return '<details class="protocol-muscles"><summary>Planirani rad po mišićima</summary>' +
    (rows ? '<p>Procijenjene serije ako dovršiš protokol. Glavna serija vrijedi 1, pomoćna 0,5.</p>' + rows
      : '<p>U protokolu nema raspoređenih serija snage.</p>') +
    (gap ? '<p>Dio rada nema potpunu raspodjelu. Provjeri mišiće i postavke vježbi.</p>' : '') + '</details>';
}

function sessionMuscleComparison(entry, plan) {
  if (!entry || !Array.isArray(entry.muscleWork) || !Array.isArray(plan)) return '';
  const actual = MuscleWork.sumSnapshots(entry.muscleWork), target = MuscleWork.sumSnapshots(plan);
  const rows = MuscleWork.groups.filter(g => target.groups[g.id].equivalent || actual.groups[g.id].equivalent).map(g => {
    const recorded = actual.groups[g.id].equivalent.toLocaleString('hr-HR');
    const planned = target.groups[g.id].equivalent.toLocaleString('hr-HR');
    return '<div><span>'+esc(g.label)+'</span><b>'+recorded+' / '+planned+'</b></div>';
  }).join('');
  if (!rows) return '';
  return '<details class="protocol-muscles"><summary>Odrađeno prema planu</summary><p>Odrađene / planirane procijenjene serije po mišiću u ovom treningu.</p>'+rows+'</details>';
}

function nextScheduledMatch(date, now) {
  const overrides=matchDates(), weekday=matchDay();
  const upcoming=Object.keys(overrides).filter(day=>MonthPlan.valid(day) && day>=date && overrides[day]===1);
  if (weekday>=0) {
    let next=MonthPlan.shift(date,(weekday-dayIdx(now)+7)%7);
    while (overrides[next]===0) next=MonthPlan.shift(next,7);
    upcoming.push(next);
  }
  return upcoming.sort()[0] || null;
}
function dailyInput(now, week) {
  const date=dateKey(now), start=weekStart(now);
  const checks=S.settings.morningChecks || {};
  const protocols=Object.values(S.pr).filter(p=>Array.isArray(p.items) && p.items.length &&
    p.items.every(it=>it && S.ex[it.exId] && (it.sets==null || (Number.isInteger(it.sets) && it.sets>0 && it.sets<=20))));
  const candidates=protocols.map(p=>({kind:'protocol',id:p.id,name:p.name,items:p.items,
    frozen:!!p.program,heavyLegs:heavyLegs(p) || undefined,tag:p.tag || '',home:p.home || ''}));
  for (const f of Object.values(S.field)) {
    if (!Array.isArray(f.blocks) || !f.blocks.length) continue;
    const info=fieldLoad(f);
    candidates.push({kind:'field',id:f.id,name:f.name_hr,intensity:info.li,category:fieldCategoryKey(f)});
  }
  const planned=[];
  const tomorrow=calDay(now,1), nextWeek=weekStart(tomorrow);
  const weeks=[[start,week || weekStatus(start)]];
  if (nextWeek!==start) weeks.push([nextWeek,weekStatus(nextWeek)]);
  for (const [weekOf,status] of weeks) {
    for (const slot of status.slots) {
      const id=slot.kind==='program'?slot.pr:slot.id, kind=slot.kind==='field'?'field':'protocol';
      const item=candidates.find(c=>c.id===id && c.kind===kind);
      if (item) planned.push({...item,date:dateKey(calDay(weekOf,slot.day)),done:!!slot.done,skip:!!(slot.skip||slot.gone),frozen:item.frozen||slot.kind==='program'});
    }
  }
  // MonthPlan removes skipped and moved occurrences from its calendar grid. Keep
  // the original date as a veto on unsolicited suggestions from the catalogue.
  for (const change of (S.settings.planDates?.[date] || [])) {
    if (change.to!==date) planned.push({id:change.id,kind:change.kind,date,skip:true});
  }
  const recommendation=TodayModel.suggest({now,settings:{matchDay:matchDay(),matchDates:matchDates()},
    // a session with less than half of its work sets (planCounts) leaves the day open: Danas must not call it done
    logs:S.log.map(l=>planCounts(l)?l:Object.assign({},l,{partial:true})),planned,candidates,exercises:S.ex,checkin:checks[date] || null});
  return {date,checks,checkin:checks[date],recommendation,exercises:S.ex,nextMatch:nextScheduledMatch(date,now),
    team:S.log.filter(l=>l.kind==='team' && l.at<=now).slice(0,3)};
}

const todayExpanded=new WeakMap();
VIEWS.today = function(t) {
  const vm=dailyInput(Date.now());
  const key=mtCanon([vm.date,vm.recommendation]);
  if (t.proposalKey!==key) todayExpanded.delete(t);
  t.proposalKey=key;
  return TodayView.view(vm,todayExpanded.get(t));
};
VIEWS.morning = t=>TodayView.formView(t);

function morningError(text) {
  const el=document.getElementById('morning-error');
  if (el) { el.textContent=text; el.scrollIntoView({block:'nearest'}); }
}

function writeMorning(entry) {
  const t=top();
  if (t.v!=='morning' || !MonthPlan.valid(t.date)) return false;
  try {
    const raw=localStorage.getItem('mt.settings');
    const latest=raw?{...SETTINGS_BASE,...cleanSettings(JSON.parse(raw))}:{...SETTINGS_BASE};
    const checks={...(latest.morningChecks || {})};
    if (mtCanon(checks[t.date] || null)!==mtCanon(t.original || null)) {
      S.settings=latest;
      morningError('Provjera je promijenjena u drugoj kartici. Vrati se i ponovno je otvori.');
      return false;
    }
    if (entry) checks[t.date]=entry; else delete checks[t.date];
    const next={...latest,morningChecks:checks};
    localStorage.setItem('mt.settings',JSON.stringify(next));
    S.settings=next;
  } catch(e) { morningError('Provjera nije spremljena na uređaj. Tvoj unos je još otvoren.'); return false; }
  back();
  toast(entry?'Jutarnja provjera je spremljena.':'Jutarnja provjera je izbrisana.');
  return true;
}

let dailyTimer=null;
function refreshDailyAtMidnight(t) {
  clearTimeout(dailyTimer);
  if (!['home','today','dashboard','progress','trainingLoad','analytics','muscleWeek'].includes(t.v)) return;
  const now=Date.now();
  t.dailyDate=dateKey(now);
  dailyTimer=setTimeout(()=>{
    if (top()===t && !appBusy()) render();
  },calDay(now,1)-now+100);
}

function dashboardModel(t) {
  if (S.dbState !== 'ready') return { loading:true };
  const now = Date.now(), start = weekStart(now), end = calDay(start, 7), weekday = dayIdx(now);
  const status = weekStatus(start), actual = MuscleWork.week(status.log, { from:start, to:end });
  const remaining = status.slots.filter(slot => !slot.done && !slot.skip && !slot.gone && slot.day >= weekday);
  const plannedItems = [], sessions = [];
  const quality = { missingSessions:actual.coverage.missingSessions + actual.coverage.invalidSessions,
    unallocatedSessions:actual.coverage.unassignedSessions, partialSessions:actual.coverage.partialSessions, missingPlannedSessions:0 };
  const savedByIndex = new Map(actual.sessions.map(s => [s.index, s.snapshots]));
  for (const [index, log] of status.log.entries()) {
    sessions.push({ id:log.historyId, date:dateKey(log.at), label:log.name, kind:log.kind, status:'done',
      action:{ name:'historyOpen', id:log.historyId },
      contributions:muscleContributions(savedByIndex.get(index), 'completed') });
  }
  for (const slot of remaining) {
    const date = dateKey(calDay(start, slot.day)), protocolId = slot.kind === 'program' ? slot.pr : slot.id;
    const protocol = slot.kind === 'field' ? null : S.pr[protocolId];
    const planned = protocol ? protocolMuscleWork(protocol) : [];
    const counts = MuscleWork.sumSnapshots(planned).coverage;
    if (slot.kind !== 'field' && (!protocol || counts.unknownItems || counts.unassignedItems || counts.invalidItems)) {
      quality.missingPlannedSessions++;
    }
    plannedItems.push(...planned);
    sessions.push({ id:slotKey(slot), date, label:slot.name, kind:slot.kind, status:'planned',
      contributions:muscleContributions(planned, 'planned'),
      action:protocol ? { name:'openPr', id:protocolId } : slot.kind === 'field' && S.field[slot.id] ? { name:'openField', id:slot.id } : null });
  }
  const plan = MuscleWork.sumSnapshots(plannedItems);
  function groupValues(report, id, type) {
    const group = report.groups[id];
    const dates = sessions.filter(s => s.status === type && s.contributions.some(c => c.groupId === id)).map(s => s.date);
    return { direct:group.direct, indirect:group.secondary, equivalent:group.equivalent, days:new Set(dates).size };
  }
  const groups = MuscleWork.groups.map(g => ({
    id:g.id, label:g.label, regions:g.regions, actual:groupValues(actual,g.id,'done'),
    planned:groupValues(plan,g.id,'planned'), target:null
  }));
  const days = DAYS.map((name,index) => ({ date:dateKey(calDay(start,index)), label:name, isToday:index === weekday,
    done:status.log.filter(log => dayIdx(log.at) === index).length,
    planned:remaining.filter(slot => slot.day === index).length }));
  const todaysSlots = status.slots.filter(slot => slot.day === weekday && slotCounts(slot));
  return {
    daily:dailyInput(now,status),
    range:{ start:dateKey(start), end:dateKey(calDay(start,6)), label:shortDate(start) + ' – ' + shortDate(calDay(start,6)), isCurrent:true },
    today:dateKey(now), forecast:!!t.forecast, selectedGroup:t.selectedGroup, groups, sessions, days, quality, pinnedGroups:MuscleWork.footballGroups,
    summary:{ done:status.done, planned:status.planned, todayDone:todaysSlots.filter(s => s.done).length, todayPlanned:todaysSlots.length },
    coverage:{ done:groups.filter(g => g.actual.equivalent > 0).length, total:groups.length,
      projected:groups.filter(g => g.actual.equivalent + g.planned.equivalent > 0).length }
  };
}
VIEWS.dashboard = t => TrainingDashboard.render(dashboardModel(t));
VIEWS.muscleWeek = t => TrainingDashboard.analytics(dashboardModel(t));
VIEWS.analytics = t => VIEWS.progress(t);

const historyWorkout = l => l && (l.kind == null || ['protocol','exercise','field','team'].includes(l.kind));
const historyRecord = id => S.log.find(l => historyWorkout(l) && l.historyId === id);
const pairedMas = (l,test) => l.kind === 'field' && l.refId === 'mas-test-5-min' &&
  test.kind === 'test' && test.test === 'mas' && test.parentSessionId === l.historyId;

function historyDisplay(l) {
  if (!l) return null;
  const items = Array.isArray(l.items) && l.items.map((x,i) => {
    const snap = MuscleWork.sanitize(l.muscleWork && l.muscleWork[i]);
    const saved = snap && snap.exerciseId === x.exId && snap.name !== x.exId ? snap.name : x.name;
    const current = S.ex[x.exId];
    return { ...x, name:saved || (current && current.name) || x.exId,
      nameSource:saved ? 'snapshot' : current ? 'library' : 'id' };
  });
  return { ...l, id:l.historyId, title:l.name, items:items || undefined,
    archived:l.kind !== 'field' && l.kind !== 'team' && !items,
    linkedMas:S.log.find(x => pairedMas(l,x)) };
}

VIEWS.history = function(t) {
  const all = S.log.filter(historyWorkout).sort((a,b) => b.at-a.at), query = norm(t.query).trim();
  const matches = query ? all.filter(l => norm(l.name).includes(query)) : all;
  const pageSize = 15, page = Math.min(Math.max(1,t.page || 1), Math.max(1, Math.ceil(matches.length/pageSize)));
  const entries = matches.slice((page-1)*pageSize, page*pageSize).map(l => ({
    id:l.historyId, historyId:l.historyId, title:l.name, name:l.name, at:l.at, kind:l.kind, secs:l.secs, srpe:l.srpe, teamType:l.teamType,
    archived:l.kind !== 'field' && l.kind !== 'team' && !Array.isArray(l.items), partial:!planCounts(l)
  }));
  return TrainingHistory.render({ mode:'list', query:t.query || '', page, pageSize, total:all.length, filteredTotal:matches.length, entries });
};
VIEWS.historyDetail = t => TrainingHistory.render({ mode:'detail', entry:historyDisplay(historyRecord(t.id)), deleteConfirm:!!t.original });
VIEWS.historyEdit = t => TrainingHistory.render({ mode:'edit', entry:historyDisplay(t.original) });
VIEWS.teamEntry = t => TeamDiary.render({ now:Date.now(), date:t.date, type:t.type });

function teamError(message){
  const error = document.getElementById('team-entry-error');
  if (!error) { toast(message,true); return; }
  error.textContent = message; error.tabIndex = -1;
  error.focus({ preventScroll:true }); error.scrollIntoView({ block:'nearest' });
}

function historyError(message) {
  const error = document.getElementById('history-edit-error');
  if (error) {
    error.hidden = false; error.textContent = message; error.tabIndex = -1;
    error.focus({ preventScroll:true }); error.scrollIntoView({ block:'nearest' });
  }
  else toast(message, true);
}

function saveLoadRating(form) {
  const read=TrainingLoadView.readRating(form), error=message=>TrainingLoadView.ratingError(form,message);
  if(!read.ok){error(read.error);return;}
  const result=HistoryModel.edit(read.original,{srpe:read.srpe});
  if(!result.ok){error(result.errors.map(e=>e.message).join(' '));return;}
  const previousLog=S.log;
  if(!changeHistory(read.original,{...result.entry,editedAt:Date.now()},error)){
    if(S.log!==previousLog)top().loadDayNeedsRefresh=true;
    return;
  }
  top().reopenLoadDay={date:read.date,endDate:read.endDate};
  render();
}

function changeHistory(original, replacement, reportError=historyError) {
  // Capture edits made in a second tab before comparing the exact record the user opened.
  let raw;
  try { raw = localStorage.getItem(STORE_KEY); }
  catch (_) { reportError('Ne mogu pristupiti povijesti na ovom uređaju. Pokušaj ponovno.'); return false; }
  if (!raw && savedJson) { reportError('Pohrana se u međuvremenu promijenila. Ponovno otvori aplikaciju.'); return false; }
  if (raw && savedJson !== raw) {
    if (!mergeOtherCopy(raw)) { reportError('Noviju kopiju povijesti nije moguće pročitati. Promjena nije spremljena.'); return false; }
    savedJson = raw; pendingExt = null;
  }
  const current = historyRecord(original.historyId);
  if (!current || mtCanon(current) !== mtCanon(original)) {
    reportError('Ovaj se zapis u međuvremenu promijenio. Zatvori ga i ponovno otvori.'); return false;
  }
  const coupled = masHistoryChange(current,replacement,S.log,uid('h'));
  if (!coupled.ok) { reportError(coupled.error); return false; }
  replacement = coupled.entry;
  const before = S.log, previousDeleted = S._deleted;
  const protocol = current.kind === 'protocol' && S.pr[current.refId];
  const removed = [];
  const next = [];
  for (const row of before) {
    if (row.historyId === current.historyId) {
      if (replacement) next.push(clone(replacement)); else removed.push(row.historyId);
    } else if (pairedMas(current,row)) {
      if (replacement) next.push(coupled.test || { ...row, at:replacement.at }); else removed.push(row.historyId);
    } else next.push(row);
  }
  if (coupled.newTest) next.push(coupled.newTest);
  S.log = next.sort((a,b) => b.at - a.at);
  if (removed.length) S._deleted = (previousDeleted || []).concat(removed.map(id => 'log/' + id));
  if (protocol && (!replacement || current.at !== replacement.at || mtCanon(current.items) !== mtCanon(replacement.items))) {
    S.pr[protocol.id] = HistoryStore.reconcile(protocol, before, S.log, S.ex);
  }
  if (persist()) return true;
  S.log = before; S._deleted = previousDeleted;
  if (protocol) S.pr[protocol.id] = protocol;
  reportError('Promjena nije spremljena. Tvoj prethodni zapis je sačuvan.');
  return false;
}

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
  return '<div class="view gut">' + topbar(S.stack.length > 1 ? backBtn() : '', '') +
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
    '<div class="footer gut"><button class="btn" data-a="newPr">' + I.plus.replace('<svg', '<svg width="18" height="18"') + 'Novi protokol</button>' +
    (S.dbState === 'ready' ? '<button type="button" class="txtbtn flink" data-a="importWorkout">Uvezi trening</button>' : '') + '</div>';
};

// search also knows the words people use for the same thing: English equipment names, everyday words for body zones
const LIB_SYN = { 'Core':'trup trbuh trbusnjaci', 'Trup':'core trbuh trbusnjaci', 'Lisni mišić':'list listovi listove listova', 'Girja':'kettlebell', 'Bučice':'dumbbell', 'Šipka':'barbell', 'Medicinka':'medicine ball', 'Čunjevi':'cones', 'Kotač':'ab wheel' };
const libSearchText = s => norm(s).replace(/dj/g, 'd');   // "ledja" finds "leđa"
function libFiltered(){
  const words = libSearchText(S.lib.q).split(/\s+/).filter(Boolean), c = S.lib.cat, eq = S.lib.eq || [], cs = S.lib.cats || [], mu = S.lib.mus || [];
  // 1.8, the filter: OR inside a section, AND between sections; Zona by the exercise's muscles (main or secondary), the exercises that work a chosen muscle as a main one first
  // (review) the joints have no muscle of their own: an exercise tagged Koljeno / Gležanj (rehab, landings) is found under the
  // knee / ankle region too, as a secondary one, like the list and the search show it
  const JOINT = { front_knees: 'Koljeno', front_shins_ankles: 'Gležanj', hip_joints:'Kuk' };
  const muHit = e => { const m = exMuscles(e); return mu.some(r => m.prime.indexOf(r) !== -1 || m.sec.indexOf(r) !== -1 || (!!JOINT[r] && (e.zones || []).indexOf(JOINT[r]) !== -1)); };
  const muRank = e => { if (!mu.length) return 0; const m = exMuscles(e); return mu.some(r => m.prime.indexOf(r) !== -1) ? 0 : 1; };
  const syn = a => a.map(x => LIB_SYN[x] || '').join(' ');
  return Object.values(S.ex).filter(e => {
    // the search text holds the equipment tags themselves (Čunjevi, Bučice…) and their synonyms
    if (words.length) { const z = e.zones || [], q = exEquip(e), hay = libSearchText([e.name, e.alt, e.equipment, z.join(' '), syn(z), e.cat, syn([e.cat]), q.join(' '), syn(q), e.feel].join(' ')); if (!words.every(w => hay.indexOf(w) !== -1)) return false; }
    if (eq.length) { const mine = exEquip(e); if (!eq.some(x => mine.indexOf(x) !== -1)) return false; }
    if (cs.length && cs.indexOf(e.cat) === -1) return false;
    if (mu.length && !muHit(e)) return false;
    if (c === 'Sve') return true;
    if (c === 'Favoriti') return !!e.fav;
    if (c === 'TRX') return exEquip(e).indexOf('TRX') !== -1;
    if (c === 'TAE') return !!(e.pack || (S.pack && (S.pack.members || []).indexOf(e.id) !== -1));
    if (c === 'Rehab kuka') return e.cat === 'Rehab' || !!e.phase;
    if (c === 'Uže i kolotur') return !!e.cord;
    return e.cat === c;
  }).sort((a,b) => muRank(a) - muRank(b) || (a.order||999) - (b.order||999) || a.name.localeCompare(b.name, 'hr'));
}
// 1.8: the filters in use as one row of removable chips (the category of the chip row too), the count and "Očisti filtere"
function activeFiltersHtml(){
  const x = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17"/></svg>';
  const chip = (k, v, t) => '<button class="afc" data-a="filtDrop" data-k="'+k+'" data-v="'+esc(v)+'" aria-label="Ukloni filter: '+esc(t)+'">'+esc(t)+x+'</button>';
  const n = libFiltered().length;
  return '<div class="chips afil" role="group" aria-label="Aktivni filteri">' + (S.lib.cat !== 'Sve' ? chip('libcat', S.lib.cat, S.lib.cat) : '') + (S.lib.cats || []).map(c => chip('cat', c, c)).join('') +
    EQ_TILES.filter(tileOn).map(t => chip('eq', t[0], t[0])).join('') + musChips(S.lib.mus).map(c => chip('mus', c[0], c[1])).join('') + '</div>' +
    '<div class="afn"><span id="afcount">' + n + ' ' + plural(n, 'vježba', 'vježbe', 'vježbi') + '</span><button class="txtbtn lnk" data-a="filtClear">Očisti filtere</button></div>';
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
      (nF => '<button class="ib fbtn" data-a="eqSheet" aria-label="Filter vježbi'+(nF ? ', aktivno ' + nF : '')+'"'+(nF ? ' aria-pressed="true"' : '')+'>' + I.filter + (nF ? '<span class="cnt">'+nF+'</span>' : '') + '</button></div>')(sheetFilters()) +
    // 1.8: with filters from the sheet in use, their chips take the place of the category row (one row, nothing hidden)
    (sheetFilters() ? activeFiltersHtml() :
    '<div class="chips" role="group" aria-label="Kategorija" style="margin-top:12px">' + (S.pack && (S.pack.members || []).length ? LIBCATS.slice(0, 3).concat(['TAE'], LIBCATS.slice(3)) : LIBCATS).map(c => '<button class="chip" data-a="libCat" data-cat="'+esc(c)+'" aria-pressed="'+(S.lib.cat===c)+'">'+esc(c)+'</button>').join('') + '</div>') +
    '<div class="list" id="liblist" style="margin-top:14px">' + libListHtml() + '</div>' +
    '<div style="height:20px"></div></div>' +
    (picking ? '<div class="footer gut"><button class="btn" data-a="pickDone"'+(S.pick.ids.length?'':' disabled')+'>Dodaj u protokol ('+S.pick.ids.length+')</button></div>' : '');
};

const stillMotion = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
// a demo loops silently; with Reduce motion on it stays on its first frame and plays only from its controls
function videoTag(m){ return '<video src="'+esc(m.src)+'"'+(m.poster ? ' poster="'+esc(m.poster)+'"' : '')+(stillMotion() ? ' controls preload="metadata"' : ' autoplay loop')+' muted playsinline></video>'; }
// licensed media: the chip opens "Izvor i licenca" (author, licence, source, changes); the private pack only names itself
function creditHtml(m){
  if (!SHOW_SOURCES || !m || !m.credit) return '';
  return m.lic ? '<button class="credit" data-a="credit" data-id="'+esc(m.cid)+'" aria-label="Izvor i licenca: '+esc(m.credit)+'">'+esc(m.credit)+'</button>' : '<span class="credit">'+esc(m.credit)+'</span>';
}
function swapHtml(e, m){
  if (!m || m.n < 2) return '';
  const v = m.next.type === 'video';
  return '<button class="swapm" data-a="mediaSwap" data-id="'+esc(e.id)+'" aria-label="'+(v ? 'Prikaži video' : 'Prikaži drugu sliku')+'">'+(v ? 'Video' : 'Slika')+'</button>';
}
// 1.8.2: a two-panel picture spans the full width in a low 5:3 box (a taller 16:10 or the whole 3:2 where the content needs it) and is
// cropped at the top / bottom at its own height (media.js picY, tools/build/pic_crop.py), so no athlete, bar, box or foot is cut
const PIC_BOX = { '16:10': ' b1610', '3:2': ' b32' };
function mediaHtml(e, badge, inPlayer){
  const m = exMedia(e); let inner, credit = '';
  if (m) {
    inner = m.type === 'image' ? '<img class="fit" fetchpriority="high" alt="'+(m.two ? esc(e.name + ': lijevo početni, desno završni položaj') : '')+'" src="'+esc(m.src)+'"'+(m.two ? ' style="object-position:50% '+(Number.isFinite(m.picY) ? m.picY : 50)+'%"' : '')+mediaFailAttr(e, 44)+'>' : videoTag(m);
    credit = creditHtml(m) + swapHtml(e, m);
  } else inner = '<div class="ph">' + pathIcon(catIcon(e && e.cat), 44) + (inPlayer ? '' : '<span>Dodaj svoj video ili sliku u uređivanju</span>') + '</div>';   // mid-workout only the icon
  return '<div class="media'+(m && m.two ? ' two' + (PIC_BOX[m.picBox] || '') : '')+'">' + inner + credit + (badge ? '<span class="badge">'+esc(badge)+'</span>' : '') + '</div>';
}
// the protocol header: the first exercise's best media, whole (a two-panel picture is never cropped), with its credit and poster
function heroHtml(p, fm){
  if (!fm) return '<div class="hero"><span class="ic">'+pathIcon(p.home==='aktivacija'?I.rope:p.home==='rehab'?I.pulse:I.dumb,110)+'</span><span class="fade"></span></div>';
  const el = fm.type === 'image' ? '<img alt="" src="'+esc(fm.src)+'"'+mediaFailAttr(null, 64)+'>'
    : !stillMotion() ? videoTag(fm)
    : fm.poster ? '<img alt="" src="'+esc(fm.poster)+'">' : '<video src="'+esc(fm.src)+'#t=0.5" preload="metadata" muted playsinline></video>';
  return '<div class="hero'+(fm.two ? ' two' : '')+'">' + el + '<span class="fade"></span>' + creditHtml(fm) + '</div>';
}
// "Izvor i licenca" sheet for one licensed demo; the full list is MEDIA-LICENSES.md in the repository
function creditSheet(s){
  const L = SHOW_SOURCES && ((window.EXMEDIA || {})[s.id] || {}).lic; if (!L) return '';
  const a = (t, u) => '<a href="'+esc(u)+'" target="_blank" rel="noopener">'+esc(t)+'</a>';
  const row = (k, v) => '<span class="lb">'+k+'</span><p>'+v+'</p>';
  const dv = window.EXMEDIA_DVIDS;
  return '<h3>Izvor i licenca</h3><div class="lic">' + (L.title ? row('Djelo', '„'+esc(L.title)+'”') : '') + row('Autor', esc(L.author)) +
    row('Licenca', L.licenseUrl ? a(L.license, L.licenseUrl) : esc(L.license)) + row('Izvor', (L.source || []).map(x => a(x[0], x[1])).join(' · ')) +
    (L.changes ? row('Izmjene', esc(L.changes)) : '') + (L.dvids && dv ? '<p class="dv">„'+esc(dv.en)+'” '+esc(dv.hr)+'</p>' : '') +
    '<p class="all">'+a('Sve licence slika i snimki', 'https://github.com/hara93/moj-trening/blob/main/MEDIA-LICENSES.md')+'</p></div>';
}
function historyOf(exId, now=Date.now()){
  const out = [];
  S.log.filter(l => l.at <= now).forEach(l => (l.items||[]).forEach(it => { if (it.exId === exId && !it.skipped) out.push(Object.assign({ at: l.at }, it)); }));
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
// under the media, like GOWOD: "Upute" (equipment, the cues, the video links*) | "Cilj" (why, the target areas, how it should feel,
// the source*) | "Opterećenje" (the load card and the last sessions); * only with SHOW_SOURCES. Česte greške stay in the data, unshown. The tab you pick stays
// for every exercise while the app is open (S.exTab: 'upute' | 'cilj' | 'opt'; 1.6.1's 'zasto' reads as 'cilj'). The player's card
// (wrap: its section opening tag) has only Upute | Cilj, shorter: the cues; the areas, Osjećaj and the first sentence of the why.
const EX_TABS = [['upute', 'Upute'], ['cilj', 'Cilj'], ['opt', 'Opterećenje']];
const exTabOf = v => v === 'zasto' ? 'cilj' : v === 'cilj' || v === 'opt' ? v : 'upute';
// the first sentence of a text: up to a . ! or ? followed by a capital letter (so "npr. ovako" or "2. dan" do not cut it)
const firstSentence = t => (String(t || '').match(/^[\s\S]*?[.!?](?=\s+[A-ZČĆŠĐŽ„"(]|\s*$)/) || [String(t || '')])[0].trim();
function exInfoHtml(e, wrap){
  const pl = !!wrap, steps = e.steps || [], list = pl ? EX_TABS.slice(0, 2) : EX_TABS;
  let on = exTabOf(S.exTab); if (pl && on === 'opt') on = 'upute';   // the player has no Opterećenje: it shows Upute, S.exTab stays
  const tab = (k, t) => '<button class="chip" role="tab" id="extab-'+k+'" aria-selected="'+(k === on)+'" tabindex="'+(k === on?0:-1)+'" aria-controls="expanel" data-a="exTab" data-v="'+k+'">'+t+'</button>';
  const a = (href, t, ti) => '<a href="'+esc(href)+'" target="_blank" rel="noopener"'+(ti ? ' title="'+esc(ti)+'"' : '')+'>'+esc(t)+' ↗</a>';
  const cues = steps.length ? steps.map(s => '<div class="bul ck">'+I.ckc+'<span>'+esc(s)+'</span></div>').join('') : '<p class="none">Dodaj upute u uređivanju.</p>';
  const zones = Array.from(new Set((e.zones||[]).map(exZoneLabel))).map(z => '<span class="tag">'+esc(z)+'</span>').join('');
  let body;
  if (on === 'upute') {
    const eq = e.equipment || exEquip(e).join(', ') || 'Bez opreme';
    // a short link like the mockup; the video's own title (often a long source title) is the tooltip
    const vids = !SHOW_SOURCES ? '' : (e.video ? a(e.video, 'Pogledaj demonstraciju', e.videoTitle) : '') + (packVideo(e) ? a(packVideo(e), 'Pogledaj kod TAE') : '');
    body = pl ? cues : '<div class="exequip"><span class="lb">Oprema</span><span>'+esc(eq)+'</span></div>' + cues + (vids ? '<p class="exvid">' + vids + '</p>' : '');
  } else if (on === 'cilj' && pl) {
    // (review) the player names the same main muscles as the exercise page's Cilj card (not the zones)
    const pm = exMuscles(e), zones = pm.prime.length ? muscleTags({ prime: pm.prime, sec: [] }) : muscleTags({ prime: pm.sec, sec: [] });
    const box = zones || e.feel ? '<div class="pfeel">' + (zones ? '<div class="tagrow">'+zones+'</div>' : '') + (e.feel ? '<span><span class="lb">Osjećaj: </span>'+esc(e.feel)+'</span>' : '') + '</div>' : '';
    body = (box + (e.note ? '<p>'+esc(firstSentence(e.note))+'</p>' : '')) || '<p class="none">Dodaj objašnjenje u uređivanju.</p>';
  } else if (on === 'cilj') {
    const facts = (zones ? '<div><dt>Ciljana područja</dt><dd><div class="tagrow">'+zones+'</div></dd></div>' : '') + (e.feel ? '<div><dt>Osjećaj</dt><dd>'+esc(e.feel)+'</dd></div>' : '');
    body = ((e.note ? '<p>'+esc(e.note)+'</p>' : '') + (facts ? '<dl class="exfacts">'+facts+'</dl>' : '') +
      (SHOW_SOURCES && e.source ? '<p class="src">Izvor: '+a(e.source, e.sourceTitle || 'Otvori izvor')+'</p>' : '')) || '<p class="none">Dodaj objašnjenje u uređivanju.</p>';
  } else body = exOptHtml(e);
  return (wrap || '<section class="exinfo gut">') + '<div class="extabs n'+list.length+'" role="tablist" aria-label="O vježbi">' + list.map(x => tab(x[0], x[1])).join('') + '</div>' +
    '<div class="expanel'+(on === 'opt' ? ' opt' : '')+'" id="expanel" role="tabpanel" data-tab="'+on+'" aria-labelledby="extab-'+on+'">' + body + '</div></section>';
}
// the Opterećenje tab: the newest session, the load card (period chips, chart, trend, Tablica), then the last sessions;
// nothing logged yet: one row that says what to do (no period chips)
function exOptHtml(e){
  const h = historyOf(e.id);
  const head = '<div class="opthd"><span>'+(h.length ? 'Zadnje: <b>'+esc(shortDate(h[0].at) + ' · ' + recordedDoseLabel(h[0]))+'</b>' : '')+'</span><button class="txtbtn lnk" data-a="loadInfo">Kako se računa?</button></div>';
  if (!h.length) return head + '<div class="lc"><div class="emp"><div class="ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19h16M6 15l4-4 3 3 5-6"/></svg></div>' +
    '<div><b>Još nema treninga s ovom vježbom</b><p>Pokreni je ili je dodaj u protokol. Nakon prvog treninga ovdje vidiš volumen, a od drugog graf i povijest.</p></div></div></div>';
  const lp = exLastPts(e.id);
  return head + exLoadCard(e, S.loadRange) + (lp ? '<div class="lmlast">Opterećenje zadnjeg treninga: <b>≈ ' + lmPts(lp.B) + ' ' + (lmPts(lp.B).indexOf(',') !== -1 ? 'boda' : plural(Math.round(lp.B), 'bod', 'boda', 'bodova')) + '</b></div>' : '') + exHistHtml(e, h);
}
const SET_STATUS = {
  planned:['○','Planirana'], waiting:['○','Slijedi'], active:['●','U tijeku'],
  done:['✓','Odrađena'], partial:['◐','Djelomično'], skipped:['–','Preskočena']
};
function viewDoseSource(t) {
  if (t.v === 'pr') return S.pr[t.id]?.items || [];
  const exercise = S.ex[t.id];
  return exercise ? [doseOptions(exercise)[t.dose || 0]?.it || exItem(exercise)] : [];
}
function viewDoseItems(t, original = viewDoseSource(t)) {
  return t.runDose && t.runDose.base === mtCanon(original) ? t.runDose.items : original;
}
function checklistRow(item, row, index, heading, round, weightKind, live) {
  const [icon,status] = SET_STATUS[row.state];
  const timed = item.measure === 'time';
  const label = (round ? 'Krug ' : 'Serija ') + row.set;
  const quantity = timed ? row.dose.sec+' s' : row.dose.reps+' pon.';
  let weight = 'Bez dodatne težine';
  if (row.dose.kg > 0) weight = fmtKg(row.dose.kg);
  else if (StartingLoad.missingSet(item,row.set-1,weightKind)) weight = 'Početna težina nije upisana';
  else if (item.startingKgKnown || item.kgList?.some(v => v > 0)) weight = '0 kg';
  const info = [quantity + (item.sides ? ' po strani' : ''), weight];
  let reserveHtml='';
  if (row.reserve != null) {
    const taps = timed ? LM.SIR_TAPS : LM.RIR_TAPS, labels = timed ? LM.SIR_TXT : LM.RIR_TXT;
    const value = labels[taps.indexOf(row.reserve)] || row.reserve.toLocaleString('hr-HR');
    reserveHtml='<span class="set-reserve" data-kind="'+(timed?'sir':'rir')+'">'+esc(timed?'SIR '+value+' s':'RIR '+value)+'</span>';
  }
  const sides = live && timed && item.sides ? '<span class="set-sides">'+
    (row.left ? '✓ Lijeva' : '○ Lijeva')+' · '+(row.right ? '✓ Desna' : '○ Desna')+'</span>' : '';
  const marker = row.step == null ? '<span class="set-mark" aria-hidden="true">'+icon+'</span>' :
    '<button type="button" class="set-mark" data-a="checklistDone" data-j="'+index+'" data-set="'+row.set+'" data-step="'+row.step+
    '" aria-label="'+esc('Označi kao odrađeno: '+heading+', '+label)+'"><span aria-hidden="true"></span></button>';
  return '<li class="set-item" data-state="'+row.state+'"'+(row.current ? ' aria-current="step"' : '')+'>'+marker+
    '<span class="set-info"><b>'+esc(label)+'</b><span>'+esc(info.join(' · '))+'</span>'+reserveHtml+sides+'</span>'+
    '<small class="set-state">'+(row.step != null ? 'Potvrdi' : status)+'</small></li>';
}
function checklistHtml(items, player, editable, libraryLinks = false) {
  const rounds = ssLetters(items);
  const blocks = items.map((item,j) => {
    const exercise = S.ex[item.exId], group = rounds[j];
    const rows = PlayerDose.checklist(item,player,j);
    const heading = (group ? group.L+group.k+' · ' : '') + (exercise?.name || 'Obrisana vježba');
    const edit = (player?'<button class="set-edit" type="button" data-a="workoutExercise" data-j="'+j+'">Detalji</button>':'') + (editable ? '<button class="set-edit" type="button" data-a="'+(player ? 'playDoseEdit' : 'previewDoseEdit')+
      '" data-j="'+j+'" aria-label="'+esc('Uredi serije: '+heading)+'">Uredi</button>' : '');
    const unit = group ? groupWord(group.size)+' '+group.L : 'Vježba '+(j+1);
    const title = '<small>'+esc(unit)+'</small><strong>'+esc(heading)+'</strong>';
    const updated = item.up && Date.now()-item.up < 21*DAY_MS ? '<small class="set-new">↑ Napredak</small>' : '';
    const name = libraryLinks && exercise ? '<button type="button" class="set-ex-link" data-a="openEx" data-id="'+esc(item.exId)+'">'+
      (exMedia(exercise) ? '<span class="thumb">'+thumbHtml(exercise)+'</span>' : '')+'<span>'+title+updated+'</span>'+I.chev+'</button>' : '<div>'+title+'</div>';
    const weightKind=startLoadDescription(item.exId)?.kind;
    const count = player ? rows.filter(row => row.state==='done').length+' / '+rows.length+' odrađeno' :
      rows.length+' '+plural(rows.length,'planirana serija','planirane serije','planiranih serija');
    if (libraryLinks) return WorkoutView.exercise({index:j,name:heading,thumbHtml:exercise?thumbHtml(exercise):'',equipment:exercise?exEquip(exercise):[],summary:count,rest:item.rest,rowsHtml:'<ol class="set-list">'+rows.map(row=>checklistRow(item,row,j,heading,group,weightKind,player)).join('')+'</ol>',actionsHtml:edit,targetHtml:workoutTargetHtml(item)});
    return '<section class="set-block"><header>'+name+edit+'</header><div class="set-count">'+count+
      (item.rest ? ' <span>· odmor '+esc(item.rest)+' s</span>' : '')+'</div><ol class="set-list">'+
      rows.map(row => checklistRow(item,row,j,heading,group,weightKind,player)).join('')+'</ol></section>';
  });
  if (!libraryLinks) return blocks.join('');
  const sections=secOf(items), ordered=[];
  groupsOf(items).forEach(g=>{
    const label=sections[g.idx[0]] || 'Glavni dio';
    const previous=ordered[ordered.length-1];
    if (previous && previous.title===label) previous.groups.push(g); else ordered.push({title:label,groups:[g]});
  });
  return ordered.map(block=>WorkoutView.block({title:block.title,itemsHtml:block.groups.map(g=>
    (g.ss?groupHead(items,g,rounds[g.idx[0]].L):'')+g.idx.map(j=>blocks[j]).join('')).join('')})).join('');
}

function workoutContext(s) {
  const t=top(), live=!!s?.live;
  if(live){if(P?.mode!=='ex'||P.done)return null;const items=P.items.slice();if(s?.pendingReplacement)items[s.j]=s.pendingReplacement;return {items,liveItems:P.items,source:P.liveBaseItems||P.originalItems||P.items,program:!!S.pr[P.ref?.id]?.program,live:true};}
  if (!['pr','ex'].includes(t.v)) return null;
  const source=viewDoseSource(t);
  return {items:viewDoseItems(t,source),source,program:t.v==='pr' && !!S.pr[t.id]?.program,live:false};
}
function workoutTargetHtml(item) {
  const timed=item.measure==='time', value=item[timed?'targetSir':'targetRir'];
  return Number.isFinite(value)?'<span class="workout-target">Cilj · '+(timed?'rezerva '+esc(value)+' s':'RIR '+esc(value))+'</span>':'';
}
function workoutCanSwap(c,j) {
  if (!c || c.program || (!c.live && !['pr','ex'].includes(top().v))) return false;
  return !c.live || !P.steps.some((step,i)=>isWork(step)&&step.g===j&&(i<P.i||P.doneSteps[i]||i===P.i&&step.kind==='work'));
}
function workoutValid(s,c) {
  if (!c || mtCanon(c.live?(c.liveItems||c.items):c.source)!==s.base) return false;
  try {return localStorage.getItem(STORE_KEY)===savedJson;} catch(e){return false;}
}
function workoutPreviousHtml(item) {
  const previous=WorkoutModel.previous({item,log:S.log,now:Date.now()});
  if (!previous) return '<p class="none">Još nema zabilježene izvedbe ove vježbe.</p>';
  const value=(v,suffix='')=>v==null?'<span aria-label="Nije zabilježeno" title="Nije zabilježeno">—</span>':esc(v.toLocaleString('hr-HR'))+suffix;
  return '<p class="workout-previous-date">'+esc(shortDate(previous.at))+' · '+esc(previous.sessionName || 'Trening')+'</p>'+
    (previous.rows.length?'<div class="workout-previous-table"><table><thead><tr><th scope="col">Serija</th><th scope="col">Izvedba</th><th scope="col">kg</th><th scope="col">Rezerva</th></tr></thead><tbody>'+previous.rows.map(row=>
      '<tr><th scope="row">'+esc(row.number || '—')+'</th><td>'+value(row.measure==='time'?row.sec:row.reps,row.measure==='time'?' s':' pon.')+(row.perSide?(row.measure==='time'&&row.sides===2?' prosječno po strani · ':' po strani · ')+(row.sides==null?'strane nisu zabilježene':row.sides+'/2 strane'+(row.sides<2?' · djelomično':'')):'')+(row.failed?' · nedovršeno':'')+'</td><td>'+value(row.kg)+'</td><td>'+value(row.measure==='time'?row.sir:row.rir,row.measure==='time'?' s':' RIR')+'</td></tr>').join('')+'</tbody></table></div>':'<p class="none">'+esc(previous.skippedItems?'Vježba je preskočena.':'Pojedinačne serije nisu zabilježene.')+'</p>')+
    '<p class="workout-unknown-key">— Nije zabilježeno.</p>'+
    ((previous.unknownItems || previous.skippedItems) && previous.context?'<p class="none">'+esc(previous.context)+'</p>':'');
}
function workoutState(j=0) {
  if(S.sheet?.kind==='workoutExercise')return S.sheet;
  const live=top().v==='play',c=workoutContext({live});
  return c?{kind:'workoutExercise',j,live,base:mtCanon(live?P.items:c.source),returnCinema:S.sheet?.kind==='cinemaJournal'}:null;
}
function workoutNumber(value) {
  const raw=String(value).trim().replace(',','.');
  return raw!==''&&/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(raw)?Number(raw):null;
}
function workoutRawKey(s,set,field) {const t=top();if(!s.live&&!t.workoutDraftKey)t.workoutDraftKey=uid('w');return (s.live?'live:'+P.startedAt:t.workoutDraftKey)+':'+s.j+':'+set+':'+field;}
function workoutRaw(s,set,field,value) {
  const key=workoutRawKey(s,set,field),raw=S.workoutRaw?.[key];
  return raw!==undefined?raw:value==null?'':String(value).replace('.',',');
}
function workoutControl(s,row,field,value,disabled,heading) {
  const labels={reps:'ponavljanja',kg:'kilogrami',sec:'sekunde',rir:'stvarni RIR',sir:'stvarna rezerva u sekundama'};
  return '<input class="workout-set-input" type="text" inputmode="'+(['kg','rir','sir'].includes(field)?'decimal':'numeric')+'" autocomplete="off" data-field="'+field+'" data-j="'+s.j+'" data-set="'+row.set+'" data-live="'+(s.live?'1':'0')+'" aria-label="'+esc(heading+', '+row.set+'. serija '+labels[field])+'" value="'+esc(disabled?(value==null?'':String(value).replace('.',',')):workoutRaw(s,row.set,field,value))+'" placeholder="—"'+(disabled?' disabled':'')+'>';
}
function workoutCompletionLabel(step){
  const side=PlayerDose.splitSide(step);
  if(side)return 'Završi '+(side==='left'?'lijevu':'desnu')+' stranu';
  return 'Označi seriju kao odrađenu';
}
function workoutRowsHtml(items,player,j,s=workoutState(j)) {
  const item=items[j],e=S.ex[item.exId],pending=!!s?.pendingReplacement,live=!!player&&!pending;
  const rows=PlayerDose.checklist(item,live?player:null,j),guard=live?PlayerDose.locks(player,j):{locked:[],closed:false};
  const weightKind=startLoadDescription(item.exId)?.kind,timed=item.measure==='time',heading=e?.name||'Obrisana vježba';
  return rows.map(row=>{
    const done=live&&row.state==='done',locked=!!(s&&!s.live&&top().v==='pr'&&S.pr[top().id]?.program)||guard.closed||guard.locked.includes(row.set);
    const setSteps=live?player.steps.map((st,k)=>({st,k})).filter(x=>isWork(x.st)&&x.st.g===j&&x.st.set===row.set):[];
    const reserveStep=setSteps.filter(x=>player.doneSteps[x.k]&&setEnd(x.st)).at(-1)?.k;
    const editableReserve=done&&reserveStep!=null&&!failedReserveStep(reserveStep);
    const active=live?player.steps[player.i]:null,canComplete=row.current&&isWork(active)&&!player.doneSteps[player.i];
    const redo = live && (done || row.state === 'partial');
    const redoAttrs=' data-a="workoutRedoSet" data-j="'+j+'" data-set="'+row.set+'" aria-label="'+esc('Ponovi '+row.set+'. seriju · '+heading)+'"';
    const marker=canComplete?'<button type="button" class="set-mark" data-a="workoutSetDone" data-j="'+j+'" data-set="'+row.set+'" data-step="'+player.i+'" aria-label="'+esc(workoutCompletionLabel(active)+' · '+heading+' · Serija '+row.set)+'"><span aria-hidden="true">'+(timed||PlayerDose.splitSide(active)?'✓':row.set)+'</span></button>':
      redo?'<button type="button" class="set-mark workout-set-number"'+redoAttrs+'><span aria-hidden="true">'+(done?'✓':'◐')+'</span></button>':
      '<span class="workout-set-number" aria-label="'+esc(SET_STATUS[row.state][1]+', serija '+row.set)+'"><span aria-hidden="true">'+(row.state==='skipped'?'–':row.set)+'</span></span>';
    const kg=StartingLoad.missingSet(item,row.set-1,weightKind)?null:row.dose.kg;
    const sideDetails=(name,complete,seconds)=>(complete?'✓':'○')+' '+name+(seconds==null?'':' ('+seconds+' s)');
    const showSides=live&&item.sides&&(timed||setSteps.some(({st})=>PlayerDose.splitSide(st)));
    const details=[item.sides?(showSides?sideDetails('lijeva',row.left,row.leftSec)+' · '+sideDetails('desna',row.right,row.rightSec):'po strani'):'',live?SET_STATUS[row.state][1]:''].filter(Boolean).join(' · ');
    const redoPartial=canComplete&&redo?'<button type="button" class="set-edit"'+redoAttrs+'>Ponovi seriju</button>':'';
    return '<tr class="workout-set-row" data-set="'+row.set+'" data-state="'+row.state+'"'+(row.current?' aria-current="step"':'')+'><td>'+marker+'</td><td>'+workoutControl(s,row,timed?'sec':'reps',row.dose[timed?'sec':'reps'],locked && !(done && !timed),heading)+'</td><td>'+workoutControl(s,row,'kg',kg,locked||!weightKind,heading)+'</td><td>'+workoutControl(s,row,timed?'sir':'rir',row.reserve,!editableReserve,heading)+'</td></tr>'+(details?'<tr class="workout-set-details" data-state="'+row.state+'"><td></td><td colspan="3">'+esc(details)+redoPartial+'</td></tr>':'');
  }).join('');
}
function workoutTableHtml(c,j,s=workoutState(j)) {
  const item=c.items[j],e=S.ex[item.exId],kind=startLoadDescription(item.exId)?.kind;
  return WorkoutView.seriesTable({name:e?.name||'Vježba',measure:item.measure,weightLabel:kind==='db'?'kg / kom':'kg',rowsHtml:workoutRowsHtml(c.items,c.live?P:null,j,s)});
}
function workoutCompactHtml(items) {
  const rounds=ssLetters(items),sections=CinemaModel.sections(items,S.ex);
  const compactValues=values=>{
    const format=value=>value==null?'—':String(Math.round(value*100)/100).replace('.',',');
    if(values.every(value=>value===values[0]))return format(values[0]);
    if(values.length<=4)return values.map(format).join(' / ');
    const known=values.filter(Number.isFinite);
    return (known.length?format(Math.min(...known))+'–'+format(Math.max(...known)):'—')+(known.length<values.length?' · dio nije upisan':'');
  };
  const summary=item=>{
    const n=Number.isInteger(item.sets)&&item.sets>0?item.sets:1,timed=item.measure==='time',field=timed?'sec':'reps',list=item[field+'List'];
    const values=Array.from({length:n},(_,i)=>Array.isArray(list)?Number.isFinite(list[i])?list[i]:null:Number.isFinite(item[field])?item[field]:timed?30:10);
    const kind=startLoadDescription(item.exId)?.kind,weights=Array.from({length:n},(_,i)=>StartingLoad.missingSet(item,i,kind)?null:Array.isArray(item.kgList)?Number.isFinite(item.kgList[i])?item.kgList[i]:null:Number.isFinite(item.kg)?item.kg:0);
    const same=values.every(value=>value===values[0]),quantity=same?n+' × '+compactValues(values):n>4?n+' serija · '+compactValues(values):compactValues(values);
    const weight=kind||weights.some(value=>value>0)?weights.every(value=>value==null)?'težina nije upisana':compactValues(weights)+(kind==='db'?' kg / kom':' kg')+(weights.some(value=>value==null)&&n<=4?' · dio težina nije upisan':''):'';
    return quantity+(timed?' s':' pon.')+(item.sides?' po strani':'')+(weight?' · '+weight:'');
  };
  return '<div class="workout-compact-list" aria-label="Vježbe u treningu">'+items.map((item,j)=>{
    const e=S.ex[item.exId],group=rounds[j];
    const previous=j?sections[j-1]:null,section=sections[j];
    return (section&&section!==previous?'<h2 class="workout-list-section">'+esc(section)+'</h2>':'')+WorkoutView.compactExercise({index:j,name:(group?group.L+group.k+' · ':'')+(e?.name||'Obrisana vježba'),thumbHtml:e?thumbHtml(e):'',summary:summary(item),previous:workoutPreviousShort(item)});
  }).join('')+'</div>';
}
function workoutCandidates(item) {
  const exercises=Object.fromEntries(Object.values(S.ex).map(e=>[e.id,{...e,equip:exEquip(e)}]));
  const profiles=Object.fromEntries(Object.values(S.ex).map(e=>[e.id,loadFx(e)]));
  return WorkoutModel.candidates({item,exercises,profiles});
}
function workoutEquipmentVariants(item,candidates=workoutCandidates(item)) {
  // Only explicitly related variants are direct equipment choices. Broad
  // muscle/pattern alternatives still belong to the reviewed Swap list.
  const families=[['bench-press','db-bench-press']];
  const family=families.find(ids=>ids.includes(item.exId));
  const own=S.ex[item.exId]?.equipmentFamily;
  const ids=family||(!own?[]:Object.values(S.ex).filter(e=>e.equipmentFamily===own).map(e=>e.id));
  return candidates.filter(candidate=>ids.includes(candidate.id)&&!!S.ex[candidate.id].sides===!!item.sides);
}
function workoutToolbarHtml(s,c) {
  const item=c.items[s.j],e=S.ex[item.exId],kind=kgKind(e),equipment={bar:'Šipka',db:'Bučice',lm:'Landmine',kb:'Girja'}[kind]||exEquip(e)[0]||'Oprema';
  const undo=c.live?P.swapUndo?.[s.j]:c.source[s.j],canUndo=undo&&undo.exId!==item.exId&&!s.pendingReplacement;
  return '<div class="workout-tools workout-tools-four"><button type="button" data-a="workoutEquipment" data-j="'+s.j+'" aria-expanded="'+!!s.equipmentMenu+'">'+esc(equipment)+' '+WorkoutView.icon('chevrons-up-down')+'</button><button type="button" data-a="'+(canUndo?'workoutUndoSwap':'workoutSwap')+'" data-j="'+s.j+'"'+(!workoutCanSwap(c,s.j)?' disabled':'')+'>'+WorkoutView.icon('shuffle')+'<span>'+(canUndo?'Vrati vježbu':'Zamjena')+'</span></button><button type="button" data-a="workoutHistory" data-j="'+s.j+'">'+WorkoutView.icon('notebook-text')+'<span>Povijest</span></button><button type="button" data-a="workoutTrends" data-j="'+s.j+'">'+WorkoutView.icon('chart-no-axes-combined')+'<span>Trendovi</span></button></div>'+
    (s.equipmentMenu?'<section class="workout-equipment-menu" aria-label="Rekviziti za ovu vježbu"><p>Odaberi rekvizit</p><button type="button" class="workout-equipment-option" data-a="workoutEquipmentClose" aria-pressed="true">'+esc(equipment)+' · '+esc(e.name)+' ✓</button>'+workoutEquipmentVariants(item).map(candidate=>'<button type="button" class="workout-equipment-option" data-a="workoutQuickCandidate" data-id="'+esc(candidate.id)+'"'+(!workoutCanSwap(c,s.j)?' disabled':'')+'><span class="workout-thumb">'+thumbHtml(S.ex[candidate.id])+'</span><span>'+esc(candidate.equipment.includes('Bučice')?'Bučice':candidate.equipment.join(' · '))+'<small>'+esc(candidate.name)+'</small></span></button>').join('')+(!workoutEquipmentVariants(item).length?'<p>Nema druge izravne varijante za ovu vježbu.</p>':!workoutCanSwap(c,s.j)?'<p>Rekvizit se mijenja prije početka vježbe.</p>':'')+'</section>':'');
}
function workoutAddSetHtml(s,c){
  if(c.program&&!c.live)return '';
  const item=c.items[s.j],closed=c.live&&PlayerDose.locks(P,s.j).closed,full=item.sets>=20;
  return '<button type="button" class="workout-add-set" data-a="workoutAddSet" data-j="'+s.j+'"'+(closed||full||s.pendingReplacement?' disabled':'')+(full?' title="Najviše 20 serija"':'')+'>'+I.plus+'Dodaj seriju</button>';
}
function workoutPrescriptionHtml(s,c) {
  const item=c.items[s.j],timed=item.measure==='time',key=timed?'targetSir':'targetRir',value=item[key],max=timed?40:10;
  const target=timed?'Cilj rezerve '+(Number.isFinite(value)?value+' s':'—'):'Cilj RIR '+(Number.isFinite(value)?value:'—');
  const explain=timed?'Ciljana rezerva je plan koliko bi dodatnih sekundi mogao pravilno izdržati. Stvarnu rezervu upisuješ nakon odrađene serije.':'RIR je broj dodatnih pravilnih ponavljanja koje bi mogao odraditi. Cilj je dio plana; stvarni RIR unosiš nakon serije.';
  const editor=!c.live&&!c.program?'<label>'+ (timed?'Ciljana rezerva (s)':'Ciljani RIR')+'<select id="workout-target" data-j="'+s.j+'"><option value="">Nije postavljeno</option>'+Array.from({length:max+1},(_,i)=>'<option value="'+i+'"'+(value===i?' selected':'')+'>'+i+'</option>').join('')+'</select></label>':'';
  const timer=!timed&&!c.live&&!c.program?'<button type="button" class="set-edit" data-a="workoutEdit" data-j="'+s.j+'" aria-label="Uredi tajmer serije">'+
    WorkoutView.icon('timer')+'<span>'+(repSetSeconds(item)===null?'Tajmer serije':repSetSeconds(item)+' s / seriji')+'</span></button>':'';
  return '<div class="workout-prescription"><details class="workout-plan-options"><summary aria-label="'+esc(target+'. Objašnjenje i postavke serija')+'"><strong>'+esc(target)+'</strong><span class="workout-reserve-info" aria-hidden="true">'+WorkoutView.icon('info')+'</span></summary><div class="workout-prescription-editor"><p>'+esc(explain)+'</p>'+editor+'<button type="button" class="set-edit" data-a="workoutEdit" data-j="'+s.j+'"'+(c.program&&!c.live?' disabled':'')+'>Broj serija</button></div></details>'+timer+'<span>Odmor '+esc(item.rest||0)+' s</span></div>';
}
function workoutInstructionsHtml(e) {
  const muscles=exMuscles(e);
  const selected=S.sheet?.muscleRegion,region=window.BODY?.regions[selected],isJoint=id=>window.BODY?.regions[id]?.kind==='joint';
  const role=isJoint(selected)?'Zglobno područje · ne daje zasebne mišićne bodove.':muscles.prime.includes(selected)?'Glavni mišić u ovoj vježbi.':muscles.sec.includes(selected)?'Pomoćni mišić u ovoj vježbi.':'Nije označen u ovoj vježbi.';
  const caption='<p class="workout-region-caption" role="status">'+(region?'<strong>'+esc(region.label_hr)+'</strong> '+esc(role):'Dodirni područje za naziv i njegovu ulogu.')+'</p>';
  return WorkoutView.instructions({name:e.name,why:e.note||'',steps:e.steps||[],figureHtml:bodyFig(muscles,{size:275,cls:'workout-anatomy',act:'workoutMuscle',selected}),figureCaptionHtml:caption,primary:muscles.prime.filter(id=>!isJoint(id)).map(muscleLabel),secondary:muscles.sec.filter(id=>!isJoint(id)).map(muscleLabel)});
}
function workoutTrendsHtml(item) {
  const e=S.ex[item.exId],series=exLoadSeries(e.id,0),rows=historyOf(e.id).filter(x=>x.measure===item.measure);
  const loadPoints=(series?.pts||[]).map(p=>({at:p.t,value:p.v,context:p.xs.map(recordedDoseLabel).join(' · ')}));
  // A weight series is only comparable within the same repetitions, side mode
  // with reserve retained as context. Unknown reserve stays explicitly unknown.
  const best=[];
  for(const row of rows.slice().reverse()){
    const actual=HistoryModel.recordedRows(row);if(!actual)continue;
    const eligible=actual.filter(r=>r.sides===(item.sides?2:1)&&r.kg!=null&&r.reps>0&&r.kg>0);
    if(!eligible.length)continue;
    const last=eligible.reduce((a,b)=>b.kg>a.kg?b:a),known=last.rir;
    best.push({at:row.at,value:last.kg,context:last.reps+' pon.'+(known==null?' · RIR nije zabilježen':' · RIR '+known),reps:last.reps,rir:known});
  }
  const latest=best.at(-1),comparable=latest?best.filter(p=>p.reps===latest.reps):[];
  const charts=(comparable.length?WorkoutView.chart({id:'workout-weight',title:'Radna težina',subtitle:latest.reps+' ponavljanja u seriji · rezerva u detaljima',unit:kgKind(e)==='db'?'kg po bučici':'kg',type:'line',points:comparable}):'')+
    WorkoutView.chart({id:'workout-volume',title:LOAD_LABEL[series?.kind]||'Volumen',subtitle:series?.partial?'Prikazan je poznati dio zapisa.':'Zabilježeno po izvedbi iste varijante',unit:series?.kind==='secs'?'s':series?.kind==='reps'?'pon.':series?.kind==='m'?'m':'kg',type:'bar',points:loadPoints,emptyText:'Nakon spremljene izvedbe ovdje će se prikazati zabilježeni rad.'});
  return WorkoutView.trends({name:e.name,subtitle:'Iz spremljene povijesti',chartsHtml:charts,note:'Volumen je količina rada. Za ocjenu napretka usporedi ponavljanja, rezervu i način izvođenja.'});
}
function workoutPanelHtml(s) {
  const c=workoutContext(s),item=c?.items[s.j],e=item&&S.ex[item.exId];
  if(!e)return '<p>Vježba nije dostupna.</p><button data-a="workoutClose">Zatvori</button>';
  if(s.panel){
    const title={instructions:'O vježbi',history:'Povijest',trends:'Napredak'}[s.panel];
    return '<div class="view workout-exercise-panel"><header class="workout-panel-bar"><strong>'+title+'</strong><button class="ib" data-a="workoutPanelBack" aria-label="Zatvori '+title.toLowerCase()+'">'+I.close+'</button></header><div class="workout-panel-body">'+(s.panel==='instructions'?workoutInstructionsHtml(e):s.panel==='history'?'<h1>'+esc(e.name)+'</h1>'+workoutPreviousHtml(item)+exHistHtml(e,historyOf(e.id)):workoutTrendsHtml(item))+'</div></div>';
  }
  const footer='<button class="btn" data-a="'+(c.live?'workoutClose':top().v==='pr'?'workoutStart':'playEx')+'"'+(top().v==='ex'?' data-id="'+esc(top().id)+'"':'')+'>'+WorkoutView.icon('play')+ (c.live?'Natrag u trening':'Pokreni '+(top().v==='ex'?'vježbu':'trening'))+'</button>';
  return WorkoutView.exercisePage({topbarHtml:topbar('<button class="ib" data-a="workoutClose" aria-label="Natrag na trening">'+WorkoutView.icon('chevron-left')+'</button>','','MOJ TRENING'),mediaHtml:mediaHtml(e),infoHtml:'<button type="button" class="ib" data-a="workoutInfo" aria-label="Upute za '+esc(e.name)+'">'+WorkoutView.icon('info')+'</button>',name:e.name,eyebrow:c.live?'Trening je pauziran':'Plan serija',previousHtml:workoutPreviousCompact(item),toolsHtml:workoutToolbarHtml(s,c),targetHtml:workoutPrescriptionHtml(s,c),rowsHtml:workoutTableHtml(c,s.j,s)+workoutAddSetHtml(s,c),note:s.error||'',footerHtml:'<div class="footer gut">'+(s.pendingReplacement?'<button class="txtbtn" data-a="workoutCancelPending">Vrati prethodnu vježbu</button>':'')+footer+'</div>'}).replace('class="view workout-exercise-page"','class="view workout-exercise-page" data-context="'+(c.live?'live':top().v==='ex'?'library':'preview')+'"');
}
// one line for the protocol list: "Prethodno 95 kg · 5 / 5 / 5 / 5 pon." from the last recorded dose ('' when unknown or mixed)
function workoutPreviousShort(item) {
  const previous=WorkoutModel.previous({item,log:S.log,now:Date.now()});
  const rows=previous?previous.rows.filter(row=>row.measure===item.measure):[];
  if(!rows.length||rows.some(row=>row.failed||row.sides==null||row.perSide==null||row.perSide!==!!item.sides))return '';
  return 'Prethodno '+previousDoseText(rows,item);
}
function workoutPreviousCompact(item) {
  const previous=WorkoutModel.previous({item,log:S.log,now:Date.now()});
  if(!previous)return '<span>Još nema prethodne izvedbe.</span>';
  const rows=previous.rows.filter(row=>row.measure===item.measure);
  if(!rows.length)return '<span>Prethodno · '+(previous.skippedItems?'vježba je preskočena.':previous.rows.length?'druga vrsta doze; otvori povijest.':'pojedinačne serije nisu poznate.')+'</span>';
  const format=value=>value==null?'—':value.toLocaleString('hr-HR');
  const kind=startLoadDescription(item.exId)?.kind,weightUnit=kind==='db'?' kg / kom':' kg',timed=item.measure==='time',quantityKey=timed?'sec':'reps',quantityUnit=timed?' s':' pon.';
  const contextual=rows.some(row=>row.failed||row.sides==null||row.perSide==null||row.perSide!==!!item.sides||row.sides!==(row.perSide?2:1));
  if(contextual)return '<span>Prethodno '+esc(rows.map((row,index)=>{
    const sides=row.sides==null?' · strane nisu zabilježene':row.perSide?(timed&&row.sides===2?' prosječno po strani · ':' po strani · ')+row.sides+'/2 strane':row.perSide==null?' · '+row.sides+' strana, način nije zabilježen':'';
    return (row.number||index+1)+'. '+format(row.kg)+weightUnit+' · '+format(row[quantityKey])+quantityUnit+sides+(row.failed?' · nedovršeno':'');
  }).join(' / '))+'</span>';
  return '<span>Prethodno '+esc(previousDoseText(rows,item))+'</span>';
}
// "95 kg · 5 / 5 / 5 / 4 pon." from recorded rows, spaced like the target line: one format for the protocol row and the exercise page (kg / kom for dumbbells,
// po strani for one side at a time; no kilograms when the exercise carries none)
function previousDoseText(rows,item){
  const format=value=>value==null?'—':value.toLocaleString('hr-HR'),timed=item.measure==='time',kind=startLoadDescription(item.exId)?.kind;
  const weights=rows.map(row=>row.kg),loaded=kind||weights.some(value=>value>0);
  const weight=!loaded?'':(weights.every(value=>value===weights[0])?format(weights[0]):weights.map(format).join(' / '))+(kind==='db'?' kg / kom':' kg')+' · ';
  return weight+rows.map(row=>format(row[timed?'sec':'reps'])).join(' / ')+(timed?' s':' pon.')+(item.sides?(timed?' prosječno po strani':' po strani'):'');
}
function workoutCommitItems(s,items,{retimeCurrent=false}={}) {
  const c=workoutContext(s);if(!workoutValid(s,c))return 'Podaci su promijenjeni. Ponovno otvori trening.';
  if(!c.live){top().runDose={...top().runDose,base:mtCanon(c.source),items,sessionOnly:!!top().runDose?.sessionOnly||items.some((it,j)=>it.exId!==c.source[j]?.exId)};return null;}
  const before=P,swapUndo={...P.swapUndo};
  items.forEach((it,j)=>{if(it.exId!==P.items[j]?.exId&&!swapUndo[j])swapUndo[j]=clone(P.items[j]);});
  const timeline=PlayerDose.rebuild(P,items,liveStepsFromItems,{retimeCurrent});
  let timing={};
  if(retimeCurrent){
    const elapsed=Math.max(0,P.steps[P.i].dur-remaining());
    const current=timeline.steps[timeline.i];
    const left=Math.max(0,current.dur-elapsed);
    timeline.steps[timeline.i]={...current,dur:Math.max(current.dur,Math.round(elapsed))};
    timing={left,endAt:Date.now()+left*1000,lastBeep:null};
  }
  P={...P,...timeline,...timing,swapUndo,sessionOnly:P.sessionOnly||items.some((it,j)=>it.exId!==c.source[j]?.exId)};
  if(P.musclePlan)P.musclePlan=items.map((it,j)=>it.exId===before.items[j]?.exId?before.musclePlan[j]:MuscleWork.pack(protocolMuscleWork({items:[it]})[0]));
  if(!savePlay()){P=before;return 'Promjena nije spremljena. Tvoj je unos sačuvan; pokušaj ponovno.';}
  s.base=mtCanon(P.items);return null;
}
function workoutInlineChange(input) {
  const s=workoutState(Number(input.dataset.j)),c=workoutContext(s),item=c?.items[s?.j],set=Number(input.dataset.set),field=input.dataset.field;
  if(!item||!Number.isInteger(set)||set<1||set>item.sets)return;
  S.workoutRaw=S.workoutRaw||{};const key=workoutRawKey(s,set,field);S.workoutRaw[key]=input.value;
  const fail=msg=>{if(S.sheet?.kind==='workoutExercise')S.sheet.error=msg;toast(msg,true);input.setAttribute('aria-invalid','true');};
  if(!workoutValid(s,c)){fail('Podaci su promijenjeni. Ponovno otvori trening.');return;}
  if(!['reps','sec','kg','rir','sir'].includes(field))return;
  if(input.value.trim()!==''&&workoutNumber(input.value)===null){fail('Upiši valjan broj. Za decimale možeš koristiti zarez.');return;}
  const recorded = c.live && !s.pendingReplacement && field === 'reps'
    ? P.steps.findIndex((step, index) => step.kind === 'manual' && step.g === s.j && step.set === set && P.doneSteps[index])
    : -1;
  if (recorded >= 0) {
    const reps = workoutNumber(input.value);
    if (!PlayerDose.validActualReps(reps)) { fail('Upiši od 1 do 60 odrađenih ponavljanja.'); return; }
    if (!saveRecordedSet(recorded, reps)) { fail('Rezultat nije spremljen. Pokušaj ponovno.'); return; }
  } else if(['rir','sir'].includes(field)){
    if(!c.live||s.pendingReplacement)return;
    const st=P.steps.map((st,k)=>({st,k})).filter(x=>isWork(x.st)&&x.st.g===s.j&&x.st.set===set&&P.doneSteps[x.k]&&setEnd(x.st)).at(-1);
    const row=PlayerDose.checklist(item,P,s.j).find(r=>r.set===set),value=input.value.trim()===''?null:workoutNumber(input.value),max=field==='sir'?40:10;
    if(!st||row.state!=='done'||failedReserveStep(st.k)||value!==null&&(!Number.isFinite(value)||value<0||value>max)){fail('Rezervu upiši nakon cijele odrađene serije.');return;}
    if(!savePlayerChoice(['rir'],()=>{P.rir={...P.rir};if(value===null)delete P.rir[st.k];else P.rir[st.k]=value;})){fail('Rezerva nije spremljena. Unos je sačuvan; pokušaj ponovno.');return;}
  }else{
    if(c.program&&!c.live)return;
    const value=input.value.trim()===''&&field==='kg'?null:workoutNumber(input.value),guard=c.live&&!s.pendingReplacement?PlayerDose.locks(P,s.j):{allowMissingWeight:true};
    if(value===null&&(field!=='kg'||c.live&&!s.pendingReplacement)){fail('Upiši broj ponavljanja ili sekundi.');return;}
    const edited=PlayerDose.editItem(item,{rows:[{set,[field]:value}]},{...guard,allowMissingWeight:!c.live||!!s.pendingReplacement});
    if(!edited.ok){fail(edited.error);return;}
    const items=c.items.slice();items[s.j]=edited.item;
    if(s.pendingReplacement){
      s.pendingReplacement=edited.item;
      if(!StartingLoad.requests([edited.item],startLoadDescription).length){const error=workoutCommitItems(s,items);if(error){fail(error);return;}delete s.pendingReplacement;}
    }else{const error=workoutCommitItems(s,items);if(error){fail(error);return;}}
  }
  delete S.workoutRaw[key];
  if (S.sheet?.kind === 'cinemaJournal' && (recorded >= 0 || field === 'rir' || field === 'sir')) {
    // Keep the input and tap target in place as focus moves to the next field.
    const value = workoutNumber(input.value);
    input.value = value == null ? '' : String(value).replace('.',',');
    input.removeAttribute('aria-invalid');
    const totals = app.querySelector('.cinema-journal-footer small');
    if (totals) totals.textContent = cinemaJournalTotals(CinemaModel.summary(P,PlayerDose));
    return true;
  }
  if(S.sheet?.kind==='workoutExercise')delete S.sheet.error;
  render();return true;
}
function workoutQuickReplace(s,id,equipmentOnly=false) {
  const c=workoutContext(s),e=S.ex[id],candidate=(equipmentOnly?workoutEquipmentVariants(c?.items[s.j]):workoutCandidates(c?.items[s.j])).find(x=>x.id===id);
  if(!c||!e||!candidate||!workoutCanSwap(c,s.j)||!workoutValid(s,c))return;
  const old=c.items[s.j],fresh=WorkoutModel.draftReplacement(old,exItem(e));if(!fresh)return;
  const item=clone(fresh);
  if(equipmentOnly){for(const field of ['reps','repsList','sec','secList','targetRir','targetSir','repSetSec'])if(old[field]!==undefined)item[field]=clone(old[field]);}
  // Only known, complete doses of this exact variant may provide its weight.
  const previous=WorkoutModel.previous({item,log:S.log,now:Date.now()}),known=previous?.rows.filter(r=>r.measure===item.measure&&r.sides===(item.sides?2:1)&&Number.isFinite(r.kg)&&r.kg>0&&!r.failed);
  item.kg=known?.length?known.at(-1).kg:0;
  item.kgList=Array.from({length:item.sets},(_,i)=>known?.length?known[Math.min(i,known.length-1)].kg:null);
  if(known?.length)item.startingKgKnown=true;else delete item.startingKgKnown;
  const items=c.items.slice();items[s.j]=item;S.workoutRaw={};s.kind='workoutExercise';delete s.panel;delete s.equipmentMenu;delete s.swap;
  if(c.live&&StartingLoad.requests([item],startLoadDescription).length){s.pendingReplacement=item;s.error='Unesi težinu nove varijante prije nastavka treninga. Težina prethodne vježbe nije prenesena.';S.sheet=s;render();return;}
  const error=workoutCommitItems(s,items);if(error){s.error=error;S.sheet=s;render();return;}
  delete s.pendingReplacement;delete s.error;S.sheet=s;render();
}
function cinemaState(v=curView()) {
  const active=Number.isInteger(v.displayGroup)?v.displayGroup:Number.isInteger(v.st.g)?v.st.g:0;
  if(S.playerJournal?.startedAt!==P.startedAt)S.playerJournal={startedAt:P.startedAt,all:false,active,group:active};
  if(S.playerJournal.active!==active){S.playerJournal.active=active;S.playerJournal.group=active;}
  return S.playerJournal;
}
function cinemaMediaHtml(e) {
  const m=e&&exMedia(e,true);
  if(!m)return '<div class="media cinema-single-media"><div class="ph">'+pathIcon(catIcon(e?.cat),72)+'</div></div>';
  const old=app.querySelector('.workout-cinema .cinema-single-media img,.workout-cinema .cinema-single-media video');
  const same=old&&old.getAttribute('src')===m.src;
  const warmed=P._warmedPicture?.image;
  const reuseWarmed=m.type==='image'&&warmed?.getAttribute('src')===m.src&&(!warmed.complete||warmed.naturalWidth);
  if(same)keepMedia=old;
  else if(reuseWarmed){
    warmed.setAttribute('fetchpriority','high');warmed.alt=e.name;
    warmed.dataset.fallbackCat=MEDIA_CATS.includes(e.cat)?e.cat:'';warmed.dataset.fallbackSize='72';
    warmed.addEventListener('error',()=>mediaFail(warmed),{once:true});
    keepMedia=warmed;delete P._warmedPicture;
  }
  const image=same||reuseWarmed?'<span id="keepmedia"></span>':m.type==='video'?videoTag(m):'<img fetchpriority="high"'+mediaFailAttr(e,72)+' src="'+esc(m.src)+'" alt="'+esc(e.name)+'">';
  return '<div class="media cinema-single-media'+(m.two?' two':'')+'">'+image+creditHtml(m)+'</div>';
}
function cinemaRecordedStep(){
  return P.mode === 'ex' && isWork(P.steps[P.i]) && !!P.doneSteps[P.i];
}
function cinemaLastRecordedIndex(){
  if (P.mode !== 'ex') return -1;
  for (let index = P.done ? P.steps.length - 1 : P.i; index >= 0; index--) {
    if (isWork(P.steps[index]) && P.doneSteps[index]) return index;
  }
  return -1;
}
function cinemaRedoButton(label){
  const step = P.steps[cinemaLastRecordedIndex()];
  if (!step) return '';
  const exercise = S.ex[step.it?.exId]?.name || step.e?.name || 'Vježba';
  return '<button type="button" class="txtbtn" data-a="workoutRedoSet" data-j="'+step.g+'" data-set="'+step.set+'" title="'+esc(exercise+' · '+step.set+'. serija')+'">'+esc(label)+'</button>';
}
function cinemaReviewResultButton(index){
  const step = P.steps[index];
  if (step?.kind !== 'manual' || !PlayerDose.setWorkEnd(step) || failedReserveStep(index)) return '';
  const reserve = P.rir?.[index];
  const summary = PlayerDose.recordedAt(step).reps+' pon.'+(step.it.sides ? ' po strani' : '')+(reserve == null ? '' : ' · RIR '+reserve);
  const target = step.e.name+' · '+step.set+'. serija';
  return '<button type="button" class="txtbtn" data-a="cinemaReserve" data-k="'+index+'" title="'+esc(target)+'">'+
    'Uredi rezultat zadnje serije <b>'+esc(summary)+'</b></button>';
}
const CINEMA_CLOCK_TICKS = 34;
const cinemaClockSegments = Array.from({length:CINEMA_CLOCK_TICKS}, (_, index) => {
  const angle = Math.PI * (index + .5) / CINEMA_CLOCK_TICKS;
  const point = radius => (88 - radius*Math.cos(angle)).toFixed(2)+' '+(88 - radius*Math.sin(angle)).toFixed(2);
  return 'M'+point(72)+'L'+point(85);
});
function cinemaClockProgress(step){
  if (cinemaRecordedStep()) return 1;
  if (step.kind === 'manual') return 1 - cinemaManualRemaining(step) / cinemaManualTarget(step);
  return step.dur ? 1 - remaining() / step.dur : 0;
}
function cinemaClockCount(step){
  return Math.max(0, Math.min(cinemaClockSegments.length, Math.round(cinemaClockProgress(step)*cinemaClockSegments.length)));
}
function cinemaClockHtml(step, recorded){
  const count = cinemaClockCount(step);
  const label = recorded ? 'Odrađena serija' : P.paused ? 'Nastavi brojač' : 'Pauziraj brojač';
  const status = recorded ? 'odrađena' : step.kind === 'rest' ? '' : P.paused ? 'pauza' : isWork(step) ? '' : 'priprema';
  const arc = step.kind === 'rest' ? '' : '<svg class="cinema-clock-arc" viewBox="0 0 176 88" aria-hidden="true">'+
    '<path d="'+cinemaClockSegments.join('')+'"/><path id="cinema-clock-fill" data-count="'+count+'" d="'+cinemaClockSegments.slice(0,count).join('')+'"/></svg>';
  return '<button type="button" class="workout-cinema-clock" id="ring" data-a="cinemaTimer" aria-label="'+label+'"'+(recorded?' disabled':'')+'>'+
    arc+'<strong class="n" id="ringN">'+cinemaClockText(step)+'</strong>'+
    (status?'<span class="workout-control-action">'+status+'</span>':'')+'</button>';
}
function cinemaClockText(step){
  if (cinemaRecordedStep()) return '✓';
  if (step.kind === 'manual') return fmt(cinemaManualRemaining(step));
  return step.kind === 'ready' ? 'Kreni' : fmt(remaining());
}
function cinemaDisplayStep(st){
  return (['prep','rest','ready','switch'].includes(st.kind)?P.steps.slice(P.i+1).find(isWork):st)||st;
}
const cinemaPickerLimits = {reps:[1,500],kg:[0,5000],sec:[1,3600]};
const cinemaPickerRadius = 18;
let cinemaPicker = null;
function cinemaPickerOffset(field,value,delta){
  const [min,max]=cinemaPickerLimits[field];
  const scale=field==='kg'?2:1;
  const origin=delta<0?Math.ceil(value*scale):Math.floor(value*scale);
  return Math.max(min,Math.min(max,(origin+delta)/scale));
}
function cinemaMetricValue(field,value){
  const text=String(value).replace('.',',');
  return field==='kg'?fmtKg(value):text+(field==='sec'?' s':' ponavljanja');
}
function cinemaMetricGuard(field,step){
  const guard=PlayerDose.locks(P,step.g),current=P.steps[P.i];
  const editableTime=field==='sec'&&step.kind==='work'&&!P.doneSteps[P.steps.indexOf(step)]&&
    (step===current||current.kind==='switch'&&current.g===step.g&&current.set===step.set);
  if(editableTime)guard.locked=guard.locked.filter(set=>set!==step.set);
  return guard;
}
function cinemaMetricHtml(field,step,item,dose){
  const kind=startLoadDescription(item.exId)?.kind;
  const weight=field==='kg', caption=weight?(kind==='db'?'Težina / kom':'Težina'):field==='sec'?'Sekunde':'Ponavljanja';
  if(weight&&!kind)return '<div class="workout-cinema-metric cinema-weight-unavailable"><strong>—</strong><span class="cinema-metric-label">Težina</span></div>';
  const guard=cinemaMetricGuard(field,step);
  const locked=guard.closed||guard.locked.includes(step.set);
  const value=dose[field],text=String(value).replace('.',','),wide=text.length>4?' is-wide':'';
  const missing=weight&&StartingLoad.missingSet(P.items[step.g]||item,step.set-1,kind);
  const label=missing?'Dodaj težinu':weight?'Uredi kilograme':field==='sec'?'Uredi sekunde':'Uredi ponavljanja';
  const expanded=!locked&&!S.sheet&&cinemaPicker?.phase===P.steps[P.i]&&cinemaPicker.field===field;
  if(!expanded){
    const number='<strong>'+esc(text)+'</strong>';
    const display=missing?'<span class="cinema-weight-add" aria-hidden="true">'+I.plus+'</span>':
      weight?'<span class="cinema-weight-value'+wide+'">'+number+'<small>kg</small></span>':number;
    return '<button type="button" class="workout-cinema-metric" data-a="cinemaPickerOpen" data-field="'+field+'" aria-expanded="false" aria-label="'+
      label+(missing?'':', '+esc(cinemaMetricValue(field,value)))+'"'+(locked?' disabled':'')+'>'+
      display+'<span class="cinema-metric-label">'+caption+(!locked?WorkoutView.icon('chevrons-up-down'):'')+'</span></button>';
  }
  const [min,max]=cinemaPickerLimits[field],selected=cinemaPicker.value;
  const values=[...new Set(Array.from({length:2*cinemaPickerRadius+1},(_,i)=>
    i===cinemaPickerRadius?selected:cinemaPickerOffset(field,selected,i-cinemaPickerRadius)))];
  return '<div class="cinema-number-picker"><div class="cinema-number-wheel" data-field="'+field+'" data-value="'+selected+
    '" role="spinbutton" tabindex="0" aria-label="'+caption+'" aria-valuemin="'+min+'" aria-valuemax="'+max+
    '" aria-valuenow="'+selected+'" aria-valuetext="'+esc(cinemaMetricValue(field,selected))+'">'+
    values.map(n=>{
      const shown=String(n).replace('.',',');
      return '<button type="button" tabindex="-1" class="cinema-wheel-number'+(n===selected?' is-selected':'')+(shown.length>4?' is-wide':'')+
        '" data-a="cinemaPickerValue" data-v="'+n+'" aria-label="Odaberi '+esc(cinemaMetricValue(field,n))+'">'+esc(shown)+'</button>';
    }).join('')+'</div></div>';
}
function cinemaChangeMetric(field,value,focus){
  if(S.sheet||!P||P.done||cinemaPicker?.field!==field||cinemaPicker.phase!==P.steps[P.i])return;
  const step=cinemaDisplayStep(P.steps[P.i]),item=P.items[step.g];
  if(!item)return;
  const weightKind=field==='kg'?startLoadDescription(item.exId)?.kind:null;
  if(field==='kg'&&!weightKind)return;
  const missingWeight=StartingLoad.missingSet(item,step.set-1,weightKind);
  if(!missingWeight&&value===PlayerDose.at(item,step.set)[field]){cinemaClosePicker(focus);return;}
  const edited=PlayerDose.editItem(item,{rows:[{set:step.set,[field]:value}]},cinemaMetricGuard(field,step));
  if(!edited.ok){toast(edited.error,true);return;}
  if(missingWeight&&weightKind==='lm'&&value===0)edited.item.startingKgKnown=true;
  const state=workoutState(step.g),context=workoutContext(state);
  context.items[step.g]=edited.item;
  const retimeCurrent=field==='sec'&&step.kind==='work'&&step===P.steps[P.i];
  const error=workoutCommitItems(state,context.items,{retimeCurrent});
  if(error){toast(error,true);return;}
  buzz(15);
  cinemaClosePicker(focus);
}
function cinemaClosePicker(focus){
  const field=cinemaPicker?.field;
  cinemaPicker=null;
  render();
  if(focus)app.querySelector('[data-a="cinemaPickerOpen"][data-field="'+field+'"]')?.focus({preventScroll:true});
}
function setupCinemaPicker(){
  const wheel=app.querySelector('.cinema-number-wheel');
  if(!wheel)return;
  const numbers=Array.from(wheel.children),rowHeight=numbers[0]?.offsetHeight,field=wheel.dataset.field;
  if(!rowHeight)return;
  const indexAtCenter=()=>Math.max(0,Math.min(numbers.length-1,Math.round(wheel.scrollTop/rowHeight)));
  let selected=numbers.findIndex(node=>node.classList.contains('is-selected'));
  let timer,drag=null,dragged=false;
  wheel.scrollTop=selected*rowHeight;
  const highlight=index=>{
    if(!wheel.isConnected||cinemaPicker?.field!==field||index===selected)return;
    numbers[selected].classList.remove('is-selected');
    numbers[index].classList.add('is-selected');
    const value=Number(numbers[index].dataset.v);
    cinemaPicker.value=value;
    wheel.dataset.value=String(value);
    wheel.setAttribute('aria-valuenow',String(value));
    wheel.setAttribute('aria-valuetext',cinemaMetricValue(field,value));
    selected=index;
  };
  const settle=()=>{
    clearTimeout(timer);
    if(drag||!wheel.isConnected||cinemaPicker?.field!==field)return;
    highlight(indexAtCenter());
    const [min,max]=cinemaPickerLimits[field],value=cinemaPicker.value;
    if(selected===0&&value>min||selected===numbers.length-1&&value<max){
      const focused=wheel.contains(document.activeElement);
      render();
      if(focused)app.querySelector('.cinema-number-wheel')?.focus({preventScroll:true});
    }
  };
  const update=()=>{
    highlight(indexAtCenter());
    clearTimeout(timer);
    if(!drag)timer=setTimeout(settle,160);
  };
  wheel.addEventListener('scroll',update,{passive:true});
  wheel.addEventListener('scrollend',settle);
  wheel.addEventListener('keydown',event=>{
    if(event.key==='ArrowUp'||event.key==='ArrowDown'){
      event.preventDefault();
      const next=indexAtCenter()+(event.key==='ArrowUp'?1:-1);
      if(numbers[next]){
        wheel.scrollTop=next*rowHeight;
        highlight(next);
        settle();
      }
    }else if(event.key==='Escape'){
      event.preventDefault();event.stopPropagation();cinemaClosePicker(true);
    }else if(event.key==='Enter'||event.key===' '){
      event.preventDefault();cinemaChangeMetric(field,Number(numbers[indexAtCenter()].dataset.v),true);
    }
  });
  wheel.addEventListener('pointerdown',event=>{
    if(event.pointerType!=='mouse'||event.button!==0)return;
    clearTimeout(timer);
    drag={id:event.pointerId,y:event.clientY,top:wheel.scrollTop};
    dragged=false;
  });
  wheel.addEventListener('pointermove',event=>{
    if(drag?.id!==event.pointerId)return;
    const distance=drag.y-event.clientY;
    if(!dragged&&Math.abs(distance)<4)return;
    if(!dragged){
      dragged=true;
      wheel.setPointerCapture(event.pointerId);
      wheel.classList.add('is-dragging');
    }
    wheel.scrollTop=drag.top+distance;
  });
  const endDrag=event=>{
    if(drag?.id!==event.pointerId)return;
    drag=null;
    if(!dragged)return;
    const index=indexAtCenter();
    wheel.classList.remove('is-dragging');
    wheel.scrollTop=index*rowHeight;
    update();
  };
  wheel.addEventListener('pointerup',endDrag);
  wheel.addEventListener('pointercancel',endDrag);
  wheel.addEventListener('click',event=>{
    if(!dragged||event.detail===0)return;
    dragged=false;
    event.preventDefault();
    event.stopPropagation();
  });
}
function cinemaLabel(v, paused) {
  if (cinemaRecordedStep()) return 'Nastavi dalje';
  return paused?'Nastavi':isWork(v.st)?(PlayerDose.splitSide(v.st)?workoutCompletionLabel(v.st):'Serija gotova'):v.st.kind==='ready'?'Kreni':v.st.kind==='rest'?'Preskoči odmor':'Kreni sada';
}
function cinemaManualTarget(step){
  return step.targetSec ?? Math.max(1,Math.min(3600,manualSetEstimate(step)));
}
function cinemaManualRemaining(step){
  const elapsed=SessionClock.update(P.stepClock,Date.now(),!!P.paused)?.seconds||0;
  return Math.max(0,cinemaManualTarget(step)-elapsed);
}
function cinemaFooter(v, step, item, name, preparing){
  const recorded=cinemaRecordedStep();
  if (isWork(v.st) || preparing) {
    const canMark=isWork(v.st)&&!recorded&&!P.paused;
    const mark=canMark?'<button type="button" class="cinema-work-mark" data-a="workoutSetDone" data-j="'+step.g+'" data-set="'+step.set+'" data-step="'+P.i+'" aria-label="'+workoutCompletionLabel(v.st)+'"><span>'+I.checkS+'</span></button>':
      '<span class="cinema-work-mark" aria-hidden="true"><span>'+I.checkS+'</span></span>';
    return '<div class="cinema-work-set'+(recorded?' is-recorded':'')+'">'+mark+
      '<button type="button" class="cinema-work-journal" data-a="cinemaJournal" aria-label="Dnevnik treninga" aria-haspopup="dialog"><strong>'+esc(name)+'</strong><span>'+
      (step.set||1)+' od '+item.sets+'</span></button></div>';
  }
  return '<button type="button" class="cinema-journal-bar" data-a="cinemaJournal" aria-haspopup="dialog">'+WorkoutView.icon('notebook-text')+'<strong>Dnevnik</strong><span>Upiši rezultate '+WorkoutView.icon('chevrons-up')+'</span></button>';
}
const CINEMA_PREP_TIMES = [0, 5, 10, 30, 60];
function cinemaPrepHtml(step, editing){
  if (!editing) {
    return '<div class="cinema-prep-entry">'+
      (step.kind==='prep'?'<button type="button" class="cinema-prep-clock" id="ring" data-a="cinemaTimer" aria-label="'+(P.paused?'Nastavi brojač':'Pauziraj brojač')+'"><span id="ringN">'+cinemaClockText(step)+'</span></button>':'')+
      '<button type="button" class="cinema-prep-trigger" data-a="cinemaPrep" aria-expanded="false">'+I.plus+'Dodaj vrijeme za pripremu</button></div>';
  }
  const selected = CINEMA_PREP_TIMES.indexOf(S.sheet.seconds);
  return '<section class="cinema-prep-editor" data-kind="cinemaPrep" aria-labelledby="cinema-prep-label">'+
    '<div class="cinema-prep-label"><label id="cinema-prep-label" for="cinema-prep-range">Dodaj vrijeme za pripremu</label><output for="cinema-prep-range">+'+S.sheet.seconds+' s</output></div>'+
    '<div class="cinema-prep-track" style="--prep-percent:'+selected*25+'%"><div class="cinema-prep-rail" aria-hidden="true">'+CINEMA_PREP_TIMES.map(()=>'<i></i>').join('')+'</div>'+
    '<input type="range" id="cinema-prep-range" min="0" max="4" step="1" value="'+selected+'" aria-valuetext="'+S.sheet.seconds+' sekundi"></div>'+
    '<div class="cinema-prep-picks">'+CINEMA_PREP_TIMES.map(n=>'<button type="button" data-a="cinemaPrepPick" data-v="'+n+'" aria-pressed="'+(S.sheet.seconds===n)+'" aria-label="Dodaj '+n+' sekundi">+'+n+' s</button>').join('')+'</div>'+
    '<button type="button" class="cinema-prep-done" data-a="cinemaPrepApply">Gotovo</button></section>';
}
function cinemaPrepSelect(seconds){
  const index = CINEMA_PREP_TIMES.indexOf(seconds);
  if (S.sheet?.kind !== 'cinemaPrep' || index < 0) return;
  S.sheet.seconds = seconds;
  const editor = app.querySelector('.cinema-prep-editor'), range = editor.querySelector('input');
  range.value = index;
  range.setAttribute('aria-valuetext',seconds+' sekundi');
  editor.querySelector('output').textContent = '+'+seconds+' s';
  editor.querySelector('.cinema-prep-track').style.setProperty('--prep-percent',index*25+'%');
  editor.querySelectorAll('[data-a="cinemaPrepPick"]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.v)===seconds)));
}
function cinemaPauseHtml(recorded){
  const transport = (dir,label,caption,icon) => '<button type="button" class="cinema-pause-jump" data-a="cinemaPauseJump" data-d="'+dir+'" aria-label="'+label+'"><strong>'+caption+'</strong><small>'+icon+'Povuci</small></button>';
  return '<div class="cinema-pause-layer"><section class="cinema-pause-actions" aria-labelledby="cinema-pause-title">'+
    '<h2 id="cinema-pause-title">Pauzirano</h2><div class="cinema-pause-row">'+transport(-1,'Prethodna vježba','Prethodna',I.prev)+
    '<button type="button" class="cinema-pause-resume" data-a="cinemaResume"><span aria-hidden="true">'+I.play+'</span>Nastavi</button>'+
    transport(1,'Sljedeća vježba','Sljedeća',I.next)+'</div>'+(recorded?'':'<button type="button" class="cinema-pause-replay" data-a="cinemaReplay">'+WorkoutView.icon('rotate-ccw')+'Ponovi<small>Dvostruki dodir</small></button>')+'</section></div>';
}
function cinemaMenuControls(){
  const v=curView(), recorded=cinemaRecordedStep(), paused=P.dosePause?.wasPaused??P.paused;
  const icon=recorded?I.next:paused?I.play:isWork(v.st)?I.checkS:v.st.kind==='rest'?I.next:I.play;
  return '<div class="cinema-menu-controls"><div class="cinema-controls"><button type="button" class="ib" data-a="jump" data-d="-1" aria-label="Prethodna vježba">'+I.prev+
    '</button><button type="button" class="btn cinema-primary" data-a="cinemaMain">'+icon+'<span>'+cinemaLabel(v,paused)+
    '</span></button><button type="button" class="ib" data-a="jump" data-d="1" aria-label="Sljedeća vježba">'+I.next+'</button></div>'+
    '<div class="cinema-secondary">'+(!recorded&&v.st.kind!=='work'?'<button type="button" class="txtbtn" data-a="cinemaPrep">'+
    WorkoutView.icon('timer')+'Vrijeme za pripremu</button>':'')+cinemaRedoButton('Ponovi seriju')+'</div></div>';
}
function cinemaUpcomingHtml(step,parts){
  if(!step)return '';
  if(step.kind==='rest'||step.kind==='switch'){
    const label=step.kind==='rest'?'Odmor':'Promjena strane';
    return '<div class="cinema-next" data-next-kind="'+step.kind+'"><span class="cinema-next-phase" aria-hidden="true">'+WorkoutView.icon('timer')+
      '</span><span><small>Slijedi</small><strong>'+label+'</strong></span><strong class="cinema-next-duration">'+fmt(step.dur)+'</strong></div>';
  }
  const item=step.it||P.items[step.g],e=S.ex[item.exId],dose=PlayerDose.at(item,step.set);
  const side=PlayerDose.splitSide(step)?step.side:'',quantity=item.measure==='time'?dose.sec+' s':dose.reps+' pon.';
  return '<div class="cinema-next" data-next-kind="exercise" data-next-ex="'+esc(item.exId)+'"><span class="workout-thumb">'+(e?thumbHtml(e):'')+
    '</span><span><small>Slijedi · '+esc(parts[step.g])+'</small><strong>'+esc(e?.name||'Vježba')+'</strong><small>'+
    esc(step.set+' / '+item.sets+' serija · '+(side?side+' · ':'')+quantity+(dose.kg?' · '+fmtKg(dose.kg):''))+
    '</small></span><button type="button" class="ib" data-a="playDoseEdit" data-j="'+step.g+'" aria-label="Uredi sljedeću seriju">'+I.plus+'</button></div>';
}
function workoutCinemaHtml() {
  const v=curView(),state=cinemaState(v),active=state.active;
  const step=cinemaDisplayStep(v.st);
  const item=step.it||P.items[active],dose=step===v.st&&cinemaRecordedStep()?PlayerDose.recordedAt(step,item):PlayerDose.at(item,step.set||1),e=S.ex[item?.exId]||v.e;
  const progress=Math.max(0,Math.min(1,(P.i+(v.st.dur?1-remaining()/v.st.dur:0))/P.steps.length));
  const parts=CinemaModel.sections(P.items,S.ex),timed=item.measure==='time',recorded=cinemaRecordedStep();
  const elapsed=SessionClock.update(P.clock,Date.now(),!!P.paused)?.seconds||0;
  const topbar='<div class="cinema-session"><strong id="cinema-elapsed">'+fmt(elapsed)+'</strong><span> · <b id="cinema-percent">'+Math.round(progress*100)+'%</b></span></div><button type="button" class="ib" data-a="cinemaMenu" aria-label="Mogućnosti treninga">'+WorkoutView.icon('ellipsis')+'</button>';
  const progressHtml='<div class="prog cinema-segments" style="--cinema-segments:'+Math.max(1,P.items.length)+'" role="progressbar" aria-label="Tijek plana treninga" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+Math.round(progress*100)+'"><i id="progbar" style="width:'+progress*100+'%"></i></div>';
  const metrics=cinemaMetricHtml(timed?'sec':'reps',step,item,dose)+cinemaClockHtml(v.st,recorded)+cinemaMetricHtml('kg',step,item,dose);
  const editingPrep=S.sheet?.kind==='cinemaPrep',preStart=['prep','ready'].includes(v.st.kind),preparing=editingPrep||preStart;
  const next=!editingPrep&&!recorded?cinemaUpcomingHtml(CinemaModel.upcoming(P),parts):'';
  const pause=P.paused&&!S.sheet, setLabel='Serija '+(step.set||1)+' od '+item.sets, name=e?.name||P.title;
  const side=v.st.kind==='switch'||PlayerDose.splitSide(v.st)?v.st.side:'';
  const journal=cinemaFooter(v,step,item,name,preparing);
  const reserveAt=!editingPrep&&!pause&&v.st.kind==='rest'?cinemaReserveSteps():[];
  return WorkoutView.cinema({phase:v.st.kind==='rest'?'rest':['prep','ready','switch'].includes(v.st.kind)?'ready':'work',paused:P.paused&&!editingPrep,exerciseId:item.exId,name,
    subtitle:preparing?setLabel:parts[active]+' · '+setLabel+(side?' · '+side:''),prepQuantity:preparing?(timed?dose.sec+' s':dose.reps+'×'):'',
    mediaHtml:cinemaMediaHtml(e),topbarHtml:topbar,progressHtml,infoHtml:'<button type="button" class="ib" data-a="workoutInfo" data-j="'+active+'" aria-label="Upute za '+esc(e?.name||'vježbu')+'">'+I.info+'</button>',
    metricsHtml:preparing?'':metrics,restAdjustHtml:!editingPrep&&v.st.kind==='rest'?'<button type="button" data-a="cinemaRest" data-d="-15" aria-label="Skrati odmor za 15 sekundi">−</button><span>Odmor</span><button type="button" data-a="cinemaRest" data-d="15" aria-label="Produlji odmor za 15 sekundi">+</button>':'',
    nextHtml:next,prepHtml:editingPrep||preStart&&!S.sheet?cinemaPrepHtml(v.st,editingPrep):'',pauseHtml:pause?cinemaPauseHtml(recorded):'',journalHtml:journal,
    reserveHtml:reserveAt.map(k=>rirRowHtml(k,reserveAt.length>1||P.steps[k].g!==active)).join('')});
}
function cinemaJournalTotals({reps, volume, seconds}) {
  return reps+' pon. · '+Math.round(volume)+' kg × pon.'+(seconds?' · '+fmt(seconds)+' rada':'');
}
function workoutJournalHtml() {
  const c=workoutContext({live:true}),v=curView(),state=cinemaState(v),sections=CinemaModel.sections(c.items,S.ex),stats=CinemaModel.summary(P,PlayerDose);
  const blocks=c.items.map((item,j)=>{
    const e=S.ex[item.exId],s={kind:'workoutExercise',j,live:true,base:mtCanon(P.items)},open=state.all||state.group===j;
    const section=j===0||sections[j]!==sections[j-1]?'<header class="cinema-block-heading"><h2>'+esc(sections[j])+'</h2><button type="button" class="ib" data-a="cinemaBlock" data-j="'+j+'" aria-label="Prijeđi na dio '+esc(sections[j])+'">'+I.next+'</button></header>':'';
    const chips=PlayerDose.checklist(item,P,j).map(row=>'<span data-state="'+row.state+'">'+(row.state==='done'?'✓':row.set)+'</span>').join('');
    const remove=P.ref?.kind==='protocol'&&P.items.length>1
      ? '<button type="button" class="txtbtn cinema-remove-exercise" data-a="cinemaRemoveExercise" data-j="'+j+'" aria-label="Ukloni vježbu · '+esc(e?.name||'vježba')+'">'+I.close+'Ukloni vježbu</button>' : '';
    return section+'<div class="workout-player-exercise'+(open?'':' is-collapsed')+'" data-current="'+(j===state.active)+'" data-expanded="'+open+'">'+WorkoutView.journalExercise({index:j,name:e?.name||'Obrisana vježba',thumbHtml:e?thumbHtml(e):'',infoHtml:'<button type="button" class="ib" data-a="cinemaJournalGroup" data-j="'+j+'" aria-expanded="'+open+'" aria-label="'+(open?'Sažmi':'Prikaži serije')+' · '+esc(e?.name||'vježba')+'">'+WorkoutView.icon(open?'chevron-up':'chevron-down')+'</button>',previousHtml:workoutPreviousCompact(item),toolsHtml:workoutToolbarHtml(s,c)+'<div class="cinema-extra-tools"><button type="button" data-a="playDoseEdit" data-j="'+j+'">'+WorkoutView.icon('pencil')+'Uredi serije</button><button type="button" data-a="cinemaNotes" data-j="'+j+'">'+WorkoutView.icon('notebook-pen')+'Bilješke</button><button type="button" data-a="cinemaGoSet" data-j="'+j+'">'+I.next+'Prijeđi na vježbu</button></div>',targetHtml:[workoutTargetHtml(item),item.rest?'<span class="workout-rest">Odmor '+esc(item.rest)+' s</span>':''].filter(Boolean).join(''),rowsHtml:workoutTableHtml(c,j,s)+remove})+'<button type="button" class="cinema-collapsed-sets" data-a="cinemaJournalGroup" data-j="'+j+'" aria-label="Prikaži sve serije">'+chips+'</button></div>';
  }).join('');
  const add=P.ref?.kind==='protocol'?'<button type="button" class="txtbtn cinema-add-exercise" data-a="cinemaAddExercise">'+I.plus+'Dodaj vježbu</button>':'';
  return '<div class="view workout-journal workout-player-focus cinema-journal'+(state.all?' show-all':'')+'"><div class="cinema-journal-heading"><h1>Dnevnik</h1><div class="cinema-journal-actions">'+add+'<button type="button" class="txtbtn" data-a="workoutShowAll" aria-expanded="'+state.all+'">'+(state.all?'Sažmi vježbe':'Prikaži sve serije')+'</button></div></div><div class="workout-journal-blocks">'+blocks+'<section class="cinema-finish"><div><h2>Završi trening</h2><p>Pregledaj rezultate prije spremanja.</p></div><button type="button" class="btn sec" data-a="cinemaFinish">Pregled '+I.next+'</button></section></div><footer class="cinema-journal-footer"><span><strong>'+stats.percent+'% odrađenih serija</strong><small>'+cinemaJournalTotals(stats)+'</small></span><button type="button" class="ib" data-a="cinemaJournalClose" aria-label="Natrag u player">'+I.close+'</button></footer></div>';
}
function cinemaExerciseChoices(query) {
  const words=libSearchText(query).split(/\s+/).filter(Boolean);
  const exercises=Object.values(S.ex).filter(e=>{
    const text=libSearchText([e.name,e.alt,e.cat,e.equipment,...exEquip(e)].join(' '));
    return words.every(word=>text.includes(word));
  }).sort((a,b)=>a.name.localeCompare(b.name,'hr'));
  return exercises.map(e=>'<button type="button" class="row" data-a="cinemaExercisePick" data-id="'+esc(e.id)+'"><span class="thumb">'+thumbHtml(e)+'</span><span class="tx"><b>'+esc(e.name)+'</b><small>'+esc(exMeta(e))+'</small></span>'+I.plus+'</button>').join('')||'<p>Nema vježbe za taj pojam.</p>';
}
function cinemaAddExerciseHtml(s) {
  const cancel='<button type="button" class="btn sec" data-a="cinemaClose">Odustani</button>';
  if(s.item) {
    const load=s.load;
    return '<h3>'+esc(load.name)+'</h3><p>Unesi težinu za ovu izvedbu. Vježba se dodaje na kraj trenutnog treninga.</p>'+
      '<form id="cinema-add-exercise-form" novalidate><label class="sl-row"><span>'+esc(StartingLoad.labels[load.kind])+
      (load.kind==='lm'?' · 0 za praznu šipku':'')+'</span><input name="kg" type="text" inputmode="decimal" autocomplete="off" value="'+esc(s.kg||'')+'" placeholder="kg"></label>'+
      '<p class="sl-error" id="cinema-add-exercise-error" role="alert">'+esc(s.error||'')+'</p><button type="submit" class="btn">Dodaj vježbu</button></form>'+
      '<button type="button" class="btn sec" data-a="cinemaExerciseBack">Natrag na popis</button>';
  }
  return '<h3>Dodaj vježbu</h3><p>Vježba će se dodati na kraj trenutnog treninga.</p>'+
    '<div class="search">'+I.search+'<input id="cinema-exercise-search" class="input" type="search" placeholder="Traži vježbu" aria-label="Traži vježbu" autocomplete="off" value="'+esc(s.query||'')+'"></div>'+
    '<div id="cinema-exercise-choices" class="workout-alternatives cinema-exercise-choices">'+cinemaExerciseChoices(s.query)+'</div>'+cancel;
}
function cinemaCanEditExercises(){return P?.mode==='ex'&&!P.done&&P.ref?.kind==='protocol';}
function cinemaRemoveBlocked(j){
  return P.steps.some((step,index)=>step.g===j&&isWork(step)&&P.doneSteps[index]);
}
function cinemaCommitExercises(s, added) {
  if(!cinemaCanEditExercises())return;
  const c=workoutContext({live:true});
  if(!workoutValid(s,c)){toast('Podaci su promijenjeni. Ponovno otvori dnevnik.',true);return;}
  const before=P,items=P.items.slice(),liveBaseItems=c.source.slice(),j=s.j;
  let timeline,dropCurrent=false;
  if(added){
    const item=PlayerDose.items([added])[0];
    items.push(item);liveBaseItems.push(item);
    timeline=PlayerDose.rebuild(P,items,liveStepsFromItems);
  }else{
    if(!items[j]||items.length<=1||cinemaRemoveBlocked(j))return;
    const [removed]=items.splice(j,1);
    liveBaseItems.splice(j,1);
    if(removed.section&&items[j]&&!items[j].section)items[j]={...items[j],section:removed.section};
    ({timeline,dropCurrent}=PlayerDose.removeExercise(P,j,items,liveStepsFromItems));
  }
  if(timeline.steps.length>PlayerDose.maxScheduleSteps(timeline.items.length)){toast('Dosegnut je najveći broj koraka u treningu.',true);return;}
  P={...P,...timeline,liveBaseItems,sessionOnly:true};
  if(!added){
    const remap=map=>Object.fromEntries(Object.entries(map).filter(([key])=>Number(key)!==j).map(([key,value])=>[Number(key)>j?Number(key)-1:key,value]));
    for(const field of ['notes','swapUndo','answers','auto','lastReps'])if(P[field])P[field]=remap(P[field]);
  }
  const next=dropCurrent?positionStep(P.i):null;
  if(next&&P.dosePause)P.dosePause={...P.dosePause,left:P.left};
  if(!P.steps[P.i])prepareFinish();
  if(!savePlay()){P=before;toast('Promjena nije spremljena. Pokušaj ponovno.',true);return;}
  if(!added){
    const prefix='live:'+P.startedAt+':';
    S.workoutRaw=Object.fromEntries(Object.entries(S.workoutRaw||{}).flatMap(([key,value])=>{
      if(!key.startsWith(prefix))return [[key,value]];
      const [group,...suffix]=key.slice(prefix.length).split(':');
      if(Number(group)===j)return [];
      return [[Number(group)>j?prefix+(Number(group)-1)+':'+suffix.join(':'):key,value]];
    }));
    S.playerJournal=null;
  }
  if(P.done){delete P.dosePause;S.sheet=null;presentFinish();return;}
  cinemaCloseSheet();
  toast(added?'Vježba je dodana na kraj treninga.':'Vježba je uklonjena iz ovog treninga.');
}
function cinemaOpenSheet(sheet){
  if(!P||P.done||P.mode!=='ex')return;
  if(S.sheet?.kind==='cinemaJournal')sheet.returnCinema=true;
  if(P.dosePause){S.sheet=sheet;render();}else openPlayDoseSheet(sheet);
}
function cinemaReleaseTransport(){
  if (!['cinemaMenu','cinemaPlayback'].includes(S.sheet?.kind) || !P.dosePause) return;
  const pause=P.dosePause;
  delete P.dosePause;
  S.sheet=null;
  P.paused=pause.wasPaused;
  P.left=pause.left;
  P.endAt=Date.now()+pause.left*1000;
}
function cinemaCloseSheet(){
  if(S.sheet?.returnCinema){S.sheet={kind:'cinemaJournal'};render();return;}
  if(S.sheet?.returnCinemaMenu){S.sheet={kind:'cinemaMenu'};render();return;}
  if(P?.dosePause){playDoseResumeEditing();return;}
  S.sheet=null;render();
}
function cinemaJump(j){
  if(!P||P.done)return;
  const k=P.steps.findIndex(st=>isWork(st)&&st.g===j);if(k<0)return;
  delete P.dosePause;S.sheet=null;P.paused=false;P.sheetPause=false;enterStep(landAt(k));savePlay();render();
}
function cinemaPause(){
  if(!P||P.done)return;
  const before={...P};P={...P,left:remaining(),paused:!P.paused,sheetPause:false};
  if(!P.paused)P.endAt=Date.now()+P.left*1000;
  if(!savePlay()){P=before;toast('Pauza nije spremljena. Pokušaj ponovno.',true);return;}
  if(!P.paused)keepAwake(true);render();
}
function cinemaReplay(){
  if(!P?.paused||S.sheet||cinemaRecordedStep())return;
  const before=P;P={...P};positionStep(P.i);
  if(!savePlay()){P=before;toast('Ponavljanje nije spremljeno. Pokušaj ponovno.',true);return;}
  const video=app.querySelector('.workout-cinema-media video');
  if(video)video.currentTime=0;
  render();
}

const WORKOUT_SWAP_FILTERS = [
  { key:'muscle', label:'Ciljani mišić', all:'Svi ciljani mišići', values:c=>c.primary },
  { key:'equipment', label:'Oprema', all:'Sva oprema', values:c=>c.equipment },
  { key:'pattern', label:'Obrazac pokreta', all:'Svi obrasci pokreta', values:c=>c.pattern?[c.pattern]:[] }
];
const WORKOUT_SWAP_PATTERNS = {
  L1:'Donji dio · obje noge', L2:'Donji dio · jedna noga', HJ:'Pregib u kuku', U1:'Gornji dio · višezglobno',
  S:'Gornji dio · izolacija', C:'Trup i stabilnost', B:'Balistički pokret', P:'Skokovi', R:'Trčanje', A:'Aktivacija', K:'Nošenje'
};
function workoutSwapLabel(key,value) {
  if(key==='muscle')return MuscleWork.groups.find(group=>group.id===value)?.label||value;
  if(key==='pattern'&&Object.hasOwn(WORKOUT_SWAP_PATTERNS,value))return WORKOUT_SWAP_PATTERNS[value];
  return value;
}
function workoutSwapState(item) {
  const primary=MuscleWork.profile(S.ex[item.exId],item.exId).primary, candidates=workoutCandidates(item);
  const direct=workoutEquipmentVariants(item,candidates);
  const exact=candidates.filter(candidate=>candidate.primary.length===primary.length&&candidate.primary.every(group=>primary.includes(group))&&
    !!S.ex[candidate.id].sides===!!item.sides);
  const recommended=new Set([...new Set(direct.concat(exact).map(candidate=>candidate.id))].slice(0,3));
  return {primary,candidates,recommended,filters:{},query:''};
}
function workoutSwapMatches(swap) {
  const words=norm(swap.query).trim().split(/\s+/).filter(Boolean);
  return swap.candidates.filter(candidate=>{
    if(!S.ex[candidate.id])return false;
    if(WORKOUT_SWAP_FILTERS.some(filter=>swap.filters[filter.key]&&!filter.values(candidate).includes(swap.filters[filter.key])))return false;
    if(!words.length)return true;
    const terms=[candidate.name,exAlt(S.ex[candidate.id]),...candidate.equipment,
      ...candidate.primary.map(group=>workoutSwapLabel('muscle',group)),workoutSwapLabel('pattern',candidate.pattern)];
    const haystack=norm(terms.join(' '));
    return words.every(word=>haystack.includes(word));
  });
}
function workoutSwapFilter(swap,filter) {
  const value=swap.filters[filter.key]||'';
  const options=[...new Set(swap.candidates.flatMap(filter.values))].map(key=>({key,label:workoutSwapLabel(filter.key,key)}))
    .sort((a,b)=>a.label.localeCompare(b.label,'hr'));
  return '<label class="workout-swap-filter" data-active="'+!!value+'"><span>'+esc(value?workoutSwapLabel(filter.key,value):filter.label)+'</span>'+
    WorkoutView.icon('chevron-down')+'<select id="workout-'+filter.key+'" data-swap-filter="'+filter.key+'" aria-label="'+filter.label+'">'+
    '<option value="">'+filter.all+'</option>'+options.map(option=>'<option value="'+esc(option.key)+'"'+(value===option.key?' selected':'')+'>'+esc(option.label)+'</option>').join('')+'</select></label>';
}
function workoutSwapAction(candidate) {
  return '<button type="button" class="workout-swap-action" data-a="workoutCandidate" data-id="'+esc(candidate.id)+'" aria-label="'+esc('Zamijeni za '+candidate.name)+'">'+WorkoutView.icon('shuffle')+'</button>';
}
function workoutSwapPreviewButton(e,hero=false) {
  const video=mediaList(e).some(media=>media.type==='video');
  return '<button type="button" class="workout-swap-photo'+(hero?' is-current':'')+'" data-a="workoutSwapPreview" data-id="'+esc(e.id)+'" aria-label="'+esc('Pregled: '+e.name)+'">'+
    thumbHtml(e)+(hero?'<span class="workout-swap-current">Trenutna</span>':'')+
    '<span class="workout-swap-preview-icon">'+WorkoutView.icon(video?'play':'info')+'</span></button>';
}
function workoutSwapResults(swap) {
  const matches=workoutSwapMatches(swap),recommended=matches.filter(candidate=>swap.recommended.has(candidate.id));
  const similar=matches.filter(candidate=>!swap.recommended.has(candidate.id));
  const row=(candidate,preferred)=>'<li class="workout-swap-row">'+workoutSwapPreviewButton(S.ex[candidate.id])+
    '<div class="workout-swap-description">'+(preferred?'<span>Preporuka</span>':'')+'<strong>'+esc(candidate.name)+'</strong><small>'+
    esc(candidate.equipment.join(' · ')||'Oprema nije navedena')+'</small></div>'+workoutSwapAction(candidate)+'</li>';
  if(!matches.length)return '<div class="workout-swap-empty"><h4>Nema odgovarajuće zamjene</h4><p>'+
    (swap.candidates.length?'Pokušaj s drugim pojmom ili promijeni filtre.':'Za ovu vježbu nema zamjene s odgovarajućim pokretom i ciljanim mišićima.')+'</p></div>';
  return (recommended.length?'<section class="workout-swap-section"><h4>Preporuke</h4><ul class="workout-swap-recommended">'+
    recommended.map(candidate=>row(candidate,true)).join('')+'</ul></section>':'')+
    (similar.length?'<section class="workout-swap-section"><h4>Slični pokreti</h4><p>'+esc(swap.primary.map(group=>workoutSwapLabel('muscle',group)).join(' · '))+
    '</p><ul>'+similar.map(candidate=>row(candidate,false)).join('')+'</ul></section>':'');
}
function workoutSwapRefresh(s) {
  const results=document.getElementById('workout-swap-results');
  if(!results||s?.kind!=='workoutSwap'||!s.swap)return;
  const hero=results.parentElement.querySelector('.workout-swap-hero');
  if(hero)hero.hidden=!!s.swap.query.trim();
  results.innerHTML=workoutSwapResults(s.swap);
  if(s.swap.query.trim())results.parentElement.scrollTop=0;
}
function workoutSwapPreviewHtml(swap,e) {
  const media=mediaList(e),m=media.find(value=>value.type==='video')||media[0];
  const candidate=swap.candidates.find(value=>value.id===e.id);
  const picture=!m?'':m.type==='video'?'<video src="'+esc(m.src)+'"'+(m.poster?' poster="'+esc(m.poster)+'"':'')+
    ' controls muted playsinline preload="metadata" tabindex="0"></video>':'<img alt="'+esc(e.name+(m.two?': početni i završni položaj':''))+'" src="'+esc(m.src)+'">';
  const steps=Array.isArray(e.steps)?e.steps:[];
  return '<div class="workout-swap-body workout-swap-preview"><h4>'+esc(e.name)+'</h4><p>'+esc(exEquip(e).join(' · '))+'</p>'+
    (picture?'<div class="workout-swap-demo">'+picture+'</div>':'<p>Nema fotografije ili snimke za ovu vježbu.</p>')+
    (m?.credit?'<p>'+esc(m.credit)+'</p>':'')+
    (steps.length?'<ol>'+steps.map(step=>'<li>'+esc(step)+'</li>').join('')+'</ol>':'')+'</div>'+
    (candidate?'<footer class="workout-swap-footer"><button type="button" class="btn" data-a="workoutCandidate" data-id="'+esc(e.id)+'">'+
      WorkoutView.icon('shuffle')+'Zamijeni ovom vježbom</button></footer>':'');
}
function workoutSwapHtml(s) {
  const item=workoutContext(s)?.items[s.j],e=item&&S.ex[item.exId],swap=s.swap;
  const preview=swap?.preview&&S.ex[swap.preview];
  const header='<header class="workout-swap-heading"><h3 id="sheet-h" tabindex="-1">'+WorkoutView.icon(preview?'info':'shuffle')+
    (preview?'Pregled vježbe':'Zamijeni vježbu')+'</h3>'+
    (preview?'<button type="button" class="ib" data-a="workoutSwapBack" aria-label="Natrag na zamjene">'+WorkoutView.icon('chevron-left')+'</button>':'')+'</header>';
  if(!e||!swap)return header+'<div class="workout-swap-body"><p>Vježba nije dostupna.</p></div>';
  if(preview)return header+workoutSwapPreviewHtml(swap,preview);
  const meta=swap.primary.map(group=>workoutSwapLabel('muscle',group)).concat(exEquip(e)).join(' · ');
  return header+'<div class="workout-swap-filters" role="group" aria-label="Filtri zamjena">'+
    WORKOUT_SWAP_FILTERS.map(filter=>workoutSwapFilter(swap,filter)).join('')+'</div>'+
    '<div class="workout-swap-body"><div class="workout-swap-hero"'+(swap.query.trim()?' hidden':'')+'>'+workoutSwapPreviewButton(e,true)+'<h4>'+esc(e.name)+'</h4><p>'+esc(meta)+'</p></div>'+
    (s.error?'<p class="play-dose-error" role="alert">'+esc(s.error)+'</p>':'')+'<div id="workout-swap-results" aria-live="polite">'+workoutSwapResults(swap)+'</div></div>'+
    '<footer class="workout-swap-footer"><label class="workout-swap-search">'+I.search+'<input id="workout-swap-search" type="search" autocomplete="off" placeholder="Traži vježbu" aria-label="Pretraži zamjene" value="'+esc(swap.query)+'"></label></footer>';
}
function workoutOpenPanel(panel,d={}) {
  const s=workoutState(Number(d.j)||0),c=workoutContext(s);if(!c)return;
  s.panel=panel;delete s.equipmentMenu;
  if(c.live){s.returnCinemaPlayer=!S.sheet;cinemaOpenSheet(s);}else{S.sheet=s;render();}
}
function workoutClose() {
  const s=S.sheet;
  if(s?.kind==='workoutSwap'&&s.swap?.preview){A.workoutSwapBack();return;}
  if(s?.pendingReplacement){s.error='Unesi težinu nove varijante ili vrati prethodnu vježbu.';render();return;}
  if(s?.returnCinema){S.sheet={kind:'cinemaJournal'};render();return;}
  if(s?.returnCinemaPlayer){playDoseResumeEditing();return;}
  if(s?.panel){delete s.panel;render();return;}
  if(s?.pendingReplacement){s.error='Unesi težinu nove varijante ili vrati prethodnu vježbu.';render();return;}
  if(P?.dosePause){playDoseResumeEditing();return;}
  S.sheet=null;render();
}

// The third library card previews the dose that the Play button starts.
const EX_CARDS = ['upute', 'cilj', 'dose'];
function exCardsHtml(e,t){
  const steps = e.steps || [], a = (href, t, ti) => '<a href="'+esc(href)+'" target="_blank" rel="noopener"'+(ti ? ' title="'+esc(ti)+'"' : '')+'>'+esc(t)+' ↗</a>';
  const lb = t => '<span class="lb">'+t+'</span>';
  const cues = steps.length ? '<div class="cues">' + steps.map(s => '<div class="bul">'+esc(s)+'</div>').join('') + '</div>' : '<p class="none">Dodaj upute u uređivanju.</p>';
  const vids = !SHOW_SOURCES ? '' : (e.video ? a(e.video, 'Pogledaj demonstraciju', e.videoTitle) : '') + (packVideo(e) ? a(packVideo(e), 'Pogledaj kod TAE') : '');
  const card = (k, i, title, body, head) => '<article class="swc" id="swc-'+k+'" data-card="'+k+'" aria-label="'+title+', '+(i + 1)+' od 3">'+(head ? '<div class="swh">'+head+'</div>' : '')+'<div class="swb">'+body+'</div></article>';
  const c1 = (e.feel ? '<div class="sec">' + lb('Podražaj') + '<p class="pz">'+esc(e.feel)+'</p></div>' : '') + '<div class="sec">' + lb('Upute') + cues + '</div>' + (vids ? '<p class="exvid">' + vids + '</p>' : '');
  const m = exMuscles(e), fig = m.prime.length + m.sec.length ? bodyFig(m, { size: 168, cls: 'exfig' }) : '';
  const chips = m.prime.length ? m.prime : m.sec;   // own exercises from their zones may have only secondary muscles
  const c2 = (chips.length ? '<div class="tgt"><div class="tl">' + lb('Ciljana područja') + '<div class="tcol">' + chips.map(r => '<span class="tag">'+esc(muscleLabel(r))+'</span>').join('') + '</div></div>' +
      (fig ? '<div class="tf" role="img" aria-label="Mišići na tijelu: ' + esc(m.prime.concat(m.sec).map(muscleLabel).join(', ')) + '">' + fig + '</div>' : '') + '</div>' : '') +
    (e.note ? '<div class="sec">' + lb('Zašto') + '<p class="cn">'+esc(e.note)+'</p></div>' : (chips.length ? '' : '<p class="none">Dodaj objašnjenje u uređivanju.</p>')) +
    (SHOW_SOURCES && e.source ? '<p class="src">Izvor: '+a(e.source, e.sourceTitle || 'Otvori izvor')+'</p>' : '');
  const c3 = checklistHtml(viewDoseItems(t),null,true);
  return '<section class="exswipe" aria-label="O vježbi"><div class="swrow" id="swrow">' + card('upute',0,'Upute',c1) + card('cilj',1,'Cilj',c2) + card('dose',2,'Doziranje',c3,lb('Doziranje')) + '</div>'+
    '<div class="dots swdots" id="swdots">'+['Upute','Cilj','Doziranje'].map((title,i)=>'<button class="dot" data-a="swGo" data-i="'+i+'" aria-label="'+title+'" aria-current="'+(EX_CARDS[i]===S.exTab)+'"><i></i></button>').join('')+'</div></section>';
}
// the scroll position of each card (the row is rebuilt on every render)
const swPos = (r, i) => { const c = r.children[i]; return c ? Math.min(c.offsetLeft - r.firstElementChild.offsetLeft, r.scrollWidth - r.clientWidth) : 0; };
const swIdx = r => { let b = 0; for (let i = 1; i < r.children.length; i++) if (Math.abs(r.scrollLeft - swPos(r, i)) < Math.abs(r.scrollLeft - swPos(r, b))) b = i; return b; };
let swMem = { id: null, tops: [] };
VIEWS.ex = function(t){
  const item=viewDoseItems(t)[0],e=item&&S.ex[item.exId];
  if(!e)return '<div class="view gut">'+topbar(backBtn())+'<p class="empty">Ova vježba više nije u knjižnici.</p></div>';
  const state={kind:'workoutExercise',j:0,live:false,base:mtCanon(viewDoseSource(t))},c=workoutContext(state);
  return WorkoutView.exercisePage({topbarHtml:topbar('<button class="ib" data-a="back" aria-label="Natrag">'+WorkoutView.icon('chevron-left')+'</button>','','MOJ TRENING'),mediaHtml:mediaHtml(e),infoHtml:'<button class="ib" data-a="workoutInfo" data-j="0" aria-label="Upute za '+esc(e.name)+'">'+WorkoutView.icon('info')+'</button>',name:e.name,eyebrow:'Plan serija',previousHtml:workoutPreviousCompact(item),toolsHtml:workoutToolbarHtml(state,c),targetHtml:workoutPrescriptionHtml(state,c),rowsHtml:workoutTableHtml(c,0,state)+workoutAddSetHtml(state,c),footerHtml:'<div class="footer gut"><button class="btn" data-a="playEx" data-id="'+esc(t.id)+'">'+WorkoutView.icon('play')+'Pokreni vježbu</button><div class="workout-library-secondary"><button class="txtbtn" data-a="fav" data-id="'+esc(e.id)+'" aria-label="Favorit" aria-pressed="'+!!e.fav+'">'+(e.fav?I.heartF:I.heart)+'Favorit</button><button class="txtbtn" data-a="editEx" data-id="'+esc(e.id)+'" aria-label="Uredi vježbu">'+I.edit+'Uredi</button><button class="txtbtn" data-a="addTo" data-id="'+esc(e.id)+'">Dodaj u protokol</button></div></div>'}).replace('class="view workout-exercise-page"','class="view workout-exercise-page" data-context="library"');
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
const draftSig = d => JSON.stringify(d, (k, v) => (k.charAt(0) === '_' && !(['_sectionCustom','_sectionName'].includes(k) && String(d?._sectionName||'').trim())) || (k === 'days' && Array.isArray(v) && !v.length) ? undefined : v);
// the dose of a protocol item; when you change it by hand its "sessions in a row" start again
const doseSig = it => JSON.stringify([it.measure || 'sets', it.sets || 1, it.reps || 10, it.repsList || null, it.sec || 30, it.secList || null, it.kg || 0, it.kgList || null, !!it.startingKgKnown, !!it.sides]);
const PROG_STATE = ['ok', 'fail', 'snoozeOk', 'prev', 'up', 'easy'];
// a video still reading its file is stopped first, so releasing the file's address is never an error
const unload = root => (root || document).querySelectorAll('video').forEach(v => { try { v.pause(); v.removeAttribute('src'); v.load(); } catch(e){} });
// your own photo or video that nothing uses any more
function dropMedia(id){ if (!id || Object.values(S.ex).some(e=>e.media===id)) return; IDB.del(id).catch(() => {}); const u = MEDIA[id]; if (!u) return; delete MEDIA[id];
  document.querySelectorAll('video').forEach(v => { if ((v.getAttribute('src') || '').indexOf(u) === 0) unload(v.parentNode); });
  setTimeout(() => URL.revokeObjectURL(u), 1500); }
function dropDraftMedia(){ const d = S.draft; if (d && d.media && !Object.values(S.ex).some(e=>e.media===d.media)) dropMedia(d.media); }
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
      musclePickerHtml(d) + muscleCountingEditor(d) +
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

// 1.8: "Ciljana područja" in the editor: tap a region on the figure (first tap: main, second: secondary, third: off); the zones
// follow (musclesZones), 'Kuk' and 'Cijelo tijelo' stay chips of their own. Until you tap, an exercise without muscles keeps its
// zones as they are and the figure shows them.
function musclePickerHtml(d){
  const m = exMuscles(d), zs = d.zones || [], fig = bodyFig(m, { act: 'dmus', size: 300, cls: 'pickfig' });
  return '<div class="field mpick"><span class="label" id="mpick-l">Ciljana područja</span>' +
    (fig ? '<div class="figs" role="group" aria-labelledby="mpick-l">' + fig + '<div class="figl"><span>Sprijeda</span><span>Straga</span></div></div>' +
      '<p class="lnote mleg"><i class="sw p"></i>glavni <i class="sw s"></i>pomoćni · dodirni mišić: glavni, pomoćni, ukloni</p>' : '') +
    '<div class="zch">' + (m.prime.length + m.sec.length ? muscleTags(m, 'dmusDrop') : '<span class="zhint">Nijedan mišić nije odabran.</span>') + '</div>' +
    '<div class="chips wrap" style="margin-top:10px">' + ZONE_ONLY.concat(fig ? [] : ZONES.filter(z => ZONE_ONLY.indexOf(z) === -1)).map(z => '<button class="tagbtn" data-a="dzone" data-v="'+esc(z)+'" aria-pressed="'+(zs.indexOf(z)!==-1)+'">'+esc(exZoneLabel(z))+'</button>').join('') + '</div>' +
    '<p class="lnote" style="margin:10px 2px 0" id="mzones">Zone u filteru i opterećenju: ' + (zs.length ? esc(zs.map(exZoneLabel).join(', ')) : 'nijedna') + '</p></div>';
}

function muscleCountingEditor(d) {
  const selected = typeof d.muscleWorkEligible === 'boolean' ? String(d.muscleWorkEligible) : 'auto';
  const profile = MuscleWork.profile(d);
  const options = [['auto','Po kategoriji'],['true','Uključi'],['false','Isključi']];
  const included = profile.eligibility === 'eligible';
  const mapped = profile.primary.length || profile.secondary.length;
  const note = included
    ? (mapped ? 'Radne serije ulaze u tjedni pregled prema odabranim glavnim i pomoćnim mišićima.' : 'Odaberi mišiće na figuri za raspodjelu serija. Do tada će rad biti označen kao neraspoređen.')
    : 'Ova vježba ostaje u dnevniku, a njezine se serije izostavljaju iz tjednog zbroja snage.';
  return '<div class="field"><span class="label">Računanje radnih serija</span><div class="chips wrap" role="group" aria-label="Računanje radnih serija">' +
    options.map(([value,label]) => '<button class="chip" data-a="muscleEligibility" data-v="' + value + '" aria-pressed="' +
      (value === selected) + '">' + label + '</button>').join('') + '</div><p class="lnote">' + note + '</p></div>';
}
// 1.8 (review): the zones change only by what the taps changed: a zone goes when its last region was taken off here, a region
// you added brings its zone, every other zone (the shipped joint zones Koljeno / Gležanj, Kuk, the order, zones[0]) stays;
// zones[0] moves only when its own main muscles were taken off the main ones. Tapped back to the muscles the editor opened with,
// the exercise gets its muscles and zones back exactly (a shipped one keeps its fingerprint and its updates).
function setDraftMuscles(dr, prime, sec){
  const b = dr._mz || (dr._mz = { raw: dr.muscles === undefined ? undefined : clone(dr.muscles), m: exMuscles(dr), z: (dr.zones || []).slice() });
  const zOf = a => a.reduce((s, r) => { const z = MUSCLE_ZONE[r]; if (z && s.indexOf(z) === -1) s.push(z); return s; }, []);
  const set = a => a.slice().sort().join();
  const only = (dr.zones || []).filter(z => ZONE_ONLY.indexOf(z) !== -1);
  if (set(prime) === set(b.m.prime) && set(sec) === set(b.m.sec)) {
    if (b.raw === undefined) delete dr.muscles; else dr.muscles = clone(b.raw);
    dr.zones = b.z.filter(z => ZONE_ONLY.indexOf(z) === -1 || only.indexOf(z) !== -1).concat(only.filter(z => b.z.indexOf(z) === -1)); return;
  }
  if (!prime.length && !sec.length) { dr.muscles = null; dr.zones = only; return; }
  const before = zOf(b.m.prime.concat(b.m.sec)), now = zOf(prime.concat(sec));
  const zs = (dr.zones || []).filter(z => ZONE_ONLY.indexOf(z) !== -1 || now.indexOf(z) !== -1 || before.indexOf(z) === -1);
  const had = b.m.prime.concat(b.m.sec);
  prime.concat(sec).forEach(r => { const z = MUSCLE_ZONE[r]; if (had.indexOf(r) === -1 && zs.indexOf(z) === -1) zs.push(z); });
  const p0 = zOf(prime), z0 = zs[0];
  if (z0 && ZONE_ONLY.indexOf(z0) === -1 && p0.length && p0.indexOf(z0) === -1 && zOf(b.m.prime).indexOf(z0) !== -1) { zs.splice(zs.indexOf(p0[0]), zs.indexOf(p0[0]) === -1 ? 0 : 1); zs.unshift(p0[0]); }
  dr.muscles = { prime, sec }; dr.zones = zs;
}
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
/* ---------- programmes: fixed weekly order of sessions, e.g. a purchased 6-week plan from your private pack ---------- */
function progSessions(g){ const out = []; (g.weeks || []).forEach(w => (w.sessions || []).forEach((x, k) => out.push({ week: w.week, k, label: x.label, short: w.week + '. tj. · ' + x.label, pr: x.pr }))); return out; }
// a programme can be done again: "Kreni ispočetka" keeps the moment from which its sessions count again
// (S.settings.progFrom, so it is in backups and survives a new import of the pack); the history stays as it is
const progFrom = g => +((S.settings.progFrom || {})[g.id]) || 0;
function progStatus(g){
  const all = progSessions(g), doneIds = Object.create(null), from = progFrom(g);
  S.log.forEach(l => { if (l.kind === 'protocol' && l.refId && l.at >= from && l.at <= Date.now()) doneIds[l.refId] = (doneIds[l.refId] || 0) + 1; });
  const items = all.map(x => {
    const done = doneIds[x.pr] > 0;
    if (done) doneIds[x.pr]--;
    return { ...x, done };
  });
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
  let occurrence = 0;
  return '<div class="view gut">' + topbar(backBtn()) +
    '<h1 class="h1">' + esc(g.name) + '</h1>' + (g.desc ? '<p class="sub" style="margin-right:17px;line-height:20px">' + esc(g.desc) + '</p>' : '') +
    '<div class="progtop"><svg viewBox="0 0 72 72" width="72" height="72"><circle cx="36" cy="36" r="30" fill="none" stroke="var(--track)" stroke-width="6"/>' + (st.done ? '<circle cx="36" cy="36" r="30" fill="none" stroke="var(--accent)" stroke-width="6" stroke-linecap="round" stroke-dasharray="'+(C*pct).toFixed(1)+' '+C.toFixed(1)+'" transform="rotate(-90 36 36)"/>' : '') + '</svg>' +
      '<div><b>' + st.done + ' od ' + st.total + '</b><span>' + (st.next ? 'Sljedeće: ' + esc(st.next.short) : gone ? 'Nema više treninga: ' + gone + ' ' + plural(gone, 'trening programa je obrisan', 'treninga programa su obrisana', 'treninga programa je obrisano') + '.' : 'Program je završen. Bravo!') + (st.from ? ' · ispočetka od ' + esc(shortDate(st.from)) : '') + '</span></div></div>' +
    '<div class="pgrid" style="grid-template-columns:44px repeat('+cols+',1fr)">' + (g.weeks || []).map(w => '<span class="pw">' + esc(w.week) + '. tj.</span>' + (w.sessions || []).map(x => {
      const it = st.items[occurrence++]; const cls = it.done ? 'done' : st.next === it ? 'next' : '';
      return '<button class="pcell ' + cls + '" data-a="openPr" data-id="'+esc(x.pr)+'" aria-label="'+esc(w.week + '. tjedan, ' + x.label + (it.done ? ', odrađeno' : ''))+'">'+esc(x.label)+'</button>'; }).join('')).join('') + '</div>' +
    progTestsHtml(g) +
    ((g.notes || []).length ? '<h2 class="h2">Kako ga raditi</h2><div class="stack" style="gap:8px;margin:12px 17px 0">' + g.notes.map(n => '<div class="bul">'+esc(n)+'</div>').join('') + '</div>' : '') +
    '<div style="margin:18px 0 0">' + daysPicker('progDays', g.id, g.days) + '<p class="sub" style="margin-right:17px;line-height:19px">Na svaki odabrani dan tjedni plan ti nudi sljedeći trening programa.</p></div>' +   // week plan (K5)
    (SHOW_SOURCES && g.credit ? '<p class="sub" style="margin-top:16px">' + esc(g.credit) + '</p>' : '') +
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
function workoutOverviewEyebrow(items) {
  const muscles=new Set();
  items.forEach(item=>{const e=S.ex[item.exId];if(!e)return;const m=exMuscles(e);m.prime.concat(m.sec).forEach(id=>muscles.add(id));});
  const upper=UPPER_SET.some(id=>muscles.has(id)),lower=LEG_M.some(id=>muscles.has(id));
  return 'Moj trening'+(upper||lower?' · '+(upper&&lower?'Cijelo tijelo':lower?'Donji dio':'Gornji dio'):'');
}
function workoutOverviewMeta(p,items) {
  const minutes=protoMin({...p,items}),sets=items.reduce((n,item)=>n+(item.sets||1),0);
  return '<span>'+WorkoutView.icon('clock-3')+esc(minutes)+' min</span><span>'+WorkoutView.icon('dumbbell')+esc(nVj(items.length))+'</span><span>'+esc(sets+' '+plural(sets,'serija','serije','serija'))+'</span>';
}
function workoutOverviewHero(p,first) {
  const items=viewDoseItems(top(),p.items||[]),sections=CinemaModel.sections(items,S.ex);
  const main=items.find((it,j)=>S.ex[it.exId]?.cat==='Snaga'&&!/prep|priprem|zagrij/i.test(sections[j]))||first;
  const e=main&&S.ex[main.exId],m=e&&exMedia(e,true);
  // a two-panel cover is a centred 3:4 window (never cropped); the band behind it is the same picture, blurred, so the
  // cover reads full width like the exercise page below it
  const band=m&&m.two&&m.type==='image'?['<div class="hero-band" style="--cover:url(\''+esc(m.src)+'\')">','</div>']:['',''];
  return m?band[0]+'<div class="hero single'+(m.two?' two':'')+'">'+(m.type==='image'?'<img fetchpriority="high" alt="'+esc(e.name)+'" src="'+esc(m.src)+'"'+mediaFailAttr(e,64)+'>':videoTag(m))+'<span class="fade"></span>'+creditHtml(m)+'</div>'+band[1]:heroHtml(p,null);
}
function workoutProtocolOptionsHtml(p,items) {
  return '<h3>Opcije treninga</h3><button type="button" class="opt" data-a="editPr" data-id="'+esc(p.id)+'">'+I.edit+'<span>Uredi trening</span></button>'+workoutExpectationHtml(p.id,items)+'<details class="workout-protocol-options"><summary>Raspored i planirani rad po mišićima</summary>'+protocolMusclePreview({items})+(p.program?'':daysPicker('prDays',p.id,p.days))+'</details>';
}
VIEWS.pr = function(t){
  const p=S.pr[t.id];if(!p)return '<div class="view gut">'+topbar(backBtn())+'<p class="empty">Ovaj protokol više ne postoji.</p></div>';
  const items=viewDoseItems(t,p.items||[]),first=items.find(item=>S.ex[item.exId]);
  const left='<button type="button" class="ib" data-a="back" aria-label="Natrag">'+WorkoutView.icon('chevron-left')+'</button>',right='<button type="button" class="ib" data-a="workoutProtocolOptions" aria-label="Opcije treninga">'+WorkoutView.icon('ellipsis')+'</button>';
  return WorkoutView.overview({topbarHtml:topbar(left,right,'MOJ TRENING'),heroHtml:workoutOverviewHero(p,first),eyebrow:workoutOverviewEyebrow(items),title:p.name,description:p.desc,metaHtml:workoutOverviewMeta(p,items),blocksHtml:items.length?workoutCompactHtml(items):'<p class="empty">Dodaj prvu vježbu u protokol.</p>',footerHtml:'<div class="footer gut workout-overview-footer"><button class="btn" data-a="startPr" data-id="'+esc(p.id)+'"'+(items.length?'':' disabled')+'>'+WorkoutView.icon('play')+'Pokreni trening</button></div>'});
};

function workoutExpectationHtml(id,items) {
  const prepared=items.map(item=>({...item,sides:!!item.sides,kgList:Array.from({length:item.sets||1},(_,i)=>StartingLoad.missingSet(item,i,startLoadDescription(item.exId)?.kind)?null:PlayerDose.at(item,i+1).kg)}));
  const estimate=TrainingLoad.expectation({entry:{kind:'protocol',refId:id,items:prepared},log:S.log,now:Date.now()});
  const amount=v=>v.toLocaleString('hr-HR',{maximumFractionDigits:2});
  return '<details class="workout-expectation" data-load-expectation data-status="'+estimate.status+'" data-sample-count="'+estimate.sampleCount+'"'+(estimate.min===null?'':' data-min="'+estimate.min+'" data-max="'+estimate.max+'"')+'><summary>Očekivani napor · '+(estimate.status==='available'?amount(estimate.min)+(estimate.min===estimate.max?'':'–'+amount(estimate.max))+' j.n.':'još nema dovoljno usporedivih zapisa')+'</summary><p>'+esc(estimate.reason)+'</p><p>'+estimate.sampleCount+' ocijenjenih usporedivih izvedbi · stvarni napor unosiš nakon treninga.</p><button class="txtbtn" data-a="trainingLoadOpen">Praćenje opterećenja</button></details>';
}
VIEWS.trainingLoad = t => VIEWS.progress(t);

VIEWS.exerciseLoad = function(t) {
  const e=S.ex[t.id];
  return '<div class="view gut">'+topbar(backBtn())+'<h1 class="h1">Opterećenje i povijest</h1>'+
    (e ? '<p class="sub">'+esc(e.name)+'</p>'+exOptHtml(e) : '<p class="empty">Vježba više nije u knjižnici.</p>')+'</div>';
};

VIEWS.build = function(){
  const d = S.draft; if (!d) return VIEWS.home();
  const isNew = !S.pr[d.id];
  const total = protoMin(d);
  const eff = CinemaModel.sections(d.items);
  return '<div class="view gut">' +
    topbar(backBtn(), '<button class="txtbtn" data-a="savePr">Spremi</button>', '') +
    '<h1 class="h1">' + (isNew ? 'Novi protokol' : 'Uredi protokol') + '</h1>' +
    '<div class="field" style="margin-top:22px"><label class="label" for="p-name">Naziv</label><input id="p-name" class="input" data-bind="name" value="'+esc(d.name)+'" placeholder="npr. Aktivacija prije treninga" style="font-weight:600;font-size:17px"></div>' +
    '<div class="field" style="margin-top:16px"><label class="label" for="p-desc">Opis</label><textarea id="p-desc" class="input" rows="2" data-bind="desc" placeholder="Kada i zašto ga radiš">'+esc(d.desc)+'</textarea></div>' +
    '<div style="display:flex;justify-content:space-between;align-items:baseline;margin:28px 17px 14px"><h2 style="margin:0;font-size:17px;font-weight:600">Vježbe</h2><span style="font-size:14px;color:var(--text-body)">'+nVj(d.items.length)+' • ≈ '+total+' min</span></div>' +
    '<div class="list">' + (function(){
      const lab = ssLetters(d.items), N = d.items.length;
      const secField = i => {
        const names = [...new Set(WORKOUT_PARTS.concat(eff))], custom = d._sectionCustom === i;
        return '<div class="builder-part field"><label for="builder-section-'+i+'">Dio treninga</label>'+
          '<select id="builder-section-'+i+'" class="input" data-builder-section="'+i+'" aria-label="Dio treninga">'+names.map(name=>'<option value="'+esc(name)+'"'+(eff[i]===name?' selected':'')+'>'+esc(name)+'</option>').join('')+'<option value="_custom">Vlastiti naziv…</option></select>'+
          (custom?'<div class="builder-part-custom"><input id="builder-section-name" class="input" data-bind="_sectionName" maxlength="80" value="'+esc(d._sectionName||'')+'" placeholder="npr. Glavni trening" aria-label="Vlastiti naziv dijela" autocomplete="off" enterkeyhint="done"><button type="button" class="chip" data-a="builderSectionApply" data-i="'+i+'">Primijeni</button></div>':'')+'</div>';
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
            (!l || l.k === 1 ? secField(i) : '<p class="builder-part-inherited">'+esc(eff[i])+'</p>') +
            '<div class="seg" style="margin-top:12px"><button class="chip" data-a="iset" data-k="measure" data-v="time" aria-pressed="'+(it.measure==='time')+'">Na vrijeme</button><button class="chip" data-a="iset" data-k="measure" data-v="sets" aria-pressed="'+(it.measure!=='time')+'">Na ponavljanja</button></div>' +
            (it.measure === 'time'
              ? istep('Trajanje','sec',i,it.sec+' s') + istep(inGroup ? 'Krugovi' : 'Serije','sets',i,n) + rest
              : istep(inGroup ? 'Krugovi' : 'Serije','sets',i,n) +
                (split ? Array.from({ length: n }, (_, s) => istep((s + 1) + '. ' + unit, 'reps', i, repsOf(it, s + 1), { act:'isetrep', s, aria:'Ponavljanja, ' + (s + 1) + '. ' + unit })).join('') : istep('Ponavljanja','reps',i,it.reps||10)) +
                '<div class="prow" style="border:0"><span class="k">Različita ponavljanja po seriji</span><button class="switch" role="switch" data-a="irepsplit" data-i="'+i+'" aria-checked="'+split+'" aria-label="Različita ponavljanja po seriji"></button></div>' +
                istep('Težina','kg',i,'',{ hint: KG_HINT[kk], aria: kgAria, box: kgBox('data-ikg="'+i+'"', it.kg, kgAria + ' u kg') }) +
                '<label class="prow builder-rep-timer"><span class="k">Vrijeme serije (s)<small>Prazno za automatsku procjenu</small></span><input class="input" type="text" inputmode="numeric" data-rep-set-sec="'+i+'" value="'+esc(it.repSetSec??'')+'" placeholder="Automatski"></label>'+
                rest) +
            '<div class="prow"><span class="k">Lijeva i desna strana posebno</span><button class="switch" role="switch" data-a="iflag" data-i="'+i+'" aria-checked="'+(!!it.sides)+'" aria-label="Lijeva i desna strana posebno"></button></div>' +
            (i < N - 1 && (linked || eff[i] === eff[i + 1]) ? '<div class="prow"><span class="k">Superset sa sljedećom vježbom<br><span style="font-size:13px;color:var(--text-2)">Radiš ih naizmjence, odmor tek nakon kruga</span></span><button class="switch" role="switch" data-a="ilink" data-i="'+i+'" aria-checked="'+linked+'" aria-label="Superset sa sljedećom vježbom"></button></div>' : '') +
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
const WORKOUT_PARTS = ['Glavni dio','Priprema','Snaga','Kondicija','Trup','Mobilnost','Rehabilitacija','Oporavak'];
function builderSetSection(index,label){
  const items=S.draft?.items;
  if(!items || !Number.isInteger(index) || !items[index] || typeof label!=='string' || !label.trim())return false;
  const group=groupsOf(items).find(g=>g.idx.includes(index));
  const labels=CinemaModel.sections(items);
  (group?.idx||[index]).forEach(i=>{labels[i]=label.trim();});
  secSet(items,labels);
  delete S.draft._sectionCustom;delete S.draft._sectionName;
  return true;
}
function builderCommitSection(){
  const d=S.draft,name=String(d?._sectionName||'').trim();
  if(Number.isInteger(d?._sectionCustom)&&name)builderSetSection(d._sectionCustom,name.slice(0,80));
  else if(d){delete d._sectionCustom;delete d._sectionName;}
}
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
// A new round inherits the last row, including an unknown weight.
function fitSetLists(it) {
  for (const [key,fallback] of [['repsList',it.reps || 10],['secList',it.sec ?? 30],['kgList',it.kg || null]]) {
    const list=it[key]; if (!Array.isArray(list)) continue;
    const n=it.sets || 1, last=list.length ? list[list.length-1] : fallback;
    while (list.length<n) list.push(last);
    list.length=n;
  }
}
function builderWeight(it,kg,explicit) {
  it.kg=kg;
  delete it.kgList;
  if (explicit && kg===0 && startLoadDescription(it.exId)?.kind==='lm') it.startingKgKnown=true;
  else delete it.startingKgKnown;
}
// an exercise added to a protocol starts from the weight you last lifted on it, else the library value. When the reps differ, a
// barbell, landmine or dumbbell load is converted to the real load for the new reps; any other load (kettlebell, medicine ball,
// an own exercise without a weight tag) is kept as it was, since roundLoad only knows bar, plate and dumbbell steps
function newItem(e){
  const it = exItem(e); if (it.measure === 'time') return it;
  for (const x of historyOf(e.id)) {
    if (x.measure !== it.measure || x.done === false) continue;
    const rows = HistoryModel.recordedRows(x) || [];
    const last = rows.slice().reverse().find(r => r.kg > 0 && r.reps > 0);
    if (!last) continue;
    it.kg = last.reps === it.reps || !['bar','lm','db'].includes(loadKind(e)) ? last.kg : roundLoad(e, e1rm(last.kg,last.reps)*pctFor(it.reps));
    break;
  }
  return it;
}

/* ---------- field catalogue: editorial categories, independent of load estimates ---------- */
const FIELD_CATEGORIES = [
  { key:'speed', title:'Brzina', sub:'Ubrzanje, tehnika trčanja i izlaganje velikoj brzini.' },
  { key:'agility', title:'Agilnost', sub:'Promjene smjera, kočenje i ponovno ubrzanje.' },
  { key:'endurance', title:'Izdržljivost', sub:'Aerobno trčanje, intervali i brzinska izdržljivost.' },
  { key:'tests', title:'Testovi', sub:'Zabilježi rezultat i koristi ga za osobni tempo MAS intervala.' },
  { key:'other', title:'Ostalo', sub:'Dodatni treninzi koji još nemaju odabranu kategoriju.' }
];
// Reviewed from the sessions' stated goals and blocks, never guessed from their names.
// Speed endurance in the 4-week plan remains endurance; this does not change its prescribed order or dose.
const FIELD_CATEGORY_IDS = {
  'box-to-box-aerobno':'endurance', 'brzina-i-brzinska-izdrzljivost':'speed',
  'intervali-15-15':'endurance', 'intervali-3-2-1':'endurance',
  'izlozenost-maksimalnoj-brzini':'speed', 'k3-predsezonska-brzina':'speed',
  'maksimalna-brzina-40-20':'speed', 'mas-mreze-15-15':'endurance',
  'mas-test-5-min':'tests', 'mendo-solo-ubrzanje':'agility',
  'ss-pre-1a':'endurance', 'ss-pre-1b':'endurance', 'ss-pre-1c':'endurance',
  'ss-pre-2a':'endurance', 'ss-pre-2b':'endurance', 'ss-pre-2c':'endurance',
  'ss-pre-2d':'endurance', 'ss-pre-3a':'endurance', 'ss-pre-3b':'endurance',
  'ss-pre-3c':'endurance', 'ss-pre-3d':'endurance'
};
function fieldCategoryKey(f){
  const explicit = f && f.catalogueCategory;
  if (FIELD_CATEGORIES.some(c => c.key === explicit)) return explicit;
  return f && Object.prototype.hasOwnProperty.call(FIELD_CATEGORY_IDS, f.id) ? FIELD_CATEGORY_IDS[f.id] : 'other';
}
function fieldCatalogueItems(field){
  return Object.values(field || {}).filter(f => f && typeof f === 'object').slice().sort((a,b) =>
    (Number.isFinite(a.order) ? a.order : 99) - (Number.isFinite(b.order) ? b.order : 99));
}
/* ---------- end field catalogue data ---------- */
// SHOW_SOURCES false: the field sessions' own notes about their source (data.js, pitch.js captions; kept as they are) are shown
// without it, sentence by sentence: "Izvor ne navodi zagrijavanje." goes, "Izvor: 2–3 serije …" reads "Obično 2–3 serije …"
const FIELD_SRC_TXT = [
  [/^Vlastiti prikaz prema STATSports Pre-Season Training Program \(PDF\)\.\s*/, ''], [/^Vlastiti prikaz prema savjetima K3 Performance\.\s*/, ''],
  [/Točan raspored staza izvor ne propisuje\.\s*/, ''], [/^Prema izvoru: /, ''], [/ Udaljenosti su prema izvoru, a raspored na terenu je vlastiti\./, ''],
  [/: izvor ga ne navodi\./, '.'], [/; original nije u mjerilu\./, '.'],
  [/^Izvor ne navodi zagrijavanje\.\s*/, ''], [/^Izvor ne navodi zasebno; /, ''], [/^Izvor ne navodi\. Prijedlog: /, ''], [/^Izvor ne navodi\.\s*/, ''],
  [/ \(izvor navodi [^,()]*, zbroj je ([^()]*)\)/, ' (ukupno $1)'], [/Izvor: (?=\d)/g, 'Obično '],
  [/Izvor koristi gumu za trčanje s otporom i partnera;/, 'Inače se radi s gumom za trčanje s otporom i s partnerom;'],
  [/, izvor ne navodi start\)/, ')'], [/ \(izvor\)/, ''], [/Izvor navodi ukupno/, 'Ukupno'], [/; izvor ne navodi odmor\)/, ')'],
  [/Izvor piše '40 rest' bez jedinice; uzeto kao 40 s\./, 'Odmor 40 s.'], [/ \(tumačenje izvora\)/, ''], [/ Izvor ne navodi odmor između blokova\./, ''],
  [/ \(izvor ne navodi\)/, ''], [/^pretpostavka: PDF ne navodi odmor nakon Run 3$/, 'pretpostavka'],
  [/ PDF ne navodi broj krugova ni odmor nakon Run 3; ovdje je /, ' Ovdje je '], [/Broj krugova i odmor nakon Run 3 PDF ne navodi: ako/, 'Ako']
];
const fieldTxt = s => SHOW_SOURCES || !s ? s : FIELD_SRC_TXT.reduce((t, [re, to]) => t.replace(re, to), s);
// field texts: "16,5 m"; times as "15 s", "3 min" or "1:30"
const fieldM = m => String(Math.round(m * 10) / 10).replace('.', ',') + ' m';
const fieldDur = s => s < 60 ? s + ' s' : s % 60 ? fmt(s) : s / 60 + ' min';

/* ---------- MAS: the 5-minute test gives your maximal aerobic speed; the MAS runs take your own distances from it ---------- */
// a result is a log entry { kind:'test', test:'mas', name, value: m/s, unit:'m/s', dist: metres in 5 min, at }; it is not a training
const masLast = () => S.log.reduce((b, l) => l && l.kind === 'test' && l.test === 'mas' && l.value > 0 && (!b || l.at > b.at) ? l : b, null);
const masNow = () => { const l = masLast(); return l ? l.value : 0; };
const masM = (pct, s) => Math.round(masNow() * pct / 100 * s);
const masTxt = v => String(Math.round(v * 100) / 100).replace('.', ',');
const masOk = m => Number.isInteger(m) && m >= 600 && m <= 2400;   // 2 to 8 m/s
const masEntry = (m, at) => ({ historyId:uid('h'), kind:'test', test:'mas', name:'MAS test', value: Math.round(m / 3) / 100, unit:'m/s', dist: m, at: at || Date.now() });
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
  const category = FIELD_CATEGORIES.find(c => c.key === fieldCategoryKey(f));
  const when = f.group === 'pre' && (f.when_hr || (f.week ? f.week+'. tjedan'+(f.dayHr ? ' · '+f.dayHr : '') : ''));
  return '<button class="row field-catalogue-row" data-a="openField" data-id="'+esc(f.id)+'"><span class="thumb pthumb" aria-hidden="true">'+(spec ? pitchSvg(spec, { thumb:true }) : pathIcon(I.run,28))+'</span><span class="tx"><span class="t">'+esc(f.name_hr || 'Trening na terenu')+'</span><span class="m"><span>'+esc(fieldMin(f))+' min</span><span class="tag" data-category="'+category.key+'">'+esc(category.title)+'</span>'+(f.group === 'pre' ? '<span class="field-plan-tag">Iz plana</span>' : '')+'</span>'+(f.goal_hr ? '<span class="field-row-goal">'+esc(f.goal_hr)+'</span>' : '')+(when ? '<span class="field-row-when">'+esc(when)+'</span>' : '')+'</span>'+I.chev+'</button>';
}
function fieldCataloguePlanCard(){
  const ps = prePlanState(); if (!ps || !ps.cells.some(c => c.f)) return '';
  return '<button class="field-plan-card" data-a="fieldMode" data-mode="plan"><span class="field-plan-card-icon" aria-hidden="true">'+I.cal+'</span><span><b>Predsezonski plan</b><span>4 tjedna · '+ps.done+' od '+ps.cells.length+' termina odrađeno</span><small>Otvori raspored i nastavi redom</small></span>'+I.chev+'</button>';
}
function fieldCatalogueSection(category, list, selected){
  if (!list.length) return '';
  const single = list.filter(f => f.group !== 'pre'), planned = list.filter(f => f.group === 'pre');
  return '<section class="field-catalogue-section" aria-labelledby="field-heading-'+category.key+'"><h2 id="field-heading-'+category.key+'">'+esc(category.title)+'<span>'+list.length+'</span></h2>'+(!selected ? '<p>'+esc(category.sub)+'</p>' : '')+
    (single.length ? '<div class="list">'+single.map(fieldRow).join('')+'</div>' : '')+
    (planned.length ? '<details class="field-plan-sessions"'+(selected ? ' open' : '')+'><summary>Iz predsezonskog plana <span>'+planned.length+' '+plural(planned.length,'trening','treninga','treninga')+'</span></summary><p>Možeš otvoriti pojedini trening. Za raspored po tjednima odaberi Predsezonski plan.</p><div class="list">'+planned.map(fieldRow).join('')+'</div></details>' : '')+'</section>';
}
VIEWS.fieldList = function(t){
  const all = fieldCatalogueItems(S.field), planned = all.filter(f => f.group === 'pre');
  const mode = t.fieldMode === 'plan' ? 'plan' : 'catalogue';
  const cat = FIELD_CATEGORIES.some(c => c.key === t.fieldCat) ? t.fieldCat : 'all';
  const selected = FIELD_CATEGORIES.find(c => c.key === cat);
  let body;
  if (S.dbState !== 'ready') body = stateNote();
  else if (!all.length) body = '<div class="empty">Još nema dostupnih treninga na terenu. Ako si ih spremio u sigurnosnu kopiju, možeš je vratiti kroz Moji podaci.<button class="txtbtn" data-a="dataSheet">Moji podaci</button></div>';
  else {
    const modes = '<div class="field-modes" role="group" aria-label="Prikaz terenskih treninga"><button data-a="fieldMode" data-mode="catalogue" aria-pressed="'+(mode === 'catalogue')+'"><b>Treninzi</b><span>'+all.length+' u katalogu</span></button><button data-a="fieldMode" data-mode="plan" aria-pressed="'+(mode === 'plan')+'"><b>Predsezonski plan</b><span>Raspored · 4 tjedna</span></button></div>';
    if (mode === 'plan') body = modes + '<section class="field-programme"><h2>Predsezonski plan · 4 tjedna</h2><p>'+(SHOW_SOURCES ? 'STATSports Pre-Season Training Program. ' : '')+'Prati raspored po tjednima. Označeni su odrađeni termini i sljedeći trening.</p>'+(planned.length ? fieldPlanHtml()+'<h3>Treninzi u planu</h3><p>Različiti treninzi redom iz programa; isti se trening može ponoviti u rasporedu.</p><div class="list">'+planned.map(fieldRow).join('')+'</div>' : '<div class="empty">Treninzi ovog plana trenutačno nisu dostupni. Ostali treninzi ostaju u katalogu.<button class="txtbtn" data-a="fieldMode" data-mode="catalogue">Otvori katalog</button></div>')+'</section>';
    else {
      const counts = {}; FIELD_CATEGORIES.forEach(c => { counts[c.key] = all.filter(f => fieldCategoryKey(f) === c.key).length; });
      const filters = [{ key:'all', title:'Sve' }].concat(FIELD_CATEGORIES.filter(c => c.key !== 'other' || counts.other || cat === 'other'));
      const matching = cat === 'all' ? all : all.filter(f => fieldCategoryKey(f) === cat);
      body = modes+'<div class="field-categories" role="group" aria-label="Cilj terenskog treninga">'+filters.map(c => '<button data-a="fieldCategory" data-cat="'+c.key+'" aria-pressed="'+(cat === c.key)+'" aria-controls="field-results"><span>'+esc(c.title)+'</span><span class="field-category-count">'+(c.key === 'all' ? all.length : counts[c.key])+'</span></button>').join('')+'</div>'+
        '<p class="field-catalogue-intro" id="field-results-status" role="status">'+(selected ? esc(selected.sub)+' '+matching.length+' '+plural(matching.length,'dostupan trening.','dostupna treninga.','dostupnih treninga.') : 'Odaberi cilj treninga. Katalog uključuje samostalne treninge i treninge iz plana.')+'</p>'+(cat === 'all' ? fieldCataloguePlanCard() : '')+
        '<div id="field-results" aria-describedby="field-results-status">'+(matching.length ? FIELD_CATEGORIES.filter(c => cat === 'all' || c.key === cat).map(c => fieldCatalogueSection(c, matching.filter(f => fieldCategoryKey(f) === c.key), !!selected)).join('') : '<div class="empty">U ovoj kategoriji još nema treninga.<button class="txtbtn" data-a="fieldCategory" data-cat="all">Prikaži sve treninge</button></div>')+'</div>';
    }
  }
  return '<div class="view gut field-catalogue">'+topbar(backBtn())+'<h1 class="h1">Kondicija na terenu</h1><p class="sub">Odaberi cilj ili nastavi plan. Nacrt terena pokazuje odakle i kamo trčiš.</p>'+body+'<div style="height:24px"></div></div>';
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
  if (b.rest_s) parts.push((b.rest_mas_pct ? 'oporavak ' : 'odmor ') + fieldDur(b.rest_s) + (b.rest_type_hr && b.rest_type_hr !== 'odmor' ? ' – ' + fieldTxt(b.rest_type_hr) : ''));
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
    (spec ? '<figure class="pitch">' + pitchSvg(spec) + '<figcaption><div class="lgrow">' + pitchLegend(spec) + '</div>' + (fieldTxt(spec.caption) ? '<span>' + esc(fieldTxt(spec.caption)) + '</span>' : '') + '</figcaption></figure>' : '') +
    (f.summary_hr ? '<p style="margin:16px 17px 0;font-size:16px;line-height:24px;color:var(--text-body)">'+esc(fieldTxt(f.summary_hr))+'</p>' : '') +
    (f.when_hr ? '<p class="sub" style="margin-top:10px">U predsezonskom planu: '+esc(f.when_hr)+'</p>' : '') +
    (f.how_hr && f.how_hr.length ? '<div class="stack" style="gap:8px;margin:14px 17px 0">' + f.how_hr.map((s, i) => '<div class="bul num"><i>'+(i+1)+'</i><span>'+esc(fieldTxt(s))+'</span></div>').join('') + '</div>' : '') +
    (mas ? masCard(f) : '') +
    '<div style="margin-top:18px">' + daysPicker('fieldDays', f.id, f.days) + '</div>' +
    '<div class="stack" style="gap:16px;margin:20px 17px 0">' +
      (f.equipment_hr ? '<div class="feat">'+I.bars+'<span>'+esc(f.equipment_hr)+'</span></div>' : '') +
      (f.warmup_hr ? '<div class="feat">'+I.clock+'<span>Zagrijavanje: '+esc(fieldTxt(f.warmup_hr))+'</span></div>' : '') +
    '</div>' +
    (akt ? '<div class="list" style="margin-top:18px"><button class="row" data-a="openPr" data-id="'+esc(akt.id)+'" style="min-height:64px"><span class="thumb" style="width:56px;height:56px">'+pathIcon(I.run,24)+'</span><span class="tx"><span class="t">Prvo zagrijavanje: '+esc(akt.name)+'</span><span class="m"><span>'+protoMin(akt)+' min</span></span></span>'+I.chev+'</button></div>' : '') +
    '<h2 class="h2">Blokovi</h2>' +
    '<div class="list" style="margin-top:14px">' + (f.blocks||[]).map((b,i) => '<div class="blk"><span class="no">'+(i+1)+'</span><span class="bt"><b>'+esc(b.label_hr)+'</b><span>'+esc(blockLine(b, f))+'</span>'+(b.cue_hr?'<span style="color:var(--text-2)">'+esc(fieldTxt(b.cue_hr))+'</span>':'')+'</span></div>').join('') + '</div>' +
    (f.cooldown_hr ? '<p style="margin:18px 17px 0;font-size:14px;line-height:21px;color:var(--text-2)">Hlađenje: '+esc(fieldTxt(f.cooldown_hr))+'</p>' : '') +
    (SHOW_SOURCES ? '<p style="margin:18px 17px 0;font-size:14px;line-height:21px;color:var(--text-2)">Izvor: ' + (f.source_url ? '<a href="'+esc(f.source_url)+'" target="_blank" rel="noopener">'+esc(f.source_title || 'STATSports')+'</a>' : esc(f.source_title || 'STATSports')) + (spec ? ' · nacrt je vlastiti prikaz prema izvoru' : '') + '</p>' : '') +
    '<div style="height:20px"></div></div>' +
    fieldStartHtml(f, ld);
};

/* ---------- player ---------- */
let P = null, ticker = null, audioCtx = null, wakeLock = null, wakeOk = true, wakeHinted = false, keepMedia = null;
// iOS leaves the context 'interrupted' after a call, Siri or the app in the background, not only 'suspended'
function ensureAudio(){
  if (!S.settings.sound) return;
  const Audio = window.AudioContext || window.webkitAudioContext;
  if (!Audio) return;
  try {
    if (!audioCtx || audioCtx.state === 'closed') audioCtx = new Audio();
    if (audioCtx.state !== 'running') audioCtx.resume()?.catch(() => {});
  } catch(e){}
}
// On the iPhone Web Audio obeys the silent switch. The opt-in 'playback' session keeps the signals audible (other apps' music may pause).
function audioMode(on){ try { if ('audioSession' in navigator) navigator.audioSession.type = on && S.settings.sound && S.settings.silentOk === true ? 'playback' : 'auto'; } catch(e){} }
function beep(freq, ms, vol){
  if (!S.settings.sound || !audioCtx) return;
  try { const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.frequency.value = freq; o.type = 'sine'; g.gain.value = vol || 0.18; o.connect(g); g.connect(audioCtx.destination); const t0 = audioCtx.currentTime; g.gain.setValueAtTime(vol||0.18, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + ms/1000); o.start(t0); o.stop(t0 + ms/1000 + 0.02); } catch(e){}
}
const vibrationAvailable = () => typeof navigator.vibrate === 'function';
function buzz(pattern){
  if (!vibrationAvailable() || (!S.settings.vibration && pattern !== 0)) return;
  try { navigator.vibrate(pattern); } catch(e){}
}
const WORKOUT_SIGNALS = {
  prep: {tone:[587,170,.17], vibration:[45,65,45]},
  work: {tone:[880,260,.22], vibration:120},
  rest: {tone:[392,230,.17], vibration:65},
  switch: {tone:[660,200,.18], vibration:[75,60,75]},
  countdown: {tone:[740,100,.14], vibration:28},
  finish: {tone:[988,420,.22], vibration:[120,80,120]}
};
function workoutSignal(kind){
  const cue = WORKOUT_SIGNALS[kind];
  if (cue) { beep(...cue.tone); buzz(cue.vibration); }
}
function playerSignalSettings(){
  const vibration = vibrationAvailable();
  return '<div class="prow"><span class="k">Zvučni signali</span><button type="button" class="switch" role="switch" data-a="toggleSound" aria-checked="'+!!S.settings.sound+'" aria-label="Zvučni signali"></button></div>' +
    (vibration ? '<div class="prow"><span class="k">Vibracija</span><button type="button" class="switch" role="switch" data-a="toggleVibration" aria-checked="'+!!S.settings.vibration+'" aria-label="Vibracija"></button></div>'
      : '<p class="sub">Vibracija ovisi o podršci uređaja i preglednika. Ovdje su dostupni zvučni signali.</p>') +
    ('audioSession' in navigator ? '<div class="prow"><span class="k">Zvuk u nečujnom načinu</span><button type="button" class="switch" role="switch" data-a="toggleSilent" aria-checked="'+(S.settings.silentOk === true)+'" aria-label="Zvuk u nečujnom načinu"></button></div><p class="sub">Glazba iz druge aplikacije tada se može pauzirati.</p>'
      : /iPhone|iPad|iPod/.test(navigator.userAgent) ? '<p class="sub">Za zvučne signale isključi nečujni način na uređaju.</p>' : '') +
    '<button type="button" class="btn sec" data-a="previewPlayerSignal"'+(S.settings.sound || vibration && S.settings.vibration ? '' : ' disabled')+'>Isprobaj signal</button>';
}
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
function liveStepsFromItems(items){
  return stepsFromItems(items,{splitRepSides:P.splitRepSides,sidePrepSec:P.sidePrepSec,exercisePrepSec:P.exercisePrepSec});
}
function stepsFromItems(items,{splitRepSides=true,sidePrepSec=workoutSidePrepSeconds(),exercisePrepSec=workoutSidePrepSeconds(5)}={}){
  const steps = [], ts = S.settings.transSec;
  const lab = ssLetters(items);
  const exOf = it => S.ex[it.exId] || { name:'Vježba', steps:[] };
  const pushSet = (it, base) => {
    // Each work step owns its dose: later session edits cannot rewrite past sets.
    const dose = PlayerDose.at(it, base.set), own = { ...it, reps:dose.reps, kg:dose.kg, sec:dose.sec };
    base = { ...base, it:own };
    const timed=it.measure==='time';
    const work=side=>timed?{...base,kind:'work',dur:dose.sec,side}:{...base,kind:'manual',side,targetSec:cinemaManualTarget({...base,side})};
    if (it.sides&&(timed||splitRepSides)) {
      steps.push(work('Lijeva strana'),{...base,kind:'switch',dur:sidePrepSec,side:'Promjena strane'},work('Desna strana'));
    } else {
      const r=dose.reps;
      steps.push(work(timed?undefined:r+' '+plural(r,'ponavljanje','ponavljanja','ponavljanja')+(it.sides?' po strani':'')+(dose.kg?' · '+fmtKg(dose.kg):'')+(it.note?' · '+it.note:'')));
    }
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
          else if (r < R) {   // Give the athlete time to set up a hold after a set with reps.
            const gn = grp.idx.find(i => (items[i].sets || 1) >= r + 1), nx = items[gn];
            if (nx && nx.measure === 'time' && it.measure !== 'time') {
              const nb = { g: gn, e: exOf(nx), it: nx, set: r + 1, round: r + 1, rounds: R, ss: lab[gn] };
              steps.push(Object.assign({}, nb, { kind:'ready' }));
              steps.push(Object.assign({}, nb, { kind:'switch', dur: Math.max(exercisePrepSec, 10), go:true }));
            }
          }
        }
        else {
          const gn = active[k + 1], nx = items[gn], ne = exOf(nx);
          if (it.rest) steps.push(Object.assign({}, base, { kind:'rest', dur:it.rest, label:'Sljedeće: ' + ne.name }));
          else if (nx.measure === 'time' && it.measure !== 'time') {
            // A short countdown lets the athlete get into position before the hold.
            const nb = { g: gn, e: ne, it: nx, set: r, round: r, rounds: R, ss: lab[gn] };
            steps.push(Object.assign({}, nb, { kind:'ready' }));
            steps.push(Object.assign({}, nb, { kind:'switch', dur: Math.max(exercisePrepSec, 10), go:true }));
          }
          else if (nx.measure === 'time') steps.push(Object.assign({}, base, { kind:'switch', dur:exercisePrepSec, side:'Sljedeće: ' + ne.name, nextEx:true }));
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
    const restLabel = jog ? 'Lagano trčanje · ' + b.rest_mas_pct + ' % MAS' : 'Odmor' + (b.rest_type_hr && b.rest_type_hr !== 'odmor' ? ' · ' + fieldTxt(b.rest_type_hr) : '');
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
function startLoadDescription(id){
  const e=S.ex[id];
  return e && {name:e.name,kind:isBw(e)?'':StartingLoad.kind(e,exEquip(e),loadKind(e))};
}
function startSource(cfg){
  return cfg.ref.kind==='protocol'?S.pr[cfg.ref.id]:S.ex[cfg.ref.id];
}
function openStartingLoad(cfg,repeating){
  const rows=StartingLoad.requests(cfg.items,startLoadDescription);
  if (!rows.length) return false;
  const source=startSource(cfg);
  if (!source) {toast('Vježba ili protokol više nisu dostupni.',true);return true;}
  if(cfg.ref.kind==='protocol' && cfg.items.some((it,j)=>it.exId!==source.items[j]?.exId))cfg={...cfg,sessionOnly:true};
  S.sheet={kind:'startingLoad',cfg,repeating,rows,values:{},sourceKey:mtCanon(source),proposal:top().v==='today'?top().proposalKey:null};
  render();return true;
}
function startingLoadHtml(s){
  return '<small class="sl-overline">Prije pokretanja</small><h3>Unesi početnu težinu</h3>'+
    '<p>Za sljedeće vježbe nedostaje kilaža. Unesi težinu koju ćeš koristiti.</p><form id="starting-load-form" class="sl-form" novalidate>'+
    s.rows.map(row=>'<label class="sl-row"><span><strong>'+esc(row.name)+'</strong><small>'+esc(StartingLoad.labels[row.kind])+
      (row.kind==='lm'?' · 0 za praznu šipku':'')+'</small></span><input type="text" inputmode="decimal" autocomplete="off" name="kg-'+row.index+
      '" data-start-kg="'+row.index+'" value="'+esc(s.values[row.index] || '')+'" placeholder="kg"></label>').join('')+
    '<p id="start-weight-error" class="sl-error" role="alert">'+esc(s.error || '')+'</p><button type="submit" class="btn">Spremi i kreni</button>'+
    '<button type="button" class="btn sec" data-a="sheetDone">Natrag</button></form>';
}
function confirmStartingLoad(){
  const s=S.sheet, form=document.getElementById('starting-load-form');
  if (!form || s?.kind!=='startingLoad' || P) return;
  const error=message=>{s.error=message;document.getElementById('start-weight-error').textContent=message;};
  const kgByIndex=new Map();
  for (const row of s.rows) {
    const field=form.elements.namedItem('kg-'+row.index);
    s.values[row.index]=field.value;
    const kg=StartingLoad.parse(field.value,row.kind);
    if (kg===null) {error('Provjeri unos za '+row.name+'. Upiši '+(row.kind==='lm'?'0 ili više':'više od 0')+' kg, najviše 300 kg.');field.focus();return;}
    kgByIndex.set(row.index,kg);
  }
  let raw;
  try {raw=localStorage.getItem(STORE_KEY);} catch(e){error('Težina nije spremljena. Pokušaj ponovno.');return;}
  if (raw!==savedJson) {
    if (!raw || !mergeOtherCopy(raw)) {error('Podaci su se promijenili. Vrati se i ponovno otvori trening.');return;}
    savedJson=raw; pendingExt=null;
  }
  const cfg=s.cfg, source=startSource(cfg);
  const fill=(it,i)=>kgByIndex.has(i)?StartingLoad.fill(it,kgByIndex.get(i)):it;
  const stale=!source || mtCanon(source)!==s.sourceKey || s.rows.some(row=>startLoadDescription(row.exId)?.kind!==row.kind);
  const vm=s.proposal && dailyInput(Date.now());
  if (stale || (vm && s.proposal!==mtCanon([vm.date,vm.recommendation]))) {
    S.sheet=null;render();toast('Trening ili prijedlog se promijenio. Provjeri ga prije pokretanja.',true);return;
  }
  const protocol=cfg.ref.kind==='protocol', map=protocol?S.pr:S.ex;
  const updated=cfg.sessionOnly?source:protocol?{...source,items:source.items.map(fill)}:StartingLoad.fill(source,kgByIndex.get(0));
  map[source.id]=updated;
  if (!persist()) {map[source.id]=source;error('Početna težina nije spremljena. Tvoj je unos još otvoren.');return;}
  const items=cfg.items.map(fill), baseline=cfg.sessionOnly?(cfg.originalItems || cfg.items):(cfg.originalItems || cfg.items).map((it,i)=>it.exId===cfg.items[i]?.exId?fill(it,i):it);
  s.sourceKey=mtCanon(updated);
  if(startPlayer({...cfg,items,originalItems:baseline},s.repeating)===false && updated!==source){
    map[source.id]=source;
    if(persist())s.sourceKey=mtCanon(source);else{map[source.id]=updated;s.sourceKey=mtCanon(updated);}
    render();
  }
}
function startPlayer(cfg, repeating=false){
  if (P) return;
  if (!repeating && lsGet(PLAY_KEY,null)) {
    playResume();
    if (S.sheet?.kind==='resume') return;
  }
  if (cfg.mode==='ex' && openStartingLoad(cfg,repeating)) return;
  audioMode(true); ensureAudio();
  S.workoutRaw={};
  P = Object.assign({ i:0, paused:false, done:false, endAt:0, left:0, startedAt: Date.now(), lastBeep:null, doneSteps:{} }, cfg);
  P.clock=SessionClock.start(P.startedAt);
  if (P.mode === 'ex') {
    P.originalItems = clone(cfg.originalItems || P.items);
    P.items = PlayerDose.items(P.items);
    P.splitRepSides=true;P.sidePrepSec=workoutSidePrepSeconds();P.exercisePrepSec=workoutSidePrepSeconds(5);
    P.steps = liveStepsFromItems(P.items);
    P.liveDoseVersion = 1; P.cardIndex = 0;
  }
  if (!P.steps.length) {P=null;return false;}
  if(enterStep(0)===false){
    P=null;audioMode(false);
    const message='Trening nije spremljen na uređaj. Tvoj unos je sačuvan; pokušaj ponovno.';
    if(S.sheet?.kind==='startingLoad'){S.sheet.error=message;render();}else toast(message,true);
    return false;
  }
  S.stack.push({ v:'play' }); S.sheet = null; render();
  keepAwake(true).then(wakeHint);
  clearInterval(ticker); ticker = setInterval(tick, 200);
  return true;
}
// A step can be positioned before committing a checkpoint, without signalling it yet.
function positionStep(i, t0){
  const now = Date.now(), start = t0 || now, step = P.steps[i];
  P.i = i;
  cinemaPicker = null;
  P.lastBeep = null;
  P.stepClock = SessionClock.start(start);
  P.endAt = step?.dur ? start + step.dur * 1000 : 0;
  P.left = step?.dur ? Math.max(0, (P.endAt - now) / 1000) : 0;
  return step;
}
function signalStep(st){
  if (P.mode === 'ex') {
    // The legacy ready marker has no duration. The preparation that follows it has its own cue.
    if (st.kind === 'ready' || st.dur === 0 && !isWork(st)) return;
    workoutSignal(st.kind === 'manual' ? 'work' : st.go ? 'prep' : st.kind);
    return;
  }
  if (st.kind === 'work' || st.kind === 'manual') { beep(880, 260, 0.22); buzz(120); }
  else if (st.kind === 'switch') { beep(660, 200); buzz([80,60,80]); }
  else if (st.kind === 'rest' || st.kind === 'ready') { beep(520, 220); buzz(60); }
}
// t0 is the actual step start when catching up after the page was frozen.
function enterStep(i, t0){
  const step = positionStep(i, t0);
  if (!step) { finish(); return; }
  signalStep(step);
  return savePlay();
}
function remaining(){ const st = P.steps[P.i]; if (!st || !st.dur || cinemaRecordedStep()) return 0; return P.paused ? P.left : Math.max(0, (P.endAt - Date.now())/1000); }
function tick(){
  if (!P || P.done || P.paused) return;
  const st = P.steps[P.i]; if (!st) return;
  if (P.mode==='ex' && (st.kind==='ready' || st.dur===0&&!isWork(st))) {enterStep(P.i+1);render();return;}
  if ((st.dur || st.kind==='manual') && !cinemaRecordedStep()) {
    // a rep set ends on its own only with a set timer (Tajmer serije); otherwise it waits for the tap
    const manual=st.kind==='manual', timer=!manual||repSetSeconds(st.it||{})!==null, whole=Math.ceil(manual?cinemaManualRemaining(st):remaining());
    if (timer && whole <= 3 && whole >= 1 && P.lastBeep !== whole) {
      P.lastBeep = whole;
      if (P.mode === 'ex') workoutSignal('countdown');
      else beep(740, 120, 0.14);
    }
    if (whole <= 0 && timer) {
      if (manual) A.workoutSetDone({j:st.g,set:st.set,step:P.i,automatic:true});
      else timeUp();
      return;
    }
  }
  paintPlayer(false);
}
// A timed step ran out. If the page was frozen meanwhile (screen locked, app in the background), every step whose time
// also ran out is passed too, so the player shows where real time is instead of starting the next interval in full.
function timeUp(){
  const now = Date.now(), late = now - P.endAt; let t = P.endAt, i = P.i + 1;
  while (P.steps[i]?.dur && t + P.steps[i].dur * 1000 <= now) { t += P.steps[i].dur * 1000; i++; }
  const start=late>3000&&P.steps[i]?.kind!=='manual'?t:0;
  if(P.mode==='ex') {
    if(advanceWorkout({nextIndex:i,start,automatic:true})&&late>3000&&!P.done)toast('Dok je ekran bio ugašen, odbrojavanje je teklo dalje.');
    return;
  }
  for(let k=P.i;k<i;k++)markDone(k);
  enterStep(i,start);
  if (P.done) return;
  if (late > 3000) toast('Dok je ekran bio ugašen, odbrojavanje je teklo dalje.');
  paintPlayer(true);
}
// work the player saw you finish: a set closed with the ring, a timed set that ran to the end
function markDone(i){ if (isWork(P.steps[i])) P.doneSteps[i] = 1; }
function advanceWorkout({nextIndex,start=0,automatic=false,actualSec}){
  const before=P,sheet=S.sheet,pause=P.dosePause,picker=cinemaPicker;
  const keepExerciseOpen=sheet?.kind==='workoutExercise',left=remaining();
  P={...P,doneSteps:{...P.doneSteps}};delete P.dosePause;
  if(pause)P.paused=pause.wasPaused;
  if(actualSec!==undefined){
    P.steps=P.steps.slice();P.steps[P.i]={...P.steps[P.i],actualSec};
  }
  for(let k=P.i;k<nextIndex;k++)markDone(k);
  const next=positionStep(nextIndex,start);
  if(!next)prepareFinish();
  else if(keepExerciseOpen){
    const nextLeft=remaining();
    P.dosePause={wasPaused:P.paused,left:nextLeft};P.left=nextLeft;P.paused=true;
  }
  if(!savePlay()){
    P=before;cinemaPicker=picker;
    if(automatic){
      P.left=left;P.paused=true;
      const now=Date.now();
      P.clock=SessionClock.update(P.clock,now,true);
      P.stepClock=SessionClock.update(P.stepClock,now,true);
    }
    toast('Serija nije spremljena. Pokušaj ponovno.',true);render();return false;
  }
  if(P.done||sheet?.kind==='cinemaJournal')S.sheet=null;
  if(P.done){presentFinish();return true;}
  if(keepExerciseOpen)sheet.base=mtCanon(P.items);
  signalStep(next);
  render();return true;
}
function anyDone(){ return Object.keys(P.doneSteps || {}).length > 0; }
// something worth a history entry: work the player saw, or an exercise you marked yourself on the done screen
function anyCredit(){ return anyDone() || Object.keys(P.answers || {}).some(j => P.answers[j] === true || P.answers[j] === false); }
function workOf(j){ const out = []; P.steps.forEach((s, i) => { if (isWork(s) && s.g === j) out.push(i); }); return out; }
function setsDoneOf(j){
  if (P.mode === 'ex') return PlayerDose.completeSets(P,j);
  const w = workOf(j), n = (P.items[j] || {}).sets || 1; if (!w.length) return 0;
  return Math.min(n, Math.floor(w.filter(i => P.doneSteps[i]).length * n / w.length + 1e-9));
}
// every set done -> "Sve odrađeno"; some -> 'partial'; none (skipped or never reached) -> 'skip'. The last two don't count for progression.
function autoAnswer(j){ if (!workOf(j).some(i => P.doneSteps[i])) return 'skip'; return setsDoneOf(j) >= ((P.items[j] || {}).sets || 1) ? true : 'partial'; }
function lastAttemptStep(j){
  return P.steps[workOf(j).filter(index => P.doneSteps[index]).at(-1)];
}
function lrDefault(j){
  const step = lastAttemptStep(j);
  if (PlayerDose.validActualReps(step?.actualReps)) return step.actualReps;
  return Math.max(0, PlayerDose.at(step?.it || P.items[j] || {}, step?.set).reps - 2);
}
function lastRepsOf(j){ return P.lastReps && P.lastReps[j] != null ? Math.max(0, +P.lastReps[j] || 0) : lrDefault(j); }
function prepareFinish(){
  P.done = true; P.finishedAt = Date.now();
  if (!P.historyId) P.historyId = uid('h');
  P.clock=SessionClock.update(P.clock,P.finishedAt,true);
  P.secs = P.clock ? Math.round(P.clock.seconds) : Math.max(0,Math.round((P.finishedAt - P.startedAt)/1000));
  P.answers = {...P.answers}; P.lastReps = {...P.lastReps}; P.auto = {};
  if (P.mode === 'ex') (P.items || []).forEach((it, j) => { P.auto[j] = autoAnswer(j); if (P.answers[j] == null) P.answers[j] = P.auto[j]; });
  if (P.ref && P.ref.kind === 'protocol' && !P.musclePlan) {
    P.musclePlan = protocolMuscleWork(P).map(MuscleWork.pack);
    P.originalMusclePlan = protocolMuscleWork({ items:P.originalItems || P.items }).map(MuscleWork.pack);
  }
}
function presentFinish(){
  clearInterval(ticker); keepAwake(false);
  if (!P.quit) {
    if (P.mode === 'ex') workoutSignal('finish');
    else { beep(988, 420, 0.22); buzz([120,80,120]); }
  }
  if (top().v === 'play') render();
}
function finish(){
  prepareFinish();
  savePlay();
  presentFinish();
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
function jump(dir, stayPaused=false){
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
  P.paused = stayPaused; P.sheetPause = false; savePlay(); render();
}
function tapRing(){
  const st = P.steps[P.i]; if (!st) return;
  ensureAudio();
  if(P.paused){P.paused=false;P.endAt=Date.now()+P.left*1000;P.sheetPause=false;keepAwake(true);savePlay();paintPlayer(true);return;}
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
    v.hint = work && b && b.cue_hr ? fieldTxt(b.cue_hr) : (st.kind === 'rest' ? (st.label || 'Odmor') : '');
  } else {
    // a rest before another exercise shows that exercise: its name, video, set and load, so you can set it up
    const ahead = st.trans || st.nextEx || (st.kind === 'rest' && nextWork && nextWork.e !== st.e) ? nextWork : null;
    const src = ahead || st;
    const e = ahead ? ahead.e : (st.e || (nextWork && nextWork.e)); v.e = e;
    const it = ahead ? ahead.it : (st.it || (nextWork && nextWork.it));
    const groups = P.items.length;
    const lab = src.ss;
    v.title = st.kind === 'prep' ? (e ? e.name : P.title) : (ahead || st.kind === 'ready') ? 'Sljedeće: ' + (e ? e.name : '') : (e ? e.name : '');
    const displayStep = ['prep','rest','ready'].includes(st.kind) && nextWork ? nextWork : src;
    v.displayGroup=displayStep.g;
    const displayItem = displayStep.it || it;
    if (displayItem) {
      const set = PlayerDose.at(displayItem,displayStep.set || 1);
      const quantity = displayItem.measure === 'time' ? set.sec+' s' : set.reps+' pon.';
      v.meta = (lab ? lab.L+lab.k : (displayStep.g+1)+'/'+groups) + ' • ' + quantity +
        (displayItem.sides ? ' po strani' : '') + (set.kg ? ' · '+fmtKg(set.kg) : '') + (e && e.cat ? ' • '+e.cat : '');
    }
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
  if (!P) return false;
  P.clock=SessionClock.update(P.clock,Date.now(),!!P.paused||!!P.done);
  P.stepClock=SessionClock.update(P.stepClock,Date.now(),!!P.paused||!!P.done);
  const snapshot = { v:1, mode:P.mode, title:P.title, ref:P.ref || null, dose: P.dose === 'season' ? 'season' : null, items: P.mode === 'ex' ? P.items : null, i:P.i, left: P.done ? 0 : remaining(),
    startedAt:P.startedAt, clock:P.clock, stepClock:P.stepClock, notes:P.notes, swapUndo:P.swapUndo, doneSteps:P.doneSteps || {}, done:!!P.done, quit:!!P.quit, secs:P.secs || 0, finishedAt:P.finishedAt || 0,
    answers:P.answers || null, auto:P.auto || null, lastReps:P.lastReps || null, rir:P.rir || null, srpe:P.srpe ?? null, countAsDone:P.countAsDone === true,
    musclePlan:P.musclePlan, originalMusclePlan:P.originalMusclePlan, historyId:P.historyId, at: Date.now(),
    originalItems:P.originalItems, liveBaseItems:P.liveBaseItems, sessionOnly:!!P.sessionOnly, liveDoseVersion:P.liveDoseVersion, cardIndex:P.cardIndex,
    splitRepSides:P.splitRepSides, sidePrepSec:P.sidePrepSec, exercisePrepSec:P.exercisePrepSec,
    liveSchedule:P.mode === 'ex' && P.liveDoseVersion === 1 ? PlayerDose.packSteps(P.steps) : undefined };
  try { localStorage.setItem(PLAY_KEY,JSON.stringify(snapshot)); return true; } catch(e) { return false; }
}
function clearPlay(){ try { localStorage.removeItem(PLAY_KEY); } catch(e){} }
// Rating/answer controls follow the same checkpoint rule as the live dose editor:
// a rejected write keeps the previous choice visible and available after reload.
function savePlayerChoice(keys,change){
  const before=keys.map(k=>({k,exists:Object.prototype.hasOwnProperty.call(P,k),value:P[k]===undefined?undefined:clone(P[k])}));
  change();
  if (savePlay()) return true;
  before.forEach(x=>{if(x.exists)P[x.k]=x.value;else delete P[x.k];});
  toast('Promjena nije spremljena na uređaj. Pokušaj ponovno prije zatvaranja treninga.',true);
  return false;
}
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
  if (s.done && (S.log.some(l => s.historyId ? l.historyId === s.historyId : l.at === s.finishedAt && l.kind === s.ref.kind && l.refId === s.ref.id) ||
    (s.historyId && (S._deleted || []).includes('log/' + s.historyId)))) { clearPlay(); return; }
  S.sheet = { kind:'resume', s }; render();
}
function restorePlay(s){
  const f = s.mode === 'field' ? S.field[s.ref.id] : null;
  if (s.mode === 'field' ? !f : !(s.items || []).length) return false;
  audioMode(true); ensureAudio();
  S.workoutRaw={};
  const now = Date.now(), away = s.done ? 0 : Math.max(0, now - (s.at || now));   // time away is not training time
  P = { i:0, paused:false, done:!!s.done, endAt:0, left:0, lastBeep:null, mode:s.mode, title:s.title, ref:s.ref, items: f ? undefined : s.items, f: f || undefined, dose: f && s.dose === 'season' ? 'season' : f ? 'full' : undefined,
    steps: f ? stepsFromField(s.dose === 'season' ? fieldDose(f) : f) : [], startedAt:(s.startedAt || now) + away, doneSteps:s.doneSteps || {}, quit:!!s.quit, secs:s.secs || 0, finishedAt:s.finishedAt || 0 };
  P.clock=SessionClock.resume(s.clock,now);
  P.stepClock=SessionClock.resume(s.stepClock,now)||SessionClock.start(now);
  P.notes=isPlainObj(s.notes)?Object.fromEntries(Object.entries(s.notes).filter(([j,note])=>/^\d+$/.test(j)&&typeof note==='string').map(([j,note])=>[j,note.slice(0,2000)])):{};
  P.swapUndo=isPlainObj(s.swapUndo)?Object.fromEntries(Object.entries(s.swapUndo).filter(([j,it])=>/^\d+$/.test(j)&&Number(j)<(s.items||[]).length&&isPlainObj(it)&&S.ex[it.exId]&&Number.isInteger(it.sets)&&it.sets>0&&it.sets<=20).map(([j,it])=>[j,PlayerDose.items([it])[0]])):{};
  if (!f) {
    P.items = PlayerDose.items(s.items);
    const validItems=items=>Array.isArray(items)&&items.length>0&&items.every(it=>it&&typeof it.exId==='string');
    if(validItems(s.liveBaseItems)&&s.liveBaseItems.length===P.items.length)P.liveBaseItems=clone(s.liveBaseItems);
    const baseline = validItems(s.originalItems) && (P.liveBaseItems || s.originalItems.length === P.items.length) ? s.originalItems : s.items;
    P.originalItems = clone(baseline); P.sessionOnly=!!s.sessionOnly; P.liveDoseVersion = 1;
    P.cardIndex = [0,1,2].includes(s.cardIndex) ? s.cardIndex : 0;
    P.sidePrepSec=validSidePrep(s.sidePrepSec)?s.sidePrepSec:workoutSidePrepSeconds(5);
    P.exercisePrepSec=validSidePrep(s.exercisePrepSec)?s.exercisePrepSec:workoutSidePrepSeconds(5);
    P.splitRepSides=false;
    if (s.liveSchedule) {
      const timeline = PlayerDose.restoreSteps(s.liveSchedule,P.items,id => S.ex[id] || { id, name:'Vježba', steps:[] });
      if (!timeline) { P = null; return false; }
      P.steps = timeline;
      const savedSwitch=timeline.find((step,index)=>index>(s.i||0)&&step.kind==='switch'&&step.side==='Promjena strane')?.dur;
      if(!validSidePrep(s.sidePrepSec)&&validSidePrep(savedSwitch))P.sidePrepSec=savedSwitch;
      P.splitRepSides=typeof s.splitRepSides==='boolean'?s.splitRepSides:
        !timeline.some(step=>step.kind==='manual'&&step.it?.sides&&!PlayerDose.splitSide(step));
    } else P.steps = liveStepsFromItems(P.items); // older checkpoints use combined rep sides and original step positions
  }
  if (s.answers) P.answers = s.answers; if (s.auto) P.auto = s.auto; if (s.lastReps) P.lastReps = s.lastReps; if (s.countAsDone === true) P.countAsDone = true;
  if (P.done) P.historyId = typeof s.historyId === 'string' && /^h[a-z0-9]+$/.test(s.historyId) ? s.historyId : uid('h');
  // A finished player saved by an older version has no historical muscle profile.
  if (P.done && P.ref.kind === 'protocol') P.musclePlan = P.items.map((it,j) => {
    const snap = MuscleWork.sanitize(Array.isArray(s.musclePlan) && s.musclePlan[j]);
    return snap && snap.source === 'planned' && snap.exerciseId === it.exId ? MuscleWork.pack(snap) : null;
  });
  if (P.done && P.ref.kind === 'protocol') P.originalMusclePlan = P.originalItems.map((it,j) => {
    const snap = MuscleWork.sanitize(Array.isArray(s.originalMusclePlan) ? s.originalMusclePlan[j] : Array.isArray(s.musclePlan) && s.musclePlan[j]);
    return snap && snap.source === 'planned' && snap.exerciseId === it.exId ? MuscleWork.pack(snap) : null;
  });
  if (isPlainObj(s.rir)) P.rir = s.rir; if (Number.isFinite(s.srpe) && s.srpe >= 0 && s.srpe <= 10) P.srpe = s.srpe;
  S.stack.push({ v:'play' }); S.sheet = null;
  if (!P.done) {   // back at the same step; a timed one waits, paused, with the time that was left
    P.i = Math.max(0, Math.min(s.i || 0, P.steps.length - 1));
    const st = P.steps[P.i];
    if (st && st.dur) { P.paused = true; P.left = Number.isFinite(s.left) && s.left >= 0 && s.left <= st.dur ? s.left : st.dur; }
    else P.paused=s.clock?.paused===true;
    if (st?.kind==='manual' && !P.doneSteps[P.i] && (!s.liveSchedule || st.targetSec==null)) {
      st.targetSec=cinemaManualTarget(st);
      // A legacy stopwatch can already be past the new target. Give it a
      // fresh countdown instead of recording repetitions as soon as it opens.
      if (cinemaManualRemaining(st)===0) P.stepClock=SessionClock.start(now);
    }
    savePlay(); keepAwake(true); clearInterval(ticker); ticker = setInterval(tick, 200);
  }
  render();
  return true;
}
// leaves the player without saving anything more
function leavePlay(){ S.workoutRaw={}; clearInterval(ticker); keepAwake(false); audioMode(false); P = null; if (top().v === 'play') S.stack.pop(); render(); }
// Every partial session gets the same review/rating step; progression eligibility
// does not decide whether actual work can be reviewed before it is saved.
function saveSoFar(){
  S.sheet = null;
  if (!anyDone()) { clearPlay(); leavePlay(); toast('Trening nije spremljen: još ništa nije odrađeno do kraja.'); return; }
  P.quit = true; P.paused = false; finish();
}
// Keep exercise details independent of age. The existing 2000-record limit is reported when reached.
const LOG_MAX = 2000;
function trimLog(){
  if (S.log.length <= LOG_MAX) return '';
  const n = S.log.length - LOG_MAX; S.log = S.log.slice(0, LOG_MAX);
  // 'zapisa': the history also holds test results and exercises tried from the library
  return 'Povijest ima ' + LOG_MAX + ' zapisa, pa ' + (n === 1 ? 'je najstariji uklonjen' : plural(n, 'je uklonjen ' + n + ' najstariji', 'su uklonjena ' + n + ' najstarija', 'je uklonjeno ' + n + ' najstarijih')) + '. Stariji ostaju samo u kopijama koje si izvezao.';
}
// the history entry of the session as it stands (the done screen shows its load before it is saved)
function sessionEntry(){
  const entry = { name: P.title, kind: P.ref ? P.ref.kind : 'protocol', refId: P.ref ? P.ref.id : null, at: P.finishedAt || Date.now(), secs: P.secs || 0 };
  if (P.countAsDone === true) entry.countsAsDone = true;
  if (P.mode === 'ex') entry.items = (P.items || []).map((it, j) => {
    const a = P.answers && P.answers[j] != null ? P.answers[j] : autoAnswer(j), n = it.sets || 1, did = setsDoneOf(j);
    const x = { exId: it.exId, measure: it.measure, sets: it.sets, reps: it.reps, sec: it.sec, kg: it.kg || 0, sides: !!it.sides, done: a === true || a === 'partial' };   // partly done (even no whole set, e.g. one side of a hold) = done + setsDone; a failure is only 'Nisam uspio'
    for(const key of ['targetRir','targetSir'])if(Number.isFinite(it[key]))x[key]=it[key];
    if(typeof P.notes?.[j]==='string'&&P.notes[j].trim())x.note=P.notes[j].trim().slice(0,2000);
    if (Array.isArray(it.repsList)) x.repsList = it.repsList.slice();
    if (a === 'skip') { x.skipped = true; x.setsDone = 0; }
    else if (a !== true && did < n) x.setsDone = did;
    if (a === false && it.measure !== 'time') x.lastReps = lastRepsOf(j);
    if (P.liveDoseVersion === 1) Object.assign(x,PlayerDose.logDose(P,j,a).fields);
    else { const rl = rirLists(j, it); if (rl) x[it.measure === 'time' ? 'sirList' : 'rirList'] = rl; }
    return x;
  });
  if (P.mode === 'field' && P.f) {
    entry.load = fieldDoneLoad();
    if (!HistoryModel.fieldSummary(entry).complete) entry.fieldLoadStatus = 'partial';
  }
  if (entry.kind === 'protocol' && entry.items) {
    entry.muscleWork = entry.items.map((item,index) => MuscleWork.pack(MuscleWork.completedFromPlan(P.musclePlan && P.musclePlan[index], item)));
  }
  return entry;
}
// writes the session (also a partly done one) to the history and counts progression
function logSession(){
  const entry = sessionEntry();
  // A retry of this finished player must not apply progression or add its muscle work twice.
  if (S.log.some(l => l.historyId === P.historyId || (l.at === entry.at && l.kind === entry.kind && l.refId === entry.refId)) ||
      (S._deleted || []).includes('log/' + P.historyId)) {
    const saved = persist();
    if (saved) clearPlay();
    return { news: [], cut: '', saved };
  }
  // the session's load (model LM1) as computed now, and his rating of the whole session (1–10) when he gave one
  if (Number.isFinite(P.srpe) && P.srpe >= 0 && P.srpe <= 10) entry.srpe = P.srpe;
  const effort = computeSession(entry);
  if (effort.incomplete) entry.load2Status = effort.incompleteReason === 'field' ? 'needsFieldData' : 'needsDose';
  else { entry.load2 = effort; const au=HistoryModel.sessionAU(entry); if (au !== null) entry.load2.au = au; }
  const previousLog = S.log;
  const previousProtocol = entry.kind === 'protocol' && S.pr[entry.refId];
  entry.historyId = P.historyId;
  const news = applyProgress();
  S.log = [entry, ...previousLog];
  const test = masFromPlay();
  if (test) S.log.splice(1, 0, { ...test, parentSessionId:entry.historyId });
  S.log.sort((a,b) => b.at-a.at);
  const cut = trimLog();
  if (!persist()) {
    S.log = previousLog;
    if (previousProtocol) S.pr[entry.refId] = previousProtocol;
    return { news: [], cut: '', saved:false }; // the finished player snapshot remains available for retry
  }
  clearPlay();
  return { news, cut, saved:true };
}
const newsMsg = news => (news.length > 1 ? 'Novi prijedlozi' : 'Novi prijedlog') + ' na stranici Napredak: ' + news.join(', ');
// short durations in seconds, the rest in whole minutes ("45 min", not "45:12 min")
function fmtDur(s){ s = Math.round(s || 0); return s < 60 ? s + ' s' : Math.round(s / 60) + ' min'; }
// reps you actually did in a logged item: per-set reps, only the sets done, the failed last set as you entered it
function repsDone(x){
  return HistoryModel.repetitionTotal(x);
}
// the done screen tells the week as it will be once this session is saved
function weekAfter(entry){
  const saved = S.log; S.log = [Object.assign({ kind: P.ref.kind, refId: P.ref.id, at: P.finishedAt || Date.now() }, entry && { items: entry.items, countsAsDone: entry.countsAsDone })].concat(saved);
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
// the next dose after N good sessions in a row; item null means "time for a harder variation". recorded: the last
// recorded item of this exercise (or a function returning it); with tapped reserve the next kg comes from its RIR-adjusted
// e1RM (MODEL 1.9), otherwise from the reps-to-failure estimate as before
function nextDose(e, it, recorded){
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
    const nx = nextLoad(e, it.kg), rec = typeof recorded === 'function' ? recorded() : recorded, e1r = nx ? rirE1(rec) : null;
    // with reserve: the reps the next load allows at the target RIR; without: up to ~10 % over the reps-to-failure max
    const fit = !nx ? -1 : e1r ? Math.floor(30 * (e1r / nx - 1) + 1e-6) - Math.ceil(Number.isFinite(it.targetRir) ? it.targetRir : 2)
      : Math.floor(30 * (e1rm(it.kg, reps) * 1.1 / nx - 1) + 1e-6);
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
  if (!P || P.mode !== 'ex' || !P.ref || P.ref.kind !== 'protocol' || P.liveBaseItems) return [];
  const p = S.pr[P.ref.id]; if (!p) return [];
  P.answers = P.answers || {}; P.lastReps = P.lastReps || {};
  const out = [];
  (p.items || []).forEach((it, j) => {
    const e = S.ex[it.exId]; const was = P.items[j];
    if (!e || !was || was.exId !== it.exId) return;
    if (doseSig(PlayerDose.items([was])[0])!==doseSig(PlayerDose.items([it])[0])) return;
    const answer = P.answers[j] != null ? P.answers[j] : autoAnswer(j);
    if (PlayerDose.logDose(P,j,answer).fields.liveDoseChanged) return;
    if (!PROG_CATS[e.cat] && !(it.kg > 0) && !(e.cat === 'Rehab' && it.measure === 'time' && +e.phase !== 1)) return;
    out.push({ j, e, it, prog: !!p.program, next: nextDose(e, it, () => liveRecorded(j)) });
  });
  return out;
}
const progN = () => S.settings.progN === 3 ? 3 : 2;
// answers: true (or not touched) = every set done, false = failed; 'partial' and 'skip' leave the counters as they are
// 1.21: a session with every set done counts 'ok' only when its tapped reserve agrees (reserveAnswer): 'hold' = RIR 0 on two or
// more sets (keep the weight), 'hard' = one of the last two work sets below the target RIR − 0.5
const answerOf = j => { const a = P.answers ? P.answers[j] : undefined; return a === false ? 'fail' : a == null || a === true ? (painHoldsAt(j) ? 'pain' : reserveAnswer(j)) : 'none'; };
// counts sessions with every set done (ok) or not (fail); doses change only when you accept a suggestion
function applyProgress(){
  const cands = progCandidates(); if (!cands.length) return [];
  const p = S.pr[P.ref.id]; const n = clone(p); delete n.id; const news = [];
  cands.forEach(c => {
    if (c.prog) return;
    const it = n.items[c.j], a = answerOf(c.j);
    if (a === 'ok') { it.ok = (it.ok || 0) + 1; it.fail = 0; if (it.ok === progN() && c.next.item) news.push(c.e.name); }
    else if (a === 'fail') { it.ok = 0; it.fail = (it.fail || 0) + 1; it.snoozeOk = 0; }
    else if (a === 'hold') { it.ok = 0; it.snoozeOk = 0; }
  });
  n.updatedAt = Date.now();
  S.pr[P.ref.id] = Object.assign({ id: P.ref.id }, n);
  return news;
}
function doneMsg(c){
  const N = progN(), it = c.it, a = answerOf(c.j);
  if (a === 'none') return c.prog ? '' : 'Ne računa se za napredak';
  if (a === 'pain') return c.prog ? '' : 'Bol ujutro: ostaje ' + doseBase(it) + ', bez povećanja';
  if (a === 'hold') return c.prog ? '' : 'Dvije serije bez rezerve (RIR 0): ostaje ' + doseBase(it);
  if (a === 'hard') return c.prog ? '' : 'Rezerva ispod cilja: ostaje ' + doseBase(it) + ', ne računa se za povećanje';
  if (c.prog) return a === 'fail' ? 'Zabilježeno' : '';
  if (a === 'fail') return it.prev && (it.fail || 0) + 1 >= 2 ? 'Dvaput zaredom: na stranici Napredak možeš vratiti ' + doseBase(it.prev) : 'Zabilježeno: ostaje ' + doseBase(it) + ', probaj opet';
  const ok = (it.ok || 0) + 1;
  if (ok >= N) return c.next.item ? 'Spremno: prijedlog ' + c.next.text + ' čeka te na stranici Napredak' : c.next.text;
  return ok + '/' + N + ' · još ' + (N - ok) + ' ' + plural(N - ok, 'ovakav trening', 'ovakva treninga', 'ovakvih treninga');
}
// the reserve tapped in this session (rirLists: per done set, null = not tapped); untapped sets keep the old rule
function reserveAnswer(j){
  const it = P && P.items && P.items[j]; if (!it) return 'ok';
  const timed = it.measure === 'time';
  return HistoryStore.reserveVerdict(rirLists(j, it), it[timed ? 'targetSir' : 'targetRir'], timed);   // the same rule as history edits
}
// MODEL 1.9: a set's e1RM with its tapped RIR, kg × (1 + (reps + RIR) / 30); a tap above the trusted range counts as RIR 4 and
// reps + RIR at most 12, so more reserve never scores lower; an untapped set counts as reps to failure (up to 10); the session
// value is the median. null when no set has a tap.
function rirE1(x){
  const rows = x && typeof HistoryModel !== 'undefined' ? HistoryModel.recordedRows(x) : null;
  if (!rows || !rows.some(r => r.rir !== null && !r.failed)) return null;
  const sets = rows.filter(r => r.kg > 0 && r.reps > 0).map(r => r.rir !== null
    ? r.kg * (1 + Math.min(r.reps + Math.min(r.rir, 4), 12) / 30) : e1rm(r.kg, Math.min(r.reps, 10))).sort((a, b) => a - b);
  if (!sets.length) return null;
  const m = sets.length >> 1;
  return sets.length % 2 ? sets[m] : (sets[m - 1] + sets[m]) / 2;
}
// this session's recorded item j (as it will be saved), or the latest saved item of an exercise
function liveRecorded(j){ try { return sessionEntry().items[j] || null; } catch(e) { return null; } }
const lastRecorded = exId => { for (const l of S.log) { if (l.at > Date.now()) continue; const x = (l.items || []).find(i => i && i.exId === exId && !i.skipped); if (x) return x; } return null; };
// morning pain 1–5 holds progression for the painful area on the day of the session (TodayModel.painHolds)
function painHoldsAt(j){
  const checks = S.settings.morningChecks;
  if (!checks || typeof TodayModel === 'undefined') return false;
  const it = P && P.items && P.items[j], check = checks[dateKey(P.startedAt || Date.now())];
  return !!it && !!check && TodayModel.painHolds(check, S.ex[it.exId], it.exId);
}
// Napredak opens on a useful chart: deadlift, back squat, then the first main barbell lift, then any exercise with data in
// the chosen period; the first recorded exercise only when nothing has any.
const MAIN_LIFTS = ['deadlift','back-squat'];
function defaultChartExercise(candidates, hasTrend){
  const main = id => S.ex[id] && S.ex[id].cat === 'Snaga' && loadKind(S.ex[id]) === 'bar';
  return MAIN_LIFTS.find(id => candidates.includes(id) && hasTrend(id)) || candidates.find(id => main(id) && hasTrend(id)) ||
    candidates.find(hasTrend) || candidates[0];
}
/* ---------- the Progress tab ---------- */
function progSuggestions(){
  const N = progN(), out = [];
  Object.values(S.pr).forEach(p => { if (p.program) return; (p.items || []).forEach((it, j) => {
    const e = S.ex[it.exId]; if (!e) return;
    if (!(it.kg > 0) && it.measure !== 'time' && needsKg(e)) { if ((it.ok || 0) + (it.fail || 0) > 0) out.push({ kind:'nokg', p, j, e, it }); return; }
    if (it.prev && (it.fail || 0) >= 2) out.push({ kind:'revert', p, j, e, it });
    else if ((it.ok || 0) >= N && (it.ok || 0) > (it.snoozeOk || 0)) {
      const nd = nextDose(e, it, () => lastRecorded(it.exId));
      if (!nd.item && (it.snoozeOk || 0) > 0) return;   // a harder variation you already acknowledged stays quiet until the dose changes or a session fails
      out.push({ kind: nd.item ? 'up' : 'variant', p, j, e, it, nd });
    }
    else if ((it.ok || 0) > 0 && (it.ok || 0) < N) out.push({ kind:'way', p, j, e, it });
  }); });
  return out;
}
const e1rm = (kg, reps) => kg * (1 + reps / 30);   // Epley estimate of the one-rep max
function progHistory(now=Date.now()){
  const by = Object.create(null);
  S.log.filter(l => l.at <= now).slice().reverse().forEach(l => (l.items || []).forEach(x => { if (x.skipped) return; (by[x.exId] = by[x.exId] || []).push(Object.assign({ at: l.at }, x)); }));
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
    if (x.exId !== exId) return;
    const record=bestRecordedLift(x);
    if (record) best=Math.max(best,record.v);
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
function progressDosingSections(){
  const g = GOALS[S.settings.goal] ? S.settings.goal : null, b = ballN(), m = matchDay(), pk = plateKg();
  const lifts = Object.values(S.ex).filter(e => loaded(e) && loadKind(e) !== 'kb').map(e => ({ e, v: bestE1(e.id) })).filter(x => x.v > 0).sort((a, b2) => b2.v - a.v).slice(0, 8);
  const kgs = v => String(v).replace('.', ','), nbk = v => fmtKg(v).replace(' ', '&nbsp;');
  const rng = (e, v, k) => { const G = GOALS[k];
    if (G.rir) return e.cat === 'Snaga' && loadKind(e) !== 'db' ? kgs(goalDose(e, v, G).kg) : '—';
    const lo = loadFor(e, v, G.reps[1]), hi = loadFor(e, v, G.reps[0]); return lo === hi ? kgs(lo) : kgs(lo) + '–' + kgs(hi); };
  return [{ title:'Cilj ovog razdoblja', hint:'Snaga, mišićna masa, izdržljivost ili eksplozivnost', html:'<div class="goal">' +
    Object.keys(GOALS).map(k => '<button class="'+(g === k ? 'on' : '')+'" data-a="setGoal" data-v="'+k+'" aria-pressed="'+(g === k)+'"><b>'+GOALS[k].name+'</b><span>'+goalDesc(k).map(nwNum).join(' · ')+'</span></button>').join('') + '</div>' +
    (g ? '<p class="sub" style="margin:10px 17px 0;line-height:19px">Otvori protokol za teretanu (npr. Trening A): dobit ćeš prijedlog serija, ponavljanja, odmora i kilograma za cilj „'+esc(GOALS[g].name)+'”. Ništa se ne mijenja dok prijedlog ne potvrdiš.'+(GOALS[g].rir ? ' Mijenjaju se samo glavne vježbe sa šipkom i landmine; bučice, girja i skokovi ostaju kako jesu.' : '')+'</p>' : '') },
    { title:'Nogometni tjedan', hint:'Treninzi s loptom i datumi utakmica', html:'<div class="chart">' +
      '<div class="prow" style="border:0;min-height:52px"><span class="k">Treninzi s loptom</span><div class="step"><button class="sbtn" data-a="setBall" data-d="-1" aria-label="Treninzi s loptom: smanji">−</button><b>'+b+'</b><button class="sbtn" data-a="setBall" data-d="1" aria-label="Treninzi s loptom: povećaj">+</button></div></div>' +
      // "Nema utakmice" sits beside the label, so the seven day buttons share the whole row (44 px tall, about 40 px wide)
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin:4px 0 8px"><span class="label" style="padding:0">Utakmica</span><button class="chip" data-a="setMatch" data-v="-1" aria-pressed="'+(m < 0)+'">Nema utakmice</button></div><div class="drow" role="group" aria-label="Dan utakmice">' + DAYS.map((L, i) => '<button class="dchip" data-a="setMatch" data-v="'+i+'" aria-pressed="'+(m === i)+'" aria-label="'+DAYNAMES[i]+'">'+L+'</button>').join('') + '</div>' +
      matchDatesHtml() +
      '<div class="advice">'+esc(weekAdvice())+'</div></div>' },
    { title:'Teren', hint:'Tvoja najveća brzina', html:'<div class="chart">' +
      '<div class="prow" style="border:0;min-height:52px"><label class="k" for="topkmh" style="display:flex;align-items:center;min-height:44px">Najveća brzina (km/h)</label><input id="topkmh" class="input tkm" type="text" inputmode="decimal" enterkeyhint="done" autocomplete="off" value="' + kmhTxt(topKmh()) + '" placeholder="28,8"></div>' +
      '<p class="sub" style="margin:4px 0 0;font-size:13px;line-height:19px">Postotak brzine u treninzima na terenu (npr. 90&nbsp;% brzine) računa se od nje. Zadano 28,8&nbsp;km/h (8&nbsp;m/s); upiši svoju najveću brzinu iz STATSportsa, od 20 do 40&nbsp;km/h.</p></div>' },
    { title:'Moje težine', hint:'Procjena iz zadnjih osam tjedana', html:
    (lifts.length ? '<div class="chart" style="padding-top:8px;padding-bottom:4px;overflow-x:auto"><table class="kg"><tr><th>Vježba</th>' + ['Snaga', 'Hipertr.', 'Izdrž.', 'Ekspl.'].map(t => '<th style="padding-left:8px">' + t + '</th>').join('') + '</tr>' +
      lifts.map(x => '<tr><td><b>'+esc(x.e.name)+'</b><span>max ≈ '+esc(fmtKg(Math.round(x.v * 2) / 2))+(loadKind(x.e) === 'db' ? ' po bučici' : '')+'</span></td>' + Object.keys(GOALS).map(k => '<td class="'+(g === k ? 'on' : '')+'">'+rng(x.e, x.v, k)+'</td>').join('') + '</tr>').join('') + '</table></div>'
      : '<p class="sub" style="margin:0 17px;line-height:20px">Kad odradiš trening s upisanim kilogramima, ovdje se iz tvojih serija procijeni maksimum i kilogrami za svaki cilj.</p>') +
    '<span class="label" style="display:block;padding:14px 2px 8px 17px">Najmanje ploče na šipki</span><div class="chips" style="margin-top:0">' + PLATES.map(v => '<button class="chip" data-a="setPlate" data-v="'+v+'" aria-pressed="'+(pk === v)+'">'+fmtKg(v)+'</button>').join('') + '</div>' +
    '<p class="sub" style="margin:12px 17px 0;line-height:19px">Postotak je udio tvog procijenjenog maksimuma, težine koju možeš podići jednom. Maksimum se procjenjuje Epleyjevom formulom iz tvojih serija: serija s više od 10&nbsp;ponavljanja računa se kao 10, a skokovi se ne računaju. Kilogrami se zaokružuju na ono što možeš složiti – šipka: 20&nbsp;kg i parovi ploča od '+nbk(pk)+' (korak najmanje '+nbk(2 * pk)+'); landmine: ploče na slobodnom kraju šipke; bučice: tvoji parovi, kg po bučici; girja: 20&nbsp;kg. Ekspl.: 3&nbsp;brza ponavljanja s težinom za 5, za vježbe snage sa šipkom i landmine (bučice, girja i skokovi ne).</p>' }];
}
// what a chart draws for one exercise (h oldest first; the last n points): with kilograms only the sessions that had them
// (the shipped 0 kg or a first try would read as progress); while the load stays the same, the reps you did, so reps
// added at one load show too
function heaviestSet(x) {
  return (HistoryModel.recordedRows(x) || []).reduce((max,r)=>r.reps>0?Math.max(max,r.kg||0):max,0);
}
function liftSeries(h, n){
  const time = !!h.length && h[h.length - 1].measure === 'time';
  let pts = h.filter(x => (x.measure === 'time') === time && !x.historySetsUnknown && !x.historyRepsUnknown &&
    Number.isFinite(time ? HistoryModel.timeTotal(x) : repsDone(x)));
  if (!time && pts.some(x => heaviestSet(x)>0)) pts = pts.filter(x => heaviestSet(x)>0);
  if (n) pts = pts.slice(-n);
  const kg = !time && pts.some(x => heaviestSet(x) !== heaviestSet(pts[0]));
  return { pts, unit: time ? ' s' : kg ? ' kg' : ' pon.', loaded: pts.some(x=>heaviestSet(x)>0),
    val: x => time ? HistoryModel.timeTotal(x) : kg ? heaviestSet(x) : repsDone(x) };
}
// A record pairs the repetitions and weight of the same performed set.
function bestRecordedLift(x){
  if (x.measure==='time') return null;
  let best=null;
  for (const row of HistoryModel.recordedRows(x) || []) {
    if (!(row.kg>0 && row.reps>0)) continue;
    const v=e1rm(row.kg,Math.min(row.reps,10));
    if (!best || v>best.v) best={v,kg:row.kg,r:row.reps};
  }
  return best;
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
  if (!x || x.skipped || x.historySetsUnknown || x.historyRepsUnknown) return o;
  const e = S.ex[x.exId], timed=x.measure==='time', rows=HistoryModel.recordedRows(x) || [];
  for (const r of rows) {
    if (!r.sides) continue;
    if (timed) o.secs+=(r.sec||0)*r.sides;
    else { const reps=(r.reps||0)*r.sides; o.reps+=reps; o.kg+=reps*(r.kg||0); }
  }
  if (runDrill(e)) {
    const zi = Math.max(0, RUN_INT.indexOf(e.runInt));
    o.m = (timed ? rows.reduce((n,r)=>n+(r.sides||0),0) : o.reps)*e.runM; o.z[zi] = o.m;
    if (zi >= 2) o.hsr = o.m; if (zi === 3) o.spr = o.m;   // visoko and sprint count as fast running (brzo trčanje)
  }
  return o;
}
// one exercise over time (oldest first), one point per session: the volume load when sessions in the range had kilograms (the
// 0 kg ones are left out of that chart), otherwise reps or seconds; metres for an own running drill
function incompleteRecordedDose(x) {
  if (x.historySetsUnknown || x.historyRepsUnknown || x.historyKgUnknown || x.historySecUnknown) return true;
  const rows = HistoryModel.recordedRows(x);
  return !rows || rows.some(r=>r.sides===null || (x.measure==='time'
    ? r.sec===null : r.reps===null || (Object.prototype.hasOwnProperty.call(x,'kgList') && r.kg===null)));
}
function exLoadSeries(exId, days, bounds){
  const e = S.ex[exId], now = bounds?.now ?? Date.now();
  const from = bounds ? bounds.from ?? 0 : days ? calDay(now, -days) : 0;
  const history = bounds?.history ? bounds.history.slice().reverse() : historyOf(exId, now);
  const all = history.filter(x=>x.at>=from);
  const h = all.filter(x=>!x.historySetsUnknown && !x.historyRepsUnknown).reverse();
  if (!h.length) return all.length?{kind:'reps',pts:[],partial:true}:null;
  const time = h[h.length - 1].measure === 'time';
  let pts = h.filter(x => (x.measure === 'time') === time);
  const kind = runDrill(e) ? 'm' : time ? 'secs' : pts.some(x => heaviestSet(x) > 0) ? 'kg' : 'reps';
  if (kind === 'kg') pts = pts.filter(x => heaviestSet(x) > 0);
  const out = [];
  pts.forEach(x => {
    const rows=HistoryModel.recordedRows(x);
    const known=rows && rows.some(r=>r.sides!=null && (kind==='secs' ? r.sec!=null : kind==='kg' ? r.reps!=null && r.kg!=null : time && kind==='m' ? true : r.reps!=null));
    if (!known) return;
    const v = itemLoad(x)[kind], last = out[out.length - 1];
    if (last && last.t === x.at) { last.v += v; last.xs.push(x); } else out.push({ t: x.at, v, xs: [x] }); });
  return { kind, pts: out, partial:all.some(incompleteRecordedDose) };
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
// Historical field work is the saved evidence only. A current template/MAS cannot
// reconstruct an older session whose distance or speed breakdown was not saved.
function fieldLogLoad(l){
  return l && l.load && typeof l.load === 'object' && !Array.isArray(l.load) ? l.load : null;
}
// A five-minute result proves total distance and average speed, not time spent
// above a speed threshold. Keep those unmeasured distances absent, including 0.
function masResultLoad(metres, workMinutes){
  const load = { min:workMinutes, dose:'full', source:'mas-test' };
  if (Number.isInteger(metres) && metres >= 600 && metres <= 2400 && workMinutes === 5) {
    load.m = metres; load.mas = Math.round(metres / 3) / 100;
  }
  return load;
}
// A correction to a recorded five-minute distance changes the paired test in the
// same transaction. Clearing an established measurement needs deleting the pair,
// rather than silently leaving an old MAS result behind a blank session value.
function masHistoryChange(current,replacement,logs,newId){
  if (!replacement || current.kind !== 'field' || current.refId !== 'mas-test-5-min') return {ok:true,entry:replacement};
  const old=current.load || {}, load=replacement.load || {};
  const changed=old.m !== load.m, minutesChanged=old.min !== load.min;
  if (!changed && !minutesChanged) return {ok:true,entry:replacement};
  const linked=logs.filter(test=>pairedMas(current,test));
  if (linked.length>1) return {ok:false,error:'Uz trening postoji više MAS rezultata. Ispravak nije spremljen; prvo provjeri povezane zapise.'};
  if ((linked.length || load.m != null) && load.min !== 5) return {ok:false,error:'MAS rezultat vrijedi za 5 minuta rada. Zadrži radno vrijeme 5 min ili odustani od izmjene.'};
  if (!changed) return {ok:true,entry:replacement};
  if (load.m == null && (linked.length || Number.isFinite(old.m))) return {ok:false,error:'Povezani poznati MAS rezultat ne može se ukloniti praznim poljem. Upiši točne metre ili izbriši trening i povezani rezultat.'};
  if (load.m == null) return {ok:true,entry:replacement};
  if (!Number.isInteger(load.m) || load.m < 600 || load.m > 2400) return {ok:false,error:'Za MAS test upiši cijele metre u 5 minuta, od 600 do 2400 m.'};
  const value=Math.round(load.m / 3) / 100;
  const entry={...replacement,load:{...load,mas:value,source:'mas-test'}};
  const test={...(linked[0] || {historyId:newId,kind:'test',test:'mas',name:'MAS test',unit:'m/s',parentSessionId:current.historyId}),at:entry.at,dist:load.m,value,editedAt:entry.editedAt};
  return linked.length ? {ok:true,entry,test} : {ok:true,entry,newTest:test};
}
// Repair only the exact legacy algorithm signature and a unique, explicit saved
// parent/result pair. Intentional edits, ambiguous pairs and unknown logs survive.
function repairKnownMasLoads(logs){
  if (!Array.isArray(logs)) return logs;
  let changed = false;
  const repaired = logs.map(entry => {
    if (!entry || entry.kind !== 'field' || entry.refId !== 'mas-test-5-min' || !entry.historyId || entry.editedAt) return entry;
    const load = entry.load;
    if (!load || typeof load !== 'object' || Array.isArray(load) || load.source || load.dose !== 'full' || load.min !== 5 ||
        !Number.isFinite(load.mas) || load.mas < 2 || load.mas > 8 ||
        Object.keys(load).some(k => !['m','hsr','spr','min','zones','dose','mas'].includes(k))) return entry;
    const m = Math.round(load.mas * 300), hsr = load.mas >= LOAD_HSR ? m : 0, spr = load.mas >= LOAD_SPR ? m : 0;
    const zones = [0,0,load.mas < LOAD_SPR ? m : 0,load.mas >= LOAD_SPR ? m : 0];
    if (load.m !== m || load.hsr !== hsr || load.spr !== spr || JSON.stringify(load.zones) !== JSON.stringify(zones)) return entry;
    const tests = logs.filter(test => test && test.kind === 'test' && test.test === 'mas' && test.parentSessionId === entry.historyId);
    if (tests.length !== 1) return entry;
    const test = tests[0];
    if (test.editedAt || test.at !== entry.at || !Number.isInteger(test.dist) || test.dist < 600 || test.dist > 2400 || test.value !== Math.round(test.dist / 3) / 100) return entry;
    const out = { ...entry, load:masResultLoad(test.dist,5), fieldLoadStatus:'partial', load2Status:'needsFieldData' };
    delete out.load2;
    changed = true;
    return out;
  });
  return changed ? repaired : logs;
}
// the work done in the player: every work step that was done, with its recovery run
function fieldDoneLoad(){
  const f = P.f, mas = loadMas(), o = zeroLoad();
  if (f.id === 'mas-test-5-min') {
    const seconds = P.steps.reduce((sum,st,i) => sum + (st.kind === 'work' && P.doneSteps[i] && st.b ? st.b.work_s || 0 : 0),0);
    return masResultLoad(!P.quit && seconds === 300 ? Number(P.masDist) : null, seconds / 60);
  }
  P.steps.forEach((st, i) => { if (st.kind !== 'work' || !P.doneSteps[i] || !st.b) return; addLoad(o, blockRep(st.b, f, mas)); if (st.b.rest_mas_pct && st.b.rest_s) addLoad(o, recRun(st.b, mas)); });
  return { m: Math.round(o.m), hsr: Math.round(o.hsr), spr: Math.round(o.spr), min: Math.round(o.t / 6) / 10, zones: o.z.map(Math.round), dose: P.dose === 'season' ? 'season' : 'full', mas: Math.round(mas * 100) / 100 };
}
/* ---------- training load, model LM1 (load2/MODEL.md): bodovi per set, hard sets per region, impact contacts ----------
   The ONE place of the load maths. Everything between the two LM1 marker lines depends only on S.ex, S.log, window.SEED and
   window.EXFX (loadfx.js, built by tools/build/build_loadfx.py); tools/build/check_load.cjs runs this block as it is.
   B (bodovi) = predicted RPE × minutes. The [EO] priors are expert opinion until the personal calibration (a later step). */
// ---- LM1 begin ----
const LM = {
  MV: 'LM1',
  MUSCLE: ['Gluteus','Gluteus medius','Aduktori','Fleksori kuka','Stražnja loža','Kvadriceps','Lisni mišić','Core','Leđa','Prsa','Ramena','Ruke','Vrat'],
  JOINT: ['Kuk','Koljeno','Gležanj'],
  TREG: { 'Kvadriceps':['Kvadriceps'], 'Stražnji lanac':['Gluteus','Stražnja loža'], 'Aduktori':['Aduktori'], 'Gluteus medius':['Gluteus medius'],
    'Fleksori kuka':['Fleksori kuka'], 'Lisni mišić':['Lisni mišić'], 'Trup':['Core'], 'Potisak':['Prsa','Ramena'], 'Povlačenje':['Leđa'], 'Ruke':['Ruke'] },
  PAT: { L1:1.0, L2:0.6, HJ:0.5, U1:0.6, S:0.3, C:0.3, K:0.6, B:0.6, A:0.1, P:0, R:0 },
  ECC: [1, 1.25, 1.5], NOV: [0.2, 0.35, 0.5],
  TIER: { nisko:0.6, kutija:0.8, srednje:1.0, visoko:1.25, 'vrlo visoko':1.5 },
  RIR_DEF: { L1:2, L2:2, HJ:2, U1:2, S:3, C:3, K:3, B:5, A:6, P:6, R:6 },
  POW: 2, NCAP: 12, HOLD_S: 6, UNI: 0.55,   // per-rep non-linearity, reps above 12 count half, a 6-s hold = 1 rep, one side of non-L2 work
  K: { L:2.7, U:2.7, C:2.7, imp:1.0, gmin:1.0, fmin:3.5, m:2.0, hsr:2.0, spr:0.5 },   // priors: B per SL, per CE, per gym minute, field
  UPPER: ['Leđa','Prsa','Ramena','Ruke'],
  RUN: ['lagano', 'umjereno', 'visoko', 'sprint'],
  ASK: { L1:1, L2:1, HJ:1, U1:1, S:1, C:1, K:1, B:1 },   // patterns the player asks "Koliko si još mogao?" after (not A, P, R)
  RIR_TAPS: [0, 1, 2, 3, 4.5, 7], RIR_TXT: ['0', '1', '2', '3', '4–5', '6+'],
  SIR_TAPS: [0, 5, 10, 15, 25, 40], SIR_TXT: ['0', '5', '10', '15', '20–30', '30+'],
  BAND: 0.3   // prior band ± 30 % until the calibration has data
};
LM.ALLZ = LM.MUSCLE.concat(LM.JOINT, ['Cijelo tijelo']);
const lmObj = v => !!v && typeof v === 'object' && !Array.isArray(v);
const lmNum = v => typeof v === 'number' && isFinite(v);
const lmIntens = R => R <= 1 ? 1 : 1 / (1 + Math.min(R, 15) / 30);   // share of the 1RM implied by reps + reserve (inverse Epley)
const lmHard = r => r <= 3 ? 1 : r <= 5 ? 0.5 : 0;
const lmZones = e => (e && Array.isArray(e.zones) ? e.zones : []).filter(z => typeof z === 'string' && LM.ALLZ.indexOf(z) !== -1);
function lmPattern(e){
  const zs = lmZones(e), z = zs.filter(x => LM.MUSCLE.indexOf(x) !== -1), z0 = z[0] || '', eq = Array.isArray(e.equip) ? e.equip : [];
  const nm = ((typeof e.name === 'string' ? e.name : '') + ' ' + (typeof e.alt === 'string' ? e.alt : '')).toLowerCase();
  if (e.cat === 'Kondicija') return /climber|plank/.test(nm) ? 'C' : 'R';
  if (e.cat === 'Aktivacija' || e.cat === 'Mobilnost') return /trx (squat|reverse|lateral)/.test(nm) ? (e.sides ? 'L2' : 'L1') : (/trčanj|ubrzanj/.test(nm) ? 'R' : 'A');
  if (e.cat === 'Eksplozivnost') return /med ball|medicink|slam|bacanj|throw|swing|pass|power pull|sprinter/.test(nm) || eq.indexOf('Medicinka') !== -1 || eq.indexOf('Girja') !== -1 || /barbell/.test(nm) ? 'B' : 'P';
  if (/walk|carry|nošenj/.test(nm) && e.measure === 'time') return 'K';
  if (e.cat === 'Trup') return 'C';
  if (LM.UPPER.indexOf(z0) !== -1) return /fly|face pull|pull-apart|raise|high row|power pull/.test(nm) ? 'S' : 'U1';
  if (z0 === 'Lisni mišić' || z0 === 'Vrat' || zs[0] === 'Gležanj') return 'S';
  const big = ['Kvadriceps','Gluteus','Stražnja loža','Aduktori'], nBig = z.filter(x => big.indexOf(x) !== -1).length;
  if (z0 === 'Kvadriceps' || (nBig >= 2 && /squat|čučanj|iskorak|lunge|step|deadlift|rdl|split/.test(nm))) return e.sides ? 'L2' : 'L1';
  if (/deadlift|rdl|trap/.test(nm)) return e.sides ? 'L2' : 'L1';
  if (z0 === 'Gluteus medius' || z0 === 'Aduktori') return e.measure === 'time' || /copenhagen|kopenhagen/.test(nm) ? 'HJ' : 'S';
  return 'HJ';
}
// prime zones (1.0 hard set) and strain shares over the exercise's zones: prime 1, other muscle 0.5, joint 0.25, Σ = 1
function lmRegions(zs, pat, prime){
  const mus = zs.filter(z => LM.MUSCLE.indexOf(z) !== -1);
  if (!prime) { prime = mus.slice(0, 1); if ((pat === 'L1' || pat === 'L2') && mus[1] && ['Kvadriceps','Gluteus'].indexOf(mus[1]) !== -1) prime.push(mus[1]); }
  const w = {}; zs.forEach(z => { w[z] = prime.indexOf(z) !== -1 ? 1 : LM.MUSCLE.indexOf(z) !== -1 ? 0.5 : 0.25; });
  if (!zs.length) w['Cijelo tijelo'] = 1;
  const s = Object.values(w).reduce((a, b) => a + b, 0), rw = {}; Object.keys(w).forEach(z => rw[z] = Math.round(w[z] / s * 1000) / 1000);
  return { prime: prime.slice(), rw };
}
// the factors of any exercise from what it already has (category, zones, equipment, measure, sides, name): always complete
function deriveFx(e){
  e = lmObj(e) ? e : {};
  const pat = lmPattern(e), nm = ((typeof e.name === 'string' ? e.name : '') + ' ' + (typeof e.alt === 'string' ? e.alt : '')).toLowerCase();
  const ecc = /nordic|depth drop|ekscentr/.test(nm) ? 2 : /rdl|step-down|spuštanj|zaustavljanj|duga poluga|hamstring curl|pregib nogu/.test(nm) ? 1 : 0;
  const reg = lmRegions(lmZones(e), pat, null);
  const fx = { v:1, pat, mx:null, uni:!!e.sides, ecc, prime:reg.prime, rw:reg.rw, bw:null, cpr:0, tier:null, rir:LM.RIR_DEF[pat], runM:null, runInt:null, tags:[], src:'procjena' };
  if (pat === 'P') { fx.cpr = 1; fx.tier = /pogo|hop|skip/.test(nm) ? 'nisko' : /box/.test(nm) ? 'kutija' : /depth jump|depth drop|broad|bound|lateral|jednonožni/.test(nm) ? 'visoko' : 'srednje'; }
  if (pat === 'R' && +e.runM > 0) { fx.runM = +e.runM; fx.runInt = LM.RUN.indexOf(e.runInt) !== -1 ? e.runInt : 'umjereno'; }   // own running drills keep their metres
  if (/nordic/.test(nm)) fx.tags.push('ecc-ham');
  if (/kopenhagen|copenhagen|adukc|adduct/.test(nm)) fx.tags.push('add');
  if (/push-up|sklek/.test(nm)) fx.bw = 0.64; if (/zgib|pull-up|chin-up/.test(nm)) fx.bw = 0.95; if (/australsk|inverted|trx row/.test(nm)) fx.bw = 0.6;
  return fx;
}
const lmWarned = {};
// every field checked; a bad one takes the derived value (imports from older backups, hand-edited data, photo packs)
function lmSanitize(f, e, d){
  const zs = lmZones(e), mus = zs.filter(z => LM.MUSCLE.indexOf(z) !== -1), bad = [];
  const o = { v:1 };
  o.pat = Object.prototype.hasOwnProperty.call(LM.PAT, f.pat) ? f.pat : (bad.push('pat'), d.pat);
  o.mx = f.mx == null ? null : lmNum(f.mx) && f.mx >= 0.05 && f.mx <= 1.5 ? f.mx : (bad.push('mx'), null);
  o.uni = !!e.sides;
  o.ecc = f.ecc === 0 || f.ecc === 1 || f.ecc === 2 ? f.ecc : (bad.push('ecc'), d.ecc);
  let prime = Array.isArray(f.prime) && f.prime.every(z => mus.indexOf(z) !== -1) && f.prime.length <= 2 && new Set(f.prime).size === f.prime.length ? f.prime.slice() : null;
  if (!prime || (!prime.length && mus.length)) { if (prime || f.prime != null) bad.push('prime'); prime = null; }
  const keys = zs.length ? zs : ['Cijelo tijelo'];
  let rw = lmObj(f.rw) && Object.keys(f.rw).length && Object.keys(f.rw).every(z => keys.indexOf(z) !== -1 && lmNum(f.rw[z]) && f.rw[z] > 0) ? Object.assign({}, f.rw) : null;
  if (rw && prime && prime.some(z => !rw[z])) rw = null;
  if (!prime || !rw) { if (f.rw != null && !rw) bad.push('rw'); const r = lmRegions(zs, o.pat, prime); prime = r.prime; rw = r.rw; }
  const s = Object.values(rw).reduce((a, b) => a + b, 0); if (Math.abs(s - 1) > 0.001) Object.keys(rw).forEach(z => rw[z] = Math.round(rw[z] / s * 1000) / 1000);
  o.prime = prime; o.rw = rw;
  o.bw = f.bw == null ? null : lmNum(f.bw) && f.bw >= 0.3 && f.bw <= 1.05 ? f.bw : (bad.push('bw'), null);
  o.cpr = o.pat === 'P' ? (Number.isInteger(f.cpr) && f.cpr >= 1 ? f.cpr : 1) : 0;
  o.tier = o.pat === 'P' ? (Object.prototype.hasOwnProperty.call(LM.TIER, f.tier) ? f.tier : (bad.push('tier'), d.tier || 'srednje')) : null;
  o.rir = lmNum(f.rir) && f.rir >= 0 && f.rir <= 10 ? f.rir : (f.rir != null && bad.push('rir'), LM.RIR_DEF[o.pat]);
  o.runM = o.pat === 'R' && lmNum(+f.runM) && +f.runM > 0 ? +f.runM : null;
  o.runInt = o.pat === 'R' && LM.RUN.indexOf(f.runInt) !== -1 ? f.runInt : o.runM ? 'umjereno' : null;
  o.tags = Array.isArray(f.tags) ? f.tags.filter(t => typeof t === 'string') : [];
  const id = e && e.id;
  if (bad.length && !lmWarned[id]) { lmWarned[id] = 1; try { console.warn('Opterećenje: vježba ' + id + ' ima neispravne faktore (' + bad.join(', ') + '); uzete su procijenjene vrijednosti.'); } catch(er){} }
  return o;
}
// The factors of an exercise: the shipped ones (loadfx.js) for a shipped exercise, else derived. Never throws, always complete.
// A shipped exercise whose zones he changed gets its prime zones and strain shares rebuilt from his zones.
function loadFx(e){
  let d;
  try { d = deriveFx(e); } catch(er) { d = { v:1, pat:'A', mx:null, uni:false, ecc:0, prime:[], rw:{ 'Cijelo tijelo':1 }, bw:null, cpr:0, tier:null, rir:6, runM:null, runInt:null, tags:[], src:'procjena' }; }
  try {
    const id = lmObj(e) && typeof e.id === 'string' ? e.id : '', X = window.EXFX, SD = window.SEED && window.SEED.exercises;
    const s = id && lmObj(X) && Object.prototype.hasOwnProperty.call(X, id) && lmObj(X[id]) && lmObj(SD) && Object.prototype.hasOwnProperty.call(SD, id) ? X[id] : null;
    const fx = Object.assign({}, d, s || {});
    if (s) { const a = lmZones(e).slice().sort().join('|'), b = lmZones(SD[id]).slice().sort().join('|'); if (a !== b) { const r = lmRegions(lmZones(e), fx.pat, null); fx.prime = r.prime; fx.rw = r.rw; } }
    const o = lmSanitize(fx, lmObj(e) ? e : {}, d);
    o.src = s ? 'isporuka' : 'procjena';
    return o;
  } catch(er) { return d; }
}
// One set (MODEL 1.2–1.4, 1.7). s: { n, rir } or { t, sir } (a hold); ctx: { k: sessions with it in the last 56 days, c, bias }.
function setLoad(e, fx, s, ctx){
  ctx = ctx || {};
  const bias = ctx.bias || 0, c = ctx.c || 1, k = ctx.k == null ? 3 : ctx.k;
  const nov = 1 + LM.NOV[fx.ecc] * (k === 0 ? 1 : k === 1 ? 0.5 : 0) * (fx.pat === 'A' ? 0 : 1);
  const sides = s.sides || (fx.uni ? 2 : 1), out = { B:0, SL:0, imp:0, ecc:0, hs:{}, reps:[], conf: (s.t != null ? s.sir : s.rir) == null ? 'zad' : 'tap' };
  if (fx.pat === 'P') {
    const t = LM.TIER[fx.tier || 'srednje'] * (fx.uni ? 1.3 : 1), contacts = (s.n || 0) * sides * (fx.cpr || 1);
    out.imp = contacts * t * nov * c; out.B = LM.K.imp * out.imp; out.ch = 'imp'; return out;
  }
  if (fx.pat === 'R') { out.ch = 'R'; return out; }   // running drills: metres go to the field channel (lmRun)
  let n = s.n || 0, r = s.rir == null ? fx.rir : s.rir;
  if (s.t != null) { n = s.t / LM.HOLD_S; r = (s.sir == null ? fx.rir * LM.HOLD_S : s.sir) / LM.HOLD_S; }
  r = Math.max(0, r + bias);
  const R = n + r, u = fx.uni && fx.pat !== 'L2' ? LM.UNI : 1, m = (fx.mx || LM.PAT[fx.pat]) * u * LM.ECC[fx.ecc] * nov * c, ii = lmIntens(R);
  let sl = 0; const whole = Math.floor(n), frac = n - whole;
  for (let j = 1; j <= Math.ceil(n); j++) { const part = j <= whole ? 1 : frac; const cj = m * ii * (j <= LM.NCAP ? 1 : 0.5) * (1 + LM.POW * (j / R) ** 2) * part; out.reps.push(+cj.toFixed(3)); sl += cj; }
  out.SL = sl * sides;
  const ch = fx.pat === 'C' ? 'C' : Object.keys(fx.rw).some(z => LM.UPPER.indexOf(z) !== -1 && fx.prime.indexOf(z) !== -1) ? 'U' : 'L';
  out.ch = ch; out.B = LM.K[ch] * out.SL; out.ecc = fx.ecc ? out.SL * (fx.ecc === 2 ? 1 : 0.5) : 0;
  // light rehab/activation drills (tag no-hs: hip airplane, iso-abdukcija …) never count toward the hard-set floors, tapped or not
  const h = (fx.pat === 'A' && r > 3) || (Array.isArray(fx.tags) && fx.tags.indexOf('no-hs') !== -1) ? 0 : lmHard(r);
  Object.keys(LM.TREG).forEach(T => { let v = 0; LM.TREG[T].forEach(z => { if (fx.rw[z]) v = Math.max(v, fx.prime.indexOf(z) !== -1 ? 1 : 0.5); }); if (v && h) out.hs[T] = v * h * (fx.uni ? sides/2 : 1); });
  out.R = R; out.I = ii; out.r = r;
  return out;
}
const lmVal = (a, i) => Array.isArray(a) && lmNum(a[i]) && a[i] >= 0 ? a[i] : null;
// the sets a logged item did: reps (per-set list, a failed last set with its reps and 0 in reserve) or seconds, with the tap
function lmSets(x){
  if (!lmObj(x) || x.skipped || x.historySetsUnknown || x.historyRepsUnknown) return [];
  return (window.HistoryModel.recordedRows(x,true) || []).filter(r=>r.sides>0).map(r=>x.measure==='time'
    ? {t:r.sec||0,sir:r.sir,sides:r.sides} : {n:r.reps||0,rir:r.rir,sides:r.sides});
}
// sessions with this exercise in the 56 days before `at` (novelty: the first and second time cost more)
function lmNovelty(exId, at, log){
  const from = at - 56 * 864e5; let k = 0;
  (log || []).forEach(l => { if (l && l.at < at && l.at >= from && Array.isArray(l.items) && l.items.some(x => x && x.exId === exId && !x.skipped)) k++; });
  return k;
}
// running drills (field channel): metres from the factors' metres per rep, minutes for timed work (the bike)
function lmRun(x, fx, sets){
  const o = { m:0, hsr:0, spr:0, min:0, ex:0, B:0 };
  if (x.measure === 'time') { o.min = sets.reduce((a,s)=>a+s.t*s.sides,0)/60; if (fx.runM) o.m = sets.reduce((a,s)=>a+s.sides,0)*fx.runM; }
  else if (fx.runM) { const reps = sets.reduce((a,s)=>a+s.n*s.sides,0); o.m = reps * fx.runM; if (fx.runInt === 'sprint') o.ex = reps; }
  if (fx.runInt === 'visoko' || fx.runInt === 'sprint') o.hsr = o.m; if (fx.runInt === 'sprint') o.spr = o.m;
  o.B = LM.K.fmin * o.min + LM.K.m * o.m / 100 + LM.K.hsr * o.hsr / 100 + LM.K.spr * o.spr / 10;
  return o;
}
// one logged item: its sets' load; o.at (the session's time) and o.log (the history before it) give the novelty
function itemPts(x, o){
  o = o || {};
  const r = { B:0, SL:{ L:0, U:0, C:0 }, CE:0, ECC:0, spr:0, m:0, HS:{}, sets:[], tap:0, zad:0 };
  if (!lmObj(x) || x.skipped || typeof x.exId !== 'string') return r;
  const ex = (S.ex && S.ex[x.exId]) || { id: x.exId };
  const fx = Object.assign({}, o.fx || loadFx(ex)); if (x.sides != null) fx.uni = !!x.sides;
  const sets = lmSets(x), k = o.k != null ? o.k : lmNovelty(x.exId, o.at != null ? o.at : Date.now(), o.log || S.log || []);
  if (fx.pat === 'R') { const q = lmRun(x, fx, sets); r.B = q.B; r.m = q.m; r.spr = q.ex; return r; }
  sets.forEach(s => {
    const q = setLoad(ex, fx, s, { k }); r.sets.push(q); r.B += q.B; r.ECC += q.ecc; r.CE += q.imp;
    if (q.ch === 'L' || q.ch === 'U' || q.ch === 'C') r.SL[q.ch] += q.SL;
    Object.keys(q.hs).forEach(T => r.HS[T] = (r.HS[T] || 0) + q.hs[T]);
    if (LM.ASK[fx.pat]) r[q.conf]++;
  });
  return r;
}
const lmR = (v, d) => { const p = Math.pow(10, d == null ? 1 : d); return Math.round(v * p) / p; };
// A whole session (a log entry or the one on the done screen): B = Σ sets + gym minutes + a field session's metres.
// o.log: the history before it (novelty; o.k fixes it, for checks); the result is stored on the entry as entry.load2 with the model version.
function computeSession(entry, o){
  o = o || {};
  const r = { v: LM.MV, B:0, band:0, Bsets:0, Bfield:0, min:0, SL:{ L:0, U:0, C:0 }, CE:0, ECC:0, spr:0, m:0, HS:{}, ex:[], tap:0, zad:0 };
  if (!lmObj(entry)) return r;
  const at = lmNum(entry.at) ? entry.at : Date.now(), items = Array.isArray(entry.items) ? entry.items : [];
  items.forEach(x => {
    const q = itemPts(x, { at, log: o.log, k: o.k });
    r.ex.push(lmR(q.B)); r.Bsets += q.B; r.CE += q.CE; r.ECC += q.ECC; r.spr += q.spr; r.m += q.m; r.tap += q.tap; r.zad += q.zad;
    ['L', 'U', 'C'].forEach(c => r.SL[c] += q.SL[c]);
    Object.keys(q.HS).forEach(T => r.HS[T] = (r.HS[T] || 0) + q.HS[T]);
  });
  r.min = Math.max(0, +entry.secs || 0) / 60;
  const fl = entry.load;
  if (entry.kind === 'field' && (!lmObj(fl) || ['m','hsr','spr','min'].some(k => !lmNum(fl[k]) || fl[k] < 0))) {
    r.incomplete = true; r.incompleteReason = 'field';
    return r;
  }
  if (items.some(x => {
    if (x && x.skipped) return false;
    const rows = window.HistoryModel.recordedRows(x,true);
    return !rows || rows.some(row => row.sides == null || (x.measure === 'time' ? row.sec == null : row.reps == null));
  })) {
    r.incomplete = true; r.incompleteReason = 'dose';
    return r;
  }
  if (lmObj(fl) && lmNum(fl.m)) { r.Bfield = LM.K.fmin * (+fl.min || 0) + LM.K.m * fl.m / 100 + LM.K.hsr * (+fl.hsr || 0) / 100 + LM.K.spr * (+fl.spr || 0) / 10; r.m += fl.m; }
  r.B = r.Bsets + (items.length ? LM.K.gmin * r.min : 0) + r.Bfield;
  r.band = r.B * LM.BAND;
  ['B', 'band', 'Bsets', 'Bfield', 'min', 'CE', 'ECC', 'm'].forEach(k => r[k] = lmR(r[k]));
  ['L', 'U', 'C'].forEach(c => r.SL[c] = lmR(r.SL[c], 2));
  Object.keys(r.HS).forEach(T => r.HS[T] = lmR(r.HS[T], 2));
  return r;
}
// ---- LM1 end ----
// calendar weeks (a clock change never moves a session to another week), oldest first: trainings only (nTrainings' rule)
function weekLoads(n){
  const ws = weekStart(Date.now()), out = [];
  for (let k = n - 1; k >= 0; k--) { const a = calDay(ws, -7 * k); out.push({ ws: a, we: calDay(a, 7), vl: 0, m: 0, hsr: 0 }); }
  S.log.forEach(l => {
    if (!isTraining(l) || l.at > Date.now()) return; const w = out.find(o => l.at >= o.ws && l.at < o.we); if (!w) return;
    if (l.kind === 'field') {
      const fl = fieldLogLoad(l);
      const metres = fl && Number.isFinite(fl.m) && fl.m >= 0;
      const fast = metres && Number.isFinite(fl.hsr) && fl.hsr >= 0 && fl.hsr <= fl.m;
      if (!metres || !fast || l.fieldLoadStatus === 'partial') w.partial = true;
      if (metres) w.m += fl.m;
      if (fast) w.hsr += fl.hsr;
      else if (metres && fl.m > 0) w.speedUnknown = true;
    }
    if ((l.items || []).some(incompleteRecordedDose)) w.partial = true;
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
  return '<details class="ltab"><summary>Tablica</summary><table><thead><tr>' + head.map(label=>'<th scope="col">'+esc(label)+'</th>').join('') + '</tr></thead><tbody>' + rows.map(row=>'<tr>'+head.map((_,i)=>'<td>'+esc(row[i] == null ? '' : row[i])+'</td>').join('')+'</tr>').join('') + '</tbody></table></details>';
}
// pts: [{ t, v, sub }] oldest first; fmtV formats a value
// low: the lower chart of the exercise page's Opterećenje card (1.8.1)
function lineChart(id, pts, fmtV, label, low){
  const W = 326, R = 288, T = low ? 12 : 26, B = low ? 32 : 110, n = pts.length;   // 1.8.2: the exercise page's (low) chart 18 px lower (≥ 50 px tall on an SE)
  const vs = pts.map(p => p.v), mx = Math.max.apply(null, vs), mn = Math.min.apply(null, vs);
  let st = niceStep((mx - mn) / (low ? 2 : 3) || mx / 2 || 1);
  let lo = Math.floor(mn / st) * st, hi = Math.ceil(mx / st) * st;
  if (hi === lo) { lo = Math.max(0, lo - st); hi += st; }
  const t0 = pts[0].t, t1 = pts[n - 1].t, X = t => t1 > t0 ? 6 + (t - t0) / (t1 - t0) * (R - 12) : R / 2, Y = v => B - (v - lo) / (hi - lo) * (B - T);
  const xy = pts.map(p => [X(p.t), Y(p.v)]), line = xy.map((q, i) => (i ? 'L' : 'M') + q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' ');
  let g = '';
  for (let v = lo, k = 0; v <= hi + st / 1e6 && k < 8; v += st, k++) { const y = Y(v).toFixed(1); g += '<line class="gr" x1="0" y1="'+y+'" x2="'+R+'" y2="'+y+'"/>' + (low && k && v + st <= hi + st / 1e6 ? '' : '<text class="tk" x="'+W+'" y="'+(+y + 4)+'" text-anchor="end">'+esc(thou(v))+'</text>'); }   // the low chart labels only its lowest and highest line
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
function exLoadCard(e, range, compact, bare, bounds){
  const rg = LOAD_RANGES.find(r => r[0] === range) || LOAD_RANGES[0], sr = exLoadSeries(e.id, rg[2], bounds);
  const all = !bounds && rg[2] ? exLoadSeries(e.id, 0) : sr, limited = bounds?.from != null;
  const per = bare ? '' : compact ? '<button class="txtbtn lnk" data-a="loadInfo">Kako se računa?</button>' : '<div class="per" role="group" aria-label="Razdoblje">' + LOAD_RANGES.map(r => '<button data-a="loadRange" data-v="'+r[0]+'" aria-pressed="'+(r[0] === rg[0])+'">'+r[1]+'</button>').join('') + '</div>';
  const title = compact ? '<b class="t2">'+esc(e.name)+'</b>' : '<span class="t">'+(sr ? LOAD_LABEL[sr.kind] : LOAD_LABEL[all && all.kind] || 'Volumen')+'</span>';
  if (!sr || !sr.pts.length) {
    const empty = all || limited ? 'U ovom razdoblju nema treninga s ovom vježbom.' : 'Kad odradiš ovu vježbu, ovdje se vidi kako raste njezin volumen: kilogrami × ponavljanja, ponavljanja ili vrijeme.';
    return '<div class="lc"><div class="hd">'+title+per+'</div><p class="none">'+(sr?.partial ? 'Nedostaju podaci za prikaz zabilježenog rada.' : empty)+'</p></div>';
  }
  const P2 = sr.pts, k = sr.kind, f = v => loadFmt(k, v), n = P2.length, last = P2[n - 1], tr = loadTrend(P2);
  const sub = p => p.xs.length === 1 ? recordedDoseLabel(p.xs[0]) : p.xs.length + ' × u treningu';
  const pts = P2.map(p => ({ t: p.t, v: p.v, sub: sub(p) }));
  const sum = (compact ? e.name + ': ' : '') + LOAD_LABEL[k] + ', ' + n + ' ' + plural(n, 'trening', 'treninga', 'treninga') + ' od ' + shortDate(P2[0].t) + ' do ' + shortDate(last.t) + ': od ' + f(P2[0].v) + ' do ' + f(last.v) + (tr ? '. ' + tr.text : '') + '.';
  const single = limited ? '1 trening u razdoblju' : 'prvi trening';
  return '<div class="lc"><div class="hd">'+title+per+'</div>' + loadHead(f(last.v), last.v, n > 1 ? P2[n - 2].v : 0, 'od prošlog treninga', n === 1 ? single : '') +
    (n > 1 ? lineChart('lc-' + e.id + (compact ? '-c' : ''), pts, f, sum, bare) : '<p class="none">' + esc(shortDate(last.t) + ' · ' + sub(last) + '. Graf se crta od drugog treninga.') + '</p>') +
    (tr ? '<div class="ins '+(tr.dir > 0 ? 'up' : tr.dir < 0 ? 'dn' : 'eq')+'"><i aria-hidden="true">'+(tr.dir > 0 ? '↗' : tr.dir < 0 ? '↘' : '→')+'</i>'+esc(tr.text)+'</div>' : '') +
    (sr.partial ? '<p class="none">U dijelu zapisa nedostaju podaci. Prikazan je poznati dio rada.</p>' : '') +
    (bare ? '' : exLoadTable(k, P2, f)) + '</div>';
}
function exLoadTable(k, P2, f){
  return chartTable(['Trening', LOAD_LABEL[k]], P2.slice().reverse().map(p => [shortDate(p.t) + (p.xs.length === 1 ? ' · ' + recordedDoseLabel(p.xs[0]) : ''), f(p.v)]));
}
// the history list under the chart: the last sessions, how they went; the label counts every logged session of the exercise
function exHistHtml(e, h, max){
  h = h || historyOf(e.id); if (!h.length) return '';
  const n = new Set(h.map(x => x.at)).size;
  return '<div class="opthd sub"><span>Zadnji treninzi</span><span>'+n+' '+plural(n, 'trening', 'treninga', 'treninga')+'</span></div><div class="lc hist">' + h.slice(0, max || 6).map(x => {
    const tags = (x.done === false ? '<span class="tag">nije išlo' + (x.lastReps != null ? ' · zadnja serija ' + esc(x.lastReps) + ' pon.' : '') + '</span>' : '') + (x.setsDone != null ? '<span class="tag">' + esc(x.setsDone + ' od ' + (x.sets || 1) + ' ' + plural(x.sets || 1, 'serije', 'serije', 'serija')) + '</span>' : '');
    return '<div class="hrow" style="align-items:baseline"><span style="flex:none">' + esc(shortDate(x.at)) + '</span><b>' + esc(recordedDoseLabel(x)) + (tags ? '<span style="display:flex;flex-wrap:wrap;gap:6px;margin:5px 0 2px">' + tags + '</span>' : '') + '</b></div>'; }).join('') + '</div>';
}
// Napredak → "Tjedno opterećenje": strength volume load and field metres per calendar week, the last 8 weeks
function weekLoadHtml(compact){
  const W = weekLoads(8), cur = W[7], prev4 = W.slice(3, 7), avg = k => prev4.reduce((a, w) => a + w[k], 0) / 4;
  const anyVl = W.some(w => w.vl > 0), anyM = W.some(w => w.m > 0), unknownSpeed = W.some(w => w.speedUnknown);
  const head = (compact ? '' : '<div class="psec"><h2>Tjedno opterećenje</h2><button class="txtbtn lnk" data-a="loadInfo">Kako se računa?</button></div>') +
    (W.some(w => w.partial) ? '<p class="sub">Za dio treninga nedostaju podaci. Zbrojevi prikazuju samo poznati rad.</p>' : '');
  if (!anyVl && !anyM) return head + '<p class="sub" style="margin:0 17px 10px;line-height:20px">Kad odradiš treninge s kilogramima ili trčanje na terenu, ovdje vidiš koliko si napravio svaki tjedan u zadnjih 8 tjedana.</p>';
  const range = w => shortDate(w.ws) + ' – ' + shortDate(calDay(w.we, -1));
  const pct = (v, a) => a > 0 ? ' (' + (v >= a ? '+' : '−') + Math.abs(Math.round((v - a) / a * 100)) + ' % od prosjeka)' : '';
  let out = head;
  if (anyVl) { const a = avg('vl'), f = v => loadFmt('vl', v);
    out += '<div class="lc"><div class="hd"><span class="t">Snaga · volumen tereta</span><span class="t">zadnjih 8 tjedana</span></div>' + loadHead(f(cur.vl), cur.vl, a, 'od prosjeka 4 tjedna', 'ovaj tjedan') +
      weekBars('wk-vl', W, [{ k: 'vl', cls: 'bs' }], f, a, 'Volumen tereta po tjednima, zadnjih 8 tjedana. Ovaj tjedan ' + f(cur.vl) + pct(cur.vl, a) + '; prosjek prethodna 4 tjedna ' + f(a) + '.', w => range(w)) +
      chartTable(['Tjedan', 'Volumen tereta'], W.slice().reverse().map(w => [range(w), f(w.vl)])) + '</div>'; }
  if (anyM) { const a = avg('m'), f = v => loadFmt('m', v);
    const speedText = w => w.speedUnknown ? (w.hsr > 0 ? f(w.hsr) + ' poznato; dio nije zabilježen' : 'Nije potpuno zabilježeno') : f(w.hsr);
    out += '<div class="lc"><div class="hd"><span class="t">Teren · metri</span><span class="t">zadnjih 8 tjedana</span></div>' + loadHead(f(cur.m), cur.m, a, 'od prosjeka 4 tjedna', 'ovaj tjedan') +
      weekBars('wk-m', W, unknownSpeed ? [{ k:'m', cls:'bt1' }] : [{ k: 'ost', cls: 'bt1' }, { k: 'hsr', cls: 'bt2' }], f, a, 'Metri na terenu po tjednima, zadnjih 8 tjedana. Ovaj tjedan ' + f(cur.m) + pct(cur.m, a) + (unknownSpeed ? '; raspodjela brzine nije potpuno zabilježena' : ', od toga brzo trčanje ' + f(cur.hsr)) + '; prosjek prethodna 4 tjedna ' + f(a) + '.', w => range(w) + ' · brzo ' + speedText(w)) +
      (unknownSpeed ? '<p class="none">Stupci prikazuju ukupne poznate metre. Raspodjela brzog trčanja nije potpuno zabilježena; nepoznati metri nisu prikazani kao sporo trčanje.</p>' : '<div class="lg2"><span><i class="k1"></i>Ostali metri</span><span><i class="k2"></i>Brzo trčanje</span></div>') +
      chartTable(['Tjedan', 'Metri', 'Poznato brzo trčanje'], W.slice().reverse().map(w => [range(w), f(w.m), speedText(w)])) + '</div>'; }
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
    '<h2>Što broj pokazuje?</h2><p>Volumen prikazuje količinu zabilježenog rada. Za usporedbu koristi istu vježbu i usporedivu izvedbu. Sam porast volumena ne dokazuje rast snage, mišića ili kondicije, a pad ne znači lošiji trening.</p>' +
    '<h2>Kako se računa?</h2><p>Npr. 4 serije × 5 ponavljanja × 80 kg = 1.600 kg. Kod bučica se računa jedna bučica, kao što upisuješ kilograme. Vježba „po strani” broji obje strane. Djelomične serije računaju se kako si ih odradio, preskočene ne.</p>' +
    '<p>Graf vježbe prikazuje volumen tereta kad u razdoblju ima treninga s kilogramima (treninzi bez kilograma tada se ne crtaju), inače ponavljanja ili vrijeme. Tjedno opterećenje u Napretku zbraja treninge u kalendarskom tjednu, od ponedjeljka do nedjelje, i uspoređuje ih s prosjekom prethodna 4 tjedna. Vježba isprobana iz knjižnice ulazi u svoj graf, ali ne i u tjedni zbroj.</p>' +
    '<h2>Trčanje na terenu</h2><p>Metri i zone običnog terenskog treninga procjenjuju se iz odrađenih blokova i tada korištenog MAS-a (dok nema testa, 4,5 m/s). To nije GPS mjerenje ostvarene brzine. Zone: lagano ispod 70 % MAS-a, umjereno 70–90 %, visoko od 90 % MAS-a do 25,2 km/h, a sprint iznad toga. Postotak brzine ili napora računa se od najveće brzine iz Doziranja (zadano 28,8 km/h).</p>' +
    '<p>Za MAS test spremaju se prijavljeni metri u 5 minuta. Prosječna brzina testa ne otkriva koliko je metara bilo iznad praga brzog trčanja ili sprinta, pa ti dijelovi ostaju nepoznati. Bez rezultata nema procijenjene udaljenosti testa. Stari trening bez spremljenih metara ne računa se ponovno iz današnjeg predloška.</p>' +
    '<p>Intenzitet treninga ovisi o udjelu brzog trčanja i sprinta, a volumen o metrima: nizak do 1,5 km, srednji do 3 km, visok iznad toga.</p>' +
    '<h2>U sezoni</h2><p>Kad u Doziranju postaviš dan utakmice (ili u tjednu označiš utakmicu), Kreni pokreće dozu za sezonu: oko 2/3 serija (s jednom serijom 2/3 ponavljanja). Uz treninge s loptom najviše jedan dodatni trening na terenu tjedno: intenzivan najbolje 4 dana prije utakmice, nikad dan prije. U tjednu s dvije utakmice samo lagani trening na terenu i bez teških nogu između utakmica.</p>' +
    '<h2>Na što paziti?</h2><div class="icons"><figure>' + up + '<figcaption>Raste: više zabilježenog rada</figcaption></figure><figure>' + flat + '<figcaption>Ravno: slična količina rada</figcaption></figure></div>' +
    '<p>Usporedi rad s izvedbom: kilogramima i ponavljanjima pri sličnoj rezervi, rezultatom istog testa te osjećajem napora i oporavka. Ravna linija sama ne traži povećanje doze. Lakši tjedan može biti dio plana; iz grafa se ne može zaključiti koliko je rada za tebe previše.</p>' +
    '<h2>Bodovi i osjećaj napora</h2><p>LM1 bodovi su procjena prema unaprijed postavljenim faktorima. Prikazanih ±30 % zadani je raspon modela, a ne provjeren osobni interval pogreške. Model se zasad ne kalibrira iz tvojih ocjena i ne mjeri točan umor ili oporavak. Kad rezerva nije unesena, procjena koristi zadanu vrijednost za vježbu. Mišićne serije zasebno broje pripisani rad; ne mjere rast mišića ni njihovu spremnost.</p><p>Jedinice napora zasebno množe tvoju ocjenu cijelog treninga (0–10) sa stvarnim sekundama podijeljenima sa 60. Ocjena 0 je poznata nula, a prazna ocjena ostaje nepoznata. One ne mijenjaju LM1 bodove i ne govore koji je mišić dobio koliko podražaja.</p></div>' +
    '<div style="height:24px"></div></div>';
};
VIEWS.progress = function(t=top()){
  const topbarHtml=topbar(backBtn(), '', 'NAPREDAK');
  if(t.dosing)return ProgressView.render({topbarHtml,tab:'doziranje',dosingSections:progressDosingSections()});
  const now = Date.now(), plan = planSlots(), ws = weekStart(now), wplan = weekPlan(ws, plan), wk = weekStatus(ws, wplan);
  if (S.dbState === 'ready') notePlan(ws, wk.slots);
  const hasPlan = plan.length || Object.keys(S.settings.planDates || {}).length;
  let sk = hasPlan ? streakWeeks(plan) : 0;
  if (!hasPlan) for (let w = ws, k = 0; k < 104; w = calDay(w, -7), k++) { const we = calDay(w, 7); if (S.log.some(l => isTraining(l) && l.at >= w && l.at < we && l.at <= Date.now())) sk++; else if (w !== ws) break; }
  const recorded = S.log.filter(l => l.at <= now);
  const thisWeek = recorded.filter(l => isTraining(l) && l.at >= ws).length, total = nTrainings(recorded);
  const sugs = progSuggestions(), act = sugs.filter(x => x.kind === 'up' || x.kind === 'revert' || x.kind === 'variant'), way = sugs.filter(x => x.kind === 'way');
  const nokg = {}; sugs.filter(x => x.kind === 'nokg').forEach(x => { (nokg[x.p.id] = nokg[x.p.id] || { p: x.p, names: [] }).names.push(x.e.name); });
  const nokgHtml = Object.values(nokg).map(g => '<div class="lift"><div class="top"><b>Upiši početne težine</b><span>'+esc(g.p.name)+'</span></div><div class="why">'+esc(g.names.join(', '))+': bez kilograma ne mogu predložiti povećanje.</div><div class="acts" style="grid-template-columns:1fr"><button class="bt ghost" data-a="editPr" data-id="'+esc(g.p.id)+'">Upiši kilograme</button></div></div>').join('');
  const hist = progHistory(now);
  // main exercises: your lifts with kilograms first (most trained first), then strength and trunk exercises without a load
  // and timed work that changed; no activation, rehab or mobility drills, no timed hold that never changed, nothing that
  // is no longer in the library
  const series = {}, rank = {};
  Object.keys(hist).forEach(id => { const e = S.ex[id]; if (!e) return; const sr = liftSeries(hist[id], 10); if (sr.pts.length < 2) return;
    const time = sr.unit === ' s', moved = sr.pts.some(x => sr.val(x) !== sr.val(sr.pts[0]));
    const r = time && !moved ? 0 : sr.loaded && !time ? 2 : sr.loaded || e.cat === 'Snaga' || e.cat === 'Trup' ? 1 : 0;
    if (r) { series[id] = sr; rank[id] = r; } });
  const lifts = Object.keys(series).sort((a, b) => rank[b] - rank[a] || hist[b].length - hist[a].length || hist[b][hist[b].length - 1].at - hist[a][hist[a].length - 1].at).slice(0, 4);
  const exerciseCharts = lifts.map(id => ({ id, name:S.ex[id].name, html:exLoadCard(S.ex[id], 'sve', true, false, { now, from:null }) }));
  const insightInput = { log:S.log, exercises:S.ex, now };
  const insights = ProgressModel.summarize(insightInput);
  const recordedIds = Object.keys(hist).filter(id => Object.hasOwn(S.ex,id) && exLoadSeries(id,0,{now,history:hist[id]})?.pts.some(point=>point.v>0));
  recordedIds.sort((a,b)=>hist[b].at(-1).at-hist[a].at(-1).at || S.ex[a].name.localeCompare(S.ex[b].name,'hr'));
  const candidates = [...new Set(insights.comparisons.map(item=>item.id).concat(recordedIds))];
  t.chartCandidates=candidates;
  const chartExercises = candidates.map(id=>({id,name:S.ex[id].name,alt:S.ex[id].alt}));
  const chartPinnedIds = S.settings.progressPinnedIds.filter(id=>candidates.includes(id));
  const chartPeriod = S.settings.analysisPeriod, from = TrainingLoad.periodStart(now,chartPeriod);
  const trend = (id,since) => ProgressModel.exerciseTrend({...insightInput,from:since,exerciseId:id});
  // "with data": recorded in the chosen period (a lift whose weight rises each week has no same-weight comparison, and then
  // the chart opens on Količina rada)
  const chartExerciseId = candidates.includes(t.chartExerciseId) ? t.chartExerciseId : chartPinnedIds[0] || defaultChartExercise(candidates,id=>from===null||(hist[id]||[]).some(x=>x.at>=from));
  const chartComparison = chartExerciseId ? trend(chartExerciseId,from) : null;
  const chartHasComparison = !!(chartComparison || (from!==null && chartExerciseId && trend(chartExerciseId,null)));
  const chartPinnedTrends = chartPinnedIds.map(id=>id===chartExerciseId?chartComparison:trend(id,from)).filter(Boolean);
  const fullVolume = from === null && exerciseCharts.find(chart=>chart.id===chartExerciseId)?.html;
  const chartVolumeHtml = chartExerciseId ? fullVolume || exLoadCard(S.ex[chartExerciseId], 'sve', true, false, {now,from}) : '';
  // records: a best estimated max that beat an earlier best, set in the last 30 days (your first weight is not a record);
  // reps of a set count up to 10 like in Doziranje; no timed carries, jumps or throws
  const prs = Object.keys(hist).filter(id => S.ex[id] && S.ex[id].cat !== 'Eksplozivnost').map(id => { let best = null, beaten = false;
    hist[id].forEach(x => { const lift=bestRecordedLift(x); if (!lift) return;
      if (!best || lift.v>best.v+.01) { if (best) beaten=true; best={...lift,x}; }
    });
    return best && beaten && Date.now() - best.x.at < 30 * DAY_MS ? { id, best } : null; }).filter(Boolean).sort((a, b) => b.best.x.at - a.best.x.at).slice(0, 4);
  // consistency: one cell per calendar day (a clock change never shifts the grid)
  const days = {}; recorded.forEach(l => { if (!isTraining(l)) return; const t = calDay(l.at); days[t] = (days[t] || 0) + 1; });
  const start = calDay(ws, -77); let heat = '';
  for (let d = 0; d < 7; d++) for (let w = 0; w < 12; w++) { const t = calDay(start, w * 7 + d); const n = days[t] || 0; heat += '<i class="'+(t > Date.now() ? 'fut' : n >= 2 ? 'l3' : n === 1 ? 'l2' : '')+'"></i>'; }
  const weeks = weekLoads(8), current = weeks[weeks.length-1];
  const loadParts = [current.vl > 0 ? loadFmt('vl',current.vl) + ' tereta' : '', current.m > 0 ? loadFmt('m',current.m) + ' trčanja' : ''].filter(Boolean);
  const recordsHtml = prs.length ? '<div class="chart">' + prs.map(r => '<div class="pr"><span class="medal">'+I.medal+'</span><div><b>'+esc(S.ex[r.id].name)+' · '+esc(fmtKg(r.best.kg))+' × '+esc(r.best.r)+'</b><br><span>'+esc(shortDate(r.best.x.at))+' · procjena maksimuma '+esc(fmtKg(Math.round(r.best.v * 2) / 2))+'</span></div></div>').join('') + '</div>' : '';
  const daily = dailyInput(now,wk);
  const loadHtml = TrainingLoadView.render({summary:TrainingLoad.summary({log:S.log,now,period:chartPeriod}),morning:daily.checkin,detailsOpen:!!t.loadDetailsOpen,
    readWorkout:id=>{const record=historyRecord(id);return record&&clone(record);},
    onClose:()=>{
      if(!appBusy()&&(pendingExt||t.loadDayNeedsRefresh)){
        delete t.loadDayNeedsRefresh;
        render();
      }
    }});
  return ProgressView.render({
    chartMetric:t.chartMetric,chartExerciseId,chartPeriod,chartComparison,chartVolumeHtml,chartHasComparison,
    chartExercises,chartPinnedIds,chartPinnedTrends,topbarHtml,loadHtml,
    goal:GOALS[S.settings.goal]?.name,nextStep:daily.recommendation.title.replace(/^Danas:\s*/,''),
    nextStepLabel:daily.recommendation.action?.type==='history'?'Danas':'Sljedeći korak',
    zero:total === 0,
    insights,
    weekPlan:{done:wk.done,planned:wk.planned,activeDays:DAYS.filter((_,day)=>days[calDay(ws,day)]).length},
    stats:[
      { value:wk.planned ? wk.done + '/' + wk.planned : thisWeek, label:wk.planned ? 'po planu ovaj tjedan' : 'treninga ovaj tjedan', note:wk.planned && thisWeek !== wk.done ? thisWeek + ' odrađeno ukupno' : '' },
      { value:sk, label:plural(sk,'tjedan','tjedna','tjedana') + ' zaredom', note:hasPlan ? 'po planu' : 's treningom' },
      { value:total, label:'treninga ukupno' }
    ],
    counts:{ready:act.length, missing:Object.keys(nokg).length, way:way.length, records:prs.length},
    suggestionsHtml:act.map(sugCard).join(''), missingWeightsHtml:nokgHtml, wayHtml:way.map(sugCard).join(''),
    weeklyHtml:weekLoadHtml(true), hasWeeklyData:weeks.some(w=>w.vl > 0 || w.m > 0 || w.partial),
    loadHint:loadParts.length ? 'Ovaj tjedan · ' + loadParts.join(' · ') : 'Kilogrami i poznati metri · zadnjih 8 tjedana',
    exercises:exerciseCharts, recordsHtml, heatHtml:heat, heatLabel:heatLabel(heat),
    consistencyHint:heatLabel(heat), ruleN:progN()
  });
};
/* ---------- the load model on screen: "Koliko si još mogao?" after a set, the session's RPE slider and its load card ---------- */
// points: one decimal below 20 ("≈ 15,9 b"), whole numbers above ("≈ 64 b", "≈ 1.240")
const lmPts = v => v < 20 ? String(Math.round(v * 10) / 10).replace('.', ',') : thou(v);
const lmHs = v => String(Math.round(v * 10) / 10).replace('.', ',');
// A split set closes on its right side, regardless of how work is measured.
const setEnd = PlayerDose.setWorkEnd;
const stepFx = st => st && st.it ? loadFx(S.ex[st.it.exId] || { id: st.it.exId }) : null;
// the set the row asks about: the last work step before this one, done, closing its set, of an exercise that asks (not
// activation/mobility, jumps or running). On a set screen (manual) only when no rest came between (a superset without rests);
// never while a timed hold runs (kind 'work'): the row would vanish at its side switch and the card would jump mid-hold
function rirStep(){
  if (!P || P.mode !== 'ex' || !Array.isArray(P.steps)) return -1;
  if (P.done) {
    for (let k=P.steps.length-1;k>=0;k--) {
      if (!P.doneSteps[k] || !setEnd(P.steps[k]) || P.answers && P.answers[P.steps[k].g] === 'skip') continue;
      const fx=stepFx(P.steps[k]); if (fx && LM.ASK[fx.pat]) return k;
    }
    return -1;
  }
  const i = P.done ? P.steps.length : P.i; let k = i - 1, rest = false;
  if (!P.done && P.steps[i] && P.steps[i].kind === 'work') return -1;
  while (k >= 0 && !isWork(P.steps[k])) { if (P.steps[k].kind === 'rest') rest = true; k--; }
  if (k < 0 || !P.doneSteps[k] || !setEnd(P.steps[k]) || (!P.done && isWork(P.steps[i]) && rest)) return -1;
  const fx = stepFx(P.steps[k]); return fx && LM.ASK[fx.pat] ? k : -1;
}
// 1.21: the set just finished asks for its reserve on the rest screen, following "Upis rezerve" (reserveEntry):
// 0 after every work set (default), 1 only after the last set of an exercise, 2 only at the end (done screen)
const RESERVE_ENTRY = ['Nakon svake serije', 'Samo zadnja serija vježbe', 'Na kraju'];
const RESERVE_HELP = ['Nakon svake radne serije, na odmoru.',
  'Bilježi se jedna serija po vježbi, pa pravilo „RIR 0 u dvije serije” ne može vrijediti.',
  'Tijekom treninga ništa; na kraju upisuješ zadnju seriju svake vježbe.'];
const reserveEntry = () => [0, 1, 2].includes((S.settings || {}).reserveEntry) ? S.settings.reserveEntry : 0;
// the sets that ask, oldest first: on a rest every set closed since the previous rest (a superset round asks about each of
// its exercises, A1 and A2); on the done screen the last done set of every exercise, so a set whose rest was only the short
// pause before the next exercise (or "Na kraju") is still asked once
function reserveSteps(){
  if (!P || P.mode !== 'ex' || !Array.isArray(P.steps)) return [];
  const asks = k => { const st = P.steps[k]; if (!isWork(st) || !P.doneSteps[k] || !setEnd(st) || (P.answers && P.answers[st.g] === 'skip')) return false;
    const fx = stepFx(st); return !!(fx && LM.ASK[fx.pat]); };
  const out = [];
  if (P.done) {
    const seen = {};
    for (let k = P.steps.length - 1; k >= 0; k--) if (!seen[P.steps[k].g] && asks(k)) { seen[P.steps[k].g] = 1; out.unshift(k); }
    return out;
  }
  if (!P.steps[P.i] || P.steps[P.i].kind !== 'rest') return [];
  for (let k = P.i - 1; k >= 0 && P.steps[k].kind !== 'rest'; k--) if (asks(k)) out.unshift(k);
  return out;
}
// the rows on this rest, following "Upis rezerve"; at most the last two, so the rest screen keeps its clock
function cinemaReserveSteps(){
  const mode = reserveEntry();
  if (mode === 2) return [];
  return reserveSteps().filter(k => mode === 0 || P.steps[k].set === (P.steps[k].it.sets || 1)).slice(-2);
}
function failedReserveStep(k){
  const st=P && P.steps[k];
  if (!st || !P.done || !P.answers || P.answers[st.g] !== false || !st.it || st.it.measure === 'time') return false;
  const actual=workOf(st.g).filter(i=>P.doneSteps[i] && setEnd(P.steps[i]));
  return actual[actual.length-1] === k;
}
// the points of the set at step k with the tap (or the exercise's default reserve)
function rirSetPts(k){
  const st = P.steps[k], it = st.it, e = S.ex[it.exId] || { id: it.exId }, fx = Object.assign({}, loadFx(e), { uni: !!it.sides });
  const failed=failedReserveStep(k), v=failed?0:P.rir && P.rir[k] != null ? P.rir[k] : null, dose=PlayerDose.recordedAt(st);
  return setLoad(e, fx, it.measure === 'time' ? { t:dose.sec, sir:v } : { n:failed?lastRepsOf(st.g):dose.reps, rir:v }, { k: lmNovelty(it.exId, Date.now(), S.log) }).B;
}
function rirRowHtml(k, other){
  const st = P.steps[k], it = st.it, time = it.measure === 'time', fx = stepFx(st), taps = time ? LM.SIR_TAPS : LM.RIR_TAPS, txt = time ? LM.SIR_TXT : LM.RIR_TXT;
  const goal = it[time ? 'targetSir' : 'targetRir'], failed=failedReserveStep(k), def = Number.isFinite(goal) ? goal : time ? fx.rir * LM.HOLD_S : fx.rir, v = failed?0:P.rir && P.rir[k] != null ? P.rir[k] : null;
  let tg = 0; taps.forEach((t, x) => { if (Math.abs(t - def) < Math.abs(taps[tg] - def)) tg = x; });
  const q = failed?'Neuspjela serija · RIR 0':time ? 'Koliko si još mogao? (s)' : 'Koliko si još mogao?', tap = v==null?'':time?'SIR '+v+' s':'RIR '+v;
  const what = other ? tap || 'nije uneseno' : 'S' + st.set + ' · ' + (tap || 'rezerva nije unesena');
  // the question and, on the right, the tap; a set of another exercise than the one on screen (the rest before the next
  // one, a superset round, the done screen) names it on its own line ("Deadlift · 4. serija"), so the name never shrinks
  return '<section class="rir" aria-label="' + esc((time ? 'Koliko si još mogao držati, u sekundama?' : q) + ' ' + (other ? st.e.name + ', ' : '') + 'Serija ' + st.set + ' · ≈ ' + lmPts(rirSetPts(k)) + ' bodova') + '"><div class="rirh"><b>' + q + '</b><span>' +
    '<em>' + esc(what) + '</em></span></div>' + (other ? '<p class="rirn">' + esc(st.e.name + ' · ' + st.set + '. serija') + '</p>' : '') +
    '<div class="rirb" role="group" aria-label="' + (time ? 'Sekundi u rezervi' : 'Ponavljanja u rezervi') + '">' + taps.map((t, x) =>
      '<button data-a="rir" data-k="' + k + '" data-v="' + x + '" aria-pressed="' + (v === t) + '"'+(failed?' disabled':'')+' class="' + [x === tg ? 'tg' : '', txt[x].length > 3 ? 'lg' : ''].filter(Boolean).join(' ') + '" aria-label="' + txt[x] + (time ? ' s' : '') + (x === tg ? (Number.isFinite(goal) ? ' (cilj)' : ' (uobičajeno)') : '') + '">' + txt[x] + '</button>').join('') +
    '</div></section>';
}
function saveRecordedSet(index, reps, reserve){
  const step = P?.steps[index];
  if (step?.kind !== 'manual' || !P.doneSteps[index] || !PlayerDose.validActualReps(reps)) return false;
  const previous=P,steps=P.steps.map((entry,k)=>P.doneSteps[k]&&entry.kind==='manual'&&entry.g===step.g&&entry.set===step.set
    ? {...entry,actualReps:reps} : entry);
  P = {...P, steps};
  if (reserve !== undefined) {
    P.rir = {...P.rir};
    if (reserve === null) delete P.rir[index];
    else P.rir[index] = reserve;
  }
  if (savePlay()) return true;
  P = previous;
  return false;
}
function workoutResultForm(index){
  const step = P.steps[index], actual = PlayerDose.recordedAt(step);
  const reserve = P.rir?.[index];
  return '<h3>Rezultat serije</h3><p class="play-dose-note">'+esc(step.e.name+' · '+step.set+'. serija')+'</p>'+
    '<form id="workout-result-form" class="play-dose-editor">'+
    '<label>Odrađena ponavljanja'+(step.it.sides ? ' po strani' : '')+'<input name="reps" inputmode="numeric" autocomplete="off" value="'+esc(actual.reps)+'"></label>'+
    '<label>RIR <span class="sub">Ponavljanja u rezervi</span><input name="rir" inputmode="decimal" autocomplete="off" placeholder="—" value="'+esc(reserve == null ? '' : String(reserve).replace('.',','))+'"></label>'+
    '<button type="submit" class="btn">Spremi rezultat</button><button type="button" class="btn sec" data-a="cinemaClose">Odustani</button></form>';
}
function saveWorkoutResult(form){
  const sheet = S.sheet;
  if (sheet?.kind !== 'cinemaReserve' || !P || failedReserveStep(sheet.k)) return;
  const reps = workoutNumber(form.elements.reps.value), raw = form.elements.rir.value.trim();
  const reserve = raw ? workoutNumber(raw) : null;
  if (!PlayerDose.validActualReps(reps)) { toast('Upiši od 1 do 60 odrađenih ponavljanja.', true); return; }
  if (raw && (reserve === null || reserve < 0 || reserve > 10)) { toast('RIR mora biti od 0 do 10.', true); return; }
  if (!saveRecordedSet(sheet.k, reps, reserve)) { toast('Rezultat nije spremljen. Pokušaj ponovno.', true); return; }
  const step = P.steps[sheet.k], state = {live:true, j:step.g};
  delete S.workoutRaw?.[workoutRawKey(state, step.set, 'reps')];
  delete S.workoutRaw?.[workoutRawKey(state, step.set, 'rir')];
  cinemaCloseSheet();
}
// per logged item: the taps of the sets he did, in order (null = not tapped), so the list lines up with setsDone (lmSets reads the
// first setsDone values: a round of a superset he skipped must not shift his taps); null when nothing was tapped
function rirLists(j, it){
  const n = it.sets || 1, by = []; let any = false;
  P.steps.forEach((st, i) => { if (st.g === j && setEnd(st) && P.doneSteps[i] && st.set >= 1 && st.set <= n) { const v = P.rir && P.rir[i] != null ? P.rir[i] : null; by[st.set] = v; if (v != null) any = true; } });
  return any ? by.filter(v => v !== undefined) : null;
}
// session RPE (CR-10 words in Croatian) on a slider; the label under it changes while sliding
const RPE_WORDS = ['Bez napora','Vrlo lagano','Vrlo lagano','Lagano','Lagano','Srednje','Srednje','Teško','Teško','Vrlo teško','Maksimalno'];
const rpeKnown=v=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=10;
const rpeTxt=v=>rpeKnown(v)?v+' · '+RPE_WORDS[v]:'';
const rpePct=v=>(v/10*100).toFixed(1)+'%';
function rpeHtml(){
  const v=rpeKnown(P.srpe)?P.srpe:null;
  return '<section class="rpe"><div class="rpeh"><b id="rpeq">Koliko je bilo teško?</b><span>cijeli trening</span></div><input type="range" id="srpe" class="rng'+(v!==null?' set':'')+'" min="0" max="10" step="1" value="'+(v??5)+'" style="--p:'+rpePct(v??5)+'" aria-labelledby="rpeq" aria-valuetext="'+(v!==null?rpeTxt(v):'nije ocijenjeno')+'"><div class="rpes"><span>0</span><b id="rpelab" aria-live="polite">'+(v!==null?esc(rpeTxt(v)):'povuci za ocjenu')+'</b><span>10</span></div></section>';
}
const auHtml=(v,min)=>{
  const au=TrainingLoad.sessionAU({srpe:v,secs:min*60});
  return au===null?'Ocijeni napor cijelog treninga, po želji. Neodgovoreno ostaje nepoznato.':'Zabilježeni napor: <b data-au="'+au+'">'+au.toLocaleString('hr-HR',{maximumFractionDigits:2})+'</b> j.n. · ocjena '+v+'/10 · '+esc(Math.max(0,min*60).toLocaleString('hr-HR',{maximumFractionDigits:2}))+' s. Ocjena je zasebna od procjene LM1.';
};
function rpeTap(t,ev){
  const r=t.getBoundingClientRect(),w=r.width-28;
  if(ev&&ev.detail>0&&typeof ev.clientX==='number'&&w>0&&ev.clientY>=r.top&&ev.clientY<=r.bottom)t.value=String(Math.max(0,Math.min(10,Math.round((ev.clientX-r.left-14)/w*10))));
  rpeSet(t);
}
function rpeSet(t){
  if(!P||!P.done)return;
  const number=Number(t.value),wanted=Number.isFinite(number)?Math.max(0,Math.min(10,Math.round(number))):5;
  savePlayerChoice(['srpe'],()=>{P.srpe=wanted;});
  const v=rpeKnown(P.srpe)?P.srpe:null;
  t.value=String(v??5);t.classList.toggle('set',v!==null);t.style.setProperty('--p',rpePct(v??5));t.setAttribute('aria-valuetext',v!==null?rpeTxt(v):'nije ocijenjeno');
  const l=document.getElementById('rpelab');if(l)l.textContent=v!==null?rpeTxt(v):'povuci za ocjenu';
  const a=document.getElementById('lmau');if(a)a.innerHTML=auHtml(v,Math.max(0,+P.secs||0)/60);
}
// the done screen's load card: ≈ points ± band, hard sets per region, landings and metres
function lmCardHtml(o){
  const minutes=Math.max(0,+P.secs || 0)/60;
  if (o.incomplete) return '<section class="lmc" aria-label="Procjena napora nije dostupna"><div class="lmh"><span>Procjena napora LM1</span></div><p class="lmx">' + (o.incompleteReason === 'field' ? 'Za bodove nisu poznati svi terenski podaci. Nepoznato brzo trčanje i sprint nisu nula.' : 'Za bodove nisu poznate sve stvarno odrađene serije, ponavljanja ili sekunde. Nedostajući rad nije nula.') + '</p><p class="lmau" id="lmau">' + auHtml(P.srpe,minutes) + '</p></section>';
  const hs = Object.keys(LM.TREG).filter(T => o.HS[T] > 0).map(T => '<span><i>' + esc(T) + '</i><b>' + lmHs(o.HS[T]) + '</b></span>');
  const more = [o.CE > 0 ? 'Doskoci <b>≈ ' + thou(o.CE) + '</b>' : '', o.m > 0 ? 'Trčanje <b>' + esc(loadFmt('m', o.m)) + '</b>' : ''].filter(Boolean);
  const dur = lmR(o.B - o.Bsets - o.Bfield);   // the gym minutes' part of B: said, so the sets' points add up
  return '<section class="lmc" aria-label="Procjena napora treninga LM1"><div class="lmh"><span>Procjena napora LM1</span><span class="tag">Zadani model</span></div>' +
    '<div class="lmv"><b>≈ ' + lmPts(o.B) + '</b><span class="pm">± ' + lmPts(o.band) + '</span><span class="vs">' + Math.round(minutes) + ' min' + (dur >= 0.5 ? ' · +' + lmPts(dur) + ' za trajanje' : '') + '</span></div>' +
    '<p class="lmau" id="lmau">' + auHtml(P.srpe, minutes) + '</p>' +
    '<p class="lmx">±30 % je zadani raspon procjene, ne provjerena osobna pogreška. Bodovi ne mjere točan umor ni oporavak.</p>' +
    (hs.length ? '<div class="lmt">Procjena težih serija</div><div class="lmhs">' + hs.join('') + '</div>' : '') +
    (more.length ? '<p class="lmx">' + more.join(' · ') + '</p>' : '') + '</section>';
}
// the exercise page (Opterećenje): the points of its last session, from the stored snapshot (recomputed for older entries)
function exLastPts(exId){
  for (const l of S.log) {
    if (!l || !Array.isArray(l.items)) continue;
    if (['needsProfile','needsDose'].includes(l.load2Status) && l.items.some(x => x.exId === exId && !x.skipped)) return null;
    let B = 0, hit = false;
    l.items.forEach((x, i) => { if (!x || x.exId !== exId || x.skipped) return; hit = true;
      const s = l.load2 && l.load2.v === LM.MV && Array.isArray(l.load2.ex) && lmNum(l.load2.ex[i]) ? l.load2.ex[i] : itemPts(x, { at: l.at }).B; B += s; });
    if (hit) return { B, at: l.at };
  }
  return null;
}
function ringSvg(frac, color){
  const C = 2 * Math.PI * 35;
  return '<svg viewBox="0 0 76 76"><circle cx="38" cy="38" r="35" fill="none" stroke="var(--track)" stroke-width="3.5"/><circle id="ringArc" cx="38" cy="38" r="35" fill="none" stroke="'+color+'" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="'+(C*Math.max(0,Math.min(1,frac))).toFixed(1)+' '+C.toFixed(1)+'" transform="rotate(-90 38 38)"/></svg>';
}
function syncPlayTabs(selected) {
  app.querySelectorAll('.play-card-tabs button').forEach((button,index)=>{
    button.setAttribute('aria-selected',String(index===selected));
    button.tabIndex=index===selected?0:-1;
  });
  app.querySelectorAll('.play-card').forEach((panel,index)=>{
    panel.setAttribute('aria-hidden',String(index!==selected));
    panel.inert=index!==selected;
  });
}
function playDoseCardsHtml(e){
  const on = P.cardIndex || 0, names = ['Upute','Cilj','Doziranje'];
  const cues = e && (e.steps || []).length ? e.steps.map(s => '<div class="bul ck">'+I.ckc+'<span>'+esc(s)+'</span></div>').join('') : '<p>Bez uputa.</p>';
  const muscles = e && exMuscles(e), tags = muscles ? muscleTags({ prime:muscles.prime.length ? muscles.prime : muscles.sec, sec:[] }) : '';
  const target = (tags ? '<div class="tagrow">'+tags+'</div>' : '') + (e && e.feel ? '<p><span class="lb">Osjećaj: </span>'+esc(e.feel)+'</p>' : '') + (e && e.note ? '<p>'+esc(firstSentence(e.note))+'</p>' : '');
  const doseRows=checklistHtml(P.items,P,true);
  const contents = [cues,target || '<p>Bez dodatnog opisa.</p>',doseRows];
  const info = '<button type="button" class="dose-info" data-a="playDoseHelp" aria-label="Kako se bilježe serije" aria-haspopup="dialog"><span aria-hidden="true">i</span></button>';
  return '<section class="play-cards" aria-label="Vježba i doziranje"><div class="play-card-tabs" role="tablist" aria-label="Kartice playera">'+names.map((name,i) => '<button type="button" role="tab" id="play-tab-'+i+'" data-a="playDoseCard" data-i="'+i+'" aria-selected="'+(i===on)+'" tabindex="'+(i===on?0:-1)+'" aria-controls="play-card-'+i+'">'+name+'</button>').join('')+'</div><div class="play-card-row'+(on===2?' show-sets':'')+'" id="play-card-row">'+names.map((name,i) => '<section class="play-card" id="play-card-'+i+'" role="tabpanel" aria-labelledby="play-tab-'+i+'" aria-hidden="'+(i!==on)+'"'+(i===on?'':' inert')+'><div class="play-card-heading"><h3>'+name+'</h3>'+(i===2?info:'')+'</div><div class="play-card-content">'+contents[i]+'</div></section>').join('')+'</div><div class="play-card-dots">'+names.map((name,i) => '<button type="button" data-a="playDoseCard" data-i="'+i+'" aria-label="'+name+'" aria-current="'+(i===on)+'"><i></i></button>').join('')+'</div></section>';
}
function playDoseEditorHtml(s, options = {}){
  const it = s.draft, guard = s.kind==='previewDose'?{locked:[],minSets:1}:PlayerDose.locks(P,s.j), ex = S.ex[it.exId], unit = it.measure === 'time' ? 'sec' : 'reps';
  const rows = Array.from({length:it.sets},(_,i) => {
    const set = i+1, d = PlayerDose.at(it,set), locked = guard.closed || guard.locked.includes(set), raw = s.rawForm && s.rawForm.rows.find(r => r.set === set);
    const unknown = s.kind==='previewDose' && StartingLoad.missingSet(it,i,startLoadDescription(it.exId)?.kind);
    const quantity = raw && raw[unit] != null ? raw[unit] : String(d[unit]);
    const kilograms = raw && raw.kg != null ? raw.kg : unknown ? '' : String(d.kg).replace('.',',');
    return '<div data-dose-set="'+set+'"><label>'+set+'.'+(locked ? '<small>zaključano</small>' : '')+'</label><input type="text" inputmode="numeric" data-dose-value="'+unit+'" aria-label="'+set+'. serija '+(unit==='sec'?'sekunde':'ponavljanja')+'" value="'+esc(quantity)+'"'+(locked?' disabled':'')+'><input type="text" inputmode="decimal" data-dose-value="kg"'+(unknown?' data-unknown-kg="true" placeholder="Pri pokretanju"':'')+' aria-label="'+set+'. serija kilogrami" value="'+esc(kilograms)+'"'+(locked?' disabled':'')+'></div>';
  }).join('');
  const timer=unit==='reps'?'<label class="play-dose-rep-timer"><span>Vrijeme serije (s)<small>'+(it.sides?'Ukupno vrijeme rada za obje strane. ':'')+'Prazno za automatsku procjenu prema ponavljanjima.</small></span>'+
    '<input type="text" inputmode="numeric" name="repSetSec" value="'+esc(s.rawForm?.repSetSec??it.repSetSec??'')+'" placeholder="Automatski"'+(guard.closed?' disabled':'')+'></label>':'';
  return '<h3>Doziranje · '+esc(ex ? ex.name : 'Vježba')+'</h3><p class="play-dose-note">'+(s.kind==='previewDose'?'Odaberi serije za sljedeće pokretanje.':'Trening je pauziran dok uređuješ serije.')+' Promjene vrijede za ovu izvedbu.</p><form id="play-dose-form" class="play-dose-editor">'+timer+'<div class="play-dose-count"><label for="play-dose-sets">Serije</label><input id="play-dose-sets" name="sets" type="number" min="'+guard.minSets+'" max="20" value="'+esc(s.rawForm ? s.rawForm.sets : String(it.sets))+'"'+(guard.closed?' disabled':'')+'><button type="button" class="txtbtn" data-a="'+esc(options.resize || 'playDoseResize')+'"'+(guard.closed?' disabled':'')+'>Prikaži</button></div><div class="play-dose-table"><div class="play-dose-head"><span>Serija</span><span>'+(unit==='sec'?'Sekunde':'Ponavljanja')+'</span><span>kg</span></div>'+rows+'</div>'+(s.error?'<p class="play-dose-error" role="alert">'+esc(s.error)+'</p>':'')+'<button type="button" class="btn" data-a="'+esc(options.apply || 'playDoseApply')+'"'+(guard.closed?' disabled':'')+'>'+esc(options.applyLabel || 'Primijeni na ovaj trening')+'</button><button type="button" class="btn sec" data-a="'+esc(options.cancel || 'playDoseCancel')+'">'+(guard.closed?'Zatvori':'Odustani')+'</button></form>';
}
function playDoseReadForm(s,form){
  s.rawForm={sets:form.querySelector('[name="sets"]').value,repSetSec:form.elements.repSetSec?.value,rows:Array.from(form.querySelectorAll('[data-dose-set]')).map(el => {
    const row={set:Number(el.dataset.doseSet)}; el.querySelectorAll('[data-dose-value]').forEach(input => row[input.dataset.doseValue]=input.value); return row;
  })};
  return PlayerDose.readForm(form);
}
function openPlayDoseSheet(sheet) {
  const left=remaining();
  P.dosePause={wasPaused:P.paused,left}; P.left=left; P.paused=true;
  S.sheet=sheet; savePlay(); render();
}
function playDoseResumeEditing(){
  if (!P) return;
  const help=S.sheet?.kind==='playDoseHelp', pause=P.dosePause;
  delete P.dosePause; S.sheet = null;
  if (pause) { P.paused = pause.wasPaused; P.left = pause.left; if (!P.paused && (P.steps[P.i] || {}).dur) P.endAt = Date.now()+pause.left*1000; }
  savePlay(); render();
  if (help) app.querySelector('[data-a="playDoseHelp"]')?.focus({preventScroll:true});
}
VIEWS.play = function(){
  if (!P) return VIEWS.home();
  if (P.done) {
    const cands = progCandidates(), any = anyCredit();
    const willCount = any && P.ref && weekPlan(weekStart(Date.now())).some(s => slotHit(s, { kind: P.ref.kind, refId: P.ref.id }));
    // the load of what was done (recomputed with every answer on this screen); the last set's reserve can still be tapped here
    const entry = any ? sessionEntry() : null;
    const wk = willCount ? weekAfter(entry) : { planned: 0 };
    const share = entry ? sessionShare(entry) : 1, partial = willCount && (share < 0.5 || P.countAsDone === true);
    const lm = entry ? computeSession(entry) : null, rks = any ? reserveSteps() : []; P._lm = lm;
    const editLast = cinemaReviewResultButton(cinemaLastRecordedIndex());
    return '<div class="view gut stack">' + topbar('', '') +
      '<div class="done'+(cands.length || lm ? ' compact' : '')+'">'+(any && !lm ? '<span class="ck">'+I.check+'</span>' : '')+'<h1 class="'+(lm ? 'dh' : '')+'" style="margin:10px 0 0;font-size:30px;font-weight:600">'+(lm ? '<span class="ck">'+I.check+'</span>' : '')+(!any ? 'Ništa nije odrađeno' : P.quit ? 'Trening je prekinut' : 'Bravo!')+'</h1><span style="font-size:16px;color:var(--text-body)">' + esc(P.title) + ' • ' + fmtDur(P.secs) + '</span>' +
        (wk.planned ? '<span class="sub" style="margin:0">Ovaj tjedan ' + wk.done + '/' + wk.planned + ' po planu</span>' : '') +
        (partial ? '<div class="partial-count"><span>'+(P.countAsDone ? 'Računa se kao odrađen dan plana.' : 'Odrađeno '+Math.round(share * 100)+' % radnih serija. Za dan plana treba barem pola.')+'</span>'+
          '<button type="button" class="txtbtn" data-a="countAsDone" aria-pressed="'+(P.countAsDone === true)+'">'+(P.countAsDone ? 'Ne računaj' : 'Računaj kao odrađeno')+'</button></div>' : '') +
        (!any ? '<span class="sub" style="margin:0;line-height:19px">Trening se ne sprema dok nijedna serija nije odrađena.' + (cands.length ? ' Ako si vježbe napravio bez playera, označi ih „Sve odrađeno”.' : '') + '</span>' : '') + '</div>' +
      // the decisions first (fits a 375 × 812 iPhone): the session rating, the last set, "Kako je išlo?"; the load card after them
      editLast + (lm ? rpeHtml() : '') + (rks.length ? '<div class="rirlast">' + rks.map(k => rirRowHtml(k, true)).join('') + '</div>' : '') +
      (cands.length ? '<h2 class="h2" style="margin-top:22px">Kako je išlo?</h2>' +
        '<div class="list" style="margin-top:10px;gap:0">' + cands.map(c => {
          // pre-marked from what the player saw: all sets, some sets ('partial') or none ('skip'); the last two don't count
          const a = P.answers[c.j], failed = a === false, ok = a === true, n = c.it.sets || 1, did = setsDoneOf(c.j);
          const msg = a === 'skip' ? 'Preskočeno' + (c.prog ? '' : ': ne računa se u napredak')
            : a === 'partial' ? (did ? 'Odrađeno: ' + did + ' od ' + n + ' ' + plural(n, 'serije', 'serije', 'serija') : 'Djelomično odrađeno') + (c.prog ? '' : ' · ne računa se u napredak')
            : doneMsg(c);
          const lr = lastRepsOf(c.j);
          return '<div class="xrow"><div class="tx"><b>' + esc(c.e.name) + (entry?.items?.[c.j] ? ' · ' + nwNum(recordedDoseLabel(entry.items[c.j])) : '') + '</b>' +   // a number stays with its unit ('7,5 kg')
            '<div class="seg2"><button data-a="answer" data-j="'+c.j+'" data-v="1" aria-pressed="'+ok+'" class="'+(ok ? 'on' : '')+'">Sve odrađeno</button><button data-a="answer" data-j="'+c.j+'" data-v="0" aria-pressed="'+failed+'" class="'+(failed ? 'onA' : '')+'">Nisam uspio</button></div>' +
            (failed && c.it.measure !== 'time' ? '<div class="mini">Zadnja serija: <button class="sbtn" data-a="lrep" data-j="'+c.j+'" data-d="-1" aria-label="Ponavljanja u zadnjoj seriji: smanji">−</button><b>'+esc(lr)+'</b><button class="sbtn" data-a="lrep" data-j="'+c.j+'" data-d="1" aria-label="Ponavljanja u zadnjoj seriji: povećaj">+</button> '+plural(lr, 'ponavljanje', 'ponavljanja', 'ponavljanja')+'</div>' : '') +
            (msg ? '<em class="'+(failed ? 'a' : (ok && !c.prog && (c.it.ok || 0) + 1 >= progN()) ? 'g' : '')+'"'+(ok || failed ? '' : ' style="color:var(--text-2)"')+'>' + esc(msg) + '</em>' : '') + '</div></div>';
        }).join('') + '</div>' : '') + sessionMuscleComparison(entry,P.originalMusclePlan || P.musclePlan) + (lm ? lmCardHtml(lm) : '') +
      masDoneHtml() + '<div style="height:12px"></div></div>' +
      '<div class="footer gut stack" style="gap:10px"><button class="btn" data-a="finishPlay">'+(!any ? 'Izađi' : P.quit ? 'Spremi i izađi' : 'Završi')+'</button>' + cinemaRedoButton('Ponovi zadnju seriju') + (P.quit || !any ? '' : '<button class="txtbtn" data-a="restartPlay" style="align-self:center">Spremi i ponovi</button>') + '</div>';
  }
  if(P.mode==='ex')return workoutCinemaHtml();
  // the demo video of the screen being replaced; after() puts it back when the exercise stays the same
  keepMedia = app.dataset.key === 'play:' ? app.querySelector('.view .media video, .view .media img') : null;
  const v = curView(), rk = rirStep();
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
        '<span class="lb">Trening</span><p>'+esc(P.title)+'</p>' + (P.f.summary_hr ? '<p style="color:var(--text-body);font-size:15px">'+esc(fieldTxt(P.f.summary_hr))+'</p>' : '') +
        (SHOW_SOURCES ? '<span class="lb">Izvor</span><p style="font-size:14px">' + (P.f.source_url ? '<a href="'+esc(P.f.source_url)+'" target="_blank" rel="noopener">'+esc(P.f.source_title || 'STATSports')+'</a>' : esc(P.f.source_title || 'STATSports')) + '</p>' : '') + '</section>'
    : playDoseCardsHtml(v.e);
  return '<div class="view workout-live">' +
    '<div class="gut">' + topbar('<button class="ib" data-a="quitPlay" aria-label="Prekini trening">'+I.back+'</button>', '<button class="ib" data-a="playSettings" aria-label="Postavke playera">'+I.gear+'</button><button class="ib" data-a="playList" aria-label="Popis vježbi">'+I.list+'</button>') + '</div>' +
    '<div class="prog" role="progressbar" aria-label="Napredak" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+Math.round(prog*100)+'"><i id="progbar" style="width:'+(prog*100).toFixed(1)+'%"></i></div>' +
    media +
    '<div class="ttl gut">' + esc(v.title) + '</div><div class="meta gut">' + esc(v.meta) + '</div><div class="hint gut" id="phint">' + esc(v.hint) + '</div>' +
    (rk >= 0 ? rirRowHtml(rk, P.steps[rk].e !== v.e) : '') + card + '<div style="height:12px"></div></div>' +
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
  const n = document.getElementById('ringN');
  if(P.mode==='ex'&&!P.done){
    const text=cinemaClockText(v.st);if(n&&n.textContent!==text)n.textContent=text;
    const fill=document.getElementById('cinema-clock-fill');
    if(fill){
      const count=cinemaClockCount(v.st);
      if(Number(fill.dataset.count)!==count){
        fill.dataset.count=String(count);
        fill.setAttribute('d',cinemaClockSegments.slice(0,count).join(''));
      }
    }
    const elapsed=document.getElementById('cinema-elapsed'),textElapsed=fmt(SessionClock.update(P.clock,Date.now(),!!P.paused)?.seconds||0);if(elapsed&&elapsed.textContent!==textElapsed)elapsed.textContent=textElapsed;
  }else if(n&&!P.paused&&v.st.kind!=='ready'&&n.textContent!==v.big)n.textContent=v.big;
  const fb = document.getElementById('fbig'); if (fb&&fb.textContent!==v.big) fb.textContent = v.big;
  const arc = document.getElementById('ringArc'); if (arc) { const C = 2*Math.PI*35; arc.setAttribute('stroke-dasharray', (C*Math.max(0,Math.min(1,v.ringFrac))).toFixed(1)+' '+C.toFixed(1)); }
  const pb = document.getElementById('progbar'); if (pb) { const prog = (P.i + (v.st.dur ? 1 - remaining()/v.st.dur : 0)) / P.steps.length; pb.style.width = (prog*100).toFixed(1) + '%'; pb.parentElement.setAttribute('aria-valuenow',String(Math.round(prog*100))); }
  const percent=document.getElementById('cinema-percent');if(percent)percent.textContent=Math.round((P.i+(v.st.dur?1-remaining()/v.st.dur:0))/P.steps.length*100)+'%';
  if (P._lastI !== P.i) { P._lastI = P.i; render(); }
}
// The screen is rebuilt at every step; the demo video (or photo) of the same exercise is moved over from the old screen,
// so it keeps playing instead of loading and starting again at every set, rest and side change.
// The whole strip can be pulled down. The centered grip is also a button.
// Filter and analytics sheets accept downward pulls from the top of their content.
let sheetGestureClickUntil=0;
function attachSheetGestures(){
  if(!attachSheetGestures.bound){
    attachSheetGestures.bound=true;
    app.addEventListener('click',ev=>{
      if(ev.detail>0&&performance.now()<sheetGestureClickUntil){sheetGestureClickUntil=0;ev.preventDefault();ev.stopImmediatePropagation();}
    },true);
  }
  const sheets=app.querySelectorAll('.sheet,dialog.pg-dialog,dialog.tl-dialog');
  sheets.forEach(node=>{
    if(node.querySelector(':scope > .sheet-drag-handle'))return;
    const native=node.tagName==='DIALOG';
    if(!native&&!node.querySelector(':scope > .grab,:scope > .cinema-journal .cinema-journal-heading'))return;
    const handle=document.createElement('button');
    handle.type='button';handle.className='sheet-drag-handle';handle.setAttribute('aria-label','Zatvori prozor');
    handle.title='Povuci dolje ili dodirni za zatvaranje';
    if(native)node.firstElementChild.after(handle);else node.prepend(handle);
    const band=document.createElement('div');
    band.className='sheet-drag-band';band.setAttribute('aria-hidden','true');
    handle.before(band);
    // Give mobile hit testing an explicit target above the sheet's header buttons.
    band.addEventListener('click',ev=>{ev.preventDefault();ev.stopPropagation();});
    const current=()=>node.isConnected&&(native?node.open:!!S.sheet&&app.querySelector('.sheet')===node);
    const close=()=>{if(!current())return;if(!native)dismissSheet();else if(node.id==='progress-info')ProgressView.closeInfo();else if(node.id==='training-load-info')TrainingLoadView.closeInfo();};
    const outsideDialog=point=>{
      const box=node.getBoundingClientRect();
      return point.clientX<box.left||point.clientX>box.right||point.clientY<box.top||point.clientY>box.bottom;
    };
    const backdrop=native?node:node.parentElement?.closest('[data-a="sheetClose"]');
    if(backdrop){
      let tap=null;
      const outside=ev=>ev.target===backdrop&&(!native||outsideDialog(ev));
      const moved=ev=>Math.hypot(ev.clientX-tap.x,ev.clientY-tap.y)>8;
      backdrop.addEventListener('pointerdown',ev=>{
        tap=current()&&ev.isPrimary!==false&&ev.button===0&&outside(ev)?{id:ev.pointerId,x:ev.clientX,y:ev.clientY,ready:false}:null;
      });
      backdrop.addEventListener('pointermove',ev=>{if(tap&&tap.id===ev.pointerId&&moved(ev))tap=null;});
      backdrop.addEventListener('pointerup',ev=>{
        if(tap&&tap.id===ev.pointerId)tap.ready=outside(ev)&&!moved(ev);
      });
      backdrop.addEventListener('pointercancel',()=>{tap=null;});
      backdrop.addEventListener('click',ev=>{
        if(!outside(ev))return;
        const allowed=tap?.ready&&current()&&(native||!(S.sheet?._busy||S.sheet?.loading||S.sheet?.pendingReplacement));
        tap=null;
        // Other sheet backdrops already route a click through dismissSheet.
        if(native||!allowed)ev.stopPropagation();
        if(native&&allowed)close();
      });
    }
    const reset=()=>{node.classList.remove('is-sheet-dragging');node.style.removeProperty('transform');node.style.removeProperty('transition');};
    const follow=dy=>{
      node.classList.remove('is-opening');node.classList.add('is-sheet-dragging');node.style.transition='none';
      node.style.transform='translate3d(0,'+Math.min(Math.max(dy,0),node.clientHeight)+'px,0)';
    };
    const finish=(move,cancelled,ev)=>{
      if(Math.max(Math.abs(move.dx),Math.abs(move.dy))>8){sheetGestureClickUntil=performance.now()+350;ev.preventDefault();}
      const threshold=Math.min(110,Math.max(56,node.clientHeight*.16));
      if(!cancelled&&current()&&move.dy>=threshold&&move.dy>Math.abs(move.dx)*1.25){
        node.style.transition=stillMotion()?'none':'transform .16s ease-out';
        node.style.transform='translate3d(0,'+(node.clientHeight+24)+'px,0)';
        setTimeout(()=>{close();reset();},stillMotion()?0:160);
      }else reset();
    };
    let drag=null;
    handle.addEventListener('click',ev=>{ev.preventDefault();ev.stopPropagation();close();});
    node.addEventListener('pointerdown',ev=>{
      const grip=ev.target.closest?.('.sheet-drag-handle,.sheet-drag-band');
      if((grip!==handle&&grip!==band)||!current()||ev.isPrimary===false||(ev.pointerType==='mouse'&&ev.button!==0))return;
      drag={id:ev.pointerId,x:ev.clientX,y:ev.clientY,dx:0,dy:0,grip};
      node.classList.add('is-sheet-dragging');
      try{grip.setPointerCapture(ev.pointerId);}catch(e){}
    });
    node.addEventListener('pointermove',ev=>{
      if(!drag||drag.id!==ev.pointerId||!current())return;
      drag.dx=ev.clientX-drag.x;drag.dy=ev.clientY-drag.y;
      if(drag.dy>6&&drag.dy>Math.abs(drag.dx)){ev.preventDefault();follow(drag.dy);}
    },{passive:false});
    const end=(ev,cancelled)=>{
      if(!drag||drag.id!==ev.pointerId)return;
      const move=drag;drag=null;
      try{move.grip.releasePointerCapture(ev.pointerId);}catch(e){}
      finish(move,cancelled,ev);
    };
    node.addEventListener('pointerup',ev=>end(ev,false));
    node.addEventListener('pointercancel',ev=>end(ev,true));
    node.addEventListener('lostpointercapture',ev=>end(ev,true));

    if(!native&&!['eq','workoutSwap'].includes(node.dataset.kind))return;
    let pull=null;
    node.addEventListener('touchstart',ev=>{
      if(pull?.claimed)reset();
      pull=null;
      if(!current()||ev.touches.length!==1||ev.target.closest?.('.sheet-drag-handle,.sheet-drag-band,input,textarea,select,[contenteditable]'))return;
      const scroller=ev.target.closest?.('.fbody,.workout-swap-body,#progress-info-body,#training-load-info-body');
      if(scroller?.scrollTop>1)return;
      const touch=ev.touches[0];
      if(native&&ev.target===node&&outsideDialog(touch))return;
      pull={id:touch.identifier,x:touch.clientX,y:touch.clientY,dx:0,dy:0,claimed:false};
    },{passive:true});
    node.addEventListener('touchmove',ev=>{
      const touch=ev.touches[0];
      if(!pull||!touch||touch.identifier!==pull.id||!current())return;
      pull.dx=touch.clientX-pull.x;pull.dy=touch.clientY-pull.y;
      if(!pull.claimed){
        if(Math.max(Math.abs(pull.dx),Math.abs(pull.dy))<=6)return;
        if(!ev.cancelable||pull.dy<=Math.abs(pull.dx)*1.25){pull=null;return;}
        pull.claimed=true;
      }
      ev.preventDefault();follow(pull.dy);
    },{passive:false});
    node.addEventListener('touchend',ev=>{
      const move=pull;pull=null;
      if(move?.claimed)finish(move,false,ev);
    },{passive:false});
    node.addEventListener('touchcancel',()=>{if(pull?.claimed)reset();pull=null;},{passive:true});
  });
}
// Warm one following picture only after the picture on screen has loaded.
// Private images and videos keep their existing on-demand loading path.
function warmCinemaPicture(imageOrEvent){
  const image=imageOrEvent.currentTarget||imageOrEvent;
  if(!P||P.done||!image.isConnected||navigator.onLine===false||navigator.connection?.saveData||document.hidden)return;
  if(!image.complete){image.addEventListener('load',warmCinemaPicture,{once:true});return;}
  if(!image.naturalWidth)return;
  const current=image.closest('.workout-cinema').dataset.exId;
  const next=P.steps.find((step,index)=>index>P.i&&isWork(step)&&step.it?.exId!==current);
  const exercise=next&&S.ex[next.it.exId],src=exercise&&!exercise.media&&window.EXMEDIA?.[exercise.id]?.pic;
  const warmed=P._warmedPicture;
  if(!src||warmed&&(!warmed.image.complete||warmed.src===src))return;
  const upcoming=new Image();
  upcoming.setAttribute('fetchpriority','low');upcoming.decoding='async';
  P._warmedPicture={image:upcoming,src};upcoming.src=src;
  setTimeout(()=>{
    // Once promoted to the player, the request belongs to the visible image.
    if(P?._warmedPicture?.image===upcoming&&!upcoming.complete)upcoming.removeAttribute('src');
  },5000);
}
function playAfter(){
  P._lastI = P.i;
  setupCinemaPicker();
  const slot = document.getElementById('keepmedia');
  if (slot && keepMedia) slot.replaceWith(keepMedia); else if (slot) slot.remove();
  keepMedia = null;
  const stage=app.querySelector('.workout-cinema-stage');
  if(stage){
    let start=null,lastTap=null;
    stage.addEventListener('pointerdown',ev=>{
      if(!ev.isPrimary||ev.button!==0)return;
      start=ev.target.closest('button,input,a,video[controls]')?null:{x:ev.clientX,y:ev.clientY,id:ev.pointerId};
    },{passive:true});
    stage.addEventListener('pointerup',ev=>{
      if(!start||ev.pointerId!==start.id)return;
      const dx=ev.clientX-start.x,dy=ev.clientY-start.y;start=null;
      if(S.sheet)return;
      if(dy< -65&&Math.abs(dy)>Math.abs(dx)){A.cinemaJournal();return;}
      if(Math.abs(dx)>75&&Math.abs(dx)>Math.abs(dy)){jump(dx<0?1:-1,P.paused);return;}
      if(Math.abs(dx)>=12||Math.abs(dy)>=12)return;
      if(!P.paused){cinemaPause();return;}
      const at=performance.now();
      if(lastTap&&at-lastTap.at<320&&Math.hypot(ev.clientX-lastTap.x,ev.clientY-lastTap.y)<32){lastTap=null;cinemaReplay();return;}
      lastTap={at,x:ev.clientX,y:ev.clientY};
    },{passive:true});
    stage.addEventListener('pointercancel',()=>{start=null;},{passive:true});
    const video=stage.querySelector('video');
    if(video){if(P.paused||stillMotion())video.pause();else video.play()?.catch(()=>{});}
    const picture=stage.querySelector('.cinema-single-media img');
    if(picture)warmCinemaPicture(picture);
  }
  const row = document.getElementById('play-card-row');
  if (row && row.children.length) {
    const pos = i => row.children[i].offsetLeft-row.children[0].offsetLeft;
    row.scrollLeft = pos(P.cardIndex || 0);
    row.addEventListener('scroll',() => {
      if (!P) return;
      let nearest=0; for(let i=1;i<row.children.length;i++) if(Math.abs(row.scrollLeft-pos(i))<Math.abs(row.scrollLeft-pos(nearest)))nearest=i;
      row.classList.toggle('show-sets',nearest===2);
      if (P.cardIndex===nearest) return; P.cardIndex=nearest;
      syncPlayTabs(nearest);
      app.querySelectorAll('.play-card-dots button').forEach((b,i)=>b.setAttribute('aria-current',String(i===nearest)));
      savePlay();
    },{passive:true});
  }
}

/* ---------- sheets ---------- */
function playerTimingChoices(key,values){
  const selected=key==='switchSec'?workoutSidePrepSeconds():S.settings[key];
  return '<div class="chips wrap" style="margin:8px 0 14px">'+values.map(value=>'<button class="chip" data-a="setSetting" data-k="'+key+'" data-v="'+value+'" aria-pressed="'+(selected===value)+'">'+value+' s</button>').join('')+'</div>';
}
function sheetHtml(){
  const s = S.sheet;
  if(s.kind==='cinemaMenu')return '<div class="sheet-bg cinema-popover-bg" data-a="sheetClose"><section class="sheet cinema-option-sheet cinema-popover" data-kind="cinemaMenu" role="dialog" aria-modal="true" aria-labelledby="sheet-h">'+cinemaMenuPopoverHtml()+'</section></div>';
  if(s.kind==='cinemaJournal')return '<div class="sheet-bg cinema-journal-bg" data-a="sheetClose"><section class="sheet cinema-journal-sheet'+(sheetKindWas==='cinemaJournal'?'':' is-opening')+'" data-kind="cinemaJournal" role="dialog" aria-modal="true" aria-label="Dnevnik treninga">'+workoutJournalHtml()+'</section></div>';
  if(s.kind==='workoutSwap')return '<div class="sheet-bg workout-swap-bg" data-a="sheetClose"><section class="sheet workout-swap-sheet'+(sheetKindWas==='workoutSwap'?'':' is-opening')+'" data-kind="workoutSwap" data-stop="1" role="dialog" aria-modal="true" aria-labelledby="sheet-h"><div class="grab"></div>'+workoutSwapHtml(s)+'</section></div>';
  if(s.kind==='workoutExercise')return '<div class="sheet-bg workout-sheet-bg"><section class="sheet workout-fullscreen" data-kind="workoutExercise" data-workout-key="'+(s.live?'live':top().v+':'+top().id)+':'+s.j+':'+(s.panel||'main')+'" role="dialog" aria-modal="true" aria-label="Vježba u treningu">'+workoutPanelHtml(s)+'</section></div>';
  let body = s.kind === 'credit' ? creditSheet(s) : '';
  if(s.kind.startsWith('cinema'))body=cinemaSheetHtml(s);
  if (s.kind === 'workoutExercise') body=workoutPanelHtml(s);
  else if(s.kind==='workoutProtocolOptions'){const p=S.pr[s.id];body=p?workoutProtocolOptionsHtml(p,viewDoseItems(top(),p.items||[])):'<h3>Trening nije dostupan</h3>';}
  else if (s.kind === 'workoutReplace') body='<p class="play-dose-note">Potvrdi novu vježbu. Težina prethodne vježbe nije prenesena.</p>'+playDoseEditorHtml({...s,kind:'previewDose'},{apply:'workoutReplaceApply',resize:'workoutReplaceResize',cancel:'workoutClose',applyLabel:'Potvrdi zamjenu'});
  else if (s.kind === 'startingLoad') body=startingLoadHtml(s);
  else if (s.kind === 'bodyRegion') body='<h3>'+esc(muscleLabel(s.region))+'</h3><p class="sub">Zglobno područje. Oznaka pomaže pronaći i opisati vježbe za to područje; ne dodaje zasebne bodove mišićnog opterećenja.</p>'+bodyFig({prime:[s.region],sec:[]},{size:300})+'<button class="btn sec" data-a="sheetDone">Zatvori</button>';
  else if (s.kind === 'importWorkout') {
    const disabled = s.loading ? ' disabled' : '';
    body = '<h3>Uvezi trening</h3>' +
      '<button type="button" class="opt" data-a="openPreparedWorkout"' + disabled + '><span>Gornji dio nakon utakmice · 60 min</span>' + I.chev + '</button>' +
      '<button type="button" class="opt" data-a="pickWorkoutFile"' + disabled + '>Odaberi datoteku</button>' +
      '<input id="importWorkoutFile" type="file" hidden>' +
      (s.loading ? '<p class="sub" role="status">Otvaram trening…</p>' : '') +
      '<button type="button" class="btn sec" data-a="sheetDone" style="margin-top:12px">Zatvori</button>';
  } else if (s.kind === 'addTo') {
    // your own protocols only: sessions of a programme (e.g. a 6-week plan) keep the programme's doses
    const list = Object.values(S.pr).filter(p => !p.program).sort((a,b) => (b.updatedAt||0) - (a.updatedAt||0));
    body = '<h3>Dodaj u protokol</h3>' + list.map(p => '<button class="opt" data-a="addToPick" data-id="'+esc(p.id)+'"><span>'+esc(p.name)+'</span><span style="color:var(--text-2);font-size:14px">'+nVj((p.items||[]).length)+'</span></button>').join('') +
      '<button class="opt" data-a="addToNew" style="color:var(--accent-text);font-weight:600"><span>+ Novi protokol s ovom vježbom</span></button>';
  } else if (s.kind === 'leave') {
    const pr = top().v === 'build';
    body = '<h3>Spremiti promjene?</h3><p style="margin:0 0 16px;font-size:15px;line-height:22px;color:var(--text-body)">' + (pr ? 'Promjene u ovom protokolu još nisu spremljene.' : top().v==='exEdit' ? 'Promjene u ovoj vježbi još nisu spremljene.' : 'Ovaj unos još nije spremljen.') + '</p>' +
      '<div class="stack" style="gap:10px"><button class="btn" data-a="leaveSave" style="height:52px;font-size:17px">Spremi i izađi</button><button class="btn danger" data-a="leaveDiscard">Izađi bez spremanja</button><button class="btn sec" data-a="sheetDone" style="height:48px">Nastavi uređivanje</button></div>';
  } else if (s.kind === 'progTest' || s.kind === 'progRestart') {
    body = progSheet(s);
  } else if (s.kind === 'eq') {
    const n = libFiltered().length, cs = S.lib.cats || [], mu = S.lib.mus || [];
    const equipped = EQ_TILES.filter(tileOn).length;
    const x = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17"/></svg>';
    const fig = bodyFig({ prime: mu, sec: [] }, { act: 'musTap', size: 360, cls: 'filtfig' });
    body = '<div class="fhd"><h3>Filter vježbi</h3><span class="fcnt" id="fcnt" aria-live="polite" aria-label="' + n + ' ' + plural(n, 'vježba', 'vježbe', 'vježbi') + '">' + n + '</span></div>' +
      '<div class="fbody">' +
      (S.lib.cat !== 'Sve' || S.lib.q ? '<div class="chips wrap fpre" role="group" aria-label="Također filtrira">' + (S.lib.cat !== 'Sve' ? '<button class="afc" data-a="filtDrop" data-k="libcat" data-v="'+esc(S.lib.cat)+'" aria-label="Ukloni filter: '+esc(S.lib.cat)+'">'+esc(S.lib.cat)+x+'</button>' : '') +
        (S.lib.q ? '<button class="afc" data-a="filtDrop" data-k="q" data-v="" aria-label="Ukloni pretragu: '+esc(S.lib.q)+'">„'+esc(S.lib.q)+'“'+x+'</button>' : '') + '</div>' : '') +
      '<div class="fsec"><div class="fl" id="fl-cat">Kategorija</div><div class="chips wrap fcats" role="group" aria-labelledby="fl-cat">' + CATS.map(c => '<button class="chip sm" data-a="catToggle" data-v="'+esc(c)+'" aria-pressed="'+(cs.indexOf(c) !== -1)+'">'+esc(c)+'</button>').join('') + '</div></div>' +
      '<div class="fsec"><button type="button" class="f-eq-toggle" id="fl-eq" data-a="eqToggle" aria-expanded="'+!!s.eqOpen+'" aria-controls="f-equipment"><span>Oprema</span>' +
        (equipped ? '<span class="f-eq-count">'+equipped+' odabrano</span>' : '') + I.chev + '</button>' +
        '<div class="eqgrid" id="f-equipment" role="group" aria-labelledby="fl-eq"'+(s.eqOpen?'':' hidden')+'>' + EQ_TILES.map(t => '<button class="eqt" data-a="eqTile" data-v="'+esc(t[0])+'" aria-pressed="'+tileOn(t)+'"><span class="bx">'+t[2]+'</span><span class="tx">'+esc(t[0])+'</span></button>').join('') + '</div></div>' +
      '<div class="fsec" id="fzona"><div class="fl"><span id="fl-z">Zona</span></div>' +
        '<div class="zsh" role="group" aria-label="Prečaci">' + MUS_SETS.map(x => '<button class="chip sm" data-a="musTap" data-v="'+x[0]+'" aria-pressed="'+musSetOn(mu, x[0])+'">'+x[1]+'</button>').join('') + '</div>' +
        (fig ? '<div class="figs" role="group" aria-labelledby="fl-z">' + fig + '<div class="figl"><span>Sprijeda</span><span>Straga</span></div></div>' : '') +
        '<div class="zch">' + (mu.length ? musChips(mu).map(c => '<button class="afc" data-a="musTap" data-v="'+c[0]+'" aria-label="Ukloni: '+esc(c[1])+'">'+esc(c[1])+x+'</button>').join('') : '<span class="zhint">Dodirni mišić na tijelu.</span>') + '</div></div></div>' +
      '<div class="fft"><button class="btn sec" data-a="filtClear">Očisti</button><button class="btn" data-a="sheetDone">Prikaži ' + n + ' ' + plural(n, 'vježbu', 'vježbe', 'vježbi') + '</button></div>';
  } else if (s.kind === 'day') {
    const ws = weekStart(Date.now()), st = weekStatus(ws, weekPlan(ws)), i = s.i, today = dayIdx(Date.now()), m = matchDay();
    const plan = st.slots.filter(x => x.day === i), done = st.log.filter(l => dayIdx(l.at) === i);
    const d = new Date(calDay(ws, i)), mt = matchOn(d.getTime());
    body = '<h3>' + esc(DAYNAMES[i].charAt(0).toUpperCase() + DAYNAMES[i].slice(1)) + ', ' + d.getDate() + '. ' + (d.getMonth() + 1) + '.' + (mt ? ' · utakmica' : '') + '</h3>' +
      '<div class="prow" style="min-height:56px;margin-bottom:8px;border-bottom:1px solid var(--border)"><span class="k">Utakmica' + (i === m ? '<small>Stalni dan utakmice iz Doziranja</small>' : '') + '</span><button class="switch" role="switch" data-a="toggleMatch" data-i="' + i + '" aria-checked="' + mt + '" aria-label="Utakmica"></button></div>' +
      // 1.8.2: a missed session can be skipped for this week (Preskoči), a skipped one taken back (Vrati)
      (plan.length ? '<p class="label" style="padding:0 0 6px">Plan</p>' + plan.map(x => {
        const miss = !x.done && !x.skip && i < today, o = '<button class="opt" '+slotOpen(x)+'><span>'+esc(x.name)+'</span><span class="tag'+(x.skip ? ' sec' : '')+'">'+(x.done ? 'odrađeno' : x.skip ? 'preskočeno' : x.partial ? 'djelomično' : i < today ? 'propušteno' : 'čeka')+'</span></button>';
        return miss || x.skip ? '<div class="dslot">' + o + '<button class="bt ghost" data-a="'+(x.skip ? 'unskipSlot' : 'skipSlot')+'" data-k="'+esc(slotKey(x))+'" aria-label="'+esc((x.skip ? 'Vrati u plan: ' : 'Preskoči ovaj tjedan: ') + x.name)+'">'+(x.skip ? 'Vrati' : 'Preskoči')+'</button></div>' : o;
      }).join('') : '<p style="margin:0 0 8px;color:var(--text-2)">Za ovaj dan nema plana.</p>') +
      (i >= today ? matchBox(plan.filter(x => !x.done && !x.skip).map(x => matchNote(x, i)).find(Boolean), i, '12px 0 0') : '') +
      (done.length ? '<p class="label" style="padding:14px 0 6px">Odrađeno</p>' + done.map(l => '<div class="opt"><span>'+esc(l.name)+'</span><span style="color:var(--text-2);font-size:14px">'+(planCounts(l) ? '' : 'djelomično · ')+fmtDur(l.secs)+'</span></div>').join('') : '') +
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
      (SHOW_SOURCES ? '<p style="margin:0;font-size:13px;line-height:19px;color:var(--text-2)">Izvori: ' + PROG_REFS.map(r => '<a href="'+esc(r.url)+'" target="_blank" rel="noopener">'+esc(r.t)+'</a>').join(' · ') + '</p>' : '') + '</div>').replace(/(\d) (?=kg\b|s\b|%|puta\b)/g, '$1&nbsp;');   // a number stays on the line of its unit
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
      '<p style="margin:14px 0 0;font-size:13px;color:var(--text-2)">' + esc(dataCounts(storeObj(),S.settings)) + '</p>' +
      '<p style="margin:6px 0 0;font-size:13px;color:var(--text-2)">Verzija ' + APP_VERSION + '</p>';
  } else if (s.kind === 'restore') {
    // what a backup (or the data from before the last import) would replace, side by side, before anything changes
    const d = s.d, when = s.undo ? s.at : Date.parse(d.exportedAt) || 0;
    const lost = lostEntries(S.log, d.log), none = !s.undo && nothingOwn();
    const box = (title, x, settings) => '<div class="opt" style="flex-direction:column;align-items:flex-start;justify-content:center;gap:2px;padding:10px 4px;box-sizing:border-box"><b style="font-size:15px">' + esc(title) + '</b><span style="font-size:14px;color:var(--text-2)">' + esc(dataCounts(x,settings)) + '</span></div>';
    body = '<h3>' + (s.undo ? 'Vratiti podatke od prije uvoza?' : 'Vratiti podatke iz kopije?') + '</h3>' +
      box(s.undo ? 'Podaci od prije uvoza' + (when ? ' (' + shortDate(when) + ')' : '') : 'Kopija' + (when ? ' od ' + shortDate(when, true) : ''), d, s.undo?s.settings:d.settings) + box('Sada na mobitelu', storeObj(),S.settings) +
      (lost.length ? '<div class="lift warn" style="margin:12px 0 0"><div class="why" style="color:var(--text-body)">' + esc((s.undo ? 'Ovo nije u podacima od prije uvoza' : 'Ovo nije u kopiji') + ' i nestat će iz povijesti ako zamijeniš podatke: ' + lostText(lost) + '.') + '</div></div>' : '') +
      '<p style="margin:12px 0 14px;font-size:13px;line-height:19px;color:var(--text-2)">' + (s.undo ? 'Sve na mobitelu zamijenit će se podacima od prije uvoza.' : 'Sve na mobitelu (vježbe, protokoli, plan, povijest i postavke) zamijenit će se kopijom. Slike i videi ostaju.' + (none ? '' : ' Sadašnje podatke možeš vratiti u Mojim podacima dok ne uvezeš sljedeću kopiju.')) + '</p>' +
      (s.noUndo ? '<p style="margin:0 0 14px;font-size:14px;line-height:20px;color:var(--danger)">Sadašnje podatke nije moguće sačuvati za povratak. Ako ih zamijeniš, ne možeš ih vratiti.</p>' : '') +
      '<div class="seg"><button class="btn sec" data-a="sheetDone" style="height:48px">Odustani</button><button class="btn" data-a="restoreApply" style="height:48px;font-size:16px"' + (s._busy ? ' disabled' : '') + '>' + (s.noUndo ? 'Ipak zamijeni' : 'Zamijeni podatke') + '</button></div>';
  } else if (s.kind === 'settings') {
    const note = t => '<p style="margin:0 0 10px;font-size:13px;line-height:19px;color:var(--text-2)">' + t + '</p>';
    body = '<h3>Postavke playera</h3>' +
      playerSignalSettings() +
      (wakeOk ? '' : note('Ovaj uređaj ne može držati ekran upaljenim tijekom treninga. Na iPhoneu produlji automatsko zaključavanje: Postavke › Zaslon i svjetlina › Automatsko zaključavanje.')) +
      '<p class="label" style="padding:12px 0 0">Priprema pri promjeni strane</p>' + playerTimingChoices('switchSec',SIDE_PREP_CHOICES) +
      '<p class="label" style="padding:0">Pauza između vježbi</p>' + playerTimingChoices('transSec',[5,10,15,20]).replace('margin:8px 0 14px','margin:8px 0 6px') +
      note('Trajanje priprema i pauza vrijedi od sljedećeg pokretanja.') +
      '<p class="label" style="padding:4px 0 0">Upis rezerve (RIR)</p><div class="chips wrap" style="margin:8px 0 6px">' + RESERVE_ENTRY.map((label, value) => '<button class="chip" data-a="setSetting" data-k="reserveEntry" data-v="' + value + '" aria-pressed="' + (reserveEntry() === value) + '">' + label + '</button>').join('') + '</div>' +
      note(RESERVE_HELP[reserveEntry()] + ' Vrijedi odmah.') +
      '<button type="button" class="btn" data-a="cinemaClose" style="margin-top:4px">Gotovo</button>';
  } else if (s.kind === 'quit') {
    const any = P && anyDone();
    body = '<h3>Prekinuti trening?</h3>' +
      '<p style="margin:0 0 16px;font-size:15px;line-height:22px;color:var(--text-body)">' + (any ? 'Ono što si dosad odradio možeš spremiti u povijest.' + (P.mode === 'ex' ? ' Vježbe koje nisi odradio ne računaju se u napredak.' : '') : 'Još ništa nije odrađeno do kraja, pa nema što spremiti.') + '</p>' +
      (any ? '<button class="btn" data-a="quitSave">Pregledaj i spremi odrađeno</button>' : '') +
      '<button class="btn danger" data-a="quitDiscard" style="margin-top:10px">Izađi bez spremanja</button>' +
      '<button class="btn sec" data-a="quitResume" style="margin-top:10px;height:48px">Nastavi trening</button>';
  } else if (s.kind === 'resume') {
    const r = s.s, m = Math.round((Date.now() - (r.at || 0)) / 60000), d = new Date(r.finishedAt || r.at || Date.now());
    const any = Object.keys(r.doneSteps || {}).length > 0;
    body = r.done
      ? '<h3>Trening nije spremljen</h3><p style="margin:0 0 16px;font-size:15px;line-height:22px;color:var(--text-body)">„' + esc(r.title) + '” od ' + d.getDate() + '. ' + (d.getMonth() + 1) + '. je završen, ali nije spremljen u povijest.</p>' +
        '<button class="btn" data-a="resumeGo">Pregledaj i spremi</button><button class="btn danger" data-a="resumeDrop" style="margin-top:10px">Odbaci</button>'
      : '<h3>Nastaviti trening?</h3><p style="margin:0 0 16px;font-size:15px;line-height:22px;color:var(--text-body)">„' + esc(r.title) + '” je ostao nedovršen (' + (m < 1 ? 'maloprije' : m < 60 ? 'prije ' + m + ' min' : 'prije ' + Math.round(m / 60) + ' h') + ').</p>' +
        '<button class="btn" data-a="resumeGo">Nastavi trening</button>' + (any ? '<button class="btn sec" data-a="resumeSave" style="margin-top:10px;height:48px">Pregledaj i spremi odrađeno</button>' : '') +
        '<button class="btn danger" data-a="resumeDrop" style="margin-top:10px">Odbaci</button>';
  } else if (s.kind === 'playDoseHelp') {
    const states=[['planned','Serija još čeka na red.'],['active','Sada je na redu ova serija.'],
      ['done','Završena je cijela serija.'],['partial','Odrađen je samo dio, primjerice jedna strana.'],
      ['skipped','Ova je serija preskočena.']];
    body='<h3>Kako se bilježe serije</h3><p>Tajmer bilježi seriju po isteku. Kvačicom možeš završiti seriju na ponavljanja ranije. Stvarna ponavljanja i rezervu upiši u Dnevnik.</p>'+
      '<ul class="set-legend">'+states.map(([key,description])=>'<li data-state="'+key+'"><span aria-hidden="true">'+SET_STATUS[key][0]+'</span><div><strong>'+SET_STATUS[key][1]+'</strong><small>'+description+'</small></div></li>').join('')+
      '</ul><button type="button" class="btn sec" data-a="playDoseCancel">Zatvori</button>';
  } else if (s.kind === 'playDose' || s.kind === 'previewDose') {
    body = playDoseEditorHtml(s);
  } else if (s.kind === 'playList') {
    const groups = [];
    P.steps.forEach((st, k) => { if (!isWork(st)) return; if (!groups.some(g => g.g === st.g)) groups.push({ g: st.g, k, lab: st.ss ? st.ss.L + st.ss.k : String(st.g + 1) + '.', name: P.mode === 'field' ? (st.b ? st.b.label_hr : '') : (st.e ? st.e.name : '') }); });
    const cur = (P.steps[P.i] || {}).g;
    body = '<h3>' + esc(P.title) + '</h3>' + groups.map(g => '<button class="opt" data-a="jumpTo" data-k="'+g.k+'"><span>'+esc(g.lab)+' '+esc(g.name)+'</span>'+(g.g===cur?'<span class="tag">sada</span>':'')+'</button>').join('');
  }
  // the dialog is named by its title, which takes focus when the sheet opens (see refocus)
  const named = body.indexOf('<h3') !== -1; if (named) body = body.replace('<h3', '<h3 id="sheet-h" tabindex="-1"');
  return '<div class="sheet-bg" data-a="sheetClose"><div class="sheet gut'+(s.kind === 'eq' ? ' fsheet' : '')+(s.kind.startsWith('cinema')?' cinema-option-sheet':'')+'" data-kind="'+esc(s.kind)+'" data-stop="1" role="dialog" aria-modal="true"' + (named ? ' aria-labelledby="sheet-h"' : '') + '><div class="grab"></div>' + body + '</div></div>';
}
function cinemaMenuPopoverHtml(){
  return '<h3 id="sheet-h" class="cinema-popover-title" tabindex="-1">Mogućnosti treninga</h3>'+
    '<div class="cinema-menu-grid"><button type="button" data-a="cinemaPlayback">'+WorkoutView.icon('settings-2')+'<span>Postavke<br>treninga</span></button>'+
    '<button type="button" data-a="cinemaPace">'+WorkoutView.icon('timer')+'<span>Postavke<br>tempa</span></button>'+
    '<button type="button" data-a="cinemaAudio">'+WorkoutView.icon('volume-2')+'<span>Zvuk i<br>vibracija</span></button></div>'+
    '<div class="cinema-popover-group"><button type="button" class="opt" data-a="cinemaShare">'+WorkoutView.icon('share-2')+'<span>Podijeli trening</span></button>'+
    '<button type="button" class="opt" data-a="cinemaGuide">'+WorkoutView.icon('info')+'<span>Kako koristiti player</span></button></div>'+
    '<div class="cinema-popover-group"><button type="button" class="opt" data-a="cinemaFinish">'+WorkoutView.icon('circle-check')+'<span>Završi trening</span></button>'+
    '<button type="button" class="opt cinema-popover-danger" data-a="cinemaExit">'+WorkoutView.icon('x')+'<span>Prekini trening</span></button></div>';
}
function cinemaSheetHtml(s){
  const close='<button type="button" class="btn sec" data-a="cinemaClose">'+(s.returnCinemaMenu?'Natrag':'Gotovo')+'</button>';
  if(s.kind==='cinemaAddExercise')return cinemaAddExerciseHtml(s);
  if(s.kind==='cinemaRemoveExercise')return '<h3>Ukloni vježbu</h3><p>'+esc(S.ex[P.items[s.j]?.exId]?.name||'Vježba')+' uklonit će se iz ovog treninga.</p><button type="button" class="btn sec cinema-remove-confirm" data-a="cinemaExerciseRemove">Ukloni iz treninga</button><button type="button" class="btn sec" data-a="cinemaClose">Odustani</button>';
  if(s.kind==='cinemaPlayback')return '<h3>Postavke treninga</h3>'+cinemaMenuControls()+
    '<button type="button" class="opt" data-a="cinemaPlan">'+I.list+'<span>Dijelovi treninga</span></button>'+
    '<button type="button" class="opt" data-a="cinemaSettings">'+WorkoutView.icon('settings-2')+'<span>Postavke playera</span></button>'+close;
  if(s.kind==='cinemaReserve')return P.steps[s.k]?.kind==='manual' ? workoutResultForm(s.k) : '<h3>Rezerva nakon serije</h3>'+rirRowHtml(s.k,true)+close;
  if(s.kind==='cinemaNotes')return '<h3>Bilješke · '+esc(S.ex[P.items[s.j].exId]?.name||'Vježba')+'</h3><label class="label" for="cinema-note">Kako je išlo?</label><textarea id="cinema-note" class="input" maxlength="2000" rows="5" placeholder="Izvedba, osjećaj, što zapamtiti za sljedeći put…">'+esc(s.text)+'</textarea><button type="button" class="btn" data-a="cinemaNotesSave">Spremi bilješku</button>'+close;
  if(s.kind==='cinemaAudio')return '<h3>Zvuk i vibracija</h3>'+playerSignalSettings()+'<p>Različiti signali označavaju pripremu, početak serije, odmor, promjenu strane i kraj treninga. Kratki signal odbrojava zadnje tri sekunde.</p>'+close;
  if(s.kind==='cinemaPace')return '<h3>Tempo i prijelazi</h3><p class="label">Priprema pri promjeni strane</p>'+playerTimingChoices('switchSec',SIDE_PREP_CHOICES)+
    '<p>Odabrano vrijeme vrijedi od sljedećeg treninga.</p><div class="prow"><span>Između vježbi</span><strong>'+S.settings.transSec+' s</strong></div><button type="button" class="btn" data-a="cinemaSettings">Postavke playera</button>'+close;
  if(s.kind==='cinemaPlan'){
    const parts=CinemaModel.sections(P.items,S.ex);
    return '<h3>Dijelovi treninga</h3>'+P.items.map((it,j)=>(j===0||parts[j]!==parts[j-1]?'<h4>'+esc(parts[j])+'</h4>':'')+'<button type="button" class="opt" data-a="cinemaBlock" data-j="'+j+'"><span><strong>'+esc(S.ex[it.exId]?.name||'Vježba')+'</strong><small>'+esc(doseBase(it))+(it.rest?' · odmor '+it.rest+' s':'')+'</small></span>'+I.next+'</button>').join('')+close;
  }
  return '<h3>Jednostavan player</h3><div class="cinema-guide"><p><strong>Tajmer</strong><br>Dodirni za pauzu ili nastavak. Na nuli player nastavlja sam.</p><p><strong>Kartica vježbe</strong><br>Dodirni za Dnevnik i unos stvarnih ponavljanja i rezerve.</p><p><strong>Vrijeme serije</strong><br>Uredi ga u postavkama serija.</p></div>'+close;
}

/* ---------- after-render hooks ---------- */
function after(t){
  refreshDailyAtMidnight(t);
  const loadDetails=app.querySelector('.tl-analysis-details');
  loadDetails?.addEventListener('toggle',()=>{t.loadDetailsOpen=loadDetails.open;});
  if(t.focus&&!t.focusOpened){
    t.focusOpened=true;
    if(t.focus==='exercises')ProgressView.showDetail('exercises',null);
    if(t.focus==='effort')document.getElementById('analysis-load')?.scrollIntoView({block:'start'});
    if(t.focus==='overview')app.querySelector('.pg-cinema')?.scrollTo(0,0);
  }
  if(t.reopenLoadDay){
    const day=t.reopenLoadDay;
    delete t.reopenLoadDay;
    const trigger=[...app.querySelectorAll('[data-a="trainingLoadDetail"][data-topic="day"]')]
      .find(button=>button.dataset.date===day.date&&button.dataset.endDate===day.endDate);
    if(trigger)TrainingLoadView.showDetail('day',trigger,day);
  }
  if (t.v === 'home') {
    const car = document.getElementById('car'), dots = document.getElementById('dots');
    if (car && dots) car.addEventListener('scroll', () => {
      const w = car.firstElementChild ? car.firstElementChild.getBoundingClientRect().width + 10 : 1;
      const i = Math.round(car.scrollLeft / w);
      dots.querySelectorAll('.dot').forEach((d, k) => d.setAttribute('aria-current', k === i ? 'true' : 'false'));
    }, { passive: true });
  }
  if (t.v === 'ex') {
    // the card you were on comes back (no animation), the dots and S.exTab follow the swipe; a card scrolled inside keeps its place
    const r = document.getElementById('swrow'), dots = document.getElementById('swdots');
    if (r && dots && r.children.length) {
      const k = Math.max(0, EX_CARDS.indexOf(S.exTab));
      if (k) r.scrollLeft = swPos(r, k);
      if (swMem.id !== t.id) swMem = { id: t.id, tops: [] };
      // (review) a card with more below its bottom edge fades out there (.swb.more), so cut-off text reads as "scroll on"
      Array.from(r.querySelectorAll('.swb')).forEach((b, i) => { const more = () => b.classList.toggle('more', b.scrollHeight - b.clientHeight - b.scrollTop > 4);
        if (swMem.tops[i]) b.scrollTop = swMem.tops[i]; more(); b.addEventListener('scroll', () => { swMem.tops[i] = b.scrollTop; more(); }, { passive: true }); });
      const sync = () => { const i = swIdx(r); dots.querySelectorAll('.dot').forEach((d, j) => d.setAttribute('aria-current', j === i ? 'true' : 'false')); S.exTab = EX_CARDS[i]; };
      r.addEventListener('scroll', sync, { passive: true });
    }
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
  cinemaAddExercise:()=>{
    if(cinemaCanEditExercises())cinemaOpenSheet({kind:'cinemaAddExercise',query:'',base:mtCanon(P.items)});
  },
  cinemaExercisePick:d=>{
    const s=S.sheet,e=S.ex[d.id];
    if(s?.kind!=='cinemaAddExercise'||s.item||!e||!cinemaCanEditExercises())return;
    const item=exItem(e),load=StartingLoad.requests([item],startLoadDescription)[0];
    if(!load){cinemaCommitExercises(s,item);return;}
    Object.assign(s,{item,load});render();
  },
  cinemaExerciseBack:()=>{
    const s=S.sheet;
    if(s?.kind!=='cinemaAddExercise')return;
    delete s.item;delete s.load;delete s.kg;delete s.error;
    render();
  },
  cinemaRemoveExercise:d=>{
    const j=Number(d.j);
    if(!cinemaCanEditExercises()||!P.items[j]||P.items.length<=1)return;
    if(cinemaRemoveBlocked(j)){toast('Vježba ima zabilježenu seriju i ostaje u dnevniku.',true);return;}
    cinemaOpenSheet({kind:'cinemaRemoveExercise',j,base:mtCanon(P.items)});
  },
  cinemaExerciseRemove:()=>{
    if(S.sheet?.kind==='cinemaRemoveExercise')cinemaCommitExercises(S.sheet);
  },
  cinemaMain:()=>{
    if(!P||P.done)return;
    cinemaReleaseTransport();
    const st=P.steps[P.i];
    if (cinemaRecordedStep()) {
      P.paused = false;
      P.sheetPause = false;
      enterStep(P.i + 1);
      render();
      return;
    }
    if(P.paused){cinemaPause();return;}
    if(isWork(st)){A.workoutSetDone({j:st.g,set:st.set,step:P.i});return;}
    if(['prep','switch'].includes(st.kind)||st.kind==='rest'&&st.trans){enterStep(P.i+1);render();return;}
    tapRing();
  },
  cinemaTimer:cinemaPause,
  cinemaResume:(_,__,event)=>{
    if(!P?.paused||S.sheet)return;
    cinemaPause();
    if(event.detail===0)document.getElementById('ring')?.focus({preventScroll:true});
  },
  cinemaPauseJump:d=>{if(P?.paused&&!S.sheet&&['-1','1'].includes(d.d))jump(Number(d.d),true);},
  cinemaReplay,
  cinemaPickerOpen: (d, _, event) => {
    if (!P||P.done||!Object.hasOwn(cinemaPickerLimits,d.field)) return;
    const phase=P.steps[P.i],step=cinemaDisplayStep(phase);
    const value=PlayerDose.at(step.it||P.items[step.g],step.set)[d.field];
    cinemaPicker={phase,field:d.field,value};
    render();
    if(event.detail===0)app.querySelector('.cinema-number-wheel')?.focus({preventScroll:true});
  },
  cinemaPickerValue: (d,element,event) => {
    const wheel=element.closest('.cinema-number-wheel');
    if(wheel)cinemaChangeMetric(wheel.dataset.field,Number(d.v),event.detail===0);
  },
  cinemaClose:()=>cinemaCloseSheet(),
  cinemaJournal:()=>cinemaOpenSheet({kind:'cinemaJournal'}),
  cinemaJournalClose:()=>cinemaCloseSheet(),
  cinemaJournalGroup:d=>{if(!P)return;const s=cinemaState();s.all=false;s.group=s.group===Number(d.j)?-1:Number(d.j);render();},
  cinemaMenu:()=>cinemaOpenSheet({kind:'cinemaMenu'}),
  cinemaPlayback:()=>cinemaOpenSheet({kind:'cinemaPlayback',returnCinemaMenu:true}),
  cinemaGuide:()=>cinemaOpenSheet({kind:'cinemaGuide',returnCinemaMenu:S.sheet?.kind==='cinemaMenu'}),
  cinemaPlan:()=>cinemaOpenSheet({kind:'cinemaPlan',returnCinemaMenu:['cinemaMenu','cinemaPlayback'].includes(S.sheet?.kind)}),
  cinemaSettings:()=>cinemaOpenSheet({kind:'settings',returnCinemaMenu:true}),
  cinemaAudio:()=>cinemaOpenSheet({kind:'cinemaAudio',returnCinemaMenu:true}),
  cinemaPace:()=>cinemaOpenSheet({kind:'cinemaPace',returnCinemaMenu:true}),
  cinemaFinish:()=>{if(!P)return;delete P.dosePause;S.sheet=null;finish();},
  cinemaExit:()=>{if(P?.dosePause){const pause=P.dosePause;delete P.dosePause;P.paused=pause.wasPaused;P.left=pause.left;P.endAt=Date.now()+pause.left*1000;}S.sheet=null;A.quitPlay();},
  cinemaBlock:d=>cinemaJump(Number(d.j)),
  cinemaGoSet:d=>cinemaJump(Number(d.j)),
  cinemaReserve: d => {
    const k = Number(d.k);
    if (!P?.doneSteps[k] || !setEnd(P.steps[k]) || failedReserveStep(k)) return;
    const sheet = {kind:'cinemaReserve', k};
    if (P.done) { S.sheet = sheet; render(); }
    else cinemaOpenSheet(sheet);
  },
  cinemaRest:d=>{
    if(!P)return;const before=P,next=CinemaModel.rest(P,Number(d.d),Date.now());if(!next)return;P=next;
    if(!savePlay()){P=before;toast('Promjena odmora nije spremljena.',true);render();return;}
    if(P.left<=0){enterStep(P.i+1);}render();
  },
  cinemaPrep:(_,__,event)=>{
    if(!P?.steps[P.i]||P.done||cinemaRecordedStep()||P.steps[P.i].kind==='work')return;
    cinemaOpenSheet({kind:'cinemaPrep',seconds:0});
    if(event.detail===0)document.getElementById('cinema-prep-range')?.focus({preventScroll:true});
  },
  cinemaPrepPick:d=>cinemaPrepSelect(Number(d.v)),
  cinemaPrepApply:(_,__,event)=>{
    if(S.sheet?.kind!=='cinemaPrep'||!P)return;
    const s=S.sheet,before=P,pause=P.dosePause;
    const base={...P,paused:pause?pause.wasPaused:P.paused,left:pause?pause.left:P.left,endAt:pause?Date.now()+pause.left*1000:P.endAt};
    const next=CinemaModel.prepare(base,s.seconds,Date.now());if(!next){toast('Pripremu dodaj prije početka vremenske serije.',true);return;}
    P=next;delete P.dosePause;
    if(s.seconds)P.stepClock=SessionClock.start(Date.now());
    if(!savePlay()){P=before;toast('Priprema nije spremljena. Pokušaj ponovno.',true);render();return;}
    S.sheet=null;render();
    if(event.detail===0)(app.querySelector('.cinema-prep-trigger')||app.querySelector('[data-a="cinemaMenu"]'))?.focus({preventScroll:true});
  },
  cinemaNotes:d=>{const j=Number(d.j);if(P?.items[j])cinemaOpenSheet({kind:'cinemaNotes',j,text:P.notes?.[j]||''});},
  cinemaNotesSave:()=>{const s=S.sheet;if(s?.kind!=='cinemaNotes'||!P)return;const text=document.getElementById('cinema-note')?.value.slice(0,2000)||'';if(savePlayerChoice(['notes'],()=>{P.notes={...P.notes,[s.j]:text};}))cinemaCloseSheet();},
  cinemaShare:async()=>{
    if(!P)return;const parts=CinemaModel.sections(P.items,S.ex),text=P.title+'\n\n'+P.items.map((it,j)=>(j===0||parts[j]!==parts[j-1]?parts[j]+'\n':'')+(S.ex[it.exId]?.name||'Vježba')+' · '+dose(it)).join('\n');
    try{if(navigator.share){await navigator.share({title:P.title,text});return;}
      const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'})),link=document.createElement('a');link.href=url;link.download='moj-trening-plan.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    }catch(e){if(e.name!=='AbortError')toast('Dijeljenje plana nije uspjelo.',true);}
  },
  workoutProtocolOptions: () => {if(top().v==='pr'){S.sheet={kind:'workoutProtocolOptions',id:top().id};render();}},
  workoutExercise: d => {
    const j=Number(d.j),live=top().v==='play',c=workoutContext({live});if(!c||!Number.isInteger(j)||!c.items[j])return;
    const s={kind:'workoutExercise',j,live,base:mtCanon(live?P.items:c.source)};
    if(live)cinemaOpenSheet(s);else{S.sheet=s;render();}
  },
  workoutClose,
  workoutShowAll: () => {if(!P||P.mode!=='ex'||!S.playerJournal)return;S.playerJournal.all=!S.playerJournal.all;render();if(!S.playerJournal.all)app.querySelector('.workout-journal')?.scrollTo(0,0);},
  workoutPanelBack: () => {if(S.sheet?.kind==='workoutExercise'){delete S.sheet.panel;render();}},
  workoutInfo: d => workoutOpenPanel('instructions',d),
  workoutMuscle: d => {if(S.sheet?.kind==='workoutExercise'&&S.sheet.panel==='instructions'&&window.BODY?.regions[d.v]){S.sheet.muscleRegion=d.v;render();}},
  workoutHistory: d => workoutOpenPanel('history',d),
  workoutTrends: d => workoutOpenPanel('trends',d),
  workoutEdit: () => {
    const s=workoutState(0),c=workoutContext(s);if(!c||(c.program&&!c.live)||!c.items[s.j]||s.pendingReplacement)return;
    S.sheet={kind:c.live?'playDose':'previewDose',j:s.j,draft:clone(c.items[s.j]),base:mtCanon(c.source),returnWorkout:s};render();
  },
  workoutAddSet: d => {
    const s=workoutState(Number(d.j)||0),c=workoutContext(s),item=c?.items[s?.j];
    if(!item||c.program&&!c.live||s.pendingReplacement)return;
    if(!workoutValid(s,c)){toast('Podaci su promijenjeni. Ponovno otvori trening.',true);return;}
    const kind=startLoadDescription(item.exId)?.kind,prepared=c.live?item:{...item,kgList:Array.from({length:item.sets||1},(_,i)=>StartingLoad.missingSet(item,i,kind)?null:PlayerDose.at(item,i+1).kg)};
    const result=PlayerDose.editItem(prepared,{sets:(item.sets||1)+1},c.live?PlayerDose.locks(P,s.j):{allowMissingWeight:true});
    if(!result.ok){toast(result.error,true);return;}
    const items=c.items.slice();items[s.j]=result.item;
    const error=workoutCommitItems(s,items);if(error){toast(error,true);return;}
    render();
    (app.querySelector('.workout-fullscreen')||app).querySelector('.workout-exercise-page [data-a="workoutAddSet"]')?.scrollIntoView({block:'nearest',behavior:stillMotion()?'auto':'smooth'});
  },
  workoutTarget: d => {
    const s=workoutState(Number(d.j)||0),c=workoutContext(s);if(!c||c.live||c.program)return;
    if(!workoutValid(s,c)){toast('Podaci su promijenjeni. Ponovno otvori trening.',true);return;}
    const items=clone(c.items),item=items[s.j],key=item.measure==='time'?'targetSir':'targetRir',value=d.v===''?null:Number(d.v);
    if(value!==null&&(!Number.isInteger(value)||value<0||value>(item.measure==='time'?40:10)))return;
    if(value===null)delete item[key];else item[key]=value;
    top().runDose={...top().runDose,base:mtCanon(c.source),items};render();
  },
  workoutSwap: d => {
    const s=workoutState(Number(d?.j)||0),c=workoutContext(s);if(!workoutCanSwap(c,s?.j))return;
    const item=c.items[s.j];if(!item||!S.ex[item.exId])return;
    s.kind='workoutSwap';s.swap=workoutSwapState(item);delete s.panel;
    if(c.live)cinemaOpenSheet(s);else{S.sheet=s;render();}
  },
  workoutSwapPreview:d=>{
    const s=S.sheet,c=workoutContext(s),swap=s?.swap;
    if(s?.kind!=='workoutSwap'||!swap||!S.ex[d.id]||
        (d.id!==c?.items[s.j]?.exId&&!workoutSwapMatches(swap).some(candidate=>candidate.id===d.id)))return;
    swap.listTop=app.querySelector('.workout-swap-body')?.scrollTop||0;
    swap.filterLeft=app.querySelector('.workout-swap-filters')?.scrollLeft||0;
    swap.preview=d.id;render();
    app.querySelector('.workout-swap-body')?.scrollTo(0,0);
    document.getElementById('sheet-h')?.focus({preventScroll:true});
  },
  workoutSwapBack:()=>{
    const s=S.sheet,swap=s?.swap;
    if(s?.kind!=='workoutSwap'||!swap?.preview)return;
    const id=swap.preview;delete swap.preview;render();
    app.querySelector('.workout-swap-body')?.scrollTo(0,swap.listTop);
    app.querySelector('.workout-swap-filters')?.scrollTo(swap.filterLeft,0);
    [...app.querySelectorAll('[data-a="workoutSwapPreview"]')].find(button=>button.dataset.id===id)?.focus({preventScroll:true});
  },
  workoutUndoSwap:d=>{
    const s=workoutState(Number(d.j)||0),c=workoutContext(s);if(!c||!workoutCanSwap(c,s.j)||s.pendingReplacement)return;
    const original=c.live?P.swapUndo?.[s.j]:c.source[s.j];if(!original||original.exId===c.items[s.j].exId)return;
    const items=clone(c.items);items[s.j]=clone(original);const error=workoutCommitItems(s,items);
    if(error){toast(error,true);return;}delete s.panel;delete s.equipmentMenu;S.sheet=s;render();
  },
  workoutEquipment: d => {
    const s=workoutState(Number(d.j)||0),c=workoutContext(s);if(!c)return;
    s.equipmentMenu=!s.equipmentMenu;
    if(c.live)cinemaOpenSheet(s);else{S.sheet=s;render();}
  },
  workoutEquipmentClose: () => {if(S.sheet?.kind==='workoutExercise'){delete S.sheet.equipmentMenu;render();}},
  workoutQuickCandidate: d => {if(S.sheet?.kind==='workoutExercise')workoutQuickReplace(S.sheet,d.id,true);},
  workoutCandidate: d => {
    const s=S.sheet;if(s?.kind!=='workoutSwap'||!s.swap||!workoutSwapMatches(s.swap).some(candidate=>candidate.id===d.id))return;
    workoutQuickReplace(s,d.id);
  },
  workoutCancelPending: () => {if(S.sheet?.kind==='workoutExercise'){delete S.sheet.pendingReplacement;delete S.sheet.error;S.workoutRaw={};render();}},
  workoutStart: () => {if(top().v==='pr')A.startPr({id:top().id});},
  workoutRedoSet: d => {
    if (top().v !== 'play' || P?.mode !== 'ex' || S.sheet?.pendingReplacement) return;
    const group = Number(d.j), set = Number(d.set);
    const matches = step => isWork(step) && step.g === group && step.set === set;
    const first = P.steps.findIndex(matches);
    if (first < 0 || !P.steps.some((step, index) => matches(step) && P.doneSteps[index])) return;

    const previous = P;
    P = {...P, steps:P.steps.slice(), doneSteps:{...P.doneSteps}, rir:{...P.rir}, paused:false, sheetPause:false};
    delete P.dosePause;
    P.steps.forEach((step, index) => {
      if (!matches(step)) return;
      delete P.doneSteps[index];
      delete P.rir[index];
      if (step.actualReps !== undefined || step.actualSec !== undefined) {
        P.steps[index] = {...step};
        delete P.steps[index].actualReps;
        delete P.steps[index].actualSec;
      }
    });
    // Never let an earlier review answer credit a set that is now open again.
    if (previous.answers) {
      P.answers = Object.fromEntries(Object.entries(previous.answers).filter(([index, answer]) =>
        Number(index) !== group && (!previous.done || answer !== previous.auto?.[index])));
    }
    if (previous.lastReps) {
      P.lastReps = {...P.lastReps};
      delete P.lastReps[group];
    }
    if (previous.done) {
      delete P.auto;
      delete P.musclePlan;
      delete P.originalMusclePlan;
      P.done = false;
      P.quit = false;
      P.finishedAt = 0;
      P.secs = 0;
    }
    const step = positionStep(landAt(first));
    if (!savePlay()) {
      P = previous;
      toast('Ponavljanje serije nije spremljeno. Pokušaj ponovno.', true);
      return;
    }
    const rawPrefix = 'live:'+P.startedAt+':'+group+':'+set+':';
    Object.keys(S.workoutRaw || {}).filter(key => key.startsWith(rawPrefix)).forEach(key => delete S.workoutRaw[key]);
    S.sheet = null;
    ensureAudio();
    signalStep(step);
    if (previous.done) {
      keepAwake(true);
      clearInterval(ticker);
      ticker = setInterval(tick, 200);
    }
    render();
  },
  workoutSetDone: d => {
    if(!P||P.done||P.mode!=='ex')return;
    const step=P.steps[P.i],j=Number(d.j),set=Number(d.set);
    if(!isWork(step)||step.g!==j||step.set!==set||P.i!==Number(d.step)||P.doneSteps[P.i])return;
    const elapsed=step.kind==='work'&&Number.isFinite(step.dur)?Math.round(Math.max(0,step.dur-remaining())):undefined;
    advanceWorkout({nextIndex:P.i+1,automatic:!!d.automatic,actualSec:elapsed===step.dur?undefined:elapsed});
  },
  trainingLoadOpen: () => go({v:'analytics',focus:'effort'}),
  todayOpen: () => go({v:'today'}),
  morningOpen: (d={}) => {
    const date=MonthPlan.valid(d.date)?d.date:dateKey(Date.now());
    if (date>dateKey(Date.now())) return;
    go({v:'morning',date,original:S.settings.morningChecks?.[date] || null});
  },
  morningSave: () => {
    const form=document.getElementById('morning-form');
    if (!form || top().v!=='morning') return;
    const result=TodayView.readForm(form,top().date);
    if (result.error) {morningError(result.error); return;}
    writeMorning(result.entry);
  },
  morningDeleteAsk: () => {
    const box=document.getElementById('morning-confirm');
    if (box) {box.hidden=false;box.querySelector('button')?.focus();}
  },
  morningDeleteCancel: () => {const box=document.getElementById('morning-confirm');if(box)box.hidden=true;},
  morningDeleteConfirm: () => {
    const box=document.getElementById('morning-confirm');
    if (top().original && box && !box.hidden) writeMorning(null);
  },
  todayEvidence: d => {
    if (d.type==='history' && historyRecord(d.id)) A.historyOpen({id:d.id});
    else if (d.type==='checkin') A.morningOpen(d);
    else if (['match','plan'].includes(d.type) && MonthPlan.valid(d.date)) A.monthOpen({date:d.date});
    else if (d.type==='protocol' && S.pr[d.id]) A.openPr({id:d.id});
    else if (d.type==='field' && S.field[d.id]) A.openField({id:d.id});
  },
  todayAct: () => {
    if (top().v!=='today' || P) return;
    if (pendingExt && !appBusy()) takeOtherCopy();
    const vm=dailyInput(Date.now()), rec=vm.recommendation, action=rec.action || {};
    if (top().proposalKey!==mtCanon([vm.date,rec])) {render();toast('Prijedlog se promijenio. Pregledaj najnovije podatke.');return;}
    if (action.type==='checkin') {A.morningOpen();return;}
    if (action.type==='team') {A.teamNew({date:vm.date});return;}
    if (action.type==='calendar') {A.monthOpen({date:action.date || vm.date});return;}
    if (action.type==='history') {if(historyRecord(action.id))A.historyOpen({id:action.id});else A.historyList();return;}
    if (action.type==='field' && S.field[action.id]) {A.openField({id:action.id});return;}
    if (action.type!=='protocol') return;
    const protocol=S.pr[action.id];
    if (!protocol || !protocol.items?.length) return;
    const items=protocol.program || !rec.items?.length ? protocol.items : rec.items;
    // A pain-adjusted dose may put a gentler exercise into the same slot (painSwapOf names the original).
    if (items.length!==protocol.items.length || items.some((it,i)=>(it.exId!==protocol.items[i].exId && it.painSwapOf!==protocol.items[i].exId) || !S.ex[it.exId])) {
      render();toast('Sadržaj protokola se promijenio. Ponovno otvori prijedlog.');return;
    }
    startPlayer({mode:'ex',title:protocol.name,items,originalItems:protocol.items,ref:{kind:'protocol',id:protocol.id}});
  },
  historyList: () => go({ v:'history', page:1 }),
  teamNew: (d={}) => {
    if (S.dbState !== 'ready') { toast('Pričekaj da se tvoji podaci učitaju.'); return; }
    go({ v:'teamEntry', date:MonthPlan.valid(d.date)?d.date:dateKey(Date.now()), type:d.type==='match'?'match':'training', historyId:uid('h') });
  },
  teamCancel: () => { if (top().v === 'teamEntry') A.back(); },
  teamSave: () => {
    const t=top(), form=document.getElementById('team-entry-form');
    if (t.v !== 'teamEntry' || !form || t.saving) return;
    const fields=TeamDiary.readNew(form);
    if (!fields.ok) { teamError(fields.error); return; }
    const result=TeamDiary.create(fields.values,{historyId:t.historyId,now:Date.now()});
    if (!result.ok) { teamError(result.errors.map(e=>e.message).join(' ')); return; }
    let raw;
    try { raw=localStorage.getItem(STORE_KEY); }
    catch(e) { teamError('Ne mogu pristupiti pohrani. Zapis nije spremljen.'); return; }
    if (!raw && savedJson || raw && raw !== savedJson && !mergeOtherCopy(raw)) { teamError('Pohrana se u međuvremenu promijenila. Ponovno otvori aplikaciju.'); return; }
    if (raw && raw !== savedJson) { savedJson=raw; pendingExt=null; }
    const before=S.log;
    if (before.some(l=>l.historyId===result.entry.historyId)) { teamError('Ovaj zapis je već spremljen. Otvori ga iz povijesti.'); return; }
    const cutoff=before.length>=LOG_MAX?before.slice().sort((a,b)=>b.at-a.at)[LOG_MAX-1]:null;
    if (cutoff && result.entry.at<=cutoff.at) { teamError('Povijest čuva najnovijih '+LOG_MAX+' zapisa. Ovaj datum je stariji ili jednak najstarijem zadržanom zapisu, pa unos nije spremljen. Tvoj obrazac je ostao otvoren.'); return; }
    t.saving=true; S.log=[result.entry,...before].sort((a,b)=>b.at-a.at);
    const cut=trimLog();
    if (!persist()) { S.log=before; t.saving=false; teamError('Zapis nije spremljen. Tvoj unos je sačuvan u obrascu; pokušaj ponovno.'); return; }
    S.stack.pop(); go({v:'historyDetail',id:result.entry.historyId}); toast(cut || 'Zapis je spremljen u povijesti.');
  },
  historyOpen: d => go({ v:'historyDetail', id:d.id }),
  historyPage: d => { const t = top(); t.page = Number(d.page) || 1; render(); app.querySelector('.history')?.scrollTo(0,0); },
  historyEdit: () => {
    const row = historyRecord(top().id);
    if (row) go({ v:'historyEdit', id:row.historyId, original:clone(row) });
  },
  historyCancelEdit: () => A.back(),
  historySave: () => {
    const original = top().original, form = document.getElementById('history-edit-form');
    if (!original || !form) return;
    const fields = TrainingHistory.readEdit(form, original);
    if (!fields.ok) { historyError(fields.error); return; }
    if (!Object.keys(fields.patch).length) { back(); return; }
    const result = HistoryModel.edit(original, fields.patch);
    if (!result.ok) { historyError(result.errors.map(e => e.message).join(' ')); return; }
    if (mtCanon(original) === mtCanon(result.entry)) { back(); return; }
    if (changeHistory(original,{ ...result.entry, editedAt:Date.now() })) { back(); toast('Izmjene treninga su spremljene.'); }
  },
  historyDeleteAsk: () => {
    const row = historyRecord(top().id);
    if (!row) return;
    top().original = clone(row); render();
  },
  historyDeleteCancel: () => { delete top().original; render(); },
  historyDeleteConfirm: () => {
    const original = top().original;
    if (!original) return;
    if (changeHistory(original,null)) { back(); toast('Trening je obrisan iz povijesti.'); }
  },
  dashboardForecast: () => { const t = top(); t.forecast = !t.forecast; render(); },
  dashboardJoint: d => {const region=d.id||d.v;if(window.BODY?.regions[region]?.kind==='joint'){S.sheet={kind:'bodyRegion',region};render();}},
  dashboardGroup: d => {
    if (!MuscleWork.groups.some(g => g.id === d.id)) return;
    top().selectedGroup = d.id;
    render();
    document.getElementById('db-group-title')?.scrollIntoView({ block:'nearest' });
  },
  dashboardCalendar: d => A.monthOpen(d),
  dashboardProtocols: () => go({ v:'protocols' }),
  dashboardProgress: () => go({v:'progress',focus:'overview'}),
  dashboardAnalytics: () => go({v:'muscleWeek'}),
  analyticsOpen: d => {
    if(d.section==='load'){A.trainingLoadOpen();return;}
    if(d.section==='muscles'){go({v:'muscleWeek'});return;}
    if(['progress','trends'].includes(d.section))go({v:'progress',focus:d.section==='trends'?'exercises':'overview'});
  },
  progressMetric:d=>{if(!['performance','volume'].includes(d.v))return;ProgressView.closeInfo();top().chartMetric=d.v;render();},
  progressExercise:d=>{
    if(!top().chartCandidates?.includes(d.id))return;
    ProgressView.closeInfo();top().chartExerciseId=d.id;render();
  },
  progressPin:d=>{
    if(!top().chartCandidates?.includes(d.id))return;
    const pins=S.settings.progressPinnedIds.filter(id=>top().chartCandidates.includes(id));
    const pinned=pins.includes(d.id);
    if(!pinned&&pins.length>=3)return;
    if(!writeSetting('progressPinnedIds',pinned?pins.filter(id=>id!==d.id):[...pins,d.id]))return;
    top().chartExerciseId=d.id;
    render();
  },
  progressRange:d=>{
    if (!TrainingLoad.periods.includes(d.v) || S.settings.analysisPeriod === d.v) return;
    // the flag first: a 7-day choice saved without it would read back as the 3-month default
    if ((S.settings.analysisPeriodChosen === true || writeSetting('analysisPeriodChosen',true)) && writeSetting('analysisPeriod',d.v)) render();
  },
  progressDetail:(d,el)=>ProgressView.showDetail(d.topic,el,d),
  trainingLoadDetail:(d,el)=>TrainingLoadView.showDetail(d.topic,el,d),
  trainingLoadWorkout:d=>{
    if(!historyRecord(d.id))return;
    top().reopenLoadDay={date:d.date,endDate:d.endDate};
    TrainingLoadView.closeInfo();
    A.historyOpen(d);
  },
  muscleEligibility: d => {
    if (!S.draft || !['auto','true','false'].includes(d.v)) return;
    if (d.v === 'auto') delete S.draft.muscleWorkEligible;
    else S.draft.muscleWorkEligible = d.v === 'true';
    render();
  },
  tab: d => setTab(d.tab),
  back: () => {
    S.planAsk = false;   // the plan's restart question closes when you leave or come back to the field list
    captureEditForm();
    if (unsavedChanges()) { S.sheet = { kind:'leave' }; render(); return; }
    dropDraftMedia();
    if (S.below && top().v === 'exEdit') { S.draft = S.below.draft; S.draftSig = S.below.sig; S.below = null; back(); return; }
    S.draft = null; S.draftSig = null; S.below = null; S.pick = null; back();
  },
  leaveSave: () => { S.sheet = null; render(); const saveAction={build:'savePr',exEdit:'saveEx',teamEntry:'teamSave',historyEdit:'historySave',morning:'morningSave'}[top().v]; if(saveAction)A[saveAction]({}); },
  leaveDiscard: () => { S.sheet = null; if (S.draft) S.draftSig = draftSig(S.draft); if(EDIT_FORMS[top().v]) {top()._formBase=formValues(document.getElementById(EDIT_FORMS[top().v]));top()._formValues=top()._formBase;} A.back(); },
  dot: d => { const car = document.getElementById('car'); const c = car && car.children[+d.i]; if (c) c.scrollIntoView({ behavior:'smooth', inline:'center', block:'nearest' }); },
  libCat: d => { S.lib.cat = d.cat; lsSet('mt.libcat', d.cat); if (top().v !== 'library') { S.tab = 'library'; S.stack = [{v:'library'}]; } render(); },
  fieldList: () => { S.planAsk = false; go({ v:'fieldList' }); },   // the inline restart question never waits for a later visit
  fieldMode: d => { if (top().v !== 'fieldList' || !['catalogue','plan'].includes(d.mode)) return;
    S.planAsk = false; top().fieldMode = d.mode; render(); const v = app.querySelector('.view'); if (v) v.scrollTop = 0; },
  fieldCategory: d => { if (top().v !== 'fieldList' || d.cat !== 'all' && !FIELD_CATEGORIES.some(c => c.key === d.cat)) return;
    S.planAsk = false; top().fieldCat = d.cat; top().fieldMode = 'catalogue'; render(); const v = app.querySelector('.view'); if (v) v.scrollTop = 0; },
  openField: d => go({ v:'field', id:d.id }),
  planAsk: () => { S.planAsk = true; render(); },
  planKeep: () => { S.planAsk = false; render(); },
  planReset: () => { if (!writeSetting('preFrom',Date.now())) return; S.planAsk = false; render(); toast('Plan opet kreće od 1. tjedna.'); },
  masSave: () => { const m = Math.round(+S.masDraft || 0); if (!masOk(m)) { toast('Upiši metre u 5 minuta, od 600 do 2400 m.', true); return; }
    const e = masEntry(m); S.log.unshift(e); if (!persist()) { S.log.splice(S.log.indexOf(e), 1); return; } S.masDraft = 0; render(); toast('Spremljeno: MAS ' + masTxt(e.value) + ' m/s.'); },
  openPr: d => go({ v:'pr', id:d.id }),
  openProg: d => go({ v:'program', id:d.id }),
  openEx: d => go({ v:'ex', id:d.id, dose:0 }),
  dose: d => { top().dose = +d.i; delete top().runDose; S.exTab='dose'; render(); },
  // the tab row stays where it was on the screen (a row above the top comes back to 12 px under it): a shorter tab gets a panel
  // tall enough for that, so the page never bottoms out and drops the row under the finger; the next render lets it go
  exTab: d => { S.exTab = exTabOf(d.v); const v = app.querySelector('.view'), tl = v && v.querySelector('.extabs');
    const y = tl ? tl.getBoundingClientRect().top - v.getBoundingClientRect().top : 0; render();
    const v2 = app.querySelector('.view'), t2 = v2 && v2.querySelector('.extabs'), pn = v2 && v2.querySelector('#expanel'); if (!tl || !t2 || !pn) return;
    const want = Math.max(0, Math.round(t2.getBoundingClientRect().top - v2.getBoundingClientRect().top + v2.scrollTop - (y < 0 ? 12 : y))), short = want - (v2.scrollHeight - v2.clientHeight);
    if (short > 0) pn.style.minHeight = (parseFloat(getComputedStyle(pn).height) + short) + 'px';
    v2.scrollTop = want; },
  credit: d => { if (!SHOW_SOURCES) return; S.sheet = { kind:'credit', id: d.id }; render(); },
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
    const body = { name, alt: (d.alt||'').trim(), cat:d.cat, phase: (d.cat === 'Rehab' || d.cat === 'Mobilnost') && d.phase ? d.phase : null, cord: d.cord || '', zones: d.zones||[], muscles: d.muscles && (d.muscles.prime || d.muscles.sec) ? { prime: (d.muscles.prime || []).slice(), sec: (d.muscles.sec || []).slice() } : null, equip: (d.equip||[]).slice(), measure: d.measure, sec: d.sec, sets: d.sets, reps: d.reps, rest: d.rest, kg: d.kg||0, sides: !!d.sides,
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
    if (body.muscles == null && (!prev || prev.muscles === undefined)) delete body.muscles;   // 1.8: no muscles = drawn from the zones
    if (body.videoTitle === undefined) delete body.videoTitle;
    if (typeof d.muscleWorkEligible === 'boolean') body.muscleWorkEligible = d.muscleWorkEligible;
    else delete body.muscleWorkEligible;
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
  importWorkout: () => { S.sheet = { kind:'importWorkout' }; render(); },
  pickWorkoutFile: () => { document.getElementById('importWorkoutFile')?.click(); },
  openPreparedWorkout: () => previewWorkoutImport(async () => {
    try {
      const response = await fetch(PREPARED_WORKOUT);
      if (response.ok) return await response.json();
    } catch (_) {}
    throw new Error('Trening se nije mogao učitati. Pokušaj ponovno.');
  }),
  editPr: d => { const p = S.pr[d.id]; if (!p) return; S.draft = Object.assign(clone(p), { _open: null }); S.draft.items = S.draft.items || []; S.draft.items.forEach(it => { it._d0 = doseSig(it); }); S.draftSig = draftSig(S.draft); go({ v:'build', id: S.draft.id }); },
  builderSectionApply: d => { const name=String(S.draft?._sectionName||'').trim();if(!name){toast('Upiši naziv dijela.');document.getElementById('builder-section-name')?.focus();return;}if(builderSetSection(+d.i,name.slice(0,80)))render(); },
  itOpen: d => { builderCommitSection(); const i = +d.i; S.draft._open = S.draft._open === i ? null : i; render(); },
  iset: d => { const it = S.draft.items[S.draft._open]; it[d.k] = d.v; render(); },
  istep: d => {
    const items = S.draft.items, it = items[+d.i], k = d.k, dir = +d.d; if (!it) return;
    if (k === 'kg') { builderWeight(it,kgStep(S.ex[it.exId],it.kg,dir),true);render();return; }
    const step = { sec:5, sets:1, reps:1, rest:15 }[k]; const min = { sec:5, sets:1, reps:1, rest:0 }[k]; const max = { sec:600, sets:10, reps:60, rest:300 }[k];
    const before = +it[k] || (k === 'sets' ? 1 : 0);
    it[k] = Math.min(max, Math.max(min, Math.round(((+it[k]||0) + dir*step) * 100) / 100));
    if (k === 'sec' && it[k]!==before) delete it.secList;
    if (k === 'reps') { delete it.r0; delete it.r1; if (Array.isArray(it.repsList)) it.repsList = it.repsList.map(r => Math.min(60, Math.max(1, r + dir))); }
    if (k === 'sets') {
      // a superset shares its rounds only while all its exercises have the same number of sets (Hip thrust 3 + Nordic 2 stay apart)
      if (it.ss && it.sets !== before && items.every(x => x === it || x.ss !== it.ss || (x.sets || 1) === before)) items.forEach(x => { if (x.ss === it.ss) x.sets = it.sets; });
      items.forEach(x => { if (x === it || (it.ss && x.ss === it.ss)) fitSetLists(x); });
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
    builderCommitSection();
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
  idel: d => { builderCommitSection(); dropItems(S.draft.items, (it, k) => k === +d.i); S.draft._open = null; render(); },
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
    builderCommitSection();
    if (!name) { toast('Upiši naziv protokola.'); const el = document.getElementById('p-name'); if (el) el.focus(); return; }
    if (!dr.items.length) { toast('Dodaj barem jednu vježbu.'); return; }
    if (dr._fromWorkoutFile) {
      try {
        const current = localStorage.getItem(STORE_KEY);
        if (!current || (current !== savedJson && !mergeOtherCopy(current))) throw new Error('Storage changed');
        savedJson = current;
        pendingExt = null;
      } catch (_) {
        toast('Podatke nije moguće učitati. Ponovno otvori aplikaciju prije spremanja treninga.', true);
        return;
      }
      if (dr.items.some(item => !Object.hasOwn(S.ex, item.exId))) {
        toast('Vježba više nije u knjižnici. Zamijeni je prije spremanja.', true);
        return;
      }
    }
    const invalidTimer=dr.items.findIndex(it=>it.measure!=='time'&&String(it.repSetSec??'').trim()!==''&&repSetSeconds(it)===null);
    if(invalidTimer>=0){
      dr._open=invalidTimer;render();
      toast('Vrijeme serije mora biti cijeli broj od 1 do 3.600 sekundi.',true);
      app.querySelector('[data-rep-set-sec="'+invalidTimer+'"]')?.focus();
      return;
    }
    const isNew = !S.pr[dr.id];
    const keepIf = (o, it, ks) => { ks.forEach(k => { if (it[k] != null && it[k] !== '') o[k] = it[k]; }); return o; };
    // a new protocol (also a copy) and every dose you changed by hand start counting "sessions in a row" from zero
    const fresh = (o, it) => { if (isNew || it._d0 !== doseSig(it)) PROG_STATE.forEach(k => { delete o[k]; }); return o; };
    const body = { name, desc: (dr.desc||'').trim(), items: normGroups(dr.items).map(it => fresh(keepIf({ exId: it.exId, measure: it.measure, sec: it.sec, sets: it.sets, reps: it.reps, rest: it.rest, sides: !!it.sides, kg: it.kg||0,
      ...(it.measure!=='time'&&repSetSeconds(it)!==null?{repSetSec:repSetSeconds(it)}:{}) }, it, ['ss','easy','up','r0','r1','cap','section','note','repsList','kgList','secList','startingKgKnown','targetRir','targetSir','repSec','ok','fail','prev','snoozeOk']), it)), updatedAt: Date.now(), home: dr.home || null, tag: dr.tag || null, days: dr.days || [] };
    ['program','week','slot','pack','goal','goalSkip','kgSkip'].forEach(k => { if (dr[k] != null) body[k] = dr[k]; });
    if (body.program) delete body.days;   // a programme session is planned by the programme's days
    const ok = await save('protocols', dr.id, body); if (!ok) return;
    S.pr[dr.id] = Object.assign({ id: dr.id }, body); planSaved();
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
  startPr: d => {
    const p=S.pr[d.id]; if (!p?.items?.length) return;
    const t=top(), scoped=t.v==='pr'&&t.id===p.id&&!p.program, run=scoped&&t.runDose?.base===mtCanon(p.items)?t.runDose:null, items=run?run.items:p.items;
    startPlayer({mode:'ex',title:p.name,items,originalItems:p.items,sessionOnly:!!run?.sessionOnly || items.some((it,j)=>it.exId!==p.items[j]?.exId),ref:{kind:'protocol',id:p.id}});
  },
  playEx: d => {
    const e=S.ex[d.id], t=top(); if (!e || t.v!=='ex' || t.id!==e.id) return;
    const originalItems=viewDoseSource(t);
    startPlayer({mode:'ex',title:e.name,items:viewDoseItems(t,originalItems),originalItems,sessionOnly:t.runDose?.base===mtCanon(originalItems)&&!!t.runDose.sessionOnly,ref:{kind:'exercise',id:e.id}});
  },
  // dose 'season': about 2/3 of the sets (fieldDose), the steps built the same way
  startField: d => { const f = S.field[d.id]; if (!f) return; const sz = d.dose === 'season' && fieldLoad(f).type !== 'test';
    startPlayer({ mode:'field', title: f.name_hr, f, dose: sz ? 'season' : 'full', steps: stepsFromField(sz ? fieldDose(f) : f), ref: { kind:'field', id: f.id } }); },
  exerciseLoad: d => { if (S.ex[d.id]) go({v:'exerciseLoad',id:d.id}); },
  checklistDone: d => {
    if (!P || top().v!=='play' || S.sheet || P.done || P.paused) return;
    A.workoutSetDone(d);
  },
  previewDoseEdit: d => {
    const t=top(), j=Number(d.j);
    if (!['ex','pr'].includes(t.v) || (t.v==='pr' && S.pr[t.id]?.program)) return;
    const source=viewDoseSource(t), item=viewDoseItems(t,source)[j]; if (!item) return;
    S.sheet={kind:'previewDose',j,draft:clone(item),base:mtCanon(source)};render();
  },
  playDoseCard: d => {
    if (!P || P.mode !== 'ex' || P.done || ![0,1,2].includes(+d.i)) return;
    P.cardIndex=+d.i;
    const row=document.getElementById('play-card-row');
    if (row) row.classList.toggle('show-sets',P.cardIndex===2);
    if (row) row.scrollTo({left:row.children[P.cardIndex].offsetLeft-row.children[0].offsetLeft,behavior:stillMotion()?'auto':'smooth'});
    syncPlayTabs(P.cardIndex);
    app.querySelectorAll('.play-card-dots button').forEach((b,i)=>b.setAttribute('aria-current',String(i===P.cardIndex)));
    savePlay();
  },
  playDoseEdit: d => {
    if (!P || P.mode !== 'ex' || P.done || !P.items[+d.j]) return;
    if (!S.sheet) openPlayDoseSheet({kind:'playDose',j:+d.j,draft:clone(P.items[+d.j])});
    else if(S.sheet.kind==='cinemaJournal'){S.sheet={kind:'playDose',j:+d.j,draft:clone(P.items[+d.j]),returnWorkout:{kind:'cinemaJournal'}};render();}
  },
  playDoseHelp: () => {
    if (!S.sheet && P?.mode==='ex' && !P.done && top().v==='play') openPlayDoseSheet({kind:'playDoseHelp'});
  },
  playDoseResize: () => {
    const s=S.sheet, form=document.getElementById('play-dose-form');
    if (!form || !s || (s.kind!=='previewDose' && !(s.kind==='playDose' && P))) return;
    const parsed=playDoseReadForm(s,form), guard=s.kind==='previewDose'?{allowMissingWeight:true}:PlayerDose.locks(P,s.j);
    const result=parsed.ok?PlayerDose.editItem(s.draft,parsed.patch,guard):parsed;
    if (!result.ok) s.error=result.error; else {s.draft=result.item;delete s.error;delete s.rawForm;}
    render();
  },
  playDoseApply: () => {
    const s=S.sheet, form=document.getElementById('play-dose-form');
    if (!form || !s || (s.kind!=='previewDose' && !(s.kind==='playDose' && P))) return;
    const parsed=playDoseReadForm(s,form), guard=s.kind==='previewDose'?{allowMissingWeight:true}:PlayerDose.locks(P,s.j);
    const result=parsed.ok?PlayerDose.editItem(s.draft,parsed.patch,guard):parsed;
    if (!result.ok) {s.error=result.error;render();return;}
    if (s.kind==='previewDose') {
      const t=top(), source=viewDoseSource(t);
      if (mtCanon(source)!==s.base || viewDoseItems(t,source)[s.j]?.exId!==result.item.exId) {
        s.error='Izvorna doza se promijenila. Zatvori uređivanje i ponovno otvori serije.';render();return;
      }
      const items=viewDoseItems(t,source).slice();items[s.j]=result.item;
      t.runDose={...t.runDose,base:s.base,items};S.sheet=s.returnWorkout||null;render();return;
    }
    const before=P, items=P.items.slice(); items[s.j]=result.item;
    P={...P,...PlayerDose.rebuild(P,items,liveStepsFromItems)};
    if (!savePlay()) {P=before;s.error='Promjena nije spremljena na uređaj. Oslobodi prostor i pokušaj ponovno.';render();return;}
    if(s.returnWorkout){s.returnWorkout.base=mtCanon(P.items);S.sheet=s.returnWorkout;render();}else playDoseResumeEditing();toast('Doziranje je promijenjeno za ovaj trening.');
  },
  playDoseCancel: () => {if(S.sheet?.returnWorkout){S.sheet=S.sheet.returnWorkout;render();}else if(S.sheet?.kind==='previewDose'){S.sheet=null;render();}else playDoseResumeEditing();},
  ring: () => tapRing(),
  jump: d => {cinemaReleaseTransport();jump(+d.d);},
  jumpTo: d => { S.sheet = null; ensureAudio(); enterStep(landAt(+d.k)); P.paused = false; savePlay(); render(); },
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
    let body, snapshot;
    try { snapshot = freshBackupObject(); body = JSON.stringify(snapshot, null, 1); }
    catch(e){ toast(EXPORT_MSG.failed, true); return; }
    const r = await shareOrDownload('moj-trening-kopija-' + fileDate(Date.now()) + '.json', body);
    if (r === 'shared' || r === 'downloaded') { lsSet('mt.lastBackupAt', Date.parse(snapshot.exportedAt)); try { localStorage.removeItem('mt.backupLater'); } catch(e){} }
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
    if (s.undo) S.settings = Object.assign({}, SETTINGS_BASE, cleanSettings(s.settings));
    else S.settings = Object.assign({}, S.settings, {planDates:{}, morningChecks:{}}, d.settings || {});
    let previousSettings, settingsSaved = false;
    try {
      previousSettings = localStorage.getItem('mt.settings');
      localStorage.setItem('mt.settings',JSON.stringify(S.settings)); settingsSaved = true;
    } catch(e) {}
    if (!settingsSaved || !persist()) {
      if (settingsSaved) try {
        if (previousSettings === null) localStorage.removeItem('mt.settings'); else localStorage.setItem('mt.settings',previousSettings);
      } catch(e) {}
      try { const o = cleanData(JSON.parse(before.data)); applyData(o); S._deleted = o._deleted; } catch(e){}
      S.settings = settings0; S.saveFailed = false; S.sheet = null; render();
      toast('Podaci nisu zamijenjeni: memorija aplikacije je puna. Na mobitelu je sve ostalo kao prije.', true); return;
    }
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
  setSetting: d => { if (!writeSetting(d.k,+d.v)) return; render(); },
  toggleSound: () => {
    if (!writeSetting('sound',!S.settings.sound)) return;
    audioMode(!!P && !P.done); ensureAudio(); render();
  },
  toggleVibration: () => {
    if (!vibrationAvailable() || !writeSetting('vibration',!S.settings.vibration)) return;
    if (!S.settings.vibration) buzz(0);
    render();
  },
  previewPlayerSignal: () => { ensureAudio(); workoutSignal('work'); },
  toggleSilent: () => { if (!writeSetting('silentOk',S.settings.silentOk !== true)) return; if (P && !P.done) { audioMode(true); ensureAudio(); } render(); },
  // the arrow asks first (an in-page sheet: confirm() does not work in every view); a timed step waits meanwhile
  quitPlay: () => { if (!P || P.done) return; if (!P.paused) { P.left = remaining(); P.paused = true; P.sheetPause = true; } savePlay(); S.sheet = { kind:'quit' }; render(); },
  quitResume: () => { S.sheet = null; if (P && P.sheetPause && P.paused) { P.paused = false; P.endAt = Date.now() + P.left * 1000; } if (P) {P.sheetPause = false;savePlay();} render(); },
  quitSave: () => saveSoFar(),
  quitDiscard: () => { S.sheet = null; clearPlay(); leavePlay(); },
  resumeGo: () => { const s = S.sheet && S.sheet.s; S.sheet = null; if (!s || !restorePlay(s)) { clearPlay(); render(); } },
  resumeSave: () => { const s = S.sheet && S.sheet.s; S.sheet = null; if (!s || !restorePlay(s)) { clearPlay(); render(); return; } saveSoFar(); },
  resumeDrop: () => { S.sheet = null; clearPlay(); render(); },
  // "Spremi i ponovi": the finished session is saved first, then the same session starts again (rebuilt, so new settings apply)
  restartPlay: () => {
    const ref = P.ref, cfg = { mode:P.mode, title:P.title, items:P.items, f:P.f, dose:P.mode==='field'?(P.dose==='season'?'season':'full'):undefined, ref };
    const saved = anyCredit(), r = saved ? logSession() : { news: [], cut: '', saved: true };
    // Keep the finished player in memory too if storage rejected its checkpoint.
    if (!r.saved) { render(); return; }
    const p = ref && ref.kind === 'protocol' && S.pr[ref.id], f = ref && ref.kind === 'field' && S.field[ref.id];
    if (p && (p.items || []).length) { cfg.items = p.items; cfg.title = p.name; }
    if (f) { cfg.f = f; cfg.title = f.name_hr; }
    cfg.steps = cfg.mode === 'field' ? stepsFromField(cfg.dose==='season'?fieldDose(cfg.f):cfg.f) : stepsFromItems(cfg.items);
    P = null; S.stack.pop(); if(!startPlayer(cfg,true))return;
    toast(r.cut || (r.news.length ? newsMsg(r.news) : saved ? 'Trening je spremljen. Krećeš ispočetka.' : 'Krećeš ispočetka.'));
  },
  finishPlay: () => {
    if (!anyCredit()) { clearPlay(); leavePlay(); return; }   // nothing done: nothing to save
    const r = logSession();
    if (!r.saved) { render(); return; }
    leavePlay();
    if (r.cut) toast(r.cut); else if (r.news.length) toast(newsMsg(r.news));
  },
  // "Koliko si još mogao?": a tap stores the reserve of that set, the same tap again takes it back
  rir: d => { const k = +d.k, st = P && P.steps[k]; if (!st || !st.it || !P.doneSteps[k] || !setEnd(st) || failedReserveStep(k)) return; const taps = st.it.measure === 'time' ? LM.SIR_TAPS : LM.RIR_TAPS, v = taps[+d.v]; if (v == null) return;
    savePlayerChoice(['rir'],()=>{P.rir = P.rir || {}; if (P.rir[k] === v) delete P.rir[k]; else P.rir[k] = v;});
    const w = app.querySelector('.view'), y = w ? w.scrollTop : 0; render(); const w2 = app.querySelector('.view'); if (w2) w2.scrollTop = y; },
  lrep: d => { const j = +d.j; if (!P || !P.done || !P.items[j]) return;
    const step = lastAttemptStep(j), planned = PlayerDose.at(step?.it || P.items[j], step?.set).reps;
    const max = Math.max(planned, step?.actualReps || 0);
    savePlayerChoice(['lastReps'],()=>{P.lastReps = P.lastReps || {}; P.lastReps[j] = Math.max(0, Math.min(max, lastRepsOf(j) + (+d.d)));});
    const v = app.querySelector('.view'); const st = v ? v.scrollTop : 0; render(); const v2 = app.querySelector('.view'); if (v2) v2.scrollTop = st; },
  progTab:d=>{
    if(d.v==='doziranje'&&!top().dosing)go({v:'progress',id:'dosing',dosing:true});
    if(d.v==='pregled'&&top().dosing)back();
  },
  progressInfo: (d,el) => ProgressView.showInfo(d.topic,el),
  trainingLoadInfo: (d,el) => TrainingLoadView.showInfo(d.topic,el),
  setGoal: d => { if (!writeSetting('goal',S.settings.goal===d.v?null:d.v)) return; render(); },
  setBall: d => { const v = ballN() + (+d.d); if (!writeSetting('ballN',Math.max(0,Math.min(7,v)))) return; render(); },
  setMatch: d => { if (!writeSetting('matchDay',+d.v)) return; render(); },
  toggleMatch: d => { const t = calDay(weekStart(Date.now()), +d.i); setMatchDate(t, !matchOn(t)); render(); },
  matchAdd: () => { const el = document.getElementById('matchadd'), v = el && /^(\d{4})-(\d\d)-(\d\d)$/.exec(el.value || '');
    if (!v) { toast('Odaberi datum utakmice.'); return; }
    const t = new Date(+v[1], +v[2] - 1, +v[3]).getTime();
    if (t < calDay(Date.now())) { toast('Odaberi današnji ili neki kasniji datum.'); return; }
    if (!setMatchDate(t,true)) return; render(); toast('Utakmica ' + DAYS_IN[dayIdx(t)] + ', ' + shortDate(t) + ' je dodana.'); },
  matchDel: d => { const m = Object.assign({}, matchDates()); delete m[d.k]; if (!writeSetting('matchDates',m)) return; render(); },
  kgSkip: async d => { const p = S.pr[d.id]; if (!p) return; const n = clone(p); delete n.id; n.kgSkip = kgSig(kgPlan(p)); S.pr[d.id].kgSkip = n.kgSkip; render(); await save('protocols', d.id, n); },
  goalSheet: d => { S.sheet = { kind:'goal', id: d.id }; render(); },
  kgSheet: d => { S.sheet = { kind:'kg', id: d.id }; render(); },
  goalSkip: async d => { const p = S.pr[d.id]; if (!p) return; const n = clone(p); delete n.id; n.goalSkip = S.settings.goal; S.pr[d.id].goalSkip = n.goalSkip; render(); await save('protocols', d.id, n); },
  goalApply: async d => { const p = S.pr[d.id]; if (!p || !GOALS[S.settings.goal] || !gymProto(p)) return; const plan = goalPlan(p, S.settings.goal); const n = clone(p); delete n.id; n.items = plan.items; n.goal = S.settings.goal; n.updatedAt = Date.now();
    S.pr[d.id] = Object.assign({ id: d.id }, n); S.sheet = null; render(); await save('protocols', d.id, n); toast('Protokol je prilagođen cilju „' + GOALS[n.goal].name + '”.'); },
  kgApply: async d => { const p = S.pr[d.id]; if (!p) return; const plan = kgPlan(p); const n = clone(p); delete n.id; n.items = plan.items;
    S.pr[d.id] = Object.assign({ id: d.id }, n); S.sheet = null; render(); await save('protocols', d.id, n); toast('Kilogrami su upisani.'); },
  setProgN: d => { if (!writeSetting('progN',+d.v)) return; render(); },
  setPlate: d => { const v = +d.v; if (PLATES.indexOf(v) === -1) return; if (!writeSetting('plateKg',v)) return; render(); },
  sugUp: async d => { const p = S.pr[d.p]; if (!p) return; const n = clone(p); delete n.id; const it = n.items[+d.j], e = S.ex[it.exId], nd = nextDose(e, it, () => lastRecorded(it.exId)); if (!nd.item) return;
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
  countAsDone: () => { if (!P || !P.done) return; P.countAsDone = P.countAsDone !== true; savePlay(); render(); },
  answer: d => { const j = +d.j, val = d.v !== '0'; if (!P || !P.done || !P.items[j]) return;
    savePlayerChoice(['answers','lastReps'],()=>{
      P.answers = P.answers || {}; P.lastReps = P.lastReps || {};
      const rec = P.auto && (P.auto[j] === 'partial' || P.auto[j] === 'skip') ? P.auto[j] : null;
      P.answers[j] = P.answers[j] === val && rec ? rec : val;
      if (P.answers[j] === false && P.lastReps[j] == null) P.lastReps[j] = lrDefault(j);
    });
    const v = app.querySelector('.view'); const st = v ? v.scrollTop : 0; render(); const v2 = app.querySelector('.view'); if (v2) v2.scrollTop = st; },
  progInfo: () => { S.sheet = { kind:'progInfo' }; render(); },
  loadInfo: () => go({ v:'loadInfo' }),
  loadRange: d => { S.loadRange = d.v; render(); },   // the period of the exercise chart stays while the app is open
  // a tap on a chart column shows that point; a second tap on it hides it (only the drawn chart changes, nothing is stored)
  ltip: (d, el) => { const svg = el.closest('svg'); if (!svg) return; const g = svg.querySelector('.tipg[data-i="'+d.i+'"]'), on = g && g.classList.contains('on');
    svg.querySelectorAll('.tipg.on').forEach(x => x.classList.remove('on')); if (g && !on) g.classList.add('on'); },
  sheetDone: () => { S.sheet = null; render(); },
  descMore: (d, el) => { const open = el.getAttribute('aria-expanded') !== 'true', text = el.previousElementSibling;
    if (text) text.classList.toggle('clamp', !open); el.setAttribute('aria-expanded', String(open)); el.textContent = open ? 'manje' : 'više'; },
  daySheet: d => { clearToast(); S.sheet = { kind:'day', i: +d.i }; render(); },   // (review) a toast would cover the sheet's rows
  // 1.8.2: a missed session off this week's plan (home make-up offer, day sheet), and back
  skipSlot: d => { if (setSkip(weekStart(Date.now()),d.k,true) && !S.sheet) toast('Preskočeno ovaj tjedan.'); render(); },   // in the day sheet the row's tag says it
  unskipSlot: d => { setSkip(weekStart(Date.now()), d.k, false); render(); },
  // (review) the library row's category, when it is one of the data categories, becomes a Kategorija pill of the sheet, so the
  // count never depends on something the sheet does not show; the other row categories (Favoriti, TRX …) and the search text
  // show as removable chips at the top of the sheet
  eqSheet: () => { if (CATS.indexOf(S.lib.cat) !== -1) { const a = S.lib.cats = (S.lib.cats || []).slice(); if (a.indexOf(S.lib.cat) === -1) a.push(S.lib.cat); lsSet('mt.libcats', a); S.lib.cat = 'Sve'; lsSet('mt.libcat', 'Sve'); }
    S.sheet = { kind:'eq' }; render(); },
  eqToggle: () => { if (S.sheet?.kind !== 'eq') return; S.sheet.eqOpen = !S.sheet.eqOpen; render(); },
  // 1.8: the filter sheet (Kategorija, Oprema tiles, Zona on the figure) and the chip row of the filters in use
  catToggle: d => { const a = S.lib.cats = (S.lib.cats || []).slice(), i = a.indexOf(d.v); if (i === -1) a.push(d.v); else a.splice(i, 1); lsSet('mt.libcats', a); render(); },
  eqTile: d => { const t = EQ_TILES.find(x => x[0] === d.v); if (!t) return; const on = tileOn(t); S.lib.eq = (S.lib.eq || []).filter(x => t[1].indexOf(x) === -1).concat(on ? [] : t[1]); lsSet('mt.libeq', S.lib.eq); render(); },
  musTap: d => { const set = musSet(d.v); if (!MUSCLE_ZONE[d.v] && !set) return; let a = (S.lib.mus || []).slice();
    if (set) a = musSetOn(a, d.v) ? a.filter(r => set.indexOf(r) === -1) : a.concat(set.filter(r => a.indexOf(r) === -1));   // 1.8.1: a shortcut toggles its whole set
    else { const i = a.indexOf(d.v); if (i === -1) a.push(d.v); else a.splice(i, 1); }
    S.lib.mus = a; lsSet('mt.libmus', a); render(); },
  filtDrop: d => {
    if (d.k === 'libcat') { S.lib.cat = 'Sve'; lsSet('mt.libcat', 'Sve'); }
    else if (d.k === 'q') S.lib.q = '';
    else if (d.k === 'cat') { S.lib.cats = (S.lib.cats || []).filter(x => x !== d.v); lsSet('mt.libcats', S.lib.cats); }
    else if (d.k === 'mus') { const set = musSet(d.v) || [d.v]; S.lib.mus = (S.lib.mus || []).filter(x => set.indexOf(x) === -1); lsSet('mt.libmus', S.lib.mus); }
    else { const t = EQ_TILES.find(x => x[0] === d.v); S.lib.eq = (S.lib.eq || []).filter(x => !t || t[1].indexOf(x) === -1); lsSet('mt.libeq', S.lib.eq); }
    render(); },
  filtClear: () => { S.lib.eq = []; S.lib.cats = []; S.lib.mus = []; ['mt.libeq', 'mt.libcats', 'mt.libmus'].forEach(k => lsSet(k, [])); S.lib.cat = 'Sve'; lsSet('mt.libcat', 'Sve'); if (S.sheet) S.lib.q = ''; render(); },
  // the exercise page's dots: jump to that card
  swGo: d => { const r = document.getElementById('swrow'), i = +d.i; if (!r || !r.children[i]) return; S.exTab = EX_CARDS[i]; r.scrollTo({ left: swPos(r, i), behavior: stillMotion() ? 'auto' : 'smooth' }); },
  // the editor's muscle picker: main → secondary → off
  dmus: d => { const dr = S.draft, r = d.v; if (!dr || !MUSCLE_ZONE[r]) return; const m = exMuscles(dr); let prime = m.prime.slice(), sec = m.sec.slice();
    if (prime.indexOf(r) !== -1) { prime = prime.filter(x => x !== r); sec.push(r); } else if (sec.indexOf(r) !== -1) sec = sec.filter(x => x !== r); else prime.push(r);
    setDraftMuscles(dr, prime, sec); render(); },
  dmusDrop: d => { const dr = S.draft; if (!dr) return; const m = exMuscles(dr); setDraftMuscles(dr, m.prime.filter(x => x !== d.v), m.sec.filter(x => x !== d.v)); render(); },
  // programme tests: a result is one history entry of kind 'test' (not a training); "Kreni ispočetka" for a programme
  progTest: d => { const t = progTestDef(d.id, d.t), side = d.s || ''; if (!t || !Object.prototype.hasOwnProperty.call(t.names, side)) return; S.sheet = { kind:'progTest', id: d.id, t: d.t, s: side }; render(); const i = document.getElementById('testv'); if (i) i.focus(); },
  progTestSave: () => {
    const s = S.sheet, t = s && s.kind === 'progTest' && progTestDef(s.id, s.t); if (!t) return;
    const el = document.getElementById('testv'), raw = String(el ? el.value : '').trim().replace(',', '.'), v = /^\d+(\.\d+)?$/.test(raw) ? +raw : NaN;
    s.v = el ? el.value : '';
    if (!(v >= t.min && v <= t.max)) { toast(t.err); if (el) el.focus(); return; }
    const e = { historyId:uid('h'), kind:'test', test: t.id, name: t.names[s.s || ''], value: Math.round(v * 100) / 100, unit: t.unit, at: Date.now() }; if (s.s) e.side = s.s;
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
  progRestart: d => { const g = S.prog[d.id]; if (!g) return; if (!writeSetting('progFrom',{ ...S.settings.progFrom, [g.id]:Date.now() })) return; S.sheet = null; render(); toast('Program kreće ispočetka.'); },
  prDays: async d => { const p = S.pr[d.id]; if (!p) return; const n = clone(p); delete n.id; const ds = n.days = (n.days || []).slice(); const i = ds.indexOf(+d.i); if (i === -1) ds.push(+d.i); else ds.splice(i, 1); ds.sort(); S.pr[d.id].days = ds; planSaved(); render(); await save('protocols', d.id, n); },
  fieldDays: async d => { const f = S.field[d.id]; if (!f) return; const n = clone(f); delete n.id; const ds = n.days = (n.days || []).slice(); const i = ds.indexOf(+d.i); if (i === -1) ds.push(+d.i); else ds.splice(i, 1); ds.sort(); S.field[d.id].days = ds; planSaved(); render(); await save('field', d.id, n); },
  progDays: async d => { const g = S.prog[d.id]; if (!g) return; const n = clone(g); delete n.id; const ds = n.days = (n.days || []).slice(); const i = ds.indexOf(+d.i); if (i === -1) ds.push(+d.i); else ds.splice(i, 1); ds.sort(); S.prog[d.id].days = ds; planSaved(); render(); await save('programs', d.id, n); },
  ddays: d => { const ds = S.draft.days = (S.draft.days || []).slice(); const i = ds.indexOf(+d.i); if (i === -1) ds.push(+d.i); else ds.splice(i, 1); ds.sort(); render(); },
  ilink: d => {
    builderCommitSection();
    const items = S.draft.items, i = +d.i, a = items[i], b = items[i + 1]; if (!a || !b) return;
    const parts=CinemaModel.sections(items);if(!(a.ss&&b.ss===a.ss)&&parts[i]!==parts[i+1]){toast('Za superset odaberi isti dio treninga za obje vježbe.');render();return;}
    regroup(items, () => {
      // switching off inside a circuit splits it in two: the exercises after this one stay together under one new key
      if (a.ss && b.ss === a.ss) { const old = a.ss, nk = uid('s'); for (let k = i + 1; k < items.length && items[k].ss === old; k++) items[k].ss = nk; }
      else { const key = a.ss || b.ss || uid('s'); const oldB = b.ss; a.ss = key; for (let k = i + 1; k < items.length && (k === i + 1 || (oldB && items[k].ss === oldB)); k++) items[k].ss = key; if (!a.rest || a.rest > 30) a.rest = 0; }
    });
    render();
  },
  // a copy is your own protocol: not part of a programme or the pack, and its progress starts from zero
  copyPr: () => { builderCommitSection(); const d = S.draft; const c = clone(d); c.id = uid('p'); c.name = (d.name || 'Protokol') + ' (kopija)'; c.home = null; c.days = []; c._confirmDel = false; c._open = null;
    ['program','week','slot','pack','goalSkip'].forEach(k => delete c[k]); (c.items || []).forEach(it => ['ok','fail','snoozeOk','up','prev','easy'].forEach(k => delete it[k]));
    S.draft = c; render(); toast('Kopija je spremna. Promijeni naziv i spremi.'); },
  dequip: d => { const z = S.draft.equip = (S.draft.equip || []).slice(); const i = z.indexOf(d.v); if (i === -1) z.push(d.v); else z.splice(i, 1); render(); },
  packRemove: async () => { if (!S.sheet) return; if (!S.sheet._confirm) { S.sheet._confirm = true; render(); return; } if (!(await removePack())) { if (S.sheet) S.sheet._confirm = false; render(); return; } S.sheet = null; render(); toast('Paket je uklonjen. Povijest treninga je ostala.'); },
  packKeep: () => { if (S.sheet) S.sheet._confirm = false; render(); }
};

// Keep a native action tap intact while an inline field is focused. Its
// change handler rebuilds the panel; commit inside the already-received click
// instead of removing the pressed button between pointerdown and pointerup.
app.addEventListener('pointerdown',ev=>{
  if(ev.isPrimary===false||ev.button>0)return;
  const input=document.activeElement,button=ev.target.closest('.workout-exercise-page [data-a]');
  if(input?.classList?.contains('workout-set-input')&&button&&!button.disabled)ev.preventDefault();
});
app.addEventListener('click', ev => {
  actionSeq++;
  const closePicker=!!cinemaPicker&&!ev.target.closest('.cinema-number-wheel');
  if(closePicker)cinemaPicker=null;
  if (ev.target && ev.target.id === 'srpe') { rpeTap(ev.target, ev); return; }   // a tap on the slider rates where it was tapped
  const el = ev.target.closest('[data-a]');
  if (!el || !app.contains(el)) {if(closePicker)render();return;}
  if (el.dataset.a === 'sheetClose') { if (ev.target === el) dismissSheet(); return; }
  if (el.disabled) return;
  const fn = A[el.dataset.a];
  if (fn) {
    app.classList.toggle('pointer-input',ev.detail>0);
    ev.preventDefault();
    const input=document.activeElement;
    if(el.closest('.workout-exercise-page')&&input?.classList?.contains('workout-set-input')){
      const committed=workoutInlineChange(input);
      if(!committed&&['workoutEdit','workoutAddSet','workoutStart','playEx','startPr'].includes(el.dataset.a))return;
    }
    fn(Object.assign({}, el.dataset), el, ev);
  }
  if(closePicker&&!cinemaPicker&&app.querySelector('.cinema-number-wheel'))render();
});
// the morning check's pain location: tapping the chosen place again clears it
app.addEventListener('click', ev => {
  const r = ev.target.closest && ev.target.closest('#morning-form input[name="painArea"]');
  if (!r) return;
  const form = r.form;
  if (form.dataset.area === r.value) { r.checked = false; form.dataset.area = ''; } else form.dataset.area = r.value;
});
app.addEventListener('submit', ev => {
  if (ev.target.matches('form[data-load-rating]')) {ev.preventDefault();saveLoadRating(ev.target);return;}
  if (ev.target.id==='starting-load-form') {ev.preventDefault();confirmStartingLoad();return;}
  if (ev.target.id==='morning-form') {ev.preventDefault();A.morningSave();return;}
  if (ev.target.id === 'history-edit-form') { ev.preventDefault(); A.historySave(); }
  if (ev.target.id === 'play-dose-form') { ev.preventDefault(); A.playDoseApply(); }
  if (ev.target.id === 'workout-result-form') { ev.preventDefault(); saveWorkoutResult(ev.target); }
  if(ev.target.id==='cinema-add-exercise-form'){
    ev.preventDefault();
    const s=S.sheet;
    if(s?.kind!=='cinemaAddExercise'||!s.item)return;
    s.kg=ev.target.elements.namedItem('kg').value;
    const kg=StartingLoad.parse(s.kg,s.load.kind);
    if(kg===null){
      s.error=s.load.kind==='lm'?'Upiši od 0 do 300 kg.':'Upiši težinu veću od 0, do 300 kg.';
      document.getElementById('cinema-add-exercise-error').textContent=s.error;
      return;
    }
    cinemaCommitExercises(s,StartingLoad.fill(s.item,kg));
  }
});
app.addEventListener('input', ev => {
  const t = ev.target;
  if(t.id==='cinema-prep-range'){cinemaPrepSelect(CINEMA_PREP_TIMES[Number(t.value)]);return;}
  if(t.id==='workout-swap-search'&&S.sheet?.kind==='workoutSwap'&&S.sheet.swap){
    S.sheet.swap.query=t.value;workoutSwapRefresh(S.sheet);return;
  }
  if(t.id==='cinema-exercise-search'&&S.sheet?.kind==='cinemaAddExercise'){
    S.sheet.query=t.value;
    document.getElementById('cinema-exercise-choices').innerHTML=cinemaExerciseChoices(t.value);
    return;
  }
  if (t.dataset.startKg!=null && S.sheet?.kind==='startingLoad') {S.sheet.values[t.dataset.startKg]=t.value;return;}
  if (t.id === 'history-query') {
    const pos = t.selectionStart;
    top().query = t.value; top().page = 1; render();
    const next = document.getElementById('history-query');
    if (next) { next.focus({ preventScroll:true }); if (pos != null) next.setSelectionRange(pos,pos); }
    return;
  }
  if (t.id === 'srpe') { rpeSet(t); return; }   // the screen is not rebuilt while sliding
  if (t.id === 'libq') { S.lib.q = t.value; const l = document.getElementById('liblist'); if (l) l.innerHTML = libListHtml(); return; }
  if (t.id === 'masdist') { masTyped(t); return; }
  if (t.dataset && t.dataset.bind && S.draft) S.draft[t.dataset.bind] = t.value;
  if (t.tagName === 'TEXTAREA' && t.classList.contains('input')) grow(t);
  if (!S.draft || !t.dataset) return;
  if(t.dataset.repSetSec!=null&&top().v==='build'){
    const item=S.draft.items[Number(t.dataset.repSetSec)];
    if(item){
      if(t.value.trim()==='')delete item.repSetSec;
      else item.repSetSec=repSetSeconds({repSetSec:t.value})??t.value;
    }
    return;
  }
  // typed kilograms (62,5 or 62.5) go straight into the draft; the screen is not rebuilt under the keyboard
  if (t.dataset.ikg != null || t.dataset.dkg != null) {
    const it = t.dataset.ikg != null ? S.draft.items[+t.dataset.ikg] : S.draft, v = kgVal(t.value);
    if (it && v != null) { if (t.dataset.ikg!=null) builderWeight(it,v,t.value.trim()!==''); else it.kg=v; const el = t.dataset.ikg != null && document.getElementById('dose-' + t.dataset.ikg); if (el) el.textContent = dose(it); }
  }

});
app.addEventListener('keydown', ev => {
  app.classList.remove('pointer-input');
  const t=ev.target, list=t.closest('[role="tablist"]');
  if(ev.key==='Enter'&&t.id==='builder-section-name'){ev.preventDefault();A.builderSectionApply({i:S.draft?._sectionCustom});return;}
  if(ev.key==='Enter'&&t.classList?.contains('workout-set-input')){ev.preventDefault();workoutInlineChange(t);return;}
  if (t.getAttribute('role')==='tab' && list && ['ArrowLeft','ArrowRight','Home','End'].includes(ev.key)) {
    const tabs=Array.from(list.querySelectorAll('[role="tab"]:not([disabled])'));
    const current=tabs.indexOf(t), next=ev.key==='Home'?0:ev.key==='End'?tabs.length-1:(current+(ev.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
    ev.preventDefault();const key=focusKey(tabs[next]);tabs[next].click();(focusEl(key)||tabs[next]).focus();return;
  }
  if ((ev.key==='Enter'||ev.key===' ') && t.classList?.contains('body-tap')) {ev.preventDefault();t.dispatchEvent(new MouseEvent('click',{bubbles:true}));return;}
  if (ev.key==='Enter' && t.dataset && (t.id==='topkmh'||t.dataset.ikg!=null||t.dataset.dkg!=null)) {ev.preventDefault();t.blur();}
});
app.addEventListener('focusin', ev => { const t = ev.target; if (t.classList && t.classList.contains('kgin')) setTimeout(() => { try { t.select(); } catch(e){} }, 0); });
app.addEventListener('change', async ev => {
  actionSeq++;
  const t = ev.target;
  if(t.classList?.contains('workout-set-input')){workoutInlineChange(t);return;}
  if(t.dataset.builderSection!=null && S.draft && top().v==='build'){
    const index=Number(t.dataset.builderSection);
    if(t.value==='_custom'){S.draft._sectionCustom=index;S.draft._sectionName='';render();document.getElementById('builder-section-name')?.focus();}
    else if(builderSetSection(index,t.value))render();
    return;
  }
  if(t.dataset.swapFilter&&S.sheet?.kind==='workoutSwap'&&S.sheet.swap){
    const filter=WORKOUT_SWAP_FILTERS.find(item=>item.key===t.dataset.swapFilter);
    if(!filter)return;
    S.sheet.swap.filters[filter.key]=t.value;
    const chip=t.closest('.workout-swap-filter');
    if(chip){chip.dataset.active=String(!!t.value);chip.querySelector('span').textContent=t.value?workoutSwapLabel(filter.key,t.value):filter.label;}
    workoutSwapRefresh(S.sheet);return;
  }
  if(t.id==='workout-target'){A.workoutTarget({v:t.value,j:t.dataset.j});return;}
  if (t.id === 'importWorkoutFile' && t.files?.[0]) {
    const file = t.files[0];
    t.value = '';
    if (file.size > 32 * 1024) { toast('Datoteka treninga je prevelika.', true); return; }
    await previewWorkoutImport(async () => {
      try { return JSON.parse(await file.text()); } catch (_) { return null; }
    });
    return;
  }
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
    if (!writeSetting('topKmh',Math.round(v*10)/10)) return; render(); toast('Najveća brzina: ' + kmhTxt(S.settings.topKmh) + '\u00a0km/h.'); return;
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
document.addEventListener('keydown', ev => {
  if (ev.key==='Escape' && S.sheet) {ev.preventDefault();dismissSheet();return;}
  const sheet=app.querySelector('.sheet');
  if (ev.key!=='Tab' || !sheet) return;
  const controls=Array.from(sheet.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),summary,[tabindex="0"]')).filter(el=>el.getClientRects().length && !el.closest('[inert]'));
  if (!controls.length) {ev.preventDefault();document.getElementById('sheet-h')?.focus();return;}
  const current=controls.indexOf(document.activeElement);
  const next=current<0?(ev.shiftKey?controls.length-1:0):(current+(ev.shiftKey?-1:1)+controls.length)%controls.length;
  ev.preventDefault();controls[next].focus();
});
// Register after the input binders, so a checkpoint includes the value just typed.
app.addEventListener('input',ev=>{const t=ev.target;if(t.classList?.contains('workout-set-input')){const state=workoutState(Number(t.dataset.j));if(state){S.workoutRaw=S.workoutRaw||{};S.workoutRaw[workoutRawKey(state,Number(t.dataset.set),t.dataset.field)]=t.value;}}});
app.addEventListener('input',checkpointDraft);
app.addEventListener('change',checkpointDraft);

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
  if (['home','today','dashboard','progress','trainingLoad','analytics','muscleWeek'].includes(top().v) && top().dailyDate!==dateKey(Date.now()) && !appBusy()) render();
  let cur = null; try { cur = localStorage.getItem(STORE_KEY); } catch(e){}
  if (cur && savedJson != null && cur !== savedJson) { pendingExt = cur; if (!appBusy()) render(); }
  maybeReload();
  if (swContainer) swContainer.getRegistration().then(r => r && r.update()).catch(() => {});
});

/* ---------- Mjesec: the same weekly slots, with exceptions for individual dates ---------- */
const monthDate = (key, opts) => new Date(MonthPlan.time(key)).toLocaleDateString('hr-HR', opts);
const monthShort = key => monthDate(key, {day:'numeric',month:'numeric'});
const monthCap = s => s.charAt(0).toLocaleUpperCase('hr') + s.slice(1);
const monthDayName = key => monthCap(monthDate(key,{weekday:'long'})) + ', ' + monthDate(key,{day:'numeric',month:'long'});
const calendarMap = () => S.settings.planDates || {};
const monthCat = s => s.kind === 'field' ? 'Teren' : s.kind === 'program' ? 'Program' : S.pr[s.id]?.tag || 'Protokol';
const monthRef = s => ' data-kind="' + esc(s.kind) + '" data-id="' + esc(s.id) + '"';
const monthBall = '<span class="mc-ball" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m10 5.8 4 2.8-1.5 4.5h-5L6 8.6z" fill="currentColor"/></svg></span>';
const monthDot = '<i class="mc-dot" aria-hidden="true"></i>';
function monthDaySlots(key, map = calendarMap()){
  const ws = weekStart(MonthPlan.time(key));
  return weekStatus(ws, weekPlan(ws, null, null, map)).slots.filter(x => x.day === dayIdx(MonthPlan.time(key)));
}
function monthChoose(t, date){
  t.date = t.page = date; t.menu = t.picker = t.more = t.confirm = null; t.move = null;
}
function monthSave(t, map, message){
  const before = calendarMap();
  if (!writeSetting('planDates', map)) return false;
  planSaved();
  t.undo = {key:'planDates',before,after:map,date:t.date,day:dateKey(Date.now())};
  t.message = message;
  return true;
}
function monthMatch(t, on){
  const before = matchDates();
  if (!setMatchDate(MonthPlan.time(t.date), on)) return;
  t.undo = {key:'matchDates',before,after:matchDates(),date:t.date,day:dateKey(Date.now())};
  t.message = on ? 'Utakmica je dodana.' : 'Utakmica je uklonjena s ovog datuma.';
  t.picker = t.menu = null; render();
}
function monthBulk(t, which){
  const today = dateKey(Date.now()), map = calendarMap();
  if (which === 'clear') return MonthPlan.reset(map, MonthPlan.monthOf(t.date), today);
  const base = planSlots(), snaps = planSnaps();
  return MonthPlan.repeat(map, t.date, today, (changes,date,row) =>
    weekPlan(weekStart(MonthPlan.time(date)), base, snaps, changes).some(s => s.day === dayIdx(MonthPlan.time(date)) && MonthPlan.same(s,row)));
}
function monthTools(t){
  if (!t.more) return '';
  const range = MonthPlan.monday(t.date), name = monthDate(t.date,{month:'long'});
  const btn = (act, msg) => '<button data-a="monthBulkAsk" data-kind="'+act+'">'+esc(msg)+'</button>';
  if (!t.confirm) return '<div class="mc-tools">'+btn('repeat','Ponovi izmjene tjedna '+monthShort(range)+' – '+monthShort(MonthPlan.shift(range,6)))+
    btn('clear','Vrati tjedni plan za '+name)+'</div>';
  const result = monthBulk(t,t.confirm), repeat = t.confirm === 'repeat';
  return '<div class="mc-tools"><strong>'+(repeat?'Ponovi izmjene do kraja mjeseca':'Vrati tjedni plan')+'</strong><p>'+
    (repeat?'Kopiraju se izmjene odabranog tjedna. Ručno uređeni datumi se preskaču.':'Vraćaju se buduće izmjene ovog mjeseca, uključujući povezana premještanja. Utakmice se čuvaju.')+
    '</p><p>Broj izmjena: '+result.count+'</p><div><button data-a="monthMore">Odustani</button> <button class="mc-link" data-a="monthBulkApply"'+
    (!result.count?' disabled':'')+'>Primijeni</button></div></div>';
}
function monthPicker(t, slots){
  if (!t.picker) return '';
  const groups = [['all','Sve'],['protocol','Protokoli'],['field','Teren'],['program','Programi']];
  const filter = groups.map(([k,n])=>'<button data-a="monthFilter" data-kind="'+k+'" aria-pressed="'+(t.picker===k)+'">'+n+'</button>').join('');
  const options = [];
  for (const [kind, items] of [['protocol',S.pr],['field',S.field],['program',S.prog]]) {
    if (t.picker !== 'all' && kind !== t.picker) continue;
    for (const id of Object.keys(items)) {
      if (kind === 'program' && !progStatus(items[id]).next) continue;
      const s = calendarSlot({kind,id}); if (s) options.push(s);
    }
  }
  options.sort((a,b) => a.name.localeCompare(b.name,'hr'));
  const game = matchOn(MonthPlan.time(t.date));
  const matchBtn = t.picker === 'all' ? '<button class="mc-option" data-a="monthMatch" data-on="1"'+(game?' disabled':'')+'><span>'+monthBall+' Utakmica</span><small>'+(game?'Već u planu':'Nogomet')+'</small></button>' : '';
  return '<section class="mc-picker" aria-label="Dodaj u odabrani dan"><div class="mc-filters">'+filter+'</div>'+matchBtn+options.map(s=>{
    const present = slots.some(x=>MonthPlan.same(x,s));
    return '<button class="mc-option" data-a="monthPick"'+monthRef(s)+(present?' disabled':'')+'><span>'+esc(s.name)+'</span><small>'+
      esc(present?'Već u planu':s.min?s.min+' min':monthCat(s))+'</small></button>';
  }).join('')+(!options.length && !matchBtn?'<p class="mc-empty">Nema dostupnih treninga u ovoj skupini.</p>':'')+'</section>';
}
function monthItem(t, s, ws, st, editable){
  const attrs = monthRef(s), ref = s.origin || t.date, menu = t.menu && MonthPlan.same(t.menu,s);
  if (s.skip) {
    const restore = !t.move && ws === weekStart(Date.now()) ? '<button class="mc-link" data-a="unskipSlot" data-k="'+esc(slotKey(s))+'">Vrati</button>' : '';
    return '<div class="mc-item mc-itemrow mc-inactive"><div><b>'+esc(s.name)+'</b><small>Preskočeno</small></div>'+restore+'</div>';
  }
  const status = s.done ? 'Odrađeno'+(s.l && dateKey(s.l.at)!==t.date?' '+monthShort(dateKey(s.l.at)):'') :
    s.partial ? 'Djelomično' : t.date < dateKey(Date.now()) ? 'Propušteno' : ref !== t.date ? 'Premješteno s '+monthShort(ref) : s.extra ? 'Dodano za ovaj dan' : '';
  const meta = [monthCat(s),s.min?s.min+' min':'',status].filter(Boolean).join(' · ');
  const warnSlot = s.kind==='program' && !s.pr && S.prog[s.id] ? {...s,pr:progStatus(S.prog[s.id]).next?.pr} : s;
  const warning = editable && !s.done ? matchNote(warnSlot,s.day,ws,st.slots) : '';
  return '<div class="mc-item"><div class="mc-itemrow"><button class="mc-session" '+slotOpen(s)+'><b>'+esc(s.name)+'</b><small>'+esc(meta)+'</small></button>'+
    (editable && !s.done?'<button class="mc-icon" data-a="monthMenu"'+attrs+' aria-label="Radnje za '+esc(s.name)+'" aria-expanded="'+!!menu+'">⋯</button>':'')+
    '</div>'+(menu && editable && !s.done?'<div class="mc-actions"><button data-a="monthMove"'+attrs+'>Premjesti</button><button data-a="monthSkip"'+attrs+'>'+
    (s.extra?'Ukloni':'Preskoči')+'</button></div>':'')+
    (warning?'<p class="mc-warn">'+esc(warning)+'</p>':'')+'</div>';
}
function monthSummary(t, ws, st){
  const start = dateKey(ws), days = Array.from({length:7},(_,i)=>MonthPlan.shift(start,i));
  const games = weekMatches(ws);
  const counted = st.slots.filter(slotCounts);
  const minutes = counted.reduce((n,s)=>n+(Number(String(s.min||0).replace(',','.'))||0),0);
  const metres = counted.reduce((n,s)=>n+(s.kind==='field' && S.field[s.id]?fieldLoad(S.field[s.id]).m||0:0),0);
  const metrics = ['Odrađeno '+st.done+' od '+st.planned, games.length+' '+plural(games.length,'utakmica','utakmice','utakmica')];
  if (minutes && counted.every(s=>s.min)) metrics.push('≈ '+Math.round(minutes)+' min');
  if (metres) metrics.push('≈ '+(metres/1000).toLocaleString('hr-HR',{maximumFractionDigits:1})+' km na terenu');
  return '<section class="mc-summary"><button class="mc-summary-head" data-a="monthSummary" aria-expanded="'+!!t.summary+'"><b>Sažetak tjedna</b><small>'+
    esc(monthShort(start)+' – '+monthShort(days[6]))+'</small><span aria-hidden="true">'+(t.summary?'⌃':'⌄')+'</span></button>'+
    (t.summary?'<p>'+esc(metrics.join(' · '))+'</p>'+days.map((d,i)=>{
      const names = st.slots.filter(s=>s.day===i).map(s=>esc(s.name)+(s.skip?' · preskočeno':''));
      if (games.includes(i)) names.unshift('<span class="mc-game">Utakmica</span>');
      return '<button class="mc-weekrow" data-a="monthWeekDay" data-date="'+d+'"><small>'+esc(monthDate(d,{weekday:'short',day:'numeric'}))+
        '</small><span>'+(names.join('<br>')||'Slobodan dan')+'</span></button>';
    }).join(''):'')+'</section>';
}
VIEWS.month = function(t){
  const today = dateKey(Date.now()), month = MonthPlan.monthOf(t.page), grid = MonthPlan.grid(month);
  const weekly = new Map(), base = planSlots(), snaps = planSnaps();
  function status(key) {
    const ws = weekStart(MonthPlan.time(key));
    if (!weekly.has(ws)) weekly.set(ws,weekStatus(ws,weekPlan(ws,base,snaps)));
    return weekly.get(ws);
  }
  const calendar = grid.map(key=>{
    const st = status(key), i = dayIdx(MonthPlan.time(key)), inMonth = MonthPlan.monthOf(key)===month;
    const has = st.slots.some(s=>s.day===i && !s.skip) || st.log.some(l=>dayIdx(l.at)===i), game = matchOn(MonthPlan.time(key));
    const label = [monthDayName(key),key===today?'danas':'',has?'trening':'',game?'utakmica':''].filter(Boolean).join(', ');
    return '<button class="mc-date'+(inMonth?'':' adjacent')+'" data-a="monthDate" data-date="'+key+'" aria-label="'+esc(label)+'" aria-pressed="'+(key===t.date)+
      '"'+(key===today?' aria-current="date"':'')+(t.move && (key<today || key===t.date)?' disabled':'')+'><b>'+Number(key.slice(8))+'</b><span class="mc-marks">'+
      (inMonth && has?monthDot:'')+(inMonth && game?monthBall:'')+'</span></button>';
  }).join('');
  const ws = weekStart(MonthPlan.time(t.date)), st = status(t.date), i = dayIdx(MonthPlan.time(t.date));
  const slots = st.slots.filter(s=>s.day===i), editable = t.date>=today && !t.move;
  const game = matchOn(MonthPlan.time(t.date));
  let agenda = game ? '<div class="mc-item mc-itemrow"><div><b class="mc-game">'+monthBall+' Utakmica</b><small>Nogomet</small></div>'+
    (editable?'<button class="mc-link" data-a="monthMatch" data-on="0" aria-label="Ukloni utakmicu s ovog datuma">Ukloni</button>':'')+'</div>' : '';
  agenda += slots.map(s=>monthItem(t,s,ws,st,editable)).join('');
  const sourceRows = (calendarMap()[t.date]||[]).filter(r=>r.to!==t.date && !slots.some(s=>MonthPlan.same(s,r)));
  for (const r of sourceRows) {
    const s = calendarSlot(r); if (!s) continue;
    agenda += '<div class="mc-item mc-itemrow mc-inactive"><div><b>'+esc(s.name)+'</b><small>'+
      esc(r.to?'Premješteno na '+monthShort(r.to):'Preskočeno')+'</small></div>'+
      (editable && !r.to?'<button class="mc-link" data-a="monthPick"'+monthRef(r)+'>Vrati</button>':'')+'</div>';
  }
  for (const l of st.log.filter(l=>dayIdx(l.at)===i && !slots.some(s=>s.l===l || s.partial===l))) {
    agenda += '<div class="mc-item"><b>'+esc(l.name||'Trening')+'</b><small>'+(planCounts(l)?'Odrađeno':'Djelomično')+' · dnevnik</small></div>';
  }
  const moving = t.move ? '<div class="mc-moving"><div><b>Odaberi novi datum</b><small>'+esc(t.move.name)+'</small></div>'+
    '<button class="mc-link" data-a="monthCancel">Odustani</button></div>' : '';
  return '<div class="view mc"><header>'+topbar(backBtn(),'<button class="mc-link" data-a="monthToday">Danas</button>')+
    '<div class="mc-heading"><h1>'+esc(monthCap(monthDate(t.page,{month:'long'})))+' <small>'+t.page.slice(0,4)+'</small></h1><nav aria-label="Kretanje po mjesecima">'+
    '<button class="mc-icon" data-a="monthStep" data-d="-1" aria-label="Prethodni mjesec">‹</button><button class="mc-icon" data-a="monthStep" data-d="1" aria-label="Sljedeći mjesec">›</button>'+
    '<button class="mc-icon mc-overflow" data-a="monthMore" aria-label="Više radnji" aria-expanded="'+!!t.more+'"'+(t.move?' disabled':'')+'>⋯</button></nav></div></header>'+
    monthTools(t)+moving+'<div class="mc-calendar"><div class="mc-names" aria-hidden="true">'+['Pon','Uto','Sri','Čet','Pet','Sub','Ned'].map(n=>'<span>'+n+'</span>').join('')+
    '</div><div class="mc-days" role="group" aria-label="Dani u mjesecu">'+calendar+'</div></div>'+
    '<div class="mc-legend"><span>'+monthDot+' Trening</span><span>'+monthBall+' Utakmica</span></div>'+
    '<section class="mc-agenda"><div class="mc-aghead"><h2 aria-live="polite">'+esc(monthDayName(t.date))+'</h2>'+
    (editable?'<button class="mc-link" data-a="monthAdd" aria-expanded="'+!!t.picker+'">'+(t.picker?'Zatvori':'+ Dodaj')+'</button>':'')+'</div>'+
    (agenda || '<p class="mc-empty">Slobodan dan.'+(!base.length && !Object.keys(calendarMap()).length?' Za jedan datum odaberi + Dodaj. Za ponavljanje označi dane u samom treningu.':'')+'</p>')+monthPicker(t,slots)+
    (t.message?'<div class="mc-message" role="status"><span>'+esc(t.message)+'</span>'+(t.undo?'<button class="mc-link" data-a="monthUndo">Poništi</button>':'')+'</div>':'')+
    '</section>'+(!t.move?monthSummary(t,ws,st):'')+'</div>';
};
Object.assign(A,{
  monthOpen: d => {
    const key = MonthPlan.valid(d.date)?d.date:dateKey(Date.now());
    go({v:'month',date:key,page:key});
  },
  monthStep: d => {
    const t = top(), next = MonthPlan.changeMonth(t.page,+d.d);
    if (t.move) t.page = next; else monthChoose(t,next);
    render();
  },
  monthToday: () => { const t=top(), day=dateKey(Date.now()); if(t.move)t.page=day; else monthChoose(t,day); render(); },
  monthDate: d => {
    const t = top(), day = d.date, today = dateKey(Date.now());
    if (!MonthPlan.valid(day)) return;
    if (t.move) {
      const s = monthDaySlots(t.date).find(x=>MonthPlan.same(x,t.move) && x.origin===t.move.origin && !!x.extra===!!t.move.extra && (x.n||0)===(t.move.n||0));
      if (!s || s.done || s.skip || t.date<today) { monthChoose(t,day); render(); toast('Raspored se promijenio. Ponovno odaberi trening.'); return; }
      if (day<today || day===t.date) return;
      if (monthDaySlots(day).some(x=>MonthPlan.same(x,s))) { toast('Isti trening je već na tom datumu. Odaberi drugi dan.'); return; }
      if (!monthSave(t,MonthPlan.put(calendarMap(),s.origin,{...s,to:day}),'Trening premješten na '+monthShort(day))) return;
    }
    monthChoose(t,day); render();
  },
  monthCancel: () => { const t=top(); monthChoose(t,t.date); render(); },
  monthMenu: d => { const t=top(); t.menu=t.menu && MonthPlan.same(t.menu,d)?null:d; t.picker=null; render(); },
  monthAdd: () => { const t=top(); t.picker=t.picker?null:'all'; t.menu=null; render(); },
  monthFilter: d => { top().picker=d.kind; render(); },
  monthMove: d => {
    const t=top(), s=monthDaySlots(t.date).find(x=>MonthPlan.same(x,d));
    if (!s || s.done || s.skip || t.date<dateKey(Date.now())) return;
    t.move=s; t.menu=t.picker=t.more=null; render();
  },
  monthPick: d => {
    const t=top(); if (t.date<dateKey(Date.now()) || !calendarSlot(d)) return;
    if (monthDaySlots(t.date).some(s=>MonthPlan.same(s,d))) { toast('Taj je trening već u planu.'); return; }
    const old = MonthPlan.regular(calendarMap(),t.date,d);
    const weekly = planSlots().some(s=>s.day===dayIdx(MonthPlan.time(t.date)) && MonthPlan.same(s,d));
    const extra = !weekly || !!old?.to;
    const n = extra ? MonthPlan.extraNumber(calendarMap(),t.date,d) : 0;
    const map = MonthPlan.put(calendarMap(),t.date,{...d,extra,n,to:t.date});
    if (!monthSave(t,map,'Trening dodan za '+monthShort(t.date))) return;
    t.picker=t.menu=null; render();
  },
  monthSkip: d => {
    const t=top(), s=monthDaySlots(t.date).find(x=>MonthPlan.same(x,d));
    if (!s || s.done || s.skip || t.date<dateKey(Date.now())) return;
    if (!monthSave(t,MonthPlan.put(calendarMap(),s.origin,{...s,to:null}),s.extra?'Trening uklonjen.':'Trening preskočen za '+monthShort(t.date))) return;
    t.menu=null; render();
  },
  monthMatch: d => { const t=top(); if(t.date>=dateKey(Date.now()))monthMatch(t,d.on==='1'); },
  monthSummary: () => { const t=top(); t.summary=!t.summary; render(); },
  monthWeekDay: d => { const t=top(); monthChoose(t,d.date); t.summary=false; render(); },
  monthMore: () => { const t=top(); t.more=!t.more; t.confirm=t.menu=t.picker=null; render(); },
  monthBulkAsk: d => { top().confirm=d.kind; render(); },
  monthBulkApply: () => {
    const t=top(); if (!['repeat','clear'].includes(t.confirm)) return;
    const result=monthBulk(t,t.confirm);
    if (!result.count || !monthSave(t,result.map,'Broj primijenjenih izmjena: '+result.count)) return;
    t.more=t.confirm=null; render();
  },
  monthUndo: () => {
    const t=top(), undo=t.undo; if (!undo) return;
    if (undo.day!==dateKey(Date.now()) || JSON.stringify(S.settings[undo.key]||{})!==JSON.stringify(undo.after)) { t.undo=null; t.message='Raspored je u međuvremenu izmijenjen.'; render(); return; }
    if (!writeSetting(undo.key,undo.before)) return;
    planSaved();
    monthChoose(t,undo.date); t.undo=null; t.message='Promjena poništena.'; render();
  }
});

init();
playResume();   // waits until the data is loaded
})();
