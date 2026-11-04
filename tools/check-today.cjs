'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const Today = require('../today-model.js');

const date = '2026-11-04'; // Wednesday, local calendar.
const now = new Date(date + 'T12:00:00').getTime();
const at = day => new Date(day + 'T10:00:00').getTime();
const clone = value => JSON.parse(JSON.stringify(value));
const checkin = { date, energy: 4, legs: 1, pain: 0 };
const exercises = {
  press: { id: 'press', name: 'Potisak', cat: 'Snaga', equip: ['Bučice'],
    muscles: { prime: ['front_chest'] } },
  squat: { id: 'squat', name: 'Čučanj', cat: 'Snaga', equip: ['Šipka'],
    muscles: { prime: ['front_quadriceps'] } },
  easy: { id: 'easy', name: 'Mobilnost', cat: 'Mobilnost', equip: ['Bez opreme'] },
  timed: { id: 'timed', name: 'Bočni plank', cat: 'Trup', equip: ['Bez opreme'] }
};
const dose = (exId = 'press', extra = {}) => ({
  exId, measure: 'sets', sets: 3, reps: 8, kg: 20, sides: false, rest: 60, ...extra
});
const plan = (extra = {}) => ({
  id: 'p', kind: 'protocol', name: 'Moj trening', date, items: [dose()], ...extra
});
const template = extra => {
  const candidate = plan(extra);
  if (!extra || !Object.hasOwn(extra, 'date')) delete candidate.date;
  return candidate;
};
const log = (extra = {}) => ({
  historyId: 'h1', kind: 'protocol', refId: 'p', name: 'Moj trening',
  at: at('2026-11-01'), secs: 1200, items: [dose('press', { done: true })], ...extra
});
function input(extra = {}) {
  return { now, exercises: clone(exercises), checkin: clone(checkin), planned: [plan()],
    logs: [], equipment: ['Bučice', 'Šipka'], ...extra };
}
function codes(result) { return result.reasons.map(reason => reason.code); }
function deepFreeze(value) {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}

test('a real current-day own plan is concrete and fully ordered; all inputs stay immutable', () => {
  const source = deepFreeze(input({ planned: [plan({ items: [dose(), dose('timed', {
    section: 'Glavni dio', measure: 'time', sec: 30, kg: 0, group: 'A'
  })] })] }));
  const before = JSON.stringify(source);
  const result = Today.suggest(source);
  assert.equal(result.date, date);
  assert.equal(result.kind, 'planned');
  assert.deepEqual(result.action, { type: 'protocol', id: 'p' });
  assert.deepEqual(result.items, source.planned[0].items);
  assert.equal(result.evidence.find(value => value.type === 'plan').date, date);
  assert.equal(JSON.stringify(source), before);
  assert.equal(Object.isFrozen(result.items[0]), true);
});

test('a match on the actual date wins; a cancelled standing occurrence does not cancel other weeks', () => {
  const match = Today.suggest(input({ settings: { matchDay: 2 } }));
  assert.equal(match.kind, 'protect');
  assert.equal(match.action.type, 'calendar');
  assert.deepEqual(match.items, []);
  const cancelled = Today.suggest(input({ settings: { matchDay: 2, matchDates: { [date]: 0 } } }));
  assert.equal(cancelled.kind, 'planned');
  assert.equal(cancelled.evidence.find(value => value.type === 'match').date, '2026-11-11');
  const otherWeek = Today.suggest(input({ settings: { matchDay: 2, matchDates: { '2026-10-28': 0 } } }));
  assert.equal(otherWeek.kind, 'protect');
});

test('additional dated matches govern heavy legs across week and month boundaries', () => {
  const result = Today.suggest(input({
    settings: { matchDay: -1, matchDates: { '2026-11-06': 1 } },
    planned: [plan({ items: [dose('squat')] })],
    candidates: [template({ id: 'light', name: 'Moja mobilnost', items: [dose('easy', { kg: 0 })] })]
  }));
  assert.equal(result.action.id, 'light');
  assert.equal(result.kind, 'alternative');
  assert.equal(result.evidence.find(value => value.type === 'match').date, '2026-11-06');
  assert.equal(codes(result).includes('planGuard'), true);
  assert.equal(result.evidence.some(value => value.type === 'protocol' && value.id === 'light' && !value.date), true);
});

