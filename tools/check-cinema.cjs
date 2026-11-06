'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const Cinema=require('../cinema-model.js'),Dose=require('../player-dose.js');
const ex={id:'bench',name:'Potisak'},item={exId:'bench',sets:3,reps:8,kg:20,measure:'sets',sides:false};
const manual=set=>({kind:'manual',g:0,set,it:item,e:ex});
const base=()=>({mode:'ex',i:1,paused:false,left:0,endAt:0,items:[item],steps:[manual(1),manual(2),manual(3)],doneSteps:{0:1,2:1},rir:{0:0,2:2}});
test('section labels preserve authored order, inherit titles and infer missing preparation/strength/conditioning',()=>{
 const list=[{exId:'a'},{exId:'b'},{exId:'c'},{exId:'b',section:'Snaga A'},{exId:'c'}],ex={a:{cat:'Mobilnost'},b:{cat:'Snaga'},c:{cat:'Kondicija'}};
 assert.deepEqual(Cinema.sections(list,ex),['Priprema','Snaga','Kondicija','Snaga A','Snaga A']);
 assert.equal(list[0].section,undefined);assert.equal(list.length,5);
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
