module.exports = function(webserver) {
    webserver.get('/', function(req, res) {
        req.session.test = "OK";
        res.json({ msg: 'hello' });
    });

    webserver.get('/test', function(req, res) {
        res.json({ msg: req.session.test });
    });
}