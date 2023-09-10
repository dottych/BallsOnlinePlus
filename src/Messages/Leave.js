const players = require('../Lists').players;
const tick = require('../Tick');
const utils = require('../Utils');
const bridge = require('../Bridge');

const m_Leave = ({ c, data }) => {
    if (!c.hasOwnProperty("id") || c.id === "0") return;
    if (!players.get(c.id)) return;
    
    bridge.pile(`**${c.id} (${players.get(c.id).name})** left the game`);

    players.delete(c.id);

    tick.requests.push({
        r: {
            t: 'bl',
            r: { id: c.id }
        },

        c: utils.getAllPlayerClients()
    });

    bridge.setActivity(`with ${utils.getBalls().length} ball${utils.getBalls().length === 1 ? '' : 's'}`);
}

module.exports = m_Leave;