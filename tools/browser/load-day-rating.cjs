'use strict';

const assert=require('node:assert/strict');
const {engine,fixture,launch,serve}=require('./runtime.cjs');
const at=(value,offset='+01:00')=>new Date(value+offset).getTime();
const action=(page,name)=>page.locator('[data-a="'+name+'"]');
const dialog=page=>page.locator('#training-load-info[open]');
const day=(page,date)=>page.locator('.tl-day-controls button[data-date="'+date+'"]');
const workouts=page=>dialog(page).locator('[data-load-workout]');
const row=(page,id)=>dialog(page).locator('[data-load-workout="'+id+'"]');
const stored=page=>page.evaluate(()=>JSON.parse(localStorage.getItem('mt.data.v1')).log);
const rating=(page,id)=>row(page,id).locator('[name="srpe"]');
const submit=(page,id)=>row(page,id).getByRole('button',{name:'Spremi ocjenu',exact:true}).click();

async function run(page,context,url){
  const data=fixture();
  data.log=[
    {historyId:'day-unrated',kind:'team',teamType:'match',name:'Utakmica bez ocjene',at:at('2026-11-05T11:00:00'),secs:600},
    {historyId:'day-zero',kind:'protocol',name:'Poznata nula',at:at('2026-11-05T10:00:00'),secs:1200,srpe:0},
    {historyId:'day-no-duration',kind:'protocol',name:'Zapis bez trajanja',at:at('2026-11-05T09:00:00')},
    {historyId:'day-trial',kind:'exercise',name:'Iz knjižnice',at:at('2026-11-05T08:00:00'),secs:180,srpe:10},
    {historyId:'day-future',kind:'team',teamType:'training',name:'U budućnosti',at:at('2026-11-05T18:00:00'),secs:1200,srpe:10},
    {historyId:'bin-first',kind:'field',name:'Teren na početku razdoblja',at:at('2026-10-07T00:00:00','+02:00'),secs:300,srpe:2},
    {historyId:'bin-last',kind:'team',teamType:'training',name:'Zadnji trening u razdoblju',at:at('2026-10-10T23:59:59','+02:00'),secs:900},
    {historyId:'bin-out',kind:'protocol',name:'Sljedeće razdoblje',at:at('2026-10-11T00:00:00','+02:00'),secs:100,srpe:5}
  ];
  // the day buttons belong to the 7-day window, picked as the user would (the default is 3 months since 1.21)
  data.settings.analysisPeriod='7d';data.settings.analysisPeriodChosen=true;
  await page.clock.setFixedTime(new Date('2026-11-05T12:00:00+01:00'));
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await action(page,'dataSheet').click();
  await page.locator('#importFile').setInputFiles({name:'load-day-fixture.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});
  await action(page,'restoreApply').click();
  await page.locator('.tab[data-tab="analytics"]').click();

  await day(page,'2026-11-04').click();
  assert.match(await dialog(page).innerText(),/Nema zabilježenog treninga/);
  assert.equal(await workouts(page).count(),0);
  await page.keyboard.press('Escape');
  await day(page,'2026-11-05').click();
  assert.deepEqual(await workouts(page).evaluateAll(rows=>rows.map(row=>row.dataset.loadWorkout)),['day-unrated','day-zero','day-no-duration']);
  assert.match(await row(page,'day-zero').innerText(),/0 \/ 10/);
  assert.match(await row(page,'day-zero').innerText(),/0 j\.n\./);   // 1.24.0: the unit is "j.n." everywhere
  assert.equal(await rating(page,'day-zero').count(),0);
  assert.equal(await rating(page,'day-unrated').inputValue(),'');
  await submit(page,'day-unrated');
  assert.match(await row(page,'day-unrated').getByRole('alert').innerText(),/cijeli broj/);
  assert.equal((await stored(page)).find(entry=>entry.historyId==='day-unrated').srpe,undefined);
  await rating(page,'day-unrated').fill('11');
  await submit(page,'day-unrated');
  assert.equal(await rating(page,'day-unrated').inputValue(),'11');

  await rating(page,'day-unrated').fill('0');
  await page.evaluate(()=>{
    const write=Storage.prototype.setItem;
    Storage.prototype.setItem=function(key,value){
      if(key==='mt.data.v1'){Storage.prototype.setItem=write;throw new Error('synthetic refusal');}
      return write.call(this,key,value);
    };
  });
  await submit(page,'day-unrated');
  assert.match(await row(page,'day-unrated').getByRole('alert').innerText(),/nije spremljena/i);
  assert.equal(await rating(page,'day-unrated').inputValue(),'0');
  assert.equal((await stored(page)).find(entry=>entry.historyId==='day-unrated').srpe,undefined);
  await submit(page,'day-unrated');
  assert.match(await row(page,'day-unrated').innerText(),/0 j\.n\./);
  assert.equal(await rating(page,'day-unrated').count(),0);
  assert.equal((await stored(page)).find(entry=>entry.historyId==='day-unrated').srpe,0);
  await rating(page,'day-no-duration').fill('6');
  await submit(page,'day-no-duration');
  assert.match(await row(page,'day-no-duration').innerText(),/6 \/ 10/);
  assert.match(await row(page,'day-no-duration').locator('.tl-session-values').innerText(),/Napor\s*—/);
  assert.equal((await stored(page)).find(entry=>entry.historyId==='day-no-duration').secs,undefined);
  await page.keyboard.press('Escape');

  await page.getByRole('button',{name:'Zadnjih 30 dana',exact:true}).click();
  assert.equal(await day(page,'2026-10-07').getAttribute('data-end-date'),'2026-10-10');
  await day(page,'2026-10-07').click();
  assert.deepEqual(await workouts(page).evaluateAll(rows=>rows.map(row=>row.dataset.loadWorkout)),['bin-last','bin-first']);
  await row(page,'bin-first').getByRole('button',{name:'Otvori zapis · Teren na početku razdoblja'}).click();
  await page.locator('.hy-record-title').filter({hasText:'Teren na početku razdoblja'}).waitFor();
  await page.getByRole('button',{name:'Natrag',exact:true}).click();
  assert.equal(await dialog(page).locator('[data-load-day-detail]').getAttribute('data-end-date'),'2026-10-10');
  assert.deepEqual(await workouts(page).evaluateAll(rows=>rows.map(row=>row.dataset.loadWorkout)),['bin-last','bin-first']);

  const peer=await context.newPage();
  await peer.goto(url,{waitUntil:'domcontentloaded'});
  await rating(page,'bin-last').fill('5');
  await page.evaluate(()=>{
    window.sawDayStorage=false;
    window.addEventListener('storage',function onStorage(event){
      if(event.key==='mt.data.v1'){window.removeEventListener('storage',onStorage);window.sawDayStorage=true;}
    });
  });
  await peer.evaluate(()=>{
    const key='mt.data.v1',data=JSON.parse(localStorage.getItem(key));
    const row=data.log.find(row=>row.historyId==='bin-last');
    row.srpe=8;row.editedAt=Date.now();
    localStorage.setItem(key,JSON.stringify(data));
  });
  await page.waitForFunction(()=>window.sawDayStorage);
  assert.equal(await rating(page,'bin-last').inputValue(),'5');
  await submit(page,'bin-last');
  assert.match(await row(page,'bin-last').getByRole('alert').innerText(),/u međuvremenu promijenio/);
  assert.equal(await rating(page,'bin-last').inputValue(),'5');
  assert.equal((await stored(page)).find(entry=>entry.historyId==='bin-last').srpe,8);
  await page.keyboard.press('Escape');
  await page.waitForFunction(()=>document.querySelector('[data-load-day="2026-10-07"]')?.dataset.knownAu==='130');
  await day(page,'2026-10-07').click();
  assert.match(await row(page,'bin-last').innerText(),/8 \/ 10/);
  assert.match(await row(page,'bin-last').innerText(),/120 j\.n\./);
  assert.equal(await rating(page,'bin-last').count(),0);
  await peer.close();
}

(async()=>{
  const host=await serve(),browser=await launch();
  try{
    const context=await browser.newContext({viewport:{width:320,height:780},hasTouch:true,isMobile:true,timezoneId:'Europe/Zagreb',locale:'hr-HR',serviceWorkers:'block',reducedMotion:'reduce'});
    const page=await context.newPage(),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.setDefaultTimeout(8000);
    try{await run(page,context,host.url);}catch(error){console.error((await page.locator('.view,dialog[open]').allInnerTexts()).join('\n').slice(0,1800));throw error;}
    assert.deepEqual(errors,[]);
    console.log(engine+' load chart: exact dates, history navigation, known zero and safe writes passed');
  }finally{await browser.close();await host.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
