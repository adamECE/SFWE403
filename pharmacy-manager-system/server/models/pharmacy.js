const mongoose = require('mongoose')
const addressSchema = require('./address'); // Import the address schema

const workingHoursSchema = new mongoose.Schema({
    day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true,
        unique: true,
    },
    openingTime: { type: String, required: true },
    closingTime: { type: String, required: true },
});

const pharmacySchema = new mongoose.Schema({
    name: { type: String, required: true },
    website: { type: String, required: true },
    address: addressSchema, // Embed the address schema
    owner: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    workingHours: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            required: true,
            unique: true,
        },
        openingTime: { type: String, required: true },
        closingTime: { type: String, required: true },
    }], // Array of working hours for each day of the week
});

module.exports = mongoose.model('Pharmacy', pharmacySchema);