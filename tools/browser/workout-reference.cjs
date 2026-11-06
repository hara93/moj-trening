'use strict';

// Actual workout surfaces, including full-frame media and editable dense plans.
// Synthetic records preserve known, unknown and intentional zero values.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { artifacts, engine, fixture: baseFixture, launch, serve } = require('./runtime.cjs');

const protocolId = 'reference-teretana';
const denseProtocolId = 'reference-five-sets';
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
  data.protocols[denseProtocolId] = {
    id: denseProtocolId, name: 'Pet serija', home: 'teretana', tag: 'Teretana', days: [],
    items: [{ ...items[0], sets: 5, kg: 0, repsList: [8, 8, 8, 8, 8], kgList: [50, 0, null, 55, 50] }]
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

async function seriesFooterOrder(detail, expectedRows, label) {
  const table = detail.locator('.workout-set-table');
  const add = detail.locator('.workout-page-series > [data-a="workoutAddSet"]');
  const footer = detail.locator(':scope > .workout-footer');
  assert.equal(await table.locator('.workout-set-row').count(), expectedRows, label + ': every prescribed set remains present');
  assert.equal(await add.count(), 1, label + ': one AddSet action follows the table');
  assert.equal(await add.innerText(), 'Dodaj seriju');
  assert.equal(await add.isEnabled(), true, label + ': another set can be added');
  const order = await detail.evaluate(node => {
    const table = node.querySelector('.workout-set-table');
    const add = node.querySelector('.workout-page-series > [data-a="workoutAddSet"]');
    const footer = node.querySelector(':scope > .workout-footer');
    return { addOutsideTable: !table.contains(add),
      addAfterTable: !!(table.compareDocumentPosition(add) & Node.DOCUMENT_POSITION_FOLLOWING),
      footerAfterAdd: !!(add.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING) };
  });
  assert.deepEqual(order, { addOutsideTable: true, addAfterTable: true, footerAfterAdd: true }, label + ': table → AddSet → footer DOM order');
  const bounds = await metrics(table), addSet = await metrics(add), footerBounds = await metrics(footer);
  const last = await metrics(table.locator('.workout-set-row').last());
  assert.ok(last.y >= bounds.y && last.y + last.height <= bounds.y + bounds.height + 1, label + ': complete last row stays inside the table');
  const tableGap = addSet.y - bounds.y - bounds.height;
  assert.ok(tableGap >= 8 && tableGap <= 14, label + ': compact gap from the complete table to AddSet: ' + tableGap);
  assert.ok(addSet.height >= 44 && addSet.height <= 48, label + ': AddSet retains its touch target');
  near(addSet.width, bounds.width, label + ': AddSet aligns with the table width', 1);
  const footerGap = footerBounds.y - addSet.y - addSet.height;
  assert.ok(footerGap >= 12 && footerGap <= 24, label + ': footer follows AddSet without overlap or excess gap: ' + footerGap);
  return { table: bounds, addSet, footer: footerBounds, tableGap, footerGap, rows: expectedRows };
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

async function wholeImage(locator) {
  return locator.evaluate(image => {
    const r = image.getBoundingClientRect(), css = getComputedStyle(image);
    const scale = Math.min(r.width / image.naturalWidth, r.height / image.naturalHeight);
    return { fit: css.objectFit, width: r.width, height: r.height,
      naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight,
      renderedWidth: image.naturalWidth * scale, renderedHeight: image.naturalHeight * scale };
  });
}

function contained(image, label) {
  assert.equal(image.fit, 'contain', label + ' keeps the entire source frame');
  assert.ok(image.naturalWidth > 0 && image.naturalHeight > 0, label + ' decoded');
  assert.ok(image.renderedWidth <= image.width + .1 && image.renderedHeight <= image.height + .1, label + ' has no crop');
}

async function phaseImage(hero, width) {
  const image = await wholeImage(hero.locator('img'));
  const window = await metrics(hero);
  contained(image, 'Single-phase overview');
  near(window.width, width, 'Single-phase overview uses full width');
  near(window.width / window.height, .75, 'Single-phase window preserves the 600×800 half', .001);
  near(image.width, window.width * 2, 'Single phase is exactly half the original pair');
  near(image.height, window.height, 'Single phase has no vertical crop');
  return { window, image };
}

async function fieldMetrics(table) {
  return table.locator('[data-field="reps"]').first().evaluate(input => {
    const td = input.closest('td'), frame = getComputedStyle(td, '::after');
    return { touchHeight: input.getBoundingClientRect().height,
      visibleHeight: td.getBoundingClientRect().height - parseFloat(frame.top) - parseFloat(frame.bottom) };
  });
}

function editableSize(size) {
  assert.ok(size.touchHeight >= 44 && size.touchHeight <= 48, 'editable touch target: ' + JSON.stringify(size));
  assert.ok(size.visibleHeight >= 32 && size.visibleHeight <= 40, 'compact visible field: ' + JSON.stringify(size));
}

async function run() {
  const origin = await serve();
  const browser = await launch();
  const evidence = {};
  try {
    const context = await browser.newContext({ viewport: { width: 375, height: 812 },
      isMobile: true, hasTouch: true, deviceScaleFactor: 1, locale: 'hr-HR',
      timezoneId: 'Europe/Zagreb', reducedMotion: 'reduce', serviceWorkers: 'block' });
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
    await phaseImage(overview.locator('.hero'), 375);
    assert.match(await overview.locator('.hero img').getAttribute('src'), /assets\/slike\/bench-press\.webp$/);
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
    const pair = await wholeImage(detail.locator('.workout-detail-cover img'));
    contained(pair, 'Exercise illustration');
    near(pair.width, 375, 'Whole double image spans the detail width');
    near(pair.width / pair.height, 1.5, 'Whole double image keeps its natural 3:2 ratio', .001);
    assert.ok(cover.height >= pair.height && cover.height <= pair.height + 70, 'Exercise cover includes the unobstructed navigation row');
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
    assert.ok(firstSet.y - tableTop.y >= 20 && firstSet.y - tableTop.y <= 34, 'Set labels remain beside their rows');
    assert.equal(await table.locator('.workout-set-row').count(), 3);
    assert.equal(await table.locator('.workout-set-row').first().locator('td').first().innerText(), '1');
    const reps = table.locator('[data-field="reps"]').first();
    const input = await metrics(reps);
    editableSize(await fieldMetrics(table));
    assert.ok(input.height >= 44 && input.height <= 48, 'Mobile numeric controls retain a full touch target');
    assert.equal(input.fontSize, '16px', 'Inputs avoid Safari focus zoom');
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
    const seriesOrder = await seriesFooterOrder(detail, 3, '375px three-set plan');
    const detailFooter = seriesOrder.footer;
    assert.ok(cta.y - detailFooter.y >= 12 && cta.y - detailFooter.y <= 17, 'Start button has a compact inset');
    assert.ok(cta.height >= 48 && cta.height <= 52, 'Start button remains easy to tap');
    assert.equal(cta.fontSize, '13px');
    assert.equal(cta.fontWeight, '600');
    assert.equal(cta.borderRadius, '28px');
    await screenshot(page, 'exercise-375');
    evidence.exercise = { cover, heading, input, glyph, cta, footer: detailFooter, seriesOrder };
    await page.setViewportSize({ width: 320, height: 812 });
    assert.equal((await metrics(detail.locator('h1'))).fontSize, '21px');
    contained(await wholeImage(detail.locator('.workout-detail-cover img')), 'Narrow exercise illustration');
    const narrow = await detail.evaluate(node => ({ width: node.clientWidth, scroll: node.scrollWidth }));
    assert.ok(narrow.scroll <= narrow.width + 1, '320px exercise remains within the viewport');
    await seriesFooterOrder(detail, 3, '320px three-set plan');
    await screenshot(page, 'exercise-320');
    await detail.locator('[data-a="workoutClose"]').click();
    await overview.waitFor();
    await phaseImage(overview.locator('.hero'), 320);
    assert.equal((await metrics(overview.locator('h1'))).fontSize, '23px');
    await screenshot(page, 'overview-320');
    // Keep the actual generated pair. A shorter phone may scroll through the
    // five-set form instead of shrinking or replacing the approved source.
    await page.locator('.view [data-a="back"]').first().click();
    await page.locator('[data-a="openPr"][data-id="' + denseProtocolId + '"]').first().click();
    await page.locator('.workout-compact-row').first().click();
    const dense = page.locator('.workout-exercise-page'), denseTable = dense.locator('.workout-set-table');
    assert.equal(await denseTable.getAttribute('data-set-count'), '5');
    assert.equal(await denseTable.getAttribute('data-row-density'), 'compact');
    assert.equal(await denseTable.locator('.workout-set-row').count(), 5);
    assert.deepEqual(await denseTable.locator('[data-field="kg"]').evaluateAll(inputs => inputs.map(input => input.value)), ['50', '0', '', '55', '50']);
    const historyBefore = await page.evaluate(() => JSON.stringify(JSON.parse(localStorage.getItem('mt.data.v1')).log));
    const denseEvidence = [];
    for (const [width, height] of [[375,812], [320,568]]) {
      await page.setViewportSize({ width, height });
      await dense.locator('.workout-detail-cover img').evaluate(image => image.decode());
      await dense.evaluate(node => { node.scrollTop = 0; });
      const image = await wholeImage(dense.locator('.workout-detail-cover img'));
      contained(image, width + ' px actual double image');
      near(image.width, width, 'Dense plan retains the full-width double image');
      near(image.width / image.height, 1.5, 'Dense plan retains the natural 3:2 source', .001);
      assert.match(await dense.locator('.workout-detail-cover img').getAttribute('src'), /assets\/slike\/bench-press\.webp$/);
      const size = await fieldMetrics(denseTable); editableSize(size);
      assert.equal((await metrics(denseTable.locator('[data-field="reps"]').first())).fontSize, '16px');
      const infoButton = dense.locator('.workout-media-info button');
      near((await metrics(infoButton)).height, 44, 'Info touch height');
      near((await metrics(infoButton)).width, 44, 'Info touch width');
      near((await metrics(infoButton.locator('svg'))).width, 24, 'Quiet info glyph');
      const infoAppearance=await infoButton.evaluate(button=>{
        const css=getComputedStyle(button),disk=getComputedStyle(button,'::before'),glyph=getComputedStyle(button.querySelector('svg'));
        return {background:css.backgroundColor,color:css.color,disk:disk.content,diskBackground:disk.backgroundColor,
          backdrop:disk.backdropFilter||disk.webkitBackdropFilter||'none',glyphFill:glyph.fill};
      });
      assert.equal(infoAppearance.background,'rgba(0, 0, 0, 0)','photo remains visible behind the info target');
      assert.equal(infoAppearance.color,'rgb(255, 255, 255)','info circle and letter are white');
      assert.equal(infoAppearance.disk,'none','info has no generated disk behind it');
      assert.equal(infoAppearance.backdrop,'none','info does not blur the photo');
      assert.equal(infoAppearance.glyphFill,'none','white info circle has a transparent interior');
      const rowBounds = await denseTable.locator('.workout-set-row').evaluateAll(rows => rows.map(row => {
        const r = row.getBoundingClientRect(); return { top:r.top, bottom:r.bottom, height:r.height };
      }));
      assert.ok(rowBounds.every(row => row.height >= 44), 'Every set remains separately editable');
      const seriesOrder = await seriesFooterOrder(dense, 5, width + 'px five-set plan');
      const bounds = await dense.evaluate(node => ({ available:node.clientWidth, content:node.scrollWidth }));
      assert.ok(bounds.content <= bounds.available + 1, 'Dense form does not overflow horizontally');
      await screenshot(page, 'pair-five-' + width);
      await denseTable.locator('.workout-set-row').last().scrollIntoViewIfNeeded();
      const lastRow = await metrics(denseTable.locator('.workout-set-row').last());
      assert.ok(lastRow.y >= 0 && lastRow.y + lastRow.height <= height + 1, 'Last complete set can be brought into view');
      assert.equal(await denseTable.locator('[data-field="reps"]').last().isEnabled(), true);
      denseEvidence.push({ width, height, image, fields:size, rows:rowBounds, scrolledLastRow:lastRow, seriesOrder });
    }
    await denseTable.locator('[data-field="reps"]').last().fill('12');
    await denseTable.locator('[data-field="kg"]').nth(2).fill('12.5');
    await denseTable.locator('[data-field="kg"]').nth(2).blur();
    assert.equal(await denseTable.locator('[data-field="reps"]').last().inputValue(), '12');
    assert.equal(await denseTable.locator('[data-field="kg"]').nth(1).inputValue(), '0', 'Intentional zero stays distinct from the formerly unknown field');
    assert.ok((await denseTable.locator('[data-field="rir"]').evaluateAll(inputs => inputs.map(input => input.value))).every(value => value === ''), 'Unknown actual RIR is not invented');
    assert.equal(await page.evaluate(() => JSON.stringify(JSON.parse(localStorage.getItem('mt.data.v1')).log)), historyBefore, 'Plan edits never rewrite recorded history');
    evidence.densePair = denseEvidence;
    assert.deepEqual(errors, []);
    fs.writeFileSync(path.join(artifacts, 'reference-' + engine + '-metrics.json'), JSON.stringify(evidence, null, 2));
    console.log('Passed workout presentation (' + engine + '): full-width single-phase overview, natural3:2details, three/five set density, 375×812 and 320×568, editable values and history.');
  } finally {
    await browser.close();
    await origin.close();
  }
}

if (require.main === module) run().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { fixture, protocolId };
