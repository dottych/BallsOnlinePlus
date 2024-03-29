const fs = require('fs');
const utils = require('./Utils');
const tick = require('./Tick');

const maps = require('./Lists').maps;
const players = require('./Lists').players;

const mapsInDir = fs.readdirSync('./maps/');

for (let i of mapsInDir) {
    let mapFileID = Number(i.substring(0, i.length - 4));

    let mapFile = fs.readFileSync(`./maps/${i}`, { encoding: 'ascii' });
    let mapInfo = fs.readFileSync(`./mapsinfo/${i}`, { encoding: 'ascii' }).split(process.platform === "win32" ? '\r\n' : '\n');
    let mapData = mapFile.match(/.{1,64}/g);

    maps.set(mapFileID, [[mapInfo[0], mapInfo[1]], mapData]);
}

class Block {
    constructor(name, transparency, cannot, shadow) {
        this.name = name;
        this.transparency = transparency;
        this.cannot = cannot;
        this.shadow = shadow;
    }
}

class Map {
    constructor() {
        this.mapID = Math.floor(Math.random() * maps.size);

        this.blocks = {
            0: new Block('Air', 0, false, false),
            1: new Block('Path', 1, false, false),
            2: new Block('Door', 1, false, false),
            3: new Block('Glass', 1, true, false),
            4: new Block('Wall', 2, true, true),
            5: new Block('Liquid', 1, true, false)
        }

        this.interval = setInterval(() => {
            this.changeMap();
        }, 60000 * 5);
    }

    changeMap(id) {
        clearInterval(this.interval);
        this.interval = setInterval(() => {
            this.changeMap();
        }, 60000 * 5);
        
        let prevMapID = this.mapID;

        if (id !== undefined && Math.abs(+id) < maps.size) this.mapID = Math.abs(+id); else while (prevMapID === this.mapID) this.mapID = Math.floor(Math.random() * maps.size);

        for (let i of players) i[1].teleport(
                                    3978 + Math.round(Math.random() * 235),
                                    3978 + Math.round(Math.random() * 235)
                                );

        tick.requests.push({
            r: {
                t: 'map',
                r: { map: maps.get(this.mapID)[1] }
            },

            c: utils.getAllPlayerClients()
        });

        tick.requests.push({
            r: {
                t: 'dd', // draw duration, not sure if I keep track of packet abbreviations elsewhere
                r: { d: maps.get(this.mapID)[0][1] }
            },

            c: utils.getAllPlayerClients()
        });

        tick.requests.push({
            r: {
                t: 'n',
                r: {
                    t: `Map has changed to "${maps.get(this.mapID)[0][0]}"!`,
                    d: 1000,
                    color: "00DD00"
                }
            },

            c: utils.getAllPlayerClients()
        });
    }

    currentMap() {
        return { id: this.mapID, name: maps.get(this.mapID)[0][0], duration: maps.get(this.mapID)[0][1] };
    }
}

const map = new Map();

module.exports = map;