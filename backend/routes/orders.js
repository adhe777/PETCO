const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Notification = require('../models/Notification');

// Get orders for a specific seller
router.get('/seller/:sellerId', async (req, res) => {
    try {
        const orders = await Order.find({
            'products.sellerId': req.params.sellerId
        }).populate('products.productId').populate('userId', 'name email');

        const sellerOrders = orders.map(order => {
            const orderObj = order.toObject();
            orderObj.products = orderObj.products.filter(p => p.sellerId.toString() === req.params.sellerId);
            return orderObj;
        });

        res.json(sellerOrders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get orders for a specific user
router.get('/user/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId })
            .populate('products.productId', 'name image price')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update order status
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        
        // Notify user about status update
        if (order) {
            await Notification.create({
                userId: order.userId,
                type: 'order',
                title: `Order ${status}`,
                message: `Your order #${order._id.toString().slice(-6).toUpperCase()} has been updated to: ${status}.`,
                linkTo: '/orders'
            });
        }
        res.json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Create new order
router.post('/', async (req, res) => {
    try {
        const { userId, products, totalAmount, shippingAddress, paymentMethod } = req.body;
        const finalShippingAddress = shippingAddress || "Default Secure Drop-off Point";

        const order = new Order({
            userId,
            products,
            totalAmount,
            shippingAddress: finalShippingAddress,
            paymentMethod: paymentMethod || 'Cash on Delivery',
            status: 'Pending'
        });

        await order.save();

        // Notify user
        await Notification.create({
            userId,
            type: 'order',
            title: '🎉 Order Placed Successfully!',
            message: `Your order #${order._id.toString().slice(-6).toUpperCase()} for ₹${totalAmount.toFixed(2)} has been placed.`,
            linkTo: '/orders'
        });

        try {
            const updateFields = { savedAddress: finalShippingAddress };
            if (req.body.phone) updateFields.phone = req.body.phone;
            if (req.body.city) updateFields.city = req.body.city;
            if (req.body.pincode) updateFields.pincode = req.body.pincode;
            await require('../models/User').findByIdAndUpdate(userId, updateFields);
        } catch (updateErr) {
            console.error('Failed to auto-save address to profile:', updateErr.message);
        }

        res.status(201).json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Request cancellation (user side - sets to Requested, does NOT cancel yet)
router.patch('/:id/request-cancel', async (req, res) => {
    try {
        const { reason } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ message: 'Order not found' });
        if (order.status !== 'Pending' && order.status !== 'Processing') {
            return res.status(400).json({ message: 'Order cannot be cancelled at this stage (must be Pending or Processing)' });
        }
        if (order.cancellationStatus === 'Requested') {
            return res.status(400).json({ message: 'Cancellation already requested for this order' });
        }

        order.cancellationStatus = 'Requested';
        order.cancellationNote = reason || 'No reason provided';
        await order.save();

        // Notify user
        await Notification.create({
            userId: order.userId,
            type: 'order',
            title: '📋 Cancellation Request Submitted',
            message: `Your cancellation request for order #${order._id.toString().slice(-6).toUpperCase()} is under review. Admin will respond shortly.`,
            linkTo: '/orders'
        });

        res.json({ message: 'Cancellation request submitted successfully', order });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Approve cancellation
router.patch('/:id/cancel-approve', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.status = 'Cancelled';
        order.cancellationStatus = 'Approved';
        await order.save();

        await Notification.create({
            userId: order.userId,
            type: 'order',
            title: '✅ Order Cancellation Approved',
            message: `Your cancellation request for order #${order._id.toString().slice(-6).toUpperCase()} has been approved. Your order is now cancelled.`,
            linkTo: '/orders'
        });

        res.json({ message: 'Order cancellation approved', order });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Reject cancellation
router.patch('/:id/cancel-reject', async (req, res) => {
    try {
        const { rejectionReason } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.cancellationStatus = 'Rejected';
        order.cancellationRejectionReason = rejectionReason || 'Your order cannot be cancelled at this time.';
        await order.save();

        await Notification.create({
            userId: order.userId,
            type: 'order',
            title: '❌ Cancellation Request Rejected',
            message: `Your cancellation request for order #${order._id.toString().slice(-6).toUpperCase()} was rejected. Reason: ${order.cancellationRejectionReason}`,
            linkTo: '/orders'
        });

        res.json({ message: 'Cancellation request rejected', order });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Legacy cancel route (kept for compatibility)
router.patch('/:id/cancel', async (req, res) => {
    try {
        const { reason } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        order.status = 'Cancelled';
        order.cancellationReason = reason || 'No reason provided';
        await order.save();
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
