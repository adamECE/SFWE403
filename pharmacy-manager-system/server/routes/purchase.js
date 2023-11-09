const express = require('express');
const router = express.Router();
const patientHistoryController = require('../controllers/patientHistoryController');
const purchaseController = require('../controllers/purchaseController');
const {logPrescription} = require('../middleware/log');

const {
  protect,
  isStaff,
  isPharmacist,
  isAccountActive,
} = require('../middleware/auth');

// route to add to activity log
router.post(
  '/checkout',
  protect,
  isStaff,
  isAccountActive,
  purchaseController.processPurchase
);

// route to add to activity log
router.get(
  '/checkout-info/:receiptID',
  protect,
  isStaff,
  isAccountActive,
  purchaseController.getPurchase
);

module.exports = router;
