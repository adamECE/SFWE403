const express = require("express");
const router = express.Router();
const purchaseController = require("../controllers/purchaseController");
const { logPurchase } = require("../middleware/log");

const {
  protect,
  isStaff,
  isManager,
  isAccountActive,
} = require("../middleware/auth");

// route to add to activity log
router.post(
  "/checkout",
  protect,
  isStaff,
  isAccountActive,
  purchaseController.processPurchase,
  logPurchase
);
router.post(
  "/pay",
  protect,
  isStaff,
  isAccountActive,
  purchaseController.processPayment
);

router.get(
  "/checkout-info/:receiptID",
  protect,
  isStaff,
  isAccountActive,
  purchaseController.getPurchase
);

router.get(
  "/logs",
  protect,
  isManager,
  isAccountActive,
  purchaseController.getPurchaseLogs
);

module.exports = router;
