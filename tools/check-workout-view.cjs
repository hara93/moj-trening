'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const View=require('../workout-view.js');

const planned='<ol class="set-list"><li class="set-item" data-state="planned"><span class="set-mark" aria-hidden="true">○</span><span class="set-info"><b>Serija 1</b><span>8 pon. · Početna težina nije upisana</span></span><small class="set-state">Planirana</small></li><li class="set-item" data-state="planned"><span class="set-mark" aria-hidden="true">○</span><span class="set-info"><b>Serija 2</b><span>6 pon. · 20 kg</span></span><small class="set-state">Planirana</small></li></ol>';

test('compact protocol overview keeps all blocks and per-set prescriptions visible without an image hero',()=>{
  const exercise=View.exercise({index:0,name:'Potisak',thumbHtml:'<img src="assets/bench.webp" alt="">',equipment:['Bučice','Klupa'],summary:'2 serije · različita ponavljanja',rest:60,rowsHtml:planned});
  const block=View.block({title:'Glavni dio',subtitle:'Superset A · naizmjenično',itemsHtml:exercise});
  const html=View.overview({topbarHtml:'<button data-a="back">Natrag</button>',title:'Snaga A',metaHtml:'<span>35 min · 4 vježbe</span>',description:'Kontrolirana izvedba',blocksHtml:block,detailsHtml:'<button data-a="prDays">Raspored</button>'});
  assert.match(html,/class="view workout-overview"/);
  assert.match(html,/<h1>Snaga A<\/h1>/);
  assert.match(html,/<h2>Glavni dio<\/h2>/);
  assert.ok(html.includes(planned));
  assert.equal((html.match(/class="set-item"/g)||[]).length,2);
  assert.doesNotMatch(html,/<details|class="hero|data-state="done"|\shidden(?:[\s=>])/);
  assert.match(html,/data-a="workoutExercise" data-j="0"/);
  assert.match(html,/aria-label="Otvori detalje vježbe: Potisak"/);
  assert.match(html,/workout-equipment-tag">Bučice/);
  assert.match(html,/workout-rest">Odmor 60 s/);
  assert.match(html,/data-a="back"/);
  assert.match(html,/data-a="prDays"/);
});

test('live done, partial and active row evidence and its only actionable checkbox pass through unchanged',()=>{
  const rows='<ol class="set-list"><li class="set-item" data-state="done"><span class="set-mark">✓</span><span class="set-info">Krug A1 · 8 pon. · 20 kg <span class="set-reserve" data-kind="rir">RIR 0</span></span></li><li class="set-item" data-state="partial"><span class="set-mark">◐</span><span class="set-info">15 s po strani<span class="set-sides">✓ Lijeva · ○ Desna</span></span></li><li class="set-item" data-state="active" aria-current="step"><button class="set-mark" data-a="checklistDone" data-j="0" data-set="3" data-step="8" aria-label="Potvrdi seriju"></button><span class="set-info">4 pon. · 25 kg</span></li></ol>';
  const html=View.exercise({index:0,name:'Stvarno odrađene serije',rowsHtml:rows,actionsHtml:'<button data-a="playDoseEdit" data-j="0">Uredi</button>'});
  assert.ok(html.includes(rows));
  assert.equal((html.match(/data-a="checklistDone"/g)||[]).length,1);
  assert.match(html,/data-step="8"/);
  assert.match(html,/✓ Lijeva · ○ Desna/);
  assert.match(html,/RIR 0/);
  assert.match(html,/data-a="playDoseEdit" data-j="0"/);
});

test('exercise panel separates current prescriptions from original previous actual evidence and supplied tools',()=>{
  const previous='<p>27. 10. 2026.</p><ol><li>1. serija · 4 pon. × 20 kg · RIR 2</li><li>2. serija · nije zabilježeno</li><li>3. serija · 3 pon. × 25 kg · RIR 1</li></ol>';
  const actions='<button data-a="previewDoseEdit" data-j="2">Uredi</button><button data-a="workoutHistory">Povijest</button><button data-a="workoutSwap">Zamijeni</button>';
  const html=View.panel({name:'Potisak',mediaHtml:'<video controls src="demo.mp4"></video>',equipment:'Bučice',summary:'Današnji plan · 2 serije',rowsHtml:planned,previousHtml:previous,actionsHtml:actions,targetHtml:'<span class="tag">Prsa</span>',note:'Vrijedi za ovu izvedbu.'});
  const currentAt=html.indexOf('class="workout-planned"'),previousAt=html.indexOf('class="workout-previous"');
  assert.ok(currentAt>0&&previousAt>currentAt);
  assert.ok(html.indexOf(planned)>currentAt&&html.indexOf(planned)<previousAt);
  assert.ok(html.indexOf(previous)>previousAt);
  assert.match(html,/<h4>Serije ove izvedbe<\/h4>/);
  assert.match(html,/<h4>Prethodno odrađeno<\/h4>/);
  assert.ok(html.includes(actions));
  assert.match(html,/role="group" aria-label="Mogućnosti vježbe"/);
  assert.match(html,/<video controls/);
  assert.doesNotMatch(html,/Effort|%/);
});

test('optional exercise instructions retain their disclosure and original escaped steps after tools',()=>{
  const instructions='<details><summary>Upute</summary><ol><li>Kontroliraj spuštanje.</li><li>&lt;tekst iz bilješke&gt;</li></ol></details>';
  const html=View.panel({name:'Potisak',actionsHtml:'<button data-a="workoutEdit">Uredi</button>',instructionsHtml:instructions,rowsHtml:planned});
  assert.ok(html.includes(instructions));
  assert.ok(html.indexOf('class="workout-tools"')<html.indexOf('class="workout-instructions-slot"'));
  assert.ok(html.indexOf('class="workout-instructions-slot"')<html.indexOf('class="workout-planned"'));
  assert.doesNotMatch(View.panel({name:'Nova vježba'}),/workout-instructions/);
});

test('plain names, context, equipment and notes are escaped; only named Html payloads are trusted',()=>{
  const unsafe='\"><img src=x onerror=bad()>';
  const fragment='<span class="trusted">Served media</span>';
  const pieces=[View.overview({title:unsafe,description:unsafe,metaHtml:fragment}),View.block({title:unsafe,subtitle:unsafe,itemsHtml:fragment}),View.exercise({index:0,name:unsafe,equipment:[unsafe],summary:unsafe,rest:unsafe,rowsHtml:fragment}),View.panel({name:unsafe,summary:unsafe,equipment:unsafe,note:unsafe,mediaHtml:fragment})];
  for(const html of pieces){assert.doesNotMatch(html,/<img src=x/);assert.match(html,/&lt;img src=x onerror=bad\(\)&gt;/);assert.ok(html.includes(fragment));}
  assert.doesNotMatch(View.exercise({index:'0" onclick="bad()',name:'Vježba'}),/data-j=|onclick=|<button/);
});

test('missing rows, equipment and history never invent a prescription, equipment choice or completed result',()=>{
  const html=View.panel({name:'Nova vježba'});
  assert.match(html,/Serije nisu navedene/);
  assert.match(html,/Prethodna izvedba nije dostupna/);
  assert.doesNotMatch(html,/workout-equipment-tag|data-state="done"|0 kg|\bRIR\b|<button/);
  assert.match(View.exercise({index:2,name:'Vježba',rest:0}),/Odmor 0 s/);
  assert.match(View.exercise({index:2,name:'Vježba',rest:'90 s'}),/Odmor 90 s<\/span>/);
  assert.doesNotThrow(()=>View.overview());
});

test('styles remain scoped to workout surfaces with a full-sized live checkbox and no hidden row rules',()=>{
  const css=fs.readFileSync(path.join(__dirname,'../workout.css'),'utf8');
  assert.doesNotMatch(css,/(?:^|[\s,])(?:\.home\b|\.carousel\b|\.hcard\b|#car\b|\.tabbar\b|body\b|:root\b)/m);
  assert.match(css,/\.set-mark\{min-width:44px;min-height:44px/);
  assert.match(css,/\.set-item\[data-state=partial\]/);
  assert.match(css,/\.set-reserve\[data-kind=sir\]/);
  assert.doesNotMatch(css,/\.set-(?:item|list)[^{]*\{[^}]*(?:display:none|visibility:hidden|height:0)/);
});

test('premium overview retains supplied original hero and description with compact exercise routes',()=>{
  const hero='<div class="hero"><img src="original-highres.webp" alt=""></div>';
  const row=View.compactExercise({index:2,name:'Potisak s klupe',thumbHtml:'<img src="bench-thumb.webp" alt="">',summary:'3 × 8 pon. · 50 kg'});
  const html=View.overview({heroHtml:hero,topbarHtml:'<button data-a="back">Natrag</button>',title:'Teretana A',description:'Izvorni opis treninga.',blocksHtml:View.list({itemsHtml:row})});
  assert.ok(html.includes(hero));
  assert.match(html,/workout-premium-overview/);
  assert.match(html,/Izvorni opis treninga/);
  assert.match(html,/class="workout-compact-row" data-a="workoutExercise" data-j="2"/);
  assert.match(html,/3 × 8 pon\. · 50 kg/);
  assert.doesNotMatch(row,/set-item|<input|data-state="done"/);
});

test('real app toolbar wrappers, sheet primary action and secondary library actions retain premium layout',()=>{
  const css=fs.readFileSync(path.join(__dirname,'../workout.css'),'utf8');
  const tools='<div class="workout-tools workout-tools-four"><button>Šipka</button><button>Zamjena</button><button>Povijest</button><button>Trendovi</button></div><section class="workout-equipment-menu">Varijante</section>';
  const html=View.exercisePage({toolsHtml:tools,footerHtml:'<div class="footer"><button class="btn">Pokreni</button><div class="workout-library-secondary"><button>Uredi</button></div></div>'});
  assert.ok(html.includes(tools));
  assert.match(css,/\.workout-detail-tools>\.workout-tools\{display:contents\}/);
  assert.match(css,/\.workout-detail-tools>\.workout-equipment-menu\{grid-column:1\/-1/);
  assert.match(css,/\.sheet\.workout-fullscreen \.workout-footer \.btn:not\(\.sec\):not\(\.danger\)\{background:#dce88d/);
  assert.match(css,/\.workout-library-secondary\{display:flex;flex-wrap:wrap/);
});

test('app compact rows preserve varying doses, unknown weight and intentional zero without repeating sides',()=>{
  const app=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
  const body=app.slice(app.indexOf('function workoutCompactHtml(items) {'),app.indexOf('\nfunction workoutCandidates('));
  const StartingLoad=require('../starting-load.js');
  const render=new Function('ssLetters','secOf','S','startLoadDescription','StartingLoad','WorkoutView','thumbHtml','esc',body+';return workoutCompactHtml;')(
    items=>items.map(()=>null),items=>items.map(()=>null),{ex:{bench:{name:'Potisak'},hold:{name:'Upor'}}},id=>id==='bench'?{kind:'bar'}:{kind:null},StartingLoad,View,()=>'',x=>String(x));
  let html=render([{exId:'bench',sets:2,measure:'sets',reps:5,repsList:[5,3],kg:20,kgList:[20,30]}]);
  assert.match(html,/2 × 5\/3 pon\. · 20\/30 kg/);
  html=render([{exId:'hold',sets:2,measure:'time',sec:12,secList:[12,8],kg:0,sides:true}]);
  assert.match(html,/2 × 12\/8 s po strani/);assert.equal((html.match(/po strani/g)||[]).length,1);
  html=render([{exId:'bench',sets:3,reps:5,kg:0,kgList:[10,null,0]}]);
  assert.match(html,/10\/—\/0 kg · dio težina nije upisan/);
  html=render([{exId:'bench',sets:2,reps:5,kg:0}]);assert.match(html,/težina nije upisana/);
  html=render([{exId:'bench',sets:5,reps:5,repsList:[8,7,6,5,4],kg:20,kgList:[20,20,25,25,30]}]);assert.match(html,/5 serija · 4–8 pon\. · 20–30 kg/);
});

test('journal info sits over its thumbnail as a separate accessible button with a 44px target',()=>{
  const html=View.journalExercise({index:0,name:'Potisak',thumbHtml:'<img src="bench.webp" alt="">',infoHtml:'<button data-a="workoutInfo" aria-label="Upute za potisak">i</button>',rowsHtml:'<table></table>'});
  assert.match(html,/<\/button><span class="workout-journal-info"><button data-a="workoutInfo" aria-label="Upute za potisak">i<\/button><\/span><\/header>/);
  const css=fs.readFileSync(path.join(__dirname,'../workout.css'),'utf8');
  assert.match(css,/\.workout-journal-info\{position:absolute;left:calc\(var\(--wk-thumb\) - 40px\)/);
  assert.match(css,/\.workout-journal-info>button\{[^}]*width:44px;height:44px;min-width:44px;min-height:44px/);
  assert.match(css,/\.workout-journal-info>button::before\{[^}]*width:24px;height:24px/);
});

test('full exercise page preserves high-resolution media and the sole info slot over the image before fixed toolbar and table',()=>{
  const media='<div class="media two"><img src="highres.webp" alt=""></div>',info='<button data-a="workoutInfo">O vježbi</button>';
  const toolbar='<button data-a="workoutEquipment">Šipka</button><button data-a="workoutSwap">Zamjena</button><button data-a="workoutHistory">Povijest</button><button data-a="workoutTrends">Trendovi</button>';
  const table=View.seriesTable({name:'Potisak',rowsHtml:'<tr data-state="planned"><td>1</td><td>8</td><td>50</td><td>—</td></tr>'});
  const html=View.exercisePage({name:'Potisak',mediaHtml:media,infoHtml:info,topbarHtml:'<button data-a="back">Natrag</button>',previousHtml:'Prethodno50kg',toolsHtml:toolbar,rowsHtml:table,footerHtml:'<button data-a="startPr">Pokreni</button>'});
  assert.ok(html.includes(media));
  assert.equal(html.split(info).length-1,1);
  assert.ok(html.indexOf(info)<html.indexOf('class="workout-detail-main"'));
  assert.ok(html.indexOf(toolbar)<html.indexOf(table));
  assert.match(html,/<div class="workout-footer"><button data-a="startPr"/);
  assert.doesNotMatch(html,/swrow|play-card-row|workout-panel-media/);
});

test('series tables adapt seconds/SIR while preserving every actual editable state, side detail and unknown field',()=>{
  const rows='<tr class="workout-set-row" data-state="partial"><td class="workout-set-number"><button class="set-mark" data-a="checklistDone" disabled>◐</button></td><td><input data-field="sec" value="10"></td><td><input value="0"></td><td><input data-field="sir" placeholder="—" value=""></td></tr><tr class="workout-set-details"><td colspan="4">Lijeva odrađena · desna nije odrađena</td></tr>';
  const html=View.seriesTable({name:'Bočni plank',measure:'time',weightLabel:'kg',rowsHtml:rows});
  assert.ok(html.includes(rows));
  assert.match(html,/<th scope="col">Sek\.<\/th>/);
  assert.match(html,/<th scope="col">SIR \(s\)<\/th>/);
  assert.doesNotMatch(html,/>Pon\.<|data-state="done"/);
  const journal=View.journal({title:'Snaga',blocksHtml:View.journalExercise({index:0,name:'Bočni plank',rowsHtml:html})});
  assert.ok(journal.includes(html));
  assert.match(journal,/class="view workout-journal"/);
  assert.doesNotMatch(journal,/swrow|play-card-row|<details/);
});

test('instructions preserve provided anatomical figure and distinguish primary versus secondary labels',()=>{
  const figure='<svg role="img"><path class="body-rg is-prime"/><path class="body-rg is-on"/></svg>';
  const html=View.instructions({name:'Potisak',why:'Kontrolirani potisak.',steps:['Namjesti stopala.','<Sigurna bilješka>'],figureHtml:figure,primary:['Prsa'],secondary:['Ramena','Triceps']});
  assert.ok(html.includes(figure));
  assert.match(html,/Kako pravilno izvesti/);
  assert.match(html,/&lt;Sigurna bilješka&gt;/);
  assert.match(html,/<strong>Glavni<\/strong>Prsa/);
  assert.match(html,/<strong>Pomoćni<\/strong>Ramena, Triceps/);
  const css=fs.readFileSync(path.join(__dirname,'../workout.css'),'utf8');
  assert.match(css,/\.workout-anatomy \.body-rg\.is-prime\{fill:#4f7ccd!important/);
  assert.match(css,/\.workout-anatomy \.body-rg\.is-on\{fill:#a7c1ee!important/);
});

const points=[{at:new Date(2026,9,13).getTime(),value:42.5,context:'8 pon. · RIR 2'},{at:new Date(2026,9,20).getTime(),value:45,context:'8 pon. · RIR 2'},{at:new Date(2026,9,27).getTime(),value:47.5,context:'8 pon. · RIR 2'},{at:new Date(2026,10,3).getTime(),value:50,context:'8 pon. · RIR 2'}];
test('actual point charts render line/bar series and an accessible complete table without invented example values',()=>{
  const line=View.chart({id:'strength',title:'Radna težina',subtitle:'8 ponavljanja u seriji',unit:'kg',points});
  assert.match(line,/workout-line-chart/);
  assert.match(line,/class="workout-chart-line"/);
  assert.equal((line.match(/class="workout-chart-dot"/g)||[]).length,4);
  assert.match(line,/>42,5 kg<\/td>/);
  assert.equal((line.match(/scope="row"/g)||[]).length,4);
  assert.match(line,/8 pon\. · RIR 2/);
  const bar=View.chart({id:'volume',title:'Volumen tereta',type:'bar',unit:'kg',points:points.map((p,i)=>({...p,value:[1020,1080,1140,1200][i]}))});
  assert.equal((bar.match(/class="workout-chart-bar"/g)||[]).length,4);
  assert.doesNotMatch(bar,/workout-chart-line/);
  assert.match(bar,/role="img" aria-label="Volumen tereta:/);
  assert.doesNotMatch(line+bar,/primjerne izvedbe|demo|NaN|Infinity/);
});

test('unknown and zero chart values remain distinct; missing values break lines and never revive an older latest value',()=>{
  const broken=View.chart({title:'Izvedbe',unit:'kg',points:[points[0],{...points[1],value:null},points[2],{...points[3],value:null}]});
  assert.equal((broken.match(/class="workout-chart-dot"/g)||[]).length,2);
  assert.doesNotMatch(broken,/class="workout-chart-line"/);
  assert.match(broken,/<strong>— <small>kg<\/small>/);
  assert.equal((broken.match(/<td>Nije zabilježeno<\/td>/g)||[]).length,2);
  const zero=View.chart({type:'bar',points:[{at:points[0].at,value:0}]});
  assert.match(zero,/height="0"/);
  assert.match(zero,/<strong>0 <small>/);
  const empty=View.chart({points:[{at:points[0].at,value:null},{at:NaN,value:500}]});
  assert.doesNotMatch(empty,/<svg|workout-chart-dot|workout-chart-bar/);
  assert.match(empty,/još nema zabilježenih vrijednosti/);
  assert.doesNotMatch(empty,/500/);
});

test('premium plain titles, contexts and units stay escaped while supplied markup remains unchanged',()=>{
  const unsafe='<img src=x onerror=bad()>',trusted='<button data-a="kept">Akcija</button>';
  const outputs=[View.compactExercise({index:0,name:unsafe,summary:unsafe}),View.exercisePage({name:unsafe,note:unsafe,toolsHtml:trusted}),View.journal({title:unsafe,noticeHtml:trusted}),View.instructions({name:unsafe,why:unsafe,primary:[unsafe],steps:[unsafe]}),View.chart({id:'x" onclick="bad()',title:unsafe,subtitle:unsafe,unit:unsafe,points:[{...points[0],context:unsafe}]}),View.trends({name:unsafe,subtitle:unsafe,note:unsafe,currentHtml:trusted})];
  outputs.forEach(html=>{assert.doesNotMatch(html,/<img src=x/);assert.match(html,/&lt;img src=x onerror=bad\(\)&gt;/);});
  assert.ok(outputs[1].includes(trusted)&&outputs[2].includes(trusted)&&outputs[5].includes(trusted));
});
