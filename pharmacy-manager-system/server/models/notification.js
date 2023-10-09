const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
    medID: { type: String, required: true },
    medName: { type: String, required: true },
    batchID: { type: String, required: true },
    expirationDate: {type: String, required: true},
    message: {type: String},
    created_at: { type: Date, default: Date.now }
});
module.exports = mongoose.model('notification', notificationSchema);