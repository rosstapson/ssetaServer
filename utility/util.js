var jwt = require('jsonwebtoken');
var config = require("../config");

module.exports = {
    checkToken: function(req) {
        try {
            var decoded = jwt.verify(req.body.token, config.secret);
            if (!decoded) {
                return false;
            }
            else {                
                return "valid";
            }
        }
        catch(err) {
            console.log(err);
            return false;
        }
    }
}