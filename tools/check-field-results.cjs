'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const H=require('../history-model.js'),UI=require('../history.js'),TrainingLoad=require('../training-load.js');
const source=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
const window={HistoryModel:H};
for(const name of ['data.js','loadfx.js'])new Function('window',fs.readFileSync(path.join(__dirname,'..',name),'utf8'))(window);
const fields=window.SEED.field;
function loadModel(P={},logs=[]){
  const S={settings:{},field:fields,ex:window.SEED.exercises,log:logs};
  const start=source.indexOf('const LOAD_MAS ='),end=source.indexOf('/* ---------- training load, model LM1',start);
  return new Function('S','P','masNow','HistoryModel',source.slice(start,end)+';return {fieldDoneLoad,fieldLogLoad,repairKnownMasLoads,itemLoad};')(S,P,()=>P.priorMas||0,H);
}
function effort(){
  const S={ex:Object.fromEntries(Object.entries(window.SEED.exercises).map(([id,e])=>[id,{...e,id}])),log:[]};
  return new Function('S','window',source.slice(source.indexOf('// ---- LM1 begin ----'),source.indexOf('// ---- LM1 end ----'))+';return computeSession;')(S,window);
}
function player(extra={}){
  const f={...fields['mas-test-5-min'],id:'mas-test-5-min'};
  return {f,mode:'field',done:true,steps:[{kind:'work',b:f.blocks[0]}],doneSteps:{0:true},...extra};
}
function legacy(extra={}){
  const entry={kind:'field',refId:'mas-test-5-min',historyId:'session',at:1000,secs:360,load:{m:1350,hsr:0,spr:0,min:5,zones:[0,0,1350,0],dose:'full',mas:4.5},load2:{v:'LM1',B:44.5,band:13.4}};
  return {...entry,...extra};
}
const result=(extra={})=>({kind:'test',test:'mas',historyId:'test',parentSessionId:'session',at:1000,dist:1500,value:5,...extra});

