'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const repo=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(repo,file),'utf8');
const source=read('app.js');
function section(start,end){const a=source.indexOf(start),b=source.indexOf(end,a);assert.ok(a>=0&&b>a,start);return source.slice(a,b);}
test('the journal target line has no dangling separator when there is no target',()=>{
  const line=section('WorkoutView.journalExercise({','rowsHtml:');
  assert.doesNotMatch(line,/\+\(item\.rest\?' · odmor/,'no separator glued to the rest');
  // the row is a space-between flex row: target and rest are separate spans, no text separator at all
  assert.match(line,/targetHtml:\[workoutTargetHtml\(item\),item\.rest\?'<span class="workout-rest">Odmor '\+esc\(item\.rest\)\+' s<\/span>':''\]\.filter\(Boolean\)\.join\(''\)/);
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
  for(const cls of ['workout-expectation','workout-protocol-options','tl-analysis-details','dy-previous']){
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
  assert.equal(css.indexOf('font-size',css.indexOf('{font-size:13px}',css.lastIndexOf('/* 1.21: small text'))+16),-1,'nothing after the block lowers it again');
});
