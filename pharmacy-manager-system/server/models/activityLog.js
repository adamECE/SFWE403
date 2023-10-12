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

module.exports = mongoose.model("PrescriptionLog", activityLogSchema);
