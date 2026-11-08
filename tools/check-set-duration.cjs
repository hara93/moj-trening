'use strict';
// 1.22.1: the real duration of a rep set (durList). The player times a rep set that counts up (no "Tajmer serije") and
// keeps the time only when the tap came live and within the forgotten-tap guard; every per-set path keeps durList aligned.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const D = require('../player-dose.js');
const History = require('../history-model.js');
const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
const between = (start, end) => {
  const first = source.indexOf(start), last = source.indexOf(end, first + start.length);
  assert.ok(first >= 0 && last > first, start);
  return source.slice(first, last);
};

const squat = {exId:'squat',measure:'sets',sets:3,reps:8,kg:60};
const lunge = {exId:'lunge',measure:'sets',sets:2,reps:10,kg:0,sides:true};
const plank = {exId:'plank',measure:'time',sets:2,sec:30};
// targetSec is the estimate the step was timed against (stepsFromItems: 8 × 3 s; a side of 10 lunges: 30 s)
function player() {
  const steps = [{kind:'prep',g:0,dur:5},
    {kind:'manual',g:0,set:1,it:squat,targetSec:24},{kind:'rest',g:0,set:1,dur:60},
    {kind:'manual',g:0,set:2,it:squat,targetSec:24},{kind:'rest',g:0,set:2,dur:60},
    {kind:'manual',g:0,set:3,it:squat,targetSec:24},
    {kind:'manual',g:1,set:1,it:lunge,side:'Lijeva strana',targetSec:30},{kind:'switch',g:1,set:1,dur:10,side:'Promjena strane'},
    {kind:'manual',g:1,set:1,it:lunge,side:'Desna strana',targetSec:30},
    {kind:'manual',g:1,set:2,it:lunge,side:'Lijeva strana',targetSec:30},{kind:'switch',g:1,set:2,dur:10,side:'Promjena strane'},
    {kind:'manual',g:1,set:2,it:lunge,side:'Desna strana',targetSec:30},
    {kind:'work',g:2,set:1,it:plank,dur:30},{kind:'work',g:2,set:2,it:plank,dur:30}];
  return {i:14,steps,doneSteps:{},rir:{},items:[squat,lunge,plank],originalItems:[squat,lunge,plank]};
}
const finish = (p, index, seconds) => { p.doneSteps[index] = 1; if (seconds !== undefined) p.steps[index] = {...p.steps[index], actualDur:seconds}; };

test('the forgotten-tap guard keeps 1 s up to max(60 s, 3 × the estimate) and never more than 300 s', () => {
  // a short estimate: up to 60 s
  assert.equal(D.validSetDuration(60, 10), true);
  assert.equal(D.validSetDuration(61, 10), false);
  // 3 × the estimate when that is longer
  assert.equal(D.validSetDuration(90, 30), true);
  assert.equal(D.validSetDuration(91, 30), false);
  // 300 s at most, whatever the estimate
  assert.equal(D.validSetDuration(300, 200), true);
  assert.equal(D.validSetDuration(301, 200), false);
  // no estimate known: the 60 s floor
  assert.equal(D.validSetDuration(60, undefined), true);
  assert.equal(D.validSetDuration(61, null), false);
  for (const bad of [0, -5, 12.5, NaN, '40', null]) assert.equal(D.validSetDuration(bad, 30), false, String(bad));
});

test('a live-timed set saves its seconds in durList; untimed and over-guard sets are null; holds get none', () => {
  const p = player();
  finish(p, 1, 42);        // timed live
  finish(p, 3);            // marked done without a live time (a tap while the journal held the clock)
  finish(p, 5, 75);        // 75 s > max(60, 3 × 24): a forgotten tap
  const fields = D.logDose(p, 0, 'partial').fields;
  assert.deepEqual(fields.durList, [42, null, null]);
  assert.deepEqual(fields.setNumbers, [1, 2, 3]);
  // the hold keeps secList (its dose) and never gets a durList
  finish(p, 12); finish(p, 13);
  assert.equal(Object.hasOwn(D.logDose(p, 2, true).fields, 'durList'), false);
  // nothing timed: no list at all (old entries simply have none)
  const q = player(); finish(q, 1); finish(q, 3);
  assert.equal(Object.hasOwn(D.logDose(q, 0, 'partial').fields, 'durList'), false);
  // a set left out in the middle: durList follows setNumbers, one value per performed set
  const r = player(); finish(r, 1, 42); finish(r, 5, 40);
  const gap = D.logDose(r, 0, 'partial').fields;
  assert.deepEqual([gap.setNumbers, gap.durList], [[1, 3], [42, 40]]);
});

