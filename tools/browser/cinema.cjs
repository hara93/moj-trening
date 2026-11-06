'use strict';

// Fresh synthetic data only. This suite never opens a personal browser profile.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { artifacts, engine, fixture: baseFixture, launch, serve } = require('./runtime.cjs');
const fixed = new Date('2026-11-06T10:00:00+01:00');
const id = 'cinema-audit';
const results = [];
const A = (p, action) => p.locator((action==='cinemaMain'?'.cinema-primary':'')+'[data-a="' + action + '"]');
const store = p => p.evaluate(() => JSON.parse(localStorage.getItem('mt.data.v1')));
const player = p => p.evaluate(() => JSON.parse(localStorage.getItem('mt.play')));
const sheet = p => p.locator('.sheet[data-kind="cinemaJournal"]');
const row = (p, exercise, set) => sheet(p).locator('.workout-player-exercise').nth(exercise).locator('.workout-set-row[data-set="' + set + '"]');
const doneCount = p => Object.keys(p.doneSteps || {}).length;
const step = p => p.liveSchedule[p.i];

function fixture() {
  const data = baseFixture();
  data.log = []; data.programs = {}; data.field = {};
  data.settings.sound = false; data.settings.planDates = {}; data.settings.matchDates = {};
  data.settings.matchDay = -1; data.settings.morningChecks = {};
  data.protocols = { [id]: { id, name: 'Filmski kontrolni trening', tag: 'Teretana', days: [], items: [
    { exId: 'bench-press', measure: 'sets', sets: 5, reps: 8, kg: 50, rest: 60, sides: false, targetRir: 2 },
    { exId: 'side-plank', measure: 'time', sets: 2, reps: 1, sec: 6, kg: 0, rest: 30, sides: true, targetSir: 3 }
  ] } };
  return data;
}

async function advance(p, seconds) {
  await p.clock.setFixedTime(new Date(await p.evaluate(() => Date.now()) + seconds * 1000));
  await p.waitForTimeout(350);
}

async function home(p) {
  await p.reload({ waitUntil: 'domcontentloaded' });
  await p.getByRole('heading', { name: 'Bok, Tomislav', exact: true }).waitFor();
}

async function importData(p, data = fixture()) {
  await A(p, 'dataSheet').click();
  await p.locator('#importFile').setInputFiles({ name: 'cinema-synthetic.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(data)) });
  await A(p, 'restoreApply').click(); await A(p, 'restoreApply').waitFor({ state: 'hidden' });
}

async function noOverflow(p, scope, label) {
  const d = await p.locator(scope).evaluate(n => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, width: n.clientWidth, scroll: n.scrollWidth }));
  assert.ok(d.document <= d.viewport + 1 && d.scroll <= d.width + 1, label + ': ' + JSON.stringify(d));
}

async function openJournal(p, rows = 7) {
  if (!await sheet(p).isVisible()) await A(p, 'cinemaJournal').click();
  await sheet(p).waitFor();
  assert.equal((await player(p)).clock.paused, true, 'journal pauses the actual session clock');
  assert.equal(await sheet(p).locator('.workout-set-row').count(), rows);
}

async function closeJournal(p) {
  await A(p, 'cinemaJournalClose').first().click(); await sheet(p).waitFor({ state: 'hidden' });
}

async function expandGroup(p,index) {
  const group=sheet(p).locator('.workout-player-exercise').nth(index);
  if(await group.getAttribute('data-expanded')!=='true'||await A(p,'workoutShowAll').getAttribute('aria-expanded')==='true')
    await p.locator('[data-a="cinemaJournalGroup"][data-j="'+index+'"]').first().click();
}

async function closeCompletionPanel(p) {
  if (await sheet(p).isVisible()) { await closeJournal(p); return; }
  if (await p.getByRole('dialog').count()) {
    await p.keyboard.press('Escape'); await p.getByRole('dialog').waitFor({ state: 'hidden' });
  }
}

