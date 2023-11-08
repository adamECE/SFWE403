const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  doctorName: {
    type: String,
    required: true,
  },
  medicationID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Inventory", // Reference to the medication in the Inventory collection
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  dosage: {
    type: String,
    required: true,
  },
  deliveredBy: {
    type: String,
    enum: ["patient", "doctor's office"],
    default: "patient",
  },
  refillPolicy: {
    refills: {
      type: Number,
      default: 0,
      required: true,
    },
    allowRefill: {
      type: Boolean,
      default: false,
      required: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },

  filledInfo: [
    {
      filledDate: {
        type: Date,
        default: null,
      },
      batchInfo: {
        barcode: {
          type: String,
          default: null,
        },
        expirationDate: {
          type: Date,
          default: null,
        },
      },
      pickedUpInfo: {
        status: {
          type: Boolean,
          default: false,
        },
        date: {
          type: Date,
          default: null,
        },
      },
    },
  ],

  isValid: {
    type: Boolean,
    default: true,
  },
});

module.exports = prescriptionSchema;
