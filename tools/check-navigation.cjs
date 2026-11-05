'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
function mediaHarness(){
 const removed=[],revoked=[],timers=[];
 const c={S:{ex:{original:{id:'original',media:'own:shared'}},draft:{id:'recovered-copy',media:'own:shared',mediaType:'image'}},
  IDB:{del:id=>{removed.push(id);return Promise.resolve();}},MEDIA:{'own:shared':'blob:shared'},
  document:{querySelectorAll:()=>[]},URL:{revokeObjectURL:id=>revoked.push(id)},setTimeout:f=>timers.push(f),render:()=>{}};
 vm.createContext(c);
 vm.runInContext(source.slice(source.indexOf('function dropMedia('),source.indexOf('// the editor\'s preview',source.indexOf('function dropMedia('))),c);
 const action=source.slice(source.indexOf('  mediaRemove: () =>'),source.indexOf('  saveEx:',source.indexOf('  mediaRemove: () =>')));
 vm.runInContext('const A={'+action+'}; globalThis.removeFromDraft=A.mediaRemove;',c);
 return {c,removed,revoked,timers};
}
test('removing a recovered copy photo cannot delete the still-saved original media',()=>{
 const {c,removed}=mediaHarness();c.removeFromDraft();
 assert.equal(c.S.draft.media,null);assert.equal(c.S.draft.mediaType,null);
 assert.equal(c.S.ex.original.media,'own:shared');assert.deepEqual(removed,[]);assert.equal(c.MEDIA['own:shared'],'blob:shared');
});
test('replacement, discard and delete cleanup retain shared files until the last saved reference is gone',()=>{
 const {c,removed,revoked,timers}=mediaHarness();
 c.S.ex.copy={id:'copy',media:'own:shared'};delete c.S.ex.original;
 c.dropMedia('own:shared');c.dropDraftMedia();assert.deepEqual(removed,[]);
 c.S.ex.copy.media='own:replacement';c.dropMedia('own:shared');assert.deepEqual(removed,['own:shared']);
 assert.equal(c.MEDIA['own:shared'],undefined);timers.forEach(f=>f());assert.deepEqual(revoked,['blob:shared']);
});
