module.exports = function(accessToken, public_url, secret) {
    secret = secret || '';
    // Load environment variables from project .env file
    require('node-env-file')(__dirname + '/../../.env');


    // Fetch token from environement
    // [COMPAT] supports SPARK_TOKEN for backward compatibility
    if (!accessToken) {
        console.log("Could not start as this bot requires a Webex Teams API access token.");
        process.exit(1);
    }

    if (!public_url) {
        console.log("Could not start as this bot must expose a public endpoint.");
        process.exit(1);
    }

    var Botkit = require('botkit');


    // Create the Botkit controller, which controls all instances of the bot.
    var env = process.env.NODE_ENV || "development";
    var controller = Botkit.sparkbot({
        log: true,
        public_address: public_url,
        ciscospark_access_token: accessToken,
        secret: secret, // this is a RECOMMENDED security setting that checks if incoming payloads originate from Webex
        webhook_name: process.env.WEBHOOK_NAME || ('built with BotKit (' + env + ')')
    });

    return controller;
}