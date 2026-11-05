'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const W=require('../workout-model.js'),M=require('../muscle-work.js');
const now=new Date('2026-11-05T12:00:00').getTime(),at=day=>new Date('2026-11-'+String(day).padStart(2,'0')+'T10:00:00').getTime();
const exercise=(id,extra={})=>({id,name:id,cat:'Snaga',measure:'sets',equip:['Bučice'],muscles:{prime:['front_chest'],sec:['back_triceps']},sets:3,reps:8,sec:30,kg:10,sides:false,rest:60,...extra});
const exercises={source:exercise('source'),custom:exercise('custom'),floor:exercise('floor',{equip:['Bez opreme']}),bench:exercise('bench',{equip:['Bučice','Klupa']})};
const item=(extra={})=>({exId:'source',measure:'sets',sets:3,reps:5,kg:80,sides:false,rest:120,...extra});
const candidates=(extra={})=>W.candidates({item:item(),exercises,...extra});
const log=(id,day,items=[{...item(),done:true,setsDone:2}],extra={})=>({historyId:id,kind:'protocol',name:'Trening '+id,at:at(day),secs:600,items,...extra});
const previous=(entries,extra={})=>W.previous({item:item(),log:entries,now,...extra});
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};

test('own custom exercises match explicit category, measure and primary groups without a seed whitelist or name inference',()=>{
  const map={...exercises,
    wrongCat:exercise('wrongCat',{cat:'Aktivacija'}),wrongMeasure:exercise('wrongMeasure',{measure:'time'}),
    secondaryOnly:exercise('secondaryOnly',{muscles:{prime:['back_triceps'],sec:['front_chest']}}),
    unknownMuscles:exercise('unknownMuscles',{name:'Potisak za prsa',muscles:undefined}),
    sameUnknown:exercise('sameUnknown',{muscles:{prime:['invented-region']}})
  };
  assert.deepEqual(candidates({exercises:map}).map(x=>x.id),['bench','custom','floor']);
  assert.match(candidates()[1].reason,/Provjeri izvedbu i novu dozu/);assert.match(candidates()[1].reason,/nije nužno jednako/);
});
test('equipment filters require all recorded tags, distinguish unknown from explicit none and never parse a description',()=>{
  const map={...exercises,unknown:exercise('unknown',{equip:[],equipment:'Bučice ili klupa'}),malformed:exercise('malformed',{equip:['Bučice',null]})};
  assert.ok(candidates({exercises:map}).some(x=>x.id==='unknown'));
  assert.deepEqual(candidates({exercises:map,equipment:[]}).map(x=>x.id),['floor']);
  assert.deepEqual(candidates({exercises:map,equipment:['bučice']}).map(x=>x.id),['custom','floor']);
  assert.deepEqual(candidates({exercises:map,equipment:['Bučice','Klupa']}).map(x=>x.id),['bench','custom','floor']);
  assert.equal(candidates({equipment:null}).length,0);assert.deepEqual(candidates({exercises:map}).find(x=>x.id==='unknown').equipment,[]);
});
test('available explicit movement profiles narrow matches and a missing counterpart is not fabricated',()=>{
  const profiles={source:{pat:'U1'},custom:{pat:'U1'},floor:{pat:'C'},bench:{pat:'L1'}};
  assert.deepEqual(candidates({profiles}).map(x=>x.id),['custom']);
  assert.equal(candidates({profiles:{source:{pat:'U1'}}}).length,0);
  assert.equal(candidates({profiles:{custom:{pat:'U1'}}}).some(x=>x.id==='custom'),false);
  const map={...exercises,source:exercise('source',{movementPattern:'push'}),custom:exercise('custom',{movementPattern:'push'})};
  assert.deepEqual(candidates({exercises:map,profiles}).map(x=>x.id),['custom']);
});
test('exclude IDs and invalid source evidence are respected without broad random fallback',()=>{
  assert.deepEqual(candidates({excludeIds:['custom','floor']}).map(x=>x.id),['bench']);
  assert.deepEqual(candidates({excludeIds:new Set(['bench','custom','floor'])}),[]);
  for(const value of [null,{},item({exId:'missing'}),item({measure:undefined})])assert.equal(candidates({item:value}).length,0);
  const map={...exercises,source:exercise('source',{muscles:{prime:[]}})};assert.deepEqual(candidates({exercises:map}),[]);
});
test('replacement drafts carry candidate scalar dose and retain only original scheduling/group context',()=>{
  const old=item({section:'Glavni blok',ss:'pair-a',sets:4,startingKgKnown:true,repsList:[5,4],kgList:[70,80],rirList:[0,1],sirList:[5,10],ok:3,fail:2,prev:{kg:60},up:true,r0:5,r1:8,note:'Old exercise cue'});
  const next={exId:'custom',measure:'sets',sets:2,reps:12,sec:25,kg:7.5,sides:true,rest:30,startingKgKnown:true,repsList:[12,10],kgList:[7.5,10],rirList:[1,2],ok:10};
  const draft=W.draftReplacement(old,next);
  assert.deepEqual(draft,{exId:'custom',measure:'sets',sets:4,reps:12,sec:25,kg:7.5,sides:true,startingKgKnown:true,rest:120,section:'Glavni blok',ss:'pair-a'});
  for(const key of ['repsList','kgList','rirList','sirList','ok','fail','prev','up','r0','r1','note'])assert.equal(Object.hasOwn(draft,key),false,key);
  assert.equal(old.kg,80);assert.deepEqual(old.kgList,[70,80]);
});
test('old weight and starting-load certainty never leak into unknown or zero candidate load',()=>{
  const unknown=exercise('custom',{kg:undefined});
  const draft=W.draftReplacement(item({startingKgKnown:true}),unknown);assert.equal(Object.hasOwn(draft,'kg'),false);assert.equal(Object.hasOwn(draft,'startingKgKnown'),false);
  const zero=W.draftReplacement(item({startingKgKnown:true}),exercise('custom',{kg:0}));assert.equal(zero.kg,0);assert.equal(Object.hasOwn(zero,'startingKgKnown'),false);
  const explicit=W.draftReplacement(item(),exercise('custom',{kg:0,startingKgKnown:true}));assert.equal(explicit.startingKgKnown,true);
});
test('timed replacement uses the candidate hold and side mode without copying old reps or seconds',()=>{
  const old=item({measure:'time',sec:60,reps:99,secList:[45,60],sides:true});
  const draft=W.draftReplacement(old,exercise('hold',{measure:'time',sec:20,reps:1,kg:0,sides:false}));
  assert.equal(draft.sec,20);assert.equal(draft.reps,1);assert.equal(draft.sides,false);assert.equal(Object.hasOwn(draft,'secList'),false);
});
test('replacement rejects missing/invalid identity or active dose and never guesses a measure',()=>{
  for(const bad of [{},exercise('custom',{measure:undefined}),exercise('custom',{measure:'time'}),exercise('custom',{reps:0}),exercise('custom',{kg:'10'}),exercise('custom',{sides:'yes'}),{...exercise('custom'),exId:'other'}])assert.equal(W.draftReplacement(item(),bad),null);
  assert.equal(W.draftReplacement(item({measure:'time'}),exercise('hold',{measure:'time',sec:undefined})),null);
  const fallback=W.draftReplacement(item({sets:undefined,rest:undefined}),exercise('custom',{sets:2,rest:30}));assert.equal(fallback.sets,2);assert.equal(fallback.rest,30);
});
test('previous rows preserve actual per-set gaps, ordinal positions, zero reserve and failed attempts',()=>{
  const rows=item({done:false,lastReps:0,setsDone:2,repsList:[5,3,null],kgList:[20,null,40],rirList:[0,null,2],setNumbers:[1,3]});
  const result=previous([log('current',5,[rows]),log('older',3)]);
  assert.equal(result.sessionId,'current');assert.equal(result.at,at(5));assert.equal(result.rows.length,2);
  assert.deepEqual(result.rows.map(r=>[r.number,r.reps,r.kg,r.rir,r.failed]),[[1,5,20,0,false],[3,0,null,0,true]]);
  assert.ok(result.rows.every(r=>r.sec===null&&r.sir===null));assert.equal(result.unknownItems,1);
});
test('previous timed rows show saved seconds/SIR without displaying irrelevant planned reps',()=>{
  const timed=item({measure:'time',done:true,setsDone:2,sec:99,secList:[20,null],kgList:[0,2],sirList:[0,null],sides:true,sideCounts:[2,1]});
  const result=previous([log('hold',5,[timed])]);
  assert.deepEqual(result.rows.map(r=>[r.sec,r.sir,r.sides,r.perSide,r.reps]),[[20,0,2,true,null],[null,null,1,true,null]]);
  assert.equal(result.unknownItems,1);
  const unknown=previous([log('unknown',5,[{...timed,historySecUnknown:true,historyKgUnknown:true}])]);assert.ok(unknown.rows.every(r=>r.sec===null&&r.kg===null));
});
test('latest unknown or skipped occurrence stays explicit rather than showing an older known plan',()=>{
  const unknown=previous([log('unknown',5,[item({historySetsUnknown:true})]),log('known',3)]);
  assert.equal(unknown.sessionId,'unknown');assert.deepEqual(unknown.rows,[]);assert.equal(unknown.unknownItems,1);assert.match(unknown.context,/nije poznat/);
  const skipped=previous([log('skip',5,[item({skipped:true,setsDone:0})]),log('known',3)]);assert.equal(skipped.sessionId,'skip');assert.equal(skipped.skippedItems,1);assert.match(skipped.context,/preskočena/);
});
test('previous may use an exercise trial but excludes test markers, field/team entries and future logs',()=>{
  const result=previous([log('future',6),log('test',5,undefined,{kind:'test'}),log('field',5,undefined,{kind:'field'}),log('team',5,undefined,{kind:'team'}),log('trial',4,undefined,{kind:'exercise'}),log('protocol',3)]);
  assert.equal(result.sessionId,'trial');assert.equal(result.kind,'exercise');
  assert.equal(previous([log('legacy',3,undefined,{kind:null})]).sessionId,'legacy');
});
test('duplicate exercise blocks remain separate row positions and use their actual saved measures',()=>{
  const result=previous([log('blocks',5,[item({done:true,setsDone:1,reps:6}),item({done:true,setsDone:1,measure:'time',sec:15,kg:0})])]);
  assert.deepEqual(result.rows.map(r=>[r.itemIndex,r.number,r.measure,r.reps,r.sec]),[[0,1,'sets',6,null],[1,1,'time',null,15]]);
});
test('saved snapshot names and trimmed newer history stay authoritative without recreating lost sets',()=>{
  const actual={...item(),done:true,setsDone:2},snapshot=M.pack(M.completedItem(exercise('source',{name:'Povijesni naziv'}),actual));
  const full=log('full',3,[actual],{muscleWork:[snapshot]});assert.equal(previous([full]).exerciseName,'Povijesni naziv');
  const trimmed=log('trimmed',5,[],{muscleWork:[snapshot]});delete trimmed.items;
  const result=previous([trimmed,full]);assert.equal(result.sessionId,'trimmed');assert.equal(result.exerciseName,'Povijesni naziv');assert.deepEqual(result.rows,[]);assert.equal(result.unknownItems,1);
});
test('unknown historical measure cannot borrow the current exercise target or expose inactive scalar defaults',()=>{
  const result=previous([log('old',5,[item({measure:undefined,done:true,setsDone:1,reps:10,sec:30})])],{item:item({measure:'time'})});
  assert.equal(result.rows[0].measure,null);assert.equal(result.rows[0].reps,null);assert.equal(result.rows[0].sec,null);assert.equal(result.unknownItems,1);
});
test('past-evidence identities use the latest revision and do not resurrect an older copy moved into the future',()=>{
  const old=log('same',3),future=log('same',6,undefined,{editedAt:at(5)});
  assert.equal(previous([old,future]),null);
  assert.equal(previous([old,log('same',4,undefined,{editedAt:at(5)})]).at,at(4));
});
test('all model outputs are deeply detached/immutable and invalid evidence has an honest empty result',()=>{
  const map=freeze(JSON.parse(JSON.stringify(exercises))),old=freeze(item({section:'Main',ss:'pair'})),candidate=freeze(exercise('custom')),entries=freeze([log('one',5)]),before=JSON.stringify({map,old,candidate,entries});
  const choices=W.candidates({item:old,exercises:map}),draft=W.draftReplacement(old,candidate),past=previous(entries);
  assert.ok(Object.isFrozen(choices)&&Object.isFrozen(choices[0])&&Object.isFrozen(choices[0].equipment)&&Object.isFrozen(draft)&&Object.isFrozen(past.rows[0]));
  assert.throws(()=>choices[0].equipment.push('Invented'),TypeError);assert.equal(JSON.stringify({map,old,candidate,entries}),before);
  assert.equal(W.previous({item:item(),log:entries,now:'2026-11-05'}),null);assert.equal(previous([]),null);assert.equal(W.draftReplacement(null,candidate),null);assert.deepEqual(W.candidates(),[]);
});
