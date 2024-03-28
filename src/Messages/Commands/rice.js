const lists = require('../../Lists');
const tick = require('../../Tick');
const utils = require('../../Utils');

const c_rice = (c, input) => {
    utils.msgClient(c, `This command does not exist.`);

    if (lists.players.get(c.id).riced) return;
    lists.players.get(c.id).riced = true;
    
    tick.requests.push({
        r: {
            t: 'tex',
            r: { texs: [
                "minecraft",
                "template",
                "smb1",
                "mandrillmaze",
                "smw",
                "orangecats",
            ] }
        },

        c: [c]
    });
}

module.exports = c_rice;