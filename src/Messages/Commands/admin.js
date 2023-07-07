const utils = require('../../Utils');
const players = require('../../Lists').players;

require('dotenv').config();

const c_admin = (c, input) => {
    if (input === process.env.ADMIN_PASS) {
        players.get(c.id).admin = true;
        utils.msgClient(c, `You are now an admin.`);
        utils.nClient(c, `You are now an admin.`, 1000, "DDDD00");
    }
}

module.exports = c_admin;