'use strict';
const {openJournal,closeJournal,openQuit,openCinemaControls,pressCinemaMain}=require('./runtime.cjs');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const {launch,repo,artifacts,engine,withOffline,fixture:baseFixture}=require('./runtime.cjs');
const mime = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.mp4':'video/mp4'};
const server = http.createServer((req,res)=>{
  const url = new URL(req.url,'http://127.0.0.1');
  const p = path.resolve(repo,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
  if (!p.startsWith(repo+path.sep) || !fs.existsSync(p) || !fs.statSync(p).isFile()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, {'Content-Type':mime[path.extname(p)]||'application/octet-stream'}); fs.createReadStream(p).pipe(res);
});
const fixed='2026-11-04T10:00:00+01:00';
const nowDate='2026-11-04';
const prName='Provjera · izmjenični potisak i bočni plank';
const fieldId='intervali-15-15';
const ownField='Poligon · kratki primjer';
const results=[];
const A=(p,name)=>p.locator('[data-a="'+name+'"]');
const by=(p,name,id)=>p.locator('[data-a="'+name+'"][data-id="'+id+'"]');
const store=(p)=>p.evaluate(()=>JSON.parse(localStorage.getItem('mt.data.v1')));
const play=(p)=>p.evaluate(()=>JSON.parse(localStorage.getItem('mt.play')));
const record=(key,facts)=>{results.push({key,...facts});console.log(key,JSON.stringify(facts));};
async function home(p){const response=await p.reload({waitUntil:'domcontentloaded'});await p.getByRole('button',{name:'Knjižnica vježbi',exact:true}).waitFor();return response;}
async function tab(p,name){await p.locator('.tab[data-tab="'+name+'"]').click();}
async function advance(p,secs){const n=await p.evaluate(()=>Date.now());await p.clock.setFixedTime(new Date(n+secs*1000));await p.waitForTimeout(320);}
async function importTest(p){const data=baseFixture();
  data.log=[{kind:'field',refId:'ss-pre-1a',historyId:'audit-plan1a',name:'Provjera · raniji plan 1A',at:Date.parse(fixed)-86400000*7,secs:600}];data.settings.planDates={};data.settings.sound=false;
  const f=data.field[fieldId];f.name_hr=ownField;f.blocks=[{...f.blocks[0],sets:1,reps:2,work_s:10,rest_s:8}];
  data.field['audit-extra']={...f,id:'audit-extra',name_hr:'Provjera · ostali poligon'};
  await home(p); await A(p,'dataSheet').click();
  await p.locator('#importFile').setInputFiles({name:'synthetic-workout.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});
  await A(p,'restoreApply').click();await A(p,'restoreApply').waitFor({state:'hidden'});
}
async function noOverflow(p,ctx){const d=await p.evaluate(()=>({width:innerWidth,doc:document.documentElement.scrollWidth,view:document.querySelector('.view').scrollWidth,vw:document.querySelector('.view').clientWidth}));
  assert.ok(d.doc<=d.width+1 && d.view<=d.vw+1,ctx+' '+JSON.stringify(d));}
async function offlineReady(p,phase){
  try {await p.waitForFunction(()=>!!navigator.serviceWorker.controller,null,{timeout:30000});}
  catch(error){
    console.error('Offline worker state ('+phase+'):',await p.evaluate(async()=>({readyState:document.readyState,registrations:(await navigator.serviceWorker.getRegistrations()).map(r=>({scope:r.scope,active:r.active?.state,installing:r.installing?.state,waiting:r.waiting?.state})),controller:navigator.serviceWorker.controller?.scriptURL||null})));
    throw error;
  }
}
async function basics(p){
  await home(p); assert.equal(await A(p,'monthOpen').count(),0);
  assert.equal(await p.locator('.tab').count(),4); assert.equal(await p.locator('.tab[data-tab="analytics"]').count(),1);
  let count=(await store(p)).log.length;
  const dots=p.locator('#dots .dot'),cards=p.locator('#car .hcard');assert.equal(await dots.count(),5);
  await dots.nth(3).focus();await p.keyboard.press('Enter');await p.waitForFunction(()=>document.querySelector('#dots [data-i="3"]').getAttribute('aria-current')==='true');
  await cards.nth(3).click();await by(p,'openField',fieldId).first().waitFor();await noOverflow(p,'field list');
  await home(p);const lib=p.getByRole('button',{name:'Knjižnica vježbi',exact:true});await lib.focus();await p.keyboard.press('Enter');
  const q=p.locator('#libq');await q.fill('xzz-test-no-matches');assert.equal(await p.locator('#liblist [data-a="openEx"]').count(),0);
  await q.fill('bench');assert.ok(await p.locator('#liblist [data-a="openEx"]').count()>0);
  await A(p,'eqSheet').click();await A(p,'eqToggle').click();const filter=p.locator('[data-a="eqTile"]').first();await filter.click();await A(p,'sheetDone').click();await A(p,'filtClear').click();await q.fill('bench');await by(p,'openEx','bench-press').click();
  await p.locator('.workout-exercise-page').waitFor();
  for(const [action,close] of [['workoutInfo','workoutPanelBack'],['workoutHistory','workoutPanelBack'],['workoutTrends','workoutPanelBack']]){await A(p,action).first().click();await p.locator('.workout-fullscreen').waitFor();await A(p,close).click();if(await A(p,'workoutClose').count())await A(p,'workoutClose').first().click();}
  assert.equal(await p.locator('.exswipe,.play-cards').count(),0);
  await noOverflow(p,'bench details');
  await home(p);await p.getByRole('button',{name:'Moj pregled',exact:true}).click();assert.equal(await p.locator('.db-muscle').count(),0);await A(p,'dashboardAnalytics').click();await A(p,'dashboardForecast').click();if(!await p.locator('.db-comparison-row').first().isVisible())await p.locator('.db-groups summary').click();await p.locator('.db-comparison-row').first().click();await noOverflow(p,'dashboard');await p.setViewportSize({width:320,height:812});await noOverflow(p,'dashboard 320');await p.setViewportSize({width:375,height:812});
  await p.locator('.db-daily [data-date="2026-11-06"]').click();assert.match(await p.locator('.view:not([inert])').innerText(),/6\. 11\.|6\. studen|petak,? 6/i);await A(p,'back').first().click();await p.locator('.dashboard').waitFor();
  await A(p,'back').first().click();await A(p,'dashboardProgress').click();assert.match(await p.locator('.view:not([inert])').innerText(),/Napredak/);await noOverflow(p,'progress');await A(p,'back').first().click();await p.locator('.dashboard').waitFor();
  assert.equal((await store(p)).log.length,count);
  record('home-library-dashboard-progress',{cards:5,device:'375px',keyboard:'Home card & library via Enter',search:'empty + partial + filter clear',fullpageExercise:true});
}
async function fieldCatalogue(p){
  await home(p);await p.locator('#car [data-a="fieldList"]').click();
  await p.screenshot({path:path.join(artifacts,'field-catalogue-375.png')});
  await p.setViewportSize({width:320,height:812});await p.screenshot({path:path.join(artifacts,'field-catalogue-320.png')});await p.setViewportSize({width:375,height:812});
  const filter=(id)=>p.locator('[data-a="fieldCategory"][data-cat="'+id+'"]');
  for(const [cat,expected] of Object.entries({all:22,speed:4,agility:1,endurance:15,tests:1,other:1})){
    await filter(cat).focus();await p.keyboard.press('Enter');const rows=p.locator('#field-results .field-catalogue-row');
    assert.equal(await rows.count(),expected,cat);
    const btn=rows.first();if(await btn.isVisible()) {await btn.click();await A(p,'back').first().click();assert.equal(await filter(cat).getAttribute('aria-pressed'),'true');}
    if(cat==='other')assert.ok(await by(p,'openField','audit-extra').isVisible());
  }
  await p.setViewportSize({width:320,height:812});await noOverflow(p,'field catalogue mobile320');await p.setViewportSize({width:375,height:812});await noOverflow(p,'field catalogue mobile375');
  await p.locator('.field-modes [data-mode="plan"]').click();assert.equal(await p.locator('.plangrid [data-a="openField"]').count(),14);
  await p.screenshot({path:path.join(artifacts,'field-plan-375.png')});await p.setViewportSize({width:320,height:812});await noOverflow(p,'plan mobile320');await p.screenshot({path:path.join(artifacts,'field-plan-320.png')});await p.setViewportSize({width:375,height:812});
  await A(p,'planAsk').click();await A(p,'planKeep').click();assert.equal(await A(p,'planAsk').count(),1);
  await A(p,'planAsk').click();
  await p.evaluate(()=>{window.auditSettingsSet=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='mt.settings')throw new DOMException('synthetic refusal','QuotaExceededError');return window.auditSettingsSet.call(this,k,v);};});
  const previous=await p.evaluate(()=>JSON.parse(localStorage.getItem('mt.settings')).preFrom||0);
  await A(p,'planReset').click();const shown=await p.locator('.field-programme').innerText();
  const still=await p.evaluate(()=>JSON.parse(localStorage.getItem('mt.settings')).preFrom||0);assert.equal(still,previous);
  assert.match(shown,/1 od 14/);assert.ok(await A(p,'planReset').isVisible());record('plan-reset-refused',{storageUnchanged:true,UIshowsReset:false,display:shown.split('\n').map(v=>v.trim()).filter(v=>v&&(/14|termina|tjedan/.test(v))).slice(0,3)});
  await p.evaluate(()=>{Storage.prototype.setItem=window.auditSettingsSet;});
  await home(p);await p.locator('#car [data-a="fieldList"]').click();await p.locator('.field-modes [data-mode="plan"]').click();
  await A(p,'planAsk').click();await A(p,'planReset').click();assert.equal(await A(p,'planAsk').count(),0);
  assert.ok((await store(p)).log.some(l=>l.historyId==='audit-plan1a'));
  await p.locator('.field-modes [data-mode="catalogue"]').click();assert.equal(await filter('all').getAttribute('aria-pressed'),'true');
  record('field-catalogue',{total:22,source:{standaloneAndPlan:21,custom:1},filters:{speed:4,agility:1,endurance:15,tests:1,other:1},planCells:14,reset:'prior log preserved',keyboard:true,widths:[320,375]});
}
async function exerciseTrial(p){
  await home(p);await p.getByRole('button',{name:'Knjižnica vježbi',exact:true}).click();await p.locator('#libq').fill('bench');
  await by(p,'openEx','bench-press').click();await by(p,'playEx','bench-press').click();
  if(await p.locator('#starting-load-form').isVisible()){await p.locator('#starting-load-form input').first().fill('20');await p.locator('#starting-load-form button[type="submit"]').click();}
  await advance(p,6);
  await pressCinemaMain(p);
  const before=(await play(p)).doneSteps;await p.reload();await A(p,'resumeGo').click();assert.deepEqual((await play(p)).doneSteps,before);
  await openQuit(p);await A(p,'quitSave').click();if(await A(p,'finishPlay').isVisible())await A(p,'finishPlay').click();
  const trial=(await store(p)).log.find(l=>l.kind==='exercise'&&l.refId==='bench-press');assert.ok(trial);assert.equal(trial.items[0].setsDone,1);
  await home(p);await p.getByRole('button',{name:'Moj pregled',exact:true}).click();await A(p,'historyList').click();await by(p,'historyOpen',trial.historyId).click();assert.match(await p.locator('.history').innerText(),/Bench press/i);
  record('exercise-trial',{realEntry:'Knjižnica > Bench press > Pokreni vježbu',doneSets:1,reload:'preserved',history:'individual exercise row'});
}
async function settingsBlocked(p,on){
  await p.evaluate(on=>{if(!window.auditOriginalSettingsSet)window.auditOriginalSettingsSet=Storage.prototype.setItem;
    Storage.prototype.setItem=on?function(k,v){if(['mt.settings','mt.skips'].includes(k))throw new DOMException('test refused settings','QuotaExceededError');return window.auditOriginalSettingsSet.call(this,k,v);}:window.auditOriginalSettingsSet;},on);
}
async function persistNegative(p){
  await home(p);await p.getByRole('button',{name:'Moj pregled',exact:true}).click();await A(p,'dashboardProgress').click();
  await p.locator('[data-a="progTab"][data-v="doziranje"]').click();const goal=p.locator('[data-a="setGoal"][aria-pressed="false"]').first();const id=await goal.getAttribute('data-v');
  const original=await p.evaluate(()=>localStorage.getItem('mt.settings'));await settingsBlocked(p,true);await goal.click();assert.equal(await p.locator('[data-a="setGoal"][data-v="'+id+'"]').getAttribute('aria-pressed'),'false');
  if(!await p.locator('#matchadd').isVisible())await p.locator('#matchadd').locator('xpath=ancestor::details[1]/summary').click();
  await p.locator('#matchadd').fill('2026-11-06');await A(p,'matchAdd').click();assert.equal(await p.evaluate(()=>localStorage.getItem('mt.settings')),original);assert.match(await p.locator('.toast').innerText(),/nije spremljena/i);
  await settingsBlocked(p,false);
  record('rejected-goal-match',{unchanged:true,retryable:true});
}
async function createSuperset(p){
  await home(p);await p.getByRole('button',{name:'Knjižnica vježbi',exact:true}).click();await p.locator('.tile[data-a="tab"][data-tab="protocols"]').click();await A(p,'newPr').click();
  await p.locator('#p-name').fill(prName);await A(p,'pickStart').click();
  for(const id of ['bench-press','side-plank']){await by(p,'pickToggle',id).click();}
  await A(p,'pickDone').click();
  for(const [i,id] of ['bench-press','side-plank'].entries()){
    const row=p.locator('[data-a="itOpen"][data-i="'+i+'"]');if(await row.getAttribute('aria-expanded')!=='true')await row.click();
    const minus=p.locator('[data-a="istep"][data-k="sets"][data-d="-1"][data-i="'+i+'"]');
    for(let n=0;n<5;n++){const text=await p.locator('#dose-'+i).innerText();if(text.startsWith('2 ×'))break;await minus.click();}
    if(i===0){const field=p.locator('[data-ikg="0"]');await field.fill('20');await field.press('Tab');}
  }
  const first=p.locator('[data-a="itOpen"][data-i="0"]');if(await first.getAttribute('aria-expanded')!=='true')await first.click();
  await p.locator('[data-a="ilink"][data-i="0"]').click();
  await p.locator('.topbar [data-a="savePr"]').click();await A(p,'startPr').waitFor();
  const pr=Object.values((await store(p)).protocols).find(x=>x.name===prName);assert.ok(pr);
  assert.equal(pr.items.length,2);assert.equal(pr.items[0].exId,'bench-press');assert.equal(pr.items[1].exId,'side-plank');assert.equal(pr.items[1].sides,true);
  assert.ok(pr.items[0].ss && pr.items[0].ss===pr.items[1].ss);assert.equal(pr.items[0].sets,2);assert.equal(pr.items[1].sets,2);assert.equal(pr.items[0].kg,20);
  record('protocol-create',{id:pr.id,items:pr.items.map(x=>({id:x.exId,sets:x.sets,kg:x.kg,sides:x.sides,sec:x.sec,group:x.ss}))});
  return pr;
}
async function planner(p,pr){
  await home(p);await p.getByRole('button',{name:'Moj pregled',exact:true}).click();await p.locator('.db-quick [data-a="dashboardCalendar"]').click();await A(p,'monthAdd').click();await by(p,'monthPick',pr.id).click();
  await A(p,'monthAdd').click();const dup=by(p,'monthPick',pr.id);assert.ok(await dup.isDisabled());
  await A(p,'monthAdd').click();await by(p,'monthMenu',pr.id).click();await by(p,'monthMove',pr.id).click();await p.locator('[data-a="monthDate"][data-date="2026-11-05"]').click();
  const settings=await p.evaluate(()=>JSON.parse(localStorage.getItem('mt.settings')));
  assert.equal(settings.planDates[nowDate][0].to,'2026-11-05');
  await A(p,'monthAdd').click();const fieldFilter=p.locator('[data-a="monthFilter"][data-kind="field"]');if(await fieldFilter.count()) await fieldFilter.click();
  await by(p,'monthPick',fieldId).click();await noOverflow(p,'planner');
  assert.ok(await by(p,'openField',fieldId).count());
  await by(p,'monthMenu',fieldId).click();await by(p,'monthSkip',fieldId).click();
  assert.equal(await by(p,'openField',fieldId).count(),0);
  record('planner',{duplicate:'blocked',moved:'Nov4→Nov5',field:'added and removed'});
}
async function toProtocol(p,pr){await home(p);await p.getByRole('button',{name:'Knjižnica vježbi',exact:true}).click();await p.locator('.tile[data-a="tab"][data-tab="protocols"]').click();await by(p,'openPr',pr.id).click();await A(p,'startPr').click();}
async function startField(p){
  await home(p);await p.locator('#car [data-a="fieldList"]').click();await by(p,'openField',fieldId).first().click();await p.locator('[data-a="startField"][data-dose="full"]').click();await A(p,'quitPlay').waitFor();
}
async function fieldFlow(p,ctx){
  await startField(p);await A(p,'playSettings').click();
  const option=p.locator('[data-a="setSetting"][aria-pressed="false"]').first();const pair={key:await option.getAttribute('data-k'),value:await option.getAttribute('data-v')};
  const saved=await p.evaluate(()=>localStorage.getItem('mt.settings'));await settingsBlocked(p,true);await option.click();assert.equal(await p.evaluate(()=>localStorage.getItem('mt.settings')),saved);assert.equal(await p.locator('[data-a="setSetting"][data-k="'+pair.key+'"][data-v="'+pair.value+'"]').getAttribute('aria-pressed'),'false');await settingsBlocked(p,false);
  await p.keyboard.press('Escape');await openQuit(p);await A(p,'quitDiscard').click();assert.equal((await store(p)).log.filter(x=>x.refId===fieldId).length,0);
  await startField(p);await advance(p,11);await advance(p,11);
  const progress=await play(p);assert.ok(Object.keys(progress.doneSteps).length,'first 10s field interval completed');
  await p.reload();await A(p,'resumeGo').click();const resumed=await play(p);assert.deepEqual(resumed.doneSteps,progress.doneSteps);
  await openQuit(p);await A(p,'quitSave').click();if(await A(p,'finishPlay').isVisible())await A(p,'finishPlay').click();const log=(await store(p)).log.find(l=>l.refId===fieldId);
  assert.ok(log&&log.load.m>0&&log.load.min>0&&log.load2.Bfield>0);assert.ok(log.load.min<1,'only first short interval saved');
  record('field-player',{discard:'no row',resumed:true,saved:log.load,points:log.load2.Bfield});
}
async function backupRows(p,data){
  await home(p);await A(p,'dataSheet').click();await p.locator('#importFile').setInputFiles({name:'sinteticki-redovi.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});await A(p,'restoreApply').click();await A(p,'restoreApply').waitFor({state:'hidden'});
}
async function mixedCharts(p,ctx,pr){
  const base=baseFixture();
  const item={exId:'bench-press',measure:'sets',sets:2,reps:5,repsList:[5,3],kg:20,kgList:[20,30],done:true,setsDone:2,setNumbers:[1,2],sideCounts:[1,1],sides:false};
  base.log=[{kind:'protocol',name:'Potisak · dva tereta',refId:pr.id,historyId:'mix01',at:Date.parse(fixed),secs:600,items:[item]},
  {kind:'exercise',name:'Zasebna proba potiska',refId:'bench-press',at:Date.parse(fixed)-60000,secs:60,items:[{...item}]}];
  await backupRows(p,base);await home(p);await p.getByRole('button',{name:'Moj pregled',exact:true}).click();await A(p,'dashboardProgress').click();
  await p.locator('[data-a="progressDetail"][data-topic="suggestions"]').click();
  if(!await p.locator('#pg-load').evaluate(node=>node.open))await p.locator('#pg-load > summary').click();
  const chart=p.locator('#wk-vl');assert.match(await chart.getAttribute('aria-label'),/190 kg/);
  await p.locator('#wk-vl [data-a="ltip"][data-i="7"]').click();assert.equal(await p.locator('#wk-vl .tipg.on').count(),1);
  const kgCard=p.locator('.lc').filter({has:p.locator('#wk-vl')});await kgCard.locator('summary').click();assert.match(await kgCard.locator('table').innerText(),/190 kg/);
  await home(p);await p.getByRole('button',{name:'Moj pregled',exact:true}).click();await A(p,'historyList').click();await by(p,'historyOpen','mix01').click();
  const detail=await p.locator('.history').innerText();assert.match(detail,/1\t5\t20/);assert.match(detail,/2\t3\t30/);
  await A(p,'historyEdit').click();const kg=p.locator('[data-history-item="0"][data-history-set="1"][data-history-field="kg"]');
  if(!await kg.isVisible())await kg.locator('xpath=ancestor::details/summary').click();
  await kg.fill('');await A(p,'historySave').click();await A(p,'historyEdit').waitFor();
  const after=(await store(p)).log.find(l=>l.historyId==='mix01');assert.deepEqual(after.items[0].kgList,[20,null]);
  await home(p);await p.getByRole('button',{name:'Moj pregled',exact:true}).click();await A(p,'dashboardProgress').click();
  await p.locator('[data-a="progressDetail"][data-topic="suggestions"]').click();
  if(!await p.locator('#wk-vl').isVisible())await p.locator('#wk-vl').locator('xpath=ancestor::details[1]/summary').click();
  const mixedText=await p.locator('.view:not([inert])').innerText();const chartLabel=await p.locator('#wk-vl').getAttribute('aria-label');
  assert.match(mixedText,/Za dio treninga nedostaju podaci. Zbrojevi prikazuju samo poznati rad/);
  record('mixed-weights-and-unknown',{originalVolume:190,originalMeaning:'5×20 + 3×30; independent trial excluded',unrecordedSet2kg:chartLabel,partialNotice:/nepotpun|dijelom|djelomič|dio .*nije|nedosta|poznati podaci/i.test(mixedText)});
  await offlineReady(p,'before outage');
  await withOffline(ctx,server,async()=>{
    const response=await home(p);assert.equal(response.fromServiceWorker(),true);
    await p.getByRole('button',{name:'Moj pregled',exact:true}).click();await A(p,'historyList').click();await by(p,'historyOpen','mix01').click();await A(p,'historyEdit').waitFor();
    await home(p);await A(p,'dataSheet').click();const [download]=await Promise.all([p.waitForEvent('download'),p.getByRole('dialog').locator('[data-a="exportData"]').click()]);
    const fp=path.join(artifacts,'whole-app-offline-backup.json');await download.saveAs(fp);const restored=JSON.parse(fs.readFileSync(fp,'utf8'));assert.deepEqual(restored.log.find(l=>l.historyId==='mix01').items[0].kgList,[20,null]);await backupRows(p,restored);
    assert.deepEqual((await store(p)).log.find(l=>l.historyId==='mix01').items[0].kgList,[20,null]);
    record('offline-roundtrip',{workouts:restored.log.length,preserves:[20,null],outage:engine==='webkit'?'origin-stopped':'browser-offline'});
  });
}
async function editDose(p,j){
  await openJournal(p,true);
  await p.locator('.cinema-journal [data-a="playDoseEdit"][data-j="'+j+'"]').click();await p.locator('#play-dose-form').waitFor();
}
async function applyDose(p){await A(p,'playDoseApply').click();await closeJournal(p);}
async function cancelDose(p){await A(p,'playDoseCancel').click();await closeJournal(p);}
async function swipePlayer(p){
  await openJournal(p,true);
  await p.locator('.workout-journal').waitFor();
  assert.equal(await p.locator('.play-cards').count(),0);
  assert.ok(await p.locator('.workout-journal .workout-set-row').count()>0);
  await A(p,'workoutExercise').first().click();await p.locator('.workout-fullscreen .workout-exercise-page').waitFor();await A(p,'workoutClose').first().click();
  await closeJournal(p);
  record('vertical-workout-journal',{engine,fullpageDetail:true,allSets:true});
}
async function liveFlow(p,pr){
  await toProtocol(p,pr);await advance(p,6);
  const previous=(await store(p)).log.length;
  await swipePlayer(p);
  await editDose(p,0);
  await p.locator('#play-dose-sets').fill('1');await A(p,'playDoseResize').click();
  const resizeCount=await p.locator('#play-dose-form [data-dose-set]').count();const error=await p.locator('.play-dose-error').allTextContents();record('live-shrink',{requested:1,shown:resizeCount,error});
  if(!process.argv.includes('continue-known'))assert.equal(resizeCount,1,'future set shrinks while current manual set remains');
  await cancelDose(p);await editDose(p,0);
  const row=(num,key)=>p.locator('#play-dose-form [data-dose-set="'+num+'"] [data-dose-value="'+key+'"]');
  await row(1,'kg').fill('99');await cancelDose(p);
  assert.equal((await play(p)).items[0].kgList[0],20);
  await pressCinemaMain(p);
  const first=await play(p);assert.ok(Object.keys(first.doneSteps).length===1);
  await editDose(p,0);await noOverflow(p,'live editor');
  const locked=row(1,'kg');assert.ok(await locked.isDisabled()||await locked.getAttribute('readonly')!==null);
  await row(2,'reps').fill('3');await row(2,'kg').fill('5001');await applyDose(p);await p.locator('#play-dose-form').waitFor();
  assert.equal((await play(p)).items[0].kgList[1],20,'invalid edit does not leak');
  const retained=await row(2,'reps').inputValue();if(process.argv.includes('continue-known') && retained!=='3')await row(2,'reps').fill('3');else assert.equal(retained,'3','invalid kg must retain patch reps');
  await row(2,'kg').fill('30');
  await p.evaluate(()=>{window.auditPlaySet=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='mt.play')throw new DOMException('synthetic workout quota','QuotaExceededError');return window.auditPlaySet.call(this,k,v);};});
  await applyDose(p);assert.equal((await play(p)).items[0].kgList[1],20);assert.match(await p.locator('.play-dose-error').innerText(),/nije spremljena/i);
  await p.evaluate(()=>{Storage.prototype.setItem=window.auditPlaySet;});
  if(process.argv.includes('continue-known')){await row(2,'reps').fill('3');await row(2,'kg').fill('30');}else{assert.equal(await row(2,'kg').inputValue(),'30');assert.equal(await row(2,'reps').inputValue(),'3');}
  await applyDose(p);await p.locator('#play-dose-form').waitFor({state:'hidden'});
  await editDose(p,1);await row(2,'sec').fill('20');await applyDose(p);
  await p.locator('.toast').waitFor({state:'hidden',timeout:10000});await p.locator('.view:not([inert])').evaluate(el=>el.scrollTo(0,0));await p.screenshot({path:path.join(artifacts,'player-dose-card-375.png')});
  await editDose(p,0);
  for(const width of [320,375]){await p.setViewportSize({width,height:812});
    const editorWidth=await p.locator('#play-dose-form').evaluate(el=>{const b=el.getBoundingClientRect();return{left:b.left,right:b.right,client:el.clientWidth,scroll:el.scrollWidth,kgRight:el.querySelector('[data-dose-value=kg]').getBoundingClientRect().right,width:innerWidth};});
    record('live-editor-bounds',editorWidth);assert.ok(editorWidth.scroll<=editorWidth.client+1&&editorWidth.kgRight<=editorWidth.right+1,'dose kg input exceeds its form');
  }
  await p.screenshot({path:path.join(artifacts,'player-dose-editor-375.png')});await cancelDose(p);
  const changed=await play(p);assert.deepEqual(changed.items[0].repsList,[5,3]);assert.deepEqual(changed.items[0].kgList,[20,30]);assert.equal(changed.items[1].secList[1],20);
  const beforeReload=structuredClone(changed);await p.reload();await A(p,'resumeGo').click();
  const resumed=await play(p);assert.deepEqual(resumed.doneSteps,beforeReload.doneSteps);assert.deepEqual(resumed.items[0],beforeReload.items[0]);assert.equal(resumed.i,beforeReload.i);assert.deepEqual(resumed.liveSchedule,beforeReload.liveSchedule);
  await reach(p,()=>play(p).then(v=>v.liveSchedule[v.i].kind==='work'),20);
  await advance(p,pr.items[1].sec+1);await openCinemaControls(p);await p.locator('[data-a="jump"][data-d="1"]').click();
  await reach(p,()=>play(p).then(v=>v.liveSchedule[v.i].kind==='manual'),20);
  const shown=await p.locator('.workout-cinema-heading').innerText();await openJournal(p,true);
  // 1.22.0: with "Prikaži sve" every exercise is an open card
  assert.equal(await p.locator('.cinema-journal .cj-card').first().locator('[data-set="2"][data-field="kg"]').inputValue(),'30');
  assert.equal(await p.locator('.cinema-journal .cj-card').first().locator('[data-set="2"][data-field="reps"]').inputValue(),'3');
  await closeJournal(p);await pressCinemaMain(p);
  await openQuit(p);await A(p,'quitSave').click();if(await A(p,'finishPlay').isVisible())await A(p,'finishPlay').click();
  const data=await store(p),log=data.log.find(l=>l.refId===pr.id&&l.items[0].liveDoseChanged===true);
  assert.equal(data.log.length,previous+1);assert.ok(log);const bench=log.items[0];
  assert.deepEqual(bench.kgList,[20,30]);assert.deepEqual(bench.repsList,[5,3]);assert.deepEqual(bench.setNumbers,[1,2]);assert.equal(bench.liveDoseChanged,true);
  assert.equal(data.protocols[pr.id].items[0].kg,20);assert.equal(data.protocols[pr.id].items[0].reps,5);assert.equal(data.protocols[pr.id].items[1].sec,30);
  record('live-player-edits',{edits:'cancel99, reject5001, save20×5/30×3, future plank20s',completedRows:bench.setNumbers,kg:bench.kgList,reps:bench.repsList,originalProtocolKg:data.protocols[pr.id].items[0].kg,sameScheduleOnResume:true,shown});
}
async function programNegative(p){
 const d=baseFixture(),id='audit-program';
 d.programs={[id]:{id,name:'Program · isti trening u različitim tjednima',weeks:[{week:1,sessions:[{pr:'snaga-a',label:'A'},{pr:'snaga-b',label:'B'}]},{week:2,sessions:[{pr:'snaga-a',label:'A'}]}]}};
 d.protocols['snaga-a'].program=id;d.protocols['snaga-a'].items=[{exId:'bench-press',measure:'sets',sets:1,reps:5,sec:30,kg:20,rest:0,sides:false}];d.protocols['snaga-b'].program=id;d.protocols['snaga-c'].days=[1];
 d.log=[{kind:'protocol',historyId:'audit-pra',name:'Stariji trening A',refId:'snaga-a',at:Date.parse(fixed)-86400e3*7,secs:100}];d.settings.planDates={};
 await backupRows(p,d);await home(p);await p.getByRole('button',{name:'Knjižnica vježbi',exact:true}).click();await p.locator('.tile[data-a="tab"][data-tab="protocols"]').click();await by(p,'openProg',id).click();
 const cells=p.locator('.pgrid .pcell'),completed=await p.locator('.pgrid .pcell.done').count();
 assert.equal(completed,1);assert.match(await cells.nth(0).getAttribute('class'),/done/);assert.match(await cells.nth(1).getAttribute('class'),/next/);assert.doesNotMatch(await cells.nth(2).getAttribute('class'),/done|next/);assert.match(await p.locator('.progtop').innerText(),/Sljedeće: 1. tj. · B/);
 await cells.nth(2).click();await A(p,'startPr').click();await advance(p,6);await pressCinemaMain(p);await A(p,'finishPlay').click();
 await home(p);await p.getByRole('button',{name:'Knjižnica vježbi',exact:true}).click();await p.locator('.tile[data-a="tab"][data-tab="protocols"]').click();await by(p,'openProg',id).click();
 assert.equal(await p.locator('.pgrid .pcell.done').count(),2);assert.match(await cells.nth(1).getAttribute('class'),/next/);assert.match(await cells.nth(2).getAttribute('class'),/done/);assert.match(await p.locator('.progtop').innerText(),/2 od 3/);
 assert.equal((await store(p)).log.filter(l=>l.kind==='protocol'&&l.refId==='snaga-a').length,2);
 record('programme-reused-session',{atFirst:{actualRecords:1,doneCellsMarked:completed,next:'B week1',week2A:false},afterAnotherRealSession:{records:2,doneCells:2,week2A:true,next:'B week1'},slots:3});
 await advance(p,2);
 await by(p,'progRestartAsk',id).first().click();await settingsBlocked(p,true);const before=await p.evaluate(()=>localStorage.getItem('mt.settings'));
 await by(p,'progRestart',id).click();assert.ok(await by(p,'progRestart',id).isVisible());assert.equal(await p.evaluate(()=>localStorage.getItem('mt.settings')),before);await settingsBlocked(p,false);await by(p,'progRestart',id).click();assert.equal(await p.locator('.pgrid .pcell.done').count(),0);
 await home(p);const skip=A(p,'skipSlot').first();await skip.waitFor();const expected=await p.evaluate(()=>localStorage.getItem('mt.skips'));await settingsBlocked(p,true);await skip.click();
 assert.equal(await p.evaluate(()=>localStorage.getItem('mt.skips')),expected);assert.ok(await skip.isVisible());assert.match(await p.locator('.toast').innerText(),/nije spremljena/i);await settingsBlocked(p,false);await skip.click();assert.ok(!await skip.isVisible());
 record('rejected-program-and-skip',{programRetry:true,priorLogRetained:!!(await store(p)).log.find(l=>l.historyId==='audit-pra'),skipRetry:true});
}
async function bodyRound(p,pr){
  await toProtocol(p,pr);await advance(p,6);await pressCinemaMain(p);
  await reach(p,()=>play(p).then(v=>v.liveSchedule[v.i].kind==='work'),20);
  await advance(p,pr.items[1].sec+1);
  const first=await play(p);assert.ok(Object.keys(first.doneSteps).length>=2);
  await openCinemaControls(p);await p.locator('[data-a="jump"][data-d="1"]').click();
  await reach(p,()=>play(p).then(v=>v.liveSchedule[v.i].kind==='manual'),20);
  await pressCinemaMain(p);
  await reach(p,()=>play(p).then(v=>v.liveSchedule[v.i].kind==='work'),20);
  await advance(p,pr.items[1].sec+1);
  const second=await play(p);
  await openQuit(p);await A(p,'quitSave').click();if(await A(p,'finishPlay').isVisible())await A(p,'finishPlay').click();
  const log=(await store(p)).log.find(l=>l.refId===pr.id);assert.ok(log);
  const plank=log.items[1];
  const model=require('../../history-model.js');
  const wholePairs=model.performedSets(plank);
  assert.equal(wholePairs,0);assert.deepEqual(plank.sideCounts,[1,1]);assert.deepEqual(plank.setNumbers,[1,2]);assert.equal(model.timeTotal(plank),60);
  const muscle=require('../../muscle-work.js').sanitize(log.muscleWork[1]);assert.equal(muscle.completedSets,0);
  record('bilateral-incomplete-pairs',{firstSteps:Object.keys(first.doneSteps),lastSteps:Object.keys(second.doneSteps),item:plank,expectedCompletePairs:0,actual:wholePairs,timedSeconds:model.timeTotal(plank)});
}
async function reach(p,condition,max){
  for(let i=0;i<max;i++){
    if(await condition())return;
    const saved=await play(p),step=saved.liveSchedule[saved.i];
    if(saved.clock.paused)await A(p,'cinemaTimer').click();
    else if(step.kind==='ready'||step.kind==='rest'&&!step.trans)await pressCinemaMain(p);
    else await advance(p,2);
  }
  throw Error('Step not reached; '+await p.locator('.view:not([inert])').innerText());
}
async function run(){
  const serverReady=new Promise((r,j)=>{server.once('error',j);server.listen(0,'127.0.0.1',r);});await serverReady;
  let browser;try {browser=await launch();
    const ctx=await browser.newContext({viewport:{width:375,height:812},hasTouch:true,isMobile:true,deviceScaleFactor:1,locale:'hr-HR',timezoneId:'Europe/Zagreb',reducedMotion:'reduce',acceptDownloads:true});
    // This suite verifies the downloaded-file restore path. today.cjs separately
    // checks WebKit's native-share file assembly and its download fallback.
    await ctx.addInitScript(()=>{Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>false});});
    const p=await ctx.newPage();p.setDefaultTimeout(4000);const errors=[];p.on('pageerror',e=>errors.push(e.message));
    await p.clock.setFixedTime(new Date(fixed));await p.goto('http://127.0.0.1:'+server.address().port+'/');
    // Let the first offline install complete before repeated import/reload scenarios.
    await offlineReady(p,'cold start');
    try {await importTest(p);if(process.argv.includes('just-program')){await programNegative(p);assert.deepEqual(errors,[]);return;}if(process.argv.includes('just-live')){const pr=await createSuperset(p);await liveFlow(p,pr);assert.deepEqual(errors,[]);return;}
    await basics(p);await fieldCatalogue(p);await persistNegative(p);const pr=await createSuperset(p);await planner(p,pr);await fieldFlow(p,ctx);await exerciseTrial(p);await bodyRound(p,pr);if(process.argv.includes('live'))await liveFlow(p,pr);await mixedCharts(p,ctx,pr);await programNegative(p);assert.deepEqual(errors,[]);}
    catch(e){console.error('Current view:',(await p.locator('.view:not([inert])').innerText()).slice(0,1100));console.error('Dialog:',await p.getByRole('dialog').allInnerTexts());throw e;}
    finally{await ctx.close();fs.writeFileSync(path.join(artifacts,process.argv.includes('just-program')?'whole-app-program-audit.json':process.argv.includes('just-live')?'whole-app-live-audit.json':'whole-app-audit.json'),JSON.stringify(results,null,2));}
  }finally{if(browser)await browser.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
