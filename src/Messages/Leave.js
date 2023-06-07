const players = require('../Lists').players;
const tick = require('../Tick');
const utils = require('../Utils');

const m_Leave = ({ c, data }) => {
    if (!c.hasOwnProperty("id") || c.id === "0") return;
    if (!players.get(c.id)) return;
    
    players.delete(c.id);

    tick.requests.push({
        r: {
            t: 'bl',
            r: { id: c.id }
        },

        c: utils.getAllPlayerClients()
    });

    //console.log(c.id + " left");
}

module.exports = m_Leave;