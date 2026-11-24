// Service worker Wall'PEB : permet l'installation et une consultation hors ligne des pages déjà visitées.
// Stratégie « réseau d'abord » : la version en ligne est toujours prioritaire, la copie sert seulement sans connexion.
// Aucune donnée personnelle n'est stockée (pas de formulaire, pas de cookie).
const CACHE = 'wallpeb-v1';
const CORE = ['/', '/guides', '/simulateur-peb', '/favicon.svg', '/manifest.webmanifest', '/icons/icon-192.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: req.mode === 'navigate' }).then(m => m || (req.mode === 'navigate' ? caches.match('/') : undefined)))
  );
});
