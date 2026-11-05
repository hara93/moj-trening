'use strict';

// Geometry taken from the approved trening-premium-refined preview, excluding
// its outer phone frame. Synthetic records match the example's visible dose.
// The application still derives duration from its actual executable steps.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { artifacts, engine, fixture: baseFixture, launch, serve } = require('./runtime.cjs');

const protocolId = 'reference-teretana';
const action = (page, name) => page.locator('[data-a="' + name + '"]');
const fixed = new Date('2026-11-04T10:00:00+01:00');

function fixture() {
  const data = baseFixture();
  data.settings.sound = false;
  data.settings.planDates = {};
  data.settings.matchDates = {};
  data.settings.matchDay = -1;
  Object.values(data.protocols).forEach(protocol => { protocol.days = []; });
  const definitions = [
    ['bench-press', 'Potisak s klupe', [8, 8, 8], 50],
    ['bb-row', 'Veslanje u pretklonu', [10, 10, 8], 40],
    ['goblet-squat', 'Goblet čučanj', [10, 10, 10], 20]
  ];
  const items = definitions.map(([id, name, reps, kg]) => {
    data.exercises[id].name = name;
    return { exId: id, measure: 'sets', sets: 3, reps: reps[0], repsList: reps,
      kg, rest: 90, sides: false, targetRir: 2 };
  });
  data.protocols[protocolId] = {
    id: protocolId, name: 'Teretana A', home: 'teretana', tag: 'Teretana', days: [], items,
    desc: 'Potisak, povlačenje i noge. Kontrolirana izvedba i kvalitetne radne serije.'
  };
  data.log = [{
    historyId: 'reference-previous', kind: 'protocol', refId: protocolId, name: 'Teretana A',
    at: Date.parse('2026-11-03T18:00:00+01:00'), secs: 2400, srpe: 6,
    items: items.map(item => ({ ...item, done: true, setsDone: 3,
      repsList: item.repsList.slice(), kgList: [item.kg, item.kg, item.kg],
      rirList: [2, 2, 1], sideCounts: [1, 1, 1], setNumbers: [1, 2, 3] }))
  }];
  return data;
}

async function metrics(locator) {
  return locator.evaluate(node => {
    const rect = node.getBoundingClientRect();
    const style = getComputedStyle(node);
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height,
      fontFamily: style.fontFamily, fontSize: style.fontSize, fontWeight: style.fontWeight,
      lineHeight: style.lineHeight, letterSpacing: style.letterSpacing,
      borderRadius: style.borderRadius, strokeWidth: style.strokeWidth, color: style.color };
  });
}

function near(actual, expected, label, tolerance = 0.15) {
  assert.ok(Math.abs(actual - expected) <= tolerance,
    label + ': ' + actual + ' expected ' + expected);
}

async function importFixture(page) {
  await action(page, 'dataSheet').click();
  await page.locator('#importFile').setInputFiles({ name: 'reference-workout.json',
    mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(fixture())) });
  await action(page, 'restoreApply').click();
  await action(page, 'restoreApply').waitFor({ state: 'hidden' });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Moj pregled', exact: true }).click();
  await action(page, 'dashboardProtocols').first().click();
  await page.locator('[data-a="openPr"][data-id="' + protocolId + '"]').first().click();
}

async function screenshot(page, name) {
  await page.waitForFunction(() => !document.querySelector('.toast.on'));
  await page.screenshot({ path: path.join(artifacts, 'reference-' + engine + '-' + name + '.png') });
}

