const mongoose = require('mongoose')

const itemOptionSchema = new mongoose.Schema({
    token: {
        type: String,
    },
    formToken: {
        type: String,
    },
    stepToken: {
        type: String,
    },
    itemToken: {
        type: String,
    },
    itemType: {
        type: String,
    },
    title: {
        type: String
    },
    titleType: {
        type: String
    },

    // common fields
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
module.exports = mongoose.model('ItemOption', itemOptionSchema)