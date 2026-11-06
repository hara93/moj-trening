'use strict';

// Fresh contexts and a synthetic two-exercise workout only. No personal profile.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { artifacts, engine, fixture: baseFixture, launch, serve } = require('./runtime.cjs');
const protocolId = 'structure-two-exercises';
const fixed = new Date('2026-11-06T10:00:00+01:00');
const results = [];
const A = (page, action) => page.locator('[data-a="' + action + '"]');
const player = page => page.evaluate(() => JSON.parse(localStorage.getItem('mt.play')));
const store = page => page.evaluate(() => JSON.parse(localStorage.getItem('mt.data.v1')));
const journal = page => page.locator('.workout-player-focus');
const block = (page, index) => journal(page).locator('.workout-player-exercise').nth(index);
const row = (page, index, set) => block(page, index).locator('.workout-set-row[data-set="' + set + '"]');
const workCount = value => Object.keys(value.doneSteps || {}).length;
const current = value => value.liveSchedule[value.i];

function fixture() {
  const data = baseFixture();
  data.log = []; data.programs = {}; data.field = {};
  data.settings.sound = false; data.settings.planDates = {}; data.settings.matchDates = {};
  data.settings.matchDay = -1; data.settings.morningChecks = {};
  data.protocols = { [protocolId]: {
    id: protocolId, name: 'Provjera strukture treninga', tag: 'Teretana', days: [],
    items: [
      { exId: 'bench-press', measure: 'sets', sets: 5, reps: 5, kg: 20, rest: 3, sides: false, targetRir: 2 },
      { exId: 'side-plank', measure: 'time', sets: 2, reps: 1, sec: 4, kg: 0, rest: 3, sides: true, targetSir: 3 }
    ]
  } };
  return data;
}

async function home(page) {
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Bok, Tomislav', exact: true }).waitFor();
}

async function importData(page) {
  await A(page, 'dataSheet').click();
  await page.locator('#importFile').setInputFiles({ name: 'structure-synthetic.json', mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(fixture())) });
  await A(page, 'restoreApply').click(); await A(page, 'restoreApply').waitFor({ state: 'hidden' });
}

async function advance(page, seconds) {
  const now = await page.evaluate(() => Date.now());
  await page.clock.setFixedTime(new Date(now + seconds * 1000));
  await page.waitForTimeout(350);
}

async function noOverflow(page, selector, label) {
  const d = await page.locator(selector).evaluate(node => ({ viewport: innerWidth,
    document: document.documentElement.scrollWidth, content: node.scrollWidth, available: node.clientWidth }));
  assert.ok(d.document <= d.viewport + 1 && d.content <= d.available + 1, label + ': ' + JSON.stringify(d));
}

async function activeOnly(page, index) {
  assert.equal(await journal(page).locator('.workout-player-exercise').count(), 2, 'both exercises stay in the DOM');
  assert.equal(await journal(page).locator('.workout-player-exercise:visible').count(), 1);
  assert.equal(await journal(page).locator('.workout-player-exercise[data-current="true"]').count(), 1);
  assert.equal(await block(page, index).getAttribute('data-current'), 'true');
  assert.equal(await block(page, index).isVisible(), true);
  assert.equal(await block(page, 1 - index).isVisible(), false);
  assert.equal(await journal(page).locator('.workout-set-row').count(), 7, 'five strength and two timed rows remain intact');
  const name = await block(page,index).locator('.workout-journal-name').innerText();
  assert.ok((await page.locator('.workout-now>strong').innerText()).includes(name),'displayed exercise title and focused card agree');
  assert.ok((await page.locator('.workout-now>span').innerText()).includes(index===0?'5 pon.':'4 s'),'displayed dose belongs to focused exercise');
}

async function control(page, label) {
  assert.equal(await page.locator('#ring').getAttribute('aria-label'), label);
  assert.equal(await page.locator('#ring .workout-control-action').innerText(), label);
  assert.equal(await page.locator('#ring .workout-control-action').isVisible(), true);
}

