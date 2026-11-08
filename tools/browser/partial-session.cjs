'use strict';
// A partial session (here 1 of 4 work sets) does not fill a plan day: the strip, the day sheet and the history call it
// "djelomično" until half of the work sets are done or it is counted on the done screen. Synthetic data only.
const assert = require('node:assert/strict');
const path = require('node:path');
const { artifacts, engine, launch, serve, fixture: baseFixture, openQuit, pressCinemaMain } = require('./runtime.cjs');

const moment = '2026-11-04T12:00:00+01:00', today = '2026-11-04', monday = '2026-11-02';
const at = (date, hour = 18) => new Date(date + 'T' + hour + ':00:00+01:00').getTime();
const action = (page, name) => page.locator('[data-a="' + name + '"]');
const id = 'ps-four';

function fixture() {
  const data = baseFixture();
  data.settings.sound = false; data.settings.matchDates = {}; data.settings.matchDay = -1; data.settings.morningChecks = {};
  for (const protocol of Object.values(data.protocols)) protocol.days = [];
  const press = { exId: 'bench-press', measure: 'sets', sets: 4, reps: 5, kg: 20, sides: false, rest: 60 };
  data.protocols[id] = { id, name: 'Četiri serije', tag: 'Teretana', days: [], items: [{ ...press }] };
  data.settings.planDates = Object.fromEntries([monday, today].map(date => [date, [{ kind: 'protocol', id, to: date, extra: true }]]));
  data.log = [{ historyId: 'ps-monday', kind: 'protocol', refId: id, name: 'Četiri serije', at: at(monday), secs: 23,
    items: [{ ...press, done: true, setsDone: 1, repsList: [5], kgList: [20], rirList: [2], sideCounts: [1], setNumbers: [1] }] }];
  return data;
}
async function home(page) {
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Knjižnica vježbi', exact: true }).waitFor();
}
const day = (page, index) => page.locator('.week .wd[data-i="' + index + '"]');

async function run() {
  const server = await serve();
  let browser;
  try {
    browser = await launch();
    const context = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true, locale: 'hr-HR', timezoneId: 'Europe/Zagreb', reducedMotion: 'reduce' });
    const page = await context.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.setDefaultTimeout(8000);
    await page.clock.setFixedTime(new Date(moment));
    await page.goto(server.url, { waitUntil: 'domcontentloaded' });
    await action(page, 'dataSheet').click();
    await page.locator('#importFile').setInputFiles({ name: 'djelomicno.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(fixture())) });
    await action(page, 'restoreApply').click();
    await action(page, 'restoreApply').waitFor({ state: 'hidden' });
    await home(page);

    assert.match(await day(page, 0).locator('.c').getAttribute('class'), /\bpart\b/, 'Monday is partial, not done');
    assert.match(await day(page, 0).getAttribute('aria-label'), /djelomično/);
    assert.match(await page.locator('.week-summary').innerText(), /^Ovaj tjedan 0\/2/);
    await page.screenshot({ path: path.join(artifacts, 'partial-strip-' + engine + '.png') });
    await day(page, 0).click();
    const sheet = page.locator('.sheet[data-kind="day"]');
    await sheet.waitFor();
    assert.match(await sheet.locator('.tag').first().innerText(), /djelomično/);
    assert.match(await sheet.innerText(), /djelomično · /);
    await page.keyboard.press('Escape');
    await home(page);
    await page.getByRole('button', { name: 'Moj pregled', exact: true }).click();
    await action(page, 'historyList').click();
    assert.match(await page.locator('.hy-row').first().innerText(), /Djelomično/);

    // Today: 1 of 4 sets, then counted on the done screen.
    await home(page);
    await page.getByRole('button', { name: 'Moj pregled', exact: true }).click();
    await action(page, 'dashboardProtocols').click();
    await page.locator('[data-a="openPr"][data-id="' + id + '"]').click();
    await action(page, 'startPr').click();
    await page.clock.setFixedTime(new Date(new Date(moment).getTime() + 15000));
    await page.waitForFunction(() => { const state = JSON.parse(localStorage.getItem('mt.play')); return state?.liveSchedule?.[state.i]?.kind === 'manual'; });
    await pressCinemaMain(page);
    await openQuit(page);
    await action(page, 'quitSave').click();
    const partial = page.locator('.partial-count');
    await partial.waitFor();
    assert.match(await partial.innerText(), /Djelomično: 25 % radnih serija/);
    assert.match(await page.locator('.done').innerText(), /Ovaj tjedan 0\/2 po planu/);
    await action(page, 'countAsDone').click();
    assert.equal(await action(page, 'countAsDone').getAttribute('aria-pressed'), 'true');
    assert.match(await page.locator('.done').innerText(), /Ovaj tjedan 1\/2 po planu/);
    await action(page, 'finishPlay').click();
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('mt.data.v1')).log.find(entry => entry.historyId !== 'ps-monday'));
    assert.equal(saved.countsAsDone, true);
    await home(page);
    assert.match(await day(page, 2).locator('.c').getAttribute('class'), /\bdone\b/);
    assert.match(await page.locator('.week-summary').innerText(), /^Ovaj tjedan 1\/2/);
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ engine, partialStrip: true, daySheet: true, history: true, countedOnDoneScreen: true }));
  } finally {
    if (browser) await browser.close();
    await server.close();
  }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
