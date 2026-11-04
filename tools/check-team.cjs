'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {test}=require('node:test');
const T=require('../team.js'),H=require('../history-model.js'),M=require('../muscle-work.js');
global.HistoryModel=H;global.MuscleWork=M;const UI=require('../history.js');
const now=new Date('2026-11-04T12:00:00+01:00').getTime();
const values=()=>({name:'Klub',teamType:'training',at:now-3600000,secs:4830,srpe:7,teamContent:['technical','sprints'],notes:'Podloga je bila mokra.'});
const create=v=>T.create({...values(),...v},{historyId:'hteam_test',now});
const plain=x=>JSON.parse(JSON.stringify(x));
const input=(value,initial,dataset={})=>({value,defaultValue:initial,dataset,getAttribute:k=>k==='data-history-initial'?initial:null});
function form(fields,extra={}){return {querySelector:id=>extra[id]||null,querySelectorAll:selector=>selector==='[name="team-content"]'?(extra.content||[]):fields};}

test('manual diary stores only reported duration, effort and content with no plan or muscle evidence',()=>{
  const before=values(),result=T.create(before,{historyId:'hteam_test',now});assert.equal(result.ok,true);
  assert.equal(result.entry.kind,'team');assert.equal(result.entry.source,'manual');assert.equal(result.entry.secs,4830);
  assert.equal(T.sessionAU(result.entry),563.5);assert.deepEqual(before,values());
  for(const key of ['refId','items','muscleWork','load','load2'])assert.equal(result.entry[key],undefined,key);
  const resultM=M.week([result.entry],{from:now-86400000,to:now+1});
  assert.ok(Object.values(resultM.groups).every(g=>g.equivalent===0));assert.equal(resultM.coverage.missingSessions,0);
});
test('match name is explicit, absent effort stays unknown and zero effort is a recorded zero',()=>{
  assert.equal(create({name:'',teamType:'match'}).entry.name,'Utakmica');
  const v=values();delete v.srpe;const missing=T.create(v,{historyId:'missing',now}).entry;
  assert.equal(Object.hasOwn(missing,'srpe'),false);assert.equal(T.sessionAU(missing),null);
  const zero=create({srpe:0}).entry;assert.equal(zero.srpe,0);assert.equal(T.sessionAU(zero),0);
});
test('invalid data rejects the complete transaction without changing its source',()=>{
  for(const patch of [{secs:0},{secs:-1},{secs:172801},{at:now+1},{srpe:10.5},{srpe:11},{teamType:'field'},{teamContent:['guess']},{notes:'x'.repeat(2001)},{name:'x'.repeat(201)},{load:{m:100}}]){
    const before=values();assert.equal(T.create({...before,...patch},{historyId:'x',now}).ok,false,JSON.stringify(patch));assert.deepEqual(before,values());
  }
});
test('History edits team type, real minutes, date, content and optional notes atomically',()=>{
  const entry=create().entry,before=JSON.stringify(entry);
  const result=H.edit(entry,{teamType:'match',name:'Liga',secs:4230,srpe:8,at:entry.at-86400000,teamContent:['tactical'],notes:null});
  assert.equal(result.ok,true);assert.equal(result.entry.historyId,entry.historyId);assert.equal(result.entry.teamType,'match');assert.equal(result.entry.notes,undefined);
  assert.equal(H.sessionAU(result.entry),564);assert.equal(result.entry.load2,undefined);assert.equal(result.entry.load2Status,undefined);assert.equal(JSON.stringify(entry),before);
  const invalid=H.edit(entry,{name:'Ne smije se spremiti',srpe:15});assert.equal(invalid.ok,false);assert.equal(JSON.stringify(entry),before);
  const cleared=H.edit(entry,{srpe:null});assert.equal(cleared.ok,true);assert.equal(H.sessionAU(cleared.entry),null);
});
test('unchanged History forms preserve precision and changed-only team fields',()=>{
  const entry=create({secs:4831}).entry;
  const extras={'#team-type':{value:'training'},'#team-notes':{value:entry.notes},content:[{value:'technical',checked:true},{value:'sprints',checked:true}]};
  assert.deepEqual(UI.readEdit(form([input('80,516667','80,516667',{historyMeta:'secs'})],extras),entry),{ok:true,patch:{}});
  extras['#team-type'].value='match';extras['#team-notes'].value='';extras.content[1].checked=false;
  const changed=UI.readEdit(form([input('0','7',{historyMeta:'srpe'}),input('70,5','80,516667',{historyMeta:'secs'})],extras),entry);
  assert.deepEqual(changed,{ok:true,patch:{srpe:0,secs:4230,teamType:'match',teamContent:['technical'],notes:null}});
});
test('team details and editor show their own content safely, with no archived/strength fallback',()=>{
  const entry=create({name:'<img src=x>',notes:'<script>bad()</script>'}).entry;
  const detail=UI.render({mode:'detail',entry}),edit=UI.render({mode:'edit',entry});
  assert.match(detail,/Momčadski trening/);assert.match(detail,/Sadržaj sesije/);assert.match(detail,/563,5/);
  assert.match(detail,/&lt;script&gt;/);assert.doesNotMatch(detail,/<script>/);assert.doesNotMatch(detail,/Sažeti zapis|Izvorni detalji|Povezani MAS/);
  assert.match(edit,/id="team-type"/);assert.match(edit,/id="team-notes"/);assert.match(edit,/Ocjena napora \(0–10\)/);
  assert.match(T.render({now}),/Datum i vrijeme završetka/);assert.match(UI.render({entries:[entry]}),/data-a="teamNew"/);
});

