const mongoose = require("mongoose");
//The system will keep an activity log (i.e., pharmacist name, prescription number, patient name, date, time, type and quantity of drugs) for all prescriptions filled.

const activityLogSchema = new mongoose.Schema({
  pharmacistEmail: { type: String, required: true },
  pharmacistName: { type: String, required: true },
  prescriptionID: { type: String, required: true },
  patientName: { type: String, required: true },
  patientEmail: { type: String, required: true },
  itemType: {
    type: String,
    enum: ["prescription", "over-the-counter"],
    required: true,
    default: "prescription",
  },
  quantity: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const inventoryUpdateLogSchema = new mongoose.Schema({
  staffEmail: { type: String, required: true },
  staffName: { type: String, required: true },
  medicationID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Inventory", // Reference to the medication in the Inventory collection
    required: true,
  },
  batch: {
    barcode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    quantity: { type: Number, required: true },
  },
  itemType: {
    type: String,
    enum: ["prescription", "over-the-counter"],
    required: true,
  },
  actionType: {
    type: String,
    enum: ["added", "removed"],
    required: true,
  },

  timestamp: { type: Date, default: Date.now },
});

const PurchaseLogSchema = new mongoose.Schema({
  staffEmail: { type: String, required: true },
  clientEmail: { type: String, required: true },
  receiptID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Purchase", // Reference to the medication in the Inventory collection
    required: true,
  },

  totalAmount: {
    type: Number,
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});

const authLogSchema = new mongoose.Schema({
  staffEmail: { type: String, required: true },
  staffName: { type: String, required: true },
  actionType: {
    type: String,
    enum: ["login", "logout"],
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});

module.exports = {
  PrescriptionLog: mongoose.model("PrescriptionLog", activityLogSchema),
  InventoryUpdateLog: mongoose.model(
    "InventoryUpdateLog",
    inventoryUpdateLogSchema
  ),
  AuthLog: mongoose.model("AuthLog", authLogSchema),
  PurchaseLog: mongoose.model("PurchaseLog", PurchaseLogSchema),
};
