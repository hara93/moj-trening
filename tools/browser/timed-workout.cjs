'use strict';

const assert=require('node:assert/strict');
const {engine,fixture,launch,serve,openJournal,closeJournal}=require('./runtime.cjs');

const action=(page,name)=>page.locator('[data-a="'+name+'"]');
const snapshot=page=>page.evaluate(()=>JSON.parse(localStorage.getItem('mt.play')));
const step=state=>state.liveSchedule[state.i];
const setRow=(page,n)=>page.locator('.cinema-journal .workout-set-row[data-set="'+n+'"]');
const phase=(page,side)=>page.locator('.workout-cinema-heading').getByText(new RegExp(side));
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
(async()=>{
  const server=await serve(),browser=await launch();
  try{
    const page=await browser.newPage({viewport:{width:393,height:852},isMobile:true,hasTouch:true});
    const errors=[];page.on('pageerror',error=>errors.push(error));
    await page.clock.setFixedTime(new Date('2026-11-06T10:00:00+01:00'));
    await page.goto(server.url);
    const data=fixture(),id='timed-hold-audit';
    data.log=[];data.programs={};data.settings.sound=false;
    data.protocols={[id]:{id,name:'Provjera Copenhagen planka',tag:'Teretana',days:[],
      items:[{exId:'kopenhagen-kratka',measure:'time',sets:2,reps:1,sec:20,rest:30,sides:true,section:'Priprema'}]}};
    await action(page,'dataSheet').click();
    await page.locator('#importFile').setInputFiles({name:'timed-hold-audit.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});
    await action(page,'restoreApply').click();await action(page,'restoreApply').waitFor({state:'hidden'});
    await page.reload({waitUntil:'domcontentloaded'});
    await page.getByRole('button',{name:'Moj pregled',exact:true}).click();
    await action(page,'dashboardProtocols').click();
    await page.locator('[data-a="openPr"][data-id="'+id+'"]').click();
    await action(page,'startPr').click();

    const left=await enterWork(page,'Lijeva strana');
    await advance(page,4);
    await page.getByRole('button',{name:'Završi lijevu stranu',exact:true}).tap();
    let state=await snapshot(page);
    assert.equal(step(state).kind,'switch');
    assert.deepEqual(state.doneSteps,{[left]:1});
    assert.equal(state.liveSchedule[left].actualSec,4);
    await phase(page,'Promjena strane').waitFor();
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
    assert.deepEqual(errors,[]);
    console.log(engine,'timed side confirmation, partial journal, reload, exact work and rollback passed');
  }finally{
    await browser.close();await server.close();
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
