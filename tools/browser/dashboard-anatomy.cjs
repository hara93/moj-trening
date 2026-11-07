'use strict';

// Isolated fixtures only: no user profile, imported personal backup or real history.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const MuscleWork = require('../../muscle-work.js');
const { artifacts, engine, fixture: baseFixture, launch, repo, serve } = require('./runtime.cjs');
const source = JSON.parse(fs.readFileSync(path.join(repo, 'tools/build/body-regions.json'), 'utf8'));
const groups = MuscleWork.groups;
assert.ok(groups.some(group=>group.id==='neck'&&group.regions.includes('neck')),'neck has a muscle-work group');
const shins = groups.find(group => group.id === 'shins');
assert.deepEqual(shins?.regions, ['front_shins'], 'the front shin has its own muscle-work group');
const now = new Date('2026-11-06T12:00:00+01:00');
const A = (page, name) => page.locator('[data-a="' + name + '"]');
const body = '.db-body-svg';
const results = [];

function fixture() {
  const data = baseFixture();
  for (const protocol of Object.values(data.protocols)) protocol.days = [];
  for (const field of Object.values(data.field)) field.days = [];
  data.programs = {};
  data.settings.sound = false; data.settings.planDates = {}; data.settings.matchDates = {};
  data.settings.matchDay = -1; data.settings.morningChecks = {};
  const exercise = (id, muscles) => ({ ...data.exercises['bench-press'], id, name: 'Ispit figure · ' + id,
    zones: [], muscles, muscleWorkEligible: true, source: null, sourceTitle: null, media: null, mediaType: null });
  const recorded = exercise('anatomy-recorded', { prime: ['front_chest'], sec: ['back_triceps'] });
  const future = exercise('anatomy-future', { prime: ['back_calves'], sec: [] });
  data.exercises[recorded.id] = recorded; data.exercises[future.id] = future;
  const item = { exId: recorded.id, measure: 'sets', sets: 2, setsDone: 2, reps: 8, kg: 20, rest: 60, sides: false,
    done: true, repsList: [8, 8], kgList: [20, 20], rirList: [2, 2] };
  data.protocols['anatomy-recorded'] = { id: 'anatomy-recorded', name: 'Ispit figure · odrađeno', days: [], items: [item] };
  data.protocols['anatomy-future'] = { id: 'anatomy-future', name: 'Ispit figure · preostali plan', days: [6],
    items: [{ exId: future.id, measure: 'sets', sets: 3, reps: 10, kg: 20, rest: 60, sides: false }] };
  data.log = [{ historyId: 'anatomy-record', kind: 'protocol', refId: 'anatomy-recorded', name: 'Ispit figure · odrađeno',
    at: Date.parse('2026-11-05T10:00:00+01:00'), secs: 600, items: [item],
    muscleWork: [MuscleWork.pack(MuscleWork.completedItem(recorded, item))] }];
  const neckPrimary=exercise('anatomy-neck-primary',{prime:['neck'],sec:[]});
  const neckSecondary=exercise('anatomy-neck-secondary',{prime:['front_biceps'],sec:['neck']});
  data.exercises[neckPrimary.id]=neckPrimary;data.exercises[neckSecondary.id]=neckSecondary;
  const primaryItem={...item,exId:neckPrimary.id},secondaryItem={...item,exId:neckSecondary.id,sets:1,setsDone:1,repsList:[8],kgList:[20],rirList:[2]};
  data.protocols['anatomy-neck']={id:'anatomy-neck',name:'Zabilježeni rad vrata',days:[],items:[primaryItem,secondaryItem]};
  data.log.push({historyId:'anatomy-neck-record',kind:'protocol',refId:'anatomy-neck',name:'Zabilježeni rad vrata',
    at:Date.parse('2026-11-04T10:00:00+01:00'),secs:300,items:[primaryItem,secondaryItem],
    muscleWork:[MuscleWork.pack(MuscleWork.completedItem(neckPrimary,primaryItem)),MuscleWork.pack(MuscleWork.completedItem(neckSecondary,secondaryItem))]});
  const shinExercise = exercise('anatomy-shins', {prime: ['front_shins'], sec: []});
  const shinItem = {...item, exId: shinExercise.id};
  data.exercises[shinExercise.id] = shinExercise;
  data.log.push({historyId: 'anatomy-shin-record', kind: 'protocol', refId: 'anatomy-shins', name: 'Zabilježeni rad potkoljenice',
    at: Date.parse('2026-11-03T10:00:00+01:00'), secs: 300, items: [shinItem],
    muscleWork: [MuscleWork.pack(MuscleWork.completedItem(shinExercise, shinItem))]});

  return data;
}

