// ./routes/users.js
var Client = require('mariasql');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var config = require("../config");
<<<<<<< HEAD
var cuid = require("cuid");
=======

>>>>>>> 065ded5a2635f199d0d70a361e6baddf1ea85976

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
        else 
        {
          
          if (req.body.user.password !== rows[0].password) {
             res.status(400).send("Invalid User Credentials");
          }
          else {
             var token = createToken(req.body.user);
             res.status(200).send({token: token});
          }
        }
      }
    });
    
    c.end();
  });

<<<<<<< HEAD

=======
  app.post('/users', (req, res) => {
>>>>>>> 065ded5a2635f199d0d70a361e6baddf1ea85976
    var user = req.body.user;
    var id = cuid();
    if (!user.email || !user.password) {
      res.status(400).send("Invalid user credentials");
    }
    else {
      var c = new Client(config.DB_CONFIG);

<<<<<<< HEAD
    c.query('INSERT INTO users (name, email, password, company, division, role, access_level, telephone, address, state, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
     [ 
=====
      
>>>>>>> 065ded5a2635f199d0d70a361e6baddf1ea85976
        user.name,
        user.email,
        user.password,
        user.company,
        user.division,
        user.role,
        user.accessLevel,
        user.telephone,
        user.address,
        user.state,
        user.country
      ],  function(err, rows) {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      else {
        res.status(201).send("Success");
      }
    })
  }
<<<<<<< HEAD
});
=======
>>>>>>> 065ded5a2635f199d0d70a361e6baddf1ea85976

  app.put('/users', (req, res) => {
    console.log("put /users")
  })

  app.delete('/users', (req, res) => {
    console.log("delete /users")
  })
}
