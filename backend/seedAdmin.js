const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        const adminEmail = 'admin@petco.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('Admin already exists. Updating password...');
            existingAdmin.password = await bcrypt.hash('admin123', 10);
            await existingAdmin.save();
        } else {
            console.log('Creating new Admin account...');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const admin = new User({
                name: 'System Administrator',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                eligibilityInfo: {
                    storeName: 'PETCO Main Store',
                    storeAddress: 'Kochi, Kerala',
                    licenseNumber: 'PETCO-ADMIN-001'
                }
            });
            await admin.save();
        }

        console.log('Admin seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seedAdmin();
