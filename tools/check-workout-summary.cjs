'use strict';
// Exercise the actual compact reader against immutable HistoryModel rows, rather
// than replacing history with a convenient preformatted display fixture.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const WorkoutModel=require('../workout-model.js');
const source=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
const from=source.indexOf('function workoutPreviousCompact(item)'),to=source.indexOf('function workoutCommitItems(',from);
assert.ok(from>=0&&to>from);
const now=new Date('2026-11-05T12:00:00+01:00').getTime();
const DateAtNow=class extends Date {static now(){return now;}};
const item=extra=>({exId:'press',measure:'sets',sets:3,reps:10,kg:80,sides:false,done:true,setsDone:3,...extra});
const entry=(row,extra={})=>({historyId:'latest',kind:'protocol',name:'Spremljeni trening',at:now-3600000,items:[row],...extra});
function compact(current,logs,kind='bar'){
  const before=JSON.stringify(logs),context={WorkoutModel,S:{log:logs},Date:DateAtNow,
    startLoadDescription:()=>({kind}),esc:value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))};
  vm.createContext(context);vm.runInContext(source.slice(from,to),context);
  const html=context.workoutPreviousCompact(current);
  assert.equal(JSON.stringify(logs),before,'rendering must not alter the actual record');
  return html;
}
test('ordinary recorded sets show every actual quantity after the weight, without a date or scalar replacement',()=>{
  const recorded=item({reps:99,repsList:[8,7,6],kgList:[20,20,20]});
  const html=compact(item(),[entry(recorded)]);
  assert.match(html,/Prethodno 20 kg · 8 \/ 7 \/ 6 pon\./);assert.doesNotMatch(html,/99|5\. 11\.|2026/);
  const varying=compact(item(),[entry({...recorded,kgList:[20,25,30]})]);
  assert.match(varying,/20 \/ 25 \/ 30 kg · 8 \/ 7 \/ 6 pon\./);
});
test('explicit unknown weights and repetitions remain gaps, while recorded zero remains zero',()=>{
  const recorded=item({reps:99,kg:99,repsList:[5,null,3],kgList:[20,null,0]});
  const html=compact(item(),[entry(recorded)]);
  assert.match(html,/20 \/ — \/ 0 kg/);assert.match(html,/5 \/ — \/ 3 pon\./);assert.doesNotMatch(html,/99/);
});
test('partially performed bilateral rows retain their own dose and the known one-of-two side count',()=>{
  const recorded=item({measure:'time',sides:true,sets:2,setsDone:2,secList:[20,12],kgList:[0,2],sideCounts:[2,1]});
  const html=compact(recorded,[entry(recorded)]);
  assert.match(html,/20\s*s/);assert.match(html,/12\s*s/);assert.match(html,/2\s*kg/);assert.match(html,/1\s*\/\s*2/);
  assert.doesNotMatch(html,/Prethodno 0 kg · 20 s po strani<\/span>/);
});
test('unknown bilateral sides are visible and do not cause a real recorded row to disappear',()=>{
  const recorded=item({measure:'time',sides:true,sets:2,setsDone:2,secList:[20,12],kgList:[0,2],sideCounts:[2,null]});
  const html=compact(recorded,[entry(recorded)]);
  assert.match(html,/12\s*s/);assert.match(html,/stran[^<]*(?:nisu|nepoznat)|(?:nisu|nepoznat)[^<]*stran/);
});
test('an earlier one-sided dose is labelled from its recorded sides rather than today’s bilateral plan',()=>{
  const recorded=item({sides:false,sets:1,setsDone:1,repsList:[6],kgList:[10],sideCounts:[1]});
  const html=compact(item({sides:true}),[entry(recorded)]);
  assert.match(html,/10\s*kg/);assert.match(html,/6\s*pon\./);assert.doesNotMatch(html,/6 pon\. po strani/);
});
test('a failed last attempted set shows its actual zero and is distinguished from a completed set',()=>{
  const recorded=item({done:false,lastReps:0,sets:2,setsDone:2,repsList:[5,3],kgList:[20,30]});
  const html=compact(recorded,[entry(recorded)]);
  assert.match(html,/5\s*pon\./);assert.match(html,/0\s*pon\./);assert.match(html,/nedovršeno/);assert.doesNotMatch(html,/3\s*pon\./);
});
test('known skipped work is not called unknown and a different latest measure never borrows older reps',()=>{
  const skipped=compact(item(),[entry(item({skipped:true,setsDone:0}))]);
  assert.match(skipped,/preskočen/i);assert.doesNotMatch(skipped,/nisu poznate/);
  const latest=entry(item({measure:'time',sets:1,setsDone:1,sec:12}));
  const older=entry(item({reps:8}),{historyId:'older',at:now-7200000});
  const changed=compact(item(),[latest,older]);
  assert.match(changed,/druga vrsta doze/i);assert.doesNotMatch(changed,/8 pon\./);
});
test('the actual protocol writer preserves RIR, SIR and countdown targets during a title-only edit',async()=>{
  const begin=source.indexOf('  savePr: async d => {'),end=source.indexOf('  delPr: async',begin);
  assert.ok(begin>=0&&end>begin);
  const rows=[item({targetRir:0}),item({targetRir:2,repSetSec:40}),item({measure:'time',sec:30,targetSir:0}),item({measure:'time',sec:30,targetSir:2})];
  const clone=value=>JSON.parse(JSON.stringify(value)),original={id:'p',name:'Izvorni naziv',items:clone(rows)};
  const context={S:{pr:{p:clone(original)},draft:{...clone(original),name:'Novi naziv'},stack:[{v:'pr',id:'p'},{v:'build',id:'p'}]},
    clone,PlayerDose:require('../player-dose.js'),normGroups:rows=>rows,doseSig:()=> 'same-recorded-dose',PROG_STATE:[],Date,
    save:async(coll,id,body)=>{context.written={coll,id,body:clone(body)};return true;},planSaved(){},render(){},toast(){}};
  context.top=()=>context.S.stack.at(-1);context.S.draft.items.forEach(row=>{row._d0='same-recorded-dose';});
  const commit=source.slice(source.indexOf('function builderCommitSection(){'),source.indexOf('// supersets stay well formed'));
  const timer=source.slice(source.indexOf('function repSetSeconds('),source.indexOf('function manualSetEstimate('));
  vm.createContext(context);vm.runInContext(timer+commit+'\nglobalThis.A={'+source.slice(begin,end)+'}',context);
  await context.A.savePr({});
  assert.equal(context.written.coll,'protocols');assert.equal(context.written.id,'p');assert.equal(context.written.body.name,'Novi naziv');
  assert.deepEqual(context.written.body.items.map(row=>[row.targetRir??null,row.targetSir??null]),[[0,null],[2,null],[null,0],[null,2]]);
  assert.deepEqual(context.S.pr.p.items.map(row=>[row.targetRir??null,row.targetSir??null]),[[0,null],[2,null],[null,0],[null,2]]);
  assert.deepEqual(context.written.body.items.map(row=>row.repSetSec??null),[null,40,null,null]);
});
