const CACHE_NAME="my-player-cache-v1",urlsToCache=["/","/index.html","/styles.css","/script.js","/resources/hiphopbackground.jpeg","/resources/icon.png","https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/css/all.min.css","https://www.youtube.com/iframe_api"];self.addEventListener("install",(e=>{e.waitUntil(caches.open(CACHE_NAME).then((e=>e.addAll(urlsToCache))))})),self.addEventListener("fetch",(e=>{e.respondWith(caches.match(e.request).then((s=>s||fetch(e.request))))}));