async function home(page) {
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Bok, Tomislav', exact: true }).waitFor();
}

async function importData(page) {
  await A(page, 'dataSheet').click();
  await page.locator('#importFile').setInputFiles({ name: 'dashboard-anatomy-synthetic.json', mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(fixture())) });
  await A(page, 'restoreApply').click(); await A(page, 'restoreApply').waitFor({ state: 'hidden' });
}

async function dashboard(page) {
  await home(page); await page.getByRole('button', { name: 'Moj pregled', exact: true }).click();
  await page.locator('.db-home').waitFor();
  assert.equal(await page.locator('.tabbar .tab').count(),4,'four main navigation destinations');
  assert.equal(await page.locator('.db-home .db-muscle,.db-home .db-activity,.db-home .db-quality,.db-home .db-schedule').count(),0,'daily dashboard keeps detailed analytics out of its initial view');
  await A(page,'dashboardAnalytics').click();
  await page.locator('.db-analytics').waitFor();
  await page.locator(body).waitFor();
}

async function geometry(page, selector) {
  return page.locator(selector).evaluate(svg => {
    const shapes = {};
    svg.querySelectorAll('.body-muscle').forEach(node => {
      const key = node.closest('g[data-view]').dataset.view + '/' + node.dataset.muscle;
      (shapes[key] ||= []).push(node.getAttribute('d'));
    });
    Object.values(shapes).forEach(parts => parts.sort());
    return shapes;
  });
}

async function visibleState(page, region) {
  return page.locator(body).evaluate((svg, region) => {
    const style = node => {
      const css = getComputedStyle(node);
      return { fill: css.fill, opacity: Number(css.fillOpacity), stroke: css.stroke,
        strokeOpacity: Number(css.strokeOpacity), strokeWidth: parseFloat(css.strokeWidth),
        outline: css.outlineStyle, outlineWidth: parseFloat(css.outlineWidth) };
    };
    const fills = [...svg.querySelectorAll('.body-muscle-fill[data-muscle="' + region + '"]')];
    return { fills: fills.map(style), edges: [...svg.querySelectorAll('.body-muscle[data-muscle="' + region + '"]')].map(style),
      proxies: [...svg.querySelectorAll('.db-region[data-region="' + region + '"]')].map(style) };
  }, region);
}

function rgb(color) { return (color.match(/[\d.]+/g) || []).map(Number); }
function visibleColor(color) {
  if (!color || color === 'none' || color === 'transparent') return false;
  const channels = rgb(color);
  return channels.length < 4 || channels[3] > 0;
}
function blue(color) {
  const [r, g, b] = rgb(color);
  return b > r + 20 && b > g + 12;
}

