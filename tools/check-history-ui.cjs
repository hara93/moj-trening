'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const M=require('../muscle-work.js');
const Model=require('../history-model.js');
global.MuscleWork=M;global.HistoryModel=Model;
const UI=require('../history.js');
const field=(value,initial,dataset)=>({value,defaultValue:initial,dataset,getAttribute:key=>key==='data-history-initial'?initial:null});
const form=inputs=>({querySelectorAll:()=>inputs});
const entry=()=>({historyId:'saved-1',kind:'protocol',name:'Potisak',at:new Date('2026-11-04T12:03:04.129+01:00').getTime(),secs:173.125,srpe:6,items:[{exId:'press',measure:'sets',sets:3,done:true,reps:8,kg:25,rirList:[1.234567891,null,2]}]});

test('untouched displayed fields preserve exact timestamps, seconds, reserve precision and absent fields',()=>{
  const e=entry(),before=JSON.stringify(e);
  const result=UI.readEdit(form([
    field('2,885417','2,885417',{historyMeta:'secs'}),
    field('2026-11-04T12:03:04.129','2026-11-04T12:03:04.129',{historyMeta:'at'}),
    field('1,234567891','1,234567891',{historyItem:'0',historySet:'0',historyField:'rir'}),
    field('','',{historyItem:'0',historySet:'1',historyField:'rir'})
  ]),e);
  assert.deepEqual(result,{ok:true,patch:{}});assert.equal(JSON.stringify(e),before);
});

test('metadata conversion matches model bounds without changing other fields',()=>{
  const e=entry();
  assert.deepEqual(UI.readEdit(form([field('2,5','2,885417',{historyMeta:'secs'})]),e),{ok:true,patch:{secs:150}});
  assert.deepEqual(UI.readEdit(form([field('0,001','2,885417',{historyMeta:'secs'})]),e),{ok:true,patch:{secs:0}});
  assert.equal(UI.readEdit(form([field('1,5','6',{historyMeta:'srpe'})]),e).ok,false);
  assert.equal(UI.readEdit(form([field('x'.repeat(201),'Potisak',{historyMeta:'name'})]),e).ok,false);
  assert.equal(UI.readEdit(form([field('2881','2,885417',{historyMeta:'secs'})]),e).ok,false);
  assert.deepEqual(UI.readEdit(form([field('','6',{historyMeta:'srpe'})]),e),{ok:true,patch:{srpe:null}});
  assert.equal(UI.readEdit(form([field('2026-02-31T12:00','2026-11-04T12:03:04.129',{historyMeta:'at'})]),e).ok,false);
});

test('editing only the second uniform set seeds earlier and later recorded reps',()=>{
  const e=entry();
  const result=UI.readEdit(form([field('6','8',{historyItem:'0',historySet:'1',historyField:'reps'})]),e);
  assert.deepEqual(result,{ok:true,patch:{items:[{index:0,repsList:[8,6,8]}]}});
  assert.equal(Model.edit(e,result.patch).ok,true);assert.equal(e.items[0].repsList,undefined);
});

test('per-set reserves preserve untouched precision and null positions; reps cannot get holes',()=>{
  const e=entry();
  const result=UI.readEdit(form([field('3','',{historyItem:'0',historySet:'1',historyField:'rir'})]),e);
  assert.deepEqual(result.patch.items[0].rirList,[1.234567891,3,2]);
  assert.equal(UI.readEdit(form([field('','8',{historyItem:'0',historySet:'1',historyField:'reps'})]),e).ok,false);
});

