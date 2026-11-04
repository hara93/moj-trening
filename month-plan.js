/* Calendar exceptions belong to one occurrence. A move keeps its original date even across months. */
const MonthPlan = (() => {
  const kinds = ['protocol', 'field', 'program'];
  const key = date => {
    const d = new Date(date);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  };
  const time = day => new Date(day + 'T12:00:00').getTime();
  const valid = day => typeof day === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(day) && key(time(day)) === day;
  const shift = (day, n) => { const d = new Date(time(day)); d.setDate(d.getDate() + n); return key(d); };
  const weekday = day => (new Date(time(day)).getDay() + 6) % 7;
  const monday = day => shift(day, -weekday(day));
  const monthOf = day => day.slice(0, 7);
  const same = (a, b) => a.kind === b.kind && a.id === b.id;
  const regular = (map, day, item) => (map[day] || []).find(row => !row.extra && same(row, item));
  // Multiple added occurrences can originate on one date if the first was already moved away.
  const extraNumber = (map, day, item) => (map[day] || []).reduce((n,r) =>
    r.extra && same(r,item) ? Math.max(n,(r.n || 0) + 1) : n, 0);
  function put(map, origin, row) {
    const next = { ...map };
    const list = (map[origin] || []).filter(old => !same(old, row) || !!old.extra !== !!row.extra || (old.n || 0) !== (row.n || 0));
    if (row.extra ? row.to !== null : row.to !== origin) {
      const item = { kind:row.kind, id:row.id, to:row.to, extra:!!row.extra };
      if (row.extra && row.n) item.n = row.n;
      list.push(item);
    }
    if (list.length) next[origin] = list; else delete next[origin];
    return next;
  }
  function clean(input) {
    let map = {};
    if (!input || typeof input !== 'object' || Array.isArray(input)) return map;
    for (const [day, list] of Object.entries(input)) {
      if (!valid(day) || !Array.isArray(list)) continue;
      for (const row of list) {
        if (!row || !kinds.includes(row.kind) || typeof row.id !== 'string' || !row.id || row.id in Object.prototype) continue;
        if (row.to !== null && !valid(row.to)) continue;
        const n = row.extra === true && Number.isSafeInteger(row.n) && row.n > 0 ? row.n : 0;
        map = put(map, day, { ...row, extra:row.extra === true, n });
      }
    }
    return map;
  }
  function week(base, start, map, resolve) {
    const end = shift(start, 7);
    const out = base.filter(slot => !regular(map, shift(start, slot.day), slot))
      .map(slot => ({ ...slot, origin:shift(start, slot.day) }));
    for (const [origin, records] of Object.entries(map)) {
      for (const r of records) {
        if (!r.to || r.to < start || r.to >= end) continue;
        const day = weekday(r.to), slot = resolve(r);
        if (slot && !out.some(x => x.day === day && same(x, r))) out.push({ ...slot, day, origin, extra:r.extra, n:r.n || 0 });
      }
    }
    return out.sort((a,b) => a.day - b.day || a.name.localeCompare(b.name, 'hr'));
  }
  function grid(month) {
    const first = month + '-01', d = new Date(time(first));
    const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const start = monday(first), count = Math.ceil((weekday(first) + last) / 7) * 7;
    return Array.from({length:count}, (_, i) => shift(start, i));
  }
  function changeMonth(day, n) {
    const d = new Date(time(day)), number = d.getDate();
    d.setDate(1); d.setMonth(d.getMonth() + n);
    d.setDate(Math.min(number, new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()));
    return key(d);
  }
  function repeat(map, selected, today, occupied) {
    const start = monday(selected), end = shift(start, 7), month = monthOf(selected);
    const touched = new Set(Object.keys(map));
    const pattern = [];
    for (const [origin, list] of Object.entries(map)) for (const r of list) {
      if (r.to) touched.add(r.to);
      if (origin >= start && origin < end) pattern.push([origin, r]);
    }
    let next = map, count = 0;
    for (let n = 7; shift(start, n).slice(0, 7) <= month; n += 7) {
      for (const [origin, row] of pattern) {
        const target = shift(origin, n), to = row.to ? shift(row.to, n) : null;
        if (target < today || monthOf(target) !== month || touched.has(target)) continue;
        if (to && (to < today || monthOf(to) !== month || touched.has(to) || occupied(next, to, row))) continue;
        next = put(next, target, { ...row, to }); count++;
      }
    }
    return { map:next, count };
  }
  function reset(map, month, today) {
    let next = map, count = 0;
    for (const [origin, list] of Object.entries(map)) for (const row of list) {
      if (origin < today || (row.to && row.to < today)) continue;
      if (monthOf(origin) !== month && (!row.to || monthOf(row.to) !== month)) continue;
      next = put(next, origin, { ...row, to:row.extra ? null : origin }); count++;
    }
    return { map:next, count };
  }
  return { key, time, valid, shift, monday, monthOf, same, regular, extraNumber, put, clean, week, grid, changeMonth, repeat, reset };
})();
if (typeof module !== 'undefined' && module.exports) module.exports = MonthPlan;
