const utils = require('../../Utils');
const tick = require('../../Tick');
const players = require('../../Lists').players;

const c_notify = (c, input) => {
    if (players.get(c.id).admin) {
        utils.nAll(input, 3000, "DDDD00", true);
        utils.msgAll(input);
    } else utils.msgClient(c, `You are not an admin!`);
}

module.exports = c_notify;