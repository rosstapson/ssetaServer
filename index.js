var Express = require('express');
//var Webtask = require('webtask-tools');
var bodyParser = require('body-parser')
var app = Express();
var cors = require('cors');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

require('./routes/users')(app);
//require('./routes/questionnaires')(app);

app.listen(3000, () => console.log('ZOMG. listening on port 3000.'))
