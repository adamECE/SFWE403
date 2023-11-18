const asyncHandler = require("express-async-handler");
const Order = require("../models/order");
const User = require("../models/user");
const { ROLES } = require("../config/pharmacy0x2Const");
var dotenv = require("dotenv");
dotenv.config({ path: "../config/.env" });
const Purchase = require("../models/purchase");
const { jar } = require("request");

exports.generateFinanceReport = asyncHandler(async (req, res, next) => {
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
      res.status(200).json({ message: "Payment Completed Successfully!" });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "OOOps something went wrong!" });
    }
  });
  exports.getFinancialReports = asyncHandler(async (req, res, next) => {
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
        res.status(200).json({ message: "Payment Completed Successfully!" });
        return;
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "OOOps something went wrong!" });
      }
    });
  