const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['order', 'appointment', 'doctor', 'system'], default: 'system' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    linkTo: { type: String, default: '/' }
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
