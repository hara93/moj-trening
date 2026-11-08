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
  for(const other of [{kind:'field',refId:'f',at:1},{kind:'team',at:1},{kind:'protocol',refId:'p',at:1},entry([{exId:'x'}])])assert.equal(ctx.planCounts(other),true);
});
test('the week, strip, day sheet, history and done screen read the same rule',()=>{
  const week=section('function weekStatus(ws, plan){','\n}');
  assert.match(week,/slotHit\(s, l\) && planCounts\(l\) &&/);
  assert.match(week,/s\.partial = log\[k\]/);
  assert.match(section('function weekHtml(){','\n}'),/planCounts\(l\) \? trainedDays : partDays/);
  assert.match(source,/x\.partial \? 'djelomično'/);
  assert.match(source,/partial:!planCounts\(l\)/);
  assert.match(section('function sessionEntry(){','\n}'),/if \(P\.countAsDone === true\) entry\.countsAsDone = true;/);
  assert.match(source,/countAsDone:P\.countAsDone === true,/,'the choice survives a reload of the done screen');
  assert.match(fs.readFileSync(path.join(__dirname,'../history.js'),'utf8'),/entry\.partial\?' · Djelomično':''/);
});
