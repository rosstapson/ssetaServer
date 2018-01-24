var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require("../config");

module.exports = (app) => {
    app.get('/questionnaires', (req, res) => {
        var decoded = jwt.verify(req.body.token, config.secret);
        if (!decoded) {
            res.status()
        }
        var c = new Client(config.DB_CONFIG);      
        c.query('SELECT * FROM questionnaires', null, function(err, rows) {
            if (err)
            console.log(err);
            // `rows.info.metadata` contains the metadata
            console.dir(rows);
        });
      
        c.end();
    });
    app.post('/questionnaires', (req, res) => {
        var decoded = jwt.verify(req.body.token, config.secret);
        var questionnaire = req.body.questionnaire;
        questionnaire.createdBy = 'bob';
        
    });
}
