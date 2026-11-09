'use strict';
// 1.23.0: his phone meets the new workouts (three parts: Priprema, Glavni dio, Završni dio). app.js's own mergeSeed and
// carryItems (the block between the "SEED MERGE begin" and "SEED MERGE end" lines) run as the app runs them at every
// start, with the repo's hash.js and seed-history.js. His phone holds the 1.22.1 protocols
// (tools/fixtures/protocols-1.22.1.json, because CI has no git tags) with what he set himself: kilograms, progress
// counters, the dose before an increase, a goal. One case starts from the older Trening A of 1.4, whose supersets had
// another order, to show that his doses follow the exercise and not its place.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.join(__dirname, '..');
const app = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
const a = app.indexOf('// ---- SEED MERGE begin ----'), b = app.indexOf('// ---- SEED MERGE end ----');
const W = {};
for (const f of ['hash.js', 'seed-history.js', 'data.js']) new Function('window', fs.readFileSync(path.join(ROOT, f), 'utf8'))(W);
const FIX = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'protocols-1.22.1.json'), 'utf8'));
const OLD = FIX.protocols, OLDER = FIX.older;
const clone = o => JSON.parse(JSON.stringify(o));
const SEED = W.SEED;
const CHANGED = ['snaga-a', 'snaga-b', 'snaga-c', 'eksplozivnost', 'prevencija'];
const PARTS = ['Priprema', 'Glavni dio', 'Završni dio'];

// his phone after 1.22.1: everything as shipped, the changed workouts as 1.22.1 shipped them, then his own changes
function phone(mut = () => {}, older = {}) {
  const S = {ex:{}, pr:{}, field:{}, prog:{}, log:[], _deleted:[]};
  for (const [id, o] of Object.entries(SEED.exercises)) S.ex[id] = {...clone(o), id};
  for (const [id, o] of Object.entries(SEED.protocols)) S.pr[id] = {...clone(older[id] || OLD[id] || o), id};
  for (const [id, o] of Object.entries(SEED.field)) S.field[id] = {...clone(o), id};
  mut(S);
  return S;
}
function merge(S) {
  assert.ok(a > 0 && b > a, 'app.js marks its merge block');
  const collMap = c => c === 'exercises' ? S.ex : c === 'protocols' ? S.pr : c === 'programs' ? S.prog : S.field;
  const run = new Function('S', 'window', 'collMap', 'clone', 'contentHash', 'HASH_SKIP', 'mtStructHash', 'mtDoseHash', 'mtCanon', 'DOSE_KEYS',
    app.slice(a, b) + '\nreturn mergeSeed;');
  return run(S, W, collMap, clone, W.mtContentHash, W.mtHashSkip, W.mtStructHash, W.mtDoseHash, W.mtCanon, W.mtDoseKeys)(SEED);
}
const ids = p => p.items.map(it => it.exId);
const by = (p, exId) => p.items.find(it => it.exId === exId);
const parts = p => [...new Set(p.items.map(it => it.section))];
const STATE = ['ok', 'fail', 'prev', 'up', 'snoozeOk'];

test('the fixture is what 1.22.1 (and 1.4) shipped: its fingerprints are known to seed-history.js', () => {
  assert.deepEqual(Object.keys(OLD), CHANGED);
  for (const id of CHANGED) assert.ok((W.SEED_HISTORY.protocols[id] || []).includes(W.mtContentHash({...OLD[id], id})), id);
  for (const id of CHANGED) assert.ok(!OLD[id].items.some(it => it.section), id + ' had no parts in 1.22.1');
  assert.ok(W.SEED_HISTORY.protocols['snaga-a'].includes(W.mtContentHash({...OLDER['snaga-a'], id:'snaga-a'})), 'Trening A of 1.4');
  assert.deepEqual(ids(OLDER['snaga-a']), ['deadlift', 'bugarski', 'kopenhagen-kratka', 'hip-thrust', 'nordic-curl']);
});

test('never edited, only trained: the three parts arrive; counters stay on their exercise; his plan days stay', () => {
  const S = phone(S => {
    Object.assign(S.pr['snaga-a'].items[0], {ok:1, fail:0}); S.pr['snaga-a'].days = [1, 4]; S.pr['snaga-a'].updatedAt = 99;
    Object.assign(S.pr['prevencija'].items[0], {ok:2});
  });
  assert.equal(merge(S), true);
  const A = S.pr['snaga-a'];
  assert.deepEqual(ids(A), ids(SEED.protocols['snaga-a']));
  assert.equal(A.items[6].exId, 'deadlift');
  assert.equal(A.items[6].ok, 1, 'the counter stays with the deadlift, now the 7th exercise');
  assert.equal(A.items[0].ok, undefined, 'the first Priprema exercise gets no counter');
  assert.deepEqual(A.days, [1, 4]);
  assert.equal(A.desc, SEED.protocols['snaga-a'].desc);
  for (const id of CHANGED) assert.deepEqual(parts(S.pr[id]), PARTS, id);
  const P = S.pr['prevencija'];
  assert.deepEqual([P.items[0].exId, P.items[0].section, P.items[0].ok], ['lagano-trcanje', 'Priprema', undefined]);
  assert.deepEqual([P.items[1].exId, P.items[1].section, P.items[1].ok], ['adductor-squeeze', 'Glavni dio', 2], 'the groin check opens Glavni dio');
  // the other three, untouched, become exactly the shipped version
  for (const id of ['snaga-b', 'snaga-c', 'eksplozivnost']) assert.equal(W.mtContentHash(S.pr[id]), W.mtContentHash({...SEED.protocols[id], id}), id);
});

