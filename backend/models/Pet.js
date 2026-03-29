const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    breed: { type: String, required: true },
    category: { type: String, required: true }, // dog, cat, etc.
    age: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: String },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['available', 'sold'], default: 'available' },
}, { timestamps: true });

module.exports = mongoose.model('Pet', PetSchema);
