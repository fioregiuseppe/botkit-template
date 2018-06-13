module.exports = function() {
    // Load environment variables from project .env file
    require('node-env-file')(__dirname + '/../../.env');

    var Botkit = require('botkit');


    // Create the Botkit controller, which controls all instances of the bot.
    var env = process.env.NODE_ENV || "development";
    var controller = Botkit.slackbot({
        debug: false,
    });
    return controller;
}