async function tapGroup(page, group) {
  await page.locator(body).scrollIntoViewIfNeeded();
  const region = group.regions[0], def = source.regions[region];
  const view = def.view === 'both' ? 'back' : def.view;
  const samples = def.view === 'both' ? def.samples[view] : def.samples;
  // Use the central lumbar samples, away from the boundary with gluteus medius.
  const tapSamples = group.id === 'lowerBack' ? [samples[1], samples[3]] : samples;
  const point = await page.locator(body).evaluate((svg, input) => {
    const region = svg.querySelector('g[data-view="' + input.view + '"] .db-region[data-region="' + input.region + '"]');
    const hits = (x, y) => {
      const node = document.elementFromPoint(x, y)?.closest('[data-a]');
      return node?.dataset.a === 'dashboardGroup' && node.dataset.id === input.group;
    };
    const candidates = input.samples.map(sample => {
      const p = new DOMPoint(sample.x, sample.y).matrixTransform(region.getScreenCTM());
      const x = Math.round(p.x), y = Math.round(p.y);
      let margin = 0;
      // Prefer a broad interior over a narrow neck/trapezius boundary: mobile
      // Chromium adjusts touch coordinates within a small contact radius.
      for (let dx=-5;dx<=5;dx++) for (let dy=-5;dy<=5;dy++) if (hits(x + dx, y + dy)) margin++;
      return { x, y, margin, centre: hits(x, y) };
    }).filter(p => p.centre).sort((a, b) => b.margin - a.margin);
    return candidates[0];
  }, { group: group.id, region, view, samples: tapSamples });
  assert.ok(point, 'a real screen-pixel tap target exists for ' + group.id);
  await page.evaluate(()=>{
    window.__anatomyTapEvents=[];
    if(window.__anatomyTapBound)return;window.__anatomyTapBound=true;
    for(const type of ['pointerdown','pointerup','pointercancel','touchstart','touchend','click'])document.addEventListener(type,event=>{
      const target=event.target.closest?.('[data-a]');
      window.__anatomyTapEvents.push({type,action:target?.dataset.a,id:target?.dataset.id,region:target?.dataset.region,
        x:event.clientX,y:event.clientY,at:performance.now(),selected:document.getElementById('db-group-title')?.textContent});
    },true);
  });
  await page.touchscreen.tap(point.x, point.y);
  // Wait for this single native action to finish rendering; never tap again
  // or force a click when a target is too close to an anatomical boundary.
  await page.waitForFunction(label=>document.getElementById('db-group-title')?.textContent===label,group.label,{timeout:1500}).catch(()=>{});
  const title=await page.locator('#db-group-title').innerText();
  if(title!==group.label){
    const target=await page.evaluate(({x,y})=>{const node=document.elementFromPoint(x,y)?.closest('[data-a]');return {action:node?.dataset.a,id:node?.dataset.id,region:node?.dataset.region,tag:node?.tagName};},point);
    await page.screenshot({path:path.join(artifacts,'dashboard-anatomy-'+engine+'-tap-failure-'+group.id+'.png')});
    fs.writeFileSync(path.join(artifacts,'dashboard-anatomy-'+engine+'-tap-failure-'+group.id+'.json'),JSON.stringify({point,target,title,group,events:await page.evaluate(()=>window.__anatomyTapEvents)},null,2));
  }
  assert.equal(title, group.label, 'tap selected ' + group.id);
}

async function keyboardGroup(page, group) {
  const target = page.locator(body + ' .db-region[data-a="dashboardGroup"][data-id="' + group.id + '"]').first();
  await target.focus(); await page.keyboard.press('Enter');
  assert.equal(await page.locator('#db-group-title').innerText(), group.label, 'keyboard selected ' + group.id);
}

async function selectedParts(page, group) {
  const state = await visibleState(page, group.regions[0]);
  assert.ok(state.fills.length > 0, group.id + ' has visible muscle forms');
  const recorded = ['chest', 'triceps', 'neck', 'biceps', 'shins'].includes(group.id);
  if (!recorded) assert.ok(state.fills.every(s => blue(s.fill) && s.opacity > .16),
    group.id + ' selects actual closed parts in blue: ' + JSON.stringify(state.fills));
  assert.ok(state.fills.every(s => visibleColor(s.stroke) && s.strokeOpacity > 0 && s.strokeWidth >= 1.4 &&
    (blue(s.stroke) || s.stroke === 'rgb(255, 255, 255)')),
    group.id + ' outlines each selected closed part, including keyboard focus: ' + JSON.stringify(state.fills));
  for (const proxy of state.proxies) {
    assert.ok(!visibleColor(proxy.stroke) || proxy.strokeOpacity === 0 || proxy.strokeWidth === 0,
      group.id + ' invisible interaction proxy must not outline a combined envelope: ' + JSON.stringify(proxy));
    assert.ok(proxy.outline === 'none' || proxy.outlineWidth === 0,
      group.id + ' invisible interaction proxy must not draw a focus rectangle');
  }
  assert.equal(await page.locator(body + ' .db-region[data-id="' + group.id + '"][aria-pressed="true"]').count(), state.proxies.length);
}

