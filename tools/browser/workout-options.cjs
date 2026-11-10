'use strict';

// 1.24.0: "Opcije treninga", the sheet behind ⋯ on a workout's page. Every state of the sheet and every action in it,
// with real taps, at 375 and 393 px with a 34 px bottom safe area. Synthetic data only.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {artifacts,engine,fixture:baseFixture,launch,serve,repo}=require('./runtime.cjs');
const Muscle=require(path.join(repo,'muscle-work.js'));
const NOW=new Date('2026-11-09T09:30:00+01:00').getTime(),DAY=86400000;
const PROGRAM='opt-program',LONG='Snaga cijelo tijelo s vrlo dugim nazivom koji stane u dva retka';
const results=[];

function fixture(){
  const d=baseFixture();d.log=[];d.field={};d.settings.sound=false;d.settings.planDates={};d.settings.matchDates={};d.settings.matchDay=-1;d.settings.goal='snaga';
  const it=(exId,sets,reps,kg,rest,more)=>({exId,measure:'sets',sets,reps,sec:30,kg,rest,sides:false,...more});
  const full=()=>[it('goblet-squat',3,10,20,75,{section:'Glavni dio'}),it('push-up',3,12,0,60),it('hip-thrust',3,10,80,90),it('bench-press',3,8,60,120)];
  const own={
    'opt-new':{name:'Novi trening',days:[],items:[it('monster-walk',2,10,0,0,{ss:'a',section:'Glavni dio'}),it('banded-glute-bridge',3,12,0,30,{ss:'a'})]},
    'opt-full':{name:'Snaga cijelo tijelo',days:[0,3],items:full()},
    'opt-one':{name:'Jednom odrađen',days:[2],items:[it('goblet-squat',3,10,20,75),it('push-up',3,12,0,60)]},
    'opt-kg':{name:'Bez kilograma',days:[],items:[it('back-squat',4,5,0,150),it('push-up',3,12,0,60)]},
    'opt-empty':{name:'Bez vježbi',days:[],items:[]},
    'opt-long':{name:LONG,days:[0,2,4],items:full()},
    'opt-delete':{name:'Za brisanje',days:[],items:[it('push-up',3,12,0,60)]},
    'opt-session':{name:'1. tjedan A',program:PROGRAM,week:1,slot:0,items:[it('back-squat',4,6,40,150,{section:'Glavni dio'}),it('rdl',3,8,70,120),it('dead-bug',3,8,0,45,{sides:true})]}
  };
  for(const [id,p] of Object.entries(own))d.protocols[id]={id,desc:'',updatedAt:NOW-DAY,...p};
  d.protocols['snaga-b'].days=[2];d.protocols['trx-krug'].days=[];
  d.programs={[PROGRAM]:{id:PROGRAM,name:'Kontrolni program',desc:'',days:[1,4],weeks:[{week:1,sessions:[{label:'A',pr:'opt-session'}]}]}};
  let n=0;
  const run=(id,daysAgo,secs,srpe,kgs)=>{
    const p=d.protocols[id],items=p.items.map((x,j)=>{const kg=kgs?kgs[j]:x.kg;return {exId:x.exId,measure:x.measure,sets:x.sets,setsDone:x.sets,reps:x.reps,sec:x.sec,kg,sides:!!x.sides,rest:x.rest,done:true,
      setNumbers:Array.from({length:x.sets},(_,i)=>i+1),sideCounts:Array(x.sets).fill(x.sides?2:1),repsList:Array(x.sets).fill(x.reps),kgList:Array(x.sets).fill(kg),rirList:Array(x.sets).fill(2)};});
    return {historyId:'opt-run-'+(++n),kind:'protocol',refId:id,name:p.name,at:NOW-daysAgo*DAY+8*3600000,secs,srpe,items,
      muscleWork:items.map(item=>Muscle.pack(Muscle.completedItem(d.exercises[item.exId],item)))};
  };
  // three rated runs of exactly the planned dose: 6 × 28 min, 7 × 29 min, 7 × 27 min → 168–203 j.n.
  d.log.push(run('opt-full',20,1680,6),run('opt-full',13,1740,7),run('opt-full',6,1620,7),run('opt-long',6,1620,7),run('opt-long',13,1740,7),
    run('opt-one',5,900,5),run('opt-kg',4,1500,6,[80,0]));   // the squat at 80 kg is what the programme session's kilogram proposal is computed from
  d.log.sort((a,b)=>b.at-a.at);
  return d;
}

