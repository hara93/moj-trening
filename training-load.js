/* Three separate observations: recorded muscle sets, reported session effort,
   and externally supplied morning state. AU is not LM1 or a recovery score. */
(function(root,factory){
  'use strict';
  var common=typeof module==='object'&&module.exports;
  var muscles=common?require('./muscle-work.js'):root.MuscleWork;
  // Lazy resolution lets HistoryModel and TeamDiary use the one AU rule without
  // a module-initialization cycle. Session AU itself never needs HistoryModel.
  var api=factory(muscles,function(){return common?require('./history-model.js'):root.HistoryModel;});
  if(common)module.exports=api;
  if(root)root.TrainingLoad=api;
})(typeof window!=='undefined'?window:null,function(Muscles,getHistory){
  'use strict';
  var own=function(o,k){return !!o&&Object.prototype.hasOwnProperty.call(o,k);};
  var plain=function(o){return !!o&&typeof o==='object'&&!Array.isArray(o);};
  var finite=function(n){return typeof n==='number'&&Number.isFinite(n);};
  var time=function(n){return finite(n)&&n>=0&&finite(new Date(n).getTime());};
  var text=function(s){return typeof s==='string'&&s.trim()?s.trim():null;};
  var round=function(n){return Math.round(n*1e6)/1e6;};
  var rating=function(n){return finite(n)&&n>=0&&n<=10;};
  var duration=function(n){return finite(n)&&n>=0;};
  function freeze(value){if(value&&typeof value==='object'&&!Object.isFrozen(value)){Object.keys(value).forEach(function(k){freeze(value[k]);});Object.freeze(value);}return value;}
  function sessionAU(entry){
    return plain(entry)&&rating(entry.srpe)&&duration(entry.secs)?round(entry.srpe*entry.secs/60):null;
  }
  function dateKey(at){var d=new Date(at);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  function midnight(at){var d=new Date(at);d.setHours(0,0,0,0);return d.getTime();}
  function shift(at,days){var d=new Date(at);d.setDate(d.getDate()+days);d.setHours(0,0,0,0);return d.getTime();}
  function calendarDay(at){var d=new Date(at);return Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/86400000;}
  function kind(entry){return entry.kind==='team'?(entry.teamType==='match'?'match':'team'):entry.kind==='protocol'?'protocol':entry.kind==='field'?'field':entry.kind==null?'legacy':null;}
  function records(log,now){
    var byId=new Map(),anonymous=[];
    (Array.isArray(log)?log:[]).forEach(function(entry,index){
      if(!plain(entry)||!time(entry.at))return;
      var row={entry:entry,index:index},id=text(entry.historyId),previous=id?byId.get(id):null;
      var revision=Math.max(time(entry.editedAt)?entry.editedAt:0,time(entry.updatedAt)?entry.updatedAt:0);
      if(!id)anonymous.push(row);
      else if(!previous||revision>previous.revision)byId.set(id,{entry:entry,index:index,revision:revision});
    });
    return anonymous.concat(Array.from(byId.values())).filter(function(row){return kind(row.entry)&&row.entry.at<=now;})
      .sort(function(a,b){return b.entry.at-a.entry.at||a.index-b.index;}).map(function(row){return row.entry;});
  }
  var labels={protocol:'Protokoli',field:'Teren',team:'Ekipni trening',match:'Utakmice',legacy:'Stariji zapisi'};
  function period(log,from,to){
    var entries=log.filter(function(entry){return entry.at>=from&&entry.at<to;});
    var out={from:from,to:to,sessions:entries.length,rated:0,knownMinutes:0,missingDuration:0,missingRpe:0,missingAU:0,knownAU:0,totalAU:null,complete:false,byKind:[]};
    var buckets=new Map();
    entries.forEach(function(entry){
      var au=sessionAU(entry),type=kind(entry);
      if(duration(entry.secs))out.knownMinutes+=entry.secs/60;else out.missingDuration++;
      if(!rating(entry.srpe))out.missingRpe++;
      if(au===null)out.missingAU++;else{out.rated++;out.knownAU+=au;}
      if(!buckets.has(type))buckets.set(type,{kind:type,label:labels[type],sessions:0,rated:0,knownAU:0,missingAU:0,totalAU:null});
      var bucket=buckets.get(type);bucket.sessions++;
      if(au===null)bucket.missingAU++;else{bucket.rated++;bucket.knownAU+=au;}
    });
    out.knownMinutes=round(out.knownMinutes);out.knownAU=round(out.knownAU);
    out.complete=out.sessions>0&&out.missingAU===0;if(out.complete)out.totalAU=out.knownAU;
    out.byKind=Array.from(buckets.values()).map(function(bucket){bucket.knownAU=round(bucket.knownAU);if(!bucket.missingAU)bucket.totalAU=bucket.knownAU;return bucket;});
    return out;
  }
  function muscleSummary(log,range){
    var report=Muscles.week(log,{from:range.from,to:range.to}),coverage=report.coverage;
    var groups=Muscles.groups.map(function(group){var saved=report.groups[group.id];return {id:group.id,label:group.label,direct:saved.direct,secondary:saved.secondary,equivalent:saved.equivalent};});
    var sets=0;
    report.sessions.forEach(function(session){session.snapshots.forEach(function(saved){if(saved&&saved.eligibility==='eligible'&&saved.completedSets!==null)sets+=saved.completedSets;});});
    return {groups:groups,coverage:{sessions:coverage.sessions,coveredSessions:coverage.coveredSessions,missingSessions:coverage.missingSessions,
      invalidSessions:coverage.invalidSessions,unassignedSessions:coverage.unassignedSessions,partialSessions:coverage.partialSessions},
      recordedSets:sets,coveredGroups:groups.filter(function(group){return group.equivalent>0;}).length,
      complete:coverage.sessions>0&&!coverage.missingSessions&&!coverage.invalidSessions&&!coverage.unassignedSessions};
  }
  var periodLengths={'7d':7,'1m':30,'3m':90,all:null};
  var periods=Object.freeze(Object.keys(periodLengths));
  function periodStart(now,key){
    var length=periodLengths[periods.includes(key)?key:'7d'];
    return time(now)&&length!==null?shift(now,1-length):null;
  }
  function summary(input){
    input=plain(input)?input:{};
    if(!time(input.now))return freeze({status:'invalid',today:null,range:null,effort:null,muscles:null});
    var key=periods.includes(input.period)?input.period:'7d';
    var today=midnight(input.now),to=shift(today,1),log=records(input.log,input.now);
    var from=periodStart(input.now,key) ?? (log.length?midnight(log[log.length-1].at):today);
    var count=calendarDay(to)-calendarDay(from),binCount=Math.min(7,count),binDays=Math.ceil(count/binCount);
    var range={from:from,to:to,observedTo:input.now,period:key,binDays:binDays};
    var current=period(log,from,to),baseline=null,days=[];
    if(key==='7d'){
      var baselineFrom=shift(from,-28);
      baseline=period(log,baselineFrom,from);
      baseline.weeks=[];
      for(var w=0;w<4;w++)baseline.weeks.push(period(log,shift(baselineFrom,w*7),shift(baselineFrom,(w+1)*7)));
      baseline.activeWeeks=baseline.weeks.filter(function(week){return week.sessions>0;}).length;
      baseline.weeklyAverageAU=baseline.complete?round(baseline.knownAU/4):null;
    }
    for(var i=0;i<binCount;i++){
      var start=Math.floor(i*count/binCount),end=Math.floor((i+1)*count/binCount);
      var day=period(log,shift(from,start),shift(from,end));
      day.date=dateKey(day.from);day.endDate=dateKey(day.to-1);days.push(day);
    }
    return freeze({status:'ready',today:dateKey(input.now),range:range,
      effort:{current:current,baseline:baseline,days:days},muscles:muscleSummary(log,range)});
  }
  function rowNumber(item,key,index){
    var value=own(item,key+'List')?Array.isArray(item[key+'List'])?item[key+'List'][index]:null:item[key];
    return finite(value)&&value>=0?value:null;
  }
  function plannedDose(entry){
    if(entry.kind==='field')return fieldDose(entry.load);
    if(entry.kind!=='protocol'||!Array.isArray(entry.items)||!entry.items.length)return null;
    var out=[];
    for(var item of entry.items){
      if(!plain(item)||!text(item.exId)||!['sets','reps','time'].includes(item.measure)||!Number.isInteger(item.sets)||item.sets<1||item.sets>1000||typeof item.sides!=='boolean')return null;
      var rows=[];
      for(var i=0;i<item.sets;i++){
        var amount=rowNumber(item,item.measure==='time'?'sec':'reps',i),kg=rowNumber(item,'kg',i);
        if(amount===null||amount<=0||kg===null)return null;
        rows.push([amount,kg,item.sides?2:1]);
      }
      out.push([item.exId,item.measure==='time'?'time':'reps',rows]);
    }
    return JSON.stringify(out);
  }
  function fieldDose(load){
    return plain(load)&&['m','hsr','spr','min'].every(function(key){return finite(load[key])&&load[key]>=0;})&&load.spr<=load.hsr&&load.hsr<=load.m?JSON.stringify(['field',load.m,load.hsr,load.spr,load.min]):null;
  }
  function actualDose(entry){
    if(entry.kind==='field')return fieldDose(entry.load);
    var History=getHistory();
    if(!History||entry.kind!=='protocol'||!Array.isArray(entry.items)||!entry.items.length)return null;
    var out=[];
    for(var item of entry.items){
      if(!plain(item)||!text(item.exId)||!['sets','reps','time'].includes(item.measure)||typeof item.sides!=='boolean'||
        item.historyKgUnknown||item.historyRepsUnknown||item.historySecUnknown||item.skipped)return null;
      var actual=History.recordedRows(item);
      if(!actual||!actual.length)return null;
      var rows=[];
      for(var i=0;i<actual.length;i++){
        var row=actual[i],amount=item.measure==='time'?row.sec:row.reps;
        if(row.failed||item.done===false&&i===actual.length-1||row.sides!==(item.sides?2:1)||!finite(amount)||amount<=0||!finite(row.kg)||row.kg<0)return null;
        rows.push([amount,row.kg,row.sides]);
      }
      out.push([item.exId,item.measure==='time'?'time':'reps',rows]);
    }
    return JSON.stringify(out);
  }
  function expectation(input){
    input=plain(input)?input:{};
    var entry=input.entry,result={status:'unavailable',sampleCount:0,min:null,max:null,samples:[],source:'reported-history',reason:'Za usporedbu trebaju poznata doza i isti spremljeni trening.'};
    if(!time(input.now)||!plain(entry)||!['protocol','field'].includes(entry.kind)||!text(entry.refId))return freeze(result);
    var dose=plannedDose(entry);
    if(dose===null){result.reason='Doza nije potpuno poznata. Nedostajući podaci ne pretvaraju se u procjenu napora.';return freeze(result);}
    records(input.log,input.now).forEach(function(previous){
      if(previous.kind!==entry.kind||previous.refId!==entry.refId||previous.at>=input.now||text(entry.historyId)&&previous.historyId===entry.historyId)return;
      var au=sessionAU(previous);
      if(au===null||actualDose(previous)!==dose)return;
      result.samples.push({id:text(previous.historyId),at:previous.at,au:au,minutes:round(previous.secs/60),srpe:previous.srpe});
    });
    result.sampleCount=result.samples.length;
    if(result.sampleCount<2){result.status='insufficient';result.reason='Za vlastiti povijesni raspon trebaju barem dvije ocijenjene usporedive izvedbe.';return freeze(result);}
    result.status='available';result.min=Math.min.apply(null,result.samples.map(function(sample){return sample.au;}));result.max=Math.max.apply(null,result.samples.map(function(sample){return sample.au;}));
    result.reason='Raspon prijavljenog napora vlastitih izvedbi iste zabilježene radne doze. Rezerva, odmor i današnje stanje nisu pretpostavljeni; nije jamstvo napora sljedećeg treninga.';
    return freeze(result);
  }
  return Object.freeze({version:1,periods:periods,periodStart:periodStart,sessionAU:sessionAU,summary:summary,expectation:expectation});
});
