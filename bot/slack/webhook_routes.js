module.exports = function(controller, webserver) {
    console.log("> ROUTES SLACK");
    // Receive post data from fb, this will be the messages you receive 
    webserver.post('/slack/receive', function(req, res) {
        console.log("> RECEIVE POST SLACK");
        // respond to FB that the webhook has been received.
        res.status(200);
        res.send('ok');

        var bot = controller.spawn({
            token: controller.slackToken
        }).startRTM(function(err, bot, payload) {
            if (err) {
                throw new Error('Could not connect to Slack');
            }
        });


        //
        // Slack  Utilities
        //

        // Utility to add mentions if Bot is in a 'Group' space
        bot.appendMention = function(message, command) {

            // TODO 

            return "`" + command + "`";
        }

        // [COMPAT] Adding this function to ease interoperability with the skills part of the Botkit samples project
        bot.enrichCommand = bot.appendMention;

        require('./load_skills.js')(controller, bot);

        // Now, pass the webhook into be processed
        controller.handleWebhookPayload(req, res, bot);
    });
    // Perform the webhook verification handshake with your verify token 
    webserver.get('/slack/receive', function(req, res) {
        console.log("> RECEIVE GET SLACK");
        if (req.query['hub.mode'] == 'subscribe') {
            if (req.query['hub.verify_token'] == controller.config.verify_token) {
                res.send(req.query['hub.challenge']);
            } else {
                res.send('OK');
            }
        }
    });
}