const crypto = require('node:crypto');
const fs = require('fs');

const players = require('./Lists').players;
const tick = require('./Tick');

class Utils {
    constructor() {}

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

    msgAll(msg) {
        tick.requests.push({
            r: {
                t: 'm',
                r: {
                    id: 'server',
                    show: false,
                    m: msg,
                }
            },
    
            c: this.getAllPlayerClients()
        });
    }

    nClient(c, t, d, color, s = true) {
        tick.requests.push({
            r: {
                t: 'n',
                r: {
                    t: t,
                    d: d,
                    color: color,
                    s: s
                }
            },
    
            c: [c]
        });
    }

    nAll(t, d, color, s = true) {
        tick.requests.push({
            r: {
                t: 'n',
                r: {
                    t: t,
                    d: d,
                    color: color,
                    s: s
                }
            },
    
            c: this.getAllPlayerClients()
        });
    }

    loadMotd() {
        this.motd = fs.readFileSync("./src/motd.txt", { encoding: 'ascii' }).split(process.platform === "win32" ? '\r\n' : '\n');
    }

    getBalls() {
        let balls = [];

        for (let i of players) {
            balls.push({ id: i[1].id, info: i[1].getPublicInfo() });
        }

        return balls;
    }

    isColor(color) {
        return typeof color === "string" && color.length === 6 && !isNaN(Number("0x" + color));
    }
}

module.exports = new Utils();