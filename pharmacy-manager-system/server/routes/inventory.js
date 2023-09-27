const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const {
  protect,
  isManager,
  isStaff,
  isAccountActive,
} = require("../middleware/auth");

router.post(
  "/add-item",
  protect,
  isManager,
  isAccountActive,
  inventoryController.addItem
); // route to create inventory item

module.exports = router;
