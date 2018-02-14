var Client = require('mariasql');
var config = require("../config");
var checkToken = require('../util').checkToken;

module.exports = (app) => {
    app.get('/schedule', (req, res) => {
        console.log("get /questionnaire_list");
    });
    app.post('/schedule', (req, res) => {
        if (!checkToken(req)) {
            return res.status(401).send({error: "Invalid Token"});
        }
        var c = new Client(config.DB_CONFIG);      
        c.query('SELECT * FROM schedule where user_id = (?)', [req.body.id], function(err, rows) {
            if (err) {
                console.log(err);
                return res.status(400).send({error: "token expired"});
            }
            // `rows.info.metadata` contains the metadata            
            res.status(200).send(rows);
        });
        c.end();
    });
    app.post('/schedule_meta', (req, res) => {
        if (!checkToken(req)) {
            return res.status(401).send({error: "Invalid Token"});
        }
        var c = new Client(config.DB_CONFIG);
        var meta = {
            users: [],
            questionnaires: [],
            conferences: []
        };
        // three queries, one for each
        c.query('SELECT * FROM users', null, function(err, rows) {
            if (err) {
                console.log(err);
                return res.status(400).send({error: err});
            }
            meta.users = rows;
        });
        c.query('SELECT * FROM conferences', null, function(err, rows) {
            if (err) {
                console.log(err);
                return res.status(400).send({error: err});
            }
            meta.conferences = rows;
        });
        c.query('SELECT * FROM questionnaires', null, function(err, rows) {
            if (err) {
                console.log(err);
                return res.status(400).send({error: err});
            }
            meta.questionnaires = rows;
        });
        res.status(200).send(meta);
    });
}
