'use strict';

// Cold, isolated bootstrap. Slow optional pictures must not postpone installation
// of the app shell. No existing profile, user backup or offline emulation is used.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { appVersion, artifacts, engine, launch, serve } = require('./runtime.cjs');

async function bounded(promise, milliseconds, message) {
  let timer;
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(message)), milliseconds); })
    ]);
  } finally { clearTimeout(timer); }
}

async function state(page) {
  return bounded(page.evaluate(async () => ({
    readyState: document.readyState,
    ...window.offlineBootstrapDiagnostic,
    controller: navigator.serviceWorker.controller?.scriptURL || null,
    registrations: await Promise.race([
      navigator.serviceWorker.getRegistrations().then(registrations => registrations.map(registration => ({
        scope: registration.scope, installing: registration.installing?.state || null,
        waiting: registration.waiting?.state || null, active: registration.active?.state || null
      }))),
      new Promise(resolve => setTimeout(() => resolve('diagnostic timed out'), 2000))
    ])
  })), 4000, 'Bootstrap state diagnostic timed out');
}

async function main() {
  const host = await serve();
  let browser, context, page, releaseImages;
  const coverURLs = new Set();
  let holding = true, imagesStarted;
  const coversStarted = new Promise(resolve => { imagesStarted = resolve; });
  const imageGate = new Promise(resolve => { releaseImages = resolve; });
  const results = { engine, appVersion };
  try {
    browser = await launch();
    context = await browser.newContext({
      viewport: { width: 375, height: 812 }, serviceWorkers: 'allow',
      reducedMotion: 'reduce', locale: 'hr-HR', timezoneId: 'Europe/Zagreb'
    });
    // External typography is irrelevant to the deliberately blocked-cover case.
    await context.route('https://fonts.googleapis.com/**', route => route.fulfill({
      status: 200, contentType: 'text/css', body: ''
    }));
    await context.route('**/assets/covers/**', async route => {
      if (holding && route.request().resourceType() === 'image') {
        coverURLs.add(new URL(route.request().url()).pathname);
        if (coverURLs.size === 5) imagesStarted();
        await imageGate;
      }
      await route.continue().catch(error => {
        // Cleanup may close an already released request after a failed test.
        if (!/closed|disposed|canceled/i.test(error.message)) throw error;
      });
    });
    await context.addInitScript(() => {
      window.offlineBootstrapDiagnostic = { dom: 0, load: 0, register: 0 };
      document.addEventListener('DOMContentLoaded', () => { window.offlineBootstrapDiagnostic.dom++; });
      window.addEventListener('load', () => { window.offlineBootstrapDiagnostic.load++; });
      const register = navigator.serviceWorker.register.bind(navigator.serviceWorker);
      navigator.serviceWorker.register = (...args) => {
        window.offlineBootstrapDiagnostic.register++;
        return register(...args);
      };
    });
    page = await context.newPage();
    page.setDefaultTimeout(6000);
    page.setDefaultNavigationTimeout(30000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(host.url, { waitUntil: 'domcontentloaded' });
    await bounded(coversStarted, 6000, 'The five initial cover images did not start');
    await page.getByRole('heading', { name: 'Bok, Tomislav', exact: true }).waitFor();
    const initial = await state(page);
    assert.equal(initial.readyState, 'interactive');
    assert.equal(initial.dom, 1);
    assert.equal(initial.load, 0);

    // Navigation is usable while the initial pictures still delay window.load.
    await page.getByRole('button', { name: 'Moj pregled', exact: true }).click();
    await page.locator('.dashboard').waitFor();
    await page.waitForFunction(() => !!navigator.serviceWorker.controller, {}, { timeout: 30000 });
    const controlled = await state(page);
    assert.equal(controlled.load, 0);
    assert.equal(controlled.readyState, 'interactive');
    assert.equal(controlled.register, 1);
    assert.equal(controlled.controller, new URL('sw.js', host.url).href);
    const cached = await page.evaluate(async ({ cacheName, indexURL }) => {
      const registration = await Promise.race([
        navigator.serviceWorker.ready,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Service worker ready timed out')), 3000))
      ]);
      const response = await (await caches.open(cacheName)).match(indexURL);
      return { state: registration.active?.state, shell: response?.status === 200 };
    }, { cacheName: 'mt-v' + appVersion, indexURL: new URL('index.html', host.url).href });
    assert.deepEqual(cached, { state: 'activated', shell: true });

    holding = false;
    releaseImages();
    await page.waitForFunction(() => window.offlineBootstrapDiagnostic.load === 1, {}, { timeout: 10000 });
    const released = await state(page);
    assert.equal(released.readyState, 'complete');
    assert.equal(released.register, 1);
    assert.deepEqual(errors, []);
    Object.assign(results, {
      heldCovers: coverURLs.size, interactiveBeforeImages: true,
      controlledAndCachedBeforeWindowLoad: true, loadAfterRelease: released.load, registerCalls: released.register
    });
    console.log(JSON.stringify(results, null, 2));
  } catch (error) {
    results.error = error.message;
    if (page) {
      try { console.error('Offline bootstrap:', JSON.stringify(await state(page))); }
      catch (diagnosticError) { console.error('Offline bootstrap diagnostic:', diagnosticError.message); }
    }
    throw error;
  } finally {
    holding = false;
    releaseImages();
    if (context) await context.close();
    if (browser) await browser.close();
    await host.close();
    fs.writeFileSync(path.join(artifacts, 'offline-bootstrap-' + engine + '.json'), JSON.stringify(results, null, 2));
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
