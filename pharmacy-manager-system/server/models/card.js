const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    cardNum: {
        type: String,
        required: true,
    },
    zipCode: {
        type: String,
        required: true,
    },
    secCode: {
        type: String,
        required: true,
    },
    expDate: {
        type: Date,
        required: true,
    },
});

module.exports = cardSchema;