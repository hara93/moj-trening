'use strict';
// 1.22.1: his own pace in rep sets (SetPace), learned from the real set durations (durList), and where it is used: the
// estimate of a rep set without his own set time or tempo, the arc and the workout's total time.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const Pace = require('../set-pace.js');
const D = require('../player-dose.js');
const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
const section = (start, end) => {
  const first = source.indexOf(start), last = source.indexOf(end, first + start.length);
  assert.ok(first >= 0 && last > first, start);
  return source.slice(first, last);
};

const DAY = 864e5;
// one saved rep item: n sets of `reps`, all done, with the durations given (null = not timed)
const done = (exId, reps, durList, extra = {}) => ({exId, measure:'sets', sets:durList.length, setsDone:durList.length, done:true, reps, kg:20, durList, ...extra});
const session = (day, items, extra = {}) => ({historyId:'h' + day, kind:'protocol', name:'Trening', at:day * DAY, items, ...extra});

test('the median of an odd and an even number of values', () => {
  assert.equal(Pace.median([5, 1, 3]), 3);
  assert.equal(Pace.median([4, 1, 3, 2]), 2.5);
  assert.equal(Pace.median([]), null);
});

test('seconds per repetition count the sides that were done', () => {
  // 8 reps on both sides in 48 s: 3 s per rep; a set with one side done: 24 s for 8 reps
  const item = done('lunge', 8, [48, 24, 50], {sides:true, sideCounts:[2, 1, 2]});
  assert.deepEqual(Pace.perRep(item), [3, 3, 50 / 16]);
  // unknown, invalid and over-300 s durations are not his pace; neither is a set without reps or a hold
  assert.deepEqual(Pace.perRep(done('squat', 10, [null, 0, 12.5, 301, 30])), [3]);
  assert.deepEqual(Pace.perRep({...done('squat', 10, [30]), repsList:[0]}), []);
  assert.deepEqual(Pace.perRep({exId:'plank', measure:'time', sets:1, done:true, sec:30, durList:[30]}), []);
  assert.deepEqual(Pace.perRep({exId:'squat', measure:'sets', sets:2, setsDone:2, done:true, reps:10}), [], 'an old entry has no durList');
});

test('the median over the last 3 sessions that timed the exercise, with at least 2 durations', () => {
  const log = [
    session(10, [done('squat', 10, [40, 40])]),             // newest: 4 s per rep
    session(9, [done('squat', 10, [null, null])]),         // not timed: does not count as one of the 3
    session(8, [done('squat', 10, [50])]),                 // 5 s
    session(7, [done('squat', 10, [20, 20, 20])]),         // 2 s
    session(6, [done('squat', 10, [150, 150, 150])])       // the 4th timed session: too old
  ];
  // 4, 4 | 5 | 2, 2, 2 → sorted 2, 2, 2, 4, 4, 5 → (2 + 4) / 2
  assert.equal(Pace.repSeconds(log, 'squat'), 3);
});

test('at least 2 durations, clamped to 1–15 s per rep, other exercises and holds apart', () => {
  assert.equal(Pace.repSeconds([session(1, [done('squat', 10, [40])])], 'squat'), null, 'one duration is not enough');
  assert.equal(Pace.repSeconds([session(1, [done('squat', 10, [40])]), session(2, [done('squat', 10, [40])])], 'squat'), 4, 'two sessions with one each');
  assert.equal(Pace.repSeconds([session(1, [done('jump', 60, [30, 30])])], 'jump'), 1, 'clamped up to 1 s');
  assert.equal(Pace.repSeconds([session(1, [done('drill', 4, [100, 120])])], 'drill'), 15, 'clamped down to 15 s');
  assert.equal(Pace.repSeconds([session(1, [done('squat', 7, [20, 20])])], 'squat'), 2.9, 'rounded to 0.1 s');
  assert.equal(Pace.repSeconds([session(1, [done('squat', 10, [40, 40])])], 'bench'), null);
  // a duplicate of one workout (same historyId) counts once; field sessions and broken rows are ignored
  const twice = session(5, [done('row', 10, [30])]);
  assert.equal(Pace.repSeconds([twice, {...twice}], 'row'), null);
  assert.equal(Pace.repSeconds([{kind:'field', at:DAY, items:[done('row', 10, [30, 30])]}, null, 'x', {at:'bad'}], 'row'), null);
});

