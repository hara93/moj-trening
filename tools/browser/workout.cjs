'use strict';
const {openJournal,closeJournal,openQuit,openCinemaControls,pressCinemaMain}=require('./runtime.cjs');

// Isolated synthetic workouts; never opens an existing browser profile.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const MuscleWork = require('../../muscle-work.js');
const History = require('../../history-model.js');
const { artifacts, engine, fixture: baseFixture, launch, serve } = require('./runtime.cjs');

const ids = {
  protocol: 'workout-audit', replacement: 'workout-db-press', similar: 'workout-band-press', hold: 'workout-side-hold',
  program: 'workout-frozen', frozen: 'workout-program', clock: 'workout-clock', missing: 'workout-missing'
};
const fixed = new Date('2026-11-04T10:00:00+01:00');
const action = (page, name) => page.locator('[data-a="' + name + '"]');
const detailAction = (page, name) => page.locator('.workout-exercise-page [data-a="' + name + '"]');
const variantAction = page => page.locator('.workout-exercise-page [data-a="workoutSwap"],.workout-exercise-page [data-a="workoutUndoSwap"]');
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
  data.exercises[ids.similar] = {
    ...data.exercises[ids.replacement], id: ids.similar, name: 'Sličan potisak s užetom', equip: ['Elastično uže'],
    muscles: { prime: ['front_chest', 'back_triceps'], sec: [] }
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
    id: ids.protocol, name: 'Kontrolni trening sa zamjenom', tag: 'Teretana', days: [], items,
    desc: 'Kontrolni opis protokola ostaje vidljiv uz izvorni veliki prikaz.'
  };
  data.protocols[ids.clock] = {
    id: ids.clock, name: 'Samo aktivno trajanje', days: [], tag: 'Teretana',
    items: [{ ...items[0], ss: null, rest: 0, repsList: [5, 5], kgList: [20, 20] }]
  };
  data.protocols[ids.missing] = {
    id: ids.missing, name: 'Nepoznata težina u sredini', days: [], tag: 'Teretana',
    items: [{ ...items[0], ss: null, sets: 3, repsList: [5, 5, 5], kg: 0, kgList: [10, null, 0] }]
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
  if (await page.locator('.workout-cinema').count()) await openJournal(page, true);
  const button = page.locator((await page.locator('.sheet[data-kind="cinemaJournal"]').count() ? '.cj-open' : '') + '[data-a="workoutExercise"][data-j="' + index + '"]').first();   // 1.22.0: the card's name
  await button.focus();
  await page.keyboard.press('Enter');
  await page.locator('.workout-exercise-page').waitFor();
  return page.locator('.workout-exercise-page');
}

async function closeSheet(page) {
  await page.keyboard.press('Escape');
  await closeJournal(page);
  await page.getByRole('dialog').waitFor({ state: 'hidden' });
}

async function advance(page, seconds) {
  const current = await page.evaluate(() => Date.now());
  await page.clock.setFixedTime(new Date(current + seconds * 1000));
  await page.waitForTimeout(320);
}

async function resume(page, reload = true) {
  if (reload) await page.reload();
  await action(page, 'resumeGo').click();
  const continueTimer = page.locator('#ring[data-a="cinemaTimer"][aria-label="Nastavi brojač"]');
  if (await continueTimer.isVisible()) await continueTimer.click();
}

async function completeManual(page) {
  await closeJournal(page);
  const current = await player(page);
  assert.equal(current.liveSchedule[current.i].kind, 'manual', 'Visible primary action completes the current manual set');
  await openCinemaControls(page);
  const primary = page.locator('.sheet[data-kind="cinemaPlayback"] .cinema-primary[data-a="cinemaMain"]');
  assert.equal(await primary.innerText(), 'Serija gotova');
  await primary.click();
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
  await openQuit(page);
  await action(page, 'quitDiscard').click();
}

const doseField = (page, set, key) => page.locator('.workout-exercise-page .workout-set-table input[data-set="' + set + '"][data-field="' + key + '"]');

async function inline(page, set, field, value) {
  const input = doseField(page, set, field);
  await input.fill(String(value));
  await input.press('Tab');
}

