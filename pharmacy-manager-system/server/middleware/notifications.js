//this file contains the middleware functions to protect the routes 
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const notification = require('../models/notification')
const Inventory = require('../models/inventory')
const batchSchema = require("../models/inventory");
var dotenv = require('dotenv')
dotenv.config({ path: '../config/.env' })
const { ROLES } = require('../config/pharmacy0x2Const')

exports.lowQuantCheck = asyncHandler(async(req, res, next) => {
    try {
        const inventoryItems = await Inventory.find();
        for ( let i = 0; i < inventoryItems.length; i++ ){
            if (inventoryItems[i].quantityInStock <= 120) {
                medID          = inventoryItems[i]._id;
                medName        = inventoryItems[i].name;
                totalQuant     = inventoryItems[i].quantityInStock;

                message = JSON.stringify(medName + "(" + medID + "), has a quantity of less than 120 left in the inventory");
                const findNoti = await notification.findOne({ medID: medID, notiType: "quantLow" });
                if (findNoti) {
                    console.log("notification already exists")
                    continue;
                }
                const newNotification = notification({
                    medID: medID,
                    medName: medName,
                    totalQuant: totalQuant,
                    message: message,
                    notiType: "quantLow"
                });
        
                // Save the new notification to the database
                await newNotification.save();
            }
        }
        next()

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'OOOps something went wrong!' });
    }
})

exports.checkForBatchExist = asyncHandler(async(req, res, next) => {
    try {
        const notifications = await notification.find();
        for ( let i = 0; i < notifications.length; i++ ){
            if (notifications[i].notiType === "expSoon"){
            const findItem = await Inventory.findOne({ _id: notifications[i].medID});
            console.log("1")
            if (findItem) {
                const batchIndex = findItem.batches.findIndex((batch) => batch._id == notifications[i].batchID)
                console.log("2")
                if (batchIndex == -1) {
                    console.log("3")
                    await notification.deleteOne({batchID: notifications[i].batchID, notiType: "expSoon"});
                }
            }
        }
        }
        next()
    } catch (error) {

        console.error(error);
        res.status(500).json({ error: 'OOOps something went wrong!' });
    }
})
exports.aboveQuantThresholdCheck = asyncHandler(async(req, res, next) => {
    try {
        const inventoryItems = await Inventory.find();
        for ( let i = 0; i < inventoryItems.length; i++ ){
            const findNoti = await notification.findOne({ batchID: inventoryItems[i]._id, notiType: "expSoon" });
            if (findNoti) {
                if (inventoryItems[i].quantityInStock <= 120) {
                    console.log("inventory still below 120")
                    continue;
                }
                await notification.deleteOne({medID: inventoryItems[i]._id, notiType: "quantLow"});
            }
        }
        next()
    } catch (error) {

        console.error(error);
        res.status(500).json({ error: 'OOOps something went wrong!' });
    }
})

exports.expDateCheck = asyncHandler(async(req, res, next) => {
    try {
        let dt = new Date();
        dt.setDate(dt.getDate() + 30)

        const inventoryItems = await Inventory.find();
        for ( let i = 0; i < inventoryItems.length; i++ ){
            for ( let j = 0; j < inventoryItems[i].batches.length; j++){
                if (inventoryItems[i].batches[j].expirationDate <= dt) {
                    medID          = inventoryItems[i]._id;
                    medName        = inventoryItems[i].name;
                    batchID        = inventoryItems[i].batches[j]._id;
                    expirationDate = inventoryItems[i].batches[j].expirationDate;

                    message = JSON.stringify(medName + "(" + medID + "), Batch " + batchID + " expires on " + expirationDate);
                    const findNoti = await notification.findOne({ batchID })
                    if (findNoti) {
                        console.log("notification already exists")
                        continue;
            
                    } else {
                        const newNotification = notification({
                            medID: medID,
                            medName: medName,
                            batchID: batchID,
                            expirationDate: expirationDate,
                            message: message,
                            notiType: "expSoon",
                        });
            
                        // Save the new item to the database
                        await newNotification.save();
                    }
                }
            }
        }
        //res.status(200).json({ message: "Notifications Generated" });
        next()
    } catch (error) {

        console.error(error);
        res.status(500).json({ error: 'OOOps something went wrong!' });
    }
});