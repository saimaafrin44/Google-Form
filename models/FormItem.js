const mongoose = require('mongoose');


const formItemSchema = new mongoose.Schema({
    token: {
        type: String,
    },
    formToken: {
        type: String,
    },
    stepToken: {
        type: String,
    },
    title: {
        type: String
    },
    image: {
        type: String
    },
    inputType: {
        type: String
    },
    required: {
        type: Number
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
module.exports = mongoose.model('FormItem', formItemSchema) 