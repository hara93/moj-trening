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
      paragraphs: ['Krug prikazuje tjedni plan ili aktivne dane od ponedjeljka do nedjelje. Odabirom razdoblja mijenjaš trend vježbe i graf napora.',
        'Za usporedbu odaberi vježbu. Dodirni dan ili razdoblje u grafu napora za spremljene treninge i unos ocjene koja nedostaje.']
    },
    performance: {
      title: 'Što točno uspoređujemo',
      paragraphs: ['Svaka kartica uspoređuje najbolju potpuno odrađenu seriju iste vježbe pri istoj zabilježenoj težini i istom načinu izvođenja po stranama. Vrijednost je broj ponavljanja ili trajanje jedne serije, a ne zbroj treninga.',
        'Datumi i uvjeti stoje uz usporedbu. Ako rezerva ponavljanja ili sekundi nije ista ili nije poznata, to je označeno. Veći broj sam po sebi ne dokazuje veću snagu, bolji oporavak ili optimalan napor.',
        'Prva izvedba postavlja polazište. Promjena se prikazuje tek kad postoji usporediv raniji zapis; niži rezultat i rezultat bez promjene jednako su dio povijesti.']
    },
    activity: {
      title: 'Tvojih osam tjedana',
      paragraphs: ['Svaki stupac pokazuje broj spremljenih treninga u jednom kalendarskom tjednu, od ponedjeljka do nedjelje. Uključeni su vlastiti i ekipni treninzi. Isprobavanja vježbi, testovi i budući zapisi nisu uključeni.',
        'Zadnji tjedan još traje. Prazan stupac znači da nema spremljenog treninga. Broj treninga i minute mjere aktivnost, a ne kvalitetu ili fizički napredak.',
        'Tablica prikazuje i poznate minute te zabilježeni napor u jedinicama napora (j.n.): tvoja ocjena × minute. Ako neki trening nema ocjenu napora ili trajanje, njegov napor nije poznat i nije prikazan kao nula. Broj zapisa bez trajanja označen je i uz minute.']
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
  function finite(value) { return typeof value === 'number' && isFinite(value); }
  function amount(value) { return new Intl.NumberFormat('hr-HR', { maximumFractionDigits: 2 }).format(value); }
  function shortDate(value) {
    return finite(value) && !isNaN(new Date(value).getTime()) ? new Intl.DateTimeFormat('hr-HR', {
      day: 'numeric', month: 'numeric', year: 'numeric'
    }).format(new Date(value)) : 'Datum nije zabilježen';
  }
  function weekDate(value) {
    return finite(value) && !isNaN(new Date(value).getTime()) ? new Intl.DateTimeFormat('hr-HR', {
      day: 'numeric', month: 'numeric'
    }).format(new Date(value)) : '—';
  }
  function comparisonHtml(item) {
    var delta = item.current - item.previous;
    var change = delta === 0 ? 'Bez promjene' : (delta > 0 ? '+' : '−') + amount(Math.abs(delta)) + ' ' + item.unit;
    var low = Math.min(item.previous, item.current), high = Math.max(item.previous, item.current), spread = high - low;
    var y = function (v) { return spread ? 37 - (v - low) / spread * 22 : 26; };
    var trend = '<svg class="pg-comparison-trend" viewBox="0 0 240 54" role="img" aria-label="' +
      esc(shortDate(item.previousAt) + ': ' + amount(item.previous) + ' ' + item.unit + '; ' + shortDate(item.currentAt) + ': ' + amount(item.current) + ' ' + item.unit) +
      '"><path class="pg-trend-grid" d="M12 44H228"/><path class="pg-trend-line" d="M22 ' + y(item.previous) + 'L218 ' + y(item.current) +
      '"/><circle class="pg-trend-point" cx="22" cy="' + y(item.previous) + '" r="3.5"/><circle class="pg-trend-point pg-trend-latest" cx="218" cy="' + y(item.current) + '" r="4.5"/></svg>';
    return '<article class="pg-comparison" data-id="' + esc(item.id) + '" data-kind="' + esc(item.kind) + '">' +
      '<div class="pg-comparison-top"><span>' + (item.kind === 'time' ? 'Trajanje serije' : 'Ponavljanja u seriji') +
      '</span><span class="pg-change' + (delta > 0 ? ' pg-change-up' : '') + '">' + esc(change) + '</span></div>' +
      '<h3>' + esc(item.name) + '</h3><div class="pg-comparison-values"><div><span>Prethodno</span>' +
      '<strong class="pg-before">' + esc(amount(item.previous)) + ' <small>' + esc(item.unit) + '</small></strong>' +
      '<time datetime="' + esc(new Date(item.previousAt).toISOString()) + '">' + esc(shortDate(item.previousAt)) + '</time></div>' +
      '<span class="pg-comparison-arrow" aria-hidden="true">→</span><div><span>Posljednje usporedivo</span>' +
      '<strong class="pg-after">' + esc(amount(item.current)) + ' <small>' + esc(item.unit) + '</small></strong>' +
      '<time datetime="' + esc(new Date(item.currentAt).toISOString()) + '">' + esc(shortDate(item.currentAt)) + '</time></div></div>' +
      trend + '<p class="pg-context">' + esc(item.context) + '</p>' +
      '<button type="button" class="pg-exercise-link" data-a="openEx" data-id="' + esc(item.id) +
      '" aria-label="' + esc('Otvori vježbu i povijest: ' + item.name) + '">Vježba i puna povijest <span aria-hidden="true">↗</span></button></article>';
  }
  function performanceHtml(insights, zero) {
    var comparisons = (Array.isArray(insights.comparisons) ? insights.comparisons : []).filter(function (item) {
      return item && item.id && ['reps', 'time'].includes(item.kind) && finite(item.current) && item.current >= 0 &&
        finite(item.previous) && item.previous >= 0 && finite(item.currentAt) && finite(item.previousAt) &&
        !isNaN(new Date(item.currentAt).getTime()) && !isNaN(new Date(item.previousAt).getTime());
    });
    if (zero && !comparisons.length) return '';
    return '<section id="pg-performance" class="pg-visible-panel" aria-labelledby="pg-performance-title">' +
      '<div class="pg-panel-head"><div><p class="pg-eyebrow">Iz tvojih zapisa</p><h2 id="pg-performance-title">Što se promijenilo</h2></div>' +
      info('performance', 'Kako uspoređujemo izvedbe') + '</div>' +
      (comparisons.length ? '<div class="pg-comparisons">' + comparisons.map(comparisonHtml).join('') + '</div>' :
        '<div class="pg-comparison-empty"><h3>Prva izvedba je polazište</h3><p>Za usporedbu trebaju dvije zabilježene izvedbe iste vježbe pri istoj težini i načinu izvođenja. Različite doze i dalje vidiš u punoj povijesti.</p></div>') + '</section>';
  }
  function activityWeeks(insights) {
    return (Array.isArray(insights.weeks) ? insights.weeks : []).filter(function (week) {
      return week && finite(week.start) && !isNaN(new Date(week.start).getTime()) && finite(week.count) && week.count >= 0;
    }).slice(-8);
  }
  function activityHtml(insights) {
    var weeks = activityWeeks(insights);
    if (!weeks.length) return '';
    var total = weeks.reduce(function (sum, week) { return sum + week.count; }, 0);
    var minutes = weeks.reduce(function (sum, week) { return sum + (finite(week.minutes) && week.minutes >= 0 ? week.minutes : 0); }, 0);
    var missingDuration = weeks.reduce(function (sum, week) { return sum + (finite(week.missingDuration) && week.missingDuration > 0 ? week.missingDuration : 0); }, 0);
    var minuteSummary = missingDuration > 0 ? (total > 0 && missingDuration >= total ? '— min' : amount(minutes) + ' min poznato') +
      ' · ' + amount(missingDuration) + ' bez trajanja' : amount(minutes) + ' min zabilježeno';
    var max = Math.max.apply(null, [1].concat(weeks.map(function (week) { return week.count; })));
    var step = 292 / weeks.length;
    var bars = weeks.map(function (week, index) {
      var x = 20 + step * index + step / 2, height = week.count / max * 70;
      return '<g><rect class="pg-activity-track" x="' + (x - 11) + '" y="24" width="22" height="70" rx="7"/>' +
        (index === weeks.length - 1 ? '<rect class="pg-activity-selection" x="' + (x - 15) + '" y="20" width="30" height="79" rx="10"/>' : '') +
        (height ? '<rect class="pg-activity-bar' + (index === weeks.length - 1 ? ' pg-activity-current' : '') + '" x="' + (x - 11) + '" y="' + (94 - height) + '" width="22" height="' + height + '" rx="7"/>' : '') +
        '<text class="pg-activity-count" x="' + x + '" y="15" text-anchor="middle">' + esc(amount(week.count)) + '</text>' +
        '<text class="pg-activity-date" x="' + x + '" y="112" text-anchor="middle">' + esc(weekDate(week.start)) + '</text></g>';
    }).join('');
    var activityGrid = '<path class="pg-activity-grid" d="M20 24H312M20 59H312M20 94H312"/>' +
      '<text class="pg-activity-axis" x="9" y="27" text-anchor="middle">' + esc(amount(max)) + '</text><text class="pg-activity-axis" x="9" y="97" text-anchor="middle">0</text>';
    function knownAu(week) {
      var hasKnown = finite(week.au) && week.au >= 0 && !(week.count > 0 && week.unrated >= week.count);
      var known = hasKnown ? amount(week.au) : '—';
      return week.unrated > 0 ? known + (hasKnown ? ' poznato' : '') + ' · ' + amount(week.unrated) + ' nepoznato' : known;
    }
    function knownMinutes(week) {
      var hasKnown = finite(week.minutes) && week.minutes >= 0 && !(week.count > 0 && week.missingDuration >= week.count);
      var known = hasKnown ? amount(week.minutes) : '—';
      return week.missingDuration > 0 ? known + ' · ' + amount(week.missingDuration) + ' bez trajanja' : known;
    }
    return '<section id="pg-activity" class="pg-visible-panel pg-activity" aria-labelledby="pg-activity-title">' +
      '<div class="pg-panel-head"><div><p class="pg-eyebrow">Ritam aktivnosti</p><h2 id="pg-activity-title">Zadnjih 8 tjedana</h2></div>' +
      info('activity', 'Kako čitati aktivnost kroz tjedne') + '</div>' +
      '<div class="pg-activity-summary"><strong>' + esc(amount(total)) + '<span>spremljenih treninga</span></strong>' +
      '<span>' + esc(minuteSummary) + '</span></div>' +
      '<svg class="pg-activity-chart" viewBox="0 0 320 119" role="img" aria-label="' +
      esc('Broj spremljenih treninga po tjednima: ' + weeks.map(function (week) { return weekDate(week.start) + ' ' + week.count; }).join('; ') + '. Zadnji tjedan još traje. Iste vrijednosti su u tablici.') + '">' + activityGrid + bars + '</svg>' +
      '<p class="pg-activity-note"><span aria-hidden="true"></span>Ovaj tjedan je u tijeku</p>' +
      '<details class="pg-activity-table"><summary>Brojke po tjednima</summary><table><caption>Aktivnost iz spremljenih treninga. Napor je u jedinicama napora (j.n.).</caption>' +
      '<thead><tr><th scope="col">Tjedan od</th><th scope="col">Treninzi</th><th scope="col">Poznate min</th><th scope="col">Napor (<span aria-hidden="true">j.n.</span><span class="pg-sr">jedinice napora</span>)</th></tr></thead><tbody>' +
      weeks.slice().reverse().map(function (week) {
        return '<tr><th scope="row">' + esc(shortDate(week.start)) + '</th><td>' + esc(amount(week.count)) + '</td><td>' +
          esc(knownMinutes(week)) + '</td><td>' + esc(knownAu(week)) + '</td></tr>';
      }).join('') + '</tbody></table></details></section>';
  }
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
    if (topic === 'performance') return exampleFlow('Ilustracija · ista težina, jedna serija', ['Ranije 6 pon.', 'Kasnije 8 pon.']);
    if (topic === 'exercises') return '<div class="pg-help-visual"><small>Primjer · usporedive izvedbe</small>' +
      '<svg class="pg-example-chart" viewBox="0 0 260 86" role="img" aria-label="Ilustracija trenda kroz tri izvedbe; ovo nisu tvoji rezultati.">' +
      '<path class="pg-example-grid" d="M15 18H245 M15 44H245 M15 65H245"/>' +
      '<path class="pg-example-line" d="M27 56L130 35L233 23"/><circle cx="27" cy="56" r="4"/><circle cx="130" cy="35" r="4"/><circle cx="233" cy="23" r="4"/>' +
      '<text x="27" y="82" text-anchor="middle">1. izvedba</text><text x="130" y="82" text-anchor="middle">2.</text><text x="233" y="82" text-anchor="middle">3.</text></svg></div>';
    if (topic === 'consistency' || topic === 'activity') return '<div class="pg-help-visual"><small>Primjer · jedan tjedan</small><div class="pg-example-week" ' +
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
      '<h2 id="progress-info-title" tabindex="-1" autofocus></h2>' +
      '<div id="progress-info-body"></div></dialog>';
  }
  function renderLegacy(vm) {
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
      var action = index === 2 ? 'data-a="historyList"' : 'data-a="progressInfo" data-topic="' + (index === 0 ? 'activity' : 'consistency') + '"';
      return '<button type="button"' + (index === 0 ? ' class="pg-stat-main"' : '') + ' ' + action + ' aria-label="' + esc(stat.value + ' ' + stat.label + '. Otvori detalje') + '"><strong>' + esc(stat.value) +
        '</strong><span>' + esc(stat.label) + '</span>' + (stat.note ? '<small>' + esc(stat.note) + '</small>' : '') + '</button>';
    }).join('') + '</section><div class="pg-shortcuts"><button type="button" data-a="historyList">Povijest treninga <span aria-hidden="true">↗</span></button>' +
      '<button type="button" data-a="tab" data-tab="dashboard">Moj pregled <span aria-hidden="true">↗</span></button></div>';
    if (vm.zero) {
      html += '<section class="pg-zero"><span class="pg-zero-mark" aria-hidden="true">↗</span><h2>Prvi trening, prvi pomak</h2>' +
        '<p>Spremi odrađeni trening. Ovdje ćeš pratiti svoj rad, trendove i prijedloge za sljedeći korak.</p>' +
        '<button type="button" data-a="tab" data-tab="home">Odaberi trening</button></section>';
    }
    html += performanceHtml(vm.insights || {}, vm.zero) + activityHtml(vm.insights || {});
    html += '<div class="pg-tools-heading"><h2>Detalji i alati</h2></div>';
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
      { open: false });
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
  var lastVM = {};
  function comparisons(vm) {
    return (Array.isArray((vm.insights || {}).comparisons) ? vm.insights.comparisons : []).filter(function(item) {
      return item && item.id && ['reps','time'].includes(item.kind) && finite(item.previous) && item.previous >= 0 && finite(item.current) && item.current >= 0 && finite(item.previousAt) && finite(item.currentAt) && !isNaN(new Date(item.previousAt).getTime()) && !isNaN(new Date(item.currentAt).getTime());
    });
  }
  function choices(vm) {
    var source=Array.isArray(vm.chartExercises)?vm.chartExercises:comparisons(vm).concat(Array.isArray(vm.exercises)?vm.exercises:[]);
    var seen=new Set(),out=[];
    source.forEach(function(item){
      if(!item || typeof item.id!=='string' || !item.id || seen.has(item.id))return;
      seen.add(item.id);out.push({id:item.id,name:item.name || 'Vježba',alt:item.alt || ''});
    });
    return out;
  }
  function pinnedChoices(vm,items) {
    var ids=Array.isArray(vm.chartPinnedIds)?vm.chartPinnedIds:[];
    return Array.from(new Set(ids)).map(function(id){return items.find(function(item){return item.id===id;});}).filter(Boolean).slice(0,3);
  }
  function selectedChoice(vm,items,pinned) {
    return items.find(function(item){return item.id===vm.chartExerciseId;}) || pinned[0] || items[0];
  }
  function rangeTabs(period) {
    var options = [['7d','7 dana','Zadnjih 7 dana'],['1m','1 mj.','Zadnjih 30 dana'],['3m','3 mj.','Zadnjih 90 dana'],['all','Sve','Sve vrijeme']];
    var selected = options.some(function (option) { return option[0]===period; }) ? period : 'all';
    return '<div class="tl-range-tabs pg-range-tabs" role="group" aria-label="Razdoblje analize">' + options.map(function (option) {
      return '<button type="button" data-a="progressRange" data-v="'+option[0]+'" aria-label="'+option[2]+'" aria-pressed="'+(option[0]===selected)+'">'+option[1]+'</button>';
    }).join('') + '</div>';
  }
  function drill(topic,title,subtitle,action) {
    return '<button type="button" class="pg-drill-row" '+(action || 'data-a="progressDetail" data-topic="'+topic+'"')+'><span><strong>'+esc(title)+'</strong>'+(subtitle?'<small>'+esc(subtitle)+'</small>':'')+'</span><span aria-hidden="true">›</span></button>';
  }
  function chartComparison(vm, id) {
    var item = Object.prototype.hasOwnProperty.call(vm,'chartComparison') ? vm.chartComparison : comparisons(vm).find(function (entry) { return entry.id===id; });
    return item && item.id===id ? item : null;
  }
  function chartPoints(item) {
    return Array.isArray(item.points) && item.points.length>=2 ? item.points : [
      {at:item.previousAt,value:item.previous},{at:item.currentAt,value:item.current}
    ];
  }
  function pointAttributes(item,point,index,count) {
    var key=index===count-1?'current':index===count-2?'previous':'point-'+index;
    return ' data-a="progressDetail" data-topic="point" data-id="'+esc(item.id)+'" data-point="'+key+'" data-point-index="'+index+'" aria-label="'+
      esc(shortDate(point.at)+', '+amount(point.value)+' '+item.unit+'. Prikaži zapis')+'"';
  }
  function pointButton(item,point,index,count,year) {
    return '<button type="button"'+pointAttributes(item,point,index,count)+'><span>'+esc(year?shortDate(point.at):weekDate(point.at))+'</span><strong>'+
      esc(amount(point.value))+' <small>'+esc(item.unit)+'</small></strong><i aria-hidden="true">↗</i></button>';
  }
  function chartLoadContext(item) {
    return finite(item.kg) ? 'Najbolja puna serija · '+amount(item.kg)+' kg u zapisu'+(item.sides===2?' · obje strane odrađene':'')+'.' : '';
  }
  function mainPerformance(item) {
    if(!item)return '<div class="pg-main-empty"><h3>Nema dovoljno usporedivih izvedbi</h3><p>Za ovaj trend trebaju barem dvije usporedive izvedbe u odabranom razdoblju.</p></div>';
    var points=chartPoints(item), count=points.length, first=points[0], last=points[count-1];
    var min=first.value,max=first.value;
    points.forEach(function(point){min=Math.min(min,point.value);max=Math.max(max,point.value);});
    var padding=Math.max(1,max-min)*.25,lo=Math.max(0,min-padding),hi=max+padding;
    var year=new Date(first.at).getFullYear()!==new Date(last.at).getFullYear();
    var context=count>2?chartLoadContext(item):item.context||'';
    var x=function(at){return 48+241*(at-first.at)/Math.max(1,last.at-first.at);};
    var y=function(v){return 115-(v-lo)/(hi-lo)*84;};
    var text=item.name+' · Usporedive izvedbe ('+count+'). '+shortDate(first.at)+' '+amount(first.value)+' '+item.unit+'; '+shortDate(last.at)+' '+amount(last.value)+' '+item.unit+'. '+context;
    var graph='<svg class="pg-main-line" viewBox="0 0 320 150" role="img" aria-label="'+esc(text)+'">';
    [lo,(lo+hi)/2,hi].forEach(function(v){graph+='<line class="pg-main-grid" x1="32" x2="306" y1="'+y(v)+'" y2="'+y(v)+'"/><text class="pg-main-axis" x="25" y="'+(y(v)+3)+'" text-anchor="end">'+esc(amount(v))+'</text>';});
    graph+='<path class="pg-main-path" d="'+points.map(function(point,index){return (index?'L':'M')+x(point.at)+' '+y(point.value);}).join(' ')+'"/>';
    graph+=points.map(function(point,index){var latest=index===count-1;return '<circle class="pg-main-dot'+(latest?' pg-main-current':'')+'" cx="'+x(point.at)+'" cy="'+y(point.value)+'" r="'+(latest?5:4)+'"/>';}).join('');
    graph+=[first,last].map(function(point){return '<text class="pg-main-axis" x="'+x(point.at)+'" y="143" text-anchor="middle">'+esc(year?shortDate(point.at):weekDate(point.at))+'</text>';}).join('')+'</svg>';
    var hits='<div class="pg-point-hits">'+points.map(function(point,index){return '<button type="button" class="pg-point-hit" tabindex="-1"'+pointAttributes(item,point,index,count)+' style="left:'+(x(point.at)/320*100)+'%;top:'+(y(point.value)/150*100)+'%"></button>';}).join('')+'</div>';
    var rest=count>2?'<details class="pg-trend-records"><summary>Ostali zapisi u razdoblju · '+(count-2)+'</summary><div class="pg-point-buttons">'+
      points.slice(1,-1).map(function(point,index){return pointButton(item,point,index+1,count,year);}).join('')+'</div></details>':'';
    return '<div id="pg-performance" class="pg-main-performance"><p class="pg-main-context">'+esc(context)+'</p><div class="pg-performance-plot">'+graph+hits+'</div><div class="pg-point-buttons">'+
      pointButton(item,first,0,count,year)+pointButton(item,last,count-1,count,year)+'</div>'+rest+'</div>';
  }
  function ringPoint(radius, angle) {
    return (44 + Math.sin(angle) * radius).toFixed(2) + ' ' + (44 - Math.cos(angle) * radius).toFixed(2);
  }
  function ringSegment(inner, outer, start, end) {
    return 'M' + ringPoint(outer, start) + 'A' + outer + ' ' + outer + ' 0 0 1 ' + ringPoint(outer, end) +
      'L' + ringPoint(inner, end) + 'A' + inner + ' ' + inner + ' 0 0 0 ' + ringPoint(inner, start) + 'Z';
  }
  function ringGradient(id, inner, outer, tone) {
    var edge = ((outer - 3.7) / outer * 100).toFixed(2) + '%';
    var start = ' class="pg-ring-' + tone + '-start"';
    return '<radialGradient id="' + id + '" gradientUnits="userSpaceOnUse" cx="44" cy="44" r="' + outer + '">' +
      '<stop offset="' + (inner / outer * 100).toFixed(2) + '%"' + start + ' stop-opacity="0"/>' +
      '<stop offset="' + edge + '"' + start + ' stop-opacity=".36"/>' +
      '<stop offset="' + edge + '"' + start + '/><stop offset="100%" class="pg-ring-' + tone + '-end"/></radialGradient>';
  }
  function summaryRings(key, fractions) {
    var gradients = '', tracks = '', fills = '', end = 0;
    fractions.forEach(function (fraction, index) {
      var id = 'pg-ring-' + key + '-' + index;
      var tone = key === 'cadence' || index === 1 ? 'blue' : 'mint';
      var inner = index ? 24 : fractions.length > 1 ? 34 : 26, outer = index ? 32 : 41;
      var count = index ? 24 : 28, step = 2 * Math.PI / count;
      var filled = Math.min(fraction, 1) * count;
      var track = '', active = '';
      for (var tick = 0; tick < count; tick++) {
        var start = (tick + .09) * step;
        track += ringSegment(inner, outer, start, start + .82 * step);
        if (filled > tick) {
          var stop = start + .82 * step * Math.min(1, filled - tick);
          active += ringSegment(inner, outer, start, stop);
          end = Math.max(end, stop);
        }
      }
      gradients += ringGradient(id + '-track', inner, outer, 'track');
      tracks += '<path class="pg-ring-track" d="' + track + '" fill="url(#' + id + '-track)"/>';
      if (!active) return;
      gradients += ringGradient(id, inner, outer, tone);
      fills += '<path class="pg-ring-fill" d="' + active + '" fill="url(#' + id + ')"/>';
    });
    if (fills) {
      var mask = 'pg-ring-reveal-' + key, length = Math.min(100, end / (2 * Math.PI) * 100 + .2);
      gradients += '<mask id="' + mask + '" maskUnits="userSpaceOnUse" x="0" y="0" width="88" height="88">' +
        '<circle class="chart-ring-sweep" cx="44" cy="44" r="31" stroke-width="42" pathLength="100" stroke-dasharray="100 100" transform="rotate(-90 44 44)" style="--chart-ring-length:' + length + '"/></mask>';
      fills = '<g mask="url(#' + mask + ')">' + fills + '</g>';
    }
    return '<svg class="pg-ring-graphic" viewBox="0 0 88 88" aria-hidden="true"><defs>' + gradients + '</defs>' + tracks + fills + '</svg>';
  }
  function summaryCard(card) {
    return '<button type="button" class="pg-ring-card" data-a="progressDetail" data-topic="' + card.topic + '">' +
      '<span class="pg-ring-stage">' + summaryRings(card.key, card.fractions) + '<span class="pg-ring-readout">' +
      '<strong' + (card.up ? ' class="pg-summary-up"' : '') + '>' + esc(card.value) + '</strong>' +
      (card.total != null ? '<span>od ' + esc(card.total) + '</span>' : '') + '</span></span>' +
      '<span class="pg-ring-label">' + esc(card.label) + '</span>' +
      (card.note ? '<small class="pg-ring-note">' + esc(card.note) + '</small>' : '') +
      (card.comparison ? '<small class="pg-ring-legend"><span>Prije ' + esc(amount(card.comparison.previous)) +
        '</span><span>Zadnje ' + esc(amount(card.comparison.current)) + '</span></small>' : '') + '</button>';
  }
  function weeklySummary(stats, plan) {
    var card = { key:'week', topic:'activity', label:stats.label, value:stats.value, note:stats.note, fractions:[0] };
    if (finite(plan.done) && finite(plan.planned) && plan.planned > 0) {
      card.label = 'Plan ovaj tjedan';
      card.value = amount(plan.done);
      card.total = amount(plan.planned);
      card.note = stats.note || 'Odrađeni treninzi';
      card.fractions = [plan.done / plan.planned];
    } else if (finite(plan.activeDays)) {
      card.label = 'Aktivni dani ovaj tjedan';
      card.value = amount(plan.activeDays);
      card.total = '7';
      card.note = 'Spremljeni treninzi · ' + stats.value;
      card.fractions = [plan.activeDays / 7];
    }
    return card;
  }
  var pickerSearchIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="5.5"/><path d="m15 15 4 4"/></svg>';
  var pickerPinIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 4h12v16l-6-4-6 4z"/></svg>';
  function mainChart(vm) {
    var items=choices(vm),pinned=pinnedChoices(vm,items),selected=selectedChoice(vm,items,pinned);
    var content='<section class="pg-main-card" aria-label="Glavni graf napretka"><div class="pg-main-title"><h2>'+esc(selected?selected.name:'Tvoj trend')+'</h2>';
    if(!selected)return content+'</div><div class="pg-main-empty pg-main-unavailable"><p>Graf će se prikazati kad spremiš dovoljno izvedbi iste vježbe.</p></div></section>';
    var id=selected.id,isPinned=pinned.some(function(item){return item.id===id;}),pinFull=!isPinned&&pinned.length>=3;
    var comparison=comparisons(vm).find(function(item){return item.id===id;});
    var hasComparison=typeof vm.chartHasComparison==='boolean'?vm.chartHasComparison:!!comparison;
    var metric=['performance','volume'].includes(vm.chartMetric)?vm.chartMetric:hasComparison?'performance':'volume';
    var exercise=(Array.isArray(vm.exercises)?vm.exercises:[]).find(function(item){return item.id===id;});
    var volume=Object.prototype.hasOwnProperty.call(vm,'chartVolumeHtml')?vm.chartVolumeHtml:exercise&&exercise.html;
    content+='<div class="pg-chart-actions"><button type="button" class="pg-pin" data-a="progressPin" data-id="'+esc(id)+'" aria-label="Prati vježbu" aria-pressed="'+isPinned+'"'+(pinFull?' disabled':'')+'>'+pickerPinIcon+'<span>'+(isPinned?'Pratim':'Prati')+'</span></button>'+
      '<button type="button" class="pg-choose" data-a="progressDetail" data-topic="choose" aria-label="Odaberi vježbu za graf" aria-haspopup="dialog">'+pickerSearchIcon+'</button></div></div>';
    if(pinned.length)content+='<div class="pg-pinned"><span id="pg-pinned-title">Praćene vježbe</span><div role="group" aria-labelledby="pg-pinned-title">'+pinned.map(function(item){
      var trend=(Array.isArray(vm.chartPinnedTrends)?vm.chartPinnedTrends:[]).find(function(entry){return entry && entry.id===item.id;});
      var readout='';
      if(trend && finite(trend.current) && finite(trend.delta) && ['pon.','s'].includes(trend.unit)){
        var delta=trend.delta;
        readout='<small>'+amount(trend.current)+' '+esc(trend.unit)+' <span'+(delta>0?' class="pg-pin-up"':delta<0?' class="pg-pin-down"':'')+' title="Promjena od prethodne usporedive serije">· '+(delta>0?'+':delta<0?'−':'')+amount(Math.abs(delta))+'</span></small>';
      }
      return '<button type="button" data-a="progressExercise" data-id="'+esc(item.id)+'" aria-pressed="'+(item.id===id)+'"><span>'+esc(item.name)+'</span>'+readout+'</button>';
    }).join('')+'</div></div>';
    if(pinFull)content+='<p class="pg-pin-hint">Pratiš 3 vježbe. Odaberi jednu od njih i isključi praćenje za novi odabir.</p>';
    return content+'<div class="pg-metric-tabs" role="group" aria-label="Mjera napretka"><button type="button" data-a="progressMetric" data-v="performance" aria-pressed="'+(metric==='performance')+'">Izvedba</button><button type="button" data-a="progressMetric" data-v="volume" aria-pressed="'+(metric==='volume')+'">Količina rada</button></div>'+
      (metric==='performance'?mainPerformance(chartComparison(vm,id)):volume?'<div class="pg-main-volume">'+volume+'</div>':'<div class="pg-main-empty"><h3>Još nema podataka o količini rada</h3><p>U odabranom razdoblju nema zabilježenog rada za ovu vježbu.</p></div>')+
      '<button type="button" class="pg-chart-footer" data-a="openEx" data-id="'+esc(id)+'">Vježba i puna povijest <span aria-hidden="true">›</span></button></section>';
  }
  function pickerRows(items,selectedId) {
    if(!items.length)return '<p class="pg-picker-empty" role="status">Nema zabilježenih vježbi koje odgovaraju pretrazi.</p>';
    return items.map(function(item){
      return '<button type="button" data-a="progressExercise" data-id="'+esc(item.id)+'"'+(item.id===selectedId?' aria-current="true"':'')+'><strong>'+esc(item.name)+'</strong><span aria-hidden="true">'+(item.id===selectedId?'✓':'›')+'</span></button>';
    }).join('');
  }
  function searchKey(value) {
    return String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d');
  }
  function bindPicker(element,items,selectedId) {
    var input=element.querySelector('#progress-exercise-search'),results=element.querySelector('.pg-picker-list');
    var entries=items.map(function(item){return {item:item,key:searchKey(item.name+' '+item.alt)};});
    input.addEventListener('input',function(){
      var words=searchKey(input.value).trim().split(/\s+/);
      var matches=entries.filter(function(entry){return words.every(function(word){return entry.key.includes(word);});});
      results.innerHTML=pickerRows(matches.map(function(entry){return entry.item;}),selectedId);
    });
  }
  function focusPanel(vm, week) {
    return '<section class="pg-focus" aria-label="Cilj i sljedeći korak"><div class="pg-focus-top">'+
      '<button type="button" class="pg-focus-goal" data-a="progTab" data-v="doziranje"><small>Tvoj cilj</small><strong>'+
      esc(vm.goal || 'Postavi cilj')+'</strong><span>'+ (vm.goal ? 'Postavke cilja' : 'Odaberi što želiš razvijati')+' <i aria-hidden="true">›</i></span></button>'+
      summaryCard(week)+'</div>'+
      (vm.nextStep?'<button type="button" class="pg-focus-step" data-a="todayOpen"><span><small>'+esc(vm.nextStepLabel||'Sljedeći korak')+'</small><strong>'+
        esc(vm.nextStep)+'</strong></span><i aria-hidden="true">›</i></button>':'')+'</section>';
  }
  function render(vm) {
    vm=vm || {};lastVM=vm;
    if(vm.tab==='doziranje')return renderLegacy(vm);
    var details=renderLegacy(vm),stats=Array.isArray(vm.stats)?vm.stats:[];
    var week=weeklySummary(stats[0] || {value:'—',label:'Ovaj tjedan'},vm.weekPlan || {});
    return '<div class="view progress-view pg-cinema" data-progress-tab="pregled">'+(vm.topbarHtml || '')+
      '<header class="pg-heading"><div><p class="pg-kicker">Tvoj cilj i tvoj rad</p><h1>Napredak</h1></div>'+info('overview','Kako čitati Napredak')+'</header>'+
      focusPanel(vm,week)+'<section class="pg-analysis-range" aria-label="Razdoblje trendova i opterećenja">'+
      '<h2>Razdoblje</h2>'+rangeTabs(vm.chartPeriod)+'</section>'+mainChart(vm)+(vm.loadHtml || '')+
      '<nav class="pg-drill-list" aria-label="Detaljni pregledi">'+drill('','Mišićni tjedan','Izravne i pomoćne serije','data-a="analyticsOpen" data-section="muscles"')+
      drill('records','Rekordi','Osobni rezultati iz dnevnika')+drill('performance','Usporedive izvedbe','Cijela povijest')+
      drill('','Povijest treninga','Pregledaj i uredi zapise','data-a="historyList"')+
      drill('suggestions','Plan i prijedlozi',(vm.counts||{}).ready?vm.counts.ready+' čeka potvrdu':'')+'</nav>'+
      '<template id="progress-detail-cache">'+details+'</template>'+dialog()+'</div>';
  }
  function showDetail(topic,trigger,data) {
    var element=document.getElementById('progress-info'),cache=document.getElementById('progress-detail-cache');if(!element || !cache)return;
    var title='Detalji napretka',body='',source=null,pickerList=null,pickerSelected=null;
    if(topic==='choose') {
      title='Odaberi vježbu';pickerList=choices(lastVM);
      if(!pickerList.length)return;
      pickerSelected=selectedChoice(lastVM,pickerList,pinnedChoices(lastVM,pickerList)).id;
      body='<label class="pg-picker-search">'+pickerSearchIcon+'<input id="progress-exercise-search" type="search" aria-label="Pretraži zabilježene vježbe" placeholder="Traži vježbu" autocomplete="off"></label>'+
        '<div class="pg-picker-list" role="group" aria-label="Zabilježene vježbe">'+pickerRows(pickerList,pickerSelected)+'</div>';
    } else if(topic==='point') {
      var item=chartComparison(lastVM,(data||{}).id),points=item?chartPoints(item):[];
      var index=data&&data.pointIndex!=null?Number(data.pointIndex):points.length-(data&&data.point==='previous'?2:1),point=points[index];
      if(point){
        var reserveLabel=item.kind==='time'?'Rezerva u sekundama':'RIR';
        var context=point.reserve===undefined?item.context||'':chartLoadContext(item)+' '+(point.reserve===null?'Rezerva nije zabilježena.':reserveLabel+' '+amount(point.reserve)+'.');
        title=shortDate(point.at);
        body='<h3>'+esc(item.name)+'</h3><div class="pg-point-detail"><span>Najbolja potpuno odrađena serija</span><strong>'+esc(amount(point.value))+' '+esc(item.unit)+'</strong><p>'+esc(context)+'</p></div><button type="button" class="pg-exercise-link" data-a="openEx" data-id="'+esc(item.id)+'">Vježba i puna povijest <span aria-hidden="true">↗</span></button>';
      }else body=empty('Zapis za ovu točku nije dostupan.');
    } else {
      var keys={activity:'Aktivnost i kontinuitet',performance:'Usporedive izvedbe',suggestions:'Plan i prijedlozi',load:'Tjedni trendovi',exercises:'Trendovi vježbi',records:'Rekordi',rules:'Pravilo napredovanja'};
      title=keys[topic] || 'Detalji napretka';source=cache.content.querySelector('#pg-'+topic);
      if(source)body=source.outerHTML;
      if(topic==='activity'){var heat=cache.content.querySelector('#pg-consistency');if(heat)body+=heat.outerHTML;}
      if(topic==='suggestions'){['load','exercises','rules'].forEach(function(key){var extra=cache.content.querySelector('#pg-'+key);if(extra)body+=extra.outerHTML;});}
      if(!body)body=empty('Za ovaj prikaz još nema dovoljno zapisa.');
    }
    if(!element.open || !element.contains(trigger))focusBeforeInfo=trigger&&typeof trigger.focus==='function'?trigger:document.activeElement;
    element.querySelector('#progress-info-title').textContent=title;element.querySelector('#progress-info-body').innerHTML=body;
    if(pickerList)bindPicker(element,pickerList,pickerSelected);
    var panel=element.querySelector('details.pg-section');if(panel)panel.open=true;
    openDialog(element);
  }
  function restoreInfoFocus() {
    if (focusBeforeInfo && focusBeforeInfo.isConnected) focusBeforeInfo.focus();
  }
  function showInfo(topic, trigger) {
    var content = INFO[topic] || INFO.overview;
    var element = document.getElementById('progress-info');
    if (!element) return;
    if(!element.open || !element.contains(trigger)) focusBeforeInfo = trigger && typeof trigger.focus === 'function' ? trigger : document.activeElement;
    element.querySelector('#progress-info-title').textContent = content.title;
    element.querySelector('#progress-info-body').innerHTML = infoHtml(topic);
    openDialog(element);
  }
  function openDialog(element) {
    element.oncancel = function (event) { event.preventDefault(); closeInfo(); };
    element.onclose = restoreInfoFocus;
    if (typeof element.showModal === 'function') element.showModal();
    else element.setAttribute('open', '');
    element.querySelector('#progress-info-body').scrollTop = 0;
    element.querySelector('#progress-info-title').focus({preventScroll:true});
  }
  function closeInfo() {
    var element = document.getElementById('progress-info');
    if (!element || !element.hasAttribute('open')) return;
    if (typeof element.close === 'function') element.close();
    else element.removeAttribute('open');
    restoreInfoFocus();
  }
  return { render: render, showInfo: showInfo, showDetail: showDetail, closeInfo: closeInfo, infoHtml: infoHtml };
});
