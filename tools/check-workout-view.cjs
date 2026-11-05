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
