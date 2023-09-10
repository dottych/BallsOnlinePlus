const utils = require('../../Utils');

const c_secret = (c, input) => {
    utils.msgClient(c, `The server is running for ${Math.floor(performance.now()/1000)}s.`);
}

module.exports = c_secret;