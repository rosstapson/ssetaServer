// ./routes/users.js
var mongoose = require('mongoose');

const User = require('../models/User');

module.exports = (app) => {
  app.get('/users', (req, res) => {
      req.userModel.find({}).sort({'email': -1}).exec((err, users) => res.json(users))
  });

  app.post('/login', (req, res) => {

    req.userModel.findOne({'email': req.body.user.email}, (err, user) => {
        if (err) {
            res.send("No such user");
            return;
        }
        if (!req.webtaskContext.query.user.password || req.webtaskContext.query.user.password!== user.password) {
            res.send("Incorrect password");
            return;
        }
        res.json(user);
    })
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