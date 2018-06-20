module.exports = function(webserver, accessToken, public_url, secret) {

    // Register our routes, in this case we're just using one route
    // for all incoming requests
    // We are passing in the webserver we created, and the botkit
    // controller into our routes file so we can extend both of them 
    var controller = require('./controller.js')(accessToken, public_url, secret);
    controller.webserver = webserver;
    controller.botType = 'webex';
    require('./webhook_routes.js')(controller);
    return controller;
}