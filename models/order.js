const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    "user_id": {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref = 'User'
    },
    "order_date": {
        type: mongoose.SchemaTypes.Date,
        required: true
    },
    "items": [
        {
            "productId": {
                type: mongoose.SchemaTypes.ObjectId,
                required: true,
                ref: 'Product'
            },
            "quantity": {
                type: mongoose.SchemaTypes.Number,
                required: true
            }
        }
    ]
});


const orderModel = mongoose.model('Order', orderSchema);

module.exports = orderModel;