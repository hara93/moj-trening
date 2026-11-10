/* Moj pregled is a pure renderer. The app supplies the current local week's prepared
   model; this module never reads a store, infers a prescription, or saves a forecast.
   TrainingDashboard.render(vm) -> compact daily dashboard.
   TrainingDashboard.analytics(vm) -> detailed weekly work, using the same
     {range,today,forecast,selectedGroup,summary,coverage,groups,sessions,days,quality}.
   A group's actual/planned values are {direct, indirect, equivalent, days}; planned
   means remaining occurrences from today through Sunday, not completed sessions.
   Session contributions are {exerciseId, name, groupId, direct, indirect}.
   The caller owns dashboardGroup/Joint/Forecast/Protocols/Calendar/Progress/Analytics actions. */
(function(root) {
  'use strict';

  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const num = value => typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null;
  const val = value => num(value) == null ? 0 : value;
  const fmt = value => num(value) == null ? '—' : value.toLocaleString('hr-HR', {maximumFractionDigits:1});
  const list = value => Array.isArray(value) ? value : [];
  const plural = (n, one, few, many) => n % 10 === 1 && n % 100 !== 11 ? one : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? few : many;
  const setLabel = n => fmt(n) + ' ' + plural(val(n), 'serija', 'serije', 'serija');
  const dateLabel = (date, today) => {
    if (date === today) return 'Danas';
    if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return '';
    const d = new Date(date + 'T12:00:00');
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('hr-HR',{weekday:'short',day:'numeric',month:'numeric'});
  };
  const icon = name => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ({
    calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4M17 3v4M3 10h18M7 14h2M15 14h2M7 17h2"/>',
    history:'<path d="M3 11a9 9 0 1 1 2.6 7M3 4v7h7M12 7v5l3 2"/>',
    protocol:'<rect x="5" y="4" width="14" height="17" rx="3"/><path d="M9 4V2h6v2M9 10h6M9 14h6M9 18h3"/>',
    chart:'<path d="M4 4v16h16M8 15l4-5 4 2 4-7"/>',
    arrow:'<path d="m9 5 7 7-7 7"/>',
    check:'<path d="m5 12 4 4L19 6"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>'
  }[name] || '') + '</svg>';

  function quickLinks() {
    return '<nav class="db-quick" aria-label="Prečaci iz pregleda">' +
      '<button type="button" data-a="dashboardProtocols">'+icon('protocol')+'<span>Moji treninzi</span></button>' +
      '<button type="button" data-a="dashboardCalendar">'+icon('calendar')+'<span>Kalendar</span></button>' +
      '<button type="button" data-a="historyList" aria-label="Povijest treninga">'+icon('history')+'<span>Povijest</span></button></nav>';
  }

  function stateView(vm, detailed) {
    const error = !!vm.error;
    return '<div class="view dashboard '+(detailed?'db-analytics':'db-home')+'"><header class="db-heading"><h1>'+(detailed?'Analiza tjedna':'Moj pregled')+'</h1></header>' + (detailed?'<button type="button" class="db-back" data-a="back" aria-label="Natrag">'+icon('arrow')+'</button>':quickLinks()) +
      '<section class="db-state" role="'+(error?'alert':'status')+'">'+icon(error?'info':'chart')+'<h2>'+(error?'Pregled trenutačno nije dostupan':'Učitavam tvoj tjedan')+'</h2><p>'+
      (error?'Podaci se nisu mogli pripremiti za pregled. Svojim treninzima možeš pristupiti kroz Moje treninge.':'Pripremam zabilježene treninge i preostali raspored.')+'</p></section></div>';
  }

  function bodyFigure(groups, selected, forecast) {
    if (!root.BODY || typeof root.BODY.svg !== 'function') return '<p class="db-figure-fallback">Odaberi skupinu iz popisa ispod.</p>';
    const byRegion = {}, appearance = {}, fills = {};
    groups.forEach(g => list(g.regions).forEach(id => { byRegion[id] = g; }));
    Object.keys(byRegion).forEach(region => {
      const g = byRegion[region], actual = val((g.actual || {}).equivalent), planned = forecast && val((g.planned || {}).equivalent) > 0;
      const state = actual > 0 ? 'recorded' : planned ? 'forecast' : 'empty';
      const picked = g.id === selected;
      const fill = state === 'forecast' ? 'url(#db-forecast-fill)' : state === 'recorded' ? (val((g.actual || {}).direct) > 0 ? '#68D0BC' : '#89B3FC') : picked ? '#5789E8' : '#768293';
      appearance[region] = {state,planned};
      fills[region] = {fill,opacity:state === 'empty' ? picked ? '.9' : '.16' : '.86',selected:picked};
    });
    let html = root.BODY.svg({size:250,tappable:true,cls:'db-body-svg',fills});
    html = html.replace(/<path class="body-rg[^\"]*" data-region="([a-z_]+)"([^>]*?)\/>/g, (all, region, rest) => {
      const path = / d="([^"]+)"/.exec(rest);
      if (!path) return all;
      const meta = root.BODY.regions && root.BODY.regions[region];
      if (meta && meta.kind === 'joint') {
        return '<path class="body-tap db-region db-region-joint" data-region="'+esc(region)+'" data-a="dashboardJoint" data-id="'+esc(region)+'" tabindex="0" role="button" aria-haspopup="dialog" aria-label="'+esc(meta.label_hr)+'" fill="#9AABC2" fill-opacity=".22" fill-rule="evenodd" d="'+path[1]+'"/>';
      }
      const g = byRegion[region];
      if (!g) return '<path class="db-region db-region-context" data-region="'+esc(region)+'" fill="transparent" pointer-events="none" fill-rule="evenodd" d="'+path[1]+'"/>';
      const {state,planned} = appearance[region];
      const regionLabel = meta ? meta.label_hr : g.label;
      const label = regionLabel + ': ' + fmt((g.actual || {}).equivalent) + ' procijenjenih serija' + (planned ? ', ima preostali plan' : '') + '. Prikaži skupinu ' + g.label;
      return '<path class="body-tap db-region db-region-'+state+(g.id===selected?' db-region-selected':'')+'" data-region="'+esc(region)+'" data-a="dashboardGroup" data-id="'+esc(g.id)+'" tabindex="0" role="button" aria-label="'+esc(label)+'" aria-pressed="'+(g.id===selected)+'" fill="transparent" fill-opacity="0" style="fill-opacity:0!important" fill-rule="evenodd" d="'+path[1]+'"/>';
    });
    // Expand small joint targets in screen pixels. The semantic hip control has
    // the same invisible stroke so WebKit touch adjustment can target it. Keep
    // it beneath muscles so their small neighbouring centres remain selectable.
    html = html.replace(/(<g data-view="(?:front|back)"[^>]*>)([\s\S]*?)(?=<g class="body-ln")/g, (all, start, content) => {
      let targets = '', hipControls = '';
      content = content.replace(/<path class="body-tap db-region db-region-joint"([^>]*?)\/>/g, (joint, attrs) => {
        const region = / data-region="([a-z_]+)"/.exec(attrs), path = / d="([^"]+)"/.exec(attrs);
        if (region && path) targets += '<path class="body-tap db-joint-hit" data-region="'+region[1]+'" data-a="dashboardJoint" data-id="'+region[1]+'" aria-hidden="true" focusable="false" fill="transparent" stroke="transparent" stroke-width="14" vector-effect="non-scaling-stroke" pointer-events="all" fill-rule="evenodd" d="'+path[1]+'"/>';
        if (region && region[1] === 'hip_joints') { hipControls += joint; return ''; }
        return joint;
      });
      return start + targets + hipControls + content;
    });
    // Keyboard focus follows the same individual pieces; hit paths never paint
    // the former combined region over the visible gaps between muscle parts.
    const focusStyle = groups.map(g => {
      const selectors = list(g.regions).map(region => '.db-body-svg:has(.db-region[data-id="'+esc(g.id)+'"]:focus-visible) .body-muscle-fill[data-muscle="'+esc(region)+'"]');
      return selectors.length ? selectors.join(',')+'{stroke:#FFFFFF;stroke-opacity:1;stroke-width:2;vector-effect:non-scaling-stroke}' : '';
    }).join('');
    html = html.replace(/(<svg\b[^>]*>)/, '$1<style>'+focusStyle+'</style><defs><pattern id="db-forecast-fill" width="22" height="22" patternUnits="userSpaceOnUse"><rect width="22" height="22" fill="#514169"/><path d="M-5 5 5-5M0 22 22 0M17 27 27 17" stroke="#C7ACFF" stroke-width="6"/></pattern></defs>');
    return html;
  }

  function coverageRing(coverage, forecast) {
    const total = val(coverage.total), done = Math.min(total,val(coverage.done));
    const projected = Math.max(done, Math.min(total,val(coverage.projected)));
    const c = 2*Math.PI*47, step = c/28, length = total ? done/total*c : 0;
    const geometry = ' cx="56" cy="56" r="47" transform="rotate(-90 56 56)"';
    const mask = '<mask id="db-ring-ticks" maskUnits="userSpaceOnUse" x="0" y="0" width="112" height="112"><circle class="db-ring-mask"'+geometry+' stroke-dasharray="'+step*.78+' '+step*.22+'"/></mask>';
    let fills = '';
    if (length) fills += '<circle class="db-ring-done"'+geometry+' stroke-dasharray="'+length+' '+c+'"/>';
    if (forecast && projected>done) fills += '<circle class="db-ring-plan"'+geometry+' stroke-dasharray="'+(projected-done)/total*c+' '+c+'" stroke-dashoffset="'+(-length)+'"/>';
    const reveal = fills ? '<mask id="db-ring-reveal" maskUnits="userSpaceOnUse" x="0" y="0" width="112" height="112">'+
      '<circle class="chart-ring-sweep"'+geometry+' stroke-width="10" pathLength="100" stroke-dasharray="100 100" style="--chart-ring-length:'+((forecast?projected:done)/total*100)+'"/></mask>' : '';
    const svg = '<svg viewBox="0 0 112 112" aria-hidden="true" focusable="false"><defs>'+mask+reveal+'</defs><g mask="url(#db-ring-ticks)"><circle class="db-ring-track"'+geometry+'/>'+
      (fills?'<g mask="url(#db-ring-reveal)">'+fills+'</g>':'')+'</g></svg>';
    return '<div class="db-coverage"><div class="db-ring">'+svg+'<div><strong>'+fmt(done)+'<small>/'+fmt(total)+'</small></strong></div></div><b>skupina sa<br>zabilježenim radom</b>'+
      (forecast?'<span class="db-projection">S planom <strong>'+fmt(projected)+'/'+fmt(total)+'</strong></span>':'')+'</div>';
  }

  function qualityNotes(q, current) {
    const notes = [];
    if (val(q.missingSessions)) notes.push(fmt(q.missingSessions)+' '+plural(q.missingSessions,'sesija nema','sesije nemaju','sesija nema')+' dostupnu raspodjelu po mišićima.');
    if (val(q.unallocatedSessions)) notes.push(fmt(q.unallocatedSessions)+' '+plural(q.unallocatedSessions,'sesija sadrži','sesije sadrže','sesija sadrži')+' rad bez potvrđene raspodjele.');
    if (val(q.partialSessions)) notes.push(fmt(q.partialSessions)+' '+plural(q.partialSessions,'sesija sadrži','sesije sadrže','sesija sadrži')+' djelomično odrađenu vježbu.');
    if (current && val(q.missingPlannedSessions)) notes.push('Za '+fmt(q.missingPlannedSessions)+' '+plural(q.missingPlannedSessions,'planirani termin','planirana termina','planiranih termina')+' raspodjela nije dostupna.');
    if (!notes.length) return '';
    const missing=val(q.missingSessions)||val(q.unallocatedSessions)||(current&&val(q.missingPlannedSessions));
    return '<aside class="db-quality">'+icon('info')+'<div><strong>'+(missing?'Potpunost podataka':'Djelomična izvedba')+'</strong><p>'+esc(notes.join(' '))+'</p><p>'+(missing?'Prikazane serije obuhvaćaju poznate zapise. Nedostajući podaci nisu nula.':'Uračunat je samo potvrđeni odrađeni rad.')+'</p></div></aside>';
  }

  function groupMeter(group, max, forecast) {
    const actual = group.actual || {}, planned = group.planned || {};
    const fill = (type, amount) => amount > 0 ? '<i class="muscle-meter-'+type+'" style="width:'+amount/max*100+'%"></i>' : '';
    return '<span class="muscle-meter" aria-hidden="true">'+
      fill('direct',val(actual.direct))+fill('secondary',val(actual.indirect)*.5)+
      (forecast?fill('plan',val(planned.equivalent)):'')+'</span>';
  }

  function groupPicker(groups, selected, forecast, max, pinnedIds) {
    if (!groups.length) return '';
    const total = g => val((g.actual||{}).equivalent)+(forecast?val((g.planned||{}).equivalent):0);
    // vm.pinnedGroups (the football groups) stay on top in their own order.
    const pinned = list(pinnedIds).map(id=>groups.find(g=>g.id===id)).filter(Boolean);
    const ordered = pinned.concat(groups.filter(g=>!pinned.includes(g)).sort((a,b)=>total(b)-total(a)));
    const hasWork = ordered.some(g=>total(g)>0);
    const shown = hasWork ? pinned.concat(ordered.filter(g=>!pinned.includes(g) && total(g)>0).slice(0,pinned.length?3:5)) : [];
    const chosen = ordered.find(g=>g.id===selected);
    if (hasWork && chosen && !shown.includes(chosen)) {
      if (shown.length<(pinned.length?pinned.length+3:5)) shown.push(chosen); else shown[shown.length-1]=chosen;
    }
    const rest = ordered.filter(g=>!shown.includes(g));
    const row = g => {
      const actual=g.actual||{}, planned=g.planned||{};
      const future=forecast?val(planned.equivalent):0;
      const label=g.label+': '+fmt(actual.direct)+' izravnih serija, '+fmt(actual.indirect)+' neizravnih serija. Procijenjeni zbroj '+fmt(actual.equivalent)+(forecast?', preostali plan '+fmt(planned.equivalent):'');
      return '<button type="button" class="db-comparison-row" data-a="dashboardGroup" data-id="'+esc(g.id)+'" aria-pressed="'+(g.id===selected)+'" aria-label="'+esc(label)+'"><span class="db-comparison-name">'+esc(g.label)+'</span>'+groupMeter(g,max,forecast)+'<span class="db-comparison-value"><b>'+fmt(actual.equivalent)+'</b>'+(future?'<small>+'+fmt(future)+'</small>':'')+'</span></button>';
    };
    const legend='<div class="db-comparison-legend"><span><i class="db-swatch db-swatch-direct"></i>Izravne</span><span><i class="db-swatch db-swatch-indirect"></i>0,5 × neizravne</span>'+(forecast?'<span><i class="db-swatch db-swatch-plan"></i>Preostali plan</span>':'')+'</div>';
    return '<section class="db-comparison" aria-label="Usporedba mišićnih skupina"><div class="db-comparison-heading"><h3>Rad po skupinama</h3><span>procijenjene serije</span></div>'+legend+
      // the football groups under their own label, a divider, then the rest by work done
      (hasWork?'<div class="db-comparison-axis" aria-hidden="true"><span>0</span><span>'+fmt(max)+'</span></div>'+
        (pinned.length?'<p class="db-pinned-label">Za nogomet</p>'+pinned.map(row).join('')+(shown.length>pinned.length?'<hr class="db-pinned-divider">':''):'')+
        shown.filter(g=>!pinned.includes(g)).map(row).join(''):'<p class="db-empty-copy">U ovom prikazu još nema poznatih serija za usporedbu.</p>')+
      (rest.length?'<details class="db-groups"><summary>'+(hasWork?'Prikaži još '+rest.length+' '+plural(rest.length,'skupinu','skupine','skupina'):'Odaberi mišićnu skupinu')+'<span>'+groups.length+'</span></summary><div>'+rest.map(row).join('')+'</div></details>':'')+'</section>';
  }

  function sessionAction(s) {
    const a = s && s.action;
    return a && ['openPr','openField','openProg','historyOpen'].includes(a.name) && typeof a.id === 'string' ? ' data-a="'+a.name+'" data-id="'+esc(a.id)+'"' : '';
  }

  function contributions(vm, group) {
    const rows = [];
    list(vm.sessions).forEach(s => {
      const planned = s.status === 'planned';
      if (s.status !== 'done' && (!planned || !vm.forecast)) return;
      const items = list(s.contributions).filter(x => x.groupId === group.id && (val(x.direct) || val(x.indirect)));
      if (!items.length) return;
      const action = sessionAction(s), tag = action?'button':'div';
      rows.push('<li><'+tag+(action?' type="button"'+action:'')+' class="db-source-head"><span><b>'+esc(s.label)+'</b><small>'+esc(dateLabel(s.date,vm.today))+' · '+(planned?'Preostali plan':'Odrađeno')+'</small></span>'+(action?icon('arrow'):'')+'</'+tag+'><ul>'+items.map(x=>'<li><span>'+esc(x.name || 'Vježba')+'</span><small>'+fmt(x.direct)+' izravno · '+fmt(x.indirect)+' neizravno</small></li>').join('')+'</ul></li>');
    });
    return rows.length ? '<details class="db-sources"><summary>Odakle dolaze serije <span>'+rows.length+'</span></summary><ul>'+rows.join('')+'</ul></details>' : '';
  }

  function groupDetail(vm, group, max) {
    if (!group) return '<p class="db-empty-copy">Za ovaj pregled nema dostupnih skupina.</p>';
    const actual = group.actual || {}, planned = group.planned || {};
    return '<section class="db-group-detail" aria-labelledby="db-group-title"><div class="db-detail-heading"><div><p class="db-kicker">Odabrana skupina</p><h3 id="db-group-title">'+esc(group.label)+'</h3></div><div class="db-detail-total" aria-live="polite"><strong>'+fmt(actual.equivalent)+'</strong><small>procijenjenih serija</small></div></div>'+
      '<div class="db-detail-meter">'+groupMeter(group,max,vm.forecast)+'<p>Zajednička skala za ovaj tjedan · 0–'+fmt(max)+' serija</p></div>'+
      '<dl class="db-counts"><div><dt>Izravne serije</dt><dd>'+fmt(actual.direct)+'</dd></div><div><dt>Neizravne serije</dt><dd>'+fmt(actual.indirect)+'</dd></div><div><dt>Dani s radom</dt><dd>'+fmt(actual.days)+'</dd></div></dl>'+
      (vm.forecast && val(planned.equivalent)>0?'<p class="db-group-plan"><i class="db-swatch db-swatch-plan"></i><span>Preostali plan dodaje <b>+'+fmt(planned.equivalent)+'</b> procijenjenih serija <small>'+fmt(planned.direct)+' izravno · '+fmt(planned.indirect)+' neizravno</small></span></p>':'')+
      (!val(actual.equivalent)?'<p class="db-empty-copy">Za ovu skupinu nema poznatih radnih serija u odrađenim treninzima ovog tjedna.</p>':'')+
      contributions(vm,group)+'<p class="db-method">Procijenjeni zbroj: izravne + 0,5 × neizravne serije. Prikazuje količinu rada, a ne izmjeren rast mišića.</p></section>';
  }

  function weeklyActivity(vm) {
    const days = list(vm.days);
    if (!days.length) return '';
    const max = Math.max(1,...days.map(d=>val(d.done)+(vm.forecast?val(d.planned):0)));
    return '<section class="db-panel db-activity"><div class="db-section-head"><div><p class="db-kicker">Ritam tjedna</p><h2>Treninzi po danima</h2></div><span>broj sesija</span></div><div class="db-daily" role="group" aria-label="Odrađeni i preostali planirani treninzi po danima">'+days.map(d=>{
      const done=val(d.done), planned=vm.forecast?val(d.planned):0;
      const label=(d.label || dateLabel(d.date,vm.today))+': '+done+' odrađeno'+(vm.forecast?', '+planned+' u preostalom planu':'');
      return '<button type="button" data-a="dashboardCalendar" data-date="'+esc(d.date)+'"'+(d.isToday?' aria-current="date"':'')+' aria-label="'+esc(label)+'"><span class="db-day-value">'+fmt(done)+(planned?'<small>+'+fmt(planned)+'</small>':'')+'</span><span class="db-day-track"><i class="db-day-done" style="height:'+done/max*100+'%"></i>'+(planned?'<i class="db-day-plan" style="height:'+planned/max*100+'%;bottom:'+done/max*100+'%"></i>':'')+'</span><b>'+esc(d.label || '')+'</b></button>';
    }).join('')+'</div><p class="db-chart-note">'+(vm.forecast?'Puna boja: odrađeno. Šrafura: preostali plan od danas.':'Prikazani su samo odrađeni treninzi.')+'</p></section>';
  }

  function schedule(vm) {
    const rows = list(vm.sessions).filter(s => s.status === 'done' || (vm.forecast && s.status === 'planned'));
    return '<section class="db-panel db-schedule"><div class="db-section-head"><div><p class="db-kicker">Iz dnevnika i kalendara</p><h2>Treninzi ovog tjedna</h2></div></div>'+
      (rows.length?'<ul>'+rows.map(s=>{
        const action=sessionAction(s), tag=action?'button':'div', planned=s.status==='planned';
        return '<li><'+tag+' class="db-session"'+(action?' type="button"'+action:'')+'><span class="db-session-icon'+(planned?' is-plan':'')+'">'+icon(planned?'calendar':'check')+'</span><span class="db-session-text"><b>'+esc(s.label)+'</b><small>'+esc(dateLabel(s.date,vm.today))+(s.kind==='field'?' · Kondicija na terenu':'')+'</small><span class="db-session-state">'+(planned?'U preostalom planu':'Odrađeno')+'</span></span>'+(action?icon('arrow'):'')+'</'+tag+'></li>';
      }).join('')+'</ul>':'<p class="db-empty-copy">Još nema odrađenih treninga ovog tjedna.'+(vm.forecast?' U preostalom rasporedu nema treninga.':' Uključi plan za pregled budućih termina.')+'</p><button type="button" class="db-primary" data-a="dashboardProtocols">'+icon('plus')+'Otvori Moje treninge</button>')+'</section>';
  }

  function analytics(input) {
    const vm=input || {loading:true};
    if (vm.loading || vm.error) return stateView(vm,true);
    const groups=list(vm.groups), range=vm.range || {}, coverage=vm.coverage || {};
    const work=g=>val((g.actual||{}).equivalent)>0, pinnedFirst=list(vm.pinnedGroups).map(id=>groups.find(g=>g.id===id)).filter(Boolean);
    // with no choice yet the first football group with work is open (Aduktori), not the largest upper-body group
    const group=groups.find(g=>g.id===vm.selectedGroup) || pinnedFirst.find(work) || groups.find(work) || groups[0];
    const selected=group && group.id;
    const hasKnownWork=groups.some(g=>val((g.actual||{}).equivalent)>0);
    const peak = Math.max(1,...groups.map(g=>val((g.actual||{}).equivalent)+(vm.forecast?val((g.planned||{}).equivalent):0)));
    const max = Math.ceil(peak/4)*4;
    return '<div class="view dashboard db-analytics"><header class="db-heading db-analytics-heading"><div><button type="button" class="db-back" data-a="back" aria-label="Natrag">'+icon('arrow')+'</button><div><h1>Analiza tjedna</h1><p class="db-period">'+esc(range.label || '')+'</p></div><details class="db-info"><summary aria-label="Kako čitati analizu tjedna">'+icon('info')+'</summary><div><strong>Rad iz dnevnika</strong><p>Odrađeno dolazi iz spremljenih treninga. Preostali plan prikazan je zasebno. Procijenjene serije opisuju količinu rada, a ne rast mišića.</p></div></details></div></header>'+
      '<section class="db-panel db-muscle" aria-labelledby="db-muscle-title"><div class="db-section-head"><div><p class="db-kicker">Zabilježeni podražaj</p><h2 id="db-muscle-title">Mišićni tjedan</h2></div></div><div class="db-anatomy-row"><div class="db-anatomy">'+bodyFigure(groups,selected,!!vm.forecast)+'</div>'+coverageRing(coverage,!!vm.forecast)+'</div>'+
      '<p class="db-map-hint">Dodirni figuru ili odaberi skupinu iz usporedbe.</p><div class="db-legend"><span><i class="db-swatch db-swatch-selected"></i>Odabrano</span><span><i class="db-swatch db-swatch-direct"></i>Izravni rad</span><span><i class="db-swatch db-swatch-indirect"></i>Neizravni rad</span>'+(vm.forecast?'<span><i class="db-swatch db-swatch-plan"></i>Samo u planu</span>':'')+'<span><i class="db-swatch db-swatch-empty"></i>Bez zapisa</span></div>'+
      '<button type="button" class="db-forecast" role="switch" aria-checked="'+!!vm.forecast+'" data-a="dashboardForecast"><span><b>Uključi preostali plan</b><small>Od danas do nedjelje · bez promjene dnevnika</small></span><i aria-hidden="true"></i></button>'+
      (!hasKnownWork?'<p class="db-empty-copy db-first-step">'+(val((vm.quality||{}).missingSessions)?'Za dio odrađenih treninga nema spremljene raspodjele po mišićima.':list(vm.sessions).some(s=>s.status==='done')?'Trening je zabilježen. Ovaj tjedan još nema zabilježenih serija snage po mišićima.':'Ovdje ćeš nakon prvog treninga snage vidjeti koje si mišiće radio.')+'</p>':'')+
      groupDetail(vm,group,max)+groupPicker(groups,selected,!!vm.forecast,max,vm.pinnedGroups)+'</section>'+qualityNotes(vm.quality||{},!!vm.forecast)+weeklyActivity(vm)+schedule(vm)+'<p class="db-bottom-note">Plan je projekcija. U odrađeni tjedan ulaze samo spremljene izvedbe.</p></div>';
  }

  function upcoming(vm) {
    const next = list(vm.sessions).filter(s => s.status === 'planned' && /^\d{4}-\d{2}-\d{2}$/.test(s.date || '') && (!vm.today || s.date >= vm.today))
      .slice().sort((a,b) => a.date.localeCompare(b.date))[0];
    if (!next) return '<button type="button" class="db-next db-next-empty" data-a="dashboardCalendar"><span class="db-next-icon">'+icon('plus')+'</span><span class="db-next-text"><small>Sljedeći trening</small><strong>Dodaj u kalendar</strong></span>'+icon('arrow')+'</button>';
    const action = sessionAction(next) || ' data-a="dashboardCalendar"';
    return '<button type="button" class="db-next"'+action+'><span class="db-next-icon">'+icon(next.kind === 'field'?'calendar':'protocol')+'</span><span class="db-next-text"><small>'+esc(dateLabel(next.date,vm.today))+(next.kind==='field'?' · Na terenu':'')+'</small><strong>'+esc(next.label || 'Planirani trening')+'</strong></span>'+icon('arrow')+'</button>';
  }

  function render(input) {
    const vm=input || {loading:true};
    if (vm.loading || vm.error) return stateView(vm,false);
    const summary=vm.summary || {}, range=vm.range || {};
    const today = vm.daily && root.TodayView && typeof root.TodayView.card === 'function' ? root.TodayView.card(vm.daily) :
      '<button type="button" class="db-today-fallback" data-a="todayOpen"><span><small>Danas</small><strong>Otvori dnevni pregled</strong></span>'+icon('arrow')+'</button>';
    return '<div class="view dashboard db-home"><header class="db-heading"><p class="db-kicker">Tvoj dan</p><h1>Moj pregled</h1>'+(range.label?'<p class="db-period">'+esc(range.label)+'</p>':'')+'</header>'+today+
      '<section class="db-overview" aria-label="Izvedba plana"><div><small>Ovaj tjedan</small><strong>'+fmt(summary.done)+'<span> / '+fmt(summary.planned)+'</span></strong><p>'+(val(summary.planned)?'termina iz plana odrađeno':'Nema tjednog plana')+'</p></div><div><small>Danas</small><strong>'+fmt(summary.todayDone)+'<span> / '+fmt(summary.todayPlanned)+'</span></strong><p>'+(val(summary.todayPlanned)?'termina iz plana odrađeno':'Nema današnjeg plana')+'</p></div></section>'+
      upcoming(vm)+quickLinks()+'<nav class="db-detail-links" aria-label="Detaljniji pregledi"><button type="button" data-a="dashboardProgress"><span class="db-detail-icon">'+icon('chart')+'</span><span><strong>Napredak</strong><small>Trendovi i opterećenje</small></span>'+icon('arrow')+'</button><button type="button" data-a="dashboardAnalytics"><span class="db-detail-icon">'+icon('protocol')+'</span><span><strong>Analiza tjedna</strong><small>Rad po mišićima</small></span>'+icon('arrow')+'</button></nav></div>';
  }

  const api={render,analytics};
  root.TrainingDashboard=api;
  if (typeof module!=='undefined' && module.exports) module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
