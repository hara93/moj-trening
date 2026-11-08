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
  // Older manual steps carry a prescription as their caption and cover both sides.
  function splitSide(step) {
    if (!work(step)) return null;
    if (step.side === 'Lijeva strana') return 'left';
    if (step.side === 'Desna strana') return 'right';
    return null;
  }
  function setWorkEnd(step) {
    return !!work(step) && splitSide(step) !== 'left';
  }
  function at(it, set) {
    var k = Math.max(0, (set || 1) - 1),
      pick = (key, scalar, fallback) => Array.isArray(it[key]) && finite(it[key][k]) ? it[key][k] : finite(it[scalar]) ? it[scalar] : fallback;
    return {
      reps: pick('repsList', 'reps', 1),
      kg: pick('kgList', 'kg', 0),
      sec: pick('secList', 'sec', 30)
    };
  }
  function validActualReps(reps) {
    return Number.isInteger(reps) && reps >= 1 && reps <= 60;
  }
  function validRepSetSeconds(seconds) {
    return Number.isInteger(seconds) && seconds >= 1 && seconds <= 3600;
  }
  function validActualSeconds(seconds) {
    return Number.isInteger(seconds) && seconds >= 0 && seconds <= 3600;
  }
  // 1.22.1: the raw time of a rep step he ended by a tap (whole seconds, pauses excluded).
  const validActualDur = validActualSeconds;
  // The forgotten-tap guard: a set's real duration is kept only from 1 s up to max(60 s, 3 × its estimate), and never
  // over 300 s. Longer means he most likely forgot to tap, so the duration stays unknown.
  const SET_DURATION_MAX = 300;
  function validSetDuration(seconds, estimate) {
    const planned = finite(estimate) && estimate > 0 ? estimate : 0;
    return Number.isInteger(seconds) && seconds >= 1 && seconds <= Math.min(SET_DURATION_MAX, Math.max(60, 3 * planned));
  }
  // The set's duration over its rep steps (both sides of a set played as two steps): known only when every side that
  // counts was timed live, and within the guard. claimAll counts the sides not done as well (the done screen's "Sve
  // odrađeno"), so such a set stays unknown.
  function setDuration(player, group, set, claimAll) {
    let total = 0, estimate = 0, timed = 0;
    for (let index = 0; index < player.steps.length; index++) {
      const step = player.steps[index];
      if (!step || step.kind !== 'manual' || step.g !== group || (step.set || 1) !== set) continue;
      if (!player.doneSteps?.[index]) {
        if (claimAll) return null;
        continue;
      }
      if (!validActualDur(step.actualDur)) return null;
      total += step.actualDur; timed++;
      estimate += finite(step.targetSec) ? step.targetSec : 0;
    }
    return timed && validSetDuration(total, estimate) ? total : null;
  }
  const repSetSecondsError = 'Vrijeme serije mora biti cijeli broj od 1 do 3.600 sekundi.';
  function recordedAt(step, item) {
    const dose = at(step.it || item, step.set);
    if (step.kind === 'manual' && validActualReps(step.actualReps)) dose.reps = step.actualReps;
    if (step.kind === 'work') {
      if (validActualSeconds(step.actualSec)) dose.sec = step.actualSec;
      else if (finite(step.dur)) dose.sec = step.dur;
    }
    return dose;
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
    const side = st.kind === 'manual' ? splitSide(st) : st.side;
    return [st.g == null ? -1 : st.g, st.set || 0, st.kind, side || '', st.trans ? 1 : 0, st.go ? 1 : 0, st.nextEx ? 1 : 0].join('|');
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
    if (Object.hasOwn(patch, 'repSetSec')) {
      const seconds = patch.repSetSec;
      if (seconds === null) delete out.repSetSec;
      else {
        if (!validRepSetSeconds(seconds)) return {ok:false,error:repSetSecondsError};
        if (item.measure === 'time') return {ok:false,error:'Cilj vremena uređuje se za serije na ponavljanja.'};
        out.repSetSec = seconds;
      }
    }
    // Preview and pending replacements retain unknown loads across sparse edits.
    if (guard.allowMissingWeight && Array.isArray(item.kgList)) {
      item.kgList.forEach((value,index) => { if (value === null && index < out.sets) out.kgList[index]=null; });
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
            error: 'Odrađena ili započeta serija je zaključana.'
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
  function rebuild(player, updatedItems, buildSchedule, options = {}) {
    const generated = buildSchedule(updatedItems);
    const pastSteps = player.steps.slice(0, player.i);
    const currentStep = options.dropCurrent ? null : player.steps[player.i];
    const passedKeys = new Set(pastSteps.map(key));
    const currentKey = currentStep && key(currentStep);
    const originalByKey = new Map();
    const startedSplitSets = new Set();
    player.steps.forEach((step, index) => {
      originalByKey.set(key(step), {step,index});
      if (step.kind === 'manual' && splitSide(step) && (index < player.i || player.doneSteps[index])) {
        startedSplitSets.add(step.g + ':' + step.set);
      }
    });
    // A new exercise-wide timer applies to future sets. The other side of a
    // started set still uses the same original prescription.
    const frozenSplitSet = step => step?.kind === 'manual' && splitSide(step) && startedSplitSets.has(step.g + ':' + step.set);

    // Preserve the current timed step unless the player explicitly retimes it.
    // Completed steps always keep their original dose.
    const updatedCurrent = generated.find(step => key(step) === currentKey);
    const editableCurrent = currentStep?.kind === 'manual' || options.retimeCurrent && currentStep?.kind === 'work';
    const current = !options.afterPassed && editableCurrent && !frozenSplitSet(currentStep) && !player.doneSteps[player.i] && updatedCurrent ? updatedCurrent : currentStep;
    // Rebuilding again after a removal can generate a rest for an earlier
    // round that ended differently before the exercise was removed.
    const after = options.afterPassed || player.liveBaseItems
      ? generated.findLastIndex(step => passedKeys.has(key(step)) || key(step) === currentKey) + 1
      : 0;
    const futureSteps = generated.slice(after).filter(step => !passedKeys.has(key(step)) && key(step) !== currentKey && step.kind !== 'prep');
    const steps = pastSteps.concat(current ? [current] : [], futureSteps.map(step => {
      const previous = originalByKey.get(key(step));
      return previous && (player.doneSteps[previous.index] || frozenSplitSet(step)) ? previous.step : step;
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
  function removeExercise(player, group, updatedItems, buildSchedule) {
    const steps = [], doneSteps = {}, rir = {};
    let i = 0, dropCurrent = false;
    player.steps.forEach((step, index) => {
      // The initial preparation belongs to the whole workout. Timed
      // transitions and preparation inserted later belong to an occurrence.
      const initialPrep = index === 0 && step.kind === 'prep' && !step.set;
      if (!initialPrep && step.g === group) {
        if (index === player.i) dropCurrent = true;
        return;
      }
      if (player.doneSteps[index]) doneSteps[steps.length] = player.doneSteps[index];
      if (player.rir?.[index] != null) rir[steps.length] = player.rir[index];
      steps.push(step.g > group ? {...step,g:step.g-1} : step);
      if (index < player.i) i++;
    });
    // Steps that no longer belong to the new timeline must not be reinserted
    // before the position the player already reached.
    return {timeline:rebuild({...player,steps,doneSteps,rir,i},updatedItems,buildSchedule,{dropCurrent,afterPassed:true}),dropCurrent};
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
      const dose = player.doneSteps?.[index] ? recordedAt(step, item) : at(step.it || item, setNumber);
      let row = bySet.get(setNumber);
      if (!row) {
        row = {
          set: setNumber,
          reps: dose.reps,
          kg: dose.kg,
          sec: dose.sec,
          seconds: 0,
          sides: 0,
          reserve: null,
          seen: new Set()
        };
        bySet.set(setNumber, row);
      }
      const side = splitSide(step) || (step.kind === 'manual' && item.sides ? 'both' : 'single');
      if (!row.seen.has(side)) {
        row.seen.add(side);
        row.sides += side === 'both' ? 2 : 1;
        if (step.kind === 'work') row.seconds += dose.sec;
      }
      if (setWorkEnd(step) && player.rir && player.rir[index] != null) {
        row.reserve = player.rir[index];
      }
    });
    return Array.from(bySet.values()).sort((a, b) => a.set - b.set).map(row => {
      delete row.seen;
      row.sides = Math.min(expectedSides, row.sides);
      // History stores seconds per recorded side. Keep the total exact when
      // the left and right holds have different durations.
      if (item.measure === 'time' && row.sides) row.sec = row.seconds / row.sides;
      delete row.seconds;
      if (item.measure !== 'time') row.dur = setDuration(player, itemIndex, row.set, claimAll);
      return row;
    });
  }
  // Derive every row from the same work steps that feed history. A position in
  // the schedule is not evidence of completion (skips and both sides matter).
  function checklist(item, player, group) {
    const count = Number.isInteger(item.sets) && item.sets > 0 ? item.sets : 1;
    const result = Array.from({length:count}, (_,index) => ({
      set:index + 1, dose:at(item,index + 1), state:player ? 'waiting' : 'planned',
      current:false, step:null, left:false, right:false, reserve:null, dur:null
    }));
    if (!player) return result;
    const seen = new Map();
    player.steps.forEach((step,index) => {
      const row = result[step.set - 1];
      if (step.g !== group || !work(step) || !row) return;
      let summary = seen.get(row.set);
      if (!summary) { summary = {last:index, done:false, seconds:0, sides:0}; seen.set(row.set,summary); }
      summary.last = index;
      const done = !!player.doneSteps?.[index];
      if (done) row.dose = recordedAt(step, item);
      else if (index === player.i) row.dose = at(step.it || item,row.set);
      if (index === player.i && !player.done) {
        row.current = true;
        if (!done && !player.paused) row.step = index;
      }
      if (!done) return;
      summary.done = true;
      const side = splitSide(step);
      if (step.kind === 'work') {
        const seconds = row.dose.sec;
        summary.seconds += seconds; summary.sides++;
        if (side === 'left') summary.leftSec = seconds;
        if (side === 'right') summary.rightSec = seconds;
      }
      if (item.sides) {
        const combined = step.kind === 'manual' && !side;
        if (combined || side === 'left') row.left = true;
        if (combined || side === 'right') row.right = true;
      }
      if (setWorkEnd(step) && finite(player.rir?.[index])) row.reserve = player.rir[index];
    });
    for (const row of result) {
      const entry = seen.get(row.set);
      if (entry?.done) row.state = !item.sides || (row.left && row.right) ? 'done' : 'partial';
      else if (row.current) row.state = 'active';
      else if (entry && (entry.last < player.i || player.done)) row.state = 'skipped';
      if (row.state === 'done' && entry?.sides) row.dose.sec = entry.seconds / entry.sides;
      row.dur = row.state === 'done' && item.measure !== 'time' ? setDuration(player, group, row.set, false) : null;
      const planned = at(item,row.set).sec;
      if (entry && [entry.leftSec,entry.rightSec].some(seconds => seconds !== undefined && seconds !== planned)) {
        row.leftSec = entry.leftSec;
        row.rightSec = entry.rightSec;
      }
    }
    return result;
  }
  function completeSets(p, j) {
    var expected = p.items[j].sides ? 2 : 1;
    return rows(p, j, false).filter(r => r.sides === expected).length;
  }
  function changed(p, j, actual) {
    var baseline = (p.liveBaseItems || p.originalItems)?.[j];
    if (!baseline || !actual.length) {
      return false;
    }
    var current = p.items[j];
    if (current.measure === 'time' && p.steps.some((step,index) => step.kind === 'work' && step.g === j &&
      p.doneSteps[index] && recordedAt(step,current).sec !== at(baseline,step.set).sec)) return true;
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
    // 1.22.1: the real duration of each rep set, null = not known (not timed live, or over the guard)
    var durations = actual.map(r => r.dur == null ? null : r.dur);
    if (it.measure !== 'time' && durations.some(v => v !== null)) {
      out.durList = durations;
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
  function maxScheduleSteps(itemCount) {
    // Each occurrence can have 20 sets with work, side changes and rest,
    // plus transitions and preparation inserted during the session.
    return Math.max(3000, itemCount * 128);
  }
  function restoreSteps(saved, input, resolve) {
    if (!Array.isArray(saved) || saved.length > maxScheduleSteps(input.length)) {
      return null;
    }
    var out = [];
    for (var row of saved) {
      if (!row || typeof row !== 'object' || !['prep', 'manual', 'work', 'rest', 'switch', 'ready'].includes(row.kind)) {
        return null;
      }
      var st = copy(row),
        g = st.g;
      if (st.kind !== 'manual' || !validActualReps(st.actualReps)) delete st.actualReps;
      if (st.kind !== 'work' || !validActualSeconds(st.actualSec)) delete st.actualSec;
      if (st.kind !== 'manual' || !validActualDur(st.actualDur)) delete st.actualDur;
      if (st.kind !== 'manual' || !finite(st.targetSec) || st.targetSec < 1 || st.targetSec > 3600) delete st.targetSec;
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
    const patch = {sets:sets,rows:rs};
    const timer = form.querySelector('[name="repSetSec"]');
    if (timer) {
      const raw = timer.value.trim();
      const seconds = raw === '' ? null : number(raw);
      if (raw !== '' && !validRepSetSeconds(seconds)) return {ok:false,error:repSetSecondsError};
      patch.repSetSec = seconds;
    }
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
      patch: patch
    };
  }
  return {
    version: 1,
    at: at,
    recordedAt: recordedAt,
    validActualReps: validActualReps,
    validRepSetSeconds: validRepSetSeconds,
    validActualDur: validActualDur,
    validSetDuration: validSetDuration,
    setDuration: setDuration,
    splitSide: splitSide,
    setWorkEnd: setWorkEnd,
    items: items,
    key: key,
    locks: locks,
    editItem: editItem,
    rebuild: rebuild,
    removeExercise: removeExercise,
    rows: rows,
    completeSets: completeSets,
    checklist: checklist,
    logDose: logDose,
    packSteps: packSteps,
    maxScheduleSteps: maxScheduleSteps,
    restoreSteps: restoreSteps,
    readForm: readForm
  };
});
