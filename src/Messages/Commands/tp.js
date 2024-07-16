const utils = require('../../Utils');
const tick = require('../../Tick');
const players = require('../../Lists').players;

const c_tp = (c, input) => {
    if (!players.get(c.id).admin) { utils.msgClient(c, `You are not an admin!`); return; }

    let ids = input.split(' ');

    if (ids.length !== 2) { utils.msgClient(c, `You need to input two IDs!`); return; }
    if (!players.get(ids[0])) { utils.msgClient(c, `First ID does not exist!`); return; }
    if (!players.get(ids[1])) { utils.msgClient(c, `Second ID does not exist!`); return; }

    players.get(ids[0]).teleport(players.get(ids[1]).x, players.get(ids[1]).y);

    utils.msgClient(c, `Teleported ${ids[0]} to ${ids[1]}.`);
}

module.exports = c_tp;