async function manualSet(page, set) {
  for (let tries = 0; tries < 12; tries++) {
    const p = await player(page), st = current(p);
    if (st.kind === 'manual') {
      assert.equal(st.g, 0); assert.equal(st.set, set); await control(page, 'Serija gotova'); return;
    }
    if (st.kind === 'ready') await page.locator('#ring').click();
    else if (st.dur) await advance(page, p.left + 0.1);
    else assert.fail('Unexpected step before strength set ' + set + ': ' + JSON.stringify(st));
  }
  assert.fail('Strength set ' + set + ' never became current');
}

async function navigation(page, width) {
  await home(page);
  assert.equal(await page.locator('#car .hcard').count(), 5);
  assert.equal(await page.locator('#dots .dot').count(), 5);
  assert.deepEqual(await page.locator('.tabbar .tab').evaluateAll(nodes => nodes.map(n => n.dataset.tab)),
    ['dashboard', 'home', 'library', 'analytics']);
  await page.getByRole('button', { name: 'Moj pregled', exact: true }).click();
  await page.locator('.db-home').waitFor();
  assert.equal(await page.locator('.db-home .db-muscle,.db-home .db-activity,.db-home .db-quality,.db-home .db-schedule').count(), 0);
  assert.equal(await A(page, 'todayOpen').count(), 1);
  await noOverflow(page, '.db-home', 'compact dashboard ' + width);
  await page.screenshot({path:path.join(artifacts,'structure-'+engine+'-dashboard-'+width+'.png')});
  await page.getByRole('button', { name: 'Napredak', exact: true }).click();
  await page.locator('.analytics-hub').waitFor();
  await page.screenshot({path:path.join(artifacts,'structure-'+engine+'-hub-'+width+'.png')});
  assert.deepEqual(await A(page, 'analyticsOpen').evaluateAll(nodes => nodes.map(n => n.dataset.section)), ['progress', 'load', 'muscles', 'trends']);
  for (const [section, selector] of [['progress', '.progress-view'], ['load', '.training-load'], ['muscles', '.db-analytics'], ['trends', '.progress-view']]) {
    await page.locator('[data-a="analyticsOpen"][data-section="' + section + '"]').click();
    await page.locator(selector).waitFor(); await noOverflow(page, selector, section + ' ' + width);
    if (section === 'trends') assert.equal(await page.locator('#pg-exercises').evaluate(node => node.open), true, 'trends opens exercise details directly');
    if (section === 'muscles') assert.equal(await page.locator('.db-comparison-row').count(), 18);
    await page.locator('.view [data-a="back"]').first().click();
    await page.locator('.analytics-hub').waitFor();
  }
  assert.equal((await store(page)).log.length, 0, 'navigation cannot create history');
}

