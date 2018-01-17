const mongoose = require('mongoose');

module.exports = new mongoose.Schema({    
    title: {
        type: 'String',
        required: true
    },
    createdBy: {
        type: 'String',
        required: true
    }, 
    forCompanyId: String,
    forCourseId: String,      
    createdAt: {
        type: 'Date',
        default: Date.now
    },
    entries: [{
        id: String,
        question: String,
        answerType: String
    }],
    id: mongoose.Schema.ObjectId
})