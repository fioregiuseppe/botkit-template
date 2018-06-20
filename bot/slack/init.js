module.exports = function(webserver, slackToken) {

    // Register our routes, in this case we're just using one route
    // for all incoming requests
    // We are passing in the webserver we created, and the botkit
    // controller into our routes file so we can extend both of them 
    var controller = require('./controller.js')(slackToken);
    controller.webserver = webserver;
    controller.botType = 'slack';
    require('./webhook_routes.js')(controller)
    return controller;
}