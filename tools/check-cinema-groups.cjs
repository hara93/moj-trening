'use strict';
// 1.23.0: one overview before each part and before each superset, triset or circuit that does not open a part
// (CinemaModel.overviewAt), the one plain line inside a group (CinemaModel.nextLine) and where a jump into a group
// lands (CinemaModel.landing). The steps are app.js's own stepsFromItems, run as the app runs it.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const Cinema = require('../cinema-model.js');
const D = require('../player-dose.js');
const Pace = require('../set-pace.js');
const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
const section = (start, end) => {
  const first = source.indexOf(start), last = source.indexOf(end, first + start.length);
  assert.ok(first >= 0 && last > first, start);
  return source.slice(first, last);
};
const NAMES = {uze1:'Fleksija kuka s užetom', uze2:'Ekstenzija kuka s užetom', deadlift:'Mrtvo dizanje', bugarski:'Bugarski čučanj',
  nordic:'Nordijski pregib', hip:'Hip thrust', kop:'Kopenhagen', pallof:'Pallof press', farmers:'Farmerov hod',
  c1:'Prva', c2:'Druga', c3:'Treća', c4:'Četvrta', solo:'Sama'};
function app(items) {
  const ex = Object.fromEntries(Object.entries(NAMES).map(([id, name]) => [id, {id, name, cat:'Snaga', steps:[]}]));
  const ctx = {S:{log:[], ex, settings:{transSec:10}}, PlayerDose:D, SetPace:Pace, CinemaModel:Cinema, uid:() => 'x',
    plural:(n, one, few, many) => n % 10 === 1 && n % 100 !== 11 ? one : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? few : many,
    nVj:n => n + ' vježb' + (n === 1 ? 'a' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 'e' : 'i'),
    groupWord:n => n === 2 ? 'Superset' : n === 3 ? 'Triset' : 'Kružni trening',
    esc:s => String(s), fmtKg:v => v + ' kg', workoutNumber:v => Number(v), repsOf:(it, set) => (it.repsList && it.repsList[set - 1]) || it.reps || 10};
  vm.createContext(ctx);
  vm.runInContext(section('function validSidePrep(', 'const SIDE_PREP_CHOICES') + section('function repSetSeconds(', 'function fieldMin(') +
    section('function cinemaManualTarget(', 'function cinemaFooter(') + section('function groupsOf(items){', 'function stepsFromField(f){') +
    section('function cinemaGroupHtml(', 'function cinemaOverviewRow('), ctx);
  const steps = JSON.parse(JSON.stringify(ctx.stepsFromItems(items)));   // plain data of this realm (deepEqual compares prototypes)
  return {ctx, steps, parts:Cinema.groupSections(items)};
}
const sets = (exId, n, extra = {}) => ({exId, measure:'sets', sec:30, sets:n, reps:8, rest:0, sides:false, kg:0, ...extra});
const hold = (exId, n, extra = {}) => ({exId, measure:'time', sec:20, sets:n, reps:1, rest:0, sides:false, kg:0, ...extra});
// Trening A as 1.23.0 ships it, shortened: Priprema, Snaga with a superset of 3 + 2 sets and one with a hold, then a
// superset that opens the part Trup
const A = [sets('uze1', 2, {sides:true, rest:20, section:'Priprema'}), sets('uze2', 2, {sides:true, rest:20, section:'Priprema'}),
  sets('deadlift', 2, {rest:150, section:'Snaga'}),
  sets('bugarski', 3, {sides:true, ss:'a', section:'Snaga'}), sets('nordic', 2, {rest:90, ss:'a', section:'Snaga'}),
  sets('hip', 3, {ss:'b', section:'Snaga'}), hold('kop', 3, {sides:true, rest:75, ss:'b', section:'Snaga'}),
  sets('pallof', 2, {sides:true, ss:'c', section:'Trup'}), hold('farmers', 2, {rest:60, ss:'c', section:'Trup'})];
