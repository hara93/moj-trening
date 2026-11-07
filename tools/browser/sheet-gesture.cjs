'use strict';

// Isolated synthetic data. Pointer drags exercise the actual control in both
// engines; a touch-typed pointer path also verifies the mobile event branch.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {launch,serve,fixture,engine,artifacts}=require('./runtime.cjs');
const A=(p,a)=>p.locator('[data-a="'+a+'"]');
const saved=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('mt.data.v1')));
const player=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('mt.play')));
const sheet=p=>p.locator('.sheet');
const report=[];

async function drag(p,dialog,dx,dy){
  const handle=dialog.locator(':scope > .sheet-drag-handle');
  const b=await handle.boundingBox();assert.ok(b,'handle is visible');
  assert.ok(b.width>=44&&b.height>=44,'grab bar has an accessible target');
  const x=b.x+b.width/2,y=b.y+14;
  await p.mouse.move(x,y);await p.mouse.down();
  await p.mouse.move(x+dx,y+dy,{steps:8});await p.mouse.up();await p.waitForTimeout(390);
}
async function touchDrag(p,dialog,dx,dy,cancel=false){
  await dialog.locator(':scope > .sheet-drag-handle').evaluate((handle,args)=>{
    const b=handle.getBoundingClientRect(),x=b.x+b.width/2,y=b.y+14;
    const send=(name,px,py)=>handle.dispatchEvent(new PointerEvent(name,{bubbles:true,cancelable:true,pointerType:'touch',pointerId:17,isPrimary:true,clientX:px,clientY:py}));
    send('pointerdown',x,y);send('pointermove',x+args.dx,y+args.dy);send(args.cancel?'pointercancel':'pointerup',x+args.dx,y+args.dy);
  },{dx,dy,cancel});
  await p.waitForTimeout(390);
}
async function bodyDrag(target,dx,dy){
  return target.evaluate((node,args)=>{
    const b=node.getBoundingClientRect(),x=b.x+b.width/2,y=b.y+b.height/2;
    const send=(type,touches)=>{
      const event=new Event(type,{bubbles:true,cancelable:true});
      Object.defineProperty(event,'touches',{value:touches});
      return !node.dispatchEvent(event);
    };
    send('touchstart',[{identifier:1,clientX:x,clientY:y}]);
    const claimed=send('touchmove',[{identifier:1,clientX:x+args.dx,clientY:y+args.dy}]);
    send('touchend',[]);
    return claimed;
  },{dx,dy});
}
async function manual(p){
  for(let count=0;count<12;count++){
    const s=await player(p),step=s.liveSchedule[s.i];
    if(step.kind==='manual')return;
    if(step.kind==='ready')await p.locator('.cinema-primary').click();
    else if(step.dur){await p.clock.setFixedTime(new Date(await p.evaluate(()=>Date.now())+(s.left+.1)*1000));await p.waitForTimeout(350);}
    else assert.fail('Unexpected player step '+step.kind);
  }
  assert.fail('manual set not reached');
}