test('the counted sessions are the newest by date, whatever the order of the log', () => {
  const log = [session(1, [done('squat', 10, [100, 100])]), session(4, [done('squat', 10, [30])]),
    session(3, [done('squat', 10, [30])]), session(2, [done('squat', 10, [30])])];
  assert.equal(Pace.repSeconds(log, 'squat'), 3);
});

// manualSetEstimate, learnedRepSeconds, stepsFromItems and protoMin as the app runs them
function app(log, ex = {}) {
  const ctx = {S:{log, ex, settings:{transSec:10}}, PlayerDose:D, SetPace:Pace, uid:() => 'x',
    plural:(n, one, few, many) => n === 1 ? one : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? few : many,
    fmtKg:v => v + ' kg', workoutNumber:v => Number(v), repsOf:(it, set) => (it.repsList && it.repsList[set - 1]) || it.reps || 10};
  vm.createContext(ctx);
  vm.runInContext(section('function validSidePrep(', 'const SIDE_PREP_CHOICES') + section('function repSetSeconds(', 'function fieldMin(') +
    section('function cinemaManualTarget(', 'function cinemaFooter(') + section('function groupsOf(items){', 'function stepsFromField(f){'), ctx);
  return ctx;
}
const learned = [session(2, [done('squat', 10, [40, 40])]), session(1, [done('lunge', 6, [24, 36], {sides:true, sideCounts:[2, 2]})])];

test('the learned pace replaces only the generic 3 s or 20 s per rep; his set time and tempo always win', () => {
  const a = app(learned, {squat:{id:'squat', cat:'Snaga'}, sprint:{id:'sprint', cat:'Kondicija'}});
  const squat = {exId:'squat', measure:'sets', sets:3, reps:8};
  assert.equal(a.manualSetEstimate({it:squat, e:a.S.ex.squat, set:1}), 32, '8 reps at his 4 s');
  assert.equal(a.manualSetEstimate({it:{...squat, repSetSec:45}, e:a.S.ex.squat, set:1}), 45, 'his set time wins');
  assert.equal(a.manualSetEstimate({it:{...squat, repSetSec:'50'}, e:a.S.ex.squat, set:1}), 50, 'also when typed as text');
  assert.equal(a.manualSetEstimate({it:{...squat, repSec:6}, e:a.S.ex.squat, set:1}), 48, 'an item tempo wins');
  // without his durations: the generic guess as before
  assert.equal(a.manualSetEstimate({it:{...squat, exId:'bench'}, e:{cat:'Snaga'}, set:1}), 24);
  assert.equal(a.manualSetEstimate({it:{exId:'sprint', measure:'sets', sets:4, reps:5}, e:a.S.ex.sprint, set:1}), 100);
  // a drill at the pitch he has timed: his 8 s per rep instead of the generic 20 s
  const k = app([session(3, [done('sprint', 5, [40, 40])])], {sprint:{id:'sprint', cat:'Kondicija'}});
  assert.equal(k.manualSetEstimate({it:{exId:'sprint', measure:'sets', sets:4, reps:5}, e:k.S.ex.sprint, set:1}), 40);
  // the estimate is whole seconds: 7 reps at his 2.9 s are 20.3 s → 20 s
  const r = app([session(3, [done('squat', 7, [20, 20])])], {squat:{id:'squat', cat:'Snaga'}});
  assert.equal(r.manualSetEstimate({it:{exId:'squat', measure:'sets', sets:3, reps:7}, e:r.S.ex.squat, set:1}), 20);
});

