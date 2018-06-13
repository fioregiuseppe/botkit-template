var controller = require('./bot/webex/controller.js')();
// Set up an Express-powered webserver to expose oauth and webhook endpoints
// We are passing the controller object into our express server module
// so we can extend it and process incoming message payloads 
var webserver = require('./webserver.js')(controller);
require('./bot/webex/init.js')(controller, webserver);
require('./bot/slack/init.js')(controller, webserver);