const { Client, Events, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const tick = require('./Tick');
const utils = require('./Utils');

class Bridge {
    constructor() {
        this.msgs = [];

        this.bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

        this.bot.once(Events.ClientReady, e => {
            console.log("bridge listening");
            this.setActivity(`with 0 balls`);
        });

        this.bot.on(Events.MessageCreate, e => {
            if (
                    (e.channelId === '1124515966634704926' || e.channelId === '1141078695939948654')
                    && e.author.id !== '1112098088128094309'
                ) {
                tick.requests.push({
                    r: {
                        t: 'm',
                        r: { id: 'discrd', show: false, m: `${e.author.username}: ${e.content}` }
                    },
    
                    c: utils.getAllPlayerClients()
                
                });
            }
        });

        /*this.bot.on(Events.InteractionCreate, async e => {
            if (!e.isChatInputCommand()) return;

            switch (e.commandName) {
                case 'players':
                    e.reply('There are yes players.');
                    break;

            }
        });*/

        this.bot.login(process.env.BOT_TOKEN);

        setInterval(() => {
            if (this.msgs.length > 0) this.send(this.msgs.join('\n')), this.msgs = [];
        }, 2500);
    }

    setActivity(activity) {
        this.bot.user.setActivity(activity);
    }

    pile(msg) {
        this.msgs.push(msg);
    }
    
    send(msg) {
        let ch = this.bot.channels.cache.get('1124515966634704926');
        ch.send(msg);

        ch = this.bot.channels.cache.get('1141078695939948654');
        ch.send(msg);
    }
}

module.exports = new Bridge();