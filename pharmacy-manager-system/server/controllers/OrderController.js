const asyncHandler = require("express-async-handler");
const Order = require("../models/order");
const { ORDER_STATUS } = require("../config/pharmacy0x2Const");
var dotenv = require("dotenv");
dotenv.config({ path: "../config/.env" });
const Inventory = require("../models/inventory");


//place a new inventory order
exports.placeOrder = asyncHandler(async(req, res) => {
    try {
        // Extract item details from the request body
        const { medicationID, quantity, supplier } = req.body;
        //check if all the required inputs are given
        if (!medicationID || !quantity || !supplier) {
            res.status(400).json({ error: "Please add all Fields" });
            return;
        }

        const inventoryItem = await Inventory.findById(medicationID);
        if (!inventoryItem) {
            // If the medicationID is not found in the Inventory
            res.status(404).json({ error: 'Medication not found in inventory' });
            return
        }
        // Create a new order 
        const newOrder = new Order({
            medicationID,
            quantity,
            supplier
        });

        // Save the new order to the database
        await newOrder.save();
        res.status(201).json("Your order has been placed");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'OOOps something went wrong!' });
    }
});

//return order list
exports.getAll = asyncHandler(async(req, res) => {
    try {
        const orderItems = await Order.find();
        res.json(orderItems);
    } catch (error) {

        console.error(error);
        res.status(500).json({ error: 'OOOps something went wrong!' });
    }
});

//update inventory order status
exports.updateOrderStatus = asyncHandler(async(req, res) => {
    try {
        // Extract item details from the request body
        const { orderID, status } = req.body;
        //check if all the required inputs are given
        if (!orderID || !status) {
            res.status(400).json({ error: "Please add all Fields" });
            return;
        }
        //check if given status is valid
        if (!Object.values(ORDER_STATUS).includes(status.toLowerCase())) {
            res.status(400).json({ error: "ivalid status value provided!" });
            return;
        }

        const orderItem = await Order.findById(orderID);
        if (!orderItem) {
            // If the orderID is not found in the Inventory
            res.status(404).json({ error: 'Medication not found in inventory' });
            return
        }

        //check the status, if recieved, updated the related inventory item quantity, and the order reception date
        if (status == ORDER_STATUS.RECEIVED && orderItem.status != ORDER_STATUS.RECEIVED) {
            orderItem.receptionDate = new Date(); //update the reception date
            const inventoryItem = await Inventory.findById(orderItem.medicationID); //find the related inventory item
            inventoryItem.quantityInStock += orderItem.quantity
            inventoryItem.updated_at = new Date();
            await inventoryItem.save()

        }
        orderItem.status = status.toLowerCase()
        await orderItem.save()
        res.status(201).json("Your order status has been updated");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'OOOps something went wrong!' });
    }
});