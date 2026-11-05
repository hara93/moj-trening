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
  const d=await p.locator(scope).evaluate(el=>({width:innerWidth,view:el.clientWidth,sw:el.scrollWidth,body:document.documentElement.scrollWidth}));
  assert.ok(d.body<=d.width+1 && d.sw<=d.view+1,JSON.stringify(d));
}
async function protocols(p){await home(p);await p.getByRole('button',{name:'Moj pregled',exact:true}).click();await A(p,'dashboardProtocols').first().click();}
async function fillEdit(p,j,set,vals,live=false){
  await p.locator('[data-a="'+(live?'playDoseEdit':'previewDoseEdit')+'"][data-j="'+j+'"]').click();
  const f=p.locator('#play-dose-form');await f.waitFor();
  for(const [key,value] of Object.entries(vals))await f.locator('[data-dose-set="'+set+'"] [data-dose-value="'+key+'"]').fill(String(value));
  await A(p,'playDoseApply').click();await f.waitFor({state:'hidden'});
}
async function solo(p){
  await home(p);await p.getByRole('button',{name:'Knjižnica vježbi',exact:true}).click();await by(p,'openEx','bench-press').click();
  await p.getByRole('button',{name:'Doziranje',exact:true}).click();const c=p.locator('#swc-dose');await c.waitFor();assert.equal(await c.locator('.set-item').count(),2);assert.equal(await c.locator('[data-state=planned]').count(),2);
  await p.locator('[data-a=dose][data-i="1"]').click();assert.equal(await c.locator('.set-item').count(),3);
  await fillEdit(p,0,3,{reps:3,kg:'27,5'});assert.match(await c.locator('.set-item').nth(2).innerText(),/3 pon.*27,5 kg/);
  assert.equal((await store(p)).exercises['bench-press'].kg,20);
  await A(p,'exerciseLoad').click();await p.getByRole('heading',{name:'Opterećenje i povijest'}).waitFor();assert.match(await p.locator('.view').innerText(),/Još nema treninga/);await A(p,'back').first().click();assert.equal(await c.locator('.set-item').count(),3);
  await p.setViewportSize({width:320,height:812});await layout(p,'#swc-dose');await p.setViewportSize({width:375,height:812});
  await by(p,'playEx','bench-press').click();const draft=await play(p);assert.equal(draft.items[0].sets,3);assert.deepEqual(draft.items[0].kgList,[20,20,27.5]);assert.equal(draft.originalItems[0].kg,20);
  await A(p,'quitPlay').click();await A(p,'quitDiscard').click();assert.equal((await store(p)).log.length,0);
  record('solo',{preset:3,plannedOnly:true,thirdDose:'3×27.5',loadHistoryAvailable:true,sourceKg:20});
}
async function superset(p){
  await protocols(p);await by(p,'openPr','audit-unknown').click();assert.match(await p.locator('.pre-sets').innerText(),/Početna težina nije upisana/);
  await protocols(p);await by(p,'openPr',prId).click();const panel=p.locator('.pre-sets');assert.equal(await panel.locator('.set-item').count(),4);assert.equal(await panel.locator('li[data-state="planned"]').count(),4);assert.equal(await A(p,'checklistDone').count(),0);
  await by(p,'openEx','side-plank').click();await A(p,'back').first().click();assert.equal(await panel.locator('.set-item').count(),4);
  await A(p,'toggleDosePlan').click();assert.equal(await panel.locator('.set-item').count(),0);await A(p,'toggleDosePlan').click();assert.equal(await panel.locator('.set-item').count(),4);
  await fillEdit(p,0,2,{reps:4,kg:30});assert.match(await panel.locator('.set-item').nth(1).innerText(),/4 pon.*30 kg/);
  await p.setViewportSize({width:320,height:812});await layout(p,'.pre-sets');await p.setViewportSize({width:375,height:812});
  await p.screenshot({path:path.join(artifacts,useWebKit?'checklist-prestart-webkit-375.png':'checklist-prestart-375.png')});
  await A(p,'startPr').click();await p.locator('.play-card-tabs [data-i="2"]').click();const live=p.locator('#play-card-2');
  assert.equal(await live.locator('.set-item').count(),4);assert.equal(await A(p,'checklistDone').count(),0);
  await advance(p,6);const active=A(p,'checklistDone');assert.equal(await active.count(),1);assert.equal(await active.getAttribute('data-j'),'0');assert.equal(await active.getAttribute('data-set'),'1');await active.click();
  const rir=p.locator('[data-a=rir][data-v="0"]');if(await rir.count())await rir.first().click();
  const marked=live.locator('.set-item').first();assert.equal(await marked.getAttribute('data-state'),'done');if(await rir.count())assert.match(await marked.innerText(),/RIR 0/);
  assert.equal(await A(p,'checklistDone').count(),0);
  const start=p.getByRole('button',{name:'Kreni',exact:true});
  const firstHold=live.locator('.set-item').nth(2);
  for(let i=0;i<18 && await firstHold.getAttribute('data-state')!=='active';i++){
    if(await start.isVisible())await start.click();else await advance(p,2);
  }
  assert.equal(await firstHold.getAttribute('data-state'),'active');
  await advance(p,3);
  const help=p.getByRole('button',{name:'Kako se bilježe serije',exact:true});
  await help.click();
  const dialog=p.getByRole('dialog',{name:'Kako se bilježe serije',exact:true});await dialog.waitFor();
  assert.equal(await dialog.locator('.set-legend li').count(),5);
  const paused=await play(p);await advance(p,35);assert.equal((await play(p)).i,paused.i);assert.match(await p.locator('#phint').innerText(),/Pauzirano/);
  await p.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});const runningAgain=await play(p);assert.equal(runningAgain.i,paused.i);assert.equal(runningAgain.left,paused.left);assert.ok(await p.getByRole('button',{name:'Pauziraj',exact:true}).isVisible());
  assert.equal(await p.evaluate(()=>document.activeElement?.dataset?.a),'playDoseHelp');
  await p.getByRole('button',{name:'Pauziraj',exact:true}).click();await help.click();await advance(p,28);
  await p.locator('.sheet-bg').click({position:{x:2,y:2}});await dialog.waitFor({state:'hidden'});assert.ok(await p.getByRole('button',{name:'Nastavi',exact:true}).isVisible());assert.equal((await play(p)).left,paused.left);
  await p.getByRole('button',{name:'Nastavi',exact:true}).click();record('legend',{states:5,elapsedWhileHelpOpen:63,sameRemainingSeconds:paused.left,runningRestoredAfterEscape:true,previousPauseRestoredAfterBackdrop:true});
  assert.equal(await A(p,'checklistDone').count(),0);await advance(p,16);
  assert.equal(await live.locator('.set-item').nth(2).getAttribute('data-state'),'partial');assert.match(await live.locator('.set-item').nth(2).innerText(),/✓ Lijeva · ○ Desna/);
  const before=await play(p);await p.reload();await A(p,'resumeGo').click();const resumed=await play(p);assert.deepEqual(resumed.doneSteps,before.doneSteps);assert.equal(await live.locator('.set-item').nth(2).getAttribute('data-state'),'partial');
  await p.locator('.view').evaluate(el=>el.scrollTo(0,document.querySelector('.play-cards').offsetTop-10));
  await p.screenshot({path:path.join(artifacts,useWebKit?'checklist-live-webkit-375.png':'checklist-live-375.png')});
  await p.setViewportSize({width:320,height:812});await layout(p,'#play-card-2');await p.setViewportSize({width:375,height:812});
  await p.locator('[data-a="jump"][data-d="1"]').click();
  if(await start.isVisible())await start.click();
  const second=live.locator('[data-a=checklistDone][data-j="0"][data-set="2"]');await second.waitFor();await second.click();
  await A(p,'quitPlay').click();await A(p,'quitSave').click();if(await A(p,'finishPlay').isVisible())await A(p,'finishPlay').click();
  const d=await store(p),row=d.log[0];assert.deepEqual(row.items[0].kgList,[20,30]);assert.deepEqual(row.items[0].repsList,[5,4]);assert.deepEqual(row.items[1].sideCounts,[1]);assert.equal(d.protocols[prId].items[0].kg,20);
  record('superset',{realCheckboxes:2,originalBenchKg:20,done:row.items[0].kgList,partialTimed:row.items[1].sideCounts,sourceRows:4});
}
async function longList(p){
  await protocols(p);await by(p,'openPr','audit-long').click();
  await p.setViewportSize({width:320,height:700});await layout(p,'.pre-sets');
  const planned=p.locator('.pre-sets li.set-item');
  assert.equal(await planned.count(),24);await planned.last().scrollIntoViewIfNeeded();assert.match(await planned.last().innerText(),/Krug 12/);
  await A(p,'startPr').click();await p.locator('.play-card-tabs [data-i="2"]').click();
  const live=p.locator('#play-card-2 li.set-item');assert.equal(await live.count(),24);await live.last().scrollIntoViewIfNeeded();await layout(p,'#play-card-2');assert.match(await live.last().innerText(),/Krug 12/);
  const dimensions=await p.locator('#play-card-2 .play-card-content').evaluate(el=>[el.clientHeight,el.scrollHeight,document.querySelector('.view').scrollTop]);
  assert.ok(dimensions[0]+1>=dimensions[1] && dimensions[2]>1000,'the enclosing page can scroll to final set '+JSON.stringify(dimensions));assert.equal(await p.locator('[data-state=done]').count(),0);
  await A(p,'quitPlay').click();await A(p,'quitDiscard').click();record('long-default-checklist',{rows:24,width:320,pageScroll:dimensions[2],fabricatedCompletions:0});
}
async function mixedWeights(p){
  await protocols(p);await by(p,'openPr','audit-mixed').click();
  const entries=p.locator('.pre-sets .set-block').first().locator('.set-item');assert.match(await entries.nth(0).innerText(),/10 kg/);assert.match(await entries.nth(1).innerText(),/Početna težina nije/);assert.match(await entries.nth(2).innerText(),/0 kg/);
  await p.locator('[data-a="previewDoseEdit"][data-j="0"]').click();
  const f=p.locator('#play-dose-form');assert.equal(await f.locator('[data-dose-set="2"] [data-dose-value=kg]').inputValue(),'');
  assert.equal(await f.locator('[data-dose-set="3"] [data-dose-value=kg]').inputValue(),'0');
  await f.locator('[data-dose-set="1"] [data-dose-value=reps]').fill('7');await A(p,'playDoseApply').click();
  await A(p,'startPr').click();const gate=p.locator('#starting-load-form');await gate.waitFor();
  assert.equal(await gate.locator('[data-start-kg]').count(),1);await gate.locator('[data-start-kg]').fill('12');
  await gate.getByRole('button',{name:'Spremi i kreni'}).click();
  const active=await play(p);assert.deepEqual(active.items[0].kgList,[10,12,0]);assert.equal(active.items[0].repsList[0],7);assert.equal(active.originalItems[0].reps,5);
  await A(p,'quitPlay').click();await A(p,'quitDiscard').click();
  const before=(await store(p)).protocols['audit-mixed'];await protocols(p);await by(p,'openPr','audit-mixed').click();await by(p,'editPr','audit-mixed').first().click();await p.locator('#p-name').fill('Promijenjen naslov');await p.locator('.topbar [data-a="savePr"]').click();
  const items=(await store(p)).protocols['audit-mixed'].items;assert.deepEqual(items[0].kgList,before.items[0].kgList);assert.deepEqual(items[1].secList,[20,15]);assert.equal(items[2].startingKgKnown,true);
  await by(p,'editPr','audit-mixed').first().click();await p.locator('[data-a="itOpen"][data-i="0"]').click();
  await p.locator('[data-ikg="0"]').fill('22');await p.locator('[data-ikg="0"]').press('Tab');
  await p.locator('[data-a="itOpen"][data-i="1"]').click();await p.locator('[data-a="istep"][data-k="sets"][data-i="1"][data-d="1"]').click();
  await p.locator('.topbar [data-a="savePr"]').click();const edited=(await store(p)).protocols['audit-mixed'].items;
  assert.equal(edited[0].kgList,undefined);assert.equal(edited[0].kg,22);assert.deepEqual(edited[1].secList,[20,15,15]);assert.equal(edited[2].startingKgKnown,true);
  await by(p,'editPr','audit-mixed').first().click();await p.locator('[data-a="itOpen"][data-i="1"]').click();await p.locator('[data-a="istep"][data-k="sec"][data-i="1"][data-d="1"]').click();
  await p.locator('.topbar [data-a="savePr"]').click();const uniform=(await store(p)).protocols['audit-mixed'].items[1];assert.equal(uniform.sec,25);assert.equal(uniform.secList,undefined);
  record('mixed-source-editor',{previewUnknownStillPrompts:true,afterConfirm:[10,12,0],landmine0:true,titlePreservesLists:true,adjustedScalarWins:true,alignedSeconds:[20,15,15]});
}
async function run(){
  await new Promise((r,j)=>{server.once('error',j);server.listen(0,'127.0.0.1',r);});
  const browser=await launch();
  try{const ctx=await browser.newContext({viewport:{width:375,height:812},hasTouch:true,isMobile:true,locale:'hr-HR',timezoneId:'Europe/Zagreb',reducedMotion:'reduce'});
    const p=await ctx.newPage();p.setDefaultTimeout(4500);const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.clock.setFixedTime(new Date(fixed));await p.goto('http://127.0.0.1:'+server.address().port+'/');
    try{await seed(p);if(process.argv.includes('just-mixed')){await mixedWeights(p);assert.deepEqual(errors,[]);return;}if(!process.argv.includes('just-long')){await solo(p);await superset(p);}await longList(p);assert.deepEqual(errors,[]);}
    catch(e){console.error('view:',(await p.locator('.view').allInnerTexts()).join().slice(0,1300));console.error('dialog:',await p.getByRole('dialog').allInnerTexts());throw e;}
    finally{await ctx.close();}
  }finally{await browser.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
