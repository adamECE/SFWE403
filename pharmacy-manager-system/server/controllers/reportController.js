const asyncHandler = require("express-async-handler");
var dotenv = require("dotenv");
dotenv.config({ path: "../config/.env" });
const Purchase = require("../models/purchase");

exports.generateFinanceReport = asyncHandler(async (req, res, next) => {
    try {
      console.log("0")
      const { startDate, endDate } = req.body;
      console.log("1")
      if (!startDate | !endDate) {
        console.log("2")
        res.status(400).json({ error: "Please add all Fields" });
        return;
      }
      console.log("3")
      const purchaseData = await Purchase.find({timestamp:{$gte:new Date(startDate),$lt:new Date(endDate)}}); //attempt to find purchase data
      //const purchaseData = 1;
      //const purchaseData = await Purchase.find({timestamp:{$gte:ISODate("2023-10-12"),$lt:ISODate("2023-12-12")}}); //attempt to find purchase data
      console.log("4")
      res.status(200).json(purchaseData);
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "OOOps something went wrong!" });
    }
  });