test('a sided set played as two steps saves the total over both sides, with its side count', () => {
  const p = player();
  finish(p, 6, 31); finish(p, 8, 29);   // set 1: both sides timed
  finish(p, 9, 33);                     // set 2: left only so far
  const fields = D.logDose(p, 1, 'partial').fields;
  assert.deepEqual(fields.durList, [60, 33]);
  assert.deepEqual(fields.sideCounts, [2, 1]);
  // the guard applies to the set: two 100 s sides are 200 s > max(60, 3 × 60)
  const q = player(); finish(q, 6, 100); finish(q, 8, 100);
  assert.deepEqual(D.logDose(q, 1, 'partial').fields.durList, undefined);
  // one side not timed live: the set's total is not known
  const r = player(); finish(r, 6, 31); finish(r, 8);
  assert.equal(D.setDuration(r, 1, 1, false), null);
  // the guard's estimate is both sides': 80 + 80 = 160 s ≤ max(60, 3 × (30 + 30)), over 3 × one side's 30 s
  const s = player(); finish(s, 6, 80); finish(s, 8, 80);
  assert.deepEqual(D.logDose(s, 1, 'partial').fields.durList, [160]);
});

test('"Sve odrađeno" on the done screen credits untimed sets with null, and a skipped set saves nothing', () => {
  const p = player();
  finish(p, 1, 40);                     // set 1 timed live; sets 2 and 3 were swiped past (not done)
  const all = D.logDose(p, 0, true).fields;
  assert.deepEqual(all.setNumbers, [1, 2, 3]);
  assert.deepEqual(all.durList, [40, null, null]);
  // the other side of a set he did not do himself is not timed either
  const q = player(); finish(q, 6, 30);
  assert.deepEqual(D.logDose(q, 1, true).fields.durList, undefined);
  assert.equal(D.setDuration(q, 1, 1, true), null);
  const skipped = D.logDose(p, 0, 'skip').fields;
  assert.equal(Object.hasOwn(skipped, 'durList'), false);
  assert.equal(skipped.setsDone, 0);
});

test('the journal rows carry the duration of done sets only', () => {
  const p = player();
  finish(p, 1, 42); finish(p, 6, 31); p.i = 8;
  assert.deepEqual(D.checklist(squat, p, 0).map(row => [row.state, row.dur]), [['done', 42], ['skipped', null], ['skipped', null]]);
  // a set with one side done is partial: no duration yet
  assert.deepEqual(D.checklist(lunge, p, 1).map(row => [row.state, row.dur]), [['partial', null], ['waiting', null]]);
  finish(p, 8, 29);
  assert.equal(D.checklist(lunge, p, 1)[0].dur, 60);
  assert.equal(D.checklist(plank, p, 2)[0].dur, null);
});

test('a checkpoint keeps the raw time of rep steps only', () => {
  const p = player();
  finish(p, 1, 42);
  p.steps[12] = {...p.steps[12], actualDur:20};       // a hold never has one
  p.steps[3] = {...p.steps[3], actualDur:-1};         // invalid
  p.steps[5] = {...p.steps[5], actualDur:4000};       // over an hour: invalid
  const restored = D.restoreSteps(D.packSteps(p.steps), p.items, id => ({id, name:id}));
  assert.equal(restored[1].actualDur, 42);
  assert.equal(restored[1].targetSec, 24);
  for (const index of [3, 5, 12]) assert.equal(Object.hasOwn(restored[index], 'actualDur'), false, String(index));
});

