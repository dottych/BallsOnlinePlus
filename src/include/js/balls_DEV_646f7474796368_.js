// hide far away players and draw like a darker area (maybe not)
// collision check on server?
// improve collision by actually moving the ball back by a certain amount
// sounds toggle settings
// more 404 images

String.prototype.reverse = function() {return [...this].reverse().join('')};
String.prototype.wobbleCase = function() {
    let text = [...this];

    for (let letter in text) {
        const random = Math.floor(Math.random() * 2);
        text[letter] = random === 0 ? text[letter].toUpperCase() : text[letter].toLowerCase();
    }

    return text.join('');
}

"".reverse(), "".reverse(), "".wobbleCase(), "".wobbleCase();

const 
[
    info,
    discord,
    screenshot,
    settings,
    clear,
    form,
    chat,
    up,
    left,
    down,
    right,
    shift,
    title,
] = [
    document.getElementById("info"),
    document.getElementById("discord"),
    document.getElementById("screenshot"),
    document.getElementById("settings"),
    document.getElementById("clear"),
    document.getElementById("form"),
    document.getElementById("chat"),
    document.getElementById("up"),
    document.getElementById("left"),
    document.getElementById("down"),
    document.getElementById("right"),
    document.getElementById("shift"),
    document.getElementById("title"),
]

let
[
    clicked,
    initialised,
] = [
    false,
    false,
]

