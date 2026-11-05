'use strict';

// Isolated synthetic workouts; never opens an existing browser profile.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const MuscleWork = require('../../muscle-work.js');
const History = require('../../history-model.js');
const { artifacts, engine, fixture: baseFixture, launch, serve } = require('./runtime.cjs');

const ids = {
  protocol: 'workout-audit', replacement: 'workout-db-press', hold: 'workout-side-hold',
  program: 'workout-frozen', frozen: 'workout-program'
};
const fixed = new Date('2026-11-04T10:00:00+01:00');
const action = (page, name) => page.locator('[data-a="' + name + '"]');
const byId = (page, name, id) => page.locator('[data-a="' + name + '"][data-id="' + id + '"]');
const store = page => page.evaluate(() => JSON.parse(localStorage.getItem('mt.data.v1')));
const player = page => page.evaluate(() => JSON.parse(localStorage.getItem('mt.play')));
const results = [];

function fixture() {
  const data = baseFixture();
  data.settings.sound = false;
  data.settings.planDates = {};
  data.settings.matchDates = {};
  data.settings.matchDay = -1;
  for (const protocol of Object.values(data.protocols)) protocol.days = [];
  data.exercises[ids.replacement] = {
    ...data.exercises['bench-press'], id: ids.replacement, name: 'Kontrolni potisak bučicama',
    equip: ['Bučice'], equipment: 'Dvije bučice', movementPattern: 'U1', sets: 3, reps: 9, kg: 0,
    muscles: { prime: ['front_chest'], sec: ['back_triceps'] },
    muscleWorkEligible: true, media: null, mediaType: null
  };
  data.exercises[ids.hold] = {
    ...data.exercises['side-plank'], id: ids.hold, name: 'Kontrolni bočni upor',
    equip: ['Bez opreme'], equipment: 'Bez dodatne opreme', movementPattern: 'C', sets: 3, sec: 6, kg: 0, sides: true,
    muscles: { prime: ['front_obliques'], sec: ['front_abs'] },
    muscleWorkEligible: true, media: null, mediaType: null
  };
  const items = [
    { exId: 'bench-press', measure: 'sets', sets: 2, reps: 5, kg: 20,
      repsList: [5, 3], kgList: [20, 30], rest: 0, sides: false, ss: 'pair', section: 'Glavni dio' },
    { exId: 'side-plank', measure: 'time', sets: 2, reps: 1, sec: 12,
      secList: [12, 8], kg: 0, rest: 10, sides: true, ss: 'pair', section: 'Glavni dio' }
  ];
  data.protocols[ids.protocol] = {
    id: ids.protocol, name: 'Kontrolni trening sa zamjenom', tag: 'Teretana', days: [], items
  };
  data.protocols[ids.frozen] = {
    id: ids.frozen, name: 'Programska doza ostaje zadana', program: ids.program,
    days: [], items: JSON.parse(JSON.stringify(items))
  };
  data.programs[ids.program] = {
    id: ids.program, name: 'Kontrolni zaštićeni program', days: [],
    weeks: [{ week: 1, sessions: [{ label: 'A', pr: ids.frozen }] }]
  };
  const previousItems = [
    { ...items[0], sets: 3, setsDone: 3, done: true, repsList: [4, null, 3],
      kgList: [20, null, 25], rirList: [2, null, 1], sideCounts: [1, 1, 1], setNumbers: [1, 2, 3] },
    { ...items[1], setsDone: 1, done: true, secList: [10], kgList: [0],
      sirList: [3], sideCounts: [1], setNumbers: [1] }
  ];
  data.log = [{
    historyId: 'workout-previous', kind: 'protocol', refId: ids.protocol,
    name: 'Prethodno stvarno odrađeno', at: Date.parse('2026-11-03T18:00:00+01:00'),
    secs: 600, srpe: 6, items: previousItems,
    muscleWork: previousItems.map(item => MuscleWork.pack(MuscleWork.completedItem(data.exercises[item.exId], item)))
  }];
  return data;
}

async function home(page) {
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Bok, Tomislav', exact: true }).waitFor();
}

async function importData(page) {
  await home(page);
  await action(page, 'dataSheet').click();
  await page.locator('#importFile').setInputFiles({
    name: 'workout-synthetic.json', mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(fixture()))
  });
  await action(page, 'restoreApply').click();
  await action(page, 'restoreApply').waitFor({ state: 'hidden' });
}

