'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
function section(start,end){const a=source.indexOf(start),b=source.indexOf(end,a);assert.ok(a>=0&&b>a,start);return source.slice(a,b);}
const ctx={};vm.createContext(ctx);
vm.runInContext(section('function sessionShare(l){','// does log entry l fill plan slot s')+';globalThis.sessionShare=sessionShare;globalThis.planCounts=planCounts;',ctx);
const item=(sets,extra={})=>({exId:'x',measure:'sets',sets,reps:5,done:true,...extra});
test('a protocol session fills a plan day from half of its work sets or when counted on the done screen',()=>{
  const entry=items=>({kind:'protocol',refId:'p',at:1,items});
  assert.equal(ctx.sessionShare(entry([item(4,{setsDone:1}),item(4,{skipped:true,setsDone:0}),item(7,{setsDone:0})])),1/15);
  assert.equal(ctx.planCounts(entry([item(15,{setsDone:1})])),false,'1 of 15 sets is partial');
  assert.equal(ctx.planCounts({...entry([item(15,{setsDone:1})]),countsAsDone:true}),true,'"Računaj kao odrađeno"');
  assert.equal(ctx.planCounts(entry([item(4,{setsDone:2})])),true,'half counts');
  assert.equal(ctx.planCounts(entry([item(4),item(4,{done:false,lastReps:3})])),true,'"Nisam uspio" attempted every set');
  assert.equal(ctx.sessionShare(entry([item(2,{warmup:true,setsDone:0}),item(4,{setsDone:3})])),3/4,'warm-ups are not work sets');
  assert.equal(ctx.sessionShare(entry([{exId:'x',sets:4,reps:5,kg:100}])),1,'a 1.2 item without done did its planned sets');
  assert.equal(ctx.sessionShare(entry([item(4,{historySetsUnknown:true}),item(4,{historySetsUnknown:true})])),1,'unknown set counts are left out, not zero');
  assert.equal(ctx.sessionShare(entry([item(4,{historySetsUnknown:true}),item(4,{setsDone:1})])),1/4);
  for(const other of [{kind:'field',refId:'f',at:1},{kind:'team',at:1},{kind:'protocol',refId:'p',at:1},entry([{exId:'x'}])])assert.equal(ctx.planCounts(other),true);
});
test('the week, strip, day sheet, history and done screen read the same rule',()=>{
  const week=section('function weekStatus(ws, plan){','\n}');
  assert.match(week,/slotHit\(s, l\) && planCounts\(l\) &&/);
  assert.match(week,/s\.partial = log\[k\]/);
  assert.match(section('function weekHtml(){','\n}'),/planCounts\(l\) \? trainedDays : partDays/);
  assert.match(source,/x\.partial \? 'djelomično'/);
  assert.match(source,/partial:!planCounts\(l\)/);
  const month=section('function monthItem(t, s, ws, st, editable){','\n}');
  assert.match(month,/s\.partial \? 'Djelomično'/,'the planner slot says djelomično too');
  assert.match(source,/!slots\.some\(s=>s\.l===l \|\| s\.partial===l\)/,'the partial log is not listed again as done');
  assert.match(source,/\(planCounts\(l\)\?'Odrađeno':'Djelomično'\)\+' · dnevnik</);
  assert.match(source,/'Odrađeno '\+Math\.round\(share \* 100\)\+' % radnih serija\. Za dan plana treba barem pola\.'/);
  assert.match(section('function sessionEntry(){','\n}'),/if \(P\.countAsDone === true\) entry\.countsAsDone = true;/);
  assert.match(source,/countAsDone:P\.countAsDone === true,/,'the choice survives a reload of the done screen');
  assert.match(fs.readFileSync(path.join(__dirname,'../history.js'),'utf8'),/entry\.partial\?' · djelomično':''/);
});
test('1.25.0: calm breathing is no work set, so a mixed training fills a plan day as if the breathing were absent (review F5)',()=>{
  const entry=items=>({kind:'protocol',refId:'p',at:1,items});
  const calm={exId:'sporo-disanje',measure:'time',sec:600,sets:1,reps:1,done:true,setsDone:1,breath:{kind:'calm',min:10}};
  // 9 gym sets planned, 4 done, plus the breathing: 4/9, not 5/10
  assert.equal(ctx.sessionShare(entry([item(9,{setsDone:4}),calm])),4/9);assert.equal(ctx.planCounts(entry([item(9,{setsDone:4}),calm])),false);
  assert.equal(ctx.sessionShare(entry([item(9,{setsDone:4})])),ctx.sessionShare(entry([item(9,{setsDone:4}),calm])));
  // the breath-hold sprints are work (no calm breath on their item)
  assert.equal(ctx.sessionShare(entry([item(2,{setsDone:1}),{exId:'sprintevi-bez-daha',measure:'sets',sets:2,reps:6,done:true,setsDone:2}])),3/4);
});
