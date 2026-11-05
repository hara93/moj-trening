'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const {launch,repo,artifacts,fixture:baseFixture}=require('./runtime.cjs');
const useWebKit=process.argv.includes('webkit');

const mime = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.mp4':'video/mp4'};
const server = http.createServer((req,res)=>{
  const url = new URL(req.url,'http://127.0.0.1');
  const p = path.resolve(repo,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
  if (!p.startsWith(repo+path.sep) || !fs.existsSync(p) || !fs.statSync(p).isFile()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, {'Content-Type':mime[path.extname(p)]||'application/octet-stream'}); fs.createReadStream(p).pipe(res);
});
const fixed='2026-11-04T10:00:00+01:00';
const A=(p,k)=>p.locator('[data-a="'+k+'"]');
const by=(p,k,id)=>p.locator('[data-a="'+k+'"][data-id="'+id+'"]');
const record=(k,d)=>console.log(k,JSON.stringify(d));
const prId='audit-live-sets';
const play=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('mt.play')));
const store=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('mt.data.v1')));
async function home(p){await p.reload({waitUntil:'domcontentloaded'});await p.getByRole('button',{name:'Knjižnica vježbi',exact:true}).waitFor();}
async function advance(p,sec){const now=await p.evaluate(()=>Date.now());await p.clock.setFixedTime(new Date(now+sec*1000));await p.waitForTimeout(350);}
async function seed(p){
  const b=baseFixture();
  b.log=[];b.settings.sound=false;b.settings.planDates={};
  Object.assign(b.exercises['bench-press'],{sets:2,reps:5,kg:20,rest:15});
  const base={exId:'bench-press',measure:'sets',sets:2,kg:20,reps:5,rest:0,sec:30,ss:'a'};
  b.protocols[prId]={id:prId,name:'Kontrolni superset',items:[base,{...base,exId:'side-plank',measure:'time',sec:15,sides:true,kg:0,rest:15}],days:[]};
  b.protocols['audit-long']={id:'audit-long',name:'Dugi kružni primjer',items:[{...base,sets:12},{...base,exId:'side-plank',sets:12,measure:'time',sec:15,sides:true,kg:0,rest:15}],days:[]};
  b.protocols['audit-mixed']={id:'audit-mixed',name:'Mješoviti upis',items:[
    {...base,ss:null,sets:3,kg:0,kgList:[10,null,0],rest:30},
    {...base,ss:null,exId:'side-plank',measure:'time',sets:2,sec:20,secList:[20,15],kg:0,rest:15,sides:true},
    {...base,ss:null,exId:'landmine-squat',sets:2,kg:0,startingKgKnown:true}
  ]};
  b.protocols['audit-unknown']={id:'audit-unknown',name:'Nedostaje početna težina',items:[{...base,kg:0}]};
  await home(p);await A(p,'dataSheet').click();await p.locator('#importFile').setInputFiles({name:'primjer-serija.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(b))});await A(p,'restoreApply').click();await A(p,'restoreApply').waitFor({state:'hidden'});
}
async function layout(p,scope){
  const d=await p.locator(scope).last().evaluate(el=>({width:innerWidth,view:el.clientWidth,sw:el.scrollWidth,body:document.documentElement.scrollWidth}));
  assert.ok(d.body<=d.width+1 && d.sw<=d.view+1,JSON.stringify(d));
}
async function protocols(p){await home(p);await p.getByRole('button',{name:'Moj pregled',exact:true}).click();await A(p,'dashboardProtocols').first().click();}
async function exercise(p,j){
  await p.locator('[data-a="workoutExercise"][data-j="'+j+'"]').first().click();await p.locator('.workout-exercise-page').waitFor();
}
function row(p,j,set,scope='.workout-exercise-page'){return p.locator(scope).last().locator('.workout-set-row[data-set="'+set+'"]:has([data-j="'+j+'"])');}
async function inline(p,j,set,key,value,scope='.workout-exercise-page'){
  const input=row(p,j,set,scope).locator('[data-field="'+key+'"]');await input.fill(String(value));await input.press('Tab');
}
async function fillEdit(p,j,set,vals,live=false){
  await exercise(p,j);
  for(const [key,value] of Object.entries(vals))await inline(p,j,set,key,value);
  await A(p,'workoutClose').click();
}
async function solo(p){
  await home(p);await p.getByRole('button',{name:'Knjižnica vježbi',exact:true}).click();await by(p,'openEx','bench-press').click();
  const c=p.locator('.workout-exercise-page').last();await c.waitFor();assert.equal(await c.locator('.workout-set-row').count(),2);assert.equal(await c.locator('.workout-set-row[data-state=planned]').count(),2);assert.equal(await p.locator('[role=tab]').count(),0);
  await p.locator('.workout-plan-options summary').click();await A(p,'workoutEdit').click();const f=p.locator('#play-dose-form');await f.locator('[name=sets]').fill('3');await A(p,'playDoseResize').click();await f.locator('[data-dose-set="3"] [data-dose-value=reps]').fill('3');await f.locator('[data-dose-set="3"] [data-dose-value=kg]').fill('27,5');await A(p,'playDoseApply').click();
  assert.equal(await c.locator('.workout-set-row').count(),3);assert.equal(await row(p,0,3).locator('[data-field=kg]').inputValue(),'27,5');assert.equal((await store(p)).exercises['bench-press'].kg,20);
  await A(p,'workoutHistory').last().click();await p.locator('.workout-exercise-panel').waitFor();assert.match(await p.locator('.workout-panel-body').innerText(),/Još nema/);await A(p,'workoutPanelBack').click();assert.equal(await c.locator('.workout-set-row').count(),3);
  await A(p,'workoutTrends').last().click();assert.equal(await p.locator('.workout-chart').count(),1);assert.equal(await p.locator('.workout-chart svg').count(),0);await A(p,'workoutPanelBack').click();
  await p.setViewportSize({width:320,height:812});await layout(p,'.workout-exercise-page');await p.setViewportSize({width:375,height:812});
  await by(p,'playEx','bench-press').last().click();const draft=await play(p);assert.equal(draft.items[0].sets,3);assert.deepEqual(draft.items[0].kgList,[20,20,27.5]);assert.equal(draft.originalItems[0].kg,20);
  await A(p,'quitPlay').click();await A(p,'quitDiscard').click();assert.equal((await store(p)).log.length,0);
  record('solo',{sets:3,plannedOnly:true,thirdDose:'3×27.5',historyAndTrendsAvailable:true,sourceKg:20});
}
async function superset(p){
  await protocols(p);await by(p,'openPr','audit-unknown').click();await exercise(p,0);assert.equal(await row(p,0,1).locator('[data-field=kg]').inputValue(),'');await A(p,'workoutClose').click();
  await protocols(p);await by(p,'openPr',prId).click();const panel=p.locator('.workout-overview');assert.equal(await panel.locator('.workout-compact-row').count(),2);assert.equal(await A(p,'workoutSetDone').count(),0);
  await exercise(p,1);assert.equal(await p.locator('.workout-exercise-page .workout-set-row').count(),2);assert.ok((await p.locator('.workout-exercise-page').innerText()).includes('SIR'));await A(p,'workoutClose').click();
  await fillEdit(p,0,2,{reps:4,kg:30});
  await p.setViewportSize({width:320,height:812});await layout(p,'.workout-overview');await p.setViewportSize({width:375,height:812});
  await p.screenshot({path:path.join(artifacts,useWebKit?'checklist-prestart-webkit-375.png':'checklist-prestart-375.png')});
  await A(p,'startPr').click();const live=p.locator('.workout-journal');assert.equal(await live.locator('.workout-set-row').count(),4);assert.equal(await A(p,'workoutSetDone').count(),0);
  await advance(p,6);const active=A(p,'workoutSetDone');assert.equal(await active.count(),1);assert.equal(await active.getAttribute('data-j'),'0');assert.equal(await active.getAttribute('data-set'),'1');
  const beforeRefusal=await play(p);await p.evaluate(()=>{window.realSet=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='mt.play')throw new DOMException('Synthetic refusal','QuotaExceededError');return window.realSet.call(this,k,v);};});await active.click();assert.equal((await play(p)).i,beforeRefusal.i);assert.deepEqual((await play(p)).doneSteps,beforeRefusal.doneSteps);assert.equal(await row(p,0,1,'.workout-journal').getAttribute('data-state'),'active');assert.match(await p.locator('.toast').innerText(),/nije spremljena/);await p.evaluate(()=>{Storage.prototype.setItem=window.realSet;});await active.click();
  const rir=p.locator('[data-a=rir][data-v="0"]');if(await rir.count())await rir.first().click();
  const marked=row(p,0,1,'.workout-journal');assert.equal(await marked.getAttribute('data-state'),'done');
  await inline(p,0,1,'rir','0','.workout-journal');assert.equal(await marked.locator('[data-field=rir]').inputValue(),'0');assert.equal(await A(p,'workoutSetDone').count(),0);
  const start=p.getByRole('button',{name:'Kreni',exact:true}),firstHold=row(p,1,1,'.workout-journal');
  for(let i=0;i<18 && await firstHold.getAttribute('data-state')!=='active';i++){if(await start.isVisible())await start.click();else await advance(p,2);}
  assert.equal(await firstHold.getAttribute('data-state'),'active');await advance(p,3);
  const help=live.locator('[data-a=workoutInfo][data-j="1"]');await help.click();await p.locator('.workout-instructions-body').waitFor();const paused=await play(p);await advance(p,35);assert.equal((await play(p)).i,paused.i);
  await p.keyboard.press('Escape');await p.locator('.workout-exercise-page').waitFor();await p.keyboard.press('Escape');await p.getByRole('dialog').waitFor({state:'hidden'});const runningAgain=await play(p);assert.equal(runningAgain.i,paused.i);assert.equal(runningAgain.left,paused.left);assert.ok(await p.getByRole('button',{name:'Pauziraj',exact:true}).isVisible());
  await p.getByRole('button',{name:'Pauziraj',exact:true}).click();await help.click();await advance(p,28);await p.keyboard.press('Escape');await p.locator('.workout-exercise-page').waitFor();await p.keyboard.press('Escape');await p.getByRole('dialog').waitFor({state:'hidden'});assert.ok(await p.getByRole('button',{name:'Nastavi',exact:true}).isVisible());assert.equal((await play(p)).left,paused.left);
  await p.getByRole('button',{name:'Nastavi',exact:true}).click();record('instructionsPause',{elapsedWhileOpen:63,sameRemainingSeconds:paused.left,runningAndPausedRestored:true});
  assert.equal(await A(p,'workoutSetDone').count(),0);await advance(p,16);assert.equal(await firstHold.getAttribute('data-state'),'partial');assert.match(await firstHold.locator('xpath=following-sibling::tr[1]').innerText(),/✓ lijeva · ○ desna/);
  const before=await play(p);await p.reload();await A(p,'resumeGo').click();const resumed=await play(p);assert.deepEqual(resumed.doneSteps,before.doneSteps);assert.equal(await firstHold.getAttribute('data-state'),'partial');
  await p.screenshot({path:path.join(artifacts,useWebKit?'checklist-live-webkit-375.png':'checklist-live-375.png')});await p.setViewportSize({width:320,height:812});await layout(p,'.workout-journal');await p.setViewportSize({width:375,height:812});
  await p.locator('[data-a="jump"][data-d="1"]').click();if(await start.isVisible())await start.click();const second=live.locator('[data-a=workoutSetDone][data-j="0"][data-set="2"]');await second.waitFor();await second.click();
  await A(p,'quitPlay').click();await A(p,'quitSave').click();if(await A(p,'finishPlay').isVisible())await A(p,'finishPlay').click();const d=await store(p),entry=d.log[0];assert.deepEqual(entry.items[0].kgList,[20,30]);assert.deepEqual(entry.items[0].repsList,[5,4]);assert.deepEqual(entry.items[1].sideCounts,[1]);assert.equal(d.protocols[prId].items[0].kg,20);
  record('superset',{realCheckboxes:2,originalBenchKg:20,done:entry.items[0].kgList,partialTimed:entry.items[1].sideCounts,sourceRows:4});
}
async function longList(p){
  await protocols(p);await by(p,'openPr','audit-long').click();await p.setViewportSize({width:320,height:700});await layout(p,'.workout-overview');assert.equal(await p.locator('.workout-compact-row').count(),2);
  await exercise(p,1);const planned=p.locator('.workout-exercise-page .workout-set-row');assert.equal(await planned.count(),12);await planned.last().scrollIntoViewIfNeeded();assert.equal(await planned.last().getAttribute('data-set'),'12');await layout(p,'.workout-exercise-page');await A(p,'workoutClose').click();
  await A(p,'startPr').click();const live=p.locator('.workout-journal .workout-set-row');assert.equal(await live.count(),24);await live.last().scrollIntoViewIfNeeded();await layout(p,'.workout-journal');assert.equal(await live.last().getAttribute('data-set'),'12');const scroll=await p.locator('.workout-journal').evaluate(el=>el.scrollTop);assert.ok(scroll>1000,'the page scrolls to every set: '+scroll);assert.equal(await p.locator('.workout-set-row[data-state=done]').count(),0);
  await A(p,'quitPlay').click();await A(p,'quitDiscard').click();record('long-default-checklist',{rows:24,width:320,pageScroll:scroll,fabricatedCompletions:0});
}
async function mixedWeights(p){
  await protocols(p);await by(p,'openPr','audit-mixed').click();
  await exercise(p,0);assert.equal(await row(p,0,1).locator('[data-field=kg]').inputValue(),'10');assert.equal(await row(p,0,2).locator('[data-field=kg]').inputValue(),'');assert.equal(await row(p,0,3).locator('[data-field=kg]').inputValue(),'0');await inline(p,0,1,'reps','7');assert.equal(await row(p,0,2).locator('[data-field=kg]').inputValue(),'');await A(p,'workoutClose').click();
  await A(p,'startPr').click();const gate=p.locator('#starting-load-form');await gate.waitFor();
  assert.equal(await gate.locator('[data-start-kg]').count(),1);await gate.locator('[data-start-kg]').fill('12');
  await gate.getByRole('button',{name:'Spremi i kreni'}).click();
  const active=await play(p);assert.deepEqual(active.items[0].kgList,[10,12,0]);assert.equal(active.items[0].repsList[0],7);assert.equal(active.originalItems[0].reps,5);
  await A(p,'quitPlay').click();await A(p,'quitDiscard').click();
  const before=(await store(p)).protocols['audit-mixed'];await protocols(p);await by(p,'openPr','audit-mixed').click();await A(p,'workoutProtocolOptions').click();await by(p,'editPr','audit-mixed').first().click();await p.locator('#p-name').fill('Promijenjen naslov');await p.locator('.topbar [data-a="savePr"]').click();
  const items=(await store(p)).protocols['audit-mixed'].items;assert.deepEqual(items[0].kgList,before.items[0].kgList);assert.deepEqual(items[1].secList,[20,15]);assert.equal(items[2].startingKgKnown,true);
  await A(p,'workoutProtocolOptions').click();await by(p,'editPr','audit-mixed').first().click();await p.locator('[data-a="itOpen"][data-i="0"]').click();
  await p.locator('[data-ikg="0"]').fill('22');await p.locator('[data-ikg="0"]').press('Tab');
  await p.locator('[data-a="itOpen"][data-i="1"]').click();await p.locator('[data-a="istep"][data-k="sets"][data-i="1"][data-d="1"]').click();
  await p.locator('.topbar [data-a="savePr"]').click();const edited=(await store(p)).protocols['audit-mixed'].items;
  assert.equal(edited[0].kgList,undefined);assert.equal(edited[0].kg,22);assert.deepEqual(edited[1].secList,[20,15,15]);assert.equal(edited[2].startingKgKnown,true);
  await A(p,'workoutProtocolOptions').click();await by(p,'editPr','audit-mixed').first().click();await p.locator('[data-a="itOpen"][data-i="1"]').click();await p.locator('[data-a="istep"][data-k="sec"][data-i="1"][data-d="1"]').click();
  await p.locator('.topbar [data-a="savePr"]').click();const uniform=(await store(p)).protocols['audit-mixed'].items[1];assert.equal(uniform.sec,25);assert.equal(uniform.secList,undefined);
  record('mixed-source-editor',{previewUnknownStillPrompts:true,afterConfirm:[10,12,0],landmine0:true,titlePreservesLists:true,adjustedScalarWins:true,alignedSeconds:[20,15,15]});
}
async function run(){
  await new Promise((r,j)=>{server.once('error',j);server.listen(0,'127.0.0.1',r);});
  const browser=await launch();
  try{const ctx=await browser.newContext({viewport:{width:375,height:812},hasTouch:true,isMobile:true,locale:'hr-HR',timezoneId:'Europe/Zagreb',reducedMotion:'reduce'});
    const p=await ctx.newPage();p.setDefaultTimeout(4500);const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.clock.setFixedTime(new Date(fixed));await p.goto('http://127.0.0.1:'+server.address().port+'/');
    try{await seed(p);if(process.argv.includes('just-mixed')){await mixedWeights(p);assert.deepEqual(errors,[]);return;}if(!process.argv.includes('just-long')){await solo(p);await superset(p);}await longList(p);await mixedWeights(p);assert.deepEqual(errors,[]);}
    catch(e){console.error('view:',(await p.locator('.view').allInnerTexts()).join().slice(0,1300));console.error('dialog:',await p.getByRole('dialog').allInnerTexts());throw e;}
    finally{await ctx.close();}
  }finally{await browser.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
