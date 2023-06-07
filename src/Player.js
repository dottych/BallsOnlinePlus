const utils = require('./Utils');
const tick = require('./Tick');

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

        this.drew = false;

        this.tick();
    }

    tick() {
        setInterval(() => {
            if (this.x !== this.px || this.y !== this.py) {
                this.px = this.x;
                this.py = this.y;

                tick.requests.push({
                    r: {
                        t: 'bm',
                        r: { id: this.id, x: this.x, y: this.y }
                    },
                    
                    c: utils.getOtherPlayerClients(this.c)
                });
            }

            if (this.drew) tick.requests.push({
                r: {
                    t: 'd',
                    r: { x: this.x, y: this.y, color: this.color }
                },

                c: utils.getAllPlayerClients()
            }), this.drew = false;
        }, 50);
    }

    getPublicInfo() {
        return {
            id: this.id,
            name: this.name,
            color: this.color,
            x: this.x,
            y: this.y,
            joined: this.joined
        };
    }
}

module.exports = Player;