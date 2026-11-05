'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const repo=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(repo,file),'utf8');
test('published entry scripts and styles are present in the same offline release',()=>{
  const html=read('index.html'),ctx={self:{addEventListener(){},skipWaiting(){},clients:{claim(){}}}};
  vm.runInNewContext(read('sw.js')+'\nglobalThis.release={CACHE,SHELL};',ctx);
  const version=/const APP_VERSION\s*=\s*'([^']+)'/.exec(read('app.js'))[1];
  assert.equal(ctx.release.CACHE,'mt-v'+version);
  const files=[...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g),...html.matchAll(/<link\b[^>]*\brel="stylesheet"[^>]*\bhref="([^"]+)"/g)]
    .map(match=>match[1]).filter(file=>!/^https?:/.test(file));
  assert.equal(new Set(files).size,files.length,'runtime dependencies must not load twice');
  for(const file of files){
    assert.ok(fs.statSync(path.join(repo,file)).isFile(),file+' exists');
    assert.ok(ctx.release.SHELL.includes('./'+file),file+' is available offline');
  }
  for(const file of ctx.release.SHELL){if(file!=='./')assert.ok(fs.statSync(path.join(repo,file)).isFile(),file+' cache asset exists');}
  assert.ok(files.indexOf('history-model.js')<files.indexOf('app.js'));
  assert.ok(files.indexOf('player-dose.js')<files.indexOf('app.js'));
});
