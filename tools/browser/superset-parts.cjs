'use strict';
// 1.23.0: the shipped Trening A in three parts (Priprema, Glavni dio, Završni dio) with its supersets marked as one
// block (variant A). The protocol page shows the parts and the groups; the player shows one overview before each part
// (Priprema at the start, then Glavni dio, then Završni dio) and one before a superset that does not open a part (the
// group overview: name, one grey line, A1/A2 rows, the clock and "+ Dodaj vrijeme za pripremu"); inside a group the
// work screen has one plain "next" line; a jump into a group from outside lands on its overview, a jump into a part's
// first exercise lands on its first set as in 1.22.1. A workout without parts that starts with a group (TRX krug) shows
// the group overview at the start. The editor offers Priprema / Glavni dio / Završni dio on a new protocol and keeps a
// name already in use. The overview keeps the clock and the prep button on screen at 375 × 812 (34 px safe area) and
// 375 × 667, and no screen overflows at 375. Synthetic data only (the shipped protocols).
const assert = require('node:assert/strict');
const path = require('node:path');
const { artifacts, engine, fixture: baseFixture, launch, serve, openJournal, openQuit, openCinemaControls } = require('./runtime.cjs');
const A = (p, action) => p.locator('[data-a="' + action + '"]');
const player = p => p.evaluate(() => JSON.parse(localStorage.getItem('mt.play')));
const store = p => p.evaluate(() => JSON.parse(localStorage.getItem('mt.data.v1')));
const step = state => state.liveSchedule[state.i];
const isWork = st => !!st && (st.kind === 'work' || st.kind === 'manual');
const nextWork = state => state.liveSchedule.slice(state.i + 1).find(isWork);
const stage = p => p.locator('.workout-cinema');
const pauseLayer = p => p.locator('.workout-cinema .cinema-pause-layer');
const shot = (p, name) => p.screenshot({ path: path.join(artifacts, 'superset-parts-' + engine + '-' + name + '.png') });
const OWN = 'superset-parts-own';
const NAMES = { bugarski: 'Bulgarian split squat', nordic: 'Nordic hamstring curl', hip: 'Hip thrust', cph: 'Copenhagen plank – kratka poluga' };

