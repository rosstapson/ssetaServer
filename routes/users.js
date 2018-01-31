// ./routes/users.js
var Client = require('mariasql');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var config = require("../config");
var checkToken = require('../utility/util').checkToken;

module.exports = (app) => {
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
    app.post('/user', (req, res) => {
      if (!checkToken(req)) {
        return res.status(401).send({error: "Invalid Token"});
      }
      var c = new Client(config.DB_CONFIG);      
      c.query('SELECT * FROM users WHERE id = ?', [req.body.id], { metadata: true }, function(err, rows) {
        if (err) {
          return res.status(400).send("DB Error, unable to retrieve user")
          console.log(err);
        }
        return res.status(200).send(rows[0]);
      });
      
      c.end();
  });
  // ''/user_update

  app.post('/user_update', (req, res) => {
    if (!checkToken(req)) {
      return res.status(401).send({error: "Invalid Token"});
    }
    var c = new Client(config.DB_CONFIG);
    var user = req.body.user;
    //connection.query('UPDATE users SET ? WHERE UserID = ?', [{ Name: name }, userId])
    c.query(`UPDATE users SET
        name = ?,
        email = ?,
        company = ?,
        division = ?,
        role = ?,
        access_level = ?,
        telephone = ?,
        address = ?,
        state = ?,
        country = ? 
        WHERE id = ?`,
        [user.email,
        user.company,
        user.division,
        user.role,
        user.access_level,
        user.telephone,
        user.address,
        user.state,
        user.country,
        user.id], function(err, rows) {
      if (err) {
        console.log(err);
        return res.status(400).send({error: "DB Error, unable to update user"});
      }
      return res.status(200).send("zomg");
    });
    
    c.end();
});
  app.post('/user_list', (req, res) => {
    if (!checkToken(req)) {
      return res.status(401).send({error: "Invalid Token"});
    }
    var c = new Client(config.DB_CONFIG);      
    c.query('SELECT * FROM users', null, { metadata: true }, function(err, rows) {
      if (err) {
        return res.status(400).send("DB Error, unable to retrieve users")
        console.log(err);
      }
      return res.status(200).send(rows);
    });
    
    c.end();
});

  app.options('/login', cors());
  app.post('/login', (req, res) => {
    var c = new Client(config.DB_CONFIG);

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
             var user = rows[0];
             var token = createToken(user);             
             user.token = token;             
             res.status(200).send(user);
          }
        }
      }
    });
    
    c.end();
  });

  app.post('/users', (req, res) => {
    var user = req.body.user;   
    if (!user.email || !user.password) {
      res.status(400).send("Invalid user credentials");
    }
    else {
      var c = new Client(config.DB_CONFIG);

      c.query('INSERT INTO users (name, email, password, company, division, role, access_level, telephone, address, state, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [ 
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
  })
  app.put('/users', (req, res) => {
    console.log("put /users")
  })

  app.delete('/users', (req, res) => {
    console.log("delete /users")
  })
}
