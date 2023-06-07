const fs = require('fs');
const utils = require('./Utils');
const tick = require('./Tick');

const maps = require('./Lists').maps;
const players = require('./Lists').players;

const mapsInDir = fs.readdirSync('./maps/');

for (let i of mapsInDir) {
    let mapFileID = Number(i.substring(0, i.length - 4));

    let mapFile = fs.readFileSync(`./maps/${i}`, { encoding: 'ascii' });
    let mapData = mapFile.match(/.{1,32}/g);
    maps.set(mapFileID, mapData);
}

let mapID = Math.floor(Math.random() * maps.size);

const changeMap = () => {
    let prevMapID = mapID;
    while (prevMapID === mapID) mapID = Math.floor(Math.random() * maps.size);

    for (let i of players) {
        i[1].x = 1930 + Math.round(Math.random() * 235);
        i[1].y = 1930 + Math.round(Math.random() * 235);

        tick.requests.push({
            r: {
                t: 'bm',
                r: { id: i[1].id, x: i[1].x, y: i[1].y }
            },
    
            c: utils.getAllPlayerClients()
        });
    }

    tick.requests.push({
        r: {
            t: 'map',
            r: { map: maps.get(mapID) }
        },

        c: utils.getAllPlayerClients()
    });

    tick.requests.push({
        r: {
            t: 'n',
            r: {
                n: `Map has changed!`,
                d: 1000,
                color: "00DD00"
            }
        },

        c: utils.getAllPlayerClients()
    });
}

setInterval(() => {
    changeMap();
}, 60000 * 5);

module.exports = { mapID, changeMap };