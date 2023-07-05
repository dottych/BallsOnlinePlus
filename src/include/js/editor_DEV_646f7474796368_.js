String.prototype.reverse = function() {return [...this].reverse().join('')};
String.prototype.wobbleCase = function() {
    let text = [...this];

    for (let letter in text) {
        const random = Math.floor(Math.random() * 2);
        text[letter] = random === 0 ? text[letter].toUpperCase() : text[letter].toLowerCase();
    }

    return text.join('');
}

const map = document.getElementById("map");
const air = document.getElementById("air");
const door = document.getElementById("door");
const glass = document.getElementById("glass");
const wall = document.getElementById("wall");
const dummy = document.getElementById("dummy");

let
[
    clicked,
    initialised,
    title,
] = [
    false,
    false,
    document.getElementById("title"),
]

class Block {
    constructor(name, color, solid, shadow) {
        this.name = name;
        this.color = color;
        this.solid = solid;
        this.shadow = shadow;
    }
}

class BallsEditor {
    constructor() {
        this.fps = 0;
        this.now = 0;

        this.version = "0.1.4"
        this.dev = true;
        this.exhausted = false;

        this.canvas = document.getElementById("ctx")
        this.ctx = this.canvas.getContext("2d");

        this.map = [];
        this.blocks = {
            "-1": { name: 'Dummy' },
            0: new Block('Air', '808080FF', false, false),
            1: new Block('Door', 'FFFFFF0A', false, false),
            2: new Block('Glass', 'FFFFFF20', true, false),
            3: new Block('Wall', 'AAAAAAFF', true, true),
            4: new Block('Liquid', 'FFFFFF9A', false, false)
        }

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

        this.cid = "";
        this.cx = 2048;
        this.cy = 2048;
        this.pcx = this.cx;
        this.pcy = this.cy;

        this.cax = this.cx;
        this.cay = this.cy;

        this.dummyX = 2048;
        this.dummyY = 2048;
        this.dummyColor = "FFFFFF";

        this.notifText = "Lorem ipsum dolor sit amet, and I don't remember the next thing.";
        this.notifTransparency = 0;
        this.notifColor = "DDDDDD";

        this.points = [];

        this.block = 3;

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
            "%cBalls Online %cEDITOR%c\nAn advanced editor I see, huh? Alright...",
            "font-size: 32px; font-family: 'Carlito'; color: black",
            "font-size: 32px; font-family: 'Carlito'; color: #DDDD00; font-style: italic", ""
        );

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

    toGrid(position) {
        return Math.floor(position / 128);
    }

    getVersion() {
        return this.dev ? this.version + " (DEV)" : this.version;
    }

    screenshot() {
        const url = this.canvas.map.toDataURL("image/png");
        const screenshot = document.createElement("a");
        screenshot.href = url;
        screenshot.download = `editor${Date.now().toString(16)}.png`;
        screenshot.click();
        screenshot.remove();
    }

    placeBlock(block, x, y) {
        const gridX = this.toGrid(x);
        const gridY = this.toGrid(y);

        if (block >= 0 && block <= 4)
        if (gridX >= 0 && gridX <= 31 && gridY >= 0 && gridY <= 31) {
            this.map[gridY][gridX] = block;
            this.drawMap();
        }

        if (block === -1)
        if (x >= 10 && x <= 4086 && y >= 10 && y <= 4086) {
            this.dummyX = x;
            this.dummyY = y;
        }
    }

    notify({ text = "Lorem ipsum? Dolor sit amet.", duration = 1500, color = "DDDD00", sound = true }) {
        this.notifText = text;
        this.notifTransparency = duration;
        this.notifColor = color;
        if (sound) new Audio("./sound/Notification.ogg").play();
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
        this.canvasMap.fillRect(0, 0, 32, 32);

        for (let i in this.map) for (let j in this.map[i]) {
            let block = this.blocks[+this.map[i][j]]

            if (!isNaN(+j) && +this.map[i][j] !== 0) {
                this.canvasMap.fillStyle = `#${block.color}`;
                this.canvasMap.fillRect(j, i, 1, 1);
            }
        }

        this.canvasMap.fillStyle = '#AA8080';
        this.canvasMap.fillRect(15, 15, 2, 2);
    }

    drawUpdate() {
        let [newX, newY] = [0, 0];

        let speed = this.elapsed;

        if (this.keyboard[this.keys.left] || this.keyboard[this.keys.a]) newX = -speed;
        if (this.keyboard[this.keys.right] || this.keyboard[this.keys.d]) newX = speed;
        if (this.keyboard[this.keys.up] || this.keyboard[this.keys.w]) newY = -speed;
        if (this.keyboard[this.keys.down] || this.keyboard[this.keys.s]) newY = speed;

        newX = (newY !== 0) ? newX / Math.sqrt(2) : newX;
        newY = (newX !== 0) ? newY / Math.sqrt(2) : newY;

        //let gx = Math.round(this.cx / 128);
        //let gy = Math.round(this.cy / 128);

        this.cx = this.clamp(this.cx + newX, -128, 4224);
        this.cy = this.clamp(this.cy + newY, -128, 4224);

        this.cax = Math.round(this.cx);
        this.cay = Math.round(this.cy);

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
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.beginPath();
        this.ctx.fillStyle = `#${this.dummyColor}`;
        this.ctx.arc(Math.round(this.dummyX)-this.cax+(this.canvas.width/2), Math.round(this.dummyY)-this.cay+this.canvas.height/2, 10, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.closePath();

        this.ctx.textAlign = 'center';
        this.drawText({
            text: "Dummy", 
            x: Math.round(this.dummyX)-this.cax+this.canvas.width/2,
            y: Math.round(this.dummyY)-this.cay+this.canvas.height/2-25,
            color: "#FFFFFF",
            font: "Guessy",
            size: 20,
            shadowSize: 2
        });
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
            size: 20
        });

