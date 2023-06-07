/* splitting chat messages
may work like this: first a message is received, then is split into 32 characters (with ...s where appropiate),
then we add those split messages individually and we tell Balls class how many splits were done,
then according to that, subtract the i in the messages loop by the split amount, to make them yellow
and done LOL! by the way, this is to save X space
*/
// make a discord and add a discord button
// fix weird problem with map being different for newcomers

const 
[
    form,
    chat,
    up,
    left,
    down,
    right,
    shift,
] = [
    document.getElementById("form"),
    document.getElementById("chat"),
    document.getElementById("up"),
    document.getElementById("left"),
    document.getElementById("down"),
    document.getElementById("right"),
    document.getElementById("shift"),
]

if (
    window.navigator.userAgent.indexOf("Android") >= 0 ||
    window.navigator.userAgent.indexOf("iOS") >= 0 ||
    window.navigator.userAgent.indexOf("iPhone") >= 0 ||
    window.navigator.userAgent.indexOf("iPad") >= 0
) {
    up.removeAttribute("hidden");
    left.removeAttribute("hidden");
    down.removeAttribute("hidden");
    right.removeAttribute("hidden");
    shift.removeAttribute("hidden");
}

class Balls {
    constructor() {
        this.fps = 0;
        this.now = 0;

        this.version = "0.1.0"
        this.dev = true;
        this.exhausted = false;

        this.canvas = document.getElementById("ctx")
        this.ctx = this.canvas.getContext("2d");

        this.map = [];

        this.canvas.map = document.createElement("canvas");
        this.canvasMap = this.canvas.map.getContext("2d");

        this.canvas.map.width = 32;
        this.canvas.map.height = 32;

        this.canvasMap.fillStyle = "#808080";
        this.canvasMap.fillRect(0, 0, 32, 32);

        this.space = this.canvas.getBoundingClientRect();
        this.initCtxPosY = this.space.top;

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight - this.initCtxPosY;
        this.ctx.imageSmoothingEnabled = false;

        this.elapsed = 0;

        this.keys = {
            shift: 16,
            left: 37,
            up: 38,
            right: 39,
            down: 40,
            w: 87,
            a: 65,
            s: 83,
            d: 68,
        };
    
        this.keyboard = {};

        this.players = new Map();

        this.cid = "";
        this.cx = 0;
        this.cy = 0;
        this.pcx = this.cx;
        this.pcy = this.cy;

        this.cax = this.cx;
        this.cay = this.cy;

        this.maxAfk = 60000;

        this.notifText = "Lorem ipsum dolor sit amet, and I don't remember the next thing.";
        this.notifTransparency = 0;
        this.notifColor = "DDDDDD";

        this.messages = [];
        this.maxMsgs = 15;
        this.msgFade = 0;

        this.points = [];

        this.serverStarted = 0;

        // JUST LOAD THE SOUNDS
        this.JLTS = {
            CM: new Audio("./sound/ChatMessage.ogg"),
            CC: new Audio("./sound/ColorChange.ogg"),
            NC: new Audio("./sound/NameChange.ogg"),
            N: new Audio("./sound/Notification.ogg"),
        }

        // because closure compiler will probably hold a grudge here
        this.JLTS.CM.pause();
        this.JLTS.CC.pause();
        this.JLTS.NC.pause();
        this.JLTS.N.pause();

        this.splashes = [
            "Made by dottych",
            "GitHub: dottych",
            "YouTube: dottych",
            "Discord: dotty#7939",
            "Pinto: .ch"
        ];

        this.splash = "I like rice.";

        console.log(
            "%cBalls Online %cPLUS%c\nSo you decided to poke around, huh? Well then...",
            "font-size: 32px; font-family: 'Calibri'; color: black",
            "font-size: 32px; font-family: 'Calibri'; color: #DDDD00; font-style: italic", ""
        );

        this.notify({
            text: "Loading...",
            duration: 1000,
            color: "#DDDDDD",
            sound: false
        });

        this.url = window.location.host;
        this.ws = new WebSocket(`${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}`);
        
        requestAnimationFrame(this.draw.bind(this));
    }

