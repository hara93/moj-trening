'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const repo=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(repo,file),'utf8');
const {suites}=JSON.parse(read('tools/browser/suites.json'));
const helpers=new Set(['run','runtime','published']);
test('every browser suite file is in the one suite list, and the list names existing files',()=>{
  const files=fs.readdirSync(path.join(repo,'tools/browser')).filter(file=>file.endsWith('.cjs')).map(file=>file.slice(0,-4)).filter(name=>!helpers.has(name)).sort();
  assert.deepEqual([...new Set(suites.map(suite=>suite.name))].sort(),files);
  const labels=suites.map(suite=>[suite.name,...(suite.args||[])].join(' '));
  assert.equal(new Set(labels).size,labels.length,'no suite runs twice');
});
test('the local runner reads the same list',()=>{
  const {suites:runner}=require(path.join(repo,'tools/browser/run.cjs'));
  assert.deepEqual(runner,suites.map(({name,args=[]})=>[name,...args]));
});
test('CI runs each listed suite as its own step that still runs after an earlier failure',()=>{
  const yml=read('.github/workflows/checks.yml');
  const steps=[...yml.matchAll(/- name: ([^\n]+)\n\s+if: ([^\n]+)\n\s+run: node tools\/browser\/([a-z-]+)\.cjs ((?:[a-z-]+ )*)\$\{\{ matrix\.browser \}\}\n/g)]
    .map(([,title,guard,name,args])=>({title,guard,name,args:args.trim()?args.trim().split(' '):[]}));
  assert.equal((yml.match(/node tools\/browser\//g)||[]).length,steps.length,'every browser command is a guarded step of its own');
  assert.deepEqual(steps.map(({title,name,args})=>({title,name,args})),suites.map(({title,name,args=[]})=>({title,name,args})));
  for(const step of steps)assert.match(step.guard,/^\(success\(\) \|\| failure\(\)\) && steps\.deps\.outcome == 'success'$/,step.title);
  assert.doesNotMatch(yml,/run: \|\n(?:\s+node tools\/browser\/[^\n]+\n){2,}/,'no multi-suite run block');
});
