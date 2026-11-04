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
  assert.match(html, /aria-label="Zatvori objašnjenje"/);
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
