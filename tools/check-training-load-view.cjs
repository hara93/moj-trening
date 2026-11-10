'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const Load=require('../training-load.js'),View=require('../training-load-view.js'),M=require('../muscle-work.js');
const now=new Date('2026-11-05T12:00:00').getTime();
const entry=(extra={})=>({historyId:'entry',kind:'protocol',name:'Trening',at:now-3600000,secs:300,srpe:5,...extra});
const render=(log,morning)=>View.render({summary:Load.summary({log,now}),morning});
test('the embedded component exposes three independent indicators under the shared analysis controls',()=>{
  const html=render([entry()],{date:'2026-11-05',energy:4,legs:3,pain:0});
  assert.match(html,/^<section id="analysis-load"/);
  assert.doesNotMatch(html,/data-a="(?:analyticsMode|trainingLoadRange)"/);
  for(const section of ['effort','muscles','readiness'])assert.match(html,new RegExp('data-load-section="'+section+'"'));
  for(const action of ['trainingLoadDetail','morningOpen','historyList'])assert.match(html,new RegExp('data-a="'+action+'"'));
  assert.match(html,/data-load-metric="current-au">25/);assert.match(html,/data-load-readiness="pain" data-value="0"/);assert.match(html,/ne ukupna ocjena spremnosti/);
  assert.match(html,/<caption>/);assert.match(html,/scope="col"/);
});
test('unknown total is a dash and a known subtotal is explicit rather than a complete score',()=>{
  const html=render([entry(),entry({historyId:'missing',srpe:undefined})]);
  assert.match(html,/data-load-period="current" data-total-au="" data-known-au="25" data-missing-au="1"/);
  assert.match(html,/data-load-metric="current-au">—/);assert.match(html,/Zbroj nije potpun/);assert.match(html,/25<\/span> <span aria-hidden="true">j\.n\.<\/span><span class="tl-sr">jedinice napora<\/span> poznato/);
});
test('the effort ring uses known AU shares and keeps unrated activities out of the arcs',()=>{
  const html=render([
    entry(),
    entry({historyId:'field',kind:'field',secs:660}),
    entry({historyId:'unknown',kind:'team',teamType:'match',srpe:undefined})
  ]);
  const arcs=Array.from(html.matchAll(/class="tl-dial-segment" data-load-ring-kind="([^"]+)"[^>]+stroke-dasharray="([\d.]+) ([\d.]+)"/g));
  assert.deepEqual(arcs.map(arc=>arc[1]),['protocol','field']);
  const [,tick,gap]=/class="tl-dial-track"[^>]+stroke-dasharray="([\d.]+) ([\d.]+)"/.exec(html).map(Number);
  const step=tick+gap;
  assert.ok(Math.abs(Number(arcs[0][3])/step-28)<1e-8);
  assert.ok(Math.abs(Number(arcs[0][2])-(8*step+.75*tick))<1e-8);
  assert.ok(Math.abs(Number(arcs[0][2])+Number(arcs[1][2])-Number(arcs[0][3]))<1e-8);
  assert.match(html,/<strong>80<\/strong><small>j\.n\. poznato<\/small>/);
  assert.match(html,/data-load-ring-kind="match"><dt><i aria-hidden="true"><\/i>Utakmice<\/dt><dd><small>Nepoznato<\/small>/);
});
test('zero effort remains visible zero with no positive-height invented chart fill',()=>{
  const html=render([entry({srpe:0})]);assert.match(html,/data-load-metric="current-au">0/);assert.doesNotMatch(html,/class="tl-day-fill"/);assert.doesNotMatch(html,/Zbroj nije potpun/);
  assert.match(html,/data-load-ring-kind="protocol"><dt><i aria-hidden="true"><\/i>Protokoli<\/dt><dd><span aria-hidden="true">0 <small>j\.n\.<\/small><\/span><span class="tl-sr">0 jedinica napora<\/span>/);
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

// 1.24.0: one unit of effort in the whole app, "j.n." (jedinice napora), explained where the first number stands
test('1.24.0: the effort screen says "j.n.", explains it once beside the first number and speaks the words',()=>{
  const visible=html=>html.replace(/<[^>]*>/g,' ');
  {
    const html=View.render({summary:Load.summary({log:[entry(),entry({historyId:'two',at:now-2*86400000,secs:600,srpe:3})],now})});
    assert.doesNotMatch(visible(html),/\bAU\b/,'no "AU" in any visible text');
    assert.doesNotMatch(html,/(?:aria-label|<title>)[^<]*\bAU\b/,'nor in a spoken one');
    assert.equal((html.match(/j\.n\. su jedinice napora: tvoja ocjena × minute\./g)||[]).length,2,'explained once on the page and once in its detail window, under the first number');
    assert.ok(html.indexOf('data-load-metric="current-au"')<html.indexOf('j.n. su jedinice napora'));
    assert.match(html,/<text class="tl-axis" x="1" y="16">j\.n\.<\/text>/);
    assert.match(html,/aria-label="[^"]*: 30 jedinica napora poznato[^"]*: 25 jedinica napora poznato/);
    assert.match(html,/Kratica j\.n\. znači jedinice napora\./);
    assert.match(html,/<th scope="col">Napor \(<span aria-hidden="true">j\.n\.<\/span><span class="tl-sr">jedinice napora<\/span>\)<\/th>/);
    // outside the charts too: every "j.n." in the markup is either hidden from a screen reader beside its spoken words, part of an explanation, or inside a named button or chart
    assert.match(html,/<p class="tl-unit-note">j\.n\. su jedinice napora: tvoja ocjena × minute\.<\/p>/,'the explanation is its own paragraph (13 px in training-load.css)');
    assert.match(html,/class="tl-effort-total" data-a="trainingLoadInfo" data-topic="effort" aria-haspopup="dialog" aria-label="Napor treninga · [^"]*jedinic[ae] napora · [^"]*\. Otvori objašnjenje"/);
    const bare=html.replace(/<svg[\s\S]*?<\/svg>/g,'').replace(/<button[^>]*aria-label[\s\S]*?<\/button>/g,'').replace(/<span aria-hidden="true">(?:[^<]|<\/?small>)*<\/span><span class="tl-sr">(?:[^<]*jedinic[ae] napora[^<]*|napor nije poznat)<\/span>/g,'')
      .replace(/<[^>]*>/g,' ').replace(/Kratica j\.n\. znači jedinice napora|j\.n\. su jedinice napora|Jedinice napora \(j\.n\.\)/g,'');
    assert.deepEqual(bare.match(/.{0,30}j\.n\..{0,20}/g)||[],[],'no bare "j.n." is left for a screen reader');
  }
  const words=n=>View.render({summary:Load.summary({log:[entry({secs:60,srpe:n})],now})}).match(/<title>[^<]*: ([^<]+)<\/title>/g).pop();
  assert.match(words(1),/: 1 jedinica napora</);assert.match(words(3),/: 3 jedinice napora</);assert.match(words(5),/: 5 jedinica napora</);
  assert.match(View.render({summary:Load.summary({log:[entry({secs:90,srpe:3})],now})}),/: 4,5 jedinice napora</);
});
