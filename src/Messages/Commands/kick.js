const utils = require('../../Utils');
const players = require('../../Lists').players;

const c_kick = (c, input) => {
    if (players.get(c.id).admin) {
        if (!players.get(input)) { utils.msgClient(c, `ID does not exist!`); return; }
        players.get(input).c.close();
    }
    else utils.msgClient(c, `You are not an admin!`);
}

module.exports = c_kick;