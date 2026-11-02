const CACHE = 'mt-v1.2';
const SHELL = ['./', './index.html', './style.css', './hash.js', './data.js', './seed-history.js', './media.js', './pitch.js', './app.js', './manifest.webmanifest', './icons/icon-192.png', './icons/apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  // videos stream in parts (Range requests); let the browser handle them directly
  if (req.headers.has('range') || req.destination === 'video') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    // network first so updates arrive; the cache is the offline fallback
    e.respondWith(fetch(req).then(r => { if (r.ok && r.status === 200) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)).catch(() => {}); } return r; })
      .catch(() => caches.match(req).then(r => r || caches.match('./index.html'))));
  } else if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(resp => { if (resp.ok) { const cp = resp.clone(); caches.open(CACHE).then(c => c.put(req, cp)).catch(() => {}); } return resp; })));
  }
});