test('only dosed by him: the new parts arrive and every kilogram, counter, earlier dose and goal stays on its own exercise', () => {
  const S = phone(S => {
    const it = S.pr['snaga-a'].items;
    Object.assign(it[0], {kg:100, kgList:[100, 100, 100, 100], ok:2, prev:{sets:4, reps:5, kg:95}, up:1730000000000, r0:5, r1:8});
    Object.assign(it[1], {kg:15, startingKgKnown:true});
    Object.assign(it[3], {kg:80, reps:8, snoozeOk:2});
    Object.assign(it[4], {sec:30, fail:1});
    S.pr['snaga-a'].goal = 'snaga'; S.pr['snaga-a'].goalSkip = 'hipertrofija';
    Object.assign(S.pr['snaga-c'].items[0], {kg:90, ok:3});
    Object.assign(S.pr['eksplozivnost'].items[4], {kg:24, sets:5});
    Object.assign(S.pr['prevencija'].items[0], {sec:15, ok:1});
    Object.assign(S.pr['prevencija'].items[4], {kg:8, prev:{sets:2, reps:8, kg:6}});
  });
  merge(S);
  const A = S.pr['snaga-a'];
  assert.deepEqual(ids(A), ids(SEED.protocols['snaga-a']), 'the new structure');
  const dl = by(A, 'deadlift');
  assert.equal(dl.kg, 100); assert.deepEqual(dl.kgList, [100, 100, 100, 100]); assert.equal(dl.ok, 2);
  assert.deepEqual(dl.prev, {sets:4, reps:5, kg:95}); assert.equal(dl.up, 1730000000000); assert.equal(dl.r0, 5); assert.equal(dl.r1, 8);
  assert.equal(by(A, 'bugarski').kg, 15); assert.equal(by(A, 'bugarski').startingKgKnown, true);
  assert.equal(by(A, 'hip-thrust').kg, 80); assert.equal(by(A, 'hip-thrust').reps, 8); assert.equal(by(A, 'hip-thrust').snoozeOk, 2);
  assert.equal(by(A, 'kopenhagen-kratka').sec, 30); assert.equal(by(A, 'kopenhagen-kratka').fail, 1);
  assert.equal(by(A, 'nordic-curl').kg, 0, 'an exercise he never dosed keeps the shipped dose');
  assert.equal(dl.section, 'Glavni dio', 'the part arrives on a dosed exercise too');
  assert.equal(by(A, 'hip-thrust').section, 'Završni dio');
  const uze = SEED.protocols['aktivacija-uze'].items;
  A.items.slice(0, 6).forEach((it, k) => {
    assert.equal(it.section, 'Priprema');
    assert.deepEqual([it.exId, it.sets, it.reps, it.rest, it.sides, it.kg], [uze[k].exId, uze[k].sets, uze[k].reps, uze[k].rest, uze[k].sides, uze[k].kg], 'Priprema with Aktivacija s užetom\'s doses');
    for (const q of STATE) assert.equal(it[q], undefined, q);
  });
  assert.equal(A.goal, 'snaga'); assert.equal(A.goalSkip, 'hipertrofija');
  assert.equal(by(S.pr['snaga-c'], 'back-squat').kg, 90); assert.equal(by(S.pr['snaga-c'], 'back-squat').ok, 3);
  assert.equal(by(S.pr['eksplozivnost'], 'kb-swing').kg, 24); assert.equal(by(S.pr['eksplozivnost'], 'kb-swing').sets, 5);
  assert.equal(by(S.pr['eksplozivnost'], 'kb-swing').section, 'Završni dio');
  assert.equal(S.pr['eksplozivnost'].items[0].exId, 'uze-fleksija');
  const P = S.pr['prevencija'];
  assert.deepEqual([by(P, 'adductor-squeeze').sec, by(P, 'adductor-squeeze').ok], [15, 1]);
  assert.deepEqual([by(P, 'jednonozni-rdl').kg, by(P, 'jednonozni-rdl').prev], [8, {sets:2, reps:8, kg:6}]);
  assert.deepEqual([P.items[0].exId, P.items[0].sec], ['lagano-trcanje', 300], 'Priprema: 5 minutes of easy running at the shipped dose');
});

