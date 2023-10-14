const asyncHandler = require("express-async-handler");
const Inventory = require("../models/inventory");
const notification = require("../models/notification");
const batchSchema = require("../models/inventory");
const { ROLES } = require("../config/pharmacy0x2Const");
var dotenv = require("dotenv");
dotenv.config({ path: "../config/.env" });

//create and save new inventory item
exports.addItem = asyncHandler(async (req, res) => {
  try {
    // Extract item details from the request body
    const { name, description, category, price, manufacturer, location } =
      req.body;
    //check if all the required inputs are given
    if (
      !name ||
      !description ||
      !category ||
      !price ||
      !manufacturer ||
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
      manufacturer,
      location,
    });

    // Save the new item to the database
    await newItem.save();

    // Return the newly created item as the response

    res.status(201).json({ message: "new inventory item added" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OOOps something went wrong!" });
  }
});

//create and save new inventory item
exports.addBatch = asyncHandler(async (req, res) => {
  try {
    // Extract item details from the request body
    const { quantity, expirationDate, medicationID } = req.body;
    //check if all the required inputs are given
    if (!quantity || !expirationDate || !medicationID) {
      res.status(400).json({ error: "Please add all Fields" });
      return;
    }

    const inventoryItem = await Inventory.findById(medicationID);

    if (!inventoryItem) {
      return res.status(404).json({ error: "Inventory item not found" });
    }

    // Create a new Inventory item
    const newBatch = {
      quantity,
      expirationDate: new Date(expirationDate),
    };

    // Add the batch to the inventory item's batches array
    inventoryItem.batches.push(newBatch);
    inventoryItem.quantityInStock += newBatch.quantity;

    // Save the updated inventory item
    await inventoryItem.save();

    return res.status(201).json({ message: "Batch added to inventory item" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OOOps something went wrong!" });
  }
});

//return inventory list
exports.getAll = asyncHandler(async (req, res) => {
  try {
    const inventoryItems = await Inventory.find();
    // Map the inventory items to remane the _id as barcode in batches array
    const updatedInventoryItems = inventoryItems.map((inventoryItem) => {
      // Map the batches array and replace _id with barcode
      const modifiedBatches = inventoryItem.batches.map((batch) => ({
        quantity: batch.quantity,
        expirationDate: batch.expirationDate,
        created_at: batch.created_at,
        updated_at: batch.updated_at,
        barcode: batch._id, // Replace _id with barcode
      }));

      // keep other inventory item properties and replace batches with modifiedBatches
      return {
        ...inventoryItem._doc,
        batches: modifiedBatches,
      };
    });

    res.json(updatedInventoryItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OOOps something went wrong!" });
  }
});

exports.removeItem = asyncHandler(async (req, res) => {
  try {
    // Extract item details from the request body
    const { medicationID, barcode } = req.body;
    //check if all the required inputs are given
    if (!medicationID || !barcode) {
      res.status(400).json({ error: "Please add all Fields" });
      return;
    }

    const inventoryItem = await Inventory.findById(medicationID); //attempt to find the item on the db
    if (!inventoryItem) {
      // If the medicationID is not found in the Inventory
      res.status(404).json({ error: "Medication not found in inventory" });
      return;
    }
    // Find the index of the batch matching batchId
    const batchIndex = inventoryItem.batches.findIndex(
      (batch) => batch._id == barcode
    );

    if (batchIndex === -1) {
      res.status(404).json({ message: "Batch not found in inventory" });
      return;
    }

    // Check the expiration date of the batch
    if (inventoryItem.batches[batchIndex].expirationDate <= new Date()) {
      inventoryItem.quantityInStock -=
        inventoryItem.batches[batchIndex].quantity;
      inventoryItem.batches.splice(batchIndex, 1); // Remove the batch

      await inventoryItem.save(); // Save the updated inventory item
      res.status(200).json({ message: "expired batch removed from inventory" });
    } else res.status(401).json({ message: "this item is not expired" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OOOps something went wrong!" });
  }
});

exports.addNotification = asyncHandler(async (req, res) => {
  try {
    const { medID, medName, batchID, expirationDate } = req.body;
    const message =
      medName +
      "(" +
      medID +
      "), Batch " +
      batchID +
      " erxpires on " +
      expirationDate;
    const findNoti = await notification.findOne({ batchID });
    if (findNoti) {
      res.status(400).json({ error: "User Already exist" });
    } else {
      const newNotification = notification({
        medID,
        medName,
        batchID,
        expirationDate,
        message,
      });

      // Save the new item to the database
      await newNotification.save();

      // Return the newly created item as the response
      res.status(201).json("new notification added");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OOOps something went wrong!" });
  }
});

exports.getNotifications = asyncHandler(async (req, res) => {
  try {
    const notificationList = await notification.find();
    res.json(notificationList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OOOps something went wrong!" });
  }
});

exports.getItem = asyncHandler(async (req, res) => {
  try {
    // Extract item details from the request body
    const { medicationID } = req.body;
    //check if all the required inputs are given
    if (!medicationID) {
      res.status(400).json({ error: "Please add Medication ID" });
      return;
    }

    const inventoryItems = await Inventory.find({ _id: medicationID }); //attempt to find the item on the db
    const updatedInventoryItems = inventoryItems.map((inventoryItem) => {
      // Map the batches array and replace _id with barcode
      const modifiedBatches = inventoryItem.batches.map((batch) => ({
        quantity: batch.quantity,
        expirationDate: batch.expirationDate,
        created_at: batch.created_at,
        updated_at: batch.updated_at,
        barcode: batch._id, // Replace _id with barcode
      }));

      // keep other inventory item properties and replace batches with modifiedBatches
      return {
        ...inventoryItem._doc,
        batches: modifiedBatches,
      };
    });
    if (!inventoryItems) {
      // If the medicationName is not found in the Inventory
      res.status(404).json({ error: "Medication not found in inventory" });
      return;
    } else {

      res.status(200).json(updatedInventoryItems);

    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OOOps something went wrong!" });
  }
});
