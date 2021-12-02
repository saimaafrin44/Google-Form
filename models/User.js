const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    token: {
        type: String,
    },
    name: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    },  
    
}, {
    timestamps : true
});
module.exports = mongoose.model('User', userSchema) 