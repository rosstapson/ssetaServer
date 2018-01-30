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
            return false;
        }
    }
}