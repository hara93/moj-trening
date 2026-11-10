'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const View = require('../progress-view.js');

test('the compact view retains existing chart controls, actions, values and exercise deep links', () => {
  const chart = '<svg id="wk-vl" role="img" aria-label="190 kg"><rect data-a="ltip" data-i="7"/></svg>' +
    '<details class="ltab"><summary>Tablica</summary><table><tr><td>190 kg</td></tr></table></details>';
  const suggestion = '<button data-a="sugUp" data-p="p" data-j="1">Prihvati 30 kg</button>';
  const html = View.render({
    stats: [{ value: '2/3', label: 'po planu ovaj tjedan', note: '4 odrađeno ukupno' }],
    counts: { ready: 1, way: 1, records: 1 }, suggestionsHtml: suggestion, weeklyHtml: chart, hasWeeklyData: true,
    exercises: [{ id: 'bench-press', name: 'Potisak', html: '<svg id="exercise-chart"/>' }],
    heatHtml: '<i class="l2"></i>', heatLabel: '12 dana s treningom', ruleN: 3
  });
  assert.ok(html.includes(chart));
  assert.ok(html.includes(suggestion));
  assert.match(html, /data-a="openEx" data-id="bench-press"/);
  assert.match(html, /4 odrađeno ukupno/);
  assert.match(html, /aria-label="12 dana s treningom"/);
  assert.match(html, /id="pg-suggestions" open/);
  assert.match(html, /data-a="setProgN" data-v="3" aria-pressed="true"/);
  assert.match(html, /data-a="progInfo"/);
  assert.match(html, /data-a="historyList"/);
  assert.match(html, /data-a="tab" data-tab="dashboard"/);
});

test('a zero history has one actionable entry and keeps advanced tools available without inventing trends', () => {
  const html = View.render({ zero: true, stats: [{ value: 0, label: 'treninga ukupno' }], counts: {} });
  assert.match(html, /Prvi trening, prvi pomak/);
  assert.match(html, /data-a="tab" data-tab="home"/);
  for (const section of ['load', 'suggestions', 'records', 'exercises', 'consistency', 'rules']) {
    assert.match(html, new RegExp('id="pg-' + section + '"'));
    assert.doesNotMatch(html, new RegExp('id="pg-' + section + '" open'));
  }
  assert.doesNotMatch(html, /▲|napredovao si|oporavljen si/);
});

