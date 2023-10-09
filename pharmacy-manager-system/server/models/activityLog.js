const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    httpMethod: { type: String, required: true },
    url: { type: String, required: true },
    statusCode: { type: String, required: true },
    statusMessage: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});


module.exports = mongoose.model('ActivityLog', activityLogSchema);