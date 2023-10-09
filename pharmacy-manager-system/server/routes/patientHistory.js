const express = require("express");
const router = express.Router();
const patientHistoryController = require("../controllers/patientHistoryController");

const {
    protect,
    isManager,
    isStaff,
    isAccountActive,
} = require("../middleware/auth");

// route to add to activity log
router.put("/add-perscription", protect, isManager || isStaff, 
            isAccountActive, patientHistoryController.addPerscription); 

module.exports = router;