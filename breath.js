// The breathing pacer's model (1.25.0). Pure: no DOM and no clock of its own. The player gives it the seconds its work step
// has run (dur − remaining(), from the session clock, so a pause and time with the screen off are already counted) and it
// says which phase that is, how far into it, the circle's size and the square's side. window.Breath / module.exports.
// A pattern with one hold (4-7-8) is a circle: the hold keeps it at its size and the rim shows the hold's progress.
// Only the calm exercises are paced. "Sprintevi bez daha" is a plain sets × reps exercise and never reaches this model.
(function (root) {
  'use strict';
  var WORD = { in: 'Udah', top: 'Još malo', hold_in: 'Zadrži', hold_out: 'Zadrži', out: 'Izdah' };
  var KINDS = Object.keys(WORD);
  var HOLD = { hold_in: 1, hold_out: 1 };
  var num = function (n) { return String(Math.round(n * 10) / 10).replace('.', ','); };
  var plain = function (o) { return !!o && typeof o === 'object' && !Array.isArray(o); };
  // a phase list the model can run: known kinds, 0.5–60 s each
  function validPhases(ph) {
    return Array.isArray(ph) && ph.length > 0 && ph.length <= 8 && ph.every(function (p) {
      return plain(p) && KINDS.indexOf(p.k) !== -1 && typeof p.s === 'number' && p.s >= 0.5 && p.s <= 60;
    });
  }
  var cycleS = function (ph) { return (ph || []).reduce(function (s, p) { return s + (+p.s || 0); }, 0); };
  var blocksS = function (bl) { return (bl || []).reduce(function (s, b) { return s + cycleS(b.phases) * (b.cycles || 0); }, 0); };
  function fmt(s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
  // Croatian plurals: 1 udah, 2 udaha, 5 udaha; 21 minuta; 4,5 sekunde (a decimal takes the genitive singular)
  function plural(n, one, few, many) {
    var m10 = n % 10, m100 = n % 100;
    return m10 === 1 && m100 !== 11 ? one : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? few : many;
  }
  function secWord(n) { return n !== Math.round(n) ? 'sekunde' : plural(n, 'sekunda', 'sekunde', 'sekundi'); }
  var breathWord = function (n) { return plural(n, 'udah', 'udaha', 'udaha'); };
  var minWord = function (n) { return plural(n, 'minuta', 'minute', 'minuta'); };
  // every breathing exercise has presets; a single-pattern one is its own only preset, 'osnovno'
  function presets(b) { return plain(b) && plain(b.presets) ? b.presets : plain(b) ? { osnovno: b } : {}; }
  function presetKey(b, want) {
    var ps = presets(b), keys = Object.keys(ps);
    return ps[want] ? want : plain(b) && ps[b.preset_default] ? b.preset_default : keys[0];
  }
  function isSquare(ph) { return ph.length === 4 && ph.filter(function (p) { return HOLD[p.k]; }).length === 2; }
  // the exercise's breath + the item's choices (preset, variant, intro, minutes) -> one plan of whole cycles
  function resolve(b, sel) {
    sel = plain(sel) ? sel : {};
    var key = presetKey(b, sel.preset), p = presets(b)[key] || {};
    var v = (p.variants || []).filter(function (x) { return x && x.id === sel.variant && validPhases(x.phases); })[0] || null;
    var phases = ((v ? v.phases : p.phases) || []).map(function (x) { return { k: x.k, s: x.s }; });
    if (!validPhases(phases)) phases = [{ k: 'in', s: 4 }, { k: 'out', s: 6 }];
    var intro = (Array.isArray(p.intro) ? p.intro : []).filter(function (x) { return x && validPhases(x.phases) && x.cycles > 0; });
    var io = (p.intro_options || []).filter(function (x) { return x && x.id === sel.intro && validPhases(x.phases) && x.cycles > 0; })[0] || null;
    if (io) intro = [{ phases: io.phases, cycles: io.cycles }];
    var c = cycleS(phases), iS = blocksS(intro);
    var opts = Array.isArray(p.minutes_options) ? p.minutes_options : [];
    var min = opts.indexOf(+sel.min) !== -1 ? +sel.min : opts.indexOf(p.minutes_default) !== -1 ? p.minutes_default : opts[0] || 5;
    var n = Math.max(1, Math.round((min * 60 - iS) / c));
    return { key: key, preset: p, variant: v, introOption: io, phases: phases, intro: intro, introS: iS,
      introCycles: intro.reduce(function (s, x) { return s + x.cycles; }, 0), cycles: n, cycleS: c, min: min,
      total: Math.round((iS + n * c) * 1000) / 1000, shape: isSquare(phases) ? 'square' : 'circle',
      night: !!p.night, name: p.name_hr || '', label: p.label_hr || '' };
  }
  // lung level 0–1 for the circle: the inhale fills it (to 0.82 when a top-up follows), the top-up to 1, the exhale empties
  // it, a hold keeps it
  function target(k, hasTop) { return k === 'in' ? (hasTop ? 0.82 : 1) : k === 'top' ? 1 : k === 'out' ? 0 : null; }
  function startLevels(ph) {
    var hasTop = ph.some(function (p) { return p.k === 'top'; }), L0 = 0, out = [];
    for (var pass = 0; pass < 2; pass++) { var l = L0; out = []; ph.forEach(function (p) { out.push(l); var t = target(p.k, hasTop); if (t != null) l = t; }); L0 = l; }
    return { starts: out, hasTop: hasTop, end: L0 };
  }
  var ease = function (x) { return 0.5 - Math.cos(Math.PI * Math.max(0, Math.min(1, x))) / 2; };
  function blocksOf(r) {
    return r.intro.map(function (b) { return { phases: b.phases, cycles: b.cycles, intro: true }; })
      .concat([{ phases: r.phases, cycles: r.cycles, intro: false }]);
  }
  // where the step stands t seconds in: the phase, the seconds left in it, its progress, the breath (cycle) and the intro
  function at(r, t) {
    t = Math.max(0, Math.min(r.total - 1e-6, +t || 0));
    var blocks = blocksOf(r), base = 0, g = 0, introNo = 0;
    for (var bi = 0; bi < blocks.length; bi++) {
      var b = blocks[bi], c = cycleS(b.phases), len = c * b.cycles;
      if (t < base + len - 1e-9 || bi === blocks.length - 1) {
        var k = Math.min(b.cycles - 1, Math.floor((t - base) / c + 1e-9)), tc = t - base - k * c, pi = 0, acc = 0;
        while (pi < b.phases.length - 1 && tc >= acc + b.phases[pi].s - 1e-9) { acc += b.phases[pi].s; pi++; }
        var p = b.phases[pi], into = Math.max(0, tc - acc), lv = startLevels(b.phases), tg = target(p.k, lv.hasTop), from = lv.starts[pi];
        if (pi === 0 && (k > 0 || bi > 0)) from = lv.end;   // a later breath starts where the previous one ended
        if (k === 0 && bi === 0 && pi === 0) from = p.k === 'out' ? 0.5 : 0;
        var level = tg == null ? from : from + (tg - from) * ease(into / p.s);
        var nx = pi + 1 < b.phases.length ? b.phases[pi + 1] : k + 1 < b.cycles ? b.phases[0] : blocks[bi + 1] ? blocks[bi + 1].phases[0] : null;
        var key = (g + k) * 16 + pi;
        return { k: p.k, pi: pi, word: WORD[p.k], len: p.s, into: into, left: p.s - into, frac: into / p.s, hold: !!HOLD[p.k],
          intro: b.intro, cycle: b.intro ? introNo + k + 1 : k + 1, cycles: b.intro ? r.introCycles : r.cycles,
          breath: g + k + 1, breaths: r.introCycles + r.cycles, block: bi, blocks: blocks.length, blockPhases: b.phases,
          level: level, square: r.shape === 'square' ? { side: pi, frac: into / p.s } : null, totalLeft: r.total - t, t: t,
          key: key, next: nx, nextKey: nx ? (pi + 1 < b.phases.length ? key + 1 : (g + k + 1) * 16) : null };
      }
      base += len; g += b.cycles; if (b.intro) introNo += b.cycles;
    }
    return null;
  }
  // "Udah 4 s · izdah 6 s"; short "4/6 s", "3 + 1 + 6 s", and with a hold "4-4-4-4 s", "4-7-8 s"
  function rhythm(ph, short) {
    if (!short) return ph.map(function (p, i) { var w = WORD[p.k] || ''; return (i ? w.charAt(0).toLowerCase() + w.slice(1) : w) + ' ' + num(p.s) + ' s'; }).join(' · ');
    var s = ph.map(function (p) { return num(p.s); });
    return (ph.some(function (p) { return p.k === 'top'; }) ? s.join(' + ') : ph.some(function (p) { return HOLD[p.k]; }) ? s.join('-') : s.join('/')) + ' s';
  }
  // for the voice and VoiceOver: "Udah 4 sekunde, izdah 6 sekundi"
  function spoken(ph) {
    return ph.map(function (p, i) { var w = WORD[p.k] || ''; return (i ? w.charAt(0).toLowerCase() + w.slice(1) : w) + ' ' + num(p.s) + ' ' + secWord(p.s); }).join(', ');
  }
  function perMin(r) { return Math.round(600 / r.cycleS) / 10; }
  var api = { resolve: resolve, at: at, rhythm: rhythm, spoken: spoken, fmt: fmt, num: num, presets: presets, presetKey: presetKey,
    cycleS: cycleS, blocksS: blocksS, perMin: perMin, plural: plural, secWord: secWord, breathWord: breathWord, minWord: minWord,
    validPhases: validPhases, WORD: WORD };
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.Breath = api;
})(typeof window !== 'undefined' ? window : globalThis);
