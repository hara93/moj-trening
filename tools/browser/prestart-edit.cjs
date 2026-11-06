'use strict';

// Direct set editing in disposable browser data. Preview edits remain local to
// the next session; adding a row must never create completed work or known kg.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {artifacts,engine,fixture:baseFixture,launch,serve,openJournal,closeJournal,openQuit}=require('./runtime.cjs');
const id='prestart-inline-audit',unknownId='prestart-unknown-audit',maxId='prestart-max-audit';
const frozenId='prestart-frozen-audit',programId='prestart-program-audit';
const a=(p,name)=>p.locator('[data-a="'+name+'"]');
const detail=p=>p.locator('.workout-exercise-page');
const add=p=>detail(p).locator('[data-a="workoutAddSet"]');
const row=(p,set,key)=>detail(p).locator('.workout-set-row[data-set="'+set+'"] [data-field="'+key+'"]');
const store=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('mt.data.v1')));
const player=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('mt.play')));
const clone=x=>JSON.parse(JSON.stringify(x));
const results=[];

function fixture(){
  const d=baseFixture();d.log=[];d.field={};d.settings.sound=false;
  d.settings.planDates={};d.settings.matchDates={};d.settings.matchDay=-1;
  d.exercises['hip-thrust'].sets=3;d.exercises['hip-thrust'].reps=10;d.exercises['hip-thrust'].kg=50;
  const items=[
    {exId:'bench-press',measure:'sets',sets:2,reps:8,kg:40,rest:60,sides:false,section:'Snaga'},
    {exId:'hip-thrust',measure:'sets',sets:3,reps:12,repsList:[12,10,8],kg:50,kgList:[50,55,60],rest:60,sides:false,section:'Snaga'},
    {exId:'bb-row',measure:'sets',sets:2,reps:8,kg:35,rest:0,sides:false,section:'Snaga',ss:'pair-audit'},
    {exId:'goblet-squat',measure:'sets',sets:2,reps:10,kg:20,rest:60,sides:false,section:'Snaga',ss:'pair-audit'}
  ];
  d.protocols={
    [id]:{id,name:'Izravno uređivanje serija',tag:'Teretana',days:[],items},
    [unknownId]:{id:unknownId,name:'Sačuvaj nepoznatu kilažu',days:[],items:[{...clone(items[1]),kg:0,kgList:[50,55,null]}]},
    [maxId]:{id:maxId,name:'Najviše dvadeset serija',days:[],items:[{...clone(items[1]),sets:20,repsList:Array(20).fill(8),kgList:Array(20).fill(50)}]},
    [frozenId]:{id:frozenId,name:'Zaštićena programska doza',program:programId,week:1,slot:0,items:clone(items)}
  };
  d.programs={[programId]:{id:programId,name:'Kontrolni program',days:[],weeks:[{week:1,sessions:[{label:'A',pr:frozenId}]}]}};
  return d;
}
async function home(p){await p.reload({waitUntil:'domcontentloaded'});await p.getByRole('heading',{name:'Bok, Tomislav',exact:true}).waitFor();}
async function openProtocol(p,key=id){
  await home(p);await p.getByRole('button',{name:'Moj pregled',exact:true}).click();await a(p,'dashboardProtocols').first().click();
  if(key===frozenId)await p.locator('[data-a="openProg"][data-id="'+programId+'"]').click();
  await p.locator('[data-a="openPr"][data-id="'+key+'"]').first().click();await p.locator('.workout-overview').waitFor();
}
async function exercise(p,index){
  const live=await p.locator('.workout-cinema').count();if(live)await openJournal(p,true);
  await p.locator((live?'.cinema-journal .workout-journal-open':'')+'[data-a="workoutExercise"][data-j="'+index+'"]').first().click();
  await detail(p).waitFor();
}
async function closeExercise(p){await p.keyboard.press('Escape');await detail(p).waitFor({state:'hidden'});await closeJournal(p);}
async function edit(p,set,key,value){await row(p,set,key).fill(String(value));await row(p,set,key).press('Tab');}
async function shot(p,name,width){await p.screenshot({path:path.join(artifacts,'prestart-edit-'+engine+'-'+name+'-'+width+'.png')});}
async function noOldButtons(p){
  assert.equal(await detail(p).locator('.workout-edit-actions,[data-a="workoutEditPlan"]').count(),0);
  const optional=detail(p).locator('[data-a="workoutEdit"]');if(await optional.count())assert.equal(await optional.isVisible(),false,'legacy optional count editor stays inside closed details');
}
async function untouched(p,before){const d=await store(p);assert.deepEqual(d.protocols,before.protocols);assert.deepEqual(d.exercises,before.exercises);assert.deepEqual(d.log,before.log);}
async function run(p,width){
  await a(p,'dataSheet').click();await p.locator('#importFile').setInputFiles({name:'prestart-inline-synthetic.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(fixture()))});
  await a(p,'restoreApply').click();await a(p,'restoreApply').waitFor({state:'hidden'});await openProtocol(p);
  const before=await store(p);

  await exercise(p,1);await noOldButtons(p);assert.equal(await detail(p).locator('.workout-set-row').count(),3);
  assert.equal(await row(p,1,'reps').isDisabled(),false);assert.equal(await row(p,1,'kg').isDisabled(),false);
  await edit(p,1,'reps',11);
  // A direct native tap from the focused kg field both commits it and adds one
  // row. No preblur, forced clicks or synthetic event handlers bypass the seam.
  await row(p,3,'kg').fill('62');await add(p).click();
  assert.equal(await detail(p).locator('.workout-set-row').count(),4);
  assert.deepEqual(await detail(p).locator('[data-field="reps"]').evaluateAll(ns=>ns.map(n=>n.value)),['11','10','8','8']);
  assert.deepEqual(await detail(p).locator('[data-field="kg"]').evaluateAll(ns=>ns.map(n=>n.value)),['50','55','62','62']);
  assert.equal(await detail(p).locator('.workout-set-row[data-state="done"]').count(),0);
  await untouched(p,before);assert.equal(await player(p),null);
  const touch=await add(p).boundingBox();assert.ok(touch.height>=44&&touch.width>=44);
  await add(p).scrollIntoViewIfNeeded();await shot(p,'hip-thrust-four-rows',width);

  await row(p,1,'reps').fill('0');await add(p).click();
  assert.equal(await detail(p).locator('.workout-set-row').count(),4,'invalid input cannot add a row');
  assert.equal(await row(p,1,'reps').inputValue(),'0','invalid raw input remains available to correct');
  assert.equal(await row(p,1,'reps').getAttribute('aria-invalid'),'true');
  await detail(p).locator('[data-a="workoutClose"]').first().click();await detail(p).waitFor({state:'hidden'});
  await untouched(p,before);await exercise(p,1);
  assert.equal(await detail(p).locator('.workout-set-row').count(),4,'invalid raw input does not trap Back or change the dose');
  await edit(p,1,'reps',11);await untouched(p,before);
  await closeExercise(p);await exercise(p,1);assert.equal(await detail(p).locator('.workout-set-row').count(),4,'closing detail retains the session preview');
  await closeExercise(p);await openProtocol(p);await exercise(p,1);
  assert.equal(await detail(p).locator('.workout-set-row').count(),3,'reload leaves the saved training unchanged');

  // Prepare another session locally, then start directly from the detail.
  await edit(p,1,'reps',9);await edit(p,3,'kg',65);await row(p,3,'reps').fill('7');await add(p).click();
  assert.equal(await detail(p).locator('.workout-set-row').count(),4);
  await detail(p).locator('[data-a="workoutStart"]').click();await p.locator('.workout-cinema').waitFor();
  const started=await player(p);assert.equal(started.items[1].sets,4);
  assert.deepEqual(started.items[1].repsList,[9,10,7,7]);assert.deepEqual(started.items[1].kgList,[50,55,65,65]);
  assert.deepEqual(started.items[2].ss,started.items[3].ss);assert.equal(started.items[2].sets,2);
  assert.equal(Object.keys(started.doneSteps).length,0);await untouched(p,before);

  // Complete exactly one hip-thrust set; adding a future row retains its lock
  // and actual evidence while increasing only the remaining prescription.
  await openJournal(p,true);await p.locator('.cinema-journal [data-a="cinemaGoSet"][data-j="1"]').click();
  if((await player(p)).liveSchedule[(await player(p)).i].kind==='ready')await p.locator('.cinema-primary').click();
  const current=await player(p);assert.equal(current.liveSchedule[current.i].kind,'manual');assert.equal(current.liveSchedule[current.i].g,1);
  await p.locator('.cinema-primary').click();assert.equal(Object.keys((await player(p)).doneSteps).length,1);
  await exercise(p,1);await noOldButtons(p);assert.equal(await row(p,1,'reps').isDisabled(),true);assert.equal(await row(p,1,'kg').isDisabled(),true);
  const done=await row(p,1,'reps').inputValue();await add(p).click();
  assert.equal(await detail(p).locator('.workout-set-row').count(),5);assert.equal(await row(p,5,'reps').inputValue(),'7');assert.equal(await row(p,5,'kg').inputValue(),'65');
  assert.equal(await row(p,1,'reps').isDisabled(),true);assert.equal(await row(p,1,'kg').isDisabled(),true);assert.equal(await row(p,1,'reps').inputValue(),done);
  assert.equal(await detail(p).locator('.workout-set-row[data-state="done"]').count(),1);
  const expanded=await player(p);assert.equal(expanded.items[1].sets,5);assert.equal(Object.keys(expanded.doneSteps).length,1);
  await untouched(p,before);await shot(p,'live-locks',width);
  await closeExercise(p);await openQuit(p);await a(p,'quitDiscard').click();await untouched(p,before);assert.equal(await player(p),null);

  // Unknown is distinct from zero, including the new copy of the last row.
  await openProtocol(p,unknownId);await exercise(p,0);assert.equal(await row(p,3,'kg').inputValue(),'');
  await add(p).click();assert.equal(await detail(p).locator('.workout-set-row').count(),4);
  assert.equal(await row(p,3,'kg').inputValue(),'');assert.equal(await row(p,4,'kg').inputValue(),'');
  assert.deepEqual(await detail(p).locator('[data-field="reps"]').evaluateAll(ns=>ns.map(n=>n.value)),['12','10','8','8']);
  await untouched(p,before);await detail(p).locator('[data-a="workoutStart"]').click();await p.locator('#starting-load-form').waitFor();assert.equal(await player(p),null);
  await p.keyboard.press('Escape');await untouched(p,before);

  await openProtocol(p,maxId);await exercise(p,0);assert.equal(await detail(p).locator('.workout-set-row').count(),20);
  if(await add(p).count())assert.equal(await add(p).isDisabled(),true,'twenty rows is the enforced limit');
  await untouched(p,before);

  await openProtocol(p,frozenId);await exercise(p,1);await noOldButtons(p);
  assert.equal(await row(p,1,'reps').isDisabled(),true);assert.equal(await row(p,1,'kg').isDisabled(),true);
  if(await add(p).count())assert.equal(await add(p).isDisabled(),true,'program preview remains protected');
  await untouched(p,before);

  await home(p);await p.getByRole('button',{name:'Knjižnica vježbi',exact:true}).click();await p.locator('#libq').fill('hip thrust');
  await p.locator('[data-a="openEx"][data-id="hip-thrust"]').first().click();await detail(p).waitFor();await noOldButtons(p);
  assert.equal(await detail(p).locator('.workout-set-row').count(),3);await add(p).click();assert.equal(await detail(p).locator('.workout-set-row').count(),4);
  await untouched(p,before);assert.equal(await player(p),null);
  results.push({width,directInlineOnly:true,noNewEditingButtons:true,hipThrustThreeToFour:true,lastPrescriptionCopied:true,
    focusedFieldFirstTap:true,invalidRawBlocksAdd:true,invalidInputCanGoBack:true,previewSourceAndHistoryUnchanged:true,backRetainsPreview:true,
    reloadPreservesSavedPlan:true,playerUsesPreviewDose:true,liveAddedRowCreatesNoWork:true,completedRowsStayLocked:true,
    unknownKgRemainsUnknown:true,maxTwenty:true,programPreviewProtected:true,librarySessionOnly:true});
}
(async()=>{
  const host=await serve(),browser=await launch();
  try{for(const width of [375,320]){
    const context=await browser.newContext({viewport:{width,height:812},isMobile:true,hasTouch:true,deviceScaleFactor:1,
      serviceWorkers:'block',locale:'hr-HR',timezoneId:'Europe/Zagreb',reducedMotion:'reduce'});
    const p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.setDefaultTimeout(8000);
    try{await p.clock.setFixedTime(new Date('2026-11-06T10:00:00+01:00'));await p.goto(host.url,{waitUntil:'domcontentloaded'});
      await p.getByRole('heading',{name:'Bok, Tomislav',exact:true}).waitFor();await run(p,width);assert.deepEqual(errors,[]);
    }catch(error){await shot(p,'failure',width).catch(()=>{});console.error((await p.locator('.view,.sheet').allInnerTexts()).join('\n').slice(0,1800));throw error;}
    finally{await context.close();}
  }
  const report={engine,passed:true,results,artifacts};fs.writeFileSync(path.join(artifacts,'prestart-edit-'+engine+'-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
  }finally{await browser.close();await host.close();}
})().catch(error=>{console.error(error.stack);process.exitCode=1;});
