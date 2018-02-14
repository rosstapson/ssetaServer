const EventEmitter = require('events');
var config = require('../config');

var Client = require('mariasql');
var c = new Client(config.DB_CONFIG);
var meta = {};

export default class Meta extends EventEmitter {
    _checkForErrors(error, rows, reason) {
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
    _getConferences(error, rows) {        
        if (_checkForErrors(error, rows, 'users')) {
            return false;
        } else {
            meta.users = rows;
            c.query('SELECT * FROM conferences', null, _getQuestionnaires);
        }
    }
    _getQuestionnaires(error, rows) {
        if(_checkForErrors(error, rows, 'conferences')) {
            return false;
        } else {
            meta.conferences = rows;
            c.query('SELECT * FROM questionnaires', null, _populate);
        }
    }
    _populate(error, rows) {
        if (this._checkForErrors(error, rows, 'questionnaires')) {
            return false;
        } else {
            meta.questionnaires = rows;
            this.emit('success', meta);
        }
    }
    perform() {
        c.query('SELECT * FROM users', null, _getConferences);
    }
}