'use strict';
const fs=require('node:fs'), path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {launch,repo,artifacts,fixture:baseFixture}=require('./runtime.cjs');
const output=artifacts;
const wk=process.argv.includes('webkit');
const server=http.createServer((req,res)=>{
  const f=path.join(repo,new URL(req.url,'http://local').pathname.replace(/^\/$/,'/index.html'));
  if(!f.startsWith(repo+path.sep)||!fs.existsSync(f)){res.writeHead(404);return res.end();}
  res.setHeader('content-type',({'.js':'application/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'})[path.extname(f)]||'application/octet-stream');
  fs.createReadStream(f).pipe(res);
});
const select=(p,a)=>p.locator('[data-a="'+a+'"]');
async function library(p,id){
  await p.reload({waitUntil:'domcontentloaded'});
  await p.locator('.tab[data-tab="library"]').click();await p.locator('#libq').fill(id==='bench-press'?'Bench press':'');
  await p.locator('[data-a="openEx"][data-id="'+id+'"]').first().click();
}
const store=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('mt.data.v1')));
const session=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('mt.play')));
async function quit(p){await select(p,'quitPlay').click();await select(p,'quitDiscard').click();}
async function run(){
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const browser=await launch();
  try{
    const context=await browser.newContext({viewport:{width:375,height:812},isMobile:true,hasTouch:true,locale:'hr-HR'});
    const p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.setDefaultTimeout(6000);
    await p.goto('http://127.0.0.1:'+server.address().port+'/');await p.getByRole('heading',{name:'Bok, Tomislav'}).waitFor();
    assert.deepEqual(await p.locator('.tab span').allInnerTexts(),['Moj pregled','Početna','Knjižnica','Napredak']);
    assert.equal(await select(p,'homeGuide').count(),0);
    await library(p,'bench-press');await select(p,'playEx').click();
    const form=p.locator('#starting-load-form'), weight=form.locator('input').first();
    await form.waitFor();assert.equal(await session(p),null);
    const submit=form.getByRole('button',{name:'Spremi i kreni'});
    await submit.click();assert.match(await p.locator('#start-weight-error').innerText(),/Provjeri/);
    await weight.fill('0');await submit.click();assert.equal(await session(p),null);
    await weight.fill('19,5');
    await p.evaluate(()=>{const old=Storage.prototype.setItem;window.restoreWeightTest=()=>{Storage.prototype.setItem=old;};Storage.prototype.setItem=function(k,v){if(k==='mt.data.v1')throw new DOMException('Test','QuotaExceededError');return old.call(this,k,v);};});
    await submit.click();assert.match(await p.locator('#start-weight-error').innerText(),/nije spremljena/);
    assert.equal(await weight.inputValue(),'19,5');assert.equal((await store(p)).exercises['bench-press'].kg,0);
    await p.evaluate(()=>window.restoreWeightTest());await submit.click();await select(p,'quitPlay').waitFor();
    assert.equal((await session(p)).items[0].kg,19.5);assert.equal((await store(p)).exercises['bench-press'].kg,19.5);
    await quit(p);await p.reload();await library(p,'bench-press');await select(p,'playEx').click();await select(p,'quitPlay').waitFor();assert.equal(await form.count(),0);await quit(p);
    await p.reload({waitUntil:'domcontentloaded'});await p.locator('.tab[data-tab="dashboard"]').click();await select(p,'dashboardProtocols').first().click();
    const target=await p.evaluate(()=>Object.entries(JSON.parse(localStorage.getItem('mt.data.v1')).protocols).find(([,pr])=>!pr.program&&pr.items?.some(it=>it.exId==='bench-press'))?.[0]);
    assert.ok(target);await p.locator('[data-a="openPr"][data-id="'+target+'"]').first().click();await select(p,'startPr').click();await form.waitFor();
    const before=(await store(p)).protocols[target]; const all=form.locator('input');assert.ok(await all.count()>1);
    for(let i=0;i<await all.count();i++)await all.nth(i).fill('12,5');
    if(!wk)await p.screenshot({path:path.join(output,'pocetna-tezina-1.14.0.png')});
    await submit.click();await select(p,'quitPlay').waitFor();
    const actual=await session(p), updated=(await store(p)).protocols[target];
    assert.deepEqual(updated.items.map(i=>[i.exId,i.reps,i.sets]),before.items.map(i=>[i.exId,i.reps,i.sets]));
    assert.ok(updated.items.some((it,i)=>it.kg===12.5&&before.items[i].kg===0));
    assert.equal(actual.items.find(i=>i.exId==='bench-press').kg,12.5);
    assert.equal((await store(p)).exercises['bench-press'].kg,19.5);
    await quit(p);await select(p,'startPr').click();await select(p,'quitPlay').waitFor();assert.equal(await form.count(),0);await quit(p);
    const bodyId=Object.entries((await store(p)).exercises).find(([,e])=>e.measure==='time'&&e.equip.includes('Bez opreme'))?.[0];
    assert.ok(bodyId);await library(p,bodyId);await select(p,'playEx').click();await select(p,'quitPlay').waitFor();await quit(p);
    const otherId=Object.entries((await store(p)).exercises).find(([id,e])=>id!=='bench-press'&&e.cat==='Snaga'&&e.equip.includes('Šipka')&&!e.kg)[0];
    await library(p,otherId);await select(p,'playEx').click();await form.waitFor();await weight.fill('20');
    const second=await context.newPage();await second.goto('http://127.0.0.1:'+server.address().port+'/');
    await library(second,otherId);await select(second,'playEx').click();await second.locator('#starting-load-form input').fill('30');
    await second.locator('#starting-load-form button[type="submit"]').click();await select(second,'quitPlay').waitFor();
    await submit.click();await p.getByText('Trening ili prijedlog se promijenio. Provjeri ga prije pokretanja.').waitFor();
    assert.equal((await store(p)).exercises[otherId].kg,30);assert.equal((await session(p)).items[0].kg,30);
    await quit(second);await second.close();
    assert.equal((await store(p)).log.length,0);assert.deepEqual(errors,[]);
    console.log(JSON.stringify({engine:wk?'WebKit':'Chrome',soloKg:19.5,protocolKg:12.5,invalidBlocked:true,writeRefusalRetainsDraft:true,reloadNoRepeat:true,unloadedStarts:true,staleWeightBlocked:true}));
  }finally{await browser.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
}
run().catch(error=>{console.error(error);process.exitCode=1;});
