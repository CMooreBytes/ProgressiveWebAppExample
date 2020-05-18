async function open(options){
    return new Promise(function (resolve, reject) {
        let request = indexedDB.open(options.name, options.version);
        let self = this;
        request.onupgradeneeded = event => {
            let database = event.target.result;
            database.createObjectStore(options.objectStoreName, { keyPath: options.keyPath });
        };

        request.onerror = reject;
        request.onsuccess = function (evt) {
            resolve(evt.target.result);
        };
    });
}

async function access(options, mode) {
    let db = await open(options);
    return db.transaction(options.objectStoreName, mode)
        .objectStore(options.objectStoreName);
}

const reader = options => access(options, 'readonly');
const writer = options => access(options, 'readwrite');

const databaseOptions = {
    name: 'pwa-step03-db',
    version: 1,
    keyPath: 'Uid',
    objectStoreName: 'pwa-step03-db-objectStore'
};

function list(){
    return new Promise(async function (resolve, reject) {
        reader(databaseOptions)
            .then(objectStore => {
                let request = objectStore.getAll();
                request.onerror = reject;
                request.onsuccess = function (evt) { resolve(evt.target.result); }
            })
    });
}

async function save(value){
    return new Promise(function (resolve, reject) {
        if (!(databaseOptions.keyPath in value)){
            value[databaseOptions.keyPath] = uuidv4();
        }

        writer(databaseOptions)
            .then(objectStore => {
                let request = objectStore.add(value);
                request.onerror = reject;
                request.onsuccess = function (evt) { resolve(value); }
            })
    });
}

async function remove(value){
    return new Promise(function (resolve, reject) {
        writer(databaseOptions)
            .then(objectStore => {
                let request = objectStore.delete(value[databaseOptions.keyPath]);
                request.onerror = reject;
                request.onsuccess = function (evt) { resolve(value); }
            })
    });
}

const database = {
    list,
    save,
    remove
}
