var mongoose = require('mongoose');
const UserSchema = require('../models/User');
const QuestionnaireSchema = require('../models/Questionnaire');

module.exports = {    
    connectDisconnect: (req, res, next) => {        
        const connection = mongoose.createConnection(req.webtaskContext.secrets.MONGO_URL);        
        req.userModel = connection.model('User', UserSchema);
        req.questionnaireModel = connection.model('Questionnaire', QuestionnaireSchema);
        req.on('end', () => {           
            mongoose.connection.close();
        })        
        next()
    },
}