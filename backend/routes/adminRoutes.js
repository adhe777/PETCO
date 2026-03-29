const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Appointment = require('../models/Appointment');
const Order = require('../models/Order'); // might exist, if not we ignore or create mock
const { auth, authorizeRoles } = require('../middleware/authMiddleware');

// Dashboard Stats
router.get('/stats', auth, authorizeRoles('admin'), async (req, res) => {
    try {
        const usersCount = await User.countDocuments({ role: { $in: ['user', 'Pet Parent'] } });
        const doctorsCount = await User.countDocuments({ role: { $in: ['doctor', 'Veterinarian'] } });
        const productsCount = await Product.countDocuments();
        
        let ordersCount = 0;
        try {
           if (Order) ordersCount = await Order.countDocuments();
        } catch(e) {} // Ignore if Order model doesn't exist yet
        
        res.json({ users: usersCount, doctors: doctorsCount, products: productsCount, orders: ordersCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all users
router.get('/users', auth, authorizeRoles('admin'), async (req, res) => {
    try {
        const users = await User.find({ role: { $nin: ['admin', 'Administrator'] } }).select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all doctors (for admin management)
router.get('/doctors', auth, authorizeRoles('admin'), async (req, res) => {
    try {
        const doctors = await User.find({ role: { $in: ['doctor', 'Veterinarian'] } }).select('-password');
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Approve or Reject Doctor
router.put('/approve-doctor/:id', auth, authorizeRoles('admin'), async (req, res) => {
    try {
        const { action } = req.body; // 'approve' or 'reject'
        const doctor = await User.findById(req.params.id);
        
        if (!doctor || (doctor.role !== 'doctor' && doctor.role !== 'Veterinarian')) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        
        if (action === 'approve') {
            doctor.isApproved = true;
            await doctor.save();
            return res.json({ message: 'Doctor approved successfully', doctor });
        } else if (action === 'reject') {
            await User.findByIdAndDelete(req.params.id);
            return res.json({ message: 'Doctor rejected and removed' });
        }
        
        res.status(400).json({ message: 'Invalid action' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
