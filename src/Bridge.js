const { Client, Events, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');
require('dotenv').config();

const tick = require('./Tick');
const utils = require('./Utils');
const map = require('./Map');

const rest = new REST().setToken(process.env.BOT_TOKEN);

class Bridge {
    constructor() {
        this.msgs = [];
        this.activity = `with 0 balls`;
        this.online = false;
        this.canSend = true;

        this.commands = {};

        this.bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

        this.bot.once(Events.ClientReady, e => {
            this.online = true;
            console.log("bridge listening");
            this.setActivity(this.activity);
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

        this.bot.on(Events.InteractionCreate, async int => {
            if (!int.isChatInputCommand()) return;

            let command = this.commands[int.commandName];
            if (command !== undefined) {
                try {
                    await command.execute(int, { status: this.canSend });
                } catch (e) {
                    console.log(e);
                    if (int.replied || int.deferred) {
                        await int.followUp({ content: `Error... I don't know why, ok?`, ephemeral: true });
                    } else {
                        await int.reply({ content: `Error... I don't know why, ok?`, ephemeral: true });
                    }
                }
            }
        });

        this.bot.login(process.env.BOT_TOKEN);

        setInterval(() => {
            if (this.msgs.length > 0) {
                if (this.msgs.join('\n').length < 2000) if (this.canSend) this.send(this.msgs.join('\n'));
                this.msgs = [];
            }
        }, 2500);

        this.registerCommands();
    }

    addCommand(name, description, execute) {
        this.commands[name] = {
            data: new SlashCommandBuilder()
                .setName(name)
                .setDescription(description),
            execute: execute
        };
    }

    async registerCommands() {
        this.addCommand("players", "Shows all the players online.", async function(int, info) {
            let length = utils.getBalls().length;
            let playerString = "";

            for (let ball of utils.getBalls())
                playerString += `\n\`${ball.info.id}\` | \`${ball.info.name}\` | \`${ball.info.color}\` | \`${ball.info.cosmetic}\``

            await int.reply({ content: `There ${length === 1 ? "is" : "are"} ${length} player${length === 1 ? "" : "s"} online.\n${playerString}` });
        });

        this.addCommand("mapinfo", "Says the current map's info.", async function(int, info) {
            await int.reply({ content: `ID: ${map.mapID}, draw duration: ${map.currentMap().duration}, title: ${map.currentMap().name}` });
        });

        this.addCommand("uptime", "Says the server's uptime.", async function(int, info) {
            await int.reply({ content: `The server is running for ${Math.floor(performance.now()/1000)}s.` });
        });

        this.addCommand("bridge", "Says the bridge's status.", async function(int, info) {
            await int.reply({ content: `The bridge is ${info.status ? "on" : "off"}.` });
        });

        let commands = [];
        for (let command of Object.entries(this.commands)) commands.push(command[1].data.toJSON());

        await rest.put(
            Routes.applicationCommands('1112098088128094309'), { body: commands }
        );
    }

    setActivity(activity) {
        this.activity = activity; if (this.online) this.bot.user.setActivity(this.activity);
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