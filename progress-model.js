/* ProgressModel: observations, not prescriptions. Compare a best performed set
   at the same recorded weight and side mode; keep workload, duration and AU
   separate. No estimated max, inferred kilograms or readiness calculation. */
(function(root,factory){
  'use strict';
  var history=typeof module==='object'&&module.exports?require('./history-model.js'):root.HistoryModel;
  var muscles=typeof module==='object'&&module.exports?require('./muscle-work.js'):root.MuscleWork;
  var api=factory(history,muscles);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.ProgressModel=api;
})(typeof window!=='undefined'?window:null,function(History,Muscles){
  'use strict';
  var own=function(o,k){return !!o&&Object.prototype.hasOwnProperty.call(o,k);};
  var plain=function(o){return !!o&&typeof o==='object'&&!Array.isArray(o);};
  var finite=function(n){return typeof n==='number'&&Number.isFinite(n);};
  var validTime=function(n){return finite(n)&&n>=0&&finite(new Date(n).getTime());};
  var text=function(s){return typeof s==='string'&&s.trim()?s.trim():null;};
  var rounded=function(n){return Math.round(n*1e6)/1e6;};
  function freeze(value){
    if(value&&typeof value==='object'&&!Object.isFrozen(value)){
      Object.keys(value).forEach(function(k){freeze(value[k]);});Object.freeze(value);
    }
    return value;
  }
  function workout(entry){return plain(entry)&&(entry.kind==null||['protocol','field','team'].indexOf(entry.kind)!==-1);}
  function revision(entry){return Math.max(validTime(entry.editedAt)?entry.editedAt:0,validTime(entry.updatedAt)?entry.updatedAt:0);}
  function records(log,now){
    var byId=new Map(),anonymous=[];
    (Array.isArray(log)?log:[]).forEach(function(entry,index){
      if(!workout(entry)||!validTime(entry.at))return;
      var row={entry:entry,index:index},id=text(entry.historyId);
      if(!id){anonymous.push(row);return;}
      var prior=byId.get(id);
      if(!prior||revision(entry)>revision(prior.entry))byId.set(id,row);
    });
    return anonymous.concat(Array.from(byId.values())).filter(function(row){return row.entry.at<=now;})
      .sort(function(a,b){return b.entry.at-a.entry.at||a.index-b.index;});
  }
  function monday(now){
    var date=new Date(now);date.setHours(0,0,0,0);
    date.setDate(date.getDate()-(date.getDay()+6)%7);return date.getTime();
  }
  function shift(start,days){var date=new Date(start);date.setDate(date.getDate()+days);return date.getTime();}
  function weeks(rows,now){
    var start=monday(now),out=[];
    for(var i=7;i>=0;i--)out.push({start:shift(start,-i*7),count:0,minutes:0,missingDuration:0,au:0,unrated:0});
    rows.forEach(function(row){
      var entry=row.entry,index=out.findIndex(function(week,i){return entry.at>=week.start&&(i===7||entry.at<out[i+1].start);});
      if(index<0)return;
      var week=out[index];week.count++;
      if(finite(entry.secs)&&entry.secs>=0)week.minutes+=entry.secs/60;else week.missingDuration++;
      var au=History.sessionAU(entry);
      if(au===null)week.unrated++;else week.au+=au;
    });
    out.forEach(function(week){week.minutes=rounded(week.minutes);week.au=rounded(week.au);});
    return out;
  }
  function snapshot(entry,index,item){
    if(!Muscles||!Array.isArray(entry.muscleWork))return null;
    var saved=Muscles.sanitize(entry.muscleWork[index]);
    return saved&&saved.source==='completed'&&saved.exerciseId===item.exId?saved:null;
  }
  function observations(rows,exercises){
    var byExercise=new Map();
    rows.forEach(function(record){
      var entry=record.entry;
      if(entry.kind!=null&&entry.kind!=='protocol'||!Array.isArray(entry.items))return;
      var session=new Map();
      entry.items.forEach(function(item,index){
        if(!plain(item)||!text(item.exId)||!own(exercises,item.exId))return;
        var exercise=exercises[item.exId];
        if(!plain(exercise)||['Snaga','Trup'].indexOf(exercise.cat)===-1)return;
        var saved=snapshot(entry,index,item);
        if(item.warmup===true||saved&&saved.eligibilitySource==='warmup')return;
        var observation=session.get(item.exId);
        if(!observation){
          observation={entry:entry,name:saved&&text(saved.name)||text(item.name)||text(exercise.name)||item.exId,sets:new Map()};
          session.set(item.exId,observation);
        }
        if(item.skipped||item.historySetsUnknown||item.historyRepsUnknown||item.historyKgUnknown||item.historySecUnknown)return;
        if(item.sides!=null&&typeof item.sides!=='boolean')return;
        if(['sets','reps','time'].indexOf(item.measure)===-1)return;
        var actual=History.recordedRows(item);
        if(!actual)return;
        var kind=item.measure==='time'?'time':'reps',expected=item.sides?2:1;
        actual.forEach(function(row,position){
          var quantity=kind==='time'?row.sec:row.reps;
          if(row.failed||item.done===false&&position===actual.length-1||row.sides!==expected||
              !finite(row.kg)||row.kg<0||!finite(quantity)||quantity<=0||kind==='reps'&&!Number.isInteger(quantity))return;
          var key=kind+'|'+expected+'|'+row.kg,prior=observation.sets.get(key);
          if(!prior||quantity>prior.quantity)observation.sets.set(key,{key:key,quantity:quantity,kg:row.kg,kind:kind,sides:expected,
            reserve:kind==='time'?row.sir:row.rir,order:index*1001+position});
        });
      });
      session.forEach(function(observation,id){
        if(!byExercise.has(id))byExercise.set(id,[]);
        byExercise.get(id).push(observation);
      });
    });
    return byExercise;
  }
  function number(value){return String(value).replace('.',',');}
  function context(current,previous){
    var description='Najbolja puna serija · '+number(current.kg)+' kg u zapisu'+(current.sides===2?' · po strani; obje strane odrađene':'')+'. ';
    if(current.reserve===null||previous.reserve===null)return description+'Rezerva nije poznata za obje uspoređene serije.';
    var label=current.kind==='time'?'Rezerva u sekundama':'RIR';
    return description+label+' '+number(previous.reserve)+' → '+number(current.reserve)+
      (current.reserve===previous.reserve?'.':' · različita rezerva; usporedba nije dokaz promjene snage.');
  }
  function latestComparable(history,id){
    var current=history[0];
    if(!current||!current.sets.size)return null;
    for(var i=1;i<history.length;i++){
      var previous=history[i];
      if(previous.entry.at>=current.entry.at)continue;
      var shared=Array.from(current.sets.values()).filter(function(row){return previous.sets.has(row.key);});
      if(!shared.length)continue;
      // Pick a common load before inspecting the direction of the change.
      shared.sort(function(a,b){return b.kg-a.kg||a.order-b.order;});
      var recent=shared[0],prior=previous.sets.get(recent.key);
      return {set:recent,comparison:{id:id,name:current.name,kind:recent.kind,unit:recent.kind==='time'?'s':'pon.',
          current:recent.quantity,previous:prior.quantity,delta:rounded(recent.quantity-prior.quantity),
          currentAt:current.entry.at,previousAt:previous.entry.at,
          currentSessionId:text(current.entry.historyId),previousSessionId:text(previous.entry.historyId),
          context:context(recent,prior)}};
    }
    return null;
  }
  function comparisons(rows,exercises){
    var out=[];
    observations(rows,exercises).forEach(function(history,id){
      var match=latestComparable(history,id);
      if(match)out.push(match.comparison);
    });
    return out.sort(function(a,b){return b.currentAt-a.currentAt||a.id.localeCompare(b.id);}).slice(0,3);
  }
  function exerciseTrend(input){
    input=plain(input)?input:{};
    var id=input.exerciseId;
    if(!validTime(input.now)||!text(id)||!plain(input.exercises)||!own(input.exercises,id))return null;
    var rows=records(input.log,input.now);
    if(finite(input.from))rows=rows.filter(function(row){return row.entry.at>=input.from;});
    var history=observations(rows,{[id]:input.exercises[id]}).get(id)||[],match=latestComparable(history,id);
    if(!match)return null;
    var points=[];
    history.forEach(function(observation){
      var row=observation.sets.get(match.set.key),at=observation.entry.at,last=points[points.length-1];
      if(!row||last&&last.at===at)return;
      points.push({at:at,value:row.quantity,sessionId:text(observation.entry.historyId),reserve:row.reserve});
    });
    return freeze(Object.assign(match.comparison,{kg:match.set.kg,sides:match.set.sides,points:points.reverse()}));
  }
  function summarize(input){
    input=plain(input)?input:{};
    if(!validTime(input.now))return freeze({comparisons:[],weeks:[]});
    var rows=records(input.log,input.now),exercises=plain(input.exercises)?input.exercises:{};
    return freeze({comparisons:comparisons(rows,exercises),weeks:weeks(rows,input.now)});
  }
  return Object.freeze({version:1,summarize:summarize,exerciseTrend:exerciseTrend});
});
