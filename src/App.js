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

app.use(express.static(path.join(__dirname, "include")));

module.exports = app;