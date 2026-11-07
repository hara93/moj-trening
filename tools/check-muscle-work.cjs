'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('../muscle-work.js');
const ex = (props = {}) => ({ id:'custom-push',name:'Vlastiti potisak',cat:'Snaga',muscles:{prime:['front_chest'],sec:['back_triceps']},...props });
const done = (props = {}) => ({ exId:'custom-push',sets:3,reps:8,done:true,...props });
const copy = x => JSON.parse(JSON.stringify(x));

test('custom strength: primary/secondary credits remain separate integers and duplicates never multiply work', () => {
  const e = ex({muscles:{prime:['front_chest','front_chest'],sec:['front_chest','back_triceps','back_triceps']}});
  const s = M.completedItem(e,done());
  assert.deepEqual(s.primary,['chest']); assert.deepEqual(s.secondary,['triceps']);
  assert.deepEqual(s.credits,{direct:{chest:3},secondary:{triceps:3}});
  const sum = M.sumSnapshots([s]);
  assert.equal(sum.groups.chest.equivalent,3); assert.equal(sum.groups.triceps.equivalent,1.5);
  assert.equal(sum.groups.triceps.secondary,3);
});
test('known partial work counts performed sets, skipped and zero-rep failed sets do not count', () => {
  const partial = M.completedItem(ex(),done({setsDone:1}));
  assert.equal(partial.completion,'partial'); assert.equal(partial.credits.direct.chest,1);
  const failed = M.completedItem(ex(),done({done:false,lastReps:0}));
  assert.equal(failed.completedSets,2); assert.equal(failed.completion,'partial');
  assert.equal(M.completedItem(ex(),done({done:false,lastReps:0,setsDone:1})).completedSets,0);
  assert.equal(M.completedItem(ex(),done({done:false,lastReps:4})).completedSets,3);
  const skipped = M.completedItem(ex(),done({skipped:true}));
  assert.equal(skipped.completion,'skipped'); assert.deepEqual(skipped.credits.direct,{});
});
test('ambiguous or malformed performed counts are unknown rather than full planned work', () => {
  for (const change of [{done:false},{done:undefined},{setsDone:-1},{setsDone:1.5},{setsDone:4},{setsDone:'2'},{sets:undefined}]) {
    const s = M.completedItem(ex(),done(change));
    assert.equal(s.completion,'unknown',JSON.stringify(change));
    assert.deepEqual(s.credits.direct,{});
    assert.equal(M.sumSnapshots([s]).coverage.unknownItems,1);
  }
});
test('warmups and unsuitable categories stay excluded; explicit exercise eligibility can opt in or out', () => {
  for (const cat of ['Rehab','Mobilnost','Aktivacija','Eksplozivnost','Kondicija']) {
    const s = M.completedItem(ex({cat}),done());
    assert.equal(s.eligibility,'excluded'); assert.deepEqual(s.credits.direct,{});
  }
  assert.equal(M.completedItem(ex({cat:'Rehab',muscleWorkEligible:true}),done()).credits.direct.chest,3);
  assert.equal(M.completedItem(ex({muscleWorkEligible:false}),done()).eligibility,'excluded');
  for (const fn of [M.completedItem,M.plannedItem]) {
    const s = fn(ex({muscleWorkEligible:true}),done({warmup:true}));
    assert.equal(s.eligibility,'excluded'); assert.equal(s.eligibilitySource,'warmup'); assert.deepEqual(s.credits.direct,{});
  }
});
test('custom names do not determine eligibility or infer anatomical coverage', () => {
  const e = ex({name:'Bench press squat sprint rehab',cat:'Moj tip',muscles:null});
  assert.equal(M.profile(e).eligibility,'unknown');
  assert.equal(M.completedItem(e,done()).eligibility,'unknown');
  const unknown = M.completedItem(ex({muscles:{prime:['front_knees','front_shins_ankles','new_region'],sec:[]}}),done());
  assert.deepEqual(unknown.primary,[]); assert.equal(M.sumSnapshots([unknown]).coverage.unassignedItems,1);
  assert.deepEqual(unknown.unassignedRegions,['front_knees','front_shins_ankles','new_region']);
});
test('hip-only targets are excluded joint work, including explicit opt-in, and survive planning and packing', () => {
  for (const muscles of [
    {prime:['hip_joints'],sec:[]}, {prime:[],sec:['hip_joints']},
    {prime:['hip_joints','hip_joints'],sec:['hip_joints']}
  ]) {
    for (const props of [{cat:'Snaga'},{cat:'Trup'},{cat:'Mobilnost'},{cat:'Moj tip'},{muscleWorkEligible:true},{muscleWorkEligible:false}]) {
      const e = ex({...props,muscles}), profile = M.profile(e);
      assert.equal(profile.eligibility,'excluded'); assert.equal(profile.eligibilitySource,'joint');
      assert.deepEqual(profile.primary,[]); assert.deepEqual(profile.secondary,[]);
      assert.deepEqual(profile.unassignedRegions,['hip_joints']);
      for (const fn of [M.completedItem,M.plannedItem]) {
        const snapshot = fn(e,done());
        assert.deepEqual(snapshot.credits,{direct:{},secondary:{}});
        assert.equal(M.pack(snapshot)[6],4,'new reason follows all four existing packed reasons');
        assert.deepEqual(M.sanitize(copy(M.pack(snapshot))),snapshot);
        const summary = M.sumSnapshots([snapshot]);
        assert.equal(summary.coverage.excludedItems,1); assert.equal(summary.coverage.unassignedItems,0);
        assert.ok(Object.values(summary.groups).every(g => g.equivalent === 0));
      }
    }
  }
  const e = ex({muscles:{prime:['hip_joints'],sec:[]}});
  const pinned = M.pack(M.plannedItem(e,done()));
  e.muscles = {prime:['front_chest'],sec:[]};
  const completed = M.completedFromPlan(pinned,done({setsDone:1}));
  assert.equal(completed.eligibilitySource,'joint'); assert.deepEqual(completed.credits.direct,{});
  const item = done({measure:'sets'}), joint = ex({muscles:{prime:['hip_joints'],sec:[]}});
  const entry = {kind:'protocol',at:1000,secs:1200,items:[item],muscleWork:[M.pack(M.completedItem(joint,item))]};
  const edited = require('../history-model.js').edit(entry,{items:[{index:0,setsDone:1}]});
  assert.equal(edited.ok,true);
  const saved = M.sanitize(edited.entry.muscleWork[0]);
  assert.equal(saved.eligibilitySource,'joint'); assert.equal(saved.completedSets,1);
  assert.deepEqual(saved.credits,{direct:{},secondary:{}});
  const warmup = M.completedItem(ex({muscles:{prime:['hip_joints'],sec:[]}}),done({warmup:true}));
  assert.equal(warmup.eligibilitySource,'warmup'); assert.equal(M.pack(warmup)[6],3);
  assert.deepEqual(M.sanitize(copy(M.pack(warmup))),warmup);
});
test('a hip marker beside real muscles adds no credits or unassigned warning and does not hide unknown anatomy', () => {
  const mixed = ex({muscles:{prime:['hip_joints','front_chest'],sec:['hip_joints','back_triceps']}});
  const snapshot = M.completedItem(mixed,done());
  assert.equal(snapshot.eligibility,'eligible'); assert.equal(snapshot.eligibilitySource,'category');
  assert.deepEqual(snapshot.credits,{direct:{chest:3},secondary:{triceps:3}});
  assert.deepEqual(snapshot.unassignedRegions,[]);
  assert.equal(M.sumSnapshots([snapshot]).coverage.unassignedItems,0);
  assert.deepEqual(M.sanitize(copy(M.pack(snapshot))),snapshot);
  const unknown = M.completedItem(ex({muscles:{prime:['hip_joints','new_region'],sec:[]}}),done());
  assert.equal(unknown.eligibility,'eligible'); assert.deepEqual(unknown.unassignedRegions,['new_region']);
  assert.equal(M.sumSnapshots([unknown]).coverage.unassignedItems,1);
  const legacy = M.profile(ex({zones:['Kuk'],muscles:undefined}));
  assert.equal(legacy.eligibilitySource,'category'); assert.deepEqual(legacy.primary,[]);
});
test('legacy group masks, eligibility indices and unassigned hip history replay byte for byte', () => {
  assert.deepEqual(M.groups.slice(0,19).map(g => g.id),['chest','frontDelts','biceps','forearms','abs','obliques','hipFlexors','adductors','quadriceps','upperBack','lats','lowerBack','rearDelts','triceps','glutes','gluteMedius','hamstrings','calves','neck']);
  assert.equal(Object.hasOwn(M.regionToGroup,'hip_joints'),false);
  const legacy = [
    ['mw1','category','Stara snaga','Snaga',0,1,1,1,8192,[],3,2,1],
    ['mw1','explicit','Stara uključena mobilnost','Mobilnost',0,1,0,262143,0,[],3,3,0],
    ['mw1','unknown','Stara nepoznata','Moj tip',0,2,2,0,0,['new_region'],3,null,3],
    ['mw1','warmup','Staro zagrijavanje','Snaga',1,0,3,1,0,[],3,null,4],
    ['mw1','legacy-hip','Stari neraspoređeni kuk','Snaga',0,1,1,0,0,['hip_joints'],3,3,0]
  ];
  for (const packed of legacy) {
    const snapshot = M.sanitize(copy(packed));
    assert.ok(snapshot,packed[1]); assert.deepEqual(M.pack(snapshot),packed);
  }
  assert.equal(M.sanitize(legacy[1]).primary.length,18);
  const historicalHip = M.sanitize(legacy[4]);
  assert.equal(historicalHip.eligibility,'eligible'); assert.equal(historicalHip.eligibilitySource,'category');
  assert.deepEqual(historicalHip.unassignedRegions,['hip_joints']);
  assert.equal(M.sumSnapshots([historicalHip]).coverage.unassignedItems,1,'historical attribution is not reclassified');
});
test('joint snapshot reason rejects credited muscles, eligibility changes and missing or unrelated joint attribution', () => {
  const good = M.completedItem(ex({muscles:{prime:['hip_joints'],sec:[]}}),done());
  for (const mutate of [s=>s.eligibility='eligible',s=>s.primary.push('chest'),s=>s.secondary.push('triceps'),s=>s.unassignedRegions=[],s=>s.unassignedRegions.push('new_region'),s=>s.unassignedRegions=['front_knees']]) {
    const snapshot = copy(good); mutate(snapshot); assert.equal(M.sanitize(snapshot),null);
  }
  for (const mutate of [s=>s[5]=1,s=>s[7]=1,s=>s[8]=1,s=>s[9]=[],s=>s[9]=['hip_joints','new_region'],s=>s[9]=['front_knees']]) {
    const packed = copy(M.pack(good)); mutate(packed); assert.equal(M.sanitize(packed),null);
  }
});
test('completed snapshots are detached and deeply immutable; later edits do not rewrite history', () => {
  const e = ex(), x = done(), s = M.completedItem(e,x);
  e.name = 'Novo'; e.muscles.prime[0] = 'back_glutes'; x.sets = 10;
  assert.equal(s.name,'Vlastiti potisak'); assert.deepEqual(s.primary,['chest']); assert.equal(s.completedSets,3);
  assert.throws(()=>{s.primary.push('glutes');},TypeError);
  assert.throws(()=>{s.credits.direct.chest=99;},TypeError);
});
test('planned protocol is an independent forecast; actual work does not borrow planned completion', () => {
  const snapshots = M.plannedProtocol({items:[done({done:undefined}),done({warmup:true})]}, {'custom-push':ex()});
  assert.equal(snapshots.length,2); assert.equal(snapshots[0].source,'planned');
  assert.equal(snapshots[0].completedSets,null); assert.equal(snapshots[0].credits.direct.chest,3);
  assert.equal(M.sumSnapshots(snapshots).groups.chest.direct,3);
  assert.equal(M.completedItem(ex(),done({setsDone:1})).credits.direct.chest,1);
});
test('completion from a pinned plan retains the original name, eligibility, roles and warmup through retry/reload', () => {
  const e = ex(), pinned = M.pack(M.plannedItem(e,done({done:undefined})));
  e.name = 'Preimenovano'; e.cat = 'Mobilnost'; e.muscles = {prime:['back_glutes'],sec:[]}; e.muscleWorkEligible = false;
  const actual = M.completedFromPlan(copy(pinned),done({setsDone:1}));
  assert.equal(actual.name,'Vlastiti potisak'); assert.equal(actual.category,'Snaga');
  assert.equal(actual.eligibility,'eligible'); assert.deepEqual(actual.primary,['chest']);
  assert.deepEqual(actual.secondary,['triceps']); assert.equal(actual.completedSets,1); assert.equal(actual.completion,'partial');
  assert.deepEqual(actual.credits,{direct:{chest:1},secondary:{triceps:1}});
  assert.equal(M.completedFromPlan(pinned,done({done:false,lastReps:0})).completedSets,2);
  assert.equal(M.completedFromPlan(pinned,done({done:false})).completion,'unknown');
  const warmup = M.plannedItem(ex(),done({warmup:true}));
  assert.equal(M.completedFromPlan(warmup,done({warmup:false})).eligibilitySource,'warmup');
  assert.deepEqual(M.completedFromPlan(warmup,done()).credits.direct,{});
  assert.equal(M.completedFromPlan(null,done()),null);
  assert.equal(M.completedFromPlan(pinned,done({exId:'other'})),null);
  assert.equal(M.completedFromPlan(pinned,done({sets:4})),null);
  assert.equal(M.completedFromPlan(M.completedItem(ex(),done()),done()),null);
  assert.equal(M.sanitize(M.pack(actual)).completedSets,1);
  assert.throws(()=>{actual.primary.push('glutes');},TypeError);
});
test('compact packing round-trips every group, empty and partial/excluded snapshots with no stored derived credit', () => {
  const e = ex({muscles:{prime:M.groups.map(g=>g.regions[0]),sec:[]}});
  const all = M.completedItem(e,done()), packed = M.pack(all);
  assert.equal(packed.length,13); assert.deepEqual(M.sanitize(copy(packed)),all);
  for (const s of [M.completedItem(ex(),done({setsDone:1})),M.completedItem(ex(),done({skipped:true})),M.completedItem(ex(),done({done:false})),M.plannedItem(ex(),done({warmup:true}))]) {
    assert.deepEqual(M.sanitize(copy(M.pack(s))),s);
  }
  assert.ok(JSON.stringify(M.pack(M.completedItem(ex(),done()))).length < JSON.stringify(M.completedItem(ex(),done())).length / 2);
  const reversed = M.completedItem(ex({muscles:{prime:['back_glutes','front_chest'],sec:['back_triceps','front_biceps']}}),done());
  assert.deepEqual(M.sanitize(copy(M.pack(reversed))),reversed);
});
test('new neck credit is explicit and appended after every legacy packed muscle position',()=>{
  assert.equal(M.groups[18].id,'neck');assert.equal(M.regionToGroup.neck,'neck');
  const previous=M.completedItem(ex({muscles:{prime:['back_upper_back_trapezius'],sec:[]}}),done());
  assert.deepEqual(previous.primary,['upperBack']);assert.equal(M.pack(previous)[7],1<<9);
  const current=M.completedItem(ex({muscles:{prime:['neck'],sec:[]}}),done());
  assert.deepEqual(current.primary,['neck']);assert.deepEqual(current.credits.direct,{neck:3});
  assert.equal(M.pack(current)[7],1<<18);assert.deepEqual(M.sanitize(copy(M.pack(current))),current);
  assert.equal(M.sumSnapshots([previous]).groups.neck.direct,0);
  const legacy=['mw1','legacy-neck','Stari nepoznati vrat','Snaga',0,1,1,0,0,['neck'],3,3,0];
  const historical=M.sanitize(copy(legacy));assert.ok(historical);assert.deepEqual(M.pack(historical),legacy);
  assert.deepEqual(historical.primary,[]);assert.deepEqual(historical.credits.direct,{});
  assert.equal(M.sumSnapshots([historical]).coverage.unassignedItems,1);
  const duplicate=copy(current);duplicate.unassignedRegions.push('neck');assert.equal(M.sanitize(duplicate),null);
});

