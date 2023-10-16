//log middleware goes here

//this file contains the middleware functions to log transaction activities

const asyncHandler = require("express-async-handler");
const { PrescriptionLog, InventoryUpdateLog } = require("../models/activityLog");
var dotenv = require("dotenv");
dotenv.config({ path: "../config/.env" });
const { ROLES } = require("../config/pharmacy0x2Const");

exports.logPrescription = asyncHandler(async(req, res, next) => {
    console.log(req.logger);

    const log_prescription = new PrescriptionLog({
        pharmacistEmail: req.logger.pharmacistEmail,
        pharmacistName: req.logger.pharmacistName,
        prescriptionID: req.logger.prescriptionID,
        patientName: req.logger.patientName,
        patientEmail: req.logger.patientEmail,
        itemType: req.logger.itemType,
        quantity: req.logger.quantity,
    });
    log_prescription.save();
    res.status(200).json({ message: "Your Prescription has been filled" });

});


exports.logInventoryUpdate = asyncHandler(async(req, res, next) => {

    const log_invRemoval = new InventoryUpdateLog({
        staffEmail: req.invLogger.staffEmail,
        staffName: req.invLogger.staffName,
        medicationID: req.invLogger.medicationID,
        batch: req.invLogger.batch,
        itemType: req.invLogger.itemType,
        actionType: req.invLogger.actionType,
    });
    log_invRemoval.save();
    if (req.invLogger.itemType == "removed")
        res.status(200).json({ message: "expired batch removed from inventory" });
    else
        return res.status(201).json({ message: "New Batch added to inventory" });
});