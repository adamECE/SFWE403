const express = require("express");
const router = express.Router();
const patientHistoryController = require("../controllers/patientHistoryController");
const prescriptionController = require("../controllers/prescriptionController");
const { logPrescription } = require("../middleware/log");

const {
  protect,
  isStaff,
  isPharmacist,
  isAccountActive,
} = require("../middleware/auth");

// route to add to activity log
router.put(
  "/add-prescription",
  protect,
  isStaff,
  isAccountActive,
  patientHistoryController.addPrescription
);

router.post(
  "/get-patient-prescription-info",
  protect,
  isAccountActive,
  isStaff,
  patientHistoryController.getPrescription
);

router.put(
  "/fill-prescription",
  protect,
  isAccountActive,
  isPharmacist,
  prescriptionController.fillPrescription,
  logPrescription
); // route to get list of inventory

router.get(
  "/prescription-logs",
  protect,
  isAccountActive,
  isStaff,
  patientHistoryController.getPrescriptionLogs
);

module.exports = router;
