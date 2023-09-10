const utils = require('../../Utils');
const players = require('../../Lists').players;
const tick = require('../../Tick');

const c_color = (c, input) => {
    if (input.trim() !== "") {
        if (input.trim().toUpperCase() === players.get(c.id).color) utils.msgClient(c, `You already have this color!`);
        else if (utils.isColor(input.trim())) {
            players.get(c.id).color = input.trim().toUpperCase();

            tick.requests.push({
                r: {
                    t: 'bc',
                    r: { id: c.id, color: input.trim().toUpperCase() }
                },
    
                c: utils.getAllPlayerClients()
            });

            utils.msgClient(c, `You have changed your color to ${players.get(c.id).color}.`);
        } else utils.msgClient(c, `This color is invalid!`);
    } else utils.msgClient(c, `Your current color is ${players.get(c.id).color}.`);
}

module.exports = c_color;