const store=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('mt.data.v1')));
const sheet=p=>p.locator('.sheet[data-kind="workoutProtocolOptions"]');
const inSheet=(p,selector)=>sheet(p).locator(selector);
// navigation that is not under test: a hidden button with the app's own action
const act=(p,a,data={})=>p.evaluate(({a,data})=>{const b=document.createElement('button');b.dataset.a=a;for(const [k,v] of Object.entries(data))b.dataset[k]=String(v);
  b.style.cssText='position:fixed;left:0;top:0;width:1px;height:1px;opacity:0';document.getElementById('app').appendChild(b);b.click();b.remove();},{a,data});
async function page_(p,id){
  await p.reload({waitUntil:'domcontentloaded'});await p.getByRole('heading',{name:'Bok, Tomislav',exact:true}).waitFor();
  await act(p,'openPr',{id});await p.locator('.workout-overview').waitFor();
}
async function open(p,id,how='click'){
  await page_(p,id);const more=p.locator('[data-a="workoutProtocolOptions"]');
  assert.equal(await more.getAttribute('aria-label'),'Opcije treninga');
  await more[how]();await sheet(p).waitFor();
}
const focused=p=>p.evaluate(()=>{const el=document.activeElement;return el?{id:el.id,a:el.dataset.a||'',i:el.dataset.i||'',tag:el.tagName}:null;});
// what the rules ask of every state: nothing wider than the screen, no text under 13 px, no tap target under 44 px, the
// sheet as tall as its content (at most 80 % of the screen), ending at the bottom edge with the safe area under the last row
async function measure(p,label,{fits=false}={}){
  const m=await sheet(p).evaluate(sh=>{
    const r=sh.getBoundingClientRect(),vw=innerWidth,over=[],small=[],tiny=[],unnamed=[];
    for(const e of sh.querySelectorAll('*')){
      const b=e.getBoundingClientRect();if(!b.width||!e.getClientRects().length||e.closest('.wopt-sr'))continue;
      if(b.right>vw+.5||b.left<-.5)over.push((e.className||e.tagName)+' '+Math.round(b.left)+'→'+Math.round(b.right));
      const own=Array.from(e.childNodes).some(n=>n.nodeType===3&&n.textContent.trim());
      if(own&&parseFloat(getComputedStyle(e).fontSize)<13)small.push(e.tagName+'.'+e.className+' '+getComputedStyle(e).fontSize);
      if(e.matches('button,a,summary,[role=button]')&&!e.matches('.sheet-drag-handle')){
        if(b.height<44||b.width<44)tiny.push((e.dataset.a||e.className)+' '+Math.round(b.width)+'x'+Math.round(b.height));
        if(!(e.getAttribute('aria-label')||e.innerText||'').trim())unnamed.push(e.dataset.a||e.className);
      }
    }
    const last=sh.querySelector('.wopt').getBoundingClientRect();
    return {height:r.height,bottom:r.bottom,vh:innerHeight,vw,docW:document.documentElement.scrollWidth,scrollH:sh.scrollHeight,clientH:sh.clientHeight,
      padBottom:parseFloat(getComputedStyle(sh).paddingBottom),gapUnder:Math.round(sh.scrollHeight-(last.bottom-r.top+sh.scrollTop)),over,small:[...new Set(small)],tiny:[...new Set(tiny)],unnamed};
  });
  assert.deepEqual(m.over,[],label+': nothing reaches past the screen');assert.ok(m.docW<=m.vw,label+': no horizontal scroll');
  assert.deepEqual(m.small,[],label+': no text under 13 px');assert.deepEqual(m.tiny,[],label+': no tap target under 44 px');
  assert.deepEqual(m.unnamed,[],label+': every button has a name');
  assert.ok(Math.abs(m.bottom-m.vh)<=1,label+': the sheet ends at the bottom edge');
  assert.ok(m.height<=m.vh*.8+1,label+': at most 80 % of the screen');
  assert.equal(m.padBottom,58,label+': 24 px plus the 34 px safe area under the content');
  assert.equal(m.gapUnder,58,label+': no blank area under the last row');
  if(fits)assert.ok(m.scrollH<=m.clientH+1,label+': the closed sheet needs no scrolling ('+m.scrollH+' in '+m.clientH+')');
  return m;
}
// what is on the screen: the text for screen readers only (.wopt-sr) is checked on its own
const text=async p=>(await sheet(p).evaluate(node=>{for(const sr of node.querySelectorAll('.wopt-sr'))sr.hidden=true;const shown=node.innerText;for(const sr of node.querySelectorAll('.wopt-sr'))sr.hidden=false;return shown;})).replace(/\s+/g,' ').trim();
const shot=(p,name,width)=>p.screenshot({path:path.join(artifacts,'workout-options-'+engine+'-'+name+'-'+width+'.png')});

