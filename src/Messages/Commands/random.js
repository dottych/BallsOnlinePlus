const utils = require('../../Utils');
const players = require('../../Lists').players;
const cosmetics = require('../../Lists').cosmetics;
const tick = require('../../Tick');

const c_random = (c, input) => {
    players.get(c.id).color = utils.createId(Date.now().toString()).substr(0, 6);
    players.get(c.id).cosmetic = cosmetics[Math.floor(Math.random() * cosmetics.length)];

    tick.requests.push({
        r: {
            t: 'bc',
            r: { id: c.id, color: players.get(c.id).color }
        },

        c: utils.getAllPlayerClients()
    });

    tick.requests.push({
        r: {
            t: 'bco',
            r: { id: c.id, cosmetic: players.get(c.id).cosmetic }
        },

        c: utils.getAllPlayerClients()
    });

    utils.msgClient(c, `You have received a new random look!`);
}

module.exports = c_random;