const EventEmitter = require('events');
var config = require('../config');
var util = require('util');
var Client = require('mariasql');
var c = new Client(config.DB_CONFIG);


function AnswerSaver() {
    var self = this;
    function _checkForErrors(error, rows) {
        if (error) {
            self.emit('error', error);
            return true;
        }
        self.emit('success', rows);
    }
    function perform(answer, userId, questionnaireId) {
        var values = [userId, answer.questionId, questionnaireId, answer.answer];
        c.query("INSERT INTO answers (user_id, question_id, questionnaire_id, answer) VALUES (?, ?, ?, ?)", values, _checkForErrors);
    }
    this.perform = perform;    
}
util.inherits(AnswerSaver, EventEmitter);
module.exports = AnswerSaver;
