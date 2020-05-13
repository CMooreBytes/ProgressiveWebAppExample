function createServiceClient(url){
    return {
        getData: _ => fetch(url)
            .then(res => res.json())
    };
}