'use strict';
// 1.23.0: the shipped workouts' parts (data.js) and the editor's part names (app.js WORKOUT_PARTS). Trening A, B, C,
// Skokovi i bacanja and Prevencija ozljeda have exactly three parts, Priprema, Glavni dio and Završni dio, in that order;
// every superset, triset or circuit lies inside one part; no exercise appears twice in a workout (his dose would land on
// the first occurrence when a newer version arrives, app.js carryItems); Priprema never asks for a starting weight.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const Cinema = require('../cinema-model.js');
const StartingLoad = require('../starting-load.js');
const ROOT = path.join(__dirname, '..');
const W = {};
new Function('window', fs.readFileSync(path.join(ROOT, 'data.js'), 'utf8'))(W);
const {protocols, exercises} = W.SEED;
const source = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
const section = (start, end) => {
  const first = source.indexOf(start), last = source.indexOf(end, first + start.length);
  assert.ok(first >= 0 && last > first, start);
  return source.slice(first, last);
};
const PARTS = ['Priprema', 'Glavni dio', 'Završni dio'];
const CHANGED = ['snaga-a', 'snaga-b', 'snaga-c', 'eksplozivnost', 'prevencija'];
// exercises per part, as decided (Završni dio is the last block that already existed: no new exercises)
const LAYOUT = {
  'snaga-a': {main:['deadlift', 'bugarski', 'nordic-curl'], end:['hip-thrust', 'kopenhagen-kratka']},
  'snaga-b': {main:['bench-press', 'pull-up', 'half-kneeling-landmine-press', 'db-row'], end:['pallof-press', 'farmers-walk']},
  'snaga-c': {main:['back-squat', 'rdl', 'single-leg-calf-raise', 'db-reverse-lunge', 'side-plank'], end:['ball-hamstring-curl', 'dead-bug']},
  'eksplozivnost': {main:['pogo-jumps', 'box-jump', 'lateral-bound'], end:['med-ball-rotational-throw', 'kb-swing']},
  'prevencija': {main:['adductor-squeeze', 'nordic-curl', 'kopenhagen-kratka', 'jednonozni-most-kutija'], end:['jednonozni-rdl', 'single-leg-calf-raise', 'ravnoteza-dosezanje']},
};
const dose = ({exId, measure, sec, sets, reps, rest, sides}) => ({exId, measure, sec, sets, reps, rest, sides});
const inPart = (id, name) => protocols[id].items.filter(it => it.section === name);

test('the editor offers exactly Priprema, Glavni dio and Završni dio', () => {
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(section('const WORKOUT_PARTS', '\n') + ';this.parts=WORKOUT_PARTS;', ctx);
  assert.deepEqual([...ctx.parts], PARTS);
});

test('Trening A, B, C, Skokovi i bacanja and Prevencija have exactly three parts: Priprema, Glavni dio, Završni dio', () => {
  for (const id of CHANGED) {
    const parts = Cinema.sections(protocols[id].items);
    assert.deepEqual([...new Set(parts)], PARTS, id);
    // in that order, each part one block
    assert.deepEqual(parts, [...parts].sort((x, y) => PARTS.indexOf(x) - PARTS.indexOf(y)), id + ': parts in order');
    assert.deepEqual(inPart(id, 'Glavni dio').map(it => it.exId), LAYOUT[id].main, id + ': Glavni dio');
    assert.deepEqual(inPart(id, 'Završni dio').map(it => it.exId), LAYOUT[id].end, id + ': Završni dio');
  }
  // Priprema: Aktivacija s užetom with its own doses (A, C, Skokovi); the run and the band pull-apart (B); the run (Prevencija)
  const uze = protocols['aktivacija-uze'].items.map(dose);
  for (const id of ['snaga-a', 'snaga-c', 'eksplozivnost']) assert.deepEqual(inPart(id, 'Priprema').map(dose), uze, id);
  const run = {exId:'lagano-trcanje', measure:'time', sec:300, sets:1, reps:1, rest:15, sides:false};
  assert.deepEqual(inPart('snaga-b', 'Priprema').map(dose), [run, {exId:'band-pull-apart', measure:'sets', sec:30, sets:2, reps:15, rest:30, sides:false}]);
  assert.deepEqual(inPart('prevencija', 'Priprema').map(dose), [run], '5 minutes of easy running');
  // the descriptions no longer send him to warm up first (Priprema does it); the advice on lighter sets stays
  for (const id of CHANGED) assert.doesNotMatch(protocols[id].desc, /Aktivacij|zagrijavanj|zagrij |pull-apart|5 minuta/, id);
  for (const id of ['snaga-a', 'snaga-b', 'snaga-c']) assert.match(protocols[id].desc, /lakše serije/, id);
  assert.match(protocols['prevencija'].desc, /ravno s treninga s loptom, preskoči Pripremu/);
  // no Kondicija part, no other names; the other workouts are unchanged (no parts)
  for (const id of ['aktivacija-uze', 'rehab-kuk-f2', 'trx-krug', 'aktivacija-teren', 'mobilnost']) assert.ok(protocols[id].items.every(it => !it.section), id);
  for (const p of Object.values(protocols)) for (const it of p.items) if (it.section) assert.ok(PARTS.includes(it.section), it.section);
});

test('every shipped part is written on each of its exercises, and every group lies inside one part', () => {
  for (const [id, p] of Object.entries(protocols)) {
    const items = p.items;
    if (items.some(it => it.section)) assert.ok(items.every(it => typeof it.section === 'string' && it.section.trim()), id + ': a part on every exercise');
    assert.deepEqual(Cinema.groupSections(items), Cinema.sections(items), id + ': no group crosses a part');
  }
});

test('no exercise appears twice in a shipped workout', () => {
  for (const [id, p] of Object.entries(protocols)) {
    const seen = p.items.map(it => it.exId);
    assert.equal(new Set(seen).size, seen.length, id);
    for (const exId of seen) assert.ok(exercises[exId], id + ': ' + exId + ' is in the library');
  }
});

test('Priprema asks for no starting weight', () => {
  const ctx = {norm:s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd')};
  vm.createContext(ctx);
  vm.runInContext(section('const EQ_WORDS', 'function exEquip(e){') + section('function exEquip(e){', '// stable fingerprint') +
    section('const isBw =', '// how kilograms work') + section('function loadKind(e){', 'const loaded =') + ';this.isBw=isBw;', ctx);   // a top-level const is not on the context
  const kind = exId => { const e = exercises[exId]; return ctx.isBw(e) ? '' : StartingLoad.kind(e, ctx.exEquip(e), ctx.loadKind(e)); };
  for (const id of CHANGED) {
    const prep = inPart(id, 'Priprema');
    assert.ok(prep.length >= 1, id);
    assert.deepEqual(StartingLoad.requests(prep, exId => ({name:exId, kind:kind(exId)})), [], id);
  }
  assert.equal(kind('deadlift'), 'bar', 'the check itself sees a barbell lift');
});
