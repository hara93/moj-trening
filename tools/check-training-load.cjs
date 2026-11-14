'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const Load=require('../training-load.js'),H=require('../history-model.js'),Team=require('../team.js'),M=require('../muscle-work.js'),UI=require('../history.js');
const now=new Date('2026-11-05T12:00:00').getTime(),at=day=>new Date(day+'T10:00:00').getTime();
const item=(extra={})=>({exId:'press',measure:'sets',sets:2,reps:8,kg:20,sides:false,...extra});
const actual=(extra={})=>item({done:true,setsDone:2,...extra});
const entry=(id,extra={})=>({historyId:id,kind:'protocol',refId:'p',name:'Snaga',at:at('2026-11-05'),secs:300,srpe:5,items:[actual()],...extra});
const summary=(log,extra={})=>Load.summary({log,now,...extra});
const expectation=(log,extra={})=>Load.expectation({entry:{kind:'protocol',refId:'p',items:[item()]},log,now,...extra});
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};

test('one AU rule uses exact seconds for every session kind and keeps explicit zero separate from missing',()=>{
  for(const kind of ['protocol','field','team',undefined])for(const secs of [0,5,60,88,89,90,300,749,300.125]){
    const e={kind,secs,srpe:7},expected=Math.round(7*secs/60*1e6)/1e6;
    assert.equal(Load.sessionAU(e),expected);assert.equal(H.sessionAU(e),expected);assert.equal(Team.sessionAU(e),expected);
    assert.equal(Load.sessionAU({...e,srpe:0}),0);
  }
  for(const bad of [{},{srpe:0},{secs:300},{srpe:null,secs:300},{srpe:5,secs:null},{srpe:5,secs:-1},{srpe:11,secs:300},{srpe:-1,secs:300},{srpe:'0',secs:300},{srpe:0,secs:'300'},{srpe:5,secs:Infinity}])assert.equal(Load.sessionAU(bad),null,JSON.stringify(bad));
  assert.equal(Load.sessionAU({srpe:2.5,secs:300}),12.5,'a recorded numeric fractional rating is not silently dropped');
});
test('history edits can save zero effort, clear it to unknown and recalculate the exact stored AU',()=>{
  const original=entry('e',{secs:88,load2:{v:'LM1',B:90,band:27,au:999}});
  const zero=H.edit(original,{srpe:0});assert.equal(zero.ok,true);assert.equal(zero.entry.srpe,0);assert.equal(zero.entry.load2.au,0);
  const changed=H.edit(original,{srpe:7});assert.equal(changed.entry.load2.au,10.266667);
  const cleared=H.edit(zero.entry,{srpe:null});assert.equal(cleared.entry.srpe,undefined);assert.equal(cleared.entry.load2.au,undefined);
  const field={value:'0',defaultValue:'5',dataset:{historyMeta:'srpe'},getAttribute:()=> '5'};
  assert.deepEqual(UI.readEdit({querySelectorAll:()=>[field]},original),{ok:true,patch:{srpe:0}});
});
test('current seven days contain saved protocol, field, team and match effort without LM1 or muscle-score mixing',()=>{
  const log=[entry('gym',{srpe:7,secs:180}),entry('field',{kind:'field',srpe:5,secs:600}),entry('team',{kind:'team',teamType:'training',srpe:3,secs:3600}),entry('match',{kind:'team',teamType:'match',srpe:0,secs:4800})];
  log.forEach(e=>{e.load2={v:'LM1',B:999,au:999};});
  const current=summary(log).effort.current;
  assert.equal(current.sessions,4);assert.equal(current.rated,4);assert.equal(current.totalAU,251);assert.equal(current.knownAU,251);assert.equal(current.knownMinutes,153);assert.equal(current.complete,true);
  assert.deepEqual(current.byKind.map(x=>x.kind).sort(),['field','match','protocol','team']);
});
test('missing ratings and duration withhold the total while preserving known effort as a labelled subtotal',()=>{
  const log=[entry('known',{secs:88,srpe:7}),entry('unrated',{srpe:undefined}),entry('no-time',{secs:undefined}),entry('both',{secs:null,srpe:null}),entry('cached-only',{secs:undefined,srpe:undefined,load2:{au:999}})];
  const current=summary(log).effort.current;
  assert.equal(current.sessions,5);assert.equal(current.rated,1);assert.equal(current.missingAU,4);assert.equal(current.missingRpe,3);assert.equal(current.missingDuration,3);
  assert.equal(current.knownAU,10.266667);assert.equal(current.totalAU,null);assert.equal(current.complete,false);
});
test('future, independent exercise trials and standalone tests do not affect current or baseline totals',()=>{
  const log=[entry('known'),entry('trial',{kind:'exercise',srpe:10}),entry('test',{kind:'test',srpe:10}),entry('future',{at:now+1,srpe:10}),entry('unknown-kind',{kind:'other',srpe:10})];
  assert.equal(summary(log).effort.current.sessions,1);assert.equal(summary(log).effort.current.totalAU,25);
});
test('duplicate IDs choose the latest edit and a newer future revision does not resurrect old history',()=>{
  const original=entry('same'),edited=entry('same',{srpe:7,editedAt:now});
  assert.equal(summary([original,edited]).effort.current.totalAU,35);
  assert.equal(summary([original,{...edited,at:now+1}]).effort.current.sessions,0);
  assert.equal(summary([original,{...edited,kind:'exercise'}]).effort.current.sessions,0,'excluded newer revisions do not revive an older training');
});
test('baseline is the preceding 28 local dates and never averages incomplete reported effort',()=>{
  const log=[entry('now'),entry('past1',{at:at('2026-10-29'),secs:600,srpe:5}),entry('past2',{at:at('2026-10-02'),secs:600,srpe:7}),entry('too-old',{at:at('2026-10-01'),secs:600,srpe:10})];
  const result=summary(log),base=result.effort.baseline;
  assert.equal(new Date(result.range.from).getDate(),30);assert.equal(new Date(base.from).getDate(),2);assert.equal(base.to,result.range.from);
  assert.equal(base.sessions,2);assert.equal(base.knownAU,120);assert.equal(base.weeklyAverageAU,30);assert.equal(base.activeWeeks,2);assert.equal(base.weeks.length,4);
  const partial=summary(log.concat(entry('past-missing',{at:at('2026-10-20'),srpe:undefined}))).effort.baseline;
  assert.equal(partial.totalAU,null);assert.equal(partial.weeklyAverageAU,null);assert.equal(partial.knownAU,120);
});
test('selectable dates share one range for effort, muscle sets and contiguous chart bins',()=>{
  const exercise={id:'press',name:'Potisak',cat:'Snaga',muscles:{prime:['front_chest'],sec:['back_triceps']}};
  const muscleWork=[M.pack(M.completedItem(exercise,actual()))];
  const dates=['2026-11-05','2026-10-30','2026-10-29','2026-10-07','2026-10-06','2026-08-08','2026-08-07','2025-01-02'];
  const log=dates.map(date=>entry(date,{at:at(date),muscleWork})).concat([
    entry('future',{at:now+1,muscleWork}),entry('trial',{at:at('2020-01-01'),kind:'exercise',muscleWork})
  ]);
  for(const [key,start,sessions] of [['7d','2026-10-30',2],['1m','2026-10-07',4],['3m','2026-08-08',6],['all','2025-01-02',8]]){
    const {range,effort,muscles}=summary(log,{period:key}),bins=effort.days;
    assert.equal(range.period,key);assert.equal(range.from,new Date(start+'T00:00:00').getTime());
    assert.equal(Load.periodStart(now,key),key==='all'?null:range.from);
    assert.equal(range.to,new Date('2026-11-06T00:00:00').getTime());
    assert.equal(effort.current.sessions,sessions);assert.equal(effort.current.totalAU,sessions*25);
    assert.equal(muscles.recordedSets,sessions*2);assert.equal(muscles.groups.find(group=>group.id==='triceps').equivalent,sessions);
    assert.ok(bins.length<=7);assert.equal(bins[0].date,start);assert.equal(bins[bins.length-1].endDate,'2026-11-05');
    assert.equal(bins[0].from,range.from);assert.equal(bins[bins.length-1].to,range.to);
    assert.equal(bins.reduce((sum,bin)=>sum+bin.sessions,0),sessions);
    assert.equal(bins.reduce((sum,bin)=>sum+bin.knownAU,0),effort.current.knownAU);
    bins.slice(1).forEach((bin,i)=>assert.equal(bin.from,bins[i].to));
    const widths=bins.map(bin=>(Date.parse(bin.endDate)-Date.parse(bin.date))/86400000+1);
    assert.ok(Math.max(...widths)-Math.min(...widths)<=1);
    assert.equal(effort.baseline!==null,key==='7d');
  }
  assert.deepEqual(summary(log,{period:'invalid'}),summary(log));
  assert.equal(Load.periodStart(now,'invalid'),Load.periodStart(now,'7d'));
  const empty=summary([],{period:'all'});
  assert.equal(empty.effort.days.length,1);assert.equal(empty.effort.days[0].date,'2026-11-05');
  assert.equal(empty.effort.current.totalAU,null);
});
test('bin workouts use the same local boundaries, eligible rows and unknowns as the chart',()=>{
  const before=new Date('2026-10-10T23:59:59').getTime(), boundary=new Date('2026-10-11T00:00:00').getTime();
  const zero=entry('zero',{at:before,srpe:0,secs:88}),unknown=entry('unknown',{at:boundary,srpe:undefined,secs:undefined,load2:{au:99}});
  const {effort:{days}}=summary([unknown,zero,entry('trial',{at:before,kind:'exercise'}),entry('future',{at:now+1})],{period:'1m'});
  assert.deepEqual(days[0].workouts,[{id:'zero',name:'Snaga',kind:'protocol',label:'Trening',at:before,secs:88,srpe:0,au:0}]);
  assert.deepEqual(days[1].workouts,[{id:'unknown',name:'Snaga',kind:'protocol',label:'Trening',at:boundary,secs:null,srpe:null,au:null}]);
  assert.equal(days.reduce((count,day)=>count+day.workouts.length,0),2);
  assert.ok(Object.isFrozen(days[0].workouts[0]));
  assert.equal(Object.isFrozen(zero),false,'view projection does not freeze the mutable history record');
});
test('no history and legacy missing data remain unknown rather than complete zero load',()=>{
  const empty=summary([]);assert.equal(empty.effort.current.totalAU,null);assert.equal(empty.effort.baseline.weeklyAverageAU,null);assert.equal(empty.effort.days.length,7);
  const old=summary([entry('old',{kind:null,secs:undefined,srpe:undefined,items:undefined})]);assert.equal(old.effort.current.sessions,1);assert.equal(old.effort.current.totalAU,null);assert.equal(old.muscles.coverage.missingSessions,1);
  const zero=summary([entry('zero',{secs:0,srpe:0})]);assert.equal(zero.effort.current.totalAU,0);assert.equal(zero.effort.current.complete,true);
});
test('muscle work comes only from saved attribution with 1/0.5 roles and unique performed set counts',()=>{
  const exercise={id:'press',name:'Potisak',cat:'Snaga',muscles:{prime:['front_chest'],sec:['back_triceps']}};
  const row=actual({sets:3,setsDone:3,rirList:[0,0,0],kg:80}),snapshot=M.pack(M.completedItem(exercise,row));
  const recorded=entry('muscles',{items:[row],muscleWork:[snapshot]});
  const result=summary([recorded,entry('team',{kind:'team',teamType:'match',muscleWork:[snapshot]}),entry('future',{at:now+1,muscleWork:[snapshot]})]);
  assert.equal(result.muscles.recordedSets,3);assert.equal(result.muscles.groups.find(x=>x.id==='chest').direct,3);assert.equal(result.muscles.groups.find(x=>x.id==='triceps').secondary,3);assert.equal(result.muscles.groups.find(x=>x.id==='triceps').equivalent,1.5);
  assert.equal(result.muscles.complete,true);assert.equal(result.muscles.coveredGroups,2);
  const unknown=summary([recorded,entry('missing',{muscleWork:undefined})]);assert.equal(unknown.muscles.complete,false);assert.equal(unknown.muscles.recordedSets,3);
});
test('calendar windows preserve local dates across spring and autumn clock changes',()=>{
  const saved=process.env.TZ;process.env.TZ='Europe/Zagreb';
  try{for(const [day,hours] of [['2026-03-30',167],['2026-10-26',169]]){
    const result=summary([],{now:new Date(day+'T12:00:00').getTime()});
    assert.equal((result.range.to-result.range.from)/3600000,hours);
    result.effort.days.forEach(d=>assert.equal(new Date(d.from).getHours(),0));
  }}finally{if(saved===undefined)delete process.env.TZ;else process.env.TZ=saved;}
});
test('expected effort is an observed range from at least two same-reference comparable actual doses',()=>{
  const log=[entry('one',{at:at('2026-11-04'),secs:300,srpe:4}),entry('two',{at:at('2026-11-03'),secs:360,srpe:5})];
  assert.equal(expectation(log.slice(0,1)).status,'insufficient');
  const result=expectation(log);assert.equal(result.status,'available');assert.equal(result.sampleCount,2);assert.equal(result.min,20);assert.equal(result.max,30);assert.equal(result.source,'reported-history');assert.deepEqual(result.samples.map(x=>x.id),['one','two']);
  assert.match(result.reason,/nije jamstvo/);
});
test('expected range cannot borrow a different ref, load, measure, side, failed work, missing rating or a future session',()=>{
  const base=entry('base',{at:at('2026-11-04')});
  const variations=[{refId:'other'},{items:[actual({kg:30})]},{items:[actual({measure:'time',sec:8})]},{items:[actual({sides:true})]},{items:[actual({done:false,lastReps:4})]},{items:[actual({kgList:[20,null]})]},{srpe:undefined},{at:now+1},{kind:'exercise'}];
  for(const change of variations){const result=expectation([base,entry('other',{at:at('2026-11-03'),...change})]);assert.equal(result.status,'insufficient',JSON.stringify(change));assert.equal(result.sampleCount,1);}
  assert.equal(expectation([base],{entry:{kind:'protocol',refId:'p',items:[item({kgList:[20,null]})]}}).status,'unavailable');
  assert.equal(expectation([base],{entry:{kind:'team',teamType:'training',secs:300}}).status,'unavailable');
});
test('field expected range needs the same saved complete external dose, not current MAS guesses',()=>{
  const load={m:1500,hsr:100,spr:0,min:5},target={kind:'field',refId:'field',load},log=[entry('f1',{kind:'field',refId:'field',at:at('2026-11-03'),load}),entry('f2',{kind:'field',refId:'field',at:at('2026-11-04'),load})];
  assert.equal(expectation(log,{entry:target}).sampleCount,2);
  assert.equal(expectation(log,{entry:{...target,load:{m:1500,min:5}}}).status,'unavailable');
  assert.equal(expectation(log,{entry:{...target,load:{m:100,hsr:200,spr:0,min:5}}}).status,'unavailable');
});
test('explicit zero effort contributes a real zero endpoint to a personal range',()=>{
  const log=[entry('one',{at:at('2026-11-04'),srpe:0}),entry('two',{at:at('2026-11-03'),srpe:0})];
  const result=expectation(log);assert.equal(result.status,'available');assert.equal(result.min,0);assert.equal(result.max,0);
});
test('a historical target cannot count itself as a second independent comparable sample',()=>{
  const target=entry('one',{at:at('2026-11-04')}),other=entry('two',{at:at('2026-11-03')});
  const result=expectation([target,other],{entry:target});
  assert.equal(result.status,'insufficient');assert.equal(result.sampleCount,1);assert.equal(result.samples[0].id,'two');
});
test('history AU always follows raw rating and time, never a cached model AU or a false missing zero',()=>{
  const details=e=>UI.render({mode:'detail',entry:e});
  const cached=entry('cached',{srpe:undefined,load2:{v:'LM1',B:50,band:15,au:999}});
  assert.doesNotMatch(details(cached),/999|Napor × trajanje/);
  assert.doesNotMatch(details({...cached,srpe:0,secs:undefined}),/Napor × trajanje/);
  const known=details({...cached,srpe:0});assert.match(known,/Napor × trajanje/);assert.doesNotMatch(known,/999/);
  assert.match(known,/sekunde ÷ 60/);
});
test('models remain immutable and edits/deletions are reflected without writing or retaining cached summaries',()=>{
  const log=freeze([entry('one',{at:at('2026-11-04')}),entry('two',{at:at('2026-11-03')})]),before=JSON.stringify(log),model=summary(log),range=expectation(log);
  assert.equal(JSON.stringify(log),before);assert.ok(Object.isFrozen(model)&&Object.isFrozen(model.effort.current)&&Object.isFrozen(range.samples[0]));
  assert.equal(summary(log.slice(0,1)).effort.current.sessions,1);assert.equal(expectation(log.slice(0,1)).status,'insufficient');
  assert.equal(Load.summary({now:'bad'}).status,'invalid');assert.equal(Load.expectation({now:'bad'}).status,'unavailable');
});
test('1.25.0: calm breathing carries no j.n. and is no session; a mixed session scores as if the breathing were absent',()=>{
  const mixed=entry('mixed',{secs:900,calmSecs:300,srpe:6});
  assert.equal(Load.sessionAU(mixed),60,'(900 − 300) s × 6 / 60');assert.equal(H.sessionAU(mixed),60);
  assert.equal(Load.sessionAU(entry('plain',{secs:600,srpe:6})),60,'the same session without breathing');
  const calm=entry('calm',{secs:600,calmSecs:600,calmOnly:true,srpe:undefined,items:[actual({exId:'sporo-disanje',measure:'time',sec:600,breath:{kind:'calm',min:10}})]});
  assert.equal(Load.sessionAU(calm),0);
  const base=summary([entry('a'),entry('b',{at:at('2026-11-04')})]),withCalm=summary([entry('a'),entry('b',{at:at('2026-11-04')}),calm]);
  assert.deepEqual(withCalm,base,'a calm-only entry changes no total, count, minute or missing rating');
  const minutes=summary([mixed]).effort.current;
  assert.equal(minutes.knownMinutes,10,'the session minutes leave out the breathing');assert.equal(minutes.totalAU,60);
  // stored data of existing users: an entry without the new fields keeps its exact AU
  for(const e of [entry('x',{secs:749,srpe:7}),{kind:'team',secs:5400,srpe:6,at:at('2026-11-05')}])assert.equal(Load.sessionAU(e),Math.round(e.srpe*e.secs/60*1e6)/1e6);
});
