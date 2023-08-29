const utils = require('../../Utils');
const tick = require('../../Tick');
const players = require('../../Lists').players;

const c_notify = (c, input) => {
    if (players.get(c.id).admin) {
        tick.requests.push({
            r: {
                t: 'n',
                r: {
                    t: input,
                    d: 2000,
                    color: "DDDD00",
                    s: true
                }
            },
    
            c: utils.getAllPlayerClients()
        });
    }
    else utils.msgClient(c, `You are not an admin!`);
}

module.exports = c_notify;