const test = require('node:test');
const assert = require('node:assert/strict');
const H = require('../history-store.js');
const same = (a,b) => JSON.stringify(a) === JSON.stringify(b);
const row = (at, extra = {}) => ({ kind:'protocol', refId:'p', name:'Potisak', at, ...extra });

test('legacy IDs are stable across imports and distinguish duplicate timestamps, workouts and tests', () => {
  const logs = [row(10),row(10),row(10,{kind:'test',test:'mas'}),row(10,{kind:'exercise'})];
  const ids = H.identify(logs).map(x=>x.historyId);
  assert.equal(new Set(ids).size,4);
  assert.deepEqual(H.identify(JSON.parse(JSON.stringify(logs))).map(x=>x.historyId), ids);
  assert.deepEqual(H.identify(H.identify(logs)).map(x=>x.historyId), ids);
});
test('an edit to the date and title keeps one record while another tab adds an unrelated workout', () => {
  const base = H.identify([row(10)]), edited = {...base[0],name:'Ispravak',at:30};
  const other = [row(20,{historyId:'new-workout'}),...base];
  const next = H.merge(base,[edited],other,same,[]);
  assert.deepEqual(next.map(x=>x.name),['Ispravak','Potisak']);
  assert.deepEqual(H.merge(base,other,[edited],same,[]),next);
});
test('deleting a record survives another tab saving, importing legacy rows, and an unrelated simultaneous edit', () => {
  const base = H.identify([row(12),row(10)]), other = [base[0],{...base[1],name:'Teretana'}];
  assert.deepEqual(H.merge(base,[base[1]],other,same,[]),[other[1]]);
  const del = ['log/'+base[0].historyId];
  assert.deepEqual(H.merge([],base,other,same,del).map(x=>x.historyId),[base[1].historyId]);
  assert.deepEqual(H.live([row(12),row(10)],del),[base[1]]);
});
test('progression follows changed completed sessions, retaining manual dose resets and accepted weights', () => {
  const item = {exId:'press',measure:'sets',sets:2,reps:8,kg:20,ok:2,snoozeOk:2};
  const p = { id:'p', items:[item] }, map = {press:{cat:'Snaga'}};
  const sessions = [row(2,{items:[{...item,done:true}]}),row(1,{items:[{...item,done:true}]})];
  const next = H.reconcile(p,sessions,sessions.slice(1),map);
  assert.equal(next.items[0].ok,1); assert.equal(next.items[0].snoozeOk,1); assert.equal(next.items[0].kg,20);
  assert.equal(p.items[0].ok,2);
  const meta = sessions.map(x=>({...x,name:'Novi naziv'}));
  assert.equal(H.reconcile(p,sessions,meta,map),p);
  const raised = {...p,items:[{...item,ok:0,kg:25,up:3}]};
  assert.equal(H.reconcile(raised,sessions,[],map),raised);
});
