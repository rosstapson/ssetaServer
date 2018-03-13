var Client = require('mariasql');
var config = require("../config");
var checkToken = require('../util').checkToken;
var AnswerSaver = require('./AnswerSaver');

module.exports = (app) => {
    app.get('/questionnaire_list', (req, res) => {
        console.log("get /questionnaire_list");
    });
    app.post('/questionnaire_list', (req, res) => {        
        if (!checkToken(req)) {
            return res.status(401).send({error: "Invalid Token"});
        }
        var c = new Client(config.DB_CONFIG);      
        c.query('SELECT id, name, reference FROM questionnaires', null, function(err, rows) {
            if (err) {
                console.log(err);
                return res.status(400).send({error: "token expired"});
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
        if (!checkToken(req)) {
            return res.status(401).send({error: "Invalid Token"});
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
            questionnaire.id = insertId;
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
            questionnaire.entries = [];
            res.status(201).send({questionnaire: questionnaire});
        }
        });

    });
    app.post('/get_questionnaire', (req, res) => {        
        if (!checkToken(req)) {
            return res.status(401).send({error: "Invalid Token"});
        }
        var c = new Client(config.DB_CONFIG);      
        c.query('SELECT * FROM questionnaires WHERE id = ?', [req.body.id], function(err, rows) {
            if (err) {
                console.log(err);
                return res.status(400).send("Unable to retrieve questionnaire");
            }
            // rows.info.metadata` contains the metadat
            
            let questionnaire = {
                id: rows[0].id,
                name: rows[0].name,
                reference: rows[0].reference,
                trainingProvider: rows[0].training_provider,
                clientCompany: rows[0].client_company,
                clientDivision: rows[0].client_division,
                formEntries: []
            };
            
            c.query('SELECT * FROM questions WHERE questionnaire_id = ?', [req.body.id], function(err, rows) {
                if (err) {
                    console.log(err);
                    return res.status(400).send("Unable to retrieve questions");
                }
                rows.forEach(row => {                                       
                    questionnaire.formEntries.push(row);
                });                
                return res.status(200).send(questionnaire);
            });            
        });
      
        c.end();
    });
app.post('/answers', (req, res) => {
    if (!checkToken(req)) {
        return res.status(401).send({error: "Invalid Token"});
    }
    var results = req.body.result;
    var answers = results.answers;
	var index = 0;
	var length = answers.length;
        var answerSaver = new AnswerSaver();
        answerSaver.on('error', error =>{
            console.log(error);
            res.writeHead(500);
            res.end();
        });
        answerSaver.on('success', result => {
            index = index + 1;
            if (index < length) {
                answerSaver.perform(answers[index], results.userId, results.questionnaireId);
            }
            else {
                return res.status(201).send(result);
            }
        });
        answerSaver.perform(answers[0], results.userId, results.questionnaireId);  
    });
}
