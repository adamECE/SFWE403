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
router.put("/add-prescription", protect, isStaff, isAccountActive, patientHistoryController.addPrescription);
router.post("/get-patient-prescription-info", protect, isAccountActive, isStaff, patientHistoryController.getPrescription);

module.exports = router;