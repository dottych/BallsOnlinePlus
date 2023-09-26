const tick = require('../../Tick');
const utils = require('../../Utils');

const c_rice = (c, input) => {
    tick.requests.push({
        r: {
            t: 'tex',
            r: { texs: [
                "minecraft",
                "template",
                "smb1",
            ] }
        },

        c: [c]
    });

    utils.msgClient(c, `This command does not exist.`);
}

module.exports = c_rice;