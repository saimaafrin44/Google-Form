const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema({
    token: {
        type: String,
    },
    userToken: {
        type: String
    },
    ipAddress: {
        type: String
    },
    status: {
        type: String
    },
    sessionEndedAt: {
        type: String
    }
    
    
}, {
    timestamps : true
});
module.exports = mongoose.model('Session', sessionSchema) 