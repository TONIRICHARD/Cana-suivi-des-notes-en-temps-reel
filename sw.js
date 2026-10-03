const C = 'cana-notes-v1';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url);
  const put = n => { if (n.ok) { const c = n.clone(); caches.open(C).then(x => x.put(r, c)); } return n; };
  if (u.hostname === 'www.gstatic.com') { // bibliothèques Firebase : cache d'abord
    e.respondWith(caches.match(r).then(h => h || fetch(r).then(put))); return;
  }
  if (u.origin === location.origin) { // fichiers de l'application : réseau d'abord, cache en secours
    e.respondWith(fetch(r).then(put).catch(() => caches.match(r).then(h => h || caches.match('index.html'))));
  }
});
