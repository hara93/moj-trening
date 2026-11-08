'use strict';

// Synthetic data only: no existing browser profile or user backup is opened.
const assert = require('node:assert/strict');
const MuscleWork = require('../../muscle-work.js');
const fs = require('node:fs');
const path = require('node:path');
const { artifacts, engine, launch, serve, fixture: baseFixture } = require('./runtime.cjs');

const now = new Date('2026-11-04T12:00:00+01:00');
const at = (date, hour = 10) => new Date(date + 'T' + hour + ':00:00+01:00').getTime();
const action = (page, name) => page.locator('[data-a="' + name + '"]');
const results = [];

function fixture(empty = false) {
  const data = baseFixture();
  data.settings.sound = false;
  data.settings.planDates = {};
  data.settings.matchDates = {};
  data.settings.matchDay = -1;
  data.settings.morningChecks = {};
  for (const protocol of Object.values(data.protocols)) protocol.days = [];
  const press = {
    exId: 'bench-press', measure: 'sets', sets: 3, setsDone: 3,
    reps: 5, kg: 20, sides: false, done: true,
    repsList: [5, 3, null], kgList: [20, 20, null],
    rirList: [2, 1, null], sideCounts: [1, 1, 1], setNumbers: [1, 2, 3]
  };
  const plank = {
    exId: 'side-plank', measure: 'time', sets: 1, setsDone: 1,
    reps: 1, sec: 40, kg: 0, sides: true, done: true,
    secList: [40], kgList: [0], sirList: [3], sideCounts: [2], setNumbers: [1]
  };
  data.protocols['hp-strength'] = {
    id: 'hp-strength', name: 'Provjera napretka', tag: 'Teretana', days: [],
    items: [press, plank].map(item => ({ ...item }))
  };
  data.log = empty ? [] : [
    {
      historyId: 'hp-current', kind: 'protocol', refId: 'hp-strength',
      name: 'Poznata izvedba i nepoznata serija', at: at('2026-11-04'), secs: 600, srpe: 7,
      items: [press, plank]
    },
    {
      historyId: 'hp-previous', kind: 'protocol', refId: 'hp-strength',
      name: 'Prethodna usporediva izvedba', at: at('2026-10-28'), secs: 600, srpe: 6,
      items: [
        { ...press, sets: 2, setsDone: 2, repsList: [4, 3], kgList: [20, 20], rirList: [2, 1], sideCounts: [1, 1], setNumbers: [1, 2] },
        { ...plank, sec: 30, secList: [30] }
      ]
    },
    {
      historyId: 'hp-team', kind: 'team', teamType: 'training',
      name: 'Klupski trening', at: at('2026-11-03', 18), secs: 3600, srpe: 6
    },
    {
      historyId: 'hp-field', kind: 'field', refId: 'intervali-15-15',
      name: 'Terenski trening', at: at('2026-11-02', 18), secs: 600, srpe: 5,
      load: { m: 1000, hsr: 100, spr: 10, min: 10, zones: [700, 200, 90, 10] }
    },
    {
      historyId: 'hp-trial', kind: 'exercise', refId: 'bench-press',
      name: 'Proba iz knjižnice nije trening', at: at('2026-11-04', 11), secs: 600, srpe: 10,
      items: [{ ...press, sets: 1, setsDone: 1, repsList: [100], kgList: [20], rirList: [0], sideCounts: [1], setNumbers: [1] }]
    },
    {
      historyId: 'hp-future', kind: 'protocol', refId: 'hp-strength',
      name: 'Budući zapis ne smije povećati rezultat', at: at('2026-11-05'), secs: 600, srpe: 10,
      items: [{ ...press, sets: 1, setsDone: 1, repsList: [99], kgList: [20], rirList: [0], sideCounts: [1], setNumbers: [1] }]
    }
  ];
  return data;
}

async function home(page) {
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('.view.home').waitFor();
  await page.getByRole('button', { name: 'Knjižnica vježbi', exact: true }).waitFor();
}

async function importData(page, data) {
  await home(page);
  await action(page, 'dataSheet').click();
  await page.locator('#importFile').setInputFiles({
    name: 'home-progress-synthetic.json', mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(data))
  });
  await action(page, 'restoreApply').click();
  await action(page, 'restoreApply').waitFor({ state: 'hidden' });
}

async function progress(page) {
  await dashboard(page);
  await action(page, 'dashboardProgress').click();
  await page.locator('.progress-view').waitFor();
}

