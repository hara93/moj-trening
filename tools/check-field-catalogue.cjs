'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const repo = path.join(__dirname, '..');
const app = fs.readFileSync(path.join(repo, 'app.js'), 'utf8');
const data = { window:{} };
vm.runInNewContext(fs.readFileSync(path.join(repo, 'data.js'), 'utf8'), data);
const seed = Object.fromEntries(Object.entries(data.window.SEED.field).map(([id,f])=>[id,{...f,id}]));
const region = app.split('/* ---------- field catalogue: editorial categories, independent of load estimates ---------- */')[1].split('/* ---------- end field catalogue data ---------- */')[0];
const context = {
  S:{field:seed,dbState:'ready'}, VIEWS:{}, I:{run:'',chev:'',cal:''}, SHOW_SOURCES:false,
  esc:s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
  plural:(n,a,b,c)=>n===1?a:n>=2&&n<=4?b:c,
  fieldSpec:()=>null,pathIcon:()=>'',fieldMin:()=>10,
  prePlanState:()=>({done:0,cells:Array.from({length:14},()=>({f:{}}))}),
  fieldPlanHtml:()=>'<div class="plan-sentinel">Existing plan</div>',
  stateNote:()=>'<div role="status">Učitavanje</div>',topbar:()=>'',backBtn:()=>''
};
vm.createContext(context);
vm.runInContext(region+';globalThis.Catalogue={categories:FIELD_CATEGORIES,category:fieldCategoryKey,items:fieldCatalogueItems};',context);
const renderer = app.slice(app.indexOf('function fieldRow(f){'),app.indexOf('/* ---------- pitch diagrams:'));
vm.runInContext(renderer,context);
const C=context.Catalogue;
const plain=x=>JSON.parse(JSON.stringify(x));

test('every shipped session has one reviewed category, including the MAS test and all plan identities',()=>{
  const counts={};for(const f of Object.values(seed)){const cat=C.category(f);assert.notEqual(cat,'other',f.id);counts[cat]=(counts[cat]||0)+1;}
  assert.deepEqual(counts,{endurance:15,speed:4,tests:1,agility:1});
  assert.equal(C.category(seed['mas-test-5-min']),'tests');
  assert.ok(Object.values(seed).filter(f=>f.group==='pre').every(f=>C.category(f)==='endurance'));
});

test('unknown imports stay visible in Other without deriving a category from words or load',()=>{
  assert.equal(C.category({id:'my-test',name_hr:'Sprint MAS test',goal_hr:'Brzina',load:{type:'test'}}),'other');
  assert.equal(C.category({id:'my-run',catalogueCategory:'agility'}),'agility');
  assert.equal(C.category({id:'my-run',catalogueCategory:'constructor'}),'other');
  assert.equal(C.category({id:'constructor'}),'other');
  assert.equal(C.category(null),'other');
});

test('catalogue sort preserves session objects, zero order and all imported groups without changing stored order',()=>{
  const source={later:{id:'later',order:2,group:'private'},first:{id:'first',order:0},tie:{id:'tie',order:2},unknown:{id:'unknown'}};
  const before=JSON.stringify(source), sorted=C.items(source);
  assert.deepEqual(plain(sorted.map(f=>f.id)),['first','later','tie','unknown']);
  assert.equal(sorted[1],source.later);assert.equal(JSON.stringify(source),before);
  const expected=['ss-pre-1a','ss-pre-1b','ss-pre-1c','ss-pre-2a','ss-pre-2b','ss-pre-2c','ss-pre-2d','ss-pre-3a','ss-pre-3b','ss-pre-3c','ss-pre-3d'];
  assert.deepEqual(plain(C.items(seed).filter(f=>f.group==='pre').map(f=>f.id)),expected);
  assert.equal(data.window.SEED_PLAN.pre.weeks.flatMap(w=>w.days).filter(Boolean).length,14);
});

test('catalogue renders all identities once, names safely, and keeps unknown groups reachable',()=>{
  context.S.field={...seed,custom:{id:'custom',name_hr:'<img src=x>',group:'private'}};
  const html=context.VIEWS.fieldList({});
  for(const id of Object.keys(context.S.field)) assert.equal(html.split('data-id="'+id+'"').length-1,1,id);
  assert.match(html,/data-cat="other"/);assert.match(html,/&lt;img src=x&gt;/);
  assert.doesNotMatch(html,/<img src=x>/);assert.match(html,/field-plan-sessions/);
  context.S.field=seed;
});

test('category selection exposes the right sessions and plan view delegates to the original schedule',()=>{
  const speed=context.VIEWS.fieldList({fieldCat:'speed'});
  assert.equal((speed.match(/data-a="openField"/g)||[]).length,4);
  assert.doesNotMatch(speed,/data-id="mas-test-5-min"/);
  const endurance=context.VIEWS.fieldList({fieldCat:'endurance'});
  assert.equal((endurance.match(/data-a="openField"/g)||[]).length,15);
  assert.match(endurance,/class="field-plan-sessions" open/);
  const plan=context.VIEWS.fieldList({fieldMode:'plan'});
  assert.match(plan,/plan-sentinel/);assert.equal((plan.match(/data-a="openField"/g)||[]).length,11);
  assert.doesNotMatch(plan,/data-id="mas-test-5-min"/);
});

test('loading, empty categories and absent plans provide distinct states and a way back',()=>{
  context.S.dbState='loading';assert.match(context.VIEWS.fieldList({}),/Učitavanje/);
  context.S.dbState='ready';const old=context.S.field;context.S.field={};
  assert.match(context.VIEWS.fieldList({}),/Još nema dostupnih/);
  context.S.field={'mas-test-5-min':seed['mas-test-5-min']};
  assert.match(context.VIEWS.fieldList({fieldCat:'agility'}),/Prikaži sve treninge/);
  assert.match(context.VIEWS.fieldList({fieldMode:'plan'}),/Otvori katalog/);
  context.S.field=old;
});
