'use strict';
// 1.22.1: a rep set without its own set timer counts up from 0:00 (pauses excluded); its arc fills over the estimate and
// stays full past it; no countdown cues and no automatic end. His tap saves the real duration in the history entry's
// durList (both sides of a sided set added up; null when over the forgotten-tap guard). A set with "Tajmer serije" and a
// hold still count down and move on by themselves. The journal shows a done set's duration on its second line
// ("0:42"; screen readers: "trajanje 42 s"), without horizontal overflow at 375 px. The estimate learns his own pace
// from earlier durations. The progress dot moves with the arc and never back; the percent counts finished sets only.
// Synthetic data only.
const assert = require('node:assert/strict');
const path = require('node:path');
const { artifacts, engine, fixture: baseFixture, launch, serve } = require('./runtime.cjs');
const id = 'rep-set-timer', again = 'rep-set-timer-learned';
const A = (p, action) => p.locator('[data-a="' + action + '"]');
const player = p => p.evaluate(() => JSON.parse(localStorage.getItem('mt.play')));
const store = p => p.evaluate(() => JSON.parse(localStorage.getItem('mt.data.v1')));
const step = state => state.liveSchedule[state.i];
const stage = p => p.locator('.workout-cinema');
const journal = p => p.locator('.sheet[data-kind="cinemaJournal"]');
const shot = (p, name) => p.screenshot({ path: path.join(artifacts, 'rep-set-timer-' + engine + '-' + name + '.png') });
const DAY = 864e5;

