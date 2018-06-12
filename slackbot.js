//
// Copyright (c) 2017 Cisco Systems
// Licensed under the MIT License 
//

//
// BotKit configuration
//

// Load environment variables from project .env file
require('node-env-file')(__dirname + '/.env');


// Fetch token from environement
// [COMPAT] supports SPARK_TOKEN for backward compatibility
var slackToken = process.env.SLACK_TOKEN
console.log("> SLACK_TOKEN=XXXXXXXXXXXX node slackbot.js");
if (!slackToken) {
    console.log("Could not start as this bot requires a Webex Teams API access token.");
    console.log("Please invoke with an SLACK_TOKEN environment variable");
    console.log("Example:");
    console.log("> SLACK_TOKEN=XXXXXXXXXXXX node slackbot.js");
    process.exit(1);
}



//
// Create bot
//

var Botkit = require('botkit');

var env = process.env.NODE_ENV || "development";
var controller = Botkit.slackbot({
    debug: false,
});


var bot = controller.spawn({
    token: slackToken
}).startRTM(function(err, bot, payload) {
    if (err) {
        throw new Error('Could not connect to Slack');
    }
});



//
// Load skills
//

controller.hears('(.*)', ['message_received', 'direct_message', 'direct_mention', 'mention', 'ambient'], function(slackBot, message) {
    console.log(message);
    console.log(message.text);
    slackBot.reply(message, 'Hello');
});