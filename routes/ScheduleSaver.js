const EventEmitter = require('events');
var config = require('../config');
var util = require('util');
var Client = require('mariasql');
var c = new Client(config.DB_CONFIG);


function ScheduleSaver(schedule) {
    var index = 0;
    var length = schedule.events.length;
    var self = this;
    function _checkForErrors(error, rows) {
        if (error) {
            self.emit('error', error);
            return true;
        }
        _checkForCompletion();
    }
    function _checkForCompletion() {
        index = index + 1;
        if (index === length) {
            self.emit('complete');
            return true;
        }
        this.perform;
    }
    function perform() {
        var event = schedule.events[index];
        var values = [event.userId, event.eventId, event.eventType, event.dateTime, 'pending']
        c.query("INSERT INTO schedule (user_id, event_id, event_type, date_time, status) VALUES (?, ?, ?, ?, ?)", values, _checkForErrors);
    }
    this.perform = perform;    
}
util.inherits(ScheduleSaver, EventEmitter);
module.exports = ScheduleSaver;