// a step by what it shows: the item, the set, the side, the kind
const find = (steps, g, set, side, kind) => steps.findIndex(s => s.g === g && s.set === set && (side === undefined || s.side === side) && (kind ? s.kind === kind : s.kind === 'work' || s.kind === 'manual'));
const transTo = (steps, g) => steps.findIndex(s => s.trans && s.g === g);
const L = 'Lijeva strana', R = 'Desna strana';

test('overviews: the part overview at the start and at each new part; a group overview before a group inside a part', () => {
  const {steps, parts} = app(A);
  const at = steps.map((_, i) => Cinema.overviewAt(steps, i, parts)).map((o, i) => o && [i, o.kind, o.j]).filter(Boolean);
  assert.deepEqual(at, [[0, 'part', 0], [transTo(steps, 2), 'part', 2], [transTo(steps, 3), 'group', 3], [transTo(steps, 5), 'group', 5], [transTo(steps, 7), 'part', 7]],
    'Priprema at the start, Snaga, Superset A, Superset B, and Trup (a part that starts with a group shows the PART overview)');
  assert.equal(Cinema.overviewAt(steps, transTo(steps, 1), parts), null, 'the pause between two Priprema exercises shows no overview');
  // no step but the start countdown and the pause before an exercise can be an overview
  steps.forEach((s, i) => { if (Cinema.overviewAt(steps, i, parts)) assert.ok(s.kind === 'prep' || s.trans, i); });
});

test('a group at the very start: the group overview without parts, the part overview with them', () => {
  const pair = [sets('c1', 3, {ss:'x'}), sets('c2', 3, {ss:'x', rest:60}), sets('solo', 2, {rest:60})];
  const plain = app(pair);
  assert.deepEqual(Cinema.overviewAt(plain.steps, 0, plain.parts), {kind:'group', j:0}, 'no parts: the start countdown shows the group');
  assert.equal(Cinema.overviewAt(plain.steps, transTo(plain.steps, 2), plain.parts), null, 'a single exercise after a group: no overview');
  const parted = app(pair.map(it => ({...it, section:'Snaga'})));
  assert.deepEqual(Cinema.overviewAt(parted.steps, 0, parted.parts), {kind:'part', j:0}, 'one authored part: the part overview opens it');
  // extra preparation added before a later set (CinemaModel.prepare) is not an overview
  const later = plain.steps.slice(); later.splice(find(later, 1, 2), 0, {kind:'prep', dur:10, g:1, set:2, label:'Priprema'});
  assert.equal(Cinema.overviewAt(later, find(later, 1, 2) - 1, plain.parts), null);
  // a group inside a workout without parts, after a single exercise: its pause is the group overview
  const mid = app([sets('solo', 2, {rest:60}), sets('c1', 2, {ss:'x'}), sets('c2', 2, {ss:'x', rest:60})]);
  assert.deepEqual(Cinema.overviewAt(mid.steps, transTo(mid.steps, 1), mid.parts), {kind:'group', j:1});
  assert.equal(Cinema.overviewAt(mid.steps, 0, mid.parts), null, 'the start of a single exercise without parts: no overview (as 1.22.1)');
  assert.equal(Cinema.overviewAt([], 0, []), null);
  assert.equal(Cinema.overviewAt(null, 3, null), null);
});

