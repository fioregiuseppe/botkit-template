module.exports = function(controller) {
    var webserver = controller.webserver;

    var bot = controller.spawn({
        token: controller.slackToken
    }).startRTM(function(err, bot, payload) {
        if (err) {
            throw new Error('Could not connect to Slack');
        }
    });

    controller.createWebhookEndpoints(webserver, bot, function() {
        console.log("slack webhooks setup completed!");
    });

    //
    // Slack  Utilities
    //

    // Utility to add mentions if Bot is in a 'Group' space
    bot.appendMention = function(message, command) {
        return "`" + command + "`";
    }

    // [COMPAT] Adding this function to ease interoperability with the skills part of the Botkit samples project
    bot.enrichCommand = bot.appendMention;

    require('./load_skills.js')(controller, bot);


    // Receive post data from fb, this will be the messages you receive 
    webserver.post('/slack/receive', function(req, res) {
        console.log("> RECEIVE POST SLACK");
        // respond to FB that the webhook has been received.
        res.status(200);
        res.send('ok');


        // Now, pass the webhook into be processed
        controller.handleWebhookPayload(req, res, bot);
    });

    var port = process.env.PORT || 3000;
    var healthcheck = {
        "up_since": new Date(Date.now()).toGMTString(),
        "hostname": require('os').hostname() + ":" + port,
        "version": "v" + require("../../package.json").version,
        "bot": "itl", // loaded asynchronously
    };

    webserver.get('/slack/receive', function(req, res) {
        res.json(healthcheck);
    });


}