async function dashboard(page) {
  await home(page);
  await page.getByRole('button', { name: 'Moj pregled', exact: true }).click();
  await page.locator('.db-home').waitFor();
}

async function noOverflow(page, label) {
  const dimensions = await page.evaluate(() => {
    const view = document.querySelector('.view');
    return {
      width: innerWidth, document: document.documentElement.scrollWidth,
      view: view.scrollWidth, available: view.clientWidth
    };
  });
  assert.ok(dimensions.document <= dimensions.width + 1 && dimensions.view <= dimensions.available + 1,
    label + ': ' + JSON.stringify(dimensions));
  results.push({ label, ...dimensions });
}

async function screenshot(page, name) {
  await page.locator('.toast').waitFor({ state: 'hidden', timeout: 10000 });
  await page.locator('.view').evaluate(view => { view.scrollTop = 0; });
  await page.screenshot({ path: path.join(artifacts, 'home-progress-' + engine + '-' + name + '.png') });
}

async function activity(page) {
  if(await page.locator('#progress-info').evaluate(node=>node.open))await page.keyboard.press('Escape');
  await page.locator('.pg-focus .pg-ring-card').click();
  const panel = page.locator('#pg-activity');
  await panel.waitFor();
  const table = panel.locator('details.pg-activity-table');
  if (!await table.evaluate(node => node.open)) await table.locator('summary').click();
  const rows = await table.locator('tbody tr').evaluateAll(nodes => nodes.map(node =>
    Array.from(node.querySelectorAll('th,td'), cell => cell.textContent.trim())));
  assert.equal(rows.length, 8);
  return rows;
}

async function performance(page) {
  if(await page.locator('#progress-info').evaluate(node=>node.open))await page.keyboard.press('Escape');
  await page.locator('.pg-drill-list [data-a=progressDetail][data-topic=performance]').click();
}

async function openHistory(page, id) {
  await dashboard(page);
  await action(page, 'historyList').click();
  await page.locator('[data-a="historyOpen"][data-id="' + id + '"]').click();
  await action(page, 'historyEdit').waitFor();
}

