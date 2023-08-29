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

const ui = document.getElementById("ui");
const info = document.getElementById("info");
const discord = document.getElementById("discord");
const screenshot = document.getElementById("screenshot");
const settings = document.getElementById("settings");
const clear = document.getElementById("clear");
const form = document.getElementById("form");
const chat = document.getElementById("chat");
const chatMsgs = document.getElementById("chatmsgs");
const uiChat = document.getElementById("uichat");
const uiPlrs = document.getElementById("uiplayers");
const uiSets = document.getElementById("uisets");
const uiInfo = document.getElementById("uiinfo");
const uiCrds = document.getElementById("uicrds");
const chatBtn = document.getElementById("chatbtn");
const plrsBtn = document.getElementById("plrsbtn");
const setsBtn = document.getElementById("setsbtn");
const infoBtn = document.getElementById("infobtn");
const crdsBtn = document.getElementById("crdsbtn");
const keys = document.getElementById("keys");
const up = document.getElementById("up");
const left = document.getElementById("left");
const down = document.getElementById("down");
const right = document.getElementById("right");
const shift = document.getElementById("shift");
const title = document.getElementById("title");
const jlMsgs = document.getElementById("jlMsgs");
const bcSnds = document.getElementById("bcSnds");
const tex0 = document.getElementById("tex0");
const tex1 = document.getElementById("tex1");

jlMsgs.addEventListener('change', e => {
    e.preventDefault();
    window.localStorage.setItem('jlMsgs', e.target.checked);
});

bcSnds.addEventListener('change', e => {
    e.preventDefault();
    window.localStorage.setItem('bcSnds', e.target.checked);
});

let
[
    clicked,
    initialised,
] = [
    false,
    false,
]

class Block {
    constructor(name, transparency, solid, shadow) {
        this.name = name;
        this.transparency = transparency;
        this.solid = solid;
        this.shadow = shadow;
    }
}

