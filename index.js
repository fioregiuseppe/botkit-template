// Load environment variables from project .env file
require('node-env-file')(__dirname + '/.env');


// Fetch token from environement
// [COMPAT] supports SPARK_TOKEN for backward compatibility
var accessToken = process.env.ACCESS_TOKEN || process.env.SPARK_TOKEN
if (!accessToken) {
    console.log("Could not start as this bot requires a Webex Teams API access token.");
    console.log("Please invoke with an ACCESS_TOKEN environment variable");
    console.log("Example:");
    console.log("> ACCESS_TOKEN=XXXXXXXXXXXX PUBLIC_URL=YYYYYYYYYYYYY node bot.js");
    process.exit(1);
}

// Get public URL where the Webex cloud platform will post notifications (webhook registration)
var public_url = process.env.PUBLIC_URL;
// Infer the app domain for popular Cloud PaaS
if (!public_url) {

    // Heroku hosting: available if dyno metadata are enabled, https://devcenter.heroku.com/articles/dyno-metadata
    if (process.env.HEROKU_APP_NAME) {
        public_url = "https://" + process.env.HEROKU_APP_NAME + ".herokuapp.com";
    }

    // Glitch hosting
    if (process.env.PROJECT_DOMAIN) {
        public_url = "https://" + process.env.PROJECT_DOMAIN + ".glitch.me";
    }
}
if (!public_url) {
    console.log("Could not start as this bot must expose a public endpoint.");
    console.log("Please add env variable PUBLIC_URL on the command line or to the .env file");
    console.log("Example: ");
    console.log("> ACCESS_TOKEN=XXXXXXXXXXXX PUBLIC_URL=YYYYYYYYYYYYY node bot.js");
    process.exit(1);
}

var Botkit = require('botkit');


// Create the Botkit controller, which controls all instances of the bot.
var env = process.env.NODE_ENV || "development";
var controller = Botkit.sparkbot({
    log: true,
    public_address: public_url,
    ciscospark_access_token: accessToken,
    secret: process.env.SECRET, // this is a RECOMMENDED security setting that checks if incoming payloads originate from Webex
    webhook_name: process.env.WEBHOOK_NAME || ('built with BotKit (' + env + ')')
});
var bot = controller.spawn({});
// Set up an Express-powered webserver to expose oauth and webhook endpoints
// We are passing the controller object into our express server module
// so we can extend it and process incoming message payloads 
var webserver = require('./webserver.js')(controller);



//
// Webex Teams Utilities
//

// Utility to add mentions if Bot is in a 'Group' space
bot.appendMention = function(message, command) {

    // if the message is a raw message (from a post message callback such as bot.say())
    if (message.roomType && (message.roomType == "group")) {
        var botName = bot.botkit.identity.displayName;
        return "`@" + botName + " " + command + "`";
    }

    // if the message is a Botkit message
    if (message.raw_message && (message.raw_message.data.roomType == "group")) {
        var botName = bot.botkit.identity.displayName;
        return "`@" + botName + " " + command + "`";
    }

    return "`" + command + "`";
}

// [COMPAT] Adding this function to ease interoperability with the skills part of the Botkit samples project
bot.enrichCommand = bot.appendMention;


// Load skills
//

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