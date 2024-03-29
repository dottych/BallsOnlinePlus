const utils = require('../Utils');
const players = require('../Lists').players;

const m_Move = ({ c, data }) => {
    if (!c.hasOwnProperty("id") || c.id === "0") return;
    if (!players.get(c.id)) return;

    if (Math.round(utils.clamp(data.r.x, 10, 4086)) === players.get(c.id).x && 
        Math.round(utils.clamp(data.r.y, 10, 4086)) === players.get(c.id).y) 
        return;

    players.get(c.id).move(data.r.x, data.r.y);
}

module.exports = m_Move;