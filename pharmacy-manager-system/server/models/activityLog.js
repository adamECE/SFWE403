const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    activityType: { type: String, required: true },
    activityText: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
});


module.exports = mongoose.model('ActivityLog', activityLogSchema);