// ---- every state: what it shows, and its measurements closed, opened and with the delete question
async function states(p,width){
  const seen={};
  const each=async(id,fits,check)=>{
    await open(p,id);const closed=await text(p);seen[id]=closed;
    assert.doesNotMatch(closed,/\bAU\b|usporediv|izvedb|protokol/i,id+': none of the old wording');
    await measure(p,id+' closed '+width,{fits});await shot(p,id,width);
    await check(closed);
    for(const key of ['napor','misici']){const toggle=inSheet(p,'[data-a="protocolOptionsToggle"][data-k="'+key+'"]');if(await toggle.count()){await toggle.click();assert.equal(await toggle.getAttribute('aria-expanded'),'true');}}
    await measure(p,id+' opened '+width);
    await sheet(p).evaluate(node=>{node.scrollTop=node.scrollHeight;});await measure(p,id+' opened, scrolled '+width);
    const ask=inSheet(p,'[data-a="protocolDeleteAsk"]');
    if(await ask.count()){await ask.click();await inSheet(p,'.wopt-delete').waitFor();await measure(p,id+' delete question '+width);await shot(p,id+'-delete',width);
      const box=await inSheet(p,'.wopt-delete').boundingBox();assert.ok(box.y+box.height<=(await p.viewportSize()).height-34,id+': the question sits above the home indicator');}
  };
  const tiles=()=>inSheet(p,'.wopt-tiles button').evaluateAll(list=>list.map(b=>b.dataset.a+':'+b.innerText.trim()+':'+b.getAttribute('aria-label')));
  const base=['editPr:Uredi:Uredi trening','protocolCopy:Kopija:Napravi kopiju treninga','protocolShare:Podijeli:Podijeli plan treninga'],history='protocolHistory:Povijest:Povijest ovog treninga';
  const effort=()=>inSheet(p,'[data-load-expectation]').evaluate(node=>({...node.dataset}));

  await each('opt-new',true,async closed=>{
    assert.deepEqual(await tiles(),base,'never done: no Povijest');
    assert.match(closed,/^Novi trening \d+ min · 2 vježbe · 5 serija Uredi Kopija Podijeli Dani u tjednu Nisu odabrani P U S Č P S N Očekivani napor Nakon 2 ocijenjena treninga Rad po mišićima Nema serija snage Obriši trening$/);
    assert.deepEqual(await effort(),{loadExpectation:'',status:'insufficient',sampleCount:'0'});
    assert.equal(await inSheet(p,'.dchip[aria-pressed="true"]').count(),0);
    assert.equal(await inSheet(p,'[data-a="goalSheet"],[data-a="kgSheet"]').count(),0,'activation work has no proposal');
  });
  await each('opt-full',true,async closed=>{
    assert.deepEqual(await tiles(),[...base,history]);
    assert.match(closed,/^Snaga cijelo tijelo \d+ min · 4 vježbe · 12 serija · zadnji put 3\. 11\. /);
    assert.match(closed,/Dani u tjednu Pon, Čet P U S Č P S N Očekivani napor 168–203 j\.n\. \(jedinice napora\) iz 3 ocijenjena treninga s istom dozom Kako se računa Rad po mišićima · serije Sve skupine /);
    assert.equal((closed.match(/jedinice napora/g)||[]).length,1,'the abbreviation is explained once, beside the number');
    assert.equal(await inSheet(p,'.wopt-val .wopt-sr').textContent(),'168 do 203 jedinice napora');
    assert.deepEqual(await effort(),{loadExpectation:'',status:'available',sampleCount:'3',min:'168',max:'203'});
    assert.deepEqual(await inSheet(p,'.dchip[aria-pressed="true"]').evaluateAll(list=>list.map(b=>b.getAttribute('aria-label'))),['ponedjeljak','četvrtak']);
    assert.equal(await inSheet(p,'.wopt-muscles li').count(),3,'the three largest groups');
    assert.match(closed,/Prijedlog za cilj „Snaga” \d+ vježb[aei] Obriši trening$/);
  });
  await each('opt-one',true,async closed=>{
    assert.match(closed,/Dani u tjednu Sri .*Očekivani napor Još 1 ocijenjeni trening /);
    assert.deepEqual(await effort(),{loadExpectation:'',status:'insufficient',sampleCount:'1'});
  });
  await each('opt-kg',true,async closed=>{
    assert.match(closed,/Očekivani napor Nedostaju kilogrami /);assert.equal((await effort()).status,'unavailable');
    assert.deepEqual(await tiles(),[...base,history]);
  });
  await each('snaga-b',true,async closed=>{
    assert.match(closed,/Dani u tjednu Sri /);assert.doesNotMatch(closed,/Obriši/,'a shipped workout cannot be deleted here');
    assert.equal(await inSheet(p,'[data-a="protocolDeleteAsk"],[data-a="protocolDelete"]').count(),0);
    assert.equal(await inSheet(p,'.dchip').count(),7,'its days are set like any other workout\'s');
  });
  await each('trx-krug',true,async closed=>{assert.match(closed,/Dani u tjednu Nisu odabrani /);assert.doesNotMatch(closed,/Obriši/);});
  await each('opt-session',true,async closed=>{
    assert.match(closed,/^1\. tjedan A \d+ min · 3 vježbe · 10 serija Uredi Kopija Podijeli Dani u tjednu Po programu /);
    assert.equal(await inSheet(p,'.dchip').count(),0,'a programme session has no days of its own');
    assert.equal(await inSheet(p,'[data-a="openProg"]').getAttribute('aria-label'),'Dani u tjednu: po programu. Otvori program Kontrolni program.');
    assert.match(closed,/Prijedlog kilograma 1 vježba$/,'the kilogram proposal row, and no delete under it');
    assert.equal(await inSheet(p,'[data-a="kgSheet"]').count(),1);assert.equal(await inSheet(p,'[data-a="goalSheet"]').count(),0);
  });
  await each('opt-empty',true,async closed=>{
    assert.match(closed,/^Bez vježbi Još nema vježbi Uredi Kopija Podijeli .*Očekivani napor Nema vježbi Rad po mišićima Nema serija snage Obriši trening$/);
  });
  // a name of two lines on the fullest state: all of it shown, the sheet still inside its 80 %
  await each('opt-long',false,async closed=>{
    const h=await inSheet(p,'#sheet-h').evaluate(node=>({lines:Math.round(node.getBoundingClientRect().height/parseFloat(getComputedStyle(node).lineHeight)),cut:node.scrollHeight>node.clientHeight+1,text:node.innerText}));
    assert.deepEqual(h,{lines:2,cut:false,text:LONG},'the name takes two lines and is not cut');
    assert.match(closed,/Dani u tjednu Pon, Sri, Pet .*Očekivani napor 189–203 j\.n\. \(jedinice napora\) iz 2 ocijenjena treninga s istom dozom Kako se računa /);
  });
  results.push({width,states:Object.keys(seen).length,measured:'closed, opened, scrolled, delete question'});
}

