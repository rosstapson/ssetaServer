var Express = require('express');
var Webtask = require('webtask-tools');
var bodyParser = require('body-parser')
var app = Express();
var cors = require('cors');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// yet to be created
app.use(require('./middleware/db').connectDisconnect);
require('./routes/users')(app);
require('./routes/questionnaires')(app);
// app.use(require('./routes/users'));
// app.use(require('./routes/questionnaires'));

module.exports = Webtask.fromExpress(app);