const express = require('express');
const app = express();
const path = require('path');

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/info", (req, res) => {
    res.sendFile(__dirname + "/info.html");
});

app.get("/settings", (req, res) => {
    res.sendFile(__dirname + "/settings.html");
});

app.get("/editor", (req, res) => {
    res.sendFile(__dirname + "/editor.html");
});

app.use(express.static(path.join(__dirname, "include")));

app.use((req, res) => {
    res.status(404).sendFile(__dirname + "/404/" + (Math.floor(Math.random() * 2)+1) + ".png");
});

module.exports = app;