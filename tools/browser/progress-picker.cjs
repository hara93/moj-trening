'use strict';

const assert = require('node:assert/strict');
const { engine, fixture, launch, serve } = require('./runtime.cjs');

const action = (page, name) => page.locator('[data-a="' + name + '"]');
const id = n => 'progress-picker-' + n;
const fixed = new Date('2026-11-04T12:00:00+01:00');

function backup() {
  const data = fixture();
  data.settings.sound = false;
  data.settings.progressChartPeriod = 'all';
  data.log = [];
  const save = (n, day, reps, changes) => data.log.push({
    historyId: id(n) + '-' + day, kind: 'protocol', name: 'Provjera odabira',
    at: new Date(day + 'T10:00:00+01:00').getTime(), secs: 300,
    items: [{ exId: id(n), measure: 'sets', sets: 1, setsDone: 1, reps, kg: 20, done: true, ...changes }]
  });
  for (let n = 1; n <= 10; n++) {
    data.exercises[id(n)] = { ...data.exercises['bench-press'], id: id(n),
      name: n === 6 ? 'Šesto praćenje Đ' : 'Provjera vježbe ' + n, alt: n === 6 ? 'Sixth Lift' : '' };
    if (n < 6) save(n, '2026-11-03', 8);
  }
  save(6, '2026-08-10', 6);
  save(6, '2026-08-12', 8);
  save(8, '2026-11-03', 8, { skipped: true });
  save(9, '2026-11-03', 8, { historySetsUnknown: true });
  save(10, '2026-11-06', 8);
  return data;
}

async function openProgress(page) {
  await page.locator('.tab[data-tab="analytics"]').click();
  await page.locator('.pg-main-card').waitFor();
}

async function choose(page, n) {
  await page.locator('.pg-main-card [data-topic="choose"]').click();
  await page.locator('#progress-info[open] .pg-picker-list [data-id="' + id(n) + '"]').click();
  assert.equal(await page.locator('#progress-info').evaluate(node => node.open), false);
}

(async () => {
  const host = await serve(), browser = await launch();
  try {
    const context = await browser.newContext({ viewport: { width: 320, height: 700 }, isMobile: true, hasTouch: true,
      reducedMotion: 'reduce', locale: 'hr-HR', timezoneId: 'Europe/Zagreb', serviceWorkers: 'block' });
    const page = await context.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.clock.setFixedTime(fixed);
    await page.goto(host.url);
    await action(page, 'dataSheet').click();
    await page.locator('#importFile').setInputFiles({ name: 'progress-picker.json', mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(backup())) });
    await action(page, 'restoreApply').click();
    await action(page, 'restoreApply').waitFor({ state: 'hidden' });
    await page.locator('.toast').waitFor({ state: 'hidden' });
    await openProgress(page);

    const chart = page.locator('.pg-main-card');
    const picker = page.locator('#progress-info');
    const options = picker.locator('.pg-picker-list button');
    const search = picker.getByRole('searchbox');
    const period = value => action(page, 'progressRange').and(page.locator('[data-v="' + value + '"]'));
    const pins = chart.locator('.pg-pinned button');
    const pin = chart.locator('[data-a="progressPin"]');
    await period('7d').click();
    await chart.locator('[data-topic="choose"]').click();
    assert.deepEqual((await options.evaluateAll(nodes => nodes.map(node => node.dataset.id))).sort(),
      [1, 2, 3, 4, 5, 6].map(id), 'search includes every exercise with real evidence across all time');
    await search.fill('   sesto   d  ');
    assert.equal(await options.count(), 1);
    assert.equal(await options.first().getAttribute('data-id'), id(6));
    await search.fill('Sixth Lift');
    assert.equal(await options.count(), 1);
    assert.equal(await options.first().getAttribute('data-id'), id(6));
    await search.fill('nijedan odgovarajući rezultat');
    assert.equal(await options.count(), 0);
    assert.match(await picker.getByRole('status').innerText(), /Nema zabilježenih vježbi/);
    assert.equal(await search.evaluate(node => document.activeElement === node), true, 'typing retains input focus');
    await search.fill('sesto');
    await options.first().click();
    assert.equal(await chart.locator('h2').innerText(), 'Šesto praćenje Đ');
    assert.equal(await period('7d').getAttribute('aria-pressed'), 'true');
    assert.equal(await chart.locator('svg.pg-main-line').count(), 0, 'empty range does not fabricate a trend');
    assert.equal(await chart.locator('[data-a="progressMetric"][data-v="performance"]').getAttribute('aria-pressed'), 'true');

    await pin.click();
    assert.equal(await pin.getAttribute('aria-pressed'), 'true');
    assert.equal(await pins.count(), 1);
    assert.equal(await pins.first().locator('small').count(), 0, 'empty range shows no pinned value');
    await period('all').click();
    assert.match(await pins.first().innerText(), /8 pon\.\s*·\s*\+2/);
    for (const n of [1, 2]) {
      await choose(page, n);
      await pin.click();
    }
    assert.equal(await pins.count(), 3);
    await choose(page, 3);
    assert.equal(await pin.isDisabled(), true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await openProgress(page);
    assert.deepEqual(await pins.evaluateAll(nodes => nodes.map(node => node.dataset.id)), [6, 1, 2].map(id));
    await chart.locator('[data-topic="choose"]').click();
    await page.keyboard.press('Escape');
    const shortcut = pins.and(page.locator('[data-id="' + id(1) + '"]'));
    await shortcut.press('Enter');
    assert.equal(await shortcut.evaluate(node => node === document.activeElement), true, 'pin selection retains focus on its shortcut');
    assert.equal(await chart.locator('h2').innerText(), 'Provjera vježbe 1');
    assert.equal(await period('all').getAttribute('aria-pressed'), 'true');
    await pin.click();
    await page.reload({ waitUntil: 'domcontentloaded' });
    await openProgress(page);
    assert.deepEqual(await pins.evaluateAll(nodes => nodes.map(node => node.dataset.id)), [6, 2].map(id));
    assert.deepEqual(errors, []);
    await context.close();
    console.log('Passed Progress picker (' + engine + '): uncapped actual evidence, accent/alias search, period independence and persistent pins.');
  } finally {
    await browser.close();
    await host.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
