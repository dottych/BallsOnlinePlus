const EventEmitter = require('node:events');
const message = require('./Message');

class Event {
    constructor() {
        this.e = new EventEmitter();
    }
}

const event = new Event();

// Event listener
event.e.on('msg', data => message.handle(data.c, data.data));

module.exports = event;