async function protocols(page) {
  await home(page);
  await page.getByRole('button', { name: 'Moj pregled', exact: true }).click();
  await action(page, 'dashboardProtocols').first().click();
}

async function openProtocol(page, id = ids.protocol) {
  await protocols(page);
  if (id === ids.frozen) await byId(page, 'openProg', ids.program).click();
  await byId(page, 'openPr', id).first().click();
  await page.locator('.workout-overview').waitFor();
}

async function exercise(page, index) {
  const button = page.locator('[data-a="workoutExercise"][data-j="' + index + '"]').first();
  await button.focus();
  await page.keyboard.press('Enter');
  await page.locator('.workout-exercise-panel').waitFor();
  return page.locator('.workout-exercise-panel');
}

async function closeSheet(page) {
  await page.keyboard.press('Escape');
  await page.getByRole('dialog').waitFor({ state: 'hidden' });
}

async function advance(page, seconds) {
  const current = await page.evaluate(() => Date.now());
  await page.clock.setFixedTime(new Date(current + seconds * 1000));
  await page.waitForTimeout(320);
}

async function resume(page) {
  await page.reload();
  await action(page, 'resumeGo').click();
  const continueTimer = page.getByRole('button', { name: 'Nastavi', exact: true });
  if (await continueTimer.isVisible()) await continueTimer.click();
}

async function noOverflow(page, scope, label) {
  const dimensions = await page.locator(scope).evaluate(node => ({
    viewport: innerWidth, document: document.documentElement.scrollWidth,
    content: node.scrollWidth, available: node.clientWidth
  }));
  assert.ok(dimensions.document <= dimensions.viewport + 1 && dimensions.content <= dimensions.available + 1,
    label + ': ' + JSON.stringify(dimensions));
  results.push({ label, ...dimensions });
}

async function screenshot(page, name) {
  await page.locator('.toast').waitFor({ state: 'hidden', timeout: 10000 });
  await page.screenshot({ path: path.join(artifacts, 'workout-' + engine + '-' + name + '.png') });
}

async function refuseStorage(page, key, refuse) {
  await page.evaluate(({ key, refuse }) => {
    window.workoutOriginalSetItem ||= Storage.prototype.setItem;
    Storage.prototype.setItem = refuse ? function (name, value) {
      if (name === key) throw new DOMException('Synthetic storage refusal', 'QuotaExceededError');
      return window.workoutOriginalSetItem.call(this, name, value);
    } : window.workoutOriginalSetItem;
  }, { key, refuse });
}

async function discardPlayer(page) {
  await action(page, 'quitPlay').click();
  await action(page, 'quitDiscard').click();
}

const doseField = (page, set, key) => page.locator('#play-dose-form [data-dose-set="' + set + '"] [data-dose-value="' + key + '"]');

async function replacement(page, index, id, equipment) {
  await exercise(page, index);
  await action(page, 'workoutSwap').click();
  await page.locator('#workout-equipment').selectOption({ label: equipment });
  await byId(page, 'workoutCandidate', id).click();
  await page.locator('#play-dose-form').waitFor();
}

async function savePartial(page) {
  await action(page, 'quitPlay').click();
  await action(page, 'quitSave').click();
  if (await action(page, 'finishPlay').isVisible()) await action(page, 'finishPlay').click();
  await action(page, 'quitPlay').waitFor({ state: 'hidden' });
}

