'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const D=require('../player-dose.js'),M=require('../muscle-work.js'),StartingLoad=require('../starting-load.js');
const source=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
const clone=value=>JSON.parse(JSON.stringify(value));
function section(start,end){const a=source.indexOf(start),b=source.indexOf(end,a);assert.ok(a>=0&&b>a,start);return source.slice(a,b);}
const oldA={exId:'oldA',measure:'sets',sets:1,reps:5,sec:30,kg:80,sides:false,rest:60};
const oldB={exId:'oldB',measure:'sets',sets:1,reps:5,sec:30,kg:0,sides:false,rest:60};
const replacement={...oldA,exId:'newA',kg:0};
const exercise=(id,prime=['front_chest'])=>({id,name:id,cat:'Snaga',measure:'sets',muscles:{prime},steps:[]});
function starting(sessionOnly=true){
  const sourceProtocol={id:'p',name:'Protokol',items:clone([oldA,oldB])},baseline=clone(sourceProtocol.items),warnings=[];
  const cfg={mode:'ex',ref:{kind:'protocol',id:'p'},items:clone([replacement,oldB]),originalItems:baseline,sessionOnly};
  const inputs={'kg-0':{value:'10',focus(){}},'kg-1':{value:'30',focus(){}}},error={textContent:''};
  const ctx={P:null,S:{pr:{p:sourceProtocol},ex:{newA:{id:'newA',kg:0}},sheet:{kind:'startingLoad',cfg,rows:[{index:0,exId:'newA',name:'New',kind:'db'},{index:1,exId:'oldB',name:'B',kind:'bar'}],values:{},sourceKey:JSON.stringify(sourceProtocol)}},
    StartingLoad,STORE_KEY:'mt.data.v1',savedJson:'saved',pendingExt:null,mtCanon:JSON.stringify,shouldSave:true,
    localStorage:{getItem:()=> 'saved'},document:{getElementById:id=>id==='starting-load-form'?{elements:{namedItem:id=>inputs[id]}}:error},
    startSource:()=>ctx.S.pr.p,startLoadDescription:id=>({kind:id==='newA'?'db':'bar'}),persist:()=>ctx.shouldSave,
    startPlayer:(next,repeating)=>{ctx.started={cfg:clone(next),repeating};if(ctx.startOk===false)return false;ctx.S.sheet=null;return true;},render(){},toast:message=>warnings.push(message)};
  vm.createContext(ctx);vm.runInContext(section('function confirmStartingLoad(){','function startPlayer('),ctx);
  return {ctx,inputs,error,baseline,warnings};
}
test('session-only starting weights preserve both saved template and the entire original baseline',()=>{
  const h=starting(),original=clone(h.ctx.S.pr.p),originalCfg=clone(h.ctx.S.sheet.cfg);
  h.ctx.confirmStartingLoad();
  assert.deepEqual(h.ctx.S.pr.p,original);assert.deepEqual(h.ctx.started.cfg.originalItems,original.items);
  assert.deepEqual(h.ctx.started.cfg.items.map(x=>[x.exId,x.kg]),[['newA',10],['oldB',30]]);
  assert.equal(h.ctx.started.cfg.sessionOnly,true);assert.equal(h.ctx.S.ex.newA.kg,0);
  assert.deepEqual(originalCfg.originalItems,original.items);assert.equal(h.ctx.S.sheet,null);
});
test('session-only dose/target edits remain protected even when the exercise ID has returned to the original',()=>{
  const h=starting();h.ctx.S.sheet.cfg.items=clone([oldA,oldB]);h.ctx.S.sheet.cfg.items[1].targetRir=2;
  h.ctx.S.sheet.rows=[{index:1,exId:'oldB',name:'B',kind:'bar'}];
  const original=clone(h.ctx.S.pr.p);h.ctx.confirmStartingLoad();
  assert.deepEqual(h.ctx.S.pr.p,original);assert.deepEqual(h.ctx.started.cfg.originalItems,original.items);
  assert.equal(h.ctx.started.cfg.items[1].targetRir,2);assert.equal(h.ctx.started.cfg.items[1].kg,30);
});
test('refused starting-weight write retains the form and both original records for a successful retry',()=>{
  const h=starting(),original=clone(h.ctx.S.pr.p);h.ctx.shouldSave=false;
  h.ctx.confirmStartingLoad();assert.equal(h.ctx.started,undefined);assert.deepEqual(h.ctx.S.pr.p,original);
  assert.equal(h.ctx.S.sheet.values[0],'10');assert.equal(h.ctx.S.sheet.values[1],'30');assert.match(h.error.textContent,/nije spremljena/);
  h.ctx.shouldSave=true;h.ctx.confirmStartingLoad();assert.deepEqual(h.ctx.started.cfg.originalItems,original.items);assert.deepEqual(h.ctx.S.pr.p,original);
});
test('ordinary unchanged starting weights still update the saved dose and its matching baseline',()=>{
  const h=starting(false);h.ctx.S.sheet.cfg.items=clone([oldA,oldB]);h.ctx.S.sheet.rows=[{index:1,exId:'oldB',name:'B',kind:'bar'}];
  h.ctx.confirmStartingLoad();assert.equal(h.ctx.S.pr.p.items[1].kg,30);assert.equal(h.ctx.started.cfg.originalItems[1].kg,30);assert.equal(h.ctx.started.cfg.items[1].kg,30);
});
test('a refused initial checkpoint rolls ordinary initial weights back and leaves a retryable source fingerprint',()=>{
  const h=starting(false);h.ctx.S.sheet.cfg.items=clone([oldA,oldB]);h.ctx.S.sheet.rows=[{index:1,exId:'oldB',name:'B',kind:'bar'}];
  const original=clone(h.ctx.S.pr.p),writes=[];h.ctx.persist=()=>{writes.push(clone(h.ctx.S.pr.p));return true;};h.ctx.startOk=false;
  h.ctx.confirmStartingLoad();assert.equal(writes.length,2);assert.equal(writes[0].items[1].kg,30);assert.equal(writes[1].items[1].kg,0);
  assert.deepEqual(h.ctx.S.pr.p,original);assert.equal(h.ctx.S.sheet.sourceKey,JSON.stringify(original));assert.equal(h.ctx.S.sheet.values[1],'30');
  h.ctx.startOk=true;h.ctx.confirmStartingLoad();assert.equal(h.ctx.S.pr.p.items[1].kg,30);assert.equal(h.ctx.S.sheet,null);
});
function manualSteps(items){return items.flatMap((item,g)=>Array.from({length:item.sets},(_,i)=>({kind:'manual',g,set:i+1,it:clone(item),e:{id:item.exId,name:item.exId}})));}
function progression(items,baseline,template){
  const steps=manualSteps(items),ctx={P:{mode:'ex',ref:{kind:'protocol',id:'p'},items:D.items(items),originalItems:clone(baseline),steps,
    doneSteps:Object.fromEntries(steps.map((_,i)=>[i,1])),answers:Object.fromEntries(items.map((_,i)=>[i,true]))},
    S:{pr:{p:{id:'p',items:clone(template)}},ex:{oldA:exercise('oldA'),oldB:exercise('oldB'),newA:exercise('newA')},settings:{}},
    PlayerDose:D,PROG_CATS:{Snaga:1},clone,autoAnswer:()=>true,nextDose:()=>({item:null})};
  vm.createContext(ctx);vm.runInContext(section('const doseSig =','const PROG_STATE =')+section('function progCandidates(){','function doneMsg('),ctx);return ctx;
}
test('a filled session-only B0→30 cannot advance the kg0 saved template even with a previously polluted baseline',()=>{
  const actual=[{...replacement,kg:10},{...oldB,kg:30}],ctx=progression(actual,[oldA,{...oldB,kg:30}],[oldA,oldB]);
  assert.deepEqual(clone(ctx.progCandidates()),[]);ctx.applyProgress();assert.equal(ctx.S.pr.p.items[1].ok,undefined);assert.equal(ctx.S.pr.p.items[1].kg,0);
});
test('normal matching prescriptions count once while a changed external template is excluded',()=>{
  const matching=[{...oldB,kg:30}],ctx=progression(matching,matching,matching);
  assert.equal(ctx.progCandidates().length,1);ctx.applyProgress();assert.equal(ctx.S.pr.p.items[0].ok,1);
  const external=progression(matching,matching,[{...oldB,kg:35}]);assert.equal(external.progCandidates().length,0);external.applyProgress();assert.equal(external.S.pr.p.items[0].ok,undefined);
});
test('a live edited dose remains excluded even if current item scalars were later restored to the saved template',()=>{
  const matching=[{...oldB,kg:30}],ctx=progression(matching,matching,matching);
  ctx.P.steps[0].it.kg=35;
  assert.equal(ctx.progCandidates().length,0);ctx.applyProgress();assert.equal(ctx.S.pr.p.items[0].ok,undefined);
});
function checkpointHarness(P){
  const writes=new Map(),ctx={P,S:{field:{},ex:{newA:exercise('newA'),oldB:exercise('oldB')},stack:[],sheet:null},PlayerDose:D,MuscleWork:M,SessionClock:require('../session-clock.js'),
    audioMode(){},ensureAudio(){},stepsFromItems:manualSteps,clone,isPlainObj:value=>!!value&&typeof value==='object'&&!Array.isArray(value),uid:()=> 'hnew123',
    render(){},keepAwake(){},remaining:()=>ctx.P.left||0,PLAY_KEY:'mt.play',localStorage:{setItem:(key,value)=>writes.set(key,value)},
    clearInterval(){},setInterval:()=> 1,tick(){},ticker:null};
  ctx.repsOf=(item,set)=>D.at(item,set).reps;
  vm.createContext(ctx);vm.runInContext(section('function repSetSeconds(','function protoMin(')+
    section('function cinemaManualTarget(','function cinemaFooter(')+section('function savePlay(){','function clearPlay(){')+
    section('function restorePlay(s){','// leaves the player'),ctx);
  return {ctx,writes};
}
test('a checkpoint restores different replacement/original IDs and their matching muscle snapshots without borrowing today profiles',()=>{
  const actual=[{...replacement,kg:10,targetRir:2}],original=[{...oldA,targetRir:0}];
  const currentSnap=M.pack(M.plannedItem(exercise('newA',['front_chest','back_triceps']),actual[0]));
  const oldSnap=M.pack(M.plannedItem(exercise('oldA',['front_chest']),original[0]));
  const P={mode:'ex',title:'Session',ref:{kind:'protocol',id:'p'},items:D.items(actual),originalItems:original,sessionOnly:true,
    steps:manualSteps(actual),i:0,left:0,done:true,doneSteps:{0:1},startedAt:1000,finishedAt:2000,secs:1,historyId:'hproof123',musclePlan:[currentSnap],originalMusclePlan:[oldSnap],rir:{0:1}};
  const h=checkpointHarness(P);assert.equal(h.ctx.savePlay(),true);const saved=JSON.parse(h.writes.get('mt.play'));
  assert.equal(saved.sessionOnly,true);h.ctx.P=null;assert.equal(h.ctx.restorePlay(saved),true);
  assert.equal(h.ctx.P.items[0].exId,'newA');assert.equal(h.ctx.P.originalItems[0].exId,'oldA');assert.equal(h.ctx.P.sessionOnly,true);
  assert.equal(M.sanitize(h.ctx.P.musclePlan[0]).exerciseId,'newA');assert.equal(M.sanitize(h.ctx.P.originalMusclePlan[0]).exerciseId,'oldA');
  assert.deepEqual(M.sanitize(h.ctx.P.musclePlan[0]).primary,['chest','triceps']);assert.deepEqual(M.sanitize(h.ctx.P.originalMusclePlan[0]).primary,['chest']);
  assert.equal(h.ctx.P.items[0].targetRir,2);assert.equal(h.ctx.P.originalItems[0].targetRir,0);assert.equal(h.ctx.P.rir[0],1);
  assert.equal(h.ctx.S.ex.oldA,undefined,'removed original exercise is not reconstructed from the current library');
});
test('mismatched saved muscle identities are unknown instead of copied onto the replacement',()=>{
  const actual=[{...replacement,kg:10}],original=[oldA],h=checkpointHarness(null);
  const wrong=M.pack(M.plannedItem(exercise('oldA'),oldA));
  const saved={mode:'ex',ref:{kind:'protocol',id:'p'},items:actual,originalItems:original,sessionOnly:true,done:true,at:1000,musclePlan:[wrong],originalMusclePlan:[M.pack(M.plannedItem(exercise('newA'),actual[0]))]};
  assert.equal(h.ctx.restorePlay(saved),true);assert.equal(h.ctx.P.musclePlan[0],null);assert.equal(h.ctx.P.originalMusclePlan[0],null);
});
test('planned reserve targets stay optional, bounded and separate from actual reserve after resume',()=>{
  const ctx={cleanFixes:0};vm.createContext(ctx);vm.runInContext(section('function cleanVal(k, v, depth){','const asText ='),ctx);
  for(const [key,max] of [['targetRir',10],['targetSir',40]]){
    assert.equal(ctx.cleanVal(key,0,0),0);assert.equal(ctx.cleanVal(key,max,0),max);assert.equal(ctx.cleanVal(key,null,0),null);
    for(const invalid of ['2',-1,1.5,max+1,Infinity])assert.equal(ctx.cleanVal(key,invalid,0),undefined);
  }
  const actual=[{...replacement,kg:10,targetRir:0}],h=checkpointHarness(null);
  const saved={mode:'ex',ref:{kind:'protocol',id:'p'},items:actual,originalItems:[oldA],sessionOnly:true,done:true,at:1000};
  assert.equal(h.ctx.restorePlay(saved),true);assert.equal(h.ctx.P.items[0].targetRir,0);assert.equal(h.ctx.P.rir,undefined);
});
test('a legacy stopwatch past the new target resumes with a fresh countdown and keeps recorded elapsed time',()=>{
  const item={...oldB,reps:10};
  const timeline=D.packSteps(manualSteps([item]));
  const saved={mode:'ex',ref:{kind:'protocol',id:'p'},items:[item],at:1000,startedAt:1000,i:0,doneSteps:{},
    clock:{seconds:100,at:1000,paused:true},stepClock:{seconds:100,at:1000,paused:true},liveSchedule:timeline};
  const h=checkpointHarness(null);
  h.ctx.Date={now:()=>2000};
  assert.equal(h.ctx.restorePlay(saved),true);
  assert.equal(h.ctx.P.steps[0].targetSec,30);
  assert.equal(h.ctx.P.stepClock.seconds,0);
  assert.equal(h.ctx.P.clock.seconds,100);
  assert.equal(Object.keys(h.ctx.P.doneSteps).length,0);
});
test('actual startup refuses an unsaved first checkpoint without losing its form, then starts once on retry',()=>{
  const cfg={mode:'ex',title:'Replacement',ref:{kind:'protocol',id:'p'},items:[{...replacement,kg:10}],originalItems:[oldA],sessionOnly:true};
  const writes=new Map(),audio=[],ctx={P:null,S:{stack:[{v:'pr',id:'p'}],sheet:{kind:'startingLoad',values:{0:'10'},cfg}},PlayerDose:D,clone,SessionClock:require('../session-clock.js'),
    PLAY_KEY:'mt.play',shouldCheckpoint:false,intervals:0,ticker:null,
    lsGet:()=>null,openStartingLoad:()=>false,audioMode:on=>audio.push(on),ensureAudio(){},stepsFromItems:manualSteps,
    beep(){},buzz(){},workoutSignal(){},render(){},keepAwake:()=>Promise.resolve(),wakeHint(){},clearInterval(){},setInterval:()=>++ctx.intervals,tick(){},toast(){},
    localStorage:{setItem:(key,value)=>{if(!ctx.shouldCheckpoint)throw Error('Synthetic checkpoint refusal');writes.set(key,value);}}};
  vm.createContext(ctx);
  vm.runInContext(section('function startPlayer(cfg, repeating=false){','function tick(){')+section('function savePlay(){','function clearPlay(){'),ctx);
  assert.equal(ctx.startPlayer(cfg),false);assert.equal(ctx.P,null);assert.equal(ctx.S.stack.length,1);assert.equal(ctx.intervals,0);assert.equal(writes.has('mt.play'),false);
  assert.equal(ctx.S.sheet.kind,'startingLoad');assert.equal(ctx.S.sheet.values[0],'10');assert.match(ctx.S.sheet.error,/nije spremljen/);assert.equal(audio.at(-1),false);
  ctx.shouldCheckpoint=true;assert.equal(ctx.startPlayer(cfg),true);assert.equal(ctx.S.sheet,null);assert.equal(ctx.S.stack.length,2);assert.equal(ctx.intervals,1);
  const saved=JSON.parse(writes.get('mt.play'));assert.equal(saved.sessionOnly,true);assert.equal(saved.items[0].exId,'newA');assert.equal(saved.items[0].kg,10);assert.equal(saved.originalItems[0].exId,'oldA');assert.equal(saved.originalItems[0].kg,80);
});