async function replacement(page, index, id, equipment) {
  await exercise(page, index);
  await detailAction(page, 'workoutSwap').click();
  await page.locator('#workout-equipment').selectOption({ label: equipment });
  await byId(page, 'workoutCandidate', id).click();
  await page.locator('.workout-exercise-page').waitFor();
  assert.equal(await page.locator('#play-dose-form').count(), 0, 'replacement is immediate, without a second confirmation form');
}

async function swapPresentation(page) {
  await openProtocol(page);
  await exercise(page, 0);
  await detailAction(page, 'workoutSwap').click();
  const sheet = page.getByRole('dialog', { name: 'Zamijeni vježbu' });
  const body = sheet.locator('.workout-swap-body');
  const search = sheet.getByRole('searchbox', { name: 'Pretraži zamjene' });
  const candidate = byId(page, 'workoutCandidate', ids.similar);
  const original = await store(page);
  assert.equal(await sheet.locator('.workout-swap-hero button').getAttribute('data-id'), 'bench-press');
  assert.ok(await sheet.locator('.workout-swap-hero img').isVisible());
  assert.ok(await sheet.getByRole('heading', { name: 'Preporuke' }).isVisible());
  assert.ok(await sheet.getByRole('heading', { name: 'Slične vježbe' }).isVisible());   // 1.22.0: heading of the mockup
  // 1.22.0: small thumbnails carry no (i); ▶ only for an exercise with a video (its label says so)
  assert.deepEqual(await sheet.locator('.workout-swap-row .workout-swap-photo').evaluateAll(list => list.filter(b => !!b.querySelector('.workout-swap-preview-icon') !== /sa snimkom/.test(b.getAttribute('aria-label'))).map(b => b.dataset.id)), []);
  // 1.22.0: the search pill is opaque and the last row scrolls fully above it
  await body.evaluate(node => { node.scrollTop = node.scrollHeight; });
  const lastRow = await sheet.locator('.workout-swap-row').last().boundingBox(), pill = await sheet.locator('.workout-swap-search').boundingBox();
  assert.ok(lastRow.y + lastRow.height <= pill.y, 'the last row ends above the search: ' + JSON.stringify({ lastRow, pill }));
  assert.match(await sheet.locator('.workout-swap-search').evaluate(node => getComputedStyle(node).backgroundColor), /^rgb\(/);
  await body.evaluate(node => { node.scrollTop = 0; });
  assert.equal(await sheet.locator('.workout-swap-recommended [data-id="' + ids.similar + '"]').count(), 0);
  const fixedSearch = await search.boundingBox();
  await candidate.scrollIntoViewIfNeeded();
  assert.equal((await search.boundingBox()).y, fixedSearch.y, 'search stays fixed while results scroll');
  assert.ok(await body.evaluate(node => node.scrollTop > 0));
  await page.locator('#workout-muscle').selectOption({ label: 'Triceps' });
  await page.locator('#workout-equipment').selectOption({ label: 'Elastično uže' });
  await page.locator('#workout-pattern').selectOption('U1');
  await search.fill('slican uzetom');
  assert.equal(await sheet.locator('[data-a="workoutCandidate"]').count(), 1);
  assert.equal(await candidate.count(), 1);
  await search.fill('nema rezultata');
  assert.ok(await sheet.getByRole('heading', { name: 'Nema odgovarajuće zamjene' }).isVisible());
  await search.fill('slican');
  const preview = byId(page, 'workoutSwapPreview', ids.similar);
  await preview.click();
  assert.ok(await page.getByRole('dialog', { name: 'Pregled vježbe' }).getByRole('heading', { name: 'Sličan potisak s užetom' }).isVisible());
  await page.getByRole('button', { name: 'Natrag na zamjene' }).click();
  assert.equal(await search.inputValue(), 'slican');
  assert.equal(await page.locator('#workout-pattern').inputValue(), 'U1');
  assert.ok(await preview.evaluate(node => node === document.activeElement));
  await body.evaluate(node => {
    node.scrollTop = 0;
    const send = (type, touches) => {
      const event = new Event(type, { bubbles: true, cancelable: true });
      Object.defineProperty(event, 'touches', { value: touches });
      node.dispatchEvent(event);
    };
    send('touchstart', [{ identifier: 1, clientX: 120, clientY: 200 }]);
    send('touchmove', [{ identifier: 1, clientX: 120, clientY: 350 }]);
    send('touchend', []);
  });
  await sheet.waitFor({ state: 'hidden' });
  assert.deepEqual(await store(page), original, 'preview and swipe dismissal leave the plan and history intact');
  results.push({ label: 'swap-presentation', actualRecommendations: true, filtersAndSearch: true, previewBackRestores: true, touchDismisses: true });
}

async function savePartial(page) {
  await openQuit(page);
  await action(page, 'quitSave').click();
  if (await action(page, 'finishPlay').isVisible()) await action(page, 'finishPlay').click();
  await page.locator('.workout-cinema').waitFor({ state: 'hidden' });
}

async function panelBack(page) {
  await action(page, 'workoutPanelBack').click();
  await page.locator('.workout-exercise-page').waitFor();
}

async function target(page, value) {
  const options = page.locator('.workout-plan-options');
  if (!await options.evaluate(node => node.open)) await options.locator('summary').click();
  await page.locator('#workout-target').selectOption(String(value));
}

async function noSliders(page) {
  assert.equal(await page.locator('#swrow,#swdots,#play-card-row,.play-card-tabs').count(), 0);
}

async function draftIsolation(page) {
  await openProtocol(page);
  await action(page, 'startPr').click();
  await advance(page, 6);
  await exercise(page, 0);
  await refuseStorage(page, 'mt.play', true);
  await inline(page, 1, 'reps', 99);
  assert.equal(await doseField(page, 1, 'reps').inputValue(), '99');
  assert.equal((await player(page)).items[0].repsList[0], 5);
  await refuseStorage(page, 'mt.play', false);
  await closeSheet(page);
  await discardPlayer(page);
  // No reload: a discarded player's failed draft must not contaminate the next.
  await action(page, 'startPr').click();
  await openJournal(page, true);
  await page.locator('.workout-journal').waitFor();
  assert.equal(await page.locator('.workout-journal input[data-j="0"][data-set="1"][data-field="reps"]').inputValue(), '5');
  assert.equal((await player(page)).items[0].repsList[0], 5);
  await discardPlayer(page);
  results.push({ label: 'draft-isolation', discardedRaw99DoesNotReplaceStored5: true });
}

async function missingWeight(page) {
  await openProtocol(page, ids.missing);
  await exercise(page, 0);
  assert.deepEqual(await page.locator('.workout-exercise-page input[data-field="kg"]').evaluateAll(inputs => inputs.map(input => input.value)), ['10', '', '0']);
  await inline(page, 2, 'reps', 7);
  assert.deepEqual(await page.locator('.workout-exercise-page input[data-field="kg"]').evaluateAll(inputs => inputs.map(input => input.value)), ['10', '', '0']);
  await closeSheet(page);
  await action(page, 'startPr').click();
  await page.locator('#starting-load-form').waitFor();
  assert.equal(await player(page), null);
  await closeSheet(page);
  results.push({ label: 'unknown-weight', unrelatedRepetitionEditPreservesNullAndKnownZero: true });
}

async function pendingWeight(page, baseline) {
  await openProtocol(page);
  await action(page, 'startPr').click();
  await exercise(page, 0);
  await detailAction(page, 'workoutEquipment').click();
  await byId(page, 'workoutQuickCandidate', 'db-bench-press').click();
  assert.equal((await player(page)).items[0].exId, 'bench-press');
  assert.equal(await doseField(page, 1, 'kg').inputValue(), '');
  await page.keyboard.press('Escape');
  assert.ok(await page.locator('.workout-exercise-page').isVisible());
  assert.match(await page.locator('.workout-exercise-page').innerText(), /Unesi težinu|prije nastavka/i);
  await action(page, 'workoutCancelPending').click();
  assert.equal(await doseField(page, 1, 'kg').inputValue(), '20');
  await detailAction(page, 'workoutEquipment').click();
  await byId(page, 'workoutQuickCandidate', 'db-bench-press').click();
  await inline(page, 1, 'kg', '17,5');
  assert.equal((await player(page)).items[0].exId, 'bench-press');
  await refuseStorage(page, 'mt.play', true);
  await inline(page, 2, 'kg', 19);
  assert.equal(await doseField(page, 2, 'kg').inputValue(), '19');
  assert.equal((await player(page)).items[0].exId, 'bench-press');
  await refuseStorage(page, 'mt.play', false);
  await doseField(page, 2, 'kg').press('Enter');
  assert.equal((await player(page)).items[0].exId, 'db-bench-press');
  assert.deepEqual((await player(page)).items[0].kgList, [17.5, 19]);
  assert.equal(await action(page, 'workoutCancelPending').count(), 0);
  await closeSheet(page);
  await discardPlayer(page);
  assert.deepEqual((await store(page)).protocols[ids.protocol].items, baseline.items);
  results.push({ label: 'live-pending-weight', oldIdentityUntilAllWeightsKnown: true, escapeDoesNotResumeUnknownLoad: true, cancelRestoresOriginal: true, quotaRetryKeepsInputs: true });
}

async function activeDuration(page) {
  await openProtocol(page, ids.clock);
  await action(page, 'startPr').click();
  await advance(page, 10);
  const timer = page.locator('#ring[data-a="cinemaTimer"]');
  const stepBeforePause = (await player(page)).i;
  await timer.click();
  assert.equal(await page.locator('.workout-cinema.is-paused').count(), 1);
  assert.equal(await timer.getAttribute('aria-label'), 'Nastavi brojač');
  assert.match(await timer.locator('.workout-control-action').innerText(), /pauza/);
  await openCinemaControls(page);
  assert.equal(await page.locator('.sheet[data-kind="cinemaPlayback"] .cinema-primary').innerText(), 'Nastavi');
  await action(page,'cinemaClose').click();
  await page.keyboard.press('Escape');
  await advance(page, 4);
  assert.equal((await player(page)).clock.seconds, 10);
  assert.equal((await player(page)).i, stepBeforePause, 'Timer pause does not complete a manual set');
  await timer.click();
  assert.equal(await page.locator('.workout-cinema.is-paused').count(), 0);
  assert.equal(await timer.getAttribute('aria-label'), 'Pauziraj brojač');
  await exercise(page, 0);
  assert.equal((await player(page)).clock.seconds, 10);
  await advance(page, 120);
  assert.equal((await player(page)).clock.seconds, 10);
  await closeSheet(page);
  await advance(page, 5);
  await completeManual(page);
  assert.equal((await player(page)).clock.seconds, 15);
  const afterManual = await player(page);
  if (afterManual.liveSchedule[afterManual.i].kind === 'ready') await pressCinemaMain(page);
  await openQuit(page);
  await advance(page, 60);
  await action(page, 'quitResume').click();
  assert.equal((await player(page)).clock.seconds, 15);
  await advance(page, 3);
  await openQuit(page);
  await action(page, 'quitResume').click();
  assert.equal((await player(page)).clock.seconds, 18);
  // Leave first: pagehide saves the real checkpoint before time away begins.
  // Moving Date while the app is still open would correctly count active time.
  const beforeAway = await page.evaluate(() => Date.now());
  const appUrl = page.url();
  await page.goto('about:blank');
  await page.clock.setFixedTime(new Date(beforeAway + 3600000));
  await page.goto(appUrl);
  await resume(page, false);
  assert.equal((await player(page)).clock.seconds, 18);
  await advance(page, 2);
  await completeManual(page);
  await action(page, 'finishPlay').click();
  const saved = (await store(page)).log.find(row => row.refId === ids.clock);
  assert.ok(saved);
  assert.equal(saved.secs, 20);
  results.push({ label: 'active-duration', activeSeconds: 20, editorSecondsExcluded: 120, pauseSecondsExcluded: 60, timerPauseSecondsExcluded: 4, timerDoesNotCompleteSet: true, timeAwayExcluded: 3600 });
}

async function infoAndHistory(page) {
  await page.locator('.workout-detail-cover [data-a="workoutInfo"]').click();
  const info = page.locator('.workout-instructions-body');
  await info.waitFor();
  assert.ok(await info.locator('.workout-muscle-figure svg').count());
  assert.match(await info.locator('.workout-muscle-key').innerText(), /Glavni|Primarni/i);
  assert.match(await info.locator('.workout-muscle-key').innerText(), /Pomoćni|Sekundarni/i);
  const shades = await info.locator('.workout-muscle-figure').evaluate(node => {
    const brightness = selector => {
      const style = getComputedStyle(node.querySelector(selector));
      const color = style.fill.match(/[\d.]+/g).map(Number);
      const alpha = Number(style.fillOpacity) * Number(style.opacity) * (color.length > 3 ? color[3] : 1);
      return color.slice(0, 3).reduce((sum, channel) => sum + alpha * channel + (1 - alpha) * 255, 0);
    };
    return { primary: brightness('.body-muscle-fill.is-prime'), secondary: brightness('.body-muscle-fill.is-on') };
  });
  assert.ok(shades.primary < shades.secondary, 'primary muscles appear darker than secondary: ' + JSON.stringify(shades));
  await noOverflow(page, '.workout-exercise-panel', 'instructions-320');
  await screenshot(page, 'instructions-320');
  await panelBack(page);
  await detailAction(page, 'workoutHistory').click();
  const previous = page.locator('.workout-previous-table tbody tr');
  assert.equal(await previous.count(), 3);
  const cells = await previous.evaluateAll(rows => rows.map(row => Array.from(row.querySelectorAll('th,td'), cell => cell.textContent.trim())));
  assert.deepEqual(cells[0], ['1', '4 pon.', '20', '2 RIR']);
  assert.deepEqual(cells[1], ['2', '—', '—', '—']);
  assert.equal(await previous.nth(1).locator('[aria-label="Nije zabilježeno"]').count(), 3);
  assert.deepEqual(cells[2], ['3', '3 pon.', '25', '1 RIR']);
  await screenshot(page, 'history-320');
  await panelBack(page);
  await detailAction(page, 'workoutTrends').click();
  await page.locator('.workout-trends-body').waitFor();
  assert.ok(await page.locator('.workout-chart').count());
  await panelBack(page);
}

async function library(page) {
  await home(page);
  assert.equal(await page.locator('#car .hcard .cov').count(), 5);
  assert.equal(await action(page, 'homeGuide').count(), 0);
  await page.getByRole('button', { name: 'Knjižnica vježbi', exact: true }).click();
  await byId(page, 'openEx', 'bench-press').click();
  const detail = page.locator('.workout-exercise-page');
  await detail.waitFor();
  assert.equal(await detail.getAttribute('data-context'), 'library');
  await noSliders(page);
  assert.ok(await detail.locator('.workout-set-table tbody .workout-set-row').count());
  assert.ok(await doseField(page, 1, 'rir').isDisabled());
  assert.equal(await doseField(page, 1, 'rir').inputValue(), '');
  const source = (await store(page)).exercises['bench-press'];
  await inline(page, 1, 'reps', 6);
  assert.deepEqual((await store(page)).exercises['bench-press'], source);
  await noOverflow(page, '.workout-exercise-page', 'library-375');
}

async function preview(page, baseline) {
  await openProtocol(page);
  assert.equal(await page.locator('.workout-compact-row[data-a="workoutExercise"]').count(), 2);
  assert.match(await page.locator('.workout-overview').innerText(), /Kontrolni opis protokola/);
  assert.equal(await page.locator('.workout-overview .workout-set-table').count(), 0);
  for (const width of [375, 320]) {
    await page.setViewportSize({ width, height: 850 });
    await noOverflow(page, '.workout-overview', 'overview-' + width);
    await screenshot(page, 'overview-' + width);
  }
  const detail = await exercise(page, 0);
  assert.equal(await detail.getAttribute('data-context'), 'preview');
  assert.equal(await detail.locator('.workout-set-row').count(), 2);
  assert.equal(await doseField(page, 1, 'reps').inputValue(), '5');
  assert.equal(await doseField(page, 2, 'kg').inputValue(), '30');
  assert.ok(await doseField(page, 1, 'rir').isDisabled());
  assert.equal(await doseField(page, 1, 'rir').inputValue(), '');
  await noSliders(page);
  await infoAndHistory(page);
  await inline(page, 1, 'reps', 7);
  await inline(page, 1, 'kg', 22);
  assert.deepEqual((await store(page)).protocols[ids.protocol], baseline);
  await closeSheet(page);

  // The equipment pill offers a real named variant and changes it immediately.
  await openProtocol(page);
  await exercise(page, 0);
  await detailAction(page, 'workoutEquipment').click();
  await byId(page, 'workoutQuickCandidate', 'db-bench-press').click();
  assert.match(await detail.innerText(), /Potisak bučicama/);
  assert.equal(await doseField(page, 1, 'kg').inputValue(), '');
  assert.equal(await page.locator('#play-dose-form').count(), 0);
  assert.deepEqual((await store(page)).protocols[ids.protocol], baseline);
  await closeSheet(page);

  await openProtocol(page);
  await replacement(page, 0, ids.replacement, 'Bučice');
  assert.equal(await doseField(page, 1, 'reps').inputValue(), '9');
  assert.equal(await doseField(page, 1, 'kg').inputValue(), '');
  assert.equal(await doseField(page, 2, 'kg').inputValue(), '');
  await inline(page, 1, 'reps', 8);
  await inline(page, 2, 'reps', 6);
  await target(page, 2);
  assert.equal(await doseField(page, 1, 'rir').inputValue(), '');
  await screenshot(page, 'exercise-320');
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
  await refuseStorage(page, 'mt.play', false);
  await starting.locator('button[type="submit"]').click();
  await page.locator('.workout-cinema,[data-a=quitPlay]').waitFor();
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
  await noSliders(page);
  await advance(page, 6);
  await completeManual(page);
  await exercise(page, 0);
  assert.ok(await variantAction(page).isDisabled());
  assert.ok(await doseField(page, 1, 'kg').isDisabled());
  assert.equal(await doseField(page, 1, 'rir').inputValue(), '');
  await inline(page, 1, 'rir', 1);
  await closeSheet(page);
  await savePartial(page);
  const saved = (await store(page)).log.find(row => row.historyId !== 'workout-previous');
  assert.equal(saved.items[0].exId, ids.replacement);
  assert.deepEqual(History.recordedRows(saved.items[0]).map(row => [row.reps, row.kg, row.rir]), [[8, 17.5, 1]]);
  assert.equal(saved.items[0].targetRir, 2);
  const snapshot = MuscleWork.sanitize(saved.muscleWork[0]);
  assert.equal(snapshot.exerciseId, ids.replacement);
  assert.deepEqual(snapshot.secondary, MuscleWork.profile(fixture().exercises[ids.replacement]).secondary);
  assert.deepEqual((await store(page)).protocols[ids.protocol].items, baseline.items);
  results.push({ label: 'preview-replacement', compactOverview: true, directEquipmentVariant: true, previousUnknownPreserved: true, sourceUnchanged: true, firstCheckpointRetry: true, resumed: true, actual: [8, 17.5], targetRir: 2, actualRir: 1 });
}

async function live(page, baseline) {
  await openProtocol(page);
  await action(page, 'startPr').click();
  await page.locator('.workout-cinema,[data-a=quitPlay]').waitFor();
  await noSliders(page);
  await openJournal(page, true);
  assert.equal(await page.locator('.cinema-journal .cj-card').count(), 2);   // 1.22.0: "Prikaži sve" opens every exercise as a card
  assert.equal(await page.locator('.workout-journal .workout-set-row').count(), 4);
  await closeJournal(page);
  await advance(page, 6);
  await exercise(page, 0);
  assert.equal(await variantAction(page).isDisabled(), false, 'an untouched current manual set remains replaceable');
  await inline(page, 1, 'reps', 6);
  await inline(page, 1, 'kg', 22);
  assert.equal((await player(page)).liveSchedule.filter(step => step.kind === 'manual' && step.g === 0 && step.set === 1).length, 1);
  await closeSheet(page);
  await replacement(page, 1, ids.hold, 'Bez opreme');
  assert.equal((await player(page)).items[1].exId, ids.hold);
  await refuseStorage(page, 'mt.play', true);
  await inline(page, 1, 'sec', 7);
  assert.equal(await doseField(page, 1, 'sec').inputValue(), '7');
  const beforeRetry = (await player(page)).items[1];
  assert.equal(Object.hasOwn(beforeRetry, 'secList') ? beforeRetry.secList[0] : beforeRetry.sec, 6);
  assert.match(await page.locator('.toast').innerText(), /nije spremljena/i);
  await refuseStorage(page, 'mt.play', false);
  await doseField(page, 1, 'sec').press('Enter');
  assert.equal((await player(page)).items[1].secList[0], 7);
  await inline(page, 2, 'sec', 9);
  await closeSheet(page);
  const replaced = await player(page);
  assert.deepEqual(replaced.items[1].secList, [7, 9]);
  assert.equal(replaced.items[1].ss, baseline.items[1].ss);
  assert.equal(replaced.items[1].rest, baseline.items[1].rest);
  await resume(page);
  await completeManual(page);
  for (let attempt = 0; attempt < 15; attempt++) {
    const current = await player(page), step = current.liveSchedule[current.i];
    if (step?.kind === 'work' && step.g === 1) break;
    if (step.kind === 'ready') await pressCinemaMain(page); else await advance(page, 2);
  }
  const working = await player(page);
  assert.equal(working.liveSchedule[working.i].kind, 'work');
  await exercise(page, 1);
  assert.ok(await variantAction(page).isDisabled());
  const paused = await player(page);
  await detailAction(page, 'workoutHistory').click();
  await advance(page, 30);
  assert.equal((await player(page)).i, paused.i);
  assert.equal((await player(page)).left, paused.left);
  await panelBack(page);
  await closeSheet(page);
  assert.equal(await page.locator('#ring[data-a="cinemaTimer"]').getAttribute('aria-label'), 'Pauziraj brojač');
  await advance(page, paused.left + 0.2);
  await savePartial(page);
  const saved = (await store(page)).log.find(row => row.items?.[1]?.exId === ids.hold);
  assert.ok(saved);
  assert.deepEqual(History.recordedRows(saved.items[0]).map(row => [row.reps, row.kg]), [[6, 22]]);
  assert.deepEqual(History.recordedRows(saved.items[1]).map(row => [row.sec, row.sides]), [[7, 1]]);
  const contribution = MuscleWork.sanitize(saved.muscleWork[1]);
  assert.equal(contribution.exerciseId, ids.hold);
  assert.equal(contribution.completedSets, 0);
  assert.deepEqual(contribution.secondary, MuscleWork.profile(fixture().exercises[ids.hold]).secondary);
  assert.deepEqual((await store(page)).protocols[ids.protocol].items, baseline.items);
  results.push({ label: 'live-inline-replacement', refusedWriteRetainsDraft: true, enterRetriesSameValue: true, currentManualNotDuplicated: true, resumed: true, actualSeconds: 7, actualSides: 1, fullBilateralSets: 0, historyPausesTimer: true });
}

async function frozen(page) {
  await openProtocol(page, ids.frozen);
  const baseline = (await store(page)).protocols[ids.frozen];
  await exercise(page, 0);
  assert.ok(await variantAction(page).isDisabled());
  assert.ok(await doseField(page, 1, 'reps').isDisabled());
  assert.ok(await doseField(page, 1, 'kg').isDisabled());
  await closeSheet(page);
  await action(page, 'startPr').click();
  await page.locator('.workout-cinema,[data-a=quitPlay]').waitFor();
  await exercise(page, 1);
  assert.ok(await variantAction(page).isDisabled());
  assert.equal(await doseField(page, 1, 'sec').isDisabled(), false);
  await inline(page, 1, 'sec', 11);
  assert.deepEqual((await player(page)).items[1].secList, [11, 8]);
  await closeSheet(page);
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
  await swapPresentation(page);
  const baseline = (await store(page)).protocols[ids.protocol];
  await draftIsolation(page);
  await library(page);
  await preview(page, baseline);
  await missingWeight(page);
  await live(page, baseline);
  await pendingWeight(page, baseline);
  await frozen(page);
  await activeDuration(page);
}

module.exports = { fixture, ids };
if (require.main === module) main().catch(error => { console.error(error); process.exitCode = 1; });