async function preview(page, baseline) {
  await openProtocol(page);
  assert.equal(await page.locator('.workout-exercise[data-index]').count(), 2);
  const sets = page.locator('.pre-sets .set-item');
  assert.equal(await sets.count(), 4);
  assert.equal(await action(page, 'toggleDosePlan').count(), 0);
  for (const row of await sets.all()) assert.ok(await row.isVisible());
  assert.match(await sets.nth(0).innerText(), /5 pon.*20 kg/);
  assert.match(await sets.nth(1).innerText(), /3 pon.*30 kg/);
  for (const width of [375, 320]) {
    await page.setViewportSize({ width, height: 850 });
    await noOverflow(page, '.workout-overview', 'overview-' + width);
    await page.locator('.workout-overview').scrollIntoViewIfNeeded();
    await screenshot(page, 'overview-' + width);
  }
  const panel = await exercise(page, 0);
  const previous = panel.locator('.workout-previous-table tbody tr');
  assert.equal(await previous.count(), 3);
  const cells = await previous.evaluateAll(rows => rows.map(row => Array.from(row.querySelectorAll('th,td'), cell => cell.textContent.trim())));
  assert.deepEqual(cells[0], ['1', '4 pon.', '20', '2 RIR']);
  assert.deepEqual(cells[1], ['2', '—', '—', '—']);
  assert.equal(await previous.nth(1).locator('[aria-label="Nije zabilježeno"]').count(), 3);
  assert.match(await panel.locator('.workout-previous').innerText(), /Nije zabilježeno/i);
  assert.deepEqual(cells[2], ['3', '3 pon.', '25', '1 RIR']);
  await noOverflow(page, '.workout-exercise-panel', 'exercise-sheet-320');
  await screenshot(page, 'exercise-320');
  await panel.locator('.workout-previous').scrollIntoViewIfNeeded();
  await screenshot(page, 'previous-320');
  await action(page, 'workoutHistory').click();
  assert.ok(await panel.locator('.workout-previous .lc').count());
  await action(page, 'workoutHistory').click();
  await action(page, 'workoutEdit').click();
  await doseField(page, 1, 'reps').fill('7');
  await doseField(page, 1, 'kg').fill('22');
  await action(page, 'playDoseCancel').click();
  assert.match(await sets.nth(0).innerText(), /5 pon.*20 kg/);
  await exercise(page, 0);
  await action(page, 'workoutEdit').click();
  await doseField(page, 1, 'reps').fill('7');
  await doseField(page, 1, 'kg').fill('22');
  await action(page, 'playDoseApply').click();
  await page.locator('#play-dose-form').waitFor({ state: 'hidden' });
  assert.match(await sets.nth(0).innerText(), /7 pon.*22 kg/);
  assert.deepEqual((await store(page)).protocols[ids.protocol], baseline);
  await exercise(page, 1);
  assert.match(await panel.locator('.workout-previous').innerText(), /1\s*(?:od|\/)\s*2|jedna strana|jedne strane|djelomič/i);
  await closeSheet(page);

  await replacement(page, 0, ids.replacement, 'Bučice');
  assert.equal(await page.locator('#play-dose-sets').inputValue(), '2');
  assert.equal(await doseField(page, 1, 'reps').inputValue(), '9');
  assert.equal(await doseField(page, 1, 'kg').inputValue(), '');
  assert.equal(await doseField(page, 2, 'kg').inputValue(), '');
  await action(page, 'workoutClose').click();
  assert.match(await page.locator('.workout-overview').innerText(), /Bench press/);
  assert.deepEqual((await store(page)).protocols[ids.protocol], baseline);
  await replacement(page, 0, ids.replacement, 'Bučice');
  await doseField(page, 1, 'reps').fill('8');
  await doseField(page, 2, 'reps').fill('6');
  await action(page, 'workoutReplaceApply').click();
  await page.locator('#play-dose-form').waitFor({ state: 'hidden' });
  assert.match(await page.locator('.workout-overview').innerText(), /Kontrolni potisak bučicama/);
  assert.deepEqual((await store(page)).protocols[ids.protocol], baseline);
  await exercise(page, 0);
  await page.locator('#workout-target').selectOption('2');
  await closeSheet(page);
  await action(page, 'startPr').click();
  const starting = page.locator('#starting-load-form');
  await starting.waitFor();
  assert.equal(await player(page), null);
  await starting.locator('button[type="submit"]').click();
  assert.match(await page.locator('#start-weight-error').innerText(), /Provjeri/);
  await starting.locator('input').fill('17,5');
  await refuseStorage(page, 'mt.play', true);
  await starting.locator('button[type="submit"]').click();
  assert.match(await page.locator('#start-weight-error').innerText(), /Trening nije spremljen/i);
  assert.equal(await starting.locator('input').inputValue(), '17,5');
  assert.equal(await player(page), null);
  assert.equal(await action(page, 'quitPlay').count(), 0);
  assert.deepEqual((await store(page)).protocols[ids.protocol], baseline);
  await refuseStorage(page, 'mt.play', false);
  await starting.locator('button[type="submit"]').click();
  await action(page, 'quitPlay').waitFor();
  const prepared = await player(page);
  assert.equal(prepared.items[0].exId, ids.replacement);
  assert.deepEqual(prepared.items[0].repsList, [8, 6]);
  assert.deepEqual(prepared.items[0].kgList, [17.5, 17.5]);
  assert.equal(prepared.items[0].targetRir, 2);
  assert.deepEqual(prepared.rir || {}, {});
  assert.deepEqual(prepared.originalItems, baseline.items);
  assert.deepEqual((await store(page)).protocols[ids.protocol], baseline);
  assert.equal((await store(page)).exercises[ids.replacement].kg, 0);
  await resume(page);
  assert.equal((await player(page)).items[0].exId, ids.replacement);
  await page.locator('.play-card-tabs [data-i="2"]').click();
  await advance(page, 6);
  await page.locator('[data-a="checklistDone"][data-j="0"][data-set="1"]').click();
  await page.locator('[data-a="rir"][data-v="1"]').first().click();
  await savePartial(page);
  const saved = (await store(page)).log.find(row => row.historyId !== 'workout-previous');
  assert.equal(saved.items[0].exId, ids.replacement);
  assert.deepEqual(History.recordedRows(saved.items[0]).map(row => [row.reps, row.kg]), [[8, 17.5]]);
  assert.equal(saved.items[0].targetRir, 2);
  assert.equal(History.recordedRows(saved.items[0])[0].rir, 1);
  const snapshot = MuscleWork.sanitize(saved.muscleWork[0]);
  assert.equal(snapshot.exerciseId, ids.replacement);
  assert.deepEqual(snapshot.secondary, MuscleWork.profile(fixture().exercises[ids.replacement]).secondary);
  assert.deepEqual((await store(page)).protocols[ids.protocol].items, baseline.items);
  results.push({ label: 'preview-replacement', previousUnknownPreserved: true, sourceUnchanged: true, firstCheckpointRefusalRetainsInputs: true, resumed: true, actual: [8, 17.5], targetRir: 2, actualRir: 1 });
}