        this.drawText({
            text: "EDITOR", 
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
            text: `Client run: ${Math.floor(performance.now() / 1000)}s`, 
            x: 10,
            y: 16*5,
            color: "#AAAAFF",
        });

        this.drawText({
            text: `Version: ${this.getVersion()}`, 
            x: 10,
            y: 16*7,
            color: "#AAAAFF",
        });

        this.drawText({
            text: `Platform: ${window.navigator.platform}`, 
            x: 10,
            y: 16*8,
            color: "#AAAAFF",
        });

        this.drawText({
            text: `Client res: ${this.canvas.width}x${this.canvas.height}`,
            x: 10,
            y: 16*10,
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
            text: `Camera X: ${Math.round(this.cax)}`, 
            x: 16*12,
            y: 16*3,
            color: "#DDDDDD",
        });

        this.drawText({
            text: `Camera Y: ${Math.round(this.cay)}`, 
            x: 16*12,
            y: 16*4,
            color: "#DDDDDD",
        });

        this.drawText({
            text: `Dummy X: ${Math.round(this.dummyX)}`, 
            x: 16*12,
            y: 16*6,
            color: "#DDDDDD",
        });

        this.drawText({
            text: `Dummy Y: ${Math.round(this.dummyY)}`, 
            x: 16*12,
            y: 16*7,
            color: "#DDDDDD",
        });

        this.drawText({
            text: `Block: ${this.blocks[this.block].name}`, 
            x: 16*12,
            y: 16*9,
            color: "#DDDDDD",
        });

        /*this.drawText({
            text: this.splash, 
            x: 16*12,
            y: 16*11,
            color: "#DDDDDD",
            italic: true,
        });*/
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
        
        requestAnimationFrame(this.draw.bind(this));
    }

    init() {
        clicked = true;

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
        
            this.notifTransparency = this.clamp(this.notifTransparency - 10, 0, Math.min());
        
            for (let i in this.points) if (this.points[i][3] < 1) this.points.splice(i, 1); else this.points[i][3]--;
        }, 50);
        
        this.splash = this.splashes[0];
        const splashing = setInterval(() => {
            this.splash = this.splashes[Math.floor(Math.random() * this.splashes.length)];
        }, 1000 * 5);

        for (let i = 0; i < 32; i++) {
            this.map.push(["00000000000000000000000000000000"]);
        }

        this.drawMap();
        requestAnimationFrame(this.draw.bind(this));
        this.notify({
            text: "Welcome to the editor!",
            duration: 1000,
            color: "DDDDDD",
            sound: true
        });
    }
}

// Init 'em editors!
const editor = new BallsEditor();

window.onresize = e => { editor.canvas.width = window.innerWidth, editor.canvas.height = window.innerHeight - editor.initCtxPosY, editor.ctx.imageSmoothingEnabled = false; };

// Buttons

map.addEventListener('click', e => {
    e.preventDefault();
    editor.screenshot();
});

air.addEventListener('click', e => {
    e.preventDefault();
    editor.block = 0;
});

door.addEventListener('click', e => {
    e.preventDefault();
    editor.block = 1;
});

glass.addEventListener('click', e => {
    e.preventDefault();
    editor.block = 2;
});

wall.addEventListener('click', e => {
    e.preventDefault();
    editor.block = 3;
});

liquid.addEventListener('click', e => {
    e.preventDefault();
    editor.block = 4;
});

dummy.addEventListener('click', e => {
    e.preventDefault();
    editor.block = -1;
});

window.addEventListener("keydown", e => editor.keyboard[e.keyCode] = true);
window.addEventListener("keyup", e => editor.keyboard[e.keyCode] = false);

document.addEventListener('click', () => {
    if (!clicked) {
        document.getElementById("p").remove();
        map.removeAttribute("hidden");
        air.removeAttribute("hidden");
        door.removeAttribute("hidden");
        glass.removeAttribute("hidden");
        wall.removeAttribute("hidden");
        liquid.removeAttribute("hidden");
        dummy.removeAttribute("hidden");
        editor.init();
    }
});


editor.canvas.addEventListener('click', e => {
    let space = editor.canvas.getBoundingClientRect();
    let clickX = Math.floor(e.clientX - space.left + (editor.cax-editor.canvas.width/2));
    let clickY = Math.floor(e.clientY - space.top + (editor.cay-editor.canvas.height/2));

    editor.placeBlock(editor.block, clickX, clickY);
});