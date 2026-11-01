const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const site=path.resolve(__dirname,'..'),E=require(path.join(site,'engine.js'));
function harness(){
 const stored=new Map(),removed=[],puts=[],notices=[],app={dataset:{},addEventListener(){},querySelector(){return null;},insertAdjacentHTML(){}};
 const values={'finish-rpe':'5','finish-pain':'0','finish-quality':'good','finish-notes':''};
 let failMain=false,maxMain=Infinity,now=10000;
 class Clock extends Date{static now(){return now;}}
 const context={TrainingEngine:E,console,Blob,Uint8Array,URL,atob,Date:Clock,setTimeout(){return 1;},clearTimeout(){},setInterval(){return 1;},clearInterval(){},requestAnimationFrame(){},navigator:{},localStorage:{getItem(k){return stored.get(k)||null;},setItem(k,v){if(k==='mt.data.v2'&&(failMain||v.length>maxMain))throw Error('QuotaExceededError');stored.set(k,v);},removeItem(k){removed.push(k);stored.delete(k);}},document:{getElementById(id){return id==='app'?app:values[id]===undefined?null:{value:values[id]};},addEventListener(){}},window:{SEED:{exercises:{},protocols:{},field:{}},LEGACY_SEED:{},addEventListener(){}}};
 vm.createContext(context);
 let source=fs.readFileSync(process.env.MT_APP_SOURCE||path.join(site,'app.js'),'utf8');
 assert.match(source,/\ninit\(\);\n/);
 source=source.replace(/\ninit\(\);\n/,`\nrender=()=>{};toast=msg=>globalThis.notices.push(msg);IDB.put=async(id,blob)=>globalThis.puts.push({id,blob});loadMedia=async()=>{};globalThis.audit={S,A,VIEWS,checkpoint,startPlayer,enterStep,tick,remaining,getP:()=>P,setP:p=>{P=p;}};\n`);
 context.puts=puts;context.notices=notices;vm.runInContext(source,context);
 const a=context.audit;a.S.plan=[];a.S.profile=E.defaultProfile();a.S.log=[{id:'older',name:'Older',at:1}];
 return {a,stored,removed,puts,notices,values,failMain:v=>{failMain=v;},maxMain:v=>{maxMain=v;},advance:ms=>{now+=ms;}};
}
function completedPlayer(){return {done:true,title:'Saved session',steps:[{kind:'manual',recordKey:'0:1:Obje'}],records:{'0:1:Obje':{status:'done',exId:'bench',reps:8}},ref:{kind:'exercise',id:'bench'},secs:60,summary:{status:'complete'},setDraft:{}};}
test('Failed completed-session save retains recovery and retries without duplicate entries',()=>{
 const h=harness();h.a.setP(completedPlayer());h.a.checkpoint();const prior=h.stored.get('mt.active.v2');assert.ok(prior);
 h.failMain(true);h.a.A.finishPlay();
 assert.ok(h.a.getP(),'the completed player must remain available for retry');assert.ok(h.stored.has('mt.active.v2'),'recovery must not be deleted on failure');assert.equal(h.a.S.log.length,1);assert.ok(!h.notices.some(s=>s==='Trening i rezultati su spremljeni.'));
 h.failMain(false);h.a.A.finishPlay();assert.equal(h.a.getP(),null);assert.equal(h.a.S.log.length,2);assert.equal(JSON.parse(h.stored.get('mt.data.v2')).log.length,2);assert.ok(!h.stored.has('mt.active.v2'));
});
test('Full-backup restore saves clips outside localStorage and commits only data plus media references',async()=>{
 const h=harness(),clip='data:video/mp4;base64,'+Buffer.alloc(80000,4).toString('base64');h.maxMain(5000);h.a.S.importDraft={v:2,exercises:{custom:{name:'Custom',media:'clip1',mediaType:'video'}},protocols:{},field:{},log:[],mediaBlobs:{clip1:clip}};
 await h.a.A.confirmImport({mode:'replace'});
 assert.equal(h.puts.length,1);assert.ok(h.stored.has('mt.data.v2'),'valid media backup should fit the data-storage limit');const saved=JSON.parse(h.stored.get('mt.data.v2'));assert.equal(saved.mediaBlobs,undefined);assert.equal(saved.exercises.custom.media,h.puts[0].id);assert.ok(h.notices.includes('Podaci su uvezeni. Kopija prije uvoza je sačuvana.'));
});
test('Rejected malformed backups leave both current data and previous recovery untouched',async()=>{
 for(const invalid of [{log:[null]},{plan:[null]},{field:{bad:{name_hr:'Bad',blocks:{}}}}]){
  const h=harness();h.stored.set('mt.data.v2','original');h.stored.set('mt.before-import.v2','earlier recovery');h.a.S.importDraft={v:2,exercises:{},protocols:{},...invalid};await h.a.A.confirmImport({mode:'replace'});
  assert.equal(h.stored.get('mt.data.v2'),'original');assert.equal(h.stored.get('mt.before-import.v2'),'earlier recovery');assert.equal(h.a.S.log.length,1);
 }
});
test('Pause duration is excluded once and resets between manual sets',()=>{
 const h=harness(),it={exId:'bench',measure:'sets',sets:2,reps:8,kg:0,rest:5},ex={bench:{id:'bench',name:'Bench'}};
 h.a.startPlayer({mode:'ex',items:[it],title:'Bench',steps:E.itemsToSteps([it],ex)});h.a.enterStep(1);h.advance(10000);h.a.A.pausePlay();h.advance(30000);h.a.A.pausePlay();h.advance(5000);h.a.A.completeStep();
 assert.equal(h.a.getP().records['0:1:Obje'].seconds,15);h.a.A.skipStep();h.advance(7000);h.a.A.completeStep();assert.equal(h.a.getP().records['0:2:Obje'].seconds,7);assert.equal(h.a.getP().secs,22);
});
test('Reloaded timed interval keeps its saved remaining duration until explicitly resumed',()=>{
 const h=harness(),it={exId:'plank',measure:'time',sets:1,sec:30},ex={plank:{id:'plank',name:'Plank'}};
 h.a.startPlayer({mode:'ex',items:[it],title:'Plank',steps:E.itemsToSteps([it],ex)});h.a.enterStep(1);h.advance(10000);h.a.checkpoint();h.a.S.resume=JSON.parse(h.stored.get('mt.active.v2'));h.a.setP(null);h.advance(45000);h.a.A.resumePlay();
 assert.equal(h.a.remaining(),20);h.a.tick();assert.equal(h.a.getP().done,false);h.a.A.pausePlay();h.advance(19000);h.a.tick();assert.equal(h.a.remaining(),1);h.advance(1000);h.a.tick();assert.equal(h.a.getP().summary.status,'complete');assert.equal(h.a.getP().secs,30);
});
