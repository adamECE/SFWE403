const mongoose = require('mongoose')
const addressSchema = require('./address'); // Import the address schema
const prescriptionSchema = require('./prescription'); // Import the prescription schema


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['pharmacy manager', 'pharmacist', 'pharmacy technician', 'cashier', 'patient'],
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    address: {
        type: addressSchema, // Use the addressSchema as the type
        required: true,
    },
    phoneNumber: { type: String },
    insuranceInformation: {
        provider: { type: String, default: "none" },
        policyNumber: { type: String, default: "none" },
    },
    isLocked: {
        type: Boolean,
        default: false,

    },
    loginAttempts: {
        type: Number,
        default: 0,
    },
    lastLogin: {
        type: Date,
        default: null,
    },
    prescriptions: [prescriptionSchema],
    isActive: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);