async function homeChecks(page) {
  for (const width of [375, 320]) {
    await page.setViewportSize({ width, height: 850 });
    await home(page);
    await page.getByRole('heading', { name: 'Bok, Tomislav', exact: true }).waitFor();
    assert.equal(await action(page, 'homeGuide').count(), 0);
    assert.equal(await page.locator('#dots .dot').count(), 5);
    assert.equal(await page.locator('#car .hcard').count(), 5);
    assert.equal(await page.locator('.home .week [data-a="daySheet"]').count(), 7);
    assert.equal(await page.locator('.home-categories,.home-today,.home-checks').count(), 0);
    const overflow = await page.locator('#car').evaluate(node => getComputedStyle(node).overflowX);
    assert.ok(['auto', 'scroll'].includes(overflow));
    await noOverflow(page, 'home-' + width);
    await screenshot(page, 'home-' + width);
    await dashboard(page);
    assert.equal(await page.locator('.tabbar .tab').count(),4);
    assert.deepEqual(await page.locator('.db-quick button').evaluateAll(nodes=>nodes.map(n=>n.dataset.a)),['dashboardProtocols','dashboardCalendar','historyList']);
    assert.equal(await page.locator('.db-home .db-muscle,.db-home .db-activity,.db-home .db-quality,.db-home .db-schedule').count(),0);
    assert.equal(await action(page,'todayOpen').count(),1);
    assert.equal(await page.locator('.db-overview>div').count(),2);
    await noOverflow(page,'compact-dashboard-'+width);
    await screenshot(page,'compact-dashboard-'+width);
    await page.getByRole('button',{name:'Napredak',exact:true}).click();
    await page.locator('.pg-cinema').waitFor();
    assert.equal(await page.locator('.pg-main-card svg').count(),0,'cold main has no invented graph');
    assert.equal(await page.locator('.pg-cinema #analysis-load').count(),1);
    assert.equal(await action(page,'progressRange').count(),4);
    await page.locator('[data-a="analyticsOpen"][data-section="muscles"]').click();
    await page.locator('.db-analytics .db-muscle').waitFor();
    assert.equal(await page.locator('.db-comparison-row').count(),MuscleWork.groups.length);
    await action(page,'back').first().click();
    await page.locator('.pg-cinema').waitFor();
  }
  const categories = ['Rehabilitacija', 'Teretana', 'Aktivacija', 'Kondicija', 'Knjižnica'];
  for (const [index, category] of categories.entries()) {
    await home(page);
    const dot = page.locator('#dots .dot').nth(index);
    await dot.focus();
    await page.keyboard.press('Enter');
    await page.waitForFunction(index =>
      document.querySelector('#dots [data-i="' + index + '"]').getAttribute('aria-current') === 'true', index);
    const card = page.locator('#car .hcard').nth(index);
    await card.focus();
    await page.keyboard.press('Enter');
    await page.locator('.view.home').waitFor({ state: 'hidden' });
    assert.ok(await page.locator('.view').isVisible(), category + ' opens a screen');
    await noOverflow(page, 'category-' + category);
  }
  await dashboard(page);
  await action(page, 'todayOpen').focus();
  await page.keyboard.press('Enter');
  await page.getByRole('heading', { name: 'Danas', exact: true }).waitFor();
  await action(page, 'morningOpen').click();
  await page.locator('#morning-form').waitFor();
  await action(page, 'back').first().click();
  await page.getByRole('heading', { name: 'Danas', exact: true }).waitFor();
  await action(page, 'teamNew').click();
  await page.locator('#team-entry-form').waitFor();
  await action(page, 'teamCancel').first().click();
  await page.getByRole('heading', { name: 'Danas', exact: true }).waitFor();
  await action(page, 'back').first().click();
  await page.locator('.dashboard').waitFor();
  await home(page);
  await page.locator('.week [data-a="daySheet"][data-i="2"]').click();
  await page.getByRole('dialog').waitFor();
  await page.keyboard.press('Escape');
  await page.getByRole('dialog').waitFor({ state: 'hidden' });
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
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.setDefaultTimeout(5000);
    await page.clock.setFixedTime(now);
    try {
      await page.goto(host.url, { waitUntil: 'domcontentloaded' });
      await importData(page, fixture(true));
      // Assertions are kept below the fixture/helpers so the same flow tests
      // production DOM, import, history writers and freshly recomputed metrics.
      await runScenarios(page);
      assert.deepEqual(errors, []);
    } catch (error) {
      await screenshot(page, 'failure').catch(() => {});
      console.error('Current view:', (await page.locator('.view').allInnerTexts()).join('\n').slice(0, 2200));
      throw error;
    } finally {
      await context.close();
    }
  } finally {
    if (browser) await browser.close();
    await host.close();
    fs.writeFileSync(path.join(artifacts, 'home-progress-' + engine + '.json'), JSON.stringify(results, null, 2));
  }
}

