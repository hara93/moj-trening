'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {test}=require('node:test');
const app=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
const source=app.slice(app.indexOf('async function importPack(file){'),app.indexOf('// what removing the pack takes away'));
const copy=x=>structuredClone(x),plain=x=>JSON.parse(JSON.stringify(x));
function harness(){
  const oldPhoto={type:'image/png',buf:Uint8Array.from([1,2,3]).buffer};
  let blobs=new Map([['pack:known',copy(oldPhoto)]]),queue=Promise.resolve();
  const pack={id:'same',title:'Stari paket',ids:['known'],videos:{old:'https://example.test/old'},members:['known']};
  const S={ex:{known:{id:'known',name:'Poznata',pack:'same'}},pr:{},field:{},prog:{},log:[],_deleted:[],pack,saveFailed:false};
  const store=new Map(),urls=[];
  const ctx={S,window:{},STORE_KEY:'mt.data.v1',BACKUP_KIND:'moj-trening-backup',PACK_KIND:'moj-trening-media-pack',MEDIA_URLS:{'pack:known':'blob:old'},
    isPlainObj:x=>!!x&&typeof x==='object'&&!Array.isArray(x),badKey:k=>typeof k!=='string'||!k||k in Object.prototype,
    cleanData:d=>({exercises:copy(d.exercises||{}),protocols:copy(d.protocols||{}),programs:copy(d.programs||{})}),
    cleanPackVideos:x=>x||{},packError:s=>Object.assign(new Error(s),{mtMsg:s}),plural:()=>'',
    atob:s=>Buffer.from(s,'base64').toString('binary'),Blob,URL:{createObjectURL:()=>{urls.push('create');return'blob:new';},revokeObjectURL:()=>urls.push('revoke')},
    console:{error:()=>{}},failKey:null,failOnce:false,failPhoto:false,failCommit:false,
    carryItems:(fresh)=>copy(fresh.items||[]),mergeOtherCopy:()=>{throw Error('unexpected external merge');}};
  ctx.storeObj=()=>({v:1,exercises:S.ex,protocols:S.pr,field:S.field,programs:S.prog,log:S.log,_deleted:S._deleted});
  ctx.applyData=d=>{S.ex=d.exercises;S.pr=d.protocols;S.field=d.field;S.prog=d.programs;S.log=d.log;};
  ctx.collMap=c=>c==='exercises'?S.ex:c==='protocols'?S.pr:c==='programs'?S.prog:S.field;
  ctx.localStorage={getItem:k=>store.has(k)?store.get(k):null,removeItem:k=>store.delete(k),setItem:(k,v)=>{
    if(ctx.failKey===k){if(ctx.failOnce)ctx.failKey=null;throw Error('quota');}store.set(k,v);
  }};
  ctx.persist=()=>{try{const s=JSON.stringify(ctx.storeObj());ctx.localStorage.setItem(ctx.STORE_KEY,s);ctx.savedJson=s;return true;}catch(e){S.saveFailed=true;return false;}};
  ctx.IDB={tx:(mode,fn)=>{const task=queue.then(()=>new Promise((resolve,reject)=>{
    const pending=new Map([...blobs].map(([k,v])=>[k,copy(v)]));let aborted=false;
    const st={transaction:{abort:()=>{aborted=true;}},put:(v,k)=>{if(ctx.failPhoto)throw Error('photo quota');pending.set(k,copy(v));},get:k=>{
      const req={result:pending.get(k)};setTimeout(()=>{try{if(!aborted&&req.onsuccess)req.onsuccess();if(aborted||ctx.failCommit)throw Error('abort');blobs=pending;resolve(req.result);}catch(e){reject(e);}},0);return req;}};
    try{fn(st);}catch(e){reject(e);}
  }));queue=task.catch(()=>{});return task;}};
  vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(__dirname,'../hash.js'),'utf8'),ctx);
  ctx.contentHash=ctx.window.mtContentHash;ctx.HASH_SKIP=ctx.window.mtHashSkip;ctx.mtCanon=ctx.window.mtCanon;
  store.set('mt.pack',JSON.stringify(pack));ctx.persist();
  vm.runInContext(source+';globalThis.importTest=importPack;',ctx);
  return{ctx,S,store,urls,photo:id=>copy(blobs.get('pack:'+id)),import:data=>ctx.importTest({text:async()=>JSON.stringify(data)})};
}
const pack=(name='Novo',extra={})=>({kind:'moj-trening-media-pack',id:'same',title:name,items:[{ex:'known',type:'image/png',data:Buffer.from([7,8,9]).toString('base64')}],exercises:{added:{name:'Dodana'}},members:['added'],...extra});
for(const [label,settings]of [['metadata refusal',{failKey:'mt.pack'}],['data refusal',{failKey:'mt.data.v1'}],['photo refusal',{failPhoto:true}],['late IDB commit refusal',{failCommit:true}]]){
  test(label+' preserves old photos, metadata, records and cached image',async()=>{
    const h=harness(),before={data:h.store.get('mt.data.v1'),pack:h.store.get('mt.pack'),photo:h.photo('known'),state:JSON.stringify(h.ctx.storeObj()),packObject:h.S.pack};
    Object.assign(h.ctx,settings);await assert.rejects(h.import(pack()),/Paket nije uvezen/);
    assert.deepEqual(h.photo('known'),before.photo);assert.equal(h.store.get('mt.pack'),before.pack);assert.equal(h.store.get('mt.data.v1'),before.data);
    assert.equal(JSON.stringify(h.ctx.storeObj()),before.state);assert.equal(h.S.pack,before.packObject);assert.deepEqual(h.urls,[]);assert.equal(h.ctx.MEDIA_URLS['pack:known'],'blob:old');
    assert.equal(h.S.saveFailed,false);
  });
}
test('success publishes the new photograph and metadata only after durable transaction completion',async()=>{
  const h=harness(),result=await h.import(pack());assert.equal(result.exercises,1);assert.equal(result.photos,0);
  assert.deepEqual(Array.from(new Uint8Array(h.photo('known').buf)),[7,8,9]);
  assert.equal(h.S.pack.title,'Novo');assert.equal(h.store.get('mt.pack'),JSON.stringify(h.S.pack));assert.ok(h.S.ex.added);
  assert.deepEqual(h.urls,['revoke','create']);assert.deepEqual(plain(h.S.pack.members),['known','added']);
});
test('same-pack concurrent imports serialize, retain both added records, and let the later photo win',async()=>{
  const h=harness();await Promise.all([h.import(pack('Prvi',{exercises:{one:{name:'Jedan'}},members:['one']})),h.import(pack('Drugi',{exercises:{two:{name:'Dva'}},members:['two'],items:[{ex:'known',type:'image/png',data:Buffer.from([4,5,6]).toString('base64')}]}))]);
  assert.ok(h.S.ex.one&&h.S.ex.two);assert.equal(h.S.pack.title,'Drugi');assert.deepEqual(plain(h.S.pack.members),['known','one','two']);
  assert.deepEqual(Array.from(new Uint8Array(h.photo('known').buf)),[4,5,6]);assert.equal(h.store.get('mt.pack'),JSON.stringify(h.S.pack));
});
test('a refused first concurrent import cannot roll back a later successful update',async()=>{
  const h=harness();h.ctx.failKey='mt.pack';h.ctx.failOnce=true;
  const result=await Promise.allSettled([h.import(pack('Odbijen',{exercises:{bad:{name:'Ne'}},members:['bad']})),h.import(pack('Spremljen',{exercises:{good:{name:'Da'}},members:['good']}))]);
  assert.equal(result[0].status,'rejected');assert.equal(result[1].status,'fulfilled');assert.equal(h.S.ex.bad,undefined);assert.ok(h.S.ex.good);
  assert.equal(h.S.pack.title,'Spremljen');assert.deepEqual(plain(h.S.pack.members),['known','good']);
});