test('anterior lower leg uses an appended credit and legacy ankle snapshots keep their meaning',()=>{
  assert.equal(M.groups.length,20);assert.equal(M.groups[19].id,'shins');
  assert.equal(M.regionToGroup.front_shins,'shins');assert.equal(M.regionToGroup.front_shins_ankles,undefined);
  const anterior=M.completedItem(ex({muscles:{prime:['front_shins'],sec:[]}}),done());
  assert.deepEqual(anterior.credits.direct,{shins:3});assert.equal(M.pack(anterior)[7],1<<19);
  assert.deepEqual(M.sanitize(copy(M.pack(anterior))),anterior);
  const legacy=['mw1','legacy-ankle','Stara oznaka','Snaga',0,1,1,0,0,['front_shins_ankles'],3,3,0];
  const historical=M.sanitize(copy(legacy));assert.deepEqual(M.pack(historical),legacy);
  const aggregate=M.sumSnapshots([anterior,historical]);
  assert.equal(aggregate.groups.shins.direct,3);assert.equal(aggregate.groups.calves.direct,0);
  assert.equal(aggregate.coverage.unassignedItems,1);
});

test('skipped or zero-work unknown anatomy is not reported as unallocated performed work; excluded warmups are not partial strength work', () => {
  const unassigned = ex({muscles:null});
  for (const item of [done({skipped:true}),done({setsDone:0}),done({done:false,lastReps:0,setsDone:1})]) {
    assert.equal(M.sumSnapshots([M.completedItem(unassigned,item)]).coverage.unassignedItems,0);
  }
  const warmup = M.completedItem(ex(),done({warmup:true,setsDone:1}));
  assert.equal(M.sumSnapshots([warmup]).coverage.partialItems,0);
  assert.equal(M.sumSnapshots([M.completedItem(unassigned,done())]).coverage.unassignedItems,1);
});
test('import validation refuses inconsistent, fractional, overlapping, unknown-version or tampered credits', () => {
  const good = M.completedItem(ex(),done());
  for (const mutate of [s=>s.v=2,s=>s.primary.push('futureGroup'),s=>s.secondary.push('chest'),s=>s.completedSets=1.5,s=>s.credits.direct.chest=40,s=>s.plannedSets=2,s=>s.completion='planned',s=>s.exerciseId='__proto__',s=>s.unassignedRegions.push('front_chest')]) {
    const s = copy(good); mutate(s); assert.equal(M.sanitize(s),null);
  }
  for (const mutate of [s=>s[7]=2**M.groups.length,s=>s[8]=-1,s=>s[4]=7,s=>s[12]='0',s=>s.pop()]) {
    const s = copy(M.pack(good)); mutate(s); assert.equal(M.sanitize(s),null);
  }
  assert.deepEqual(M.sanitize(copy(good)),good);
});
test('weekly totals use only immutable authoritative snapshots, survive trimmed items and expose old missing/invalid logs', () => {
  const actual = M.completedItem(ex(),done({setsDone:1})), planned = M.plannedItem(ex(),done());
  const logs = [
    {kind:'protocol',at:10,name:'Dovršeno',muscleWork:[M.pack(actual)]},
    {kind:'protocol',at:12,name:'Staro',items:[done()]},
    {kind:'protocol',at:13,muscleWork:[{broken:true}]},
    {kind:'protocol',at:14,muscleWork:[planned]},
    ...['field','exercise','test'].map((kind,i)=>({kind,at:15+i,muscleWork:[M.pack(actual)]})),
    {kind:'protocol',at:20,muscleWork:[actual]}
  ];
  const result = M.week(logs,{from:10,to:20});
  assert.equal(result.groups.chest.direct,1); assert.equal(result.groups.triceps.equivalent,.5);
  assert.equal(result.coverage.sessions,4); assert.equal(result.coverage.missingSessions,1);
  assert.equal(result.coverage.invalidSessions,2); assert.equal(result.coverage.partialSessions,1);
  assert.equal(result.coverage.excludedSessions,3); assert.equal(result.coverage.invalidItems,2);
  assert.equal(result.groups.chest.items[0].at,10); assert.equal(result.groups.chest.items[0].sessionName,'Dovršeno');
  assert.equal(result.groups.chest.items[0].name,'Vlastiti potisak');
  assert.throws(()=>M.week(logs,{from:20,to:20}),RangeError);
});
test('an imported empty attribution array remains a missing breakdown, never a covered zero-work session', () => {
  const result = M.week([{kind:'protocol',at:10,muscleWork:[]}],{from:0,to:20});
  assert.equal(result.coverage.sessions,1); assert.equal(result.coverage.missingSessions,1);
  assert.equal(result.coverage.coveredSessions,0); assert.equal(result.groups.chest.direct,0);
});
