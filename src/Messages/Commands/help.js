const utils = require('../../Utils');
const cosmetics = require('../../Lists').cosmetics;

const c_help = (c, input) => {
    if (input.trim() === "") utils.msgClient(c, `Commands: help, name, color, cosmetic, random, respawn, mapinfo, newmap, notify, uptime, dm, tp, kick, bridge, admin`);
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

        case 'cosmetic':
            utils.msgClient(c, `Gives you the specified cosmetic. List: ${cosmetics.join(', ')}`);
            break;

        case 'random':
            utils.msgClient(c, `Gives you a random look.`);
            break;

        case 'respawn':
            utils.msgClient(c, `Respawns you.`);
            break;

        case 'mapinfo':
            utils.msgClient(c, `Gives you info about the current map.`);
            break;

        case 'newmap':
            utils.msgClient(c, `Changes the map. Admin only.`);
            break;

        case 'notify':
            utils.msgClient(c, `Notifies all players with a specified message. Admin only.`);
            break;

        case 'uptime':
        case 'serverrun':
            utils.msgClient(c, `Says the server's uptime in seconds.`);
            break;

        case 'dm':
        case 'pm':
        case 'msg':
        case 'message':
        case 'mail':
        case 'whisper':
        case 'w':
            utils.msgClient(c, `DMs a specified player.`);
            break;

        case 'tp':
            utils.msgClient(c, `Teleports a player to a player. Admin only.`);
            break;

        case 'kick':
            utils.msgClient(c, `Kicks a specified player. Admin only.`);
            break;

        case 'bridge':
            utils.msgClient(c, `Toggles bridge. Admin only.`);
            break;
    
        case 'admin':
            utils.msgClient(c, `Gives you admin if the password is correct.`);
            break;

    }
}

module.exports = c_help;