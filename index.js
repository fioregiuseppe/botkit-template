// Set up an Express-powered webserver to expose oauth and webhook endpoints
// We are passing the controller object into our express server module
// so we can extend it and process incoming message payloads 
var webserver = require('./webserver.js')();


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
// WEBEX 
require('./bot/webex/init.js')(webserver, process.env.ACCESS_TOKEN, public_url, 'secrettok');

// SLACK
var slackToken = process.env.SLACK_TOKEN
require('./bot/slack/init.js')(webserver, slackToken);