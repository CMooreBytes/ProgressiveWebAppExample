async function onServiceWorkerRegistration(registration){
    console.log('Service worker registered.', registration)
    
    if('sync' in registration){
        document.querySelector('form').addEventListener('submit', evt => {
            evt.stopPropagation();
            evt.preventDefault();
            const name = document.querySelector('input[name="name"]')?.value;
            const description = document.querySelector('input[name="description"]')?.value;
            database.save({name, description})
            .then(_ => registration.active.postMessage('sync'));
        });
        
        const status = await setupNotifications();
        window.addEventListener('offline', () => setOnlineIndicator(false));
        window.addEventListener('online', () => setOnlineIndicator(true));
        window.addEventListener('online', () => registration.active.postMessage('sync'));
        setOnlineIndicator(navigator.onLine);

    }
    navigator.serviceWorker.addEventListener('message', evt => console.log(evt.data));
}

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

function createServiceClient(url){
    return {
        getData: _ => fetch(url)
            .then(res => res.json())
    };
}

async function onLoad(){
    let data = await database.list();
    if(!data || !data.length){
        const svcClient = createServiceClient('/Step03/api/data');
        data = await svcClient.getData();
        for(let obj of data){
            database.save(obj);
        }
    }
}