test('a drill at the pitch (Kondicija) may learn up to 60 s per run; strength work keeps the 15 s cap', () => {
  // 1.22.1: the generic guess for a drill is 20 s per rep, so a 15 s cap would only make his timed drills worse
  const log = [session(1, [done('ttest', 1, [30, 34])]), session(2, [done('squat', 4, [100, 120])])];
  assert.equal(Pace.repSeconds(log, 'ttest', {maxRep:() => Pace.MAX_REP_DRILL}), 32);
  assert.equal(Pace.repSeconds(log, 'ttest'), 15, 'without a cap function: 15 s');
  assert.equal(Pace.repSeconds([session(1, [done('ttest', 1, [90, 90])])], 'ttest', {maxRep:() => Pace.MAX_REP_DRILL}), 60, 'clamped to 60 s');
  const a = app(log, {ttest:{id:'ttest', cat:'Kondicija'}, squat:{id:'squat', cat:'Snaga'}});
  assert.equal(a.learnedRepSeconds('ttest'), 32, 'Kondicija: his 32 s per run');
  assert.equal(a.learnedRepSeconds('squat'), 15, 'strength: still at most 15 s per rep');
  assert.equal(a.manualSetEstimate({it:{exId:'ttest', measure:'sets', sets:4, reps:1}, e:a.S.ex.ttest, set:1}), 32);
});

test('sides: one side of a split set, or both sides of a combined set', () => {
  const a = app(learned);
  // lunge: 24 s / 12 reps and 36 s / 12 reps → 2 s and 3 s per rep, median 2.5 s
  const lunge = {exId:'lunge', measure:'sets', sets:2, reps:6, sides:true};
  assert.equal(a.manualSetEstimate({it:lunge, set:1, side:'Lijeva strana'}), 15, '6 reps × 2.5 s on one side');
  assert.equal(a.manualSetEstimate({it:lunge, set:1}), 35, 'both sides in one step: 6 × 2.5 × 2 + 5 s');
  // the set timer splits over the sides as before
  assert.equal(a.manualSetEstimate({it:{...lunge, repSetSec:41}, set:1, side:'Lijeva strana'}), 21);
});

test('the learned pace feeds the step estimates (the arc) and the total time; a new history entry updates it', () => {
  const a = app(learned.slice(), {squat:{id:'squat', name:'Čučanj', cat:'Snaga', steps:[]}});
  const items = [{exId:'squat', measure:'sets', sets:3, reps:8, rest:60}];
  const targets = () => [...a.stepsFromItems(items).filter(step => step.kind === 'manual').map(step => step.targetSec)];
  assert.deepEqual(targets(), [32, 32, 32]);
  // 5 s prep + 3 × 32 s + 2 × 60 s rest = 221 s ≈ 4 min (with the generic 3 s: 5 + 72 + 120 = 197 s ≈ 3 min)
  assert.equal(a.protoMin({items}), 4);
  a.S.log = [session(3, [done('squat', 10, [20, 20])]), session(4, [done('squat', 10, [20, 20])]), session(5, [done('squat', 10, [20, 20])])];
  assert.deepEqual(targets(), [16, 16, 16], 'the newest three sessions: 2 s per rep');
  a.S.log = [];
  assert.deepEqual(targets(), [24, 24, 24], 'no durations: 3 s per rep');
  assert.equal(a.protoMin({items}), 3);
});

test('the log is indexed once per log array, also while the done screen projects the week on another one', () => {
  const a = app(learned.slice(), {squat:{id:'squat', cat:'Snaga'}});
  let built = 0;
  a.SetPace = {...Pace, index:(log, opts) => { built++; return Pace.index(log, opts); }};
  const saved = a.S.log;
  assert.equal(a.learnedRepSeconds('squat'), 4);
  // weekAfter: S.log is a projected copy for a moment, then the saved log again
  a.S.log = [session(9, [done('squat', 10, [50, 50])])].concat(saved);
  assert.equal(a.learnedRepSeconds('squat'), 4.5);
  a.S.log = saved;
  assert.equal(a.learnedRepSeconds('squat'), 4);
  assert.equal(built, 2, 'the saved log keeps its index');
  // a log that grows is indexed again
  saved.unshift(session(10, [done('squat', 10, [20, 20])]));
  assert.equal(a.learnedRepSeconds('squat'), 3);
  assert.equal(built, 3);
});
