const players = require('../Lists').players;
const maps = require('../Lists').maps;
const cosmetics = require('../Lists').cosmetics;
const tick = require('../Tick');
const utils = require('../Utils');
const map = require('../Map');
const bridge = require('../Bridge');

// for server msgs use id: 'server', show: false

// importing time
const c_help = require('./Commands/help');
const c_name = require('./Commands/name');
const c_color = require('./Commands/color');
const c_cosmetic = require('./Commands/cosmetic');
const c_respawn = require('./Commands/respawn');
const c_mapinfo = require('./Commands/mapinfo');
const c_newmap = require('./Commands/newmap');
const c_notify = require('./Commands/notify');
const c_tp = require('./Commands/tp');
const c_kick = require('./Commands/kick');
const c_admin = require('./Commands/admin');

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
                    c_help(c, input);
                    break;

                case 'name':
                case 'nick':
                case 'nickname':
                    c_name(c, input);
                    break;

                case 'color':
                case 'colour':
                    c_color(c, input);
                    break;

                case 'cosmetic':
                    c_cosmetic(c, input);
                    break;

                case 'respawn':
                    c_respawn(c, input);
                    break;

                case 'mapinfo':
                    c_mapinfo(c, input);
                    break;

                case 'newmap':
                    c_newmap(c, input);
                    break;

                case 'notify':
                    c_notify(c, input);
                    break;

                case 'tp':
                    c_tp(c, input);
                    break;

                case 'kick':
                    c_kick(c, input);
                    break; 
                
                case 'admin':
                    c_admin(c, input);
                    break;

            }

        } else if (data.r.m.indexOf(process.env.ADMIN_PASS) < 0) {
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