async function run() {
  const origin = await serve();
  const browser = await launch();
  const evidence = {};
  try {
    const context = await browser.newContext({ viewport: { width: 375, height: 812 },
      isMobile: true, hasTouch: true, deviceScaleFactor: 1, locale: 'hr-HR',
      timezoneId: 'Europe/Zagreb', reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.setDefaultTimeout(8000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.clock.setFixedTime(fixed);
    await page.goto(origin.url);
    await page.getByRole('heading', { name: 'Bok, Tomislav', exact: true }).waitFor();
    await importFixture(page);
    const overview = page.locator('.workout-overview');
    await overview.waitFor();
    await overview.locator('.hero img').evaluate(image => image.decode());
    const hero = await metrics(overview.locator('.hero'));
    near(hero.width, 375, 'Overview content width');
    near(hero.height, 176, 'Overview hero height');
    assert.match(await overview.locator('.hero img').getAttribute('src'), /assets\/covers\/teretana\.webp$/);
    assert.equal(await overview.locator('.hero').evaluate(node => getComputedStyle(node, '::before').display), 'none');
    const title = await metrics(overview.locator('h1'));
    assert.equal(await overview.locator('h1').innerText(), 'Teretana A');
    assert.equal(title.fontSize, '24px');
    assert.equal(title.fontWeight, '650');
    assert.match(title.fontFamily, /ui-sans-serif/);
    assert.doesNotMatch(title.fontFamily, /Figtree/);
    near(parseFloat(title.letterSpacing), -1.08, 'Overview title tracking');
    const meta = await metrics(overview.locator('.workout-meta'));
    near(meta.height, 26, 'Metadata line height');
    assert.match(await overview.locator('.workout-meta').innerText(), /3 vježbe\s+9 serija/);
    const rows = overview.locator('.workout-compact-row');
    assert.equal(await rows.count(), 3);
    near((await metrics(rows.first())).height, 71, 'Compact row height');
    near((await metrics(rows.first().locator('.workout-compact-thumb'))).width, 52, 'Thumbnail width');
    assert.match(await rows.first().innerText(), /3 × 8 pon\. · 50 kg/);
    assert.match(await rows.nth(1).innerText(), /10 \/ 10 \/ 8 pon\. · 40 kg/);
    assert.equal(await page.locator('[data-a="editPr"]').count(), 0);
    const lastRow = await metrics(rows.last());
    const overviewFooter = await metrics(overview.locator(':scope > .workout-footer'));
    near(overviewFooter.y - lastRow.y - lastRow.height, 20, 'Overview footer follows the list');
    await screenshot(page, 'overview-375');
    evidence.overview = { hero, title, meta, footer: overviewFooter };

    await rows.first().click();
    const detail = page.locator('.workout-exercise-page');
    await detail.waitFor();
    await detail.locator('.workout-detail-cover img').evaluate(image => image.decode());
    const cover = await metrics(detail.locator('.workout-detail-cover'));
    near(cover.height, 184, 'Exercise illustration height');
    const heading = await metrics(detail.locator('h1'));
    assert.equal(await detail.locator('h1').innerText(), 'Potisak s klupe');
    assert.equal(heading.fontSize, '22px');
    assert.equal(heading.fontWeight, '650');
    near(parseFloat(heading.letterSpacing), -0.55, 'Exercise title tracking');
    assert.equal(await detail.locator('.workout-detail-previous').innerText(), 'Prethodno 50 kg · 8 / 8 / 8 pon.');
    assert.match(await detail.locator('.workout-detail-target').innerText(), /Cilj RIR 2\s+Odmor 90 s/);
    const table = detail.locator('.workout-set-table');
    assert.deepEqual(await table.locator('thead th').allTextContents(), ['Serija', 'Pon.', 'kg', 'RIR']);
    near((await metrics(table.locator('thead th').first())).width, 39, 'Set-number column width');
    // WebKit includes the vertical table spacing in thead's DOMRect; compare
    // the physical first-row anchor, which matches the reference in both engines.
    const tableTop = await metrics(table);
    const firstSet = await metrics(table.locator('.workout-set-row').first());
    near(firstSet.y - tableTop.y, 35, 'Reference first set position');
    assert.equal(await table.locator('.workout-set-row').count(), 3);
    assert.equal(await table.locator('.workout-set-row').first().locator('td').first().innerText(), '1');
    const reps = table.locator('[data-field="reps"]').first();
    const input = await metrics(reps);
    near(input.height, 44, 'Mobile numeric control height');
    assert.equal(input.borderRadius, '8px');
    assert.deepEqual(await table.locator('[data-field="reps"]').evaluateAll(inputs => inputs.map(input => input.value)), ['8', '8', '8']);
    assert.deepEqual(await table.locator('[data-field="kg"]').evaluateAll(inputs => inputs.map(input => input.value)), ['50', '50', '50']);
    for (const reserve of await table.locator('[data-field="rir"]').all()) {
      assert.equal(await reserve.inputValue(), '');
      assert.equal(await reserve.isDisabled(), true);
      assert.equal((await metrics(reserve)).color, 'rgb(183, 187, 181)');
    }
    const glyph = await metrics(detail.locator('[data-a="workoutHistory"] svg'));
    near(glyph.width, 16, 'Reference icon width');
    near(glyph.height, 16, 'Reference icon height');
    assert.equal(glyph.strokeWidth, '1.6px');
    const cta = await metrics(detail.locator('.workout-footer .btn').first());
    const tableBounds = await metrics(table);
    const detailFooter = await metrics(detail.locator(':scope > .workout-footer'));
    near(detailFooter.y - tableBounds.y - tableBounds.height, 22, 'Exercise footer follows the table');
    near(cta.y - detailFooter.y, 16, 'Start button inset after footer border');
    near(cta.height, 49, 'Reference start button height');
    assert.equal(cta.fontSize, '14px');
    assert.equal(cta.fontWeight, '600');
    assert.equal(cta.borderRadius, '28px');
    await screenshot(page, 'exercise-375');
    evidence.exercise = { cover, heading, input, glyph, cta, footer: detailFooter };
    await page.setViewportSize({ width: 320, height: 812 });
    assert.equal((await metrics(detail.locator('h1'))).fontSize, '21px');
    near((await metrics(detail.locator('.workout-detail-cover'))).height, 174, 'Narrow exercise cover');
    const narrow = await detail.evaluate(node => ({ width: node.clientWidth, scroll: node.scrollWidth }));
    assert.ok(narrow.scroll <= narrow.width + 1, '320px exercise remains within the viewport');
    await screenshot(page, 'exercise-320');
    await detail.locator('[data-a="workoutClose"]').click();
    await overview.waitFor();
    near((await metrics(overview.locator('.hero'))).height, 164, 'Narrow overview hero');
    assert.equal((await metrics(overview.locator('h1'))).fontSize, '23px');
    await screenshot(page, 'overview-320');
    assert.deepEqual(errors, []);
    fs.writeFileSync(path.join(artifacts, 'reference-' + engine + '-metrics.json'), JSON.stringify(evidence, null, 2));
    console.log('Passed approved reference geometry (' + engine + '): 375/320px, matched records, assets, fonts, compact list, table and controls.');
  } finally {
    await browser.close();
    await origin.close();
  }
}

if (require.main === module) run().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { fixture, protocolId };
