const { Client, Events, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const tick = require('./Tick');
const utils = require('./Utils');

class Bridge {
    constructor() {
        this.bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

        this.bot.once(Events.ClientReady, e => {
            console.log("bridge listening");
        });

        this.bot.on(Events.MessageCreate, e => {
            if (e.channelId === '1124515966634704926' && e.author.id !== '1112098088128094309') {
                tick.requests.push({
                    r: {
                        t: 'm',
                        r: { id: 'discrd', show: false, m: `${e.author.username}: ${e.content}` }
                    },
    
                    c: utils.getAllPlayerClients()
                
                });
            }
        });

        this.bot.login(process.env.BOT_TOKEN);
    }
    
    send(msg) {
        let ch = this.bot.channels.cache.get('1124515966634704926');
        ch.send(msg);
    }
}

module.exports = new Bridge();