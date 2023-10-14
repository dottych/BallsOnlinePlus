const utils = require('../../Utils');
const players = require('../../Lists').players;

const c_name = (c, input) => {
    if (input.trim() === "") { utils.msgClient(c, `Your current name is ${players.get(c.id).name}.`); return; }
    if (input.trim().slice(0, 24) === players.get(c.id).name) { utils.msgClient(c, `You already have this name!`); return; }

    players.get(c.id).setName(input.trim().slice(0, 24));
    utils.msgClient(c, `You have changed your name to ${players.get(c.id).name}.`);
}

module.exports = c_name;