async function liveWorkout(page, width, appUrl) {
  await home(page); await page.getByRole('button', { name: 'Moj pregled', exact: true }).click();
  await A(page, 'dashboardProtocols').click();
  await page.locator('[data-a="openPr"][data-id="' + protocolId + '"]').click();
  const baseline = await store(page), source = JSON.stringify(baseline.protocols[protocolId].items), history = JSON.stringify(baseline.log);
  await A(page, 'startPr').click(); await journal(page).waitFor();
  await activeOnly(page, 0); await manualSet(page, 1);
  assert.equal(await journal(page).locator('input[data-field="rir"]:enabled,input[data-field="sir"]:enabled').count(), 0);
  for (let set = 1; set <= 5; set++) {
    const input = row(page, 0, set).locator('[data-field="reps"]');
    await input.scrollIntoViewIfNeeded();
    assert.equal(await input.evaluate(node => { const r = node.getBoundingClientRect(); return document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2) === node; }), true, 'strength row ' + set + ' can be reached without control overlap');
  }
  const initial = await player(page);
  await A(page, 'workoutShowAll').click();
  assert.equal(await journal(page).locator('.workout-player-exercise:visible').count(), 2);
  await block(page, 1).locator('[data-a="playDoseEdit"]').click();
  await page.locator('#play-dose-form').waitFor();
  const editing = await player(page);
  assert.equal(editing.clock.paused, true); assert.equal(editing.startedAt, initial.startedAt);
  await page.locator('#play-dose-form [data-dose-set="2"] [data-dose-value="sec"]').fill('99');
  await advance(page, 60);
  assert.equal((await player(page)).clock.seconds, editing.clock.seconds);
  await A(page, 'playDoseCancel').click(); await page.locator('#play-dose-form').waitFor({ state: 'hidden' });
  const cancelled = await player(page);
  assert.equal(cancelled.startedAt, initial.startedAt); assert.equal(cancelled.clock.seconds, editing.clock.seconds);
  assert.deepEqual(cancelled.items, initial.items); assert.deepEqual(cancelled.doneSteps, initial.doneSteps);
  assert.equal(JSON.stringify((await store(page)).log), history);
  await A(page, 'workoutShowAll').click(); await activeOnly(page, 0);

  let lastManualStep;
  for (let set = 1; set <= 5; set++) {
    await manualSet(page, set); const before = await player(page);
    lastManualStep=before.i;
    if (set % 2) await page.locator('#ring').click();
    else await row(page, 0, set).locator('[data-a="workoutSetDone"]').click();
    const after = await player(page);
    assert.equal(workCount(after), workCount(before) + 1, 'completion records exactly one work step');
    assert.equal(after.doneSteps[before.i], 1); assert.equal(after.i > before.i, true);
    assert.equal(await row(page, 0, set).getAttribute('data-state'), 'done');
    assert.equal(await row(page, 0, set).locator('[data-field="rir"]').isEnabled(), true);
    if (set < 5) {
      assert.equal(await row(page, 0, set + 1).locator('[data-field="rir"]').isEnabled(), false);
      await control(page, 'Preskoči odmor');
    }
  }
  await activeOnly(page, 1); assert.equal(workCount(await player(page)), 5);
  const reserve=page.locator('.workout-previous-reserve');
  await reserve.waitFor(); assert.equal(await reserve.isVisible(),true,'previous exercise reserve stays available after focus moves');
  const reserveChoice=reserve.locator('[data-a="rir"]').first();
  assert.equal(Number(await reserveChoice.getAttribute('data-k')),lastManualStep);
  await reserveChoice.click();
  assert.equal((await player(page)).rir[lastManualStep],0);
  assert.equal(await row(page,0,5).locator('[data-field="rir"]').inputValue(),'0');
  await A(page,'workoutShowAll').click();
  assert.equal(await page.locator('.workout-previous-reserve').count(),0,'expanded view uses original row instead of a duplicate reserve control');
  await A(page,'workoutShowAll').click(); await activeOnly(page,1);
  const transition = await player(page); assert.equal(current(transition).trans, true);
  await control(page, 'Pauziraj'); await page.locator('#ring').click(); await control(page, 'Nastavi');
  const paused = await player(page); await advance(page, 20);
  assert.equal((await player(page)).i, paused.i); assert.equal((await player(page)).clock.seconds, paused.clock.seconds);
  await page.locator('#ring').click(); await control(page, 'Pauziraj');
  await page.evaluate(()=>history.back()); await A(page, 'quitResume').waitFor();
  const backPause = await player(page); await advance(page, 25); await page.keyboard.press('Escape');
  await A(page, 'quitResume').waitFor({ state: 'hidden' });
  assert.equal((await player(page)).clock.seconds, backPause.clock.seconds);
  assert.equal((await player(page)).i, backPause.i); assert.equal((await player(page)).clock.paused, false);
  await advance(page, (await player(page)).left + 0.1); assert.equal(current(await player(page)).kind, 'work');
  await page.locator('#ring').click(); await control(page, 'Nastavi');
  const checkpoint = await player(page);
  await page.goto('about:blank'); const awayAt = await page.evaluate(() => Date.now());
  await page.clock.setFixedTime(new Date(awayAt + 120000));
  await page.goto(appUrl, { waitUntil: 'domcontentloaded' }); await A(page, 'resumeGo').click();
  const restored = await player(page);
  assert.equal(restored.i, checkpoint.i); assert.deepEqual(restored.doneSteps, checkpoint.doneSteps);
  assert.equal(restored.left, checkpoint.left); assert.equal(restored.clock.seconds, checkpoint.clock.seconds);
  await activeOnly(page, 1); await control(page, 'Nastavi');
  await page.locator('#ring').click();
  await advance(page, (await player(page)).left + 0.1);
  assert.equal(await row(page, 1, 1).getAttribute('data-state'), 'partial');
  assert.equal(await row(page, 1, 1).locator('[data-field="sir"]').isEnabled(), false);
  await advance(page, (await player(page)).left + 0.1);
  await advance(page, (await player(page)).left + 0.1);
  assert.equal(await row(page, 1, 1).getAttribute('data-state'), 'done');
  assert.equal(await row(page, 1, 1).locator('[data-field="sir"]').isEnabled(), true);
  assert.equal(workCount(await player(page)), 7, 'five manual sets and both sides of one timed set');
  await noOverflow(page, '.workout-player-focus', 'active timed exercise ' + width);
  await page.screenshot({ path: path.join(artifacts, 'structure-' + engine + '-player-' + width + '.png') });
  assert.equal(JSON.stringify((await store(page)).log), history, 'unfinished work never appears as saved history');
  assert.equal(JSON.stringify((await store(page)).protocols[protocolId].items), source, 'session and cancelled edits never rewrite the protocol');
  await A(page, 'quitPlay').click(); await A(page, 'quitDiscard').click();
  assert.equal(await player(page), null); assert.equal(JSON.stringify((await store(page)).log), history);
  results.push({ width, navigation: 'four tabs, compact dashboard, four details and back', retainedRows: 7,
    manualSets: 5, timedSides: 2, futureEditCancelled: true, activeExerciseFollowsProgress: true,
    clockExcludesEditorPauseBackAndAway: true, historyUnchanged: true });
}

