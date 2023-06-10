const Player = require('../Player');
const players = require('../Lists').players;
const welcomings = require('../Lists').welcomings;
const maps = require('../Lists').maps;
const map = require('../Map');
const tick = require('../Tick');
const utils = require('../Utils');

const m_Join = ({ c, data }) => {
    let NewPlayer = new Player(c);
    players.set(NewPlayer.id, NewPlayer);
    c.id = NewPlayer.id;

    //console.log(NewPlayer.id + " joined");

    tick.requests.push({
        r: {
            t: 'c',
            r: { id: NewPlayer.id }
        },

        c: [c]
    });

    tick.requests.push({
        r: {
            t: 'ss',
            r: { time: Math.floor(performance.now()) }
        },

        c: [c]
    });

    tick.requests.push({
        r: {
            t: 'map',
            r: { map: maps.get(map.mapID)[1] }
        },

        c: [c]
    });

    for (let i of players) {
        if (i[1].c !== c) tick.requests.push({
            r: {
                t: 'b',
                r: { id: i[1].id, info: i[1].getPublicInfo() }
            },
    
            c: [c]
        });
    }

    tick.requests.push({
        r: {
            t: 'b',
            r: { id: NewPlayer.id, info: NewPlayer.getPublicInfo() }
        },

        c: utils.getAllPlayerClients()
    });

    let plrs = players.size;
    let motd = utils.motd[Math.floor(Math.random() * utils.motd.length)];

    utils.msgClient(c, `Welcome to the server! There ${plrs===1?"is":"are"} ${plrs} player${plrs===1?"":"s"} online.`);
    utils.msgClient(c, `Try saying /help.`);
    utils.msgClient(c, `MOTD: ${motd}`);

    let welcoming = welcomings[Math.floor(Math.random() * welcomings.length)];

    tick.requests.push({
        r: {
            t: 'n',
            r: {
                n: welcoming,
                d: 1500,
                color: "DDDD00"
            }
        },

        c: [c]
    });
}

module.exports = m_Join;