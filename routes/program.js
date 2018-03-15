var Client = require('mariasql');
var config = require("../config");
var checkToken = require('../util').checkToken;
// var Meta = require('./Meta');
// var EventSaver = require('./EventSaver');


module.exports = (app) => {
    app.get('/program', (req, res) => {
        console.log("get /questionnaire_list");
    });
    app.post('/program', (req, res) => {
        if (!checkToken(req)) {
            return res.status(401).send({error: "Invalid Token"});
        }
        var c = new Client(config.DB_CONFIG);
        c.query('SELECT * FROM program', null, function(err, rows) {
            if (err) {
                console.log(err);
                return res.status(400).send({error: "token expired"});
            }
            // `rows.info.metadata` contains the metadata            
            res.status(200).send(rows);
        });
        c.end();
    });
}
