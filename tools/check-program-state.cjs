'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
function between(start, end) {
  const a = source.indexOf(start), b = source.indexOf(end,a+start.length);
  assert.ok(a>=0 && b>a);
  return source.slice(a,b);
}
const status = new Function('S','g',between('function progSessions(', 'function progCover(')+'\nreturn progStatus(g);');
const program = { id:'p',weeks:[{week:1,sessions:[{pr:'A'},{pr:'B'}]},{week:2,sessions:[{pr:'A'}]}] };
const state = {settings:{}, pr:{A:{},B:{}},log:[]};
test('future programme records cannot advance the next workout or fill earlier scheduled days',()=>{
  const future={kind:'protocol',refId:'A',at:Date.now()+86400000};
  const result=status({...state,log:[future]},program);
  assert.equal(result.done,0);assert.equal(result.next.pr,'A');
  const completedDays=new Function('S','weekStart','dayIdx','isTraining','slotHit','g',
    between('function progDaysDone(', '// does log entry')+'\nreturn progDaysDone(g);');
  assert.deepEqual(completedDays({log:[future]},()=>0,()=>0,()=>true,()=>true,{id:'p',days:[0]}),[]);
});
test('one completed workout satisfies one occurrence of a repeated programme protocol',()=>{
  const a={kind:'protocol',refId:'A',at:10};
  const one=status({...state,log:[a]},program);
  assert.deepEqual(one.items.map(x=>x.done),[true,false,false]);
  assert.equal(one.next.pr,'B');
  const two=status({...state,log:[a,{...a,at:11}]},program);
  assert.deepEqual(two.items.map(x=>x.done),[true,false,true]);
  assert.deepEqual(status({...state,settings:{progFrom:{p:11}},log:[a]},program).items.map(x=>x.done),[false,false,false]);
});
const setting = new Function('S','localStorage','cleanSettings','mtCanon','SETTINGS_BASE','render','toast','key','value',
  between('function writeSetting(', 'const matchDates =')+'\nreturn writeSetting(key,value);');
test('a refused setting write keeps the previous state and cannot report success',()=>{
  const s={settings:{goal:'snaga',preFrom:1}},messages=[];
  const disk={getItem(){return JSON.stringify(s.settings);},setItem(){throw Error('full');}};
  const ok=setting(s,disk,x=>x,JSON.stringify,{},()=>{},msg=>messages.push(msg),'preFrom',10);
  assert.equal(ok,false);assert.equal(s.settings.preFrom,1);assert.equal(messages.length,1);
});
test('setting writes retain unrelated changes from another tab and refuse a conflicting edit',()=>{
  const s={settings:{sound:true,preFrom:1}},messages=[];
  let stored={sound:false,preFrom:1};
  const disk={getItem(){return JSON.stringify(stored);},setItem(k,v){stored=JSON.parse(v);}};
  const set=value=>setting(s,disk,x=>x,JSON.stringify,{},()=>{},msg=>messages.push(msg),'preFrom',value);
  assert.equal(set(2),true);assert.deepEqual(stored,{sound:false,preFrom:2});
  stored={...stored,preFrom:3};assert.equal(set(4),false);assert.equal(stored.preFrom,3);assert.equal(s.settings.preFrom,3);
});
