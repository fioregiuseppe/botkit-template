module.exports = function() {
    // Load environment variables from project .env file
    require('node-env-file')(__dirname + '/../../.env');

    // Fetch token from environement
    // [COMPAT] supports SPARK_TOKEN for backward compatibility
    var slackToken = process.env.SLACK_TOKEN
    console.log("> CONTROLLER SLACK");
    if (!slackToken) {
        console.log("Could not start as this bot requires a Webex Teams API access token.");
        console.log("Please invoke with an SLACK_TOKEN environment variable");
        process.exit(1);
    }
    var Botkit = require('botkit');


    // Create the Botkit controller, which controls all instances of the bot.
    var env = process.env.NODE_ENV || "development";
    var controller = Botkit.slackbot({
        debug: false,
    });
    controller.slackToken = slackToken;
    return controller;
}