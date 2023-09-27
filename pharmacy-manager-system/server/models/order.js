const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  medication: {
    type: Schema.Types.ObjectId,
    ref: "Inventory", // Reference to the medication in the Inventory collection
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  supplier: {
    type: String,
    required: true,
  },
  orderDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  receptionDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["placed", "received", "cancelled", "in progress"],
    default: "placed",
  },
});

module.exports = mongoose.model("Order", orderSchema);
