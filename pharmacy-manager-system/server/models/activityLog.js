const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    route: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});


module.exports = mongoose.model('ActivityLog', activityLogSchema);