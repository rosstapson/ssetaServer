const EventEmitter = require('events');
var config = require('../config');
var util = require('util');
var Client = require('mariasql');
var c = new Client(config.DB_CONFIG);


function EventSaver() {
    var self = this;
    function _checkForErrors(error, rows) {
        if (error) {
            self.emit('error', error);
            return true;
        }
        self.emit('success', rows);
    }
    function perform(event) {
        var values = [event.userId, event.eventId, event.eventType, event.dateTime, 'pending']
        c.query("INSERT INTO schedule (user_id, event_id, event_type, date_time, status) VALUES (?, ?, ?, ?, ?)", values, _checkForErrors);
    }
    this.perform = perform;    
}
util.inherits(EventSaver, EventEmitter);
module.exports = EventSaver;
