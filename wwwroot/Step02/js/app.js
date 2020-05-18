function createServiceClient(url){
    return {
        getData: _ => fetch(url)
            .then(res => res.json())
    };
}

async function onLoad(){
    let data = await database.list();
    if(!data || !data.length){
        const svcClient = createServiceClient('/Step02/api/data');
        data = await svcClient.getData();
        for(let obj of data){
            database.save(obj);
        }
    }
}