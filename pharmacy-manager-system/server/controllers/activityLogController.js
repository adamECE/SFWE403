const asyncHandler = require("express-async-handler");
const activityLog = require("../models/activityLog");
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

        const newActivityLogItem = new activityLog({
            activityType,
            activityText,
            created_at
        })


    } catch {

    }
})