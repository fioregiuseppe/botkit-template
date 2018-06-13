module.exports = function(controller, webserver) {

    // Register our routes, in this case we're just using one route
    // for all incoming requests from FB
    // We are passing in the webserver we created, and the botkit
    // controller into our routes file so we can extend both of them 

    require('./webhook_routes.js')(controller, webserver)
    controller.webserver = webserver;
    return controller;
}