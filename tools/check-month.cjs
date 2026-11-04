const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('../month-plan.js');

const tempo = {kind:'field',id:'tempo',name:'Tempo',min:26};
const rehab = {kind:'protocol',id:'rehab',name:'Rehab',min:23};
const lookup = x => [tempo,rehab].find(s=>M.same(s,x));
const base = [{...tempo,day:1},{...rehab,day:2}];
const slots = (week,map) => M.week(base,week,map,lookup).map(s=>[s.day,s.id]);

test('calendar uses local days across clock changes, year boundaries and leap years', () => {
  assert.equal(M.grid('2026-11')[0],'2026-10-26');
  assert.equal(M.grid('2026-11').at(-1),'2026-12-06');
  assert.equal(M.grid('2026-02').length,35);
  assert.equal(M.grid('2021-02').length,28);
  assert.equal(M.changeMonth('2026-01-31',1),'2026-02-28');
  assert.equal(M.changeMonth('2028-01-31',1),'2028-02-29');
  assert.equal(M.shift('2026-10-25',1),'2026-10-26');
  assert.equal(M.shift('2026-03-29',1),'2026-03-30');
  assert.equal(M.monday('2027-01-01'),'2026-12-28');
});

test('moving one occurrence across weeks or months does not change the weekday template', () => {
  const map = M.put({},'2026-11-24',{...tempo,to:'2026-12-03'});
  assert.deepEqual(slots('2026-11-23',map),[[2,'rehab']]);
  assert.deepEqual(slots('2026-11-30',map),[[1,'tempo'],[2,'rehab'],[3,'tempo']]);
  const again = M.put(map,'2026-11-24',{...tempo,to:'2026-12-04'});
  assert.deepEqual(slots('2026-11-30',again),[[1,'tempo'],[2,'rehab'],[4,'tempo']]);
  assert.deepEqual(M.put(again,'2026-11-24',{...tempo,to:'2026-11-24'}),{});
});

test('adding the same session on its original date preserves earlier moves and other sessions', () => {
  const source = '2026-11-10';
  let map = M.put({},source,{...tempo,to:'2026-11-12'});
  map = M.put(map,source,{...tempo,extra:true,to:'2026-11-13'});
  const n = M.extraNumber(map,source,tempo);
  map = M.put(map,source,{...tempo,extra:true,n,to:source});
  assert.deepEqual(slots('2026-11-09',map),[[1,'tempo'],[2,'rehab'],[3,'tempo'],[4,'tempo']]);
  const removed = M.put(map,source,{...tempo,extra:true,n,to:null});
  assert.deepEqual(slots('2026-11-09',removed),[[2,'rehab'],[3,'tempo'],[4,'tempo']]);
  assert.deepEqual(M.clean(JSON.parse(JSON.stringify(map))),map);
});

test('repeating a move protects both endpoints of manually edited dates and is idempotent', () => {
  const map = M.put(M.put({},'2026-11-10',{...tempo,to:'2026-11-12'}),'2026-11-19',{...rehab,extra:true,to:'2026-11-19'});
  const occupied = (changes,date,row) => M.week(base,M.monday(date),changes,lookup)
    .some(x=>M.same(x,row) && M.shift(M.monday(date),x.day)===date);
  const copied = M.repeat(map,'2026-11-10','2026-11-04',occupied);
  assert.equal(copied.count,1);
  assert.deepEqual(slots('2026-11-16',copied.map),[[1,'tempo'],[2,'rehab'],[3,'rehab']]);
  assert.deepEqual(slots('2026-11-23',copied.map),[[2,'rehab'],[3,'tempo']]);
  assert.equal(M.repeat(copied.map,'2026-11-10','2026-11-04',occupied).count,0);
});

test('clearing a month reconciles cross-month moves and preserves past and unrelated changes', () => {
  let map = M.put({},'2026-11-02',{...tempo,to:null});
  map = M.put(map,'2026-11-24',{...tempo,to:'2026-12-03'});
  map = M.put(map,'2026-12-08',{...tempo,to:null});
  const result = M.reset(map,'2026-11','2026-11-04');
  assert.equal(result.count,1);
  assert.deepEqual(Object.keys(result.map),['2026-11-02','2026-12-08']);
  assert.deepEqual(slots('2026-11-30',result.map),[[1,'tempo'],[2,'rehab']]);
});

test('invalid backup keys, references and dates are ignored', () => {
  assert.deepEqual(M.clean({'2026-02-31':[tempo],'2026-11-10':[
    {...tempo,id:'__proto__',to:null},{...tempo,kind:'other',to:null},{...tempo,to:'2026-11-35'}]}),{});
});
