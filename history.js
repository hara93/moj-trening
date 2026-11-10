/* Saved history UI. render() only formats the supplied model; readEdit() reads a
   changed-only patch and never writes data. The app owns identities, filtering,
   pagination, atomic validation, persistence and derived totals. */
(function(root) {
  'use strict';
  const Team=root.TeamDiary||(typeof module==='object'&&module.exports?require('./team.js'):null);
  const History=root.HistoryModel||(typeof module==='object'&&module.exports?require('./history-model.js'):null);
  const own=(o,k)=>!!o&&Object.prototype.hasOwnProperty.call(o,k);
  const array=v=>Array.isArray(v)?v:[];
  const number=v=>typeof v==='number'&&Number.isFinite(v)&&v>=0?v:null;
  const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt=(v,d=2)=>number(v)==null?'Nije zabilježeno':v.toLocaleString('hr-HR',{maximumFractionDigits:d});
  const plural=(n,one,few,many)=>n%10===1&&n%100!==11?one:n%10>=2&&n%10<=4&&(n%100<12||n%100>14)?few:many;
  const inputNumber=v=>number(v)==null?'':String(v).replace('.',',');
  const title=e=>String(e&&(e.title||e.name)||'Trening bez naziva');
  const kind=e=>e.kind==='team'?Team.label(e.teamType):e.kind==='exercise'?'Vježba iz knjižnice':e.kind==='field'?'Kondicija na terenu':e.kind==='protocol'?'Trening u teretani':'Stariji zapis';
  const icon=name=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+({
    back:'<path d="m14 5-7 7 7 7"/>',search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',arrow:'<path d="m9 5 7 7-7 7"/>',
    edit:'<path d="m4 16 11-11 4 4L8 20H4zM13 7l4 4"/>',trash:'<path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 7h.01M12 11v6"/>',check:'<path d="m5 12 4 4L19 6"/>'
  }[name]||'')+'</svg>';
  function dateAt(at) { const d=typeof at==='number'&&Number.isFinite(at)?new Date(at):null;return d&&!Number.isNaN(d.getTime())?d:null; }
  function localInput(at) {
    const d=dateAt(at);if(!d)return '';
    const p=(n,len=2)=>String(n).padStart(len,'0');
    let out=p(d.getFullYear(),4)+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+'T'+p(d.getHours())+':'+p(d.getMinutes());
    if(d.getSeconds()||d.getMilliseconds())out+=':'+p(d.getSeconds());
    if(d.getMilliseconds())out+='.'+p(d.getMilliseconds(),3).replace(/0+$/,'');
    return out;
  }
  function dateKey(at) { const s=localInput(at);return s?s.slice(0,10):'unknown'; }
  function dayLabel(at) { const d=dateAt(at);return d?d.toLocaleDateString('hr-HR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}):'Datum nije zabilježen'; }
  function timeLabel(at) { const d=dateAt(at);return d?d.toLocaleTimeString('hr-HR',{hour:'2-digit',minute:'2-digit'}):''; }
  function duration(secs) {
    if(number(secs)==null)return 'Trajanje nije zabilježeno';
    const mins=Math.floor(secs/60),rest=secs-mins*60;
    return mins?(mins+' min'+(rest?' '+fmt(rest)+' s':'')):fmt(rest)+' s';
  }
  function header(heading,sub) {
    return '<header class="hy-heading"><button type="button" class="hy-back" data-a="back" aria-label="Natrag">'+icon('back')+'</button><p class="hy-kicker">Tvoji spremljeni zapisi</p><h1>'+esc(heading)+'</h1>'+(sub?'<p class="hy-sub">'+esc(sub)+'</p>':'')+'</header>';
  }
  function note(text,cls='') {return '<div class="hy-note '+cls+'">'+icon('info')+'<p>'+esc(text)+'</p></div>';}
  function metric(label,value) {return '<div><dt>'+esc(label)+'</dt><dd>'+esc(value)+'</dd></div>';}
  function savedSnapshots(entry) {
    if(!root.MuscleWork||typeof root.MuscleWork.sanitize!=='function')return [];
    return array(entry.muscleWork).map(raw=>root.MuscleWork.sanitize(raw)).filter(s=>s&&s.source==='completed');
  }
  function archivedDetails(entry) {
    const snapshots=savedSnapshots(entry);
    return '<section class="hy-card"><h2>Sažeti zapis</h2><p class="hy-copy">Detalji pojedinačnih serija nisu sačuvani u ovom zapisu. Poznati podaci ostaju dostupni bez rekonstrukcije iz današnje knjižnice.</p>'+
      (snapshots.length?'<div class="hy-saved-summary">'+snapshots.map(s=>'<article><h3>'+esc(s.name||s.exerciseId)+'</h3><p>Naziv iz spremljenog sažetka</p><dl>'+metric('Odrađene serije',fmt(s.completedSets,0))+metric('Planirane serije',fmt(s.plannedSets,0))+'</dl></article>').join('')+'</div>':'<p class="hy-muted">Raspodjela po vježbama i mišićima nije dostupna.</p>')+'</section>';
  }
  function attempted(item) {
    if(item.historySetsUnknown===true)return null;
    if(item.skipped===true)return 0;
    if(own(item,'setsDone'))return Number.isInteger(item.setsDone)&&item.setsDone>=0&&(!Number.isInteger(item.sets)||item.setsDone<=item.sets)?item.setsDone:null;
    if(item.done===true&&Number.isInteger(item.sets)&&item.sets>0)return item.sets;
    if(item.done===false&&number(item.lastReps)!=null&&Number.isInteger(item.sets)&&item.sets>0)return item.sets;
    return null;
  }
  function completed(item) {
    if(root.HistoryModel&&typeof root.HistoryModel.performedSets==='function')return root.HistoryModel.performedSets(item);
    const n=attempted(item);return n!=null&&item.done===false&&item.lastReps===0?Math.max(0,n-1):n;
  }
  function rowsCount(item) {
    const n=attempted(item);
    return Math.min(64,n==null?Math.max(array(item.repsList).length,array(item.rirList).length,array(item.sirList).length):n);
  }
  function itemName(item) {return item.name||item.exId||'Vježba bez naziva';}
  function itemNameSource(item) {return item.nameSource==='snapshot'?'Naziv iz spremljenog zapisa':item.nameSource==='library'?'Naziv iz trenutačne knjižnice':item.nameSource==='id'?'Sačuvan je samo ID vježbe':'';}
  function rowReps(item,index) {
    const row=History.recordedRows(item)?.[index];
    return row?row.reps:null;
  }
  function rowDose(item,key,i) {
    const row=History.recordedRows(item)?.[i];
    return row?row[key]:null;
  }
  function rowLabel(item,i) {
    const ordinal=Array.isArray(item.setNumbers)?item.setNumbers[i]:i+1;
    const oneSide=item.sides && Array.isArray(item.sideCounts) && item.sideCounts[i]===1;
    return (Number.isInteger(ordinal)?String(ordinal):'—')+(oneSide?' · jedna strana':'');
  }
  function itemDetails(item,index) {
    if(!item||typeof item!=='object')return note('Podaci ove vježbe nisu čitljivi; ostali poznati dijelovi zapisa ostaju dostupni.');
    const timed=item.measure==='time',n=completed(item),count=rowsCount(item),reserve=timed?'sirList':'rirList';
    const state=item.skipped?'Preskočeno':item.done===false?'Nedovršeno':n==null?'Izvedba nije potpuno zabilježena':number(item.sets)!=null&&n<item.sets?'Djelomično odrađeno':'Spremljena izvedba';
    const row=Array.from({length:count},(_,i)=>'<tr><th scope="row">'+rowLabel(item,i)+'</th><td>'+esc(fmt(timed?rowDose(item,'sec',i):rowReps(item,i)))+'</td><td>'+esc(fmt(rowDose(item,'kg',i)))+'</td><td>'+esc(fmt(array(item[reserve])[i]))+'</td></tr>').join('');
    return '<article class="hy-card hy-exercise"><div class="hy-exercise-title"><span>'+String(index+1).padStart(2,'0')+'</span><div><h2>'+esc(itemName(item))+'</h2>'+(itemNameSource(item)?'<p>'+esc(itemNameSource(item))+'</p>':'')+'</div></div><p class="hy-status">'+esc(state)+(item.sides?' · Po strani':'')+'</p><dl class="hy-metrics hy-item-count">'+metric('Odrađene serije',fmt(n,0))+(attempted(item)!==n?metric('Pokušane serije',fmt(attempted(item),0)):'')+metric('Serije u zapisu',fmt(item.sets,0))+'</dl>'+
      (count?'<div class="hy-table-wrap"><table class="hy-sets"><caption>Podaci po spremljenim serijama</caption><thead><tr><th scope="col">Serija</th><th scope="col">'+(timed?(item.sides?'Prosjek po strani (s)':'Vrijeme (s)'):'Ponavljanja')+'</th><th scope="col">Teret (kg)</th><th scope="col">'+(timed?'Rezerva (s)':'RIR')+'</th></tr></thead><tbody>'+row+'</tbody></table></div>':'<p class="hy-muted">'+(n===0?'Nema dovršenih serija.':'Nije sačuvan dovoljan zapis za prikaz izvedbe po serijama.')+'</p>')+
      (count===64&&(n>64||array(item.repsList).length>64)?'<p class="hy-muted">Prikazano je prvih 64 serije; izvorni zapis ostaje sačuvan.</p>':'')+
      (item.done===false&&number(item.lastReps)!=null?'<p class="hy-copy">Zadnja pokušana serija: <b>'+fmt(item.lastReps)+' ponavljanja.</b></p>':'')+
      (typeof item.note==='string'&&item.note.trim()?'<p class="hy-copy hy-session-note"><b>Bilješka</b><br>'+esc(item.note)+'</p>':'')+
      '<p class="hy-footnote">Teret je prikazan kako je spremljen za ovu vježbu. Nepoznata vrijednost ostaje označena.</p></article>';
  }
  function fieldDetails(entry) {
    const load=entry.load&&typeof entry.load==='object'?entry.load:null;
    if(!load)return '<section class="hy-card"><h2>Rad na terenu</h2><p class="hy-copy">Za ovaj trening nisu sačuvani metri ni raspodjela rada. Trajanje i ostali poznati podaci ostaju dostupni.</p></section>';
    const zones=array(load.zones);
    return '<section class="hy-card"><h2>Spremljeni rad na terenu</h2><dl class="hy-metrics">'+metric('Ukupna udaljenost',number(load.m)!=null?fmt(load.m)+' m':'Nije zabilježeno')+metric('Brzo trčanje',number(load.hsr)!=null?fmt(load.hsr)+' m':'Nije zabilježeno')+metric('Sprint',number(load.spr)!=null?fmt(load.spr)+' m':'Nije zabilježeno')+metric('Radno vrijeme',number(load.min)!=null?fmt(load.min)+' min':'Nije zabilježeno')+
      (number(load.mas)!=null?metric('Tada korištena MAS',fmt(load.mas)+' m/s'):'')+'</dl>'+
      (zones.length===4?'<details class="hy-details"><summary>Spremljene zone trčanja</summary><dl class="hy-metrics">'+['Lagano','Umjereno','Visoko','Sprint'].map((label,i)=>metric(label,number(zones[i])!=null?fmt(zones[i])+' m':'Nije zabilježeno')).join('')+'</dl></details>':'')+
      '<p class="hy-footnote">Prikazane su vrijednosti sačuvane uz trening. Nisu ponovno izračunate iz današnje MAS ili današnjeg predloška.</p></section>';
  }
  function metadata(entry) {
    const srpe=number(entry.srpe),lm=entry.load2&&typeof entry.load2==='object'?entry.load2:null;
    const computedAu=History&&typeof History.sessionAU==='function'?History.sessionAU(entry):null;
    const au=computedAu;
    const score=lm&&!['needsProfile','needsDose','needsFieldData'].includes(entry.load2Status)?number(lm.B):null,band=lm?number(lm.band):null;
    return '<section class="hy-card"><div class="hy-record-kind">'+esc(kind(entry))+'</div><h2 class="hy-record-title">'+esc(title(entry))+'</h2><p class="hy-record-date">'+esc(dayLabel(entry.at))+(timeLabel(entry.at)?' · '+esc(timeLabel(entry.at)):'')+'</p><dl class="hy-metrics">'+metric(entry.kind==='team'&&entry.teamType==='match'?'Odigrano':'Trajanje',duration(entry.secs))+metric('Ocjena napora',srpe!=null?fmt(srpe)+' / 10':'Nije ocijenjeno')+
      (score!=null?metric(lm.v==='LM1'?'Procjena napora LM1':'Spremljena procjena napora',fmt(score)+(band!=null?' ± '+fmt(band):'')+' bodova'):'')+(au!=null?metric(computedAu!=null?'Napor × trajanje':'Spremljene jedinice napora',fmt(au)):'')+'</dl>'+
      (entry.load2Status==='needsProfile'?'<p class="hy-footnote">Za LM1 nedostaju izvorni podaci o vježbama. Bodovi se ne preuzimaju iz današnje knjižnice.</p>':'')+
      (entry.load2Status==='needsDose'?'<p class="hy-footnote">Za LM1 nije poznata sva stvarno odrađena izvedba. Nedostajuće serije, ponavljanja ili sekunde nisu nula.</p>':'')+
      (entry.load2Status==='needsFieldData'?'<p class="hy-footnote">LM1 bodovi nisu prikazani jer nisu poznati svi terenski podaci. Nepoznato brzo trčanje i sprint nisu nula.</p>':'')+
      (score!=null&&lm.v==='LM1'?'<p class="hy-footnote">LM1 koristi zadane faktore. Prikazani raspon je zadana procjena modela, ne provjerena osobna pogreška ni mjera oporavka.</p>':'')+
      (computedAu!=null?'<p class="hy-footnote">Jedinice napora: prijavljena ocjena cijelog treninga × stvarno trajanje u minutama (sekunde ÷ 60).</p>':'')+(entry.editedAt?'<p class="hy-footnote">Zapis je naknadno uređen.</p>':'')+'</section>';
  }
  function linkedMas(entry) {
    if(!entry.linkedMas)return '';
    const test=entry.linkedMas;
    return '<section class="hy-card"><h2>Povezani MAS rezultat</h2><dl class="hy-metrics">'+metric('Rezultat',number(test.value)!=null?fmt(test.value)+' '+String(test.unit||'m/s'):'Nije zabilježeno')+(number(test.dist)!=null?metric('Metri u testu',fmt(test.dist)+' m'):'')+'</dl><p class="hy-footnote">Rezultat testa prikazan je zasebno od treninga.</p></section>';
  }
  function detailView(vm) {
    const entry=vm.entry;
    const confirm=vm.deleteConfirm?'<section class="hy-delete-confirm" role="alert"><h2>Izbrisati ovaj zapis?</h2><p>Trening „'+esc(title(entry))+'” uklonit će se iz povijesti i povezanih pregleda.'+(entry.linkedMas?' Uklonit će se i povezani rezultat MAS testa.':'')+'</p><div class="hy-actions"><button type="button" data-a="historyDeleteCancel"'+(vm.busy?' disabled':'')+'>Odustani od brisanja</button><button type="button" class="hy-danger" data-a="historyDeleteConfirm" data-id="'+esc(entry.historyId)+'"'+(vm.busy?' disabled':'')+'>Potvrdi brisanje</button></div></section>':'<div class="hy-actions hy-record-actions"><button type="button" class="hy-primary" data-a="historyEdit">'+icon('edit')+'Uredi zapis</button><button type="button" class="hy-delete-link" data-a="historyDeleteAsk">'+icon('trash')+'Izbriši zapis</button></div>';
    return header('Detalji treninga')+(vm.error?note(vm.error,'hy-error'):'')+metadata(entry)+
      (entry.kind==='team'?Team.details(entry):entry.kind==='field'?fieldDetails(entry):array(entry.items).length?entry.items.map(itemDetails).join(''):archivedDetails(entry))+linkedMas(entry)+confirm;
  }
  function field(label,value,attrs,help='') {
    return '<label class="hy-field"><span>'+esc(label)+'</span><input '+attrs+' value="'+esc(value)+'" data-history-initial="'+esc(value)+'" autocomplete="off">'+(help?'<small>'+esc(help)+'</small>':'')+'</label>';
  }
  function numericField(label,value,attrs,help='') {return field(label,inputNumber(value),'type="text" inputmode="decimal" '+attrs,help);}
  function editItem(item,index) {
    if(!item||typeof item!=='object')return note('Detalji ove vježbe nisu dostupni za uređivanje.');
    const timed=item.measure==='time',count=rowsCount(item),bySet=own(item,'repsList'),prefix='data-history-item="'+index+'" ';
    const rowFields=Array.from({length:count},(_,i)=>{
      const common=prefix+'data-history-set="'+i+'" ';
      const failedLast=item.done===false&&number(item.lastReps)!=null&&i===attempted(item)-1;
      return '<div class="hy-set-edit"><b>Serija '+rowLabel(item,i)+(failedLast?' · zadnja pokušana':'')+'</b><div class="hy-form-grid">'+(!timed?(failedLast?numericField('Ponavljanja zadnje pokušane serije',item.lastReps,prefix+'data-history-field="lastReps"'):numericField('Ponavljanja',rowReps(item,i),common+'data-history-field="reps"')):'')+
        (own(item,'kgList')?numericField('Teret serije (kg)',rowDose(item,'kg',i),common+'data-history-field="kg"'):'')+
        (timed&&own(item,'secList')?numericField('Vrijeme serije (s)',rowDose(item,'sec',i),common+'data-history-field="sec"'):'')+
        numericField(timed?'Rezerva u sekundama':'RIR',array(item[timed?'sirList':'rirList'])[i],common+'data-history-field="'+(timed?'sir':'rir')+'"','Prazno znači da nije zabilježeno.')+'</div></div>';
    }).join('');
    return '<fieldset class="hy-card hy-edit-item"><legend>'+esc(itemName(item))+'</legend>'+(itemNameSource(item)?'<p class="hy-footnote">'+esc(itemNameSource(item))+'</p>':'')+'<p class="hy-muted">Serije u izvornom zapisu: '+fmt(item.sets,0)+(item.sides?' · po strani':'')+'</p><div class="hy-form-grid">'+
      numericField('Odrađene serije',completed(item),prefix+'data-history-field="setsDone"','Cijeli broj; 0 znači preskočeno.')+
      (timed?(own(item,'secList')?'':numericField('Vrijeme po seriji (s)',item.sec,prefix+'data-history-field="sec"')):!bySet?numericField('Ponavljanja po seriji',item.reps,prefix+'data-history-field="reps"'):'')+
      (own(item,'kgList')?'':numericField('Teret u zapisu (kg)',item.kg,prefix+'data-history-field="kg"','Nula je valjana vrijednost; prazno je nepoznato.'))+
      (item.done===false&&!timed&&!count?numericField('Ponavljanja zadnje pokušane serije',item.lastReps,prefix+'data-history-field="lastReps"'):'')+'</div>'+
      (rowFields?'<details class="hy-details"><summary>Podaci po serijama</summary>'+rowFields+(count===64?'<p class="hy-muted">Uređivanje prikazuje prvih 64 serije. Ostale se čuvaju.</p>':'')+'</details>':'')+'</fieldset>';
  }
  function editFieldLoad(entry) {
    const knownLoad=entry.load&&typeof entry.load==='object'?entry.load:null,load=knownLoad||{};
    const fields=[['m','Ukupna udaljenost (m)'],['hsr','Brzo trčanje (m)'],['spr','Sprint (m)'],['min','Radno vrijeme (min)']];
    const zones=array(load.zones);
    return '<fieldset class="hy-card"><legend>Podaci terena</legend>'+(!knownLoad?'<p class="hy-copy">Ovaj zapis nema ranije sačuvane terenske podatke. Upiši samo ono što poznaješ; ostalo ostavi prazno.</p>':'')+'<p class="hy-copy">Radno vrijeme odnosi se na dionice; ukupno trajanje sesije uređuje se iznad.</p>'+(entry.refId==='mas-test-5-min'?'<p class="hy-copy">Ispravak ukupnih metara ovog 5-minutnog testa ažurira i povezani MAS rezultat za buduće intervale. Upiši 600–2400 cijelih metara uz 5 min rada. Poznati rezultat zadrži ili izbriši cijeli povezani zapis.</p>':'')+'<div class="hy-form-grid">'+fields.map(([id,label])=>numericField(label,load[id],'data-history-load="'+id+'"')).join('')+'</div>'+
      (zones.length===4?'<details class="hy-details"><summary>Uredi spremljene zone</summary><div class="hy-form-grid">'+['Lagano (m)','Umjereno (m)','Visoko (m)','Sprint (m)'].map((label,i)=>numericField(label,zones[i],'data-history-load="zones" data-history-zone="'+i+'"')).join('')+'</div></details>':'')+
      '<p class="hy-footnote">Sprint mora biti dio brzog trčanja, a brzo trčanje dio ukupnih metara. Promjena metara uklanja stare zone ako ih ne uskladiš zasebno.</p></fieldset>';
  }
  function editView(vm) {
    const entry=vm.entry,minutes=number(entry.secs)==null?null:Math.round(entry.secs/60*1e6)/1e6;
    return header('Uredi zapis',entry.kind==='team'?'Ispravi podatke odrađene sesije.':'Mijenja se spremljena izvedba, bez promjene treninga.')+'<form id="history-edit-form" novalidate><div id="history-edit-error" class="hy-form-error" role="alert" aria-live="polite">'+esc(vm.error||'')+'</div><fieldset class="hy-card"><legend>Osnovni podaci</legend>'+
      field('Naziv treninga',entry.name||'','type="text" id="history-title" data-history-meta="name" maxlength="200"')+
      field(entry.kind==='team'?'Datum i vrijeme završetka':'Datum i vrijeme',localInput(entry.at),'type="datetime-local" step="0.001" id="history-at" data-history-meta="at"',entry.kind==='team'?'Lokalno vrijeme; za sesiju preko ponoći odaberi dan završetka.':'Lokalno vrijeme na ovom uređaju.')+
      '<div class="hy-form-grid">'+numericField(entry.kind==='team'?'Stvarno trajanje (min)':'Trajanje (min)',minutes,'id="history-minutes" data-history-meta="secs"')+numericField('Ocjena napora (0–10)',entry.srpe,'id="history-srpe" data-history-meta="srpe"','Prazno uklanja ocjenu; 0 je unesena ocjena.')+'</div></fieldset>'+
      (entry.kind==='team'?Team.extras(entry):entry.kind==='field'?editFieldLoad(entry):array(entry.items).length?entry.items.map(editItem).join(''):archivedDetails(entry))+
      '<p class="hy-editor-note">Prazna vrijednost nije nula. Nepromijenjeni podaci čuvaju izvornu preciznost. Spremljene izmjene osvježit će povijest i povezane preglede.</p><div class="hy-actions hy-editor-actions"><button type="button" data-a="historyCancelEdit"'+(vm.busy?' disabled':'')+'>Odustani</button><button type="button" class="hy-primary" data-a="historySave"'+(vm.busy?' disabled':'')+'>'+icon('check')+(vm.busy?'Spremam…':'Spremi izmjene')+'</button></div></form>';
  }
  function listView(vm) {
    const entries=array(vm.entries).filter(e=>e&&e.kind!=='test'),query=String(vm.query||''),total=number(vm.filteredTotal)==null?entries.length:vm.filteredTotal;
    const page=Number.isInteger(vm.page)&&vm.page>0?vm.page:1,size=Number.isInteger(vm.pageSize)&&vm.pageSize>0?vm.pageSize:15,pages=Math.max(1,Math.ceil(total/size));
    let group=null,rows='';
    entries.forEach(entry=>{
      const date=dateKey(entry.at);
      if(group!==date){if(group!==null)rows+='</div></section>';group=date;rows+='<section class="hy-date-group"><h2>'+esc(dayLabel(entry.at))+'</h2><div class="hy-record-list">';}
      const id=entry.historyId,tag=typeof id==='string'?'button':'div';
      rows+='<'+tag+' class="hy-row"'+(tag==='button'?' type="button" data-a="historyOpen" data-id="'+esc(id)+'"':'')+'><span class="hy-row-icon">'+icon(entry.kind==='field'?'clock':'check')+'</span><span class="hy-row-text"><b>'+esc(title(entry))+'</b><small>'+esc(timeLabel(entry.at))+(timeLabel(entry.at)?' · ':'')+esc(duration(entry.secs))+'</small><span>'+esc(kind(entry))+(entry.partial?' · djelomično':'')+(entry.archived?' · Sažeti zapis':'')+'</span></span>'+icon('arrow')+'</'+tag+'>';
    });
    if(group!==null)rows+='</div></section>';
    return header('Povijest treninga','Spremljeni treninzi i samostalne vježbe, od najnovijeg.')+'<button type="button" class="hy-team-new" data-a="teamNew">+ Zabilježi klub ili utakmicu</button><div class="hy-search">'+icon('search')+'<label class="hy-visually-hidden" for="history-query">Pretraži treninge</label><input type="search" id="history-query" placeholder="Pretraži po nazivu" value="'+esc(query)+'" autocomplete="off"></div>'+
      (vm.ref?'<p class="hy-ref"><span>Trening: '+esc(vm.ref.name)+'</span><button type="button" data-a="historyRefClear" aria-label="Ukloni filtar i prikaži sve treninge">Prikaži sve</button></p>':'')+
      '<p class="hy-list-count" aria-live="polite">'+fmt(total,0)+' '+(query?plural(total,'rezultat pretrage','rezultata pretrage','rezultata pretrage'):plural(total,'spremljen zapis','spremljena zapisa','spremljenih zapisa'))+'</p>'+(vm.error?note(vm.error,'hy-error'):'')+
      (rows||'<section class="hy-empty">'+icon('clock')+'<h2>'+(query?'Nema rezultata pretrage':vm.ref?'Ovaj trening još nije odrađen':'Povijest je još prazna')+'</h2><p>'+(query?'Pokušaj upisati dio naziva treninga.':vm.ref?'Kad ga odradiš i spremiš, pojavit će se ovdje.':'Spremljeni trening ili vježba iz knjižnice pojavit će se ovdje. Rezultati testova imaju zasebnu evidenciju.')+'</p></section>')+
      (pages>1?'<nav class="hy-pagination" aria-label="Stranice povijesti"><button type="button" data-a="historyPage" data-page="'+(page-1)+'"'+(page<=1?' disabled':'')+'>Prethodna</button><span>Stranica '+page+' od '+pages+'</span><button type="button" data-a="historyPage" data-page="'+(page+1)+'"'+(page>=pages?' disabled':'')+'>Sljedeća</button></nav>':'');
  }
  function render(vm) {
    vm=vm||{};
    if(vm.loading)return '<div class="view history">'+header('Povijest treninga')+'<p class="hy-copy hy-loading" role="status">Učitavam spremljene zapise…</p></div>';
    if(vm.mode==='detail'||vm.mode==='edit') {
      if(!vm.entry||vm.entry.kind==='test')return '<div class="view history">'+header('Povijest treninga')+'<section class="hy-empty"><h2>Zapis nije dostupan</h2><p>Možda je uklonjen ili više nije dio ove povijesti. Vrati se na popis treninga.</p></section></div>';
      return '<div class="view history">'+(vm.mode==='edit'?editView(vm):detailView(vm))+'</div>';
    }
    return '<div class="view history">'+listView(vm)+'</div>';
  }

  function readEdit(form,entry) {
    if(!form||typeof form.querySelectorAll!=='function'||!entry)return {ok:false,error:'Obrazac ili zapis više nije dostupan.'};
    const patch={},items=new Map(),arrayChanges=new Map();let load=null;
    const numeric=(raw,label,{integer=false,min=0,max=Infinity,optional=true}={})=>{
      if(raw===''){if(optional)return null;throw new Error('Upiši '+label.toLocaleLowerCase('hr-HR')+'.');}
      if(!/^(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(raw))throw new Error(label+': upiši valjan broj.');
      const value=Number(raw.replace(',','.'));
      if(!Number.isFinite(value)||value<min||value>max||(integer&&!Number.isInteger(value)))throw new Error(label+': '+(integer?'upiši cijeli broj':'upiši broj')+(max!==Infinity?' od '+min+' do '+max:' koji nije negativan')+'.');
      return value;
    };
    const setItem=(index,key,value)=>{if(!items.has(index))items.set(index,{index});items.get(index)[key]=value;};
    try {
      for(const input of form.querySelectorAll('input[data-history-meta], input[data-history-item], input[data-history-load]')) {
        const raw=String(input.value==null?'':input.value).trim(),initial=input.getAttribute('data-history-initial');
        if(raw===String(initial==null?(input.defaultValue||''):initial).trim())continue;
        const data=input.dataset;
        if(data.historyMeta) {
          const field=data.historyMeta;
          if(field==='name') {if(!raw||raw.length>200)throw new Error('Naziv treninga mora imati od 1 do 200 znakova.');if(raw!==entry.name)patch.name=raw;}
          else if(field==='at') {
            const parts=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/.exec(raw),d=new Date(raw);
            if(!parts||Number.isNaN(d.getTime())||d.getFullYear()!==+parts[1]||d.getMonth()!==+parts[2]-1||d.getDate()!==+parts[3]||d.getHours()!==+parts[4]||d.getMinutes()!==+parts[5]||d.getSeconds()!==+(parts[6]||0))throw new Error('Upiši valjan lokalni datum i vrijeme.');
            if(d.getTime()!==entry.at)patch.at=d.getTime();
          } else if(field==='secs') {const value=numeric(raw,'Trajanje',{max:2880});const secs=value===null?null:Math.round(value*60);if(secs!==entry.secs)patch.secs=secs;}
          else if(field==='srpe') {const value=numeric(raw,'Ocjena napora',{integer:true,min:0,max:10});if(value!==entry.srpe)patch.srpe=value;}
          continue;
        }
        if(data.historyItem!=null) {
          const index=Number(data.historyItem),item=array(entry.items)[index],field=data.historyField;
          if(!Number.isInteger(index)||index<0||!item)throw new Error('Vježba koju uređuješ više nije dostupna.');
          if(data.historySet!=null) {
            const pos=Number(data.historySet),key={reps:'repsList',rir:'rirList',sir:'sirList',kg:'kgList',sec:'secList'}[field];
            if(!key||!Number.isInteger(pos)||pos<0||pos>=1000)throw new Error('Serija koju uređuješ nije valjana.');
            const label={reps:'Ponavljanja',kg:'Teret serije',sec:'Vrijeme serije',rir:'RIR',sir:'Rezerva u sekundama'}[field];
            const value=numeric(raw,label,{integer:field==='reps',max:field==='sec'?86400:['reps','kg'].includes(field)?10000:40});
            const mapKey=index+':'+key;
            if(!arrayChanges.has(mapKey)){
              const values=own(item,key)?array(item[key]).slice():key==='repsList'?Array.from({length:rowsCount(item)},(_,i)=>rowReps(item,i)):[];
              while(values.length<rowsCount(item))values.push(null);
              arrayChanges.set(mapKey,{index,key,values});
            }
            const change=arrayChanges.get(mapKey);while(change.values.length<=pos)change.values.push(null);change.values[pos]=value;
          } else {
            if(!['setsDone','reps','kg','sec','lastReps'].includes(field))throw new Error('Nepoznato polje vježbe.');
            const label={setsDone:'Odrađene serije',reps:'Ponavljanja',kg:'Teret',sec:'Vrijeme po seriji',lastReps:'Ponavljanja zadnje serije'}[field];
            const value=numeric(raw,label,{integer:['setsDone','reps','lastReps'].includes(field),max:field==='setsDone'?number(item.sets)!=null?Math.min(1000,item.sets):1000:field==='sec'?86400:10000});
            if(field==='setsDone'||value!==item[field])setItem(index,field,value);
          }
          continue;
        }
        if(data.historyLoad) {
          if(entry.kind!=='field')throw new Error('Ovaj zapis nije trening na terenu.');
          const original=entry.load&&typeof entry.load==='object'?entry.load:{};
          if(!load)load={};
          if(data.historyLoad==='zones') {
            const pos=Number(data.historyZone);if(!Number.isInteger(pos)||pos<0||pos>3)throw new Error('Zona trčanja nije valjana.');
            const value=numeric(raw,'Metri u zoni',{optional:false});
            if(!load.zones)load.zones=array(original.zones).slice();load.zones[pos]=value;
          } else {
            const field=data.historyLoad;if(!['m','hsr','spr','min'].includes(field))throw new Error('Nepoznato terensko polje.');
            const value=numeric(raw,field==='min'?'Radno vrijeme':'Udaljenost');if(value!==original[field])load[field]=value;
          }
        }
      }
      for(const change of arrayChanges.values()) {
        if(JSON.stringify(change.values)!==JSON.stringify(entry.items[change.index][change.key]))setItem(change.index,change.key,change.values);
      }
      if(items.size)patch.items=Array.from(items.values()).sort((a,b)=>a.index-b.index);
      if(load&&Object.keys(load).length)patch.load=load;
      if(entry.kind==='team')Object.assign(patch,Team.readExtras(form,entry).patch);
      return {ok:true,patch};
    } catch(error) {return {ok:false,error:error.message||'Provjeri unesene podatke.'};}
  }
  const api={render,readEdit};root.TrainingHistory=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
