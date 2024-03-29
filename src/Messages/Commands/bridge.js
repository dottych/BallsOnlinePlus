const bridge = require('../../Bridge');
const utils = require('../../Utils');
const players = require('../../Lists').players;

const c_bridge = (c, input) => {
    if (!players.get(c.id).admin) { utils.msgClient(c, `You are not an admin!`); return; }

    bridge.canSend =! bridge.canSend;

    if (bridge.canSend) {
        utils.msgClient(c, `Turned on bridge.`);
        bridge.pile(`**Bridge is on!**`);
    } else {
        utils.msgClient(c, `Turned off bridge.`);
        bridge.pile(`**Bridge is off!**`);
    }
}

module.exports = c_bridge;