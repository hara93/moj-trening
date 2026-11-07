'use strict';

// Synthetic local data only. AU, body-model points and muscle credits are
// deliberately different so one measure cannot silently substitute another.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const MuscleWork = require('../../muscle-work.js');
const { artifacts, engine, fixture: baseFixture, launch, serve } = require('./runtime.cjs');

const fixed = new Date('2026-11-04T12:00:00+01:00');
const stamp = (date, hour = 10) => new Date(date + 'T' + hour + ':00:00+01:00').getTime();
const action = (page, name) => page.locator('[data-a="' + name + '"]');
const results = [];
const protocolId = 'training-load-strength';

function fixture(empty = false) {
  const data = baseFixture();
  data.settings.sound = false;
  data.settings.planDates = {};
  data.settings.matchDates = {};
  data.settings.matchDay = -1;
  data.settings.morningChecks = { '2026-11-04': { date: '2026-11-04', energy: 4, legs: 2, pain: 0 } };
  for (const protocol of Object.values(data.protocols)) protocol.days = [];
  const items = [
    { exId: 'bench-press', measure: 'sets', sets: 2, reps: 5, kg: 20, rest: 30, sides: false,
      done: true, setsDone: 2, repsList: [5, 3], kgList: [20, 30], rirList: [2, 1], setNumbers: [1, 2], sideCounts: [1, 1] },
    { exId: 'side-plank', measure: 'time', sets: 2, reps: 1, sec: 12, kg: 0, rest: 10, sides: true,
      done: true, setsDone: 2, secList: [12, 8], sirList: [5, 5], setNumbers: [1, 2], sideCounts: [2, 2] }
  ];
  data.protocols[protocolId] = {
    id: protocolId, name: 'Opterećenje · isti stvarni rad', tag: 'Teretana', days: [],
    desc: 'Kontrolni protokol za provjeru stvarne izvedbe i zasebnih mjera opterećenja.',
    items: JSON.parse(JSON.stringify(items)).map(item => {
      for (const key of ['done', 'setsDone', 'rirList', 'sirList', 'setNumbers', 'sideCounts']) delete item[key];
      return item;
    })
  };
  const gym = (historyId, date, secs, srpe) => ({
    historyId, kind: 'protocol', refId: protocolId, name: 'Poznati trening ' + date,
    at: stamp(date), secs, srpe, items: JSON.parse(JSON.stringify(items)),
    muscleWork: items.map(item => MuscleWork.pack(MuscleWork.completedItem(data.exercises[item.exId], item))),
    // Deliberately not AU: the physical model must remain an independent measure.
    load2: { ...baseFixture().log[0].load2, B: 24.3, au: 999 }
  });
  data.log = empty ? [] : [
    gym('tl-today', '2026-11-04', 180, 7),                         // 21 AU
    { historyId: 'tl-zero', kind: 'team', teamType: 'training', name: 'Izričito nulti napor', at: stamp('2026-11-04', 11), secs: 60, srpe: 0 },
    { historyId: 'tl-team', kind: 'team', teamType: 'training', name: 'Momčadski trening', at: stamp('2026-11-03', 18), secs: 1800, srpe: 6 }, // 180 AU
    { historyId: 'tl-field', kind: 'field', refId: 'intervali-15-15', name: 'Teren s nepotpunim brzinama', at: stamp('2026-11-02'), secs: 600, srpe: 5,
      load: { m: 1000, min: 10 }, fieldLoadStatus: 'partial', load2Status: 'needsFieldData' }, // 50 AU remains known
    { historyId: 'tl-legacy', kind: 'protocol', name: 'Stari sažetak bez trajanja i napora', at: stamp('2026-11-01'), archived: true },
    { historyId: 'tl-unrated', kind: 'team', teamType: 'match', name: 'Utakmica bez ocjene', at: stamp('2026-10-31'), secs: 600 },
    gym('tl-boundary', '2026-10-30', 88, 7),                        // 10.266667 AU; do not round duration first
    gym('tl-before-one', '2026-10-28', 180, 7),
    gym('tl-before-two', '2026-10-21', 360, 7),
    gym('tl-future', '2026-11-05', 600, 10),
    { historyId: 'tl-trial', kind: 'exercise', refId: 'bench-press', name: 'Proba iz knjižnice nije drugi trening', at: stamp('2026-11-04'), secs: 60, srpe: 10,
      items: [{ ...items[0], sets: 1, setsDone: 1, repsList: [99], kgList: [20], sideCounts: [1], setNumbers: [1] }] }
  ];
  return data;
}

