const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const orderController = require("../controllers/OrderController");
const { logPrescription, logInventoryUpdate } = require("../middleware/log");

const {
  expDateCheck,
  lowQuantCheck,
  aboveQuantThresholdCheck,
  checkForBatchExist,
} = require("../middleware/notifications");
const {
  protect,
  isManager,
  isStaff,
  isPharmacist,
  isAccountActive,
} = require("../middleware/auth");

router.post(
  "/add-item",
  protect,
  isManager,
  isAccountActive,
  inventoryController.addItem
); // route to create inventory item
router.put(
  "/add-batch",
  protect,
  isManager,
  isAccountActive,
  inventoryController.addBatch
); // route to create inventory item

router.post(
  "/place-order",
  protect,
  isManager,
  isAccountActive,
  orderController.placeOrder
); // route to place inventory order
router.put(
  "/update-order",
  protect,
  isManager,
  isAccountActive,
  orderController.updateOrderStatus,
  logInventoryUpdate
); // route to update inventory order

router.get(
  "/",
  protect,
  isAccountActive,
  expDateCheck,
  lowQuantCheck,
  inventoryController.getAll
); // route to get list of inventory

router.get(
  "/over-the-counter",
  protect,
  isAccountActive,
  expDateCheck,
  lowQuantCheck,
  inventoryController.getOverTheCounter
); // route to get list of inventory

router.get(
  "/order-list",
  protect,
  isAccountActive,
  isManager,
  orderController.getAll
); //  route to get list of inventory orders
router.delete(
  "/remove-item",
  protect,
  lowQuantCheck,
  isAccountActive,
  isManager,
  inventoryController.removeItem,
  logInventoryUpdate
); // route to delete inventory item (ideally an expired item)
router.get(
  "/get-notis",
  aboveQuantThresholdCheck,
  checkForBatchExist,
  inventoryController.getNotifications
);
router.get(
  "/logs",
  protect,
  isAccountActive,
  isManager,
  inventoryController.getInventoryLogs
);
router.post(
  "/get-item",
  protect,
  isAccountActive,
  isStaff,
  inventoryController.getItem
);

module.exports = router;
