const utils = require('../../Utils');
const map = require('../../Map');
const maps = require('../../Lists').maps;

const c_mapinfo = (c, input) => {
    utils.msgClient(c, `ID: ${map.mapID}, title: ${maps.get(map.mapID)[0]}`);
}

module.exports = c_mapinfo;