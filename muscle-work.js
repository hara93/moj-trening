/* MuscleWork v1: recorded work sets, separate from LM1 effort/fatigue estimates.
   Profiles are copied when a session finishes; old logs are never reclassified.
   Secondary work is retained as an integer count and displayed at a 0.5 credit.
   No weekly target, recovery claim, name-based classification or browser state. */
(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.MuscleWork = api;
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';
  var VERSION = 1, MAX_SETS = 1000;
  var GROUP_ROWS = [
    ['chest','Prsa','front_chest'], ['frontDelts','Prednja ramena','front_shoulders'],
    ['biceps','Biceps','front_biceps'], ['forearms','Podlaktice','front_forearms'],
    ['abs','Trbušni mišići','front_abs'], ['obliques','Kosi trbušni mišići','front_obliques'],
    ['hipFlexors','Pregibači kuka','front_hip_flexors'], ['adductors','Aduktori','front_adductors'],
    ['quadriceps','Kvadriceps','front_quadriceps'], ['upperBack','Gornja leđa i trapez','back_upper_back_trapezius'],
    ['lats','Široki leđni mišići','back_latissimus'], ['lowerBack','Donja leđa','back_lower_back'],
    ['rearDelts','Stražnja ramena','back_rear_shoulders'], ['triceps','Triceps','back_triceps'],
    ['glutes','Gluteus','back_glutes'], ['gluteMedius','Gluteus medius','back_gluteus_medius'],
    ['hamstrings','Stražnja loža','back_hamstrings'], ['calves','Listovi','back_calves']
  ];
  var groups = GROUP_ROWS.map(function (r) { return { id:r[0], label:r[1], regions:[r[2]] }; });
  var groupIds = groups.map(function (g) { return g.id; }), regionToGroup = {};
  groups.forEach(function (g) { g.regions.forEach(function (r) { regionToGroup[r] = g.id; }); });
  var ELIGIBLE = ['Snaga','Trup'];
  var EXCLUDED = ['Rehab','Rehabilitacija','Mobilnost','Aktivacija','Eksplozivnost','Skokovi i bacanja','Kondicija'];
  var ELIGIBILITY = ['excluded','eligible','unknown'];
  var ELIGIBILITY_SOURCE = ['explicit','category','unknown','warmup'];
  var COMPLETION = ['complete','partial','skipped','unknown','planned'];
  var SOURCE = ['completed','planned'];
  var has = function (o,k) { return Object.prototype.hasOwnProperty.call(o,k); };
  var plain = function (o) { return !!o && typeof o === 'object' && !Array.isArray(o) && (Object.getPrototypeOf(o) === Object.prototype || Object.getPrototypeOf(o) === null); };
  var integer = function (n) { return Number.isInteger(n) && n >= 0 && n <= MAX_SETS; };
  var text = function (s) { return typeof s === 'string' && s.length <= 1000; };
  var idOK = function (s) { return typeof s === 'string' && s.length > 0 && s.length <= 200 && !has(Object.prototype,s); };
  function freeze(o) {
    if (o && typeof o === 'object' && !Object.isFrozen(o)) { Object.keys(o).forEach(function (k) { freeze(o[k]); }); Object.freeze(o); }
    return o;
  }
  function unique(a) { return Array.from(new Set(a)); }
  function groupOrder(a) { return a.slice().sort(function (x,y) { return groupIds.indexOf(x) - groupIds.indexOf(y); }); }
  function categoryEligibility(category) {
    return ELIGIBLE.indexOf(category) !== -1 ? 'eligible' : EXCLUDED.indexOf(category) !== -1 ? 'excluded' : 'unknown';
  }
  function profile(exercise) {
    var e = plain(exercise) ? exercise : {}, category = typeof e.cat === 'string' ? e.cat : '';
    var explicit = typeof e.muscleWorkEligible === 'boolean';
    var eligibility = explicit ? (e.muscleWorkEligible ? 'eligible' : 'excluded') : categoryEligibility(category);
    var muscle = plain(e.muscles) ? e.muscles : {};
    var primes = Array.isArray(muscle.prime) ? muscle.prime.filter(function (r) { return typeof r === 'string'; }) : [];
    var seconds = Array.isArray(muscle.sec) ? muscle.sec.filter(function (r) { return typeof r === 'string'; }) : [];
    var primary = unique(primes.filter(function (r) { return has(regionToGroup,r); }).map(function (r) { return regionToGroup[r]; }));
    var secondary = unique(seconds.filter(function (r) { return has(regionToGroup,r); }).map(function (r) { return regionToGroup[r]; }))
      .filter(function (g) { return primary.indexOf(g) === -1; });
    return freeze({ category:category, eligibility:eligibility,
      eligibilitySource:explicit ? 'explicit' : eligibility === 'unknown' ? 'unknown' : 'category',
      primary:groupOrder(primary), secondary:groupOrder(secondary),
      unassignedRegions:unique(primes.concat(seconds).filter(function (r) { return !has(regionToGroup,r); })) });
  }
  function credits(s) {
    var direct = {}, secondary = {};
    var n = s.source === 'planned' ? s.plannedSets : s.completedSets;
    if (s.eligibility === 'eligible' && s.completion !== 'unknown' && integer(n) && n > 0) {
      s.primary.forEach(function (g) { direct[g] = n; });
      s.secondary.forEach(function (g) { secondary[g] = n; });
    }
    return { direct:direct, secondary:secondary };
  }
  function workCounters(x, source) {
    var planned = integer(x.sets) && x.sets > 0 ? x.sets : null, completed = null, completion = 'unknown';
    if (source === 'planned') completion = planned === null ? 'unknown' : 'planned';
    else if (x.skipped === true) { completed = 0; completion = 'skipped'; }
    else {
      // An explicit malformed setsDone is not replaced with a guess from done.
      if (has(x,'setsDone')) {
        if (integer(x.setsDone) && (planned === null || x.setsDone <= planned)) completed = x.setsDone;
      } else if (x.done === true && planned !== null) completed = planned;
      // Current failed-item logs omit setsDone only when all planned sets were attempted.
      else if (x.done === false && planned !== null && typeof x.lastReps === 'number' && Number.isFinite(x.lastReps) && x.lastReps >= 0) completed = planned;
      if (completed !== null) {
        // A failed zero-repetition last set is an attempt, not completed work.
        if (x.done === false && x.lastReps === 0) completed = Math.max(0,completed - 1);
        completion = x.done === false || planned === null || completed < planned ? 'partial' : 'complete';
      }
    }
    return { plannedSets:planned,completedSets:completed,completion:completion };
  }
  function itemSnapshot(exercise, item, source) {
    var e = plain(exercise) ? exercise : {}, x = plain(item) ? item : {}, p = profile(e);
    var id = idOK(x.exId) ? x.exId : idOK(e.id) ? e.id : null;
    if (!id) return null;
    var counts = workCounters(x,source);
    var s = { v:VERSION, source:source, exerciseId:id, name:typeof e.name === 'string' ? e.name : id,
      category:p.category, eligibility:x.warmup === true ? 'excluded' : p.eligibility,
      eligibilitySource:x.warmup === true ? 'warmup' : p.eligibilitySource,
      primary:p.primary.slice(), secondary:p.secondary.slice(), unassignedRegions:p.unassignedRegions.slice(),
      plannedSets:counts.plannedSets, completedSets:counts.completedSets, completion:counts.completion };
    s.credits = credits(s);
    return freeze(s);
  }
  function completedItem(e,x) { return itemSnapshot(e,x,'completed'); }
  function plannedItem(e,x) { return itemSnapshot(e,x,'planned'); }
  // A player pins planned attribution at finish. Retries/resume change only completion,
  // never the saved name, roles, eligibility or warmup policy from that moment.
  function completedFromPlan(planned, item) {
    var p = sanitize(planned), x = plain(item) ? item : null;
    if (!p || p.source !== 'planned' || !x || x.exId !== p.exerciseId) return null;
    if (has(x,'sets') && x.sets != null && p.plannedSets !== null && x.sets !== p.plannedSets) return null;
    var counts = workCounters(Object.assign({},x,{sets:p.plannedSets}),'completed');
    var s = { v:VERSION,source:'completed',exerciseId:p.exerciseId,name:p.name,category:p.category,
      eligibility:p.eligibility,eligibilitySource:p.eligibilitySource,
      primary:p.primary.slice(),secondary:p.secondary.slice(),unassignedRegions:p.unassignedRegions.slice(),
      plannedSets:counts.plannedSets,completedSets:counts.completedSets,completion:counts.completion };
    s.credits = credits(s);
    return freeze(s);
  }
  function plannedProtocol(protocol, exercises) {
    var p = plain(protocol) ? protocol : {}, map = plain(exercises) ? exercises : {};
    return freeze((Array.isArray(p.items) ? p.items : []).map(function (x) {
      var e = x && has(map,x.exId) ? map[x.exId] : null;
      return plannedItem(e,x);
    }));
  }
  function mask(ids) { return ids.reduce(function (m,id) { return m | (1 << groupIds.indexOf(id)); },0); }
  function unmask(n) { return groupIds.filter(function (_,i) { return (n & (1 << i)) !== 0; }); }
  function unpack(value) {
    if (!Array.isArray(value) || value.length !== 13 || value[0] !== 'mw1') return null;
    if (![7,8].every(function (i) { return Number.isInteger(value[i]) && value[i] >= 0 && value[i] < (1 << groups.length); })) return null;
    if (![4,5,6,12].every(function (i) { return Number.isInteger(value[i]); })) return null;
    return { v:VERSION, exerciseId:value[1], name:value[2], category:value[3], source:SOURCE[value[4]],
      eligibility:ELIGIBILITY[value[5]], eligibilitySource:ELIGIBILITY_SOURCE[value[6]],
      primary:unmask(value[7]), secondary:unmask(value[8]), unassignedRegions:value[9],
      plannedSets:value[10], completedSets:value[11], completion:COMPLETION[value[12]] };
  }
  function listValid(a, allowed) {
    return Array.isArray(a) && a.length <= (allowed ? allowed.length : 40) &&
      a.every(function (x) { return allowed ? allowed.indexOf(x) !== -1 : text(x) && x.length <= 200; }) && new Set(a).size === a.length;
  }
  function sameMap(a,b) {
    return plain(a) && Object.keys(a).length === Object.keys(b).length && Object.keys(a).every(function (k) {
      return has(b,k) && integer(a[k]) && a[k] === b[k];
    });
  }
  // Invalid/mismatched snapshots return null. Nothing is repaired or reclassified from today's library.
  function sanitize(value) {
    var packed = Array.isArray(value), x = packed ? unpack(value) : value;
    if (!plain(x) || x.v !== VERSION || !idOK(x.exerciseId) || !text(x.name) || !text(x.category) ||
      SOURCE.indexOf(x.source) === -1 || ELIGIBILITY.indexOf(x.eligibility) === -1 ||
      ELIGIBILITY_SOURCE.indexOf(x.eligibilitySource) === -1 || COMPLETION.indexOf(x.completion) === -1 ||
      !listValid(x.primary,groupIds) || !listValid(x.secondary,groupIds) || !listValid(x.unassignedRegions) ||
      x.unassignedRegions.some(function (r) { return has(regionToGroup,r); }) ||
      x.secondary.some(function (g) { return x.primary.indexOf(g) !== -1; }) ||
      (x.plannedSets !== null && (!integer(x.plannedSets) || x.plannedSets === 0)) ||
      (x.completedSets !== null && !integer(x.completedSets))) return null;
    if (x.eligibilitySource === 'category' && (x.eligibility === 'unknown' || x.eligibility !== categoryEligibility(x.category))) return null;
    if (x.eligibilitySource === 'unknown' && x.eligibility !== 'unknown') return null;
    if (x.eligibilitySource === 'explicit' && x.eligibility === 'unknown') return null;
    if (x.eligibilitySource === 'warmup' && x.eligibility !== 'excluded') return null;
    if (x.source === 'planned') {
      if (x.completedSets !== null || (x.plannedSets === null ? x.completion !== 'unknown' : x.completion !== 'planned')) return null;
    } else {
      if (x.completion === 'planned' || (x.completedSets === null) !== (x.completion === 'unknown')) return null;
      if (x.plannedSets !== null && x.completedSets > x.plannedSets) return null;
      if (x.completion === 'complete' && (x.plannedSets === null || x.completedSets !== x.plannedSets)) return null;
      if (x.completion === 'skipped' && x.completedSets !== 0) return null;
    }
    var s = { v:VERSION, source:x.source, exerciseId:x.exerciseId, name:x.name, category:x.category,
      eligibility:x.eligibility, eligibilitySource:x.eligibilitySource,
      primary:groupOrder(x.primary), secondary:groupOrder(x.secondary), unassignedRegions:x.unassignedRegions.slice(),
      plannedSets:x.plannedSets, completedSets:x.completedSets, completion:x.completion };
    s.credits = credits(s);
    if (!packed && (!plain(x.credits) || !sameMap(x.credits.direct,s.credits.direct) || !sameMap(x.credits.secondary,s.credits.secondary))) return null;
    return freeze(s);
  }
  function pack(value) {
    var s = sanitize(value);
    if (!s) return null;
    return freeze(['mw1',s.exerciseId,s.name,s.category,SOURCE.indexOf(s.source),ELIGIBILITY.indexOf(s.eligibility),
      ELIGIBILITY_SOURCE.indexOf(s.eligibilitySource),mask(s.primary),mask(s.secondary),s.unassignedRegions.slice(),
      s.plannedSets,s.completedSets,COMPLETION.indexOf(s.completion)]);
  }
  function aggregate(rows) {
    var byGroup = {}, coverage = { items:rows.length,validItems:0,eligibleItems:0,excludedItems:0,
      unknownItems:0,partialItems:0,unassignedItems:0,invalidItems:0 };
    groups.forEach(function (g) { byGroup[g.id] = { id:g.id,label:g.label,regions:g.regions.slice(),direct:0,secondary:0,equivalent:0,items:[] }; });
    rows.forEach(function (row) {
      var s = sanitize(row.value);
      if (!s) { coverage.invalidItems++; coverage.unknownItems++; return; }
      coverage.validItems++;
      if (s.eligibility === 'excluded') coverage.excludedItems++;
      else if (s.eligibility === 'unknown') coverage.unknownItems++;
      else {
        coverage.eligibleItems++;
        if (s.completion === 'unknown') coverage.unknownItems++;
        var work = s.source === 'planned' ? s.plannedSets : s.completedSets;
        if (work > 0 && ((!s.primary.length && !s.secondary.length) || s.unassignedRegions.length)) coverage.unassignedItems++;
        if (s.completion === 'partial') coverage.partialItems++;
      }
      groupIds.forEach(function (id) {
        var direct = s.credits.direct[id] || 0, secondary = s.credits.secondary[id] || 0;
        if (!direct && !secondary) return;
        var g = byGroup[id]; g.direct += direct; g.secondary += secondary;
        g.items.push(Object.assign({ exerciseId:s.exerciseId,name:s.name,source:s.source,
          plannedSets:s.plannedSets,completedSets:s.completedSets,completion:s.completion,
          direct:direct,secondary:secondary,equivalent:direct + secondary * 0.5 }, row.context || {}));
      });
    });
    groupIds.forEach(function (id) { var g = byGroup[id]; g.equivalent = g.direct + g.secondary * 0.5; });
    return { groups:byGroup,coverage:coverage };
  }
  function sumSnapshots(snapshots) {
    if (!Array.isArray(snapshots)) return freeze(aggregate([{value:null}]));
    return freeze(aggregate(snapshots.map(function (value) { return { value:value }; })));
  }
  // Range is [from,to). A session's muscleWork is authoritative even after entry.items is trimmed.
  function week(logs, range) {
    if (!range || !Number.isFinite(range.from) || !Number.isFinite(range.to) || range.to <= range.from) throw new RangeError('MuscleWork.week requires a finite [from,to) range');
    var rows = [], sessions = [], extra = { sessions:0,coveredSessions:0,missingSessions:0,invalidSessions:0,unassignedSessions:0,partialSessions:0,excludedSessions:0 };
    (Array.isArray(logs) ? logs : []).forEach(function (entry,index) {
      if (!plain(entry) || !Number.isFinite(entry.at) || entry.at < range.from || entry.at >= range.to) return;
      if (entry.kind != null && entry.kind !== 'protocol') { extra.excludedSessions++; return; }
      extra.sessions++;
      if (!Array.isArray(entry.muscleWork) || !entry.muscleWork.length) { extra.missingSessions++; return; }
      var values = entry.muscleWork.map(function (value) { var s = sanitize(value); return s && s.source === 'completed' ? s : null; });
      var summary = sumSnapshots(values), c = summary.coverage;
      if (c.invalidItems || c.unknownItems) extra.invalidSessions++; else extra.coveredSessions++;
      if (c.unassignedItems) extra.unassignedSessions++;
      if (c.partialItems) extra.partialSessions++;
      values.forEach(function (value) { rows.push({value:value,context:{at:entry.at,sessionName:typeof entry.name === 'string' ? entry.name : '',sessionIndex:index}}); });
      sessions.push({ at:entry.at,name:typeof entry.name === 'string' ? entry.name : '',index:index,snapshots:values,coverage:c });
    });
    var out = aggregate(rows);
    Object.assign(out.coverage,extra); out.sessions = sessions; out.from = range.from; out.to = range.to;
    return freeze(out);
  }
  return freeze({ version:VERSION,secondaryFactor:0.5,groups:groups,regionToGroup:regionToGroup,
    profile:profile,completedItem:completedItem,plannedItem:plannedItem,completedFromPlan:completedFromPlan,plannedProtocol:plannedProtocol,
    sanitize:sanitize,pack:pack,sumSnapshots:sumSnapshots,week:week });
});
