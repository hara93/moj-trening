'use strict';

// Synthetic data and fresh browser contexts only; no existing profile or backup.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { artifacts, engine, fixture: baseFixture, launch, repo, serve, withOffline } = require('./runtime.cjs');
const source = JSON.parse(fs.readFileSync(path.join(repo, 'tools/build/body-regions.json'), 'utf8'));
const ids = Object.keys(source.regions);
const results = [];
const A = (page, action) => page.locator('[data-a="' + action + '"]');
const byId = (page, action, id) => page.locator('[data-a="' + action + '"][data-id="' + id + '"]');
const samplesFor = (region, view) => region.view === 'both' ? region.samples[view] : region.samples;

function fixture() {
  const data = baseFixture(), base = data.exercises['bench-press'];
  const exercise = (id, name, muscles, zones) => ({
    ...base, id, name: 'Ispit figure · ' + name, order: 500,
    muscles, zones, source: null, sourceTitle: null, media: null, mediaType: null,
    sets: 2, reps: 8, kg: 20, rest: 60, muscleWorkEligible: true
  });
  data.exercises = {
    'body-editor': exercise('body-editor', 'uređivanje', { prime: [], sec: [] }, []),
    'body-primary': exercise('body-primary', 'glavni', { prime: ['front_chest'], sec: ['back_triceps', 'hip_joints'] }, ['Prsa', 'Ruke', 'Kuk']),
    'body-secondary': exercise('body-secondary', 'pomoćni', { prime: ['back_triceps'], sec: ['front_chest'] }, ['Ruke', 'Prsa']),
    'body-legacy-hip': exercise('body-legacy-hip', 'stari Kuk', undefined, ['Kuk']),
    'body-joint': exercise('body-joint', 'samo zglob', { prime: ['hip_joints'], sec: [] }, ['Kuk'])
  };
  data.protocols = { 'body-protocol': {
    id: 'body-protocol', name: 'Ispit figure · trening', tag: 'Teretana', days: [],
    items: [{ exId: 'body-primary', measure: 'sets', sets: 2, reps: 8, kg: 20, rest: 60, sides: false }]
  } };
  data.programs = {}; data.field = {}; data.log = [];
  data.settings.sound = false; data.settings.planDates = {};
  data.settings.matchDates = {}; data.settings.matchDay = -1;
  return data;
}

async function home(page) {
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Bok, Tomislav', exact: true }).waitFor();
}

async function importData(page) {
  await A(page, 'dataSheet').click();
  await page.locator('#importFile').setInputFiles({
    name: 'body-synthetic.json', mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(fixture()))
  });
  await A(page, 'restoreApply').click();
  await A(page, 'restoreApply').waitFor({ state: 'hidden' });
}

async function library(page) {
  await home(page);
  await page.getByRole('button', { name: 'Knjižnica vježbi', exact: true }).click();
  await page.locator('#liblist').waitFor();
}

async function openEditor(page) {
  await library(page);
  await byId(page, 'openEx', 'body-editor').click();
  await byId(page, 'editEx', 'body-editor').click();
  await page.locator('.mpick svg.body-fig').waitFor();
}

async function noOverflow(page, selector, label) {
  const value = await page.locator(selector).evaluate(node => ({
    document: document.documentElement.scrollWidth, viewport: innerWidth,
    scroll: node.scrollWidth, client: node.clientWidth
  }));
  assert.ok(value.document <= value.viewport + 1 && value.scroll <= value.client + 1,
    label + ': ' + JSON.stringify(value));
}

async function screenPoint(page, selector, id, view, sample = 0, pixelAligned = false) {
  const svg = page.locator(selector);
  await svg.scrollIntoViewIfNeeded();
  const p = samplesFor(source.regions[id], view)[sample];
  return svg.evaluate((node, input) => {
    const region = node.querySelector('g[data-view="' + input.view + '"] [data-region="' + input.id + '"]');
    if (!region) throw new Error('Missing rendered region ' + input.view + '/' + input.id);
    const pt = new DOMPoint(input.p.x, input.p.y).matrixTransform(region.getScreenCTM());
    const x = input.pixelAligned ? Math.round(pt.x) : pt.x, y = input.pixelAligned ? Math.round(pt.y) : pt.y;
    const target = document.elementFromPoint(x, y)?.closest('[data-a]');
    return { x, y, hit: target?.dataset.v || target?.dataset.id || target?.dataset.region, action: target?.dataset.a };
  }, { id, view, p, pixelAligned });
}

