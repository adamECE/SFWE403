const mongoose = require('mongoose');

const transactionLogSchema = new mongoose.Schema({
    transactionType: {
        type: String,
        enum: ['Login', 'Logout', 'Purchase', 'Inventory Update'],
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    details: String, // Additional information or details about the transaction
    resultStatus: String, // "Success" or "Failure"
});

module.exports = mongoose.model('Logs', logSchema);