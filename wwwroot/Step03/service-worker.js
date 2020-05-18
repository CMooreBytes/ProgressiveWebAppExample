importScripts('js/db.js')
const APP_CACHE_NAME = "pwa-step03-app-cache";
const DATA_CACHE_NAME = "pwa-step03-data-cache";

const FILES_TO_CACHE = [
    '/favicon.ico',
    '/Step03/index.html',
    '/Step03/js/app.js',
    '/Step03/js/db.js',
    '/Step03/css/app.css'
];

async function syncData(client, data){
    if(!navigator.onLine)
        return;

    for(let obj of data){
        const res = await fetch('/Step03/form', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const deletedObj = await database.remove(obj);
        client.postMessage({message: `Deleted ${deletedObj.Uid}`, type: 'info', data: deletedObj});
    }
}

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

self.addEventListener('message', evt => {
    evt.waitUntil(
        database.list()
            .then(data => syncData(evt.source, data))
    );
});

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