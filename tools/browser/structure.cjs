'use strict';

// Fresh contexts and a synthetic two-exercise workout only. No personal profile.
const assert = require('node:assert/strict');
const MuscleWork = require('../../muscle-work.js');
const fs = require('node:fs');
const path = require('node:path');
const { artifacts, engine, fixture: baseFixture, launch, serve, openCinemaControls, pressCinemaMain } = require('./runtime.cjs');
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

async function openJournal(page) {
  await A(page,'cinemaJournal').click();
  await page.locator('.sheet[data-kind="cinemaJournal"]').waitFor();
  assert.equal(await journal(page).locator('.workout-set-row').count(),7);
}

async function closeJournal(page) {
  await A(page,'cinemaJournalClose').first().click();
  await page.locator('.sheet[data-kind="cinemaJournal"]').waitFor({state:'hidden'});
}

async function manualSet(page,set) {
  for(let tries=0;tries<12;tries++){
    const saved=await player(page),st=current(saved);
    if(st.kind==='manual'){
      assert.equal(st.g,0);assert.equal(st.set,set);
      assert.equal(await page.locator('#ring').getAttribute('data-a'),'cinemaTimer');
      await openCinemaControls(page);
      assert.equal(await page.locator('.cinema-primary[data-a="cinemaMain"]').innerText(),'Serija gotova');
      await A(page,'cinemaClose').click();
      const menu=page.locator('.cinema-popover-bg');
      await menu.waitFor();
      await page.touchscreen.tap(8,page.viewportSize().height-30);
      await menu.waitFor({state:'hidden'});
      return;
    }
    if(st.kind==='ready')await pressCinemaMain(page);
    else if(st.dur)await advance(page,saved.left+.1);
    else assert.fail('Unexpected step before manual set '+set);
  }
  assert.fail('Manual set '+set+' did not become current');
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
  const overview=page.locator('.progress-view.pg-cinema'),load=overview.locator('#analysis-load');
  await overview.waitFor();
  assert.equal(await page.locator('.analytics-hub').count(),0,'fourth tab opens the unified overview directly');
  assert.equal(await overview.locator('.pg-focus .pg-ring-card').count(),1);
  assert.equal(await overview.locator('.pg-main-card').count(),1);
  assert.equal(await overview.locator('.pg-drill-list [data-a="historyList"]').count(),1,'shared overview keeps a single entry to history');
  assert.equal(await A(page,'analyticsMode').count(),0,'no separate mode switch');
  assert.deepEqual(await A(page,'progressRange').evaluateAll(nodes=>nodes.map(n=>n.dataset.v)),['7d','1m','3m','all']);
  assert.equal(await overview.locator('.pg-analysis-range [data-a="progressRange"]:visible').count(),4);
  await load.getByRole('heading',{name:'Opterećenje',exact:true}).waitFor();
  await noOverflow(page,'.progress-view','progress '+width);
  await page.screenshot({path:path.join(artifacts,'structure-'+engine+'-progress-'+width+'.png')});
  assert.equal(await page.locator('.pg-choose, .pg-metric-tabs').count(),0,'no empty trend picker on a fresh overview');
  await page.locator('[data-a="analyticsOpen"][data-section="muscles"]').click();
  await page.locator('.db-analytics').waitFor();assert.equal(await page.locator('.db-comparison-row').count(),MuscleWork.groups.length);
  await noOverflow(page,'.db-analytics','muscles '+width);
  await page.locator('.view [data-a="back"]').first().click();await overview.waitFor();
  const loadDetails=load.locator('.tl-analysis-details');
  const muscleDetails=loadDetails.locator('[data-a="trainingLoadDetail"][data-topic="muscles"]');
  assert.equal(await muscleDetails.isVisible(),false);
  await loadDetails.locator(':scope > summary').click();
  assert.ok(await muscleDetails.isVisible());
  assert.equal(await loadDetails.locator('.tl-drill-list > button').count(),2);
  await noOverflow(page,'#analysis-load','inline load '+width);
  assert.equal((await store(page)).log.length, 0, 'navigation cannot create history');
}

