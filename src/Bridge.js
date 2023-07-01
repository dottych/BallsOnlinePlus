const { Client, Events, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

class Bridge {
    constructor() {
        this.bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

        this.bot.once(Events.ClientReady, e => {
            console.log("bridge listening");
        });

        this.bot.login(process.env.BOT_TOKEN);
    }
    
    send(msg) {
        let ch = this.bot.channels.cache.get('1124515966634704926');
        ch.send(msg);
    }
}

module.exports = new Bridge();