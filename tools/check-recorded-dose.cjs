'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const H = require('../history-model.js');
const M = require('../muscle-work.js');
const UI = require('../history.js');
const exercise = { id:'press',name:'Potisak',cat:'Snaga',muscles:{prime:['front_chest'],sec:['back_triceps']} };
const session = item => ({ kind:'protocol',name:'Trening',at:10,items:[item],muscleWork:[M.pack(M.completedItem(exercise,item))] });

test('set rows preserve actual weights, repetitions, zero, missing values and skipped ordinal positions',()=>{
  const item={exId:'press',measure:'sets',sets:4,setsDone:2,done:true,reps:10,kg:10,repsList:[5,3],kgList:[20,30],setNumbers:[1,3]};
  const rows=H.recordedRows(item);
  assert.deepEqual(rows.map(r=>[r.number,r.kg,r.reps]),[[1,20,5],[3,30,3]]);
  assert.equal(rows.reduce((sum,r)=>sum+r.kg*r.reps*r.sides,0),190);
  assert.equal(H.repetitionTotal(item),8);
  const entry=session(item);
  const result=H.edit(entry,{items:[{index:0,kgList:[0,null]}]});
  assert.equal(result.ok,true);
  assert.deepEqual(H.recordedRows(result.entry.items[0]).map(r=>r.kg),[0,null]);
  assert.deepEqual(entry.items[0].kgList,[20,30]);
  assert.deepEqual(M.sanitize(result.entry.muscleWork[0]).credits.direct.chest,2);
});
test('bilateral work counts full pairs in the same set, while retaining seconds from each completed side',()=>{
  const item={exId:'press',measure:'time',sides:true,sets:3,setsDone:2,done:true,sec:10,secList:[10,25],sideCounts:[1,1],setNumbers:[1,3]};
  assert.equal(H.performedSets(item),0);assert.equal(H.timeTotal(item),35);
  assert.equal(M.completedItem(exercise,item).completedSets,0);
  const mixed={...item,sideCounts:[2,1]};
  assert.equal(H.performedSets(mixed),1);assert.equal(H.timeTotal(mixed),45);
  const original=session(mixed);
  assert.equal(M.sanitize(original.muscleWork[0]).completedSets,1);
  const corrected=H.edit(original,{items:[{index:0,setsDone:2}]});
  assert.equal(corrected.ok,true);
  assert.equal(M.sanitize(corrected.entry.muscleWork[0]).completedSets,2);
  assert.equal(H.timeTotal(corrected.entry.items[0]),70);
  assert.equal(H.timeTotal({...item,secList:[null,25]}),null);
});
test('history renders and edits the load on the correct actual set rather than its original default',()=>{
  const item={exId:'press',measure:'sets',sets:3,setsDone:2,done:true,repsList:[5,3],kg:10,kgList:[20,30],setNumbers:[1,3]};
  const entry=session(item),html=UI.render({mode:'detail',entry});
  assert.match(html,/<th scope="row">3<\/th><td>3<\/td><td>30<\/td>/);
  const field={value:'27,5',dataset:{historyItem:'0',historySet:'1',historyField:'kg'},getAttribute:()=> '30'};
  const edit=UI.readEdit({querySelectorAll:()=>[field]},entry);
  assert.deepEqual(edit,{ok:true,patch:{items:[{index:0,kgList:[20,27.5]}]}});
  assert.deepEqual(H.edit(entry,edit.patch).entry.items[0].repsList,[5,3]);
});
test('older uniform doses, optional reserve and single-exercise records keep their original meaning',()=>{
  const old={measure:'time',sides:true,sec:10,sets:2,done:true};
  assert.equal(H.timeTotal(old),40);
  const unknown={...old,historySetsUnknown:true};assert.equal(H.timeTotal(unknown),null);
  assert.equal(H.performedSets({measure:'sets',sets:2,setsDone:2,done:false,lastReps:0}),1);
});
