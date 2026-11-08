'use strict';

// Author-defined workout parts. All data lives in a disposable browser context;
// library categories, doses and completion evidence are checked independently.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {artifacts,engine,fixture:baseFixture,launch,serve,openJournal,openQuit}=require('./runtime.cjs');
const id='authored-parts-audit',groupId='authored-group-audit';
const fixed=new Date('2026-11-06T10:00:00+01:00');
const a=(p,name)=>p.locator('[data-a="'+name+'"]');
const by=(p,name,index)=>p.locator('[data-a="'+name+'"][data-i="'+index+'"]');
const data=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('mt.data.v1')));
const player=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('mt.play')));
const draft=p=>p.evaluate(()=>JSON.parse(sessionStorage.getItem('mt.unsavedDraft.v1')).draft);
const part=(p,index)=>p.locator('select[data-builder-section="'+index+'"]');
// 1.22.0: the part heading above the current exercise in the player journal
const currentPart=p=>p.locator('.cinema-journal .workout-player-exercise[data-current="true"]').evaluate(node=>{
  for(let n=node.previousElementSibling;n;n=n.previousElementSibling)if(n.matches('.cinema-block-heading'))return n.querySelector('h2').textContent;
  return null;
});
const withoutPart=item=>Object.fromEntries(Object.entries(item).filter(([key])=>!key.startsWith('_')&&key!=='section'));
const results=[];

function fixture(){
  const d=baseFixture();d.log=[];d.programs={};d.field={};
  d.settings.sound=false;d.settings.planDates={};d.settings.matchDates={};d.settings.matchDay=-1;
  const items=[
    {exId:'dead-bug',measure:'sets',sets:2,reps:9,kg:0,rest:15,sides:false},
    {exId:'kopenhagen-kratka',measure:'time',sets:1,reps:1,sec:20,kg:0,rest:20,sides:false},
    {exId:'kopenhagen-kratka',measure:'time',sets:3,reps:1,sec:30,kg:0,rest:40,sides:false},
    {exId:'bench-press',measure:'sets',sets:3,reps:8,kg:50,rest:60,sides:false}
  ];
  d.protocols={
    [id]:{id,name:'Dijelovi po mom izboru',tag:'Teretana',days:[],items},
    [groupId]:{id:groupId,name:'Dio cijelog superseta',days:[],items:[
      {exId:'bench-press',measure:'sets',sets:2,reps:8,kg:40,rest:0,sides:false,ss:'pair-audit'},
      {exId:'bb-row',measure:'sets',sets:2,reps:10,kg:30,rest:60,sides:false,ss:'pair-audit'},
      {...items[0]}
    ]}
  };
  return d;
}

