const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Appointment = require('../models/Appointment');
const Order = require('../models/Order');
const Notification = require('../models/Notification');
const { auth, authorizeRoles } = require('../middleware/authMiddleware');

// Dashboard Stats
router.get('/stats', auth, authorizeRoles('admin'), async (req, res) => {
    try {
        const usersCount = await User.countDocuments({ role: { $in: ['user', 'Pet Parent'] } });
        const doctorsCount = await User.countDocuments({ role: { $in: ['doctor', 'Veterinarian'] } });
        const productsCount = await Product.countDocuments();
        const ordersCount = await Order.countDocuments();
        const cancelRequests = await Order.countDocuments({ cancellationStatus: 'Requested' });
        
        res.json({ users: usersCount, doctors: doctorsCount, products: productsCount, orders: ordersCount, cancelRequests });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all orders (for admin)
router.get('/orders', auth, authorizeRoles('admin'), async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'name email')
            .populate('products.productId', 'name price image')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get cancellation requests pending admin action
router.get('/cancel-requests', auth, authorizeRoles('admin'), async (req, res) => {
    try {
        const orders = await Order.find({ cancellationStatus: 'Requested' })
            .populate('userId', 'name email')
            .populate('products.productId', 'name price image')
            .sort({ updatedAt: -1 });
        res.json(orders);
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

// Delete a user
router.delete('/users/:id', auth, authorizeRoles('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || user.role === 'admin' || user.role === 'Administrator') {
            return res.status(403).json({ message: 'Cannot delete admin users' });
        }
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted securely' });
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

// Approve or Reject Doctor -- also sends notification to user
router.put('/approve-doctor/:id', auth, authorizeRoles('admin'), async (req, res) => {
    try {
        const { action } = req.body;
        const doctor = await User.findById(req.params.id);
        
        if (!doctor || (doctor.role !== 'doctor' && doctor.role !== 'Veterinarian')) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        
        if (action === 'approve') {
            doctor.isApproved = true;
            await doctor.save();
            await Notification.create({
                userId: doctor._id,
                type: 'doctor',
                title: '🎉 Account Approved!',
                message: `Congratulations Dr. ${doctor.name}! Your veterinarian account has been approved. You can now access your dashboard.`,
                linkTo: '/doctor-dashboard'
            });
            return res.json({ message: 'Doctor approved successfully', doctor });
        } else if (action === 'reject') {
            await Notification.create({
                userId: doctor._id,
                type: 'doctor',
                title: '❌ Account Application Rejected',
                message: 'Unfortunately, your veterinarian account application has been rejected. Please contact support for more information.',
                linkTo: '/profile'
            });
            await User.findByIdAndDelete(req.params.id);
            return res.json({ message: 'Doctor rejected and removed' });
        }
        
        res.status(400).json({ message: 'Invalid action' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