async function tapRegion(page, selector, id, view) {
  // Touchscreens dispatch whole CSS-pixel coordinates. Prefer a supplied native
  // sample whose rounded screen position still lies in the intended target.
  let point;
  const indices = samplesFor(source.regions[id], view).map((_, i) => i);
  // The lower-back edge sample has <1 CSS px of margin on a 320 px display.
  // Its central lumbar sample exercises the same path without touch snapping.
  if (id === 'back_lower_back') indices.unshift(...indices.splice(1, 1));
  for (const i of indices) {
    point = await screenPoint(page, selector, id, view, i, true);
    if (point.hit === id) break;
  }
  assert.equal(point.hit, id, 'real tap target at ' + view + '/' + id + ': ' + JSON.stringify(point));
  await page.touchscreen.tap(point.x, point.y);
}

async function geometry(page) {
  const value = await page.evaluate(source => {
    const svg = new DOMParser().parseFromString(BODY.svg({ tappable: true, size: 360 }), 'image/svg+xml').documentElement;
    const ctx = document.createElement('canvas').getContext('2d');
    const badSamples = [], overlaps = [], mismatches = [];
    const paths = [...svg.querySelectorAll('.body-rg')];
    for (const view of ['front', 'back']) {
      const regions = Object.entries(source.regions).filter(([, r]) => r.view === view || r.view === 'both');
      const native = regions.map(([id, r]) => ({ id, path: new Path2D(r.view === 'both' ? r.d[view] : r.d) }));
      for (const [id, r] of regions) {
        const actual = svg.querySelector('g[data-view="' + view + '"] [data-region="' + id + '"]');
        const d = r.view === 'both' ? r.d[view] : r.d;
        if (!actual || actual.getAttribute('d') !== d) mismatches.push(view + '/' + id);
        const samples = r.view === 'both' ? r.samples[view] : r.samples;
        for (const p of samples) {
          const hits = native.filter(n => ctx.isPointInPath(n.path, p.x, p.y, 'evenodd')).map(n => n.id);
          if (hits.length !== 1 || hits[0] !== id) badSamples.push({ view, id, p, hits });
        }
      }
      // The SVG uses native artwork coordinates. A 1 px raster grid catches
      // shared interiors independently of browser touch-target expansion.
      grid: for (let y = 0; y < source.geom.H; y++) for (let x = 0; x < source.geom.W; x++) {
        let first;
        for (const region of native) if (ctx.isPointInPath(region.path, x + .5, y + .5, 'evenodd')) {
          if (first) { overlaps.push({ view, x, y, ids: [first, region.id] }); if (overlaps.length >= 8) break grid; }
          first = region.id;
        }
      }
    }
    return { ids: BODY.ids, geom: BODY.geom, count: paths.length, badSamples, overlaps, mismatches,
      images: svg.querySelectorAll('image').length,
      muscles: [...svg.querySelectorAll('.body-muscle')].map(n => ({id:n.dataset.muscle,closed:/Z\s*$/i.test(n.getAttribute('d')),hatched:!!svg.querySelector(n.getAttribute('fill').slice(4,-1))})),
      contours: [...svg.querySelectorAll('.body-ln path')].map(n => n.getAttribute('d')) };
  }, source);
  assert.deepEqual(value.ids, ids);
  assert.deepEqual(value.geom, source.geom);
  assert.equal(value.ids.length, 21);
  assert.equal(value.count, 23);
  assert.deepEqual(value.mismatches, []);
  assert.deepEqual(value.badSamples, []);
  assert.deepEqual(value.overlaps, []);
  assert.equal(value.images,0,'native muscle drawing has no raster image layer');
  assert.deepEqual([...new Set(value.muscles.map(p=>p.id))].sort(),ids.filter(id=>id!=='hip_joints'&&id!=='front_knees').sort());
  assert.ok(value.muscles.every(p=>p.closed&&p.hatched),'every muscle form is closed and filled with a local hatch pattern');
  assert.deepEqual(value.contours,[source.visuals.contours.front,source.visuals.contours.back]);
  results.push({ check: 'canonical-geometry', ids: value.ids.length, paths: value.count,
    samples: Object.values(source.regions).reduce((n, r) => n + (r.view === 'both' ? r.samples.front.length + r.samples.back.length : r.samples.length), 0),
    nativeGrid: '1 px at half-pixel centres, front and back', closedHatchedForms:value.muscles.length });
}