async function live(page, baseline) {
  await openProtocol(page);
  await action(page, 'startPr').click();
  await action(page, 'quitPlay').waitFor();
  await page.locator('.play-card-tabs [data-i="2"]').click();
  await advance(page, 6);
  await exercise(page, 0);
  assert.equal(await action(page, 'workoutSwap').count(), 0, 'current exercise cannot be replaced');
  await closeSheet(page);
  await replacement(page, 1, ids.hold, 'Bez opreme');
  await doseField(page, 1, 'sec').fill('7');
  await doseField(page, 2, 'sec').fill('9');
  await refuseStorage(page, 'mt.play', true);
  await action(page, 'workoutReplaceApply').click();
  assert.match(await page.locator('.play-dose-error').innerText(), /nije spremljena/i);
  assert.equal(await doseField(page, 1, 'sec').inputValue(), '7');
  assert.equal((await player(page)).items[1].exId, 'side-plank');
  await refuseStorage(page, 'mt.play', false);
  await action(page, 'workoutReplaceApply').click();
  await page.locator('#play-dose-form').waitFor({ state: 'hidden' });
  const replaced = await player(page);
  assert.equal(replaced.items[1].exId, ids.hold);
  assert.deepEqual(replaced.items[1].secList, [7, 9]);
  assert.equal(replaced.items[1].ss, baseline.items[1].ss);
  assert.equal(replaced.items[1].rest, baseline.items[1].rest);
  await resume(page);
  assert.equal((await player(page)).items[1].exId, ids.hold);
  await page.locator('.play-card-tabs [data-i="2"]').click();
  await page.locator('[data-a="checklistDone"][data-j="0"][data-set="1"]').click();
  for (let attempt = 0; attempt < 15; attempt++) {
    const current = await player(page), step = current.liveSchedule[current.i];
    if (step?.kind === 'work' && step.g === 1) break;
    const start = page.getByRole('button', { name: 'Kreni', exact: true });
    if (await start.isVisible()) await start.click(); else await advance(page, 2);
  }
  const working = await player(page);
  assert.equal(working.liveSchedule[working.i].kind, 'work');
  await exercise(page, 1);
  assert.equal(await action(page, 'workoutSwap').count(), 0, 'started timed exercise cannot be replaced');
  const paused = await player(page);
  await action(page, 'workoutHistory').click();
  await advance(page, 30);
  assert.equal((await player(page)).i, paused.i);
  assert.equal((await player(page)).left, paused.left);
  await closeSheet(page);
  assert.ok(await page.getByRole('button', { name: 'Pauziraj', exact: true }).isVisible());
  await advance(page, paused.left + 0.2);
  await savePartial(page);
  const saved = (await store(page)).log.find(row => row.items?.[1]?.exId === ids.hold);
  assert.ok(saved);
  assert.deepEqual(History.recordedRows(saved.items[1]).map(row => [row.sec, row.sides]), [[7, 1]]);
  const contribution = MuscleWork.sanitize(saved.muscleWork[1]);
  assert.equal(contribution.exerciseId, ids.hold);
  assert.equal(contribution.completedSets, 0);
  assert.deepEqual(contribution.secondary, MuscleWork.profile(fixture().exercises[ids.hold]).secondary);
  assert.equal(saved.items[1].liveDoseChanged, true);
  assert.deepEqual((await store(page)).protocols[ids.protocol].items, baseline.items);
  results.push({ label: 'live-replacement', refusedWriteRetainsDraft: true, resumed: true, actualSeconds: 7, actualSides: 1, fullBilateralSets: 0, historyPausesTimer: true });
}

