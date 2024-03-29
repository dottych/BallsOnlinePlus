const utils = require('../../Utils');
const players = require('../../Lists').players;

const c_admin = (c, input) => {
    if (players.get(c.id).admin) { utils.msgClient(c, `You are already an admin.`); return; }
    
    if (input === process.env.ADMIN_PASS) {
        players.get(c.id).admin = true;
        utils.msgClient(c, `You are now an admin.`);
        utils.nClient(c, `You are now an admin.`, 1000, "DDDD00");
    }
}

module.exports = c_admin;