async function filter(page, width) {
  await library(page); await page.locator('#libq').fill('Ispit figure'); await A(page, 'eqSheet').click();
  const figure = '.fsheet svg.filtfig';
  await page.locator(figure).waitFor();
  const hitChecks = [];
  for (const [id, region] of Object.entries(source.regions)) for (const view of region.view === 'both' ? ['front', 'back'] : [region.view]) {
    for (let i = 0; i < samplesFor(region, view).length; i++) {
      const point = await screenPoint(page, figure, id, view, i);
      assert.equal(point.hit, id, 'sample hit ' + width + ' px ' + view + '/' + id + ': ' + JSON.stringify(point));
      assert.equal(point.action, 'musTap'); hitChecks.push(view + '/' + id + '/' + i);
    }
  }
  await tapRegion(page, figure, 'front_chest', 'front');
  assert.equal(await page.locator(figure + ' .body-rg.is-prime').count(), 1);
  assert.equal(await page.locator('.fsheet .zch .afc').count(), 1);
  assert.equal(await page.locator('#fcnt').innerText(), '2');
  await A(page, 'sheetDone').click();
  assert.deepEqual(await A(page, 'openEx').evaluateAll(nodes => nodes.map(n => n.dataset.id).sort()), ['body-primary', 'body-secondary']);
  await A(page, 'filtClear').click(); await A(page, 'eqSheet').click();
  await tapRegion(page, figure, 'hip_joints', 'back');
  assert.equal(await page.locator(figure + ' .body-rg[data-region="hip_joints"].is-prime').count(), 2);
  assert.equal(await page.locator('.fsheet .zch .afc').count(), 1);
  assert.equal(await page.locator('.fsheet .zch .afc').innerText(), source.regions.hip_joints.label_hr);
  await noOverflow(page, '.fsheet', 'filter-' + width);
  await page.screenshot({ path: path.join(artifacts, 'body-' + engine + '-filter-' + width + '.png') });
  await A(page, 'sheetDone').click();
  assert.deepEqual(await A(page, 'openEx').evaluateAll(nodes => nodes.map(n => n.dataset.id).sort()), ['body-joint', 'body-legacy-hip', 'body-primary']);
  await library(page); await page.locator('#libq').fill('Ispit figure'); await A(page, 'eqSheet').click();
  assert.equal(await page.locator(figure + ' .body-rg[data-region="hip_joints"].is-prime').count(), 2);
  assert.equal(await page.locator('.fsheet .zch .afc').count(), 1);
  // The front and back paths share one selection. A tap on either removes it.
  await tapRegion(page, figure, 'hip_joints', 'front');
  assert.equal(await page.locator(figure + ' .body-rg.is-prime').count(), 0);
  assert.equal(await page.locator('.fsheet .zch .afc').count(), 0);
  await A(page, 'sheetDone').click();
  results.push({ check: 'filter', width, sampleHitChecks: hitChecks.length, legacyHipIncluded: true, hipChips: 1, sharedHipPaths: 2 });
}

