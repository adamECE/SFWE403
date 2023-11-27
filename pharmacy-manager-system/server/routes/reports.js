const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

const {
  protect,
  isManager,
  isAccountActive,
} = require('../middleware/auth');

// route to add to activity log
router.post(
  '/generateFinance',
  protect,
  isManager,
  isAccountActive,
  reportController.generateFinanceReport
);

module.exports = router;
