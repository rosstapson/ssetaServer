var mongoose = require('mongoose');
const UserSchema = require('../models/User');

module.exports = {    
    connectDisconnect: (req, res, next) => {        
        const connection = mongoose.createConnection(req.webtaskContext.secrets.MONGO_URL);        
        req.userModel = connection.model('User', UserSchema);
        req.on('end', () => {           
            mongoose.connection.close();
        })        
        next()
    },
}