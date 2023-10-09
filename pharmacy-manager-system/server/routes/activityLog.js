const express = require("express");
const router = express.Router();
const activityLogController = require("../controllers/activityLogController");

const {
    protect,
    isManager,
    isStaff,
    isAccountActive,
} = require("../middleware/auth");

// route to add to activity log
// router.post("/add-log", protect, isManager || isStaff, 
//            isAccountActive, activityLogController.addToLog); 
router.post("/add-log", activityLogController.addToLog); 

module.exports = router;