async function manual(p, set) {
  for (let guard = 0; guard < 15; guard++) {
    const saved = await player(p), current = step(saved);
    if (current.kind === 'manual') { assert.equal(current.g, 0); assert.equal(current.set, set); return; }
    if (current.kind === 'ready' || current.kind === 'rest' && !current.trans) await A(p, 'cinemaMain').click();
    else if (current.dur) await advance(p, saved.left + 0.1);
    else assert.fail('Unexpected step before set ' + set + ': ' + JSON.stringify(current));
  }
  assert.fail('Set ' + set + ' never became current');
}

async function hero(p) {
  await p.waitForFunction(()=>[...document.querySelectorAll('.workout-cinema .cinema-single-media img,.workout-cinema .cinema-single-media video')]
    .some(node=>node.tagName==='IMG'?node.complete&&node.naturalWidth>0:node.readyState>=2));
  const value = await p.locator('.workout-cinema').evaluate(view => {
    const outer = view.getBoundingClientRect();
    const candidates = [...view.querySelectorAll('img,video')].map(node => {
      const r = node.getBoundingClientRect(), css = getComputedStyle(node);
      return { src: node.currentSrc || node.getAttribute('src'), alt: node.getAttribute('alt'),
        width: Math.max(0, Math.min(r.right, outer.right) - Math.max(r.left, outer.left)),
        height: Math.max(0, Math.min(r.bottom, outer.bottom) - Math.max(r.top, outer.top)), visible: css.display !== 'none' && css.visibility !== 'hidden' };
    }).filter(x => x.visible).sort((a,b) => b.width * b.height - a.width * a.height);
    return { width: outer.width, height: outer.height, media: candidates[0], exercise: view.dataset.exId || null };
  });
  assert.ok(value.media?.src, 'cinema has actual exercise media');
  assert.ok(value.media.width >= value.width * .9 && value.media.height >= Math.min(280, value.height * .4), 'media dominates the player: ' + JSON.stringify(value));
  return value;
}

