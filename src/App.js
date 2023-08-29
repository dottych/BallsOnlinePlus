const express = require('express');
const app = express();
const path = require('path');

const nope = [
    'balls_646f7474796368_.js',
    'balls_DEV_646f7474796368_.js',
    'editor_646f7474796368_.js',
    'editor_DEV_646f7474796368_.js',
];

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/editor", (req, res) => {
    res.sendFile(__dirname + "/editor.html");
});

app.use(express.static(path.join(__dirname, "include")));

app.use((req, res) => {
    res.status(404).sendFile(__dirname + "/404/" + (Math.floor(Math.random() * 6)+1) + ".png");
});

module.exports = app;