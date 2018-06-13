var webex_controller = require('./bot/webex/controller.js')();
var slack_controller = require('./bot/slack/controller.js')();
// Set up an Express-powered webserver to expose oauth and webhook endpoints
// We are passing the controller object into our express server module
// so we can extend it and process incoming message payloads 
var webserver = require('./webserver.js')();
//require('./bot/webex/init.js')(webex_controller, webserver);
require('./bot/slack/init.js')(slack_controller, webserver);