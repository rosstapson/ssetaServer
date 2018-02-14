const EventEmitter = require('events');
var config = require('../config');
var util = require('util');
var Client = require('mariasql');
var c = new Client(config.DB_CONFIG);
var meta = {};

function Meta() {
    var self = this;
    function _checkForErrors(error, rows, reason) {
        if (error) {
            this.emit('error', error);
            return true;
        }        
        if (rows.length < 1) {
            this.emit('failure', reason);
            return true;
        }        
        return false;
    }
    function _getConferences(error, rows) {
        if (_checkForErrors(error, rows, 'users')) {
            return false;
        } else {
            meta.users = rows;
            c.query('SELECT * FROM conferences', null, _getQuestionnaires);
        }
    }
    function _getQuestionnaires(error, rows) {
        if(_checkForErrors(error, rows, 'conferences')) {
            return false;
        } else {
            meta.conferences = rows;
            c.query('SELECT * FROM questionnaires', null, _populate);
        }
    }
    function _populate(error, rows) {
        if (_checkForErrors(error, rows, 'questionnaires')) {
            return false;
        } else {
            meta.questionnaires = rows;
            self.emit('success', meta);
        }
    }
    function perform() {
        c.query('SELECT * FROM users;', null, _getConferences);
    }
    this.perform = perform;    
}
util.inherits(Meta, EventEmitter);
module.exports = Meta;
