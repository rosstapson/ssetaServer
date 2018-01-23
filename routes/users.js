// ./routes/users.js
var Client = require('mariasql');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var config = require("../config");

module.exports = (app) => {
  app.get('/users', (req, res) => {
      //req.userModel.find({}).sort({'email': -1}).exec((err, users) => res.json(users))
      var c = new Client({
        host: '127.0.0.1',
        user: 'centos',
        password: 'yoda100'
      });
      
      c.query('SHOW DATABASES', null, { metadata: true }, function(err, rows) {
        if (err)
          console.log(err);
        // `rows.info.metadata` contains the metadata
        console.dir(rows);
      });
      
      c.end();
  });
function createToken(user) {
    if (!user.role) {
        user.role = 'guest';
    }
    return jwt.sign({
        username: user.email,
        role: user.role
    }, config.secret, {
        expiresIn: 60 * 60 * 24
    });
}
  app.options('/login', cors());
  app.post('/login', (req, res) => {
      console.log("post login");
  });

  app.post('/users', (req, res) => {
      console.log("post /users");
      
  })

  app.put('/users', (req, res) => {
    console.log("put /users")
  })

  app.delete('/users', (req, res) => {
    console.log("delete /users")
  })
}