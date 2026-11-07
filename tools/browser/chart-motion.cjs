'use strict';

const assert = require('node:assert/strict');
const MuscleWork = require('../../muscle-work.js');
const { engine, fixture, launch, serve } = require('./runtime.cjs');

const fixed = new Date('2026-11-04T12:00:00+01:00');
const action = (page, name) => page.locator('[data-a="' + name + '"]');
const mode = (page, name) => action(page, 'analyticsMode').and(page.locator('[data-v="' + name + '"]'));

function data() {
  const backup = fixture(), id = 'chart-motion-press';
  const exercise = { ...backup.exercises['bench-press'], id, muscles: { prime: ['front_chest'], sec: ['back_triceps'] },
    muscleWorkEligible: true };
  backup.exercises[id] = exercise;
  backup.settings.sound = false;
  backup.settings.planDates = {};
  backup.log = [2, 4].map(day => {
    const item = { exId: id, measure: 'sets', sets: 2, setsDone: 2, reps: 8, kg: 20 + day, rest: 45,
      done: true, repsList: [8, 8], rirList: [2, 2] };
    return { historyId: 'chart-motion-' + day, kind: 'protocol', name: 'Ispit animacije', refId: 'chart-motion',
      at: new Date('2026-11-0' + day + 'T10:00:00+01:00').getTime(), secs: 360, srpe: 6, items: [item],
      muscleWork: [MuscleWork.pack(MuscleWork.completedItem(exercise, item))] };
  });
  return backup;
}

async function motion(target, name, property) {
  assert.equal(await target.evaluate(node => getComputedStyle(node).animationName), name);
  const samples = await target.evaluate(async (node, property) => {
    const animation = node.getAnimations()[0];
    if (!animation) return null;
    animation.pause();
    await animation.ready;
    const read = () => Number.parseFloat(getComputedStyle(node).getPropertyValue(property));
    animation.currentTime = 0;
    const start = read();
    animation.currentTime = animation.effect.getComputedTiming().duration / 3;
    const middle = read();
    animation.finish();
    return { start, middle, end: read() };
  }, property);
  assert.ok(samples && samples.start < samples.middle && samples.middle < samples.end,
    name + ' visibly increases from empty to full: ' + JSON.stringify(samples));
}

async function staticFill(target, property) {
  const state = await target.evaluate((node, property) => ({
    name: getComputedStyle(node).animationName,
    value: Number.parseFloat(getComputedStyle(node).getPropertyValue(property))
  }), property);
  assert.equal(state.name, 'none');
  assert.ok(state.value > 0, 'the chart still shows the recorded result');
}

(async () => {
  const host = await serve(), browser = await launch();
  try {
    const context = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true,
      reducedMotion: 'no-preference', locale: 'hr-HR', timezoneId: 'Europe/Zagreb', serviceWorkers: 'block' });
    const page = await context.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.clock.setFixedTime(fixed);
    await page.goto(host.url);
    await action(page, 'dataSheet').click();
    await page.locator('#importFile').setInputFiles({ name: 'chart-motion.json', mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(data())) });
    await action(page, 'restoreApply').click();
    await action(page, 'restoreApply').waitFor({ state: 'hidden' });
    await page.locator('.toast').waitFor({ state: 'hidden' });
    await page.addStyleTag({ content: '.charts-entering .chart-ring-sweep, .charts-entering .muscle-meter > i { animation-play-state: paused }' });
    await page.locator('.tab[data-tab="analytics"]').click();
    const progress = page.locator('.pg-cinema .chart-ring-sweep').first();
    const load = page.locator('.tl-cinema .chart-ring-sweep');
    await motion(progress, 'chart-ring-fill', 'stroke-dasharray');
    await action(page, 'progressRange').and(page.locator('[data-v="7d"]')).click();
    await staticFill(progress, 'stroke-dasharray');
    await mode(page, 'load').click();
    await motion(load, 'chart-ring-fill', 'stroke-dasharray');
    await action(page, 'trainingLoadRange').and(page.locator('[data-v="1m"]')).click();
    await staticFill(load, 'stroke-dasharray');
    await action(page, 'trainingLoadDetail').and(page.locator('[data-topic="muscles"]')).click();
    await motion(page.locator('#training-load-info[open] .muscle-meter > i').first(), 'chart-meter-fill', 'width');
    await page.keyboard.press('Escape');

    await page.getByRole('button', { name: 'Moj pregled', exact: true }).click();
    await action(page, 'dashboardAnalytics').click();
    const week = page.locator('.db-ring .chart-ring-sweep');
    const weekMeter = page.locator('.db-comparison-row .muscle-meter > i').first();
    await motion(week, 'chart-ring-fill', 'stroke-dasharray');
    await motion(weekMeter, 'chart-meter-fill', 'width');
    await page.locator('.db-comparison-row').first().click();
    await staticFill(week, 'stroke-dasharray');
    await staticFill(weekMeter, 'width');

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.locator('.db-analytics [data-a="back"]').click();
    await action(page, 'dashboardAnalytics').click();
    await staticFill(week, 'stroke-dasharray');
    await staticFill(weekMeter, 'width');
    assert.deepEqual(errors, []);
    await context.close();
    console.log('Passed chart motion (' + engine + '): rings, segmented bars, view entry, reduced motion and incidental redraws.');
  } finally {
    await browser.close();
    await host.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