async function frozen(page) {
  await openProtocol(page, ids.frozen);
  const baseline = (await store(page)).protocols[ids.frozen];
  await exercise(page, 0);
  assert.equal(await action(page, 'workoutSwap').count(), 0);
  assert.ok(await action(page, 'workoutEdit').isDisabled());
  await closeSheet(page);
  assert.equal(await action(page, 'previewDoseEdit').count(), 0);
  await action(page, 'startPr').click();
  await action(page, 'quitPlay').waitFor();
  await page.locator('.play-card-tabs [data-i="2"]').click();
  await exercise(page, 1);
  assert.equal(await action(page, 'workoutSwap').count(), 0);
  assert.equal(await action(page, 'workoutEdit').isDisabled(), false);
  await action(page, 'workoutEdit').click();
  await doseField(page, 1, 'sec').fill('11');
  await action(page, 'playDoseApply').click();
  await page.locator('#play-dose-form').waitFor({ state: 'hidden' });
  assert.deepEqual((await player(page)).items[1].secList, [11, 8]);
  assert.equal(await action(page, 'playDoseEdit').count(), 2, 'live dose adjustment remains available for a program');
  assert.deepEqual((await store(page)).protocols[ids.frozen], baseline);
  await discardPlayer(page);
  assert.deepEqual((await store(page)).protocols[ids.frozen], baseline);
  results.push({ label: 'frozen-program', replacementBlocked: true, previewDoseEditingBlocked: true, liveDoseEditable: true, sourceUnchanged: true });
}

async function main() {
  const host = await serve();
  let browser;
  try {
    browser = await launch();
    const context = await browser.newContext({
      viewport: { width: 375, height: 850 }, locale: 'hr-HR', timezoneId: 'Europe/Zagreb',
      hasTouch: true, isMobile: true, reducedMotion: 'reduce', serviceWorkers: 'block'
    });
    const page = await context.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.setDefaultTimeout(6000);
    await page.clock.setFixedTime(fixed);
    try {
      await page.goto(host.url, { waitUntil: 'domcontentloaded' });
      await importData(page);
      await runScenarios(page);
      assert.deepEqual(errors, []);
      console.log(JSON.stringify({ engine, results }, null, 2));
    } catch (error) {
      await screenshot(page, 'failure').catch(() => {});
      console.error('View:', (await page.locator('.view').allInnerTexts()).join('\n').slice(0, 1800));
      console.error('Dialog:', await page.getByRole('dialog').allInnerTexts());
      throw error;
    } finally {
      await context.close();
    }
  } finally {
    if (browser) await browser.close();
    await host.close();
    fs.writeFileSync(path.join(artifacts, 'workout-' + engine + '.json'), JSON.stringify(results, null, 2));
  }
}

async function runScenarios(page) {
  const baseline = (await store(page)).protocols[ids.protocol];
  await preview(page, baseline);
  await live(page, baseline);
  await frozen(page);
}

module.exports = { fixture, ids };
if (require.main === module) main().catch(error => { console.error(error); process.exitCode = 1; });
