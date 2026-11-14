'use strict';
// 1.25.0: the breathing pacer's model (breath.js) on the shipped breathing exercises: presets, variants, the intro and the
// pre-match ramp, phase boundaries (±0.06 s), totals in whole breaths, the circle's level, the square's sides, and the
// Croatian plurals of the spoken and VoiceOver strings. The breath-hold sprints are a plain sets × reps exercise.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const Breath=require('../breath.js');
const window={};new Function('window',fs.readFileSync(path.join(__dirname,'../data.js'),'utf8'))(window);
new Function('window',fs.readFileSync(path.join(__dirname,'../loadfx.js'),'utf8'))(window);
const E=window.SEED.exercises,B=id=>E[id].breath;
const near=(a,b,m)=>assert.ok(Math.abs(a-b)<=0.06,m+': '+a+' vs '+b);
// the phase at each boundary, 0.05 s before and after it
function walk(r){
  const out=[];let t=0;
  const blocks=r.intro.concat([{phases:r.phases,cycles:r.cycles}]);
  blocks.forEach(b=>{for(let c=0;c<b.cycles;c++)b.phases.forEach(ph=>{out.push({t,k:ph.k,s:ph.s});t+=ph.s;});});
  return {bounds:out,end:t};
}

test('the four shipped breathing exercises: category, the calm ones paced, the sprints a plain sets × reps exercise',()=>{
  const ids=Object.keys(E).filter(id=>E[id].cat==='Disanje').sort();
  assert.deepEqual(ids,['ciklicki-uzdah','kvadratno-disanje','sporo-disanje','sprintevi-bez-daha']);
  for(const id of ids){
    const e=E[id];assert.equal(e.muscleWorkEligible,false,id);assert.deepEqual(e.zones,[],id);assert.equal(typeof e.breath,'object',id);
    assert.equal(window.EXFX[id].pat,id==='sprintevi-bez-daha'?'R':'D',id+' load pattern');
  }
  assert.deepEqual(Object.keys(B('sporo-disanje').presets),['svaki-dan','utakmica','spavanje'],'one technique, three presets');
  const s=E['sprintevi-bez-daha'];
  assert.equal(s.breath.kind,'sprint');assert.equal(s.measure,'sets');assert.equal(s.sets,2);assert.equal(s.reps,6);assert.equal(s.rest,180);
  assert.equal(s.breath.phases,undefined,'no 30-s phase pacer');assert.equal(s.breath.minutes_options,undefined);
  assert.ok(!JSON.stringify(s.breath).includes('"free"'),'no free phase');
  assert.equal(s.breath.safety_gate_hr.length,5);
  assert.deepEqual(s.breath.structure.distance_m_range,[30,40]);assert.equal(window.EXFX['sprintevi-bez-daha'].runM,35);
  const how=s.breath.steps_hr.join(' ');
  for(const words of ['ne do kraja','samo dok traje sprint','hodaj natrag dišući slobodno','svakih 30 s','70–80 % brzine','vrtoglavice'])assert.ok(how.includes(words),words);
  // copy rules (katalog §1.1): never a faster top speed, a better match or "tested without a coach"
  assert.match(s.breath.why_hr,/najveća brzina nije porasla/);assert.doesNotMatch(JSON.stringify(s.breath),/brži sprint|bolja utakmica/i);
  assert.match(B('sporo-disanje').presets.spavanje.audio_hr,/potpuno zatamnjen; ne zaključavaj mobitel/);
  assert.doesNotMatch(JSON.stringify(B('sporo-disanje').presets.spavanje),/brže zaspi|liječi nesanic/i);
});

