(function(root){
'use strict';
const copy = x => JSON.parse(JSON.stringify(x));
const num = (x,d=0) => Number.isFinite(Number(x)) ? Number(x) : d;
const clamp = (x,a,b) => Math.min(b,Math.max(a,num(x,a)));
const clean = o => { const r=copy(o||{}); ['id','fav','media','mediaType','updatedAt','_seedVersion'].forEach(k=>delete r[k]); return r; };
const same = (a,b) => JSON.stringify(clean(a))===JSON.stringify(clean(b));
const E = {};
E.version=2;
E.dateKey=(date=new Date())=>{const d=new Date(date);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
E.dayLabel=d=>new Date(d+'T12:00:00').toLocaleDateString('hr-HR',{weekday:'short',day:'numeric',month:'numeric'});
E.defaultProfile=()=>({season:'competition',matchDay:0,clubDays:[],barbellStep:2.5,dumbbells:[2.5,5,7.5,10,15,20],pitchLength:105,pitchWidth:68,mas:null,maxSpeed:null,returnMode:false,clinicianPlan:false});
E.migrate=function(saved,seed,legacy){
  const out=copy(saved||{}); const oldBase=out.seedBaseline||legacy||{};
  out.v=2;out.log=Array.isArray(out.log)?out.log:[];out.plan=Array.isArray(out.plan)?out.plan:[];out.profile=Object.assign(E.defaultProfile(),out.profile||{});out._deleted=Array.isArray(out._deleted)?out._deleted:[];
  ['exercises','protocols','field'].forEach(coll=>{
    const original=out[coll]||{};const merged={};
    Object.keys(original).forEach(id=>{merged[id]=original[id];});
    Object.keys(seed[coll]||{}).forEach(id=>{
      if(out._deleted.includes(coll+'/'+id))return;
      const current=original[id], fresh=seed[coll][id], previous=(oldBase[coll]||{})[id];
      if(!current)merged[id]=copy(fresh);
      else if(previous){
        const updated=Object.assign({},copy(fresh),copy(current));
        Object.keys(fresh).forEach(k=>{
          if(['fav','media','mediaType','id'].includes(k))return;
          if(current[k]===undefined || JSON.stringify(current[k])===JSON.stringify(previous[k]))updated[k]=copy(fresh[k]);
        });
        merged[id]=updated;
      }else merged[id]=Object.assign({},copy(fresh),copy(current));
    });out[coll]=merged;
  });
  out.seedBaseline={version:seed.version||2,exercises:copy(seed.exercises||{}),protocols:copy(seed.protocols||{}),field:copy(seed.field||{})};
  return out;
};
E.validateBackup=function(d){
  const object=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
  const arrays=(o,keys)=>keys.forEach(k=>{if(o[k]!=null&&!Array.isArray(o[k]))throw Error('Neispravan popis: '+k);});
  if(!d||typeof d!=='object'||Array.isArray(d)||!d.exercises||!d.protocols)throw Error('Nedostaju vježbe ili protokoli.');
  ['exercises','protocols','field'].forEach(k=>{if(d[k]&&(typeof d[k]!=='object'||Array.isArray(d[k])))throw Error('Neispravan odjeljak: '+k);});
  if(Object.keys(d.exercises).length>3000||Object.keys(d.protocols).length>1000)throw Error('Kopija sadrži previše zapisa.');
  ['exercises','protocols','field'].forEach(k=>Object.keys(d[k]||{}).forEach(id=>{if(['__proto__','constructor','prototype'].includes(id))throw Error('Neispravan identifikator.');}));
  Object.entries(d.exercises).forEach(([id,e])=>{if(!object(e)||typeof e.name!=='string'||!e.name.trim()||e.name.length>250)throw Error('Neispravna vježba: '+id);arrays(e,['steps','zones','sourceIds','regressionIds','progressionIds','stopRules','equipmentKeys']);});
  Object.entries(d.protocols).forEach(([id,p])=>{if(!p||typeof p.name!=='string'||!Array.isArray(p.items))throw Error('Neispravan protokol: '+id);p.items.forEach(it=>{if(!d.exercises[it.exId])throw Error('Protokol upućuje na nepostojeću vježbu.');if(num(it.sets,1)<1||num(it.sets,1)>30||num(it.rest)<0||num(it.rest)>1800)throw Error('Neispravno doziranje.');});});
  Object.entries(d.field||{}).forEach(([id,f])=>{if(!object(f)||typeof f.name_hr!=='string'||!Array.isArray(f.blocks)||f.blocks.some(b=>!object(b)))throw Error('Neispravan terenski trening: '+id);arrays(f,['ambiguities','requires_configuration']);f.blocks.forEach(b=>arrays(b,['target_time_s','routes']));});
  arrays(d,['log','plan']);
  (d.log||[]).forEach(l=>{if(!object(l)||l.records!=null&&(!object(l.records)||Object.values(l.records).some(r=>!object(r))))throw Error('Neispravna povijest.');});
  (d.plan||[]).forEach(p=>{if(!object(p)||typeof p.date!=='string'||typeof p.kind!=='string')throw Error('Neispravan plan.');});
  if(d.profile!=null){if(!object(d.profile))throw Error('Neispravan profil.');arrays(d.profile,['dumbbells','clubDays']);}
  if(d.mediaBlobs!=null&&!object(d.mediaBlobs))throw Error('Neispravan odjeljak snimki.');
  return {exercises:Object.keys(d.exercises).length,protocols:Object.keys(d.protocols).length,sessions:(d.log||[]).length,media:Object.keys(d.mediaBlobs||{}).length};
};
E.itemsToSteps=function(items,exercises,settings={}){
  const ss=settings.switchSec??10,ts=settings.transSec??15;
  const steps=[{kind:'prep',dur:5,g:0,title:'Pripremi se'}];
  items.forEach((it,g)=>{
    const e=exercises[it.exId]||{id:it.exId,name:'Vježba',steps:[]};const base={g,e,it};
    if(g>0&&ts)steps.push({...base,kind:'rest',dur:ts,label:'Prijelaz',trans:true});
    const sets=clamp(it.sets||1,1,30);
    for(let s=1;s<=sets;s++){
      const sides=it.sides?['Lijeva','Desna']:['Obje'];
      sides.forEach((side,j)=>{
        if(j&&ss)steps.push({...base,kind:'switch',dur:ss,set:s,side:'Promjena strane'});
        steps.push({...base,kind:it.measure==='time'?'work':'manual',dur:it.measure==='time'?clamp(it.sec||30,1,1800):0,set:s,side:it.sides?side+' strana':'',sideKey:side,recordKey:`${g}:${s}:${side}`,plannedReps:it.reps||0});
      });
      if(s<sets&&it.rest>0)steps.push({...base,kind:'rest',dur:it.rest,set:s,label:'Odmor'});
    }
  });return steps;
};
E.fieldSteps=function(f,profile={}){
  const steps=[{kind:'prep',dur:10,g:0,title:'Pripremi se'}];
  (f.blocks||[]).forEach((b,g,blocks)=>{
    const sets=clamp(b.sets||1,1,20),reps=clamp(b.reps||1,1,100);
    for(let s=1;s<=sets;s++)for(let r=1;r<=reps;r++){
      const distance=E.distance(b,profile);
      const manual=!!b.distanceBased;
      const base={g,b:{...b,distance_m:distance||b.distance_m},set:s,rep:r,sets,reps};
      const routeIndex=b.routes?(r-1)%b.routes.length:null;
      steps.push({...base,kind:manual?'distance':'work',dur:manual?0:(b.work_s||30),routeIndex,recordKey:`f:${g}:${s}:${r}`});
      const lastRep=r===reps,lastSet=s===sets,lastBlock=g===blocks.length-1;
      // Active recovery belongs to every complete MAS cycle, including its final repetition.
      if(b.activeRecovery&&b.rest_s>0)steps.push({...base,kind:'active',dur:b.rest_s,label:b.rest_type_hr||'Aktivni oporavak',distance_m:profile.mas?Math.round(profile.mas*.7*b.rest_s):null});
      if(!b.activeRecovery&&b.rest_s>0&&(!lastRep||(lastRep&&lastSet&&lastBlock&&b.restAfterFinal)))steps.push({...base,kind:'rest',dur:b.rest_s,label:b.rest_type_hr||'Odmor'});
      if(lastRep&&!lastSet&&(b.set_rest_s||b.rest_s))steps.push({...base,kind:'rest',dur:b.set_rest_s||b.rest_s,label:'Odmor između serija'});
      if(lastRep&&lastSet&&!lastBlock&&(b.block_rest_s??b.rest_s)>0)steps.push({...base,kind:'rest',dur:b.block_rest_s??b.rest_s,label:'Odmor između blokova'});
    }
  });return steps;
};

E.normalizeField=function(f,profile={}){
 const out=copy(f);const p=profile,L=p.pitchLength||105;
 const calc={'L+2*centre_circle_diameter':L+36.6,'16.5':16.5,L, 'L/2':L/2,'L-33':L-33,'4*(L-33)':4*(L-33),'5*L-2*16.5':5*L-33,'2*(L-16.5)':2*(L-16.5),'L+33':L+33,'2*L':2*L};
 out.blocks=(out.blocks||[]).map(b=>{const n={...b};if(b.distance_formula&&calc[b.distance_formula]!=null)n.distance_m=Math.round(calc[b.distance_formula]*10)/10;if(b.work_s==null){n.distanceBased=true;n.work_s=0;}if(b.rest_formula){n.dynamicRest=true;n.rest_s=60;}if(f.id==='izlozenost-maksimalnoj-brzini'&&f.acceleration_m&&f.flying_m)n.distance_m=f.acceleration_m+f.flying_m;if(b.masFactor&&p.mas)n.distance_m=Math.round(p.mas*b.masFactor*b.work_s);return n;});
 if(out.circuit_reps){const expanded=[];for(let s=0;s<(out.circuit_sets||1);s++)for(let r=0;r<out.circuit_reps;r++)out.blocks.forEach((b,i)=>{const n={...b,sourceBlock:i,label_hr:'S'+(s+1)+' · krug '+(r+1)+' · '+b.label_hr};if(i===out.blocks.length-1&&r===out.circuit_reps-1&&s<(out.circuit_sets||1)-1)n.block_rest_s=out.circuit_set_rest_s??b.rest_s;expanded.push(n);});out.blocks=expanded;}
 return out;
};
E.distance=(b,p={})=>b.masFactor&&p.mas?Math.round(p.mas*b.masFactor*(b.work_s||15)):(b.pitchFormula==='box4'?4*((p.pitchLength||105)-33):b.pitchFormula==='length10'?10*(p.pitchLength||105):b.distance_m||null);
E.estimate=function(items,exercises,settings={}){
  const steps=E.itemsToSteps(items,exercises,settings);
  return Math.round(steps.reduce((a,s)=>a+(s.dur||(s.kind==='manual'?(s.it.reps||10)*(num(s.e.repSeconds,3)):0)),0));
};
E.fieldDuration=function(f,p){const st=E.fieldSteps(f,p);return {seconds:st.reduce((a,s)=>a+(s.dur||0),0),manual:st.some(s=>s.kind==='distance'),warmupIncluded:false};};
E.sessionSummary=function(steps,records){
  const work=steps.filter(s=>s.recordKey),done=work.filter(s=>records[s.recordKey]?.status==='done'),skipped=work.filter(s=>records[s.recordKey]?.status==='skipped');
  return {total:work.length,done:done.length,skipped:skipped.length,status:done.length===work.length&&work.length?'complete':done.length?'partial':'not-done'};
};
E.exerciseHistory=function(exId,logs){
  return (logs||[]).filter(l=>l.records&&Object.values(l.records).some(r=>r.exId===exId)).sort((a,b)=>b.at-a.at);
};
E.progression=function(e,it,logs,profile={}){
  const sessions=E.exerciseHistory(e.id,logs).slice(0,2);
  const base={action:'hold',label:'Zadrži dozu',reason:'Za prijedlog su potrebna dva zabilježena treninga i reakcija sljedeći dan.',next:copy(it),source:'acsm-progression'};
  if(!sessions.length)return base;
  const newest=sessions[0];
  const rows=Object.values(newest.records||{}).filter(r=>r.exId===e.id);
  const pain=Math.max(num(newest.pain),...rows.map(r=>num(r.pain)));
  if(pain>0||newest.nextDay==='worse'||newest.quality==='poor'||rows.some(r=>r.quality===false)){
    return {...base,action:'review',label:'Prilagodi prije napredovanja',reason:'Zabilježena je bol, lošija kontrola ili pogoršanje sljedeći dan. Smanji zahtjevnost i uskladi bolne pokrete sa stručnjakom; aplikacija ne određuje medicinsku fazu.',alternatives:e.regressionIds||[]};
  }
  if(profile.returnMode||e.cat==='Rehab')return {...base,label:'Prema dogovorenom planu',reason:'Za rehabilitacijske vježbe napredovanje potvrdi prema individualnim kriterijima. Zapisi su pomoć pri toj odluci.',alternatives:e.progressionIds||[]};
  if(sessions.length<2||sessions.some(l=>!['same','better'].includes(l.nextDay)))return {...base,reason:'Prvo potvrdi reakciju sljedeći dan nakon dva treninga.'};
  const rigType=['trx','band','band-assistance'].includes(e.loadRule?.type);
  const setupRows=sessions.flatMap(l=>Object.values(l.records||{}).filter(r=>r.exId===e.id));
  if(rigType&&(!setupRows.every(r=>r.setup?.trim())||new Set(setupRows.map(r=>r.setup.trim().toLowerCase())).size!==1))return {...base,reason:'Za usporedbu zapiši jednak postav TRX-a ili gume u oba treninga. Kut, duljina i otpor mijenjaju zahtjevnost.'};
  const qualifying=sessions.every(l=>{
    const recs=Object.values(l.records||{}).filter(r=>r.exId===e.id);
    const expected=num(it.sets,1)*(it.sides?2:1);
    return num(l.pain)===0&&l.quality==='good'&&recs.length>=expected&&recs.every(r=>r.status==='done'&&r.quality!==false&&num(r.pain)===0&&(it.measure==='time'?num(r.seconds)>=num(it.sec):(r.rir!=null&&num(r.rir,-1)>=num(e.rir,2)&&num(r.kg)===num(it.kg)&&num(r.reps)>=num(it.reps))));
  });
  if(!qualifying)return {...base,reason:'Zadrži dozu dok obje strane i sve serije ne budu odrađene kontrolirano, bez boli i uz zadanu rezervu ponavljanja.'};
  if(e.cat==='Eksplozivnost'||e.pattern==='plyometric'||e.pattern==='power')return {...base,label:'Kvaliteta prije količine',reason:'Povećanje skokova ili brzine potvrdi zasebno. Prati doskok, brzinu i oporavak; umor nije cilj ovog bloka.',alternatives:e.progressionIds||[]};
  const upper=num(e.repsMax,it.reps||10),lower=num(e.repsMin,it.reps||6);
  if(it.measure==='time'){
    const cap=num(e.timeMax??e.loadRule?.maxSeconds,e.sec||30),step=num(e.timeStep,5);
    if(it.sec<cap)return {...base,action:'time',label:'Dodaj '+Math.min(step,cap-it.sec)+' s',reason:'Dvije uspješne izloženosti i uredna reakcija. Mijenja se samo trajanje.',next:{...it,sec:Math.min(cap,it.sec+step)}};
    return {...base,label:'Razmotri sljedeću varijantu',reason:'Dosegnuto je ciljano trajanje. Provjeri kriterije sljedeće varijante.',alternatives:e.progressionIds||[]};
  }
  if(it.reps<upper)return {...base,action:'reps',label:'Dodaj jedno ponavljanje',reason:'Mijenjaj samo broj ponavljanja; serije i opterećenje ostaju zadani.',next:{...it,reps:it.reps+1}};
  const type=e.loadRule?.type||'bodyweight';
  let nextLoad=0;
  if(type==='dumbbell'||type==='dumbbells')nextLoad=(profile.dumbbells||[2.5,5,7.5,10,15,20]).find(x=>x>num(it.kg))||0;
  else if(type==='barbell'||type==='landmine'||type==='external')nextLoad=num(it.kg)+num(profile.barbellStep,e.loadRule?.step||2.5);
  if(num(it.kg)>0&&nextLoad>num(it.kg)&&nextLoad/it.kg<=1.10)return {...base,action:'load',label:'Razmotri '+nextLoad+' kg',reason:'Gornji raspon ponavljanja je ponovljen. Provjeri dostupno opterećenje; nakon povećanja vrati se na donji raspon.',next:{...it,kg:nextLoad,reps:lower}};
  return {...base,label:'Provjeri sljedeću varijantu',reason:num(it.kg)===0?'Prvo odaberi i zabilježi stvarno opterećenje ili provjeri kriterije teže varijante.':'Sljedeći raspoloživ uteg predstavlja velik skok ili je dosegnut raspon. Zadrži dozu ili dogovori drugi korak.',alternatives:e.progressionIds||[]};
};
E.weekLoad=function(logs,start){
  const a=new Date(start+'T00:00:00').getTime(),b=a+7*864e5;
  const rows=(logs||[]).filter(l=>l.at>=a&&l.at<b);
  return {sessions:rows.length,minutes:Math.round(rows.reduce((n,l)=>n+num(l.secs),0)/60),load:Math.round(rows.reduce((n,l)=>n+num(l.secs)/60*num(l.rpe),0)),sprintMetres:rows.reduce((n,l)=>n+num(l.sprintMetres),0),rows};
};
E.planWarnings=function(plan,protocols,field,date,logs){
  const events=plan.filter(x=>x.date===date);let out=[];
  const exIds=[];events.filter(x=>x.kind==='protocol').forEach(x=>(protocols[x.refId]?.items||[]).forEach(it=>exIds.push(it.exId)));
  const duplicates=[...new Set(exIds.filter((id,i)=>exIds.indexOf(id)!==i))];
  if(duplicates.length)out.push('Ponavljaju se vježbe: '+duplicates.map(id=>id.replaceAll('-',' ')).join(', ')+'. Provjeri ukupne serije.');
  const hard=events.filter(x=>x.intensity==='high'||x.kind==='match'||(x.kind==='field'&&field[x.refId]?.intensityLevel==='high'));
  if(hard.length>1)out.push('Više zahtjevnih treninga istog dana. Uračunaj i klupski trening.');
  const next=new Date(date+'T12:00:00');next.setDate(next.getDate()+1);
  if(hard.length&&plan.some(x=>x.date===E.dateKey(next)&&x.kind==='match'))out.push('Sutra je utakmica. Provjeri opravdanost današnjeg velikog opterećenja.');
  const yesterday=new Date(date+'T12:00:00');yesterday.setDate(yesterday.getDate()-1);
  if(hard.length&&(logs||[]).some(l=>E.dateKey(l.at)===E.dateKey(yesterday)&&num(l.rpe)>=8))out.push('Jučer je zabilježen vrlo zahtjevan trening. Prvo procijeni oporavak.');
  return out;
};
if(typeof module!=='undefined'&&module.exports)module.exports=E;
root.TrainingEngine=E;
})(typeof window!=='undefined'?window:globalThis);
