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

var port = process.env.PORT || 3000;
controller.setupWebserver(port, function(err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function() {
        console.log("webhooks setup completed!");
    });

    // installing Healthcheck
    var healthcheck = {
        "up_since": new Date(Date.now()).toGMTString(),
        "hostname": require('os').hostname() + ":" + port,
        "version": "v" + require("./package.json").version,
        "bot": "unknown", // loaded asynchronously
        "botkit": "v" + bot.botkit.version()
    };
    webserver.get(process.env.HEALTHCHECK_ROUTE, function(req, res) {

        // As the identity is load asynchronously from the Webex Teams access token, we need to check until it's fetched
        if (healthcheck.bot == "unknown") {
            var identity = bot.botkit.identity;
            if (bot.botkit.identity) {
                healthcheck.bot = bot.botkit.identity.emails[0];
            }
        }

        res.json(healthcheck);
    });
    console.log("healthcheck available at: " + process.env.HEALTHCHECK_ROUTE);
});

//
// Load skills
//

/*controller.hears('(.*)', ['message_received', 'direct_message', 'direct_mention', 'mention', 'ambient'], function(slackBot, message) {
    console.log(message);
    console.log(message.text);
    slackBot.reply(message, 'Hello');
});*/

var normalizedPath = require("path").join(__dirname, "skills");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
    try {
        require("./skills/" + file)(controller, bot);
        console.log("loaded skill: " + file);
    } catch (err) {
        if (err.code == "MODULE_NOT_FOUND") {
            if (file != "utils") {
                console.log("could not load skill: " + file);
            }
        }
    }
});

bot.appendMention = function(message, command) {
    console.log(message);
    // if the message is a raw message (from a post message callback such as bot.say())
    /*if (message.roomType && (message.roomType == "group")) {
        var botName = bot.botkit.identity.displayName;
        return "`@" + botName + " " + command + "`";
    }

    // if the message is a Botkit message
    if (message.raw_message && (message.raw_message.data.roomType == "group")) {
        var botName = bot.botkit.identity.displayName;
        return "`@" + botName + " " + command + "`";
    }*/

    return "`" + command + "`";
}

// [COMPAT] Adding this function to ease interoperability with the skills part of the Botkit samples project
bot.enrichCommand = bot.appendMention;