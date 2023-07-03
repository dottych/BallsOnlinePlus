const utils = require('./Utils');
const tick = require('./Tick');
const m_Leave = require('./Messages/Leave');

class Player {
    constructor(c) {
        this.id = utils.createId(String(Date.now())).substring(0, 6);
        this.name = `Ball ${Number("0x" + this.id.substring(0, 4))}`;
        this.color = this.id.toUpperCase();
        this.c = c;

        c.id = this.id;

        this.admin = false;

        this.x = 1930 + Math.round(Math.random() * 235);
        this.y = 1930 + Math.round(Math.random() * 235);

        this.px = this.x;
        this.py = this.y;

        this.joined = Date.now();
        this.moved = Date.now();

        this.drew = false;

        this.pinged = false;
        this.pingAttempts = 0;

        this.tick();
    }

    tick() {
        setInterval(() => {
            if (this.x !== this.px || this.y !== this.py) {
                this.moved = Date.now();

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

                this.px = this.x;
                this.py = this.y;
            }

            
        }, 50);

        setInterval(() => {
            if (!this.pinged) this.pingAttempts++; else this.pingAttempts = 0;
            if (this.pingAttempts >= 2) m_Leave({ c: this.c });
        }, 15000);
    }

    getPublicInfo() {
        return {
            id: this.id,
            name: this.name,
            color: this.color,
            x: this.x,
            y: this.y,
            joined: this.joined,
            moved: this.moved
        };
    }
}

module.exports = Player;