async function portraitPresentation(p, width, height) {
  const data=fixture();
  data.protocols[id].items=[{exId:'goblet-squat',measure:'sets',sets:3,reps:10,kg:20,rest:60,sides:false,targetRir:2}];
  await importData(p,data);await checkHome(p,width);
  await p.getByRole('button',{name:'Moj pregled',exact:true}).click();
  await A(p,'dashboardProtocols').click();await p.locator('[data-a="openPr"][data-id="'+id+'"]').click();
  await A(p,'startPr').click();await p.locator('.workout-cinema').waitFor();await manual(p,1);await hero(p);
  assert.equal(await p.locator('.workout-cinema').getAttribute('data-ex-id'),'goblet-squat');
  const layout=await p.locator('.workout-cinema').evaluate(view=>{
    const box=node=>{const r=node.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,width:r.width,height:r.height};};
    const media=view.querySelector('.cinema-single-media'),image=media.querySelector('img');
    return {view:box(view),header:box(view.querySelector('.workout-cinema-progress')),media:box(media),
      natural:{width:image.naturalWidth,height:image.naturalHeight},image:box(image),fit:getComputedStyle(image).objectFit,
      mediaFade:getComputedStyle(view.querySelector('.workout-cinema-media'),'::after').backgroundImage,
      stageFade:getComputedStyle(view.querySelector('.workout-cinema-stage'),'::after').backgroundImage,
      timerColor:getComputedStyle(view.querySelector('#ringN')).color};
  });
  assert.ok(layout.media.top>=layout.header.bottom-1,'standing portrait begins below timer/progress header: '+JSON.stringify(layout));
  assert.ok(Math.abs(layout.media.width-layout.view.width)<=1,'portrait retains full viewport width');
  assert.ok(Math.abs(layout.media.height/layout.media.width-4/3)<.01,'portrait phase keeps its natural 3:4 proportions');
  assert.equal(layout.fit,'contain','exercise image is not cropped to fill a box');
  assert.ok(Math.abs(layout.image.width/layout.image.height-layout.natural.width/layout.natural.height)<.01,'image is not stretched');
  assert.match(layout.mediaFade+' '+layout.stageFade,/linear-gradient/,'image has a gradual edge fade');
  assert.ok((layout.mediaFade+' '+layout.stageFade).split('rgba(').length>=4,'fade includes intermediate opacity stops');
  await noOverflow(p,'.workout-cinema','standing portrait '+width+'x'+height);
  await p.screenshot({path:path.join(artifacts,'cinema-'+engine+'-standing-'+width+'x'+height+'.png')});
  // A filter on the static stage creates a new containing block for its absolute
  // media descendant. Pausing must leave the portrait anchored to the same header.
  const portrait=()=>p.locator('.workout-cinema .cinema-single-media').boundingBox();
  const runningRect=await portrait();
  await A(p,'cinemaPause').click();assert.equal((await player(p)).clock.paused,true);
  const pausedRect=await portrait();
  assert.deepEqual(pausedRect,runningRect,'pausing keeps the image below the same header without moving or resizing it');
  await p.screenshot({path:path.join(artifacts,'cinema-'+engine+'-standing-paused-'+width+'x'+height+'.png')});
  await A(p,'cinemaPause').click();assert.equal((await player(p)).clock.paused,false);
  assert.deepEqual(await portrait(),runningRect,'resuming preserves the standing portrait geometry');
  await A(p,'cinemaMain').click();await closeCompletionPanel(p);
  assert.equal(step(await player(p)).kind,'rest');
  const restColor=await p.locator('#ringN').evaluate(node=>getComputedStyle(node).color);
  assert.notEqual(restColor,layout.timerColor,'work and rest counters are visually distinct');
  await p.screenshot({path:path.join(artifacts,'cinema-'+engine+'-standing-rest-'+width+'x'+height+'.png')});
  await openJournal(p,3);
  const completed=row(p,0,1).locator('.workout-set-number');
  const mark=await completed.evaluate(node=>{const circle=node.querySelector('span'),r=circle.getBoundingClientRect();return {
    cellBackground:getComputedStyle(node).backgroundColor,circleRadius:getComputedStyle(circle).borderRadius,width:r.width,height:r.height};});
  assert.match(mark.cellBackground,/rgba\(0, 0, 0, 0\)|transparent/,'completed mark does not color its whole table cell');
  assert.ok(mark.circleRadius==='50%'||parseFloat(mark.circleRadius)>=Math.min(mark.width,mark.height)/2,'completed mark remains circular');
  await p.screenshot({path:path.join(artifacts,'cinema-'+engine+'-standing-journal-'+width+'x'+height+'.png')});
  await closeJournal(p);await A(p,'cinemaMenu').click();await A(p,'cinemaExit').click();await A(p,'quitDiscard').click();
  results.push({width,height,standingPortraitBelowHeader:true,fullWidthNaturalProportions:true,gradualEdgeFade:true,
    distinctWorkRestColors:true,circularCompletedMark:true,pauseResumePreservesPortrait:true,layout});
}

async function checkHome(p, width) {
  await home(p);
  assert.equal(await p.locator('#car .hcard').count(), 5); assert.equal(await p.locator('#dots .dot').count(), 5);
  assert.equal(await A(p, 'homeGuide').count(), 0); assert.equal(await p.locator('.tabbar .tab').count(), 4);
  await noOverflow(p, '.home', 'unchanged home ' + width);
}

