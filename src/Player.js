const utils = require('./Utils');
const tick = require('./Tick');
const maps = require('./Lists').maps;
const map = require('./Map');
const m_Leave = require('./Messages/Leave');

class Player {
    constructor(c) {
        this.id = utils.createId(String(Date.now())).substring(0, 6);
        this.name = `Ball ${Number("0x" + this.id.substring(0, 4))}`;
        this.color = this.id.toUpperCase();
        this.cosmetic = "none";
        this.c = c;

        c.id = this.id;

        this.admin = false;

        this.x = 3978 + Math.round(Math.random() * 235);
        this.y = 3978 + Math.round(Math.random() * 235);

        this.px = this.x;
        this.py = this.y;

        this.joined = Date.now();
        this.moved = Date.now();

        this.drew = false;
        this.moving = false;
        this.wrongMoves = 0;

        this.pinged = false;
        this.pingAttempts = 0;

        this.tick();
    }

    tick() {
        setInterval(() => {
            if ((this.x !== this.px || this.y !== this.py) &&
                !this.moving &&
                Math.sqrt(Math.abs(this.x - this.px)**2 + Math.abs(this.y - this.py)**2) < 100
            ) {
                let collided = this.checkCollision();
                this.moving = true;

                if (collided[0]) {
                    switch (collided[1]) {
                        default:
                            this.x = this.px;
                            this.y = this.py;

                            tick.requests.push({
                                r: {
                                    t: 'bm',
                                    r: { id: this.id, x: this.px, y: this.py }
                                },
                                
                                c: [this.c]
                            });
                            break;

                        case "Liquid":
                            this.x = 3978 + Math.round(Math.random() * 235);
                            this.y = 3978 + Math.round(Math.random() * 235);
                            //this.px = this.x;
                            //this.py = this.y;

                            tick.requests.push({
                                r: {
                                    t: 'bm',
                                    r: { id: this.id, x: this.x, y: this.y }
                                },
                                
                                c: utils.getAllPlayerClients()
                            });

                            utils.msgClient(this.c, `You've drowned!`);

                            break;
                    }
                } else {
                    tick.requests.push({
                        r: {
                            t: 'bm',
                            r: { id: this.id, x: this.x, y: this.y }
                        },
                        
                        c: utils.getOtherPlayerClients(this.c)
                    });

                    if (this.drew) tick.requests.push({
                        r: {
                            t: 'd',
                            r: { x: [this.px, this.x], y: [this.py, this.y], color: this.color }
                        },
        
                        c: utils.getAllPlayerClients()
                    }), this.drew = false;
                }

                this.px = this.x;
                this.py = this.y;

                this.moving = false;
                this.moved = Date.now();
                
                this.wrongMoves = 0;

                this.riced = false;
            }
        }, 50);

        // Check if client is still online
        setInterval(() => {
            if (!this.pinged) this.pingAttempts++; else this.pingAttempts = 0;
            if (this.pingAttempts >= 2) m_Leave({ c: this.c });
        }, 15000);
    }

    checkCollision() {
        let touchedX = false;
        let touchedY = false;
        let gx = Math.round(this.x / 128);
        let gy = Math.round(this.y / 128);
        let _map = maps.get(map.mapID)[1];

        if (!this.admin) for (let i = utils.clamp(gy-1, 0, 64); i < utils.clamp(gy+1, 0, 64); i++) {
            for (let j = utils.clamp(gx-1, 0, 64); j < utils.clamp(gx+1, 0, 64); j++) {
                if (map.blocks[+_map[i][j]].cannot) {
                    if (!touchedX) {
                        touchedX = 
                        this.x < j * 128 + 138 &&
                        this.x + 10 > j * 128 &&
                        this.y < i * 128 + 138 &&
                        this.y + 10 > i * 128;
                    }

                    if (!touchedY) {
                        touchedY = 
                        this.x < j * 128 + 138 &&
                        this.x + 10 > j * 128 &&
                        this.y < i * 128 + 138 &&
                        this.y + 10 > i * 128;
                    }
                }

                if (touchedX || touchedY) return [true, map.blocks[+_map[i][j]].name];
            }
        }

        return [false];
    }

    getPublicInfo() {
        return {
            id: this.id,
            name: this.name,
            color: this.color,
            cosmetic: this.cosmetic,
            x: this.x,
            y: this.y,
            joined: this.joined,
            moved: this.moved
        };
    }
}

module.exports = Player;