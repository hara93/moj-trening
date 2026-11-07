const CACHE = 'mt-v1.20.11';
const SHELL = ['./', './index.html', './style.css', './dashboard.css', './history.css', './player-dose.css', './starting-load.css', './today.css', './progress.css', './team.css', './workout.css', './training-load.css', './app-layout.css', './hash.js', './data.js', './seed-history.js', './media.js', './pitch.js', './loadfx.js', './body.js', './month-plan.js', './muscle-work.js', './training-load.js', './dashboard.js', './history-store.js', './team.js', './history-model.js', './history.js', './player-dose.js', './session-clock.js', './starting-load.js', './today-model.js', './today-view.js', './progress-model.js', './progress-view.js', './workout-model.js', './cinema-model.js', './workout-view.js', './training-load-view.js', './app.js', './manifest.webmanifest', './icons/icon-192.png', './icons/apple-touch-icon.png'];
SHELL.push('./treninzi/gornji-dio-nakon-utakmice-60min.json');
// pictures, thumbnails and font files stay from one version to the next (a new version must not take away, e.g. offline at
// the gym, what was already shown); each is saved the first time a screen shows it
const MEDIA = 'mt-media';
const keep = url => url.origin === location.origin ? url.pathname.indexOf('/assets/') !== -1 : url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
const store = req => keep(new URL(req.url)) ? MEDIA : CACHE;
// with a weak signal the saved copy is used after this long; the network answer still refreshes it for the next start
const WAIT = 3000;
// pages that started from the saved copy take their files from the same copy, so one start never mixes two versions
const fromCache = new Set();
// a new cache takes the files straight from the server, never from the browser's HTTP cache of the previous release
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' }))))); self.skipWaiting(); });
// only this app's old caches ('mt-…'); other apps on the same address (e.g. 'zns-…') keep theirs. Pictures and fonts an older
// version saved move to the lasting cache first.
const moveMedia = k => caches.open(k).then(c => c.keys().then(rs => caches.open(MEDIA).then(m => Promise.all(rs.filter(r => keep(new URL(r.url)))
  .map(r => m.match(r).then(have => have || c.match(r).then(x => x && m.put(r, x))))))));
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.indexOf('mt-') === 0 && k !== CACHE && k !== MEDIA)
  .map(k => moveMedia(k).catch(() => {}).then(() => caches.delete(k)))))); self.clients.claim(); });
// the page asks which version took over, to reload into it when nothing is open
self.addEventListener('message', e => { if (e.data === 'mt-version' && e.source) e.source.postMessage({ mtCache: CACHE }); });
const saved = req => caches.open(store(req)).then(c => c.match(req).then(r => r || (req.mode === 'navigate' ? c.match('./index.html') : undefined)));
// from the server; a good answer is kept in the saved copy (the worker stays awake until it is written)
const fresh = (e, req) => fetch(req).then(r => {
  if (r.ok && r.status === 200) { const cp = r.clone(), w = caches.open(store(req)).then(c => c.put(req, cp)).catch(() => {}); try { e.waitUntil(w); } catch(_){} }
  return r;
});
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  // videos stream in parts (Range requests); let the browser handle them directly
  if (req.headers.has('range') || req.destination === 'video') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    // a file the saved copy does not have yet (e.g. a picture never shown before): the network, but not longer than WAIT, and a
    // failure is just a missing file (a card keeps its colour), never an error thrown at the page or a start that never settles
    if (req.mode !== 'navigate' && e.clientId && fromCache.has(e.clientId)) { e.respondWith(saved(req).then(r => r || new Promise(resolve => {
      const none = () => resolve(new Response('', { status: 504, statusText: 'Offline' })), timer = setTimeout(none, WAIT);
      fresh(e, req).then(x => { clearTimeout(timer); resolve(x); }, () => { clearTimeout(timer); none(); });
    }))); return; }
    // network first so a new release shows on the next start; the saved copy when the network fails or is too slow
    const net = fresh(e, req); e.waitUntil(net.then(() => {}, () => {}));
    e.respondWith(new Promise(resolve => {
      let done = false;
      const fromSaved = r => { if (done || !r) return; done = true; if (req.mode === 'navigate' && e.resultingClientId) fromCache.add(e.resultingClientId); resolve(r); };
      const timer = setTimeout(() => saved(req).then(fromSaved, () => {}), WAIT);
      net.then(r => { clearTimeout(timer); if (!done) { done = true; resolve(r); } },
        () => { clearTimeout(timer); saved(req).then(r => r, () => null).then(r => { if (r) fromSaved(r); else if (!done) { done = true; resolve(Response.error()); } }); });
    }));
  } else if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    // the font files never change; the stylesheet that names them is refreshed in the background when there is a signal
    const net = () => fetch(req).then(resp => { if (resp.ok) { const cp = resp.clone(), w = caches.open(MEDIA).then(c => c.put(req, cp)).catch(() => {}); try { e.waitUntil(w); } catch(_){} } return resp; });
    e.respondWith(caches.open(MEDIA).then(c => c.match(req)).then(r => { if (r && url.hostname === 'fonts.googleapis.com') { const n = net().catch(() => {}); try { e.waitUntil(n); } catch(_){} } return r || net(); }).catch(() => new Response('', {status:504,statusText:'Offline'})));
  }
});