async function absGutters(page) {
  const result = await page.locator(body).evaluate(svg => {
    const paths = [...svg.querySelectorAll('.body-muscle-fill[data-muscle="front_abs"]')];
    const ctx = document.createElement('canvas').getContext('2d');
    const shapes = paths.map(p => new Path2D(p.getAttribute('d')));
    // These are body-space points in the centre seam and between closed rows.
    const gaps = [[443.5, 530], [443.5, 610], [443.5, 680], [443.5, 770], [410, 565], [410, 645], [410, 712]];
    return { count: paths.length, closed: paths.every(p => /Z\s*$/i.test(p.getAttribute('d'))),
      paintedGaps: gaps.filter(([x, y]) => shapes.some(p => ctx.isPointInPath(p, x, y, 'evenodd'))) };
  });
  assert.equal(result.count, 8, 'abdominals keep eight independently painted closed forms');
  assert.equal(result.closed, true); assert.deepEqual(result.paintedGaps, [], 'selection preserves abdomen gutters');
}

async function noOverflow(page, width) {
  const size = await page.locator('.dashboard').evaluate(node => ({ viewport: innerWidth, document: document.documentElement.scrollWidth,
    content: node.scrollWidth, view: node.clientWidth }));
  assert.ok(size.document <= size.viewport + 1 && size.content <= size.view + 1, width + ' px: ' + JSON.stringify(size));
}

async function compactWeekFigure(page) {
  const layout = await page.locator('.db-anatomy-row').evaluate(row => {
    const figure = row.querySelector('.db-body-svg').getBoundingClientRect();
    const coverage = row.querySelector('.db-coverage').getBoundingClientRect();
    return {figureWidth: figure.width, figureRight: figure.right, figureBottom: figure.bottom,
      coverageLeft: coverage.left, coverageTop: coverage.top};
  });
  assert.ok(layout.coverageLeft > layout.figureRight && layout.coverageTop < layout.figureBottom,
    'coverage sits beside the weekly figure');
  return layout.figureWidth;
}

