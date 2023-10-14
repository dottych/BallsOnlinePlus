const utils = require('../../Utils');
const players = require('../../Lists').players;
const tick = require('../../Tick');

const c_respawn = (c, input) => {
    players.get(c.id).teleport(3978 + Math.round(Math.random() * 235), 3978 + Math.round(Math.random() * 235));

    utils.msgClient(c, `You have respawned.`);
}

module.exports = c_respawn;