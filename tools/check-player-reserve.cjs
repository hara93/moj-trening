'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {test}=require('node:test'),D=require('../player-dose.js');
const source=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
const section=(start,end)=>source.slice(source.indexOf(start),source.indexOf(end,source.indexOf(start)));
const clone=x=>JSON.parse(JSON.stringify(x));
function harness(p){
  const warnings=[],points=[],ctx={P:p,PlayerDose:D,clone,shouldSave:true,checkpoint:null,LM:{ASK:{U1:1,C:1},SIR_TAPS:[0,5,10,15,25,40],RIR_TAPS:[0,1,2,3,4.5,7],SIR_TXT:['0','5','10','15','20–30','30+'],RIR_TXT:['0','1','2','3','4–5','6+'],HOLD_S:6},
    S:{ex:{a:{id:'a',name:'Potisak'},b:{id:'b',name:'Izdržaj'}},log:[]},isWork:s=>s&&(s.kind==='manual'||s.kind==='work'),
    loadFx:e=>({pat:e.id==='b'?'C':'U1',rir:2}),setLoad:(e,fx,work)=>{points.push(work);return{B:work.n||work.t||0};},lmNovelty:()=>1,lmPts:String,
    esc:String,toast:s=>warnings.push(s),app:{querySelector:()=>null},render:()=>{},document:{getElementById:()=>null},
    rpeKnown:v=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=10,
    rpePct:v=>String(v),rpeTxt:v=>String(v),auHtml:(v,min)=>String(v*min)};
  ctx.savePlay=()=>{if(!ctx.shouldSave)return false;ctx.checkpoint=clone(ctx.P);return true;};
  vm.createContext(ctx);
  vm.runInContext(section('function workOf(j){','function finish(){'),ctx);
  vm.runInContext(section('function savePlayerChoice(keys,change){','// on the next start:'),ctx);
  vm.runInContext(section('const setEnd = PlayerDose.setWorkEnd','// per logged item:'),ctx);
  vm.runInContext(section('function rpeSet(t){',"// the done screen's load card:"),ctx);
  vm.runInContext('globalThis.A={'+section('  rir: d =>','  progTab:')+section('  answer: d =>','  progInfo:')+'};',ctx);
  return{ctx,warnings,points};
}
function pressing(){
  const item={exId:'a',measure:'sets',sets:3,reps:8,repsList:[8,6,4],kg:20,sec:30};
  const steps=[{kind:'prep'},...[1,2,3].flatMap(set=>[{kind:'manual',g:0,set,it:{...item},e:{name:'Potisak'}},{kind:'rest',dur:60}])];
  return{mode:'ex',items:[item],steps,done:true,i:steps.length,doneSteps:{1:1},answers:{0:'partial'},auto:{0:'partial'},rir:{1:2}};
}
test('partial finish asks about the last recorded closing step, not an unperformed last plan set',()=>{
  const p=pressing(),h=harness(p);assert.equal(h.ctx.rirStep(),1);assert.equal(h.ctx.lrDefault(0),6);assert.equal(D.recordedAt(h.ctx.lastAttemptStep(0)).reps,8);
  h.ctx.A.answer({j:'0',v:'0'});assert.equal(p.lastReps[0],6);
  for(let i=0;i<10;i++)h.ctx.A.lrep({j:'0',d:'1'});assert.equal(p.lastReps[0],8);
});
test('actual immutable step dose controls failure input after current templates have been edited',()=>{
  const p=pressing();p.items[0].repsList=[3,3,3];p.steps[1].it.repsList=[8,6,4];
  const h=harness(p);assert.equal(D.recordedAt(h.ctx.lastAttemptStep(0)).reps,8);assert.equal(h.ctx.lrDefault(0),6);
  p.steps[1].actualReps=9;
  assert.equal(h.ctx.lrDefault(0),9);
  h.ctx.A.answer({j:'0',v:'0'});assert.equal(p.lastReps[0],9);
});
test('bilateral holds expose SIR after the right side; partial next left does not hide the last full set',()=>{
  const it={exId:'b',measure:'time',sets:2,sec:10,secList:[10,6],kg:0,sides:true};
  const p={mode:'ex',items:[it],done:true,answers:{0:'partial'},auto:{0:'partial'},i:6,doneSteps:{1:1},steps:[{kind:'prep'},
    {kind:'work',g:0,set:1,side:'Lijeva strana',it,e:{name:'Izdržaj'}},{kind:'switch'},
    {kind:'work',g:0,set:1,side:'Desna strana',it,e:{name:'Izdržaj'}},{kind:'rest'},
    {kind:'work',g:0,set:2,side:'Lijeva strana',it,e:{name:'Izdržaj'}}]};
  const h=harness(p);assert.equal(h.ctx.rirStep(),-1);p.doneSteps[3]=1;p.doneSteps[5]=1;assert.equal(h.ctx.rirStep(),3);
  h.ctx.A.rir({k:'3',v:'3'});assert.equal(p.rir[3],15);
  const actual=D.logDose(p,0,'partial').fields;assert.deepEqual(actual.sirList,[15,null]);assert.deepEqual(actual.sideCounts,[2,1]);
});
test('null reserve and an explicitly selected zero stay distinct through recording and snapshot restore',()=>{
  const p=pressing();p.doneSteps[3]=1;delete p.rir;const h=harness(p);
  assert.equal(D.logDose(p,0,'partial').fields.rirList,undefined);
  h.ctx.A.rir({k:'3',v:'0'});assert.deepEqual(D.logDose(p,0,'partial').fields.rirList,[null,0]);
  const saved=clone(h.ctx.checkpoint);assert.equal(saved.rir[3],0);assert.equal(saved.rir[1],undefined);
});
test('failed last set uses actual reps and its already-defined zero reserve without overwriting a prior rating',()=>{
  const p=pressing();p.answers[0]=false;p.lastReps={0:5};const h=harness(p);
  h.ctx.rirSetPts(1);assert.deepEqual(clone(h.points.at(-1)),{n:5,rir:0});assert.equal(p.rir[1],2);
  assert.match(h.ctx.rirRowHtml(1,true),/Neuspjela serija · RIR 0/);assert.match(h.ctx.rirRowHtml(1,true),/disabled/);
  h.ctx.A.rir({k:'1',v:'3'});assert.equal(p.rir[1],2);
});
test('refused checkpoint rolls back reserve toggles, answer/default reps and last-rep edits',()=>{
  const p=pressing(),h=harness(p);h.ctx.shouldSave=false;
  h.ctx.A.rir({k:'1',v:'3'});assert.equal(p.rir[1],2);
  h.ctx.A.rir({k:'1',v:'2'});assert.equal(p.rir[1],2);
  h.ctx.A.answer({j:'0',v:'0'});assert.equal(p.answers[0],'partial');assert.equal(p.lastReps,undefined);
  p.answers[0]=false;p.lastReps={0:6};h.ctx.A.lrep({j:'0',d:'-1'});assert.equal(p.lastReps[0],6);assert.equal(h.warnings.length,4);
});
test('refused sRPE restores both the stored choice and the displayed slider, preserving an unrated state',()=>{
  const p=pressing(),h=harness(p);h.ctx.shouldSave=false;
  const attrs={},t={value:'8',classList:{toggle:()=>{}},style:{setProperty:()=>{}},setAttribute:(k,v)=>attrs[k]=v};
  h.ctx.rpeSet(t);assert.equal(p.srpe,undefined);assert.equal(t.value,'5');assert.equal(attrs['aria-valuetext'],'nije ocijenjeno');
  p.srpe=3;t.value='8';h.ctx.rpeSet(t);assert.equal(p.srpe,3);assert.equal(t.value,'3');
});
test('explicit zero sRPE stays a known recorded choice and survives a refused replacement rating',()=>{
  const p=pressing(),h=harness(p),attrs={};
  const t={value:'0',classList:{toggle:()=>{}},style:{setProperty:()=>{}},setAttribute:(k,v)=>attrs[k]=v};
  h.ctx.rpeSet(t);assert.equal(p.srpe,0);assert.equal(h.ctx.checkpoint.srpe,0);assert.equal(t.value,'0');assert.equal(attrs['aria-valuetext'],'0');
  h.ctx.shouldSave=false;t.value='8';h.ctx.rpeSet(t);assert.equal(p.srpe,0);assert.equal(t.value,'0');assert.equal(attrs['aria-valuetext'],'0');
});
test('partial edited, field and activation sessions all stop for review without an automatic history write',()=>{
  for(const mode of ['ex','field']){
    const calls=[],ctx={P:{mode,quit:false,paused:true},S:{sheet:{}},anyDone:()=>true,finish:()=>calls.push('review'),clearPlay:()=>calls.push('clear'),leavePlay:()=>calls.push('leave'),toast:()=>{},logSession:()=>calls.push('write'),progCandidates:()=>[]};
    vm.createContext(ctx);vm.runInContext(section('function saveSoFar(){','// Keep exercise details'),ctx);ctx.saveSoFar();
    assert.deepEqual(calls,['review']);assert.equal(ctx.P.quit,true);assert.equal(ctx.P.paused,false);assert.equal(ctx.S.sheet,null);
  }
});
test('field repeat retains explicit season/full dose and rebuilds the selected dose from the current field template',()=>{
  for(const dose of ['season','full']){
    let started;
    const field={id:'field',name_hr:'Teren',blocks:[{sets:3}]};
    const ctx={P:{mode:'field',dose,title:'Teren',f:field,ref:{kind:'field',id:'field'}},S:{pr:{},field:{field},stack:[{},{}]},
      anyCredit:()=>true,logSession:()=>({saved:true,cut:'',news:[]}),render:()=>{},toast:()=>{},newsMsg:()=>'',
      fieldDose:f=>({...f,seasonDose:true}),stepsFromField:f=>[{seasonDose:!!f.seasonDose}],stepsFromItems:()=>[],startPlayer:(cfg,repeating)=>{started={cfg,repeating};}};
    vm.createContext(ctx);vm.runInContext('globalThis.A={'+section('  restartPlay: () =>','  finishPlay:')+'};',ctx);ctx.A.restartPlay();
    assert.equal(started.cfg.dose,dose);assert.equal(started.cfg.steps[0].seasonDose,dose==='season');assert.equal(started.repeating,true);
  }
});
test('the rest screen asks for the finished set, following Upis rezerve; rep sets wait without a set timer',()=>{
  const cut=(a,b)=>{const i=source.indexOf(a),j=source.indexOf(b,i);assert.ok(i>=0&&j>i,a);return source.slice(i,j);};
  const ctx={};require('node:vm').createContext(ctx);
  require('node:vm').runInContext(cut('const RESERVE_ENTRY','const reserveEntry')+';globalThis.labels=RESERVE_ENTRY;',ctx);
  assert.deepEqual([...ctx.labels],['Nakon svake serije','Samo zadnja serija vježbe','Na kraju']);
  assert.match(cut('function cleanSettings(s){','const SETTINGS_BASE'),/int\('reserveEntry', 0, 2\)/);
  const tick=cut('function tick(){','\n}');
  assert.match(tick,/timer=!manual\|\|repSetSeconds\(st\.it\|\|\{\}\)!==null/);
  assert.match(tick,/if \(whole <= 0 && timer\)/,'no automatic set end without Tajmer serije');
  assert.match(cut('function workoutCinemaHtml() {','\n}'),/reserveHtml:reserveAt\.map\(k=>rirRowHtml\(k,/);
  assert.match(cut('function rirRowHtml(k, other){','\n}'),/Number\.isFinite\(goal\) \? goal :/,'the item target is the marked chip');
});
test('a superset round asks about each exercise in it; the done screen asks about the last set of every exercise',()=>{
  const a={exId:'a',measure:'sets',sets:3,reps:8,kg:20},b={exId:'a',measure:'sets',sets:2,reps:5,kg:0};
  const set=(g,n,it)=>({kind:'manual',g,set:n,it,e:{name:g?'Nordic':'Bugarski'}});
  const steps=[{kind:'prep'},set(0,1,a),set(1,1,b),{kind:'rest',dur:90},set(0,2,a),set(1,2,b),{kind:'rest',dur:90},set(0,3,a),{kind:'rest',dur:10,trans:true}];
  const p={mode:'ex',items:[a,b],steps,i:3,doneSteps:{1:1,2:1}},h=harness(p);
  assert.deepEqual([...h.ctx.reserveSteps()],[1,2],'A1 and A2 of the round, not only the set before the rest');
  for(const [entry,expected] of [[undefined,[1,2]],[0,[1,2]],[1,[]],[2,[]],[7,[1,2]]]){
    h.ctx.S.settings={reserveEntry:entry};assert.deepEqual([...h.ctx.cinemaReserveSteps()],expected,String(entry));
  }
  p.i=6;Object.assign(p.doneSteps,{4:1,5:1});h.ctx.S.settings={reserveEntry:1};
  assert.deepEqual([...h.ctx.cinemaReserveSteps()],[5],'"Samo zadnja serija vježbe": Nordic ends at its own set 2');
  p.i=8;p.doneSteps[7]=1;assert.deepEqual([...h.ctx.cinemaReserveSteps()],[7],'the last Bulgarian set, on the pause before the next exercise');
  p.i=7;assert.deepEqual([...h.ctx.reserveSteps()],[],'never on a set screen');
  p.done=true;h.ctx.S.settings={reserveEntry:2};
  assert.deepEqual([...h.ctx.reserveSteps()],[5,7],'one row per exercise on the done screen, in every mode');
  p.answers={1:'skip'};assert.deepEqual([...h.ctx.reserveSteps()],[7]);
  const html=h.ctx.rirRowHtml(1,true);
  assert.match(html,/<p class="rirn">Bugarski · 1\. serija<\/p>/,'the other exercise has its own line');
  assert.match(html,/<em>nije uneseno<\/em>/);
  assert.match(h.ctx.rirRowHtml(1,false),/<em>S1 · rezerva nije unesena<\/em>/);
  assert.doesNotMatch(h.ctx.rirRowHtml(1,false),/rirn/);
});
