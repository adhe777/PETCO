const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true }, // food, toys, health
    description: { type: String },
    image: { type: String },
    stock: { type: Number, default: 0 },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: { type: String },
        rating: { type: Number },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