async function colorStates(page, width) {
  const select = id => keyboardGroup(page, groups.find(g => g.id === id));
  const paint = state => state.map(({ fill, opacity }) => ({ fill, opacity }));
  const abs = groups.find(g => g.id === 'abs');
  await tapGroup(page, abs); await selectedParts(page, abs); await absGutters(page);
  assert.equal(await page.locator('.db-detail-total strong').innerText(), '0', 'blue selection is not recorded work');
  assert.deepEqual(await page.locator('.db-counts dd').allInnerTexts(), ['0', '0', '0']);
  const meter = page.locator('.db-detail-meter .muscle-meter');
  assert.equal(await meter.locator('i').count(),0,'without records the meter has no fill');
  assert.match(await page.locator('.db-legend').innerText(), /Odabrano/);
  await page.locator('.db-anatomy').scrollIntoViewIfNeeded();
  await page.locator('.db-muscle').screenshot({ path: path.join(artifacts, 'dashboard-anatomy-' + engine + '-abs-' + width + '.png') });
  await select('abs'); await selectedParts(page, abs);
  await page.locator('.db-anatomy').scrollIntoViewIfNeeded();
  await page.locator('.db-muscle').screenshot({ path: path.join(artifacts, 'dashboard-anatomy-' + engine + '-abs-keyboard-' + width + '.png') });
  await select('neck');
  assert.equal(await page.locator(body+' .db-region[data-id="neck"][aria-pressed="true"]').count(),2,'both neck views share one selected muscle group');
  assert.equal(await page.locator('.db-detail-total strong').innerText(),'2,5','neck shows only its actual two direct and one secondary sets');
  assert.deepEqual(await page.locator('.db-counts dd').allInnerTexts(),['2','1','1']);
  assert.deepEqual(await meter.locator('i').evaluateAll(nodes=>nodes.map(node=>node.className)),
    ['muscle-meter-direct','muscle-meter-secondary']);
  assert.equal(await meter.evaluate(node=>parseFloat(node.lastElementChild.style.width)/parseFloat(node.firstElementChild.style.width)),.25,
    'one secondary set contributes half a set beside two direct sets');
  assert.ok((await visibleState(page,'neck')).fills.every(s=>s.fill==='rgb(104, 208, 188)'&&s.opacity>.5),'recorded neck work paints both front/back forms green');
  await page.locator('.db-anatomy').scrollIntoViewIfNeeded();
  await page.locator('.db-muscle').screenshot({path:path.join(artifacts,'dashboard-anatomy-'+engine+'-neck-'+width+'.png')});
  const chestBefore = (await visibleState(page, 'front_chest')).fills;
  const tricepsBefore = (await visibleState(page, 'back_triceps')).fills;
  assert.ok(chestBefore.every(s => s.fill === 'rgb(104, 208, 188)' && s.opacity > .5), 'direct work remains green');
  assert.ok(tricepsBefore.every(s => s.fill === 'rgb(137, 179, 252)' && s.opacity > .5), 'indirect work remains blue');
  await select('chest'); assert.deepEqual(paint((await visibleState(page, 'front_chest')).fills), paint(chestBefore), 'selection preserves recorded green');
  await select('triceps'); assert.deepEqual(paint((await visibleState(page, 'back_triceps')).fills), paint(tricepsBefore), 'selection preserves indirect blue');
  const toggle = page.getByRole('switch', { name: 'Uključi preostali plan', exact: false });
  if (await toggle.getAttribute('aria-checked') !== 'true') await toggle.click();
  const plannedBefore = (await visibleState(page, 'back_calves')).fills;
  assert.ok(plannedBefore.every(s => /url\(/.test(s.fill) && s.opacity > .5), 'planned-only work retains purple pattern');
  const purple = await page.locator(body + ' #db-forecast-fill rect').getAttribute('fill');
  assert.equal(purple, '#514169');
  await select('calves');
  assert.deepEqual(paint((await visibleState(page, 'back_calves')).fills), paint(plannedBefore), 'selection preserves forecast purple');
  assert.equal(await page.locator('.db-detail-total strong').innerText(), '0', 'forecast is not performed work');
  assert.deepEqual(await meter.locator('i').evaluateAll(nodes=>nodes.map(node=>node.className)),['muscle-meter-plan']);
  await page.locator('.db-anatomy').scrollIntoViewIfNeeded();
  await page.locator('.db-muscle').screenshot({ path: path.join(artifacts, 'dashboard-anatomy-' + engine + '-forecast-' + width + '.png') });
  await toggle.click();
}

async function shinAndAnkle(page, width) {
  const frontRegion = id => page.locator(body + ' g[data-view="front"] .db-region[data-region="' + id + '"]');
  const title = page.locator('#db-group-title');
  const total = page.locator('.db-detail-total strong');
  const shinRegion = frontRegion('front_shins');
  const calfGroup = groups.find(group => group.id === 'calves');
  const ankles = source.regions.front_shins_ankles;

  async function tapFrontSample(regionId, sample, action, id) {
    await page.locator(body).scrollIntoViewIfNeeded();
    const point = await frontRegion(regionId).evaluate((node, sample) => {
      const p = new DOMPoint(sample.x, sample.y).matrixTransform(node.getScreenCTM());
      const x = Math.round(p.x), y = Math.round(p.y);
      const target = document.elementFromPoint(x, y)?.closest('[data-a]');
      return {x, y, region: target?.dataset.region, action: target?.dataset.a, id: target?.dataset.id};
    }, sample);
    assert.equal(point.region, regionId, 'the front lower-leg sample hits its own region');
    assert.equal(point.action, action);
    assert.equal(point.id, id);
    await page.touchscreen.tap(point.x, point.y);
  }

  async function expectShins() {
    await page.getByRole('heading', {name: shins.label, exact: true}).waitFor();
    assert.equal(await title.innerText(), shins.label);
    assert.equal(await page.locator('.sheet').count(), 0, 'front shin muscles open the regular group detail');
    assert.equal(await shinRegion.getAttribute('aria-pressed'), 'true');
    assert.equal(await total.innerText(), '2');
    assert.deepEqual(await page.locator('.db-counts dd').allInnerTexts(), ['2', '0', '1']);
  }

  for (const sample of source.regions.front_shins.samples) {
    await keyboardGroup(page, calfGroup);
    assert.equal(await total.innerText(), '0', 'rear calves have no recorded credit from the front shin session');
    await tapFrontSample('front_shins', sample, 'dashboardGroup', 'shins');
    await expectShins();
  }
  await keyboardGroup(page, calfGroup);
  await keyboardGroup(page, shins);
  await expectShins();
  await page.locator('.db-group-detail').screenshot({path: path.join(artifacts, 'dashboard-anatomy-' + engine + '-shins-' + width + '.png')});

  assert.equal(await frontRegion('front_shins_ankles').getAttribute('aria-haspopup'), 'dialog');
  for (const sample of ankles.samples) {
    await tapFrontSample('front_shins_ankles', sample, 'dashboardJoint', 'front_shins_ankles');
    const dialog = page.locator('.sheet[data-kind="bodyRegion"]');
    await dialog.getByRole('heading', {name: ankles.label_hr, exact: true}).waitFor();
    assert.match(await dialog.innerText(), /ne dodaje zasebne bodove/i);
    const highlighted = dialog.locator('.is-prime[data-region="front_shins_ankles"]');
    assert.ok(await highlighted.evaluate(node => Number(getComputedStyle(node).fillOpacity)) > .5, 'the ankle is visibly marked in its joint detail');
    assert.equal(await dialog.locator('.is-prime[data-region="front_shins"]').count(), 0);
    await dialog.locator('[data-a="sheetDone"]').click();
    await expectShins();
  }
}

(async () => {
  const host = await serve(), browser = await launch();
  try {
    for (const width of [375, 320]) {
      const context = await browser.newContext({ viewport: { width, height: 850 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1,
        serviceWorkers: 'block', reducedMotion: 'reduce', locale: 'hr-HR', timezoneId: 'Europe/Zagreb' });
      const page = await context.newPage(), errors = [];
      page.on('pageerror', error => errors.push(error.message)); await page.clock.setFixedTime(now);
      await page.goto(host.url, { waitUntil: 'domcontentloaded' });
      await page.getByRole('heading', { name: 'Bok, Tomislav', exact: true }).waitFor(); await importData(page);
      await dashboard(page);
      const weekFigureWidth = await compactWeekFigure(page);
      const dashboardGeometry = await geometry(page, body);
      const before = await page.evaluate(() => localStorage.getItem('mt.data.v1'));
      for (const group of groups) {
        await tapGroup(page, group); await selectedParts(page, group);
        await keyboardGroup(page, group); await selectedParts(page, group);
      }
      await colorStates(page, width);
      await shinAndAnkle(page, width);
      await noOverflow(page, width);
      assert.equal(await page.evaluate(() => localStorage.getItem('mt.data.v1')), before, 'selection/forecast cannot modify recorded data');
      await home(page); await page.getByRole('button', { name: 'Knjižnica vježbi', exact: true }).click();
      await A(page, 'eqSheet').click(); await page.locator('.filtfig').waitFor();
      const libraryFigure = await page.locator('.filtfig').boundingBox();
      assert.ok(libraryFigure.width > width && libraryFigure.width > weekFigureWidth,
        'the library figure scales the anatomy into the available width');
      assert.deepEqual(await geometry(page, '.filtfig'), dashboardGeometry, 'dashboard and library use identical visible muscle forms');
      assert.deepEqual(errors, []);
      results.push({ width, touchGroups: groups.length, keyboardGroups: groups.length, absParts: 8,
        geometryMatchesLibrary: true, emptySelectionIsNotWork: true, directGreenIndirectBlueForecastPurplePreserved: true,neckRecordedDirect:2,neckRecordedSecondary:1,neckEquivalent:2.5,
        frontShinsTouchAndKeyboard: true, frontShinsRecordedDirect: 2, rearCalvesCreditSeparate: true, ankleJointDialog: true, compactWeekFigure: true, largerLibraryFigure: true });
      await context.close();
    }
    const report = { engine, passed: true, results, artifacts };
    fs.writeFileSync(path.join(artifacts, 'dashboard-anatomy-' + engine + '-report.json'), JSON.stringify(report, null, 2));
    process.stdout.write(JSON.stringify(report) + '\n');
  } finally { await browser.close(); await host.close(); }
})().catch(error => { process.stderr.write(error.stack + '\n'); process.exitCode = 1; });
