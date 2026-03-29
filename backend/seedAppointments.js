const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Appointment = require('./models/Appointment');
const User = require('./models/User');

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const hashedPassword = await bcrypt.hash('password123', 10);

        let demoUser = await User.findOne({ email: 'demo@petco.com' });
        if (!demoUser) {
            demoUser = new User({
                name: 'Demo User',
                email: 'demo@petco.com',
                password: hashedPassword,
                role: 'Pet Parent'
            });
        } else {
            demoUser.password = hashedPassword;
        }
        await demoUser.save();

        const doctorsList = [
            { name: 'Dr. Sarah Jenkins', email: 'sarah.vet@petco.com', spec: 'Canine Cardiology', exp: 12 },
            { name: 'Dr. Anjali Nair', email: 'anjali@petco.com', spec: 'Veterinary Surgeon', exp: 12 },
            { name: 'Dr. Rahul Krishnan', email: 'rahul@petco.com', spec: 'Pet Nutritionist', exp: 8 },
            { name: 'Dr. Lakshmi Menon', email: 'lakshmi@petco.com', spec: 'Behavioral Specialist', exp: 15 }
        ];

        let createdDoctors = [];

        for (const docInfo of doctorsList) {
            let doc = await User.findOne({ email: docInfo.email });
            if (!doc) {
                doc = new User({
                    name: docInfo.name,
                    email: docInfo.email,
                    password: hashedPassword,
                    role: 'Veterinarian',
                    specialization: docInfo.spec,
                    experience: docInfo.exp
                });
            } else {
                doc.password = hashedPassword;
                doc.specialization = docInfo.spec;
                doc.experience = docInfo.exp;
            }
            await doc.save();
            createdDoctors.push(doc);
        }

        const doctor = createdDoctors[0]; // Sarah Jenkins for appointments

        const apt = new Appointment({
            userId: demoUser._id,
            doctorId: doctor._id,
            date: new Date('2026-04-15'),
            time: '14:30',
            status: 'Confirmed',
            notes: 'Routine heart checkup for max.'
        });

        await apt.save();

        const apt2 = new Appointment({
            userId: demoUser._id,
            doctorId: doctor._id,
            date: new Date('2026-02-28'),
            time: '09:00',
            status: 'Completed',
            diagnosis: 'Mild arrhythmia detected, but nothing life threatening. Monitor diet.',
            prescription: 'CardioCare 10mg once daily with food. High-protein, low-sodium diet recommended.',
            notes: 'Follow up on previous visit'
        });

        await apt2.save();

        console.log('Appointments Seeded Successfully');
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

seed();
