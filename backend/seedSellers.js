const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// Standardize to relative paths for execution from backend/
const User = require('./models/User');
const Product = require('./models/Product');
require('dotenv').config();

const seedSellers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        // Seller Data
        const sellers = [
            {
                name: "Alpha Pet Supplies",
                email: "alpha@petco.com",
                password: "password123",
                role: "seller",
                eligibilityInfo: {
                    storeName: "Alpha Boutique",
                    licenseNumber: "VERIFIED-001",
                    storeAddress: "Mumbai, Maharashtra"
                }
            },
            {
                name: "Green Paws Wellness",
                email: "green@petco.com",
                password: "password123",
                role: "seller",
                eligibilityInfo: {
                    storeName: "Eco Paws",
                    licenseNumber: "VERIFIED-002",
                    storeAddress: "Bangalore, Karnataka"
                }
            }
        ];

        console.log("Seeding Sellers...");
        const createdSellers = [];
        for (const s of sellers) {
            const existing = await User.findOne({ email: s.email });
            if (!existing) {
                const hashedPassword = await bcrypt.hash(s.password, 10);
                const newUser = await User.create({ ...s, password: hashedPassword });
                createdSellers.push(newUser);
                console.log(`Created Seller: ${s.email}`);
            } else {
                createdSellers.push(existing);
                console.log(`Seller already exists: ${s.email}`);
            }
        }

        const products = await Product.find({});
        if (products.length > 0) {
            console.log(`\nAssigning ${products.length} products to sellers...`);
            for (let i = 0; i < products.length; i++) {
                const seller = createdSellers[i % createdSellers.length];
                products[i].sellerId = seller._id;
                await products[i].save();
            }
            console.log("Products assigned successfully.");
        }

        console.log("\n--- SELLER CREDENTIALS ---");
        createdSellers.forEach((s) => {
            console.log(`Email: ${s.email} | Password: password123 | ID: ${s._id}`);
        });

        process.exit(0);
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
};

seedSellers();
