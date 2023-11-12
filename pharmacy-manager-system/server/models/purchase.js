const mongoose = require('mongoose');
const cardSchema = require('./card')
const purchaseSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  soldBy: {
    type: String,
    required: true,
  },
  soldTo: {
    type: String,
    required: true,
  },

  PrescriptionItems: [
    {
      prescriptionID: {type: String, required: true},
      filledInfoID: {type: String, required: true},
      medicationID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory', // Reference to the medication in the Inventory collection
        required: true,
      },
      name: {type: String, required: true},
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],

  OverTheCounterItems: [
    {
      itemID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory', // Reference to the medication in the Inventory collection
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      barcode: {
        type: String,
        required: true,
      },
    },
  ],

  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['paid', 'unpaid'],
    default: 'unpaid',
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card'],
    default: 'cash',
  },
  card: {
    type: cardSchema,
    required: false
  },
  // receiptNumber: {
  //   type: Number,
  //   unique: true,
  //   required: true,
  // },
  customerSignature: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model('Purchase', purchaseSchema);
