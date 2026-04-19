const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], default: 'Pending' },
    diagnosis: { type: String },
    prescription: { type: String },
    notes: { type: String },
    recommendedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    paymentMethod: { type: String, enum: ['Card', 'UPI', 'PayPal', 'Cash'], default: 'Cash' },
    paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
