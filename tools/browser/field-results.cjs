'use strict';
// Disposable synthetic mobile regression: no existing browser profile is used.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {artifacts,engine,appVersion,launch,serve,fixture}=require('./runtime.cjs');
const A=(page,name)=>page.locator('[data-a="'+name+'"]');
const results=[];
const stamp=new Date('2026-11-05T12:00:00+01:00');
const stored=page=>page.evaluate(()=>JSON.parse(localStorage.getItem('mt.data.v1')));
async function home(page){await page.reload({waitUntil:'domcontentloaded'});await page.getByRole('button',{name:'Knjižnica vježbi',exact:true}).waitFor();}
async function importData(page,data){
  await home(page);await A(page,'dataSheet').click();
  await page.locator('#importFile').setInputFiles({name:'sinteticki-MAS.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});
  await A(page,'restoreApply').click();await A(page,'restoreApply').waitFor({state:'hidden'});
}
async function advance(page,seconds){const now=await page.evaluate(()=>Date.now());await page.clock.setFixedTime(new Date(now+seconds*1000));await page.waitForTimeout(300);}
async function completeTest(page){
  await home(page);await page.locator('#car [data-a="fieldList"]').click();
  await page.locator('[data-a="openField"][data-id="mas-test-5-min"]').click();
  await page.locator('[data-a="startField"][data-dose="full"]').click();
  for(let i=0;i<12;i++){
    const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('mt.play')));
    if(state?.done)break;
    assert.ok(state,'Player snapshot exists');
    await advance(page,Math.max(1,state.left||1)+2);
  }
  await page.locator('#masdist').waitFor();
  assert.match(await page.locator('.lmc').innerText(),/nisu poznati svi terenski podaci/);
}
async function detail(page,id){
  await home(page);await page.getByRole('button',{name:'Moj pregled',exact:true}).click();await A(page,'historyList').click();
  await page.locator('[data-a="historyOpen"][data-id="'+id+'"]').click();await page.locator('.hy-record-title').waitFor();
}
async function refuseData(page,on){await page.evaluate(on=>{
  if(!window.fieldResultsSetItem)window.fieldResultsSetItem=Storage.prototype.setItem;
  Storage.prototype.setItem=on?function(key,value){if(key==='mt.data.v1')throw new DOMException('Synthetic write refusal','QuotaExceededError');return window.fieldResultsSetItem.call(this,key,value);}:window.fieldResultsSetItem;
},on);}
async function screenshot(page,name){
  for(const width of [320,375]){
    await page.setViewportSize({width,height:850});
    const size=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,view:document.querySelector('.view')?.scrollWidth}));
    assert.ok(size.scroll<=width+1&&size.view<=width+1,JSON.stringify(size));
    await page.screenshot({path:path.join(artifacts,'field-results-'+engine+'-'+name+'-'+width+'.png')});
  }
}
function seed(){
  const data=fixture();data.app=appVersion;data.log=[];
  data.settings.sound=false;data.settings.matchDay=-1;data.settings.matchDates={};data.settings.planDates={};
  for(const p of Object.values(data.protocols))p.days=[];
  return data;
}
(async()=>{
  const server=await serve();let browser;
  try{
    browser=await launch();const context=await browser.newContext({viewport:{width:375,height:850},locale:'hr-HR',timezoneId:'Europe/Zagreb',serviceWorkers:'block',reducedMotion:'reduce',hasTouch:true,isMobile:true});
    const page=await context.newPage(),errors=[];page.setDefaultTimeout(6000);page.on('pageerror',e=>errors.push(e.message));
    await page.clock.setFixedTime(stamp);await page.goto(server.url,{waitUntil:'domcontentloaded'});
    try{
      await importData(page,seed());await completeTest(page);
      await page.locator('#masdist').fill('1500');assert.match(await page.locator('#masout').innerText(),/MAS 5 m\/s/);
      await A(page,'finishPlay').click();
      let data=await stored(page),work=data.log.find(l=>l.kind==='field'),test=data.log.find(l=>l.kind==='test');
      assert.equal(work.load.m,1500);assert.equal(work.load.mas,5);assert.equal(work.load.min,5);assert.equal(work.load2,undefined);assert.equal(work.load2Status,'needsFieldData');
      for(const key of ['hsr','spr','zones'])assert.equal(Object.hasOwn(work.load,key),false);
      assert.equal(test.dist,1500);assert.equal(test.value,5);assert.equal(test.parentSessionId,work.historyId);
      await detail(page,work.historyId);
      assert.match(await page.locator('.history').innerText(),/1\.500 m/);
      assert.match(await page.locator('.history').innerText(),/Nije zabilježeno/);
      await screenshot(page,'known');
      const savedId=work.historyId;
      await A(page,'historyEdit').click();
      const metres=page.locator('[data-history-load="m"]'),minutes=page.locator('[data-history-load="min"]');
      for(const invalid of ['2500','1599,5','']){
        await metres.fill(invalid);await A(page,'historySave').click();await page.locator('#history-edit-error').waitFor();
        assert.equal(await metres.inputValue(),invalid);assert.equal((await stored(page)).log.find(l=>l.historyId===savedId).load.m,1500);
      }
      await metres.fill('1700');await minutes.fill('4');await A(page,'historySave').click();
      assert.match(await page.locator('#history-edit-error').innerText(),/5 minuta/);await minutes.fill('5');
      await refuseData(page,true);await A(page,'historySave').click();
      assert.match(await page.locator('#history-edit-error').innerText(),/nije spremljena/);assert.equal(await metres.inputValue(),'1700');
      data=await stored(page);assert.equal(data.log.find(l=>l.historyId===savedId).load.m,1500);assert.equal(data.log.find(l=>l.parentSessionId===savedId).dist,1500);
      await refuseData(page,false);await A(page,'historySave').click();await A(page,'historyEdit').waitFor();
      data=await stored(page);assert.equal(data.log.find(l=>l.historyId===savedId).load.m,1700);assert.equal(data.log.find(l=>l.parentSessionId===savedId).dist,1700);assert.equal(data.log.find(l=>l.parentSessionId===savedId).value,5.67);
      results.push({case:'pairedHistoryCorrection',invalidResultPreservesDraft:true,refusedWriteRollsBackBoth:true,retryUpdatesWorkoutAndMas:true,correctedMetres:1700});
      await completeTest(page);await A(page,'finishPlay').click();
      data=await stored(page);const missing=data.log.find(l=>l.kind==='field'&&l.historyId!==savedId);
      assert.ok(missing);assert.equal(missing.load.min,5);assert.equal(Object.hasOwn(missing.load,'m'),false);
      assert.equal(data.log.filter(l=>l.kind==='test').length,1);
      await detail(page,missing.historyId);assert.match(await page.locator('.history').innerText(),/Nije zabilježeno/);
      await home(page);await page.getByRole('button',{name:'Moj pregled',exact:true}).click();await A(page,'dashboardProgress').click();
      const panel=page.locator('#pg-load');if(!await panel.evaluate(el=>el.open))await panel.locator(':scope > summary').click();
      assert.match(await page.locator('#wk-m').getAttribute('aria-label'),/1,7 km|1\.700 m/);
      assert.match(await panel.innerText(),/Raspodjela brzog trčanja nije potpuno zabilježena/);
      assert.doesNotMatch(await panel.innerText(),/Ostali metri/);
      const table=panel.locator('.ltab');await table.locator('summary').click();
      assert.equal(await table.locator('th').count(),3);assert.match(await table.innerText(),/Nije potpuno zabilježeno/);
      await screenshot(page,'weekly');
      results.push({case:'actualTestAndMissingResult',knownMetres:1500,unknownSpeedPreserved:true,missingResultHasNoDistance:true,pairedResultRetained:true});
      await detail(page,missing.historyId);await A(page,'historyEdit').click();await page.locator('[data-history-load="m"]').fill('1400');await A(page,'historySave').click();await A(page,'historyEdit').waitFor();
      data=await stored(page);assert.equal(data.log.find(l=>l.parentSessionId===missing.historyId).dist,1400);
      assert.equal(data.log.find(l=>l.historyId===missing.historyId).load.m,1400);assert.equal(data.log.filter(l=>l.kind==='test').length,2);
      results.push({case:'previouslyMissingResultCorrection',createsExplicitPairedResult:true});
      const imported=seed(),at=stamp.getTime()-3600000;
      imported.log=[
        {historyId:'repair-session',kind:'field',refId:'mas-test-5-min',name:'Sintetički poznati test',at,secs:300,load:{m:1350,hsr:0,spr:0,min:5,zones:[0,0,1350,0],dose:'full',mas:4.5}},
        {historyId:'repair-result',kind:'test',test:'mas',parentSessionId:'repair-session',name:'MAS test',at,dist:1500,value:5,unit:'m/s'},
        {historyId:'unknown-old',kind:'field',refId:'mas-test-5-min',name:'Sintetički stari sažetak',at:at-1000,secs:300},
        {historyId:'edited-test',kind:'field',refId:'mas-test-5-min',name:'Sintetički ručno uređen',at:at-2000,secs:300,editedAt:at,load:{m:1400,hsr:0,spr:0,min:5,zones:[0,0,1400,0],dose:'full',mas:4.5}}
      ];
      await importData(page,imported);data=await stored(page);
      assert.equal(data.log.find(l=>l.historyId==='repair-session').load.m,1500);
      assert.equal(data.log.find(l=>l.historyId==='repair-session').load.hsr,undefined);
      assert.equal(data.log.find(l=>l.historyId==='unknown-old').load,undefined);
      assert.equal(data.log.find(l=>l.historyId==='edited-test').load.m,1400);
      await home(page);data=await stored(page);assert.equal(data.log.find(l=>l.historyId==='repair-session').load.m,1500);
      // Boot a persisted old record directly, rather than relying on restore to
      // write the repair. Hydration must persist a proven correction itself.
      const old=data.log.find(l=>l.historyId==='repair-session');
      old.load={m:1350,hsr:0,spr:0,min:5,zones:[0,0,1350,0],dose:'full',mas:4.5};delete old.fieldLoadStatus;delete old.load2Status;
      await page.evaluate(data=>localStorage.setItem('mt.data.v1',JSON.stringify(data)),data);
      await home(page);data=await stored(page);assert.equal(data.log.find(l=>l.historyId==='repair-session').load.m,1500);assert.equal(data.log.find(l=>l.historyId==='repair-session').load.source,'mas-test');
      results.push({case:'importRepairAndReload',pairedGeneratedMismatchRepaired:true,unknownSummaryPreserved:true,intentionalEditPreserved:true});
      assert.deepEqual(errors,[]);console.log(JSON.stringify({engine,results,artifacts},null,2));
    }catch(error){console.error('View:',(await page.locator('.view').allInnerTexts()).join('\n').slice(0,1800));console.error('Dialog:',await page.getByRole('dialog').allInnerTexts());throw error;}
    finally{await context.close();}
  }finally{if(browser)await browser.close();await server.close();fs.writeFileSync(path.join(artifacts,'field-results-'+engine+'.json'),JSON.stringify(results,null,2));}
})().catch(error=>{console.error(error);process.exitCode=1;});
