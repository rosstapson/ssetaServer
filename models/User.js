const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    company: String,
    telephone: String,
    division: String,
    role: String,
    address: String,
    state: String,
    country: String,    
    created_at: Date,    
    id: mongoose.Schema.ObjectId
})