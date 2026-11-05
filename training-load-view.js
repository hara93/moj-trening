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
  function title(index,eyebrow,heading,tag){return '<div class="tl-card-head"><span class="tl-index">'+index+'</span><div><p class="tl-eyebrow">'+eyebrow+'</p><h2>'+heading+'</h2></div><span class="tl-tag">'+tag+'</span></div>';}
  function chart(days){
    var max=Math.max.apply(null,[1].concat(days.map(function(day){return day.knownAU||0;})));
    return '<div class="tl-days" role="img" aria-label="'+esc('Poznati napor po danima. '+days.map(function(day){return date(day.from)+': '+(day.sessions?day.rated?number(day.knownAU)+' AU poznato':'napor nije poznat':'nema zapisa')+(day.missingAU?', nepotpun zapis':'');}).join('; '))+'">'+days.map(function(day){
      var height=day.rated&&day.knownAU>0?Math.max(2,day.knownAU/max*100):0;
      return '<div class="tl-day" data-load-day="'+esc(day.date)+'" data-total-au="'+value(day.totalAU)+'" data-known-au="'+value(day.knownAU)+'"><span class="tl-day-value">'+(day.missingAU?'?':day.sessions?number(day.knownAU,0):'·')+'</span><div class="tl-day-track">'+
        (height?'<span class="tl-day-fill" style="height:'+height+'%"></span>':'')+(day.missingAU?'<span class="tl-day-unknown" aria-hidden="true">?</span>':'')+'</div><span class="tl-day-date">'+esc(date(day.from))+'</span></div>';
    }).join('')+'</div>';
  }
  function effort(summary){
    var current=summary.effort.current,baseline=summary.effort.baseline;
    var missing=current.missingAU>0;
    var minutes=current.missingDuration===current.sessions&&current.sessions>0?'trajanje nije poznato':number(current.knownMinutes,1)+' poznatih min'+(current.missingDuration?' · '+current.missingDuration+' bez trajanja':'');
    return '<section class="tl-card tl-effort" data-load-section="effort" data-load-period="current" data-total-au="'+value(current.totalAU)+'" data-known-au="'+value(current.knownAU)+'" data-missing-au="'+current.missingAU+'" data-sessions="'+current.sessions+'">'+
      title('01','Tvoj osjećaj × vrijeme','Napor treninga','Zabilježeno')+
      '<div class="tl-effort-total"><strong data-load-metric="current-au">'+number(current.totalAU,1)+'</strong><span>AU · zadnjih 7 dana</span></div>'+
      '<p class="tl-lead">'+(current.sessions?number(current.sessions)+' spremljenih treninga · '+minutes:'Još nema spremljenih treninga u ovom razdoblju.')+'</p>'+
      (missing?'<div class="tl-missing"><b>Zbroj nije potpun</b><span>Za '+current.missingAU+' '+(current.missingAU===1?'trening nedostaje':'treninga nedostaje')+' ocjena napora ili trajanje.</span>'+(current.rated?'<strong><span data-load-metric="known-au">'+number(current.knownAU,1)+'</span> AU poznato iz '+current.rated+' zapisa</strong>':'<span>Poznati zbroj napora još nije dostupan.</span>')+'</div>':'')+
      chart(summary.effort.days)+
      '<div class="tl-reference" data-load-period="baseline" data-total-au="'+value(baseline.totalAU)+'" data-known-au="'+value(baseline.knownAU)+'" data-weekly-average-au="'+value(baseline.weeklyAverageAU)+'" data-sessions="'+baseline.sessions+'" data-active-weeks="'+baseline.activeWeeks+'"><div><span>Prethodna 4 tjedna</span><strong>'+number(baseline.weeklyAverageAU,1)+' <small>AU / tjedan</small></strong></div><p>'+baseline.sessions+' zapisa u '+baseline.activeWeeks+' od 4 tjedna'+(baseline.missingAU?' · napor nije poznat za '+baseline.missingAU+' zapisa':baseline.sessions?' · prosjek zabilježenog napora':' · nema usporednog razdoblja')+'</p></div>'+
      '<details class="tl-details"><summary>Brojke i izvori napora</summary><p>AU su jedinice napora: tvoja ocjena cijelog treninga (sRPE, 0–10) × stvarne minute (sekunde ÷ 60). Nula je unesena ocjena; prazno ostaje nepoznato. Protokoli, teren, ekipa i utakmice ulaze u ovaj pokazatelj. Pokusi iz knjižnice i budući zapisi ne ulaze.</p><div class="tl-table-wrap"><table><caption>Zadnjih 7 dana, samo spremljeni zapisi</caption><thead><tr><th scope="col">Datum</th><th scope="col">Treninzi</th><th scope="col">Napor AU</th></tr></thead><tbody>'+summary.effort.days.slice().reverse().map(function(day){return '<tr><th scope="row">'+esc(date(day.from))+'</th><td>'+day.sessions+'</td><td>'+(day.sessions?day.totalAU!==null?number(day.totalAU):day.rated?number(day.knownAU)+' poznato':'—':'Nema zapisa')+(day.missingAU?' · '+day.missingAU+' nepoznato':'')+'</td></tr>';}).join('')+'</tbody></table></div><p>Referentni prosjek dijeli zabilježeni napor prethodnih 28 dana s četiri. Ne ocjenjuje je li trening za tebe optimalan.</p><button type="button" class="tl-link" data-a="historyList">Otvori povijest treninga <span aria-hidden="true">↗</span></button></details></section>';
  }
  function muscleRow(group,max){
    var direct=max?group.direct/max*100:0,secondary=max?group.secondary*.5/max*100:0;
    return '<div class="tl-muscle-row" data-load-group="'+esc(group.id)+'" data-direct="'+value(group.direct)+'" data-secondary="'+value(group.secondary)+'" data-equivalent="'+value(group.equivalent)+'"><div><span>'+esc(group.label)+'</span><b>'+number(group.equivalent,1)+'</b></div><div class="tl-muscle-track" aria-hidden="true"><i class="tl-direct" style="width:'+direct+'%"></i><i class="tl-secondary" style="width:'+secondary+'%"></i></div><small>'+number(group.direct,0)+' izravnih · '+number(group.secondary,0)+' pomoćnih serija</small></div>';
  }
  function muscles(summary){
    var model=summary.muscles,coverage=model.coverage,known=model.recordedSets>0||coverage.coveredSessions>0;
    var groups=model.groups.slice().sort(function(a,b){return b.equivalent-a.equivalent||a.label.localeCompare(b.label,'hr');}),top=groups.filter(function(group){return group.equivalent>0;}).slice(0,5),max=Math.max.apply(null,[1].concat(top.map(function(group){return group.equivalent;})));
    var missing=coverage.missingSessions+coverage.invalidSessions+coverage.unassignedSessions;
    return '<section class="tl-card tl-muscles" data-load-section="muscles">'+title('02','Rad po mišićima','Mišićne serije','Odrađeno')+
      '<div class="tl-muscle-overview"><div><strong data-load-metric="muscle-sets">'+(known?number(model.recordedSets,0):'—')+'</strong><span>poznatih radnih serija</span></div><div><strong>'+number(model.coveredGroups,0)+'</strong><span>skupina sa zabilježenim radom</span></div></div>'+
      (missing?'<p class="tl-note">Dio mišićne raspodjele nije poznat. Prikazan je samo sačuvani rad.</p>':'')+
      (top.length?'<div class="tl-muscle-chart">'+top.map(function(group){return muscleRow(group,max);}).join('')+'</div>':'<p class="tl-empty">Još nema raspodjele radnih serija u ovom razdoblju. Ekipni trening i utakmica ne stvaraju pretpostavljene mišićne serije.</p>')+
      '<div class="tl-legend"><span><i class="tl-direct"></i>Izravne × 1</span><span><i class="tl-secondary"></i>Pomoćne × 0,5</span></div>'+
      '<details class="tl-details"><summary>Sve mišićne skupine i pravilo</summary><p>Jedna odrađena serija pripisuje se glavnim mišićima kao 1, pomoćnima kao 0,5. To je model pripisivanja rada: kilogrami i RIR ne ponderiraju ove serije. Broj ne mjeri rast mišića, točan podražaj ili oporavak.</p><div class="tl-table-wrap"><table><caption>Poznati dio raspodjele radnih serija</caption><thead><tr><th scope="col">Skupina</th><th scope="col">Izravne</th><th scope="col">Pomoćne</th><th scope="col">Prikaz</th></tr></thead><tbody>'+groups.map(function(group){return '<tr><th scope="row">'+esc(group.label)+'</th><td>'+(known?number(group.direct,0):'—')+'</td><td>'+(known?number(group.secondary,0):'—')+'</td><td>'+(known?number(group.equivalent,1):'—')+'</td></tr>';}).join('')+'</tbody></table></div><p>Pojedina radna serija može biti pripisana više skupina. Zato se vrijednosti po mišićima ne zbrajaju kao broj serija treninga. Zagrijavanja se izostavljaju; planirani termini nisu odrađeni rad.</p></details></section>';
  }
  function readiness(summary,morning){
    var current=morning&&morning.date===summary.today?morning:{},specs=[['energy','Energija',1,5],['legs','Noge',1,5],['pain','Bol',0,10]];
    var names={energy:['Vrlo malo','Malo','Uobičajeno','Dosta','Puno'],legs:['Vrlo lagane','Lagane','Uobičajene','Teške','Vrlo teške']},known=0;
    var fields=specs.map(function(spec){var key=spec[0],n=current[key],valid=Number.isInteger(n)&&n>=spec[2]&&n<=spec[3];if(valid)known++;return '<div data-load-readiness="'+key+'" data-value="'+(valid?n:'')+'"><span>'+spec[1]+'</span><strong>'+ (valid?n:'—')+(valid?'<small> / '+spec[3]+'</small>':'')+'</strong><small>'+(valid?key==='pain'?(n===0?'Bez boli':'Tvoja prijavljena bol'):names[key][n-1]:'Nije uneseno')+'</small></div>';}).join('');
    return '<section class="tl-card tl-readiness" data-load-section="readiness" data-date="'+esc(summary.today)+'">'+title('03','Kako si danas','Jutarnje stanje',known===3?'Uneseno':'Nepotpuno')+
      '<div class="tl-readiness-grid">'+fields+'</div><p class="tl-note">'+(known?'Ovo su tvoji današnji odgovori, ne ukupna ocjena spremnosti.':'Za danas nema jutarnjih podataka. Spremnost se ne zaključuje iz količine rada.')+'</p><button type="button" class="tl-button" data-a="morningOpen">'+(known?'Dopuni jutarnju provjeru':'Unesi jutarnju provjeru')+'<span aria-hidden="true">↗</span></button></section>';
  }
  function render(vm){
    vm=vm||{};var summary=vm.summary;
    var head='<header class="tl-heading"><button type="button" data-a="back" aria-label="Natrag">‹</button><div><p class="tl-eyebrow">Tvoj trening, jasniji podaci</p><h1>Opterećenje</h1></div></header>';
    if(!summary||summary.status!=='ready')return '<div class="view training-load">'+head+'<p class="tl-empty">Podaci za prikaz još nisu dostupni.</p></div>';
    return '<div class="view training-load">'+head+'<div class="tl-intro"><span class="tl-live-dot" aria-hidden="true"></span><p>'+esc(date(summary.range.from))+' – '+esc(date(summary.range.to-1))+' · zadnjih 7 dana</p><span>Samo zabilježeno</span></div>'+
      '<p class="tl-separation">Tri odvojena pokazatelja. Svaki govori nešto drugo o tvom treningu.</p>'+effort(summary)+muscles(summary)+readiness(summary,vm.morning)+
      '<details class="tl-model-note"><summary>A što znače stari LM1 bodovi?</summary><p>LM1 je zaseban model s unaprijed zadanim faktorima. Nema osobnu kalibraciju i ne koristi unesene kilograme. Njegovi bodovi nisu ovdje prikazani kao stvarni napor, točan umor ili oporavak.</p><p>Ni mišićne serije ni sRPE × trajanje sami ne određuju što moraš trenirati sutra. Jutarnji odgovori ostaju odvojeni.</p></details></div>';
  }
  return Object.freeze({render:render});
});
