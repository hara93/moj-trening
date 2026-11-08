/* SetPace: his own seconds per repetition, learned from the real set durations the player saved (durList, 1.22.1).
   Pure: no storage, no clock, no current library. The app uses it only where it would otherwise guess (3 s per rep,
   20 s for a drill at the pitch); his own set time ("Vrijeme serije") or an item's tempo (repSec) always wins. */
(function(root,factory){
  'use strict';
  var history = typeof module === 'object' && module.exports ? require('./history-model.js') : root.HistoryModel;
  var api = factory(history);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.SetPace = api;
})(typeof window !== 'undefined' ? window : null,function(History){
  'use strict';
  var SESSIONS = 3, MIN_DURATIONS = 2, MIN_REP = 1, MAX_REP = 15, MAX_REP_DRILL = 60, MAX_SET = 300;
  var plain = function(o){return !!o && typeof o === 'object' && !Array.isArray(o);};
  var finite = function(n){return typeof n === 'number' && Number.isFinite(n);};
  // Seconds per repetition of each set with a saved duration. A set of 8 reps on both sides counts 16 repetitions;
  // a set with only one side done counts that side alone (sideCounts).
  function perRep(item){
    if (!plain(item) || item.measure === 'time' || !Array.isArray(item.durList)) return [];
    var rows = History.recordedRows(item) || [], out = [];
    rows.forEach(function(row, index){
      var seconds = item.durList[index];
      if (!Number.isInteger(seconds) || seconds < 1 || seconds > MAX_SET) return;
      if (!Number.isInteger(row.reps) || row.reps < 1 || (row.sides !== 1 && row.sides !== 2)) return;
      out.push(seconds / (row.reps * row.sides));
    });
    return out;
  }
  function median(values){
    var list = values.filter(finite).slice().sort(function(a, b){return a - b;}), n = list.length;
    if (!n) return null;
    return n % 2 ? list[(n - 1) / 2] : (list[n / 2 - 1] + list[n / 2]) / 2;
  }
  // Every exercise with enough of his own durations: the median over the last 3 sessions that timed it, at least 2
  // durations, clamped to 1–15 s per repetition (opts.maxRep(id) may give another cap, e.g. 60 s for a drill at the
  // pitch, whose generic guess is 20 s) and rounded to 0.1 s. Sessions are taken newest first; a workout saved
  // twice under one historyId (an edit) counts once.
  function index(log, opts){
    var seen = new Set(), sessions = new Map(), values = new Map();
    (Array.isArray(log) ? log : []).filter(function(entry){
      return plain(entry) && finite(entry.at) && Array.isArray(entry.items) && (entry.kind == null || entry.kind === 'protocol' || entry.kind === 'exercise');
    }).slice().sort(function(a, b){return b.at - a.at;}).forEach(function(entry){
      if (typeof entry.historyId === 'string') {
        if (seen.has(entry.historyId)) return;
        seen.add(entry.historyId);
      }
      var found = new Map();
      entry.items.forEach(function(item){
        if (!plain(item) || typeof item.exId !== 'string') return;
        var rep = perRep(item);
        if (rep.length) found.set(item.exId, (found.get(item.exId) || []).concat(rep));
      });
      found.forEach(function(rep, id){
        var count = sessions.get(id) || 0;
        if (count >= SESSIONS) return;
        sessions.set(id, count + 1);
        values.set(id, (values.get(id) || []).concat(rep));
      });
    });
    var out = new Map();
    values.forEach(function(list, id){
      if (list.length < MIN_DURATIONS) return;
      var cap = opts && typeof opts.maxRep === 'function' ? opts.maxRep(id) : MAX_REP;
      if (!finite(cap) || cap < MIN_REP) cap = MAX_REP;
      out.set(id, Math.round(Math.max(MIN_REP, Math.min(cap, median(list))) * 10) / 10);
    });
    return out;
  }
  function repSeconds(log, exerciseId, opts){
    var value = index(log, opts).get(exerciseId);
    return value === undefined ? null : value;
  }
  return Object.freeze({version:1, SESSIONS:SESSIONS, MIN_DURATIONS:MIN_DURATIONS, MIN_REP:MIN_REP, MAX_REP:MAX_REP, MAX_REP_DRILL:MAX_REP_DRILL,
    perRep:perRep, median:median, index:index, repSeconds:repSeconds});
});
