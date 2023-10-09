const mongoose = require('mongoose')

const prescriptionSchema = new mongoose.Schema({
    doctorName: {
        type: String,
        required: true,
    },
    medicationID: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    dosage: {
        type: String,
        required: true,
    },
    deliveredBy: {
        type: String,
        enum: ["patient", "doctor's office"],
        default: "patient"
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