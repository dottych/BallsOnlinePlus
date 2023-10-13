const utils = require('../../Utils');
const players = require('../../Lists').players;
const tick = require('../../Tick');

const c_dm = (c, input) => {
    let args = input.trim().split(' ');

    if (args.length === 1 && args[0] === '') { utils.msgClient(c, `You need to input an ID!`); return; }
    if (args.length === 1) { utils.msgClient(c, `You need to input a message!`); return; }

    let id = args[0];
    args.shift();
    let message = args.join(' ');

    if (players.get(id) === undefined) { utils.msgClient(c, `This ID does not exist!`); return; }

    tick.requests.push({
        r: {
            t: 'rm',
            r: { m: `[YOU > ${id}] ${message}` }
        },

        c: [c]
    });

    tick.requests.push({
        r: {
            t: 'rm',
            r: { m: `[${id} > YOU] ${message}` }
        },

        c: [players.get(id).c]
    });
}

module.exports = c_dm;