/* Mi Bitácora — service worker de la versión web (v0.26.0).
   Guarda la app completa para que funcione sin internet. Cuando se publica una versión nueva, este archivo
   cambia, el navegador baja la versión nueva en segundo plano y la app muestra «Actualizar ahora».
   Nunca toca los datos del docente (esos viven en el almacenamiento del navegador, no en este caché). */
const CACHE='mibitacora-0.26.0';
const FILES=["./", "./index.html", "./manifest.webmanifest", "./icono-192.png", "./icono-512.png", "./icono-maskable-512.png", "./apple-touch-icon.png", "./primaria/", "./primaria/index.html", "./secundaria/", "./secundaria/index.html", "./telesecundaria/", "./telesecundaria/index.html"];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:'reload'})))));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('mibitacora-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('message',e=>{if(e.data==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);if(u.origin!==location.origin)return;
  e.respondWith(caches.open(CACHE).then(c=>c.match(r,{ignoreSearch:true}).then(hit=>{
    if(hit)return hit;
    if(r.mode==='navigate'){const p=u.pathname.endsWith('/')?u.pathname+'index.html':u.pathname;return c.match(p,{ignoreSearch:true}).then(h=>h||fetch(r))}
    return fetch(r);
  })));
});
