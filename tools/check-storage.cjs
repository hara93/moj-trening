'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const History = require('../history-model.js');
const HistoryStore = require('../history-store.js');
const MuscleWork = require('../muscle-work.js');
const MonthPlan = require('../month-plan.js');
const TodayView = require('../today-view.js');
const TrainingLoad = require('../training-load.js');
const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
const copy = value => JSON.parse(JSON.stringify(value));
function between(start, end) {
  const first = source.indexOf(start), last = source.indexOf(end, first + start.length);
  assert.ok(first >= 0 && last > first, start);
  return source.slice(first, last);
}
function baseData() {
  return { v:1, exercises:{ x:{ id:'x', name:'Izvorna vježba' } }, protocols:{}, field:{}, programs:{},
    log:[{ historyId:'old', kind:'protocol', name:'Prije', at:1 }], _deleted:[] };
}
function harness() {
  const base = baseData();
  const disk = new Map([['mt.data.v1', JSON.stringify(base)], ['mt.settings', JSON.stringify({sound:true,goal:'snaga'})]]);
  const calls = { share:[], toast:[], writes:[] };
  const S = { ex:copy(base.exercises), pr:{}, field:{}, prog:{}, log:copy(base.log), _deleted:[],
    settings:{sound:true,goal:'snaga'}, sheet:{kind:'data'} };
  const context = { S, DATA_COLLS:['exercises','protocols','field','programs'], APP_VERSION:'audit',
    BACKUP_KIND:'moj-trening-backup', STORE_KEY:'mt.data.v1', GOALS:{snaga:{},hipertrofija:{}},
    HistoryStore, MuscleWork, MonthPlan, TodayView, TrainingLoad, repairKnownMasLoads:logs=>logs,
    clone:copy, mtCanon:JSON.stringify, FORM_VIEWS:{}, Date,
    localStorage:{getItem:key=>disk.has(key)?disk.get(key):null,removeItem:key=>disk.delete(key)},
    lsSet:(key,value)=>{ calls.writes.push(key);disk.set(key,JSON.stringify(value));return true; },
    top:()=>({v:'home'}), render:()=>{}, fileDate:()=> 'demo',
    EXPORT_MSG:{downloaded:'preuzeto',shared:'podijeljeno',failed:'nije izvezeno',cancelled:'otkazano'},
    shareOrDownload:async (name, body)=>{calls.share.push(JSON.parse(body));return context.shareResult || 'downloaded';},
    toast:(message,error)=>calls.toast.push({message,error}) };
  vm.createContext(context);
  vm.runInContext('let savedJson=' + JSON.stringify(JSON.stringify(base)) + ';let pendingExt=null;' +
    between('const isPlainObj =', '/* ---------- photos and videos') +
    between('const backupObject =', '// a backup is recognised') +
    'this.fresh=freshBackupObject;this.clean=cleanData;this.cleanFixCount=()=>cleanFixes;' +
    'this.handlers=({' + between('  exportData: async () => {', '  exportBad: async () => {') + '});', context);
  return { context, S, disk, calls, base };
}

test('an export sees a deferred second-tab workout/settings without mutating the open view or saved data', async () => {
  const h = harness();
  const latest = copy(h.base);
  latest.log.unshift({historyId:'new',kind:'team',name:'Novo iz druge kartice',at:2,secs:1800});
  latest.exercises.x.name = 'Noviji naziv';
  h.disk.set('mt.data.v1',JSON.stringify(latest));
  h.disk.set('mt.settings',JSON.stringify({sound:false,goal:'hipertrofija',trainingLoadPeriod:'3m',progressChartPeriod:'1m',
    progressPinnedIds:['x','x','__proto__',42,'y','z','over-limit'],morningChecks:{'2026-11-05':{date:'2026-11-05',pain:0}}}));
  const before = JSON.stringify(h.S), stored = h.disk.get('mt.data.v1');
  await h.context.handlers.exportData();
  const backup = h.calls.share[0];
  assert.deepEqual(backup.log.map(row=>row.historyId),['new','old']);
  assert.equal(backup.exercises.x.name,'Noviji naziv');
  assert.equal(backup.settings.sound,false);
  assert.equal(backup.settings.trainingLoadPeriod,'3m');
  assert.equal(backup.settings.progressChartPeriod,'1m');
  assert.equal(backup.settings.analysisPeriod,'1m');
  assert.deepEqual(Array.from(backup.settings.progressPinnedIds),['x','y','z']);
  assert.equal(backup.settings.morningChecks['2026-11-05'].pain,0);
  assert.equal(JSON.stringify(h.S),before);
  assert.equal(h.disk.get('mt.data.v1'),stored);
  assert.deepEqual(h.calls.writes,['mt.lastBackupAt']);
  assert.equal(JSON.parse(h.disk.get('mt.lastBackupAt')),Date.parse(backup.exportedAt));
});

test('three-way backup merge retains local unsaved work plus external additions and deletions', () => {
  const h = harness(), latest = copy(h.base);
  h.S.ex.x.name = 'Lokalna izmjena';
  h.S.log.unshift({historyId:'local',kind:'protocol',name:'Lokalno',at:4});
  latest.exercises.y = {id:'y',name:'Nova vježba'};
  latest.log = [{historyId:'remote',kind:'team',name:'Druga kartica',at:3}];
  latest._deleted = ['log/old'];
  h.disk.set('mt.data.v1',JSON.stringify(latest));
  const result = copy(h.context.fresh());
  assert.equal(result.exercises.x.name,'Lokalna izmjena');
  assert.equal(result.exercises.y.name,'Nova vježba');
  assert.deepEqual(result.log.map(row=>row.historyId),['local','remote']);
  assert.deepEqual(result._deleted,['log/old']);
  assert.equal(h.S.log.length,2);
  assert.deepEqual(h.S._deleted,[]);
});

