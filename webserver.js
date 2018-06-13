var express = require('express');
var bodyParser = require('body-parser');
var querystring = require('querystring');

module.exports = function(controller, bot) {

    var webserver = express();
    webserver.use(bodyParser.json());
    webserver.use(bodyParser.urlencoded({ extended: true }));

    webserver.use(express.static('public'));

    // You can pass in whatever hostname you want as the second argument
    // of the express listen function, it defaults to 0.0.0.0 aka localhost 
    webserver.listen(process.env.PORT || 3000, null, function() {

        console.log('Express webserver configured and listening at ',
            process.env.HOSTNAME || 'http://localhost/' + ':' + process.env.PORT || 3000);

    });

    return webserver;
}