// ---- every action, with real taps
async function actions(p){
  const before=await store(p);
  // open: the dialog is named by the workout, the title takes the focus; Escape closes and the focus is back on ⋯
  await open(p,'opt-full');
  assert.equal(await p.getByRole('dialog',{name:'Opcije treninga: Snaga cijelo tijelo'}).count(),1);
  assert.equal((await focused(p)).id,'sheet-h','the focus goes to the sheet');
  assert.equal(await inSheet(p,'h3').count(),1);
  for(const name of ['days','effort','muscles'])assert.equal(await inSheet(p,'[role="group"][aria-labelledby="wopt-'+name+'"]').count(),1,name+' is a named group');
  assert.equal(await inSheet(p,'#wopt-effort').innerText(),'Očekivani napor');
  await p.keyboard.press('Escape');await sheet(p).waitFor({state:'hidden'});
  assert.equal((await focused(p)).a,'workoutProtocolOptions','Escape gives the focus back to ⋯');
  // the same after a tap, which focuses nothing by itself, and a tap beside the sheet
  await open(p,'opt-full','tap');assert.equal((await focused(p)).id,'sheet-h');
  await p.mouse.click(180,40);await sheet(p).waitFor({state:'hidden'});
  assert.equal((await focused(p)).a,'workoutProtocolOptions','closing by the backdrop gives the focus back to ⋯');
  // the keyboard stays inside the sheet
  await open(p,'opt-full');
  for(let i=0;i<24;i++){await p.keyboard.press('Tab');assert.ok(await p.evaluate(()=>!!document.activeElement.closest('.sheet')),'Tab stays in the sheet');}
  await p.keyboard.press('Escape');await sheet(p).waitFor({state:'hidden'});

  // days: a tap toggles the chip, saves at once and leaves the sheet exactly as it was
  await open(p,'opt-new');
  const chip=i=>inSheet(p,'.dchip[data-a="prDays"][data-i="'+i+'"]');
  assert.deepEqual(await inSheet(p,'.dchip').evaluateAll(list=>list.map(b=>[b.tagName,b.getAttribute('aria-pressed'),b.getAttribute('aria-label'),b.innerText])),
    ['ponedjeljak','utorak','srijeda','četvrtak','petak','subota','nedjelja'].map((name,i)=>['BUTTON','false',name,'PUSČPSN'[i]]));
  await chip(1).click();
  assert.equal(await chip(1).getAttribute('aria-pressed'),'true');assert.equal(await inSheet(p,'.dchip').count(),7,'the days stay visible after a tap');
  assert.equal(await inSheet(p,'.wopt-days .v').innerText(),'Uto');assert.deepEqual((await focused(p)).i,'1','the focus stays on the tapped day');
  assert.deepEqual((await store(p)).protocols['opt-new'].days,[1],'saved at once');
  await chip(4).tap();assert.equal(await inSheet(p,'.wopt-days .v').innerText(),'Uto, Pet');
  for(const i of [0,2,3])await chip(i).click();assert.equal(await inSheet(p,'.wopt-days .v').innerText(),'5 dana');
  for(const i of [5,6])await chip(i).click();assert.equal(await inSheet(p,'.wopt-days .v').innerText(),'Svaki dan');
  await measure(p,'every day chosen');
  for(const i of [0,2,3,4,5,6])await chip(i).click();
  assert.deepEqual((await store(p)).protocols['opt-new'].days,[1]);
  await open(p,'opt-new');assert.equal(await chip(1).getAttribute('aria-pressed'),'true','the day is still there after a reload');
  await chip(1).click();assert.equal(await inSheet(p,'.wopt-days .v').innerText(),'Nisu odabrani');assert.deepEqual((await store(p)).protocols['opt-new'].days,[]);
  // an opened detail survives a day tap too
  const napor=inSheet(p,'[data-a="protocolOptionsToggle"][data-k="napor"]');
  await napor.click();assert.match(await text(p),/Odradi ga dvaput s istom dozom i oba puta ocijeni napor\. Tada stiže procjena\./);
  await chip(2).click();assert.equal(await napor.getAttribute('aria-expanded'),'true','a day tap closes nothing');await chip(2).click();
  await napor.click();assert.equal(await napor.getAttribute('aria-expanded'),'false');assert.equal(await inSheet(p,'[data-a="trainingLoadOpen"]').count(),0);

  // effort: the explanation and the way to Praćenje opterećenja
  await open(p,'opt-full');
  const how=inSheet(p,'[data-a="protocolOptionsToggle"][data-k="napor"]');assert.equal(await how.innerText(),'Kako se računa');assert.equal(await how.getAttribute('aria-expanded'),'false');
  await how.click();assert.match(await text(p),/Raspon napora zabilježenog nakon prijašnjih treninga s istom dozom\. Nije jamstvo: .* Jedinice napora \(j\.n\.\) su tvoja ocjena težine puta minute treninga\. Praćenje opterećenja/);
  // muscles: all groups, largest first, with the note about what a series counts
  const all=inSheet(p,'[data-a="protocolOptionsToggle"][data-k="misici"]');await all.click();assert.equal(await all.getAttribute('aria-expanded'),'true');
  const groups=await inSheet(p,'.wopt-muscles li').evaluateAll(list=>list.map(li=>[li.querySelector('span').innerText,Number(li.querySelector(':scope > b').innerText.replace(',','.'))]));
  assert.ok(groups.length>4,'more groups than the closed card shows');assert.deepEqual(groups.map(g=>g[1]),groups.map(g=>g[1]).sort((a,b)=>b-a),'largest first');
  assert.match(await text(p),/Procijenjene serije ako dovršiš trening\. Glavna serija vrijedi 1, pomoćna 0,5\./);
  await all.click();assert.equal(await inSheet(p,'.wopt-muscles li').count(),3);
  await inSheet(p,'[data-a="trainingLoadOpen"]').click();await p.locator('#analysis-load').waitFor();
  assert.equal(await p.locator('.sheet').count(),0);assert.match(await p.locator('#analysis-load').innerText(),/j\.n\. su jedinice napora/);
  assert.doesNotMatch((await p.locator('#analysis-load').innerText()),/\bAU\b/,'Praćenje opterećenja uses the same unit');

  // edit
  await open(p,'opt-full');await inSheet(p,'[data-a="editPr"]').click();await p.locator('#p-name').waitFor();
  assert.equal(await p.locator('#p-name').inputValue(),'Snaga cijelo tijelo');assert.equal(await p.locator('.sheet').count(),0);
  // copy: the editor opens on a ready copy; nothing exists until it is saved
  await open(p,'opt-full');await inSheet(p,'[data-a="protocolCopy"]').click();await p.locator('#p-name').waitFor();
  assert.equal(await p.locator('#p-name').inputValue(),'Snaga cijelo tijelo (kopija)');
  assert.deepEqual(Object.keys((await store(p)).protocols).sort(),Object.keys(before.protocols).sort(),'no copy is stored before Spremi');
  await p.locator('[data-a="savePr"]').first().click();await p.waitForFunction(n=>Object.keys(JSON.parse(localStorage.getItem('mt.data.v1')).protocols).length===n+1,Object.keys(before.protocols).length);
  const after=await store(p),copyId=Object.keys(after.protocols).find(id=>!before.protocols[id]),copy=after.protocols[copyId];
  assert.equal(copy.name,'Snaga cijelo tijelo (kopija)');assert.deepEqual(copy.items.map(item=>item.exId),before.protocols['opt-full'].items.map(item=>item.exId));
  assert.deepEqual(copy.days||[],[],'the copy has no days yet');assert.deepEqual(after.protocols['opt-full'],before.protocols['opt-full'],'the original is untouched');
  // share: the plan as text, the same as the player's "Podijeli trening"
  await open(p,'opt-full');
  await p.evaluate(()=>{window.__shared=[];Object.defineProperty(navigator,'share',{configurable:true,value:data=>{window.__shared.push(data);return Promise.resolve();}});});
  await inSheet(p,'[data-a="protocolShare"]').click();await p.waitForFunction(()=>window.__shared.length===1);
  const shared=await p.evaluate(()=>window.__shared[0]);
  assert.equal(shared.title,'Snaga cijelo tijelo');assert.equal(shared.text,'Snaga cijelo tijelo\n\nGlavni dio\nGoblet squat · 3 × 10 · 20 kg\nSklek · 3 × 12\nHip thrust · 3 × 10 · 80 kg\nBench press · 3 × 8 · 60 kg');assert.equal(shared.text.split('\n').length,7,'title, blank line, the part and four exercises');
  assert.equal(await sheet(p).count(),1,'sharing leaves the sheet open');

  // history of this workout only, by its id; "Prikaži sve" removes the filter
  await inSheet(p,'[data-a="protocolHistory"]').click();await p.locator('.hy-ref').waitFor();
  assert.equal(await p.locator('.hy-ref > span').innerText(),'Trening: Snaga cijelo tijelo');
  assert.match(await p.locator('.hy-list-count').innerText(),/^3 spremljena zapisa$/);
  await p.locator('[data-a="historyRefClear"]').click();await p.locator('.hy-ref').waitFor({state:'hidden'});
  assert.match(await p.locator('.hy-list-count').innerText(),/^7 spremljenih zapisa$/);

  // the goal proposal: its sheet, "Odustani", and "Ne nudi više za ovaj trening"
  await open(p,'opt-full');await inSheet(p,'[data-a="goalSheet"]').click();
  const proposal=p.locator('.sheet[data-kind="goal"]');await proposal.waitFor();
  assert.match(await proposal.locator('h3').innerText(),/^Cilj „Snaga” za Snaga cijelo tijelo$/);
  assert.deepEqual(await proposal.locator('button').evaluateAll(list=>list.filter(b=>!b.matches('.sheet-drag-handle')).map(b=>b.innerText.trim())),['Odustani','Primijeni','Ne nudi više za ovaj trening']);
  const skip=await proposal.locator('[data-a="proposalSkip"]').boundingBox();assert.ok(skip.height>=44&&skip.width>=44);
  await proposal.locator('[data-a="sheetDone"]').click();await proposal.waitFor({state:'hidden'});
  assert.equal((await store(p)).protocols['opt-full'].goalSkip,undefined);
  await open(p,'opt-full');await inSheet(p,'[data-a="goalSheet"]').click();await proposal.locator('[data-a="proposalSkip"]').click();
  await p.locator('.toast').waitFor();assert.equal(await p.locator('.toast').innerText(),'Prijedlog se za ovaj trening više ne nudi.');
  assert.equal((await store(p)).protocols['opt-full'].goalSkip,'snaga');
  await open(p,'opt-full');assert.equal(await inSheet(p,'[data-a="goalSheet"]').count(),0,'the row is gone for this workout');
  await measure(p,'opt-full without the proposal',{fits:true});

  // a programme session: the row leads to its programme; the kilogram proposal opens its sheet
  await open(p,'opt-session');await inSheet(p,'[data-a="kgSheet"]').click();
  const kg=p.locator('.sheet[data-kind="kg"]');await kg.waitFor();
  assert.match(await kg.locator('h3').innerText(),/^Kilogrami za 1\. tjedan A$/);assert.match(await kg.innerText(),/Back squat\s+4 × 6 · 40 kg → 4 × 6 · \d+ kg/);
  assert.equal(await kg.locator('[data-a="proposalSkip"]').innerText(),'Ne nudi ovaj prijedlog');
  await kg.locator('[data-a="proposalSkip"]').click();await p.locator('.toast').waitFor();
  assert.ok((await store(p)).protocols['opt-session'].kgSkip,'the skipped proposal is remembered');
  await open(p,'opt-session');assert.equal(await inSheet(p,'[data-a="kgSheet"]').count(),0);
  await measure(p,'programme session without the proposal',{fits:true});
  await inSheet(p,'[data-a="openProg"]').click();await p.getByRole('heading',{name:'Kontrolni program'}).first().waitFor();assert.equal(await p.locator('.sheet').count(),0);

  // delete: asked first, "Odustani" under the finger, so a double tap deletes nothing
  await open(p,'opt-delete');
  const ask=inSheet(p,'[data-a="protocolDeleteAsk"]'),box=await ask.boundingBox();
  await p.mouse.click(box.x+30,box.y+box.height/2);await p.mouse.click(box.x+30,box.y+box.height/2);await p.waitForTimeout(250);
  assert.ok((await store(p)).protocols['opt-delete'],'a fast double tap does not delete');
  if(!await inSheet(p,'.wopt-delete').count())await ask.click();
  assert.equal(await inSheet(p,'.wopt-delete[role="alert"] .wopt-note').innerText(),'Obrisati trening „Za brisanje”? To se ne može vratiti.');
  assert.deepEqual(await inSheet(p,'.wopt-delete-actions button').evaluateAll(list=>list.map(b=>b.innerText)),['Odustani','Obriši']);
  assert.equal((await focused(p)).a,'protocolDeleteCancel','the safe answer has the focus');
  await inSheet(p,'[data-a="protocolDeleteCancel"]').click();
  assert.equal(await inSheet(p,'.wopt-delete').count(),0);assert.equal((await focused(p)).a,'protocolDeleteAsk');assert.ok((await store(p)).protocols['opt-delete']);
  // a day tap in between withdraws the question
  await ask.click();await inSheet(p,'.wopt-delete').waitFor();await inSheet(p,'.dchip[data-i="0"]').click();
  assert.equal(await inSheet(p,'.wopt-delete').count(),0,'a day tap withdraws the question');assert.ok((await store(p)).protocols['opt-delete']);
  await ask.click();await inSheet(p,'[data-a="protocolDelete"]').click();
  await p.locator('.toast').waitFor();assert.equal(await p.locator('.toast').innerText(),'Trening je obrisan.');
  assert.equal(await p.locator('.sheet').count(),0);assert.equal(await p.locator('.workout-overview').count(),0,'back on the start screen');
  const gone=await store(p);assert.equal(gone.protocols['opt-delete'],undefined);assert.ok(gone.protocols['opt-full']&&gone.protocols['snaga-b']);
  // a shipped workout and a programme session cannot be deleted, even by a forged action
  for(const id of ['snaga-b','opt-session']){await open(p,id);await act(p,'protocolDeleteAsk',{id});await act(p,'protocolDelete',{id});await p.waitForTimeout(150);
    assert.equal(await inSheet(p,'.wopt-delete').count(),0);assert.ok((await store(p)).protocols[id],id+' stays');}
  results.push({actions:['open and close with focus','days','effort details','Praćenje opterećenja','muscles','edit','copy','share','history','goal proposal and skip','kilogram proposal and skip','programme row','delete: double tap, cancel, day tap, confirm','no delete for shipped and programme']});
}

