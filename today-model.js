/* One local, explainable suggestion. This model reads snapshots only: it never
   changes the calendar, a club prescription, a protocol or recorded history.
   Match spacing follows the app's existing conservative calendar rules; these
   guards are not a diagnosis or a physiological recovery score. */
(function (root, factory) {
  'use strict';
  var history = typeof module === 'object' && module.exports
    ? require('./history-model.js') : root.HistoryModel;
  var api = factory(history);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.TodayModel = api;
})(typeof window !== 'undefined' ? window : null, function (History) {
  'use strict';

  var DAY = 86400000;
  var LOWER_REGIONS = ['front_quadriceps', 'front_adductors', 'back_glutes',
    'back_gluteus_medius', 'back_hamstrings', 'back_calves'];
  var LOWER_ZONES = ['Kvadriceps', 'Gluteus', 'Gluteus medius', 'Stražnja loža',
    'Kuk', 'Aduktori', 'Lisni mišić'];
  var EASY_CATEGORIES = ['Mobilnost', 'Aktivacija'];
  // Morning pain location (the chip in the morning check) and the work it covers.
  var PAIN_AREAS = { hip: 'kuk i prepone', hamstring: 'stražnja loža', knee: 'koljeno', other: 'ostalo' };
  // the same areas after "za" (accusative): "za stražnju ložu"
  var PAIN_AREAS_FOR = { hip: 'kuk i prepone', hamstring: 'stražnju ložu', knee: 'koljeno', other: 'ovaj trening' };
  var PAIN_REGIONS = { hip: ['front_adductors', 'front_hip_flexors', 'hip_joints'], hamstring: ['back_hamstrings'],
    knee: ['front_quadriceps', 'front_knees'] };
  var PAIN_ZONES = { hip: ['Kuk', 'Aduktori', 'Fleksori kuka'], hamstring: ['Stražnja loža'], knee: ['Koljeno', 'Kvadriceps'] };
  // A lighter variant at pain 3-5: the same slot gets a gentler exercise.
  var PAIN_SWAPS = { 'nordic-curl': { areas: ['hip', 'hamstring', 'other'], to: 'most' },
    'kopenhagen-duga': { areas: ['hip', 'other'], to: 'kopenhagen-kratka' } };
  var has = function (o, key) { return Object.prototype.hasOwnProperty.call(o, key); };
  var plain = function (o) { return !!o && typeof o === 'object' && !Array.isArray(o); };
  var finite = function (n) { return typeof n === 'number' && Number.isFinite(n); };
  var within = function (n, low, high) { return finite(n) && n >= low && n <= high; };
  var integer = function (n, low, high) { return Number.isInteger(n) && within(n, low, high); };
  var text = function (s, fallback) {
    return typeof s === 'string' && s.trim() ? s.trim().slice(0, 200) : fallback || '';
  };
  function copy(value) { return JSON.parse(JSON.stringify(value)); }
  function freeze(value) {
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
      Object.keys(value).forEach(function (key) { freeze(value[key]); });
      Object.freeze(value);
    }
    return value;
  }
  function dateKey(value) {
    var d = new Date(value);
    if (!finite(d.getTime())) return null;
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') +
      '-' + String(d.getDate()).padStart(2, '0');
  }
  function validDate(value) {
    return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
      dateKey(value + 'T12:00:00') === value;
  }
  function shift(value, days) {
    var d = new Date(value + 'T12:00:00');
    d.setDate(d.getDate() + days);
    return dateKey(d);
  }
  function weekday(value) { return (new Date(value + 'T12:00:00').getDay() + 6) % 7; }
  function dayDistance(from, to) {
    var a = from.split('-').map(Number), b = to.split('-').map(Number);
    return Math.round((Date.UTC(b[0], b[1] - 1, b[2]) - Date.UTC(a[0], a[1] - 1, a[2])) / DAY);
  }
  function storedRows(item) {
    if (!History || typeof History.recordedRows !== 'function') return null;
    return History.recordedRows(item);
  }
  function isWorkout(log) {
    return plain(log) && (log.kind == null || ['protocol', 'field', 'team'].includes(log.kind));
  }
  function sameWorkout(log, plan) {
    return log.refId === plan.id && (log.kind === plan.kind || (log.kind == null && plan.kind === 'protocol'));
  }
  function logsBefore(logs, now) {
    var ids = new Set();
    return (Array.isArray(logs) ? logs : []).filter(function (log) {
      if (!isWorkout(log) || !finite(log.at) || log.at > now || !dateKey(log.at)) return false;
      var id = text(log.historyId) || JSON.stringify([log.at, log.kind, log.refId, log.teamType]);
      if (ids.has(id)) return false;
      ids.add(id);
      return true;
    }).slice().sort(function (a, b) { return b.at - a.at; });
  }
  function actualWork(log) {
    if (within(log.secs, 1, 604800)) return true;
    return (Array.isArray(log.items) ? log.items : []).some(function (item) {
      var rows = storedRows(item);
      return rows && rows.some(function (row) {
        return row.sides > 0 && (item.measure === 'time' ? row.sec > 0 : row.reps > 0);
      });
    });
  }
  function matchContext(settings, planned, logs, today) {
    settings = plain(settings) ? settings : {};
    var overrides = plain(settings.matchDates) ? settings.matchDates : {};
    var standing = integer(settings.matchDay, 0, 6) ? settings.matchDay : -1;
    var dates = new Set();
    for (var offset = -7; offset <= 7; offset++) {
      var day = shift(today, offset), override = overrides[day];
      if (override === 1 || (override !== 0 && weekday(day) === standing)) dates.add(day);
    }
    planned.forEach(function (plan) {
      if (plan.kind === 'team' && plan.teamType === 'match' && !plan.skip) dates.add(plan.date);
    });
    logs.forEach(function (log) {
      if (log.kind === 'team' && log.teamType === 'match' && actualWork(log)) dates.add(dateKey(log.at));
    });
    var ordered = Array.from(dates).filter(validDate).sort();
    var next = ordered.find(function (date) { return date >= today; }) || null;
    var previous = ordered.filter(function (date) { return date < today; }).pop() || null;
    var monday = shift(today, -weekday(today)), end = shift(monday, 7);
    return { next: next, previous: previous,
      gap: next ? dayDistance(today, next) : null,
      since: previous ? dayDistance(previous, today) : null,
      weekCount: ordered.filter(function (date) { return date >= monday && date < end; }).length,
      between: ordered.some(function (date) { return date >= monday && date < today; }) &&
        ordered.some(function (date) { return date > today && date < end; }) };
  }
  function painLevel(checkin) {
    if (!checkin) return 0;
    if (checkin.newPain === true || checkin.pain >= 6) return 3;
    return checkin.pain >= 3 ? 2 : checkin.pain >= 1 ? 1 : 0;
  }
  // The pain areas an exercise loads: its primary muscles and listed zones.
  function painAreasOf(exercise, id) {
    if (!plain(exercise)) return [];
    var prime = plain(exercise.muscles) && Array.isArray(exercise.muscles.prime) ? exercise.muscles.prime : [];
    var zones = Array.isArray(exercise.zones) ? exercise.zones : [];
    return Object.keys(PAIN_REGIONS).filter(function (area) {
      return (area === 'hamstring' && id === 'nordic-curl') ||
        prime.some(function (region) { return PAIN_REGIONS[area].includes(region); }) ||
        zones.some(function (zone) { return PAIN_ZONES[area].includes(zone); });
    });
  }
  // Pain 1-5 holds progression for the painful area; an unknown area holds all of it. Strong or new pain
  // (a rest day he trained anyway) holds every exercise.
  function painHolds(checkin, exercise, id) {
    var level = painLevel(checkin);
    if (level < 1) return false;
    if (level === 3) return true;
    var area = checkin.painArea && checkin.painArea !== 'other' ? checkin.painArea : null;
    return !area || painAreasOf(exercise, id).includes(area);
  }
  // Pain 3-5: gentler variants in the same slots and one set fewer for the painful area.
  function painLighter(items, area, exercises) {
    var changes = [];
    var result = items.map(function (original) {
      var item = copy(original), exercise = exerciseFor(exercises, item.exId);
      var swap = PAIN_SWAPS[item.exId], target = swap && exerciseFor(exercises, swap.to);
      if (swap && target && swap.areas.includes(area)) {
        // the slot keeps everything the player reads (superset key, round rest, section); only the dose is the new exercise's
        var swapped = copy(item);
        ['repsList', 'kgList', 'secList', 'note'].forEach(function (key) { delete swapped[key]; });
        Object.assign(swapped, { exId: swap.to, measure: target.measure === 'time' ? 'time' : 'sets',
          sets: Math.max(1, Math.min(integer(item.sets, 1, 20) ? item.sets : 2, integer(target.sets, 1, 20) ? target.sets : 2)),
          reps: integer(target.reps, 1, 100) ? target.reps : 10, sec: integer(target.sec, 1, 600) ? target.sec : 20,
          kg: 0, sides: target.sides === true, rest: finite(item.rest) ? item.rest : 60, painSwapOf: item.exId });
        changes.push(text(exercise && exercise.name, item.exId) + ' → ' + text(target.name, swap.to));
        return swapped;
      }
      var loads = area === 'other' || painAreasOf(exercise, item.exId).includes(area);
      if (!loads || item.warmup === true || !integer(item.sets, 2, 1000)) return item;
      item.sets -= 1;
      ['reps', 'kg', 'sec'].forEach(function (key) {
        if (Array.isArray(item[key + 'List'])) item[key + 'List'] = item[key + 'List'].slice(0, item.sets);
      });
      changes.push(text(exercise && exercise.name, item.exId) + ' ' + (item.sets + 1) + ' → ' + item.sets + ' ' + (item.sets === 1 ? 'serija' : item.sets < 5 ? 'serije' : 'serija'));
      return item;
    });
    return { items: result, changes: changes };
  }
  function exerciseFor(exercises, id) {
    return typeof id === 'string' && has(exercises, id) && plain(exercises[id]) ? exercises[id] : null;
  }
  function workItems(plan) {
    return (Array.isArray(plan.items) ? plan.items : []).filter(function (item) {
      return plain(item) && typeof item.exId === 'string' && !!item.exId;
    });
  }
  function heavyLegs(plan, exercises) {
    if (typeof plan.heavyLegs === 'boolean') return plan.heavyLegs;
    return workItems(plan).some(function (item) {
      var exercise = exerciseFor(exercises, item.exId);
      if (!exercise || exercise.cat !== 'Snaga' || item.warmup === true) return false;
      var primary = plain(exercise.muscles) && Array.isArray(exercise.muscles.prime)
        ? exercise.muscles.prime : [];
      return primary.some(function (region) { return LOWER_REGIONS.includes(region); }) ||
        (Array.isArray(exercise.zones) && exercise.zones.some(function (zone) { return LOWER_ZONES.includes(zone); }));
    });
  }
  function easyPlan(plan, exercises) {
    var items = workItems(plan);
    return plan.kind === 'protocol' && items.length > 0 && items.every(function (item) {
      var exercise = exerciseFor(exercises, item.exId);
      return exercise && EASY_CATEGORIES.includes(exercise.cat);
    });
  }
  function available(plan, input, exercises) {
    if (!plain(plan) || !['protocol', 'field'].includes(plan.kind) || !text(plan.id)) return false;
    if (plan.eligible === false) return false;
    if (plan.kind === 'field') return !Array.isArray(plan.equip) || !Array.isArray(input.equipment) ||
      plan.equip.every(function (tag) { return tag === 'Bez opreme' || input.equipment.includes(tag); });
    var items = workItems(plan);
    if (!items.length || !Array.isArray(plan.items) || items.length !== plan.items.length) return false;
    return items.every(function (item) {
      var exercise = exerciseFor(exercises, item.exId);
      if (!exercise || exercise.todayEligible === false) return false;
      if (Array.isArray(input.eligibleIds) && !input.eligibleIds.includes(item.exId)) return false;
      if (Array.isArray(input.equipment)) {
        var equipment = Array.isArray(exercise.equip) && exercise.equip.length ? exercise.equip :
          exercise.equipment === 'Bez opreme' ? ['Bez opreme'] : null;
        if (!equipment || !equipment.every(function (tag) {
          return tag === 'Bez opreme' || input.equipment.includes(tag);
        })) return false;
      }
      return true;
    });
  }
  function currentCheckin(value, today) {
    if (!plain(value) || value.date !== today) return null;
    var checkin = { date: today };
    if (integer(value.energy, 1, 5)) checkin.energy = value.energy;
    if (integer(value.legs, 1, 5)) checkin.legs = value.legs;
    if (within(value.pain, 0, 10)) checkin.pain = value.pain;
    if (value.newPain === true) checkin.newPain = true;
    if (typeof value.painArea === 'string' && has(PAIN_AREAS, value.painArea)) checkin.painArea = value.painArea;
    return checkin;
  }
  function historyDose(log, plan) {
    if (!log || !Array.isArray(log.items) || !Array.isArray(plan.items) || log.items.length !== plan.items.length) return [];
    return plan.items.map(function (item, index) {
      var previous = log.items[index];
      if (!plain(previous) || previous.exId !== item.exId || previous.measure !== item.measure ||
          !!previous.sides !== !!item.sides) return null;
      if (previous.skipped) return null;
      var rows = storedRows(previous);
      if (!rows) return null;
      return { exId: item.exId, measure: previous.measure, sides: !!previous.sides, partial: previous.done === false ||
        rows.length < previous.sets || rows.some(function (row) { return row.sides !== (item.sides ? 2 : 1); }),
        rows: rows.map(function (row) {
          return { set: row.number, reps: row.reps, sec: row.sec, kg: row.kg,
            sides: row.sides, rir: within(row.rir, 0, 10) ? row.rir : null,
            sir: within(row.sir, 0, 3600) ? row.sir : null, failed: row.failed };
        }) };
    });
  }
  function difficultDose(doses) {
    return doses.some(function (dose) {
      if (!dose) return false;
      var last = dose.rows[dose.rows.length - 1];
      return dose.partial || !!(last && (last.failed || (last.rir !== null && last.rir <= 1) || last.sir === 0));
    });
  }
  function reduceItems(plan, doses) {
    var section = '';
    return plan.items.map(function (original, index) {
      var item = copy(original), dose = doses[index];
      section = text(item.section, section);
      if (!integer(item.sets, 1, 1000) || item.warmup === true || /^zagrij/i.test(section)) return item;
      var count = Math.max(1, item.sets - 1);
      // Only contiguous, full-side work can be replayed as a numbered dose.
      var rows = dose && dose.rows.filter(function (row) {
        return row.sides === (item.sides ? 2 : 1) &&
          (item.measure === 'time' ? row.sec > 0 : row.reps > 0);
      });
      var replay = rows && rows.length > 0 && rows.every(function (row, at) { return row.set === at + 1; });
      if (replay) count = Math.min(count, rows.length);
      item.sets = count;
      ['reps', 'kg', 'sec'].forEach(function (key) {
        var values = [];
        for (var set = 0; set < count; set++) {
          var planned = Array.isArray(original[key + 'List']) && set < original[key + 'List'].length
            ? original[key + 'List'][set] : original[key];
          var previous = replay && rows[set] ? rows[set][key] : null;
          values.push(within(planned, 0, 5000) && within(previous, 0, 5000)
            ? Math.min(planned, previous) : planned);
        }
        if (Array.isArray(original[key + 'List']) || values.some(function (value) { return value !== original[key]; })) {
          item[key + 'List'] = values;
          if (values.length && finite(values[0])) item[key] = values[0];
        }
      });
      return item;
    });
  }
  // The one gym-session match rule, shared with the calendar warning (app.js
  // matchNote). gap = days to the next match, since = days after the previous
  // one, between = a match earlier and later in the same Monday-Sunday week.
  // easy = no loaded work (each caller classifies its own sessions); heavy =
  // heavy lower-body work. Returns '' when the session fits.
  function matchRule(o) {
    o = plain(o) ? o : {};
    var gap = integer(o.gap, 0, 366) ? o.gap : null, since = integer(o.since, 0, 366) ? o.since : null;
    if (gap === 0 && !o.easy) return 'matchDay';
    if (gap === 1 && !o.easy) return 'dayBefore';
    if (since === 1 && !o.easy) return 'dayAfter';
    if (!o.heavy) return '';
    if (o.between) return 'between';
    if (gap === 2) return 'twoDays';
    if (gap === 3) return 'threeDays';
    return '';
  }
  function matchBlocks(plan, context, exercises) {
    if (plan.kind === 'field') {
      if ((context.gap === 0 || context.gap === 1 || context.since === 1)) return true;
      return !integer(plan.intensity, 0, 3) ||
        (plan.intensity > 0 && (context.gap === 2 || context.weekCount >= 2));
    }
    return !!matchRule({ gap: context.gap, since: context.since, between: context.between,
      easy: easyPlan(plan, exercises), heavy: heavyLegs(plan, exercises) });
  }

  function suggest(raw) {
    var input = plain(raw) ? raw : {};
    var now = finite(input.now) && dateKey(input.now) ? input.now : Date.now();
    var today = dateKey(now), exercises = plain(input.exercises) ? input.exercises : {};
    var allPlanned = (Array.isArray(input.planned) ? input.planned : []).filter(function (plan) {
      return plain(plan) && validDate(plan.date);
    });
    var planned = allPlanned.filter(function (plan) { return !plan.skip; });
    var todayPlans = planned.filter(function (plan) { return plan.date === today && !plan.done; });
    var logs = logsBefore(input.logs, now), checkin = currentCheckin(input.checkin, today);
    var context = matchContext(input.settings, planned, logs, today);
    var protectedPlan = todayPlans.some(function (plan) {
      return plan.frozen === true || plan.external === true || plan.kind === 'team';
    });
    var result = { version: 1, date: today, kind: 'rest', title: '', summary: '',
      action: { type: 'none' }, items: [], reasons: [], evidence: [],
      confidence: 'limited', missing: [], protectedPlan: protectedPlan };
    function reason(code, message) { result.reasons.push({ code: code, text: message }); }
    function evidence(type, value, date, label) {
      var item = { type: type, label: text(label) };
      if (validDate(date)) item.date = date;
      var id = value && text(value.historyId || value.id);
      if (id) item.id = id;
      if (!result.evidence.some(function (old) {
        return old.type === type && old.date === date && old.id === item.id;
      })) result.evidence.push(item);
    }
    function historyEvidence(log) { evidence('history', log, dateKey(log.at), log.name || 'Zabilježeni trening'); }
    function planEvidence(plan) {
      evidence(validDate(plan.date) ? 'plan' : plan.kind, plan, plan.date, plan.name || 'Tvoj trening');
    }
    function matchEvidence(date, label) {
      var actual = logs.find(function (log) {
        return log.kind === 'team' && log.teamType === 'match' && dateKey(log.at) === date && actualWork(log);
      });
      if (actual) historyEvidence(actual);
      else evidence('match', null, date, label);
    }
    function equipmentMissing(plan) {
      if (validDate(plan.date) || Array.isArray(input.equipment) || Array.isArray(input.eligibleIds) ||
          logs.some(function (log) { return sameWorkout(log, plan) && actualWork(log); })) return;
      var tags = plan.kind === 'field' && Array.isArray(plan.equip) ? plan.equip.slice() : [];
      var unknown = false;
      if (plan.kind === 'protocol') {
        workItems(plan).forEach(function (item) {
          var exercise = exerciseFor(exercises, item.exId);
          if (exercise && Array.isArray(exercise.equip) && exercise.equip.length) tags = tags.concat(exercise.equip);
          else if (!exercise || exercise.equipment !== 'Bez opreme') unknown = true;
        });
      }
      tags = Array.from(new Set(tags.filter(function (tag) { return tag !== 'Bez opreme'; })));
      if (tags.length) result.missing.push('Prije početka provjeri imaš li: ' + tags.join(', ') + '.');
      else if (unknown) result.missing.push('Prije početka provjeri opremu navedenu uz vježbe ovog treninga.');
    }
    function finish(kind, title, summary, action) {
      result.kind = kind;
      result.title = title;
      result.summary = summary;
      if (action) result.action = action;
      return freeze(result);
    }
    var painUnknown = !checkin || !has(checkin, 'pain');
    if (!checkin) result.missing.push('Dopuni današnju jutarnju procjenu prije odluke o opterećenju.');
    else {
      var absent = [['energy', 'energija'], ['legs', 'težina nogu'], ['pain', 'bol']]
        .filter(function (row) { return !has(checkin, row[0]); }).map(function (row) { return row[1]; });
      if (absent.length) result.missing.push('U današnjoj procjeni nedostaje: ' + absent.join(', ') +
        (painUnknown ? '; prazno ne znači da boli nema.' : '.'));
    }
    if (!logs.length) result.missing.push('Još nema ranije zabilježenih treninga.');
    if (checkin) {
      evidence('checkin', null, today, 'Današnja jutarnja procjena');
    }
    if (context.next) matchEvidence(context.next, context.gap === 0 ? 'Danas je utakmica' : 'Sljedeća utakmica');
    if (context.previous && context.since <= 2) matchEvidence(context.previous, 'Prethodna utakmica u rasporedu');
    result.confidence = checkin && ['energy', 'legs', 'pain'].every(function (key) {
      return has(checkin, key);
    }) ? 'supported' : 'limited';

    var pain = painLevel(checkin), painArea = pain && checkin.painArea ? checkin.painArea : 'other';
    var painPlace = pain ? (checkin.painArea ? ' (' + PAIN_AREAS[checkin.painArea] + ')' : '') : '';
    var trainedToday = logs.some(function (log) { return dateKey(log.at) === today && actualWork(log); });
    if (pain && !checkin.painArea) result.missing.push('Označi gdje boli, pa ću smanjiti samo to područje.');
    // Strong or new pain stops today's training; once a session is recorded the done state wins.
    if (pain === 3 && !trainedToday) {
      reason('painStop', checkin.newPain ? 'Upisao si novu bol' + painPlace + '.' : 'Upisao si bol ' + checkin.pain + '/10' + painPlace + '.');
      todayPlans.forEach(planEvidence);
      var gentle = (Array.isArray(input.candidates) ? input.candidates : []).filter(function (candidate) {
        return plain(candidate) && !candidate.frozen && !candidate.external && available(candidate, input, exercises) &&
          easyPlan(candidate, exercises) && workItems(candidate).every(function (item) {
            return exerciseFor(exercises, item.exId).cat === 'Mobilnost';
          });
      }).sort(function (a, b) { return text(a.id).localeCompare(text(b.id)); })[0];
      if (gentle) {
        planEvidence(gentle);
        result.items = copy(gentle.items);
      }
      return finish('caution', gentle ? 'Danas odmor ili lagana mobilnost' : 'Danas odmor',
        (checkin.pain >= 6 ? 'Bol je jaka' : 'Bol je nova') + ', zato danas bez snage, skokova i trčanja.' + (gentle ? ' Lagana mobilnost bez boli je u redu.' : '') +
          ' Ako ne popusti za 2–3 dana, javi se fizioterapeutu.',
        gentle ? { type: 'protocol', id: gentle.id } : null);
    }
    var playedToday = logs.find(function (log) {
      return dateKey(log.at) === today && log.kind === 'team' && log.teamType === 'match' && actualWork(log);
    });
    if (playedToday) {
      historyEvidence(playedToday);
      reason('matchDone', 'Danas je već zabilježena odigrana utakmica.');
      return finish('rest', 'Za danas je utakmica dovoljna',
        'Nemoj dodavati još jedan trening snage ili intervale.',
        playedToday.historyId ? { type: 'history', id: playedToday.historyId } : { type: 'calendar' });
    }
    if (context.gap === 0) {
      reason('matchDay', 'Raspored za stvarni današnji datum označava utakmicu.');
      return finish('protect', 'Danas prati plan za utakmicu',
        'Bez dodatnog treninga snage ili intervala. Zagrijavanje i nastup dogovori s trenerom.', { type: 'calendar' });
    }
    var club = todayPlans.find(function (plan) { return plan.external === true || plan.kind === 'team'; });
    if (club) {
      planEvidence(club);
      reason('clubPlan', 'Za danas postoji klupska obveza; njezina doza nije mijenjana.');
      return finish('protect', 'Danas: ' + text(club.name, 'klupski trening'),
        'Odradi dogovoreni klupski plan; nemoj automatski dodavati još jedan trening.', { type: 'calendar' });
    }
    var doneToday = logs.find(function (log) { return dateKey(log.at) === today && actualWork(log); });
    if (doneToday && doneToday.partial === true && !logs.some(function (log) {
      return dateKey(log.at) === today && actualWork(log) && log.partial !== true;
    })) {
      // less than half of the work sets: the plan day is still open, so do not say the day is done
      historyEvidence(doneToday);
      reason('partialToday', 'Danas je zabilježen samo dio treninga (manje od pola radnih serija).');
      return finish('rest', 'Danas djelomično odrađeno',
        'Dan plana se još ne računa. Ako se osjećaš dobro, odradi ostatak istog treninga; inače danas odmori.',
        doneToday.historyId ? { type: 'history', id: doneToday.historyId } : { type: 'calendar' });
    }
    if (doneToday) {
      historyEvidence(doneToday);
      reason('alreadyTrained', 'Danas već postoji zapis stvarno odrađenog treninga.');
      return finish('rest', 'Današnji trening je zabilježen',
        'Za danas nemoj automatski dodavati još jedan trening. Pogledaj što si odradio.',
        doneToday.historyId ? { type: 'history', id: doneToday.historyId } : { type: 'calendar' });
    }
    var recentHard = logs.find(function (log) {
      var hours = (now - log.at) / 3600000;
      return hours <= 36 && actualWork(log) &&
        ((log.kind === 'team' && log.teamType === 'match') || (log.srpe >= 7 && log.secs >= 1800));
    });
    var lowEnergy = !!checkin && checkin.energy <= 2;
    var heavyFeeling = !!checkin && checkin.legs >= 4;
    if (lowEnergy || heavyFeeling) reason('morningGuard', lowEnergy && heavyFeeling
      ? 'Unio si malo energije i teške noge, zato prednost ima kraća ili lagana izvedba.'
      : lowEnergy ? 'Unio si malo energije, zato prednost ima kraća ili lagana izvedba.'
        : 'Unio si teške noge, zato danas nije predloženo dodatno teško opterećenje nogu.');
    if (recentHard) {
      historyEvidence(recentHard);
      reason('recentHard', recentHard.teamType === 'match'
        ? 'U zadnjih 36 sati zabilježena je odigrana utakmica.'
        : 'U zadnjih 36 sati zabilježen je trening od barem 30 minuta uz sRPE ' + recentHard.srpe + '/10.');
    }
    function usable(plan) { return available(plan, input, exercises); }
    function safe(plan) {
      var demandingField = plan.kind === 'field' &&
        (!integer(plan.intensity, 0, 3) || plan.intensity > 0 || ['tests', 'speed', 'agility'].includes(plan.category));
      return usable(plan) && !matchBlocks(plan, context, exercises) &&
        !(demandingField && (lowEnergy || heavyFeeling || recentHard || pain >= 2)) &&
        !(heavyLegs(plan, exercises) && (heavyFeeling || recentHard));
    }
    var candidates = (Array.isArray(input.candidates) ? input.candidates : []).filter(function (candidate) {
      return plain(candidate) && !candidate.frozen && !candidate.external && !candidate.skip &&
        (!candidate.date || candidate.date === today) && !candidate.done &&
        !allPlanned.some(function (occurrence) {
          return occurrence.id === candidate.id && occurrence.kind === candidate.kind &&
            ((occurrence.date === today && (occurrence.skip || occurrence.done)) ||
              (occurrence.date === shift(today, 1) && !occurrence.skip));
        });
    });
    var own = todayPlans.find(function (plan) {
      return plan.frozen === true && ['protocol', 'field'].includes(plan.kind);
    }) || todayPlans.find(function (plan) { return ['protocol', 'field'].includes(plan.kind); });
    if (own && own.frozen) {
      planEvidence(own);
      reason('frozenPlan', 'Današnji plan je zaključan; ovaj prijedlog ne mijenja njegov redoslijed ni dozu.');
      if (lowEnergy || heavyFeeling || recentHard || pain >= 2 || matchBlocks(own, context, exercises)) {
        return finish('protect', 'Provjeri današnji zaključani plan',
          pain >= 2 ? 'Bol ' + checkin.pain + '/10' + painPlace + ': propisana doza ostaje ista, zato preskoči vježbe koje bole.'
            : 'Prije početka pogledaj današnji raspored. Propisana doza ostaje ista, a prilagodbu odaberi sam.', { type: 'calendar' });
      }
      equipmentMissing(own);
      if (own.kind === 'protocol' && usable(own)) result.items = copy(own.items);
      return finish('planned', 'Danas: ' + text(own.name, 'zaključani trening'),
        'Prati zaključanu dozu. ' + (painUnknown ? 'Prije početka dopuni jutarnju procjenu.' : 'Dodatno opterećenje nije dodano.'),
        usable(own) ? { type: own.kind, id: own.id } : { type: 'calendar' });
    }
    var restricted = context.gap === 1 || context.since === 1 || heavyFeeling || !!recentHard;
    var selected = own && safe(own) ? own : null;
    if (!selected) {
      var choices = candidates.filter(function (candidate) {
        if (!safe(candidate)) return false;
        if (restricted || lowEnergy) return easyPlan(candidate, exercises);
        var last = logs.find(function (log) {
          return sameWorkout(log, candidate) && actualWork(log);
        });
        if (!easyPlan(candidate, exercises) && (!last || now - last.at < 48 * 3600000)) return false;
        return candidate.kind === 'protocol' && workItems(candidate).every(function (item) {
          var exercise = exerciseFor(exercises, item.exId);
          return exercise && ['Snaga', 'Trup', 'Mobilnost', 'Aktivacija', 'Rehab'].includes(exercise.cat);
        });
      });
      function familiarity(candidate) {
        return logs.find(function (log) {
          return sameWorkout(log, candidate) && actualWork(log);
        });
      }
      // 4-5 days before a match is the slot for heavy legs; otherwise the longest
      // untrained familiar session comes first, untried ones after them.
      var legsSlot = context.gap === 4 || context.gap === 5;
      choices.sort(function (left, right) {
        var a = familiarity(left), b = familiarity(right);
        var legs = legsSlot ? Number(heavyLegs(right, exercises)) - Number(heavyLegs(left, exercises)) : 0;
        return legs || (a ? a.at : Infinity) - (b ? b.at : Infinity) || text(left.id).localeCompare(text(right.id));
      });
      selected = choices[0] || null;
    }
    if (own && selected !== own) {
      planEvidence(own);
      reason('planGuard', !usable(own)
        ? 'Za cijeli današnji trening nije potvrđena dostupnost vježbi ili opreme.'
        : 'Današnji dodatni trening ne odgovara razmaku do utakmice ili unesenoj težini nogu.');
    }
    if (!selected) {
      if (restricted || lowEnergy || (own && !safe(own))) {
        reason('noSafeAlternative', 'Nije pronađen cijeli dostupan lakši trening; plan nije automatski premješten.');
        return finish('rest', 'Danas preskoči dodatni trening',
          'Ostavi današnji dan bez dodatne snage ili intervala. Sljedeći trening odaberi u kalendaru.', { type: 'calendar' });
      }
      return finish('choose', 'Odaberi jedan trening za danas',
        'U kalendaru odaberi dostupan trening. Bez poznate doze neću izmišljati serije ili kilograme.', { type: 'calendar' });
    }
    planEvidence(selected);
    equipmentMissing(selected);
    if (selected.kind === 'field') {
      return finish('planned', 'Danas: ' + text(selected.name, 'planirani terenski trening'),
        'Prati postojeću dozu za teren; dodatni intervali nisu dodani.', { type: 'field', id: selected.id });
    }
    var familiar = logs.find(function (log) {
      return sameWorkout(log, selected) && actualWork(log);
    });
    var previous = familiar && dayDistance(dateKey(familiar.at), today) <= 28 ? familiar : null;
    var doses = historyDose(previous, selected);
    var difficult = difficultDose(doses);
    if (familiar) {
      historyEvidence(familiar);
      if (!previous) reason('familiarity', 'Ovaj trening već imaš u povijesti; starija izvedba nije korištena za procjenu današnje spremnosti ili doze.');
      var observed = doses.filter(Boolean);
      if (observed.length) result.observed = observed;
      if (difficult) reason('actualDose', 'Zadnji isti trening ima djelomično izvedenu vježbu, neuspjelu seriju ili malu zabilježenu rezervu (RIR 0–1 ili bez rezerve u sekundama).');
      else if (observed.length) reason('actualDose', 'Dostupne su stvarne serije zadnjeg istog treninga; povećanje kilograma nije pretpostavljeno.');
    }
    var reduce = !easyPlan(selected, exercises) && (lowEnergy || difficult || !!recentHard);
    var holdNote = pain && 'Bol ' + checkin.pain + '/10' + painPlace + ': bez povećanja kilograma za ' + PAIN_AREAS_FOR[painArea] + '.';
    if (pain === 1) {
      result.painHold = painArea;
      result.painNote = holdNote;
      reason('painMild', 'Bol ' + checkin.pain + '/10' + painPlace + ': treniraj normalno, ali bez povećanja težine za ' +
        PAIN_AREAS_FOR[painArea] + '.');
    }
    var lighter = pain === 2 && !easyPlan(selected, exercises) ?
      painLighter(reduce ? reduceItems(selected, doses) : selected.items, painArea, exercises) : null;
    if (lighter && !lighter.changes.length) {
      // nothing in this session loads the painful area: the session stays, without heavier kilograms
      result.painHold = painArea;
      result.painNote = holdNote;
      reason('painOtherArea', 'Bol ' + checkin.pain + '/10' + painPlace + ': ovaj trening ne opterećuje to područje, pa ga odradi normalno. ' +
        (painArea === 'other' ? 'Kilogrami se ne povećavaju.' : 'Kilogrami se ne povećavaju samo za vježbe za ' + PAIN_AREAS_FOR[painArea] + '.'));
    }
    if (lighter && lighter.changes.length) {
      result.items = lighter.items;
      result.painHold = painArea;
      if (reduce) reason('reducedDose', 'Prvo je cijeli trening skraćen: jedna radna serija manje po vježbi, najmanje jedna.');
      reason('painLighter', 'Bol ' + checkin.pain + '/10' + painPlace + ': ' + lighter.changes.join(', ') + '. Kilogrami se ne povećavaju.');
      return finish('reduce', 'Danas lakše: ' + text(selected.name, 'tvoj trening'),
        'Lakša verzija za ' + (painArea === 'other' ? 'cijeli trening' : PAIN_AREAS_FOR[painArea]) + '. Stani ako se bol pojača.',
        { type: 'protocol', id: selected.id });
    }
    if (reduce) {
      result.items = reduceItems(selected, doses);
      reason('reducedDose', 'U cijelom treningu ostaje isti redoslijed: jedna radna serija manje po vježbi, najmanje jedna; kilogrami i ponavljanja se ne povećavaju.');
      return finish('reduce', 'Danas kraće: ' + text(selected.name, 'tvoj trening'),
        'Odradi prikazanu kraću dozu. To je prijedlog za ovu izvedbu; spremljeni protokol nije promijenjen.',
        { type: 'protocol', id: selected.id });
    }
    result.items = copy(selected.items);
    if (!checkin || painUnknown) {
      reason('unknownReadiness', 'Za danas nema potpune jutarnje procjene; spremnost i odsutnost boli nisu zaključene iz povijesti.');
    }
    if (!own) reason('availableChoice', 'Ovo je cijeli postojeći trening s dopuštenim vježbama; nije automatski upisan u kalendar.');
    return finish(selected === own ? 'planned' : 'alternative', 'Danas: ' + text(selected.name, 'tvoj trening'),
      easyPlan(selected, exercises) ? 'Odradi postojeću laganu dozu, bez dodavanja serija.'
        : 'Odradi postojeću dozu, bez automatskog povećanja kilograma.' +
          (painUnknown ? ' Prije početka dopuni jutarnju procjenu.' : ''),
      { type: 'protocol', id: selected.id });
  }

  return freeze({ version: 1, suggest: suggest, matchRule: matchRule, painLevel: painLevel, painAreasOf: painAreasOf,
    painHolds: painHolds, painAreas: PAIN_AREAS, painAreasFor: PAIN_AREAS_FOR, dateKey: dateKey, validDate: validDate });
});
