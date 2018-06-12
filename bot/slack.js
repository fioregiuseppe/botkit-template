module.exports = {
    init: (Botkit, webServer) => {
        require('node-env-file')(__dirname + '/../.env');


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


        controller.createWebhookEndpoints(webServer, bot, function() {
            console.log("webhooks setup completed!");
        });
        var port = 3000;

        // installing Healthcheck
        var healthcheck = {
            "up_since": new Date(Date.now()).toGMTString(),
            "hostname": require('os').hostname() + ":" + port,
            "version": "v" + require("../package.json").version,
            "bot": "unknown", // loaded asynchronously
            "botkit": "v" + bot.botkit.version()
        };

        webServer.get('/', function(req, res) {

            // As the identity is load asynchronously from the Webex Teams access token, we need to check until it's fetched
            if (healthcheck.bot == "unknown") {
                var identity = bot.botkit.identity;
                if (bot.botkit.identity) {
                    healthcheck.bot = bot.botkit.identity.emails[0];
                }
            }

            res.json(healthcheck);
        });

        console.log("healthcheck available at: /slack");

    }

};