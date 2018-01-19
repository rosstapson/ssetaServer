var mongoose = require('mongoose');
const UserSchema = require('../models/User');
const QuestionnaireSchema = require('../models/Questionnaire');
var config = require("../config");

module.exports = {    
    connectDisconnect: (req, res, next) => {
        try {
            const connection = mongoose.connect(config.DB_URL);        
            connection.on('error', console.error.bind(console, 'connection error:'));        
            req.userModel = connection.model('User', UserSchema);
            req.questionnaireModel = connection.model('Questionnaire', QuestionnaireSchema);
            req.on('end', () => {           
                mongoose.connection.close();
            })        
            next()
        }
        catch(err) {
            console.log(err);
        }
    },
}