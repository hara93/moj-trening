'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const { engine, launch, serve, fixture } = require('./runtime.cjs');

const action = (page, name) => page.locator('[data-a="' + name + '"]');
async function ready(page) {
  await page.getByRole('button', {name:'Knjižnica vježbi',exact:true}).waitFor();
}
async function home(page) {
  await page.reload({waitUntil:'domcontentloaded'});
  await ready(page);
}
async function exportDownload(page) {
  // Exercise the real download path on both engines, independently of OS sharing.
  await page.evaluate(() => Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>false}));
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('.sheet [data-a="exportData"]').click()
  ]);
  return JSON.parse(fs.readFileSync(await download.path(),'utf8'));
}
async function showData(page) {
  await home(page);
  await action(page,'dataSheet').click();
}
async function showHistory(page, id) {
  await home(page);
  await page.getByRole('button',{name:'Moj pregled',exact:true}).click();
  await action(page,'historyList').click();
  await page.locator('[data-a="historyOpen"][data-id="' + id + '"]').click();
  await page.locator('.hy-sets').waitFor();
}

async function twoTabs(browser, url) {
  const context = await browser.newContext({acceptDownloads:true,serviceWorkers:'block',viewport:{width:375,height:850}});
  try {
    const a = await context.newPage();
    await a.goto(url,{waitUntil:'domcontentloaded'});
    await ready(a);
    const data = fixture();
    data.log = [{historyId:'storage-old',kind:'protocol',name:'Stariji sintetički zapis',at:Date.now()-86400000,secs:600}];
    await a.evaluate(value => {
      localStorage.setItem('mt.data.v1',JSON.stringify({v:1,exercises:value.exercises,protocols:value.protocols,
        field:value.field,programs:value.programs,log:value.log,_deleted:[]}));
      localStorage.setItem('mt.settings',JSON.stringify({...value.settings,sound:false}));
    }, data);
    await showData(a);
    const b = await context.newPage();
    await b.goto(url,{waitUntil:'domcontentloaded'});
    await ready(b);
    await b.evaluate(() => {
      const value = JSON.parse(localStorage.getItem('mt.data.v1'));
      value.log.unshift({historyId:'storage-new',kind:'team',teamType:'training',name:'Novi sintetički zapis iz B',at:Date.now()-1000,secs:1800});
      localStorage.setItem('mt.data.v1',JSON.stringify(value));
      const settings = JSON.parse(localStorage.getItem('mt.settings'));
      settings.sound = true;
      localStorage.setItem('mt.settings',JSON.stringify(settings));
    });
    // Allow the real storage event to reach A while its data sheet remains open.
    await a.waitForTimeout(100);
    const storedBefore = await b.evaluate(() => localStorage.getItem('mt.data.v1'));
    const copy = await exportDownload(a);
    assert.deepEqual(copy.log.map(row=>row.historyId),['storage-new','storage-old']);
    assert.equal(copy.settings.sound,true);
    assert.equal(await b.evaluate(() => localStorage.getItem('mt.data.v1')),storedBefore);
    assert.equal(await a.evaluate(() => JSON.parse(localStorage.getItem('mt.lastBackupAt'))),Date.parse(copy.exportedAt));
    await b.evaluate(() => {
      const value = JSON.parse(localStorage.getItem('mt.data.v1'));
      value.log = value.log.filter(row=>row.historyId!=='storage-old');
      value._deleted.push('log/storage-old');
      localStorage.setItem('mt.data.v1',JSON.stringify(value));
    });
    await a.waitForTimeout(100);
    const afterDelete = await exportDownload(a);
    assert.deepEqual(afterDelete.log.map(row=>row.historyId),['storage-new']);
    assert.ok(afterDelete._deleted.includes('log/storage-old'));
    console.log('fresh-two-tab-download',JSON.stringify({engine,records:copy.log.length,settingsFresh:true,deletedNotResurrected:true,dataNotOverwritten:true}));
  } finally {
    await context.close();
  }
}

