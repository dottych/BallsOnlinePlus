let requests = [];
// { r: {request-data}, c: [clients-here] }

let tick = setInterval(() => {
    if (requests.length > 0) {
        let _requests = [...requests];
        for (let i in _requests) requests.shift();

        //console.log(`\ndoing ${_requests.length} requests now`);

        for (let i in _requests) {
            for (let j in _requests[i].c) _requests[i].c[j].send(JSON.stringify([_requests[i].r]));
            //console.log(`done request ${+i+1}, type ${_requests[i].r.t}`);
        }

        //console.log("\n");
    }
}, 50);

module.exports = { requests };