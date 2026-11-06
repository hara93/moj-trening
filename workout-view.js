/* Presentation only. State, prescriptions, completion and history come from
   the app. Only explicitly named *Html arguments contain trusted markup. */
(function (root, factory) {
  'use strict';
  var api = factory();
  if (root) root.WorkoutView = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (character) {
      return {'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[character];
    });
  }
  function html(value) { return typeof value === 'string' ? value : ''; }
  // Lucide glyphs and companion line controls share the same stroke language.
  var ICONS = {
    ellipsis: "<circle cx=\"12\" cy=\"12\" r=\"1\"/><circle cx=\"19\" cy=\"12\" r=\"1\"/><circle cx=\"5\" cy=\"12\" r=\"1\"/>",
    "chevron-left": "<path d=\"m15 18-6-6 6-6\"/>",
    "chevrons-up-down": "<path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/>",
    "shuffle": "<path d=\"m18 14 4 4-4 4\"/><path d=\"m18 2 4 4-4 4\"/><path d=\"M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22\"/><path d=\"M2 6h1.972a4 4 0 0 1 3.6 2.2\"/><path d=\"M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45\"/>",
    "notebook-text": "<path d=\"M2 6h4\"/><path d=\"M2 10h4\"/><path d=\"M2 14h4\"/><path d=\"M2 18h4\"/><rect width=\"16\" height=\"20\" x=\"4\" y=\"2\" rx=\"2\"/><path d=\"M9.5 8h5\"/><path d=\"M9.5 12H16\"/><path d=\"M9.5 16H14\"/>",
    "chart-no-axes-combined": "<path d=\"M12 16v5\"/><path d=\"M16 14v7\"/><path d=\"M20 10v11\"/><path d=\"m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15\"/><path d=\"M4 18v3\"/><path d=\"M8 14v7\"/>",
    "clock-3": "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 6v6h4\"/>",
    "dumbbell": "<path d=\"M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z\"/><path d=\"m2.5 21.5 1.4-1.4\"/><path d=\"m20.1 3.9 1.4-1.4\"/><path d=\"M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z\"/><path d=\"m9.6 14.4 4.8-4.8\"/>",
    "play": "<path d=\"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z\"/>",
    "info": "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 16v-4\"/><path d=\"M12 8h.01\"/>",
    "timer": "<path d=\"M10 2h4\"/><path d=\"m12 14 3-3\"/><circle cx=\"12\" cy=\"14\" r=\"8\"/>",
    "pause": "<rect x=\"6\" y=\"4\" width=\"4\" height=\"16\" rx=\"1\"/><rect x=\"14\" y=\"4\" width=\"4\" height=\"16\" rx=\"1\"/>",
    "chevron-up": "<path d=\"m18 15-6-6-6 6\"/>",
    "chevron-down": "<path d=\"m6 9 6 6 6-6\"/>",
    "chevrons-up": "<path d=\"m7 15 5-5 5 5\"/><path d=\"m7 9 5-5 5 5\"/>",
    "pencil": "<path d=\"m16 3 5 5-13 13H3v-5L16 3Z\"/><path d=\"m14 5 5 5\"/>",
    "notebook-pen": "<path d=\"M16 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3M2 7h4M2 11h4M2 15h4\"/><path d=\"m17 11 4 4-7 7h-4v-4l7-7Z\"/>",
    "share-2": "<circle cx=\"18\" cy=\"5\" r=\"3\"/><circle cx=\"6\" cy=\"12\" r=\"3\"/><circle cx=\"18\" cy=\"19\" r=\"3\"/><path d=\"m8.6 10.5 6.8-4M8.6 13.5l6.8 4\"/>",
    "settings-2": "<path d=\"M20 7h-9M4 7h1M4 17h10M20 17h-1\"/><circle cx=\"8\" cy=\"7\" r=\"3\"/><circle cx=\"17\" cy=\"17\" r=\"3\"/>",
    "volume-2": "<path d=\"m11 5-5 4H3v6h3l5 4V5Z\"/><path d=\"M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14\"/>",
    "book-open": "<path d=\"M12 7v14M3 3h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5v16h-5a4 4 0 0 0-4 2 4 4 0 0 0-4-2H3V3Z\"/>",
    "circle-check": "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"m8 12 3 3 5-6\"/>"
  };
  function icon(name) {
    return ICONS[name] ? '<svg class="workout-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + '</svg>' : '';
  }
  function equipment(value) {
    var values = (Array.isArray(value) ? value : [value]).filter(function (item) {
      return typeof item === 'string' && item.trim();
    });
    if (!values.length) return '';
    return '<div class="workout-equipment" aria-label="Oprema">' + values.map(function (item) {
      return '<span class="workout-equipment-tag">' + esc(item) + '</span>';
    }).join('') + '</div>';
  }
  function tools(value) {
    return value ? '<div class="workout-tools" role="group" aria-label="Mogućnosti vježbe">' + html(value) + '</div>' : '';
  }
  function rows(value) {
    return value ? html(value) : '<p class="workout-empty">Serije nisu navedene.</p>';
  }
  function overview(vm) {
    vm = vm || {};
    return '<div class="view workout-overview' + (vm.heroHtml ? ' workout-premium-overview' : '') + '">' +
      (vm.heroHtml ? '<div class="workout-overview-cover">' + html(vm.heroHtml) + '<div class="workout-cover-bar">' + html(vm.topbarHtml) + '</div></div>' : html(vm.topbarHtml)) +
      '<header class="workout-heading"><p class="workout-eyebrow">' + esc(vm.eyebrow || 'Pregled treninga') + '</p><h1>' + esc(vm.title) + '</h1>' +
      (vm.description ? '<p class="workout-description">' + esc(vm.description) + '</p>' : '') +
      (vm.metaHtml ? '<div class="workout-meta">' + html(vm.metaHtml) + '</div>' : '') + '</header>' +
      '<div class="workout-blocks">' + (html(vm.blocksHtml) || '<p class="workout-empty">Dodaj vježbe kako bi se ovdje prikazale njihove serije.</p>') + '</div>' +
      (vm.detailsHtml ? '<div class="workout-details">' + html(vm.detailsHtml) + '</div>' : '') + footer(vm.footerHtml) + '</div>';
  }
  function block(vm) {
    vm = vm || {};
    return '<section class="workout-block"><header class="workout-block-heading"><h2>' + esc(vm.title) + '</h2>' +
      (vm.subtitle ? '<p>' + esc(vm.subtitle) + '</p>' : '') + '</header><div class="workout-block-items">' +
      html(vm.itemsHtml) + '</div></section>';
  }
  function exercise(vm) {
    vm = vm || {};
    var validIndex = Number.isInteger(vm.index) && vm.index >= 0;
    var name = vm.name || 'Vježba';
    var thumb = vm.thumbHtml ? '<span class="workout-thumb">' + html(vm.thumbHtml) + '</span>' :
      '<span class="workout-thumb workout-thumb-empty" aria-hidden="true">' + (validIndex ? vm.index + 1 : '•') + '</span>';
    var header = thumb + '<span class="workout-exercise-title"><small>' + (validIndex ? 'Vježba ' + (vm.index + 1) : 'Vježba') +
      '</small><strong>' + esc(name) + '</strong>' + (vm.summary ? '<span class="workout-dose-summary">' + esc(vm.summary) + '</span>' : '') + '</span>';
    return '<section class="set-block workout-exercise"' + (validIndex ? ' data-index="' + vm.index + '"' : '') + '>' +
      '<header class="workout-exercise-header"><h3>' + (validIndex ? '<button type="button" class="workout-exercise-open" data-a="workoutExercise" data-j="' + vm.index +
        '" aria-label="' + esc('Otvori detalje vježbe: ' + name) + '">' + header + '<span class="workout-open-arrow" aria-hidden="true">›</span></button>' :
        '<span class="workout-exercise-open">' + header + '</span>') + '</h3></header>' +
      '<div class="workout-exercise-meta">' + equipment(vm.equipment) +
      (vm.rest != null && vm.rest !== '' ? '<span class="workout-rest">Odmor ' + esc(vm.rest) + (typeof vm.rest === 'number' ? ' s' : '') + '</span>' : '') + '</div>' +
      '<div class="workout-series">' + rows(vm.rowsHtml) + '</div>' +
      (vm.targetHtml ? '<div class="workout-target">' + html(vm.targetHtml) + '</div>' : '') + tools(vm.actionsHtml) + '</section>';
  }
  function panel(vm) {
    vm = vm || {};
    return '<div class="workout-exercise-panel"><header class="workout-panel-heading"><p class="workout-eyebrow">Vježba u treningu</p><h3>' + esc(vm.name || 'Vježba') + '</h3>' +
      (vm.summary ? '<p class="workout-panel-summary">' + esc(vm.summary) + '</p>' : '') + equipment(vm.equipment) + '</header>' +
      (vm.mediaHtml ? '<div class="workout-panel-media">' + html(vm.mediaHtml) + '</div>' : '') +
      tools(vm.actionsHtml) +
      (vm.instructionsHtml ? '<div class="workout-instructions-slot">' + html(vm.instructionsHtml) + '</div>' : '') +
      '<section class="workout-planned"><div class="workout-panel-section-heading"><h4>Serije ove izvedbe</h4><span>Plan i stanje serija</span></div>' +
      '<div class="workout-series">' + rows(vm.rowsHtml) + '</div></section>' +
      (vm.targetHtml ? '<section class="workout-target"><h4>Cilj vježbe</h4>' + html(vm.targetHtml) + '</section>' : '') +
      '<section class="workout-previous"><div class="workout-panel-section-heading"><h4>Prethodno odrađeno</h4><span>Spremljeni zapis</span></div>' +
      (html(vm.previousHtml) || '<p class="workout-empty">Prethodna izvedba nije dostupna.</p>') + '</section>' +
      (vm.note ? '<p class="workout-note">' + esc(vm.note) + '</p>' : '') + '</div>';
  }
  function compactExercise(vm) {
    vm = vm || {};
    var valid = Number.isInteger(vm.index) && vm.index >= 0;
    var content = '<span class="workout-compact-thumb">' + (html(vm.thumbHtml) || '<span aria-hidden="true">' + (valid ? vm.index + 1 : '•') + '</span>') +
      '</span><span class="workout-compact-text"><strong>' + esc(vm.name || 'Vježba') + '</strong>' +
      (vm.summary ? '<small>' + esc(vm.summary) + '</small>' : '') + '</span><span class="workout-compact-arrow" aria-hidden="true">›</span>';
    return valid ? '<button type="button" class="workout-compact-row" data-a="workoutExercise" data-j="' + vm.index +
      '" aria-label="' + esc('Otvori vježbu: ' + (vm.name || 'Vježba')) + '">' + content + '</button>' : '<div class="workout-compact-row">' + content + '</div>';
  }
  function list(vm) { return '<div class="workout-compact-list">' + html(vm && vm.itemsHtml) + '</div>'; }
  function footer(value) { return value ? '<div class="workout-footer">' + html(value) + '</div>' : ''; }
  function exercisePage(vm) {
    vm = vm || {};
    return '<div class="view workout-exercise-page"><div class="workout-detail-cover">' +
      (html(vm.mediaHtml) || '<div class="workout-media-empty" aria-label="Slika vježbe nije dostupna"></div>') +
      '<div class="workout-cover-bar">' + html(vm.topbarHtml) + '</div>' +
      (vm.infoHtml ? '<div class="workout-media-info">' + html(vm.infoHtml) + '</div>' : '') + '</div>' +
      '<div class="workout-detail-main"><header><p class="workout-eyebrow">' + esc(vm.eyebrow || 'Plan serija') + '</p><h1>' + esc(vm.name || 'Vježba') + '</h1>' +
      (vm.previousHtml ? '<div class="workout-detail-previous">' + html(vm.previousHtml) + '</div>' : '') + '</header>' +
      (vm.toolsHtml ? '<div class="workout-detail-tools" role="group" aria-label="Mogućnosti vježbe">' + html(vm.toolsHtml) + '</div>' : '') +
      (vm.targetHtml ? '<div class="workout-detail-target">' + html(vm.targetHtml) + '</div>' : '') +
      '<div class="workout-page-series">' + rows(vm.rowsHtml) + '</div>' +
      (vm.note ? '<p class="workout-note">' + esc(vm.note) + '</p>' : '') + '</div>' + footer(vm.footerHtml) + '</div>';
  }
  function journal(vm) {
    vm = vm || {};
    return '<div class="view workout-journal">' + html(vm.topbarHtml) +
      '<header class="workout-journal-heading"><p class="workout-eyebrow">Dnevnik treninga</p><h1>' + esc(vm.title || 'Trening') + '</h1></header>' +
      (vm.noticeHtml ? '<div class="workout-journal-notice">' + html(vm.noticeHtml) + '</div>' : '') +
      '<div class="workout-journal-blocks">' + (html(vm.blocksHtml) || '<p class="workout-empty">Nema serija za prikaz.</p>') + '</div></div>' + footer(vm.footerHtml);
  }
  function journalExercise(vm) {
    vm = vm || {};
    var valid = Number.isInteger(vm.index) && vm.index >= 0;
    var thumb = '<span class="workout-journal-thumb">' + (html(vm.thumbHtml) || '<span aria-hidden="true">' + (valid ? vm.index + 1 : '•') + '</span>') + '</span>';
    var name = '<span class="workout-journal-name">' + esc(vm.name || 'Vježba') + '</span>';
    var content = thumb + '<span class="workout-journal-title">' + name + '</span>';
    return '<article class="workout-journal-exercise"' + (valid ? ' data-index="' + vm.index + '"' : '') + '><header class="workout-journal-exheader">' +
      (valid ? '<button type="button" class="workout-journal-open" data-a="workoutExercise" data-j="' + vm.index + '" aria-label="' + esc('Otvori vježbu: ' + (vm.name || 'Vježba')) + '">' + content + '</button>' : '<div class="workout-journal-open">' + content + '</div>') +
      (vm.infoHtml ? '<span class="workout-journal-info">' + html(vm.infoHtml) + '</span>' : '') + '</header>' +
      (vm.previousHtml ? '<div class="workout-detail-previous">' + html(vm.previousHtml) + '</div>' : '') +
      (vm.toolsHtml ? '<div class="workout-detail-tools" role="group" aria-label="Mogućnosti vježbe">' + html(vm.toolsHtml) + '</div>' : '') +
      (vm.targetHtml ? '<div class="workout-detail-target">' + html(vm.targetHtml) + '</div>' : '') + rows(vm.rowsHtml) + '</article>';
  }
  function cinema(vm) {
    vm = vm || {};
    var phase = ['ready', 'rest', 'work'].indexOf(vm.phase) === -1 ? 'work' : vm.phase;
    // Every interactive fragment is supplied by the app. This renderer never
    // advances a phase, estimates a dose or invents a completion value.
    return '<div class="view workout-cinema is-' + phase + (vm.paused ? ' is-paused' : '') + '" data-phase="' + phase + '"' +
      (vm.exerciseId ? ' data-ex-id="' + esc(vm.exerciseId) + '"' : '') + '>' +
      '<header class="workout-cinema-topbar">' + html(vm.topbarHtml) +
      (vm.menuHtml ? '<div class="workout-cinema-menu">' + html(vm.menuHtml) + '</div>' : '') + '</header>' +
      (vm.progressHtml ? '<div class="workout-cinema-progress">' + html(vm.progressHtml) + '</div>' : '') +
      '<div class="workout-cinema-heading">' +
      (vm.subtitle ? '<p>' + esc(vm.subtitle) + '</p>' : '') + '<h1>' + esc(vm.name || 'Trening') + '</h1></div>' +
      (vm.noticeHtml ? '<div class="workout-cinema-notice">' + html(vm.noticeHtml) + '</div>' : '') +
      '<div class="workout-cinema-stage"><div class="workout-cinema-media">' +
      (html(vm.mediaHtml) || '<div class="workout-cinema-media-empty" aria-label="Demonstracija vježbe nije dostupna">' + icon('dumbbell') + '</div>') + '</div>' +
      (vm.infoHtml ? '<div class="workout-cinema-info">' + html(vm.infoHtml) + '</div>' : '') +
      (vm.nextHtml ? '<div class="workout-cinema-next">' + html(vm.nextHtml) + '</div>' : '') + '</div>' +
      '<div class="workout-cinema-bottom">' +
      (vm.restAdjustHtml ? '<div class="workout-cinema-rest-adjust">' + html(vm.restAdjustHtml) + '</div>' : '') +
      (vm.metricsHtml ? '<div class="workout-cinema-metrics">' + html(vm.metricsHtml) + '</div>' : '') +
      (vm.controlsHtml ? '<div class="workout-cinema-controls">' + html(vm.controlsHtml) + '</div>' : '') +
      (vm.journalHtml ? '<div class="workout-cinema-journal">' + html(vm.journalHtml) + '</div>' : '') + '</div></div>';
  }
  function seriesTable(vm) {
    vm = vm || {};
    var timed = vm.measure === 'time';
    // Rows and their controls remain owned by the app. Count only actual set
    // rows, so bilateral notes do not make a three-set plan look like six sets.
    var setCount = (html(vm.rowsHtml).match(/<tr\b[^>]*>/gi) || []).filter(function (row) {
      return !/\bworkout-set-details\b/.test(row);
    }).length;
    var density = setCount >= 5 ? 'compact' : 'comfortable';
    return '<table class="workout-series-table workout-set-table' + (density === 'compact' ? ' workout-series-compact' : '') + '" data-set-count="' + setCount + '" data-row-density="' + density + '" aria-label="' + esc('Serije za ' + (vm.name || 'vježbu')) + '">' +
      (vm.caption ? '<caption>' + esc(vm.caption) + '</caption>' : '') +
      '<thead><tr><th scope="col">Serija</th><th scope="col">' + (timed ? 'Sek.' : 'Pon.') + '</th><th scope="col">' + esc(vm.weightLabel || 'kg') +
      '</th><th scope="col">' + (timed ? 'SIR (s)' : 'RIR') + '</th></tr></thead><tbody>' +
      (html(vm.rowsHtml) || '<tr><td colspan="4" class="workout-table-empty">Serije nisu navedene.</td></tr>') + '</tbody></table>';
  }
  function names(value) {
    return (Array.isArray(value) ? value.filter(function (name) { return typeof name === 'string'; }).join(', ') : typeof value === 'string' ? value : '');
  }
  function instructions(vm) {
    vm = vm || {};
    var steps = Array.isArray(vm.steps) ? vm.steps.filter(function (step) { return typeof step === 'string' && step.trim(); }) : [];
    var primary = names(vm.primary), secondary = names(vm.secondary);
    return '<div class="workout-instructions-body"><h1>' + esc(vm.name || 'Vježba') + '</h1>' +
      (vm.why ? '<section><h2>Zašto je radiš</h2><p>' + esc(vm.why) + '</p></section>' : '') +
      '<section><h2>Kako pravilno izvesti</h2>' + (steps.length ? '<ol>' + steps.map(function (step) { return '<li>' + esc(step) + '</li>'; }).join('') + '</ol>' :
        '<p>Upute nisu dodane.</p>') + '</section>' +
      (vm.figureHtml || primary || secondary ? '<section><h2>Mišići u pokretu</h2>' +
        (vm.figureHtml ? '<div class="workout-muscle-figure workout-anatomy">' + html(vm.figureHtml) + '</div>' : '') +
        html(vm.figureCaptionHtml) +
        '<div class="workout-muscle-key">' + (primary ? '<div><span class="workout-primary-muscle" aria-hidden="true"></span><p><strong>Glavni</strong>' + esc(primary) + '</p></div>' : '') +
        (secondary ? '<div><span class="workout-secondary-muscle" aria-hidden="true"></span><p><strong>Pomoćni</strong>' + esc(secondary) + '</p></div>' : '') + '</div></section>' : '') + '</div>';
  }
  function finite(value) { return typeof value === 'number' && Number.isFinite(value); }
  function fmt(value) { return new Intl.NumberFormat('hr-HR', { maximumFractionDigits:2 }).format(value); }
  function date(value, full) { return new Intl.DateTimeFormat('hr-HR', full ? {day:'numeric',month:'numeric',year:'numeric'} : {day:'numeric',month:'numeric'}).format(new Date(value)); }
  function chart(vm) {
    vm = vm || {};
    var points = (Array.isArray(vm.points) ? vm.points : []).filter(function (point) { return point && finite(point.at) && !isNaN(new Date(point.at).getTime()); });
    var known = points.filter(function (point) { return finite(point.value) && point.value >= 0; });
    var unit = vm.unit || '', title = vm.title || 'Zabilježene izvedbe', kind = vm.type === 'bar' ? 'bar' : 'line';
    var chartId = String(vm.id || 'metric').replace(/[^a-zA-Z0-9_-]/g, '_'), paint = 'wk-' + chartId + '-fill';
    var markup = '<section class="workout-chart" data-chart-id="' + esc(vm.id || 'metric') + '"><header class="workout-chart-head"><div><h2>' + esc(title) + '</h2>' +
      (vm.subtitle ? '<p>' + esc(vm.subtitle) + '</p>' : '') + '</div>' +
      (points.length ? '<strong>' + esc(finite(points[points.length-1].value) && points[points.length-1].value >= 0 ? fmt(points[points.length-1].value) : '—') + ' <small>' + esc(unit) + '</small></strong>' : '') + '</header>';
    if (known.length) {
      var w = 320, h = kind === 'bar' ? 160 : 182, left = 43, right = 14, top = 29, bottom = h - 30;
      var values = known.map(function (point) { return point.value; }), min = Math.min.apply(null, values), max = Math.max.apply(null, values);
      var spread = max - min || Math.max(max * .15, 1);
      var low = kind === 'bar' ? 0 : Math.max(0, min - spread * .4), high = kind === 'bar' ? max * 1.2 || 1 : max + spread * .4;
      if (high <= low) high = low + 1;
      var rawStep=(high-low)/3, power=Math.pow(10,Math.floor(Math.log10(rawStep))), ratio=rawStep/power;
      var tick=(ratio<=1?1:ratio<=2?2:ratio<=5?5:10)*power;
      low=kind==='bar'?0:Math.max(0,Math.floor(low/tick)*tick);high=Math.ceil(high/tick)*tick;
      var x = function (i) { return kind === 'bar' ? left + (i + .5) * (w-left-right)/Math.max(1,points.length) : points.length > 1 ? left + i*(w-left-right)/(points.length-1) : (left+w-right)/2; };
      var y = function (value) { return bottom - (value-low)/(high-low)*(bottom-top); };
      var pretty = function (value) { return Number(value.toFixed(2)); };
      var label = function (point) { return date(point.at,true) + ' · ' + (finite(point.value) && point.value >= 0 ? fmt(point.value) + ' ' + unit : 'Nije zabilježeno') + (point.context ? ' · ' + point.context : ''); };
      var grid = [low,(low+high)/2,high].map(function (value) { return '<line x1="' + left + '" x2="' + (w-right) + '" y1="' + pretty(y(value)) + '" y2="' + pretty(y(value)) + '"/>' +
        '<text x="' + (left-8) + '" y="' + pretty(y(value)+4) + '" text-anchor="end">' + esc(fmt(value)) + '</text>'; }).join('');
      var art = '';
      if (kind === 'line') {
        var segments = [], segment = [];
        points.forEach(function (point,i) { if (finite(point.value) && point.value >= 0) segment.push([x(i),y(point.value)]); else if(segment.length){segments.push(segment);segment=[];} });
        if(segment.length)segments.push(segment);
        art += segments.filter(function (part) { return part.length > 1; }).map(function (part) {
          var line = part.map(function (xy,i) { return (i?'L':'M')+pretty(xy[0])+','+pretty(xy[1]); }).join(' ');
          return '<path class="workout-chart-area" d="' + line + ' L' + pretty(part[part.length-1][0]) + ',' + bottom + ' L' + pretty(part[0][0]) + ',' + bottom + ' Z" fill="url(#' + paint + ')"/>' +
            '<path class="workout-chart-line" d="' + line + '"/>';
        }).join('');
      }
      var every = Math.max(1,Math.ceil(points.length/5));
      points.forEach(function (point,i) {
        var valid = finite(point.value) && point.value >= 0, show = i % every === 0 || i === points.length-1;
        if(valid) {
          var px=pretty(x(i)), py=pretty(y(point.value));
          art += '<g><title>' + esc(label(point)) + '</title>' + (kind === 'line' ? '<circle class="workout-chart-dot" cx="' + px + '" cy="' + py + '" r="' + (i===points.length-1?4.5:3) + '"/>' :
            '<rect class="workout-chart-bar" x="' + pretty(px-Math.min(29,(w-left-right)/points.length*.52)/2) + '" y="' + py + '" width="' + pretty(Math.min(29,(w-left-right)/points.length*.52)) + '" height="' + pretty(bottom-py) + '" rx="5" fill="url(#' + paint + ')" opacity="' + (i===points.length-1?'1':'.55') + '"/>') +
            (show ? '<text class="workout-chart-value" x="' + px + '" y="' + pretty(py-10) + '" text-anchor="' + (kind==='line'&&points.length>1?(i===0?'start':i===points.length-1?'end':'middle'):'middle') + '">' + esc(fmt(point.value)) + '</text>' : '') + '</g>';
        }
        if(show)art+='<text class="workout-chart-date" x="' + pretty(x(i)) + '" y="' + (h-9) + '" text-anchor="middle">' + esc(date(point.at,false)) + '</text>';
      });
      markup += '<svg class="workout-trend-svg workout-' + kind + '-chart" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(title + ': ' + points.map(label).join('; ') + '. Iste vrijednosti su u tablici.') + '">' +
        '<defs><linearGradient id="' + paint + '" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="' + (kind==='line'?'#dce88d':'#a9c8f4') + '" stop-opacity="' + (kind==='line'?'.22':'1') + '"/><stop offset="100%" stop-color="' + (kind==='line'?'#dce88d':'#648ebf') + '" stop-opacity="' + (kind==='line'?'0':'1') + '"/></linearGradient></defs>' +
        '<text x="6" y="15">' + esc(unit) + '</text><g class="workout-chart-grid">' + grid + '</g>' + art + '</svg>';
    } else markup += '<p class="workout-empty">' + esc(vm.emptyText || 'Za ovaj prikaz još nema zabilježenih vrijednosti.') + '</p>';
    if(points.length)markup+='<details class="workout-chart-table"><summary>Tablica vrijednosti</summary><table><caption>' + esc(title + (unit?' ('+unit+')':'')) +
      '</caption><thead><tr><th scope="col">Datum</th><th scope="col">Vrijednost</th><th scope="col">Kontekst</th></tr></thead><tbody>' +
      points.map(function (point) { return '<tr><th scope="row">' + esc(date(point.at,true)) + '</th><td>' + esc(finite(point.value)&&point.value>=0?fmt(point.value)+' '+unit:'Nije zabilježeno') + '</td><td>' + esc(point.context || '—') + '</td></tr>'; }).join('') + '</tbody></table></details>';
    return markup + '</section>';
  }
  function trends(vm) {
    vm = vm || {};
    return '<div class="workout-trends-body"><h1>' + esc(vm.name || 'Napredak vježbe') + '</h1>' +
      (vm.subtitle ? '<p class="workout-panel-subtitle">' + esc(vm.subtitle) + '</p>' : '') +
      (html(vm.chartsHtml) || '<p class="workout-empty">Još nema zabilježenih vrijednosti za trend.</p>') + html(vm.currentHtml) +
      (vm.note ? '<p class="workout-note">' + esc(vm.note) + '</p>' : '') + '</div>';
  }
  return Object.freeze({ icon:icon, overview:overview, block:block, exercise:exercise, panel:panel, list:list,
    compactExercise:compactExercise, exercisePage:exercisePage, journal:journal, journalExercise:journalExercise,
    cinema:cinema, seriesTable:seriesTable, instructions:instructions, chart:chart, trends:trends });
});