test('day before and after scheduled matches permit only a whole easy alternative', () => {
  for (const matchDate of ['2026-11-03', '2026-11-05']) {
    const result = Today.suggest(input({ settings: { matchDates: { [matchDate]: 1 } },
      candidates: [template({ id: 'light', items: [dose('easy', { kg: 0 })] })] }));
    assert.equal(result.action.id, 'light');
    assert.equal(result.items[0].exId, 'easy');
  }
});

test('frozen program prescriptions are never reduced, reordered, or replaced', () => {
  const frozen = plan({ frozen: true, items: [dose(), dose('timed', { measure: 'time', sec: 30 })] });
  const source = input({ checkin: { ...checkin, energy: 1 }, planned: [frozen],
    candidates: [template({ id: 'easy', items: [dose('easy')] })] });
  const result = Today.suggest(source);
  assert.equal(result.protectedPlan, true);
  assert.equal(result.kind, 'protect');
  assert.equal(result.action.type, 'calendar');
  assert.deepEqual(result.items, []);
  assert.equal(frozen.items[0].sets, 3);
  const normal = Today.suggest(input({ planned: [frozen] }));
  assert.deepEqual(normal.action, { type: 'protocol', id: 'p' });
  assert.deepEqual(normal.items, frozen.items); // Preview remains exactly the frozen baseline.
});

test('a club prescription is protected and cannot be changed by optional gym candidates', () => {
  const result = Today.suggest(input({ checkin: { ...checkin, energy: 1, legs: 5 },
    planned: [{ id: 'club', kind: 'team', name: 'Klupski trening', date, teamType: 'training' }, plan()] }));
  assert.equal(result.kind, 'protect');
  assert.equal(result.protectedPlan, true);
  assert.match(result.title, /Klupski trening/);
  assert.deepEqual(result.items, []);
});

test('pain is explicit, not inferred from missing data; new pain suppresses optional load', () => {
  for (const status of [{ pain: 1 }, { pain: 6 }, { pain: null, newPain: true }]) {
    const result = Today.suggest(input({ checkin: { ...checkin, ...status } }));
    assert.equal(result.kind, 'caution');
    assert.equal(result.action.type, 'none');
    assert.deepEqual(result.items, []);
  }
  const unknown = Today.suggest(input({ checkin: { date, energy: 4, legs: 1, pain: null } }));
  assert.equal(unknown.kind, 'planned');
  assert.equal(unknown.confidence, 'limited');
  assert.equal(codes(unknown).includes('pain'), false);
  assert.equal(unknown.missing.some(value => value.includes('prazno ne znači')), true);
  assert.equal(Today.suggest(input()).kind, 'planned');
});

test('past/future/malformed morning values are not used as current observations', () => {
  for (const morning of [
    { date: '2026-11-03', energy: 1, legs: 5, pain: 9 },
    { date: '2026-11-05', energy: 1, legs: 5, pain: 9 },
    { date, energy: '1', legs: 9, pain: '0' }
  ]) {
    const result = Today.suggest(input({ checkin: morning }));
    assert.equal(result.kind, 'planned');
    assert.equal(result.confidence, 'limited');
    assert.equal(codes(result).includes('energy'), false);
    assert.equal(codes(result).includes('legs'), false);
    assert.equal(codes(result).includes('pain'), false);
  }
});

test('future logs and library trials/tests do not masquerade as completed training', () => {
  const result = Today.suggest(input({ logs: [
    log({ at: now + 1, srpe: 10, secs: 6000 }),
    log({ kind: 'exercise', at: now - 1000 }),
    log({ kind: 'test', at: now - 1000 })
  ] }));
  assert.equal(result.kind, 'planned');
  assert.equal(result.evidence.some(value => value.type === 'history'), false);
  assert.equal(result.missing.some(value => value.includes('ranije zabilježenih')), true);
});

