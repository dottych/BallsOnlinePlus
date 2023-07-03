const players = require('../Lists').players;
const tick = require('../Tick');
const utils = require('../Utils');
const map = require('../Map');
const bridge = require('../Bridge');

// for server msgs use id: 'server', show: false

const m_Message = ({ c, data }) => {
    if (!c.hasOwnProperty("id") || c.id === "0") return;
    if (!players.get(c.id)) return;

    if (data.r.m.trim() !== null && data.r.m.trim() !== "") {
        if (data.r.m[0] === "/") {
            let args = data.r.m.substring(1, data.r.m.length).split(" ");
            const command = args[0];
            args.shift();
            const input = args.join(' ')

            switch (command) {
                default:
                    utils.msgClient(c, `This command does not exist.`);
                    break;

                case 'help':
                case 'cmds':
                case 'commands':
                    if (input.trim() === "") utils.msgClient(c, `Commands: help, name, color, respawn, newmap, notify, admin`);
                    else switch (input.trim()) {
                        default:
                            utils.msgClient(c, `This command does not exist.`);
                            break;

                        case 'help':
                        case 'cmds':
                        case 'commands':
                            utils.msgClient(c, `Says all commands, if a command is specified, says the usage.`);
                            break;

                        case 'name':
                        case 'nick':
                        case 'nickname':
                            utils.msgClient(c, `Sets your name to the specified name.`);
                            break;

                        case 'color':
                        case 'colour':
                            utils.msgClient(c, `Sets your color to the specified hexadecimal color.`);
                            break;

                        case 'respawn':
                            utils.msgClient(c, `Respawns you.`);
                            break;

                        case 'newmap':
                            utils.msgClient(c, `Changes the map. Admin only.`);
                            break;

                        case 'newmap':
                            utils.msgClient(c, `Notifies everyone. Admin only.`);
                            break;
                        
                        case 'admin':
                            utils.msgClient(c, `Gives you admin if the password is correct.`);
                            break;

                    }
                    break;

                case 'name':
                case 'nick':
                case 'nickname':
                    if (input.trim() !== "") {
                        if (input.trim().slice(0, 20) === players.get(c.id).name) utils.msgClient(c, `You already have this name!`);
                        else {
                            players.get(c.id).name = input.trim().slice(0, 20);

                            tick.requests.push({
                                r: {
                                    t: 'bn',
                                    r: { id: c.id, name: input.trim().slice(0, 20) }
                                },
                    
                                c: utils.getAllPlayerClients()
                            });

                            utils.msgClient(c, `You have changed your name to ${players.get(c.id).name}.`);
                        }
                    } else utils.msgClient(c, `This name is invalid!`);
                    break;

                case 'color':
                case 'colour':
                    if (input.trim() !== "") {
                        if (input.trim().toUpperCase() === players.get(c.id).color) utils.msgClient(c, `You already have this color!`);
                        else if (utils.isColor(input.trim())) {
                            players.get(c.id).color = input.trim().toUpperCase();

                            tick.requests.push({
                                r: {
                                    t: 'bc',
                                    r: { id: c.id, color: input.trim().toUpperCase() }
                                },
                    
                                c: utils.getAllPlayerClients()
                            });

                            utils.msgClient(c, `You have changed your color to ${players.get(c.id).color}.`);
                        } else utils.msgClient(c, `This color is invalid!`);
                    }
                    break;

                case 'respawn':
                    players.get(c.id).x = 1930 + Math.round(Math.random() * 235);
                    players.get(c.id).y = 1930 + Math.round(Math.random() * 235);

                    tick.requests.push({
                        r: {
                            t: 'bm',
                            r: { id: c.id, x: players.get(c.id).x, y: players.get(c.id).y }
                        },
                
                        c: utils.getAllPlayerClients()
                    });

                    utils.msgClient(c, `You have respawned.`);
                    break;

                case 'newmap':
                    if (players.get(c.id).admin) map.changeMap();
                    else utils.msgClient(c, `You are not an admin!`);
                    break;

                case 'notify':
                    if (players.get(c.id).admin) {
                        tick.requests.push({
                            r: {
                                t: 'n',
                                r: {
                                    n: input,
                                    d: 2000,
                                    color: "DDDD00"
                                }
                            },
                    
                            c: utils.getAllPlayerClients()
                        });
                    }
                    else utils.msgClient(c, `You are not an admin!`);
                    break;

                case 'admin':
                    if (input === "SafestPassw0rd_TrustM3!") {
                        players.get(c.id).admin = true;
                        utils.msgClient(c, `You are now an admin.`);
                        utils.nClient(c, `You are now an admin.`, 1000, "DDDD00");
                    }
                    break;

            }

        } else {
            tick.requests.push({
                r: {
                    t: 'm',
                    r: { id: c.id, show: true, m: data.r.m.trim().slice(0, 128).toString() }
                },

                c: utils.getAllPlayerClients()
            
            });

            bridge.pile(`(${c.id}) ${players.get(c.id).name}: ${data.r.m.trim().slice(0, 128).toString()}`);
        }
    }

}

module.exports = m_Message;