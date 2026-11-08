'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const {launch,repo,artifacts,appVersion,withOffline,openQuit,pressCinemaMain,fixture:baseFixture}=require('./runtime.cjs');
const useWebKit=process.argv.includes('webkit');
const screenshot=path.resolve(artifacts,useWebKit?'today-webkit-375.png':'today-regression.png');
const mime = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.mp4':'video/mp4'};
const server = http.createServer((req,res)=>{
  const url = new URL(req.url,'http://127.0.0.1');
  const p = path.resolve(repo,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
  if (!p.startsWith(repo+path.sep) || !fs.existsSync(p) || !fs.statSync(p).isFile()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, {'Content-Type':mime[path.extname(p)]||'application/octet-stream'}); fs.createReadStream(p).pipe(res);
});
const moment='2026-11-04T12:00:00+01:00', day='2026-11-04';
const at=(ds,h=9)=>new Date(ds+'T'+String(h).padStart(2,'0')+':00:00+01:00').getTime();
const action=(p,id)=>p.locator('[data-a="'+id+'"]');
const records=[];
function record(key,details={}){records.push({key,...details});console.log(key,JSON.stringify(details));}
function seed(options={}){
  const data=baseFixture();
  data.app='1.12.0';
  const log=data.log[0],id=log.refId;
  data.protocols[id].name='Snaga · potisak i kontrola';log.name='Snaga · potisak i kontrola';log.historyId='strg-seed1';log.at=at('2026-11-02',18);log.secs=45*60;log.srpe=5;
  delete log.load2;const it=log.items[0];it.setsDone=it.sets;it.done=true;it.rirList=Array(it.sets).fill(3);const M=require('../../muscle-work');log.muscleWork=[M.pack(M.completedItem(data.exercises[it.exId],it))];
  data.settings.planDates={};
  if(options.ownPlan!==false){for(const dt of ['2026-11-02',day])data.settings.planDates[dt]=[{kind:'protocol',id,to:dt,extra:true}];}
  data.settings.sound=false;data.settings.matchDay=-1;
  data.settings.matchDates=options.matchDates===undefined?{'2026-11-01':1,'2026-11-08':1}:options.matchDates;
  data.log=options.cold?[]:[log];
  return data;
}
async function home(p){const response=await p.reload({waitUntil:'domcontentloaded'});await p.getByRole('button',{name:'Knjižnica vježbi',exact:true}).waitFor();return response;}
async function dashboard(p){await home(p);await p.getByRole('button',{name:'Moj pregled',exact:true}).click();await p.locator('.dashboard').waitFor();}
async function history(p){await dashboard(p);await action(p,'historyList').click();await p.locator('#history-query').waitFor();}
async function importBackup(p,data){
  await home(p);await action(p,'dataSheet').click();
  await p.locator('#importFile').setInputFiles({name:'izmisljeni-tjedan.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});
  await action(p,'restoreApply').click();await action(p,'restoreApply').waitFor({state:'hidden'});
  await p.waitForFunction(n=>JSON.parse(localStorage.getItem('mt.data.v1')).log.length===n,data.log.length);
}
async function exportBackup(p){
  await home(p);await action(p,'dataSheet').click();
  let shared;
  if(useWebKit){
    await p.evaluate(()=>{
      Object.defineProperty(navigator,'canShare',{configurable:true,value:({files})=>files?.[0] instanceof File});
      Object.defineProperty(navigator,'share',{configurable:true,value:async ({files})=>{
        window.collectedShare={name:files[0].name,mime:files[0].type,text:await files[0].text()};
      }});
    });
    await p.getByRole('dialog').locator('[data-a="exportData"]').click();
    await p.waitForFunction(()=>!!window.collectedShare?.text);
    shared=await p.evaluate(()=>window.collectedShare);
    assert.equal(shared.mime,'application/json');assert.match(shared.name,/\.json$/);
    await p.evaluate(()=>Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>false}));
  }
  const [file]=await Promise.all([p.waitForEvent('download',{timeout:9000}),p.getByRole('dialog').locator('[data-a="exportData"]').click()]);
  const out=path.join(artifacts,useWebKit?'today-backup-synthetic-webkit.json':'today-backup-synthetic.json');await file.saveAs(out);const result=JSON.parse(fs.readFileSync(out,'utf8'));
  if(shared){assert.deepEqual(JSON.parse(shared.text),result);record('webkit-backup-paths',{nativeShareFileAssembled:true,systemShareDestination:'simulated file recipient',fallbackBrowserDownload:true});}
  return result;
}
async function data(p){return p.evaluate(()=>JSON.parse(localStorage.getItem('mt.data.v1')));}
async function settings(p){return p.evaluate(()=>JSON.parse(localStorage.getItem('mt.settings')));}
async function refused(p,on,key){await p.evaluate(({on,key})=>{
 if(!window.auditRealSet)window.auditRealSet=Storage.prototype.setItem;
 Storage.prototype.setItem=on?function(k,v){if(k===key)throw new DOMException('Synthetic storage rejection','QuotaExceededError');return window.auditRealSet.call(this,k,v);}:window.auditRealSet;
},{on,key});}
async function size(p,width,scope='.view'){
 await p.setViewportSize({width,height:812});
 const dims=await p.locator(scope).evaluate(el=>{
   const b=el.getBoundingClientRect(),errs=Array.from(el.querySelectorAll('input,textarea,button,select')).filter(x=>x.offsetWidth&&x.getBoundingClientRect().right>innerWidth+1).map(x=>x.outerHTML.slice(0,85));
   return {width:innerWidth,body:document.documentElement.scrollWidth,view:el.clientWidth,sw:el.scrollWidth,b:b.right,errs};
 });assert.ok(dims.body<=width+1&&dims.view+1>=dims.sw&&dims.errs.length===0,JSON.stringify(dims));return dims;
}
async function run(){
 const ready=new Promise((r,j)=>{server.once('error',j);server.listen(0,'127.0.0.1',r);});await ready;
 let browser;try {browser=await launch();
 const ctx=await browser.newContext({viewport:{width:375,height:812},hasTouch:true,isMobile:true,deviceScaleFactor:1,locale:'hr-HR',timezoneId:'Europe/Zagreb',reducedMotion:'reduce',acceptDownloads:true});
 const p=await ctx.newPage();p.setDefaultTimeout(4500);const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.clock.setFixedTime(new Date(moment));await p.goto('http://127.0.0.1:'+server.address().port+'/');
 // Let the application's first load handler finish its offline installation
 // before the scenarios repeatedly reload to exercise import and persistence.
 try {await p.waitForFunction(()=>!!navigator.serviceWorker.controller,{},{timeout:30000});}
 catch(error){
   console.error('Cold offline installation:',await p.evaluate(async()=>({
     controller:navigator.serviceWorker.controller?.scriptURL||null,
     registrations:(await navigator.serviceWorker.getRegistrations()).map(r=>({scope:r.scope,active:r.active?.state,waiting:r.waiting?.state,installing:r.installing?.state})),
     caches:await caches.keys(),readyState:document.readyState
   })));
   throw error;
 }
 try {await scenarios(p,ctx);assert.deepEqual(errors,[]);}
 catch(e){const view=await p.locator('.view').allInnerTexts();console.error('View:',view.join().slice(0,1400));console.error('Dialog:',await p.getByRole('dialog').allInnerTexts());throw e;}
 finally {await ctx.close();fs.writeFileSync(path.join(artifacts,useWebKit?'today-webkit-audit.json':process.argv.includes('just-morning')?'today-morning-audit.json':'today-browser-audit.json'),JSON.stringify(records,null,2));}
 }finally{if(browser)await browser.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
}
async function today(p){
  await dashboard(p);await action(p,'todayOpen').click();await p.getByRole('heading',{name:'Danas',exact:true}).waitFor();
  await p.locator('#today-recommendation').waitFor();
}
async function advise(p){
  const r=p.locator('#today-recommendation');
  return {kind:await r.getAttribute('data-kind'),text:await r.innerText()};
}
async function revealReasons(p){
  const why=p.locator('#today-recommendation > .dy-why');
  if(!await why.evaluate(node=>node.open))await why.locator(':scope > summary').click();
}
async function recommendationLayout(p,{warmup=false}={}){
  const recommendation=p.locator('#today-recommendation');
  const checks=recommendation.locator(':scope > .dy-preflight'), dose=recommendation.locator(':scope > .dy-dose');
  const start=recommendation.locator('[data-a="todayAct"]');
  assert.equal(await recommendation.locator('details[open]').count(),0);
  assert.equal(await dose.locator('li').first().isVisible(),false,'the detailed exercise list stays folded by default');
  assert.equal(await recommendation.locator('.dy-reasons li').first().isVisible(),false);
  assert.match(await recommendation.innerText(),/jutarnju procjenu|Jutarnja provjera nije potpuna/);
  assert.ok(await start.evaluate(button=>!!(button.compareDocumentPosition(button.parentElement.querySelector('.dy-dose')) & Node.DOCUMENT_POSITION_FOLLOWING)));
  await size(p,320,'.view');await size(p,375,'.view');
  await p.screenshot({path:path.join(artifacts,'today-'+(warmup?'warmup':'recommendation')+(useWebKit?'-webkit':'')+'-375.png')});
  await checks.locator(':scope > summary').click();
  assert.match(await checks.locator('li').first().innerText(),/jutarnju procjenu/i);
  if(warmup)assert.match(await checks.innerText(),/provjeri imaš li/);
  await checks.locator(':scope > summary').click();
  await dose.locator(':scope > summary').click();
  assert.ok(await dose.locator('li').last().isVisible(),'expanded dose includes all exercises');
  const displayed=await dose.locator('li').count();
  if(warmup)assert.ok(displayed>2,'the longer warm-up uses the same complete list');
  assert.match(await dose.locator(':scope > summary').innerText(),new RegExp('\\('+displayed+'\\)'));
  await dose.locator(':scope > summary').click();
  await revealReasons(p);
  assert.ok(await recommendation.getByRole('heading',{name:'Korišteni podaci'}).isVisible());
  record(warmup?'warmup-layout':'recommendation-layout',{actionBeforeDose:true,allDoseRows:displayed,visibleCheckInStatus:true,reasonAndSourcesOnDemand:true});
}
async function morning(p,values){
  await action(p,'morningOpen').click(); const form=p.locator('#morning-form');await form.waitFor();
  for(const [k,value] of Object.entries(values)){
    if(k==='painArea'||k==='newPain'){const chip=form.locator(k==='newPain'?'[name="newPain"]':'[name="painArea"][value="'+value+'"]');
      if(!await chip.isChecked())await chip.locator('xpath=..').click();assert.equal(await chip.isChecked(),true,k+' is one tap');continue;}
    await form.locator('[name="'+k+'"]').selectOption(String(value));
  }
  return form;
}
async function morningFlow(p){
  await today(p); const first=await advise(p);
  await recommendationLayout(p);
  const form=await morning(p,{energy:4,legs:2,pain:0});
  const chipHeights=await form.locator('.dy-chips span, .dy-toggle').evaluateAll(nodes=>nodes.map(node=>node.getBoundingClientRect().height));
  assert.ok(chipHeights.length===5&&chipHeights.every(h=>h>=44),'pain chips are full touch targets: '+chipHeights);
  const hipChip=form.locator('[name="painArea"][value="hip"]');
  await hipChip.locator('xpath=..').click();assert.equal(await hipChip.isChecked(),true);
  await hipChip.locator('xpath=..').click();assert.equal(await hipChip.isChecked(),false,'a second tap clears the place');
  await size(p,320,'.view');await size(p,375,'.view');
  const before=await settings(p);
  await refused(p,true,'mt.settings');await action(p,'morningSave').click();await form.waitFor();
  assert.deepEqual(await settings(p),before);assert.equal(await form.locator('[name="energy"]').inputValue(),'4');
  await refused(p,false,'mt.settings');await action(p,'morningSave').click();await form.waitFor({state:'hidden'});
  assert.equal(await p.locator('#today-recommendation details[open]').count(),0,'new recommendation starts folded');
  const saved=(await settings(p)).morningChecks[day];assert.deepEqual(saved,{date:day,energy:4,legs:2,pain:0});
  const ready=await advise(p);assert.ok(ready.kind);
  const personalBefore=(await data(p)).protocols;
  const launch=action(p,'todayAct');await launch.click();
  if(await p.locator('.workout-cinema').isVisible()||await action(p,'quitPlay').isVisible()){
    await openQuit(p);await action(p,'quitDiscard').click();
    await p.locator('.workout-cinema,[data-a="quitPlay"]').waitFor({state:'hidden'});
    assert.equal(await p.evaluate(()=>localStorage.getItem('mt.play')),null,'recommendation preview cleanup leaves no resumable workout');
    assert.deepEqual((await data(p)).protocols,personalBefore,'starting personal suggestion must not mutate saved prescription');
  } else {console.log('First recommendation action opened',await p.locator('h1').allInnerTexts());}
  await today(p);
  assert.deepEqual((await settings(p)).morningChecks[day],saved);
  await morning(p,{energy:2,legs:5,pain:0});await action(p,'morningSave').click();
  const low=await advise(p);assert.notEqual(low.kind,ready.kind,'low energy/heavy legs changes advice');
  await revealReasons(p);assert.match((await advise(p)).text,/nog|energ|lakš|oporav|umor/i);
  // Pain levels: 1-2 trains, 3-5 a lighter version, 6+ or new pain stops for today.
  await morning(p,{energy:4,legs:2,pain:1,painArea:'hip'});await action(p,'morningSave').click();
  const mild=await advise(p);assert.notEqual(mild.kind,'caution');assert.equal(await action(p,'todayAct').count(),1,'pain 1 still trains');
  await revealReasons(p);assert.match((await advise(p)).text,/Bol 1\/10 \(kuk i prepone\): treniraj normalno, ali bez povećanja težine/);
  // the seed session is upper body: hip pain leaves it as it is, pain marked Ostalo makes the whole session lighter
  await morning(p,{pain:4,painArea:'hip'});await action(p,'morningSave').click();
  const otherArea=await advise(p);assert.notEqual(otherArea.kind,'caution');
  assert.equal(await p.locator('#today-recommendation .dy-pain-note').innerText(),'Bol 4/10 (kuk i prepone): bez povećanja kilograma za kuk i prepone.','the hold is on the card, not only under Zašto');
  await revealReasons(p);assert.match((await advise(p)).text,/Bol 4\/10 \(kuk i prepone\): ovaj trening ne opterećuje to područje/);
  await morning(p,{pain:4,painArea:'other'});await action(p,'morningSave').click();
  const lighter=await advise(p);assert.equal(lighter.kind,'reduce');assert.match(lighter.text,/Lakša verzija za cijeli trening/);
  assert.equal(await action(p,'todayAct').count(),1,'pain 4 offers a lighter session');
  await morning(p,{pain:7});await action(p,'morningSave').click();
  const pain=await advise(p);assert.equal(pain.kind,'caution');assert.match(pain.text,/bol/i);
  assert.match(await p.locator('.dy-instruction').innerText(),/^Bol je jaka,/);
  if(await action(p,'todayAct').count())assert.match(await action(p,'todayAct').innerText(),/^Pokreni mobilnost/,'the stop day does not say "Pokreni trening"');
  assert.doesNotMatch(await p.locator('#today-recommendation').innerText(),/trener/i,'he trains alone');
  assert.deepEqual((await data(p)).log.map(x=>x.historyId),['strg-seed1']);
  record('morning',{first:first.kind,ready:ready.kind,low:low.kind,pain:pain.kind,persists:true,storageRefusalRetainsInputs:true});
}
async function cleanCheckin(p){
  await action(p,'morningOpen').click();await action(p,'morningDeleteAsk').click();
  await action(p,'morningDeleteConfirm').click();
  assert.equal((await settings(p)).morningChecks?.[day],undefined);
}
async function teamFill(p,{name='Klupski trening · intervali i igra',date='2026-11-03T18:00',rpe='7',type='training',minutes='80',tags=['conditioning','sprints']}={}){
  await action(p,'teamNew').first().click();const form=p.locator('#team-entry-form');await form.waitFor();
  await form.locator('#team-type').selectOption(type);await form.locator('#team-title').fill(name);
  await form.locator('#team-at').fill(date);await form.locator('#team-minutes').fill(minutes);
  if(rpe!==undefined)await form.locator('#team-srpe').fill(rpe);
  await form.locator('#team-notes').fill('Sintetički primjer za provjeru.');
  for(const tag of tags)await form.locator('[name="team-content"][value="'+tag+'"]').check();
  return form;
}
async function submitTeam(p){
  await action(p,'teamSave').click();await p.locator('#team-entry-form').waitFor({state:'hidden'});await today(p);
}
async function teamFlow(p){
  await today(p);await cleanCheckin(p);const original=await settings(p);
  const form=await teamFill(p);await size(p,320,'.view');await size(p,375,'.view');
  await p.locator('.view').evaluate(el=>el.scrollTo(0,0));await p.screenshot({path:path.join(artifacts,useWebKit?'today-team-create-webkit-375.png':'today-team-create-375.png')});
  assert.ok(!(await form.innerText()).match(/WHOOP|RMSSD|Strain|HRV/i));
  await form.locator('#team-at').fill('2026-11-05T18:00');await action(p,'teamSave').click();await form.waitFor();
  assert.equal((await data(p)).log.length,1);assert.ok(await p.locator('#team-entry-error').isVisible());
  await form.locator('#team-at').fill('2026-11-03T18:00');
  await refused(p,true,'mt.data.v1');await action(p,'teamSave').click();await form.waitFor();
  assert.equal((await data(p)).log.length,1);assert.equal(await form.locator('#team-minutes').inputValue(),'80');
  await refused(p,false,'mt.data.v1');await submitTeam(p);
  const changed=await data(p),teams=changed.log.filter(l=>l.kind==='team');assert.equal(teams.length,1);
  const item=teams[0];assert.equal(item.teamType,'training');assert.equal(item.srpe,7);assert.equal(item.secs,4800);assert.ok(!item.muscleWork&&!item.load&&!item.items);assert.deepEqual((await settings(p)).matchDates,original.matchDates);
  const heavy=await advise(p);assert.match(await p.locator('.view').innerText(),/klup|ekip|momčad|560/i);
  await revealReasons(p);
  const reason=p.locator('[data-a="todayEvidence"][data-type="history"][data-id="'+item.historyId+'"]');
  await reason.focus();await p.keyboard.press('Enter');await action(p,'historyEdit').waitFor();assert.match(await p.locator('.history').innerText(),/Klupski trening/);
  await action(p,'back').first().focus();await p.keyboard.press('Enter');await p.locator('#today-recommendation').waitFor();
  assert.ok(await reason.isVisible(),'Back restores the open evidence section');
  assert.equal(await reason.evaluate(button=>document.activeElement===button),true,'Back restores focus to the original source');
  await history(p);const btn=p.locator('[data-a="historyOpen"][data-id="'+item.historyId+'"]');await btn.click();assert.match(await p.locator('.history').innerText(),/560|80 min/i);
  await p.locator('.view').evaluate(el=>el.scrollTo(0,0));await p.screenshot({path:path.join(artifacts,useWebKit?'today-team-detail-webkit-375.png':'today-team-detail-375.png')});
  await action(p,'historyEdit').click();const hf=p.locator('#history-edit-form');
  await p.locator('.view').evaluate(el=>el.scrollTo(0,0));await p.screenshot({path:path.join(artifacts,useWebKit?'today-team-edit-webkit-375.png':'today-team-edit-375.png')});
  await hf.locator('#team-srpe,#history-srpe').first().fill('2');await action(p,'historySave').click();await action(p,'historyEdit').waitFor();
  const edited=(await data(p)).log.find(l=>l.historyId===item.historyId);assert.equal(edited.srpe,2);assert.equal(edited.secs,4800);
  await today(p);const lighter=await advise(p);
  assert.notEqual(heavy.kind,lighter.kind,'recent hard team session versus light after history edit should change optional dose or recommendation type');
  const team=await teamFill(p,{name:'Natjecateljska utakmica · primjer',type:'match',date:'2026-11-01T16:00',minutes:'70',rpe:'8',tags:['tactical']});await submitTeam(p);
  const match=(await data(p)).log.find(l=>l.teamType==='match');assert.equal(match.secs,4200);assert.deepEqual((await settings(p)).matchDates,original.matchDates);
  await teamFill(p,{name:'Lagani klupski rad · primjer',date:'2026-10-31T11:00',minutes:'20',rpe:'0',tags:['recovery']});await submitTeam(p);
  assert.equal((await data(p)).log.find(l=>l.name==='Lagani klupski rad · primjer').srpe,0);
  await teamFill(p,{name:'Bez unesene ocjene · primjer',date:'2026-10-30T11:00',minutes:'30',rpe:'',tags:['strength']});await submitTeam(p);
  const unknown=(await data(p)).log.find(l=>l.name==='Bez unesene ocjene · primjer');assert.ok(unknown.srpe==null);assert.ok(!unknown.muscleWork);
  assert.equal((await data(p)).log.filter(l=>l.kind==='team').length,4);
  record('team',{kind:item.kind,type:item.teamType,minutes:item.secs/60,originalAu:80*7,correctedAu:80*2,matchMinutes:70,matchAu:560,protectedCalendar:true,storageRefusal:true,noMuscleCredit:true,heavy:heavy.kind,lighter:lighter.kind});
  return {team:item,match};
}
async function integrity(p,ctx,example){
  await today(p);await morning(p,{energy:2,legs:4,pain:0});await action(p,'morningSave').click();await p.locator('#morning-form').waitFor({state:'hidden'});
  await size(p,320,'.view');await size(p,375,'.view');
  await p.locator('.toast').waitFor({state:'hidden',timeout:10000});await p.locator('.view').evaluate(el=>el.scrollTo(0,0));await p.screenshot({path:screenshot});
  const current=await advise(p),backup=await exportBackup(p);
  assert.equal(backup.app,appVersion);assert.equal(backup.settings.morningChecks[day].legs,4);
  const saved=backup.log.find(l=>l.historyId===example.team.historyId);assert.equal(saved.srpe,2);
  assert.ok(!/whoop|rmssd|hrv|strainScore/i.test(JSON.stringify({check:backup.settings.morningChecks,team:saved})));
  const material=await data(p);const basic=seed({cold:true,ownPlan:false,matchDates:{}});basic.settings.morningChecks={
    [day]:{date:day,energy:5,rawHeartRate:123,whoopStrain:18,legs:99},
    '2026-02-30':{date:'2026-02-30',pain:8},'2026-11-03':{date:'2026-11-02',pain:7}
  };await importBackup(p,basic);const cleaned=await settings(p);assert.deepEqual(cleaned.morningChecks,{[day]:{date:day,energy:5}});
  await importBackup(p,backup);assert.equal((await data(p)).log.length,material.log.length);
  await p.waitForFunction(()=>!!navigator.serviceWorker.controller,{},{timeout:15000});
  await withOffline(ctx,server,async()=>{
    const response=await home(p);assert.equal(response.fromServiceWorker(),true);
    await today(p);assert.equal((await advise(p)).kind,current.kind);
    await history(p);await p.locator('[data-a="historyOpen"][data-id="'+example.team.historyId+'"]').click();await action(p,'historyDeleteAsk').click();await action(p,'historyDeleteCancel').click();assert.ok((await data(p)).log.some(l=>l.historyId===example.team.historyId));
    await action(p,'historyDeleteAsk').click();await action(p,'historyDeleteConfirm').click();assert.ok(!(await data(p)).log.some(l=>l.historyId===example.team.historyId));
    await today(p);await cleanCheckin(p);assert.equal((await settings(p)).morningChecks?.[day],undefined);
    await importBackup(p,backup);const restored=await data(p);assert.ok(restored.log.some(l=>l.historyId===example.team.historyId));assert.deepEqual((await settings(p)).morningChecks,backup.settings.morningChecks);await today(p);assert.equal((await advise(p)).kind,current.kind);
    record('backup-offline',{version:backup.app,morning:backup.settings.morningChecks[day],teamBeforeAndAfterRestoration:example.team.historyId,kind:current.kind,outage:useWebKit?'origin-stopped':'browser-offline'});
  });
}
async function sources(p){
  const own=seed();await importBackup(p,own);await today(p);
  await revealReasons(p);
  const planned=p.locator('[data-a="todayEvidence"][data-type="plan"][data-date="'+day+'"]');assert.equal(await planned.count(),1);
  await planned.click();assert.equal(await p.locator('[data-a="monthDate"][aria-pressed="true"]').getAttribute('data-date'),day);
  const cold=seed({cold:true,ownPlan:false,matchDates:{}});await importBackup(p,cold);await today(p);await recommendationLayout(p,{warmup:true});
  const template=p.locator('[data-a="todayEvidence"][data-type="protocol"],[data-a="todayEvidence"][data-type="field"]').first();
  assert.equal(await template.getAttribute('data-date'),'');const source=await template.getAttribute('data-id');
  assert.equal(await p.locator('[data-a="todayEvidence"][data-type="plan"]').count(),0,'library option is not falsely tagged as an existing plan');
  await template.click();const actual=await p.locator('h1').innerText();assert.ok(actual&&actual!=='Danas');
  const played=seed({cold:true,ownPlan:false,matchDates:{}});
  played.log=[{kind:'team',historyId:'actual-match-evidence',name:'Primjer odigrane utakmice',teamType:'match',source:'manual',at:at('2026-11-03',17),secs:4200,srpe:8,teamContent:['tactical']}];
  await importBackup(p,played);await today(p);await revealReasons(p);
  const actualMatch=p.locator('[data-a="todayEvidence"][data-type="history"][data-id="actual-match-evidence"]');
  assert.equal(await actualMatch.count(),1);assert.equal(await p.locator('[data-a="todayEvidence"][data-type="match"][data-date="2026-11-03"]').count(),0);
  await actualMatch.click();assert.match(await p.locator('.history').innerText(),/Primjer odigrane utakmice/);
  record('evidence-destinations',{planned:day,undatedTemplate:source,actualMatchOpens:'history'});
}
async function matchWindow(p){
  const base=seed({cold:true,ownPlan:false,matchDates:{'2026-11-01':1,'2026-11-04':1}});
  const future=structuredClone(seed().log[0]);future.at=at('2026-11-09');future.historyId='future-example';future.srpe=10;future.secs=8000;base.log=[future];
  await importBackup(p,base);await today(p);const match=await advise(p);assert.match(match.text,/utakmic/i);
  assert.match(await p.locator('.dy-instruction').innerText(),/Bez dodatnog treninga snage ili intervala/);
  assert.ok(!/u\s+povijesti.*buduć/i.test(match.text));
  const yesterday=seed({cold:true,ownPlan:false,matchDates:{'2026-11-03':1}});yesterday.settings.morningChecks={'2026-11-03':{date:'2026-11-03',pain:9,energy:1,legs:5}};
  await importBackup(p,yesterday);await today(p);const after=await advise(p);assert.notEqual(match.kind,after.kind);assert.doesNotMatch(after.text,/boli [4-9]|9.?10/);
  const before=seed({cold:true,ownPlan:false,matchDates:{'2026-11-05':1}});await importBackup(p,before);await today(p);const near=await advise(p);
  const cold=seed({cold:true,ownPlan:false,matchDates:{}});await importBackup(p,cold);await today(p);
  const first=await advise(p);assert.match(await p.locator('.view').innerText(),/nema|još|nedost|malo|prvi|provjer/i);
  const dateForLast='2026-11-04', tomorrowLocal='2026-11-05';
  await p.clock.setFixedTime(new Date('2026-11-04T23:59:00+01:00'));await today(p);await morning(p,{energy:1});
  await p.clock.setFixedTime(new Date('2026-11-05T00:01:00+01:00'));await action(p,'morningSave').click();
  const overnight=(await settings(p)).morningChecks||{};assert.ok(!overnight[tomorrowLocal],'form opened on Wednesday silently must not mark Thursday');
  await today(p);assert.doesNotMatch(await action(p,'morningOpen').first().innerText(),/Energija 1/);
  await p.clock.setFixedTime(new Date(moment));
  record('cold-and-midnight',{cold:first.kind,oldEntrySaved:!!overnight[dateForLast],newDayBlank:!overnight[tomorrowLocal]});
  record('matches',{today:match.kind,previous:after.kind,tomorrow:near.kind,yesterdaysMorningNotApplied:true});
}
async function staleMorningTabs(p,ctx){
  const base=seed();await importBackup(p,base);await today(p);
  await morning(p,{energy:4,legs:2,pain:0});
  const second=await ctx.newPage();try{
    await second.clock.setFixedTime(new Date(moment));await second.goto(p.url());await today(second);await morning(second,{energy:2,legs:5,pain:0});
    await action(second,'morningSave').click();await second.locator('#morning-form').waitFor({state:'hidden'});
    await action(p,'morningSave').click();assert.equal(await p.locator('#morning-form').count(),1);
    assert.match(await p.locator('#morning-error').innerText(),/promijenjena|ponovno/i);assert.equal((await settings(p)).morningChecks[day].energy,2);
  }finally{await second.close();}
  // The rejected stale form remains a draft. Explicitly discard it through the
  // same guard as the user instead of relying on reload to erase their input.
  await action(p,'back').first().click();
  await action(p,'leaveDiscard').click();
  await today(p);
  const advice=await advise(p);assert.equal(advice.kind,'reduce');
  record('stale-morning-tabs',{newerEnergy:2,staleSaveRefused:true,latestAdvice:advice.kind});
}
async function reducedCompletion(p){
  const base=seed();base.settings.morningChecks={[day]:{date:day,energy:2,legs:4,pain:0}};
  await importBackup(p,base);await today(p);assert.equal((await advise(p)).kind,'reduce');await action(p,'todayAct').click();
  const saved=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('mt.play')));
  const orig=await saved();assert.equal(orig.items[0].sets,2);assert.equal(orig.originalItems[0].sets,3);assert.ok(orig.ref.kind==='protocol');
  await p.clock.setFixedTime(new Date('2026-11-04T12:00:06+01:00'));
  await p.waitForFunction(()=>{const state=JSON.parse(localStorage.getItem('mt.play'));return state?.liveSchedule[state.i].kind==='manual';});
  await pressCinemaMain(p);await pressCinemaMain(p);await pressCinemaMain(p);
  await action(p,'finishPlay').click();const after=await data(p),current=after.log.find(l=>l.historyId!=='strg-seed1');
  assert.ok(current&&current.items[0].liveDoseChanged);assert.equal(current.items[0].sets,2);assert.equal(after.protocols[orig.ref.id].items[0].sets,3);
  assert.equal(after.protocols[orig.ref.id].items[0].ok||0,base.protocols[orig.ref.id].items[0].ok||0,'train at easier dose must not advance the original target');
  await today(p);assert.equal((await advise(p)).kind,'rest');
  record('completed-personal-reduced-session',{actualSets:current.items[0].sets,originalSets:after.protocols[orig.ref.id].items[0].sets,progressCounterChanged:false,afterward:'rest'});
}
async function scenarios(p,ctx){await importBackup(p,seed());await morningFlow(p);if(process.argv.includes('just-morning'))return;const sample=await teamFlow(p);await integrity(p,ctx,sample);await matchWindow(p);await reducedCompletion(p);await sources(p);await staleMorningTabs(p,ctx);}
run().catch(e=>{console.error(e);process.exitCode=1;});