test('the next line inside a group names what really follows: same group, after a rest, the next group, the next part, nothing at the end', () => {
  const {steps, parts} = app(A);
  const line = (g, set, side) => { const n = Cinema.nextLine(steps, find(steps, g, set, side), parts); return n && [n.kind, n.word, n.g]; };
  assert.equal(line(3, 1, L), null, 'the left side: its right side follows, no line');
  assert.deepEqual(line(3, 1, R), ['exercise', 'Sljedeća', 4], 'A1 → A2 with no rest');
  assert.deepEqual(line(4, 1), ['exercise', 'Nakon odmora', 3], 'A2 → the round rest → A1');
  assert.deepEqual(line(4, 2), ['exercise', 'Nakon odmora', 3], 'mixed set counts: after A2 its last set, round 3 is A1 alone');
  assert.deepEqual(line(3, 3, R), ['group', 'Sljedeći', 5], 'after the group\'s last set: the next group (its overview follows)');
  assert.deepEqual(line(5, 1), ['exercise', 'Sljedeća', 6], 'a setup countdown before a hold is not a rest');
  assert.equal(line(6, 1, L), null, 'a timed hold\'s left side');
  assert.deepEqual(line(6, 1, R), ['exercise', 'Nakon odmora', 5]);
  assert.deepEqual(line(6, 3, R), ['part', 'Sljedeći dio', 7], 'the next exercise opens a part: the part (its overview follows)');
  assert.deepEqual(line(7, 1, R), ['exercise', 'Sljedeća', 8]);
  assert.equal(line(8, 2), null, 'the end of the workout: no line');
  assert.equal(Cinema.nextLine(steps, find(steps, 2, 1), parts), null, 'a single exercise has no line');
  assert.equal(Cinema.nextLine(steps, 0, parts), null, 'not a set');
  // the line always names the screen that comes next
  steps.forEach((s, i) => {
    const n = Cinema.nextLine(steps, i, parts); if (!n || n.kind === 'exercise' && !steps.slice(i + 1, n.at).some(x => x.trans)) return;
    const t = steps.findIndex((x, k) => k > i && x.trans), o = Cinema.overviewAt(steps, t, parts);
    assert.deepEqual(o ? {kind:o.kind, j:o.j} : {kind:'exercise', j:steps[n.at].g}, {kind:n.kind, j:n.g}, i);
  });
});

test('the next line in a circuit: its own rest, no rest, the round rest; a group followed by a single exercise', () => {
  const circuit = [sets('c1', 2, {rest:15, ss:'k'}), sets('c2', 2, {ss:'k'}), sets('c3', 2, {ss:'k'}), sets('c4', 2, {rest:60, ss:'k'}), sets('solo', 2, {rest:60})];
  const {steps, parts} = app(circuit);
  const line = (g, set) => { const n = Cinema.nextLine(steps, find(steps, g, set), parts); return n && [n.kind, n.word, n.g]; };
  assert.deepEqual(line(0, 1), ['exercise', 'Nakon odmora', 1], 'C1 has its own 15 s rest before C2');
  assert.deepEqual(line(1, 1), ['exercise', 'Sljedeća', 2]);
  assert.deepEqual(line(3, 1), ['exercise', 'Nakon odmora', 0], 'the round rest');
  assert.deepEqual(line(3, 2), ['exercise', 'Sljedeća', 4], 'after the circuit: the single exercise');
  const last = app(circuit.slice(0, 4));
  assert.equal(Cinema.nextLine(last.steps, find(last.steps, 3, 2), last.parts), null, 'the circuit ends the workout');
  assert.deepEqual(Cinema.overviewAt(last.steps, 0, last.parts), {kind:'group', j:0}, 'a circuit at the start');
});

