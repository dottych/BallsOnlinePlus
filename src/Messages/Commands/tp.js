const utils = require('../../Utils');
const tick = require('../../Tick');
const players = require('../../Lists').players;

const c_tp = (c, input) => {
    if (players.get(c.id).admin) {
        let ids = input.split(' ');

        if (ids.length !== 2) { utils.msgClient(c, `You need to input two IDs!`); return; }
        if (!players.get(ids[0])) { utils.msgClient(c, `First ID does not exist!`); return; }
        if (!players.get(ids[1])) { utils.msgClient(c, `Second ID does not exist!`); return; }

        tick.requests.push({
            r: {
                t: 'bm',
                r: { id: ids[0], x: players.get(ids[1]).x, y: players.get(ids[1]).y }
            },

            c: utils.getAllPlayerClients()
        
        });

        utils.msgClient(c, `Teleported ${ids[0]} to ${ids[1]}.`);
    }
    else utils.msgClient(c, `You are not an admin!`);
}

module.exports = c_tp;