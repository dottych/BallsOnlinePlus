const utils = require('../../Utils');
const map = require('../../Map');
const maps = require('../../Lists').maps;

const c_mapinfo = (c, input) => {
    utils.msgClient(c, `ID: ${map.mapID}, draw duration: ${maps.get(map.mapID)[0][1]}, title: ${maps.get(map.mapID)[0][0]}`);
}

module.exports = c_mapinfo;