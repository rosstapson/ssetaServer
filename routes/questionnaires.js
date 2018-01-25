var jwt = require('jsonwebtoken');
var config = require("../config");

module.exports = (app) => {
    app.get('/questionnaire_list', (req, res) => {
        console.log("get /questionnaire_list");
    });
    app.post('/questionnaire_list', (req, res) => {
        var decoded = jwt.verify(req.body.token, config.secret);
        if (!decoded) {
            res.status(400).send("Invalid token");
        }
        var c = new Client(config.DB_CONFIG);      
        c.query('SELECT id, name, reference FROM questionnaires', null, function(err, rows) {
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
