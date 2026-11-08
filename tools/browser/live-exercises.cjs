'use strict';

const assert = require('node:assert/strict');
const {engine, fixture, launch, serve, openJournal, closeJournal} = require('./runtime.cjs');
const id = 'live-exercises-audit';
const action = (page, name, suffix = '') => page.locator('[data-a="'+name+'"]'+suffix);
const snapshot = page => page.evaluate(() => JSON.parse(localStorage.getItem('mt.play')));
const store = page => page.evaluate(() => JSON.parse(localStorage.getItem('mt.data.v1')));
const current = saved => saved.liveSchedule[saved.i];
const exerciseIds = items => items.map(item => item.exId);

async function run(page, url) {
  const data = fixture();
  data.log = [];
  data.settings.sound = false;
  const planned = [
    {exId:'bench-press',measure:'sets',sets:2,reps:10,kg:50,rest:60,sides:false,section:'Priprema'},
    {exId:'dead-bug',measure:'sets',sets:1,reps:6,kg:0,rest:0,sides:false,section:'Snaga'},
    {exId:'side-plank',measure:'time',sets:1,sec:30,kg:0,rest:0,sides:true}
  ];
  data.protocols = {[id]:{id,name:'Provjera izmjena treninga',items:planned}};
  data.exercises['goblet-squat'].kg = 0;
  await page.clock.setFixedTime(new Date('2026-11-06T10:00:00+01:00'));
  await page.goto(url, {waitUntil:'domcontentloaded'});
  await action(page, 'dataSheet').click();
  await page.locator('#importFile').setInputFiles({name:'live-exercises.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});
  await action(page, 'restoreApply').click();
  await page.getByRole('button',{name:'Moj pregled',exact:true}).click();
  await action(page, 'dashboardProtocols').click();
  await action(page, 'openPr', '[data-id="'+id+'"]').click();
  const original = await store(page);
  await action(page, 'startPr').click();
  const main = () => page.locator('.cinema-primary[data-a="cinemaMain"]');
  await main().click();
  assert.equal(current(await snapshot(page)).kind,'manual');
  await main().click();
  await openJournal(page,true);
  const result = page.locator('.cinema-journal .workout-set-row[data-set="1"][data-state="done"]');
  const reps = result.locator('[data-j="0"][data-field="reps"]');
  const rir = result.locator('[data-j="0"][data-field="rir"]');
  await reps.tap();
  await reps.fill('12');
  await rir.tap();
  assert.equal(await rir.evaluate(input=>input===document.activeElement),true,'one tap focuses RIR after changing repetitions');
  assert.match(await page.locator('.cinema-journal-footer small').innerText(),/^12 pon/);
  await rir.fill('2');
  await action(page,'cinemaJournalClose').tap();
  assert.equal(await page.locator('.cinema-journal').count(),0,'one tap saves RIR and returns to the player');
  await action(page, 'cinemaRest', '[data-d="15"]').click();
  await openJournal(page,true);
  const remove = group => action(page,'cinemaRemoveExercise','[data-j="'+group+'"]');
  await remove(0).click();
  await page.getByRole('alert').filter({hasText:'zabilježenu seriju'}).waitFor();
  assert.equal((await snapshot(page)).items.length,3);

  await action(page,'cinemaNotes','[data-j="2"]').click();
  await page.locator('#cinema-note').fill('Zadržana bilješka za bočni plank.');
  await action(page,'cinemaNotesSave').click();
  const initialRest = await snapshot(page);
  assert.equal(current(initialRest).kind,'rest');
  await remove(1).click();
  await action(page,'cinemaExerciseRemove').click();
  const middle = await snapshot(page);
  assert.deepEqual(exerciseIds(middle.items),['bench-press','side-plank']);
  assert.equal(middle.items[1].section,'Snaga');
  assert.equal(middle.notes[1],'Zadržana bilješka za bočni plank.');
  assert.deepEqual(middle.doneSteps,initialRest.doneSteps);
  assert.deepEqual(middle.rir,initialRest.rir);
  assert.deepEqual(current(middle),current(initialRest));
  assert.equal(middle.left,initialRest.left);
  assert.deepEqual(exerciseIds(middle.originalItems),exerciseIds(planned));
  await page.reload({waitUntil:'domcontentloaded'});
  await action(page,'resumeGo').click();
  const recovered = await snapshot(page);
  assert.deepEqual(recovered.notes,middle.notes);
  assert.deepEqual(recovered.liveBaseItems,middle.liveBaseItems);
  assert.deepEqual(recovered.originalItems,middle.originalItems);
  assert.equal(recovered.left,middle.left);

  await openJournal(page,true);
  const add = async (query,exerciseId) => {
    await action(page,'cinemaAddExercise').click();
    await page.locator('#cinema-exercise-search').fill(query);
    assert.equal(await action(page,'cinemaExercisePick').count(),1);
    await action(page,'cinemaExercisePick','[data-id="'+exerciseId+'"]').click();
  };
  await add('goblet squat','goblet-squat');
  const form = page.locator('#cinema-add-exercise-form');
  await form.locator('[name="kg"]').fill('0');
  await form.getByRole('button',{name:'Dodaj vježbu',exact:true}).click();
  await page.locator('#cinema-add-exercise-error').filter({hasText:'veću od 0'}).waitFor();
  assert.equal((await snapshot(page)).items.length,2);
  await form.locator('[name="kg"]').fill('22,5');
  await page.evaluate(() => {
    const write = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
      if (key === 'mt.play') {
        Storage.prototype.setItem = write;
        throw new Error('synthetic checkpoint write refusal');
      }
      return write.call(this,key,value);
    };
  });
  await form.getByRole('button',{name:'Dodaj vježbu',exact:true}).click();
  await page.getByRole('alert').filter({hasText:'Promjena nije spremljena'}).waitFor();
  assert.equal(await form.locator('[name="kg"]').inputValue(),'22,5');
  assert.equal((await snapshot(page)).items.length,2);
  await form.getByRole('button',{name:'Dodaj vježbu',exact:true}).click();
  const added = await snapshot(page);
  assert.deepEqual(exerciseIds(added.items),['bench-press','side-plank','goblet-squat']);
  assert.deepEqual(added.items[2].kgList,[22.5,22.5,22.5]);
  assert.deepEqual(current(added),current(recovered));
  assert.equal(added.left,recovered.left);
  assert.deepEqual(added.rir,middle.rir);
  assert.deepEqual((await store(page)).exercises['goblet-squat'],original.exercises['goblet-squat']);

  await action(page,'cinemaGoSet','[data-j="1"]').click();
  assert.equal(current(await snapshot(page)).kind,'work');
  await openJournal(page,true);
  await remove(1).click();
  await action(page,'cinemaExerciseRemove').click();
  const activeRemoved = await snapshot(page);
  assert.deepEqual(exerciseIds(activeRemoved.items),['bench-press','goblet-squat']);
  assert.equal(activeRemoved.items[1].section,'Snaga');
  assert.equal(current(activeRemoved).g,1);
  assert.ok(['rest','manual'].includes(current(activeRemoved).kind));
  assert.deepEqual(activeRemoved.doneSteps,middle.doneSteps);
  assert.deepEqual(activeRemoved.rir,middle.rir);
  await closeJournal(page);
  if (current(await snapshot(page)).kind==='rest') await main().click();
  await main().click();
  if (await result.isVisible()) await page.keyboard.press('Escape');

  await openJournal(page,true);
  await add('dead bug','dead-bug');
  await action(page,'cinemaGoSet','[data-j="2"]').click();
  await openJournal(page,true);
  await remove(2).click();
  await action(page,'cinemaExerciseRemove').click();
  const finished = await snapshot(page);
  assert.equal(finished.done,true);
  assert.deepEqual(exerciseIds(finished.originalItems),exerciseIds(planned));
  assert.equal(finished.originalMusclePlan.length,3);
  assert.equal(finished.musclePlan.length,2);
  await page.reload({waitUntil:'domcontentloaded'});
  await action(page,'resumeGo').click();
  await action(page,'finishPlay').click();
  const saved = await store(page), entry = saved.log.find(row => row.refId===id);
  assert.deepEqual(saved.protocols[id],original.protocols[id]);
  assert.deepEqual(exerciseIds(entry.items),['bench-press','goblet-squat']);
  assert.deepEqual(entry.items[0].repsList,[12]);
  assert.deepEqual(entry.items[0].rirList,[2]);
  assert.equal(entry.items[1].kg,22.5);
  assert.equal(entry.items[1].setsDone,1);
  assert.equal(await snapshot(page),null);
}

(async () => {
  const host = await serve(), browser = await launch();
  try {
    const context = await browser.newContext({viewport:{width:320,height:780},isMobile:true,hasTouch:true,serviceWorkers:'block',locale:'hr-HR',reducedMotion:'reduce'});
    const page = await context.newPage(), errors = [];
    page.on('pageerror',error => errors.push(error.message));
    page.setDefaultTimeout(7500);
    try { await run(page,host.url); }
    catch (error) {
      console.error((await page.locator('.view,.sheet').allInnerTexts()).join('\n').slice(0,1500));
      throw error;
    }
    assert.deepEqual(errors,[]);
    console.log(engine+' live exercises: schedule, rest, reload and history passed');
  } finally { await browser.close(); await host.close(); }
})().catch(error => {console.error(error); process.exitCode=1;});
