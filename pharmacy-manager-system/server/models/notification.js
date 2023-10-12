const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
    medID: { type: String, required: true },
    medName: { type: String, required: true },
    notiType: {
        type: String,
        enum: ["expSoon", "quantLow"],
        required: true,
    },
    totalQuant: { type: Number, default: -1},
    batchID: { type: String, default: "N/A" },
    expirationDate: {type: String, default: "N/A"},
    message: {type: String, default: "N/A"},
    created_at: { type: Date, default: Date.now }
});
module.exports = mongoose.model('notification', notificationSchema);