class Balls {
    constructor() {
        this.fps = 0;
        this.now = 0;

        this.version = "0.1.3"
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
        this.cx = 2048;
        this.cy = 2048;
        this.pcx = this.cx;
        this.pcy = this.cy;

        this.cax = this.cx;
        this.cay = this.cy;
        this.icax = this.cax;
        this.icay = this.cay;

        this.maxAfk = 60000;

        this.notifText = "Lorem ipsum dolor sit amet, and I don't remember the next thing.";
        this.notifTransparency = 0;
        this.notifColor = "DDDDDD";

        this.messages = [];
        this.maxMsgs = 18;
        this.msgFade = 0;
        this.msgSplit = 3; // using for future purposes

        this.points = [];

        this.serverStarted = 0;

        // JUST LOAD THE SOUNDS
        this.JLTS = {
            CM: new Audio("./sound/ChatMessage.ogg"),
            CC: new Audio("./sound/ColorChange.ogg"),
            NC: new Audio("./sound/NameChange.ogg"),
            N: new Audio("./sound/Notification.ogg"),
        };

        // because closure compiler will probably hold a grudge here
        this.JLTS.CM.pause();
        this.JLTS.CC.pause();
        this.JLTS.NC.pause();
        this.JLTS.N.pause();

        this.splashes = [
            "Made by dottych",
            "GitHub: dottych",
            "YouTube: dottych",
            "Discord: dottych",
            "Pinto: .ch"
        ];

        this.splash = "I like rice.";
        
        this.t = "";

        console.log(
            "%cBalls Online %cPLUS%c\nSo you decided to poke around, huh? Well then...",
            "font-size: 32px; font-family: 'Carlito'; color: black",
            "font-size: 32px; font-family: 'Carlito'; color: #DDDD00; font-style: italic", ""
        );

        this.frameDone = false;
        this.limitFPS = false;

        this.url = window.location.host;
        this.ws = new WebSocket(`${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}`);

        title.innerHTML = this.dev ? "Balls Online DEV" : "Balls Online";
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

    screenshot() {
        const url = this.canvas.toDataURL("image/png");
        const screenshot = document.createElement("a");
        screenshot.href = url;
        screenshot.download = `${this.cid.replace(/[^A-Za-z0-9_]+$/,"").replaceAll(" ","").substr(0,6)}${Date.now().toString(16)}.png`;
        screenshot.click();
        screenshot.remove();
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
        const length = +(window.localStorage.getItem('length') || 64);
        const messages = text.match(new RegExp(`.{1,${length}}`, "g"));

        for (let message of messages) {
            this.messages.push(message);
            if (this.messages.length > this.maxMsgs) this.messages.shift();
        }

        this.msgSplit = messages.length;
        this.msgFade = 0;

        new Audio("./sound/ChatMessage.ogg").play();
    }

    drawText({ text, x, y, color = '#FFFFFF', font = "Carlito", background = false, size = 16, bold = true, italic = false, shadow = true, shadowSize = 1, wobble = false }) {
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

        text = wobble ? text.wobbleCase() : text;

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

            if (this.keyboard[this.keys.left] || this.keyboard[this.keys.a]) newX = -speed;
            if (this.keyboard[this.keys.right] || this.keyboard[this.keys.d]) newX = speed;
            if (this.keyboard[this.keys.up] || this.keyboard[this.keys.w]) newY = -speed;
            if (this.keyboard[this.keys.down] || this.keyboard[this.keys.s]) newY = speed;

            newX = (newY !== 0) ? newX / Math.sqrt(2) : newX;
            newY = (newX !== 0) ? newY / Math.sqrt(2) : newY;

            let gx = Math.round((this.cx + newX) / 128);
            let gy = Math.round((this.cy + newY) / 128);

            if (newX !== 0 || newY !== 0) {
                for (let i = this.clamp(gy-1, 0, 32); i < this.clamp(gy+1, 0, 32); i++) {
                    for (let j = this.clamp(gx-1, 0, 32); j < this.clamp(gx+1, 0, 32); j++) {
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

        this.icax = this.lerp(this.icax, this.cax, 0.1);
        this.icay = this.lerp(this.icay, this.cay, 0.1);

        this.ctx.drawImage(this.canvas.map, 0, 0, 32, 32, 0-this.icax+this.canvas.width/2, 0-this.icay+this.canvas.height/2, 4096, 4096);
    }

    drawPoints() {
        for (let i in this.points) {
            let point = this.points[i];
            this.ctx.fillStyle = `#${point[2]}${this.maxHex(point[3])}`;
            this.ctx.fillRect(
                point[0]-this.icax+(this.canvas.width/2)-5.5,
                point[1]-this.icay+(this.canvas.height/2)-5.5,
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
                this.ctx.arc(Math.round(player.lx)-this.icax+(this.canvas.width/2), Math.round(player.ly)-this.icay+this.canvas.height/2, 10, 0, 2 * Math.PI);
                this.ctx.fill();
                this.ctx.closePath();

                this.ctx.textAlign = 'center';
                this.drawText({
                    text: player.name, 
                    x: Math.round(player.lx)-this.icax+this.canvas.width/2,
                    y: Math.round(player.ly)-this.icay+this.canvas.height/2-25,
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
            this.ctx.arc(Math.round(self.x)-this.icax+(this.canvas.width/2), Math.round(self.y)-this.icay+this.canvas.height/2, 11, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.closePath();

            // Actual
            this.ctx.beginPath();
            this.ctx.fillStyle = `#${self.color}`;
            this.ctx.arc(Math.round(self.x)-this.icax+(this.canvas.width/2), Math.round(self.y)-this.icay+this.canvas.height/2, 10, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.closePath();

            this.ctx.textAlign = 'center';
            this.drawText({
                text: self.name, 
                x: Math.round(self.x)-this.icax+this.canvas.width/2,
                y: Math.round(self.y)-this.icay+this.canvas.height/2-25,
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

        let t = "Balls Online";

        this.drawText({
            text: this.t, 
            x: 10,
            y: 24,
            color: "#EEEEEE", 
            size: 20,
        });

        this.drawText({
            text: "PLUS", 
            x: this.t === "Balls Online" ? this.ctx.measureText(t).width + 15 : this.ctx.measureText(this.t).width + 15,
            y: 24,
            color: "#EEEE00", 
            font: "Guessy",
            size: 20,
            italic: true,
            wobble: Math.floor(Math.random() * 100) === 0 ? true : false
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
            text: this.splash, 
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
            color: +i >= +this.messages.length-this.msgSplit ? "#DDDD" + this.maxHex(this.msgFade) : "#DDDDDD",
            font: 'LucidaConsole'
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
                font: 'LucidaConsole'
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

        if (this.canvas.width >= 960 && this.canvas.height >= 540) {
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
        
        if (this.limitFPS) this.frameDone = true; else requestAnimationFrame(this.draw.bind(this));
    }

    init() {
        clicked = true;

        if (this.limitFPS) setInterval(() => {
            if (this.frameDone) this.frameDone = false, requestAnimationFrame(this.draw.bind(this));
        }, 1000/30);
        else requestAnimationFrame(this.draw.bind(this));
        
        this.notify({
            text: "Connecting...",
            duration: 2000,
            color: "DDDDDD",
            sound: false
        });
    }
}

// Init 'em balls!
const balls = new Balls();

window.onresize = e => { balls.canvas.width = window.innerWidth, balls.canvas.height = window.innerHeight - balls.initCtxPosY, balls.ctx.imageSmoothingEnabled = false; };

// Chat

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

// Info buttons

info.addEventListener('click', e => {
    e.preventDefault();
    window.open("./info", "window", "width=854,height=480");
});

discord.addEventListener('click', e => {
    e.preventDefault();
    window.open("https://discord.gg/C2papHntB9", "window", "width=854,height=480");
});

screenshot.addEventListener('click', e => {
    e.preventDefault();
    balls.screenshot();
});

settings.addEventListener('click', e => {
    e.preventDefault();
    window.open("./settings", "window", "width=854,height=480");
});

clear.addEventListener('click', e => {
    e.preventDefault();
    balls.messages = [];
    balls.addMessage("Cleared chat.");
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
    if (balls.t === "") balls.t = Math.floor(Math.random() * 100) === 0 ?
    'atob'['KeyboardEvent'.substring(0,3).length]+
    'KeyboardEvent'[(Math.tan(Math.PI/2)+'')[9]]+
    'atob'['KeyboardEvent'.substring(0,3).length]+
    (typeof 'atob')[0]+"typeof 'string'"[6]+
    (typeof !1)[Math.floor(Math.PI / 2)]+
    (!1+'')[2]+
    (typeof KeyboardEvent)[4+Math.sin(Math.PI/2)]+
    (typeof Math.PI)[Math.sin(0 / Math.PI)]
    : (
        "e"+
        (null+'').replace(window.URL.name.toLowerCase().replace('r',''),'i')+
        (typeof Math.PI)[Math.sin(0 / Math.PI)]+
        (typeof !1)[Math.floor(Math.PI / 2)].toUpperCase()+
        ' '.reverse()+
        "sla".replace('l','ll')+
        'atob'['KeyboardEvent'.substring(0,3).length].toUpperCase()
    ).reverse();

    if (clicked && !initialised && balls.ws.readyState === 1) balls.ws.send(JSON.stringify([{ t: 'i', r: {} }])), initialised = true;

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

document.addEventListener('click', () => {
    if (!clicked) {
        document.getElementById("p").remove();
        form.removeAttribute("hidden");
        info.removeAttribute("hidden");
        discord.removeAttribute("hidden");
        screenshot.removeAttribute("hidden");
        settings.removeAttribute("hidden");
        clear.removeAttribute("hidden");
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
        balls.init();
    }
});

balls.ws.addEventListener('open', () => {
    //balls.ws.send(JSON.stringify([{ t: 'i', r: {} }]));
});

balls.ws.addEventListener('close', () => {
    balls.notify({
        text: "You got disconnected! Please refresh.",
        duration: 5000,
        color: 'FF4040',
        sound: true
    });
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
            balls.notify({
                text: "Loading...",
                duration: 2000,
                color: "DDDDDD",
                sound: false
            });
            console.log("%cConnected! %c| " + " in " + Math.round(performance.now()) + "ms", "color: #00AA00; font-size: 16px;", "");
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
            balls.addMessage(`${data.r.show ? "(" + data.r.id + ") " : ""}${data.r.id === "server" ? "/" : balls.players.get(data.r.id).name}: ${data.r["m"]}`);
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

        case 'l':
            if (!data.r.hasOwnProperty("balls")) return;
            for (let ball of data.r.balls) {
                if (!ball.hasOwnProperty("id") || !ball.hasOwnProperty("info")) return;
                balls.players.set(ball.id, ball.info);
                balls.players.get(ball.id).lx = balls.players.get(ball.id).x;
                balls.players.get(ball.id).ly = balls.players.get(ball.id).y;
            }
            break;

        case 'b':
            if (!data.r.hasOwnProperty("id") || !data.r.hasOwnProperty("info")) return;
            balls.players.set(data.r.id, data.r.info);
            if (window.localStorage.getItem('jlMsgs') === "true") balls.addMessage(`${data.r.id} joined the game`);

            balls.players.get(data.r.id).lx = balls.players.get(data.r.id).x;
            balls.players.get(data.r.id).ly = balls.players.get(data.r.id).y;
            break;

        case 'bl':
            if (!data.r.hasOwnProperty("id")) return;
            balls.players.delete(data.r.id);
            if (window.localStorage.getItem('jlMsgs') === "true") balls.addMessage(`${data.r.id} left the game`);
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