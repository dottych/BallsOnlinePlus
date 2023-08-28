const fs = require('fs');
const utils = require('./Utils');
const tick = require('./Tick');

const maps = require('./Lists').maps;
const players = require('./Lists').players;

const mapsInDir = fs.readdirSync('./maps/');

for (let i of mapsInDir) {
    let mapFileID = Number(i.substring(0, i.length - 4));

    let mapFile = fs.readFileSync(`./maps/${i}`, { encoding: 'ascii' });
    let mapTitle = fs.readFileSync(`./mapstitle/${i}`, { encoding: 'ascii' });
    let mapData = mapFile.match(/.{1,32}/g);

    maps.set(mapFileID, [mapTitle, mapData]);
}

class Block {
    constructor(name, color, cannot, shadow) {
        this.name = name;
        this.color = color;
        this.cannot = cannot;
        this.shadow = shadow;
    }
}

class Map {
    constructor() {
        this.mapID = Math.floor(Math.random() * maps.size);

        this.blocks = {
            0: new Block('Air', '808080FF', false, false),
            1: new Block('Door', 'FFFFFF0A', false, false),
            2: new Block('Glass', 'FFFFFF20', true, false),
            3: new Block('Wall', 'AAAAAAFF', true, true),
            4: new Block('Liquid', 'FFFFFF9A', true, false)
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
        
        if (id && Math.abs(+id) < maps.size) this.mapID = Math.abs(+id); else while (prevMapID === this.mapID) this.mapID = Math.floor(Math.random() * maps.size);

        for (let i of players) {
            i[1].x = 1930 + Math.round(Math.random() * 235);
            i[1].y = 1930 + Math.round(Math.random() * 235);
            i[1].px = i[1].x;
            i[1].py = i[1].y;

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
                r: { map: maps.get(this.mapID)[1] }
            },

            c: utils.getAllPlayerClients()
        });

        tick.requests.push({
            r: {
                t: 'n',
                r: {
                    n: `Map has changed to "${maps.get(this.mapID)[0]}"!`,
                    d: 1000,
                    color: "00DD00"
                }
            },

            c: utils.getAllPlayerClients()
        });
    }
}

const map = new Map();

module.exports = map;