function periodFixture() {
  const data = fixture();
  const protocol = data.log.find(row => row.historyId === 'tl-today');
  for (const [date, minutes] of [['2026-10-14', 9], ['2026-09-10', 18], ['2026-07-15', 24]]) {
    data.log.push({ ...protocol, historyId: 'tl-period-' + date, name: 'Poznati trening ' + date,
      at: stamp(date), secs: minutes * 60, srpe: 5 });
  }
  return data;
}

async function home(page) {
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Bok, Tomislav', exact: true }).waitFor();
}

async function importData(page, data) {
  await home(page);
  await action(page, 'dataSheet').click();
  await page.locator('#importFile').setInputFiles({
    name: 'training-load-synthetic.json', mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(data))
  });
  await action(page, 'restoreApply').click();
  await action(page, 'restoreApply').waitFor({ state: 'hidden' });
}

async function loadView(page) {
  await home(page);
  await page.locator('.tab[data-tab="analytics"]').click();
  if (await page.locator('.pg-cinema').count()) await page.locator('[data-a="analyticsMode"][data-v="load"]').click();
  await page.locator('.view.training-load').waitFor();
}

async function period(page, name) {
  return page.locator('[data-load-period="' + name + '"]').evaluate(node => ({ ...node.dataset }));
}

async function layout(page, width, label) {
  await page.setViewportSize({ width, height: 850 });
  const bounds = await page.locator('.view').evaluate(node => ({
    viewport: innerWidth, document: document.documentElement.scrollWidth,
    content: node.scrollWidth, available: node.clientWidth
  }));
  assert.ok(bounds.document <= bounds.viewport + 1 && bounds.content <= bounds.available + 1,
    label + ': ' + JSON.stringify(bounds));
  results.push({ label, ...bounds });
}

async function screenshot(page, name, section) {
  await page.locator('.toast').waitFor({ state: 'hidden', timeout: 10000 });
  await page.locator('.view.training-load').evaluate((node, selector) => {
    node.scrollTop = selector ? node.scrollTop + node.querySelector(selector).getBoundingClientRect().top - node.getBoundingClientRect().top - 10 : 0;
  }, section || null);
  await page.screenshot({ path: path.join(artifacts, 'training-load-' + engine + '-' + name + '.png') });
}

function closeNumber(actual, expected, label) {
  assert.ok(Number.isFinite(Number(actual)) && Math.abs(Number(actual) - expected) < 0.000002,
    label + ': ' + actual + ' expected ' + expected);
}

async function openHistory(page, id) {
  await home(page);
  await page.getByRole('button', { name: 'Moj pregled', exact: true }).click();
  await action(page, 'historyList').click();
  await page.locator('[data-a="historyOpen"][data-id="' + id + '"]').click();
  await action(page, 'historyEdit').waitFor();
}

async function changeRating(page, value) {
  await action(page, 'historyEdit').click();
  await page.locator('[data-history-meta="srpe"]').fill(String(value));
  await action(page, 'historySave').click();
  await action(page, 'historyEdit').waitFor();
}

async function expectation(page) {
  await home(page);
  await page.getByRole('button', { name: 'Moj pregled', exact: true }).click();
  await action(page, 'dashboardProtocols').first().click();
  await page.locator('[data-a="openPr"][data-id="' + protocolId + '"]').click();
  await action(page, 'workoutProtocolOptions').click();
  return page.locator('[data-load-expectation]').evaluate(node => ({ ...node.dataset }));
}

async function backup(page) {
  await home(page);
  await action(page, 'dataSheet').click();
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('dialog').locator('[data-a="exportData"]').click()
  ]);
  const file = path.join(artifacts, 'training-load-' + engine + '-backup.json');
  await download.saveAs(file);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

async function main() {
  const host = await serve();
  let browser;
  try {
    browser = await launch();
    const context = await browser.newContext({
      viewport: { width: 375, height: 850 }, locale: 'hr-HR', timezoneId: 'Europe/Zagreb',
      reducedMotion: 'reduce', serviceWorkers: 'block'
    });
    await context.addInitScript(() => {
      Object.defineProperty(navigator, 'canShare', { configurable: true, value: () => false });
    });
    const page = await context.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.setDefaultTimeout(6000);
    await page.clock.setFixedTime(fixed);
    try {
      await page.goto(host.url, { waitUntil: 'domcontentloaded' });
      await runScenarios(page);
      await runPeriodScenario(page);
      assert.deepEqual(errors, []);
      console.log(JSON.stringify({ engine, results }, null, 2));
    } catch (error) {
      await screenshot(page, 'failure').catch(() => {});
      console.error('View:', (await page.locator('.view').allInnerTexts()).join('\n').slice(0, 1800));
      throw error;
    } finally { await context.close(); }
  } finally {
    if (browser) await browser.close();
    await host.close();
    fs.writeFileSync(path.join(artifacts, 'training-load-' + engine + '.json'), JSON.stringify(results, null, 2));
  }
}

