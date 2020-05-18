[Introduction](../../README.md)
# Step 03: Synchronizing data when network is available
1. Create web notification for changes to network status.
    ``` js
    async function onServiceWorkerRegistration(registration){
        ...
        const status = await setupNotifications();
        window.addEventListener('offline', () => setOnlineIndicator(false));
        window.addEventListener('online', () => setOnlineIndicator(true));
        window.addEventListener('online', () => registration.active.postMessage('sync'));
        setOnlineIndicator(navigator.onLine);
        ...
    )

    function setOnlineIndicator(value){
        document.querySelector('.online-indicator').classList.toggle('status-online', value);
        if(Notification.permission === 'granted')
            new Notification('App Status', { 'body': value ? 'PWA Step 03 App is online' : 'PWA Step 03 App is offline' });
    }

    async function setupNotifications(){
        if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            return await Notification.requestPermission();
        }
        return await Promise.resolve(Notification.permission);
    }
    ```
1. Import [database script](./js/db.js) into the service worker.
    ``` js
    importScripts('js/db.js')
    ```

1. Add message event handler to handle synchronizing data stored in the database with the server.
    ``` js
    self.addEventListener('message', evt => {
        evt.waitUntil(
            database.list()
                .then(data => syncData(evt.source, data))
        );
    });
    ...
    async function syncData(client, data){
        if(!navigator.onLine)
            return;

        for(let obj of data){
            const res = await fetch('/Step03/form', {
                ...
                // configure HTTP request
            });
            ...
        }
    }
    ```
1. Delete submitted record from database and notify the client.
    ``` js
    async function syncData(client, data){
        ...
        for(let obj of data){
            ...
            const deletedObj = await database.remove(obj);
            client.postMessage({message: `Deleted ${deletedObj.Uid}`, type: 'info', data: deletedObj});
        }
    }
    ```
1. Update submit event handler to post message to service worker.
    ``` js
    evt.stopPropagation();
    evt.preventDefault();
    const name = document.querySelector('input[name="name"]')?.value;
    const description = document.querySelector('input[name="description"]')?.value;
    database.save({name, description})
    .then(_ => registration.active.postMessage('sync'));
    ```