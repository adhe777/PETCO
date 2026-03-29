const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'doctor', 'Pet Parent', 'Veterinarian', 'Administrator'], default: 'user' },
    avatar: { type: String, default: '' },
    specialization: { type: String }, // For doctors
    experience: { type: Number }, // For doctors
    phone: { type: String },
    qualification: { type: String },
    clinicAddress: { type: String },
    isApproved: { type: Boolean, default: false },
    eligibilityInfo: {
        licenseNumber: { type: String },
        storeName: { type: String },
        storeAddress: { type: String }
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
