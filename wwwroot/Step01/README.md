[Introduction](../../README.md)
# Step 01: Creating a Progressive Web Application
1. Create [web manifest file](manifest.webmanifest).
2. Create [service worker file](service-worker.js).
3. Register service worker on [main page](index.html).
    ``` js
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/Step01/service-worker.js')
                .then(reg => console.log('Service worker registered.', reg));
        });
    }
    ```
4. Add install event handler in [service worker file](service-worker.js).
    ``` js
    self.addEventListener('install', evt => evt.waitUntil(
        // Add logic here
        ...
    );
    ```
5. Add activate event handler in [service worker file](service-worker.js).
    ``` js
    self.addEventListener('install', evt => evt.waitUntil(
        // Add logic here
        ...
    );
    ```

6. Add activate fetch handler in [service worker file](service-worker.js). The fetch event handler will proxy network requests from the client to the server.
    ``` js
    self.addEventListener('fetch', evt => evt.waitUntil(
        // Add logic here
        ...
    );
    ```