/* Session-local doses. No protocol writes or current-library lookups. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.PlayerDose = api;
  }
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';

  var finite = n => typeof n === 'number' && Number.isFinite(n),
    copy = x => JSON.parse(JSON.stringify(x));
  var work = s => s && (s.kind === 'manual' || s.kind === 'work');
  function at(it, set) {
    var k = Math.max(0, (set || 1) - 1),
      pick = (key, scalar, fallback) => Array.isArray(it[key]) && finite(it[key][k]) ? it[key][k] : finite(it[scalar]) ? it[scalar] : fallback;
    return {
      reps: pick('repsList', 'reps', 1),
      kg: pick('kgList', 'kg', 0),
      sec: pick('secList', 'sec', 30)
    };
  }
  function items(input) {
    return (input || []).map(it => {
      var n = Number.isInteger(it.sets) && it.sets > 0 ? it.sets : 1,
        o = copy(it);
      o.sets = n;
      ['repsList', 'kgList', 'secList'].forEach(key => {
        var scalar = {
          repsList: 'reps',
          kgList: 'kg',
          secList: 'sec'
        }[key];
        o[key] = Array.from({
          length: n
        }, (_, i) => at(it, i + 1)[scalar]);
      });
      return o;
    });
  }
  function key(st) {
    return [st.g == null ? -1 : st.g, st.set || 0, st.kind, st.kind === 'manual' ? '' : st.side || '', st.trans ? 1 : 0, st.go ? 1 : 0, st.nextEx ? 1 : 0].join('|');
  }
  function locks(p, j) {
    var locked = new Set(),
      min = 1,
      last = -1;
    p.steps.forEach((st, i) => {
      if (!work(st) || st.g !== j) {
        return;
      }
      last = i;
      if (i < p.i || p.doneSteps && p.doneSteps[i] || i === p.i && st.kind === 'work') {
        locked.add(st.set);
      }
      if (i === p.i) {
        min = Math.max(min, st.set || 1);
      }
    });
    var cur = p.steps[p.i];
    if (cur && cur.g === j && cur.set) {
      min = Math.max(min, cur.set);
    }
    locked.forEach(n => min = Math.max(min, n));
    return {
      locked: Array.from(locked),
      minSets: min,
      closed: last < p.i
    };
  }
  function editItem(item, patch, guard) {
    guard = guard || {
      locked: [],
      minSets: 1
    };
    var out = items([item])[0],
      n = patch.sets == null ? out.sets : patch.sets;
    if (!Number.isInteger(n) || n < 1 || n > 20) {
      return {
        ok: false,
        error: 'Broj serija mora biti od 1 do 20.'
      };
    }
    if (guard.closed) {
      return {
        ok: false,
        error: 'Ovaj dio treninga je već prošao.'
      };
    }
    if (n < (guard.minSets || 1)) {
      return {
        ok: false,
        error: 'Već započete i odrađene serije ostaju u treningu.'
      };
    }
    var oldN = out.sets;
    out.sets = n;
    ['repsList', 'kgList', 'secList'].forEach(k => {
      var fill = out[k][Math.max(0, oldN - 1)];
      out[k] = out[k].slice(0, n);
      while (out[k].length < n) {
        out[k].push(fill);
      }
    });
    for (var row of patch.rows || []) {
      if (!Number.isInteger(row.set) || row.set < 1) {
        return {
          ok: false,
          error: 'Serija više nije u ovom treningu.'
        };
      }
      if (row.set > n) {
        continue;
      }
      for (var k of ['reps', 'kg', 'sec']) {
        if (row[k] == null) {
          if (k === 'kg' && row.kg === null && guard.allowMissingWeight) out.kgList[row.set-1]=null;
          continue;
        }
        var v = row[k],
          valid = k === 'kg' ? finite(v) && v >= 0 && v <= 5000 : k === 'reps' ? Number.isInteger(v) && v >= 1 && v <= 500 : finite(v) && v >= 1 && v <= 3600;
        if (!valid) {
          return {
            ok: false,
            error: k === 'kg' ? 'Kilogrami moraju biti od 0 do 5.000.' : k === 'reps' ? 'Ponavljanja moraju biti od 1 do 500.' : 'Trajanje serije mora biti od 1 do 3.600 sekundi.'
          };
        }
        if ((guard.locked || []).includes(row.set) && v !== at(item, row.set)[k]) {
          return {
            ok: false,
            error: 'Odrađena ili započeta vremenska serija je zaključana.'
          };
        }
        out[{
          reps: 'repsList',
          kg: 'kgList',
          sec: 'secList'
        }[k]][row.set - 1] = v;
      }
    }
    // New rows inherit the last visible prescription after its edits, unless
    // the form supplied an explicit dose for that newly added row.
    for (let index = oldN; index < n; index++) {
      for (const field of ['reps', 'kg', 'sec']) {
        const explicit = (patch.rows || []).find(row => row.set === index + 1 && row[field] != null);
        if (!explicit) {
          const list = { reps:'repsList', kg:'kgList', sec:'secList' }[field];
          out[list][index] = out[list][oldN - 1];
        }
      }
    }
    return {
      ok: true,
      item: out
    };
  }
  function rebuild(player, updatedItems, buildSchedule) {
    const generated = buildSchedule(updatedItems);
    const pastSteps = player.steps.slice(0, player.i);
    const currentStep = player.steps[player.i];
    const passedKeys = new Set(pastSteps.map(key));
    const currentKey = currentStep && key(currentStep);
    const originalByKey = new Map();
    player.steps.forEach((step, index) => originalByKey.set(key(step), {
      step,
      index
    }));

    // Completed evidence and the current timer survive literally. An unfinished
    // manual set may receive its edited dose without becoming a second set.
    const updatedCurrent = generated.find(step => key(step) === currentKey);
    const current = currentStep && currentStep.kind === 'manual' && !player.doneSteps[player.i] && updatedCurrent ? updatedCurrent : currentStep;
    const futureSteps = generated.filter(step => !passedKeys.has(key(step)) && key(step) !== currentKey && step.kind !== 'prep');
    const steps = pastSteps.concat(current ? [current] : [], futureSteps.map(step => {
      const previous = originalByKey.get(key(step));
      return previous && player.doneSteps[previous.index] ? previous.step : step;
    }));
    const doneSteps = {},
      rir = {};
    steps.forEach((step, index) => {
      const previous = originalByKey.get(key(step));
      if (!previous) {
        return;
      }
      if (player.doneSteps[previous.index]) {
        doneSteps[index] = 1;
      }
      if (player.rir && player.rir[previous.index] != null) {
        rir[index] = player.rir[previous.index];
      }
    });
    return {
      items: updatedItems,
      steps,
      i: pastSteps.length,
      doneSteps,
      rir
    };
  }
  function rows(player, itemIndex, claimAll) {
    const item = player.items[itemIndex];
    const expectedSides = item.sides ? 2 : 1;
    const bySet = new Map();
    player.steps.forEach((step, index) => {
      if (!work(step) || step.g !== itemIndex || !claimAll && !player.doneSteps[index]) {
        return;
      }
      const setNumber = step.set || 1;
      const dose = at(step.it || item, setNumber);
      let row = bySet.get(setNumber);
      if (!row) {
        row = {
          set: setNumber,
          reps: dose.reps,
          kg: dose.kg,
          sec: dose.sec,
          sides: 0,
          reserve: null,
          seen: new Set()
        };
        bySet.set(setNumber, row);
      }
      const side = step.kind === 'manual' ? 'both' : step.side || 'single';
      if (!row.seen.has(side)) {
        row.seen.add(side);
        row.sides += step.kind === 'manual' ? expectedSides : 1;
      }
      if (step.side !== 'Lijeva strana' && player.rir && player.rir[index] != null) {
        row.reserve = player.rir[index];
      }
    });
    return Array.from(bySet.values()).sort((a, b) => a.set - b.set).map(row => {
      delete row.seen;
      row.sides = Math.min(expectedSides, row.sides);
      return row;
    });
  }
  // Derive every row from the same work steps that feed history. A position in
  // the schedule is not evidence of completion (skips and both sides matter).
  function checklist(item, player, group) {
    const count = Number.isInteger(item.sets) && item.sets > 0 ? item.sets : 1;
    const result = Array.from({length:count}, (_,index) => ({
      set:index + 1, dose:at(item,index + 1), state:player ? 'waiting' : 'planned',
      current:false, step:null, left:false, right:false, reserve:null
    }));
    if (!player) return result;
    const seen = new Map();
    player.steps.forEach((step,index) => {
      const row = result[step.set - 1];
      if (step.g !== group || !work(step) || !row) return;
      let summary = seen.get(row.set);
      if (!summary) { summary = {last:index, done:false}; seen.set(row.set,summary); }
      summary.last = index;
      const done = !!player.doneSteps?.[index];
      if (done || index === player.i) row.dose = at(step.it || item,row.set);
      if (index === player.i && !player.done) {
        row.current = true;
        if (step.kind === 'manual' && !done && !player.paused) row.step = index;
      }
      if (!done) return;
      summary.done = true;
      if (item.sides) {
        if (step.kind === 'manual' || step.side === 'Lijeva strana') row.left = true;
        if (step.kind === 'manual' || step.side === 'Desna strana') row.right = true;
      }
      if (step.side !== 'Lijeva strana' && finite(player.rir?.[index])) row.reserve = player.rir[index];
    });
    for (const row of result) {
      const entry = seen.get(row.set);
      if (entry?.done) row.state = !item.sides || (row.left && row.right) ? 'done' : 'partial';
      else if (row.current) row.state = 'active';
      else if (entry && (entry.last < player.i || player.done)) row.state = 'skipped';
    }
    return result;
  }
  function completeSets(p, j) {
    var expected = p.items[j].sides ? 2 : 1;
    return rows(p, j, false).filter(r => r.sides === expected).length;
  }
  function changed(p, j, actual) {
    var baseline = p.originalItems && p.originalItems[j];
    if (!baseline || !actual.length) {
      return false;
    }
    var current = p.items[j];
    return current.sets !== (baseline.sets || 1) || actual.some(r => r.set > (baseline.sets || 1) || ['reps', 'kg', 'sec'].some(k => (k !== 'sec' || current.measure === 'time') && (k !== 'reps' || current.measure !== 'time') && r[k] !== at(baseline, r.set)[k]));
  }
  function logDose(p, j, answer) {
    var it = p.items[j],
      actual = answer === 'skip' ? [] : rows(p, j, answer === true),
      out = {
        setNumbers: actual.map(r => r.set),
        sideCounts: actual.map(r => r.sides),
        setsDone: actual.length
      };
    var fields = it.measure === 'time' ? ['sec', 'kg'] : ['reps', 'kg'];
    fields.forEach(k => {
      var list = actual.map(r => r[k]);
      if (list.length && list.some(v => v !== (finite(it[k]) ? it[k] : k === 'kg' ? 0 : k === 'reps' ? 1 : 30))) {
        out[k + 'List'] = list;
      }
    });
    if (Array.isArray(it.repsList) && it.measure !== 'time' && actual.length) {
      out.repsList = actual.map(r => r.reps);
    }
    if (actual.length !== (it.sets || 1) || actual.some(r => r.sides !== (it.sides ? 2 : 1))) {
      out.setsDone = actual.length;
    }
    if (changed(p, j, actual)) {
      out.liveDoseChanged = true;
    }
    var reserve = actual.map(r => r.reserve);
    if (reserve.some(v => v !== null)) {
      out[it.measure === 'time' ? 'sirList' : 'rirList'] = reserve;
    }
    return {
      fields: out,
      rows: actual
    };
  }
  function packSteps(steps) {
    return steps.map(st => {
      var out = {};
      Object.keys(st).forEach(k => {
        if (!['e', 'it', 'b'].includes(k) && st[k] !== undefined) {
          out[k] = copy(st[k]);
        }
      });
      if (st.it) {
        out.dose = at(st.it, st.set || 1);
      }
      return out;
    });
  }
  function restoreSteps(saved, input, resolve) {
    if (!Array.isArray(saved) || saved.length > 3000) {
      return null;
    }
    var out = [];
    for (var row of saved) {
      if (!row || typeof row !== 'object' || !['prep', 'manual', 'work', 'rest', 'switch', 'ready'].includes(row.kind)) {
        return null;
      }
      var st = copy(row),
        g = st.g;
      if (!Number.isInteger(g) || g < 0 || g >= input.length) {
        return null;
      }
      if (st.set != null && (!Number.isInteger(st.set) || st.set < 1 || st.set > 20)) {
        return null;
      }
      var it = copy(input[g]);
      if (st.dose) {
        for (var k of ['reps', 'kg', 'sec']) {
          if (!finite(st.dose[k]) || st.dose[k] < 0) {
            return null;
          }
        }
        var set = st.set || 1;
        for (var k of ['reps', 'kg', 'sec']) {
          it[k] = st.dose[k];
          var list = k + 'List';
          it[list] = Array.isArray(it[list]) ? it[list].slice() : [];
          it[list][set - 1] = st.dose[k];
        }
        delete st.dose;
      }
      if (st.kind !== 'prep') {
        st.it = it;
        st.e = resolve(it.exId);
      }
      if (st.dur != null && (!finite(st.dur) || st.dur < 0 || st.dur > 3600)) {
        return null;
      }
      out.push(st);
    }
    return out;
  }
  function number(value) {
    var s = String(value).trim().replace(',', '.');
    return s !== '' && /^(?:\d+(?:\.\d*)?|\.\d+)$/.test(s) ? Number(s) : null;
  }
  function readForm(form) {
    var sets = number(form.querySelector('[name="sets"]').value),
      rs = [];
    for (var el of form.querySelectorAll('[data-dose-set]')) {
      var row = {
        set: Number(el.dataset.doseSet)
      };
      for (var input of el.querySelectorAll('[data-dose-value]')) {
        if (input.dataset.unknownKg === 'true' && input.value.trim() === '') {
          row.kg=null;
          continue;
        }
        var n = number(input.value);
        if (n === null) {
          return {
            ok: false,
            error: 'Upiši vrijednost u svako polje serije.'
          };
        }
        row[input.dataset.doseValue] = n;
      }
      rs.push(row);
    }
    return {
      ok: true,
      patch: {
        sets: sets,
        rows: rs
      }
    };
  }
  return {
    version: 1,
    at: at,
    items: items,
    key: key,
    locks: locks,
    editItem: editItem,
    rebuild: rebuild,
    rows: rows,
    completeSets: completeSets,
    checklist: checklist,
    logDose: logDose,
    packSteps: packSteps,
    restoreSteps: restoreSteps,
    readForm: readForm
  };
});
