const asyncHandler = require("express-async-handler");
const Order = require("../models/order");
const User = require("../models/user");
const { ROLES } = require("../config/pharmacy0x2Const");
var dotenv = require("dotenv");
dotenv.config({ path: "../config/.env" });
const Inventory = require("../models/inventory");
const Purchase = require("../models/purchase");
const { jar } = require("request");

exports.processPurchase = asyncHandler(async (req, res, next) => {
  try {
    // Extract item details from the request body
    const { soldTo, PrescriptionItems, OverTheCounterItems, totalAmount } =
      req.body;
    //check if all the required inputs are given
    console.log(req.body);
    // if (soldTo || PrescriptionItems || OverTheCounterItems || totalAmount) {
    //   res.status(400).json({error: 'Please add all Fields'});
    //   console.log({error: 'Please add all Fields'});
    //   return;
    // }

    const userData = await User.findOne({ email: soldTo }); //attempt to find user
    if (!userData) {
      //check if user was found
      res.status(404).json({ error: "Patient not found in database" });
      return;
    }
    if (userData.role != ROLES.PATIENT) {
      //check if user is not a patient
      res.status(401).json({ error: "User is not a patient" });
      return;
    }
    //get the inventory over the counter inventory items and update the quantities
    //get the prescriptions and set pickedUp to true
    //save data on purchase collection
    //return the id of the added purchase
    let OverTheCounterItemsID = [];
    for (let v in OverTheCounterItems) {
      OverTheCounterItemsID.push(OverTheCounterItems[v].itemID);
    }

    const inventoryItems = await Inventory.find({
      _id: { $in: OverTheCounterItemsID },
    });
    for (let a = 0; a < OverTheCounterItems.length; a++) {
      for (let b = 0; b < inventoryItems.length; b++) {
        if (inventoryItems[b]._id == OverTheCounterItems[a].itemID) {
          for (let c = 0; c < inventoryItems[b].batches.length; c++) {
            if (
              inventoryItems[b].batches[c]._id == OverTheCounterItems[a].barcode
            ) {
              inventoryItems[b].batches[c].quantity -=
                OverTheCounterItems[a].quantity;
              inventoryItems[b].quantityInStock -=
                OverTheCounterItems[a].quantity;
              inventoryItems[b].batches[c].updated_at = new Date();
              inventoryItems[b].updated_at = new Date();
              await inventoryItems[b].save();
            }
          }
        }
      }
    }

    for (let i = 0; i < PrescriptionItems.length; i++) {
      for (let j = 0; j < userData.prescriptions.length; j++) {
        if (
          PrescriptionItems[i].prescriptionID == userData.prescriptions[j]._id
        ) {
          for (
            let k = 0;
            k < userData.prescriptions[j].filledInfo.length;
            k++
          ) {
            if (
              userData.prescriptions[j].filledInfo[k]._id ==
              PrescriptionItems[i].filledInfoID
            ) {
              userData.prescriptions[j].filledInfo[
                k
              ].pickedUpInfo.status = true;
              userData.prescriptions[j].filledInfo[k].pickedUpInfo.date =
                new Date();
            }
          }
        }
      }
    }
    await userData.save();

    // Create a new Inventory item
    const newPurchase = new Purchase({
      soldTo,
      soldBy: req.user.email,
      PrescriptionItems,
      OverTheCounterItems,
      totalAmount,
    });

    const pchID = await newPurchase.save();

    //check if prescription still valid for fill
    res.status(200).json({ message: pchID._id });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OOOps something went wrong!" });
  }
});

exports.getPurchase = asyncHandler(async (req, res, next) => {
  try {
    // Extract item details from the request body
    const { receiptID } = req.params;
    //check if all the required inputs are given
    if (!receiptID) {
      res.status(400).json({ error: "Please add all Fields" });

      return;
    }

    const purchaseData = await Purchase.findById({ _id: receiptID }); //attempt to find user
    if (!purchaseData) {
      //check if user was found
      res.status(404).json({ error: "Patient not found in database" });
      return;
    }
    //check if prescription still valid for fill
    res.status(200).json({ purchaseData });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OOOps something went wrong!" });
  }
});
exports.processPayment = asyncHandler(async (req, res, next) => {
  try {
    const { paymentMethod, purchaseID, cardInfo, customerSignature } = req.body;
    console.log(cardInfo);
    if (!paymentMethod | !purchaseID) {
      res.status(400).json({ error: "Please add all Fields" });

      return;
    }
    const purchaseData = await Purchase.findById({ _id: purchaseID }); //attempt to find purchase data
    if (!purchaseData) {
      res.status(404).json({ error: "purchase not found in database" });
      return;
    }

    if (purchaseData.status == "paid") {
      res.status(403).json({ error: " Payment has been processed already!" });
      return;
    }
    if (purchaseData.PrescriptionItems.length > 0) {
      if (!customerSignature) {
        res.status(400).json({
          error: "Signature is required for prescription medications ",
        });

        return;
      } else {
        purchaseData.customerSignature = customerSignature;
      }
    }
    purchaseData.paymentMethod = paymentMethod;
    purchaseData.status = "paid";
    purchaseData.timestamp = new Date();
    if (paymentMethod === "card") {
      purchaseData.card = cardInfo;
    }

    const pchID = await purchaseData.save();
    //res.status(200).json({ message: pchID._id });
    res.status(200).json({ message: "Payment Completed Successfully!" });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OOOps something went wrong!" });
  }
});
