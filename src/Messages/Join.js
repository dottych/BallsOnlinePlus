const Player = require('../Player');
const players = require('../Lists').players;
const maps = require('../Lists').maps;
const map = require('../Map');
const tick = require('../Tick');
const utils = require('../Utils');
const lists = require('../Lists');
const bridge = require('../Bridge');

const m_Join = ({ c, data }) => {
    if (c.id !== "0") return;

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
            t: 'tex',
            r: { texs: [
                "marioood",
                "natural",
                "dottych",
                "flat",
                "dcrawl",
                "spacestation",
                "petscop",
                "middledave",
                "chips",
                "nes",
                "squareface",
                "nineties",
                "reds",
                "beginnings",
                "shore",
                "deadeye",
                "horror",
                "void",
                "ash",
                "jelly",
                "faith",
                "saladauth",
                "aero",
                "turnbased"
            ] }
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

    tick.requests.push({
        r: {
            t: 'dd',
            r: { d: maps.get(map.mapID)[0][1] }
        },

        c: [c]
    });

    tick.requests.push({
        r: {
            t: 'b',
            r: { id: NewPlayer.id, info: NewPlayer.getPublicInfo() }
        },
        c: utils.getOtherPlayerClients(c)
    });

    tick.requests.push({
        r: {
            t: 'l',
            r: {
                balls: utils.getBalls()
            }
        },

        c: [c]
    });

    let plrs = players.size;
    let motd = lists.motds[Math.floor(Math.random() * lists.motds.length)];

    utils.msgClient(c, `Welcome to Balls Online! There ${plrs===1?"is":"are"} ${plrs} player${plrs===1?"":"s"} online. Try saying /help.`);
    utils.msgClient(c, `MOTD: ${motd}`);

    let welcoming = lists.welcomings[Math.floor(Math.random() * lists.welcomings.length)];

    utils.nClient(c,
        welcoming,
        1500,
        "DDDD00"
    );

    setTimeout(() => {
        utils.nClient(c,
            `You're currently in the map: ${maps.get(map.mapID)[0][0]}`,
            1500,
            "DDDD00",
            false
        );
    }, 5000);
    
    bridge.pile(`**${NewPlayer.id}** joined the game`);
    bridge.setActivity(`with ${utils.getBalls().length} ball${utils.getBalls().length === 1 ? '' : 's'}`);
}

module.exports = m_Join;