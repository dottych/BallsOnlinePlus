const utils = require('../../Utils');

const c_uptime = (c, input) => {
    utils.msgClient(c, `The server is running for ${Math.floor(performance.now()/1000)}s.`);
}

module.exports = c_uptime;