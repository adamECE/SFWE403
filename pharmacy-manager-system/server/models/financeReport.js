const mongoose = require('mongoose')
const purchaseSchema = require('./purchase')

const financeReportSchema = new mongoose.Schema({
    startDate: {
        type: String,
        required: true,
    },
    endDate: {
        type: String,
        required: true,
    },
    numSales: {
        type: String,
        required: true,
    },
    totalRevenue: {
        type: String,
        required: true,
    },
    avgCost: {
        type: String,
        required: true,
    },
    purchases: [purchaseSchema],

});

module.exports = financeReportSchema;