const asyncHandler = require('express-async-handler')
const ActivityLog = require('../models/activityLog')
var dotenv = require('dotenv')
dotenv.config({ path: '../config/.env' })

const logger = asyncHandler(async(req, res, next) => {
    res.on("finish", function() {
        console.log('Log: ',req.method, decodeURI(req.url), res.statusCode, res.statusMessage);
        const httpMethod = req.method;
        const url = decodeURI(req.url);
        const statusCode = res.statusCode; 
        const statusMessage = res.statusMessage; 
        const created_at = new Date(); 

        // Create a new activity log item
        const newActivityLogItem = new ActivityLog({
            httpMethod,
            url,
            statusCode,
            statusMessage,
            created_at
        })

        // Save the new item to the database
        newActivityLogItem.save();
      });
    next();
})

module.exports = logger;