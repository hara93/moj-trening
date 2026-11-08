'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const Today=require('../today-model.js');
const source=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
function section(start,end){const a=source.indexOf(start),b=source.indexOf(end,a);assert.ok(a>=0&&b>a,start);return source.slice(a,b);}
// The calendar warning, run against the same rule TodayModel uses.
function note({next=-1,prev=-1,matches=[],heavy=false,gym=heavy,day=3}){
  const ctx={TodayModel:Today,S:{pr:{p:{id:'p'}},field:{}},matchGap:()=>({next,prev}),weekMatches:()=>matches,
    weekStart:()=>0,heavyLegs:()=>heavy,gymLike:()=>gym};
  vm.createContext(ctx);vm.runInContext(section('function matchNote(','// a warning box on the home screen')+';globalThis.matchNote=matchNote;',ctx);
  return ctx.matchNote({kind:'protocol',id:'p'},day,0);
}
test('one gym match rule: match day, the days around it, two matches and heavy legs up to 3 days before',()=>{
  const rule=Today.matchRule;
  assert.equal(rule({gap:0}),'matchDay');
  assert.equal(rule({gap:1}),'dayBefore');
  assert.equal(rule({since:1}),'dayAfter');
  assert.equal(rule({gap:1,easy:true}),'','mobility or activation fits the day before');
  assert.equal(rule({since:1,easy:true}),'');
  assert.equal(rule({gap:2,heavy:true}),'twoDays');
  assert.equal(rule({gap:3,heavy:true}),'threeDays');
  assert.equal(rule({gap:4,heavy:true}),'','heavy legs 4 days before is the planned slot');
  assert.equal(rule({gap:2}),'','upper body 2 days before is allowed');
  assert.equal(rule({gap:5,since:2,between:true,heavy:true}),'between');
  assert.equal(rule({}),'');
});
test('the day after a match the calendar warns about heavy legs, as TodayModel blocks it',()=>{
  assert.match(note({prev:1,heavy:true}),/^Jučer je bila utakmica: danas bez teških nogu/);
  assert.match(note({prev:1,heavy:false,gym:true}),/^Jučer je bila utakmica/);
  assert.equal(note({prev:1,heavy:false,gym:false}),'','a mobility session the day after a match fits');
  assert.equal(note({prev:2,next:5,heavy:true}),'');
  assert.match(note({next:1,heavy:true}),/^Sutra je utakmica/);
  assert.match(note({next:3,heavy:true}),/^Utakmica je za 3 dana/);
  assert.match(note({next:4,prev:2,matches:[1,7],heavy:true}),/^Između dviju utakmica/);
});
test('TodayModel and the calendar share the rule instead of keeping copies',()=>{
  const body=section('function matchNote(','// a warning box on the home screen');
  assert.match(body,/TodayModel\.matchRule\(/);
  assert.doesNotMatch(body,/d === 2 && heavy|g\.next === 3/);
  const model=fs.readFileSync(path.join(__dirname,'../today-model.js'),'utf8');
  assert.match(model.slice(model.indexOf('function matchBlocks')),/matchRule\(\{/);
  const date='2026-11-05',now=new Date(date+'T12:00:00').getTime();
  const legs={exId:'squat',measure:'sets',sets:3,reps:5,kg:60,sides:false,rest:120};
  const result=Today.suggest({now,settings:{matchDates:{'2026-11-04':1}},checkin:{date,energy:4,legs:1,pain:0},
    exercises:{squat:{cat:'Snaga',equip:['Šipka'],muscles:{prime:['front_quadriceps']}}},equipment:['Šipka'],
    planned:[{id:'legs',kind:'protocol',name:'Noge',date,items:[legs]}]});
  assert.notEqual(result.action.id,'legs','heavy legs are not offered the day after a match');
});
