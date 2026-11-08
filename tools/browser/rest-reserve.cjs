'use strict';
// The rest screen asks for the reserve (RIR) of the set just finished with one optional tap; "Upis rezerve" in the
// player settings moves it to the last set of an exercise or to the end. Rep sets without a set timer wait for the tap.
// Synthetic data only.
const assert = require('node:assert/strict');
const path = require('node:path');
const { artifacts, engine, fixture: baseFixture, launch, serve, pressCinemaMain, openQuit } = require('./runtime.cjs');
const id = 'rest-reserve';
const A = (p, action) => p.locator('[data-a="' + action + '"]');
const player = p => p.evaluate(() => JSON.parse(localStorage.getItem('mt.play')));
const store = p => p.evaluate(() => JSON.parse(localStorage.getItem('mt.data.v1')));
const step = state => state.liveSchedule[state.i];
const reserve = p => p.locator('.workout-cinema-reserve');

function fixture(entry) {
  const data = baseFixture();
  data.log = []; data.programs = {}; data.field = {};
  data.settings.sound = false; data.settings.planDates = {}; data.settings.matchDates = {}; data.settings.matchDay = -1; data.settings.morningChecks = {};
  if (entry !== undefined) data.settings.reserveEntry = entry;
  data.protocols = { [id]: { id, name: 'Rezerva nakon serije', tag: 'Teretana', days: [], items: [
    { exId: 'bench-press', measure: 'sets', sets: 3, reps: 8, kg: 50, rest: 60, sides: false, targetRir: 2 },
    { exId: 'side-plank', measure: 'time', sets: 2, reps: 1, sec: 6, kg: 0, rest: 30, sides: false, targetSir: 10 }
  ] } };
  return data;
}
async function advance(p, seconds) {
  await p.clock.setFixedTime(new Date(await p.evaluate(() => Date.now()) + seconds * 1000));
  await p.waitForTimeout(350);
}
async function start(p, data) {
  await p.evaluate(() => localStorage.removeItem('mt.play'));
  await p.reload({ waitUntil: 'domcontentloaded' });
  await A(p, 'dataSheet').waitFor();
  for (let guard = 0; guard < 3 && await p.locator('.sheet-bg').count(); guard++) { await p.keyboard.press('Escape'); await p.waitForTimeout(200); }
  await A(p, 'dataSheet').click();
  await p.locator('#importFile').setInputFiles({ name: 'rir.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(data)) });
  await A(p, 'restoreApply').click(); await A(p, 'restoreApply').waitFor({ state: 'hidden' });
  await p.getByRole('button', { name: 'Moj pregled', exact: true }).click();
  await A(p, 'dashboardProtocols').click();
  await p.locator('[data-a="openPr"][data-id="' + id + '"]').click();
  await A(p, 'startPr').click();
  await p.locator('.workout-cinema').waitFor();
}
async function toSet(p, set) {
  for (let guard = 0; guard < 12; guard++) {
    const state = await player(p), current = step(state);
    if (current.kind === 'manual' && current.set === set) return;
    if (current.kind === 'manual' && current.set < set) { await pressCinemaMain(p); if (await p.locator('[data-a="cinemaClose"]').count()) await p.locator('[data-a="cinemaClose"]').first().click(); }
    else if (current.dur) await advance(p, state.left + 0.1); else assert.fail('unexpected ' + JSON.stringify(current));
  }
  assert.fail('set ' + set + ' never started');
}

async function run() {
  const server = await serve();
  let browser;
  try {
    browser = await launch();
    const context = await browser.newContext({ viewport: { width: 393, height: 818 }, isMobile: true, hasTouch: true, locale: 'hr-HR', reducedMotion: 'reduce', serviceWorkers: 'block' });
    const p = await context.newPage(), errors = [];
    p.on('pageerror', error => errors.push(error.message));
    p.setDefaultTimeout(8000);
    await p.clock.setFixedTime(new Date('2026-11-06T10:00:00+01:00'));
    await p.goto(server.url, { waitUntil: 'domcontentloaded' });

    // Default: after every set.
    await start(p, fixture());
    await toSet(p, 1);
    await advance(p, 300);
    assert.equal(step(await player(p)).kind, 'manual', 'a rep set without a set timer waits for the tap');
    assert.deepEqual((await player(p)).doneSteps, {});
    assert.equal(await reserve(p).count(), 0, 'no reserve row while the set runs');
    await pressCinemaMain(p);
    await p.locator('.sheet[data-kind="cinemaPlayback"]').waitFor({ state: 'detached' }).catch(() => {});
    if (await p.locator('[data-a="cinemaClose"]').count()) await p.locator('[data-a="cinemaClose"]').first().click();
    assert.equal(step(await player(p)).kind, 'rest');
    const row = reserve(p);
    await row.waitFor();
    const buttons = row.locator('.rirb button');
    assert.deepEqual(await buttons.allInnerTexts(), ['0', '1', '2', '3', '4–5', '6+']);
    assert.match(await buttons.nth(2).getAttribute('class'), /\btg\b/, 'the target RIR 2 is marked');
    assert.match(await buttons.nth(2).getAttribute('aria-label'), /\(cilj\)/);
    assert.match(await row.innerText(), /Koliko si još mogao\?[\s\S]*S1 · rezerva nije unesena/);
    const size = await buttons.first().boundingBox();
    assert.ok(size.height >= 44 && size.width >= 44, 'full touch target: ' + JSON.stringify(size));
    const fontSize = await row.locator('.rirh b').evaluate(node => parseFloat(getComputedStyle(node).fontSize));
    assert.ok(fontSize >= 13, 'readable from the floor');
    await buttons.nth(1).click();
    const first = await player(p), finished = Object.keys(first.doneSteps).map(Number)[0];
    assert.equal(first.rir[finished], 1, 'one tap stores RIR 1 for the finished set');
    assert.equal(await buttons.nth(1).getAttribute('aria-pressed'), 'true');
    assert.match(await row.innerText(), /S1 · RIR 1/);
    await p.screenshot({ path: path.join(artifacts, 'rest-reserve-' + engine + '-393.png') });
    await buttons.nth(1).click();
    assert.equal((await player(p)).rir[finished], undefined, 'the same tap takes it back (optional)');
    await buttons.nth(0).click();
    await toSet(p, 2);
    assert.equal(await reserve(p).count(), 0, 'the row leaves with the rest');
    await pressCinemaMain(p);
    if (await p.locator('[data-a="cinemaClose"]').count()) await p.locator('[data-a="cinemaClose"]').first().click();
    await reserve(p).waitFor();
    assert.match(await reserve(p).innerText(), /S2/);
    await toSet(p, 3); await pressCinemaMain(p);
    if (await p.locator('[data-a="cinemaClose"]').count()) await p.locator('[data-a="cinemaClose"]').first().click();
    await reserve(p).locator('.rirb button').nth(3).click();
    // the hold asks in seconds, with its own target
    const afterHold = state => step(state)?.kind === 'rest' && state.liveSchedule.slice(0, state.i).reverse().find(x => x.kind === 'work' || x.kind === 'manual')?.g === 1;
    for (let guard = 0; guard < 20 && !afterHold(await player(p)); guard++) {
      const now = await player(p);
      if (step(now).kind === 'manual') { await pressCinemaMain(p); if (await p.locator('[data-a="cinemaClose"]').count()) await p.locator('[data-a="cinemaClose"]').first().click(); }
      else await advance(p, (now.left || 1) + 0.1);
    }
    assert.equal(afterHold(await player(p)), true, 'rest after the first hold');
    await reserve(p).waitFor();
    assert.deepEqual(await reserve(p).locator('.rirb button').allInnerTexts(), ['0', '5', '10', '15', '20–30', '30+']);
    assert.match(await reserve(p).locator('.rirb button').nth(2).getAttribute('class'), /\btg\b/, 'the 10 s target is marked');
    // finish and check the stored per-set fields the load model reads
    while (!(await player(p)).done) {
      const now = await player(p);
      if (step(now)?.kind === 'manual') { await pressCinemaMain(p); if (await p.locator('[data-a="cinemaClose"]').count()) await p.locator('[data-a="cinemaClose"]').first().click(); }
      else await advance(p, (now.left || 1) + 0.1);
    }
    await A(p, 'finishPlay').click();
    const logged = (await store(p)).log.find(entry => entry.refId === id);
    assert.deepEqual(logged.items[0].rirList, [0, null, 3]);

    // Only the last set of each exercise.
    await start(p, fixture(1));
    await toSet(p, 1); await pressCinemaMain(p);
    if (await p.locator('[data-a="cinemaClose"]').count()) await p.locator('[data-a="cinemaClose"]').first().click();
    assert.equal(step(await player(p)).kind, 'rest');
    assert.equal(await reserve(p).count(), 0, 'not after set 1 of 3');
    await toSet(p, 3); await pressCinemaMain(p);
    if (await p.locator('[data-a="cinemaClose"]').count()) await p.locator('[data-a="cinemaClose"]').first().click();
    await reserve(p).waitFor();
    assert.match(await reserve(p).innerText(), /S3/);
    await openQuit(p); await A(p, 'quitDiscard').click();
    await p.locator('.workout-cinema').waitFor({ state: 'detached' });

    // At the end only; the setting is in Postavke playera (a backup import keeps earlier settings, so pick 0 first).
    await start(p, fixture(0));
    await p.locator('[data-a="cinemaMenu"]').click(); await A(p, 'cinemaPlayback').click(); await A(p, 'cinemaSettings').click();
    const choices = p.locator('[data-a="setSetting"][data-k="reserveEntry"]');
    assert.deepEqual(await choices.allInnerTexts(), ['Nakon svake serije', 'Samo zadnja serija vježbe', 'Na kraju']);
    assert.equal(await choices.nth(0).getAttribute('aria-pressed'), 'true', 'after every set is selected (the default of the first scenario)');
    await choices.nth(2).click();
    assert.equal(JSON.parse(await p.evaluate(() => localStorage.getItem('mt.settings'))).reserveEntry, 2);
    for (let guard = 0; guard < 4 && await p.locator('.sheet').count(); guard++) { await p.keyboard.press('Escape'); await p.waitForTimeout(200); }
    await openQuit(p); await A(p, 'quitDiscard').click();
    await p.locator('.workout-cinema').waitFor({ state: 'detached' });
    await start(p, fixture());
    await toSet(p, 1); await pressCinemaMain(p);
    if (await p.locator('[data-a="cinemaClose"]').count()) await p.locator('[data-a="cinemaClose"]').first().click();
    assert.equal(step(await player(p)).kind, 'rest');
    assert.equal(await reserve(p).count(), 0, 'nothing asked during the session');
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ engine, waitsForTap: true, oneTapRow: true, targetMarked: true, optional: true, lastSetMode: true, endMode: true, storedRirList: [0, null, 3] }));
  } finally {
    if (browser) await browser.close();
    await server.close();
  }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
