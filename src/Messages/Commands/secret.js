const utils = require('../../Utils');
const fs = require('fs');

const c_secret = (c, input) => {
    fs.appendFileSync('./hi.txt', "e");
    utils.msgClient(c, fs.readFileSync('./hi.txt').length.toString());
}

module.exports = c_secret;