function fixture() {
  const data = baseFixture();
  data.log = []; data.programs = {}; data.field = {};
  Object.assign(data.settings, { sound: true, vibration: true, planDates: {}, matchDates: {}, matchDay: -1, morningChecks: {}, transSec: 10, switchSec: 5, playerGuideSeen: true });
  data.protocols = {
    [id]: { id, name: 'Serije na ponavljanja', tag: 'Teretana', days: [], items: [
      // 8 reps at the generic 3 s: 24 s estimate, counts up
      { exId: 'back-squat', measure: 'sets', sets: 3, reps: 8, kg: 100, rest: 30, sides: false },
      // 6 reps per side, played as two steps (18 s each)
      { exId: 'bugarski', measure: 'sets', sets: 1, reps: 6, kg: 14, rest: 0, sides: true },
      // his own set timer: counts down and ends by itself
      { exId: 'bench-press', measure: 'sets', sets: 1, reps: 8, kg: 60, rest: 0, sides: false, repSetSec: 20 },
      // a hold: counts down and ends by itself
      { exId: 'side-plank', measure: 'time', sets: 1, reps: 1, sec: 6, kg: 0, rest: 0, sides: false }
    ] },
    [again]: { id: again, name: 'Naučeni tempo', tag: 'Teretana', days: [], items: [
      { exId: 'nordic-curl', measure: 'sets', sets: 1, reps: 5, kg: 0, rest: 0, sides: false }
    ] }
  };
  // two earlier sessions timed the nordic curl: 30 s and 36 s for 5 reps → 6 s and 7.2 s per rep, median 6.6 s
  data.log = [1, 2].map(k => ({ historyId: 'rep-set-timer-' + k, kind: 'protocol', refId: again, name: 'Naučeni tempo', at: Date.parse('2026-11-01T18:00:00+01:00') + k * DAY, secs: 600,
    items: [{ exId: 'nordic-curl', measure: 'sets', sets: 1, reps: 5, kg: 0, sides: false, done: true, setsDone: 1, sideCounts: [1], setNumbers: [1], durList: [k === 1 ? 30 : 36] }] }));
  return data;
}
async function advance(p, seconds) {
  await p.clock.setFixedTime(new Date(await p.evaluate(() => Date.now()) + seconds * 1000));
  await p.waitForTimeout(350);
}
async function start(p, protocol, data) {
  await p.evaluate(() => localStorage.removeItem('mt.play'));
  await p.reload({ waitUntil: 'domcontentloaded' });
  await A(p, 'dataSheet').waitFor();
  await A(p, 'dataSheet').click();
  await p.locator('#importFile').setInputFiles({ name: 'rep-set-timer.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(data)) });
  await A(p, 'restoreApply').click(); await A(p, 'restoreApply').waitFor({ state: 'hidden' });
  await p.getByRole('button', { name: 'Moj pregled', exact: true }).click();
  await A(p, 'dashboardProtocols').click();
  await p.locator('[data-a="openPr"][data-id="' + protocol + '"]').click();
  await A(p, 'startPr').click();
  await stage(p).waitFor();
}
// runs timed steps out until the current step is work of item g (side: 'Lijeva strana' / 'Desna strana')
async function reach(p, g, kind, side) {
  for (let guard = 0; guard < 20; guard++) {
    const state = await player(p), st = step(state);
    if (st.g === g && st.kind === kind && (!side || st.side === side)) return state;
    assert.ok(st.kind !== 'manual', 'a rep set never ends by itself: ' + JSON.stringify(st));
    await advance(p, (state.left || 1) + 0.1);
  }
  assert.fail('item ' + g + ' ' + kind + ' never came');
}
const clock = p => p.locator('.workout-cinema-clock #ringN').innerText();
const fill = async p => Number(await p.locator('#cinema-clock-fill').getAttribute('data-count'));
// every cue: a tone (sound) and a vibration
const buzzes = p => p.evaluate(() => window.feedbackAudit.vibrations.length + window.feedbackAudit.tones.length);
// the top bar: the dot's place along the dashes and the percent of finished sets
const progress = p => p.evaluate(() => {
  const bar = document.querySelector('.workout-cinema .cinema-dashes'), current = bar.querySelector('i.is-current');
  return { current: [...bar.children].indexOf(current), at: Number(current?.style.getPropertyValue('--at')), value: Number(bar.getAttribute('aria-valuenow')),
    percent: document.getElementById('cinema-percent').textContent };
});
function forward(path) {
  for (let k = 1; k < path.length; k++) assert.ok(path[k].current + path[k].at >= path[k - 1].current + path[k - 1].at - 1e-6, 'the dot never moves back: ' + JSON.stringify(path));
}
async function markDone(p) {
  await p.locator('.workout-cinema .cinema-work-mark[data-a="workoutSetDone"]').click();
  await p.waitForTimeout(150);
}
async function noOverflow(p, label) {
  const d = await p.evaluate(() => {
    const sheet = document.querySelector('.sheet');
    return { viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth,
      sheet: sheet ? [sheet.scrollWidth, sheet.clientWidth] : null };
  });
  assert.ok(d.document <= d.viewport && d.body <= d.viewport && (!d.sheet || d.sheet[0] <= d.sheet[1] + 1), 'no horizontal overflow · ' + label + ': ' + JSON.stringify(d));
}
// the set rows' second line of one open journal card
async function detailRows(p, j) {
  return p.locator('.cj-card[data-index="' + j + '"] .workout-set-details td:last-child').evaluateAll(cells => cells.map(cell => {
    const line = cell.querySelector('.workout-set-duration'), shown = line?.querySelector('[aria-hidden="true"]'), spoken = line?.querySelector('.workout-sr');
    const box = line?.getBoundingClientRect(), td = cell.getBoundingClientRect();
    return { text: cell.innerText.replace(/\s+/g, ' ').trim(), shown: shown?.textContent || null, spoken: spoken?.textContent || null,
      fontSize: line ? getComputedStyle(line).fontSize : null, fits: !box || box.right <= td.right + .5 && box.right <= innerWidth,
      spokenHidden: !spoken || spoken.getBoundingClientRect().width <= 1 };
  }));
}

async function countUp(p, width) {
  await start(p, id, fixture());
  await reach(p, 0, 'manual');
  // the rep set starts at 0:00 with an empty arc and counts up
  assert.equal(await clock(p), '0:00');
  assert.equal(await fill(p), 0);
  assert.equal(await p.locator('.workout-cinema-clock .workout-control-action').count(), 0, 'no caption while it runs');
  await shot(p, 'start-' + width);
  const before = await buzzes(p), dot = [await progress(p)];
  assert.equal(dot[0].percent, '0%');
  await advance(p, 6);
  assert.equal(await clock(p), '0:06');
  assert.equal(await fill(p), 8, 'a quarter of the 24 s estimate: 8 of 31 bars');
  dot.push(await progress(p));
  await advance(p, 6);
  assert.equal(await clock(p), '0:12');
  assert.equal(await fill(p), 16);
  dot.push(await progress(p));
  assert.ok(dot[1].at > dot[0].at && dot[2].at > dot[1].at, '1.22.1: the dot moves with the arc while the set counts up: ' + JSON.stringify(dot));
  await shot(p, 'mid-' + width);
  // past the estimate: the arc stays full, the digits go on, nothing ends the set
  await advance(p, 12);
  const full = await progress(p);
  await advance(p, 8);
  assert.equal(await clock(p), '0:32');
  assert.equal(await fill(p), 31);
  dot.push(full, await progress(p));
  assert.ok(full.at > dot[2].at, JSON.stringify(dot));
  assert.deepEqual(dot.at(-1), full, 'past the estimate the dot waits at the set\'s end (and no set is counted)');
  let state = await player(p);
  assert.equal(step(state).kind, 'manual', 'no automatic end at the estimate');
  assert.equal(Object.keys(state.doneSteps).length, 0);
  assert.equal(await buzzes(p), before, 'no countdown or end cue (tone or vibration) for a set that counts up');
  await shot(p, 'past-' + width);
  // pauses do not count
  await A(p, 'cinemaTimer').first().click();
  assert.equal((await player(p)).stepClock.paused, true);
  await advance(p, 30);
  assert.equal(await clock(p), '0:32');
  await p.locator('.cinema-pause-layer [data-a="cinemaResume"]').click();
  await advance(p, 3);
  assert.equal(await clock(p), '0:35');
  dot.push(await progress(p));
  await markDone(p);
  // his tap: the set counts in the percent and the dot goes on from where it waited
  dot.push(await progress(p));
  forward(dot);
  assert.notEqual(dot.at(-1).percent, '0%', 'the finished set counts: ' + JSON.stringify(dot.at(-1)));
  state = await player(p);
  const first = state.liveSchedule.findIndex(x => x.kind === 'manual' && x.g === 0 && x.set === 1);
  assert.equal(state.liveSchedule[first].actualDur, 35, 'the real time without the pause');
  assert.equal(state.liveSchedule[first].targetSec, 24);
  assert.equal(step(state).kind, 'rest');
  // set 2: a forgotten tap (100 s > max(60 s, 3 × 24 s))
  await reach(p, 0, 'manual');
  await advance(p, 100);
  assert.equal(await clock(p), '1:40');
  assert.equal(step(await player(p)).kind, 'manual');
  await markDone(p);
  assert.equal(step(await player(p)).kind, 'rest');
  // set 3: marked in the journal, which holds the clock: not timed live, so no duration
  await reach(p, 0, 'manual');
  await advance(p, 20);
  await A(p, 'cinemaJournal').first().click(); await journal(p).waitFor();
  await journal(p).locator('.cj-card[data-index="0"] [data-a="workoutSetDone"]').click();
  await journal(p).waitFor({ state: 'detached' });
  state = await player(p);
  const sets = state.liveSchedule.filter(x => x.kind === 'manual' && x.g === 0);
  assert.deepEqual(sets.map(x => x.actualDur ?? null), [35, 100, null], 'the raw times; the journal tap has none');
  // the sided set: both sides count up and add up
  await reach(p, 1, 'manual', 'Lijeva strana');
  assert.equal(await clock(p), '0:00');
  await advance(p, 20); await markDone(p);
  await reach(p, 1, 'manual', 'Desna strana');
  await advance(p, 22); await markDone(p);
  // the journal: the duration on the done rows' second line, read out as "trajanje … s"
  await A(p, 'cinemaJournal').first().click(); await journal(p).waitFor();
  await journal(p).locator('.cj-row[data-j="1"]').click();
  await journal(p).locator('.cj-card[data-index="1"]').waitFor();
  const sided = await detailRows(p, 1);
  assert.equal(sided.length, 1);
  assert.equal(sided[0].shown, '0:42');
  assert.equal(sided[0].spoken, 'trajanje 42 s');
  assert.match(sided[0].text, /lijeva · .*desna · 0:42/);
  assert.equal(sided[0].fontSize, '13px');
  assert.ok(sided[0].fits && sided[0].spokenHidden, JSON.stringify(sided[0]));
  await journal(p).locator('.cj-row[data-j="0"]').click();
  await journal(p).locator('.cj-card[data-index="0"]').waitFor();
  const squat = await detailRows(p, 0);
  assert.deepEqual(squat.map(row => [row.shown, row.spoken]), [['0:35', 'trajanje 35 s']], 'set 2 was over the guard, set 3 untimed: no line');
  assert.equal(await p.locator('.cj-card[data-index="0"] .workout-set-details').count(), 1, 'sets 2 and 3 have no line');
  await noOverflow(p, 'journal ' + width);
  await shot(p, 'journal-' + width);
  await A(p, 'cinemaJournalClose').first().click(); await journal(p).waitFor({ state: 'detached' });
  // his own set timer: a countdown that ends by itself, with the countdown cue
  state = await reach(p, 2, 'manual');
  assert.equal(await clock(p), '0:20');
  const cues = await buzzes(p);
  await advance(p, 10);
  assert.equal(await clock(p), '0:10');
  const tones = await p.evaluate(() => window.feedbackAudit.tones.length);
  for (let k = 0; k < 9; k++) await advance(p, 1);
  assert.ok(await buzzes(p) > cues, 'the set timer counts down its last seconds');
  assert.ok(await p.evaluate(() => window.feedbackAudit.tones.length) > tones, 'with a tone too (sound is on)');
  await advance(p, 1.2);
  state = await player(p);
  assert.ok(!(step(state).g === 2 && step(state).kind === 'manual'), 'the set timer ends the set by itself');
  // the hold counts down and ends by itself
  state = await reach(p, 3, 'work');
  assert.equal(await clock(p), '0:06');
  await advance(p, 3);
  assert.equal(await clock(p), '0:03');
  await advance(p, 3.2);
  await A(p, 'finishPlay').waitFor();
  await A(p, 'finishPlay').click();
  const logged = (await store(p)).log.find(entry => entry.refId === id).items;
  assert.deepEqual(logged[0].durList, [35, null, null], 'the real duration; null over the guard and when not timed live');
  assert.deepEqual(logged[1].durList, [42], 'both sides added up');
  assert.deepEqual(logged[1].sideCounts, [2]);
  assert.equal(logged[2].durList, undefined, 'a set with its own timer saves no duration');
  assert.equal(logged[3].durList, undefined, 'a hold saves no duration');
  return { countsUp: true, arcFullPastEstimate: true, noAutoEnd: true, noCues: true, pauseExcluded: true, durList: logged[0].durList, sided: logged[1].durList, guard: true, journalLine: true, setTimerCountsDown: true, holdCountsDown: true };
}

async function learned(p, width) {
  await start(p, again, fixture());
  const state = await reach(p, 0, 'manual');
  // 5 reps at his median 6.6 s instead of the generic 3 s
  assert.equal(step(state).targetSec, 33);
  await advance(p, 11);
  assert.equal(await clock(p), '0:11');
  assert.equal(await fill(p), 10, 'a third of his 33 s');
  return { learnedTarget: step(state).targetSec };
}

async function run() {
  const server = await serve();
  let browser;
  const results = [];
  try {
    browser = await launch();
    for (const [width, height, scenarios] of [[393, 852, [countUp, learned]], [375, 812, [countUp]]]) {
      const context = await browser.newContext({ viewport: { width, height }, isMobile: true, hasTouch: true, locale: 'hr-HR', timezoneId: 'Europe/Zagreb', reducedMotion: 'reduce', serviceWorkers: 'block' });
      // every cue is recorded: vibrations and the tones of a stand-in AudioContext (as in player-feedback)
      await context.addInitScript(() => {
        const audit = window.feedbackAudit = { vibrations: [], tones: [] };
        Object.defineProperty(navigator, 'vibrate', { configurable: true, value: pattern => { audit.vibrations.push(pattern); return true; } });
        window.AudioContext = class {
          state = 'suspended'; currentTime = 0; destination = {};
          resume() { this.state = 'running'; return Promise.resolve(); }
          createOscillator() { return { frequency: { value: 0 }, connect() {}, start() { audit.tones.push(this.frequency.value); }, stop() {} }; }
          createGain() { return { gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {} }; }
        };
      });
      const p = await context.newPage(), errors = [];
      p.on('pageerror', error => errors.push(error.message));
      p.setDefaultTimeout(8000);
      await p.clock.setFixedTime(new Date('2026-11-06T10:00:00+01:00'));
      try {
        await p.goto(server.url, { waitUntil: 'domcontentloaded' });
        for (const scenario of scenarios) results.push({ scenario: scenario.name, width, ...await scenario(p, width) });
        assert.deepEqual(errors, [], 'no page errors');
      } catch (error) {
        await shot(p, 'failure-' + width).catch(() => {});
        console.error('Current screen:', (await p.locator('.view,.sheet').allInnerTexts().catch(() => [])).join('\n').slice(0, 1500));
        throw error;
      } finally { await context.close(); }
    }
    console.log(JSON.stringify({ engine, passed: true, results }));
  } finally {
    if (browser) await browser.close();
    await server.close();
  }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