test('reported MAS distance replaces the prior estimate without inventing speed zones',()=>{
  for(const priorMas of [0,4,6]){
    const p=player({masDist:1500,priorMas}),load=loadModel(p).fieldDoneLoad();
    assert.deepEqual(load,{min:5,dose:'full',source:'mas-test',m:1500,mas:5});
    assert.equal(H.fieldSummary({load}).complete,false);
    for(const key of ['hsr','spr','zones'])assert.equal(Object.hasOwn(load,key),false);
  }
});
test('missing, malformed, partial or interrupted MAS results never acquire default metres',()=>{
  for(const value of [undefined,null,'',0,599,2401,1500.5,'bad']){
    const load=loadModel(player({masDist:value})).fieldDoneLoad();
    assert.equal(Object.hasOwn(load,'m'),false,String(value));assert.equal(load.min,5);
  }
  for(const props of [{quit:true},{doneSteps:{}},{steps:[{kind:'work',b:{work_s:200}}]}]){
    const load=loadModel(player({masDist:1500,...props})).fieldDoneLoad();
    assert.equal(Object.hasOwn(load,'m'),false);
  }
});
test('ordinary completed field sessions keep their saved computed load',()=>{
  const f=Object.values(fields).find(f=>f.id!=='mas-test-5-min'&&f.blocks?.some(b=>b.distance_m>0));
  // Seed fields carry their ID in the application, rather than in data.js.
  const pair=Object.entries(fields).find(([id,f])=>id!=='mas-test-5-min'&&f.blocks?.some(b=>b.distance_m>0));
  assert.ok(f&&pair);
  const block=pair[1].blocks.find(b=>b.distance_m>0);
  const load=loadModel({f:{...pair[1],id:pair[0]},steps:[{kind:'work',b:block}],doneSteps:{0:true}}).fieldDoneLoad();
  assert.ok(load.m>0);assert.equal(H.fieldSummary({load}).complete,true);
});
test('historical unknown load remains unknown and never reads the current template',()=>{
  const M=loadModel();
  assert.equal(M.fieldLogLoad({kind:'field',refId:'mas-test-5-min'}),null);
  assert.equal(M.fieldLogLoad({load:null}),null);
  const load={m:1500,min:5,hsr:null};
  assert.equal(M.fieldLogLoad({load}),load);
  assert.deepEqual(load,{m:1500,min:5,hsr:null});
});
test('known paired legacy MAS errors are repaired without mutation and only once',()=>{
  const logs=[legacy(),result()],before=JSON.stringify(logs),M=loadModel();
  const fixed=M.repairKnownMasLoads(logs);
  assert.notEqual(fixed,logs);assert.equal(JSON.stringify(logs),before);
  assert.deepEqual(fixed[0].load,{min:5,dose:'full',source:'mas-test',m:1500,mas:5});
  assert.equal(fixed[0].load2,undefined);assert.equal(fixed[0].load2Status,'needsFieldData');
  assert.equal(fixed[0].fieldLoadStatus,'partial');assert.equal(fixed[1],logs[1]);
  assert.equal(M.repairKnownMasLoads(fixed),fixed);
});
test('repairs preserve user edits, missing evidence, ambiguous pairing and nonlegacy loads',()=>{
  const cases=[
    [legacy({editedAt:2000}),result()], [legacy(),result({editedAt:2000})],
    [legacy(),result({parentSessionId:'other'})], [legacy(),result(),result({historyId:'second'})],
    [legacy(),result({dist:1500,value:4.5})], [legacy(),result({at:1001})],
    [legacy({load:{...legacy().load,m:1400}}),result()], [legacy({load:undefined}),result()],
    [legacy({load:{...legacy().load,source:'manual'}}),result()],
    [legacy({load:{...legacy().load,extra:'unknown'}}),result()]
  ];
  const M=loadModel();for(const logs of cases)assert.equal(M.repairKnownMasLoads(logs),logs);
});
test('LM1 withholds a total when field speed data or actual dose are unknown',()=>{
  const compute=effort();
  const partial=compute({kind:'field',secs:300,load:{m:1500,min:5}});
  assert.equal(partial.incomplete,true);assert.equal(partial.incompleteReason,'field');assert.equal(partial.min,5);
  const zero=compute({kind:'field',secs:300,load:{m:0,hsr:0,spr:0,min:0}});
  assert.notEqual(zero.incomplete,true);assert.equal(zero.B,0);
  const id=Object.keys(window.SEED.exercises)[0];
  const unknown=compute({kind:'protocol',secs:300,items:[{exId:id,sets:3,setsDone:3,done:true,reps:10,repsList:[5,null,3]}]});
  assert.equal(unknown.incomplete,true);assert.equal(unknown.incompleteReason,'dose');
});
function weeks(logs){
  const M=loadModel({},logs),now=Date.now(),day=864e5,start=now-new Date(now).getDay()*day;
  const sourceStart=source.indexOf('function weekLoads(n)'),sourceEnd=source.indexOf('/* ---------- load charts:',sourceStart);
  assert.ok(sourceEnd>sourceStart);
  return new Function('S','weekStart','calDay','isTraining','fieldLogLoad','itemLoad','incompleteRecordedDose',source.slice(sourceStart,sourceEnd)+';return weekLoads(8);')(
    {log:logs},()=>start,(at,n)=>at+n*day,()=>true,M.fieldLogLoad,M.itemLoad,()=>false);
}
test('weekly totals preserve known metres and visibly flag unknown speed or missing distance',()=>{
  const now=Date.now(),W=weeks([{kind:'field',at:now,load:{m:1500,min:5}},{kind:'field',at:now,refId:'mas-test-5-min'}]);
  assert.equal(W[7].m,1500);assert.equal(W[7].hsr,0);assert.equal(W[7].partial,true);assert.equal(W[7].speedUnknown,true);
  const begin=source.indexOf('function weekLoadHtml(compact)'),end=source.indexOf('// the field page:',begin),segments=[];
  const html=new Function('weekLoads','shortDate','calDay','loadFmt','loadHead','weekBars','chartTable',source.slice(begin,end)+';return weekLoadHtml(true);')(
    ()=>W,String,(at,n)=>at+n*864e5,(_,v)=>String(v),()=>'',(_,rows,seg)=>{segments.push(seg);return '';},(headers,rows)=>JSON.stringify({headers,rows}));
  assert.deepEqual(segments,[[{k:'m',cls:'bt1'}]]);
  assert.match(html,/Nije potpuno zabilježeno/);assert.doesNotMatch(html,/Ostali metri<\/span>/);
});
test('rep trends and history never fill explicit missing reps, weight or seconds with scalar plans',()=>{
  const begin=source.indexOf('function repsDone(x)'),end=source.indexOf('// the done screen tells',begin);
  const reps=new Function('HistoryModel',source.slice(begin,end)+';return repsDone;')(H);
  const item={exId:'synthetic',measure:'sets',sets:3,setsDone:3,done:true,reps:10,kg:20,repsList:[5,null,3],kgList:[20]};
  assert.equal(reps(item),null);assert.equal(reps({...item,repsList:undefined}),null);
  const uniform={...item};delete uniform.repsList;assert.equal(reps(uniform),30);
  const html=UI.render({mode:'detail',entry:{kind:'protocol',name:'Synthetic',at:1000,items:[item]}});
  assert.match(html,/<th scope="row">2<\/th><td>Nije zabilježeno<\/td><td>Nije zabilježeno<\/td>/);
  const edit=UI.render({mode:'edit',entry:{kind:'protocol',name:'Synthetic',at:1000,items:[item]}});
  assert.match(edit,/data-history-item="0" data-history-set="1" data-history-field="reps" value=""/);
  const liftStart=source.indexOf('function liftSeries(h, n)'),liftEnd=source.indexOf('// A record pairs',liftStart);
  const series=new Function('HistoryModel','repsDone','heaviestSet',source.slice(liftStart,liftEnd)+';return liftSeries;')(H,reps,()=>20);
  assert.deepEqual(series([item]).pts,[]);
});
test('effort explanations state the fixed model rather than promising personal calibration',()=>{
  const start=source.search(/const auHtml\s*=/),end=source.indexOf('function rpeTap(',start);
  const au=new Function('TrainingLoad','esc','fmtDur',source.slice(start,end)+';return auHtml;')(TrainingLoad,String,seconds=>seconds+' s');
  assert.match(au(0,5),/data-au="0"/);assert.doesNotMatch(au(null,5),/data-au=/);assert.match(au(5,12.483),/data-au="62.415"/);
  assert.doesNotMatch(au(0,5),/uče|kalibr/);assert.match(au(5,12.483),/zasebna od procjene LM1/);
  assert.doesNotMatch(source,/Linija koja raste znači napredak|Ravna linija dulje od 2–3 tjedna znači/);
});
test('five-minute history corrections update the exact paired result and refuse clearing or invalid test measurements',()=>{
  const begin=source.indexOf('function masHistoryChange('),end=source.indexOf('// Repair only the exact legacy',begin);
  const paired=(entry,test)=>entry.kind==='field'&&entry.refId==='mas-test-5-min'&&test.kind==='test'&&test.test==='mas'&&test.parentSessionId===entry.historyId;
  const edit=new Function('pairedMas',source.slice(begin,end)+';return masHistoryChange;')(paired);
  const original={...legacy(),load:{m:1500,min:5,mas:5,source:'mas-test',dose:'full'}};
  const replacement={...original,editedAt:2000,load:{...original.load,m:1600}};
  const before=JSON.stringify(original),changed=edit(original,replacement,[original,result()],'new-id');
  assert.equal(changed.ok,true);assert.equal(changed.entry.load.mas,5.33);assert.equal(changed.test.dist,1600);assert.equal(changed.test.value,5.33);
  assert.equal(changed.test.historyId,'test');assert.equal(changed.test.parentSessionId,'session');assert.equal(JSON.stringify(original),before);
  for(const load of [{min:5},{m:2500,min:5},{m:1599.5,min:5},{m:1600,min:4},{m:1500,min:4}]){
    const denied=edit(original,{...replacement,load},[original,result()],'new-id');assert.equal(denied.ok,false,JSON.stringify(load));
  }
  const unknown={...original,load:{min:5,source:'mas-test',dose:'full'}};
  const added=edit(unknown,replacement,[unknown],'new-id');assert.equal(added.ok,true);assert.equal(added.newTest.dist,1600);assert.equal(added.newTest.historyId,'new-id');
  assert.equal(edit(original,{...original,load:{...original.load,min:4}},[original],'new-id').ok,false);
});
test('missing-data reason survives metadata edits and known field data can be modelled without an exercise profile',()=>{
  const field={kind:'field',name:'Test',at:1000,secs:300,load:{m:1500,min:5},load2Status:'needsFieldData'};
  const edited=H.edit(field,{secs:360});assert.equal(edited.ok,true);assert.equal(edited.entry.load2Status,'needsFieldData');
  const complete=H.edit(field,{load:{hsr:100,spr:10}});assert.equal(complete.ok,true);assert.equal(complete.entry.load2Status,undefined);assert.ok(complete.entry.load2.B>0);
  const item={exId:'synthetic',sets:3,setsDone:3,done:true,reps:10,repsList:[5,null,3]};
  const protocol={kind:'protocol',name:'Dose',at:1000,secs:300,items:[item],load2Status:'needsDose'};
  const partial=H.edit(protocol,{secs:360});assert.equal(partial.entry.load2Status,'needsDose');
  const html=UI.render({mode:'detail',entry:partial.entry});assert.match(html,/nije poznata sva stvarno odrađena izvedba/);assert.doesNotMatch(html,/Nakon izmjene izvedbe/);
});
test('an entirely unknown dose is omitted from charts while known partial rows retain their subtotal',()=>{
  const id=Object.keys(window.SEED.exercises)[0],items=[
    {exId:id,at:1,sets:3,setsDone:3,done:true,reps:10,repsList:[5,null,3],kg:20,kgList:[20,30,40]},
    {exId:id,at:2,sets:3,setsDone:3,done:true,reps:10,repsList:[null,null,null],kg:20}
  ];
  const M=loadModel(),start=source.indexOf('function incompleteRecordedDose('),end=source.indexOf('const thou =',start);
  const model=new Function('HistoryModel','S','calDay','historyOf','runDrill','heaviestSet','itemLoad',source.slice(start,end)+';return exLoadSeries;')(
    H,{ex:window.SEED.exercises},(at,n)=>at+n*864e5,()=>items,()=>false,x=>Math.max(0,...(H.recordedRows(x)||[]).filter(r=>r.reps>0).map(r=>r.kg||0)),M.itemLoad);
  const series=model(id,0);assert.equal(series.partial,true);assert.equal(series.pts.length,1);assert.equal(series.pts[0].v,220);
});
test('88/89/90-second finish, rating update and stored AU use exact elapsed seconds for zero, known and missing ratings',()=>{
  const auBegin=source.search(/const auHtml\s*=/),auEnd=source.indexOf('function rpeTap(',auBegin);
  const au=new Function('TrainingLoad','esc','fmtDur',source.slice(auBegin,auEnd)+';return auHtml;')(TrainingLoad,String,seconds=>seconds+' s');
  const cardBegin=source.indexOf('function lmCardHtml('),cardEnd=source.indexOf('// the exercise page',cardBegin);
  const saveBegin=source.indexOf('function logSession()'),saveEnd=source.indexOf('const newsMsg =',saveBegin);
  const rateBegin=source.indexOf('function rpeSet(t)'),rateEnd=source.indexOf('// the done screen',rateBegin);
  const rpeKnown=v=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=10;
  for(const secs of [88,89,90])for(const rating of [0,5,undefined]){
    const P={historyId:'new-history',secs,srpe:rating,done:true},S={log:[],pr:{}},expected=TrainingLoad.sessionAU({srpe:rating,secs});
    const model={v:'LM1',min:Math.round(secs/6)/10,B:12,band:3.6,Bsets:10.5,Bfield:0,HS:{},CE:0,m:0};P._lm=model;
    const card=new Function('P','LM','auHtml','lmR','lmPts','loadFmt','lmHs','thou','esc','plural',source.slice(cardBegin,cardEnd)+';return lmCardHtml;')(
      P,{TREG:{}},au,Math.round,String,String,String,String,String,()=> 'bodova');
    if(expected===null)assert.doesNotMatch(card(model),/data-au=/);else assert.ok(card(model).includes('data-au="'+expected+'"'));
    const area={innerHTML:''},document={getElementById:id=>id==='lmau'?area:null},input={value:'5',classList:{toggle(){}},style:{setProperty(){}},setAttribute(){}};
    const rate=new Function('P','savePlayerChoice','document','rpeKnown','rpePct','rpeTxt','auHtml',source.slice(rateBegin,rateEnd)+';return rpeSet;')(P,(_,fn)=>fn(),document,rpeKnown,String,String,au);
    if(rating!==undefined){input.value=String(rating);rate(input);assert.ok(area.innerHTML.includes('data-au="'+expected+'"'));}
    const save=new Function('S','P','sessionEntry','computeSession','HistoryModel','applyProgress','masFromPlay','trimLog','persist','clearPlay',source.slice(saveBegin,saveEnd)+';return logSession;')(
      S,P,()=>({kind:'protocol',refId:'p',at:1000,secs}),()=>({...model}),H,()=>[],()=>null,()=>'',()=>true,()=>{});
    assert.equal(save().saved,true);assert.equal(S.log[0].load2.au,expected===null?undefined:expected);assert.equal(H.sessionAU(S.log[0]),expected);
  }
});
test('accessible chart tables retain every supplied column including unknown speed evidence',()=>{
  const start=source.indexOf('function chartTable('),end=source.indexOf('// pts:',start);
  const table=new Function('esc',source.slice(start,end)+';return chartTable;')(value=>String(value).replace(/</g,'&lt;'));
  const html=table(['Tjedan','Metri','Poznato brzo trčanje'],[['Ovaj tjedan','1500 m','Nije potpuno zabilježeno']]);
  assert.equal((html.match(/scope="col"/g)||[]).length,3);assert.equal((html.match(/<td>/g)||[]).length,3);
  assert.match(html,/<td>Nije potpuno zabilježeno<\/td>/);assert.match(html,/<thead>/);assert.match(table(['A','B'],[['x','<unsafe>']]),/&lt;unsafe>/);
});