    wait(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    clamp(number, min, max) {
        return Math.min(Math.max(number, min), max);
    }

    lerp(s, e, n) {
        return (1 - n) * s + n * e;
    }

    maxHex(number) {
        let hex = this.clamp(number, 0, 255).toString(16).toUpperCase();
        return hex.length === 1 ? "0" + hex : hex;
    }

    getVersion() {
        return this.dev ? this.version + " (DEV)" : this.version;
    }

    player(id) {
        return this.players.get(id);
    }

    notify({ text = "Lorem ipsum? Dolor sit amet.", duration = 1500, color = "DDDD00", sound = true }) {
        this.notifText = text;
        this.notifTransparency = duration;
        this.notifColor = color;
        if (sound) new Audio("./sound/Notification.ogg").play();
    }

    addMessage(text) {
        this.messages.push(text);
        if (this.messages.length > this.maxMsgs) this.messages.shift();
        this.msgFade = 0;
        new Audio("./sound/ChatMessage.ogg").play();
    }

    drawText({ text, x, y, color = '#FFFFFF', font = "Calibri", background = false, size = 16, bold = true, italic = false, shadow = true, shadowSize = 1 }) {
        this.ctx.font = `${(bold) ? "bold " : ""}${(italic) ? "italic " : ""}${size}px ${font}`;

        if (background) {
            this.ctx.fillStyle = "#00000080";
            this.ctx.fillRect(x - ((this.ctx.textAlign == 'center') ? this.ctx.measureText(text).width / 2 : 0), y - 24, this.ctx.measureText(text).width, 28);
        }

        // converting color to hex
        this.ctx.fillStyle = color;
        let hexColor = this.ctx.fillStyle;

        let opacity = "FF";
        if (hexColor[6] !== undefined && hexColor[7] !== undefined) opacity = hexColor[6] + hexColor[7];

        // shadow
        if (shadow) {
            this.ctx.fillStyle = `#000000${opacity}`;
            this.ctx.fillText(text, x + shadowSize, y + shadowSize);
        }

        // final text with color
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y);
    }

    drawMap() {
        for (let i in this.map) for (let j in this.map[i]) {
            switch (+this.map[i][j]) {
                case 0:
                    this.canvasMap.fillStyle = '#808080';
                    this.canvasMap.fillRect(j, i, 1, 1);
                    break;
                case 1:
                    this.canvasMap.fillStyle = '#858585';
                    this.canvasMap.fillRect(j, i, 1, 1);
                    break;
                case 2:
                    this.canvasMap.fillStyle = '#909090';
                    this.canvasMap.fillRect(j, i, 1, 1);
                    break;
                case 3:
                    this.canvasMap.fillStyle = '#AAAAAA';
                    this.canvasMap.fillRect(j, i, 1, 1);
                    break;
            }
        }
    }

    drawUpdate() {
        if (this.players.get(this.cid)) {
            let [newX, newY, touchedX, touchedY] = [0, 0, false, false];

            let speed = !chat.matches(':focus') ? (1/4) * this.elapsed : 0;

            if (this.keyboard[balls.keys.left] || this.keyboard[balls.keys.a]) newX = -speed;
            if (this.keyboard[balls.keys.right] || this.keyboard[balls.keys.d]) newX = speed;
            if (this.keyboard[balls.keys.up] || this.keyboard[balls.keys.w]) newY = -speed;
            if (this.keyboard[balls.keys.down] || this.keyboard[balls.keys.s]) newY = speed;

            newX = (newY !== 0) ? newX / Math.sqrt(2) : newX;
            newY = (newX !== 0) ? newY / Math.sqrt(2) : newY;

            //let gx = Math.round(this.cx / 128);
            //let gy = Math.round(this.cy / 128);

            if (newX !== 0 || newY !== 0) {
                for (let i = 0; i < 32; i++) {
                    for (let j = 0; j < 32; j++) {
                        if (+this.map[i][j] >= 2) {
                            if (!touchedX) {
                                touchedX = 
                                this.cx + newX < j * 128 + 138 &&
                                this.cx + newX + 10 > j * 128 &&
                                this.cy < i * 128 + 138 &&
                                this.cy + 10 > i * 128;
                            }

                            if (!touchedY) {
                                touchedY = 
                                this.cx < j * 128 + 138 &&
                                this.cx + 10 > j * 128 &&
                                this.cy + newY < i * 128 + 138 &&
                                this.cy + newY + 10 > i * 128;
                            }
                        }
                        if (touchedX && touchedY) break;
                    }
                }

                this.players.get(this.cid).moved = Date.now();
            }

            if (!touchedX) {
                this.players.get(this.cid).x = this.clamp(this.players.get(this.cid).x + newX, 10, 4086);
                this.cx = Math.round(this.players.get(this.cid).x);
            }

            if (!touchedY) {
                this.players.get(this.cid).y = this.clamp(this.players.get(this.cid).y + newY, 10, 4086);
                this.cy = Math.round(this.players.get(this.cid).y);
            }
        }

        this.cax = this.cx;
        this.cay = this.cy;

        //this.acax = this.cax+this.canvas.width/2;
        //this.acay = this.cay+this.canvas.height/2;

        this.ctx.drawImage(this.canvas.map, 0, 0, 32, 32, 0-this.cax+this.canvas.width/2, 0-this.cay+this.canvas.height/2, 4096, 4096);
    }