async function runPlayer(p, width, url) {
  await p.getByRole('button', { name: 'Moj pregled', exact: true }).click();
  await A(p, 'dashboardProtocols').click(); await p.locator('[data-a="openPr"][data-id="' + id + '"]').click();
  const original = await store(p), history = JSON.stringify(original.log), protocol = JSON.stringify(original.protocols[id].items);
  await A(p, 'startPr').click(); await p.locator('.workout-cinema').waitFor(); await manual(p, 1);
  const firstHero = await hero(p);
  assert.equal(firstHero.exercise,'bench-press');
  await noOverflow(p, '.workout-cinema', 'cinema ' + width);
  await p.screenshot({path:path.join(artifacts,'cinema-'+engine+'-bench-'+width+'.png')});

  // The large central counter measures real work time; tapping it pauses rather than credits a set.
  await advance(p,12);assert.equal(await p.locator('#ringN').innerText(),'0:12');
  await p.locator('#ring').click();const manualPaused=await player(p);
  assert.equal(manualPaused.clock.paused,true);assert.equal(manualPaused.stepClock.seconds,12);
  assert.equal(doneCount(manualPaused),0);await advance(p,25);
  assert.equal(await p.locator('#ringN').innerText(),'0:12');
  await p.locator('#ring').click();await advance(p,3);
  assert.equal(await p.locator('#ringN').innerText(),'0:15');assert.equal(doneCount(await player(p)),0);
  await p.locator('#ring').click();const manualCheckpoint=await player(p);
  await p.reload({waitUntil:'domcontentloaded'});await A(p,'resumeGo').click();
  const manualResumed=await player(p);
  assert.equal(manualResumed.clock.paused,true,'reload preserves an explicitly paused manual series');
  assert.equal(manualResumed.stepClock.seconds,manualCheckpoint.stepClock.seconds);
  assert.equal(doneCount(manualResumed),0);await p.locator('#ring').click();

  // Preparation changes waiting time, never the number of completed work sets.
  const beforePrep = await player(p);
  await A(p, 'cinemaPrep').click(); await p.locator('.sheet[data-kind="cinemaPrep"]').waitFor();
  assert.deepEqual(await A(p, 'cinemaPrepPick').evaluateAll(nodes => nodes.map(n => Number(n.dataset.v))), [0, 5, 10, 30, 60]);
  await p.locator('[data-a="cinemaPrepPick"][data-v="10"]').click(); await A(p, 'cinemaPrepApply').click();
  const prepared = await player(p);
  assert.equal(doneCount(prepared), 0); assert.deepEqual(prepared.items, beforePrep.items);
  assert.ok(step(prepared).dur >= 10 && prepared.left >= 9.9, 'chosen prep time produces a real countdown');
  await manual(p, 1); assert.equal(doneCount(await player(p)), 0);

  await openJournal(p);
  assert.equal(await sheet(p).locator('.workout-set-row:visible').count(), 5, 'default journal expands only current exercise');
  assert.equal(await sheet(p).locator('[data-field="rir"]:enabled,[data-field="sir"]:enabled').count(), 0);
  await A(p, 'workoutShowAll').click(); assert.equal(await sheet(p).locator('.workout-set-row:visible').count(), 7);
  await expandGroup(p,1);
  assert.equal(await row(p, 1, 2).isVisible(), true);
  const editBefore = await player(p);
  await sheet(p).locator('[data-a="playDoseEdit"][data-j="1"]').click(); await p.locator('#play-dose-form').waitFor();
  await p.locator('#play-dose-form [data-dose-set="2"] [data-dose-value="sec"]').fill('99'); await advance(p, 40);
  await A(p, 'playDoseCancel').click(); await sheet(p).waitFor();
  const editAfter = await player(p);
  assert.deepEqual(editAfter.items, editBefore.items); assert.equal(editAfter.clock.seconds, editBefore.clock.seconds);
  assert.equal(editAfter.clock.paused, true); assert.equal(editAfter.startedAt, editBefore.startedAt);
  await closeJournal(p); assert.equal((await player(p)).clock.paused, false);

  const firstStep = (await player(p)).i;
  await A(p, 'cinemaMain').click(); await closeCompletionPanel(p);
  const completed = await player(p); assert.equal(doneCount(completed), 1); assert.equal(completed.doneSteps[firstStep], 1);
  assert.equal(step(completed).kind, 'rest');
  for (const delta of [15, -15]) {
    const before = await player(p);
    await p.locator('[data-a="cinemaRest"][data-d="' + delta + '"]').click();
    const after = await player(p);
    assert.ok(Math.abs(after.left - before.left - delta) < .01); assert.equal(after.i, before.i);
    assert.deepEqual(after.doneSteps, before.doneSteps); assert.equal(after.clock.seconds, before.clock.seconds);
  }
  const restBeforePrep=await player(p);await A(p,'cinemaPrep').click();
  await p.locator('[data-a="cinemaPrepPick"][data-v="10"]').click();await advance(p,20);await A(p,'cinemaPrepApply').click();
  const restAfterPrep=await player(p);
  assert.ok(Math.abs(restAfterPrep.left-restBeforePrep.left-10)<.01,'adding prep preserves rest frozen while its sheet is open');
  assert.deepEqual(restAfterPrep.doneSteps,restBeforePrep.doneSteps);assert.equal(restAfterPrep.clock.seconds,restBeforePrep.clock.seconds);
  await A(p,'cinemaPrep').click();await advance(p,20);await A(p,'cinemaPrepApply').click();
  assert.equal((await player(p)).left,restAfterPrep.left,'zero additional prep also preserves time spent in its sheet');
  assert.equal((await player(p)).clock.seconds,restAfterPrep.clock.seconds);
  await A(p, 'cinemaPause').click(); assert.match(await A(p, 'cinemaMain').innerText(), /Nastavi/);
  const paused = await player(p); await advance(p, 25);
  await openJournal(p); await closeJournal(p);
  assert.equal((await player(p)).clock.paused, true); assert.equal((await player(p)).left, paused.left);
  assert.equal((await player(p)).clock.seconds, paused.clock.seconds);
  await A(p, 'cinemaPause').click();

  await openJournal(p); await expandGroup(p,0);
  const reserve = row(p, 0, 1).locator('[data-field="rir"]');
  assert.equal(await reserve.isEnabled(), true); await reserve.fill('1'); await reserve.press('Tab');
  assert.equal((await player(p)).rir[firstStep], 1);
  assert.equal(await row(p, 0, 2).locator('[data-field="rir"]').isEnabled(), false);
  const frozen = await player(p); await advance(p, 30);
  assert.equal((await player(p)).clock.seconds, frozen.clock.seconds); assert.equal((await player(p)).i, frozen.i);
  await noOverflow(p, '.sheet[data-kind="cinemaJournal"]', 'journal ' + width);
  await p.screenshot({ path: path.join(artifacts, 'cinema-' + engine + '-journal-' + width + '.png') });
  await closeJournal(p); await manual(p, 2); await openJournal(p);
  await expandGroup(p,0);
  const secondStep = (await player(p)).i;
  await row(p, 0, 2).locator('[data-a="workoutSetDone"]').click();
  assert.equal(doneCount(await player(p)), 2); assert.equal((await player(p)).doneSteps[secondStep], 1);
  assert.equal((await player(p)).clock.paused, true, 'completion inside journal leaves its clock paused');
  const afterCheckbox = await player(p); await advance(p, 30);
  assert.equal((await player(p)).i, afterCheckbox.i); assert.equal((await player(p)).clock.seconds, afterCheckbox.clock.seconds);
  await closeJournal(p);
  for (let set = 3; set <= 5; set++) {
    await manual(p, set); const before = await player(p);
    await A(p, 'cinemaMain').click(); await closeCompletionPanel(p);
    assert.equal(doneCount(await player(p)), doneCount(before) + 1);
  }
  const secondHero = await hero(p);
  assert.equal(secondHero.exercise,'side-plank');
  assert.notEqual(secondHero.media.src, firstHero.media.src, 'media follows the displayed next exercise');
  const transit = await player(p); assert.equal(step(transit).g, 1); assert.equal(doneCount(transit), 5);
  await advance(p, transit.left + .1); assert.equal(step(await player(p)).kind, 'work');
  await A(p, 'cinemaPause').click(); const checkpoint = await player(p);
  await p.goto('about:blank'); const away = await p.evaluate(() => Date.now()); await p.clock.setFixedTime(new Date(away + 120000));
  await p.goto(url, { waitUntil: 'domcontentloaded' }); await A(p, 'resumeGo').click();
  const resumed = await player(p);
  assert.equal(resumed.i, checkpoint.i); assert.equal(resumed.left, checkpoint.left);
  assert.deepEqual(resumed.doneSteps, checkpoint.doneSteps); assert.deepEqual(resumed.rir, checkpoint.rir);
  assert.equal(resumed.stepClock.seconds,checkpoint.stepClock.seconds);
  assert.equal(resumed.clock.seconds, checkpoint.clock.seconds); assert.match(await A(p, 'cinemaMain').innerText(), /Nastavi/);
  await hero(p);
  await noOverflow(p, '.workout-cinema', 'resumed cinema ' + width);
  await p.screenshot({ path: path.join(artifacts, 'cinema-' + engine + '-player-' + width + '.png') });

  // A bilateral timed set becomes complete and accepts SIR only after both sides actually finish.
  await A(p,'cinemaPause').click();const left=await player(p);
  assert.equal(step(left).side,'Lijeva strana');await advance(p,left.left+.1);
  assert.equal(doneCount(await player(p)),6);await openJournal(p);await expandGroup(p,1);
  assert.equal(await row(p,1,1).getAttribute('data-state'),'partial');
  assert.equal(await row(p,1,1).locator('[data-field="sir"]').isEnabled(),false);
  await closeJournal(p);const between=await player(p);
  assert.equal(step(between).kind,'switch');await advance(p,between.left+.1);
  const right=await player(p);assert.equal(step(right).side,'Desna strana');await advance(p,right.left+.1);
  const ended=await player(p);assert.equal(doneCount(ended),7);assert.equal(step(ended).kind,'rest');
  await openJournal(p);await expandGroup(p,1);
  assert.equal(await row(p,1,1).getAttribute('data-state'),'done');
  const sir=row(p,1,1).locator('[data-field="sir"]');assert.equal(await sir.isEnabled(),true);
  await sir.fill('3');await sir.press('Tab');assert.equal((await player(p)).rir[right.i],3);
  assert.equal(await row(p,1,2).locator('[data-field="sir"]').isEnabled(),false);
  assert.match(await sheet(p).locator('.cinema-journal-footer').innerText(),/40 pon\./);
  assert.match(await sheet(p).locator('.cinema-journal-footer').innerText(),/2000 kg × pon\./);
  assert.match(await sheet(p).locator('.cinema-journal-footer').innerText(),/0:12 rada/);
  await closeJournal(p);
  assert.equal(JSON.stringify((await store(p)).log), history); assert.equal(JSON.stringify((await store(p)).protocols[id].items), protocol);
  await A(p, 'cinemaMenu').click(); await A(p,'cinemaExit').click(); await A(p, 'quitDiscard').click();
  assert.equal(await player(p), null); assert.equal(JSON.stringify((await store(p)).log), history);
  results.push({ width, prep: 10, restChanges: [15, -15], manualSets: 5, journalRows: 7,
    manualTimerExcludesPause:true,manualReloadKeepsPause:true,prepSheetPreservesRest:true,bilateralCompletion:true,actualSir:3,actualVolume:2000,
    checkboxPausesJournal: true, actualRir: 1, futureEditCancelled: true, explicitPausePreserved: true, reloadExcludesAwayTime: true, historyUnchanged: true });
}