(async()=>{
  const host=await serve(),browser=await launch();
  try{for(const [width,height] of [[375,812],[393,852]]){
    const context=await browser.newContext({viewport:{width,height},isMobile:true,hasTouch:true,deviceScaleFactor:1,
      serviceWorkers:'block',locale:'hr-HR',timezoneId:'Europe/Zagreb',reducedMotion:'reduce'});
    // the 34 px home-indicator area of an iPhone, which a test browser reports as 0
    await context.route(/\.css(\?.*)?$/,async route=>{const response=await route.fetch(),body=(await response.text()).replace(/env\(safe-area-inset-bottom(?:,\s*0px)?\)/g,'34px');
      await route.fulfill({response,body,headers:{...response.headers(),'content-type':'text/css; charset=utf-8'}});});
    const p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.setDefaultTimeout(8000);
    try{
      await p.clock.setFixedTime(new Date(NOW));await p.goto(host.url,{waitUntil:'domcontentloaded'});
      await p.getByRole('heading',{name:'Bok, Tomislav',exact:true}).waitFor();
      await p.locator('[data-a="dataSheet"]').click();await p.locator('#importFile').setInputFiles({name:'workout-options-synthetic.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(fixture()))});
      await p.locator('[data-a="restoreApply"]').click();await p.locator('[data-a="restoreApply"]').waitFor({state:'hidden'});
      await states(p,width);
      if(width===375)await actions(p);
      assert.deepEqual(errors,[]);
    }catch(error){await shot(p,'failure',width).catch(()=>{});console.error((await p.locator('.view,.sheet').allInnerTexts()).join('\n').slice(0,1800));throw error;}
    finally{await context.close();}
  }
  const report={engine,passed:true,results,artifacts};fs.writeFileSync(path.join(artifacts,'workout-options-'+engine+'-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
  }finally{await browser.close();await host.close();}
})().catch(error=>{console.error(error.stack);process.exitCode=1;});
