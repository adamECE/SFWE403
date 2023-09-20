const mongoose = require('mongoose')

const prescriptionSchema = new mongoose.Schema({
    doctorName: {
        type: String,
        required: true,
    },
    medicationName: {
        type: String,
        required: true,
    },
    dosage: {
        type: String,
        required: true,
    },
    refillPolicy: {
        refills: {
            type: Number,
            default: 0,
            required: true,
        },
        allowRefill: {
            type: Boolean,
            default: false,
            required: true,
        },
        dueDate: {
            type: Date,
            default: null,
        },
    },
    filledDate: [{
        type: Date,
        default: null,
    }],
    isValid: {
        type: Boolean,
        default: true,
        required: true,
    },
});

module.exports = prescriptionSchema;