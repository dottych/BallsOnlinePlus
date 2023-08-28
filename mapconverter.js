const jimp = require('jimp');
const fs = require('fs');

let mapID = 19;
let file = `./mapspng/${mapID}.png`;

let data = "";

jimp.read(file, (e,i) => {
    if (e) throw e;

    for (let k = 0; k < i.bitmap.height; k++) {
        for (let l = 0; l < i.bitmap.width; l++) {
            let color = i.getPixelColor(l,k).toString(16).toUpperCase().substring(0, 6);
            switch (color) {
                default:
                case '808080':
                    data += "0";
                    break;

                case '858585':
                    data += "1";
                    break;

                case '909090':
                    data += "2";
                    break;

                case 'AAAAAA':
                    data += "3";
                    break;

                case 'CDCDCD':
                    data += "4";
                    break;

            }
        }
    }

    fs.writeFileSync(`./maps/${mapID}.txt`, data);
});