async function runScenarios(page) {
  await importData(page, fixture(true));
  await loadView(page);
  const cold = await period(page, 'current');
  assert.equal(cold.sessions, '0');
  assert.equal(cold.knownAu, '0');
  assert.equal(cold.totalAu, '');
  assert.match(await page.locator('[data-load-metric="current-au"]').innerText(), /—/);
  assert.equal(await page.locator('.tl-dial-segment').count(), 0);
  await layout(page, 320, 'cold-320');
  await screenshot(page, 'cold-320');
  const noSamples = await expectation(page);
  assert.equal(noSamples.status, 'insufficient');
  assert.equal(noSamples.sampleCount, '0');

  await importData(page, fixture());
  await loadView(page);
  const current = await period(page, 'current'), baseline = await period(page, 'baseline');
  assert.equal(current.sessions, '7');
  assert.equal(current.missingAu, '2');
  assert.equal(current.totalAu, '');
  closeNumber(current.knownAu, 261.266667, 'known subtotal from exact seconds and reported ratings');
  assert.match(await page.locator('[data-load-metric="current-au"]').innerText(), /—/);
  assert.equal(baseline.sessions, '2');
  assert.equal(baseline.activeWeeks, '2');
  closeNumber(baseline.knownAu, 63, 'previous 28 days');
  closeNumber(baseline.weeklyAverageAu, 15.75, 'recorded four-week average');
  const effortSummary=page.locator('.tl-effort-total');
  await effortSummary.click();
  assert.equal(await page.locator('#training-load-info').evaluate(node=>node.open),true);
  assert.equal(await page.locator('#training-load-info-title').innerText(),'Napor treninga');
  const dialog = page.locator('#training-load-info');
  const closeButton = dialog.locator('.tl-dialog-head [data-a="trainingLoadInfoClose"]');
  assert.equal(await closeButton.evaluate(node => document.activeElement === node), true,
    'opening the sheet by pointer focuses the header close control instead of the grip');
  assert.equal(await closeButton.evaluate(node => getComputedStyle(node).outlineStyle), 'none', 'pointer open shows no focus frame');
  await page.keyboard.press('Escape');
  assert.equal(await dialog.evaluate(node=>node.open),false);
  assert.equal(await effortSummary.evaluate(node=>node===document.activeElement),true);
  await page.keyboard.press('Enter');
  assert.notEqual(await closeButton.evaluate(node => getComputedStyle(node).outlineStyle), 'none', 'keyboard open keeps visible focus');
  const grip = dialog.locator('.sheet-drag-handle');
  assert.equal(await grip.evaluate(node => node.tabIndex), 0, 'the sheet grip stays in the tab order');
  await grip.press('Enter');
  assert.equal(await dialog.evaluate(node => node.open), false, 'the focused grip dismisses the sheet by keyboard');
  assert.equal(await effortSummary.evaluate(node => document.activeElement === node), true);
  assert.equal(await page.locator('svg.tl-days').getAttribute('role'),'img');
  assert.match(await page.locator('svg.tl-days').getAttribute('aria-label'),/AU poznato/);
  const boundary = page.locator('[data-load-day="2026-10-30"]');
  closeNumber(await boundary.getAttribute('data-total-au'), 10.266667, '88 seconds × 7 / 60');
  const arcs = page.locator('.tl-dial-segment');
  assert.deepEqual(await arcs.evaluateAll(nodes => nodes.map(node => node.dataset.loadRingKind)), ['protocol', 'field', 'team']);
  const colors = await arcs.evaluateAll(nodes => nodes.map(node => getComputedStyle(node).stroke));
  assert.equal(new Set(colors).size, 3, 'each recorded activity uses its own accent');
  assert.match(await effortSummary.innerText(), /261,3\s*AU poznato/);
  assert.match(await page.locator('.tl-kind-row[data-load-ring-kind="match"]').innerText(), /Nepoznato/);
  await page.locator('[data-a="trainingLoadDetail"][data-topic="day"][data-date="2026-10-30"]').click();
  assert.ok(await page.locator('[data-load-day-detail="2026-10-30"]').isVisible());
  assert.match(await page.locator('#training-load-info-body').innerText(),/Protokoli/);
  await page.keyboard.press('Escape');
  const musclesRow=page.locator('[data-a="trainingLoadDetail"][data-topic="muscles"]');
  await musclesRow.click();
  const chest=page.locator('#training-load-info [data-load-group="chest"]');
  assert.equal(await chest.getAttribute('data-direct'),'4');assert.equal(await chest.getAttribute('data-equivalent'),'4');
  assert.ok(await chest.locator('.muscle-meter-direct').isVisible());
  const muscleDetails=page.locator('#training-load-info [data-load-section="muscles"] details');
  await muscleDetails.locator('summary').click();
  const triceps=muscleDetails.locator('tbody tr').filter({has:page.getByRole('rowheader',{name:'Triceps',exact:true})});
  assert.ok(await triceps.locator('.muscle-meter-secondary').isVisible());
  assert.deepEqual(await triceps.locator('th,td').allTextContents(),['Triceps','0','4','2']);
  await page.keyboard.press('Escape');
  assert.equal(await musclesRow.evaluate(node=>node===document.activeElement),true);
  assert.ok(await page.locator('.tl-checkin[data-load-section="readiness"]').isVisible());
  for(const width of [375,320]){await layout(page,width,'mixed-'+width);await screenshot(page,'mixed-'+width);}
  await musclesRow.click();await page.screenshot({path:path.join(artifacts,'training-load-'+engine+'-muscles-320.png')});await page.keyboard.press('Escape');
  await page.locator('.tl-checkin').click();
  assert.match(await page.locator('#training-load-info .tl-readiness').innerText(),/Bez boli/);
  await page.screenshot({path:path.join(artifacts,'training-load-'+engine+'-readiness-320.png')});await page.keyboard.press('Escape');
  const comparable = await expectation(page);
  assert.equal(comparable.status, 'available');
  assert.equal(comparable.sampleCount, '4');
  closeNumber(comparable.min, 10.266667, 'own comparable minimum');
  closeNumber(comparable.max, 42, 'own comparable maximum');

  await openHistory(page, 'tl-boundary');
  const historyAU = page.getByText('Napor × trajanje', { exact: true }).locator('xpath=following-sibling::dd');
  assert.equal(await historyAU.innerText(), '10,27');
  await changeRating(page, 8);
  const edited = await page.evaluate(() => JSON.parse(localStorage.getItem('mt.data.v1')).log.find(row => row.historyId === 'tl-boundary'));
  closeNumber(edited.load2.au, 11.733333, 'history writer stores the same exact AU rule');
  await loadView(page);
  closeNumber((await period(page, 'current')).knownAu, 262.733333, 'edited rating propagates');
  await openHistory(page, 'tl-boundary');
  await changeRating(page, '');
  await loadView(page);
  const cleared = await period(page, 'current');
  assert.equal(cleared.missingAu, '3');
  closeNumber(cleared.knownAu, 251, 'cleared rating is missing, not zero');
  await openHistory(page, 'tl-unrated');
  await action(page, 'historyDeleteAsk').click();
  await action(page, 'historyDeleteConfirm').click();
  await loadView(page);
  const deleted = await period(page, 'current');
  assert.equal(deleted.sessions, '6');
  assert.equal(deleted.missingAu, '2');
  closeNumber(deleted.knownAu, 251, 'deleting an unrated row preserves known subtotal');
  const saved = await backup(page);
  await importData(page, saved);
  await loadView(page);
  assert.deepEqual(await period(page, 'current'), deleted);

  const zero = fixture(true);
  zero.log = fixture().log.filter(row => row.historyId === 'tl-zero');
  zero.settings.morningChecks = { '2026-11-03': { date: '2026-11-03', energy: 1, legs: 5, pain: 7 } };
  await importData(page, zero);
  await loadView(page);
  const explicitZero = await period(page, 'current');
  assert.equal(explicitZero.totalAu, '0');
  assert.equal(explicitZero.missingAu, '0');
  assert.match(await page.locator('[data-load-metric="current-au"]').innerText(), /^0/);
  assert.equal(await page.locator('.tl-dial-segment').count(), 0);
  assert.doesNotMatch(await page.locator('[data-load-section="readiness"]').innerText(), /7\s*\/\s*10|Bol[^\n]*7/);
  // Mobile can suspend timers overnight. Returning must refresh the daily
  // window immediately rather than waiting for an expired midnight timeout.
  await page.clock.setFixedTime(new Date('2026-11-05T12:00:00+01:00'));
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  await page.locator('[data-load-day="2026-11-05"]').waitFor();
  assert.equal(await page.locator('[data-load-day="2026-10-29"]').count(), 0);
  results.push({
    label: 'actual-load-tracking', knownAU: 261.266667, missingAU: 2, baselineAU: 63,
    exactSecondsBoundary: 10.266667, editedAU: 11.733333, zeroIsKnown: true,
    immutableMuscleCredits: { chestDirect: 4, tricepsSecondary: 4, tricepsEquivalent: 2 },
    excluded: ['future workouts', 'library trials', 'LM1 AU values', 'yesterday morning answers'],
    historyEditDeleteAndBackupRestore: true, foregroundRefreshesNewDay: true
  });
}