async function run(p,width){
  const data=fixture();data.log=[];data.settings.sound=false;data.programs={};data.field={};
  data.protocols={'sheet-audit':{id:'sheet-audit',name:'Kontrola povlačenja',days:[],items:[
    {exId:'bench-press',sets:5,measure:'sets',reps:8,kg:50,rest:60,sides:false},
    {exId:'side-plank',sets:3,measure:'time',sec:30,reps:1,kg:0,rest:30,sides:true}
  ]}};
  await A(p,'dataSheet').click();await p.locator('#importFile').setInputFiles({name:'sheet-audit.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});
  await A(p,'restoreApply').click();await A(p,'restoreApply').waitFor({state:'hidden'});
  const original=await saved(p);
  await p.getByRole('button',{name:'Moj pregled',exact:true}).click();await A(p,'dashboardProtocols').click();
  await p.locator('[data-a="openPr"][data-id="sheet-audit"]').click();await A(p,'startPr').click();await manual(p);

  // A small, sideways or cancelled touch gesture leaves the dialog in place.
  await A(p,'cinemaMenu').click();assert.equal((await player(p)).clock.paused,true);
  await drag(p,sheet(p),0,20);assert.equal(await sheet(p).getAttribute('data-kind'),'cinemaMenu');
  await drag(p,sheet(p),70,8);assert.equal(await sheet(p).getAttribute('data-kind'),'cinemaMenu');
  await touchDrag(p,sheet(p),0,130,true);assert.equal(await sheet(p).getAttribute('data-kind'),'cinemaMenu');
  assert.equal(await sheet(p).evaluate(n=>n.style.transform),'','cancelled gesture restores position');
  await drag(p,sheet(p),0,135);assert.equal(await sheet(p).count(),0);assert.equal((await player(p)).clock.paused,false);
  assert.equal(Object.keys((await player(p)).doneSteps||{}).length,0,'drag never completes a work set');

  // The exact same existing close path retains a pause that predated the sheet.
  await A(p,'cinemaPause').click();await A(p,'cinemaMenu').click();await touchDrag(p,sheet(p),0,135);
  assert.equal(await sheet(p).count(),0);assert.equal((await player(p)).clock.paused,true);
  await A(p,'cinemaPause').click();await A(p,'cinemaJournal').click();
  const journal=sheet(p);assert.equal(await journal.getAttribute('data-kind'),'cinemaJournal');
  assert.equal((await player(p)).clock.paused,true);
  const scroll=journal.locator('.workout-journal-blocks');
  await scroll.evaluate(n=>n.scrollTop=80);
  await scroll.dispatchEvent('pointerdown',{pointerType:'touch',pointerId:30,clientX:100,clientY:250,isPrimary:true});
  await scroll.dispatchEvent('pointermove',{pointerType:'touch',pointerId:30,clientX:100,clientY:400,isPrimary:true});
  await scroll.dispatchEvent('pointerup',{pointerType:'touch',pointerId:30,clientX:100,clientY:400,isPrimary:true});
  assert.equal(await sheet(p).getAttribute('data-kind'),'cinemaJournal','body scrolling does not dismiss');
  await scroll.evaluate(n=>n.scrollTop=0);
  await A(p,'cinemaNotes').first().click();await p.locator('#cinema-note').fill('Tekst i unos ostaju slobodni.');
  await p.locator('#cinema-note').dispatchEvent('pointerdown',{pointerType:'touch',pointerId:31,clientX:100,clientY:250,isPrimary:true});
  await p.locator('#cinema-note').dispatchEvent('pointermove',{pointerType:'touch',pointerId:31,clientX:100,clientY:400,isPrimary:true});
  await p.locator('#cinema-note').dispatchEvent('pointerup',{pointerType:'touch',pointerId:31,clientX:100,clientY:400,isPrimary:true});
  assert.equal(await p.locator('#cinema-note').inputValue(),'Tekst i unos ostaju slobodni.');
  await drag(p,sheet(p),0,135);assert.equal(await sheet(p).getAttribute('data-kind'),'cinemaJournal','nested close returns to journal');
  assert.equal((await player(p)).clock.paused,true);
  await p.screenshot({path:path.join(artifacts,'sheet-gesture-'+engine+'-journal-'+width+'.png')});
  await drag(p,sheet(p),0,135);assert.equal(await sheet(p).count(),0);assert.equal((await player(p)).clock.paused,false);
  await A(p,'cinemaMenu').click();await A(p,'cinemaExit').click();await A(p,'quitDiscard').click();
  await p.reload();await p.getByRole('heading',{name:'Bok, Tomislav',exact:true}).waitFor();

  // Native detail dialogs use the same handle while retaining their close/focus path.
  await p.getByRole('button',{name:'Napredak',exact:true}).click();
  const info=A(p,'progressInfo').first();await info.click();
  let dialog=p.locator('#progress-info');assert.equal(await dialog.evaluate(n=>n.open),true);
  assert.ok(await dialog.locator('#progress-info-title').evaluate(n=>document.activeElement===n));
  await drag(p,dialog,0,20);assert.equal(await dialog.evaluate(n=>n.open),true);
  await drag(p,dialog,0,135);assert.equal(await dialog.evaluate(n=>n.open),false);
  assert.equal(await info.evaluate(n=>document.activeElement===n),true,'native dialog restores opener focus');
  const activity=p.locator('.pg-summary-pair > button').first();
  await activity.click();
  const grip=dialog.getByRole('button',{name:'Zatvori prozor',exact:true});
  assert.equal(await dialog.getByRole('button',{name:/^(×|Jasno)$/}).count(),0);
  await p.mouse.click(1,1);assert.equal(await dialog.evaluate(n=>n.open),true,'tapping the backdrop does not dismiss the dialog');
  const gripY=(await grip.boundingBox()).y;
  const detail=dialog.locator('#progress-info-body');
  assert.ok(await detail.evaluate(n=>{n.scrollTop=100;return n.scrollTop>1;}),'the activity body scrolls');
  assert.equal((await grip.boundingBox()).y,gripY,'the grip stays accessible while the body scrolls');
  await grip.tap();assert.equal(await dialog.evaluate(n=>n.open),false);
  await activity.click();
  await detail.evaluate(n=>n.scrollTop=100);
  assert.equal(await bodyDrag(detail,0,135),false,'long detail still scrolls down toward its top');
  assert.equal(await dialog.evaluate(n=>n.open),true);
  await detail.evaluate(n=>n.scrollTop=0);
  assert.equal(await bodyDrag(detail,0,135),true,'downward touch at the activity dialog top moves the sheet');
  await dialog.waitFor({state:'hidden'});
  await p.waitForTimeout(390);
  assert.equal(await activity.evaluate(n=>n===document.activeElement),true,'activity dialog returns focus to its card');
  await p.locator('[data-a="analyticsMode"][data-v="load"]').click();await A(p,'trainingLoadInfo').first().click();
  dialog=p.locator('#training-load-info');
  assert.ok(await dialog.locator('#training-load-info-title').evaluate(n=>document.activeElement===n));
  await touchDrag(p,dialog,0,135);assert.equal(await dialog.evaluate(n=>n.open),false);
  await p.locator('[data-a="trainingLoadDetail"][data-topic="muscles"]').click();
  assert.equal(await bodyDrag(dialog.locator('#training-load-info-body'),0,135),true);
  await dialog.waitFor({state:'hidden'});
  await p.waitForTimeout(390);

  await p.reload();await p.getByRole('heading',{name:'Bok, Tomislav',exact:true}).waitFor();
  await p.getByRole('button',{name:'Knjižnica vježbi',exact:true}).click();
  await A(p,'eqSheet').click();
  const filter=sheet(p),equipment=A(p,'eqToggle'),tiles=A(p,'eqTile');
  const filterBody=filter.locator('.fbody'),figure=filter.locator('.filtfig');
  const compactY=(await figure.boundingBox()).y;
  assert.equal(await equipment.getAttribute('aria-expanded'),'false');assert.equal(await tiles.first().isVisible(),false);
  await equipment.click();
  assert.equal(await equipment.getAttribute('aria-expanded'),'true');assert.ok(await tiles.first().isVisible());
  assert.ok((await figure.boundingBox()).y>compactY,'only expanded equipment moves the figure down');
  await tiles.first().click();
  assert.equal(await tiles.first().getAttribute('aria-pressed'),'true');
  assert.equal(await equipment.getAttribute('aria-expanded'),'true');
  assert.ok(await filterBody.evaluate(n=>{n.scrollTop=100;return n.scrollTop>1;}));
  assert.equal(await bodyDrag(filterBody,0,135),false,'downward touches from scrolled filter content stay with scrolling');
  await drag(p,filter,0,135);await filter.waitFor({state:'hidden'});
  await A(p,'eqSheet').click();
  assert.equal(await equipment.getAttribute('aria-expanded'),'false');
  assert.match(await equipment.innerText(),/1 odabrano/);
  assert.equal(await bodyDrag(filterBody,0,-135),false,'upward filter touch stays with scrolling');
  assert.equal(await bodyDrag(filterBody,135,20),false,'horizontal filter touch leaves the sheet in place');
  assert.equal(await bodyDrag(filterBody.locator('.fl').first(),0,135),true,'pulling filter text down from the top dismisses it');
  await filter.waitFor({state:'hidden'});await p.waitForTimeout(390);

  // Closing a discard question keeps the unsaved draft, matching Escape/Back.
  await p.getByRole('button',{name:'Moj pregled',exact:true}).click();await A(p,'dashboardProtocols').click();await A(p,'newPr').click();
  await p.locator('#p-name').fill('Nespremljen nacrt');await A(p,'back').first().click();
  await p.getByRole('dialog',{name:'Spremiti promjene?'}).waitFor();
  await drag(p,sheet(p),0,135);assert.equal(await sheet(p).count(),0);assert.equal(await p.locator('#p-name').inputValue(),'Nespremljen nacrt');
  assert.deepEqual((await saved(p)).protocols,original.protocols);assert.deepEqual((await saved(p)).log,original.log);
  await A(p,'back').first().click();await A(p,'leaveDiscard').click();
  report.push({width,shortDragRetained:true,horizontalRetained:true,cancelledTouchRetained:true,downDragCloses:true,
    restoredOriginalPause:true,bodyScrollAndInputsRetained:true,nestedReturnsToJournal:true,nativeDialogsCloseAndRestoreFocus:true,
    filterEquipmentStartsCollapsed:true,filterBodyAndScrolledGrabDismiss:true,analyticsBodyDismiss:true,unsavedDraftGuardRetained:true,historyUnchanged:true});
}

(async()=>{
  const host=await serve(),browser=await launch();
  try{
    for(const [width,height] of [[375,812],[320,568]]){
      const context=await browser.newContext({viewport:{width,height},isMobile:true,hasTouch:true,serviceWorkers:'block',locale:'hr-HR',timezoneId:'Europe/Zagreb',reducedMotion:'reduce'});
      const p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.setDefaultTimeout(7000);
      try{await p.clock.setFixedTime(new Date('2026-11-06T10:00:00+01:00'));await p.goto(host.url);await p.getByRole('heading',{name:'Bok, Tomislav',exact:true}).waitFor();await run(p,width);assert.deepEqual(errors,[]);}
      catch(error){await p.screenshot({path:path.join(artifacts,'sheet-gesture-'+engine+'-failure-'+width+'.png')}).catch(()=>{});throw error;}
      finally{await context.close();}
    }
    const result={engine,passed:true,results:report,artifacts};fs.writeFileSync(path.join(artifacts,'sheet-gesture-'+engine+'-report.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
  }finally{await browser.close();await host.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
