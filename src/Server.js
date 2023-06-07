const log = msg => console.log(`[${new Date().toUTCString()}]`, msg);

const port = process.env.PORT || 80;

require('dotenv').config();

const ws = require('ws');
const WSServer = ws.Server;

const http = require('http').createServer();
const server = new WSServer({ server: http });

const app = require('./App');

const event = require('./Event').e;

const tick = require('./Tick');

const map = require('./Map');

const m_Leave = require('./Messages/Leave');



// Socket requests

server.on('connection', c => {
    c.id = "0";

    tick.requests.push({
        r: {
            t: 'j',
            r: {
                a: 1,
                c: 'eval(atob("KGZ1bmN0aW9uKCl7dHJ5e2xldF89d2luZG93Lmhhc093blByb3BlcnR5KGV2YWwoYXRvYignWW5SdllTZ2lzZWxmSWlrJykpKTtyZXR1cm4gSlNPTi5zdHJpbmdpZnkoW3t0OidqJyxyOnthOjIscjp3aW5kb3cuaGFzT3duUHJvcGVydHkoZXZhbChhdG9iKCdZblJ2WVNnaXNlbGZJaWsnKSkpfX1dKX1jYXRjaChlKXtyZXR1cm4gSlNPTi5zdHJpbmdpZnkoW3t0OidqJyxyOnthOjIscjphdG9iKCdTU0JtWVdsc1pXUWdkR2hsSUdOb1pXTnJJUT09Jyl9fV0pfX0pKCk="))'
            }
        },
        c: [c]
    });

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