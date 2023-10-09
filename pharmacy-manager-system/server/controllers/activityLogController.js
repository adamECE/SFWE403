const asyncHandler = require("express-async-handler");
const ActivityLog = require("../models/activityLog");
const { ROLES } = require("../config/pharmacy0x2Const");
var dotenv = require("dotenv");
dotenv.config({ path: "../config/.env" });

exports.addToLog = asyncHandler(async(req, res) => {
    try { 
        const {activityType, activityText, created_at} = req.body; 

        if (!activityType || !activityText || !created_at) {
            res.status(400).json({ error: "Please add all Fields" });
            return;
        }

        // Create a new activity log item
        const newActivityLogItem = new ActivityLog({
            activityType,
            activityText,
            created_at
        })

        // Save the new item to the database
        await newActivityLogItem.save();

        // Return the newly created item as the response
        res.status(201).json("new inventory item added");

    } catch {
        console.error(error);
        res.status(500).json({ error: 'OOOps something went wrong!' });
    }
})