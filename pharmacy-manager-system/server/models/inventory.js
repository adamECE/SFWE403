const mongoose = require('mongoose');
const batchSchema = new mongoose.Schema({
    quantity: { type: Number, default: 0, required: true },
    expirationDate: { type: Date, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    //the auto generated _id is the barcode

});
const inventorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    category: {
        type: String,
        enum: ['prescription', 'over-the-counter'],
        required: true,
    },
    manufacturer: { type: String },
    price: { type: Number },
    quantityInStock: { type: Number, default: 0 },
    location: { type: String },
    batches: [batchSchema],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }


});
module.exports = batchSchema
module.exports = mongoose.model('Inventory', inventorySchema);