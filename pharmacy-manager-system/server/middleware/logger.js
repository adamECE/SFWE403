const asyncHandler = require('express-async-handler')
const ActivityLog = require('../models/activityLog')
var dotenv = require('dotenv')
dotenv.config({ path: '../config/.env' })

exports.logger = asyncHandler(async(req, res, next) => {
    try {
        const {
            route, 
            _startTime,
        } = req; 

        console.log(route);
        console.log(_startTime);

    } catch {
        console.error(error);
        res.status(500).json({ error: 'Logging error!' });
    }
})