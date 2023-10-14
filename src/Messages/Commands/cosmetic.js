const utils = require('../../Utils');
const players = require('../../Lists').players;
const cosmetics = require('../../Lists').cosmetics;
const tick = require('../../Tick');

const c_cosmetic = (c, input) => {
    if (input.trim() === "") { utils.msgClient(c, `Your current cosmetic is ${players.get(c.id).cosmetic}.`); return; }
    if (input.trim().toLowerCase() === players.get(c.id).cosmetic) { utils.msgClient(c, `You already have this cosmetic!`); return; }
    if (cosmetics.indexOf(input.trim()) < 0) { utils.msgClient(c, `This cosmetic is invalid!`); return; }

    players.get(c.id).setCosmetic(input.trim().toLowerCase());
    utils.msgClient(c, `You have changed your cosmetic to ${players.get(c.id).cosmetic}.`);
}

module.exports = c_cosmetic;