const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, authorizeRoles } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Get all products (Public)
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().populate('sellerId', 'name storeName');
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get products by seller (Protected)
router.get('/seller/:sellerId', async (req, res) => {
    try {
        const products = await Product.find({ sellerId: req.params.sellerId });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add new product (Admin Only)
router.post('/', auth, authorizeRoles('admin'), upload.single('image'), async (req, res) => {
    try {
        const productData = { ...req.body };
        if (req.file) {
            productData.image = `http://localhost:5001/uploads/${req.file.filename}`; // Local URL
        }
        const product = new Product(productData);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update product (Admin Only)
router.put('/:id', auth, authorizeRoles('admin'), upload.single('image'), async (req, res) => {
    try {
        const productData = { ...req.body };
        if (req.file) {
            productData.image = `http://localhost:5001/uploads/${req.file.filename}`; // Local URL
        }
        const product = await Product.findByIdAndUpdate(req.params.id, productData, { new: true });
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

// Submit a rating/review
router.post('/:id/rate', auth, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const User = require('../models/User');
        const reviewer = await User.findById(req.user.id);

        const review = {
            user: req.user.id,
            name: reviewer ? reviewer.name : "Anonymous User",
            rating: Number(rating),
            comment: comment || ""
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();
        res.json({ message: 'Review submitted', rating: product.rating, numReviews: product.numReviews, reviews: product.reviews });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
