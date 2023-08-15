const utils = require('../../Utils');
const players = require('../../Lists').players;
const tick = require('../../Tick');

const c_respawn = (c, input) => {
    players.get(c.id).x = 1930 + Math.round(Math.random() * 235);
    players.get(c.id).y = 1930 + Math.round(Math.random() * 235);
    players.get(ids[0]).px = players.get(ids[0]).x;
    players.get(ids[0]).py = players.get(ids[0]).y;

    tick.requests.push({
        r: {
            t: 'bm',
            r: { id: c.id, x: players.get(c.id).x, y: players.get(c.id).y }
        },

        c: utils.getAllPlayerClients()
    });

    utils.msgClient(c, `You have respawned.`);
}

module.exports = c_respawn;