'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const Cinema=require('../cinema-model.js'),Dose=require('../player-dose.js');
const ex={id:'bench',name:'Potisak'},item={exId:'bench',sets:3,reps:8,kg:20,measure:'sets',sides:false};
const manual=set=>({kind:'manual',g:0,set,it:item,e:ex});
const base=()=>({mode:'ex',i:1,paused:false,left:0,endAt:0,items:[item],steps:[manual(1),manual(2),manual(3)],doneSteps:{0:1,2:1},rir:{0:0,2:2}});
test('authored parts preserve sparse title inheritance and custom names without changing items',()=>{
 const list=[{exId:'a'},{exId:'b',section:'  Priprema  '},{exId:'c'},
  {exId:'b',section:'Snaga A'},{exId:'c',section:'  '},{exId:'d',section:'Moj blok <B>'},{exId:'e'}];
 const before=JSON.stringify(list);
 assert.deepEqual(Cinema.sections(list),['Glavni dio','Priprema','Priprema','Snaga A','Snaga A','Moj blok <B>','Moj blok <B>']);
 assert.equal(JSON.stringify(list),before);
 assert.deepEqual(Cinema.sections([]),[]);
});
test('the same exercise can appear in preparation and strength regardless of its library category',()=>{
 const exercises={copenhagen:{cat:'Rehab'},deadbug:{cat:'Trup'}};
 const list=[{exId:'deadbug',section:'Priprema'},{exId:'copenhagen'},
  {exId:'copenhagen',section:'Snaga'},{exId:'deadbug'}];
 assert.deepEqual(Cinema.sections(list,exercises),['Priprema','Priprema','Snaga','Snaga']);
});
test('unassigned parts stay generic rather than being inferred from categories or warmup flags',()=>{
 const categories=['Mobilnost','Aktivacija','Zagrijavanje','Rehab','Trup','Snaga','Kondicija','Eksplozivnost','Vlastita kategorija'];
 const exercises=Object.fromEntries(categories.map((cat,index)=>[String(index),{cat}]));
 const list=categories.map((cat,index)=>({exId:String(index),warmup:index===0}));
 assert.deepEqual(Cinema.sections(list,exercises),categories.map(()=>'Glavni dio'));
 assert.equal(list[0].section,undefined);
});
test('extra preparation preserves past and later evidence across checkpoint restore',()=>{
 const p=base(),changed=Cinema.prepare(p,30,10000);
 assert.equal(changed.steps[1].kind,'prep');assert.equal(changed.steps[2].set,2);
 assert.deepEqual(changed.doneSteps,{0:1,3:1});assert.deepEqual(changed.rir,{0:0,3:2});
 assert.deepEqual(p.doneSteps,{0:1,2:1});assert.equal(p.steps.length,3);
 const restored=Dose.restoreSteps(Dose.packSteps(changed.steps),p.items,()=>ex);
 assert.ok(restored);assert.equal(restored[1].dur,30);assert.equal(restored[2].it.kg,20);
 assert.equal(Dose.completeSets({...changed,steps:restored},0),2);
});
test('rest adjustments change remaining time without changing work or dose',()=>{
 const p={...base(),i:1,endAt:10000,left:6,steps:[manual(1),{kind:'rest',g:0,dur:10},manual(2)]};
 const next=Cinema.rest(p,15,4000);assert.equal(next.left,21);assert.equal(next.steps[1].dur,25);assert.equal(next.endAt,25000);
 assert.deepEqual(next.doneSteps,p.doneSteps);assert.deepEqual(next.items,p.items);
 const zero=Cinema.rest({...p,paused:true},-15,4000);assert.equal(zero.left,0);
 const saved=Dose.restoreSteps(Dose.packSteps(next.steps),p.items,()=>ex);assert.equal(saved[1].dur,25);
});
test('preparation never interrupts or fabricates a timed work set',()=>{
 const p={...base(),steps:[manual(1),{kind:'work',g:0,set:2,dur:30,it:item,e:ex}]};
 assert.equal(Cinema.prepare(p,10,100),null);assert.equal(Cinema.rest(p,15,100),null);
 assert.equal(Cinema.prepare(base(),-1,100),null);assert.equal(Cinema.prepare(base(),3601,100),null);
});
test('journal totals use completed work evidence, including both sides, rather than visited steps',()=>{
 const p=base();assert.deepEqual(Cinema.summary(p,Dose),{total:3,complete:2,reps:16,seconds:0,volume:320,percent:67});
 const hold={exId:'hold',sets:1,measure:'time',sec:20,sides:true,reps:1,kg:0};
 const h={mode:'ex',i:1,items:[hold],steps:[{kind:'work',g:0,set:1,side:'Lijeva strana',it:hold},{kind:'work',g:0,set:1,side:'Desna strana',it:hold}],doneSteps:{0:1}};
 assert.deepEqual(Cinema.summary(h,Dose),{total:1,complete:0,reps:0,seconds:20,volume:0,percent:0});
});
test('upcoming follows superset phases, using the next exercise through setup and the planned duration for rest',()=>{
 const left={kind:'manual',g:0,set:1,side:'Lijeva strana'};
 const sideChange={kind:'switch',g:0,set:1,side:'Promjena strane',dur:10};
 const right={...left,side:'Desna strana'};
 const next={kind:'work',g:1,set:1,dur:20};
 const rest={kind:'rest',g:1,set:1,dur:60};
 const nextRound={...left,set:2};
 const steps=[left,sideChange,right,{kind:'ready'},{kind:'switch',dur:10,go:true},next,rest,nextRound];
 assert.deepEqual(steps.map((_,i)=>Cinema.upcoming({steps,i})),[sideChange,right,next,next,next,rest,nextRound,null]);
});
test('zero-length transitions are skipped and the actual first rest takes priority over a later exercise',()=>{
 const next=manual(2);
 const rest={kind:'rest',dur:90,trans:true};
 const steps=[manual(1),{kind:'rest',dur:0},rest,next];
 assert.equal(Cinema.upcoming({steps,i:0}),rest);
 assert.equal(Cinema.upcoming({steps,i:2}),next);
 assert.equal(Cinema.upcoming({steps:[steps[0],steps[1],next],i:0}),next);
});
