const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now,
    },
    soldBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [{
        name: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        isPrescription: {
            type: Boolean,
            default: false,
        },
    }],
    totalAmount: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['cash', 'credit card', 'debit card'],
    },
    receiptNumber: {
        type: Number,
        unique: true,
        required: true,
    },
    customerSignature: {
        type: String,
    },
});

module.exports = mongoose.model('Purchase', purchaseSchema);