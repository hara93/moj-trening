/* WorkoutModel: explicit replacement filters and saved exercise evidence.
   A candidate is a choice to review, never a claim of equivalent training load.
   Replacement drafts carry the new exercise's dose, not the old exercise's kg. */
(function(root,factory){
  'use strict';
  var history=typeof module==='object'&&module.exports?require('./history-model.js'):root.HistoryModel;
  var muscles=typeof module==='object'&&module.exports?require('./muscle-work.js'):root.MuscleWork;
  var api=factory(history,muscles);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.WorkoutModel=api;
})(typeof window!=='undefined'?window:null,function(History,Muscles){
  'use strict';
  var own=function(o,k){return !!o&&Object.prototype.hasOwnProperty.call(o,k);};
  var plain=function(o){return !!o&&typeof o==='object'&&!Array.isArray(o);};
  var finite=function(n){return typeof n==='number'&&Number.isFinite(n);};
  var text=function(s){return typeof s==='string'&&s.trim()?s.trim():null;};
  var time=function(n){return finite(n)&&n>=0&&finite(new Date(n).getTime());};
  var measure=function(value){return ['sets','reps','time'].indexOf(value)!==-1?value:null;};
  var positiveInt=function(n){return Number.isInteger(n)&&n>0&&n<=1000;};
  function freeze(value){
    if(value&&typeof value==='object'&&!Object.isFrozen(value)){
      Object.keys(value).forEach(function(k){freeze(value[k]);});Object.freeze(value);
    }
    return value;
  }
  function normalized(value){return typeof value==='string'?value.trim().toLocaleLowerCase('hr-HR'):'';}
  function tags(exercise){
    if(!Array.isArray(exercise.equip)||!exercise.equip.length||exercise.equip.some(function(tag){return !text(tag);}))return null;
    return Array.from(new Set(exercise.equip.map(function(tag){return tag.trim();})));
  }
  function pattern(exercise,id,profiles){
    var explicit=text(exercise.movementPattern);
    if(explicit)return explicit;
    return plain(profiles)&&own(profiles,id)&&plain(profiles[id])?text(profiles[id].pat):null;
  }
  function candidates(input){
    input=plain(input)?input:{};
    var item=input.item,exercises=input.exercises;
    if(!plain(item)||!text(item.exId)||!plain(exercises)||!own(exercises,item.exId))return freeze([]);
    var source=exercises[item.exId],mode=measure(item.measure);
    if(!plain(source)||!text(source.cat)||!mode)return freeze([]);
    var primary=Muscles.profile(source).primary;
    if(!primary.length)return freeze([]);
    var sourcePattern=pattern(source,item.exId,input.profiles),excluded=new Set(Array.isArray(input.excludeIds)?input.excludeIds:[]);
    if(input.excludeIds instanceof Set)input.excludeIds.forEach(function(id){excluded.add(id);});
    excluded.add(item.exId);
    var filtering=input.equipment!==undefined,available;
    if(filtering){
      if(!Array.isArray(input.equipment))return freeze([]);
      available=new Set(input.equipment.map(normalized).filter(Boolean));
    }
    var out=[];
    Object.keys(exercises).forEach(function(id){
      var exercise=exercises[id];
      if(excluded.has(id)||!plain(exercise)||!text(exercise.name)||exercise.cat!==source.cat||measure(exercise.measure)!==mode)return;
      var nextPrimary=Muscles.profile(exercise).primary;
      if(!nextPrimary.some(function(group){return primary.indexOf(group)!==-1;}))return;
      var nextPattern=pattern(exercise,id,input.profiles);
      if((sourcePattern||nextPattern)&&sourcePattern!==nextPattern)return;
      var equipment=tags(exercise);
      if(filtering&&(!equipment||equipment.some(function(tag){return normalized(tag)!=='bez opreme'&&!available.has(normalized(tag));})))return;
      out.push({id:id,name:exercise.name.trim(),equipment:equipment?equipment.slice():[],primary:nextPrimary.slice(),pattern:nextPattern,
        reason:'Ista kategorija i glavna mišićna skupina'+(sourcePattern?'; isti zabilježeni obrazac pokreta':'')+'. Provjeri izvedbu i novu dozu; opterećenje nije nužno jednako.'});
    });
    return freeze(out.sort(function(a,b){return a.name.localeCompare(b.name,'hr',{sensitivity:'base'})||a.id.localeCompare(b.id);}));
  }
  // candidate is the application's fresh exItem(exercise), or an exercise with
  // equally explicit scalar defaults. Missing load stays absent, never old kg.
  function draftReplacement(item,candidate){
    if(!plain(item)||!plain(candidate))return null;
    var id=text(candidate.exId)||text(candidate.id),mode=measure(candidate.measure);
    if(!id||!mode||mode!==measure(item.measure)||text(candidate.exId)&&text(candidate.id)&&candidate.exId!==candidate.id)return null;
    if(mode==='time'?!finite(candidate.sec)||candidate.sec<=0:!positiveInt(candidate.reps))return null;
    if(candidate.kg!=null&&(!finite(candidate.kg)||candidate.kg<0))return null;
    if(candidate.sides!=null&&typeof candidate.sides!=='boolean')return null;
    var sets=positiveInt(item.sets)?item.sets:positiveInt(candidate.sets)?candidate.sets:null;
    if(sets===null)return null;
    var out={exId:id,measure:mode,sets:sets};
    ['reps','sec','kg'].forEach(function(key){if(finite(candidate[key])&&candidate[key]>=0)out[key]=candidate[key];});
    if(typeof candidate.sides==='boolean')out.sides=candidate.sides;
    if(candidate.startingKgKnown===true)out.startingKgKnown=true;
    var rest=finite(item.rest)&&item.rest>=0?item.rest:finite(candidate.rest)&&candidate.rest>=0?candidate.rest:null;
    if(rest!==null)out.rest=rest;
    ['section','ss'].forEach(function(key){if(typeof item[key]==='string'||finite(item[key]))out[key]=item[key];});
    return freeze(out);
  }
  function savedName(entry,index,item){
    var snapshot=Array.isArray(entry.muscleWork)?Muscles.sanitize(entry.muscleWork[index]):null;
    return snapshot&&snapshot.source==='completed'&&snapshot.exerciseId===item.exId&&text(snapshot.name)||text(item.name)||item.exId;
  }
  function previous(input){
    input=plain(input)?input:{};
    if(!plain(input.item)||!text(input.item.exId)||!time(input.now))return null;
    var records=[],byId=new Map();
    (Array.isArray(input.log)?input.log:[]).forEach(function(entry,index){
      if(!plain(entry)||(entry.kind!=null&&['protocol','exercise'].indexOf(entry.kind)===-1)||!time(entry.at))return;
      var record={entry:entry,index:index},id=text(entry.historyId),old=id?byId.get(id):null;
      if(!id)records.push(record);
      else if(!old||(time(entry.editedAt)?entry.editedAt:0)>(time(old.entry.editedAt)?old.entry.editedAt:0))byId.set(id,record);
    });
    records=records.concat(Array.from(byId.values())).filter(function(record){return record.entry.at<=input.now;})
      .sort(function(a,b){return b.entry.at-a.entry.at||a.index-b.index;});
    for(var r=0;r<records.length;r++){
      var entry=records[r].entry,matched=[];
      (Array.isArray(entry.items)?entry.items:[]).forEach(function(item,index){if(plain(item)&&item.exId===input.item.exId)matched.push({item:item,index:index});});
      // Trimming can remove item rows while retaining their immutable exercise
      // snapshots. That proves a newer occurrence, not its lost set details.
      (Array.isArray(entry.muscleWork)?entry.muscleWork:[]).forEach(function(raw,index){
        if(Array.isArray(entry.items)&&index<entry.items.length)return;
        var saved=Muscles.sanitize(raw);
        if(saved&&saved.source==='completed'&&saved.exerciseId===input.item.exId)matched.push({item:{exId:saved.exerciseId,name:saved.name,historySetsUnknown:true},index:index});
      });
      if(!matched.length)continue;
      var rows=[],unknownItems=0,skippedItems=0;
      matched.forEach(function(match){
        var item=match.item,mode=measure(item.measure),actual=History.recordedRows(item),unknown=!mode||actual===null;
        if(item.skipped===true)skippedItems++;
        (actual||[]).forEach(function(row){
          var timed=mode==='time',reps=mode&&!timed?row.reps:null,seconds=timed&&!item.historySecUnknown?row.sec:null,kg=item.historyKgUnknown?null:row.kg;
          if(!mode||row.sides===null||kg===null||(timed?seconds===null:reps===null))unknown=true;
          rows.push({itemIndex:match.index,number:positiveInt(row.number)?row.number:null,measure:mode,
            perSide:typeof item.sides==='boolean'?item.sides:null,sides:row.sides,kg:kg,
            reps:reps,sec:seconds,rir:mode&&!timed?row.rir:null,sir:timed?row.sir:null,failed:row.failed});
        });
        if(unknown)unknownItems++;
      });
      return freeze({at:entry.at,sessionId:text(entry.historyId),sessionName:text(entry.name)||'Spremljeni trening',
        exerciseName:savedName(entry,matched[0].index,matched[0].item),kind:entry.kind==null?null:entry.kind,
        rows:rows,unknownItems:unknownItems,skippedItems:skippedItems,
        context:unknownItems?'Dio posljednje spremljene izvedbe nije poznat. Prazna vrijednost nije nula.':
          !rows.length?(skippedItems?'U posljednjem zapisu vježba je preskočena.':'U posljednjem zapisu nema odrađenih serija.'):'Stvarne spremljene serije; rezerva ostaje nepoznata ako nije unesena.'});
    }
    return null;
  }
  return Object.freeze({version:1,candidates:candidates,draftReplacement:draftReplacement,previous:previous});
});