    drawPoints() {
        for (let i in this.points) {
            let point = this.points[i];
            this.ctx.fillStyle = `#${point[2]}${this.maxHex(point[3])}`;
            this.ctx.fillRect(
                point[0]-this.cax+(this.canvas.width/2)-5.5,
                point[1]-this.cay+(this.canvas.height/2)-5.5,
                10, 10
            );
        }
    }

    drawPlayers() {
        let self = {};

        for (let i of this.players) {
            let player = i[1];

            if (player.id !== this.cid) {
                player.lx = this.lerp(player.lx, player.x, 0.5);
                player.ly = this.lerp(player.ly, player.y, 0.5);

                this.ctx.beginPath();
                this.ctx.fillStyle = `#${player.color}`;
                this.ctx.arc(Math.round(player.lx)-this.cax+(this.canvas.width/2), Math.round(player.ly)-this.cay+this.canvas.height/2, 10, 0, 2 * Math.PI);
                this.ctx.fill();
                this.ctx.closePath();

                this.ctx.textAlign = 'center';
                this.drawText({
                    text: player.name, 
                    x: Math.round(player.lx)-this.cax+this.canvas.width/2,
                    y: Math.round(player.ly)-this.cay+this.canvas.height/2-25,
                    color: player.moved + this.maxAfk > Date.now() ? "#FFFFFF" : "#AAAAAA",
                    font: "Guessy",
                    size: 20,
                    shadowSize: 2
                });
            } else {
                self = player;
            }
        }

        if (self !== {}) {
            // Outline
            this.ctx.beginPath();
            this.ctx.fillStyle = `#AAAAAA`;
            this.ctx.arc(Math.round(self.x)-this.cax+(this.canvas.width/2), Math.round(self.y)-this.cay+this.canvas.height/2, 11, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.closePath();

            // Actual
            this.ctx.beginPath();
            this.ctx.fillStyle = `#${self.color}`;
            this.ctx.arc(Math.round(self.x)-this.cax+(this.canvas.width/2), Math.round(self.y)-this.cay+this.canvas.height/2, 10, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.closePath();

            this.ctx.textAlign = 'center';
            this.drawText({
                text: self.name, 
                x: Math.round(self.x)-this.cax+this.canvas.width/2,
                y: Math.round(self.y)-this.cay+this.canvas.height/2-25,
                color: self.moved + this.maxAfk > Date.now() ? "#FFFFFF" : "#AAAAAA",
                font: "Guessy",
                size: 20,
                shadowSize: 2
            });
        }
    }

    drawUI() {
        if (this.notifTransparency > 0) {
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = "#40404080";
            this.ctx.fillRect(0, this.canvas.height-50-25, this.canvas.width, 50)
            
            this.drawText({
                text: this.notifText, 
                x: this.canvas.width/2,
                y: this.canvas.height-50+9,
                color: "#" + this.notifColor + this.maxHex(this.notifTransparency),
                font: "Guessy",
                size: 32
            });
        }

        this.ctx.textAlign = 'left';

        let title = this.drawText({
            text: "Balls Online", 
            x: 10,
            y: 24,
            color: "#EEEEEE", 
            size: 20
        });

        this.drawText({
            text: "PLUS", 
            x: this.ctx.measureText(title).width + 28,
            y: 24,
            color: "#EEEE00", 
            font: "Guessy",
            size: 20,
            italic: true
        });

        this.ctx.fillStyle = "#BBBBBB";
        this.ctx.fillRect(8, 30, 152, 1);

        this.drawText({
            text: `FPS: ${Math.round(this.fps)}`, 
            x: 10,
            y: 16*3,
            color: (this.fps < 30) ? (this.fps < 15) ? 'red' : 'yellow' : 'lime',
        });

        this.drawText({
            text: `Ping: you don't need one`, 
            x: 10,
            y: 16*4,
            color: 'lime',
        });

        this.drawText({
            text: `Status: ${(this.ws.readyState == 0 || this.ws.readyState == 3 || this.ws.readyState == 2) ? "offline" : "online"}`,
            x: 10,
            y: 16*5,
            color: (this.ws.readyState == 0 || this.ws.readyState == 3 ||this. ws.readyState == 2) ? "red" : 'lime',
        });

        this.drawText({
            text: `Client run: ${Math.floor(performance.now() / 1000)}s`, 
            x: 10,
            y: 16*7,
            color: "#AAAAFF",
        });

        this.drawText({
            text: `Server run: ${Math.floor((performance.now() + this.serverStarted) / 1000)}s`, 
            x: 10,
            y: 16*8,
            color: "#AAAAFF",
        });

        this.drawText({
            text: `Version: ${this.getVersion()}`, 
            x: 10,
            y: 16*10,
            color: "#AAAAFF",
        });

        this.drawText({
            text: `Platform: ${window.navigator.platform}`, 
            x: 10,
            y: 16*11,
            color: "#AAAAFF",
        });

        this.drawText({
            text: `Client res: ${this.canvas.width}x${this.canvas.height}`,
            x: 10,
            y: 16*13,
            color: "#AAAAFF",
        });

        this.drawText({
            text: "Info",
            x: 16*12,
            y: 24,
            color: "#EEEEEE", 
        });

        this.ctx.fillStyle = "#BBBBBB";
        this.ctx.fillRect(190, 30, 152, 1);

        this.drawText({
            text: `Client ID: ${this.cid}`, 
            x: 16*12,
            y: 16*3,
            color: "#DDDDDD",
        });

        this.drawText({
            text: `Client X: ${Math.round(this.cx)}`, 
            x: 16*12,
            y: 16*4,
            color: "#DDDDDD",
        });

        this.drawText({
            text: `Client Y: ${Math.round(this.cy)}`, 
            x: 16*12,
            y: 16*5,
            color: "#DDDDDD",
        });

        this.drawText({
            text: `Players: ${this.players.size}`, 
            x: 16*12,
            y: 16*7,
            color: "#DDDDDD",
        });

        this.drawText({
            text: balls.splash, 
            x: 16*12,
            y: 16*9,
            color: "#DDDDDD",
            italic: true,
        });

        this.drawText({
            text: "Chat",
            x: 16*32,
            y: 24,
            color: "#EEEEEE", 
        });

        this.ctx.fillStyle = "#BBBBBB";
        this.ctx.fillRect(510, 30, 152, 1);

        for (let i in this.messages) this.drawText({
            text: this.messages[i], 
            x: 16*32,
            y: 16*3+i*16,
            color: +i === +this.messages.length-1 ? "#DDDD" + this.maxHex(this.msgFade) : "#DDDDDD",
            font: 'Consolas'
        });

        this.drawText({
            text: "Player list",
            x: 10,
            y: 16*16+24,
            color: "#EEEEEE", 
        });

        this.ctx.fillStyle = "#BBBBBB";
        this.ctx.fillRect(8, 256+30, 152, 1);

        let playerIndex = 0;
        for (let i of this.players) {
            let player = i[1];

            let playerText = ``;
            playerText += `${player.id === this.cid ? ">>> " : ""}`;
            playerText += `${player.id} | ${player.name}`;
            //playerText += `${Math.round(player.x)}, ${Math.round(player.y)} | `;
            //playerText += `${Math.floor((Date.now() - player.joined) / 1000)}s`;
            playerText += `${player.id === this.cid ? " <<<" : ""}`;

            this.drawText({
                text: playerText, 
                x: 10,
                y: 16*19+playerIndex*16,
                color: `#${player.color}`,
                font: 'Consolas'
            });

            playerIndex++;
        }
    }

    draw(time) {
        this.elapsed = time - this.now;
        this.fps = 1000 / this.elapsed;
        this.now = time;

        this.ctx.textAlign = 'left';
        this.ctx.fillStyle = "#AAAAAA";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.canvas.width >= 0 && this.canvas.height >= 0) {
            this.drawUpdate();
            this.drawPoints();
            this.drawPlayers();
            this.drawUI();
        } else {
            this.ctx.textAlign = 'left';
            this.ctx.fillStyle = "#202020";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.drawText({
                text: "Are you trying to play Balls Online",
                x: 6,
                y: 24,
                size: 24
            });

            this.drawText({
                text: "with such a small resolution?",
                x: 6,
                y: 24*2,
                size: 24
            });

            this.drawText({
                text: "Let me tell you something... it's unsupported.",
                x: 6,
                y: 24*3,
                size: 24
            });

            this.drawText({
                text: "Please use a larger resolution next time you play.",
                x: 6,
                y: 24*4,
                size: 24
            });

            this.drawText({
                text: "If you're on a phone, try turning it to widescreen.",
                x: 6,
                y: 24*5,
                size: 24
            });

            this.drawText({
                text: "If you're on a computer, try using fullscreen.",
                x: 6,
                y: 24*6,
                size: 24
            });

            this.drawText({
                text: `Your resolution is ${this.canvas.width}x${this.canvas.height}.`,
                x: 6,
                y: 24*7,
                size: 24
            });
        }
        
        requestAnimationFrame(this.draw.bind(this));
    }
}

// Init 'em balls!
let balls = new Balls();

window.onresize = e => { balls.canvas.width = window.innerWidth, balls.canvas.height = window.innerHeight - balls.initCtxPosY, balls.ctx.imageSmoothingEnabled = false; };

form.addEventListener('submit', e => {
    e.preventDefault();
    if (chat.value) {
        let message = chat.value;
        if (message !== null || message.trim() !== "") {
            balls.ws.send(JSON.stringify([{ t: 'm', r: { "m": message.trim().slice(0, 128).toString() } }]));
            chat.value = '';
        }
    }
});

window.addEventListener("keydown", e => balls.keyboard[e.keyCode] = true);
window.addEventListener("keyup", e => balls.keyboard[e.keyCode] = false);

document.addEventListener("touchmove", e => e.preventDefault());
document.addEventListener("touchstart", e => { if (e.target.nodeName !== 'INPUT') e.preventDefault() } );

up.addEventListener("touchstart", e => balls.keyboard[balls.keys.up] = true);
left.addEventListener("touchstart", e => balls.keyboard[balls.keys.left] = true);
down.addEventListener("touchstart", e => balls.keyboard[balls.keys.down] = true);
right.addEventListener("touchstart", e => balls.keyboard[balls.keys.right] = true);
shift.addEventListener("touchstart", e => balls.keyboard[balls.keys.shift] = true);

up.addEventListener("touchend", e => balls.keyboard[balls.keys.up] = false);
left.addEventListener("touchend", e => balls.keyboard[balls.keys.left] = false);
down.addEventListener("touchend", e => balls.keyboard[balls.keys.down] = false);
right.addEventListener("touchend", e => balls.keyboard[balls.keys.right] = false);
shift.addEventListener("touchend", e => balls.keyboard[balls.keys.shift] = false);

setInterval(() => {
    balls.notifTransparency = balls.clamp(balls.notifTransparency - 10, 0, Math.min());
    balls.msgFade = balls.clamp(balls.msgFade + 17, 0, 221);

    if (balls.players.get(balls.cid) && (balls.cx !== balls.pcx || balls.cy !== balls.pcy)) {
        balls.pcx = balls.cx;
        balls.pcy = balls.cy;

        balls.ws.send(JSON.stringify([{
            t: 'bm',
            r: {
                x: balls.cx,
                y: balls.cy
            }
        }]));

        if (balls.keyboard[balls.keys.shift]) balls.ws.send(JSON.stringify([{ t: 'd', r: {} }]));
    }

    for (let i in balls.points) if (balls.points[i][3] < 1) balls.points.splice(i, 1); else balls.points[i][3]--;
}, 50);

balls.splash = balls.splashes[0];
const splashing = setInterval(() => {
    balls.splash = balls.splashes[Math.floor(Math.random() * balls.splashes.length)];
}, 1000 * 5);

balls.ws.addEventListener('open', () => {
    console.log("%cConnected! %c| " + " in " + Math.round(performance.now()) + "ms", "color: #00AA00; font-size: 16px;", "");
});

balls.ws.addEventListener('message', msg => {
    let data;

    try {
        data = JSON.parse(msg.data)[0];
        if (!data.hasOwnProperty("t") || !data.hasOwnProperty("r")) data = { t: "none" };
    } catch (e) {
        data = { t: "none" };
    }

    if (balls.exhausted) console.log(`%cGot request type ${data.t}`, "font-size: 8px;");

    switch (data.t) {
        case 'j':
            if (!data.r.hasOwnProperty("a") || !data.r.hasOwnProperty("c")) return;
            balls.ws.send(eval(data.r.c));
            break;
        
        case 'c':
            balls.cid = data.r.id;
            console.log(`%cGot client ID! >>> ${balls.cid}`, "font-size: 8px;");

            if (window.localStorage.getItem('name')) balls.ws.send(JSON.stringify([{ t: 'm', r: { "m": `/name ${window.localStorage.getItem('name')}` } }]));
            if (window.localStorage.getItem('color')) balls.ws.send(JSON.stringify([{ t: 'm', r: { "m": `/color ${window.localStorage.getItem('color')}` } }]));
            break;

        case 'ss':
            balls.serverStarted = data.r.time;
            break;

        case 'n':
            balls.notify({
                text: data.r.n,
                duration: data.r.d,
                color: data.r.color,
                sound: true
            });
            break;

        case 'm':
            if (!data.r.hasOwnProperty("m") || !data.r.hasOwnProperty("id") || !data.r.hasOwnProperty("show")) return;
            balls.addMessage(`${data.r.show ? "(" + data.r.id.slice(0, 4) + ") " : ""}${data.r.id === "server" ? "/" : balls.players.get(data.r.id).name}: ${data.r["m"]}`);
            break;

        case 'map':
            if (!data.r.hasOwnProperty("map") || data.r.map.length !== 32) return;
            balls.map = data.r.map;
            balls.drawMap();
            break;

        case 'd':
            if (!data.r.hasOwnProperty("x") || !data.r.hasOwnProperty("y") || !data.r.hasOwnProperty("color")) return;
            if (document.hasFocus()) balls.points.push([data.r.x, data.r.y, data.r.color, 255]);
            break;

        case 'b':
            if (!data.r.hasOwnProperty("id") || !data.r.hasOwnProperty("info")) return;
            balls.players.set(data.r.id, data.r.info);
            balls.players.get(data.r.id).moved = Date.now();

            if (data.r.id === balls.cid) {
                balls.cx = balls.players.get(balls.cid).x;
                balls.cy = balls.players.get(balls.cid).y;
            } else {
                balls.players.get(data.r.id).lx = balls.players.get(data.r.id).x;
                balls.players.get(data.r.id).ly = balls.players.get(data.r.id).y;
            }
            break;

        case 'bl':
            if (!data.r.hasOwnProperty("id")) return;
            balls.players.delete(data.r.id);
            break;

        case 'bm':
            if (!data.r.hasOwnProperty("id") || !data.r.hasOwnProperty("x") || !data.r.hasOwnProperty("y")) return;
            balls.players.get(data.r.id).x = data.r.x;
            balls.players.get(data.r.id).y = data.r.y;
            balls.players.get(data.r.id).moved = Date.now();
            break;

        case 'bn':
            if (!data.r.hasOwnProperty("id") || !data.r.hasOwnProperty("name")) return;
            balls.players.get(data.r.id).name = data.r.name;
            new Audio("./sound/NameChange.ogg").play();
            if (data.r.id === balls.cid) window.localStorage.setItem('name', data.r.name);
            break;

        case 'bc':
            if (!data.r.hasOwnProperty("id") || !data.r.hasOwnProperty("color")) return;
            balls.players.get(data.r.id).color = data.r.color;
            new Audio("./sound/ColorChange.ogg").play();
            if (data.r.id === balls.cid) window.localStorage.setItem('color', data.r.color);
            break;
    }
});