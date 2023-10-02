const asyncHandler = require("express-async-handler");
const Inventory = require("../models/inventory");
const { ROLES } = require("../config/pharmacy0x2Const");
var dotenv = require("dotenv");
dotenv.config({ path: "../config/.env" });

//create and save new inventory item
exports.addItem = asyncHandler(async(req, res) => {
    try {
        // Extract item details from the request body
        const {
            name,
            description,
            category,
            price,
            quantityInStock,
            manufacturer,
            expirationDate,
            barcode,
            location,
        } = req.body;
        //check if all the required inputs are given
        if (!name ||
            !description ||
            !category ||
            !price ||
            !quantityInStock ||
            !manufacturer ||
            !expirationDate ||
            !barcode ||
            !location
        ) {
            res.status(400).json({ error: "Please add all Fields" });
            return;
        }
        // Create a new Inventory item
        const newItem = new Inventory({
            name,
            description,
            category,
            price,
            quantityInStock,
            manufacturer,
            expirationDate,
            barcode,
            location,
        });

        // Save the new item to the database
        await newItem.save();

        // Return the newly created item as the response
        res.status(201).json("new inventory item added");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'OOOps something went wrong!' });
    }
});


//return inventory list
exports.getAll = asyncHandler(async(req, res) => {

    try {

        const inventoryItems = await Inventory.find();
        res.json(inventoryItems);
    } catch (error) {

        console.error(error);
        res.status(500).json({ error: 'OOOps something went wrong!' });
    }
});

exports.removeItem = asyncHandler(async(req, res) => {
    try {
        // Extract item details from the request body
        const { medicationID } = req.body;
        console.log("ID: ", medicationID); 
        //check if all the required inputs are given
        if (!medicationID) {
            res.status(400).json({ error: "Please add all Fields" });
            return;
        }

        const inventoryItem = await Inventory.findById(medicationID) //attempt to find the item on the db
        if (!inventoryItem) {
            // If the medicationID is not found in the Inventory
            res.status(404).json({ error: 'Medication not found in inventory' });
            return
        }
        if (inventoryItem.expirationDate <= new Date()) {
            await inventoryItem.deleteOne({ _id: medicationID })
            res.status(200).json({ error: 'Medication removed from inventory' });
            return
        } else
            res.status(401).json("this item is not expired");
    } catch (error) {
        const { medicationID } = req.body;
        console.log("ID: ", medicationID); 
        console.error(error);
        res.status(500).json({ error: 'OOOps something went wrong!' });
    }
});