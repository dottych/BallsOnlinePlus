const log = msg => console.log(`[${new Date().toUTCString()}]`, msg);

const port = process.env.PORT || 80;

require('dotenv').config();

const ws = require('ws');
const WSServer = ws.Server;

const http = require('http').createServer();
const server = new WSServer({ server: http });

const app = require('./App');

const bridge = require('./Bridge');

const event = require('./Event').e;

const tick = require('./Tick');

const sauths = require('./Lists').sauths;

const m_Leave = require('./Messages/Leave');



// Socket requests

server.on('connection', c => {
    c.id = "0";
    c.secretAuthMagic = Math.floor(performance.now() % 420) + 1;
    c.secretAuthMethod = Math.floor(Math.random() * sauths.length);
    c.initialised = false;

    //console.log(tick.requests);

    c.on('message', msg => {
        let data;

        try {
            data = JSON.parse(msg)[0];
            if (!data.hasOwnProperty("t") || !data.hasOwnProperty("r")) data = { t: "none" };
        } catch (e) {
            //log(e);
            data = { t: "none" };
        } 

        event.emit("msg", {c, data});
    });

    c.on('close', () => {
        if (c.id !== "0") {
            //console.log("we lost a real one, he was " + c.id);
            m_Leave({ c });
        }
    }); 
});



// Web requests

http.on('request', app);

http.listen(port, () => {
    console.log("listening");
});