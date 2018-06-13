module.exports = function(webserver, controller) {
    // Receive post data from fb, this will be the messages you receive 
    webserver.post('/ciscospark/receive', function(req, res) {

        // respond to FB that the webhook has been received.
        res.status(200);
        res.send('ok');

        var bot = controller.spawn({});

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

        require('./load_skills.js')(controller, bot);

        // Now, pass the webhook into be processed
        controller.handleWebhookPayload(req, res, bot);
    });
    // Perform the webhook verification handshake with your verify token 
    webserver.get('/ciscospark/receive', function(req, res) {
        if (req.query['hub.mode'] == 'subscribe') {
            if (req.query['hub.verify_token'] == controller.config.verify_token) {
                res.send(req.query['hub.challenge']);
            } else {
                res.send('OK');
            }
        }
    });
}