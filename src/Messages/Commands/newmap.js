const utils = require('../../Utils');
const map = require('../../Map');
const players = require('../../Lists').players;

const c_newmap = (c, input) => {
    if (!players.get(c.id).admin) { utils.msgClient(c, `You are not an admin!`); return; }
    
    if (input !== "") map.changeMap(+input); else map.changeMap();
}

module.exports = c_newmap;