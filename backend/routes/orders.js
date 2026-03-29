const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Get orders for a specific seller
router.get('/seller/:sellerId', async (req, res) => {
    try {
        // Find orders that contain at least one product from this seller
        const orders = await Order.find({
            'products.sellerId': req.params.sellerId
        }).populate('products.productId').populate('userId', 'name email');

        // Filter product items in each order to only show those belonging to the seller
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
        const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
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
        res.json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Create new order
router.post('/', async (req, res) => {
    try {
        const { userId, products, totalAmount, shippingAddress } = req.body;
        
        // Basic validation or default shipping if not provided
        const finalShippingAddress = shippingAddress || "Default Secure Drop-off Point";

        const order = new Order({
            userId,
            products,
            totalAmount,
            shippingAddress: finalShippingAddress,
            status: 'Pending'
        });

        await order.save();
        res.status(201).json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