test('actual team training counts today, while zero minutes is not invented as completed work', () => {
  const completed = { historyId: 'club1', kind: 'team', name: 'Klupski', teamType: 'training', at: now - 1000, secs: 3600 };
  const result = Today.suggest(input({ logs: [completed] }));
  assert.equal(result.kind, 'rest');
  assert.deepEqual(result.action, { type: 'history', id: 'club1' });
  assert.equal(Today.suggest(input({ logs: [{ ...completed, secs: 0 }] })).kind, 'planned');
});

test('an actually played match is history evidence and cannot be cancelled by a calendar override', () => {
  const match = { historyId: 'played', name: 'Utakmica', kind: 'team', teamType: 'match', at: now - 1000, secs: 4200 };
  const result = Today.suggest(input({ logs: [match], settings: { matchDates: { [date]: 0 } } }));
  assert.equal(result.kind, 'rest');
  assert.equal(result.evidence.some(value => value.type === 'history' && value.id === 'played'), true);
  assert.equal(result.evidence.some(value => value.type === 'match' && value.date === date), false);
});

test('known recent hard team load reduces optional upper work; unknown sRPE is not guessed', () => {
  const team = { historyId: 'club2', kind: 'team', name: 'Klupski', teamType: 'training',
    at: at('2026-11-03'), secs: 3600 };
  const known = Today.suggest(input({ logs: [{ ...team, srpe: 8 }] }));
  assert.equal(known.kind, 'reduce');
  assert.equal(known.items[0].sets, 2);
  assert.equal(known.evidence.some(value => value.id === 'club2'), true);
  const unknown = Today.suggest(input({ logs: [team] }));
  assert.equal(unknown.kind, 'planned');
  assert.equal(codes(unknown).includes('recentHard'), false);
});

test('high reported leg heaviness does not prescribe heavy lower work', () => {
  const result = Today.suggest(input({ checkin: { ...checkin, legs: 5 },
    planned: [plan({ items: [dose('squat')] })] }));
  assert.equal(result.kind, 'rest');
  assert.equal(result.action.type, 'calendar');
  assert.deepEqual(result.items, []);
});

test('a short real session with low reserve reduces a complete ordered prescription only in its copy', () => {
  const original = plan({ items: [dose('press', { section: 'Zagrijavanje', sets: 2, kg: 0 }),
    dose('press', { sets: 2, kg: 0 }), dose('press', { section: 'Glavni dio' })] });
  const previous = log({ items: original.items.map((item, index) => ({
    ...item, done: true, rirList: index === 2 ? [2, 2, 0] : [5, 5]
  })) });
  const before = clone(original);
  const result = Today.suggest(input({ planned: [original], logs: [previous] }));
  assert.equal(result.kind, 'reduce');
  assert.deepEqual(result.items.map(item => item.sets), [2, 2, 2]);
  assert.deepEqual(result.items.map(item => item.exId), original.items.map(item => item.exId));
  assert.deepEqual(original, before);
  assert.equal(result.observed[2].rows[2].rir, 0);
});

test('known varying actual reps and kilograms cap a reduced dose, zero-rep failed sets are not replayed', () => {
  const previous = log({ items: [dose('press', {
    done: false, lastReps: 0, repsList: [8, 6, 8], kgList: [20, 22.5, 25], rirList: [3, 1, null]
  })] });
  const result = Today.suggest(input({ logs: [previous], planned: [plan({ items: [dose('press', {
    kg: 30, reps: 10, repsList: [10, 10, 10], kgList: [30, 32.5, 35]
  })] })] }));
  assert.equal(result.kind, 'reduce');
  assert.equal(result.items[0].sets, 2);
  assert.deepEqual(result.items[0].repsList, [8, 6]);
  assert.deepEqual(result.items[0].kgList, [20, 22.5]);
  assert.equal(result.observed[0].rows[2].reps, 0);
  assert.equal(result.observed[0].rows[2].failed, true);
});

