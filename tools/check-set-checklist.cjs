'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const D = require('../player-dose.js');

const bench={exId:'bench',measure:'sets',sets:3,reps:8,kg:20,repsList:[8,6,4],kgList:[20,25,30]};
const plank={exId:'plank',measure:'time',sets:2,sec:15,secList:[15,20],sides:true};
function state(){
  const steps=[{kind:'prep',g:0}, {kind:'manual',g:0,set:1,it:bench},
    {kind:'work',g:1,set:1,it:plank,side:'Lijeva strana'}, {kind:'switch',g:1,set:1},
    {kind:'work',g:1,set:1,it:plank,side:'Desna strana'}, {kind:'manual',g:0,set:2,it:bench},
    {kind:'work',g:1,set:2,it:plank,side:'Lijeva strana'}, {kind:'work',g:1,set:2,it:plank,side:'Desna strana'},
    {kind:'manual',g:0,set:3,it:bench}];
  return {i:1,steps,doneSteps:{},rir:{},items:[bench,plank]};
}
test('pre-start list has one immutable planned row per set with its own prescription',()=>{
  const before=JSON.stringify(bench), rows=D.checklist(bench);
  assert.deepEqual(rows.map(r=>[r.set,r.dose.reps,r.dose.kg,r.state,r.step]),[[1,8,20,'planned',null],[2,6,25,'planned',null],[3,4,30,'planned',null]]);
  assert.equal(JSON.stringify(bench),before);
});
test('only the current manual step can be confirmed and reserve 0 remains visible',()=>{
  const p=state();assert.equal(D.checklist(bench,p,0)[0].step,1);
  p.paused=true;assert.equal(D.checklist(bench,p,0)[0].step,null);
  p.paused=false;p.i=5;p.doneSteps[1]=1;p.rir[1]=0;
  assert.deepEqual(D.checklist(bench,p,0).map(r=>[r.state,r.step,r.reserve]),[['done',null,0],['active',5,null],['waiting',null,null]]);
  p.i=8;assert.deepEqual(D.checklist(bench,p,0).map(r=>r.state),['done','skipped','active']);
});
test('two different left holds remain two partial rows, and a right-side reserve stays with its ordinal',()=>{
  const p=state();p.doneSteps={2:1,6:1};p.i=7;
  let rows=D.checklist(plank,p,1);assert.deepEqual(rows.map(r=>[r.left,r.right,r.state,r.step]),[[true,false,'partial',null],[true,false,'partial',7]]);
  assert.equal(rows[1].current,true);
  p.doneSteps[7]=1;p.rir[7]=5;p.i=8;
  rows=D.checklist(plank,p,1);assert.deepEqual(rows.map(r=>[r.dose.sec,r.state,r.reserve]),[[15,'partial',null],[20,'done',5]]);
  assert.equal(D.completeSets(p,1),rows.filter(r=>r.state==='done').length);
});
test('one manual confirmation credits both sides and stale or revisited completed rows cannot be checked again',()=>{
  const it={...bench,sides:true};const p=state();p.items[0]=it;p.steps[1].it=it;p.doneSteps[1]=1;
  const r=D.checklist(it,p,0)[0];assert.deepEqual([r.left,r.right,r.state,r.step],[true,true,'done',null]);
});
test('confirmed holds keep the actual seconds per side and history totals the recorded time',()=>{
  const p=state();p.i=5;p.doneSteps={2:1,4:1};
  p.steps[2]={...p.steps[2],dur:15,actualSec:4};p.steps[4]={...p.steps[4],dur:20};
  const restored=D.restoreSteps(D.packSteps(p.steps),p.items,id=>({id}));
  p.steps=restored;
  const [row]=D.checklist(plank,p,1);
  assert.deepEqual([row.state,row.leftSec,row.rightSec,row.dose.sec],['done',4,20,12]);
  const {fields}=D.logDose(p,1,'partial');
  assert.deepEqual(fields.secList,[12]);assert.deepEqual(fields.sideCounts,[2]);
  const History=require('../history-model.js');
  assert.equal(History.timeTotal({...plank,...fields}),24);
});
