// Stable identities let edits, imports and a second open tab refer to the same workout.
(function(root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.HistoryStore = api;
})(typeof window !== 'undefined' ? window : null, function() {
  'use strict';
  const valid = id => typeof id === 'string' && /^[a-zA-Z0-9_-]{1,128}$/.test(id);
  function legacyId(row) {
    const text = JSON.stringify([row.kind, row.refId, row.test, row.side]);
    let hash = 2166136261;
    for (let i = 0; i < text.length; i++) hash = Math.imul(hash ^ text.charCodeAt(i), 16777619);
    return 'l' + Math.trunc(row.at).toString(36) + '_' + (hash >>> 0).toString(36);
  }
  function identify(rows) {
    const taken = new Set(rows.map(x => x.historyId).filter(valid));
    const seen = new Set();
    return rows.map(row => {
      let id = row.historyId;
      if (!valid(id) || seen.has(id)) {
        const prefix = legacyId(row);
        id = prefix;
        for (let i = 2; taken.has(id); i++) id = prefix + '_' + i;
        taken.add(id);
      }
      seen.add(id);
      return id === row.historyId ? row : { ...row, historyId:id };
    });
  }
  function live(rows, deleted) {
    const omitted = new Set((deleted || []).filter(x => x.startsWith('log/')).map(x => x.slice(4)));
    return identify(rows).filter(x => !omitted.has(x.historyId));
  }
  function merge(base, ours, theirs, same, deleted) {
    const byId = rows => new Map(identify(rows).map(x => [x.historyId, x]));
    const b = byId(base), local = byId(ours), other = byId(theirs), result = [];
    for (const id of new Set([...local.keys(), ...other.keys()])) {
      const original = b.get(id), left = local.get(id), right = other.get(id);
      if (original && (!left || !right)) continue;
      result.push(original && same(left, original) ? right : left || right);
    }
    return live(result, deleted).sort((a,b) => b.at - a.at);
  }
  // 1.21 reserve rule, shared by the done screen (reserveAnswer) and history edits (currentStreak): RIR 0 on two or more
  // tapped sets = 'hold' (keep the weight, the streak restarts); one of the last two sets below target − 0.5 (holds: − 3 s)
  // = 'hard' (does not count); otherwise 'ok'. list = the taps per done set in order, null = not tapped.
  function reserveVerdict(list, goal, timed) {
    list = Array.isArray(list) ? list : [];
    if (list.filter(v => v === 0).length >= 2) return 'hold';
    const target = typeof goal === 'number' && Number.isFinite(goal) ? goal : timed ? null : 2;
    return target !== null && list.slice(-2).some(v => typeof v === 'number' && v < target - (timed ? 3 : 0.5)) ? 'hard' : 'ok';
  }
  function currentStreak(log, protocol, item, index) {
    let ok = 0, fail = 0;
    for (const row of log) {
      if (row.kind !== 'protocol' || row.refId !== protocol.id) continue;
      if (row.at <= (item.up || 0)) break;
      const x = row.items && row.items[index];
      if (!x || x.exId !== item.exId) break;
      if (x.skipped || x.liveDoseChanged || x.historySetsUnknown || x.historyRepsUnknown || (x.done === true && x.setsDone != null && x.setsDone < x.sets)) continue;
      if (x.measure !== item.measure || x.sets !== item.sets || (x.kg || 0) !== (item.kg || 0) ||
        !!x.sides !== !!item.sides || (x.measure === 'time' ? x.sec !== item.sec :
          x.reps !== item.reps || JSON.stringify(x.repsList || []) !== JSON.stringify(item.repsList || []))) break;
      const timed = x.measure === 'time', verdict = x.done === true ? reserveVerdict(x[timed ? 'sirList' : 'rirList'], item[timed ? 'targetSir' : 'targetRir'], timed) : 'ok';
      if (verdict === 'hold') break;
      if (verdict === 'hard') continue;
      if (x.done === true && !fail) ok++;
      else if (x.done === false && !ok) fail++;
      else break;
    }
    return { ok, fail };
  }
  // Reconcile only the change in provable streaks. Preserve accepted doses and explicit counter resets.
  function reconcile(protocol, before, after, exerciseMap) {
    if (!protocol || protocol.program || !Array.isArray(protocol.items)) return protocol;
    let changed = false;
    const items = protocol.items.map((item, index) => {
      const e = exerciseMap[item.exId];
      if (!e || !(['Snaga','Eksplozivnost','Trup'].includes(e.cat) || item.kg > 0 || (e.cat === 'Rehab' && item.measure === 'time' && +e.phase !== 1))) return item;
      const old = currentStreak(before, protocol, item, index);
      const next = currentStreak(after, protocol, item, index);
      if (old.ok === next.ok && old.fail === next.fail) return item;
      const ok = next.fail ? 0 : Math.max(0, (item.ok || 0) + next.ok - old.ok);
      const fail = next.ok ? 0 : Math.max(0, (item.fail || 0) + next.fail - old.fail);
      if (ok === (item.ok || 0) && fail === (item.fail || 0)) return item;
      changed = true;
      return { ...item, ok, fail, snoozeOk:Math.min(item.snoozeOk || 0, ok) };
    });
    return changed ? { ...protocol, items } : protocol;
  }
  return { identify, live, merge, reconcile, reserveVerdict };
});