test('noncontiguous and partial bilateral sets remain exact observations, never whole-set replay', () => {
  const current = dose('timed', { measure: 'time', sec: 30, sides: true, kg: 5 });
  const previous = log({ items: [{ ...current, done: true, setsDone: 2, setNumbers: [1, 3],
    sideCounts: [1, 1], secList: [20, 25], kgList: [0, 2], sirList: [3, 2] }] });
  const result = Today.suggest(input({ planned: [plan({ items: [current] })], logs: [previous] }));
  assert.equal(result.kind, 'reduce');
  assert.deepEqual(result.observed[0].rows.map(row => [row.set, row.sides, row.sec]), [[1, 1, 20], [3, 1, 25]]);
  assert.equal(result.items[0].sec, 30);
  assert.equal(result.items[0].kg, 5);
  assert.equal(result.items[0].sets, 2);
});

test('unknown actual counts and absent RIR do not turn planned doses into failed observations', () => {
  const result = Today.suggest(input({ logs: [log({ items: [dose('press', {
    historySetsUnknown: true, setsDone: null, done: true, rirList: [null, null, null]
  })] })] }));
  assert.equal(result.kind, 'planned');
  assert.equal(result.observed, undefined);
  assert.equal(codes(result).includes('actualDose'), false);
  const noReserve = Today.suggest(input({ logs: [log({ items: [dose('press', { done: true })] })] }));
  assert.equal(noReserve.kind, 'planned');
  assert.equal(noReserve.observed[0].rows[0].rir, null);
});

test('matching historical dose requires exercise identity, position, measure, and same protocol', () => {
  for (const previous of [
    log({ refId: 'other', items: [dose('press', { done: false, lastReps: 1 })] }),
    log({ items: [dose('squat', { done: false, lastReps: 1 })] }),
    log({ items: [dose('press', { measure: 'time', done: false, lastReps: 1 })] }),
    log({ items: [dose('press', { sides: true, done: false, lastReps: 1 })] })
  ]) {
    const result = Today.suggest(input({ logs: [previous] }));
    assert.equal(result.kind, 'planned');
    assert.equal(result.observed, undefined);
  }
});

test('a whole protocol is unavailable if any exercise or required equipment is excluded', () => {
  const complete = plan({ items: [dose(), dose('squat')] });
  for (const filters of [{ eligibleIds: ['press'] }, { equipment: ['Bučice'] }]) {
    const result = Today.suggest(input({ planned: [complete], ...filters }));
    assert.equal(result.action.type, 'calendar');
    assert.deepEqual(result.items, []);
    assert.notEqual(result.action.type, 'protocol');
  }
  const unknown = Today.suggest(input({ exercises: { custom: { name: 'Bez opreme press', cat: 'Snaga' } },
    planned: [plan({ items: [dose('custom')] })], equipment: [] }));
  assert.equal(unknown.action.type, 'calendar');
});

test('cold start chooses a real available whole template; template evidence is not a calendar occurrence', () => {
  const result = Today.suggest(input({ planned: [], logs: [], candidates: [template({
    id: 'easy', name: 'Moja aktivacija', items: [dose('easy', { kg: 0, sets: 2 })]
  })] }));
  assert.equal(result.kind, 'alternative');
  assert.deepEqual(result.action, { type: 'protocol', id: 'easy' });
  assert.equal(result.evidence.some(value => value.type === 'plan'), false);
  assert.deepEqual(result.evidence.find(value => value.type === 'protocol'), {
    type: 'protocol', id: 'easy', label: 'Moja aktivacija'
  });
  assert.equal(result.items[0].sets, 2);
});

test('no dose/library history produces a concrete calendar step without fabricated observations', () => {
  const result = Today.suggest({ now, planned: [], exercises: {}, logs: [] });
  assert.equal(result.kind, 'choose');
  assert.deepEqual(result.action, { type: 'calendar' });
  assert.deepEqual(result.items, []);
  assert.deepEqual(result.evidence, []);
  assert.equal(result.missing.some(value => /oprema/.test(value)), false);
  assert.equal(codes(result).includes('actualDose'), false);
  assert.equal(result.reasons.some(value => /oporav|spreman|odmoran/.test(value.text)), false);
});

