'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const Load=require('../training-load.js'),View=require('../training-load-view.js'),M=require('../muscle-work.js');
const now=new Date('2026-11-05T12:00:00').getTime();
const entry=(extra={})=>({historyId:'entry',kind:'protocol',name:'Trening',at:now-3600000,secs:300,srpe:5,...extra});
const render=(log,morning)=>View.render({summary:Load.summary({log,now}),morning});
test('the component exposes three independent indicators and existing accessible navigation',()=>{
  const html=render([entry()],{date:'2026-11-05',energy:4,legs:3,pain:0});
  for(const section of ['effort','muscles','readiness'])assert.match(html,new RegExp('data-load-section="'+section+'"'));
  for(const action of ['back','morningOpen','historyList'])assert.match(html,new RegExp('data-a="'+action+'"'));
  assert.match(html,/data-load-metric="current-au">25/);assert.match(html,/data-load-readiness="pain" data-value="0"/);assert.match(html,/ne ukupna ocjena spremnosti/);
  assert.match(html,/<caption>/);assert.match(html,/scope="col"/);
});
test('unknown total is a dash and a known subtotal is explicit rather than a complete score',()=>{
  const html=render([entry(),entry({historyId:'missing',srpe:undefined})]);
  assert.match(html,/data-load-period="current" data-total-au="" data-known-au="25" data-missing-au="1"/);
  assert.match(html,/data-load-metric="current-au">—/);assert.match(html,/Zbroj nije potpun/);assert.match(html,/25<\/span> AU poznato/);
});
test('the effort ring uses known AU shares and keeps unrated activities out of the arcs',()=>{
  const html=render([
    entry(),
    entry({historyId:'field',kind:'field',secs:900}),
    entry({historyId:'unknown',kind:'team',teamType:'match',srpe:undefined})
  ]);
  const arcs=Array.from(html.matchAll(/class="tl-dial-segment" data-load-ring-kind="([^"]+)"[^>]+stroke-dasharray="([\d.]+) ([\d.]+)"/g));
  assert.deepEqual(arcs.map(arc=>arc[1]),['protocol','field']);
  assert.ok(Math.abs((Number(arcs[0][2])+2.4)/Number(arcs[0][3])-.25)<1e-8);
  assert.ok(Math.abs((Number(arcs[1][2])+2.4)/Number(arcs[1][3])-.75)<1e-8);
  assert.match(html,/<strong>100<\/strong><small>AU poznato<\/small>/);
  assert.match(html,/data-load-ring-kind="match"><dt><i aria-hidden="true"><\/i>Utakmice<\/dt><dd><small>Nepoznato<\/small>/);
});
test('zero effort remains visible zero with no positive-height invented chart fill',()=>{
  const html=render([entry({srpe:0})]);assert.match(html,/data-load-metric="current-au">0/);assert.doesNotMatch(html,/class="tl-day-fill"/);assert.doesNotMatch(html,/Zbroj nije potpun/);
  assert.match(html,/data-load-ring-kind="protocol"><dt><i aria-hidden="true"><\/i>Protokoli<\/dt><dd>0 <small>AU<\/small>/);
  assert.doesNotMatch(html,/class="tl-dial-segment"/);
});
test('empty and legacy missing states do not expose fabricated AU or zero muscle tables',()=>{
  const html=render([entry({kind:null,srpe:undefined,secs:undefined})]);
  assert.match(html,/data-load-metric="current-au">—/);assert.match(html,/data-load-metric="muscle-sets">—/);assert.match(html,/<td>—<\/td>/);
  assert.match(html,/trajanje nije poznato/);assert.doesNotMatch(html,/0 poznatih min/);
  assert.match(render([entry({secs:0,srpe:0})]),/0 poznatih min/);
  const empty=render([]);assert.match(empty,/Još nema spremljenih treninga/);assert.match(empty,/Za danas nema jutarnjih podataka/);
});
test('stale or malformed morning inputs stay unknown while valid reported zero pain is kept',()=>{
  const stale=render([],{date:'2026-11-04',energy:5,legs:1,pain:0});assert.match(stale,/data-load-readiness="pain" data-value=""/);
  const invalid=render([],{date:'2026-11-05',energy:0,legs:6,pain:'0'});assert.match(invalid,/data-load-readiness="energy" data-value=""/);assert.doesNotMatch(invalid,/Bez boli/);
});
test('muscle display uses saved direct and secondary counts and states the limits of the separate LM1 model',()=>{
  const exercise={id:'press',name:'Potisak',cat:'Snaga',muscles:{prime:['front_chest'],sec:['back_triceps']}},item={exId:'press',sets:3,setsDone:3,done:true};
  const html=render([entry({muscleWork:[M.pack(M.completedItem(exercise,item))]})]);
  assert.match(html,/data-load-group="triceps" data-direct="0" data-secondary="3" data-equivalent="1.5"/);
  assert.match(html,/kilogrami i RIR ne ponderiraju/);assert.match(html,/Nema osobnu kalibraciju i ne koristi unesene kilograme/);
});
test('untrusted labels are escaped and invalid summary renders a safe empty page',()=>{
  const summary=Load.summary({log:[],now}),copy=JSON.parse(JSON.stringify(summary));
  copy.muscles.groups[0].label='<img onerror=bad>';copy.muscles.groups[0].equivalent=1;
  const html=View.render({summary:copy,morning:{date:'<svg onload=bad>'}});assert.doesNotMatch(html,/<img|<svg onload/);assert.match(html,/&lt;img/);
  assert.match(View.render({}),/Podaci za prikaz još nisu dostupni/);
});
