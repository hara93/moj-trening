'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const H=require('../history-model.js'),M=require('../muscle-work.js');
const copy=x=>JSON.parse(JSON.stringify(x));
const exercise={id:'own',name:'Izvorni potisak',cat:'Snaga',muscles:{prime:['front_chest'],sec:['back_triceps']}};
const item=()=>({exId:'own',measure:'sets',sets:3,reps:8,kg:20,done:true,rirList:[2,1,0]});
function protocol(){const x=item();return{historyId:'stable',kind:'protocol',refId:'p',name:'Stari trening',at:1000,secs:1200,srpe:6,items:[x],muscleWork:[M.pack(M.completedItem(exercise,x))],load2:{v:'LM1',B:100,min:20,au:120,ex:[80]}};}
function field(){return{kind:'field',at:1000,name:'Teren',secs:1800,srpe:5,load:{m:3000,hsr:600,spr:100,min:20,zones:[1200,1200,500,100],dose:'season',mas:4.5},load2:{v:'LM1',B:147,Bsets:0,Bfield:147,min:30,m:3000,band:44.1,au:150,ex:[],HS:{}}};}

test('atomic metadata and dose correction leaves source untouched and rejects whole transaction on one bad field',()=>{
 const old=protocol(),before=copy(old),r=H.edit(old,{name:'Ispravljeno',at:2000,items:[{index:0,setsDone:1,kg:22.5}]});
 assert.equal(r.ok,true);assert.deepEqual(old,before);assert.equal(r.entry.name,'Ispravljeno');assert.equal(r.entry.historyId,'stable');
 assert.equal(r.entry.items[0].kg,22.5);assert.equal(H.performedSets(r.entry.items[0]),1);assert.equal(r.entry.load2Status,'needsProfile');assert.equal(r.entry.load2,undefined);
 const bad=H.edit(old,{name:'Ne smije se spremiti',items:[{index:0,setsDone:4}]});assert.equal(bad.ok,false);assert.deepEqual(old,before);
 assert.equal(H.edit(old,{items:[{index:0,kg:-1}]}).ok,false);assert.equal(H.edit(old,{items:[{index:0},{index:0}]}).ok,false);
});
test('known immutable anatomy is reprojected from saved attribution only; old legacy gaps stay absent',()=>{
 const old=protocol(),r=H.edit(old,{items:[{index:0,setsDone:1}]});const s=M.sanitize(r.entry.muscleWork[0]);
 assert.equal(s.name,'Izvorni potisak');assert.deepEqual(s.primary,['chest']);assert.deepEqual(s.secondary,['triceps']);assert.equal(s.completedSets,1);assert.equal(s.credits.direct.chest,1);
 const legacy=protocol();delete legacy.muscleWork;assert.equal(H.edit(legacy,{items:[{index:0,setsDone:2}]}).entry.muscleWork,undefined);
 const gap=protocol();gap.muscleWork=[null];assert.deepEqual(H.edit(gap,{items:[{index:0,setsDone:2}]}).entry.muscleWork,[null]);
 const weight=H.edit(old,{items:[{index:0,kg:25}]});assert.deepEqual(weight.entry.muscleWork,old.muscleWork);
});
test('cleared actual count stays unknown, numeric zero is skipped, increasing counts pads reserve masks with null',()=>{
 const old=protocol(),clear=H.edit(old,{items:[{index:0,setsDone:null}]}).entry;
 assert.equal(clear.items[0].historySetsUnknown,true);assert.equal(H.performedSets(clear.items[0]),null);assert.equal(H.repetitionTotal(clear.items[0]),null);
 assert.equal(M.sanitize(clear.muscleWork[0]).completion,'unknown');assert.equal(clear.items[0].rirList,undefined);
 const zero=H.edit(old,{items:[{index:0,setsDone:0}]}).entry;assert.equal(zero.items[0].skipped,true);assert.equal(M.sanitize(zero.muscleWork[0]).completedSets,0);
 const one=H.edit(old,{items:[{index:0,setsDone:1}]}).entry;assert.deepEqual(one.items[0].rirList,[2]);
 const three=H.edit(one,{items:[{index:0,setsDone:3}]}).entry;assert.deepEqual(three.items[0].rirList,[2,null,null]);assert.equal(three.items[0].historySetsUnknown,undefined);
});
test('failed last reps, per-set doses and timed work retain their units and exact reserve alignment',()=>{
 const old=protocol();old.items[0]={...item(),done:false,lastReps:0,repsList:[8,7,6]};old.muscleWork=[M.pack(M.completedItem(exercise,old.items[0]))];
 assert.equal(H.repetitionTotal(old.items[0]),15);
 assert.equal(H.performedSets(old.items[0]),2);
 const r=H.edit(old,{items:[{index:0,lastReps:4,rirList:[2,null,0]}]});assert.equal(H.repetitionTotal(r.entry.items[0]),19);assert.deepEqual(r.entry.items[0].rirList,[2,null,0]);
 assert.equal(M.sanitize(r.entry.muscleWork[0]).completedSets,3);
 const timed=protocol();timed.items[0]={...item(),measure:'time',sec:20,sides:true};
 const t=H.edit(timed,{items:[{index:0,setsDone:2,sec:15,sirList:[5,null]}]});assert.equal(H.timeTotal(t.entry.items[0]),60);assert.equal(H.repetitionTotal(t.entry.items[0]),null);
 assert.equal(H.edit(old,{items:[{index:0,rirList:[41]}]}).ok,false);assert.equal(H.edit(old,{items:[{index:0,repsList:[8,null,6]}]}).ok,true);
});
test('confirming actual work clears old failure semantics and updates attribution even when raw set-position number is unchanged',()=>{
 const old=protocol();old.items[0]={...item(),setsDone:1,done:false,lastReps:0};old.muscleWork=[M.pack(M.completedItem(exercise,old.items[0]))];
 assert.equal(M.sanitize(old.muscleWork[0]).completedSets,0);
 const r=H.edit(old,{items:[{index:0,setsDone:1}]});assert.equal(r.ok,true);
 assert.equal(r.entry.items[0].done,true);assert.equal(r.entry.items[0].lastReps,undefined);
 assert.equal(M.sanitize(r.entry.muscleWork[0]).completedSets,1);assert.equal(M.sanitize(r.entry.muscleWork[0]).credits.direct.chest,1);
});
test('summary-only protocol/exercise/legacy edits preserve recorded LM and clearing srpe removes AU',()=>{
 for(const kind of ['protocol','exercise',null]){const old=protocol();old.kind=kind;delete old.items;
  const r=H.edit(old,{name:'Novi naziv',at:2200,srpe:null});assert.equal(r.ok,true);assert.equal(r.entry.load2.B,100);assert.equal(r.entry.load2.au,undefined);assert.equal(r.entry.srpe,undefined);
  assert.equal(H.edit(old,{items:[{index:0,setsDone:1}]}).ok,false);
 }
 const r=H.edit(protocol(),{srpe:7});assert.equal(r.entry.load2.au,140);assert.equal(r.entry.load2.B,100);
 assert.equal(H.edit(protocol(),{at:NaN}).ok,false);assert.equal(H.edit(protocol(),{srpe:11}).ok,false);
});
test('duration-only LM1 correction retains calibrated set/field subtotals and dose confidence, including trimmed summaries',()=>{
 const old=protocol();old.load2={v:'LM1',B:100,Bsets:80,Bfield:0,band:30,min:20,au:120,ex:[80],tap:3,zad:0,SL:{U:12},HS:{Potisak:3}};
 const r=H.edit(old,{secs:1500,srpe:7});assert.equal(r.ok,true);assert.equal(r.loadStatus,'recorded');assert.equal(r.entry.load2.B,105);assert.equal(r.entry.load2.band,31.5);assert.equal(r.entry.load2.au,175);assert.equal(r.entry.load2.min,25);
 assert.equal(r.entry.load2.Bsets,80);assert.deepEqual(r.entry.load2.SL,old.load2.SL);assert.deepEqual(r.entry.load2.HS,old.load2.HS);assert.equal(r.entry.load2.tap,3);assert.equal(r.entry.load2.zad,0);
 const trimmed=copy(old);delete trimmed.items;assert.equal(H.edit(trimmed,{secs:1500}).entry.load2.B,105);
 const dose=H.edit(old,{secs:1500,items:[{index:0,reps:9}]});assert.equal(dose.entry.load2,undefined);assert.equal(dose.entry.load2Status,'needsProfile');
 const insufficient=protocol();assert.equal(H.edit(insufficient,{secs:1500}).entry.load2Status,'needsProfile');
 const clear=H.edit(old,{secs:null});assert.equal(clear.entry.load2,undefined);assert.equal(clear.entry.load2Status,'needsProfile');
});
test('field measured aggregate edits keep trusted units, clear obsolete zones and recalculate exact known LM1',()=>{
 const old=field(),r=H.edit(old,{secs:2400,srpe:7,load:{m:4000,hsr:800,spr:200,min:25}});
 assert.equal(r.ok,true);assert.deepEqual(old,field());assert.equal(r.entry.load.zones,undefined);assert.equal(r.entry.load.mas,4.5);assert.equal(r.entry.load.dose,'season');
 assert.equal(r.entry.load2.B,193.5);assert.equal(r.entry.load2.Bfield,193.5);assert.equal(r.entry.load2.band,58.1);assert.equal(r.entry.load2.min,40);assert.equal(r.entry.load2.au,280);assert.equal(r.loadStatus,'recorded');
 assert.equal(H.edit(old,{load:{m:100,hsr:200}}).ok,false);assert.equal(H.edit(old,{load:{spr:700}}).ok,false);
});
test('field zones derive only exact aggregate sums and reject inconsistent totals in one transaction',()=>{
 const r=H.edit(field(),{load:{zones:[1000,500,300,100]}});assert.equal(r.ok,true);assert.equal(r.entry.load.m,1900);assert.equal(r.entry.load.hsr,400);assert.equal(r.entry.load.spr,100);
 assert.equal(H.edit(field(),{name:'No',load:{m:2000,zones:[1000,500,300,100]}}).ok,false);
 assert.equal(H.edit(field(),{load:{zones:[1000000,1000000,0,0]}}).ok,false);
});
test('partial or legacy field loads remain unknown and cannot fabricate current-template values or reinterpret a different LM',()=>{
 const old=field(),r=H.edit(old,{load:{hsr:null}});assert.equal(r.ok,true);assert.equal(r.entry.load.hsr,undefined);assert.equal(r.entry.fieldLoadStatus,'partial');assert.equal(r.entry.load2,undefined);assert.equal(r.entry.load2Status,'needsFieldData');
 const summary=H.fieldSummary(r.entry);assert.equal(summary.hsr,null);assert.equal(summary.m,3000);assert.equal(summary.complete,false);
 const totalCleared=H.edit(old,{load:{m:null}});assert.equal(totalCleared.ok,true);assert.equal(H.fieldSummary(totalCleared.entry).m,null);assert.equal(totalCleared.entry.load.zones,undefined);assert.equal(totalCleared.entry.load2,undefined);
 const legacy={kind:'field',at:100,name:'Starije'};const renamed=H.edit(legacy,{name:'Ispravak'});assert.equal(renamed.entry.load,undefined);assert.equal(renamed.entry.fieldLoadStatus,'partial');assert.equal(H.fieldSummary(renamed.entry).m,null);
 assert.deepEqual(H.edit(legacy,{}).entry,legacy);
 const other=field();other.load2.v='LM0';assert.equal(H.edit(other,{load:{m:4000}}).entry.load2Status,'needsProfile');
});
test('unchanged values preserve exact precision and no-op patches do not invalidate LM or reserve arrays',()=>{
 const old=protocol();old.at=1000.25;old.secs=1217;old.items[0].rirList=[1.25,null,2.5];
 const r=H.edit(old,{});assert.equal(r.ok,true);assert.deepEqual(r.entry,old);assert.deepEqual(r.changes,[]);assert.equal(r.loadStatus,'recorded');
 assert.equal(H.edit(old,{items:[{index:0,kg:20}]}).entry.load2.B,100);
});
