'use strict';

const assert=require('node:assert/strict');
const {engine,fixture,launch,serve,openJournal,closeJournal,openCinemaControls,openQuit}=require('./runtime.cjs');

const action=(page,name)=>page.locator('[data-a="'+name+'"]');
const snapshot=page=>page.evaluate(()=>JSON.parse(localStorage.getItem('mt.play')));
const step=state=>state.liveSchedule[state.i];
const setRow=(page,n)=>page.locator('.cinema-journal .workout-set-row[data-set="'+n+'"]');
const phase=(page,side)=>page.locator('.workout-cinema-heading').getByText(new RegExp(side));
async function startProtocol(page,id){
  await page.reload({waitUntil:'domcontentloaded'});
  await page.getByRole('button',{name:'Moj pregled',exact:true}).click();
  await action(page,'dashboardProtocols').click();
  await page.locator('[data-a="openPr"][data-id="'+id+'"]').click();
  await action(page,'startPr').click();
}
async function advance(page,seconds){
  await page.clock.setFixedTime(new Date(await page.evaluate(()=>Date.now())+seconds*1000));
  await page.waitForTimeout(350);
}
async function enterWork(page,side){
  for(let i=0;i<5;i++){
    const state=await snapshot(page);
    if(step(state).kind==='work'){
      assert.equal(step(state).side,side);
      await phase(page,side).waitFor();
      return state.i;
    }
    await advance(page,state.left+.1);
  }
  assert.fail('No timed work step found for '+side);
}
async function rejectSave(page,reject){
  await page.evaluate(flag=>{
    if(flag){
      window.realSetItem=Storage.prototype.setItem;
      Storage.prototype.setItem=function(key,value){
        if(key==='mt.play')throw new DOMException('Test rejection','QuotaExceededError');
        return window.realSetItem.call(this,key,value);
      };
    }else Storage.prototype.setItem=window.realSetItem;
  },reject);
}
async function repSides(page,id){
  await startProtocol(page,id);
  const initial=await snapshot(page),schedule=initial.liveSchedule;
  const left=schedule.findIndex(entry=>entry.kind==='manual'&&entry.g===0);
  assert.deepEqual(schedule.slice(left,left+3).map(entry=>[entry.kind,entry.side,entry.targetSec??entry.dur]),[
    ['manual','Lijeva strana',21],['switch','Promjena strane',15],['manual','Desna strana',20]
  ]);
  const auto=schedule.find(entry=>entry.kind==='manual'&&entry.g===2);
  assert.equal(auto.targetSec,18,'six reps at three seconds per side');
  await advance(page,initial.left+.1);
  await phase(page,'Lijeva strana').waitFor();
  await advance(page,21.1);
  await phase(page,'Promjena strane').waitFor();
  assert.deepEqual((await snapshot(page)).doneSteps,{[left]:1});
  await openCinemaControls(page);await action(page,'cinemaPrep').click();
  await page.locator('[data-a="cinemaPrepPick"][data-v="5"]').tap();await action(page,'cinemaPrepApply').tap();
  let state=await snapshot(page);
  assert.equal(step(state).dur,20);assert.equal(state.sidePrepSec,15);
  await page.reload({waitUntil:'domcontentloaded'});await action(page,'resumeGo').click();
  state=await snapshot(page);
  assert.equal(step(state).dur,20);assert.equal(state.left,20);assert.equal(state.splitRepSides,true);
  await action(page,'cinemaResume').tap();await advance(page,state.left+.1);
  await phase(page,'Desna strana').waitFor();
  const firstSet=page.locator('.cinema-journal .workout-player-exercise').first().locator('.workout-set-row[data-set="1"]');
  await openJournal(page,true);
  assert.equal(await firstSet.getAttribute('data-state'),'partial');
  assert.match(await firstSet.locator('xpath=following-sibling::tr[1]').innerText(),/✓ lijeva · ○ desna/);
  await firstSet.getByRole('button',{name:/Završi desnu stranu/}).tap();
  state=await snapshot(page);
  assert.deepEqual(state.doneSteps,{[left]:1,[left+2]:1});
  assert.equal(step(state).g,1,'superset continues to the next exercise only after both sides');
  await openJournal(page,true);
  assert.equal(await firstSet.getAttribute('data-state'),'done');
  const reps=firstSet.locator('[data-field="reps"]');await reps.fill('7');await reps.press('Tab');
  state=await snapshot(page);
  assert.equal(state.liveSchedule[left].actualReps,7);assert.equal(state.liveSchedule[left+2].actualReps,7);
  await closeJournal(page);

  // A checkpoint produced by the previous player combined both sides in one
  // manual step and had no session scheduling metadata.
  const combined=initial.liveSchedule.filter(entry=>entry.kind!=='switch'||entry.side!=='Promjena strane')
    .filter(entry=>entry.kind!=='manual'||entry.side!=='Desna strana')
    .map(entry=>entry.kind==='manual'&&entry.side==='Lijeva strana'?{...entry,side:'6 ponavljanja po strani',targetSec:41}:entry);
  const legacy={...initial,i:combined.findIndex(entry=>entry.kind==='manual'),liveSchedule:combined};
  delete legacy.splitRepSides;delete legacy.sidePrepSec;
  await openQuit(page);await action(page,'quitDiscard').tap();
  await page.evaluate(saved=>localStorage.setItem('mt.play',JSON.stringify(saved)),legacy);
  await page.reload({waitUntil:'domcontentloaded'});await action(page,'resumeGo').click();
  assert.equal((await snapshot(page)).splitRepSides,false);
  await openJournal(page,true);
  const planned=firstSet.locator('[data-field="reps"]');await planned.fill('8');await planned.press('Tab');
  state=await snapshot(page);
  assert.equal(state.splitRepSides,false);
  assert.equal(state.liveSchedule.filter(entry=>entry.g===0&&entry.kind==='manual').length,2);
  assert.equal(step(state).targetSec,41);
  assert.equal(step(state).dose.reps,8);
  await firstSet.locator('[data-a="workoutSetDone"]').tap();
  state=await snapshot(page);
  assert.equal(step(state).g,1,'legacy combined confirmation credits its entire set');
}
(async()=>{
  const server=await serve(),browser=await launch();
  try{
    const page=await browser.newPage({viewport:{width:393,height:852},isMobile:true,hasTouch:true});
    const errors=[];page.on('pageerror',error=>errors.push(error));
    await page.clock.setFixedTime(new Date('2026-11-06T10:00:00+01:00'));
    await page.goto(server.url);
    const data=fixture(),id='timed-hold-audit',repsId='bilateral-reps-audit';
    data.log=[];data.programs={};data.settings.sound=false;
    delete data.settings.switchSec;
    data.protocols={[id]:{id,name:'Provjera Copenhagen planka',tag:'Teretana',days:[],
      items:[{exId:'kopenhagen-kratka',measure:'time',sets:2,reps:1,sec:20,rest:30,sides:true,section:'Priprema'}]},
      [repsId]:{id:repsId,name:'Provjera bugarskog čučnja',tag:'Teretana',days:[],items:[
        {exId:'bugarski',measure:'sets',sets:2,reps:6,repSetSec:41,kg:20,rest:0,sides:true,ss:'a'},
        {exId:'nordic-curl',measure:'sets',sets:2,reps:5,repSetSec:18,rest:30,ss:'a'},
        {exId:'bugarski',measure:'sets',sets:1,reps:6,kg:20,rest:0,sides:true}
      ]}};
    await action(page,'dataSheet').click();
    await page.locator('#importFile').setInputFiles({name:'timed-hold-audit.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});
    await action(page,'restoreApply').click();await action(page,'restoreApply').waitFor({state:'hidden'});
    await startProtocol(page,id);

    const left=await enterWork(page,'Lijeva strana');
    await advance(page,4);
    await page.getByRole('button',{name:'Završi lijevu stranu',exact:true}).tap();
    let state=await snapshot(page);
    assert.equal(step(state).kind,'switch');
    assert.equal(step(state).dur,10,'fresh settings use ten seconds between sides');
    assert.deepEqual(state.doneSteps,{[left]:1});
    assert.equal(state.liveSchedule[left].actualSec,4);
    await phase(page,'Promjena strane').waitFor();
    await action(page,'cinemaMenu').tap();await action(page,'cinemaPace').tap();
    const setting=seconds=>page.locator('[data-a="setSetting"][data-k="switchSec"][data-v="'+seconds+'"]');
    assert.equal(await setting(10).getAttribute('aria-pressed'),'true');
    await setting(15).tap();assert.equal(await setting(15).getAttribute('aria-pressed'),'true');
    await action(page,'cinemaClose').tap();await page.keyboard.press('Escape');
    assert.equal(step(await snapshot(page)).dur,10,'the current switch keeps its checkpoint');
    await openJournal(page);
    assert.equal(await setRow(page,1).getAttribute('data-state'),'partial');
    assert.equal(await setRow(page,1).locator('[data-a="workoutSetDone"]').count(),0);
    assert.match(await setRow(page,1).locator('xpath=following-sibling::tr[1]').innerText(),/✓ lijeva \(4 s\) · ○ desna/);
    await closeJournal(page);

    const right=await enterWork(page,'Desna strana');
    await advance(page,7);await openJournal(page);
    const completeRight=setRow(page,1).getByRole('button',{name:/Završi desnu stranu/});
    assert.equal(await setRow(page,1).getAttribute('data-state'),'partial');
    await setRow(page,1).locator('xpath=following-sibling::tr[1]').getByRole('button',{name:/Ponovi/}).waitFor();
    await rejectSave(page,true);await completeRight.tap();
    assert.equal(await setRow(page,1).getAttribute('data-state'),'partial');
    assert.equal((await snapshot(page)).i,right);
    assert.deepEqual((await snapshot(page)).doneSteps,{[left]:1});
    await rejectSave(page,false);await completeRight.tap();
    await page.locator('.cinema-journal-sheet').waitFor({state:'hidden'});
    state=await snapshot(page);
    assert.equal(step(state).kind,'rest');
    assert.deepEqual(state.doneSteps,{[left]:1,[right]:1});
    assert.equal(state.liveSchedule[right].actualSec,7);

    await page.reload({waitUntil:'domcontentloaded'});
    await action(page,'resumeGo').click();
    await openJournal(page);
    assert.equal(await setRow(page,1).getAttribute('data-state'),'done');
    assert.match(await setRow(page,1).locator('xpath=following-sibling::tr[1]').innerText(),/✓ lijeva \(4 s\) · ✓ desna \(7 s\)/);
    assert.match(await page.locator('.cinema-journal-footer').innerText(),/50% odrađenih serija.*0:11 rada/s);
    await closeJournal(page);
    await action(page,'cinemaResume').tap();
    const secondLeft=await enterWork(page,'Lijeva strana');
    await rejectSave(page,true);await advance(page,20.1);
    await action(page,'cinemaResume').waitFor();
    state=await snapshot(page);
    assert.equal(state.i,secondLeft);
    assert.deepEqual(state.doneSteps,{[left]:1,[right]:1});
    assert.equal(await page.locator('#ringN').innerText(),'0:00');
    await rejectSave(page,false);await action(page,'cinemaResume').tap();
    await phase(page,'Promjena strane').waitFor();
    state=await snapshot(page);
    assert.equal(state.doneSteps[secondLeft],1);
    assert.equal(state.liveSchedule[secondLeft].actualSec,undefined);
    await openJournal(page);
    assert.equal(await setRow(page,2).getAttribute('data-state'),'partial');
    assert.match(await page.locator('.cinema-journal-footer').innerText(),/50% odrađenih serija.*0:31 rada/s);
    await closeJournal(page);
    const secondRight=await enterWork(page,'Desna strana');
    await advance(page,20.1);
    await page.getByRole('heading',{name:'Bravo!',exact:true}).waitFor();
    state=await snapshot(page);
    assert.equal(state.done,true);
    assert.equal(state.doneSteps[secondRight],1);
    assert.equal(state.liveSchedule[secondRight].actualSec,undefined);
    await action(page,'finishPlay').click();
    const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('mt.data.v1')));
    assert.deepEqual(saved.log[0].items[0].sideCounts,[2,2]);
    assert.deepEqual(saved.log[0].items[0].secList,[5.5,20]);
    assert.equal(saved.protocols[id].items[0].sec,20);
    await repSides(page,repsId);
    assert.deepEqual(errors,[]);
    console.log(engine,'timed side confirmation, partial journal, reload, exact work and rollback passed');
  }finally{
    await browser.close();await server.close();
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