async function editor(page, width) {
  await openEditor(page);
  const figure = '.mpick svg.pickfig';
  assert.equal(await page.locator(figure + ' .is-prime,' + figure + ' .is-on').count(), 0);
  for (const phase of ['prime', 'sec', 'off']) {
    for (const id of ids) {
      await tapRegion(page, figure, id, source.regions[id].view === 'both' ? 'back' : source.regions[id].view);
      const state = await page.locator(figure + ' .body-rg[data-region="' + id + '"]').evaluateAll(nodes => nodes.map(n => ({ prime: n.classList.contains('is-prime'), sec: n.classList.contains('is-on') })));
      assert.ok(state.every(s => s.prime === (phase === 'prime') && s.sec === (phase === 'sec')),
        'editor tap ' + width + ' px ' + phase + '/' + id + ': ' + JSON.stringify(state));
    }
    assert.equal(await page.locator(figure + ' .body-rg.is-prime').count(), phase === 'prime' ? 23 : 0, phase + ' primary');
    assert.equal(await page.locator(figure + ' .body-rg.is-on').count(), phase === 'sec' ? 23 : 0, phase + ' secondary');
    assert.equal(await page.locator('.mpick .zch .afc').count(), phase === 'off' ? 0 : 21, phase + ' chips');
    assert.equal(await page.locator('.mpick .zch [data-v="hip_joints"]').count(), phase === 'off' ? 0 : 1);
    await noOverflow(page, '.mpick', 'editor-' + width + '-' + phase);
    if (phase === 'prime') await page.screenshot({ path: path.join(artifacts, 'body-' + engine + '-editor-' + width + '.png') });
    await A(page, 'saveEx').click();
    await A(page, 'saveEx').waitFor({ state: 'hidden' });
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('mt.data.v1')).exercises['body-editor']);
    assert.deepEqual((saved.muscles?.prime || []).slice().sort(), phase === 'prime' ? ids.slice().sort() : []);
    assert.deepEqual((saved.muscles?.sec || []).slice().sort(), phase === 'sec' ? ids.slice().sort() : []);
    await openEditor(page);
    assert.equal(await page.locator(figure + ' .body-rg.is-prime').count(), phase === 'prime' ? 23 : 0, 'reloaded ' + phase + ' primary');
    assert.equal(await page.locator(figure + ' .body-rg.is-on').count(), phase === 'sec' ? 23 : 0, 'reloaded ' + phase + ' secondary');
  }
  results.push({ check: 'editor', width, ids: 21, persistedPhases: ['prime', 'secondary', 'off'] });
}

async function instructionAndDashboard(page, width) {
  await home(page); await page.getByRole('button', { name: 'Moj pregled', exact: true }).click();
  await A(page, 'dashboardProtocols').first().click();
  await byId(page, 'openPr', 'body-protocol').click();
  await A(page, 'workoutExercise').first().click();
  await page.locator('.workout-detail-cover [data-a="workoutInfo"]').click();
  await page.locator('.workout-instructions-body').waitFor();
  const figure = '.workout-muscle-figure svg.body-fig';
  const key = await page.locator('.workout-muscle-key').innerText();
  assert.match(key, /Prsa/); assert.match(key, /Triceps/);
  assert.ok(!key.includes(source.regions.hip_joints.label_hr), 'joint excluded from muscle legend');
  for (const [id, view, role] of [
    ['front_chest', 'front', 'Glavni mišić'],
    ['back_triceps', 'back', 'Pomoćni mišić'],
    ['front_quadriceps', 'front', 'Nije označen'],
    ['hip_joints', 'back', 'Zglobno područje']
  ]) {
    await tapRegion(page, figure, id, view);
    const caption = await page.locator('.workout-region-caption').innerText();
    assert.ok(caption.includes(source.regions[id].label_hr), caption); assert.ok(caption.includes(role), caption);
    assert.equal(await page.locator(figure + ' .is-selected').count(), id === 'hip_joints' ? 2 : 1);
  }
  await noOverflow(page, '.workout-instructions-body', 'instructions-' + width);
  await page.screenshot({ path: path.join(artifacts, 'body-' + engine + '-instructions-' + width + '.png') });
  await home(page); await page.getByRole('button', { name: 'Moj pregled', exact: true }).click();
  const dashboard = '.db-body-svg';
  await page.locator(dashboard).waitFor();
  assert.equal(await page.locator(dashboard + ' .db-region-joint[data-region="hip_joints"]').count(), 2);
  const point = await screenPoint(page, dashboard, 'hip_joints', 'back');
  assert.equal(point.action, 'dashboardJoint');
  await page.touchscreen.tap(point.x, point.y);
  const dialog = page.locator('.sheet[data-kind="bodyRegion"]');
  await dialog.waitFor(); assert.match(await dialog.innerText(), /Kukovi/);
  assert.match(await dialog.innerText(), /ne dodaje zasebne bodove/i);
  assert.equal(await dialog.locator('.body-rg[data-region="hip_joints"].is-prime').count(), 2);
  await noOverflow(page, '.sheet[data-kind="bodyRegion"]', 'joint-dialog-' + width);
  await A(page, 'sheetDone').click();
  results.push({ check: 'instruction-roles-and-dashboard-joint', width, roles: ['primary', 'secondary', 'unassigned', 'joint'], sharedHipPaths: 2 });
}

