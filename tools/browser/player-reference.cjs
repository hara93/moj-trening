'use strict';
// 1.22.0: the player of the approved mockup. The gesture guide (first start, ⋯ menu), the part overview only for
// workouts with parts, rest phase 1 (the clock alone) → a tap → phase 2 (reserve row, −/+, next set), the reserve
// row's taps in rirList/sirList and the "Upis rezerve" modes, no "Slijedi" card during work, the dash progress and
// its dot, the journal (rows, the open card, the equipment menu, swap/undo back to the journal, the totals,
// "Prijeđi na vježbu"), the swap sheet (search pill vs the last row, no (i) on thumbnails), no horizontal overflow
// at 375 and 393 px and no page errors. Review fixes: touch taps the stage acts on never press the control drawn
// under the finger, the phase-1 digits reveal instead of pausing, the part overview takes the gestures on a short
// screen, the dot holds after +15 s and added prep, the numerals and the arc, the player green on rings and fills,
// focus in the guide/journal/menu, 13 px on every player sheet, screen-reader names, 390 px with a 34 px safe area.
// 1.22.1: the pause screen's captions say where one tap lands, in every state (and the names say the same); the
// arc clock's digits stand on the arc's diameter, a caption under it, at 393, 375, 390 and 375 × 667, and on his phone
// (393 × 852 with a 34 px safe area) in a rep set and a timed hold, both font cases.
// Synthetic data only.
const assert = require('node:assert/strict');
const path = require('node:path');
const { artifacts, engine, fixture: baseFixture, launch, serve, revealRest, openQuit, openCinemaControls } = require('./runtime.cjs');
const parts = 'player-reference', plain = 'player-reference-plain', many = 'player-reference-many', rounds = 'player-reference-rounds';
const GREEN = 'rgb(45, 216, 90)', ON_GREEN = 'rgb(16, 40, 24)';   // --player-accent, --player-on-accent
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
    ] },
    // six sets: five rests to tap on
    [many]: { id: many, name: 'Mnogo serija', tag: 'Teretana', days: [], items: [
      { exId: 'bench-press', measure: 'sets', sets: 6, reps: 8, kg: 60, rest: 60, sides: false, targetRir: 2 }
    ] },
    // 1.22.1: a superset whose last two rounds have one exercise left (Sljedeća/Prethodna move by a set there)
    [rounds]: { id: rounds, name: 'Krugovi', tag: 'Teretana', days: [], items: [
      { exId: 'bench-press', measure: 'sets', sets: 4, reps: 8, kg: 60, rest: 0, sides: false, ss: 'a' },
      { exId: 'db-row', measure: 'sets', sets: 2, reps: 10, kg: 22, rest: 30, sides: false, ss: 'a' }
    ] }
  };
  return data;
}
// an earlier back squat session, for the journal card's "Prethodno" line
function withPrevious(data) {
  data.log = [{ historyId: 'player-reference-previous', kind: 'protocol', refId: parts, name: 'Referentni trening', at: Date.parse('2026-11-02T18:00:00+01:00'), secs: 2400, srpe: 6,
    items: [{ exId: 'back-squat', measure: 'sets', sets: 4, reps: 5, kg: 105, rest: 60, sides: false, done: true, setsDone: 4, repsList: [5, 5, 5, 5], kgList: [105, 105, 105, 105], rirList: [2, 2, 2, 1], sideCounts: [1, 1, 1, 1], setNumbers: [1, 2, 3, 4] }] }];
  return data;
}
// Keyboard focus: Tab until the focus lands inside scope (or on the element matching it); returns the focused
// element's ring colour and whether it is :focus-visible.
async function tabTo(p, scope, pseudo) {
  for (let guard = 0; guard < 12; guard++) {
    await p.keyboard.press('Tab');
    const hit = await p.evaluate(({ scope, pseudo }) => {
      const el = document.activeElement;
      if (!el || !el.closest(scope)) return null;
      return { a: el.dataset.a || el.className, ring: getComputedStyle(el, pseudo || null).outlineColor, visible: el.matches(':focus-visible') };
    }, { scope, pseudo });
    if (hit) return hit;
  }
  assert.fail('Tab never reached ' + scope);
}
// Keyboard focus on one element (after a key press, so the browser treats it as keyboard focus): its ring colour
// (of pseudo when given) and whether it is :focus-visible. WebKit's Tab skips buttons unless a setting is on.
async function ringOf(p, selector, pseudo) {
  await p.keyboard.press('Tab');
  return p.locator(selector).first().evaluate((node, pseudo) => { node.focus(); return { visible: node.matches(':focus-visible'), ring: getComputedStyle(node, pseudo || null).outlineColor }; }, pseudo || null);
}
// every text node inside root at least 13 px
async function smallText(p, root) {
  return p.locator(root).evaluate(node => {
    const small = [], walk = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    while (walk.nextNode()) {
      const el = walk.currentNode.parentElement;
      if (!walk.currentNode.textContent.trim() || !el || !el.getClientRects().length || getComputedStyle(el).visibility === 'hidden') continue;
      if (parseFloat(getComputedStyle(el).fontSize) < 13) small.push(walk.currentNode.textContent.trim().slice(0, 30) + ' ' + getComputedStyle(el).fontSize);
    }
    return small;
  });
}

