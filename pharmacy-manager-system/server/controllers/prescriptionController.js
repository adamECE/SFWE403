const asyncHandler = require("express-async-handler");
const Order = require("../models/order");
const User = require("../models/user");
const { ROLES } = require("../config/pharmacy0x2Const");
var dotenv = require("dotenv");
dotenv.config({ path: "../config/.env" });
const Inventory = require("../models/inventory");

//fill user's prescritption
exports.fillPrescription = asyncHandler(async (req, res, next) => {
  try {
    // Extract item details from the request body
    const { userID, medicationID, barcode, prescriptionID } = req.body;
    //check if all the required inputs are given
    if (!userID || !medicationID || !barcode || !prescriptionID) {
      res.status(400).json({ error: "Please add all Fields" });
      return;
    }
    /*
                    check if user exists and if it is patient
                    check if prescriptionID is on user's prescription List
                    check if prescription is still valid to be filled(still has refillis left and due date is still valid)
                    check if medicationID is in the prescription
                    check if medicationID is on the inventory
                    check if batchID is on the medication's batches
                    check if batch is not expired
                    check if batch has enough medication to fill the prescription
                    check if prescription requires refill, if so, decrease the number of refills
                    update the prescription batchInfo field
                    update the filled Date
                    update the inventory and batch by decreasing the quantity
                    save  user data updates
                    save inventory data updates
                    */

    const userData = await User.findById(userID); //attempt to find user
    if (!userData) {
      //check if user was found
      res.status(404).json({ error: "User not found in database" });
      return;
    }
    if (userData.role != ROLES.PATIENT) {
      //check if user is not a patient
      res.status(401).json({ error: "User is not a patient" });
      return;
    }

    const prescriptionToBeFilled = userData.prescriptions.find(function (prs) {
      return prs._id == prescriptionID;
    });
    const prescriptionToBeFilledIndex = userData.prescriptions.findIndex(
      function (prs) {
        return prs._id == prescriptionID;
      }
    );
    if (!prescriptionToBeFilled) {
      //check if prescription found was found
      res
        .status(404)
        .json({ error: "Prescription not found on user prescription list" });
      return;
    }

    if (prescriptionToBeFilled.medicationID != medicationID) {
      //check if prescription found was found
      res
        .status(404)
        .json({ error: "medication not found on this Prescription" });
      return;
    }
    if (!prescriptionToBeFilled.isValid) {
      //check if prescription still valid for fill
      res.status(401).json({ error: "Prescription not valid to be filled" });
      return;
    }
    if (
      prescriptionToBeFilled.refillPolicy.allowRefill &&
      prescriptionToBeFilled.refillPolicy.refills == 0
    ) {
      //check if prescription still valid for fill
      res
        .status(401)
        .json({ error: "Prescription does not have refills left" });
      return;
    }
    if (
      (prescriptionToBeFilled.refillPolicy.allowRefill &&
        prescriptionToBeFilled.refillPolicy.refills > 0 &&
        prescriptionToBeFilled.refillPolicy.dueDate < new Date()) ||
      prescriptionToBeFilled.refillPolicy.dueDate < new Date()
    ) {
      //check if prescription still valid for fill
      res.status(401).json({ error: "Prescription has expired" });
      return;
    }

    const inventoryItem = await Inventory.findById(medicationID);
    if (!inventoryItem) {
      //check if medication is in the inventory
      res.status(404).json({ error: "Medication not found in inventory" });
      return;
    }
    const selectedBatch = inventoryItem.batches.find(function (btc) {
      return btc._id == barcode;
    });
    const selectedBatchIndex = inventoryItem.batches.findIndex(function (btc) {
      return btc._id == barcode;
    });

    if (!selectedBatch) {
      res
        .status(404)
        .json({ error: "Batch not found in Medication inventory" });
      return;
    }
    if (selectedBatch.expirationDate < new Date()) {
      res.status(401).json({ error: "Selected Medication Batch has expired," });
      return;
    }
    if (selectedBatch.quantity < prescriptionToBeFilled.quantity) {
      res.status(401).json({
        error:
          "Selected Batch does not have engouh medication to fill this prescription",
      });
      return;
    }
    if (prescriptionToBeFilled.refillPolicy.allowRefill) {
      if (
        prescriptionToBeFilled.refillPolicy.refills >= 1 &&
        prescriptionToBeFilled.filledInfo.length != 0
      )
        prescriptionToBeFilled.refillPolicy.refills -= 1;
      if (prescriptionToBeFilled.refillPolicy.refills == 0) {
        prescriptionToBeFilled.refillPolicy.allowRefill = false;
        prescriptionToBeFilled.isValid = false;
      }
    } else if (
      !prescriptionToBeFilled.refillPolicy.allowRefill ||
      prescriptionToBeFilled.refillPolicy.dueDate <= new Date()
    ) {
      prescriptionToBeFilled.isValid = false;
    }
    prescriptionToBeFilled.filledInfo.push({
      filledDate: new Date(),
      batchInfo: {
        barcode: barcode,
        expirationDate: selectedBatch.expirationDate,
      },
    });
    selectedBatch.quantity -= prescriptionToBeFilled.quantity;
    selectedBatch.updated_at = new Date();
    inventoryItem.quantityInStock -= prescriptionToBeFilled.quantity;
    inventoryItem.updated_at = new Date();
    inventoryItem.batches[selectedBatchIndex] = selectedBatch; //save bacth changes
    userData.prescriptions[prescriptionToBeFilledIndex] =
      prescriptionToBeFilled; //save prescription changes
    inventoryItem.save(); //save inventory changes
    userData.save(); // save user info changes

    const pharmacistName = await User.findOne({ email: req.user.email }).select(
      "firstName lastName"
    );
    req.logger = {
      // record the following to the tracked on logger: pharmacist name, prescription number, patient name, date, time, type and quantity of drugs
      pharmacistEmail: req.user.email,
      pharmacistName: `${pharmacistName.firstName} ${pharmacistName.lastName}`,
      prescriptionID: prescriptionID,
      patientName: `${userData.firstName} ${userData.lastName}`,
      patientEmail: userData.email,
      itemType: "prescription",
      quantity: prescriptionToBeFilled.quantity,
    };
    next(); //go to next middleware to log this action
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OOOps something went wrong!" });
  }
});