async function importFixture(p){
  await a(p,'dataSheet').click();
  await p.locator('#importFile').setInputFiles({name:'synthetic-authored-parts.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(fixture()))});
  await a(p,'restoreApply').click();await a(p,'restoreApply').waitFor({state:'hidden'});
}
async function openProtocol(p,key=id){
  await p.reload({waitUntil:'domcontentloaded'});
  await p.getByRole('button',{name:'Moj pregled',exact:true}).click();
  await a(p,'dashboardProtocols').first().click();
  await p.locator('[data-a="openPr"][data-id="'+key+'"]').click();
  await p.locator('.workout-overview').waitFor();
}
async function edit(p,key=id){
  await a(p,'workoutProtocolOptions').click();
  await p.locator('[data-a="editPr"][data-id="'+key+'"]').click();
  await p.locator('#p-name').waitFor();
}
async function openItem(p,index){
  if(!await part(p,index).isVisible())await by(p,'itOpen',index).click();
  await part(p,index).waitFor();
}
async function setPart(p,index,label){await openItem(p,index);await part(p,index).selectOption(label);}
async function save(p){await p.locator('.topbar [data-a="savePr"]').click();await p.locator('.workout-overview').waitFor();}
async function shot(p,name,width){await p.screenshot({path:path.join(artifacts,'sections-'+engine+'-'+name+'-'+width+'.png')});}
async function run(p,width){
  await importFixture(p);await openProtocol(p);
  assert.deepEqual(await p.locator('.workout-list-section').allTextContents(),['Glavni dio'],'unassigned exercises have one generic block, irrespective of categories');
  const before=await data(p),source=before.protocols[id].items;
  assert.equal(before.exercises['dead-bug'].cat,'Aktivacija');assert.equal(before.exercises['kopenhagen-kratka'].cat,'Rehab');
  await edit(p);
  await setPart(p,0,'Priprema');
  assert.deepEqual((await draft(p)).items.map(x=>x.section),['Priprema','Glavni dio','Glavni dio','Glavni dio'],'one item assignment does not relabel later default items');
  await setPart(p,1,'Priprema');await setPart(p,2,'Snaga');await setPart(p,3,'Snaga');
  const selected=(await draft(p)).items;
  assert.deepEqual(selected.map(x=>x.section),['Priprema','Priprema','Snaga','Snaga']);
  assert.deepEqual(selected.map(withoutPart),source.map(withoutPart),'assigning a part never changes the exercise dose');
  await shot(p,'builder',width);await save(p);await openProtocol(p);
  const saved=await data(p);
  assert.deepEqual(saved.protocols[id].items.map(x=>x.section),['Priprema','Priprema','Snaga','Snaga']);
  assert.deepEqual(saved.protocols[id].items.map(withoutPart),source.map(withoutPart));
  assert.deepEqual(saved.exercises,before.exercises,'assigning occurrences never mutates the library categories');
  assert.deepEqual(await p.locator('.workout-list-section').allTextContents(),['Priprema','Snaga']);
  await shot(p,'overview',width);
  await p.locator('.workout-compact-list').scrollIntoViewIfNeeded();await shot(p,'overview-parts',width);

  await a(p,'startPr').click();await p.locator('.workout-cinema').waitFor();
  await p.clock.setFixedTime(new Date(await p.evaluate(()=>Date.now())+6000));await p.waitForTimeout(350);
  // 1.22.0: the set header reads "Serija 1 od 2" without the part; the journal names the part of the current exercise
  assert.match(await p.locator('.workout-cinema-heading p').innerText(),/^Serija 1 od 2$/);
  await openJournal(p);
  assert.deepEqual(await p.locator('.cinema-block-heading h2').allTextContents(),['Priprema','Snaga']);
  assert.equal(await currentPart(p),'Priprema');
  assert.equal(await p.locator('.cinema-journal .workout-journal-name').filter({hasText:'Copenhagen plank'}).count(),2);
  assert.equal(Object.keys((await player(p)).doneSteps).length,0,'opening and grouping never invents completed work');
  await shot(p,'journal',width);
  await p.locator('.cinema-journal [data-a="cinemaJournalGroup"][data-j="0"]').first().click();
  await shot(p,'journal-parts',width);
  await p.locator('.cinema-block-heading [data-a="cinemaBlock"][data-j="2"]').click();
  // 1.22.0: the second Copenhagen occurrence (3 sets) belongs to strength: its part is in the journal, not the set header
  assert.match(await p.locator('.workout-cinema-heading p').innerText(),/^Serija 1 od 3$/);
  await openJournal(p);assert.equal(await currentPart(p),'Snaga','the second Copenhagen occurrence belongs to strength');
  await a(p,'cinemaJournalClose').click();await p.locator('.cinema-journal').waitFor({state:'hidden'});
  assert.equal(await p.locator('.workout-cinema').getAttribute('data-ex-id'),'kopenhagen-kratka');
  await a(p,'cinemaTimer').click();
  const snapshot=await player(p);
  assert.equal(snapshot.clock.paused,true);
  assert.deepEqual(snapshot.items.map(x=>x.section),['Priprema','Priprema','Snaga','Snaga']);
  await p.reload({waitUntil:'domcontentloaded'});await a(p,'resumeGo').click();
  assert.match(await p.locator('.workout-cinema-heading p').textContent(),/^Serija 1 od 3$/);   // 1.22.0: no part in the set header
  assert.equal(await p.locator('.cinema-pause-layer').isVisible(),true);
  const restored=await player(p);assert.deepEqual(restored.items.map(x=>x.section),snapshot.items.map(x=>x.section));
  assert.equal(Object.keys(restored.doneSteps).length,0);assert.equal(restored.clock.paused,true);
  await openQuit(p);await a(p,'quitDiscard').click();assert.deepEqual((await data(p)).log,[]);

  await openProtocol(p);await edit(p);await openItem(p,2);await part(p,2).selectOption('_custom');
  const custom='Snaga <B> & ravnoteža';await p.locator('#builder-section-name').fill(custom);
  await by(p,'builderSectionApply',2).click();await save(p);await openProtocol(p);
  assert.deepEqual((await data(p)).protocols[id].items.map(x=>x.section),['Priprema','Priprema',custom,'Snaga']);
  assert.deepEqual(await p.locator('.workout-list-section').allTextContents(),['Priprema',custom,'Snaga']);
  assert.equal(await p.locator('.workout-list-section b').count(),0,'custom part is escaped text, never markup');
  await edit(p);await openItem(p,0);await by(p,'imove',0).filter({hasText:'Dolje'}).click();
  const moved=(await draft(p)).items;
  assert.deepEqual(moved.map(x=>x.exId),['kopenhagen-kratka','dead-bug','kopenhagen-kratka','bench-press']);
  assert.deepEqual(moved.map(x=>x.section),['Priprema','Priprema',custom,'Snaga']);
  await openItem(p,0);await by(p,'idel',0).click();await save(p);await openProtocol(p);
  assert.deepEqual((await data(p)).protocols[id].items.map(x=>x.section),['Priprema',custom,'Snaga'],'deleting the first item keeps the remaining authored parts');

  // A typed custom title belongs to this occurrence even when its numeric index
  // changes before the user presses Save. Deletion must not attach it downstream.
  await edit(p);await openItem(p,1);await part(p,1).selectOption('_custom');
  const pending='Stabilnost <I> & kontrola';await p.locator('#builder-section-name').fill(pending);
  await openItem(p,0);await by(p,'idel',0).click();await save(p);await openProtocol(p);
  const afterPending=(await data(p)).protocols[id].items;
  assert.deepEqual(afterPending.map(x=>x.exId),['kopenhagen-kratka','bench-press']);
  assert.deepEqual(afterPending.map(x=>x.section),[pending,'Snaga'],'pending custom title follows its item through deletion before Save');
  assert.deepEqual(await p.locator('.workout-list-section').allTextContents(),[pending,'Snaga']);
  assert.equal(await p.locator('.workout-list-section i').count(),0);

  await openProtocol(p,groupId);const groupSource=(await data(p)).protocols[groupId].items;
  await edit(p,groupId);await setPart(p,0,'Kondicija');
  const groupDraft=(await draft(p)).items;
  assert.deepEqual(groupDraft.map(x=>x.section),['Kondicija','Kondicija','Glavni dio'],'part assignment applies to the whole superset');
  assert.equal(groupDraft[0].ss,groupDraft[1].ss);
  assert.deepEqual(groupDraft.map(withoutPart),groupSource.map(withoutPart),'changing a superset part preserves all doses and linkage');
  await save(p);await openProtocol(p,groupId);
  assert.deepEqual(await p.locator('.workout-list-section').allTextContents(),['Kondicija','Glavni dio']);

  // Even before Primijeni, a custom title is an unsaved change. Browser Back
  // must protect it, and refreshing must recover the pending field and index.
  await edit(p,groupId);await openItem(p,2);await part(p,2).selectOption('_custom');
  const recovered='Moj završetak';await p.locator('#builder-section-name').fill(recovered);
  await p.evaluate(()=>history.back());await p.getByRole('dialog',{name:'Spremiti promjene?'}).waitFor();
  await p.keyboard.press('Escape');assert.equal(await p.locator('#builder-section-name').inputValue(),recovered);
  await p.reload({waitUntil:'domcontentloaded'});await p.locator('#builder-section-name').waitFor();
  assert.equal(await p.locator('#builder-section-name').inputValue(),recovered,'pending custom title survives dirty draft recovery');
  assert.equal((await draft(p))._sectionCustom,2);
  await save(p);await openProtocol(p,groupId);
  assert.deepEqual((await data(p)).protocols[groupId].items.map(x=>x.section),['Kondicija','Kondicija',recovered],'Save applies the recovered custom title to its original item');
  results.push({width,authorDefinesParts:true,genericDefault:true,duplicateExerciseInDifferentParts:true,
    sourceCategoriesAndDosesUnchanged:true,savedAndReloaded:true,playerAndJournalMatch:true,checkpointPreservesParts:true,
    customLabelEscaped:true,moveDeletePreserveParts:true,pendingCustomLabelFollowsDeletedIndex:true,wholeSupersetAssignment:true,
    pendingCustomBackGuard:true,pendingCustomDraftReload:true});
}

(async()=>{
  const host=await serve(),browser=await launch();
  try{
    for(const width of [375,320]){
      const context=await browser.newContext({viewport:{width,height:812},isMobile:true,hasTouch:true,deviceScaleFactor:1,
        serviceWorkers:'block',locale:'hr-HR',timezoneId:'Europe/Zagreb',reducedMotion:'reduce'});
      const p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.setDefaultTimeout(8000);
      try{
        await p.clock.setFixedTime(fixed);await p.goto(host.url,{waitUntil:'domcontentloaded'});
        await p.getByRole('heading',{name:'Bok, Tomislav',exact:true}).waitFor();await run(p,width);assert.deepEqual(errors,[]);
      }catch(error){await shot(p,'failure',width).catch(()=>{});console.error((await p.locator('.view,.sheet').allInnerTexts()).join('\n').slice(0,1600));throw error;}
      finally{await context.close();}
    }
    const report={engine,passed:true,results,artifacts};fs.writeFileSync(path.join(artifacts,'sections-'+engine+'-report.json'),JSON.stringify(report,null,2));
    console.log(JSON.stringify(report));
  }finally{await browser.close();await host.close();}
})().catch(error=>{console.error(error.stack);process.exitCode=1;});
