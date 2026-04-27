const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

// Load environment variables dynamically
dotenv.config();

// Connect to MongoDB Database
connectDB();

const importAdmin = async () => {
    try {
        // Find existing admin to prevent duplicate seeding
        const adminExists = await User.findOne({ email: 'admin@system.com' });

        if (adminExists) {
            console.log('Admin account already exists! Email: admin@system.com');
            process.exit();
        }

        const adminUser = new User({
            name: 'Master Admin',
            email: 'admin@system.com',
            password: 'adminpassword',
            role: 'admin',
        });

        await adminUser.save();

        console.log('✅ Admin User Successfully Seeded!');
        console.log('=> Login Email: admin@system.com');
        console.log('=> Login Password: adminpassword');
        
        process.exit();
    } catch (error) {
        console.error(`❌ Error Seeding Admin: ${error.message}`);
        process.exit(1);
    }
};

importAdmin();