async function unknownRows(browser, url) {
  const context = await browser.newContext({acceptDownloads:true,serviceWorkers:'block',viewport:{width:375,height:850}});
  try {
    const page = await context.newPage(), errors = [];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(url,{waitUntil:'domcontentloaded'});
    await ready(page);
    const data = fixture();
    const item = {exId:'bench-press',measure:'sets',sets:3,setsDone:3,reps:10,kg:99,done:true};
    data.settings = {...data.settings,sound:false};
    data.log = [
      {historyId:'storage-gaps',kind:'protocol',name:'Nepoznate serije',at:Date.now()-1000,secs:600,
        items:[{...item,repsList:[5,null,3],kgList:[20,30,40],rirList:[2,'bad',0]}]},
      {historyId:'storage-short',kind:'protocol',name:'Kraći popis tereta',at:Date.now()-2000,secs:600,
        items:[{...item,reps:5,kgList:[20]}]}
    ];
    await action(page,'dataSheet').click();
    await page.locator('#importFile').setInputFiles({name:'nepoznate-serije.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});
    await action(page,'restoreApply').click();
    await action(page,'restoreApply').waitFor({state:'hidden'});
    await showHistory(page,'storage-gaps');
    const rows = page.locator('.hy-sets tbody tr');
    assert.deepEqual(await rows.locator('td:first-of-type').allTextContents(),['5','Nije zabilježeno','3']);
    assert.deepEqual(await rows.locator('td:nth-of-type(2)').allTextContents(),['20','30','40']);
    assert.deepEqual(await rows.locator('td:nth-of-type(3)').allTextContents(),['2','Nije zabilježeno','0']);
    await showHistory(page,'storage-short');
    assert.deepEqual(await page.locator('.hy-sets tbody tr td:nth-of-type(2)').allTextContents(),['20','Nije zabilježeno','Nije zabilježeno']);
    await showData(page);
    const copy = await exportDownload(page);
    assert.deepEqual(copy.log.find(row=>row.historyId==='storage-gaps').items[0].repsList,[5,null,3]);
    await home(page);
    const persisted = await page.evaluate(() => JSON.parse(localStorage.getItem('mt.data.v1')));
    assert.deepEqual(persisted.log.find(row=>row.historyId==='storage-gaps').items[0].rirList,[2,null,0]);
    assert.deepEqual(errors,[]);
    console.log('faithful-import-history-export',JSON.stringify({engine,unknownRepPosition:true,weightsStayAligned:true,shortWeightTailUnknown:true,reloadPreservesGaps:true}));
  } finally {
    await context.close();
  }
}

async function singleProtocol(browser, url) {
  const context = await browser.newContext({serviceWorkers:'block',viewport:{width:375,height:850}});
  try {
    const page = await context.newPage(), errors = [];
    page.setDefaultTimeout(8000);
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(url,{waitUntil:'domcontentloaded'});
    await ready(page);
    const backup = fixture(), existingId = 'storage-existing-protocol';
    backup.protocols[existingId] = {id:existingId,name:'Moj postojeći trening',days:[1],
      items:[{exId:'db-row',measure:'sets',sets:2,reps:8,kg:12,rest:60,sides:true}]};
    backup.log = [{historyId:'storage-existing-workout',kind:'protocol',refId:existingId,
      name:'Moj postojeći trening',at:Date.now()-10000,secs:1200}];
    backup.settings = {...backup.settings,sound:false};
    await action(page,'dataSheet').click();
    await page.locator('#importFile').setInputFiles({name:'postojeci-podaci.json',mimeType:'application/json',
      buffer:Buffer.from(JSON.stringify(backup))});
    await action(page,'restoreApply').click();
    await action(page,'restoreApply').waitFor({state:'hidden'});

    const showProtocols = async () => {
      await page.getByRole('button',{name:'Moj pregled',exact:true}).click();
      await action(page,'dashboardProtocols').click();
      await page.getByRole('heading',{name:'Moji protokoli',exact:true}).waitFor();
    };
    const choose = async (contents) => {
      const [picker] = await Promise.all([page.waitForEvent('filechooser'),action(page,'importWorkout').click()]);
      assert.equal(await picker.element().getAttribute('id'),'importWorkoutFile');
      await picker.setFiles({name:'trening.json',mimeType:'application/json',buffer:Buffer.from(contents)});
    };
    const snapshot = () => page.evaluate(() => ({
      data:JSON.parse(localStorage.getItem('mt.data.v1')),
      settings:localStorage.getItem('mt.settings')
    }));
    const plan = {
      kind:'moj-trening-protocol',v:1,id:existingId,days:[3],log:[{historyId:'forged'}],
      name:'Uvezeni trening',desc:'Plan iz samostalne datoteke.',
      items:[
        {exId:'side-plank',sets:1,sec:25,rest:30,section:'Priprema'},
        {exId:'db-row',sets:2,reps:10,rest:90,section:'Snaga',targetRir:3,note:'S osloncem.',sides:false},
        {exId:'db-overhead-press',sets:2,reps:8,rest:60,section:'Snaga',targetRir:4,kg:7.5}
      ]
    };
    const source = JSON.stringify(plan);
    await showProtocols();
    const before = await snapshot();
    for (const invalid of ['{',JSON.stringify(backup),JSON.stringify({...plan,items:[{...plan.items[0],exId:'nepoznata-vjezba'}]})]) {
      await choose(invalid);
      await page.locator('.toast[role="alert"]').waitFor();
      assert.equal(await page.locator('#p-name').count(),0,'invalid file cannot open a draft');
      assert.deepEqual(await snapshot(),before,'invalid file cannot write to storage');
      await home(page);
      await showProtocols();
    }

    await choose(source);
    const name = page.locator('#p-name');
    await name.waitFor();
    assert.equal(await name.inputValue(),plan.name);
    assert.equal(await page.locator('#p-desc').inputValue(),plan.desc);
    assert.equal(await action(page,'itOpen').count(),3);
    assert.deepEqual(await snapshot(),before,'opening the imported draft is read-only');
    await page.locator('.topbar [data-a="back"]').click();
    await action(page,'importWorkout').waitFor();
    assert.deepEqual(await snapshot(),before,'closing the preview leaves the original data');

    await choose(source);
    await name.waitFor();
    await page.locator('.topbar [data-a="savePr"]').click();
    await page.getByRole('heading',{name:plan.name,exact:true}).waitFor();
    const saved = await snapshot();
    const newIds = Object.keys(saved.data.protocols).filter(id=>!Object.hasOwn(before.data.protocols,id));
    assert.equal(newIds.length,1,'saving adds exactly one protocol with a new ID');
    const [newId] = newIds;
    const {[newId]:added,...existing} = saved.data.protocols;
    assert.deepEqual({...saved.data,protocols:existing},before.data,'saving preserves existing data including history');
    assert.equal(saved.settings,before.settings,'saving preserves settings');
    assert.equal(added.name,plan.name);
    assert.deepEqual(added.days,[],'file-supplied schedule is ignored');
    assert.deepEqual(added.items.map(({exId,measure,sets,rest,section,sides})=>({exId,measure,sets,rest,section,sides})),[
      {exId:'side-plank',measure:'time',sets:1,rest:30,section:'Priprema',sides:true},
      {exId:'db-row',measure:'sets',sets:2,rest:90,section:'Snaga',sides:true},
      {exId:'db-overhead-press',measure:'sets',sets:2,rest:60,section:'Snaga',sides:false}
    ]);
    assert.equal(added.items[0].sec,25);
    assert.equal(added.items[1].reps,10);
    assert.equal(added.items[1].targetRir,3);
    assert.equal(added.items[1].note,'S osloncem.');
    assert.equal(added.items[2].kg,7.5);

    await home(page);
    await showProtocols();
    await page.locator('[data-a="openPr"][data-id="' + newId + '"]').click();
    await page.getByRole('heading',{name:plan.name,exact:true}).waitFor();
    assert.deepEqual(await snapshot(),saved,'the imported protocol survives reload');
    await page.getByRole('button',{name:'Pokreni trening',exact:true}).click();
    const missingWeight = page.locator('#starting-load-form input');
    await missingWeight.waitFor();
    assert.equal(await missingWeight.count(),1,'only the exercise with no supplied weight asks for it');
    assert.equal(await missingWeight.inputValue(),'');
    assert.deepEqual(await snapshot(),saved);
    assert.deepEqual(errors,[]);
    console.log('single-protocol-import',JSON.stringify({engine,rejectsInvalid:true,previewWithoutWrites:true,
      newProtocolOnly:true,reload:true,unknownWeightPrompts:true}));
  } finally {
    await context.close();
  }
}

(async () => {
  const host = await serve();
  let browser;
  try {
    browser = await launch();
    await twoTabs(browser,host.url);
    await unknownRows(browser,host.url);
    await singleProtocol(browser,host.url);
  } finally {
    if (browser) await browser.close();
    await host.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
