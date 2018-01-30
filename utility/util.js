var jwt = require('jsonwebtoken');
module.exports = {
    checkToken: function(req) {
        try {
            var decoded = jwt.verify(req.body.token, config.secret);
            if (!decoded) {
                return false;
            }
            else {
                console.log("valid");
                return "valid";
            }
        }
        catch(err) {
            console.log(err);
            return false;
        }
    }
}