async function coldOfflineArtwork(browser, host) {
  if (!host.server) {
    results.push({ check: 'cold-offline-artwork', skipped: 'Origin-unavailable check requires the isolated loopback server.' });
    return;
  }
  const context = await browser.newContext({ viewport: { width: 375, height: 850 }, isMobile: true, hasTouch: true,
    locale: 'hr-HR', timezoneId: 'Europe/Zagreb', reducedMotion: 'reduce' });
  try {
    const page = await context.newPage();
    await page.goto(host.url, { waitUntil: 'domcontentloaded' });
    await page.getByRole('heading', { name: 'Bok, Tomislav', exact: true }).waitFor();
    await importData(page);
    assert.equal(await page.locator('svg.body-fig').count(), 0, 'artwork has never been opened in this context');
    await page.waitForFunction(() => !!navigator.serviceWorker.controller, {}, { timeout: 30000 });
    const cached = await page.evaluate(async files => Promise.all(files.map(async url => {
      const response = await caches.match(new URL(url, location.href).href);
      return { url, ok: !!response?.ok, bytes: response ? (await response.arrayBuffer()).byteLength : 0 };
    })), ['body.js']);
    for (const image of cached) { assert.equal(image.ok, true, 'cold precache ' + image.url); assert.ok(image.bytes > 1000, image.url); }
    await withOffline(context, host.server, async () => {
      await page.getByRole('button', { name: 'Knjižnica vježbi', exact: true }).click();
      await A(page, 'eqSheet').click();
      await page.locator('.fsheet svg.filtfig').waitFor();
      const native = await page.locator('.fsheet svg.filtfig').evaluate(svg => ({views:svg.querySelectorAll('.body-muscle-art').length,muscles:svg.querySelectorAll('.body-muscle').length,images:svg.querySelectorAll('image').length}));
      assert.equal(native.views,2);assert.ok(native.muscles>=38);assert.equal(native.images,0);
      await page.locator('.fsheet svg.filtfig').scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(artifacts, 'body-' + engine + '-cold-offline.png') });
      results.push({ check: 'cold-offline-artwork', cached, native });
    });
  } finally { await context.close(); }
}

(async () => {
  const host = await serve(), browser = await launch();
  try {
    await coldOfflineArtwork(browser, host);
    for (const width of [375, 320]) {
      const context = await browser.newContext({ viewport: { width, height: 850 }, isMobile: true, hasTouch: true,
        deviceScaleFactor: 1, locale: 'hr-HR', timezoneId: 'Europe/Zagreb', reducedMotion: 'reduce', serviceWorkers: 'block' });
      const page = await context.newPage(), errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.clock.setFixedTime(new Date('2026-11-06T10:00:00+01:00'));
      await page.goto(host.url, { waitUntil: 'domcontentloaded' });
      await page.getByRole('heading', { name: 'Bok, Tomislav', exact: true }).waitFor();
      await importData(page);
      await filter(page, width); await editor(page, width); await instructionAndDashboard(page, width);
      if (width === 375) await geometry(page);
      assert.deepEqual(errors, [], 'page errors at ' + width + ' px');
      await context.close();
    }
    fs.writeFileSync(path.join(artifacts, 'body-' + engine + '-report.json'), JSON.stringify({ engine, results }, null, 2));
    process.stdout.write(JSON.stringify({ engine, passed: true, checks: results, artifacts }) + '\n');
  } finally { await browser.close(); await host.close(); }
})().catch(error => { process.stderr.write(error.stack + '\n'); process.exitCode = 1; });