test('failed last attempt uses recorded position and separates attempted from completed sets',()=>{
  const e=entry();Object.assign(e.items[0],{setsDone:2,done:false,lastReps:0});
  const html=UI.render({mode:'detail',entry:e});
  assert.match(html,/<dt>Odrađene serije<\/dt><dd>1<\/dd>/);
  assert.match(html,/<dt>Pokušane serije<\/dt><dd>2<\/dd>/);
  assert.match(html,/<th scope="row">2<\/th><td>0<\/td>/);
  const last=UI.readEdit(form([field('4','0',{historyItem:'0',historyField:'lastReps'})]),e);
  assert.equal(Model.repetitionTotal(Model.edit(e,last.patch).entry.items[0]),12);
  const completed=UI.readEdit(form([field('2','1',{historyItem:'0',historyField:'setsDone'})]),e);
  assert.deepEqual(completed.patch.items,[{index:0,setsDone:2}]);
  assert.equal(Model.performedSets(Model.edit(e,completed.patch).entry.items[0]),2);
  const edit=UI.render({mode:'edit',entry:e});assert.equal((edit.match(/data-history-field="lastReps"/g)||[]).length,1);
});

test('archived snapshots retain saved names and counts read-only; legacy stays unknown',()=>{
  const snapshot=M.completedItem({id:'press',name:'Povijesni naziv',cat:'Snaga',muscles:{prime:['front_chest'],sec:[]}},{exId:'press',sets:3,setsDone:2,done:true});
  const e={historyId:'old',name:'Stariji trening',kind:'protocol',at:1,muscleWork:[M.pack(snapshot)],archived:true};
  const html=UI.render({mode:'edit',entry:e});
  assert.match(html,/Povijesni naziv/);assert.match(html,/<dt>Odrađene serije<\/dt><dd>2<\/dd>/);assert(!html.includes('data-history-item='));
  assert.match(UI.render({mode:'detail',entry:{...e,muscleWork:undefined}}),/Raspodjela po vježbama i mišićima nije dostupna/);
});

test('old field logs accept only explicitly entered scalars, leaving other fields unknown',()=>{
  const e={historyId:'field-old',kind:'field',name:'Teren',at:1,secs:900};
  const html=UI.render({mode:'edit',entry:e});assert.match(html,/data-history-load="m" value=""/);
  const result=UI.readEdit(form([field('600','',{historyLoad:'m'}),field('','',{historyLoad:'hsr'})]),e);
  assert.deepEqual(result.patch,{load:{m:600}});
  const saved=Model.edit(e,result.patch);assert.equal(saved.ok,true);assert.equal(saved.entry.load.m,600);assert.equal(saved.entry.load.hsr,undefined);
});

test('saved LM1 and current session AU have distinct labels; invalidated LM is not fabricated',()=>{
  const e={...entry(),load2:{v:'LM1',B:123,band:36.9,au:18}};
  const html=UI.render({mode:'detail',entry:e});assert.match(html,/Procjena napora LM1/);assert.match(html,/123 ± 36,9 bodova/);assert.match(html,/Napor × trajanje/);
  const invalid=UI.render({mode:'detail',entry:{...e,load2:undefined,load2Status:'needsProfile'}});
  assert.match(invalid,/nedostaju izvorni podaci o vježbama/);assert.match(invalid,/Napor × trajanje/);assert(!invalid.includes('123 ±'));
});

test('exercise trials remain visible; standalone tests, missing rows and dynamic text stay safe',()=>{
  const html=UI.render({entries:[{...entry(),kind:'exercise',name:'<img onerror="bad()">'},{historyId:'test',kind:'test',name:'MAS marker'}],filteredTotal:1});
  assert.match(html,/Vježba iz knjižnice/);assert(!html.includes('MAS marker'));assert(!html.includes('<img onerror='));assert.match(html,/&lt;img/);
  assert.match(UI.render({mode:'detail'}),/Zapis nije dostupan/);
  assert(!UI.render({mode:'detail',entry:entry(),deleteConfirm:true}).includes('Uklonit će se i povezani rezultat'));
  assert.match(UI.render({mode:'detail',entry:{...entry(),linkedMas:{value:4.5}},deleteConfirm:true}),/Uklonit će se i povezani rezultat MAS testa/);
});
