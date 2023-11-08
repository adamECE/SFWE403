const asyncHandler = require('express-async-handler');
const Order = require('../models/order');
const User = require('../models/user');
const {ROLES} = require('../config/pharmacy0x2Const');
var dotenv = require('dotenv');
dotenv.config({path: '../config/.env'});
const Inventory = require('../models/inventory');
const Purchase = require('../models/purchase');
const {jar} = require('request');

exports.processPurchase = asyncHandler(async (req, res, next) => {
  try {
    // Extract item details from the request body
    const {soldTo, PrescriptionItems, OverTheCounterItems, totalAmount} =
      req.body;
    //check if all the required inputs are given
    console.log(req.body);
    // if (soldTo || PrescriptionItems || OverTheCounterItems || totalAmount) {
    //   res.status(400).json({error: 'Please add all Fields'});
    //   console.log({error: 'Please add all Fields'});
    //   return;
    // }

    const userData = await User.findOne({email: soldTo}); //attempt to find user
    if (!userData) {
      //check if user was found
      res.status(404).json({error: 'Patient not found in database'});
      return;
    }
    if (userData.role != ROLES.PATIENT) {
      //check if user is not a patient
      res.status(401).json({error: 'User is not a patient'});
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
      _id: {$in: OverTheCounterItemsID},
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
    res.status(200).json({message: pchID._id});
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'OOOps something went wrong!'});
  }
});