test('an older Trening A (1.4: the supersets in another order), dosed by him: kilograms, counters and goal follow the exercise', () => {
  const S = phone(S => {
    const it = S.pr['snaga-a'].items;   // deadlift, bugarski, kopenhagen-kratka, hip-thrust, nordic-curl
    Object.assign(it[0], {kg:110, ok:1, prev:{sets:4, reps:5, kg:105}});
    Object.assign(it[2], {fail:2});
    Object.assign(it[3], {kg:90, kgList:[90, 90, 95], up:1720000000000});
    Object.assign(it[4], {ok:3, sets:3});
    S.pr['snaga-a'].goal = 'hipertrofija';
  }, OLDER);
  assert.equal(merge(S), true);
  const A = S.pr['snaga-a'];
  assert.deepEqual(ids(A), ids(SEED.protocols['snaga-a']), 'the 1.23.0 structure');
  assert.deepEqual(A.items.map(it => it.section), [...Array(6).fill('Priprema'), 'Glavni dio', 'Glavni dio', 'Glavni dio', 'Završni dio', 'Završni dio']);
  assert.deepEqual([by(A, 'deadlift').kg, by(A, 'deadlift').ok, by(A, 'deadlift').prev], [110, 1, {sets:4, reps:5, kg:105}]);
  assert.equal(by(A, 'kopenhagen-kratka').fail, 2, 'the 3rd exercise of 1.4 is the 11th now');
  assert.deepEqual([by(A, 'hip-thrust').kg, by(A, 'hip-thrust').kgList, by(A, 'hip-thrust').up], [90, [90, 90, 95], 1720000000000]);
  assert.deepEqual([by(A, 'nordic-curl').ok, by(A, 'nordic-curl').sets], [3, 3]);
  assert.equal(by(A, 'bugarski').kg, 0);
  assert.equal(A.goal, 'hipertrofija');
  A.items.slice(0, 6).forEach(it => { for (const q of [...STATE, 'goal']) assert.equal(it[q], undefined, it.exId + ' ' + q); });
});

test('a dosed round rest in a superset stays (the link is unchanged); Trening B gets Priprema, Glavni dio and Završni dio', () => {
  const S = phone(S => { S.pr['snaga-b'].items[1].rest = 150; S.pr['snaga-b'].items[0].kg = 60; });
  merge(S);
  const B = S.pr['snaga-b'];
  assert.equal(by(B, 'pull-up').rest, 150); assert.equal(by(B, 'bench-press').kg, 60);
  assert.deepEqual(B.items.map(it => it.section), ['Priprema', 'Priprema', 'Glavni dio', 'Glavni dio', 'Glavni dio', 'Glavni dio', 'Završni dio', 'Završni dio']);
  assert.deepEqual(B.items.map(it => it.ss || ''), ['', '', 'a', 'a', 'b', 'b', 'c', 'c'], 'the supersets keep their links');
});

test('a workout he changed himself stays his, with its old description; a second start changes nothing', () => {
  const renamed = phone(S => { S.pr['snaga-a'].name = 'Moj A'; S.pr['snaga-a'].items[0].kg = 100; });
  const before = JSON.stringify(renamed.pr['snaga-a']);
  merge(renamed);
  assert.equal(JSON.stringify(renamed.pr['snaga-a']), before, 'renamed: kept byte for byte');
  const removed = phone(S => { S.pr['snaga-b'].items.pop(); });
  const b2 = JSON.stringify(removed.pr['snaga-b']);
  merge(removed);
  assert.equal(JSON.stringify(removed.pr['snaga-b']), b2, 'an exercise removed: kept');
  assert.match(removed.pr['snaga-b'].desc, /band pull-aparta/, 'his copy keeps the description that tells him to warm up first');
  const ownPart = phone(S => { S.pr['prevencija'].items.forEach(it => { it.section = 'Prevencija'; }); });
  const p2 = JSON.stringify(ownPart.pr['prevencija']);
  merge(ownPart);
  assert.equal(JSON.stringify(ownPart.pr['prevencija']), p2, 'his own part: kept');
  const deleted = phone(S => { delete S.pr['snaga-c']; S._deleted.push('protocols/snaga-c'); });
  merge(deleted);
  assert.equal(deleted.pr['snaga-c'], undefined, 'a workout he deleted stays deleted');
  const S = phone(S => { S.pr['snaga-b'].items[0].kg = 60; });
  merge(S);
  const once = JSON.stringify(S.pr);
  assert.equal(merge(S), false);
  assert.equal(JSON.stringify(S.pr), once);
});
