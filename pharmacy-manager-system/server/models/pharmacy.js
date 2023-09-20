const mongoose = require('mongoose')
const addressSchema = require('./addressSchema'); // Import the address schema

const pharmacySchema = new mongoose.Schema({
    name: { type: String, required: true },
    website: { type: String },
    address: addressSchema, // Embed the address schema
    owner: { type: String },
    phoneNumber: { type: String },
    workingHours: { type: String },
});

module.exports = mongoose.model('Pharmacy', pharmacySchema);