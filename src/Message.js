/* 
    Message importing time!
*/

const m_Init = require('./Messages/Init');
const m_Join = require('./Messages/Join');
const m_Message = require('./Messages/Message');
const m_Move = require('./Messages/Move');
const m_Draw = require('./Messages/Draw');
const m_Ping = require('./Messages/Ping');

// finally, the class

class Message {
    constructor() {}

    send(c, data) {
        c.send(JSON.stringify([data]));
    }

    handle(c, data) {
        //console.log("got message:", data);
        if (!data.hasOwnProperty("t")) return;
        if (!data.hasOwnProperty("r")) return;

        switch (data.t) {
            case 'i':
                m_Init({ c, data });
                break;

            case 'j':
                if (data.r.r === true &&
                    data.r.hasOwnProperty("a") &&
                    data.r.a === (c.secretAuthMagic % 2 ? c.secretAuthMagic + 1 : c.secretAuthMagic - 1)
                )
                m_Join({ c, data }); else c.close();

                break;

            case 'p':
                m_Ping({ c, data });
                break;

            case 'm':
                if (data.r.hasOwnProperty("m")) m_Message({ c, data });
                break;

            case 'd':
                m_Draw({ c, data });
                break;

            case 'bm':
                if (data.r.hasOwnProperty("x") && data.r.hasOwnProperty("y"))
                m_Move({ c, data });

                break;
        }
    }
}

module.exports = new Message();