async function liveWorkout(page,width) {
  await home(page);await page.getByRole('button',{name:'Moj pregled',exact:true}).click();
  await A(page,'dashboardProtocols').click();
  await page.locator('[data-a="openPr"][data-id="'+protocolId+'"]').click();
  const baseline=await store(page),source=JSON.stringify(baseline.protocols[protocolId].items),history=JSON.stringify(baseline.log);
  await A(page,'startPr').click();await page.locator('.workout-cinema').waitFor();await manualSet(page,1);
  assert.equal(await page.locator('.workout-cinema').getAttribute('data-ex-id'),'bench-press');
  assert.equal(await page.locator('.workout-cinema .workout-journal').count(),0,'large set tables are opt-in through the journal');
  await openJournal(page);
  assert.equal(await journal(page).locator('.workout-set-row:visible').count(),5);
  assert.equal(await journal(page).locator('input[data-field="rir"]:enabled,input[data-field="sir"]:enabled').count(),0);
  for(let set=1;set<=5;set++){
    const input=row(page,0,set).locator('[data-field="reps"]');await input.scrollIntoViewIfNeeded();
    assert.equal(await input.evaluate(node=>{const r=node.getBoundingClientRect();return document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)===node;}),true,'all five current rows stay reachable');
  }
  await A(page,'workoutShowAll').click();assert.equal(await journal(page).locator('.workout-set-row:visible').count(),7);
  const initial=await player(page);
  await block(page,1).locator('[data-a="playDoseEdit"]').click();await page.locator('#play-dose-form').waitFor();
  await page.locator('#play-dose-form [data-dose-set="2"] [data-dose-value="sec"]').fill('99');
  await advance(page,60);await A(page,'playDoseCancel').click();await page.locator('.sheet[data-kind="cinemaJournal"]').waitFor();
  const cancelled=await player(page);
  assert.deepEqual(cancelled.items,initial.items);assert.equal(cancelled.startedAt,initial.startedAt);
  assert.equal(cancelled.clock.seconds,initial.clock.seconds);assert.equal(cancelled.clock.paused,true);
  await A(page,'workoutShowAll').click();await closeJournal(page);
  const beforePause=await player(page);await page.locator('#ring').click();
  assert.equal((await player(page)).clock.paused,true);assert.equal(workCount(await player(page)),0);
  await advance(page,7);assert.equal((await player(page)).clock.seconds,beforePause.clock.seconds);
  await page.locator('#ring').click();assert.equal((await player(page)).clock.paused,false);
  const firstStep=(await player(page)).i;await pressCinemaMain(page);
  assert.equal(workCount(await player(page)),1);assert.equal((await player(page)).doneSteps[firstStep],1);
  await openJournal(page);assert.equal(await row(page,0,1).getAttribute('data-state'),'done');
  assert.equal(await row(page,0,1).locator('[data-field="rir"]').isEnabled(),true);
  assert.equal(await row(page,0,2).locator('[data-field="rir"]').isEnabled(),false);
  await closeJournal(page);await manualSet(page,2);await A(page,'cinemaTimer').click();await openJournal(page);
  await noOverflow(page,'.sheet[data-kind="cinemaJournal"]','focused journal '+width);
  await page.screenshot({path:path.join(artifacts,'structure-'+engine+'-journal-'+width+'.png')});
  const secondStep=(await player(page)).i;
  await row(page,0,2).locator('[data-a="workoutSetDone"]').click();
  await page.locator('.sheet[data-kind="cinemaJournal"]').waitFor({state:'hidden'});
  assert.equal(workCount(await player(page)),2);assert.equal((await player(page)).clock.paused,true);
  assert.equal((await player(page)).i,secondStep+1,'journal advances even if the previous manual pause is retained');
  const paused=await player(page);await advance(page,25);
  assert.equal((await player(page)).i,paused.i);assert.equal((await player(page)).clock.seconds,paused.clock.seconds);
  await A(page,'cinemaTimer').click();await noOverflow(page,'.workout-cinema','cinema '+width);
  await A(page,'cinemaMenu').click();await A(page,'cinemaExit').click();await A(page,'quitDiscard').click();
  assert.equal(await player(page),null);assert.equal(JSON.stringify((await store(page)).log),history);
  assert.equal(JSON.stringify((await store(page)).protocols[protocolId].items),source);
  results.push({width,navigation:'four tabs, compact dashboard, unified progress and load, muscle details and back',retainedRows:7,
    activeRows:5,manualSets:2,futureEditCancelled:true,journalClockPaused:true,reserveOnlyAfterCompletion:true,historyUnchanged:true});
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
