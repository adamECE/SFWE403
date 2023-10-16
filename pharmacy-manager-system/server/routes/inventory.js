const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const orderController = require("../controllers/OrderController");
const {
    expDateCheck,
    lowQuantCheck,
    aboveQuantThresholdCheck,
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
  orderController.updateOrderStatus
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
  inventoryController.removeItem
); // route to delete inventory item (ideally an expired item)
router.get("/get-notis", 
    aboveQuantThresholdCheck,
    inventoryController.getNotifications);

router.post(
  "/get-item",
  protect,
  isAccountActive,
  isStaff,
  inventoryController.getItem
);


module.exports = router;
