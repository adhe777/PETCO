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
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
