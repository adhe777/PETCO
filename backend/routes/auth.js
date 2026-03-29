const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
    try {
        const { 
            name, email, password, role, 
            phone, specialization, qualification, experience, clinicAddress, licenseNumber 
        } = req.body;
        
        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered. Please login or use a different email.' });
        }

        // Prevent public registration of admin accounts
        if (role === 'admin' || role === 'Administrator') {
            return res.status(403).json({ error: 'Direct admin registration is restricted. Please contact system owner.' });
        }

        let isApproved = true;
        if (role === 'doctor' || role === 'Veterinarian') {
            isApproved = false;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            phone,
            specialization,
            qualification,
            experience,
            clinicAddress,
            isApproved,
            eligibilityInfo: {
                licenseNumber
            }
        });
        await user.save();
        console.log(`User registered: ${email} (${role})`);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({ error: 'Server error during registration. Please try again later.' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if ((user.role === 'doctor' || user.role === 'Veterinarian') && !user.isApproved) {
            return res.status(403).json({ message: 'Your doctor account is pending admin approval.' });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all approved doctors for public booking
router.get('/doctors', async (req, res) => {
    try {
        const doctors = await User.find({ 
            role: { $in: ['doctor', 'Veterinarian'] }, 
            isApproved: true 
        }).select('-password');
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
