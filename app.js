var Botkit = require('botkit');
var express = require('express');
var slack = require('./bot/slack');
var webex = require('./bot/webex');

var webServer = express();

webServer.get('/', function(req, res) {
    res.send('Hello World!');
});
slack.init();
webex.init();
webServer.listen(3002, function() {
    console.log('Example app listening on port 3002!');

});