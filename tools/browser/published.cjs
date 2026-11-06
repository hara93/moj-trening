'use strict';
const {openJournal,closeJournal,openQuit}=require('./runtime.cjs');

// Run after publishing. Uses a new disposable browser context, no imported backup,
// no user's browser profile. Test weights stay in the disposable browser context.
const {launch,repo,artifacts,appVersion}=require('./runtime.cjs');
const { createHash } = require('node:crypto');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const base = process.env.MT_BASE_URL || 'https://hara93.github.io/moj-trening/';
const expectedVersion = appVersion;
const reportPath = path.join(artifacts, 'published-release-check.json');
const screenshotPath = path.join(artifacts, 'published-release-375.png');
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');

async function main() {
  const revision = execFileSync('/usr/bin/git', ['rev-parse','--short','HEAD'], {cwd:repo,encoding:'utf8'}).trim();
  const appSource = fs.readFileSync(path.join(repo,'app.js'),'utf8');
  assert.equal(/const APP_VERSION\s*=\s*'([^']+)'/.exec(appSource)?.[1], expectedVersion, 'local app must be the intended release');
  const html = fs.readFileSync(path.join(repo,'index.html'),'utf8');
  const runtime = new Set(['index.html','sw.js']);
  const bodySource = JSON.parse(fs.readFileSync(path.join(repo,'tools/build/body-regions.json'),'utf8'));
  if (!bodySource.visuals) Object.values(bodySource.images).forEach(file => runtime.add(file));
  for (const match of html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)) if (!/^(?:https?:)?\/\//.test(match[1])) runtime.add(match[1]);
  for (const match of html.matchAll(/<link\b[^>]*\brel="stylesheet"[^>]*\bhref="([^"]+)"/g)) if (!/^(?:https?:)?\/\//.test(match[1])) runtime.add(match[1]);
  for (const required of ['app.js','body.js','month-plan.js','muscle-work.js','dashboard.js','dashboard.css','style.css','today-model.js','today-view.js','team.js','today.css','team.css','history-model.js','progress-view.js','progress.css','starting-load.js','starting-load.css','workout-view.js','workout.css','training-load.js','training-load-view.js','training-load.css','session-clock.js']) assert(runtime.has(required),'missing local runtime dependency '+required);

  const browser = await launch();
  const report = {revision,expectedVersion,base,files:[],checks:{},errors:[]};
  let context;
  try {
    context = await browser.newContext({viewport:{width:375,height:812},hasTouch:true,isMobile:true,deviceScaleFactor:1,locale:'hr-HR',timezoneId:'Europe/Zagreb'});
    const page = await context.newPage();
    page.setDefaultTimeout(8000);
    page.on('pageerror',error=>report.errors.push(error.message));

    // API requests do not use a service worker. Match every shipped local JS/CSS
    // dependency, the HTML entry and service worker to the exact local bytes.
    for (const file of runtime) {
      const response = await context.request.get(base+file+'?verify='+encodeURIComponent(revision),{headers:{'Cache-Control':'no-cache'}});
      assert.equal(response.status(),200,file+' HTTP status');
      const bytes = await response.body();
      assert.ok(bytes.equals(fs.readFileSync(path.join(repo,file))),file+' differs from the tested local release');
      const item={path:file,status:response.status(),matches:true,sha256:sha256(bytes)};
      report.files.push(item);
      console.log(file,item.sha256);
    }
    const response = await page.goto(base,{waitUntil:'domcontentloaded'});
    assert.equal(response.status(),200,'public entry HTTP status');
    await page.getByRole('button',{name:'Podaci i sigurnosna kopija',exact:true}).click();
    await page.getByText('Verzija '+expectedVersion,{exact:true}).waitFor();
    report.checks.versionVisible=true;
    await page.keyboard.press('Escape');

    assert.equal(await page.locator('.tabbar [data-tab]').count(),4);
    assert.equal(await page.locator('[data-a="monthOpen"]').count(),0);
    await page.getByRole('button',{name:'Moj pregled',exact:true}).click();
    await page.getByRole('heading',{name:'Moj pregled',exact:true}).waitFor();
    await page.locator('[data-a="todayOpen"]').click();
    await page.getByRole('heading',{name:'Danas',exact:true}).waitFor();
    await page.locator('#today-recommendation').waitFor();
    report.checks.todayCard=await page.locator('#today-recommendation h2').innerText();
    await page.locator('[data-a="morningOpen"]').first().click();
    assert.equal(await page.locator('#morning-form select').count(),3);
    await page.getByRole('button',{name:'Natrag',exact:true}).click();
    await page.locator('[data-a="teamNew"]').click();
    await page.locator('#team-entry-form').waitFor();
    assert.equal(await page.locator('#team-type option').count(),2);
    await page.locator('[data-a="teamCancel"]').first().click();
    await page.getByRole('heading',{name:'Danas',exact:true}).waitFor();
    await page.getByRole('button',{name:'Natrag',exact:true}).click();
    report.checks.dailyMorningTeamOnLive=true;
    assert.equal(await page.locator('.db-muscle').count(),0);
    assert.equal(await page.locator('.db-quick [data-a="dashboardCalendar"]').count(),1);
    await page.locator('[data-a="dashboardProgress"]').click();
    await page.getByRole('heading',{name:'Napredak',exact:true}).waitFor();
    assert.equal(await page.locator('.pg-main-card').count(),1);
    assert.equal(await page.locator('.pg-summary-pair>button').count(),2);
    await page.locator('[data-a="progressDetail"][data-topic="activity"]').first().click();
    await page.locator('#progress-info[open] #pg-activity').waitFor();
    await page.locator('#progress-info [data-a="progressInfoClose"]').first().click();
    const progressHelp=page.locator('[data-a="progressInfo"]:visible').first();
    await progressHelp.click();
    await page.locator('#progress-info[open]').waitFor();
    await page.locator('#progress-info [data-a="progressInfoClose"]').first().click();
    report.checks.progressDetailsAndHelp=true;
    await page.getByRole('button',{name:'Natrag',exact:true}).click();
    report.checks.simplifiedNavigation=true;
    await page.locator('[data-a="dashboardAnalytics"]').click();
    assert.equal(await page.locator('.db-region[role="button"][data-a="dashboardGroup"]').count(),19,'18 muscle groups across 19 selectable front/back regions');
    assert.equal(await page.locator('.db-region[role="button"][data-a="dashboardJoint"]').count(),4,'four visible joint regions, including both hip views');
    assert.equal(await page.locator('.db-comparison-row').count(),18,'18 comparison rows including disclosure');
    assert.equal(await page.locator('.db-body-svg g[data-view="front"]').count(),1);
    assert.equal(await page.locator('.db-body-svg g[data-view="back"]').count(),1);
    report.checks.dashboardAnatomy18=true;

    // The fresh device has no recorded personal workouts. Exercise the accessible
    // group disclosure and keyboard selection without creating any history.
    const chest = page.locator('.db-comparison-row[data-id="chest"]');
    if (!await chest.isVisible()) await page.locator('.db-groups summary').click();
    await chest.focus();
    await chest.press('Enter');
    assert.equal(await page.locator('#db-group-title').innerText(),'Prsa');
    assert.equal(await page.locator('.db-comparison-row[data-id="chest"]').getAttribute('aria-pressed'),'true');
    report.checks.groupPickerKeyboard=true;

    const triceps=page.locator('.db-region[data-id="triceps"]');
    await triceps.scrollIntoViewIfNeeded();
    await triceps.focus();
    await triceps.press('Enter');
    assert.equal(await page.locator('#db-group-title').innerText(),'Triceps');
    report.checks.figureKeyboard=true;

    const store = () => page.evaluate(()=>Object.fromEntries(['mt.data.v1','mt.settings','mt.weeks','mt.skips'].map(key=>[key,localStorage.getItem(key)])));
    const totals = async () => ({
      selected:await page.locator('#db-group-title').innerText(),
      total:await page.locator('.db-detail-total strong').innerText(),
      counts:await page.locator('.db-counts').innerText(),
      summary:await page.locator('.db-ring strong').innerText()
    });
    const toggle=page.getByRole('switch',{name:'Uključi preostali plan',exact:false});
    if (await toggle.getAttribute('aria-checked')==='true') await toggle.click();
    const beforeStore=await store(), beforeTotals=await totals();
    await toggle.click();
    assert.equal(await toggle.getAttribute('aria-checked'),'true');
    assert.equal(await page.locator('.db-comparison-legend .db-swatch-plan').count(),1);
    assert.deepEqual(await totals(),beforeTotals,'forecast must preserve recorded totals');
    assert.deepEqual(await store(),beforeStore,'forecast must not write history or calendar');
    await toggle.click();
    assert.equal(await toggle.getAttribute('aria-checked'),'false');
    assert.equal(await page.locator('.db-group-plan').count(),0);
    assert.equal(await page.locator('.db-session-state').filter({hasText:'U preostalom planu'}).count(),0);
    assert.deepEqual(await totals(),beforeTotals);
    assert.deepEqual(await store(),beforeStore);
    report.checks.forecastReadOnly=true;

    // Each daily column must open its own date, including dates other than today.
    const dayButtons=page.locator('.db-daily button[data-date]');
    assert.equal(await dayButtons.count(),7);
    const today=await page.locator('.db-daily button[aria-current="date"]').getAttribute('data-date');
    const dates=await dayButtons.evaluateAll(buttons=>buttons.map(button=>button.dataset.date));
    const clickedDate=dates.find(date=>date!==today);
    await page.locator('.db-daily button[data-date="'+clickedDate+'"]').click();
    assert.equal(await page.locator('[data-a="monthDate"][data-date="'+clickedDate+'"]').getAttribute('aria-pressed'),'true');
    const agendaDate=await page.locator('.mc-agenda h2').innerText();
    const expectedDate=await page.evaluate(date=>new Date(date+'T12:00:00').toLocaleDateString('hr-HR',{weekday:'long',day:'numeric',month:'long'}),clickedDate);
    assert.equal(agendaDate.toLocaleLowerCase('hr-HR'),expectedDate.toLocaleLowerCase('hr-HR'));
    report.checks.dayOpensExactDate={clickedDate,agendaDate};
    await page.getByRole('button',{name:'Natrag',exact:true}).click();

    await page.locator('.db-analytics [data-a="back"]').click();
    await page.locator('[data-a="historyList"]').click();
    await page.getByRole('heading',{name:'Povijest treninga',exact:true}).waitFor();
    report.checks.historyOpensOnLiveApp=true;
    await page.getByRole('button',{name:'Natrag',exact:true}).click();
    await page.locator('.db-quick [data-a="dashboardProtocols"]').click();
    await page.getByRole('heading',{name:'Moji protokoli',exact:true}).waitFor();
    assert.ok(await page.locator('[data-a="newPr"]').count(),'actual protocol list retains creation control');
    await page.getByRole('button',{name:'Natrag',exact:true}).click();
    await page.getByRole('heading',{name:'Moj pregled',exact:true}).waitFor();
    report.checks.protocolsLink=true;

    for (const width of [320,375]) {
      await page.setViewportSize({width,height:812});
      const size=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth,view:document.querySelector('.dashboard').clientWidth,content:document.querySelector('.dashboard').scrollWidth}));
      assert.ok(size.document<=size.viewport+1 && size.content<=size.view+1,'dashboard overflows at '+width+'px: '+JSON.stringify(size));
      report.checks['width'+width]=size;
    }
    await page.locator('.view.dashboard').evaluate(view=>{view.scrollTop=0;});
    await page.screenshot({path:screenshotPath,animations:'disabled'});

    // Check the older figure entry too, in the same unused disposable context.
    await page.goto(base+'?verify='+encodeURIComponent(revision),{waitUntil:'domcontentloaded'});
    await page.getByRole('button',{name:'Knjižnica vježbi',exact:true}).click();
    await page.getByRole('button',{name:'Filter vježbi',exact:true}).click();
    await page.locator('.filtfig').waitFor();
    assert.equal(await page.locator('.filtfig [data-region]').count(),23);
    assert.equal(await page.locator('.filtfig [data-region="hip_joints"]').count(),2);
    assert.equal(await page.locator('.filtfig .body-art').count(),2);
    assert.equal(await page.locator('.filtfig [data-region="front_shoulders"]').count(),1);
    assert.equal(await page.locator('.filtfig [data-region="back_rear_shoulders"]').count(),1);
    report.checks.anatomy21RegionsBothHips=true;
    await page.keyboard.press('Escape');
    await page.locator('.tabbar [data-tab="dashboard"]').click();
    await page.locator('.db-quick [data-a="dashboardProtocols"]').click();
    await page.locator('.view [data-a="fieldList"]').click();
    await page.screenshot({path:path.join(artifacts,'published-release-field.png'),animations:'disabled'});
    for (const cat of ['speed','agility','endurance','tests']) {
      await page.locator('[data-a="fieldCategory"][data-cat="'+cat+'"]').click();
      assert.ok(await page.locator('#field-results [data-a="openField"]').count());
    }
    report.checks.fieldCategories=true;
    await page.locator('.view [data-a="back"]').first().click();
    await page.locator('.view [data-a="openPr"]').first().click();
    await page.locator('.workout-compact-row').first().waitFor();
    await page.locator('.workout-compact-row').first().click();
    assert.ok(await page.locator('.workout-fullscreen .workout-set-row').count()>0,'exercise shows set rows before starting');
    await page.locator('[data-a="workoutClose"]').click();
    await page.locator('[data-a="startPr"]').click();
    if(await page.locator('#starting-load-form').isVisible()) {
      const fields=page.locator('#starting-load-form input');
      for(let i=0;i<await fields.count();i++)await fields.nth(i).fill('10');
      await page.locator('#starting-load-form button[type="submit"]').click();
    }
    await page.locator('.workout-cinema').waitFor();
    await page.locator('.workout-cinema .cinema-single-media img').evaluate(img=>img.decode());
    await page.screenshot({path:path.join(artifacts,'published-cinema-player-375.png'),animations:'disabled'});
    report.checks.cinematicPlayer=true;
    await page.locator('[data-a="playDoseEdit"]').first().click();
    await page.locator('#play-dose-form').waitFor();
    assert.ok(await page.locator('#play-dose-form input').count()>=2);
    await page.screenshot({path:path.join(artifacts,'published-release-dose-proof.png'),animations:'disabled'});
    await page.locator('[data-a="playDoseCancel"]').click();
    report.checks.liveDoseEditor=true;
    await openJournal(page,true);
    const count=await page.locator('.workout-journal .workout-set-row').count();
    assert.ok(count>0);report.checks.liveIndividualSets=count;
    await openQuit(page);
    await page.locator('[data-a="quitDiscard"]').click();
    await page.goto(base,{waitUntil:'domcontentloaded'});
    await page.getByRole('button',{name:'Knjižnica vježbi',exact:true}).click();
    await page.locator('#libq').fill('Bench press');
    await page.locator('[data-a="openEx"][data-id="bench-press"]').first().click();
    assert.ok(await page.locator('.workout-exercise-page .workout-set-row').count()>0);
    await page.locator('[data-a="playEx"]').click();
    await page.getByRole('heading',{name:'Unesi početnu težinu'}).waitFor();
    await page.locator('#starting-load-form input').first().fill('17,5');
    await page.locator('#starting-load-form button[type="submit"]').click();
    await page.locator('.workout-cinema,[data-a=quitPlay]').waitFor();
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mt.play')).items[0].kg),17.5);
    report.checks.liveInitialWeightAndExercisePreview=true;
    assert.deepEqual(report.errors,[],'public runtime errors');
    report.passed=true;
    fs.writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n');
    console.log(JSON.stringify(report,null,2));
  } finally {
    if (context) await context.close();
    await browser.close();
  }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