function appHarness(fail){
  const source=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
  const start=source.indexOf('  teamNew: (d={}) => {'),end=source.indexOf('  historyOpen:',start);
  const saved={historyId:'existing',kind:'field',name:'Prethodni',at:now-7200000};
  const S={dbState:'ready',log:[saved],settings:{matchDates:{'2026-11-05':true}},stack:[{v:'history'},{v:'teamEntry',historyId:'hnew',date:'2026-11-04'}]};
  const fieldValues={'#team-title':{value:'Klub'},'#team-at':{value:'2026-11-04T10:00'},'#team-minutes':{value:'80,5'},'#team-srpe':{value:'7'},'#team-type':{value:'training'},'#team-notes':{value:'Provjera'}};
  const entryForm={querySelector:id=>fieldValues[id],querySelectorAll:()=>[{value:'sprints',checked:true}]};
  let errors=[],toasts=[],stored=JSON.stringify({log:S.log}),persisted=0;
  const ctx={S,TeamDiary:T,document:{getElementById:id=>id==='team-entry-form'?entryForm:null},top:()=>S.stack.at(-1),teamError:s=>errors.push(s),
    uid:()=>'created',MonthPlan:{valid:()=>true},dateKey:()=>'',go:t=>S.stack.push(t),back:()=>S.stack.pop(),toast:s=>toasts.push(s),savedJson:stored,pendingExt:null,STORE_KEY:'mt.data.v1',LOG_MAX:2000,plural:(n,a,b,c)=>c,
    localStorage:{getItem:()=>stored},mergeOtherCopy:()=>true,
    persist:()=>{persisted++;if(fail)return false;stored=JSON.stringify({log:S.log});ctx.savedJson=stored;return true;}};
  vm.createContext(ctx);vm.runInContext('globalThis.A={'+source.slice(start,end)+'};',ctx);
  vm.runInContext(source.slice(source.indexOf('function trimLog(){'),source.indexOf('// the history entry')),ctx);
  vm.runInContext(source.match(/const isTraining =[^\n]+/)[0]+source.match(/const slotHit =[^\n]+/)[0]+';globalThis.testTraining=isTraining;globalThis.testSlot=slotHit;',ctx);
  return {ctx,S,errors,toasts,entryForm,fieldValues,getPersisted:()=>persisted,setLogs:logs=>{S.log=logs;stored=JSON.stringify({log:logs});ctx.savedJson=stored;}};
}
test('app save refusal retains original log and the draft; retry cannot duplicate the saved entry',()=>{
  const h=appHarness(true),before=h.S.log,settings=JSON.stringify(h.S.settings);
  h.ctx.A.teamSave();assert.equal(h.S.log,before);assert.equal(h.S.stack.at(-1).v,'teamEntry');assert.match(h.errors[0],/unos je sačuvan/);assert.equal(h.fieldValues['#team-minutes'].value,'80,5');
  assert.equal(JSON.stringify(h.S.settings),settings);
  const good=appHarness(false);good.ctx.A.teamSave();good.ctx.A.teamSave();
  assert.equal(good.S.log.length,2);assert.equal(good.S.log[0].secs,4830);assert.equal(good.S.stack.at(-1).v,'historyDetail');assert.equal(good.getPersisted(),1);
  assert.equal(good.ctx.testTraining(good.S.log[0]),true);
  for(const kind of ['protocol','field','program'])assert.equal(good.ctx.testSlot({kind,id:'same'},{...good.S.log[0],refId:'same'}),false);
});
test('new team entry uses the shared history cap and reports the trimmed oldest record',()=>{
  const h=appHarness(false),boundary=new Date('2026-11-01T10:00').getTime();
  const logs=Array.from({length:2000},(_,i)=>({historyId:'old_'+i,kind:'field',name:'Stariji',at:boundary+(1999-i)*60000}));
  h.setLogs(logs);h.ctx.A.teamSave();assert.equal(h.S.log.length,2000);assert.equal(h.S.log[0].historyId,'hnew');
  assert.equal(h.S.log.some(l=>l.historyId==='old_1999'),false);assert.match(h.toasts[0],/2000/);assert.match(h.toasts[0],/najstariji/);
});
test('backdated entries at or below the retention boundary are refused before trimming or writing',()=>{
  const boundary=new Date('2026-11-01T10:00').getTime();
  for(const at of ['2026-11-01T09:59','2026-11-01T10:00']){
    const h=appHarness(false),logs=Array.from({length:2000},(_,i)=>({historyId:'old_'+i,kind:'field',name:'Stariji',at:boundary+(1999-i)*60000}));
    h.setLogs(logs);h.fieldValues['#team-at'].value=at;h.ctx.A.teamSave();assert.equal(h.S.log,logs);assert.equal(h.getPersisted(),0);
    assert.equal(h.S.stack.at(-1).v,'teamEntry');assert.equal(h.fieldValues['#team-at'].value,at);assert.match(h.errors[0],/nije spremljen/);assert.equal(h.toasts.length,0);
  }
});
test('refused write after a trim restores every original record and retains the draft',()=>{
  const h=appHarness(true),boundary=new Date('2026-11-01T10:00').getTime();
  const logs=Array.from({length:2000},(_,i)=>({historyId:'old_'+i,kind:'field',name:'Stariji',at:boundary+(1999-i)*60000}));
  h.setLogs(logs);h.ctx.A.teamSave();assert.equal(h.S.log,logs);assert.equal(h.S.log.length,2000);assert.ok(h.S.log.some(l=>l.historyId==='old_1999'));
  assert.equal(h.S.stack.at(-1).v,'teamEntry');assert.equal(h.fieldValues['#team-minutes'].value,'80,5');assert.match(h.errors[0],/unos je sačuvan/);assert.equal(h.toasts.length,0);
});
