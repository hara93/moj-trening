'use strict';
// 1.22.0: the player of the approved mockup. The gesture guide (first start, ⋯ menu), the part overview only for
// workouts with parts, rest phase 1 (the clock alone) → a tap → phase 2 (reserve row, −/+, next set), the reserve
// row's taps in rirList/sirList and the "Upis rezerve" modes, no "Slijedi" card during work, the dash progress and
// its dot, the journal (rows, the open card, the equipment menu, swap/undo back to the journal, the totals,
// "Prijeđi na vježbu"), the swap sheet (search pill vs the last row, no (i) on thumbnails), no horizontal overflow
// at 375 and 393 px and no page errors. Synthetic data only.
const assert = require('node:assert/strict');
const path = require('node:path');
const { artifacts, engine, fixture: baseFixture, launch, serve, revealRest, openQuit } = require('./runtime.cjs');
const parts = 'player-reference', plain = 'player-reference-plain';
const A = (p, action) => p.locator('[data-a="' + action + '"]');
const player = p => p.evaluate(() => JSON.parse(localStorage.getItem('mt.play')));
const store = p => p.evaluate(() => JSON.parse(localStorage.getItem('mt.data.v1')));
const settings = p => p.evaluate(() => JSON.parse(localStorage.getItem('mt.settings') || '{}'));
const step = state => state.liveSchedule[state.i];
const stage = p => p.locator('.workout-cinema');
const journal = p => p.locator('.sheet[data-kind="cinemaJournal"]');
const swap = p => p.locator('.sheet[data-kind="workoutSwap"]');
const reserve = p => p.locator('.workout-cinema-reserve');
const shot = (p, name) => p.screenshot({ path: path.join(artifacts, 'player-reference-' + engine + '-' + name + '.png') });

function fixture({ guideSeen = true, entry } = {}) {
  const data = baseFixture();
  data.log = []; data.programs = {}; data.field = {};
  Object.assign(data.settings, { sound: false, planDates: {}, matchDates: {}, matchDay: -1, morningChecks: {}, transSec: 10, switchSec: 5 });
  if (!guideSeen) delete data.settings.playerGuideSeen;   // older settings without the flag: the guide shows once
  if (entry !== undefined) data.settings.reserveEntry = entry;
  data.protocols = {
    // three parts; the middle one is a superset (both exercises share its part and its dashes)
    [parts]: { id: parts, name: 'Referentni trening', tag: 'Teretana', days: [], items: [
      { exId: 'back-squat', measure: 'sets', sets: 2, reps: 8, kg: 130, rest: 60, sides: false, targetRir: 2, section: 'Snaga' },
      { exId: 'bugarski', measure: 'sets', sets: 2, reps: 8, kg: 14, rest: 0, sides: true, ss: 'a', section: 'Noge' },
      { exId: 'nordic-curl', measure: 'sets', sets: 2, reps: 5, kg: 0, rest: 60, sides: false, ss: 'a' },
      { exId: 'side-plank', measure: 'time', sets: 2, reps: 1, sec: 6, kg: 0, rest: 30, sides: false, targetSir: 10, section: 'Trup' }
    ] },
    [plain]: { id: plain, name: 'Trening bez dijelova', tag: 'Teretana', days: [], items: [
      { exId: 'bench-press', measure: 'sets', sets: 2, reps: 8, kg: 60, rest: 60, sides: false, targetRir: 2 },
      { exId: 'db-row', measure: 'sets', sets: 2, reps: 10, kg: 22, rest: 60, sides: false }
    ] }
  };
  return data;
}