test('history edits keep durList aligned with the performed sets', () => {
  const entry = {kind:'protocol',name:'A',at:1,items:[{exId:'squat',measure:'sets',sets:4,setsDone:3,done:true,reps:8,kg:60,
    rirList:[2,1,0],durList:[40,null,38]}]};
  // one set fewer: the last duration goes with it
  const fewer = History.edit(entry, {items:[{index:0,setsDone:2}]});
  assert.equal(fewer.ok, true);
  assert.deepEqual(fewer.entry.items[0].durList, [40, null]);
  assert.deepEqual(fewer.entry.items[0].rirList, [2, 1]);
  // one set more: an added set has no known duration
  const more = History.edit(entry, {items:[{index:0,setsDone:4}]});
  assert.deepEqual(more.entry.items[0].durList, [40, null, 38, null]);
  // rows read it; an invalid value never becomes a duration
  assert.deepEqual(History.recordedRows(entry.items[0]).map(row => row.dur), [40, null, 38]);
  assert.deepEqual(History.recordedRows({...entry.items[0], durList:[0, 12.5, '30']}).map(row => row.dur), [null, null, null]);
  const bad = History.edit(entry, {items:[{index:0,durList:[40, 0, 38]}]});
  assert.equal(bad.ok, false);
  // an edit of another set's reps keeps the list as it is
  const reps = History.edit(entry, {items:[{index:0,repsList:[8,8,6]}]});
  assert.deepEqual(reps.entry.items[0].durList, [40, null, 38]);
  // a sided item: the edit rewrites every side count to both sides, so the time of a set with one side done (33 s for
  // the left side) is no longer the set's time and becomes unknown; a set whose side count stays keeps its time
  const sided = {kind:'protocol',name:'A',at:1,items:[{exId:'lunge',measure:'sets',sets:3,setsDone:2,done:true,reps:10,kg:0,sides:true,
    sideCounts:[2,1],setNumbers:[1,2],durList:[60,33]}]};
  const edited = History.edit(sided, {items:[{index:0,setsDone:3}]});
  assert.equal(edited.ok, true);
  assert.deepEqual(edited.entry.items[0].sideCounts, [2, 2, 2]);
  assert.deepEqual(edited.entry.items[0].durList, [60, null, null]);
  assert.deepEqual(History.edit(sided, {items:[{index:0,setsDone:1}]}).entry.items[0].durList, [60]);
});

test('backups and imports clean durList like the other per-set lists', () => {
  const ctx = {cleanFixes:0, PlayerDose:D, MuscleWork:require('../muscle-work.js')};
  vm.createContext(ctx);
  vm.runInContext(between('const isPlainObj =', 'const asText =') + '\nglobalThis.clean=(k,v)=>JSON.stringify(cleanVal(k,v,0));', ctx);
  const clean = (k, v) => JSON.parse(ctx.clean(k, v));
  assert.deepEqual(clean('durList', [42, null, '38', 0, -3, 12.5, 3601, 'x']), [42, null, 38, null, null, null, null, null]);
  assert.deepEqual(clean('durList', 'broken'), []);
  const item = clean(null, {exId:'squat', measure:'sets', sets:2, durList:[42, 39]});
  assert.deepEqual(item.durList, [42, 39]);
});

test('screen readers hear the duration with its units written out', () => {
  const ctx = {fmt:s => { s = Math.max(0, Math.ceil(s)); const m = Math.floor(s / 60), r = s % 60; return m + ':' + (r < 10 ? '0' : '') + r; },
    plural:(n, one, few, many) => { const m10 = n % 10, m100 = n % 100; if (m10 === 1 && m100 !== 11) return one; if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few; return many; }};
  vm.createContext(ctx);
  vm.runInContext(between('function workoutSetDurationHtml(', 'function workoutTableHtml('), ctx);
  const line = seconds => {
    const html = ctx.workoutSetDurationHtml(seconds);
    return html && [/aria-hidden="true">([^<]*)</.exec(html)[1], /class="workout-sr">([^<]*)</.exec(html)[1]];
  };
  assert.deepEqual(line(42), ['0:42', 'trajanje 42 sekunde']);
  assert.deepEqual(line(35), ['0:35', 'trajanje 35 sekundi']);
  assert.deepEqual(line(21), ['0:21', 'trajanje 21 sekunda']);
  assert.deepEqual(line(60), ['1:00', 'trajanje 1 minuta']);
  assert.deepEqual(line(65), ['1:05', 'trajanje 1 minuta 5 sekundi']);
  assert.deepEqual(line(122), ['2:02', 'trajanje 2 minute 2 sekunde']);
  for (const unknown of [null, 0, 12.5]) assert.equal(ctx.workoutSetDurationHtml(unknown), '', String(unknown));
});
