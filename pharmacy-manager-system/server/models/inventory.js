const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    category: {
        type: String,
        enum: ['prescription', 'over-the-counter'],
        required: true,
    },
    // manufacturer: { type: String },
    price: { type: Number },
    quantityInStock: { type: Number, default: 0 },
    manufacturer: { type: String },
    expirationDate: { type: Date },
    barcode: { type: String },
    location: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },

    // batches: {
    //     [
    //         {
    //         batchID:{ type: Number },
    //         quantityInStock: { type: Number, default: 0 },
    //         expirationDate: { type: Date },
    //         barcode: { type: String },
    //         location: { type: String },
    //         created_at: { type: Date, default: Date.now },
    //         updated_at: { type: Date, default: Date.now },

    //     }
    // ]

    // }
});

module.exports = mongoose.model('Inventory', inventorySchema);