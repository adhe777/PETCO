const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
    shippingAddress: { type: String, required: true },
    paymentMethod: { type: String, enum: ['Card', 'UPI', 'PayPal', 'Cash on Delivery'], default: 'Cash on Delivery' },
    paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
    cancellationReason: { type: String },
    cancellationStatus: { type: String, enum: ['None', 'Requested', 'Approved', 'Rejected'], default: 'None' },
    cancellationNote: { type: String },
    cancellationRejectionReason: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