test('every calm preset, variant and intro: totals in whole breaths, the nominal minutes kept, the item seconds rounded up',()=>{
  const cases=[
    ['sporo-disanje',{preset:'svaki-dan',min:10},{cycles:60,total:600,shape:'circle'}],
    ['sporo-disanje',{preset:'svaki-dan',min:5,variant:'duzi-izdah'},{cycles:30,total:300}],
    ['sporo-disanje',{preset:'svaki-dan',min:10,variant:'laksi-ritam'},{cycles:71,total:603.5}],
    ['sporo-disanje',{preset:'svaki-dan',min:10,intro:'uvod-zadihan'},{cycles:51,total:600,introCycles:15}],
    ['sporo-disanje',{preset:'utakmica',min:5},{cycles:27,total:304,introCycles:4}],
    ['sporo-disanje',{preset:'spavanje',min:15},{cycles:90,total:900,night:true}],
    ['sporo-disanje',{preset:'spavanje',min:20,variant:'laksi-ritam'},{cycles:141,total:1198.5,night:true}],
    ['ciklicki-uzdah',{min:5},{cycles:30,total:300}],
    ['ciklicki-uzdah',{variant:'sporiji-izdah'},{cycles:27,total:297}],
    ['kvadratno-disanje',{min:1},{cycles:4,total:64,shape:'square'}],
    ['kvadratno-disanje',{min:5},{cycles:19,total:304,shape:'square'}],
    ['kvadratno-disanje',{min:5,variant:'krace-faze'},{cycles:25,total:300,shape:'square'}]];
  for(const [id,sel,want] of cases){
    const r=Breath.resolve(B(id),sel),label=id+' '+JSON.stringify(sel);
    for(const [k,v] of Object.entries(want))assert.equal(r[k],v,label+' '+k);
    assert.ok(Number.isInteger(r.cycles)&&r.cycles>=1,label);
    near(r.total,r.introS+r.cycles*r.cycleS,label+' total = intro + whole breaths');
    assert.equal(walk(r).end,r.total,label);
  }
  // defaults and unknown choices fall back to the preset's defaults
  assert.equal(Breath.resolve(B('sporo-disanje'),{}).key,'svaki-dan');
  assert.equal(Breath.resolve(B('sporo-disanje'),{preset:'nema',min:7,variant:'x',intro:'y'}).min,10);
  assert.equal(Breath.resolve(B('kvadratno-disanje'),{min:3}).min,5);
  // a damaged pattern never runs: the model falls back to 4/6
  const bad=Breath.resolve({phases:[{k:'in',s:0}],minutes_options:[5],minutes_default:5},{});
  assert.deepEqual(bad.phases,[{k:'in',s:4},{k:'out',s:6}]);
});

test('the phase at time t: boundaries within 0.06 s, seconds left, progress, breath index and intro state, for every calm exercise',()=>{
  const plans=[Breath.resolve(B('sporo-disanje'),{preset:'utakmica',min:5}),Breath.resolve(B('sporo-disanje'),{min:5,intro:'uvod-zadihan'}),
    Breath.resolve(B('ciklicki-uzdah'),{}),Breath.resolve(B('kvadratno-disanje'),{min:1}),Breath.resolve(B('sporo-disanje'),{preset:'spavanje',min:10,variant:'laksi-ritam'})];
  for(const r of plans){
    const {bounds}=walk(r);let breath=0;
    bounds.forEach((b,i)=>{
      const after=Breath.at(r,b.t+0.05);assert.equal(after.k,b.k,'phase just after '+b.t);near(after.left,b.s-0.05,'seconds left');
      near(after.frac*b.s,0.05,'progress');
      if(i>0){const before=Breath.at(r,b.t-0.05);assert.equal(before.k,bounds[i-1].k,'phase just before '+b.t);}
      if(i===0||b.k==='in'&&bounds[i-1].k!=='in')breath++;
      if(r.phases[0].k==='in'&&b.k==='in')assert.equal(after.breath,breath,'breath index at '+b.t);
    });
    const last=Breath.at(r,r.total+5);assert.equal(last.breath,last.breaths,'clamped at the end');assert.equal(last.k,r.phases[r.phases.length-1].k);
    assert.equal(Breath.at(r,-3).t,0,'clamped at the start');
  }
});

test('the pre-match ramp: 4/4 twice, 4/5 twice, then 4/6; the intro is counted apart and its end is a new block',()=>{
  const r=Breath.resolve(B('sporo-disanje'),{preset:'utakmica',min:5});
  assert.equal(r.introS,34);assert.deepEqual(r.intro.map(b=>Breath.rhythm(b.phases,true)),['4/4 s','4/5 s']);
  let a=Breath.at(r,0.1);assert.equal(a.intro,true);assert.equal(a.block,0);assert.equal(a.cycle,1);assert.equal(a.cycles,4);
  a=Breath.at(r,16.1);assert.equal(a.block,1);assert.equal(a.k,'in');assert.equal(a.cycle,3);
  a=Breath.at(r,34.1);assert.equal(a.intro,false);assert.equal(a.block,2);assert.equal(a.cycle,1);assert.equal(a.cycles,27);assert.equal(a.breath,5);
  assert.deepEqual(a.blockPhases,r.phases);
  a=Breath.at(r,33.9);assert.equal(a.k,'out');assert.equal(a.intro,true);assert.equal(a.next.k,'in');
});

