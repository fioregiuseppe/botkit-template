var Botkit = require('botkit');
var express = require('express');
var slack = require('./bot/slack');

var webServer = express();

webServer.get('/', function(req, res) {
    res.send('Hello World!');
});

await webServer.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});

slack.init(Botkit, webServer);