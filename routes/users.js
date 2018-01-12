// ./routes/users.js
var mongoose = require('mongoose');
var cors = require('cors');

const User = require('../models/User');

module.exports = (app) => {
  app.get('/users', (req, res) => {
      req.userModel.find({}).sort({'email': -1}).exec((err, users) => res.json(users))
  });
//   app.get('/login', (req, res) => {

//       res.send("zomg")
//   });
  app.options('/login', cors());
  app.post('/login', (req, res) => {
      //res.json(req.body);
    var password = req.body.user.password;
    try {
        var query = req.userModel.findOne({'email': req.body.user.email});
        query.select('email username password');
        query.exec((err, user) => {            
            if(err) {
                res.status(400).send(err);
            }
            if (user && password === user.password) {
                res.json(res.status(200).send("Success"));
            }
            else {
                res.status(400).send("No luck");
            }
        });
    }
    catch(err) {
        res.status(400).send("zomg");
    }
  });

  app.post('/users', (req, res) => {
      const newuser = new req.userModel(Object.assign({}, req.body, {created_at: Date.now()}));
      newuser.save((err, saveduser) => {
          res.json(saveduser)
      })
  })

  app.put('/users', (req, res) => {
    const idParam = req.webtaskContext.query.id;
    req.userModel.findOne({_id: idParam}, (err, userToUpdate) => {
        const updateduser = Object.assign(userToUpdate, req.body);
        updateduser.save((err, user) => res.json(user))
    })
  })

  app.delete('/users', (req, res) => {
    const idParam = req.webtaskContext.query.id;
    req.userModel.remove({_id: idParam}, (err, removeduser) => res.json(removeduser));
  })
}