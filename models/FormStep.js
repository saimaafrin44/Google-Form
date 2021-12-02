const mongoose = require('mongoose')

const formStepSchema = new mongoose.Schema({
    token: {
        type: String,
    },
    formToken: {
        type: String,
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    previousStepToken
    : {
        type: String
    },
    nextStepToken: {
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
module.exports = mongoose.model('FormStep', formStepSchema) 