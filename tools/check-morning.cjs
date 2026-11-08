'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const calendar=require('../month-plan.js');
const view=require('../today-view.js');
const source=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
function between(a,b) {
  const from=source.indexOf(a), to=source.indexOf(b,from+a.length);
  assert.ok(from>=0 && to>from);
  return source.slice(from,to);
}
const date='2026-11-04';
const form=fields=>({elements:{namedItem(key){return {value:fields[key] ?? ''};}}});
test('backup accepts only real dates and known measurements, preserving explicit zero and partial answers',()=>{
  const values={'2024-02-29':{pain:0,energy:'5'},[date]:{energy:5,legs:null,pain:false,notes:'unused'},
    '2025-02-29':{pain:0},'2026-11-03':{date,legs:4},'2026-11-01':{legs:0,pain:11}};
  assert.deepEqual(view.cleanChecks(values),{'2024-02-29':{date:'2024-02-29',pain:0},[date]:{date,energy:5}});
  assert.deepEqual(view.cleanChecks([]),{});
  assert.ok(view.readForm(form({}),date).error);
  assert.ok(view.readForm(form({legs:'6'}),date).error);
  assert.deepEqual(view.readForm(form({legs:'3',pain:'0'}),date),{entry:{date,legs:3,pain:0}});
  assert.doesNotMatch(view.description({date,legs:3}),/Bez boli/);
});
const save=new Function('top','MonthPlan','localStorage','cleanSettings','SETTINGS_BASE','S','mtCanon','morningError','back','toast','entry',
  between('function writeMorning(', 'let dailyTimer=')+'\nreturn writeMorning(entry);');
test('morning writes merge unrelated data, preserve drafts on refusal, and reject a stale edit or delete',()=>{
  const previous={date:'2026-11-03',pain:0}, first={date,energy:2}, changed={date,legs:5};
  let disk={sound:false,morningChecks:{[previous.date]:previous}}, fail=false, original=null, backs=0;
  const state={settings:{}}, errors=[];
  const store={getItem(){return JSON.stringify(disk);},setItem(k,v){if(fail)throw Error();disk=JSON.parse(v);}};
  const write=entry=>save(()=>({v:'morning',date,original}),calendar,store,v=>v,{},state,JSON.stringify,m=>errors.push(m),()=>backs++,()=>{},entry);
  assert.equal(write(first),true);
  assert.deepEqual(disk,{sound:false,morningChecks:{[previous.date]:previous,[date]:first}});
  original=first;fail=true;
  assert.equal(write(changed),false);
  assert.equal(backs,1);
  assert.deepEqual(state.settings.morningChecks[date],first);
  fail=false;disk.morningChecks[date]=changed;
  assert.equal(write(null),false);
  assert.match(errors.at(-1),/drugoj kartici/);
  original=changed;
  assert.equal(write(null),true);
  assert.deepEqual(disk.morningChecks,{[previous.date]:previous});
});
test('display uses player doses for varied per-set times and weights and safely escapes library names',()=>{
  const item={exId:'x',measure:'time',sets:2,secList:[15,20],kgList:[2.5,5],rest:30,sides:true};
  const vm={date,checks:{},exercises:{x:{name:'Vježba <A>',measure:'sets'}},team:[],recommendation:{
    title:'Danas',summary:'',kind:'reduce',action:{type:'protocol',id:'p'},items:[item],
    observed:[{exId:'x',measure:'time',rows:[{set:1,sec:15,sides:1}]}],reasons:[],evidence:[]}};
  const html=view.view(vm);
  assert.match(html,/2 × 15\/20 s · 2,5\/5 kg · po strani · odmor 30 s/);
  assert.match(html,/Vježba &lt;A&gt;/);
  assert.match(html,/1\. serija · 15 s · 1\/2 strane/);
});
const adapter=new Function('S','dateKey','weekStart','fieldLoad','heavyLegs','weekStatus','calDay','TodayModel','matchDay','matchDates','nextScheduledMatch','now','week',
  between('function dailyInput(', 'VIEWS.today =')+'\nreturn dailyInput(now,week);');
test('Sunday adapter includes Monday plan and flags today’s moved or cancelled occurrence',()=>{
  const day='2026-11-08', monday='2026-11-09', at=calendar.time(day);
  const p={id:'p',items:[{exId:'x',sets:1}]};
  const S={pr:{p},ex:{x:{}},field:{},log:[],settings:{planDates:{[day]:[{kind:'protocol',id:'p',to:monday}]}}};
  const weekStart=stamp=>calendar.time(calendar.monday(calendar.key(stamp)));
  let input;
  adapter(S,calendar.key,weekStart,()=>({}),()=>false,stamp=>{
    assert.equal(calendar.key(stamp),monday);return {slots:[{id:'p',kind:'protocol',day:0}]};
  },(stamp,n)=>calendar.time(calendar.shift(calendar.key(stamp),n)),
  {suggest(vm){input=vm;return {};}},()=>-1,()=>({}),()=>null,at,{slots:[]});
  assert.deepEqual(input.planned.map(({id,date,skip})=>({id,date,skip})),[
    {id:'p',date:monday,skip:false},{id:'p',date:day,skip:true}]);
});
test('pain location and new pain are one tap each, kept only with a pain value',()=>{
  const chips=(fields,area,fresh)=>({elements:{namedItem(key){
    if(key==='painArea')return {value:area||''};if(key==='newPain')return {checked:!!fresh};return {value:fields[key] ?? ''};}}});
  assert.deepEqual(view.readForm(chips({pain:'4'},'hip'),date),{entry:{date,pain:4,painArea:'hip'}});
  assert.deepEqual(view.readForm(chips({pain:'0'},'hip'),date),{entry:{date,pain:0}},'no area without pain');
  assert.deepEqual(view.readForm(chips({pain:'7'},'knee',true),date),{entry:{date,pain:7,painArea:'knee',newPain:true}});
  assert.ok(view.readForm(chips({energy:'3'},'',true),date).error,'new pain needs a pain value');
  assert.deepEqual(view.cleanChecks({[date]:{date,pain:3,painArea:'hamstring',newPain:true},'2026-11-03':{pain:0,painArea:'hip'},'2026-11-02':{pain:2,painArea:'leđa'}}),
    {[date]:{date,pain:3,painArea:'hamstring',newPain:true},'2026-11-03':{date:'2026-11-03',pain:0},'2026-11-02':{date:'2026-11-02',pain:2}});
  assert.equal(view.description({date,pain:4,painArea:'hip',newPain:true}),'Bol 4/10 kuk/prepone (nova)');
  const html=view.formView({date,original:{date,pain:3,painArea:'knee'}});
  assert.match(html,/<legend>Gdje boli\?<\/legend>/);
  assert.deepEqual([...html.matchAll(/name="painArea" value="([a-z]+)"/g)].map(m=>m[1]),['hip','hamstring','knee','other']);
  assert.match(html,/value="knee" checked/);
  assert.doesNotMatch(html,/trener/i);
});
