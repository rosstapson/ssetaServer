var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
//const User = require('../models/User');
var config = require("../config");

module.exports = (app) => {
    app.get('/questionnaires', (req, res) => {
        req.questionnaireModel.find({}).sort({'createdAt': -1}).exec((err, questionnaires) => res.json(questionnaires));
    });
    app.post('/questionnaires', (req, res) => {
        //var decoded = jwt.verify(req.body.token, config.secret);
        var questionnaire = req.body.questionnaire;
        questionnaire.createdBy = 'bob';
        try {
            const newQuestionnaire = req.questionnaireModel(Object.assign({}, questionnaire));            
            newQuestionnaire.save((err, savedQ) => {
                 res.json(savedQ);
            })
        }
        catch(err) {
            res.status(418).send(err.message);
        }
    });
}
