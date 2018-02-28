var Express = require('express');
var http = require('http');
var https = require('https');
var bodyParser = require('body-parser')
var cors = require('cors');
var app = Express();
var httpApp = Express();
var fs = require('fs');
var config = require('./config');

// httpApp simply redirects http to https
httpApp.set(config.httpPort);
app.set(config.port);
httpApp.get("*", function (req, res, next) {
    res.redirect("https://" + req.headers.host + req.path);
});
var httpsOptions = { 
    key: fs.readFileSync("/etc/letsencrypt/live/rhtech.co.za/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/rhtech.co.za/fullchain.pem")
};

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

require('./routes/users')(app);
require('./routes/questionnaires')(app);
require('./routes/schedule')(app);

http.createServer(httpApp).listen(config.httpPort, function() {
    console.log("ZOMG!");
    console.log('Express HTTP server listening on port ' + config.httpPort);
});

https.createServer(httpsOptions, app).listen(config.port, function() {
    console.log('Express HTTPS server listening on port ' + config.port);
    console.log("HTTPS branch");
});