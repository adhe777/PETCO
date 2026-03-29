const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, authorizeRoles } = require('../middleware/authMiddleware');

// Get all products (Public)
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().populate('sellerId', 'name storeName');
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get products by seller (Protected - will add middleware later if needed)
router.get('/seller/:sellerId', async (req, res) => {
    try {
        const products = await Product.find({ sellerId: req.params.sellerId });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add new product (Admin Only)
router.post('/', auth, authorizeRoles('admin'), async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update product (Admin Only)
router.put('/:id', auth, authorizeRoles('admin'), async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete product (Admin Only)
router.delete('/:id', auth, authorizeRoles('admin'), async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