test('unreadable or continually changing source fails honestly without sharing or recording a backup', async () => {
  for (const corrupt of ['{', JSON.stringify({log:[]})]) {
    const h = harness();
    h.disk.set('mt.data.v1',corrupt);
    await h.context.handlers.exportData();
    assert.equal(h.calls.share.length,0);
    assert.equal(h.disk.has('mt.lastBackupAt'),false);
    assert.equal(h.calls.toast.at(-1).error,true);
  }
  const h = harness();
  let sequence = 0;
  h.context.localStorage.getItem = key => key === 'mt.data.v1' ? JSON.stringify({...h.base,revision:sequence++}) : '{}';
  await h.context.handlers.exportData();
  assert.equal(h.calls.share.length,0);
  assert.equal(h.disk.has('mt.lastBackupAt'),false);
});

test('cancelled sharing never marks a backup, and later concurrent saves are not overwritten', async () => {
  const h = harness();
  h.context.shareResult = 'cancelled';
  await h.context.handlers.exportData();
  assert.equal(h.disk.has('mt.lastBackupAt'),false);
  h.context.shareOrDownload = async (name,body) => {
    h.calls.share.push(JSON.parse(body));
    h.disk.set('mt.data.v1',JSON.stringify({...h.base,log:[{historyId:'after-snapshot',at:5}]}));
    return 'downloaded';
  };
  await h.context.handlers.exportData();
  assert.equal(JSON.parse(h.disk.get('mt.data.v1')).log[0].historyId,'after-snapshot');
  assert.deepEqual(h.calls.share.at(-1).log.map(row=>row.historyId),['old']);
});

function cleanItem(item) {
  const h = harness(), data = baseData();
  data.log = [{historyId:'rows',name:'Primjer',kind:'protocol',at:10,items:[item]}];
  return copy(h.context.clean(data).log[0].items[0]);
}
test('a proven history repair signals hydration persistence only when the repair changes the normalized log', () => {
  const h = harness();
  h.context.clean(baseData());
  assert.equal(h.context.cleanFixCount(),0);
  h.context.repairKnownMasLoads = logs => logs.map(row=>({...row,knownRepair:true}));
  const data = h.context.clean(baseData());
  assert.equal(data.log[0].knownRepair,true);
  assert.equal(h.context.cleanFixCount(),1);
});
test('import retains unknown rep positions and their real kg/reserve associations across repeated cleaning', () => {
  const item = {exId:'x',measure:'sets',sets:3,setsDone:3,done:true,reps:10,kg:20,
    repsList:[5,null,3],kgList:[20,30,40],rirList:[2,'bad',0]};
  const cleaned = cleanItem(item), twice = cleanItem(cleaned);
  assert.deepEqual(cleaned.repsList,[5,null,3]);
  assert.deepEqual(cleaned.rirList,[2,null,0]);
  assert.deepEqual(twice,cleaned);
  assert.deepEqual(History.recordedRows(cleaned).map(row=>[row.reps,row.kg,row.rir]),[[5,20,2],[null,30,null],[3,40,0]]);
  assert.equal(History.repetitionTotal(cleaned),null);
});

test('bad/short/explicit empty arrays stay unknown while old scalar-only and known zero doses retain meaning', () => {
  const base = {exId:'x',measure:'sets',sets:3,done:true,reps:5,kg:99};
  for (const list of [[20],[],null,'broken']) {
    const cleaned = cleanItem({...base,kgList:list});
    const values = History.recordedRows(cleaned).map(row=>row.kg);
    assert.deepEqual(values,Array.isArray(list)&&list.length?[20,null,null]:[null,null,null]);
  }
  const explicit = cleanItem({...base,repsList:[0,'3',false],kgList:['0','2,5',-1],rirList:[0,undefined,99]});
  assert.deepEqual(History.recordedRows(explicit).map(row=>[row.reps,row.kg,row.rir]),[[0,0,0],[3,2.5,null],[null,null,null]]);
  assert.deepEqual(History.recordedRows(cleanItem(base)).map(row=>[row.reps,row.kg]),[[5,99],[5,99],[5,99]]);
});

test('timed seconds and sides never fall back over explicit gaps or a missing tail', () => {
  const item = cleanItem({exId:'x',measure:'time',sets:3,done:true,sides:true,sec:90,
    secList:[15,null],sideCounts:[1,2],sirList:[0,null]});
  assert.deepEqual(History.recordedRows(item).map(row=>[row.sec,row.sides,row.sir]),[[15,1,0],[null,2,null],[null,null,null]]);
  assert.equal(History.timeTotal(item),null);
  assert.equal(History.performedSets(item),null);
});

test('history AU uses the same exact elapsed-minute rule across the former rounding boundary', () => {
  assert.equal(History.sessionAU({kind:'protocol',secs:749,srpe:7}),87.383333);
  assert.equal(History.sessionAU({kind:'protocol',secs:750,srpe:7}),87.5);
  assert.ok(Math.abs(History.sessionAU({kind:'team',secs:749,srpe:7})-7*749/60)<0.000001);
});