async function advance(p, seconds) {
  await p.clock.setFixedTime(new Date(await p.evaluate(() => Date.now()) + seconds * 1000));
  await p.waitForTimeout(350);
}
async function start(p, id, data) {
  await p.evaluate(() => localStorage.removeItem('mt.play'));
  await p.reload({ waitUntil: 'domcontentloaded' });
  await A(p, 'dataSheet').waitFor();
  await A(p, 'dataSheet').click();
  await p.locator('#importFile').setInputFiles({ name: 'player-reference.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(data)) });
  await A(p, 'restoreApply').click(); await A(p, 'restoreApply').waitFor({ state: 'hidden' });
  await p.getByRole('button', { name: 'Moj pregled', exact: true }).click();
  await A(p, 'dashboardProtocols').click();
  await p.locator('[data-a="openPr"][data-id="' + id + '"]').click();
  await A(p, 'startPr').click();
  await stage(p).waitFor();
}
async function quit(p) {
  await openQuit(p); await A(p, 'quitDiscard').click();
  await stage(p).waitFor({ state: 'detached' });
}
async function markDone(p) {
  await p.locator('.workout-cinema .cinema-work-mark[data-a="workoutSetDone"]').click();
  await p.waitForTimeout(150);
}
// Runs the session until the predicate holds: rep sets are marked done, timed steps run out.
async function until(p, predicate, label, visit) {
  for (let guard = 0; guard < 60; guard++) {
    const state = await player(p);
    if (visit) await visit(state);
    if (predicate(state, step(state))) return state;
    if (state.done) break;
    if (step(state).kind === 'manual') await markDone(p);
    else await advance(p, (state.left || 1) + 0.1);
  }
  assert.fail(label + ' never came');
}
const lastWork = state => state.liveSchedule.slice(0, state.i).reverse().find(x => x.kind === 'work' || x.kind === 'manual');
async function noOverflow(p, label) {
  const d = await p.evaluate(() => {
    const sheet = document.querySelector('.sheet');
    return { viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth,
      sheet: sheet ? [sheet.scrollWidth, sheet.clientWidth] : null };
  });
  assert.ok(d.document <= d.viewport && d.body <= d.viewport && (!d.sheet || d.sheet[0] <= d.sheet[1] + 1), 'no horizontal overflow · ' + label + ': ' + JSON.stringify(d));
}
// The dash progress: which dash is current, where the dot is (0–1 inside it), and whether the dot's centre lies
// inside the current dash on screen.
async function dashes(p) {
  return p.locator('.workout-cinema .cinema-dashes').evaluate(bar => {
    const all = [...bar.children], current = bar.querySelector('i.is-current'), dot = current?.querySelector('em');
    const box = current?.getBoundingClientRect(), d = dot?.getBoundingClientRect();
    return { n: all.length, current: all.indexOf(current), done: bar.querySelectorAll('i.is-done').length, at: Number(current?.style.getPropertyValue('--at')),
      dataCurrent: Number(bar.dataset.current), value: Number(bar.getAttribute('aria-valuenow')),
      inside: !!(box && d && d.left + d.width / 2 >= box.left - .5 && d.left + d.width / 2 <= box.right + .5 && Math.abs((d.top + d.height / 2) - (box.top + box.height / 2)) <= 1) };
  });
}
function forward(path, label) {
  for (let k = 1; k < path.length; k++)
    assert.ok(path[k].current + path[k].at >= path[k - 1].current + path[k - 1].at - 1e-6, label + ': the dot moved back at ' + k + ' ' + JSON.stringify(path.slice(Math.max(0, k - 2), k + 1)));
}

async function firstStartWithParts(p, width) {
  await start(p, parts, fixture({ guideSeen: false }));
  // the guide opens once on the first start; its flag lives in mt.settings (backups carry it)
  const guide = p.locator('.sheet[data-kind="cinemaGuide"]');
  await guide.waitFor();
  assert.equal(await guide.locator('#sheet-h').textContent(), 'Kako koristiti player');
  assert.deepEqual(await guide.locator('li').allInnerTexts(), ['Povuci gore za Dnevnik', 'Povuci desno za natrag', 'Povuci lijevo za naprijed', 'Dodirni sredinu za pauzu'],
    'only the four gestures the player handles');
  assert.equal((await settings(p)).playerGuideSeen, true, 'the seen flag is stored in mt.settings');
  await shot(p, 'guide-first-' + width);
  await A(p, 'cinemaGuideDone').click(); await guide.waitFor({ state: 'detached' });

  // the part overview opens the workout: part name, equipment, the items with the current one marked, a dose line
  // from the workout itself, the big countdown and "+ Dodaj vrijeme za pripremu"
  assert.equal(await stage(p).getAttribute('data-phase'), 'section');
  const overview = p.locator('.cinema-section');
  assert.equal(await overview.locator('#cinema-section-title').textContent(), 'Snaga');
  assert.deepEqual(await overview.locator('.cinema-section-chips span').allTextContents(), ['Šipka']);
  assert.equal(await overview.locator('.cinema-section-items li').count(), 1);
  assert.equal(await overview.locator('.cinema-section-items li.is-current').count(), 1);
  assert.match(await overview.locator('.cinema-section-items li strong').textContent(), /^2× \S/);
  assert.equal(await overview.locator('.cinema-section-items li small').textContent(), '8 pon. · 130 kg');
  assert.equal(await p.locator('.workout-cinema .cinema-section-clock #ringN').count(), 1, 'the big countdown');
  assert.equal(await p.locator('.workout-cinema .cinema-section-prep[data-a="cinemaPrep"]').innerText(), 'Dodaj vrijeme za pripremu');
  assert.equal(await p.locator('.workout-cinema .cinema-next').count(), 0);
  await noOverflow(p, 'part overview ' + width);
  await shot(p, 'section-' + width);
  // the overview stays while its prep time is edited: the slider takes the clock's place
  await p.locator('.workout-cinema .cinema-section-prep').click();
  await p.locator('.workout-cinema .cinema-prep-editor').waitFor();
  assert.equal(await p.locator('.cinema-section').count(), 1, 'the overview stays with the slider');
  await A(p, 'cinemaPrepApply').click();
  await p.locator('.workout-cinema .cinema-prep-editor').waitFor({ state: 'detached' });

  // work: no "Slijedi" card, "Cilj RIR 2" in the pill, one dash per exercise and the dot inside the first one
  await until(p, (s, st) => st.kind === 'manual', 'the first set');
  assert.equal(await stage(p).getAttribute('data-phase'), 'work');
  assert.equal(await p.locator('.workout-cinema .cinema-next, .workout-cinema .workout-cinema-next').count(), 0, 'no next-set card during work');
  assert.doesNotMatch(await stage(p).innerText(), /Slijedi/);
  assert.equal(await p.locator('.workout-cinema-heading p').innerText(), 'Serija 1 od 2');
  assert.equal(await p.locator('.cinema-work-journal .cinema-effort').innerText(), '· Cilj RIR 2');
  const path = [];
  let d = await dashes(p);
  assert.equal(d.n, 4, 'one dash per exercise');
  assert.equal(d.current, 0); assert.equal(d.dataCurrent, 0); assert.ok(d.inside, 'the dot lies inside the current dash: ' + JSON.stringify(d));
  path.push(d);
  // per tick only the dash and the dot move; the stage itself is not rebuilt
  await p.evaluate(() => { window.__stageNode = document.querySelector('.workout-cinema-stage'); });
  for (let t = 0; t < 3; t++) { await advance(p, 6); d = await dashes(p); assert.ok(d.inside, JSON.stringify(d)); path.push(d); }
  assert.ok(path.at(-1).at > path[0].at, 'the dot moves with the set timer: ' + JSON.stringify(path.map(x => x.at)));
  assert.equal(await p.evaluate(() => window.__stageNode === document.querySelector('.workout-cinema-stage')), true, 'a tick does not rebuild the player');
  await noOverflow(p, 'work ' + width);
  await shot(p, 'work-' + width);

  // rest phase 1: the clock alone; a tap on the stage shows phase 2 and does not pause
  await markDone(p);
  let state = await player(p);
  assert.equal(step(state).kind, 'rest');
  const finished = Number(Object.keys(state.doneSteps)[0]);
  await p.locator('.workout-cinema.is-rest-1').waitFor();
  assert.equal(await p.locator('.workout-cinema .cinema-rest-stack .cinema-phase-word').textContent(), 'Odmor');
  assert.equal(await p.locator('.workout-cinema .cinema-rest-stack #ringN').innerText(), '1:00');
  for (const hidden of ['.workout-cinema-reserve', '.cinema-rest-buttons', '.cinema-next', '.cinema-work-mark', '.cinema-metric'])
    assert.equal(await p.locator('.workout-cinema ' + hidden).count(), 0, 'rest phase 1 hides ' + hidden);
  d = await dashes(p); assert.equal(d.current, 0); assert.ok(d.inside); path.push(d);
  await shot(p, 'rest-1-' + width);
  await revealRest(p);
  assert.equal((await player(p)).clock.paused, false, 'the tap shows phase 2 without pausing');
  assert.equal(await p.locator('.workout-cinema .cinema-pause-layer').count(), 0);
  // phase 2: the reserve row above −ODMOR+, the next set's card, the target outlined, a tap filled green
  const row = reserve(p);
  await row.waitFor();
  assert.match(await row.innerText(), /^Koliko si još mogao\? · serija 1\n/);
  const pills = row.locator('.rirb button');
  assert.deepEqual(await pills.allInnerTexts(), ['0', '1', '2', '3', '4–5', '6+']);
  assert.match(await pills.nth(2).getAttribute('class'), /\btg\b/, 'the target RIR 2 is outlined');
  assert.equal(await p.locator('.workout-cinema .cinema-rest-buttons').count(), 1, '−ODMOR+');
  const rowBox = await row.boundingBox(), adjustBox = await p.locator('.workout-cinema .cinema-rest-buttons').boundingBox();
  assert.ok(rowBox.y + rowBox.height <= adjustBox.y + 1, 'the reserve row sits above −ODMOR+');
  assert.match(await p.locator('.workout-cinema .cinema-next').innerText(), /Serija 2 od 2/, 'rest phase 2 shows the next set');
  await pills.nth(3).click();
  assert.equal((await player(p)).rir[finished], 3, 'the tap is stored for the finished set');
  assert.equal(await pills.nth(3).getAttribute('aria-pressed'), 'true');
  assert.equal(await pills.nth(3).evaluate(node => getComputedStyle(node).backgroundColor), 'rgb(45, 216, 90)', 'green fill');
  d = await dashes(p); assert.equal(d.current, 0); assert.ok(d.inside); path.push(d);
  await noOverflow(p, 'rest phase 2 ' + width);
  await shot(p, 'rest-2-' + width);

  // the journal: the current exercise is an open card, the others collapsed rows of set circles
  await A(p, 'cinemaJournal').first().click();
  await journal(p).waitFor();
  const rows = journal(p).locator('.cj-row');
  assert.equal(await rows.count(), 3, 'three collapsed exercises');
  assert.deepEqual(await rows.evaluateAll(list => list.map(node => node.querySelectorAll('.cj-sets>span').length)), [2, 2, 2], 'one circle per set');
  const card = journal(p).locator('.cj-card[data-index="0"]');
  assert.equal(await journal(p).locator('.cj-card').count(), 1, 'one open card');
  assert.equal(await card.locator('.workout-set-row').count(), 2);
  assert.match(await card.innerText(), /Cilj RIR 2/);
  assert.equal(await card.locator('[data-a="cinemaGoSet"]').count(), 0, 'no "Prijeđi na vježbu" on the current exercise');
  // the totals: "8 pon. · 1 040 kg" with a narrow no-break space, never "kg × pon."
  const totals = await journal(p).locator('.cinema-journal-footer small').textContent();
  assert.equal(totals, '8 pon. · 1 040 kg');
  assert.doesNotMatch(await journal(p).locator('.cinema-journal-footer').innerText(), /×/);
  assert.equal(await journal(p).locator('.cj-plan').getAttribute('aria-label'), 'Dijelovi treninga');
  await noOverflow(p, 'journal ' + width);
  await shot(p, 'journal-' + width);
  // the equipment menu after a finished set: every choice disabled, the reason shown
  await card.locator('[data-a="cinemaEquipment"][data-j="0"]').first().click();
  const locked = journal(p).locator('#cj-menu-0');
  await locked.waitFor();
  assert.ok((await locked.locator('[data-a="cinemaEquipmentPick"]').evaluateAll(list => list.map(node => node.disabled))).every(Boolean));
  assert.match(await locked.innerText(), /Oprema se mijenja prije prve serije\./);
  await p.keyboard.press('Escape'); await locked.waitFor({ state: 'detached' });
  assert.equal(await journal(p).count(), 1, 'Escape closes only the menu');
  // another exercise: its card ends with "Prijeđi na vježbu"; its menu offers only what the swap candidates use
  await journal(p).locator('[data-a="cinemaJournalGroup"][data-j="1"]').first().click();
  const other = journal(p).locator('.cj-card[data-index="1"]');
  await other.waitFor();
  assert.equal((await other.locator('.cj-chips button').last().innerText()).trim(), 'Prijeđi na vježbu');
  await other.locator('[data-a="cinemaEquipment"][data-j="1"]').first().click();
  const menu = journal(p).locator('#cj-menu-1');
  await menu.waitFor();
  const offered = (await menu.locator('[data-a="cinemaEquipmentPick"]:not(.cj-menu-all)').allInnerTexts()).map(text => text.trim());
  assert.ok(offered.length > 0, 'the menu offers other equipment');
  assert.ok((await menu.locator('[data-a="cinemaEquipmentPick"]').evaluateAll(list => list.map(node => node.disabled))).every(x => !x), 'enabled before the first set');
  await shot(p, 'journal-equipment-' + width);
  await menu.locator('.cj-menu-all').click();
  await swap(p).waitFor();
  const equipment = new Set((await swap(p).locator('.workout-swap-row .workout-swap-description small').allInnerTexts()).flatMap(text => text.split(' · ').map(x => x.trim())));
  for (const label of offered) assert.ok(equipment.has(label), label + ' is offered but no candidate uses it: ' + [...equipment]);

  // the swap sheet: no (i) on small thumbnails (▶ only with a video), the search pill never covers the last row
  const thumbs = await swap(p).locator('.workout-swap-row .workout-swap-photo').evaluateAll(list => list.map(node => ({
    id: node.dataset.id, icon: node.querySelector('.workout-swap-preview-icon')?.innerHTML || '', label: node.getAttribute('aria-label') })));
  const play = await p.evaluate(() => WorkoutView.icon('play')), info = await p.evaluate(() => WorkoutView.icon('info'));
  assert.ok(thumbs.length > 2, 'candidates listed');
  for (const thumb of thumbs) {
    assert.ok(!thumb.icon.includes(info), 'no (i) on ' + thumb.id);
    assert.equal(!!thumb.icon, /sa snimkom/.test(thumb.label), '▶ only with a video: ' + JSON.stringify(thumb));
    if (thumb.icon) assert.equal(thumb.icon, play);
  }
  assert.equal(await swap(p).locator('.workout-swap-photo.is-current .workout-swap-preview-icon').count(), 1, 'the big "Trenutna" picture keeps its icon');
  await noOverflow(p, 'swap ' + width);
  await shot(p, 'swap-top-' + width);
  await swap(p).locator('.workout-swap-body').evaluate(node => { node.scrollTop = node.scrollHeight; });
  await p.waitForTimeout(200);
  const geometry = await swap(p).evaluate(sheet => {
    const last = [...sheet.querySelectorAll('.workout-swap-row')].at(-1).getBoundingClientRect(), pill = sheet.querySelector('.workout-swap-search').getBoundingClientRect();
    const body = sheet.querySelector('.workout-swap-body'), probe = document.elementFromPoint(pill.left + pill.width * .8, pill.top + pill.height / 2);
    return { lastBottom: last.bottom, pillTop: pill.top, atEnd: Math.abs(body.scrollTop + body.clientHeight - body.scrollHeight) < 2,
      pillOnTop: !!probe?.closest('.workout-swap-search'), pill: getComputedStyle(sheet.querySelector('.workout-swap-search')).backgroundColor };
  });
  assert.ok(geometry.atEnd && geometry.lastBottom <= geometry.pillTop, 'the last row ends above the search pill: ' + JSON.stringify(geometry));
  assert.ok(geometry.pillOnTop, 'the pill lies over the list, not under it');
  assert.match(geometry.pill, /^rgb\(/, 'the pill is opaque');
  await shot(p, 'swap-bottom-' + width);
  await swap(p).locator('.workout-swap-body').evaluate(node => { node.scrollTop = 0; });
  // a swap started in the journal returns to the journal with that card open; so does its undo. A TRX variant needs
  // no starting weight (a loaded one would first open the exercise page to ask for it).
  await swap(p).locator('[data-a="workoutCandidate"][data-id="trx-single-leg-squat"]').click();
  await journal(p).waitFor();
  assert.equal(await swap(p).count(), 0);
  assert.equal(await journal(p).locator('.cj-card[data-index="1"]').count(), 1, 'with the swapped exercise open');
  assert.equal((await player(p)).items[1].exId, 'trx-single-leg-squat');
  await journal(p).locator('[data-a="workoutUndoSwap"][data-j="1"]').click();
  await p.waitForTimeout(300);
  assert.equal(await p.evaluate(() => document.querySelector('.sheet')?.dataset.kind), 'cinemaJournal', 'an undo started in the journal returns to the journal');
  assert.equal((await player(p)).items[1].exId, 'bugarski');
  await A(p, 'cinemaJournalClose').first().click(); await journal(p).waitFor({ state: 'detached' });

  // set 2 of the first part
  await until(p, (s, st) => st.kind === 'manual' && st.set === 2 && st.g === 0, 'set 2');
  await markDone(p);
  state = await player(p);
  assert.equal(step(state).kind, 'rest');
  // the last set of the part ends in the pause before the next part: its overview, with the superset in one part
  assert.equal(!!step(state).trans, true, 'the pause before the next exercise');
  await p.locator('.workout-cinema[data-phase="section"]').waitFor();
  assert.equal(await p.locator('#cinema-section-title').textContent(), 'Noge');
  assert.equal(await p.locator('.cinema-section-items li').count(), 2, 'a superset shares its first exercise\'s part');
  d = await dashes(p); assert.equal(d.current, 1, 'the pause before an exercise belongs to its dash'); assert.ok(d.inside); path.push(d);
  // the superset: the dot moves step by step across the pair's two dashes, forward only
  await until(p, (s, st) => st.g === 3 && st.kind === 'work', 'the hold', async () => {
    const now = await dashes(p);
    assert.ok(now.inside, 'dot inside the current dash: ' + JSON.stringify(now));
    path.push(now);
  });
  assert.ok(path.some(x => x.current === 2), 'the dot reaches the second dash of the pair');
  forward(path, 'whole workout');
  // the hold asks in seconds; its tap goes to sirList
  await until(p, s => step(s).kind === 'rest' && lastWork(s)?.g === 3, 'the rest after the first hold');
  await p.locator('.workout-cinema.is-rest-1').waitFor();
  await advance(p, 3.1);
  await p.locator('.workout-cinema.is-rest-2').waitFor();   // phase 2 without a tap
  assert.match(await reserve(p).innerText(), /^Koliko si još sekundi mogao držati\? · serija 1\n/);
  assert.deepEqual(await reserve(p).locator('.rirb button').allInnerTexts(), ['0', '5', '10', '15', '20–30', '30+']);
  assert.match(await reserve(p).locator('.rirb button').nth(2).getAttribute('class'), /\btg\b/);
  await reserve(p).locator('.rirb button').nth(1).click();
  await until(p, s => s.done, 'the end');
  await A(p, 'finishPlay').click();
  const logged = (await store(p)).log.find(entry => entry.refId === parts);
  assert.deepEqual(logged.items[0].rirList, [3, null], 'the reserve tap is saved in rirList');
  assert.deepEqual(logged.items[3].sirList, [5, null], 'the hold tap is saved in sirList (seconds)');
  return { guideFirstStart: true, overview: true, restPhases: true, dots: path.length, journal: true, swap: true, offered };
}

async function plainWorkout(p, width) {
  // no parts: no overview; the start is the prep clock; the guide does not open again
  await start(p, plain, fixture({ entry: 1 }));
  await p.waitForTimeout(300);
  assert.equal(await p.locator('.sheet[data-kind="cinemaGuide"]').count(), 0, 'the guide shows only once');
  assert.equal(await p.locator('.cinema-section').count(), 0, 'no part overview without parts');
  assert.notEqual(await stage(p).getAttribute('data-phase'), 'section');
  assert.equal(await p.locator('.workout-cinema .cinema-phase-word').textContent(), 'Priprema');
  assert.equal(await p.locator('.workout-cinema .cinema-next').count(), 0, 'no next-set card during prep');
  assert.equal((await dashes(p)).n, 2);
  // the guide from the ⋯ menu, any time
  await A(p, 'cinemaMenu').click();
  await A(p, 'cinemaGuide').click();
  const guide = p.locator('.sheet[data-kind="cinemaGuide"]');
  await guide.waitFor();
  assert.equal(await guide.locator('li').count(), 4);
  await p.keyboard.press('Escape'); await guide.waitFor({ state: 'detached' });
  // "Upis rezerve: samo zadnja serija vježbe": nothing after set 1, the row in the pause before the next exercise
  await until(p, (s, st) => st.kind === 'manual', 'set 1');
  assert.equal(await p.locator('.workout-cinema .cinema-next').count(), 0, 'no next-set card during work');
  assert.doesNotMatch(await stage(p).innerText(), /Slijedi/);
  await markDone(p);
  await revealRest(p);
  assert.equal(await reserve(p).count(), 0, 'not after set 1 of 2');
  await until(p, (s, st) => st.kind === 'manual' && st.set === 2, 'set 2');
  await markDone(p);
  assert.equal(step(await player(p)).trans, true);
  await reserve(p).waitFor();
  assert.match(await reserve(p).innerText(), /Bench press · 2\. serija/);
  await quit(p);
  // "Na kraju": nothing during the session, one row per exercise on the done screen
  await start(p, plain, fixture({ entry: 2 }));
  await until(p, (s, st) => st.kind === 'manual', 'set 1');
  await markDone(p);
  await revealRest(p);
  assert.equal(await reserve(p).count(), 0, 'nothing asked during the session');
  // "Prijeđi na vježbu" in the journal jumps to that exercise
  await A(p, 'cinemaJournal').first().click();
  await journal(p).waitFor();
  await journal(p).locator('[data-a="cinemaJournalGroup"][data-j="1"]').first().click();
  await journal(p).locator('.cj-card[data-index="1"] [data-a="cinemaGoSet"]').click();
  await journal(p).waitFor({ state: 'detached' });
  assert.equal(await stage(p).getAttribute('data-ex-id'), 'db-row');
  assert.equal(step(await player(p)).g, 1);
  await until(p, s => s.done, 'the end');
  assert.equal(await p.locator('.rirlast .rir').count(), 2);
  await A(p, 'finishPlay').click();
  return { noOverviewWithoutParts: true, guideFromMenu: true, lastSetMode: true, endMode: true, goToExercise: true };
}

// 375 px: the same screens without horizontal overflow
async function narrow(p, width) {
  await start(p, parts, fixture({ entry: 0 }));
  await p.locator('.workout-cinema[data-phase="section"]').waitFor();
  await noOverflow(p, 'part overview ' + width);
  await until(p, (s, st) => st.kind === 'manual', 'set 1');
  await noOverflow(p, 'work ' + width);
  const d = await dashes(p); assert.ok(d.inside, JSON.stringify(d));
  await shot(p, 'work-' + width);
  await markDone(p); await revealRest(p); await reserve(p).waitFor();
  await noOverflow(p, 'rest phase 2 ' + width);
  await A(p, 'cinemaJournal').first().click(); await journal(p).waitFor();
  await noOverflow(p, 'journal ' + width);
  await shot(p, 'journal-' + width);
  await journal(p).locator('[data-a="cinemaJournalGroup"][data-j="1"]').first().click();
  await journal(p).locator('[data-a="workoutSwap"][data-j="1"]').first().click();
  await swap(p).waitFor();
  await noOverflow(p, 'swap ' + width);
  await swap(p).locator('.workout-swap-body').evaluate(node => { node.scrollTop = node.scrollHeight; });
  await p.waitForTimeout(200);
  const geometry = await swap(p).evaluate(sheet => ({ last: [...sheet.querySelectorAll('.workout-swap-row')].at(-1).getBoundingClientRect().bottom, pill: sheet.querySelector('.workout-swap-search').getBoundingClientRect().top }));
  assert.ok(geometry.last <= geometry.pill, 'the last row ends above the search pill at ' + width + ': ' + JSON.stringify(geometry));
  await shot(p, 'swap-' + width);
  await p.keyboard.press('Escape');
  for (let guard = 0; guard < 3 && await p.locator('.sheet').count(); guard++) { await p.keyboard.press('Escape'); await p.waitForTimeout(200); }
  await quit(p);
  return { width, noOverflow: true };
}

async function run() {
  const server = await serve();
  let browser;
  const results = [];
  try {
    browser = await launch();
    for (const [width, height, scenarios] of [[393, 852, [firstStartWithParts, plainWorkout]], [375, 812, [narrow]]]) {
      const context = await browser.newContext({ viewport: { width, height }, isMobile: true, hasTouch: true, locale: 'hr-HR', timezoneId: 'Europe/Zagreb', reducedMotion: 'reduce', serviceWorkers: 'block' });
      const p = await context.newPage(), errors = [];
      p.on('pageerror', error => errors.push(error.message));
      p.setDefaultTimeout(8000);
      await p.clock.setFixedTime(new Date('2026-11-06T10:00:00+01:00'));
      try {
        await p.goto(server.url, { waitUntil: 'domcontentloaded' });
        for (const scenario of scenarios) results.push({ scenario: scenario.name, width, ...await scenario(p, width) });
        assert.deepEqual(errors, [], 'no page errors');
      } catch (error) {
        await shot(p, 'failure-' + width).catch(() => {});
        console.error('Current screen:', (await p.locator('.view,.sheet').allInnerTexts().catch(() => [])).join('\n').slice(0, 1500));
        throw error;
      } finally { await context.close(); }
    }
    console.log(JSON.stringify({ engine, passed: true, results }));
  } finally {
    if (browser) await browser.close();
    await server.close();
  }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