class Balls {
    constructor() {
        this.fps = 0;
        this.now = 0;

        this.version = "0.1.5"
        this.dev = false;
        this.exhausted = false;

        this.canvas = document.getElementById("ctx")
        this.ctx = this.canvas.getContext("2d");

        this.emptyMap = [];
        for (let i = 0; i < 32; i++) this.emptyMap.push("00000000000000000000000000000000");

        this.map = [];
        this.mapScale = 64;
        this.blocks = {
            0: new Block('Air', 0xFF, false, false),
            1: new Block('Door', 0x0A, false, false),
            2: new Block('Glass', 0x20, true, false),
            3: new Block('Wall', 0xFF, true, true),
            4: new Block('Liquid', 0x9A, false, false)
        };

        this.canvas.map = document.createElement("canvas");
        this.canvasMap = this.canvas.map.getContext("2d");

        this.canvas.map.width = 32 * this.mapScale;
        this.canvas.map.height = 32 * this.mapScale;

        this.canvasMap.fillStyle = "#808080";
        this.canvasMap.fillRect(0, 0, 32 * this.mapScale, 32 * this.mapScale);

        this.shadows = true;

        this.textures = new Image(128, 32);
        this.textures.src = `./img/textures/${window.localStorage.getItem('texture') !== null ? window.localStorage.getItem('texture') : 'marioood'}.png`;

        this.canvas.textures = document.createElement("canvas");
        this.canvasTextures = this.canvas.textures.getContext("2d");

        this.canvas.textures.width = 128;
        this.canvas.textures.height = 32;

        this.textures.onload = () => this.canvasTextures.drawImage(this.textures, 0, 0);

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

        this.initialised = false;

        this.cid = "";
        this.cx = 2048;
        this.cy = 2048;
        this.pcx = this.cx;
        this.pcy = this.cy;

        this.cax = this.cx;
        this.cay = this.cy;
        this.icax = this.cax;
        this.icay = this.cay;
        this.ricax = this.icax;
        this.ricay = this.icay;

        this.sonic = false;

        this.maxAfk = 60000;

        this.notifText = "Lorem ipsum dolor sit amet, and I don't remember the next thing.";
        this.notifTransparency = 0;
        this.notifColor = "DDDDDD";

        this.messages = [];
        this.maxMsgs = 18;

        this.points = [];
        this.ctx.lineWidth = 10;

        // JUST LOAD THE SOUNDS
        this.JLTS = {
            CM: new Audio("./sound/ChatMessage.ogg"),
            CC: new Audio("./sound/ColorChange.ogg"),
            NC: new Audio("./sound/NameChange.ogg"),
            N: new Audio("./sound/Notification.ogg"),
            COC: new Audio("./sound/CosmeticChange.ogg"),
        };

        // because closure compiler will probably hold a grudge here
        this.JLTS.CM.pause();
        this.JLTS.CC.pause();
        this.JLTS.NC.pause();
        this.JLTS.N.pause();
        this.JLTS.COC.pause();

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

        this.frameDone = true;
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

    send(packet) {
        this.ws.send(JSON.stringify([packet]));
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
        let time = Date.now().toString();
        let firstMsg;

        this.messages.push(time);
        if (this.messages.length > 64) firstMsg = this.messages.shift(), document.getElementById(firstMsg).remove();

        let p = document.createElement("p");
        let pNode = document.createTextNode(text);

        p.appendChild(pNode);

        p.setAttribute("id", time);

        chatMsgs.appendChild(p);
        chatMsgs.scrollTop = chatMsgs.scrollHeight;

        p.style.animation = "new 1s linear forwards";

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
        this.canvasMap.fillStyle = "#808080";
        this.canvasMap.fillRect(0, 0, 32*this.mapScale, 32*this.mapScale);

        this.canvasMap.imageSmoothingEnabled = false;

        if (this.shadows) {
            this.canvasMap.fillStyle = "#00000010";
            this.canvasMap.fillRect(0, 0, 2048, 8);
            this.canvasMap.fillRect(0, 8, 8, 2048-8);
        }

        for (let i in this.map) for (let j in this.map[i]) {
            this.canvasMap.globalAlpha = 1;
            let block = this.blocks[+this.map[i][j]]

            if (!isNaN(+j) && +this.map[i][j] !== 0) {
                if (block.shadow && this.shadows) {
                    this.canvasMap.fillStyle = '#00000010';
                    this.canvasMap.fillRect(j*this.mapScale+8, i*this.mapScale+8, this.mapScale, this.mapScale);

                    if (this.map[i-1] !== undefined && !this.blocks[this.map[i-1][j]].shadow) {
                        this.canvasMap.beginPath();
                        this.canvasMap.moveTo(j*this.mapScale+this.mapScale, i*this.mapScale);
                        this.canvasMap.lineTo(j*this.mapScale+this.mapScale+8, i*this.mapScale+8);
                        this.canvasMap.lineTo(j*this.mapScale+this.mapScale, i*this.mapScale+8);
                        this.canvasMap.fill();
                        this.canvasMap.closePath();
                    }

                    if (this.map[i][j-1] !== undefined && !this.blocks[this.map[i][j-1]].shadow) {
                        this.canvasMap.beginPath();
                        this.canvasMap.moveTo(j*this.mapScale, i*this.mapScale+this.mapScale);
                        this.canvasMap.lineTo(j*this.mapScale+8, i*this.mapScale+this.mapScale);
                        this.canvasMap.lineTo(j*this.mapScale+8, i*this.mapScale+this.mapScale+8);
                        this.canvasMap.fill();
                        this.canvasMap.closePath();
                    }
                }
    
                this.canvasMap.globalAlpha = block.transparency / 255;
                this.canvasMap.drawImage(this.canvas.textures, (+this.map[i][j]-1)*32, 0, 32, 32, j*this.mapScale, i*this.mapScale, 64, 64);
            }
        }

        this.canvasMap.globalAlpha = 1;
    }

    drawUpdate() {
        if (this.players.get(this.cid)) {
            let [newX, newY, touchedX, touchedY] = [0, 0, false, false];

            let speed = !chat.matches(':focus') && document.visibilityState === "visible" ? (1/(this.sonic ? 1 : 4)) * this.elapsed : 0;

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
                        if (this.blocks[+this.map[i][j]].solid) {
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

        this.icax = this.lerp(this.icax, this.cax, 0.005 * (document.hasFocus() ? this.elapsed : this.clamp(this.elapsed, 0, 100)));
        this.icay = this.lerp(this.icay, this.cay, 0.005 * (document.hasFocus() ? this.elapsed : this.clamp(this.elapsed, 0, 100)));

        this.ricax = Math.round(this.icax);
        this.ricay = Math.round(this.icay);

        this.ctx.drawImage(this.canvas.map, 0, 0, 32*this.mapScale, 32*this.mapScale, 0-this.icax+this.canvas.width/2, 0-this.icay+this.canvas.height/2, 4096, 4096);
    }

    drawPoints() {
        this.ctx.lineWidth = 10;
        for (let point of this.points) {
            this.ctx.strokeStyle = `#${point[2]}${this.maxHex(point[3])}`;
            this.ctx.beginPath();
            this.ctx.moveTo(
                point[0][0]-this.icax+(this.canvas.width/2),
                point[1][0]-this.icay+(this.canvas.height/2)
            );
            this.ctx.lineTo(
                point[0][1]-this.icax+(this.canvas.width/2),
                point[1][1]-this.icay+(this.canvas.height/2)
            );
            this.ctx.stroke();
        }
    }

    drawPlayers() {
        let self = undefined;

        for (let i of this.players) {
            let player = i[1];

            player.lx = this.lerp(player.lx, player.x, 0.025 * this.elapsed);
            player.ly = this.lerp(player.ly, player.y, 0.025 * this.elapsed);

            if (player.id === this.cid) self = player; else {
                // Actual
                this.ctx.beginPath();
                this.ctx.fillStyle = `#${player.color}`;
                this.ctx.arc(Math.round(player.lx)-this.icax+(this.canvas.width/2), Math.round(player.ly)-this.icay+this.canvas.height/2, 10, 0, 2 * Math.PI);
                this.ctx.fill();
                this.ctx.closePath();

                // Cosmetic
                this.ctx.drawImage(player.curl, Math.round(player.lx)-this.icax+(this.canvas.width/2)-20, Math.round(player.ly)-this.icay+this.canvas.height/2-20);

                // Nametag
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
            }
        }

        // Self player (to always draw on top)
        if (typeof self === 'object') {
            self.lx = this.lerp(self.lx, self.x, 0.025 * this.elapsed);
            self.ly = this.lerp(self.ly, self.y, 0.025 * this.elapsed);

            // Outline
            this.ctx.beginPath();
            this.ctx.fillStyle = `#AAAAAA`;
            this.ctx.arc(Math.round(self.lx)-this.icax+(this.canvas.width/2), Math.round(self.ly)-this.icay+this.canvas.height/2, 11, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.closePath();

            // Actual
            this.ctx.beginPath();
            this.ctx.fillStyle = `#${self.color}`;
            this.ctx.arc(Math.round(self.lx)-this.icax+(this.canvas.width/2), Math.round(self.ly)-this.icay+this.canvas.height/2, 10, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.closePath();

            // Cosmetic
            this.ctx.drawImage(self.curl, Math.round(self.lx)-this.icax+(this.canvas.width/2)-20, Math.round(self.ly)-this.icay+this.canvas.height/2-20);

            // Nametag
            this.ctx.textAlign = 'center';
            this.drawText({
                text: self.name, 
                x: Math.round(self.lx)-this.icax+this.canvas.width/2,
                y: Math.round(self.ly)-this.icay+this.canvas.height/2-25,
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
            x: 16*12,
            y: 23,
            color: (this.fps < 30) ? (this.fps < 15) ? 'red' : 'yellow' : 'lime',
        });

        /*this.drawText({
            text: `Ping: you don't need one`, 
            x: 10,
            y: 16*4,
            color: 'lime',
        });*/

        this.ctx.beginPath();
        this.ctx.fillStyle = (this.ws.readyState == 0 || this.ws.readyState == 3 || this.ws.readyState == 2) ? "red" : "lime";
        this.ctx.arc(this.ctx.measureText(t).width + 94, 18, 7, 0, Math.PI * 2)
        this.ctx.fill();
        this.ctx.closePath();

        this.drawText({
            text: `Version: ${this.getVersion()}`, 
            x: 10,
            y: 16*3,
            color: "#AAAAFF",
        });

        this.drawText({
            text: `Platform: ${window.navigator.platform}`, 
            x: 10,
            y: 16*4,
            color: "#AAAAFF",
        });

        if (this.cid !== "") {
            this.drawText({
                text: `Client ID: ${this.cid}`, 
                x: 10,
                y: 16*6,
                color: "#DDDDDD",
            });
    
            this.drawText({
                text: `Position: ${Math.round(this.cx)} | ${Math.round(this.cy)}`, 
                x: 10,
                y: 16*7,
                color: "#DDDDDD",
            });
        }
    }

    draw(time) {
        this.elapsed = time - this.now;
        this.fps = 1000 / this.elapsed;
        this.now = time;

        this.ctx.textAlign = 'left';

        //this.ctx.fillStyle = this.ctx.createPattern(this.canvas.textures, "repeat");
        this.ctx.fillStyle = "#707070FF";
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
        if (window.location === window.parent.location) clicked = true;

        if (window.localStorage.getItem('jlMsgs') === null) window.localStorage.setItem('jlMsgs', 'true');
        if (window.localStorage.getItem('bcSnds') === null) window.localStorage.setItem('bcSnds', 'false');

        jlMsgs.checked = window.localStorage.getItem('jlMsgs') === "true";
        bcSnds.checked = window.localStorage.getItem('bcSnds') === "true";

        setInterval(() => {
            if (this.t === "") this.t = Math.floor(Math.random() * 100) === 0 ?
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
        
            if (window.location === window.parent.location) if (!initialised && this.ws.readyState === 1) this.send({ t: 'i', r: {} }), initialised = true;
        
            this.notifTransparency = this.clamp(this.notifTransparency - 10, 0, Math.min());
        
            if (this.players.get(this.cid) && (this.cx !== this.pcx || this.cy !== this.pcy)) {
                this.pcx = this.cx;
                this.pcy = this.cy;
        
                this.send({
                    t: 'bm',
                    r: {
                        x: this.cx,
                        y: this.cy
                    }
                });
        
                if (this.keyboard[this.keys.shift]) this.send({ t: 'd', r: {} });
            }
        
            for (let i in this.points) if (this.points[i][3] < 1) this.points.splice(i, 1); else this.points[i][3]--;
        }, 50);
        
        setInterval(() => {
            if (this.initialised && this.ws.readyState === 1) this.send({
                t: 'p', r: {}
            });
        }, 10000);
        
        this.splash = this.splashes[0];
        const splashing = setInterval(() => {
            this.splash = this.splashes[Math.floor(Math.random() * this.splashes.length)];
        }, 1000 * 5);

        if (this.limitFPS) setInterval(() => {
            if (this.frameDone) this.frameDone = false, requestAnimationFrame(this.draw.bind(this));
        }, 1000/10);
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
            balls.send({ t: 'm', r: { "m": message.trim().slice(0, 128).toString() } });
            chat.value = '';
        }
    }
});

// UI buttons (the formatting here just sucks... gonna rewrite later somehow)

chatBtn.addEventListener('click', () => {
    chatBtn.setAttribute('class', 'selected');
    plrsBtn.removeAttribute('class');
    setsBtn.removeAttribute('class');
    infoBtn.removeAttribute('class');
    crdsBtn.removeAttribute('class');

    uiChat.removeAttribute('hidden');
    uiPlrs.setAttribute('hidden', null);
    uiSets.setAttribute('hidden', null);
    uiInfo.setAttribute('hidden', null);
    uiCrds.setAttribute('hidden', null);

    chatMsgs.scrollTop = chatMsgs.scrollHeight;
});

plrsBtn.addEventListener('click', () => {
    chatBtn.removeAttribute('class');
    plrsBtn.setAttribute('class', 'selected');
    setsBtn.removeAttribute('class');
    infoBtn.removeAttribute('class');
    crdsBtn.removeAttribute('class');

    uiChat.setAttribute('hidden', null);
    uiPlrs.removeAttribute('hidden');
    uiSets.setAttribute('hidden', null);
    uiInfo.setAttribute('hidden', null);
    uiCrds.setAttribute('hidden', null);
});

setsBtn.addEventListener('click', () => {
    chatBtn.removeAttribute('class');
    plrsBtn.removeAttribute('class');
    setsBtn.setAttribute('class', 'selected');
    infoBtn.removeAttribute('class');
    crdsBtn.removeAttribute('class');

    uiChat.setAttribute('hidden', null);
    uiPlrs.setAttribute('hidden', null);
    uiSets.removeAttribute('hidden');
    uiInfo.setAttribute('hidden', null);
    uiCrds.setAttribute('hidden', null);
});

infoBtn.addEventListener('click', () => {
    chatBtn.removeAttribute('class');
    plrsBtn.removeAttribute('class');
    setsBtn.removeAttribute('class');
    infoBtn.setAttribute('class', 'selected');
    crdsBtn.removeAttribute('class');

    uiChat.setAttribute('hidden', null);
    uiPlrs.setAttribute('hidden', null);
    uiSets.setAttribute('hidden', null);
    uiInfo.removeAttribute('hidden');
    uiCrds.setAttribute('hidden', null);
});

crdsBtn.addEventListener('click', () => {
    chatBtn.removeAttribute('class');
    plrsBtn.removeAttribute('class');
    setsBtn.removeAttribute('class');
    infoBtn.removeAttribute('class');
    crdsBtn.setAttribute('class', 'selected');

    uiChat.setAttribute('hidden', null);
    uiPlrs.setAttribute('hidden', null);
    uiSets.setAttribute('hidden', null);
    uiInfo.setAttribute('hidden', null);
    uiCrds.removeAttribute('hidden');
});

tex0.addEventListener('click', e => {
    window.localStorage.setItem('texture', 'dottych');
    balls.textures.src = './img/textures/dottych.png';
    balls.textures.onload = () => {
        balls.canvasTextures.drawImage(balls.textures, 0, 0);
        balls.drawMap();
    }
});

tex1.addEventListener('click', e => {
    window.localStorage.setItem('texture', 'marioood');
    balls.textures.src = './img/textures/marioood.png';
    balls.textures.onload = () => {
        balls.canvasTextures.drawImage(balls.textures, 0, 0);
        balls.drawMap();
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

document.addEventListener('click', () => {
    if (!clicked) {
        document.getElementById("p").style.animation = `gone${Math.floor(Math.random() * 4)} ${0.1 + Math.floor(Math.random() * 10) / 10}s linear forwards`;
        setTimeout(() => {
            document.getElementById("p").setAttribute("hidden", "");
        }, 1000);

        ui.removeAttribute("hidden");

        if (
            window.navigator.userAgent.indexOf("Android") >= 0 ||
            window.navigator.userAgent.indexOf("iOS") >= 0 ||
            window.navigator.userAgent.indexOf("iPhone") >= 0 ||
            window.navigator.userAgent.indexOf("iPad") >= 0
        ) keys.removeAttribute("hidden");

        if (window.location === window.parent.location) balls.init();
    }
});

document.addEventListener('visibilitychange', e => {
    if (document.visibilityState !== "visible") balls.keyboard = [];
});

balls.ws.addEventListener('open', () => {
    //balls.send({ t: 'i', r: {} }]));
});

balls.ws.addEventListener('close', () => {
    for (let plr of balls.players) document.getElementById(plr[0]).remove();
    balls.players.clear();

    balls.cx = 2048;
    balls.cy = 2048;

    balls.messages = [];

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
        data = { t: "none", r: { e: e.toString() } };
        balls.addMessage(e.toString());
    }

    if (balls.exhausted) console.log(`%cGot request type ${data.t}`, "font-size: 8px;");

    switch (data.t) {
        case 'j':
            if (!data.r.hasOwnProperty("a") || !data.r.hasOwnProperty("c")) return;
            balls.send(eval(data.r.c));
            break;
        
        case 'c':
            balls.initialised = true;
            balls.cid = data.r.id;
            balls.notify({
                text: "Loading...",
                duration: 2000,
                color: "DDDDDD",
                sound: false
            });
            console.log("%cConnected! %c| " + " in " + Math.round(performance.now()) + "ms", "color: #00AA00; font-size: 16px;", "");
            console.log(`%cGot client ID! >>> ${balls.cid}`, "font-size: 8px;");

            if (window.localStorage.getItem('name')) balls.send({ t: 'm', r: { "m": `/name ${window.localStorage.getItem('name')}` } });
            if (window.localStorage.getItem('color')) balls.send({ t: 'm', r: { "m": `/color ${window.localStorage.getItem('color')}` } });
            if (window.localStorage.getItem('cosmetic') &&
                window.localStorage.getItem('cosmetic') !== "none") balls.send({ t: 'm', r: { "m": `/cosmetic ${window.localStorage.getItem('cosmetic')}` } });
            break;

        case 'n':
            balls.notify({
                text: data.r.t,
                duration: data.r.d,
                color: data.r.color,
                sound: data.r.s
            });
            break;

        case 'm':
            if (!data.r.hasOwnProperty("m") || !data.r.hasOwnProperty("id") || !data.r.hasOwnProperty("show")) return;
            balls.addMessage(`${data.r.show ? "(" + data.r.id + ") " : ""}${
                data.r.id === "server" ? "/" : data.r.id === "discrd" ? "D" : balls.players.get(data.r.id).name
            }: ${data.r["m"]}`);
            break;

        case 'map':
            if (!data.r.hasOwnProperty("map") || data.r.map.length !== 32) return;
            balls.points = [];
            balls.map = data.r.map;
            balls.drawMap();
            break;

        case 'd':
            if (!data.r.hasOwnProperty("x") || !data.r.hasOwnProperty("y") || !data.r.hasOwnProperty("color")) return;
            /*if (document.hasFocus())*/ balls.points.push([data.r.x, data.r.y, data.r.color, JSON.stringify(balls.map) === JSON.stringify(balls.emptyMap) ? 1000 : 255]);
            break;

        case 'l':
            if (!data.r.hasOwnProperty("balls")) return;
            for (let ball of data.r["balls"]) {
                if (!ball.hasOwnProperty("id") || !ball.hasOwnProperty("info")) return;

                balls.players.set(ball.id, ball.info);
                balls.players.get(ball.id).lx = balls.players.get(ball.id).x;
                balls.players.get(ball.id).ly = balls.players.get(ball.id).y;
                balls.players.get(ball.id).curl = new Image();
                balls.players.get(ball.id).curl.src = `./img/cosmetics/${balls.players.get(ball.id)["cosmetic"]}.png`;

                let isMe = ball.id === balls.cid;

                let p = document.createElement("p");
                let pNode = document.createTextNode(`${isMe ? '>>> ' : ''}${ball.id} | ${ball.info.name}${isMe ? ' <<<' : ''}`);

                p.appendChild(pNode);
                p.style = `color: #${ball.info.color}; font-weight: bold; text-shadow: #000000 1px 1px`;

                p.setAttribute("id", ball.id);

                uiPlrs.appendChild(p);

                document.getElementById("playercount").innerText = `Players: ${balls.players.size}`;
            } 
            break;

        case 'b':
            if (!data.r.hasOwnProperty("id") || !data.r.hasOwnProperty("info")) return;
            balls.players.set(data.r.id, data.r.info);
            if (window.localStorage.getItem('jlMsgs') === "true") balls.addMessage(`${data.r.id} joined the game`);

            balls.players.get(data.r.id).lx = balls.players.get(data.r.id).x;
            balls.players.get(data.r.id).ly = balls.players.get(data.r.id).y;
            balls.players.get(data.r.id).curl = new Image();
            balls.players.get(data.r.id).curl.src = `./img/cosmetics/${data.r.info["cosmetic"]}.png`;

            let isMe = data.r.id === balls.cid;

            let p = document.createElement("p");
            let pNode = document.createTextNode(`${isMe ? '>>> ' : ''}${data.r.id} | ${balls.players.get(data.r.id).name}${isMe ? ' <<<' : ''}`);

            p.appendChild(pNode);
            p.style = `color: #${balls.players.get(data.r.id).color}; font-weight: bold; text-shadow: #000000 1px 1px`;

            p.setAttribute("id", data.r.id);

            uiPlrs.appendChild(p);

            document.getElementById("playercount").innerText = `Players: ${balls.players.size}`;
            break;

        case 'bl':
            if (!data.r.hasOwnProperty("id")) return;
            balls.players.delete(data.r.id);
            if (window.localStorage.getItem('jlMsgs') === "true") balls.addMessage(`${data.r.id} left the game`);

            document.getElementById(data.r.id).remove();

            document.getElementById("playercount").innerText = `Players: ${balls.players.size}`;
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

            if (window.localStorage.getItem('bcSnds') === "true" &&
                balls.players.get(data.r.id).joined + 1000 < Date.now()
            ) new Audio("./sound/NameChange.ogg").play();

            isMe = data.r.id === balls.cid;
            if (isMe) window.localStorage.setItem('name', data.r.name);

            pNode = document.createTextNode(`${isMe ? '>>> ' : ''}${data.r.id} | ${data.r.name}${isMe ? ' <<<' : ''}`);
            document.getElementById(data.r.id).removeChild(document.getElementById(data.r.id).firstChild);
            document.getElementById(data.r.id).appendChild(pNode);
            break;

        case 'bc':
            if (!data.r.hasOwnProperty("id") || !data.r.hasOwnProperty("color")) return;
            balls.players.get(data.r.id).color = data.r.color;

            if (window.localStorage.getItem('bcSnds') === "true" &&
                balls.players.get(data.r.id).joined + 1000 < Date.now()
            ) new Audio("./sound/ColorChange.ogg").play();

            if (data.r.id === balls.cid) window.localStorage.setItem('color', data.r.color);

            document.getElementById(data.r.id).style.color = `#${data.r.color}`;
            break;

        case 'bco':
            if (!data.r.hasOwnProperty("id") || !data.r.hasOwnProperty("cosmetic")) return;
            balls.players.get(data.r.id).cosmetic = data.r["cosmetic"];
            balls.players.get(data.r.id).curl.src = `./img/cosmetics/${data.r["cosmetic"]}.png`;

            if (window.localStorage.getItem('bcSnds') === "true" &&
                balls.players.get(data.r.id)["joined"] + 1000 < Date.now()
            ) new Audio("./sound/CosmeticChange.ogg").play();

            if (data.r.id === balls.cid) window.localStorage.setItem('cosmetic', data.r["cosmetic"]);
            break;

    }
});