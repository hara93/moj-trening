'use strict';
// Real isolated browser flows: browser Back, dirty drafts, reload recovery and
// keyboard accessibility. Only this test context's synthetic data is changed.
const assert=require('node:assert/strict');
const {launch,serve,fixture,engine}=require('./runtime.cjs');
const a=(p,name)=>p.locator('[data-a="'+name+'"]');
const named=(p,name,id)=>p.locator('[data-a="'+name+'"][data-id="'+id+'"]');
const data=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('mt.data.v1')));
const draft=p=>p.evaluate(()=>JSON.parse(sessionStorage.getItem('mt.unsavedDraft.v1')));
const back=p=>p.evaluate(()=>history.back());
async function waitView(p,name){await p.locator('#app[data-key^="'+name+':"]').waitFor();}
async function advance(p,seconds){const n=await p.evaluate(()=>Date.now());await p.clock.setFixedTime(new Date(n+seconds*1000));await p.waitForTimeout(350);}
async function home(p){await p.reload();await p.getByRole('button',{name:'Moj pregled',exact:true}).waitFor();}
async function protocols(p){await home(p);await p.getByRole('button',{name:'Moj pregled',exact:true}).click();await a(p,'dashboardProtocols').first().click();}
async function discard(p){await a(p,'back').first().click();await a(p,'leaveDiscard').click();}
async function run(){
 const server=await serve(),browser=await launch(),ctx=await browser.newContext({viewport:{width:375,height:812},locale:'hr-HR',timezoneId:'Europe/Zagreb',reducedMotion:'reduce'});
 const p=await ctx.newPage(),errors=[],dialogs=[];p.setDefaultTimeout(6000);p.on('pageerror',e=>errors.push(e.message));
 p.on('dialog',async d=>{dialogs.push(d.type());await d.accept();});
 try{
  await p.clock.setFixedTime(new Date('2026-11-05T10:00:00+01:00'));
  await p.goto(server.url+'?previous=1');await p.getByRole('button',{name:'Moj pregled',exact:true}).waitFor();await p.goto(server.url);
  await a(p,'dataSheet').focus();await p.keyboard.press('Enter');await p.getByRole('dialog',{name:'Moji podaci'}).waitFor();
  for(const key of ['Tab','Tab','Shift+Tab','Tab']){await p.keyboard.press(key);assert.equal(await p.evaluate(()=>!!document.activeElement?.closest('.sheet')),true);}
  await p.keyboard.press('Escape');assert.equal(await p.evaluate(()=>document.activeElement?.dataset?.a),'dataSheet');
  await p.getByRole('button',{name:'Knjižnica vježbi',exact:true}).click();await p.locator('#libq').fill('bench');await named(p,'openEx','bench-press').click();await back(p);await waitView(p,'library');assert.equal(await p.locator('#libq').inputValue(),'bench');
  await home(p);await a(p,'dataSheet').click();const b=fixture();b.log=[];b.settings.sound=false;b.settings.planDates={};b.protocols['nav-timed']={id:'nav-timed',name:'Provjera vremenskih serija',items:[{exId:'side-plank',sets:2,sec:60,rest:5,measure:'time',sides:true}],days:[]};
  await p.locator('#importFile').setInputFiles({name:'synthetic-navigation.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(b))});await a(p,'restoreApply').click();await a(p,'restoreApply').waitFor({state:'hidden'});
  await protocols(p);await a(p,'newPr').click();await p.locator('#p-name').fill('Nacrt protokola · provjera');
  await a(p,'pickStart').click();await back(p);await waitView(p,'build');assert.equal(await p.locator('#p-name').inputValue(),'Nacrt protokola · provjera');
  await a(p,'pickStart').click();await named(p,'pickToggle','bench-press').click();await a(p,'pickDone').click();await back(p);await p.getByRole('dialog',{name:'Spremiti promjene?'}).waitFor();await p.keyboard.press('Escape');assert.equal(await p.locator('#p-name').inputValue(),'Nacrt protokola · provjera');
  assert.equal((await draft(p)).draft.items.length,1);await p.reload();await waitView(p,'build');assert.equal(await p.locator('#p-name').inputValue(),'Nacrt protokola · provjera');assert.equal((await draft(p)).draft.items.length,1);
  await p.locator('.topbar [data-a=savePr]').click();await waitView(p,'pr');const saved=Object.values((await data(p)).protocols).find(x=>x.name==='Nacrt protokola · provjera');assert.ok(saved);assert.equal(await draft(p),null);await back(p);await waitView(p,'protocols');
  await p.evaluate(()=>history.forward());await p.waitForTimeout(100);assert.notEqual(await p.locator('#app').getAttribute('data-key'),'build:'+saved.id);
  console.log('navigation: browser Back guard, picker return, refresh recovery, save and no stale Forward form passed');

  // An external change while the draft is open must not be overwritten by recovery.
  await named(p,'openPr',saved.id).click();await named(p,'editPr',saved.id).click();await p.locator('#p-name').fill('Moj nespremljeni ispravak');
  const other=await ctx.newPage();await other.goto(server.url);await other.evaluate(id=>{const d=JSON.parse(localStorage.getItem('mt.data.v1'));d.protocols[id].name='Novije spremljeno u drugoj kartici';localStorage.setItem('mt.data.v1',JSON.stringify(d));},saved.id);
  await p.reload();await waitView(p,'build');assert.match(await p.locator('#p-name').inputValue(),/Moj nespremljeni ispravak \(oporavljeni nacrt\)/);assert.equal((await data(p)).protocols[saved.id].name,'Novije spremljeno u drugoj kartici');await discard(p);await other.close();

  // Nested exercise draft: discarding it returns the still-dirty parent protocol.
  await protocols(p);await a(p,'newPr').click();await p.locator('#p-name').fill('Roditeljski nacrt');await a(p,'pickStart').click();await p.locator('#libq').fill('nepostojeca-audit-vjezba');await a(p,'newEx').click();await p.locator('#f-name').fill('Nova nespremljena vježba');await back(p);await a(p,'leaveDiscard').click();await waitView(p,'library');await back(p);await waitView(p,'build');assert.equal(await p.locator('#p-name').inputValue(),'Roditeljski nacrt');await discard(p);
  await a(p,'newPr').click();await p.evaluate(()=>{window.restoreDraftStorage=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(this===sessionStorage&&key==='mt.unsavedDraft.v1')throw new DOMException('Synthetic refusal','QuotaExceededError');return window.restoreDraftStorage.call(this,key,value);};});
  await p.locator('#p-name').fill('Odbijeni privremeni zapis');assert.match(await p.locator('.toast').innerText(),/nacrt nije sačuvan/);assert.equal(await draft(p),null);
  assert.equal(await p.evaluate(()=>{const ev=new Event('beforeunload',{cancelable:true});window.dispatchEvent(ev);return ev.defaultPrevented;}),true);
  await p.evaluate(()=>{Storage.prototype.setItem=window.restoreDraftStorage;});await p.locator('#p-name').fill('Ponovljen privremeni zapis');assert.equal((await draft(p)).draft.name,'Ponovljen privremeni zapis');await discard(p);

  await home(p);await p.getByRole('button',{name:'Moj pregled',exact:true}).click();await a(p,'todayOpen').click();await a(p,'teamNew').click();
  await p.locator('#team-title').fill('Ekipni audit');await p.locator('#team-minutes').fill('80,5');await p.locator('#team-srpe').fill('7');await p.locator('#team-notes').fill('Dvije važne bilješke.\nDrugi red ostaje.');await p.locator('[name=team-content][value=sprints]').check();
  await back(p);await p.getByRole('dialog',{name:'Spremiti promjene?'}).waitFor();await p.keyboard.press('Escape');assert.equal(await p.locator('#team-minutes').inputValue(),'80,5');assert.ok(await p.locator('[name=team-content][value=sprints]').isChecked());
  await p.reload();await waitView(p,'teamEntry');assert.equal(await p.locator('#team-minutes').inputValue(),'80,5');assert.match(await p.locator('#team-notes').inputValue(),/Drugi red ostaje/);assert.ok(await p.locator('[name=team-content][value=sprints]').isChecked());
  await a(p,'teamCancel').first().click();await a(p,'leaveSave').click();await waitView(p,'historyDetail');const team=(await data(p)).log.find(x=>x.name==='Ekipni audit');assert.equal(team.secs,4830);assert.equal(await draft(p),null);
  await a(p,'historyEdit').click();await p.locator('#history-title').fill('Nespremljena promjena');await back(p);await p.getByRole('dialog',{name:'Spremiti promjene?'}).waitFor();await p.keyboard.press('Escape');assert.equal(await p.locator('#history-title').inputValue(),'Nespremljena promjena');await p.reload();await waitView(p,'historyEdit');assert.equal(await p.locator('#history-title').inputValue(),'Nespremljena promjena');await discard(p);assert.equal((await data(p)).log.find(x=>x.historyId===team.historyId).name,'Ekipni audit');
  await home(p);await p.getByRole('button',{name:'Moj pregled',exact:true}).click();await a(p,'todayOpen').click();await a(p,'morningOpen').first().click();await p.locator('[name=energy]').selectOption('4');await back(p);await p.getByRole('dialog',{name:'Spremiti promjene?'}).waitFor();await a(p,'leaveSave').click();await waitView(p,'today');assert.equal(await draft(p),null);
  console.log('drafts: nested editor, conflict copy, team raw values/checks, history cancel and morning save passed');

  await protocols(p);await named(p,'openPr','nav-timed').click();await a(p,'startPr').click();await advance(p,6);
  const journal=p.locator('.workout-journal');await journal.waitFor();assert.equal(await p.locator('[role=tab]').count(),0);assert.equal(await journal.locator('.workout-set-row').count(),2);
  const info=journal.locator('[data-a=workoutInfo]').first();await info.focus();await p.keyboard.press('Enter');await p.locator('.workout-instructions-body').waitFor();
  for(const key of ['Tab','Shift+Tab','Tab']){await p.keyboard.press(key);assert.equal(await p.evaluate(()=>!!document.activeElement?.closest('.workout-fullscreen')),true);}
  await p.keyboard.press('Escape');await p.locator('.workout-exercise-page').waitFor();await p.keyboard.press('Escape');await p.getByRole('dialog').waitFor({state:'hidden'});
  const before=Number(await p.locator('.prog').getAttribute('aria-valuenow'));await advance(p,20);const after=await p.locator('.prog').evaluate(e=>({aria:Number(e.getAttribute('aria-valuenow')),visual:parseFloat(e.querySelector('i').style.width)}));assert.ok(after.aria>before);assert.ok(Math.abs(after.aria-after.visual)<.6);
  await journal.locator('[data-a=workoutInfo]').first().click();const paused=await p.evaluate(()=>JSON.parse(localStorage.getItem('mt.play')));await advance(p,30);await back(p);await p.locator('.workout-exercise-page').waitFor();await back(p);await p.getByRole('dialog').waitFor({state:'hidden'});const continued=await p.evaluate(()=>JSON.parse(localStorage.getItem('mt.play')));assert.equal(continued.i,paused.i);assert.equal(continued.left,paused.left);
  await back(p);await a(p,'quitResume').waitFor();await a(p,'quitResume').click();await p.reload();await a(p,'resumeGo').click();await waitView(p,'play');await back(p);await a(p,'quitDiscard').click();assert.equal((await data(p)).log.filter(x=>x.refId==='nav-timed').length,0);
  console.log('player: vertical full journal, keyboard instructions/focus containment, matching visual/ARIA progress, panel pause and Back/reload passed');

  // The guard is only a child-screen entry, not a trap at the root.
  await home(p);await p.waitForFunction(()=>history.state?.mtNavigation?.guard!==1);
  await p.evaluate(()=>history.forward());await p.waitForTimeout(200);await p.waitForFunction(()=>history.state?.mtNavigation?.guard!==1);
  await p.evaluate(()=>history.back());await p.waitForURL(/previous=1/);
  assert.deepEqual(errors,[]);console.log(engine+' navigation/accessibility regression passed; native unload warnings: '+dialogs.length);
 }finally{await ctx.close();await browser.close();await server.close();}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
