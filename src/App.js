const express = require('express');
const app = express();
const path = require('path');

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});


app.use(express.static(path.join(__dirname, "include")));

module.exports = app;