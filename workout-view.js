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
    return '<div class="view workout-overview">' + html(vm.topbarHtml) +
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
  return Object.freeze({ overview:overview, block:block, exercise:exercise, panel:panel });
});
