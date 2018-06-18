var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

module.exports = function(webserver) {
    webserver.get('/', function(req, res) {
        console.log(req.body);
        res.json({ msg: 'hello' });
    });

    webserver.get('/', function(req, res) {
        req.session.test = "OK";
        res.json({ msg: 'hello' });
    });
    webserver.post('/test', jsonParser, function(req, res) {
        console.log(req.body);
    });
}