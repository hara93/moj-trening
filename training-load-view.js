/* Read-only presentation of three independent indicators. All styles and DOM
   hooks are local to this screen; no home layout or saved totals are changed. */
(function(root,factory){
  'use strict';
  var api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.TrainingLoadView=api;
})(typeof window!=='undefined'?window:null,function(){
  'use strict';
  var finite=function(n){return typeof n==='number'&&Number.isFinite(n);};
  var esc=function(value){return String(value==null?'':value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
  var number=function(value,digits){return finite(value)?value.toLocaleString('hr-HR',{maximumFractionDigits:digits==null?2:digits}):'—';};
  var value=function(value){return finite(value)?String(value):'';};
  function date(at){return finite(at)?new Date(at).toLocaleDateString('hr-HR',{day:'numeric',month:'numeric'}):'—';}
  var focusBeforeInfo=null;
  var topics={
    effort:{title:'Napor treninga',paragraphs:['AU su tvoja ocjena cijelog treninga (sRPE, 0–10) × stvarne minute. To je zabilježeni osjećaj napora, a ne izmjeren umor ili postotak oporavka.','Nula je unesena ocjena. Prazna ocjena ili nepoznato trajanje ostaju nepoznati; poznati dio zbroja prikazuje se odvojeno. Linija povezuje samo susjedne dane s poznatim AU.','Usporedba je prosjek zabilježenog napora prethodnih 28 dana podijeljen s četiri.']},
    muscles:{title:'Mišićne serije',paragraphs:['Glavni mišić dobiva 1, a pomoćni 0,5 po stvarno odrađenoj radnoj seriji. Kilogrami i RIR ne ponderiraju te vrijednosti.','Jedna serija može pripasti više mišićnih skupina. Brojevi po mišićima zato nisu ukupan broj serija treninga i ne mjere rast mišića ili oporavak.']},
    readiness:{title:'Tvoji jutarnji odgovori',paragraphs:['Energija i osjećaj u nogama zabilježeni su na skali 1–5, a bol na skali 0–10. Prikazuje se samo današnji unos.','To su tri odvojena odgovora. Ne pretvaraju se u zajednički postotak spremnosti; nedostajući odgovor nije nula.']}
  };
  function info(topic,label){return '<button type="button" class="tl-info" data-a="trainingLoadInfo" data-topic="'+topic+'" aria-label="'+esc(label)+'" aria-haspopup="dialog"><span aria-hidden="true">i</span></button>';}
  function title(index,eyebrow,heading,tag){var topic=index==='01'?'effort':index==='02'?'muscles':'readiness';return '<div class="tl-card-head"><span class="tl-index" aria-hidden="true">'+index+'</span><div><p class="tl-eyebrow">'+eyebrow+'</p><h2>'+heading+'</h2></div><span class="tl-tag">'+tag+'</span>'+info(topic,'Kako čitati: '+heading)+'</div>';}

  function chart(days){
    var max=Math.max.apply(null,[1].concat(days.map(function(day){return finite(day.knownAU)?day.knownAU:0;})));
    var step=284/Math.max(1,days.length),x=function(i){return 26+step*(i+.5);},y=function(v){return 112-v/max*78;};
    var line='',previousKnown=false;
    days.forEach(function(day,i){var known=day.rated>0&&finite(day.knownAU);if(known)line+=(previousKnown?'L':'M')+x(i).toFixed(2)+' '+y(day.knownAU).toFixed(2)+' ';previousKnown=known;});
    var label='Poznati napor po danima. '+days.map(function(day){return date(day.from)+': '+(day.sessions?day.rated?number(day.knownAU)+' AU poznato':'napor nije poznat':'nema zapisa')+(day.missingAU?', nepotpun zapis':'');}).join('; ');
    return '<div class="tl-chart-wrap"><svg class="tl-days" viewBox="0 0 320 145" role="img" aria-label="'+esc(label)+'"><path class="tl-grid" d="M26 34H310M26 73H310M26 112H310"/><text class="tl-axis" x="1" y="16">AU</text><text class="tl-axis" x="18" y="37" text-anchor="end">'+number(max,0)+'</text><text class="tl-axis" x="18" y="115" text-anchor="end">0</text>'+days.map(function(day,i){
      var known=day.rated>0&&finite(day.knownAU),height=known&&day.knownAU>0?day.knownAU/max*78:0,cx=x(i),top=y(day.knownAU||0);
      var display=day.missingAU?(day.rated?number(day.knownAU,0)+'*':'?'):day.sessions?number(day.knownAU,0):'·';
      return '<g class="tl-day" data-load-day="'+esc(day.date)+'" data-total-au="'+value(day.totalAU)+'" data-known-au="'+value(day.knownAU)+'"'+(i===days.length-1?' aria-current="date"':'')+'><title>'+esc(date(day.from)+': '+(known?number(day.knownAU)+' AU'+(day.missingAU?' poznato, nepotpun zapis':''):day.sessions?'napor nije poznat':'nema zapisa'))+'</title>'+
        (i===days.length-1?'<rect class="tl-day-selected" x="'+(cx-15)+'" y="26" width="30" height="94" rx="9"/>':'')+'<rect class="tl-day-track" x="'+(cx-9)+'" y="34" width="18" height="78" rx="5"/>'+
        (height?'<rect class="tl-day-fill" x="'+(cx-9)+'" y="'+top+'" width="18" height="'+height+'" rx="4"/>':'')+'<text class="tl-day-value" x="'+cx+'" y="19" text-anchor="middle">'+display+'</text><text class="tl-day-date" x="'+cx+'" y="137" text-anchor="middle">'+esc(date(day.from))+'</text></g>';
    }).join('')+'<path class="tl-day-line" d="'+line+'"/>'+days.map(function(day,i){return day.rated>0&&finite(day.knownAU)?'<circle class="tl-day-dot'+(day.missingAU?' tl-day-partial':'')+'" cx="'+x(i)+'" cy="'+y(day.knownAU)+'" r="3.3"/>':'';}).join('')+'</svg><div class="tl-day-controls">'+days.map(function(day){return '<button type="button" data-a="trainingLoadDetail" data-topic="day" data-date="'+esc(day.date)+'" aria-label="'+esc(date(day.from)+': '+(day.sessions?day.rated?number(day.knownAU)+' AU poznato':'napor nije poznat':'nema zapisa')+'. Prikaži detalje')+'"><span>'+esc(date(day.from))+'</span></button>';}).join('')+'</div></div>'+(days.some(function(day){return day.missingAU;})?'<p class="tl-chart-note">* Poznati dio napora · ? nedostaju podaci</p>':'');
  }
  var effortKinds=['protocol','field','team','match','legacy'];
  function effortDial(buckets,total){
    var tickCount=28,radius=50,circumference=2*Math.PI*radius;
    var step=circumference/tickCount,tick=step*.79;
    var geometry=' cx="64" cy="64" r="'+radius+'"';
    var ticks=geometry+' stroke-dasharray="'+tick+' '+(step-tick)+'"';
    var filled=0,offset=0;
    var segments=buckets.filter(function(bucket){return bucket.knownAU>0;}).map(function(bucket){
      filled+=bucket.knownAU/total*tickCount;
      // Measure the category in painted ticks, leaving the gaps out of its share.
      var whole=Math.floor(filled),end=whole*step+(filled-whole)*tick;
      var segment='<circle class="tl-dial-segment" data-load-ring-kind="'+bucket.kind+'"'+geometry+' stroke-dasharray="'+(end-offset)+' '+circumference+'" stroke-dashoffset="'+(-offset)+'"/>';
      offset=end;
      return segment;
    }).join('');
    return '<svg class="tl-dial-art" viewBox="0 0 128 128" aria-hidden="true"><defs>'+
      '<mask id="tl-dial-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="128" height="128"><circle class="tl-dial-mask"'+ticks+' transform="rotate(-90 64 64)"/></mask>'+
      '<radialGradient id="tl-dial-shade" class="tl-dial-shade"><stop offset=".61" stop-opacity=".96"/><stop offset=".80" stop-opacity=".78"/><stop offset=".92" stop-opacity="0"/></radialGradient></defs>'+
      '<circle class="tl-dial-track"'+ticks+' transform="rotate(-90 64 64)"/>'+
      '<g mask="url(#tl-dial-mask)"><g transform="rotate(-90 64 64)">'+segments+'</g></g>'+
      '<circle cx="64" cy="64" r="60" fill="url(#tl-dial-shade)"/></svg>';
  }
  function effortDistribution(current){
    var buckets=effortKinds.map(function(kind){return current.byKind.find(function(bucket){return bucket.kind===kind;});}).filter(Boolean);
    var partial=current.missingAU>0&&current.rated>0;
    var display=number(partial?current.knownAU:current.totalAU,1);
    var label=partial?'AU poznato':current.totalAU===null?'AU':'AU ukupno';
    var accessibleName=current.rated?'Napor treninga · '+display+' '+label:'Napor treninga još nije poznat';
    var legend=buckets.map(function(bucket){
      var hasValue=bucket.rated>0;
      return '<div class="tl-kind-row'+(bucket.knownAU>0?'':' tl-kind-muted')+'" data-load-ring-kind="'+bucket.kind+'"><dt><i aria-hidden="true"></i>'+esc(bucket.label)+'</dt><dd>'+(hasValue?number(bucket.knownAU,1)+' <small>AU</small>':'<small>Nepoznato</small>')+'</dd></div>';
    }).join('');
    return '<div class="tl-distribution"><button type="button" class="tl-effort-total tl-effort-dial" data-a="trainingLoadInfo" data-topic="effort" aria-haspopup="dialog" aria-label="'+esc(accessibleName+'. Otvori objašnjenje')+'" style="--tl-dial-glyphs:'+Math.max(4,display.length)+'">'+
      effortDial(buckets,current.knownAU)+
      '<span class="tl-dial-readout"><strong'+(partial?'':' data-load-metric="current-au"')+'>'+display+'</strong><small>'+label+'</small></span></button>'+
      '<div class="tl-distribution-breakdown"><p>Po vrsti aktivnosti</p>'+(legend?'<dl>'+legend+'</dl>':'<span class="tl-distribution-empty">Raspodjela će se prikazati nakon prvog spremljenog treninga.</span>')+'</div></div>';
  }
  function effort(summary,overview){
    var current=summary.effort.current,baseline=summary.effort.baseline;
    var missing=current.missingAU>0;
    var minutes=current.missingDuration===current.sessions&&current.sessions>0?'trajanje nije poznato':number(current.knownMinutes,1)+' poznatih min'+(current.missingDuration?' · '+current.missingDuration+' bez trajanja':'');
    var missingDetail='<span>Poznati zbroj napora još nije dostupan.</span>';
    if(current.rated)missingDetail=overview?'<span>Ukupno <strong data-load-metric="current-au">—</strong> AU</span>':'<strong><span data-load-metric="known-au">'+number(current.knownAU,1)+'</span> AU poznato iz '+current.rated+' zapisa</strong>';
    return '<section class="tl-card tl-effort" data-load-section="effort" data-load-period="current" data-total-au="'+value(current.totalAU)+'" data-known-au="'+value(current.knownAU)+'" data-missing-au="'+current.missingAU+'" data-sessions="'+current.sessions+'">'+
      title('01','Tvoj osjećaj × vrijeme','Napor treninga','Zabilježeno')+
      (overview?effortDistribution(current):'<button type="button" class="tl-effort-total" data-a="trainingLoadInfo" data-topic="effort" aria-haspopup="dialog"><strong data-load-metric="current-au">'+number(current.totalAU,1)+'</strong><span>AU · zadnjih 7 dana</span><i aria-hidden="true">↗</i></button>')+
      '<p class="tl-lead">'+(current.sessions?number(current.sessions)+' spremljenih treninga · '+minutes:'Još nema spremljenih treninga u ovom razdoblju.')+'</p>'+
      (missing?'<div class="tl-missing"><b>Zbroj nije potpun</b><span>Za '+current.missingAU+' '+(current.missingAU===1?'trening nedostaje':'treninga nedostaje')+' ocjena napora ili trajanje.</span>'+
        missingDetail+'</div>':'')+
      chart(summary.effort.days)+
      '<div class="tl-reference" data-load-period="baseline" data-total-au="'+value(baseline.totalAU)+'" data-known-au="'+value(baseline.knownAU)+'" data-weekly-average-au="'+value(baseline.weeklyAverageAU)+'" data-sessions="'+baseline.sessions+'" data-active-weeks="'+baseline.activeWeeks+'"><div><span>Prethodna 4 tjedna</span><strong>'+number(baseline.weeklyAverageAU,1)+' <small>AU / tjedan</small></strong></div><p>'+baseline.sessions+' zapisa u '+baseline.activeWeeks+' od 4 tjedna'+(baseline.missingAU?' · napor nije poznat za '+baseline.missingAU+' zapisa':baseline.sessions?' · prosjek zabilježenog napora':' · nema usporednog razdoblja')+'</p></div>'+
      '<details class="tl-details"><summary>Brojke i izvori napora</summary><p>AU su jedinice napora: tvoja ocjena cijelog treninga (sRPE, 0–10) × stvarne minute (sekunde ÷ 60). Nula je unesena ocjena; prazno ostaje nepoznato. Protokoli, teren, ekipa i utakmice ulaze u ovaj pokazatelj. Pokusi iz knjižnice i budući zapisi ne ulaze.</p><div class="tl-table-wrap"><table><caption>Zadnjih 7 dana, samo spremljeni zapisi</caption><thead><tr><th scope="col">Datum</th><th scope="col">Treninzi</th><th scope="col">Napor AU</th></tr></thead><tbody>'+summary.effort.days.slice().reverse().map(function(day){return '<tr><th scope="row">'+esc(date(day.from))+'</th><td>'+day.sessions+'</td><td>'+(day.sessions?day.totalAU!==null?number(day.totalAU):day.rated?number(day.knownAU)+' poznato':'—':'Nema zapisa')+(day.missingAU?' · '+day.missingAU+' nepoznato':'')+'</td></tr>';}).join('')+'</tbody></table></div><p>Referentni prosjek dijeli zabilježeni napor prethodnih 28 dana s četiri. Ne ocjenjuje je li trening za tebe optimalan.</p><button type="button" class="tl-link" data-a="historyList">Otvori povijest treninga <span aria-hidden="true">↗</span></button></details></section>';
  }
  function muscleMeter(group,max){
    const direct = group.direct/max*100, secondary = group.secondary*.5/max*100;
    return '<span class="muscle-meter" aria-hidden="true">'+
      (direct>0?'<i class="muscle-meter-direct" style="width:'+direct+'%"></i>':'')+
      (secondary>0?'<i class="muscle-meter-secondary" style="width:'+secondary+'%"></i>':'')+'</span>';
  }
  function muscleRow(group,max){
    return '<div class="tl-muscle-row" data-load-group="'+esc(group.id)+'" data-direct="'+value(group.direct)+'" data-secondary="'+value(group.secondary)+'" data-equivalent="'+value(group.equivalent)+'"><div><span>'+esc(group.label)+'</span><b>'+number(group.equivalent,1)+'</b></div>'+muscleMeter(group,max)+'<small>'+number(group.direct,0)+' izravnih · '+number(group.secondary,0)+' pomoćnih serija</small></div>';
  }
  function muscles(summary){
    var model=summary.muscles,coverage=model.coverage,known=model.recordedSets>0||coverage.coveredSessions>0;
    var groups=model.groups.slice().sort(function(a,b){return b.equivalent-a.equivalent||a.label.localeCompare(b.label,'hr');}),top=groups.filter(function(group){return group.equivalent>0;}).slice(0,5);
    const max = Math.ceil(Math.max(1,...top.map(group=>group.equivalent))/4)*4;
    var missing=coverage.missingSessions+coverage.invalidSessions+coverage.unassignedSessions;
    return '<section class="tl-card tl-muscles" data-load-section="muscles">'+title('02','Rad po mišićima','Mišićne serije','Odrađeno')+
      '<div class="tl-muscle-overview"><button type="button" data-a="trainingLoadInfo" data-topic="muscles" aria-haspopup="dialog"><strong data-load-metric="muscle-sets">'+(known?number(model.recordedSets,0):'—')+'</strong><span>poznatih radnih serija</span></button><button type="button" data-a="trainingLoadInfo" data-topic="muscles" aria-haspopup="dialog"><strong>'+number(model.coveredGroups,0)+'</strong><span>skupina sa zabilježenim radom</span></button></div>'+
      (missing?'<p class="tl-note">Dio mišićne raspodjele nije poznat. Prikazan je samo sačuvani rad.</p>':'')+
      (top.length?'<p class="tl-muscle-scale">Zajednička skala za 7 dana · 0–'+number(max,0)+' serija</p><div class="tl-muscle-chart">'+top.map(function(group){return muscleRow(group,max);}).join('')+'</div>':'<p class="tl-empty">Još nema raspodjele radnih serija u ovom razdoblju. Ekipni trening i utakmica ne stvaraju pretpostavljene mišićne serije.</p>')+
      '<div class="tl-legend"><span><i class="muscle-meter-direct"></i>Izravne × 1</span><span><i class="muscle-meter-secondary"></i>Pomoćne × 0,5</span></div>'+
      '<details class="tl-details"><summary>Sve mišićne skupine i pravilo</summary><p>Jedna odrađena serija pripisuje se glavnim mišićima kao 1, pomoćnima kao 0,5. To je model pripisivanja rada: kilogrami i RIR ne ponderiraju ove serije. Broj ne mjeri rast mišića, točan podražaj ili oporavak.</p><div class="tl-table-wrap"><table><caption>Poznati dio raspodjele radnih serija</caption><thead><tr><th scope="col">Skupina</th><th scope="col">Izravne</th><th scope="col">Pomoćne</th><th scope="col">Procjena</th></tr></thead><tbody>'+groups.map(function(group){return '<tr><th scope="row">'+esc(group.label)+'</th><td>'+(known?number(group.direct,0):'—')+'</td><td>'+(known?number(group.secondary,0):'—')+'</td><td>'+(known?number(group.equivalent,1)+muscleMeter(group,max):'—')+'</td></tr>';}).join('')+'</tbody></table></div><p>Pojedina radna serija može biti pripisana više skupina. Zato se vrijednosti po mišićima ne zbrajaju kao broj serija treninga. Zagrijavanja se izostavljaju; planirani termini nisu odrađeni rad.</p></details></section>';
  }
  function readiness(summary,morning){
    var current=morning&&morning.date===summary.today?morning:{},specs=[['energy','Energija',1,5],['legs','Noge',1,5],['pain','Bol',0,10]];
    var names={energy:['Vrlo malo','Malo','Uobičajeno','Dosta','Puno'],legs:['Vrlo lagane','Lagane','Uobičajene','Teške','Vrlo teške']},known=0;
    var fields=specs.map(function(spec){var key=spec[0],n=current[key],valid=Number.isInteger(n)&&n>=spec[2]&&n<=spec[3];if(valid)known++;return '<button type="button" data-a="morningOpen" data-load-readiness="'+key+'" data-value="'+(valid?n:'')+'"><span>'+spec[1]+'</span><strong>'+ (valid?n:'—')+(valid?'<small> / '+spec[3]+'</small>':'')+'</strong><small>'+(valid?key==='pain'?(n===0?'Bez boli':'Tvoja prijavljena bol'):names[key][n-1]:'Nije uneseno')+'</small></button>';}).join('');
    return '<section class="tl-card tl-readiness" data-load-section="readiness" data-date="'+esc(summary.today)+'">'+title('03','Kako si danas','Jutarnje stanje',known===3?'Uneseno':'Nepotpuno')+
      '<div class="tl-readiness-grid">'+fields+'</div><details class="tl-details"><summary>Kako čitati ove odgovore</summary><p class="tl-note">'+(known?'Ovo su tvoji današnji odgovori, ne ukupna ocjena spremnosti.':'Za danas nema jutarnjih podataka. Spremnost se ne zaključuje iz količine rada.')+'</p></details><button type="button" class="tl-button" data-a="morningOpen">'+(known?'Dopuni jutarnju provjeru':'Unesi jutarnju provjeru')+'<span aria-hidden="true">↗</span></button></section>';
  }
  function renderLegacy(vm){
    vm=vm||{};var summary=vm.summary;
    var head='<header class="tl-heading"><button type="button" data-a="back" aria-label="Natrag">‹</button><div><p class="tl-eyebrow">Tvoj trening, jasniji podaci</p><h1>Opterećenje</h1></div></header>';
    if(!summary||summary.status!=='ready')return '<div class="view training-load">'+head+'<p class="tl-empty">Podaci za prikaz još nisu dostupni.</p></div>';
    return '<div class="view training-load">'+head+'<div class="tl-intro"><span class="tl-live-dot" aria-hidden="true"></span><p>'+esc(date(summary.range.from))+' – '+esc(date(summary.range.to-1))+' · zadnjih 7 dana</p><span>Samo zabilježeno</span></div>'+
      effort(summary)+muscles(summary)+readiness(summary,vm.morning)+
      '<details class="tl-model-note"><summary>A što znače stari LM1 bodovi?</summary><p>LM1 je zaseban model s unaprijed zadanim faktorima. Nema osobnu kalibraciju i ne koristi unesene kilograme. Njegovi bodovi nisu ovdje prikazani kao stvarni napor, točan umor ili oporavak.</p><p>Ni mišićne serije ni sRPE × trajanje sami ne određuju što moraš trenirati sutra. Jutarnji odgovori ostaju odvojeni.</p></details>'+dialog()+'</div>';
  }
  var lastVM={};
  function modeTabs(){return '<nav class="tl-mode-tabs" aria-label="Prikaz analize"><button type="button" data-a="analyticsMode" data-v="progress" aria-pressed="false">Napredak</button><button type="button" data-a="analyticsMode" data-v="load" aria-pressed="true">Opterećenje</button></nav>';}
  function drill(topic,title,subtitle,action){return '<button type="button" class="tl-drill-row" '+(action || 'data-a="trainingLoadDetail" data-topic="'+topic+'"')+'><span><strong>'+esc(title)+'</strong>'+(subtitle?'<small>'+esc(subtitle)+'</small>':'')+'</span><span aria-hidden="true">›</span></button>';}
  function checkin(vm){
    var summary=vm.summary,current=vm.morning&&vm.morning.date===summary.today?vm.morning:{},fields=[['energy','Energija',1,5],['legs','Noge',1,5],['pain','Bol',0,10]];
    return '<button type="button" class="tl-checkin" data-a="trainingLoadDetail" data-topic="readiness" data-load-section="readiness" data-date="'+esc(summary.today)+'"><span class="tl-checkin-title">Jutarnja provjera <i aria-hidden="true">›</i></span><span class="tl-checkin-values">'+fields.map(function(spec){var n=current[spec[0]],valid=Number.isInteger(n)&&n>=spec[2]&&n<=spec[3];return '<span data-load-readiness="'+spec[0]+'" data-value="'+(valid?n:'')+'">'+spec[1]+' <b>'+(valid?n+'/'+spec[3]:'—')+'</b></span>';}).join('')+'</span></button>';
  }
  function render(vm){
    vm=vm||{};lastVM=vm;var summary=vm.summary;
    if(!summary||summary.status!=='ready')return renderLegacy(vm);
    var model=summary.muscles,known=model.recordedSets>0||model.coverage.coveredSessions>0;
    return '<div class="view training-load tl-cinema"><header class="tl-heading"><button type="button" data-a="back" aria-label="Natrag">‹</button><div><p class="tl-eyebrow">Zadnjih 7 dana</p><h1>Opterećenje</h1></div>'+info('effort','Kako računamo opterećenje')+'</header>'+modeTabs()+'<div class="tl-intro"><p>'+esc(date(summary.range.from))+' – '+esc(date(summary.range.to-1))+'</p><span>Samo zabilježeno</span></div>'+
      effort(summary,true)+checkin(vm)+'<nav class="tl-drill-list" aria-label="Detalji opterećenja">'+drill('muscles','Rad po mišićima',known?number(model.recordedSets,0)+' radnih serija · '+number(model.coveredGroups,0)+' skupina':'Raspodjela još nije poznata')+drill('effort','Treninzi i utakmice','Brojke i izvori napora')+drill('','Povijest treninga','Pregledaj i uredi zapise','data-a="historyList"')+'</nav><button type="button" class="tl-model-link" data-a="trainingLoadDetail" data-topic="model">Model i pretpostavke <span aria-hidden="true">›</span></button><template id="training-load-detail-cache">'+renderLegacy(vm)+'</template>'+dialog()+'</div>';
  }
  function showDetail(topic,trigger,data){
    var el=document.getElementById('training-load-info'),cache=document.getElementById('training-load-detail-cache');if(!el||!cache)return;
    var title='Detalji opterećenja',body='',summary=lastVM.summary,source;
    if(topic==='day'){
      var day=summary.effort.days.find(function(day){return day.date===(data||{}).date;});
      if(day){title=date(day.from)+' · dnevni napor';body='<div class="tl-day-detail" data-load-day-detail="'+esc(day.date)+'"><span>Zabilježeni napor</span><strong>'+number(day.totalAU,1)+' <small>AU</small></strong>'+(day.missingAU?'<p>Zbroj nije potpun. '+(day.rated?number(day.knownAU)+' AU poznato':'Napor još nije poznat')+'.</p>':'')+'<dl><div><dt>Spremljeni treninzi</dt><dd>'+number(day.sessions,0)+'</dd></div><div><dt>Poznate minute</dt><dd>'+(day.sessions&&day.missingDuration>=day.sessions?'—':number(day.knownMinutes,1))+'</dd></div></dl></div>';
        if(!day.sessions)body+='<p>Nema zabilježenog treninga za ovaj dan.</p>';
        else body+='<div class="tl-session-kinds">'+day.byKind.map(function(kind){return '<div><strong>'+esc(kind.label)+'</strong><span>'+number(kind.sessions,0)+' zapisa · '+(kind.totalAU===null?kind.rated?number(kind.knownAU)+' AU poznato':'napor nije poznat':number(kind.totalAU)+' AU')+'</span></div>';}).join('')+'</div>';
        body+='<button type="button" class="tl-link" data-a="historyList">Otvori povijest treninga <span aria-hidden="true">↗</span></button>';
      }else body='<p>Podaci za odabrani dan nisu dostupni.</p>';
    }else{
      var names={effort:'Treninzi i napor',muscles:'Rad po mišićima',readiness:'Jutarnja provjera',model:'Model i pretpostavke'};title=names[topic]||title;
      source=topic==='model'?cache.content.querySelector('.tl-model-note'):cache.content.querySelector('[data-load-section="'+({'effort':'effort','muscles':'muscles','readiness':'readiness'}[topic]||'effort')+'"]');
      body=source?source.outerHTML:'<p>Za ovaj prikaz još nema podataka.</p>';
    }
    if(!el.open || !el.contains(trigger))focusBeforeInfo=trigger&&typeof trigger.focus==='function'?trigger:document.activeElement;
    el.querySelector('#training-load-info-title').textContent=title;el.querySelector('#training-load-info-body').innerHTML=body;
    if(topic==='effort'||topic==='model'){var detail=el.querySelector('details');if(detail)detail.open=true;}
    el.onclick=function(e){if(e.target===el)closeInfo();};el.oncancel=function(e){e.preventDefault();closeInfo();};el.onclose=function(){if(focusBeforeInfo&&focusBeforeInfo.isConnected)focusBeforeInfo.focus();};if(typeof el.showModal==='function')el.showModal();else el.setAttribute('open','');el.querySelector('button').focus();
  }
  function dialog(){return '<dialog id="training-load-info" class="tl-dialog" aria-labelledby="training-load-info-title"><div class="tl-dialog-head"><h2 id="training-load-info-title"></h2><button type="button" data-a="trainingLoadInfoClose" aria-label="Zatvori objašnjenje">×</button></div><div id="training-load-info-body"></div><button type="button" class="tl-dialog-done" data-a="trainingLoadInfoClose">Jasno</button></dialog>';}
  function closeInfo(){var el=document.getElementById('training-load-info');if(!el)return;if(typeof el.close==='function')el.close();else el.removeAttribute('open');if(focusBeforeInfo&&focusBeforeInfo.isConnected)focusBeforeInfo.focus();}
  function showInfo(topic,trigger){var el=document.getElementById('training-load-info'),content=topics[topic]||topics.effort;if(!el)return;if(!el.open || !el.contains(trigger))focusBeforeInfo=trigger&&typeof trigger.focus==='function'?trigger:document.activeElement;el.querySelector('#training-load-info-title').textContent=content.title;el.querySelector('#training-load-info-body').innerHTML=content.paragraphs.map(function(p){return '<p>'+esc(p)+'</p>';}).join('');el.onclick=function(e){if(e.target===el)closeInfo();};el.oncancel=function(e){e.preventDefault();closeInfo();};el.onclose=function(){if(focusBeforeInfo&&focusBeforeInfo.isConnected)focusBeforeInfo.focus();};if(typeof el.showModal==='function')el.showModal();else el.setAttribute('open','');el.querySelector('button').focus();}
  return Object.freeze({render:render,showInfo:showInfo,showDetail:showDetail,closeInfo:closeInfo});
});
