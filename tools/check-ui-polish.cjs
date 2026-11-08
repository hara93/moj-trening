'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const repo=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(repo,file),'utf8');
const source=read('app.js');
function section(start,end){const a=source.indexOf(start),b=source.indexOf(end,a);assert.ok(a>=0&&b>a,start);return source.slice(a,b);}
test('the journal target line has no dangling separator when there is no target',()=>{
  // 1.22.0: the player journal's open card has a meta line "Proc. 1RM … · Cilj RIR n"; the separator joins two parts
  // only when both exist, and the rest is no longer glued to it
  const line=section('const undo=swapped,','const chips=');   // 1.22.0: the swapped flag is read once per card
  assert.doesNotMatch(line,/item\.rest/,'no rest glued to the target');
  assert.match(line,/\(e1&&target\?' · ':''\)/);
  assert.match(read('workout.css'),/\.workout-detail-target\{display:flex;[^}]*justify-content:space-between/);
});
test('the player menu uses one icon set and one divider between groups',()=>{
  const menu=section('function cinemaMenuPopoverHtml(){','\n}');
  assert.doesNotMatch(menu,/\bI\.[a-zA-Z]+/,'no second icon set in the menu');
  assert.equal((menu.match(/WorkoutView\.icon\('/g)||[]).length,7);
  const W=require('../workout-view.js');for(const name of ['info','circle-check','x','share-2'])assert.ok(W.icon(name),name);
  const css=read('app-layout.css');
  assert.match(css,/\.cinema-popover \.cinema-menu-grid\{[^}]*padding-bottom:0;border-bottom:0\}/,'the grid border does not double the group border');
  assert.match(css,/\.cinema-popover-group\{[^}]*border-top:1px/);
});
test('disclosure rows use the Danas accordion row instead of the bare ▶ marker',()=>{
  const css=read('style.css');
  for(const cls of ['workout-expectation','workout-protocol-options','tl-analysis-details','dy-previous','protocol-muscles','ltab','tl-details','tl-model-note','pg-activity-table']){
    assert.match(css,new RegExp(':is\\([^)]*\\b'+cls+'\\b[^)]*\\)>summary\\{[^}]*list-style:none'),cls);
    assert.match(css,new RegExp(':is\\([^)]*\\b'+cls+'\\b[^)]*\\)>summary::-webkit-details-marker\\{display:none\\}'),cls);
  }
  assert.match(source,/<details class="workout-protocol-options"><summary>/);
  assert.match(source,/<details class="workout-expectation"/);
  assert.match(read('training-load-view.js'),/<details class="tl-analysis-details"/);
  assert.match(read('today-view.js'),/<details class="dy-panel dy-previous"><summary>/);
});
test('the journal collapse arrow is not positioned over the thumbnail',()=>{
  const css=read('app-layout.css');
  assert.match(css,/\.cinema-journal \.workout-journal-info\{position:static;[^}]*margin-left:auto/);
});
test('small text on the player screen is at least 13 px, the last rule for each selector',()=>{
  const css=read('workout.css'),block=css.slice(css.lastIndexOf('/* 1.21: small text on the player screen'));
  const selectors=['.workout-cinema-heading p','.workout-cinema-notice','.workout-cinema-next small','.workout-cinema .cinema-next small','.cinema-weight-value small',
    '.workout-cinema-clock .workout-control-action','.workout-cinema-journal>button>span:last-child','.cinema-pause-actions button small'];
  assert.match(block,/\{font-size:13px\}/);
  for(const selector of selectors)assert.ok(block.includes(selector),selector);
  // 1.22.0: the player redesign styles these after the block; a later size may be larger, never below 13 px
  const after=css.slice(css.indexOf('{font-size:13px}',css.lastIndexOf('/* 1.21: small text'))+16);
  for(const [,list,body] of after.matchAll(/([^{}]+)\{([^{}]*)\}/g)){
    const size=body.match(/font-size:(\d+(?:\.\d+)?)px/);
    if(size&&Number(size[1])<13)for(const selector of list.split(',').map(x=>x.trim()))assert.ok(!selectors.includes(selector),'nothing after the block lowers it again: '+selector);
  }
});
test('no stylesheet loaded after workout.css lowers the small player text again (index.html link order)',()=>{
  const links=[...read('index.html').matchAll(/<link rel="stylesheet" href="([a-z-]+\.css)">/g)].map(m=>m[1]);
  const later=links.slice(links.indexOf('workout.css')+1);
  assert.deepEqual(later,['training-load.css','app-layout.css']);
  const selectors=['.workout-cinema .cinema-next','.workout-cinema .cinema-next small','.workout-cinema-next small','.cinema-weight-value small','.workout-cinema-heading p'];
  for(const file of later)for(const [,list,body] of read(file).matchAll(/([^{}]+)\{([^{}]*)\}/g)){
    const size=body.match(/font-size:(\d+(?:\.\d+)?)px/);
    if(!size||Number(size[1])>=13)continue;
    for(const selector of list.split(',').map(x=>x.trim()))assert.ok(!selectors.includes(selector),file+': '+selector+' at '+size[1]+'px');
  }
});
test('the load dial total stays on one line',()=>{
  const rule=read('training-load.css').match(/\.tl-dial-readout strong \{[^}]*\}/)[0];
  assert.match(rule,/white-space:nowrap/);
  assert.match(rule,/calc\(34vw \/ var\(--tl-dial-glyphs\)\)/,'six glyphs (11.791) fit 67 % of the dial at 375 px');
});
