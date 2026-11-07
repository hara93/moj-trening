'use strict';

const test = require('node:test'),
  assert = require('node:assert/strict'),
  D = require('../player-dose.js');
const item = (id = 'a') => ({
  exId: id,
  measure: 'sets',
  sets: 3,
  reps: 8,
  kg: 20,
  sec: 30
});
function build(items) {
  const out = [{
    kind: 'prep',
    g: 0,
    dur: 5
  }];
  for (let s = 1; s <= Math.max(...items.map(x => x.sets)); s++) {
    for (let g = 0; g < items.length; g++) {
      const it = items[g];
      if (s > it.sets) {
        continue;
      }
      out.push({
        kind: 'manual',
        g,
        set: s,
        it,
        ss: {
          L: 'A',
          k: g + 1,
          size: items.length
        }
      });
      out.push({
        kind: 'rest',
        g,
        set: s,
        it,
        dur: 30
      });
    }
  }
  return out;
}
function player() {
  let items = D.items([item(), item('b')]);
  return {
    items,
    originalItems: JSON.parse(JSON.stringify(items)),
    steps: build(items),
    i: 4,
    doneSteps: {
      1: 1
    },
    rir: {
      1: 2
    },
    paused: false,
    left: 17
  };
}
test('session items are detached; future per-set reps/kg edits leave completed values and protocol untouched', () => {
  let source = [item()],
    p = player(),
    guard = D.locks(p, 0);
  let r = D.editItem(p.items[0], {
    sets: 3,
    rows: [{
      set: 2,
      reps: 10,
      kg: 25
    }]
  }, guard);
  assert.equal(r.ok, true);
  assert.equal(D.at(r.item, 1).kg, 20);
  assert.equal(D.at(r.item, 2).kg, 25);
  assert.equal(source[0].kg, 20);
  assert.equal(p.items[0].kgList[1], 20);
  assert.equal(D.editItem(p.items[0], {
    rows: [{
      set: 1,
      kg: 25
    }]
  }, guard).ok, false);
});
test('schedule rebuild preserves current rest/time, passed and completed steps and RIR through superset set changes', () => {
  let p = player();
  p.i = 2;
  let r = D.editItem(p.items[1], {
    sets: 2,
    rows: [{
      set: 2,
      kg: 30
    }]
  }, D.locks(p, 1));
  assert.equal(r.ok, true);
  let fresh = D.rebuild(p, [p.items[0], r.item], build);
  assert.equal(fresh.i, 2);
  assert.equal(fresh.steps[2], p.steps[2]);
  assert.equal(p.left, 17);
  assert.equal(fresh.doneSteps[1], 1);
  assert.equal(fresh.rir[1], 2);
  assert.equal(fresh.steps.filter(s => s.kind === 'manual' && s.g === 1).length, 2);
});
test('rebuilding after superset removal keeps passed rounds behind the editable current set', () => {
  const items = D.items([{...item(),sets:2},{...item('b'),sets:2}]);
  function buildRounds(doses) {
    const first = doses.map((it,g)=>({kind:'manual',it,g,set:1}));
    const second = doses.map((it,g)=>({kind:'manual',it,g,set:2}));
    return [{kind:'prep',g:0,dur:5},...first,{...first.at(-1),kind:'rest',dur:30},...second];
  }
  const p = {items,steps:buildRounds(items),i:4,doneSteps:{1:1},rir:{1:2}};
  const {timeline,dropCurrent} = D.removeExercise(p,1,[items[0]],buildRounds);
  assert.equal(dropCurrent,false);
  const edited = D.editItem(items[0],{rows:[{set:2,reps:12}]}).item;
  const fresh = D.rebuild({...p,...timeline,liveBaseItems:[items[0]]},[edited],buildRounds);
  assert.equal(fresh.steps[fresh.i].set,2);
  assert.equal(D.at(fresh.steps[fresh.i].it,2).reps,12);
  assert.deepEqual(fresh.steps.map(step=>step.kind),['prep','manual','manual']);
  assert.deepEqual(fresh.doneSteps,{1:1});
  assert.deepEqual(fresh.rir,{1:2});
});
test('noncontiguous completed rounds retain original set ordinals, doses and reserve masks', () => {
  let p = player();
  p.doneSteps = {
    5: 1,
    9: 1
  };
  p.rir = {
    5: 1,
    9: 3
  };
  let rows = D.rows(p, 0, false);
  assert.deepEqual(rows.map(r => r.set), [2, 3]);
  assert.deepEqual(rows.map(r => r.reserve), [1, 3]);
  let log = D.logDose(p, 0, 'partial').fields;
  assert.deepEqual(log.setNumbers, [2, 3]);
  assert.deepEqual(log.rirList, [1, 3]);
  assert.equal(log.setsDone, 2);
});
test('two completed left holds in different rounds never become one full bilateral set', () => {
  let items = D.items([{
    ...item(),
    measure: 'time',
    sides: true,
    sets: 2
  }]);
  let steps = [{
    kind: 'work',
    g: 0,
    set: 1,
    side: 'Lijeva strana',
    it: items[0],
    dur: 30
  }, {
    kind: 'work',
    g: 0,
    set: 1,
    side: 'Desna strana',
    it: items[0],
    dur: 30
  }, {
    kind: 'work',
    g: 0,
    set: 2,
    side: 'Lijeva strana',
    it: items[0],
    dur: 30
  }, {
    kind: 'work',
    g: 0,
    set: 2,
    side: 'Desna strana',
    it: items[0],
    dur: 30
  }];
  let p = {
    items,
    steps,
    i: 3,
    doneSteps: {
      0: 1,
      2: 1
    }
  };
  assert.equal(D.completeSets(p, 0), 0);
  let x = D.logDose(p, 0, 'partial').fields;
  assert.deepEqual(x.sideCounts, [1, 1]);
  assert.deepEqual(x.setNumbers, [1, 2]);
  assert.equal(x.setsDone, 2);
  assert.equal(D.editItem(items[0], {
    rows: [{
      set: 1,
      sec: 20
    }]
  }, D.locks(p, 0)).ok, false);
});
test('compact saved schedule round-trips exact doses without exercise/library dose inference', () => {
  let p = player();
  p.items[0].kgList[1] = 27.5;
  p.steps = build(p.items);
  let packed = D.packSteps(p.steps),
    restored = D.restoreSteps(JSON.parse(JSON.stringify(packed)), p.items, id => ({
      id,
      name: 'Current text'
    }));
  assert.equal(restored.length, p.steps.length);
  assert.equal(D.at(restored[5].it, 2).kg, 27.5);
  assert.equal(restored[5].e.id, 'a');
  assert.equal(D.restoreSteps([{
    kind: 'work',
    g: 99
  }], p.items, () => ({})), null);
});
test('performed changed prescription is flagged, while unused future edits are not', () => {
  let p = player();
  p.items[0].kgList[1] = 30;
  p.steps = build(p.items);
  assert.equal(D.logDose(p, 0, 'partial').fields.liveDoseChanged, undefined);
  p.doneSteps[5] = 1;
  assert.equal(D.logDose(p, 0, 'partial').fields.liveDoseChanged, true);
});
test('editing the current unfinished manual dose keeps one stable set and logs its corrected dose', () => {
  const input = D.items([item()]);
  const schedule = items => [{
    kind: 'prep',
    g: 0,
    dur: 5
  }, ...items.flatMap((it, g) => Array.from({
    length: it.sets
  }, (_, i) => {
    const dose = D.at(it, i + 1);
    return {
      kind: 'manual',
      g,
      set: i + 1,
      it,
      side: dose.reps + ' pon. · ' + dose.kg + ' kg'
    };
  }))];
  const active = {
    items: input,
    originalItems: JSON.parse(JSON.stringify(input)),
    steps: schedule(input),
    i: 1,
    doneSteps: {},
    rir: {}
  };
  const edited = D.editItem(input[0], {
    rows: [{
      set: 1,
      reps: 3,
      kg: 30
    }]
  }, D.locks(active, 0));
  assert.equal(edited.ok, true);
  const rebuilt = D.rebuild(active, [edited.item], schedule);
  assert.equal(rebuilt.steps.filter(s => s.kind === 'manual' && s.set === 1).length, 1);
  assert.equal(rebuilt.steps[1].side, '3 pon. · 30 kg');
  const completed = {
    ...active,
    ...rebuilt,
    doneSteps: {
      1: 1
    }
  };
  assert.equal(D.rows(completed, 0, false)[0].reps, 3);
  assert.equal(D.rows(completed, 0, false)[0].kg, 30);
});
test('adding a set uses the latest visible edited prescription and schedule checkpoints omit undefined optional fields', () => {
  const source = D.items([{ ...item(), sets:2 }])[0];
  const edited = D.editItem(source, {
    sets:3,
    rows:[{ set:2, reps:3, kg:30 }]
  }, { locked:[], minSets:1 });
  assert.equal(edited.ok,true);
  assert.deepEqual(edited.item.repsList,[8,3,3]);
  assert.deepEqual(edited.item.kgList,[20,30,30]);
  const saved = D.packSteps([{kind:'rest',g:0,set:1,it:source,ss:undefined,dur:60}]);
  assert.equal(Object.hasOwn(saved[0],'ss'),false);
  assert.equal(D.restoreSteps(saved,[source],()=>({name:'Exercise'}))[0].dur,60);
});


test('sparse preview edits preserve unknown per-set weights and explicit zero across added sets',()=>{
  const source={...item(),kg:0,kgList:[10,null,0]};
  const edited=D.editItem(source,{rows:[{set:1,reps:7}]},{allowMissingWeight:true});
  assert.equal(edited.ok,true);assert.deepEqual(edited.item.kgList,[10,null,0]);assert.equal(edited.item.repsList[0],7);
  assert.deepEqual(source.kgList,[10,null,0]);
  const extended=D.editItem({...source,sets:2,kgList:[10,null]},{sets:3},{allowMissingWeight:true});
  assert.equal(extended.ok,true);assert.deepEqual(extended.item.kgList,[10,null,null]);
});
