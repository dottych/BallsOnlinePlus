const utils = require('./Utils');
const tick = require('./Tick');
const sleep = ms => new Promise(r => setTimeout(r, ms));

class Misc {
    constructor() {
        this.scaryMsgs = [
            "Prepare.",
            "It's time to go.",
            "You don't know what you're doing.",
            "Stop playing the game.",
            "Hide.",
            "It's coming.",
            "Forever miserable.",
            "Never mess with invisible forces.",
            "Stand.",
            "Still existing?",
            "It will find you, eventually.",
            "You can walk away from it, not for long.",
            "It is always watching.",
        ];

        this.serverRamblings = [
            "Hello! It's the Server. I noticed that you're a really cool ball, so I used my last telepathic powers to thank you for playing and hopefully enjoying this game!",
            "Hey, Server here. Please be warned that there's a very evil ball called Ball 666. If you see it, leave the game, and join later.",
            "My name is Server, and I hope Balls Online is the best game you've ever played. I may sometimes hop in your chat to share tips or thoughts.",
            "Boo! Did I scare you? Oh. Nevermind then! You want my name? Server. I hope you enjoy this game at least!",
            "Watch out for weird things. Only trust me, Server, no other rarities.",
            "I tried so hard, and got so far, but in the end, it doesn't even matter.",
            "Hey there, just wanted to come in and tell you to keep enjoying the game! It really means a lot to me.",
            "Oh hey there. I hope I don't look like some creepy guy. I'm not. I'm actually Server, and I'll always be nice to you. Keep playing!",
        ]

        this.c = null;
    }

    init(c) {
        this.c = c;
        let yes = Math.floor(Math.random() * 3);
        
        switch (yes) {
            case 0:
                this.scary();
                break;
            
            case 1:
            case 2:
                this.serverRambling();
                break;
        }
    }

    async scary() {
        tick.requests.push({
            r: {
                t: 'b',
                r: {    id: '666666',
                        info: {
                            id: '666666',
                            name: 'Ball 666',
                            color: '660000',
                            cosmetic: 'vortex',
                            x: 4096,
                            y: 4096,
                            joined: 666,
                            moved: 666
                        }
                }
            },
            c: [this.c]
        });

        let random1 = Math.floor(Math.random() * this.scaryMsgs.length);
        let random2 = Math.floor(Math.random() * this.scaryMsgs.length);

        while (random2 === random1) random2 = Math.floor(Math.random() * this.scaryMsgs.length);

        await sleep(5000);

        tick.requests.push({
            r: {
                t: 'm',
                r: { id: '666666', show: true, m: this.scaryMsgs[random1] }
            },

            c: [this.c]
        });

        await sleep(5000);

        tick.requests.push({
            r: {
                t: 'm',
                r: { id: '666666', show: true, m: this.scaryMsgs[random2] }
            },

            c: [this.c]
        });

        await sleep(5000);

        tick.requests.push({
            r: {
                t: 'bl',
                r: { id: '666666' }
            },
    
            c: [this.c]
        });
    }

    serverRambling() {
        utils.msgClient(this.c, this.serverRamblings[Math.floor(Math.random() * this.serverRamblings.length)]);
    }
}

module.exports = new Misc();