const mongoose = require('mongoose')

const formSchema = new mongoose.Schema({
    token: {
        type: String,
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    status: {
        type: String
    },
    existence: {
        type: Number
    },
    createdBy: {
        type: String
    },  
    sessionToken: {
        type: String
    }
    
}, {
    timestamps : true
});
module.exports = mongoose.model('Form', formSchema) 