async function runPeriodScenario(page) {
  await page.clock.setFixedTime(fixed);
  await importData(page, periodFixture());
  await loadView(page);
  const buttons = action(page, 'trainingLoadRange');
  const option = key => page.locator('[data-a="trainingLoadRange"][data-v="' + key + '"]');
  const chart = page.locator('svg.tl-days');
  const bins = chart.locator('[data-load-day]');
  const muscleLink = page.locator('[data-a="trainingLoadDetail"][data-topic="muscles"]');
  const checkin = await page.locator('.tl-checkin').innerText();
  const savedLog = await page.evaluate(() => JSON.parse(localStorage.getItem('mt.data.v1')).log);
  const ranges = [
    { key: '7d', sessions: 7, knownAU: 261.266667, chest: 4 },
    { key: '1m', sessions: 10, knownAU: 369.266667, chest: 10 },
    { key: '3m', sessions: 11, knownAU: 459.266667, chest: 12 },
    { key: 'all', sessions: 12, knownAU: 579.266667, chest: 14 }
  ];
  assert.equal(await buttons.count(), ranges.length);
  assert.equal(await option('7d').getAttribute('aria-pressed'), 'true', 'default remains seven dates');
  for (const { key, sessions, knownAU, chest } of ranges) {
    await option(key).click();
    assert.equal(await option(key).getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('[data-a="trainingLoadRange"][aria-pressed="true"]').count(), 1);
    const current = await period(page, 'current');
    assert.equal(Number(current.sessions), sessions);
    assert.equal(current.missingAu, '2');
    closeNumber(current.knownAu, knownAU, key + ' known effort');
    assert.equal(current.totalAu, '', 'wider window keeps missing ratings separate from known effort');
    assert.equal(await page.locator('[data-load-period="baseline"]').count(), key === '7d' ? 1 : 0);
    const binCount = await bins.count();
    assert.ok(binCount > 0 && binCount <= 7, key + ' keeps the chart readable on mobile');
    closeNumber(await bins.evaluateAll(nodes => nodes.reduce((sum, node) => sum + Number(node.dataset.knownAu), 0)),
      knownAU, key + ' graph covers the selected period');
    assert.equal(await page.locator('.tl-checkin').innerText(), checkin, 'morning check remains about today');

    await muscleLink.click();
    const muscle = page.locator('#training-load-info [data-load-group="chest"]');
    assert.equal(Number(await muscle.getAttribute('data-direct')), chest, key + ' uses matching muscle credits');
    assert.equal(Number(await muscle.getAttribute('data-equivalent')), chest);
    await page.keyboard.press('Escape');
  }

  const oldest = chart.locator('[data-load-day][data-known-au="120"]');
  const start = await oldest.getAttribute('data-load-day');
  const end = await oldest.getAttribute('data-end-date');
  assert.ok(end >= '2026-07-15' && start <= '2026-07-15');
  const trendButton = page.locator('[data-a="trainingLoadDetail"][data-topic="day"][data-date="' + start + '"]');
  await trendButton.click();
  const detail = page.locator('[data-load-day-detail="' + start + '"]');
  assert.equal(await detail.getAttribute('data-end-date'), end, 'the drill-down opens the exact trend interval');
  assert.match(await detail.innerText(), /120\s*AU/);
  await page.keyboard.press('Escape');
  assert.equal(await trendButton.evaluate(node => document.activeElement === node), true);
  await layout(page, 320, 'all-period-320');
  await screenshot(page, 'all-period-320');

  await loadView(page);
  assert.equal(await option('all').getAttribute('aria-pressed'), 'true', 'the chosen period survives reload');
  closeNumber((await period(page, 'current')).knownAu, 579.266667, 'reload keeps selected totals');
  const after = await page.evaluate(() => JSON.parse(localStorage.getItem('mt.data.v1')).log);
  assert.deepEqual(after, savedLog, 'range switching leaves the training history intact');
  results.push({ label: 'load-periods', ranges, selectionPersists: true, historyUnchanged: true, trendDetailMatchesBucket: true });
}

module.exports = { fixture, protocolId };
if (require.main === module) main().catch(error => { console.error(error); process.exitCode = 1; });