test('dosing disclosure preserves every actual control and input from the existing renderer', () => {
  const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  const start = source.indexOf('function progressDosingSections(){');
  const end = source.indexOf('// what a chart draws', start);
  assert.ok(start >= 0 && end > start);
  const dosing = new Function('GOALS', 'S', 'ballN', 'matchDay', 'plateKg', 'loaded', 'loadKind',
    'bestE1', 'goalDesc', 'nwNum', 'weekMatches', 'weekStart', 'dateKey', 'Date', 'DAYS',
    'DAYNAMES', 'matchDatesHtml', 'weekAdvice', 'kmhTxt', 'topKmh', 'PLATES', 'fmtKg', 'esc',
    source.slice(start, end) + '\nreturn progressDosingSections();');
  const sections = dosing(
    { snaga: { name: 'Snaga' } }, { ex: {}, settings: {} }, () => 2, () => -1, () => 1.25,
    () => false, () => 'bar', () => 0, () => ['4 serije'], x => x, () => [], () => 0,
    () => '', Date, ['P', 'U', 'S', 'Č', 'P', 'S', 'N'], ['pon', 'uto', 'sri', 'čet', 'pet', 'sub', 'ned'],
    () => '<input id="matchadd"><button data-a="matchAdd">Dodaj</button>', () => 'Tvoj tjedan',
    String, () => 28.8, [1.25, 2.5], value => value + ' kg', String
  );
  const raw = sections.map(item => item.html).join('');
  const wrapped = View.render({ tab:'doziranje', dosingSections:sections });
  const controls = html => (html.match(/(?:data-a|id|data-v|data-d)="[^"]*"/g) || []).sort();
  for (const control of controls(raw)) assert.ok(controls(wrapped).includes(control), control);
  assert.equal((wrapped.match(/class="pg-section"/g) || []).length, 4);
  assert.match(wrapped, /id="topkmh"/);
  assert.match(wrapped, /data-a="setPlate"/);
  assert.match(wrapped, /data-a="setBall"/);
  assert.match(wrapped, /data-a="setMatch"/);
});

test('dynamic plain values and IDs are escaped, while trusted existing renderers are preserved', () => {
  const html = View.render({ stats: [{ value: '<img onerror=bad()>', label: '<script>' }],
    exercises: [{ id: 'x" onclick="bad()', name: '<svg onload=bad()>', html: '<div class="safe-chart"></div>' }],
    heatLabel: '" onload="bad()' });
  assert.doesNotMatch(html, /<img|<script>|<svg onload|data-id="x" onclick/);
  assert.match(html, /&lt;img/);
  assert.match(html, /&quot; onclick=&quot;/);
  assert.match(html, /<div class="safe-chart"><\/div>/);
});

test('information controls have named native dialog and original detail routes remain reachable', () => {
  const html = View.render({});
  assert.match(html, /<dialog id="progress-info"[^>]*aria-labelledby="progress-info-title"/);
  assert.match(html, /<h2 id="progress-info-title" tabindex="-1" autofocus>/);
  assert.doesNotMatch(html.match(/<dialog id="progress-info"[\s\S]*?<\/dialog>/)[0], /<button/);
  assert.match(html, /data-a="progressInfo" data-topic="load"/);
  assert.match(html, /data-a="progressInfo" data-topic="records"/);
  assert.match(html, /data-a="progInfo"/);
});

test('help has explicitly labeled visual examples alongside text and retains calculation details', () => {
  const load = View.infoHtml('load');
  assert.match(load, /Primjer · jedna serija/);
  assert.match(load, /5 ponavljanja puta 20 kilograma jednako je 100 kilograma/);
  assert.match(load, /data-a="loadInfo"/);
  for (const topic of ['overview', 'suggestions', 'exercises', 'records', 'consistency', 'rules']) {
    const html = View.infoHtml(topic);
    assert.match(html, /class="pg-help-visual"/);
    assert.match(html, /<p>/);
  }
  assert.match(View.infoHtml('exercises'), /ovo nisu tvoji rezultati/);
});

function comparison(overrides={}) {
  return {id:'bench',name:'Potisak',kind:'reps',unit:'pon.',previous:6,current:8,delta:2,
    previousAt:new Date(2026,9,27,18).getTime(),currentAt:new Date(2026,10,3,18).getTime(),
    previousSessionId:'s1',currentSessionId:'s2',context:'20 kg u zapisu · obje strane · rezerva nije poznata',...overrides};
}

test('real before/after performance is visible before tools with dates, load context and full exercise route', () => {
  const html=View.render({insights:{comparisons:[comparison()]},counts:{ready:1},suggestionsHtml:'<button data-a="sugUp">Prihvati</button>'});
  assert.ok(html.indexOf('id="pg-performance"')<html.indexOf('id="pg-suggestions"'));
  assert.match(html, /<section id="pg-performance"/);
  assert.match(html, /class="pg-before">6 <small>pon\.<\/small>/);
  assert.match(html, /class="pg-after">8 <small>pon\.<\/small>/);
  assert.match(html, /class="pg-change pg-change-up">\+2 pon\./);
  assert.match(html, /27\. 10\. 2026\./);
  assert.match(html, /3\. 11\. 2026\./);
  assert.match(html, /20 kg u zapisu · obje strane · rezerva nije poznata/);
  assert.match(html, /data-a="openEx" data-id="bench"[^>]*aria-label="Otvori vježbu i povijest: Potisak"/);
  assert.match(html, /id="pg-suggestions" open/,'a pending actionable suggestion stays open');
  assert.doesNotMatch(html, /id="pg-load" open/,'advanced workload chart starts collapsed');
});

test('lower and unchanged performances remain neutral and invalid comparisons never become progress', () => {
  const lower=View.render({insights:{comparisons:[comparison({current:4,delta:99})]}});
  assert.match(lower, /class="pg-change">−2 pon\./);
  assert.doesNotMatch(lower, /pg-change-up|bolji oporavak|oporavljen si|\+99/);
  const unchanged=View.render({insights:{comparisons:[comparison({kind:'time',unit:'s',current:6})]}});
  assert.match(unchanged, /Trajanje serije/);
  assert.match(unchanged, /class="pg-change">Bez promjene/);
  const invalid=View.render({insights:{comparisons:[comparison({current:null}),comparison({previousAt:NaN}),comparison({kind:'estimated'})]}});
  assert.doesNotMatch(invalid, /<article class="pg-comparison"/);
  assert.match(invalid, /Prva izvedba je polazište/);
});

test('the eight-week chart and accessible table show actual counts, known minutes and missing AU without fake zero bars', () => {
  const weeks=Array.from({length:8},(_,i)=>({start:new Date(2026,8,14+i*7).getTime(),count:i===7?2:0,minutes:i===7?80.5:0,au:i===7?280:0,unrated:i===7?1:0}));
  const html=View.render({insights:{weeks}});
  assert.ok(html.indexOf('id="pg-activity"')<html.indexOf('id="pg-suggestions"'));
  assert.match(html, /class="pg-activity-summary"><strong>2<span>spremljenih treninga/);
  assert.match(html, /80,5 min zabilježeno/);
  assert.match(html, /class="pg-activity-chart"[^>]*role="img"[^>]*aria-label="Broj spremljenih treninga po tjednima:/);
  assert.equal((html.match(/class="pg-activity-bar/g)||[]).length,1);
  assert.equal((html.match(/class="pg-activity-track"/g)||[]).length,8);
  const table=html.slice(html.indexOf('<details class="pg-activity-table"'),html.indexOf('</table>',html.indexOf('<details class="pg-activity-table"')));
  assert.equal((table.match(/scope="row"/g)||[]).length,8);
  assert.match(table, /<td>2<\/td><td>80,5<\/td><td>280 poznato · 1 nepoznato<\/td>/);
  // 1.24.0: the abbreviation is explained at the table itself, and a screen reader hears the words in the column header
  assert.match(table, /<caption>Aktivnost iz spremljenih treninga\. Napor je u jedinicama napora \(j\.n\.\)\.<\/caption>/);
  assert.match(table, /<th scope="col">Napor \(<span aria-hidden="true">j\.n\.<\/span><span class="pg-sr">jedinice napora<\/span>\)<\/th>/);
  assert.match(html, /Zadnji tjedan još traje/);
});

test('unknown insight payloads are safe and all plain new labels are escaped', () => {
  const html=View.render({insights:{comparisons:[comparison({id:'x" onclick="bad()',name:'<img src=x onerror=bad()>',context:'<svg onload=bad()>',unit:'<script>'})],weeks:null}});
  assert.doesNotMatch(html, /<img|<svg onload|<script>|data-id="x" onclick/);
  assert.match(html, /&lt;img src=x onerror=bad\(\)&gt;/);
  assert.match(html, /&lt;svg onload=bad\(\)&gt;/);
  assert.doesNotThrow(()=>View.render({insights:{comparisons:{},weeks:{}}}));
  assert.match(View.infoHtml('performance'), /najbolju potpuno odrađenu seriju/);
  assert.match(View.infoHtml('performance'), /ne dokazuje veću snagu/);
  // 1.24.0: the unit of effort is "j.n." everywhere and is spelled out here; "AU" is gone from the screen
  assert.match(View.infoHtml('activity'), /u jedinicama napora \(j\.n\.\): tvoja ocjena × minute\..*njegov napor nije poznat/);
  assert.doesNotMatch(View.infoHtml('activity'), /\bAU\b/);
});

test('unknown duration and AU remain missing while a recorded zero remains a real zero', () => {
  const start=new Date(2026,10,2).getTime();
  const render=week=>View.render({insights:{weeks:[{start,...week}]}});
  const unknown=render({count:1,minutes:0,missingDuration:1,au:0,unrated:1});
  assert.match(unknown, /— min · 1 bez trajanja/);
  assert.match(unknown, /<td>1<\/td><td>— · 1 bez trajanja<\/td><td>— · 1 nepoznato<\/td>/);
  assert.doesNotMatch(unknown, /0 poznato|0 min zabilježeno|bez ocjene/);
  const mixed=render({count:2,minutes:30,missingDuration:1,au:180,unrated:1});
  assert.match(mixed, /30 min poznato · 1 bez trajanja/);
  assert.match(mixed, /<td>2<\/td><td>30 · 1 bez trajanja<\/td><td>180 poznato · 1 nepoznato<\/td>/);
  const zero=render({count:1,minutes:0,missingDuration:0,au:0,unrated:0});
  assert.match(zero, /0 min zabilježeno/);
  assert.match(zero, /<td>1<\/td><td>0<\/td><td>0<\/td>/);
  const ratedZeroMixed=render({count:2,minutes:30,missingDuration:0,au:0,unrated:1});
  assert.match(ratedZeroMixed, /<td>0 poznato · 1 nepoznato<\/td>/);
  assert.match(View.infoHtml('activity'), /nema ocjenu napora ili trajanje/);
});

test('Napredak opens on 3 months and a main lift with data; a picked 7 days and pinned exercises still win', () => {
  const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  const cut = (a, b) => { const i = source.indexOf(a), j = source.indexOf(b, i); assert.ok(i >= 0 && j > i, a); return source.slice(i, j); };
  assert.match(cut('const SETTINGS_BASE', ';'), /analysisPeriod:'3m'/);
  const vm = require('node:vm');
  const ctx = { TrainingLoad: require('../training-load.js'), GOALS: {}, TodayView: require('../today-view.js'), MonthPlan: require('../month-plan.js'),
    isPlainObj: v => !!v && typeof v === 'object' && !Array.isArray(v), badKey: k => ['__proto__', 'constructor', 'prototype'].includes(k) };
  vm.createContext(ctx);
  vm.runInContext(cut('function cleanSettings(s){', 'const SETTINGS_BASE') + cut('const MAIN_LIFTS', '/* ---------- the Progress tab') +
    ';globalThis.cleanSettings=cleanSettings;globalThis.defaultChartExercise=defaultChartExercise;', ctx);
  assert.equal(ctx.cleanSettings({ analysisPeriod: '7d' }).analysisPeriod, undefined, 'the old saved default gives way to 3 months');
  assert.equal(ctx.cleanSettings({ analysisPeriod: '7d', analysisPeriodChosen: true }).analysisPeriod, '7d');
  assert.equal(ctx.cleanSettings({ analysisPeriod: '1m' }).analysisPeriod, '1m');
  assert.match(cut('progressRange:d=>{', '},'), /writeSetting\('analysisPeriodChosen',true\)/);
  ctx.S = { ex: { pallof: { cat: 'Trup' }, rdl: { cat: 'Snaga' }, 'back-squat': { cat: 'Snaga' }, deadlift: { cat: 'Snaga' }, row: { cat: 'Snaga' } } };
  ctx.loadKind = e => e === ctx.S.ex.row ? 'db' : 'bar';
  const pick = (ids, withData) => ctx.defaultChartExercise(ids, id => withData.includes(id));
  assert.equal(pick(['pallof', 'rdl', 'back-squat', 'deadlift'], ['pallof', 'rdl', 'back-squat', 'deadlift']), 'deadlift');
  assert.equal(pick(['pallof', 'rdl', 'back-squat', 'deadlift'], ['pallof', 'rdl', 'back-squat']), 'back-squat', 'deadlift without data in the period is skipped');
  assert.equal(pick(['pallof', 'row', 'rdl'], ['pallof', 'row', 'rdl']), 'rdl', 'first barbell lift');
  assert.equal(pick(['pallof', 'row'], ['row']), 'row');
  assert.equal(pick(['pallof', 'row'], []), 'pallof');
  assert.match(cut('const chartExerciseId =', '\n'), /chartPinnedIds\[0\] \|\| defaultChartExercise\(candidates,id=>from===null\|\|\(hist\[id\]\|\|\[\]\)\.some\(x=>x\.at>=from\)\)/);
});
