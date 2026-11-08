'use strict';

const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {createServer, engine, fixture, launch, repo, withOffline, openCinemaControls} = require('./runtime.cjs');
const first = 'assets/slike/dead-bug.webp', next = 'assets/slike/goblet-squat.webp';
const action = (page, name, suffix = '') => page.locator('[data-a="'+name+'"]'+suffix);
const playerImage = page => page.locator('.cinema-single-media img');

// Pictures that never arrive (offline without a saved copy) turn into the category icon in lists and in the player,
// so no broken image or alt text sits over the set label.
async function unreachablePictures(browser,url) {
  const context = await browser.newContext({viewport:{width:375,height:812},isMobile:true,hasTouch:true,locale:'hr-HR',reducedMotion:'reduce',serviceWorkers:'block'});
  try {
    await context.route(/\/assets\/(slike|thumb)\//,route=>route.abort('internetdisconnected'));
    const page = await context.newPage(), errors = [];
    page.on('pageerror',error=>errors.push(error.message));
    page.setDefaultTimeout(8500);
    await page.clock.setFixedTime(new Date('2026-11-07T12:00:00+01:00'));
    await page.goto(url,{waitUntil:'domcontentloaded'});
    const data = fixture(), id = 'broken-media-audit';
    data.log = []; data.settings.sound = false;
    data.protocols = {[id]:{id,name:'Slike bez mreže',items:[
      {exId:'dead-bug',measure:'sets',sets:4,reps:6,kg:0,rest:30},{exId:'goblet-squat',measure:'sets',sets:1,reps:8,kg:20}]}};
    await action(page,'dataSheet').click();
    await page.locator('#importFile').setInputFiles({name:'media-broken.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});
    await action(page,'restoreApply').click();
    await page.getByRole('button',{name:'Moj pregled',exact:true}).click();
    await action(page,'dashboardProtocols').click();
    await action(page,'openPr','[data-id="'+id+'"]').click();
    const overview = page.locator('.workout-overview');
    await overview.locator('.media-fallback').first().waitFor();
    assert.equal(await overview.locator('img[onerror]').count(),0,'every unreachable list picture became an icon');
    await action(page,'startPr').click();
    const media = page.locator('.cinema-single-media');
    await media.locator('.media-fallback svg').waitFor();
    assert.equal(await media.locator('img').count(),0,'no broken player image');
    assert.equal(await media.locator('.media-fallback').getAttribute('aria-hidden'),'true','no alt text is printed over the labels');
    assert.deepEqual(errors,[]);
    return {listIcons:true,playerIcon:true};
  } finally { await context.close(); }
}

async function run() {
  const server = createServer();
  const [serveFile] = server.listeners('request');
  server.removeListener('request', serveFile);
  let delay = 0, release, started, delayed = 0;
  server.on('request', async (req,res) => {
    const path = new URL(req.url,'http://localhost').pathname;
    if (path.startsWith('/assets/slike/')) res.setHeader('Cache-Control','no-store');
    if (path==='/'+first && delay) {
      delayed++;
      if (delay < 0) await new Promise(resolve => { release=resolve; started(); });
      else await new Promise(resolve => setTimeout(resolve,delay));
    }
    if (!res.destroyed) serveFile(req,res);
  });
  await new Promise((resolve,reject) => {server.once('error',reject); server.listen(0,'127.0.0.1',resolve);});
  const url = 'http://127.0.0.1:'+server.address().port+'/';
  let browser;
  try {
    browser = await launch();
    const context = await browser.newContext({viewport:{width:375,height:812},isMobile:true,hasTouch:true,locale:'hr-HR',reducedMotion:'reduce'});
    await context.addInitScript(() => {
      const NativeImage = window.Image;
      window.warmed = [];
      window.Image = function() {
        const image = new NativeImage();
        window.warmed.push(image);
        return image;
      };
    });
    const page = await context.newPage(), errors = [];
    page.on('pageerror',error=>errors.push(error.message));
    page.setDefaultTimeout(8500);
    await page.clock.setFixedTime(new Date('2026-11-07T12:00:00+01:00'));
    await page.goto(url,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
    const data = fixture();
    data.log = [];
    data.settings.sound = false;
    data.exercises['side-plank'].media='mauditphoto';
    data.exercises['side-plank'].mediaType='image';
    await page.evaluate(async encoded=>{
      const bytes=Uint8Array.from(atob(encoded),letter=>letter.charCodeAt(0));
      await new Promise((resolve,reject)=>{
        const request=indexedDB.open('mt-media',1);
        request.onupgradeneeded=()=>request.result.createObjectStore('blobs');
        request.onerror=()=>reject(request.error);
        request.onsuccess=()=>{
          const db=request.result, tx=db.transaction('blobs','readwrite');
          tx.objectStore('blobs').put({type:'image/webp',buf:bytes.buffer},'mauditphoto');
          tx.oncomplete=()=>{db.close();resolve();};
          tx.onabort=()=>{db.close();reject(tx.error);};
        };
      });
    },readFileSync(repo+'/assets/thumb/side-plank.webp','base64'));
    const id = 'exercise-media-audit';
    data.protocols = {[id]:{id,name:'Provjera slika',items:[
      {exId:'dead-bug',measure:'sets',sets:1,reps:6,kg:0,section:'Priprema'},
      {exId:'goblet-squat',measure:'sets',sets:1,reps:8,kg:20,section:'Snaga'},
      {exId:'side-plank',measure:'time',sets:1,sec:10,kg:0}
    ]}};
    await action(page,'dataSheet').click();
    await page.locator('#importFile').setInputFiles({name:'media-fixture.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});
    await action(page,'restoreApply').click();
    await page.getByRole('button',{name:'Moj pregled',exact:true}).click();
    await action(page,'dashboardProtocols').click();
    await action(page,'openPr','[data-id="'+id+'"]').click();
    assert.equal(await page.locator('.hero img').getAttribute('fetchpriority'),'high');
    assert.equal(await page.locator('.workout-overview [loading="lazy"]').first().getAttribute('decoding'),'async');

    delay=-1;
    const waiting = new Promise(resolve => { started=resolve; });
    await action(page,'startPr').click();
    await Promise.race([waiting,page.waitForTimeout(2500).then(()=>{if(!delayed)throw new Error('First picture request did not start');})]);
    assert.equal(await playerImage(page).getAttribute('fetchpriority'),'high');
    assert.equal(await playerImage(page).getAttribute('src'),first);
    assert.equal(await page.evaluate(()=>window.warmed.length),0,'do not warm anything before the current picture loads');
    assert.ok(delayed>=1,'the first picture is waiting on the delayed origin');
    delay=0; release();
    await page.waitForFunction(src=>window.warmed.some(img=>img.getAttribute('src')===src&&img.complete&&img.naturalWidth),next);
    assert.deepEqual(await page.evaluate(()=>window.warmed.map(img=>[img.getAttribute('src'),img.getAttribute('fetchpriority')])),[[next,'low']]);
    await page.waitForFunction(async paths=>{
      const cache=await caches.open('mt-media');
      const found=await Promise.all(paths.map(path=>cache.match(new URL(path,location.href))));
      return found.every(Boolean);
    },[first,next]);

    const probe=await context.newPage();
    await probe.goto(url,{waitUntil:'domcontentloaded'});
    await probe.waitForFunction(()=>!!navigator.serviceWorker.controller);
    const prior=delayed;
    delay=3900;
    const elapsed=await probe.evaluate(async src=>{
      const start=performance.now(),image=document.createElement('img');
      image.src=src;
      await image.decode();
      return performance.now()-start;
    },first);
    await probe.waitForTimeout(100);
    assert.equal(delayed,prior+1,'the worker revalidates the picture in the background');
    assert.ok(elapsed<1700,'the saved picture should paint before a slow refresh, took '+elapsed+' ms');
    delay=0;
    await probe.close();

    await withOffline(context,server,async()=>{
      await openCinemaControls(page);await action(page,'jump','[data-d="1"]').click(); // leave initial preparation
      await openCinemaControls(page);await action(page,'jump','[data-d="1"]').click(); // enter the warmed exercise
      assert.equal(await playerImage(page).getAttribute('src'),next);
      assert.equal(await playerImage(page).getAttribute('fetchpriority'),'high');
      assert.equal(await playerImage(page).evaluate(img=>img===window.warmed[0]&&img.complete&&img.naturalWidth>0),true);
      assert.equal(await page.evaluate(()=>window.warmed.length),1,'do not warm a private picture');
      await openCinemaControls(page);await action(page,'jump','[data-d="1"]').click();
      const privatePhoto=page.locator('.cinema-single-media img[src^="blob:"]');
      await privatePhoto.evaluate(img=>img.decode());
      assert.equal(await privatePhoto.evaluate(img=>img.naturalWidth),192);
    });
    assert.deepEqual(errors,[]);
    const brokenMedia=await unreachablePictures(browser,url);
    console.log(JSON.stringify({engine,cacheHitMs:Math.round(elapsed),delayedOriginMs:3900,oneUpcomingPicture:true,offlineTransition:true,privatePhotoOffline:true,brokenMedia}));
  } finally {
    release?.();
    if(browser)await browser.close();
    server.closeAllConnections();
    await new Promise(resolve=>server.close(resolve));
  }
}
run().catch(error=>{console.error(error);process.exitCode=1;});