test('a jump into a group\'s first set from outside lands on the group overview; a part\'s first set as in 1.22.1', () => {
  const {steps, parts} = app(A);
  const b = find(steps, 3, 1, L), tb = transTo(steps, 3), d = find(steps, 2, 1), n1 = find(steps, 4, 1), h = find(steps, 5, 1);
  assert.equal(Cinema.landing(steps, b, parts, d), tb, 'from Deadlift: the Superset A overview');
  assert.equal(Cinema.landing(steps, b, parts, h), tb, 'from Superset B (the journal, Dijelovi treninga): the overview');
  assert.equal(Cinema.landing(steps, b, parts, tb), b, 'from the overview itself: its first set (else the tap does nothing)');
  assert.equal(Cinema.landing(steps, b, parts, n1), b, 'from inside the group: the set');
  assert.equal(Cinema.landing(steps, find(steps, 3, 2, L), parts, d), find(steps, 3, 2, L), 'a later round is not the group\'s start');
  assert.equal(Cinema.landing(steps, n1, parts, d), n1, 'A2 is not the group\'s start');
  assert.equal(Cinema.landing(steps, d, parts, 0), d, 'a single exercise that opens a part: its first set (1.22.1)');
  const p = find(steps, 7, 1, L);
  assert.equal(Cinema.landing(steps, p, parts, d), p, 'a group that opens a part: its first set (1.22.1)');
  assert.equal(Cinema.landing(steps, find(steps, 5, 1), parts, b), transTo(steps, 5), 'the skip button of Superset A: the Superset B overview');
  // a group at the start of a workout without parts: the start countdown is its overview
  const start = app([sets('c1', 2, {ss:'x'}), sets('c2', 2, {ss:'x', rest:60}), sets('solo', 2, {rest:60})]);
  const c1 = find(start.steps, 0, 1), solo = find(start.steps, 2, 1);
  assert.equal(Cinema.landing(start.steps, c1, start.parts, solo), 0, 'back from the single exercise: the start countdown');
  assert.equal(Cinema.landing(start.steps, c1, start.parts, 0), c1);
  assert.equal(Cinema.landing([], 0, [], 0), 0);
});

test('the words of the next line and of the work heading, as the player shows them', () => {
  const {ctx, steps} = app(A);
  ctx.P = {steps, items:A};
  const text = (g, set, side) => ctx.cinemaNextText(find(steps, g, set, side));
  assert.equal(text(3, 1, R), 'Sljedeća: A2 · Nordijski pregib');
  assert.equal(text(4, 1), 'Nakon odmora: A1 · Bugarski čučanj');
  assert.equal(text(3, 3, R), 'Sljedeći: Superset B');
  assert.equal(text(6, 3, R), 'Sljedeći dio: Trup');
  assert.equal(text(3, 1, L), '');
  assert.equal(text(8, 2), '');
  assert.equal(ctx.ssWhere(steps[find(steps, 3, 2, L)]).head, 'A1 · krug 2 od 3');
  assert.equal(ctx.ssWhere(steps[find(steps, 4, 2)]).aria, 'A2, Superset A, krug 2 od 3');
  assert.equal(ctx.ssMeta(ctx.ssGroup(A, 3)), '3 kruga · odmor 90 s nakon kruga', 'the round rest is the last exercise\'s');
  assert.equal(ctx.ssMeta(ctx.ssGroup([sets('c1', 2, {ss:'x'}), sets('c2', 2, {ss:'x'})], 0)), '2 kruga · bez odmora nakon kruga');
  assert.equal(ctx.ssMeta(ctx.ssGroup(A, 5)), '3 kruga · odmor 75 s nakon kruga');
  // a triset and a circuit say so ("Sljedeći: Triset B", "Kružni trening C")
  const three = [sets('solo', 1), sets('c1', 2, {ss:'x'}), sets('c2', 2, {ss:'x', rest:60}), sets('c1', 2, {ss:'y'}), sets('c2', 2, {ss:'y'}), sets('c3', 2, {ss:'y', rest:60}),
    sets('c1', 1, {ss:'z'}), sets('c2', 1, {ss:'z'}), sets('c3', 1, {ss:'z'}), sets('c4', 1, {ss:'z'})];
  const t = app(three); t.ctx.P = {steps:t.steps, items:three};
  assert.equal(t.ctx.cinemaNextText(find(t.steps, 2, 2)), 'Sljedeći: Triset B');
  assert.equal(t.ctx.cinemaNextText(find(t.steps, 5, 2)), 'Sljedeći: Kružni trening C');
});