async function notesAndUndo(p,width) {
  await checkHome(p,width);await p.getByRole('button',{name:'Moj pregled',exact:true}).click();
  await A(p,'dashboardProtocols').click();await p.locator('[data-a="openPr"][data-id="'+id+'"]').click();
  const original=await store(p),source=JSON.stringify(original.protocols[id].items);
  await A(p,'startPr').click();await p.locator('.workout-cinema').waitFor();await manual(p,1);
  const before=await player(p);await openJournal(p);
  await sheet(p).locator('[data-a="workoutEquipment"][data-j="0"]').click();
  await p.locator('[data-a="workoutQuickCandidate"][data-id="db-bench-press"]').click();
  const detail=p.locator('.workout-exercise-page');await detail.waitFor();
  assert.equal((await player(p)).items[0].exId,'bench-press','unknown replacement weight cannot change the live exercise');
  for(let set=1;set<=5;set++){
    const input=detail.locator('[data-field="kg"][data-set="'+set+'"]');
    assert.equal(await input.inputValue(),'');await input.fill('20');await input.press('Tab');
  }
  const swapped=await player(p);assert.equal(swapped.items[0].exId,'db-bench-press');
  assert.deepEqual(swapped.items[0].kgList,[20,20,20,20,20]);assert.equal(doneCount(swapped),0);
  assert.deepEqual(swapped.swapUndo[0],before.items[0]);assert.equal(swapped.clock.paused,true);
  await detail.locator('[data-a="workoutUndoSwap"]').click();
  const undone=await player(p);assert.deepEqual(undone.items,before.items);
  assert.equal(doneCount(undone),0);assert.equal(undone.i,before.i);
  assert.equal(JSON.stringify((await store(p)).protocols[id].items),source);
  assert.equal((await store(p)).log.length,original.log.length);
  await A(p,'workoutClose').first().click();await sheet(p).waitFor();

  await p.evaluate(()=>{
    window.__cinemaTrace=[];let sequence=0;const ids=new WeakMap();
    const id=node=>{if(!node)return null;if(!ids.has(node))ids.set(node,++sequence);return ids.get(node);};
    const snapshot=()=>{const value=JSON.parse(localStorage.getItem('mt.play'));return {paused:value?.clock?.paused,step:value?.i,
      sheet:document.querySelector('.sheet')?.dataset.kind||null,ring:id(document.getElementById('ring'))};};
    window.__cinemaSnapshot=snapshot;
    const write=value=>{window.__cinemaTrace.push({...value,now:performance.now(),...snapshot()});if(window.__cinemaTrace.length>100)window.__cinemaTrace.shift();};
    for(const type of ['pointerdown','pointerup','click'])for(const capture of [true,false])
      document.addEventListener(type,event=>write({type,capture,action:event.target.closest('[data-a]')?.dataset.a,
        target:event.target.tagName,node:id(event.target),connected:event.target.isConnected,x:event.clientX,y:event.clientY}),{capture,passive:true});
    new MutationObserver(records=>{if(records.some(record=>record.type==='childList'))write({type:'mutation',targets:records.map(record=>record.target.id||record.target.className).slice(0,8)});}).observe(document.getElementById('app'),{childList:true,subtree:true});
  });

  const note='Mirna izvedba.\nZadržati tempo <bez žurbe> & dobar oslonac.';
  await sheet(p).locator('[data-a="cinemaNotes"][data-j="0"]').click();
  await p.locator('#cinema-note').fill(note);await A(p,'cinemaNotesSave').click();await sheet(p).waitFor();
  assert.equal((await player(p)).notes[0],note);await closeJournal(p);
  assert.equal((await player(p)).clock.paused,false,'closing the nested notes/journal restores the original running state');
  // A normal held press spans a real numeral change. Safari must dispatch exactly one native click.
  const beforeClick=await p.evaluate(()=>window.__cinemaSnapshot()),ringBox=await p.locator('#ring').boundingBox();
  await p.mouse.move(ringBox.x+ringBox.width/2,ringBox.y+ringBox.height/2);await p.mouse.down();
  await p.clock.setFixedTime(new Date(await p.evaluate(()=>Date.now())+1000));await p.waitForTimeout(250);await p.mouse.up();
  const immediate=await p.evaluate(()=>window.__cinemaSnapshot());
  const afterFrame=await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve(window.__cinemaSnapshot())))));
  if(immediate.paused!==true||afterFrame.paused!==true){
    fs.writeFileSync(path.join(artifacts,'cinema-pause-trace-'+width+'.json'),JSON.stringify({beforeClick,immediate,afterFrame,events:await p.evaluate(()=>window.__cinemaTrace)},null,2));
    console.error('Cinema pause trace:',JSON.stringify({beforeClick,immediate,afterFrame,events:await p.evaluate(()=>window.__cinemaTrace)}));
  }
  assert.equal(immediate.paused,true,'central pause click applies synchronously');assert.equal(afterFrame.paused,true,'central pause remains after animation frames');
  assert.equal(await p.evaluate(()=>window.__cinemaTrace.filter(event=>event.type==='click'&&!event.capture&&event.action==='cinemaTimer').length),1,'one held press produces one native pause click');
  assert.equal(doneCount(await player(p)),0);assert.equal((await player(p)).stepClock.seconds,1);
  await p.reload({waitUntil:'domcontentloaded'});await A(p,'resumeGo').click();
  const restored=await player(p);assert.equal(restored.notes[0],note);assert.equal(restored.clock.paused,true);
  assert.deepEqual(restored.swapUndo[0],before.items[0]);
  await openJournal(p);await sheet(p).locator('[data-a="cinemaNotes"][data-j="0"]').click();
  assert.equal(await p.locator('#cinema-note').inputValue(),note);await A(p,'cinemaClose').click();await sheet(p).waitFor();
  await closeJournal(p);await p.locator('#ring').click();await A(p,'cinemaMain').click();
  assert.equal(doneCount(await player(p)),1);await openJournal(p);await A(p,'cinemaFinish').click();
  await A(p,'finishPlay').waitFor();await A(p,'finishPlay').click();assert.equal(await player(p),null);
  const saved=await store(p);assert.equal(saved.log.length,original.log.length+1);
  const entry=saved.log[0];assert.equal(entry.items[0].note,note);assert.equal(entry.items[0].setsDone,1);
  assert.equal(entry.items[0].exId,'bench-press');assert.equal(JSON.stringify(saved.protocols[id].items),source);
  await p.getByRole('button',{name:'Moj pregled',exact:true}).click();await A(p,'historyList').first().click();
  await p.locator('[data-a="historyOpen"][data-id="'+entry.historyId+'"]').click();
  assert.ok((await p.locator('.hy-exercise').first().textContent()).includes(note),'history displays the saved note as text');
  await p.reload({waitUntil:'domcontentloaded'});
  assert.equal((await store(p)).log[0].items[0].note,note,'history notes survive cleanData on reload');
  results.push({width,liveEquipmentSwap:true,initialWeightRequired:true,undoRestoresExactDose:true,
    heldPressAcrossNumeralChange:true,oneNativePauseClick:true,
    notesSurvivePlayerReload:true,notesInFinishedHistory:true,noteSurvivesDataReload:true});
}

