//log middleware goes here

//this file contains the middleware functions to log transaction activities
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const PrescritpionLog = require("../models/activityLog");
var dotenv = require("dotenv");
dotenv.config({ path: "../config/.env" });
const { ROLES } = require("../config/pharmacy0x2Const");

exports.logPrescription = asyncHandler(async (req, res, next) => {
  console.log(req.logger);

  const log_prescription = new PrescritpionLog({
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
