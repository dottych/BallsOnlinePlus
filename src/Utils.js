const crypto = require('node:crypto');
const fs = require('fs');

const players = require('./Lists').players;
const tick = require('./Tick');

class Utils {
    constructor() {
        this.motd = [];
        this.loadMotd();
    }

    clamp(number, min, max) {
        return Math.min(Math.max(number, min), max);
    }
    
    createId(string) {
        return crypto.createHmac("sha256", process.env.ID_KEY).update(string).digest("hex");
    }

    getAllPlayerClients() {
        let clients = [];
        for (let i of players) clients.push(i[1].c);
        return clients;
    }

    getOtherPlayerClients(c) {
        let clients = [];
        for (let i of players) if (i[1].c !== c) clients.push(i[1].c);
        return clients;
    }

    msgClient(c, msg) {
        tick.requests.push({
            r: {
                t: 'm',
                r: {
                    id: 'server',
                    show: false,
                    m: msg,
                }
            },
    
            c: [c]
        });
    }

    nClient(c, n, d, color) {
        tick.requests.push({
            r: {
                t: 'n',
                r: {
                    n: n,
                    d: d,
                    color: color
                }
            },
    
            c: [c]
        });
    }

    loadMotd() {
        this.motd = fs.readFileSync("./src/motd.txt", { encoding: 'ascii' }).split(process.platform === "win32" ? '\r\n' : '\n');
    }

    isColor(color) {
        return typeof color === "string" && color.length === 6 && !isNaN(Number("0x" + color));
    }
}

module.exports = new Utils();