(async () => {
  const host = await serve(), browser = await launch();
  try {
    if(!process.argv.includes('just-portrait'))for (const width of [375, 320]) {
      const context = await browser.newContext({ viewport: { width, height: 850 }, isMobile: true, hasTouch: true,
        deviceScaleFactor: 1, serviceWorkers: 'block', locale: 'hr-HR', timezoneId: 'Europe/Zagreb', reducedMotion: 'reduce' });
      const p = await context.newPage(), errors = []; p.on('pageerror', e => errors.push(e.message));
      p.setDefaultTimeout(7000); await p.clock.setFixedTime(fixed);
      try {
        await p.goto(host.url, { waitUntil: 'domcontentloaded' }); await p.getByRole('heading', { name: 'Bok, Tomislav', exact: true }).waitFor();
        await importData(p); await checkHome(p, width);if(!process.argv.includes('just-notes'))await runPlayer(p, width, host.url);
        await notesAndUndo(p,width);assert.deepEqual(errors, []);
      } catch (error) {
        await p.screenshot({ path: path.join(artifacts, 'cinema-' + engine + '-failure-' + width + '.png') }).catch(() => {});
        console.error('Current screen:', (await p.locator('.view,.sheet').allInnerTexts()).join('\n').slice(0, 1800)); throw error;
      } finally { await context.close(); }
    }
    if(!process.argv.includes('just-notes'))for(const [width,height] of [[375,812],[320,568]]){
      const context=await browser.newContext({viewport:{width,height},isMobile:true,hasTouch:true,deviceScaleFactor:1,
        serviceWorkers:'block',locale:'hr-HR',timezoneId:'Europe/Zagreb',reducedMotion:'reduce'});
      const p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
      p.setDefaultTimeout(7000);await p.clock.setFixedTime(fixed);
      try{
        await p.goto(host.url,{waitUntil:'domcontentloaded'});await p.getByRole('heading',{name:'Bok, Tomislav',exact:true}).waitFor();
        await portraitPresentation(p,width,height);assert.deepEqual(errors,[]);
      }catch(error){
        await p.screenshot({path:path.join(artifacts,'cinema-'+engine+'-standing-failure-'+width+'x'+height+'.png')}).catch(()=>{});throw error;
      }finally{await context.close();}
    }
    const report = { engine, passed: true, results, artifacts };
    fs.writeFileSync(path.join(artifacts, 'cinema-' + engine + '-report.json'), JSON.stringify(report, null, 2));
    process.stdout.write(JSON.stringify(report) + '\n');
  } finally { await browser.close(); await host.close(); }
})().catch(error => { process.stderr.write(error.stack + '\n'); process.exitCode = 1; });
