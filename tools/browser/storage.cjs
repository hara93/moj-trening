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

(async () => {
  const host = await serve();
  let browser;
  try {
    browser = await launch();
    await twoTabs(browser,host.url);
    await unknownRows(browser,host.url);
  } finally {
    if (browser) await browser.close();
    await host.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