test('unknown equipment is material only to a concrete suggestion requiring it', () => {
  const normal = input();
  delete normal.equipment;
  assert.equal(Today.suggest(normal).missing.some(value => /oprem|Bučice/.test(value)), false);
  normal.planned = [];
  normal.candidates = [template()];
  normal.logs = [log()];
  assert.equal(Today.suggest(normal).missing.some(value => /oprem|Bučice/.test(value)), false);
  normal.planned = [plan({ items: [dose('easy', { kg: 0 })] })];
  assert.equal(Today.suggest(normal).missing.some(value => /oprema/.test(value)), false);
  const untried = input({ planned: [], candidates: [template({ items: [dose('easy', { kg: 0 })] })] });
  delete untried.equipment;
  untried.exercises.easy.equip = ['Strunjača'];
  assert.equal(Today.suggest(untried).missing.some(value => /Strunjača/.test(value)), true);
});

test('on a free day familiar actual protocols rank ahead of catalogue order and untried hard options', () => {
  const result = Today.suggest(input({ planned: [], candidates: [
    template({ id: 'new', name: 'Novi težak' }), template({ id: 'known', name: 'Moj poznati' }),
    template({ id: 'easy', items: [dose('easy', { kg: 0 })] })
  ], logs: [log({ refId: 'known', at: at('2026-10-31') })] }));
  assert.equal(result.action.id, 'known');
  assert.equal(result.evidence.some(value => value.type === 'history' && value.id === 'h1'), true);
  assert.equal(Today.suggest(input({ planned: [], candidates: [template()] })).kind, 'choose');
});

test('free-day choices exclude tomorrow plans, today skips, completed slots and recently repeated hard work', () => {
  for (const occurrence of [plan({ date: '2026-11-05' }), plan({ skip: true }), plan({ done: true })]) {
    const result = Today.suggest(input({ planned: [occurrence], candidates: [template(),
      template({ id: 'easy', items: [dose('easy', { kg: 0 })] })], logs: [log()] }));
    assert.equal(result.action.id, 'easy');
  }
  const recent = Today.suggest(input({ planned: [], candidates: [template(),
    template({ id: 'easy', items: [dose('easy', { kg: 0 })] })], logs: [log({ at: at('2026-11-03') })] }));
  assert.equal(recent.action.id, 'easy');
});

test('missing morning data has one readable notice, and morning reasons explain decisions without numeric repetition', () => {
  const absent = Today.suggest(input({ checkin: null }));
  assert.equal(absent.missing.filter(value => /procjen/.test(value)).length, 1);
  const tired = Today.suggest(input({ checkin: { ...checkin, energy: 1, legs: 4 } }));
  assert.equal(codes(tired).includes('morningGuard'), true);
  assert.equal(tired.reasons.some(reason => /\/[0-9]/.test(reason.text)), false);
});

test('future, skipped and completed occurrences are not offered or used as template candidates', () => {
  const result = Today.suggest(input({ planned: [plan({ date: '2026-11-05' }), plan({ skip: true }), plan({ done: true })],
    candidates: [template({ id: 'future', date: '2026-11-05' }), template({ id: 'frozen', frozen: true })] }));
  assert.equal(result.kind, 'choose');
  assert.equal(result.action.type, 'calendar');
});

test('calendar comparisons survive daylight saving changes and validate actual calendar dates', () => {
  const saved = process.env.TZ;
  process.env.TZ = 'Europe/Zagreb';
  try {
    const spring = '2027-03-29';
    const result = Today.suggest(input({ now: new Date(spring + 'T00:15:00').getTime(),
      checkin: { ...checkin, date: spring }, planned: [plan({ date: spring })],
      settings: { matchDates: { '2027-03-28': 1 } } }));
    assert.equal(result.date, spring);
    assert.equal(result.kind, 'rest');
    assert.equal(result.evidence.some(value => value.type === 'match' && value.date === '2027-03-28'), true);
    assert.equal(Today.validDate('2026-02-29'), false);
    assert.equal(Today.validDate('2028-02-29'), true);
  } finally {
    if (saved === undefined) delete process.env.TZ;
    else process.env.TZ = saved;
  }
});

