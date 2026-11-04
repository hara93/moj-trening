/* Progress presentation only. Existing app calculators own all training data;
   trusted *Html fragments below come from those existing escaped renderers. */
(function (root, factory) {
  'use strict';
  var api = factory();
  if (root) root.ProgressView = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';
  var focusBeforeInfo = null;
  var activeTab = 'pregled';
  var panelState = { pregled: null, doziranje: null };
  function rememberPanels(view) {
    if (!view) return;
    var tab = view.getAttribute('data-progress-tab');
    if (!hasTab(tab)) return;
    var state = {};
    view.querySelectorAll('details.pg-section').forEach(function (panel) { state[panel.id] = panel.open; });
    panelState[tab] = state;
  }
  function hasTab(tab) { return tab === 'pregled' || tab === 'doziranje'; }
  if (typeof document !== 'undefined') document.addEventListener('toggle', function (event) {
    var panel = event.target;
    if (panel.isConnected && panel.matches && panel.matches('details.pg-section')) {
      rememberPanels(panel.closest('.progress-view'));
    }
  }, true);
  var INFO = {
    overview: {
      title: 'Kako čitati napredak',
      paragraphs: ['Pregled pokazuje odrađene treninge, količinu rada i promjene u vježbama. Otvori samo dio koji te zanima.',
        'Tjedan po planu prati tvoje planirane treninge. Ekipni treninzi ulaze u ukupan broj odrađenih treninga, a isprobavanje vježbe iz knjižnice ostaje u povijesti te vježbe.']
    },
    load: {
      title: 'Količina rada kroz tjedne',
      paragraphs: ['Volumen tereta zbraja stvarno odrađene kilograme × ponavljanja. Vježbe po strani uključuju obje odrađene strane.',
        'Teren zbraja poznate metre; brzo trčanje je njihov dio. Usporedba koristi prethodna četiri kalendarska tjedna. Nepotpuni zapisi daju samo poznati dio rada.',
        'Više rada samo po sebi nije ocjena boljeg treninga. Lakši tjedan može biti dio plana.']
    },
    suggestions: {
      title: 'Prijedlozi koje ti potvrđuješ',
      paragraphs: ['Prijedlog se pojavi nakon zadanog broja uzastopnih uspješnih izvedbi. Može predložiti veću dozu, težu varijantu ili povratak na prethodnu dozu.',
        'Protokol se mijenja tek kad prihvatiš prijedlog. Djelomičan, preskočen ili uživo izmijenjen trening ne gura brojač prema povećanju. Programi zadržavaju svoju propisanu dozu.']
    },
    exercises: {
      title: 'Trendovi glavnih vježbi',
      paragraphs: ['Ovdje su do četiri najčešće praćene glavne vježbe s najmanje dvije zabilježene izvedbe. Svaki graf ima i tablicu s istim vrijednostima.',
        'Dodirni stupac ili točku za detalj. Otvori vježbu za njezinu punu povijest, druge raspone i upute.']
    },
    records: {
      title: 'Kako nastaje rekord',
      paragraphs: ['Rekord je nova najbolja procjena maksimuma koja je nadmašila raniju izvedbu. Prva upisana težina još nije rekord.',
        'Prikazuju se rekordi zadnjih 30 dana. Procjena koristi stvarne kilograme i ponavljanja iste serije, uz najviše 10 ponavljanja u formuli; nije izmjeren pokušaj jednog maksimalnog dizanja.']
    },
    consistency: {
      title: 'Tvoja dosljednost',
      paragraphs: ['Mreža prikazuje zadnjih 12 kalendarskih tjedana. Svaki kvadratić je jedan dan, a redovi su dani od ponedjeljka do nedjelje.',
        'Svjetlija boja znači više zabilježenih treninga tog dana. Prazno polje znači da nema spremljenog treninga, a ne da sigurno nisi bio aktivan.']
    },
    rules: {
      title: 'Pravilo napredovanja',
      paragraphs: ['Odaberi treba li prijedlog čekati dvije ili tri uzastopne uspješne izvedbe iste propisane doze.',
        'Ovo pravilo otvara prijedlog. Ništa ne povećava automatski i ne mijenja propisane programe.']
    }
  };
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function info(topic, label) {
    return '<button type="button" class="pg-info" data-a="progressInfo" data-topic="' + esc(topic) +
      '" aria-label="' + esc(label || 'Više o ovom prikazu') + '"><span aria-hidden="true">i</span></button>';
  }
  function heading(title, subtitle, topic) {
    return '<div class="pg-panel-head"><div><h2>' + esc(title) + '</h2>' +
      (subtitle ? '<p>' + esc(subtitle) + '</p>' : '') + '</div>' + info(topic, 'Kako čitati: ' + title) + '</div>';
  }
  function section(id, title, hint, content, options) {
    options = options || {};
    var saved = panelState[activeTab];
    var isOpen = saved && Object.prototype.hasOwnProperty.call(saved, 'pg-' + id) ? saved['pg-' + id] : options.open;
    return '<details class="pg-section" id="pg-' + esc(id) + '"' + (isOpen ? ' open' : '') +
      '><summary><span class="pg-section-label"><strong>' + esc(title) + '</strong><small>' + esc(hint) +
      '</small></span>' + (options.count != null ? '<span class="pg-count">' + esc(options.count) + '</span>' : '') +
      '<span class="pg-chevron" aria-hidden="true">⌄</span></summary><div class="pg-section-body">' +
      content + '</div></details>';
  }
  function empty(message) { return '<p class="pg-empty-line">' + esc(message) + '</p>'; }
  function exampleFlow(caption, labels) {
    return '<div class="pg-help-visual"><small>' + esc(caption) + '</small><div class="pg-example-flow">' +
      labels.map(function (label, index) {
        return (index ? '<span class="pg-example-arrow" aria-hidden="true">→</span>' : '') + '<b>' + esc(label) + '</b>';
      }).join('') + '</div></div>';
  }
  function infoVisual(topic) {
    if (topic === 'load') return '<div class="pg-help-visual"><small>Primjer · jedna serija</small>' +
      '<div class="pg-example-load" role="img" aria-label="Primjer: 5 ponavljanja puta 20 kilograma jednako je 100 kilograma volumena tereta.">' +
      '<div><strong>5</strong><span>ponavljanja</span></div><b aria-hidden="true">×</b><div><strong>20</strong><span>kg</span></div>' +
      '<b aria-hidden="true">=</b><div class="pg-example-result"><strong>100</strong><span>kg volumena</span></div></div></div>';
    if (topic === 'exercises') return '<div class="pg-help-visual"><small>Primjer · usporedive izvedbe</small>' +
      '<svg class="pg-example-chart" viewBox="0 0 260 86" role="img" aria-label="Ilustracija trenda kroz tri izvedbe; ovo nisu tvoji rezultati.">' +
      '<path class="pg-example-grid" d="M15 18H245 M15 44H245 M15 65H245"/>' +
      '<path class="pg-example-line" d="M27 56L130 35L233 23"/><circle cx="27" cy="56" r="4"/><circle cx="130" cy="35" r="4"/><circle cx="233" cy="23" r="4"/>' +
      '<text x="27" y="82" text-anchor="middle">1. izvedba</text><text x="130" y="82" text-anchor="middle">2.</text><text x="233" y="82" text-anchor="middle">3.</text></svg></div>';
    if (topic === 'consistency') return '<div class="pg-help-visual"><small>Primjer · jedan tjedan</small><div class="pg-example-week" ' +
      'role="img" aria-label="Ilustracija: zabilježen trening u ponedjeljak, srijedu i subotu.">' +
      ['P','U','S','Č','P','S','N'].map(function (day, index) {
        return '<span><b>' + day + '</b><i' + ([0,2,5].includes(index) ? ' class="on"' : '') + '></i></span>';
      }).join('') + '</div></div>';
    if (topic === 'records') return exampleFlow('Primjer · procijenjeni maksimum', ['Ranije 40 kg', 'Novih 42 kg']);
    if (topic === 'suggestions') return exampleFlow('Primjer · dvije uspješne izvedbe', ['✓ Prva', '✓ Druga', 'Tvoja potvrda']);
    if (topic === 'rules') return exampleFlow('Pravilo s dvije izvedbe', ['✓ Ista doza', '✓ Ista doza', 'Prijedlog']);
    return exampleFlow('Od zapisa do odluke', ['Odrađeno', 'Trend', 'Tvoj odabir']);
  }
  function infoHtml(topic) {
    var content = INFO[topic] || INFO.overview;
    return infoVisual(topic) + content.paragraphs.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') +
      (topic === 'load' ? '<button type="button" class="pg-text-link" data-a="loadInfo">Detaljne formule i pretpostavke ↗</button>' : '');
  }
  function dialog() {
    return '<dialog id="progress-info" class="pg-dialog" aria-labelledby="progress-info-title">' +
      '<div class="pg-dialog-head"><h2 id="progress-info-title"></h2><button type="button" ' +
      'data-a="progressInfoClose" aria-label="Zatvori objašnjenje">×</button></div>' +
      '<div id="progress-info-body"></div><button type="button" class="pg-dialog-done" data-a="progressInfoClose">Jasno</button></dialog>';
  }
  function render(vm) {
    vm = vm || {};
    if (typeof document !== 'undefined') rememberPanels(document.querySelector('.progress-view'));
    activeTab = vm.tab === 'doziranje' ? 'doziranje' : 'pregled';
    var counts = vm.counts || {}, stats = vm.stats || [];
    var html = '<div class="view progress-view" data-progress-tab="' + activeTab + '">' + (vm.topbarHtml || '') +
      '<header class="pg-heading"><div><p class="pg-kicker">Tvoj rad kroz vrijeme</p><h1>Napredak</h1></div>' +
      info('overview', 'Kako čitati Napredak') + '</header>' +
      '<div class="pg-tabs" role="group" aria-label="Prikaz napretka">' +
      '<button type="button" data-a="progTab" data-v="pregled" aria-pressed="' + (vm.tab !== 'doziranje') + '">Pregled</button>' +
      '<button type="button" data-a="progTab" data-v="doziranje" aria-pressed="' + (vm.tab === 'doziranje') + '">Doziranje</button></div>';
    if (vm.tab === 'doziranje') {
      return html + '<p class="pg-intro">Postavi cilj i nogometni tjedan. Prijedloge doze potvrđuješ prije primjene.</p>' +
        '<div class="pg-dosing">' + (vm.dosingSections || []).map(function (item, index) {
          return section('dose-' + index, item.title, item.hint, item.html, { open: index === 0 });
        }).join('') + '</div>' + dialog() + '</div>';
    }
    html += '<section class="pg-overview" aria-label="Brzi pregled">' + stats.map(function (stat, index) {
      return '<div' + (index === 0 ? ' class="pg-stat-main"' : '') + '><strong>' + esc(stat.value) +
        '</strong><span>' + esc(stat.label) + '</span>' + (stat.note ? '<small>' + esc(stat.note) + '</small>' : '') + '</div>';
    }).join('') + '</section><div class="pg-shortcuts"><button type="button" data-a="historyList">Povijest treninga <span aria-hidden="true">↗</span></button>' +
      '<button type="button" data-a="tab" data-tab="dashboard">Moj pregled <span aria-hidden="true">↗</span></button></div>';
    if (vm.zero) {
      html += '<section class="pg-zero"><span class="pg-zero-mark" aria-hidden="true">↗</span><h2>Prvi trening, prvi pomak</h2>' +
        '<p>Spremi odrađeni trening. Ovdje ćeš pratiti svoj rad, trendove i prijedloge za sljedeći korak.</p>' +
        '<button type="button" data-a="tab" data-tab="home">Odaberi trening</button></section>';
    }
    var ready = Number(counts.ready) || 0, missing = Number(counts.missing) || 0, way = Number(counts.way) || 0;
    var suggestions = heading('Ti odlučuješ o promjeni', '', 'suggestions') +
      (vm.suggestionsHtml || empty('Još nema prijedloga za promjenu doze.')) + (vm.missingWeightsHtml || '') +
      (vm.wayHtml ? '<div class="pg-subhead"><h3>Na putu do prijedloga</h3><span>' + esc(vm.ruleN || 2) + ' uspješne izvedbe</span></div>' + vm.wayHtml : '');
    html += section('suggestions', 'Sljedeći korak', ready ? ready + ' ' + (ready === 1 ? 'prijedlog čeka potvrdu' : 'prijedloga čekaju potvrdu')
      : missing ? 'Dopuni početne kilograme' : way ? 'Prati uspješne izvedbe' : 'Prijedlog se pojavi kad ispuniš pravilo',
      suggestions, { open: ready > 0 || missing > 0, count: ready || undefined });
    var load = heading('Količina rada', 'Zadnjih 8 kalendarskih tjedana', 'load') +
      (vm.weeklyHtml || empty('Nakon treninga s kilogramima ili terenskog treninga ovdje se vidi tjedni trend.'));
    html += section('load', 'Tjedni trendovi', vm.loadHint || 'Kilogrami i poznati metri', load,
      { open: !vm.zero && !!vm.hasWeeklyData });
    var exercises = (vm.exercises || []).map(function (exercise) {
      return '<div class="pg-exercise">' + (exercise.html || '') +
        '<button type="button" class="pg-exercise-link" data-a="openEx" data-id="' + esc(exercise.id) +
        '" aria-label="' + esc('Otvori vježbu: ' + exercise.name) + '">Otvori vježbu i povijest <span aria-hidden="true">↗</span></button></div>';
    }).join('');
    html += section('exercises', 'Glavne vježbe', exercises ? 'Iste vježbe, usporedivi treninzi' : 'Graf se otvara nakon dvije izvedbe',
      heading('Trendovi vježbi', '', 'exercises') + (exercises || empty('Još nema dvije usporedive izvedbe glavne vježbe. Nastavi spremati stvarno odrađene serije.')),
      { count: exercises ? vm.exercises.length : undefined });
    html += section('records', 'Rekordi', 'Nove najbolje procjene · zadnjih 30 dana',
      heading('Bolje od prethodne izvedbe', '', 'records') +
      (vm.recordsHtml || empty('Još nema novog rekorda u zadnjih 30 dana. Prva upisana težina postavlja početnu vrijednost.')),
      { count: counts.records || undefined });
    html += section('consistency', 'Dosljednost', vm.consistencyHint || 'Dani s odrađenim treningom · 12 tjedana',
      heading('Dani u kojima si trenirao', 'Zadnjih 12 tjedana', 'consistency') +
      '<div class="pg-heat-wrap"><div class="pg-heat-days" aria-hidden="true"><span>P</span><span>U</span><span>S</span><span>Č</span><span>P</span><span>S</span><span>N</span></div>' +
      '<div class="heat" role="img" aria-label="' + esc(vm.heatLabel || 'Zadnjih 12 tjedana') + '">' + (vm.heatHtml || '') + '</div></div>' +
      '<div class="pg-heat-key"><span><i></i>Bez zapisa</span><span><i class="l2"></i>1 trening</span><span><i class="l3"></i>2 ili više</span></div>');
    html += section('rules', 'Pravilo napredovanja', 'Prijedlog nakon ' + esc(vm.ruleN || 2) + ' uspješne izvedbe',
      heading('Koliko izvedbi prije prijedloga?', '', 'rules') +
      '<div class="pg-rule-buttons" role="group" aria-label="Uvjet za prijedlog">' + [2, 3].map(function (n) {
        return '<button type="button" data-a="setProgN" data-v="' + n + '" aria-pressed="' + ((vm.ruleN || 2) === n) + '">' + n + ' treninga zaredom</button>';
      }).join('') + '</div><button type="button" class="pg-text-link" data-a="progInfo">Sve o pravilima i dozama ↗</button>');
    return html + dialog() + '</div>';
  }
  function restoreInfoFocus() {
    if (focusBeforeInfo && focusBeforeInfo.isConnected) focusBeforeInfo.focus();
  }
  function showInfo(topic, trigger) {
    var content = INFO[topic] || INFO.overview;
    var element = document.getElementById('progress-info');
    if (!element) return;
    focusBeforeInfo = trigger && typeof trigger.focus === 'function' ? trigger : document.activeElement;
    element.querySelector('#progress-info-title').textContent = content.title;
    element.querySelector('#progress-info-body').innerHTML = infoHtml(topic);
    element.onclick = function (event) { if (event.target === element) closeInfo(); };
    element.oncancel = function (event) { event.preventDefault(); closeInfo(); };
    element.onclose = restoreInfoFocus;
    if (typeof element.showModal === 'function') element.showModal();
    else element.setAttribute('open', '');
    element.querySelector('button').focus();
  }
  function closeInfo() {
    var element = document.getElementById('progress-info');
    if (!element) return;
    if (typeof element.close === 'function') element.close();
    else element.removeAttribute('open');
    restoreInfoFocus();
  }
  return { render: render, showInfo: showInfo, closeInfo: closeInfo, infoHtml: infoHtml };
});
