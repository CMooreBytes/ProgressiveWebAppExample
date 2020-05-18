[Introduction](../../README.md)
# Step 02: Add data persistence
1. Create and add reference to a [database Javascript script](./js/db.js).
    ``` html
    <script src="./js/db.js"></script>
    ```
2. Add update fetch event handler both app network cache and data api cache in the [service worker](service-worker.js).
    ``` js
    ...
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
    ```
3. Add submit event handler to persist form submission data before being sent to the server.
    ``` js
    ...
    evt.stopPropagation();
    evt.preventDefault();
    const name = document.querySelector('input[name="name"]')?.value;
    const description = document.querySelector('input[name="description"]')?.value;
    database.save({name, description})
        .then(_ => evt.target.submit())
    ```