test('field plans retain their own dose and respect intensity plus two-match spacing', () => {
  const field = { id: 'f', kind: 'field', name: 'Moj teren', date, intensity: 2 };
  const normal = Today.suggest(input({ planned: [field] }));
  assert.deepEqual(normal.action, { type: 'field', id: 'f' });
  assert.deepEqual(normal.items, []);
  const congested = Today.suggest(input({ planned: [field], settings: {
    matchDates: { '2026-11-02': 1, '2026-11-08': 1 }
  } }));
  assert.equal(congested.kind, 'rest');
  assert.notEqual(congested.action.type, 'field');
});

test('demanding field work and tests do not stay full after adverse morning or actual hard effort', () => {
  const team = { historyId: 'hard', kind: 'team', teamType: 'training', at: at('2026-11-03'), secs: 3600, srpe: 9 };
  for (const adverse of [
    { checkin: { ...checkin, energy: 1 } }, { checkin: { ...checkin, legs: 5 } }, { logs: [team] }
  ]) {
    for (const field of [
      { id: 'f', kind: 'field', name: 'Intervali', date, intensity: 2 },
      { id: 't', kind: 'field', name: 'Test', date, intensity: 0, category: 'tests' },
      { id: 's', kind: 'field', name: 'Sprint', date, intensity: 0, category: 'speed' }
    ]) {
      const result = Today.suggest(input({ ...adverse, planned: [field] }));
      assert.equal(result.kind, 'rest');
      assert.equal(result.action.type, 'calendar');
      assert.deepEqual(result.items, []);
    }
  }
});

test('older actual familiarity is cited but is not replayed as a current dose or readiness observation', () => {
  const old = log({ at: at('2026-09-01'), items: [dose('press', { done: false, lastReps: 1, rirList: [0, 0, 0] })] });
  const result = Today.suggest(input({ planned: [], logs: [old], candidates: [template()] }));
  assert.equal(result.action.id, 'p');
  assert.equal(result.kind, 'alternative');
  assert.equal(result.evidence.some(value => value.type === 'history' && value.id === old.historyId), true);
  assert.equal(result.observed, undefined);
  assert.equal(codes(result).includes('familiarity'), true);
  assert.equal(codes(result).includes('actualDose'), false);
});

test('unequal supersets and default-one doses retain their ordering, group keys and complete prescription', () => {
  const items = [dose('press', { sets: 3, ss: 'A' }), dose('timed', {
    measure: 'time', sec: 30, sets: 2, ss: 'A', sides: true
  }), dose('easy', { sets: undefined, ss: undefined, kg: 0 })];
  const result = Today.suggest(input({ planned: [plan({ items })], checkin: { ...checkin, energy: 1 } }));
  assert.equal(result.kind, 'reduce');
  assert.deepEqual(result.items.map(item => item.exId), ['press', 'timed', 'easy']);
  assert.deepEqual(result.items.map(item => item.ss), ['A', 'A', undefined]);
  assert.deepEqual(result.items.map(item => item.sets), [2, 1, undefined]);
  assert.equal(result.items[1].sides, true);
});

test('legacy protocol identities are usable without recategorizing exercises or guessing missing counts', () => {
  const result = Today.suggest(input({ planned: [], candidates: [template()], logs: [log({ kind: null })] }));
  assert.equal(result.action.id, 'p');
  assert.equal(result.observed[0].rows.length, 3);
});

test('timed zero reserve is distinct from unknown reserve and keeps the stored timed measure', () => {
  const item = dose('timed', { measure: 'time', kg: 0, sec: 30 });
  const actual = { ...item, done: true, sirList: [3, 2, 0] };
  const result = Today.suggest(input({ planned: [plan({ items: [item] })], logs: [log({ items: [actual] })] }));
  assert.equal(result.kind, 'reduce');
  assert.equal(result.observed[0].measure, 'time');
  assert.equal(result.observed[0].rows[2].sir, 0);
  assert.equal(result.observed[0].rows[2].rir, null);
  assert.equal(result.items[0].sec, 30);
});
