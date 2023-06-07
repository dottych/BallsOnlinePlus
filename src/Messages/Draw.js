const players = require('../Lists').players;

const m_Draw = ({ c, data }) => {
    if (!c.hasOwnProperty("id") || c.id === "0") return;

    players.get(c.id).drew = true;
}

module.exports = m_Draw;