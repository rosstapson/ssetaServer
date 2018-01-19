var mongoose = require('mongoose');
const UserSchema = require('../models/User');
const QuestionnaireSchema = require('../models/Questionnaire');
var config = require("../config");

module.exports = {    
    connectDisconnect: (req, res, next) => {
        const connection = mongoose.connect(config.DB_URL);
        req.userModel = connection.model('User', UserSchema);
        req.questionnaireModel = connection.model('Questionnaire', QuestionnaireSchema);
        req.on('end', () => {           
            mongoose.connection.close();
        })        
        next()
    },
}