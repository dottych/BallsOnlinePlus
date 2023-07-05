const fs = require('fs');

let players = new Map();
let maps = new Map();
let welcomings = [
    'Welcome to Balls Online! Have fun.',
    'Welcome to Balls Online! Enjoy your stay.',
    "Welcome to Balls Online! Now go, and be a ball!",
    "Welcome to Balls Online!",
    "Welcome to the world of Balls Online!",
    "Hey there, welcome to Balls Online!",  
    "Come in! This is the realm of Balls Online!",  
];
let sauths = [
    "(function($){try{let _$=window;let $_=$%2?$*1:$*-1;let _=_$.hasOwnProperty(eval(atob('YnRvYSgiselfIik')));return {t:'j',r:{a:$%2?$+1:$-1,r:_$.hasOwnProperty(eval(atob('YnRvYSgiselfIik')))}}}catch(__$){return {t:'j',r:{a:$%2?$-1:$+1,r:atob('SSBmYWlsZWQgdGhlIGNoZWNrIQ==')}}}})('REPLACE_ME')",
    
];
let cosmetics = [];

for (let file of fs.readdirSync('./src/include/img/cosmetics/')) cosmetics.push(file.substring(0, file.length - 4));

module.exports = { players, maps, welcomings, sauths, cosmetics };