function fixture() {
  const data = baseFixture();
  data.log = []; data.programs = {}; data.field = {};
  Object.assign(data.settings, { sound: false, planDates: {}, matchDates: {}, matchDay: -1, morningChecks: {} });
  const shipped = data.protocols;
  data.protocols = { 'snaga-a': shipped['snaga-a'], 'trx-krug': shipped['trx-krug'], prevencija: shipped.prevencija,
    // a part name of his own that is not one of the three: the editor still offers it
    [OWN]: { id: OWN, name: 'Moj dio', tag: 'Teretana', days: [], items: [
      { exId: 'bench-press', measure: 'sets', sets: 2, reps: 8, kg: 40, rest: 60, sides: false, section: 'Snaga' }] } };
  // a starting weight on the loaded lifts, so the start goes straight to the player
  for (const id of ['snaga-a', 'prevencija']) data.protocols[id].items.forEach(item => { if (['deadlift', 'bugarski', 'hip-thrust', 'jednonozni-rdl', 'single-leg-calf-raise'].includes(item.exId)) item.kg = 20; });
  return data;
}
async function importData(p) {
  await p.evaluate(() => localStorage.removeItem('mt.play'));
  await p.reload({ waitUntil: 'domcontentloaded' });
  await A(p, 'dataSheet').click();
  await p.locator('#importFile').setInputFiles({ name: 'superset-parts.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(fixture())) });
  await A(p, 'restoreApply').click(); await A(p, 'restoreApply').waitFor({ state: 'hidden' });
}
async function protocols(p) {
  await p.getByRole('button', { name: 'Moj pregled', exact: true }).click();
  await A(p, 'dashboardProtocols').click();
}
async function openProtocol(p, id) {
  await protocols(p);
  await p.locator('[data-a="openPr"][data-id="' + id + '"]').click();
  await p.locator('.workout-overview').waitFor();
}
async function start(p, id) {
  await importData(p); await openProtocol(p, id);
  await A(p, 'startPr').click(); await stage(p).waitFor();
}
async function quit(p) { await openQuit(p); await A(p, 'quitDiscard').click(); await stage(p).waitFor({ state: 'detached' }); }
async function advance(p, seconds) {
  await p.clock.setFixedTime(new Date(await p.evaluate(() => Date.now()) + seconds * 1000));
  await p.waitForTimeout(300);
}
async function markDone(p) { await p.locator('.workout-cinema .cinema-work-mark[data-a="workoutSetDone"]').click(); await p.waitForTimeout(120); }
// runs the session until the predicate holds: rep sets are marked done, timed steps run out
async function until(p, predicate, label, visit) {
  for (let guard = 0; guard < 220; guard++) {
    const state = await player(p);
    if (predicate(state, step(state))) return state;
    if (visit) await visit(state, step(state));
    if (state.done) break;
    if (step(state).kind === 'manual') await markDone(p);
    else await advance(p, (state.left || 1) + 0.1);
  }
  assert.fail(label + ' never came');
}
async function noOverflow(p, label) {
  const d = await p.evaluate(() => {
    const sheet = document.querySelector('.sheet');
    return { viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth, sheet: sheet ? [sheet.scrollWidth, sheet.clientWidth] : null };
  });
  assert.ok(d.document <= d.viewport && d.body <= d.viewport && (!d.sheet || d.sheet[0] <= d.sheet[1] + 1), 'no horizontal overflow · ' + label + ': ' + JSON.stringify(d));
}
// the overview on screen: its title, rows and controls, and where they sit (the list scrolls; the clock and the prep
// button stay on screen)
async function overview(p) {
  await stage(p).and(p.locator('[data-phase="section"]')).waitFor();
  return p.evaluate(() => {
    const q = s => document.querySelector('.workout-cinema ' + s), r = n => n && n.getBoundingClientRect();
    const list = q('.cinema-section-items'), clock = q('.cinema-section-clock #ring') || q('.cinema-section-clock'), prep = q('.cinema-section-prep');
    const rows = [...document.querySelectorAll('.workout-cinema .cinema-section-items li:not(.ss-head)')];
    const lb = r(list);
    return {
      title: q('#cinema-section-title')?.textContent, group: !!q('.cinema-group'), aria: q('.cinema-section')?.getAttribute('aria-label') || null,
      meta: q('.cinema-group-meta')?.textContent || null, heads: [...document.querySelectorAll('.workout-cinema .cinema-section-items li.ss-head')].map(n => n.innerText),
      rows: rows.map(n => ({ label: n.querySelector('strong > b')?.textContent, name: n.querySelector('strong')?.innerText, dose: n.querySelector('small')?.textContent, current: n.classList.contains('is-current') })),
      skip: (() => { const b = q('.cinema-section header [data-a="cinemaSkip"]'); return b ? { j: b.dataset.j, aria: b.getAttribute('aria-label') } : null; })(),
      veil: (() => {   // the darkest and lightest the overlay gets behind the rows (alpha 0–1), from its gradient stops
        const media = q('.workout-cinema-media'); if (!media) return null;
        const css = getComputedStyle(media, '::after'), m = r(media), h = parseFloat(css.height) || m.width * 4 / 3;
        const stops = [...css.backgroundImage.matchAll(/rgba?\(([^)]*)\)\s+(-?[\d.]+)%/g)].map(x => { const c = x[1].split(/[\s,/]+/).filter(Boolean); return [parseFloat(x[2]) / 100, c.length > 3 ? parseFloat(c[3]) : 1]; });
        if (stops.length < 2) return { stops: stops.length, css: css.backgroundImage.slice(0, 120) };
        const at = f => { for (let k = 1; k < stops.length; k++) if (f <= stops[k][0]) { const [f0, a0] = stops[k - 1], [f1, a1] = stops[k]; return f1 > f0 ? a0 + (a1 - a0) * (f - f0) / (f1 - f0) : a1; } return stops[stops.length - 1][1]; };
        const from = (lb.top - m.top) / h, to = Math.min(1, (Math.min(lb.bottom, lb.top + list.scrollHeight) - m.top) / h);
        let min = 1; for (let k = 0; k <= 40; k++) min = Math.min(min, at(from + (to - from) * k / 40));
        return { stops: stops.length, min: Math.round(min * 100) / 100, band: [Math.round(from * 100), Math.round(to * 100)] };
      })(),
      heading: !!q('.workout-cinema-heading'),
      fit: { viewport: innerHeight, listTop: Math.round(lb.top), listBottom: Math.round(lb.bottom), scrolls: list.scrollHeight > list.clientHeight + 1,
        overflowY: getComputedStyle(list).overflowY, rowsFully: rows.filter(n => r(n).bottom <= lb.bottom + .5).length, rowsTotal: rows.length,
        clockBottom: Math.round(r(clock).bottom), prepTop: Math.round(r(prep).top), prepBottom: Math.round(r(prep).bottom), prepText: prep.textContent.trim() }
    };
  });
}
function onScreen(o, label) {
  assert.ok(o.fit.clockBottom <= o.fit.viewport && o.fit.prepBottom <= o.fit.viewport, label + ': the clock and the prep button stay on screen ' + JSON.stringify(o.fit));
  assert.equal(o.fit.prepText, 'Dodaj vrijeme za pripremu');
  assert.ok(o.fit.rowsFully === o.fit.rowsTotal || o.fit.scrolls && o.fit.overflowY === 'auto', label + ': every row fits, or the list scrolls ' + JSON.stringify(o.fit));
}
const work = async p => {
  await stage(p).and(p.locator('[data-phase="work"]')).waitFor();
  return p.evaluate(() => {
    const q = s => document.querySelector('.workout-cinema ' + s);
    return { ex: document.querySelector('.workout-cinema')?.dataset.exId ?? null,
      head: q('.workout-cinema-heading p > span[aria-hidden="true"]')?.textContent ?? q('.workout-cinema-heading p')?.textContent,
      sr: q('.workout-cinema-heading p .workout-sr')?.textContent || null, next: q('.ss-next')?.textContent ?? null,
      nextWidth: (() => { const n = q('.ss-next'); return n ? [n.scrollWidth, n.clientWidth, getComputedStyle(n).fontSize] : null; })(),
      pill: q('.cinema-work-journal > span')?.textContent };
  });
};

async function protocolPage(p) {
  await importData(p); await openProtocol(p, 'snaga-a');
  assert.deepEqual(await p.locator('.workout-list-section').allInnerTexts(), ['Priprema', 'Glavni dio', 'Završni dio']);
  // the parts and the groups in page order: each superset under its part, its name and rounds above its rows
  const order = await p.locator('.workout-overview').evaluate(root => [...root.querySelectorAll('.workout-list-section, .ss-block > .ss-head')].map(n => n.innerText.replace(/\s+/g, ' ').trim()));
  assert.equal(order.length, 5, JSON.stringify(order));
  assert.deepEqual(order.slice(0, 2), ['Priprema', 'Glavni dio']);
  assert.match(order[2], /^Superset A · 3 kruga · odmor 90 s nakon kruga/);
  assert.equal(order[3], 'Završni dio');
  assert.match(order[4], /^Superset B · 3 kruga · odmor 75 s nakon kruga/);
  assert.deepEqual(await p.locator('.workout-overview .ss-tag').allInnerTexts(), ['A1', 'A2', 'B1', 'B2']);
  assert.deepEqual(await p.locator('.workout-overview .ss-block').evaluateAll(nodes => nodes.map(n => n.getAttribute('role'))), ['group', 'group']);
  await noOverflow(p, 'protocol page');
  await shot(p, 'protocol');
  return { protocolParts: true };
}

// the shipped Trening A from the start: Priprema, Glavni dio (with Superset A's overview inside it), Završni dio
async function shippedTreningA(p, width) {
  await start(p, 'snaga-a');
  const prep = await overview(p);
  assert.equal(prep.title, 'Priprema'); assert.equal(prep.group, false); assert.equal(prep.heading, false);
  assert.equal(prep.rows.length, 6); assert.deepEqual(prep.heads, []);
  assert.deepEqual(prep.rows.map(r => r.label), Array(6).fill('2×'));
  assert.deepEqual(prep.rows.map(r => r.current), [true, false, false, false, false, false]);
  assert.deepEqual(prep.skip, { j: '6', aria: 'Preskoči dio · Priprema' });
  onScreen(prep, 'Priprema at ' + width);
  await noOverflow(p, 'Priprema overview'); await shot(p, 'priprema-' + width);
  // through Priprema: the pause before the deadlift is Glavni dio's overview, with Superset A drawn as one block
  await until(p, (s, st) => st.kind === 'rest' && st.trans && nextWork(s).g === 6, 'the pause before Glavni dio');
  const main = await overview(p);
  assert.equal(main.title, 'Glavni dio');
  assert.deepEqual(main.rows.map(r => r.label), ['4×', 'A1', 'A2']);
  assert.deepEqual(main.heads, ['Superset A · 3 kruga']);
  assert.match(main.rows[2].dose, /· 2 kruga$/, 'A2 has one round less');
  assert.deepEqual(main.skip, { j: '9', aria: 'Preskoči dio · Glavni dio' });
  onScreen(main, 'Glavni dio'); await noOverflow(p, 'Glavni dio overview'); await shot(p, 'glavni-dio');
  // the deadlift, then the pause before Superset A: the group overview (mid-part)
  await until(p, (s, st) => st.kind === 'rest' && st.trans && nextWork(s).g === 7, 'the pause before Superset A');
  const group = await overview(p);
  assert.equal(group.title, 'Superset A'); assert.equal(group.group, true);
  assert.equal(group.meta, '3 kruga · odmor 90 s nakon kruga');
  assert.equal(group.aria, 'Superset A, 3 kruga, odmor 90 s nakon kruga', 'screen readers hear the group first');
  assert.deepEqual(group.rows.map(r => [r.label, r.current]), [['A1', true], ['A2', false]]);
  assert.match(group.rows[0].name, new RegExp('^A1 ' + NAMES.bugarski));
  assert.match(group.rows[1].dose, /· 2 kruga$/);
  assert.deepEqual(group.skip, { j: '9', aria: 'Preskoči superset' });
  onScreen(group, 'Superset A'); await noOverflow(p, 'group overview'); await shot(p, 'superset-a');
  // inside the group: the plain next line
  await advance(p, (await player(p)).left + .1);
  let w = await work(p);
  assert.deepEqual([w.ex, w.head, w.sr, w.next, w.pill], ['bugarski', 'A1 · krug 1 od 3 · Lijeva strana', 'A1, Superset A, krug 1 od 3, Lijeva strana', null, '1 od 3'], 'the left side: no line');
  await markDone(p);
  await until(p, (s, st) => isWork(st) && st.g === 7 && st.side === 'Desna strana', 'A1 right side');
  w = await work(p);
  assert.equal(w.next, 'Sljedeća: A2 · ' + NAMES.nordic);
  assert.ok(w.nextWidth[0] <= w.nextWidth[1] + 1 && parseFloat(w.nextWidth[2]) >= 13, 'one line, 13 px ' + JSON.stringify(w.nextWidth));
  await noOverflow(p, 'A1 work'); await shot(p, 'a1-next');
  await markDone(p);
  w = await work(p);
  assert.deepEqual([w.ex, w.head, w.next], ['nordic-curl', 'A2 · krug 1 od 3', 'Nakon odmora: A1 · ' + NAMES.bugarski], 'the round rest lies between');
  // round 3 has only A1: after its right side the next part opens
  await until(p, (s, st) => isWork(st) && st.g === 7 && st.set === 3 && st.side === 'Desna strana', 'A1 round 3, right side');
  w = await work(p);
  assert.deepEqual([w.head, w.next], ['A1 · krug 3 od 3 · Desna strana', 'Sljedeći dio: Završni dio']);
  await markDone(p);
  const end = await overview(p);
  assert.equal(end.title, 'Završni dio'); assert.equal(end.group, false);
  assert.deepEqual(end.rows.map(r => r.label), ['B1', 'B2']); assert.deepEqual(end.heads, ['Superset B · 3 kruga']);
  assert.equal(end.skip, null, 'the last part has nothing to skip to');
  onScreen(end, 'Završni dio'); await noOverflow(p, 'Završni dio overview'); await shot(p, 'zavrsni-dio');
  await advance(p, (await player(p)).left + .1);
  w = await work(p);
  assert.deepEqual([w.ex, w.head, w.next], ['hip-thrust', 'B1 · krug 1 od 3', 'Sljedeća: B2 · ' + NAMES.cph], 'a setup countdown is not a rest');
  await markDone(p);
  await until(p, (s, st) => isWork(st) && st.g === 10 && st.set === 1 && st.side === 'Desna strana', 'B2 round 1, right side');
  assert.equal((await work(p)).next, 'Nakon odmora: B1 · ' + NAMES.hip);
  await until(p, (s, st) => isWork(st) && st.g === 10 && st.set === 3 && st.side === 'Desna strana', 'the last set of the workout');
  assert.equal((await work(p)).next, null, 'the end of the workout: no line');
  await quit(p);
  return { width, priprema: prep.fit, glavniDio: main.fit, supersetA: group.fit, zavrsniDio: end.fit, nextLines: true };
}

// jumps: into a group from outside lands on its overview; into a part's first exercise on its first set (1.22.1)
async function jumps(p) {
  await start(p, 'snaga-a');
  await overview(p);
  const closeSheets = async () => { for (let guard = 0; guard < 3 && await p.locator('.sheet').count(); guard++) { await p.keyboard.press('Escape'); await p.waitForTimeout(150); } };
  // ⋯ → Postavke treninga → Dijelovi treninga
  const openPlan = async () => { await closeSheets(); await openCinemaControls(p); await p.locator('.sheet [data-a="cinemaPlan"]').click(); await p.locator('.sheet[data-kind="cinemaPlan"]').waitFor(); };
  const plan = async j => {
    await openPlan();
    await p.locator('.sheet[data-kind="cinemaPlan"] [data-a="cinemaBlock"][data-j="' + j + '"]').click();
    await p.waitForTimeout(250);
    return player(p);
  };
  // Dijelovi treninga: the three parts, the group rows with their tags
  await openPlan();
  const rows = await p.locator('.sheet[data-kind="cinemaPlan"]').evaluate(n => [...n.querySelectorAll('h4, [data-a="cinemaBlock"] strong')].map(x => x.textContent));
  assert.deepEqual(rows.filter(t => /^(Priprema|Glavni dio|Završni dio)$/.test(t)), ['Priprema', 'Glavni dio', 'Završni dio']);
  assert.ok(rows.includes('A1 · ' + NAMES.bugarski) && rows.includes('B2 · ' + NAMES.cph), JSON.stringify(rows));
  await closeSheets();
  // the row A1 · Bulgarian split squat (from Priprema) lands on Superset A's overview
  let state = await plan(7);
  assert.ok(step(state).kind === 'rest' && step(state).trans && nextWork(state).g === 7, 'Dijelovi treninga → A1: the pause before the group');
  let o = await overview(p);
  assert.deepEqual([o.title, o.group], ['Superset A', true]);
  // its skip button skips the group and lands on the pause before the next block: here Završni dio's overview
  // (1.23.0 review: not on B1's first set, which skipped the overview of the part)
  await p.locator('.cinema-group [data-a="cinemaSkip"]').click(); await p.waitForTimeout(250);
  state = await player(p);
  assert.ok(step(state).kind === 'rest' && step(state).trans && nextWork(state).g === 9, 'Preskoči superset → the pause before Završni dio');
  o = await overview(p);
  assert.deepEqual([o.title, o.group], ['Završni dio', false], 'its overview, with its clock');
  // Dijelovi treninga → the deadlift (the first exercise of Glavni dio): its first set, as in 1.22.1
  state = await plan(6);
  assert.deepEqual([step(state).g, step(state).set, isWork(step(state))], [6, 1, true], 'into a part: its first set');
  // the journal's "Prijeđi na vježbu" on A1 from outside the group (the deadlift): the group overview
  await openJournal(p);
  await p.locator('.cinema-journal .cj-row[data-j="7"]').first().click();
  await p.locator('.cinema-journal [data-a="cinemaGoSet"][data-j="7"]').click(); await p.waitForTimeout(250);
  state = await player(p);
  assert.ok(step(state).trans && nextWork(state).g === 7, 'Dnevnik → A1: the group overview');
  // the pause "Sljedeća vježba" from the deadlift's last set: the group overview, paused
  state = await plan(6);
  await until(p, (s, st) => st.kind === 'manual' && st.g === 6 && st.set === 4, 'deadlift set 4');
  await p.locator('.workout-cinema #ring').click(); await pauseLayer(p).waitFor();
  const next = p.locator('.workout-cinema [data-a="cinemaPauseJump"][data-d="1"]');
  assert.equal(await next.getAttribute('aria-label'), 'Sljedeća vježba');
  await next.click(); await p.waitForTimeout(250);
  state = await player(p);
  assert.ok(step(state).trans && nextWork(state).g === 7 && state.clock.paused, 'Sljedeća vježba → the group overview, paused');
  assert.equal((await p.locator('#cinema-section-title').textContent()), 'Superset A');
  await A(p, 'cinemaResume').click(); await pauseLayer(p).waitFor({ state: 'detached' });
  await shot(p, 'jump-group');
  await quit(p);
  return { jumps: true };
}

// 1.23.0 review: "preskoči Pripremu" (Prevencija's description) lands on Glavni dio's overview with its clock, not
// on a running first set (Prevencija's 10 s Adductor squeeze); the same in Trening A
async function skipPriprema(p) {
  await start(p, 'prevencija');
  const prep = await overview(p);
  assert.deepEqual([prep.title, prep.skip], ['Priprema', { j: '1', aria: 'Preskoči dio · Priprema' }]);
  await p.locator('.cinema-section header [data-a="cinemaSkip"]').click(); await p.waitForTimeout(250);
  let state = await player(p);
  assert.deepEqual([step(state).kind, !!step(state).trans, nextWork(state).g, step(state).dur, state.clock.paused], ['rest', true, 1, 15, false], 'its 15 s setup, running');
  const main = await overview(p);
  assert.equal(main.title, 'Glavni dio');
  assert.match(main.rows[0].name, /Adductor squeeze/);
  assert.equal(await stage(p).getAttribute('data-phase'), 'section', 'the squeeze is not running');
  onScreen(main, 'Prevencija Glavni dio'); await shot(p, 'prevencija-skip-priprema');
  await quit(p);
  await start(p, 'snaga-a');
  await overview(p);
  await p.locator('.cinema-section header [data-a="cinemaSkip"]').click(); await p.waitForTimeout(250);
  state = await player(p);
  assert.ok(step(state).trans && nextWork(state).g === 6, 'Trening A: the pause before the deadlift');
  assert.deepEqual((await overview(p)).rows.map(r => r.label), ['4×', 'A1', 'A2'], 'the Glavni dio list');
  await quit(p);
  return { skipPriprema: true };
}

// 1.23.0 review: inside a group, the exercise page's rest words, the journal's group frame and current card, and a
// journal jump that keeps the round (A1 round 2 → A2 round 2; A2 has 2 sets, so from round 3 its last set)
async function groupPages(p) {
  await importData(p); await openProtocol(p, 'snaga-a');
  const words = {};
  for (const j of [6, 7, 8, 9, 10]) {
    await p.locator('.workout-compact-row[data-j="' + j + '"]').click(); await p.locator('.workout-prescription').waitFor();
    words[j] = await p.locator('.workout-prescription > span').last().innerText();
    await A(p, 'workoutClose').click(); await p.locator('.workout-overview').waitFor();
  }
  assert.deepEqual(words, { 6: 'Odmor 150 s', 7: 'Bez odmora do A2', 8: 'Odmor 90 s nakon kruga', 9: 'Bez odmora do B2', 10: 'Odmor 75 s nakon kruga' });
  await A(p, 'startPr').click(); await stage(p).waitFor(); await overview(p);
  const plan = async j => {
    await openCinemaControls(p); await p.locator('.sheet [data-a="cinemaPlan"]').click();
    await p.locator('.sheet[data-kind="cinemaPlan"] [data-a="cinemaBlock"][data-j="' + j + '"]').click(); await p.waitForTimeout(250);
  };
  await plan(7); await overview(p);
  await advance(p, (await player(p)).left + .1); await work(p);
  // the first opening of the journal shows the current card (A1), not the finished Priprema at the top
  await openJournal(p); await p.waitForTimeout(250);
  const j1 = await p.locator('.cinema-journal').evaluate(root => {
    const list = root.querySelector('.workout-journal-blocks').getBoundingClientRect(), cur = root.querySelector('.workout-player-exercise[data-current="true"]').getBoundingClientRect();
    return { list: [Math.round(list.top), Math.round(list.bottom)], cur: [Math.round(cur.top), Math.round(cur.bottom)],
      blocks: [...root.querySelectorAll('.ss-block')].map(b => [b.getAttribute('role'), b.getAttribute('aria-label'), b.className]) };
  });
  assert.ok(j1.cur[0] >= j1.list[0] - 1 && j1.cur[0] < j1.list[1] - 40, 'the current card is in view: ' + JSON.stringify(j1));
  assert.deepEqual(j1.blocks.map(b => b[0]), ['group', 'group']);
  assert.equal(j1.blocks[0][1], 'Superset A, 2 vježbe naizmjence, 3 kruga, odmor 90 s nakon kruga, 3. krug samo A1');
  assert.ok(j1.blocks.every(b => b[2] === 'ss-block ss-a'), JSON.stringify(j1.blocks));
  const goTo = async j => {
    await openJournal(p);
    await p.locator('.cinema-journal .cj-row[data-j="' + j + '"]').first().click();
    await p.locator('.cinema-journal [data-a="cinemaGoSet"][data-j="' + j + '"]').click(); await p.waitForTimeout(250);
    return step(await player(p));
  };
  await A(p, 'cinemaJournalClose').click();
  await until(p, (s, st) => isWork(st) && st.g === 7 && st.set === 2, 'A1 round 2');
  let st = await goTo(8);
  assert.deepEqual([st.g, st.set, isWork(st)], [8, 2, true], 'A1 round 2 → A2: A2 round 2');
  st = await goTo(7);
  assert.deepEqual([st.g, st.set, st.side], [7, 2, 'Lijeva strana'], 'A2 round 2 → A1: A1 round 2, its left side');
  await until(p, (s, x) => isWork(x) && x.g === 7 && x.set === 3, 'A1 round 3');
  st = await goTo(8);
  assert.deepEqual([st.g, st.set], [8, 2], 'A1 round 3 → A2 (2 sets): its last set');
  await quit(p);
  return { restWords: true, journalGroups: true, journalOpensOnCurrent: true, keepRound: true };
}

// a workout without parts that starts with a group: its overview at the start (a 6-exercise circuit)
async function circuitStart(p, width) {
  await start(p, 'trx-krug');
  const o = await overview(p);
  assert.deepEqual([o.title, o.group, o.meta], ['Kružni trening A', true, '3 kruga · odmor 90 s nakon kruga']);
  assert.equal(o.aria, 'Kružni trening A, 3 kruga, odmor 90 s nakon kruga');
  assert.deepEqual(o.rows.map(r => r.label), ['A1', 'A2', 'A3', 'A4', 'A5', 'A6']);
  assert.equal(o.skip, null, 'nothing after the circuit to skip to');
  onScreen(o, 'TRX krug at ' + width);
  await noOverflow(p, 'circuit overview'); await shot(p, 'krug-' + width);
  await quit(p);
  return { width, circuit: o.fit };
}

// the editor: a new protocol offers the three parts and takes Priprema; a part name in use stays on offer
async function editor(p) {
  await importData(p); await protocols(p);
  await A(p, 'newPr').click(); await p.locator('#p-name').fill('Novi s pripremom');
  await A(p, 'pickStart').click();
  for (const id of ['band-pull-apart', 'bench-press']) await p.locator('[data-a="pickToggle"][data-id="' + id + '"]').click();
  await A(p, 'pickDone').click();
  const picked = (await p.evaluate(() => JSON.parse(sessionStorage.getItem('mt.unsavedDraft.v1')).draft)).items.map(x => x.exId);
  const select = i => p.locator('select[data-builder-section="' + i + '"]');
  const open = async i => { if (!await select(i).isVisible()) await p.locator('[data-a="itOpen"][data-i="' + i + '"]').click(); await select(i).waitFor(); };
  await open(0);
  assert.deepEqual(await select(0).locator('option').allInnerTexts(), ['Priprema', 'Glavni dio', 'Završni dio', 'Vlastiti naziv…']);
  assert.equal(await select(0).inputValue(), 'Glavni dio', 'the default part');
  await select(0).selectOption('Priprema');
  await p.locator('.topbar [data-a="savePr"]').click(); await p.locator('.workout-overview').waitFor();
  const saved = Object.values((await store(p)).protocols).find(x => x.name === 'Novi s pripremom');
  assert.deepEqual(saved.items.map(x => [x.exId, x.section]), [[picked[0], 'Priprema'], [picked[1], 'Glavni dio']], 'the part is saved on the exercise');
  assert.deepEqual(await p.locator('.workout-list-section').allInnerTexts(), ['Priprema', 'Glavni dio']);
  // his own part name (not one of the three) is still offered, after the three
  await p.reload({ waitUntil: 'domcontentloaded' }); await openProtocol(p, OWN);
  await A(p, 'workoutProtocolOptions').click(); await p.locator('[data-a="editPr"][data-id="' + OWN + '"]').click(); await p.locator('#p-name').waitFor();
  await open(0);
  assert.deepEqual(await select(0).locator('option').allInnerTexts(), ['Priprema', 'Glavni dio', 'Završni dio', 'Snaga', 'Vlastiti naziv…']);
  assert.equal(await select(0).inputValue(), 'Snaga');
  return { newProtocolPriprema: true, partInUseOffered: true };
}

(async () => {
  const server = await serve(), browser = await launch(), results = [];
  try {
    for (const [width, height, scenarios, safeArea] of [[375, 812, [protocolPage, shippedTreningA, jumps, skipPriprema, groupPages, circuitStart, editor], 34], [375, 667, [shippedStart, circuitStart]]]) {
      const context = await browser.newContext({ viewport: { width, height }, isMobile: true, hasTouch: true, locale: 'hr-HR', timezoneId: 'Europe/Zagreb', reducedMotion: 'reduce', serviceWorkers: 'block' });
      // an iPhone's 34 px home-indicator area, which the test browser reports as 0
      if (safeArea) await context.route(/\.css(\?.*)?$/, async route => {
        const response = await route.fetch();
        const body = (await response.text()).replace(/env\(safe-area-inset-bottom(?:,\s*0px)?\)/g, safeArea + 'px');
        await route.fulfill({ response, body, headers: { ...response.headers(), 'content-type': 'text/css' } });
      });
      const p = await context.newPage(), errors = [];
      p.on('pageerror', error => errors.push(error.message));
      p.setDefaultTimeout(8000);
      await p.clock.setFixedTime(new Date('2026-11-06T10:00:00+01:00'));
      try {
        await p.goto(server.url, { waitUntil: 'domcontentloaded' });
        for (const scenario of scenarios) results.push({ scenario: scenario.name, size: width + '×' + height, ...await scenario(p, width + '×' + height) });
        assert.deepEqual(errors, [], 'no page errors');
      } catch (error) {
        await shot(p, 'failure-' + width + 'x' + height).catch(() => {});
        console.error('Current screen:', (await p.locator('.view,.sheet').allInnerTexts().catch(() => [])).join('\n').slice(0, 1500));
        throw error;
      } finally { await context.close(); }
    }
    console.log(JSON.stringify({ engine, passed: true, results }));
  } finally {
    await browser.close(); await server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });

// the start of the shipped Trening A on a short screen: the Priprema overview scrolls its list, the clock stays
async function shippedStart(p, width) {
  await start(p, 'snaga-a');
  const prep = await overview(p);
  assert.equal(prep.title, 'Priprema');
  onScreen(prep, 'Priprema at ' + width);
  await noOverflow(p, 'Priprema overview ' + width); await shot(p, 'priprema-' + width);
  await quit(p);
  return { width, priprema: prep.fit };
}
