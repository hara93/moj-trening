const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const site=path.resolve(__dirname,'..'),E=require(path.join(site,'engine.js'));
function harness(){
 const stored=new Map(),app={dataset:{},addEventListener(){},querySelector(){return null;},insertAdjacentHTML(){}};
 const ctx={TrainingEngine:E,console,Blob,URL,Date,setTimeout(){return 1;},clearTimeout(){},setInterval(){return 1;},clearInterval(){},requestAnimationFrame(){},navigator:{},localStorage:{getItem:k=>stored.get(k)||null,setItem:(k,v)=>stored.set(k,v)},document:{getElementById:id=>id==='app'?app:null,addEventListener(){}},window:{addEventListener(){}}};vm.createContext(ctx);
 for(const f of ['data.js','legacy.js','real-media.js'])vm.runInContext(fs.readFileSync(path.join(site,f),'utf8'),ctx);
 const src=fs.readFileSync(path.join(site,'app.js'),'utf8').replace(/\ninit\(\);\n/,`\nrender=()=>{};toast=()=>{};applyData(E.migrate(null,window.SEED,window.LEGACY_SEED));S.dbState='ready';globalThis.audit={S,A,VIEWS,MEDIA,mediaHtml,thumbHtml,mediaCredit,mediaUrlSafe,safeUrl,libFiltered,startPlayer,enterStep,getP:()=>P};\n`);vm.runInContext(src,ctx);
 return {a:ctx.audit,window:ctx.window,stored};
}
test('Every seeded exercise/protocol and main view renders with the compact presentation',()=>{
 const {a}=harness();for(const view of ['home','library','protocols','plan','history'])assert.match(a.VIEWS[view](),/class="view/);
 for(const e of Object.values(a.S.ex)){a.S.stack=[{v:'ex',id:e.id}];const out=a.VIEWS.ex(a.S.stack[0]);assert.match(out,/Prikaži više/);assert.match(out,/data-a="playEx"/);assert.doesNotMatch(out,/<details[^>]*\bopen(?:\s|>)/);}
 for(const p of Object.values(a.S.pr)){a.S.stack=[{v:'pr',id:p.id}];assert.match(a.VIEWS.pr(a.S.stack[0]),/data-a="startPr"/);}
});
test('Manifest demonstrations resolve to real, present local assets and render safe attribute values',()=>{
 const {a,window}=harness();assert.ok(Object.keys(window.REAL_MEDIA).length>0);
 for(const [id,m] of Object.entries(window.REAL_MEDIA)){assert.ok(a.S.ex[id],id);const out=a.mediaHtml(a.S.ex[id]);assert.doesNotMatch(out,/(?:src|poster)="#"/,id);for(const asset of [m.video,m.image,m.poster].filter(Boolean)){if(asset.startsWith('assets/')){assert.ok(fs.statSync(path.join(site,asset)).size>0,asset);assert.equal(a.mediaUrlSafe(asset),asset);}}assert.match(a.thumbHtml(a.S.ex[id]),/<img/);}
 const unsafe='https://example.test/video?a=" onerror="x&b=1';assert.equal(a.safeUrl(unsafe),'https://example.test/video?a=&quot; onerror=&quot;x&amp;b=1');assert.equal(a.mediaUrlSafe('javascript:alert(1)'),'#');assert.equal(a.mediaUrlSafe('assets/exercises/../../app.js'),'#');
});
test('Unknown exercise never inherits a demonstration and cannot open an editor during a running interval',()=>{
 const {a}=harness(),e={id:'custom-no-demo',name:'My exercise',measure:'time',sets:1,sec:30,steps:[]};a.S.ex[e.id]=e;
 assert.match(a.mediaHtml(e),/Snimka još nije dodana/);assert.doesNotMatch(a.mediaHtml(e),/<(?:video|img|iframe)\b/);
 const it={exId:e.id,measure:'time',sets:1,sec:30};a.startPlayer({mode:'ex',title:e.name,items:[it],steps:E.itemsToSteps([it],a.S.ex)});a.enterStep(1);
 const out=a.VIEWS.play();assert.doesNotMatch(out,/data-a="editEx"/);assert.match(out,/data-a="pausePlay"/);assert.equal(a.getP().paused,false);
});
test('Recorded-only filter selects manifest coverage and clearing filters restores the normal list',()=>{
 const {a,window}=harness();a.S.lib.owned=false;a.S.lib.recorded=true;const rows=a.libFiltered();assert.equal(rows.length,Object.keys(window.REAL_MEDIA).length);assert.ok(rows.every(e=>window.REAL_MEDIA[e.id]));a.S.lib.q='not a real exercise';a.S.lib.cat='Favoriti';a.A.clearFilters();assert.equal(a.S.lib.q,'');assert.equal(a.S.lib.recorded,false);assert.equal(a.S.lib.cat,'Sve');assert.ok(a.libFiltered().length>rows.length);
});

test('Changing a seeded movement never keeps a now-mismatched public demonstration',()=>{
 const {a}=harness(),e=a.S.ex['trx-veslanje'];assert.match(a.mediaHtml(e),/<video/);
 e.reps=12;e.fav=true;assert.match(a.mediaHtml(e),/<video/,'dose and favorites do not change movement');
 e.steps=['A different movement'];assert.doesNotMatch(a.mediaHtml(e),/<video/);
});

test('Personal media never inherits publisher credit or a stock position caption',()=>{
 const {a}=harness(),e=a.S.ex['dead-bug'];e.media='personal';e.mediaType='image';a.MEDIA.personal='blob:personal';
 assert.equal(a.mediaCredit(e),'');const out=a.mediaHtml(e);assert.match(out,/blob:personal/);assert.doesNotMatch(out,/Početni položaj/);
});
