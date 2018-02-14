var Client = require('mariasql');
var config = require("../config");
var checkToken = require('../util').checkToken;
var Meta = require('./Meta');

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
        var meta = new Meta();
        meta.on('error', error =>{
            console.log(error);
            res.writeHead(500);
            res.end();
        });
        meta.on('failure', reason => {
            console.log(reason);
            res.end(reason);
        });
        meta.on('success', meta => {
            res.status(200).send(meta);
        });
        meta.perform();
    });
    app.post('/schedule_events', (req, res) => {
        if (!checkToken(req)) {
            return res.status(401).send({error: "Invalid Token"});
        }
        var events = req.body.schedule.events;
        var values = [events.length];
        //console.log(req.body.schedule)
        for (var i = 0; i < events.length; i++) {
            values[i] = [events[i].userId, events[i].eventId, events[i].eventType, events[i].dateTime, "pending"];
        }
        // events.forEach(event => {
        //     //console.log(event)
        //     values.push();
        // });
        console.log(values)
        var c = new Client(config.DB_CONFIG);
        var sql = "INSERT INTO schedule (user_id, event_id, event_type, date_time, status) VALUES ?";
        var query = c.query(
            sql,
            [values],  
            function(err, rows) {
                if (err) {
                console.log(err);
                return res.status(400).send(err);
                }
                else {
                    return res.status(201);
                }
            }
        );
    });
}
