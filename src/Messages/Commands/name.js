const utils = require('../../Utils');
const players = require('../../Lists').players;
const tick = require('../../Tick');

const c_name = (c, input) => {
    if (input.trim() !== "") {
        if (input.trim().slice(0, 20) === players.get(c.id).name) utils.msgClient(c, `You already have this name!`);
        else {
            players.get(c.id).name = input.trim().slice(0, 20);

            tick.requests.push({
                r: {
                    t: 'bn',
                    r: { id: c.id, name: input.trim().slice(0, 20) }
                },
    
                c: utils.getAllPlayerClients()
            });

            utils.msgClient(c, `You have changed your name to ${players.get(c.id).name}.`);
        }
    } else utils.msgClient(c, `This name is invalid!`);
}

module.exports = c_name;