(async () => {
  const host = await serve(), browser = await launch();
  try {
    for (const width of [375, 320]) {
      const context = await browser.newContext({ viewport: { width, height: 850 }, isMobile: true, hasTouch: true,
        deviceScaleFactor: 1, serviceWorkers: 'block', locale: 'hr-HR', timezoneId: 'Europe/Zagreb', reducedMotion: 'reduce' });
      const page = await context.newPage(), errors = []; page.on('pageerror', e => errors.push(e.message));
      page.setDefaultTimeout(7000); await page.clock.setFixedTime(fixed);
      try {
        await page.goto(host.url, { waitUntil: 'domcontentloaded' });
        await page.getByRole('heading', { name: 'Bok, Tomislav', exact: true }).waitFor();
        await importData(page); await navigation(page, width); await liveWorkout(page, width, host.url);
        assert.deepEqual(errors, []);
      } catch (error) {
        await page.screenshot({ path: path.join(artifacts, 'structure-' + engine + '-failure-' + width + '.png') }).catch(() => {});
        console.error('Current screen:', (await page.locator('.view').allInnerTexts()).join('\n').slice(0, 1400));
        throw error;
      } finally { await context.close(); }
    }
    const report = { engine, passed: true, results, artifacts };
    fs.writeFileSync(path.join(artifacts, 'structure-' + engine + '-report.json'), JSON.stringify(report, null, 2));
    process.stdout.write(JSON.stringify(report) + '\n');
  } finally { await browser.close(); await host.close(); }
})().catch(error => { process.stderr.write(error.stack + '\n'); process.exitCode = 1; });
