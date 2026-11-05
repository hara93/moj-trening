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
      '<header class="workout-heading"><p class="workout-eyebrow">Pregled treninga</p><h1>' + esc(vm.title) + '</h1>' +
      (vm.description ? '<p class="workout-description">' + esc(vm.description) + '</p>' : '') +
      (vm.metaHtml ? '<div class="workout-meta">' + html(vm.metaHtml) + '</div>' : '') + '</header>' +
      '<div class="workout-blocks">' + (html(vm.blocksHtml) || '<p class="workout-empty">Dodaj vježbe kako bi se ovdje prikazale njihove serije.</p>') + '</div>' +
      (vm.detailsHtml ? '<div class="workout-details">' + html(vm.detailsHtml) + '</div>' : '') + '</div>';
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
      (vm.note ? '<p class="workout-note">' + esc(vm.note) + '</p>' : '') + '</div></div>' + footer(vm.footerHtml);
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
  function seriesTable(vm) {
    vm = vm || {};
    var timed = vm.measure === 'time';
    return '<table class="workout-series-table workout-set-table" aria-label="' + esc('Serije za ' + (vm.name || 'vježbu')) + '">' +
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
  return Object.freeze({ overview:overview, block:block, exercise:exercise, panel:panel, list:list,
    compactExercise:compactExercise, exercisePage:exercisePage, journal:journal, journalExercise:journalExercise,
    seriesTable:seriesTable, instructions:instructions, chart:chart, trends:trends });
});