async function advance(p, seconds) {
  await p.clock.setFixedTime(new Date(await p.evaluate(() => Date.now()) + seconds * 1000));
  await p.waitForTimeout(350);
}
// touch: started the way a phone does it, with nothing focused (a tap focuses no control)
async function start(p, id, data, { touch } = {}) {
  await p.evaluate(() => localStorage.removeItem('mt.play'));
  await p.reload({ waitUntil: 'domcontentloaded' });
  await A(p, 'dataSheet').waitFor();
  await A(p, 'dataSheet').click();
  await p.locator('#importFile').setInputFiles({ name: 'player-reference.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(data)) });
  await A(p, 'restoreApply').click(); await A(p, 'restoreApply').waitFor({ state: 'hidden' });
  await p.getByRole('button', { name: 'Moj pregled', exact: true }).click();
  await A(p, 'dashboardProtocols').click();
  await p.locator('[data-a="openPr"][data-id="' + id + '"]').click();
  if (touch) await A(p, 'startPr').evaluate(node => { document.activeElement?.blur(); node.click(); });
  else await A(p, 'startPr').click();
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
  // the progress bar announces what it shows: the dot's place along the dashes, not the step count
  for (const d of path) assert.ok(Math.abs(d.value - (d.current + d.at) / d.n * 100) <= .51, label + ': aria-valuenow follows the dot ' + JSON.stringify(d));
}

async function firstStartWithParts(p, width) {
  await start(p, parts, fixture({ guideSeen: false }), { touch: true });
  // the guide opens once on the first start; its flag lives in mt.settings (backups carry it)
  const guide = p.locator('.sheet[data-kind="cinemaGuide"]');
  await guide.waitFor();
  assert.equal(await guide.locator('#sheet-h').textContent(), 'Kako koristiti player');
  assert.deepEqual(await guide.locator('li').allInnerTexts(), ['Povuci gore za Dnevnik', 'Povuci desno za natrag', 'Povuci lijevo za naprijed', 'Dodirni sredinu za pauzu'],
    'only the four gestures the player handles');
  assert.equal((await settings(p)).playerGuideSeen, true, 'the seen flag is stored in mt.settings');
  await shot(p, 'guide-first-' + width);
  await A(p, 'cinemaGuideDone').click(); await guide.waitFor({ state: 'detached' });
  assert.equal(await p.evaluate(() => document.activeElement?.dataset.a), 'cinemaMenu', 'closing the first-start guide focuses ⋯ (it reopens from there)');

  // the part overview opens the workout: part name, equipment, the items with the current one marked, a dose line
  // from the workout itself, the big countdown and "+ Dodaj vrijeme za pripremu"
  assert.equal(await stage(p).getAttribute('data-phase'), 'section');
  const overview = p.locator('.cinema-section');
  assert.equal(await overview.locator('#cinema-section-title').textContent(), 'Snaga');
  assert.deepEqual(await overview.locator('.cinema-section-chips span').allTextContents(), ['Šipka']);
  assert.equal(await overview.locator('.cinema-section-chips').getAttribute('role'), 'group', 'the "Oprema" label sits on a group');
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

  // work: no "Slijedi" card, "RIR 2" in the pill (1.22.0: "Cilj RIR 2" only in its name and the journal), one dash per exercise and the dot inside the first one
  await until(p, (s, st) => st.kind === 'manual', 'the first set');
  assert.equal(await stage(p).getAttribute('data-phase'), 'work');
  assert.equal(await p.locator('.workout-cinema .cinema-next, .workout-cinema .workout-cinema-next').count(), 0, 'no next-set card during work');
  assert.doesNotMatch(await stage(p).innerText(), /Slijedi/);
  assert.equal(await p.locator('.workout-cinema-heading p').innerText(), 'Serija 1 od 2');
  assert.equal(await p.locator('.cinema-work-journal .cinema-effort').innerText(), '· RIR 2');   // 1.22.0: short in the pill, as in the mockup, so names fit
  assert.match(await p.locator('.cinema-work-journal').getAttribute('aria-label'), /^Dnevnik treninga · \S.* · Cilj RIR 2 · 1 od 2$/, 'the pill\'s name includes the target and the set');
  // with a target the set count gets its own divider
  assert.equal(await p.locator('.cinema-work-journal>span').evaluate(node => getComputedStyle(node).borderLeftWidth), '1px');
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
  // a tap on the phase-1 digits themselves reveals too (they were a pause button)
  const digits = await p.locator('.workout-cinema .cinema-rest-stack #ringN').boundingBox();
  await p.mouse.click(digits.x + digits.width / 2, digits.y + digits.height / 2);
  await p.locator('.workout-cinema.is-rest-2').waitFor();
  assert.equal((await player(p)).clock.paused, false, 'the tap shows phase 2 without pausing');
  assert.equal(await p.locator('.workout-cinema .cinema-pause-layer').count(), 0);
  // phase 2: the reserve row above −ODMOR+, the next set's card, the target outlined, a tap filled green
  const row = reserve(p);
  await row.waitFor();
  assert.match(await row.innerText(), /^Koliko si još mogao\? · serija 1\n/);
  const pills = row.locator('.rirb button');
  assert.deepEqual(await pills.allInnerTexts(), ['0', '1', '2', '3', '4–5', '6+']);
  assert.match(await pills.nth(2).getAttribute('class'), /\btg\b/, 'the target RIR 2 is outlined');
  assert.equal(await pills.nth(2).evaluate(node => getComputedStyle(node).borderTopColor), GREEN, 'in the player green');
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
  // +15 s and added prep time lengthen the rest; the dot holds its place, it never slides back
  await advance(p, 20);
  path.push(await dashes(p));
  await p.locator('.workout-cinema [data-a="cinemaRest"][data-d="15"]').click();
  d = await dashes(p); assert.ok(d.at >= path.at(-1).at - 1e-6, '+15 s: ' + JSON.stringify([path.at(-1), d])); path.push(d);
  await openCinemaControls(p); await A(p, 'cinemaPrep').click();
  await p.locator('[data-a="cinemaPrepPick"][data-v="10"]').click(); await A(p, 'cinemaPrepApply').click();
  await p.locator('.workout-cinema .cinema-prep-editor').waitFor({ state: 'detached' });
  d = await dashes(p); assert.ok(d.at >= path.at(-1).at - 1e-6, 'added prep: ' + JSON.stringify([path.at(-1), d])); path.push(d);

  // the journal: the current exercise is an open card, the others collapsed rows of set circles
  await A(p, 'cinemaJournal').first().click();
  await journal(p).waitFor();
  assert.equal(await p.evaluate(() => document.activeElement?.id), 'sheet-h', 'the journal title takes focus');
  const rows = journal(p).locator('.cj-row');
  assert.equal(await rows.count(), 3, 'three collapsed exercises');
  assert.deepEqual(await rows.evaluateAll(list => list.map(node => node.querySelectorAll('.cj-sets>span').length)), [2, 2, 2], 'one circle per set');
  const card = journal(p).locator('.cj-card[data-index="0"]');
  assert.equal(await journal(p).locator('.cj-card').count(), 1, 'one open card');
  assert.equal(await card.locator('.workout-set-row').count(), 2);
  assert.match(await card.innerText(), /Cilj RIR 2/);
  // a screen reader hears the card's lines too: they describe its open button (whose label is the name)
  const described = await card.locator('.cj-open').evaluate(node => (node.getAttribute('aria-describedby') || '').split(' ').filter(Boolean).map(id => document.getElementById(id)?.textContent || '?').join(' | '));
  assert.match(described, /Još nema prethodne izvedbe\. \| .*Cilj RIR 2/);
  assert.equal(await card.locator('[data-a="cinemaGoSet"]').count(), 0, 'no "Prijeđi na vježbu" on the current exercise');
  // the totals: "8 pon. · 1 040 kg" with a narrow no-break space, never "kg × pon."
  const totals = await journal(p).locator('.cinema-journal-footer small').textContent();
  assert.equal(totals, '8 pon. · 1 040 kg');
  assert.doesNotMatch(await journal(p).locator('.cinema-journal-footer').innerText(), /×/);
  // 1.22.0: one percent on screen: the top bar and the footer both count finished sets
  const footerPercent = (await journal(p).locator('.cinema-journal-footer strong').textContent()).match(/^(\d+)\s% odrađeno$/)?.[1];
  assert.ok(footerPercent && footerPercent !== '0', 'the footer shows the finished share');
  assert.equal(await p.locator('#cinema-percent').textContent(), footerPercent + '%', 'the top bar shows the same percent as the journal footer');
  assert.equal(await journal(p).locator('.cj-plan').getAttribute('aria-label'), 'Dijelovi treninga');
  await noOverflow(p, 'journal ' + width);
  await shot(p, 'journal-' + width);
  // the equipment menu after a finished set: every choice disabled, the reason shown. Opened by keyboard, focus
  // goes to its first choice; Escape closes only the menu and gives focus back to the chip.
  const chip0 = card.locator('[data-a="cinemaEquipment"][data-j="0"]').first();
  await chip0.focus(); await p.keyboard.press('Enter');
  const locked = journal(p).locator('#cj-menu-0');
  await locked.waitFor();
  assert.equal(await p.evaluate(() => document.activeElement === document.querySelector('#cj-menu-0 button')), true, 'focus on the menu\'s first choice');
  assert.ok((await locked.locator('[data-a="cinemaEquipmentPick"]').evaluateAll(list => list.map(node => node.disabled))).every(Boolean));
  assert.match(await locked.innerText(), /Oprema se mijenja prije prve serije\./);
  await p.keyboard.press('Escape'); await locked.waitFor({ state: 'detached' });
  assert.equal(await journal(p).count(), 1, 'Escape closes only the menu');
  assert.equal(await chip0.evaluate(node => node === document.activeElement), true, 'Escape gives focus back to the chip');
  // the menu does not survive closing the journal
  await chip0.click(); await locked.waitFor();
  await A(p, 'cinemaJournalClose').first().click(); await journal(p).waitFor({ state: 'detached' });
  await A(p, 'cinemaJournal').first().click(); await journal(p).waitFor();
  assert.equal(await journal(p).locator('.cj-menu').count(), 0, 'the journal reopens with its equipment menu shut');
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
  // a thumbnail opens the preview; its "Zamijeni ovom vježbom" is the player green with dark text, not app blue
  await swap(p).locator('.workout-swap-row .workout-swap-photo').first().click();
  const replace = swap(p).locator('.workout-swap-footer .btn');
  await replace.waitFor();
  assert.deepEqual(await replace.evaluate(node => [getComputedStyle(node).backgroundColor, getComputedStyle(node).color]), [GREEN, ON_GREEN]);
  await A(p, 'workoutSwapBack').click(); await replace.waitFor({ state: 'detached' });
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
  // a screen reader hears that the exercise was swapped: in the card's name and the collapsed row's (the badge is decoration)
  assert.match(await journal(p).locator('.cj-card[data-index="1"] .cj-open').getAttribute('aria-label'), / · zamijenjena$/);
  assert.equal(await journal(p).locator('.cj-card[data-index="1"] .cj-badge').getAttribute('aria-hidden'), 'true');
  await journal(p).locator('.cj-card[data-index="1"] .cj-collapse').click();
  assert.match(await journal(p).locator('.cj-row[data-j="1"]').getAttribute('aria-label'), /^Prikaži serije · .+ · zamijenjena$/);
  await journal(p).locator('.cj-row[data-j="1"]').click();
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
  const doses = await p.locator('.cinema-section-items li small').allTextContents();
  assert.equal(doses[1], '5 pon.', 'no weight for nordic curl (kg 0): ' + doses);
  assert.ok(doses.every(text => !/(^|\s)0 kg/.test(text)), 'never "0 kg": ' + doses);
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

// The figures' rule (item 10). Where the system font has no width axis (Linux in CI, for one), the app adds
// .no-font-width and narrows the figures with scaleX instead; the test accepts whichever the font allows.
async function assertNumerals(p, sel) {
  const got = await p.locator(sel).evaluate(node => {
    const cs = getComputedStyle(node);
    return { axis: !document.documentElement.classList.contains('no-font-width'), stretch: cs.fontStretch, weight: cs.fontWeight, transform: cs.transform,
      narrowed: getComputedStyle(node.closest('.cinema-session') || node).transform };
  });
  if (got.axis) assert.deepEqual([got.stretch, got.weight, got.transform], ['40%', '900', 'none'], sel + ': ' + JSON.stringify(got));
  else assert.ok(got.stretch === '100%' && got.weight === '900' && got.narrowed !== 'none', sel + ' (no width axis): ' + JSON.stringify(got));
  return got.axis;
}

// 1.22.1 (item 3): the work clock's digits stand on the arc's diameter (the svg's bottom edge: the line of its two flat
// end bars) with room above them, a caption ("pauza", "odrađena") goes under the diameter and clear of the bottom
// pill, and the side labels end on the same line. Measured on the INK (pixels) of the digits and the caption, in
// the platform's font case and, where the system font has a width axis, again with .no-font-width forced.
async function inkOf(p, sel) {
  await p.evaluate(sel => {
    const style = document.createElement('style'); style.id = 'ink-probe';
    style.textContent = '.workout-cinema-bottom *,.workout-cinema-media,.cinema-pause-layer{visibility:hidden!important}' + sel + ',' + sel + ' *{visibility:visible!important}.workout-cinema-metrics{opacity:1!important}';
    document.head.appendChild(style);
  }, sel);
  const box = await p.locator(sel).first().boundingBox(), view = p.viewportSize();
  const clip = { x: Math.max(0, Math.floor(box.x - 24)), y: Math.max(0, Math.floor(box.y - 24)) };
  Object.assign(clip, { width: Math.min(view.width - clip.x, Math.ceil(box.width + 48)), height: Math.min(view.height - clip.y, Math.ceil(box.height + 48)) });
  const png = await p.screenshot({ clip });
  await p.evaluate(() => document.getElementById('ink-probe').remove());
  const ink = await p.evaluate(async b64 => {
    const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
    const canvas = document.createElement('canvas'); canvas.width = img.width; canvas.height = img.height;
    const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0);
    const d = ctx.getImageData(0, 0, img.width, img.height).data;
    let x0 = Infinity, y0 = Infinity, x1 = -1, y1 = -1;
    for (let y = 0; y < img.height; y++) for (let x = 0; x < img.width; x++) {
      const k = (y * img.width + x) * 4;
      if (Math.max(d[k], d[k + 1], d[k + 2]) > 140) { x0 = Math.min(x0, x); x1 = Math.max(x1, x + 1); y0 = Math.min(y0, y); y1 = Math.max(y1, y + 1); }
    }
    return x1 < 0 ? null : { x0, y0, x1, y1, width: img.width };
  }, png.toString('base64'));
  assert.ok(ink, 'ink found for ' + sel);
  const scale = ink.width / clip.width;
  return { left: clip.x + ink.x0 / scale, right: clip.x + ink.x1 / scale, top: clip.y + ink.y0 / scale, bottom: clip.y + ink.y1 / scale };
}
async function arcFit(p, label, { digits = true } = {}) {
  const cases = [];
  const platformNarrowed = await p.evaluate(() => document.documentElement.classList.contains('no-font-width'));
  for (const forced of platformNarrowed ? [false] : [false, true]) {
    if (forced) await p.evaluate(() => document.documentElement.classList.add('no-font-width'));
    const dom = await p.evaluate(() => {
      const rect = node => node && node.getBoundingClientRect().toJSON();
      const clock = document.querySelector('.workout-cinema-clock');
      return { arc: rect(clock.querySelector('.cinema-clock-arc')), caption: rect(clock.querySelector('.workout-control-action')), pill: rect(document.querySelector('.workout-cinema-journal>*')),
        labels: [...document.querySelectorAll('.workout-cinema-metrics .cinema-metric-label')].map(rect) };
    });
    const scale = dom.arc.width / 176, diameter = dom.arc.top + 88 * scale, rIn = 74.4 * scale, cx = dom.arc.left + dom.arc.width / 2;
    const n = await inkOf(p, '.workout-cinema-clock .n');
    const fit = { label: label + (forced || platformNarrowed ? ' (no width axis)' : ''), diameter, rIn,
      bottom: diameter - n.bottom, top: n.top - (diameter - rIn), corner: rIn - Math.max(Math.hypot(n.left - cx, n.top - diameter), Math.hypot(n.right - cx, n.top - diameter)) };
    if (digits) {
      assert.ok(Math.abs(fit.bottom) <= 2, 'the digits stand on the diameter · ' + JSON.stringify(fit));
      assert.ok(fit.top >= .35 * rIn, 'room between the digits and the arc above them · ' + JSON.stringify(fit));
    }
    assert.ok(fit.corner >= 8 && n.left >= cx - rIn && n.right <= cx + rIn, 'the digits keep clear of the arc · ' + JSON.stringify(fit));
    if (dom.caption) {
      const c = await inkOf(p, '.workout-cinema-clock .workout-control-action');
      Object.assign(fit, { captionTop: c.top - diameter, captionToPill: dom.pill.top - c.bottom });
      assert.ok(fit.captionTop >= 1 && fit.captionToPill >= 4, 'the caption sits under the diameter, clear of the pill · ' + JSON.stringify(fit));
    }
    for (const box of dom.labels) assert.ok(box.bottom >= diameter && box.bottom <= diameter + 6, 'the side labels end on the diameter\'s line · ' + JSON.stringify({ fit, box }));
    if (forced) await p.evaluate(() => document.documentElement.classList.remove('no-font-width'));
    cases.push(fit);
  }
  await noOverflow(p, label);
  return cases;
}
async function arcFitPaused(p, label) {
  await p.locator('.workout-cinema-clock').click(); await p.locator('.workout-cinema .cinema-pause-layer').waitFor();
  assert.equal(await p.locator('.workout-cinema-clock .workout-control-action').textContent(), 'pauza');
  const fit = await arcFit(p, label + ', paused');
  await A(p, 'cinemaResume').click(); await p.locator('.workout-cinema .cinema-pause-layer').waitFor({ state: 'detached' });
  return fit;
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
  // the numerals (item 10): the system font in its compressed width, 900, no transform
  for (const sel of ['.workout-cinema #ringN', '#cinema-percent']) await assertNumerals(p, sel);
  const prepShade = await p.locator('.workout-cinema-media').evaluate(node => getComputedStyle(node, '::after').backgroundImage);
  // the guide from the ⋯ menu, any time; its NASTAVI takes the green focus ring
  await A(p, 'cinemaMenu').click();
  await A(p, 'cinemaGuide').click();
  const guide = p.locator('.sheet[data-kind="cinemaGuide"]');
  await guide.waitFor();
  assert.equal(await guide.locator('li').count(), 4);
  const guideRing = await tabTo(p, '.cinema-guide-go');
  assert.ok(guideRing.visible && guideRing.ring === GREEN, 'the guide\'s focus ring is green: ' + JSON.stringify(guideRing));
  await p.keyboard.press('Escape'); await guide.waitFor({ state: 'detached' });
  // "Upis rezerve: samo zadnja serija vježbe": nothing after set 1, the row in the pause before the next exercise
  await until(p, (s, st) => st.kind === 'manual', 'set 1');
  assert.equal(await p.locator('.workout-cinema .cinema-next').count(), 0, 'no next-set card during work');
  assert.doesNotMatch(await stage(p).innerText(), /Slijedi/);
  // prep has the work screen's upper shade over the photo (the set label sits in it); the arc is 31 bars
  assert.equal(await p.locator('.workout-cinema-media').evaluate(node => getComputedStyle(node, '::after').backgroundImage), prepShade);
  assert.equal(await p.locator('.cinema-clock-arc path').first().evaluate(node => (node.getAttribute('d').match(/M/g) || []).length), 31, 'a half circle of 31 bars');
  await assertNumerals(p, '.workout-cinema-clock #ringN');
  // without a width axis (.no-font-width) the figures are narrowed again and stay inside the arc
  const fallback = await p.evaluate(() => {
    const had = document.documentElement.classList.contains('no-font-width');
    document.documentElement.classList.add('no-font-width');
    const n = document.querySelector('.workout-cinema-clock #ringN'), arc = document.querySelector('.cinema-clock-arc').getBoundingClientRect(), box = n.getBoundingClientRect();
    const out = { transform: getComputedStyle(n).transform, inside: box.left >= arc.left - .5 && box.right <= arc.right + .5, box: [box.left, box.right], arc: [arc.left, arc.right] };
    if (!had) document.documentElement.classList.remove('no-font-width');
    return out;
  });
  assert.ok(fallback.transform !== 'none' && fallback.inside, 'fallback numerals: ' + JSON.stringify(fallback));
  // 1.22.1: the digits on the diameter, the paused clock's caption under it (the digits keep their size and place)
  const [running] = await arcFit(p, 'rep set ' + width);
  const [paused] = await arcFitPaused(p, 'rep set ' + width);
  assert.ok(Math.abs(paused.top - running.top) <= 1 && Math.abs(paused.bottom - running.bottom) <= 1, 'pausing does not move the digits: ' + JSON.stringify({ running, paused }));
  // the keyboard ring inside the player is green (not the old teal)
  const stageRing = await ringOf(p, '.workout-cinema [data-a="cinemaMenu"]');
  assert.ok(stageRing.visible && stageRing.ring === GREEN, 'player focus ring: ' + JSON.stringify(stageRing));
  await p.evaluate(() => document.activeElement?.blur());
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
  // db-row has no target: no "Cilj RIR" in the pill (nor a divider before the count) or in its journal card
  await until(p, (s, st) => st.kind === 'manual' && st.g === 1, 'a db-row set');
  assert.equal(await p.locator('.cinema-work-journal .cinema-effort').count(), 0, 'no target in the pill');
  assert.doesNotMatch(await p.locator('.cinema-work-journal').getAttribute('aria-label'), /Cilj/);
  assert.equal(await p.locator('.cinema-work-journal>span').evaluate(node => getComputedStyle(node).borderLeftWidth), '0px');
  await A(p, 'cinemaJournal').first().click(); await journal(p).waitFor();
  assert.equal(await journal(p).locator('.cj-card[data-index="1"] .cj-effort').count(), 0, 'no target in the journal card');
  // the journal sheet's drag handle takes the green ring too
  const handleRing = await ringOf(p, '.sheet[data-kind="cinemaJournal"] .sheet-drag-handle', '::after');
  assert.ok(handleRing.visible && handleRing.ring === GREEN, 'journal handle ring: ' + JSON.stringify(handleRing));
  // Uredi (Doziranje): no text under 13 px, and the "Automatski" placeholder fits its field
  await journal(p).locator('.cj-card[data-index="1"] [data-a="playDoseEdit"]').click();
  const dose = p.locator('.sheet[data-kind="playDose"]');
  await dose.waitFor();
  assert.deepEqual(await smallText(p, '.sheet[data-kind="playDose"]'), [], 'Doziranje text at least 13 px');
  const placeholder = await dose.locator('.play-dose-rep-timer input').evaluate(node => {
    const cs = getComputedStyle(node), ctx = document.createElement('canvas').getContext('2d');
    ctx.font = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
    return { text: node.placeholder, width: ctx.measureText(node.placeholder).width, room: node.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) };
  });
  assert.ok(placeholder.width <= placeholder.room + .5, 'the placeholder fits: ' + JSON.stringify(placeholder));
  await A(p, 'playDoseCancel').click(); await dose.waitFor({ state: 'detached' });
  if (await journal(p).count()) { await A(p, 'cinemaJournalClose').first().click(); await journal(p).waitFor({ state: 'detached' }); }
  // ⋯ → Postavke treninga: no text under 13 px ("Vrijeme za pripremu" was 12 px)
  await openCinemaControls(p);
  assert.deepEqual(await smallText(p, '.sheet[data-kind="cinemaPlayback"]'), [], 'Postavke treninga text at least 13 px');
  for (let guard = 0; guard < 3 && await p.locator('.sheet').count(); guard++) { await p.keyboard.press('Escape'); await p.waitForTimeout(200); }
  await until(p, s => s.done, 'the end');
  assert.equal(await p.locator('.rirlast .rir').count(), 2);
  await A(p, 'finishPlay').click();
  return { noOverviewWithoutParts: true, guideFromMenu: true, lastSetMode: true, endMode: true, goToExercise: true };
}

// 375 px, and 390 px with a 34 px safe area: the same screens without horizontal overflow
// 1.22.1 (item 1): Prethodna / Sljedeća / Ponovi react to one tap; their small captions say what that tap does, true in
// the state shown, and each button's name is the same words. Taps land where the words say. The words are said from the
// exercise on screen: a rest or a preparation shows the set that comes next, so a tap that starts it is "Preskoči".
const pauseLayer = p => p.locator('.workout-cinema .cinema-pause-layer');
async function pauseWords(p) {
  await revealRest(p);
  if (!(await pauseLayer(p).count())) { await p.locator('.workout-cinema #ring').click(); await pauseLayer(p).waitFor(); }
  return pauseLayer(p).evaluate(layer => {
    const jump = d => { const b = layer.querySelector('[data-a="cinemaPauseJump"][data-d="' + d + '"]'); return [b.querySelector('strong').textContent, b.querySelector('small').textContent, b.getAttribute('aria-label')]; };
    const replay = layer.querySelector('[data-a="cinemaReplay"]');
    return { back: jump(-1), next: jump(1), replay: replay && [replay.querySelector('small').textContent, replay.getAttribute('aria-label')] };
  });
}
const words = (back, next, replay) => ({ back: [...back, back.join(' ')], next: [...next, next.join(' ')], replay: replay && [replay, 'Ponovi ' + replay] });
async function resume(p) { await A(p, 'cinemaResume').click(); await pauseLayer(p).waitFor({ state: 'detached' }); }
async function tapJump(p, d) { await p.locator('.workout-cinema [data-a="cinemaPauseJump"][data-d="' + d + '"]').click(); await p.waitForTimeout(200); return player(p); }
async function pauseCaptions(p) {
  await start(p, parts, fixture({ entry: 2 }));
  // the first preparation (the part overview): back starts it again, as Ponovi does
  await p.locator('.workout-cinema[data-phase="section"]').waitFor();
  assert.deepEqual(await pauseWords(p), words(['Početak', 'treninga'], ['Preskoči', 'pripremu'], 'pripremu od početka'), 'the first preparation');
  await resume(p);
  await until(p, (s, st) => st.kind === 'manual' && st.g === 0 && st.set === 1, 'squat set 1');
  assert.deepEqual(await pauseWords(p), words(['Početak', 'treninga'], ['Sljedeća', 'vježba'], 'seriju od početka'), 'squat set 1');
  assert.doesNotMatch(await pauseLayer(p).innerText(), /Povuci|Dvostruki dodir/, 'no caption names a gesture');
  await resume(p);
  await markDone(p);
  // the screen shows set 2; back goes to set 1, the exercise's start, as from set 2 itself
  assert.deepEqual(await pauseWords(p), words(['Početak', 'vježbe'], ['Sljedeća', 'vježba'], 'odmor od početka'), 'the rest after set 1');
  await resume(p);
  await until(p, (s, st) => st.kind === 'manual' && st.g === 0 && st.set === 2, 'squat set 2');
  assert.deepEqual(await pauseWords(p), words(['Početak', 'vježbe'], ['Sljedeća', 'vježba'], 'seriju od početka'), 'squat set 2');
  // ⋯ Postavke treninga: its arrows run the same jump and carry the same names
  await resume(p);
  await openCinemaControls(p);
  assert.deepEqual(await p.locator('.sheet [data-a="jump"]').evaluateAll(nodes => nodes.map(node => node.getAttribute('aria-label'))), ['Početak vježbe', 'Sljedeća vježba']);
  for (let guard = 0; guard < 3 && await p.locator('.sheet').count(); guard++) { await p.keyboard.press('Escape'); await p.waitForTimeout(200); }
  // the taps: "Početak vježbe" → set 1 (recorded, so no Ponovi), still paused; then "Sljedeća vježba" → the superset
  await pauseWords(p);
  let state = await tapJump(p, -1);
  assert.deepEqual([step(state).g, step(state).set, step(state).kind, state.clock.paused], [0, 1, 'manual', true], 'back lands on set 1, paused');
  assert.deepEqual(await pauseWords(p), words(['Početak', 'treninga'], ['Sljedeća', 'vježba'], null), 'a recorded set 1');
  assert.equal(await p.locator('.workout-cinema-clock .workout-control-action').textContent(), 'odrađena');
  await arcFit(p, 'a recorded set', { digits: false });   // the ✓ is a symbol, not a figure on the baseline
  state = await tapJump(p, 1);
  assert.deepEqual([step(state).g, step(state).set, step(state).side, state.clock.paused], [1, 1, 'Lijeva strana', true], 'next lands on the Bulgarian split squat');
  // a set played as two sides: Ponovi starts the side again; inside the set, back is the set's start
  assert.deepEqual(await pauseWords(p), words(['Prethodna', 'vježba'], ['Sljedeća', 'vježba'], 'stranu od početka'), 'left side');
  await resume(p); await markDone(p);
  assert.equal(step(await player(p)).kind, 'switch');
  assert.deepEqual(await pauseWords(p), words(['Početak', 'serije'], ['Sljedeća', 'vježba'], 'promjenu strane'), 'the side change');
  await resume(p);
  await until(p, (s, st) => st.kind === 'manual' && st.side === 'Desna strana', 'right side');
  assert.deepEqual(await pauseWords(p), words(['Početak', 'serije'], ['Sljedeća', 'vježba'], 'stranu od početka'), 'right side');
  await resume(p); await markDone(p);
  assert.deepEqual(await pauseWords(p), words(['Prethodna', 'vježba'], ['Sljedeća', 'vježba'], 'seriju od početka'), 'Nordic curl, round 1');
  await resume(p); await markDone(p);
  // the round's rest shows the Bulgarian split squat's round 2: on skips the rest into it, back is the Nordic curl
  assert.deepEqual(await pauseWords(p), words(['Prethodna', 'vježba'], ['Preskoči', 'odmor'], 'odmor od početka'), 'the round\'s rest');
  state = await tapJump(p, 1);
  assert.deepEqual([step(state).g, step(state).set, step(state).side, state.clock.paused], [1, 2, 'Lijeva strana', true], '"Preskoči odmor" starts the set on screen');
  await resume(p);
  // the pause before the next part is shown as "Priprema"
  await until(p, (s, st) => st.kind === 'rest' && st.trans, 'the pause before Trup');
  assert.deepEqual(await pauseWords(p), words(['Prethodna', 'vježba'], ['Preskoči', 'pripremu'], 'pripremu od početka'), 'the pause before Trup');
  state = await tapJump(p, 1);
  const hold = state.liveSchedule.slice(state.i).find(x => x.kind === 'work' || x.kind === 'manual');
  assert.deepEqual([hold.g, hold.set, state.liveSchedule.slice(state.i, state.liveSchedule.indexOf(hold)).every(x => x.g === 3)], [3, 1, true], '"Preskoči pripremu" starts the side plank on screen');
  await resume(p);
  // the last set of the workout: next is the end
  await until(p, (s, st) => st.kind === 'work' && st.g === 3 && st.set === 2, 'side plank set 2');
  await arcFit(p, 'a timed hold');
  await arcFitPaused(p, 'a timed hold');
  assert.deepEqual(await pauseWords(p), words(['Početak', 'vježbe'], ['Kraj', 'treninga'], 'seriju od početka'), 'the last set');
  state = await tapJump(p, 1);
  assert.equal(state.done, true, '"Kraj treninga" ends the workout');
  // a superset round with one exercise left moves by a set
  await start(p, rounds, fixture({ entry: 2 }));
  await until(p, (s, st) => st.kind === 'manual' && st.g === 0 && st.set === 3, 'bench round 3');
  assert.deepEqual(await pauseWords(p), words(['Prethodna', 'vježba'], ['Sljedeća', 'serija'], 'seriju od početka'), 'bench round 3');
  await resume(p); await markDone(p);
  // the screen shows round 4: on skips the rest into it, back is round 3
  assert.deepEqual(await pauseWords(p), words(['Prethodna', 'serija'], ['Preskoči', 'odmor'], 'odmor od početka'), 'the rest after round 3');
  await resume(p);
  await until(p, (s, st) => st.kind === 'manual' && st.set === 4, 'bench round 4');
  assert.deepEqual(await pauseWords(p), words(['Prethodna', 'serija'], ['Kraj', 'treninga'], 'seriju od početka'), 'bench round 4');
  state = await tapJump(p, -1);
  assert.deepEqual([step(state).g, step(state).set], [0, 3], '"Prethodna serija" lands on round 3');
  await resume(p);
  await quit(p);
  return { pauseCaptions: true };
}

async function narrow(p, width) {
  await start(p, parts, withPrevious(fixture({ entry: 0 })));
  await p.locator('.workout-cinema[data-phase="section"]').waitFor();
  await noOverflow(p, 'part overview ' + width);
  await until(p, (s, st) => st.kind === 'manual', 'set 1');
  await noOverflow(p, 'work ' + width);
  const d = await dashes(p); assert.ok(d.inside, JSON.stringify(d));
  await arcFit(p, 'rep set ' + width); await arcFitPaused(p, 'rep set ' + width);
  await shot(p, 'work-' + width);
  await markDone(p); await revealRest(p); await reserve(p).waitFor();
  await noOverflow(p, 'rest phase 2 ' + width);
  await A(p, 'cinemaJournal').first().click(); await journal(p).waitFor();
  await noOverflow(p, 'journal ' + width);
  // the "Prethodno" line keeps its last number and unit together, so "pon." never wraps onto a line of its own
  assert.equal(await journal(p).locator('.cj-card[data-index="0"] .cj-meta').first().textContent(), 'Prethodno 105 kg · 5 / 5 / 5 / 5\u00a0pon.');
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

// Touch (375×667). A tap the stage acts on redraws the player inside pointerup; the click the browser then fires
// must not press the control drawn under the finger: rest phase 1 → phase 2 (reserve pill, +15 s, the clock, the
// next set's +) and work → the pause screen (Nastavi, Prethodna). revealRest's mouse click cannot show this.
// On this short screen the part overview with two reserve rows leaves the stage a strip: the overview takes the
// stage's gestures too.
async function touch(p, width) {
  await start(p, many, fixture());
  await until(p, (s, st) => st.kind === 'manual', 'set 1');
  await arcFit(p, 'rep set, short screen ' + width); await arcFitPaused(p, 'rep set, short screen ' + width);
  let box = await p.locator('.workout-cinema-stage').boundingBox();
  for (const [label, x] of [['centre', .5], ['left', .2]]) {
    const before = await player(p);
    await p.touchscreen.tap(box.x + box.width * x, box.y + box.height / 2); await p.waitForTimeout(450);
    const after = await player(p);
    assert.equal(after.clock.paused, true, 'a tap on the ' + label + ' pauses and the pause screen\'s button under the finger stays untouched');
    assert.equal(after.i, before.i, 'no jump (' + label + ')');
    await p.locator('.workout-cinema .cinema-pause-layer').waitFor();
    await A(p, 'cinemaResume').click(); await p.locator('.workout-cinema .cinema-pause-layer').waitFor({ state: 'detached' });
  }
  // the first rest: learn where phase 2 puts its controls
  await markDone(p);
  await p.locator('.workout-cinema.is-rest-1').waitFor();
  const phase1 = await p.locator('.workout-cinema-stage').boundingBox();
  await revealRest(p);
  const spots = await p.evaluate(() => {
    const at = sel => { const b = document.querySelector(sel)?.getBoundingClientRect(); return b && b.width ? { x: b.x + b.width / 2, y: b.y + b.height / 2 } : null; };
    return { pill: at('.workout-cinema-reserve .rirb button:nth-child(4)'), plus: at('.workout-cinema [data-a="cinemaRest"][data-d="15"]'),
      clock: at('.workout-cinema .cinema-big-clock'), next: at('.workout-cinema .cinema-next-side [data-a="playDoseEdit"]') };
  });
  const tested = [];
  for (const [label, spot] of Object.entries(spots)) {
    if (!spot || spot.y < phase1.y || spot.y > phase1.y + phase1.height) continue;   // only where phase 1 shows the stage
    await until(p, (s, st) => st.kind === 'manual', 'the next set');
    await markDone(p);
    await p.locator('.workout-cinema.is-rest-1').waitFor();
    assert.equal(await p.evaluate(({ x, y }) => !!document.elementFromPoint(x, y)?.closest('button'), spot), false, label + ': phase 1 has no control there');
    const before = await player(p);
    await p.touchscreen.tap(spot.x, spot.y); await p.waitForTimeout(450);
    const after = await player(p);
    assert.equal(await p.locator('.workout-cinema.is-rest-2').count(), 1, label + ': the tap shows phase 2');
    assert.equal(after.clock.paused, false, label + ': not paused');
    assert.equal(await p.locator('.sheet').count(), 0, label + ': no sheet opened');
    assert.deepEqual(after.rir || {}, before.rir || {}, label + ': no reserve stored');
    assert.equal(after.liveSchedule[after.i].dur, before.liveSchedule[before.i].dur, label + ': the rest is not lengthened');
    tested.push(label);
  }
  assert.ok(tested.includes('pill') && tested.includes('clock'), 'the reserve pill and the clock lie in the phase-1 stage: ' + JSON.stringify({ phase1, spots }));
  await quit(p);
  // the part overview before "Trup" over the superset's two reserve rows: tap, swipe up and swipe left start on it
  await start(p, parts, fixture({ entry: 0 }));
  await until(p, (s, st) => st.kind === 'rest' && st.trans && s.liveSchedule.slice(s.i).find(x => x.kind === 'work' || x.kind === 'manual')?.g === 3, 'the pause before Trup');
  await p.locator('.workout-cinema[data-phase="section"]').waitFor();
  assert.equal(await p.locator('#cinema-section-title').textContent(), 'Trup');
  assert.equal(await reserve(p).locator('.rirb').count(), 2, 'the superset\'s two reserve rows');
  const title = await p.locator('#cinema-section-title').boundingBox(), overview = await p.locator('.workout-cinema-overview').boundingBox();
  box = await p.locator('.workout-cinema-stage').boundingBox();
  const x = title.x + 30, y = title.y + title.height / 2;
  assert.ok(y < box.y, 'the gestures start above the stage, on the overview');
  const drag = async (dx, dy, startY = y) => { await p.mouse.move(x, startY); await p.mouse.down(); await p.mouse.move(x + dx, startY + dy, { steps: 6 }); await p.mouse.up(); await p.waitForTimeout(300); };
  await drag(0, 0);
  assert.equal((await player(p)).clock.paused, true, 'a tap on the overview pauses');
  await A(p, 'cinemaResume').click(); await p.locator('.workout-cinema .cinema-pause-layer').waitFor({ state: 'detached' });
  const lowY = Math.min(overview.y + overview.height - 6, box.y - 2);
  await drag(0, -70, lowY);
  await journal(p).waitFor();
  await A(p, 'cinemaJournalClose').first().click(); await journal(p).waitFor({ state: 'detached' });
  const i = (await player(p)).i;
  await p.mouse.move(overview.x + overview.width - 30, y); await p.mouse.down(); await p.mouse.move(overview.x + overview.width - 150, y, { steps: 6 }); await p.mouse.up(); await p.waitForTimeout(300);
  assert.ok((await player(p)).i > i, 'a swipe left on the overview goes forward');
  await quit(p);
  return { width, ghostClicks: tested, overviewGestures: true };
}

// 1.22.1: his phone (393 × 852, 34 px safe area): the digits on the diameter and the caption clear of the pill, in a
// rep set and in a timed hold, running and paused, both font cases
async function phone(p, width) {
  await start(p, parts, fixture({ entry: 0 }));
  await until(p, (s, st) => st.kind === 'manual', 'set 1');
  const cases = [...await arcFit(p, 'rep set ' + width + ', 34 px safe area'), ...await arcFitPaused(p, 'rep set ' + width + ', 34 px safe area')];
  await until(p, (s, st) => st.kind === 'work' && st.g === 3, 'side plank set 1');
  cases.push(...await arcFit(p, 'a timed hold ' + width + ', 34 px safe area'), ...await arcFitPaused(p, 'a timed hold ' + width + ', 34 px safe area'));
  await shot(p, 'hold-' + width + '-safe-area');
  await quit(p);
  return { width, arc: cases.map(fit => ({ label: fit.label, bottom: +fit.bottom.toFixed(1), top: +fit.top.toFixed(1), captionToPill: fit.captionToPill && +fit.captionToPill.toFixed(1) })) };
}

// 1.22.1: paused on a preparation ("Priprema") or a side change ("Promjena strane"), the pause buttons and their
// captions never sit on the dimmed phase word, also on short screens and with a 34 px safe area. Ponovi's button is as
// wide as its caption, with the icon centred over it: the side change's caption is no wider than the preparation's
// ("promjenu strane od početka" pushed the icon about 23 px further right than any other state).
async function pauseClear(p, width) {
  const cases = [];
  for (const [label, protocol, predicate] of [['the preparation', plain, (s, st) => st.kind === 'prep'],
    ['the side change', parts, (s, st) => st.kind === 'switch' && !st.go && !st.nextEx]]) {
    await start(p, protocol, fixture({ entry: 0 }));
    await until(p, predicate, label);
    await pauseWords(p);
    const fit = await p.evaluate(() => {
      const word = document.querySelector('.workout-cinema .cinema-prep-entry .cinema-phase-word');
      const range = document.createRange(); if (word) range.selectNodeContents(word);
      const ink = word && getComputedStyle(word).visibility !== 'hidden' && word.getClientRects().length ? range.getBoundingClientRect() : null;
      const box = r => [r.left, r.top, r.right, r.bottom].map(v => Math.round(v * 10) / 10);
      const buttons = [...document.querySelectorAll('.workout-cinema .cinema-pause-actions button')].map(node => ({ name: node.getAttribute('aria-label') || node.textContent.trim(), box: box(node.getBoundingClientRect()) }));
      const replay = document.querySelector('.workout-cinema .cinema-pause-replay'), back = document.querySelector('.workout-cinema .cinema-pause-jump[data-d="-1"]');
      const centre = node => { const r = node.getBoundingClientRect(); return r.left + r.width / 2; };
      return { phaseWord: !!word, word: ink && box(ink), hits: ink ? buttons.filter(({ box: b }) => b[0] < ink.right && b[2] > ink.left && b[1] < ink.bottom && b[3] > ink.top).map(b => b.name) : [],
        replayIcon: replay && centre(replay.querySelector('svg')), backCentre: back && centre(back) };
    });
    assert.ok(fit.phaseWord, label + ' shows a phase word under the pause layer');
    assert.deepEqual(fit.hits, [], label + ' at ' + width + ': the pause buttons clear the phase word ' + JSON.stringify(fit));
    cases.push({ label, word: fit.word, replayOffset: Math.round(fit.replayIcon - fit.backCentre) });
    await noOverflow(p, label + ', paused, ' + width);
    await resume(p);
    await quit(p);
  }
  assert.ok(cases[1].replayOffset <= cases[0].replayOffset, 'Ponovi\'s icon in the side change sits no further right than in a preparation at ' + width + ': ' + JSON.stringify(cases));
  return { width, cases };
}

async function run() {
  const server = await serve();
  let browser;
  const results = [];
  try {
    browser = await launch();
    for (const [width, height, scenarios, safeArea] of [[393, 852, [firstStartWithParts, plainWorkout, pauseCaptions]], [375, 812, [narrow]], [390, 844, [narrow], 34], [375, 667, [touch, pauseClear]], [393, 852, [phone, pauseClear], 34],
      [375, 667, [pauseClear], 34], [414, 736, [pauseClear]], [375, 812, [pauseClear], 34]]) {
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
