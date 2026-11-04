/* HistoryModel: atomic corrections to recorded workouts. No current library,
   MAS, exercise classification, progression updates or storage access. */
(function(root,factory){
  'use strict';
  var mw = typeof module === 'object' && module.exports ? require('./muscle-work.js') : root.MuscleWork;
  var api = factory(mw);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.HistoryModel = api;
})(typeof window !== 'undefined' ? window : null,function(M){
  'use strict';
  var has = function(o,k){return Object.prototype.hasOwnProperty.call(o,k);};
  var plain = function(o){return !!o && typeof o === 'object' && !Array.isArray(o);};
  var finite = function(n){return typeof n === 'number' && Number.isFinite(n);};
  var int = function(n,lo,hi){return Number.isInteger(n) && n >= lo && n <= hi;};
  var equal = function(a,b){return JSON.stringify(a) === JSON.stringify(b);};
  var clone = function(o){return JSON.parse(JSON.stringify(o));};
  var round = function(n){return Math.round(n * 10) / 10;};
  function freeze(o){if(o && typeof o === 'object' && !Object.isFrozen(o)){Object.keys(o).forEach(function(k){freeze(o[k]);});Object.freeze(o);}return o;}
  // Recorded set positions include an attempted failed last set. Rep totals must
  // keep that position; work-set totals omit it when it contained zero reps.
  function recordedSetSlots(x){
    if (!plain(x) || x.historySetsUnknown === true) return null;
    if (x.skipped === true) return 0;
    var planned = int(x.sets,1,1000) ? x.sets : null;
    if (has(x,'setsDone')) return int(x.setsDone,0,1000) && (planned === null || x.setsDone <= planned) ? x.setsDone : null;
    if (planned !== null && (x.done === true || (x.done === false && finite(x.lastReps) && x.lastReps >= 0))) return planned;
    return null;
  }
  function rowValue(x, key, index) {
    var values = x[key+'List'];
    var value = Array.isArray(values) && index < values.length ? values[index] : x[key];
    return finite(value) && value >= 0 ? value : null;
  }
  function recordedRows(x, assumePlanned) {
    var n = recordedSetSlots(x);
    if (n === null && assumePlanned && x && !x.historySetsUnknown && !has(x,'setsDone') && x.done == null && int(x.sets,1,1000)) n=x.sets;
    if (n === null) return null;
    return Array.from({length:n},function(_,i) {
      var failed = x.done === false && i === n-1 && finite(x.lastReps);
      var sides = Array.isArray(x.sideCounts) && i<x.sideCounts.length ? x.sideCounts[i] : x.sides?2:1;
      return { number:Array.isArray(x.setNumbers)?x.setNumbers[i]:i+1,
        sides:int(sides,1,x.sides?2:1)?sides:null, kg:rowValue(x,'kg',i),
        reps:x.historyRepsUnknown?null:failed?x.lastReps:rowValue(x,'reps',i), sec:rowValue(x,'sec',i),
        failed:failed, rir:failed?0:Array.isArray(x.rirList)?x.rirList[i]:null, sir:Array.isArray(x.sirList)?x.sirList[i]:null };
    });
  }
  function performedSets(x) {
    var rows=recordedRows(x); if(!rows || rows.some(r=>r.sides===null))return null;
    return rows.filter(r=>r.sides===(x.sides?2:1) && !(r.failed && r.reps===0)).length;
  }
  function repetitionTotal(x){
    if(x && x.historyRepsUnknown===true)return null;
    var rows=recordedRows(x); if(!rows)return null;if(!rows.length)return 0;
    if(x.measure==='time'||rows.some(r=>r.reps===null||r.sides===null))return null;
    return rows.reduce((sum,r)=>sum+r.reps*r.sides,0);
  }
  function timeTotal(x){
    if(!x||x.measure!=='time')return null;
    var rows=recordedRows(x);if(!rows||rows.some(r=>r.sec===null||r.sides===null))return null;
    return rows.reduce((sum,r)=>sum+r.sec*r.sides,0);
  }
  function fieldSummary(entry){
    var l=plain(entry) && plain(entry.load)?entry.load:null, out={m:null,hsr:null,spr:null,min:null,zones:null,recorded:!!l,complete:false};
    ['m','hsr','spr','min'].forEach(function(k){if(l && finite(l[k]) && l[k]>=0)out[k]=l[k];});
    if(l && Array.isArray(l.zones) && l.zones.length===4 && l.zones.every(function(n){return finite(n)&&n>=0;}))out.zones=l.zones.slice();
    out.complete=['m','hsr','spr','min'].every(function(k){return out[k]!==null;});
    return freeze(out);
  }
  function effortStatus(entry){return entry && entry.load2Status==='needsProfile'?'needsProfile':entry && plain(entry.load2)?'recorded':'missing';}
  function sessionAU(entry){return entry && finite(entry.srpe) && entry.srpe>=1 && entry.srpe<=10 && finite(entry.secs) && entry.secs>=0 ? entry.srpe*Math.round(round(entry.secs/60)) : null;}
  function failure(errors){return freeze({ok:false,errors:errors});}
  function transaction(entry,patch,kind){
    var errors=[],changes=[],warnings=[];
    function error(field,message){errors.push({field:field,message:message});}
    if(!plain(entry)||!plain(patch))return failure([{field:'entry',message:'Zapis ili promjene nisu ispravni.'}]);
    if(kind==='field'?entry.kind!=='field':entry.kind!=null && entry.kind!=='protocol' && entry.kind!=='exercise')return failure([{field:'kind',message:'Ova vrsta zapisa ne podržava uređivanje treninga.'}]);
    var out;try{out=clone(entry);}catch(e){return failure([{field:'entry',message:'Zapis nije moguće pročitati.'}]);}
    var allowed=['name','at','secs','srpe',kind==='field'?'load':'items'];
    Object.keys(patch).forEach(function(k){if(allowed.indexOf(k)===-1)error(k,'Nepodržano polje promjene.');});
    function put(object,key,value,path){
      var before=object[key];
      if(value===null){if(has(object,key)){delete object[key];changes.push(path);}}
      else if(!equal(before,value)){object[key]=clone(value);changes.push(path);}
    }
    if(has(patch,'name')){
      if(typeof patch.name!=='string'||!patch.name.trim()||patch.name.trim().length>200)error('name','Upiši naziv treninga do 200 znakova.');
      else put(out,'name',patch.name.trim(),'name');
    }
    if(has(patch,'at')){
      if(!finite(patch.at)||patch.at<0||!Number.isFinite(new Date(patch.at).getTime()))error('at','Odaberi ispravan datum i vrijeme.');
      else put(out,'at',patch.at,'at');
    }
    if(has(patch,'secs')){
      if(patch.secs!==null && !int(patch.secs,0,172800))error('secs','Trajanje mora biti od 0 do 48 sati.');
      else put(out,'secs',patch.secs,'secs');
    }
    if(has(patch,'srpe')){
      if(patch.srpe!==null && !int(patch.srpe,1,10))error('srpe','Težinu treninga odaberi od 1 do 10 ili ostavi prazno.');
      else put(out,'srpe',patch.srpe,'srpe');
    }
    var doseChanged=false,fieldChanged=false;
    if(has(patch,'items')){
      if(!Array.isArray(patch.items)||!Array.isArray(out.items))error('items','Detalji vježbi za ovaj zapis nisu sačuvani.');
      else {
        var seen={};
        patch.items.forEach(function(edit){
          if(!plain(edit)||!int(edit.index,0,out.items.length-1)||seen[edit.index]){error('items','Odabir vježbe nije ispravan ili je ponovljen.');return;}
          seen[edit.index]=true;
          var index=edit.index,x=out.items[index],base='items.'+index,actualKeys=['sets','setsDone','done','skipped','lastReps'];
          if(!plain(x)){error(base,'Spremljena vježba nije ispravna.');return;}
          var keys=['index','sets','setsDone','reps','kg','sec','done','skipped','lastReps','repsList','kgList','secList','rirList','sirList'];
          Object.keys(edit).forEach(function(k){if(keys.indexOf(k)===-1)error(base+'.'+k,'Nepodržano polje vježbe.');});
          var before=clone(x),startChanges=changes.length;
          ['sets','setsDone','reps','kg','sec','lastReps','done','skipped'].forEach(function(k){
            if(!has(edit,k))return;var v=edit[k],valid=v===null;
            if(k==='done'||k==='skipped')valid=valid||typeof v==='boolean';
            else if(k==='sets')valid=v!==null&&int(v,1,1000);
            else if(k==='setsDone')valid=valid||int(v,0,1000);
            else if(k==='kg')valid=valid||(finite(v)&&v>=0&&v<=10000);
            else if(k==='sec')valid=valid||(finite(v)&&v>=0&&v<=86400);
            else valid=valid||int(v,0,10000);
            if(!valid)error(base+'.'+k,'Upiši nenegativnu vrijednost u dopuštenom rasponu.');else put(x,k,v,base+'.'+k);
          });
          if(has(edit,'setsDone') && (edit.setsDone===null||int(edit.setsDone,0,1000))){
            if(edit.setsDone===null){x.historySetsUnknown=true;delete x.done;delete x.skipped;delete x.lastReps;}
            else{
              delete x.historySetsUnknown;
              if(!has(edit,'done'))x.done=edit.setsDone>0;
              if(!has(edit,'skipped')){if(edit.setsDone===0)x.skipped=true;else delete x.skipped;}
              if(!has(edit,'lastReps'))delete x.lastReps;
            }
          }
          for (const [key,flag] of [['kg','historyKgUnknown'],['sec','historySecUnknown']]) {
            if (has(edit,key) && !equal(before[key],x[key])) {
              if (edit[key]===null) x[flag]=true; else delete x[flag];
            }
          }
          if(has(edit,'sets') && !has(edit,'setsDone') && int(x.setsDone,0,1000) && x.setsDone>x.sets){x.setsDone=x.sets;changes.push(base+'.setsDone');}
          if(has(x,'setsDone') && int(x.sets,1,1000) && x.setsDone>x.sets)error(base+'.setsDone','Odrađenih serija ne može biti više od spremljenog plana.');
          if(x.skipped===true && has(x,'setsDone') && x.setsDone>0)error(base+'.skipped','Preskočena vježba ne može imati odrađene serije.');
          var count=recordedSetSlots(x),actualChanged=actualKeys.some(function(k){return has(edit,k);})&&actualKeys.some(function(k){return !equal(before[k],x[k]);})||before.historySetsUnknown!==x.historySetsUnknown;
          ['repsList','kgList','secList','rirList','sirList'].forEach(function(k){
            if(has(edit,k)){
              var a=edit[k],limit=k==='kgList'?10000:k==='secList'?86400:40;
              if(a!==null && (!Array.isArray(a)||a.length>1000||!a.every(function(v){return k==='repsList'?int(v,0,10000):v===null||finite(v)&&v>=0&&v<=limit;})))error(base+'.'+k,'Provjeri vrijednost za svaku seriju.');
              else if(a!==null && int(x.sets,1,1000) && a.length>x.sets)error(base+'.'+k,'Popis ima više serija od spremljenog plana.');
              else put(x,k,a,base+'.'+k);
            }
            // Reserve entries follow performed sets. Never repeat a known reserve into new sets.
            if(k!=='repsList' && actualChanged && Array.isArray(x[k])){
              if(count===null)delete x[k];
              else{var mask=x[k].slice(0,count);while(mask.length<count)mask.push(null);x[k]=mask;}
            }
            if(k==='repsList'&&has(edit,'sets')&&Array.isArray(x[k])&&x[k].length>x.sets)x[k]=x[k].slice(0,x.sets);
          });
          if(has(edit,'setsDone') && Array.isArray(x.sideCounts)) {
            if(count===null)delete x.sideCounts;
            else x.sideCounts=Array(count).fill(x.sides?2:1);
            if(!equal(x.sideCounts,before.sideCounts))actualChanged=true;
          }
          if(actualChanged && Array.isArray(x.setNumbers)) {
            if(count===null)delete x.setNumbers;
            else { x.setNumbers=x.setNumbers.slice(0,count);while(x.setNumbers.length<count)x.setNumbers.push(null); }
          }
          if(has(edit,'reps')||has(edit,'repsList')){
            delete x.historyRepsUnknown;
            if(count>0 && repetitionTotal(x)===null && x.measure!=='time')x.historyRepsUnknown=true;else delete x.historyRepsUnknown;
          }
          if(changes.length>startChanges||!equal(before,x))doseChanged=true;
          if(actualChanged && Array.isArray(out.muscleWork) && index<out.muscleWork.length){
            var saved=M.sanitize(out.muscleWork[index]);
            if(!saved||saved.source!=='completed'||saved.exerciseId!==x.exId)out.muscleWork[index]=null;
            else{
              var planned=int(x.sets,1,1000)?x.sets:saved.plannedSets;
              var plan={v:1,source:'planned',exerciseId:saved.exerciseId,name:saved.name,category:saved.category,
                eligibility:saved.eligibility,eligibilitySource:saved.eligibilitySource,primary:saved.primary.slice(),secondary:saved.secondary.slice(),
                unassignedRegions:saved.unassignedRegions.slice(),plannedSets:planned,completedSets:null,completion:planned===null?'unknown':'planned',credits:{direct:{},secondary:{}}};
              if(plan.eligibility==='eligible'&&planned!==null){plan.primary.forEach(function(g){plan.credits.direct[g]=planned;});plan.secondary.forEach(function(g){plan.credits.secondary[g]=planned;});}
              out.muscleWork[index]=M.pack(M.completedFromPlan(plan,x));
            }
          }
        });
      }
    }
    if(has(patch,'load')){
      if(!plain(patch.load))error('load','Podaci treninga na terenu nisu ispravni.');
      else{
        var load=plain(out.load)?out.load:{},old=clone(load),keys=['m','hsr','spr','min','zones'];
        Object.keys(patch.load).forEach(function(k){if(keys.indexOf(k)===-1)error('load.'+k,'Nepodržano polje terenskog treninga.');});
        ['m','hsr','spr','min'].forEach(function(k){if(!has(patch.load,k))return;var v=patch.load[k],max=k==='min'?2880:1000000;
          if(v!==null&&(!finite(v)||v<0||v>max))error('load.'+k,'Upiši nenegativnu vrijednost u dopuštenom rasponu.');else put(load,k,v,'load.'+k);
        });
        if(has(patch.load,'zones')){
          var z=patch.load.zones;
          if(z!==null&&(!Array.isArray(z)||z.length!==4||!z.every(function(n){return finite(n)&&n>=0&&n<=1000000;})))error('load.zones','Zone moraju imati četiri nenegativne udaljenosti.');
          else{
            put(load,'zones',z,'load.zones');
            if(z!==null){
              var derived={m:z.reduce(function(a,b){return a+b;},0),hsr:z[2]+z[3],spr:z[3]};
              if(derived.m>1000000)error('load.zones','Ukupna udaljenost u zonama prelazi dopušteni raspon.');
              Object.keys(derived).forEach(function(k){if(has(patch.load,k)&&patch.load[k]!==null&&Math.abs(patch.load[k]-derived[k])>0.01)error('load.'+k,'Udaljenost se ne slaže s upisanim zonama.');else put(load,k,derived[k],'load.'+k);});
            }
          }
        }else if(['m','hsr','spr'].some(function(k){return has(patch.load,k)&&!equal(old[k],load[k]);}))delete load.zones;
        if(finite(load.m)&&finite(load.hsr)&&load.hsr>load.m)error('load.hsr','Brzo trčanje ne može biti dulje od ukupne udaljenosti.');
        if(finite(load.hsr)&&finite(load.spr)&&load.spr>load.hsr)error('load.spr','Sprint ne može biti dulji od brzog trčanja.');
        if(finite(load.m)&&finite(load.spr)&&load.spr>load.m)error('load.spr','Sprint ne može biti dulji od ukupne udaljenosti.');
        if(!equal(old,load)){out.load=load;fieldChanged=true;}
      }
    }
    if(errors.length)return failure(errors);
    var timeChanged=changes.indexOf('secs')!==-1,rpeChanged=changes.indexOf('srpe')!==-1;
    if(kind==='field'&&(fieldChanged||!plain(entry.load)&&changes.length>0)){
      out.fieldLoadStatus=fieldSummary(out).complete?'recorded':'partial';
      if(out.fieldLoadStatus==='partial')warnings.push('Dio terenskih podataka nije poznat; ne preuzima se današnji predložak.');
    }
    if(doseChanged||fieldChanged||timeChanged){
      var summary=fieldSummary(out),lm=out.load2;
      if(kind==='field'&&plain(lm)&&lm.v==='LM1'&&summary.complete&&finite(out.secs)&&out.secs>=0&&!Array.isArray(out.items)){
        var B=3.5*summary.min+2*summary.m/100+2*summary.hsr/100+0.5*summary.spr/10;
        lm.B=round(B);lm.Bsets=0;lm.Bfield=round(B);lm.band=round(B*0.3);lm.min=round(out.secs/60);lm.m=round(summary.m);
        delete out.load2Status;
      }else if(kind!=='field'&&!doseChanged&&plain(lm)&&lm.v==='LM1'&&finite(lm.Bsets)&&lm.Bsets>=0&&finite(lm.Bfield)&&lm.Bfield>=0&&finite(out.secs)&&out.secs>=0&&
        (Array.isArray(entry.items)||Array.isArray(lm.ex))&&
        !(Array.isArray(entry.items)&&Array.isArray(lm.ex)&&entry.items.length!==lm.ex.length)){
        // LM1 stored these calibrated subtotals already rounded to 0.1. Retain
        // them as recorded; only its documented one-point-per-gym-minute term
        // changes. No exercise factors, reserve or novelty are reconstructed.
        var gymItems=Array.isArray(entry.items)?entry.items.length:lm.ex.length;
        var subtotal=lm.Bsets+lm.Bfield;
        lm.min=round(out.secs/60);lm.B=round(subtotal+(gymItems?out.secs/60:0));lm.band=round(lm.B*0.3);
        delete out.load2Status;
      }else{
        delete out.load2;out.load2Status='needsProfile';
        warnings.push('Bodovi napora čekaju izvorni profil; ne računaju se prema današnjoj knjižnici.');
      }
    }
    if((rpeChanged||timeChanged||fieldChanged)&&plain(out.load2)){
      var au=sessionAU(out);if(au===null)delete out.load2.au;else out.load2.au=au;
    }
    return freeze({ok:true,entry:out,changes:changes,warnings:warnings,loadStatus:effortStatus(out)});
  }
  function editProtocol(entry,patch){return transaction(entry,patch,'protocol');}
  function editField(entry,patch){return transaction(entry,patch,'field');}
  function edit(entry,patch){return entry&&entry.kind==='field'?editField(entry,patch):editProtocol(entry,patch);}
  return freeze({version:1,edit:edit,editProtocol:editProtocol,editField:editField,performedSets:performedSets,recordedRows:recordedRows,
    repetitionTotal:repetitionTotal,timeTotal:timeTotal,fieldSummary:fieldSummary,effortStatus:effortStatus,sessionAU:sessionAU});
});
