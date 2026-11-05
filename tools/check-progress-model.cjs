'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const Model=require('../progress-model.js'),History=require('../history-model.js'),Muscles=require('../muscle-work.js');
const HistoryUI=require('../history.js');
const now=new Date('2026-11-05T12:00:00').getTime();
const at=day=>new Date('2026-11-'+String(day).padStart(2,'0')+'T10:00:00').getTime();
const exercises={press:{id:'press',name:'Potisak',cat:'Snaga',muscles:{prime:['front_chest']}},hold:{id:'hold',name:'Bočni plank',cat:'Trup',muscles:{prime:['front_obliques']}}};
const item=(extra={})=>({exId:'press',measure:'sets',sets:2,setsDone:2,done:true,sides:false,reps:10,kg:20,...extra});
const entry=(id,day,items=[item()],extra={})=>({historyId:id,kind:'protocol',name:'Trening',at:at(day),secs:600,items,...extra});
const summarize=(log,extra={})=>Model.summarize({log,exercises,now,...extra});
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};

test('same-weight comparisons use best actual sets rather than uniform plans or session volume',()=>{
  const log=[entry('current',5,[item({repsList:[5,3],kgList:[20,30]})]),entry('previous',3,[item({repsList:[4,2],kgList:[20,30]})])];
  const result=summarize(log),card=result.comparisons[0];
  assert.equal(result.comparisons.length,1);assert.equal(card.kind,'reps');assert.equal(card.unit,'pon.');
  assert.deepEqual([card.current,card.previous,card.delta],[3,2,1]);assert.match(card.context,/30 kg u zapisu/);
  assert.equal(card.currentSessionId,'current');assert.equal(card.previousSessionId,'previous');
  assert.equal(card.currentAt,at(5));assert.equal(card.previousAt,at(3));assert.match(card.context,/Rezerva nije poznata/);
});
test('common weight is selected before direction, so easier positive rows cannot hide a decline at the heavier common weight',()=>{
  const log=[entry('current',5,[item({repsList:[8,2],kgList:[20,30]})]),entry('previous',3,[item({repsList:[4,4],kgList:[20,30]})])];
  const card=summarize(log).comparisons[0];assert.deepEqual([card.current,card.previous,card.delta],[2,4,-2]);assert.match(card.context,/30 kg/);
  const neutral=summarize([entry('current',5,[item({reps:5})]),entry('previous',3,[item({reps:5})])]).comparisons[0];assert.equal(neutral.delta,0);
});
test('a nearest older shared weight is explicit evidence and unshared weights never turn into estimated kilos',()=>{
  const log=[entry('current',5,[item({kg:20,reps:6})]),entry('unshared',4,[item({kg:30,reps:3})]),entry('previous',3,[item({kg:20,reps:5})])];
  assert.equal(summarize(log).comparisons[0].previousSessionId,'previous');
  assert.equal(summarize(log.slice(0,2)).comparisons.length,0);
  assert.equal(summarize([entry('one',5)]).comparisons.length,0);
});
test('timed values are actual seconds per side at the same recorded kg and side mode',()=>{
  const timed=(sec,extra={})=>item({exId:'hold',measure:'time',sides:true,sideCounts:[2,2],sec,kg:0,...extra});
  const card=summarize([entry('current',5,[timed(30,{secList:[30,27],sirList:[0,null]})]),entry('previous',3,[timed(25,{sirList:[5,5]})])]).comparisons[0];
  assert.equal(card.kind,'time');assert.equal(card.unit,'s');assert.deepEqual([card.current,card.previous,card.delta],[30,25,5]);
  assert.match(card.context,/po strani; obje strane odrađene/);assert.match(card.context,/Rezerva u sekundama 5 → 0/);assert.match(card.context,/različita rezerva/);
  assert.equal(summarize([entry('current',5,[timed(30)]),entry('one-side',3,[timed(25,{sides:false,sideCounts:[1,1]})])]).comparisons.length,0);
});
test('failed attempts and incomplete bilateral sets do not become full-set achievements',()=>{
  const current=entry('current',5,[item({done:false,lastReps:9,repsList:[4,8]})]);
  const card=summarize([current,entry('previous',3,[item({reps:3})])]).comparisons[0];assert.equal(card.current,4);
  const full=entry('previous',3,[item({sides:true,sideCounts:[2,2]})]);
  const partial=entry('current',5,[item({sides:true,sideCounts:[1,1]})]);assert.equal(summarize([partial,full]).comparisons.length,0);
  const skipped=entry('current',5,[item({skipped:true,setsDone:0})]);assert.equal(summarize([skipped,entry('older',4),entry('oldest',3)]).comparisons.length,0);
  const oneFull=entry('current',5,[item({sets:3,setsDone:1,reps:11})]);assert.equal(summarize([oneFull,entry('previous',3)]).comparisons[0].current,11);
});
test('explicit null or short lists stay unknown, while known rows and recorded zero kg remain usable',()=>{
  const previous=entry('previous',3,[item({reps:4})]);
  for(const change of [{repsList:[null,null]},{kgList:[]},{kg:undefined},{sideCounts:[]},{historyKgUnknown:true},{historyRepsUnknown:true},{historySetsUnknown:true},{reps:0}]){
    const log=[entry('current',5,[item(change)]),previous];assert.equal(summarize(log).comparisons.length,0,JSON.stringify(change));
  }
  const partial=summarize([entry('current',5,[item({repsList:[5,null],kgList:[20]})]),previous]).comparisons[0];assert.equal(partial.current,5);
  const zero=summarize([entry('current',5,[item({kg:0,reps:5})]),entry('previous',3,[item({kg:0,reps:4})])]).comparisons[0];assert.equal(zero.delta,1);assert.match(zero.context,/0 kg u zapisu/);
});
test('missing or changed measure cannot be inferred from the current library or another planned scalar',()=>{
  const ambiguous=item({measure:undefined,sec:30,reps:10});
  assert.equal(summarize([entry('current',5,[ambiguous]),entry('previous',3)]).comparisons.length,0);
  const timed=item({measure:'time',sec:30});
  assert.equal(summarize([entry('current',5,[timed]),entry('previous',3)]).comparisons.length,0);
  const library={...exercises,press:{...exercises.press,measure:'time'}};
  assert.equal(summarize([entry('current',5,[ambiguous]),entry('previous',3)],{exercises:library}).comparisons.length,0);
});
test('warmup exclusions consume actual saved MuscleWork snapshots and preserve their historical names',()=>{
  const current=entry('current',5,[item({reps:5})]),previous=entry('previous',3,[item({reps:4})]);
  const saved=Muscles.completedItem({...exercises.press,name:'Izvorni potisak'},current.items[0]);
  current.muscleWork=[Muscles.pack(saved)];assert.equal(summarize([current,previous]).comparisons[0].name,'Izvorni potisak');
  const warm=Muscles.completedItem(exercises.press,{...current.items[0],warmup:true});
  assert.equal(Muscles.sanitize(Muscles.pack(warm)).eligibilitySource,'warmup');current.muscleWork=[Muscles.pack(warm)];
  assert.equal(summarize([current,previous]).comparisons.length,0);
});
test('only main strength/trunk protocol work is highlighted, while trials and future evidence are excluded',()=>{
  const eligible=[entry('current',5,[item({reps:5})]),entry('previous',3,[item({reps:4})])];
  const extras=[entry('trial',5,[item({reps:99})],{kind:'exercise'}),entry('team',5,[item({reps:99})],{kind:'team'}),entry('field',5,[item({reps:99})],{kind:'field'}),entry('test',5,[item({reps:99})],{kind:'test'}),entry('future',6,[item({reps:99})])];
  assert.equal(summarize(extras.concat(eligible)).comparisons[0].current,5);
  for(const cat of ['Mobilnost','Rehab','Aktivacija','Eksplozivnost','Unknown'])assert.equal(summarize(eligible,{exercises:{press:{...exercises.press,cat}}}).comparisons.length,0);
  assert.equal(summarize(eligible,{exercises:{}}).comparisons.length,0);
});
test('the latest three comparisons are returned without sorting by positive delta',()=>{
  const map={},log=[];
  for(let n=0;n<4;n++){
    const id='lift'+n;map[id]={id,name:'Lift '+n,cat:'Snaga'};
    log.push(entry('current'+n,5,[item({exId:id,reps:n+2})],{at:at(5)-n*1000}),entry('previous'+n,3,[item({exId:id,reps:5})]));
  }
  const cards=summarize(log,{exercises:map}).comparisons;assert.deepEqual(cards.map(x=>x.id),['lift0','lift1','lift2']);assert.equal(cards[0].delta,-3);
});
test('weekly duration and AU remain distinct and missing ratings never become zero ratings',()=>{
  const log=[
    entry('protocol',5,[],{secs:88,srpe:5}),entry('team0',5,[],{kind:'team',secs:88,srpe:0}),
    entry('team6',4,[],{kind:'team',secs:90,srpe:6}),entry('field',4,[],{kind:'field',secs:600}),
    entry('archived',3,undefined,{kind:null,secs:undefined}),entry('zero',3,[],{secs:0,srpe:5}),
    entry('trial',5,[],{kind:'exercise',secs:1000,srpe:10}),entry('test',5,[],{kind:'test',secs:300}),entry('future',6,[],{secs:5000,srpe:10})
  ];
  const result=summarize(log),week=result.weeks[7];assert.equal(result.weeks.length,8);assert.equal(week.count,6);
  assert.equal(week.minutes,14.433333);assert.equal(week.missingDuration,1);assert.equal(week.au,14);assert.equal(week.unrated,2);
  assert.equal(History.sessionAU(log[0]),5);assert.equal(History.sessionAU(log[1]),0);
});
test('local Monday boundaries survive both daylight-saving transitions and include exactly now',()=>{
  const saved=process.env.TZ;process.env.TZ='Europe/Zagreb';
  try{
    for(const day of ['2026-03-30','2026-10-26']){
      const end=new Date(day+'T00:05:00').getTime(),start=new Date(day+'T00:00:00').getTime();
      const log=[entry('previous-week',3,[],{at:start-1}),entry('current-week',3,[],{at:start}),entry('exact-now',3,[],{at:end}),entry('future',3,[],{at:end+1})];
      const result=summarize(log,{now:end});assert.equal(result.weeks[7].start,start);assert.equal(result.weeks[7].count,2);assert.equal(result.weeks[6].count,1);
      result.weeks.forEach(w=>{const d=new Date(w.start);assert.equal(d.getDay(),1);assert.equal(d.getHours(),0);});
      assert.equal((result.weeks[7].start-result.weeks[6].start)/3600000,day.includes('03-30')?167:169);
    }
  }finally{if(saved===undefined)delete process.env.TZ;else process.env.TZ=saved;}
});
test('history edits and deletion recompute evidence rather than retaining cached achievements',()=>{
  const older=entry('older',2,[item({reps:3})]),previous=entry('previous',3,[item({reps:4})]),current=entry('current',5,[item({reps:5})]);
  assert.equal(summarize([current,previous,older]).comparisons[0].current,5);
  const edited=History.edit(current,{items:[{index:0,reps:6}]});assert.equal(edited.ok,true);
  assert.equal(summarize([edited.entry,previous,older]).comparisons[0].current,6);
  const afterDelete=summarize([previous,older]).comparisons[0];assert.equal(afterDelete.currentSessionId,'previous');assert.deepEqual([afterDelete.current,afterDelete.previous],[4,3]);
  assert.equal(summarize([older]).comparisons.length,0);
});
test('duplicate stable identities count once and a future latest revision cannot resurrect an older copy',()=>{
  const original=entry('same',3,[item({reps:4})]),edited=entry('same',5,[item({reps:5})],{editedAt:at(5)}),baseline=entry('older',2,[item({reps:3})]);
  const result=summarize([original,edited,baseline]);assert.equal(result.weeks[7].count,2);assert.equal(result.comparisons[0].current,5);
  const future={...edited,at:at(6),editedAt:at(5)+1};assert.equal(summarize([original,future,baseline]).weeks[7].count,1);
});
test('outputs are deeply immutable and detached, and invalid/empty input creates no invented comparisons',()=>{
  const log=freeze([entry('current',5,[item({reps:5})]),entry('previous',3,[item({reps:4})])]),library=freeze(JSON.parse(JSON.stringify(exercises))),before=JSON.stringify({log,library});
  const result=summarize(log,{exercises:library});assert.equal(JSON.stringify({log,library}),before);assert.ok(Object.isFrozen(result)&&Object.isFrozen(result.comparisons[0])&&Object.isFrozen(result.weeks[0]));
  assert.throws(()=>{result.weeks[0].count=99;},TypeError);
  const empty=summarize([]);assert.equal(empty.weeks.length,8);assert.ok(empty.weeks.every(w=>w.count===0&&w.minutes===0&&w.missingDuration===0&&w.au===0&&w.unrated===0));
  assert.deepEqual(Model.summarize({log:[],now:'2026-11-05'}),{comparisons:[],weeks:[]});
  assert.deepEqual(Model.summarize(),{comparisons:[],weeks:[]});
});
test('missing duration remains distinct from known zero and unknown AU is not necessarily a missing rating',()=>{
  const result=summarize([
    entry('unknown',5,[],{secs:undefined,srpe:5}),entry('null',5,[],{secs:null}),
    entry('invalid',5,[],{secs:-1}),entry('zero',5,[],{secs:0,srpe:5})
  ]),week=result.weeks[7];
  assert.equal(week.count,4);assert.equal(week.missingDuration,3);assert.equal(week.minutes,0);assert.equal(week.unrated,3);assert.equal(week.au,0);
});
test('editing a known imported row preserves unknown sibling reps through form, transaction and insight',()=>{
  const current=entry('current',5,[item({sets:3,setsDone:3,repsList:[5,3,null],kgList:[20,20,20],rirList:[2,null,0]})]);
  const field={value:'6',defaultValue:'5',dataset:{historyItem:'0',historySet:'0',historyField:'reps'},getAttribute:()=> '5'};
  const parsed=HistoryUI.readEdit({querySelectorAll:()=>[field]},current);assert.equal(parsed.ok,true);assert.deepEqual(parsed.patch.items[0].repsList,[6,3,null]);
  const edited=History.edit(current,parsed.patch);assert.equal(edited.ok,true);assert.deepEqual(edited.entry.items[0].repsList,[6,3,null]);
  assert.equal(edited.entry.items[0].historyRepsUnknown,undefined);assert.deepEqual(History.recordedRows(edited.entry.items[0]).map(r=>r.reps),[6,3,null]);
  assert.deepEqual(edited.entry.items[0].rirList,[2,null,0]);assert.equal(History.repetitionTotal(edited.entry.items[0]),null);
  const insight=summarize([edited.entry,entry('previous',3,[item({reps:4})])]).comparisons[0];assert.equal(insight.current,6);assert.equal(insight.previous,4);
  assert.deepEqual(current.items[0].repsList,[5,3,null]);
});
test('clearing a known per-set rep creates unknown, while invalid strings and fractional/negative reps remain refused',()=>{
  const current=entry('current',5,[item({repsList:[5,3]})]);
  const input=value=>({value,defaultValue:'5',dataset:{historyItem:'0',historySet:'0',historyField:'reps'},getAttribute:()=> '5'});
  const cleared=HistoryUI.readEdit({querySelectorAll:()=>[input('')]},current);assert.equal(cleared.ok,true);assert.deepEqual(cleared.patch.items[0].repsList,[null,3]);
  const saved=History.edit(current,cleared.patch);assert.equal(saved.ok,true);assert.deepEqual(History.recordedRows(saved.entry.items[0]).map(r=>r.reps),[null,3]);
  for(const value of ['abc','6x','1,5','-1'])assert.equal(HistoryUI.readEdit({querySelectorAll:()=>[input(value)]},current).ok,false,value);
  for(const values of [[6,'3'],[6,1.5],[6,-1],[6,Infinity]])assert.equal(History.edit(current,{items:[{index:0,repsList:values}]}).ok,false);
});
