// Readable daily check-ins and the Today screen. All values come from this device.
(function(root, factory) {
  const calendar = typeof module === 'object' && module.exports ? require('./month-plan.js') : MonthPlan;
  const doses = typeof module === 'object' && module.exports ? require('./player-dose.js') : PlayerDose;
  const api = factory(calendar,doses);
  if (root) root.TodayView=api;
  if (typeof module === 'object' && module.exports) module.exports=api;
})(typeof window !== 'undefined' ? window : null, function(calendar,doses) {
  'use strict';
  const esc = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const energy = ['Vrlo malo','Malo','Uobičajeno','Dosta','Puno'];
  const legs = ['Vrlo lagane','Lagane','Uobičajene','Teške','Vrlo teške'];
  const specs = [['energy','Energija',1,5],['legs','Osjećaj u nogama',1,5],['pain','Bol',0,10]];
  const shortDay = day => calendar.valid(day) ? new Date(calendar.time(day)).toLocaleDateString('hr-HR',{day:'numeric',month:'short'}) : '';
  function cleanChecks(raw) {
    const out = {};
    if (!raw || Array.isArray(raw) || typeof raw !== 'object') return out;
    for (const [date,value] of Object.entries(raw)) {
      if (!calendar.valid(date) || !value || typeof value !== 'object' || Array.isArray(value) || (value.date != null && value.date !== date)) continue;
      const entry={date};
      for (const [key,,min,max] of specs) {
        if (Number.isInteger(value[key]) && value[key]>=min && value[key]<=max) entry[key]=value[key];
      }
      if (Object.keys(entry).length>1) out[date]=entry;
    }
    return out;
  }
  function readForm(form, date) {
    const entry={date};
    for (const [key,label,min,max] of specs) {
      const value=form.elements.namedItem(key).value;
      if (value==='') continue;
      const n=Number(value);
      if (!Number.isInteger(n) || n<min || n>max) return {error:'Provjeri polje '+label.toLocaleLowerCase('hr-HR')+'.'};
      entry[key]=n;
    }
    return Object.keys(entry).length>1 ? {entry} : {error:'Za spremanje odaberi barem jedan odgovor.'};
  }
  function description(entry) {
    if (!entry) return 'Još nema jutarnje provjere.';
    return [entry.energy != null ? 'Energija '+entry.energy+'/5' : '',entry.legs != null ? 'Noge '+entry.legs+'/5' : '',
      entry.pain != null ? (entry.pain===0 ? 'Bez boli' : 'Bol '+entry.pain+'/10') : ''].filter(Boolean).join(' · ');
  }
  function label(key,n) {
    if (key==='energy') return n+' · '+energy[n-1];
    if (key==='legs') return n+' · '+legs[n-1];
    return n===0?'0 · Bez boli':n===10?'10 · Najjača bol':String(n);
  }
  const back = '<button type="button" class="dy-back" data-a="back" aria-label="Natrag">‹</button>';
  function header(title,sub) {
    return '<header class="dy-heading">'+back+'<div><p class="dy-eyebrow">'+esc(sub)+'</p><h1>'+esc(title)+'</h1></div></header>';
  }
  function formView({date,original}) {
    return '<div class="view dy-view">'+header('Jutarnja provjera',shortDay(date))+
      '<p class="dy-intro">'+(date===calendar.key(Date.now())?'Kako se osjećaš danas?':'Kako si se osjećao tog jutra?')+' Dovoljan je jedan odgovor.</p><form id="morning-form" class="dy-panel dy-form">'+
      specs.map(([key,title,min,max])=>{
        const options=[];
        for (let i=min;i<=max;i++) options.push('<option value="'+i+'"'+(original?.[key]===i?' selected':'')+'>'+esc(label(key,i))+'</option>');
        return '<label>'+esc(title)+'<select name="'+key+'"><option value="">Bez unosa</option>'+options.join('')+'</select></label>';
      }).join('')+'<p class="dy-error" id="morning-error" role="alert"></p><button type="submit" class="dy-primary" data-a="morningSave">Spremi provjeru</button>'+
      (original?'<button type="button" class="dy-delete" data-a="morningDeleteAsk">Izbriši provjeru</button><div id="morning-confirm" hidden><p>Izbrisati provjeru za '+shortDay(date)+'?</p><button type="button" class="dy-delete" data-a="morningDeleteConfirm">Potvrdi brisanje</button> <button type="button" class="dy-secondary" data-a="morningDeleteCancel">Odustani</button></div>':'')+'</form></div>';
  }
  function card(vm) {
    if (!vm) return '';
    return '<button type="button" data-a="todayOpen" class="dy-dash-card"><span><small>Danas · '+shortDay(vm.date)+'</small><strong>'+esc(vm.recommendation.title)+'</strong><span>'+
      esc(vm.checkin?'Jutarnja provjera spremljena':'Pogledaj prijedlog i jutarnju provjeru')+'</span></span><b aria-hidden="true">›</b></button>';
  }
  const actionLabels={protocol:'Pokreni predloženi trening',field:'Otvori terenski trening',calendar:'Otvori planer',checkin:'Ispuni jutarnju provjeru',team:'Upiši ekipni trening',history:'Otvori povijest'};
  const evidenceLabels={history:'Povijest',plan:'Plan',match:'Utakmica',checkin:'Jutarnja provjera',protocol:'Protokol',field:'Terenski trening'};
  function doseRows(items,exercises) {
    if (!items?.length) return '';
    const rows=items.map(item=>{
      const e=exercises[item.exId];
      if (!e) return '';
      const timed=item.measure==='time', sets=item.sets || 1;
      const series=Array.from({length:sets},(_,i)=>doses.at(item,i+1));
      const list=key=>{
        const values=series.map(row=>row[key].toLocaleString('hr-HR'));
        return values.every(value=>value===values[0]) ? values[0] : values.join('/');
      };
      const qty=list(timed?'sec':'reps')+(timed?' s':' pon.');
      const kg=series.some(row=>row.kg>0)?list('kg')+' kg':'';
      return '<li><strong>'+esc(e.name)+'</strong><span>'+esc([sets+' × '+qty,kg,item.sides?'po strani':'',item.rest!=null?'odmor '+item.rest+' s':''].filter(Boolean).join(' · '))+'</span></li>';
    }).filter(Boolean);
    if (!rows.length) return '';
    const preview=rows.length<=2 ? rows.length : 1;
    return '<div class="dy-dose"><ul>'+rows.slice(0,preview).join('')+'</ul></div>'+
      (rows.length>preview?'<details class="dy-dose"><summary>Sve vježbe ('+rows.length+')</summary><ul>'+rows.slice(preview).join('')+'</ul></details>':'');
  }
  function lastPerformance(rec,exercises) {
    const entries=rec.observed?.filter(it=>it.rows?.length && exercises[it.exId]);
    if (!entries?.length) return '';
    return '<details class="dy-dose"><summary>Zadnja usporediva izvedba</summary><ul>'+entries.map(it=>{
      const ex=exercises[it.exId], item=rec.items.find(i=>i.exId===it.exId), timed=(it.measure || item?.measure || ex.measure)==='time';
      const lines=it.rows.map(row=>{
        const amount=timed?row.sec:row.reps;
        const reserve=timed?row.sir:row.rir;
        const parts=[row.set!=null?row.set+'. serija':'Serija',amount==null?'količina nije zabilježena':amount+(timed?' s':' pon.')];
        if (row.kg!=null) parts.push(row.kg.toLocaleString('hr-HR')+' kg');
        if ((it.sides ?? item?.sides) && row.sides!=null) parts.push(row.sides+'/2 strane');
        if (row.failed) parts.push('nije dovršena');
        if (reserve!=null) parts.push(timed?'rezerva '+reserve+' s':'RIR '+reserve);
        return '<span>'+esc(parts.join(' · '))+'</span>';
      });
      return '<li><strong>'+esc(ex.name)+'</strong>'+lines.join('')+'</li>';
    }).join('')+'</ul></details>';
  }
  function view(vm) {
    const rec=vm.recommendation, action=rec.action || {}, reasons=rec.reasons || [], evidence=rec.evidence || [];
    const past=Object.values(vm.checks).filter(x=>x.date<vm.date).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,7);
    return '<div class="view dy-view">'+header('Danas',new Date(calendar.time(vm.date)).toLocaleDateString('hr-HR',{weekday:'long',day:'numeric',month:'long'}))+
      '<div class="dy-tools"><button data-a="morningOpen"><strong>Jutarnja provjera</strong><small>'+esc(description(vm.checkin))+'</small></button><button data-a="teamNew"><strong>+ Ekipni dnevnik</strong><small>Trening ili utakmica</small></button></div>'+
      '<button type="button" class="dy-match" data-a="todayEvidence" data-type="match" data-date="'+esc(vm.nextMatch || vm.date)+'"><span>Sljedeća utakmica</span><strong>'+esc(vm.nextMatch===vm.date?'Danas':vm.nextMatch?shortDay(vm.nextMatch):'Dodaj u planer')+' ›</strong></button>'+
      '<section class="dy-panel dy-advice" id="today-recommendation" data-kind="'+esc(rec.kind)+'"><p class="dy-eyebrow">Prijedlog za danas</p><h2>'+esc(rec.title)+'</h2><p>'+esc(rec.summary)+'</p>'+
      doseRows(rec.items,vm.exercises)+(actionLabels[action.type]?'<button type="button" class="dy-primary" data-a="todayAct">'+esc(actionLabels[action.type])+'</button>':'')+
      (reasons.length?'<h3>Zašto ovaj prijedlog?</h3><ul class="dy-reasons">'+reasons.map(r=>'<li>'+esc(r.text)+'</li>').join('')+'</ul>':'')+lastPerformance(rec,vm.exercises)+
      (rec.missing?.length?'<p class="dy-missing"><strong>Što još nedostaje</strong><br>'+rec.missing.map(esc).join(' ')+'</p>':'')+'</section>'+
      (evidence.length?'<section class="dy-panel"><h2>Korišteni podaci</h2><div class="today-evidence">'+evidence.map(e=>{
        const type=String(e.type),name=evidenceLabels[type]||'Podatak',canOpen=(['history','protocol','field'].includes(type)&&e.id)||(['checkin','plan','match'].includes(type)&&calendar.valid(e.date));
        const inside='<strong>'+esc(e.label || name)+'</strong><small>'+esc(name)+(e.date?' · '+shortDay(e.date):'')+'</small>';
        return canOpen?'<button data-a="todayEvidence" data-type="'+esc(type)+'" data-id="'+esc(e.id||'')+'" data-date="'+esc(e.date||'')+'">'+inside+'</button>':'<div>'+inside+'</div>';
      }).join('')+'</div></section>':'')+
      '<section class="dy-panel"><h2>Ekipni dnevnik</h2>'+(!vm.team.length?'<p>Zabilježi prvi ekipni trening ili utakmicu da uđu u sljedeći prijedlog.</p>':
      '<div class="today-evidence">'+vm.team.map(l=>'<button data-a="historyOpen" data-id="'+esc(l.historyId)+'"><strong>'+esc(l.name)+'</strong><small>'+shortDay(calendar.key(l.at))+
        (Number.isFinite(l.secs)?' · '+esc(Math.round(l.secs/60))+' min':'')+(Number.isFinite(l.srpe)?' · napor '+esc(l.srpe)+'/10':'')+'</small></button>').join('')+'</div>')+'</section>'+
      (past.length?'<details class="dy-panel dy-previous"><summary>Prethodne jutarnje provjere</summary><div class="today-evidence">'+past.map(x=>'<button data-a="morningOpen" data-date="'+esc(x.date)+'"><strong>'+shortDay(x.date)+'</strong><small>'+esc(description(x))+'</small></button>').join('')+'</div></details>':'')+
      '<p class="dy-note">Prijedlog se računa na ovom uređaju iz tvojih zapisa, rasporeda i jutarnje provjere.</p></div>';
  }
  return {cleanChecks,readForm,description,card,view,formView};
});