async function runScenarios(page) {
  await homeChecks(page);
  await progress(page);
  assert.ok(await page.locator('.pg-main-unavailable').isVisible());
  assert.equal(await page.locator('.pg-comparison').count(), 0);
  const zeroWeeks = await activity(page);
  assert.ok(zeroWeeks.every(row => row[1] === '0' && row[2] === '0'));
  await noOverflow(page, 'zero-progress-320');
  await screenshot(page, 'zero-320');

  const futureOnly = fixture(true);
  futureOnly.log = fixture().log.filter(entry => entry.historyId === 'hp-future');
  await importData(page, futureOnly);
  await progress(page);
  assert.ok(await page.locator('.pg-main-unavailable').isVisible());
  assert.equal(await page.locator('.pg-focus .pg-ring-readout strong').innerText(),'0');
  assert.ok((await activity(page)).every(row => row[1] === '0' && row[2] === '0'));

  await importData(page, fixture());
  await home(page);
  assert.match(await page.locator('.home').innerText(), /Zadnji trening: Poznata izvedba i nepoznata serija/);
  assert.doesNotMatch(await page.locator('.home').innerText(), /Budući zapis ne smije povećati rezultat/);
  await progress(page);
  await performance(page);
  const press = page.locator('.pg-comparison[data-id="bench-press"][data-kind="reps"]');
  const plank = page.locator('.pg-comparison[data-id="side-plank"][data-kind="time"]');
  assert.equal(await page.locator('.pg-comparison').count(), 2);
  assert.match(await press.locator('.pg-before').innerText(), /^4\s+pon\./);
  assert.match(await press.locator('.pg-after').innerText(), /^5\s+pon\./);
  assert.match(await press.locator('.pg-change').innerText(), /^\+1\s+pon\./);
  assert.match(await press.locator('.pg-context').innerText(), /20\s*kg/);
  assert.match(await plank.locator('.pg-before').innerText(), /^30\s+s/);
  assert.match(await plank.locator('.pg-after').innerText(), /^40\s+s/);
  assert.match(await plank.locator('.pg-change').innerText(), /^\+10\s+s/);
  assert.deepEqual(await press.locator('time').evaluateAll(nodes => nodes.map(node => node.dateTime)),
    [new Date(at('2026-10-28')).toISOString(), new Date(at('2026-11-04')).toISOString()]);
  const weeks = await activity(page);
  assert.deepEqual(weeks[0].slice(1), ['3', '80', '480']);
  assert.deepEqual(weeks[1].slice(1), ['1', '10', '60']);
  assert.match(weeks[0][0], /2\.\s*11\.\s*2026/);
  assert.match(await page.locator('.pg-activity-summary').innerText(), /4\s+spremljenih treninga/);
  assert.match(await page.locator('.pg-activity-chart').getAttribute('aria-label'), /Zadnji tjedan još traje/);
  await page.keyboard.press('Escape');
  for (const width of [320, 375]) {
    await page.setViewportSize({ width, height: 850 });
    await noOverflow(page, 'known-progress-' + width);
    await screenshot(page, 'known-' + width);
  }

  await performance(page);
  const summary=page.locator('.pg-drill-list [data-a=progressDetail][data-topic=performance]');
  const help = page.locator('[data-a="progressInfo"][data-topic="performance"]');
  await help.focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('#progress-info').evaluate(node => node.open), true);
  assert.ok(await page.locator('#progress-info .pg-help-visual').isVisible());
  await page.keyboard.press('Escape');
  assert.equal(await summary.evaluate(node => node === document.activeElement), true);
  await performance(page);
  await plank.locator('[data-a="openEx"]').click();
  await page.locator('.workout-exercise-page').waitFor();
  await action(page, 'back').first().click();
  await page.locator('.progress-view').waitFor();

  await openHistory(page, 'hp-current');
  await action(page, 'historyEdit').click();
  const reps = page.locator('[data-history-item="0"][data-history-set="0"][data-history-field="reps"]');
  if (!await reps.isVisible()) await reps.locator('xpath=ancestor::details[1]/summary').click();
  await reps.fill('6');
  await action(page, 'historySave').click();
  await action(page, 'historyEdit').waitFor();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('mt.data.v1')));
  assert.deepEqual(saved.log.find(row => row.historyId === 'hp-current').items[0].repsList, [6, 3, null]);
  await progress(page);
  await performance(page);
  assert.match(await press.locator('.pg-after').innerText(), /^6\s+pon\./);
  assert.match(await press.locator('.pg-change').innerText(), /^\+2\s+pon\./);
  assert.deepEqual((await activity(page))[0].slice(1), ['3', '80', '480']);

  await openHistory(page, 'hp-current');
  await action(page, 'historyDeleteAsk').click();
  await action(page, 'historyDeleteCancel').click();
  await action(page, 'historyEdit').waitFor();
  await action(page, 'historyDeleteAsk').click();
  await action(page, 'historyDeleteConfirm').click();
  await progress(page);
  assert.equal(await page.locator('.pg-comparison').count(), 0);
  await performance(page);
  assert.ok(await page.locator('#progress-info .pg-comparison-empty').isVisible());
  assert.deepEqual((await activity(page))[0].slice(1), ['2', '70', '410']);
  await home(page);
  assert.match(await page.locator('.home').innerText(), /Zadnji trening: Klupski trening/);

  const unknown = fixture();
  unknown.log[0].items[0].repsList = [null, null, null];
  unknown.log[0].items[1].sideCounts = [1];
  await importData(page, unknown);
  await progress(page);
  assert.equal(await page.locator('.pg-comparison').count(), 0);
  await performance(page);
  assert.ok(await page.locator('#progress-info .pg-comparison-empty').isVisible());
  assert.deepEqual((await activity(page))[0].slice(1), ['3', '80', '480']);
  results.push({
    label: 'history-driven-insights', repetitions: '4→5→edited6', seconds: '30→40',
    currentWeek: { count: 3, minutes: 80, au: 480 }, afterDelete: { count: 2, minutes: 70, au: 410 },
    excluded: ['future session', 'library trial', 'unknown repetitions', 'incomplete bilateral set'],
    preservesUnknownSet: true, keyboardAndBack: true
  });
  console.log(JSON.stringify({ engine, checks: results }, null, 2));
}

main().catch(error => { console.error(error); process.exitCode = 1; });
