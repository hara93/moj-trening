/* Manual club/match diary. Explicit reported session data only; no exercise,
   distance, muscle attribution or calendar prescriptions are inferred. */
(function(root,factory){
  'use strict';
  var load=typeof module==='object'&&module.exports?require('./training-load.js'):root.TrainingLoad;
  var api=factory(load);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.TeamDiary=api;
})(typeof window!=='undefined'?window:globalThis,function(Load){
  'use strict';
  const has=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
  const plain=o=>!!o&&typeof o==='object'&&!Array.isArray(o);
  const finite=n=>typeof n==='number'&&Number.isFinite(n);
  const clone=o=>JSON.parse(JSON.stringify(o));
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const contents=Object.freeze([
    {id:'technical',label:'Tehnika'},{id:'tactical',label:'Taktika'},
    {id:'smallSided',label:'Male igre'},{id:'conditioning',label:'Kondicija'},
    {id:'sprints',label:'Sprintovi'},{id:'agility',label:'Promjene smjera'},
    {id:'strength',label:'Snaga'},{id:'recovery',label:'Oporavak'}
  ].map(Object.freeze));
  const label=type=>type==='match'?'Utakmica':'Momčadski trening';
  const contentLabel=id=>{const c=contents.find(c=>c.id===id);return c?c.label:'Sačuvana oznaka: '+String(id);};
  const localInput=at=>{
    const d=new Date(at);if(!finite(at)||Number.isNaN(d.getTime()))return '';
    const p=(n,len=2)=>String(n).padStart(len,'0');
    return p(d.getFullYear(),4)+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+'T'+p(d.getHours())+':'+p(d.getMinutes());
  };
  function parseDate(raw){
    const m=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(raw),d=new Date(raw);
    if(!m||Number.isNaN(d.getTime())||d.getFullYear()!==+m[1]||d.getMonth()!==+m[2]-1||d.getDate()!==+m[3]||d.getHours()!==+m[4]||d.getMinutes()!==+m[5])throw Error('Upiši valjan lokalni datum i vrijeme.');
    return d.getTime();
  }
  function number(raw,label,optional){
    raw=String(raw==null?'':raw).trim();
    if(!raw){if(optional)return null;throw Error('Upiši '+label.toLocaleLowerCase('hr-HR')+'.');}
    if(!/^(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(raw))throw Error(label+': upiši valjan broj.');
    const n=Number(raw.replace(',','.'));if(!Number.isFinite(n))throw Error(label+': upiši valjan broj.');return n;
  }
  function validate(values,original,now){
    const errors=[],changes=[],out=original?clone(original):{};
    const error=(field,message)=>errors.push({field,message});
    if(!plain(values))return {ok:false,errors:[{field:'entry',message:'Podaci zapisa nisu ispravni.'}]};
    const allowed=['name','at','secs','srpe','teamType','teamContent','notes'];
    for(const k of Object.keys(values))if(!allowed.includes(k))error(k,'Nepodržano polje momčadskog zapisa.');
    const put=(k,v)=>{if(v===null){if(has(out,k)){delete out[k];changes.push(k);}}else if(JSON.stringify(out[k])!==JSON.stringify(v)){out[k]=clone(v);changes.push(k);}};
    if(has(values,'teamType')){if(!['training','match'].includes(values.teamType))error('teamType','Odaberi momčadski trening ili utakmicu.');else put('teamType',values.teamType);}
    if(has(values,'name')){if(typeof values.name!=='string'||!values.name.trim()||values.name.trim().length>200)error('name','Naziv mora imati od 1 do 200 znakova.');else put('name',values.name.trim());}
    if(has(values,'at')){if(!finite(values.at)||values.at<0||Number.isNaN(new Date(values.at).getTime())||values.at>now)error('at','Zapis odrađenog rada mora imati sadašnji ili prošli datum i vrijeme.');else put('at',values.at);}
    if(has(values,'secs')){if(!Number.isInteger(values.secs)||values.secs<1||values.secs>172800)error('secs','Upiši stvarno trajanje veće od nule, do 48 sati.');else put('secs',values.secs);}
    if(has(values,'srpe')){if(values.srpe!==null&&(!Number.isInteger(values.srpe)||values.srpe<0||values.srpe>10))error('srpe','Ocjena napora mora biti cijeli broj od 0 do 10 ili prazna.');else put('srpe',values.srpe);}
    if(has(values,'notes')){if(values.notes!==null&&(typeof values.notes!=='string'||values.notes.trim().length>2000))error('notes','Bilješka može imati najviše 2000 znakova.');else put('notes',values.notes===null||!values.notes.trim()?null:values.notes.trim());}
    if(has(values,'teamContent')){
      const a=values.teamContent,old=original&&Array.isArray(original.teamContent)?original.teamContent:[];
      if(!Array.isArray(a)||a.length>32||a.some(id=>typeof id!=='string'||!id||id.length>100||id in Object.prototype||!contents.some(c=>c.id===id)&&!old.includes(id)))error('teamContent','Provjeri označeni sadržaj treninga.');
      else put('teamContent',[...new Set(a)]);
    }
    if(errors.length)return {ok:false,errors};
    return {ok:true,entry:out,changes,warnings:[],loadStatus:sessionAU(out)===null?'missing':'subjective'};
  }
  function create(values,options){
    options=options||{};const now=finite(options.now)?options.now:Date.now();
    if(!plain(values))return validate(values,null,now);
    const v={...values};if(typeof v.name==='string'&&!v.name.trim())v.name=label(v.teamType);
    for(const field of ['teamType','name','at','secs'])if(!has(v,field))return {ok:false,errors:[{field,message:'Nedostaju obvezni podaci momčadskog zapisa.'}]};
    const result=validate(v,null,now);if(!result.ok)return result;
    if(typeof options.historyId!=='string'||!/^[a-zA-Z0-9_-]{1,128}$/.test(options.historyId))return {ok:false,errors:[{field:'historyId',message:'Identitet zapisa nije dostupan.'}]};
    return {...result,entry:{...result.entry,kind:'team',historyId:options.historyId,source:'manual',createdAt:now}};
  }
  function edit(entry,patch,options){
    if(!plain(entry)||entry.kind!=='team')return {ok:false,errors:[{field:'kind',message:'Ovo nije momčadski zapis.'}]};
    return validate(patch,entry,options&&finite(options.now)?options.now:Date.now());
  }
  function sessionAU(entry){
    return Load.sessionAU(entry);
  }
  function extras(entry){
    entry=entry||{};const saved=Array.isArray(entry.teamContent)?entry.teamContent:[];
    const choices=contents.concat(saved.filter(id=>typeof id==='string'&&!contents.some(c=>c.id===id)).map(id=>({id,label:contentLabel(id)})));
    return '<fieldset class="td-extra"><legend>Vrsta i sadržaj</legend><label class="td-field" for="team-type"><span>Vrsta zapisa</span><select id="team-type" data-team-field="teamType"><option value="training"'+(entry.teamType!=='match'?' selected':'')+'>Momčadski trening</option><option value="match"'+(entry.teamType==='match'?' selected':'')+'>Utakmica</option></select></label><fieldset class="td-content"><legend>Što si radio? <span>Po želji</span></legend><div>'+choices.map(c=>'<label><input type="checkbox" name="team-content" value="'+esc(c.id)+'"'+(saved.includes(c.id)?' checked':'')+'><span>'+esc(c.label)+'</span></label>').join('')+'</div><p>Označi sadržaj koji si odradio. Za nepoznati sadržaj ostavi prazno.</p></fieldset><label class="td-field" for="team-notes"><span>Bilješka <small>Po želji</small></span><textarea id="team-notes" data-team-field="notes" maxlength="2000" rows="3" placeholder="Što želiš zapamtiti o sesiji?">'+esc(entry.notes||'')+'</textarea></label></fieldset>';
  }
  function readExtras(form,entry){
    const patch={},type=form.querySelector('#team-type'),notes=form.querySelector('#team-notes');
    if(type&&type.value!==(entry&&entry.teamType||'training'))patch.teamType=type.value;
    const selected=Array.from(form.querySelectorAll('[name="team-content"]')).filter(i=>i.checked).map(i=>i.value);
    const before=entry&&Array.isArray(entry.teamContent)?entry.teamContent:[];
    if(selected.length!==before.length||selected.some(id=>!before.includes(id)))patch.teamContent=selected;
    if(notes&&notes.value!==String(entry&&entry.notes||''))patch.notes=notes.value.trim()||null;
    return {ok:true,patch};
  }
  function readNew(form){
    try{
      if(!form||typeof form.querySelector!=='function')throw Error('Obrazac više nije dostupan.');
      const value=id=>{const el=form.querySelector('#team-'+id);if(!el)throw Error('Obrazac nije potpun.');return el.value;};
      const minutes=number(value('minutes'),'Stvarno trajanje',false),srpe=number(value('srpe'),'Ocjena napora',true);
      const values={name:value('title').trim(),at:parseDate(value('at')),secs:Math.round(minutes*60),teamType:value('type'),teamContent:Array.from(form.querySelectorAll('[name="team-content"]')).filter(i=>i.checked).map(i=>i.value)};
      if(srpe!==null)values.srpe=srpe;const notes=value('notes').trim();if(notes)values.notes=notes;
      return {ok:true,values};
    }catch(e){return {ok:false,error:e.message||'Provjeri unesene podatke.'};}
  }
  function details(entry){
    const content=Array.isArray(entry.teamContent)?entry.teamContent:[];
    return '<section class="hy-card td-saved"><h2>Sadržaj sesije</h2>'+(content.length?'<ul>'+content.map(id=>'<li>'+esc(contentLabel(id))+'</li>').join('')+'</ul>':'<p class="hy-copy">Sadržaj nije označen.</p>')+(entry.notes?'<h3>Bilješka</h3><p class="td-notes">'+esc(entry.notes)+'</p>':'')+'<p class="hy-footnote">Ručni zapis odrađenog rada. Mišićne serije i izmjerene udaljenosti za ovu sesiju nisu zabilježene.</p></section>';
  }
  function render(vm){
    vm=vm||{};const now=finite(vm.now)?vm.now:Date.now();let at=localInput(now);
    if(typeof vm.date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(vm.date))at=vm.date+at.slice(10);
    const entry={teamType:vm.type==='match'?'match':'training'};
    return '<div class="view team-entry"><header class="td-header"><button type="button" class="td-back" data-a="teamCancel" aria-label="Natrag">‹</button><span>MOJ TRENING</span></header><h1>Zabilježi klub ili utakmicu</h1><p class="td-intro">Dodaj ono što si odradio. Zapis će biti u tvojoj povijesti treninga.</p><form id="team-entry-form" novalidate><div id="team-entry-error" class="td-error" role="alert" aria-live="polite">'+esc(vm.error||'')+'</div><fieldset class="td-card"><legend>Odrađena sesija</legend><label class="td-field" for="team-title"><span>Naziv <small>Po želji</small></span><input id="team-title" maxlength="200" autocomplete="off" placeholder="Npr. Večernji trening s klubom"></label><label class="td-field" for="team-at"><span>Datum i vrijeme završetka</span><input id="team-at" type="datetime-local" value="'+esc(at)+'"><small>Lokalno vrijeme na ovom uređaju; za sesiju preko ponoći odaberi dan završetka.</small></label><div class="td-grid"><label class="td-field" for="team-minutes"><span>Stvarno trajanje (min)</span><input id="team-minutes" type="text" inputmode="decimal" autocomplete="off" placeholder="Upiši minute"></label><label class="td-field" for="team-srpe"><span>Napor (0–10)</span><input id="team-srpe" type="text" inputmode="numeric" autocomplete="off" placeholder="Nije ocijenjeno"></label></div><p class="td-help">Za utakmicu upiši svoje odigrane minute. Napor ocijeni za cijelu sesiju: 0 je bez napora, 10 je maksimalno. Ocjenu možeš ostaviti praznom.</p></fieldset>'+extras(entry)+'<p class="td-help td-calendar-note">Vrsta „Utakmica” označava odigranu utakmicu. Budući raspored utakmica uređuješ u kalendaru.</p><div class="td-actions"><button type="button" data-a="teamCancel">Odustani</button><button type="button" class="td-primary" data-a="teamSave">Spremi zapis</button></div></form></div>';
  }
  return Object.freeze({version:1,contents,label,contentLabel,create,edit,sessionAU,render,details,extras,readExtras,readNew});
});
