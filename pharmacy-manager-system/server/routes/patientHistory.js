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
router.put("/add-perscription", protect, isStaff, 
            isAccountActive, patientHistoryController.addPerscription); 
router.post("/get-patient-perscription-info", protect, isStaff, 
            isAccountActive,patientHistoryController.getPerscription); 

module.exports = router;