const utils = require('../../Utils');
const players = require('../../Lists').players;
const tick = require('../../Tick');

const c_color = (c, input) => {
    if (input.trim() === "") { utils.msgClient(c, `Your current color is ${players.get(c.id).color}.`); return; }
    if (input.trim().toUpperCase() === players.get(c.id).color) { utils.msgClient(c, `You already have this name!`); return; }
    if (!utils.isColor(input.trim())) { utils.msgClient(c, `This color is invalid!`); return; }

    players.get(c.id).setColor(input.trim().toUpperCase());
    utils.msgClient(c, `You have changed your color to ${players.get(c.id).color}.`);
}

module.exports = c_color;