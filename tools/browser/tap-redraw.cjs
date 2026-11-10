'use strict';

// 1.24.0: a press that is still down when the screen is redrawn must not be lost. Every redraw replaces all nodes, so
// the browser has no button left to send its click to: ⋯ pressed just as a prep countdown ended did not open the menu
// (seen once in CI, WebKit). Synthetic data only.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {artifacts,engine,fixture:baseFixture,launch,serve,openQuit}=require('./runtime.cjs');
const a=(p,name)=>p.locator('[data-a="'+name+'"]');
const id='tap-redraw-audit';
function fixture(){
  const d=baseFixture();d.log=[];d.field={};d.settings.sound=false;d.settings.planDates={};
  d.protocols={[id]:{id,name:'Dodir u odbrojavanju',days:[],items:[
    {exId:'plank',measure:'time',sets:2,sec:20,kg:0,rest:20,sides:false},{exId:'push-up',measure:'sets',sets:2,reps:8,kg:0,rest:30,sides:false}]}};
  return d;
}
const state=p=>p.evaluate(()=>{const s=JSON.parse(localStorage.getItem('mt.play')),step=s.liveSchedule[s.i];
  return {i:s.i,kind:step.kind,left:s.left,dur:step.dur,sheet:document.querySelector('.sheet')?.dataset.kind||null};});
(async()=>{
  const host=await serve(),browser=await launch(),results=[];
  try{
    const context=await browser.newContext({viewport:{width:375,height:812},isMobile:true,hasTouch:true,deviceScaleFactor:1,
      serviceWorkers:'block',locale:'hr-HR',timezoneId:'Europe/Zagreb',reducedMotion:'reduce'});
    const p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.setDefaultTimeout(8000);
    let now=new Date('2026-11-06T10:00:00+01:00').getTime();
    const advance=async ms=>{now+=ms;await p.clock.setFixedTime(new Date(now));};
    try{
      await p.clock.setFixedTime(new Date(now));await p.goto(host.url,{waitUntil:'domcontentloaded'});
      await p.getByRole('heading',{name:'Bok, Tomislav',exact:true}).waitFor();
      await a(p,'dataSheet').click();await p.locator('#importFile').setInputFiles({name:'tap-redraw-synthetic.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(fixture()))});
      await a(p,'restoreApply').click();await a(p,'restoreApply').waitFor({state:'hidden'});
      await p.reload({waitUntil:'domcontentloaded'});await p.getByRole('button',{name:'Moj pregled',exact:true}).click();await a(p,'dashboardProtocols').first().click();
      await p.locator('[data-a="openPr"][data-id="'+id+'"]').click();await a(p,'startPr').click();
      await p.locator('.workout-cinema[data-phase="ready"]').waitFor();
      const before=await state(p);assert.equal(before.kind,'prep','the prep countdown runs');assert.equal(before.sheet,null);

      // the press goes down in the countdown, the countdown ends (the player is redrawn), the press comes up
      const box=await a(p,'cinemaMenu').boundingBox(),x=box.x+box.width/2,y=box.y+box.height/2;
      await p.mouse.move(x,y);await p.mouse.down();
      const pressedNode=await a(p,'cinemaMenu').elementHandle();
      await advance((before.left+.3)*1000);await p.locator('.workout-cinema[data-phase="work"]').waitFor();
      assert.equal(await pressedNode.evaluate(node=>node.isConnected),false,'the redraw replaced the pressed button');
      await p.mouse.up();
      await p.locator('.sheet[data-kind="cinemaMenu"]').waitFor();
      const opened=await state(p);assert.equal(opened.kind,'work');
      await p.waitForTimeout(500);assert.equal((await state(p)).sheet,'cinemaMenu','the menu stays open: the tap is delivered once');
      await p.screenshot({path:path.join(artifacts,'tap-redraw-'+engine+'-menu.png')});
      await p.keyboard.press('Escape');await p.locator('.sheet').waitFor({state:'hidden'});

      // an ordinary tap still acts exactly once (a toggle would show a double delivery)
      await a(p,'cinemaMenu').click();await p.locator('.sheet[data-kind="cinemaMenu"]').waitFor();
      await p.waitForTimeout(200);assert.equal((await state(p)).sheet,'cinemaMenu');
      await p.keyboard.press('Escape');await p.locator('.sheet').waitFor({state:'hidden'});

      // a press that moves away (a scroll, a change of mind) or lifts over another control delivers nothing
      await p.mouse.move(x,y);await p.mouse.down();
      await advance(21000);await p.locator('.workout-cinema[data-phase="rest"]').waitFor();
      await p.mouse.move(x-120,y+200,{steps:4});await p.mouse.up();await p.waitForTimeout(300);
      assert.equal((await state(p)).sheet,null,'a press that left the button opens nothing');

      // the suite helper opens the menu and leaves the player
      await openQuit(p);await a(p,'quitDiscard').click();await p.locator('.workout-cinema').waitFor({state:'hidden'});
      assert.deepEqual(errors,[]);
      results.push({pressAcrossRedrawDelivered:true,deliveredOnce:true,movedPressIgnored:true,openQuitWaitsForMenu:true});
    }catch(error){await p.screenshot({path:path.join(artifacts,'tap-redraw-'+engine+'-failure.png')}).catch(()=>{});console.error((await p.locator('.view,.sheet').allInnerTexts()).join('\n').slice(0,1200));throw error;}
    finally{await context.close();}
    const report={engine,passed:true,results,artifacts};fs.writeFileSync(path.join(artifacts,'tap-redraw-'+engine+'-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
  }finally{await browser.close();await host.close();}
})().catch(error=>{console.error(error.stack);process.exitCode=1;});
