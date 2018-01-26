var Client = require('mariasql');
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
            if (err) {
                console.log(err);
                return res.status(400).send("zomg");
            }
            // `rows.info.metadata` contains the metadata
            let questionnaires =[];
            rows.forEach(row => {
                questionnaires.push({
                    id: row.id,
                    name: row.name,
                    reference: row.reference
                })
            });
            res.status(200).send(questionnaires);
        });
      
        c.end();
    });
    app.post('/questionnaires', (req, res) => {
        var decoded = jwt.verify(req.body.token, config.secret);
        if (!decoded) {
            res.status(400).send("Invalid token");
        }
        var questionnaire = req.body.questionnaire;
        questionnaire.createdBy = 'bob';
        var c = new Client(config.DB_CONFIG);
        c.query('INSERT INTO questionnaires (name, reference, training_provider, client_company, client_division) VALUES (?, ?, ?, ?, ?)',
      [ 
        questionnaire.name,
        questionnaire.reference,
        questionnaire.trainingProvider,
        questionnaire.clientCompany,
        questionnaire.clientDivision          
        ],  function(err, rows) {
        if (err) {
          console.log(err);
          res.status(400).send(err);
        }
        else { 
            console.log(rows);
            var insertId = rows.info.insertId;
            console.log("questionnaire_id: " + insertId);
            questionnaire.entries.forEach(entry => {
                //console.log(entry);
                c.query('INSERT INTO questions (questionnaire_id, question_text, answer_type) VALUES (?, ?, ?)', 
                  [
                    insertId,
                    entry.question,
                    entry.answerType
                  ], function(err, rows) {
                    if(err) {
                       console.log(err);
                       return res.status(400).send(err);

                    }
                  });
            });
            //console.log(questionnaire.entries);
            res.status(201).send({message: "Questionnaire Saved"});
        }
        });

    });
    app.post('/get_questionnaire', (req, res) => {
        var decoded = jwt.verify(req.body.token, config.secret);
        if (!decoded) {
            res.status(400).send("Invalid token");
        }
        var c = new Client(config.DB_CONFIG);      
        c.query('SELECT * FROM questionnaires WHERE id = (?)', req.body.id, function(err, rows) {
            if (err) {
                console.log(err);
                return res.status(400).send("Unable to retrieve questionnaire");
            }
            // `rows.info.metadata` contains the metadata
            let questionnaire = {
                id: row.id,
                name: row.name,
                reference: row.reference,
                trainingProvider: row.training_provider,
                clientCompany: row.client_company,
                clientDivision: row.client_division
            };
            c.query('SELECT * FROM questionnaires WHERE id = (?)', req.body.id, function(err, rows) {
                if (err) {
                    console.log(err);
                    return res.status(400).send("Unable to retrieve questions");
                }
                rows.forEach(row => {
                    let entry = {
                        id: row.id,
                        questionText: row.question_text,
                        answerType: row.answer_type
                    }
                });            
            });
            res.status(200).send(questionnaire);
        });
      
        c.end();
    });
}
