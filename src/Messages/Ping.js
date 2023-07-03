const players = require('../Lists').players;
const tick = require('../Tick');
const utils = require('../Utils');

const m_Ping = ({ c, data }) => {
    if (!c.hasOwnProperty("id") || c.id === "0") return;
    if (!players.get(c.id)) return;
    
    players.get(c.id).pinged = true;
}

module.exports = m_Ping;