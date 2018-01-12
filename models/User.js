const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    username: String,
    email: String,
    password: Date,
    id: mongoose.Schema.ObjectId
})