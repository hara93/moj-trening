'use strict';
const test=require('node:test'), assert=require('node:assert/strict');
const model=require('../starting-load.js');
const describe=id=>({name:id,kind:id==='body'?'':'bar'});
test('bodyweight, optional weights, and band-and-pulley exercise do not require kilograms',()=>{
  assert.equal(model.kind({bw:true},['Šipka'],'bar'),'');
  assert.equal(model.kind({equipment:'Bučica (po želji)'},['Bučice'],'db'),'');
  assert.equal(model.kind({},['Elastično uže','Kolotur'],''),'');
  assert.equal(model.kind({},['Kolotur'],''),'cable');
  assert.equal(model.kind({},['Medicinka'],''),'ball');
  assert.deepEqual(model.requests([{exId:'body',kg:0},{exId:'press',kg:12}],describe),[]);
});
test('unset weight before starting prompts for each affected prescription, including timed work',()=>{
  const data=[{exId:'press',sets:2,kg:0},{exId:'carry',measure:'time'},{exId:'row',sets:2,kg:0,kgList:[10,null]}];
  assert.deepEqual(model.requests(data,describe).map(r=>r.index),[0,1,2]);
  assert.deepEqual(model.fill(data[2],5).kgList,[10,5]);
  assert.deepEqual(data[2].kgList,[10,null]);
});
test('zero for an unloaded landmine needs explicit confirmation and survives a round trip',()=>{
  const item={exId:'lm',sets:2,kg:0};
  assert.equal(model.parse('', 'lm'),null);
  assert.equal(model.parse('0','db'),null);
  assert.equal(model.parse('0','lm'),0);
  const filled=model.fill(item,0);
  assert.deepEqual(model.requests([JSON.parse(JSON.stringify(filled))],()=>({name:'LM',kind:'lm'})),[]);
  assert.equal(model.requests([filled],describe).length,1,'changing equipment to a bar asks for its total load');
  assert.equal(model.fill(filled,20).kg,20);
  assert.equal(item.startingKgKnown,undefined);
});
test('a prescribed unloaded set next to a weighted set is kept, even if an unrelated value is missing',()=>{
  const it={exId:'drop',sets:3,kg:0,kgList:[20,0,null]};
  assert.deepEqual(model.fill(it,12.5).kgList,[20,0,12.5]);
  assert.deepEqual(model.requests([model.fill(it,12.5)],describe),[]);
});
test('initial loads accept local decimals and reject blank, malformed or out-of-range input',()=>{
  for(const raw of ['0','-1','301','3,123','Infinity','.','1e2',' ']) assert.equal(model.parse(raw,'bar'),null,raw);
  assert.equal(model.parse('2,50','db'),2.5);
  assert.equal(model.parse('300','bar'),300);
});
test('quantity-only preview of a mixed prescription leaves an unresolved set blank and still prompts',()=>{
  const dose=require('../player-dose.js');
  const it={exId:'bar',sets:3,kg:0,kgList:[10,null,0],reps:8};
  const form={querySelector:()=>({value:'3'}),querySelectorAll:()=>['10','','0'].map((kg,i)=>({
    dataset:{doseSet:String(i+1)},querySelectorAll:()=>[
      {value:'7',dataset:{doseValue:'reps'}},
      {value:kg,dataset:{doseValue:'kg',unknownKg:String(model.missingSet(it,i,'bar'))}}
    ]
  }))};
  const parsed=dose.readForm(form);assert.equal(parsed.ok,true);
  const edited=dose.editItem(it,parsed.patch,{allowMissingWeight:true}).item;
  assert.deepEqual(edited.repsList,[7,7,7]);
  assert.deepEqual(edited.kgList,[10,null,0]);assert.equal(model.requests([edited],describe).length,1);
  assert.deepEqual(model.fill(edited,12).kgList,[10,12,0]);
  parsed.patch.rows[1].kg=0;
  const explicit=dose.editItem(it,parsed.patch,{allowMissingWeight:true}).item;
  assert.deepEqual(explicit.kgList,[10,0,0]);assert.equal(model.requests([explicit],describe).length,0);
});
test('unrelated protocol editor save retains weights, seconds and remembered zero; changed arrays affect only dose identity',async()=>{
  const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'), src=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
  const ctx={S:{pr:{pr:{}},stack:[{v:'pr',id:'pr'},{v:'build'}]},PROG_STATE:['ok','fail'],normGroups:x=>x,
    top:()=>ctx.S.stack.at(-1),planSaved(){},save:async()=>true,render(){},toast(){},startLoadDescription:()=>({kind:'lm'})};
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(__dirname,'../hash.js'),'utf8'),ctx);
  const sig=src.slice(src.indexOf('const doseSig ='),src.indexOf('\n',src.indexOf('const doseSig =')));
  const adjust=src.slice(src.indexOf('function fitSetLists'),src.indexOf('// an exercise added',src.indexOf('function fitSetLists')));
  const save=src.slice(src.indexOf('  savePr: async'),src.indexOf('  delPr:',src.indexOf('  savePr: async')));
  vm.runInContext(sig+'\n'+adjust+'\nglobalThis.A={'+save+'};globalThis.signature=doseSig;',ctx);
  const it={exId:'press',measure:'time',sets:2,kg:0,startingKgKnown:true,kgList:[10,0],sec:20,secList:[20,15],ok:2};
  const base={...it};it._d0=ctx.signature(it);ctx.S.draft={id:'pr',name:'Novi naslov',items:[it]};
  await ctx.A.savePr({});const saved=ctx.S.pr.pr.items[0];
  assert.deepEqual(Array.from(saved.kgList),[10,0]);assert.deepEqual(Array.from(saved.secList),[20,15]);assert.equal(saved.startingKgKnown,true);assert.equal(saved.ok,2);
  it.sets=3;ctx.fitSetLists(it);assert.deepEqual(it.kgList,[10,0,0]);assert.deepEqual(it.secList,[20,15,15]);
  it.sets=1;ctx.fitSetLists(it);assert.deepEqual(it.kgList,[10]);assert.deepEqual(it.secList,[20]);
  ctx.builderWeight(it,25,true);assert.equal(it.kg,25);assert.equal(it.kgList,undefined);assert.equal(it.startingKgKnown,undefined);
  const change={...base,kgList:[10,20],secList:[20,12]};assert.notEqual(ctx.mtDoseHash(change),ctx.mtDoseHash(base));
  assert.equal(ctx.mtStructHash({items:[base]}),ctx.mtStructHash({items:[change]}));
});
