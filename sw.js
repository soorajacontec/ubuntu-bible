/* Ubuntu Bible service worker — bump VERSION on every release */
const VERSION = 'ubuntu-bible-v1.9.0';
const ASSETS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "css/style.css",
  "js/core.js",
  "js/tools.js",
  "js/outputs.js",
  "js/outputs2.js",
  "js/data/d1.js",
  "js/data/d2.js",
  "js/data/d3.js",
  "js/data/d4.js",
  "js/data/d5.js",
  "js/data/d6.js",
  "js/data/d7.js",
  "js/data/d8.js",
  "js/data/d9.js",
  "js/shell.js",
  "js/app.js",
  "js/cat.js",
  "icons/icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "icons/apple-touch-icon.png"
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(VERSION).then(x => x.put('index.html', c)); return r; })
      .catch(() => caches.match('index.html', { ignoreSearch: true })));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(r => {
    if (r.ok) { const c = r.clone(); caches.open(VERSION).then(x => x.put(req, c)); }
    return r;
  })));
});
