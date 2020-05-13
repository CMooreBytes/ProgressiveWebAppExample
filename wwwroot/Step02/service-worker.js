const APP_CACHE_NAME = "pwa-step02-app-cache";
const DATA_CACHE_NAME = "pwa-step02-data-cache";

const FILES_TO_CACHE = [
    '/favicon.ico',
    '/Step02/index.html',
    '/Step02/js/app.js',
    '/Step02/css/app.css'
];

self.addEventListener('install', evt => evt.waitUntil(
    caches.open(APP_CACHE_NAME)
        .then((cache) => {
            console.log('[ServiceWorker] Pre-caching offline page(s)');
            return cache.addAll(FILES_TO_CACHE);
        })
    )
);

self.addEventListener('activate', evt => evt.waitUntil(
    caches.keys()
        .then(keyList => Promise.all(keyList.map((key) => {
            if (key !== APP_CACHE_NAME && key !== DATA_CACHE_NAME) {
                console.log('[ServiceWorker] Removing old cache', key);
                return caches.delete(key);
            }
        })))
    )
);

self.addEventListener('fetch', evt => {
    if(evt.request.method == 'POST'){
        evt.respondWith(fetch(evt.request));
        return;
    }
    let cacheName;
    if (evt.request.url.includes('/api/')) {
        console.log('[Service Worker] Fetch (data)', evt.request.url);
        cacheName = DATA_CACHE_NAME;
    }
    else{
        console.log('[Service Worker] Fetch (app)', evt.request.url);
        cacheName = APP_CACHE_NAME;
    }
    evt.respondWith(caches.open(cacheName)
        .then(cache => fetch(evt.request)
            .then(res => {
                if(res.status === 200)
                    cache.put(evt.request.url, res.clone());
                return res;
            })
            .catch(err => cache.match(evt.request))
        )
    );
});