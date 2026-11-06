'use strict';

// Preview dose changes are session-local until the user explicitly edits and
// saves the training. These flows use disposable synthetic browser data only.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {artifacts,engine,fixture:baseFixture,launch,serve,openJournal,closeJournal,openQuit}=require('./runtime.cjs');
const id='prestart-edit-audit',frozenId='prestart-edit-program',programId='prestart-program-audit',variantId='prestart-db-press';
const a=(p,name)=>p.locator('[data-a="'+name+'"]');
const detail=p=>p.locator('.workout-exercise-page');
const editAction=(p,name)=>detail(p).locator('.workout-edit-actions [data-a="'+name+'"]');
const store=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('mt.data.v1')));
const player=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('mt.play')));
const draft=p=>p.evaluate(()=>JSON.parse(sessionStorage.getItem('mt.unsavedDraft.v1'))?.draft);
const form=p=>p.locator('#play-dose-form');
const value=(p,set,key)=>form(p).locator('[data-dose-set="'+set+'"] [data-dose-value="'+key+'"]');
const inline=(p,set,key)=>detail(p).locator('.workout-set-row[data-set="'+set+'"] [data-field="'+key+'"]');
const clone=x=>JSON.parse(JSON.stringify(x));
const results=[];

function fixture(){
  const d=baseFixture();d.log=[];d.field={};d.settings.sound=false;
  d.settings.planDates={};d.settings.matchDates={};d.settings.matchDay=-1;
  d.exercises[variantId]={...d.exercises['bench-press'],id:variantId,name:'Kontrolni potisak bučicama',
    equip:['Bučice'],equipment:'Dvije bučice',movementPattern:'U1',sets:3,reps:9,kg:0,media:null,mediaType:null};
  const items=[
    {exId:'bench-press',measure:'sets',sets:3,reps:8,kg:40,rest:60,sides:false,section:'Snaga',ok:2},
    {exId:'hip-thrust',measure:'sets',sets:4,reps:10,repsList:[10,10,10,10],kg:60,kgList:[60,60,60,60],rest:0,sides:false,section:'Snaga',ss:'preview-pair',ok:2,fail:1},
    {exId:'bb-row',measure:'sets',sets:4,reps:8,kg:35,rest:60,sides:false,section:'Snaga',ss:'preview-pair',ok:3},
    {exId:'goblet-squat',measure:'sets',sets:3,reps:10,kg:20,rest:60,sides:false,section:'Snaga'}
  ];
  d.protocols={
    [id]:{id,name:'Uredi prije pokretanja',tag:'Teretana',days:[],items},
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
  const scope=live?'.cinema-journal .workout-journal-open':'';
  await p.locator(scope+'[data-a="workoutExercise"][data-j="'+index+'"]').first().click();await detail(p).waitFor();
}
async function closeExercise(p){await p.keyboard.press('Escape');await detail(p).waitFor({state:'hidden'});await closeJournal(p);}
async function editDose(p){await editAction(p,'workoutEdit').click();await form(p).waitFor();}
async function apply(p){await a(p,'playDoseApply').click();await detail(p).waitFor();}
async function shot(p,name,width){await p.screenshot({path:path.join(artifacts,'prestart-edit-'+engine+'-'+name+'-'+width+'.png')});}
async function assertUntouched(p,before){const d=await store(p);assert.deepEqual(d.protocols[id],before.protocols[id]);assert.deepEqual(d.log,before.log);assert.equal(await player(p),null);}
async function run(p,width){
  await a(p,'dataSheet').click();await p.locator('#importFile').setInputFiles({name:'prestart-synthetic.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(fixture()))});
  await a(p,'restoreApply').click();await a(p,'restoreApply').waitFor({state:'hidden'});await openProtocol(p);
  const before=await store(p);

  // Native first taps must survive the field's blur/change render. Do not preblur,
  // press Tab, force a click or dispatch synthetic handlers around this seam.
  await exercise(p,1);await inline(p,1,'reps').fill('11');await editAction(p,'workoutEditPlan').click();
  await p.locator('#p-name').waitFor();assert.equal((await draft(p)).items[1].repsList[0],11,'first tap carries the focused repetition edit into the plan');
  await a(p,'back').first().click();await p.getByRole('dialog',{name:'Spremiti promjene?'}).waitFor();await a(p,'leaveDiscard').click();
  await assertUntouched(p,before);await openProtocol(p);await exercise(p,1);
  await inline(p,1,'kg').fill('62');await editAction(p,'workoutEdit').click();await form(p).waitFor();
  assert.equal(await value(p,1,'kg').inputValue(),'62','first tap into set editor carries the focused kg edit');
  await a(p,'playDoseCancel').click();await closeExercise(p);await openProtocol(p);

  // Non-first exercise: editing is visible without opening the RIR options.
  await exercise(p,1);assert.equal(await detail(p).getAttribute('data-context'),'preview');
  assert.equal(await detail(p).locator('.workout-set-row').count(),4);
  assert.equal(await editAction(p,'workoutEdit').isVisible(),true);assert.equal(await editAction(p,'workoutEditPlan').isVisible(),true);
  const controls=await detail(p).locator('.workout-edit-actions button').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {width:r.width,height:r.height};}));
  controls.forEach(r=>assert.ok(r.width>=44&&r.height>=44,'prestart edit buttons retain touch targets'));
  await detail(p).locator('.workout-edit-actions').scrollIntoViewIfNeeded();await shot(p,'hip-thrust-controls',width);
  await editDose(p);await value(p,1,'kg').fill('999');await a(p,'playDoseCancel').click();await detail(p).waitFor();
  assert.equal(await inline(p,1,'kg').inputValue(),'60');await assertUntouched(p,before);

  // Another occurrence's session preview must carry into the eventual builder too.
  await closeExercise(p);await exercise(p,0);await editDose(p);
  await value(p,1,'reps').fill('9');await value(p,1,'kg').fill('45');await apply(p);await assertUntouched(p,before);
  await closeExercise(p);await exercise(p,1);await editDose(p);
  await value(p,1,'kg').fill('-5');await a(p,'playDoseApply').click();
  await form(p).locator('[role="alert"]').waitFor();assert.equal(await value(p,1,'kg').inputValue(),'-5','invalid raw input survives failed apply');
  await assertUntouched(p,before);await value(p,1,'kg').fill('60');
  await p.locator('#play-dose-sets').fill('5');await a(p,'playDoseResize').click();assert.equal(await form(p).locator('[data-dose-set]').count(),5);
  const reps=[10,10,8,8,6],kg=[60,60,65,65,70];
  for(let i=0;i<5;i++){await value(p,i+1,'reps').fill(String(reps[i]));await value(p,i+1,'kg').fill(String(kg[i]));}
  await apply(p);assert.equal(await detail(p).locator('.workout-set-row').count(),5);
  assert.equal(await inline(p,5,'reps').inputValue(),'6');assert.equal(await inline(p,5,'kg').inputValue(),'70');
  await assertUntouched(p,before);await shot(p,'edited-preview',width);

  // Opening the persistent editor carries both preview edits but does not write.
  await editAction(p,'workoutEditPlan').click();await p.locator('#p-name').waitFor();
  let d=await draft(p);assert.equal(d._open,1,'Uredi trening opens the selected non-first exercise');
  assert.equal(d.items[0].repsList[0],9);assert.equal(d.items[0].kgList[0],45);
  assert.equal(d.items[1].sets,5);assert.deepEqual(d.items[1].repsList,reps);assert.deepEqual(d.items[1].kgList,kg);
  assert.equal(d.items[1].ss,d.items[2].ss);assert.equal(d.items[2].sets,4);await assertUntouched(p,before);
  await a(p,'back').first().click();await p.getByRole('dialog',{name:'Spremiti promjene?'}).waitFor();await a(p,'leaveDiscard').click();
  await p.locator('.workout-overview').waitFor();await assertUntouched(p,before);
  await exercise(p,1);await editAction(p,'workoutEditPlan').click();await p.locator('#p-name').waitFor();
  await p.locator('.topbar [data-a="savePr"]').click();await p.locator('.workout-overview').waitFor();await openProtocol(p);
  const saved=await store(p),items=saved.protocols[id].items;
  assert.equal(items[0].repsList[0],9);assert.equal(items[0].kgList[0],45);assert.equal(items[1].sets,5);
  assert.deepEqual(items[1].repsList,reps);assert.deepEqual(items[1].kgList,kg);
  assert.equal(items[1].ok,undefined,'changed persistent dose resets its old progression counter');assert.equal(items[1].fail,undefined);
  assert.equal(items[2].ok,3,'unchanged dose retains its progression state');
  assert.equal(items[1].ss,items[2].ss);assert.equal(items[2].sets,4);assert.deepEqual(saved.log,before.log);assert.equal(await player(p),null);

  await a(p,'startPr').click();await p.locator('.workout-cinema').waitFor();
  const started=await player(p);assert.equal(started.items[1].sets,5);assert.deepEqual(started.items[1].repsList,reps);assert.deepEqual(started.items[1].kgList,kg);
  assert.equal(started.items[0].repsList[0],9);assert.equal(started.items[0].kgList[0],45);
  await exercise(p,1);assert.equal(await editAction(p,'workoutEdit').isVisible(),true);assert.equal(await editAction(p,'workoutEditPlan').count(),0,'live edit remains session-only');
  await editDose(p);assert.equal((await player(p)).clock.paused,true);await a(p,'playDoseCancel').click();
  await closeExercise(p);await openQuit(p);await a(p,'quitDiscard').click();
  assert.deepEqual((await store(p)).protocols[id],saved.protocols[id]);assert.deepEqual((await store(p)).log,[]);

  // Saving a preview replacement makes it the new template. The old runDose
  // sessionOnly marker must not prevent the subsequent initial weight save.
  await openProtocol(p);await exercise(p,0);await detail(p).locator('[data-a="workoutSwap"]').click();
  await p.locator('#workout-equipment').selectOption({label:'Bučice'});
  await p.locator('[data-a="workoutCandidate"][data-id="'+variantId+'"]').click();await detail(p).waitFor();
  await editAction(p,'workoutEditPlan').click();await p.locator('#p-name').waitFor();
  await p.locator('.topbar [data-a="savePr"]').click();await p.locator('.workout-overview').waitFor();
  assert.equal((await store(p)).protocols[id].items[0].exId,variantId);
  // Deliberately keep this existing preview page alive across Save and Start.
  await a(p,'startPr').click();const weightForm=p.locator('#starting-load-form');await weightForm.waitFor();
  await weightForm.locator('input').first().fill('22');await weightForm.locator('button[type="submit"]').click();
  await p.locator('.workout-cinema').waitFor();const replacementPlayer=await player(p);
  assert.equal(replacementPlayer.sessionOnly,false,'saved replacement is no longer a session-only preview');
  assert.equal(replacementPlayer.items[0].exId,variantId);assert.equal(replacementPlayer.items[0].kg,22);
  assert.equal((await store(p)).protocols[id].items[0].kg,22,'initial weight persists on the newly saved template');
  assert.equal((await store(p)).exercises[variantId].kg,0,'protocol starting weight never changes the library exercise');
  await openQuit(p);await a(p,'quitDiscard').click();

  // Program preview remains protected; its explicit whole-plan route is visible.
  await openProtocol(p,frozenId);const programBefore=(await store(p)).protocols[frozenId];await exercise(p,1);
  assert.equal(await editAction(p,'workoutEdit').count(),0);assert.equal(await inline(p,1,'reps').isDisabled(),true);assert.equal(await inline(p,1,'kg').isDisabled(),true);
  assert.equal(await editAction(p,'workoutEditPlan').isVisible(),true);await editAction(p,'workoutEditPlan').click();await p.locator('#p-name').waitFor();
  d=await draft(p);if(d){assert.equal(d._open,1);assert.equal(d.program,programId);}
  await a(p,'back').first().click();if(await a(p,'leaveDiscard').isVisible())await a(p,'leaveDiscard').click();
  assert.deepEqual((await store(p)).protocols[frozenId],programBefore);

  await home(p);await p.getByRole('button',{name:'Knjižnica vježbi',exact:true}).click();await p.locator('#libq').fill('hip thrust');
  await p.locator('[data-a="openEx"][data-id="hip-thrust"]').first().click();await detail(p).waitFor();
  assert.equal(await detail(p).getAttribute('data-context'),'library');assert.equal(await editAction(p,'workoutEdit').isVisible(),true);
  assert.equal(await editAction(p,'workoutEditPlan').count(),0,'library only has the session dose editor');await editDose(p);await a(p,'playDoseCancel').click();
  assert.deepEqual((await store(p)).exercises,before.exercises);assert.deepEqual((await store(p)).log,[]);assert.equal(await player(p),null);
  results.push({width,nonFirstHipThrustEditableBeforeStart:true,initialSets:4,previewSets:5,previewSourceUnchanged:true,
    invalidInputRetained:true,cancelDoesNotWrite:true,allPreviewDosesCarried:true,selectedBuilderRow:1,
    firstTapFromFocusedReps:true,firstTapFromFocusedKg:true,
    explicitSavePersists:true,changedProgressReset:true,unchangedProgressRetained:true,playerUsesSavedDose:true,
    savedReplacementBecomesTemplate:true,initialWeightSavedOnTemplate:true,
    programPreviewProtected:true,libraryAndLiveSessionOnly:true});
}

(async()=>{
  const host=await serve(),browser=await launch();
  try{
    for(const width of [375,320]){
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
