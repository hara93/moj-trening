'use strict';

const assert = require('node:assert/strict');
const {engine, fixture, launch, serve, openCinemaControls} = require('./runtime.cjs');
const id = 'player-feedback-audit';
const action = (page, name) => page.locator('[data-a="'+name+'"]');
const settings = page => page.evaluate(() => JSON.parse(localStorage.getItem('mt.settings')));
const feedback = page => page.evaluate(() => window.feedbackAudit);

async function start(page, url) {
  const data = fixture();
  data.log = [];
  data.protocols = {[id]:{id,name:'Provjera signala',items:[
    {exId:'dead-bug',measure:'sets',sets:2,reps:4,kg:0,repSetSec:4,rest:4,sides:false}
  ]}};
  data.settings.sound = true;
  delete data.settings.vibration;
  await page.clock.setFixedTime(new Date('2026-11-07T10:00:00+01:00'));
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await action(page,'dataSheet').click();
  await page.locator('#importFile').setInputFiles({name:'feedback-fixture.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});
  await action(page,'restoreApply').click();
  await page.getByRole('button',{name:'Moj pregled',exact:true}).click();
  await action(page,'dashboardProtocols').click();
  await page.locator('[data-a="openPr"][data-id="'+id+'"]').click();
  await action(page,'startPr').click();
}

async function move(page, seconds, expectedToneCount) {
  const now = await page.evaluate(() => Date.now());
  await page.clock.setFixedTime(new Date(now + seconds*1000));
  await page.waitForFunction(count => window.feedbackAudit.tones.length >= count, expectedToneCount);
}

async function openAudio(page) {
  await openCinemaControls(page);
  await action(page,'cinemaAudio').click();
  await page.getByRole('heading',{name:'Zvuk i vibracija',exact:true}).waitFor();
}

async function supported(page, url) {
  await start(page,url);
  assert.deepEqual((await feedback(page)).tones,[587]);
  assert.deepEqual((await feedback(page)).vibrations,[[45,65,45]]);
  assert.equal((await feedback(page)).resumed,1);
  await openAudio(page);
  const sound = page.getByRole('switch',{name:'Zvučni signali'});
  const vibration = page.getByRole('switch',{name:'Vibracija'});
  const preview = action(page,'previewPlayerSignal');
  assert.equal(await vibration.getAttribute('aria-checked'),'true','preserve vibration on old settings');
  await sound.click();
  const muted = await feedback(page);
  await preview.click();
  assert.deepEqual((await feedback(page)).tones,muted.tones);
  assert.equal((await feedback(page)).vibrations.at(-1),120);
  await vibration.click();
  assert.equal(await preview.isDisabled(),true);
  assert.equal((await settings(page)).sound,false);
  assert.equal((await settings(page)).vibration,false);
  assert.equal((await feedback(page)).vibrations.at(-1),0);

  await page.reload({waitUntil:'domcontentloaded'});
  await action(page,'resumeGo').click();
  await openAudio(page);
  assert.equal(await sound.getAttribute('aria-checked'),'false');
  assert.equal(await vibration.getAttribute('aria-checked'),'false');
  await sound.click();
  const withoutVibration = await feedback(page);
  await preview.click();
  assert.equal((await feedback(page)).tones.at(-1),880);
  assert.deepEqual((await feedback(page)).vibrations,withoutVibration.vibrations);
  await vibration.click();
  await page.getByRole('switch',{name:'Zvuk u nečujnom načinu'}).click();
  assert.equal((await settings(page)).silentOk,true);
  assert.equal(await page.evaluate(()=>navigator.audioSession.type),'playback');
  await page.keyboard.press('Escape');await page.keyboard.press('Escape');
  await action(page,'cinemaTimer').click();
  await page.evaluate(()=>{window.feedbackAudit.tones=[];window.feedbackAudit.vibrations=[];});
  await move(page,2.1,1); // initial preparation reaches the last three seconds
  await page.waitForTimeout(350);
  assert.deepEqual((await feedback(page)).tones,[740],'one signal per remaining second');
  await move(page,3,2);   // working set
  await move(page,4.1,3); // rest
  await move(page,4.1,4); // second working set
  await move(page,4.1,5); // finish
  assert.deepEqual((await feedback(page)).tones,[740,880,392,880,988]);
  assert.deepEqual((await feedback(page)).vibrations,[28,120,65,120,[120,80,120]]);
  await action(page,'finishPlay').waitFor();
}

async function unsupported(page, url) {
  await start(page,url);
  await openAudio(page);
  assert.equal(await page.getByRole('switch',{name:'Vibracija'}).count(),0);
  assert.match(await page.locator('.sheet[data-kind="cinemaAudio"]').innerText(),/dostupni zvučni signali/);
  await action(page,'previewPlayerSignal').click();
  assert.deepEqual((await feedback(page)).tones,[587,880]);
  assert.deepEqual((await feedback(page)).vibrations,[]);
}

(async () => {
  const host=await serve(), browser=await launch();
  try {
    for (const hasVibration of [true,false]) {
      const context=await browser.newContext({viewport:{width:320,height:780},isMobile:true,hasTouch:true,serviceWorkers:'block',locale:'hr-HR',reducedMotion:'reduce'});
      await context.addInitScript(supported=>{
        const audit=window.feedbackAudit={tones:[],vibrations:[],resumed:0};
        window.AudioContext=class {
          state='suspended';
          currentTime=0;
          destination={};
          resume(){this.state='running';audit.resumed++;return Promise.resolve();}
          createOscillator(){return {frequency:{value:0},connect(){},start(){audit.tones.push(this.frequency.value);},stop(){}};}
          createGain(){return {gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}};}
        };
        Object.defineProperty(navigator,'vibrate',{configurable:true,value:supported?pattern=>{audit.vibrations.push(pattern);return true;}:undefined});
        Object.defineProperty(navigator,'audioSession',{configurable:true,value:{type:'auto'}});
      },hasVibration);
      const page=await context.newPage(), errors=[];
      page.on('pageerror',error=>errors.push(error.message));
      page.setDefaultTimeout(7000);
      if (hasVibration) await supported(page,host.url); else await unsupported(page,host.url);
      assert.deepEqual(errors,[]);
      await context.close();
    }
    console.log(engine+' player feedback: phase cues, independent settings, reload and capability fallback passed');
  } finally { await browser.close(); await host.close(); }
})().catch(error => { console.error(error); process.exitCode=1; });
