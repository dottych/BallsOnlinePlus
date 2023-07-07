const utils = require('../../Utils');
const map = require('../../Map');
const players = require('../../Lists').players;

const c_newmap = (c, input) => {
    if (players.get(c.id).admin) map.changeMap(+input);
    else utils.msgClient(c, `You are not an admin!`);
}

module.exports = c_newmap;