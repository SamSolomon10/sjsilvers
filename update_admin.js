import mongoose from 'mongoose';
import User from './backend/models/User.js';
import dotenv from 'dotenv';
dotenv.config();

// CHANGE THIS EMAIL TO YOUR LOGIN EMAIL
const TARGET_EMAIL = 'samsolomon@email.com';

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to DB');
        const user = await User.findOneAndUpdate(
            { email: TARGET_EMAIL },
            { role: 'admin' },
            { new: true }
        );
        if (user) {
            console.log(`Success! User ${user.email} is now an ${user.role}.`);
        } else {
            console.log(`User not found with email: ${TARGET_EMAIL}`);
        }
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
