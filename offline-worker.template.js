'use strict';
const VERSION = '__REVISION__';
const CACHE = 'medicina-offline-' + VERSION;
const FILES = __FILES__;
const root = new URL('./', self.location.href);
const urls = new Set(FILES.map(file => new URL(file.url, root).href));
async function broadcast(data) {
  const clients = await self.clients.matchAll({type:'window',includeUncontrolled:true});
  clients.filter(client => client.url.startsWith(root.href)).forEach(client => client.postMessage(data));
}
async function download() {
  const cache = await caches.open(CACHE);
  let done = 0;
  for (let start = 0; start < FILES.length; start += 3) {
    await Promise.all(FILES.slice(start,start + 3).map(async file => {
      const url = new URL(file.url,root);
      const response = await fetch(new Request(url,{cache:'reload',integrity:file.integrity}));
      if (!response.ok || response.redirected) throw new Error('Offline download failed');
      await cache.put(url,response);
      done++;
      await broadcast({type:'PROGRESS',done,total:FILES.length});
    }));
  }
}
self.addEventListener('install', event => event.waitUntil(download()));
self.addEventListener('activate', event => event.waitUntil((async () => {
  for (const name of await caches.keys()) if (name.startsWith('medicina-offline-') && name !== CACHE) await caches.delete(name);
  await self.clients.claim();
  await broadcast({type:'STATUS',ready:true,version:VERSION});
})()));
self.addEventListener('message', event => {
  if (event.data?.type === 'REPAIR') event.waitUntil(download().then(() => broadcast({type:'STATUS',ready:true,version:VERSION})).catch(() => broadcast({type:'ERROR'})));
  if (event.data?.type === 'ACTIVATE') event.waitUntil(self.skipWaiting());
  if (event.data?.type === 'STATUS') event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const stored = new Set((await cache.keys()).map(request => request.url));
    const ready = [...urls].every(url => stored.has(url));
    event.source?.postMessage({type:'STATUS',ready,version:VERSION});
  })());
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== root.origin || !url.pathname.startsWith(root.pathname)) return;
  // Only this app's shell and bundled resources; never cache external books or searches.
  const appDocument = event.request.mode === 'navigate' && (url.pathname === root.pathname || url.pathname === root.pathname + 'index.html');
  url.search = ''; url.hash = '';
  if (!appDocument && !urls.has(url.href)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const key = appDocument ? new URL('index.html',root) : url;
    const cached = await cache.match(key);
    if (cached) return cached;
    return fetch(event.request);
  })());
});
