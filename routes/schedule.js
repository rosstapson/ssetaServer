var Client = require('mariasql');
var config = require("../config");
var checkToken = require('../util').checkToken;
var Meta = require('./Meta');
var EventSaver = require('./EventSaver');
var ScheduleSaver = require('./ScheduleSaver');

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
        var scheduleSaver = new ScheduleSaver();
        scheduleSaver.on('error', error =>{
            console.log(error);
            res.writeHead(500);
            res.end();
        });
        scheduleSaver.on('complete', result => {
            res.status(201).send(result);
        });
        scheduleSaver.perform(req.body.schedule);  
    });
    app.post('/schedule_event', (req, res) => {
        if (!checkToken(req)) {
            return res.status(401).send({error: "Invalid Token"});
        }
        var event = req.body.event;
        console.log(event);
        var eventSaver = new EventSaver();
        eventSaver.on('error', error =>{
            console.log(error);
            res.writeHead(500);
            res.end();
        });
        eventSaver.on('success', meta => {
            res.status(201).send(meta);
        });
        eventSaver.perform(event);        
    });
}
