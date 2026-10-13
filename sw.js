'use strict';
const VERSION = 'ab05c09c29cc7be4';
const CACHE = 'medicina-offline-' + VERSION;
const FILES = [{"url":"assets/AssetManifest.bin","integrity":"sha256-AK9VrT1vIYmP534P8JLRoc2lLJQbaGDpko1FyK+MCV0="},{"url":"assets/AssetManifest.bin.json","integrity":"sha256-hGC19Cmcoe1nfFpUyAOK6c8fJvbpGWaxt2fKbLbS5dI="},{"url":"assets/FontManifest.json","integrity":"sha256-xbyJ//olphBt6AEz216qWgotLsuo12U0m2flZJc2JS8="},{"url":"assets/fonts/fallback/Roboto-Regular.ttf","integrity":"sha256-eehRQEZX2sIQaz0irSVtR4JKmldlRY7bcskQKkWBbZU="},{"url":"assets/fonts/MaterialIcons-Regular.otf","integrity":"sha256-CzJSPjmf7DBH6h71wR/bCQfokeb7NWoejJqDrTAxjw0="},{"url":"assets/NOTICES","integrity":"sha256-oK5qKy6Ey8ar+256w54hvf6sxi1Fzpg8SqoCf+qeBKM="},{"url":"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf","integrity":"sha256-YUBbxFzLiNqovhcl5jgbE/eQpowFsxlHh3w/ObSQbxU="},{"url":"assets/shaders/ink_sparkle.frag","integrity":"sha256-LcpauT1Owp6WP5lvORYyC6YIJelTffsUmmgAjHoWsCY="},{"url":"assets/shaders/stretch_effect.frag","integrity":"sha256-q0EvB6W5tQtnqIWyTb4Wkpc4rihjBAfWSQySTK8KMiA="},{"url":"canvaskit/canvaskit.js","integrity":"sha256-u1WfYIDH0xKsKpErSr7J9o/z0wItSmA8d5a5sxRgZCs="},{"url":"canvaskit/canvaskit.wasm","integrity":"sha256-++1RekPoJFJAREZoPwDy6HbYNa7YRBBpV1nme2uwHNM="},{"url":"canvaskit/chromium/canvaskit.js","integrity":"sha256-YBixK9jtN+aVLu5y1Zwc961wfM23SgpFGQAQ937dkGg="},{"url":"canvaskit/chromium/canvaskit.wasm","integrity":"sha256-ro/x2FgUD3sTAM7T+on7jJ3OCkAKD08eEfbc+zMV/c8="},{"url":"canvaskit/skwasm.js","integrity":"sha256-cdfT40v3G1K9ujtYixA7uoFIuijeV1QIPgGzOY56bhw="},{"url":"canvaskit/skwasm.wasm","integrity":"sha256-5UD9XoMDt7aOwnGMtJ6cQh+K3jB1sV4CpwWaYmVN+aE="},{"url":"canvaskit/skwasm_heavy.js","integrity":"sha256-zsVUtG3c9MDmPXmeBVbVRvQtLD9pMW+09n7XdvYQRVg="},{"url":"canvaskit/skwasm_heavy.wasm","integrity":"sha256-Vl9cwcymqxIPEZNLEF8B/sS1i0gMguCIncqTr45vhjU="},{"url":"canvaskit/webparagraph/canvaskit.js","integrity":"sha256-MRDj5Nm3tWV9M28lOqyorMpXd83pMZ+2msMC1v9aiyM="},{"url":"canvaskit/webparagraph/canvaskit.wasm","integrity":"sha256-DOGwUILv3IUpVQ6KAfb/BZOXLVVSUDUBDib1YAqp8lQ="},{"url":"canvaskit/wimp.js","integrity":"sha256-j9ikdIDG6wo3TRWZEtCz+xVmG0H1wRPs3TnC8B8r7kY="},{"url":"canvaskit/wimp.wasm","integrity":"sha256-6STqr9gB1B4BfRePP9XPikF/ZB/jXJ7TSk4ddYIoPgw="},{"url":"favicon.png","integrity":"sha256-TgNA1ZefDXxMBDtBPX9ofbWyvZVFXrKUckbGLsaGj/I="},{"url":"flutter.js","integrity":"sha256-K+sc5rFZxxVAqmYDCvHXlktqkjd8x4RzdF4C+Xt07/4="},{"url":"flutter_bootstrap.js","integrity":"sha256-OTj8lye0iCEjLy49wjfdZIme7yZxPVdgNJILo7JBgA0="},{"url":"icons/Icon-192.png","integrity":"sha256-eLDQNjQXq2yvS2Y3eBggH4y1v+Z/qe4YlqcahCdwqpQ="},{"url":"icons/Icon-512.png","integrity":"sha256-N/HLBmPTy09/fPnA3r3KGk4aSpfxjl/ycgumlPwNVHc="},{"url":"icons/Icon-maskable-192.png","integrity":"sha256-eLDQNjQXq2yvS2Y3eBggH4y1v+Z/qe4YlqcahCdwqpQ="},{"url":"icons/Icon-maskable-512.png","integrity":"sha256-N/HLBmPTy09/fPnA3r3KGk4aSpfxjl/ycgumlPwNVHc="},{"url":"index.html","integrity":"sha256-wNV1FTaZ7RAdcDY4dKiHe6LpPLU2bc4NNwrnUZ+budQ="},{"url":"main.dart.js","integrity":"sha256-KIy3X42JUYGqd4EzvCFY9yryPEs7IejSXnye8mCkwPs="},{"url":"manifest.json","integrity":"sha256-kBMRfe+/7NQj24ZwRCHXf7P3iuT9UyrwvAyThE4QyoY="},{"url":"offline.css","integrity":"sha256-0LV9AyY/SEW52CEWwx0Ux6Tdox5MKG6H9OyNtevyB3o="},{"url":"offline.js","integrity":"sha256-8H1E9KVM0QZ9SOYZIIULSOUaPOkKsSA7yV9EgEI13m4="},{"url":"version.json","integrity":"sha256-RisYb1mVxbHRuAYG5qIjHmw7UWNSu1Na6OckMBNA1SA="}];
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
