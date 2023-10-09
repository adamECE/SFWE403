const express = require("express");
const router = express.Router();
const activityLogController = require("../controllers/inventoryController");

const {
    protect,
    isManager,
    isStaff,
    isAccountActive,
} = require("../middleware/auth");

// route to add to activity log
router.post("/", protect, isManager || isStaff, 
            isAccountActive, activityLogController.addToLog); 

module.exports = router;