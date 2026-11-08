'use strict';
// Progression reads the tapped reserve (RIR): "ok" needs the last two work sets at target − 0.5, RIR 0 on two sets keeps
// the weight, and the next kg comes from the RIR-adjusted e1RM (MODEL 1.9). Pain 1-5 holds the painful area.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
function section(start,end){const a=source.indexOf(start),b=source.indexOf(end,a);assert.ok(a>=0&&b>a,start);return source.slice(a,b);}
function harness(rir={},items=[]){
  const ctx={HistoryModel:require('../history-model.js'),HistoryStore:require('../history-store.js'),TodayModel:require('../today-model.js'),P:{items,rir,steps:[],doneSteps:{},startedAt:new Date('2026-11-04T18:00:00').getTime()},
    S:{settings:{morningChecks:{}},ex:{},log:[]},Date,
    progKind:()=> 'bar',loadKind:()=> 'bar',nextLoad:(e,kg)=>kg+10,fmtKg:v=>String(v).replace('.',',')+' kg',plural:(n,a,b,c)=>n===1?a:n<5?b:c,
    ponTxt:n=>n+' ponavljanja',needsKg:()=>false,exEquip:()=>[],dateKey:t=>{const d=new Date(t);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}};
  vm.createContext(ctx);
  vm.runInContext(section('const e1rm =','\n')+'\n'+section('function nextDose(e, it, recorded){','// Exercises asked about')+
    section('const answerOf =','// counts sessions')+section('function reserveAnswer(j){','// this session\'s recorded item')+
    section('function painHoldsAt(j){','// Napredak opens on a useful chart')+
    ';globalThis.api={nextDose,answerOf,reserveAnswer,rirE1,painHoldsAt};',ctx);
  return ctx;
}
const lift=(extra={})=>({exId:'deadlift',measure:'sets',sets:4,reps:5,kg:100,targetRir:2,r0:5,r1:8,...extra});
const logged=(rirList,extra={})=>({exId:'deadlift',measure:'sets',sets:4,setsDone:4,reps:5,kg:100,done:true,repsList:[5,5,5,5],kgList:[100,100,100,100],rirList,...extra});
// rirLists reads P.rir by done set; the harness supplies the per-set list directly
function answers(list,item=lift()){const h=harness();h.rirLists=()=>list;h.P.items=[item];return h.api.answerOf(0);}

test('a session counts ok only when the last two work sets keep RIR ≥ target − 0.5',()=>{
  assert.equal(answers([3,2,2,2]),'ok');
  assert.equal(answers([2,2,2,1.5]),'ok','1.5 is within half a rep of the target 2');
  assert.equal(answers([3,3,1,1]),'hard');
  assert.equal(answers([2,2,null,1]),'hard','one tapped set of the last two is enough');
  assert.equal(answers([null,null,null,null]),'ok','no taps: the old rule');
  assert.equal(answers([]),'ok');
  assert.equal(answers([1,1,1,1],lift({targetRir:1})),'ok','the item target decides');
  assert.equal(answers([10,5,5,5],{exId:'plank',measure:'time',sets:4,sec:30,targetSir:10}),'hard','holds: seconds, within 3 s');
  assert.equal(answers([10,10,8,7],{exId:'plank',measure:'time',sets:4,sec:30,targetSir:10}),'ok');
});

test('RIR 0 on two or more sets keeps the weight and resets the streak without counting a failure',()=>{
  assert.equal(answers([1,1,0,0]),'hold');
  assert.equal(answers([0,2,0,3]),'hold');
  const doneMsg=section('function doneMsg(c){','\n}');
  assert.match(doneMsg,/a === 'hold'[^\n]*Dvije serije bez rezerve \(RIR 0\): ostaje/);
  const apply=section('function applyProgress(){','\n}');
  assert.match(apply,/else if \(a === 'hold'\) \{ it\.ok = 0; it\.snoozeOk = 0; \}/,'a hidden proposal cannot stay hidden after the streak restarts');
  assert.doesNotMatch(apply,/'hold'\)[^\n]*fail/,'not a failure');
});

test('the report case: 4×5 @ 100 kg with RIR 1,1,0,0 no longer proposes 100 → 110 kg',()=>{
  const h=harness(),case_=logged([1,1,0,0]);
  assert.equal(Math.round(h.api.rirE1(case_)*10)/10,118.3,'median of 120, 120, 116.7, 116.7');
  const legacy=h.api.nextDose({cat:'Snaga',zones:['Stražnja loža']},lift(),null);
  assert.match(legacy.text,/^100 kg → 110 kg/,'without taps the old estimate still steps up');
  const withRir=h.api.nextDose({cat:'Snaga',zones:['Stražnja loža']},lift(),()=>case_);
  assert.equal(withRir.item.kg,100,'keeps 100 kg');
  assert.match(withRir.text,/^5 → 6 ponavljanja/);
});

test('the next kg comes from the RIR-adjusted e1RM: 9 reps at RIR 2 reach 110 kg for 5',()=>{
  const h=harness(),strong=logged([2,2,2,2],{reps:9,repsList:[9,9,9,9]});
  const next=h.api.nextDose({cat:'Snaga'},lift({reps:9}),strong);
  assert.equal(next.item.kg,110);
  assert.equal(next.item.reps,5);
  const nearly=logged([2,2,2,2],{reps:8,repsList:[8,8,8,8]});
  assert.equal(h.api.nextDose({cat:'Snaga'},lift({reps:8}),nearly).item.kg,100,'8 reps at RIR 2 is not yet enough for +10 kg');
  assert.equal(h.api.rirE1(logged([null,null,null,null])),null,'no taps, no RIR estimate');
  assert.ok(Math.abs(h.api.rirE1(logged([7,7,7,7]))-100*(1+9/30))<1e-9,'"6+" counts as RIR 4, not as reps to failure');
  const at=list=>h.api.rirE1(logged(list));
  assert.ok(at([4.5,4.5,4.5,4.5])>=at([3,3,3,3])&&at([7,7,7,7])>=at([3,3,3,3]),'more reserve never scores lower');
  assert.ok(Math.abs(h.api.rirE1(logged([3,3,3,3],{reps:10,repsList:[10,10,10,10]}))-100*(1+12/30))<1e-9,'reps + RIR capped at 12');

});

test('morning pain 1-5 holds the painful area at the end of the session; proposals still wait for acceptance',()=>{
  const h=harness();h.S.ex={squat:{cat:'Snaga',muscles:{prime:['front_quadriceps']},zones:['Kvadriceps']},press:{cat:'Snaga',muscles:{prime:['front_chest']}}};
  h.P.items=[{exId:'squat'},{exId:'press'}];h.S.settings.morningChecks={'2026-11-04':{date:'2026-11-04',pain:2,painArea:'knee'}};
  assert.equal(h.api.painHoldsAt(0),true);assert.equal(h.api.painHoldsAt(1),false);
  h.S.settings.morningChecks['2026-11-04'].pain=0;assert.equal(h.api.painHoldsAt(0),false);
  assert.match(source,/sugUp: async d => \{[^\n]*nextDose\(e, it, \(\) => lastRecorded\(it\.exId\)\)/,'Prihvati applies the same proposal');
  assert.match(section('function progSuggestions(){','\n}'),/kind: nd\.item \? 'up' : 'variant'/,'a proposal is a card, not an automatic change');
});