test('the circle fills on the inhale and empties on the exhale; a top-up takes the last 18 %; a hold keeps it; the square moves one side per phase',()=>{
  const r=Breath.resolve(B('sporo-disanje'),{min:5});
  assert.equal(Breath.at(r,0).level,0);near(Breath.at(r,3.999).level,1,'full at the end of the inhale');near(Breath.at(r,9.999).level,0,'empty at the end of the exhale');
  assert.ok(Breath.at(r,1).level<Breath.at(r,2).level);
  const c=Breath.resolve(B('ciklicki-uzdah'),{});near(Breath.at(c,2.999).level,0.82,'the first inhale');near(Breath.at(c,3.999).level,1,'the top-up');
  const q=Breath.resolve(B('kvadratno-disanje'),{min:1});
  near(Breath.at(q,6).level,1,'the hold after the inhale keeps it full');near(Breath.at(q,14).level,0,'the hold after the exhale keeps it empty');
  assert.deepEqual([1,5,9,13].map(t=>Breath.at(q,t).square.side),[0,1,2,3]);near(Breath.at(q,6).square.frac,0.5,'half the top');
  assert.equal(Breath.at(q,6).hold,true);assert.equal(Breath.at(q,1).hold,false);
  // the next phase and its key, for scheduling its tone ahead
  const a=Breath.at(q,3.9);assert.equal(a.next.k,'hold_in');assert.equal(a.nextKey,a.key+1);
  const b=Breath.at(q,15.9);assert.equal(b.next.k,'in');assert.equal(b.nextKey,Breath.at(q,16.1).key);
});

test('rhythm texts and Croatian plurals for the voice and VoiceOver: sekunda, sekunde, sekundi; 4,5 sekunde; udah, udaha',()=>{
  assert.deepEqual([1,2,3,4,5,10,11,12,14,21,22,25,101,111].map(Breath.secWord),
    ['sekunda','sekunde','sekunde','sekunde','sekundi','sekundi','sekundi','sekundi','sekundi','sekunda','sekunde','sekundi','sekunda','sekundi']);
  assert.equal(Breath.secWord(4.5),'sekunde');assert.equal(Breath.secWord(3.5),'sekunde');
  assert.deepEqual([1,2,4,5,11,21,60,71,72].map(Breath.breathWord),['udah','udaha','udaha','udaha','udaha','udah','udaha','udah','udaha']);
  assert.deepEqual([1,2,5,21].map(Breath.minWord),['minuta','minute','minuta','minuta']);
  const q=Breath.resolve(B('kvadratno-disanje'),{});
  assert.equal(Breath.spoken(q.phases),'Udah 4 sekunde, zadrži 4 sekunde, izdah 4 sekunde, zadrži 4 sekunde');
  assert.equal(Breath.spoken(Breath.resolve(B('sporo-disanje'),{preset:'spavanje'}).phases),'Udah 4,5 sekunde, izdah 5,5 sekunde');
  assert.equal(Breath.spoken(Breath.resolve(B('ciklicki-uzdah'),{}).phases),'Udah 3 sekunde, još malo 1 sekunda, izdah 6 sekundi');
  assert.equal(Breath.rhythm(q.phases,true),'4-4-4-4 s');assert.equal(Breath.rhythm(Breath.resolve(B('ciklicki-uzdah'),{}).phases,true),'3 + 1 + 6 s');
  assert.equal(Breath.rhythm(Breath.resolve(B('sporo-disanje'),{variant:'laksi-ritam'}).phases,true),'3,5/5 s');
  assert.equal(Breath.rhythm(Breath.resolve(B('sporo-disanje'),{}).phases),'Udah 4 s · izdah 6 s');
  assert.equal(Breath.perMin(Breath.resolve(B('sporo-disanje'),{})),6);assert.equal(Breath.fmt(603.5),'10:04');
  // the strings never carry the seconds of the live phase: only the pattern
  for(const id of ['sporo-disanje','ciklicki-uzdah','kvadratno-disanje'])assert.doesNotMatch(Breath.spoken(Breath.resolve(B(id),{}).phases),/undefined|NaN/);
});
