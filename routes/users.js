// ./routes/users.js
var Client = require('mariasql');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var config = require("../config");

module.exports = (app) => {
  app.get('/users', (req, res) => {
      //req.userModel.find({}).sort({'email': -1}).exec((err, users) => res.json(users))
      var c = new Client(config.DB_CONFIG);
      
      c.query('SELECT * FROM users', null, { metadata: true }, function(err, rows) {
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
    var c = new Client(config.DB_CONFIG);
//console.log('email on request body: ' + req.body.user.email);    
    c.query('SELECT * FROM users WHERE email= :email', {email: req.body.user.email},  function(err, rows) {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      else {
         // `rows.info.metadata` contains the metadata
      console.dir(rows.info.numRows);
      if (rows.info.numRows === '0') {
        res.status(400).send("Invalid User Credentials"); 
      }
      else {
        res.status(200).send("Huzzah");
      }}
    });
    
    c.end();
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
