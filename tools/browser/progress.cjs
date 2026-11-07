'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {launch,serve,artifacts,fixture:baseFixture}=require('./runtime.cjs');
const isWebKit = process.argv.includes('webkit');
const prefix = isWebKit ? 'progress-webkit' : 'progress-chrome';
const fixed = new Date('2026-11-04T12:00:00+01:00');
const stamp = day => new Date(day + 'T10:00:00+01:00').getTime();
const A = (page, action) => page.locator('[data-a="' + action + '"]');
const results = [];
function fixture(empty) {
  const data = baseFixture();
  const baseline = Object.values(data.protocols).find(p => p.id.startsWith('pmw'));
  const item = { exId:'bench-press', measure:'sets', sets:2, reps:5, kg:20, rest:60, sides:false };
  data.settings.sound = false; data.settings.planDates = {}; data.settings.matchDates = {}; data.settings.matchDay = -1;
  for (const protocol of Object.values(data.protocols)) {
    protocol.days = [];
    for (const entry of protocol.items || []) { delete entry.ok; delete entry.fail; }
  }
  const own = (id, name, changes) => ({ ...baseline, id, name, days:[], items:[{ ...item, ...changes }] });
  data.protocols['progress-up'] = own('progress-up', 'Predloženo povećanje', { ok:empty?0:2 });
  data.protocols['progress-back'] = own('progress-back', 'Povratak doze', { kg:30, fail:empty?0:2, prev:{...item} });
  data.protocols['progress-nokg'] = own('progress-nokg', 'Početni kilogrami', { kg:0, ok:empty?0:1 });
  data.protocols['progress-way'] = own('progress-way', 'Uspješne izvedbe', { ok:empty?0:1 });
  data.log = empty ? [] : [
    { historyId:'progress-current',kind:'protocol',refId:'progress-up',name:'Potisak · različite serije',at:stamp('2026-11-04'),secs:600,
      items:[{...item,done:true,setsDone:2,repsList:[5,3],kgList:[20,30],rirList:[2,1]}] },
    { historyId:'progress-before',kind:'protocol',refId:'progress-up',name:'Potisak · prije',at:stamp('2026-10-27'),secs:600,
      items:[{...item,kg:15,done:true}] },
    { historyId:'progress-trial',kind:'exercise',refId:'bench-press',name:'Zasebna proba',at:stamp('2026-11-04')-1000,secs:60,
      items:[{...item,sets:1,reps:1,kg:10,done:true}] },
    { historyId:'progress-field',kind:'field',refId:'intervali-15-15',name:'Terenski trening',at:stamp('2026-11-03'),secs:600,
      load:{m:1000,hsr:100,spr:10,min:10,zones:[700,200,90,10]} },
    { historyId:'progress-team',kind:'team',teamType:'training',name:'Klupski trening',at:stamp('2026-11-02'),secs:3600,srpe:6 }
  ];
  return data;
}
function rangeFixture() {
  const data=fixture(true);
  const press=[['2026-07-12',1],['2026-08-06',2],['2026-08-07',3],['2026-10-05',4],
    ['2026-10-06',5],['2026-10-28',6],['2026-10-29',7],['2026-11-04',8],['2026-11-05',17]];
  const session=(date,item)=>({historyId:'range-'+item.exId+'-'+date,kind:'protocol',refId:'progress-up',
    name:'Provjera trenda',at:stamp(date),secs:600,srpe:3,items:[{sets:1,setsDone:1,sides:false,done:true,...item}]});
  data.log=press.map(([date,reps])=>session(date,{exId:'bench-press',measure:'sets',kg:20,reps,repsList:[reps],rirList:[2]}));
  for(const [date,sec] of [['2026-08-25',12],['2026-10-12',18]]) {
    data.log.push(session(date,{exId:'side-plank',measure:'time',kg:0,reps:1,sec,secList:[sec],sirList:[5]}));
  }
  return data;
}
async function home(page) {
  await page.reload({waitUntil:'domcontentloaded'});
  await page.getByRole('button', {name:'Knjižnica vježbi',exact:true}).waitFor();
}
async function importData(page, data) {
  await home(page); await A(page,'dataSheet').click();
  await page.locator('#importFile').setInputFiles({name:'napredak-sinteticki.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});
  await A(page,'restoreApply').click(); await A(page,'restoreApply').waitFor({state:'hidden'});
}
async function progress(page) {
  await home(page); await page.locator('.tab[data-tab="analytics"]').click();
  if (await page.locator('.tl-cinema').count()) await page.locator('[data-a="analyticsMode"][data-v="progress"]').click();
  await page.locator('.progress-view').waitFor();
}
async function noOverflow(page, label) {
  const bounds = await page.evaluate(() => {
    const view=document.querySelector('.progress-view');
    return { width:innerWidth, doc:document.documentElement.scrollWidth, view:view.scrollWidth, available:view.clientWidth };
  });
  assert.ok(bounds.doc <= bounds.width + 1 && bounds.view <= bounds.available + 1, label + ': ' + JSON.stringify(bounds));
  results.push({label,...bounds});
}
async function expand(page, id) {
  const section=page.locator('#pg-'+id);
  if (!await section.evaluate(node=>node.open)) await section.locator(':scope > summary').click();
}
function datePattern(date) {
  const [,month,day]=date.split('-').map(Number);
  return new RegExp('\\b0?'+day+'\\.\\s*0?'+month+'\\.');
}
async function checkExercisePeriods(page) {
  await importData(page,rangeFixture()); await progress(page);
  const main=page.locator('.pg-main-card');
  const select=key=>main.locator('[data-a="progressRange"][data-v="'+key+'"]');
  const metric=key=>main.locator('[data-a="progressMetric"][data-v="'+key+'"]');
  const trend=main.locator('svg.pg-main-line');
  const detail=page.locator('#progress-info');
  const choose=async id=>{
    await main.locator('[data-topic="choose"]').click();
    await detail.locator('[data-a="progressExercise"][data-id="'+id+'"]').click();
  };
  assert.equal(await A(page,'progressRange').count(),4);
  assert.equal(await select('all').getAttribute('aria-pressed'),'true','default preserves the complete exercise history');
  await choose('bench-press');
  const title=await main.locator('h2').innerText();
  const cases=[['7d','2026-10-29',2,7],['1m','2026-10-06',4,5],['3m','2026-08-07',6,3],['all','2026-07-12',8,1]];
  await page.setViewportSize({width:320,height:850});
  for(const [key,first,count,reps] of cases) {
    await select(key).click();
    assert.equal(await select(key).getAttribute('aria-pressed'),'true');
    assert.equal(await main.locator('[data-a="progressRange"][aria-pressed="true"]').count(),1);
    assert.equal(await main.locator('h2').innerText(),title);
    await metric('performance').click();
    assert.equal(await trend.locator('.pg-main-dot').count(),count,key+' performance points');
    const firstPoint=main.locator((key==='7d'?'.pg-point-hit':'#pg-performance > .pg-point-buttons button')+'[data-point-index="0"]');
    assert.match(await firstPoint.getAttribute('aria-label'),datePattern(first));
    if(key==='7d')await firstPoint.click();else await firstPoint.press('Enter');
    assert.match(await detail.locator('h2').innerText(),datePattern(first),key+' detail matches the visible point');
    assert.match(await detail.locator('.pg-point-detail strong').innerText(),new RegExp('^'+reps+'\\s+pon\\.'));
    await page.keyboard.press('Escape');
    assert.equal(await firstPoint.evaluate(node=>document.activeElement===node),true);
    if(key==='all') {
      const more=main.locator('.pg-trend-records');
      await more.locator('summary').click();
      const middle=more.locator('button[data-point-index="4"]');
      await middle.click();
      assert.match(await detail.locator('h2').innerText(),datePattern('2026-10-06'));
      assert.match(await detail.locator('.pg-point-detail strong').innerText(),/^5\s+pon\./);
      await page.keyboard.press('Escape');
      await more.locator('summary').click();
      await main.locator('.pg-main-title').scrollIntoViewIfNeeded();
      await page.screenshot({path:path.join(artifacts,prefix+'-all-range-320.png')});
    }

    await metric('volume').click();
    const volume=main.locator('.pg-main-volume');
    assert.equal(await volume.locator('svg .hit').count(),count,key+' volume points');
    await volume.locator('.ltab summary').click();
    const rows=volume.locator('tbody tr');
    assert.equal(await rows.count(),count);
    assert.match(await rows.last().innerText(),datePattern(first));
    assert.match(await rows.last().innerText(),new RegExp('\\b'+(reps*20)+'\\s+kg\\b'));
    assert.match(await rows.first().innerText(),/\b160\s+kg\b/,'the later-dated session is excluded');
    await noOverflow(page,'exercise-period-'+key+'-320');
  }
  await choose('side-plank');
  const olderTitle=await main.locator('h2').innerText();
  assert.notEqual(olderTitle,title);
  await select('7d').click();
  for(const key of ['performance','volume']) {
    await metric(key).click();
    assert.equal(await main.locator('h2').innerText(),olderTitle,'empty range retains the chosen exercise');
    assert.equal(await main.locator('svg').count(),0,'no out-of-range points on '+key);
    const empty=main.locator(key==='performance'?'.pg-main-empty':'.pg-main-volume .none');
    assert.match(await empty.innerText(),/razdoblj/);
  }
  await select('3m').click();
  await metric('performance').click();
  assert.equal(await trend.locator('.pg-main-dot').count(),2,'a wider range restores the selected exercise trend');
  await page.screenshot({path:path.join(artifacts,prefix+'-range-320.png')});

  const switchMode=key=>page.locator('[data-a="analyticsMode"][data-v="'+key+'"]');
  const loadRange=key=>page.locator('[data-a="trainingLoadRange"][data-v="'+key+'"]');
  await switchMode('load').click();
  assert.equal(await loadRange('7d').getAttribute('aria-pressed'),'true');
  await loadRange('1m').click();
  await switchMode('progress').click();
  assert.equal(await select('3m').getAttribute('aria-pressed'),'true','Opterećenje has its own range');
  assert.equal(await main.locator('h2').innerText(),olderTitle);
  await progress(page);
  assert.equal(await select('3m').getAttribute('aria-pressed'),'true','exercise range persists after reload');
  await switchMode('load').click();
  assert.equal(await loadRange('1m').getAttribute('aria-pressed'),'true');
  results.push({label:'exercise-periods',ranges:cases.map(([key,first,points])=>({key,first,points})),
    periodPersists:true,selectionSurvivesEmptyRange:true,independentLoadPeriod:true});
}
(async () => {
  const host=await serve();
  let browser;
  try {
    browser=await launch();
    const context=await browser.newContext({viewport:{width:375,height:850},serviceWorkers:'block',locale:'hr-HR',timezoneId:'Europe/Zagreb'});
    const page=await context.newPage(), errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.clock.setFixedTime(fixed);
    await page.goto(host.url,{waitUntil:'domcontentloaded'});
    await importData(page,fixture(false)); await progress(page);
    assert.equal(await page.locator('.pg-main-card svg').count(),1,'one actual graph on the overview');
    assert.equal(await page.locator('details.pg-section').count(),0,'advanced data is not mounted until opened');
    await noOverflow(page,'overview375');
    await page.screenshot({path:path.join(artifacts,prefix+'-overview375.png')});
    const activitySummary=page.locator('.pg-summary-pair > button').first();
    await activitySummary.click();
    assert.equal(await page.locator('#progress-info').evaluate(node=>node.open),true);
    assert.ok(await page.locator('#progress-info .pg-dialog-head button').evaluate(node=>node===document.activeElement));
    assert.equal(await page.locator('#progress-info-title').innerText(),'Aktivnost i kontinuitet');
    assert.equal(await page.locator('#pg-consistency .heat i').count(),84);
    await page.keyboard.press('Escape');
    assert.equal(await activitySummary.evaluate(node=>node===document.activeElement),true);
    const plans=()=>page.locator('[data-a="progressDetail"][data-topic="suggestions"]');
    await plans().click();
    assert.equal(await A(page,'sugUp').count(),1);assert.equal(await A(page,'sugRevert').count(),1);assert.ok(await A(page,'editPr').count());
    await expand(page,'load');
    assert.match(await page.locator('#wk-vl').getAttribute('aria-label'),/190 kg/);
    assert.match(await page.locator('#wk-m').getAttribute('aria-label'),/1 km/);
    await page.locator('#wk-vl [data-a="ltip"][data-i="7"]').click();
    assert.equal(await page.locator('#wk-vl .tipg.on').count(),1);
    const card=page.locator('.lc').filter({has:page.locator('#wk-vl')});
    await card.locator('summary').click();assert.match(await card.locator('table').innerText(),/190 kg/);
    await page.locator('[data-a="progressInfo"][data-topic="load"]').click();
    assert.ok(await page.locator('#progress-info [data-a="loadInfo"]').isVisible());
    const scrollBefore=await page.locator('.pg-cinema').evaluate(node=>node.scrollTop);
    await page.mouse.move(5,400);await page.mouse.wheel(0,500);await page.waitForTimeout(120);
    assert.equal(await page.locator('.pg-cinema').evaluate(node=>node.scrollTop),scrollBefore);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#progress-info').evaluate(node=>node.open),false);
    assert.equal(await plans().evaluate(node=>node===document.activeElement),true);
    await plans().click();await A(page,'sugRevert').click();
    await page.waitForFunction(()=>JSON.parse(localStorage.getItem('mt.data.v1')).protocols['progress-back'].items[0].kg===20);
    await plans().click();await A(page,'sugUp').click();
    await page.waitForFunction(()=>JSON.parse(localStorage.getItem('mt.data.v1')).protocols['progress-up'].items[0].reps===6);
    await plans().click();await expand(page,'exercises');await expand(page,'rules');
    assert.ok(await page.locator('#pg-exercises .lc svg').count());
    await page.locator('[data-a="setProgN"][data-v="3"]').click();
    await plans().click();await expand(page,'rules');
    assert.equal(await page.locator('[data-a="setProgN"][data-v="3"]').getAttribute('aria-pressed'),'true');
    await expand(page,'exercises');
    const link=page.locator('#pg-exercises [data-a="openEx"]').first();
    await link.click();await page.locator('.workout-exercise-page').waitFor();await A(page,'back').first().click();
    await page.locator('.pg-cinema').waitFor();
    await page.locator('[data-a="progressDetail"][data-topic="records"]').click();
    assert.ok(await page.locator('#pg-records .pr').count());await page.keyboard.press('Escape');
    await page.locator('[data-a="progressMetric"][data-v="performance"]').click();
    assert.equal(await page.locator('.pg-main-card svg').count(),0,'incomparable loads do not create a performance trend');
    assert.ok(await page.locator('.pg-main-empty').isVisible());
    await page.locator('[data-a="progressMetric"][data-v="volume"]').click();
    assert.equal(await page.locator('.pg-main-card svg').count(),1);
    await page.locator('[data-a="progressDetail"][data-topic="choose"]').click();
    await page.locator('[data-a="progressExercise"]').first().click();
    assert.equal(await page.locator('#progress-info').evaluate(node=>node.open),false);
    await page.locator('[data-a="analyticsMode"][data-v="load"]').click();await page.locator('.tl-cinema').waitFor();
    await page.locator('[data-a="analyticsMode"][data-v="progress"]').click();await page.locator('.pg-cinema').waitFor();
    await page.setViewportSize({width:320,height:850});await noOverflow(page,'overview320');
    await page.screenshot({path:path.join(artifacts,prefix+'-details320.png')});
    await page.locator('[data-a="progTab"][data-v="doziranje"]').click();
    assert.equal(await page.locator('.pg-dosing details.pg-section').count(),4);
    const football=page.locator('#pg-dose-1'); await football.locator(':scope > summary').click();
    const before=Number(await football.locator('.step b').innerText());
    await page.locator('[data-a="setBall"][data-d="1"]').click();
    assert.equal(await football.evaluate(node=>node.open),true);
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mt.settings')).ballN),before+1);
    await page.locator('#matchadd').fill('2026-11-06'); await A(page,'matchAdd').click();
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mt.settings')).matchDates['2026-11-06']),1);
    for (const panel of await page.locator('.pg-dosing details.pg-section').all()) {
      if (!await panel.evaluate(node=>node.open)) await panel.locator(':scope > summary').click();
    }
    await noOverflow(page,'dosingAll320');
    await page.screenshot({path:path.join(artifacts,prefix+'-dosing320.png')});
    const comparable=fixture(false);
    comparable.log=comparable.log.filter(row=>row.historyId!=='progress-trial');
    for(const [id,reps] of [['progress-before',3],['progress-current',5]]) {
      comparable.log.find(row=>row.historyId===id).items=[{exId:'bench-press',measure:'sets',sets:1,setsDone:1,reps,kg:20,rest:60,sides:false,done:true,repsList:[reps],kgList:[20],rirList:[2]}];
    }
    await importData(page,comparable);await progress(page);
    await page.locator('[data-a="progressMetric"][data-v="performance"]').click();
    assert.equal(await page.locator('.pg-main-card svg').count(),1);
    assert.match(await page.locator('.pg-main-context').innerText(),/20 kg.*RIR.*2/);
    const point=page.locator('.pg-point-hit[data-point="current"]');
    await point.click();
    assert.match(await page.locator('#progress-info-body').innerText(),/5 pon\./);
    assert.match(await page.locator('#progress-info-body').innerText(),/RIR.*2/);
    await page.keyboard.press('Escape');
    assert.equal(await point.evaluate(node=>node===document.activeElement),true);
    await page.setViewportSize({width:375,height:850});
    await page.screenshot({path:path.join(artifacts,prefix+'-comparable375.png')});
    await importData(page,fixture(true)); await progress(page);
    if (await page.locator('[data-a="progTab"][data-v="pregled"]').count()) await page.locator('[data-a="progTab"][data-v="pregled"]').click();
    assert.ok(await page.locator('.pg-zero').isVisible());
    assert.equal(await page.locator('.pg-choose, .pg-metric-tabs').count(),0,'no unavailable trend controls on an empty overview');
    await noOverflow(page,'zero320');
    await page.setViewportSize({width:375,height:850});
    await page.screenshot({path:path.join(artifacts,prefix+'-zero375.png')});
    await checkExercisePeriods(page);
    assert.deepEqual(errors,[]);
    await context.close();
    fs.writeFileSync(path.join(artifacts,prefix+'-smoke.json'),JSON.stringify({engine:prefix,checks:results,errors},null,2));
    console.log(JSON.stringify({engine:prefix,checks:results,errors},null,2));
  } finally { if(browser)await browser.close(); await host.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
